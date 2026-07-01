# H3C CAS Clone — Wire Protocol

> **Source:** `cvm_server/auth.py`, `cvm_server/xml_utils.py`, `cvk_agent/feign.py`, `cvk_agent/eventbus.py`
> Every protocol detail — HTTP Digest auth flow, XML request/response format, async task model, event bus protocol.

## 1. HTTP Transport

### 1.1 Transport Layer

| Property | Value | Source |
|----------|-------|--------|
| Protocol | HTTP/1.1 | `README.md:11` |
| TLS | TLS 1.2 (HTTPS 8443) | `README.md:75`, `cvm_server/config.py:24` |
| Content-Type (request) | `application/xml` | `cvk_agent/feign.py:266` |
| Content-Type (response) | `application/xml;charset=UTF-8` | All routers |
| Accept | `application/xml` | `cvk_agent/feign.py:265` |
| Server header | `CVM` | `cvm_server/main.py:56`, `cvm_server/config.py:14` |
| User-Agent (CVK) | `CVK-Agent/1.0 (Python Feign)` | `cvk_agent/feign.py:268` |
| Charset | UTF-8 | All XML declarations |

### 1.2 Connection Timeouts

| Timeout | Value | Source |
|---------|-------|--------|
| Connect timeout | 10s | `cvk_agent/config.py:18`, `cvk_agent/cvk_agent.conf:26` |
| Read timeout (normal) | 600s (10 min) | `cvk_agent/config.py:19` |
| Read timeout (slow task) | 172800s (48h) | `cvk_agent/config.py:21` |
| Write timeout | 600s | `cvk_agent/config.py:22` |
| Pool max idle connections | 200 | `cvk_agent/config.py:23` |
| Keep-alive duration | 50s | `cvk_agent/config.py:24` |
| Tomcat connection timeout | 20000ms | `cvm_server/config.py:20` |
| Tomcat keepalive timeout | 15000ms | `cvm_server/config.py:21` |

### 1.3 Connection Pooling

> **Source:** `cvk_agent/feign.py:143-183` — Mirrors `FeignConfiguration.java` OkHttpClient builder

```python
# Python clone equivalent
pool = urllib3.PoolManager(
    num_pools=16,
    maxsize=200,                    # FEIGN_OK_HTTP_MAX_IDLE_CONNECTION
    timeout=Timeout(connect=10, read=600),
    retries=Retry(total=0),         # Feign retryer NEVER_RETRY
)
```

**Client cache:** Up to 1024 cached Feign clients, 24h TTL.
> **Source:** `cvk_agent/feign.py:132-136`, `cvk_agent/config.py:25`

---

## 2. HTTP Digest Authentication (RFC 2617)

### 2.1 Parameters

| Parameter | Value | Source |
|-----------|-------|--------|
| Realm | `CAS` | `cvm_server/config.py:41` |
| Algorithm | `MD5` | `cvm_server/config.py:42` |
| QoP | `auth` | `cvm_server/config.py:43` |
| Nonce timeout | 300s | `cvm_server/config.py:112` |
| Users | `admin:Cloud@123`, `root:h3cadmin` | `cvm_server/config.py:46-49` |

### 2.2 Auth Flow

```
Client                              Server
  │                                    │
  │─ GET /cas/casrs/... ──────────────►│
  │                                    │ generate_nonce() → ts:hmac
  │◄── 401 + WWW-Authenticate: Digest ─│ realm="CAS", nonce="Ts:Mac",
  │     realm="CAS", nonce="...",      │ qop="auth", algorithm=MD5
  │     qop="auth", algorithm=MD5      │
  │                                    │
  │ Compute:                            │
  │  HA1 = MD5(user:realm:password)    │
  │  HA2 = MD5(GET:/cas/casrs/...)     │
  │  nc = 00000001                     │
  │  cnonce = MD5(random(16))          │
  │  resp = MD5(HA1:nonce:nc:cnonce:auth:HA2)  │
  │                                    │
  │─ GET + Authorization: Digest ─────►│ parse_digest_auth()
  │   username="admin",                │ validate_nonce()
  │   realm="CAS",                     │ verify_digest()
  │   nonce="Ts:Mac",                  │ → store username in request.state
  │   uri="/cas/casrs/...",            │
  │   response="...",                  │
  │   algorithm=MD5,                   │
  │   qop=auth, nc=00000001,           │
  │   cnonce="..."                     │
  │                                    │
  │◄─ 200 + Server: CVM ──────────────│
  │                                    │
  │ (On 403: retry up to 10 times)     │
```

> **Source:** `cvm_server/auth.py:26-174`, `cvk_agent/feign.py:44-109`

### 2.3 Nonce Format

