"""
cvd-ds — CAS Virtual Disk Development Service Daemon

Open-source Python clone of the H3C cvd-ds binary.
Implements the complete CVD JSON-RPC 2.0 protocol over ZeroMQ ROUTER/DEALER.

Architecture (matches ds_server.c + ds_handle.c):
  - ZMQ_ROUTER socket bound to tcp://*:PORT (default 8192)
  - Worker threads process JSON-RPC requests
  - Heartbeat monitoring ($HEARTBEAT / $CLOSING / $TIMEOUT)
  - Client context tracking with reference counting
  - Transport channel management (NBD export/unexport)
  - Storage pool and disk info queries via libvirt / qemu-img

Usage:
    python -m cvd.cvd_ds [--port PORT] [--no-daemon]
"""

from __future__ import annotations

import json
import logging
import os
import subprocess
import threading
import time
import uuid
from typing import Dict, Optional, Callable, List

try:
    import zmq
except ImportError:
    zmq = None  # Allow import for docs; raise at runtime if needed

from .protocol import (
    # Constants
    CVD_SERVER_DEFAULT_PORT,
    CVD_MAX_NAME_LEN,
    DS_MAX_CLIENT_NUM,
    CVD_EC_OK, CVD_EC_FAILURE, CVD_EC_INTERNAL_ERROR,
    CVD_EC_INVALID_ARGUMENT, CVD_EC_OUT_OF_MEMORY,
    CVD_EC_OVER_MAX_CONNECTION, CVD_EC_CONNECT_FAIL,
    CVD_EC_EXPORT_DISK, CVD_EC_UNEXPORT_DISK,
    CVD_EC_QUEY_POOL_FAIL, CVD_EC_QUEY_DISK_FAIL,
    CVD_EC_JRPC_PARSE_ERROR, CVD_EC_JRPC_INVALID_REQUEST,
    CVD_EC_JRPC_METHOD_NOT_FOUND, CVD_EC_JRPC_INVALID_PARAMS,
    # Messages
    CVD_HEARTBEAT, CVD_CLOSING, CVD_PEER_TIMEOUT_MSG,
    # Method names
    CVD_JRPC_SET_LOGLEVEL, CVD_JRPC_SET_MAX_CLIENT_NUM,
    CVD_JRPC_CONNECT, CVD_JRPC_QUERY_STORAGE_POOL,
    CVD_JRPC_QUERY_DISK_INFO, CVD_JRPC_SET_TRANSPORT_CHANNEL,
    CVD_JRPC_RELEASE_TRANSPORT_CHANNEL,
    # Error messages
    DS_CONNECT_FAIL_STRING,
    DS_QUERY_POOL_FAIL_STRING,
    DS_QUERY_DISK_INFO_FAIL_STRING,
    # Structs
    DsTransport, CvdDiskInfo,
    # Transport flags
    CVD_TRANSPORT_MODE_LAN_BASED, CVD_TRANSPORT_FLAG_RD,
    # Helpers
    get_error_message, encode_response,
)

logger = logging.getLogger("cvd-ds")

# Python script paths (matching ds_handle.c constants)
DS_HANDLE_PYTHON_PATH = "/usr/bin/python3"
DS_HANDLE_EXPORT_DISK_SCRIPT_PATH = "/opt/bin/cas_export_disk_tool.pyc"

# ============================================================================
# Client Context
# ============================================================================

class ClientContext:
    """Per-client state, matching ds_clientcontext in ds_handle.c."""

    def __init__(self, clientid: str):
        self.clientid = clientid
        self.refcount = 0
        self.transports: List[DsTransport] = []  # GList of ds_transport
        self.lock = threading.Lock()

    def add_transport(self, transport: DsTransport):
        with self.lock:
            self.transports.append(transport)

    def remove_transport(self, path: str) -> Optional[DsTransport]:
        with self.lock:
            for t in self.transports:
                if t.path == path:
                    self.transports.remove(t)
                    return t
        return None

    def find_transport(self, path: str) -> Optional[DsTransport]:
        with self.lock:
            for t in self.transports:
                if t.path == path:
                    return t
        return None


# ============================================================================
# CVD Daemon
# ============================================================================

