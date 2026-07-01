# H3C CVD (CAS Virtual Disk) Protocol Specification

## Reconstructed From Original Source Code

This document describes the complete CVD wire protocol reverse-engineered from:

| Source | What It Provides |
|--------|-----------------|
| `libcvd.h` | C SDK API: data structures, disk open flags, connect params |
| `cvd_error.h` | Error codes, JSON-RPC 2.0 standard errors |
| `cvd_version.h` | Version 1.0.0, library name |
| `ds_handle.c` | **ALL JSON-RPC method names, params, response format** |
| `ds_server.c` | ZeroMQ ROUTER/DEALER transport, heartbeat, timeout, worker pool |
| `ds_conf.h` | Transport struct, max client num, config keys |
| `ds_business.h` | CVM auth endpoint, error message strings, libvirt connection |
| `ds_main.c` | Daemon startup, default port 8192, daemonize, signal handling |
| `cli.c` | CLI commands, JSON-RPC request construction |
| `sdk_client.c` | Client-side ZeroMQ DEALER, heartbeat, timeouts |
| `cas_export_disk_tool.pyc` | NBD export/unexport via qemu-nbd |
| `cas_dirty_bitmap_tool.pyc` | QMP dirty bitmap management |
| `cas_vm_helpers.pyc` | qemu-img backing chain, disk format detection |
| `cas_bk_error.pyc` | Python error codes (CAS_ERR_*) |
| `cas_libvirt_helper.pyc` | libvirt initialization, VM state monitoring |
| `cvd_process_checker.sh` | Process lifecycle watchdog |

---

## 1. Architecture

```
 CVM (Management Node)                     CVK (Hypervisor Host)
 ┌──────────────────────┐                  ┌──────────────────────┐
 │  cvm_server (Java)   │   HTTP Digest   │  cvd-ds (C binary)   │
 │  /cas/casrs          │   Auth           │  listens on TCP:8192 │
 │                      │◄──────────────►│                      │
 │  CVD Client (libcvd) │   JSON-RPC 2.0  │       │              │
 │  cvd-cli             │   over ZeroMQ   │       │ libvirt      │
 │  SDK (sdk_demo.c)    │   ROUTER/DEALER │       │ qemu-img     │
 └──────────────────────┘                  └───────┼──────────────┘
                                                   │
                                          ┌────────┼──────────────┐
                                          │ qemu-nbd (NBD export) │
                                          │ QMP (dirty bitmaps)   │
                                          │ cas_export_disk_tool  │
                                          │ cas_dirty_bitmap_tool │
                                          └───────────────────────┘
```

---

## 2. Transport Layer: ZeroMQ ROUTER/DEALER

### 2.1 Socket Types

| Component | ZMQ Socket | Direction | Identity |
|-----------|-----------|-----------|----------|
| cvd-ds (server) | `ZMQ_ROUTER` | bind `tcp://*:8192` | Per-client from routing frame |
| cvd-cli (client) | `ZMQ_DEALER` | connect `tcp://host:8192` | UUID via `ZMQ_ROUTING_ID` |

**Source:** `ds_server.c` lines 27-58, `sdk_client.c` lines 239-342

### 2.2 Message Framing

Every message is a 3-part ZMQ multipart message:

```
Frame 0: client_id      — ZMQ routing identity (set by ROUTER socket from DEALER's ZMQ_ROUTING_ID)
Frame 1: real_client_id — empty frame from DEALER (ZMQ internal)
Frame 2: payload        — JSON-RPC 2.0 string (unformatted, no whitespace)
```

**Source:** `ds_server.c` lines 352-363, `sdk_client.c` lines 127-135

### 2.3 Special Protocol Messages

| Message | Direction | Meaning |
|---------|-----------|---------|
| `$HEARTBEAT` | Client → Server | Keep-alive, every 3000ms |
| `$CLOSING` | Client → Server | Graceful disconnect notification |
| `$TIMEOUT` | Server → Worker | Peer timeout (10000ms inactivity) |
| `$TERM` | Internal | Actor termination signal |

