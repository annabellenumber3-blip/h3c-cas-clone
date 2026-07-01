"""
CVK Storage Manager — mirrors StorageHandler + cvd-ds + libvirt storage pools.

Manages local and shared storage pools on the CVK host:
  - Local directory pools (dir type)
  - NFS shared filesystem pools (fs type)
  - iSCSI targets
  - Ceph RBD pools
  - FC LUNs

The Java CVK agent uses cvd-ds (Cloud Virtual Disk Daemon Service) for
storage management via a UNIX socket. The Python clone uses libvirt
storage pool APIs directly with fallback to direct filesystem operations.

Storage Pool Types (from cvk_agent.conf / STORAGE_TYPE_*):
  - dir:      Local directory pool (default: /vms/images)
  - fs:       Shared filesystem (NFS/GlusterFS)
  - logical:  LVM volume group
  - rbd:      Ceph RBD pool
  - iscsi:    iSCSI target
  - fc:       Fibre Channel LUN

CVD API (from libcvd.h, used by cvd-ds/cvd-cli):
  - cvd_volume_create(name, size, pool)
  - cvd_volume_delete(name, pool)
  - cvd_volume_clone(src, dst, pool)
  - cvd_volume_resize(name, new_size, pool)
  - cvd_pool_list()
  - cvd_pool_info(name)
"""

from __future__ import annotations

import logging
import os
import subprocess
import time
from typing import Any, Dict, List, Optional, Tuple

from .config import CvkConfig

log = logging.getLogger(__name__)

# Try to import libvirt for storage pool management
try:
    import libvirt
    HAS_LIBVIRT = True
except ImportError:
    HAS_LIBVIRT = False


# Storage pool type constants (matching CAS)
STORAGE_TYPE_DIR = "dir"
STORAGE_TYPE_FS = "fs"
STORAGE_TYPE_LOGICAL = "logical"
STORAGE_TYPE_RBD = "rbd"
STORAGE_TYPE_ISCSI = "iscsi"
STORAGE_TYPE_FC = "fc"
STORAGE_TYPE_NFS = "nfs"          # Alias for CAS
STORAGE_TYPE_GLUSTERFS = "gfs"    # GlusterFS in CAS

# Disk format types
DISK_FORMAT_RAW = "raw"
DISK_FORMAT_QCOW2 = "qcow2"
DISK_FORMAT_ISO = "iso"


class StorageVolume:
    """Represents a storage volume (VM disk)."""
    def __init__(self, name: str, pool: str, path: str, capacity: int = 0,
                 allocated: int = 0, format: str = DISK_FORMAT_QCOW2,
                 backing_file: Optional[str] = None):
        self.name = name
        self.pool = pool
        self.path = path
        self.capacity = capacity      # bytes
        self.allocated = allocated    # bytes
        self.format = format
        self.backing_file = backing_file

    def to_dict(self) -> Dict[str, Any]:
        return {
            "name": self.name,
            "pool": self.pool,
            "path": self.path,
            "capacity": self.capacity,
            "allocated": self.allocated,
            "format": self.format,
            "backingFile": self.backing_file,
        }


class StoragePool:
    """Represents a storage pool."""
    def __init__(self, name: str, pool_type: str, path: str,
                 total: int = 0, available: int = 0, used: int = 0,
                 status: int = 1, mount_dev: str = ""):
        self.name = name
        self.pool_type = pool_type
        self.path = path
        self.total = total           # bytes
        self.available = available   # bytes
        self.used = used             # bytes
        self.status = status         # 1 = active, 0 = inactive
        self.mount_dev = mount_dev
        self.volumes: List[StorageVolume] = []

    def to_dict(self) -> Dict[str, Any]:
        return {
            "name": self.name,
            "type": self.pool_type,
            "path": self.path,
            "total": self.total,
            "available": self.available,
            "used": self.used,
            "status": self.status,
            "mountDev": self.mount_dev,
            "volumeCount": len(self.volumes),
        }


