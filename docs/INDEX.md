# H3C CAS Clone — Master Documentation Index

> **H3C CAS R0785P03 (V700R003B06D005) Enterprise — Reverse-Engineered & Cloned**
> **Repository:** `/home/kali/Downloads/h3c/h3c-cas-clone/`

## Documentation Map

| Document | Description | Key Contents |
|----------|-------------|--------------|
| [**ARCHITECTURE.md**](ARCHITECTURE.md) | Complete system architecture | Components, data flow, auth flow, directory structure, design decisions |
| [**VERSIONS.md**](VERSIONS.md) | Every version number found | CAS R0785P03, libvirt 6.3.0, QEMU 5.0, OVS 2.16.4, kernel 5.10.0, Java libs, Python deps, all timeouts/thresholds |
| [**ENDPOINTS.md**](ENDPOINTS.md) | Complete REST API catalog | 85 endpoints across 10 routers with method, path, query params, response format, source file references |
| [**PROTOCOL.md**](PROTOCOL.md) | Wire protocol specification | HTTP Digest auth (RFC 2617), XML message formats, async task model, event bus (AMQP + HTTP fallback), heartbeat, SCP |
| [**DATABASES.md**](DATABASES.md) | All database schemas | PostgreSQL vservice (10 tables), MySQL cas_cic (5+ tables), ClickHouse metrics, in-memory mock store |
| [**PORTS.md**](PORTS.md) | Every network port | ~42 unique TCP/UDP ports across all services with protocol, service, purpose, and source references |

---

## Project Quick Reference

### Services & Credentials

| Service | Port | User | Password | Database/VHost |
|---------|------|------|----------|----------------|
| CVM REST API | 8080/8443 | `admin` / `root` | `Cloud@123` / `h3cadmin` | — |
| PostgreSQL | 1523 | `ssadmin` | `Pzss@_w0rd` | `vservice` |
| MySQL | 3306 | `ssadmin` | `Pzss@_w0rd` | `cas_cic` |
| Redis | 6379 | — | `Sy@Redi$79` | — |
| RabbitMQ | 5672 | `cloud` | `Cl@oud13` | `cloudMsgHost` |
| ClickHouse | 8123/9000 | `default` | `Pzss@_w0rd` | `metrics` |
| Kafka | 9092 | — | — | — |

> **Source:** `README.md:41-49`

### Key Endpoints (Quick Test)

```bash
# Health check
curl -u admin:Cloud@123 --digest http://localhost:8080/cas/casrs/operator/test -v

# List host pools
curl -u admin:Cloud@123 --digest http://localhost:8080/cas/casrs/hostpool/all

# List VMs
curl -u admin:Cloud@123 --digest http://localhost:8080/cas/casrs/nova/vmList

# Start VM
curl -u admin:Cloud@123 --digest -X POST http://localhost:8080/cas/casrs/vm/start/vm-001
```

> **Source:** `cvm_server/main.py:159`, `README.md:55-63`

### Auth Parameters

| Parameter | Value |
|-----------|-------|
| Type | HTTP Digest (RFC 2617) |
| Realm | `CAS` |
| Algorithm | MD5 |
| QoP | `auth` |
| Nonce Timeout | 300s |
| API Retry Count | 10 |

> **Source:** `cvm_server/config.py:41-48`, `cvk_agent/config.py:120`

### CVK Agent Config Defaults

| Parameter | Value | Description |
|-----------|-------|-------------|
| Feign Connect Timeout | 10s | CVM connection timeout |
| Feign Read Timeout | 600s | Normal API call |
| Feign Slow Task Timeout | 172800s (48h) | Long-running operations |
| SCP Wait Time | 43200s (12h) | SCP file transfer |
| Thread Pool Core | 8 | Minimum threads |
| Thread Pool Max | 200 | Maximum threads |
| Thread Pool Queue | 500 | Queue capacity |
| Heartbeat Interval | 30s | Health reporting |
| Heartbeat Timeout | 120s | Before disconnected |
| RabbitMQ VHost | `cloudMsgHost` | Event bus |
| RabbitMQ Exchange | `cloud_vm_exchange_direct` | Direct exchange |
| RabbitMQ Queue | `cas_vm_event_nova_compute` | Event queue |
| RabbitMQ Creds | `cloud` / `Cl@oud13` | AMQP auth |

