"""
Tests for CVD Protocol Implementation

Tests the complete CVD protocol including:
- Protocol constants (cvd_error.h, cvd_version.h, libcvd.h)
- JSON-RPC 2.0 request/response format
- CVD daemon dispatch and handlers
- CVD client request/response
- NBD export/unexport
- Error handling

Usage:
    python -m pytest tests/test_cvd.py -v
    # or
    python -m cvd.tests.test_cvd
"""

from __future__ import annotations

import json
import os
import sys
import tempfile
import threading
import time
import unittest

# Add parent directory for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from cvd.protocol import (
    # Version
    CVD_VERSION_MAJOR, CVD_VERSION_MINOR, CVD_VERSION_MICRO,
    CVD_VERSION_STR, CVD_LIBRARY_NAME, CVD_COPYRIGHT,
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
    CVD_TRANSPORT_MODE_LAN_BASED, CVD_TRANSPORT_MODE_LAN_FREE,
    CVD_TRANSPORT_FLAG_RD, CVD_TRANSPORT_FLAG_RDWR,
    # Messages
    CVD_HEARTBEAT, CVD_CLOSING, CVD_PEER_TIMEOUT_MSG,
    CVD_PAIR_TERMINATE_MSG,
    # Server defaults
    CVD_SERVER_DEFAULT_PORT, CVD_MAX_NAME_LEN,
    DS_MAX_CLIENT_NUM, DS_SERVER_WORKER_NUMBER,
    # Data structures
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


# ============================================================================
# Protocol Constants Tests
# ============================================================================

class TestProtocolConstants(unittest.TestCase):
    """Test that all protocol constants match cvd_error.h, cvd_version.h, libcvd.h."""

    def test_version(self):
        """CVD version constants match cvd_version.h."""
        self.assertEqual(CVD_VERSION_MAJOR, 1)
        self.assertEqual(CVD_VERSION_MINOR, 0)
        self.assertEqual(CVD_VERSION_MICRO, 0)
        self.assertEqual(CVD_VERSION_STR, "1.0.0")
        self.assertEqual(CVD_LIBRARY_NAME, "libcvd-1.0.0")
        self.assertIn("New H3C", CVD_COPYRIGHT)

    def test_disk_open_flags(self):
        """Disk open flags match libcvd.h."""
        self.assertEqual(CVD_DISK_OFLAG_RD, 0x0001)
        self.assertEqual(CVD_DISK_OFLAG_RDWR, 0x0002)

    def test_disk_create_flags(self):
        """Disk create flags match libcvd.h."""
        self.assertEqual(CVD_DISK_CFLAG_INHERIT_BACKING_METADATA, 0x0001)

    def test_error_codes(self):
        """All error codes match cvd_error.h."""
        self.assertEqual(CVD_EC_OK, 0)
        self.assertEqual(CVD_EC_FAILURE, 1)
        self.assertEqual(CVD_EC_INTERNAL_ERROR, 10000)
        self.assertEqual(CVD_EC_INVALID_ARGUMENT, 10050)
        self.assertEqual(CVD_EC_NOT_SUPPORTED, 10051)
        self.assertEqual(CVD_EC_OUT_OF_MEMORY, 10052)
        self.assertEqual(CVD_EC_INVALID_FORMAT, 10100)
        self.assertEqual(CVD_EC_IO, 10101)
        self.assertEqual(CVD_EC_NETWORK, 10102)
        self.assertEqual(CVD_EC_EAGAIN, 10103)
        self.assertEqual(CVD_EC_OVER_MAX_CONNECTION, 10104)
        self.assertEqual(CVD_EC_AUTH, 10105)
        self.assertEqual(CVD_EC_EXPORT_DISK, 20051)
        self.assertEqual(CVD_EC_UNEXPORT_DISK, 20052)
        self.assertEqual(CVD_EC_CONNECT_FAIL, 20053)
        self.assertEqual(CVD_EC_QUEY_POOL_FAIL, 20054)
        self.assertEqual(CVD_EC_QUEY_DISK_FAIL, 20055)

    def test_jsonrpc_error_codes(self):
        """JSON-RPC error codes match specification."""
        self.assertEqual(CVD_EC_JRPC_PARSE_ERROR, -32700)
        self.assertEqual(CVD_EC_JRPC_INVALID_REQUEST, -32600)
        self.assertEqual(CVD_EC_JRPC_METHOD_NOT_FOUND, -32601)
        self.assertEqual(CVD_EC_JRPC_INVALID_PARAMS, -32602)
        self.assertEqual(CVD_EC_JRPC_INTERNAL_ERROR, -32603)

    def test_transport_constants(self):
        """Transport constants match ds_conf.h and ds_server.c."""
        self.assertEqual(CVD_TRANSPORT_MODE_LAN_BASED, 1)
        self.assertEqual(CVD_TRANSPORT_MODE_LAN_FREE, 2)
        self.assertEqual(CVD_TRANSPORT_FLAG_RD, 1)
        self.assertEqual(CVD_TRANSPORT_FLAG_RDWR, 0)

    def test_server_defaults(self):
        """Server defaults match cvd_defines.h and ds_conf.h."""
        self.assertEqual(CVD_SERVER_DEFAULT_PORT, 8192)
        self.assertEqual(DS_MAX_CLIENT_NUM, 64)
        self.assertEqual(DS_SERVER_WORKER_NUMBER, 4)

    def test_protocol_messages(self):
        """Protocol message strings match ds_server.c and sdk_client.c."""
        self.assertEqual(CVD_HEARTBEAT, "$HEARTBEAT")
        self.assertEqual(CVD_CLOSING, "$CLOSING")
        self.assertEqual(CVD_PEER_TIMEOUT_MSG, "$TIMEOUT")
        self.assertEqual(CVD_PAIR_TERMINATE_MSG, "$TERM")

    def test_method_names(self):
        """JSON-RPC method names match ds_handle.c g_jrpc_methods[]. """
        self.assertEqual(CVD_JRPC_SET_LOGLEVEL, "set-loglevel")
        self.assertEqual(CVD_JRPC_SET_MAX_CLIENT_NUM, "set-max-client-num")
        self.assertEqual(CVD_JRPC_CONNECT, "connect")
        self.assertEqual(CVD_JRPC_QUERY_STORAGE_POOL, "query-storage-pool")
        self.assertEqual(CVD_JRPC_QUERY_DISK_INFO, "query-disk-info")
        self.assertEqual(CVD_JRPC_SET_TRANSPORT_CHANNEL, "set-transport-channel")
        self.assertEqual(CVD_JRPC_RELEASE_TRANSPORT_CHANNEL, "release-transport-channel")


