#add by zhangmingze, 2014-2-12

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
                        element.text = kwargs[key]
                    else:
                        element.text = str(kwargs[key])
            else:
                element = etree.SubElement(root,key)
                if isinstance(kwargs[key],str) or isinstance(kwargs[key],unicode):
                    element.text = kwargs[key]
                else:
                    element.text = str(kwargs[key])

class InspectorXml(CasXml):
    """xml object to operate vm"""
    def instance_id(self, root):
        id = root.find("id").text
        return id
    
    def instance_state(self, root):
        state = root.find("status").text
        return state
    
    def instance_diagnostic_basic(self, root):
        basicInfo = {}
        
        domInfo = root.find('dominfo')
        basicInfo['cpus'] = int(domInfo.find('cpus').text)
        basicInfo['cpuTime'] = long(domInfo.find('cpuTime').text)
        basicInfo['memory'] = long(domInfo.find('usedMemory').text)
        
        return basicInfo
    
    def instance_diagnostic_mem(self, root):
        domMemStat = []
        
        for memStat in root.findall('memorystat'):
            tag = memStat.find('tag').text
            val = long(memStat.find('val').text)
            domMemStat.append({'tag':tag,'val':val})
        
        return domMemStat
    
    def instance_diagnostic_disk(self, root):
        domBlkStat = []
        
        for blkStat in root.findall('domblkstat'):
            name = blkStat.find('name').text
            rd_req = long(blkStat.find('rd_req').text)
            rd_bytes = long(blkStat.find('rd_bytes').text)
            wr_req = long(blkStat.find('wr_req').text)
            wr_bytes = long(blkStat.find('wr_bytes').text)
            errs = long(blkStat.find('errs').text)
            capacity = long(blkStat.find('capacity').text)
            allocation = long(blkStat.find('allocation').text)
            physical = long(blkStat.find('physical').text)
            domBlkStat.append({'name':name,'rd_req':rd_req,'rd_bytes':rd_bytes,'wr_req':wr_req,'wr_bytes':wr_bytes,
                               'errs':errs,'capacity':capacity,'allocation':allocation,'physical':physical})
        
        return domBlkStat
    
    def instance_diagnostic_interface(self, root):
        domIfStat = []
        
        for ifStat in root.findall('domifstat'):
            mac = ifStat.find('mac').text
            rx_bytes = long(ifStat.find('rx_bytes').text)
            rx_packets = long(ifStat.find('rx_packets').text)
            rx_errs = long(ifStat.find('rx_errs').text)
            rx_drop = long(ifStat.find('rx_drop').text)
            tx_bytes = long(ifStat.find('tx_bytes').text)
            tx_packets = long(ifStat.find('tx_packets').text)
            tx_errs = long(ifStat.find('tx_errs').text)
            tx_drop = long(ifStat.find('tx_drop').text)
            domIfStat.append({'name':mac,'mac':mac,'rx_bytes':rx_bytes,'rx_packets':rx_packets,'rx_errs':rx_errs,
                              'rx_drop':rx_drop,'tx_bytes':tx_bytes,'tx_packets':tx_packets,'tx_errs':tx_errs,'tx_drop':tx_drop})
        
        return domIfStat
    
    def instance_diagnostic_usage(self, root):
        domUsage = {}
        
        usage = root.find('domusage')
        if usage is not None:
            domUsage['cpuUsage'] = float(usage.find('cpuUsage').text)
            domUsage['memUsed'] = long(usage.find('memUsed').text)
        else:
            domUsage['cpuUsage'] = 0
            domUsage['memUsed'] = 0
        
        return domUsage
    
    def instance_diagnostic_disk_rate(self, root):
        domBlkRate = []
        
        for blkrate in root.findall('domblkrate'):
            name = blkrate.find('name').text
            rd_req_rate = long(blkrate.find('rd_req_rate').text)
            rd_bytes_rate = long(blkrate.find('rd_bytes_rate').text)
            wr_req_rate = long(blkrate.find('wr_req_rate').text)
            wr_bytes_rate = long(blkrate.find('wr_bytes_rate').text)
            domBlkRate.append({'name':name,'rd_req_rate':rd_req_rate,'rd_bytes_rate':rd_bytes_rate,
                                'wr_req_rate':wr_req_rate,'wr_bytes_rate':wr_bytes_rate})
        
        return domBlkRate
    
    def instance_diagnostic_interface_rate(self, root):
        domIfRate = []
        
        for ifrate in root.findall('domifrate'):
            mac = ifrate.find('mac').text
            rx_bytes_rate = long(ifrate.find('rx_bytes_rate').text)
            rx_packets_rate = long(ifrate.find('rx_packets_rate').text)
            tx_bytes_rate = long(ifrate.find('tx_bytes_rate').text)
            tx_packets_rate = long(ifrate.find('tx_packets_rate').text)
            domIfRate.append({'name':mac,'mac':mac,
                              'rx_bytes_rate':rx_bytes_rate,'rx_packets_rate':rx_packets_rate,
                              'tx_bytes_rate':tx_bytes_rate,'tx_packets_rate':tx_packets_rate})
        
        return domIfRate
        
    def instance_diagnostic_all(self, root):
        basicInfo = self.instance_diagnostic_basic(root)
        domMemStat = self.instance_diagnostic_mem(root)
        domBlkStat = self.instance_diagnostic_disk(root)
        domIfStat = self.instance_diagnostic_interface(root)
        domUsage = self.instance_diagnostic_usage(root)
        domBlkRate = self.instance_diagnostic_disk_rate(root)
        domIfRate = self.instance_diagnostic_interface_rate(root)
        
        return {'basicInfo':basicInfo,'domMemStat':domMemStat,'domBlkStat':domBlkStat,
                'domIfStat':domIfStat,'domUsage':domUsage,'domBlkRate':domBlkRate,'domIfRate':domIfRate}
    
    def instance_tools_info(self, root):
        toolsInfo = {'status':int(root.find("castoolsStatus").text)}
        
        uptimeItem = root.find('uptime')
        if uptimeItem is not None:
            toolsInfo['uptime'] = long(uptimeItem.text)
        
        return toolsInfo
    
    def host_diagnostic(self, root):
        basicInfo = {}
        info = root.find('info')
        basicInfo['cpuUsage'] = float(info.find('cpuUsage').text)
        basicInfo['memory'] = long(info.find('memory').text)
        basicInfo['memUsed'] = long(info.find('memUsed').text)
        basicInfo['uptime'] = long(info.find('uptime').text)
        basicInfo['cpuFreq'] = float(info.find('cpuFreq').text)
        
        hostBlkStat = []
        for blkStat in root.findall('blkrate'):
            name = blkStat.find('name').text
            rd_req_rate = long(blkStat.find('rd_req_rate').text)
            rd_bytes_rate = long(blkStat.find('rd_bytes_rate').text)
            wr_req_rate = long(blkStat.find('wr_req_rate').text)
            wr_bytes_rate = long(blkStat.find('wr_bytes_rate').text)
            capacity = long(blkStat.find('capacity').text)
            allocation = long(blkStat.find('allocation').text)
            physical = long(blkStat.find('physical').text)
            hostBlkStat.append({'name':name,'rd_req_rate':rd_req_rate,'rd_bytes_rate':rd_bytes_rate,
                               'wr_req_rate':wr_req_rate,'wr_bytes_rate':wr_bytes_rate,
                               'capacity':capacity,'allocation':allocation,'physical':physical})
        
        hostIfStat = []
        for ifStat in root.findall('ifrate'):
            name = ifStat.find('name').text
            mac = ifStat.find('mac').text
            rx_bytes_rate = long(ifStat.find('rx_bytes_rate').text)
            rx_packets_rate = long(ifStat.find('rx_packets_rate').text)
            tx_bytes_rate = long(ifStat.find('tx_bytes_rate').text)
            tx_packets_rate = long(ifStat.find('tx_packets_rate').text)
            hostIfStat.append({'name':name,'mac':mac,
                              'rx_bytes_rate':rx_bytes_rate,'rx_packets_rate':rx_packets_rate,
                              'tx_bytes_rate':tx_bytes_rate,'tx_packets_rate':tx_packets_rate,})
        
        return {'basicInfo':basicInfo,'hostBlkStat':hostBlkStat,'hostIfStat':hostIfStat}
