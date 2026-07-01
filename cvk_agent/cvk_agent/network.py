"""
CVK Network Manager — mirrors NetworkController.java + VSwitchHandler + OVS operations.

Manages Open vSwitch (OVS) networking on the CVK host:
  - OVS bridge management (create, delete, configure)
  - VLAN tagging (802.1Q)
  - VXLAN tunnel endpoints
  - Port management (add/remove physical NICs)
  - vNIC attachment to VMs
  - Interface listing

The Java CVK agent uses OVS commands directly via ProcessBuilder/Runtime.exec.
The Python clone uses the ovs-vsctl/ovs-ofctl CLI commands with fallback to
mock operations for testing.

OVS Bridge Types:
  - vswitch0: Default management bridge
  - vlan bridges: VLAN-aware bridges for tenant isolation
  - VXLAN tunnels: L2 over L3 overlay for multi-host networking

Network Plugin Types:
  - openvswitch: Standard OVS networking
  - vcfc:       H3C VCFC SDN controller integration
"""

from __future__ import annotations

import logging
import os
import re
import subprocess
import time
from typing import Any, Dict, List, Optional, Tuple

from .config import CvkConfig

log = logging.getLogger(__name__)


# Network plugin types (matching CAS)
NETWORK_PLUGIN_OVS = "openvswitch"
NETWORK_PLUGIN_VCFC = "vcfc"

# vNIC models
NIC_MODEL_VIRTIO = "virtio"
NIC_MODEL_E1000 = "e1000"
NIC_MODEL_RTL8139 = "rtl8139"


class OvsBridge:
    """Represents an OVS bridge."""
    def __init__(self, name: str, bridge_type: str = "ovs",
                 vlan_id: Optional[int] = None, vni: Optional[int] = None):
        self.name = name
        self.bridge_type = bridge_type  # ovs, vlan, vxlan
        self.vlan_id = vlan_id
        self.vni = vni
        self.ports: List[str] = []      # Port names
        self.fail_mode: str = "secure"

    def to_dict(self) -> Dict[str, Any]:
        return {
            "name": self.name,
            "type": self.bridge_type,
            "vlanId": self.vlan_id,
            "vni": self.vni,
            "ports": self.ports,
            "failMode": self.fail_mode,
        }


class NetworkInterface:
    """Represents a network interface on the host."""
    def __init__(self, name: str, mac: str = "", mtu: int = 1500,
                 state: str = "up", speed: int = 0, if_type: str = "physical"):
        self.name = name
        self.mac = mac
        self.mtu = mtu
        self.state = state
        self.speed = speed
        self.if_type = if_type  # physical, bond, vlan, bridge, vxlan, tap

    def to_dict(self) -> Dict[str, Any]:
        return {
            "name": self.name,
            "mac": self.mac,
            "mtu": self.mtu,
            "state": self.state,
            "speed": self.speed,
            "type": self.if_type,
        }


class VmNetworkInterface:
    """Represents a VM's virtual network interface."""
    def __init__(self, vm_name: str, mac: str, bridge: str,
                 model: str = NIC_MODEL_VIRTIO, vlan: Optional[int] = None,
                 tap_dev: str = ""):
        self.vm_name = vm_name
        self.mac = mac
        self.bridge = bridge
        self.model = model
        self.vlan = vlan
        self.tap_dev = tap_dev

    def to_dict(self) -> Dict[str, Any]:
        return {
            "vmName": self.vm_name,
            "mac": self.mac,
            "bridge": self.bridge,
            "model": self.model,
            "vlan": self.vlan,
            "tapDev": self.tap_dev,
        }


