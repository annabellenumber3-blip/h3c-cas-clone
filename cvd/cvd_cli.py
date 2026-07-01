"""
CVD CLI — Python clone of cvd-cli.
Command-line interface for CVD daemon operations.
Usage: python -m cvd.cvd_cli <command> [options]
"""

from __future__ import annotations

import argparse
import json
import socket
import struct
import sys


def send_request(host: str, port: int, method: str, params: dict) -> dict:
    """Send a JSON-RPC request to the CVD daemon."""
    req = {"jsonrpc": "2.0", "method": method, "params": params, "id": 1}
    raw = json.dumps(req).encode("utf-8")

    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.settimeout(30)
    try:
        sock.connect((host, port))
        sock.sendall(struct.pack(">I", len(raw)) + raw)

        header = sock.recv(4)
        if len(header) < 4:
            return {"error": "Connection closed"}
        length = struct.unpack(">I", header)[0]
        data = b""
        while len(data) < length:
            chunk = sock.recv(length - len(data))
            if not chunk:
                break
            data += chunk
        return json.loads(data.decode("utf-8")) if data else {"error": "No response"}
    finally:
        sock.close()


def cmd_create(args):
    params = {
        "filename": args.filename,
        "format": args.format,
        "disk_size": parse_size(args.size),
    }
    if args.backing_file:
        params["create_opts"] = {
            "cflags": 1,
            "backing_filename": args.backing_file,
            "backing_fmt": args.backing_format or "qcow2",
        }
    resp = send_request(args.host, args.port, "disk.create", params)
    print(json.dumps(resp, indent=2))


def cmd_info(args):
    # Open, get info, close
    resp = send_request(args.host, args.port, "disk.open",
                        {"filename": args.filename, "flags": 1})
    if resp.get("result", {}).get("code") != 0:
        print(json.dumps(resp, indent=2))
        return
    handle_id = resp["result"]["handle_id"]

    resp = send_request(args.host, args.port, "disk.get_info",
                        {"handle_id": handle_id})
    print(json.dumps(resp, indent=2))

    send_request(args.host, args.port, "disk.close", {"handle_id": handle_id})


def cmd_export(args):
    params = {"filename": args.filename, "port": args.port}
    if args.read_only:
        params["read_only"] = True
    resp = send_request(args.host, args.port, "export.start", params)
    print(json.dumps(resp, indent=2))


def cmd_unexport(args):
    resp = send_request(args.host, args.port, "export.stop",
                        {"filename": args.filename})
    print(json.dumps(resp, indent=2))


def parse_size(s: str) -> int:
    """Parse size string like '10G', '500M', '1T' to bytes."""
    s = s.upper().strip()
    multipliers = {"K": 1024, "M": 1024**2, "G": 1024**3, "T": 1024**4}
    for suffix, mult in multipliers.items():
        if s.endswith(suffix):
            return int(float(s[:-1]) * mult)
    return int(s)


def main():
    parser = argparse.ArgumentParser(description="H3C CVD CLI (open-source clone)")
    parser.add_argument("--host", default="127.0.0.1", help="CVD daemon host")
    parser.add_argument("--port", type=int, default=9000, help="CVD daemon port")

    sub = parser.add_subparsers(dest="command", required=True)

    # create
    p_create = sub.add_parser("create", help="Create virtual disk")
    p_create.add_argument("filename")
    p_create.add_argument("--format", default="qcow2")
    p_create.add_argument("size", help="Disk size (e.g., 10G, 500M)")
    p_create.add_argument("--backing-file")
    p_create.add_argument("--backing-format", default="qcow2")

    # info
    p_info = sub.add_parser("info", help="Get disk info")
    p_info.add_argument("filename")

    # export
    p_exp = sub.add_parser("export", help="Start NBD export")
    p_exp.add_argument("filename")
    p_exp.add_argument("--port", type=int, default=10809)
    p_exp.add_argument("--read-only", action="store_true")

    # unexport
    p_unexp = sub.add_parser("unexport", help="Stop NBD export")
    p_unexp.add_argument("filename")

    args = parser.parse_args()

    commands = {
        "create": cmd_create,
        "info": cmd_info,
        "export": cmd_export,
        "unexport": cmd_unexport,
    }

    cmd_fn = commands.get(args.command)
    if cmd_fn:
        cmd_fn(args)


if __name__ == "__main__":
    main()
