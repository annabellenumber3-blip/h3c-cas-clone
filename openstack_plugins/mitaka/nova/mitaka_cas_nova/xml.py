#add by zhangmingze, 2014-2-12
import string
from lxml import etree
from nova.objects import fields

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
                    elif isinstance(value,str) or isinstance(value,unicode):
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
            result_info = root.find("result").text
            result = int(result_info)
            vm_info["result"] = result
            if result == 0:
                vm_info["targetId"] = root.find("targetId").text
                vm_info["targetName"] = root.find("targetName").text
                oldTaskObj = root.find("oldTask")
                if oldTaskObj is not None:
                    vm_info["oldTask"] = oldTaskObj.text
            else:
                vm_info["failMsg"] = root.find("failMsg").text
                
                for keyValueObj in root.findall('keyValue'):
                    key = keyValueObj.find("key").text
                    value = keyValueObj.find("value").text
                    vm_info[key] = value
            
        return vm_info

class HostXml(CasXml):
    """xml object to operate host"""
    def hostpool_list(self, root):
        hostpools = {}
        for hostpool in root.findall('hostPool'):
            id = hostpool.find("id").text
            name = hostpool.find("name").text
            hostpools[name] = id
        return hostpools
    
    def respool_list(self, root):
        respool_list = []
        for respool in root.findall('resPool'):
            id = respool.find('id').text
            name = respool.find('name').text
            type = respool.find('type').text
            cluster_id = respool.find('clusterId').text if respool.find('clusterId') != None else ''
            num = respool.find('num').text if respool.find('num') != None else ''
            vm_num = respool.find('vmNum').text if respool.find('vmNum') else ''
            respool_list.append({'id':id,
                              'name':name,
                              'type':type,
                              'cluster_id':cluster_id,
                              'num':num,
                              'vm_num':vm_num})
        return respool_list
    
    def gpu_list(self, root):
        gpu_list= []
        for gpu in root.findall('gpu'):
            bus = gpu.find('bus').text if gpu.find('bus') != None else ''
            producers = gpu.find('producers').text if gpu.find('producers') != None else ''
            clusterId = gpu.find('clusterId').text if gpu.find('clusterId') != None else ''
            hostId = gpu.find('hostId').text if gpu.find('hostId') != None else ''
            hostName = gpu.find('hostName').text if gpu.find('hostName') != None else ''
            isUsed = gpu.find('isUsed').text if gpu.find('isUsed') != None else ''
            type = gpu.find('type').text if gpu.find('type') != None else ''

            gpu_list.append({'bus':bus,
                             'producers':producers,
                             'clusterID':clusterId,
                             'hostId':hostId,
                             'hostName':hostName,
                             'isUsed':isUsed,
                             'type' : type})
        return gpu_list
    
    def vgpu_list(self, root):
        vgpu_list= []
        for vgpu in root.findall('vgpu'):
            bus = vgpu.find('bus').text if vgpu.find('bus') != None else ''
            type = vgpu.find('type').text if vgpu.find('type') != None else ''
            name = vgpu.find('name').text if vgpu.find('name') != None else ''
            maxInstance = vgpu.find('maxInstance').text if vgpu.find('maxInstance') != None else ''
            framebuffer = vgpu.find('framebuffer').text if vgpu.find('framebuffer') != None else ''
            maxResolution = vgpu.find('maxResolution').text if vgpu.find('maxResolution') != None else ''
            heads = vgpu.find('heads').text if vgpu.find('heads') != None else ''
            uuid = vgpu.find('uuid').text if vgpu.find('uuid') != None else ''
            hostId = vgpu.find('hostId').text if vgpu.find('hostId') != None else ''
            hostName = vgpu.find('hostName').text if vgpu.find('hostName') != None else ''
            clusterId = vgpu.find('clusterId').text if vgpu.find('clusterId') != None else ''
            isUsed = vgpu.find('isUsed').text if vgpu.find('isUsed') != None else ''
            title = vgpu.find('title').text if vgpu.find('title') != None else ''

            vgpu_list.append({'bus':bus,
                             'type':type,
                             'name':name,
                             'maxInstance':maxInstance,
                             'framebuffer':framebuffer,
                             'maxResolution':maxResolution,
                             'heads':heads,
                             'uuid':uuid,
                             'clusterID':clusterId,
                             'hostId':hostId,
                             'hostName':hostName,
                             'title':title,
                             'isUsed':isUsed})
        return vgpu_list
    
    def cluster_list(self, root):
        clusters = {}
        for cluster in root.findall('clusterList'):
            id = cluster.find("id").text
            name = cluster.find("name").text
            clusters[name] = id
        return clusters
    
    def list_instances(self, root):
        instances = {'names':[],'uuids':[]}
        for domain in root.findall("domain"):
            name = domain.find("name").text
            uuid = domain.find("uuid").text
            instances['names'].append(name)
            instances['uuids'].append(uuid)
        return instances
    
    def pool_info(self, root):
        diskSize = root.find('diskSize').text
        freeSize = root.find('diskUsed').text
        diskSize = int(diskSize)
        freeSize = int(freeSize)
        return {'diskSize':diskSize,'freeSize':freeSize}
    
    def host_list(self, root):
        hosts = {}
        for host in root.findall("host"):
            id = host.find("id").text
            name = host.find("name").text
            status = int(host.find("status").text)
            if status != 1:
                continue
            
            cpu = int(host.find("cpu").text)
            physicalCpuObj = host.find("physical_cpu")
            if physicalCpuObj is not None:
                physical_cpu = int(physicalCpuObj.text)
            else:
                physical_cpu = 0
            
            cpuRateItem = host.find("cpuRate")
            if cpuRateItem is not None:
                cpuRate = float(cpuRateItem.text)
            else:
                cpuRate = 0
            
            memory = int(host.find("memory").text)
            memoryRateItem = host.find("memoryRate")
            if memoryRateItem is not None:
                memoryRate = float(memoryRateItem.text)
            else:
                memoryRate = 0
            
            kernelTypeObj = host.find("kernelType")
            if kernelTypeObj is not None:
                kernelType = kernelTypeObj.text
            else:
                kernelType = None
            
            local_raw_disks = []
            local_raw_disks_obj = host.find("local_raw_disks")
            if local_raw_disks_obj is not None:
                for local_raw_disk_item in local_raw_disks_obj.findall("local_raw_disk"):
                    local_raw_disk = {}
                    type_obj = local_raw_disk_item.find("type")
                    size_obj = local_raw_disk_item.find("size")
                    num_obj = local_raw_disk_item.find("num")
                    if (type_obj is not None and size_obj is not None and num_obj is not None):
                        local_raw_disk['type'] = type_obj.text
                        local_raw_disk['size'] = int(size_obj.text)
                        local_raw_disk['num'] = int(num_obj.text)
                        local_raw_disks.append(local_raw_disk)
            
            hosts[name] = {"id":id,"name":name,"status":status,"cpu":cpu,"cpuRate":cpuRate,
                           "memory":memory,"memoryRate":memoryRate,"physical_cpu":physical_cpu,
                           "local_raw_disks":local_raw_disks,
                           "kernel_type":kernelType}
        
        return hosts
    
    def node_storage(self, root):
        storages = {'sharePools':{},'localPools':{}}
        
        for storagePool in root.findall("storagePool"):
            type = storagePool.find("type").text
            if type in ('dir','fs'):
                name = storagePool.find("name").text
                path = storagePool.find("path").text
                totalSize = storagePool.find("totalSize").text
                freeSize = storagePool.find("freeSize").text
                preAllocation = storagePool.find("preAllocation").text
                status = storagePool.find("status").text
                storage = {'name':name,'path':path,'type':type,'totalSize':int(totalSize),
                           'freeSize':int(freeSize),'preAllocation':string.atoi(preAllocation),'status':int(status)}
                
                if type == 'dir':
                    mountDev = storagePool.find("mountDev").text
                    mountDevPool = storages['localPools'].setdefault(mountDev,{})
                    mountDevPool[name] = storage
                else:
                    storages['sharePools'][name] = storage
        return storages
    
    def pci_devices(self, root):
        devices = []
        for pci_device in root.findall("device"):
            dev_id = pci_device.find("name").text
            parent_devname = pci_device.find("parent").text
            capability = pci_device.find("capability")
            address = "%04x:%02x:%02x.%1x" % (
                int(capability.find("domain").text),
                int(capability.find("bus").text),
                int(capability.find("slot").text),
                int(capability.find("function").text))
            product = capability.find("product")
            product_id = "%04x" % int(product.get('id'),base=16)
            vendor = capability.find("vendor")
            vendor_id = "%04x" % int(vendor.get('id'),base=16)
            numa_id = capability.find("numa")
            numa_node = None if numa_id is None else int(numa_id.text)
            
            device = {"dev_id": dev_id,
                      "address": address,
                      "product_id": product_id,
                      "vendor_id": vendor_id,
                      "numa_node": numa_node,
                      "label": "label_%s_%s" % (vendor_id,product_id),
                      "dev_type": fields.PciDeviceType.SRIOV_VF,
                      "parent_devname": parent_devname
                     }
            
            devices.append(device)
        
        return devices
    
    def parse_cpu_spec(self,spec):
        """Parse a CPU set specification.

        Each element in the list is either a single CPU number, a range of
        CPU numbers, or a caret followed by a CPU number to be excluded
        from a previous range.

        :param spec: cpu set string eg "1-4,^3,6"

        :returns: a set of CPU indexes
        """
        cpuset_ids = set()
        cpuset_reject_ids = set()
        for rule in spec.split(','):
            rule = rule.strip()
            # Handle multi ','
            if len(rule) < 1:
                continue
            # Note the count limit in the .split() call
            range_parts = rule.split('-',1)
            if len(range_parts) > 1:
                reject = False
                if range_parts[0] and range_parts[0][0] == '^':
                    reject = True
                    range_parts[0] = str(range_parts[0][1:])
            
                # So, this was a range; start by converting the parts to ints
                try:
                    start,end = [int(p.strip()) for p in range_parts]
                except ValueError:
                    raise exception.Invalid(_("Invalid range expression %r")
                                            % rule)
                # Make sure it's a valid range
                if start > end:
                    raise exception.Invalid(_("Invalid range expression %r")
                                            % rule)
                # Add available CPU ids to set
                if not reject:
                    cpuset_ids |= set(range(start,end + 1))
                else:
                    cpuset_reject_ids |= set(range(start,end + 1))
            elif rule[0] == '^':
                # Not a range, the rule is an exclusion rule; convert to int
                try:
                    cpuset_reject_ids.add(int(rule[1:].strip()))
                except ValueError:
                    raise exception.Invalid(_("Invalid exclusion "
                                              "expression %r") % rule)
            else:
                # OK, a single CPU to include; convert to int
                try:
                    cpuset_ids.add(int(rule))
                except ValueError:
                    raise exception.Invalid(_("Invalid inclusion "
                                              "expression %r") % rule)
    
        # Use sets to handle the exclusion rules for us
        cpuset_ids -= cpuset_reject_ids
    
        return cpuset_ids
    
    def numa_topology(self, root):
        numas = []
        for numa in root.findall("numa"):
            id = numa.find('id').text
            memory = numa.find('memory').text
            
            cpus = []
            siblings = []
            for cpu in numa.findall('cpu'):
                cpu_id = cpu.find('id').text
                cpus.append(int(cpu_id))
                
                siblings_obj = cpu.find('siblings')
                if siblings_obj is not None:
                    cpu_siblings = self.parse_cpu_spec(siblings_obj.text)
                    siblings.append(cpu_siblings)
            
            mempages = []
            for mempage in numa.findall('mempage'):
                size = mempage.find('size').text
                total = mempage.find('total').text
                mempages.append({'size':long(size),'total':long(total)})
            
            numas.append({'id':int(id),'cpus':set(cpus),'siblings':siblings,'memory':long(memory),'mempages':mempages})
        return numas
    
    def storage_adapter_props(self, root):
        hostAdapters = []
        
        for hostAdapter in root.findall("hostAdapter"):
            hostName = hostAdapter.find('hostName').text
            props = {'host':hostName}
            
            initiator = None
            wwpns = []
            for adapter in hostAdapter.findall("adapter"):
                type = adapter.find("type").text
                if type == 'iSCSI':
                    initiator = adapter.find("wwn").text
                elif type == 'FC':
                    wwn = adapter.find("wwn").text
                    wwpns.append(wwn)
            
            if initiator:
                props['initiator'] = initiator
            
            if wwpns:
                props['wwpns'] = wwpns
            
            hostAdapters.append(props)
        
        return hostAdapters
    
    def lun_info(self, **kwargs):
        root = etree.Element("storage")
        self.create_SubElement(root,**kwargs)
        return root
    
    def migrate_host_info(self, root):
        host = {'hostId':root.find("id").text,'hostName':root.find("name").text,'storageInfo':None}
        storage_info_list = []
        for storage in root.findall("storage"):
            storage_info = {}
            if storage.find("storageVolumeName") is not None:
                storage_info['storageVolumeName'] = storage.find("storageVolumeName").text
            if storage.find("storagePoolName") is not None:
                storage_info['storagePoolName'] = storage.find("storagePoolName").text
            if storage.find("storagePoolPath") is not None:
                storage_info['storagePoolPath'] = storage.find("storagePoolPath").text
            storage_info_list.append(storage_info)
        host['storageInfo'] = storage_info_list
        return host
    
    def get_migrate_dest_host(self, **kwargs):
        root = etree.Element("domain")
        self.create_SubElement(root,**kwargs)
        return root
    def respool_business_template(self, root):
        template_list = []
        for template in root.findall('businessTem'):
            template_info = {}
            template_info['id'] = template.find('id').text
            template_info['name'] = template.find('name').text
            template_info['priority'] = int(template.find('priority').text)
            template_info['startMode'] = int(template.find('startMode').text)
            if template.find('proportion') is not None:
                template_info['proportion'] = int(template.find('proportion').text)
            template_list.append(template_info)
        return template_list
        
