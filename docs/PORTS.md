# H3C CAS Clone — Network Ports

> **Source:** `docker-compose.yml`, `README.md`, `cvm_server/config.py`, `cvk_agent/config.py`, `configs/cvk/cvk_agent.conf`, `configs/redis/redis.conf`, `configs/postgresql/pg.conf`
> Every TCP/UDP port used in the H3C CAS deployment.

---

## Port Map

```
                          ┌─────────────────────────────────────────┐
   Clients ───────────────┤ 8080/HTTP     CVM REST API             │
   OpenStack ─────────────┤ 8443/HTTPS    CVM REST API (TLS 1.2)   │
   Web UI   ──────────────┤ 8081          noVNC Web Console        │
                          │                                        │
   CVK Agent ◄───────────►┤ 26165/TCP     CVK Agent REST API       │
   CVK Agent ◄───────────►┤ 26167/UDP     CVK Agent UDP Port       │
   CVK Agent ◄───────────►┤ 26888         CVK Resource Report      │
                          │                                        │
   Monitoring ◄──────────►┤ 1523          PostgreSQL (vservice)    │
   Monitoring ◄──────────►┤ 3306          MySQL (cas_cic)          │
   Monitoring ◄──────────►┤ 6379          Redis (cache/session)    │
   Monitoring ◄──────────►┤ 5672          RabbitMQ (AMQP)          │
   Monitoring ◄──────────►┤ 15672         RabbitMQ Management UI   │
   Monitoring ◄──────────►┤ 8123          ClickHouse (HTTP)        │
   Monitoring ◄──────────►┤ 9000          ClickHouse (Native)      │
   Monitoring ◄──────────►┤ 9092          Kafka (PLAINTEXT)        │
   Monitoring ◄──────────►┤ 9093          Kafka Controller         │
                          │                                        │
   caSserver ─────────────┤ 20041-20046   Monitoring/HA Ports      │
   caSserver ─────────────┤ 20048/UDP     caSserver UDP Port       │
   caSserver ─────────────┤ 20049         SNMP Server              │
   caSserver ─────────────┤ 20100         Monitor FDT Server       │
                          │                                        │
   CVK Host  ─────────────┤ 20050/TCP     CVK TCP Monitor          │
   CVK Host  ─────────────┤ 20101/UDP     CVK UDP Monitor          │
   CVK Host  ─────────────┤ 9023/UDP      SNMP Trap/CaSServer Notify│
   CVK Host  ─────────────┤ 162/UDP       SNMP                     │
   CVK Host  ─────────────┤ 5900-5910     VNC Console Range        │
   CVK Host  ─────────────┤ 5900+         SPICE Console            │
                          │                                        │
   Internal ──────────────┤ 8005          Tomcat Shutdown (legacy)  │
   Internal ──────────────┤ 8192          CVD Daemon (storage)     │
   Internal ──────────────┤ 9099          OCFS2 Agent              │
   Internal ──────────────┤ 10060         USB Daemon               │
   Internal ──────────────┤ 4789          VXLAN Tunnel             │
                          └─────────────────────────────────────────┘
```

---

## 1. Core CAS Services

| Port | Proto | Service | Container | Purpose | Source |
|------|-------|---------|-----------|---------|--------|
| **8080** | TCP | CVM REST API | `cas-cvm-server` | HTTP CAS REST API (Tomcat/FastAPI) | `docker-compose.yml:219`, `cvm_server/config.py:15` |
| **8443** | TCP | CVM REST API (TLS) | `cas-cvm-server` | HTTPS CAS REST API (TLS 1.2) | `docker-compose.yml:220`, `cvm_server/config.py:16` |
| **8081** | TCP | noVNC Proxy | `cas-novnc` | Web-based VNC console (TLS 1.2) | `docker-compose.yml:308`, `README.md:13` |

---

## 2. CVK Agent Ports

