"""
XML builders for CVM REST API responses.
Produces the exact XML format expected by the CAS client (cvk-agent, OpenStack drivers).
Mirrors CasXmlBuilder / mock_server.py XML builders.
"""
from __future__ import annotations

from typing import Any, Dict, List, Optional
from xml.etree import ElementTree as ET


def _el(parent: ET.Element, tag: str, text: Any = None, **attrs) -> ET.Element:
    """Create SubElement with optional text and attributes."""
    elem = ET.SubElement(parent, tag)
    if attrs:
        for k, v in attrs.items():
            if v is not None:
                elem.set(k, str(v))
    if text is not None:
        elem.text = str(text)
    return elem


def _to_xml(element: ET.Element) -> str:
    """Serialize Element to UTF-8 XML string with declaration."""
    return '<?xml version="1.0" encoding="UTF-8"?>\n' + ET.tostring(element, encoding="unicode")


# ============================================================================
# Async Task / Message
# ============================================================================
def xml_task_response(
    msg_id: str = "",
    completed: bool = False,
    result: int = 0,
    target_id: str = "",
    target_name: str = "",
    fail_msg: str = "",
    old_task: str = "",
) -> str:
    """Build async task status response.
    
    Response format:
    <message>
      <msgId>task-12345</msgId>
      <completed>false</completed>
      <result>0</result>
      <targetId>vm-001</targetId>
      <targetName>web-server-01</targetName>
      <failMsg>error description</failMsg>
      <oldTask>previous-task-id</oldTask>
    </message>
    """
    root = ET.Element("message")
    _el(root, "msgId", msg_id)
    _el(root, "completed", "true" if completed else "false")
    if completed:
        _el(root, "result", str(result))
        if result == 0:
            if target_id:
                _el(root, "targetId", target_id)
            if target_name:
                _el(root, "targetName", target_name)
            if old_task:
                _el(root, "oldTask", old_task)
        else:
            _el(root, "failMsg", fail_msg)
    return _to_xml(root)


# ============================================================================
# Host Pool
# ============================================================================
def xml_hostpool_list(pools: List[Dict[str, Any]]) -> str:
    """Build host pool list XML.
    
    <hostPools>
      <hostPool>
        <id>pool-001</id>
        <name>DefaultPool</name>
      </hostPool>
    </hostPools>
    """
    root = ET.Element("hostPools")
    for pool in pools:
        hp = ET.SubElement(root, "hostPool")
        _el(hp, "id", pool.get("id", ""))
        _el(hp, "name", pool.get("name", ""))
        if pool.get("title"):
            _el(hp, "title", pool["title"])
    return _to_xml(root)


def xml_host_list(hosts: List[Dict[str, Any]]) -> str:
    """Build host list XML.
    
    <hosts>
      <host>
        <id>host-001</id>
        <name>cvk-node-1</name>
        <status>1</status>
        <cpu>32</cpu>
        <cpuRate>12.5</cpuRate>
        <memory>131072</memory>
        ...
      </host>
    </hosts>
    """
    root = ET.Element("hosts")
    for host in hosts:
        if host.get("status") != 1:  # only online
            continue
        h = ET.SubElement(root, "host")
        _el(h, "id", host.get("id", ""))
        _el(h, "name", host.get("name", ""))
        _el(h, "status", str(host.get("status", 1)))
        _el(h, "cpu", str(host.get("cpu", 0)))
        _el(h, "cpuRate", str(host.get("cpuRate", 0)))
        _el(h, "memory", str(host.get("memory", 0)))
        _el(h, "memoryRate", str(host.get("memoryRate", 0)))
        _el(h, "physical_cpu", str(host.get("physical_cpu", 0)))
        if host.get("kernelType"):
            _el(h, "kernelType", host["kernelType"])
        if host.get("ipaddr"):
            _el(h, "ipaddr", host["ipaddr"])
        if host.get("local_raw_disks"):
            lrd = ET.SubElement(h, "local_raw_disks")
            for disk in host["local_raw_disks"]:
                d = ET.SubElement(lrd, "local_raw_disk")
                _el(d, "type", disk.get("type", ""))
                _el(d, "size", str(disk.get("size", 0)))
                _el(d, "num", str(disk.get("num", 0)))
    return _to_xml(root)


