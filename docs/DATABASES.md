# H3C CAS Clone — Databases

> **Source:** `cvm_server/models/vservice.py`, `cvm_server/models/cas_cic.py`, `docker-compose.yml`, `cvm_server/config.py`, `cvm_server/init_db.py`
> Complete database schemas for all three databases in the CAS deployment.

---

## Overview

| Database | Type | Port | Schema File | User | Password | Source |
|----------|------|------|------------|------|----------|--------|
| vservice | PostgreSQL 14 | 1523 | `schemas/01-vservice-tables.sql` | `ssadmin` | `Pzss@_w0rd` | `docker-compose.yml:10-47`, `config.py:54-61` |
| cas_cic | MySQL 8.0 | 3306 | `schemas/03-cic-tables.sql` | `ssadmin` | `Pzss@_w0rd` | `docker-compose.yml:50-80`, `config.py:64-69` |
| metrics | ClickHouse 23.8 | 8123/9000 | N/A (auto) | `default` | `Pzss@_w0rd` | `docker-compose.yml:143-174` |

---

## 1. PostgreSQL — vservice (Primary CAS Database)

> **Database:** `vservice`
> **Port:** 1523
> **Engine:** PostgreSQL 14-alpine
> **ORM Models:** `cvm_server/models/vservice.py:1-353`

### 1.1 Connection Pool (from `db.properties`)

| Parameter | Value | Source |
|-----------|-------|--------|
| maxActive | 120 | `config.py:72` |
| maxIdle | 50 | `config.py:73` |
| minIdle | 0 | `config.py:74` |
| maxWait | 30000ms | `config.py:75` |
| minEvictableIdleTime | 300000ms | `config.py:76` |
| max_connections | 500 | `docker-compose.yml:28` |
| password_encryption | md5 | `docker-compose.yml:29` |
| shared_buffers | 128MB | `docker-compose.yml:30`, `configs/postgresql/pg.conf:10` |
| max_wal_size | 1GB | `configs/postgresql/pg.conf:18` |
| min_wal_size | 80MB | `configs/postgresql/pg.conf:19` |
| log filename | `seasql-%a.log` | `docker-compose.yml:35` |

### 1.2 Table Listing

| # | Table Name | Model Class | Purpose | Source |
|---|-----------|-------------|---------|--------|
| 1 | `tbl_libvirt_pool_info` | `LibvirtPoolInfo` | Libvirt storage pool tracking | `vservice.py:23-31` |
| 2 | `tbl_libvirt_volume_info` | `LibvirtVolumeInfo` | Libvirt storage volume tracking | `vservice.py:34-48` |
| 3 | `tbl_operator` | `Operator` | Operator (user) management | `vservice.py:54-76` |
| 4 | `tbl_hostpool` | `HostPool` | Host pool definitions | `vservice.py:82-92` |
| 5 | `tbl_cluster` | `Cluster` | Cluster management + HA/LB/DRS settings | `vservice.py:98-138` |
| 6 | `tbl_host` | `Host` | Hypervisor host registration | `vservice.py:144-192` |
| 7 | `tbl_domain` | `Domain` | VM (domain) records — largest table | `vservice.py:197-276` |
| 8 | `tbl_domain_network` | `DomainNetwork` | VM network interface config | `vservice.py:281-306` |
| 9 | `tbl_domain_storage` | `DomainStorage` | VM disk/storage config | `vservice.py:312-326` |
| 10 | `tbl_operlog` | `OperLog` | Operation audit log | `vservice.py:332-353` |

> **Source:** `cvm_server/models/vservice.py:1-353`

### 1.3 Key Table Schemas

#### `tbl_host` — Hypervisor Host
> **Source:** `vservice.py:144-192`

