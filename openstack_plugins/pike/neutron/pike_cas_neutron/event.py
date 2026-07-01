#add by zhangmingze, 2015-12-4
import time
import threading
import Queue
import pika
from oslo_config import cfg
import requests
import base64
import ssl

from oslo_log import log as logging
from oslo_serialization import jsonutils
from oslo_utils import units
from eventlet import greenthread

from neutron._i18n import _
from neutron_lib import context as neutroncontext
from neutron.plugins.ml2 import db as ml2_db
from neutron.agent.casagent import xml as casxml
from neutron.agent.casagent import error as cas_error
from pika import credentials as pika_credentials
from Crypto.Cipher import DES

CONF = cfg.CONF
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

class CasEventBase(object):
    def __init__(self, session, hostname, plugin):
        self._session = session
        self._hostname = hostname
        self._plugin = plugin
        self._xml = casxml.EventXml()
        self._event_queue=Queue.Queue(256)
        self._event = threading.Event()
        self._worker_num = 10
        greenthread.spawn(self._instance_event)
    
    def _get_valid_ports(self, instance_uuid):
        valid_ports = []
        
        adminContext = neutroncontext.get_admin_context()
        filters = {'device_id':[instance_uuid]}
        ports = self._plugin.get_ports(adminContext,filters)
        for port in ports:
            binding_host = ml2_db.get_port_binding_host(adminContext, port['id'])
            if binding_host == self._hostname:
                valid_ports.append(port['id'])
        
        return valid_ports
    
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

class CasEventHttp(CasEventBase):
    def __init__(self,session,hostname, plugin):
        super(CasEventHttp,self).__init__(session,hostname,plugin)
    
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
    
    def _register_instance_event(self):
        delay = 1
        uri = self._session.make_cmd_uri('/events',type='1',progress='false')
        while True:
            try:
                resp,body = self._session.call_method("GET",uri,stream=True)
                if resp.status_code != 202:
                    raise cas_error.CasVmException()
            except Exception:
                LOG.error(_("fail to establish a connection with CVM event, sleeping for %d seconds") % delay)
                time.sleep(delay)
                delay = min(2 * delay,60)
            else:
                return resp

    def _unregister_instance_event(self,resp):
        resp.close()

    def _get_instance_uuid_by_vmid(self,vmId):
        uri = self._session.make_cmd_uri('/nova/vmInfo',vmId)
        resp,body = self._session.call_method("GET",uri)
        if resp.status_code == 200:
            uuid = self._xml.decode_xml("instance_uuid_by_vmid",body)
            return uuid
        else:
            LOG.error(_("fail to get instance uuid by vmid:%s, uri:%s")
                      % (vmId,uri))
            LOG.error(_("fail to get instance uuid by vmid:%s, resp.status_code:%d,%s")
                      % (vmId,resp.status_code,cas_error.get_http_respond_error(resp)))
            return None

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

    def _monitor_proc(self,thread_obj):
        last_time = self._report_time
        while True:
            if self._event.isSet():
                LOG.error(_("event is set, so monitor exit now!"))
                return
            else:
                time.sleep(2 * 60)
        
            if thread_obj not in threading.enumerate():
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
    
