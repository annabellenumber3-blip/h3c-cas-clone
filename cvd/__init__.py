"""
H3C CVD (CAS Virtual Disk) Open-Source Implementation
======================================================
Python clone of cvd-ds (CVD Daemon) and cvd-cli (CLI client).

Implements the complete CVD JSON-RPC 2.0 protocol over ZeroMQ with:
- All 7 JSON-RPC methods from cvd-ds (ds_handle.c)
- ZMQ ROUTER/DEALER transport (matching ds_server.c + sdk_client.c)
- Heartbeat and timeout monitoring
- NBD export/unexport via qemu-nbd
- Disk info queries via qemu-img
- Storage pool queries via libvirt
- All error codes from cvd_error.h

Wire Protocol:
    Transport: ZeroMQ ROUTER (server) / DEALER (client)
    Framing:   3-part ZMQ message [client_id, real_id, JSON-RPC string]
    Protocol:  JSON-RPC 2.0 (unformatted, matching cJSON_PrintUnformatted)
    Port:      8192 (CVD_SERVER_DEFAULT_PORT, matching sdk_demo.c)

Usage:
    # Start daemon:
    python -m cvd.cvd_ds --port 8192 --no-daemon

    # CLI operations:
    python -m cvd.cvd_cli -p 8192 set-loglevel -l debug
    python -m cvd.cvd_cli -p 8192 connect -u admin -p admin
    python -m cvd.cvd_cli -p 8192 query-storage-pool -i /vms/test.qcow2
    python -m cvd.cvd_cli -p 8192 query-disk-info -i /vms/test.qcow2
    python -m cvd.cvd_cli -p 8192 set-transport-channel -i /vms/test.qcow2 -f 1
    python -m cvd.cvd_cli -p 8192 release-transport-channel -i /vms/test.qcow2 -p 10809
"""

from cvd.cvd_ds import CVDDaemon, main as ds_main
from cvd.cvd_cli import CVDClient, main as cli_main
from cvd.protocol import (
    # Version
    CVD_VERSION_MAJOR, CVD_VERSION_MINOR, CVD_VERSION_MICRO,
    CVD_VERSION_STR, CVD_LIBRARY_NAME,
    # Error codes
    CVD_EC_OK, CVD_EC_FAILURE, CVD_EC_INTERNAL_ERROR,
    CVD_EC_INVALID_ARGUMENT, CVD_EC_NOT_SUPPORTED,
    CVD_EC_OUT_OF_MEMORY, CVD_EC_INVALID_FORMAT,
    CVD_EC_IO, CVD_EC_NETWORK, CVD_EC_EAGAIN,
    CVD_EC_OVER_MAX_CONNECTION, CVD_EC_AUTH,
    CVD_EC_EXPORT_DISK, CVD_EC_UNEXPORT_DISK,
    CVD_EC_CONNECT_FAIL, CVD_EC_QUEY_POOL_FAIL,
    CVD_EC_QUEY_DISK_FAIL,
    # JSON-RPC errors
    CVD_EC_JRPC_PARSE_ERROR, CVD_EC_JRPC_INVALID_REQUEST,
    CVD_EC_JRPC_METHOD_NOT_FOUND, CVD_EC_JRPC_INVALID_PARAMS,
    CVD_EC_JRPC_INTERNAL_ERROR,
    # Flags
    CVD_DISK_OFLAG_RD, CVD_DISK_OFLAG_RDWR,
    CVD_DISK_CFLAG_INHERIT_BACKING_METADATA,
    # Transport
    CVD_TRANSPORT_MODE_LAN_BASED, CVD_TRANSPORT_MODE_LAN_FREE,
    CVD_TRANSPORT_FLAG_RD, CVD_TRANSPORT_FLAG_RDWR,
    CVD_HEARTBEAT, CVD_CLOSING,
    # Structs
    CvdDataBlock, CvdDiskInfo, CvdDiskCreateOptions,
    CvdConnectParams, DsTransport,
    # Helpers
    make_request, make_response, make_error,
    get_error_message, encode_request, decode_request, encode_response,
    # Method names
    CVD_JRPC_SET_LOGLEVEL, CVD_JRPC_SET_MAX_CLIENT_NUM,
    CVD_JRPC_CONNECT, CVD_JRPC_QUERY_STORAGE_POOL,
    CVD_JRPC_QUERY_DISK_INFO, CVD_JRPC_SET_TRANSPORT_CHANNEL,
    CVD_JRPC_RELEASE_TRANSPORT_CHANNEL,
)

__version__ = CVD_VERSION_STR
__all__ = [
    # Core classes
    "CVDDaemon", "CVDClient",
    # Data structures
    "CvdDataBlock", "CvdDiskInfo", "CvdDiskCreateOptions",
    "CvdConnectParams", "DsTransport",
    # Error codes
    "CVD_EC_OK", "CVD_EC_FAILURE", "CVD_EC_INTERNAL_ERROR",
    "CVD_EC_INVALID_ARGUMENT", "CVD_EC_NOT_SUPPORTED",
    "CVD_EC_OUT_OF_MEMORY", "CVD_EC_INVALID_FORMAT",
    "CVD_EC_IO", "CVD_EC_NETWORK", "CVD_EC_EAGAIN",
    "CVD_EC_OVER_MAX_CONNECTION", "CVD_EC_AUTH",
    "CVD_EC_EXPORT_DISK", "CVD_EC_UNEXPORT_DISK",
    "CVD_EC_CONNECT_FAIL", "CVD_EC_QUEY_POOL_FAIL",
    "CVD_EC_QUEY_DISK_FAIL",
    # JSON-RPC errors
    "CVD_EC_JRPC_PARSE_ERROR", "CVD_EC_JRPC_INVALID_REQUEST",
    "CVD_EC_JRPC_METHOD_NOT_FOUND", "CVD_EC_JRPC_INVALID_PARAMS",
    "CVD_EC_JRPC_INTERNAL_ERROR",
    # Flags
    "CVD_DISK_OFLAG_RD", "CVD_DISK_OFLAG_RDWR",
    "CVD_DISK_CFLAG_INHERIT_BACKING_METADATA",
    # Transport
    "CVD_TRANSPORT_MODE_LAN_BASED", "CVD_TRANSPORT_MODE_LAN_FREE",
    "CVD_TRANSPORT_FLAG_RD", "CVD_TRANSPORT_FLAG_RDWR",
    "CVD_HEARTBEAT", "CVD_CLOSING",
    # Helpers
    "make_request", "make_response", "make_error",
    "get_error_message", "encode_request", "decode_request", "encode_response",
    # Method names
    "CVD_JRPC_SET_LOGLEVEL", "CVD_JRPC_SET_MAX_CLIENT_NUM",
    "CVD_JRPC_CONNECT", "CVD_JRPC_QUERY_STORAGE_POOL",
    "CVD_JRPC_QUERY_DISK_INFO", "CVD_JRPC_SET_TRANSPORT_CHANNEL",
    "CVD_JRPC_RELEASE_TRANSPORT_CHANNEL",
]
