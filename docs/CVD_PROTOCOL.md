# H3C CVD (CAS Virtual Disk) Protocol Specification

Reconstructed from:
- `libcvd.h` / `cvd_error.h` / `cvd_version.h` (C SDK headers, version 1.0.0)
- `cvd-ds` / `cvd-cli` ELF binaries (stripped, strings analysis)
- `cas_export_disk_tool.pyc` (NBD disk export tool)
- `cas_dirty_bitmap_tool.pyc` (QMP dirty bitmap management)
- `cas_vm_helpers.pyc` (qemu-img backing chain, disk format detection)
- `cvd_process_checker.sh` (process lifecycle)
- `cvk_agent.conf` (connection timeouts, thread pools)

---

## 1. Architecture

```
 CVM (Management Node)                     CVK (Hypervisor Host)
 ┌──────────────────────┐                  ┌──────────────────────┐
 │  casserver.jar       │   REST/XML       │  cvk-agent (Java)    │
 │  (CAS REST API)      │◄──────────────►│  (Feign + OkHttp)   │
 │                      │   /cas/casrs     │                      │
 │  CVD Client (Java)   │                  │  cvd-ds (C binary)   │
 │  via libcvd JNI       │   JSON-RPC       │  listens on UNIX     │
 │                      │◄──────────────►│  socket / TCP        │
 └──────────────────────┘   over TLS       └──────────────────────┘
                                     │
                                     ▼
                            ┌──────────────────┐
                            │  QEMU/KVM + NBD  │
                            │  libvirt          │
                            └──────────────────┘
```

## 2. Transport

### 2.1 Connection Parameters (CvdConnectParams)
```c
typedef struct CvdConnectParams {
    char *ip;               // CVK host IP
    uint32_t port;          // CVD daemon port
    char *username;         // CVM username (HTTP Digest auth)
    char *password;         // CVM password
    char *vmname;           // VM name for per-VM disk operations (NULL for host-level)
    uint16_t transport_mode; // reserved, always 0
} CvdConnectParams;
```

### 2.2 Authentication
- Uses the same HTTP Digest auth as the CAS REST API
- CVD_EC_AUTH (10105) returned on invalid credentials
- CVD_EC_NETWORK (10102) on timeout
- CVD_EC_OVER_MAX_CONNECTION (10104) on connection limit reached

### 2.3 Transport modes
- Local: `CvdConnection *conn = NULL` — direct file access (no network)
- Remote: `conn != NULL` — JSON-RPC over TCP/TLS to CVK host

## 3. Protocol: JSON-RPC 2.0

The CVD daemon uses JSON-RPC 2.0 as its wire protocol (referenced in `cvd_error.h`):
```
 * https://www.jsonrpc.org/specification
 *
 * code    message          meaning
 * -32700  Parse error      Invalid JSON was received by the server.
 * -32600  Invalid Request  The JSON sent is not a valid Request object.
 * -32601  Method not found The method does not exist / is not available.
 * -32602  Invalid params   Invalid method parameter(s).
 * -32603  Internal error   Internal JSON-RPC error.
 * -32000 to -32099         Server error (implementation-defined)
```

### JSON-RPC Methods (reconstructed from C API):

| Method | Params | Returns | Description |
|--------|--------|---------|-------------|
| `disk.create` | filename, format, size, create_opts | result code | Create virtual disk |
| `disk.open` | filename, format, snapshot, flags | handle_id | Open disk, returns handle |
| `disk.close` | handle_id | — | Close disk handle |
| `disk.read` | handle_id, offset, count | base64(data) | Read bytes from disk |
| `disk.write` | handle_id, offset, base64(data) | bytes_written | Write bytes to disk |
| `disk.get_info` | handle_id | CvdDiskInfo JSON | Get disk metadata |
| `disk.query_data_blocks` | handle_id | [{offset, length}] | Query valid data blocks |
| `disk.resize` | handle_id, new_size | result code | Resize virtual disk |
| `snapshot.create` | handle_id, snap_name | result code | Create internal snapshot |
| `snapshot.delete` | handle_id, snap_name | result code | Delete snapshot |
| `snapshot.list` | handle_id | [snapshot names] | List snapshots |
| `export.start` | filename, port, read_only | port number | Start NBD export |
| `export.stop` | filename | result code | Stop NBD export |
| `bitmap.create` | vmname, bitmap_name | result code | Create dirty bitmap |
| `bitmap.remove` | vmname, bitmap_name | result code | Remove dirty bitmap |
| `bitmap.query` | vmname | [bitmap info] | Query dirty bitmaps |

## 4. Disk Handle Lifecycle