> **Source:** `cvk_agent/cvk_agent.conf:1-73`, `cvk_agent/config.py:1-219`

---

## Source File Map

### CVM Server (`cvm_server/`)

| File | Lines | Purpose |
|------|-------|---------|
| `main.py` | 175 | FastAPI app, router mounting, middleware |
| `auth.py` | 174 | HTTP Digest auth (RFC 2617) |
| `config.py` | 112 | All configuration from server.xml + db.properties |
| `database.py` | 67 | SQLAlchemy async engine pool |
| `store.py` | 296 | In-memory mock data store |
| `xml_utils.py` | 593 | XML response builders (matching CasXmlBuilder) |
| `init_db.py` | 163 | Database init script |
| `models/vservice.py` | 353 | PostgreSQL ORM (10 tables) |
| `models/cas_cic.py` | 62 | MySQL ORM (5 tables) |
| `routers/operator.py` | 15 | Health check |
| `routers/hostpool.py` | 30 | Host pool management |
| `routers/cluster.py` | 34 | Cluster/DRS rules |
| `routers/respool.py` | 54 | Resource pools, GPUs, vGPUs |
| `routers/nova.py` | 519 | 42 OpenStack Nova endpoints |
| `routers/vm.py` | 255 | 25 VM lifecycle endpoints |
| `routers/storage.py` | 32 | Storage pool management |
| `routers/message.py` | 27 | Async task polling |
| `routers/events.py` | 44 | Event bus + RabbitMQ config |
| `routers/console.py` | 21 | VNC/SPICE console |

### CVK Agent (`cvk_agent/`)

| File | Lines | Purpose |
|------|-------|---------|
| `agent.py` | 341 | Main daemon orchestrator |
| `config.py` | 219 | Config from cvk_agent.conf |
| `feign.py` | 370 | HTTP Digest REST client |
| `threadpool.py` | 177 | Thread pool manager |
| `scp.py` | 332 | SCP/SSH file transfer |
| `host.py` | 594 | Hardware discovery + CVM registration |
| `domain.py` | 493 | VM lifecycle via libvirt |
| `storage.py` | 668 | Storage pool/volume management |
| `network.py` | 569 | OVS bridge/VLAN/VXLAN |
| `migration.py` | 414 | Live/cold VM migration |
| `heartbeat.py` | 250 | Periodic health reporting |
| `eventbus.py` | 472 | RabbitMQ/HTTP/Noop event bus |

### Configuration Files (`configs/`)

| File | Purpose |
|------|---------|
| `cvm/db.properties` | PostgreSQL JDBC URLs + encrypted creds |
| `cvm/redis.properties` | Redis connection settings |
| `cvm/kafka.properties` | Kafka producer config |
| `cvm/clickhouse.properties` | ClickHouse JDBC URL |
| `tomcat/server.xml` | HTTP 8080 / HTTPS 8443 / TLS 1.2 |
| `cvk/cvk_agent.conf` | CVK agent Feign/SCP/thread pool config |
| `cvk/system_ports` | All 50+ port assignments |
| `cvk/casmon.conf` | 30+ monitoring alarm definitions |
| `cvk/casaudit.conf` | Package audit config |
| `cvk/rbd_vendor.conf` | RBD storage vendor |
| `cvk/cpu_mem_threshold.conf` | CPU 85% / memory 10% thresholds |
| `postgresql/pg.conf` | PostgreSQL config |
| `postgresql/pg_hba.conf` | PostgreSQL host-based auth |
| `redis/redis.conf` | Redis config (512MB, allkeys-lru) |

---

## Deployment Quick Start

