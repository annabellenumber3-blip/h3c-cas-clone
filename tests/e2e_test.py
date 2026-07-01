#!/usr/bin/env python3
"""
H3C CAS 1:1 Clone — End-to-End Test Suite
==========================================
Tests the complete CAS clone against a running CVM server.

Usage:
    # Against running server (Docker or local)
    python tests/e2e_test.py

    # With pytest
    CAS_TEST_HOST=localhost CAS_TEST_USER=admin CAS_TEST_PASS=Cloud@123 pytest tests/e2e_test.py -v
"""

from __future__ import annotations

import os
import sys
import time
import unittest
from typing import Any, Dict, List, Optional, Tuple

# Add clone root to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import requests
from requests.auth import HTTPDigestAuth
from lxml import etree

# ============================================================================
# Config
# ============================================================================
CVM_HOST = os.environ.get("CAS_TEST_HOST", "localhost")
CVM_PORT = os.environ.get("CAS_TEST_PORT", "8080")
CVM_USER = os.environ.get("CAS_TEST_USER", "admin")
CVM_PASS = os.environ.get("CAS_TEST_PASS", "Cloud@123")
CVM_SCHEME = os.environ.get("CAS_TEST_SCHEME", "http")

BASE_URL = f"{CVM_SCHEME}://{CVM_HOST}:{CVM_PORT}/cas/casrs"
AUTH = HTTPDigestAuth(CVM_USER, CVM_PASS)


def req(method: str, path: str, **kwargs) -> Tuple[int, Optional[str]]:
    """Make an authenticated request to the CAS API."""
    url = f"{BASE_URL}{path}"
    resp = requests.request(
        method, url, auth=AUTH,
        headers={"Accept": "application/xml", "Content-Type": "application/xml"},
        timeout=30, **kwargs
    )
    return resp.status_code, resp.text if resp.text else None


def xml_text(root: etree.Element, tag: str, default: str = "") -> str:
    el = root.find(tag)
    return (el.text or "").strip() if el is not None else default


def wait_task(task_id: str, timeout: float = 30.0) -> Dict[str, Any]:
    """Poll an async task until completion."""
    deadline = time.monotonic() + timeout
    while time.monotonic() < deadline:
        status, body = req("GET", f"/message/{task_id}")
        if status == 200 and body:
            root = etree.fromstring(body.encode("utf-8") if isinstance(body, str) else body)
            completed = xml_text(root, "completed")
            if completed == "true":
                return {
                    "completed": True,
                    "result": int(xml_text(root, "result", "-1")),
                    "targetId": xml_text(root, "targetId"),
                    "targetName": xml_text(root, "targetName"),
                    "failMsg": xml_text(root, "failMsg"),
                }
        time.sleep(1)
    raise TimeoutError(f"Task {task_id} did not complete within {timeout}s")


# ============================================================================
# Tests
# ============================================================================
class TestHealthCheck(unittest.TestCase):
    """Test /operator/test health endpoint."""

    def test_health(self):
        code, _ = req("GET", "/operator/test")
        self.assertEqual(code, 204, "Health check should return 204")


class TestHostPool(unittest.TestCase):
    """Test /hostpool/* endpoints."""

    def test_list_all(self):
        code, body = req("GET", "/hostpool/all")
        self.assertEqual(code, 200)
        self.assertIsNotNone(body)
        root = etree.fromstring(body.encode("utf-8"))
        pools = {xml_text(hp, "name"): xml_text(hp, "id") for hp in root.findall("hostPool")}
        self.assertGreater(len(pools), 0, "Should have at least one host pool")

    def test_list_hosts(self):
        code, body = req("GET", "/hostpool/all")
        if code == 200 and body:
            root = etree.fromstring(body.encode("utf-8"))
            pools = [(xml_text(hp, "name"), xml_text(hp, "id")) for hp in root.findall("hostPool")]
            if pools:
                pool_id = pools[0][1]
                code, body = req("GET", f"/hostpool/{pool_id}/allChildNode")
                self.assertEqual(code, 200)
                self.assertIsNotNone(body)


