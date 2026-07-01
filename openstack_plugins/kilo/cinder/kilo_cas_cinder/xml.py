#add by zhangmingze, 2014-2-12

import string
from lxml import etree

class CasXml(object):
    """base xml object"""
    def encode_xml(self, method, **kwargs):
        op = getattr(self,method)
        root = op(**kwargs)
        return etree.tostring(root,encoding='unicode')
    
    def decode_xml(self, method, xmlstr):
        xml_body = self.skip_xml_head(xmlstr)
        op = getattr(self,method)
        result = op(etree.fromstring(xml_body))
        return result
    
    def skip_xml_head(self, xmlstr):
        pos = xmlstr.find('?>')
        if pos != -1:
            return xmlstr[pos+2:]
        else:
            return xmlstr
    
    def create_SubElement(self, root, **kwargs):
        for key in kwargs.keys():
            if isinstance(kwargs[key],dict):
                element = etree.SubElement(root,key)
                self.create_SubElement(element,**kwargs[key])
            elif isinstance(kwargs[key],list):
                for value in kwargs[key]:
                    element = etree.SubElement(root,key)
                    if isinstance(value,dict):
                        self.create_SubElement(element,**value)
                    elif isinstance(kwargs[key],str) or isinstance(kwargs[key],unicode):
                        element.text = value
                    else:
                        element.text = str(value)
            elif isinstance(kwargs[key], set):
                element = etree.SubElement(root,key)
                text = ''
                for value in kwargs[key]:
                    if isinstance(value,str) or isinstance(value,unicode):
                        text += value + ','
                    else:
                        text += str(value) + ','
                element.text = text.rstrip(',')
            else:
                element = etree.SubElement(root,key)
                if isinstance(kwargs[key],str) or isinstance(kwargs[key],unicode):
                    element.text = kwargs[key]
                else:
                    element.text = str(kwargs[key])
    
    def get_message_id(self, root):
        msgId = root.find("msgId").text
        return msgId
    
    def wait_for_task(self, root):
        vm_info = {}
        completed = root.find("completed").text
        vm_info["completed"] = completed
        if completed == "true":
            result = int(root.find("result").text)
            vm_info["result"] = result
            if result != 0:
                vm_info["failMsg"] = root.find("failMsg").text
        return vm_info

class VolumeXml(CasXml):
    """xml object to operate volume"""
    def get_available_storage (self, root):
        return root.find('poolName').text
    
    def check_available_storage(self, **kwargs):
        root = etree.Element("volume")
        self.create_SubElement(root,**kwargs)
        return root
    
    def volume_resize_data_to_xml(self, **kwargs):
        root = etree.Element("storageVolume")
        self.create_SubElement(root,**kwargs)
        return root
    
    def volume_migrate_data_to_xml(self, **kwargs):
        root = etree.Element("volume")
        self.create_SubElement(root,**kwargs)
        return root
    
    def copy_volume_data_to_xml(self, **kwargs):
        root = etree.Element("copyVolume")
        self.create_SubElement(root,**kwargs)
        return root
    
    def volume_create_data_to_xml(self, **kwargs):
        root = etree.Element("volume")
        self.create_SubElement(root,**kwargs)
        return root
    
    def volume_convert_data_to_xml(self, **kwargs):
        root = etree.Element("volume")
        self.create_SubElement(root,**kwargs)
        return root
    
    def volume_add_record(self, **kwargs):
        root = etree.Element("volume")
        self.create_SubElement(root,**kwargs)
        return root
    
    def node_storage(self, root):
        storages = {}
        for storagePool in root.findall("storagePool"):
            name = storagePool.find("name").text
            path = storagePool.find("path").text
            type = storagePool.find("type").text
            totalSize = storagePool.find("totalSize").text
            freeSize = storagePool.find("freeSize").text
            preAllocation = storagePool.find("preAllocation").text
            status = storagePool.find("status").text
            fsType = storagePool.find("fsType").text
            storage = {'name':name,'path':path,'type':type,'totalSize':string.atoi(totalSize),
                       'freeSize':string.atoi(freeSize),'preAllocation':string.atoi(preAllocation),
                       'status':string.atoi(status),'fsType':fsType}
            storages.update({name:storage})
        return storages
    
    def volume_get_size(self, root):
        size = int(root.find('size').text)
        return size
    
    def query_volume_info(self, root):
        hpName = root.find('hpName').text
        return hpName
    
    def volume_get_info(self, root):
        volume_format = root.find('format').text if root.find('format') != None else None
        writezero = root.find('writeZero').text if root.find('writeZero') != None else None
        size = root.find('size').text if root.find('size') != None else None
        info = {'volume_format':volume_format,'writezero':writezero,'size':size}
        
        return info
    
class ImageXml(CasXml):
    """xml object to operate image"""
    def pool_info(self, root):
        diskSize = root.find('diskSize').text
        freeSize = root.find('diskUsed').text
        diskSize = int(diskSize)
        freeSize = int(freeSize)
        return {'diskSize':diskSize,'freeSize':freeSize}
    
    def download_image(self, **kwargs):
        root = etree.Element("image")
        self.create_SubElement(root,**kwargs)
        return root
    
    def update_image(self, **kwargs):
        root = etree.Element("image")
        self.create_SubElement(root,**kwargs)
        return root
