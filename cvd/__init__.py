"""
H3C CVD (CAS Virtual Disk) Open-Source Implementation
======================================================
Python clone of cvd-ds (CVD Daemon) and cvd-cli (CLI client).

Implements the complete CVD JSON-RPC 2.0 protocol with:
- Disk create/open/close/read/write/get_info
- NBD export/import
- QMP dirty bitmap management
- Connection management (local + remote)
- All error codes from cvd_error.h

Usage:
    # Start daemon:
    python -m cvd.cvd_ds --port 9000

    # CLI operations:
    python -m cvd.cvd_cli create /vms/test.qcow2 qcow2 10G
    python -m cvd.cvd_cli info /vms/test.qcow2
    python -m cvd.cvd_cli export /vms/test.qcow2 --port 10809
"""

from cvd.cvd_ds import CVDDaemon
from cvd.cvd_cli import main as cli_main
from cvd.protocol import (
    CVD_EC_OK, CVD_EC_FAILURE, CVD_EC_INVALID_ARGUMENT,
    CvdConnectParams, CvdDiskInfo, CvdDataBlock, CvdDiskCreateOptions,
    CVD_DISK_OFLAG_RD, CVD_DISK_OFLAG_RDWR,
    CVD_DISK_CFLAG_INHERIT_BACKING_METADATA,
)

__version__ = "1.0.0"
__all__ = [
    "CVDDaemon", "cli_main",
    "CvdConnectParams", "CvdDiskInfo", "CvdDataBlock", "CvdDiskCreateOptions",
    "CVD_EC_OK", "CVD_EC_FAILURE", "CVD_EC_INVALID_ARGUMENT",
    "CVD_DISK_OFLAG_RD", "CVD_DISK_OFLAG_RDWR",
    "CVD_DISK_CFLAG_INHERIT_BACKING_METADATA",
]