class NetworkManager:
    """CVK Open vSwitch network manager.

    Mirrors NetworkController.java + VSwitchHandler + network operations.
    Uses ovs-vsctl/ovs-ofctl CLI with fallback to mock mode.
    """

    def __init__(self, config: CvkConfig):
        self._config = config
        self._mock_mode: bool = False
        self._bridges: Dict[str, OvsBridge] = {}

    def set_mock_mode(self, enabled: bool = True) -> None:
        """Enable mock mode for testing."""
        self._mock_mode = enabled
        if enabled:
            self._init_mock_bridges()

    def _init_mock_bridges(self) -> None:
        """Initialize mock OVS bridges."""
        self._bridges = {
            "vswitch0": OvsBridge(
                name="vswitch0", bridge_type="ovs",
            ),
            "br-vlan-100": OvsBridge(
                name="br-vlan-100", bridge_type="vlan", vlan_id=100,
            ),
            "br-vxlan-5000": OvsBridge(
                name="br-vxlan-5000", bridge_type="vxlan", vni=5000,
            ),
        }
        self._bridges["vswitch0"].ports = ["eth0", "eth1"]

    # ================================================================
    # OVS command helpers
    # ================================================================

    def _ovs_cmd(self, *args: str) -> Tuple[int, str, str]:
        """Run an ovs-vsctl command.

        Returns: (exit_code, stdout, stderr)
        """
        cmd = ["ovs-vsctl"] + list(args)
        if self._mock_mode:
            log.debug("Mock OVS: %s", " ".join(cmd))
            return 0, "", ""

        try:
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
            return result.returncode, result.stdout, result.stderr
        except subprocess.TimeoutExpired:
            log.error("OVS command timed out: %s", " ".join(cmd))
            return -1, "", "Command timed out"
        except FileNotFoundError:
            log.warning("ovs-vsctl not found — using mock mode")
            self._mock_mode = True
            return 0, "", ""

    def _ovs_ofctl(self, bridge: str, *args: str) -> Tuple[int, str, str]:
        """Run an ovs-ofctl command.

        Returns: (exit_code, stdout, stderr)
        """
        cmd = ["ovs-ofctl"] + list(args) + [bridge]
        if self._mock_mode:
            log.debug("Mock ovs-ofctl: %s", " ".join(cmd))
            return 0, "", ""

        try:
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
            return result.returncode, result.stdout, result.stderr
        except subprocess.TimeoutExpired:
            return -1, "", "Command timed out"
        except FileNotFoundError:
            self._mock_mode = True
            return 0, "", ""

    # ================================================================
    # Bridge management
    # ================================================================

    def list_bridges(self) -> List[OvsBridge]:
        """List all OVS bridges on the host.

        Mirrors: VSwitchHandler.getVSwitches()
        """
        if self._mock_mode:
            return list(self._bridges.values())

        code, stdout, stderr = self._ovs_cmd("list-br")
        if code != 0:
            log.error("Failed to list OVS bridges: %s", stderr)
            return []

        bridge_names = stdout.strip().split("\n") if stdout.strip() else []
        bridges = []
        for name in bridge_names:
            if not name:
                continue
            bridge = OvsBridge(name=name)
            # Get ports
            code2, ports_out, _ = self._ovs_cmd("list-ports", name)
            if code2 == 0:
                bridge.ports = [p.strip() for p in ports_out.split("\n") if p.strip()]

            # Check for VLAN tag
            code3, vlan_out, _ = self._ovs_cmd("get", "bridge", name,
                                                "other-config:vlan-limit")
            # Get VXLAN VNI if present
            code4, vni_out, _ = self._ovs_vsctl("get", "interface", name, "options:key")

            bridges.append(bridge)

        return bridges

    def create_bridge(self, name: str, bridge_type: str = "ovs",
                      vlan_id: Optional[int] = None,
                      vni: Optional[int] = None) -> Dict[str, Any]:
        """Create a new OVS bridge.

        Args:
            name: Bridge name
            bridge_type: ovs, vlan, or vxlan
            vlan_id: VLAN ID for VLAN bridges
            vni: VXLAN Network Identifier for VXLAN bridges

        Returns:
            Result dict with success/error
        """
        if self._mock_mode:
            bridge = OvsBridge(name=name, bridge_type=bridge_type,
                               vlan_id=vlan_id, vni=vni)
            self._bridges[name] = bridge
            return {"success": True, "bridge": bridge.to_dict()}

        # Create the bridge
        code, _, stderr = self._ovs_cmd("add-br", name)
        if code != 0:
            return {"success": False, "error": stderr}

        # Configure fail mode
        self._ovs_cmd("set-fail-mode", name, "secure")

        # For VLAN bridges, set VLAN tag
        if vlan_id is not None:
            self._ovs_cmd("set", "bridge", name,
                          f"other-config:vlan-limit={vlan_id}")

        # For VXLAN bridges, create VXLAN port
        if vni is not None:
            vxlan_port = f"vxlan-{name}"
            self._ovs_cmd("add-port", name, vxlan_port,
                          "--", "set", "interface", vxlan_port,
                          "type=vxlan",
                          f"options:key={vni}",
                          f"options:local_ip={self._config.host_ip}",
                          f"options:dst_port={self._config.vxlan_port}")

        log.info("Created OVS bridge: %s (type=%s)", name, bridge_type)
        return {"success": True, "name": name, "type": bridge_type}

    def delete_bridge(self, name: str) -> Dict[str, Any]:
        """Delete an OVS bridge."""
        if self._mock_mode:
            self._bridges.pop(name, None)
            return {"success": True}

        code, _, stderr = self._ovs_cmd("del-br", name)
        if code != 0:
            return {"success": False, "error": stderr}

        log.info("Deleted OVS bridge: %s", name)
        return {"success": True}

    def add_port(self, bridge: str, port: str, port_type: str = "",
                 vlan_tag: Optional[int] = None) -> Dict[str, Any]:
        """Add a port to an OVS bridge.

        Args:
            bridge: Bridge name
            port: Port name (physical NIC or virtual port)
            port_type: Port type (for virtual ports: internal, tap, vxlan, etc.)
            vlan_tag: VLAN tag for the port
        """
        if self._mock_mode:
            br = self._bridges.get(bridge)
            if br:
                br.ports.append(port)
            return {"success": True}

        cmd_args = ["add-port", bridge, port]
        if port_type:
            cmd_args += ["--", "set", "interface", port, f"type={port_type}"]
        if vlan_tag is not None:
            cmd_args += [f"tag={vlan_tag}"]

        code, _, stderr = self._ovs_cmd(*cmd_args)
        if code != 0:
            return {"success": False, "error": stderr}

        log.info("Added port %s to bridge %s", port, bridge)
        return {"success": True}

    def remove_port(self, bridge: str, port: str) -> Dict[str, Any]:
        """Remove a port from an OVS bridge."""
        if self._mock_mode:
            br = self._bridges.get(bridge)
            if br and port in br.ports:
                br.ports.remove(port)
            return {"success": True}

        code, _, stderr = self._ovs_cmd("del-port", bridge, port)
        if code != 0:
            return {"success": False, "error": stderr}

        log.info("Removed port %s from bridge %s", port, bridge)
        return {"success": True}

    # ================================================================
    # VLAN management
    # ================================================================

    def create_vlan_bridge(self, vlan_id: int, physical_port: str) -> Dict[str, Any]:
        """Create a VLAN-aware bridge.

        In H3C CAS, VLAN bridges follow the naming pattern: br-vlan-{id}
        """
        name = f"br-vlan-{vlan_id}"
        result = self.create_bridge(name, bridge_type="vlan", vlan_id=vlan_id)
        if result.get("success"):
            self.add_port(name, physical_port, vlan_tag=vlan_id)
        return result

    def delete_vlan_bridge(self, vlan_id: int) -> Dict[str, Any]:
        """Delete a VLAN bridge."""
        name = f"br-vlan-{vlan_id}"
        return self.delete_bridge(name)

    # ================================================================
    # VXLAN management
    # ================================================================

    def create_vxlan_tunnel(self, vni: int, remote_ip: str,
                            local_ip: Optional[str] = None) -> Dict[str, Any]:
        """Create a VXLAN tunnel to a remote CVK host.

        Args:
            vni: VXLAN Network Identifier
            remote_ip: Remote CVK host IP
            local_ip: Local IP for tunnel (defaults to config.host_ip)

        Returns:
            Result dict
        """
        local = local_ip or self._config.host_ip
        tunnel_name = f"vxlan-{vni}"

        if self._mock_mode:
            bridge = OvsBridge(name=f"br-vxlan-{vni}", bridge_type="vxlan", vni=vni)
            self._bridges[f"br-vxlan-{vni}"] = bridge
            return {"success": True, "bridge": bridge.to_dict()}

        # Ensure the VXLAN bridge exists
        bridge_name = f"br-vxlan-{vni}"
        code, _, _ = self._ovs_cmd("br-exists", bridge_name)
        if code != 0:
            self.create_bridge(bridge_name, bridge_type="vxlan", vni=vni)

        # Add VXLAN port
        result = self.add_port(
            bridge_name, tunnel_name, port_type="vxlan",
        )
        if result.get("success"):
            # Set VXLAN parameters
            self._ovs_cmd(
                "set", "interface", tunnel_name,
                f"options:key={vni}",
                f"options:remote_ip={remote_ip}",
                f"options:local_ip={local}",
                f"options:dst_port={self._config.vxlan_port}",
            )

        log.info("Created VXLAN tunnel: VNI=%d to %s", vni, remote_ip)
        return result

    def delete_vxlan_tunnel(self, vni: int) -> Dict[str, Any]:
        """Delete a VXLAN tunnel."""
        tunnel_name = f"vxlan-{vni}"
        bridge_name = f"br-vxlan-{vni}"
        return self.remove_port(bridge_name, tunnel_name)

    # ================================================================
    # VM network attachment
    # ================================================================

    def attach_vm_nic(self, vm_name: str, mac: str, bridge: str,
                      model: str = NIC_MODEL_VIRTIO,
                      vlan: Optional[int] = None) -> Dict[str, Any]:
        """Attach a virtual NIC to a VM.

        In the CVK agent, this is done via libvirt (attachDevice).
        For the network side, we create the tap device for OVS.

        Args:
            vm_name: VM domain name
            mac: MAC address for the vNIC
            bridge: OVS bridge to connect to
            model: NIC model (virtio, e1000, rtl8139)
            vlan: VLAN tag (optional)

        Returns:
            Result dict
        """
        tap_name = f"tap-{vm_name}-{mac.replace(':', '')[-8:]}"

        if self._mock_mode:
            log.info("Mock: Attached NIC %s to VM %s on bridge %s",
                     tap_name, vm_name, bridge)
            return {"success": True, "tapDev": tap_name, "mac": mac, "bridge": bridge}

        # Create tap interface and add to bridge
        try:
            # The tap device is typically created by libvirt/qemu,
            # but we tell OVS about it
            self.add_port(bridge, tap_name, port_type="")
            if vlan is not None:
                self._ovs_cmd("set", "port", tap_name, f"tag={vlan}")

            log.info("Attached NIC: VM=%s MAC=%s bridge=%s tap=%s",
                     vm_name, mac, bridge, tap_name)
            return {"success": True, "tapDev": tap_name, "mac": mac, "bridge": bridge}
        except Exception as exc:
            return {"success": False, "error": str(exc)}

    def detach_vm_nic(self, vm_name: str, mac: str, bridge: str) -> Dict[str, Any]:
        """Detach a virtual NIC from a VM."""
        tap_name = f"tap-{vm_name}-{mac.replace(':', '')[-8:]}"

        if self._mock_mode:
            log.info("Mock: Detached NIC from VM %s (MAC: %s)", vm_name, mac)
            return {"success": True}

        return self.remove_port(bridge, tap_name)

    # ================================================================
    # Interface discovery
    # ================================================================

    def list_interfaces(self) -> List[NetworkInterface]:
        """List all network interfaces on the host.

        Mirrors: Interface listing for CVM's network management endpoints.
        """
        interfaces = []

        if self._mock_mode:
            return self._mock_interfaces()

        try:
            import glob
            for net_dir in glob.glob("/sys/class/net/*"):
                name = os.path.basename(net_dir)
                if name == "lo":
                    continue

                mac = ""
                try:
                    with open(f"{net_dir}/address", "r") as f:
                        mac = f.read().strip()
                except IOError:
                    pass

                mtu = 1500
                try:
                    with open(f"{net_dir}/mtu", "r") as f:
                        mtu = int(f.read().strip())
                except (IOError, ValueError):
                    pass

                state = "up"
                try:
                    with open(f"{net_dir}/operstate", "r") as f:
                        state = f.read().strip()
                except IOError:
                    pass

                speed = 0
                try:
                    with open(f"{net_dir}/speed", "r") as f:
                        speed = int(f.read().strip())
                except (IOError, ValueError):
                    pass

                if_type = "physical"
                if name.startswith("br-"):
                    if_type = "bridge"
                elif name.startswith("bond"):
                    if_type = "bond"
                elif name.startswith("tap"):
                    if_type = "tap"
                elif name.startswith("vxlan"):
                    if_type = "vxlan"
                elif "." in name:
                    if_type = "vlan"

                interfaces.append(NetworkInterface(
                    name=name, mac=mac, mtu=mtu,
                    state=state, speed=speed, if_type=if_type,
                ))
        except Exception as exc:
            log.error("Failed to list interfaces: %s", exc)
            return self._mock_interfaces()

        return interfaces

    def _mock_interfaces(self) -> List[NetworkInterface]:
        """Return mock interfaces."""
        return [
            NetworkInterface("eth0", "52:54:00:12:34:56", 1500, "up", 10000),
            NetworkInterface("eth1", "52:54:00:12:34:57", 1500, "up", 10000),
            NetworkInterface("eth2", "52:54:00:12:34:58", 1500, "down", 1000),
            NetworkInterface("vswitch0", "52:54:00:aa:bb:cc", 1500, "up", 0, "bridge"),
        ]

    # ================================================================
    # CVM Reporting
    # ================================================================

    def get_network_summary(self) -> Dict[str, Any]:
        """Get network summary for CVM reporting."""
        bridges = self.list_bridges()
        interfaces = self.list_interfaces()

        return {
            "bridges": [b.to_dict() for b in bridges],
            "interfaces": [i.to_dict() for i in interfaces],
            "ovsVersion": self._get_ovs_version(),
        }

    def _get_ovs_version(self) -> str:
        """Get OVS version."""
        if self._mock_mode:
            return "Mock OVS 2.17.0"
        try:
            result = subprocess.run(
                ["ovs-vsctl", "--version"],
                capture_output=True, text=True, timeout=5,
            )
            if result.returncode == 0:
                return result.stdout.strip().split("\n")[0]
        except (FileNotFoundError, subprocess.TimeoutExpired):
            pass
        return "N/A"
