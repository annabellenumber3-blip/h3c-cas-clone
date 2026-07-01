# add by zhangmingze, 2014-2-10

from oslo_config import cfg
from oslo_utils import importutils
from oslo_log import log as logging
from cinder.i18n import _
from cinder import context as cindercontext
from cinder.volume.drivers.cas import baseDriver

LOG = logging.getLogger(__name__)

cas_backend_opts = [
    cfg.StrOpt('cas_associate_driver',
               default=None,
               help='which driver will be really used.'),
]

HP3PARDriver = ['cinder.volume.drivers.san.hp.hp_3par_iscsi.HP3PARISCSIDriver',
                'cinder.volume.drivers.san.hp.hp_3par_fc.HP3PARFCDriver']

class ExtendDriver(object):
    def __init__(self, driver, *args,**kwargs):
        self._driver = importutils.import_object(driver,*args,**kwargs)
    
    def validate_connector(self, connector):
        pass
    
    def initialize_connection(self, volume, connector, *args, **kwargs):
        connection_info = None
        
        for hostAdapter in connector['hostAdapters']:
            try:
                connection_info = self._driver.initialize_connection(volume, hostAdapter, *args, **kwargs)
            except Exception as exc:
                LOG.info(_("fail to initialize connection. volume:%s. connector:%s. exc:%s") % (volume['name'],hostAdapter,exc))
            else:
                LOG.info(_("success to initialize connection. volume:%s. connector:%s") % (volume['name'],hostAdapter))
        
        if not connection_info:
            LOG.error(_("can't get volume connection info. volume:%s") % volume['name'])
            raise
        
        connection_info['connector'] = connector
        
        return connection_info
    
    def terminate_connection(self, volume, connector, *args, **kwargs):
        for hostAdapter in connector['hostAdapters']:
            try:
                self._driver.terminate_connection(volume, hostAdapter, *args, **kwargs)
            except Exception as exc:
                LOG.info(_("fail to terminate connection. volume:%s. connector:%s. exc:%s") % (volume['name'],hostAdapter,exc))
            else:
                LOG.info(_("success to terminate connection. volume:%s. connector:%s") % (volume['name'],hostAdapter))
    
    def __getattr__(self, attr):
        return getattr(self._driver, attr)

