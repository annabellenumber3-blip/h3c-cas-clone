# H3C CVK Agent — 1:1 Python Clone of cvk-agent-api.jar

CVK (Cloud Virtual Kernel) hypervisor agent that runs on each KVM hypervisor
host in an H3C CAS (Cloud Automation System) deployment.

**Reverse-engineered from:**
- `cvk-agent-api.jar` (Java Spring Boot + Feign + OkHttp)
- `FeignConfiguration.java` (HTTP client timeouts, connection pooling)
- `FeignClient.java` (Cached client builder, IP:port URL format)
- `CvkComputeCmd.java` (Feign REST interface for CVK-side endpoints)
- `DomainHandler.java` (VM lifecycle, migration)
- `NetworkController.java` (OVS bridge/VLAN/VXLAN management)
- `CvkAgentTaskHandler.java` (Host registration, task dispatch)
- `cvk_agent.conf` (Configuration key-value pairs)
- `cvd-ds` / `libcvd.h` (Storage management API)
- `cas_cvk-version` (Version V700R003B06D005 / R0785P03 Enterprise)

## Architecture

```
CVM (Management)               CVK Hypervisor Host
┌──────────────────┐           ┌─────────────────────────┐
│  CVM REST API     │  REST     │  cvk_agent (this)       │
│  port 8080/8443   │◄─XML────►│  ┌─ cvkagentd daemon    │
│  HTTP Digest Auth │  Feign   │  ├─ Feign REST client   │
│                   │  client  │  ├─ SCP file transfer   │
│  RabbitMQ         │◄─────────│  ├─ libvirtd (QEMU/KVM) │
│  event bus        │  events  │  ├─ Open vSwitch (OVS)  │
└──────────────────┘           │  ├─ cvd-ds (storage)    │
                               │  └─ RabbitMQ client     │
                               └─────────────────────────┘
```

## Key Config (from cvk_agent.conf)

| Parameter | Value | Description |
|-----------|-------|-------------|
| FEIGN_CONNECT_TIMEOUT | 10s | Connection timeout |
| FEIGN_READ_TIMEOUT | 600s (10min) | Read timeout |
| FEIGN_SLOW_TASK_READ_TIMEOUT | 172800s (48h) | Slow task timeout |
| FEIGN_OK_HTTP_WRITE_TIMEOUT | 600s | Write timeout |
| SCP_WAIT_TIME | 43200s (12h) | SCP wait time |
| SCP_CONNECT_TIMEOUT | 30s | SCP connect timeout |
| CMD_CORE_POOL_SIZE | 8 | Thread pool core |
| CMD_MAX_POOL_SIZE | 200 | Thread pool max |
| CMD_MAX_QUEUE_SIZE | 500 | Queue capacity |
| RMQ_VHOST | cloudMsgHost | RabbitMQ vhost |
| RMQ_EXCHANGE | cloud_vm_exchange_direct | Exchange |
| RMQ_QUEUE | cas_vm_event_nova_compute | Queue |
| RMQ_USER | cloud | RabbitMQ user |
| RMQ_PASSWORD | Cl@oud13 | RabbitMQ password |

## Package Structure

```
cvk_agent/
├── __init__.py         # Public API exports
├── __main__.py         # Entry point: python -m cvk_agent
├── agent.py            # Main CvkAgent daemon orchestrator
├── config.py           # CvkConfig — cvk_agent.conf parser
├── feign.py            # CvkFeignClient — REST/HTTP Digest client
├── threadpool.py       # CvkThreadPool — thread pool manager
├── scp.py              # ScpClient — SCP file transfer
├── host.py             # HostRegistrar — host registration/discovery
├── domain.py           # DomainManager — VM lifecycle via libvirt
├── storage.py          # StorageManager — pool/volume management
├── network.py          # NetworkManager — OVS bridge/VLAN/VXLAN
├── migration.py        # MigrationCoordinator — VM live/cold migration
├── heartbeat.py        # HeartbeatService — health reporting to CVM
├── eventbus.py         # RabbitMqEventBus + HttpEventBus + NoopEventBus
├── cvkagentd.service   # systemd service file
├── pytest.ini
└── tests/
    ├── __init__.py
    └── test_agent.py   # Comprehensive tests
```

## Quick Start

### Install

```bash
pip install -e /home/kali/Downloads/h3c/h3c-cas-clone/cvk_agent
# Or just run directly (no install needed):
cd /home/kali/Downloads/h3c/h3c-cas-clone/cvk_agent
python -m cvk_agent --mock --status
```

### Run Tests

```bash
cd /home/kali/Downloads/h3c/h3c-cas-clone/cvk_agent
python -m pytest tests/ -v
```

### Run in Mock Mode

```bash
python -m cvk_agent --mock --status
```

### Run as systemd Service

```bash
sudo cp cvkagentd.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable cvkagentd
sudo systemctl start cvkagentd
```

## Usage Examples

```python
from cvk_agent import CvkAgent, CvkConfig

# Create agent
config = CvkConfig()
config.host_name = "cvk-node-1"
config.cvm_host = "192.168.1.100"

agent = CvkAgent(config=config)
agent.initialize(mock_mode=True)

# VM lifecycle
result = agent.domain_mgr.start_vm("my-vm")
result = agent.domain_mgr.pause_vm("my-vm")
result = agent.domain_mgr.resume_vm("my-vm")

# Storage
pools = agent.storage_mgr.discover_pools()
vol = agent.storage_mgr.create_volume("local-vms", "disk.qcow2", 10*1024**3)

# Network
bridges = agent.network_mgr.list_bridges()
agent.network_mgr.create_vxlan_tunnel(5000, "192.168.2.100")

# Migration
task_id = agent.migration.migrate_vm("my-vm", "192.168.1.200")

# Events
agent.event_publisher.vm_started("my-vm", "uuid-123")

agent.shutdown()
```

## Mock Backends

All subsystems support mock mode for testing without hardware:
- **libvirt**: MockDomain + MockLibvirtConnection
- **OVS**: Mock bridge/port management via dicts
- **Storage**: Mock pools and volumes in memory
- **SCP**: Returns success without real SSH
- **RabbitMQ**: NoopEventBus with in-memory event storage
- **HTTP**: CvkFeignClient uses urllib3 (real HTTP but with mock CVM)

Enable with: `agent.initialize(mock_mode=True)` or `python -m cvk_agent --mock`

## License

Reverse-engineered for interoperability. No H3C proprietary code is included.
