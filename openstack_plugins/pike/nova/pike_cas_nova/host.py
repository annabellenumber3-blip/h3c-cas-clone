#add by zhangmingze, 2014-2-12

import time
import math
import random
import ConfigParser

import requests
from requests.packages.urllib3.exceptions import InsecureRequestWarning

from oslo_log import log as logging
from oslo_utils import versionutils as v_utils
from oslo_serialization import jsonutils
from eventlet import semaphore
from nova import context as novacontext
from nova.i18n import _
from nova import objects
from nova.objects import ComputeNode
from nova.objects import fields
from nova.objects import InstanceList
from nova.objects import migration
from nova.objects import migrate_data
from nova.objects import base as obj_base
from nova.virt.casapi import error as cas_error
from nova.virt.casapi import xml as casxml
from nova import utils
from nova import availability_zones as az
from nova.volume import cinder
from keystoneclient.v3  import client as  keystone_client
from keystoneauth1.access import service_catalog as ksa_service_catalog
from keystoneauth1 import plugin
from nova import rpc
from nova.compute import utils as compute_utils

import nova.conf

requests.packages.urllib3.disable_warnings(InsecureRequestWarning)

CONF = nova.conf.CONF

LOG = logging.getLogger(__name__)
COMPUTE_RESOURCE_SEMAPHORE = "compute_resources"

platform_support = {
    'x86_64':{'kernel_type':'x86_64',
              'supported_instances':[('i686','qemu','hvm'),
                                     ('x86_64','qemu','hvm'),
                                     ('i686','kvm','hvm'),
                                     ('x86_64','kvm','hvm')],
              'default_disk_bus':'virtio',
              'default_cpu_mod':'custom',
              'default_cdrom_bus':'ide'},
    
    'aarch64':{'kernel_type':'aarch64',
               'supported_instances':[('aarch64','qemu','hvm'),
                                      ('aarch64','kvm','hvm')],
               'default_disk_bus':'virtioScsi',
               'default_cpu_mod':'host-passthrough',
               'default_cdrom_bus':'scsi'},
    }

class _ContextAuthPlugin(plugin.BaseAuthPlugin):
    """A keystoneauth auth plugin that uses the values from the Context.

    Ideally we would use the plugin provided by auth_token middleware however
    this plugin isn't serialized yet so we construct one from the serialized
    auth data.
    """

    def __init__(self, auth_token, sc):
        super(_ContextAuthPlugin, self).__init__()

        self.auth_token = auth_token
        self.service_catalog = ksa_service_catalog.ServiceCatalogV3(sc)

    def get_token(self, *args, **kwargs):
        return self.auth_token

    def get_endpoint(self, session, service_type=None, interface=None,
                     region_name=None, service_name=None, **kwargs):
        return self.service_catalog.url_for(service_type=service_type,
                                            service_name=service_name,
                                            interface=interface,
                                            region_name=region_name)

class CasConfigParser(ConfigParser.ConfigParser):
    def __init__(self,defaults=None):
        ConfigParser.ConfigParser.__init__(self,defaults=None)

    def optionxform(self,optionstr):
        return optionstr


def update_kaas_annotations(data, info):
    if data:
        headers = {'Content-Type': 'application/strategic-merge-patch+json',
                   'Authorization': 'Bearer ' + data['token']}
        payload = {'metadata': {'annotations': {'k8s.io/vm-status': info}}}
        url = 'https://' + data['vip'] + ':' + data['port'] + '/api/v1/nodes/' + data['hostname']

        try:
            requests.patch(url, headers=headers, data=jsonutils.dumps(payload), verify=False)
        except Exception as exc:
            LOG.error(_("fail to update_kaas_annotations:%s") % exc)


def get_kaas_info(instance):

    payload = {'nodeUuid': instance['uuid']}
    headers = {'Content-Type': 'application/json'}
    result = None
    try:
        resp = requests.post("http://os-kaas-svc.cloudos-iaas.svc.cloudos:15500/cluster/authentication", headers=headers, data=jsonutils.dumps(payload))
    except Exception as exc:
        LOG.error(_("fail to get_kaas_info:%s") % exc)
        return result
    if resp.status_code == 200:
        msg = jsonutils.loads(resp.text)
        if msg['status']:
            result = msg['data']
    return result