class VmXml(CasXml):
    """xml object to operate vm"""
    def instance_base(self, root):
        id = root.find("id").text
        hostName = root.find("hostName").text
        hostId = root.find("hostId").text
        return {'id':id,'hostId':hostId,'hostName':hostName}

    def instance_clusterinfo(self,root):
        clusterinfo = {}
        
        idObj = root.find("id")
        if idObj is not None:
            clusterinfo['id'] = idObj.text
        
        clusterIdObj = root.find("clusterId")
        if clusterIdObj is not None:
            clusterinfo['clusterId'] = clusterIdObj.text
        
        nameObj = root.find("name")
        if nameObj is not None:
            clusterinfo['name'] = nameObj.text

        titleObj = root.find("title")
        if titleObj is not None:
            clusterinfo['title'] = titleObj.text
        
        return clusterinfo
    
    def instance_cas_vm_rule(self,root):
        clusterDrsRule = {}
        clusterDrsRuleObj = root.find("clusterDrsRule")
        if clusterDrsRuleObj is not None:
            idObj = clusterDrsRuleObj.find("id")
            if idObj is not None:
                clusterDrsRule['id'] = idObj.text
            
            nameObj = clusterDrsRuleObj.find("name")
            if nameObj is not None:
                clusterDrsRule['name'] = nameObj.text
            
            clusterIdObj = clusterDrsRuleObj.find("clusterId")
            if clusterIdObj is not None:
                clusterDrsRule['clusterId'] = clusterIdObj.text
            
            drsTypeObj = clusterDrsRuleObj.find("drsType")
            if drsTypeObj is not None:
                clusterDrsRule['drsType'] = drsTypeObj.text
            vm_list = []
            vmListObjs = clusterDrsRuleObj.findall('vmList')
            for vm in vmListObjs:
                vm_item = {}
                titleObj = vm.find("title")
                if titleObj is not None:
                    vm_item['title'] = titleObj.text
                
                domainIdObj = vm.find("domainId")
                if domainIdObj is not None:
                    vm_item['domainId'] = domainIdObj.text
                
                domainNameObj = vm.find("domainName")
                if domainNameObj is not None:
                    vm_item['domainName'] = domainNameObj.text

                vmClusterIdObj = vm.find("cluserId")
                if vmClusterIdObj is not None:
                    vm_item['cluserId'] = vmClusterIdObj.text
                
                #there is no need to care about drsGroupType,while drsType=1(affinity),2(anti-affinity)
                #drsGroupTypeObj = vm.find("drsGroupType")
                #if drsGroupTypeObj is not None:
                #    vm_item['drsGroupType'] = drsGroupTypeObj.text
                
                vm_list.append(vm_item)
            clusterDrsRule['vmList'] = vm_list
        return clusterDrsRule
    
    def instance_info(self, root):
        state = root.find("status").text
        memory = root.find("memory").text
        cpu = root.find("cpu").text
        uuid = root.find("uuid").text
        
        originate = None
        originateObj = root.find("originate")
        if originateObj is not None:
            originate = originateObj.text

        managed_existed = None
        managedExistedObj = root.find("managedExisted")
        if managedExistedObj is not None:
            managed_existed = managedExistedObj.text
        vm_info = {"uuid":uuid,"state":state,"memory":memory,"cpu":cpu,"uuid":uuid,
                   'originate':originate,'managed_existed':managed_existed}
        return vm_info
    
    def instance_dts_info(self, root):
        dtsInfo = {'uuid':None,'hostId':None,'dtsType':None,
                   'vmType':None,'volume_list':[]}

        hostIdObj = root.find("hostId")
        if hostIdObj is not None:
            dtsInfo['hostId'] = hostIdObj.text
    
        vmUuidObj = root.find("vmUuid")
        if vmUuidObj is not None:
            dtsInfo['uuid'] = vmUuidObj.text
    
        dtsTypeObj = root.find("dtsType")
        if dtsTypeObj is not None:
            dtsInfo['dtsType'] = dtsTypeObj.text
    
        vmTypeObj = root.find("vmType")
        if vmTypeObj is not None:
            dtsInfo['vmType'] = vmTypeObj.text
    
        for volumeObj in root.findall("volume"):
            if volumeObj is not None:
                dtsInfo['volume_list'].append(volumeObj.text)

        return dtsInfo
    
    def instance_detail_storage(self, root):
        storages = {}
        
        for storage in root.findall("storage"):
            deviceName = storage.find("deviceName").text
            path_obj = storage.find("path")
            if path_obj is not None:
                storages[deviceName] = {"path":path_obj.text}
        
        return storages
    
    def get_pci_vpci_map(self, root):
        pci_map = {}
        for pci_entry in root.findall(".//entry"):
            key = pci_entry.find("key").text
            value = pci_entry.find("value").text
            pci_map[key] = value
        return pci_map
    
    def instance_detail_disk(self, root):
        storages = {}
        
        for storage in root.findall("storage"):
            device = storage.find("device").text
            if device == 'disk':
                deviceName = storage.find("deviceName").text
                path = storage.find("path").text
                storages['/dev/'+deviceName] = {"path":path}
        
        return storages

    def instance_detail_disk_allinfo(self,root):
        disks = []
        
        for storage in root.findall("storage"):
            disk = {}
            device = storage.find("device").text
            if device == 'disk':
                path = storage.find("path").text
                size = storage.find("size").text
                fileType = storage.find("fileType").text
                format = storage.find("format").text
                deviceName = storage.find("deviceName").text
                targetBus = storage.find("targetBus").text
                allocation = storage.find("allocation").text
                maxSize = storage.find("maxSize").text
                cacheType = storage.find("cacheType").text
                snapShot = storage.find("snapShot").text
                disk['path'] = path
                disk['size'] = size
                disk['fileType'] = fileType
                disk['format'] = format
                disk['deviceName'] = deviceName
                disk['targetBus'] = targetBus
                disk['allocation'] = allocation
                disk['maxSize'] = maxSize
                disk['cacheType'] = cacheType
                disk['snapShot'] = snapShot
                mode = storage.find("mode")
                if mode is not None:
                    disk['mode'] = mode.text
                disks.append(disk)
        return disks
    
    def instance_bootdevs(self,root):
        boot_devs = []
        
        bootDev = root.find("bootDev")
        bootdevs = bootDev.find("bootdevs").text
        bootdevslist = bootdevs.split(',')
        for dev in bootdevslist:
            bootdev = {}
            dev = dev.split(';')
            bootdev['name'] = dev[0]
            bootdev['info'] = dev[1]
            boot_devs.append(bootdev)
        return boot_devs
    
    def instance_detail_cdrom(self, root):
        cdroms = {}
        
        for storage in root.findall("storage"):
            device = storage.find("device").text
            if device == 'cdrom':
                deviceName = storage.find("deviceName").text
                path_obj = storage.find("path")
                path = None if path_obj is None else path_obj.text
                cdroms[deviceName] = path
        
        return cdroms
    
    def instance_detail_interface(self, root):
        networks = {}
        
        for network in root.findall('network'):
            mac = network.find("mac").text
            netType = network.find("netType").text
            networks[mac] = {"netType":netType}
        
        return networks
    
    def instance_detail_cpu(self,root):
        cpu_info = root.find('cpu')
        cpuSockets = int(cpu_info.find('cpuSockets').text)
        cpuCores = int(cpu_info.find('cpuCores').text)
        cpuShares = int(cpu_info.find('cpuShares').text)
        maxCpuNum = int(cpu_info.find('maxCpuNum').text)
        cpuMode = cpu_info.find('cpuMode').text
        cpuArch  = cpu_info.find('cpuArch').text
        cpuMinRate = int(cpu_info.find('cpuMinRate').text)
        cpuMaxRate = int(cpu_info.find('cpuMaxRate').text)
        cpuGurantee = int(cpu_info.find('cpuGurantee').text)
        cpu = {'cpuSockets':cpuSockets,'cpuCores':cpuCores,'cpuShares':cpuShares,'maxCpuNum':maxCpuNum,'cpuMode':cpuMode,
               'cpuArch':cpuArch,'cpuMinRate':cpuMinRate,'cpuMaxRate':cpuMaxRate,'cpuGurantee':cpuGurantee}
        if cpu_info.find('cpuQuota') is not None:
            cpu['cpuQuota'] = float(cpu_info.find('cpuQuota').text)
            cpu['cpuQuotaUnit'] = cpu_info.find('cpuQuotaUnit').text
            
        return cpu
    
    def instance_detail_memory(self,root):
        mem_info = root.find('memory')
        size = long(mem_info.find('size').text)
        memoryBacking = int(mem_info.find('memoryBacking').text)
        memoryPriority = int(mem_info.find('memoryPriority').text)
        memoryInit = float(mem_info.find('memoryInit').text)
        memoryUnit = mem_info.find('memoryUnit').text
        maxMemory = long(mem_info.find('maxMemory').text)
        memory = {'size':size,'memoryBacking':memoryBacking,'memoryPriority':memoryPriority,
                  'memoryInit':memoryInit,'memoryUnit':memoryUnit,'maxMemory':maxMemory}
        if mem_info.find('memoryLimit') is not None:
            memory['memoryLimit'] = float(mem_info.find('memoryLimit').text)
            memory['memoryLimitUnit'] = mem_info.find('memoryLimitUnit').text
        
        return memory
    
    def instance_detail_title(self,root):
        title = root.find('title').text
        return title
    
    def instance_diagnostic(self, root):
        diagnosticInfo = {'dominfo':{},'vcpuinfo':[],'domblkstat':[],'domifstat':[],'memorystat':[]}
        
        domInfo = root.find('dominfo')
        diagnosticInfo['dominfo']['state'] = domInfo.find('state').text
        diagnosticInfo['dominfo']['maxMem'] = long(domInfo.find('maxMemory').text)
        diagnosticInfo['dominfo']['memory'] = long(domInfo.find('usedMemory').text)
        
        for vcpuInfo in root.findall('vcpuinfo'):
            number = vcpuInfo.find('vcpu').text
            cpuTime = long(vcpuInfo.find('cpuTime').text)
            diagnosticInfo['vcpuinfo'].append({'number':number,'cpuTime':cpuTime})
        
        for blkStat in root.findall('domblkstat'):
            name = blkStat.find('name').text
            rd_req = long(blkStat.find('rd_req').text)
            rd_bytes = long(blkStat.find('rd_bytes').text)
            wr_req = long(blkStat.find('wr_req').text)
            wr_bytes = long(blkStat.find('wr_bytes').text)
            errs = long(blkStat.find('errs').text)
            diagnosticInfo['domblkstat'].append({'name':name,'rd_req':rd_req,'rd_bytes':rd_bytes,'wr_req':wr_req,'wr_bytes':wr_bytes,'errs':errs})
        
        for ifStat in root.findall('domifstat'):
            name = ifStat.find('name').text
            mac = ifStat.find('mac').text
            rx_bytes = long(ifStat.find('rx_bytes').text)
            rx_packets = long(ifStat.find('rx_packets').text)
            rx_errs = long(ifStat.find('rx_errs').text)
            rx_drop = long(ifStat.find('rx_drop').text)
            tx_bytes = long(ifStat.find('tx_bytes').text)
            tx_packets = long(ifStat.find('tx_packets').text)
            tx_errs = long(ifStat.find('tx_errs').text)
            tx_drop = long(ifStat.find('tx_drop').text)
            diagnosticInfo['domifstat'].append({'name':name,'mac':mac,'rx_bytes':rx_bytes,'rx_packets':rx_packets,'rx_errs':rx_errs,
                                                'rx_drop':rx_drop,'tx_bytes':tx_bytes,'tx_packets':tx_packets,'tx_errs':tx_errs,'tx_drop':tx_drop})
        
        for memStat in root.findall('memorystat'):
            tag = memStat.find('tag').text
            val = long(memStat.find('val').text)
            diagnosticInfo['memorystat'].append({'tag':tag,'val':val})
        
        return diagnosticInfo
    
    def create_instance(self, **kwargs):
        root = etree.Element("domain")
        self.create_SubElement(root,**kwargs)
        return root
    
    def get_vnc_console(self, root):
        ip = root.find("ip").text
        port = root.find("port").text
        return {"ip":ip,"port":port}
    
    def get_spice_console(self, root):
        spice_info = {"id":None,"port":None,'host_ip':None}
        
        idObj = root.find("id")
        if idObj is not None:
            spice_info['id'] = idObj.text
        
        portObj = root.find("port")
        if portObj is not None:
            spice_info['port'] = portObj.text
        
        hostIpObj = root.find("hostIp")
        if hostIpObj is not None:
            spice_info['host_ip'] = hostIpObj.text
        
        return spice_info
    
    def add_console(self, **kwargs):
        root = etree.Element("domain")
        self.create_SubElement(root,**kwargs)
        return root
   
    def vm_manage(self, **kwargs):
        root = etree.Element("domain")
        self.create_SubElement(root,**kwargs)
        return root
     
    def config_vm(self, **kwargs):
        root = etree.Element("config")
        self.create_SubElement(root,**kwargs)
        return root
    
    def create_vm_rules(self, **kwargs):
        root = etree.Element("clusterDrsRule")
        self.create_SubElement(root,**kwargs)
        return root
    
    def edit_vm_rules(self, **kwargs):
        root = etree.Element("clusterDrsRule")
        self.create_SubElement(root,**kwargs)
        return root
    
    def config_drive(self, **kwargs):
        root = etree.Element("config")
        self.create_SubElement(root,**kwargs)
        return root
    
    def resize_instance(self, **kwargs):
        root = etree.Element("domain")
        self.create_SubElement(root,**kwargs)
        return root
    
    def migrate_instance(self, **kwargs):
        root = etree.Element("vmParamter")
        self.create_SubElement(root,**kwargs)
        return root
    
    def device_backup(self, **kwargs):
        root = etree.Element("domain")
        self.create_SubElement(root,**kwargs)
        return root
    
    def instance_modify(self, **kwargs):
        root = etree.Element("domain")
        self.create_SubElement(root,**kwargs)
        return root
    
    def instance_set_disks_qos(self, **kwargs):
        root = etree.Element("domain")
        self.create_SubElement(root,**kwargs)
        return root
    
    def get_disk_qos_result(self, root):
        taskMsgs = []
        for taskMsg in root.findall('taskMsg'):
            item = {}
            targetNameObj = taskMsg.find('targetName')
            if targetNameObj is not None:
                item['targetName'] = targetNameObj.text
            
            completedObj = taskMsg.find('completed')
            if completedObj is not None:
                item['completed'] = completedObj.text
            
            resultObj = taskMsg.find('result')
            if resultObj is not None:
                item['result'] = int(resultObj.text)
            
            progressObj = taskMsg.find('progress')
            if progressObj is not None:
                item['progress'] = progressObj.text
            
            failMsgObj = taskMsg.find('failMsg')
            if failMsgObj is not None:
                item['failMsg'] = failMsgObj.text
            
            eventTypeObj = taskMsg.find('eventType')
            if eventTypeObj is not None:
                item['eventType'] = eventTypeObj.text
            
            taskMsgs.append(item)
        return taskMsgs
    
    def instance_tools_info(self, root):
        toolsStatus = root.find("castoolsStatus").text
        return int(toolsStatus)
    
    def instance_network_objs(self, root):
        network_objs = []
        for network in root.findall('network'):
            obj = {}
            ips = []
            
            mac = network.find('mac')
            if mac is not None:
                obj['mac'] = mac.text
            
            ip_objs = network.findall('ip')
            for ip_obj in ip_objs:
                ip = {}
                ipAddr = ip_obj.find('address')
                if ipAddr is not None:
                    ip['ipAddr'] = ipAddr.text
               
                maskAddr = ip_obj.find('prefix')
                if maskAddr is not None:
                    ip['maskAddr'] = maskAddr.text
                
                iptype = ip_obj.find('type')
                if iptype is not None:
                    ip['iptype'] = iptype.text
                ips.append(ip)
            
            obj['ips'] = ips
            vsName = network.find('vsName')
            if vsName is not None:
                obj['vsName'] = vsName.text
            
            vlan = network.find('vlan')
            if vlan is not None:
                obj['vlan'] = vlan.text
            
            mode = network.find('mode')
            if mode is not None:
                obj['mode'] = mode.text
            
            isLimitInBound = network.find('isLimitInBound')
            if isLimitInBound is not None:
                obj['isLimitInBound'] = isLimitInBound.text
            
            inAvgBandwidth = network.find('inAvgBandwidth')
            if inAvgBandwidth is not None:
                obj['inAvgBandwidth'] = inAvgBandwidth.text
            
            inBurst = network.find('inBurst')
            if inBurst is not None:
                obj['inBurst'] = inBurst.text
            
            isLimitOutBound = network.find('isLimitOutBound')
            if isLimitOutBound is not None:
                obj['isLimitOutBound'] = isLimitOutBound.text
            
            outAvgBandwidth = network.find('outAvgBandwidth')
            if outAvgBandwidth is not None:
                obj['outAvgBandwidth'] = outAvgBandwidth.text
            
            outBurst = network.find('outBurst')
            if outBurst is not None:
                obj['outBurst'] = outBurst.text
            
            network_objs.append(obj)
        return network_objs
    
    def instance_snapshot(self, **kwargs):
        root = etree.Element("snapshot")
        self.create_SubElement(root,**kwargs)
        return root
    
    def snapshot_list(self,root):
        snapshots = []
        for snapshot in root.findall('snapshot'):
            name = snapshot.find('name').text
            creationTime = snapshot.find('creationTime').text
            snapshots.append({'name':name,'creationTime':creationTime})
            snapshots += self.snapshot_list(snapshot.find('snapshots'))
        return snapshots

