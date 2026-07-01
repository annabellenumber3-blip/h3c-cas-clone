"""
NOVA integration router: /nova endpoints for OpenStack compatibility.
Mirrors NovaResource.java. This is the largest router covering:
  - VM deploy, config, device management
  - VM query: searchVm, vmInfo, vmList, vmdtsInfo, castoolsInfo
  - Host resources: hostResource, node/storage, pcidevices, numatopology
  - Storage: pool, storageAdapter
  - Image: ifExists, download, update, imageDevice
  - Network: domain, interface/qos
  - Console: consoleLog
  - Migration: migrate/host
  - Protected status, diagnostic info
"""
from fastapi import APIRouter, Query, Request, Response

from .. import xml_utils
from ..store import store

router = APIRouter()


# ============================================================================
# VM Query endpoints (GET)
# ============================================================================
@router.get("/nova/searchVm")
async def nova_search_vm(uuid: str = Query(None), name: str = Query(None)):
    """GET /nova/searchVm?uuid=<uuid> or ?name=<name> — find VM by UUID or name."""
    if uuid:
        vm = store.find_vm_by_uuid(uuid)
    elif name:
        vm = store.find_vm_by_name(name)
    else:
        xml = xml_utils.xml_error(400, "uuid or name parameter required")
        return Response(content=xml, status_code=400, media_type="application/xml;charset=UTF-8",
                        headers={"Server": "CVM"})
    
    if vm:
        xml = xml_utils.xml_search_vm(vm)
        return Response(content=xml, media_type="application/xml;charset=UTF-8", headers={"Server": "CVM"})
    
    xml = xml_utils.xml_error(404, f"VM not found: uuid={uuid}, name={name}")
    return Response(content=xml, status_code=404, media_type="application/xml;charset=UTF-8",
                    headers={"Server": "CVM"})


@router.get("/nova/vmInfo/{vm_id}")
async def nova_vm_info(vm_id: str, isDb: bool = Query(None)):
    """GET /nova/vmInfo/{vmId} — get basic VM info."""
    vm = store.find_vm_by_id(vm_id)
    if vm:
        xml = xml_utils.xml_vm_info(vm)
        return Response(content=xml, media_type="application/xml;charset=UTF-8", headers={"Server": "CVM"})
    xml = xml_utils.xml_error(404, f"VM {vm_id} not found")
    return Response(content=xml, status_code=404, media_type="application/xml;charset=UTF-8",
                    headers={"Server": "CVM"})


@router.get("/nova/vmList")
async def nova_vm_list(hostName: str = Query(None)):
    """GET /nova/vmList — list all VMs, optionally filtered by host."""
    vms = list(store.vms.values())
    if hostName:
        vms = [vm for vm in vms if vm.get("hostName") == hostName]
    xml = xml_utils.xml_vm_list(vms)
    return Response(content=xml, media_type="application/xml;charset=UTF-8", headers={"Server": "CVM"})


@router.get("/nova/vmDiagnosticInfo/{vm_id}")
async def nova_vm_diagnostic(vm_id: str):
    """GET /nova/vmDiagnosticInfo/{id} — get VM diagnostic info."""
    vm = store.find_vm_by_id(vm_id)
    if vm:
        xml = xml_utils.xml_vm_detail(vm)
        return Response(content=xml, media_type="application/xml;charset=UTF-8", headers={"Server": "CVM"})
    xml = xml_utils.xml_error(404, f"VM {vm_id} not found")
    return Response(content=xml, status_code=404, media_type="application/xml;charset=UTF-8",
                    headers={"Server": "CVM"})


@router.get("/nova/ifDomainExists")
async def nova_if_domain_exists(uuid: str = Query(None)):
    """GET /nova/ifDomainExists?uuid=<uuid> — check if VM exists by UUID. Returns plain text 'true'/'false'."""
    exists = store.find_vm_by_uuid(uuid) is not None if uuid else False
    return Response(content="true" if exists else "false", media_type="text/plain;charset=UTF-8",
                    headers={"Server": "CVM"})