**Source:** `ds_server.c` lines 31-35, `sdk_client.c` lines 35-37, 206

### 2.4 Server Architecture (ds_server.c)

```
                   ┌──────────────────────┐
                   │   ZMQ_ROUTER socket   │  tcp://*:8192
                   └──────────┬───────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
        ┌──────────┐   ┌──────────┐   ┌──────────┐
        │ Actor 0  │   │ Actor 1  │   │ Actor N  │   (4 workers)
        │ (thread) │   │ (thread) │   │ (thread) │
        └──────────┘   └──────────┘   └──────────┘
              │
              ▼
        ds_handle_msg()  →  JSON-RPC dispatch  →  ds_handle_* handlers
```

- 4 worker actors (`DS_SERVER_WORKER_NUMBER = 4`)
- Round-robin scheduling via `schedule_index`
- Monitor socket for connection events
- 3000ms send timeout (`DS_SERVER_SNDTIMEO`)
- 10000ms peer timeout (`DS_SERVER_PEER_TIMEOUT`)
- 1000ms linger on disconnect (`SDK_CLIENT_LINGER`)

**Source:** `ds_server.c` lines 27-58, `ds_main.c` lines 56-130

### 2.5 Client Architecture (sdk_client.c)

```
   ┌──────────────────────────────────────────┐
   │  sdk_client_thread (single thread)        │
   │                                            │
   │  zloop:                                    │
   │    ├── ZMQ_PAIR   (pair endpoint)          │  internal terminate signal
   │    ├── ZMQ_ROUTER (in_router endpoint)     │  request/response routing
   │    ├── ZMQ_DEALER (tcp://host:port)        │  server connection
   │    └── timer      (3000ms heartbeat)       │  $HEARTBEAT messages
   └──────────────────────────────────────────┘
```

- Connect timeout: 3000ms
- Send timeout: 3000ms
- Request timeout: 30000ms
- Heartbeat interval: 3000ms
- Linger on disconnect: 1000ms

**Source:** `sdk_client.c` lines 29-37, 239-342

---

## 3. Protocol Layer: JSON-RPC 2.0

### 3.1 Request Format

All requests use JSON-RPC 2.0, serialized with **unformatted** JSON (no whitespace, matching `cJSON_PrintUnformatted`).

```json
{"jsonrpc":"2.0","method":"<method>","params":{...},"id":<int>}
```

**Source:** `cli.c` lines 107-117 (`cli_make_jrpc`), `ds_handle.c` lines 951-997

### 3.2 Response Format (Success)

```json
{"jsonrpc":"2.0","result":{...},"id":<int>}
```

**Source:** `ds_handle.c` lines 838-870 (`ds_handle_result`)

### 3.3 Response Format (Error)

```json
{"jsonrpc":"2.0","error":{"code":<int>,"message":"<string>"},"id":<int>}
```

**Source:** `ds_handle.c` lines 794-829 (`ds_handle_error`)

### 3.4 Error Codes (cvd_error.h)

#### Application Errors
| Code | Name | Description |
|------|------|-------------|
| 0 | `CVD_EC_OK` | Success |
| 1 | `CVD_EC_FAILURE` | General failure |
| 10000 | `CVD_EC_INTERNAL_ERROR` | Internal error |
| 10050 | `CVD_EC_INVALID_ARGUMENT` | Invalid argument |
| 10051 | `CVD_EC_NOT_SUPPORTED` | Not supported |
| 10052 | `CVD_EC_OUT_OF_MEMORY` | Out of memory |
| 10100 | `CVD_EC_INVALID_FORMAT` | Invalid file format |
| 10101 | `CVD_EC_IO` | I/O error |
| 10102 | `CVD_EC_NETWORK` | Network error |
| 10103 | `CVD_EC_EAGAIN` | Resource temporarily unavailable |
| 10104 | `CVD_EC_OVER_MAX_CONNECTION` | Over max connection |
| 10105 | `CVD_EC_AUTH` | Authentication failed |
| 20051 | `CVD_EC_EXPORT_DISK` | Export disk failed |
| 20052 | `CVD_EC_UNEXPORT_DISK` | Unexport disk failed |
| 20053 | `CVD_EC_CONNECT_FAIL` | Connect to CVM failed |
| 20054 | `CVD_EC_QUEY_POOL_FAIL` | Query storage pool failed |
| 20055 | `CVD_EC_QUEY_DISK_FAIL` | Query disk info failed |

