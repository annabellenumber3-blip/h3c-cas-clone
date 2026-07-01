"""
VM router: /vm endpoints for direct VM lifecycle operations.
Mirrors DomainResource.java.
Includes: start, stop, powerOff, restart, pause, restore, sleep,
          migrate, modify, rename, deleteVmForce, snapshot, manage,
          desc, bootDev, addDevice, pci, detail
"""
from fastapi import APIRouter, Query, Request, Response

from .. import xml_utils
from ..store import store

router = APIRouter()


# ============================================================================
# VM detail / query
# ============================================================================
@router.get("/vm/detail/{vm_id}")
async def vm_detail(vm_id: str):
    """GET /vm/detail/{vmId} — get full VM detail including network and storage."""
    vm = store.find_vm_by_id(vm_id)
    if vm:
        xml = xml_utils.xml_vm_detail_full(vm)
        return Response(content=xml, media_type="application/xml;charset=UTF-8", headers={"Server": "CVM"})
    xml = xml_utils.xml_error(404, f"VM {vm_id} not found")
    return Response(content=xml, status_code=404, media_type="application/xml;charset=UTF-8",
                    headers={"Server": "CVM"})


@router.get("/vm/pci")
async def vm_pci(uuid: str = Query(None)):
    """GET /vm/pci?uuid=<uuid> — get VM PCI device info."""
    vm = store.find_vm_by_uuid(uuid) if uuid else None
    if vm:
        xml = xml_utils.xml_pci_devices(store.pci_devices)
        return Response(content=xml, media_type="application/xml;charset=UTF-8", headers={"Server": "CVM"})
    return Response(status_code=204, headers={"Server": "CVM"})


@router.get("/vm/bootDev/{vm_id}")
async def vm_boot_dev(vm_id: str):
    """GET /vm/bootDev/{vmId} — get VM boot device order."""
    vm = store.find_vm_by_id(vm_id)
    if vm:
        boot = vm.get("bootingDevice", 2)
        xml = f"<bootDev><device>{boot}</device></bootDev>"
        return Response(content=xml, media_type="application/xml;charset=UTF-8", headers={"Server": "CVM"})
    return Response(status_code=204, headers={"Server": "CVM"})


@router.get("/vm/{vm_id}")
async def vm_info(vm_id: str, needClusterSize: bool = Query(True)):
    """GET /vm/{id} — get VM info."""
    vm = store.find_vm_by_id(vm_id)
    if vm:
        xml = xml_utils.xml_vm_detail(vm)
        return Response(content=xml, media_type="application/xml;charset=UTF-8", headers={"Server": "CVM"})
    xml = xml_utils.xml_error(404, f"VM {vm_id} not found")
    return Response(content=xml, status_code=404, media_type="application/xml;charset=UTF-8",
                    headers={"Server": "CVM"})


# ============================================================================
# VM Lifecycle operations (all async, return taskId)
# ============================================================================
@router.post("/vm/start/{vm_id}")
async def vm_start(vm_id: str):
    """POST /vm/start/{vmId} — start VM."""
    vm = store.find_vm_by_id(vm_id)
    target_name = vm["name"] if vm else vm_id
    task_id = store.create_task(vm_id, f"started-{target_name}")
    store.add_event("VM_STARTED", vm_id=vm_id)
    xml = xml_utils.xml_task_response(msg_id=task_id, completed=False)
    return Response(content=xml, media_type="application/xml;charset=UTF-8", headers={"Server": "CVM"})


@router.post("/vm/stop/{vm_id}")
async def vm_stop(vm_id: str):
    """POST /vm/stop/{vmId} — graceful shutdown VM."""
    vm = store.find_vm_by_id(vm_id)
    target_name = vm["name"] if vm else vm_id
    task_id = store.create_task(vm_id, f"stopped-{target_name}")
    store.add_event("VM_STOPPED", vm_id=vm_id)
    xml = xml_utils.xml_task_response(msg_id=task_id, completed=False)
    return Response(content=xml, media_type="application/xml;charset=UTF-8", headers={"Server": "CVM"})


