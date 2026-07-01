#add by zhangmingze, 2015-12-4
import time
import threading
import Queue
import eventlet
import nova.conf
import pika
import base64
import ssl

from oslo_log import log as logging
from oslo_serialization import jsonutils
from oslo_utils import units
from eventlet import greenthread

from nova import objects
from nova.i18n import _
from nova import context as novacontext
from nova.virt import event as virtevent
from nova.virt.casapi import xml as casxml
from nova.virt.casapi import error as cas_error
from pika import credentials as pika_credentials
from Crypto.Cipher import DES

CONF = nova.conf.CONF
LOG = logging.getLogger(__name__)

EVENT_STATES_MAP = {
    '2':virtevent.EVENT_LIFECYCLE_STARTED,
    '3':virtevent.EVENT_LIFECYCLE_STOPPED,
    '4':virtevent.EVENT_LIFECYCLE_PAUSED,
    '5': virtevent.EVENT_LIFECYCLE_SUSPENDED,
}
CAS_BASE_EVENT = {
    '30':virtevent.EVENT_LIFECYCLE_STARTED,
    '31':virtevent.EVENT_LIFECYCLE_STOPPED,
    '32':virtevent.EVENT_LIFECYCLE_STOPPED,
    '34':virtevent.EVENT_LIFECYCLE_PAUSED,
    '35':virtevent.EVENT_LIFECYCLE_RESUMED,
    '36':virtevent.EVENT_LIFECYCLE_SUSPENDED
}

EVENT_INSTANCE_MIGRATE = 38
EVENT_INSTANCE_RESUMESNAP = 44
CAS_EX_EVENT = {
    '38':EVENT_INSTANCE_MIGRATE,
    '44':EVENT_INSTANCE_RESUMESNAP
}

EVENT_INSTANCE_DTS = 803
CAS_DTS_EVENT = {
    '803':EVENT_INSTANCE_DTS,
}

DTS_PLAN_RECOVER = 1
DTS_FAULT_RECOVER = 2
DTS_REVERT_RECOVER = 3
DTS_TYPE = {
    '1':DTS_PLAN_RECOVER,
    '2':DTS_FAULT_RECOVER,
    '3':DTS_REVERT_RECOVER
}

MAX_CHUNK_SIZE = 4096