class CasHost(object):
    """
    Base implements host related operations.
    """
    obj_base.NovaObjectRegistry.register(migrate_data.LiveMigrateData)
    
    @obj_base.NovaObjectRegistry.register
    class CASLiveMigrateData(migrate_data.LiveMigrateData):
        fields = {'hostId': fields.StringField(),
                  'hostName': fields.StringField(),
                  'storagePool':fields.StringField()}
        
        def set_migrate_host(self, host):
            self.hostId = host['hostId']
            self.hostName = host['hostName']
            self.storagePool = repr(host['storageInfo'])
    
    def __init__(self, session, network, virtapi, virthost):
        self._session = session
        self._network = network
        self._virthost = virthost
        self._compute = virtapi._compute
        self._sem = semaphore.Semaphore()
        self._xml = casxml.HostXml()
        self._host_ip = CONF.cas.host_ip 
        self._hpName = CONF.cas.hpName.decode('utf-8')
        self._osPlat = CONF.cas.os_plat
        self._useLocalStorage = 'true' if CONF.cas.useLocalStorage else 'false'
        self._capabilities = {}
        self._nodes = {}        
        self._exNodes = {}
        self._hostpool_id = self._get_hostpool_id()
        self._clusterList = self._get_cluster_list()
       
        
        
        if CONF.cas.limit_storage_resource:
            self._get_node_storage_resource = self._get_node_storage_resource_limit
        else:
            self._get_node_storage_resource = self._get_node_storage_resource_unlimit
        
        if CONF.cas.limit_numa_resource:
            self._get_numa_topology = self._get_numa_topology_limit
        else:
            self._get_numa_topology = self._get_numa_topology_unlimit
        
        for capability in CONF.cas.compute_capabilities:
            self._capabilities[capability] = True
        
        if CONF.cas.dts_sync:
            try:
                self._volume_api = cinder.API()
                self._auth_context = self._init_auth_context()
                self._cinder_az = self._get_cinder_az()
            except Exception as exc:
                LOG.error(_("failed to host dts_sync init ,exc%s") % exc)
                raise exc
    
    def _get_hostpool_id(self):
        uri = self._session.make_cmd_uri("/hostpool/all")
        resp,body = self._session.call_method("GET",uri)
        if resp.status_code == 200:
            hostpools = self._xml.decode_xml("hostpool_list",body)
            hostpool_id = hostpools.get(self._hpName)
            if not hostpool_id:
                LOG.error(_("hostpool %s doesn't exist") % self._hpName)
                raise cas_error.CasHostException()
            else:
                return hostpool_id
        else:
            LOG.error(_("fail to get hostpool list uri:%s") % uri)
            LOG.error(_("fail to get hostpool list!!!!! resp.status_code:%d,%s")
                     % (resp.status_code,cas_error.get_http_respond_error(resp)))
            raise cas_error.CasHostException()
    
    def _get_respool_by_cluster(self, **queryArgs):
        respool_list = []
        # /cas/casrs/resPool/queryResPool?clusterId={clusterId}&offset={offset}&limit={limit}
        uri = self._session.make_cmd_uri('/resPool/queryResPool', **queryArgs)
        resp, body = self._session.call_method("GET", uri)
        if resp.status_code == 200:
            respool_list = self._xml.decode_xml("respool_list", body)
        else:
            LOG.error(_("fail to query respool list, uri:%s") % uri)
            LOG.error(_("fail to query respool list!!!!! resp.status_code:%d,%s")
                      % (resp.status_code, cas_error.get_http_respond_error(resp)))
        return respool_list
    
    def _query_cluster_gpu(self, clusterId, **queryArgs):
        gpu_list = []
        respool_list = self._get_respool_by_cluster(clusterId=clusterId)
        for resPool in respool_list:
            # /cas/casrs/resPool/queryResPoolGpuList?resPoolId={resPoolId}&offset={offset}&limit={limit}
            uri = self._session.make_cmd_uri('/resPool/queryResPoolGpuList', resPoolId=resPool.get('id'))
            resp, body = self._session.call_method("GET", uri)
            if resp.status_code == 200:
                try:
                    gpu_list.extend(self._xml.decode_xml("gpu_list", body))
                except Exception as e:
                    LOG.error('get gpu_list error %s --- %s', e, e.message)
            else:
                LOG.error(_("fail to query cluster gpu, uri:%s") % uri)
                LOG.error(_("fail to query cluster gpu!!!!! resp.status_code:%d,%s")
                          % (resp.status_code, cas_error.get_http_respond_error(resp)))
        return gpu_list
    
    def _query_cluster_vgpu(self, clusterId, **queryArgs):
        vgpu_list = []
        respool_list = self._get_respool_by_cluster(clusterId=clusterId)
        for resPool in respool_list:
            # /cas/casrs/resPool/queryResPoolVgpuList?resPoolId={resPoolId}&offset={offset}&limit={limit}
            uri = self._session.make_cmd_uri('/resPool/queryResPoolVgpuList', resPoolId=resPool.get('id'))
            resp, body = self._session.call_method("GET", uri)
            if resp.status_code == 200:
                try:
                    vgpu_list.extend(self._xml.decode_xml("vgpu_list", body))
                except Exception as e:
                    LOG.error('get vgpu_list error %s', e)
            else:
                LOG.error(_("fail to query cluster vgpu, uri:%s") % uri)
                LOG.error(_("fail to query cluster vgpu!!!!! resp.status_code:%d,%s")
                          % (resp.status_code, cas_error.get_http_respond_error(resp)))
        return vgpu_list
    
    def _get_cluster_list(self):
        clusterList = {}
        if CONF.cas.clusterName:
            allCluster = self._get_all_cluster()
            for clusterName in CONF.cas.clusterName:
                clusterName = clusterName.decode('utf-8')
                if clusterName in allCluster:
                    clusterList[clusterName] = allCluster[clusterName]
                else:
                    LOG.error(_("hostpool %s doesn't include cluster %s") % (self._hpName,clusterName))
                    raise cas_error.CasHostException()
        return clusterList
    
    def _get_all_cluster(self):
        uri = self._session.make_cmd_uri("/hostpool",self._hostpool_id,'allChildNode')
        resp,body = self._session.call_method("GET",uri)
        if resp.status_code == 200:
            allCluster = self._xml.decode_xml("cluster_list",body)
            return allCluster
        else:
            LOG.error(_("fail to get cluster list uri:%s") % uri)
            LOG.error(_("fail to get cluster list!!!!! resp.status_code:%d,%s")
                     % (resp.status_code,cas_error.get_http_respond_error(resp)))
            raise cas_error.CasHostException()
    
    def _get_host_list(self, **queryArgs):
        uri = self._session.make_cmd_uri("/nova/hostResource",**queryArgs)
        resp,body = self._session.call_method("GET",uri)
        if resp.status_code == 200:
            if self._osPlat == 'cloudos':
                hosts = self._xml.decode_xml("host_all_list", body)
            else:
                hosts = self._xml.decode_xml("host_list",body)
            return hosts
        else:
            LOG.error(_("fail to get host list uri:%s") % uri)
            LOG.error(_("fail to get host list!!!!! resp.status_code:%d,%s")
                     % (resp.status_code,cas_error.get_http_respond_error(resp)))
            raise cas_error.CasHostException()
    
    def get_host_first_nodename(self):
        _context = novacontext.get_admin_context()
        firstNode = ComputeNode.get_first_node_by_host_for_old_compat(_context, self._virthost)
        return firstNode.hypervisor_hostname
    
    def _query_host_storages(self, **queryArgs):
        node_storages = []
        uri = self._session.make_cmd_uri('/nova/node/storage',**queryArgs)
        resp, body = self._session.call_method("GET",uri)
        if resp.status_code == 200:
            node_storages = self._xml.decode_xml("node_storage",body)
        else:
            LOG.error(_("fail to query node storages, uri:%s") % uri)
            LOG.error(_("fail to query node storages!!!!! resp.status_code:%d,%s")
                     % (resp.status_code,cas_error.get_http_respond_error(resp)))
        return node_storages
    
    def _query_host_pci_devices(self, hostName):
        uri = self._session.make_cmd_uri('/nova/pcidevices',hostName=hostName)
        resp, body = self._session.call_method("GET",uri)
        if resp.status_code == 200:
            pci_devices = self._xml.decode_xml("pci_devices",body)
            return jsonutils.dumps(pci_devices)
        else:
            LOG.error(_("fail to get host pci info, uri:%s") % uri)
            LOG.error(_("fail to get host pci info!!!!! resp.status_code:%d,%s")
                     % (resp.status_code,cas_error.get_http_respond_error(resp)))
            return None
    
    def _get_numa_topology_limit(self, numaTopology, hostName):
        uri = self._session.make_cmd_uri('/nova/isolatedCPU',hostName=hostName)
        resp, body = self._session.call_method("GET",uri)
        if resp.status_code == 200:
            if not body:
                LOG.warning(_("host:%s dosen't have any isolated cpu.") % hostName)
                return None
            
            isolated_cpus = set()
            for isolated_cpu in body.split(","):
                isolated_cpus.add(int(isolated_cpu))
            
            node_cells = []
            for cell_info in numaTopology:
                cpus = cell_info['cpus'] & isolated_cpus
                siblings = [sib & cpus for sib in cell_info['siblings'] if len(sib & cpus) > 1]
                mempages = [objects.NUMAPagesTopology(size_kb=pages['size'],total=pages['total'],used=0) for pages in cell_info['mempages']]
                cell = objects.NUMACell(id=cell_info['id'], cpuset=cpus,
                                        socket=cell_info['socket'],
                                        memory=cell_info['memory'],
                                        cpu_usage=0, memory_usage=0,
                                        siblings=siblings,
                                        pinned_cpus=set([]),
                                        mempages=mempages)
                node_cells.append(cell)
            
            return objects.NUMATopology(cells=node_cells)
        else:
            LOG.error(_("fail to get host isolated cpu, uri:%s") % uri)
            LOG.error(_("fail to get host isolated cpu!!!!! resp.status_code:%d,%s")
                     % (resp.status_code,cas_error.get_http_respond_error(resp)))
            return None
    
    def _get_numa_topology_unlimit(self, numaTopology, hostName):
        node_cells = []
        for cell_info in numaTopology:
            cpus = cell_info['cpus']
            siblings = [sib & cpus for sib in cell_info['siblings'] if len(sib & cpus) > 1]
            mempages = [objects.NUMAPagesTopology(size_kb=pages['size'],total=pages['total'],used=0) for pages in cell_info['mempages']]
            cell = objects.NUMACell(id=cell_info['id'], cpuset=cpus,
                                    socket=cell_info['socket'],
                                    memory=cell_info['memory'],
                                    cpu_usage=0, memory_usage=0,
                                    siblings=siblings,
                                    pinned_cpus=set([]),
                                    mempages=mempages)
            node_cells.append(cell)
        
        return objects.NUMATopology(cells=node_cells)
    
    def _query_host_numa_topology(self, hostName):
        uri = self._session.make_cmd_uri('/nova/numatopology',hostName=hostName)
        resp, body = self._session.call_method("GET",uri)
        if resp.status_code == 200:
            numa_topology = self._xml.decode_xml("numa_topology",body)
            return self._get_numa_topology(numa_topology,hostName)
        else:
            LOG.error(_("fail to get host numa topology, uri:%s") % uri)
            LOG.error(_("fail to get host numa topology!!!!! resp.status_code:%d,%s")
                     % (resp.status_code,cas_error.get_http_respond_error(resp)))
            return None
    
    def _get_node_storage_resource_limit(self, node):
        freeSize = 0
        totalSize = 0
        storagePoolName = None
        
        hosts = node['nodeHosts']
        for host in hosts.values():
            if host['status'] == 1:
                for localPools in host['localPools'].values():
                    for storagePool in localPools.values():
                        if storagePool['status'] == 1:
                            if storagePool['freeSize'] > freeSize:
                                freeSize = storagePool['freeSize']
                                totalSize = storagePool['totalSize']
                                storagePoolName = storagePool['name']
                            break
        
        for host in hosts.values():
            if host['status'] == 1:
                for storagePool in node['sharePools'].values():
                    if storagePool['status'] == 1 and storagePool['freeSize'] > freeSize:
                        freeSize = storagePool['freeSize']
                        totalSize = storagePool['totalSize']
                        storagePoolName = storagePool['name']
                break
        
        return {'local_gb':totalSize/1024, 'local_gb_used':(totalSize-freeSize)/1024, 'ds_name':storagePoolName}
    
    def _get_node_storage_resource_unlimit(self, node):
        freeSize = 0
        totalSize = 0
        
        hosts = node['nodeHosts']
        for host in hosts.values():
            if host['status'] == 1:
                for localPools in host['localPools'].values():
                    for storagePool in localPools.values():
                        if storagePool['status'] == 1:
                            freeSize = freeSize + storagePool['freeSize']
                            totalSize = totalSize + storagePool['totalSize']
                            break
        
        for host in hosts.values():
            if host['status'] == 1:
                for storagePool in node['sharePools'].values():
                    if storagePool['status'] == 1:
                        freeSize = freeSize + storagePool['freeSize']
                        totalSize = totalSize + storagePool['totalSize']
                break
        
        return {'local_gb':totalSize/1024, 'local_gb_used':(totalSize-freeSize)/1024}

    def _get_node_platform(self,node):
        LOG.info(_("node:%s") % (node))
        hosts = node['nodeHosts']
        node_platform = None
        for host in hosts.values():
            if host['status'] == 1:
                host_platform = host.get('kernel_type',None)
                if host_platform is None:
                    LOG.error(_("host platform is None"))
                    raise cas_error.CasHostException()
                
                if host_platform not in platform_support.keys():
                    LOG.error(_("host platform:%s") % host_platform)
                    raise cas_error.CasHostException()
                
                if node_platform == None:
                    node_platform = host_platform
                elif node_platform != host_platform:
                    LOG.error(_("diff platform exist:%s,%s,%s") % (node,node_platform,host_platform))
                    raise cas_error.CasHostException()
    
        if node_platform is None:
            LOG.error(_("node platform:%s") % node_platform)
            raise cas_error.CasHostException()
    
        node['platform'] = node_platform
        LOG.info(_("node platform:%s \n %s") % (node,node_platform))
        return node_platform
    
    def _get_node_resource(self, nodename):
        nodeStatus = {'vcpus':0,'memory_mb':0,'local_gb':0,'vcpus_used':0,
                      'memory_mb_used':0,'local_gb_used':0,'status':0,'physical_cpu':0}
        
        node = self._nodes.get(nodename)
        if node is None:
            LOG.error(_("node is disappeared by itself. nodename:%s") % nodename)
            raise cas_error.CasHostException()

        hosts = node['nodeHosts']
        for host in hosts.values():
            if host['status'] == 1:
                nodeStatus['vcpus'] += host['cpu']
                nodeStatus['physical_cpu'] += host['physical_cpu']
                nodeStatus['vcpus_used'] += int(math.ceil(host['cpu'] * host['cpuRate']  / 100))
                nodeStatus['memory_mb'] += host['memory']
                nodeStatus['memory_mb_used'] += int(math.ceil(host['memory'] * host['memoryRate'] / 100))
                nodeStatus['memory_isolation'] = 0 if host.get('memory_isolation') is None else host.get('memory_isolation')
            else:
                nodeStatus['status'] = -1
                LOG.error(_("node status is error. nodename:%s") % nodename)
                return nodeStatus

        self._get_node_platform(node)
        self._update_instance_node_info(nodename,node)
        nodeStatus['gpus'] = node['gpus']
        nodeStatus['vgpus'] = node['vgpus']

        storageResource = self._get_node_storage_resource(node)
        nodeStatus.update(storageResource)
        
        pci_passthrough_devices = node.get('pci_passthrough_devices')
        if pci_passthrough_devices is not None:
            nodeStatus['pci_passthrough_devices'] = pci_passthrough_devices
        
        numa_topology = node.get('numa_topology')
        nodeStatus['numa_topology'] = None if numa_topology is None else numa_topology._to_json()

        node_local_raw_disk = self._get_node_local_raw_disks(hosts)
        if node_local_raw_disk is not None and  len(node_local_raw_disk) > 0:
            nodeStatus['local_raw_disks'] = node_local_raw_disk

        return nodeStatus

    def _sync_instance_host_node(self,vmUUIDs,nodename):
        try:
            _context = novacontext.get_admin_context()
            filters = {'uuid':vmUUIDs,'deleted':False}
            instances = InstanceList.get_by_filters(_context, filters, use_slave=True)
            for instance in instances:
                if self._host_ip in instance['node']:
                    srcHost = instance['host']
                    srcNodeName = instance['node']
                    if srcHost != self._virthost or srcNodeName != nodename:
                        instance['host'] = self._virthost
                        instance['node'] = nodename
                        LOG.info(_("sync instance host node,uuid:%s,srcHost:%s,srcNodeName:%s,newHost:%s,newNodeName:%s")
                                 % (instance['uuid'], srcHost, srcNodeName, instance['host'], instance['node']))

                        @utils.synchronized(instance.uuid)
                        def _locked_save_instance():
                            instance.save()
                        
                        _locked_save_instance()
            
        except Exception as exc:
            raise exc
    
    def _list_node_instances(self, **queryArgs):
        uri = self._session.make_cmd_uri('/nova/vmList',**queryArgs)
        resp, body = self._session.call_method("GET",uri)
        if resp.status_code == 200:
            list_vm = self._xml.decode_xml("list_instances",body)
            return list_vm
        else:
            LOG.error(_("fail to get instances list, uri:%s") % uri)
            LOG.error(_("fail to get instances list!!!!! resp.status_code:%d,%s")
                     % (resp.status_code,cas_error.get_http_respond_error(resp)))
            raise cas_error.CasHostException()
    
    def get_node_numa_topology(self, nodename):
        return self._nodes[nodename]['numa_topology']
    
    def get_available_nodes(self):
        nodenames = []
        self._update_nodes_list()
        for nodename in self._nodes.keys():
            if len(self._nodes[nodename]['nodeHosts']) > 0:
                nodenames.append(nodename)
        return nodenames
    
    def get_nodename_by_hostId(self, hostId):
        return self._exNodes[hostId]['nodename']
    
    def get_node_by_nodename(self, nodename):
        return self._nodes.get(nodename)
    
    def get_valid_host_info(self, nodename, hostName=None, storagePool=None):
        hostInfo = {}
        
        if nodename not in self._nodes:
            nodename = self.get_host_first_nodename()
        else:
            hostInfo.update(self._nodes[nodename]['nodeInfo'])
        hostInfo['clusterName'] = self._nodes[nodename]['clusterName']
        
        if hostName:
            if hostName in self._nodes[nodename]['nodeHosts']:
                hostInfo['hostName'] = hostName
            else:
                LOG.error(_("hostname %s is not included in node %s, invalid hostname") % (hostName,nodename))
                raise cas_error.CasHostException()
        
        if storagePool:
            if storagePool in self._nodes.values()[0]['sharePools']:
                hostInfo['location'] = storagePool
            else:
                if hostInfo.get('hostName'):
                    for localPools in self._nodes[nodename]['nodeHosts'][hostInfo['hostName']]['localPools'].values():
                        if storagePool in localPools:
                            hostInfo['location'] = storagePool
                            break
                    else:
                        LOG.error(_("storagePool %s is not included in host %s, invalid storagePool") % (storagePool,hostInfo['hostName']))
                        raise cas_error.CasHostException()
                else:
                    LOG.error(_("local storagePool %s need a host, invalid storagePool") % storagePool)
                    raise cas_error.CasHostException()
        
        return hostInfo
    
    def get_available_resources(self, nodename):
        baseInfo = {'hypervisor_type': 'QEMU',
                    'hypervisor_version': v_utils.convert_version_to_int('2.7'),
                    'hypervisor_hostname': nodename,
                    'cpu_info': '',
                    'host_ip': self._host_ip,
                    'stats': self._capabilities
                    }
        
        data = self._get_node_resource(nodename)
        if data['status'] == -1:
            return -1
        baseInfo['supported_instances'] = self.get_platform_para(nodename,'supported_instances')
        data.update(baseInfo)
        
        return data
    
    def list_instances(self):
        list_vm_name = []
        self._update_nodes_list()
        for nodename,node in self._nodes.items():
            list_vm = self._list_node_instances(**node['nodeInfo'])
            list_vm_name += list_vm['names']
            self._sync_instance_host_node(list_vm['uuids'], nodename)
        return list_vm_name
    
    def cloud_get_physical_cpu(self):
        physical_cpu = 0
        self._update_nodes_list()
        for nodename, node in self._nodes.items():
            node_resource =  self._get_node_resource(nodename)
            if node_resource['status'] == 0:
                physical_cpu += node_resource['physical_cpu']
        return physical_cpu
    
    def has_space_on_host(self, image_size):
        uri = self._session.make_cmd_uri('/nova/pool',size=str(image_size))
        resp,body = self._session.call_method("GET",uri)
        if resp.status_code == 200:
            pool_info = self._xml.decode_xml("pool_info",body)
            if pool_info['freeSize'] > image_size:
                return True
            else:
                return False
        else:
            LOG.error(_("fail to get host space, uri:%s") % uri)
            LOG.error(_("fail to get host space!!!!! resp.status_code:%d,%s")
                     % (resp.status_code,cas_error.get_http_respond_error(resp)))
            raise cas_error.CasHostException()
    
    def query_instance_node_info(self, nodename):
        return self._query_node_storage_pool(nodename)
    
    def get_storage_adapter_connector(self, nodename, hostname=None):
        if nodename not in self._nodes:
            nodename = self.get_host_first_nodename()
        clusterName = self._nodes[nodename]['clusterName']
        clusterId = self._nodes[nodename]['clusterId']

        if not hostname:
            hostname = self._nodes[nodename]['nodeInfo']['hostName']
            LOG.info(_("success to get hostname:%s") % hostname)
        
        connector = {'host':self._virthost,'hostIp':self._host_ip,'hpName':self._hpName,'clusterName':clusterName,'clusterId':clusterId}
        
        uri = self._session.make_cmd_uri('/nova/storageAdapter',clusterName=clusterName)
        resp, body = self._session.call_method("GET",uri)
        if resp.status_code == 200:
            hostAdapters = self._xml.decode_xml("storage_adapter_props",body)
            for hostAdapter in hostAdapters:
                name = hostAdapter['host']
                hostAdapter['host'] += '-' + clusterId
                if hostname and name == hostname:
                    if hostAdapter.has_key('wwpns'):
                        connector['wwpns'] = hostAdapter['wwpns']
                        connector['wwnns'] = 'None'
                    if hostAdapter.has_key('initiator'):
                        connector['initiator'] = hostAdapter['initiator']
            connector['hostAdapters'] = hostAdapters
        else:
            LOG.error(_("fail to get storage adapter props, uri:%s") % uri)
            LOG.error(_("fail to get storage adapter props!!!!! resp.status_code:%d,%s")
                     % (resp.status_code,cas_error.get_http_respond_error(resp)))
        
        return connector
    
    def query_lun_on_host(self, type, targets, hostName):
        uri = self._session.make_cmd_uri('/nova/host/queryLun')
        xmlstr = self._xml.encode_xml("lun_info",hostName=hostName,type=type,target=targets)
        resp,body = self._session.call_method("PUT",uri,body=xmlstr)
        if resp.status_code == 200:
            return body
        else:
            LOG.error(_("host:%s fail to query lun, uri:%s, xmlstr:%s!") % (hostName,uri,xmlstr))
            LOG.error(_("host:%s fail to query lun!!!!! resp.status_code:%d,%s")
                     % (hostName,resp.status_code,cas_error.get_http_respond_error(resp)))
            raise cas_error.CasHostException()
    
    def attach_lun_device_to_cluster(self, type, targets, nodename, hostName):
        if nodename not in self._nodes:
            nodename = self.get_host_first_nodename()
        clusterName=self._nodes[nodename]['clusterName']
        
        if 'rbd' == type:
            uri = self._session.make_cmd_uri('/nova/host/attachRbdPool')
        else:
            uri = self._session.make_cmd_uri('/nova/host/attachLun')
        
        xmlstr = self._xml.encode_xml("lun_info",clusterName=clusterName,hostName=hostName,type=type,target=targets)
        resp,body = self._session.call_method("POST",uri,body=xmlstr)
        if resp.status_code != 200:
            LOG.error(_("Cluster:%s fail to attach lun, uri:%s, xmlstr:%s!") % (clusterName,uri,xmlstr))
            LOG.error(_("Cluster:%s fail to attach lun!!!!! resp.status_code:%d,%s")
                     % (clusterName,resp.status_code,cas_error.get_http_respond_error(resp)))
            raise cas_error.CasHostException()
    
    def detach_lun_device_from_cluster(self, type, targets, nodename, clusterName):
        if not clusterName:
            if nodename not in self._nodes:
                nodename = self.get_host_first_nodename()
            clusterName = self._nodes[nodename]['clusterName']
        
        if 'rbd' == type:
            uri = self._session.make_cmd_uri('/nova/host/detachRbdPool')
            method = "PUT"
        else:
            uri = self._session.make_cmd_uri('/nova/host/detachLun')
            method = "DELETE"
        
        xmlstr = self._xml.encode_xml("lun_info",clusterName=clusterName,type=type,target=targets)
        resp,body = self._session.call_method(method,uri,body=xmlstr)
        if resp.status_code != 200:
            LOG.error(_("Cluster:%s fail to detach lun, uri:%s, xmlstr:%s!") % (clusterName,uri,xmlstr))
            LOG.error(_("Cluster:%s fail to detach lun!!!!! resp.status_code:%d,%s")
                     % (clusterName,resp.status_code,cas_error.get_http_respond_error(resp)))
            raise cas_error.CasHostException()
    
    def get_cold_migrate_dest_node(self, dstNodename, srcNodename, sameFlavor):
        destNode = self._get_cold_migrate_dest_node(dstNodename,srcNodename,sameFlavor)
        
        host_info = {'hostIp':self._host_ip,'destNode':destNode,'useLocal':self._useLocalStorage}
        return jsonutils.dumps(host_info)
    
    def _get_migrate_dest_host(self, **migrateArgs):
        uri = self._session.make_cmd_uri('/nova/migrate/host')
        xmlstr = self._xml.encode_xml('get_migrate_dest_host',**migrateArgs)
        resp, body = self._session.call_method("PUT",uri,body=xmlstr)
        if resp.status_code == 200:
            host = self._xml.decode_xml("migrate_host_info",body)
            return host
        else:
            LOG.error(_("fail to get migrate dest host, uri:%s, xmlstr:%s") % (uri,xmlstr))
            LOG.error(_("fail to get migrate dest host!!!!! resp.status_code:%d,%s")
                     % (resp.status_code,cas_error.get_http_respond_error(resp)))
            raise cas_error.CasHostException()
    
    def get_cold_migrate_dest_host(self, destHost, block_device_mapping, **migrateArgs):
        destHostInfo = jsonutils.loads(destHost)
        if destHostInfo['hostIp'] != self._host_ip:
            LOG.error(_("Can't cold migrate instance between different CVM."))
            raise cas_error.CasHostException()
        
        migrateArgs['useLocal'] = destHostInfo['useLocal']
        
        destNode = destHostInfo['destNode']
        migrateArgs.update(destNode)
        
        host = self._get_migrate_dest_host(**migrateArgs)
        return host
    
    def get_cold_migrate_src_host(self, hostId):
        return self._exNodes[hostId]['hostname']
    
    def check_can_live_migrate_source(self, dest_check_data):
        dest_check_data.migration = migration.Migration()
        
        host_info = {'hostIp':self._host_ip,'hpName':self._hpName}
        dest_check_data.migration.source_compute = jsonutils.dumps(host_info)
        
        return dest_check_data
    
    def get_live_migrate_dest_host(self, instanceId, block_device_mapping, migrate_data, disks, dts_hostname):
        source_compute = jsonutils.loads(migrate_data.migration.source_compute)
        if source_compute['hostIp'] != self._host_ip:
            LOG.error(_("Can't live migrate instance between different CVM."))
            raise cas_error.CasHostException()
        
        nodename = self.get_host_first_nodename()
        migrateArgs = {'vmId':instanceId,'migrateType':'live','clusterName':self._nodes[nodename]['clusterName'], 'hostName': dts_hostname}
        migrateArgs['useLocal'] = self._useLocalStorage
        migrateArgs.update({'disk':disks})
        host = self._get_migrate_dest_host(**migrateArgs)
        
        migrateData = self.CASLiveMigrateData()
        migrateData.set_migrate_host(host)
        
        return migrateData
    
    def sync_instances_node_by_migrate(self,instance,destHostId):
        try:
            srcNodeName = instance['node']
            srcHost = instance['host']
            src_azone = instance['availability_zone']
            destHostNode = self._exNodes.get(destHostId)
            LOG.info(_("begin to migrated sync active,vm:%s,%s,%s") % (instance['uuid'],destHostId,destHostNode))

            data = get_kaas_info(instance)
            update_kaas_annotations(data, 'The VM online migration was started')

            if destHostNode is not None:
                self._network.update_vif_by_instance_migrate(instance['uuid'],destHostNode['hostname'])
            
            if destHostNode is not None:
                destNodeName = destHostNode['nodename']
                dest_azone = self._get_azone_by_host(self._virthost)
                LOG.info(_("src_azone is :%s, dest_azone is:%s") % (src_azone, dest_azone))
                if (src_azone != dest_azone or srcHost != self._virthost or
                        srcNodeName != destNodeName):
                    instance['node'] = destNodeName
                    instance['availability_zone'] = dest_azone
                    instance['host'] = self._virthost
                    LOG.info(_("sync instance host node,uuid:%s,srcHost:%s,srcNodeName:%s,newHost:%s,newNodeName:%s")
                             % (instance['uuid'], srcHost, srcNodeName, instance['host'], instance['node']))

                    @utils.synchronized(instance.uuid)
                    def _locked_save_instance():
                        instance.save()
                    
                    _locked_save_instance()

                if srcHost and srcHost != self._virthost:
                    context = novacontext.get_admin_context()
                    LOG.info(_("begin to notify_about_instance_usage,vm:%s") % instance['uuid'])
                    bdm_list = objects.BlockDeviceMappingList.get_by_instance_uuid(context, instance['uuid'])
                    if len(bdm_list) > 0:
                        try:
                            self._sync_volume_by_migrate(instance, bdm_list)
                        except Exception as ex:
                            LOG.error(_("[cas::]failed to dts sync volumes,exc:%s") % ex)
                            self._auth_context = self._init_auth_context()
                            self._sync_volume_by_migrate(instance, bdm_list)
                    compute_utils.notify_about_instance_usage(rpc.get_notifier('nova-compute'),
                                                              context, instance, 'update',
                                                              extra_usage_info={'migrate_sync': 'true'})
                    LOG.info(_("finish to notify_about_instance_usage,vm:%s") % instance['uuid'])

            update_kaas_annotations(data, 'The VM online migration was completed')

            LOG.info(_("finish to migrated sync active,vm:%s,%s,%s") % (instance['uuid'],destHostId,destHostNode))
        except Exception as exc:
            LOG.error(_("Unknown error occurred when sync instances node by migrate, exception:%s") % exc)
    
    def _parse_and_report(self, node, data_List):
        data_map = {}
        for item in data_List:
            host_key = str(item['hostId']).strip()
            if not data_map.has_key(host_key):
                data_map[host_key] = []
            data_map[host_key].append(item)
        
        report_data = []
        for hostname, host in node['nodeHosts'].items():
            the_host_data_list = data_map.get(str(host['id']).strip(), [])
            for data_item in the_host_data_list:
                report_date_item = None
                for item in report_data:
                    if item['type'] == data_item['type']:
                        report_date_item = item
                        item['total'] += 1
                        if '1' == str(data_item['isUsed']).strip():
                            item['used'] += 1
                        break
                
                if report_date_item is None and data_item['type'] is not None:
                    report_date_item = {"type": data_item['type'],
                                        "total": 1,
                                        "used": 1 if '1' == str(data_item['isUsed']).strip() else 0}
                    
                    if data_item.has_key("framebuffer"):
                        report_date_item["framebuffer"] = data_item['framebuffer']
                    
                    if data_item.has_key("maxResolution"):
                        report_date_item["maxResolution"] = data_item['maxResolution']
                    
                    report_data.append(report_date_item)
        
        return report_data
    
    def _update_node_gpu_and_vgpu_info(self, node):
        clusterId = node['clusterId']
        
        try:
            gpu_list = self._query_cluster_gpu(clusterId=clusterId)
            gpu_data = self._parse_and_report(node, gpu_list)
            node['gpus'] = gpu_data
            
            vgpu_list = self._query_cluster_vgpu(clusterId=clusterId)
            vgpu_data = self._parse_and_report(node, vgpu_list)
            node['vgpus'] = vgpu_data
        except Exception as exc:
            LOG.error(_("get gpu or vgpu info failed:%s") % exc)
            raise exc
    
    def get_platform_para(self,nodename,key):
        node = self._nodes.get(nodename)
        kernel_type = node['platform']
        return platform_support[kernel_type][key]

    def _query_business_template(self):
        uri = self._session.make_cmd_uri('/resPool/queryBusinessTem')
        resp, body = self._session.call_method("GET",uri)
        if resp.status_code == 200:
            template_list = self._xml.decode_xml("respool_business_template",body)
            LOG.info(_("success to get template list:%s") % (template_list))
            return template_list
        else:
            LOG.error(_("fail to get template list:%s") % uri)
            LOG.error(_("fail to get template list! resp.status_code:%d,%s")
                     % (resp.status_code,cas_error.get_http_respond_error(resp)))
            raise cas_error.CasVmException()
        
    def get_business_template_for_gpu_vgpu_vm(self, shared):
        template_list = self._query_business_template()
        if not template_list:
            return None
        if 0 == shared:
            index = random.randint(0,len(template_list)-1)
            return template_list[index]['name']
        else:
            s_template = None
            s_priority = 2

            for template in template_list:
                if template['priority'] < s_priority and template['startMode'] == 3:
                    s_priority = template['priority']

            s_proportion_temp = 0
            for template in template_list:
                if template['priority'] == s_priority:
                    if template.has_key('proportion') and template['proportion'] > s_proportion_temp and template['startMode'] == 3:
                        s_proportion_temp = template['proportion']
                        s_template = template['name']
        
        return s_template

    def sync_instance_host_node(self, instance, destHostId):
        destHostNode = self._exNodes.get(destHostId)
        destNodeName = destHostNode['nodename']
        vmuuids = []
        vmuuids.append(instance['uuid'])
        self._sync_instance_host_node(vmuuids,destNodeName)

    def _get_azone_by_host(self,host):
        try:
            _context = novacontext.get_admin_context()
            availability_zone = az.get_host_availability_zone(_context,host)
            return availability_zone
        except Exception as exc:
            LOG.error(_("failed to _get_azone_by_host,host:%s,exc%s") % (host,exc))
            raise exc
    
    def _get_cinder_az(self):
        try:
            cinder_conf_parser = CasConfigParser()
            cinder_conf_path = '/etc/cinder/cinder.conf'
            cinder_conf_parser.read(cinder_conf_path)
            storage_availability_zone = cinder_conf_parser.get('DEFAULT','storage_availability_zone')
            LOG.info(_("[cas::] success to get storage_availability_zone:%s") % storage_availability_zone)
            return storage_availability_zone
        except Exception as exc:
            LOG.error(_("failed to _get_cinder_az ,exc%s") % exc)
            raise exc
    
    def _init_auth_context(self):
        LOG.info(_("[cas::] begin to init auth context:%s") % CONF.keystone_authtoken['auth_url'])
        auth_url_v3 = "%s/v3" % CONF.keystone_authtoken['auth_url']
        try:
            keystone3 = keystone_client.Client(username=CONF.keystone_authtoken.username,
                                               password=CONF.keystone_authtoken.password,
                                               tenant_name=CONF.keystone_authtoken.project_name,
                                               auth_url=auth_url_v3)
            
            auth_token = keystone3.auth_token
            catalog = keystone3.service_catalog.catalog['catalog']
            user_auth_plg = _ContextAuthPlugin(auth_token,catalog)
            auth_context = novacontext.RequestContext(user_id=keystone3.user_id,
                                                      is_admin=True,
                                                      project_id=keystone3.project_id,
                                                      user_name=keystone3.username,
                                                      project_name=keystone3.project_name,
                                                      roles=['admin'],
                                                      auth_token=keystone3.auth_token,
                                                      remote_address=None,
                                                      service_catalog=None,
                                                      user_auth_plugin=user_auth_plg,
                                                      request_id=None)
            LOG.info(_("[cas::] success to init auth contex:%s") % auth_context)
            return auth_context
        except Exception as exc:
            LOG.error(_("failed to init auth contex ,exc%s") % exc)
            raise exc
    
    def _sync_volume_by_dts(self,instance,volume_list):
        for volume_id in volume_list:
            try:
                volume = self._volume_api.get(self._auth_context,volume_id)
                if (volume is None):
                    LOG.error(_("[cas::]volume_id:%s volume info:%s") % volume)
                    continue
                    
                if volume['availability_zone'] != self._cinder_az:
                    LOG.info(_("[cas::]begin to dts sync volume:%s") % volume_id)
                    connector = self.get_storage_adapter_connector(instance['node'])
                    connector['vmUUID'] = instance['uuid']
                    connector['dts_migrate'] = 'true'
                    connector['storage_availability_zone'] = self._cinder_az
                    LOG.info(_("connector info: %s") % connector)
                    self._volume_api.initialize_connection(self._auth_context,volume_id,connector)
                    LOG.info(_("[cas::]finish to dts sync volume:%s") % volume_id)
            except Exception as exc:
                LOG.error(_("[cas::]failed to dts sync volume:%s,exc:%s") %(volume_id,exc))
                raise exc

    def _sync_volume_by_migrate(self, instance, bdm_list):
        try:
            self._volume_api = cinder.API()
            self._auth_context = self._init_auth_context()
            self._cinder_az = self._get_cinder_az()
        except Exception as exc:
            LOG.error(_("failed to host migrate_sync init ,exc%s") % exc)
            raise exc

        for bdm in bdm_list:
            volume_id = bdm['volume_id']
            if volume_id:
                try:
                    volume = self._volume_api.get(self._auth_context, volume_id)
                    LOG.info("bdm volume is: %s" % volume)
                    if (volume is None):
                        LOG.error(_("[cas::]volume_id:%s volume info:%s") % volume)
                        continue

                    if volume['availability_zone'] != self._cinder_az:
                        LOG.info(_("[cas::]begin to dts sync volume:%s") % volume_id)
                        connector = self.get_storage_adapter_connector(instance['node'])
                        connector['vmUUID'] = instance['uuid']
                        connector['dts_migrate'] = 'true'
                        connector['storage_availability_zone'] = self._cinder_az
                        LOG.info(_("connector info: %s") % connector)
                        self._volume_api.initialize_connection(self._auth_context, volume_id, connector)
                        LOG.info(_("[cas::]finish to migrate sync volume:%s") % volume_id)
                except Exception as exc:
                    LOG.error(_("[cas::]failed to dts migrate volume:%s,exc:%s") % (volume_id, exc))
                    raise exc

    def sync_instances_dtsinfo(self,instance,dtsInfo):
        try:
            destHostId = dtsInfo['hostId']
            destHostNode = self._exNodes.get(destHostId)
            LOG.info(_("begin to dts sync active,vm:%s,%s,%s") % (instance['uuid'],destHostId,destHostNode))
            if destHostNode is not None:
                dest_azone = self._get_azone_by_host(self._virthost)
                self._network.update_vif_by_instance_dts(instance['uuid'],destHostNode['hostname'],dest_azone)
                
                if len(dtsInfo['volume_list']) > 0:
                    try:
                        self._sync_volume_by_dts(instance,dtsInfo['volume_list'])
                    except Exception as ex:
                            LOG.error(_("[cas::]failed to dts sync volumes,exc:%s") % ex)
                            self._auth_context = self._init_auth_context()
                            self._sync_volume_by_dts(instance,dtsInfo['volume_list'])
                
                srcNodeName = instance['node']
                srcHost = instance['host']
                src_azone = instance['availability_zone']
                
                destNodeName = destHostNode['nodename']
                if (src_azone != dest_azone or srcHost != self._virthost or
                    srcNodeName != destNodeName):
                    instance['availability_zone'] = dest_azone
                    instance['host'] = self._virthost
                    instance['node'] = destNodeName
                    
                    @utils.synchronized(instance.uuid)
                    def _locked_save_instance( ):
                        instance.save()
                    
                    _locked_save_instance()
                
                if CONF.cas.dts_sync_nofity:
                    context = novacontext.get_admin_context()
                    LOG.info(_("begin to notify_about_instance_usage,vm:%s") % instance['uuid'])
                    compute_utils.notify_about_instance_usage(rpc.get_notifier('nova-compute'),
                                                              context,instance,'update',
                                                              extra_usage_info={'dts_sync':'true'})
                    LOG.info(_("finish to notify_about_instance_usage,vm:%s") % instance['uuid'])
                
            LOG.info(_("finish to dts sync active,vm:%s,%s,%s") % (instance['uuid'],destHostId,destHostNode))
        except Exception as exc:
            LOG.error(_("Unknown error occurred when sync instances node by dts, exception:%s") % exc)
    
    def list_instances_uuids(self):
        list_vm_uuids = []
        self._update_nodes_list()
        for nodename,node in self._nodes.items():
            list_vm = self._list_node_instances(**node['nodeInfo'])
            list_vm_uuids += list_vm['uuids']
        return list_vm_uuids
    
    def instance_in_hypervisor(self,instance):
        return self._host_ip in instance['node']
    
    