```
cvd_disk_open() → handle_id (opaque integer)
    │
    ├── cvd_disk_read(handle, offset, count, buf)
    ├── cvd_disk_write(handle, offset, count, buf)
    ├── cvd_disk_get_info(handle, &info)
    ├── cvd_disk_query_data_blocks(handle) → GList<CvdDataBlock>
    │
    └── cvd_disk_close(&handle)
```

**CAUTION from original:** After opening disk, caller MUST NOT perform I/O operations concurrently on the same CvdDiskHandle — behavior is undefined.

## 5. Disk Operations

### 5.1 Create Disk
```c
int cvd_disk_create(CvdConnection *conn,
    const char *filename,    // file path on CVK or local
    char *fmt,               // "raw", "qcow2", "vmdk", etc.
    uint64_t disk_size,      // virtual size in bytes
    const CvdDiskCreateOptions *create_opts);
```

Create options:
```c
typedef struct CvdDiskCreateOptions {
    uint64_t cflags;             // CVD_DISK_CFLAG_INHERIT_BACKING_METADATA (0x0001)
    char *backing_filename;      // backing file for qcow2
    char *backing_fmt;           // format of backing file
    char *options;               // same as qemu-img -o options
} CvdDiskCreateOptions;
```

### 5.2 Open Disk
```c
int cvd_disk_open(CvdConnection *conn,
    const char *filename,
    const char *fmt,             // NULL = auto-detect
    const char *snapshotname,    // NULL = open disk directly
    uint64_t flags,              // CVD_DISK_OFLAG_RD (0x0001) or RDWR (0x0002)
    CvdDiskHandle **handle);
```

### 5.3 Read/Write
```c
int cvd_disk_read(CvdDiskHandle *handle, int64_t offset, int count, void *buf);
int cvd_disk_write(CvdDiskHandle *handle, int64_t offset, int count, void *buf);
```
Returns bytes read/written on success, negative on error.

### 5.4 Query Data Blocks
```c
GList *cvd_disk_query_data_blocks(CvdDiskHandle *handle);
int cvd_disk_query_data_blocks_ex(CvdDiskHandle *handle, GList **list);
```
Returns list of `CvdDataBlock { int64_t offset; int64_t length; }` — the valid (allocated) blocks in a sparse disk image.

## 6. Disk Info Structure
```c
typedef struct CvdDiskInfo {
    char *filename;
    char *format;               // "raw", "qcow2", etc.
    int64_t actual_size;        // actual disk usage on storage
    int64_t virtual_size;       // virtual disk size
    int64_t cluster_size;
    bool encrypted;
    bool compressed;
    char *backing_filename;     // backing file name (qcow2 chain)
    char *backing_fmt;          // backing file format
} CvdDiskInfo;
```

## 7. NBD Export Protocol

From `cas_export_disk_tool.pyc`:
```
usage: cas_export_disk_tool [-h] [--filename FILENAME] [--snapshot SNAPSHOT]
                            [--port PORT] [--ipv6] [--read-only] [--format FORMAT]
                            {export,unexport,query}

Export/unexport virtual disk via NBD (Network Block Device)
```

Operations:
- `export`: Start NBD server for a disk file (on specified port)
- `unexport`: Stop NBD export
- `query`: Check if a filename is currently exported

The CVD daemon spawns `qemu-nbd` or uses QEMU's built-in NBD server to expose virtual disks over TCP (default port 10809 or configurable).

## 8. Dirty Bitmap Protocol (QMP)

From `cas_dirty_bitmap_tool.pyc`:
```
usage: cas_dirty_bitmap_tool [-h] --vmname VMNAME --bitmap BITMAP
                             [--file-list FILE_LIST [FILE_LIST ...]]
                             {create,remove,query}

Manage QEMU dirty bitmaps for incremental backup/DTS
```

Operations:
- `create`: Create persistent dirty bitmap on VM disks via QMP `block-dirty-bitmap-add`
- `remove`: Remove dirty bitmap via QMP `block-dirty-bitmap-remove`
- `query`: List bitmaps via QMP `query-block`

The tool connects to QEMU's QMP monitor socket to issue commands.

## 9. Disk Format Detection (qemu-img)

From `cas_vm_helpers.pyc`:
```python
class VmDiskInfo:
    def __init__(self, disk_type, disk_dev, drv_type, src_file, src_protocol, target_dev):
        ...
    
    def is_qcow3_disk(self) -> bool:
        # Runs: qemu-img info --backing-chain <filename>
        # Parses output for "compat: 1.1" → qcow3
        ...

    def support_dirty_bitmap(self) -> bool:
        # Checks qemu-img info for dirty bitmap capability
        ...
```

