# H3C CAS Clone — Architecture

> **Source:** Reverse-engineered from H3C CAS R0785P03 (V700R003B06D005) Enterprise distribution
> **Repository:** `h3c-cas-clone/`

## System Overview

The H3C CAS (Cloud Automation System) is an enterprise virtualization management platform similar to VMware vSphere. This clone replicates the complete stack using Docker Compose, with a Python implementation of the CVM management server and CVK hypervisor agent.

The system follows a two-tier management architecture:
- **CVM (Cloud Virtual Machine Manager):** Central management server with REST API
- **CVK (Cloud Virtual Kernel):** Hypervisor agent running on each KVM/QEMU host

```
                          ┌────────────────────────────────────────┐
                          │          Docker Compose Stack          │
                          │                                        │
   Client (CAS Tools) ───►│  cvm-server      (CAS REST API)        │
   OpenStack Nova     ───►│  8080 HTTP / 8443 HTTPS                │
   Web UI (casfront)  ───►│  FastAPI + Uvicorn (replaces Tomcat)   │
                          │  HTTP Digest Auth (RFC 2617)            │
                          │  XML request/response                   │
                          │  Async task model via /message/{taskId} │
                          │                                        │
                          │  ┌─────────────────────────────────┐    │
                          │  │  Infrastructure Services         │    │
                          │  │  pg 1523  │ mysql 3306 │ redis  │    │
                          │  │  rmq 5672 │ kafka 9092 │ ch 8123│    │
                          │  └─────────────────────────────────┘    │
                          │                                        │
                          │  cvk-agent       (Hypervisor Host)     │
                          │  26165 TCP / 26167 UDP                 │
                          │  libvirt → QEMU/KVM                    │
                          │  Open vSwitch (OVS) networking         │
                          │  cvd-ds storage management             │
                          └────────────────────────────────────────┘
```

## Component Architecture

### 1. CVM Server (`cvm_server/`)

The central management server — a FastAPI application replacing the original Tomcat + `casserver.jar`.

| Component | Source | Description |
|-----------|--------|-------------|
| `main.py` | L1-19 | FastAPI app entry point, router mounting, middleware |
| `auth.py` | L1-174 | HTTP Digest authentication middleware (RFC 2617) |
| `config.py` | L1-112 | Server, DB, CVK agent, RabbitMQ config from server.xml + db.properties |
| `database.py` | L1-67 | SQLAlchemy async engine pool for PostgreSQL + MySQL |
| `store.py` | L1-296 | In-memory mock data store (mirrors PostgreSQL vservice + MySQL cas_cic) |
| `xml_utils.py` | L1-593 | XML response builders matching original CasXmlBuilder format |
| `init_db.py` | L1-163 | Database initialization script for vservice + cas_cic schemas |
| `models/vservice.py` | L1-353 | SQLAlchemy ORM models for PostgreSQL vservice database (13 tables) |
| `models/cas_cic.py` | L1-62 | SQLAlchemy ORM models for MySQL cas_cic database (5 tables) |

**Routers** (mounted under `/cas/casrs`):
| Router | Source | Description |
|--------|--------|-------------|
| `routers/operator.py` | L1-15 | Health check (`/operator/test`) |
| `routers/hostpool.py` | L1-30 | Host pool management |
| `routers/cluster.py` | L1-34 | Cluster/DRS rules |
| `routers/respool.py` | L1-54 | Resource pools, GPUs, vGPUs, business templates |
| `routers/nova.py` | L1-519 | OpenStack Nova compatibility — largest router (40+ endpoints) |
| `routers/vm.py` | L1-255 | VM lifecycle operations (start, stop, pause, migrate, snapshot, delete) |
| `routers/storage.py` | L1-32 | Storage pool management |
| `routers/message.py` | L1-27 | Async task polling (`/message/{taskId}`) |
| `routers/events.py` | L1-44 | Event bus + RabbitMQ config |
| `routers/console.py` | L1-21 | VNC/SPICE console access |

> **Source:** `cvm_server/main.py:61-101` — All routers registered via `cas_app.include_router()`

### 2. CVK Agent (`cvk_agent/`)

The hypervisor agent that runs on each KVM host — a Python clone of the Java `cvk-agent-api.jar`.

> **Source:** `cvk_agent/README.md:1-16` — Reverse-engineered from `cvk-agent-api.jar`, `FeignConfiguration.java`, `CvkComputeCmd.java`, `DomainHandler.java`

