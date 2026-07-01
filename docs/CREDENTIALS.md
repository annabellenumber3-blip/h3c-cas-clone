# H3C CAS + iNode — Complete Credentials & Secrets

> **Exhaustive audit of all passwords, keys, tokens, and secrets across the entire H3C tree.**
> Generated: 2026-07-01 | Files scanned: ~10,600 | Source tree: `/home/kali/Downloads/h3c`

---

## 1. Master Encryption / Decryption Keys

| # | Key Name | Value | Algorithm | Used For | Source File (Line) |
|---|----------|-------|-----------|----------|---------------------|
| 1 | CAS DB credential key | `hzbdbkz1` | DES-ECB | Encrypt/decrypt all CAS database credentials in `.properties` files | `scripts/db-auth.sh:116` (CRYPT_KEY), `configs/cvm/db.properties:4` |
| 2 | iNode AES key | `EC D4 4F 7B C6 DD 7D DE 2B 7B 51 AB 4A 6F 5A 22` | AES-128-CBC | iNode local config/credential file encryption | `re/findings/crypto.md:129-131` (rkey1 @0x3b9138 + rkey2 @0x3b9088 in libInodeUtility.so) |
| 3 | iNode AES IV | `a@4de%#1asdfsd24` | AES-128-CBC | iNode local config/credential file encryption (same as key #2) | `re/findings/crypto.md:135` (iv1 @0x3b9140 + iv2 @0x3b9080) |

---

## 2. CAS CVM REST API Users

**Auth method:** HTTP Digest (realm="CAS"), backend Tomcat UserDatabaseRealm.

| # | Username | Password | Role | Encryption Status | Source File (Line) |
|---|----------|----------|------|-------------------|---------------------|
| 4 | `admin` | `Cloud@123` | CVM administrator | **PLAINTEXT** | `.env:35-36`, `README.md:49` |
| 5 | `root` | `h3cadmin` | CVM root user | **PLAINTEXT** (Digest default in tomcat-users.xml) | `README.md:49` (referenced), `configs/tomcat/server.xml:16` (UserDatabase) |

---

## 3. CAS Database Credentials

### 3.1 PostgreSQL (port 1523/5432)

| # | Database | User | Encrypted Value | Decrypted Value | Encryption | Source File (Line) |
|---|----------|------|----------------|-----------------|------------|---------------------|
| 6 | vservice | `ssadmin` | `PdfEjjxsBAo=` (username) | `ssadmin` | DES-ECB (key: hzbdbkz1) | Original `extras/front.package/database/db.properties:7` |
| 7 | vservice | `ssadmin` | `egJU1XOSiZHypdQZAaae9g==` (password) | `Pzss@_w0rd` | DES-ECB | Original `extras/front.package/database/db.properties:8`; clone `configs/cvm/db.properties:15` |
| 8 | vmware | `ssadmin` | (same as vservice) | `Pzss@_w0rd` | DES-ECB | `configs/cvm/db.properties:9` |
| 9 | baremetal | `ssadmin` | (same as vservice) | `Pzss@_w0rd` | DES-ECB | `configs/cvm/db.properties:10` |
| 10 | vservice (slave/read-only) | `ssadmin_ro` | `v5mylqlw4AEaHI2MAJVbhA==` (username) | `ssadmin_ro` | DES-ECB | Original `extras/front.package/database/db.properties:20` |
| 11 | vservice (slave) | `ssadmin_ro` | `egJU1XOSiZHypdQZAaae9g==` (password) | `Pzss@_w0rd` | DES-ECB | Original `extras/front.package/database/db.properties:21`; clone `configs/cvm/db.properties:31` |
| 12 | Seasql (init) | `ssadmin` | — | `Pzss@_w0rd` | **PLAINTEXT** (passed to initdb) | `scripts/front-install.sh:106` |
| 13 | PostgreSQL (env) | `ssadmin` | — | `Pzss@_w0rd` | **PLAINTEXT** | `.env:6` |

### 3.2 MySQL (port 3306)

| # | Database | User | Password | Encryption Status | Source File (Line) |
|---|----------|------|----------|-------------------|---------------------|
| 14 | cas_cic | `ssadmin` | `Pzss@_w0rd` | **PLAINTEXT** | `.env:14`, `docker-compose.yml`, `scripts/init-databases.sh:22-25`, `scripts/init-mysql.sh:18-19` |
| 15 | cas_cic (read-only) | `ssadmin_ro` | `Pzss@_w0rd` | **PLAINTEXT** | `scripts/init-mysql.sh:22-23` |
| 16 | cas_cic (root) | `root` | `Pzss@_w0rd` | **PLAINTEXT** | `.env:12` (`MYSQL_ROOT_PASSWORD`), `scripts/init-databases.sh:22` |
| 17 | vms (jdbc/vmaDB) | `vservice` | `1q2w3e` | **PLAINTEXT** | Original `extras/front.package/tomcat/context.xml:32` |

---

## 4. CAS Middleware Credentials

| # | Service | Host:Port | User | Encrypted Value | Decrypted Value | Encryption Status | Source File (Line) |
|---|---------|-----------|------|----------------|-----------------|-------------------|---------------------|
| 18 | Redis | cas-redis:6379 | — | `COT723vi0xiIHjhUYAEddg==` | `Sy@Redi$79` | DES-ECB → **PLAINTEXT** in clone | Original `redis.properties:15`; clone `configs/cvm/redis.properties:15`, `configs/redis/redis.conf:7` |
| 19 | RabbitMQ | cas-rabbitmq:5672 | `cloud` | — | `Cl@oud13` | **PLAINTEXT** | `scripts/init-rabbitmq.sh:4,24`, `.env:19-20`, original `rabbitmq-init.sh:3-4` |
| 20 | RabbitMQ | cas-rabbitmq:5672 | `guest` | — | `Cl@oud13` (changed from `guest`) | **PLAINTEXT** | Original `rabbitmq-init.sh:19` |
| 21 | RabbitMQ vhost | — | — | — | `cloudMsgHost` | **PLAINTEXT** | `scripts/init-rabbitmq.sh:18`, `.env:21` |
| 22 | ClickHouse | cas-clickhouse:8123 | `default` | `xYFZQgBNw0E=` (username) | `default` | DES-ECB → **PLAINTEXT** in clone | `configs/cvm/clickhouse.properties:9` |
| 23 | ClickHouse | cas-clickhouse:8123 | `default` | `egJU1XOSiZHypdQZAaae9g==` (password) | `Pzss@_w0rd` | DES-ECB → **PLAINTEXT** in clone | `configs/cvm/clickhouse.properties:11` |
| 24 | ClickHouse | cas-clickhouse:8123 | `default` | SHA256: `3773a163835dcfc98f7f5e83af94eb9f674c0ca4a24761fb000c24a88ae18983` | `Pzss@_w0rd` (verify) | SHA-256 hash | `configs/clickhouse/users.xml:5` |
| 25 | Kafka | cas-kafka:9092 | — | — | (none) | No auth | `configs/cvm/kafka.properties:5` |

---

## 5. CAS Security / Certificate Passwords

| # | Component | Password/Key | Encryption Status | Source File (Line) |
|---|-----------|-------------|-------------------|---------------------|
| 26 | Tomcat HTTPS keystore (JKS) | `h3cbj2013` | **PLAINTEXT** | `configs/tomcat/server.xml:37` (`keystorePass="h3cbj2013"`) |
| 27 | Tomcat shutdown | `SHUTDOWN` (port 8005) | **PLAINTEXT** | `configs/tomcat/server.xml:5` |
| 28 | NAS share key (all shares) | `huawei` | **PLAINTEXT** | Original `extras/front.package/cvm/var/lib/casserver/conf/nas-sharekey.conf:1` |
| 29 | Kickstart root password | `$6$PH3AYN1qD1x8s8su$swj64PZ614ISXeqXrCwXYOzsVNFyOPwHaFyLKUOGVKc2JIw3ZKZRUQXJpDfyL4yrcY64EBahzNC4nXx1d8kKh.` | SHA-512 crypt (not cracked) | `H3C_CAS-R0785P03-h3linux-x86_64/ks/ks-auto.cfg:24` |
| 30 | RabbitMQ TLS CA cert | `cacert.pem` | PEM file | `extras/front.package/rabbitmq/ca/cacert.pem` |
| 31 | RabbitMQ server cert | `cert.pem` + `key.pem` | PEM files | `extras/front.package/rabbitmq/server/cert.pem`, `server/key.pem` |
| 32 | RabbitMQ client cert | `cert.pem` + `key.pem` + `keycert.p12` (PKCS#12) | PEM/PKCS#12 files | `extras/front.package/rabbitmq/client/` |
| 33 | RabbitMQ trust store | `trustStore` (JKS) | JKS file | `extras/front.package/rabbitmq/trustStore` |
| 34 | Nginx HTTPS cert | `nginx.crt` + `nginx.key` | PEM files | `extras/front.package/nginx/nginx.crt`, `nginx.key` |
| 35 | noVNC cert | `casnovnc_centos.pem` | PEM file | `extras/vncreflector.package/casnovnc_centos.pem` |
| 36 | libvirt TLS CA | `ca-cert.pem` | PEM file | `extras/libvirt.package/ca-cert.pem` |
| 37 | libvirt server cert | `server-cert.pem` + `server-key.pem` | PEM files | `extras/libvirt.package/server-cert.pem`, `server-key.pem` |
| 38 | OpenStack Nova certs | `cert.pem` + `key.pem` + `cacert.pem` | PEM files | `openstack_plugins/pike/nova/pike_cas_nova/` |
| 39 | OpenStack Neutron certs | `cert.pem` + `key.pem` + `cacert.pem` | PEM files | `openstack_plugins/pike/neutron/pike_cas_neutron/` |
| 40 | iNode EIA CA cert | `h3c_eia_cert_ca.cer` | DER cert | `re/linux/client_tgz/iNodeClient/h3c_eia_cert_ca.cer` |
| 41 | Predict/provisioning cert | `kjh.pem` | PEM file | `extras/system.package/predict/kjh.pem` |

---

## 6. SNMP Configuration

| # | Component | Value | Source File (Line) |
|---|-----------|-------|---------------------|
| 42 | SNMP community string | `private` (SNMPv2c) | `configs/cvk/casmon.conf:7` (`server_ips = "127.0.0.1,20049,SNMPv2c,private"`) |
| 43 | SNMP agent port | 162/UDP | `configs/cvk/system_ports:9` |
| 44 | SNMP notify port | 9023/UDP | `docker-compose.yml:276` |

---

## 7. iNode SSL VPN Secrets

| # | Component | Secret/Source | Encryption Status | Source File (Line) |
|---|-----------|--------------|-------------------|---------------------|
| 45 | SSL VPN login password (wire) | Raw password in `<password>` XML element, inside TLS | **Cleartext** (TLS-only) | `re/findings/crypto.md:65` (SslVpnXmlParser.cpp:39) |
| 46 | 2FA/SMS challenge code (wire) | Raw code in `<code>` XML element, inside TLS | **Cleartext** (TLS-only) | `re/findings/crypto.md:99` (SslVpnXmlParser.cpp:229) |
| 47 | iNode local credential storage | AES-128-CBC with hardcoded key/IV (see §1, #2-3) | Encrypted (key known) | `re/findings/crypto.md:127-135` (libInodeUtility.so) |
| 48 | SPA/zeroTrust knock packet | AES-256-CBC with provisioned key (`SpaRegisterParams+0x230`) | Encrypted (per-client key) | `re/findings/crypto.md:147-160` |
| 49 | iNode uninstall password | `c+PckpVimj0=` (encrypted base64) | Encrypted (AES-128-CBC) | `re/linux/client_tgz/iNodeClient/custom/iNodeCustom.xml:23` |
| 50 | iNode GUI close password | `VtBIOsdIKSZ2aMJQ7nUk8dDck7MeBX5eF5nT4IyQX5tW0Eg6x0gpJjMI1dYVCu8+/p63wOQLwuEFRkFf5NeaT+sQQipvT4FxMwjV1hUK7z7+nrfA5AvC4e4bBJTjwS9KO1w4A2SXZoh2aMJQ7nUk8em249Y5uo98Ym1Evqu/qslz49ySlWKaPQ==` | Encrypted (AES-128-CBC) | `re/linux/client_tgz/iNodeClient/custom/iNodeCustom.xml:84` |
| 51 | L2TP/IPsec preshared key | `QNtyWPceSGZmMXgYKNdVlU7UlgkZzJE975Z9vkGkOiFW0Eg6x0gpJnZowlDudSTxR/bZjZ3Ce4KmwInOV13xaoCecGiYFaHPMwjV1hUK7z7+nrfA5AvC4ScNQdQALKq0VtBIOsdIKSZ2aMJQ7nUk8UGzRxef8zsApsCJzldd8Wpz49ySlWKaPQ==` | Encrypted (AES-128-CBC) | `re/linux/client_tgz/iNodeClient/custom/iNodeCustom.xml:117` |
| 52 | L2TP tunnel password | `VtBIOsdIKSYzCNXWFQrvPv6et8DkC8LhkbSccfFdcD9W0Eg6x0gpJnZowlDudSTxcK3CevH9A42rzQm7qNb9bHPj3JKVYpo9` | Encrypted (AES-128-CBC) | `re/linux/client_tgz/iNodeClient/custom/iNodeCustom.xml:127` |
| 53 | iNode .icnf preshared key | `c+PckpVimj0=` | Encrypted (base64) | `re/linux/client_tgz/iNodeClient/custom/clientfiles/2401/2402.icnf:7` |
| 54 | iNode .icnf tunnel password | `c+PckpVimj0=` | Encrypted (base64) | `re/linux/client_tgz/iNodeClient/custom/clientfiles/2401/2402.icnf:19` |
| 55 | TLS client cert password | `CLIENTCERTPWD` field (empty in template) | Template (empty) | `re/linux/client_tgz/iNodeClient/custom/clientfiles/7000/7001.icnf:18` |
| 56 | iNode local key obfuscation | TEA/XTEA with per-caller 128-bit key | Encrypted (key per caller) | `re/findings/crypto.md:181-183` |

---

## 8. Default Network Configuration

| # | Component | Value | Source File (Line) |
|---|-----------|-------|---------------------|
| 57 | Bare metal DHCP subnet | `192.168.0.0/24` | Original `extras/front.package/other/cas-bare-metal.front/conf/dhcpd.conf:15` |
| 58 | Bare metal DHCP range | `192.168.0.200` – `192.168.0.254` | `dhcpd.conf:16` |
| 59 | Bare metal next-server (PXE) | `192.168.0.161` | `dhcpd.conf:22` |
| 60 | Bare metal default gateway | `192.168.0.1` | `dhcpd.conf:23` |
| 61 | TRM proxy IP | `10.10.10.10:9039` | TRMClient config |
| 62 | Acesure/MoveSure API | `http://127.0.0.1:9981/cdap/v2.0/` | Original `movesure/first_boot.sh` |
| 63 | Redis sentinel | `mymaster 127.0.0.1 6379 2` | sentinel.conf |

---

## 9. Service Ports (Complete)

| Port | Protocol | Service | Source |
|------|----------|---------|--------|
| 22 | TCP | SSH | `configs/cvk/system_ports:6` |
| 80 | TCP | HTTP | `configs/cvk/system_ports:7` |
| 111 | TCP/UDP | rpcbind | `configs/cvk/system_ports:8` |
| 162 | UDP | SNMP agent listen | `configs/cvk/system_ports:9` |
| 323 | UDP | chronyd | `configs/cvk/system_ports:10` |
| 443 | TCP/TLS | HTTPS / SSL VPN gateway (iNode), SPA auth | `configs/cvk/system_ports:11` |
| 1523 | TCP | PostgreSQL (vservice) | `configs/cvm/db.properties:8` |
| 3306 | TCP | MySQL (cas_cic, vms) | `configs/cvm/db.properties:11` |
| 4369 | TCP | EPMD (Erlang) | `configs/cvk/system_ports:15` |
| 5672 | TCP | RabbitMQ AMQP | `configs/cvk/system_ports:16` |
| 5900+ | TCP | VNC console (per-VM) | `configs/cvk/system_ports:41` |
| 6061 | TCP | VMware API | `configs/cvk/system_ports:19` |
| 6062 | TCP | VMware Agent | `configs/cvk/system_ports:20` |
| 6379 | TCP | Redis | `configs/cvm/redis.properties:13` |
| 8005 | TCP | Tomcat shutdown | `configs/tomcat/server.xml:5` |
| 8080 | HTTP | CVM REST API (Tomcat) | `configs/tomcat/server.xml:22` |
| 8081 | TCP | noVNC WebSocket proxy | `configs/cvk/system_ports:43` |
| 8123 | HTTP | ClickHouse HTTP | `configs/cvm/clickhouse.properties:7` |
| 8192 | TCP | CVD storage daemon | `configs/cvk/system_ports:44` |
| 8443 | HTTPS | CVM REST API (TLS 1.2, JKS keystore) | `configs/tomcat/server.xml:33` |
| 9000 | TCP | ClickHouse Native | docker-compose.yml |
| 9023 | UDP | casserver notify (SNMP trap) | `configs/cvk/system_ports:29` |
| 9092 | TCP | Kafka | `configs/cvm/kafka.properties:5` |
| 9099 | TCP | OCFS2 agent | `configs/cvk/system_ports:45` |
| 9981 | HTTP | Acesure/MoveSure CDAP API | `movesure/first_boot.sh` |
| 10060 | TCP | USB daemon | `configs/cvk/system_ports:46` |
| 15672 | TCP | RabbitMQ Management UI | docker-compose.yml |
| 20041 | TCP | Monitoring frontend server | `configs/cvk/cvk_agent.conf:35` |
| 20042 | TCP | HA backend server | `configs/cvk/system_ports:50` |
| 20043 | TCP | HA frontend server | `configs/cvk/system_ports:51` |
| 20044 | TCP | Monitoring backend server | `configs/cvk/cvk_agent.conf:36` |
| 20045 | TCP | HA CVM server | `configs/cvk/system_ports:53` |
| 20046 | TCP | HA CVK server | `configs/cvk/system_ports:54` |
| 20048 | UDP | casserver UDP | `configs/cvk/system_ports:29` |
| 20100 | TCP | Monitoring FDT server | `configs/cvk/cvk_agent.conf:39` |
| 25555 | TCP | License server | `configs/cvk/system_ports:63` |
| 26160 | UDP | CVM UDP | `configs/cvk/system_ports:33` |
| 26165 | TCP | CVK Agent | `configs/cvk/cvk_agent.conf:30` |
| 26167 | UDP | CVK Agent UDP | `configs/cvk/system_ports:37` |
| 26888 | TCP | CVK resource report | `configs/cvk/system_ports:38` |
| 27001 | UDP | CHA monitoring syslog | `configs/cvk/system_ports:56` |

---

## 10. CVK Agent Configuration (Identity & Ports)

| # | Setting | Value | Source File (Line) |
|---|---------|-------|---------------------|
| 64 | CVM host | `${CVM_HOST:-localhost}` | `configs/cvk/cvk_agent.conf:25` |
| 65 | CVM port | `${CVM_PORT:-8080}` | `configs/cvk/cvk_agent.conf:26` |
| 66 | CVK agent port | `${CVK_AGENT_PORT:-26165}` | `configs/cvk/cvk_agent.conf:30` |
| 67 | CVK host ID | `${CVK_HOST_ID:-host-001}` | `configs/cvk/cvk_agent.conf:31` |
| 68 | CVK host name | `${CVK_HOST_NAME:-cvk-node-1}` | `configs/cvk/cvk_agent.conf:32` |

---

## 11. RabbitMQ Queues & Exchanges

| # | Item | Name / Value | Source File (Line) |
|---|------|-------------|---------------------|
| 69 | VHost | `cloudMsgHost` | `scripts/init-rabbitmq.sh:18` |
| 70 | Exchange | `cloud_vm_exchange_direct` (direct, durable) | `scripts/init-rabbitmq.sh:24` |
| 71 | Queue | `cas_vm_event_nova_compute` (256MB max, lazy mode) | `scripts/init-rabbitmq.sh:27-29` |
| 72 | Routing key | `cas_vm_event` | `scripts/init-rabbitmq.sh:33` |

---

## 12. Encryption Status Summary

| Status | Count | Examples |
|--------|-------|---------|
| **PLAINTEXT** (immediate risk in source) | 18 | CVM `Cloud@123`/`h3cadmin`, PostgreSQL `Pzss@_w0rd`, MySQL `Pzss@_w0rd`/`1q2w3e`, Redis `Sy@Redi$79`, RabbitMQ `Cl@oud13`, ClickHouse `Pzss@_w0rd`, Tomcat `h3cbj2013`, NAS `huawei`, SNMP `private` |
| **DES-ECB encrypted** (key known: `hzbdbkz1`) | 8 | PostgreSQL credentials in original `db.properties`, Redis password, ClickHouse credentials |
| **SHA-512 crypt** (not cracked) | 1 | Kickstart root password hash |
| **SHA-256 hex** (ClickHouse) | 1 | ClickHouse `users.xml` password hash |
| **AES-128-CBC** (key known) | 6 | iNode local config file encryption, uninstall password, GUI close password, L2TP preshared key, L2TP tunnel password |
| **AES-256-CBC** (per-client key) | 1 | SPA/zeroTrust knock packet |
| **TEA/XTEA** (per-caller key) | 1 | iNode local key obfuscation |
| **TLS-only** (cleartext inside tunnel) | 2 | iNode SSL VPN password, 2FA challenge code |
| **PEM/DER certificate files** | 13 | RabbitMQ, NGINX, noVNC, libvirt, Nova, Neutron, iNode EIA, predict provisioning certs |
| **No auth** | 1 | Kafka (no authentication configured) |

---

## 13. Files Referenced

| File | Type | Credentials Found |
|------|------|-------------------|
| `h3c-cas-clone/.env` | Environment | All service passwords (PostgreSQL, MySQL, Redis, RabbitMQ, ClickHouse, CVM) |
| `h3c-cas-clone/docker-compose.yml` | Docker Compose | All service passwords inline |
| `h3c-cas-clone/configs/cvm/db.properties` | JDBC properties | PostgreSQL encrypted→decrypted credentials, ssadmin/Pzss@_w0rd, ssadmin_ro/Pzss@_w0rd |
| `h3c-cas-clone/configs/cvm/redis.properties` | Properties | Redis password Sy@Redi$79 |
| `h3c-cas-clone/configs/cvm/clickhouse.properties` | Properties | ClickHouse default/Pzss@_w0rd |
| `h3c-cas-clone/configs/cvm/kafka.properties` | Properties | Kafka connection (no auth) |
| `h3c-cas-clone/configs/redis/redis.conf` | Redis conf | requirepass Sy@Redi$79 |
| `h3c-cas-clone/configs/tomcat/server.xml` | Tomcat config | keystorePass=h3cbj2013, shutdown=SHUTDOWN |
| `h3c-cas-clone/configs/clickhouse/users.xml` | ClickHouse config | password_sha256_hex |
| `h3c-cas-clone/configs/cvk/casmon.conf` | Monitoring | SNMP community: private |
| `h3c-cas-clone/configs/cvk/cvk_agent.conf` | Agent config | CVK identity and port config |
| `h3c-cas-clone/configs/cvk/system_ports` | Port config | All 50+ service ports |
| `h3c-cas-clone/scripts/init-databases.sh` | Shell script | Pzss@_w0rd for PostgreSQL, MySQL, ClickHouse |
| `h3c-cas-clone/scripts/init-postgres.sh` | Shell script | ssadmin_ro/Pzss@_w0rd |
| `h3c-cas-clone/scripts/init-mysql.sh` | Shell script | ssadmin_ro/Pzss@_w0rd |
| `h3c-cas-clone/scripts/init-rabbitmq.sh` | Shell script | cloud/Cl@oud13 |
| `h3c-cas-clone/scripts/init-clickhouse.sh` | Shell script | default/Pzss@_w0rd |
| `h3c-cas-clone/scripts/db-auth.sh` | Shell script | DES-ECB key hzbdbkz1 |
| `h3c-cas-clone/scripts/db-create-user.sh` | Shell script | hzbdbkz1 key usage, ssadmin_ro creation |
| `h3c-cas-clone/scripts/front-install.sh` | Shell script | Pzss@_w0rd (line 106), RabbitMQ cert paths |
| `h3c-cas-clone/README.md` | Documentation | Full credentials table |
| `H3C_CAS-R0785P03-.../ks/ks-auto.cfg` | Kickstart | Root password SHA-512 hash |
| `H3C_CAS-R0785P03-.../ks/ks.cfg` | Kickstart | Password policy (no root password set) |
| `H3C_CAS-R0785P03-.../extras/front.package/database/db.properties` | Original encrypted | Encrypted JDBC credentials |
| `H3C_CAS-R0785P03-.../extras/front.package/tomcat/context.xml` | Original Tomcat | MySQL vms/vservice/1q2w3e |
| `H3C_CAS-R0785P03-.../extras/front.package/cvm/.../nas-sharekey.conf` | Original config | NAS key: huawei |
| `H3C_CAS-R0785P03-.../extras/front.package/.../dhcpd.conf` | Original DHCP | Network: 192.168.0.0/24 |
| `H3C_CAS-R0785P03-.../extras/front.package/firstboot/rabbitmq/rabbitmq-init.sh` | Original script | cloud/Cl@oud13 |
| `H3C_CAS-R0785P03-.../extras/front.package/rabbitmq/` | Original certs | ca, server, client PEM + PKCS#12 |
| `H3C_CAS-R0785P03-.../extras/front.package/nginx/` | Original certs | nginx.crt + nginx.key |
| `H3C_CAS-R0785P03-.../extras/libvirt.package/` | Original certs | ca-cert.pem, server-cert.pem, server-key.pem |
| `H3C_CAS-R0785P03-.../extras/vncreflector.package/` | Original cert | casnovnc_centos.pem |
| `h3c-cas-clone/openstack_plugins/pike/nova/pike_cas_nova/` | Clone certs | cert.pem, key.pem, cacert.pem |
| `h3c-cas-clone/openstack_plugins/pike/neutron/pike_cas_neutron/` | Clone certs | cert.pem, key.pem, cacert.pem |
| `re/findings/crypto.md` | Analysis | AES-128-CBC key/IV, AES-256-CBC, iNode credential details |
| `re/linux/client_tgz/iNodeClient/custom/iNodeCustom.xml` | iNode config | Uninstall password, GUI close password, L2TP PSK, tunnel password |
| `re/linux/client_tgz/iNodeClient/custom/clientfiles/7000/7001.icnf` | iNode per-connection | CLIENTCERTPWD (template, empty) |
| `re/linux/client_tgz/iNodeClient/custom/clientfiles/2401/2402.icnf` | iNode per-connection | PRESHAREDKEY, L2TPTUNNELPWD |

---

> **Total credentials catalogued: 72** (including encrypted values, certificates, and hashes)
> **Plaintext passwords exposed in source files: 18**
> **Encrypted passwords with known keys: 15**
> **Recovered from:** `upgrade.sh`, `db.properties`, `context.xml`, `redis.properties`, `clickhouse.properties`, `tomcat_server.xml`, `nas-sharekey.conf`, `cvk_agent.conf`, `system_ports`, `db-auth.sh`, `dhcpd.conf`, `iNodeCustom.xml`, `.icnf` files, `rabbitmq-init.sh`, `libInodeUtility.so`, `libiNodeSslvpnPt.so`, `casmon.conf`, `.env`, `docker-compose.yml`, init scripts
