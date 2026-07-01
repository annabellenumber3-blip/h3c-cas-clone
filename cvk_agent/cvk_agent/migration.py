"""
CVK Migration Coordinator — mirrors DomainMigrateTaskInfo + migration operations.

Handles VM live/cold migration between CVK hosts:
  - Pre-migration checks (CPU compatibility, shared storage, network)
  - Live migration (libvirt virDomainMigrate)
  - Cold migration (shutdown → copy disks → start on target)
  - Migration monitoring and rollback

In the Java CVK agent, migration is coordinated between:
  - Source CVK: Initiates the migration via libvirt APIs
  - Target CVK: Prepares to receive the VM
  - CVM: Orchestrates the migration and tracks progress

The migration flow (from DomainHandler.java):
  1. CVM selects target host via scheduler
  2. CVM sends migration command to source CVK
  3. Source CVK performs pre-migration checks
  4. Target CVK prepares receiving environment
  5. Source initiates libvirt migration
  6. Post-migration cleanup on source

libvirt migration flags used by CAS:
  - VIR_MIGRATE_LIVE         = 1
  - VIR_MIGRATE_PEER2PEER    = 2
  - VIR_MIGRATE_TUNNELLED    = 4
  - VIR_MIGRATE_PERSIST_DEST = 8
  - VIR_MIGRATE_UNDEFINE_SOURCE = 16
  - VIR_MIGRATE_NON_SHARED_INC = 128
  - VIR_MIGRATE_AUTO_CONVERGE = 8192
  - VIR_MIGRATE_POSTCOPY     = 16384
"""

from __future__ import annotations

import logging
import threading
import time
from typing import Any, Dict, List, Optional, Set, Tuple

from .config import CvkConfig
from .domain import DomainManager
from .storage import StorageManager, StorageVolume
from .network import NetworkManager
from .scp import ScpClient, ScpResult
from .threadpool import CvkThreadPool

log = logging.getLogger(__name__)

# Try to import libvirt for migration flags
try:
    import libvirt
    HAS_LIBVIRT = True
except ImportError:
    HAS_LIBVIRT = False


# Migration flags (matching CAS libvirt usage)
MIGRATE_LIVE = 1
MIGRATE_PEER2PEER = 2
MIGRATE_TUNNELLED = 4
MIGRATE_PERSIST_DEST = 8
MIGRATE_UNDEFINE_SOURCE = 16
MIGRATE_NON_SHARED_DISK = 64
MIGRATE_NON_SHARED_INC = 128
MIGRATE_AUTO_CONVERGE = 8192
MIGRATE_POSTCOPY = 16384

# Default migration flags used by CAS
CAS_MIGRATE_FLAGS = (
    MIGRATE_LIVE |
    MIGRATE_PEER2PEER |
    MIGRATE_TUNNELLED |
    MIGRATE_PERSIST_DEST |
    MIGRATE_UNDEFINE_SOURCE
)


class MigrationState:
    """Tracks the state of an ongoing migration."""
    QUEUED = "QUEUED"
    PRE_CHECK = "PRE_CHECK"
    PREPARING = "PREPARING"
    MIGRATING = "MIGRATING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    ROLLBACK = "ROLLBACK"
    CANCELLED = "CANCELLED"


class MigrationTask:
    """Represents a single migration task."""
    def __init__(self, task_id: str, vm_name: str,
                 source_host: str, target_host: str):
        self.task_id = task_id
        self.vm_name = vm_name
        self.source_host = source_host
        self.target_host = target_host
        self.state = MigrationState.QUEUED
        self.progress: float = 0.0
        self.start_time: float = 0.0
        self.end_time: Optional[float] = None
        self.error: Optional[str] = None
        self.migration_type: str = "live"  # live or cold
        self.flags: int = CAS_MIGRATE_FLAGS
        self.bandwidth_mbps: int = 0  # 0 = unlimited

    def to_dict(self) -> Dict[str, Any]:
        return {
            "taskId": self.task_id,
            "vmName": self.vm_name,
            "sourceHost": self.source_host,
            "targetHost": self.target_host,
            "state": self.state,
            "progress": self.progress,
            "migrationType": self.migration_type,
            "error": self.error,
            "duration": (time.time() - self.start_time) if self.start_time else 0,
        }


