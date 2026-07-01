import time
import netaddr
import six
import sys
from six import moves

from oslo_config import cfg
from oslo_log import log as logging

from neutron.i18n import _
from neutron import context
from neutron.common import topics
from neutron.common import utils as n_utils
from neutron.common import constants as n_const
from neutron.common import ipv6_utils as ipv6
from neutron.agent import rpc as agent_rpc
from neutron.agent.common import polling
from neutron.agent.common import ip_lib
from neutron.agent.common import ovs_lib
from neutron.agent.common import utils
from neutron.plugins.common import utils as p_utils
from neutron.plugins.common import constants as p_const
from neutron.plugins.ml2.drivers.openvswitch.agent.common import constants
from neutron.plugins.ml2.drivers.openvswitch.agent.openflow.ovs_ofctl import br_int
from neutron.plugins.ml2.drivers.openvswitch.agent.openflow.ovs_ofctl import br_phys

CONF = cfg.CONF

LOG = logging.getLogger(__name__)

class LocalVLANMapping(object):
    def __init__(self, vlan, network_type, physical_network, segmentation_id, vif_ports=None):
        if vif_ports is None:
            vif_ports = {}
        self.vlan = vlan
        self.network_type = network_type
        self.physical_network = physical_network
        self.segmentation_id = segmentation_id
        self.vif_ports = vif_ports
    
    def __str__(self):
        return ("lv-id = %s type = %s phys-net = %s phys-id = %s" %
                (self.vlan, self.network_type, self.physical_network,
                 self.segmentation_id))

