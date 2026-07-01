import time

import oslo_messaging
from oslo_config import cfg
from oslo_log import log as logging
from oslo_serialization import jsonutils
from sqlalchemy.orm import exc as sql_exc

from neutron.i18n import _
from neutron import context as neutroncontext
from neutron.common import topics
from neutron.common import exceptions
from neutron.extensions import portbindings
from neutron.plugins.ml2 import models
from neutron.db import agents_db
from neutron.db import db_base_plugin_v2
from neutron.db import netmtu_db
from neutron.db import vlantransparent_db
from neutron.db import securitygroups_db as sg_db
from neutron.agent import rpc as agent_rpc
from neutron.agent.l2.extensions import manager as ext_manager
from neutron.agent.casagent import error as cas_error
from neutron.agent.casagent import xml as casxml
from neutron.agent.casagent import sem as cassem
from neutron.agent.casagent import api as casapi
from neutron.agent.casagent import event as casevent
from neutron.agent.casagent import security as cassecurity
from neutron.services.tag import tag_plugin

CONF = cfg.CONF

LOG = logging.getLogger(__name__)

CAS_POWER_STATES = {
    '1':"UNKNOWN",
    '2':"ACTIVE",
    '3':"DOWN",
    '4':"ACTIVE"
}

class CASNeutronAgent(db_base_plugin_v2.NeutronDbPluginV2,
                       sg_db.SecurityGroupDbMixin,
                       agents_db.AgentDbMixin,
                       netmtu_db.Netmtu_db_mixin,
                       vlantransparent_db.Vlantransparent_db_mixin):    
    target = oslo_messaging.Target(version='1.4')
    
    default_policy_name = 'default'
    default_accept_policy_name = 'default-accept'

    def __init__(self, agents):
        if not (CONF.cas.host_ip and CONF.cas.host_username and CONF.cas.host_password):
            raise Exception(_("Must specify host_ip, "
                              "host_username "
                              "host_password to use "
                              "cas_neutron_agent"))
        
        if CONF.cas.rest_protocol not in ('http','https'):
            raise Exception(_("rest protocol is %s, only support http or https") % CONF.cas.rest_protocol)
        
        if CONF.cas.neutron_plugin not in ['openvswitch','vcfc']:
            raise Exception(_("neutron plugin is %s, only support vcfc or openvswitch") % CONF.cas.neutron_plugin)
        
        if CONF.cas.security_policy not in ['acl','fw']:
            raise Exception(_("security policy is %s, only support acl or fw") % CONF.cas.security_policy)
        
        self.conf = CONF
        self._host_ip = CONF.cas.host_ip
        self._hostname = CONF.host
        self._agents = agents
        self._agent_id = 'ovs-agent-%s' % CONF.host
        self._ports = {}
        self._neutron_plugin = CONF.cas.neutron_plugin
        
        self._xml = casxml.NetworkXml()
        self._session = casapi.CasAPISession(self._host_ip,CONF.cas.host_username,CONF.cas.host_password,
                                             CONF.cas.URI_prefix,CONF.cas.api_retry_count,CONF.cas.rest_protocol,CONF.debug)
        self._semObj = cassem.CasSem()
        
        self._acl_security = cassecurity.CASNeutronAclSecurity(self._session)
        self._fw_security = cassecurity.CASNeutronFwSecurity(self._session)
        self._security = self._acl_security if CONF.cas.security_policy == 'acl' else self._fw_security
        
        self._setup_rpc()
        self._init_extension_manager()
        
        if CONF.cas.event_type == 'http':
            self._event = casevent.CasEventHttp(self._session,self._hostname,self)
        elif CONF.cas.event_type == 'rabbitmq':
            self._event = casevent.CasEventRmq(self._session,self._hostname,self)
        # The initialization is complete; we can start receiving messages
        self.connection.consume_in_threads()
    
    def _setup_rpc(self):
        self.plugin_rpc = agent_rpc.PluginApi(topics.PLUGIN)
        
        self.topic = topics.AGENT
        self.endpoints = [self]
        consumers = [[topics.PORT, topics.UPDATE],
                     [topics.NETWORK, topics.UPDATE],
                     [topics.SECURITY_GROUP, topics.UPDATE]]
        self.connection = agent_rpc.create_consumers(self.endpoints,
                                                     self.topic,
                                                     consumers,
                                                     start_listening=False)
        self.tag_plugin = tag_plugin.TagPlugin()
    
    def _init_extension_manager(self):
        ext_manager.register_opts(self.conf)
        self.ext_manager = ext_manager.AgentExtensionsManager(self.conf)
        self.ext_manager.initialize(self.connection,'cas',None)
    
    def _get_binding_ports(self, context):
        session = context.session
        
        try:
            with session.begin(subtransactions=True):
                result = (session.query(models.PortBinding).
                         filter(models.PortBinding.host==self._hostname).
                         all())
        except sql_exc.NoResultFound:
            LOG.debug(_("No binding port found on this host. hostname:%s") % self._hostname)
            return []
        
        return result
    
    def _get_binding_port(self, context, port_id):
        session = context.session
        
        try:
            with session.begin(subtransactions=True):
                result = (session.query(models.PortBinding).
                         filter(models.PortBinding.port_id.startswith(port_id)).
                         one())
        except (sql_exc.NoResultFound, sql_exc.MultipleResultsFound) as exc:
            LOG.debug(_("fail to get binding port for port_id:%s") % port_id)
            raise exc
        
        return result
    
    def _update_binding_port(self, context, port_id, values):
        session = context.session
        
        try:
            with session.begin(subtransactions=True):
                result = (session.query(models.PortBinding).
                         filter(models.PortBinding.port_id.startswith(port_id)).
                         one())
                result.update(values)
                session.add(result)
        except Exception as exc:
            LOG.debug(_("fail to commit data to database for port_id:%s") % port_id)
            raise exc
    
    def _get_vif_details(self, port_id, vif_details):
        if vif_details:
            try:
                return jsonutils.loads(vif_details)
            except Exception:
                LOG.error("Serialized vif_details DB value '%(value)s' "
                          "for port %(port)s is invalid",
                          {'value': vif_details,
                           'port': port_id})
        return {}
    
    def _check_whether_do_it(self, context, jobInfo):
        filters = {'alive':[True],'binary':self._agents}
        host_list = []
        agents = self.get_agents(context,filters)
        for agent in agents:
            if agent['configurations'].get('CAS_IP') == self._host_ip and agent['host'] not in host_list:
                host_list.append(agent['host'])
        if not host_list:
            LOG.error(_("Can't find an agent that the CAS_IP is set %s") % self._host_ip)
            return False
        host_list.sort()
        if host_list[0] == self._hostname:
            LOG.info(_("I will deal the job: %s") % jobInfo)
            return True
        else:
            LOG.warning(_("host: %s will deal the job: %s") % (host_list[0],jobInfo))
            return False
    
    def _get_id_from_uuid(self, instance_uuid):
        uri = self._session.make_cmd_uri('/nova/searchVm',uuid=instance_uuid)
        resp, body = self._session.call_method("GET",uri)
        if resp.status_code == 200:
            vm_id = self._xml.decode_xml("instance_id", body)
            return vm_id
        else:
            LOG.error(_("fail to get instance[uuid:%s] id! uri:%s") % (instance_uuid,uri))
            LOG.error(_("fail to get instance[uuid:%s] info! resp.status_code:%d,%s")
                     % (instance_uuid,resp.status_code,cas_error.get_http_respond_error(resp)))
            raise cas_error.CasVmException()
    
    def _get_instance_status(self, instance_uuid, instance_id):
        uri = self._session.make_cmd_uri('/nova/vmInfo',instance_id)
        resp, body = self._session.call_method("GET",uri)
        if resp.status_code == 200:
            vm_status = self._xml.decode_xml("instance_info",body)
            return CAS_POWER_STATES.get(vm_status)
        else:
            LOG.error(_("fail to get instance[uuid:%s] info! uri:%s") % (instance_uuid,uri))
            LOG.error(_("fail to get instance[uuid:%s] info! resp.status_code:%d,%s")
                     % (instance_uuid,resp.status_code,cas_error.get_http_respond_error(resp)))
            raise cas_error.CasVmException()
    
    def _check_instance_port_exist(self, instance_uuid, instance_id, mac_address):
        uri = self._session.make_cmd_uri('/vm/network',instance_id)
        resp, body = self._session.call_method("GET",uri)
        if resp.status_code == 200:
            instance_ports_info= self._xml.decode_xml("instance_port_list", body)
            mac_list = instance_ports_info.keys()
            LOG.info(_("success to get instance[uuid:%s] ports from CVM, ports=%s") % (instance_uuid,mac_list))
            if mac_address.lower() not in mac_list:
                raise cas_error.CasNetworkException()
            return instance_ports_info.get(mac_address)
        else:
            LOG.error(_("fail to get instance[uuid:%s] ports! uri:%s") % (instance_uuid,uri))
            LOG.error(_("fail to get instance[uuid:%s] ports! resp.status_code:%d,%s")
                     % (instance_uuid,resp.status_code,cas_error.get_http_respond_error(resp)))
            raise cas_error.CasVmException()
    
    def _update_port_status(self, context, instance_uuid, instance_id, port_id, vif_details, newStatus=None, force=False):
        if not newStatus:
            newStatus = vif_details.get('status','UNKNOWN')
        
        if force or newStatus == 'UNKNOWN':
            instance_status = self._get_instance_status(instance_uuid, instance_id)
            if instance_status == newStatus:
                return False
            newStatus = instance_status
        
        if newStatus == 'ACTIVE':
            self.plugin_rpc.update_device_up(context,port_id,self._agent_id,self._hostname)
        elif newStatus == 'DOWN':
            self.plugin_rpc.update_device_down(context,port_id,self._agent_id,self._hostname)
        else:
            LOG.debug(_("Status of port %s is %s, do nothing.") % (port_id,newStatus))
        
        if newStatus != vif_details.get('status','UNKNOWN'):
            vif_details['status'] = newStatus
            return True
        else:
            return False
    
    def update_ports_status(self, instance_uuid, instance_id, ports, newStatus):
        for port_id in ports:
            if port_id not in self._ports:
                continue
            
            sem = self._semObj.get_obj_sem(port_id)
            sem.acquire()
            try:
                adminContext = neutroncontext.get_admin_context()
                
                try:
                    binding_port = self._get_binding_port(adminContext,port_id)
                except Exception:
                    LOG.warning(_("can't get port[%s], may have been deleted, do nothing.") % port_id)
                    continue
                
                port_profile = binding_port.get('binding:profile',{})
                cvm_host = port_profile.get('cvm_host',None)
                if (cvm_host is None or cvm_host == self._host_ip):
                    vif_details = self._get_vif_details(port_id,binding_port['vif_details'])
                    
                    changed = self._update_port_status(adminContext,instance_uuid,instance_id,port_id,
                                                       vif_details,newStatus=newStatus)
                    if changed:
                        self._update_binding_port(adminContext,port_id,{'vif_details':jsonutils.dumps(vif_details)})
            except Exception as exc:
                LOG.error(_("fail to update port[%s] status to %s. exc:%s") % (port_id,newStatus,exc))
            finally:
                sem.release()
                self._semObj.back_obj_sem(port_id)
    
    def _set_port_network_policy(self, context, port, vnic_type, vif_details, tags):
        port_id = port['port_id']
        network_type = port['network_type']
        pvlan_id = tags.get('pvlan_id',0)

        if pvlan_id:
            segmentation_id = pvlan_id
        elif self._neutron_plugin == 'openvswitch' and network_type == 'vlan':
            segmentation_id = port['segmentation_id']
        else:
            LOG.info(_("vcfc or vxlan or flat port set vlan id=1, port:%s") % port_id)
            segmentation_id = 1

        if 'vlanId' in vif_details:
            vlan_change = False if vif_details['vlanId'] == segmentation_id else True
        else:
            vlan_change = True

        if 'tags' in vif_details:
            tag_change = False if cmp(vif_details['tags'],tags) == 0 else True
        elif tags:
            tag_change = True
        else:
            tag_change = False

        if not vlan_change and not tag_change:
            return False
        policy_args = {'mac':port['mac_address'],'vlan':segmentation_id,'iface-id':port['port_id']}
        if tags:
            egress_trunk = {'isProtect':tags['isProtect'],'mac':tags['egress_port_mac'],'vlanId':tags['local_vlan_id'],'id':tags['egress_vm_id']}
            ingress_trunk = {'isProtect':tags['isProtect'],'mac':tags['ingress_port_mac'],'vlanId':tags['pvlan_id'],'id':tags['ingress_vm_id']}
            policy_args['trunk'] = [ingress_trunk,egress_trunk]
        if vnic_type == portbindings.VNIC_DIRECT:
            if CONF.cas.sriov_vlan_transparent and network_type in CONF.cas.sriov_transparent_type_drivers:
                policy_args['vlan'] = 4095
            else:
                if segmentation_id == 1:
                    del policy_args['vlan']
        else:
            network_info = self.get_network(context,port['network_id'])
            if CONF.cas.config_mtu:
                mtu = network_info.get('mtu')
                if mtu:
                    policy_args['mtu'] = mtu
            qinq = network_info.get('vlan_transparent')
            if qinq is not None:
                policy_args['qinq'] = 'true' if qinq else 'false'
        
        xmlstr = self._xml.encode_xml("config_policy",id=port['vmId'],interface=policy_args)
        uri = self._session.make_cmd_uri('/nova/vm/configPolicy')
        resp,body = self._session.call_method("PUT",uri,body=xmlstr)
        if resp.status_code == 200:
            msgId = self._xml.decode_xml("get_message_id",body)
            try:
                task = self._session.wait_for_task(msgId)
            except Exception:
                LOG.error(_("exception happened when config port[%s] policy. msgId:%s uri:%s, xmlstr:%s") % (port['port_id'],msgId,uri,xmlstr))
                raise cas_error.CasVmException()
            if task['result'] != 0:
                LOG.error(_("fail to config port policy. uri:%s, xmlstr:%s") % (uri,xmlstr))
                LOG.error(_("fail to config port policy. failMsg:%s") % task['failMsg'])
                raise cas_error.CasVmException()
        else:
            LOG.error(_("fail to config port policy. uri:%s, xmlstr:%s") % (uri,xmlstr))
            LOG.error(_("fail to config port policy. resp.status_code:%d,%s")
                     % (resp.status_code,cas_error.get_http_respond_error(resp)))
            raise cas_error.CasVmException()
        
        vif_details['vlanId'] = segmentation_id
        if tags:
            vif_details['tags'] = tags
        elif 'tags' in vif_details:
            del vif_details['tags']

        return True
    
    def _set_port_security_group(self, context, port, vif_details, tags):
        port_id = port['port_id']
        newSecgroupIds = list()
        pvlan_id = tags.get('pvlan_id',0)
        if pvlan_id:
            newSecgroupIds.append(self.default_accept_policy_name)
        else:
            newSecgroupIds = self.get_port(context,port_id)['security_groups']
        if 'secgroupIds' in vif_details:
            if vif_details['secgroupIds'] == newSecgroupIds:
                return False

        for newSecgroupId in newSecgroupIds:
            self._prepare_security_group(context, newSecgroupId)
        
        self._security.set_port_security_group(port,newSecgroupIds)
        
        vif_details['secgroupIds'] = newSecgroupIds
        return True
    
    def _set_port_qos_policy(self, context, port, vif_details):
        port_id = port['port_id']
        newQosPolicyId = port.get('qos_policy_id') or port.get('network_qos_policy_id')
        
        if 'qosPolicyId' in vif_details:
            if vif_details['qosPolicyId'] == newQosPolicyId:
                return False
        if 'qosPolicyId' not in vif_details and not newQosPolicyId:
            LOG.info(_("port[%s] has no qos policy,do nothing.") % port_id)
            return False
        
        try:
            self.ext_manager.handle_port(context, port)
        except Exception as exc:
            self.ext_manager.delete_port(context,{'port_id':port_id})
            raise exc
        
        vif_details['qosPolicyId'] = newQosPolicyId
        return True
    
    def _get_netmask_from_cidr(self, cidr, version):
        if version == 4:
            netmask=['0','.','0','.','0','.','0']
            mask_len = int(cidr.split('/').pop())
            mask='1'*mask_len+'0'*(32-mask_len)
            for index in range(0,4):
                netmask[2*index] = str(int(mask[index*8:(index+1)*8],2))
            return ''.join(netmask)
        else:
            return cidr.split('/').pop()
    
    def _get_port_network_info(self,context,port):
        vif_info = {}
        fixed_ip_list = []
        bootproto_list = []
        for fixed_ip in port['fixed_ips']:
            subnet_id = fixed_ip['subnet_id']
            ip_info = {}
            
            subnet = self.get_subnet(context,subnet_id)
            if subnet['enable_dhcp']:
                ip_info['bootproto'] = 'dhcp'
                bootproto_list.append('dhcp')
                if subnet['ipv6_address_mode']:
                    ip_info['mode'] = subnet['ipv6_address_mode']
            else:
                ip_info['bootproto'] = 'static'
                bootproto_list.append('static')
                
                ip_info['ip'] = fixed_ip['ip_address']
                fixed_ip_list.append(fixed_ip['ip_address'])
                ip_info['mask'] = self._get_netmask_from_cidr(subnet['cidr'],subnet['ip_version'])
                
                if subnet['gateway_ip']:
                    ip_info['gateway'] = subnet['gateway_ip']
                
                if len(subnet['dns_nameservers']) == 1:
                    ip_info['masterDns'] = subnet['dns_nameservers'][0]
                elif len(subnet['dns_nameservers']) >= 2:
                    ip_info['masterDns'] = subnet['dns_nameservers'][0]
                    ip_info['slaveDns'] = subnet['dns_nameservers'][1]
                
                if len(subnet['host_routes']) != 0:
                    routes = []
                    for route in subnet['host_routes']:
                        cidr = route['destination']
                        route_item = {'destination':cidr.split('/')[0],
                                      'netmask':self._get_netmask_from_cidr(cidr,subnet['ip_version']),
                                      'gateway':route['nexthop']}
                        routes.append(route_item)
                    
                    ip_info['route'] = routes
            version = 'ipv' + str(subnet['ip_version'])
            vif_info[version] = ip_info
        return vif_info,fixed_ip_list,bootproto_list
    
    def _config_interface(self, instanceId, vif_info, ip_list, port_id):
        if not ip_list:
            LOG.info(_("port[%s] doesn't have ip on the CAS,maybe vm has been deleted, do nothing.") % port_id)
            return False
        uri = self._session.make_cmd_uri('/nova/vm/configNetwork')
        xmlstr = self._xml.encode_xml("config_vnic",id=instanceId,interface=vif_info)
        resp,body = self._session.call_method("PUT",uri,body=xmlstr)
        if resp.status_code == 200:
            msgId = self._xml.decode_xml("get_message_id",body)
            task = self._session.wait_for_task(msgId,1.5)
            if task['result'] != 0:
                LOG.error(_("fail to config interface, uri:%s, xmlstr:%s") % (uri,xmlstr))
                LOG.error(_("fail to config interface, failMsg:%s") % task['failMsg'])
                return False
            else:
                LOG.info(_("success to config port[%s] on instance[id=%s].") % (port_id,instanceId))
                return True
        else:
            LOG.error(_("fail to config interface, uri:%s, xmlstr:%s") % (uri,xmlstr))
            LOG.error(_("fail to config interface, resp.status_code:%d, %s")
                     % (resp.status_code,cas_error.get_http_respond_error(resp)))
            return False
    
    def _config_allowed_ips(self, instanceId, port_network_info):
        uri = self._session.make_cmd_uri('/nova/interface/configIP')
        xmlstr = self._xml.encode_xml("interface_config_ips",id=instanceId,interface=port_network_info)
        resp,body = self._session.call_method('PUT',uri,body=xmlstr)
        
        if resp.status_code == 200:
            msgId = self._xml.decode_xml("get_message_id",body)
            try:
                task = self._session.wait_for_task(msgId)
            except Exception:
                LOG.error(_("exception happened when config allowed ips msgId:%s uri:%s, xmlstr:%s") % (msgId,uri,xmlstr))
                return False
            if task['result'] != 0:
                LOG.error(_("fail to config port allowed ips uri:%s, xmlstr:%s") % (uri,xmlstr))
                LOG.error(_("fail to config port allowed ips failMsg:%s") % task['failMsg'])
                return False
            else:
                LOG.info(_("success to config allowed ips to port[mac=%s].") % port_network_info['mac'])
                return True
        else:
            LOG.error(_("fail to config port allowed ips, uri:%s, xmlstr:%s") % (uri,xmlstr))
            LOG.error(_("fail to config port allowed ips, resp.status_code:%d, %s")
                      % (resp.status_code,cas_error.get_http_respond_error(resp)))
            return False
    
    def _set_port_network_config(self,context,instance_id,port,vif_details,ip_list):
        is_fixdips_changed = False
        is_allowedips_changed = False
        vif_info,fixed_ip_list,bootproto_list = self._get_port_network_info(context,port)
        fixed_ips_str = ','.join(fixed_ip_list)
        vip_list = []
        port_fixedip_list = []
        if vif_info:
            vif_info['mac'] = port['mac_address']
        if 'fixed_ips' not in vif_details:
            if fixed_ip_list:
                vif_details['fixed_ips'] = fixed_ips_str
                is_fixdips_changed = True
            else:
                is_fixdips_changed = False
        else:
            if vif_details['fixed_ips'] == fixed_ips_str:
                is_fixdips_changed = False
            else:
                is_fixdips_changed = self._config_interface(instance_id,vif_info,ip_list,port['port_id'])
        if is_fixdips_changed:
            vif_details['fixed_ips'] = fixed_ips_str
        
        for address_info in port['allowed_address_pairs']:
            vip_list.append(str(address_info['ip_address']))
        for fixed_ip in port['fixed_ips']:
            port_fixedip_list.append(fixed_ip['ip_address'])
        
        allowed_ips_str = ','.join(port_fixedip_list + vip_list)
        port_network_info = {'fixed_ips':{},'mac':port['mac_address'],'vips':{}}
        
        if 'static' not in bootproto_list and not vip_list:
            del port_network_info['fixed_ips']
        elif port_fixedip_list:
            port_network_info['fixed_ips']['ip'] = port_fixedip_list
        
        if vip_list:
            port_network_info['vips']['ip'] = vip_list
        else:
            del port_network_info['vips']
        if 'allowed_ips' not in vif_details:
            if vip_list:
                is_allowedips_changed = self._config_allowed_ips(instance_id,port_network_info)
            else:
                is_allowedips_changed = False
        else:
            if vif_details['allowed_ips'] == allowed_ips_str:
                is_allowedips_changed = False
            else:
                is_allowedips_changed = self._config_allowed_ips(instance_id,port_network_info)
        if not port_network_info.has_key('fixed_ips') and 'allowed_ips' in vif_details:
            del vif_details['allowed_ips']
            is_allowedips_changed = True
        elif is_allowedips_changed:
            vif_details['allowed_ips'] = allowed_ips_str
    
        return is_fixdips_changed | is_allowedips_changed
    
    def _update_port_policies(self, context, instance_id, port_id, vnic_type, vif_details, ip_list):
        def _get_tags_info(context,port_id):
            port_tags = {}
            try:
                tags_list = self.tag_plugin.get_tags(context,'ports',port_id)['tags']
                LOG.debug(_("success to get port:%s tags:%s") % (port_id,tags_list))
                if tags_list:
                    for tag_info in tags_list:
                        if tag_info.startswith('pvlan_id'):
                            pvlan_id = int(tag_info.split(':')[-1])
                            port_tags['pvlan_id'] = pvlan_id
                            port_tags['isProtect'] = 0 if pvlan_id == 0 else 1
                        if tag_info.startswith('local_vlan_id'):
                            port_tags['local_vlan_id'] = int(tag_info.split(':')[-1])
                        if tag_info.startswith('nfv_egress_port_id'):
                            nfv_egress_port_id = tag_info.split(':')[-1]
                            egress_port_info = self.get_port(context,nfv_egress_port_id)
                            port_tags['egress_port_mac'] = egress_port_info['mac_address']
                            port_tags['egress_vm_id'] = self._get_id_from_uuid(egress_port_info['device_id'])
                        if tag_info.startswith('nfv_ingress_port_id'):
                            nfv_ingress_port_id = tag_info.split(':')[-1]
                            ingress_port_info = self.get_port(context,nfv_ingress_port_id)
                            port_tags['ingress_port_mac'] = ingress_port_info['mac_address']
                            port_tags['ingress_vm_id'] = self._get_id_from_uuid(ingress_port_info['device_id'])
            except Exception:
                LOG.warning(_("fail to get tags of port:%s.") % port_id)
            return port_tags
        changed = False
        
        devices_details_list = self.plugin_rpc.get_devices_details_list(context, [port_id], self._agent_id)
        port = devices_details_list[0]
        
        network_type = port['network_type']
        if network_type not in ['vlan','vxlan','flat']:
            LOG.debug(_("finish to update port because network type %s not supported. port:%s") % (network_type,port))
            return changed
        
        port.update(vmId=instance_id)
        port_tags = _get_tags_info(context,port_id)
        changed |= self._set_port_network_policy(context,port,vnic_type,vif_details,port_tags)
        
        if vnic_type == portbindings.VNIC_DIRECT:
            LOG.debug(_("finish to update sriov port. port:%s") % port)
            return changed
        
        changed |= self._set_port_qos_policy(context,port,vif_details)
        if CONF.cas.configPort:
            changed |= self._set_port_network_config(context,instance_id,port,vif_details,ip_list)
        
        if self._neutron_plugin == 'vcfc' or network_type == 'vxlan':
            LOG.debug(_("finish to update vcfc or vxlan port. port:%s") % port)
            return changed
        
        changed |= self._set_port_security_group(context,port,vif_details,port_tags)
        
        return changed
    
    def _update_port(self, port, sync_status):
        port_id = port['id']
        
        try:
            vm_id = self._get_id_from_uuid(port['device_id'])
            ip_list = self._check_instance_port_exist(port['device_id'],vm_id,port['mac_address'])
        except Exception:
            LOG.warning(_("port[%s] dosen't exist on the CAS, do nothing.") % port_id)
        else:
            sem = self._semObj.get_obj_sem(port_id)
            sem.acquire()
            try:
                adminContext = neutroncontext.get_admin_context()
                
                try:
                    binding_port = self._get_binding_port(adminContext,port_id)
                except Exception:
                    LOG.warning(_("can't get port[%s], may have been deleted, do nothing.") % port_id)
                    return
                else:
                    self._ports[port_id] = port['network_id']
                
                changed = False
                vif_details = self._get_vif_details(port_id,binding_port['vif_details'])
                
                try:
                    changed |= self._update_port_policies(adminContext,vm_id,port_id,binding_port['vnic_type'],vif_details,ip_list)
                except Exception as exc:
                    LOG.error(_("fail to update port[%s] policies when port update. exc:%s") % (port_id,exc))
                
                try:
                    changed |= self._update_port_status(adminContext,port['device_id'],vm_id,port_id,vif_details,force=sync_status)
                except Exception as exc:
                    LOG.error(_("fail to update status of port %s when port update. exc:%s") % (port_id,exc))
                
                if changed:
                    self._update_binding_port(adminContext,port_id,{'vif_details':jsonutils.dumps(vif_details)})
            finally:
                sem.release()
                self._semObj.back_obj_sem(port_id)
    
    def port_update(self, context, **kwargs):
        port = kwargs['port']
        port_id = port['id']
        
        LOG.info(_("begin to update port. port id: %s") % port_id)
        
        if self._hostname != port.get(portbindings.HOST_ID):
            LOG.debug(_("The port dosen't bind this host. port:%s") % port)
        else:
            self._update_port(port,False)
        
        LOG.info(_("finish to update port. port id: %s") % port_id)
    
    def network_update(self, context, **kwargs):
        network_id = kwargs['network']['id']
        
        LOG.info(_("begin to update network. network id: %s") % network_id)
        
        for port_id in self._ports.keys():
            if self._ports[port_id] == network_id:
                try:
                    port = self.get_port(context,port_id)
                except Exception:
                    LOG.warning(_("can't get port[%s], may have been deleted, do nothing.") % port_id)
                    continue
                
                self._update_port(port,False)
        
        LOG.info(_("finish to update network. network id: %s") % network_id)
    
    def _delete_network_policy(self, networkId):
        uri = self._session.make_cmd_uri('/profile/isExist','openstack-'+networkId)
        resp,body = self._session.call_method("GET",uri)
        if resp.status_code == 200:
            if body == 'true':
                uri = self._session.make_cmd_uri('/profile',name='openstack-'+networkId)
                resp,body = self._session.call_method("DELETE",uri)
                if resp.status_code != 204:
                    LOG.error(_("delete network policy failed, uri:%s") % uri)
                    LOG.error(_("delete network policy failed,resp.status_code:%d,%s")
                             % (resp.status_code,cas_error.get_http_respond_error(resp)))
                    raise cas_error.CasNetworkException()
            else:
                LOG.info(_("network policy %s dosen't exist on cas!") % ('openstack-'+networkId))
        else:
            LOG.error(_("query network policy failed, uri:%s") % uri)
            LOG.error(_("query network policy failed,resp.status_code:%d,%s")
                     % (resp.status_code,cas_error.get_http_respond_error(resp)))
            raise cas_error.CasNetworkException()
    
    def _delete_security_group(self, secgroupId):
        exist = self._security.check_security_group(secgroupId)
        if exist:
            self._security.delete_security_group(secgroupId)
        else:
            LOG.debug(_("security group %s dosen't exist on cas, dosen't need to delete!") % ('openstack-'+secgroupId))
    
    def _update_security_group(self, context, secgroupId, check_rule=False):
        sem = self._semObj.get_obj_sem(secgroupId)
        sem.acquire()
        try:
            exist = self._security.check_security_group(secgroupId)
            if exist:
                rules = self._get_secgroup_rules(context,secgroupId)
                if not (check_rule and self._security.check_security_group_rules(secgroupId,rules)):
                    self._security.update_security_group(secgroupId,rules)
            else:
                LOG.debug(_("security group %s dosen't exist on cas, dosen't need to update!") % ('openstack-'+secgroupId))
        except Exception as exc:
            raise exc
        finally:
            sem.release()
            self._semObj.back_obj_sem(secgroupId)
    
    def _get_secgroup_rules(self, context, secgroupId):
        security_rules = []
        
        if secgroupId == self.default_policy_name or secgroupId == self.default_accept_policy_name:
            return security_rules
        
        secgroup_rules = []
        secgroup_info = self.get_security_group(context, secgroupId)
        for rule in secgroup_info['security_group_rules']:
            protocol = rule['protocol'].upper() if rule['protocol'] else 'ALL'
            if protocol not in self._security.support_protocol:
                LOG.info(_("CAS dosen't support rule's protocol %s") % protocol)
                continue
            
            from_port = rule['port_range_min']
            to_port = rule['port_range_max']
            
            if CONF.cas.enable_remote_security_group and rule['remote_group_id']:
                remote = rule['remote_group_id']
                remote_secgroup = True
            else:
                if rule['remote_ip_prefix']:
                    remote = rule['remote_ip_prefix']
                else:
                    if rule['ethertype'] == 'IPv4':
                        remote = '0.0.0.0/0'
                    else:
                        remote = '::/0'
                remote_secgroup = False
            
            for secgroup_rule in secgroup_rules:
                if (remote == secgroup_rule['remote'] and protocol == secgroup_rule['protocol']
                    and from_port == secgroup_rule['from_port'] and to_port == secgroup_rule['to_port']
                    and rule['ethertype'] == secgroup_rule['ethertype'] and rule['direction'] == secgroup_rule['direction']):
                    break
            else:
                secgroup_rules.append({'ethertype':rule['ethertype'],
                                       'from_port':from_port,'to_port':to_port,
                                       'protocol':protocol,'direction':rule['direction'],
                                       'remote':remote,'remote_secgroup':remote_secgroup})
        
        priority = 1
        for rule in secgroup_rules:
            secgroup_rule = {'protocol':rule['protocol'],'direction':rule['direction'],'fromPort':rule['from_port'],'toPort':rule['to_port']}
            
            ipv4_cidrs = set()
            ipv6_cidrs = set()
            if rule['remote_secgroup']:
                filters = {'security_group_id': [rule['remote']]}
                ports = self._get_port_security_group_bindings(context, filters)
                for port in ports:
                    try:
                        port_info = self.get_port(context,port['port_id'])
                    except exceptions.PortNotFound:
                        continue
                    for fixed_ip in port_info['fixed_ips']:
                        subnet = self.get_subnet(context,fixed_ip['subnet_id'])
                        if rule['ethertype'] != 'IPv%d' % subnet['ip_version']:
                            continue
                        if rule['ethertype'] == 'IPv4':
                            ipv4_cidrs.add(fixed_ip['ip_address']+'/32')
                        else:
                            ipv6_cidrs.add(fixed_ip['ip_address']+'/128')
            else:
                if rule['ethertype'] == 'IPv4':
                    ipv4_cidrs.add(rule['remote'])
                else:
                    ipv6_cidrs.add(rule['remote'])
            
            for cidr in ipv4_cidrs:
                secgroup_rule['ip_version'] = 'ipv4'
                secgroup_rule['cidr'] = cidr
                security_rule = self._security.switch_security_group_rule(secgroup_rule,priority)
                security_rules.append(security_rule)
                priority = priority + 1
            
            for cidr in ipv6_cidrs:
                secgroup_rule['ip_version'] = 'ipv6'
                secgroup_rule['cidr'] = cidr
                security_rule = self._security.switch_security_group_rule(secgroup_rule,priority)
                security_rules.append(security_rule)
                priority = priority + 1
        
        if CONF.cas.security_policy == 'acl' and CONF.cas.enable_dhcp_security:
            dhcp_rules = [{'ip_version':'ipv4','protocol':'UDP','direction':'ingress','cidr':'0.0.0.0/0','fromPort':68,'toPort':68},
                          {'ip_version':'ipv4','protocol':'UDP','direction':'egress','cidr':'0.0.0.0/0','fromPort':67,'toPort':67},
                          {'ip_version':'ipv6','protocol':'UDP','direction':'ingress','cidr':'::/0','fromPort':546,'toPort':546},
                          {'ip_version':'ipv6','protocol':'UDP','direction':'egress','cidr':'::/0','fromPort':547,'toPort':547},
                          {'ip_version':'ipv6','protocol':'ICMP','direction':'egress','cidr':'::/0','fromPort':135,'toPort':-1},
                          {'ip_version':'ipv6','protocol':'ICMP','direction':'ingress','cidr':'::/0','fromPort':135,'toPort':-1},
                          {'ip_version':'ipv6','protocol':'ICMP','direction':'egress','cidr':'::/0','fromPort':136,'toPort':-1},
                          {'ip_version':'ipv6','protocol':'ICMP','direction':'ingress','cidr':'::/0','fromPort':136,'toPort':-1}]
            
            for dhcp_rule in dhcp_rules:
                security_rule = self._security.switch_security_group_rule(dhcp_rule,priority)
                security_rules.append(security_rule)
                priority = priority + 1
        
        return security_rules
    
    def _prepare_security_group(self, context, secgroupId):
        sem = self._semObj.get_obj_sem(secgroupId)
        sem.acquire()
        try:
            exist = self._security.check_security_group(secgroupId)
            if not exist:
                rules = self._get_secgroup_rules(context,secgroupId)
                self._security.prepare_security_group(secgroupId,rules)
            else:
                LOG.debug(_("security group %s already exist on cas, dosen't need to create!") % ('openstack-'+secgroupId))
        except Exception as exc:
            raise exc
        finally:
            sem.release()
            self._semObj.back_obj_sem(secgroupId)
    
    def _prepare_network_policy(self, context, networkId, segmentationId):
        sem = self._semObj.get_obj_sem(networkId)
        sem.acquire()
        try:
            uri = self._session.make_cmd_uri('/profile/isExist','openstack-'+networkId)
            resp,body = self._session.call_method("GET",uri)
            if resp.status_code == 200:
                if body == 'false':
                    uri = self._session.make_cmd_uri('/profile')
                    xmlstr = self._xml.encode_xml("create_net_policy", name='openstack-'+networkId, vlanId=segmentationId)
                    resp,body = self._session.call_method("POST",uri,body=xmlstr)
                    if resp.status_code != 204:
                        LOG.error(_("create network policy failed, uri:%s, xmlstr:%s") % (uri,xmlstr))
                        LOG.error(_("create network policy failed, resp.status_code:%d,%s")
                                    % (resp.status_code,cas_error.get_http_respond_error(resp)))
                        raise cas_error.CasNetworkException()
            else:
                LOG.error(_("query network policy failed, uri:%s") % uri)
                LOG.error(_("query network policy failed,resp.status_code:%d,%s")
                         % (resp.status_code,cas_error.get_http_respond_error(resp)))
                raise cas_error.CasNetworkException()
        except Exception as exc:
            raise exc
        finally:
            sem.release()
            self._semObj.back_obj_sem(networkId)
    
    def _update_remote_security_groups(self, context, secgroupIds):
        update_secgroups = set()
        
        filters = {'remote_group_id': secgroupIds}
        rules = self.get_security_group_rules(context,filters)
        for rule in rules:
            update_secgroups.add(rule['security_group_id'])
        
        for secgroup in update_secgroups:
            try:
                self._update_security_group(context,secgroup,True)
            except Exception:
                LOG.error(_("fail to update security_group[%s] when update remote security groups.") % secgroup)
    
    def security_groups_rule_updated(self, context, **kwargs):
        security_groups = kwargs.get('security_groups', [])
        adminContext = neutroncontext.get_admin_context()
        check = self._check_whether_do_it(adminContext,'updated security group %s rule' % security_groups)
        if check:
            for secgroupId in security_groups:
                self._update_security_group(adminContext,secgroupId)
    
    def security_groups_member_updated(self, context, **kwargs):
        security_groups = kwargs.get('security_groups', [])
        adminContext = neutroncontext.get_admin_context()
        check = self._check_whether_do_it(adminContext,'updated security group %s member' % security_groups)
        if check:
            if CONF.cas.enable_remote_security_group:
                self._update_remote_security_groups(adminContext,security_groups)
            else:
                LOG.info(_("remote security group is disabled, dosen't need to update group member."))
    
    def _sync_ports_info(self, context):
        binding_ports = []
        
        for binding_port in self._get_binding_ports(context):
            port_id = binding_port['port_id']
            binding_ports.append(port_id)
            
            try:
                port = self.get_port(context,port_id)
            except Exception:
                LOG.warning(_("can't get port[%s], may have been deleted, do nothing.") % port_id)
                continue
            
            self._update_port(port,True)
        
        for port_id in (set(self._ports.keys()) - set(binding_ports)):
            sem = self._semObj.get_obj_sem(port_id)
            sem.acquire()
            try:
                deleted = False
                try:
                    binding_port = self._get_binding_port(context,port_id)
                except Exception:
                    LOG.warning(_("can't get port[%s], delete cache now.") % port_id)
                    deleted = True
                
                if deleted or binding_port.get('host') != self._hostname:
                    self.ext_manager.delete_port(context,{'port_id':port_id})
                    del self._ports[port_id]
            except Exception:
                LOG.error(_("fail to clean port %s when daemon loop") % port_id)
            finally:
                sem.release()
                self._semObj.back_obj_sem(port_id)
    
    def _sync_network_policies(self, context):
        try:
            uri = self._session.make_cmd_uri('/profile')
            resp,body = self._session.call_method('GET',uri)
            if resp.status_code == 200:
                net_list = self._xml.decode_xml('get_net_list',body)
            else:
                LOG.error(_("fail to get net policy list, resp.status_code:%d,%s")
                         % (resp.status_code,cas_error.get_http_respond_error(resp)))
                raise Exception(_("see error log message to get detailed information!"))
            
            if self.default_policy_name not in net_list:
                self._prepare_network_policy(context,self.default_policy_name,1)
        except Exception as exc:
            LOG.error(_("fail to sync network policy list when daemon loop. exc:%s") % exc)
    
    def _sync_security_groups(self, context, need_sync_delete):
        try:
            exist = self._acl_security.check_security_group(self.default_policy_name)
            if not exist:
                self._acl_security.prepare_security_group(self.default_policy_name,[])
            exist = self._acl_security.check_security_group(self.default_accept_policy_name)
            if not exist:
                self._acl_security.prepare_security_group(self.default_accept_policy_name,[])

            exist = self._fw_security.check_security_group(self.default_policy_name)
            if not exist:
                self._fw_security.prepare_security_group(self.default_policy_name,[])
            exist = self._fw_security.check_security_group(self.default_accept_policy_name)
            if not exist:
                self._fw_security.prepare_security_group(self.default_accept_policy_name,[])

            if CONF.cas.enable_sync_security_group:
                sec_list = self._security.get_security_group_list()
            
                secgroupIds = [secgroup['id'] for secgroup in self.get_security_groups(context)]
                secgroupIds.append(self.default_policy_name)
                secgroupIds.append(self.default_accept_policy_name)
            
                for secgroupId in set(sec_list) & set(secgroupIds):
                    try:
                        self._update_security_group(context,secgroupId,True)
                    except Exception:
                        LOG.error(_("fail to update security_group[%s] when daemon loop.") % secgroupId)
                
                if need_sync_delete:
                    for secgroupId in (set(sec_list) - set(secgroupIds)):
                        try:
                            self._delete_security_group(secgroupId)
                        except Exception:
                            LOG.error(_("fail to delete security_group[%s] when daemon loop.") % secgroupId)
        except Exception as exc:
            LOG.error(_("fail to sync acl policy list when daemon loop. exc:%s") % exc)
    
    def daemon_loop(self):
        sync_count = 1
        need_sync_delete = True
        while True:
            LOG.info(_("begin to run daemon loop"))
            
            adminContext = neutroncontext.get_admin_context()
            self._sync_ports_info(adminContext)
            check = self._check_whether_do_it(adminContext,'sync network and security group between openstack and CAS.')
            if check:
                self._sync_network_policies(adminContext)
                self._sync_security_groups(adminContext, need_sync_delete)
            
            if need_sync_delete:
                need_sync_delete = False
            
            sync_count += 1
            if sync_count > 6*24:
                sync_count = 1
                need_sync_delete = True
            
            LOG.info(_("finish to run daemon loop"))
            
            time.sleep(600)
