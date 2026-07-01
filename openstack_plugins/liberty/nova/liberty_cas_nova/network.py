#add by zhangmingze, 2014-12-5

import uuid

from oslo_config import cfg
from oslo_log import log as logging
from nova.i18n import _
from nova.network.neutronv2 import api as neutronapi
from nova import context as novacontext
from nova.virt.casapi import error as cas_error
from nova.virt.casapi import xml as casxml
from nova.virt.casapi import sem as cassem

CONF = cfg.CONF

LOG = logging.getLogger(__name__)

CAS_NETWORK_TYPE = {
    '0':'bridge',
    '1':'nat',
    '2':'no network',
    '3':'physical interface',
    '4':'SR-IOV'
}

class CasNetwork(object):
    """
    Implements network related operations.
    """
    
    def __init__(self, session, virthost):
        self._session = session
        self._virthost = virthost
        self._xml = casxml.NetworkXml()
        self._semObj = cassem.CasSem()
        self._vswitches = CONF.cas.vswitches
    
    def _get_vnic_type(self, vif):
        vif_type = vif['type']
        if vif_type != 'ovs' and vif_type != 'hw_veb':
            LOG.error(_("Invalid network vif_type for cas driver. vif:%s") % vif)
            raise cas_error.CasNetworkException()
        
        vnic_type = vif['vnic_type']
        if vnic_type != 'normal' and vnic_type != 'direct':
            LOG.error(_("Invalid network vnic_type for cas driver. vif:%s") % vif)
            raise cas_error.CasNetworkException()
        
        return vnic_type
    
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
    
    def _get_vif_info(self, vif):
        vif_info = {}
        network_id=vif['network']['id']
        _neutron_client = neutronapi.get_client(novacontext.get_admin_context())
        
        for subnet in vif['network']['subnets']:
            ip_info = {}
            
            subnet_info = _neutron_client.list_subnets(cidr=subnet['cidr'],network_id=network_id)['subnets'][0]
            if subnet_info['enable_dhcp']:
                ip_info['bootproto'] = 'dhcp'
                if subnet_info['ipv6_address_mode']:
                    ip_info['mode'] = subnet_info['ipv6_address_mode']
            else:
                ip_info['bootproto'] = 'static'
                
                ip_info['ip'] = subnet['ips'][0]['address']
                ip_info['mask'] = self._get_netmask_from_cidr(subnet['cidr'],subnet['version'])
                
                if subnet['gateway']['address']:
                    ip_info['gateway'] = subnet['gateway']['address']
                
                if len(subnet['dns']) == 1:
                    ip_info['masterDns'] = subnet['dns'][0]['address']
                elif len(subnet['dns']) >= 2:
                    ip_info['masterDns'] = subnet['dns'][0]['address']
                    ip_info['slaveDns'] = subnet['dns'][1]['address']
                
                if len(subnet['routes']) != 0:
                    routes = []
                    for route in subnet['routes']:
                        cidr = route['cidr']
                        route_item = {'destination': cidr.split('/')[0],
                                      'netmask': self._get_netmask_from_cidr(cidr,subnet['version']),
                                      'gateway': route['gateway']['address']}
                        routes.append(route_item)
                    
                    ip_info['route'] = routes
            
            version = 'ipv' + str(subnet['version'])
            vif_info[version] = ip_info
        
        return vif_info
    
    def _get_interface_info(self, vif, choiceVswitch, net_model, net_queues):
        interface_info = {'mac':vif['address'].lower()}
        
        vnic_type = self._get_vnic_type(vif)
        if vnic_type == 'normal':
            interface_info['deviceModel'] = net_model
            interface_info['vswitch'] = self._get_interface_vswitch(vif,choiceVswitch)
            if net_model == 'virtio' and net_queues is not None:
                interface_info['queues'] = net_queues
        else:
            interface_info['pciAddress'] = vif["profile"]['pci_slot']
            interface_info['deviceModel'] = 'SR_IOV'
        
        policy = self._get_interface_default_policy(vnic_type)
        if policy:
            interface_info.update(policy)
        
        return interface_info
    
    def check_network_exist(self, vmNetworks, vif):
        mac = vif['address'].lower()
        if mac not in vmNetworks:
            return False
        
        vnic_type = self._get_vnic_type(vif)
        netType = CAS_NETWORK_TYPE.get(vmNetworks[mac]['netType'])
        if vnic_type == 'normal' and netType == 'bridge':
            return True
        elif vnic_type == 'direct' and netType == 'SR-IOV':
            return True
        else:
            LOG.error(_("instance already exists interface[mac:%s] with net_type[%s]")
                      % (mac,netType))
            raise cas_error.CasNetworkException()
    
    def network_interface_info(self, network_info, net_model, net_queues, bindIp):
        interfaces = {'base_info':[],'vif_info':[]}
        choiceVswitch = {'index':0}
        for index in range(0,len(network_info)):
            vif = network_info[index]
            interface_info = self._get_interface_info(vif,choiceVswitch,net_model,net_queues)
            vif_info = self._get_vif_info(vif)
            if vif_info:
                if bindIp and interface_info['deviceModel'] != 'SR_IOV':
                    for version, ip_info in vif_info.items():
                        if ip_info['bootproto'] == 'static':
                            interface_info[version] = {'ip':ip_info['ip']}
                vif_info['mac'] = interface_info['mac']
                interfaces['vif_info'].append(vif_info)
            interfaces['base_info'].append(interface_info)
        return interfaces
    
    def change_vif_name(self, instanceId, vif):
        self._change_vif_name(instanceId,vif)
    
    def update_vif_name(self, vif):
        self._update_vif_name(vif)
    
    def update_vif_policy(self, vif, hostname):
        _neutron_client = neutronapi.get_client(novacontext.get_admin_context())
            
        port = _neutron_client.show_port(vif['id'])['port']
        port_profile = port.get('binding:profile',{})
        port_profile['cvk_host'] = hostname
        port_profile['update_id'] = uuid.uuid1()
        
        update_port = {'binding:profile':port_profile,'binding:host_id':self._virthost}
        LOG.info(_("update port[%s] profile to neutron, update info:%s") % (vif['id'],update_port))
        
        try:
            _neutron_client.update_port(vif['id'],{'port':update_port})
        except Exception as e:
            LOG.info(_("failed to update profile:vif_id:%s,update_port:%s,exec:%s") % (vif['id'],update_port,e))
            raise cas_error.CasNetworkException()
    
    def update_vif_by_instance_migrate(self, instance_uuid, hostname):
        _neutron_client = neutronapi.get_client(novacontext.get_admin_context())
        
        vm_ports = _neutron_client.list_ports(device_id=instance_uuid)
        LOG.info(_("begin to migrated ports_update:uuid:%s,hostname:%s,vm_ports%s")%(instance_uuid, hostname,vm_ports))
        for port in vm_ports['ports']:
            port_profile = port.get('binding:profile',{})
            src_cvk_host = port_profile.get('cvk_host')
            LOG.info(_("port update check:vm:%s,%s,%s") % (instance_uuid,src_cvk_host,hostname))
            if src_cvk_host != hostname:
                port_profile['cvk_host'] = hostname
                port_profile['update_id'] = uuid.uuid1()
                
                try:
                    update_port = {'binding:profile':port_profile,'binding:host_id':self._virthost}
                    LOG.info(_("begin to update profile:vm[%s],port[%s],info:%s")%(instance_uuid,port['id'],update_port))
                    _neutron_client.update_port(port['id'], {'port':update_port})
                    LOG.info(_("finish to update profile:vm[%s],port[%s],info:%s")%(instance_uuid,port['id'],update_port))
                except Exception as e:
                    LOG.info(_("failed to update profile:%s,%s,info:%s,exec:%s")%(instance_uuid,port['id'],update_port,e))
                    raise cas_error.CasNetworkException()
    
    def attach_interface(self, instanceId, interface_info):
        """Attach an interface to the instance."""
        
        uri = self._session.make_cmd_uri('/nova/vm/network')
        xmlstr = self._xml.encode_xml("attach_vnic",id=instanceId,interface=interface_info)
        resp,body = self._session.call_method("POST",uri,body=xmlstr)
        if resp.status_code == 200:
            msgId = self._xml.decode_xml("get_message_id",body)
            task = self._session.wait_for_task(msgId)
            if task['result'] != 0:
                LOG.error(_("fail to attach interface to instance, uri:%s, xmlstr:%s, failMsg:%s")
                          % (uri,xmlstr,task['failMsg']))
                raise cas_error.CasNetworkException()
            LOG.info(_("success to attach interface to instance[id=%s].interface_info:%s") % (instanceId,interface_info))
        else:
            LOG.error(_("fail to attach interface to instance, uri:%s, xmlstr:%s, status_code:%d, %s")
                      % (uri,xmlstr,resp.status_code,cas_error.get_http_respond_error(resp)))
            raise cas_error.CasNetworkException()
    
    def config_interface(self, instanceId, vif_info):
        uri = self._session.make_cmd_uri('/nova/vm/configNetwork')
        xmlstr = self._xml.encode_xml("config_vnic",id=instanceId,interface=vif_info)
        resp,body = self._session.call_method("PUT",uri,body=xmlstr)
        if resp.status_code == 200:
            msgId = self._xml.decode_xml("get_message_id",body)
            task = self._session.wait_for_task(msgId,1.5)
            if task['result'] != 0:
                LOG.error(_("fail to config interface, uri:%s, xmlstr:%s") % (uri,xmlstr))
                LOG.error(_("fail to config interface, failMsg:%s") % task['failMsg'])
            else:
                LOG.info(_("success to config interface to instance[id=%s].") % instanceId)
        else:
            LOG.error(_("fail to config interface, uri:%s, xmlstr:%s") % (uri,xmlstr))
            LOG.error(_("fail to config interface, resp.status_code:%d, %s")
                     % (resp.status_code,cas_error.get_http_respond_error(resp)))
    
    def detach_interface(self, instanceId, vif):
        """Detach an interface from the instance."""
        interface_info = {'mac':vif['address'].lower()}
        vnic_type = self._get_vnic_type(vif)
        if vnic_type == 'normal':
            interface_info['deviceModel'] = 'virtio'
        else:
            interface_info['deviceModel'] = 'SR_IOV'
        
        uri = self._session.make_cmd_uri('/nova/vm/network')
        xmlstr = self._xml.encode_xml("detach_vnic",id=instanceId,interface=interface_info)
        resp,body = self._session.call_method("DELETE",uri,body=xmlstr)
        if resp.status_code == 200:
            msgId = self._xml.decode_xml("get_message_id",body)
            task = self._session.wait_for_task(msgId)
            if task['result'] != 0:
                LOG.error(_("fail to detach interface from instance, uri:%s, xmlstr:%s, failMsg:%s")
                          % (uri,xmlstr,task['failMsg']))
                raise cas_error.CasNetworkException()
            LOG.info(_("success to detach interface from instance[id=%s].interface_info:%s") % (instanceId,interface_info))
        else:
            LOG.error(_("fail to detach interface from instance, uri:%s, xmlstr:%s, status_code:%d, %s")
                      % (uri,xmlstr,resp.status_code,cas_error.get_http_respond_error(resp)))
            raise cas_error.CasNetworkException()
    
    def update_interface_qos(self, vmId, vif, bandwidth_conf):
        vnic_type = self._get_vnic_type(vif)
        if vnic_type == 'direct':
            return
        
        mac = vif['address'].lower()
        xmlstr = self._xml.encode_xml("config_qos", vmId=vmId, mac=mac, **bandwidth_conf)
        uri = self._session.make_cmd_uri('/nova/interface/qos')
        resp,body = self._session.call_method('PUT',uri,body=xmlstr)
        if resp.status_code == 200:
            msgId = self._xml.decode_xml("get_message_id",body)
            task = self._session.wait_for_task(msgId)
            if task['result'] != 0:
                LOG.error(_("fail to config interface[%s] qos. uri:%s, xmlstr:%s") % (mac,uri,xmlstr))
                LOG.error(_("fail to config interface[%s] qos. failMsg:%s") % (mac,task['failMsg']))
                raise cas_error.CasNetworkException()
        else:
            LOG.error(_("fail to config interface[%s] qos. uri:%s, xmlstr:%s") % (mac,uri,xmlstr))
            LOG.error(_("fail to config interface[%s] qos. resp.status_code:%d,%s")
                      % (mac,resp.status_code,cas_error.get_http_respond_error(resp)))
            raise cas_error.CasNetworkException()
        