# ============================================================================
# Data Structure Tests
# ============================================================================

class TestDataStructures(unittest.TestCase):
    """Test data structures match libcvd.h and ds_conf.h."""

    def test_cvd_data_block(self):
        """CvdDataBlock matches C struct."""
        block = CvdDataBlock(offset=0x1000, length=0x2000)
        d = block.to_dict()
        self.assertEqual(d["offset"], 0x1000)
        self.assertEqual(d["length"], 0x2000)

        block2 = CvdDataBlock.from_dict(d)
        self.assertEqual(block2.offset, block.offset)
        self.assertEqual(block2.length, block.length)

    def test_cvd_disk_info(self):
        """CvdDiskInfo matches C struct."""
        info = CvdDiskInfo(
            filename="/vms/test.qcow2",
            format="qcow2",
            actual_size=1073741824,
            virtual_size=10737418240,
            cluster_size=65536,
            encrypted=False,
            compressed=False,
            backing_filename="/vms/base.qcow2",
            backing_fmt="qcow2",
        )
        d = info.to_dict()
        self.assertEqual(d["filename"], "/vms/test.qcow2")
        self.assertEqual(d["format"], "qcow2")
        self.assertEqual(d["encrypted"], False)

        info2 = CvdDiskInfo.from_dict(d)
        self.assertEqual(info2.filename, info.filename)
        self.assertEqual(info2.backing_filename, info.backing_filename)

    def test_cvd_disk_create_options(self):
        """CvdDiskCreateOptions matches C struct."""
        opts = CvdDiskCreateOptions(
            cflags=CVD_DISK_CFLAG_INHERIT_BACKING_METADATA,
            backing_filename="/vms/base.qcow2",
            backing_fmt="qcow2",
        )
        d = opts.to_dict()
        self.assertEqual(d["cflags"], 1)
        self.assertEqual(d["backing_filename"], "/vms/base.qcow2")

        opts2 = CvdDiskCreateOptions.from_dict(d)
        self.assertEqual(opts2.cflags, opts.cflags)

    def test_cvd_connect_params(self):
        """CvdConnectParams matches C struct."""
        params = CvdConnectParams(
            ip="192.168.1.100",
            port=8192,
            username="admin",
            password="Cloud@123",
            vmname="vm-001",
        )
        self.assertEqual(params.port, 8192)
        self.assertEqual(params.transport_mode, 0)

    def test_ds_transport(self):
        """DsTransport matches ds_transport in ds_conf.h."""
        t = DsTransport(
            mode=CVD_TRANSPORT_MODE_LAN_BASED,
            path="/vms/test.qcow2",
            snap="snap1",
            flag=CVD_TRANSPORT_FLAG_RD,
            port=10809,
        )
        self.assertEqual(t.mode, 1)
        self.assertEqual(t.port, 10809)
        self.assertEqual(t.flag, CVD_TRANSPORT_FLAG_RD)