#### JSON-RPC Standard Errors
| Code | Name | Message |
|------|------|---------|
| -32700 | `CVD_EC_JRPC_PARSE_ERROR` | Parse error. Invalid JSON was received by the server. |
| -32600 | `CVD_EC_JRPC_INVALID_REQUEST` | Invalid Request. The JSON sent is not a valid Request object. |
| -32601 | `CVD_EC_JRPC_METHOD_NOT_FOUND` | Method not found. |
| -32602 | `CVD_EC_JRPC_INVALID_PARAMS` | Invalid params. Invalid method parameter(s). |
| -32603 | `CVD_EC_JRPC_INTERNAL_ERROR` | Internal error. |

---

## 4. Complete Method Reference

### Methods Table (`g_jrpc_methods[]` in ds_handle.c:66-75)

| # | Method | Handler Function | Auth Required |
|---|--------|-----------------|---------------|
| 1 | `set-loglevel` | `ds_handle_set_loglevel` | No |
| 2 | `set-max-client-num` | `ds_handle_set_max_client_num` | No |
| 3 | `connect` | `ds_handle_connect` | Yes (HTTP Digest) |
| 4 | `query-storage-pool` | `ds_handle_query_storage_pool` | No (uses libvirt) |
| 5 | `set-transport-channel` | `ds_handle_set_transport_channel` | No |
| 6 | `release-transport-channel` | `ds_handle_release_transport_channel` | No |
| 7 | `query-disk-info` | `ds_handle_query_disk_info` | No |

---

### 4.1 `set-loglevel`

Set the CVD daemon log level.

**Request:**
```json
{"jsonrpc":"2.0","method":"set-loglevel","params":{"loglevel":"debug"},"id":12345}
```

**Params:**
| Key | Type | Values | Required |
|-----|------|--------|----------|
| `loglevel` | string | `"debug"`, `"info"`, `"warn"`, `"error"` | Yes |

**Response (success):**
```json
{"jsonrpc":"2.0","result":{},"id":12345}
```

**Response (error):**
```json
{"jsonrpc":"2.0","error":{"code":-32602,"message":"Invalid params. Invalid method parameter(s)."},"id":12345}
```

**Source:** `ds_handle.c` lines 125-149, `cli.c` lines 130-196

---

### 4.2 `set-max-client-num`

Set the maximum number of concurrent clients.

**Request:**
```json
{"jsonrpc":"2.0","method":"set-max-client-num","params":{"num":128},"id":12345}
```

**Params:**
| Key | Type | Required |
|-----|------|----------|
| `num` | number (int) | Yes |

**Source:** `ds_handle.c` lines 160-189, `cli.c` lines 227-292

---

### 4.3 `connect`

Authenticate with CVM. Internally:
1. Gets CVM IP from `/etc/cvk/cvm_info.conf`
2. Sends HTTP POST to `http://<cvmip>:8080/cas/spring_check?encrypt=true&lang=cn&name=<user>&password=<pass>`
3. Performs HTTP Digest auth to `/cas/casrs/operator/test`

**Request:**
```json
{"jsonrpc":"2.0","method":"connect","params":{"username":"admin","passwd":"admin"},"id":12345}
```