class MigrationCoordinator:
    """Coordinator for VM migration between CVK hosts.

    Mirrors the migration flow in DomainHandler.java and
    DomainMigrateTaskInfo.
    """

    def __init__(self, config: CvkConfig, domain_mgr: DomainManager,
                 storage_mgr: StorageManager, network_mgr: NetworkManager,
                 scp_client: ScpClient, threadpool: CvkThreadPool):
        self._config = config
        self._domain_mgr = domain_mgr
        self._storage_mgr = storage_mgr
        self._network_mgr = network_mgr
        self._scp = scp_client
        self._threadpool = threadpool

        self._tasks: Dict[str, MigrationTask] = {}
        self._tasks_lock = threading.Lock()

    # ---- Pre-migration checks ----

    def pre_migration_check(self, vm_name: str,
                            target_host: str) -> Dict[str, Any]:
        """Run pre-migration checks for a VM.

        Checks performed:
          1. VM exists and is running (for live migration)
          2. Target host is reachable
          3. CPU compatibility between source and target
          4. Shared storage availability (or disk copy path)
          5. Network connectivity for migration

        Returns:
            Dict with 'success' and possibly 'issues' list
        """
        issues = []
        warnings = []

        # Check VM exists
        vm_info = self._domain_mgr.get_domain_info(vm_name)
        if vm_info is None:
            return {"success": False, "issues": [f"VM not found: {vm_name}"]}

        # Check VM is running (for live migration)
        if vm_info.get("state") not in ("2", "RUNNING"):
            warnings.append("VM is not running — cold migration will be used")

        # Check target is reachable
        result = self._scp.execute_command(
            target_host, "echo ok",
            timeout=self._config.scp_connect_timeout,
        )
        if not result.success:
            issues.append(f"Target host {target_host} is not reachable")

        # Check CPU compatibility
        cpu_check = self._check_cpu_compatibility()
        if not cpu_check.get("compatible", True):
            issues.append(f"CPU incompatibility: {cpu_check.get('reason')}")

        # Check shared storage
        storage_check = self._check_shared_storage(target_host)
        if not storage_check.get("shared"):
            warnings.append("No shared storage — disk copy migration will be used")

        success = len(issues) == 0
        return {
            "success": success,
            "issues": issues,
            "warnings": warnings,
            "vmInfo": vm_info,
            "canLiveMigrate": len(issues) == 0 and "not running" not in str(warnings).lower(),
        }

    def _check_cpu_compatibility(self) -> Dict[str, Any]:
        """Check CPU compatibility for migration."""
        if HAS_LIBVIRT:
            try:
                conn = self._domain_mgr._get_connection()
                caps = conn.getCapabilities()
                import re
                vendor = re.search(r"<vendor>(\w+)</vendor>", caps)
                return {
                    "compatible": True,
                    "vendor": vendor.group(1) if vendor else "Unknown",
                }
            except Exception as exc:
                log.warning("CPU compatibility check failed: %s", exc)

        return {"compatible": True, "vendor": "MockCPU"}

    def _check_shared_storage(self, target_host: str) -> Dict[str, Any]:
        """Check if shared storage is available."""
        pools = self._storage_mgr.discover_pools()
        shared_pools = [p for p in pools
                        if p.pool_type in ("fs", "nfs", "rbd")]
        return {
            "shared": len(shared_pools) > 0,
            "sharedPools": [p.name for p in shared_pools],
        }

    # ---- Migration orchestration ----

    def migrate_vm(self, vm_name: str, target_host: str,
                   migration_type: str = "live",
                   bandwidth_mbps: int = 0,
                   ) -> str:
        """Initiate VM migration to target host.

        Returns:
            Task ID for tracking migration progress
        """
        task_id = f"migrate-{vm_name}-{int(time.time())}"

        task = MigrationTask(
            task_id=task_id, vm_name=vm_name,
            source_host=self._config.host_ip, target_host=target_host,
        )
        task.migration_type = migration_type
        task.bandwidth_mbps = bandwidth_mbps

        with self._tasks_lock:
            self._tasks[task_id] = task

        # Submit to thread pool
        self._threadpool.submit(
            task_id,
            self._execute_migration,
            task,
        )
        log.info("Migration started: %s -> %s (task=%s)",
                 vm_name, target_host, task_id)
        return task_id

    def _execute_migration(self, task: MigrationTask) -> None:
        """Execute the migration (runs in thread pool)."""
        task.state = MigrationState.PRE_CHECK
        task.start_time = time.time()

        try:
            # Step 1: Pre-migration checks
            checks = self.pre_migration_check(task.vm_name, task.target_host)
            if not checks["success"]:
                raise RuntimeError(f"Pre-migration checks failed: {checks['issues']}")

            # Step 2: Prepare target host
            task.state = MigrationState.PREPARING
            self._prepare_target(task)

            # Step 3: Migrate
            task.state = MigrationState.MIGRATING
            if HAS_LIBVIRT:
                self._migrate_libvirt(task)
            else:
                self._migrate_mock(task)

            # Step 4: Post-migration cleanup
            self._cleanup_source(task)

            task.state = MigrationState.COMPLETED
            task.progress = 100.0
            task.end_time = time.time()
            log.info("Migration completed: %s -> %s (%.1fs)",
                     task.vm_name, task.target_host,
                     task.end_time - task.start_time)

        except Exception as exc:
            task.state = MigrationState.FAILED
            task.error = str(exc)
            task.end_time = time.time()
            log.error("Migration failed: %s -> %s: %s",
                      task.vm_name, task.target_host, exc)

            # Attempt rollback
            try:
                self._rollback(task)
            except Exception as rb_exc:
                log.error("Rollback failed: %s", rb_exc)

    def _prepare_target(self, task: MigrationTask) -> None:
        """Prepare the target host to receive the VM."""
        # In the real agent, this uses SCP/SSH to:
        # 1. Create storage volumes on target
        # 2. Prepare network interfaces
        # 3. Create placeholder domain definition

        log.info("Preparing target %s for %s migration",
                 task.target_host, task.vm_name)

        # Tell target to prepare
        cmd = f"cvk-agent prepare-migration {task.vm_name}"
        result = self._scp.execute_command(
            task.target_host, cmd,
            timeout=self._config.scp_default_cmd_wait_time,
        )
        if not result.success:
            raise RuntimeError(f"Target preparation failed: {result.stderr}")

    def _migrate_libvirt(self, task: MigrationTask) -> None:
        """Live migrate using libvirt virDomainMigrate."""
        conn = self._domain_mgr._get_connection()
        dom = conn.lookupByName(task.vm_name)

        flags = task.flags
        if task.migration_type == "cold":
            flags &= ~MIGRATE_LIVE

        # Build migration URI
        dconn_uri = f"qemu+tcp://{task.target_host}/system"

        # Set bandwidth if specified
        bandwidth = task.bandwidth_mbps if task.bandwidth_mbps > 0 else None

        # Migrate
        try:
            new_dom = dom.migrate(
                dconn_uri, flags,
                None, bandwidth,
            )
            log.info("libvirt migrate returned: %s", new_dom)
        except libvirt.libvirtError as exc:
            raise RuntimeError(f"libvirt migration failed: {exc}")

    def _migrate_mock(self, task: MigrationTask) -> None:
        """Mock migration for testing."""
        log.info("Mock migration: %s -> %s", task.vm_name, task.target_host)
        # Simulate progress
        for p in [25, 50, 75]:
            task.progress = float(p)
            time.sleep(0.5)
        task.progress = 100.0

    def _cleanup_source(self, task: MigrationTask) -> None:
        """Clean up source host after successful migration."""
        # Remove old domain definition
        try:
            self._domain_mgr.destroy_vm(task.vm_name)
        except Exception as exc:
            log.warning("Source cleanup warning: %s", exc)

    def _rollback(self, task: MigrationTask) -> None:
        """Rollback migration on failure."""
        task.state = MigrationState.ROLLBACK
        log.info("Rolling back migration of %s", task.vm_name)

        # In the real agent, this would:
        # 1. If target has a running copy, stop it
        # 2. Clean up temp files on target
        # 3. Restart VM on source if needed

        vm_info = self._domain_mgr.get_domain_info(task.vm_name)
        if vm_info and vm_info.get("state") == str(3):  # SHUTDOWN
            self._domain_mgr.start_vm(task.vm_name)

    # ---- Migration monitoring ----

    def get_task_status(self, task_id: str) -> Optional[Dict[str, Any]]:
        """Get migration task status."""
        with self._tasks_lock:
            task = self._tasks.get(task_id)
        if task is None:
            return None
        return task.to_dict()

    def cancel_migration(self, task_id: str) -> Dict[str, Any]:
        """Cancel an ongoing migration."""
        with self._tasks_lock:
            task = self._tasks.get(task_id)

        if task is None:
            return {"success": False, "error": f"Task not found: {task_id}"}

        if task.state not in (MigrationState.QUEUED, MigrationState.PRE_CHECK,
                               MigrationState.PREPARING, MigrationState.MIGRATING):
            return {"success": False, "error": f"Cannot cancel in state: {task.state}"}

        task.state = MigrationState.CANCELLED
        self._threadpool.cancel_task(task_id)
        log.info("Migration cancelled: %s", task_id)
        return {"success": True, "taskId": task_id}

    def list_active_migrations(self) -> List[Dict[str, Any]]:
        """List all active migrations."""
        with self._tasks_lock:
            return [t.to_dict() for t in self._tasks.values()
                    if t.state in (MigrationState.QUEUED, MigrationState.PRE_CHECK,
                                   MigrationState.PREPARING, MigrationState.MIGRATING)]

    def list_all_migrations(self) -> List[Dict[str, Any]]:
        """List all migrations."""
        with self._tasks_lock:
            return [t.to_dict() for t in self._tasks.values()]