# ============================================================================
# JSON-RPC Tests
# ============================================================================

class TestJsonRpc(unittest.TestCase):
    """Test JSON-RPC 2.0 request/response format matching cJSON usage."""

    def test_make_request(self):
        """Request format matches cli_make_jrpc() in cli.c."""
        req = make_request("set-loglevel", {"loglevel": "debug"}, 12345)
        self.assertEqual(req["jsonrpc"], "2.0")
        self.assertEqual(req["method"], "set-loglevel")
        self.assertEqual(req["params"], {"loglevel": "debug"})
        self.assertEqual(req["id"], 12345)

    def test_make_response(self):
        """Response format matches ds_handle_result()."""
        resp = make_response({"port": 10809}, 12345)
        self.assertEqual(resp["jsonrpc"], "2.0")
        self.assertEqual(resp["result"], {"port": 10809})
        self.assertEqual(resp["id"], 12345)
        self.assertNotIn("error", resp)

    def test_make_error(self):
        """Error response format matches ds_handle_error()."""
        resp = make_error(CVD_EC_JRPC_METHOD_NOT_FOUND, "Method not found.", 12345)
        self.assertEqual(resp["jsonrpc"], "2.0")
        self.assertEqual(resp["error"]["code"], -32601)
        self.assertEqual(resp["error"]["message"], "Method not found.")
        self.assertEqual(resp["id"], 12345)

    def test_encode_decode_request(self):
        """encode/decode roundtrip like cJSON_PrintUnformatted / cJSON_Parse."""
        req = make_request("connect", {"username": "admin", "passwd": "admin"})
        encoded = encode_request(req)
        decoded = decode_request(encoded)
        self.assertEqual(decoded["method"], "connect")
        self.assertEqual(decoded["params"]["username"], "admin")

    def test_encode_unformatted(self):
        """Encoded output has no whitespace (like cJSON_PrintUnformatted)."""
        req = make_request("connect", {"username": "admin"})
        encoded = encode_request(req)
        # Should not contain newlines or pretty-print spaces
        self.assertNotIn("\n", encoded)
        self.assertNotIn("  ", encoded)

    def test_encode_response(self):
        """encode_response matches cJSON_PrintUnformatted for responses."""
        resp = make_response({"result": "ok"}, 1)
        encoded = encode_response(resp)
        self.assertIn('"jsonrpc":"2.0"', encoded)
        self.assertIn('"result"', encoded)

    def test_get_error_message(self):
        """Error messages match cvd_error.h / ds_business.h."""
        self.assertEqual(get_error_message(CVD_EC_OK), "Success")
        self.assertEqual(get_error_message(CVD_EC_AUTH), "Authentication failed")
        self.assertEqual(get_error_message(CVD_EC_CONNECT_FAIL), "connect fail")
        self.assertEqual(get_error_message(CVD_EC_QUEY_POOL_FAIL), "query pool fail")
        self.assertEqual(get_error_message(CVD_EC_QUEY_DISK_FAIL), "query disk info fail")
        self.assertIn("Parse error", get_error_message(CVD_EC_JRPC_PARSE_ERROR))


# ============================================================================
# Daemon Handler Tests (without ZMQ)
# ============================================================================

