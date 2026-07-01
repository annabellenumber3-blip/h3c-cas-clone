from ceilometer.compute.virt.cas.inspectors import base

class CasCacheInspector(base.CasBaseInspector):
    can_patch = True
    
    def inspect_vnics(self, instance, duration=None):
        return self._inspect_vnics(self._cache['domIfStat'])
    
    def inspect_disks(self, instance, duration=None):
        return self._inspect_disks(self._cache['domBlkStat'])
    
    def inspect_disk_info(self, instance, duration=None):
        return self._inspect_disk_info(self._cache['domBlkStat'])
    
    def inspect_disk_rates(self, instance, duration=None):
        return self._inspect_disk_rates(self._cache['domBlkRate'])
    
    def inspect_vnic_rates(self, instance, duration=None):
        return self._inspect_vnic_rates(self._cache['domIfRate'])
    
    def inspect_instance(self, instance, duration=None):
        return self._inspect_instance(self._cache)
    
    def inspect_connections(self, instance, duration=None):
        return self._inspect_connections(self._cache['connections'])
    
    def inspect_custom(self, instance, duration=None):
        self._cache = self._get_diagnostics(instance,'all',duration)

    def inspect_gpu_rates(self, instance, duration=None):
        return self._inspect_gpu_rates(self._cache['gpusInfo'])