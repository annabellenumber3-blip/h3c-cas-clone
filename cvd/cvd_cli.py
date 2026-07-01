"""
cvd-cli — CAS Virtual Disk Development Service CLI

Open-source Python clone of the H3C cvd-cli binary.
Implements the exact same subcommands and options.

Usage:
    cvd-cli [-p PORT] <command> [command options]

Commands (matching cli.c):
    set-loglevel -l loglevel
    set-max-client-num -n num
    connect -u username -p password [-d domain]
    query-storage-pool -i image
    set-transport-channel [-m mode] -i image [-s snap] [-f flag]
    release-transport-channel -i image [-s snap] -p port
"""

from __future__ import annotations

import argparse
import json
import logging
import sys
import time
import uuid
from typing import Optional

try:
    import zmq
except ImportError:
    zmq = None

from .protocol import (
    CVD_SERVER_DEFAULT_PORT,
    CVD_EC_OK, CVD_EC_FAILURE,
    CVD_JRPC_SET_LOGLEVEL, CVD_JRPC_SET_MAX_CLIENT_NUM,
    CVD_JRPC_CONNECT, CVD_JRPC_QUERY_STORAGE_POOL,
    CVD_JRPC_QUERY_DISK_INFO, CVD_JRPC_SET_TRANSPORT_CHANNEL,
    CVD_JRPC_RELEASE_TRANSPORT_CHANNEL,
    make_request, encode_request, decode_request,
)

logger = logging.getLogger("cvd-cli")

# Timeout values (matching sdk_client.c)
SDK_CLIENT_REQUEST_TIMEOUT = 30000   # ms
SDK_CLIENT_CONNECT_TIMEOUT = 3000    # ms
SDK_CLIENT_SNDTIMEO = 3000           # ms


class CVDClient:
    """
    CVD SDK Client — communicates with cvd-ds via ZeroMQ DEALER socket.

    Matches the architecture in sdk_client.c:
      - ZMQ_DEALER socket with ZMQ_ROUTING_ID = UUID
      - Connects to tcp://HOST:PORT
      - Sends JSON-RPC 2.0 requests, receives responses
    """

    def __init__(self, host: str = "localhost",
                 port: int = CVD_SERVER_DEFAULT_PORT):
        self.host = host
        self.port = port
        self._context: Optional[zmq.Context] = None
        self._socket: Optional[zmq.Socket] = None
        self._identity: str = ""

    def connect(self) -> int:
        """Connect to the CVD daemon. Returns CVD_EC_OK on success."""
        if zmq is None:
            print("Error: pyzmq is required. Install with: pip install pyzmq",
                  file=sys.stderr)
            return CVD_EC_FAILURE

        try:
            self._context = zmq.Context()
            self._socket = self._context.socket(zmq.DEALER)

            # Set routing ID (matching zmq_setsockopt with ZMQ_ROUTING_ID)
            self._identity = str(uuid.uuid4())
            self._socket.setsockopt(zmq.ROUTING_ID, self._identity.encode())

            # Set timeouts (matching sdk_client.c)
            self._socket.setsockopt(zmq.CONNECT_TIMEOUT, SDK_CLIENT_CONNECT_TIMEOUT)
            self._socket.setsockopt(zmq.SNDTIMEO, SDK_CLIENT_SNDTIMEO)
            self._socket.setsockopt(zmq.RCVTIMEO, SDK_CLIENT_REQUEST_TIMEOUT)
            self._socket.setsockopt(zmq.LINGER, 1000)  # SDK_CLIENT_LINGER

            endpoint = f"tcp://{self.host}:{self.port}"
            self._socket.connect(endpoint)
            logger.debug(f"Connected to {endpoint} with identity {self._identity}")

            return CVD_EC_OK

        except Exception as e:
            logger.error(f"Connect failed: {e}")
            return CVD_EC_FAILURE

    def disconnect(self) -> None:
        """Disconnect from the CVD daemon."""
        if self._socket:
            self._socket.close()
            self._socket = None
        if self._context:
            self._context.term()
            self._context = None

    def request(self, method: str, params: dict,
                req_id: int = 12345) -> dict:
        """Send a JSON-RPC request and return the response.

        Matching sdk_client_request() in sdk_client.c.
        """
        if not self._socket:
            return {"error": {"code": CVD_EC_FAILURE, "message": "Not connected"}}

        req = make_request(method, params, req_id)
        req_str = encode_request(req)

        try:
            self._socket.send_string(req_str)
            logger.debug(f"Sent: {req_str}")

            # Receive response (ZMQ DEALER strips routing frames)
            resp_str = self._socket.recv_string()
            logger.debug(f"Received: {resp_str}")

            return json.loads(resp_str)

        except zmq.Again:
            return {"error": {"code": CVD_EC_FAILURE,
                              "message": "Request timed out"}}
        except Exception as e:
            logger.error(f"Request failed: {e}")
            return {"error": {"code": CVD_EC_FAILURE,
                              "message": str(e)}}


