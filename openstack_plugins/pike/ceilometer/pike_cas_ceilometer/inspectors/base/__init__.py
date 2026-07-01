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
    
    def _inspect_vnics(self, data):
        for iface in data:
            yield virt_inspector.InterfaceStats(name=iface['name'],
                                                mac=iface['mac'],
                                                fref=None,
                                                parameters={},
                                                rx_bytes=iface['rx_bytes'],
                                                rx_packets=iface['rx_packets'],
                                                rx_errors=iface['rx_errs'],
                                                rx_drop=iface['rx_drop'],
                                                tx_bytes=iface['tx_bytes'],
                                                tx_packets=iface['tx_packets'],
                                                tx_errors=iface['tx_errs'],
                                                tx_drop=iface['tx_drop'])
    
    def _inspect_disks(self, data):
        for block in data:
            yield virt_inspector.DiskStats(device=block['name'],
                                           read_requests=block['rd_req'],
                                           read_bytes=block['rd_bytes'],
                                           write_requests=block['wr_req'],
                                           write_bytes=block['wr_bytes'],
                                           errors=block['errs'])
    
    def _inspect_disk_info(self, data):
        for block in data:
            yield virt_inspector.DiskInfo(device=block['name'],
                                          capacity=block['capacity'],
                                          allocation=block['allocation'],
                                          physical=block['physical'])
    
    def _inspect_disk_rates(self, data):
        for block in data:
            yield virt_inspector.DiskRateStats(device=block['name'],
                                               read_bytes_rate=block['rd_bytes_rate'],
                                               read_requests_rate=block['rd_req_rate'],
                                               write_bytes_rate=block['wr_bytes_rate'],
                                               write_requests_rate=block['wr_req_rate'])
    
    def _inspect_vnic_rates(self, data):
        for iface in data:
            yield virt_inspector.InterfaceRateStats(name=iface['name'],
                                                    mac=iface['mac'],
                                                    fref=None,
                                                    parameters={},
                                                    rx_bytes_rate=iface['rx_bytes_rate'],
                                                    tx_bytes_rate=iface['tx_bytes_rate'])
    
    
    def _inspect_instance(self, data):
        memrss = None
        for memory in data['domMemStat']:
            if memory['tag'] == 'rss':
                val = memory['val'] / units.Ki
                memrss = val
                break
        
        return virt_inspector.InstanceStats(cpu_number=data['basicInfo']['cpus'],
                                            cpu_time=data['basicInfo']['cpuTime'],
                                            cpu_util=data['domUsage']['cpuUsage'],
                                            memory_usage=data['domUsage']['memUsed'],
                                            memory_resident=memrss)
    
    def _inspect_connections(self, data):
        return virt_inspector.ConnectionStats(tcp_connections=data)

    def _inspect_gpu_rates(self, data):
        """" gpu/vgpu """
        for gpuInfo in data:
            yield virt_inspector.GpuStats(symbol=gpuInfo['symbol'],
                                            type=gpuInfo['type'],
                                            time=None,
                                            utilization=gpuInfo['utilization'],
                                            graphicMemoryUse=gpuInfo['graphicMemoryUse'],
                                            encodeRate=gpuInfo['encodeRate'],
                                            decodeRate=gpuInfo['decodeRate'])
