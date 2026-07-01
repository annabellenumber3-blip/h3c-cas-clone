"""
CVD Protocol Constants and Data Structures

Exact match to:
- cvd_error.h  (error codes + JSON-RPC 2.0 standard errors)
- cvd_version.h (version info)
- libcvd.h      (data structures, open flags, create flags)
- cvd_defines.h (transport constants, server defaults)
- ds_conf.h     (transport struct, max client num)
- ds_server.c   (timeout, heartbeat, closing messages)
- ds_handle.c   (JSON-RPC method names and params)
"""

from __future__ import annotations

import json
from dataclasses import dataclass, field
from typing import Optional, List

# ============================================================================
# Version (cvd_version.h)
# ============================================================================
CVD_VERSION_MAJOR = 1
CVD_VERSION_MINOR = 0
CVD_VERSION_MICRO = 0
CVD_VERSION_STR = f"{CVD_VERSION_MAJOR}.{CVD_VERSION_MINOR}.{CVD_VERSION_MICRO}"
CVD_LIBRARY_NAME = f"libcvd-{CVD_VERSION_STR}"
CVD_COPYRIGHT = "Copyright (C) 2019 New H3C Inc."

# ============================================================================
# Server Defaults (cvd_defines.h, ds_server.c, ds_main.c)
# ============================================================================
CVD_SERVER_DEFAULT_PORT = 8192        # Port used in sdk_demo.c cvd_connect
CVD_MAX_NAME_LEN = 64                 # From ds_conf.h / cvd_defines.h
CVD_MAX_PATH = 512                    # From libcvd.h
CVD_MAX_SNAPSHOTNAME = 256            # From libcvd.h
DS_MAX_CLIENT_NUM = 64                # From ds_conf.h
DS_SERVER_WORKER_NUMBER = 4           # From ds_server.c
DS_SERVER_SNDTIMEO = 3000             # ms, from ds_server.c
DS_SERVER_PEER_TIMEOUT = 10000        # ms, from ds_server.c
DS_SERVER_TIMER_IVL = 3000            # ms, from ds_server.c
DS_SERVER_LINGER = 1000               # ms, from sdk_client.c

# ============================================================================
# Transport Messages (ds_server.c, sdk_client.c)
# ============================================================================
CVD_HEARTBEAT = "$HEARTBEAT"          # Client heartbeat message
CVD_CLOSING = "$CLOSING"              # Client disconnect notification
CVD_PEER_TIMEOUT_MSG = "$TIMEOUT"     # Peer timeout notification
CVD_PAIR_TERMINATE_MSG = "$TERM"      # Actor termination message

# ============================================================================
# Disk Open Flags (libcvd.h)
# ============================================================================
CVD_DISK_OFLAG_RD = 0x0001            # Open disk read-only
CVD_DISK_OFLAG_RDWR = 0x0002          # Open disk read-write

# ============================================================================
# Disk Create Flags (libcvd.h)
# ============================================================================
CVD_DISK_CFLAG_INHERIT_BACKING_METADATA = 0x0001

# ============================================================================
# Transport Mode Flags (ds_conf.h)
# ============================================================================
CVD_TRANSPORT_MODE_LAN_BASED = 1      # NBD over TCP
CVD_TRANSPORT_MODE_LAN_FREE = 2       # SAN-based (not implemented)
CVD_TRANSPORT_FLAG_RD = 1             # Read-only export
CVD_TRANSPORT_FLAG_RDWR = 0           # Read-write export

# ============================================================================
# Error Codes (cvd_error.h)
# ============================================================================
CVD_EC_OK = 0
CVD_EC_FAILURE = 1
CVD_EC_INTERNAL_ERROR = 10000
CVD_EC_INVALID_ARGUMENT = 10050
CVD_EC_NOT_SUPPORTED = 10051
CVD_EC_OUT_OF_MEMORY = 10052
CVD_EC_INVALID_FORMAT = 10100
CVD_EC_IO = 10101
CVD_EC_NETWORK = 10102
CVD_EC_EAGAIN = 10103
CVD_EC_OVER_MAX_CONNECTION = 10104
CVD_EC_AUTH = 10105
CVD_EC_EXPORT_DISK = 20051
CVD_EC_UNEXPORT_DISK = 20052
CVD_EC_CONNECT_FAIL = 20053
CVD_EC_QUEY_POOL_FAIL = 20054
CVD_EC_QUEY_DISK_FAIL = 20055

