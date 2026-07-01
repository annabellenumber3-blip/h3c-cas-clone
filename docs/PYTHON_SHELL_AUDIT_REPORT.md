# H3C CAS Security Audit Report — Injection, Credentials, & Logic Flaws

> **Generated:** 2026-07-01  
> **Scope:** All Python scripts, shell scripts, .sh.x ELF-compiled scripts, config files, OpenStack plugins, CVD, CVM server, CVK agent  
> **Files scanned:** ~11,000 across the H3C CAS + iNode tree  
> **Methodology:** Systematic grep for command injection, SQLi, eval/exec, SSRF, path traversal, hardcoded credentials, weak crypto, backdoors, unsafe permissions, privilege escalation  

---

## EXECUTIVE SUMMARY

**26 findings total:** 10 CRITICAL, 5 HIGH, 7 MEDIUM, 4 LOW

The H3C CAS platform has **pervasive hardcoded credential exposure** — a single master DES-ECB key (`hzbdbkz1`) protects all database and service credentials, and that key is hardcoded in every shell script that touches the database. A single stolen shell script fully compromises all PostgreSQL, MySQL, ClickHouse, Redis, and RabbitMQ credentials. Additionally, the CVM REST API uses hardcoded admin/password pairs in source code. Configuration files expose databases to the network (ClickHouse `::/0`), skip authentication entirely (Kafka), and use deprecated ciphers and hashes.

No backdoors, reverse shells, or active RCE entry points were found in the analyzed code. However, **the `eval` + hardcoded key pattern in shell scripts is one step away from command injection** if any of the evaluated environment variables were attacker-controlled. The `.sh.x` ELF-compiled scripts (214 files) contain only extracted strings from standard libc — no suspicious payloads detected in string analysis.

> **Existing documentation:** The file `docs/CREDENTIALS.md` already catalogs 72 credentials/secrets found in a prior audit. This report focuses on *vulnerability impact*, exploitation paths, and configuration weaknesses beyond just credential enumeration.

---

## FINDINGS

### CRITICAL (10) — Immediate Exploitation Possible

#### F-01: Master DES-ECB Encryption Key Hardcoded in All Shell Scripts
| Field | Value |
|-------|-------|
| **Path** | `scripts/db-auth.sh:116` |
| **Severity** | CRITICAL |
| **Language** | Bash |
| **CWE** | CWE-321 (Hardcoded Cryptographic Key), CWE-327 (Broken Crypto) |
| **Description** | The DES-ECB key `hzbdbkz1` is hardcoded and used to encrypt/decrypt ALL database credentials (PostgreSQL, MySQL, ClickHouse) throughout the platform. It appears in every script that touches the database. |
| **Credential** | `hzbdbkz1` |
| **Exploitation Difficulty** | Trivial — one stolen shell script = all credentials |
| **Grep Command** | `grep -rn 'hzbdbkz1' --include='*.sh'` |
| **Affected Files** | `scripts/db-auth.sh:116`, `scripts/db-create-user.sh:32,39`, `rpm_extracts/EXTRAS_LOOSE/front.package/ms_service_slave_monitor.sh:94` |

#### F-02: PostgreSQL `ssadmin` Password `Pzss@_w0rd` Hardcoded Everywhere
| Field | Value |
|-------|-------|
| **Path** | `scripts/init-postgres.sh:31`, `scripts/init-databases.sh:22-25`, `.env:6`, `configs/cvm/db.properties:15,31` |
| **Severity** | CRITICAL |
| **Language** | Bash / Properties |
| **CWE** | CWE-798 (Hardcoded Credentials) |
| **Description** | The password `Pzss@_w0rd` is used for the `ssadmin` PostgreSQL superuser, the `ssadmin_ro` read-only user, the MySQL root user, the MySQL ssadmin user, and the ClickHouse default user — all sharing one password. It appears in plaintext in init scripts, `.env`, docker-compose.yml, README.md, and JDBC properties files. |
| **Credential** | `ssadmin / Pzss@_w0rd` |
| **Exploitation Difficulty** | Trivial — plaintext in source |
| **Grep Command** | `grep -rn 'Pzss@_w0rd' --include='*.sh' --include='*.properties' --include='*.yml' --include='*.md' --include='.env'` |

