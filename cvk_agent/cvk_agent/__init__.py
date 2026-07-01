"""
H3C CVK Agent — 1:1 Python clone of cvk-agent-api.jar

Cloud Virtual Kernel (CVK) hypervisor agent. This is the agent that runs on
every CVK (KVM) hypervisor host and communicates with the CVM management
server via REST/XML over HTTP Digest auth.

Architecture:
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

Protocol layers:
  1. Transport:  HTTP/1.1 (Feign REST client, OkHttp3)
  2. Auth:       HTTP Digest (RFC 2617, MD5 algorithm)
  3. Encoding:   application/xml
  4. URI:        /cas/casrs prefix
  5. Async:      Task ID polling via /message/{taskId}
  6. Events:     RabbitMQ AMQP 0-9-1 (exchange type: direct)

Timeouts:
  - Feign connect: 10s
  - Feign read:    600s (10 min)
  - Slow task read: 172800s (48 hours)
  - OkHttp write:  600s
  - SCP wait:      43200s (12 hours)
  - SCP default:   600s (10 min)
  - SCP connect:   30s

Thread pool:
  - Core:     8
  - Core max: 100
  - Max:      200
  - Queue:    500

RabbitMQ:
  - vhost:    cloudMsgHost
  - exchange: cloud_vm_exchange_direct
  - queue:    cas_vm_event_nova_compute
  - port:     5672
  - user:     cloud / Cl@oud13

Requirements:
  - Python 3.10+
  - libvirt Python bindings (optional, for real VM control)
  - pika (optional, for RabbitMQ events)
  - paramiko (optional, for SCP transfers)
"""

from cvk_agent.config import CvkConfig
from cvk_agent.feign import CvkFeignClient
from cvk_agent.threadpool import CvkThreadPool
from cvk_agent.scp import ScpClient
from cvk_agent.host import HostRegistrar
from cvk_agent.domain import DomainManager
from cvk_agent.storage import StorageManager
from cvk_agent.network import NetworkManager
from cvk_agent.migration import MigrationCoordinator
from cvk_agent.heartbeat import HeartbeatService
from cvk_agent.eventbus import EventBus, RabbitMqEventBus
from cvk_agent.agent import CvkAgent

__version__ = "1.0.0"
__all__ = [
    "CvkConfig",
    "CvkFeignClient",
    "CvkThreadPool",
    "ScpClient",
    "HostRegistrar",
    "DomainManager",
    "StorageManager",
    "NetworkManager",
    "MigrationCoordinator",
    "HeartbeatService",
    "EventBus",
    "RabbitMqEventBus",
    "CvkAgent",
]
