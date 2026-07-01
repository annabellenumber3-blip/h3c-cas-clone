from ceilometer import neutron_client

from ceilometer.compute.virt import inspector as virt_inspector
from ceilometer.compute.virt.cas.inspectors.base import standard
from ceilometer.compute.virt.cas.inspectors.base import cache

class CasCtcloudInspector(object):
    can_patch = True
    
    def __init__(self, session):
        self.neutron_cli = neutron_client.Client()
        self._inspector = standard.CasStandardInspector(session)
    
    def patch_inspector(self, session):
        self._inspector = cache.CasCacheInspector(session)
    
    def _replace_interface(self, interface):
        ports = self.neutron_cli.client.list_ports(mac_address=interface.mac)
        port_id = ports['ports'][0]['id']
        new_interface = virt_inspector.Interface(name=port_id, mac=interface.mac,
                                                 fref=interface.fref, parameters=interface.parameters)
        return new_interface
    
    def inspect_vnics(self, instance):
        data = self._inspector.inspect_vnics(instance)
        for interface, stats in data:
            interface = self._replace_interface(interface)
            
            yield (interface, stats)
    
    def inspect_vnic_rates(self, instance, duration=None):
        data = self._inspector.inspect_vnic_rates(instance,duration)
        for interface, stats in data:
            interface = self._replace_interface(interface)
            
            yield (interface, stats)
    
    def __getattr__(self, attr):
        return getattr(self._inspector, attr)