#### F-03: CVM REST API Admin Credentials Hardcoded in Python Source
| Field | Value |
|-------|-------|
| **Path** | `cvm_server/config.py:46-49` |
| **Severity** | CRITICAL |
| **Language** | Python |
| **CWE** | CWE-798 (Hardcoded Credentials) |
| **Description** | The CVM REST API's HTTP Digest auth credentials are hardcoded: `admin / Cloud@123` and `root / h3cadmin`. These authenticate to the `/cas/casrs` API endpoint which controls VM lifecycle, storage, networking, and host management. |
| **Credential** | `admin:Cloud@123`, `root:h3cadmin` |
| **Exploitation Difficulty** | Trivial — plaintext in Python dict |
| **Grep Command** | `grep -rn '"admin":\|"root":\s*"h3c' --include='*.py'` |

#### F-04: CVK Agent RabbitMQ Credentials Hardcoded
| Field | Value |
|-------|-------|
| **Path** | `cvk_agent/cvk_agent/config.py:42-43` |
| **Severity** | CRITICAL |
| **Language** | Python |
| **CWE** | CWE-798 (Hardcoded Credentials) |
| **Description** | The CVK agent Python clone hardcodes RabbitMQ credentials: `cloud / Cl@oud13`. The agent subscribes to the `cas_vm_event_nova_compute` queue and receives VM event messages. |
| **Credential** | `cloud:Cl@oud13` |
| **Exploitation Difficulty** | Trivial — plaintext in Python source |
| **Grep Command** | `grep -rn 'Cl@oud13' --include='*.py' --include='*.sh'` |

#### F-05: RabbitMQ Credentials Hardcoded in Shell Init Scripts
| Field | Value |
|-------|-------|
| **Path** | `scripts/init-rabbitmq.sh:24-33` |
| **Severity** | CRITICAL |
| **Language** | Bash |
| **CWE** | CWE-798 (Hardcoded Credentials) |
| **Description** | RabbitMQ `cloud / Cl@oud13` used inline with `rabbitmqadmin` commands to create exchanges, queues, and bindings. Also appears in `.env:19-20`. |
| **Credential** | `cloud:Cl@oud13` |
| **Exploitation Difficulty** | Trivial — plaintext in shell scripts |
| **Grep Command** | `grep -rn "Cl@oud13" --include='*.sh'` |

#### F-06: Tomcat HTTPS Keystore Password Hardcoded
| Field | Value |
|-------|-------|
| **Path** | `remaining_docs/cas_configs/front_package/tomcat_tomcat_tomcat_server.xml:95` |
| **Severity** | CRITICAL |
| **Language** | XML |
| **CWE** | CWE-798 (Hardcoded Credentials) |
| **Description** | Tomcat HTTPS keystore password `h3cbj2013` hardcoded in server.xml `keystorePass` attribute. The keystore at `/var/lib/tomcat/security/keystore` can be decrypted with this password, exposing the server's TLS private key. Also hardcoded in `cvm_server/config.py:25`. |
| **Credential** | `h3cbj2013` |
| **Exploitation Difficulty** | Trivial — plaintext in XML/Python |
| **Grep Command** | `grep -rn 'h3cbj2013'` |

#### F-07: MySQL `vservice/1q2w3e` Hardcoded in Tomcat Context
| Field | Value |
|-------|-------|
| **Path** | `remaining_docs/cas_configs/front_package/tomcat_tomcat_context.xml:32` |
| **Severity** | CRITICAL |
| **Language** | XML |
| **CWE** | CWE-798 (Hardcoded Credentials) |
| **Description** | MySQL `vservice / 1q2w3e` hardcoded in Tomcat JNDI Resource for `jdbc/vmaDB`. Grants access to the `vms` database. |
| **Credential** | `vservice:1q2w3e` |
| **Exploitation Difficulty** | Trivial — plaintext in XML |
| **Grep Command** | `grep -rn '1q2w3e'` |