class VolumeXml(CasXml):
    """xml object to operate volume"""
    def attach_volume(self, **kwargs):
        root = etree.Element("domain")
        self.create_SubElement(root, **kwargs)
        return root
    
    def detach_volume(self, **kwargs):
        root = etree.Element("domain")
        self.create_SubElement(root, **kwargs)
        return root

class ImageXml(CasXml):
    """xml object to operate image"""
    def download_image(self, **kwargs):
        root = etree.Element("image")
        self.create_SubElement(root,**kwargs)
        return root
    
    def update_image(self, **kwargs):
        root = etree.Element("image")
        self.create_SubElement(root,**kwargs)
        return root
    
    def attach_image(self, **kwargs):
        root = etree.Element("domain")
        self.create_SubElement(root, **kwargs)
        return root
    
    def attach_device(self, **kwargs):
        root = etree.Element("domain")
        self.create_SubElement(root, **kwargs)
        return root
    
    def detach_device(self, **kwargs):
        root = etree.Element("domain")
        self.create_SubElement(root, **kwargs)
        return root
    
    def list_image(self, root):
        images = []
        
        for volume in root.findall('storageVolume'):
            name = volume.find('name').text
            images.append(name)
        
        return images

class NetworkXml(CasXml):
    """xml object to operate network"""  
    def attach_vnic(self, **kwargs):
        root = etree.Element("config")
        self.create_SubElement(root,**kwargs)
        return root
    
    def detach_vnic(self, **kwargs):
        root = etree.Element("config")
        self.create_SubElement(root,**kwargs)
        return root
    
    def config_vnic(self, **kwargs):
        root = etree.Element("config")
        self.create_SubElement(root,**kwargs)
        return root
    
    def config_qos(self, **kwargs):
        root = etree.Element("interface")
        self.create_SubElement(root,**kwargs)
        return root
    