```
nonce = "{timestamp}:{hmac_sha256(timestamp, secret)[:16]}"
```
- Timestamp: Unix epoch seconds
- Secret: SHA-256 random UUID, generated at server startup
- Validation: HMAC check + 300s expiry
> **Source:** `cvm_server/auth.py:26-46`

### 2.4 Digest Computation (RFC 2617 Section 3.2.2)

```
HA1 = MD5(username ":" realm ":" password)
HA2 = MD5(method ":" digest-uri)

If qop is "auth" or "auth-int":
    response = MD5(HA1 ":" nonce ":" nc ":" cnonce ":" qop ":" HA2)
Else:
    response = MD5(HA1 ":" nonce ":" HA2)
```

> **Source:** `cvm_server/auth.py:76-107`

---

## 3. XML Message Format

### 3.1 XML Declaration

All messages use the CAS canonical XML format:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<rootElement>
  ...
</rootElement>
```

> **Source:** `xml_utils.py:24-26`

### 3.2 Async Task Response (`<message>`)

Every state-changing operation returns an async task response:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<message>
  <msgId>task-12345</msgId>
  <completed>false</completed>
  <result>0</result>
  <targetId>vm-001</targetId>
  <targetName>web-server-01</targetName>
  <failMsg>error description</failMsg>
  <oldTask>previous-task-id</oldTask>
</message>
```

| Field | Type | Description | Source |
|-------|------|-------------|--------|
| `msgId` | string | Task ID (`task-{random}`) | `xml_utils.py:32-68` |
| `completed` | boolean | `true` when task done | `xml_utils.py:56` |
| `result` | int (0-3) | 0=success, 1=failed, 2=partial, 3=unknown | `xml_utils.py:58` |
| `targetId` | string | Target resource ID (e.g., `vm-001`) | `xml_utils.py:61` |
| `targetName` | string | Human-readable target name | `xml_utils.py:63` |
| `failMsg` | string | Error message (only when result ≠ 0) | `xml_utils.py:67` |
| `oldTask` | string | Previous task ID (for chained ops) | `xml_utils.py:65` |

**Task completion:** Tasks auto-complete after ~0.5s in mock mode.
> **Source:** `store.py:222-250`

### 3.3 Host Pool List (`<hostPools>`)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<hostPools>
  <hostPool>
    <id>pool-001</id>
    <name>DefaultPool</name>
    <title>Default Host Pool</title>
  </hostPool>
</hostPools>
```
> **Source:** `xml_utils.py:74-91`

### 3.4 Host List (`<hosts>`)

```xml
<hosts>
  <host>
    <id>host-001</id>
    <name>cvk-node-1</name>
    <status>1</status>
    <cpu>32</cpu>
    <cpuRate>12.5</cpuRate>
    <memory>131072</memory>
    <memoryRate>45.0</memoryRate>
    <physical_cpu>64</physical_cpu>
    <kernelType>x86_64</kernelType>
    <ipaddr>192.168.1.101</ipaddr>
    <local_raw_disks>
      <local_raw_disk>
        <type>SSD</type>
        <size>480</size>
        <num>2</num>
      </local_raw_disk>
    </local_raw_disks>
  </host>
</hosts>
```
- Only online hosts (`status == 1`) are included
> **Source:** `xml_utils.py:94-133`

### 3.5 VM Domain List (`<domains>`)

```xml
<domains>
  <domain>
    <name>web-server-01</name>
    <uuid>a1b2c3d4-e5f6-7890-abcd-ef1234567890</uuid>
    <id>vm-001</id>
    <state>2</state>
  </domain>
</domains>
```
> **Source:** `xml_utils.py:222-241`

### 3.6 VM Search (`<domain>`)

```xml
<domain>
  <id>vm-001</id>
  <hostId>host-001</hostId>
  <hostName>cvk-node-1</hostName>
  <clusterId>cluster-001</clusterId>
</domain>
```
> **Source:** `xml_utils.py:244-259`

### 3.7 VM Info (`<domain>`)

```xml
<domain>
  <state>2</state>
  <memory>8192</memory>
  <cpu>4</cpu>
  <maxMemory>16384</maxMemory>
  <vcpuMax>8</vcpuMax>
  <uuid>a1b2c3d4-...</uuid>
  <name>web-server-01</name>
</domain>
```
> **Source:** `xml_utils.py:262-283`

### 3.8 VM Detail with Network & Storage

```xml
<domain>
  <id>vm-001</id>
  <name>web-server-01</name>
  <uuid>a1b2c3d4-...</uuid>
  <state>2</state>
  <cpu>4</cpu>
  <memory>8192</memory>
  <hostId>host-001</hostId>
  <hostName>cvk-node-1</hostName>
  <clusterId>cluster-001</clusterId>
  <cdrom>0</cdrom>
  <bootingDevice>2</bootingDevice>
  <autoBooting>0</autoBooting>
  <interfaces>
    <interface>
      <mac>52:54:00:12:34:56</mac>
      <type>bridge</type>
      <source>ovsbr0</source>
      <model>virtio</model>
      <name>eth0</name>
    </interface>
  </interfaces>
  <disks>
    <disk>
      <device>disk</device>
      <type>file</type>
      <driverType>qcow2</driverType>
      <sourceFile>/vms/images/web-server-01.qcow2</sourceFile>
      <targetDev>vda</targetDev>
      <targetBus>virtio</targetBus>
      <size>40</size>
      <readonly>false</readonly>
      <shareable>false</shareable>
    </disk>
  </disks>