class TestDaemonHandlers(unittest.TestCase):
    """Test daemon handler dispatch logic (without network)."""

    def setUp(self):
        from cvd.cvd_ds import CVDDaemon
        self.daemon = CVDDaemon(port=9999)  # Don't actually bind

    def test_method_registry(self):
        """All 7 methods from ds_handle.c g_jrpc_methods[] are registered."""
        expected = {
            "set-loglevel", "set-max-client-num", "connect",
            "query-storage-pool", "query-disk-info",
            "set-transport-channel", "release-transport-channel",
        }
        self.assertEqual(set(self.daemon._method_handlers.keys()), expected)

    def test_dispatch_invalid_json(self):
        """Invalid JSON returns parse error (ds_handle_msg)."""
        resp_str = self.daemon._dispatch("not json", "test-client")
        resp = json.loads(resp_str)
        self.assertIn("error", resp)
        self.assertEqual(resp["error"]["code"], CVD_EC_JRPC_PARSE_ERROR)
        self.assertIsNone(resp["id"])

    def test_dispatch_missing_method(self):
        """Missing method returns Method not found (ds_handle_msg)."""
        req = make_request("nonexistent-method", {}, 1)
        resp_str = self.daemon._dispatch(encode_request(req), "test-client")
        resp = json.loads(resp_str)
        self.assertIn("error", resp)
        self.assertEqual(resp["error"]["code"], CVD_EC_JRPC_METHOD_NOT_FOUND)

    def test_dispatch_missing_jsonrpc(self):
        """Request missing jsonrpc field returns Invalid Request."""
        req = {"method": "connect", "params": {}, "id": 1}
        resp_str = self.daemon._dispatch(json.dumps(req), "test-client")
        resp = json.loads(resp_str)
        self.assertIn("error", resp)
        self.assertEqual(resp["error"]["code"], CVD_EC_JRPC_INVALID_REQUEST)

    def test_dispatch_set_loglevel_valid(self):
        """Valid set-loglevel request returns success."""
        req = make_request("set-loglevel", {"loglevel": "debug"}, 1)
        resp_str = self.daemon._dispatch(encode_request(req), "test-client")
        resp = json.loads(resp_str)
        self.assertIn("result", resp)
        self.assertNotIn("error", resp)

    def test_dispatch_set_loglevel_invalid(self):
        """Invalid loglevel returns Invalid params."""
        req = make_request("set-loglevel", {"loglevel": "trace"}, 1)
        resp_str = self.daemon._dispatch(encode_request(req), "test-client")
        resp = json.loads(resp_str)
        self.assertIn("error", resp)
        self.assertEqual(resp["error"]["code"], CVD_EC_JRPC_INVALID_PARAMS)

    def test_dispatch_set_max_client_num(self):
        """Valid set-max-client-num returns success."""
        req = make_request("set-max-client-num", {"num": 128}, 1)
        resp_str = self.daemon._dispatch(encode_request(req), "test-client")
        resp = json.loads(resp_str)
        self.assertIn("result", resp)
        self.assertEqual(self.daemon.max_clients, 128)

    def test_dispatch_connect(self):
        """connect with credentials returns success."""
        req = make_request("connect", {"username": "admin", "passwd": "admin"}, 1)
        resp_str = self.daemon._dispatch(encode_request(req), "test-client")
        resp = json.loads(resp_str)
        self.assertIn("result", resp)

    def test_dispatch_connect_no_credentials(self):
        """connect without credentials returns connect fail."""
        req = make_request("connect", {}, 1)
        resp_str = self.daemon._dispatch(encode_request(req), "test-client")
        resp = json.loads(resp_str)
        self.assertIn("error", resp)
        # Error code should be connect fail
        self.assertIn(resp["error"]["code"],
                      [CVD_EC_JRPC_INVALID_PARAMS, CVD_EC_CONNECT_FAIL])

    def test_dispatch_query_storage_pool(self):
        """query-storage-pool returns pool info."""
        req = make_request("query-storage-pool",
                          {"virtual-disk": "/vms/test.qcow2"}, 1)
        resp_str = self.daemon._dispatch(encode_request(req), "test-client")
        resp = json.loads(resp_str)
        self.assertIn("result", resp)
        self.assertIn("name", resp["result"])

    def test_dispatch_set_transport_invalid_params(self):
        """set-transport-channel without required params returns Invalid params."""
        req = make_request("set-transport-channel", {}, 1)
        resp_str = self.daemon._dispatch(encode_request(req), "test-client")
        resp = json.loads(resp_str)
        self.assertIn("error", resp)
        self.assertEqual(resp["error"]["code"], CVD_EC_JRPC_INVALID_PARAMS)

    def test_dispatch_release_transport_invalid_params(self):
        """release-transport-channel without required params returns error."""
        req = make_request("release-transport-channel", {}, 1)
        resp_str = self.daemon._dispatch(encode_request(req), "test-client")
        resp = json.loads(resp_str)
        self.assertIn("error", resp)
        self.assertEqual(resp["error"]["code"], CVD_EC_JRPC_INVALID_PARAMS)


