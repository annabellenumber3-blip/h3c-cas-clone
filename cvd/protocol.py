"""
CVD Protocol Constants — exact match to cvd_error.h, cvd_version.h, libcvd.h
"""

from __future__ import annotations

import json
from dataclasses import dataclass, field
from typing import Optional

# ============================================================================
# Version
# ============================================================================
CVD_VERSION_MAJOR = 1
CVD_VERSION_MINOR = 0
CVD_VERSION_MICRO = 0
CVD_VERSION_STR = f"{CVD_VERSION_MAJOR}.{CVD_VERSION_MINOR}.{CVD_VERSION_MICRO}"
CVD_LIBRARY_NAME = f"libcvd-{CVD_VERSION_STR}"
CVD_COPYRIGHT = "Copyright (C) 2019 New H3C Inc."

# ============================================================================
# Disk Open Flags
# ============================================================================
CVD_DISK_OFLAG_RD = 0x0001
CVD_DISK_OFLAG_RDWR = 0x0002

# ============================================================================
# Disk Create Flags
# ============================================================================
CVD_DISK_CFLAG_INHERIT_BACKING_METADATA = 0x0001

# ============================================================================
# Limits
# ============================================================================
CVD_MAX_PATH = 512
CVD_MAX_SNAPSHOTNAME = 256

# ============================================================================
# Error Codes (exact match to cvd_error.h)
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

# JSON-RPC 2.0 standard errors
CVD_EC_JRPC_PARSE_ERROR = -32700
CVD_EC_JRPC_INVALID_REQUEST = -32600
CVD_EC_JRPC_METHOD_NOT_FOUND = -32601
CVD_EC_JRPC_INVALID_PARAMS = -32602
CVD_EC_JRPC_INTERNAL_ERROR = -32603

ERROR_MESSAGES = {
    CVD_EC_OK: "Success",
    CVD_EC_FAILURE: "General failure",
    CVD_EC_INVALID_ARGUMENT: "Invalid argument",
    CVD_EC_NOT_SUPPORTED: "Not supported",
    CVD_EC_OUT_OF_MEMORY: "Out of memory",
    CVD_EC_INVALID_FORMAT: "Invalid file format",
    CVD_EC_IO: "I/O error",
    CVD_EC_NETWORK: "Network error",
    CVD_EC_OVER_MAX_CONNECTION: "Too many connections",
    CVD_EC_AUTH: "Authentication failed",
}

# ============================================================================
# Data Structures (exact match to libcvd.h)
# ============================================================================
@dataclass
class CvdDataBlock:
    offset: int = 0
    length: int = 0

    def to_dict(self) -> dict:
        return {"offset": self.offset, "length": self.length}

    @classmethod
    def from_dict(cls, d: dict) -> "CvdDataBlock":
        return cls(offset=d.get("offset", 0), length=d.get("length", 0))


@dataclass
class CvdDiskInfo:
    filename: str = ""
    format: str = ""
    actual_size: int = 0
    virtual_size: int = 0
    cluster_size: int = 0
    encrypted: bool = False
    compressed: bool = False
    backing_filename: Optional[str] = None
    backing_fmt: Optional[str] = None

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
    cflags: int = 0
    backing_filename: Optional[str] = None
    backing_fmt: Optional[str] = None
    options: Optional[str] = None

    def to_dict(self) -> dict:
        d = {"cflags": self.cflags}
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
    ip: str = ""
    port: int = 9000
    username: str = ""
    password: str = ""
    vmname: Optional[str] = None
    transport_mode: int = 0

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
            port=d.get("port", 9000),
            username=d.get("username", ""),
            password=d.get("password", ""),
            vmname=d.get("vmname"),
            transport_mode=d.get("transport_mode", 0),
        )


# ============================================================================
# JSON-RPC 2.0 Helpers
# ============================================================================
def make_request(method: str, params: dict = None, req_id: int = 1) -> dict:
    return {
        "jsonrpc": "2.0",
        "method": method,
        "params": params or {},
        "id": req_id,
    }


def make_response(result, req_id: int = 1) -> dict:
    return {
        "jsonrpc": "2.0",
        "result": result,
        "id": req_id,
    }


def make_error(code: int, message: str, req_id: int = 1, data=None) -> dict:
    err: dict = {"code": code, "message": message}
    if data is not None:
        err["data"] = data
    return {
        "jsonrpc": "2.0",
        "error": err,
        "id": req_id,
    }


def get_error_message(code: int) -> str:
    if code <= -32000:
        return "Server error"
    if code == CVD_EC_JRPC_PARSE_ERROR:
        return "Parse error"
    if code == CVD_EC_JRPC_INVALID_REQUEST:
        return "Invalid Request"
    if code == CVD_EC_JRPC_METHOD_NOT_FOUND:
        return "Method not found"
    if code == CVD_EC_JRPC_INVALID_PARAMS:
        return "Invalid params"
    if code == CVD_EC_JRPC_INTERNAL_ERROR:
        return "Internal error"
    return ERROR_MESSAGES.get(code, f"Unknown error {code}")
