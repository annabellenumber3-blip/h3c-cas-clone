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
    
class NetworkXml(CasXml):
    """xml object to operate network"""
    def create_net_policy(self, **kwargs):
        root = etree.Element("portProfile")
        self.create_SubElement(root,**kwargs)
        return root
    
    def get_net_list(self, root):
        net_list = []
        for net in root.findall('portProfile'):
            net_name = net.find('name').text
            if net_name.startswith('openstack-'):
                net_list.append(net_name[len('openstack-'):])
        return net_list
    
    def instance_id(self, root):
        id = root.find("id").text
        return id
    
    def config_policy(self, **kwargs):
        root = etree.Element("config")
        self.create_SubElement(root,**kwargs)
        return root
    
    def instance_info(self, root):
        state = root.find("status").text
        return state
    
    def instance_port_list(self, root):
        ports_info = {}
        
        for network in root.findall('network'):
            ip_list = []
            mac = network.find("mac").text
            if network.find("ipAddr") is not None:
                ip_list.append(network.find("ipAddr").text)
            if network.find("ipv6") is not None:
                ip_list.append(network.find("ipv6").text)
            ports_info[mac] = ip_list
        
        return ports_info
    
    def interface_config_ips(self, **kwargs):
        root = etree.Element("config")
        self.create_SubElement(root,**kwargs)
        return root
    
    def config_vnic(self,**kwargs):
        root = etree.Element("config")
        self.create_SubElement(root,**kwargs)
        return root

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

            mtu = network.find('mtu')
            if mtu is not None:
                obj['mtu'] = mtu.text

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
    
class AclXml(CasXml):
    def update_acl_policy(self, **kwargs):
        root = etree.Element("aclStrategy")
        self.create_SubElement(root,**kwargs)
        return root
    
    def create_acl_policy(self, **kwargs):
        root = etree.Element("aclStrategy")
        self.create_SubElement(root,**kwargs)
        return root
    
    def get_acl_list(self, root):
        acl_list = []
        for acl in root.findall('parameter'):
            acl_name = acl.find('name').text
            if acl_name.startswith('openstack-'):
                acl_list.append(acl_name[len('openstack-'):])
        return acl_list
    
    def get_acl_rules(self, root):
        aclStrategy = root.find('aclStrategy')
        defaultAclAction = int(aclStrategy.find('defaultAclAction').text)
        defaultAclOutAction = int(aclStrategy.find('defaultAclOutAction').text)
        
        rules = []
        for rule in aclStrategy.findall('rule'):
            rule_info = {'protocol':int(rule.find('protocol').text),
                         'action':int(rule.find('action').text),
                         'direction':int(rule.find('direction').text),
                         'priority':int(rule.find('priority').text)}
            
            rule_info['ipType'] = 'ipv4' if rule.find('ipType') is None else rule.find('ipType').text
            
            if rule.find('srcIp') is not None:
                rule_info['srcIp'] = rule.find('srcIp').text
            if rule.find('srcMask') is not None:
                rule_info['srcMask'] = rule.find('srcMask').text
            if rule.find('srcPort') is not None:
                rule_info['srcPort'] = int(rule.find('srcPort').text)
            
            if rule.find('destIp') is not None:
                rule_info['destIp'] = rule.find('destIp').text
            if rule.find('destMask') is not None:
                rule_info['destMask'] = rule.find('destMask').text
            if rule.find('destPort') is not None:
                rule_info['destPort'] = int(rule.find('destPort').text)
            if rule.find('srcPortStart') is not None:
                rule_info['srcPort'] = int(rule.find('srcPortStart').text)
            if rule.find('srcPortEnd') is not None:
                rule_info['srcPortEnd'] = int(rule.find('srcPortEnd').text)
            if rule.find('destPortStart') is not None:
                rule_info['destPort'] = int(rule.find('destPortStart').text)
            if rule.find('destPortEnd') is not None:
                rule_info['destPortEnd'] = int(rule.find('destPortEnd').text)
            if rule.find('type') is not None:
                rule_info['type'] = int(rule.find('type').text)
            if rule.find('code') is not None:
                rule_info['code'] = int(rule.find('code').text)
        
            rules.append(rule_info)
        
        return {'defaultAclAction':defaultAclAction,'defaultAclOutAction':defaultAclOutAction,'rule':rules}
    
    def config_acl(self, **kwargs):
        root = etree.Element("config")
        self.create_SubElement(root,**kwargs)
        return root