| Component | Source | Description |
|-----------|--------|-------------|
| `agent.py` | L1-341 | Main CvkAgent daemon — wires all subsystems together |
| `config.py` | L1-219 | CvkConfig — mirrors cvk_agent.conf + FeignConfiguration.java |
| `feign.py` | L1-370 | CvkFeignClient — HTTP Digest REST client (mirrors Java Feign+OkHttp) |
| `threadpool.py` | L1-177 | CvkThreadPool — mirrors Java ThreadPoolExecutor |
| `scp.py` | L1-332 | ScpClient — SCP/SSH file transfer (mirrors SecureShellManager) |
| `host.py` | L1-594 | HostRegistrar — hardware discovery + CVM registration |
| `domain.py` | L1-493 | DomainManager — VM lifecycle via libvirt |
| `storage.py` | L1-668 | StorageManager — pool/volume management (mirrors cvd-ds) |
| `network.py` | L1-569 | NetworkManager — OVS bridge/VLAN/VXLAN management |
| `migration.py` | L1-414 | MigrationCoordinator — live/cold VM migration |
| `heartbeat.py` | L1-250 | HeartbeatService — periodic health reporting to CVM |
| `eventbus.py` | L1-472 | RabbitMQ/HTTP/Noop event bus + EventPublisher |

**Agent Startup Sequence:**
> **Source:** `cvk_agent/agent.py:27-36`

1. Load configuration from `/etc/cvk/cvk_agent.conf`
2. Initialize Feign REST client (HTTP transport to CVM)
3. Start thread pool (core=8, max=200, queue=500)
4. Initialize SCP client for file transfers
5. Register with CVM (report host hardware info)
6. Start heartbeat service (30s interval)
7. Connect to RabbitMQ event bus
8. Enter main event loop

### 3. Infrastructure Services

| Service | Image | Port | Purpose |
|---------|-------|------|---------|
| PostgreSQL | `postgres:14-alpine` | 1523 | vservice database (primary CAS DB) |
| MySQL | `mysql:8.0` | 3306 | cas_cic database (CIC controller) |
| Redis | `redis:7-alpine` | 6379 | Cache & session store |
| RabbitMQ | `rabbitmq:3.12-management-alpine` | 5672/15672 | AMQP message broker (events) |
| ClickHouse | `clickhouse/clickhouse-server:23.8-alpine` | 8123/9000 | Metrics database |
| Kafka | `bitnami/kafka:3.6` | 9092 | Async producer |
| noVNC | `theasp/novnc:latest` | 8081 | Web VNC console proxy |

> **Source:** `docker-compose.yml:1-360`, `README.md:39-49`

### 4. Mock Backends

All subsystems support mock mode for testing without real hardware:

| Backend | Mock Implementation | Source |
|---------|-------------------|--------|
| libvirt | `MockDomain` + `MockLibvirtConnection` | `domain.py:70-169` |
| OVS | Mock bridge/port via dicts | `network.py` |
| Storage | Mock pools/volumes in memory | `storage.py` |
| SCP | Returns success without real SSH | `scp.py:321-332` |
| RabbitMQ | `NoopEventBus` with in-memory storage | `eventbus.py:144-170` |
| HTTP | Real urllib3 but with mock CVM | `feign.py` |
| DataStore | In-memory dicts mirroring DB tables | `store.py:19-34` |

> **Source:** `cvk_agent/README.md:147-156`

## Directory Structure

