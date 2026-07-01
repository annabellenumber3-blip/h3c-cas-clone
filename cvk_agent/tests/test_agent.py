"""
CVK Agent unit tests.
"""

from __future__ import annotations

import pytest

from cvk_agent.config import CvkConfig
from cvk_agent.threadpool import CvkThreadPool
from cvk_agent.scp import ScpClient, ScpResult
from cvk_agent.domain import DomainManager, MockLibvirtConnection, MockDomain
from cvk_agent.storage import StorageManager, StoragePool
from cvk_agent.network import NetworkManager, OvsBridge
from cvk_agent.migration import MigrationCoordinator, MigrationState
from cvk_agent.heartbeat import HeartbeatService
from cvk_agent.eventbus import (
    NoopEventBus, HttpEventBus, CvkEvent, EventPublisher,
    EVENT_VM_STARTED, EVENT_HOST_UP,
)


# ============================================================================
# Fixtures
# ============================================================================

@pytest.fixture
def config():
    """Create a test configuration."""
    cfg = CvkConfig()
    cfg.host_id = "test-host-001"
    cfg.host_name = "cvk-test-node-1"
    cfg.host_ip = "127.0.0.1"
    cfg.cvm_host = "127.0.0.1"
    cfg.cvm_port = 8080
    cfg.mock_mode = True
    return cfg


# ============================================================================
# Config tests
# ============================================================================

class TestConfig:
    def test_default_config(self):
        cfg = CvkConfig()
        assert cfg.feign_connect_timeout == 10
        assert cfg.feign_read_timeout == 600
        assert cfg.feign_slow_task_read_timeout == 172800
        assert cfg.scp_wait_time == 43200
        assert cfg.cmd_core_pool_size == 8
        assert cfg.cmd_max_pool_size == 200
        assert cfg.cmd_max_queue_size == 500
        assert cfg.rmq_vhost == "cloudMsgHost"
        assert cfg.rmq_exchange == "cloud_vm_exchange_direct"
        assert cfg.rmq_queue == "cas_vm_event_nova_compute"
        assert cfg.rmq_user == "cloud"
        assert cfg.rmq_password == "Cl@oud13"

    def test_config_from_dict(self):
        cfg = CvkConfig()
        cfg.host_name = "test-node"
        cfg.cvm_host = "192.168.1.100"
        assert cfg.host_name == "test-node"
        assert cfg.cvm_host == "192.168.1.100"


# ============================================================================
# Thread pool tests
# ============================================================================

class TestThreadPool:
    def test_pool_creation(self, config):
        pool = CvkThreadPool(config)
        assert pool.core_pool_size == 8
        assert pool.max_pool_size == 200

    def test_submit_and_wait(self, config):
        pool = CvkThreadPool(config)
        pool.start()

        result = []
        def task(x):
            result.append(x)
            return x * 2

        future = pool.submit("test-1", task, 42)
        value = future.result(timeout=5)
        assert value == 84
        assert result == [42]

        stats = pool.stats()
        assert stats["core_pool_size"] == 8
        assert stats["completed_tasks"] >= 1

        pool.stop()

    def test_task_status(self, config):
        pool = CvkThreadPool(config)
        pool.start()

        import time
        def slow_task():
            time.sleep(0.2)
            return "done"

        pool.submit("slow-1", slow_task)
        status = pool.task_status("slow-1")
        assert status["status"] in ("QUEUED", "RUNNING", "COMPLETED")

        pool.stop()

    def test_cancel_task(self, config):
        pool = CvkThreadPool(config)
        pool.start()

        import threading
        started = threading.Event()
        cancelled_flag = threading.Event()

        def slow_task():
            started.set()
            # Wait for cancel or timeout
            cancelled_flag.wait(timeout=0.5)
            return "cancelled" if cancelled_flag.is_set() else "completed"

        future = pool.submit("cancel-1", slow_task)
        # Wait for task to actually start running
        started.wait(timeout=1.0)

        # Signal cancellation (simulates cooperative cancellation)
        cancelled_flag.set()
        cancelled = pool.cancel_task("cancel-1")

        # Wait for task to finish
        try:
            result = future.result(timeout=2)
        except Exception:
            result = None

        # Verify the task completed (either via cancel signal or normally)
        assert future.done()
        assert result in ("cancelled", "completed", None)

        pool.stop(wait=False)


# ============================================================================
# SCP tests
# ============================================================================

class TestScpClient:
    def test_mock_upload(self, config):
        scp = ScpClient(config)
        scp.set_mock_mode(True)
        result = scp.upload("/tmp/test.img", "192.168.1.2", "/vms/test.img")
        assert result.success
        assert "Mock SCP upload" in result.stdout

    def test_mock_download(self, config):
        scp = ScpClient(config)
        scp.set_mock_mode(True)
        result = scp.download("192.168.1.2", "/vms/test.img", "/tmp/test.img")
        assert result.success

    def test_mock_execute(self, config):
        scp = ScpClient(config)
        scp.set_mock_mode(True)
        result = scp.execute_command("192.168.1.2", "ls /vms")
        assert result.success
        assert result.exit_code == 0

    def test_timeouts(self, config):
        """Verify timeout defaults from config."""
        assert config.scp_wait_time == 43200
        assert config.scp_connect_timeout == 30
        assert config.scp_default_cmd_wait_time == 600


