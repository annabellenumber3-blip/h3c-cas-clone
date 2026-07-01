#add by zhangmingze, 2015-12-4
import time
import threading
import Queue

from oslo_log import log as logging
from eventlet import greenthread

from neutron.i18n import _
from neutron import context as neutroncontext
from neutron.plugins.ml2 import db as ml2_db
from neutron.agent.casagent import xml as casxml
from neutron.agent.casagent import error as cas_error

LOG = logging.getLogger(__name__)

CAS_BASE_EVENT = {
    '30':"ACTIVE",
    '31':"DOWN",
    '32':"DOWN",
    '34':"DOWN",
    '35':"ACTIVE",
    '36':"DOWN"
}

MAX_CHUNK_SIZE = 4096

class CasEvent(object):
    def __init__(self, session, hostname, plugin):
        self._session = session
        self._hostname = hostname
        self._plugin = plugin
        self._xml = casxml.EventXml()
        greenthread.spawn(self._instance_event)
        self._event_queue=Queue.Queue(256)
        self._event = threading.Event()
        self._worker_num = 10
    
    def _get_valid_ports(self, instance_uuid):
        valid_ports = []
        
        adminContext = neutroncontext.get_admin_context()
        filters = {'device_id':[instance_uuid]}
        ports = self._plugin.get_ports(adminContext,filters)
        for port in ports:
            binding_host = ml2_db.get_port_binding_host(adminContext.session, port['id'])
            if binding_host == self._hostname:
                valid_ports.append(port['id'])
        
        return valid_ports
        
    def _emit_event(self, evtype, evt_para):
        """Dispatches an event to the compute manager.

        Invokes the event callback registered by the
        compute manager to dispatch the event. This
        must only be invoked from a green thread.
        """  
        if evtype is not None:
            vm_status = CAS_BASE_EVENT.get(evtype,None)
            if vm_status is not None:
                vmid = evt_para[0]
                vm_uuid = self._get_instance_uuid_by_vmid(vmid)
                if vm_uuid:
                    ports = self._get_valid_ports(vm_uuid)
                    if ports:
                        LOG.info(_("receive event %s, update status of ports. ports:%s") % (vm_status,ports))
                        self._plugin.update_ports_status(vm_uuid,vmid,ports,vm_status)

    def _get_instance_uuid_by_vmid(self, vmId):
        uri = self._session.make_cmd_uri('/nova/vmInfo',vmId)
        resp, body = self._session.call_method("GET",uri)
        if resp.status_code == 200:
            uuid = self._xml.decode_xml("instance_uuid_by_vmid",body)
            return uuid
        else:
            LOG.error(_("fail to get instance uuid by vmid:%s, uri:%s") 
                     % (vmId,uri))
            LOG.error(_("fail to get instance uuid by vmid:%s, resp.status_code:%d,%s")
                     % (vmId,resp.status_code,cas_error.get_http_respond_error(resp)))
            return None
            
    def _register_instance_event(self):
        delay = 1
        uri = self._session.make_cmd_uri('/events',type='1',progress='false')
        while True:
            try:
                resp, body = self._session.call_method("GET",uri,stream=True)
                if resp.status_code != 202:
                    raise cas_error.CasVmException()
            except Exception:
                LOG.error(_("fail to establish a connection with CVM event, sleeping for %d seconds") % delay)
                time.sleep(delay)
                delay = min(2 * delay, 60)
            else:
                return resp
    
    def _unregister_instance_event(self, resp):
        resp.close()
    
    def _put_event_into_queue(self, evt_item):
        while True:
            try:
                if self._event_queue.full():
                    LOG.warning(_("evt queue is full,wait,qsize:%s,evt_item:%s")%(self._event_queue.qsize(),evt_item))
                    time.sleep(1)
                else:
                    self._event_queue.put(evt_item,block=False,timeout=2)
                    break
            except Queue.Full as exc:
                LOG.warning(_("Queue.Full,size:%s,wait:%s")%(self._event_queue.qsize(),exc))
                time.sleep(1)
            except Exception as exc:
                LOG.error(_("Unknown error happen when put event into queue:%s") % exc)
                break
        
    def _worker_proc(self):
        while True:
            try:
                evt_item = self._event_queue.get(timeout=1)
                if evt_item is not None:
                    evtype = evt_item[0]
                    evt_para = evt_item[1]
                    try:
                        self._emit_event(evtype,evt_para)
                    except Exception as exc:
                         LOG.error(_("fail to _emit_event. exc:%s") % exc)
                         LOG.error(_("fail to _emit_event. evtype,evt_para:%s,%s") % (evtype,evt_para))
                time.sleep(0.000001)
            except Queue.Empty:
                if self._event.isSet():
                    LOG.warning(_("event worker exit now"))
                    return
                time.sleep(1)
    
    def _deal_chunkd_text(self,chunkd_text):
        try:
            chunkd_text = chunkd_text.decode('utf-8')
            LOG.debug(_("time: %s,chunkd: %s") % (self._report_time,chunkd_text))
            
            if chunkd_text and not chunkd_text.startswith("#HEART_BEAT"):
                evtype,vmid = self._xml.decode_xml("instance_event_type_and_vmid",chunkd_text)
                if evtype is None:
                    return
                
                LOG.info(_("[cas::]evtype:%s,time:%s,vmid:%s,chunkd:%s") % (evtype,self._report_time,vmid,chunkd_text))
                try:
                    if CAS_BASE_EVENT.get(evtype) is not None:
                        keywords = (evtype,(vmid,))
                        self._put_event_into_queue(keywords)
                
                except Exception as exc:
                    LOG.error(_("fail to put event into queue. exc:%s") % exc)
        except Exception as exc:
            LOG.error(_("fail to deal whith chunkd text. exc:%s") % exc)
    
    def _io_proc(self,resp):
        try:
            for chunkd_text in resp.iter_content(chunk_size=MAX_CHUNK_SIZE):
                self._report_time = time.time()
                self._deal_chunkd_text(chunkd_text)
                time.sleep(0.000001)
        except Exception as exc:
            if not self._event.isSet():
                self._event.set()
            LOG.warning(_("deal instance event i/o thread exit. exception:%s") % exc)
            LOG.warning(_("deal instance event i/o thread exit now"))
            return
    
    def _monitor_proc(self, thread_obj):
        last_time = self._report_time
        while True:
            if self._event.isSet():
                LOG.error(_("event is set, so monitor exit now!"))
                return
            else:
                time.sleep(2*60)
            
            if  thread_obj not in threading.enumerate():
                LOG.error(_("event io thread not exists, so monitor exit now!"))
                if not self._event.isSet():
                    self._event.set()
                return
             
            if self._report_time == last_time:
                LOG.error(_("Timeout to receive heart beat from CVM. Reconnect,so monitor exit now!"))
                if not self._event.isSet():
                    self._event.set()
                return
            else:
                last_time = self._report_time
    
    def _instance_event(self):
        while True:
            self._report_time = time.time()
            num = self._worker_num
            worker_list = []
            while num > 0:
                worker = threading.Thread(target=self._worker_proc,name="neutron-agent-evtworker")
                worker.setDaemon(True)
                worker.start()
                worker_list.append(worker)
                num = num - 1

            resp = self._register_instance_event()
            evt_io = threading.Thread(target=self._io_proc,args=(resp,),name="neutron-agent-evtio")
            evt_io.setDaemon(True)
            evt_io.start()

            monitor = threading.Thread(target=self._monitor_proc,args=(evt_io,),name="neutron-agent-monitor")
            monitor.setDaemon(True)
            monitor.start()
            io_closed = False
            try:
                while True:
                    time.sleep(2)
                    if self._event.isSet():
                        try:
                            if not io_closed:
                                self._unregister_instance_event(resp)
                                io_closed = True
                            
                            evt_io.join(10)
                            num = len(worker_list)
                            while num > 0:
                                num = num - 1
                                worker_list[num].join()
                            
                            monitor.join()
                        except BaseException as exc:
                             LOG.error(_("cancel deal thread,exc:%s") % exc)
                        
                    # if evt_io in threading.enumerate():
                    #     continue
                    #
                    # LOG.warning(_("io thread exit"))
                    if monitor in threading.enumerate():
                        continue
                    
                    LOG.warning(_("monitor thread exit"))
                    num = len(worker_list)
                    all_workers_exit = True
                    while num > 0:
                        num = num - 1
                        if worker_list[num] in threading.enumerate():
                            all_workers_exit = False
                            break
                    
                    if all_workers_exit:
                        LOG.warning(_("workers exit all"))
                        break
            except BaseException as exc:
                LOG.error(_("Unknown error happen when deal instance event. exc:%s") % exc)
            finally:
                if not io_closed:
                    self._unregister_instance_event(resp)
                self._event.clear()
                LOG.warning(_("event::_instance_event:finally,recreate workers io monitor thread"))