class CasNetworkOvs(CasNetwork):
    def _get_interface_vswitch(self, vif, choiceVswitch):
        _neutron_client = neutronapi.get_client(novacontext.get_admin_context())
        if not choiceVswitch.get('bridge_mappings'):
            agent_info = _neutron_client.list_agents(binary='neutron-cas-ovs-agent',host=self._virthost)['agents'][0]
            choiceVswitch['bridge_mappings'] = agent_info['configurations']['bridge_mappings']
        
        if hasattr(_neutron_client,'port_bottom_segments'):
            physical_network = None
            port_uuid = vif['id']
            try:
                port = _neutron_client.port_bottom_segments(port_uuid)
                if port.has_key('port_bottom_segment'):
                    port_bottom_segment = port['port_bottom_segment']
                    if port_bottom_segment.has_key('physical_network'):
                        physical_network = port_bottom_segment['physical_network']
            except Exception:
                LOG.error(_("port %s bottom segments not found!") % port_uuid)
        else:
            net_info = _neutron_client.show_network(vif['network']['id']).get('network')
            physical_network = net_info.get('provider:physical_network')
        
        if physical_network:
            vswitch = choiceVswitch['bridge_mappings'][physical_network]
        else:
            vswitch = choiceVswitch['bridge_mappings'].values()[0]
        
        if vswitch == '*':
            if self._vswitches:
                index = choiceVswitch['index']
                vswitch = self._vswitches[index % len(self._vswitches)]
                choiceVswitch['index'] = index + 1
            else:
                LOG.error(_("The vswitch * can bind to physical network %s only when the option vswitches is set!") % physical_network)
                raise cas_error.CasNetworkException()
        
        return vswitch
    
    def _get_interface_default_policy(self, vnic_type):
        default_policy = {}
        if vnic_type == 'normal':
            default_policy['profileName'] = 'openstack-default'
            default_policy['aclName'] = 'openstack-default'
        else:
            default_policy['vlan'] = 1
        return default_policy
    
    def _change_vif_name(self, instanceId, vif):
        LOG.info(_("the neutron plugin is openvswitch, dosen't need to change vif name!"))
    
    def _update_vif_name(self, vif):
        LOG.info(_("the neutron plugin is openvswitch, dosen't need to update vif name!"))