| Column | Type | Description |
|--------|------|-------------|
| `id` | BIGINT PK | Auto-increment |
| `host_pool_id` | BIGINT FK → `tbl_hostpool` | Parent host pool |
| `cluster_id` | BIGINT FK → `tbl_cluster` | Cluster assignment |
| `name` | VARCHAR(256) | Host name |
| `ipaddr` | VARCHAR(256) | IP address |
| `host_user` | VARCHAR(45) | SSH user (default: `root`) |
| `pw` | VARCHAR(256) | SSH password |
| `memory` | INTEGER | Total memory |
| `cpu` | INTEGER | CPU count |
| `cpu_cores` | INTEGER | CPU cores |
| `cpu_sockets` | INTEGER | CPU sockets |
| `storage` | BIGINT | Storage size |
| `status` | INTEGER | 0=offline, 1=online, 2=fault |
| `cpu_frequency` | INTEGER | CPU MHz |
| `cpu_provider` | VARCHAR(45) | CPU vendor |
| `cpu_detail` | VARCHAR(128) | CPU model |
| `provider` | VARCHAR(128) | Server vendor |
| `storage_allocation` | BIGINT | Allocated storage |
| `storage_avilable` | BIGINT | Available storage |
| `iscsi_node_name` | VARCHAR(128) | iSCSI initiator name |
| `maintain` | INTEGER | Maintenance mode flag |
| `cvk_maintain` | INTEGER | CVK-level maintenance |
| `mac` | VARCHAR(32) | Management MAC |
| `op_group_id` | BIGINT | Operator group (default: 1) |
| `op_group_code` | VARCHAR(256) | Operator group code (default: `00`) |
| `wake_category` | INTEGER | Wake-on-LAN category |
| `ipmi_ipaddr` | VARCHAR(256) | IPMI address |
| `ipmi_user` / `ipmi_pw` | VARCHAR(45) | IPMI credentials |
| `ha_enable` | INTEGER | HA enabled (0/1) |
| `cvk_version` | VARCHAR(45) | CVK agent version |
| `add_time` | TIMESTAMP | When host was added |
| `ha_resource` | INTEGER | HA resource status |
| `node_num` | INTEGER | Node number (default: 0) |
| `storage_ip` | VARCHAR(256) | Storage network IP |
| `ilos` | VARCHAR(64) | iLO reference |
| `type` | INTEGER | Host type |
| `sync_mark` | INTEGER | Synchronization mark |
| `nvme_node_name` | VARCHAR(128) | NVMe node name |
| `top_emc_cpu_model` | INTEGER | EMC CPU model |
| `secret_level` | INTEGER | Security level (default: 1) |
| `rdma_issue` | INTEGER | RDMA support (default: 1) |
| `serial_number` | VARCHAR(128) | Hardware serial |
| `host_profile_id` | BIGINT | Host profile reference |
| `third_party_encrypted` | INTEGER | Third-party encryption flag |

#### `tbl_domain` — VM (Domain)
> **Source:** `vservice.py:197-276`

