import math
from oslo_log import log as logging
from oslo_utils import units

from ceilometer.i18n import _
from ceilometer.compute.pollsters import util
from ceilometer.compute.virt import inspector as virt_inspector
from ceilometer.compute.virt.cas import xml as casxml
from ceilometer.compute.virt.cas import error as cas_error

LOG = logging.getLogger(__name__)

CAS_POWER_STATES = {
    '1':'pending',
    '2':'running',
    '3':'shutdown',
    '4':'paused'
}

class CasBaseInspector(virt_inspector.Inspector):
    def __init__(self, session):
        self._session = session
        self._xml = casxml.InspectorXml()
    
    def _query_instance_id(self, instance):
        uri = self._session.make_cmd_uri('/nova/searchVm',uuid=instance.id)
        resp, body = self._session.call_method("GET",uri)
        if resp.status_code == 200:
            vmId = self._xml.decode_xml("instance_id", body)
            LOG.info(_("success to get instance[%s] id from CVM, id=%s") % (instance.id,vmId))
            return vmId
        elif resp.status_code == 409:
            instance_name = util.instance_name(instance)
            msg = _("instance[uuid:%s,name:%s] doesn't exist on the CAS!") % (instance.id,instance_name)
            raise virt_inspector.InstanceNotFoundException(msg)
        else:
            LOG.error(_("fail to get instance[%s] id! uri:%s") % (instance.id,uri))
            LOG.error(_("fail to get instance[%s] id! resp.status_code:%d,%s")
                     % (instance.id,resp.status_code,cas_error.get_http_respond_error(resp)))
            raise cas_error.CasVmException()
    
    def _get_diagnostics(self, instance, type, duration=None):
        query_args = {'uuid':instance.id}
        if type != 'all':
            query_args['type'] = type
        if duration:
            query_args['duration'] = str(int(math.ceil(duration)))
        
        uri = self._session.make_cmd_uri('/nova/vmDiagnosticInfo',**query_args)
        resp,body = self._session.call_method("GET",uri)
        if resp.status_code == 200:
            diagnosticInfo = self._xml.decode_xml("instance_diagnostic_%s" % type,body)
            return diagnosticInfo
        else:
            instance_name = util.instance_name(instance)
            LOG.error(_("fail to get diagnostics info of instance[uuid:%s,name:%s] uri:%s") 
                     % (instance.id,instance_name,uri))
            LOG.error(_("fail to get diagnostics info of instance[uuid:%s,name:%s],resp.status_code:%d,%s")
                     % (instance.id,instance_name,resp.status_code,cas_error.get_http_respond_error(resp)))
            raise cas_error.CasVmException()
    
    def _check_domain_not_shut_off(self, instance, instanceId):
        uri = self._session.make_cmd_uri('/nova/vmInfo',instanceId)
        resp, body = self._session.call_method("GET",uri)
        if resp.status_code == 200:
            state = self._xml.decode_xml("instance_state",body)
            vmState=CAS_POWER_STATES[state]
            if vmState == 'shutdown':
                instance_name = util.instance_name(instance)
                msg = _('the state of instance[uuid:%s,name:%s] is shutdown.') % (instance.id,instance_name)
                raise virt_inspector.InstanceShutOffException(msg)
        else:
            LOG.error(_("fail to get instance[uuid:%s] state! uri:%s")
                     % (instance.id,uri))
            LOG.error(_("fail to get instance[uuid:%s] state! resp.status_code:%d,%s")
                     % (instance.id,resp.status_code,cas_error.get_http_respond_error(resp)))
            raise cas_error.CasVmException()
    
    def _inspect_cpus(self, data):
        return virt_inspector.CPUStats(number=data['cpus'], time=data['cpuTime'])
    
    def _inspect_cpu_util(self, data):
        return virt_inspector.CPUUtilStats(util=data['cpuUsage'])
    
    def _inspect_vnics(self, data):
        for iface in data:
            interface = virt_inspector.Interface(name=iface['name'], mac=iface['mac'],
                                                 fref=None, parameters={})
            stats = virt_inspector.InterfaceStats(rx_bytes=iface['rx_bytes'],
                                                  rx_packets=iface['rx_packets'],
                                                  tx_bytes=iface['tx_bytes'],
                                                  tx_packets=iface['tx_packets'])
            yield (interface, stats)
    
    def _inspect_disks(self, data):
        for block in data:
            disk = virt_inspector.Disk(device=block['name'])
            stats = virt_inspector.DiskStats(read_requests=block['rd_req'],
                                             read_bytes=block['rd_bytes'],
                                             write_requests=block['wr_req'],
                                             write_bytes=block['wr_bytes'],
                                             errors=block['errs'])
            yield (disk, stats)
    
    def _inspect_memory_usage(self, data):
        return virt_inspector.MemoryUsageStats(usage=data['memUsed'])
    
    def _inspect_disk_info(self, data):
        for block in data:
            disk = virt_inspector.Disk(device=block['name'])
            info = virt_inspector.DiskInfo(capacity=block['capacity'],
                                           allocation=block['allocation'],
                                           physical=block['physical'])
            yield (disk, info)
    
    def _inspect_memory_resident(self, data):
        for memory in data:
            if memory['tag'] == 'rss':
                val = memory['val'] / units.Ki
                return virt_inspector.MemoryResidentStats(resident=val)
    
    def _inspect_disk_rates(self, data):
        for block in data:
            disk = virt_inspector.Disk(device=block['name'])
            stats = virt_inspector.DiskRateStats(read_bytes_rate=block['rd_bytes_rate'],
                                                 read_requests_rate=block['rd_req_rate'],
                                                 write_bytes_rate=block['wr_bytes_rate'],
                                                 write_requests_rate=block['wr_req_rate'])
            yield (disk, stats)
    
    def _inspect_vnic_rates(self, data):
        for iface in data:
            interface = virt_inspector.Interface(name=iface['name'], mac=iface['mac'],
                                                 fref=None, parameters={})
            stats = virt_inspector.InterfaceRateStats(rx_bytes_rate=iface['rx_bytes_rate'],
                                                      tx_bytes_rate=iface['tx_bytes_rate'])
            
            yield (interface, stats)