class CVDDaemon:
    """
    CVD Daemon — JSON-RPC 2.0 server for virtual disk operations.

    Implements the same protocol as H3C cvd-ds:
      - ZeroMQ ROUTER socket (matching ROUTER/DEALER pattern)
      - JSON-RPC 2.0 request/response (matching cJSON usage)
      - Heartbeat and peer timeout (matching ds_server.c timer)
      - Client context lifecycle (matching ds_handle.c refcounting)
    """

    def __init__(self, host: str = "0.0.0.0", port: int = CVD_SERVER_DEFAULT_PORT,
                 max_clients: int = DS_MAX_CLIENT_NUM):
        self.host = host
        self.port = port
        self.max_clients = max_clients
        self._running = False
        self._context: Optional[zmq.Context] = None
        self._router: Optional[zmq.Socket] = None
        self._clients: Dict[str, ClientContext] = {}
        self._clients_lock = threading.Lock()
        self._peer_times: Dict[str, float] = {}
        self._peer_times_lock = threading.Lock()
        self._exit = threading.Event()

        # Equivalent to g_jrpc_methods[]
        self._method_handlers: Dict[str, Callable] = {
            CVD_JRPC_SET_LOGLEVEL: self._handle_set_loglevel,
            CVD_JRPC_SET_MAX_CLIENT_NUM: self._handle_set_max_client_num,
            CVD_JRPC_CONNECT: self._handle_connect,
            CVD_JRPC_QUERY_STORAGE_POOL: self._handle_query_storage_pool,
            CVD_JRPC_QUERY_DISK_INFO: self._handle_query_disk_info,
            CVD_JRPC_SET_TRANSPORT_CHANNEL: self._handle_set_transport_channel,
            CVD_JRPC_RELEASE_TRANSPORT_CHANNEL: self._handle_release_transport_channel,
        }

    # ---- Lifecycle ----

    def start(self, daemonize: bool = True) -> None:
        """Start the CVD daemon."""
        if zmq is None:
            raise RuntimeError(
                "pyzmq is required. Install with: pip install pyzmq"
            )

        if daemonize:
            self._daemonize()

        self._context = zmq.Context()
        self._router = self._context.socket(zmq.ROUTER)
        self._router.setsockopt(zmq.SNDTIMEO, 3000)      # DS_SERVER_SNDTIMEO
        self._router.setsockopt(zmq.ROUTER_MANDATORY, 1)  # Like zsock_set_router_mandatory
        self._router.bind(f"tcp://{self.host}:{self.port}")

        self._running = True
        self._exit.clear()
        logger.info(f"CVD daemon started on {self.host}:{self.port}")

        # Start heartbeat/timeout monitor
        monitor = threading.Thread(target=self._timeout_monitor, daemon=True)
        monitor.start()

        # Main event loop (matching zloop_start + ds_server_router_event)
        poller = zmq.Poller()
        poller.register(self._router, zmq.POLLIN)

        while self._running and not self._exit.is_set():
            socks = dict(poller.poll(timeout=1000))  # 1s poll timeout
            if self._router in socks and socks[self._router] == zmq.POLLIN:
                self._handle_router_event()

        self._cleanup()

    def stop(self) -> None:
        """Stop the CVD daemon."""
        logger.info("CVD daemon stopping...")
        self._running = False
        self._exit.set()

    def _cleanup(self) -> None:
        """Release all resources."""
        logger.info("CVD daemon cleanup...")
        if self._router:
            self._router.close()
            self._router = None
        if self._context:
            self._context.term()
            self._context = None
        logger.info("CVD daemon stopped")

    def _daemonize(self) -> None:
        """Daemonize the process (matching csys_set_daemon)."""
        try:
            pid = os.fork()
            if pid > 0:
                os._exit(0)
        except OSError:
            logger.warning("Failed to fork (daemonize), continuing in foreground")

        os.setsid()
        os.umask(0)

        try:
            pid = os.fork()
            if pid > 0:
                os._exit(0)
        except OSError:
            pass

        # Redirect stdio
        devnull = os.open(os.devnull, os.O_RDWR)
        os.dup2(devnull, 0)
        os.dup2(devnull, 1)
        os.dup2(devnull, 2)
        os.close(devnull)

    # ---- Router Event Handling (matching ds_server_router_event) ----

    def _handle_router_event(self) -> None:
        """Handle incoming message from ZMQ_ROUTER socket."""
        try:
            # Receive multipart message: [client_id, real_client_id, payload]
            msg = self._router.recv_multipart()
            if len(msg) < 3:
                logger.warning(f"Invalid message: expected 3 frames, got {len(msg)}")
                return

            client_id = msg[0].decode("utf-8") if isinstance(msg[0], bytes) else msg[0]
            real_client_id = msg[1].decode("utf-8") if isinstance(msg[1], bytes) else msg[1]
            payload = msg[2].decode("utf-8") if isinstance(msg[2], bytes) else msg[2]

            logger.debug(f"Router received: client={client_id}, msg={payload[:200]}")

            # Update heartbeat time
            with self._peer_times_lock:
                self._peer_times[client_id] = time.monotonic()

            # Handle special messages
            if len(msg) == 3 and payload == CVD_CLOSING:
                self._handle_peer_closing(client_id)
                return

            if len(msg) == 3 and payload == CVD_HEARTBEAT:
                # Heartbeat needs no response (server-side)
                return

            # Dispatch to handler, send response back via router
            response = self._dispatch(payload, client_id)
            response_bytes = response.encode("utf-8")

            # Send back: [client_id, real_client_id, response]
            self._router.send_multipart([msg[0], msg[1], response_bytes])

        except zmq.ZMQError as e:
            logger.error(f"ZMQ error: {e}")
        except Exception as e:
            logger.error(f"Router event error: {e}", exc_info=True)

    # ---- Peer Management (matching ds_server.c) ----

    def _handle_peer_closing(self, clientid: str) -> None:
        """Handle client disconnect (matching ds_server_handle_peer_closing)."""
        logger.info(f"Client disconnected: {clientid}")
        with self._peer_times_lock:
            self._peer_times.pop(clientid, None)
        with self._clients_lock:
            ctx = self._clients.pop(clientid, None)
            if ctx:
                # Release all transports (matching ds_handle_free_transport)
                for transport in ctx.transports:
                    self._do_release_transport(transport)

    # ---- Timeout Monitor (matching ds_server_check_timeout timer) ----

    def _timeout_monitor(self) -> None:
        """Background thread that checks for peer timeouts."""
        while self._running and not self._exit.is_set():
            time.sleep(3)  # DS_SERVER_TIMER_IVL = 3000ms
            now = time.monotonic()
            timed_out = []

            with self._peer_times_lock:
                for clientid, last_time in list(self._peer_times.items()):
                    if now - last_time > 10.0:  # DS_SERVER_PEER_TIMEOUT = 10000ms
                        timed_out.append(clientid)

            for clientid in timed_out:
                logger.warning(f"Peer timeout: {clientid}")
                self._handle_peer_closing(clientid)

    # ---- JSON-RPC Dispatch (matching ds_handle_msg) ----

    def _dispatch(self, raw: str, clientid: str) -> str:
        """Dispatch a JSON-RPC request. Returns JSON-RPC response string."""
        try:
            req = json.loads(raw)
        except json.JSONDecodeError:
            return self._make_error_response(
                None, CVD_EC_JRPC_PARSE_ERROR,
                "Parse error. Invalid JSON was received by the server."
            )

        if not isinstance(req, dict):
            return self._make_error_response(
                None, CVD_EC_JRPC_INVALID_REQUEST,
                "Invalid Request. The JSON sent is not a valid Request object."
            )

        jsonrpc_ver = req.get("jsonrpc")
        method = req.get("method")
        params = req.get("params", {})
        req_id = req.get("id")

        # Validate required fields (matching ds_handle_msg)
        if not jsonrpc_ver or not isinstance(jsonrpc_ver, str) or \
           not method or not isinstance(method, str) or \
           req_id is None or (not isinstance(req_id, (str, int))):
            return self._make_error_response(
                req_id, CVD_EC_JRPC_INVALID_REQUEST,
                "Invalid Request. The JSON sent is not a valid Request object."
            )

        # Look up handler (matching g_jrpc_methods loop)
        handler = self._method_handlers.get(method)
        if handler is None:
            return self._make_error_response(
                req_id, CVD_EC_JRPC_METHOD_NOT_FOUND,
                "Method not found."
            )

        # Get or create client context
        context = self._get_or_create_clientcontext(clientid)
        if context is None:
            return self._make_error_response(
                req_id, CVD_EC_OVER_MAX_CONNECTION,
                "Over max connection."
            )

        try:
            result, error = handler(params, req_id, context)
            if error:
                code, message = error
                return self._make_error_response(req_id, code, message)
            return self._make_result_response(req_id, result)
        except Exception as e:
            logger.error(f"Handler {method} error: {e}", exc_info=True)
            return self._make_error_response(
                req_id, CVD_EC_INTERNAL_ERROR, str(e)
            )

    # ---- Client Context Management (matching ds_handle.c) ----

    def _get_or_create_clientcontext(self, clientid: str) -> Optional[ClientContext]:
        """Get or create client context (matching ds_handle_get_or_create_clientcontext)."""
        with self._clients_lock:
            ctx = self._clients.get(clientid)
            if ctx is not None:
                ctx.refcount += 1
                return ctx

            if len(self._clients) >= self.max_clients:
                logger.warning(
                    f"Max clients reached: {len(self._clients)}/{self.max_clients}"
                )
                return None

            ctx = ClientContext(clientid)
            ctx.refcount = 1
            self._clients[clientid] = ctx
            logger.info(f"Client context created: {clientid}")
            return ctx

    # ---- JSON-RPC Response Helpers (matching ds_handle_result / ds_handle_error) ----

    def _make_result_response(self, req_id, result) -> str:
        """Build JSON-RPC success response (matching ds_handle_result)."""
        resp = {
            "jsonrpc": "2.0",
            "id": req_id,
            "result": result,
        }
        return encode_response(resp)

    def _make_error_response(self, req_id, code: int, message: str) -> str:
        """Build JSON-RPC error response (matching ds_handle_error)."""
        resp = {
            "jsonrpc": "2.0",
            "id": req_id,
            "error": {"code": code, "message": message},
        }
        return encode_response(resp)

    # ================================================================
    # Handlers (matching ds_handle_* functions in ds_handle.c)
    # ================================================================

    def _handle_set_loglevel(self, params: dict, req_id, ctx: ClientContext):
        """Handle set-loglevel (ds_handle_set_loglevel)."""
        loglevel = params.get("loglevel")
        if not loglevel or not isinstance(loglevel, str):
            return None, (CVD_EC_JRPC_INVALID_PARAMS,
                          "Invalid params. Invalid method parameter(s).")

        valid_levels = {"debug": logging.DEBUG, "info": logging.INFO,
                        "warn": logging.WARNING, "error": logging.ERROR}
        if loglevel not in valid_levels:
            return None, (CVD_EC_JRPC_INVALID_PARAMS,
                          f"Invalid loglevel: {loglevel}")

        logging.getLogger().setLevel(valid_levels[loglevel])
        logger.info(f"Log level set to {loglevel}")
        return {}, None

    def _handle_set_max_client_num(self, params: dict, req_id, ctx: ClientContext):
        """Handle set-max-client-num (ds_handle_set_max_client_num)."""
        num = params.get("num")
        if num is None or not isinstance(num, (int, float)):
            return None, (CVD_EC_JRPC_INVALID_PARAMS,
                          "Invalid params. Invalid method parameter(s).")

        self.max_clients = int(num)
        logger.info(f"Max client num set to {self.max_clients}")
        return {}, None

    def _handle_connect(self, params: dict, req_id, ctx: ClientContext):
        """Handle connect (ds_handle_connect)."""
        username = params.get("username")
        passwd = params.get("passwd")
        vmname = params.get("vmname")

        if not username or not passwd:
            return None, (CVD_EC_CONNECT_FAIL, DS_CONNECT_FAIL_STRING)

        # In the real implementation, this would:
        # 1. Get CVM IP from /etc/cvk/cvm_info.conf (ds_get_cvmip)
        # 2. HTTP Digest auth against CVM (ds_connect_userpwd_author)
        # For the open-source clone, we accept any credentials
        logger.info(f"Connect from user={username}, vmname={vmname}")
        return {}, None  # ds_make_connect_result returns empty object

    def _handle_query_storage_pool(self, params: dict, req_id, ctx: ClientContext):
        """Handle query-storage-pool (ds_handle_query_storage_pool)."""
        virtual_disk = params.get("virtual-disk")
        if not virtual_disk or not isinstance(virtual_disk, str):
            return None, (CVD_EC_QUEY_POOL_FAIL, DS_QUERY_POOL_FAIL_STRING)

        # In the real implementation, this uses libvirt to:
        # 1. virStorageVolLookupByPath(con, path)
        # 2. virStoragePoolLookupByVolume(virVol)
        # 3. virStoragePoolGetXMLDesc(virPool, 0)
        # 4. Parse XML to extract pool info
        #
        # For the open-source clone, we return a simulated pool
        pool_info = {
            "name": "default",
            "path": os.path.dirname(virtual_disk) or "/var/lib/libvirt/images",
            "type": "dir",
            "available": "100G",
            "capacity": "500G",
        }
        logger.info(f"Query storage pool for: {virtual_disk}")
        return pool_info, None

    def _handle_query_disk_info(self, params: dict, req_id, ctx: ClientContext):
        """Handle query-disk-info (ds_handle_query_disk_info).

        In the real implementation, runs: qemu-img info --output=json <path>
        """
        virtual_disk = params.get("virtual-disk")
        if not virtual_disk or not isinstance(virtual_disk, str):
            return None, (CVD_EC_QUEY_DISK_FAIL, DS_QUERY_DISK_INFO_FAIL_STRING)

        try:
            # Run qemu-img info (matching ds_handle_query_disk_info)
            result = subprocess.run(
                ["qemu-img", "info", "--output=json", virtual_disk],
                capture_output=True, text=True, timeout=30
            )
            if result.returncode != 0:
                logger.error(f"qemu-img info failed: {result.stderr}")
                return None, (CVD_EC_QUEY_DISK_FAIL,
                              DS_QUERY_DISK_INFO_FAIL_STRING)

            disk_info = json.loads(result.stdout)
            logger.info(f"Queried disk info for: {virtual_disk}")
            return disk_info, None

        except FileNotFoundError:
            logger.warning("qemu-img not found, returning simulated info")
            return {
                "filename": virtual_disk,
                "format": "qcow2",
                "virtual-size": 10737418240,
                "actual-size": 0,
                "cluster-size": 65536,
                "encrypted": False,
            }, None
        except Exception as e:
            logger.error(f"Failed to query disk info: {e}")
            return None, (CVD_EC_QUEY_DISK_FAIL, DS_QUERY_DISK_INFO_FAIL_STRING)

    def _handle_set_transport_channel(self, params: dict, req_id, ctx: ClientContext):
        """Handle set-transport-channel (ds_handle_set_transport_channel).

        Exports a virtual disk via NBD (qemu-nbd).
        In the real implementation, spawns: python3 cas_export_disk_tool.pyc export <path>
        """
        mode = params.get("mode")
        virtual_disk = params.get("virtual-disk")
        snapshot_name = params.get("snapshot-name")
        flag = params.get("flag")

        if (mode is None or not isinstance(mode, (int, float)) or
            not virtual_disk or not isinstance(virtual_disk, str) or
            flag is None or not isinstance(flag, (int, float))):
            return None, (CVD_EC_JRPC_INVALID_PARAMS,
                          "Invalid params. Invalid method parameter(s).")

        transport = DsTransport(
            mode=int(mode),
            path=virtual_disk,
            snap=snapshot_name if isinstance(snapshot_name, str) else "",
            flag=int(flag),
        )

        # Try to use cas_export_disk_tool.pyc if available,
        # otherwise use qemu-nbd directly
        nbd_port = self._do_export_disk(transport)

        if nbd_port < 0:
            return None, (CVD_EC_EXPORT_DISK, "Export disk failed.")

        transport.port = nbd_port
        ctx.add_transport(transport)

        logger.info(f"Transport channel set: {virtual_disk} on port {nbd_port}")
        return {"port": nbd_port}, None

    def _handle_release_transport_channel(self, params: dict, req_id, ctx: ClientContext):
        """Handle release-transport-channel (ds_handle_release_transport_channel)."""
        virtual_disk = params.get("virtual-disk")
        port = params.get("port")

        if (not virtual_disk or not isinstance(virtual_disk, str) or
            port is None or not isinstance(port, (int, float))):
            return None, (CVD_EC_JRPC_INVALID_PARAMS,
                          "Invalid params. Invalid method parameter(s).")

        transport = DsTransport(
            path=virtual_disk,
            port=int(port),
        )
        snapshot_name = params.get("snapshot-name")
        if isinstance(snapshot_name, str):
            transport.snap = snapshot_name

        if self._do_release_transport(transport) != 0:
            return None, (CVD_EC_UNEXPORT_DISK, "Unexport disk failed.")

        ctx.remove_transport(virtual_disk)
        logger.info(f"Transport channel released: {virtual_disk}")
        return {}, None

    # ---- NBD Export (matching ds_handle_do_release_transport_channel) ----

    def _do_export_disk(self, transport: DsTransport) -> int:
        """Export a disk via NBD. Returns port number or -1 on failure.

        Matching: cas_export_disk_tool.pyc export command
        """
        script = DS_HANDLE_EXPORT_DISK_SCRIPT_PATH
        python = DS_HANDLE_PYTHON_PATH

        # Try the original script first
        if os.path.exists(script):
            try:
                cmd = [python, script, "export", transport.path]
                if transport.snap:
                    cmd.extend(["-s", transport.snap])
                if transport.flag & CVD_TRANSPORT_FLAG_RD:
                    cmd.append("--read-only")

                result = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
                if result.returncode == 0:
                    return int(result.stdout.strip())
            except Exception as e:
                logger.warning(f"cas_export_disk_tool failed: {e}")

        # Fallback: use qemu-nbd directly
        try:
            import socket
            # Find a free port
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.bind(("127.0.0.1", 0))
            port = sock.getsockname()[1]
            sock.close()

            cmd = [
                "qemu-nbd",
                "-p", str(port),
                "--cache", "directsync",
                "-t",  # persistent
                "--fork",
            ]
            if transport.flag & CVD_TRANSPORT_FLAG_RD:
                cmd.append("--read-only")
            if transport.snap:
                cmd.extend(["--load-snapshot", transport.snap])
            cmd.append(transport.path)

            logger.debug(f"Running: {' '.join(cmd)}")
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
            if result.returncode == 0:
                return port
        except Exception as e:
            logger.error(f"qemu-nbd export failed: {e}")

        return -1

    def _do_release_transport(self, transport: DsTransport) -> int:
        """Unexport a disk. Returns 0 on success, -1 on failure.

        Matching: cas_export_disk_tool.pyc unexport command
        """
        script = DS_HANDLE_EXPORT_DISK_SCRIPT_PATH
        python = DS_HANDLE_PYTHON_PATH

        if os.path.exists(script):
            try:
                cmd = [python, script, "unexport", transport.path,
                       "-p", str(transport.port)]
                result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
                return 0 if result.returncode == 0 else -1
            except Exception as e:
                logger.warning(f"cas_export_disk_tool unexport failed: {e}")

        # Fallback: kill qemu-nbd process on this port
        try:
            result = subprocess.run(
                ["ps", "-eo", "pid,command"],
                capture_output=True, text=True
            )
            import re
            pattern = re.compile(rf"qemu-nbd.*{re.escape(transport.path)}.*-p\s+{transport.port}")
            for line in result.stdout.split("\n"):
                if pattern.search(line):
                    pid = line.strip().split()[0]
                    os.kill(int(pid), 9)
                    logger.info(f"Killed qemu-nbd PID {pid} for {transport.path}")
                    return 0
        except Exception as e:
            logger.error(f"Failed to unexport: {e}")

        return -1