class CasClusterNode(CasHost):
    def __init__(self, session, network, virtapi, virthost):
        super(CasClusterNode,self).__init__(session,network,virtapi,virthost)
    
    def _update_instance_node_info(self, nodename, node):
        for hostname,host in node['nodeHosts'].items():
            storagePools = self._query_host_storages(useLocal=self._useLocalStorage,hostName=hostname)
            host['localPools'] = storagePools['localPools']
            node['sharePools'] = storagePools['sharePools']
        
        node['vgpus'] = []
        node['gpus'] = []
        
    def _update_nodes_list(self):
        nodenames = []
        hostIds = []
        
        self._sem.acquire()
        try:
            clusterList = self._clusterList if self._clusterList else self._get_all_cluster()
            for clusterName,clusterId in clusterList.items():
                cluster_host = self._get_host_list(useLocal='false',clusterName=clusterName)
                nodename = clusterName + '(' + 'CVM' + self._host_ip + ')'
                if nodename in self._nodes:
                    nodeHosts = []
                    for hostname,host in cluster_host.items():
                        if hostname in self._nodes[nodename]['nodeHosts']:
                            self._nodes[nodename]['nodeHosts'][hostname].update(host)
                        else:
                            host['localPools'] = {}
                            self._nodes[nodename]['nodeHosts'][hostname] = host
                        self._exNodes[host['id']] = {'nodename':nodename,'hostname':hostname}
                        hostIds.append(host['id'])
                        nodeHosts.append(hostname)
                    for hostname in (set(self._nodes[nodename]['nodeHosts'].keys()) - set(nodeHosts)):
                        del self._nodes[nodename]['nodeHosts'][hostname]
                else:
                    for hostname,host in cluster_host.items():
                        host['localPools'] = {}
                        self._exNodes[host['id']] = {'nodename':nodename,'hostname':hostname}
                        hostIds.append(host['id'])
                    self._nodes[nodename] = {'clusterName':clusterName,'clusterId':clusterId,'sharePools':{},
                                             'nodeInfo':{'clusterName':clusterName},'nodeHosts':cluster_host}
                nodenames.append(nodename)
            
            for nodename in (set(self._nodes.keys()) - set(nodenames)):
                del self._nodes[nodename]
            
            for hostId in (set(self._exNodes.keys()) - set(hostIds)):
                del self._exNodes[hostId]
        except Exception as exc:
            raise exc
        finally:
            self._sem.release()
    
    def _query_node_storage_pool(self, nodename):
        node = self._nodes[nodename]
        storagePools = node['sharePools'].values()
        
        return {'hpName':self._hpName,'clusterName':node['clusterName'],'storagePools':storagePools}
    
    def _get_cold_migrate_dest_node(self, dstNodename, srcNodename, sameFlavor):
        node = self._nodes[dstNodename]
        destNode = {'clusterName':node['clusterName']}
        
        return destNode

    def _get_node_local_raw_disks(self,hosts):
        """CasClusterNode not support local raw disk"""
        return  None