## 10. Error Codes
```c
#define CVD_EC_OK                0
#define CVD_EC_FAILURE           1
#define CVD_EC_INTERNAL_ERROR    10000
#define CVD_EC_INVALID_ARGUMENT  10050
#define CVD_EC_NOT_SUPPORTED     10051
#define CVD_EC_OUT_OF_MEMORY     10052
#define CVD_EC_INVALID_FORMAT    10100  // Invalid file format
#define CVD_EC_IO                10101
#define CVD_EC_NETWORK           10102
#define CVD_EC_EAGAIN            10103
#define CVD_EC_OVER_MAX_CONNECTION 10104
#define CVD_EC_AUTH              10105
#define CVD_EC_EXPORT_DISK       20051
#define CVD_EC_UNEXPORT_DISK     20052
#define CVD_EC_CONNECT_FAIL      20053
#define CVD_EC_QUEY_POOL_FAIL    20054
#define CVD_EC_QUEY_DISK_FAIL    20055

// JSON-RPC standard errors
#define CVD_EC_JRPC_PARSE_ERROR       (-32700)
#define CVD_EC_JRPC_INVALID_REQUEST   (-32600)
#define CVD_EC_JRPC_METHOD_NOT_FOUND  (-32601)
#define CVD_EC_JRPC_INVALID_PARAMS    (-32602)
#define CVD_EC_JRPC_INTERNAL_ERROR    (-32603)
```

## 11. CVD Daemon Lifecycle

From `cvd_process_checker.sh`:
```bash
#!/bin/bash
# Checks if cvd-ds process is running, restarts if not
# Monitors: ps aux | grep cvd-ds
# Logs: /var/log/cvd/
```

Systemd service: `/usr/lib/systemd/system/cvd-ds.service`

## 12. SCP File Transfer Protocol

From `cvk_agent.conf`:
```
scp.wait.time=43200           # 12 hours max SCP wait
scp.default.cmd.wait.time=600 # 10 minutes default command wait
scpto.connect=30              # 30 seconds connect timeout
scpto.server.alive=60         # 60 seconds keepalive
```

CVK agent uses SCP (Secure Copy over SSH) for:
- Transferring VM disk images between CVK hosts (migration, backup)
- Transferring ISO files to CVK hosts
- Log file collection
- Configuration file distribution

Authentication via SSH keys (`/root/.ssh/id_rsa`) distributed during CVK registration.

## 13. CVD Client Examples

### Local disk operations:
```c
// Create a qcow2 disk with backing file
CvdDiskCreateOptions opts = {
    .cflags = CVD_DISK_CFLAG_INHERIT_BACKING_METADATA,
    .backing_filename = "/vms/base.qcow2",
    .backing_fmt = "qcow2",
};
cvd_disk_create(NULL, "/vms/vm-001.qcow2", "qcow2", 50*1024*1024*1024ULL, &opts);

// Open and read
CvdDiskHandle *h;
cvd_disk_open(NULL, "/vms/vm-001.qcow2", NULL, NULL, CVD_DISK_OFLAG_RD, &h);

CvdDiskInfo *info;
cvd_disk_get_info(h, &info);
printf("virtual=%ld actual=%ld format=%s\n", info->virtual_size, info->actual_size, info->format);
cvd_free_disk_info(&info);

char buf[4096];
int n = cvd_disk_read(h, 0, sizeof(buf), buf);

GList *blocks = cvd_disk_query_data_blocks(h);
// iterate blocks...

cvd_disk_close(&h);
```

### Remote disk operations:
```c
CvdConnectParams params = {
    .ip = "192.168.1.100",
    .port = 9000,
    .username = "admin",
    .password = "Cloud@123",
    .vmname = NULL,
};
CvdConnection *conn;
cvd_connect(&params, &conn);

CvdDiskHandle *h;
cvd_disk_open(conn, "/vms/vm-001.qcow2", NULL, NULL, CVD_DISK_OFLAG_RDWR, &h);
// ... operations ...
cvd_disk_close(&h);
cvd_disconnect(&conn);
```

---

## 14. CVD SDK Version
```
Version: 1.0.0
Library: libcvd-1.0.0
Copyright: New H3C Inc. (2019)
```

---

*Reconstructed from: `libcvd.h`, `cvd_error.h`, `cvd_version.h`, `cas_export_disk_tool.pyc`, `cas_dirty_bitmap_tool.pyc`, `cas_vm_helpers.pyc`, `cvd_process_checker.sh`, `cvk_agent.conf`*
