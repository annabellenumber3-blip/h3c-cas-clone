# add by zhangmingze, 2014-2-10

import socket
import time
import itertools
import inspect
import re

from oslo_config import cfg
from oslo_log import log as logging

from nova import exception
from nova import block_device
from nova.i18n import _
from nova.compute import task_states
from nova.compute import utils
from nova.virt import driver
from nova.virt import configdrive
from nova.virt import block_device as driver_block_device
from nova.virt.casapi import host as cashost
from nova.virt.casapi import client as casclient
from nova.virt.casapi import vmops as casvmops
from nova.virt.casapi import volumeops as casvolumeops
from nova.virt.casapi import error as cas_error
from nova.virt.casapi import xml as casxml
from nova.virt.casapi import network as casnetwork
from nova.virt.casapi import event as casevent
from nova.virt.casapi import imageops as casimage

casapi_opts = [
    cfg.StrOpt('host_ip',
               help='URL for connection to CAS host. Required if '
                    'compute_driver is casapi.CasDriver. '),
    cfg.StrOpt('host_username',
               help='Username for connection to CAS host. '
                    'Used only if compute_driver is casapi.CasDriver. '),
    cfg.StrOpt('host_password',
               help='Password for connection to CAS host. '
                    'Used only if compute_driver is casapi.CasDriver. ',
               secret=True),
    cfg.StrOpt('hpName',
               help='the name of hpName is used to create instance. '
                    'Used only if compute_driver is casapi.CasDriver. '),
    cfg.ListOpt('clusterName',
                default=[],
                help='the name of clusterName is used to create instance. '
                     'Used only if compute_driver is casapi.CasDriver. '),
    cfg.BoolOpt('host_transparent',
                default=False,
                help='the Option to decide whether host will be transparented or not. '
                     'Used only if compute_driver is casapi.CasDriver. '),
    cfg.BoolOpt('useLocalStorage',
                default=False,
                help='Decide whether to use CVK local disk resource. '
                     'Used only if compute_driver is casapi.CasDriver. '),
    cfg.ListOpt('vswitches',
                help='the name of vswitches is used to create instance. '
                     'Used only if compute_driver is casapi.CasDriver. '),
    cfg.BoolOpt('linkClone',
                default=False,
                help='the mode of image is used to create instance. '
                     'Used only if compute_driver is casapi.CasDriver. '),
    cfg.StrOpt('cpu_mode',
               default='default_cpu_mod',
               help='the mode of vcpu is used to create instance. '
                    'Used only if compute_driver is casapi.CasDriver. '),
    cfg.StrOpt('glance_host',
               help='the ip address of glance is used to operate image. '
                    'Used only if compute_driver is casapi.CasDriver. '),
    cfg.BoolOpt('runOnce',
                default=True,
                help='the mode for castools to run cmd when deploy instance. '
                     'Used only if compute_driver is casapi.CasDriver. '),
    cfg.StrOpt('neutron_plugin',
               default='openvswitch',
               help='the plugin name of neutron to deal network configure. '
                    'Used only if compute_driver is casapi.CasDriver. '),
    cfg.StrOpt('rest_protocol',
               default='http',
               help='the name of protocol to use http or https. '
                    'Used only if compute_driver is casapi.CasDriver. '),
    cfg.StrOpt('URI_prefix',
               default='/cas/casrs',
               help='the prefix of URL to assemble rest url address. '
                    'Used only if compute_driver is casapi.CasDriver. '),
    cfg.StrOpt('GPUPool',
               help='the name of GPU pool when vm enable GPU. '
                    'Used only if compute_driver is casapi.CasDriver. '),
    cfg.StrOpt('GPUTemplate',
               help='the name of GPU template when vm enable GPU. '
                    'Used only if compute_driver is casapi.CasDriver. '),
    cfg.BoolOpt('useVirtualCDROM',
                default=False,
                help='the Option to decide whether vm will use cdrom or not. '
                     'Used only if compute_driver is casapi.CasDriver. '),
    cfg.BoolOpt('bindIp',
                default=True,
                help='the Option to decide whether vm will bind ip or not. '
                     'Used only if compute_driver is casapi.CasDriver. '),
    cfg.BoolOpt('configVM',
                default=True,
                help='the Option to decide whether vm will be configed or not. '
                     'Used only if compute_driver is casapi.CasDriver. '),
    cfg.BoolOpt('instance_initialization',
                default=True,
                help='the Option to decide whether vm will be initialized by castools or not. '
                     'Used only if compute_driver is casapi.CasDriver. '),
    cfg.IntOpt('api_retry_count',
               default=10,
               help='The number of times we retry on failures, e.g., '
                    'socket error, etc. '
                    'Used only if compute_driver is casapi.CasDriver. '),
    cfg.BoolOpt('limit_storage_resource',
                deprecated_name='limit_resource_report',
                default=False,
                help='the Option to decide whether only report the storage pool which has the max free size. '
                     'Used only if compute_driver is casapi.CasDriver. '),
    cfg.BoolOpt('limit_numa_resource',
                default=False,
                help='the Option to decide whether only report the isolated CPU in numa topology. '
                     'Used only if compute_driver is casapi.CasDriver. '),
    cfg.StrOpt('destroy_type',
                default="delete_disk",
                help='the Option to decide whether only report the isolated CPU in numa topology. '
                     'Used only if compute_driver is casapi.CasDriver. '),
    cfg.ListOpt('compute_capabilities',
                default=[],
                help='the capabilities of compute host will be report to scheduler. '
                     'Used only if compute_driver is casapi.CasDriver. '),
    cfg.StrOpt('volume_mode',
               default='thin',
               help='decide whether to create and write zero a volume.'),
    cfg.BoolOpt('sync_time',
                default=False,
                help='the Option to decide sync vm inner time to the host time'
                     'Used only if compute_driver is casapi.CasDriver.'),
    cfg.BoolOpt('castools_auto_upgrade',
                default=True,
                help='the Option to decide upgrade  vm castools automatically'
                     'Used only if compute_driver is casapi.CasDriver.'),
    cfg.IntOpt('port_update_gthead_pool_size',
               default=1000,
               help='the size of greethreads to dealwith port update,while migrating vm.'
               'Used only if compute_driver is casapi.CasDriver. ')
    ]

CONF = cfg.CONF
CONF.register_opts(casapi_opts, 'cas')

LOG = logging.getLogger(__name__)