class CasEventBase(object):
    def __init__(self,session,host,virthost):
        self._virthost = virthost
        self._session = session
        self._host = host
        self._xml = casxml.EventXml()
        self._compute_event_callback = None
        self._event_queue = Queue.Queue(256)
        self._event = threading.Event()
        self._worker_num = 10
        self._event_gthead_pool = eventlet.GreenPool(size=CONF.cas.event_gthead_pool_size)
        greenthread.spawn(self._instance_event)
    
    def register_event_listener(self, callback):
        self._compute_event_callback = callback
    
    def _get_valid_instance(self, vmUUID, host=None):
        _context = novacontext.get_admin_context()
        filters = {'uuid':[vmUUID],'deleted':False}
        if host is not None:
            filters['host'] = host
        instances = objects.InstanceList.get_by_filters(_context, filters, use_slave=True)
        return instances
    
    def _emit_base_event(self, vmUUID, event):
        eventObj = virtevent.LifecycleEvent(vmUUID,event)
        
        if not self._compute_event_callback:
            LOG.debug(_("Discarding event %s") % eventObj)
            return
        
        try:
            LOG.info(_("[cas::] begin to emit vm event %s") % eventObj)
            self._compute_event_callback(eventObj)
            LOG.info(_("[cas::] finish to emit vm event %s") % eventObj)
        except Exception as ex:
            LOG.error(_("Exception dispatching event %s: %s")
                     % (str(eventObj), ex))
    
    def _get_event_instance_by_vmid(self,vmid):
        info = self._get_instance_info_by_vmid(vmid)
        vm_uuid = info['uuid']
        if vm_uuid:
            # instances = self._get_valid_instance(vm_uuid,self._virthost)
            instances = self._get_valid_instance(vm_uuid)
            if instances:
                return instances[0]
        return None
    
    def _get_event_instance_by_uuid(self,uuid):
        if uuid is not None:
            # instances = self._get_valid_instance(uuid,self._virthost)
            instances = self._get_valid_instance(uuid)
            if instances:
                return instances[0]
        return None
    
    def _get_dts_instance_by_uuid(self,uuid):
        if uuid is not None:
            instances = self._get_valid_instance(uuid)
            if instances:
                return instances[0]
        return None
    
    def _sync_instances_node_by_migrate_spawn(self,instance,destHostId):
        self._event_gthead_pool.spawn_n(self._host.sync_instances_node_by_migrate,instance,destHostId)
    
    def _sync_instances_by_dts(self,instance, dtsInfo):
        self._host.sync_instances_dtsinfo(instance, dtsInfo)
        info = self._get_instance_info_by_vmid(dtsInfo['vmId'])
        state = info['state']
        if state in EVENT_STATES_MAP.keys():
            self._emit_base_event(instance['uuid'],EVENT_STATES_MAP[state])
    
    def _sync_instances_by_dts_spawn(self,instance,dtsInfo):
        self._event_gthead_pool.spawn_n(self._sync_instances_by_dts, instance, dtsInfo)
    
    def _get_instance_info_by_vmid(self, vmId):
        uri = self._session.make_cmd_uri('/nova/vmInfo',vmId)
        resp, body = self._session.call_method("GET",uri)
        if resp.status_code == 200:
            info = self._xml.decode_xml("instance_info",body)
            return info
        else:
            LOG.error(_("fail to get instance info uuid by vmid:%s, uri:%s")
                     % (vmId,uri))
            LOG.error(_("fail to get instance info uuid by vmid:%s, resp.status_code:%d,%s")
                     % (vmId,resp.status_code,cas_error.get_http_respond_error(resp)))
            return None
    

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
                    evt_para   = evt_item[1]
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
                worker = threading.Thread(target=self._worker_proc,name="nova-plugins-evtworker")
                worker.setDaemon(True)
                worker.start()
                worker_list.append(worker)
                num = num - 1

            resp = self._register_instance_event()
            evt_io = threading.Thread(target=self._io_proc,args=(resp,),name="nova-plugins-evtio")
            evt_io.setDaemon(True)
            evt_io.start()

            monitor = threading.Thread(target=self._monitor_proc,args=(evt_io,),name="nova-plugins-monitor")
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
    def __init__(self,session,host,virthost):
        super(CasEventHttp,self).__init__(session,host,virthost)

    def _emit_event(self,evtype,evt_para):
        """Dispatches an event to the compute manager.

        Invokes the event callback registered by the
        compute manager to dispatch the event. This
        must only be invoked from a green thread.
        """
        if evtype is not None and len(evt_para) > 0:
            event = CAS_DTS_EVENT.get(evtype)
            if (event is not None and len(evt_para) == 2):
                dtsInfo = evt_para[1]
                instance = self._get_dts_instance_by_uuid(dtsInfo['uuid'])
                if (instance and dtsInfo['hostId'] is not None):
                    self._sync_instances_by_dts_spawn(instance,dtsInfo)
                return
        
            vmid = evt_para[0]
            instance = self._get_event_instance_by_vmid(vmid)
            LOG.info("Rabbit mq instance is: %s" % instance)
            if (instance and self._host.instance_in_hypervisor(instance)):
                event = CAS_BASE_EVENT.get(evtype)
                if event is not None:
                    self._emit_base_event(instance['uuid'],event)
                    return
                
                event = CAS_EX_EVENT.get(evtype)
                if (event is not None and len(evt_para) == 3):
                    destHostId = evt_para[1]
                    migrateType = evt_para[2]
                    if (destHostId is not None and migrateType is not None and migrateType != 1):
                        self._sync_instances_node_by_migrate_spawn(instance,destHostId)
    
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
                        return
                    
                    if CAS_EX_EVENT.get(evtype) is not None:
                        destHostId,migrateType = self._xml.decode_xml("instance_migrate_event",chunkd_text)
                        keywords = (evtype,(vmid,destHostId,migrateType))
                        self._put_event_into_queue(keywords)
                        return
                    
                    if CONF.cas.dts_sync and CAS_DTS_EVENT.get(evtype) is not None:
                        dtsInfo = self._xml.decode_xml("instance_dts_event",chunkd_text)
                        keywords = (evtype,(vmid,dtsInfo))
                        self._put_event_into_queue(keywords)
                        return
                
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
    