```
h3c-cas-clone/
├── docker-compose.yml          # Full stack orchestration
├── README.md                    # Project overview
├── cvm_server/                  # CVM management server (FastAPI)
│   ├── main.py                  # Entry point
│   ├── config.py                # Server/DB/auth config
│   ├── auth.py                  # HTTP Digest auth
│   ├── database.py              # SQLAlchemy engines
│   ├── store.py                 # In-memory data store
│   ├── xml_utils.py             # XML response builders
│   ├── init_db.py               # DB init script
│   ├── models/                  # SQLAlchemy ORM models
│   │   ├── vservice.py          # PostgreSQL tables
│   │   └── cas_cic.py           # MySQL tables
│   └── routers/                 # API endpoint handlers
│       ├── operator.py
│       ├── hostpool.py
│       ├── cluster.py
│       ├── respool.py
│       ├── nova.py
│       ├── vm.py
│       ├── storage.py
│       ├── message.py
│       ├── events.py
│       └── console.py
├── cvk_agent/                   # CVK hypervisor agent
│   ├── cvk_agent/               # Main package
│   │   ├── agent.py             # Daemon orchestrator
│   │   ├── config.py            # Configuration
│   │   ├── feign.py             # REST client
│   │   ├── threadpool.py        # Thread pool
│   │   ├── scp.py               # SCP client
│   │   ├── host.py              # Host registration
│   │   ├── domain.py            # VM lifecycle
│   │   ├── storage.py           # Storage management
│   │   ├── network.py           # OVS networking
│   │   ├── migration.py         # VM migration
│   │   ├── heartbeat.py         # Health reporting
│   │   └── eventbus.py          # Event bus
│   ├── tests/
│   ├── Dockerfile
│   ├── requirements.txt
│   └── cvk_agent.conf
├── configs/                     # Extracted from R0785P03
│   ├── cvm/                     # db.properties, redis, kafka, clickhouse
│   ├── cvk/                     # cvk_agent.conf, casmon.conf, casaudit.conf, etc.
│   ├── tomcat/                  # server.xml
│   ├── postgresql/              # pg.conf, pg_hba.conf
│   ├── redis/                   # redis.conf
│   ├── clickhouse/              # config.xml, users.xml
│   └── kafka/
├── tests/
│   └── test_e2e.py              # End-to-end test suite
└── docs/                        # Master documentation
```

## Data Flow

### CVM → CVK (Management Commands)
```
Client (CLI/UI/OpenStack)
  └─► CVM REST API (HTTP 8080/HTTPS 8443)
        └─► XML request with HTTP Digest auth
              └─► CVM processes request, creates async task
                    └─► CVM calls CVK agent via Feign client (REST)
                          └─► CVK agent executes via libvirt/QEMU/OVS
                                └─► CVK returns result to CVM
                                      └─► Client polls /message/{taskId} for completion
```

### CVK → CVM (Heartbeat & Events)
```
CVK Agent
  ├─► Heartbeat Service (every 30s)
  │     └─► CVM /cas/casrs/nova/hostResource
  │
  ├─► RabbitMQ (AMQP 5672, vhost=cloudMsgHost)
  │     ├─► exchange: cloud_vm_exchange_direct
  │     └─► queue: cas_vm_event_nova_compute
  │
  └─► HTTP fallback (when RabbitMQ unavailable)
        └─► CVM /cas/casrs/events
```

> **Source:** `cvk_agent/agent.py:199-239`, `heartbeat.py:100-143`, `eventbus.py:173-236`

## Auth Flow

```
Client                         CVM Server
  │                               │
  ├─ GET /cas/casrs/... ─────────►│ 401 + WWW-Authenticate: Digest realm="CAS", nonce=...
  │                               │
  ├─ Compute HA1=MD5(user:realm:pass), HA2=MD5(method:uri)
  │  response=MD5(HA1:nonce:nc:cnonce:qop:HA2)
  ├─ GET + Authorization: Digest ─►│ Verify nonce, compute expected response
  │                               ├─► Nonce timeout: 300s
  │◄──── 200 + Server: CVM ───────┤  Auth success
  │                               │
  │  (403 → retry up to 10 times) │
```

> **Source:** `cvm_server/auth.py:26-174`, `cvm_server/config.py:41-48`

## Key Design Decisions

1. **FastAPI replaces Tomcat**: Original used Tomcat 8.5 + Java Spring. Clone uses FastAPI + Uvicorn.
2. **XML everywhere**: All API responses are XML (no JSON). Matching origin `application/xml;charset=UTF-8`.
3. **HTTP Digest Auth**: RFC 2617 with realm="CAS", algorithm=MD5, qop="auth".
4. **Async task model**: All state-changing operations return a task ID, client polls `/message/{taskId}`.
5. **Server header "CVM"**: All responses include `Server: CVM` header to match original.
6. **In-memory store for dev**: Production would use PostgreSQL + MySQL; mock uses Python dicts.
7. **No OpenAPI docs**: `docs_url=None, redoc_url=None, openapi_url=None` matching the original which had no Swagger.
8. **DES-ECB encryption**: Original used DES-ECB (key: `hzbdbkz1`) for credential encryption in property files.