**Params:**
| Key | Type | Required | Description |
|-----|------|----------|-------------|
| `username` | string | Yes | CVM username |
| `passwd` | string | Yes | CVM password |
| `vmname` | string | No | VM domain name (libvirt) |

**Response (success):**
```json
{"jsonrpc":"2.0","result":{},"id":12345}
```

**Response (error):**
```json
{"jsonrpc":"2.0","error":{"code":20053,"message":"connect fail"},"id":12345}
```

**Source:** `ds_handle.c` lines 200-245, `ds_business.h` lines 38-60, `cli.c` lines 309-383

---

### 4.4 `query-storage-pool`

Query the libvirt storage pool for a virtual disk path.

Internally uses:
- `virStorageVolLookupByPath(con, path)`
- `virStoragePoolLookupByVolume(virVol)`
- `virStoragePoolGetXMLDesc(virPool, 0)`
- XML parsing to extract pool info

**Request:**
```json
{"jsonrpc":"2.0","method":"query-storage-pool","params":{"virtual-disk":"/vms/test.qcow2"},"id":12345}
```

**Params:**
| Key | Type | Required | Description |
|-----|------|----------|-------------|
| `virtual-disk` | string | Yes | Full path to disk image |

**Response (success):**
```json
{"jsonrpc":"2.0","result":{"name":"default","path":"/var/lib/libvirt/images","type":"dir","available":"100G","capacity":"500G"},"id":12345}
```

**Source:** `ds_handle.c` lines 256-337, `cli.c` lines 396-456

---

### 4.5 `query-disk-info`

Query disk metadata by running `qemu-img info --output=json <path>`.

**Request:**
```json
{"jsonrpc":"2.0","method":"query-disk-info","params":{"virtual-disk":"/vms/test.qcow2"},"id":12345}
```

**Params:**
| Key | Type | Required | Description |
|-----|------|----------|-------------|
| `virtual-disk` | string | Yes | Full path to disk image |

**Response (success):** Returns raw qemu-img JSON output:
```json
{
  "jsonrpc":"2.0",
  "result":{
    "filename":"/vms/test.qcow2",
    "format":"qcow2",
    "virtual-size":10737418240,
    "actual-size":524288000,
    "cluster-size":65536,
    "encrypted":false,
    "dirty-flag":false
  },
  "id":12345
}
```

**Source:** `ds_handle.c` lines 348-430

---

### 4.6 `set-transport-channel`

Export a virtual disk via NBD. Internally spawns:
```
python3 /opt/bin/cas_export_disk_tool.pyc export <path> [-s <snap>] [--read-only]
```

**Request:**
```json
{
  "jsonrpc":"2.0",
  "method":"set-transport-channel",
  "params":{
    "mode":1,
    "virtual-disk":"/vms/test.qcow2",
    "snapshot-name":"snap1",
    "flag":1
  },
  "id":12345
}
```

**Params:**
| Key | Type | Required | Description |
|-----|------|----------|-------------|
| `mode` | number | Yes | Transport mode: `1` = LAN_BASED, `2` = LAN_FREE (unused) |
| `virtual-disk` | string | Yes | Full path to disk image |
| `snapshot-name` | string | No | Internal snapshot to export |
| `flag` | number | Yes | `0` = read-write, `1` = read-only |

**Response (success):**
```json
{"jsonrpc":"2.0","result":{"port":10809},"id":12345}
```

**Transport flags:**
- `CVD_TRANSPORT_FLAG_RD = 1` — read-only export
- `CVD_TRANSPORT_FLAG_RDWR = 0` — read-write export

**Source:** `ds_handle.c` lines 441-537, `cli.c` lines 474-558

---

### 4.7 `release-transport-channel`

Stop NBD export. Internally spawns:
```
python3 /opt/bin/cas_export_disk_tool.pyc unexport <path> -p <port>
```

