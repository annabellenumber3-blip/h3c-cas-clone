from ceilometer.compute.virt.cas.inspectors import base

class CasStandardInspector(base.CasBaseInspector):
    can_patch = False
    
    def inspect_cpus(self, instance):
        basicInfo = self._get_diagnostics(instance,'basic')
        
        return self._inspect_cpus(basicInfo)
    
    def inspect_vnics(self, instance):
        domIfStat = self._get_diagnostics(instance,'interface')
        
        return self._inspect_vnics(domIfStat)
    
    def inspect_disks(self, instance):
        domBlkStat = self._get_diagnostics(instance,'disk')
        
        return self._inspect_disks(domBlkStat)
    
    def inspect_disk_info(self, instance):
        domBlkStat = self._get_diagnostics(instance,'disk')
        
        return self._inspect_disk_info(domBlkStat)
    
    def inspect_memory_resident(self, instance, duration=None):
        domMemStat = self._get_diagnostics(instance,'mem')
        
        return self._inspect_memory_resident(domMemStat)
    
    def inspect_cpu_util(self, instance, duration=None):
        domUsage = self._get_diagnostics(instance,'usage',duration)
        
        return self._inspect_cpu_util(domUsage)
    
    def inspect_memory_usage(self, instance, duration=None):
        domUsage = self._get_diagnostics(instance,'usage',duration)
        
        return self._inspect_memory_usage(domUsage)
    
    def inspect_disk_rates(self, instance, duration=None):
        domBlkRate = self._get_diagnostics(instance,'disk_rate',duration)
        
        return self._inspect_disk_rates(domBlkRate)
    
    def inspect_vnic_rates(self, instance, duration=None):
        domIfRate = self._get_diagnostics(instance,'interface_rate',duration)
        
        return self._inspect_vnic_rates(domIfRate)