```bash
# Start everything
cd /home/kali/Downloads/h3c/h3c-cas-clone
docker-compose up -d

# Run end-to-end tests
python3 tests/test_e2e.py

# Check status
docker-compose ps

# View logs
docker-compose logs -f cvm-server
```

### Run CVM Server Directly
```bash
cd cvm_server
python -m cvm_server.main --port 8080
```

### Run CVK Agent Directly
```bash
cd cvk_agent
python -m cvk_agent --mock --status
```

> **Source:** `README.md:25-37`, `cvk_agent/README.md:86-100`

---

## Key Architecture Decisions

1. **FastAPI replaces Tomcat 8.5** — same HTTP Digest auth, same XML responses, same Server header
2. **XML everywhere** — all API responses are `application/xml;charset=UTF-8` (no JSON)
3. **Async task model** — all mutations return task IDs, polled via `/message/{taskId}`
4. **HTTP Digest auth** — RFC 2617, realm `CAS`, algorithm `MD5`, qop `auth`
5. **In-memory store for dev** — mirrors PostgreSQL + MySQL schemas with Python dicts
6. **No OpenAPI docs** — matching the original which had no Swagger
7. **Mock mode** — all subsystems support mock backends for testing without hardware
8. **DES-ECB encryption** — original used DES-ECB (key: `hzbdbkz1`) for credential encryption

> **Source:** `ARCHITECTURE.md` section "Key Design Decisions"

---

## Cross-Reference Index

### Find by topic:

| Topic | Docs |
|-------|------|
| Authentication | PROTOCOL.md §2, ARCHITECTURE.md "Auth Flow" |
| VM Lifecycle (start/stop/pause/migrate) | ENDPOINTS.md §5-6, PROTOCOL.md §4 |
| HTTP Digest implementation | PROTOCOL.md §2, `auth.py:1-174`, `feign.py:44-109` |
| XML message formats | PROTOCOL.md §3, `xml_utils.py:1-593` |
| Database tables | DATABASES.md §1-4, `models/vservice.py`, `models/cas_cic.py` |
| RabbitMQ event bus | PROTOCOL.md §5, `eventbus.py:238-384` |
| Host registration | ARCHITECTURE.md "CVK Agent", `host.py:1-594` |
| Storage management | `storage.py:1-668`, DATABASES.md §1.1 |
| Network (OVS/VLAN/VXLAN) | `network.py:1-569`, PORTS.md §5 |
| Migration (live/cold) | `migration.py:1-414`, PROTOCOL.md §6 |
| Monitoring alarms | VERSIONS.md "Monitoring", `casmon.conf:1-504` |
| SSL/TLS config | `config.py:24-33`, PORTS.md §1 |
| Docker deployment | `docker-compose.yml:1-360`, PORTS.md §9 |

### Find by file:

| File | Docs |
|------|------|
| `docker-compose.yml` | ARCHITECTURE.md, PORTS.md, DATABASES.md |
| `cvm_server/main.py` | ARCHITECTURE.md "CVM Server", ENDPOINTS.md (all routers) |
| `cvm_server/auth.py` | PROTOCOL.md §2 |
| `cvm_server/config.py` | VERSIONS.md (all timeout/threshold values) |
| `cvm_server/xml_utils.py` | PROTOCOL.md §3 (all XML formats) |
| `cvm_server/models/` | DATABASES.md §1-2 |
| `cvk_agent/agent.py` | ARCHITECTURE.md "CVK Agent" |
| `cvk_agent/feign.py` | PROTOCOL.md §1-2 |
| `cvk_agent/eventbus.py` | PROTOCOL.md §5 |
| `cvk_agent/heartbeat.py` | PROTOCOL.md §7 |
| `cvk_agent/scp.py` | PROTOCOL.md §6 |

---

## Version History

| Version | Date | Description |
|---------|------|-------------|
| R0785P03 | Original | H3C CAS Enterprise V700R003B06D005 |
| 1.0.0 | Clone | Python clone — CVM server + CVK agent |
| docs-v1 | 2025-07-01 | Master documentation created |
