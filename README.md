# H3C CAS Clone — Deployment & Orchestration Layer

Complete Docker-based deployment of the H3C CAS (Cloud Automation System) virtualization management stack, reverse-engineered from the R0785P03 (V700R003B06D005) Enterprise distribution.

## Architecture

```
                    ┌──────────────────────────────────────────┐
                    │           Docker Compose Stack           │
                    │                                          │
  Port 8080/8443 ──┤  cvm-server       (CAS REST API)         │
  Port 8081      ──┤  novnc            (VNC Console Proxy)    │
  Port 26165     ──┤  cvk-agent        (Hypervisor Host)      │
  Port 20041-46  ──┤  casserver        (Monitoring/HA)        │
                    │                                          │
  Port 1523      ──┤  postgres         (vservice DB)          │
  Port 3306      ──┤  mysql            (cas_cic DB)           │
  Port 6379      ──┤  redis            (Cache/Session)        │
  Port 5672      ──┤  rabbitmq         (Message Broker)       │
  Port 8123      ──┤  clickhouse       (Metrics DB)           │
  Port 9092      ──┤  kafka            (Async Producer)       │
                    └──────────────────────────────────────────┘
```

## Quick Start

```bash
# Start everything and run end-to-end tests
./start-cas.sh

# Or step by step:
./start-cas.sh --up       # Start all services
./start-cas.sh --test     # Run tests against running services
./start-cas.sh --down     # Stop everything
./start-cas.sh --status   # Check service status
./start-cas.sh --logs     # View logs
```

## Services & Credentials

| Service    | Port  | User        | Password     | Database/VHost  |
|------------|-------|-------------|-------------|-----------------|
| PostgreSQL | 1523  | ssadmin     | Pzss@_w0rd  | vservice        |
| MySQL      | 3306  | ssadmin     | Pzss@_w0rd  | cas_cic         |
| Redis      | 6379  | —           | Sy@Redi$79  | —               |
| RabbitMQ   | 5672  | cloud       | Cl@oud13    | cloudMsgHost    |
| ClickHouse | 8123  | default     | Pzss@_w0rd  | metrics         |
| Kafka      | 9092  | —           | —           | —               |
| CVM API    | 8080  | admin       | Cloud@123   | —               |

## Endpoints

| Test | Endpoint | Method | Expect |
|------|----------|--------|--------|
| Health | `/cas/casrs/operator/test` | GET | 204 |
| Host Pools | `/cas/casrs/hostpool/all` | GET | 200 + XML |
| Hosts | `/cas/casrs/hostpool/{id}/allChildNode` | GET | 200 + XML |
| VM List | `/cas/casrs/nova/vmList` | GET | 200 + XML |
| VM Deploy | `/cas/casrs/nova/vm/deploy` | POST | 200 + task |
| VM Start | `/cas/casrs/vm/start/{id}` | POST | 200 + task |
| VM Stop | `/cas/casrs/vm/stop/{id}` | POST | 200 + task |
| VM Snapshot | `/cas/casrs/vm/snapshot` | POST | 200 + task |
| VM Delete | `/cas/casrs/vm/deleteVmForce` | POST | 200 + task |

## Configuration Files

All extracted from R0785P03 and decrypted where needed (DES-ECB key: `hzbdbkz1`).

| File | Location | Purpose |
|------|----------|---------|
| `db.properties` | `/etc/cvk/cvm/` | PostgreSQL JDBC URLs + encrypted creds |
| `redis.properties` | `/etc/cvk/cvm/` | Redis connection settings |
| `kafka.properties` | `/etc/cvk/cvm/` | Kafka producer config |
| `clickhouse.properties` | `/etc/cvk/cvm/` | ClickHouse JDBC URL + encrypted creds |
| `server.xml` | `/etc/tomcat/` | Tomcat (HTTP 8080 / HTTPS 8443 / TLS 1.2) |
| `cvk_agent.conf` | `/etc/cvk/` | CVK agent Feign/SCP/thread pool config |
| `system_ports` | `/etc/cvk/` | All 50+ port assignments |
| `casmon.conf` | `/etc/cvk/` | 30+ monitoring alarm definitions |
| `casaudit.conf` | `/etc/cvk/` | Package audit config |
| `rbd_vendor.conf` | `/etc/cvk/` | RBD storage vendor |
| `cpu_mem_threshold.conf` | `/etc/cvk/` | CPU/memory thresholds |

## Systemd Units

| Service | Purpose |
|---------|---------|
| `cvm-server.service` | Tomcat/CVM REST API server |
| `cvk-agent.service` | CVK hypervisor agent |
| `casnovnc.service` | noVNC WebSocket proxy (TLS 1.2, port 8081) |
| `ksmtuned.service` | KSM tuning daemon |
| `restore-sriov.service` | SR-IOV restoration |
| `restore-pci-driver.service` | PCI driver restoration |
| `isolate-cpuset-mem.service` | CPU/memory cgroup isolation |
| `swap-buffer-off.service` | Swap buffer management |

## Directory Structure

```
h3c-cas-clone/
├── docker-compose.yml          # Full stack orchestration
├── .env                         # Credentials and environment
├── start-cas.sh                 # Launcher + E2E test runner
├── README.md                    # This file
├── configs/
│   ├── cvm/                     # CVM properties (db, redis, kafka, clickhouse)
│   ├── cvk/                     # CVK agent & monitoring configs
│   ├── tomcat/                  # Tomcat server.xml
│   ├── clickhouse/              # ClickHouse config.xml + users.xml
│   ├── kafka/                   # (referenced by docker-compose)
│   ├── redis/                   # redis.conf
│   ├── rabbitmq/                # (referenced by docker-compose)
│   ├── postgresql/              # pg.conf + pg_hba.conf
│   └── mysql/                   # (managed via docker-compose env)
├── systemd/                     # All systemd service files
├── scripts/                     # First-boot and init scripts
├── docker/                      # Dockerfiles for custom services
└── tests/
    └── test_e2e.py              # End-to-end test suite
```

## Dependencies

- Docker Engine 20.10+
- Docker Compose v2 or docker-compose v1
- Python 3.10+ (for E2E tests)
- `h3c-cas-frame` library (included at `../h3c-cas-frame/`)
