from oslo_log import log as logging
from cinder.i18n import _
from cinder.volume.drivers.cas import error as cas_error
from cinder.volume.drivers.cas import xml as casxml
from oslo_utils import units

LOG = logging.getLogger(__name__)

class CasVolumeOps(object):
    """Manages volume operations."""
    
    def __init__(self, session):
        self._session = session
        self._xml = casxml.VolumeXml()
        self._storagePools = {}
    
    def get_exclude_stroage_prefix(self, volumeType):
        excludePrefix = set()
        
        if volumeType != 'any':
            storagePrefix = "_%s_" % volumeType
            excludePrefix = set(['_normal_','_highCapacity_','_highIO_']) - set([storagePrefix])
            
        return excludePrefix
    
    def _query_storage_pool_list(self, poolType, hostpoolName, clusterName=None):
        storages = {}
        if clusterName:
            uri = self._session.make_cmd_uri('/cinder/node/storage',hpName=hostpoolName,clusterName=clusterName,poolTypes=poolType)
        else:
            uri = self._session.make_cmd_uri('/cinder/node/storage',hpName=hostpoolName,poolTypes=poolType)
        resp, body = self._session.call_method("GET",uri)
        if resp.status_code == 200:
            storages = self._xml.decode_xml("node_storage",body)
            for storage in storages.values():
                storage['hpname'] = hostpoolName
        else:
            LOG.info(_("fail to query storage pool list. uri:%s") % uri)
            LOG.info(_("fail to query storage pool list. resp.status_code:%d, %s")
                     % (resp.status_code,cas_error.get_http_respond_error(resp)))
        
        return storages

    def get_storage_resource(self, poolType, hostpoolName, clusterName=None):
        pool_info = {}
        hostname = hostpoolName.decode('utf-8')
        if clusterName:
            for cluster in clusterName:
                clustername = cluster.decode('utf-8')
                storages = self._query_storage_pool_list(poolType,hostname,clustername)
                if storages:
                    pool_info.update(storages)
                else:
                    LOG.warning(_("cluster:%s cannot access the storage pool information") % cluster)
        else:
            pool_info = self._query_storage_pool_list(poolType,hostname)
        self._storagePools = pool_info
        storage_resource = {'storage_pool':[],'total_capacity_gb':0,'free_capacity_gb':0,'provisioned_capacity_gb':0}

        for storageName,storagePool in self._storagePools.items():
            if storagePool['status'] == 1:
                storage_resource['storage_pool'].append(storageName)
                storage_resource['total_capacity_gb'] += storagePool['totalSize']
                storage_resource['free_capacity_gb'] += storagePool['freeSize']
                storage_resource['provisioned_capacity_gb'] += storagePool['preAllocation']

        storage_resource['total_capacity_gb'] = storage_resource['total_capacity_gb'] / 1024
        storage_resource['free_capacity_gb'] = storage_resource['free_capacity_gb'] / 1024
        storage_resource['provisioned_capacity_gb'] = storage_resource['provisioned_capacity_gb'] / 1024

        return storage_resource
    
    def query_storage_pool_list(self):
        return self._storagePools.values()
    
    def get_datastores_summary(self, hostpoolName):
        storagePools = []
        for storagePool in self._storagePools.values():
            total_gb = storagePool['totalSize']/1024
            free_gb = storagePool['freeSize']/1024
            provisioned_gb = storagePool['preAllocation']/1024
            backend_type = storagePool['fsType']
            backend_state ='up' if storagePool['status'] == 1 else 'down'
            
            datastore = {'hostpool_name':hostpoolName,'datastore_name':storagePool['name'],
                         'total_capacity_gb':total_gb,'free_capacity_gb':free_gb,
                         'provisioned_capacity_gb':provisioned_gb,
                         'backend_type':backend_type,'backend_state':backend_state}
            storagePools.append(datastore)
        
        return storagePools
    
    def check_volume_exist(self, volumeName):
        uri = self._session.make_cmd_uri('/cinder/ifExists',filename=volumeName)
        resp, body = self._session.call_method("GET",uri)
        if resp.status_code == 200:
            if body:
                return self._xml.decode_xml('query_volume_info',body)
            else:
                return None
        else:
            LOG.error(_("fail to check volume[%s] exist. uri:%s") % (volumeName,uri))
            LOG.error(_("fail to check volume[%s] exist. status_code:%d. %s")
                      % (volumeName,resp.status_code,cas_error.get_http_respond_error(resp)))
            raise cas_error.CasVolumeException()
    
    def get_volume_info(self, hostpoolName, volumeName):
        uri = self._session.make_cmd_uri('/cinder/volume/info',hpName=hostpoolName,filename=volumeName)
        resp, body = self._session.call_method("GET",uri)
        if resp.status_code == 200:
            info = self._xml.decode_xml("volume_get_info", body)
        else:
            LOG.error(_("fail to get volume:%s info,uri:%s") % (volumeName,uri))
            LOG.error(_("fail to get volume:%s info,status_code:%d,%s")
                      % (volumeName,resp.status_code,cas_error.get_http_respond_error(resp)))
            raise cas_error.CasVolumeException()
        return info
    
    def _copy_volume_by_name(self, srcName, destName, storageName=None, writeZero=None, volumeType='any', parentId=None):
        volume_args = {'srcName':srcName,'destName':destName}
        if storageName is not None:
            volume_args['location'] = storageName
            LOG.info(_("volume %s will be create in storage pool:%s") % (destName,storageName))
        else:
            excludePrefix = self.get_exclude_stroage_prefix(volumeType)
            if excludePrefix:
                volume_args['excludePrefix'] = excludePrefix
        if writeZero is not None:
            volume_args['writeZero'] = writeZero
        if parentId is not None:
            volume_args['parentId'] = parentId
        name_split = destName.split('-')
        if len(name_split) > 1:
            volume_args['type'] = name_split[0]
        uri = self._session.make_cmd_uri('/cinder/volume/copy')
        xmlstr = self._xml.encode_xml('copy_volume_data_to_xml',**volume_args)
        resp, body = self._session.call_method("POST",uri,body=xmlstr)
        if resp.status_code != 200:
            LOG.error(_("fail to copy volume[src:%s,dst:%s]. uri:%s, xmlstr:%s") % (srcName,destName,uri,xmlstr))
            LOG.error(_("fail to copy volume[src:%s,dst:%s]. status_code:%d, %s")
                      % (srcName,destName,resp.status_code, cas_error.get_http_respond_error(resp)))
            raise cas_error.CasVolumeException()
        else:
            msgId = self._xml.decode_xml('get_message_id',body)
            task = self._session.wait_for_task(msgId)
            if task['result'] != 0:
                LOG.error(_("fail to copy volume[src:%s,dst:%s]. uri:%s, xmlstr:%s") % (srcName,destName,uri,xmlstr))
                LOG.error(_("fail to copy volume[src:%s,dst:%s]. failMsg:%s") % (srcName,destName,task['failMsg']))
                raise cas_error.CasVolumeException()
    
    def _delete_volume(self, volumeName):
        uri = self._session.make_cmd_uri('/cinder/volume/delete',volumeName=volumeName)
        resp, body = self._session.call_method("DELETE",uri)
        if resp.status_code != 204:
            LOG.error(_("fail to delete volume[%s]. uri:%s") % (volumeName,uri))
            LOG.error(_("fail to delete volume[%s]. status_code:%d, %s")
                      % (volumeName,resp.status_code, cas_error.get_http_respond_error(resp)))
            raise cas_error.CasVolumeException()
    
    def addRecord_volume(self, volumeName, aliasName, hostpoolName):
        volume_args = {'name':volumeName,'alias':aliasName,'hpName':hostpoolName}
        
        uri = self._session.make_cmd_uri('/cinder/volume/addRecord')
        xmlstr = self._xml.encode_xml("volume_add_record",**volume_args)
        resp, body = self._session.call_method("POST",uri,body=xmlstr)
        if resp.status_code != 204:
            LOG.error(_("fail to add volume[%s] record. uri:%s, xmlstr:%s") % (volumeName,uri,xmlstr))
            LOG.error(_("fail to add volume[%s] record. status_code:%d, %s")
                      % (volumeName,resp.status_code, cas_error.get_http_respond_error(resp)))
            raise cas_error.CasVolumeException()
    
    def backup_volume(self, volumeName, backupName, parentId=None):
        self._copy_volume_by_name(volumeName,backupName,parentId=parentId)
    
    def restore_backup(self, volumeName, backupName, volumeSize=None, backupSize=None, parentId=None,write_zero=None):
        try:
            self._delete_volume(volumeName)
        except:
            LOG.warning(_("volume %s disapper by itself.") % volumeName)
        
        self._copy_volume_by_name(backupName,volumeName,writeZero=write_zero,parentId=parentId)
        if volumeSize > backupSize:
            size = volumeSize * units.Gi / units.Mi
            self.volume_resize_and_convert(volumeName,size)
    
    def delete_backup(self, backupName):
        self.delete_volume(backupName)
        
    def create_volume(self, volumeName, volumeArgs, hostpoolName):
        volume_args = {'name':volumeName,'size':volumeArgs['volume_size'],'format':volumeArgs['volume_format'],
                       'hpName':hostpoolName,'writeZero':volumeArgs['write_zero'],'poolType':volumeArgs['pool_type']}
        
        storageName = volumeArgs['storageName']
        if storageName is not None:
            volume_args['location'] = storageName
            LOG.info(_("volume %s will be create in storage pool:%s") % (volumeName,storageName))
        else:
            excludePrefix = self.get_exclude_stroage_prefix(volumeArgs['volume_type'])
            if excludePrefix:
                volume_args['excludePrefix'] = excludePrefix
        
        uri = self._session.make_cmd_uri('/cinder/volume/create')
        xmlstr = self._xml.encode_xml("volume_create_data_to_xml",**volume_args)
        resp,body = self._session.call_method('POST',uri,body=xmlstr)
        if resp.status_code == 200:
            msgId = self._xml.decode_xml('get_message_id',body)
            task = self._session.wait_for_task(msgId)
            if task['result'] != 0:
                LOG.error(_("fail to create volume[%s]. uri:%s, xmlstr:%s") % (volumeName,uri,xmlstr))
                LOG.error(_("fail to create volume[%s]. failMsg:%s") % (volumeName,task['failMsg']))
                raise cas_error.CasVolumeException()
        else:
            LOG.error(_("fail to create volume[%s]. uri:%s, xmlstr:%s") % (volumeName,uri,xmlstr))
            LOG.error(_("fail to create volume[%s]. status_code:%d, %s")
                      % (volumeName,resp.status_code,cas_error.get_http_respond_error(resp)))
            raise cas_error.CasVolumeException()
    
    def delete_volume(self, volumeName):
        exist = self.check_volume_exist(volumeName)
        if exist:
            self._delete_volume(volumeName)
        else:
            LOG.info(_("volume %s disapper by itself, delete success.") % volumeName)
    
    def convert_volume_to_image(self, volumeName, imageId, imageFormat):
        uri = self._session.make_cmd_uri('/cinder/volume/convert')
        xmlstr = self._xml.encode_xml("volume_convert_data_to_xml",srcName=volumeName,destName=imageId,format=imageFormat)
        resp,body = self._session.call_method('POST',uri,body=xmlstr)
        if resp.status_code != 200:
            LOG.error(_("fail to convert volume[%s]. uri:%s, xmlstr:%s") % (volumeName,uri,xmlstr))
            LOG.error(_("fail to create volume[%s]. status_code:%d, %s")
                      % (volumeName,resp.status_code,cas_error.get_http_respond_error(resp)))
            raise cas_error.CasVolumeException()
        else:
            msgId = self._xml.decode_xml('get_message_id',body)
            task = self._session.wait_for_task(msgId)
            if task['result'] != 0:
                LOG.error(_("fail to convert volume[%s]. uri:%s, xmlstr:%s") % (volumeName,uri,xmlstr))
                LOG.error(_("fail to convert volume[%s]. failMsg:%s") % (volumeName,task['failMsg']))
                raise cas_error.CasVolumeException()
    
    def create_volume_from_image(self, volumeName, image, hostpoolName, volumeArgs):
        volume_args = {'name':volumeName,'image':image,'hpName':hostpoolName,
                       'writeZero':volumeArgs['write_zero'],'poolType':volumeArgs['pool_type']}
        storageName = volumeArgs['storageName']
        if storageName is not None:
            volume_args['location'] = storageName
            LOG.info(_("volume %s will be create in storage pool:%s") % (volumeName,storageName))
        else:
            excludePrefix = self.get_exclude_stroage_prefix(volumeArgs['volume_type'])
            if excludePrefix:
                volume_args['excludePrefix'] = excludePrefix
        
        uri = self._session.make_cmd_uri('/cinder/volume/createFromImage')
        xmlstr = self._xml.encode_xml("volume_create_data_to_xml", **volume_args)
        resp,body = self._session.call_method('POST',uri,body=xmlstr)
        if resp.status_code != 200:
            LOG.error(_("fail to create volume from image. uri:%s, xmlstr:%s") % (uri,xmlstr))
            LOG.error(_("fail to create volume from image. status_code:%d, %s")
                      % (resp.status_code, cas_error.get_http_respond_error(resp)))
            raise cas_error.CasVolumeException()
        else:
            msgId = self._xml.decode_xml('get_message_id',body)
            task = self._session.wait_for_task(msgId)
            if task['result'] != 0:
                LOG.error(_("fail to create volume from image. uri:%s, xmlstr:%s") % (uri,xmlstr))
                LOG.error(_("fail to create volume from image. failMsg:%s") % task['failMsg'])
                raise cas_error.CasVolumeException()
        
    def create_snapshot_from_volume(self, snapshot):
        self._copy_volume_by_name(snapshot['volume_name'],snapshot['name'])
    
    def create_volume_from_snapshot(self, volumeName, snapName, volumeSize, storageName, volumeFormat, writeZero, volumeType):
        self._copy_volume_by_name(snapName,volumeName,storageName,writeZero,volumeType)
        self.volume_resize_and_convert(volumeName,volumeSize,volumeFormat)
    
    def create_volume_from_volume(self, volumeName, srcVolumeName, volumeSize, storageName, volumeFormat, writeZero, volumeType):
        self._copy_volume_by_name(srcVolumeName,volumeName,storageName,writeZero,volumeType)
        self.volume_resize_and_convert(volumeName,volumeSize,volumeFormat)
    
    def volume_resize_and_convert(self, volumeName, volumeSize, volumeFormat=None):
        volume_args = {'name':volumeName,'size':volumeSize}
        if volumeFormat is not None:
            volume_args['format'] = volumeFormat
        
        uri = self._session.make_cmd_uri('/cinder/volume/resize')
        xmlstr = self._xml.encode_xml("volume_resize_data_to_xml",**volume_args)
        resp,body = self._session.call_method('PUT',uri,body=xmlstr)
        if resp.status_code == 200:
            msgId = self._xml.decode_xml("get_message_id",body)
            task = self._session.wait_for_task(msgId)
            if task['result'] != 0:
                LOG.error(_("fail to resize volume[%s]. uri:%s, xmlstr:%s") % (volumeName,uri,xmlstr))
                LOG.error(_("fail to resize volume[%s]. failMsg:%s") % (volumeName,task['failMsg']))
                raise cas_error.CasVolumeException()
        else:
            LOG.error(_("fail to resize volume[%s]. uri:%s, xmlstr:%s") % (volumeName,uri,xmlstr))
            LOG.error(_("fail to resize volume[%s]. status_code:%d, %s")
                      % (volumeName,resp.status_code,cas_error.get_http_respond_error(resp)))
            raise cas_error.CasVolumeException()
    
    def migrate_volume(self, volumeName, hostpoolNname, storageName=None, volumeType='any'):
        volume_args = {'name':volumeName,'hpName':hostpoolNname}
        if storageName:
            volume_args['location'] = storageName
            LOG.info(_("volume %s will be migrate to storage pool:%s") % (volumeName,storageName))
        else:
            excludePrefix = self.get_exclude_stroage_prefix(volumeType)
            if excludePrefix:
                volume_args['excludePrefix'] = excludePrefix
        
        uri = self._session.make_cmd_uri('/cinder/volume/migrate')
        xmlstr = self._xml.encode_xml("volume_migrate_data_to_xml", **volume_args)
        resp,body = self._session.call_method('PUT',uri,body=xmlstr)
        if resp.status_code == 200:
            msgId = self._xml.decode_xml("get_message_id",body)
            task = self._session.wait_for_task(msgId)
            if task['result'] != 0:
                LOG.error(_("fail to migrate volume[%s]. uri:%s, xmlstr:%s") % (volumeName,uri,xmlstr))
                LOG.error(_("fail to migrate volume[%s]. failMsg:%s") % (volumeName,task['failMsg']))
                raise cas_error.CasVolumeException()
        else:
            LOG.error(_("fail to migrate volume[%s]. uri:%s, xmlstr:%s") % (volumeName,uri,xmlstr))
            LOG.error(_("fail to migrate volume[%s]. status_code:%d, %s")
                      % (volumeName,resp.status_code, cas_error.get_http_respond_error(resp)))
            raise cas_error.CasVolumeException()
    
    def check_storage_resource(self, volumeName, volumeSize, storageName, volumeType):
        if storageName:
            storagePool = self._storagePools.get(storageName)
            if not storagePool or storagePool['status'] == 0 or storagePool['freeSize'] < volumeSize:
                LOG.info(_("Invalid value of location with volume[%s].") % volumeName)
                raise cas_error.CasVolumeException()
        else:
            excludePrefix = self.get_exclude_stroage_prefix(volumeType)
            
            for poolName, storagePool in self._storagePools.items():
                for prefix in excludePrefix:
                    if poolName.startswith(prefix):
                        break
                else:
                    if storagePool['freeSize'] >= volumeSize:
                        break
            else:
                LOG.info(_("No storage pool has enough free size for volume[%s].") % volumeName)
                raise cas_error.CasVolumeException()
        
        return storageName
    
    def get_available_storage(self, volumeSize, hostpoolName, storageName, volumeType, limit_spec):
        volume_args = {'size':volumeSize,'hpName':hostpoolName}
        volume_args.update(limit_spec)
        
        if storageName:
            volume_args['location'] = storageName
            LOG.info(_("Check whether storage pool:%s available.") % storageName)
        else:
            excludePrefix = self.get_exclude_stroage_prefix(volumeType)
            if excludePrefix:
                volume_args['excludePrefix'] = excludePrefix
        
        uri = self._session.make_cmd_uri('/cinder/resource')
        xmlstr = self._xml.encode_xml("check_available_storage",**volume_args)
        resp,body = self._session.call_method("PUT",uri,body=xmlstr)
        if resp.status_code != 200:
            LOG.error(_("fail to get available storage, uri:%s, xmlstr:%s") % (uri,xmlstr))
            LOG.error(_("fail to get available storage, resp.status_code:%s, %s") %
                     (resp.status_code,cas_error.get_http_respond_error(resp)))
            raise cas_error.CasVolumeException()
        else:
            storageName = self._xml.decode_xml("get_available_storage",body)
        
        return storageName
    
    def manage_existing_get_size(self, volume, existing_ref, hostpoolName):
        uri = self._session.make_cmd_uri('/cinder/volume/info',hpName=hostpoolName,filename=existing_ref['source-name'])
        resp, body = self._session.call_method("GET",uri)
        if resp.status_code == 200:
            size = self._xml.decode_xml("volume_get_size", body)
        else:
            LOG.error(_("fail to get existing volume:%s size,uri:%s") % (existing_ref['source-name'],uri))
            LOG.error(_("fail to get existing volume:%s size,status_code:%d,%s")
                      % (existing_ref['source-name'],resp.status_code,cas_error.get_http_respond_error(resp)))
            raise cas_error.CasVolumeException()
        return size
    
    def delRecord_volume(self, volumeName):
        uri = self._session.make_cmd_uri('/cinder/volume/deleteRecord',name=volumeName)
        resp, body = self._session.call_method("DELETE",uri)
        if resp.status_code != 204:
            LOG.error(_("fail to delete volume[%s] record. uri:%s") % (volumeName,uri))
            LOG.error(_("fail to delete volume[%s] record. status_code:%d,%s")
                      % (volumeName,resp.status_code,cas_error.get_http_respond_error(resp)))
            raise cas_error.CasVolumeException()
    
