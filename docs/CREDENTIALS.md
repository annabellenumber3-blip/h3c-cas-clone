# H3C CAS + iNode — Complete Credentials & Secrets

## Master Encryption Keys

| Key | Value | Used For | Source |
|-----|-------|----------|--------|
| DES-ECB key | `hzbdbkz1` | All CAS database credential encryption/decryption | `upgrade.sh:95` (`DATABASE_CRYPT_KEY`) |
| AES-128-CBC key | `EC D4 4F 7B C6 DD 7D DE 2B 7B 51 AB 4A 6F 5A 22` | iNode local config file encryption | `libInodeUtility.so` (rkey1 @0x3b9138 + rkey2 @0x3b9088) |
| AES-128-CBC IV | `a@4de%#1asdfsd24` | iNode local config file encryption | `libInodeUtility.so` (iv1 @0x3b9140 + iv2 @0x3b9080) |

---

## CAS CVM REST API Users (HTTP Digest Auth, realm="CAS")

| Username | Password | Role | Source |
|----------|----------|------|--------|
| `admin` | `Cloud@123` | CVM administrator | Digest auth default in server.xml |
| `root` | `h3cadmin` | CVM root user | Digest auth default |

---

## CAS Database Credentials

| Service | Host:Port | Database | User | Encrypted Value | Decrypted Value | Source |
|---------|-----------|----------|------|----------------|-----------------|--------|
| PostgreSQL | localhost:1523 | vservice | ssadmin | `PdfEjjxsBAo=` | `Pzss@_w0rd` | `db.properties:7` (DES-ECB, key=hzbdbkz1) |
| PostgreSQL | localhost:1523 | vservice | ssadmin | `egJU1XOSiZHypdQZAaae9g==` | (password field) | `db.properties:8` |
| PostgreSQL | localhost:1523 | vmware | ssadmin | (same as vservice) | `Pzss@_w0rd` | `db.properties:4` |
| PostgreSQL | localhost:1523 | baremetal | ssadmin | (same) | `Pzss@_w0rd` | `db.properties:5` |
| PostgreSQL slave | localhost:1523 | vservice | ssadmin | `v5mylqlw4AEaHI2MAJVbhA==` | (encrypted) | `db.properties:20` |
| MySQL | localhost:3306 | cas_cic | (from props) | encrypted | (encrypted) | `db.properties:6` |
| MySQL | localhost:3306 | vms | vservice | `1q2w3e` | `1q2w3e` (PLAINTEXT!) | `tomcat/context.xml:32` |
| MySQL | localhost:3306 | — | root | `1q2w3e` | `1q2w3e` | docker-compose.yml |
| SeaSQL | localhost | seasql | ssadmin | — | `Pzss@_w0rd` (initial) | `db-create-user.sh:9` |

---

## CAS Middleware Credentials

| Service | Host:Port | User | Encrypted | Decrypted | Source |
|---------|-----------|------|-----------|-----------|--------|
| Redis | 127.0.0.1:6379 | — | `COT723vi0xiIHjhUYAEddg==` | `Sy@Redi$79` | `redis.properties:8` |
| RabbitMQ | localhost:5672 | cloud | — | `Cl@oud13` | server.xml CVM config |
| RabbitMQ | localhost:5672 | guest | — | `Cl@oud13` (changed from guest) | docker-compose |
| RabbitMQ vhost | — | — | — | `cloudMsgHost` | `kafka.properties`, docker |
| ClickHouse | localhost:8123 | default | `xYFZQgBNw0E=` | `Pzss@_w0rd` | `clickhouse.properties:4` |
| ClickHouse | localhost:8123 | default | — | `Pzss@_w0rd` (PLAINTEXT in script!) | `hotstandby_clickhouse_init.sh:33,60-62` |
| Kafka | localhost:9092 | — | — | (none, PLAINTEXT) | `kafka.properties:1` |

---

## CAS Security / Certificate Passwords

| Component | Password/Key | Source File |
|-----------|-------------|-------------|
| Tomcat HTTPS keystore (JKS) | `h3cbj2013` | `tomcat_server.xml:83` (`keystorePass`) |
| Tomcat shutdown port | `SHUTDOWN` (port 8005) | `tomcat_server.xml` |
| NAS share key (all shares) | `huawei` | `cvm/var/lib/casserver/conf/nas-sharekey.conf` |
| Kickstart root password | `$6$PH3AYN1qD1x8s8su$...` (SHA512 crypt) | `ks/ks-auto.cfg` |
| libvirt TLS CA | ca-cert.pem, server-cert.pem, server-key.pem | `libvirt.package/` |
| CVD auth token | (from REST Digest auth) | `cvk_agent.conf` |

---

## iNode SSL VPN Secrets

| Component | Secret/Source | Details |
|-----------|--------------|---------|
| SPA/HOTP HMAC-SHA1 client key | Per-client from SDP controller registration | Stored encrypted in `/etc/spa/spa_cfg.cnf` as `SdpKey-<ip>` |
| SPA client AID | Per-client 32-char string | Stored in `spa_cfg.cnf` as `SdpAid-<ip>` |
| iNode password on wire | **Cleartext inside TLS** (no RSA on this gateway) | `PROTOCOL.md §5.2`, `crypto.md:13` |
| iNode local password storage | AES-128-CBC encrypted with hardcoded key/IV | `libInodeUtility.so` (utl_AESCBC_Encryption) |
| TLS client cert password | `CLIENTCERTPWD` field in `.icnf` | `7001.icnf` |
| iNode uninstall password | `c+PckpVimj0=` (encrypted base64) | `iNodeCustom.xml` |
| L2TP/IPsec preshared key | Encrypted in `.icnf` | `2402.icnf` (`PRESHAREDKEY`) |
| iNode GUI close password | Encrypted | `iNodeCustom.xml` (`closeInodePwd`) |
| SSL VPN login password | Raw password in `<password>` XML element | `SslVpnXmlParser.cpp:39` |
| 2FA/SMS challenge code | Raw code in `<code>` XML element | `SslVpnXmlParser.cpp:229` |

