from ceilometer import neutron_client

from ceilometer.compute.virt import inspector as virt_inspector
from ceilometer.compute.virt.cas.inspectors.base import standard
from ceilometer.compute.virt.cas.inspectors.base import cache

class CasCtcloudInspector(object):
    can_patch = True
    
    def __init__(self, session, conf):
        self.neutron_cli = neutron_client.Client(conf)
        self._inspector = standard.CasStandardInspector(session)
    
    def patch_inspector(self, session):
        self._inspector = cache.CasCacheInspector(session)
    
    def _replace_interface(self, interface):
        ports = self.neutron_cli.client.list_ports(mac_address=interface.mac)
        port_id = ports['ports'][0]['id']
        new_interface = virt_inspector.InterfaceStats(name=port_id,
                                                      mac=interface.mac,
                                                      fref=None,
                                                      parameters={},
                                                      rx_bytes=interface.rx_bytes,
                                                      rx_packets=interface.rx_packets,
                                                      rx_errors=interface.rx_errors,
                                                      rx_drop=interface.rx_drop,
                                                      tx_bytes=interface.tx_bytes,
                                                      tx_packets=interface.tx_packets,
                                                      tx_errors=interface.tx_errors,
                                                      tx_drop=interface.tx_drop)
        return new_interface
    
    def inspect_vnics(self, instance, duration=None):
        data = self._inspector.inspect_vnics(instance)
        for interface in data:
            new_interface = self._replace_interface(interface)
            yield new_interface
    
    def inspect_vnic_rates(self, instance, duration=None):
        data = self._inspector.inspect_vnic_rates(instance,duration)
        for interface in data:
            new_interface = self._replace_interface(interface)
            yield new_interface
    
    def __getattr__(self, attr):
        return getattr(self._inspector, attr)