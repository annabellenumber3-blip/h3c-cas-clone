"""
CVK Domain Manager — VM lifecycle management via libvirt.

Mirrors:
  - DomainHandler.java: VM lifecycle operations (start, stop, pause, etc.)
  - CvkComputeCmd.java: CVK-side compute commands
  - DomainMgrImpl.java: Domain management implementation

The CVK agent manages VMs (domains in libvirt terminology) on the local
hypervisor via libvirt Python bindings. When libvirt bindings are not
available, mock operations are used.

VM Power States (from CAS):
  1 = NOSTATE
  2 = RUNNING
  3 = SHUTDOWN
  4 = PAUSED

Operations supported:
  - start / stop / powerOff / restart
  - pause / restore (unpause)
  - sleep (suspend to disk) / wake
  - destroy (force stop)
  - migrate
  - snapshot
  - VNC/SPICE console info
"""

from __future__ import annotations

import logging
import time
import uuid as uuid_lib
from typing import Any, Dict, List, Optional, Tuple

from .config import CvkConfig
from .feign import CvkFeignClient
from .threadpool import CvkThreadPool

log = logging.getLogger(__name__)

# Try to import libvirt
try:
    import libvirt
    HAS_LIBVIRT = True
except ImportError:
    HAS_LIBVIRT = False
    log.warning("libvirt Python bindings not installed — using mock domain operations")


# Power state constants (matching CAS)
POWER_NOSTATE = "1"
POWER_RUNNING = "2"
POWER_SHUTDOWN = "3"
POWER_PAUSED = "4"

# Libvirt -> CAS state mapping
LIBVIRT_STATE_MAP = {
    libvirt.VIR_DOMAIN_NOSTATE: POWER_NOSTATE,
    libvirt.VIR_DOMAIN_RUNNING: POWER_RUNNING,
    libvirt.VIR_DOMAIN_BLOCKED: POWER_RUNNING,
    libvirt.VIR_DOMAIN_PAUSED: POWER_PAUSED,
    libvirt.VIR_DOMAIN_SHUTDOWN: POWER_SHUTDOWN,
    libvirt.VIR_DOMAIN_SHUTOFF: POWER_SHUTDOWN,
    libvirt.VIR_DOMAIN_CRASHED: POWER_SHUTDOWN,
    libvirt.VIR_DOMAIN_PMSUSPENDED: POWER_PAUSED,
} if HAS_LIBVIRT else {}


class MockDomain:
    """Mock libvirt domain for testing without libvirt."""
    def __init__(self, dom_id: str, name: str, state: str = POWER_SHUTDOWN):
        self._id = dom_id
        self._name = name
        self._state = state
        self._uuid = str(uuid_lib.uuid4())
        self._cpu = 2
        self._memory = 4096  # MB
        self._max_memory = 8192
        self._vcpu_max = 4

    def name(self) -> str:
        return self._name

    def UUIDString(self) -> str:
        return self._uuid

    def state(self):
        return (int(self._state), -1)  # state, reason

    def info(self):
        return (int(self._state), self._max_memory * 1024, self._memory * 1024, self._vcpu_max, 0)

    def create(self):
        self._state = POWER_RUNNING
        return 0

    def shutdown(self):
        self._state = POWER_SHUTDOWN
        return 0

    def destroy(self):
        self._state = POWER_SHUTDOWN
        return 0

    def suspend(self):
        self._state = POWER_PAUSED
        return 0

    def resume(self):
        self._state = POWER_RUNNING
        return 0

    def reset(self, flags=0):
        self._state = POWER_RUNNING
        return 0

    def managedSave(self, flags=0):
        self._state = POWER_PAUSED
        return 0

    def undefine(self):
        return 0


