from ceilometer.compute.virt.cas.inspectors import base

class CasStandardInspector(base.CasBaseInspector):
    can_patch = False
    
    def inspect_vnics(self, instance, duration=None):
        domIfStat = self._get_diagnostics(instance,'interface')
        
        return self._inspect_vnics(domIfStat)
    
    def inspect_disks(self, instance, duration=None):
        domBlkStat = self._get_diagnostics(instance,'disk')
        
        return self._inspect_disks(domBlkStat)
    
    def inspect_disk_info(self, instance, duration=None):
        domBlkStat = self._get_diagnostics(instance,'disk')
        
        return self._inspect_disk_info(domBlkStat)
    
    def inspect_disk_rates(self, instance, duration=None):
        domBlkRate = self._get_diagnostics(instance,'disk_rate',duration)
        
        return self._inspect_disk_rates(domBlkRate)
    
    def inspect_vnic_rates(self, instance, duration=None):
        domIfRate = self._get_diagnostics(instance,'interface_rate',duration)
        
        return self._inspect_vnic_rates(domIfRate)
    
    def inspect_instance(self, instance, duration=None):
        basicInfo = self._get_diagnostics(instance,'basic')
        domMemStat = self._get_diagnostics(instance,'mem')
        domUsage = self._get_diagnostics(instance,'usage',duration)
        
        return self._inspect_instance({'basicInfo':basicInfo,'domMemStat':domMemStat,'domUsage':domUsage})
    
    def inspect_connections(self, instance, duration=None):
        connections = self._get_diagnostics(instance,'connections')
        return self._inspect_connections(connections)

    def inspect_gpu_rates(self, instance, duration=None):
        gpusInfo = self._get_diagnostics(instance, 'gpu', duration)

        return self._inspect_gpu_rates(gpusInfo)