# ============================================================================
# Resource Pool
# ============================================================================
def xml_respool_list(pools: List[Dict[str, Any]]) -> str:
    """Build resource pool list XML."""
    root = ET.Element("resPools")
    for rp in pools:
        p = ET.SubElement(root, "resPool")
        _el(p, "id", rp.get("id", ""))
        _el(p, "name", rp.get("name", ""))
        _el(p, "type", rp.get("type", ""))
        _el(p, "clusterId", rp.get("clusterId", ""))
        _el(p, "num", str(rp.get("num", 0)))
        _el(p, "vmNum", str(rp.get("vmNum", 0)))
    return _to_xml(root)


def xml_gpu_list(gpus: List[Dict[str, Any]]) -> str:
    """Build GPU list XML."""
    root = ET.Element("gpus")
    for gpu in gpus:
        g = ET.SubElement(root, "gpu")
        _el(g, "bus", gpu.get("bus", ""))
        _el(g, "producers", gpu.get("producers", ""))
        _el(g, "clusterId", gpu.get("clusterId", ""))
        _el(g, "hostId", gpu.get("hostId", ""))
        _el(g, "hostName", gpu.get("hostName", ""))
        _el(g, "isUsed", gpu.get("isUsed", "false"))
        _el(g, "type", gpu.get("type", ""))
    return _to_xml(root)


def xml_vgpu_list(vgpus: List[Dict[str, Any]]) -> str:
    """Build vGPU list XML."""
    root = ET.Element("vgpus")
    for vgpu in vgpus:
        v = ET.SubElement(root, "vgpu")
        _el(v, "bus", vgpu.get("bus", ""))
        _el(v, "type", vgpu.get("type", ""))
        _el(v, "name", vgpu.get("name", ""))
        _el(v, "maxInstance", str(vgpu.get("maxInstance", 0)))
        _el(v, "framebuffer", str(vgpu.get("framebuffer", 0)))
        _el(v, "maxResolution", vgpu.get("maxResolution", ""))
        _el(v, "heads", str(vgpu.get("heads", 0)))
        _el(v, "uuid", vgpu.get("uuid", ""))
        _el(v, "hostId", vgpu.get("hostId", ""))
        _el(v, "hostName", vgpu.get("hostName", ""))
        _el(v, "clusterId", vgpu.get("clusterId", ""))
        _el(v, "isUsed", vgpu.get("isUsed", "false"))
        _el(v, "title", vgpu.get("title", ""))
    return _to_xml(root)


def xml_business_templates(templates: List[Dict[str, Any]]) -> str:
    """Build business template list XML."""
    root = ET.Element("businessTems")
    for bt in templates:
        t = ET.SubElement(root, "businessTem")
        _el(t, "id", bt.get("id", ""))
        _el(t, "name", bt.get("name", ""))
        _el(t, "priority", str(bt.get("priority", 0)))
        _el(t, "startMode", str(bt.get("startMode", 0)))
        if bt.get("proportion") is not None:
            _el(t, "proportion", str(bt["proportion"]))
    return _to_xml(root)


# ============================================================================
# Cluster
# ============================================================================
def xml_cluster_rules(rules: List[Dict[str, Any]]) -> str:
    """Build DRS rules XML."""
    root = ET.Element("rules")
    for rule in rules:
        r = ET.SubElement(root, "rule")
        _el(r, "id", rule.get("id", ""))
        _el(r, "name", rule.get("name", ""))
        _el(r, "type", str(rule.get("type", 0)))
        _el(r, "enabled", str(rule.get("enabled", 0)))
        _el(r, "clusterId", rule.get("clusterId", ""))
    return _to_xml(root)


# ============================================================================
# VM / Domain
# ============================================================================
def xml_vm_list(vms: List[Dict[str, Any]]) -> str:
    """Build VM domain list XML.
    
    <domains>
      <domain>
        <name>web-server-01</name>
        <uuid>a1b2c3d4-...</uuid>
      </domain>
    </domains>
    """
    root = ET.Element("domains")
    for vm in vms:
        d = ET.SubElement(root, "domain")
        _el(d, "name", vm.get("name", ""))
        _el(d, "uuid", vm.get("uuid", ""))
        if vm.get("id"):
            _el(d, "id", str(vm.get("id", "")))
        if vm.get("state"):
            _el(d, "state", str(vm.get("state", "")))
    return _to_xml(root)