@router.get("/nova/vmdtsInfo")
async def nova_vm_dts_info(uuid: str = Query(None)):
    """GET /nova/vmdtsInfo?uuid=<uuid> — get DTS (disaster tolerance) info."""
    vm = store.find_vm_by_uuid(uuid) if uuid else None
    if vm:
        # Return simplified DTS info
        root = xml_utils.ET.Element("dts")
        xml_utils._el(root, "uuid", vm.get("uuid", ""))
        xml_utils._el(root, "type", "1")  # NORMAL
        xml_utils._el(root, "protected", "false")
        xml = xml_utils._to_xml(root)
        return Response(content=xml, media_type="application/xml;charset=UTF-8", headers={"Server": "CVM"})
    xml = xml_utils.xml_error(404, f"VM with UUID {uuid} not found")
    return Response(content=xml, status_code=404, media_type="application/xml;charset=UTF-8",
                    headers={"Server": "CVM"})


@router.get("/nova/castoolsInfo")
async def nova_castools_info(uuid: str = Query(None)):
    """GET /nova/castoolsInfo?uuid=<uuid> — get CAS Tools info for VM."""
    vm = store.find_vm_by_uuid(uuid) if uuid else None
    if vm:
        root = xml_utils.ET.Element("castools")
        xml_utils._el(root, "uuid", vm.get("uuid", ""))
        xml_utils._el(root, "status", "1")  # installed
        xml_utils._el(root, "version", "3.5.0")
        xml = xml_utils._to_xml(root)
        return Response(content=xml, media_type="application/xml;charset=UTF-8", headers={"Server": "CVM"})
    xml = xml_utils.xml_error(404, f"VM with UUID {uuid} not found")
    return Response(content=xml, status_code=404, media_type="application/xml;charset=UTF-8",
                    headers={"Server": "CVM"})


@router.get("/nova/protectedStatus/{vm_id}")
async def nova_protected_status(vm_id: str):
    """GET /nova/protectedStatus/{id} — get VM protection/secondary start status."""
    return Response(content="0", media_type="text/plain;charset=UTF-8", headers={"Server": "CVM"})


@router.get("/nova/consoleLog")
async def nova_console_log(id: str = Query(None), length: int = Query(10240)):
    """GET /nova/consoleLog?id=<vmId>&length=<bytes> — get VM console log."""
    log_text = f"[    0.000000] Booting VM {id or 'unknown'}...\n" \
               f"[    0.500000] CPU: 4 cores initialized\n" \
               f"[    1.000000] Memory: 8192 MB available\n" \
               f"[    2.000000] Root device: /dev/vda\n" \
               f"[    3.000000] Starting network...\n" \
               f"[    5.000000] Login prompt ready\n"
    return Response(content=log_text[:length], media_type="text/plain;charset=UTF-8",
                    headers={"Server": "CVM"})


# ============================================================================
# VM Deploy & Config (POST/PUT)
# ============================================================================
@router.post("/nova/vm/deploy")
async def nova_vm_deploy(request: Request):
    """POST /nova/vm/deploy — deploy a new VM. Returns async task."""
    body = await request.body()
    task_id = store.create_task("deployed-vm", "deployed-vm")
    store.add_event("VM_DEPLOYED", target_id="deployed-vm")
    xml = xml_utils.xml_task_response(msg_id=task_id, completed=False)
    return Response(content=xml, media_type="application/xml;charset=UTF-8", headers={"Server": "CVM"})


@router.put("/nova/vm/config")
async def nova_vm_config(request: Request):
    """PUT /nova/vm/config — configure VM (networking via CAS Tools)."""
    body = await request.body()
    # Returns void in Java, but we return success
    return Response(status_code=204, headers={"Server": "CVM"})


@router.put("/nova/vm/configDrive")
async def nova_vm_config_drive(request: Request):
    """PUT /nova/vm/configDrive — configure VM via config drive. Returns async task."""
    body = await request.body()
    task_id = store.create_task("config-drive", "config-drive-vm")
    xml = xml_utils.xml_task_response(msg_id=task_id, completed=False)
    return Response(content=xml, media_type="application/xml;charset=UTF-8", headers={"Server": "CVM"})