# JSON-RPC 2.0 standard errors (cvd_error.h)
CVD_EC_JRPC_PARSE_ERROR = -32700
CVD_EC_JRPC_INVALID_REQUEST = -32600
CVD_EC_JRPC_METHOD_NOT_FOUND = -32601
CVD_EC_JRPC_INVALID_PARAMS = -32602
CVD_EC_JRPC_INTERNAL_ERROR = -32603

# ============================================================================
# JSON-RPC Methods (ds_handle.c — actual registered names)
# ============================================================================
CVD_JRPC_SET_LOGLEVEL = "set-loglevel"
CVD_JRPC_SET_MAX_CLIENT_NUM = "set-max-client-num"
CVD_JRPC_CONNECT = "connect"
CVD_JRPC_QUERY_STORAGE_POOL = "query-storage-pool"
CVD_JRPC_QUERY_DISK_INFO = "query-disk-info"
CVD_JRPC_SET_TRANSPORT_CHANNEL = "set-transport-channel"
CVD_JRPC_RELEASE_TRANSPORT_CHANNEL = "release-transport-channel"

# Error message strings (ds_business.h)
DS_CONNECT_FAIL_STRING = "connect fail"
DS_QUERY_POOL_FAIL_STRING = "query pool fail"
DS_QUERY_DISK_INFO_FAIL_STRING = "query disk info fail"

ERROR_MESSAGES: dict = {
    CVD_EC_OK: "Success",
    CVD_EC_FAILURE: "General failure",
    CVD_EC_INTERNAL_ERROR: "Internal error",
    CVD_EC_INVALID_ARGUMENT: "Invalid argument",
    CVD_EC_NOT_SUPPORTED: "Not supported",
    CVD_EC_OUT_OF_MEMORY: "Out of memory",
    CVD_EC_INVALID_FORMAT: "Invalid file format",
    CVD_EC_IO: "I/O error",
    CVD_EC_NETWORK: "Network error",
    CVD_EC_EAGAIN: "Resource temporarily unavailable",
    CVD_EC_OVER_MAX_CONNECTION: "Over max connection",
    CVD_EC_AUTH: "Authentication failed",
    CVD_EC_EXPORT_DISK: "Export disk failed",
    CVD_EC_UNEXPORT_DISK: "Unexport disk failed",
    CVD_EC_CONNECT_FAIL: DS_CONNECT_FAIL_STRING,
    CVD_EC_QUEY_POOL_FAIL: DS_QUERY_POOL_FAIL_STRING,
    CVD_EC_QUEY_DISK_FAIL: DS_QUERY_DISK_INFO_FAIL_STRING,
}


def get_error_message(code: int) -> str:
    """Return human-readable error message for an error code."""
    if code == CVD_EC_JRPC_PARSE_ERROR:
        return "Parse error. Invalid JSON was received by the server."
    if code == CVD_EC_JRPC_INVALID_REQUEST:
        return "Invalid Request. The JSON sent is not a valid Request object."
    if code == CVD_EC_JRPC_METHOD_NOT_FOUND:
        return "Method not found."
    if code == CVD_EC_JRPC_INVALID_PARAMS:
        return "Invalid params. Invalid method parameter(s)."
    if code == CVD_EC_JRPC_INTERNAL_ERROR:
        return "Internal error."
    return ERROR_MESSAGES.get(code, f"Unknown error {code}")


# ============================================================================
# Data Structures (exact match to libcvd.h)
# ============================================================================

@dataclass
class CvdDataBlock:
    """Valid (allocated) data block in a sparse disk image."""
    offset: int = 0          # int64_t: offset in virtual disk
    length: int = 0          # int64_t: length of data block

    def to_dict(self) -> dict:
        return {"offset": self.offset, "length": self.length}

    @classmethod
    def from_dict(cls, d: dict) -> "CvdDataBlock":
        return cls(offset=d.get("offset", 0), length=d.get("length", 0))


@dataclass
class CvdDiskInfo:
    """Virtual disk metadata."""
    filename: str = ""
    format: str = ""                        # "raw", "qcow2", etc.
    actual_size: int = 0                    # int64_t: actual disk usage
    virtual_size: int = 0                   # int64_t: virtual disk size
    cluster_size: int = 0                   # int64_t
    encrypted: bool = False
    compressed: bool = False
    backing_filename: Optional[str] = None  # backing file (qcow2 chain)
    backing_fmt: Optional[str] = None       # format of backing file

    def to_dict(self) -> dict:
        return {
            "filename": self.filename,
            "format": self.format,
            "actual_size": self.actual_size,
            "virtual_size": self.virtual_size,
            "cluster_size": self.cluster_size,
            "encrypted": self.encrypted,
            "compressed": self.compressed,
            "backing_filename": self.backing_filename,
            "backing_fmt": self.backing_fmt,
        }

    @classmethod
    def from_dict(cls, d: dict) -> "CvdDiskInfo":
        return cls(
            filename=d.get("filename", ""),
            format=d.get("format", ""),
            actual_size=d.get("actual_size", 0),
            virtual_size=d.get("virtual_size", 0),
            cluster_size=d.get("cluster_size", 0),
            encrypted=d.get("encrypted", False),
            compressed=d.get("compressed", False),
            backing_filename=d.get("backing_filename"),
            backing_fmt=d.get("backing_fmt"),
        )


