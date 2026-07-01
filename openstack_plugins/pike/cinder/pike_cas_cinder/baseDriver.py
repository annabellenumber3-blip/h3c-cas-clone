from oslo_config import cfg
from oslo_utils import units
from oslo_log import log as logging

from cinder.i18n import _
from cinder import exception
from cinder import context as cindercontext
from cinder.scheduler import rpcapi as scheduler_rpcapi
from cinder.volume import driver
from cinder.volume import volume_types
from cinder.volume.drivers.cas import api
from cinder.volume.drivers.cas import sem
from cinder.volume.drivers.cas import imageops
from cinder.volume.drivers.cas import volumeops
from cinder.volume.drivers.cas import error as cas_error
from castellan import key_manager
import binascii

LOG = logging.getLogger(__name__)

cas_default_opts = [
    cfg.StrOpt('cas_host_ip',
               help='IP address for connecting to cas server.'),
    cfg.StrOpt('cas_host_username',
               help='Username for authenticating with cas server.'),
    cfg.StrOpt('cas_host_password',
               help='Password for authenticating with cas server.'),
    cfg.StrOpt('cas_glance_host',
               help='glance ip address for cas server to operate image.'),
    cfg.IntOpt('cas_glance_port',
               default=9292,
               help='glance port for cas server to operate image.'),
    cfg.StrOpt('cas_rest_protocol',
               default='http',
               help='the name of protocol to use http or https.'),
    cfg.StrOpt('cas_URI_prefix',
               default='/cas/casrs',
               help='the prefix of URL to assemble rest url address.'),
    cfg.IntOpt('cas_api_retry_count',
               default=10,
               help='Number of times cas server API must be '
                    'retried upon connection related issues.'),
    cfg.BoolOpt('cas_image_checksum',
                default=False,
                help='decide whether to caculate checksum whit images in cvm /vms/nova'),
    cfg.BoolOpt('cas_create_continuously_while_switchover',
                default=False,
                help='decide whether to keep volume creating continuously while switchover'),
    cfg.BoolOpt('cas_check_volume_mode',
               default=False,
               help='decide whether to check and update volume mode')
]

cas_backend_opts = [
    cfg.StrOpt('cas_hpName',
               help='hpName for authenticating with cas server.'),
    cfg.ListOpt('cas_clusterName',
               default=[],
               help='the name of cluster with cas server'),
    cfg.StrOpt('cas_volume_format',
               default='qcow2',
               help='the format is used for create or attach a volume.'),
    cfg.StrOpt('cas_volume_mode',
                default='thin',
                help='decide whether to create and write zero a volume.'),
    cfg.StrOpt('cas_pool_type',
               default='fs',
               help='storage pool type supported in cas server.'),
    cfg.BoolOpt('cas_enable_limit',
                default=False,
                help='decide whether to enable resource limit when create volume.'),
    cfg.IntOpt('datastore_min_reserve_capacity',
               default=0,
               help='The capacity is minimum reserved for every datastore.'),
    cfg.IntOpt('datastore_max_reserve_capacity',
               default=300,
               help='The capacity is max reserved for every datastore.'),
    cfg.StrOpt('wipe_disks',
                default=False,
                help='wipe data before delete disk'),
]

CONF = cfg.CONF
CONF.register_opts(cas_default_opts)