**Request:**
```json
{
  "jsonrpc":"2.0",
  "method":"release-transport-channel",
  "params":{
    "virtual-disk":"/vms/test.qcow2",
    "snapshot-name":"snap1",
    "port":10809
  },
  "id":12345
}
```

**Params:**
| Key | Type | Required | Description |
|-----|------|----------|-------------|
| `virtual-disk` | string | Yes | Full path to disk image |
| `snapshot-name` | string | No | Internal snapshot name |
| `port` | number | Yes | NBD port number |

**Response (success):**
```json
{"jsonrpc":"2.0","result":{},"id":12345}
```

**Source:** `ds_handle.c` lines 580-638, `cli.c` lines 576-651

---

## 5. C SDK API Reference

### 5.1 Connection Management

```c
int cvd_connect(const CvdConnectParams *params, CvdConnection **conn);
void cvd_disconnect(CvdConnection **conn);
```

Connection params:
```c
typedef struct CvdConnectParams {
    char *ip;           // CVK host IP
    uint32_t port;      // Default: 8192
    char *username;     // CVM username
    char *password;     // CVM password
    char *vmname;       // VM name (NULL = host-level)
    uint16_t transport_mode; // Reserved, 0
} CvdConnectParams;
```

### 5.2 Disk Operations

```c
int cvd_disk_create(CvdConnection *conn, const char *filename,
    char *fmt, uint64_t disk_size, const CvdDiskCreateOptions *opts);

int cvd_disk_open(CvdConnection *conn, const char *filename,
    const char *fmt, const char *snapshotname,
    uint64_t flags, CvdDiskHandle **handle);

void cvd_disk_close(CvdDiskHandle **handle);

int cvd_disk_read(CvdDiskHandle *handle, int64_t offset,
    int count, void *buf);

int cvd_disk_write(CvdDiskHandle *handle, int64_t offset,
    int count, void *buf);

int cvd_disk_get_info(CvdDiskHandle *handle, CvdDiskInfo **info);
void cvd_free_disk_info(CvdDiskInfo **info);

GList *cvd_disk_query_data_blocks(CvdDiskHandle *handle);
int cvd_disk_query_data_blocks_ex(CvdDiskHandle *handle, GList **list);
```

**Open flags:**
| Flag | Value | Description |
|------|-------|-------------|
| `CVD_DISK_OFLAG_RD` | 0x0001 | Read-only |
| `CVD_DISK_OFLAG_RDWR` | 0x0002 | Read-write |

**Create flags:**
| Flag | Value | Description |
|------|-------|-------------|
| `CVD_DISK_CFLAG_INHERIT_BACKING_METADATA` | 0x0001 | Inherit backing file metadata |

### 5.3 Data Structures

```c
typedef struct CvdDiskInfo {
    char *filename;
    char *format;               // "raw", "qcow2", "vmdk", etc.
    int64_t actual_size;        // bytes on disk
    int64_t virtual_size;       // logical size
    int64_t cluster_size;
    bool encrypted;
    bool compressed;
    char *backing_filename;     // qcow2 backing file
    char *backing_fmt;          // backing file format
} CvdDiskInfo;

typedef struct CvdDataBlock {
    int64_t offset;             // offset in virtual disk
    int64_t length;             // length of data block
} CvdDataBlock;

typedef struct CvdDiskCreateOptions {
    uint64_t cflags;            // create flags
    char *backing_filename;
    char *backing_fmt;
    char *options;              // qemu-img -o options
} CvdDiskCreateOptions;
```

---

## 6. NBD Export Protocol

The NBD export is handled by `cas_export_disk_tool.pyc`, which wraps `qemu-nbd`.

### Export Command
```bash
python3 /opt/bin/cas_export_disk_tool.pyc export <filename> [-s <snapshot>] [--read-only]
```
- Returns the allocated port number on stdout
- Finds a free port using `socket.bind(('', 0))`
- Spawns `qemu-nbd -p <port> --cache directsync -t --fork [--read-only] [--load-snapshot=<snap>] <filename>`