@router.post("/vm/powerOff/{vm_id}")
async def vm_power_off(vm_id: str):
    """POST /vm/powerOff/{vmId} — force power off VM."""
    vm = store.find_vm_by_id(vm_id)
    target_name = vm["name"] if vm else vm_id
    task_id = store.create_task(vm_id, f"powered-off-{target_name}")
    store.add_event("VM_POWERED_OFF", vm_id=vm_id)
    xml = xml_utils.xml_task_response(msg_id=task_id, completed=False)
    return Response(content=xml, media_type="application/xml;charset=UTF-8", headers={"Server": "CVM"})


@router.post("/vm/restart/{vm_id}")
async def vm_restart(vm_id: str):
    """POST /vm/restart/{vmId} — restart VM."""
    vm = store.find_vm_by_id(vm_id)
    target_name = vm["name"] if vm else vm_id
    task_id = store.create_task(vm_id, f"restarted-{target_name}")
    store.add_event("VM_RESTARTED", vm_id=vm_id)
    xml = xml_utils.xml_task_response(msg_id=task_id, completed=False)
    return Response(content=xml, media_type="application/xml;charset=UTF-8", headers={"Server": "CVM"})


@router.post("/vm/pause/{vm_id}")
async def vm_pause(vm_id: str):
    """POST /vm/pause/{vmId} — pause VM."""
    vm = store.find_vm_by_id(vm_id)
    target_name = vm["name"] if vm else vm_id
    task_id = store.create_task(vm_id, f"paused-{target_name}")
    store.add_event("VM_PAUSED", vm_id=vm_id)
    xml = xml_utils.xml_task_response(msg_id=task_id, completed=False)
    return Response(content=xml, media_type="application/xml;charset=UTF-8", headers={"Server": "CVM"})


@router.post("/vm/restore/{vm_id}")
async def vm_restore(vm_id: str):
    """POST /vm/restore/{vmId} — restore (unpause) VM."""
    vm = store.find_vm_by_id(vm_id)
    target_name = vm["name"] if vm else vm_id
    task_id = store.create_task(vm_id, f"restored-{target_name}")
    store.add_event("VM_RESTORED", vm_id=vm_id)
    xml = xml_utils.xml_task_response(msg_id=task_id, completed=False)
    return Response(content=xml, media_type="application/xml;charset=UTF-8", headers={"Server": "CVM"})


@router.post("/vm/sleep/{vm_id}")
async def vm_sleep(vm_id: str):
    """POST /vm/sleep/{vmId} — suspend (sleep) VM."""
    vm = store.find_vm_by_id(vm_id)
    target_name = vm["name"] if vm else vm_id
    task_id = store.create_task(vm_id, f"suspended-{target_name}")
    store.add_event("VM_SUSPENDED", vm_id=vm_id)
    xml = xml_utils.xml_task_response(msg_id=task_id, completed=False)
    return Response(content=xml, media_type="application/xml;charset=UTF-8", headers={"Server": "CVM"})


# ============================================================================
# VM Operations (POST, with body or params)
# ============================================================================
@router.post("/vm/migrate")
async def vm_migrate(request: Request):
    """POST /vm/migrate — migrate VM to another host."""
    body = await request.body()
    task_id = store.create_task("migrated", "migrated-vm")
    store.add_event("VM_MIGRATED")
    xml = xml_utils.xml_task_response(msg_id=task_id, completed=False)
    return Response(content=xml, media_type="application/xml;charset=UTF-8", headers={"Server": "CVM"})


@router.post("/vm/modify")
async def vm_modify(request: Request):
    """POST /vm/modify — modify VM configuration."""
    body = await request.body()
    task_id = store.create_task("mod", "vm-modified")
    xml = xml_utils.xml_task_response(msg_id=task_id, completed=False)
    return Response(content=xml, media_type="application/xml;charset=UTF-8", headers={"Server": "CVM"})


