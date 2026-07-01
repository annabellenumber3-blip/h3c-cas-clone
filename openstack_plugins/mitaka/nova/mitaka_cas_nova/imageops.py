#add by zhangmingze, 2014-2-15

import time
import nova.conf

from oslo_log import log as logging
from nova.i18n import _
from nova.image import glance
from nova.virt.casapi import error as cas_error
from nova.virt.casapi import xml as casxml


CONF = nova.conf.CONF

LOG = logging.getLogger(__name__)

class CasImageOps(object):
    """
    Management class for Image-related tasks
    """
    image_dir = '/vms/nova/'
    
    def __init__(self, session, host):
        self._session = session
        self._host = host
        self._xml = casxml.ImageXml()
    
    def _find_image_in_nova_checksum(self, image,size,checksum=None):
        if checksum is not None:
            uri = self._session.make_cmd_uri('/nova/image/ifExists',uuid=image,size=str(size),checksum=checksum)
        else:
            uri = self._session.make_cmd_uri('/nova/image/ifExists',uuid=image,size=str(size))
        resp,status = self._session.call_method('GET',uri)
        if resp.status_code == 200:
            return int(status)
        else:
            LOG.error(_("can't find image in nova. resp.status_code:%d, %s")
                      % (resp.status_code, cas_error.get_http_respond_error(resp)))
            raise cas_error.CasImageException()
    
    def _delete_image_in_nova(self,image):
        uri = self._session.make_cmd_uri('/nova/image',image)
        resp,body = self._session.call_method("DELETE",uri)
        if resp.status_code != 204:
            LOG.error(_("fail to to delete image file, uri:%s") % uri)
            LOG.error(_("fail to delete image file, resp.status_code:%d, %s")
                      % (resp.status_code,cas_error.get_http_respond_error(resp)))
            raise cas_error.CasImageException()
        else:
            LOG.info(_("success to delete image file [%s]") % image)
    
    def _download_image(self, context, host, port, image, image_type,size,checksum=None):
        dst_file = self.image_dir + image
        token = getattr(context, 'auth_token')
        download_args = {'token': token,'host':host,'port':str(port),'uuid':image,
                         'destFile':dst_file,'imageType':image_type,'size':size}
        
        if checksum is not None:
            download_args['checksum'] = checksum
        
        uri = self._session.make_cmd_uri('/nova/download')
        xmlstr = self._xml.encode_xml("download_image",**download_args)
        resp,body = self._session.call_method('POST',uri,body=xmlstr)
        if resp.status_code == 200:
            msgId = self._xml.decode_xml("get_message_id",body)
            task = self._session.wait_for_task(msgId)
            if task['result'] != 0:
                LOG.error(_("fail to download image[%s], failMsg:%s") % (image,task['failMsg']))
                raise cas_error.CasImageException()
        else:
            LOG.error(_("fail to download image[%s] uri:%s, xmlstr:%s") % (image,uri,xmlstr))
            LOG.error(_("fail to download image[%s]. status_code:%d, %s")
                      % (image,resp.status_code, cas_error.get_http_respond_error(resp)))
            raise cas_error.CasImageException()
    
    def get_image_disk_bus(self,imageMeta,default_disk_bus):
        if isinstance(imageMeta, dict):
            if imageMeta:
                disk_bus = imageMeta['properties'].get('hw_disk_bus', default_disk_bus)
            else:
                disk_bus = default_disk_bus
        else:
            disk_bus = imageMeta.properties.get('hw_disk_bus')
            if not disk_bus:
                disk_bus = default_disk_bus
        
        if disk_bus not in ('virtio','scsi','ide','virtioScsi'):
             LOG.error(_("the type of disk bus is unsupported, type:%s") % disk_bus)
             raise cas_error.CasImageException()
        
        return disk_bus
    
    def get_image_net_model(self, imageMeta):
        if isinstance(imageMeta, dict):
            if imageMeta:
                net_model = imageMeta['properties'].get('hw_vif_model','virtio')
            else:
                net_model = 'virtio'
        else:
            net_model = imageMeta.properties.get('hw_vif_model')
            if not net_model:
                net_model = 'virtio'
        
        if net_model not in ('virtio','rtl8139','e1000'):
             LOG.error(_("the type of net model is unsupported, type:%s") % net_model)
             raise cas_error.CasImageException()
        
        return net_model
    
    def get_image_net_queues(self, imageMeta):
        if isinstance(imageMeta, dict):
            if imageMeta:
                net_queues = imageMeta['properties'].get('vif_queues')
            else:
                net_queues = None
        else:
            if hasattr(imageMeta.properties,'vif_queues'):
                net_queues = imageMeta.properties.get('vif_queues') or None
            else:
                net_queues = None
        
        if net_queues is not None:
            try:
                net_queues = int(net_queues)
            except Exception:
                LOG.error(_("the value of net queues is unsupported, value:%s") % net_queues)
                raise cas_error.CasImageException()
        
        return net_queues
    
    def get_image_disk_format(self, imageMeta):
        if isinstance(imageMeta, dict):
            disk_format = imageMeta['disk_format']
        else:
            disk_format = imageMeta.disk_format
        
        return disk_format
    
    def get_image_meta_props(self, context, image, instance):
        def _get_metadata_from_instance(image, instance):
            properties_args = {}
            system_metadata = instance['system_metadata']
            image_meta = {'id':image,
                          'container_format':system_metadata.get('image_container_format','bare'),
                          'disk_format':system_metadata.get('image_disk_format','qcow2')}
            if system_metadata.has_key('image_hw_vif_model'):
                properties_args['hw_vif_model'] = system_metadata['image_hw_vif_model']
            if system_metadata.has_key('image_hw_disk_bus'):
                properties_args['hw_disk_bus'] = system_metadata['image_hw_disk_bus']
            if system_metadata.has_key('image_vif_queues'):
                properties_args['vif_queues'] = system_metadata['image_vif_queues']
            if system_metadata.has_key('image_full_initalization'):
                properties_args['full_initalization'] = system_metadata['image_full_initalization']
            if system_metadata.has_key('image_cas_ostype'):
                properties_args['cas_ostype'] = system_metadata['image_cas_ostype']
            if properties_args:
                image_meta['properties'] = properties_args
            return image_meta
        (image_service, image_id) = glance.get_remote_image_service(context, image)
        try:
            image_meta = image_service.show(context, image_id)
        except Exception:
            image_meta = _get_metadata_from_instance(image, instance)
            LOG.info(_("get image metadata from instance. image_meta:%s") % image_meta)
        return image_meta
    
    def prepare_image_file_checksum(self,context,host,port,imageMeta):
        image_file = imageMeta['id']
        image_size = imageMeta['size']
        checksum = imageMeta['checksum'] if CONF.cas.image_checksum else None
        LOG.info(_("prep image:%s,%s,%s") % (image_file,image_size,checksum))
        
        status = self._find_image_in_nova_checksum(image_file,image_size,checksum=checksum)
        if 1 == status:
            LOG.info(_("image:%s already exist on the cas.") % image_file)
            return self.image_dir + image_file
        
        if 0 == status:
            # create base file or iso
            # transfer image or iso from glance to cas
            hasSpace = self._host.has_space_on_host(image_size)
            if not hasSpace:
                LOG.error(_("image:%s does not exist on the cas, but cas does not have enough space!") % image_file)
                raise cas_error.CasHostException()
            
            LOG.info(_("image:%s does not exist on the cas, begin to fetch image to cas!") % image_file)
            try:
                image_type = self.get_image_type(imageMeta)
                self._download_image(context,host,port,image_file,image_type,image_size,checksum=checksum)
            except Exception as exc:
                ck_status = self._find_image_in_nova_checksum(image_file,image_size,checksum=checksum)
                if 1 == ck_status:
                    LOG.info(_("finish to fetch image: %s to cas!") % image_file)
                    return self.image_dir + image_file
                
                LOG.error(_("fail to download image:%s to cas!") % image_file)
                self._delete_image_in_nova(image_file)
                raise exc
            else:
                LOG.info(_("finish to fetch image:%s to cas!") % image_file)
                return self.image_dir + image_file
        
        wait_count = 1200
        if 2 == status:
            LOG.info(_("someone is fetching image:%s to cas now, wait for it!") % image_file)
            while True:
                time.sleep(3)
                wait_status = self._find_image_in_nova_checksum(image_file,image_size,checksum=checksum)
                if 1 == wait_status:
                    LOG.info(_("finish to wait image:%s fetching to cas!") % image_file)
                    return self.image_dir + image_file
                
                if 0 == wait_status:
                    LOG.error(_("image: %s disappeared by itself,status Error:%s!") % (image_file,wait_status))
                    self._delete_image_in_nova(image_file)
                    raise cas_error.CasImageDisappearException()
                
                if 2 == wait_status:
                    wait_count = wait_count - 1
                    if wait_count == 0:
                        LOG.error(_("Timeout State: someone download image timeout:%s!") % image_file)
                        self._delete_image_in_nova(image_file)
                        raise cas_error.CasImageException()
    
    def upload_image(self, context, host, port, image, imageMeta):
        snap_meta = {"disk_format": 'qcow2' if imageMeta["disk_format"] == 'iso' else imageMeta["disk_format"],             
                     "container_format": imageMeta["container_format"]
                    }
        
        src_file = self.image_dir + image
        token = getattr(context, 'auth_token')
        
        uri = self._session.make_cmd_uri('/nova/update')
        xmlstr = self._xml.encode_xml("update_image",token=token,host=host,port=str(port),
                                      uuid=image,meta=str(snap_meta),srcFile=src_file)
        resp,body = self._session.call_method('POST',uri,body=xmlstr)
        if resp.status_code == 200:
            msgId = self._xml.decode_xml("get_message_id",body)
            task = self._session.wait_for_task(msgId)
            if task['result'] != 0:
                LOG.error(_("fail to upload snapshot[%s], failMsg:%s") % (image,task['failMsg']))
                raise cas_error.CasImageException()
        else:
            LOG.error(_("fail to update image[%s] uri:%s, xmlstr:%s") % (image,uri,xmlstr))
            LOG.error(_("fail to update image[%s]. status_code:%d, heads:%s") % \
                     (image,resp.status_code, resp.headers))
            raise cas_error.CasImageException()
    
    def attach_image(self, instance, instanceId, disk_bus, image_info, useLocal,writeZero):
        image_args = {'useLocal':useLocal,'imageSize':image_info['size'],
                      'deviceName':image_info['device_name'],'targetBus':disk_bus,
                      'imageName':image_info['virtual_name']+'-'+instance['uuid'],
                      'writeZero':writeZero}
        if image_info['guest_format']:
            image_args['guestFormat'] = image_info['guest_format']
        
        xmlstr = self._xml.encode_xml("attach_image",vmId=instanceId,**image_args)
        uri = self._session.make_cmd_uri('/nova/vm/imageDevice')
        resp, body = self._session.call_method("PUT", uri, body=xmlstr)
        if resp.status_code == 200:
            msgId = self._xml.decode_xml("get_message_id",body)
            task = self._session.wait_for_task(msgId)
            if task['result'] != 0:
                LOG.error(_("fail to attach image:%s, failMsg:%s") % (image_info,task['failMsg']))
                raise cas_error.CasImageException()
        else:
            LOG.error(_("fail to attach image, volume_info:%s")% image_info)
            LOG.error(_("fail to attach image, uri:%s. xml:%s")%(uri, xmlstr))
            LOG.error(_("fail to attach image. status_code:%d, %s")
                      % (resp.status_code, cas_error.get_http_respond_error(resp)))
            raise cas_error.CasImageException()
    
    def find_image_in_share_storage(self, image):
        nodename = self._host.get_host_first_nodename()
        node = self._host.get_node_by_nodename(nodename)
        
        for host in node['nodeHosts'].values():
            if host['status'] == 1:
                for poolName in node['sharePools'].keys():
                    uri = self._session.make_cmd_uri('/storage/refresh',id=host['id'],poolName=poolName)
                    resp,body = self._session.call_method('GET',uri)
                    if resp.status_code != 200:
                        LOG.error(_("fail to refresh storage pool, uri:%s.") % uri)
                        LOG.error(_("fail to refresh storage pool. status_code:%d, %s")
                                  % (resp.status_code, cas_error.get_http_respond_error(resp)))
                    else:
                        uri = self._session.make_cmd_uri('/storage/volume',hostId=host['id'],poolName=poolName,volumeName=image)
                        resp,body = self._session.call_method('GET',uri)
                        if resp.status_code == 200:
                            list_image = self._xml.decode_xml("list_image",body)
                            if image in list_image:
                                return node['sharePools'][poolName]['path'] + '/' + image
                        else:
                            LOG.error(_("fail to query storage volume list, uri:%s.") % uri)
                            LOG.error(_("fail to query storage volume list. status_code:%d, %s")
                                      % (resp.status_code, cas_error.get_http_respond_error(resp)))
                break
        
        LOG.error(_("can't find image in share storage pools, image_id:%s") % image)
        raise cas_error.CasImageException()
    
    def attach_device(self, instance, instanceId, device_info):
        device_args = {'device':device_info['type'],'fileType':'file',
                       'targetBus':device_info['targetBus'],'cacheType':'directsync'}
        if device_info.get('deviceName'):
            device_args['deviceName'] = device_info.get('deviceName')
        if device_info.get('path'):
            device_args['path'] = device_info['path']
        
        xmlstr = self._xml.encode_xml("attach_device",
                                      id = instanceId,
                                      name = instance['name'],
                                      storage = device_args)
        uri = self._session.make_cmd_uri('/nova/vm/addDevice')
        resp, body = self._session.call_method("PUT", uri, body=xmlstr)
        if resp.status_code == 200:
            msgId = self._xml.decode_xml("get_message_id",body)
            task = self._session.wait_for_task(msgId)
            if task['result'] != 0:
                LOG.error(_("fail to attach device:%s, failMsg:%s") % (device_info,task['failMsg']))
                raise cas_error.CasImageException()
        else:
            LOG.error(_("fail to attach device, device_info:%s") % device_info)
            LOG.error(_("fail to attach device, uri:%s. xml:%s") % (uri,xmlstr))
            LOG.error(_("fail to attach device. status_code:%d, %s")
                      % (resp.status_code, cas_error.get_http_respond_error(resp)))
            raise cas_error.CasImageException()
    
    def detach_device(self, instance, instanceId, deviceName):
        device_args = {'deviceName':deviceName}
        
        xmlstr = self._xml.encode_xml("detach_device",
                                      id = instanceId,
                                      name = instance['name'],
                                      storage = device_args)
        
        uri = self._session.make_cmd_uri('/nova/vm/delDevice')
        resp, body = self._session.call_method("PUT", uri, body=xmlstr)
        if resp.status_code == 200:
            msgId = self._xml.decode_xml("get_message_id",body)
            task = self._session.wait_for_task(msgId)
            if task['result'] != 0:
                LOG.error(_("fail to detach device:%s, failMsg:%s") % (deviceName,task['failMsg']))
                raise cas_error.CasImageException()
        else:
            LOG.error(_("fail to detach device, deviceName:%s") % deviceName)
            LOG.error(_("fail to detach device, uri:%s. xml:%s") % (uri,xmlstr))
            LOG.error(_("fail to detach device. status_code:%d, %s")
                      % (resp.status_code, cas_error.get_http_respond_error(resp)))
            raise cas_error.CasImageException()
    
    def check_image_type(self, imageMeta):
        """
        check disk_format and container_format of the imagefile.
        """
        disk_format = imageMeta['disk_format']
        if disk_format not in ('iso', 'qcow2', 'raw'):
            LOG.error(_("Not support disk_format type:%s") % imageMeta['disk_format'])
            raise cas_error.CasImageException()
        
        container_format = imageMeta['container_format']
        if container_format not in ('bare', 'ova'):
            LOG.error(_("Not support container_format type:%s") % imageMeta['container_format'])
            raise cas_error.CasImageException()
    
    def get_image_type(self, imageMeta):
        disk_format = imageMeta['disk_format']
        container_format = imageMeta['container_format']
        if container_format != 'bare':
            return container_format
        else:
            return disk_format