</domain>
```
> **Source:** `xml_utils.py:316-391`

### 3.9 Error Response

```xml
<?xml version="1.0" encoding="UTF-8"?>
<error>
  <code>404</code>
  <message>VM vm-999 not found</message>
</error>
```
> **Source:** `xml_utils.py:561-566`

### 3.10 Events

```xml
<events>
  <event>
    <type>VM_STARTED</type>
    <vmId>vm-001</vmId>
    <progress>100</progress>
  </event>
</events>
```
> **Source:** `xml_utils.py:572-585`

### 3.11 Console (VNC/SPICE) — Plain Text

```
host=192.168.1.100
port=5901
password=vncpwd_vm-001
```
```
host=192.168.1.100
port=5902
tlsPort=5903
password=spicepwd_vm-001
```
> **Source:** `xml_utils.py:531-538`

---

## 4. Async Task Model

### 4.1 Flow

```
1. Client sends POST/PUT to CAS endpoint
2. CVM creates task record (task-{random}) and returns immediately:
   <message><msgId>task-12345</msgId><completed>false</completed></message>
3. Client polls GET /message/task-12345 until completed=true
4. Task auto-completes after operation finishes
5. Client reads result, targetId, targetName from final response
```

> **Source:** `store.py:222-250`, `xml_utils.py:32-68`, `routers/message.py:14-27`

### 4.2 Task States

| State | Description |
|-------|-------------|
| `completed=false` | Task is still running |
| `completed=true, result=0` | Task succeeded |
| `completed=true, result=1` | Task failed |
| `completed=true, result=2` | Partial success |
| `completed=true, result=3` | Unknown state |

### 4.3 Task Auto-Completion (Mock)

In the mock data store, tasks auto-complete after 0.5 seconds:
```python
if time.time() - task["created"] > 0.5:
    task["completed"] = True
```
> **Source:** `store.py:248-249`

---

## 5. Event Bus Protocol

### 5.1 RabbitMQ (AMQP)

| Property | Value | Source |
|----------|-------|--------|
| Protocol | AMQP 0-9-1 | `cvk_agent/eventbus.py:238-252` |
| Host | Same as CVM (default) | `cvk_agent/eventbus.py:262` |
| Port | 5672 | `cvk_agent/config.py:41` |
| VHost | `cloudMsgHost` | `cvk_agent/config.py:38` |
| Exchange | `cloud_vm_exchange_direct` | `cvk_agent/config.py:39` |
| Exchange type | `direct` | `cvk_agent/eventbus.py:294` |
| Queue | `cas_vm_event_nova_compute` | `cvk_agent/config.py:40` |
| Routing key | Same as queue name | `cvk_agent/eventbus.py:315` |
| Queue max length | 256 MB | `cvk_agent/config.py:44` |
| Queue mode | `lazy` | `cvk_agent/config.py:45` |
| Credentials | `cloud` / `Cl@oud13` | `cvk_agent/config.py:42-43` |
| Heartbeat | 60s | `cvk_agent/eventbus.py:284` |
| Message persistence | `delivery_mode=2` | `cvk_agent/eventbus.py:373` |
| Content type | `application/json` | `cvk_agent/eventbus.py:374` |

### 5.2 Event JSON Format

```json
{
  "eventId": "uuid-v4",
  "timestamp": "2025-01-01T00:00:00Z",
  "eventType": "VM_STARTED",
  "hostId": "host-001",
  "hostName": "cvk-node-1",
  "payload": {
    "vmName": "web-server-01",
    "vmUuid": "a1b2c3d4-..."
  }
}
```

> **Source:** `cvk_agent/eventbus.py:94-103`

### 5.3 Event Types

**VM Events:**
| Event Type | Description | Source |
|-----------|-------------|--------|
| `VM_STARTED` | VM started | `eventbus.py:58` |
| `VM_STOPPED` | VM stopped | `eventbus.py:59` |
| `VM_PAUSED` | VM paused | `eventbus.py:60` |
| `VM_RESUMED` | VM resumed | `eventbus.py:61` |
| `VM_SUSPENDED` | VM suspended to disk | `eventbus.py:62` |
| `VM_MIGRATED` | VM migration completed | `eventbus.py:63` |
| `VM_CREATED` | VM deployed | `eventbus.py:64` |
| `VM_DELETED` | VM deleted | `eventbus.py:65` |
| `VM_ERROR` | VM error occurred | `eventbus.py:66` |

**Host Events:**
| Event Type | Description | Source |
|-----------|-------------|--------|
| `HOST_UP` | Host online | `eventbus.py:68` |
| `HOST_DOWN` | Host offline | `eventbus.py:69` |
| `HOST_MAINTENANCE` | Host in maintenance | `eventbus.py:70` |
| `HOST_OVERLOAD` | Host overloaded | `eventbus.py:71` |

**Storage Events:**
| Event Type | Description | Source |
|-----------|-------------|--------|
| `STORAGE_LOW` | Storage low | `eventbus.py:73` |
| `STORAGE_FULL` | Storage full | `eventbus.py:74` |
| `STORAGE_ERROR` | Storage error | `eventbus.py:75` |

**Network Events:**
| Event Type | Description | Source |
|-----------|-------------|--------|
| `NETWORK_UP` | Network up | `eventbus.py:77` |
| `NETWORK_DOWN` | Network down | `eventbus.py:78` |
| `NETWORK_ERROR` | Network error | `eventbus.py:79` |

### 5.4 HTTP Event Fallback

When RabbitMQ is unavailable, events are sent via HTTP POST:
```
POST /cas/casrs/events
Content-Type: application/xml