class OVSDhcpPortMonitor(object):
    def __init__(self):
        self._agent_id = 'ovs-agent-%s' % CONF.host
        self._use_veth_interconnection = CONF.OVS.use_veth_interconnection
        self._veth_mtu = CONF.AGENT.veth_mtu
        self._polling_interval = CONF.AGENT.polling_interval
        self._minimize_polling = CONF.AGENT.minimize_polling
        self._prevent_arp_spoofing = CONF.AGENT.prevent_arp_spoofing
        
        self._iter_num = 0
        self._vifname_to_ofport_map = {}
        self._local_vlan_map = {}
        self._available_local_vlans = set(moves.range(p_const.MIN_VLAN_TAG,p_const.MAX_VLAN_TAG))
        self._ovsdb_monitor_respawn_interval = (CONF.AGENT.ovsdb_monitor_respawn_interval or constants.DEFAULT_OVSDBMON_RESPAWN)
        
        self._plugin_rpc = agent_rpc.PluginApi(topics.PLUGIN)
        self._context = context.get_admin_context_without_session()
        
        self._int_br = br_int.OVSIntegrationBridge(CONF.OVS.integration_bridge)
        self._setup_integration_br()
        try:
            bridge_mappings = CONF.OVS.bridge_mappings or CONF.cas.bridge_mappings
            self._bridge_mappings = n_utils.parse_mappings(bridge_mappings)
        except ValueError as e:
            raise ValueError(_("Parsing bridge_mappings failed: %s.") % e)
        self._setup_physical_bridges()
        self._ancillary_brs = self._setup_ancillary_bridges(CONF.OVS.integration_bridge)
        
        self._restore_local_vlan_map()
    
    def _setup_physical_bridges(self):
        self._phys_brs = {}
        self._int_ofports = {}
        self._phys_ofports = {}
        ip_wrapper = ip_lib.IPWrapper()
        ovs = ovs_lib.BaseOVS()
        ovs_bridges = ovs.get_bridges()
        for physical_network, bridge in six.iteritems(self._bridge_mappings):
            LOG.info(_("Mapping physical network %(physical_network)s to bridge %(bridge)s")
                     % {'physical_network':physical_network,'bridge':bridge})
            if bridge not in ovs_bridges:
                LOG.error(_("Bridge %(bridge)s for physical network %(physical_network)s does not exist. Agent terminated!")
                          % {'physical_network':physical_network,'bridge':bridge})
                sys.exit(1)
            
            br = br_phys.OVSPhysicalBridge(bridge)
            br.create()
            br.setup_controllers(CONF)
            if CONF.AGENT.drop_flows_on_start:
                br.delete_flows()
            br.setup_default_table()
            self._phys_brs[physical_network] = br
            
            int_if_name = p_utils.get_interface_name(bridge,prefix=constants.PEER_INTEGRATION_PREFIX)
            phys_if_name = p_utils.get_interface_name(bridge,prefix=constants.PEER_PHYSICAL_PREFIX)
            int_type = self._int_br.db_get_val("Interface",int_if_name,"type")
            if self._use_veth_interconnection:
                if int_type == 'patch':
                    self._int_br.delete_port(int_if_name)
                    br.delete_port(phys_if_name)
                device = ip_lib.IPDevice(int_if_name)
                if device.exists():
                    device.link.delete()
                    utils.execute(['udevadm', 'settle', '--timeout=10'])
                int_veth, phys_veth = ip_wrapper.add_veth(int_if_name,phys_if_name)
                int_ofport = self._int_br.add_port(int_veth)
                phys_ofport = br.add_port(phys_veth)
            else:
                if int_type == 'veth':
                    self._int_br.delete_port(int_if_name)
                    br.delete_port(phys_if_name)
                int_ofport = self._int_br.get_port_ofport(int_if_name)
                if int_ofport == ovs_lib.INVALID_OFPORT:
                    int_ofport = self._int_br.add_patch_port(int_if_name,constants.NONEXISTENT_PEER)
                phys_ofport = br.get_port_ofport(phys_if_name)
                if phys_ofport == ovs_lib.INVALID_OFPORT:
                    phys_ofport = br.add_patch_port(phys_if_name,constants.NONEXISTENT_PEER)
            
            self._int_ofports[physical_network] = int_ofport
            self._phys_ofports[physical_network] = phys_ofport
            
            self._int_br.drop_port(in_port=int_ofport)
            br.drop_port(in_port=phys_ofport)
            
            if self._use_veth_interconnection:
                int_veth.link.set_up()
                phys_veth.link.set_up()
                if self._veth_mtu:
                    int_veth.link.set_mtu(self._veth_mtu)
                    phys_veth.link.set_mtu(self._veth_mtu)
            else:
                self._int_br.set_db_attribute('Interface',int_if_name,'options',{'peer':phys_if_name})
                br.set_db_attribute('Interface',phys_if_name,'options',{'peer':int_if_name})
    
    def _setup_integration_br(self):
        self._int_br.create()
        self._int_br.set_secure_mode()
        self._int_br.setup_controllers(CONF)
        
        if CONF.AGENT.drop_flows_on_start:
            self._int_br.delete_port(CONF.OVS.int_peer_patch_port)
            self._int_br.delete_flows()
        self._int_br.setup_default_table()
    
    def _setup_ancillary_bridges(self, integ_br):
        ovs = ovs_lib.BaseOVS()
        ovs_bridges = set(ovs.get_bridges())
        ovs_bridges.remove(integ_br)
        br_names = [self._phys_brs[physical_network].br_name for physical_network in self._phys_brs]
        ovs_bridges.difference_update(br_names)
        
        br_names = []
        for bridge in ovs_bridges:
            bridge_id = ovs.get_bridge_external_bridge_id(bridge)
            if bridge_id != bridge:
                br_names.append(bridge)
        ovs_bridges.difference_update(br_names)
        ancillary_bridges = []
        for bridge in ovs_bridges:
            br = ovs_lib.OVSBridge(bridge)
            LOG.info(_('Adding %s to list of bridges.') % bridge)
            ancillary_bridges.append(br)
        return ancillary_bridges
    
    def _restore_local_vlan_map(self):
        self._local_vlan_hints = {}
        cur_ports = self._int_br.get_vif_ports()
        port_names = [p.port_name for p in cur_ports]
        port_info = self._int_br.get_ports_attributes("Port",columns=["name","other_config","tag"],ports=port_names)
        by_name = {x['name']: x for x in port_info}
        for port in cur_ports:
            try:
                local_vlan_map = by_name[port.port_name]['other_config']
                local_vlan = by_name[port.port_name]['tag']
            except KeyError:
                continue
            if local_vlan:
                net_uuid = local_vlan_map.get('net_uuid')
                if (net_uuid and net_uuid not in self._local_vlan_hints and local_vlan != constants.DEAD_VLAN_TAG):
                    self._available_local_vlans.remove(local_vlan)
                    self._local_vlan_hints[local_vlan_map['net_uuid']] = local_vlan
    
    def _dispose_local_vlan_hints(self):
        self._available_local_vlans.update(self._local_vlan_hints.values())
        self._local_vlan_hints = {}
    
    def _check_ovs_status(self):
        status = self._int_br.check_canary_table()
        if status == constants.OVS_RESTARTED:
            LOG.warning(_("OVS is restarted. OVSNeutronAgent will reset bridges and recover ports."))
        elif status == constants.OVS_DEAD:
            LOG.warning(_("OVS is dead. OVSNeutronAgent will keep running and checking OVS status periodically."))
        return status
    
    def _setup_arp_spoofing_protection(self, bridge, vif, port_details):
        if not port_details.get('port_security_enabled',True):
            LOG.info(_("Skipping ARP spoofing rules for port '%s' because it has port security disabled") % vif.port_name)
            bridge.delete_arp_spoofing_protection(port=vif.ofport)
            bridge.set_allowed_macs_for_port(port=vif.ofport,allow_all=True)
            return
        if port_details['device_owner'].startswith(n_const.DEVICE_OWNER_NETWORK_PREFIX):
            LOG.debug(_("Skipping ARP spoofing rules for network owned port '%s'.") % vif.port_name)
            bridge.delete_arp_spoofing_protection(port=vif.ofport)
            bridge.set_allowed_macs_for_port(port=vif.ofport,allow_all=True)
            return
        
        bridge.delete_arp_spoofing_allow_rules(port=vif.ofport)
        
        addresses = {f['ip_address'] for f in port_details['fixed_ips']}
        mac_addresses = {vif.vif_mac}
        if port_details.get('allowed_address_pairs'):
            addresses |= {p['ip_address'] for p in port_details['allowed_address_pairs']}
            mac_addresses |= {p['mac_address'] for p in port_details['allowed_address_pairs'] if p.get('mac_address')}
        
        bridge.set_allowed_macs_for_port(vif.ofport, mac_addresses)
        
        ipv6_addresses = {ip for ip in addresses if netaddr.IPNetwork(ip).version == 6}
        ipv6_addresses |= {str(ipv6.get_ipv6_addr_by_EUI64(n_const.IPV6_LLA_PREFIX, mac)) for mac in mac_addresses}
        if not any(netaddr.IPNetwork(ip).prefixlen == 0 for ip in ipv6_addresses):
            bridge.install_icmpv6_na_spoofing_protection(port=vif.ofport,ip_addresses=ipv6_addresses)
        ipv4_addresses = {ip for ip in addresses if netaddr.IPNetwork(ip).version == 4}
        if not any(netaddr.IPNetwork(ip).prefixlen == 0 for ip in ipv4_addresses):
            bridge.install_arp_spoofing_protection(port=vif.ofport,ip_addresses=ipv4_addresses)
        else:
            bridge.delete_arp_spoofing_protection(port=vif.ofport)
    
    def _get_port_stats(self, port_info, ancillary_port_info):
        port_stats = {'regular':{'added':len(port_info.get('added',[])),
                                 'updated':len(port_info.get('updated',[])),
                                 'removed':len(port_info.get('removed',[]))}}
        if self._ancillary_brs:
            port_stats['ancillary'] = {'added':len(ancillary_port_info.get('added',[])),
                                       'removed':len(ancillary_port_info.get('removed',[]))}
        return port_stats
    
    def _get_port_info(self, registered_ports, cur_ports, readd_registered_ports):
        port_info = {'current': cur_ports}
        if not readd_registered_ports and cur_ports == registered_ports:
            return port_info
        
        if readd_registered_ports:
            port_info['added'] = cur_ports
        else:
            port_info['added'] = cur_ports - registered_ports
        port_info['removed'] = registered_ports - cur_ports
        return port_info
    
    def _check_changed_vlans(self):
        port_tags = self._int_br.get_port_tag_dict()
        changed_ports = set()
        for lvm in self._local_vlan_map.values():
            for port in lvm.vif_ports.values():
                if port.port_name in port_tags and port_tags[port.port_name] != lvm.vlan:
                    LOG.info(_("Port '%(port_name)s' has lost its vlan tag '%(vlan_tag)d'!")
                             % {'port_name':port.port_name,'vlan_tag':lvm.vlan})
                    changed_ports.add(port.vif_id)
        return changed_ports
    
    def _provision_local_vlan(self, net_uuid, network_type, physical_network, segmentation_id):
        lvm = self._local_vlan_map.get(net_uuid)
        if lvm:
            lvid = lvm.vlan
        else:
            lvid = self._local_vlan_hints.pop(net_uuid,None)
            if lvid is None:
                if not self._available_local_vlans:
                    LOG.error(_("No local VLAN available for net-id=%s") % net_uuid)
                    return
                lvid = self._available_local_vlans.pop()
            self._local_vlan_map[net_uuid] = LocalVLANMapping(lvid,network_type,physical_network,segmentation_id)
        
        LOG.info(_("Assigning %(vlan_id)s as local vlan for net-id=%(net_uuid)s")
                 % {'vlan_id':lvid,'net_uuid':net_uuid})
        
        if network_type == p_const.TYPE_FLAT:
            br_claim = True
            segmentation_id = None
        elif network_type == p_const.TYPE_VLAN:
            br_claim = True
            segmentation_id = segmentation_id
        else:
            br_claim = False
        
        if br_claim and physical_network in self._phys_brs:
            br = self._phys_brs[physical_network]
            br.provision_local_vlan(port=self._phys_ofports[physical_network],lvid=lvid,
                                    segmentation_id=segmentation_id,distributed=False)
            self._int_br.provision_local_vlan(port=self._int_ofports[physical_network],
                                              lvid=lvid,segmentation_id=segmentation_id)
    
    def _reclaim_local_vlan(self, net_uuid):
        lvm = self._local_vlan_map.pop(net_uuid,None)
        if lvm is None:
            LOG.debug(_("Network %s not used on agent.") % net_uuid)
            return
        
        LOG.info(_("Reclaiming vlan = %(vlan_id)s from net-id = %(net_uuid)s")
                 % {'vlan_id':lvm.vlan,'net_uuid':net_uuid})
        
        if lvm.network_type == p_const.TYPE_FLAT:
            br_reclaim = True
            segmentation_id = None
        elif lvm.network_type == p_const.TYPE_VLAN:
            br_reclaim = True
            segmentation_id = lvm.segmentation_id
        else:
            br_reclaim = False
        
        if br_reclaim and lvm.physical_network in self._phys_brs:
            br = self._phys_brs[lvm.physical_network]
            br.reclaim_local_vlan(port=self._phys_ofports[lvm.physical_network],lvid=lvm.vlan)
            self._int_br.reclaim_local_vlan(port=self._int_ofports[lvm.physical_network],segmentation_id=segmentation_id)
        
        self._available_local_vlans.add(lvm.vlan)
    
    def _port_bound(self, port, net_uuid, network_type, physical_network,
                    segmentation_id, fixed_ips, device_owner, ovs_restarted):
        if net_uuid not in self._local_vlan_map or ovs_restarted:
            self._provision_local_vlan(net_uuid,network_type,physical_network,segmentation_id)
        lvm = self._local_vlan_map[net_uuid]
        lvm.vif_ports[port.vif_id] = port
        
        port_other_config = self._int_br.db_get_val("Port",port.port_name,"other_config")
        if port_other_config is None:
            return False
        
        vlan_mapping = {'net_uuid':net_uuid,'network_type':network_type,'physical_network':physical_network}
        if segmentation_id is not None:
            vlan_mapping['segmentation_id'] = segmentation_id
        port_other_config.update(vlan_mapping)
        self._int_br.set_db_attribute("Port",port.port_name,"other_config",port_other_config)
        return True
    
    def _get_net_uuid(self, vif_id):
        for network_id, vlan_mapping in six.iteritems(self._local_vlan_map):
            if vif_id in vlan_mapping.vif_ports:
                return network_id
    
    def _port_unbound(self, vif_id):
        net_uuid = self._get_net_uuid(vif_id)
        if not self._local_vlan_map.get(net_uuid):
            LOG.info(_('port_unbound(): net_uuid %s not in local_vlan_map') % net_uuid)
        else:
            lvm = self._local_vlan_map[net_uuid]
            lvm.vif_ports.pop(vif_id,None)
            if not lvm.vif_ports:
                self._reclaim_local_vlan(net_uuid)
    
    def _port_dead(self, port, log_errors=True):
        cur_tag = self._int_br.db_get_val("Port",port.port_name,"tag",log_errors=log_errors)
        if cur_tag and cur_tag != constants.DEAD_VLAN_TAG:
            self._int_br.set_db_attribute("Port",port.port_name,"tag",constants.DEAD_VLAN_TAG,log_errors=log_errors)
            self._int_br.drop_port(in_port=port.ofport)
    
    def _update_port_info_failed_devices_stats(self, port_info, failed_devices):
        failed_devices['added'] -= port_info['removed']
        failed_devices['removed'] -= port_info['added']
        
        port_info['removed'] &= port_info['current']
        port_info['added'] |= failed_devices['added']
        LOG.debug(_("retrying failed devices %s") % failed_devices['added'])
        
        port_info['removed'] |= failed_devices['removed']
        port_info['current'] |= port_info['added']
        port_info['current'] -= port_info['removed']
    
    def _get_ofport_moves(self, current, previous):
        port_moves = []
        for name, ofport in previous.items():
            if name in current:
                current_ofport = current[name]
                if ofport != current_ofport:
                    port_moves.append(name)
        return port_moves
    
    def _update_stale_ofport_rules(self):
        if not self._prevent_arp_spoofing:
            return []
        
        previous = self._vifname_to_ofport_map
        current = self._int_br.get_vif_port_to_ofport_map()
        
        moved_ports = self._get_ofport_moves(current, previous)
        
        ofports_deleted = set(previous.values()) - set(current.values())
        for ofport in ofports_deleted:
            self._int_br.delete_arp_spoofing_protection(port=ofport)
            self._int_br.set_allowed_macs_for_port(port=ofport, allow_all=True)
        
        self._vifname_to_ofport_map = current
        return moved_ports
    
    def _process_ports_events(self, events, registered_ports, ancillary_ports,
                              old_ports_not_ready, failed_devices, failed_ancillary_devices):
        port_info = {}
        port_info['added'] = set()
        port_info['removed'] = set()
        port_info['current'] = registered_ports
        
        ancillary_port_info = {}
        ancillary_port_info['added'] = set()
        ancillary_port_info['removed'] = set()
        ancillary_port_info['current'] = ancillary_ports
        
        ports_not_ready_yet = set()
        ports_removed_and_added = [p for p in events['added'] if p in events['removed']]
        for p in ports_removed_and_added:
            if ovs_lib.BaseOVS().port_exists(p['name']):
                events['removed'].remove(p)
            else:
                events['added'].remove(p)
        
        cur_ancillary_ports = set()
        for bridge in self._ancillary_brs:
            cur_ancillary_ports |= bridge.get_vif_port_set()
        cur_ancillary_ports |= ancillary_port_info['current']
        
        def _process_port(port, ports, ancillary_ports):
            if 'attached-mac' in port.get('external_ids', []):
                iface_id = self._int_br.portid_from_external_ids(port['external_ids'])
                if iface_id:
                    if port['ofport'] == ovs_lib.UNASSIGNED_OFPORT:
                        LOG.debug(_("Port %s not ready yet on the bridge") % iface_id)
                        ports_not_ready_yet.add(port['name'])
                        return
                    if iface_id in cur_ancillary_ports:
                        ancillary_ports.add(iface_id)
                    else:
                        ports.add(iface_id)
        
        if old_ports_not_ready:
            old_ports_not_ready_attrs = self._int_br.get_ports_attributes('Interface',columns=['name','external_ids','ofport'],
                                                                          ports=old_ports_not_ready,if_exists=True)
            now_ready_ports = set([p['name'] for p in old_ports_not_ready_attrs])
            LOG.debug(_("Ports %s are now ready") % now_ready_ports)
            old_ports_not_ready_yet = old_ports_not_ready - now_ready_ports
            removed_ports = set([p['name'] for p in events['removed']])
            old_ports_not_ready_yet -= removed_ports
            LOG.debug(_("Ports %s were not ready at last iteration and are not ready yet") % old_ports_not_ready_yet)
            ports_not_ready_yet |= old_ports_not_ready_yet
            events['added'].extend(old_ports_not_ready_attrs)
        
        for port in events['added']:
            _process_port(port,port_info['added'],ancillary_port_info['added'])
        for port in events['removed']:
            _process_port(port,port_info['removed'],ancillary_port_info['removed'])
        
        self._update_port_info_failed_devices_stats(port_info,failed_devices)
        self._update_port_info_failed_devices_stats(ancillary_port_info,failed_ancillary_devices)
        
        updated_ports = self._check_changed_vlans()
        if updated_ports:
            updated_ports &= port_info['current']
            port_info['updated'] = updated_ports
        return port_info,ancillary_port_info,ports_not_ready_yet
    
    def _scan_ports(self, registered_ports, sync):
        cur_ports = self._int_br.get_vif_port_set()
        port_info = self._get_port_info(registered_ports,cur_ports,sync)
        updated_ports = self._check_changed_vlans()
        if updated_ports:
            updated_ports &= cur_ports
            if updated_ports:
                port_info['updated'] = updated_ports
        return port_info
    
    def _scan_ancillary_ports(self, registered_ports, sync):
        cur_ports = set()
        for bridge in self._ancillary_brs:
            cur_ports |= bridge.get_vif_port_set()
        return self._get_port_info(registered_ports,cur_ports,sync)
    
    def _process_port_info(self, start, polling_manager, sync, ovs_restarted, ports, ancillary_ports,
                           consecutive_resyncs, ports_not_ready_yet, failed_devices, failed_ancillary_devices):
        if sync or not (hasattr(polling_manager, 'get_events')):
            if sync:
                LOG.info(_("Agent out of sync with plugin!"))
                consecutive_resyncs = consecutive_resyncs + 1
                if consecutive_resyncs >= constants.MAX_DEVICE_RETRIES:
                    LOG.warning(_("Clearing cache of registered ports, retries to resync were > %s")
                                % constants.MAX_DEVICE_RETRIES)
                    ports.clear()
                    ancillary_ports.clear()
                    consecutive_resyncs = 0
            else:
                consecutive_resyncs = 0
                sync = any(failed_devices.values()) or any(failed_ancillary_devices.values())
            
            reg_ports = set() if ovs_restarted else ports
            port_info = self._scan_ports(reg_ports,sync)
            if self._ancillary_brs:
                ancillary_port_info = self._scan_ancillary_ports(ancillary_ports,sync)
                LOG.debug(_("Agent rpc_loop - iteration:%(iter_num)d - ancillary port info retrieved. Elapsed:%(elapsed).3f")
                          % {'iter_num':self._iter_num,'elapsed':(time.time() - start)})
            else:
                ancillary_port_info = {}
        else:
            consecutive_resyncs = 0
            events = polling_manager.get_events()
            port_info, ancillary_port_info, ports_not_ready_yet = \
            self._process_ports_events(events,ports,ancillary_ports,ports_not_ready_yet,failed_devices,failed_ancillary_devices)
        return port_info,ancillary_port_info,consecutive_resyncs,ports_not_ready_yet
    
    def _treat_vif_port(self, vif_port, port_id, network_id, network_type, physical_network,
                        segmentation_id, admin_state_up, fixed_ips, device_owner, ovs_restarted):
        port_needs_binding = True
        if not vif_port.ofport:
            LOG.warning(_("VIF port: %s has no ofport configured, and might not be able to transmit") % vif_port.vif_id)
        if vif_port:
            if admin_state_up:
                port_needs_binding = self._port_bound(vif_port,network_id,network_type,physical_network,
                                                      segmentation_id,fixed_ips,device_owner,ovs_restarted)
            else:
                LOG.info(_("VIF port: %s admin state up disabled, putting on the dead VLAN") % vif_port.vif_id)
                self._port_dead(vif_port)
                port_needs_binding = False
        else:
            LOG.debug(_("No VIF port for port %s defined on agent.") % port_id)
        return port_needs_binding
    
    def _treat_devices_added_or_updated(self, devices, ovs_restarted):
        skipped_devices = []
        need_binding_devices = []
        devices_details_list = self._plugin_rpc.get_devices_details_list_and_failed_devices(self._context,devices,
                                                                                            self._agent_id,CONF.host)
        failed_devices = set(devices_details_list.get('failed_devices'))
        
        devices = devices_details_list.get('devices')
        vif_by_id = self._int_br.get_vifs_by_ids([vif['device'] for vif in devices])
        for details in devices:
            device = details['device']
            LOG.debug(_("Processing port: %s") % device)
            port = vif_by_id.get(device)
            if not port:
                LOG.info(_("Port %s was not found on the integration bridge and will therefore not be processed") % device)
                skipped_devices.append(device)
                continue
            
            if 'port_id' in details:
                LOG.info(_("Port %(device)s updated. Details: %(details)s") % {'device':device,'details':details})
                details['vif_port'] = port
                need_binding = self._treat_vif_port(port,details['port_id'],details['network_id'],details['network_type'],
                                                    details['physical_network'],details['segmentation_id'],details['admin_state_up'],
                                                    details['fixed_ips'],details['device_owner'],ovs_restarted)
                if need_binding:
                    need_binding_devices.append(details)
            else:
                LOG.warning(_("Device %s not defined on plugin or binding failed") % device)
                if (port and port.ofport != -1):
                    self._port_dead(port)
        return skipped_devices,need_binding_devices,failed_devices
    
    def _treat_devices_removed(self, devices):
        LOG.info(_("Ports %s removed") % devices)
        devices_down = self._plugin_rpc.update_device_list(self._context,[],devices,self._agent_id,CONF.host)
        failed_devices = set(devices_down.get('failed_devices_down'))
        LOG.debug(_("Port removal failed for %s") % failed_devices)
        for device in devices:
            self._port_unbound(device)
        return failed_devices
    
    def _add_port_tag_info(self, need_binding_ports):
        port_names = [p['vif_port'].port_name for p in need_binding_ports]
        port_info = self._int_br.get_ports_attributes("Port",columns=["name", "tag", "other_config"],ports=port_names,if_exists=True)
        info_by_port = {x['name']: [x['tag'], x['other_config']] for x in port_info}
        for port_detail in need_binding_ports:
            lvm = self._local_vlan_map.get(port_detail['network_id'])
            if lvm:
                port = port_detail['vif_port']
                cur_info = info_by_port.get(port.port_name)
                if cur_info is not None and cur_info[0] != lvm.vlan:
                    other_config = cur_info[1] or {}
                    other_config['tag'] = lvm.vlan
                    self._int_br.set_db_attribute("Port",port.port_name,"other_config",other_config)
    
    def _bind_devices(self, need_binding_ports):
        devices_up = []
        devices_down = []
        failed_devices = []
        port_names = [p['vif_port'].port_name for p in need_binding_ports]
        port_info = self._int_br.get_ports_attributes("Port",columns=["name","tag"],ports=port_names,if_exists=True)
        tags_by_name = {x['name']: x['tag'] for x in port_info}
        
        for port_detail in need_binding_ports:
            lvm = self._local_vlan_map.get(port_detail['network_id'])
            if lvm:
                port = port_detail['vif_port']
                device = port_detail['device']
                cur_tag = tags_by_name.get(port.port_name)
                if cur_tag is None:
                    LOG.debug(_("Port %s was deleted concurrently, skipping it") % port.port_name)
                else:
                    if cur_tag and cur_tag != lvm.vlan:
                        self._int_br.delete_flows(in_port=port.ofport)
                    if self._prevent_arp_spoofing:
                        self._setup_arp_spoofing_protection(self._int_br,port,port_detail)
                    if cur_tag != lvm.vlan:
                        self._int_br.set_db_attribute("Port",port.port_name,"tag",lvm.vlan)
                    
                    if port_detail.get('admin_state_up'):
                        LOG.debug(_("Setting status for %s to UP") % device)
                        devices_up.append(device)
                    else:
                        LOG.debug(_("Setting status for %s to DOWN") % device)
                        devices_down.append(device)
        
        if devices_up or devices_down:
            devices_set = self._plugin_rpc.update_device_list(self._context,devices_up,devices_down,self._agent_id,CONF.host)
            failed_devices = devices_set.get('failed_devices_up') + devices_set.get('failed_devices_down')
            if failed_devices:
                LOG.error(_("Configuration for devices %s failed!") % failed_devices)
        
        LOG.info(_("Configuration for devices up %(up)s and devices down %(down)s completed.")
                 % {'up':devices_up,'down':devices_down})
        return set(failed_devices)
    
    def _process_network_ports(self, port_info, ovs_restarted):
        failed_devices = {'added': set(), 'removed': set()}
        devices_added_updated = port_info.get('added', set()) | port_info.get('updated', set())
        need_binding_devices = []
        if devices_added_updated:
            start = time.time()
            skipped_devices,need_binding_devices,failed_devices['added'] = \
            self._treat_devices_added_or_updated(devices_added_updated,ovs_restarted)
            LOG.debug(_("process_network_ports - iteration:%(iter_num)d - treat_devices_added_or_updated completed. "
                        "Skipped %(num_skipped)d devices of %(num_current)d devices currently available. Time elapsed: %(elapsed).3f") 
                      % {'iter_num':self._iter_num,'num_skipped':len(skipped_devices),
                         'num_current':len(port_info['current']),'elapsed':(time.time() - start)})
            port_info['current'] = port_info['current'] - set(skipped_devices)
        
        self._add_port_tag_info(need_binding_devices)
        
        failed_devices['added'] |= self._bind_devices(need_binding_devices)
        
        if 'removed' in port_info and port_info['removed']:
            start = time.time()
            failed_devices['removed'] |= self._treat_devices_removed(port_info['removed'])
            LOG.debug(_("process_network_ports - iteration:%(iter_num)d - treat_devices_removed completed in %(elapsed).3f")
                      % {'iter_num':self._iter_num,'elapsed':(time.time() - start)})
        return failed_devices
    
    def _treat_ancillary_devices_added(self, devices):
        devices_details_list = self._plugin_rpc.get_devices_details_list_and_failed_devices(self._context,devices,
                                                                                            self._agent_id,CONF.host)
        failed_devices = set(devices_details_list.get('failed_devices'))
        devices_added = [d['device'] for d in devices_details_list.get('devices')]
        devices_set_up = self._plugin_rpc.update_device_list(self._context,devices_added,[],self._agent_id,CONF.host)
        failed_devices |= set(devices_set_up.get('failed_devices_up'))
        
        LOG.info(_("Ancillary Ports %(added)s added, failed devices %(failed)s") % {'added':devices,'failed':failed_devices})
        return failed_devices
    
    def _treat_ancillary_devices_removed(self, devices):
        LOG.info(_("Ancillary ports %s removed") % devices)
        devices_down = self._plugin_rpc.update_device_list(self._context,[],devices,self._agent_id,CONF.host)
        LOG.info(_("Devices down %s ") % devices_down)
        failed_devices = set(devices_down.get('failed_devices_down'))
        if failed_devices:
            LOG.debug(_("Port removal failed for %s") % failed_devices)
        for detail in devices_down.get('devices_down'):
            if detail['exists']:
                LOG.info(_("Port %s updated.") % detail['device'])
            else:
                LOG.debug(_("Device %s not defined on plugin") % detail['device'])
        return failed_devices
    
    def _process_ancillary_network_ports(self, port_info):
        failed_devices = {'added': set(), 'removed': set()}
        if 'added' in port_info and port_info['added']:
            start = time.time()
            failed_added = self._treat_ancillary_devices_added(port_info['added'])
            LOG.debug(_("process_ancillary_network_ports - iteration: %(iter_num)d - treat_ancillary_devices_added "
                        "completed in %(elapsed).3f") % {'iter_num':self._iter_num,'elapsed':(time.time() - start)})
            failed_devices['added'] = failed_added
        
        if 'removed' in port_info and port_info['removed']:
            start = time.time()
            failed_removed = self._treat_ancillary_devices_removed(port_info['removed'])
            failed_devices['removed'] = failed_removed
            LOG.debug(_("process_ancillary_network_ports - iteration: %(iter_num)d - treat_ancillary_devices_removed "
                        "completed in %(elapsed).3f") % {'iter_num':self._iter_num,'elapsed':(time.time() - start)})
        return failed_devices
    
    def _cleanup_stale_flows(self):
        bridges = [self._int_br]
        bridges.extend(self._phys_brs.values())
        for bridge in bridges:
            LOG.info(_("Cleaning stale %s flows") % bridge.br_name)
            bridge.cleanup_flows()
    
    def _get_devices_not_to_retry(self, failed_devices, failed_ancillary_devices, failed_devices_retries_map):
        new_failed_devices_retries_map = {}
        devices_not_to_retry = {}
        ancillary_devices_not_to_retry = {}
        
        def _increase_retries(devices_set):
            devices_not_to_retry = set()
            for dev in devices_set:
                retries = failed_devices_retries_map.get(dev,0)
                if retries >= constants.MAX_DEVICE_RETRIES:
                    devices_not_to_retry.add(dev)
                    LOG.warning(_("Device %(dev)s failed for %(times)s times and won't be retried anymore")
                                % {'dev':dev,'times':constants.MAX_DEVICE_RETRIES})
                else:
                    new_failed_devices_retries_map[dev] = retries + 1
            return devices_not_to_retry
        
        for event in ['added', 'removed']:
            devices_not_to_retry[event] = _increase_retries(failed_devices[event])
            ancillary_devices_not_to_retry[event] = _increase_retries(failed_ancillary_devices[event])
        
        return (new_failed_devices_retries_map,devices_not_to_retry,ancillary_devices_not_to_retry)
    
    def _remove_devices_not_to_retry(self, failed_devices, failed_ancillary_devices,
                                     devices_not_to_retry, ancillary_devices_not_to_retry):
        for event in ['added', 'removed']:
            failed_devices[event] = failed_devices[event] - devices_not_to_retry[event]
            failed_ancillary_devices[event] = failed_ancillary_devices[event] - ancillary_devices_not_to_retry[event]
    
    def _update_retries_map_and_remove_devs_not_to_retry(self, failed_devices,
                                                         failed_ancillary_devices, failed_devices_retries_map):
        (new_failed_devices_retries_map, devices_not_to_retry,
         ancillary_devices_not_to_retry) = self._get_devices_not_to_retry(failed_devices,
                                                                          failed_ancillary_devices,failed_devices_retries_map)
        self._remove_devices_not_to_retry(failed_devices,failed_ancillary_devices,
                                          devices_not_to_retry,ancillary_devices_not_to_retry)
        return new_failed_devices_retries_map
    
    def _loop_count_and_wait(self, start_time, port_stats):
        elapsed = time.time() - start_time
        LOG.debug(_("Agent rpc_loop - iteration:%(iter_num)d completed. Processed ports statistics: "
                    "%(port_stats)s. Elapsed:%(elapsed).3f")
                  % {'iter_num':self._iter_num,'port_stats':port_stats,'elapsed':elapsed})
        if elapsed < self._polling_interval:
            time.sleep(self._polling_interval - elapsed)
        else:
            LOG.debug(_("Loop iteration exceeded interval (%(polling_interval)s vs. %(elapsed)s)!")
                      % {'polling_interval':self._polling_interval,'elapsed':elapsed})
        self._iter_num = self._iter_num + 1
    
    def _rpc_loop(self, polling_manager):
        sync = True
        ports = set()
        ancillary_ports = set()
        ovs_restarted = False
        consecutive_resyncs = 0
        need_clean_stale_flow = True
        ports_not_ready_yet = set()
        failed_devices = {'added': set(), 'removed': set()}
        failed_ancillary_devices = {'added': set(), 'removed': set()}
        failed_devices_retries_map = {}
        while True:
            port_info = {}
            ancillary_port_info = {}
            start = time.time()
            LOG.debug(_("Agent rpc_loop - iteration:%d started") % self._iter_num)
            ovs_status = self._check_ovs_status()
            if ovs_status == constants.OVS_DEAD:
                port_stats = self._get_port_stats({},{})
                self._loop_count_and_wait(start, port_stats)
            else:
                if ovs_status == constants.OVS_RESTARTED:
                    self._setup_integration_br()
                    self._setup_physical_bridges()
                    if isinstance(polling_manager,polling.InterfacePollingMinimizer):
                        polling_manager.stop()
                        polling_manager.start()
                
                ovs_restarted |= (ovs_status == constants.OVS_RESTARTED)
                devices_need_retry = any(failed_devices.values()) or any(failed_ancillary_devices.values()) or ports_not_ready_yet
                if polling_manager.is_polling_required or sync or devices_need_retry:
                    try:
                        LOG.debug(_("Agent rpc_loop - iteration:%(iter_num)d - starting polling. Elapsed:%(elapsed).3f")
                                  % {'iter_num':self._iter_num,'elapsed':(time.time() - start)})
                        port_info,ancillary_port_info,consecutive_resyncs,ports_not_ready_yet = \
                        self._process_port_info(start,polling_manager,sync,ovs_restarted,ports,ancillary_ports,
                                                consecutive_resyncs,ports_not_ready_yet,failed_devices,failed_ancillary_devices)
                        sync = False
                        if 'removed' in port_info:
                            for port_id in port_info['removed']:
                                self._port_unbound(port_id)
                        ofport_changed_ports = self._update_stale_ofport_rules()
                        if ofport_changed_ports:
                            port_info.setdefault('updated', set()).update(ofport_changed_ports)
                        LOG.debug(_("Agent rpc_loop - iteration:%(iter_num)d - port information retrieved. Elapsed:%(elapsed).3f")
                                  % {'iter_num':self._iter_num,'elapsed':(time.time() - start)})
                        
                        if (port_info.get('added') or port_info.get('removed') or port_info.get('updated') or ovs_restarted):
                            LOG.debug(_("Starting to process devices in:%s") % port_info)
                            failed_devices = self._process_network_ports(port_info,ovs_restarted)
                            if need_clean_stale_flow:
                                self._cleanup_stale_flows()
                                need_clean_stale_flow = False
                            LOG.debug(_("Agent rpc_loop - iteration:%(iter_num)d - ports processed. Elapsed:%(elapsed).3f")
                                      % {'iter_num':self._iter_num,'elapsed':(time.time() - start)})
                        
                        ports = port_info['current']
                        
                        if self._ancillary_brs:
                            failed_ancillary_devices = self._process_ancillary_network_ports(ancillary_port_info)
                            LOG.debug(_("Agent rpc_loop - iteration: %(iter_num)d - ancillary ports processed. Elapsed:%(elapsed).3f")
                                      % {'iter_num':self._iter_num,'elapsed':(time.time() - start)})
                            ancillary_ports = ancillary_port_info['current']
                        
                        polling_manager.polling_completed()
                        failed_devices_retries_map = self._update_retries_map_and_remove_devs_not_to_retry(failed_devices,
                                                                                                           failed_ancillary_devices,
                                                                                                           failed_devices_retries_map)
                        ovs_restarted = False
                        self._dispose_local_vlan_hints()
                    except Exception as exc:
                        LOG.exception(_("Error while processing VIF ports. exc:%s") % exc)
                        sync = True
                port_stats = self._get_port_stats(port_info,ancillary_port_info)
                self._loop_count_and_wait(start,port_stats)
    
    def daemon_loop(self):
        with polling.get_polling_manager(self._minimize_polling,self._ovsdb_monitor_respawn_interval) as pm:
            self._rpc_loop(polling_manager=pm)