| Port | Proto | Service | Container | Purpose | Source |
|------|-------|---------|-----------|---------|--------|
| **26165** | TCP | CVK Agent | `cas-cvk-agent` | CVK agent REST API (CVM↔CVK) | `docker-compose.yml:270`, `configs/cvk/cvk_agent.conf:30` |
| **26167** | UDP | CVK Agent UDP | `cas-cvk-agent` | CVK agent UDP discovery | `docker-compose.yml:271` |
| **26888** | TCP | CVK Resource Report | `cas-cvk-agent` | CVK resource reporting port | `docker-compose.yml:272` |
| **20050** | TCP | CVK TCP Monitor | `cas-cvk-agent` | TCP monitoring (on CVK host) | `docker-compose.yml:274` |
| **20101** | UDP | CVK UDP Monitor | `cas-cvk-agent` | UDP monitoring (on CVK host) | `docker-compose.yml:275` |
| **5900-5910** | TCP | VNC Console | `cas-cvk-agent` | VNC console port range | `docker-compose.yml:273`, `configs/cvk/cvk_agent.conf:45` |
| **5900+** | TCP | SPICE Console | `cas-cvk-agent` | SPICE console (same range) | `cvk_agent/domain.py:490` |
| **162** | UDP | SNMP | `cas-cvk-agent` | SNMP trap receiver | `docker-compose.yml:277` |
| **9023** | UDP | SNMP Trap Notify | `cas-cvk-agent` | CaSServer notify / SNMP trap | `docker-compose.yml:276` |

> **Source:** `docker-compose.yml:263-298`

---

## 3. caSserver Monitoring/HA Ports

| Port | Proto | Service | Purpose | Source |
|------|-------|---------|---------|--------|
| **20041** | TCP | mon_frontend_server | Monitoring frontend server | `docker-compose.yml:331` |
| **20042** | TCP | ha_backend_server | HA backend server | `docker-compose.yml:332` |
| **20043** | TCP | ha_frontend_server | HA frontend server | `docker-compose.yml:333` |
| **20044** | TCP | mon_backend_server | Monitoring backend server | `docker-compose.yml:334` |
| **20045** | TCP | ha_cvm_server | HA CVM server port | `docker-compose.yml:335` |
| **20046** | TCP | ha_cvk_server | HA CVK server port | `docker-compose.yml:336` |
| **20048** | UDP | casserver_udp_port | CaSServer UDP monitoring | `docker-compose.yml:337` |
| **20049** | TCP | SNMP server | SNMPv2c monitoring agent (`private` community) | `configs/cvk/casmon.conf:7` |
| **20100** | TCP | mon_fdt_server | Monitor FDT (File Descriptor Transfer) server | `docker-compose.yml:338` |
| **9023** | UDP | casserver_notify_port | CaSServer notification / SNMP trap | `docker-compose.yml:339` |

> **Source:** `docker-compose.yml:320-348`

---

## 4. Infrastructure Services

| Port | Proto | Service | Container | Default User | Password | Source |
|------|-------|---------|-----------|-------------|----------|--------|
| **1523** | TCP | PostgreSQL | `cas-postgres` | `ssadmin` | `Pzss@_w0rd` | `docker-compose.yml:18`, `config.py:56` |
| **3306** | TCP | MySQL | `cas-mysql` | `ssadmin` | `Pzss@_w0rd` | `docker-compose.yml:62`, `config.py:65` |
| **6379** | TCP | Redis | `cas-redis` | — | `Sy@Redi$79` | `docker-compose.yml:99`, `configs/redis/redis.conf:6-7` |
| **5672** | TCP | RabbitMQ (AMQP) | `cas-rabbitmq` | `cloud` | `Cl@oud13` | `docker-compose.yml:126`, `cvk_agent/config.py:41` |
| **15672** | TCP | RabbitMQ (Mgmt UI) | `cas-rabbitmq` | `cloud` | `Cl@oud13` | `docker-compose.yml:127` |
| **8123** | TCP | ClickHouse (HTTP) | `cas-clickhouse` | `default` | `Pzss@_w0rd` | `docker-compose.yml:154` |
| **9000** | TCP | ClickHouse (Native) | `cas-clickhouse` | `default` | `Pzss@_w0rd` | `docker-compose.yml:155` |
| **9092** | TCP | Kafka (PLAINTEXT) | `cas-kafka` | — | — | `docker-compose.yml:194` |
| **9093** | TCP | Kafka (Controller) | `cas-kafka` | — | — | `docker-compose.yml:188` |

> **Source:** `docker-compose.yml:1-360`, `README.md:41-49`

---

## 5. Internal / System Ports

| Port | Proto | Service | Purpose | Source |
|------|-------|---------|---------|--------|
| **8005** | TCP | Tomcat Shutdown | Tomcat shutdown port (legacy, not used in Python clone) | `cvm_server/config.py:36` |
| **8192** | TCP | CVD Daemon | Cloud Virtual Disk daemon (cvd-ds) for storage management | `configs/cvk/cvk_agent.conf:42` |
| **9099** | TCP | OCFS2 Agent | OCFS2 cluster filesystem agent | `configs/cvk/cvk_agent.conf:48` |
| **10060** | TCP | USB Daemon | USB daemon (usbdemd) for USB passthrough | `configs/cvk/cvk_agent.conf:51` |
| **4789** | UDP | VXLAN | VXLAN tunnel endpoint (encapsulation port) | `cvk_agent/config.py:117` |