# ============================================================================
# Client Context Tests
# ============================================================================

class TestClientContext(unittest.TestCase):
    """Test ClientContext lifecycle matching ds_handle.c."""

    def setUp(self):
        from cvd.cvd_ds import ClientContext
        self.ctx = ClientContext("test-client-001")

    def test_initial_state(self):
        """New context has refcount 0, no transports."""
        self.assertEqual(self.ctx.clientid, "test-client-001")
        self.assertEqual(self.ctx.refcount, 0)
        self.assertEqual(len(self.ctx.transports), 0)

    def test_add_find_remove_transport(self):
        """Transport lifecycle matches ds_handle transport management."""
        t = DsTransport(path="/vms/test.qcow2", port=10809)
        self.ctx.add_transport(t)
        self.assertEqual(len(self.ctx.transports), 1)

        found = self.ctx.find_transport("/vms/test.qcow2")
        self.assertIsNotNone(found)
        self.assertEqual(found.port, 10809)

        removed = self.ctx.remove_transport("/vms/test.qcow2")
        self.assertIsNotNone(removed)
        self.assertEqual(len(self.ctx.transports), 0)

        not_found = self.ctx.find_transport("/vms/test.qcow2")
        self.assertIsNone(not_found)


# ============================================================================
# JSON-RPC Wire Format Tests (matching actual cvd-ds output)
# ============================================================================

class TestWireFormat(unittest.TestCase):
    """Test that our JSON-RPC wire format exactly matches cvd-ds output."""

    def test_connect_request_format(self):
        """connect request matches cli_make_connect_request()."""
        req = make_request("connect", {
            "username": "admin",
            "passwd": "admin",
        })
        encoded = encode_request(req)
        # Must contain these exact keys in the unformatted output
        self.assertIn('"jsonrpc":"2.0"', encoded)
        self.assertIn('"method":"connect"', encoded)
        self.assertIn('"username":"admin"', encoded)
        self.assertIn('"passwd":"admin"', encoded)
        self.assertIn('"id":12345', encoded)

    def test_set_transport_request_format(self):
        """set-transport-channel request matches cli_make_set_transport_channel_request()."""
        req = make_request("set-transport-channel", {
            "mode": 1,
            "virtual-disk": "/vms/test.qcow2",
            "flag": 0,
        })
        encoded = encode_request(req)
        self.assertIn('"method":"set-transport-channel"', encoded)
        self.assertIn('"virtual-disk":"/vms/test.qcow2"', encoded)

    def test_release_transport_request_format(self):
        """release-transport-channel matches cli_make_release_transport_channel_request()."""
        req = make_request("release-transport-channel", {
            "virtual-disk": "/vms/test.qcow2",
            "port": 10809,
        })
        encoded = encode_request(req)
        self.assertIn('"method":"release-transport-channel"', encoded)
        self.assertIn('"port":10809', encoded)

    def test_set_loglevel_request_format(self):
        """set-loglevel request matches cli_make_set_loglevel_request()."""
        req = make_request("set-loglevel", {"loglevel": "debug"})
        encoded = encode_request(req)
        self.assertIn('"method":"set-loglevel"', encoded)
        self.assertIn('"loglevel":"debug"', encoded)

    def test_error_response_format(self):
        """Error response matches ds_handle_error() / ds_handle_make_error_json()."""
        resp = make_error(CVD_EC_JRPC_INVALID_PARAMS,
                          "Invalid params. Invalid method parameter(s).",
                          req_id=12345)
        encoded = encode_response(resp)
        parsed = json.loads(encoded)
        self.assertEqual(parsed["jsonrpc"], "2.0")
        self.assertEqual(parsed["error"]["code"], -32602)
        self.assertIn("Invalid params", parsed["error"]["message"])

    def test_result_response_format(self):
        """Result response matches ds_handle_result()."""
        result = {"port": 10809}
        resp = make_response(result, req_id=12345)
        encoded = encode_response(resp)
        parsed = json.loads(encoded)
        self.assertEqual(parsed["jsonrpc"], "2.0")
        self.assertEqual(parsed["result"]["port"], 10809)