| Column | Type | Description |
|--------|------|-------------|
| `id` | BIGINT PK | Auto-increment |
| `host_id` | INTEGER | Currently running host |
| `host_pool_id` | BIGINT | Parent host pool |
| `cluster_id` | BIGINT FK → `tbl_cluster` | Cluster assignment |
| `domain_name` | VARCHAR(128) | VM name |
| `title` | VARCHAR(128) | Display title |
| `description` | VARCHAR(2048) | Description |
| `memory` | INTEGER | Memory (MB) |
| `cpu` | INTEGER | vCPU count |
| `cdrom` | INTEGER | CD-ROM count |
| `enable` | INTEGER | Enabled flag |
| `uuid` | VARCHAR(60) | Libvirt UUID |
| `os_bit` | VARCHAR(45) | OS bitness |
| `system` | INTEGER | OS type (0=Windows, 1=Linux) |
| `img_file_name` | VARCHAR(256) | Image file name |
| `img_file_type` | VARCHAR(45) | Image type (default: `NotDeployed`) |
| `auto` | INTEGER | Auto-start |
| `drive` | VARCHAR(45) | Boot drive |
| `booting_device` | INTEGER | Boot device order |
| `auto_booting` | INTEGER | Auto-boot on host start |
| `priority` | INTEGER | Business priority |
| `auto_migrate` | SMALLINT | Auto-migration enabled |
| `enable_vnc_proxy` | INTEGER | VNC proxy enabled |
| `create_date` | TIMESTAMP | Creation date |
| `computer_name` | VARCHAR(128) | Guest hostname |
| `os_version` | VARCHAR(128) | OS version string |
| `memory_unit` | VARCHAR(10) | Memory unit |
| `memory_limit` | NUMERIC(10,2) | Memory limit |
| `ha_status` | INTEGER | HA status |
| `originate` | INTEGER | VM origin (0=created, 1=imported) |
| `src_host_id` | BIGINT | Source host for migration |
| `memory_locked` | INTEGER | Memory locked flag |
| `memory_priority` | INTEGER | Memory priority |
| `cpu_quota_init` | NUMERIC(10,2) | CPU quota |
| `protect_model` | INTEGER | Protection model |
| `start_status` | INTEGER | Start status |
| `status` | INTEGER | VM state (1=NOSTATE, 2=RUNNING, 3=SHUTDOWN, 4=PAUSED) |
| `last_update_time` | INTEGER | Last update timestamp |
| `ha_manage` | INTEGER | HA managed (default: 1) |
| `templet_id` | BIGINT | Template reference |
| `del_time` | INTEGER | Deletion timestamp |
| `disk_change` | INTEGER | Disk change counter |
| `castools_status` | INTEGER | CAS Tools status |
| `castools_version` | VARCHAR(20) | CAS Tools version |
| `uptime` | INTEGER | VM uptime (default: -1) |
| `templet_storage_path` | VARCHAR(512) | Template storage path |
| `antivirus_enable` | INTEGER | Antivirus enabled |
| `secret_level` | INTEGER | Security level |
| `last_off_time` | INTEGER | Last offline time |
| `integrity_check` | INTEGER | Integrity verification |
| `time_sync` | INTEGER | Time sync (default: 2) |
| `vm_type` | INTEGER | VM type (default: 1) |
| `host_binding` | INTEGER | Host binding |
| `enable_increase_cpu` | INTEGER | Hot-add CPU enabled |
| `metadata` | VARCHAR(256) | Metadata |
| `rdt` | VARCHAR(8) | RDT setting |
| `template_status` | INTEGER | Template status |
| `antivirus_status` | INTEGER | Antivirus status |
| `kaas_vm` | INTEGER | KaaS VM flag |
| `huge_page_status` | BOOLEAN | Hugepage enabled |
| `issue_date` | BIGINT | Issue date |
| `isencrypt` | BOOLEAN | Encryption enabled (default: false) |
| `secrect_key` | VARCHAR(256) | Secret key |
| `algorithm` | VARCHAR(64) | Encryption algorithm |
| `ft_status` | SMALLINT | Fault tolerance status |
| `cpu_core` | INTEGER | CPU cores |
| `cpu_socket` | INTEGER | CPU sockets |
| `auto_mem` | INTEGER | Auto memory |

#### `tbl_cluster` — Cluster
> **Source:** `vservice.py:98-138`