class CasHostNode(CasHost):
    def __init__(self, session, network, virtapi, virthost):
        super(CasHostNode,self).__init__(session,network,virtapi,virthost)
    
    def _update_instance_node_info(self, nodename, node):
        hostname = node['nodeInfo']['hostName']
        host = node['nodeHosts'][hostname]
        
        storagePools = self._query_host_storages(useLocal=self._useLocalStorage,hostName=hostname)
        host['localPools'] = storagePools['localPools']
        node['sharePools'] = storagePools['sharePools']
         
        if host['status'] == 1:
            node['pci_passthrough_devices'] = self._query_host_pci_devices(hostname)
            # aarch64 支持，去掉之前的限制
            # is_aarch64 = host.get('kernel_type',None) == "aarch64"
            # if is_aarch64:
            #     LOG.info(_("now not support numa topology on platform aarch64"))
            # else:
            node['numa_topology'] = self._query_host_numa_topology(hostname)
        
        self._update_node_gpu_and_vgpu_info(node)
    
    def _update_nodes_list(self):
        nodenames = []
        hostIds = []
        
        self._sem.acquire()
        try:
            clusterList = self._clusterList if self._clusterList else self._get_all_cluster()
            for clusterName,clusterId in clusterList.items():
                cluster_host = self._get_host_list(useLocal='false',clusterName=clusterName)
                for hostname,host in cluster_host.items():
                    nodename = hostname + '(' + 'CVM' + self._host_ip + ')'
                    if nodename in self._nodes:
                        self._nodes[nodename]['nodeHosts'][hostname].update(host)
                    else:
                        host['localPools'] = {}
                        self._nodes[nodename] = {'clusterName':clusterName,'clusterId':clusterId,'sharePools':{},
                                                 'nodeInfo':{'hostName':hostname},'nodeHosts':{hostname:host}}
                    self._exNodes[host['id']] = {'nodename':nodename,'hostname':hostname}
                    
                    nodenames.append(nodename)
                    hostIds.append(host['id'])
            
            for nodename in (set(self._nodes.keys()) - set(nodenames)):
                del self._nodes[nodename]
            
            for hostId in (set(self._exNodes.keys()) - set(hostIds)):
                del self._exNodes[hostId]
        except Exception as exc:
            raise exc
        finally:
            self._sem.release()
    
    def _query_node_storage_pool(self, nodename):
        storagePools = []
        
        node = self._nodes[nodename]
        storagePools += node['sharePools'].values()
        
        host = node['nodeHosts'].values()[0]
        for localPools in host['localPools'].values():
            storagePools += localPools.values()
        
        return {'hpName':self._hpName,'clusterName':node['clusterName'],'storagePools':storagePools}
    
    def _get_cold_migrate_dest_node(self, dstNodename, srcNodename, sameFlavor):
        if dstNodename == srcNodename and sameFlavor:
            LOG.error(_("can't cold migrate instance to the same host!"))
            raise cas_error.CasHostException()
        
        node = self._nodes[dstNodename]
        destNode = {'clusterName':node['clusterName'],'hostName':node['nodeInfo']['hostName']}
        
        return destNode
    
    def _get_node_local_raw_disks(self,hosts):
        node_local_raw_disks = hosts.values()[0]['local_raw_disks']
        return  node_local_raw_disks