# ============================================================================
# VM Device operations
# ============================================================================
@router.put("/nova/vm/device")
async def nova_vm_device(request: Request):
    """PUT /nova/vm/device — attach disk device to VM."""
    body = await request.body()
    task_id = store.create_task("disk", "disk-attached")
    xml = xml_utils.xml_task_response(msg_id=task_id, completed=False)
    return Response(content=xml, media_type="application/xml;charset=UTF-8", headers={"Server": "CVM"})


@router.post("/nova/vm/addRbdDevice")
async def nova_vm_add_rbd_device(request: Request):
    """POST /nova/vm/addRbdDevice — add RBD (Ceph) device to VM."""
    body = await request.body()
    task_id = store.create_task("rbd", "rbd-device-added")
    xml = xml_utils.xml_task_response(msg_id=task_id, completed=False)
    return Response(content=xml, media_type="application/xml;charset=UTF-8", headers={"Server": "CVM"})


@router.post("/nova/vm/delDevice")
async def nova_vm_del_device(request: Request):
    """POST /nova/vm/delDevice — remove device from VM."""
    body = await request.body()
    task_id = store.create_task("disk", "disk-removed")
    xml = xml_utils.xml_task_response(msg_id=task_id, completed=False)
    return Response(content=xml, media_type="application/xml;charset=UTF-8", headers={"Server": "CVM"})


@router.post("/nova/vm/addDevice")
async def nova_vm_add_device(request: Request):
    """POST /nova/vm/addDevice — add device to VM."""
    body = await request.body()
    task_id = store.create_task("device", "device-added")
    xml = xml_utils.xml_task_response(msg_id=task_id, completed=False)
    return Response(content=xml, media_type="application/xml;charset=UTF-8", headers={"Server": "CVM"})


# ============================================================================
# VM Network operations
# ============================================================================
@router.get("/nova/vm/network")
async def nova_vm_network_get():
    """GET /nova/vm/network — get VM network interfaces."""
    nics = [
        {"mac": "52:54:00:12:34:56", "type": "bridge", "source": "ovsbr0", "model": "virtio"},
    ]
    xml = xml_utils.xml_network_interfaces(nics)
    return Response(content=xml, media_type="application/xml;charset=UTF-8", headers={"Server": "CVM"})


@router.post("/nova/vm/network")
async def nova_vm_network_post(request: Request):
    """POST /nova/vm/network — add network interface to VM."""
    body = await request.body()
    task_id = store.create_task("net", "network-added")
    xml = xml_utils.xml_task_response(msg_id=task_id, completed=False)
    return Response(content=xml, media_type="application/xml;charset=UTF-8", headers={"Server": "CVM"})


@router.put("/nova/vm/configNetwork")
async def nova_vm_config_network(request: Request):
    """PUT /nova/vm/configNetwork — configure VM network via CAS Tools."""
    body = await request.body()
    task_id = store.create_task("net", "network-configured")
    xml = xml_utils.xml_task_response(msg_id=task_id, completed=False)
    return Response(content=xml, media_type="application/xml;charset=UTF-8", headers={"Server": "CVM"})


@router.delete("/nova/vm/network")
async def nova_vm_network_delete(request: Request):
    """DELETE /nova/vm/network — remove network interface from VM."""
    body = await request.body()
    task_id = store.create_task("net", "network-removed")
    xml = xml_utils.xml_task_response(msg_id=task_id, completed=False)
    return Response(content=xml, media_type="application/xml;charset=UTF-8", headers={"Server": "CVM"})


@router.put("/nova/vm/renameVnet")
async def nova_vm_rename_vnet(id: int = Query(...), mac: str = Query(...)):
    """PUT /nova/vm/renameVnet?id=<vmId>&mac=<mac> — rename vnet interface."""
    task_id = store.create_task("vnet", "vnet-renamed")
    xml = xml_utils.xml_task_response(msg_id=task_id, completed=False)
    return Response(content=xml, media_type="application/xml;charset=UTF-8", headers={"Server": "CVM"})