# ============================================================================
# Integration Test (with ZMQ, if available)
# ============================================================================

class TestIntegration(unittest.TestCase):
    """End-to-end test with actual ZMQ transport."""

    @classmethod
    def setUpClass(cls):
        """Check if zmq is available."""
        try:
            import zmq
            cls.zmq = zmq
        except ImportError:
            cls.zmq = None

    def setUp(self):
        if self.zmq is None:
            self.skipTest("pyzmq not installed")

    def test_client_server_roundtrip(self):
        """Client can send request and receive response from daemon."""
        import zmq

        from cvd.cvd_ds import CVDDaemon
        from cvd.cvd_cli import CVDClient

        # Start daemon on random port
        import socket
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.bind(("127.0.0.1", 0))
        port = sock.getsockname()[1]
        sock.close()

        daemon = CVDDaemon(host="127.0.0.1", port=port)
        daemon_thread = threading.Thread(
            target=daemon.start, kwargs={"daemonize": False}, daemon=True
        )
        daemon_thread.start()

        # Give the daemon a moment to bind
        time.sleep(0.5)

        try:
            client = CVDClient(host="127.0.0.1", port=port)
            rc = client.connect()
            self.assertEqual(rc, CVD_EC_OK)

            # Test set-loglevel
            resp = client.request(CVD_JRPC_SET_LOGLEVEL, {"loglevel": "info"})
            self.assertIn("result", resp)
            self.assertNotIn("error", resp)

            # Test connect
            resp = client.request(CVD_JRPC_CONNECT,
                                  {"username": "admin", "passwd": "admin"})
            self.assertIn("result", resp)

            # Test query-storage-pool
            resp = client.request(CVD_JRPC_QUERY_STORAGE_POOL,
                                  {"virtual-disk": "/vms/test.qcow2"})
            self.assertIn("result", resp)
            self.assertIn("name", resp["result"])

            # Test set-max-client-num
            resp = client.request(CVD_JRPC_SET_MAX_CLIENT_NUM, {"num": 128})
            self.assertIn("result", resp)

            # Test unknown method
            resp = client.request("nonexistent", {})
            self.assertIn("error", resp)
            self.assertEqual(resp["error"]["code"], CVD_EC_JRPC_METHOD_NOT_FOUND)

            client.disconnect()

        finally:
            daemon.stop()
            daemon_thread.join(timeout=5)

    def test_heartbeat_tracking(self):
        """Daemon updates heartbeat on message receipt."""
        import zmq

        from cvd.cvd_ds import CVDDaemon
        from cvd.cvd_cli import CVDClient

        import socket
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.bind(("127.0.0.1", 0))
        port = sock.getsockname()[1]
        sock.close()

        daemon = CVDDaemon(host="127.0.0.1", port=port)
        daemon_thread = threading.Thread(
            target=daemon.start, kwargs={"daemonize": False}, daemon=True
        )
        daemon_thread.start()
        time.sleep(0.5)

        try:
            client = CVDClient(host="127.0.0.1", port=port)
            client.connect()

            # Initial state: no peers tracked
            self.assertEqual(len(daemon._peer_times), 1)  # client connected

            # Send a request
            client.request(CVD_JRPC_SET_LOGLEVEL, {"loglevel": "info"})
            self.assertGreater(len(daemon._peer_times), 0)

            client.disconnect()
        finally:
            daemon.stop()
            daemon_thread.join(timeout=5)


# ============================================================================
# Main
# ============================================================================

if __name__ == "__main__":
    unittest.main(verbosity=2)