class EventXml(CasXml):
    """xml object to operate cas event"""
    def instance_event_type_and_vmid(self, root):
        if root.tag == "event":
            type = root.find("eventType").text
            vmid = root.find("vmId").text
            return type, vmid
        else:
            return None, None
    
    def instance_uuid_by_vmid(self, root):
        uuid = root.find("uuid").text
        return uuid
    
    def instance_migrate_event(self, root):
        mig_info = root.find("migrate")
        destHostId = mig_info.find("destHostId").text
        migrateType = None
        migrateTypeObj = mig_info.find("migrateType")
        
        if migrateTypeObj is not None:
            migrateType = int(migrateTypeObj.text)
        
        return destHostId,migrateType
    
    def instance_dts_event(self,root):
        dtsInfo={'vmId':None,'uuid':None,'hostId':None,'dtsType':None,
                 'vmType':None,'volume_list':[]}
        
        vmIdObj = root.find("vmId")
        if vmIdObj is not None:
            dtsInfo['vmId'] = vmIdObj.text
        
        dtsDataObj = root.find("rsDtsData")
        if dtsDataObj is not None:
            hostIdObj=dtsDataObj.find("hostId")
            if hostIdObj is not None:
                dtsInfo['hostId'] = hostIdObj.text

            vmUuidObj= dtsDataObj.find("vmUuid")
            if vmUuidObj is not None:
                dtsInfo['uuid'] = vmUuidObj.text

            dtsTypeObj= dtsDataObj.find("dtsType")
            if dtsTypeObj is not None:
                dtsInfo['dtsType'] = dtsTypeObj.text

            vmTypeObj= dtsDataObj.find("vmType")
            if vmTypeObj is not None:
                dtsInfo['vmType'] = vmTypeObj.text
            
            for volumeObj in dtsDataObj.findall("volume"):
                if volumeObj is not None:
                    dtsInfo['volume_list'].append(volumeObj.text)
            
        return dtsInfo
    
    def instance_info(self, root):
        state = root.find("status").text
        memory = root.find("memory").text
        cpu = root.find("cpu").text
        uuid = root.find("uuid").text
        vm_info = {"uuid":uuid,"state":state,"memory":memory,"cpu":cpu,"uuid":uuid}
        return vm_info
    