# ============================================================================
# VM Snapshot & Backup
# ============================================================================
@router.post("/nova/vm/snapshot")
async def nova_vm_snapshot(vmId: int = Query(...), device: str = Query(...),
                           name: str = Query(...), format: str = Query(None)):
    """POST /nova/vm/snapshot — create snapshot of VM disk."""
    task_id = store.create_task("snapshot", name)
    store.add_event("SNAPSHOT_CREATED", target_id=str(vmId))
    xml = xml_utils.xml_task_response(msg_id=task_id, completed=False)
    return Response(content=xml, media_type="application/xml;charset=UTF-8", headers={"Server": "CVM"})


@router.post("/nova/image/snapshot")
async def nova_image_snapshot(vmId: int = Query(...), device: str = Query(...),
                              destFile: str = Query(...)):
    """POST /nova/image/snapshot — create image snapshot of VM."""
    task_id = store.create_task("image-snap", destFile)
    xml = xml_utils.xml_task_response(msg_id=task_id, completed=False)
    return Response(content=xml, media_type="application/xml;charset=UTF-8", headers={"Server": "CVM"})


@router.post("/nova/vm/deviceBackup")
async def nova_vm_device_backup(request: Request):
    """POST /nova/vm/deviceBackup — backup VM device."""
    body = await request.body()
    task_id = store.create_task("backup", "device-backup")
    xml = xml_utils.xml_task_response(msg_id=task_id, completed=False)
    return Response(content=xml, media_type="application/xml;charset=UTF-8", headers={"Server": "CVM"})


# ============================================================================
# VM Modify
# ============================================================================
@router.put("/nova/vm/resize")
async def nova_vm_resize(request: Request):
    """PUT /nova/vm/resize — resize VM (CPU/memory)."""
    body = await request.body()
    task_id = store.create_task("resized", "vm-resized")
    xml = xml_utils.xml_task_response(msg_id=task_id, completed=False)
    return Response(content=xml, media_type="application/xml;charset=UTF-8", headers={"Server": "CVM"})


@router.post("/nova/vm/modify")
async def nova_vm_modify(request: Request):
    """POST /nova/vm/modify — modify VM configuration."""
    body = await request.body()
    task_id = store.create_task("mod", "vm-modified")
    xml = xml_utils.xml_task_response(msg_id=task_id, completed=False)
    return Response(content=xml, media_type="application/xml;charset=UTF-8", headers={"Server": "CVM"})


@router.post("/nova/vm/modifyDiskQos")
async def nova_vm_modify_disk_qos(request: Request):
    """POST /nova/vm/modifyDiskQos — modify VM disk QoS."""
    body = await request.body()
    task_id = store.create_task("qos", "disk-qos-modified")
    xml = xml_utils.xml_task_response(msg_id=task_id, completed=False)
    return Response(content=xml, media_type="application/xml;charset=UTF-8", headers={"Server": "CVM"})


@router.post("/nova/vm/setpwd")
async def nova_vm_set_password(request: Request):
    """POST /nova/vm/setpwd — set VM password via CAS Tools."""
    body = await request.body()
    task_id = store.create_task("pwd", "password-set")
    xml = xml_utils.xml_task_response(msg_id=task_id, completed=False)
    return Response(content=xml, media_type="application/xml;charset=UTF-8", headers={"Server": "CVM"})


@router.post("/nova/vm/imageDevice")
async def nova_vm_image_device(request: Request):
    """POST /nova/vm/imageDevice — add image device to VM."""
    body = await request.body()
    task_id = store.create_task("image", "image-device-added")
    xml = xml_utils.xml_task_response(msg_id=task_id, completed=False)
    return Response(content=xml, media_type="application/xml;charset=UTF-8", headers={"Server": "CVM"})