destroy_type_map = {'retain_disk':'0','delete_disk':'1','recycle_bin':'3'}

class CasDriver(driver.ComputeDriver):
    """communication with cas host"""
    capabilities = {
        "has_imagecache": True,
        "supports_recreate": True,
        "supports_migrate_to_same_host": True,
        "supports_multiattach": True
    }
    
    def __init__(self, virtapi):
        super(CasDriver, self).__init__(virtapi)
        
        self._session = None
        self._host = None
        self._event = None
        self._volumeops = None
        self._network = None
        self._vmops = None
        self._imageops = None      
        self._virtapi = virtapi
    
    def init_host(self, host):
        """Do the initialization that needs to be done."""
        if not (CONF.cas.host_ip and CONF.cas.host_username and CONF.cas.host_password and CONF.cas.hpName and CONF.cas.glance_host):
            raise Exception(_("Must specify host_ip "
                              "host_username "
                              "host_password "
                              "hpName "
                              "and glance_host to use "
                              "compute_driver=casapi.CasDriver"))
        
        if CONF.cas.rest_protocol not in ('http','https'):
            raise Exception(_("rest protocol is %s, only support http or https") % CONF.cas.rest_protocol)
        
        if CONF.cas.cpu_mode not in ('custom','host-model','host-passthrough','default_cpu_mod'):
            raise Exception(_("cpu mode is %s, only support custom, host-model or host-passthrough") % CONF.cas.cpu_mode)
        
        if CONF.cas.destroy_type not in ('retain_disk','delete_disk','recycle_bin'):
            raise Exception(_("destroy type is %s, only support retain_disk, delete_disk or recycle_bin") % CONF.cas.destroy_type)
            
        self._session = CasAPISession(CONF.cas.host_ip,CONF.cas.host_username,CONF.cas.host_password,
                                      CONF.cas.URI_prefix,CONF.cas.api_retry_count,CONF.cas.rest_protocol,CONF.debug)
        
        try:
            neutron_plugin = CONF.neutron_plugin
        except Exception:
            neutron_plugin = CONF.cas.neutron_plugin
        if neutron_plugin == 'openvswitch':
            self._network = casnetwork.CasNetworkOvs(self._session,host)
        elif neutron_plugin == 'vcfc':
            self._network = casnetwork.CasNetworkVcfc(self._session,host)
        else:
            raise Exception(_("neutron plugin is %s, only support vcfc or openvswitch") % neutron_plugin)
        
        if CONF.cas.host_transparent:
            self._host = cashost.CasHostNode(self._session,self._network,self._virtapi,host)
        else:
            self._host = cashost.CasClusterNode(self._session,self._network,self._virtapi,host)
        
        self._event = casevent.CasEvent(self._session,self._host,host)
        self._volumeops = casvolumeops.CasVolumeOps(self._session,self._host)
        self._imageops = casimage.CasImageOps(self._session,self._host)
        self._vmops = casvmops.CasVMOps(self._session,self._volumeops,self._imageops,self._host,self._network)
    
    def register_event_listener(self, callback):
        self._event.register_event_listener(callback)
    
    def spawn(self, context, instance, image_meta, injected_files,
              admin_password, network_info=None, block_device_info=None):
        """Create VM instance."""
        LOG.info(_("[cas::] begin to spawn instance[%s].") % instance['uuid'])
        
        ephemerals = driver.block_device_info_get_ephemerals(block_device_info)
        swap = driver.block_device_info_get_swap(block_device_info)
        block_device_mapping = driver.block_device_info_get_mapping(block_device_info)
        block_devices = {'block_device_mapping':block_device_mapping,'ephemerals':ephemerals,'swap':swap}
        
        self._vmops.spawn(context,instance,image_meta,injected_files,admin_password,network_info,block_devices,False)
        LOG.info(_("[cas::] finish to spawn instance[%s].") % instance['uuid'])
    
    def instance_exists(self, instance):
        LOG.info(_("[cas::] begin to check instance[%s] exists.") % instance['uuid'])
        
        exist = self._vmops.check_instance_exist(instance['uuid'])
        if exist:
            node = self._host.get_node_by_nodename(instance['node'])
            if node is None:
                exist = False
        
        LOG.info(_("[cas::] finish to check instance[%s] exists.") % instance['uuid'])
        return exist
    
    def list_instances(self):
        LOG.info(_("[cas::] begin to get instances list."))
        list_vm_name = self._host.list_instances()
        LOG.info(_("[cas::] finish to get instances list."))
        return list_vm_name
    
    def plug_vifs(self, instance, network_info):
        """Plug VIFs into networks."""
        self._vmops.plug_vifs(instance, network_info)
    
    def get_info(self, instance, check_managed=False):
        """Return info about the VM instance."""
        LOG.info(_("[cas::] begin to get the info of instance[%s].") % instance['uuid'])
        vm_info = self._vmops.get_info(instance,check_managed=check_managed,isDb='true')
        LOG.info(_("[cas::] finish to get the info of instance[%s].") % instance['uuid'])
        return vm_info
    
    def get_available_nodes(self, refresh=False):
        """Returns nodenames of all nodes managed by the compute service.
        
        This method is for multi compute-nodes support. If a driver supports
        multi compute-nodes, this method returns a list of nodenames managed
        by the service. Otherwise, this method should return
        [hypervisor_hostname]."""
        nodenames = self._host.get_available_nodes()
        LOG.info(_("[cas::] get available nodes %s.") % nodenames)
        return nodenames
    
    def get_available_resource(self, nodename):
        """Retrieve resource information.
        
        This method is called when nova-compute launches, and
        as part of a periodic task that records the results in the DB.
        
        :returns: dictionary describing resources
        
        """
        LOG.info(_("[cas::] begin to get the available resource of node:%s.") % nodename)
        # Updating host information
        resource = self._host.get_available_resources(nodename)
        LOG.info(_("[cas::] finish to get the available resource of node:%s.") % nodename)
        return resource
    
    def query_instance_node_info(self, nodename):
        LOG.info(_("[cas::] begin to query node info, nodename: %s.") % nodename)
        nodeInfo = self._host.query_instance_node_info(nodename)
        LOG.info(_("[cas::] finish to query node info, nodename: %s.") % nodename)
        return nodeInfo
    
    def change_instance_display_name(self, context, instance, name):
        LOG.info(_("[cas::] begin to change instance[%s] display name.") % instance['uuid'])
        self._vmops.change_instance_display_name(context,instance,name)
        LOG.info(_("[cas::] finish to change instance[%s] display name.") % instance['uuid'])
        
    def power_on(self, context, instance, network_info,
                 block_device_info=None):
        """Power on the specified instance."""
        LOG.info(_("[cas::] begin to power on instance[%s].") % instance['uuid'])
        self._vmops.power_on(instance)
        LOG.info(_("[cas::] finish to power on instance[%s].") % instance['uuid'])
    
    def get_vnc_console(self, context, instance):
        LOG.info(_("[cas::] begin to get instance[%s] vnc console.") % instance['uuid'])
        vnc_info = self._vmops.get_vnc_console(instance)
        LOG.info(_("[cas::] finish to get instance[%s] vnc console.") % instance['uuid'])
        return vnc_info
    
    def get_console_output(self, context, instance):
        """Return log info of console."""
        # The Cas do not provide a way
        # to get the text based console format.
        LOG.info(_("[cas::] begin to get console output."))
        log_data = self._vmops.get_console_output(instance)
        LOG.info(_("[cas::] finish to get console output."))
        return log_data
    
    def destroy(self, context, instance, network_info, block_device_info=None,
                destroy_disks=True, migrate_data=None):
        """Destroy VM instance."""
        LOG.info(_("[cas::] begin to destroy instance[%s].") % instance['uuid'])
        block_device_mapping = driver.block_device_info_get_mapping(block_device_info)
        
        if task_states.RESIZE_REVERTING == instance['task_state']:
            self._vmops.revert_migration(instance,network_info,block_device_mapping)
        else:
            if task_states.SPAWNING == instance['task_state']:
                destroy_type = destroy_type_map['delete_disk']
            else:
                destroy_type = destroy_type_map[CONF.cas.destroy_type]
            self._vmops.destroy(context,instance,network_info,block_device_mapping,False,destroy_type)
        
        LOG.info(_("[cas::] finish to destroy instance[%s].") % instance['uuid'])
    
    def power_off(self, instance, timeout=0, retry_interval=0):
        """Power off the specified instance."""
        LOG.info(_("[cas::] begin to power off instance[%s].") % instance['uuid'])
        self._vmops.power_off(instance)
        LOG.info(_("[cas::] finish to power off instance[%s].") % instance['uuid'])
    
    def cloud_power_off(self, instance, type):
        LOG.info(_("[cas::] begin to power off instance[%s] with function[cloud_power_off]. type:%s") % (instance['uuid'],type))
        if type == 'HARD':
            self._vmops.power_off(instance,force=True)
        else:
            self._vmops.power_off(instance)
        LOG.info(_("[cas::] finish to power off instance[%s] with function[cloud_power_off]. type:%s") % (instance['uuid'],type))
    
    def reboot(self, context, instance, network_info, reboot_type,
               block_device_info=None, bad_volumes_callback=None):
        """Reboot VM instance."""
        LOG.info(_("[cas::] begin to reboot instance[%s]. reboot_type:%s") % (instance['uuid'],reboot_type))
        if reboot_type == 'HARD':
            self._vmops.power_off(instance,force=True)
            self._vmops.power_on(instance)
        else:
            self._vmops.reboot(instance, network_info)
        LOG.info(_("[cas::] finish to reboot instance[%s]. reboot_type:%s") % (instance['uuid'],reboot_type))
    
    def pause(self, instance):
        """Pause VM instance."""
        LOG.info(_("[cas::] begin to pause instance[%s].") % instance['uuid'])
        self._vmops.pause(instance)
        LOG.info(_("[cas::] finish to pause instance[%s].") % instance['uuid'])
    
    def unpause(self, instance):
        """Unpause paused VM instance."""
        LOG.info(_("[cas::] begin to unpause instance[%s].") % instance['uuid'])
        self._vmops.unpause(instance)
        LOG.info(_("[cas::] finish to unpause instance[%s].") % instance['uuid'])
    
    def suspend(self, context, instance):
        """Suspend the specified instance."""
        LOG.info(_("[cas::] begin to suspend instance[%s].") % instance['uuid'])
        self._vmops.suspend(instance)
        LOG.info(_("[cas::] finish to suspend instance[%s].") % instance['uuid'])
    
    def resume(self, context, instance, network_info, block_device_info=None):
        """Resume the suspended VM instance."""
        LOG.info(_("[cas::] begin to resume instance[%s].") % instance['uuid'])
        self._vmops.resume(instance)
        LOG.info(_("[cas::] finish to resume instance[%s].") % instance['uuid'])
    
    def snapshot(self, context, instance, image_id, update_task_state):
        """Create snapshot from a running VM instance."""
        LOG.info(_("[cas::] begin to snapshot instance[%s].") % instance['uuid'])
        self._vmops.snapshot(context, instance, image_id, update_task_state)
        LOG.info(_("[cas::] finish to snapshot instance[%s].") % instance['uuid'])
    
    def rebuild(self, context, instance, image_meta, injected_files,
                admin_password, bdms, detach_block_devices,
                attach_block_devices, network_info=None,
                recreate=False, block_device_info=None,
                preserve_ephemeral=False, **kwargs):
        """rebuild instance."""
        LOG.info(_("[cas::] begin to rebuild instance[%s].") % instance['uuid'])
        
        destroy_type = destroy_type_map['retain_disk'] if recreate else destroy_type_map['delete_disk']
        block_device_mapping = driver.block_device_info_get_mapping(block_device_info)
        self._vmops.destroy(context,instance,network_info,block_device_mapping,recreate,destroy_type)
        
        LOG.info(_("[cas::] begin to deal block devices of instance[%s].") % instance['uuid'])
        detach_block_devices(context,bdms)
        
        instance.task_state = task_states.REBUILD_BLOCK_DEVICE_MAPPING
        instance.save(expected_task_state=[task_states.REBUILDING])
        
        if not recreate:
            ephemerals = list(filter(block_device.new_format_is_ephemeral,bdms))
            swap = list(filter(block_device.new_format_is_swap,bdms))
            block_device_mapping = list(filter(driver_block_device.is_block_device_mapping, bdms))
            
            instance['root_device_name'] = self.default_root_device_name(instance, image_meta)
            self.default_device_names_for_instance(instance,instance['root_device_name'],ephemerals,swap,block_device_mapping)
        
        block_device_info = attach_block_devices(context, instance, bdms)
        LOG.info(_("[cas::] finish to deal block devices of instance[%s].") % instance['uuid'])
        
        instance.task_state = task_states.REBUILD_SPAWNING
        instance.save(expected_task_state=[task_states.REBUILD_BLOCK_DEVICE_MAPPING])
        
        ephemerals = driver.block_device_info_get_ephemerals(block_device_info)
        swap = driver.block_device_info_get_swap(block_device_info)
        block_device_mapping = driver.block_device_info_get_mapping(block_device_info)
        block_devices = {'block_device_mapping':block_device_mapping,'ephemerals':ephemerals,'swap':swap}
        
        self._vmops.spawn(context,instance,image_meta,injected_files,admin_password,network_info,block_devices,recreate)
        LOG.info(_("[cas::] finish to rebuild instance[%s].") % instance['uuid'])
    
    def get_diagnostics(self, instance):
        LOG.info(_("[cas::] begin to get diagnostics, instance[%s].") % instance['uuid'])
        diags = self._vmops.get_diagnostics(instance)
        LOG.info(_("[cas::] finish to get diagnostics, instance[%s].") % instance['uuid'])
        return diags
    
    def get_instance_diagnostics(self, instance):
        LOG.info(_("[cas::] begin to get instance diagnostics, instance[%s].") % instance['uuid'])
        diags = self._vmops.get_instance_diagnostics(instance)
        LOG.info(_("[cas::] finish to get instance diagnostics, instance[%s].") % instance['uuid'])
        return diags
    
    def get_volume_connector(self, instance):
        """
        Return volume connector information.
        ip:
        initiator: The volume is on local host,so initiator is not necessary now.
        hostName:
        hostId:
        """
        LOG.info(_("[cas::] begin to get volume connector..............."))
        hostname = self._vmops.get_instance_hostname(instance['uuid'])
        connector = self._host.get_storage_adapter_connector(instance['node'],hostname)
        connector['vmUUID'] = instance['uuid']
        LOG.info(_("connector info: %s") % connector)
        LOG.info(_("[cas::] finish to get volume connector..............."))
        return connector
    
    @property
    def need_legacy_block_device_info(self):
        return False
    
    def default_root_device_name(self, instance, image_meta, root_bdm=None):
        default_disk_bus = self._host.get_platform_para(instance.node,'default_disk_bus')
        disk_bus = self._imageops.get_image_disk_bus(image_meta,default_disk_bus)
        instance['system_metadata']['sys_disk_bus'] = disk_bus
        
        if instance['image_ref']:
            disk_format = self._imageops.get_image_disk_format(image_meta)
            if disk_format == 'iso':
                if disk_bus == 'ide':
                    iso_reserved_devices = ['/dev/hdb','/dev/hdc']
                elif disk_bus == 'virtioScsi':
                    iso_reserved_devices = ['/dev/sdb','/dev/sdc']
                else:
                    iso_reserved_devices = ['/dev/hda','/dev/hdb']
                instance['system_metadata']['reserved_devices'] = repr(iso_reserved_devices)
        
        return {'virtio':'/dev/vda','scsi':'/dev/sda','ide':'/dev/hda','virtioScsi':'/dev/sda'}[disk_bus]
    
    def _default_device_names_for_instance_x86(self, instance, root_device_name, *block_device_lists):
        iso_reserved_devices = eval(instance['system_metadata'].get('reserved_devices','[]'))
        
        ide_name_list = list(iso_reserved_devices)
        device_list_map = {'/dev/vd':[],'/dev/sd':[],'/dev/hd':ide_name_list}
        cdrom_prefix = '/dev/hd'
        
        try:
            root_prefix, root_letter = block_device.match_device(root_device_name)
        except (TypeError, AttributeError, ValueError):
            raise exception.InvalidDevicePath(path=root_device_name)
        
        reserved_name_list = device_list_map.get(root_prefix)
        if reserved_name_list is None or root_device_name in reserved_name_list:
            raise exception.InvalidDevicePath(path=root_device_name)
        else:
            reserved_name_list.append(root_device_name)
        
        for bdm in itertools.chain(*block_device_lists):
            if instance['image_ref'] or bdm.device_name != root_device_name:
                device_name = utils.get_next_device_name(instance,reserved_name_list,root_device_name)
                bdm.device_name = device_name
                bdm.save()
                reserved_name_list.append(device_name)
        
        new_reserved_devices = []
        if configdrive.required_by(instance):
            if CONF.config_drive_format == 'iso9660':
                if cdrom_prefix == root_prefix:
                    device_name = utils.get_next_device_name(instance,reserved_name_list,'/dev/hda')
                    reserved_name_list.append(device_name)
                else:
                    device_name = utils.get_next_device_name(instance,ide_name_list,'/dev/hda')
                    ide_name_list.append(device_name)
            else:
                device_name = utils.get_next_device_name(instance,reserved_name_list,root_device_name)
                reserved_name_list.append(device_name)
                device_name = 'disk:' + device_name
            new_reserved_devices.append(device_name)
        
        if CONF.cas.useVirtualCDROM:
            if cdrom_prefix == root_prefix:
                device_name = utils.get_next_device_name(instance,reserved_name_list,'/dev/hda')
                reserved_name_list.append(device_name)
            else:
                device_name = utils.get_next_device_name(instance,ide_name_list,'/dev/hda')
                ide_name_list.append(device_name)
            new_reserved_devices.append(device_name)
        
        try:
            bare_disk_num = int(instance.flavor.extra_specs.get('bare_disk_num','0'))
            while bare_disk_num > 0:
                device_name = utils.get_next_device_name(instance,reserved_name_list,root_device_name)
                reserved_name_list.append(device_name)
                new_reserved_devices.append(device_name)
                bare_disk_num = bare_disk_num - 1
        except Exception:
            LOG.error(_("the bare disk info is invalid,please check!"))
            raise cas_error.CasVmException()
        
        if new_reserved_devices:
            instance['system_metadata']['reserved_devices'] = repr(iso_reserved_devices+new_reserved_devices)
    
    def _default_device_names_for_instance_aarch64(self,instance,root_device_name,*block_device_lists):
        iso_reserved_devices = eval(instance['system_metadata'].get('reserved_devices','[]'))
    
        ios_name_list = list(iso_reserved_devices)
        device_list_map = {'/dev/vd':[],'/dev/sd':ios_name_list}
        try:
            root_prefix,root_letter = block_device.match_device(root_device_name)
        except (TypeError,AttributeError,ValueError):
            raise exception.InvalidDevicePath(path=root_device_name)
        reserved_name_list = device_list_map.get(root_prefix)
        if reserved_name_list is None or root_device_name in reserved_name_list:
            raise exception.InvalidDevicePath(path=root_device_name)
        else:
            reserved_name_list.append(root_device_name)
    
        for bdm in itertools.chain(*block_device_lists):
            if instance['image_ref'] or bdm.device_name != root_device_name:
                device_name = utils.get_next_device_name(instance,reserved_name_list,root_device_name)
                bdm.device_name = device_name
                bdm.save()
                reserved_name_list.append(device_name)
    
        new_reserved_devices = []
        if configdrive.required_by(instance):
            if CONF.config_drive_format == 'iso9660':
                device_name = utils.get_next_device_name(instance,reserved_name_list,'/dev/sda')
                reserved_name_list.append(device_name)
            else:
                device_name = utils.get_next_device_name(instance,reserved_name_list,root_device_name)
                reserved_name_list.append(device_name)
                device_name = 'disk:' + device_name
            new_reserved_devices.append(device_name)
    
        if CONF.cas.useVirtualCDROM:
            device_name = utils.get_next_device_name(instance,reserved_name_list,'/dev/sda')
            reserved_name_list.append(device_name)
            new_reserved_devices.append(device_name)
        
        try:
            bare_disk_num = int(instance.flavor.extra_specs.get('bare_disk_num','0'))
            while bare_disk_num > 0:
                device_name = utils.get_next_device_name(instance,reserved_name_list,root_device_name)
                reserved_name_list.append(device_name)
                new_reserved_devices.append(device_name)
                bare_disk_num = bare_disk_num - 1
        except Exception:
            LOG.error(_("the bare disk info is invalid,please check!"))
            raise cas_error.CasVmException()
        
        if new_reserved_devices:
            instance['system_metadata']['reserved_devices'] = repr(iso_reserved_devices + new_reserved_devices)

    def default_device_names_for_instance(self,instance,root_device_name,*block_device_lists):
        platform = self._host.get_platform_para(instance.node,'kernel_type')
        if platform == "x86_64":
            self._default_device_names_for_instance_x86(instance,root_device_name,*block_device_lists)
        elif platform == "aarch64":
            self._default_device_names_for_instance_aarch64(instance,root_device_name,*block_device_lists)
        else:
            LOG.error(_("not support platform kernel_type:%s now") % platform)
            raise cas_error.CasHostException()
    
    def get_device_name_for_instance(self, instance, bdms, block_device_obj):
        bus_map = {'virtio':'/dev/vd','scsi':'/dev/sd','ide':'/dev/hd','virtioScsi':'/dev/sd'}
        default_disk_bus = self._host.get_platform_para(instance.node,'default_disk_bus')
        sys_disk_bus = instance['system_metadata'].get('sys_disk_bus',default_disk_bus)
        reserved_devices = eval(instance['system_metadata'].get('reserved_devices','[]'))
        
        obj_disk_bus = block_device_obj.get('disk_bus')
        if obj_disk_bus:
            if obj_disk_bus not in bus_map:
                LOG.error(_("Invalid disk_bus %s, bdm:%s") % (obj_disk_bus,block_device_obj))
                raise exception.InvalidBDM()
        else:
            obj_disk_bus = sys_disk_bus
        
        obj_device_name = block_device_obj.get("device_name")
        if obj_device_name:
            try:
                match = re.match("(^/dev/[vsh]d)([a-z]$)", obj_device_name)
                if not match:
                    raise exception.InvalidDevicePath(path=obj_device_name)
                else:
                    req_prefix, req_letter = match.groups()
            except (TypeError, AttributeError, ValueError):
                raise exception.InvalidDevicePath(path=obj_device_name)
            
            if instance['image_ref']:
                if obj_disk_bus == sys_disk_bus or instance['root_device_name'][0:-1] == req_prefix:
                    if instance['root_device_name'][-1] == req_letter:
                        raise exception.InvalidDevicePath(path=obj_device_name)
            for bdm in bdms:
                device_name = bdm.device_name
                if (bdm.get('disk_bus') or sys_disk_bus) == obj_disk_bus or device_name[0:-1] == req_prefix:
                    if device_name[-1] == req_letter:
                         raise exception.InvalidDevicePath(path=obj_device_name)
            for reserved_device in reserved_devices:
                device_name = reserved_device.split(':')[-1]
                if device_name == obj_device_name:
                    raise exception.InvalidDevicePath(path=obj_device_name)
                if reserved_device.startswith('disk:') and obj_disk_bus == sys_disk_bus:
                    if device_name[-1] == req_letter:
                        raise exception.InvalidDevicePath(path=obj_device_name)
                if not reserved_device.startswith('disk:') and obj_disk_bus == 'ide':
                    if device_name[-1] == req_letter:
                        raise exception.InvalidDevicePath(path=obj_device_name)
            return obj_device_name
        else:
            reserved_name_list = []
            if instance['image_ref']:
                if obj_disk_bus == sys_disk_bus or instance['root_device_name'][0:-1] == bus_map[obj_disk_bus]:
                    reserved_name_list.append(instance['root_device_name'])
            for bdm in bdms:
                if (bdm.get('disk_bus') or sys_disk_bus) == obj_disk_bus or bdm.device_name[0:-1] == bus_map[obj_disk_bus]:
                    reserved_name_list.append(bdm.device_name)
            for reserved_device in reserved_devices:
                device_name = reserved_device.split(':')[-1]
                if device_name[0:-1] == bus_map[obj_disk_bus]:
                    reserved_name_list.append(device_name)
                if reserved_device.startswith('disk:') and obj_disk_bus == sys_disk_bus:
                    reserved_name_list.append(device_name)
                if not reserved_device.startswith('disk:') and obj_disk_bus == 'ide':
                    reserved_name_list.append(device_name)
            obj_device_name = utils.get_next_device_name(instance,reserved_name_list,bus_map[obj_disk_bus]+'a')
            return obj_device_name
    
    def cloud_attach_interface(self, context, instance, image_meta, vif, bodyinfo):
        LOG.info(_("[cas::] begin to attach interface to instance[%s] with function[cloud_attach_interface]") % instance['uuid'])
        self._vmops.cloud_attach_interface(instance,vif)
        LOG.info(_("[cas::] finish to attach interface to instance[%s] with function[cloud_attach_interface]") % instance['uuid'])
    
    def attach_volume(self, context, connection_info, instance, mountpoint, 
                      disk_bus=None, device_type=None, encryption=None):
        """Atach volume storage to VM instance."""
        LOG.info(_("[cas::] begin to attach volume to instance[%s].") % instance['uuid'])
        self._vmops.attach_volume(context,connection_info,instance,mountpoint,disk_bus)
        LOG.info(_("[cas::] finish to attach volume to instance[%s].") % instance['uuid'])
    
    def detach_volume(self, connection_info, instance, mountpoint, encryption=None):
        """Detach volume storage to VM instance."""
        LOG.info(_("[cas::] begin to detach volume from instance[%s].") % instance['uuid'])
        self._vmops.detach_volume(connection_info, instance, mountpoint)
        LOG.info(_("[cas::] finish to detach volume from instance[%s].") % instance['uuid'])
    
    def attach_interface(self, instance, image_meta, vif):
        """Attach an interface to the instance."""
        LOG.info(_("[cas::] begin to attach interface to instance[%s].") % instance['uuid'])
        self._vmops.attach_interface(instance,image_meta,vif)
        LOG.info(_("[cas::] finish to attach interface to instance[%s].") % instance['uuid'])
    
    def detach_interface(self, instance, vif):
        """Detach an interface from the instance."""
        LOG.info(_("[cas::] begin to detach interface from instance[%s].") % instance['uuid'])
        self._vmops.detach_interface(instance, vif)
        LOG.info(_("[cas::] finish to detach interface from instance[%s].") % instance['uuid'])
    def get_host_ip_addr(self):
        """ Retrieves the IP address of the dom0 """
        stack = inspect.stack(context=0)
        ArgInfo = inspect.getargvalues(stack[1][0])
        migration = ArgInfo[-1]['migration']
        instance = ArgInfo[-1]['instance']
        new_instance_type = ArgInfo[-1]['instance_type']
        old_instance_type = ArgInfo[-1]['old_instance_type']
        
        return self._vmops.get_cold_migrate_dest_node(instance,migration, new_instance_type['id'] == old_instance_type.id)

    def migrate_disk_and_power_off(self, context, instance, dest,
                                   flavor, network_info,
                                   block_device_info=None,
                                   timeout=0, retry_interval=0):
        """
        Transfers the disk of a running instance in multiple phases, turning
        off the instance before the end.
        """
        LOG.info(_("[cas::] begin to migrate and power off instance[%s].") % instance['uuid'])
        ephemerals = driver.block_device_info_get_ephemerals(block_device_info)
        swap = driver.block_device_info_get_swap(block_device_info)
        block_device_mapping = driver.block_device_info_get_mapping(block_device_info)
        block_devices = {'block_device_mapping':block_device_mapping,'ephemerals':ephemerals,'swap':swap}
        
        disk_info = self._vmops.migrate_disk_and_power_off(context, instance, dest, flavor, 
                                                           network_info, block_devices)
        LOG.info(_("[cas::] finish to migrate and power off instance[%s].") % instance['uuid'])
        return disk_info
    
    def finish_migration(self, context, migration, instance, disk_info,
                         network_info, image_meta, resize_instance,
                         block_device_info=None, power_on=True):
        """Completes a resize."""
        LOG.info(_("[cas::] begin to end migrate instance[%s].") % instance['uuid'])
        block_device_mapping = driver.block_device_info_get_mapping(block_device_info)
        self._vmops.finish_migration(context, migration, instance, disk_info, network_info, 
                                            image_meta, resize_instance, block_device_mapping, power_on)
        LOG.info(_("[cas::] finish to end migrate instance[%s].") % instance['uuid'])
    
    def confirm_migration(self, migration, instance, network_info):
        """Confirms a resize, destroying the source VM."""
        LOG.info(_("[cas::] begin to confirm migrate instance[%s].") % instance['uuid'])
        self._vmops.confirm_migration(migration, instance, network_info)
        LOG.info(_("[cas::] finish to confirm migrate instance[%s].") % instance['uuid'])
    
    def finish_revert_migration(self, context, instance, network_info,
                                block_device_info=None, power_on=True):
        """Finish reverting a resize."""
        LOG.info(_("[cas::] begin to end revert migration instance[%s].") % instance['uuid'])
        block_device_mapping = driver.block_device_info_get_mapping(block_device_info)
        self._vmops.finish_revert_migration(context, instance, network_info, block_device_mapping, power_on)
        LOG.info(_("[cas::] finish to end revert migration instance[%s].") % instance['uuid'])
    
    def ensure_filtering_rules_for_instance(self, instance, network_info):
        pass
    
    def unfilter_instance(self, instance, network_info):
        pass
    
    def check_can_live_migrate_destination_cleanup(self, context,
                                                   dest_check_data):
        pass
    
    def check_can_live_migrate_destination(self, context, instance,
                                           src_compute_info, dst_compute_info,
                                           block_migration=False,
                                           disk_over_commit=False):
        return {}
    
    def get_instance_disk_info(self, instance,
                               block_device_info=None):
        return None
   
 
    def check_can_live_migrate_source(self, context, instance,
                                      dest_check_data,
                                      block_device_info=None):
        LOG.info(_("[cas::] begin to check live migrate source, instance[%s].") % instance['uuid'])
        migrate_data = self._host.check_can_live_migrate_source(dest_check_data)
        LOG.info(_("[cas::] finish to check live migrate source, instance[%s].") % instance['uuid'])
        return migrate_data
    
    def live_migration(self, context, instance, dest,
                       post_method, recover_method, block_migration=False,
                       migrate_data=None):
        LOG.info(_("[cas::] begin to live migrate, instance[%s].") % instance['uuid'])
        try:
            self._vmops.live_migration(instance,migrate_data['pre_live_migration_result'])
        except Exception:
            LOG.info(_("fail to live migrate instance[%s], begin to recover method") % instance['uuid'])
            recover_method(context,instance,dest,block_migration,migrate_data)
            LOG.info(_("fail to live migrate instance[%s], finish recover method") % instance['uuid'])
        else:
            LOG.info(_("success to live migrate instance[%s], begin to post method") % instance['uuid'])
            post_method(context,instance,dest,block_migration,migrate_data)
            LOG.info(_("success to live migrate instance[%s], finish post method") % instance['uuid'])
        LOG.info(_("[cas::] finish to live migrate, instance[%s].") % instance['uuid'])
    
    def pre_live_migration(self, context, instance, block_device_info,
                           network_info, disk_info, migrate_data=None):
        LOG.info(_("[cas::] begin to pre live migrate, instance[%s].") % instance['uuid'])
        block_device_mapping = driver.block_device_info_get_mapping(block_device_info)
        pre_migrate_data = self._vmops.get_live_migrate_dest_host(instance,block_device_mapping,migrate_data)
        for mapping_info in block_device_mapping:
            connection_info = mapping_info['connection_info']
            self._volumeops.attach_lun_device_to_cluster(connection_info,pre_migrate_data['hostName'],instance['node'])
        LOG.info(_("[cas::] finish to pre live migrate, instance[%s].") % instance['uuid'])
        return pre_migrate_data
    
    def post_live_migration(self, context, instance, block_device_info,
                            migrate_data=None):
        LOG.info(_("[cas::] begin to post live migrate, instance[%s].") % instance['uuid'])
        block_device_mapping = driver.block_device_info_get_mapping(block_device_info)
        for mapping_info in block_device_mapping:
            connection_info = mapping_info['connection_info']
            self._volumeops.detach_lun_device_from_cluster(connection_info,instance['node'])
        LOG.info(_("[cas::] finish to post live migrate, instance[%s].") % instance['uuid'])
    
    def post_live_migration_at_source(self, context, instance, network_info):
        pass
    
    def post_live_migration_at_destination(self, context,
                                           instance,
                                           network_info,
                                           block_migration=False,
                                           block_device_info=None):
        pass
    
    def set_admin_password(self, instance, new_pass):
        LOG.info(_("[cas::] begin to set admin password, instance[%s].") % instance['uuid'])
        self._vmops.set_admin_password(instance,new_pass)
        LOG.info(_("[cas::] finish to set admin password, instance[%s].") % instance['uuid'])
    
    def macs_for_instance(self, instance):
        LOG.info(_("[cas::] begin to get instance macs, instance[%s].") % instance['uuid'])
        macs = self._vmops.macs_for_instance(instance)
        LOG.info(_("[cas::] finish to get instance macs, instance[%s].") % instance['uuid'])
        return macs
    
    def get_instance_real_nodename(self, instance):
        nodename = self._vmops.get_instance_real_nodename(instance)
        return nodename
    
    def live_resize(self, instance, new_instance_type):
        LOG.info(_("[cas::] begin to live resize instance, instance[%s].") % instance['uuid'])
        self._vmops.live_resize(instance, new_instance_type)
        LOG.info(_("[cas::] finish to live resize instance, instance[%s].") % instance['uuid'])
    
    def get_instance_tools_info(self, instance):
        LOG.info(_("[cas::] begin to get instance tools info, instance[%s].") % instance['uuid'])
        tools_info = self._vmops.get_instance_tools_info(instance)
        LOG.info(_("[cas::] finish to get instance tools info, instance[%s].") % instance['uuid'])
        return tools_info
    
    def get_disk_path(self, instance):
        LOG.info(_("[cas::] begin to get instance disk path, instance[%s].") % instance['uuid'])
        disk_path = self._vmops.get_disk_path(instance)
        LOG.info(_("[cas::] finish to get instance disk path,instance[%s].") % instance['uuid'])
        return disk_path
    
    def get_instance_ip_addr(self, instance):
        LOG.info(_("[cas::] begin to get instance ip addr, instance[%s].") % instance['uuid'])
        ip_addr = self._vmops.get_instance_ip_addr(instance['uuid'])
        LOG.info(_("[cas::] finish to get instance ip addr,instance[%s].") % instance['uuid'])
        return ip_addr
    
    def snapshot_create(self, context, instance, memory_included, snap_name):
        LOG.info(_("[cas::] begin to create snapshot instance[%s] snap_name:%s.") % (instance['uuid'], snap_name))
        snapshot = self._vmops.snapshot_create(context, instance, memory_included, snap_name)
        LOG.info(_("[cas::] finish to create snapshot instance[%s] snap_name:%s.") % (instance['uuid'], snap_name))
        return snapshot
    
    def snapshot_revert(self, context, instance, snap_name):
        LOG.info(_("[cas::] begin to revert snapshot instance[%s] snap_name:%s.") % (instance['uuid'],snap_name))
        snapshot = self._vmops.snapshot_revert(context, instance, snap_name)
        LOG.info(_("[cas::] finish to revert snapshot instance[%s] snap_name:%s.") % (instance['uuid'], snap_name))
        return snapshot
    
    def snapshot_list(self, context, instance):
        LOG.info(_("[cas::] begin to get snapshot list instance[%s].") % instance['uuid'])
        snapshot_list = self._vmops.snapshot_list(context, instance)
        LOG.info(_("[cas::] finish to get snapshot list instance[%s].") % instance['uuid'])
        return snapshot_list
    
    def snapshot_delete(self, context, instance, snap_name):
        LOG.info(_("[cas::] begin to delete snapshot instance[%s] snap_name:%s.") % (instance['uuid'], snap_name))
        self._vmops.snapshot_delete(context,instance,snap_name)
        LOG.info(_("[cas::] finish to delete snapshot instance[%s] snap_name:%s.") % (instance['uuid'], snap_name))
    
    def update_instance_datastore(self, instance):
        LOG.info(_("[cas::] begin to update instance datastore,instance[%s].") % instance['uuid'])
        self._vmops.update_instance_datastore(instance)
        LOG.info(_("[cas::] finish to update instance datastore,instance[%s].") % instance['uuid'])
    
    def attach_cd(self, context, instance, cd_path):
        LOG.info(_("[cas::] begin to attached cdrom,instance[%s].") % instance['uuid'])
        self._vmops.attach_cd(context,instance,cd_path)
        LOG.info(_("[cas::] finish to attached cdrom,instance[%s].") % instance['uuid'])
    
    def detach_cd(self, context, instance, cd_id):
        LOG.info(_("[cas::] begin to detach cdrom,instance[%s].") % instance['uuid'])
        self._vmops.detach_cd(context,instance,cd_id)
        LOG.info(_("[cas::] finish to detach cdrom,instance[%s].") % instance['uuid'])
    
    def get_attached_cd(self, context, instance):
        LOG.info(_("[cas::] begin to get attached cdrom,instance[%s].") % instance['uuid'])
        cdrom_list = self._vmops.get_attached_cd(context,instance)
        LOG.info(_("[cas::] finish to get attached cdrom,instance[%s].") % instance['uuid'])
        return cdrom_list
    
    def instance_set_boot_device(self, context, instance, boot_device):
        LOG.info(_("[cas::] begin to set boot device,instance[%s]." ) % instance['uuid'])
        self._vmops.instance_set_boot_device(context, instance, boot_device)
        LOG.info(_("[cas::] finish to set boot device,instance[%s].") % instance['uuid'])
    
    def get_instance_cpu_and_mem(self, instance_uuid):
        """get cpu and memory information"""
        LOG.info(_("[cas::] begin to get vm cpu and memory information,instance[%s].") % instance_uuid)
        cpu_mem_info = self._vmops.get_instance_cpu_and_mem(instance_uuid)
        LOG.info(_("[cas::] finish to get vm cpu and memory information,instance[%s].") % instance_uuid)
        return cpu_mem_info
    
    def get_instance_resource(self, instance_uuid):
        LOG.info(_("[cas::] begin to get instance[%s] resource.") % instance_uuid)
        resource = self._vmops.get_instance_resource(instance_uuid)
        LOG.info(_("[cas::] finish to get instance[%s] resource.") % instance_uuid)
        return resource
    
    def get_instance_name(self, instance_uuid):
        LOG.info(_("[cas::] begin to get name of instance[%s].") % instance_uuid)
        name = self._vmops.get_instance_name(instance_uuid)
        LOG.info(_("[cas::] finish to get name of instance[%s].") % instance_uuid)
        return name
    
    def import_virtual_disks(self, context, instance_uuid):
        LOG.info(_("[cas::] begin to list instance[%s] virtual disks.") % instance_uuid)
        virtual_disks =  self._vmops.import_virtual_disks(instance_uuid)
        LOG.info(_("[cas::] finish to list instance[%s] virtual disks.") % instance_uuid)
        return virtual_disks
    
    def get_instances_from_cas_host(self, nodename):
        LOG.info(_("[cas::] begin to get instances from node[%s].") % nodename)
        vmlist = self._vmops.get_instances_from_cas_host(nodename)
        LOG.info(_("[cas::] finish to get instances from node[%s].") % nodename)
        return vmlist
    
    def get_network_obj(self, instance_uuid):
        LOG.info(_("[cas::] begin to get instance[%s] network objs.") % instance_uuid)
        network_objs = self._vmops.get_network_obj(instance_uuid)
        LOG.info(_("[cas::] finish to get instance[%s] network objs.") % instance_uuid)
        return network_objs

    def cloud_unmanage_exist_vm(self,context,instance):
        LOG.info(_("[cas::] begin to remove managed flag for instance[%s].") % instance['uuid'])
        self._vmops.cloud_unmanage_exist_vm(instance['uuid'])
        LOG.info(_("[cas::] finish to remove managed flag for instance[%s].") % instance['uuid'])

    def change_instance_description(self, context, instance, description):
        LOG.info(_("[cas::] begin to change description for instance[%s]") % instance['uuid'])
        self._vmops.change_instance_description(instance, description)
        LOG.info(_("[cas::] finish to change description for instance[%s]") % instance['uuid'])
    