class CasNetworkVcfc(CasNetwork):
    def __init__(self, session, virthost):
        super(CasNetworkVcfc,self).__init__(session,virthost)
        
        if not self._vswitches:
            raise Exception(_("neutron plugin is vcfc, but the option vswitches is not set!"))
    
    def _get_domain_uuid(self):
        uri = self._session.make_cmd_uri('/nova/domain')
        resp,body = self._session.call_method("GET",uri)
        if resp.status_code == 200:
            domain_uuid = body
            LOG.info(_("get domain uuid, uuid=%s") % domain_uuid)
            return domain_uuid
        else:
            LOG.error(_("fail to get domain uuid, uri:%s") % uri)
            LOG.error(_("fail to get domain uuid! resp.status_code:%d,%s")
                     % (resp.status_code,cas_error.get_http_respond_error(resp)))
            raise cas_error.CasNetworkException()
    
    def _get_interface_vswitch(self, vif, choiceVswitch):
        index = choiceVswitch['index']
        vswitch = self._vswitches[index % len(self._vswitches)]
        choiceVswitch['index'] = index + 1
        return vswitch
    
    def _get_interface_default_policy(self, vnic_type):
        LOG.info(_("the neutron plugin is vcfc, dosen't need to set default policy!"))
    
    def _change_vif_name(self, instanceId, vif):
        vnic_type = self._get_vnic_type(vif)
        if vnic_type == 'normal':
            mac = vif['address'].lower()
            uri = self._session.make_cmd_uri('/nova/vm/renameVnet',id=instanceId,mac=mac)
            resp,body = self._session.call_method("PUT",uri)
            if resp.status_code == 200:
                msgId = self._xml.decode_xml("get_message_id",body)
                task = self._session.wait_for_task(msgId)
                if task['result'] != 0:
                    LOG.error(_("fail to change instance vif name,uri:%s,failMsg:%s")%(uri,task['failMsg']))
                    raise cas_error.CasNetworkException()
                LOG.info(_("success to change instance vif name,uri:%s") % uri)
            else:
                LOG.error(_("fail to change instance vif name,uri:%s, status_code:%d, %s")
                          % (uri,resp.status_code,cas_error.get_http_respond_error(resp)))
                raise cas_error.CasNetworkException()
        else:
            LOG.info(_("the vnic is not normal, dosen't need to change vif name!"))
    
    def _update_vif_name(self, vif):
        vnic_type = self._get_vnic_type(vif)
        if vnic_type == 'normal':
            _neutron_client = neutronapi.get_client(novacontext.get_admin_context())
            
            update_port ={'name':'vnet'+vif['address'].lower().replace(':','')[2:],
                          'port_extensions':{'domain':self._get_domain_uuid(),
                                             'virt_type' : 'CAS'}}
            LOG.info(_("update port to neutron, port info:%s") % update_port)
            
            try:
                _neutron_client.update_port(vif['id'],{'port':update_port})
            except Exception as e:
                LOG.info(_("failed to update profile:vif_id:%s,update_port:%s,exec:%s") % (vif['id'],update_port,e))
                raise cas_error.CasNetworkException()