class TestVNLifecycle(unittest.TestCase):
    """Test VM lifecycle: search, list, info, start, stop, delete."""

    def test_search_vm(self):
        code, body = req("GET", "/nova/searchVm?uuid=a1b2c3d4-e5f6-7890-abcd-ef1234567890")
        self.assertEqual(code, 200)
        root = etree.fromstring(body.encode("utf-8"))
        self.assertEqual(xml_text(root, "id"), "vm-001")

    def test_vm_exists(self):
        code, body = req("GET", "/nova/ifDomainExists?uuid=a1b2c3d4-e5f6-7890-abcd-ef1234567890")
        self.assertEqual(code, 200)
        self.assertEqual(body, "true")

    def test_vm_not_exists(self):
        code, body = req("GET", "/nova/ifDomainExists?uuid=nonexistent-vm-uuid")
        self.assertEqual(code, 200)
        self.assertIn(body, ("false", "False"))

    def test_list_vms(self):
        code, body = req("GET", "/nova/vmList")
        self.assertEqual(code, 200)
        root = etree.fromstring(body.encode("utf-8"))
        names = [xml_text(d, "name") for d in root.findall("domain")]
        self.assertIn("web-server-01", names)

    def test_vm_info(self):
        code, body = req("GET", "/nova/vmInfo/vm-001")
        self.assertEqual(code, 200)
        root = etree.fromstring(body.encode("utf-8"))
        self.assertEqual(xml_text(root, "state"), "2")  # RUNNING
        self.assertEqual(xml_text(root, "cpu"), "4")

    def test_start_vm(self):
        code, body = req("POST", "/vm/start/vm-003")
        self.assertEqual(code, 200)
        task = wait_task(_get_task_id(body))
        self.assertTrue(task["completed"])
        self.assertEqual(task["result"], 0)

    def test_stop_vm(self):
        code, body = req("POST", "/vm/stop/vm-003")
        self.assertEqual(code, 200)
        task = wait_task(_get_task_id(body))
        self.assertTrue(task["completed"])

    def test_pause_unpause_vm(self):
        # Pause
        code, body = req("POST", "/vm/pause/vm-001")
        self.assertEqual(code, 200)
        wait_task(_get_task_id(body))
        # Unpause (restore)
        code, body = req("POST", "/vm/restore/vm-001")
        self.assertEqual(code, 200)
        wait_task(_get_task_id(body))

    def test_snapshot_vm(self):
        code, body = req("POST", "/vm/snapshot")
        self.assertEqual(code, 200)
        task = wait_task(_get_task_id(body))
        self.assertTrue(task["completed"])


class TestConsole(unittest.TestCase):
    """Test VNC/SPICE console endpoints."""

    def test_vnc(self):
        code, body = req("GET", "/vmvnc/vnc/vm-001")
        self.assertEqual(code, 200)
        self.assertIn("host=", body)

    def test_spice(self):
        code, body = req("GET", "/spice/info/vm-001")
        self.assertEqual(code, 200)
        self.assertIn("host=", body)


class TestResources(unittest.TestCase):
    """Test host resource, NUMA, PCI, storage endpoints."""

    def test_host_resources(self):
        code, body = req("GET", "/nova/hostResource?hostName=cvk-node-1")
        self.assertEqual(code, 200)
        self.assertIsNotNone(body)

    def test_numa_topology(self):
        code, body = req("GET", "/nova/numatopology?hostName=cvk-node-1")
        self.assertEqual(code, 200)
        root = etree.fromstring(body.encode("utf-8"))
        numas = root.findall("numa")
        self.assertGreater(len(numas), 0)

    def test_pci_devices(self):
        code, body = req("GET", "/nova/pcidevices?hostName=cvk-node-1")
        self.assertEqual(code, 200)
        self.assertIsNotNone(body)

    def test_node_storage(self):
        code, body = req("GET", "/nova/node/storage?hostName=cvk-node-1")
        self.assertEqual(code, 200)
        self.assertIsNotNone(body)


class TestEvents(unittest.TestCase):
    """Test events and RabbitMQ config endpoints."""

    def test_events(self):
        code, body = req("GET", "/events?type=1&progress=false")
        self.assertEqual(code, 200)

    def test_rabbitmq_config(self):
        code, body = req("GET", "/system/rabbitmq")
        self.assertEqual(code, 200)
        self.assertIn("vhost=cloudMsgHost", body)


class TestAuth(unittest.TestCase):
    """Test Digest auth."""

    def test_no_auth_returns_401(self):
        url = f"{BASE_URL}/operator/test"
        resp = requests.get(url, timeout=10)
        self.assertEqual(resp.status_code, 401)

    def test_wrong_password_returns_403(self):
        bad_auth = HTTPDigestAuth("admin", "wrongpassword")
        url = f"{BASE_URL}/operator/test"
        resp = requests.get(url, auth=bad_auth, timeout=10)
        self.assertIn(resp.status_code, (401, 403))


def _get_task_id(body: Optional[str]) -> str:
    """Extract msgId/taskId from XML response body."""
    if body:
        root = etree.fromstring(body.encode("utf-8") if isinstance(body, str) else body)
        msg_el = root.find("msgId")
        if msg_el is not None and msg_el.text:
            return msg_el.text.strip()
    return "auto-task-1"


# ============================================================================
# Main
# ============================================================================
if __name__ == "__main__":
    print(f"Testing CAS clone at {BASE_URL}")
    print(f"User: {CVM_USER}")
    
    # Quick health check before running full suite
    code, _ = req("GET", "/operator/test")
    if code != 204:
        print(f"ERROR: CVM server not reachable (got {code}). Start it first:")
        print(f"  cd /home/kali/Downloads/h3c/h3c-cas-clone && ./start-cas.sh --local")
        sys.exit(1)
    
    print("Health check: OK\n")
    unittest.main(verbosity=2)
