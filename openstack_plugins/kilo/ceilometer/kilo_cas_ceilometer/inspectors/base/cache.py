from ceilometer.compute.virt.cas.inspectors import base

class CasCacheInspector(base.CasBaseInspector):
    can_patch = True
    
    def inspect_cpus(self, instance):
        return self._inspect_cpus(self._cache['basicInfo'])
    
    def inspect_vnics(self, instance):
        return self._inspect_vnics(self._cache['domIfStat'])
    
    def inspect_disks(self, instance):
        return self._inspect_disks(self._cache['domBlkStat'])
    
    def inspect_disk_info(self, instance):
        return self._inspect_disk_info(self._cache['domBlkStat'])
    
    def inspect_memory_resident(self, instance, duration=None):
        return self._inspect_memory_resident(self._cache['domMemStat'])
    
    def inspect_cpu_util(self, instance, duration=None):
        return self._inspect_cpu_util(self._cache['domUsage'])
    
    def inspect_memory_usage(self, instance, duration=None):
        return self._inspect_memory_usage(self._cache['domUsage'])
    
    def inspect_disk_rates(self, instance, duration=None):
        return self._inspect_disk_rates(self._cache['domBlkRate'])
    
    def inspect_vnic_rates(self, instance, duration=None):
        return self._inspect_vnic_rates(self._cache['domIfRate'])
    
    def inspect_custom(self, instance, duration=None):
        self._cache = self._get_diagnostics(instance,'all',duration)
