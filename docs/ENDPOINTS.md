# H3C CAS Clone — REST API Endpoints

> **Source:** All routers in `cvm_server/routers/`, test files, and README
> **Base URL:** `/cas/casrs`
> **Auth:** HTTP Digest (RFC 2617), realm="CAS", algorithm=MD5, qop="auth"
> **Response Format:** `application/xml;charset=UTF-8`
> **Server Header:** `CVM`

## Endpoint Categories

- [Operator](#1-operator--health-check) — Health check
- [Host Pool](#2-host-pool) — Host pool management
- [Cluster](#3-cluster) — Cluster & DRS rules
- [Resource Pool](#4-resource-pool) — Resource pools, GPUs, vGPUs, business templates
- [Nova (OpenStack)](#5-nova-openstack-compatibility) — 40+ endpoints for VM, host, storage, network, image operations
- [VM Lifecycle](#6-vm-lifecycle) — VM start/stop/pause/migrate/snapshot/delete
- [Storage](#7-storage) — Storage pool management
- [Message](#8-message--async-task) — Async task polling
- [Events & System](#9-events--system) — Event bus + RabbitMQ config
- [Console](#10-console) — VNC/SPICE console access

---

## 1. Operator / Health Check

| Method | Path | Purpose | Response | Source |
|--------|------|---------|----------|--------|
| `GET` | `/operator/test` | Health check | `204 No Content` | `routers/operator.py:10-15` |
| `POST` | `/operator/test` | Health check (POST variant) | `204 No Content` | `routers/operator.py:10` |

> **Test:** `curl -u admin:Cloud@123 --digest http://localhost:8080/cas/casrs/operator/test -v`
> `cvm_server/main.py:159`

---

## 2. Host Pool

| Method | Path | Purpose | Response | Source |
|--------|------|---------|----------|--------|
| `GET` | `/hostpool/all` | List all host pools | XML `<hostPools>...</hostPools>` | `routers/hostpool.py:13-18` |
| `GET` | `/hostpool/{pool_id}/allChildNode` | List hosts in a pool | XML `<hosts>...</hosts>` (online only) | `routers/hostpool.py:21-30` |

**XML response format:**
```xml
<hostPools>
  <hostPool>
    <id>pool-001</id>
    <name>DefaultPool</name>
    <title>Default Host Pool</title>
  </hostPool>
</hostPools>
```
> **Source:** `xml_utils.py:74-91`

---

## 3. Cluster

| Method | Path | Purpose | Response | Source |
|--------|------|---------|----------|--------|
| `GET` | `/cluster/rules` | List DRS rules | XML `<rules>...</rules>` | `routers/cluster.py:13-17` |
| `POST` | `/cluster/addVMHostRule` | Add VM-host affinity rule | Async task XML | `routers/cluster.py:20-26` |
| `POST` | `/cluster/editVMHostRule` | Edit VM-host affinity rule | Async task XML | `routers/cluster.py:29-34` |

---

## 4. Resource Pool

| Method | Path | Purpose | Response | Source |
|--------|------|---------|----------|--------|
| `GET` | `/resPool/queryResPool` | List resource pools | XML `<resPools>...</resPools>` | `routers/respool.py:13-22` |
| `GET` | `/resPool/queryResPoolGpuList` | List GPUs in resource pools | XML `<gpus>...</gpus>` | `routers/respool.py:25-33` |
| `GET` | `/resPool/queryResPoolVgpuList` | List vGPUs in resource pools | XML `<vgpus>...</vgpus>` | `routers/respool.py:36-47` |
| `GET` | `/resPool/queryBusinessTem` | List business templates | XML `<businessTems>...</businessTems>` | `routers/respool.py:50-54` |

---

## 5. Nova (OpenStack Compatibility)

> **Source:** `routers/nova.py:1-519` — Largest router with 40+ endpoints
> Mirrors `NovaResource.java` from original CVM

### 5.1 VM Query (GET)

| Method | Path | Query Params | Purpose | Source |
|--------|------|-------------|---------|--------|
| `GET` | `/nova/searchVm` | `uuid=<uuid>` or `name=<name>` | Find VM by UUID/name | `nova.py:25-43` |
| `GET` | `/nova/vmInfo/{vmId}` | `isDb=<bool>` | Get basic VM info | `nova.py:46-55` |
| `GET` | `/nova/vmList` | `hostName=<name>` | List all VMs (filterable) | `nova.py:58-65` |
| `GET` | `/nova/vmDiagnosticInfo/{id}` | — | Get VM diagnostic info | `nova.py:68-77` |
| `GET` | `/nova/ifDomainExists` | `uuid=<uuid>` | Check if VM exists | `nova.py:80-85` |
| `GET` | `/nova/vmdtsInfo` | `uuid=<uuid>` | Get DTS (disaster tolerance) info | `nova.py:88-102` |
| `GET` | `/nova/castoolsInfo` | `uuid=<uuid>` | Get CAS Tools info | `nova.py:105-118` |
| `GET` | `/nova/protectedStatus/{id}` | — | Get VM protection status | `nova.py:121-124` |
| `GET` | `/nova/consoleLog` | `id=<vmId>`, `length=<bytes>` | Get VM console log | `nova.py:127-137` |

### 5.2 VM Deploy & Config (POST/PUT)

| Method | Path | Purpose | Response | Source |
|--------|------|---------|----------|--------|
| `POST` | `/nova/vm/deploy` | Deploy new VM (async) | Async task XML | `nova.py:143-150` |
| `PUT` | `/nova/vm/config` | Configure VM via CAS Tools | `204 No Content` | `nova.py:153-158` |
| `PUT` | `/nova/vm/configDrive` | Configure VM via config drive (async) | Async task XML | `nova.py:161-167` |

### 5.3 VM Device Operations

| Method | Path | Purpose | Response | Source |
|--------|------|---------|----------|--------|
| `PUT` | `/nova/vm/device` | Attach disk device (async) | Async task XML | `nova.py:173-179` |
| `POST` | `/nova/vm/addRbdDevice` | Add RBD (Ceph) device (async) | Async task XML | `nova.py:182-188` |
| `POST` | `/nova/vm/delDevice` | Remove device from VM (async) | Async task XML | `nova.py:191-197` |
| `POST` | `/nova/vm/addDevice` | Add device to VM (async) | Async task XML | `nova.py:200-206` |

### 5.4 VM Network Operations

| Method | Path | Query Params | Purpose | Source |
|--------|------|-------------|---------|--------|
| `GET` | `/nova/vm/network` | — | Get VM network interfaces | `nova.py:212-219` |
| `POST` | `/nova/vm/network` | — | Add network interface (async) | `nova.py:222-228` |
| `PUT` | `/nova/vm/configNetwork` | — | Configure VM network (async) | `nova.py:231-237` |
| `DELETE` | `/nova/vm/network` | — | Remove network interface (async) | `nova.py:240-246` |
| `PUT` | `/nova/vm/renameVnet` | `id=<vmId>`, `mac=<mac>` | Rename vnet interface (async) | `nova.py:249-254` |

### 5.5 VM Snapshot & Backup

| Method | Path | Query Params | Purpose | Source |
|--------|------|-------------|---------|--------|
| `POST` | `/nova/vm/snapshot` | `vmId`, `device`, `name`, `format` | Create snapshot (async) | `nova.py:260-267` |
| `POST` | `/nova/image/snapshot` | `vmId`, `device`, `destFile` | Create image snapshot (async) | `nova.py:270-276` |
| `POST` | `/nova/vm/deviceBackup` | — | Backup VM device (async) | `nova.py:279-285` |

### 5.6 VM Modify

| Method | Path | Purpose | Response | Source |
|--------|------|---------|----------|--------|
| `PUT` | `/nova/vm/resize` | Resize VM CPU/memory (async) | Async task XML | `nova.py:291-297` |
| `POST` | `/nova/vm/modify` | Modify VM config (async) | Async task XML | `nova.py:300-306` |
| `POST` | `/nova/vm/modifyDiskQos` | Modify VM disk QoS (async) | Async task XML | `nova.py:309-315` |
| `POST` | `/nova/vm/setpwd` | Set VM password via CAS Tools (async) | Async task XML | `nova.py:318-324` |
| `POST` | `/nova/vm/imageDevice` | Add image device to VM (async) | Async task XML | `nova.py:327-333` |

### 5.7 Host Resources

| Method | Path | Query Params | Purpose | Source |
|--------|------|-------------|---------|--------|
| `GET` | `/nova/hostResource` | — | List all hosts with resources | `nova.py:339-344` |
| `GET` | `/nova/node/storage` | — | List storage pools | `nova.py:347-351` |
| `GET` | `/nova/pcidevices` | `hostName=<host>` | List PCI devices | `nova.py:354-358` |
| `GET` | `/nova/isolatedCPU` | — | List isolated CPUs | `nova.py:361-365` |
| `GET` | `/nova/numatopology` | — | List NUMA topology | `nova.py:368-372` |
| `GET` | `/nova/pool` | `size=<allocation>` | Get storage pool info | `nova.py:375-379` |
| `GET` | `/nova/storageAdapter` | — | List storage adapters (iSCSI/FC) | `nova.py:382-386` |

### 5.8 Host LUN / RBD Operations

| Method | Path | Purpose | Response | Source |
|--------|------|---------|----------|--------|
| `POST` | `/nova/host/queryLun` | Scan and query LUNs | XML LUN list | `nova.py:392-398` |
| `POST` | `/nova/host/attachLun` | Attach LUN to host (async) | Async task XML | `nova.py:401-407` |
| `POST` | `/nova/host/detachLun` | Detach LUN from host (async) | Async task XML | `nova.py:410-416` |
| `POST` | `/nova/host/attachRbdPool` | Attach Ceph RBD pool (async) | Async task XML | `nova.py:419-425` |
| `POST` | `/nova/host/detachRbdPool` | Detach Ceph RBD pool (async) | Async task XML | `nova.py:428-434` |

### 5.9 Migration

| Method | Path | Purpose | Response | Source |
|--------|------|---------|----------|--------|
| `POST` | `/nova/migrate/host` | Migrate host / get target host info | XML host info | `nova.py:440-446` |

### 5.10 Image Operations

| Method | Path | Query Params | Purpose | Source |
|--------|------|-------------|---------|--------|
| `GET` | `/nova/image/ifExists` | `uuid`, `size`, `checksum` | Check if image exists | `nova.py:452-457` |
| `GET` | `/nova/image/{uuid}` | — | Get image info | `nova.py:460-464` |
| `POST` | `/nova/download` | — | Download image (async) | `nova.py:467-473` |
| `POST` | `/nova/update` | — | Upload image (async) | `nova.py:476-482` |

### 5.11 Network Domain & QoS

| Method | Path | Purpose | Response | Source |
|--------|------|---------|----------|--------|
| `GET` | `/nova/domain` | Query CAS domain (vSwitch) UUID | XML domain info | `nova.py:488-492` |
| `POST` | `/nova/domain` | Create/configure CAS network domain | `204 No Content` | `nova.py:495-499` |
| `POST` | `/nova/interface/qos` | Set interface QoS | `204 No Content` | `nova.py:502-506` |

### 5.12 Resource Query

| Method | Path | Purpose | Response | Source |
|--------|------|---------|----------|--------|
| `GET` | `/nova/resource` | Query CVM aggregate resource | XML resource summary | `nova.py:512-519` |

---

## 6. VM Lifecycle

> **Source:** `routers/vm.py:1-255` — Mirrors `DomainResource.java`

### 6.1 VM Detail & Query (GET)

| Method | Path | Query Params | Purpose | Source |
|--------|------|-------------|---------|--------|
| `GET` | `/vm/detail/{vmId}` | — | Full VM detail (network + storage) | `vm.py:19-28` |
| `GET` | `/vm/pci` | `uuid=<uuid>` | VM PCI device info | `vm.py:31-38` |
| `GET` | `/vm/bootDev/{vmId}` | — | VM boot device order | `vm.py:41-49` |
| `GET` | `/vm/{vmId}` | `needClusterSize=<bool>` | VM basic info | `vm.py:52-61` |
| `GET/POST` | `/vm/vmList` | — | List VMs with filtering/pagination | `vm.py:248-255` |

### 6.2 VM Lifecycle (POST — async tasks)

| Method | Path | Purpose | Source |
|--------|------|---------|--------|
| `POST` | `/vm/start/{vmId}` | Start VM | `vm.py:67-75` |
| `POST` | `/vm/stop/{vmId}` | Graceful shutdown VM | `vm.py:78-86` |
| `POST` | `/vm/powerOff/{vmId}` | Force power off VM | `vm.py:89-97` |
| `POST` | `/vm/restart/{vmId}` | Restart VM | `vm.py:100-108` |
| `POST` | `/vm/pause/{vmId}` | Pause VM | `vm.py:111-119` |
| `POST` | `/vm/restore/{vmId}` | Restore (unpause) VM | `vm.py:122-130` |
| `POST` | `/vm/sleep/{vmId}` | Suspend (sleep) VM | `vm.py:133-141` |

### 6.3 VM Operations (POST — async with body/params)

| Method | Path | Query Params | Purpose | Source |
|--------|------|-------------|---------|--------|
| `POST` | `/vm/migrate` | — | Migrate VM (async) | `vm.py:147-154` |
| `POST` | `/vm/modify` | — | Modify VM config (async) | `vm.py:157-163` |
| `POST` | `/vm/rename/{vmId}/{newName}` | — | Rename VM (async) | `vm.py:166-179` |
| `POST` | `/vm/deleteVmForce` | `id`, `type`, `force` | Force delete VM (async) | `vm.py:182-195` |
| `POST` | `/vm/manage` | — | Manage existing (unmanaged) VM (async) | `vm.py:198-204` |
| `POST` | `/vm/snapshot` | — | Create VM snapshot (async) | `vm.py:207-214` |
| `POST` | `/vm/snapshot/resume` | — | Resume from snapshot (async) | `vm.py:217-224` |
| `POST` | `/vm/addDevice` | — | Add device to VM (async) | `vm.py:227-233` |
| `POST` | `/vm/desc` | `id`, `desc` | Set VM description | `vm.py:236-242` |

---

## 7. Storage

| Method | Path | Query Params | Purpose | Source |
|--------|------|-------------|---------|--------|
| `POST` | `/storage/refresh` | `id=<hostId>`, `poolName=<name>` | Refresh storage pool | `storage.py:12-15` |
| `GET` | `/storage/volume` | `hostId`, `poolName`, `volumeName` | Get volume info | `storage.py:18-32` |

---

## 8. Message / Async Task

| Method | Path | Purpose | Response Format | Source |
|--------|------|---------|-----------------|--------|
| `GET` | `/message/{taskId}` | Poll async task status | XML `<message>` | `message.py:14-27` |

**Task response XML format:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<message>
  <msgId>task-12345</msgId>
  <completed>true</completed>
  <result>0</result>
  <targetId>vm-001</targetId>
  <targetName>web-server-01</targetName>
  <failMsg>error description</failMsg>
  <oldTask>previous-task-id</oldTask>
</message>
```
> **Source:** `xml_utils.py:32-68`

---

## 9. Events & System

| Method | Path | Query Params | Purpose | Source |
|--------|------|-------------|---------|--------|
| `GET` | `/events` | `type`, `progress` | Get recent events | `events.py:13-31` |
| `GET` | `/system/rabbitmq` | — | Get RabbitMQ config (plain text) | `events.py:34-44` |

**RabbitMQ config response (plain text):**
```
host=127.0.0.1
port=5672
vhost=cloudMsgHost
exchange=cloud_vm_exchange_direct
queue=cas_vm_event_nova_compute
```
> **Source:** `xml_utils.py:591-593`

---

## 10. Console

| Method | Path | Purpose | Response Format | Source |
|--------|------|---------|-----------------|--------|
| `GET` | `/vmvnc/vnc/{vmId}` | Get VNC connection info | Plain text `host=...\nport=...\npassword=...\n` | `console.py:10-14` |
| `GET` | `/spice/info/{vmId}` | Get SPICE connection info | Plain text `host=...\nport=...\ntlsPort=...\npassword=...\n` | `console.py:17-21` |

**VNC response format:**
```
host=192.168.1.100
port=5901
password=vncpwd_vm-001
```
> **Source:** `xml_utils.py:531-538`

---

## Summary Statistics

| Category | Endpoints | Router |
|----------|-----------|--------|
| Operator | 2 (GET+POST) | `operator.py` |
| Host Pool | 2 | `hostpool.py` |
| Cluster | 3 | `cluster.py` |
| Resource Pool | 4 | `respool.py` |
| Nova | 42 | `nova.py` |
| VM Lifecycle | 25 | `vm.py` |
| Storage | 2 | `storage.py` |
| Message | 1 | `message.py` |
| Events & System | 2 | `events.py` |
| Console | 2 | `console.py` |
| **Total** | **85** | 10 routers |

## Auth Notes

- All endpoints under `/cas/casrs` require HTTP Digest auth
- Unauthenticated requests receive `401` with `WWW-Authenticate: Digest realm="CAS", nonce="...", qop="auth", algorithm=MD5`
- `OPTIONS` requests (CORS preflight) bypass auth
> **Source:** `cvm_server/auth.py:127-136`, `cvm_server/config.py:41-48`

## Error Response Format

All errors return XML:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<error>
  <code>404</code>
  <message>VM vm-999 not found</message>
</error>
```
> **Source:** `xml_utils.py:561-566`