| Column | Type | Description |
|--------|------|-------------|
| `id` | BIGINT PK | Auto-increment |
| `host_pool_id` | BIGINT FK → `tbl_hostpool` | Parent host pool |
| `name` | VARCHAR(256) | Cluster name |
| `description` | VARCHAR(256) | Description |
| `enable_ha` | INTEGER | HA enabled (0/1) |
| `vm_restart_priority` | INTEGER | VM restart priority |
| `enable_lb` | INTEGER | Load balancing enabled (0/1) |
| `persist_time` | INTEGER | Persist time for LB |
| `check_interval` | INTEGER | LB check interval |
| `lb_monitor_id` | BIGINT | LB monitor reference |
| `enable_slb` | INTEGER | Storage LB enabled |
| `slb_persist_time` | INTEGER | SLB persist time |
| `slb_check_interval` | INTEGER | SLB check interval |
| `enable_ipm` | INTEGER | Intelligent Power Management |
| `drs_enable_time` | INTEGER | DRS enable timestamp |
| `ipm_enable_time` | INTEGER | IPM enable timestamp |
| `broadcast_addr` | VARCHAR(256) | Broadcast address |
| `broadcast_port` | INTEGER | Broadcast port |
| `ha_min_host` | INTEGER | Minimum hosts for HA |
| `enable_storage_ha` | INTEGER | Storage HA enabled |
| `enable_stretched` | INTEGER | Stretched cluster enabled |
| `ha_cpu_retain` | INTEGER | HA CPU reservation |
| `ha_mem_retain` | INTEGER | HA memory reservation |
| `ha_control_strategy` | INTEGER | HA control strategy |
| `enable_business_ha` | INTEGER | Business HA enabled |
| `trigger_action` | INTEGER | HA trigger action |
| `type` | INTEGER | Cluster type |
| `container_cluster` | INTEGER | Container cluster flag |
| `local_disk_ha` | INTEGER | Local disk HA enabled |
| `local_disk_time` | INTEGER | Local disk HA time (default: 30) |
| `strategy_delay_time` | INTEGER | Strategy delay (default: 12000ms) |
| `cpu_mode` | INTEGER | CPU mode (0=default) |
| `emc_type` | INTEGER | EMC type |
| `emc_cpu_model` | INTEGER | EMC CPU model |
| `host_profile_id` | BIGINT | Host profile reference |

#### `tbl_operlog` — Operation Audit Log
> **Source:** `vservice.py:332-353`

| Column | Type | Description |
|--------|------|-------------|
| `id` | BIGINT PK | Auto-increment |
| `login_name` | VARCHAR(256) | Operator login |
| `user_name` | VARCHAR(256) | Operator display name |
| `oper_start_time` | TIMESTAMP | Operation start time |
| `oper_time` | TIMESTAMP | Operation completion time |
| `address` | VARCHAR(256) | Client IP address |
| `category` | INTEGER | Operation category |
| `description` | VARCHAR(512) | Operation description |
| `result` | SMALLINT | 0=success, 1=failure |
| `failure_reason` | VARCHAR(512) | Failure reason |
| `target_id` | BIGINT | Affected resource ID |
| `target_name` | VARCHAR(256) | Affected resource name |
| `level` | SMALLINT | Severity level |
| `event` | SMALLINT | Event type |
| `category_id` | BIGINT | Category ID |
| `related_category` | INTEGER | Related category |
| `oper_obj` | VARCHAR(64) | Operation object |
| `op_group_id` | BIGINT | Operator group |
| `operator_type` | INTEGER | Operator type |
| `data_signature` | VARCHAR(512) | Data integrity signature |

---

## 2. MySQL — cas_cic (Cloud Infrastructure Controller)

> **Database:** `cas_cic`
> **Port:** 3306
> **Engine:** MySQL 8.0
> **ORM Models:** `cvm_server/models/cas_cic.py:1-62`

### 2.1 Configuration

| Parameter | Value | Source |
|-----------|-------|--------|
| charset | `utf8mb4` | `docker-compose.yml:67` |
| collation | `utf8mb4_general_ci` | `docker-compose.yml:68` |
| max_connections | 500 | `docker-compose.yml:69` |
| auth plugin | `mysql_native_password` | `docker-compose.yml:70` |

### 2.2 Table Listing

| # | Table Name | Model Class | Purpose | Source |
|---|-----------|-------------|---------|--------|
| 1 | `tbl_cic_config` | `CicConfig` | CIC system config key-value store | `cas_cic.py:19-25` |
| 2 | `tbl_cic_task` | `CicTask` | CIC async task tracking | `cas_cic.py:28-40` |
| 3 | `tbl_cic_event` | `CicEvent` | CIC event log | `cas_cic.py:43-52` |
| 4 | `tbl_cic_resource_pool` | `CicResourcePool` | CIC resource pool definition | `cas_cic.py:55-62` |
| 5 | (implied) | Additional CIC tables | Extended in `schemas/03-cic-tables.sql` | `init_db.py:116` |

> **Source:** `cvm_server/models/cas_cic.py:1-62`

### 2.3 Table Schemas