---

## 6. Port Summary by Function

### Client-Facing (External)
| Port | Proto | Purpose |
|------|-------|---------|
| 8080 | TCP | CAS REST API (HTTP) |
| 8443 | TCP | CAS REST API (HTTPS/TLS 1.2) |
| 8081 | TCP | noVNC Web Console Proxy |

### CVM ↔ CVK Communication
| Port | Proto | Purpose |
|------|-------|---------|
| 26165 | TCP | CVK Agent REST API |
| 26167 | UDP | CVK Agent UDP |
| 26888 | TCP | CVK Resource Report |

### Databases
| Port | Proto | Purpose |
|------|-------|---------|
| 1523 | TCP | PostgreSQL vservice |
| 3306 | TCP | MySQL cas_cic |
| 6379 | TCP | Redis cache/session |
| 8123 | TCP | ClickHouse HTTP |
| 9000 | TCP | ClickHouse Native |

### Messaging
| Port | Proto | Purpose |
|------|-------|---------|
| 5672 | TCP | RabbitMQ AMQP |
| 15672 | TCP | RabbitMQ Management UI |
| 9092 | TCP | Kafka Producer |
| 9093 | TCP | Kafka Controller |

### Monitoring & HA
| Port | Proto | Purpose |
|------|-------|---------|
| 20041 | TCP | Mon Frontend Server |
| 20042 | TCP | HA Backend Server |
| 20043 | TCP | HA Frontend Server |
| 20044 | TCP | Mon Backend Server |
| 20045 | TCP | HA CVM Server |
| 20046 | TCP | HA CVK Server |
| 20048 | UDP | caSserver UDP |
| 20049 | TCP | SNMP Agent |
| 20050 | TCP | CVK TCP Monitor |
| 20100 | TCP | Monitor FDT Server |
| 20101 | UDP | CVK UDP Monitor |

### Console & SNMP
| Port | Proto | Purpose |
|------|-------|---------|
| 162 | UDP | SNMP |
| 9023 | UDP | SNMP Trap / CaSServer Notify |
| 5900-5910 | TCP | VNC Console Range |
| 5900+ | TCP | SPICE Console |

### Internal/Daemon
| Port | Proto | Purpose |
|------|-------|---------|
| 8005 | TCP | Tomcat Shutdown (legacy) |
| 8192 | TCP | CVD Daemon (storage) |
| 9099 | TCP | OCFS2 Agent |
| 10060 | TCP | USB Daemon |
| 4789 | UDP | VXLAN Tunnel |

---

## 7. Port Configuration Files

| Config File | Path | Ports Defined |
|-------------|------|---------------|
| `server.xml` | `/etc/tomcat/server.xml` | 8080 (HTTP), 8443 (HTTPS), 8005 (shutdown) |
| `cvk_agent.conf` | `/etc/cvk/cvk_agent.conf` | 26165 (agent), 20041-20100 (mon/HA), 8192 (CVD), 9099 (OCFS2), 10060 (USB) |
| `pg.conf` | `/etc/database/pg.conf` | 5432 → mapped to 1523 |
| `redis.conf` | `/etc/redis/redis.conf` | 6379 |
| `casmon.conf` | `/etc/cvk/casmon.conf` | 20049 (SNMP server) |
| `docker-compose.yml` | `h3c-cas-clone/` | All service ports |

> **Source:** `README.md:69-80`, `configs/cvk/cvk_agent.conf:1-51`

---

## 8. Port Range Summary

| Range | Count | Description |
|-------|-------|-------------|
| 80xx | 3 | CVM API + noVNC |
| 1523-6379 | 5 | Database services |
| 8081-9000 | 3 | ClickHouse + noVNC |
| 9092-9093 | 2 | Kafka |
| 15672 | 1 | RabbitMQ UI |
| 20041-20101 | 11 | Monitoring/HA |
| 26165-26888 | 3 | CVK Agent |
| 5900-5910 | 11 | VNC Console |
| 8192-10060 | 3 | Internal daemons |
| **Total** | **~42** | Unique ports |

---

## 9. Docker Network

All services run on a single Docker bridge network:

```yaml
networks:
  cas-net:
    driver: bridge
    name: cas-net
```

All containers use `localhost` as a network alias, so internal communication can use `localhost:port` regardless of container hostnames.

> **Source:** `docker-compose.yml:349-352`