<?xml version="1.0" encoding="UTF-8"?>
<event>
  <eventId>uuid</eventId>
  <timestamp>ISO8601</timestamp>
  <eventType>VM_STARTED</eventType>
  <hostId>host-001</hostId>
  <hostName>cvk-node-1</hostName>
  <payload>
    <vmName>web-server-01</vmName>
    <vmUuid>a1b2c3d4-...</vmUuid>
  </payload>
</event>
```

> **Source:** `cvk_agent/eventbus.py:173-236`

---

## 6. SCP File Transfer Protocol

| Parameter | Value | Source |
|-----------|-------|--------|
| Protocol | SCP over SSH (TCP 22) | `cvk_agent/scp.py:1-4` |
| Default username | `root` | `cvk_agent/scp.py:77` |
| Connect timeout | 30s | `cvk_agent/config.py:29` |
| Server alive interval | 60s | `cvk_agent/config.py:30` |
| Total wait time | 43200s (12h) | `cvk_agent/config.py:27` |
| Default cmd wait time | 600s (10 min) | `cvk_agent/config.py:28` |
| Strict host key checking | No | `cvk_agent/scp.py:272` |

Backends: paramiko (preferred) → subprocess (fallback) → mock (test)
> **Source:** `cvk_agent/scp.py:60-68`

---

## 7. Heap Beat Protocol

### 7.1 Heartbeat Flow

```
CVK Agent                          CVM Server
  │                                   │
  │ Every 30s:                        │
  │── POST /cas/casrs/nova/hostResource ──►│
  │   <hostHeartbeat>                 │
  │     <hostId>host-001</hostId>    │
  │     <cpuRate>12.5</cpuRate>      │
  │     <memoryRate>45.0</memoryRate>│
  │     <vmCount>3</vmCount>         │
  │   </hostHeartbeat>               │
  │                                   │
  │◄── 200/201/204 ──────────────────│ Success
  │◄── Non-2xx ──────────────────────│ Failure count++
  │                                   │
  │ After 120s of failures:           │
  │   cvm_connected = False           │
```

| Parameter | Value | Source |
|-----------|-------|--------|
| Interval | 30s | `cvk_agent/config.py:104` |
| Timeout before disconnected | 120s | `cvk_agent/config.py:105` |

> **Source:** `cvk_agent/heartbeat.py:38-143`

---

## 8. HTTP Status Codes

| Code | Meaning | When |
|------|---------|------|
| 200 | OK | Successful request with response body |
| 201 | Created | Resource created |
| 204 | No Content | Success with no body (health check, config operations) |
| 401 | Unauthorized | Missing or expired auth, returns WWW-Authenticate challenge |
| 403 | Forbidden | Invalid credentials, triggers auth retry loop |
| 404 | Not Found | Unknown endpoint or resource not found |
| 500 | Internal Server Error | Unexpected server error |

---

## 9. URL Format

### 9.1 CVM→CVK (Feign Client)

```
http://{cvk_ip}:{cvk_port}{path}
```

Example: `http://192.168.1.101:26165/compute/cpuInfo`
> **Source:** `cvk_agent/feign.py:218-224`

### 9.2 Client→CVM (REST API)

```
{scheme}://{host}:{port}/cas/casrs/{resource}/{action}
```

Examples:
- `http://localhost:8080/cas/casrs/operator/test`
- `https://localhost:8443/cas/casrs/nova/vmList`
> **Source:** `cvm_server/config.py:106`