# ============================================================================
# Host Resources
# ============================================================================
@router.get("/nova/hostResource")
async def nova_host_resource():
    """GET /nova/hostResource — list all hosts with resource info."""
    hosts = list(store.hosts.values())
    xml = xml_utils.xml_host_resource(hosts)
    return Response(content=xml, media_type="application/xml;charset=UTF-8", headers={"Server": "CVM"})


@router.get("/nova/node/storage")
async def nova_node_storage():
    """GET /nova/node/storage — list storage pools."""
    xml = xml_utils.xml_node_storage(store.storage)
    return Response(content=xml, media_type="application/xml;charset=UTF-8", headers={"Server": "CVM"})


@router.get("/nova/pcidevices")
async def nova_pci_devices(hostName: str = Query(None)):
    """GET /nova/pcidevices?hostName=<host> — list PCI devices."""
    xml = xml_utils.xml_pci_devices(store.pci_devices)
    return Response(content=xml, media_type="application/xml;charset=UTF-8", headers={"Server": "CVM"})


@router.get("/nova/isolatedCPU")
async def nova_isolated_cpu():
    """GET /nova/isolatedCPU — list isolated CPUs."""
    xml = "<isolatedCPUs></isolatedCPUs>"
    return Response(content=xml, media_type="application/xml;charset=UTF-8", headers={"Server": "CVM"})


@router.get("/nova/numatopology")
async def nova_numa_topology():
    """GET /nova/numatopology — list NUMA topology."""
    xml = xml_utils.xml_numa_topology(store.numa_topology)
    return Response(content=xml, media_type="application/xml;charset=UTF-8", headers={"Server": "CVM"})


@router.get("/nova/pool")
async def nova_pool(size: int = Query(None)):
    """GET /nova/pool?size=<allocation> — get storage pool disk/free info."""
    xml = xml_utils.xml_pool_info(500000, 350000)
    return Response(content=xml, media_type="application/xml;charset=UTF-8", headers={"Server": "CVM"})


@router.get("/nova/storageAdapter")
async def nova_storage_adapter():
    """GET /nova/storageAdapter — list storage adapters (iSCSI/FC)."""
    xml = xml_utils.xml_storage_adapters(store.storage_adapters)
    return Response(content=xml, media_type="application/xml;charset=UTF-8", headers={"Server": "CVM"})


# ============================================================================
# Host LUN / RBD operations
# ============================================================================
@router.post("/nova/host/queryLun")
async def nova_host_query_lun(request: Request):
    """POST /nova/host/queryLun — scan and query LUNs."""
    body = await request.body()
    # Returns LUN list
    xml = "<luns><lun><id>lun-001</id><size>500</size></lun></luns>"
    return Response(content=xml, media_type="application/xml;charset=UTF-8", headers={"Server": "CVM"})


@router.post("/nova/host/attachLun")
async def nova_host_attach_lun(request: Request):
    """POST /nova/host/attachLun — attach LUN to host."""
    body = await request.body()
    task_id = store.create_task("lun", "lun-attached")
    xml = xml_utils.xml_task_response(msg_id=task_id, completed=False)
    return Response(content=xml, media_type="application/xml;charset=UTF-8", headers={"Server": "CVM"})


@router.post("/nova/host/detachLun")
async def nova_host_detach_lun(request: Request):
    """POST /nova/host/detachLun — detach LUN from host."""
    body = await request.body()
    task_id = store.create_task("lun", "lun-detached")
    xml = xml_utils.xml_task_response(msg_id=task_id, completed=False)
    return Response(content=xml, media_type="application/xml;charset=UTF-8", headers={"Server": "CVM"})


@router.post("/nova/host/attachRbdPool")
async def nova_host_attach_rbd_pool(request: Request):
    """POST /nova/host/attachRbdPool — attach Ceph RBD pool to host."""
    body = await request.body()
    task_id = store.create_task("rbd", "rbd-pool-attached")
    xml = xml_utils.xml_task_response(msg_id=task_id, completed=False)
    return Response(content=xml, media_type="application/xml;charset=UTF-8", headers={"Server": "CVM"})