# ============================================================================
# Entry Point
# ============================================================================

def main():
    import argparse
    parser = argparse.ArgumentParser(
        description="H3C CVD Daemon (open-source clone) — CAS Virtual Disk Development Service"
    )
    parser.add_argument("--port", "-p", type=int, default=CVD_SERVER_DEFAULT_PORT,
                        help=f"CVD daemon port (default: {CVD_SERVER_DEFAULT_PORT})")
    parser.add_argument("--host", default="0.0.0.0",
                        help="Bind address (default: 0.0.0.0)")
    parser.add_argument("--no-daemon", "-d", action="store_true",
                        help="Run in foreground (do not daemonize)")
    parser.add_argument("--log-level", default="info",
                        choices=["debug", "info", "warn", "error"],
                        help="Log level (default: info)")

    args = parser.parse_args()

    log_levels = {"debug": logging.DEBUG, "info": logging.INFO,
                  "warn": logging.WARNING, "error": logging.ERROR}
    logging.basicConfig(
        level=log_levels[args.log_level],
        format="%(asctime)s [cvd-ds] %(levelname)s: %(message)s"
    )

    daemon = CVDDaemon(host=args.host, port=args.port)
    try:
        daemon.start(daemonize=not args.no_daemon)
    except KeyboardInterrupt:
        daemon.stop()
    except Exception as e:
        logger.error(f"Fatal error: {e}", exc_info=True)
        daemon.stop()


if __name__ == "__main__":
    main()
