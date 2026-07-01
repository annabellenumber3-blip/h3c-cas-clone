"""
Mock data store for CVM server.
In production, this would be backed by PostgreSQL (vservice) + MySQL (cas_cic).
For now, we use in-memory Python dicts that mirror the database tables.
"""
from __future__ import annotations

import copy
import random
import threading
import time
import uuid as uuid_mod
from typing import Any, Dict, List, Optional


# ============================================================================
# In-memory data stores (mirrors DB tables)
# ============================================================================
class DataStore:
    """Thread-safe in-memory data store."""
    
    _lock = threading.RLock()
    _id_counter = 1000

    def __init__(self):
        self.hostpools: Dict[str, Dict[str, Any]] = {}
        self.clusters: Dict[str, Dict[str, Any]] = {}
        self.hosts: Dict[str, Dict[str, Any]] = {}
        self.vms: Dict[str, Dict[str, Any]] = {}
        self.tasks: Dict[str, Dict[str, Any]] = {}
        self.events: List[Dict[str, Any]] = []
        self._init_mock_data()

    def _next_id(self, prefix: str = "") -> str:
        with self._lock:
            self._id_counter += 1
            return f"{prefix}{self._id_counter}"

    def _init_mock_data(self):
        """Initialize with realistic mock data."""
        # Host pools
        self.hostpools["pool-001"] = {
            "id": "pool-001", "name": "DefaultPool", "title": "Default Host Pool",
        }
        self.hostpools["pool-002"] = {
            "id": "pool-002", "name": "GPUPool", "title": "GPU Host Pool",
        }

        # Clusters
        self.clusters["cluster-001"] = {
            "id": "cluster-001", "name": "Cluster-01", "hostPoolId": "pool-001",
            "enableHa": 1, "enableLb": 1, "drsEnableTime": 0,
        }
        self.clusters["cluster-002"] = {
            "id": "cluster-002", "name": "Cluster-02", "hostPoolId": "pool-001",
            "enableHa": 0, "enableLb": 0,
        }

        # Hosts
        self.hosts["host-001"] = {
            "id": "host-001", "name": "cvk-node-1", "hostPoolId": "pool-001",
            "clusterId": "cluster-001", "ipaddr": "192.168.1.101",
            "status": 1, "cpu": 32, "cpuRate": 12.5, "memory": 131072, "memoryRate": 45.0,
            "physical_cpu": 64, "kernelType": "x86_64",
            "local_raw_disks": [
                {"type": "SSD", "size": 480, "num": 2},
                {"type": "HDD", "size": 2000, "num": 4},
            ],
        }
        self.hosts["host-002"] = {
            "id": "host-002", "name": "cvk-node-2", "hostPoolId": "pool-001",
            "clusterId": "cluster-001", "ipaddr": "192.168.1.102",
            "status": 1, "cpu": 48, "cpuRate": 8.3, "memory": 262144, "memoryRate": 30.0,
            "physical_cpu": 96, "kernelType": "x86_64",
            "local_raw_disks": [],
        }
        self.hosts["host-003"] = {
            "id": "host-003", "name": "cvk-node-3-offline", "hostPoolId": "pool-001",
            "clusterId": "cluster-002", "ipaddr": "192.168.1.103",
            "status": 2, "cpu": 16, "cpuRate": 0, "memory": 65536, "memoryRate": 0,
            "physical_cpu": 32, "kernelType": "x86_64",
            "local_raw_disks": [],
        }

        # VMs
        self.vms["vm-001"] = {
            "id": "vm-001", "name": "web-server-01",
            "uuid": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
            "state": "2",  # 2=RUNNING
            "cpu": 4, "maxMemory": 16384, "vcpuMax": 8, "memory": 8192,
            "hostId": "host-001", "hostName": "cvk-node-1",
            "clusterId": "cluster-001", "hostPoolId": "pool-001",
            "cdrom": 0, "bootingDevice": 2, "autoBooting": 0,
            "description": "Primary web server",
            "system": 1,  # Linux
            "osVersion": "CentOS 7.9",
            "interfaces": [
                {"mac": "52:54:00:12:34:56", "type": "bridge", "source": "ovsbr0",
                 "model": "virtio", "vlan": "", "name": "eth0"},
            ],
            "disks": [
                {"device": "disk", "type": "file", "driverType": "qcow2",
                 "sourceFile": "/vms/images/web-server-01.qcow2",
                 "targetDev": "vda", "targetBus": "virtio", "size": 40,
                 "readonly": "false", "shareable": "false"},
            ],
        }
        self.vms["vm-002"] = {
            "id": "vm-002", "name": "db-server-01",
            "uuid": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
            "state": "2",  # RUNNING
            "cpu": 8, "maxMemory": 65536, "vcpuMax": 16, "memory": 32768,
            "hostId": "host-002", "hostName": "cvk-node-2",
            "clusterId": "cluster-001", "hostPoolId": "pool-001",
            "cdrom": 0, "bootingDevice": 1, "autoBooting": 1,
            "description": "PostgreSQL database server",
            "system": 1,  # Linux
            "osVersion": "Ubuntu 22.04 LTS",
            "interfaces": [
                {"mac": "52:54:00:ab:cd:ef", "type": "bridge", "source": "ovsbr0",
                 "model": "virtio", "vlan": "", "name": "eth0"},
            ],
            "disks": [
                {"device": "disk", "type": "file", "driverType": "qcow2",
                 "sourceFile": "/vms/images/db-server-01.qcow2",
                 "targetDev": "vda", "targetBus": "virtio", "size": 200,
                 "readonly": "false", "shareable": "false"},
                {"device": "disk", "type": "file", "driverType": "qcow2",
                 "sourceFile": "/vms/images/db-server-01-data.qcow2",
                 "targetDev": "vdb", "targetBus": "virtio", "size": 500,
                 "readonly": "false", "shareable": "false"},
            ],
        }
        self.vms["vm-003"] = {
            "id": "vm-003", "name": "dev-vm",
            "uuid": "c3d4e5f6-a7b8-9012-cdef-123456789012",
            "state": "3",  # SHUTDOWN
            "cpu": 2, "maxMemory": 8192, "vcpuMax": 4, "memory": 4096,
            "hostId": "host-001", "hostName": "cvk-node-1",
            "clusterId": "cluster-001", "hostPoolId": "pool-001",
            "cdrom": 0, "bootingDevice": 2, "autoBooting": 0,
            "description": "Development VM",
            "system": 0,  # Windows
            "osVersion": "Windows Server 2019",
            "interfaces": [
                {"mac": "52:54:00:fe:dc:ba", "type": "bridge", "source": "ovsbr0",
                 "model": "e1000", "vlan": "", "name": "eth0"},
            ],
            "disks": [
                {"device": "disk", "type": "file", "driverType": "qcow2",
                 "sourceFile": "/vms/images/dev-vm.qcow2",
                 "targetDev": "hda", "targetBus": "ide", "size": 60,
                 "readonly": "false", "shareable": "false"},
            ],
        }

        # NUMA topology
        self.numa_topology = [
            {"id": 0, "cpus": {0, 1, 2, 3, 4, 5, 6, 7},
             "siblings": [], "memory": 67108864,
             "mempages": [{"size": 4, "total": 16777216}]},
            {"id": 1, "cpus": {8, 9, 10, 11, 12, 13, 14, 15},
             "siblings": [], "memory": 67108864,
             "mempages": [{"size": 4, "total": 16777216}]},
        ]

        # PCI devices
        self.pci_devices = [
            {"dev_id": "pci_0000_3b_00_0", "parent_devname": "0000:3b:00.0",
             "address": "0000:3b:00.0", "product_id": "1015", "vendor_id": "15b3",
             "numa_node": 0},
            {"dev_id": "pci_0000_5e_00_0", "parent_devname": "0000:5e:00.0",
             "address": "0000:5e:00.0", "product_id": "1017", "vendor_id": "15b3",
             "numa_node": 1},
        ]

        # Storage pools
        self.storage = {
            "localPools": {
                "/dev/sdb1": {
                    "local-vms": {
                        "name": "local-vms", "path": "/vms/images", "type": "dir",
                        "totalSize": 500000, "freeSize": 350000, "preAllocation": 0, "status": 1,
                    },
                    "local-iso": {
                        "name": "local-iso", "path": "/vms/iso", "type": "dir",
                        "totalSize": 100000, "freeSize": 80000, "preAllocation": 0, "status": 1,
                    },
                },
            },
            "sharePools": {
                "nfs-share": {
                    "name": "nfs-share", "path": "/mnt/nfs/vms", "type": "fs",
                    "totalSize": 2000000, "freeSize": 1500000, "preAllocation": 0, "status": 1,
                },
            },
        }

        # Storage adapters (iSCSI + FC)
        self.storage_adapters = [
            {"host": "cvk-node-1", "initiator": "iqn.1994-05.com.example:cvk-node-1"},
            {"host": "cvk-node-2", "initiator": "iqn.1994-05.com.example:cvk-node-2",
             "wwpns": ["10:00:00:90:fa:53:6a:bc", "10:00:00:90:fa:53:6a:bd"]},
        ]

        # Business templates
        self.business_templates = [
            {"id": "bt-001", "name": "High Priority", "priority": 3, "startMode": 0, "proportion": 50},
            {"id": "bt-002", "name": "Medium Priority", "priority": 2, "startMode": 0, "proportion": 30},
            {"id": "bt-003", "name": "Low Priority", "priority": 1, "startMode": 0, "proportion": 20},
        ]

        # DRS rules
        self.cluster_rules = [
            {"id": "rule-001", "name": "Affinity-Web-DB", "type": 1, "enabled": 1, "clusterId": "cluster-001"},
            {"id": "rule-002", "name": "AntiAffinity-Prod-Dev", "type": 2, "enabled": 1, "clusterId": "cluster-001"},
        ]

    # ========================================================================
    # Task management
    # ========================================================================
    def create_task(self, target_id: str = "", target_name: str = "",
                    old_task: str = "") -> str:
        """Create an async task that auto-completes after a delay."""
        task_id = f"task-{random.randint(10000, 99999)}"
        with self._lock:
            self.tasks[task_id] = {
                "completed": False,
                "result": 0,
                "targetId": target_id,
                "targetName": target_name,
                "oldTask": old_task,
                "created": time.time(),
            }
        return task_id

    def get_task(self, task_id: str) -> Optional[Dict[str, Any]]:
        """Get task status, auto-completing if enough time passed."""
        task = self.tasks.get(task_id)
        if task is None:
            # Unknown tasks auto-resolve as completed
            return {
                "completed": True, "result": 0,
                "targetId": "auto", "targetName": "auto",
                "oldTask": "",
            }
        # Auto-complete after 0.5s for mock
        if time.time() - task["created"] > 0.5:
            task["completed"] = True
        return task

    # ========================================================================
    # Query helpers
    # ========================================================================
    def find_vm_by_uuid(self, uuid: str) -> Optional[Dict[str, Any]]:
        for vm in self.vms.values():
            if vm.get("uuid") == uuid:
                return vm
        return None

    def find_vm_by_id(self, vm_id: str) -> Optional[Dict[str, Any]]:
        return self.vms.get(vm_id)

    def find_vm_by_name(self, name: str) -> Optional[Dict[str, Any]]:
        for vm in self.vms.values():
            if vm.get("name") == name:
                return vm
        return None

    def find_host_by_id(self, host_id: str) -> Optional[Dict[str, Any]]:
        return self.hosts.get(host_id)

    def find_host_by_name(self, name: str) -> Optional[Dict[str, Any]]:
        for host in self.hosts.values():
            if host.get("name") == name:
                return host
        return None

    def get_online_hosts(self) -> List[Dict[str, Any]]:
        return [h for h in self.hosts.values() if h.get("status") == 1]

    def get_vms_by_host(self, host_name: str) -> List[Dict[str, Any]]:
        return [vm for vm in self.vms.values() if vm.get("hostName") == host_name]

    def add_event(self, event_type: str, vm_id: str = "", progress: int = 0):
        self.events.append({
            "type": event_type, "vmId": vm_id, "progress": progress,
            "timestamp": time.time(),
        })
        # Keep last 100 events
        if len(self.events) > 100:
            self.events = self.events[-100:]


# Global singleton
store = DataStore()