#### F-08: Redis Password `Sy@Redi$79` Hardcoded in Multiple Locations
| Field | Value |
|-------|-------|
| **Path** | `remaining_docs/cas_configs/front_package/redis_redis.conf:916`, `configs/cvm/redis.properties:15` |
| **Severity** | CRITICAL |
| **Language** | Config / Properties |
| **CWE** | CWE-798 (Hardcoded Credentials) |
| **Description** | Redis `requirepass Sy@Redi$79` in redis.conf. Also present as DES-ECB encrypted value in redis.properties, decoded to the same. Redis holds CAS session/monitoring data. |
| **Credential** | `Sy@Redi$79` |
| **Exploitation Difficulty** | Trivial — plaintext in config |
| **Grep Command** | `grep -rn 'Sy@Redi'` |

#### F-09: NAS Share Key `huawei` Hardcoded
| Field | Value |
|-------|-------|
| **Path** | `remaining_docs/cas_configs/front_package/cvm_var_lib_casserver_conf_nas-sharekey.conf:1` |
| **Severity** | CRITICAL |
| **Language** | Config |
| **CWE** | CWE-798 (Hardcoded Credentials) |
| **Description** | All NAS storage share keys default to `huawei`. Any NAS share created without explicit key change uses this. |
| **Credential** | `huawei` |
| **Exploitation Difficulty** | Trivial |

#### F-10: ClickHouse Default User Password `Pzss@_w0rd` Shared + Networks `::/0`
| Field | Value |
|-------|-------|
| **Path** | `remaining_docs/cas_configs/front_package/clickhouse_users.xml:65,87-89` |
| **Severity** | CRITICAL |
| **Language** | XML |
| **CWE** | CWE-798 + CWE-219 (Permissive Network Access) |
| **Description** | ClickHouse `default` user has password `Pzss@_w0rd` (same as PostgreSQL/MySQL) AND `networks ::/0` allows connections from ANY IP address. ClickHouse holds CAS metrics data. |
| **Credential** | `default:Pzss@_w0rd` |
| **Exploitation Difficulty** | Trivial — open network + known password |
| **Grep Command** | `grep -A3 '<ip>::/0</ip>' clickhouse_users.xml` |

---

### HIGH (5) — Significant Security Weakness

#### F-11: DES-ECB Cipher for All Database Credential Protection
| Field | Value |
|-------|-------|
| **Path** | `scripts/db-auth.sh:20-27`, `scripts/db-auth.sh:69` |
| **Severity** | HIGH |
| **Language** | Bash |
| **CWE** | CWE-327 (Broken/Risky Cryptographic Algorithm) |
| **Description** | DES-ECB with `openssl enc -d -des-ecb` is used for all credential encryption. DES-ECB is completely broken (56-bit key, deterministic block patterns). Combined with the hardcoded key `hzbdbkz1`, all encrypted credentials in `db.properties` are trivially recoverable. |
| **Exploitation Difficulty** | Trivial — known key + broken cipher |
| **Grep Command** | `grep -rn 'des-ecb\|DES-ECB' --include='*.sh'` |

#### F-12: Kafka Has No Authentication Configured
| Field | Value |
|-------|-------|
| **Path** | `remaining_docs/cas_configs/front_package/kafka_kafka.properties:1-5` |
| **Severity** | HIGH |
| **Language** | Properties |
| **CWE** | CWE-306 (Missing Authentication) |
| **Description** | Kafka broker at `127.0.0.1:9092` has no SASL, SSL, or ACL authentication. Any process/user on the host can read/write to CAS message topics. |
| **Exploitation Difficulty** | Trivial — no auth required |
| **Grep Command** | `grep -rn '127.0.0.1:9092'` |

#### F-13: SNMP Community String `private` (Well-Known Default)
| Field | Value |
|-------|-------|
| **Path** | `remaining_docs/cas_configs/cha_package/casmon.conf:4` |
| **Severity** | HIGH |
| **Language** | Config |
| **CWE** | CWE-1392 (Default Credentials) |
| **Description** | SNMPv2c community string `private` on port 20049. SNMP `private` is the well-known read-write community that can expose system information or be used for SNMP-based attacks. |
| **Exploitation Difficulty** | Trivial — well-known default |
| **Grep Command** | `grep -rn '"private"\|SNMPv2c,private'` |

