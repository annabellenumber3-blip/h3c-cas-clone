from oslo_log import log as logging

from neutron.i18n import _
from neutron.agent.casagent import error as cas_error
from neutron.agent.casagent import xml as casxml

LOG = logging.getLogger(__name__)

class CASNeutronSecurity(object):
    def _get_net_from_cidr(self, cidr, version):
        net, mask_len = cidr.split('/')
        if version == 'ipv4':
            if mask_len == '0':
                return '0.0.0.0','0.0.0.0'
            else:
                netmask = ['0','.','0','.','0','.','0']
                mask = '1'*int(mask_len)+'0'*(32-int(mask_len))
                for index in range(0,4):
                    netmask[2*index] = str(int(mask[index*8:(index+1)*8],2))
                return net, ''.join(netmask)
        else:
            if mask_len == '0':
                return '::','0'
            else:
                return net, mask_len

class CASNeutronFwSecurity(CASNeutronSecurity):
    support_protocol = {'ICMP':1,'TCP':6,'UDP':17,'ALL':-1}
    fw_action = {'black':0,'white':1}
    fw_direction = {'egress':1,'ingress':0}
    
    def __init__(self, session):
        self._session = session
        self._xml = casxml.FwXml()
    
    def set_port_security_group(self, port, newSecgroupIds):
        policy_args = {'mac':port['mac_address']}
        policy_args['fwName'] = ['openstack-' + newSecgroupId for newSecgroupId in newSecgroupIds]
        
        xmlstr = self._xml.encode_xml("config_fw",id=port['vmId'],interface=policy_args)
        uri = self._session.make_cmd_uri('/nova/vm/configFw')
        resp,body = self._session.call_method("PUT",uri,body=xmlstr)
        if resp.status_code == 200:
            msgId = self._xml.decode_xml("get_message_id",body)
            try:
                task = self._session.wait_for_task(msgId)
            except Exception:
                LOG.error(_("exception happened when config port[%s] firewall. msgId:%s uri:%s, xmlstr:%s") % (port['port_id'],msgId,uri,xmlstr))
                raise cas_error.CasVmException()
            if task['result'] != 0:
                LOG.error(_("fail to configFW. uri:%s, xmlstr:%s") % (uri,xmlstr))
                LOG.error(_("fail to configFW. failMsg:%s") % task['failMsg'])
                raise cas_error.CasVmException()
        else:
            LOG.error(_("fail to configFW uri:%s, xmlstr:%s") % (uri,xmlstr))
            LOG.error(_("fail to configFw resp.status_code:%d,%s") % (resp.status_code,cas_error.get_http_respond_error(resp)))
            raise cas_error.CasVmException()
    
    def check_security_group(self, secgroupId):
        uri = self._session.make_cmd_uri('/virFireWall/isExist/title','openstack-'+secgroupId)
        resp,body = self._session.call_method("GET",uri)
        if resp.status_code == 200:
            exist = self._xml.decode_xml("check_fw_exist",body)
            return True if exist == 'true' else False
        else:
            LOG.error(_("fail to query fw policy exist, uri:%s") % uri)
            LOG.error(_("fail to query fw policy exist, resp.status_code:%d,%s")
                     % (resp.status_code,cas_error.get_http_respond_error(resp)))
            raise cas_error.CasNetworkException()
    
    def prepare_security_group(self, secgroupId, rules):
        security_group = {'title':'openstack-'+secgroupId,
                            'ruleAction':self.fw_action['white'],'rule':rules}
        
        uri = self._session.make_cmd_uri('/virFireWall')
        xmlstr = self._xml.encode_xml("create_fw_policy",**security_group)
        resp,body = self._session.call_method('POST',uri,body=xmlstr)
        if resp.status_code != 200:
            LOG.error(_("create fw policy failed, uri:%s, xmlstr:%s") % (uri,xmlstr))
            LOG.error(_("create fw policy failed, resp.status_code:%d,%s")
                     % (resp.status_code,cas_error.get_http_respond_error(resp)))
            raise cas_error.CasNetworkException()
    
    def delete_security_group(self, secgroupId):
        uri = self._session.make_cmd_uri('/virFireWall/title','openstack-'+secgroupId)
        resp,body = self._session.call_method('DELETE', uri)
        if resp.status_code != 200:
            LOG.error(_("delete fw policy failed, uri:%s") % uri)
            LOG.error(_("delete fw policy failed,resp.status_code:%d,%s")
                     % (resp.status_code,cas_error.get_http_respond_error(resp)))
            raise cas_error.CasNetworkException()
    
    def switch_security_group_rule(self, rule, priority):
        direction = self.fw_direction[rule['direction']]
        protocol = self.support_protocol[rule['protocol']]
        
        fw_rule = {'ipType':rule['ip_version'],'protocol':protocol,'direction':direction,'priority':priority}
        
        remote_ip, remote_mask = self._get_net_from_cidr(rule['cidr'],rule['ip_version'])
        fw_rule['remoteIp'] = remote_ip
        fw_rule['remoteMask'] = remote_mask
        
        portStart = -1 if rule['fromPort'] is None else rule['fromPort']
        portEnd = -1 if rule['toPort'] is None else rule['toPort']
        if rule['fromPort'] == 1 and rule['toPort'] == 65535:
            LOG.debug(_("adjust port range[1,65535] to [null,null]"))
            portStart = portEnd = -1
        if rule['protocol'] == 'ICMP':
            fw_rule['type'] = portStart
            fw_rule['code'] = portEnd
        else:
            if portStart != portEnd:
                fw_rule['portStart'] = portStart
                fw_rule['portEnd'] = portEnd
            else:
                fw_rule['portStart'] = portStart
        
        return fw_rule
    
    def check_security_group_rules(self, secgroupId, rules):
        uri = self._session.make_cmd_uri('/virFireWall/title','openstack-'+secgroupId)
        resp,body = self._session.call_method("GET",uri)
        if resp.status_code == 200:
            fw_rules = self._xml.decode_xml("get_fw_rules",body)
            if fw_rules['ruleAction'] != self.fw_action['white']:
                return False
            if len(rules) != len(fw_rules['rule']):
                return False
            for rule in rules:
                for fw_rule in fw_rules['rule']:
                    if rule['priority'] == fw_rule['priority']:
                        if len(rule.items()) != len(fw_rule.items()):
                            return False
                        for key, value in rule.items():
                            if value != fw_rule.get(key):
                                return False
                        break
                else:
                    return False
            return True
        else:
            LOG.error(_("query fw rule failed, uri:%s") % uri)
            LOG.error(_("query fw rule failed, resp.status_code:%d,%s")
                     % (resp.status_code,cas_error.get_http_respond_error(resp)))
            raise cas_error.CasNetworkException()
    
    def update_security_group(self, secgroupId, rules):
        security_group = {'title':'openstack-'+secgroupId,
                          'ruleAction':self.fw_action['white'],
                          'rule':rules}
        
        uri = self._session.make_cmd_uri('/virFireWall/title','openstack-'+secgroupId)
        xmlstr = self._xml.encode_xml("update_fw_policy",**security_group)
        resp,body = self._session.call_method('PUT',uri,body=xmlstr)
        if resp.status_code != 200:
            LOG.error(_("update fw policy failed, uri:%s, xmlstr:%s") % (uri,xmlstr))
            LOG.error(_("update fw policy failed, resp.status_code:%d,%s")
                     % (resp.status_code,cas_error.get_http_respond_error(resp)))
            raise cas_error.CasNetworkException()
    
    def get_security_group_list(self):
        uri = self._session.make_cmd_uri('/virFireWall/titles')
        resp,body = self._session.call_method('GET',uri)
        if resp.status_code == 200:
            fw_list = self._xml.decode_xml('get_fw_list',body)
        else:
            LOG.error(_("fail to get fw policy list,resp.status_code:%d,%s")
                     % (resp.status_code,cas_error.get_http_respond_error(resp)))
            raise Exception(_("see error log message to get detailed information!"))
        return fw_list

