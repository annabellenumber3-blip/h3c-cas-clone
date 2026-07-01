# H3C CAS Clone — Versions

> **Source:** Reverse-engineered from H3C CAS R0785P03 (V700R003B06D005) Enterprise distribution
> Every version number found in source files, configs, and documentation.

## H3C CAS Platform

| Version | Identifier | Source |
|---------|-----------|--------|
| CAS Release | **R0785P03** | `cvm_server/main.py:65` — FastAPI version |
| CAS Feature Version | **V700R003B06D005** | `cvk_agent/README.md:16`, `README.md:3` |
| CAS Enterprise | Enterprise distribution | `README.md:3` |

## CVM Server (Clone Implementation)

| Component | Version | Source |
|-----------|---------|--------|
| CVM Server (this clone) | **R0785P03** | `cvm_server/main.py:65` |
| FastAPI | `>=0.100.0` | `cvm_server/requirements.txt:1` |
| Uvicorn | `>=0.23.0` | `cvm_server/requirements.txt:2` |
| Python | `>=3.10` | `README.md:125` |
| SQLAlchemy | `>=2.0.0` | `cvm_server/requirements.txt:5` |
| psycopg2-binary | `>=2.9.0` | `cvm_server/requirements.txt:6` |
| PyMySQL | `>=1.1.0` | `cvm_server/requirements.txt:7` |
| redis-py | `>=5.0.0` | `cvm_server/requirements.txt:8` |
| pika (RabbitMQ) | `>=1.3.0` | `cvm_server/requirements.txt:9` |
| kafka-python | `>=2.0.0` | `cvm_server/requirements.txt:10` |
| clickhouse-connect | `>=0.7.0` | `cvm_server/requirements.txt:11` |
| lxml | `>=4.9.0` | `cvm_server/requirements.txt:12` |
| requests | `>=2.31.0` | `cvm_server/requirements.txt:3` |

## CVK Agent (Clone Implementation)

| Component | Version | Source |
|-----------|---------|--------|
| CVK Agent (this clone) | **1.0.0** | `cvk_agent/agent.py:125`, `agent.py:326` |
| urllib3 | `>=2.0.0` | `cvk_agent/requirements.txt:3` |
| libvirt-python (optional) | `>=9.0.0` | `cvk_agent/requirements.txt:6` |
| paramiko (optional) | `>=3.3.0` | `cvk_agent/requirements.txt:7` |
| pika (optional) | `>=1.3.0` | `cvk_agent/requirements.txt:8` |

## Virtualization Stack (Original R0785P03)

| Component | Version | Source |
|-----------|---------|--------|
| libvirt | **6.3.0** | `cvk_agent/domain.py:162` — `getVersion()` returns `8000000` (= 8.0.0 in libvirt encoding) |
| QEMU/KVM | **5.0** | `configs/cvk/casaudit.conf:22-24` — qemu-kvm package references |
| Open vSwitch (OVS) | **2.16.4** | `configs/cvk/casaudit.conf:8` — openvswitch package |
| Kernel | **5.10.0** | `configs/cvk/casaudit.conf:11-13` — ocfs2 kernel module package |
| CVD (Cloud Virtual Disk) Daemon | from `cvd-ds` package | `cvk_agent/README.md:15`, `cvk_agent/storage.py:23-29` |
| CAS Tools (guest agent) | **3.5.0** | `cvm_server/routers/nova.py:113` — castools version returned |
| CAS Front (Web UI) | `casfront` | `configs/cvk/casaudit.conf:27` |

## Infrastructure Services

| Service | Version | Source |
|---------|---------|--------|
| PostgreSQL | **14-alpine** | `docker-compose.yml:11` |
| MySQL | **8.0** | `docker-compose.yml:53` |
| Redis | **7-alpine** | `docker-compose.yml:86` |
| RabbitMQ | **3.12-management-alpine** | `docker-compose.yml:118` |
| ClickHouse | **23.8-alpine** | `docker-compose.yml:146` |
| Kafka | **3.6** (bitnami) | `docker-compose.yml:180` |
| noVNC | **latest** (theasp/novnc) | `docker-compose.yml:304` |

## Original Java Stack (from R0785P03)

| Component | Version | Source |
|-----------|---------|--------|
| Tomcat | 8.5.x | `README.md:75`, `cvm_server/main.py:13` |
| Java (Spring Boot) | JDK 8/11 | `cvk_agent/README.md:7` — Spring Boot + Feign |
| OkHttp (Feign HTTP client) | 4.x | `cvk_agent/feign.py:4-6` — mirrors OkHttpClient builder |
| Guava Cache | 24h expiry | `cvk_agent/feign.py:134-136` — mirrors FeignClient cache (24h TTL) |
| JDBC Driver (PostgreSQL) | included in `db.properties` | `README.md:71`, `cvm_server/config.py:59-60` |
| JDBC Driver (MySQL) | included in `db.properties` | `README.md:71`, `cvm_server/config.py:68-69` |
| JDBC Driver (ClickHouse) | included in `clickhouse.properties` | `README.md:74` |

## Docker & Deployment

| Component | Version | Source |
|-----------|---------|--------|
| Docker Engine | `>=20.10` | `README.md:123` |
| Docker Compose | v2 / docker-compose v1 | `README.md:124` |
| Docker Compose file format | **3.8** | `docker-compose.yml:4` |

## Encryption & Security