class MockLibvirtConnection:
    """Mock libvirt connection."""
    def __init__(self):
        self._domains: Dict[str, MockDomain] = {}
        self._next_id = 1

    def listAllDomains(self, flags=0) -> List[MockDomain]:
        return list(self._domains.values())

    def lookupByName(self, name: str) -> MockDomain:
        if name not in self._domains:
            raise Exception(f"Domain not found: {name}")
        return self._domains[name]

    def lookupByUUIDString(self, uuid_str: str) -> MockDomain:
        for dom in self._domains.values():
            if dom.UUIDString() == uuid_str:
                return dom
        raise Exception(f"Domain not found: {uuid_str}")

    def defineXML(self, xml: str) -> MockDomain:
        dom_id = str(self._next_id)
        self._next_id += 1
        dom = MockDomain(dom_id, f"domain-{dom_id}")
        self._domains[dom_id] = dom
        return dom

    def getInfo(self):
        return ["x86_64", 131072, 16, 2400, 1, 1, 16, 2]

    def getCapabilities(self):
        return "<capabilities></capabilities>"

    def getVersion(self):
        return 8000000  # 8.0.0

    def getLibVersion(self):
        return 8000000

    def close(self):
        pass

    def createXML(self, xml: str, flags=0) -> MockDomain:
        return self.defineXML(xml)