### Unexport Command
```bash
python3 /opt/bin/cas_export_disk_tool.pyc unexport <filename> -p <port>
```
- Finds qemu-nbd process: `ps -eo pid,command | grep "[q]emu-nbd <filename> -p <port>"`
- Kills it: `kill -9 <pid>`

### Query Command
```bash
python3 /opt/bin/cas_export_disk_tool.pyc query <filename>
```
- Checks if the file is currently exported

---

## 7. Dirty Bitmap Protocol (QMP)

The dirty bitmap tool (`cas_dirty_bitmap_tool.pyc`) manages QEMU persistent dirty bitmaps for incremental backup.

### Architecture
- **Online VMs:** Uses QMP (QEMU Monitor Protocol) through libvirt
  - `virDomainQemuMonitorCommand()` for QMP commands
  - Commands: `block-dirty-bitmap-add`, `block-dirty-bitmap-remove`, `query-block`
- **Offline VMs:** Uses `qemu-img bitmap` commands
  - `qemu-img bitmap mk <disk> <bitmap> <granularity>`
  - `qemu-img bitmap rm <disk> <bitmap>`
  - `qemu-img bitmap dump <disk>`

### Operations
| Command | Description |
|---------|-------------|
| `add` | Create persistent dirty bitmap on VM disks |
| `remove` | Remove dirty bitmap(s); supports regex with `--enable-regex` |
| `check` | Validate dirty bitmap status |
| `list` | List all dirty bitmaps in disk |

### Error Codes (cas_bk_error.pyc)
| Code | Name |
|------|------|
| `CAS_ERR_BASE` | Base error |
| `CAS_ERR_DBITMAP_CREATE` | Dirty bitmap create failed |
| `CAS_ERR_DBITMAP_REMOVE` | Dirty bitmap remove failed |
| `CAS_ERR_DBITMAP_NOTSUPP` | Dirty bitmap not supported |
| `CAS_ERR_DBITMAP_INACTIVE` | Dirty bitmap is inactive |
| `CAS_ERR_DBITMAP_NOTEXIST` | Dirty bitmap does not exist |
| `CAS_ERR_PARTITIAL_SUCCEED` | Partial success |
| `CAS_ERR_OPNOTSUPP` | Operation not supported |
| `CAS_ERR_INVARG` | Invalid argument |
| `CAS_ERR_QMP` | QMP error |
| `CAS_ERR_LIBVIRT` | libvirt error |

---

## 8. Configuration

### CVD Daemon Config (`/etc/cvd/cvd-ds.conf`)

Uses libconfig format. Contains:
- `max_client_num` — maximum concurrent clients (default: 64)
- `transports` — list of active NBD transport channels (persisted across restarts)

### CVM Info (`/etc/cvk/cvm_info.conf`)

Contains CVM IP address for authentication.

### Log Files
- CVD daemon: `/var/log/cvd/cvd-ds.log`
- PID file: `/var/run/cvd-ds.pid`

### Systemd Service
```
/usr/lib/systemd/system/cvd-ds.service
```

### Process Watchdog
`cvd_process_checker.sh` — Cron/systemd timer that checks if cvd-ds is running and restarts if not.

---

## 9. CVD CLI Reference

```
usage: cvd-cli [-p PORT] command [command options]

Commands:
  set-loglevel -l loglevel
  set-max-client-num -n num
  connect -u username -p password [-d domain]
  query-storage-pool -i image
  set-transport-channel [-m mode] -i image [-s snap] [-f flag]
  release-transport-channel -i image [-s snap] -p port
```