def xml_search_vm(vm: Dict[str, Any]) -> str:
    """Build search VM response.
    
    <domain>
      <id>vm-001</id>
      <hostId>host-001</hostId>
      <hostName>cvk-node-1</hostName>
    </domain>
    """
    root = ET.Element("domain")
    _el(root, "id", vm.get("id", ""))
    _el(root, "hostId", vm.get("hostId", ""))
    _el(root, "hostName", vm.get("hostName", ""))
    if vm.get("clusterId"):
        _el(root, "clusterId", vm["clusterId"])
    return _to_xml(root)


def xml_vm_info(vm: Dict[str, Any]) -> str:
    """Build VM info response (for /nova/vmInfo/{id}).
    
    <domain>
      <state>2</state>
      <memory>8192</memory>
      <cpu>4</cpu>
      <maxMemory>16384</maxMemory>
      <vcpuMax>8</vcpuMax>
    </domain>
    """
    root = ET.Element("domain")
    _el(root, "state", str(vm.get("state", "1")))
    _el(root, "memory", str(vm.get("memory", 0)))
    _el(root, "cpu", str(vm.get("cpu", 0)))
    _el(root, "maxMemory", str(vm.get("maxMemory", vm.get("memory", 0) * 2)))
    _el(root, "vcpuMax", str(vm.get("vcpuMax", vm.get("cpu", 0) * 2)))
    if vm.get("uuid"):
        _el(root, "uuid", vm["uuid"])
    if vm.get("name"):
        _el(root, "name", vm["name"])
    return _to_xml(root)


def xml_vm_detail(vm: Dict[str, Any]) -> str:
    """Build VM detail XML.
    
    <domain>
      <id>vm-001</id>
      <name>web-server-01</name>
      <uuid>a1b2c3d4-...</uuid>
      <state>2</state>
      <cpu>4</cpu>
      <memory>8192</memory>
      <hostId>host-001</hostId>
      <hostName>cvk-node-1</hostName>
      <clusterId>cluster-001</clusterId>
    </domain>
    """
    root = ET.Element("domain")
    _el(root, "id", vm.get("id", ""))
    _el(root, "name", vm.get("name", ""))
    _el(root, "uuid", vm.get("uuid", ""))
    _el(root, "state", str(vm.get("state", "")))
    _el(root, "cpu", str(vm.get("cpu", 0)))
    _el(root, "memory", str(vm.get("memory", 0)))
    _el(root, "hostId", vm.get("hostId", ""))
    _el(root, "hostName", vm.get("hostName", ""))
    _el(root, "clusterId", vm.get("clusterId", ""))
    if vm.get("description"):
        _el(root, "description", vm["description"])
    return _to_xml(root)


def xml_vm_detail_full(vm: Dict[str, Any]) -> str:
    """Build full VM detail with network and storage.

    <domain>
      <id>vm-001</id>
      <name>web-server-01</name>
      <uuid>...</uuid>
      <state>2</state>
      <cpu>4</cpu>
      <memory>8192</memory>
      <hostId>host-001</hostId>
      ...
      <interfaces>
        <interface>
          <mac>52:54:00:12:34:56</mac>
          <type>bridge</type>
          <source>ovsbr0</source>
          <model>virtio</model>
        </interface>
      </interfaces>
      <disks>
        <disk>
          <device>disk</device>
          <type>file</type>
          <driverType>qcow2</driverType>
          ...
        </disk>
      </disks>
    </domain>
    """
    root = ET.Element("domain")
    _el(root, "id", vm.get("id", ""))
    _el(root, "name", vm.get("name", ""))
    _el(root, "uuid", vm.get("uuid", ""))
    _el(root, "state", str(vm.get("state", "")))
    _el(root, "cpu", str(vm.get("cpu", 0)))
    _el(root, "memory", str(vm.get("memory", 0)))
    _el(root, "hostId", vm.get("hostId", ""))
    _el(root, "hostName", vm.get("hostName", ""))
    _el(root, "clusterId", vm.get("clusterId", ""))
    _el(root, "cdrom", str(vm.get("cdrom", 0)))
    _el(root, "bootingDevice", str(vm.get("bootingDevice", 2)))
    _el(root, "autoBooting", str(vm.get("autoBooting", 0)))
    if vm.get("description"):
        _el(root, "description", vm["description"])

    # Network interfaces
    if vm.get("interfaces"):
        ifaces = ET.SubElement(root, "interfaces")
        for nic in vm["interfaces"]:
            i = ET.SubElement(ifaces, "interface")
            _el(i, "mac", nic.get("mac", ""))
            _el(i, "type", nic.get("type", "bridge"))
            _el(i, "source", nic.get("source", ""))
            _el(i, "model", nic.get("model", "virtio"))
            if nic.get("vlan"):
                _el(i, "vlan", nic["vlan"])
            if nic.get("name"):
                _el(i, "name", nic["name"])

    # Storage / disks
    if vm.get("disks"):
        disks_el = ET.SubElement(root, "disks")
        for disk in vm["disks"]:
            d = ET.SubElement(disks_el, "disk")
            _el(d, "device", disk.get("device", "disk"))
            _el(d, "type", disk.get("type", "file"))
            _el(d, "driverType", disk.get("driverType", "qcow2"))
            _el(d, "sourceFile", disk.get("sourceFile", ""))
            _el(d, "targetDev", disk.get("targetDev", ""))
            _el(d, "targetBus", disk.get("targetBus", "virtio"))
            _el(d, "size", str(disk.get("size", 0)))
            _el(d, "readonly", disk.get("readonly", "false"))
            _el(d, "shareable", disk.get("shareable", "false"))

    return _to_xml(root)


