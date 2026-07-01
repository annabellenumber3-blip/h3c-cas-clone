import math
from oslo_config import cfg
from oslo_log import log as logging
from oslo_utils import units

from ceilometer.i18n import _
from ceilometer.compute.pollsters import util
from ceilometer.compute.virt import inspector as virt_inspector
from ceilometer.compute.virt.cas.inspectors import base
from ceilometer.compute.virt.cas import error as cas_error

CONF = cfg.CONF

LOG = logging.getLogger(__name__)

class CasTecsInspector(base.CasBaseInspector):
    can_patch = False
    
    def _get_tools_info(self, instance):
        uri = self._session.make_cmd_uri('/nova/castoolsInfo',uuid=instance.id)
        resp,body = self._session.call_method("GET",uri)
        if resp.status_code == 200:
            toolsInfo = self._xml.decode_xml("instance_tools_info",body)
            return toolsInfo
        else:
            instance_name = util.instance_name(instance)
            LOG.error(_("fail to get tools info of instance[uuid:%s,name:%s] uri:%s") 
                     % (instance.id,instance_name,uri))
            LOG.error(_("fail to get tools info of instance[uuid:%s,name:%s],resp.status_code:%d,%s")
                     % (instance.id,instance_name,resp.status_code,cas_error.get_http_respond_error(resp)))
            raise cas_error.CasVmException()
    
    def _inspect_memory(self, data):
        memTotal = data['memory'] / units.Ki
        return virt_inspector.MemoryStats(mem=memTotal)
    
    def _inspect_vnic_packets_rates(self, data):
        for iface in data:
            interface = virt_inspector.Interface(name=iface['name'], mac=iface['mac'],
                                                 fref=None, parameters={})
            stats = virt_inspector.InterfacePacketsRateStats(rx_packets_rate=iface['rx_packets_rate'],
                                                             tx_packets_rate=iface['tx_packets_rate'])
            
            yield (interface, stats)

    def inspect_instance_whole(self, instance, duration=None):
        vm_Id = self._query_instance_id(instance)
        try:
            self._check_domain_not_shut_off(instance,vm_Id)
        except virt_inspector.InstanceShutOffException:
            return {'poweron':0}
        
        instanceInfo = self._get_diagnostics(instance,'all',duration)
        toolsInfo = self._get_tools_info(instance)
        
        return {'cpus':self._inspect_cpus(instanceInfo['basicInfo']),
                'memory':self._inspect_memory(instanceInfo['basicInfo']),
                'cpu_util':self._inspect_cpu_util(instanceInfo['domUsage']),
                'memory_usage':self._inspect_memory_usage(instanceInfo['domUsage']),
                'disk_info':self._inspect_disk_info(instanceInfo['domBlkStat']),
                'disks':self._inspect_disks(instanceInfo['domBlkStat']),
                'vnics':self._inspect_vnics(instanceInfo['domIfStat']),
                'vmtools_run':toolsInfo['status'],
                'uptime':toolsInfo.get('uptime'),
                'poweron':1}
    
    def inspect_host(self, host, duration=None):
        suffix = "(CVM%s)" % CONF.cas.host_ip
        if not host.endswith(suffix):
            LOG.error(_("CVM:%s doesn't include host:%s.") % (CONF.cas.host_ip,host))
            raise cas_error.CasHostException()
        
        query_args = {'hostName':host[0:-len(suffix)]}
        if duration:
            query_args['duration'] = str(int(math.ceil(duration)))
        
        uri = self._session.make_cmd_uri('/nova/hostDiagnosticInfo',**query_args)
        resp,body = self._session.call_method("GET",uri)
        if resp.status_code == 200:
            hostInfo = self._xml.decode_xml("host_diagnostic",body)
            
            return {'cpu_util':self._inspect_cpu_util(hostInfo['basicInfo']),
                    'memory':self._inspect_memory(hostInfo['basicInfo']),
                    'memory_usage':self._inspect_memory_usage(hostInfo['basicInfo']),
                    'disk_info':self._inspect_disk_info(hostInfo['hostBlkStat']),
                    'disk_rates':self._inspect_disk_rates(hostInfo['hostBlkStat']),
                    'vnic_rates':self._inspect_vnic_rates(hostInfo['hostIfStat']),
                    'vnic_packets_rates':self._inspect_vnic_packets_rates(hostInfo['hostIfStat']),
                    'cpu_freq_total':hostInfo['basicInfo']['cpuFreq'],
                    'uptime':hostInfo['basicInfo']['uptime']}
        else:
            LOG.error(_("fail to get diagnostic info of host:%s uri:%s") % (host,uri))
            LOG.error(_("fail to get diagnostic info of host:%s,resp.status_code:%d,%s")
                     % (host,resp.status_code,cas_error.get_http_respond_error(resp)))
            raise cas_error.CasHostException()