### Options Reference
| Option | Commands | Description |
|--------|----------|-------------|
| `-p PORT` | global | CVD daemon port (default: 8192) |
| `-l loglevel` | set-loglevel | debug, info, warn, error |
| `-n num` | set-max-client-num | Max client count |
| `-u user` | connect | CVM username |
| `-p password` | connect | CVM password |
| `-d domain` | connect | VM domain name |
| `-i image` | query-*, set-*, release-* | Full disk path |
| `-m mode` | set-transport-channel | 1=LAN_BASED, 2=LAN_FREE |
| `-s snap` | set-*, release-* | Snapshot name |
| `-f flag` | set-transport-channel | 0=RDWR, 1=RD |
| `-p port` | release-transport-channel | NBD port |

**Source:** `cli.c` lines 54-92 (help text), full implementation lines 1-723

---

## 10. Complete Wire Example

### Session: Client connects, queries disk, exports via NBD

**1. Client connects to daemon (ZMQ DEALER connects to tcp://host:8192)**

**2. Set log level:**
```
DEALER → ROUTER: [<uuid>][][{"jsonrpc":"2.0","method":"set-loglevel","params":{"loglevel":"debug"},"id":12345}]
ROUTER → DEALER: [<uuid>][][{"jsonrpc":"2.0","result":{},"id":12345}]
```

**3. Authenticate:**
```
DEALER → ROUTER: [<uuid>][][{"jsonrpc":"2.0","method":"connect","params":{"username":"admin","passwd":"admin"},"id":12345}]
ROUTER → DEALER: [<uuid>][][{"jsonrpc":"2.0","result":{},"id":12345}]
```

**4. Query disk info:**
```
DEALER → ROUTER: [<uuid>][][{"jsonrpc":"2.0","method":"query-disk-info","params":{"virtual-disk":"/vms/vm-001.qcow2"},"id":12345}]
ROUTER → DEALER: [<uuid>][][{"jsonrpc":"2.0","result":{...qemu-img JSON output...},"id":12345}]
```

**5. Export disk via NBD:**
```
DEALER → ROUTER: [<uuid>][][{"jsonrpc":"2.0","method":"set-transport-channel","params":{"mode":1,"virtual-disk":"/vms/vm-001.qcow2","flag":1},"id":12345}]
ROUTER → DEALER: [<uuid>][][{"jsonrpc":"2.0","result":{"port":10809},"id":12345}]
```

**6. Heartbeat (every 3s):**
```
DEALER → ROUTER: [<uuid>][]["$HEARTBEAT"]
(no response needed)
```

**7. Disconnect:**
```
DEALER → ROUTER: [<uuid>][]["$CLOSING"]
(server cleans up transports and client context)
```

---

## 11. Open-Source Implementation

This specification is implemented at `h3c-cas-clone/cvd/`:

| File | Purpose |
|------|---------|
| `protocol.py` | All constants, data structures, JSON-RPC helpers |
| `cvd_ds.py` | CVD daemon with ZeroMQ ROUTER and all 7 handlers |
| `cvd_cli.py` | CLI client with ZeroMQ DEALER, matching cvd-cli commands |
| `cvd/__init__.py` | Package exports |
| `tests/test_cvd.py` | 41 unit tests covering protocol, handlers, wire format |

---

## 12. CVD SDK Version

```
Version: 1.0.0
Library: libcvd-1.0.0
Copyright: Copyright (C) 2019 New H3C Inc.
Build:    cvd-1.0-1.x86_64
RPM:      cvd-1.0-1.x86_64.rpm
          cvd-debuginfo-1.0-1.x86_64.rpm
          cvd-debugsource-1.0-1.x86_64.rpm
```

---

*Reconstructed from: `ds_handle.c`, `ds_server.c`, `ds_main.c`, `ds_conf.h`, `ds_business.h`, `ds_business.c`, `cli.c`, `sdk_client.c`, `libcvd.h`, `cvd_error.h`, `cvd_version.h`, `cas_export_disk_tool.pyc`, `cas_dirty_bitmap_tool.pyc`, `cas_vm_helpers.pyc`, `cas_bk_error.pyc`, `cas_libvirt_helper.pyc`, `cvd_process_checker.sh`*