---

## SRM SRA Adapter (VMware Site Recovery Manager)

| Component | Value | Source |
|-----------|-------|--------|
| ONEStor REST API base path | `/api/v3/onestor/{cluster_id}/blk/map/...` | `target.py:26,50` |
| Test target device keys | `0x00b34201-4aad0000-ce1307b3-cfa37467` | SRM XML test fixtures (6 XML files) |
| SRA v2 XML namespace | `http://xml.vmware.com/v2/sra` | `response.py` |

---

## Default Network Configuration

| Component | Value | Source File |
|-----------|-------|-------------|
| Bare metal DHCP subnet | `192.168.0.0/24` | `cas-bare-metal.front/conf/dhcpd.conf:15` |
| Bare metal DHCP range | `192.168.0.200` – `192.168.0.254` | `dhcpd.conf:16` |
| Bare metal next-server (PXE) | `192.168.0.161` | `dhcpd.conf:22` |
| Bare metal default gateway | `192.168.0.1` | `dhcpd.conf:23` |
| TRM proxy IP | `10.10.10.10:9039` | `TRMClient.ini` |
| Acesure/MoveSure API | `http://127.0.0.1:9981/cdap/v2.0/` | `movesure/first_boot.sh:28,43,71` |
| Redis sentinel | `mymaster 127.0.0.1 6379 2` | `sentinel.conf:84` |

---

## Service Ports (All)

| Port | Protocol | Service | Source |
|------|----------|---------|--------|
| 443 | TCP/TLS | SSL VPN gateway (iNode), SPA auth | `PROTOCOL.md` |
| 3000 | TCP/TLS | Live H3C gateway (SSLVPN-Gateway/7.0) | `CLAUDE.md:46` |
| 8080 | HTTP | CVM REST API, Tomcat | `tomcat_server.xml:64` |
| 8443 | HTTPS | CVM REST API (TLS 1.2, JKS keystore) | `tomcat_server.xml:82` |
| 8005 | TCP | Tomcat shutdown | `tomcat_server.xml` |
| 8009 | AJP | Tomcat AJP connector | `tomcat_server.xml` (commented) |
| 1523 | TCP | PostgreSQL (vservice) | `db.properties:3` |
| 3306 | TCP | MySQL (cas_cic, vms) | `db.properties:6`, `context.xml` |
| 6379 | TCP | Redis | `redis.properties:7` |
| 5672 | TCP | RabbitMQ AMQP | docker-compose |
| 15672 | TCP | RabbitMQ Management UI | docker-compose |
| 9092 | TCP | Kafka | `kafka.properties:1` |
| 8123 | HTTP | ClickHouse HTTP | `clickhouse.properties:3` |
| 9000 | TCP | ClickHouse Native | docker-compose |
| 20050 | TCP | CVM TCP Server (casserver) | `server.xml` |
| 20101 | UDP | CVM UDP Server (casserver) | `server.xml` |
| 20102 | UDP | iNode detector listener | `service.md:33` |
| 50001 | UDP | iNode local IPC command socket | `service.md:83` |
| 162 | UDP | SNMP agent listen | `server.xml` |
| 9023 | UDP | SNMP notify port | `server.xml` |
| 8000 | UDP | SPA knock (gateway handshake) | `PROTOCOL.md`, `spa.md:43` |
| 19006 | UDP | SPA device register port | `PROTOCOL.md`, `spa.md:43` |
| 59993 | UDP | SPA generic knock port | `PROTOCOL.md`, `spa.md:44` |
| 4433 | TCP | Zero-Trust controller auth (alt port) | `docs.md:217` |
| 8081 | TCP | noVNC WebSocket proxy (TLS 1.2) | `vncreflector.package` systemd |
| 5900+ | TCP | VNC console (per-VM) | CVM response |
| 5900+ | TCP | SPICE console (per-VM) | CVM response |
| 9981 | HTTP | Acesure/MoveSure CDAP API | `movesure/first_boot.sh:28` |

---

## Encryption Status Summary

| Status | Count | Examples |
|--------|-------|---------|
| **PLAINTEXT** (immediate risk) | 6 | MySQL `1q2w3e`, ClickHouse `Pzss@_w0rd` in script, Tomcat `h3cbj2013`, NAS `huawei`, RabbitMQ `Cl@oud13` |
| **Encrypted** (DES-ECB, key known) | 6 | PostgreSQL credentials in `db.properties`, Redis password |
| **Encrypted** (base64 only) | 3 | iNode uninstall password, L2TP preshared key |
| **Encrypted** (AES-128-CBC, key known) | 2 | iNode local config, SPA credentials |
| **Not encrypted** (TLS only) | — | iNode SSL VPN password on wire |

---
*Recovered from: `upgrade.sh`, `db.properties`, `context.xml`, `redis.properties`, `clickhouse.properties`, `tomcat_server.xml`, `server.xml`, `nas-sharekey.conf`, `cvk_agent.conf`, `hotstandby_clickhouse_init.sh`, `dhcpd.conf`, `TRMClient.ini`, `spa_cfg.cnf`, `7001.icnf`, `iNodeCustom.xml`, `libInodeUtility.so`, `libiNodeSslvpnPt.so`*