#### `tbl_cic_config`
```sql
CREATE TABLE tbl_cic_config (
    id          BIGINT PRIMARY KEY AUTO_INCREMENT,
    config_key  VARCHAR(256) NOT NULL,
    config_value TEXT,
    description VARCHAR(512)
);
```
> **Source:** `cas_cic.py:19-25`

#### `tbl_cic_task`
```sql
CREATE TABLE tbl_cic_task (
    id           BIGINT PRIMARY KEY AUTO_INCREMENT,
    task_id      VARCHAR(128) NOT NULL,
    task_type    VARCHAR(64) NOT NULL,
    status       INTEGER DEFAULT 0,     -- 0=pending, 1=running, 2=completed, 3=failed
    target_id    VARCHAR(128),
    target_name  VARCHAR(256),
    result       INTEGER DEFAULT 0,
    fail_msg     TEXT,
    created_at   TIMESTAMP,
    completed_at TIMESTAMP
);
```
> **Source:** `cas_cic.py:28-40`

---

## 3. ClickHouse — metrics (Time-Series Analytics)

> **Database:** `metrics`
> **Port:** 8123 (HTTP), 9000 (Native)
> **Engine:** ClickHouse 23.8-alpine
> **User:** `default` / `Pzss@_w0rd`

### 3.1 Configuration

| Parameter | Value | Source |
|-----------|-------|--------|
| User | `default` | `docker-compose.yml:151` |
| Password | `Pzss@_w0rd` | `docker-compose.yml:152` |
| Database | `metrics` | `docker-compose.yml:153` |
| Config files | `config.xml`, `users.xml` | `docker-compose.yml:158-159` |
| Ulimits (nofile) | `262144:262144` | `docker-compose.yml:162-164` |

### 3.2 Purpose

The ClickHouse metrics database stores time-series monitoring data collected by the caSserver/CAS monitoring process (30+ alarm definitions from `casmon.conf`). Metrics include:

- CPU/memory/disk utilization
- Network interface errors (ifrxdroprate, iftxdroprate, hostvswitchpacketrcverrrate, etc.)
- Host temperature (hostcputemp)
- Host log growth (hostloggrow)
- Interface/fabric faults
- Storage path/volume health
- iSCSI session status

> **Source:** `configs/cvk/casmon.conf:1-504`

---

## 4. In-Memory Mock Data Store

> **Source:** `cvm_server/store.py:1-296`

For development and testing, the CVM server uses an in-memory data store that mirrors the database tables:

| Collection | DB Table (vservice) | Description |
|-----------|-------------------|-------------|
| `store.hostpools` | `tbl_hostpool` | 2 mock pools (DefaultPool, GPUPool) |
| `store.clusters` | `tbl_cluster` | 2 mock clusters |
| `store.hosts` | `tbl_host` | 3 mock hosts (2 online, 1 offline) |
| `store.vms` | `tbl_domain` | 3 mock VMs |
| `store.tasks` | `tbl_cic_task` (MySQL) | Dynamic task tracking |
| `store.events` | `tbl_cic_event` (MySQL) | Last 100 events |
| `store.storage` | `tbl_libvirt_pool_info` | 3 mock storage pools |
| `store.storage_adapters` | — | 2 mock adapters (iSCSI + FC) |
| `store.business_templates` | — | 3 priority templates |
| `store.cluster_rules` | — | 2 DRS rules (affinity/anti-affinity) |
| `store.numa_topology` | — | 2 NUMA nodes |
| `store.pci_devices` | — | 2 mock PCI devices |

> **Source:** `store.py:39-217`

---

## 5. Database Initialization

The `init_db.py` script initializes both databases:

```bash
python init_db.py --pg     # PostgreSQL vservice
python init_db.py --mysql  # MySQL cas_cic
python init_db.py --all    # Both
```

Schema files (referenced by `init_db.py` but not yet created in repo):
- `schemas/01-vservice-tables.sql` — PostgreSQL vservice schema
- `schemas/03-cic-tables.sql` — MySQL cas_cic schema

> **Source:** `cvm_server/init_db.py:1-163`