@router.post("/nova/host/detachRbdPool")
async def nova_host_detach_rbd_pool(request: Request):
    """POST /nova/host/detachRbdPool — detach Ceph RBD pool from host."""
    body = await request.body()
    task_id = store.create_task("rbd", "rbd-pool-detached")
    xml = xml_utils.xml_task_response(msg_id=task_id, completed=False)
    return Response(content=xml, media_type="application/xml;charset=UTF-8", headers={"Server": "CVM"})


# ============================================================================
# Migration
# ============================================================================
@router.post("/nova/migrate/host")
async def nova_migrate_host(request: Request):
    """POST /nova/migrate/host — migrate host. Returns target host info."""
    body = await request.body()
    host = store.get_online_hosts()[0] if store.get_online_hosts() else {"id": "none", "name": "none"}
    xml = f"<host><id>{host['id']}</id><name>{host['name']}</name><storageInfo/></host>"
    return Response(content=xml, media_type="application/xml;charset=UTF-8", headers={"Server": "CVM"})


# ============================================================================
# Image operations
# ============================================================================
@router.get("/nova/image/ifExists")
async def nova_image_if_exists(uuid: str = Query(None), size: int = Query(None),
                                checksum: str = Query(None)):
    """GET /nova/image/ifExists?uuid=&size=&checksum= — check if image exists on host."""
    # In mock, always return 'not found' (0)
    return Response(content="0", media_type="text/plain;charset=UTF-8", headers={"Server": "CVM"})


@router.get("/nova/image/{uuid}")
async def nova_image(uuid: str):
    """GET /nova/image/{uuid} — get image info."""
    xml = f"<image><uuid>{uuid}</uuid><size>10737418240</size><format>qcow2</format><status>active</status></image>"
    return Response(content=xml, media_type="application/xml;charset=UTF-8", headers={"Server": "CVM"})


@router.post("/nova/download")
async def nova_download(request: Request):
    """POST /nova/download — download image from Glance/nova to host."""
    body = await request.body()
    task_id = store.create_task("img", "image-downloaded")
    xml = xml_utils.xml_task_response(msg_id=task_id, completed=False)
    return Response(content=xml, media_type="application/xml;charset=UTF-8", headers={"Server": "CVM"})


@router.post("/nova/update")
async def nova_update(request: Request):
    """POST /nova/update — upload image to Glance."""
    body = await request.body()
    task_id = store.create_task("img", "image-updated")
    xml = xml_utils.xml_task_response(msg_id=task_id, completed=False)
    return Response(content=xml, media_type="application/xml;charset=UTF-8", headers={"Server": "CVM"})


# ============================================================================
# Network Domain & QoS
# ============================================================================
@router.get("/nova/domain")
async def nova_domain_get():
    """GET /nova/domain — query CAS domain (vSwitch) UUID."""
    xml = "<domain><uuid>vs-001</uuid><name>default-vs</name></domain>"
    return Response(content=xml, media_type="application/xml;charset=UTF-8", headers={"Server": "CVM"})


@router.post("/nova/domain")
async def nova_domain_post(request: Request):
    """POST /nova/domain — create or configure CAS network domain."""
    body = await request.body()
    return Response(status_code=204, headers={"Server": "CVM"})


@router.post("/nova/interface/qos")
async def nova_interface_qos(request: Request):
    """POST /nova/interface/qos — set interface QoS."""
    body = await request.body()
    return Response(status_code=204, headers={"Server": "CVM"})


# ============================================================================
# Resource query
# ============================================================================
@router.get("/nova/resource")
async def nova_resource():
    """GET /nova/resource — query CVM resource."""
    hosts = store.get_online_hosts()
    total_cpu = sum(h.get("cpu", 0) for h in hosts)
    total_mem = sum(h.get("memory", 0) for h in hosts)
    xml = f"<resource><cpu>{total_cpu}</cpu><memory>{total_mem}</memory><hosts>{len(hosts)}</hosts></resource>"
    return Response(content=xml, media_type="application/xml;charset=UTF-8", headers={"Server": "CVM"})
