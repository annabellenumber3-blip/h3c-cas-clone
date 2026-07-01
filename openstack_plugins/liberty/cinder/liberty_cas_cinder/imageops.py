import time

from oslo_log import log as logging
from oslo_config import cfg

from cinder.i18n import _
from cinder.volume.drivers.cas import error as cas_error
from cinder.volume.drivers.cas import xml as casxml


CONF = cfg.CONF

LOG = logging.getLogger(__name__)

class CasImageOps(object):
    """
    Management class for Image-related tasks
    """
    image_dir = '/vms/nova/'
    
    def __init__(self, session):
        self._session = session
        self._xml = casxml.ImageXml()
    
    def _has_space_on_host(self, image_size):
        uri = self._session.make_cmd_uri('/nova/pool')
        resp,body = self._session.call_method("GET",uri)
        if resp.status_code == 200:
            pool_info = self._xml.decode_xml("pool_info",body)
            if pool_info['freeSize'] > image_size:
                return True
            else:
                return False
        else:
            LOG.error(_("fail to get host space, uri:%s") % uri)
            LOG.error(_("fail to get host space!!!!! resp.status_code:%d,%s")
                     % (resp.status_code,cas_error.get_http_respond_error(resp)))
            raise cas_error.CasHostException()

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
    
    def prepare_image_file_checksum(self,context,host,port,imageMeta):
        image_file = imageMeta['id']
        image_size = imageMeta['size']
        image_type = imageMeta['disk_format']
        checksum = imageMeta['checksum'] if CONF.cas_image_checksum else None
        
        LOG.info(_("prep image:%s,%s,%s,%s") % (image_file,image_size,image_type,checksum))
        status = self._find_image_in_nova_checksum(image_file,image_size,checksum)
        if 1 == status:
            LOG.info(_("image:%s already exist on the cas.") % image_file)
            return self.image_dir + image_file
        
        if 0 == status:
            # create base file or iso
            # transfer image or iso from glance to cas
            hasSpace = self._has_space_on_host(image_size)
            if not hasSpace:
                LOG.error(_("image:%s does not exist on the cas, but cas does not have enough space!") % image_file)
                raise cas_error.CasHostException()
            
            LOG.info(_("image:%s does not exist on the cas, begin to fetch image to cas!") % image_file)
            try:
                self._download_image(context,host,port,image_file,image_type,image_size,checksum=checksum)
            except Exception as exc:
                ck_status = self._find_image_in_nova_checksum(image_file,image_size,checksum)
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
                wait_status = self._find_image_in_nova_checksum(image_file,image_size,checksum)
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
        snap_meta = {"disk_format": imageMeta["disk_format"],
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
    
    def check_image_type(self, imageMeta):
        """
        check disk_format and container_format of the imagefile.
        """
        
        container_format = imageMeta['container_format']
        if container_format != 'bare':
            LOG.error(_("Not support container_format type:%s") % container_format)
            raise cas_error.CasImageException()
        
        disk_format = imageMeta['disk_format']
        if disk_format not in ('qcow2','raw'):
            LOG.error(_("Not support disk_format type:%s") % disk_format)
            raise cas_error.CasImageException()