class CasEventRmq(CasEventBase):
    def __init__(self,session,host,virthost):
        self._rmq_host = CONF.cas.rmq_host
        self._rmq_port = CONF.cas.rmq_port
        self._rmq_user = CONF.cas.rmq_user
        self._rmq_password = CONF.cas.rmq_password
        self._rmq_vhost = CONF.cas.rmq_vhost
        self._rmq_exchange = CONF.cas.rmq_exchange
        self._rmq_queue = "%s_%s" % (CONF.cas.rmq_queue,virthost)
        self._rmq_max_length_Mbytes = CONF.cas.rmq_queue_max_length_Mbytes
        self._rmq_queue_mode = CONF.cas.rmq_queue_mode
        self._rmq_connection = None
        self._rmq_channel = None
        super(CasEventRmq,self).__init__(session,host,virthost)
    
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
    
    def _emit_event(self,evtype,evt_para):

        if evtype is not None and len(evt_para) > 0:
            event = CAS_DTS_EVENT.get(evtype)
            if (event is not None and len(evt_para) == 2):
                dtsInfo = evt_para[1]
                instance = self._get_dts_instance_by_uuid(dtsInfo['uuid'])
                if (instance and dtsInfo['hostId'] is not None):
                    self._sync_instances_by_dts_spawn(instance,dtsInfo)
                return
            
            uuid = evt_para[0]
            instance = self._get_event_instance_by_uuid(uuid)
            LOG.info("Rabbit mq instance is: %s" % instance)
            if (instance and self._host.instance_in_hypervisor(instance)):
                event = CAS_BASE_EVENT.get(evtype)
                if event is not None:
                    self._emit_base_event(instance['uuid'],event)
                    return
            
                event = CAS_EX_EVENT.get(evtype)
                if (event is not None and len(evt_para) == 3):
                    destHostId = evt_para[1]
                    migrateType = evt_para[2]
                    if (destHostId is not None and migrateType is not None and migrateType != 1):
                        self._sync_instances_node_by_migrate_spawn(instance,destHostId)
                if (event is not None and len(evt_para) == 2):
                    vmId = evt_para[1]
                    info = self._get_instance_info_by_vmid(vmId)
                    state = info['state']
                    LOG.info(_("vm state is %s") % state)
                    if state in EVENT_STATES_MAP.keys():
                        self._emit_base_event(instance['uuid'], EVENT_STATES_MAP[state])
    
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
        
        return evtype,uuid
    
    def _instance_event_migrate_info(self,body):
        destHostId = None
        migrateType = None

        if body is not None:
            rsEvent = body.get('rsEvent',None)
            if rsEvent is not None:
                migrate = rsEvent.get('migrate',None)
                destHostId = str(migrate.get('destHostId',None))
                if destHostId is not None:
                    destHostId = str(destHostId)
                
                migrateType = migrate.get('migrateType',None)
                if migrateType is not None:
                    migrateType = int(migrateType)
        
        return destHostId,migrateType

    def _instance_event_resumesnap_info(self, body):
        vmId = None
        if body is not None:
            rsEvent = body.get('rsEvent', None)
            if rsEvent is not None:
                vmId = str(rsEvent.get('vmId',None))
        return vmId
    
    def _instance_event_dts_info(self,body):
        dtsInfo = {'vmId':None,'uuid':None,'hostId':None,'dtsType':None,
                   'vmType':None,'volume_list':[]}
        
        if body is not None:
            rsEvent = body.get('rsEvent',None)
            if rsEvent is not None:
                vmId = str(rsEvent.get('vmId',None))
                dtsInfo['vmId'] = vmId
                dtsDataObj = rsEvent.get('rsDtsData',None)
                if dtsDataObj is not None:
                    vmUuid = dtsDataObj.get("vmUuid",None)
                    if vmUuid is not None:
                        dtsInfo['uuid'] = vmUuid
                    
                    hostId = dtsDataObj.get("hostId",None)
                    if hostId is not None:
                        dtsInfo['hostId'] = str(hostId)
                    
                    dtsType = dtsDataObj.get("dtsType")
                    if dtsType is not None:
                        dtsInfo['dtsType'] = dtsType
                    
                    vmType = dtsDataObj.get("vmType",None)
                    if vmType is not None:
                        dtsInfo['vmType'] = vmType
                    
                    volume_list = dtsDataObj.get("volume",[])
                    dtsInfo['volume_list'] = volume_list
        
        return dtsInfo
    
    def _deal_rmq_body(self,body):
        
        try:
            body = body.decode('utf-8')
            event_info = jsonutils.loads(body)
            LOG.debug(_("rmq event body:%s") % (body))
            
            evtype,uuid = self._instance_event_type_and_uuid(event_info)
            if evtype is None or uuid is None:
                return
            
            LOG.info(_("[cas::]evtype:%s,uuid:%s") % (evtype,uuid))
            try:
                if CAS_BASE_EVENT.get(evtype) is not None:
                    keywords = (evtype,(uuid,))
                    self._put_event_into_queue(keywords)
                    return
                
                if CAS_EX_EVENT.get(evtype) is not None:
                    if evtype is not None and CAS_EX_EVENT.get(evtype) == EVENT_INSTANCE_MIGRATE:
                        destHostId,migrateType = self._instance_event_migrate_info(event_info)
                        keywords = (evtype,(uuid,destHostId,migrateType))
                        self._put_event_into_queue(keywords)
                    if evtype is not None and CAS_EX_EVENT.get(evtype) == EVENT_INSTANCE_RESUMESNAP:
                        vmId = self._instance_event_resumesnap_info(event_info)
                        keywords = (evtype,(uuid,vmId))
                        self._put_event_into_queue(keywords)
                
                if CONF.cas.dts_sync and CAS_DTS_EVENT.get(evtype) is not None:
                    dtsInfo = self._instance_event_dts_info(event_info)
                    keywords = (evtype,(uuid,dtsInfo))
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
    