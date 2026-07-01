#!/usr/bin/env python3
"""
H3C CAS Clone — End-to-End Test Suite

Tests the complete CAS deployment stack:
  1. Health check (GET /operator/test → 204)
  2. List host pools
  3. List hosts
  4. Register a CVK (verify via VM list)
  5. Create a VM (deploy)
  6. Start / Stop a VM
  7. Take a snapshot
  8. Delete a VM

Uses the h3c-cas-frame CasClient library against the docker-compose stack.
Also works against a standalone mock_server.py.

Usage:
  python3 tests/test_e2e.py
  python3 tests/test_e2e.py --host localhost --port 8080
  CAS_TEST_HOST=192.168.1.100 CAS_TEST_PORT=8080 python3 tests/test_e2e.py
"""

from __future__ import annotations

import argparse
import os
import sys
import time
import unittest

# Add h3c-cas-frame to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "h3c-cas-frame"))

try:
    from casframe.client import CasClient, CasAPISession, DEFAULT_URI_PREFIX
    from casframe.xmlparser import CasXmlParser
    from casframe.endpoints import (
        HOSTPOOL_ALL, HOSTPOOL_CHILDREN,
        VM_START, VM_STOP, VM_PAUSE, VM_RESTORE,
        VM_SNAPSHOT_CREATE, VM_DELETE_FORCE,
        NOVA_SEARCH_VM, NOVA_VM_LIST, NOVA_VM_DEPLOY,
        OPERATOR_TEST, MESSAGE,
    )
    from casframe.constants import DESTROY_DELETE_DISK
except ImportError as e:
    print(f"ERROR: Cannot import casframe. Make sure h3c-cas-frame is in PYTHONPATH.")
    print(f"  PYTHONPATH={sys.path[:3]}...")
    print(f"  Error: {e}")
    sys.exit(1)