class BaseDriver(driver.VolumeDriver):
    
    VERSION = ''
    
    def __init__(self, *args, **kwargs):
        super(BaseDriver, self).__init__(*args, **kwargs)
        self.configuration.append_config_values(cas_backend_opts)
        self._valid_volume_format = ['qcow2','raw']
        self._valid_volume_mode = ['thin','thick', 'zeroing']
        
        self._imageops = None
        self._volumeops = None
        self._glance_port = CONF.cas_glance_port
        self._host_ip = CONF.cas_host_ip
        self._glance_host = CONF.cas_glance_host
        self._pool_type = self.configuration.cas_pool_type
        
        self._hpName = self.configuration.cas_hpName.decode('utf-8')
        self._volume_format = self.configuration.cas_volume_format
        self._volume_mode = self.configuration.cas_volume_mode
        self._enable_limit = self.configuration.cas_enable_limit
        self._datastore_min_reserve_capacity = self.configuration.datastore_min_reserve_capacity
        self._datastore_max_reserve_capacity = self.configuration.datastore_max_reserve_capacity
    
    def do_setup(self, context):
        """Perform validations and establish connection to server.
        :param context: Context information
        """
        LOG.info(_("[cas::] begin to setup driver"))
        
        username = CONF.cas_host_username
        password = CONF.cas_host_password
        uri_prefix = CONF.cas_URI_prefix
        scheme = CONF.cas_rest_protocol
        api_retry_count = CONF.cas_api_retry_count
        http_log_debug = CONF.debug
        check_volume_mode = CONF.cas_check_volume_mode
        host = CONF.host
        enabled_backends = CONF.enabled_backends

        if not (self._host_ip and username and password and self._hpName and self._glance_host):
            raise Exception(_("Must specify cas_host_ip, "
                              "cas_host_username "
                              "cas_host_password "
                              "cas_hpName "
                              "and cas_glance_host to use "
                              "volume_driver=cas.CasDriver"))
        
        if self._volume_format not in ('qcow2','raw'):
            raise Exception(_("volume format is %s, only support qcow2 or raw") % self._volume_format)
        
        if self._volume_mode not in ('thin','thick', 'zeroing'):
            raise Exception(_("volume format is %s, only support thin or thick") % self._volume_mode)
        
        if scheme not in ('http','https'):
            raise Exception(_("rest protocol is %s, only support http or https") % scheme)
        if self._datastore_min_reserve_capacity > self._datastore_max_reserve_capacity:
            raise Exception(_("datastore_min_reserve_capacity:%s is bigger than datastore_max_reserve_capacity:%s")
                            % (self._datastore_min_reserve_capacity,self._datastore_max_reserve_capacity))
        
        self._semObj = sem.CasSem()
        
        _session = api.CasAPISession(self._host_ip,username,password,uri_prefix,api_retry_count,scheme,http_log_debug)
        self._imageops = imageops.CasImageOps(_session)
        self._volumeops = volumeops.CasVolumeOps(_session)
        
        if self._enable_limit:
            self._provisioned_ratio = self.configuration.max_over_subscription_ratio
            self._reserved_percentage = self.configuration.reserved_percentage
            self._reserved_ratio = float(self._reserved_percentage)/100
        
        self._scheduler_rpcapi = scheduler_rpcapi.SchedulerAPI()
        
        LOG.info(_("[cas::] Successfully setup driver: %(driver)s for cinder ") %
                 {'driver': self.__class__.__name__})

        if check_volume_mode:
            hostList = []
            if host and enabled_backends:
                for enabled_backend in enabled_backends:
                    hotsFullname = host+"@"+enabled_backend+"#"+self._hpName+"(CVM"+self._host_ip+")"
                    hostList.append(hotsFullname)
                self.checkAndupdate_volume_mode(self._hpName, hostList)
            else:
                LOG.error("Can not get host(%s) full name" % self._host_ip)
        else:
            LOG.info("Do not check and update volume mode")
            pass


        
    def _get_stats(self):
        data = {'volume_backend_name': "%s(CVM%s)" % (self._hpName,self._host_ip),
                'vendor_name': 'cas',
                'storage_protocol': 'cas',
                'volume_mode': self._valid_volume_mode,
                'volume_format': self._valid_volume_format,
                'multiattach': True}
        storage_resource = self._volumeops.get_storage_resource(self._pool_type,self._hpName,self.configuration.cas_clusterName)
        data.update(storage_resource)
        
        volume_type = set()
        for storagePoolName in storage_resource['storage_pool']:
            if storagePoolName.startswith('_normal_'):
                volume_type.add('normal')
            elif storagePoolName.startswith('_highCapacity_'):
                volume_type.add('highCapacity')
            elif storagePoolName.startswith('_highIO_'):
                volume_type.add('highIO')
            else:
                volume_type = set(['normal','highCapacity','highIO'])
                break
        data['volume_type'] = list(volume_type)
        
        if not self._enable_limit:
            data['total_capacity_gb'] = 'unknown'
        else:
            data['max_over_subscription_ratio'] = self._provisioned_ratio
            data['reserved_percentage'] = self._reserved_percentage
            data['thin_provisioning_support'] = True
        
        return data
        
    def get_volume_stats(self, refresh=False):
        """Obtain status of the volume service.
        :param refresh: Whether to get refreshed information
        """
        LOG.info(_("[cas::] begin to get volume states"))
        if refresh:
            self.driver_stats = self._get_stats()
            
        LOG.info(_("[cas::] success to get volume pool states: %s") % self.driver_stats)

        return self.driver_stats
    
    def query_storage_pool_list(self):
        LOG.info(_("[cas::] query storage pool list"))
        storagePools = self._volumeops.query_storage_pool_list()
        LOG.info(_("[cas::] success to get storage pool list: %s") % storagePools)
        
        return storagePools
    
    def get_datastores_summary(self, *args, **kwargs):
        LOG.info(_("[cas::] query datastores summary"))
        summary = self._volumeops.get_datastores_summary(self._hpName)
        LOG.info(_("[cas::] success to get datastores summary: %s") % summary)
        
        return summary
    
    def _get_resource_limit_spec(self):
        limit_args = {'provisioned_ratio':self._provisioned_ratio,'reserved_ratio': self._reserved_ratio}
        
        if self._datastore_min_reserve_capacity:
            limit_args['datastore_min_reserve_capacity'] = self._datastore_min_reserve_capacity * units.Gi / units.Mi
        
        if self._datastore_max_reserve_capacity:
            limit_args['datastore_max_reserve_capacity'] = self._datastore_max_reserve_capacity * units.Gi / units.Mi
        
        return limit_args
    
    def _get_volume_type_extra_spec(self, type_id, spec_key, default_value=None, possible_values=None):
        if not type_id:
            return default_value
        
        spec_value = volume_types.get_volume_type_extra_specs(type_id,spec_key)
        
        if not spec_value:
            LOG.debug(_("Returning default spec value: %s for spec key: %s.") % (default_value,spec_key))
            return default_value
        
        spec_value = spec_value.split().pop()
        if not possible_values or spec_value in possible_values:
            LOG.debug(_("Returning spec value %s for spec key: %s.") % (spec_value,spec_key))
            return spec_value
        
        LOG.error(_("Invalid spec value: %s specified for spec key: %s.") % (spec_value,spec_key))
        raise cas_error.CasVolumeException()
    
    def _get_volume_encryption_args(self,volume):
        encryptionInfo = {}
        context = volume.obj_context
        volume_type_id = volume['volume_type_id']
        if volume_types.is_encrypted(context,volume_type_id):
            volume_type_encryption = (volume_types.get_volume_type_encryption(context,volume_type_id))
            cipher = volume_type_encryption.cipher
            length = volume_type_encryption.key_size
            cipher_list = cipher.split('-')
            if len(cipher_list) == 3:
                [algorithm,cipher_mode,ivgen] = cipher_list[:]
            else:
                [algorithm,cipher_mode,ivgen] = [None,None,None]
            provider = volume_type_encryption.provider
            control_location = volume_type_encryption.control_location
            encryption_key_id = volume['encryption_key_id']
            key_mgr = key_manager.API(CONF)
            if encryption_key_id:
                encryption_key = key_mgr.get(context,encryption_key_id)
                secret_key = binascii.hexlify(encryption_key.get_encoded()).decode('utf-8')
                encryptionInfo = {'secret_key':secret_key,'encryption_key_id':encryption_key_id,'provider':provider,
                                  'hash':'sha256','cipher_mode':cipher_mode,'algorithm':algorithm,'key_size':length,
                                  'control_location':control_location,'ivgen':ivgen}
        return encryptionInfo
    
    def _get_volume_create_args(self, volume, volume_metadata):
        volume_type_id = volume['volume_type_id']
        volume_format = volume_metadata.get('volume_format',self._volume_format)
        volume_format = self._get_volume_type_extra_spec(volume_type_id,'volume_format',volume_format)
        
        volume_mode = volume_metadata.get('volume_mode',self._volume_mode)
        volume_mode = self._get_volume_type_extra_spec(volume_type_id,'volume_mode',volume_mode)
        
        storageName = volume_metadata.get('location')
        storageName = self._get_volume_type_extra_spec(volume_type_id,'storage_pool',storageName)

        loctype = volume_metadata.get('loctype')
        loctype = self._get_volume_type_extra_spec(volume_type_id, 'loctype', loctype)
        
        volume_type = self._get_volume_type_extra_spec(volume_type_id,'volume_type','any')
        
        volume_size = volume['size'] * units.Gi / units.Mi
        if not self._enable_limit:
            storageName = self._volumeops.check_storage_resource(volume['name'],volume_size,storageName,volume_type, loctype)
        elif self._enable_limit and loctype == 'local':
            LOG.error("Disable resource limit when create local volume")
        else:
            limit_spec = self._get_resource_limit_spec()
            storageName = self._volumeops.get_available_storage(volume_size,self._hpName,storageName,volume_type,limit_spec)
        
        write_zero = 'thick' if volume['multiattach'] == 1 and (volume_mode not in ['thick', 'zeroing']) else volume_mode
        if write_zero == 'thick':
            write_zero = 0
        elif write_zero == 'zeroing':
            write_zero = 1
        else:
            write_zero = 2

        if loctype is not None and loctype == 'local':
            pool_type = 'dir'.split(',')
        else:
            pool_type = self._pool_type.split(',')
        volume_args = {'volume_format':volume_format,'storageName':storageName,'volume_size':volume_size,
                       'write_zero':write_zero,'volume_type':volume_type,'pool_type':pool_type}
        srmGroupName = volume_metadata.get('srmGroupName',None)
        if srmGroupName:
            volume_args['srmGroupName'] = srmGroupName
        if volume.get('encryption_key_id'):
            encryptionInfo = self._get_volume_encryption_args(volume)
            if encryptionInfo:
                volume_args['encryptionInfo'] = encryptionInfo
        
        return volume_args
    
    def _is_wipe_disks(self, uuid, type):
        adminContext = cindercontext.get_admin_context()
        if type == 'snapshot':
            metadata = self.db.snapshot_metadata_get(adminContext.elevated(),uuid)
        elif type == 'volume':
            metadata = self.db.volume_metadata_get(adminContext.elevated(),uuid)
        else:
            return None
        wipe_disks = metadata.get('wipe_disks') if metadata.has_key('wipe_disks') else self.configuration.wipe_disks
        return wipe_disks
    
    def check_for_setup_error(self):
        pass
    
    def create_volume(self, volume):
        """Creates a new volume content:
        
        :param volume: Volume object
        """
        LOG.info(_("[cas::] begin to create volume[%s]") % volume['name'])
        exist = self._volumeops.check_volume_exist(volume['name'])
        if exist:
            LOG.info(_("volume[%s] really exist on the CAS, return success.") % volume['name'])
            return
        
        adminContext = cindercontext.get_admin_context()
        volume_metadata = self.db.volume_metadata_get(adminContext.elevated(),volume['id'])
        
        if volume_metadata.get('alias'):
            self._volumeops.addRecord_volume(volume['name'],volume_metadata['alias'],self._hpName)
        else:
            args = self._get_volume_create_args(volume,volume_metadata)
            self._volumeops.create_volume(volume['name'],args,self._hpName, self.configuration.cas_clusterName)
        
        LOG.info(_("[cas::] success to create volume[%s]") % volume['name'])
    
    def create_cloned_volume(self, volume, src_vref):
        LOG.info(_("[cas::] begin to create volume: %s from volume: %s") % (volume['name'],src_vref['name']))
        adminContext = cindercontext.get_admin_context()
        volume_metadata = self.db.volume_metadata_get(adminContext.elevated(),volume['id'])

        args = self._get_volume_create_args(volume,volume_metadata)
        self._volumeops.create_volume_from_volume(volume['name'],src_vref['name'],args['volume_size'],
                                                  args['storageName'],args['volume_format'],args['write_zero'],args['volume_type'])
        LOG.info(_("[cas::] success to create volume: %s from volume: %s") % (volume['name'],src_vref['name']))
    
    def ensure_export(self, context, volume):
        pass
    def create_export(self, context, volume, connector=None):
        pass
    def remove_export(self, context, volume):
        pass
    
    def delete_volume(self, volume):
        """Deletes volume.
        
        :param volume: Volume object
        """
        LOG.info(_("[cas::] begin to delete volume: %s") % volume['name'])
        wipe_disks = self._is_wipe_disks(volume['id'],'volume')
        self._volumeops.delete_volume(volume['name'],wipe_disks)
        LOG.info(_("[cas::] success to delete volume: %s") % volume['name'])
    
    def create_snapshot(self, snapshot):
        """Creates a snapshot.
        :param snapshot: Snapshot object
        """
        LOG.info(_("[cas::] begin to create snapshot[%s] from volume[%s]") 
                 % (snapshot['name'],snapshot['volume_name']))
        self._volumeops.create_snapshot_from_volume(snapshot)
        LOG.info(_("[cas::] success to create snapshot[%s] from volume[%s]") 
                 % (snapshot['name'],snapshot['volume_name']))
    
    def delete_snapshot(self, snapshot):
        """Delete snapshot.
        :param snapshot: Snapshot object
        """
        LOG.info(_("[cas::] begin to delete snapshot[%s] base on volume[%s]") 
                 % (snapshot['name'],snapshot['volume_name']))
        wipe_disks = self._is_wipe_disks(snapshot['id'],'snapshot')
        self._volumeops.delete_volume(snapshot['name'],wipe_disks)
        LOG.info(_("[cas::] success to delete snapshot[%s] base on volume[%s]") 
                 % (snapshot['name'],snapshot['volume_name']))
    
    def extend_volume(self, volume, new_size):
        self._volumeops.volume_resize_and_convert(volume['name'],(new_size * units.Gi / units.Mi))
    
    def migrate_volume(self, context, volume, host):
        LOG.info(_("[cas::] begin to migrate volume: %s") % volume['name'])
        volume_backend = host['capabilities']['volume_backend_name']
        backend_suffix = "(CVM%s)" % self._host_ip
        if volume_backend.endswith(backend_suffix):
            suffix_length = len(backend_suffix)
            hpName = volume_backend[:-suffix_length]
            volume_type = self._get_volume_type_extra_spec(volume['volume_type_id'],'volume_type','any')
            self._volumeops.migrate_volume(volume['name'],hpName,volumeType=volume_type)
        else:
            LOG.info(_("volume[%s] can't migrate between different CVM.") % volume['name'])
            raise cas_error.CasVolumeException()
        LOG.info(_("[cas::] success to migrate volume: %s") % volume['name'])
        
        return True, None
    
    def clone_image(self, context, volume, image_location, image_meta, image_service):
        image_id = image_meta['id']
        
        LOG.info(_("[cas::] begin to create volume[%s] from image[%s].") % (volume['name'],image_id))
        exist = self._volumeops.check_volume_exist(volume['name'])
        if exist:
            LOG.info(_("volume[%s] really exist on the CAS, return success.") % volume['name'])
            return None,True
        
        volume_metadata = self.db.volume_metadata_get(context.elevated(),volume['id'])
        if volume_metadata.get('alias'):
            self._volumeops.addRecord_volume(volume['name'],volume_metadata['alias'],self._hpName)
            LOG.info(_("[cas::] finish to create volume[%s] from image[%s] in managing existing volume.") % (volume['name'],image_id))
            return None,True
        
        self._imageops.check_image_type(image_meta)
        sem = self._semObj.get_obj_sem(image_id)
        sem.acquire()
        
        try:
            image_file = self._imageops.prepare_image_file_checksum(context,self._glance_host,self._glance_port,image_meta)
        except Exception as exc:
            raise exc
        finally:
            sem.release()
            self._semObj.back_obj_sem(image_id)
        
        args = self._get_volume_create_args(volume,volume_metadata)
        self._volumeops.create_volume_from_image(volume['name'],image_file,self._hpName,args)
        
        try:
            self._volumeops.volume_resize_and_convert(volume['name'],args['volume_size'],args['volume_format'])
        except Exception as exc:
            self._volumeops.delete_volume(volume['name'])
            raise exc
        
        LOG.info(_("[cas::] finish to create volume[%s] from image[%s].") % (volume['name'],image_id))
        return None, True
    
    def copy_volume_to_image(self, context, volume, image_service, image_meta):
        self._volumeops.convert_volume_to_image(volume['name'],image_meta['id'],image_meta['disk_format'])
        self._imageops.upload_image(context,self._glance_host,self._glance_port,image_meta['id'],image_meta)
    
    def create_volume_from_snapshot(self, volume, snapshot):
        """Creates a volume from a snapshot.
        
        :param volume: New Volume object
        :param snapshot: Reference to snapshot entity
        """
        LOG.info(_("[cas::] begin to create volume[%s] from snapshot[%s]") %
                 (volume['name'], snapshot['name']))
        
        adminContext = cindercontext.get_admin_context()
        volume_metadata = self.db.volume_metadata_get(adminContext.elevated(),volume['id'])
        
        args = self._get_volume_create_args(volume,volume_metadata)
        self._volumeops.create_volume_from_snapshot(volume['name'],snapshot['name'],args['volume_size'],
                                                    args['storageName'],args['volume_format'],args['write_zero'],args['volume_type'])
        
        LOG.info(_("[cas::] success to create volume[%s] from snapshot[%s]") %
                 (volume['name'], snapshot['name'])) 
    
    def initialize_connection(self, volume, connector):
        """Get information of volume.
        
        :param volume: Volume object
        :param connector: Connector information
        :return: Return connection information
        """
        LOG.info(_("[cas::] begin to get volume[%s] connection info,connector: %s") % (volume['name'],connector))
        if 'vmUUID' in connector:
            if connector['hostIp'] != self._host_ip:
                if not connector.has_key('dts_migrate'):
                    LOG.error(_("can't initialize connection between different hostpool."))
                    raise cas_error.CasVolumeException()

            adminContext = cindercontext.get_admin_context()
            volume_metadata = self.db.volume_metadata_get(adminContext.elevated(),volume['id'])
            if volume_metadata.get('loctype') is not None:
                LOG.info("driver_volume_type is %s" % volume_metadata.get('loctype'))
                connection_info = {'driver_volume_type': "local",'multiattach': volume['multiattach']}
            else:
                connection_info = {'driver_volume_type': "share", 'multiattach': volume['multiattach']}
            connection_info['data'] = {'volumeName': volume['name'],
                                           'volumeSize': int(volume['size'] * units.Gi / units.Mi)}
            # adminContext = cindercontext.get_admin_context()
            # volume_metadata = self.db.volume_metadata_get(adminContext.elevated(),volume['id'])
            if volume_metadata.get('alias'):
                connection_info['data']['alias'] = volume_metadata['alias']
            if volume_metadata.get('location'):
                connection_info['data']['location'] = volume_metadata['location']
            if volume_metadata.get('volume_format'):
                connection_info['data']['volume_format'] = volume_metadata['volume_format']
            else:
                connection_info['data']['volume_format'] = volume_metadata.get('volume_format', self._volume_format)

            volume_type = self._get_volume_type_extra_spec(volume['volume_type_id'],'volume_type','any')
            excludePrefix = self._volumeops.get_exclude_stroage_prefix(volume_type)
            if excludePrefix:
                connection_info['data']['excludePrefix'] = excludePrefix

            if volume.get('bootable'):
                connection_info['bootable'] = volume.get('bootable')
            
            LOG.info(_("[cas::] success to get volume[%s] connection info: %s") % (volume['name'],connection_info))
            
            connection_info['connector'] = connector

            if connector.has_key('dts_migrate') and connector['dts_migrate'] == 'true':
                backend_name = "%s(CVM%s)" % (connector['hpName'],connector['hostIp'])
                pools = self._scheduler_rpcapi.get_pools(adminContext.elevated())
                for pool in pools:
                    if pool['name'] == "%s@cas_volume#%s" % (connector['host'], backend_name):
                        if (connector.has_key('storage_availability_zone') and
                            volume['availability_zone'] != connector['storage_availability_zone']):
                            volume_az = connector['storage_availability_zone']
                            LOG.info(_("[cas::]begin to sync volume az:%s,%s,%s")%(connector,pool['name'],volume_az))
                            self.db.volume_update(adminContext.elevated(),volume['id'],
                                                  {'host':pool['name'],'availability_zone':volume_az})
                            LOG.info(_("[cas::]finish to sync volume az:%s,%s,%s")%(connector,pool['name'],volume_az))
                        break
            
            elif connector['hpName'] != self._hpName:
                backend_name = "%s(CVM%s)" % (connector['hpName'],self._host_ip)
                pools = self._scheduler_rpcapi.get_pools(adminContext.elevated())
                for pool in pools:
                    if pool['capabilities']['volume_backend_name'] == backend_name:
                        self.db.volume_update(adminContext.elevated(),volume['id'],{'host':pool['name']})
                        break
            encryptionInfo = self._get_volume_encryption_args(volume)
            if encryptionInfo:
                connection_info['encryptionInfo'] = encryptionInfo
            
            return connection_info
        else:
            connection_info = {'driver_volume_type': "local"}
            connection_info['data'] = {'device_path':None}
            return connection_info
    
    def terminate_connection(self, volume, connector, force=False, **kwargs):
        if 'vmUUID' not in connector:
            return
        hpName = self._volumeops.check_volume_exist(volume['name'])
        current_backend_name = "%s(CVM%s)" % (hpName,self._host_ip)
        db_backend_name = volume['host'].split("#")[-1]
        if current_backend_name != db_backend_name:
            adminContext = cindercontext.get_admin_context()
            pools = self._scheduler_rpcapi.get_pools(adminContext.elevated())
            for pool in pools:
                if pool['capabilities']['volume_backend_name'] == current_backend_name:
                    self.db.volume_update(adminContext.elevated(),volume['id'],{'host':pool['name']})
                    break
    
    def retype(self, context, volume, new_type, diff, host):
        """
        :param context: Context
        :param volume: A dictionary describing the volume to migrate
        :param new_type: A dictionary describing the volume type to convert to
        :param diff: A dictionary with the difference between the two types
        :param host: A dictionary describing the host to migrate to, where
                     host['host'] is its name, and host['capabilities'] is a
                     dictionary of its reported capabilities .
        :return: True if the retype occurred; False otherwise.
        """
        LOG.info(_("[cas::] begin to retype volume: %s") % volume['name'])
        
        volume_backend = host['capabilities']['volume_backend_name']
        backend_suffix = "(CVM%s)" % self._host_ip
        if volume_backend.endswith(backend_suffix):
            suffix_length = len(backend_suffix)
            hpName = volume_backend[:-suffix_length]
        else:
            LOG.error(_("[cas::] Volume can't retype in different CVM"))
            raise cas_error.CasVolumeException()
        if volume['attach_status'] == "attached" and diff['qos_specs']:
            self._volumeops.set_volume_qos(volume,diff,hpName)
        
        # Check whether storage_pool has changed
        storage_pool_info = diff['extra_specs'].get('storage_pool')
        if storage_pool_info is None:
            LOG.info(_("[cas::] without any storage pool info,do nothing"))
            return True
        old_pool = storage_pool_info[0]
        new_pool = storage_pool_info[1]
        location = None
        
        if old_pool == new_pool:
            LOG.info(_("[cas::] storage pool has no change,do nothing"))
            return True
        if new_pool is not None:
            location = new_pool.split()[-1]
        if  location is None and hpName == self._hpName:
            return True
        if volume['attach_status'] == "attached" and hpName != self._hpName:
            LOG.error(_("Volume is still attached ,so can't retype it in different host pool."))
            raise cas_error.CasVolumeException()
        
        self._volumeops.migrate_volume(volume['name'],hpName,location)
        LOG.info(_("[cas::] success to retype volume: %s") % volume['name'])
        
        return True
    
    def manage_existing_get_size(self, volume, existing_ref):
        """Get volume size.
        
        :param volume: Volume object
        :param existing_ref: full volume path
        """
        LOG.info(_("[cas::] begin to get existing volume:%s size") % existing_ref['source-name'])
        volume_size = self._volumeops.manage_existing_get_size(volume,existing_ref,self._hpName)
        volume_size = volume_size * units.Mi / units.Gi
        LOG.info(_("[cas::] success to get existing volume:%s size:%s GB") % (existing_ref['source-name'],volume_size))
        return volume_size
    
    def manage_existing(self, volume, existing_ref):
        """Manage exiting volume.
         
         :param volume: Volume object
         :param existing_ref: full volume path
        """
        
        LOG.info(_("[cas::] begin to manage existing volume:%s to volume[%s]") % (existing_ref['source-name'],volume['name']))
        
        self._volumeops.addRecord_volume(volume['name'],existing_ref['source-name'],self._hpName)
        
        metadata = {"alias":existing_ref['source-name']}
        adminContext = cindercontext.get_admin_context()
        self.db.volume_update(adminContext.elevated(),volume['id'],{'metadata': metadata})
        
        LOG.info(_("[cas::] success to manage existing volume:%s to volume[%s]") % (existing_ref['source-name'],volume['name']))
    
    def unmanage(self, volume):
        """Unmanage volume.
        
         :param volume: Volume object
        """
        LOG.info(_("[cas::] begin to unmanage volume[%s]") % volume['name'])
        self._volumeops.delRecord_volume(volume['name'])
        LOG.info(_("[cas::] success to unmanage volume[%s]") % volume['name'])
    
    def revert_to_snapshot(self,context,volume,snapshot):
        """Is called to perform revert volume from snapshot.
    
        :param context: Our working context.
        :param volume: the volume to be reverted.
        :param snapshot: the snapshot data revert to volume.
        :return None
        """
        LOG.info(_("[cas::] begin to revert volume[%s] from snapshot[%s]") % (volume['name'],snapshot['name']))
        if snapshot.volume_size != volume.size:
            LOG.error(_("reverting volume is not supported if the volume size is not equal to the snapshot size."))
            raise cas_error.CasVolumeException()
        if volume['attach_status'] == "attached":
            LOG.error(_("reverting attached volume[%s] is not supported.") % volume['name'])
            raise cas_error.CasVolumeException()
        wipe_disks = self._is_wipe_disks(volume['id'],'volume')
        self._volumeops.revert_to_snapshot(volume['name'],snapshot['name'],wipe_disks)
        LOG.info(_("[cas::] success to revert volume[%s] from snapshot[%s]") % (volume['name'],snapshot['name']))

    def checkAndupdate_volume_mode(self, hpName, hostlist):

        adminContext = cindercontext.get_admin_context()
        volumesList =[]
        for hostFullname in hostlist:
            volumes = self.db.volume_get_all_by_host(adminContext.elevated(),hostFullname)
            volumesList = volumesList + volumes
        if volumesList:
            self._volumeops.checkAndupdate_volume_mode(hpName, volumesList)
        else:
            LOG.error("This host do not hava volumes, please check")