# ============================================================================
# Host Resources
# ============================================================================
def xml_node_storage(pools: Dict[str, Any]) -> str:
    """Build node storage XML (from /nova/node/storage).
    
    <storages>
      <storagePool>
        <type>dir</type>
        <name>local-vms</name>
        <path>/vms/images</path>
        <totalSize>500000</totalSize>
        <freeSize>350000</freeSize>
        <preAllocation>0</preAllocation>
        <status>1</status>
        <mountDev>/dev/sdb1</mountDev>
      </storagePool>
    </storages>
    """
    root = ET.Element("storages")
    local_pools = pools.get("localPools", {})
    share_pools = pools.get("sharePools", {})

    for mount, pool_dict in local_pools.items():
        for name, pool in pool_dict.items():
            sp = ET.SubElement(root, "storagePool")
            _el(sp, "type", pool.get("type", ""))
            _el(sp, "name", name)
            _el(sp, "path", pool.get("path", ""))
            _el(sp, "totalSize", str(pool.get("totalSize", 0)))
            _el(sp, "freeSize", str(pool.get("freeSize", 0)))
            _el(sp, "preAllocation", str(pool.get("preAllocation", 0)))
            _el(sp, "status", str(pool.get("status", 1)))
            _el(sp, "mountDev", mount)

    for name, pool in share_pools.items():
        sp = ET.SubElement(root, "storagePool")
        _el(sp, "type", pool.get("type", ""))
        _el(sp, "name", name)
        _el(sp, "path", pool.get("path", ""))
        _el(sp, "totalSize", str(pool.get("totalSize", 0)))
        _el(sp, "freeSize", str(pool.get("freeSize", 0)))
        _el(sp, "preAllocation", str(pool.get("preAllocation", 0)))
        _el(sp, "status", str(pool.get("status", 1)))

    return _to_xml(root)


def xml_numa_topology(numas: List[Dict[str, Any]]) -> str:
    """Build NUMA topology XML."""
    root = ET.Element("numas")
    for numa in numas:
        n = ET.SubElement(root, "numa")
        _el(n, "id", str(numa.get("id", 0)))
        _el(n, "memory", str(numa.get("memory", 0)))
        for cpu_id in sorted(numa.get("cpus", [])):
            c = ET.SubElement(n, "cpu")
            _el(c, "id", str(cpu_id))
        for mp in numa.get("mempages", []):
            m = ET.SubElement(n, "mempage")
            _el(m, "size", str(mp.get("size", 0)))
            _el(m, "total", str(mp.get("total", 0)))
    return _to_xml(root)


def xml_pci_devices(devices: List[Dict[str, Any]]) -> str:
    """Build PCI device list XML."""
    root = ET.Element("devices")
    for dev in devices:
        d = ET.SubElement(root, "device")
        _el(d, "name", dev.get("dev_id", ""))
        _el(d, "parent", dev.get("parent_devname", ""))
        cap = ET.SubElement(d, "capability")
        parts = dev.get("address", "").replace(":", ".").split(".")
        if len(parts) >= 4:
            _el(cap, "domain", parts[0])
            _el(cap, "bus", parts[1])
            _el(cap, "slot", parts[2])
            _el(cap, "function", parts[3])
        prod = ET.SubElement(cap, "product")
        prod.set("id", hex(int(dev.get("product_id", "0"), 16)))
        vendor = ET.SubElement(cap, "vendor")
        vendor.set("id", hex(int(dev.get("vendor_id", "0"), 16)))
        if dev.get("numa_node") is not None:
            _el(cap, "numa", str(dev["numa_node"]))
    return _to_xml(root)