# ============================================================================
# Command Implementations (matching cli.c functions)
# ============================================================================

def cmd_set_loglevel(client: CVDClient, args):
    """set-loglevel -l loglevel (cli_set_loglevel)"""
    if args.loglevel not in ("debug", "info", "warn", "error"):
        print(f"Error: invalid loglevel: {args.loglevel}", file=sys.stderr)
        return 1

    resp = client.request(CVD_JRPC_SET_LOGLEVEL, {"loglevel": args.loglevel})
    print(json.dumps(resp, indent=2))
    return 0


def cmd_set_max_client_num(client: CVDClient, args):
    """set-max-client-num -n num (cli_set_max_client_num)"""
    if not args.num.isdigit():
        print(f"Error: invalid num: {args.num}", file=sys.stderr)
        return 1

    resp = client.request(CVD_JRPC_SET_MAX_CLIENT_NUM, {"num": int(args.num)})
    print(json.dumps(resp, indent=2))
    return 0


def cmd_connect(client: CVDClient, args):
    """connect -u username -p password [-d domain] (cli_connect)"""
    if not args.user:
        print("Error: missing option 'user'", file=sys.stderr)
        return 1
    if not args.password:
        print("Error: missing option 'password'", file=sys.stderr)
        return 1

    params = {"username": args.user, "passwd": args.password}
    if args.domain:
        params["vmname"] = args.domain

    resp = client.request(CVD_JRPC_CONNECT, params)
    print(json.dumps(resp, indent=2))
    return 0


def cmd_query_storage_pool(client: CVDClient, args):
    """query-storage-pool -i image (cli_query_storage_pool)"""
    if not args.image:
        print("Error: missing option 'image'", file=sys.stderr)
        return 1

    resp = client.request(CVD_JRPC_QUERY_STORAGE_POOL,
                          {"virtual-disk": args.image})
    print(json.dumps(resp, indent=2))
    return 0


def cmd_query_disk_info(client: CVDClient, args):
    """query-disk-info -i image (implicit in daemon, added for completeness)"""
    if not args.image:
        print("Error: missing option 'image'", file=sys.stderr)
        return 1

    resp = client.request(CVD_JRPC_QUERY_DISK_INFO,
                          {"virtual-disk": args.image})
    print(json.dumps(resp, indent=2))
    return 0


def cmd_set_transport_channel(client: CVDClient, args):
    """set-transport-channel [-m mode] -i image [-s snap] [-f flag] (cli_set_transport_channel)"""
    if not args.image:
        print("Error: missing option 'image'", file=sys.stderr)
        return 1

    mode = 1  # LAN_BASED default
    if args.mode:
        if args.mode not in ("1", "2"):
            print(f"Error: invalid mode: {args.mode}", file=sys.stderr)
            return 1
        mode = int(args.mode)

    flag = 0  # RDWR default
    if args.flag:
        if args.flag not in ("0", "1"):
            print(f"Error: invalid flag: {args.flag}", file=sys.stderr)
            return 1
        flag = int(args.flag)

    params = {
        "mode": mode,
        "virtual-disk": args.image,
        "flag": flag,
    }
    if args.snap:
        params["snapshot-name"] = args.snap

    resp = client.request(CVD_JRPC_SET_TRANSPORT_CHANNEL, params)
    print(json.dumps(resp, indent=2))
    return 0


def cmd_release_transport_channel(client: CVDClient, args):
    """release-transport-channel -i image [-s snap] -p port (cli_release_transport_channel)"""
    if not args.image:
        print("Error: missing option 'image'", file=sys.stderr)
        return 1
    if not args.port:
        print("Error: missing option 'port'", file=sys.stderr)
        return 1

    params = {
        "virtual-disk": args.image,
        "port": int(args.port),
    }
    if args.snap:
        params["snapshot-name"] = args.snap

    resp = client.request(CVD_JRPC_RELEASE_TRANSPORT_CHANNEL, params)
    print(json.dumps(resp, indent=2))
    return 0