class CasAPISession(object):
    """
    Sets up a session with the CAS host and handles all
    the calls made to the host.
    """
    
    def __init__(self, host_ip, username, password, uri_prefix, retry_count, scheme, http_log_debug):
        self._host_ip = host_ip
        self._host_username = username
        self._host_password = password
        self._uri_prefix = uri_prefix
        self._api_retry_count = retry_count
        self._scheme = scheme
        self._http_log_debug = http_log_debug
        self._client = None
        self._xml = casxml.CasXml()
        self._create_session()
    
    def _get_client_object(self):
        """Create the CasClient Object instance."""
        return casclient.CasClient(protocol=self._scheme, host=self._host_ip,
                                username=self._host_username, 
                                password=self._host_password,
                                max_try_count=self._api_retry_count,
                                http_log_debug=self._http_log_debug)
    
    def _create_session(self):
        """Creates a session with the CAS host."""
        if self._client is None:
            self._client = self._get_client_object()
            
        delay = 1
        uri = self.make_cmd_uri('/operator/test')
        while True:
            try:
                resp,body = self.call_method("GET", uri)
                if resp.status_code != 204:
                    raise cas_error.CasHostException()
                return
            except Exception:
                LOG.critical(_("Unable to connect to server at %(server)s, "
                               "please check the network state and the config file of nova-compute, "
                               "sleeping for %(seconds)s seconds") % 
                               {'server': self._host_ip, 'seconds': delay})
                time.sleep(delay)
                delay = min(2 * delay, 60)
    
    def make_cmd_uri(self, module, *args, **kwargs):
        """build url from args"""
        uri = self._uri_prefix + module
        
        for arg in args:
            uri += "/"+arg
        
        if kwargs:
            uri += "?"
            for key, value in kwargs.items():
                uri += key+"="+value+"&"
            uri = uri.rstrip("&")
        
        return uri
    
    def call_method(self, method, uri, **kwargs):
        """
        Calls a method within the module specified with
        args provided.
        """
        try:
            resp,body = self._client.request(method,uri,**kwargs)
        except cas_error.ClientReqException as excep:
            LOG.error(_("Request error, host is %s, uri is %s") % (self._host_ip,uri))
            raise excep
        
        return resp, body
    
    def wait_for_task(self, task_id, interval=3):
        wait_time =  24*60*60
        wait_count = wait_time/interval
        uri = self.make_cmd_uri('/message',task_id)
        while True:
            resp,body = self.call_method("GET",uri)
            if resp.status_code == 200:
                task_info = self._xml.decode_xml("wait_for_task",body)
                if task_info["completed"] == "true":
                    return task_info
            elif resp.status_code == 403:
                LOG.info(_("wait_for_task,resp.status_code == 403"))
            else:
                LOG.error(_("fail to wait task finish,resp.status_code:%s,%s")
                         % (resp.status_code,cas_error.get_http_respond_error(resp)))
                raise cas_error.CasTaskException()
            time.sleep(interval)
            wait_count = wait_count - 1
            if wait_count == 0:
                LOG.error(_("Timeout State: wait_for_task timeout!!!"))
                raise cas_error.CasTaskException()
