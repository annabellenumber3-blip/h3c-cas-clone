#add by zhangmingze, 2014-2-13

import re
import time
import base64
import os.path as os_path
import eventlet

from oslo_log import log as logging
from oslo_serialization import jsonutils
from oslo_utils import units
from oslo_utils import timeutils

from nova import exception
from nova import utils
from nova.i18n import _
from nova.compute import power_state
from nova.compute import task_states
from nova.virt import driver
from nova.virt import hardware
from nova.virt import configdrive
from nova.objects import diagnostics
from nova.objects import fields
from nova.console import type as ctype
from nova.api.metadata import base as instance_metadata
from nova.virt.casapi import sem as cassem
from nova.virt.casapi import xml as casxml
from nova.virt.casapi import error as cas_error
from nova.objects import InstanceGroup
from nova import context as novacontext

import nova.conf

CONF = nova.conf.CONF

LOG = logging.getLogger(__name__)

CAS_POWER_STATES = {
    '1':power_state.NOSTATE,
    '2':power_state.RUNNING,
    '3':power_state.SHUTDOWN,
    '4':power_state.PAUSED,
    '5':power_state.SUSPENDED
}

DTS_VM_TYPE = {
    '1':'NORMAL_VM',
    '2':'FAKE_VM',
    '3':'RECOVER_VM',
}

DTS_VM_PRIO = {
    'RECOVER_VM':0,
    'NORMAL_VM':1,
    'FAKE_VM':2,
}

VALID_VIDEO_TYPE = ('vga', 'cirrus', 'qxl')

MAX_CONSOLE_BYTES = 100 * units.Ki
QOS_MIN = 16
QOS_MAX = 2147483647

JOIN_PROJECT_GROUP = "JOIN"
DELETE_PROJECT_GROUP = "DELETE"