class Extend3PARDriver(object):
    def __init__(self, driver, *args,**kwargs):
        self._driver_string = driver
        self._driver = importutils.import_object(driver,*args,**kwargs)
        self._hp3parclient = importutils.try_import("hp3parclient")
        self.db = kwargs['db']
    
    def validate_connector(self, connector):
        pass
    
    def _get_iscsi_connection_info(self, common, vlunId):
        iscsi_ips = self._driver.iscsi_ips
        iscsi_ip = iscsi_ips.keys()[0]
        
        info = {'driver_volume_type': 'iscsi',
                'data': {'target_portal': "%s:%s" %
                         (iscsi_ip, iscsi_ips[iscsi_ip]['ip_port']),
                         'target_iqn': iscsi_ips[iscsi_ip]['iqn'],
                         'target_lun': vlunId,
                         'target_discovered': True,
                         'encrypted': False
                         }
                }
        return info
    
    def _get_fc_connection_info(self, common, vlunId):
        fc_ports = common.get_active_fc_target_ports()
        target_wwns = []
        for port in fc_ports:
            target_wwns.append(port['portWWN'])
        
        info = {'driver_volume_type': 'fibre_channel',
                'data': {'target_lun': vlunId,
                         'target_discovered': True,
                         'target_wwn': target_wwns,
                         'initiator_target_map': {}
                         }
                }
        return info
    
    def initialize_connection(self, volume, connector, *args, **kwargs):
        common = self._driver._login()
        
        try:
            attachInfo = {}
            vlun_id = None
            vol_name = common._get_3par_vol_name(volume['id'])
            
            hostSetName = connector['hpName'] + connector['hostIp'].replace('.','')
            try:
                hostSet = common.client.getHostSet(hostSetName)
            except self._hp3parclient.exceptions.HTTPNotFound:
                sethosts = []
                for hostAdapter in connector['hostAdapters']:
                    try:
                        host, username, password = self._driver._create_host(common,volume,hostAdapter)
                    except Exception as exc:
                        LOG.info(_("fail to create host %s, exc:%s") % (hostAdapter['host'],exc))
                    else:
                        sethosts.append(host['name'])
                common.client.createHostSet(hostSetName,setmembers=sethosts)
                vlun = common._create_3par_vlun(vol_name, 'set:'+hostSetName, None)
                vlun_id = vlun['lun_id']
            else:
                for hostAdapter in connector['hostAdapters']:
                    try:
                        host, username, password = self._driver._create_host(common,volume,hostAdapter)
                    except Exception as exc:
                        LOG.info(_("fail to create host %s, exc:%s") % (hostAdapter['host'],exc))
                    else:
                        if host['name'] not in hostSet['setmembers']:
                            common.client.addHostToHostSet(hostSetName,host['name'])
                
                for metadata in volume['volume_metadata']:
                    if metadata['key'] in ['hostpoolAttached','clusterAttached']:
                        attachInfo[metadata['key']] = metadata['value']
                
                if not attachInfo or attachInfo['hostpoolAttached'] != hostSetName:
                    vlun = common._create_3par_vlun(vol_name, 'set:'+hostSetName, None)
                    vlun_id = vlun['lun_id']
                else:
                    vlun = common.client.getVLUN(vol_name)
                    vlun_id = vlun['lun']
            
            adminContext = cindercontext.get_admin_context()
            newMetadata = {metadata['key']: metadata['value'] for metadata in volume.get('volume_metadata')}
            newMetadata.update({'hostpoolAttached':hostSetName,'clusterAttached':connector['clusterName'],
                                'oldHostpoolAttached':attachInfo.get('hostpoolAttached',''),
                                'oldClusterAttached':attachInfo.get('clusterAttached','')})
            self.db.volume_update(adminContext.elevated(),volume['id'],{'metadata':newMetadata})
            
            if self._driver_string == 'cinder.volume.drivers.san.hp.hp_3par_iscsi.HP3PARISCSIDriver':
                info = self._get_iscsi_connection_info(common,vlun_id)
            else:
                info = self._get_fc_connection_info(common,vlun_id)
            info['connector'] = connector
            
            return info
        finally:
            self._driver._logout(common)
    
    def terminate_connection(self, volume, connector, *args, **kwargs):
        common = self._driver._login()
        try:
            vlun_id = None
            vol_name = common._get_3par_vol_name(volume['id'])
            
            try:
                vlun = common.client.getVLUN(vol_name)
                vlun_id = vlun['lun']
            except self._hp3parclient.exceptions.HTTPNotFound:
                self._driver._logout(common)
                return
            
            hostSetName = connector['hpName'] + connector['hostIp'].replace('.','')
            try:
                hostSet = common.client.getHostSet(hostSetName)
            except self._hp3parclient.exceptions.HTTPNotFound:
                self._driver._logout(common)
                return
            
            attachInfo = {}
            for metadata in volume['volume_metadata']:
                if metadata['key'] in ['hostpoolAttached','clusterAttached','oldHostpoolAttached','oldClusterAttached']:
                    attachInfo[metadata['key']] = metadata['value']
            
            if attachInfo['hostpoolAttached'] == hostSetName:
                if attachInfo['clusterAttached'] == connector['clusterName']:
                    attachInfo['hostpoolAttached'] = attachInfo['oldHostpoolAttached']
                    attachInfo['clusterAttached'] = attachInfo['oldClusterAttached']
            attachInfo['oldHostpoolAttached'] = ''
            attachInfo['oldClusterAttached'] = ''
            
            if attachInfo['hostpoolAttached'] != hostSetName:
                common.client.deleteVLUN(vol_name,vlun_id,'set:'+hostSetName)
            
            newMetadata = {metadata['key']: metadata['value'] for metadata in volume.get('volume_metadata')}
            newMetadata.update(**attachInfo)
            adminContext = cindercontext.get_admin_context()
            self.db.volume_update(adminContext.elevated(),volume['id'],{'metadata':newMetadata})
            
            connector_hosts = []
            for hostAdapter in connector['hostAdapters']:
                connector_hosts.append(hostAdapter['host'])
            
            for hostname in hostSet['setmembers']:
                if hostname.endswith('-'+connector['clusterId']) and hostname not in connector_hosts:
                    common.client.removeHostFromHostSet(hostSetName,hostname)
                    hostSet['setmembers'].remove(hostname)
            
            if not hostSet['setmembers']:
                common.client.deleteHostSet(hostSetName)
            
        finally:
            self._driver._logout(common)
    
    def __getattr__(self, attr):
        return getattr(self._driver, attr)

class CasDriver(object):
    def __init__(self, *args, **kwargs):
        configuration = kwargs['configuration']
        configuration.append_config_values(cas_backend_opts)
        associated_driver = configuration.cas_associate_driver
        if associated_driver:
            if associated_driver in HP3PARDriver:
                self.associated_driver = Extend3PARDriver(associated_driver,*args,**kwargs)
            else:
                self.associated_driver = ExtendDriver(associated_driver,*args,**kwargs)
        else:
            self.associated_driver = baseDriver.BaseDriver(*args,**kwargs)
    
    def __getattr__(self, attr):
        return getattr(self.associated_driver, attr)
    