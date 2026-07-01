#!/usr/bin/env python3
"""
Comprehensive test harness for CVM Server.
Tests all endpoint categories with Digest auth.
Run while the server is running on port 8080.

Usage:
    python test_server.py [--host localhost] [--port 8080]
"""
import argparse
import hashlib
import os
import sys
import time
import urllib.request
from typing import Optional, Tuple

# ============================================================================
# Digest auth client (stdlib only)
# ============================================================================
class DigestAuthHandler:
    """Handle HTTP Digest auth without external deps."""
    
    def __init__(self, username: str, password: str):
        self.username = username
        self.password = password
        self.nc = 0
    
    def _parse_challenge(self, header: str) -> dict:
        out = {}
        idx = header.lower().find("digest ")
        if idx < 0:
            return out
        header = header[idx + 7:]
        parts = []
        cur = ""
        in_quote = False
        for ch in header:
            if ch == '"':
                in_quote = not in_quote
                cur += ch
            elif ch == ',' and not in_quote:
                parts.append(cur.strip())
                cur = ""
            else:
                cur += ch
        if cur.strip():
            parts.append(cur.strip())
        for p in parts:
            if '=' in p:
                k, v = p.split('=', 1)
                out[k.strip()] = v.strip().strip('"')
        return out
    
    def _compute_response(self, method: str, uri: str, chal: dict) -> str:
        realm = chal.get("realm", "CAS")
        nonce = chal.get("nonce", "")
        qop = chal.get("qop", "")
        
        ha1 = hashlib.md5(f"{self.username}:{realm}:{self.password}".encode()).hexdigest()
        ha2 = hashlib.md5(f"{method}:{uri}".encode()).hexdigest()
        
        if qop in ("auth", "auth-int"):
            self.nc += 1
            nc_val = f"{self.nc:08x}"
            cnonce = hashlib.md5(os.urandom(16)).hexdigest()[:16]
            response = hashlib.md5(
                f"{ha1}:{nonce}:{nc_val}:{cnonce}:{qop}:{ha2}".encode()
            ).hexdigest()
            return (f'Digest username="{self.username}", realm="{realm}", '
                    f'nonce="{nonce}", uri="{uri}", '
                    f'qop={qop}, nc={nc_val}, cnonce="{cnonce}", '
                    f'response="{response}", algorithm=MD5')
        else:
            response = hashlib.md5(f"{ha1}:{nonce}:{ha2}".encode()).hexdigest()
            return (f'Digest username="{self.username}", realm="{realm}", '
                    f'nonce="{nonce}", uri="{uri}", '
                    f'response="{response}", algorithm=MD5')
    
    def request(self, method: str, url: str, body: Optional[bytes] = None) -> Tuple[int, str]:
        """Make a Digest-auth-protected request."""
        from urllib.parse import urlparse
        parsed = urlparse(url)
        uri = parsed.path
        if parsed.query:
            uri += "?" + parsed.query
        
        # First attempt — expect 401
        req = urllib.request.Request(url, data=body, method=method)
        req.add_header("Accept", "application/xml")
        if body:
            req.add_header("Content-Type", "application/xml")
        
        try:
            resp = urllib.request.urlopen(req, timeout=10)
            return resp.status, resp.read().decode("utf-8", "replace")
        except urllib.error.HTTPError as e:
            if e.code == 401:
                www_auth = e.headers.get("WWW-Authenticate", "")
                chal = self._parse_challenge(www_auth)
                auth_hdr = self._compute_response(method, uri, chal)
                
                # Second attempt with auth
                req2 = urllib.request.Request(url, data=body, method=method)
                req2.add_header("Authorization", auth_hdr)
                req2.add_header("Accept", "application/xml")
                if body:
                    req2.add_header("Content-Type", "application/xml")
                
                try:
                    resp2 = urllib.request.urlopen(req2, timeout=10)
                    return resp2.status, resp2.read().decode("utf-8", "replace")
                except urllib.error.HTTPError as e2:
                    return e2.code, e2.read().decode("utf-8", "replace")
            else:
                return e.code, e.read().decode("utf-8", "replace")
        except Exception as e:
            return -1, str(e)


