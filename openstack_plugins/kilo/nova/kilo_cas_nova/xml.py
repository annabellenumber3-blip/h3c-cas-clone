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
                      "dev_type": "type-VF",
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

class VmXml(CasXml):
    """xml object to operate vm"""
    def instance_base(self, root):
        id = root.find("id").text
        hostName = root.find("hostName").text
        hostId = root.find("hostId").text
        return {'id':id,'hostId':hostId,'hostName':hostName}
    
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
    
    def instance_detail_storage(self, root):
        storages = {}
        
        for storage in root.findall("storage"):
            deviceName = storage.find("deviceName").text
            path_obj = storage.find("path")
            if path_obj is not None:
                storages[deviceName] = {"path":path_obj.text}
        
        return storages
    
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
    
   
    def vm_manage(self, **kwargs):
        root = etree.Element("domain")
        self.create_SubElement(root,**kwargs)
        return root
     
    def config_vm(self, **kwargs):
        root = etree.Element("config")
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