class CASNeutronAclSecurity(CASNeutronSecurity):
    support_protocol = {'ICMP':1,'TCP':6,'UDP':17,'ALL':65535}
    acl_action = {'NO':0,'YES':1}
    acl_direction = {'egress':0,'ingress':1}
    
    def __init__(self, session):
        self._session = session
        self._xml = casxml.AclXml()
    
    def set_port_security_group(self, port, newSecgroupIds):
        policy_args = {'mac':port['mac_address']}
        policy_args['aclName'] = ['openstack-' + newSecgroupId for newSecgroupId in newSecgroupIds]
        
        xmlstr = self._xml.encode_xml("config_acl",id=port['vmId'],interface=policy_args)
        uri = self._session.make_cmd_uri('/nova/vm/configAcl')
        resp,body = self._session.call_method("PUT",uri,body=xmlstr)
        if resp.status_code == 200:
            msgId = self._xml.decode_xml("get_message_id",body)
            try:
                task = self._session.wait_for_task(msgId)
            except Exception:
                LOG.error(_("exception happened when config port[%s] acl. msgId:%s uri:%s, xmlstr:%s") % (port['port_id'],msgId,uri,xmlstr))
                raise cas_error.CasVmException()
            if task['result'] != 0:
                LOG.error(_("fail to configAcl. uri:%s, xmlstr:%s") % (uri,xmlstr))
                LOG.error(_("fail to configAcl. failMsg:%s") % task['failMsg'])
                raise cas_error.CasVmException()
        else:
            LOG.error(_("fail to configAcl uri:%s, xmlstr:%s") % (uri,xmlstr))
            LOG.error(_("fail to configAcl resp.status_code:%d,%s") % (resp.status_code,cas_error.get_http_respond_error(resp)))
            raise cas_error.CasVmException()
    
    def check_security_group(self, secgroupId):
        uri = self._session.make_cmd_uri('/acl/isExist','openstack-'+secgroupId)
        resp,body = self._session.call_method("GET",uri)
        if resp.status_code == 200:
            if body == 'true':
                return True
            else:
                return False
        else:
            LOG.error(_("query acl policy failed, uri:%s") % uri)
            LOG.error(_("query acl policy failed, resp.status_code:%d,%s")
                     % (resp.status_code,cas_error.get_http_respond_error(resp)))
            raise cas_error.CasNetworkException()
    
    def prepare_security_group(self, secgroupId, rules):
        security_group = {'name':'openstack-'+secgroupId,
                          'defaultAclAction':self.acl_action['NO'],
                          'defaultAclOutAction':self.acl_action['NO'],
                          'rule':rules}
        
        uri = self._session.make_cmd_uri('/acl')
        xmlstr = self._xml.encode_xml("create_acl_policy",**security_group)
        resp,body = self._session.call_method('POST',uri,body=xmlstr)
        if resp.status_code != 204:
            LOG.error(_("create acl policy failed, uri:%s, xmlstr:%s") % (uri,xmlstr))
            LOG.error(_("create acl policy failed, resp.status_code:%d,%s")
                     % (resp.status_code,cas_error.get_http_respond_error(resp)))
            raise cas_error.CasNetworkException()
    
    def delete_security_group(self, secgroupId):
        uri = self._session.make_cmd_uri('/acl',name='openstack-'+secgroupId)
        resp,body = self._session.call_method('DELETE', uri)
        if resp.status_code != 204:
            LOG.error(_("delete acl policy failed, uri:%s") % uri)
            LOG.error(_("delete acl policy failed,resp.status_code:%d,%s")
                     % (resp.status_code,cas_error.get_http_respond_error(resp)))
            raise cas_error.CasNetworkException()
    
    def switch_security_group_rule(self, rule, priority):
        action = self.acl_action['YES']
        direction = self.acl_direction[rule['direction']]
        protocol = self.support_protocol[rule['protocol']]
        
        acl_rule = {'ipType':rule['ip_version'],'action':action,'protocol':protocol,'direction':direction,'priority':priority}
        
        ipaddr, netmask = self._get_net_from_cidr(rule['cidr'],rule['ip_version'])
        if netmask not in ['0.0.0.0','0']:
            if 'ingress' == rule['direction']:
                acl_rule['srcIp'] = ipaddr
                acl_rule['srcMask'] = netmask
            elif 'egress' == rule['direction']:
                acl_rule['destIp'] = ipaddr
                acl_rule['destMask'] = netmask
        
        if rule['protocol'] == 'ICMP':
            if rule['fromPort'] and rule['fromPort' ] != -1:
                acl_rule['type'] = rule['fromPort']
            if rule['toPort'] and rule['toPort' ] != -1:
                acl_rule['code'] = rule['toPort']
        else:
            if rule['fromPort'] == 1 and rule['toPort'] == 65535:
                LOG.debug(_("adjust port range[1,65535] to [null,null]"))
                pass
            elif rule['fromPort'] and rule['toPort']:
                if rule['fromPort'] != rule['toPort']:
                    acl_rule['destPort'] = rule['fromPort']
                    acl_rule['destPortEnd'] = rule['toPort']
                else:
                    acl_rule['destPort'] = rule['fromPort']
        
        return acl_rule
    
    def check_security_group_rules(self, secgroupId, rules):
        uri = self._session.make_cmd_uri('/acl',name='openstack-'+secgroupId)
        resp,body = self._session.call_method("GET",uri)
        if resp.status_code == 200:
            acl_rules = self._xml.decode_xml("get_acl_rules",body)
            if (acl_rules['defaultAclAction'] != self.acl_action['NO']
                or acl_rules['defaultAclOutAction'] != self.acl_action['NO']):
                return False
            if len(rules) != len(acl_rules['rule']):
                return False
            for rule in rules:
                for acl_rule in acl_rules['rule']:
                    if rule['priority'] == acl_rule['priority']:
                        if len(rule.items()) != len(acl_rule.items()):
                            return False
                        for key, value in rule.items():
                            if value != acl_rule.get(key):
                                return False
                        break
                else:
                    return False
            return True
        else:
            LOG.error(_("query acl rule failed, uri:%s") % uri)
            LOG.error(_("query acl rule failed, resp.status_code:%d,%s")
                     % (resp.status_code,cas_error.get_http_respond_error(resp)))
            raise cas_error.CasNetworkException()
    
    def update_security_group(self, secgroupId, rules):
        security_group = {'name':'openstack-'+secgroupId,
                          'defaultAclAction':self.acl_action['NO'],
                          'defaultAclOutAction':self.acl_action['NO'],
                          'rule':rules}
        
        uri = self._session.make_cmd_uri('/acl')
        xmlstr = self._xml.encode_xml("update_acl_policy",**security_group)
        resp,body = self._session.call_method('PUT',uri,body=xmlstr)
        if resp.status_code != 204:
            LOG.error(_("update acl policy failed, uri:%s, xmlstr:%s") % (uri,xmlstr))
            LOG.error(_("update acl policy failed, resp.status_code:%d,%s")
                     % (resp.status_code,cas_error.get_http_respond_error(resp)))
            raise cas_error.CasNetworkException()
    
    def get_security_group_list(self):
        uri = self._session.make_cmd_uri('/acl/list')
        resp,body = self._session.call_method('GET',uri)
        if resp.status_code == 200:
            acl_list = self._xml.decode_xml('get_acl_list',body)
        else:
            LOG.error(_("fail to get acl policy list,resp.status_code:%d,%s")
                     % (resp.status_code,cas_error.get_http_respond_error(resp)))
            raise Exception(_("see error log message to get detailed information!"))
        return acl_list