class CasEventRmq(CasEventBase):
    def __init__(self,session, hostname, plugin):
        self._rmq_host = CONF.cas.rmq_host
        self._rmq_port = CONF.cas.rmq_port
        self._rmq_user = CONF.cas.rmq_user
        self._rmq_password = CONF.cas.rmq_password
        self._rmq_vhost = CONF.cas.rmq_vhost
        self._rmq_exchange = CONF.cas.rmq_exchange
        self._rmq_queue = "%s_%s" % (CONF.cas.rmq_queue,hostname)
        self._rmq_max_length_Mbytes = CONF.cas.rmq_queue_max_length_Mbytes
        self._rmq_queue_mode = CONF.cas.rmq_queue_mode
        self._rmq_connection = None
        self._rmq_channel = None
        super(CasEventRmq,self).__init__(session,hostname,plugin)
    
    def _get_rabbitmq_conf(self):
        uri = self._session.make_cmd_uri('/system/rabbitmq')
        try:
            resp,body = self._session.call_method("GET",uri)
            if resp.status_code == 200:
                body = body.decode("utf-8")
                rabbitmq_conf_msg = base64.b64decode(body)
                key = '68706832625E7A31'.decode('hex')
                des = DES.new(key,DES.MODE_ECB)
                rabbitmq_conf_msg = des.decrypt(rabbitmq_conf_msg)
                rabbitmq_conf_msg = "%s}" % rabbitmq_conf_msg.split('}')[0]
                rabbitmq_conf = jsonutils.loads(rabbitmq_conf_msg)
                LOG.debug(_("get rabbitmq_conf ok:%s") % rabbitmq_conf)
                return rabbitmq_conf
            else:
                LOG.error(_("fail to _get_rabbitmq_conf from cvm, uri:%s,resp.status_code:%d,%s")
                          % (uri,resp.status_code,cas_error.get_http_respond_error(resp)))
                raise cas_error.CasVmException()
        except Exception as exc:
            LOG.error(_("fail to _get_rabbitmq_conf from cvm, exc:%s") % exc)
            raise exc
    
    def _reload_rabbitmq_conf(self,rabbitmq_conf):
        self._rmq_host = rabbitmq_conf['address']
        self._rmq_port = rabbitmq_conf['port']
        self._rmq_user = rabbitmq_conf['user']
        self._rmq_password = rabbitmq_conf['pwd']
        self._rmq_vhost = rabbitmq_conf['vhost']
        self._rmq_exchange = rabbitmq_conf['exchange']
    
    def _register_instance_event(self):
        resp = []
        delay = 1
        
        while True:
            try:
                rabbitmq_conf = self._get_rabbitmq_conf()
                if rabbitmq_conf is not None:
                    self._reload_rabbitmq_conf(rabbitmq_conf)
                    self._rmq_create_connection()
                    self._rmq_create_chanel()
                    self._rmq_bind_chanel_to_exchange()
                    self._rmq_qos_chanel()
            except Exception as exc:
                self._rmq_stop_process()
                LOG.error(_("fail to init a connection with rmq server, exc:%s,sleeping:%d ") % (exc,delay))
                time.sleep(delay)
                delay = min(2 * delay,60)
            else:
                return resp
    
    def _unregister_instance_event(self,resp):
        self._rmq_stop_process()
    
    def _emit_event(self, evtype, evt_para):
        
        if evtype is not None:
            vm_status = CAS_BASE_EVENT.get(evtype,None)
            if vm_status is not None:
                vmid = evt_para[0]
                vm_uuid = evt_para[1]
                if vm_uuid:
                    ports = self._get_valid_ports(vm_uuid)
                    if ports:
                        LOG.info(_("receive event %s, update status of ports. ports:%s") % (vm_status,ports))
                        self._plugin.update_ports_status(vm_uuid,vmid,ports,vm_status)
    
    def _instance_event_type_and_uuid(self,body):
        evtype = None
        uuid = None
        if body is not None:
            rsEvent = body.get('rsEvent',None)
            if rsEvent is not None:
                evtype = rsEvent.get('eventType',None)
                if evtype is not None:
                    evtype = str(evtype)
                uuid = rsEvent.get('uuid',None)
                if uuid is not None:
                    uuid = str(uuid)
                vmid = rsEvent.get('vmId',None)
                if vmid is not None:
                    vmid = str(vmid)
        
        return evtype,vmid,uuid
    
    def _deal_rmq_body(self,body):
        
        try:
            body = body.decode('utf-8')
            event_info = jsonutils.loads(body)
            LOG.debug(_("rmq event body:%s") % (body))
            
            evtype,vmid,uuid = self._instance_event_type_and_uuid(event_info)
            if evtype is None or uuid is None:
                return
            
            LOG.info(_("[cas::]evtype:%s,uuid:%s") % (evtype,uuid))
            try:
                if CAS_BASE_EVENT.get(evtype) is not None:
                    keywords = (evtype,(vmid,uuid))
                    self._put_event_into_queue(keywords)
                    return
                
            except Exception as exc:
                LOG.error(_("fail to put event into queue. exc:%s") % exc)
        except Exception as exc:
            LOG.error(_("fail to deal whith rmq body. exc:%s") % exc)
    
    def _monitor_proc(self,thread_obj):
        while True:
            if self._event.isSet():
                LOG.error(_("event is set, so monitor exit now!"))
                return
            else:
                time.sleep(2 * 60)
            
            if thread_obj not in threading.enumerate():
                LOG.error(_("event io thread not exists,so monitor exit now!"))
                if not self._event.isSet():
                    self._event.set()
                return
            
            rmq_alive = self._rmq_check_alive()
            if not rmq_alive:
                LOG.error(_("rmq connection or channel is not alive,so monitor exit now"))
                if not self._event.isSet():
                    self._event.set()
                return
    
    def _io_proc(self,resp):
        try:
            self._rmq_start_process()
        except Exception as exc:
            if not self._event.isSet():
                self._event.set()
            LOG.error(_("deal instance event i/o thread exit now. exception:%s") % exc)
            return
    
    def _rmq_on_blocked_callback(self):
        LOG.info(_("rmq_on_blocked ok"))
    
    def _rmq_create_connection(self):
        try:
            if self._rmq_connection is None:
                ssl_options = {
                    "ca_certs": r"/usr/lib/python2.7/site-packages/nova/virt/casapi/cacert.pem",
                    "keyfile": r"/usr/lib/python2.7/site-packages/nova/virt/casapi/key.pem",
                    "certfile": r"/usr/lib/python2.7/site-packages/nova/virt/casapi/cert.pem",
                    "cert_reqs": ssl.CERT_REQUIRED
                }
                credentials = pika_credentials.PlainCredentials(self._rmq_user,self._rmq_password)
                para = pika.ConnectionParameters(host=self._rmq_host,
                                                 port=self._rmq_port,
                                                 virtual_host=self._rmq_vhost,
                                                 credentials=credentials,
                                                 heartbeat_interval=80,
                                                 ssl=True,
                                                 ssl_options=ssl_options
                                                 )
                # para = pika.ConnectionParameters(host=self._rmq_host,port=self._rmq_port,virtual_host=self._rmq_vhost,
                #                                  credentials=credentials,heartbeat_interval=80)
                self._rmq_connection = pika.BlockingConnection(para)
                self._rmq_connection.add_on_connection_blocked_callback(self._rmq_on_blocked_callback)
        except Exception as exc:
            LOG.error(_("failed to _rmq_create_connection,exc:%s") % exc)
            raise exc
    
    def _rmq_create_chanel(self):
        try:
            if self._rmq_channel is None:
                self._rmq_channel = self._rmq_connection.channel()
                arguments = {'x-max-length-bytes':self._rmq_max_length_Mbytes * units.Mi,
                             'x-queue-mode':self._rmq_queue_mode,}
                self._rmq_channel.queue_declare(queue=self._rmq_queue,durable=True,arguments=arguments)
        except Exception as exc:
            LOG.error(_("failed to _rmq_create_chanel,exc:%s") % exc)
            raise exc
    
    def _rmq_qos_chanel(self):
        try:
            if self._rmq_channel is not None:
                self._rmq_channel.basic_qos(prefetch_count=1)
        except Exception as exc:
            LOG.error(_("failed to _rmq_qos_chanel,exc:%s") % exc)
            raise exc
    
    def _rmq_delete_chanel(self):
        try:
            if self._rmq_channel is not None:
                self._rmq_channel.queue_delete(queue=self._rmq_queue)
        except Exception as exc:
            LOG.error(_("failed to _rmq_delete_chanel,exc:%s") % exc)
            raise exc
    
    def _rmq_bind_chanel_to_exchange(self):
        try:
            if self._rmq_channel is not None:
                self._rmq_channel.queue_bind(queue=self._rmq_queue,exchange=self._rmq_exchange,
                                             routing_key='vm_event_completed')
        except Exception as exc:
            LOG.error(_("failed to _rmq_bind_chanel_to_exchange,exc:%s") % exc)
            raise exc
    
    def _rmq_basic_consume_callback(self,channel,method,properties,body):
        self._deal_rmq_body(body)
        time.sleep(0.000001)
        channel.basic_ack(delivery_tag=method.delivery_tag)
    
    def _rmq_start_process(self):
        try:
            self._rmq_channel.basic_consume(self._rmq_basic_consume_callback,queue=self._rmq_queue,no_ack=False)
            LOG.info(_("start_consuming."))
            self._rmq_channel.start_consuming()
        except Exception as exc:
            LOG.error(_("failed to _rmq_start_process,exc:%s") % exc)
            raise exc
    
    def _rmq_stop_process(self):
        try:
            if self._rmq_channel is not None and self._rmq_channel.is_open:
                self._rmq_channel.stop_consuming()
                self._rmq_channel.close()
                
            if self._rmq_connection is not None and self._rmq_connection.is_open:
                self._rmq_connection.close()
                
            self._rmq_channel = None
            self._rmq_connection = None
        except Exception as exc:
            LOG.error(_("failed to _rmq_stop_process,exc:%s") % exc)
    
    def _rmq_check_alive(self):
        con_alive = self._rmq_connection is not None and self._rmq_connection.is_open
        ch_alive = self._rmq_channel is not None and self._rmq_channel.is_open
        return con_alive and ch_alive
    