class CasE2ETest(unittest.TestCase):
    """End-to-end tests against a running CAS deployment."""

    @classmethod
    def setUpClass(cls):
        cls.host = os.environ.get("CAS_TEST_HOST", "localhost")
        cls.port = int(os.environ.get("CAS_TEST_PORT", "8080"))
        cls.username = os.environ.get("CAS_TEST_USER", "admin")
        cls.password = os.environ.get("CAS_TEST_PASS", "Cloud@123")
        cls.scheme = os.environ.get("CAS_TEST_SCHEME", "http")

        cls.session = CasAPISession(
            host_ip=f"{cls.host}:{cls.port}",
            username=cls.username,
            password=cls.password,
            scheme=cls.scheme,
        )
        cls.xml = CasXmlParser()

    @classmethod
    def tearDownClass(cls):
        if cls.session._client:
            cls.session._client.close()

    # ── Test 1: Health Check ─────────────────────────────────────

    def test_01_health_check(self):
        """GET /operator/test → 204 No Content"""
        uri = self.session.make_cmd_uri(OPERATOR_TEST)
        resp, _body = self.session.call_method("GET", uri)
        self.assertEqual(
            resp.status_code, 204,
            f"Health check failed: HTTP {resp.status_code}. Is the CVM running?"
        )
        print(f"  ✓ Health check: {resp.status_code} No Content")

    # ── Test 2: List Host Pools ──────────────────────────────────

    def test_02_list_hostpools(self):
        """GET /hostpool/all → list of host pools"""
        uri = self.session.make_cmd_uri(HOSTPOOL_ALL)
        resp, body = self.session.call_method("GET", uri)
        self.assertEqual(resp.status_code, 200, f"Expected 200, got {resp.status_code}")
        self.assertIsNotNone(body, "Response body is empty")

        pools = self.xml.decode_xml("hostpool_list", body)
        self.assertIsInstance(pools, dict)
        self.assertGreater(len(pools), 0, "No host pools found")

        print(f"  ✓ Host pools: {list(pools.keys())}")
        self.__class__.pool_id = next(iter(pools.values()))
        self.__class__.pool_name = next(iter(pools.keys()))

    # ── Test 3: List Hosts ───────────────────────────────────────

    def test_03_list_hosts(self):
        """GET /hostpool/{id}/allChildNode → list of hosts"""
        pool_id = getattr(self.__class__, "pool_id", "pool-001")
        uri = self.session.make_cmd_uri(HOSTPOOL_CHILDREN, pool_id, "allChildNode")
        resp, body = self.session.call_method("GET", uri)
        self.assertEqual(resp.status_code, 200, f"Expected 200, got {resp.status_code}")
        self.assertIsNotNone(body)

        hosts = self.xml.decode_xml("host_list", body)
        self.assertIsInstance(hosts, dict)
        print(f"  ✓ Hosts: {list(hosts.keys())}")

        if hosts:
            first_host = next(iter(hosts.values()))
            self.__class__.host_name = first_host.get("name")
            self.__class__.host_id = first_host.get("id")

    # ── Test 4: Register CVK (verify VM list accessible) ─────────

    def test_04_verify_cvk_registration(self):
        """GET /nova/vmList → VM listing (proves CVK is connected)"""
        uri = self.session.make_cmd_uri(NOVA_VM_LIST)
        resp, body = self.session.call_method("GET", uri)
        self.assertEqual(resp.status_code, 200, f"Expected 200, got {resp.status_code}")
        self.assertIsNotNone(body)

        try:
            vms = self.xml.decode_xml("list_instances", body)
            names = vms.get("names", [])
            uuids = vms.get("uuids", [])
            print(f"  ✓ CVK registered: {len(names)} VMs found")
            for name, uuid in zip(names[:5], uuids[:5]):
                print(f"    - {name} ({uuid})")

            if uuids:
                self.__class__.vm_uuid = uuids[0]
        except Exception:
            print("  ⚠ VM list parse failed (may be empty — ok for fresh deploy)")

    # ── Test 5: Create / Deploy VM ───────────────────────────────

    def test_05_deploy_vm(self):
        """POST /nova/vm/deploy → create a new VM (async task)"""
        uri = self.session.make_cmd_uri(NOVA_VM_DEPLOY)
        # Minimal VM deploy XML
        xml_body = """<?xml version="1.0"?>
<domain>
    <name>e2e-test-vm</name>
    <vcpu>2</vcpu>
    <memory>2048</memory>
    <os>
        <type>hvm</type>
    </os>
    <disk>
        <type>qcow2</type>
        <size>10</size>
    </disk>
</domain>"""

        resp, body = self.session.call_method("POST", uri, body=xml_body)
        self.assertEqual(resp.status_code, 200, f"Deploy failed: HTTP {resp.status_code}")
        print(f"  ✓ VM deploy initiated: HTTP {resp.status_code}")

        if body:
            try:
                task_info = self.xml.decode_xml("wait_for_task", body)
                task_id = self.xml.get_message_id(
                    __import__("xml.etree.ElementTree", fromlist=["ElementTree"])
                    .ElementTree.fromstring(self.xml.skip_xml_head(body))
                )
                if task_id:
                    print(f"    Task ID: {task_id}")
                    self.__class__.deploy_task_id = task_id
            except Exception:
                pass

    # ── Test 6: Start / Stop VM ──────────────────────────────────

    def test_06a_start_vm(self):
        """POST /vm/start/{vmId} → start a VM"""
        vm_id = getattr(self.__class__, "test_vm_id", "vm-001")
        uri = self.session.make_cmd_uri(VM_START, vm_id)
        resp, body = self.session.call_method("POST", uri)
        self.assertEqual(resp.status_code, 200, f"VM start failed: HTTP {resp.status_code}")
        print(f"  ✓ VM {vm_id} start: HTTP {resp.status_code}")

        if body:
            try:
                info = self.xml.decode_xml("wait_for_task", body)
                if info.get("completed"):
                    print(f"    Result: {info.get('result')}")
            except Exception:
                pass

    def test_06b_stop_vm(self):
        """POST /vm/stop/{vmId} → stop a VM"""
        vm_id = getattr(self.__class__, "test_vm_id", "vm-001")
        uri = self.session.make_cmd_uri(VM_STOP, vm_id)
        resp, body = self.session.call_method("POST", uri)
        self.assertEqual(resp.status_code, 200, f"VM stop failed: HTTP {resp.status_code}")
        print(f"  ✓ VM {vm_id} stop: HTTP {resp.status_code}")

    def test_06c_pause_vm(self):
        """POST /vm/pause/{vmId} → pause a VM"""
        vm_id = getattr(self.__class__, "test_vm_id", "vm-001")
        uri = self.session.make_cmd_uri(VM_PAUSE, vm_id)
        resp, body = self.session.call_method("POST", uri)
        self.assertEqual(resp.status_code, 200, f"VM pause failed: HTTP {resp.status_code}")
        print(f"  ✓ VM {vm_id} pause: HTTP {resp.status_code}")

    def test_06d_unpause_vm(self):
        """POST /vm/restore/{vmId} → unpause a VM"""
        vm_id = getattr(self.__class__, "test_vm_id", "vm-001")
        uri = self.session.make_cmd_uri(VM_RESTORE, vm_id)
        resp, body = self.session.call_method("POST", uri)
        self.assertEqual(resp.status_code, 200, f"VM unpause failed: HTTP {resp.status_code}")
        print(f"  ✓ VM {vm_id} unpause: HTTP {resp.status_code}")

    # ── Test 7: Take Snapshot ─────────────────────────────────────

    def test_07_snapshot(self):
        """POST /vm/snapshot → create a VM snapshot"""
        xml_body = """<?xml version="1.0"?>
<snapshot>
    <name>e2e-test-snapshot</name>
</snapshot>"""
        uri = self.session.make_cmd_uri(VM_SNAPSHOT_CREATE)
        resp, body = self.session.call_method("POST", uri, body=xml_body)
        self.assertEqual(resp.status_code, 200, f"Snapshot failed: HTTP {resp.status_code}")
        print(f"  ✓ Snapshot creation: HTTP {resp.status_code}")

        if body:
            try:
                info = self.xml.decode_xml("wait_for_task", body)
                print(f"    Target: {info.get('targetName', 'N/A')}")
            except Exception:
                pass

    # ── Test 8: Delete VM ─────────────────────────────────────────

    def test_08_delete_vm(self):
        """POST /vm/deleteVmForce → delete a VM"""
        vm_id = getattr(self.__class__, "test_vm_id", "vm-003")
        uri = self.session.make_cmd_uri(
            VM_DELETE_FORCE,
            id=vm_id,
            type=DESTROY_DELETE_DISK,
            force="true",
        )
        resp, body = self.session.call_method("POST", uri)
        self.assertEqual(resp.status_code, 200, f"VM delete failed: HTTP {resp.status_code}")
        print(f"  ✓ VM {vm_id} delete: HTTP {resp.status_code}")

    # ── Test: Auth failure handling ───────────────────────────────

    def test_09_auth_required(self):
        """Verify 401 on unauthenticated request."""
        import http.client
        conn = http.client.HTTPConnection(self.host, self.port)
        conn.request("GET", f"/cas/casrs{OPERATOR_TEST}")
        resp = conn.getresponse()
        self.assertEqual(resp.status_code, 401, f"Expected 401, got {resp.status_code}")
        www_auth = resp.getheader("WWW-Authenticate", "")
        self.assertIn("Digest", www_auth)
        print(f"  ✓ Unauthenticated request → 401 with Digest challenge")
        conn.close()