class CasVMOps(object):
    """Management class for VM-related tasks."""
    
    def __init__(self, session, volumeops, imageops, host, network):
        """Initializer."""
        self._session = session
        self._volumeops = volumeops
        self._imageops = imageops
        self._host = host
        self._network = network
        self._xml = casxml.VmXml()
        self._semObj = cassem.CasSem()
        self._link_clone = 'true' if CONF.cas.linkClone else 'false'
        self._useLocalStorage = 'true' if CONF.cas.useLocalStorage else 'false'
        self._run_once = 'true' if CONF.cas.runOnce else 'false'
        self._bindIp = 'true' if CONF.cas.bindIp else 'false'
        self._configVM = CONF.cas.configVM
        self._cpu_mode = CONF.cas.cpu_mode
        self._instance_initialization = CONF.cas.instance_initialization
        # 空值：精简，thick：延迟置零，zeroing：置零
        if CONF.cas.volume_mode == 'thick':
            self._write_zero = 0
        elif CONF.cas.volume_mode == 'zeroing':
            self._write_zero = 1
        else:
            self._write_zero = 2
    
    def _get_instance_extra_specs(self, instance):
        instance_numa_topology = instance['numa_topology']
        node_numa_topology = self._host.get_node_numa_topology(instance['node'])
        if node_numa_topology is None:
            raise exception.NUMATopologyUnsupported()
        
        pageSize = None
        avail_pagesize = [page.size_kb for page in node_numa_topology.cells[0].mempages]
        for instance_cell in instance_numa_topology.cells:
            if (instance_cell.pagesize is not None and
                instance_cell.pagesize in avail_pagesize):
                pageSize = instance_cell.pagesize
                break
        
        numa_list = []
        for guest_node_id,instance_cell in enumerate(instance_numa_topology.cells):
            guest_cell = {'vid':guest_node_id,'pid':instance_cell.id,'cpus':instance_cell.cpuset,'memory':instance_cell.memory}
            
            if pageSize is not None:
                guest_cell['pageSize'] = pageSize
            
            vcpupin_list = []
            if instance_cell.cpu_pinning:
                for cpu in instance_cell.cpuset:
                    pcpu = instance_cell.cpu_pinning[cpu]
                    cpuset = set([pcpu])
                    vcpupin_list.append({'vcpu':cpu,'cpuset':cpuset})
            else:
                for node_cell in node_numa_topology.cells:
                    if node_cell.id == instance_cell.id:
                        node_cpuset = node_cell.cpuset
                        break
                for cpu in instance_cell.cpuset:
                    vcpupin_list.append({'vcpu':cpu,'cpuset':node_cpuset})
            
            guest_cell['vcpupin'] = vcpupin_list
            
            numa_list.append(guest_cell)
        
        return numa_list
    
    def _get_instance_detail(self, instance_uuid, instanceId, type):
        uri = self._session.make_cmd_uri('/vm/detail',instanceId)
        resp, body = self._session.call_method("GET",uri)
        if resp.status_code == 200:
            detail = self._xml.decode_xml("instance_detail_%s" % type,body)
            LOG.info(_("success to get instance[uuid:%s] %s detail from CVM, info=%s") % (instance_uuid,type,detail))
            return detail
        else:
            LOG.error(_("fail to get instance[uuid:%s] %s detail! uri:%s") % (instance_uuid,type,uri))
            LOG.error(_("fail to get instance[uuid:%s] %s detail! resp.status_code:%d,%s")
                     % (instance_uuid,type,resp.status_code,cas_error.get_http_respond_error(resp)))
            raise cas_error.CasVmException()
    
    def _get_instance_info(self, instance_uuid):
        uri = self._session.make_cmd_uri('/nova/searchVm',uuid=instance_uuid)
        resp, body = self._session.call_method("GET",uri)
        if resp.status_code == 200:
            info = self._xml.decode_xml("instance_base", body)
            LOG.info(_("success to get instance[uuid=%s] info from CVM, info=%s") % (instance_uuid,info))
            return info
        else:
            LOG.error(_("fail to get instance[uuid=%s] info! uri:%s") % (instance_uuid,uri))
            LOG.error(_("fail to get instance[uuid=%s] info! resp.status_code:%d,%s")
                     % (instance_uuid,resp.status_code,cas_error.get_http_respond_error(resp)))
            
            if resp.status_code == 409 and resp.headers.get('error-code') == '1001':
                raise exception.InstanceNotFound(instance_id=instance_uuid)
            else:
                raise cas_error.CasVmException()

    def _get_instance_dts_info(self,instance_uuid):
        uri = self._session.make_cmd_uri('/nova/vmdtsInfo',uuid=instance_uuid)
        resp,body = self._session.call_method("GET",uri)
        if resp.status_code == 200:
            dts_info = self._xml.decode_xml("instance_dts_info",body)
            LOG.info(_("instance[uuid=%s] dts info:%s") % (instance_uuid,dts_info))
            return dts_info
        else:
            LOG.error(_("fail to get instance[uuid=%s] dts info! uri:%s") % (instance_uuid,uri))
            LOG.error(_("fail to get instance[uuid=%s] dts info! resp.status_code:%d,%s")
                      % (instance_uuid,resp.status_code,cas_error.get_http_respond_error(resp)))
        
            if resp.status_code == 409 and resp.headers.get('error-code') == '1001':
                return  None
            else:
                raise cas_error.CasVmException()

    def get_instance_dts_info(self,instance_uuid):
        return self._get_instance_dts_info(instance_uuid)
    
    def check_instance_exist(self, instance_uuid):
        uri = self._session.make_cmd_uri('/nova/ifDomainExists',uuid=instance_uuid)
        resp, body = self._session.call_method("GET",uri)
        if resp.status_code == 200:
            if body == 'true':
                LOG.info(_("instance[uuid=%s] already exist on the CAS!") % instance_uuid)
                return True
            else:
                LOG.info(_("instance[uuid=%s] doesn't exist on the CAS!") % instance_uuid)
                return False
        else:
            LOG.error(_("fail to check instance[uuid=%s] exist! uri:%s") % (instance_uuid,uri))
            LOG.error(_("fail to check instance[uuid=%s] exist! resp.status_code:%d,%s")
                     % (instance_uuid,resp.status_code,cas_error.get_http_respond_error(resp)))
            raise cas_error.CasVmException()
    
    def get_info(self, instance, instanceId=None,check_managed=False,isDb='true'):
        instanceId = instanceId or self._get_instance_info(instance['uuid'])['id']
        uri = self._session.make_cmd_uri('/nova/vmInfo',instanceId,isDb=isDb)
        resp, body = self._session.call_method("GET",uri)
        if resp.status_code == 200:
            vm_info = self._xml.decode_xml("instance_info",body)
            instance_info = hardware.InstanceInfo(state=CAS_POWER_STATES[vm_info['state']],
                                                  max_mem_kb=vm_info['memory'],
                                                  mem_kb=vm_info['memory'],
                                                  num_cpu=vm_info['cpu'])
            if check_managed:
                self._check_manage_exist_vm(instance['uuid'],vm_info)
            return instance_info
        else:
            LOG.error(_("fail to get instance[uuid:%s,name:%s] info! uri:%s")
                     % (instance['uuid'],instance['name'],uri))
            LOG.error(_("fail to get instance[uuid:%s,name:%s] info! resp.status_code:%d,%s")
                     % (instance['uuid'],instance['name'],resp.status_code,cas_error.get_http_respond_error(resp)))
            raise cas_error.CasVmException()
    
    def change_instance_display_name(self, context, instance, name):
        vm_id = self._get_instance_info(instance['uuid'])['id']
        uri = self._session.make_cmd_uri('/vm/rename',vm_id,name)
        resp, body = self._session.call_method("PUT",uri)
        if resp.status_code != 200:
            LOG.error(_("fail to rename instance[%s] to %s ------ uri:%s") % (instance['uuid'],name,uri))
            LOG.error(_("fail to rename instance[%s] to %s ------ resp.status_code:%d,%s")
                     % (instance['uuid'],name,resp.status_code,cas_error.get_http_respond_error(resp)))
            raise cas_error.CasVmException()

    def change_instance_dev(self, context, instance, modifyArgs):
        vm_id = self._get_instance_info(instance['uuid'])['id']
        if modifyArgs:
            modifyArgs['id'] = vm_id
        uri = self._session.make_cmd_uri('/nova/vm/modifyDomainDev')
        xmlstr = self._xml.encode_xml("instance_modify_dev", **modifyArgs)
        resp, body = self._session.call_method("PUT", uri, body=xmlstr)
        if resp.status_code == 200:
            msgId = self._xml.decode_xml("get_message_id",body)
            task = self._session.wait_for_task(msgId)
            if task['result'] != 0:
                LOG.error(_("fail to modify instance[%s] device to: %s, failMsg:%s") % (instance['uuid'], modifyArgs, uri))
                raise cas_error.CasVmException()
        else:
            LOG.error(_("fail to modify instance device to: %s") % modifyArgs)
            LOG.error(_("fail to modify instance device, uri:%s. xml:%s") % (uri, xmlstr))
            LOG.error(_("fail to modify instance device. status_code:%d, %s")
                      % (resp.status_code, cas_error.get_http_respond_error(resp)))
            raise cas_error.CasVolumeException()
    
    def _get_cpu_info(self, flavor, update_args):
        if flavor is None:
            LOG.info(_("the flavor(%s) is error.") % flavor)
            raise cas_error.CasVmException()
        try:
            cpuSockets = int(flavor.extra_specs.get('hw:cpu_sockets','1'))
        except Exception:
            LOG.error(_("the cpu_socket(%s) is invalid.") % cpuSockets)
            raise cas_error.CasVmException()
        
        vcpus = int(flavor['vcpus'])
        if (cpuSockets <= 0 or  (vcpus % cpuSockets) != 0) :
            LOG.error(_("the cpu_socket(%s) is invalid.") % cpuSockets)
            raise cas_error.CasVmException()
        
        cpuCores = vcpus / cpuSockets
        update_args.update(cpuSockets=cpuSockets,cpuCores=cpuCores)

    def _get_storage_info(self, flavor):
        if flavor is None:
            LOG.info(_("the flavor(%s) is error.") % flavor)
            raise cas_error.CasVmException()
        try:
            image_type = flavor.extra_specs.get('hw:image_type',None)
            if image_type:
                if image_type not in ['normal','highIO']:
                    LOG.error(_("the hw:image_type(%s) is error.") % image_type)
                    raise cas_error.CasVmException()
                else:
                    storagePrefix = "_%s_" % image_type
                    return  set(['_normal_','_highCapacity_','_highIO_']) - set([storagePrefix])
            else:
                return None
           
        except Exception:
            LOG.info(_("the image_type(%s) is invalid.") % image_type)
            raise cas_error.CasVmException()
    
    def _get_raw_disks_info(self,flavor,update_args):
        if flavor is None:
            LOG.error(_("the flavor(%s) is error.") % flavor)
            raise cas_error.CasVmException()
        try:
            bare_disk_type = flavor.extra_specs.get('bare_disk_type',None)
            bare_disk_size = int(flavor.extra_specs.get('bare_disk_size','0'))
            bare_disk_num =  int(flavor.extra_specs.get('bare_disk_num','0'))
        except Exception:
            LOG.error(_("the bare disk info is invalid,please check!"))
            raise cas_error.CasVmException()
        
        if ((bare_disk_type is not None) and (bare_disk_size > 0) and (bare_disk_num > 0)):
            local_raw_disks = {'local_raw_disk':[{'type':bare_disk_type,
                               'size':bare_disk_size,
                               'num' :bare_disk_num}]}
            update_args.update(local_raw_disks=local_raw_disks)
    

    def _get_bool_deploy_para(self,instance,image_meta,update_args,metakey,xmlkey):
        try:
            instance_meta = instance['metadata']
            if instance_meta is not None:
                value = instance_meta.get(metakey,None)
                if value is not None:
                    value = value.lower()
                    if value in ['true','false']:
                        update_args[xmlkey]= value
                        return
                    else:
                        LOG.warring(_("ignore instance meta valid para:[%s:%s]") % (metakey,value))
            
            flavor = instance.flavor
            if flavor is not None:
                value = flavor.extra_specs.get(metakey,None)
                if value is not None:
                    value = value.lower()
                    if value in ['true','false']:
                        update_args[xmlkey] = value
                        return
                    else:
                        LOG.warring(_("ignore flavor valid para:[%s:%s]") % (metakey,value))
            
            if image_meta is not None:
                value = image_meta['properties'].get(metakey,None)
                if value is not None:
                    value = value.lower()
                    if value in ['true','false']:
                        update_args[xmlkey] = value
                        return
                    else:
                        LOG.warring(_("ignore image meta valid para:[%s:%s]") % (metakey,value))
            
            if CONF.cas[metakey]:
                update_args[xmlkey] = 'true'
            else:
                update_args[xmlkey] = 'false'
        except Exception:
            LOG.info(_("get key(%s) value failed!!")%metakey)
            raise cas_error.CasVmException()
    
    def _get_gpu_vgpu_parameter(self,instance, args):
        meta = instance['metadata']
        enable_GPU = meta.get('enableGPU','0')
        if enable_GPU == '1':
            if CONF.cas.GPUPool is None or CONF.cas.GPUTemplate is None:
                LOG.error(_("create instance[uuid:%s,name:%s] with GPU, but GPUPool or GPUTemplate is None!")
                          % (instance['uuid'],instance['name']))
                raise cas_error.CasVmException()
        
            GPUPool = CONF.cas.GPUPool.decode('utf-8')
            GPUTemplate = CONF.cas.GPUTemplate.decode('utf-8')
            resConfig = {'GPUPool':GPUPool,'GPUTemplate':GPUTemplate}
            args.update(resConfig=resConfig)
            LOG.info(_("create instance[uuid:%s,name:%s] with GPU, GPUPool:%s, use GPUTemplate:%s")
                     % (instance['uuid'],instance['name'],GPUPool,GPUTemplate))
        else:
            # handle gpu and vgpu args
            is_shared = instance['flavor'].get('extra_specs').get('shared') if 'shared' in instance['flavor'].get('extra_specs') else 0
            if isinstance(instance['metadata'],dict) and instance['metadata'].has_key('gpu') and instance[
                'metadata'].has_key('gpu_type'):
                args['resConfig'] = {'model':1,
                                     'count':instance['metadata'].get('gpu'),
                                     'type':instance['metadata'].get('gpu_type'),
                                     'shared':is_shared}
            if isinstance(instance['metadata'],dict) and instance['metadata'].has_key('vgpu') and instance[
                'metadata'].has_key('vgpu_type'):
                args['resConfig'] = {'model':2,
                                     'count':instance['metadata'].get('vgpu'),
                                     'type':instance['metadata'].get('vgpu_type'),
                                     'shared':is_shared}
            if args.has_key('resConfig'):
                GPUTemplate = self._host.get_business_template_for_gpu_vgpu_vm(is_shared)
                if GPUTemplate is None:
                    LOG.error(_("there is not suitable GPUTemplate"))
                    raise cas_error.CasVmException()
                args['resConfig']['GPUTemplate'] = GPUTemplate
                LOG.info(_("vm[uuid:%s,name:%s],resConfig:%s") % (instance['uuid'],instance['name'],args['resConfig']))
                
    def _get_deploy_parameter(self, instance, network_info, disk_bus, image_meta, recreate):
        flavor = instance.flavor
        if hasattr(instance, 'display_description'):
            desc = instance.display_description
        else:
            desc = ''
        meta = instance['metadata']
        domain_args = {'uuid':instance['uuid'],'domainName':instance['name'],'title':instance['display_name'],
                       'cpuSockets':1,'cpuCores':instance['vcpus'],'memory':instance['memory_mb'],
                       'createCdrom':'false','useLocal':self._useLocalStorage,'net':network_info, 'desc': desc}
        
        if CONF.cas.affinity_rules_map2cas and self._check_map_vm_rules(instance):
            domain_args['useLocal'] = 'false'
        os_type = image_meta.get('properties',{}).get("os_type", "unknown")
        os_type = image_meta.get('properties',{}).get("cas_ostype", os_type)
        if os_type == "unknown":
            system_type = 0
            os_Version = "otherGuest"
        else:
            system_info, os_Version = re.split("\||:",os_type)
            system_info = system_info.lstrip().rstrip()
            os_Version = os_Version.lstrip().rstrip()
            if system_info == "windows":
                system_type = 0
            elif system_info == "linux":
                system_type = 1
            else:
                LOG.error(_("the format of os_type(%s) is error.") % os_type)
                raise cas_error.CasVmException()
        domain_args.update(system=system_type,osVersion=os_Version)
        LOG.info(_("the os_type of instance[%s] is %s") % (instance['uuid'],os_type))

        video_type = image_meta.get('properties', {}).get("hw_video_model", None)
        if video_type and video_type in VALID_VIDEO_TYPE:
            domain_args['drive'] = video_type
        elif video_type is None:
            domain_args['drive'] = ''
            LOG.info(_("video_type value is None, use default value") )
        else:
            LOG.error(_("the video_type(%s) is error, please use curris, vga or qxl.") % video_type)
            raise cas_error.CasVmException

        host_info = self._host.get_valid_host_info(instance['node'],meta.get('hostname'),meta.get('location'))
        domain_args.update(host_info)
        LOG.info(_("instance[uuid:%s,name:%s] will be deploy on cluster:%s, host:%s, storagePool:%s")
                 % (instance['uuid'],instance['name'],host_info['clusterName'],host_info.get('hostName'),host_info.get('location')))
        
        self._get_gpu_vgpu_parameter(instance,domain_args)
        protect = meta.get('protectMode','0')
        domain_args['protectMode'] = protect
        if protect == '1':
            domain_args['linkClone'] = 'true'
            LOG.info(_("create instance[uuid:%s,name:%s] with protect mode!")
                     % (instance['uuid'],instance['name']))
        else:
            domain_args['linkClone'] = meta.get('linkClone',self._link_clone)
        
        if instance['numa_topology'] is not None:
            numa_topology = self._get_instance_extra_specs(instance)
            domain_args['vnuma'] = numa_topology
        
        if image_meta and instance['image_ref'] and not recreate:
            image_sysdisk_type = instance['system_metadata'].get('image_sysdisk_type', None)
            if image_sysdisk_type:
                cas_mode = 0 if image_sysdisk_type == 'thick' else (1 if image_sysdisk_type == 'zeroing' else 2)
            else:
                cas_mode = self._write_zero
            storage = {'image' : self._imageops.image_dir + image_meta['id'],
                       'imageType' : self._imageops.get_image_type(image_meta),
                       'imageSize' : instance['root_gb'] * units.Ki,
                       'targetBus' : disk_bus,
                       'mode': cas_mode}
            
            excludePrefix = self._get_storage_info(flavor)
            if excludePrefix is not None:
                storage['excludePrefix'] = excludePrefix
            domain_args['storage'] = storage
        
        watchdog_action = flavor.extra_specs.get('hw:watchdog_action','disabled')
        watchdog_action = image_meta.get('properties',{}).get('hw_watchdog_action',watchdog_action)
        if watchdog_action != 'disabled':
            if watchdog_action in fields.WatchdogAction.ALL:
                domain_args['watchdogAction'] = watchdog_action
            else:
                raise exception.InvalidWatchdogAction(action=watchdog_action)
        
        if recreate and instance.node not in self._host._nodes:
            default_node = self._host.get_host_first_nodename()
        else:
            default_node = instance.node
        
        default_cpu_mod = self._host.get_platform_para(default_node,'default_cpu_mod')
        cpuMode = self._cpu_mode if CONF.cas.cpu_mode != 'default_cpu_mod' else default_cpu_mod
        cpuMode = meta.get('cpuMode',cpuMode)
        cpuMode = flavor.extra_specs.get('hw:cpu_mode',cpuMode)
        if cpuMode in ('custom','host-model','host-passthrough'):
            domain_args['cpuMode'] = cpuMode
            if cpuMode == 'custom':
                cpuModel = flavor.extra_specs.get('hw:cpu_model')
                if cpuModel:
                    domain_args['cpuModel'] = cpuModel
        else:
            LOG.info(_("the cpu mode(%s) is error.") % cpuMode)
            raise cas_error.CasVmException()
        
        self._get_cpu_info(flavor,domain_args)
        equalCurcpuWithMaxcpu = meta.get('equalCurcpuWithMaxcpu','0')
        if equalCurcpuWithMaxcpu == '1':
            domain_args['equalCurcpuWithMaxcpu'] = 'true'
        
        self. _get_bool_deploy_para(instance,image_meta,domain_args,'sync_time','timeSync')
        self._get_bool_deploy_para(instance,image_meta,domain_args,'castools_auto_upgrade','autoTools')
        mem_conf = self._get_quota_mem_config(flavor)
        if mem_conf:
            if mem_conf.get('memoryBacking',0) > 0:
                domain_args['memoryBacking'] = mem_conf['memoryBacking']
            if mem_conf.get('memoryLimit',0) > 0:
                domain_args['memoryLimit'] = mem_conf['memoryLimit']
                domain_args['memoryLimitUnit'] = 'MB'        
        
        self._get_raw_disks_info(flavor,domain_args)
        return domain_args
    
    def _deploy(self, instance, **domainArgs):
        xmlstr = self._xml.encode_xml("create_instance",**domainArgs)
        uri = self._session.make_cmd_uri('/nova/vm/deploy')
        resp,body = self._session.call_method("POST",uri,body = xmlstr)
        if resp.status_code == 200:
            msgId = self._xml.decode_xml("get_message_id",body)
            task = self._session.wait_for_task(msgId)
            if task['result'] != 0:
                LOG.error(_("fail to deploy instance[uuid:%s,name:%s] uri:%s, xmlstr:%s")
                         % (instance['uuid'],instance['name'],uri,xmlstr))
                LOG.error(_("fail to deploy instance[uuid:%s,name:%s], failMsg:%s")
                           % (instance["uuid"],instance['name'],task['failMsg']))
                raise exception.InstanceDeployFailure(reason=_("see error log message to get detailed information!"))
            vm_id = task['targetId']
            need_sync = False
            if task.has_key('oldTask') and task['oldTask'] == 'true': 
                need_sync = True
            LOG.info(_("success to deploy instance[name:%s, uuid:%s, id:%s]") % (instance['name'],instance['uuid'],vm_id))
            return vm_id,need_sync
        else:
            LOG.error(_("fail to deploy instance[uuid:%s,name:%s] uri:%s, xmlstr:%s")
                     % (instance['uuid'],instance['name'],uri,xmlstr))
            LOG.error(_("fail to deploy instance[uuid:%s,name:%s],resp.status_code:%d,%s")
                       % (instance['uuid'],instance['name'],resp.status_code,cas_error.get_http_respond_error(resp)))
            raise exception.InstanceDeployFailure(reason=_("see error log message to get detailed information!"))
    
    def _attach_block_devices(self, instance, instanceId, hostName, block_devices, disk_bus, recreate):
        all_devices = {}
        
        for num, ephemeral_device in enumerate(block_devices['ephemerals']):
            deviceName = ephemeral_device['device_name']
            ephemeral_image = {'size':ephemeral_device['size'] * units.Ki,'device_name':deviceName,
                               'virtual_name':'ephemeral%d' % num,'guest_format':ephemeral_device.get('guest_format')}
            all_devices[deviceName] = {'type':'image','data':ephemeral_image}
        if block_devices['swap']['device_name']:
            swap_device = block_devices['swap']
            deviceName = swap_device['device_name']
            swap_image = {'size':swap_device['swap_size'],'device_name':deviceName,'virtual_name':'swap','guest_format':'swap'}
            all_devices[deviceName] = {'type':'image','data':swap_image}
        for mapping_info in block_devices['block_device_mapping']:
            deviceName = mapping_info['mount_device']
            all_devices[deviceName] = {'type':'volume','data':mapping_info}
        
        for deviceName in sorted(all_devices.keys()):
            device_data = all_devices[deviceName]['data']
            if all_devices[deviceName]['type'] == 'image':
                if recreate:
                    imageFile = self._imageops.find_image_in_share_storage(device_data['virtual_name']+'-'+instance['uuid'])
                    device_info = {'type':'disk','targetBus':disk_bus,'deviceName':deviceName,'path':imageFile}
                    self._imageops.attach_device(instance,instanceId,device_info)
                else:
                    self._imageops.attach_image(instance,instanceId,disk_bus,device_data,self._useLocalStorage,self._write_zero)
            else:
                connection_info = device_data['connection_info']
                self._volumeops.attach_lun_device_to_cluster(connection_info,hostName,instance['node'])
                self._volumeops.attach_volume(connection_info,instance,instanceId,deviceName,device_data.get('disk_bus') or disk_bus)
    
    def _config_drive(self, instance, instanceId, injected_files, network_info, admin_password, disk_bus, enableAdminPass):
        if configdrive.required_by(instance):
            config_args = {'id':instanceId}
            
            extra_md = None
            if enableAdminPass:
                extra_md = {'admin_pass':admin_password}
            inst_md = instance_metadata.InstanceMetadata(instance,
                content=injected_files, extra_md=extra_md, network_info=network_info)
            
            config_data = {}
            for path, data in inst_md.metadata_for_config_drive():
                config_data[path] = base64.b64encode(data)
            
            config_args['configData'] = {'type':CONF.config_drive_format, 'data':jsonutils.dumps(config_data)}
            
            if CONF.config_drive_format == 'vfat':
                config_args['configData']['targetBus'] = disk_bus
            
            uri = self._session.make_cmd_uri('/nova/vm/configDrive')
            xmlstr = self._xml.encode_xml("config_drive",**config_args)
            resp,body = self._session.call_method("PUT",uri,body=xmlstr)
            if resp.status_code != 200:
                LOG.error(_("fail to config drive for instance[uuid:%s,name:%s] uri:%s, xmlstr:%s")
                         % (instance['uuid'],instance['name'],uri,xmlstr))
                LOG.error(_("fail to config drive for instance[uuid:%s,name:%s],resp.status_code:%d,%s")
                         % (instance['uuid'],instance['name'],resp.status_code,cas_error.get_http_respond_error(resp)))
                raise cas_error.CasVmException()
            else:
                msgId = self._xml.decode_xml("get_message_id",body)
                task = self._session.wait_for_task(msgId)
                if task['result'] != 0:
                    LOG.error(_("fail to config drive for instance[uuid:%s,name:%s] uri:%s, xmlstr:%s")
                             % (instance['uuid'],instance['name'],uri,xmlstr))
                    LOG.error(_("fail to config drive for instance[uuid:%s,name:%s], failMsg:%s")
                             % (instance["uuid"],instance['name'],task['failMsg']))
                    raise cas_error.CasVmException()
                else:
                    LOG.info(_("success to config drive for instance[uuid:%s,name:%s].")
                            % (instance['uuid'],instance['name']))
    
    def _join_domain(self,meta,os_type,config_args):
        need_join = False
        
        if os_type.startswith('windows'):
            if meta.get("domainName") and meta.get("workGroupName"):
                LOG.error(_("invalid para:domainName:%s,workGroupName:%s") %(meta['domainName'],meta['workGroupName']))
                raise cas_error.CasVmException()
            
            if ((not meta.get("domainName")) and (not meta.get("workGroupName"))):
                return need_join
            
            if meta.get("domainAdmin"):
                config_args.update(userName=meta['domainAdmin'])
            
            if meta.get("domainAdminPassword"):
                config_args.update(password=meta['domainAdminPassword'])
            
            if meta.get("joinLocalGroup"):
                config_args.update(localgroup=meta['joinLocalGroup'])
                
            if meta.get("domainName"):
                config_args.update(domain=meta['domainName'])
                if meta.get("orgUnit"):
                    config_args.update(orgUnit=meta['orgUnit'])
                need_join = True
            elif meta.get("workGroupName"):
                config_args.update(workGroup=meta['workGroupName'])
                need_join = True
        
        return need_join
    
    def _config_vm(self, instance, instanceId, instance_meta, admin_password, vifs_info, image_meta, enableAdminPass, recreate):
        if (self._configVM and self._instance_initialization
            and not (recreate or image_meta[ 'disk_format' ] == 'iso')):
            config_args = {'id':instanceId,'hostName':instance['hostname'],'interface':vifs_info}
            
            if not configdrive.required_by(instance) and instance['user_data']:
                config_args['userData'] = {'data':instance['user_data'],'runOnce':self._run_once}
            
            os_type = image_meta['properties'].get("os_type", "unknown")
            os_type = image_meta['properties'].get("cas_ostype", os_type)
            
            if not self._join_domain(instance_meta,os_type,config_args):
                if instance_meta.get('domain') and (os_type == "unknown" or os_type.startswith('windows')):
                    LOG.info(_("domain is not NULL, os_type is unknown or system is windows, config vm with sysprep!"))
                    config_args.update(userName=instance_meta['username'],password=instance_meta['password'],
                                       domain=instance_meta['domain'],localgroup=instance_meta['localgroup'])
                else:
                    LOG.info(_("domain is NULL or system is linux, config vm with castools!"))
                    if enableAdminPass:
                        config_args['password'] = admin_password
                    else:
                        LOG.info(_("don't need to config instance[uuid:%s,name:%s] with admin password!")
                                 % (instance['uuid'],instance['name']))
            
            if (image_meta['properties'].get("full_initalization",'0') == '1'
                or instance_meta.get('full_initalization','0') == '1'):
                config_args.pop('id')
                return config_args
            
            uri = self._session.make_cmd_uri('/nova/vm/config')
            xmlstr = self._xml.encode_xml("config_vm",**config_args)
            resp,body = self._session.call_method("PUT",uri,body=xmlstr)
            if resp.status_code != 204:
                LOG.error(_("fail to config castools for instance[uuid:%s,name:%s] uri:%s, xmlstr:%s")
                         % (instance['uuid'],instance['name'],uri,xmlstr))
                LOG.error(_("fail to config castools for instance[uuid:%s,name:%s],resp.status_code:%d,%s")
                         % (instance['uuid'],instance['name'],resp.status_code,cas_error.get_http_respond_error(resp)))
            else:
                LOG.info(_("success to config castools for instance[uuid:%s,name:%s].")
                         % (instance['uuid'],instance['name']))
    
    def _wait_set_protect(self, instance, instanceId):
        def _query_protect_status():
                uri = self._session.make_cmd_uri('/nova/protectedStatus',instanceId)
                resp,body = self._session.call_method("get",uri)
                if resp.status_code == 200:
                    return body
                else:
                    LOG.error(_("fail to query protect status of instance[uuid:%s,name:%s] uri:%s")
                             % (instance['uuid'],instance['name'],uri))
                    reason = _("fail to query protect status of instance[uuid:%s,name:%s],resp.status_code:%d,%s"
                               % (instance['uuid'],instance['name'],resp.status_code,cas_error.get_http_respond_error(resp)))
                    raise cas_error.CasVmException()
        
        interval = 3
        while True:
            result = _query_protect_status()
            if result == '0':
                break
            elif result == '1':
                time.sleep(interval)
                continue
            elif result == '2':
                LOG.error(_("fail to set instance[uuid:%s,name:%s] protect mode")
                         % (instance['uuid'],instance['name']))
                raise cas_error.CasVmException()
            else:
                LOG.error(_("Error result[%s] from _query_protect_status for instance[uuid:%s,name:%s]")
                         % (result,instance['uuid'],instance['name']))
                raise cas_error.CasVmException()
    
    def _get_vm_clusterinfo(self,vm_id):
        uricmd = "/vm/%s"%vm_id
        uri = self._session.make_cmd_uri(uricmd)
        resp,body = self._session.call_method("GET",uri)
        if resp.status_code == 200:
            clusterinfo = self._xml.decode_xml("instance_clusterinfo",body)
            LOG.info(_("success to get instance[vm_id:%s] clusterinfo:%s") % (vm_id,clusterinfo))
            return clusterinfo
        else:
            LOG.error(_("fail to get instance[vm_id:%s] clusterinfo") % uri)
            LOG.error(_("fail to get instance[vm_id:%s] clusterinfo! resp.status_code:%d,%s")
                      % (vm_id,resp.status_code,cas_error.get_http_respond_error(resp)))
            raise cas_error.CasVmException()
    
    def _create_vm_rules(self, name, clusterId, drsType):
        clusterDrsRule = {'name':name,
                          'clusterId':clusterId,
                          'drsType':drsType}
        
        xmlstr = self._xml.encode_xml("create_vm_rules",**clusterDrsRule)
        uri = self._session.make_cmd_uri('/cluster/addVMHostRule')
        resp,body = self._session.call_method("POST",uri,body=xmlstr)
        if resp.status_code == 204:
            LOG.info(_("success to create clusterDrsRule:%s") % (clusterDrsRule))
        else:
            LOG.error(_("fail to create clusterDrsRule:%s! uri:%s,xmlstr:%s",) % (clusterDrsRule,uri,xmlstr))
            LOG.error(_("fail to create clusterDrsRule:%s resp.status_code:%d,%s")
                      % (clusterDrsRule,resp.status_code,cas_error.get_http_respond_error(resp)))
            raise cas_error.CasVmException()
    
    def _delete_vm_rules(self, ruleId):
        uricmd = "/cluster/deleteVMHostRule/%s" % ruleId
        uri = self._session.make_cmd_uri(uricmd)
        resp,body = self._session.call_method("DELETE",uri)
        if resp.status_code == 204:
            LOG.info(_("success to delete vm rule[ruleId:%s]") % (ruleId))
        else:
            LOG.error(_("fail to delete vm rule[ruleId:%s], uri:%s") % (ruleId,uri))
            LOG.error(_("fail to delete vm rule[ruleId:%s]! resp.status_code:%d,%s")
                      % (ruleId,resp.status_code,cas_error.get_http_respond_error(resp)))
            raise cas_error.CasVmException()
    
    def _edit_vm_rules(self, clusterDrsRule):
        xmlstr = self._xml.encode_xml("edit_vm_rules",**clusterDrsRule)
        uri = self._session.make_cmd_uri('/cluster/editVMHostRule')
        resp,body = self._session.call_method("PUT",uri,body=xmlstr)
        if resp.status_code == 204:
            LOG.info(_("success to edit  clusterDrsRule:%s") % (clusterDrsRule))
        else:
            LOG.error(_("fail to edit clusterDrsRule, uri:%s, xmlstr:%s",) % (uri,xmlstr))
            LOG.error(_("fail to edit clusterDrsRule, resp.status_code:%d,%s")
                      % (resp.status_code,cas_error.get_http_respond_error(resp)))
            raise cas_error.CasVmException()
    
    def _add_vm_to_rules(self,clusterDrsRule,vmList):
        clusterDrsRule['vmList'].append(vmList)
        self._edit_vm_rules(clusterDrsRule)
    
    def _delete_vm_from_rules(self,clusterDrsRule,vmList):
        clusterDrsRule['vmList'].remove(vmList)
        self._edit_vm_rules(clusterDrsRule)
    
    def _get_vm_rules(self,clusterId,name):
        uri = self._session.make_cmd_uri('/cluster/rules',clusterId=clusterId,name=name)
        LOG.info(_("_get_vm_rules:%s") % uri)
        resp,body = self._session.call_method("GET",uri)
        if resp.status_code == 200:
            clusterDrsRule = self._xml.decode_xml("instance_cas_vm_rule",body)
            LOG.info(_("success to get clusterDrsRule:%s") % (clusterDrsRule))
            return clusterDrsRule
        else:
            LOG.error(_("fail to get vm rule uri:%s",) % uri)
            LOG.error(_("fail to get vm rule,resp.status_code:%d,%s")
                      % (resp.status_code,cas_error.get_http_respond_error(resp)))
            raise cas_error.CasVmException()
    
    def _get_vm_instance_group(self,instance):
        try:
            _context = novacontext.get_admin_context()
            instance_group = InstanceGroup.get_by_instance_uuid(_context,instance['uuid'])
            return instance_group
        except exception.InstanceGroupNotFound:
            LOG.info(_("instance[%s] is not in any instance group") % instance['uuid'])
            return None
    
    def _check_map_vm_rules(self, instance):
        instance_group = self._get_vm_instance_group(instance)
        if instance_group is not None:
            if (instance_group.policies[0] == 'host-anti-affinity'  or instance_group.policies[0] == 'anti-affinity'):
                return True
            if (instance_group.policies[0] == 'host-affinity' or instance_group.policies[0] == 'affinity'):
                return True
        return False
    
    def _map_vm_rules(self, instance, vmInfo, instance_group=None):
        if not instance_group:
            instance_group = self._get_vm_instance_group(instance)
        if instance_group is not None:
            if (instance_group.policies[0] == 'host-anti-affinity'  or instance_group.policies[0] == 'anti-affinity'):
                LOG.info(_("ploicy:%s map to cas") % instance_group.policies[0])
                drsType = '2'
            elif (instance_group.policies[0] == 'host-affinity' or instance_group.policies[0] == 'affinity'):
                LOG.info(_("ploicy:%s map to cas") % instance_group.policies[0])
                drsType = '1'
            else:
                LOG.info(_("not support ploicy:%s map to cas") % instance_group.policies)
                return
            
            name = 'openstack_%s' % instance_group.uuid
            clusterinfo = self._get_vm_clusterinfo(vmInfo['id'])
            if not clusterinfo.has_key('clusterId'):
                LOG.error(_("get clusterId failed,instance uuid:%s") % (clusterinfo,instance['uuid']))
                return
            
            #note:in restapi of /cluster/rules,result in cvm histroy code,there is an spelling error
            #cluserId means clusterId
            vmList = {'cluserId':clusterinfo['clusterId'],'title':clusterinfo['title'],
                      'domainId':clusterinfo['id'],'domainName':clusterinfo['name']}
            
            sem_id = '%s_%s' % (clusterinfo['clusterId'], name)
            sem = self._semObj.get_obj_sem(sem_id)
            sem.acquire()
            try:
                clusterDrsRule = self._get_vm_rules(clusterinfo['clusterId'],name)
                if (clusterDrsRule.has_key('name') and clusterDrsRule['name'] == name
                    and clusterDrsRule.has_key('drsType') and clusterDrsRule['drsType'] == drsType):
                    LOG.info(_("just edit"))
                    self._add_vm_to_rules(clusterDrsRule,vmList)
                else:
                    LOG.info(_("create and edit"))
                    self._create_vm_rules(name,clusterinfo['clusterId'],drsType)
                    newclusterDrsRule = self._get_vm_rules(clusterinfo['clusterId'],name)
                    if (newclusterDrsRule.has_key('name') and newclusterDrsRule['name'] == name
                        and newclusterDrsRule.has_key('drsType') and newclusterDrsRule['drsType'] == drsType):
                        self._add_vm_to_rules(newclusterDrsRule,vmList)
            except Exception as exc:
                raise exc
            finally:
                sem.release()
                self._semObj.back_obj_sem(sem_id)
        else:
            LOG.info(_("instance[%s] do not need to map any rules to cas") % instance['uuid'])
    
    def _unmap_vm_rules(self,instance,vmInfo):
        instance_group = self._get_vm_instance_group(instance)
        if instance_group is not None:
            if (instance_group.policies[0] == 'host-anti-affinity' or instance_group.policies[0] == 'anti-affinity'):
                LOG.info(_("ploicy:%s map to cas") % instance_group.policies[0])
                drsType = '2'
            elif (instance_group.policies[0] == 'host-affinity' or instance_group.policies[0] == 'affinity'):
                LOG.info(_("ploicy:%s map to cas") % instance_group.policies[0])
                drsType = '1'
            else:
                LOG.info(_("not support ploicy:%s map to cas") % instance_group.policies)
                return
        
            name = 'openstack_%s' % instance_group.uuid
            clusterinfo = self._get_vm_clusterinfo(vmInfo['id'])
            if not clusterinfo.has_key('clusterId'):
                LOG.error(_("get clusterId failed,instance uuid:%s") % (clusterinfo,instance['uuid']))
                return
            
            #note:in restapi of /cluster/rules,result in cvm histroy code,there is an spelling error
            #cluserId means clusterId
            vmList = {'cluserId':clusterinfo['clusterId'],'title':clusterinfo['title'],
                      'domainId':clusterinfo['id'],'domainName':clusterinfo['name']}
            
            sem_id = '%s_%s' % (clusterinfo['clusterId'],name)
            sem = self._semObj.get_obj_sem(sem_id)
            sem.acquire()
            try:
                clusterDrsRule = self._get_vm_rules(clusterinfo['clusterId'],name)
                if (clusterDrsRule.has_key('name') and clusterDrsRule['name'] == name
                    and clusterDrsRule.has_key('drsType') and clusterDrsRule['drsType'] == drsType):
                    LOG.info(_("just edit"))
                    self._delete_vm_from_rules(clusterDrsRule,vmList)
                else:
                    LOG.info(_("rules not exist,do nothing!"))
            except Exception as exc:
                raise exc
            finally:
                sem.release()
                self._semObj.back_obj_sem(sem_id)
        else:
            LOG.info(_("instance[%s] do not need to _unmap_vm_rules to cas") % instance['uuid'])
    
    def _check_and_delete_rules(self,instance,clusterinfo):
        instance_group = self._get_vm_instance_group(instance)
        if instance_group is not None:
            if (instance_group.policies[0] == 'host-anti-affinity'  or instance_group.policies[0] == 'anti-affinity'):
                LOG.info(_("ploicy:%s delete from to cas") % instance_group.policies[0])
                drsType = '2'
            elif (instance_group.policies[0] == 'host-affinity' or instance_group.policies[0] == 'affinity'):
                LOG.info(_("ploicy:%s delete from cas") % instance_group.policies[0])
                drsType = '1'
            else:
                LOG.info(_("not support ploicy type:%s detete from cas") % instance_group.policies)
                return
        
            name = 'openstack_%s' % instance_group.uuid
            if not clusterinfo.has_key('clusterId'):
                LOG.error(_("get clusterId failed,instance uuid:%s") % (clusterinfo,instance['uuid']))
                return
            
            sem_id = '%s_%s' % (clusterinfo['clusterId'],name)
            sem = self._semObj.get_obj_sem(sem_id)
            sem.acquire()
            try:
                clusterDrsRule = self._get_vm_rules(clusterinfo['clusterId'],name)
                if (clusterDrsRule.has_key('name') and clusterDrsRule['name'] == name
                    and clusterDrsRule.has_key('drsType') and clusterDrsRule['drsType'] == drsType):
                    if len(clusterDrsRule['vmList']) == 0:
                        self._delete_vm_rules(clusterDrsRule['id'])
            except Exception as exc:
                raise exc
            finally:
                sem.release()
        
        else:
            LOG.info(_("instance[%s] do not need to delete any rules from cas") % instance['uuid'])
   
    def _get_flavor_quota_config(self,flavor, cfgmap):
        if flavor is None:
            LOG.error(_("the flavor(%s) is error.") % flavor)
            raise cas_error.CasVmException()
        try:
            conf = {}
            for key,value in flavor.get('extra_specs',{}).items():
                scope = key.split(':')
                if len(scope) > 1 and scope[0] == 'quota':
                    if scope[1] in cfgmap.keys():
                        cfgkey = cfgmap[scope[1]]
                        
                        if cfgkey is not None:
                            conf[cfgkey] = value
                        else:
                            LOG.info(_("the quota config item %s is not support now.") % scope[1])
            
            LOG.info(_("get quota config from flavor:%s") % conf)
            return conf
        except Exception:
            LOG.error(_("get quota config from flavor(%s) failed.") % flavor)
            raise cas_error.CasVmException()
    
    def _get_vif_bandwidth_config(self, flavor):
        cfgmap = {'vif_inbound_average':'inMaxRate','vif_inbound_peak':None,'vif_inbound_burst':'inMaxBurst',
                  'vif_outbound_average':'outMaxRate','vif_outbound_peak':None,'vif_outbound_burst':'outMaxBurst'}
        return self._get_flavor_quota_config(flavor,cfgmap)

    def _get_quota_mem_config(self,flavor):
        cfgmap = {'memory_reservation':'memoryBacking','memory_limit':'memoryLimit'}
        return self._get_flavor_quota_config(flavor,cfgmap)
    
    def _get_quota_disk_qos_config(self,flavor):
        cfgmap = {'disk_read_bytes_sec':'readBytesSec','disk_write_bytes_sec':'writeBytesSec',
                  'disk_read_iops_sec':'readIopsSec','disk_write_iops_sec':'writeIopsSec',}
        return self._get_flavor_quota_config(flavor,cfgmap)

    def _modify(self,instance,**modifyArgs):
        uri = self._session.make_cmd_uri('/vm/modify')
        xmlstr = self._xml.encode_xml("instance_modify",**modifyArgs)
        resp,body = self._session.call_method("PUT",uri,body=xmlstr)
        if resp.status_code != 200:
            LOG.error(_("fail to modify instance[uuid:%s,name:%s] uri:%s")
                      % (instance['uuid'],instance['name'],uri))
            LOG.error(_("fail to modify instance[uuid:%s,name:%s],resp.status_code:%d,%s")
                      % (instance['uuid'],instance['name'],resp.status_code,cas_error.get_http_respond_error(resp)))
            raise cas_error.CasVmException()
        else:
            msgId = self._xml.decode_xml("get_message_id",body)
            if msgId != '-1':
                task = self._session.wait_for_task(msgId)
                if task['result'] != 0:
                    LOG.error(_("fail to modify instance[uuid:%s,name:%s] uri:%s")
                              % (instance['uuid'],instance['name'],uri))
                    LOG.error(_("fail to modify instance[uuid:%s,name:%s],resp.status_code:%d,%s")
                              % (instance['uuid'],instance['name'],resp.status_code,
                                 cas_error.get_http_respond_error(resp)))
                    raise cas_error.CasVmException()
        
        LOG.info(_("success to modify instance[uuid:%s,name:%s].") % (instance['uuid'],instance['name']))


    def _set_disks_qos(self,instance,**disksQosArgs):
        uri = self._session.make_cmd_uri('/nova/vm/modifyDiskQos')
        xmlstr = self._xml.encode_xml("instance_set_disks_qos",**disksQosArgs)
        resp,body = self._session.call_method("PUT",uri,body=xmlstr)
        if resp.status_code != 200:
            LOG.error(_("fail to set disks qos instance[uuid:%s,name:%s] uri:%s")
                      % (instance['uuid'],instance['name'],uri))
            LOG.error(_("fail to set disks qos instance[uuid:%s,name:%s],resp.status_code:%d,%s")
                      % (instance['uuid'],instance['name'],resp.status_code,cas_error.get_http_respond_error(resp)))
            raise cas_error.CasVmException()
        else:
            taskMsgs = self._xml.decode_xml("get_disk_qos_result",body)
            if len(taskMsgs) > 0:
                for task_msg in taskMsgs:
                    result = task_msg['result']
                    completed = task_msg['completed']
                    if result != 0 or completed != 'true':
                        LOG.error(_("fail to set disks qos instance[uuid:%s,name:%s] uri:%s,taskMsgs:%s")
                                  % (instance['uuid'],instance['name'],uri,taskMsgs))
                        LOG.error(_("fail to set disks qos instance[uuid:%s,name:%s],resp.status_code:%d,%s")
                                  % (instance['uuid'],instance['name'],resp.status_code,
                                     cas_error.get_http_respond_error(resp)))
                        raise cas_error.CasVmException()
            else:
            
                LOG.error(_("fail to set disks qos instance[uuid:%s,name:%s] uri:%s,len(taskMsgs)=%s")
                          % (instance['uuid'],instance['name'],uri,len(taskMsgs)))
                LOG.error(_("fail to set disks qos instance[uuid:%s,name:%s],resp.status_code:%d,%s")
                          % (instance['uuid'],instance['name'],resp.status_code,
                             cas_error.get_http_respond_error(resp)))
                raise cas_error.CasVmException()
    
        LOG.info(_("success to set disks qos instance[uuid:%s,name:%s].") % (instance['uuid'],instance['name']))


    def _instance_set_bootfirmware_conf(self, instance, id, hw_firmware_type):
        '''
        modify bootfirmware
        '''
        if hw_firmware_type == 'bios':
            bootfirmware = 0
        elif hw_firmware_type == 'uefi':
            bootfirmware = 1
        else:
            LOG.error(_("firmwarw_type(%s) is error,use bios or uefi.") % hw_firmware_type)
            raise cas_error.CasVmException

        bootdevList = self._get_instance_bootDev(instance['uuid'], id)
        bootdevListstr = ','.join([item['name'] for item in bootdevList])
        modifyArgs = {'id': id, 'name': instance['name'], 'bootDev': {'bootFirmware': bootfirmware, 'bootdevs':bootdevListstr}}
        self._modify(instance, **modifyArgs)

    def _instance_set_mem_conf(self,instance,id,name,conf):
        try:
            memoryBacking = int(conf.get('memoryBacking',0))
            memoryLimit = int(conf.get('memoryLimit',0))
            size = int (instance['memory_mb'])
        except Exception:
            LOG.error(_("the memoryBacking(%s) is invalid.") % conf.get('memoryBacking',0))
            LOG.error(_("or the memoryLimit(%s) is invalid.") % conf.get('memoryLimit',0))
            LOG.error(_("or the mem size(%s) is invalid.") % instance['memory_mb'])
            raise cas_error.CasVmException()
        
        if memoryBacking < 0 or memoryBacking > 100:
            LOG.error(_("the memoryBacking(%s) is invalid.") % memoryBacking)
            raise cas_error.CasVmException()
        
        if memoryLimit < 0:
            LOG.error(_("the memoryLimit(%s) is invalid.") % memoryLimit)
            raise cas_error.CasVmException()
        
        if  memoryBacking == 100:
            if memoryLimit != 0:
                LOG.error(_("the memoryLimit(%s) is invalid.while memory_reservation:%s") %
                           (memoryLimit,memoryBacking))
                raise cas_error.CasVmException()
        else:
            memoryLimitMin = (size * memoryBacking / 100)
            memoryLimitMax = size
            if (memoryLimit < memoryLimitMin or memoryLimit > memoryLimitMax):
                LOG.error(_("Invalid memoryLimit(%s), e.g:[%s,%s]") % (memoryLimit, memoryLimitMin, memoryLimitMax))
                raise cas_error.CasVmException()
        
        modifyArgs = {'id':id,'name':name, 'memory':{'size':size,'memoryBacking':memoryBacking}}
        if  memoryLimit > 0:
            modifyArgs['memory']['memoryLimit'] = memoryLimit
            modifyArgs['memory']['memoryLimitUnit'] = 'MB'
        
        self._modify(instance,**modifyArgs)

    def _instance_disk_qos_conf_check(self,instance,id,name,conf):
        try:
            readBytesSec = int(conf.get('readBytesSec',0)) / units.Ki
            writeBytesSec = int(conf.get('writeBytesSec',0)) / units.Ki
            readIopsSec = int(conf.get('readIopsSec',0))
            writeIopsSec = int(conf.get('writeIopsSec',0))
        except Exception:
            LOG.error(_("the readBytesSec(%s) is invalid.") % conf.get('readBytesSec',0))
            LOG.error(_("or the writeBytesSec(%s) is invalid.") % conf.get('writeBytesSec',0))
            LOG.error(_("or the readIopsSec(%s) is invalid.") % conf.get('readIopsSec',0))
            LOG.error(_("or the writeIopsSec(%s) is invalid.") % conf.get('writeIopsSec',0))
            raise cas_error.CasVmException()
        
        if (readBytesSec != 0 and (readBytesSec < QOS_MIN or readBytesSec > QOS_MAX)):
            LOG.error(_("the readBytesSec(%s) is invalid.") % readBytesSec)
            raise cas_error.CasVmException()
        
        if (writeBytesSec != 0 and (writeBytesSec < QOS_MIN or writeBytesSec > QOS_MAX)):
            LOG.error(_("the writeBytesSec(%s) is invalid.") % writeBytesSec)
            raise cas_error.CasVmException()
        
        if (readIopsSec != 0 and (readIopsSec < QOS_MIN or readIopsSec > QOS_MAX)):
            LOG.error(_("the readIopsSec(%s) is invalid.") % readIopsSec)
            raise cas_error.CasVmException()
        
        if (writeIopsSec != 0 and (writeIopsSec < QOS_MIN or writeIopsSec > QOS_MAX)):
            LOG.error(_("the writeIopsSec(%s) is invalid.") % writeIopsSec)
            raise cas_error.CasVmException()
        
        return readBytesSec,writeBytesSec,readIopsSec,writeIopsSec
    
    def _instance_set_root_disks_qos(self,instance,id,name,conf):
        readBytesSec,writeBytesSec,readIopsSec,writeIopsSec = self._instance_disk_qos_conf_check(instance,id,name,conf)
        if readBytesSec > 0 or writeBytesSec > 0 or readIopsSec > 0 or writeIopsSec > 0:
            vmInfo = self._get_instance_info(instance['uuid'])
            if vmInfo is None:
                LOG.error(_("instance[uuid:%s] doesn't exist on the CAS!") % instance['uuid'])
                raise exception.InstanceNotFound(instance_id=instance['uuid'])
            else:
                disks = self._get_instance_detail(instance['uuid'],vmInfo['id'],'disk_allinfo')

            disk_bus = instance['system_metadata'].get('sys_disk_bus','virtio')
            if instance['image_ref']:
                root_device = {'virtio':'vda','scsi':'sda','ide':'hda'}[disk_bus]
            
            storages = []
            for disk in disks:
                vdisk = {}
                if disk['deviceName'] == root_device:
                    vdisk['device'] = disk['deviceName']
                    vdisk['format'] = disk['format']
                    vdisk['size'] = disk['size']
                    vdisk['cacheType'] = disk['cacheType']
                    if readBytesSec > 0:
                        vdisk['readBytesSec'] = readBytesSec
                    if writeBytesSec > 0:
                        vdisk['writeBytesSec'] = writeBytesSec
                    if readIopsSec > 0:
                        vdisk['readIopsSec'] = readIopsSec
                    if writeIopsSec > 0:
                        vdisk['writeIopsSec'] = writeIopsSec
                    storages.append(vdisk)
            
            if len(storages) > 0:
                disksQosArgs = {'id':id,'name':name,'storage':storages}
                self._set_disks_qos(instance,**disksQosArgs)
    
    def _instance_set_all_disks_qos(self,instance,id,name,conf):
        readBytesSec,writeBytesSec,readIopsSec,writeIopsSec = self._instance_disk_qos_conf_check(instance,id,name,conf)
        if readBytesSec > 0 or writeBytesSec > 0 or readIopsSec > 0 or  writeIopsSec > 0:
            vmInfo = self._get_instance_info(instance['uuid'])
            if vmInfo is None:
                LOG.error(_("instance[uuid:%s] doesn't exist on the CAS!") % instance['uuid'])
                raise exception.InstanceNotFound(instance_id=instance['uuid'])
            else:
                disks = self._get_instance_detail(instance['uuid'],vmInfo['id'],'disk_allinfo')
            
            storages = []
            for disk in disks:
                vdisk = {}
                vdisk['device'] = disk['deviceName']
                vdisk['format'] = disk['format']
                vdisk['size'] = disk['size']
                vdisk['cacheType'] = disk['cacheType']
                if readBytesSec > 0:
                    vdisk['readBytesSec'] = readBytesSec
                if writeBytesSec > 0:
                    vdisk['writeBytesSec'] = writeBytesSec
                if readIopsSec > 0:
                    vdisk['readIopsSec'] = readIopsSec
                if writeIopsSec > 0:
                    vdisk['writeIopsSec'] = writeIopsSec
                storages.append(vdisk)
            
            if len(storages) > 0:
                disksQosArgs = {'id':id, 'name':name, 'storage':storages}
                self._set_disks_qos(instance,**disksQosArgs)

    def __update_instance_task_state(self, instance, task_state):
        instance.task_state = task_state
        instance.save()

    def _check_and_deal_protect_group(self, uuid, meta, type):
        if meta is None:
            LOG.info(_("the vm %s meta is None.") % uuid)
            return

        srmGroupName = meta.get('srmGroupName',None)
        if srmGroupName is None:
            LOG.info(_("the vm %s srmGroupName is None.") % uuid)
            return

        protect_group_para = {'uuid':uuid,'srmGroupName':srmGroupName}

        xmlstr = self._xml.encode_xml("vm_protect_group",**protect_group_para)
        if "JOIN" == type:
            uri = self._session.make_cmd_uri('/nova/protectGroup/domain/add')
        elif "DELETE" == type:
            uri = self._session.make_cmd_uri('/nova/protectGroup/domain/delete')
        else:
            LOG.warning(_("instance uuid:%s ,protect group event type(%s) is invalid,do nothing") % (uuid,type))
            return
        resp,body = self._session.call_method("PUT",uri,body=xmlstr)
        if resp.status_code == 200:
            LOG.info(_("success to join vm to protect group,para:%s") % (protect_group_para))
            return
        else:
            LOG.error(_("fail to to join vm to protect group,uri:%s,xmlstr:%s",) % (uri,xmlstr))
            LOG.error(_("fail to to join vm to protect group,para:%s,resp.status_code:%d,%s")
                      % (protect_group_para,resp.status_code,cas_error.get_http_respond_error(resp)))
            raise cas_error.CasVmException()

    def spawn(self, context, instance, image_meta, injected_files,
              admin_password, network_info, block_devices, recreate):
        """
        Creates a VM instance.
        
        Steps followed are:
        
        1. create image if need
        2. create xml string
        3. request CVM to build VM
        4. request CVM to config VM
        5. Power on the VM.
        """
        exist = self.check_instance_exist(instance['uuid'])
        vm_taskstats = instance.task_state
        if not exist:
            instance_type = instance['metadata'].get('instance_type')
            if recreate and instance.node not in self._host._nodes:
                default_node = self._host.get_host_first_nodename()
            else:
                default_node = instance.node
            
            default_disk_bus = self._host.get_platform_para(default_node,'default_disk_bus')
            if instance_type == 'bare':
                LOG.info(_("instance type of instance[%s] is bare, create instance without disk!") % instance['uuid'])
                
                net_model = 'virtio'
                disk_bus =  default_disk_bus
                net_queues = None
                imageMeta = {}
            else:
                image_id = instance['image_ref']
                if not image_id:
                    image_id = self._volumeops.get_root_volume_image(context,instance['root_device_name'],block_devices['block_device_mapping'])
                imageMeta = self._imageops.get_image_meta_props(context,image_id,instance)
                
                net_model = self._imageops.get_image_net_model(imageMeta)
                disk_bus = instance['system_metadata'].get('sys_disk_bus')
                if not disk_bus:
                    disk_bus = self._imageops.get_image_disk_bus(imageMeta,default_disk_bus)
                    instance['system_metadata']['sys_disk_bus'] = disk_bus
                
                LOG.info(_("instance[%s]---image_id:%s, disk_bus:%s, net_model:%s") % (instance['uuid'],image_id,disk_bus,net_model))
                
                self._imageops.check_image_type(imageMeta)
                if instance['image_ref'] and not recreate:
                    sem = self._semObj.get_obj_sem(image_id)
                    sem.acquire()
                    try:
                        self.__update_instance_task_state(instance, 'casplugin_vm_prepare_image')
                        self._imageops.prepare_image_file_checksum(context,CONF.cas.glance_host,CONF.cas.glance_port,imageMeta)
                    except Exception as exc:
                        raise exc
                    finally:
                        sem.release()
                        self._semObj.back_obj_sem(image_id)

            bindIp = instance['metadata'].get('bindIp',self._bindIp) == 'true'
            net_queues = self._get_interface_multiqueues(instance, imageMeta)
            network_args = self._network.network_interface_info(network_info,net_model,net_queues,bindIp)
            
            domain_args = self._get_deploy_parameter(instance,network_args['base_info'],disk_bus,imageMeta,recreate)
            enableAdminPass = instance['metadata'].get('enableAdminPass','1') == '1'
            full_initalization = (imageMeta['properties'].get("full_initalization",'0') == '1'
                                  or instance['metadata'].get('full_initalization','0') == '1')
            if full_initalization:
                config_args = self._config_vm(instance,None,instance['metadata'],admin_password,network_args['vif_info'],imageMeta,enableAdminPass,recreate)
                domain_args['config_args'] = config_args
                domain_args['full_initalization'] = 'true'

            srmGroupName =instance['metadata'].get('srmGroupName',None)
            if srmGroupName:
                domain_args['srmGroupName'] = srmGroupName
                domain_args['useLocal'] = 'false'

            self.__update_instance_task_state(instance, 'casplugin_vm_deploy_ing')
            vm_id,need_sync = self._deploy(instance,**domain_args)
            vmInfo = self._get_instance_info(instance['uuid'])
            if need_sync:
                self._host.sync_instance_host_node(instance,vmInfo['hostId'])
            
            if instance_type != 'bare':
                if recreate and instance['image_ref']:
                    imageFile = self._imageops.find_image_in_share_storage(instance['uuid'])
                    deviceName = {'virtio':'/dev/vda','scsi':'/dev/sda','ide':'/dev/hda','virtioScsi':'/dev/sda'}[disk_bus]
                    device_info = {'type':'disk','targetBus':disk_bus,'deviceName':deviceName,'path':imageFile}
                    self.__update_instance_task_state(instance, 'casplugin_vm_attach_image')
                    self._imageops.attach_device(instance,vm_id,device_info)
                self.__update_instance_task_state(instance, 'casplugin_vm_attach_block')
                self._attach_block_devices(instance,vm_id,vmInfo['hostName'],block_devices,disk_bus,recreate)
                self.__update_instance_task_state(instance, 'casplugin_vm_config_vm')
                self._config_vm(instance,vm_id,instance['metadata'],admin_password,network_args['vif_info'],imageMeta,enableAdminPass,recreate)
            self.__update_instance_task_state(instance, 'casplugin_vm_config_drive')
            self._config_drive(instance,vm_id,injected_files,network_info,admin_password,disk_bus,enableAdminPass)
            
            if CONF.cas.useVirtualCDROM:
                self.__update_instance_task_state(instance, 'casplugin_vm_attach_cdrom')
                default_cdrom_bus = self._host.get_platform_para(default_node,'default_cdrom_bus')
                device_info = {'type':'cdrom','targetBus':default_cdrom_bus}
                self._imageops.attach_device(instance,vm_id,device_info)

            if len(network_info):
                self.__update_instance_task_state(instance, 'casplugin_vm_update_vif_policy')
                for vif in network_info:
                    self._network.update_vif_name(vif,instance['uuid'])
                    self._network.update_vif_policy(vif,vmInfo['hostName'])

            bandwidth_conf = self._get_vif_bandwidth_config(instance.flavor)
            if bandwidth_conf:
                self.__update_instance_task_state(instance, 'casplugin_vm_update_interface_qos')
                for vif in network_info:
                    self._network.update_interface_qos(vm_id,vif,bandwidth_conf)

            self._add_vm_console(instance,vm_id)
            disk_io_conf = self._get_quota_disk_qos_config(instance.flavor)
            if disk_io_conf:
                self._instance_set_root_disks_qos(instance, vmInfo['id'], instance['name'],disk_io_conf)
            
            if CONF.cas.affinity_rules_map2cas:
                self._map_vm_rules(instance,vmInfo)

            hw_firmware_type = imageMeta['properties'].get("hw_firmware_type", None)
            if hw_firmware_type:
                self._instance_set_bootfirmware_conf(instance, vmInfo['id'], hw_firmware_type)
                LOG.info(_("The firmware type is %s ") % hw_firmware_type)


            self._check_and_deal_protect_group(instance['uuid'], instance['metadata'], JOIN_PROJECT_GROUP)

            self._deal_vlan_trunk_when_spawn(vm_id, instance, network_info)

            if instance_type != 'bare':
                power_on_vm = instance['metadata'].get('power_on_vm','1')
                if power_on_vm == '1':
                    self.__update_instance_task_state(instance, 'casplugin_vm_power_on')
                    self.power_on(instance, vm_id)
            
            instance['system_metadata']['guestOS'] = domain_args['osVersion']
        else:
            vmInfo = self._get_instance_info(instance['uuid'])
            for vif in network_info:
                self._network.change_vif_name(vmInfo['id'],vif)
                self._network.update_vif_name(vif,instance['uuid'])
                self._network.update_vif_policy(vif,vmInfo['hostName'])
            
            self._vm_manage(instance['uuid'],'1')
            if CONF.cas.affinity_rules_map2cas:
                self._map_vm_rules(instance,vmInfo)
        self.__update_instance_task_state(instance, 'casplugin_vm_end')
        self.__update_instance_task_state(instance, vm_taskstats)

    def _get_vlan_trunks(self, instance_uuid, vlan_trunks):
        if vlan_trunks:
            try:
                return jsonutils.loads(vlan_trunks)
            except Exception:
                LOG.error("Serialized vlan_trunks value '%(value)s' "
                          "for instance %(instance)s is invalid",
                          {'value': vlan_trunks,
                           'instance': instance_uuid})
        return {}

    def _deal_vlan_trunk_when_spawn(self, vm_id, instance, network_info):
        vlan_trunks_json = instance['metadata'].get('vlanTrunks')
        if vlan_trunks_json:
            vlan_trunks = self._get_vlan_trunks(instance['uuid'], vlan_trunks_json)
            for vlan_trunk in vlan_trunks:
                if vlan_trunk:
                    vlan_trunk_mac = None
                    if 'netUuid' in vlan_trunk:
                        for index in range(0, len(network_info)):
                            vif = network_info[index]
                            if vlan_trunk['netUuid'] == vif['network']['id']:
                                vlan_trunk_mac = vif['address']
                    rule = None
                    if vlan_trunk_mac is not None and 'rule' in vlan_trunk:
                        rule = vlan_trunk['rule']

                    if rule is None:
                        LOG.error(_("Get vlan trunk rules of Network[%s] failed!") % vlan_trunk['netUuid'])
                        continue

                    if 'name' in vlan_trunk:
                        vlan_trunk_name = 'openstack-' + vlan_trunk['name']
                    else:
                        vlan_trunk_name = 'openstack-' + instance['uuid'] + vlan_trunk_mac.replace(":", "")

                    vlantrunk = self._get_vlantrunk(vlan_trunk_name)
                    if vlantrunk is None:
                        vlan_trunk = {'title': vlan_trunk_name, 'rule': rule}
                        self._create_vlantrunk(vlan_trunk)
                    else:
                        # 是否更新规则
                        if 'action' in vlan_trunk and vlan_trunk['action'] == 'Add' and vlantrunk['rule']:
                            set_of_tuples = set(tuple(sorted(d.items())) for d in vlantrunk['rule'] + rule)
                            new_rule = [dict(t) for t in set_of_tuples]
                        elif 'action' in vlan_trunk and vlan_trunk['action'] == 'Remove' and vlantrunk['rule']:
                            for index in range(0, len(rule)):
                                new_rule = {d for d in vlantrunk['rule'] if d['vmVlan'] != rule[index]['vmVlan']}
                        vlantrunk['rule'] = new_rule
                        self._update_vlantrunk(vlantrunk)

                    policy_args = {'mac': vlan_trunk_mac, 'vlanTrunkName': vlan_trunk_name}
                    self._config_vlantrunk(vlan_trunk_mac, vm_id, policy_args)

    def _update_vlantrunk(self, vlantrunk):
        uri = self._session.make_cmd_uri('/vlanTrunk')
        xmlstr = self._xml.encode_xml("update_vlantrunk", **vlantrunk)
        resp, body = self._session.call_method('PUT', uri, body=xmlstr)
        if resp.status_code != 204:
            LOG.error(_("update vlantrunk policy failed, uri:%s, xmlstr:%s") % (uri, xmlstr))
            LOG.error(_("update vlantrunk policy failed, resp.status_code:%d,%s")
                      % (resp.status_code, cas_error.get_http_respond_error(resp)))
            raise cas_error.CasNetworkException()

    def _create_vlantrunk(self, vlan_trunk):
        uri = self._session.make_cmd_uri('/vlanTrunk')
        xmlstr = self._xml.encode_xml("update_vlantrunk", **vlan_trunk)
        resp, body = self._session.call_method('POST', uri, body=xmlstr)
        if resp.status_code != 200:
            LOG.error(_("update vlan_trunk policy failed, uri:%s, xmlstr:%s") % (uri, xmlstr))
            LOG.error(_("update vlan_trunk policy failed, resp.status_code:%d,%s")
                      % (resp.status_code, cas_error.get_http_respond_error(resp)))
            raise cas_error.CasNetworkException()
        return int(body)

    def _config_vlantrunk(self, mac, vm_id, policy_args):
        xmlstr = self._xml.encode_xml("config_vlantrunk", id=vm_id, interface=policy_args)
        uri = self._session.make_cmd_uri('/nova/vm/configVlanTrunk')
        resp, body = self._session.call_method("PUT", uri, body=xmlstr)
        if resp.status_code == 200:
            msgId = self._xml.decode_xml("get_message_id", body)
            try:
                task = self._session.wait_for_task(msgId)
            except Exception:
                LOG.error(
                    _("exception happened when config vm mac[%s] vlan trunk. msgId:%s uri:%s, xmlstr:%s") % (
                        mac, msgId, uri, xmlstr))
                raise cas_error.CasVmException()
            if task['result'] != 0:
                LOG.error(_("fail to config vlan trunk. uri:%s, xmlstr:%s") % (uri, xmlstr))
                LOG.error(_("fail to config vlan trunk. failMsg:%s") % task['failMsg'])
                raise cas_error.CasVmException()
        else:
            LOG.error(_("fail to config vlan trunk uri:%s, xmlstr:%s") % (uri, xmlstr))
            LOG.error(_("fail to config vlan trunk resp.status_code:%d,%s") % (
                resp.status_code, cas_error.get_http_respond_error(resp)))
            raise cas_error.CasVmException()

    def _get_vlantrunk(self, vlan_trunk_name):
        uri = self._session.make_cmd_uri('/vlanTrunk', name=vlan_trunk_name)
        resp, body = self._session.call_method("GET", uri)
        if resp.status_code == 200:
            vlantrunk = self._xml.decode_xml("get_vlantrunk", body)
        else:
            LOG.error(_("fail to get vlan trunk [name:%s] info! uri:%s") % (vlan_trunk_name, uri))
            LOG.error(_("fail to get vlan trunk [name:%s] info! resp.status_code:%d,%s")
                      % (vlan_trunk_name, resp.status_code, cas_error.get_http_respond_error(resp)))
            raise cas_error.CasVmException()
        return vlantrunk

    def _query_vlantrunk_id(self, vlan_trunk_name):
        vlantrunk = self._get_vlantrunk(vlan_trunk_name)
        if vlantrunk is not None and vlantrunk.has_key('id'):
            return vlantrunk['id']
        else:
            return None

    def _delete_vlantrunk(self, vlan_trunk_id):
        uri = self._session.make_cmd_uri('/vlanTrunk', id=vlan_trunk_id)
        resp, body = self._session.call_method('DELETE', uri)
        if resp.status_code != 204:
            LOG.error(_("delete vlanTrunk policy[id:%s] failed, uri:%s") % (vlan_trunk_id, uri))
            LOG.error(_("delete vlanTrunk policy[id:%s] failed,resp.status_code:%d,%s")
                      % (vlan_trunk_id, resp.status_code, cas_error.get_http_respond_error(resp)))
            raise cas_error.CasNetworkException()


    def plug_vifs(self, instance, network_info):
        """Plug VIFs into networks."""
        pass
    
    def unplug_vifs(self, instance, network_info):
        """Unplug VIFs from networks."""
        pass
    
    def power_on(self, instance, vmId=None):
        """Power on the specified instance."""
        vm_id = vmId or self._get_instance_info(instance['uuid'])['id']
        
        uri = self._session.make_cmd_uri('/vm/start',vm_id)
        resp,body = self._session.call_method("PUT",uri)
        if resp.status_code == 200:
            msgId = self._xml.decode_xml("get_message_id",body)
            task = self._session.wait_for_task(msgId)
            if task['result'] == 0:
                LOG.debug(_("Powered on the VM"), instance=instance)
                
                # wkf7987: update
                if (instance['flavor'].get('extra_specs').get('gpu') or instance['flavor'].get('extra_specs').get('vgpu')):
                    uuid = instance['uuid']
                    pci_uri = self._session.make_cmd_uri('/vm/pci', uuid)
                    pci_resp, pci_body = self._session.call_method("get", pci_uri)
                    if pci_resp.status_code == 200:
                        pci_map = self._xml.decode_xml("get_pci_vpci_map", pci_body)
                        pci_list = []
                        for k in pci_map:
                            pci_list.append(k)
                        if len(pci_list) > 0:
                            str_pci_list = str(pci_list).replace("\'", "")
                            instance.metadata['pci_list'] = str_pci_list
                            instance.save()
                
                if instance['metadata'].get('protectMode','0') == '1':
                    self._wait_set_protect(instance,vm_id)
                
            else:
                vmStatus = task['vmStatus'] if task.has_key('vmStatus') else None
                if (vmStatus is not None and CAS_POWER_STATES[vmStatus] == power_state.RUNNING):
                    return
                
                LOG.error(_("fail to power on instance[uuid:%s,name:%s] uri:%s")
                         % (instance['uuid'],instance['name'],uri))
                LOG.error(_("fail to power on instance[uuid:%s,name:%s],failMsg:%s")
                           % (instance["uuid"],instance['name'],task['failMsg']))
                raise exception.InstancePowerOnFailure(reason=_("see error log message to get detailed information!"))
        else:
            LOG.error(_("fail to power on instance[uuid:%s,name:%s] uri:%s")
                     % (instance['uuid'],instance['name'],uri))
            LOG.error(_("fail to power on instance[uuid:%s,name:%s],resp.status_code:%d,%s")
                       % (instance['uuid'],instance['name'],resp.status_code,cas_error.get_http_respond_error(resp)))
            raise exception.InstancePowerOnFailure(reason=_("see error log message to get detailed information!"))
    
    def get_vnc_console(self, instance):
        """Return connection info for a vnc console."""
        vm_id = self._get_instance_info(instance['uuid'])['id']
        uri = self._session.make_cmd_uri('/vmvnc/vnc',vm_id)
        resp,body = self._session.call_method("GET",uri)
        if resp.status_code == 200:
            vnc_info = self._xml.decode_xml("get_vnc_console",body)
            return ctype.ConsoleVNC(host=vnc_info["ip"], port=vnc_info["port"])
        else:
            LOG.error(_("fail to get vnc instance[uuid:%s,name:%s] uri:%s")
                     % (instance['uuid'],instance['name'],uri))
            LOG.error(_("fail to get vnc instance[uuid:%s,name:%s],resp.status_code:%d,%s")
                     % (instance['uuid'],instance['name'],resp.status_code,cas_error.get_http_respond_error(resp)))
            raise cas_error.CasVmException()
    
    def get_console_output(self, instance):
        vm_id = self._get_instance_info(instance['uuid'])['id']
        uri = self._session.make_cmd_uri('/nova/consoleLog',id=vm_id,length=str(MAX_CONSOLE_BYTES))
        resp,body = self._session.call_method("GET",uri)
        if resp.status_code == 200:
            return body or ""
        else:
            LOG.error(_("fail to get console output of instance[uuid:%s,name:%s] uri:%s")
                     % (instance['uuid'],instance['name'],uri))
            LOG.error(_("fail to get console output of instance[uuid:%s,name:%s],resp.status_code:%d,%s")
                     % (instance['uuid'],instance['name'],resp.status_code,cas_error.get_http_respond_error(resp)))
            raise cas_error.CasVmException()

    def _power_off_force_for_destroy(self,instance,vmId=None):
        """Power off the specified instance for destroy"""
        vm_id = vmId or self._get_instance_info(instance['uuid'])['id']
        
        uri = self._session.make_cmd_uri('/vm/powerOff',vm_id)
        resp,body = self._session.call_method("PUT",uri)
        LOG.debug(_("Powered off the VM"),resp)
        if resp.status_code == 200:
            msgId = self._xml.decode_xml("get_message_id",body)
            task = self._session.wait_for_task(msgId)
            if task['result'] == 0:
                LOG.info(_("force power off the VM OK"),instance=instance)
            else:
                vmStatus = task['vmStatus'] if task.has_key('vmStatus') else None
                if (vmStatus is not None and CAS_POWER_STATES[vmStatus] == power_state.SHUTDOWN):
                    LOG.info(_("instance[uuid:%s,name:%s] is already in powered off state")
                             % (instance['uuid'],instance['name']))
                    return
                LOG.error(_("instance[uuid:%s] step into state:%s")% (instance['uuid'],vmStatus))
                LOG.error(_("fail to power off instance[uuid:%s,name:%s] uri:%s")
                          % (instance['uuid'],instance['name'],uri))
                LOG.error(_("fail to power off instance[uuid:%s,name:%s],failMsg:%s")
                          % (instance["uuid"],instance['name'],task['failMsg']))
                raise exception.InstancePowerOffFailure(reason=_("see error log message to get detailed information!"))
        else:
            instance_info = self.get_info(instance,vm_id,isDb='false')
            if instance_info.state == power_state.SHUTDOWN:
                LOG.info(_("instance[uuid:%s,name:%s] is already in powered off state")
                         % (instance['uuid'],instance['name']))
                return
            LOG.error(_("instance[uuid:%s] step into state:%s") % (instance['uuid'],instance_info.state))
            LOG.error(_("fail to power off instance[uuid:%s,name:%s] uri:%s")
                      % (instance['uuid'],instance['name'],uri))
            LOG.error(_("fail to power off instance[uuid:%s,name:%s],resp.status_code:%d,%s")
                      % (instance['uuid'],instance['name'],resp.status_code,cas_error.get_http_respond_error(resp)))
            raise exception.InstancePowerOffFailure(reason=_("see error log message to get detailed information!"))

    def destroy(self, context, instance, network_info, block_device_mapping, recreate, destroy_type,wipe_volume=False):
        """destroy the specified instance.
           if instance's task_state is resize_reverting,
           nothing will be done"""
        
        nodename = None if recreate else instance['node']
        
        try:
            vmInfo = self._get_instance_info(instance['uuid'])
            need_map = self._check_map_vm_rules(instance)
            if CONF.cas.affinity_rules_map2cas and need_map:
                clusterinfo = self._get_vm_clusterinfo(vmInfo['id'])
            self._check_and_deal_protect_group(instance['uuid'], instance['metadata'], DELETE_PROJECT_GROUP)
        except exception.InstanceNotFound:
            for mapping_info in block_device_mapping:
                connection_info = mapping_info['connection_info']
                self._volumeops.detach_lun_device_from_cluster(connection_info,nodename)
        else:
            try:
                self._power_off_force_for_destroy(instance,vmInfo['id'])
            except exception.InstancePowerOffFailure:
                LOG.error(_("force instance[uuid:%s] to power off for destroy failed"),instance['uuid'])
                raise exception.InstanceTerminationFailure(reason=_("force instance to power off for destroy failed !"))
            else:
                LOG.info(_("force instance[uuid:%s] to power off for destroy sucessed"),instance['uuid'])
                
            for mapping_info in block_device_mapping:
                connection_info = mapping_info['connection_info']
                mountpoint = mapping_info['mount_device']
                self._volumeops.detach_volume(connection_info,instance,vmInfo['id'],mountpoint)
                self._volumeops.detach_lun_device_from_cluster(connection_info,nodename)
            if wipe_volume and destroy_type == '1':
                uri = self._session.make_cmd_uri('/vm/deleteVmForce',id=vmInfo['id'],type=destroy_type,
                                                  force='true',isWipeVolume='true')
            else:
                uri = self._session.make_cmd_uri('/vm/deleteVmForce',id=vmInfo['id'],type=destroy_type,force='true')
            resp,body = self._session.call_method("DELETE",uri)
            if resp.status_code == 200:
                task = self._xml.decode_xml("wait_for_task",body)
                if task['completed'] != 'true':
                    msgId = self._xml.decode_xml("get_message_id",body)
                    task = self._session.wait_for_task(msgId)
                if task['result'] != 0:
                    LOG.error(_("fail to destroy instance[uuid:%s,name:%s] uri:%s") 
                             % (instance['uuid'],instance['name'],uri))
                    LOG.error(_("fail to destroy instance[uuid:%s,name:%s],failMsg:%s")
                               % (instance['uuid'],instance['name'],task['failMsg']))
                    raise exception.InstanceTerminationFailure(reason=_("see error log message to get detailed information!"))
                if CONF.cas.affinity_rules_map2cas and need_map:
                    self._check_and_delete_rules(instance,clusterinfo)
                LOG.debug(_("Delete the VM"),instance=instance)
            else:
                LOG.error(_("fail to destroy instance[uuid:%s,name:%s] uri:%s") 
                         % (instance['uuid'],instance['name'],uri))
                LOG.error(_("fail to destroy instance[uuid:%s,name:%s],resp.status_code:%d,%s")
                           % (instance['uuid'],instance['name'],resp.status_code,cas_error.get_http_respond_error(resp)))
                raise exception.InstanceTerminationFailure(reason=_("see error log message to get detailed information!"))

        self._deal_vlan_trunk_when_destroy(instance, network_info)

    def _deal_vlan_trunk_when_destroy(self, instance, network_info):
        vlan_trunks_json = instance['metadata'].get('vlanTrunks')
        if vlan_trunks_json:
            vlan_trunks = self._get_vlan_trunks(instance['uuid'], vlan_trunks_json)
            for vlan_trunk in vlan_trunks:
                if 'name' in vlan_trunk:
                    vlan_trunk_name = vlan_trunk['name']
                else:
                    vlan_trunk_mac = None
                    if 'netUuid' in vlan_trunk:
                        for index in range(0, len(network_info)):
                            vif = network_info[index]
                            if vlan_trunk['netUuid'] == vif['network']['id']:
                                vlan_trunk_mac = vif['address']
                    if vlan_trunk_mac is not None:
                        vlan_trunk_name = 'openstack-' + instance['uuid'] + vlan_trunk_mac.replace(":", "")
                    else:
                        continue
                vlantrunk = self._get_vlantrunk(vlan_trunk_name)
                if vlantrunk and 'vmTotal' in vlantrunk and vlantrunk['vmTotal'] == 0:
                    self._delete_vlantrunk(str(vlantrunk['id']))

    def power_off(self, instance, vmId=None, force=False):
        """Power off the specified instance."""
        vm_id = vmId or self._get_instance_info(instance['uuid'])['id']
        
        if not force:
            uri = self._session.make_cmd_uri('/vm/stop',vm_id)
            resp,body = self._session.call_method("PUT",uri)
            if resp.status_code == 200:
                msgId = self._xml.decode_xml("get_message_id",body)
                task = self._session.wait_for_task(msgId)
                if task['result'] == 0:
                    LOG.debug(_("Stop the VM"), instance=instance)
                else:
                    vmStatus = task['vmStatus'] if task.has_key('vmStatus') else None
                    if (vmStatus is not None and CAS_POWER_STATES[vmStatus] == power_state.SHUTDOWN):
                        LOG.info(_("instance[uuid:%s,name:%s] is already in powered off state")
                                 % (instance['uuid'],instance['name']))
                        return
                    LOG.error(_("fail to stop instance[uuid:%s,name:%s] uri:%s")
                             % (instance['uuid'],instance['name'],uri))
                    LOG.error(_("fail to stop instance[uuid:%s,name:%s],failMsg:%s")
                               % (instance["uuid"],instance['name'],task['failMsg']))
                    raise exception.InstancePowerOffFailure(reason=_("see error log message to get detailed information!"))
            else:
                instance_info = self.get_info(instance,vm_id,isDb='false')
                if instance_info.state == power_state.SHUTDOWN:
                    LOG.info(_("instance[uuid:%s,name:%s] is already in powered off state")
                             % (instance['uuid'],instance['name']))
                    return
                LOG.error(_("fail to stop instance[uuid:%s,name:%s] uri:%s")
                         % (instance['uuid'],instance['name'],uri))
                LOG.error(_("fail to stop instance[uuid:%s,name:%s],resp.status_code:%d,%s")
                           % (instance['uuid'],instance['name'],resp.status_code,cas_error.get_http_respond_error(resp)))
                raise exception.InstancePowerOffFailure(reason=_("see error log message to get detailed information!"))
            
            check_times = 60
            while check_times > 0:
                time.sleep(1)
                instance_info = self.get_info(instance,vm_id,isDb='false')
                if instance_info.state == power_state.SHUTDOWN:
                    LOG.info(_("success to stop instance[uuid:%s,name:%s]")
                         % (instance['uuid'],instance['name']))
                    return
                check_times -= 1
            
            LOG.warning(_("fail to stop instance[uuid:%s,name:%s] in 60s, poweroff it now!")
                         % (instance['uuid'],instance['name']))
        
        uri = self._session.make_cmd_uri('/vm/powerOff',vm_id)
        resp,body = self._session.call_method("PUT",uri)
        if resp.status_code == 200:
            msgId = self._xml.decode_xml("get_message_id",body)
            task = self._session.wait_for_task(msgId)
            if task['result'] == 0:
                LOG.debug(_("Powered off the VM"), instance=instance)
            else:
                vmStatus = task['vmStatus'] if task.has_key('vmStatus') else None
                if (vmStatus is not None and CAS_POWER_STATES[vmStatus] == power_state.SHUTDOWN):
                    LOG.info(_("instance[uuid:%s,name:%s] is already in powered off state")
                             % (instance['uuid'],instance['name']))
                    return
                LOG.error(_("fail to power off instance[uuid:%s,name:%s] uri:%s")
                         % (instance['uuid'],instance['name'],uri))
                LOG.error(_("fail to power off instance[uuid:%s,name:%s],failMsg:%s")
                           % (instance["uuid"],instance['name'],task['failMsg']))
                raise exception.InstancePowerOffFailure(reason=_("see error log message to get detailed information!"))
        else:
            instance_info = self.get_info(instance,vm_id,isDb='false')
            if instance_info.state == power_state.SHUTDOWN:
                LOG.info(_("instance[uuid:%s,name:%s] is already in powered off state")
                         % (instance['uuid'],instance['name']))
                return
            LOG.error(_("fail to power off instance[uuid:%s,name:%s] uri:%s")
                     % (instance['uuid'],instance['name'],uri))
            LOG.error(_("fail to power off instance[uuid:%s,name:%s],resp.status_code:%d,%s")
                       % (instance['uuid'],instance['name'],resp.status_code,cas_error.get_http_respond_error(resp)))
            raise exception.InstancePowerOffFailure(reason=_("see error log message to get detailed information!"))
    
    def reboot(self, instance, network_info):
        vm_id = self._get_instance_info(instance['uuid'])['id']
        
        uri = self._session.make_cmd_uri('/vm/restart',vm_id)
        resp,body = self._session.call_method("PUT",uri)
        if resp.status_code == 200:
            msgId = self._xml.decode_xml("get_message_id",body)
            task = self._session.wait_for_task(msgId)
            if task['result'] == 0:
                LOG.debug(_("Reboot the VM successfully"),instance=instance)
            else:
                vmStatus = task['vmStatus'] if task.has_key('vmStatus') else None
                if (vmStatus is not None and CAS_POWER_STATES[vmStatus] == power_state.SHUTDOWN):
                    LOG.info(_("power on the instance[uuid:%s,name:%s] when user reboot it in shutdown state!")
                             % (instance['uuid'],instance['name']))
                    self.power_on(instance,vm_id)
                    return
                
                LOG.error(_("fail to reboot instance[uuid:%s,name:%s] uri:%s")
                         % (instance['uuid'],instance['name'],uri))
                LOG.error(_("fail to reboot instance[uuid:%s,name:%s],failMsg:%s")
                           % (instance['uuid'],instance['name'],task['failMsg']))
                raise exception.InstanceRebootFailure(reason=_("see error log message to get detailed information!"))
        else:
            LOG.error(_("fail to reboot instance[uuid:%s,name:%s] uri:%s")
                     % (instance['uuid'],instance['name'],uri))
            LOG.error(_("fail to reboot instance[uuid:%s,name:%s],resp.status_code:%d,%s")
                       % (instance['uuid'],instance['name'],resp.status_code,cas_error.get_http_respond_error(resp)))
            raise exception.InstanceRebootFailure(reason=_("see error log message to get detailed information!"))
    
    def pause(self, instance):
        """pause the specified instance."""
        vm_id = self._get_instance_info(instance['uuid'])['id']
        
        uri = self._session.make_cmd_uri('/vm/pause',vm_id)
        resp,body = self._session.call_method("PUT",uri)
        if resp.status_code == 200:
            msgId = self._xml.decode_xml("get_message_id",body)
            task = self._session.wait_for_task(msgId)
            if task['result'] == 0:
                LOG.debug(_("Pause the VM successfully"),instance=instance)
            else:
                vmStatus = task['vmStatus'] if task.has_key('vmStatus') else None
                if (vmStatus is not None and CAS_POWER_STATES[vmStatus] == power_state.PAUSED):
                    LOG.debug(_("VM was already in paused state. So returning "
                                "without doing anything"),instance=instance)
                    return
                    
                LOG.error(_("fail to pause instance[uuid:%s,name:%s] uri:%s")
                         % (instance['uuid'],instance['name'],uri))
                LOG.error(_("fail to pause instance[uuid:%s,name:%s],failMsg:%s")
                           % (instance['uuid'],instance['name'],task['failMsg']))
                raise exception.InstanceSuspendFailure(reason=_("see error log message to get detailed information!"))
        else:
            LOG.error(_("fail to pause instance[uuid:%s,name:%s] uri:%s")
                     % (instance['uuid'],instance['name'],uri))
            LOG.error(_("fail to pause instance[uuid:%s,name:%s],resp.status_code:%d,%s")
                       % (instance['uuid'],instance['name'],resp.status_code,cas_error.get_http_respond_error(resp)))
            raise exception.InstanceSuspendFailure(reason=_("see error log message to get detailed information!"))
    
    def unpause(self, instance):
        """unpause the specified instance."""
        vm_id = self._get_instance_info(instance['uuid'])['id']
        
        uri = self._session.make_cmd_uri('/vm/restore',vm_id)
        resp,body = self._session.call_method("PUT",uri)
        if resp.status_code == 200:
            msgId = self._xml.decode_xml("get_message_id",body)
            task = self._session.wait_for_task(msgId)
            if task['result'] == 0:
                LOG.debug(_("Restore the VM successfully"),instance=instance)
            else:
                vmStatus = task['vmStatus'] if task.has_key('vmStatus') else None
                if (vmStatus is not None and CAS_POWER_STATES[vmStatus] == power_state.RUNNING):
                    LOG.debug(_("VM was already in running state. So returning "
                                "without doing anything"),instance=instance)
                    return
                
                LOG.error(_("fail to unpause instance[uuid:%s,name:%s] uri:%s")
                         % (instance['uuid'],instance['name'],uri))
                LOG.error(_("fail to unpause instance[uuid:%s,name:%s],failMsg:%s")
                           % (instance["uuid"],instance['name'],task['failMsg']))
                raise exception.InstanceResumeFailure(reason=_("see error log message to get detailed information!"))
        else:
            LOG.error(_("fail to unpause instance[uuid:%s,name:%s] uri:%s")
                     % (instance['uuid'],instance['name'],uri))
            LOG.error(_("fail to unpause instance[uuid:%s,name:%s],resp.status_code:%d,%s")
                       % (instance['uuid'],instance['name'],resp.status_code,cas_error.get_http_respond_error(resp)))
            raise exception.InstanceResumeFailure(reason=_("see error log message to get detailed information!"))
    
    def suspend(self, instance):
        """Suspend the specified instance."""
        vm_id = self._get_instance_info(instance['uuid'])['id']
        
        uri = self._session.make_cmd_uri('/vm/sleep',vm_id)
        resp,body = self._session.call_method("PUT",uri)
        if resp.status_code == 200:
            msgId = self._xml.decode_xml("get_message_id",body)
            task = self._session.wait_for_task(msgId)
            if task['result'] == 0:
                LOG.debug(_("Suspend the VM successfully"),instance=instance)
            else:
                vmStatus = task['vmStatus'] if task.has_key('vmStatus') else None
                if (vmStatus is not None and CAS_POWER_STATES[vmStatus] == power_state.SHUTDOWN):
                    LOG.debug(_("VM was already in powered off state. So returning "
                                "without doing anything"),instance=instance)
                    return
                
                LOG.error(_("fail to suspend instance[uuid:%s,name:%s] uri:%s")
                         % (instance['uuid'],instance['name'],uri))
                LOG.error(_("fail to suspend instance[uuid:%s,name:%s],failMsg:%s")
                           % (instance["uuid"],instance['name'],task['failMsg']))
                raise exception.InstanceSuspendFailure(reason=_("see error log message to get detailed information!"))
        else:
            LOG.error(_("fail to suspend instance[uuid:%s,name:%s] uri:%s")
                     % (instance['uuid'],instance['name'],uri))
            LOG.error(_("fail to suspend instance[uuid:%s,name:%s],resp.status_code:%d,%s")
                       % (instance['uuid'],instance['name'],resp.status_code,cas_error.get_http_respond_error(resp)))
            raise exception.InstanceSuspendFailure(reason=_("see error log message to get detailed information!"))
    
    def resume(self, instance):
        """Resume the specified instance."""
        self.power_on(instance)
    
    def snapshot(self, context, instance, image_href, update_task_state):
        update_task_state(task_state=task_states.IMAGE_PENDING_UPLOAD)
        
        LOG.info(_("create snapshot of instance[uuid:%s,name:%s] on the cas!")
                 % (instance['uuid'],instance['name']))
        default_disk_bus = self._host.get_platform_para(instance.node,'default_disk_bus')
        disk_bus = instance['system_metadata'].get('sys_disk_bus',default_disk_bus)
        deviceName = {'virtio':'vda','scsi':'sda','ide':'hda','virtioScsi':'sda'}[disk_bus]
        
        vm_Id = self._get_instance_info(instance['uuid'])['id']
        uri = self._session.make_cmd_uri('/nova/vm/snapshot',vmId=vm_Id, device=deviceName, name=image_href)
        resp,body = self._session.call_method("POST",uri)
        if resp.status_code == 200:
            msgId = self._xml.decode_xml("get_message_id",body)
            task = self._session.wait_for_task(msgId)
            if task['result'] != 0:
                LOG.error(_("fail to snapshot instance[uuid:%s,name:%s] uri:%s")
                         % (instance['uuid'],instance['name'],uri))
                LOG.error(_("fail to snapshot instance[uuid:%s,name:%s],failMsg:%s") %
                         (instance["uuid"],instance['name'],task['failMsg']))
                raise cas_error.CasVmException()
        else:
            LOG.error(_("fail to snapshot instance[uuid:%s,name:%s] uri:%s")
                     % (instance['uuid'],instance['name'],uri))
            LOG.error(_("fail to snapshot instance[uuid:%s,name:%s],resp.status_code:%d,%s")
                     % (instance['uuid'],instance['name'],resp.status_code,cas_error.get_http_respond_error(resp)))
            raise cas_error.CasVmException()
            
        update_task_state(task_state=task_states.IMAGE_UPLOADING,
                              expected_state=task_states.IMAGE_PENDING_UPLOAD)
        
        LOG.info(_("upload snapshot of instance[uuid:%s,name:%s] to the glance!")
                 % (instance['uuid'],instance['name']))
        
        imageMeta = self._imageops.get_image_meta_props(context,instance['image_ref'],instance)
        context = self._host._init_auth_context()
        self._imageops.upload_image(context,CONF.cas.glance_host,CONF.cas.glance_port,image_href,imageMeta)

    def _get_diagnostics(self, instance):
        vm_Id = self._get_instance_info(instance['uuid'])['id']
        uri = self._session.make_cmd_uri('/nova/vmDiagnosticInfo',id=vm_Id)
        resp,body = self._session.call_method("GET",uri)
        if resp.status_code == 200:
            diagnosticInfo = self._xml.decode_xml("instance_diagnostic",body)
            return diagnosticInfo
        else:
            LOG.error(_("fail to get diagnostics info of instance[uuid:%s,name:%s] uri:%s")
                     % (instance['uuid'],instance['name'],uri))
            LOG.error(_("fail to get diagnostics info of instance[uuid:%s,name:%s],resp.status_code:%d,%s")
                     % (instance['uuid'],instance['name'],resp.status_code,cas_error.get_http_respond_error(resp)))
            raise cas_error.CasVmException()
    
    def get_diagnostics(self, instance):
        diagnosticInfo = self._get_diagnostics(instance)
        
        diags = {'guestOS':instance['system_metadata'].get('guestOS','unknown')}
        
        for vcpu in diagnosticInfo['vcpuinfo']:
            diags["cpu" + vcpu['number'] + "_time"] = vcpu['cpuTime']
        
        for block in diagnosticInfo['domblkstat']:
            diags[block['name'] + "_read_req"] = block['rd_req']
            diags[block['name'] + "_read"] = block['rd_bytes']
            diags[block['name'] + "_write_req"] = block['wr_req']
            diags[block['name'] + "_write"] = block['wr_bytes']
            diags[block['name'] + "_errors"] = block['errs']
        
        for interface in diagnosticInfo['domifstat']:
            diags[interface['name'] + "_rx"] = interface['rx_bytes']
            diags[interface['name'] + "_rx_packets"] = interface['rx_packets']
            diags[interface['name'] + "_rx_errors"] = interface['rx_errs']
            diags[interface['name'] + "_rx_drop"] = interface['rx_drop']
            diags[interface['name'] + "_tx"] = interface['tx_bytes']
            diags[interface['name'] + "_tx_packets"] = interface['tx_packets']
            diags[interface['name'] + "_tx_errors"] = interface['tx_errs']
            diags[interface['name'] + "_tx_drop"] = interface['tx_drop']
        
        diags["memory"] = diagnosticInfo['dominfo']['maxMem']
        
        for memory in diagnosticInfo['memorystat']:
            diags["memory-" + memory['tag']] = memory['val']
        
        return diags
    
    def get_instance_diagnostics(self, instance):
        diagnosticInfo = self._get_diagnostics(instance)
        
        config_drive = configdrive.required_by(instance)
        launched_at = timeutils.normalize_time(instance.launched_at)
        uptime = timeutils.delta_seconds(launched_at,
                                         timeutils.utcnow())
        diags = diagnostics.Diagnostics(state=diagnosticInfo['dominfo']['state'],
                                        driver='casapi',
                                        config_drive=config_drive,
                                        hypervisor_os='cas',
                                        uptime=uptime)
        
        diags.memory_details = diagnostics.MemoryDiagnostics(
            maximum=diagnosticInfo['dominfo']['maxMem'] / units.Mi,
            used=diagnosticInfo['dominfo']['memory'] / units.Mi)
        
        for vcpu in diagnosticInfo['vcpuinfo']:
            diags.add_cpu(id=vcpu['number'],time=vcpu['cpuTime'])
        
        for block in diagnosticInfo['domblkstat']:
            diags.add_disk(read_bytes=block['rd_bytes'],
                           read_requests=block['rd_req'],
                           write_bytes=block['wr_bytes'],
                           write_requests=block['wr_req'],
                           errors_count=block['errs'])
        
        for interface in diagnosticInfo['domifstat']:
            diags.add_nic(mac_address = interface['mac'],
                          rx_octets=interface['rx_bytes'],
                          rx_errors=interface['rx_errs'],
                          rx_drop=interface['rx_drop'],
                          rx_packets=interface['rx_packets'],
                          tx_octets=interface['tx_bytes'],
                          tx_errors=interface['tx_errs'],
                          tx_drop=interface['tx_drop'],
                          tx_packets=interface['tx_packets'])
        
        return diags
    
    def attach_volume(self, context, connection_info, instance, mountpoint, disk_bus):
        LOG.info("attach_volume mountpoint: %s. connection_info:%s. instance:%s"
                 % (mountpoint,connection_info,instance['name']))
        
        try:
            vmInfo = self._get_instance_info(instance['uuid'])
        except exception.InstanceNotFound:
            LOG.warning(_("During attach_volume, instance disappeared."), instance=instance)
        else:
            node = self._host.get_node_by_nodename(instance['node'])
            if node is not None:
                volmeName = self._volumeops.query_volume_on_host(connection_info,vmInfo['hostName'])
                storages = self._get_instance_detail(instance['uuid'],vmInfo['id'],'disk')
                exist = self._volumeops.check_volume_exist(storages,mountpoint,volmeName,instance)
                if not exist:
                    self._volumeops.attach_lun_device_to_cluster(connection_info,vmInfo['hostName'],instance['node'])
                    if not disk_bus:
                        default_disk_bus = self._host.get_platform_para(instance.node,'default_disk_bus')
                        disk_bus = instance['system_metadata'].get('sys_disk_bus',default_disk_bus)
                    self._volumeops.attach_volume(connection_info,instance,vmInfo['id'],mountpoint,disk_bus)
            else:
                self._volumeops.attach_lun_device_to_cluster(connection_info,vmInfo['hostName'],instance['node'])
    
    def detach_volume(self, connection_info, instance, mountpoint):
        LOG.info("detach_volume mountpoint: %s. connection_info:%s. instance:%s"
                 % (mountpoint,connection_info,instance['name']))
        
        try:
            vmInfo = self._get_instance_info(instance['uuid'])
        except exception.InstanceNotFound:
            LOG.warning(_("During detach_volume, instance disappeared."), instance=instance)
        else:
            node = self._host.get_node_by_nodename(instance['node'])
            if node is not None:
                volmeName = self._volumeops.query_volume_on_host(connection_info,vmInfo['hostName'])
                storages = self._get_instance_detail(instance['uuid'],vmInfo['id'],'disk')
                exist = self._volumeops.check_volume_exist(storages,mountpoint,volmeName,instance)
                if exist:
                    self._check_volume_can_detach(instance, vmInfo['id'], mountpoint)
                    self._volumeops.detach_volume(connection_info, instance, vmInfo['id'], mountpoint)
            
            self._volumeops.detach_lun_device_from_cluster(connection_info,instance['node'])

    def extend_volume(self, connection_info, instance):
        LOG.info("extend_volume connection_info:%s. instance:%s"
                 % (connection_info, instance['name']))

        try:
            vmInfo = self._get_instance_info(instance['uuid'])
        except exception.InstanceNotFound:
            LOG.warning(_("During detach_volume, instance disappeared."), instance=instance)
        else:
            uri = self._session.make_cmd_uri('/vm/' + vmInfo['id'] + '/syncStorageInfo')
            resp, body = self._session.call_method("PUT", uri)
            if resp.status_code == 200:
                msgId = self._xml.decode_xml("get_message_id", body)
                task = self._session.wait_for_task(msgId)
                if task['result'] != 0:
                    LOG.error(_("fail to sync instance[uuid:%s,name:%s] storage info, uri:%s, xmlstr:None")
                              % (instance['uuid'], instance['name'], uri))
                    LOG.error(_("fail to sync instance[uuid:%s,name:%s] storage info, failMsg:%s") %
                              (instance["uuid"], instance['name'], task['failMsg']))
                    raise cas_error.CasMigrationException()
            else:
                LOG.error(_("fail to sync instance[uuid:%s,name:%s] storage info, uri:%s, xmlstr:None")
                          % (instance['uuid'], instance['name'], uri))
                LOG.error(_("fail to sync instance[uuid:%s,name:%s] storage info,resp.status_code:%d,%s")
                          % (
                          instance['uuid'], instance['name'], resp.status_code, cas_error.get_http_respond_error(resp)))
                raise cas_error.CasVmException()

    def cloud_attach_interface(self, instance, vif):
        vmInfo = self._get_instance_info(instance['uuid'])
        networks = self._get_instance_detail(instance['uuid'],vmInfo['id'],'interface')
        exist = self._network.check_network_exist(networks,vif)
        if exist:
            self._network.change_vif_name(vmInfo['id'],vif)
            self._network.update_vif_name(vif,instance['uuid'])
            self._network.update_vif_policy(vif,vmInfo['hostName'])
        else:
            LOG.error(_("instance[uuid:%s] dosen't have vif[%s]") % (instance['uuid'],vif))
            raise cas_error.CasVmException()
    
    def _update_config_interface(self, instance, vmid, hostName, vif, vifInfo, configVm):
        self._network.update_vif_policy(vif,hostName)
    
        bandwidth_conf = self._get_vif_bandwidth_config(instance.flavor)
        if bandwidth_conf:
            self._network.update_interface_qos(vmid,vif,bandwidth_conf)
    
        if configVm:
            self._network.config_interface(vmid,vifInfo)

    def _get_interface_multiqueues(self, instance, image_meta):
        if isinstance(image_meta,dict):
            if image_meta:
                image_multiqueue_enabled = image_meta['properties'].get('hw:vif_multiqueue_enabled','False')
            else:
                image_multiqueue_enabled = 'False'
        else:
            if image_meta and hasattr(image_meta.properties,'hw_vif_multiqueue_enabled'):
                image_multiqueue_enabled = image_meta.properties.get('hw:vif_multiqueue_enabled') or 'False'
            else:
                image_multiqueue_enabled = 'False'
        flavor = instance['flavor']
        if flavor is None:
            LOG.error(_("the flavor(%s) is error.") % flavor)
            raise cas_error.CasVmException()
        try:
            flavor_multiqueue_enabled = flavor.extra_specs.get('hw:vif_multiqueue_enabled','False')
        except Exception:
            LOG.error(_("the flavor extra-spec hw:vif_multiqueue_enabled is invalid."))
            raise cas_error.CasVmException()

        if  image_multiqueue_enabled.lower() == 'true' or flavor_multiqueue_enabled.lower() == 'true':
            cpu_args = dict()
            self._get_cpu_info(flavor,cpu_args)
            return cpu_args.get('cpuCores')
        else:
            return self._imageops.get_image_net_queues(image_meta)

    def _attach_interface(self, instance, vmid, hostName, image_meta, vif):
        self._network.update_vif_name(vif,instance['uuid'])
        net_model = self._imageops.get_image_net_model(image_meta)
        net_queues = self._get_interface_multiqueues(instance, image_meta)
        bindIp = instance['metadata'].get('bindIp',self._bindIp) == 'true'
        network_args = self._network.network_interface_info([vif],net_model,net_queues,bindIp)
    
        self._network.attach_interface(vmid,network_args['base_info'])
        eventlet.spawn(self._update_config_interface,instance,vmid,hostName,vif,
                       network_args['vif_info'],self._configVM)
    
    def _detach_interface(self, vmid, vif):
        self._network.detach_interface(vmid,vif)
    
    def attach_interface(self, context, instance, image_meta, vif):
        """Attach an interface to the instance."""
        vmInfo = self._get_instance_info(instance['uuid'])
        try:
            image_id = instance['image_ref']
            if not image_id:
                storages = self._get_instance_detail(instance['uuid'],vmInfo['id'],'disk')
                mountpoint = instance['root_device_name']

                volume_name = storages[mountpoint]['path'].split('/')[-1]
                if volume_name.startswith('volume-'):
                    volume_id = volume_name[len('volume-'):]
                else:
                    volume_id = volume_name
                image_id  = self._volumeops.get_volume_image_id(context,volume_id)
            imageMeta = self._imageops.get_image_meta_props(context,image_id,instance)
            self._attach_interface(instance,vmInfo['id'],vmInfo['hostName'],imageMeta,vif)
        except Exception as exc:
            LOG.info(_("attach interface exc:%s reattach again") % exc)
            self._attach_interface(instance,vmInfo['id'],vmInfo['hostName'],image_meta,vif)
    
    def detach_interface(self, instance, vif):
        """Detach an interface from the instance."""
        instanceId = self._get_instance_info(instance['uuid'])['id']
        self._detach_interface(instanceId,vif)
    
    def _add_device_backup_file(self, instance, instanceId, deviceName, hostName, fileName):
        deviceArgs = {'vmId':instanceId,'destHostName':hostName,'disk':{'device':deviceName,'fileName':fileName}}
        uri = self._session.make_cmd_uri('/nova/vm/deviceBackup')
        xmlstr = self._xml.encode_xml("device_backup",**deviceArgs)
        resp,body = self._session.call_method("PUT",uri,body=xmlstr)
        if resp.status_code == 200:
            msgId = self._xml.decode_xml("get_message_id",body)
            task = self._session.wait_for_task(msgId)
            if task['result'] != 0:
                LOG.error(_("fail to add instance[uuid:%s,name:%s] device backup file, uri:%s, xmlstr:%s")
                         % (instance['uuid'],instance['name'],uri,xmlstr))
                LOG.error(_("fail to add instance[uuid:%s,name:%s] device backup file, failMsg:%s") %
                         (instance["uuid"],instance['name'],task['failMsg']))
                raise cas_error.CasImageException()
        else:
            LOG.error(_("fail to add instance[uuid:%s,name:%s] device backup file, uri:%s, xmlstr:%s")
                     % (instance['uuid'],instance['name'],uri,xmlstr))
            LOG.error(_("fail to add instance[uuid:%s,name:%s] device backup file, resp.status_code:%d,%s")
                     % (instance['uuid'],instance['name'],resp.status_code,cas_error.get_http_respond_error(resp)))
            raise cas_error.CasImageException()
    
    def _del_device_backup_file(self, instance, instanceId, deviceName, fileName, hostName):
        deviceArgs = {'vmId':instanceId,'destHostName':hostName,'disk':{'device':deviceName,'fileName':fileName}}
        uri = self._session.make_cmd_uri('/nova/vm/deviceBackup')
        xmlstr = self._xml.encode_xml("device_backup",**deviceArgs)
        resp,body = self._session.call_method("DELETE",uri,body=xmlstr)
        if resp.status_code != 204:
            LOG.error(_("fail to del instance[uuid:%s,name:%s] device backup file, uri:%s, xmlstr:%s")
                         % (instance['uuid'],instance['name'],uri,xmlstr))
            LOG.error(_("fail to del instance[uuid:%s,name:%s] device backup file, resp.status_code:%d,%s") %
                     (instance["uuid"],instance['name'],resp.status_code,cas_error.get_http_respond_error(resp)))
            raise cas_error.CasImageException()
    
    def _resize_instance(self, instance, **resizeArgs):
        uri = self._session.make_cmd_uri('/nova/vm/resize')
        xmlstr = self._xml.encode_xml("resize_instance",**resizeArgs)
        resp,body = self._session.call_method("PUT",uri,body=xmlstr)
        if resp.status_code == 200:
            msgId = self._xml.decode_xml("get_message_id",body)
            task = self._session.wait_for_task(msgId)
            if task['result'] != 0:
                LOG.error(_("fail to resize instance[uuid:%s,name:%s], uri:%s, xmlstr:%s")
                         % (instance['uuid'],instance['name'],uri,xmlstr))
                LOG.error(_("fail to resize instance[uuid:%s,name:%s], failMsg:%s") %
                         (instance["uuid"],instance['name'],task['failMsg']))
                raise cas_error.CasMigrationException()
        else:
            LOG.error(_("fail to resize instance[uuid:%s,name:%s], uri:%s, xmlstr:%s")
                     % (instance['uuid'],instance['name'],uri,xmlstr))
            LOG.error(_("fail to resize instance[uuid:%s,name:%s], resp.status_code:%d,%s")
                     % (instance['uuid'],instance['name'],resp.status_code,cas_error.get_http_respond_error(resp)))
            raise cas_error.CasMigrationException()
    
    def _migrate_instance(self, instance, **migrateArgs):
        uri = self._session.make_cmd_uri('/vm/migrate')
        xmlstr = self._xml.encode_xml("migrate_instance",**migrateArgs)
        resp,body = self._session.call_method("PUT",uri,body=xmlstr)
        if resp.status_code == 200:
            msgId = self._xml.decode_xml("get_message_id",body)
            task = self._session.wait_for_task(msgId)
            if task['result'] != 0:
                LOG.error(_("fail to migrate instance[uuid:%s,name:%s], uri:%s, xmlstr:%s")
                         % (instance['uuid'],instance['name'],uri,xmlstr))
                LOG.error(_("fail to migrate instance[uuid:%s,name:%s], failMsg:%s") %
                         (instance["uuid"],instance['name'],task['failMsg']))
                raise cas_error.CasMigrationException()
        else:
            LOG.error(_("fail to migrate instance[uuid:%s,name:%s], uri:%s, xmlstr:%s")
                     % (instance['uuid'],instance['name'],uri,xmlstr))
            LOG.error(_("fail to migrate instance[uuid:%s,name:%s],resp.status_code:%d,%s")
                     % (instance['uuid'],instance['name'],resp.status_code,cas_error.get_http_respond_error(resp)))
            raise cas_error.CasMigrationException()
    
    def get_cold_migrate_dest_node(self, instance, migration, instance_type):
        try:
            return self._host.get_cold_migrate_dest_node(migration.dest_node,instance['node'],instance_type.id==instance.flavor.id)
        except Exception as exc:
            raise exception.InstanceFaultRollback(Exception(_("fail to get instance cold migrate dest node.")))
    
    def migrate_disk_and_power_off(self, context, instance, dest, instance_type,
                                   network_info, block_devices):
        default_disk_bus = self._host.get_platform_para(instance.node,'default_disk_bus')
        disk_bus = instance['system_metadata'].get('sys_disk_bus',default_disk_bus)
        
        if instance['image_ref']:
            root_device = {'virtio':'vda','scsi':'sda','ide':'hda','virtioScsi':'sda'}[disk_bus]
        
        vmInfo = self._get_instance_info(instance['uuid'])
        
        vmId = vmInfo['id']
        try:
            instance['system_metadata']['migration_src_hostId'] = vmInfo['hostId']
            resize_args = {'vmId':vmId,'migrateType':'cold'}
            disks = []
            resize_devices = {}
            if instance_type.id != instance.flavor.id:
                instance['system_metadata']['new_flavor_id'] = instance_type.id
                resize_args.update({'migrateType':'resize','vcpus':instance_type.vcpus,'memory':instance_type.memory_mb})
                excludePrefix = self._get_storage_info(instance['new_flavor'])
            else:
                excludePrefix = self._get_storage_info(instance['flavor'])
            
            if instance['image_ref']:
                if instance_type.root_gb < instance['root_gb']:
                    LOG.error(_("can't resize instance[uuid:%s] root disk down") % instance['uuid'])
                    raise cas_error.CasImageException()
                else:
                    disks.append({'device':root_device,'size':instance_type.root_gb})
                    if instance_type.root_gb > instance['root_gb']:
                        resize_devices[root_device] = {'size':instance_type.root_gb}
            
            if len(block_devices['ephemerals']) == 1:
                ephemeral_disk = block_devices['ephemerals'][0]
                if instance_type.ephemeral_gb < ephemeral_disk['size']:
                    LOG.error(_("can't resize instance[uuid:%s] ephemeral disk down") % instance['uuid'])
                    raise cas_error.CasImageException()
                else:
                    ephemeral_device = ephemeral_disk['device_name'].split('/')[-1]
                    disks.append({'device':ephemeral_device,'size':instance_type.ephemeral_gb})
                    if instance_type.ephemeral_gb > ephemeral_disk['size']:
                        resize_devices[ephemeral_device] = {'size':instance_type.ephemeral_gb}
            else:
                LOG.debug(_("instance[uuid:%s] dosen't exist ephemeral disk or exists multiple ephemeral disk, dosen't resize all ephemeral disk.")
                         % instance['uuid'])
            
            if block_devices['swap'] is not None:
                swap_disk = block_devices['swap']
                if instance_type.swap < swap_disk['swap_size']:
                    LOG.error(_("can't resize instance[uuid:%s] swap disk down") % instance['uuid'])
                    raise cas_error.CasImageException()
                else:
                    if swap_disk['swap_size'] > 0:
                        swap_device = swap_disk['device_name'].split('/')[-1]
                        swap_size = float(instance_type.swap) / units.Ki
                        disks.append({'device':swap_device,'size':swap_size})
                        if instance_type.swap > swap_disk['swap_size']:
                            resize_devices[swap_device] = {'size':swap_size}
            else:
                LOG.debug(_("instance[uuid:%s] dosen't exist swap disk or exists , dosen't resize swap disk.")
                         % instance['uuid'])
            
            if excludePrefix is not None:
                for disk in disks:
                    disk.update(excludePrefix=excludePrefix)
            
            resize_args.update({'disk':disks})
            self._get_gpu_vgpu_parameter(instance,resize_args)
            destHost = self._host.get_cold_migrate_dest_host(dest,block_devices['block_device_mapping'],**resize_args)
            destHost['resize_devices'] = resize_devices
            
            self.power_off(instance,vmId)
            for vif in network_info:
                vnic_type = self._network._get_vnic_type(vif)
                if vnic_type == 'direct':
                    self._detach_interface(vmId,vif)

        except Exception:
            instance['system_metadata'].pop('new_flavor_id',None)
            instance['system_metadata'].pop('migration_src_hostId',None)
            raise exception.InstanceFaultRollback(
                exception.ResizeError(reason=_("fail to check instance cold migrate dest host or power off.")))
        
        backup_devices = {}
        storages = self._get_instance_detail(instance['uuid'],vmId,'storage')
        
        def _add_backup_device(deviceName, deviceType, hostName, newPath=None):
            srcFileName = storages[deviceName]['path']
            dstFileName = "%s/%s" % (newPath,os_path.basename(srcFileName)) if newPath else srcFileName + '_backup'
            self._add_device_backup_file(instance,vmId,deviceName,hostName,dstFileName)
            backup_device = {'type':deviceType,'newPath':newPath,'srcFile':srcFileName,'dstFile':dstFileName}
            instance['system_metadata']['migrate_backup:'+deviceName] = repr(backup_device)
            backup_devices[deviceName] = backup_device
            
        try:
            for deviceName, device in storages.items():
                if device['path'].endswith('iso9600-%s.iso' % instance['uuid']):
                    if destHost['hostName'] != vmInfo['hostName']:
                        _add_backup_device(deviceName,'cdrom',destHost['hostName'],'/vms/isos')
                    break
                elif device['path'].endswith('vfat-%s' % instance['uuid']):
                    for storage in destHost['storageInfo']:
                        if device['path'] == storage.get('storageVolumeName'):
                            _add_backup_device(deviceName,'disk',destHost['hostName'], storage['storagePoolPath'])
                        break
            if len(destHost['storageInfo']) > 0:
                for storage in destHost['storageInfo']:
                    for deviceName, device in storages.items():
                        if device['path'] == storage.get('storageVolumeName'):
                            instance['system_metadata']['diskinfo_before_migrate:'+deviceName] = repr(storage)
                            break
            
            if instance_type.id != instance.flavor.id:
                for deviceName,device in resize_devices.items():
                    _add_backup_device(deviceName,'disk',vmInfo['hostName'])
            
        except Exception:
            instance['system_metadata'].pop('new_flavor_id',None)
            instance['system_metadata'].pop('migration_src_hostId',None)
            for deviceName, backup_device in backup_devices.items():
                self._del_device_backup_file(instance,vmId,deviceName,backup_device['dstFile'],destHost['hostName'])
                del instance['system_metadata']['migrate_backup:'+deviceName]
            self.power_on(instance,vmId)
            raise exception.InstanceFaultRollback(
                exception.ResizeError(reason=_("fail to add instance device backup file.")))
        
        if destHost['hostName'] != vmInfo['hostName'] and instance['numa_topology'] is not None:
            resize_args={'vmId':vmId,'vcpus':instance['vcpus'],'memory':instance['memory_mb']}
            self._get_cpu_info(instance['flavor'],resize_args)
            self._get_gpu_vgpu_parameter(instance,resize_args)
            self._get_net_queues_parameter(context, instance, resize_args)
            self._resize_instance(instance,**resize_args)

        if destHost['hostName'] != vmInfo['hostName']:
            for mapping_info in block_devices['block_device_mapping']:
                connection_info = mapping_info['connection_info']
                mountpoint = mapping_info['mount_device']
                self._volumeops.detach_volume(connection_info,instance,vmId,mountpoint)
                self._volumeops.detach_lun_device_from_cluster(connection_info,instance['node'])
        
        return destHost
    
    def finish_migration(self, context, migration, instance, disk_info,
                         network_info, image_meta, resize_instance,
                         block_device_mapping, power_on):
        default_disk_bus = self._host.get_platform_para(instance.node,'default_disk_bus')
        disk_bus = instance['system_metadata'].get('sys_disk_bus',default_disk_bus)
        
        vmInfo = self._get_instance_info(instance['uuid'])
        vmId = vmInfo['id']
        
        backup_devices = {}
        for key,value in instance['system_metadata'].items():
            if key.startswith('migrate_backup:'):
                deviceName, backup_device = key.split(':')[1], eval(value)
                backup_devices[deviceName] = backup_device
        
        for deviceName, backup_device in backup_devices.items():
            if backup_device['newPath']:
                self._imageops.detach_device(instance,vmId,'/dev/'+deviceName)
        
        migrateStorage = []
        if (disk_info.has_key('storageInfo') and len(disk_info['storageInfo']) > 0):
            for storage in disk_info['storageInfo']:
                migrateStorage.append({'srcFile':storage['storageVolumeName'],
                                       'targetPath':storage['storagePoolPath'],
                                       'targetPool':storage['storagePoolName']})
        migrateType = -1
        migrate_args = {'id':vmId,'targetHostId':disk_info['hostId'],'onlineMigrate':0}
        if disk_info['hostName'] != vmInfo['hostName']:
            if len(migrateStorage) > 0:
                migrateType = 2
                migrate_args['migrateStorage']= migrateStorage
            else:
                migrateType = 0
        else:
            if len(migrateStorage) > 0:
                migrateType = 1
                migrate_args['migrateStorage']= migrateStorage
        
        if migrateType >= 0:
            migrate_args['migrateType'] = migrateType
            self._migrate_instance(instance,**migrate_args)
        
        for deviceName, backup_device in backup_devices.items():
            if backup_device['newPath']:
                targetBus = 'ide' if backup_device['type'] == 'cdrom' else disk_bus
                device_info = {'type':backup_device['type'],'targetBus':targetBus,'deviceName':'/dev/'+deviceName,'path':backup_device['dstFile']}
                self._imageops.attach_device(instance,vmId,device_info)
        if migrateType != -1:
            for mapping_info in block_device_mapping:
                connection_info = mapping_info['connection_info']
                self._volumeops.attach_lun_device_to_cluster(connection_info,disk_info['hostName'],instance['node'])
                if mapping_info.get('disk_bus'):
                    disk_bus = mapping_info['disk_bus']
                self._volumeops.attach_volume(connection_info,instance,vmId,mapping_info['mount_device'],disk_bus, True)
        
        new_flavor_id = instance['system_metadata'].get('new_flavor_id',None)
        if new_flavor_id or instance['numa_topology'] is not None:
            resize_args={'vmId':vmId}
            
            if new_flavor_id:
                resize_args.update({'vcpus':instance['vcpus'],'memory':instance['memory_mb'],'disk':[]})
                for deviceName, disk in disk_info['resize_devices'].items():
                    resize_args['disk'].append({'device':deviceName,'size':disk['size']})
            
            if instance['numa_topology'] is not None:
                numa_topology = self._get_instance_extra_specs(instance)
                resize_args['vnuma'] = numa_topology
        
            self._get_cpu_info(instance['flavor'],resize_args)
            self._get_gpu_vgpu_parameter(instance,resize_args)
            self._get_net_queues_parameter(context, instance, resize_args)
            self._resize_instance(instance,**resize_args)
        
        for vif in network_info:
            vnic_type = self._network._get_vnic_type(vif)
            if vnic_type == 'direct':
                image_id = instance['image_ref']
                if not image_id:
                    image_id = self._volumeops.get_root_volume_image(context,instance['root_device_name'],
                        block_device_mapping)
                imageMeta = self._imageops.get_image_meta_props(context,image_id,instance)
                self._attach_interface(instance,vmId,vmInfo['hostName'],imageMeta,vif)
        
        # power on the instance if necessary
        if power_on:
            self.power_on(instance,vmId)
    
    def confirm_migration(self, migration, instance, network_info):
        vm_id = self._get_instance_info(instance['uuid'])['id']
        
        instance['system_metadata'].pop('new_flavor_id',None)
        srcHostId = instance['system_metadata'].pop('migration_src_hostId')
        srcHostName = self._host.get_cold_migrate_src_host(srcHostId)
        
        for key,value in instance['system_metadata'].items():
            if key.startswith('migrate_backup:'):
                deviceName, backup_device = key.split(':')[1], eval(value)
                filename = backup_device['srcFile'] if backup_device['newPath'] else backup_device['dstFile']
                self._del_device_backup_file(instance,vm_id,deviceName,filename,srcHostName)
                del instance['system_metadata']['migrate_backup:'+deviceName]
                
        for key,value in instance['system_metadata'].items():
            if key.startswith('diskinfo_before_migrate:'):
                del instance['system_metadata'][key]
    
    def revert_migration(self, instance, network_info, block_device_mapping):
        vmId = self._get_instance_info(instance['uuid'])['id']
        
        self.power_off(instance,vmId)
        
        for vif in network_info:
            vnic_type = self._network._get_vnic_type(vif)
            if vnic_type == 'direct':
                self._detach_interface(vmId,vif)

        vmInfo = self._get_instance_info(instance['uuid'])
        srcHostId = instance['system_metadata'].pop('migration_src_hostId')
        srcHostName = self._host.get_cold_migrate_src_host(srcHostId)

        if vmInfo['hostName'] != srcHostName:
            for mapping_info in block_device_mapping:
                connection_info = mapping_info['connection_info']
                mountpoint = mapping_info['mount_device']
                self._volumeops.detach_volume(connection_info,instance,vmId,mountpoint)
                self._volumeops.detach_lun_device_from_cluster(connection_info,instance['node'])
        
        if instance['numa_topology'] is not None:
            resize_args={'vmId':vmId,'vcpus':instance['vcpus'],'memory':instance['memory_mb']}
            self._get_gpu_vgpu_parameter(instance,resize_args)
            self._resize_instance(instance,**resize_args)
    
    def finish_revert_migration(self, context, instance, network_info, block_device_mapping, power_on):
        default_disk_bus = self._host.get_platform_para(instance.node,'default_disk_bus')
        disk_bus = instance['system_metadata'].get('sys_disk_bus',default_disk_bus)
        
        vmInfo = self._get_instance_info(instance['uuid'])
        vmId = vmInfo['id']
        srcHostId = instance['system_metadata'].pop('migration_src_hostId')
        srcHostName = self._host.get_cold_migrate_src_host(srcHostId)
        
        backup_devices = {}
        for key,value in instance['system_metadata'].items():
            if key.startswith('migrate_backup:'):
                deviceName, backup_device = key.split(':')[1], eval(value)
                backup_devices[deviceName] = backup_device
        
        for deviceName, backup_device in backup_devices.items():
            if backup_device['newPath']:
                self._imageops.detach_device(instance,vmId,'/dev/'+deviceName)

        orignal_disks = {}
        for key,value in instance['system_metadata'].items():
            if key.startswith('diskinfo_before_migrate:'):
                deviceName, storage = key.split(':')[1], eval(value)
                orignal_disks[deviceName] = storage
                del instance['system_metadata'][key]
        
        migrateStorage = []
        for deviceName,storage in orignal_disks.items():
            storageVolumeName = storage['storageVolumeName']
            srcFile = storage['storagePoolPath'] + '/' + os_path.basename(storageVolumeName)
            targetPath = os_path.dirname(storageVolumeName)
            targetPool = targetPath.split('/')[-1]
            migrateStorage.append({'srcFile':srcFile,'targetPath':targetPath,'targetPool':targetPool})
        
        migrateType = -1
        migrate_args = {'id':vmId,'targetHostId':srcHostId,'onlineMigrate':0}
        if vmInfo['hostName'] != srcHostName:
            if len(migrateStorage) > 0:
                migrateType = 2
                migrate_args['migrateStorage'] = migrateStorage
            else:
                migrateType = 0
        else:
            if len(migrateStorage) > 0:
                migrateType = 1
                migrate_args['migrateStorage'] = migrateStorage

        if migrateType >= 0:
            migrate_args['migrateType'] = migrateType
            self._migrate_instance(instance,**migrate_args)
         
        for deviceName, backup_device in backup_devices.items():
            if backup_device['newPath']:
                targetBus = 'ide' if backup_device['type'] == 'cdrom' else disk_bus
                device_info = {'type':backup_device['type'],'targetBus':targetBus,'deviceName':'/dev/'+deviceName,'path':backup_device['srcFile']}
                self._imageops.attach_device(instance,vmId,device_info)
                self._del_device_backup_file(instance,vmId,deviceName,backup_device['dstFile'],vmInfo['hostName'])
                del instance['system_metadata']['migrate_backup:'+deviceName]

        if migrateType != -1:
            for mapping_info in block_device_mapping:
                connection_info = mapping_info['connection_info']
                self._volumeops.attach_lun_device_to_cluster(connection_info,srcHostName,instance['node'])
                if mapping_info.get('disk_bus'):
                    disk_bus = mapping_info['disk_bus']
                self._volumeops.attach_volume(connection_info,instance,vmId,mapping_info['mount_device'],disk_bus)
        
        new_flavor_id = instance['system_metadata'].pop('new_flavor_id',None)
        if new_flavor_id or instance['numa_topology'] is not None:
            resize_args={'vmId':vmId}
            
            if new_flavor_id:
                resize_args.update({'vcpus':instance['vcpus'],'memory':instance['memory_mb'],'disk':[]})
                for deviceName, backup_device in backup_devices.items():
                    if not backup_device['newPath']:
                        resize_args['disk'].append({'device':deviceName,'fileName':os_path.basename(backup_device['dstFile'])})
                        del instance['system_metadata']['migrate_backup:'+deviceName]
            
            if instance['numa_topology'] is not None:
                numa_topology = self._get_instance_extra_specs(instance)
                resize_args['vnuma'] = numa_topology
        
            self._get_cpu_info(instance['flavor'],resize_args)
            self._get_gpu_vgpu_parameter(instance,resize_args)
            self._resize_instance(instance,**resize_args)
        
        for vif in network_info:
            vnic_type = self._network._get_vnic_type(vif)
            if vnic_type == 'direct':
                image_id = instance['image_ref']
                if not image_id:
                    image_id = self._volumeops.get_root_volume_image(context,instance['root_device_name'],
                        block_device_mapping)
                imageMeta = self._imageops.get_image_meta_props(context,image_id,instance)
                self._attach_interface(instance,vmId,vmInfo['hostName'],imageMeta,vif)
        
        if power_on:
            self.power_on(instance,vmId)
    
    def get_live_migrate_dest_host(self, instance, block_device_mapping, migrate_data):
        vm_id = self._get_instance_info(instance['uuid'])['id']
        excludePrefix = self._get_storage_info(instance['flavor'])
        storages = self._get_instance_detail(instance['uuid'],vm_id,'disk_allinfo')
        disks = []
        for storage in storages:
            disk = {'device':storage['deviceName']}
            if excludePrefix is not None:
                disk.update(excludePrefix=excludePrefix)
            
            disks.append(disk)
        dts_hostname = instance['metadata'].get('migrate_dst_hostname')
        migrateData = self._host.get_live_migrate_dest_host(vm_id,block_device_mapping,migrate_data,disk, dts_hostname)
        return migrateData
    
    def live_migration(self, instance, migrate_data):
        vmInfo = self._get_instance_info(instance['uuid'])
        
        cdroms = self._get_instance_detail(instance['uuid'],vmInfo['id'],'cdrom')
        for deviceName, path in cdroms.items():
            if path and os_path.basename(path) == 'iso9600-%s.iso' % instance['uuid']:
                self._add_device_backup_file(instance,vmInfo['id'],deviceName,migrate_data.hostName,path)
                config_drive_iso = (deviceName, path)
                break
        else:
            config_drive_iso = None
        
        migrateStorage = []
        if migrate_data.storagePool and len(eval(migrate_data.storagePool)) > 0:
            storages = eval(migrate_data.storagePool)
            for storage in storages:
                migrateStorage.append({'srcFile':storage['storageVolumeName'],
                                       'targetPath':storage['storagePoolPath'],
                                       'targetPool':storage['storagePoolName']})
        
        migrate_args = {'id':vmInfo['id'],'targetHostId':migrate_data.hostId,'onlineMigrate':1}
        if len(migrateStorage) > 0:
            migrate_args['migrateType'] = 2
            migrate_args['migrateStorage'] = migrateStorage
        else:
            migrate_args['migrateType'] = 0
        
        try:
            self._migrate_instance(instance,**migrate_args)
        except Exception as exc:
            if config_drive_iso is not None:
                self._del_device_backup_file(instance,vmInfo['id'],config_drive_iso[0],config_drive_iso[1],migrate_data.hostName)
            raise exc
        else:
            if config_drive_iso is not None:
                self._del_device_backup_file(instance,vmInfo['id'],config_drive_iso[0],config_drive_iso[1],vmInfo['hostName'])
    
    def set_admin_password(self, instance, new_pass):
        vm_id = self._get_instance_info(instance['uuid'])['id']
        pass_info = {'id':vm_id,'password':new_pass}
        
        uri = self._session.make_cmd_uri('/nova/vm/setpwd')
        xmlstr = self._xml.encode_xml("config_vm",**pass_info)
        resp,body = self._session.call_method("PUT",uri,body=xmlstr)
        if resp.status_code != 204:
            LOG.error(_("fail to set admin password of instance[uuid:%s,name:%s] uri:%s")
                     % (instance['uuid'],instance['name'],uri))
            LOG.error(_("fail to set admin password of instance[uuid:%s,name:%s],resp.status_code:%d,%s")
                     % (instance['uuid'],instance['name'],resp.status_code,cas_error.get_http_respond_error(resp)))
            raise cas_error.CasVmException()
    
    def macs_for_instance(self, instance):
        macs = instance['metadata'].get('pointmacs')
        if macs:
            mac_list = []
            for mac in macs.split(','):
                if not mac:
                    mac = utils.generate_mac_address()
                mac_list.append(mac)
            return mac_list
        
        return None
    
    def get_instance_real_nodename(self, instance):
        vmInfo = self._get_instance_info(instance['uuid'])
        nodename = self._host.get_nodename_by_hostId(vmInfo['hostId'])
        return nodename
    
    def snapshot_create(self, context, instance, memory_included, snap_name):
        vmId = self._get_instance_info(instance['uuid'])['id']
        snapMem = 'true' if memory_included else 'false'
        snapshot_args = {'vmId':vmId,'name':snap_name,'snapMem':snapMem,'noStopVirtSnapMem':'true','snapshotTimeOut':0}
        
        uri = self._session.make_cmd_uri('/vm/snapshot')
        xmlstr = self._xml.encode_xml("instance_snapshot", **snapshot_args)
        resp,body = self._session.call_method("POST",uri,body=xmlstr)
        if resp.status_code == 200:
            msgId = self._xml.decode_xml("get_message_id",body)
            task = self._session.wait_for_task(msgId)
            if task['result'] != 0:
                LOG.error(_("fail to snapshot instance[uuid:%s,name:%s] uri:%s")
                         % (instance['uuid'],snap_name,uri))
                LOG.error(_("fail to snapshot instance[uuid:%s,name:%s],failMsg:%s") %
                         (instance["uuid"],snap_name,task['failMsg']))
                raise cas_error.CasVmException()
            else:
                LOG.info(_("success to snapshot instance[uuid:%s] name:%s on the cas!") % (instance['uuid'],snap_name))
                return {'snap_name':snap_name}
        else:
            LOG.error(_("fail to snapshot instance[uuid:%s,name:%s] uri:%s")
                     % (instance['uuid'],snap_name,uri))
            LOG.error(_("fail to snapshot instance[uuid:%s,name:%s],resp.status_code:%d,%s")
                     % (instance['uuid'],snap_name,resp.status_code,cas_error.get_http_respond_error(resp)))
            raise cas_error.CasVmException()
    
    def snapshot_revert(self, context, instance, snap_name):
        vmId = self._get_instance_info(instance['uuid'])['id']
        snapshot_args = {'vmId':vmId,'name':snap_name}
        
        uri = self._session.make_cmd_uri('/vm/snapshot/resume')
        xmlstr = self._xml.encode_xml("instance_snapshot", **snapshot_args)
        resp,body = self._session.call_method("PUT",uri,body=xmlstr)
        if resp.status_code == 200:
            msgId = self._xml.decode_xml("get_message_id", body)
            task = self._session.wait_for_task(msgId)
            if task['result'] != 0:
                LOG.error(_("fail to revert snapshot instance[uuid:%s,name:%s] uri:%s")
                          % (instance['uuid'], snap_name, uri))
                LOG.error(_("fail to  revert snapshot instance[uuid:%s,name:%s],failMsg:%s") %
                          (instance["uuid"], snap_name, task['failMsg']))
                raise cas_error.CasVmException()
            else:
                LOG.info(_("success to revert snapshot instance[uuid:%s] name:%s on the cas!") % (
                instance['uuid'], snap_name))
                return {'snap_name': snap_name}
        else:
            LOG.error(_("fail to revert snapshot instance[uuid:%s,name:%s] uri:%s")
                      % (instance['uuid'], snap_name, uri))
            LOG.error(_("fail to revert snapshot instance[uuid:%s,name:%s],resp.status_code:%d,%s")
                      % (instance['uuid'], snap_name, resp.status_code, cas_error.get_http_respond_error(resp)))
            raise cas_error.CasVmException()
    
    def snapshot_list(self,context,instance):
        vmId = self._get_instance_info(instance['uuid'])['id']
        
        uri = self._session.make_cmd_uri('/vm/snapshot',vmId)
        resp, body = self._session.call_method("GET",uri)
        if resp.status_code == 200:
            snap_list = self._xml.decode_xml("snapshot_list",body)
            LOG.info(_("success to get snapshot list from CVM,list=%s") % snap_list)
            return snap_list
        else:
            LOG.error(_("fail to get snapshot list from CVM vmid:%s uri:%s") % (vmId,uri))
            LOG.error(_("fail to get snapshot list vmid:%s resp.status_code:%d,%s")
                     % (vmId,resp.status_code,cas_error.get_http_respond_error(resp)))
            raise cas_error.CasVmException()
    
    def snapshot_delete(self, context, instance, snap_name):
        vmId = self._get_instance_info(instance['uuid'])['id']
        
        uri = self._session.make_cmd_uri('/vm/snapshot',vmId,snap_name)
        resp,body = self._session.call_method("DELETE",uri)
        if resp.status_code == 200:
            msgId = self._xml.decode_xml("get_message_id",body)
            task = self._session.wait_for_task(msgId)
            if task['result'] != 0:
                LOG.error(_("fail to delete snapshot instance[uuid:%s,name:%s] uri:%s")
                          % (instance['uuid'],snap_name,uri))
                LOG.error(_("fail to  delete snapshot instance[uuid:%s,name:%s],failMsg:%s") %
                          (instance["uuid"],snap_name,task['failMsg']))
                raise cas_error.CasVmException()
            else:
                LOG.info(_("success to delete snapshot instance[uuid:%s] name:%s on the cas!") % (
                instance['uuid'],snap_name))
        else:
            LOG.error(_("fail to delete snapshot instance[uuid:%s,name:%s] uri:%s")
                      % (instance['uuid'],snap_name,uri))
            LOG.error(_("fail to delete snapshot instance[uuid:%s,name:%s],resp.status_code:%d,%s")
                      % (instance['uuid'],snap_name,resp.status_code,cas_error.get_http_respond_error(resp)))
            raise cas_error.CasVmException()
    
    def live_resize(self, instance, instance_type):
        if instance_type.id == instance.flavor.id:
            return
        
        if instance_type.vcpus < instance['vcpus'] or instance_type.memory_mb < instance['memory_mb']:
            LOG.error(_("can't live resize instance[uuid:%s] vcpus/memory down") % instance['uuid'])
            raise cas_error.CasVmException()
        
        resize_args={'vcpus':instance_type.vcpus,'memory':instance_type.memory_mb}
        
        if instance['image_ref']:
            if instance_type.root_gb < instance['root_gb']:
                LOG.error(_("can't live resize instance[uuid:%s] root disk down") % instance['uuid'])
                raise cas_error.CasVmException()
            default_disk_bus = self._host.get_platform_para(instance.node,'default_disk_bus')
            disk_bus = instance['system_metadata'].get('sys_disk_bus',default_disk_bus)
            root_device = {'virtio':'vda','scsi':'sda','ide':'hda','virtioScsi':'sda'}[disk_bus]
            resize_args['disk'] = [{'device':root_device,'size':instance_type.root_gb}]
        
        vmInfo = self._get_instance_info(instance['uuid'])
        resize_args['vmId'] = vmInfo['id']

        if instance['numa_topology'] is not None:
            numa_topology = self._get_instance_extra_specs(instance)
            resize_args['vnuma'] = numa_topology
        
        self._get_cpu_info(instance_type,resize_args)
        context = self._host._init_auth_context()
        self._get_net_queues_parameter(context, instance, resize_args)
        self._resize_instance(instance,**resize_args)
    
    def get_instance_tools_info(self, instance):
        uri = self._session.make_cmd_uri('/nova/castoolsInfo',uuid=instance['uuid'])
        resp, body = self._session.call_method("GET",uri)
        if resp.status_code == 200:
            toolsStatus = self._xml.decode_xml("instance_tools_info",body)
            return {'tools_running_status': toolsStatus}
        else:
            LOG.error(_("fail to get instance[uuid=%s] tools info! uri:%s") % (instance['uuid'], uri))
            LOG.error(_("fail to get instance[uuid=%s] tools info! resp.status_code:%d,%s")
                       % (instance['uuid'],resp.status_code,cas_error.get_http_respond_error(resp)))
            raise cas_error.CasVmException()
    
    def get_disk_path(self, instance):
        vmInfo = self._get_instance_info(instance['uuid'])
        storages = self._get_instance_detail(instance['uuid'],vmInfo['id'],'disk')
        
        index = 0
        disk_path = {}
        for storage in storages.values():
            index = index + 1
            disk_path[str(index)] = storage['path']
        
        return disk_path
    
    def _get_instance_network_objs(self, instance_uuid):
        vmInfo = self._get_instance_info(instance_uuid)
        uri = self._session.make_cmd_uri('/nova/vm/network',vmInfo['id'])
        resp, body = self._session.call_method("GET",uri)
        if resp.status_code == 200:
            network_objs = self._xml.decode_xml("instance_network_objs",body)
            return network_objs
        else:
            LOG.error(_("fail to get instance[uuid=%s] ip addr! uri:%s") % (instance_uuid, uri))
            LOG.error(_("fail to get instance[uuid=%s] ip addr! resp.status_code:%d,%s")
                       % (instance_uuid,resp.status_code,cas_error.get_http_respond_error(resp)))
            raise cas_error.CasVmException()
    
    def get_instance_ip_addr(self,instance_uuid):
        network_objs = self._get_instance_network_objs(instance_uuid)
        ipList = []
        
        for obj in network_objs:
            ips = obj['ips']
            for ip in ips:
                ipList.append(ip['ipAddr'])
        
        return ipList
    
    def update_instance_datastore(self, instance):
        node = self._host.get_node_by_nodename(instance['node'])
        if node is None:
            LOG.error(_("nodename %s is not include in current compute node") % instance['node'])
            raise cas_error.CasVmException()
        
        vmInfo = self._get_instance_info(instance['uuid'])
        storages = self._get_instance_detail(instance['uuid'],vmInfo['id'],'disk')
        storagePools = self._host._query_node_storage_pool(instance['node'])
        storage_pools = storagePools['storagePools']
       
        datastore_list = []
        for storage in storages.values():
            for storage_pool in storage_pools:
                if storage['path'].startswith(storage_pool['path']):
                    datastore_list.append(storage_pool['name'])
                    break
        
        instance.metadata['datastore'] = str(datastore_list)
        instance.save()
    
    def get_attached_cd(self, context, instance):
        vmInfo = self._get_instance_info(instance['uuid'])
        cdroms = self._get_instance_detail(instance['uuid'],vmInfo['id'],'cdrom')
        
        cdrom_list = [{deviceName:path} for deviceName, path in cdroms.items() if path is not None]
        return cdrom_list
    
    def attach_cd(self, context, instance, cd_path):
        vmInfo = self._get_instance_info(instance['uuid'])
        cdroms = self._get_instance_detail(instance['uuid'],vmInfo['id'],'cdrom')
        
        for device, path in cdroms.items():
            if path is None:
                deviceName = device
                break
        else:
            LOG.error(_("instance [uuid:%s,name:%s] has no free cdrom device")
                      %(instance['uuid'],instance['name']))
            raise cas_error.CasVmException()
        
        modifyArgs = {'id':vmInfo['id'],'name':instance['name'],
                      'cdrom':{'device':deviceName,'operation':'connect','path':cd_path,'type':'file'}}
        self._modify(instance,**modifyArgs)
    
    def detach_cd(self, context, instance, cd_id):
        vmInfo = self._get_instance_info(instance['uuid'])
        modifyArgs = {'id':vmInfo['id'],'name':instance['name'],
                      'cdrom':{'device':cd_id,'operation':'disconnect'}}
        self._modify(instance,**modifyArgs)
    
    def instance_set_boot_device(self, context, instance, boot_device):
        vmInfo = self._get_instance_info(instance['uuid'])
        
        if instance['image_ref']:
            default_disk_bus = self._host.get_platform_para(instance.node,'default_disk_bus')
            disk_bus = instance['system_metadata'].get('sys_disk_bus',default_disk_bus)
            root_device = {'virtio':'vda','scsi':'sda','ide':'hda','virtioScsi':'sda'}[disk_bus]
        else:
            root_device = instance['root_device_name'].split('/')[-1]
        if boot_device != root_device:
            boot_device = boot_device + ',' + root_device
        
        modifyArgs = {'id':vmInfo['id'],'name':instance['name'],'bootDev':{'bootdevs':boot_device}}
        self._modify(instance,**modifyArgs)
    
    def get_instance_cpu_and_mem(self, instance_uuid):
        vmInfo = self._get_instance_info(instance_uuid)
        if vmInfo is None:
            LOG.error(_("instance[uuid:%s] doesn't exist on the CAS!") % instance_uuid)
            raise exception.InstanceNotFound(instance_id=instance_uuid)
        else:
            cpu = self._get_instance_detail(instance_uuid,vmInfo['id'],'cpu')
            memory = self._get_instance_detail(instance_uuid,vmInfo['id'],'memory')
        cpu_info = cpu['cpuCores']
        mem_info = memory['size']
        cpu_mem_info = (cpu_info,mem_info)
        return cpu_mem_info
    
    def get_instance_resource(self, instance_uuid):
        vmInfo = self._get_instance_info(instance_uuid)
        if vmInfo is None:
            LOG.error(_("instance[uuid:%s] doesn't exist on the CAS!") % instance_uuid)
            raise exception.InstanceNotFound(instance_id=instance_uuid)
        else:
            cpu = self._get_instance_detail(instance_uuid,vmInfo['id'],'cpu')
            memory = self._get_instance_detail(instance_uuid,vmInfo['id'],'memory')
        
        cpuGurantee = cpu['cpuGurantee']
        cpuShares = cpu['cpuShares']
        if cpu.has_key('cpuQuota'):
            if cpu['cpuQuotaUnit'] == 'GHz':
                cpuQuota = cpu['cpuQuota'] * units.G / units.M
            else:
                cpuQuota = cpu['cpuQuota']
        else:
            cpuQuota = cpu['cpuMaxRate']
        
        size = memory['size']
        memoryBacking = memory['memoryBacking']
        memoryPriority = memory['memoryPriority']
        mem_min_guarantee = size * memoryBacking / 100
        if memory.has_key('memoryLimit'):
            if memory['memoryLimitUnit'] == 'GB':
                memoryLimit = memory['memoryLimit'] * units.Gi / units.Mi
            else:
                memoryLimit = memory['memoryLimit']
        else:
            memoryLimit = size
        
        resource ={'cpu_hard_frequency':cpuQuota,'cpu_min_frequency':cpuGurantee ,'cpu_shares':cpuShares,
                   'mem_hard_limit':memoryLimit,'mem_min_guarantee':mem_min_guarantee,'mem_share':memoryPriority}
        
        return resource
    
    def get_instance_name(self, instance_uuid):
        vmInfo = self._get_instance_info(instance_uuid)
        if vmInfo is None:
            LOG.error(_("instance[uuid:%s] doesn't exist on the CAS!") % instance_uuid)
            raise exception.InstanceNotFound(instance_id=instance_uuid)
        else:
            title = self._get_instance_detail(instance_uuid,vmInfo['id'],'title')
        
        return title
    
    def get_instance_hostname(self,instance_uuid):
        exist = self.check_instance_exist(instance_uuid)
        if exist:
            vmInfo = self._get_instance_info(instance_uuid)
        else:
            return None
        if vmInfo is None:
            LOG.error(_("instance[uuid:%s] doesn't exist on the CAS!") % instance_uuid)
            raise exception.InstanceNotFound(instance_id=instance_uuid)
    
        return vmInfo['hostName']
    
    def _get_instance_bootDev(self, instance_uuid, instanceId):
        uri = self._session.make_cmd_uri('/vm/bootDev',instanceId)
        resp,body = self._session.call_method("GET",uri)
        if resp.status_code == 200:
            bootdevList = self._xml.decode_xml("instance_bootdevs",body)
            LOG.info(_("success to get instance[uuid:%s] bootDevs from CVM, info=%s") % (instance_uuid,bootdevList))
            return bootdevList
        else:
            LOG.error(_("fail to get instance[uuid:%s] bootDevs! uri:%s") % (instance_uuid,uri))
            LOG.error(_("fail to get instance[uuid:%s] bootDevs! resp.status_code:%d,%s")
                      % (instance_uuid,resp.status_code,cas_error.get_http_respond_error(resp)))
            raise cas_error.CasVmException()
    
    def import_virtual_disks(self, instance_uuid):
        vmInfo = self._get_instance_info(instance_uuid)
        if vmInfo is None:
            LOG.error(_("instance[uuid:%s] doesn't exist on the CAS!") % instance_uuid)
            raise exception.InstanceNotFound(instance_id=instance_uuid)
        else:
            disks = self._get_instance_detail(instance_uuid,vmInfo['id'],'disk_allinfo')
            bootdevList = self._get_instance_bootDev(instance_uuid,vmInfo['id'])
        
        vdisks = []
        for disk in disks:
            vdisk = {}
            vdisk['name'] = disk['path']
            vdisk['size'] = disk['size']
            vdisk['disk_bus'] = disk['targetBus']
            vdisk['format'] = disk['format']
            vdisk['mode'] = 'thin' if disk.get('mode') == '2' else 'thick'
            for bootdev in bootdevList:
                if disk['deviceName'] == bootdev['name']:
                    vdisk['bootindex'] = bootdevList.index(bootdev)
                    break;
            vdisks.append(vdisk)
        
        return vdisks
    
    def get_instances_from_cas_host(self, nodename):
        vm_dict = {}
        node = self._host.get_node_by_nodename(nodename)
        if node is None:
            LOG.error(_("nodename %s is not include in current compute node") % nodename)
            raise cas_error.CasVmException()
        
        instances = self._host._list_node_instances(**node['nodeInfo'])
        storagePools = self._host._query_node_storage_pool(nodename)
        storage_pools = storagePools['storagePools']
        uuids = instances['uuids']
        for uuid in uuids:
            vminfolist = []
            vmInfo = self._get_instance_info(uuid)
            disks = self._get_instance_detail(uuid,vmInfo['id'],'disk')
            datastore_list = []
            for disk in disks.values():
                for storage_pool in storage_pools:
                    if disk['path'].startswith(storage_pool['path']):
                        datastore_list.append(storage_pool['name'])
                        break
            
            vminfolist.append(str(datastore_list))
            ip_list = self.get_instance_ip_addr(uuid)
            vminfolist.append(str(ip_list))
            vm_dict[uuid] = vminfolist
        
        return vm_dict
    
    def get_network_obj(self, instance_uuid):
        vmInfo = self._get_instance_info(instance_uuid)
        network_objs = self._get_instance_network_objs(instance_uuid)
        title = self._get_instance_detail(instance_uuid,vmInfo['id'],'title')
        
        network_objList = []
        vlan_ids = []
        for obj in network_objs:
            if obj['vlan'] is not None:
                item = [obj['vlan'],obj['vsName']]
                if item not in vlan_ids:
                    vlan_ids.append(item)
        for vlan in vlan_ids:
            network_obj_item = {}
            network_obj_item ['uuid'] = instance_uuid
            network_obj_item['name'] = title
            network_obj_item['seg_id'] = int(vlan[0])
            network_obj_item['vds_name'] = vlan[1]
            
            vif_info_list = []
            for obj in network_objs:
                if vlan[0] == obj['vlan']:
                    vif_info = {}
                    vif_info['mac'] = obj['mac']
                    
                    ips = obj['ips']
                    for ip in ips:
                        if ip['ipAddr'] is not None and ip['iptype'] == 'ipv4':
                            vif_info['ip'] = ip['ipAddr']
                            vif_info['mask'] = int(ip['maskAddr'])
                            break
                    
                    for ip in ips:
                        if ip['ipAddr'] is not None and ip['iptype'] == 'ipv6':
                            vif_info['ipv6'] = ip['ipAddr']
                            vif_info['mask_v6'] = int(ip['maskAddr'])
                            break
                    
                    vif_info['enable_eqos'] = (obj['isLimitInBound'] == 'true')
                    if vif_info['enable_eqos']:
                        vif_info['iqos_max'] = int(obj['inAvgBandwidth'])
                        vif_info['iqos_max_burst'] = int(obj['inBurst'])
                    
                    vif_info['enable_iqos'] = (obj['isLimitOutBound'] == 'true')
                    if vif_info['enable_iqos']:
                        vif_info['eqos_max'] = int(obj['outAvgBandwidth'])
                        vif_info['eqos_max_burst'] = int(obj['outBurst'])
                    vif_info_list.append(vif_info)
            network_obj_item['vif_info'] = vif_info_list
            network_objList.append(network_obj_item)
        
        return network_objList

    def _check_volume_can_detach_x86_64(self,instance,vm_id,mountpoint):
        disks = self._get_instance_detail(instance['uuid'],vm_id,'disk_allinfo')
        for disk in disks:
            if disk['deviceName'] == mountpoint.split('/')[-1]:
                if disk['targetBus'] == 'ide':
                    instance_info = self.get_info(instance,vm_id,isDb='false')
                    if instance_info.state != power_state.SHUTDOWN:
                        LOG.warning(_("the disk with 'ide' target bus can not be detached hot"))
                        raise cas_error.CasVolumeException()
                return
        
        LOG.error(_("mountpoint:%s not exist on instance:%s")% (mountpoint,instance['uuid']))
        raise cas_error.CasVolumeException()

    def _check_volume_can_detach_aarch64(self,instance,vm_id,mountpoint):
        return
        # instance_info = self.get_info(instance,vm_id,isDb='false')
        # aarch64 支持，去掉之前的限制
        # if instance_info.state != power_state.SHUTDOWN:
        #     LOG.warning(_("On arm platform, the disks can not be detached hot"))
        #     raise cas_error.CasVolumeException()

    def _check_volume_can_detach(self,instance,vm_id,mountpoint):
        platform = self._host.get_platform_para(instance.node,'kernel_type')
        if platform == "x86_64":
            self._check_volume_can_detach_x86_64(instance,vm_id,mountpoint)
        elif platform == "aarch64":
            self._check_volume_can_detach_aarch64(instance,vm_id,mountpoint)
        else:
            LOG.error(_("not support platform kernel_type:%s now") % platform)
            raise cas_error.CasHostException()
    
    def _add_vm_console(self,instance,vm_id):
        meta = instance['metadata']
        console_type = meta.get('console_type',None)
        if console_type is None:
            return
        if console_type not in ['spice','vnc']:
            LOG.error(_("not support console type:%s now") % console_type)
            raise cas_error.CasVmException()
        
        console_args = {'id':vm_id,'name':instance['name'],'title':instance['display_name'],
                        'vnc':{'type':console_type,'port':-1}}
        if console_type == 'spice':
            console_args['vnc']['enableSpiceCompress'] = '1'
        
        xmlstr = self._xml.encode_xml("add_console",**console_args)
        uri = self._session.make_cmd_uri('/vm/addDevice')
        resp,body = self._session.call_method("PUT",uri,body=xmlstr)
        if resp.status_code == 200:
            msgId = self._xml.decode_xml("get_message_id",body)
            task = self._session.wait_for_task(msgId)
            if task['result'] != 0:
                LOG.error(_("fail to add console for instance[uuid:%s] uri:%s, xmlstr:%s,failMsg:%s")
                          % (instance['uuid'],uri,xmlstr,task['failMsg']))
                raise cas_error.CasVmException()
            
            LOG.info(_("success to add console for instance[uuid:%s] uri:%s,xmlstr:%s")%(instance['uuid'],uri,xmlstr))
        else:
            LOG.error(_("fail to add console for instance[uuid:%s] uri:%s, xmlstr:%s,resp.status_code:%d,%s")
                      % (instance['uuid'],uri,xmlstr,resp.status_code,cas_error.get_http_respond_error(resp)))
            raise cas_error.CasVmException()
    
    def get_spice_console(self,instance):
        """Return connection info for a spice console."""
        vm_id = self._get_instance_info(instance['uuid'])['id']
        uri = self._session.make_cmd_uri('/spice/info',vm_id)
        resp,body = self._session.call_method("GET",uri)
        if resp.status_code == 200:
            spice_info = self._xml.decode_xml("get_spice_console",body)
            if spice_info["host_ip"] is not None and spice_info["port"] is not None:
                return ctype.ConsoleSpice(host=spice_info["host_ip"],port=spice_info["port"],tlsPort=-1)
            else:
                LOG.info(_("invalid spice info:%s") % spice_info)
                raise cas_error.CasVmException()
        else:
            LOG.error(_("fail to get spice instance[uuid:%s,name:%s] uri:%s")
                      % (instance['uuid'],instance['name'],uri))
            LOG.error(_("fail to get spice instance[uuid:%s,name:%s],resp.status_code:%d,%s")
                      % (instance['uuid'],instance['name'],resp.status_code,cas_error.get_http_respond_error(resp)))
            raise cas_error.CasVmException()
    
    def _vm_manage(self,vm_uuid,manage):
        """managety type,0--unmanage,1--managed by nova"""
        if manage not in ['0','1']:
            LOG.error(_("not support manage type:%s now") % manage)
            raise cas_error.CasVmException()
        
        manage_args = {'uuid':vm_uuid,'manage':manage}
        xmlstr = self._xml.encode_xml("vm_manage",**manage_args)
        uri = self._session.make_cmd_uri('/vm/manage')
        resp,body = self._session.call_method("PUT",uri,body=xmlstr)
        if resp.status_code != 204:
            LOG.error(_("fail to manage vm, uri:%s, xmlstr:%s")% (uri,xmlstr))
            LOG.error(_("fail to manage vm, [vm_uuid:%s],resp.status_code:%d,%s")
                      % (vm_uuid,resp.status_code,cas_error.get_http_respond_error(resp)))
            raise cas_error.CasVmException()
    
    def _check_manage_exist_vm(self,vm_uuid,vm_info):
        """managety type,0--unmanage,1--managed by nova"""
        if not vm_info.has_key('managed_existed'):
            LOG.debug(_("hypervisor not support manage"))
            return
        
        managed_existed = vm_info['managed_existed']
        if managed_existed == None:
            LOG.debug(_("hypervisor not support manage"))
            return
        if managed_existed == '1':
            return
        if managed_existed != '0':
            LOG.warning(_("someone else managed this vm, state error"))
            return
        
        self._vm_manage(vm_uuid,'1')
    
    def cloud_unmanage_exist_vm(self,vm_uuid):
        """managety type,0--unmanage,1--managed by nova"""
        if vm_uuid is not None:
            self._vm_manage(vm_uuid,'0')
    
    def cloud_affinity_rules_ummap2cas(self,instance):
        if CONF.cas.affinity_rules_map2cas:
            vmInfo = self._get_instance_info(instance['uuid'])
            self._unmap_vm_rules(instance,vmInfo)
    
    def pre_check_need_sync_dts_state(self,instance,local_dts_info):
        result = 'undetermined'
        
        local_type = DTS_VM_TYPE[local_dts_info['vmType']]
        if local_type == 'RECOVER_VM':
            result = 'sync'

        if local_type == 'FAKE_VM':
            result = 'not_sync'
        
        return result
    
    def check_need_sync_dts_state(self,instance,local_dts_info,peer_dts_info):
        result = 'not_sync'
        
        if (local_dts_info is None and  peer_dts_info is None):
            LOG.error(_("instnace:%s not exist on neither local nor peer:%s") % (instance['uuid']))
            raise cas_error.CasVolumeException()
        elif (local_dts_info is not None and peer_dts_info is None):
            result = 'sync'
        elif (local_dts_info is not None and  peer_dts_info is not None):
            local_type = DTS_VM_TYPE[local_dts_info['vmType']]
            peer_type  = DTS_VM_TYPE[peer_dts_info['vmType']]
            local_prio = DTS_VM_PRIO[local_type]
            peer_prio  = DTS_VM_PRIO[peer_type]
            if peer_prio > local_prio:
                result = 'sync'
        
        return result
        
    def sync_dts_state(self,instance,dts_info):
        self._host.sync_instances_dtsinfo(instance,dts_info)

    def change_instance_description(self, instance, description):
        vm_id = self._get_instance_info(instance['uuid'])['id']
        uri = self._session.make_cmd_uri('/vm/desc', id=vm_id, desc=description)
        resp, body = self._session.call_method("PUT", uri)
        if resp.status_code != 200:
            LOG.error(_("fail to change instance description[%s] to %s ------ uri:%s") % (instance['uuid'], description, uri))
            LOG.error(_("fail to change instance description[%s] to %s ------ resp.status_code:%d,%s")
                      % (instance['uuid'], description, resp.status_code, cas_error.get_http_respond_error(resp)))
            raise cas_error.CasVmException()

    def _get_net_queues_parameter(self, context, instance, resize_args):
        net_queues = None
        if instance['metadata']:
            instance_type = instance['metadata'].get('instance_type')
            if instance_type == 'bare':
                LOG.info(_("instance type of instance[%s] is bare, create instance without disk!") % instance['uuid'])
            else:
                image_id = instance['image_ref']
                imageMeta = None
                if image_id:
                    imageMeta = self._imageops.get_image_meta_props(context, image_id, instance)
                net_queues = self._get_interface_multiqueues(instance, imageMeta)
        if net_queues:
            resize_args.update(netQueues=net_queues)

    def join_server_group(self, server_group, instance):
        vmInfo = self._get_instance_info(instance['uuid'])
        if CONF.cas.affinity_rules_map2cas:
            self._map_vm_rules(instance, vmInfo, server_group)
        else:
            LOG.error(_("fail to add instance[uuid:%s] to server_group, please check the configuration.")
                      % instance['uuid'])

    def remove_server_group(self, instance):
        vmInfo = self._get_instance_info(instance['uuid'])
        need_map = self._check_map_vm_rules(instance)
        if CONF.cas.affinity_rules_map2cas and need_map:
            clusterinfo = self._get_vm_clusterinfo(vmInfo['id'])
            self._unmap_vm_rules(instance, vmInfo)
            self._check_and_delete_rules(instance, clusterinfo)
        else:
            LOG.error(_("fail to remove instance[uuid:%s] from server_group, please check the configuration.")
                      % instance['uuid'])