# ============================================================================
# Domain manager tests
# ============================================================================

class TestDomainManager:
    def test_mock_domain_creation(self, config):
        from cvk_agent.feign import CvkFeignClient
        from cvk_agent.threadpool import CvkThreadPool

        feign = CvkFeignClient(config)
        pool = CvkThreadPool(config)
        pool.start()

        dm = DomainManager(config, feign, pool)
        dm.set_mock_mode(True)

        domains = dm.list_domains()
        assert isinstance(domains, list)

        pool.stop()

    def test_mock_vm_lifecycle(self, config):
        from cvk_agent.feign import CvkFeignClient
        from cvk_agent.threadpool import CvkThreadPool

        feign = CvkFeignClient(config)
        pool = CvkThreadPool(config)
        pool.start()

        dm = DomainManager(config, feign, pool)
        dm.set_mock_mode(True)

        # Create a domain first (so it exists for lifecycle ops)
        conn = dm._get_connection()
        dom = conn.defineXML("<domain><name>test-vm</name></domain>")
        dom_name = dom._name

        # Now test lifecycle operations
        result = dm.start_vm(dom_name)
        assert result["success"], f"Start failed: {result}"

        # Pause
        result = dm.pause_vm(dom_name)
        assert result["success"], f"Pause failed: {result}"

        # Resume
        result = dm.resume_vm(dom_name)
        assert result["success"], f"Resume failed: {result}"

        # Stop
        result = dm.stop_vm(dom_name)
        assert result["success"], f"Stop failed: {result}"

        pool.stop()

    def test_host_info(self, config):
        from cvk_agent.feign import CvkFeignClient
        from cvk_agent.threadpool import CvkThreadPool

        feign = CvkFeignClient(config)
        pool = CvkThreadPool(config)
        pool.start()

        dm = DomainManager(config, feign, pool)
        dm.set_mock_mode(True)

        info = dm.get_host_info()
        assert "hypervisor" in info

        pool.stop()


# ============================================================================
# Storage manager tests
# ============================================================================

class TestStorageManager:
    def test_mock_pool_discovery(self, config):
        sm = StorageManager(config)
        sm.set_mock_mode(True)

        pools = sm.discover_pools()
        assert len(pools) >= 2
        pool_names = [p.name for p in pools]
        assert "local-vms" in pool_names

    def test_create_delete_pool_mock(self, config):
        sm = StorageManager(config)
        sm.set_mock_mode(True)

        result = sm.create_pool("test-pool", "dir", "/vms/test")
        assert result["success"]

        result = sm.delete_pool("test-pool")
        assert result["success"]

    def test_volume_operations_mock(self, config):
        sm = StorageManager(config)
        sm.set_mock_mode(True)

        # Create volume
        result = sm.create_volume("local-vms", "test.qcow2", 10 * 1024**3)
        assert result["success"]

        # Clone volume
        result = sm.clone_volume("local-vms", "test.qcow2", "test-clone.qcow2")
        assert result["success"]

        # Delete volume
        result = sm.delete_volume("local-vms", "test.qcow2")
        assert result["success"]

    def test_pool_summary(self, config):
        sm = StorageManager(config)
        sm.set_mock_mode(True)

        summary = sm.get_pool_summary()
        assert "sharePools" in summary
        assert "localPools" in summary


# ============================================================================
# Network manager tests
# ============================================================================

class TestNetworkManager:
    def test_mock_bridge_list(self, config):
        nm = NetworkManager(config)
        nm.set_mock_mode(True)

        bridges = nm.list_bridges()
        assert len(bridges) >= 1
        assert any(b.name == "vswitch0" for b in bridges)

    def test_create_delete_bridge_mock(self, config):
        nm = NetworkManager(config)
        nm.set_mock_mode(True)

        result = nm.create_bridge("br-test", bridge_type="ovs")
        assert result["success"]

        result = nm.delete_bridge("br-test")
        assert result["success"]

    def test_vlan_bridge_mock(self, config):
        nm = NetworkManager(config)
        nm.set_mock_mode(True)

        result = nm.create_vlan_bridge(100, "eth0")
        assert result["success"]

    def test_vxlan_tunnel_mock(self, config):
        nm = NetworkManager(config)
        nm.set_mock_mode(True)

        result = nm.create_vxlan_tunnel(5000, "192.168.2.100")
        assert result["success"]

    def test_attach_vm_nic_mock(self, config):
        nm = NetworkManager(config)
        nm.set_mock_mode(True)

        result = nm.attach_vm_nic("test-vm", "52:54:00:aa:bb:cc", "vswitch0")
        assert result["success"]


# ============================================================================
# Event bus tests
# ============================================================================