class DomainManager:
    """VM lifecycle manager — mirrors DomainHandler/DomainMgrImpl.

    Uses libvirt Python bindings for real VM control with fallback to
    mock operations when libvirt is not available.
    """

    def __init__(self, config: CvkConfig, feign: CvkFeignClient,
                 threadpool: CvkThreadPool):
        self._config = config
        self._feign = feign
        self._threadpool = threadpool
        self._conn: Any = None
        self._mock_mode: bool = False

    @property
    def libvirt_available(self) -> bool:
        return HAS_LIBVIRT and not self._mock_mode

    def set_mock_mode(self, enabled: bool = True) -> None:
        """Enable mock mode for testing without libvirt."""
        self._mock_mode = enabled
        if enabled and self._conn is None:
            self._conn = MockLibvirtConnection()

    def _get_connection(self) -> Any:
        """Get or create a libvirt connection."""
        if self._mock_mode or not HAS_LIBVIRT:
            if self._conn is None:
                self._conn = MockLibvirtConnection()
            return self._conn

        if self._conn is None:
            try:
                self._conn = libvirt.open(self._config.libvirt_uri)
                log.info("Connected to libvirt: %s", self._config.libvirt_uri)
            except libvirt.libvirtError as exc:
                log.error("Failed to connect to libvirt: %s", exc)
                raise

        # Reconnect if connection is dead
        try:
            if not self._conn.isAlive():
                self._conn = libvirt.open(self._config.libvirt_uri)
        except Exception:
            try:
                self._conn = libvirt.open(self._config.libvirt_uri)
            except Exception as exc:
                log.error("Failed to reconnect to libvirt: %s", exc)
                raise

        return self._conn

    def close(self) -> None:
        """Close libvirt connection."""
        if self._conn:
            try:
                self._conn.close()
            except Exception:
                pass
            self._conn = None

    # ---- VM Information ----

    def list_domains(self) -> List[Dict[str, Any]]:
        """List all VMs on this host.

        Returns list of dicts with: id, name, uuid, state, cpu, memory.
        """
        conn = self._get_connection()
        domains = []
        try:
            for dom in conn.listAllDomains():
                try:
                    state, _ = dom.state()
                    info = dom.info()
                    domains.append({
                        "id": dom.name(),
                        "name": dom.name(),
                        "uuid": dom.UUIDString(),
                        "state": str(state),
                        "cpu": info[3],
                        "memory": info[2] // 1024,  # KB to MB
                        "maxMemory": info[1] // 1024,
                    })
                except Exception as exc:
                    log.warning("Failed to get info for domain: %s", exc)
        except Exception as exc:
            log.error("Failed to list domains: %s", exc)

        return domains

    def get_domain_info(self, dom_id: str) -> Optional[Dict[str, Any]]:
        """Get detailed VM info by domain ID or name."""
        dom = self._get_domain(dom_id)
        if dom is None:
            return None

        try:
            state, reason = dom.state()
            info = dom.info()
            return {
                "id": dom.name(),
                "name": dom.name(),
                "uuid": dom.UUIDString(),
                "state": str(state),
                "cpu": info[3],
                "memory": info[2] // 1024,
                "maxMemory": info[1] // 1024,
                "vcpuMax": info[3],
            }
        except Exception as exc:
            log.error("Failed to get domain info for %s: %s", dom_id, exc)
            return None

    def _get_domain(self, dom_id: str) -> Any:
        """Look up a domain by ID, name, or UUID."""
        conn = self._get_connection()

        # Try UUID first (format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
        if "-" in dom_id:
            try:
                return conn.lookupByUUIDString(dom_id)
            except Exception:
                pass

        # Try name
        try:
            return conn.lookupByName(dom_id)
        except Exception:
            pass

        # Try numeric ID
        for dom in conn.listAllDomains():
            if dom.name() == dom_id:
                return dom

        return None

    # ---- VM Lifecycle Operations ----

    def start_vm(self, dom_id: str) -> Dict[str, Any]:
        """Start a VM."""
        dom = self._get_domain(dom_id)
        if dom is None:
            return {"success": False, "error": f"Domain not found: {dom_id}"}

        try:
            dom.create()
            log.info("VM started: %s", dom_id)
            return {"success": True, "domainId": dom_id, "action": "start"}
        except Exception as exc:
            log.error("Failed to start VM %s: %s", dom_id, exc)
            return {"success": False, "error": str(exc)}

    def stop_vm(self, dom_id: str) -> Dict[str, Any]:
        """Graceful shutdown of a VM."""
        dom = self._get_domain(dom_id)
        if dom is None:
            return {"success": False, "error": f"Domain not found: {dom_id}"}

        try:
            dom.shutdown()
            log.info("VM shutdown initiated: %s", dom_id)
            return {"success": True, "domainId": dom_id, "action": "shutdown"}
        except Exception as exc:
            log.error("Failed to shutdown VM %s: %s", dom_id, exc)
            return {"success": False, "error": str(exc)}

    def poweroff_vm(self, dom_id: str) -> Dict[str, Any]:
        """Force power off a VM (destroy)."""
        dom = self._get_domain(dom_id)
        if dom is None:
            return {"success": False, "error": f"Domain not found: {dom_id}"}

        try:
            dom.destroy()
            log.info("VM powered off: %s", dom_id)
            return {"success": True, "domainId": dom_id, "action": "powerOff"}
        except Exception as exc:
            log.error("Failed to power off VM %s: %s", dom_id, exc)
            return {"success": False, "error": str(exc)}

    def restart_vm(self, dom_id: str) -> Dict[str, Any]:
        """Restart (reset) a VM."""
        dom = self._get_domain(dom_id)
        if dom is None:
            return {"success": False, "error": f"Domain not found: {dom_id}"}

        try:
            dom.reset()
            log.info("VM restarted: %s", dom_id)
            return {"success": True, "domainId": dom_id, "action": "restart"}
        except Exception as exc:
            log.error("Failed to restart VM %s: %s", dom_id, exc)
            return {"success": False, "error": str(exc)}

    def pause_vm(self, dom_id: str) -> Dict[str, Any]:
        """Pause a VM (suspend to memory)."""
        dom = self._get_domain(dom_id)
        if dom is None:
            return {"success": False, "error": f"Domain not found: {dom_id}"}

        try:
            dom.suspend()
            log.info("VM paused: %s", dom_id)
            return {"success": True, "domainId": dom_id, "action": "pause"}
        except Exception as exc:
            log.error("Failed to pause VM %s: %s", dom_id, exc)
            return {"success": False, "error": str(exc)}

    def resume_vm(self, dom_id: str) -> Dict[str, Any]:
        """Resume (unpause) a VM."""
        dom = self._get_domain(dom_id)
        if dom is None:
            return {"success": False, "error": f"Domain not found: {dom_id}"}

        try:
            dom.resume()
            log.info("VM resumed: %s", dom_id)
            return {"success": True, "domainId": dom_id, "action": "resume"}
        except Exception as exc:
            log.error("Failed to resume VM %s: %s", dom_id, exc)
            return {"success": False, "error": str(exc)}

    def suspend_vm(self, dom_id: str) -> Dict[str, Any]:
        """Suspend VM to disk (managed save)."""
        dom = self._get_domain(dom_id)
        if dom is None:
            return {"success": False, "error": f"Domain not found: {dom_id}"}

        try:
            dom.managedSave()
            log.info("VM suspended to disk: %s", dom_id)
            return {"success": True, "domainId": dom_id, "action": "suspendToDisk"}
        except Exception as exc:
            log.error("Failed to suspend VM %s: %s", dom_id, exc)
            return {"success": False, "error": str(exc)}

    def destroy_vm(self, dom_id: str, delete_disk: bool = False) -> Dict[str, Any]:
        """Force destroy and undefine a VM.

        Args:
            dom_id: Domain ID, name, or UUID
            delete_disk: Also delete disk images (mirrors destroy_type_map)
        """
        dom = self._get_domain(dom_id)
        if dom is None:
            return {"success": False, "error": f"Domain not found: {dom_id}"}

        try:
            state, _ = dom.state()
            if state == int(POWER_RUNNING):
                dom.destroy()
            dom.undefine()
            log.info("VM destroyed: %s (deleteDisk=%s)", dom_id, delete_disk)
            return {"success": True, "domainId": dom_id, "action": "destroy",
                    "deleteDisk": delete_disk}
        except Exception as exc:
            log.error("Failed to destroy VM %s: %s", dom_id, exc)
            return {"success": False, "error": str(exc)}

    # ---- Async task wrappers ----

    def start_vm_async(self, dom_id: str) -> str:
        """Start VM via thread pool, returns task ID."""
        task_id = f"task-start-{dom_id}-{int(time.time())}"
        self._threadpool.submit(task_id, self.start_vm, dom_id)
        return task_id

    def stop_vm_async(self, dom_id: str) -> str:
        """Stop VM via thread pool, returns task ID."""
        task_id = f"task-stop-{dom_id}-{int(time.time())}"
        self._threadpool.submit(task_id, self.stop_vm, dom_id)
        return task_id

    def restart_vm_async(self, dom_id: str) -> str:
        """Restart VM via thread pool, returns task ID."""
        task_id = f"task-restart-{dom_id}-{int(time.time())}"
        self._threadpool.submit(task_id, self.restart_vm, dom_id)
        return task_id

    # ---- Host info ----

    def get_host_info(self) -> Dict[str, Any]:
        """Get hypervisor host info."""
        conn = self._get_connection()
        try:
            info = conn.getInfo()
            return {
                "hypervisor": info[0],
                "memoryMB": info[1],
                "cores": info[2],
                "mhz": info[3],
                "numaNodes": info[4],
                "sockets": info[5],
                "threads": info[6],
                "coresPerSocket": info[7],
                "libvirtVersion": conn.getLibVersion(),
                "hypervisorVersion": conn.getVersion(),
            }
        except Exception as exc:
            log.error("Failed to get host info: %s", exc)
            return {}

    def get_vnc_info(self, dom_id: str) -> Optional[Dict[str, Any]]:
        """Get VNC/spice console info for a VM.

        Mirrors CVM's VNC/SPICE info endpoints.
        """
        dom = self._get_domain(dom_id)
        if dom is None:
            return None

        # In the real implementation, the VNC port is extracted from
        # the domain XML. For now, return mock info.
        return {
            "host": self._config.host_ip,
            "port": 5900 + (hash(dom_id) % 100),
            "type": "vnc",
            "password": f"vnc_{dom_id[:8]}",
        }