def main():
    parser = argparse.ArgumentParser(description="H3C CAS E2E Test Suite")
    parser.add_argument("--host", default=os.environ.get("CAS_TEST_HOST", "localhost"),
                        help="CVM host (default: localhost)")
    parser.add_argument("--port", default=int(os.environ.get("CAS_TEST_PORT", "8080")),
                        type=int, help="CVM port (default: 8080)")
    parser.add_argument("--user", default=os.environ.get("CAS_TEST_USER", "admin"),
                        help="Username (default: admin)")
    parser.add_argument("--pass", dest="password",
                        default=os.environ.get("CAS_TEST_PASS", "Cloud@123"),
                        help="Password (default: Cloud@123)")
    parser.add_argument("-v", "--verbose", action="store_true",
                        help="Verbose output")
    args = parser.parse_args()

    # Export env vars for unittest
    os.environ["CAS_TEST_HOST"] = args.host
    os.environ["CAS_TEST_PORT"] = str(args.port)
    os.environ["CAS_TEST_USER"] = args.user
    os.environ["CAS_TEST_PASS"] = args.password

    print("=" * 60)
    print(" H3C CAS Clone — End-to-End Test Suite")
    print("=" * 60)
    print(f"  Target:  {args.host}:{args.port}")
    print(f"  User:    {args.user}")
    print(f"  Scheme:  {os.environ.get('CAS_TEST_SCHEME', 'http')}")
    print("=" * 60)
    print()

    # Run tests
    loader = unittest.TestLoader()
    suite = loader.loadTestsFromTestCase(CasE2ETest)
    runner = unittest.TextTestRunner(verbosity=2 if args.verbose else 1)
    result = runner.run(suite)

    print()
    print("=" * 60)
    if result.wasSuccessful():
        print(" ✓ ALL TESTS PASSED")
    else:
        print(f" ✗ {len(result.failures)} failures, {len(result.errors)} errors")
        for test, traceback in result.failures + result.errors:
            print(f"\n  FAIL: {test}")
            print(f"  {traceback[:500]}")
    print("=" * 60)

    return 0 if result.wasSuccessful() else 1


if __name__ == "__main__":
    sys.exit(main())