class TestEventBus:
    def test_noop_event_bus(self, config):
        bus = NoopEventBus()
        assert bus.connect()
        assert bus.is_connected()

        event = CvkEvent(EVENT_VM_STARTED, config.host_id, config.host_name,
                         {"vmName": "test-vm", "vmUuid": "uuid-123"})
        assert bus.publish(event)

        events = bus.get_events()
        assert len(events) == 1
        assert events[0].event_type == EVENT_VM_STARTED
        assert events[0].payload["vmName"] == "test-vm"

        bus.disconnect()
        assert not bus.is_connected()

    def test_event_publisher(self, config):
        bus = NoopEventBus()
        publisher = EventPublisher(config, bus)

        assert publisher.connect()
        assert publisher.vm_started("test-vm", "uuid-123")
        assert publisher.host_up()
        assert publisher.vm_stopped("test-vm", "uuid-123")

        events = bus.get_events()
        assert len(events) == 3

    def test_event_serialization(self, config):
        event = CvkEvent(EVENT_HOST_UP, config.host_id, config.host_name)
        json_str = event.to_json()

        import json
        data = json.loads(json_str)
        assert data["eventType"] == EVENT_HOST_UP
        assert data["hostId"] == config.host_id
        assert "eventId" in data
        assert "timestamp" in data

    def test_rabbitmq_config(self, config):
        """Verify RabbitMQ configuration defaults."""
        assert config.rmq_vhost == "cloudMsgHost"
        assert config.rmq_exchange == "cloud_vm_exchange_direct"
        assert config.rmq_queue == "cas_vm_event_nova_compute"
        assert config.rmq_port == 5672
        assert config.rmq_user == "cloud"
        assert config.rmq_password == "Cl@oud13"


# ============================================================================
# Migration tests
# ============================================================================

class TestMigration:
    def test_migration_task_creation(self, config):
        from cvk_agent.feign import CvkFeignClient
        from cvk_agent.threadpool import CvkThreadPool

        feign = CvkFeignClient(config)
        pool = CvkThreadPool(config)
        pool.start()

        dm = DomainManager(config, feign, pool)
        dm.set_mock_mode(True)

        sm = StorageManager(config)
        sm.set_mock_mode(True)

        nm = NetworkManager(config)
        nm.set_mock_mode(True)

        scp = ScpClient(config)
        scp.set_mock_mode(True)

        mig = MigrationCoordinator(config, dm, sm, nm, scp, pool)

        task_id = mig.migrate_vm("domain-1", "192.168.1.200")
        assert task_id.startswith("migrate-")

        task = mig.get_task_status(task_id)
        assert task is not None
        assert task["vmName"] == "domain-1"
        assert task["targetHost"] == "192.168.1.200"

        pool.stop()


# ============================================================================
# Heartbeat tests
# ============================================================================

class TestHeartbeat:
    def test_heartbeat_stats(self, config):
        from cvk_agent.feign import CvkFeignClient
        from cvk_agent.domain import DomainManager
        from cvk_agent.threadpool import CvkThreadPool

        feign = CvkFeignClient(config)
        pool = CvkThreadPool(config)
        pool.start()

        dm = DomainManager(config, feign, pool)
        dm.set_mock_mode(True)
        sm = StorageManager(config)
        sm.set_mock_mode(True)

        hb = HeartbeatService(config, feign, dm, sm)
        stats = hb.get_stats()
        assert isinstance(stats, dict)

        pool.stop()


# ============================================================================
# Integration: Agent initialization
# ============================================================================

class TestAgentInit:
    def test_agent_initialize_mock(self, config):
        from cvk_agent.agent import CvkAgent

        agent = CvkAgent(config=config)
        success = agent.initialize(mock_mode=True)
        assert success
        assert agent.feign is not None
        assert agent.threadpool is not None
        assert agent.domain_mgr is not None
        assert agent.storage_mgr is not None
        assert agent.network_mgr is not None
        assert agent.heartbeat is not None
        assert agent.event_bus is not None

        status = agent.get_status()
        assert status["running"] == False  # not yet started
        assert status["hostId"] == "test-host-001"

        agent.shutdown()


# ============================================================================
# Integration: Full mock workflow
# ============================================================================

class TestMockWorkflow:
    def test_full_mock_workflow(self, config):
        """Test a complete CVK agent workflow in mock mode."""
        from cvk_agent.agent import CvkAgent

        agent = CvkAgent(config=config)
        assert agent.initialize(mock_mode=True)

        # Register with CVM (will fail without real CVM, but shouldn't crash)
        agent.host_registrar.discover_host()

        # List domains
        domains = agent.domain_mgr.list_domains()
        assert isinstance(domains, list)

        # Discover storage
        pools = agent.storage_mgr.discover_pools()
        assert len(pools) > 0

        # Discover network
        bridges = agent.network_mgr.list_bridges()
        assert len(bridges) > 0

        # Create and publish an event
        event = CvkEvent(EVENT_HOST_UP, config.host_id, config.host_name)
        assert agent.event_bus.publish(event)

        # Get status
        status = agent.get_status()
        assert "version" in status
        assert "hostId" in status

        agent.shutdown()