#### F-14: MD5 Hash Used for HTTP Digest Authentication
| Field | Value |
|-------|-------|
| **Path** | `cvm_server/auth.py:95-105`, `cvm_server/config.py:42` |
| **Severity** | HIGH |
| **Language** | Python |
| **CWE** | CWE-328 (Weak Hash) |
| **Description** | The CVM REST API uses MD5 for HTTP Digest auth (`DIGEST_ALGORITHM = "MD5"`). MD5 is cryptographically broken for collision resistance, making digest auth susceptible to offline cracking if nonces are captured. |
| **Exploitation Difficulty** | Medium — requires packet capture + cracking |
| **Grep Command** | `grep -rn 'hashlib.md5\|DIGEST_ALGORITHM.*MD5' --include='*.py'` |

#### F-15: Tomcat Shutdown Port with Default Password
| Field | Value |
|-------|-------|
| **Path** | `remaining_docs/cas_configs/front_package/tomcat_tomcat_tomcat_server.xml:22` |
| **Severity** | HIGH |
| **Language** | XML |
| **CWE** | CWE-1392 (Default Credentials) |
| **Description** | Tomcat shutdown port 8005 with default password `SHUTDOWN`. Any local attacker can send `SHUTDOWN` to port 8005 and stop the CVM application server. |
| **Exploitation Difficulty** | Easy — local network access |
| **Grep Command** | `grep -rn 'shutdown="SHUTDOWN"'` |

---

### MEDIUM (7) — Requires Some Preconditions

#### F-16: `eval` with Hardcoded Key in Shell Scripts (Potential Command Injection)
| Field | Value |
|-------|-------|
| **Path** | `rpm_extracts/EXTRAS_LOOSE/front.package/ms_service_slave_monitor.sh:94`, `scripts/db-create-user.sh:32,39` |
| **Severity** | MEDIUM |
| **Language** | Bash |
| **CWE** | CWE-78 (OS Command Injection) |
| **Description** | `eval $(/opt/bin/db-auth.sh -k hzbdbkz1 print)` evaluates the output of db-auth.sh as shell commands. db-auth.sh prints `DB_HOST=`, `DB_PORT=`, `DB_USER=`, `DB_PASS=` variables from the database config file. If an attacker can modify `/etc/cvk/cvm/db.properties` to inject shell metacharacters (e.g., `jdbc.password=$(malicious_command)`), the eval would execute arbitrary commands. |
| **Exploitation Difficulty** | Medium — requires db.properties write access |
| **Grep Command** | `grep -rn 'eval \$(.*db-auth' --include='*.sh'` |

#### F-17: SSH `StrictHostKeyChecking=no` in SCP Client
| Field | Value |
|-------|-------|
| **Path** | `cvk_agent/cvk_agent/scp.py:272,298` |
| **Severity** | MEDIUM |
| **Language** | Python |
| **CWE** | CWE-295 (Improper Certificate Validation) |
| **Description** | The SCP client uses `StrictHostKeyChecking=no` which disables host key verification. This makes the CVK agent vulnerable to MITM attacks during SCP file transfers (VM images, snapshots). |
| **Exploitation Difficulty** | Medium — requires network position |
| **Grep Command** | `grep -rn 'StrictHostKeyChecking=no' --include='*.py'` |

#### F-18: Paramiko `AutoAddPolicy()` Accepts All Host Keys
| Field | Value |
|-------|-------|
| **Path** | `cvk_agent/cvk_agent/scp.py:183,208,233` |
| **Severity** | MEDIUM |
| **Language** | Python |
| **CWE** | CWE-295 (Improper Certificate Validation) |
| **Description** | All paramiko SSH connections use `set_missing_host_key_policy(AutoAddPolicy())` which automatically accepts and caches any host key without verification. Enables MITM against CVK-CVM SCP/SSH communication. |
| **Exploitation Difficulty** | Medium — requires network position |
| **Grep Command** | `grep -rn 'AutoAddPolicy' --include='*.py'` |