| Component | Version/Type | Source |
|-----------|-------------|--------|
| TLS (HTTPS) | **TLS 1.2** | `README.md:75` — `server.xml:91-95`, `cvm_server/config.py:24-33` |
| HTTP Digest Auth | **RFC 2617**, MD5 | `cvm_server/auth.py:1-5`, `cvm_server/config.py:41-43` |
| DES-ECB (credential encrypt) | Key: `hzbdbkz1` | `README.md:67` |
| PostgreSQL auth | MD5 | `docker-compose.yml:29`, `configs/postgresql/pg.conf:9` |
| SSL Keystore Password | `h3cbj2013` | `cvm_server/config.py:25` |
| SSL Ciphers | `TLS_RSA_WITH_AES_128_CBC_SHA`, `TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA`, `TLS_RSA_WITH_AES_128_CBC_SHA256`, `TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256`, `SSL_RSA_WITH_3DES_EDE_CBC_SHA`, `TLS_ECDHE_RSA_WITH_3DES_EDE_CBC_SHA` | `cvm_server/config.py:26-33` |

## Service Versions (from configs)

| Service | Config File | Source |
|---------|-----------|--------|
| CVM Max Threads | 300 | `cvm_server/config.py:17` |
| CVM Max Connections | 600 | `cvm_server/config.py:18` |
| CVM Accept Count | 600 | `cvm_server/config.py:19` |
| CVM Connection Timeout | 20000ms | `cvm_server/config.py:20` |
| CVM Keepalive Timeout | 15000ms | `cvm_server/config.py:21` |
| DB Max Active Connections | 120 | `cvm_server/config.py:72`, `cvm_server/database.py:3-7` |
| DB Max Idle | 50 | `cvm_server/config.py:73` |
| DB Min Idle | 0 | `cvm_server/config.py:74` |
| DB Max Wait | 30000ms | `cvm_server/config.py:75` |
| DB Min Evictable Idle Time | 300000ms | `cvm_server/config.py:76` |
| PG max_connections | 500 | `docker-compose.yml:28` |
| MySQL max_connections | 500 | `docker-compose.yml:69` |
| Redis maxmemory | 512MB | `docker-compose.yml:93` |
| RabbitMQ queue max length | 256MB | `cvm_server/config.py:100`, `cvk_agent/config.py:44` |
| RabbitMQ queue mode | lazy | `cvm_server/config.py:101`, `cvk_agent/config.py:45` |
| Feign connect timeout | 10s | `cvk_agent/config.py:18`, `cvk_agent/cvk_agent.conf:26` |
| Feign read timeout | 600s (10 min) | `cvk_agent/config.py:19`, `cvk_agent/cvk_agent.conf:27` |
| Feign slow task read timeout | 172800s (48h) | `cvk_agent/config.py:21`, `cvk_agent/cvk_agent.conf:29` |
| Feign OkHttp write timeout | 600s | `cvk_agent/config.py:22`, `cvk_agent/cvk_agent.conf:30` |
| Feign max idle connections | 200 | `cvk_agent/config.py:23`, `cvk_agent/cvk_agent.conf:31` |
| Feign keep-alive duration | 50s | `cvk_agent/config.py:24`, `cvk_agent/cvk_agent.conf:32` |
| Feign client cache max | 1024 entries | `cvk_agent/config.py:25`, `cvk_agent/cvk_agent.conf:33` |
| SCP wait time | 43200s (12h) | `cvk_agent/config.py:27`, `cvk_agent/cvk_agent.conf:36` |
| SCP default cmd wait time | 600s (10 min) | `cvk_agent/config.py:28`, `cvk_agent/cvk_agent.conf:37` |
| SCP connect timeout | 30s | `cvk_agent/config.py:29`, `cvk_agent/cvk_agent.conf:38` |
| SCP server alive | 60s | `cvk_agent/config.py:30`, `cvk_agent/cvk_agent.conf:39` |
| Thread pool core | 8 | `cvk_agent/config.py:32`, `cvk_agent/cvk_agent.conf:42` |
| Thread pool core max | 100 | `cvk_agent/config.py:33`, `cvk_agent/cvk_agent.conf:43` |
| Thread pool max | 200 | `cvk_agent/config.py:34`, `cvk_agent/cvk_agent.conf:44` |
| Thread pool queue max | 500 | `cvk_agent/config.py:35`, `cvk_agent/cvk_agent.conf:45` |
| Heartbeat interval | 30s | `cvk_agent/config.py:104`, `cvk_agent/cvk_agent.conf:57` |
| Heartbeat timeout | 120s | `cvk_agent/config.py:105`, `cvk_agent/cvk_agent.conf:58` |
| Nonce timeout | 300s | `cvm_server/config.py:112` |
| API retry count | 10 | `cvk_agent/config.py:120`, `cvk_agent/cvk_agent.conf:73` |
| CPU use percent threshold | 85% | `configs/cvk/cpu_mem_threshold.conf:5` |
| Mem sys reserved | 10% | `configs/cvk/cpu_mem_threshold.conf:5` |
| Redis maxclients | 10000 | `configs/redis/redis.conf:21` |
| Redis timeout | 300s | `configs/redis/redis.conf:19` |
| Redis slowlog threshold | 10000µs | `configs/redis/redis.conf:28` |
| PG shared_buffers | 128MB | `configs/postgresql/pg.conf:10` |
| PG max_wal_size | 1GB | `configs/postgresql/pg.conf:18` |
| PG min_wal_size | 80MB | `configs/postgresql/pg.conf:19` |
| Monitoring interval | 30s | `configs/cvk/casmon.conf:6` |
| Monitoring alarm thresholds | 70% minor / 80% major | `configs/cvk/casmon.conf:17-19` (CPU/memory/partition) |
| Kafka partitions | 3 | `docker-compose.yml:192` |
| RBD vendor | `opensrc` | `configs/cvk/rbd_vendor.conf:5` |
| NAT keepalive timeout | 5s | `configs/cvk/casmon.conf:14,29,45` (persist_time default) |