# ============================================================================
# Test runner
# ============================================================================
class TestRunner:
    def __init__(self, base_url: str, auth: DigestAuthHandler):
        self.base = base_url
        self.auth = auth
        self.passed = 0
        self.failed = 0
        self.errors = []
    
    def _url(self, path: str) -> str:
        return f"{self.base}/cas/casrs{path}"
    
    def check(self, name: str, method: str, path: str, 
              expected_status: int = 200, body: Optional[bytes] = None):
        url = self._url(path)
        try:
            status, text = self.auth.request(method, url, body)
            if status == expected_status:
                self.passed += 1
                print(f"  ✅ {name} ({status})")
                return status, text
            else:
                self.failed += 1
                print(f"  ❌ {name}: expected {expected_status}, got {status}")
                self.errors.append((name, f"HTTP {status}: {text[:200]}"))
                return status, text
        except Exception as e:
            self.failed += 1
            print(f"  ❌ {name}: {e}")
            self.errors.append((name, str(e)))
            return -1, ""
    
    def run_all(self):
        print("=" * 70)
        print("CVM Server Test Suite")
        print("=" * 70)
        
        # Health
        print("\n--- Health & Auth ---")
        self.check("Health check", "GET", "/operator/test", 204)
        self.check("Health check POST", "POST", "/operator/test", 204)
        
        # Host pool
        print("\n--- Host Pool ---")
        self.check("Host pool all", "GET", "/hostpool/all")
        self.check("Host pool children", "GET", "/hostpool/pool-001/allChildNode")
        
        # Cluster
        print("\n--- Cluster ---")
        self.check("Cluster rules", "GET", "/cluster/rules")
        self.check("Add VM host rule", "POST", "/cluster/addVMHostRule")
        self.check("Edit VM host rule", "POST", "/cluster/editVMHostRule")
        
        # Resource pool
        print("\n--- Resource Pool ---")
        self.check("Query resPool", "GET", "/resPool/queryResPool")
        self.check("GPU list", "GET", "/resPool/queryResPoolGpuList")
        self.check("vGPU list", "GET", "/resPool/queryResPoolVgpuList")
        self.check("Business templates", "GET", "/resPool/queryBusinessTem")
        
        # Nova VM query
        print("\n--- Nova VM Query ---")
        self.check("Search VM by UUID", "GET", 
                   "/nova/searchVm?uuid=a1b2c3d4-e5f6-7890-abcd-ef1234567890")
        self.check("VM Info", "GET", "/nova/vmInfo/vm-001")
        self.check("VM List", "GET", "/nova/vmList")
        self.check("VM Diagnostic", "GET", "/nova/vmDiagnosticInfo/vm-001")
        self.check("Domain exists (true)", "GET", 
                   "/nova/ifDomainExists?uuid=a1b2c3d4-e5f6-7890-abcd-ef1234567890")
        self.check("Domain exists (false)", "GET", "/nova/ifDomainExists?uuid=nonexistent")
        self.check("DTS info", "GET", "/nova/vmdtsInfo?uuid=a1b2c3d4-e5f6-7890-abcd-ef1234567890")
        self.check("CAS Tools info", "GET", "/nova/castoolsInfo?uuid=a1b2c3d4-e5f6-7890-abcd-ef1234567890")
        self.check("Protected status", "GET", "/nova/protectedStatus/vm-001")
        self.check("Console log", "GET", "/nova/consoleLog?id=vm-001&length=100")
        
        # Nova VM operations
        print("\n--- Nova VM Operations ---")
        self.check("VM Deploy", "POST", "/nova/vm/deploy")
        self.check("VM Config", "POST", "/nova/vm/config")
        self.check("VM Config Drive", "POST", "/nova/vm/configDrive")
        self.check("VM Device", "POST", "/nova/vm/device")
        self.check("VM Add RBD", "POST", "/nova/vm/addRbdDevice")
        self.check("VM Del Device", "POST", "/nova/vm/delDevice")
        self.check("VM Add Device", "POST", "/nova/vm/addDevice")
        self.check("VM Modify", "POST", "/nova/vm/modify")
        self.check("VM Modify Disk QoS", "POST", "/nova/vm/modifyDiskQos")
        self.check("VM Set Password", "POST", "/nova/vm/setpwd")
        self.check("VM Resize", "POST", "/nova/vm/resize")
        self.check("VM Snapshot", "POST", "/nova/vm/snapshot?vmId=1&device=vda&name=snap1")
        self.check("VM Device Backup", "POST", "/nova/vm/deviceBackup")
        self.check("VM Image Device", "POST", "/nova/vm/imageDevice")
        
        # Nova Network
        print("\n--- Nova Network ---")
        self.check("Network GET", "GET", "/nova/vm/network")
        self.check("Network POST", "POST", "/nova/vm/network")
        self.check("Config Network", "POST", "/nova/vm/configNetwork")
        self.check("Rename Vnet", "POST", "/nova/vm/renameVnet?id=1&mac=52:54:00:12:34:56")
        
        # Nova Host resources
        print("\n--- Nova Host Resources ---")
        self.check("Host Resource", "GET", "/nova/hostResource")
        self.check("Node Storage", "GET", "/nova/node/storage")
        self.check("PCI Devices", "GET", "/nova/pcidevices")
        self.check("Isolated CPU", "GET", "/nova/isolatedCPU")
        self.check("NUMA Topology", "GET", "/nova/numatopology")
        self.check("Pool", "GET", "/nova/pool")
        self.check("Storage Adapter", "GET", "/nova/storageAdapter")
        self.check("Resource", "GET", "/nova/resource")
        
        # Nova Host LUN/RBD
        print("\n--- Nova Host LUN/RBD ---")
        self.check("Query LUN", "POST", "/nova/host/queryLun")
        self.check("Attach LUN", "POST", "/nova/host/attachLun")
        self.check("Detach LUN", "POST", "/nova/host/detachLun")
        self.check("Attach RBD", "POST", "/nova/host/attachRbdPool")
        self.check("Detach RBD", "POST", "/nova/host/detachRbdPool")
        
        # Nova Image
        print("\n--- Nova Image ---")
        self.check("Image exists", "GET", "/nova/image/ifExists?uuid=test-img")
        self.check("Image info", "GET", "/nova/image/test-uuid-123")
        self.check("Download", "POST", "/nova/download")
        self.check("Update", "POST", "/nova/update")
        
        # Nova Domain
        print("\n--- Nova Domain ---")
        self.check("Domain GET", "GET", "/nova/domain")
        self.check("Domain POST", "POST", "/nova/domain")
        self.check("Interface QoS", "POST", "/nova/interface/qos")
        
        # VM lifecycle
        print("\n--- VM Lifecycle ---")
        for op in ["start", "stop", "powerOff", "restart", "pause", "restore", "sleep"]:
            self.check(f"VM {op}", "POST", f"/vm/{op}/vm-001")
        
        # VM operations
        print("\n--- VM Operations ---")
        self.check("VM Detail", "GET", "/vm/detail/vm-001")
        self.check("VM Info", "GET", "/vm/vm-001")
        self.check("VM Migrate", "POST", "/vm/migrate")
        self.check("VM Modify", "POST", "/vm/modify")
        self.check("VM Rename", "POST", "/vm/rename/vm-003/renamed-vm")
        self.check("VM Delete Force", "POST", "/vm/deleteVmForce?id=vm-999&type=1&force=false")
        self.check("VM Manage", "POST", "/vm/manage")
        self.check("VM Snapshot", "POST", "/vm/snapshot")
        self.check("VM Snapshot Resume", "POST", "/vm/snapshot/resume")
        self.check("VM Add Device", "POST", "/vm/addDevice")
        self.check("VM Desc", "POST", "/vm/desc?id=vm-001&desc=test")
        self.check("VM PCI", "GET", "/vm/pci?uuid=a1b2c3d4-e5f6-7890-abcd-ef1234567890")
        self.check("VM Boot Dev", "GET", "/vm/bootDev/vm-001")
        self.check("VM List GET", "GET", "/vm/vmList")
        self.check("VM List POST", "POST", "/vm/vmList")
        
        # Console
        print("\n--- Console ---")
        self.check("VNC", "GET", "/vmvnc/vnc/vm-001")
        self.check("SPICE", "GET", "/spice/info/vm-001")
        
        # Storage
        print("\n--- Storage ---")
        self.check("Storage refresh", "POST", "/storage/refresh?id=host-001&poolName=local-vms", 204)
        self.check("Storage volume", "GET", "/storage/volume?hostId=host-001&poolName=local-vms&volumeName=test")
        
        # Events & System
        print("\n--- Events & System ---")
        self.check("Events", "GET", "/events")
        self.check("RabbitMQ", "GET", "/system/rabbitmq")
        
        # Message / task polling
        print("\n--- Async Task ---")
        self.check("Task poll (auto-complete)", "GET", "/message/task-unknown")
        
        # Summary
        print("\n" + "=" * 70)
        total = self.passed + self.failed
        print(f"Results: {self.passed}/{total} passed, {self.failed} failed")
        if self.errors:
            print("\nFailed tests:")
            for name, err in self.errors:
                print(f"  - {name}: {err}")
        print("=" * 70)
        return self.failed == 0


def main():
    parser = argparse.ArgumentParser(description="CVM Server Test Suite")
    parser.add_argument("--host", default="localhost", help="Server hostname")
    parser.add_argument("--port", type=int, default=8080, help="Server port")
    parser.add_argument("--username", default="admin", help="Auth username")
    parser.add_argument("--password", default="Cloud@123", help="Auth password")
    args = parser.parse_args()
    
    base_url = f"http://{args.host}:{args.port}"
    auth = DigestAuthHandler(args.username, args.password)
    
    runner = TestRunner(base_url, auth)
    success = runner.run_all()
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