#### F-19: Weak TLS Ciphers in Tomcat (3DES, CBC)
| Field | Value |
|-------|-------|
| **Path** | `remaining_docs/cas_configs/front_package/tomcat_tomcat_tomcat_server.xml:91` |
| **Severity** | MEDIUM |
| **Language** | XML |
| **CWE** | CWE-327 (Weak Encryption) |
| **Description** | Tomcat HTTPS connector includes `SSL_RSA_WITH_3DES_EDE_CBC_SHA` and multiple CBC-mode ciphers. 3DES is deprecated (CVE-2016-2183, SWEET32) and CBC-mode is vulnerable to padding oracle attacks (Lucky13). Same ciphers hardcoded in `cvm_server/config.py:26-33`. |
| **Exploitation Difficulty** | Medium — requires sophisticated network attack |
| **Grep Command** | `grep -rn '3DES\|SSL_RSA_WITH_3DES'` |

#### F-20: Predictable Lockfile Name in /tmp
| Field | Value |
|-------|-------|
| **Path** | `rpm_extracts/EXTRAS_LOOSE/front.package/ms_service_slave_monitor.sh:27` |
| **Severity** | MEDIUM |
| **Language** | Bash |
| **CWE** | CWE-377 (Insecure Temporary File) |
| **Description** | Lockfile at `/tmp/ms_service_slave_monitor.sh.lock` uses a predictable name. An unprivileged user could create a symlink from this path to a sensitive file, causing data corruption or denial of service when the script runs as root. Does NOT use `mktemp`. |
| **Exploitation Difficulty** | Medium — requires unprivileged local user |
| **Grep Command** | `grep -rn 'LOCKFILE=/tmp/' --include='*.sh'` |

#### F-21: `/tmp` Usage Without `mktemp` in Install Scripts
| Field | Value |
|-------|-------|
| **Path** | `rpm_extracts/EXTRAS_LOOSE/castools.package/install.sh:94-117` |
| **Severity** | MEDIUM |
| **Language** | Bash |
| **CWE** | CWE-377 (Insecure Temporary File) |
| **Description** | Install script creates `/tmp/xc_castool`, `/tmp/driver_iso` without `mktemp`. Multiple scripts also create files in `/tmp/` with predictable names. Symlink attacks possible if install runs as root. |
| **Exploitation Difficulty** | Medium — requires unprivileged local user during install |
| **Grep Command** | `grep -rn 'mkdir.*\/tmp\/' --include='*.sh'` |

#### F-22: HTTP CVM API on Port 8080 (No Forced TLS)
| Field | Value |
|-------|-------|
| **Path** | `remaining_docs/cas_configs/front_package/tomcat_tomcat_tomcat_server.xml:71-78` |
| **Severity** | MEDIUM |
| **Language** | XML |
| **CWE** | CWE-319 (Cleartext Transmission) |
| **Description** | CVM REST API listens on plain HTTP port 8080. While HTTPS on 8443 exists, HTTP is not redirected or disabled. HTTP Digest auth credentials transmit with MD5 hashing (see F-14), but management traffic can be observed in cleartext. |
| **Exploitation Difficulty** | Medium — network sniffing |
| **Grep Command** | `grep -rn 'port="8080"'` |

---

### LOW (4) — Minor Concerns

#### F-23: PostgreSQL pg_hba.conf Uses MD5 Authentication
| Field | Value |
|-------|-------|
| **Path** | `remaining_docs/cas_configs/front_package/database_pg_hba.conf:85-94` |
| **Severity** | LOW |
| **Language** | Config |
| **CWE** | CWE-327 |
| **Description** | PostgreSQL uses `md5` authentication method. Modern PostgreSQL supports `scram-sha-256` which is resistant to replay attacks. MD5 auth in PostgreSQL is susceptible to password interception. |
| **Exploitation Difficulty** | Low — requires network sniffing |