@dataclass
class CvdDiskCreateOptions:
    """Options for cvd_disk_create()."""
    cflags: int = 0                              # uint64_t: create flags
    backing_filename: Optional[str] = None       # backing file path
    backing_fmt: Optional[str] = None            # backing file format
    options: Optional[str] = None                # qemu-img -o options string

    def to_dict(self) -> dict:
        d: dict = {"cflags": self.cflags}
        if self.backing_filename:
            d["backing_filename"] = self.backing_filename
        if self.backing_fmt:
            d["backing_fmt"] = self.backing_fmt
        if self.options:
            d["options"] = self.options
        return d

    @classmethod
    def from_dict(cls, d: dict) -> "CvdDiskCreateOptions":
        return cls(
            cflags=d.get("cflags", 0),
            backing_filename=d.get("backing_filename"),
            backing_fmt=d.get("backing_fmt"),
            options=d.get("options"),
        )


@dataclass
class CvdConnectParams:
    """Connection parameters for cvd_connect()."""
    ip: str = ""                     # CVK host IP
    port: int = CVD_SERVER_DEFAULT_PORT  # uint32_t
    username: str = ""               # CVM username
    password: str = ""               # CVM password
    vmname: Optional[str] = None     # VM name (NULL = host-level ops)
    transport_mode: int = 0          # uint16_t, reserved, always 0

    def to_dict(self) -> dict:
        return {
            "ip": self.ip,
            "port": self.port,
            "username": self.username,
            "password": self.password,
            "vmname": self.vmname,
            "transport_mode": self.transport_mode,
        }

    @classmethod
    def from_dict(cls, d: dict) -> "CvdConnectParams":
        return cls(
            ip=d.get("ip", ""),
            port=d.get("port", CVD_SERVER_DEFAULT_PORT),
            username=d.get("username", ""),
            password=d.get("password", ""),
            vmname=d.get("vmname"),
            transport_mode=d.get("transport_mode", 0),
        )


@dataclass
class DsTransport:
    """Transport channel (exported NBD disk). Matches ds_transport in ds_conf.h."""
    mode: int = CVD_TRANSPORT_MODE_LAN_BASED   # 1: LAN_BASED, 2: LAN_FREE
    path: str = ""                               # exported disk path (PATH_MAX)
    snap: str = ""                               # snapshot name (CVD_MAX_NAME_LEN)
    flag: int = CVD_TRANSPORT_FLAG_RDWR          # 0: RDWR, 1: RD (CVD_TRANSPORT_FLAG_RD)
    port: int = 0                                # NBD port


# ============================================================================
# JSON-RPC 2.0 Helpers
# ============================================================================

def make_request(method: str, params: dict = None, req_id: int = 12345) -> dict:
    """Create a JSON-RPC 2.0 request object. Default id=12345 (matches CLI)."""
    return {
        "jsonrpc": "2.0",
        "method": method,
        "params": params or {},
        "id": req_id,
    }


def make_response(result, req_id=12345) -> dict:
    """Create a JSON-RPC 2.0 success response."""
    return {
        "jsonrpc": "2.0",
        "result": result,
        "id": req_id,
    }


def make_error(code: int, message: str, req_id=None, data=None) -> dict:
    """Create a JSON-RPC 2.0 error response."""
    err: dict = {"code": code, "message": message}
    if data is not None:
        err["data"] = data
    resp: dict = {
        "jsonrpc": "2.0",
        "error": err,
        "id": req_id,
    }
    return resp


def encode_request(req: dict) -> str:
    """Serialize a JSON-RPC request to string (unformatted, like cJSON_PrintUnformatted)."""
    return json.dumps(req, separators=(",", ":"))


def decode_request(raw: str) -> dict:
    """Parse a JSON-RPC request string."""
    return json.loads(raw)


def encode_response(resp: dict) -> str:
    """Serialize a JSON-RPC response to string (unformatted)."""
    return json.dumps(resp, separators=(",", ":"))
