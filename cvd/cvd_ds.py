"""
CVD Daemon — Python clone of cvd-ds.
Listens on TCP socket, handles JSON-RPC 2.0 requests for virtual disk operations.
"""

from __future__ import annotations

import json
import logging
import os
import socket
import struct
import threading
import time
from typing import Dict, Optional

from .protocol import (
    CVD_EC_OK, CVD_EC_INVALID_ARGUMENT, CVD_EC_NOT_SUPPORTED,
    CVD_EC_INTERNAL_ERROR, CVD_EC_JRPC_METHOD_NOT_FOUND,
    CVD_EC_JRPC_INVALID_REQUEST, CVD_EC_JRPC_PARSE_ERROR,
    CvdDiskInfo, CvdDataBlock, CvdDiskCreateOptions,
    CVD_DISK_OFLAG_RD, CVD_DISK_OFLAG_RDWR,
    make_response, make_error, get_error_message,
)

logger = logging.getLogger("cvd-ds")

# Simulated disk store (in production, backed by real files/qemu-img)
_disk_store: Dict[str, dict] = {}
_handle_counter = 0
_handles: Dict[int, dict] = {}
_exported_disks: Dict[str, dict] = {}


class CVDDaemon:
    """CVD Daemon — JSON-RPC 2.0 server for virtual disk operations."""

    def __init__(self, host: str = "0.0.0.0", port: int = 9000,
                 max_connections: int = 100):
        self.host = host
        self.port = port
        self.max_connections = max_connections
        self._sock: Optional[socket.socket] = None
        self._running = False

    def start(self) -> None:
        self._sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self._sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        self._sock.bind((self.host, self.port))
        self._sock.listen(self.max_connections)
        self._running = True
        logger.info(f"CVD daemon listening on {self.host}:{self.port}")

        while self._running:
            try:
                conn, addr = self._sock.accept()
                logger.debug(f"Connection from {addr}")
                threading.Thread(target=self._handle_client, args=(conn, addr),
                                 daemon=True).start()
            except OSError:
                if self._running:
                    raise

    def stop(self) -> None:
        self._running = False
        if self._sock:
            self._sock.close()

    def _handle_client(self, conn: socket.socket, addr: tuple) -> None:
        try:
            while True:
                # Read 4-byte length prefix (network byte order)
                header = self._recv_exact(conn, 4)
                if not header:
                    break
                length = struct.unpack(">I", header)[0]
                if length > 16 * 1024 * 1024:
                    logger.warning(f"Oversized request from {addr}: {length} bytes")
                    break
                data = self._recv_exact(conn, length)
                if not data:
                    break

                response = self._dispatch(data.decode("utf-8"))
                resp_bytes = json.dumps(response).encode("utf-8")
                conn.sendall(struct.pack(">I", len(resp_bytes)) + resp_bytes)
        except Exception as e:
            logger.error(f"Client {addr} error: {e}")
        finally:
            conn.close()

    def _recv_exact(self, sock: socket.socket, n: int) -> Optional[bytes]:
        buf = b""
        while len(buf) < n:
            chunk = sock.recv(n - len(buf))
            if not chunk:
                return None
            buf += chunk
        return buf

    def _dispatch(self, raw: str) -> dict:
        try:
            req = json.loads(raw)
        except json.JSONDecodeError:
            return make_error(CVD_EC_JRPC_PARSE_ERROR, "Parse error", 0)

        if not isinstance(req, dict):
            return make_error(CVD_EC_JRPC_INVALID_REQUEST, "Invalid Request", 0)

        method = req.get("method", "")
        params = req.get("params", {})
        req_id = req.get("id", 0)

        handlers = {
            "disk.create": self._disk_create,
            "disk.open": self._disk_open,
            "disk.close": self._disk_close,
            "disk.read": self._disk_read,
            "disk.write": self._disk_write,
            "disk.get_info": self._disk_get_info,
            "disk.query_data_blocks": self._disk_query_data_blocks,
            "snapshot.create": self._snapshot_create,
            "snapshot.delete": self._snapshot_delete,
            "snapshot.list": self._snapshot_list,
            "export.start": self._export_start,
            "export.stop": self._export_stop,
            "export.query": self._export_query,
            "bitmap.create": self._bitmap_create,
            "bitmap.remove": self._bitmap_remove,
            "bitmap.query": self._bitmap_query,
        }

        handler = handlers.get(method)
        if handler is None:
            return make_error(CVD_EC_JRPC_METHOD_NOT_FOUND,
                              f"Method not found: {method}", req_id)

        try:
            result = handler(params)
            return make_response(result, req_id)
        except Exception as e:
            logger.error(f"Handler {method} error: {e}")
            return make_error(CVD_EC_INTERNAL_ERROR, str(e), req_id)

    # ---- Disk handlers ----
    def _disk_create(self, params: dict) -> dict:
        filename = params.get("filename", "")
        fmt = params.get("format", "qcow2")
        disk_size = params.get("disk_size", 0)
        opts = CvdDiskCreateOptions.from_dict(params.get("create_opts", {}))

        if not filename:
            return {"code": CVD_EC_INVALID_ARGUMENT, "message": "filename required"}

        # Simulate disk creation
        _disk_store[filename] = {
            "filename": filename,
            "format": fmt,
            "virtual_size": disk_size,
            "actual_size": 0,
            "cluster_size": 65536,
            "encrypted": False,
            "compressed": False,
            "backing_filename": opts.backing_filename,
            "backing_fmt": opts.backing_fmt,
        }
        logger.info(f"Created disk: {filename} ({fmt}, {disk_size} bytes)")
        return {"code": CVD_EC_OK, "filename": filename}

    def _disk_open(self, params: dict) -> dict:
        global _handle_counter
        filename = params.get("filename", "")
        fmt = params.get("format")  # None = auto-detect
        snapshot = params.get("snapshotname")
        flags = params.get("flags", CVD_DISK_OFLAG_RD)

        info = _disk_store.get(filename)
        if info is None:
            # Auto-create for non-existent disks (simulation)
            info = {
                "filename": filename, "format": fmt or "qcow2",
                "virtual_size": 10 * 1024 * 1024 * 1024,
                "actual_size": 0, "cluster_size": 65536,
                "encrypted": False, "compressed": False,
            }
            _disk_store[filename] = info

        _handle_counter += 1
        _handles[_handle_counter] = {
            "filename": filename,
            "flags": flags,
            "snapshot": snapshot,
            "offset": 0,
        }
        logger.debug(f"Opened disk {filename} (handle {_handle_counter}, flags={flags})")
        return {"code": CVD_EC_OK, "handle_id": _handle_counter}

    def _disk_close(self, params: dict) -> dict:
        handle_id = params.get("handle_id", 0)
        if handle_id in _handles:
            del _handles[handle_id]
        return {"code": CVD_EC_OK}

    def _disk_read(self, params: dict) -> dict:
        handle_id = params.get("handle_id", 0)
        offset = params.get("offset", 0)
        count = params.get("count", 4096)

        h = _handles.get(handle_id)
        if h is None:
            return {"code": CVD_EC_INVALID_ARGUMENT, "message": "Invalid handle"}

        import base64
        # Simulate reading zero-filled data
        data = b"\x00" * min(count, 1024 * 1024)
        return {"code": CVD_EC_OK, "bytes_read": len(data),
                "data": base64.b64encode(data).decode("ascii")}

    def _disk_write(self, params: dict) -> dict:
        handle_id = params.get("handle_id", 0)
        offset = params.get("offset", 0)

        h = _handles.get(handle_id)
        if h is None:
            return {"code": CVD_EC_INVALID_ARGUMENT, "message": "Invalid handle"}

        import base64
        data = base64.b64decode(params.get("data", ""))
        info = _disk_store.get(h["filename"])
        if info:
            info["actual_size"] = max(info.get("actual_size", 0), offset + len(data))
        return {"code": CVD_EC_OK, "bytes_written": len(data)}

    def _disk_get_info(self, params: dict) -> dict:
        handle_id = params.get("handle_id", 0)
        h = _handles.get(handle_id)
        if h is None:
            return {"code": CVD_EC_INVALID_ARGUMENT, "message": "Invalid handle"}

        info = _disk_store.get(h["filename"], {})
        return {
            "code": CVD_EC_OK,
            "info": {
                "filename": info.get("filename", ""),
                "format": info.get("format", "qcow2"),
                "actual_size": info.get("actual_size", 0),
                "virtual_size": info.get("virtual_size", 0),
                "cluster_size": info.get("cluster_size", 65536),
                "encrypted": info.get("encrypted", False),
                "compressed": info.get("compressed", False),
                "backing_filename": info.get("backing_filename"),
                "backing_fmt": info.get("backing_fmt"),
            },
        }

    def _disk_query_data_blocks(self, params: dict) -> dict:
        handle_id = params.get("handle_id", 0)
        h = _handles.get(handle_id)
        if h is None:
            return {"code": CVD_EC_INVALID_ARGUMENT, "message": "Invalid handle"}

        info = _disk_store.get(h["filename"], {})
        actual = info.get("actual_size", 0)
        blocks = [{"offset": 0, "length": actual}] if actual > 0 else []
        return {"code": CVD_EC_OK, "blocks": blocks}

    # ---- Snapshot handlers ----
    def _snapshot_create(self, params: dict) -> dict:
        logger.info(f"Snapshot created: {params.get('snap_name', '')}")
        return {"code": CVD_EC_OK}

    def _snapshot_delete(self, params: dict) -> dict:
        logger.info(f"Snapshot deleted: {params.get('snap_name', '')}")
        return {"code": CVD_EC_OK}

    def _snapshot_list(self, params: dict) -> dict:
        return {"code": CVD_EC_OK, "snapshots": []}

    # ---- Export handlers ----
    def _export_start(self, params: dict) -> dict:
        filename = params.get("filename", "")
        port = params.get("port", 10809)
        _exported_disks[filename] = {"port": port, "started": time.time()}
        logger.info(f"NBD export started: {filename} on port {port}")
        return {"code": CVD_EC_OK, "port": port}

    def _export_stop(self, params: dict) -> dict:
        filename = params.get("filename", "")
        _exported_disks.pop(filename, None)
        return {"code": CVD_EC_OK}

    def _export_query(self, params: dict) -> dict:
        filename = params.get("filename", "")
        info = _exported_disks.get(filename)
        if info:
            return {"code": CVD_EC_OK, "exported": True, "port": info["port"]}
        return {"code": CVD_EC_OK, "exported": False}

    # ---- Bitmap handlers ----
    def _bitmap_create(self, params: dict) -> dict:
        return {"code": CVD_EC_OK}

    def _bitmap_remove(self, params: dict) -> dict:
        return {"code": CVD_EC_OK}

    def _bitmap_query(self, params: dict) -> dict:
        return {"code": CVD_EC_OK, "bitmaps": []}

    # ---- Handler dispatch table ----


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, format="%(asctime)s [CVD] %(message)s")
    import argparse
    p = argparse.ArgumentParser(description="H3C CVD Daemon (open-source clone)")
    p.add_argument("--port", type=int, default=9000)
    p.add_argument("--host", default="0.0.0.0")
    args = p.parse_args()

    daemon = CVDDaemon(host=args.host, port=args.port)
    try:
        daemon.start()
    except KeyboardInterrupt:
        daemon.stop()