class StorageManager:
    """CVK storage manager — mirrors StorageHandler + cvd-ds/libvirt pools.

    Supports:
      - Local directory pools (dir):  /vms/images
      - NFS/GlusterFS pools (fs):     /mnt/nfs/vms
      - iSCSI targets:                via iscsiadm
      - Ceph RBD pools:               via rbd CLI + libvirt
      - FC LUNs:                      via multipath + libvirt
    """

    def __init__(self, config: CvkConfig):
        self._config = config
        self._conn: Any = None
        self._mock_mode: bool = False
        self._pools: Dict[str, StoragePool] = {}

    def set_mock_mode(self, enabled: bool = True) -> None:
        """Enable mock mode for testing."""
        self._mock_mode = enabled
        if enabled:
            self._init_mock_pools()

    def _init_mock_pools(self) -> None:
        """Initialize mock storage pools."""
        self._pools = {
            "local-vms": StoragePool(
                name="local-vms", pool_type=STORAGE_TYPE_DIR,
                path=self._config.local_storage_path,
                total=500 * 1024**3, available=350 * 1024**3,
                used=150 * 1024**3, mount_dev="/dev/sdb1",
            ),
            "local-isos": StoragePool(
                name="local-isos", pool_type=STORAGE_TYPE_DIR,
                path="/vms/isos",
                total=100 * 1024**3, available=80 * 1024**3,
                used=20 * 1024**3, mount_dev="/dev/sdb1",
            ),
            "nfs-share": StoragePool(
                name="nfs-share", pool_type=STORAGE_TYPE_FS,
                path="/mnt/nfs/vms",
                total=2 * 1024**4, available=1.5 * 1024**4,
                used=0.5 * 1024**4,
            ),
        }

    # ================================================================
    # Pool discovery
    # ================================================================

    def discover_pools(self) -> List[StoragePool]:
        """Discover all storage pools on this host."""
        if self._mock_mode:
            return list(self._pools.values())

        pools: List[StoragePool] = []

        # Discover via libvirt if available
        if HAS_LIBVIRT:
            try:
                conn = self._get_libvirt_connection()
                for pool in conn.listAllStoragePools():
                    try:
                        info = pool.info()
                        sp = StoragePool(
                            name=pool.name(),
                            pool_type=self._libvirt_pool_type(pool),
                            path=self._get_pool_path(pool),
                            total=info[1],
                            available=info[3],
                            used=info[2],
                            status=1 if info[0] == libvirt.VIR_STORAGE_POOL_RUNNING else 0,
                        )
                        pools.append(sp)
                    except Exception as exc:
                        log.warning("Failed to get storage pool info: %s", exc)
                return pools
            except Exception as exc:
                log.warning("libvirt storage pool discovery failed: %s", exc)

        # Fall back to local directory discovery
        pools.extend(self._discover_local_dirs())
        pools.extend(self._discover_nfs_mounts())

        return pools

    def _discover_local_dirs(self) -> List[StoragePool]:
        """Discover local directory storage pools."""
        pools = []
        local_path = self._config.local_storage_path
        if os.path.isdir(local_path):
            stat = os.statvfs(local_path)
            total = stat.f_frsize * stat.f_blocks
            available = stat.f_frsize * stat.f_bavail
            used = total - available
            pools.append(StoragePool(
                name="local-vms", pool_type=STORAGE_TYPE_DIR,
                path=local_path, total=total, available=available, used=used,
            ))
        return pools

    def _discover_nfs_mounts(self) -> List[StoragePool]:
        """Discover NFS mounts."""
        pools = []
        nfs_path = self._config.nfs_mount_path
        if os.path.ismount(nfs_path):
            stat = os.statvfs(nfs_path)
            total = stat.f_frsize * stat.f_blocks
            available = stat.f_frsize * stat.f_bavail
            used = total - available
            pools.append(StoragePool(
                name="nfs-share", pool_type=STORAGE_TYPE_FS,
                path=nfs_path, total=total, available=available, used=used,
            ))
        return pools

    # ---- libvirt helpers ----

    def _get_libvirt_connection(self) -> Any:
        """Get libvirt connection."""
        if self._conn is None and HAS_LIBVIRT:
            try:
                self._conn = libvirt.open(self._config.libvirt_uri)
            except libvirt.libvirtError as exc:
                log.error("Failed to connect to libvirt: %s", exc)
                raise
        return self._conn

    @staticmethod
    def _libvirt_pool_type(pool: Any) -> str:
        """Map libvirt pool type to CAS type."""
        try:
            xml = pool.XMLDesc()
            # Parse type from <pool type='dir'>
            import re
            m = re.search(r"<pool type='(\w+)'>", xml)
            if m:
                return m.group(1)
        except Exception:
            pass
        return STORAGE_TYPE_DIR

    @staticmethod
    def _get_pool_path(pool: Any) -> str:
        """Get pool target path from XML."""
        try:
            xml = pool.XMLDesc()
            import re
            m = re.search(r"<path>(.+?)</path>", xml)
            if m:
                return m.group(1)
        except Exception:
            pass
        return ""

    # ================================================================
    # Pool operations
    # ================================================================

    def create_pool(self, name: str, pool_type: str, path: str,
                    source: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Create a new storage pool.

        Args:
            name: Pool name
            pool_type: Type (dir, fs, logical, rbd, iscsi)
            path: Target path for the pool
            source: Optional source configuration (host, device, etc.)

        Returns:
            Result dict with success/error
        """
        if self._mock_mode:
            pool = StoragePool(name=name, pool_type=pool_type, path=path)
            self._pools[name] = pool
            return {"success": True, "pool": pool.to_dict()}

        if HAS_LIBVIRT:
            return self._create_libvirt_pool(name, pool_type, path, source)

        # Fallback: create directory for dir type
        if pool_type in (STORAGE_TYPE_DIR, STORAGE_TYPE_FS):
            try:
                os.makedirs(path, exist_ok=True)
                log.info("Created storage pool directory: %s", path)
                return {"success": True, "name": name, "path": path}
            except OSError as exc:
                return {"success": False, "error": str(exc)}

        return {"success": False, "error": f"Unsupported pool type: {pool_type}"}

    def _create_libvirt_pool(self, name: str, pool_type: str, path: str,
                             source: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Create storage pool via libvirt."""
        try:
            conn = self._get_libvirt_connection()
            xml = self._build_pool_xml(name, pool_type, path, source)
            pool = conn.storagePoolDefineXML(xml)
            pool.create()
            log.info("Created storage pool: %s (type=%s, path=%s)", name, pool_type, path)
            return {"success": True, "name": name, "poolType": pool_type}
        except Exception as exc:
            log.error("Failed to create storage pool %s: %s", name, exc)
            return {"success": False, "error": str(exc)}

    @staticmethod
    def _build_pool_xml(name: str, pool_type: str, path: str,
                        source: Optional[Dict[str, Any]] = None) -> str:
        """Build libvirt storage pool XML."""
        xml = f'<pool type="{pool_type}">\n'
        xml += f'  <name>{name}</name>\n'
        if source:
            xml += '  <source>\n'
            if "host" in source:
                xml += f'    <host name="{source["host"]}"/>\n'
            if "dir" in source:
                xml += f'    <dir path="{source["dir"]}"/>\n'
            if "device" in source:
                xml += f'    <device path="{source["device"]}"/>\n'
            if "name" in source:
                xml += f'    <name>{source["name"]}</name>\n'
            xml += '  </source>\n'
        xml += '  <target>\n'
        xml += f'    <path>{path}</path>\n'
        xml += '  </target>\n'
        xml += '</pool>'
        return xml

    def delete_pool(self, name: str) -> Dict[str, Any]:
        """Delete a storage pool."""
        if self._mock_mode:
            if name in self._pools:
                del self._pools[name]
                return {"success": True}
            return {"success": False, "error": f"Pool not found: {name}"}

        if HAS_LIBVIRT:
            try:
                conn = self._get_libvirt_connection()
                pool = conn.storagePoolLookupByName(name)
                pool.destroy()
                pool.undefine()
                log.info("Deleted storage pool: %s", name)
                return {"success": True}
            except Exception as exc:
                log.error("Failed to delete pool %s: %s", name, exc)
                return {"success": False, "error": str(exc)}

        return {"success": False, "error": "libvirt not available"}

    def refresh_pool(self, name: str) -> Dict[str, Any]:
        """Refresh a storage pool (rescan volumes)."""
        if self._mock_mode:
            return {"success": True, "pool": self._pools.get(name)}

        if HAS_LIBVIRT:
            try:
                conn = self._get_libvirt_connection()
                pool = conn.storagePoolLookupByName(name)
                pool.refresh()
                return {"success": True}
            except Exception as exc:
                log.error("Failed to refresh pool %s: %s", name, exc)
                return {"success": False, "error": str(exc)}

        return {"success": False, "error": "libvirt not available"}

    # ================================================================
    # Volume operations (mirrors cvd_volume_* from libcvd.h)
    # ================================================================

    def list_volumes(self, pool_name: str) -> List[StorageVolume]:
        """List volumes in a storage pool."""
        if self._mock_mode:
            pool = self._pools.get(pool_name)
            return pool.volumes if pool else []

        if HAS_LIBVIRT:
            try:
                conn = self._get_libvirt_connection()
                pool = conn.storagePoolLookupByName(pool_name)
                pool.refresh()
                volumes = []
                for vol in pool.listAllVolumes():
                    try:
                        info = vol.info()
                        volumes.append(StorageVolume(
                            name=vol.name(),
                            pool=pool_name,
                            path=vol.path(),
                            capacity=info[1],
                            allocated=info[2],
                        ))
                    except Exception as exc:
                        log.warning("Failed to get volume info: %s", exc)
                return volumes
            except Exception as exc:
                log.error("Failed to list volumes in %s: %s", pool_name, exc)

        # Fallback: scan directory
        return self._scan_dir_volumes(pool_name)

    def _scan_dir_volumes(self, pool_name: str) -> List[StorageVolume]:
        """Scan a directory for volume files."""
        pool = None
        for p in self.discover_pools():
            if p.name == pool_name:
                pool = p
                break
        if pool is None:
            return []

        volumes = []
        if os.path.isdir(pool.path):
            for fname in os.listdir(pool.path):
                fpath = os.path.join(pool.path, fname)
                if os.path.isfile(fpath):
                    size = os.path.getsize(fpath)
                    fmt = DISK_FORMAT_QCOW2 if fname.endswith(".qcow2") else DISK_FORMAT_RAW
                    volumes.append(StorageVolume(
                        name=fname, pool=pool_name, path=fpath,
                        capacity=size, allocated=size, format=fmt,
                    ))
        return volumes

    def create_volume(self, pool_name: str, name: str, capacity_bytes: int,
                      format: str = DISK_FORMAT_QCOW2) -> Dict[str, Any]:
        """Create a new storage volume (VM disk).

        Mirrors: cvd_volume_create(name, size, pool)
        """
        if self._mock_mode:
            vol = StorageVolume(
                name=name, pool=pool_name,
                path=f"{self._config.local_storage_path}/{name}",
                capacity=capacity_bytes, allocated=0, format=format,
            )
            pool = self._pools.get(pool_name)
            if pool:
                pool.volumes.append(vol)
            log.info("Mock volume created: %s/%s (%d bytes)", pool_name, name, capacity_bytes)
            return {"success": True, "volume": vol.to_dict()}

        if HAS_LIBVIRT:
            try:
                conn = self._get_libvirt_connection()
                pool = conn.storagePoolLookupByName(pool_name)
                xml = (
                    f'<volume><name>{name}</name>'
                    f'<capacity unit="bytes">{capacity_bytes}</capacity>'
                    f'<target><format type="{format}"/></target>'
                    f'</volume>'
                )
                vol = pool.createXML(xml)
                log.info("Volume created: %s/%s", pool_name, name)
                return {"success": True, "name": name, "pool": pool_name, "path": vol.path()}
            except Exception as exc:
                log.error("Failed to create volume %s/%s: %s", pool_name, name, exc)
                return {"success": False, "error": str(exc)}

        # Fallback: create file directly
        try:
            pool = None
            for p in self.discover_pools():
                if p.name == pool_name:
                    pool = p
                    break
            if pool is None:
                return {"success": False, "error": f"Pool not found: {pool_name}"}

            fpath = os.path.join(pool.path, name)
            if format == DISK_FORMAT_QCOW2:
                subprocess.run(
                    ["qemu-img", "create", "-f", "qcow2", fpath, str(capacity_bytes)],
                    capture_output=True, check=True, timeout=60,
                )
            else:
                # Create raw sparse file
                with open(fpath, "wb") as f:
                    f.seek(capacity_bytes - 1)
                    f.write(b'\0')

            log.info("Volume created via fallback: %s/%s", pool_name, name)
            return {"success": True, "name": name, "pool": pool_name, "path": fpath}
        except Exception as exc:
            log.error("Failed to create volume %s/%s: %s", pool_name, name, exc)
            return {"success": False, "error": str(exc)}

    def delete_volume(self, pool_name: str, name: str) -> Dict[str, Any]:
        """Delete a storage volume.

        Mirrors: cvd_volume_delete(name, pool)
        """
        if self._mock_mode:
            pool = self._pools.get(pool_name)
            if pool:
                pool.volumes = [v for v in pool.volumes if v.name != name]
            return {"success": True}

        if HAS_LIBVIRT:
            try:
                conn = self._get_libvirt_connection()
                pool = conn.storagePoolLookupByName(pool_name)
                vol = pool.storageVolLookupByName(name)
                vol.delete()
                log.info("Volume deleted: %s/%s", pool_name, name)
                return {"success": True}
            except Exception as exc:
                log.error("Failed to delete volume %s/%s: %s", pool_name, name, exc)
                return {"success": False, "error": str(exc)}

        # Fallback: delete file
        try:
            pool = None
            for p in self.discover_pools():
                if p.name == pool_name:
                    pool = p
                    break
            if pool is None:
                return {"success": False, "error": f"Pool not found: {pool_name}"}
            fpath = os.path.join(pool.path, name)
            if os.path.isfile(fpath):
                os.unlink(fpath)
            return {"success": True}
        except Exception as exc:
            return {"success": False, "error": str(exc)}

    def clone_volume(self, pool_name: str, src_name: str, dst_name: str) -> Dict[str, Any]:
        """Clone a storage volume.

        Mirrors: cvd_volume_clone(src, dst, pool)
        """
        if self._mock_mode:
            pool = self._pools.get(pool_name)
            src_vol = None
            if pool:
                for v in pool.volumes:
                    if v.name == src_name:
                        src_vol = v
                        break
            if src_vol is None:
                return {"success": False, "error": f"Source volume not found: {src_name}"}

            dst_vol = StorageVolume(
                name=dst_name, pool=pool_name,
                path=f"{self._config.local_storage_path}/{dst_name}",
                capacity=src_vol.capacity, format=src_vol.format,
                backing_file=src_vol.path,
            )
            if pool:
                pool.volumes.append(dst_vol)
            return {"success": True, "volume": dst_vol.to_dict()}

        # Try qemu-img for cloning
        pool = None
        for p in self.discover_pools():
            if p.name == pool_name:
                pool = p
                break
        if pool is None:
            return {"success": False, "error": f"Pool not found: {pool_name}"}

        src_path = os.path.join(pool.path, src_name)
        dst_path = os.path.join(pool.path, dst_name)
        try:
            subprocess.run(
                ["qemu-img", "create", "-f", "qcow2",
                 "-b", src_path, "-F", "qcow2", dst_path],
                capture_output=True, check=True, timeout=120,
            )
            return {"success": True, "name": dst_name, "pool": pool_name, "path": dst_path}
        except Exception as exc:
            return {"success": False, "error": str(exc)}

    def resize_volume(self, pool_name: str, name: str, new_size_bytes: int) -> Dict[str, Any]:
        """Resize a storage volume.

        Mirrors: cvd_volume_resize(name, new_size, pool)
        """
        if self._mock_mode:
            pool = self._pools.get(pool_name)
            if pool:
                for v in pool.volumes:
                    if v.name == name:
                        v.capacity = new_size_bytes
                        return {"success": True, "volume": v.to_dict()}
            return {"success": False, "error": f"Volume not found: {name}"}

        pool = None
        for p in self.discover_pools():
            if p.name == pool_name:
                pool = p
                break
        if pool is None:
            return {"success": False, "error": f"Pool not found: {pool_name}"}

        fpath = os.path.join(pool.path, name)
        try:
            subprocess.run(
                ["qemu-img", "resize", fpath, str(new_size_bytes)],
                capture_output=True, check=True, timeout=60,
            )
            return {"success": True, "name": name, "newSize": new_size_bytes}
        except Exception as exc:
            return {"success": False, "error": str(exc)}

    # ================================================================
    # CVM Reporting
    # ================================================================

    def get_pool_summary(self) -> Dict[str, Any]:
        """Get storage pool summary for CVM reporting.

        Returns the format expected by CVM's /nova/node/storage endpoint:
          {sharePools: {}, localPools: {}}
        """
        pools = self.discover_pools()
        share_pools = {}
        local_pools = {}

        for pool in pools:
            info = {
                "name": pool.name,
                "path": pool.path,
                "type": pool.pool_type,
                "totalSize": pool.total,
                "freeSize": pool.available,
                "preAllocation": 0,
                "status": pool.status,
                "mountDev": pool.mount_dev,
            }
            if pool.pool_type in (STORAGE_TYPE_FS, STORAGE_TYPE_NFS, STORAGE_TYPE_GLUSTERFS):
                share_pools[pool.name] = info
            else:
                mount = pool.mount_dev or pool.path
                local_pools.setdefault(mount, {})[pool.name] = info

        return {"sharePools": share_pools, "localPools": local_pools}

    def close(self) -> None:
        """Close connections."""
        if self._conn:
            try:
                self._conn.close()
            except Exception:
                pass
            self._conn = None