class FwXml(CasXml):
    def check_fw_exist(self, root):
        exist = root.find('data').text
        return exist
    
    def update_fw_policy(self, **kwargs):
        root = etree.Element("virFireWall")
        self.create_SubElement(root,**kwargs)
        return root
    
    def create_fw_policy(self, **kwargs):
        root = etree.Element("virFireWall")
        self.create_SubElement(root,**kwargs)
        return root
    
    def get_fw_list(self, root):
        fw_list = []
        for fw in root.findall('virFireWall'):
            title = fw.find('title').text
            if title.startswith('openstack-'):
                fw_list.append(title[len('openstack-'):])
        return fw_list
    
    def get_fw_rules(self, root):
        ruleAction = int(root.find('ruleAction').text)
        
        rules = []
        for rule in root.findall('rule'):
            rule_info = {'ipType':rule.find('ipType').text,
                         'protocol':int(rule.find('protocol').text),
                         'direction':int(rule.find('direction').text),
                         'priority':int(rule.find('priority').text),
                         'remoteIp':rule.find('remoteIp').text,
                         'remoteMask':rule.find('remoteMask').text}
            
            if rule.find('portStart') is not None:
                rule_info['portStart'] = int(rule.find('portStart').text)
            if rule.find('portEnd') is not None:
                rule_info['portEnd'] = int(rule.find('portEnd').text)
            if rule.find('type') is not None:
                rule_info['type'] = int(rule.find('type').text)
            if rule.find('code') is not None:
                rule_info['code'] = int(rule.find('code').text)
            
            rules.append(rule_info)
        
        return {'ruleAction':ruleAction,'rule':rules}
    
    def config_fw(self, **kwargs):
        root = etree.Element("config")
        self.create_SubElement(root,**kwargs)
        return root

class QosXml(CasXml):
    """xml object to operate interface qos"""
    def config_qos(self, **kwargs):
        root = etree.Element("interface")
        self.create_SubElement(root,**kwargs)
        return root

    def instance_id(self, root):
        id = root.find("id").text
        return id

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

class TrunkPortXml(CasXml):
    def update_vlantrunk(self, **kwargs):
        root = etree.Element("rsVlanTrunk")
        self.create_SubElement(root,**kwargs)
        return root

    def get_vlantrunk_id(self, root):
        id = root.find("id").text
        return id

    def get_vlantrunk(self, root):
        if root.find('id') is None:
            return None
        id = int(root.find('id').text)
        title = root.find('title').text
        name = root.find('name').text
        vmTotal = root.find('vmTotal').text
        rules = []
        for rule in root.findall('rule'):
            rule_info = {'vmVlan': int(rule.find('vmVlan').text),
                         'vswitchVlan': int(rule.find('vswitchVlan').text)}

            rules.append(rule_info)

        return {'id': id, 'name': name, 'title': title, 'vmTotal': vmTotal, 'rule': rules}

    def query_vlantrunk_domains(self, root):
        if root.findall('rsVlanTrunkDomain') is None:
            return []
        vlanTrunkDomains = []
        for vlanTrunkDomain in root.findall('rsVlanTrunkDomain'):
            vlanTrunk_info = {'vmId': int(vlanTrunkDomain.find('id').text),
                              'mac': vlanTrunkDomain.find('mac').text}
            vlanTrunkDomains.append(vlanTrunk_info)
        return vlanTrunkDomains

    def config_vlantrunk(self, **kwargs):
        root = etree.Element("config")
        self.create_SubElement(root,**kwargs)
        return root

    def instance_id(self, root):
        id = root.find("id").text
        return id

    def instance_port_list(self, root):
        ports_info = {}
        for network in root.findall('network'):
            ip_list = []
            mac = network.find("mac").text
            if network.find("ipAddr") is not None:
                ip_list.append(network.find("ipAddr").text)
            if network.find("ipv6") is not None:
                ip_list.append(network.find("ipv6").text)
            ports_info[mac] = ip_list

        return ports_info