# ============================================================================
# Main
# ============================================================================

def main():
    parser = argparse.ArgumentParser(
        description="cvd-cli — CAS Virtual Disk Development Service utility",
        usage="cvd-cli [-p PORT] <command> [command options]"
    )
    parser.add_argument("-p", "--port", type=int, default=CVD_SERVER_DEFAULT_PORT,
                        help=f"Port to connect cvd-ds (default: {CVD_SERVER_DEFAULT_PORT})")
    parser.add_argument("-s", "--server", default="localhost",
                        help="CVD daemon host (default: localhost)")

    sub = parser.add_subparsers(dest="command", help="Subcommands")

    # set-loglevel
    p_log = sub.add_parser("set-loglevel", help="Set cvd-ds log level",
                           usage="cvd-cli set-loglevel -l loglevel")
    p_log.add_argument("-l", "--loglevel", required=True,
                       help="Log level: debug, info, warn, error")

    # set-max-client-num
    p_max = sub.add_parser("set-max-client-num", help="Set max client number",
                           usage="cvd-cli set-max-client-num -n num")
    p_max.add_argument("-n", "--num", required=True,
                       help="Max client number")

    # connect
    p_conn = sub.add_parser("connect", help="Connect/authenticate to CVM",
                            usage="cvd-cli connect -u username -p password [-d domain]")
    p_conn.add_argument("-u", "--user", help="CVM username")
    p_conn.add_argument("-p", "--password", help="CVM password")
    p_conn.add_argument("-d", "--domain", help="VM domain name")

    # query-storage-pool
    p_pool = sub.add_parser("query-storage-pool", help="Query storage pool for a disk",
                            usage="cvd-cli query-storage-pool -i image")
    p_pool.add_argument("-i", "--image", required=True,
                        help="Full path to disk image")

    # query-disk-info (added for completeness, daemon supports it)
    p_dinfo = sub.add_parser("query-disk-info", help="Query disk info via qemu-img",
                             usage="cvd-cli query-disk-info -i image")
    p_dinfo.add_argument("-i", "--image", required=True,
                         help="Full path to disk image")

    # set-transport-channel
    p_set = sub.add_parser("set-transport-channel", help="Set NBD transport channel",
                           usage="cvd-cli set-transport-channel [-m mode] -i image [-s snap] [-f flag]")
    p_set.add_argument("-m", "--mode", choices=["1", "2"],
                       help="Transport mode: 1=LAN_BASED, 2=LAN_FREE (default: 1)")
    p_set.add_argument("-i", "--image", required=True,
                       help="Full path to disk image")
    p_set.add_argument("-s", "--snap", help="Snapshot name")
    p_set.add_argument("-f", "--flag", choices=["0", "1"],
                       help="Export flag: 0=RDWR, 1=RD (read-only)")

    # release-transport-channel
    p_rel = sub.add_parser("release-transport-channel", help="Release NBD transport channel",
                           usage="cvd-cli release-transport-channel -i image [-s snap] -p port")
    p_rel.add_argument("-i", "--image", required=True,
                       help="Full path to disk image")
    p_rel.add_argument("-s", "--snap", help="Snapshot name")
    p_rel.add_argument("-p", "--port", required=True, type=int,
                       help="NBD export port")

    args = parser.parse_args()

    if not args.command:
        parser.print_help()
        return 1

    # Connect to daemon
    client = CVDClient(host=args.server, port=args.port)
    rc = client.connect()
    if rc != CVD_EC_OK:
        print(f"Error: connect to {args.server}:{args.port} failed",
              file=sys.stderr)
        return 1

    try:
        commands = {
            "set-loglevel": cmd_set_loglevel,
            "set-max-client-num": cmd_set_max_client_num,
            "connect": cmd_connect,
            "query-storage-pool": cmd_query_storage_pool,
            "query-disk-info": cmd_query_disk_info,
            "set-transport-channel": cmd_set_transport_channel,
            "release-transport-channel": cmd_release_transport_channel,
        }

        handler = commands.get(args.command)
        if handler:
            return handler(client, args)
        else:
            print(f"Error: Command not found: {args.command}", file=sys.stderr)
            return 1
    finally:
        client.disconnect()


if __name__ == "__main__":
    sys.exit(main())