def xml_host_resource(hosts: List[Dict[str, Any]]) -> str:
    """Build host resource list XML (for /nova/hostResource)."""
    root = ET.Element("hostResources")
    for host in hosts:
        h = ET.SubElement(root, "host")
        _el(h, "id", host.get("id", ""))
        _el(h, "name", host.get("name", ""))
        _el(h, "hostName", host.get("hostName", host.get("name", "")))
        _el(h, "cpu", str(host.get("cpu", 0)))
        _el(h, "memory", str(host.get("memory", 0)))
        _el(h, "status", str(host.get("status", 1)))
        if host.get("clusterName"):
            _el(h, "clusterName", host["clusterName"])
    return _to_xml(root)


def xml_storage_adapters(adapters: List[Dict[str, Any]]) -> str:
    """Build storage adapter list XML."""
    root = ET.Element("hostAdapters")
    for ad in adapters:
        ha = ET.SubElement(root, "hostAdapter")
        _el(ha, "hostName", ad.get("host", ""))
        # iSCSI initiator
        if ad.get("initiator"):
            a = ET.SubElement(ha, "adapter")
            _el(a, "type", "iSCSI")
            _el(a, "wwn", ad["initiator"])
        # FC WWPNs
        for wwpn in ad.get("wwpns", []):
            a = ET.SubElement(ha, "adapter")
            _el(a, "type", "FC")
            _el(a, "wwn", wwpn)
    return _to_xml(root)


# ============================================================================
# Pool info
# ============================================================================
def xml_pool_info(disk_size: int, free_size: int) -> str:
    """Build pool info XML (for /nova/pool)."""
    root = ET.Element("pool")
    _el(root, "diskSize", str(disk_size))
    _el(root, "diskUsed", str(free_size))
    return _to_xml(root)


# ============================================================================
# Console (VNC/SPICE)
# ============================================================================
def xml_vnc_info(host: str, port: int, password: str) -> str:
    """Build VNC connection info (plain text, not XML)."""
    return f"host={host}\nport={port}\npassword={password}\n"


def xml_spice_info(host: str, port: int, tls_port: int, password: str) -> str:
    """Build SPICE connection info (plain text, not XML)."""
    return f"host={host}\nport={port}\ntlsPort={tls_port}\npassword={password}\n"


# ============================================================================
# Network
# ============================================================================
def xml_network_interfaces(interfaces: List[Dict[str, Any]]) -> str:
    """Build network interface list XML."""
    root = ET.Element("network")
    for nic in interfaces:
        i = ET.SubElement(root, "interface")
        _el(i, "mac", nic.get("mac", ""))
        _el(i, "type", nic.get("type", "bridge"))
        _el(i, "source", nic.get("source", ""))
        _el(i, "model", nic.get("model", "virtio"))
        if nic.get("vlan"):
            _el(i, "vlan", nic["vlan"])
    return _to_xml(root)


# ============================================================================
# Error
# ============================================================================
def xml_error(code: int, message: str) -> str:
    """Build error response XML."""
    root = ET.Element("error")
    _el(root, "code", str(code))
    _el(root, "message", message)
    return _to_xml(root)


# ============================================================================
# Events
# ============================================================================
def xml_events(events: List[Dict[str, Any]]) -> str:
    """Build events XML."""
    root = ET.Element("events")
    for evt in events:
        e = ET.SubElement(root, "event")
        if evt.get("type"):
            _el(e, "type", evt["type"])
        if evt.get("vmId"):
            _el(e, "vmId", evt["vmId"])
        if evt.get("vmName"):
            _el(e, "vmName", evt["vmName"])
        if evt.get("progress"):
            _el(e, "progress", str(evt["progress"]))
    return _to_xml(root)


# ============================================================================
# RabbitMQ config
# ============================================================================
def xml_rabbitmq_config(host: str, port: int, vhost: str, exchange: str, queue: str) -> str:
    """Build RabbitMQ config (plain text, not XML)."""
    return f"host={host}\nport={port}\nvhost={vhost}\nexchange={exchange}\nqueue={queue}\n"
