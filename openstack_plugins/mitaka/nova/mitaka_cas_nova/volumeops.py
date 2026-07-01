#add by zhangmingze, 2014-2-17

from oslo_log import log as logging
from nova import volume
from nova.i18n import _
from oslo_utils import units
from nova.virt.casapi import error as cas_error
from nova.virt.casapi import xml as casxml

LOG = logging.getLogger(__name__)
QOS_MIN = 16
QOS_MAX = 2147483647
class CasVolumeOps(object):
    """
    Management class for Volume-related tasks
    """
    def __init__(self, session, host):
        self._session = session
        self._host = host
        self._xml = casxml.VolumeXml()
        self._volume_api = volume.API()
    
    def get_root_volume_image(self, context, root_device_name, block_device_mapping):
        volume_id = None
        
        for mapping_info in block_device_mapping:
            if root_device_name == mapping_info['mount_device']:
                volume_id = mapping_info['connection_info']['serial']
                break
        
        volume_info = self._volume_api.get(context,volume_id)
        return volume_info['volume_image_metadata']['image_id']
    
    def check_volume_exist(self, vmDevices, mountpoint, filename, instance):
        if mountpoint not in vmDevices:
            return False
        
        devicePath = vmDevices[mountpoint]['path']
        file_name = filename.split('/')[-1]
        if devicePath.endswith(file_name):
            return True
        else:
            LOG.error(_("instance[uuid:%s] already exists mountpoint %s not with filename %s.") 
                      % (instance['uuid'],mountpoint,filename))
            raise cas_error.CasVolumeException()
    
    def query_volume_on_host(self, connection_info, hostName):
        volume_type = connection_info['driver_volume_type']
        if volume_type == 'rbd':
            return connection_info['data']['name']
        elif volume_type in ['share','virtio']:
            return connection_info['data'].get('alias') or connection_info['data']['volumeName']
        elif volume_type in ['iscsi','fibre_channel']:
            targets = self._get_lun_volume_info(volume_type, connection_info['data'])
            return self._host.query_lun_on_host(volume_type,targets,hostName)
        else:
            LOG.error(_("volume type[%s] does not support!") % volume_type)
            raise cas_error.CasVolumeException()
    
    def _get_lun_volume_info(self, volume_type, volume_data):
        targets = []
        if volume_type == 'iscsi':
            portal = volume_data['target_portal']
            iqn = volume_data['target_iqn']
            lun = volume_data['target_lun']
            targets.append({'portal':portal,'iqn':iqn,'lun':lun})
        else:
            lun = volume_data['target_lun']
            for wwn in volume_data['target_wwn']:
                targets.append({'wwn':wwn,'lun':lun})
        
        return targets
    
    def _get_share_volume_info(self, volume_data):
        storInfo = {'fileName':volume_data['volumeName'],'size':volume_data['volumeSize']}
        if volume_data.get('excludePrefix'):
            storInfo['excludePrefix'] = set(volume_data['excludePrefix'])
        
        return storInfo
    
    def _get_rbd_volume_info(self, volume_data):
        rbd_path = volume_data['name'].split('/')
        targets = {'poolName':rbd_path[0],'deviceName':rbd_path[1],'authUsername':volume_data['auth_username']}
        
        if 'data_pool' in volume_data:
            targets['dataPool'] = volume_data['data_pool']
        if 'keyring' in volume_data:
            targets['keyring'] = volume_data['keyring']
        if 'secret_uuid' in volume_data:
            targets['secret_uuid'] = volume_data['secret_uuid']
        
        host = []
        for index in range(0,len(volume_data['hosts'])):
            ip = volume_data['hosts'][index]
            port = volume_data['ports'][index]
            host.append({'ip':ip,'port':port})
        targets['host'] = host
        
        return targets
    
    def _get_volume_info(self, connection_info, mountpoint, disk_bus):
        volume_type = connection_info['driver_volume_type']
        volum_dict = {'deviceName':mountpoint,'targetBus':disk_bus,'serial':connection_info['serial']}
        qos_specs = connection_info['data']['qos_specs']
        
        if volume_type == 'rbd':
            volum_dict["type"] = "rbd"
            targets = self._get_rbd_volume_info(connection_info['data'])
            volum_dict['target'] = targets
        elif volume_type in ['share','virtio']:
            volum_dict["type"] = "share"
            storInfo = self._get_share_volume_info(connection_info['data'])
            volum_dict.update(storInfo)
        elif volume_type in ['iscsi','fibre_channel']:
            volum_dict["type"] = volume_type
            targets = self._get_lun_volume_info(volume_type, connection_info['data'])
            volum_dict['target'] = targets
        else:
            LOG.error(_("volume type[%s] does not support!") % volume_type)
            raise cas_error.CasVolumeException()
        if qos_specs:
            read_iops_sec = int(qos_specs.get('read_iops_sec',0))
            write_iops_sec = int(qos_specs.get('write_iops_sec',0))
            read_bytes_sec = int(qos_specs.get('read_bytes_sec',0)) / units.Ki
            write_bytes_sec = int(qos_specs.get('write_bytes_sec',0)) / units.Ki
            if read_iops_sec:
                if QOS_MIN > read_iops_sec or read_iops_sec > QOS_MAX:
                    LOG.error(_("volume read_iops_sec:%s is out of range[%s~%s]!") % (read_iops_sec,QOS_MIN,QOS_MAX))
                    raise cas_error.CasVolumeException()
                volum_dict['readIopsSec'] = read_iops_sec
            if write_iops_sec:
                if QOS_MIN > write_iops_sec or write_iops_sec > QOS_MAX:
                    LOG.error(_("volume write_iops_sec:%s is out of range[%s~%s]!") % (write_iops_sec,QOS_MIN,QOS_MAX))
                    raise cas_error.CasVolumeException()
                volum_dict['writeIopsSec'] = write_iops_sec
            if read_bytes_sec:
                if QOS_MIN > read_bytes_sec or read_bytes_sec > QOS_MAX:
                    LOG.error(_("volume read_bytes_sec:%s KB/s is out of range[%s~%s] KB/s!") % (read_bytes_sec,QOS_MIN,QOS_MAX))
                    raise cas_error.CasVolumeException()
                volum_dict['readBytesSec'] = read_bytes_sec
            if write_bytes_sec:
                if QOS_MIN > write_bytes_sec or write_bytes_sec > QOS_MAX:
                    LOG.error(_("volume write_bytes_sec:%s KB/s is out of range[%s~%s] KB/s!") % (write_bytes_sec,QOS_MIN,QOS_MAX))
                    raise cas_error.CasVolumeException()
                volum_dict['writeBytesSec'] = write_bytes_sec

        if connection_info.get('multiattach',False):
            volum_dict['diskMode'] = 'independent-persistent'
        
        return volum_dict
    
    def attach_lun_device_to_cluster(self, connection_info, hostName, nodename):
        volume_type = connection_info['driver_volume_type']
        if volume_type in ['share','virtio']:
            return
        
        if volume_type in ['iscsi','fibre_channel']: 
            targets = self._get_lun_volume_info(volume_type, connection_info['data'])
        elif volume_type == 'rbd':
            targets = self._get_rbd_volume_info(connection_info['data'])
        
        self._host.attach_lun_device_to_cluster(volume_type,targets,nodename,hostName)
    
    def detach_lun_device_from_cluster(self, connection_info, nodename):
        volume_type = connection_info['driver_volume_type']
        if volume_type in ['share','virtio']:
            return
        
        if volume_type in ['iscsi','fibre_channel']: 
            targets = self._get_lun_volume_info(volume_type, connection_info['data'])
        elif volume_type == 'rbd':
            targets = self._get_rbd_volume_info(connection_info['data'])
        clusterName = None if nodename else connection_info['connector']['clusterName']
        self._host.detach_lun_device_from_cluster(volume_type,targets,nodename,clusterName)
    
    def attach_volume(self, connection_info, instance, instanceId, mountpoint, disk_bus):
        volume_info = self._get_volume_info(connection_info, mountpoint, disk_bus)
        
        if 'rbd' == connection_info['driver_volume_type']:
            uri = self._session.make_cmd_uri('/nova/vm/addRbdDevice')
        else:
            uri = self._session.make_cmd_uri('/nova/vm/device')
        
        xmlstr = self._xml.encode_xml("attach_volume",
                                      id = instanceId,
                                      name = instance['name'],
                                      storage = volume_info)
        resp, body = self._session.call_method("PUT", uri, body=xmlstr)
        if resp.status_code == 200:
            msgId = self._xml.decode_xml("get_message_id",body)
            task = self._session.wait_for_task(msgId)
            if task['result'] != 0:
                LOG.error(_("fail to attach volume:%s, failMsg:%s") % (volume_info,task['failMsg']))
                raise cas_error.CasVolumeException()
        else:
            LOG.error(_("fail to attach volume, volume_info:%s") % volume_info)
            LOG.error(_("fail to attach volume, uri:%s. xml:%s") % (uri,xmlstr))
            LOG.error(_("fail to attach volume. status_code:%d, %s")
                      % (resp.status_code, cas_error.get_http_respond_error(resp)))
            raise cas_error.CasVolumeException()
    
    def detach_volume(self, connection_info, instance, instanceId, mountpoint):
        volume_info = {'deviceName':mountpoint}
        
        uri = self._session.make_cmd_uri('/nova/vm/delDevice')
        xmlstr = self._xml.encode_xml("detach_volume",
                                      id = instanceId,
                                      name = instance['name'],
                                      storage = volume_info)
        resp, body = self._session.call_method("PUT", uri, body=xmlstr)
        if resp.status_code == 200:
            msgId = self._xml.decode_xml("get_message_id",body)
            task = self._session.wait_for_task(msgId)
            if task['result'] != 0:
                LOG.error(_("fail to detach volume:%s, failMsg:%s") % (volume_info,task['failMsg']))
                raise cas_error.CasVolumeException()
        else:
            LOG.error(_("fail to detach volume, volume_info:%s") % volume_info)
            LOG.error(_("fail to detach volume, uri:%s. xml:%s") % (uri,xmlstr))
            LOG.error(_("fail to detach volume. status_code:%d, %s")
                      % (resp.status_code, cas_error.get_http_respond_error(resp)))
            raise cas_error.CasVolumeException()