@router.post("/vm/rename/{vm_id}/{new_name}")
async def vm_rename(vm_id: str, new_name: str):
    """POST /vm/rename/{vmId}/{newName} — rename VM."""
    vm = store.find_vm_by_id(vm_id)
    if vm:
        old_name = vm["name"]
        vm["name"] = new_name
        task_id = store.create_task(vm_id, new_name)
        store.add_event("VM_RENAMED", vm_id=vm_id)
        xml = xml_utils.xml_task_response(msg_id=task_id, completed=False)
        return Response(content=xml, media_type="application/xml;charset=UTF-8", headers={"Server": "CVM"})
    task_id = store.create_task(vm_id, new_name)
    xml = xml_utils.xml_task_response(msg_id=task_id, completed=False)
    return Response(content=xml, media_type="application/xml;charset=UTF-8", headers={"Server": "CVM"})


@router.post("/vm/deleteVmForce")
async def vm_delete_force(id: str = Query(None), type: str = Query(None),
                          force: str = Query(None)):
    """POST /vm/deleteVmForce?id=<vmId>&type=<destroyType>&force=<bool> — force delete VM."""
    vm_id = id or "unknown"
    vm = store.find_vm_by_id(vm_id)
    target_name = vm["name"] if vm else vm_id
    task_id = store.create_task(vm_id, f"deleted-{target_name}")
    store.add_event("VM_DELETED", vm_id=vm_id)
    # Remove from store if force
    if force and force.lower() == "true" and vm:
        del store.vms[vm_id]
    xml = xml_utils.xml_task_response(msg_id=task_id, completed=False)
    return Response(content=xml, media_type="application/xml;charset=UTF-8", headers={"Server": "CVM"})


@router.post("/vm/manage")
async def vm_manage(request: Request):
    """POST /vm/manage — manage an existing (unmanaged) VM."""
    body = await request.body()
    task_id = store.create_task("managed", "vm-managed")
    xml = xml_utils.xml_task_response(msg_id=task_id, completed=False)
    return Response(content=xml, media_type="application/xml;charset=UTF-8", headers={"Server": "CVM"})


@router.post("/vm/snapshot")
async def vm_snapshot_create(request: Request):
    """POST /vm/snapshot — create VM snapshot."""
    body = await request.body()
    task_id = store.create_task("snap", "snapshot-created")
    store.add_event("SNAPSHOT_CREATED")
    xml = xml_utils.xml_task_response(msg_id=task_id, completed=False)
    return Response(content=xml, media_type="application/xml;charset=UTF-8", headers={"Server": "CVM"})


@router.post("/vm/snapshot/resume")
async def vm_snapshot_resume(request: Request):
    """POST /vm/snapshot/resume — resume from snapshot."""
    body = await request.body()
    task_id = store.create_task("snap", "snapshot-resumed")
    store.add_event("SNAPSHOT_RESUMED")
    xml = xml_utils.xml_task_response(msg_id=task_id, completed=False)
    return Response(content=xml, media_type="application/xml;charset=UTF-8", headers={"Server": "CVM"})


@router.post("/vm/addDevice")
async def vm_add_device(request: Request):
    """POST /vm/addDevice — add device to VM."""
    body = await request.body()
    task_id = store.create_task("device", "device-added")
    xml = xml_utils.xml_task_response(msg_id=task_id, completed=False)
    return Response(content=xml, media_type="application/xml;charset=UTF-8", headers={"Server": "CVM"})


@router.post("/vm/desc")
async def vm_desc(id: str = Query(None), desc: str = Query(None)):
    """POST /vm/desc?id=<vmId>&desc=<description> — set VM description."""
    vm = store.find_vm_by_id(id or "")
    if vm and desc is not None:
        vm["description"] = desc
    return Response(status_code=204, headers={"Server": "CVM"})


# ============================================================================
# VM list
# ============================================================================
@router.get("/vm/vmList")
@router.post("/vm/vmList")
async def vm_list(request: Request):
    """GET/POST /vm/vmList — list VMs with filtering and pagination."""
    vms = list(store.vms.values())
    xml = xml_utils.xml_vm_list(vms)
    return Response(content=xml, media_type="application/xml;charset=UTF-8",
                    headers={"Server": "CVM", "X-Total": str(len(vms))})
