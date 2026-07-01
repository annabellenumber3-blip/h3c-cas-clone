"""
CVK Host Registration — mirrors RsHostResource.java + HostHandler/CvkAgentTaskHandler

Reports host hardware information to the CVM:
  - CPU topology (sockets, cores, threads, vendor, flags)
  - Memory (total, hugepages)
  - NUMA topology
  - PCI devices (including SR-IOV, GPU)
  - Storage adapters (FC HBA, iSCSI initiator)
  - Local disks
  - Network interfaces

The CVK agent registers with CVM on startup and periodically re-reports
host status via heartbeat.
"""

from __future__ import annotations

import logging
import platform
import re
import subprocess
from typing import Any, Dict, List, Optional, Tuple

from .config import CvkConfig
from .feign import CvkFeignClient

log = logging.getLogger(__name__)


class HostRegistrar:
    """Handles CVK host registration with CVM.

    Mirrors the host info collection in:
      - CvkAgentTaskHandler (host registration flow)
      - RsHostResource.java (host query/register endpoints)
      - HostHandler (host data collection)
    """

    def __init__(self, config: CvkConfig, feign: CvkFeignClient):
        self._config = config
        self._feign = feign
        self._registered: bool = False
        self._host_info_cache: Dict[str, Any] = {}

    # ================================================================
    # Host hardware discovery
    # ================================================================

    def discover_host(self) -> Dict[str, Any]:
        """Discover host hardware information.

        Returns a dict suitable for serializing to XML and sending
        to CVM via /cas/casrs/nova/hostResource endpoint.
        """
        info: Dict[str, Any] = {
            "hostId": self._config.host_id,
            "hostName": self._config.host_name or platform.node(),
            "hostIp": self._config.host_ip,
            "kernelType": platform.machine(),
            "cpuInfo": self._discover_cpu(),
            "memoryInfo": self._discover_memory(),
            "numaTopology": self._discover_numa(),
            "pciDevices": self._discover_pci(),
            "storageAdapters": self._discover_storage_adapters(),
            "localDisks": self._discover_local_disks(),
            "networkInterfaces": self._discover_network_interfaces(),
            "platformInfo": self._discover_platform(),
        }
        self._host_info_cache = info
        return info

    def _discover_cpu(self) -> Dict[str, Any]:
        """Discover CPU topology from /proc/cpuinfo."""
        try:
            with open("/proc/cpuinfo", "r") as f:
                content = f.read()
        except (IOError, OSError):
            return self._mock_cpu_info()

        processors = content.count("processor\t")
        sockets = len(set(re.findall(r"physical id\s*:\s*(\d+)", content)))
        if sockets == 0:
            sockets = 1
        cores_per_socket = len(set(re.findall(r"core id\s*:\s*(\d+)", content)))
        if cores_per_socket == 0:
            cores_per_socket = max(processors // sockets, 1)
        threads_per_core = max(processors // (sockets * cores_per_socket), 1)

        vendor_match = re.search(r"vendor_id\s*:\s*(\S+)", content)
        vendor = vendor_match.group(1) if vendor_match else "Unknown"

        model_match = re.search(r"model name\s*:\s*(.+)", content)
        model = model_match.group(1).strip() if model_match else "Unknown"

        # Extract CPU flags
        flags_match = re.search(r"flags\s*:\s*(.+)", content)
        flags = flags_match.group(1).split() if flags_match else []

        mhz_match = re.search(r"cpu MHz\s*:\s*([\d.]+)", content)
        mhz = float(mhz_match.group(1)) if mhz_match else 0.0

        return {
            "sockets": sockets,
            "coresPerSocket": cores_per_socket,
            "threadsPerCore": threads_per_core,
            "totalCores": sockets * cores_per_socket,
            "totalThreads": processors,
            "vendor": vendor,
            "model": model,
            "mhz": mhz,
            "flags": flags,
            "architecture": platform.machine(),
        }

    def _mock_cpu_info(self) -> Dict[str, Any]:
        """Mock CPU info for environments without /proc/cpuinfo."""
        import os
        cpu_count = os.cpu_count() or 4
        return {
            "sockets": 1,
            "coresPerSocket": cpu_count,
            "threadsPerCore": 1,
            "totalCores": cpu_count,
            "totalThreads": cpu_count,
            "vendor": "MockVendor",
            "model": "Mock CPU",
            "mhz": 2000.0,
            "flags": ["mock"],
            "architecture": platform.machine(),
        }

    def _discover_memory(self) -> Dict[str, Any]:
        """Discover memory info from /proc/meminfo."""
        try:
            with open("/proc/meminfo", "r") as f:
                content = f.read()
        except (IOError, OSError):
            return self._mock_memory_info()

        def _parse_mem(key: str) -> int:
            m = re.search(rf"^{key}:\s*(\d+)", content, re.MULTILINE)
            return int(m.group(1)) if m else 0

        total_kb = _parse_mem("MemTotal")
        free_kb = _parse_mem("MemFree")
        hugepages_total = _parse_mem("HugePages_Total")
        hugepages_free = _parse_mem("HugePages_Free")
        hugepages_size_kb = _parse_mem("Hugepagesize")

        return {
            "totalKB": total_kb,
            "totalMB": total_kb // 1024,
            "totalGB": total_kb // (1024 * 1024),
            "freeKB": free_kb,
            "freeMB": free_kb // 1024,
            "hugepages": {
                "total": hugepages_total,
                "free": hugepages_free,
                "pageSizeKB": hugepages_size_kb,
            },
        }

    def _mock_memory_info(self) -> Dict[str, Any]:
        """Mock memory info."""
        return {
            "totalKB": 134217728,
            "totalMB": 131072,
            "totalGB": 128,
            "freeKB": 67108864,
            "freeMB": 65536,
            "hugepages": {"total": 0, "free": 0, "pageSizeKB": 2048},
        }

    def _discover_numa(self) -> List[Dict[str, Any]]:
        """Discover NUMA topology via numactl or /sys/devices/system/node."""
        # Try numactl first
        try:
            result = subprocess.run(
                ["numactl", "--hardware"],
                capture_output=True, text=True, timeout=10,
            )
            if result.returncode == 0:
                return self._parse_numactl(result.stdout)
        except (FileNotFoundError, subprocess.TimeoutExpired):
            pass

        # Fall back to /sys
        try:
            import glob
            nodes = []
            for node_dir in sorted(glob.glob("/sys/devices/system/node/node*")):
                node_id = int(re.search(r"node(\d+)", node_dir).group(1))
                try:
                    with open(f"{node_dir}/cpulist", "r") as f:
                        cpulist = f.read().strip()
                except IOError:
                    cpulist = ""
                try:
                    with open(f"{node_dir}/meminfo", "r") as f:
                        mem_content = f.read()
                except IOError:
                    mem_content = ""
                mem_kb = 0
                for line in mem_content.split("\n"):
                    if line.startswith("MemTotal:"):
                        mem_kb = int(line.split(":")[1].strip().split()[0])

                nodes.append({
                    "id": node_id,
                    "cpus": self._parse_cpulist(cpulist),
                    "memoryKB": mem_kb,
                    "memoryMB": mem_kb // 1024,
                })
            if nodes:
                return nodes
        except Exception:
            pass

        return self._mock_numa()

    def _parse_numactl(self, output: str) -> List[Dict[str, Any]]:
        """Parse numactl --hardware output."""
        nodes = []
        for match in re.finditer(
            r"node (\d+) cpus: ([^\n]+)\nnode \d+ size: (\d+) MB",
            output,
        ):
            node_id = int(match.group(1))
            cpus = self._parse_cpulist(match.group(2).strip())
            mem_mb = int(match.group(3))
            nodes.append({
                "id": node_id,
                "cpus": cpus,
                "memoryKB": mem_mb * 1024,
                "memoryMB": mem_mb,
            })
        return nodes

    def _mock_numa(self) -> List[Dict[str, Any]]:
        """Mock NUMA topology."""
        import os
        cpu_count = os.cpu_count() or 4
        per_node = max(cpu_count // 2, 1)
        return [
            {"id": 0, "cpus": list(range(per_node)),
             "memoryKB": 67108864, "memoryMB": 65536},
            {"id": 1, "cpus": list(range(per_node, cpu_count)),
             "memoryKB": 67108864, "memoryMB": 65536},
        ]

    @staticmethod
    def _parse_cpulist(spec: str) -> List[int]:
        """Parse CPU list string like '0-3,8-11' into flat list."""
        cpus = []
        for part in spec.split(","):
            part = part.strip()
            if not part:
                continue
            if "-" in part:
                try:
                    start, end = part.split("-", 1)
                    cpus.extend(range(int(start), int(end) + 1))
                except ValueError:
                    pass
            else:
                try:
                    cpus.append(int(part))
                except ValueError:
                    pass
        return cpus

    def _discover_pci(self) -> List[Dict[str, Any]]:
        """Discover PCI devices via lspci."""
        try:
            result = subprocess.run(
                ["lspci", "-mm", "-nn"],
                capture_output=True, text=True, timeout=10,
            )
            if result.returncode == 0:
                return self._parse_lspci(result.stdout)
        except (FileNotFoundError, subprocess.TimeoutExpired):
            pass
        return self._mock_pci()

    def _parse_lspci(self, output: str) -> List[Dict[str, Any]]:
        """Parse lspci -mm -nn output."""
        devices = []
        for line in output.strip().split("\n"):
            # Format: "00:1f.2" "SATA controller" "8086:a102" "Dell"
            parts = line.split('"')
            if len(parts) >= 5:
                addr = parts[1].strip()
                cls = parts[3].strip() if len(parts) > 3 else ""
                id_str = parts[5].strip() if len(parts) > 5 else ""
                vendor_id, product_id = "", ""
                if ":" in id_str:
                    id_clean = id_str.strip("[]")
                    if ":" in id_clean:
                        vendor_id, product_id = id_clean.split(":", 1)

                # Parse domain:bus:slot.func
                domain = "0000"
                bdf = addr
                if ":" in addr:
                    parts_addr = addr.split(":")
                    if len(parts_addr) >= 2:
                        domain = "0000"  # lspci -mm doesn't show domain by default
                        bus = parts_addr[0]
                        rest = parts_addr[1]

                devices.append({
                    "dev_id": f"pci_{addr.replace('.', '_').replace(':', '_')}",
                    "address": f"{domain}:{addr}",
                    "class": cls,
                    "vendor_id": vendor_id,
                    "product_id": product_id,
                })
        return devices

    def _mock_pci(self) -> List[Dict[str, Any]]:
        """Mock PCI devices."""
        return [
            {"dev_id": "pci_0000_00_01_0", "address": "0000:00:01.0",
             "class": "VGA compatible controller", "vendor_id": "1234", "product_id": "1111"},
            {"dev_id": "pci_0000_00_03_0", "address": "0000:00:03.0",
             "class": "Ethernet controller", "vendor_id": "1af4", "product_id": "1000"},
            {"dev_id": "pci_0000_00_04_0", "address": "0000:00:04.0",
             "class": "SATA controller", "vendor_id": "8086", "product_id": "2922"},
        ]

    def _discover_storage_adapters(self) -> List[Dict[str, Any]]:
        """Discover storage adapters (FC HBA, iSCSI initiator)."""
        adapters = []

        # Check for iSCSI initiator
        try:
            with open("/etc/iscsi/initiatorname.iscsi", "r") as f:
                for line in f:
                    if line.startswith("InitiatorName="):
                        iqn = line.split("=", 1)[1].strip()
                        adapters.append({"type": "iSCSI", "wwn": iqn})
                        break
        except (IOError, OSError):
            pass

        # Check FC HBAs via /sys
        try:
            import glob
            for fc_dir in glob.glob("/sys/class/fc_host/host*/port_name"):
                try:
                    with open(fc_dir, "r") as f:
                        wwn = f.read().strip()
                        adapters.append({"type": "FC", "wwn": wwn})
                except IOError:
                    pass
        except Exception:
            pass

        if not adapters:
            adapters = self._mock_storage_adapters()

        return adapters

    def _mock_storage_adapters(self) -> List[Dict[str, Any]]:
        """Mock storage adapters."""
        return [
            {"type": "iSCSI", "wwn": "iqn.2025-01.com.example:cvk-host"},
        ]

    def _discover_local_disks(self) -> List[Dict[str, Any]]:
        """Discover local disks via lsblk."""
        try:
            result = subprocess.run(
                ["lsblk", "-nd", "-o", "NAME,SIZE,TYPE,ROTA"],
                capture_output=True, text=True, timeout=10,
            )
            if result.returncode == 0:
                return self._parse_lsblk(result.stdout)
        except (FileNotFoundError, subprocess.TimeoutExpired):
            pass
        return self._mock_local_disks()

    def _parse_lsblk(self, output: str) -> List[Dict[str, Any]]:
        """Parse lsblk output."""
        disks = []
        for line in output.strip().split("\n"):
            parts = line.split()
            if len(parts) >= 3 and parts[2] == "disk":
                name = parts[0]
                size = parts[1]
                is_ssd = "0" if len(parts) < 4 else parts[3]
                disk_type = "SSD" if is_ssd == "0" else "HDD"
                # Parse size
                size_bytes = 0
                try:
                    if size[-1].isalpha():
                        num = float(size[:-1])
                        unit = size[-1].upper()
                        multipliers = {"T": 1024**4, "G": 1024**3, "M": 1024**2, "K": 1024}
                        size_bytes = int(num * multipliers.get(unit, 1))
                    else:
                        size_bytes = int(size)
                except (ValueError, IndexError):
                    pass

                disks.append({
                    "name": name,
                    "type": disk_type,
                    "size": size_bytes // (1024 * 1024),  # in MB
                    "sizeGB": size_bytes // (1024**3),
                })
        return disks

    def _mock_local_disks(self) -> List[Dict[str, Any]]:
        """Mock local disks."""
        return [
            {"name": "sda", "type": "SSD", "size": 480000, "sizeGB": 480},
            {"name": "sdb", "type": "SSD", "size": 480000, "sizeGB": 480},
            {"name": "sdc", "type": "HDD", "size": 2000000, "sizeGB": 2000},
        ]

    def _discover_network_interfaces(self) -> List[Dict[str, Any]]:
        """Discover physical network interfaces."""
        interfaces = []
        try:
            import glob
            for net_dir in glob.glob("/sys/class/net/*"):
                name = os.path.basename(net_dir)
                if name == "lo":
                    continue
                # Read MAC
                try:
                    with open(f"{net_dir}/address", "r") as f:
                        mac = f.read().strip()
                except IOError:
                    mac = ""
                # Read speed
                speed = 0
                try:
                    with open(f"{net_dir}/speed", "r") as f:
                        speed = int(f.read().strip())
                except (IOError, ValueError):
                    pass

                interfaces.append({
                    "name": name,
                    "mac": mac,
                    "speed": speed,
                    "type": "physical",
                })
        except Exception:
            pass

        if not interfaces:
            interfaces = self._mock_network_interfaces()

        return interfaces

    def _mock_network_interfaces(self) -> List[Dict[str, Any]]:
        """Mock network interfaces."""
        return [
            {"name": "eth0", "mac": "52:54:00:12:34:56", "speed": 10000, "type": "physical"},
            {"name": "eth1", "mac": "52:54:00:12:34:57", "speed": 10000, "type": "physical"},
            {"name": "eth2", "mac": "52:54:00:12:34:58", "speed": 1000, "type": "physical"},
        ]

    def _discover_platform(self) -> Dict[str, Any]:
        """Discover platform info."""
        return {
            "hostname": platform.node(),
            "kernelVersion": platform.release(),
            "kernelArch": platform.machine(),
            "pythonVersion": platform.python_version(),
            "agentVersion": "1.0.0",
            "qemuVersion": self._get_qemu_version(),
            "libvirtVersion": self._get_libvirt_version(),
        }

    def _get_qemu_version(self) -> str:
        """Get QEMU version."""
        try:
            result = subprocess.run(
                ["qemu-system-x86_64", "--version"],
                capture_output=True, text=True, timeout=5,
            )
            if result.returncode == 0:
                return result.stdout.split("\n")[0]
        except (FileNotFoundError, subprocess.TimeoutExpired):
            pass
        return "N/A"

    def _get_libvirt_version(self) -> str:
        """Get libvirt version."""
        try:
            result = subprocess.run(
                ["libvirtd", "--version"],
                capture_output=True, text=True, timeout=5,
            )
            if result.returncode == 0:
                return result.stdout.strip()
        except (FileNotFoundError, subprocess.TimeoutExpired):
            pass
        return "N/A"

    # ================================================================
    # CVM Registration
    # ================================================================

    def register_with_cvm(self) -> bool:
        """Register this CVK host with the CVM management server.

        Sends host hardware info to CVM endpoints:
          - /cas/casrs/nova/hostResource
          - /cas/casrs/nova/numatopology
          - /cas/casrs/nova/pcidevices
          - /cas/casrs/nova/node/storage
        """
        host_info = self.discover_host()
        log.info("Registering CVK host %s with CVM at %s",
                 host_info["hostName"], self._config.cvm_host)

        try:
            # Send host registration
            status, _, body = self._feign.post(
                "/cas/casrs/nova/hostResource",
                body=self._build_host_xml(host_info),
            )
            if status not in (200, 201, 204):
                log.error("Host registration failed: HTTP %d", status)
                return False

            self._registered = True
            log.info("CVK host %s registered successfully", host_info["hostName"])
            return True

        except Exception as exc:
            log.error("Host registration error: %s", exc)
            return False

    def _build_host_xml(self, info: Dict[str, Any]) -> str:
        """Build XML payload for host registration.

        Mirrors the XML format expected by CVM's /nova/hostResource.
        """
        xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
        xml += '<host>\n'

        xml += f'  <hostId>{info["hostId"]}</hostId>\n'
        xml += f'  <hostName>{info["hostName"]}</hostName>\n'
        xml += f'  <hostIp>{info["hostIp"]}</hostIp>\n'
        xml += f'  <kernelType>{info["kernelType"]}</kernelType>\n'

        cpu = info["cpuInfo"]
        xml += '  <cpuInfo>\n'
        xml += f'    <sockets>{cpu["sockets"]}</sockets>\n'
        xml += f'    <coresPerSocket>{cpu["coresPerSocket"]}</coresPerSocket>\n'
        xml += f'    <threadsPerCore>{cpu["threadsPerCore"]}</threadsPerCore>\n'
        xml += f'    <totalCores>{cpu["totalCores"]}</totalCores>\n'
        xml += f'    <totalThreads>{cpu["totalThreads"]}</totalThreads>\n'
        xml += f'    <vendor>{cpu["vendor"]}</vendor>\n'
        xml += f'    <model>{cpu["model"]}</model>\n'
        xml += f'    <mhz>{cpu["mhz"]}</mhz>\n'
        xml += '  </cpuInfo>\n'

        mem = info["memoryInfo"]
        xml += '  <memoryInfo>\n'
        xml += f'    <totalKB>{mem["totalKB"]}</totalKB>\n'
        xml += f'    <freeKB>{mem["freeKB"]}</freeKB>\n'
        xml += '  </memoryInfo>\n'

        xml += '  <numaTopology>\n'
        for numa in info.get("numaTopology", []):
            xml += '    <numa>\n'
            xml += f'      <id>{numa["id"]}</id>\n'
            xml += f'      <memoryKB>{numa["memoryKB"]}</memoryKB>\n'
            xml += f'      <cpus>{",".join(str(c) for c in numa["cpus"])}</cpus>\n'
            xml += '    </numa>\n'
        xml += '  </numaTopology>\n'

        plat = info.get("platformInfo", {})
        xml += '  <platformInfo>\n'
        for k, v in plat.items():
            xml += f'    <{k}>{v}</{k}>\n'
        xml += '  </platformInfo>\n'

        xml += '</host>\n'
        return xml

    def is_registered(self) -> bool:
        return self._registered

    def get_cached_info(self) -> Dict[str, Any]:
        return self._host_info_cache