#### F-24: `.pyc` Bytecode Files in `/opt/bin` (Reversible)
| Field | Value |
|-------|-------|
| **Path** | `rpm_extracts/EXTRAS_LOOSE/front.package/common-install.sh:5` (installs `future.pyc`), various `.pyc` references |
| **Severity** | LOW |
| **Language** | Python |
| **CWE** | CWE-540 (Source Code Exposure) |
| **Description** | H3C deploys `.pyc` (compiled bytecode) files directly to `/opt/bin/` instead of proper packaging. Python bytecode can be decompiled with tools like `uncompyle6` or `decompyle3`, revealing source logic. Multiple scripts reference `execute_database_query.pyc` — this script accepts database credentials as CLI arguments (visible in `ps aux`). |
| **Exploitation Difficulty** | Low — decompilers publicly available |

#### F-25: Credentials Passed as CLI Arguments (Visible in Process List)
| Field | Value |
|-------|-------|
| **Path** | `rpm_extracts/EXTRAS_LOOSE/front.package/ms_service_slave_monitor.sh:95` |
| **Severity** | LOW |
| **Language** | Bash |
| **CWE** | CWE-214 (Information Exposure Through Process Environment) |
| **Description** | `python /opt/bin/execute_database_query.pyc $peer_ip $DB_PORT $DB_DATABASE $DB_USER $DB_PASS "select..."` passes the decrypted database password as a CLI argument. Any user on the system can see it via `ps aux` or `/proc`. |
| **Exploitation Difficulty** | Trivial for local users |
| **Grep Command** | `grep -rn '\$DB_PASS\|\$DB_USER' --include='*.sh'` |

#### F-26: `rm -rf` with Unquoted Variables in Install/Uninstall Scripts
| Field | Value |
|-------|-------|
| **Path** | `rpm_extracts/EXTRAS_LOOSE/front.package/uninstall-front.sh:20-21`, `rpm_extracts/EXTRAS_LOOSE/rbd-clients.package/install.sh:13` |
| **Severity** | LOW |
| **Language** | Bash |
| **CWE** | CWE-22 (Path Traversal) |
| **Description** | `rm -rf $md5file` and `rm -rf $backdir` use unquoted variables. While these are set to hardcoded paths within the script, if the variables were ever controlled externally (e.g., sourced from another file), an attacker could inject paths like `/` causing catastrophic deletion. |
| **Exploitation Difficulty** | Low — requires compromised environment |
| **Grep Command** | `grep -rn 'rm -rf \$' --include='*.sh'` |

---

## SUMMARY STATISTICS

| Category | Count |
|----------|-------|
| Hardcoded plaintext credentials | 15 distinct passwords |
| Hardcoded encryption keys | 1 (protects all others) |
| Weak/broken cryptography | 4 (DES-ECB, MD5, 3DES, pg_hba md5) |
| Missing authentication | 2 (Kafka, SNMP) |
| Insecure temp files | 3 |
| Weak TLS/SSH config | 4 |
| Potential command injection | 1 (eval pattern) |
| Decompilable bytecode | ~200 .pyc files |
| Backdoors/reverse shells | 0 found |
| Direct RCE paths | 0 found |

## CREDENTIALS QUICK REFERENCE

| Service | User | Password | Where Used |
|---------|------|----------|------------|
| DB Encryption | — | `hzbdbkz1` | All credential encryption/decryption |
| PostgreSQL | `ssadmin` | `Pzss@_w0rd` | vservice, vmware, baremetal |
| PostgreSQL | `ssadmin_ro` | `Pzss@_w0rd` | Read-only DB access |
| MySQL | `ssadmin` | `Pzss@_w0rd` | cas_cic |
| MySQL | `root` | `Pzss@_w0rd` | MySQL root |
| MySQL | `vservice` | `1q2w3e` | vms (Tomcat JNDI) |
| ClickHouse | `default` | `Pzss@_w0rd` | metrics |
| Redis | — | `Sy@Redi$79` | Session/monitoring cache |
| RabbitMQ | `cloud` | `Cl@oud13` | cloudMsgHost vhost |
| CVM API | `admin` | `Cloud@123` | CVM REST /cas/casrs |
| CVM API | `root` | `h3cadmin` | CVM REST /cas/casrs |
| Tomcat HTTPS | — | `h3cbj2013` | TLS keystore |
| Tomcat shutdown | — | `SHUTDOWN` | Port 8005 |
| NAS shares | — | `huawei` | All share keys |
| SNMP | — | `private` | Monitoring |
