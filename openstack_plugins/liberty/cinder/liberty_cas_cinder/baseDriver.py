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
                help='decide whether to caculate checksum whit images in cvm /vms/nova')
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
]

CONF = cfg.CONF
CONF.register_opts(cas_default_opts)

class BaseDriver(driver.VolumeDriver):
    
    VERSION = ''
    
    def __init__(self, *args, **kwargs):
        super(BaseDriver, self).__init__(*args, **kwargs)
        self.configuration.append_config_values(cas_backend_opts)
        self._valid_volume_format = ['qcow2','raw']
        self._valid_volume_mode = ['thin','thick']
        
        self._imageops = None
        self._volumeops = None
        self._glance_port = CONF.glance_port
        self._host_ip = CONF.cas_host_ip
        self._glance_host = CONF.cas_glance_host
        self._pool_type = self.configuration.cas_pool_type
        
        self._hpName = self.configuration.cas_hpName
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
        
        if not (self._host_ip and username and password and self._hpName and self._glance_host):
            raise Exception(_("Must specify cas_host_ip, "
                              "cas_host_username "
                              "cas_host_password "
                              "cas_hpName "
                              "and cas_glance_host to use "
                              "volume_driver=cas.CasDriver"))
        
        if self._volume_format not in ('qcow2','raw'):
            raise Exception(_("volume format is %s, only support qcow2 or raw") % self._volume_format)
        
        if self._volume_mode not in ('thin','thick'):
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
    
    def _get_volume_create_args(self, context, volume, volume_metadata):
        volume_type_id = volume['volume_type_id']
        volume_format = volume_metadata.get('volume_format',self._volume_format)
        volume_format = self._get_volume_type_extra_spec(volume_type_id,'volume_format',volume_format)
        
        volume_mode = volume_metadata.get('volume_mode',self._volume_mode)
        volume_mode = self._get_volume_type_extra_spec(volume_type_id,'volume_mode',volume_mode)
        
        storageName = volume_metadata.get('location')
        storageName = self._get_volume_type_extra_spec(volume_type_id,'storage_pool',storageName)
        
        volume_type = self._get_volume_type_extra_spec(volume_type_id,'volume_type','any')
        
        volume_size = volume['size'] * units.Gi / units.Mi
        if not self._enable_limit:
            storageName = self._volumeops.check_storage_resource(volume['name'],volume_size,storageName,volume_type)
        else:
            limit_spec = self._get_resource_limit_spec()
            storageName = self._volumeops.get_available_storage(volume_size,self._hpName,storageName,volume_type,limit_spec)
        
        write_zero = 'true' if volume['multiattach'] == 1 or volume_mode == 'thick' else 'false'
        pool_type = self._pool_type.split(',')
        volume_args = {'volume_format':volume_format,'storageName':storageName,'volume_size':volume_size,
                       'write_zero':write_zero,'volume_type':volume_type,'pool_type':pool_type}
        
        return volume_args
    
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
            args = self._get_volume_create_args(adminContext.elevated(),volume,volume_metadata)
            self._volumeops.create_volume(volume['name'],args,self._hpName)
        
        LOG.info(_("[cas::] success to create volume[%s]") % volume['name'])
    
    def create_cloned_volume(self, volume, src_vref):
        LOG.info(_("[cas::] begin to create volume: %s from volume: %s") % (volume['name'],src_vref['name']))
        adminContext = cindercontext.get_admin_context()
        volume_metadata = self.db.volume_metadata_get(adminContext.elevated(),volume['id'])
        
        args = self._get_volume_create_args(adminContext.elevated(),volume,volume_metadata)
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
        self._volumeops.delete_volume(volume['name'])
        LOG.info(_("[cas::] success to delete volume: %s") % volume['name'])
    
    def backup_volume(self, context, backup, backup_service):
        if CONF.backup_driver == 'cinder.volume.drivers.cas.backup':
            volume = self.db.volume_get(context, backup['volume_id'])
            backup_service.backup(backup,volume['name'])
        else:
            LOG.error("Can't backup volume because backup_service is not CAS driver.")
            raise cas_error.CasVolumeException()
    
    def restore_backup(self, context, backup, volume, backup_service):
        if CONF.backup_driver == 'cinder.volume.drivers.cas.backup':
            backup_service.restore(backup,volume['id'],volume['name'])
        else:
            LOG.error("Can't backup volume because backup_service is not CAS driver.")
            raise cas_error.CasVolumeException()
    
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
        self._volumeops.delete_volume(snapshot['name'])
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
        
        args = self._get_volume_create_args(context,volume,volume_metadata)
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
        
        args = self._get_volume_create_args(adminContext.elevated(),volume,volume_metadata)
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
        
        if connector['hostIp'] != self._host_ip:
            LOG.error(_("can't initialize connection between different hostpool."))
            raise cas_error.CasVolumeException()
        
        connection_info = {'driver_volume_type': "share",'multiattach': volume['multiattach']}
        connection_info['data'] = {'volumeName': volume['name'],
                                   'volumeSize': int(volume['size'] * units.Gi / units.Mi)}
        
        adminContext = cindercontext.get_admin_context()
        volume_metadata = self.db.volume_metadata_get(adminContext.elevated(),volume['id'])
        
        if volume_metadata.get('alias'):
            connection_info['data']['alias'] = volume_metadata['alias']
            
        volume_type = self._get_volume_type_extra_spec(volume['volume_type_id'],'volume_type','any')
        excludePrefix = self._volumeops.get_exclude_stroage_prefix(volume_type)
        if excludePrefix:
            connection_info['data']['excludePrefix'] = excludePrefix
            
        LOG.info(_("[cas::] success to get volume[%s] connection info: %s") % (volume['name'],connection_info))
        
        connection_info['connector'] = connector
        
        if connector['hpName'] != self._hpName:
            backend_name = "%s(CVM%s)" % (connector['hpName'],self._host_ip)
            pools = self._scheduler_rpcapi.get_pools(adminContext.elevated())
            for pool in pools:
                if pool['capabilities']['volume_backend_name'] == backend_name:
                    self.db.volume_update(adminContext.elevated(),volume['id'],{'host':pool['name']})
                    break
        
        return connection_info
    
    def terminate_connection(self, volume, connector, force=False, **kwargs):
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
    
