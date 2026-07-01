"""
CVK Agent Configuration — mirrors cvk_agent.conf + FeignConfiguration.java

Reads /etc/cvk/cvk_agent.conf with sensible defaults matching the
FeignConfiguration static initializer and the CAS nova driver config.
"""

from __future__ import annotations

import os
from dataclasses import dataclass, field
from typing import Dict, Optional


# ============================================================================
# Default timeout constants (from FeignConfiguration.java and cvk_agent.conf)
# ============================================================================
FEIGN_CONNECT_TIMEOUT = 10             # seconds
FEIGN_READ_TIMEOUT = 600               # 10 minutes
FEIGN_SLOW_TASK_CONNECT_TIMEOUT = 10
FEIGN_SLOW_TASK_READ_TIMEOUT = 172800  # 48 hours
FEIGN_OKHTTP_WRITE_TIMEOUT = 600       # 10 minutes
FEIGN_OKHTTP_MAX_IDLE_CONNECTION = 200
FEIGN_OKHTTP_KEEP_ALIVE_DURATION = 50  # seconds
FEIGN_CLIENT_CACHE_MAX_NUM_SIZE = 1024

SCP_WAIT_TIME = 43200                   # 12 hours
SCP_DEFAULT_CMD_WAIT_TIME = 600         # 10 minutes
SCP_CONNECT_TIMEOUT = 30
SCP_SERVER_ALIVE = 60

CMD_CORE_POOL_SIZE = 8
CMD_CORE_MAX_POOL_SIZE = 100
CMD_MAX_POOL_SIZE = 200
CMD_MAX_QUEUE_SIZE = 500

# RabbitMQ defaults (from CAS driver.py CAS opts)
RMQ_VHOST = "cloudMsgHost"
RMQ_EXCHANGE = "cloud_vm_exchange_direct"
RMQ_QUEUE = "cas_vm_event_nova_compute"
RMQ_PORT = 5672
RMQ_USER = "cloud"
RMQ_PASSWORD = "Cl@oud13"
RMQ_QUEUE_MAX_LENGTH_MB = 256
RMQ_QUEUE_MODE = "lazy"


@dataclass
class CvkConfig:
    """CVK agent configuration — mirrors cvk_agent.conf key-value pairs.

    Configuration is read from /etc/cvk/cvk_agent.conf (INI-like key=value
    format) with sensible defaults matching the Java FeignConfiguration
    static initializer.
    """

    # ---- Host identity ----
    host_id: str = ""
    host_name: str = ""
    host_ip: str = "127.0.0.1"
    cluster_id: str = ""
    host_pool_id: str = ""

    # ---- CVM connection ----
    cvm_protocol: str = "http"         # http or https
    cvm_host: str = "localhost"        # CVM management server
    cvm_port: int = 8080               # CVM REST API port
    cvm_username: str = "admin"
    cvm_password: str = "Cloud@123"
    cvm_uri_prefix: str = "/cas/casrs"

    # ---- Feign HTTP client timeouts ----
    feign_connect_timeout: int = FEIGN_CONNECT_TIMEOUT
    feign_read_timeout: int = FEIGN_READ_TIMEOUT
    feign_slow_task_connect_timeout: int = FEIGN_SLOW_TASK_CONNECT_TIMEOUT
    feign_slow_task_read_timeout: int = FEIGN_SLOW_TASK_READ_TIMEOUT
    feign_okhttp_write_timeout: int = FEIGN_OKHTTP_WRITE_TIMEOUT
    feign_okhttp_max_idle_connection: int = FEIGN_OKHTTP_MAX_IDLE_CONNECTION
    feign_okhttp_keep_alive_duration: int = FEIGN_OKHTTP_KEEP_ALIVE_DURATION
    feign_client_cache_max_num_size: int = FEIGN_CLIENT_CACHE_MAX_NUM_SIZE

    # ---- SCP timeouts ----
    scp_wait_time: int = SCP_WAIT_TIME
    scp_default_cmd_wait_time: int = SCP_DEFAULT_CMD_WAIT_TIME
    scp_connect_timeout: int = SCP_CONNECT_TIMEOUT
    scp_server_alive: int = SCP_SERVER_ALIVE

    # ---- Thread pool ----
    cmd_core_pool_size: int = CMD_CORE_POOL_SIZE
    cmd_core_max_pool_size: int = CMD_CORE_MAX_POOL_SIZE
    cmd_max_pool_size: int = CMD_MAX_POOL_SIZE
    cmd_max_queue_size: int = CMD_MAX_QUEUE_SIZE

    # ---- RabbitMQ event bus ----
    rmq_host: str = ""                 # CVM IP (auto-set if empty)
    rmq_port: int = RMQ_PORT
    rmq_vhost: str = RMQ_VHOST
    rmq_exchange: str = RMQ_EXCHANGE
    rmq_queue: str = RMQ_QUEUE
    rmq_user: str = RMQ_USER
    rmq_password: str = RMQ_PASSWORD

    # ---- Heartbeat / keepalive ----
    heartbeat_interval: int = 30       # seconds between heartbeats
    heartbeat_timeout: int = 120       # seconds before declaring CVM unreachable

    # ---- libvirt ----
    libvirt_uri: str = "qemu:///system"

    # ---- Storage ----
    local_storage_path: str = "/vms/images"
    nfs_mount_path: str = "/mnt/nfs"

    # ---- Network ----
    ovs_bridge: str = "vswitch0"
    ovs_dpdk_enabled: bool = False
    vxlan_port: int = 4789

    # ---- API retry ----
    api_retry_count: int = 10

    # ---- Extra key-value pairs from config file ----
    extra: Dict[str, str] = field(default_factory=dict)

    @classmethod
    def from_file(cls, path: str = "/etc/cvk/cvk_agent.conf") -> "CvkConfig":
        """Load configuration from cvk_agent.conf (key=value format).

        The Java agent reads from /etc/cvk/cvk_agent.conf via FileUtil.readFile.
        Each non-comment, non-blank line is split on '=' into key=value.
        """
        config = cls()
        if not os.path.isfile(path):
            return config

        with open(path, "r") as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#"):
                    continue
                if "=" not in line:
                    continue
                key, _, value = line.partition("=")
                key = key.strip()
                value = value.strip().strip('"').strip("'")
                config.extra[key] = value
                cls._apply_key(config, key, value)

        return config

    @classmethod
    def _apply_key(cls, config: "CvkConfig", key: str, value: str) -> None:
        """Apply a known configuration key to the dataclass."""
        key_map: Dict[str, str] = {
            "host_id": "host_id",
            "host_name": "host_name",
            "host_ip": "host_ip",
            "hostIp": "host_ip",
            "cluster_id": "cluster_id",
            "host_pool_id": "host_pool_id",
            "cvm_protocol": "cvm_protocol",
            "cvm_host": "cvm_host",
            "cvmHost": "cvm_host",
            "cvm_port": "cvm_port",
            "cvmPort": "cvm_port",
            "cvm_username": "cvm_username",
            "cvm_password": "cvm_password",
            "cvm_uri_prefix": "cvm_uri_prefix",
            "feign_connect_timeout": "feign_connect_timeout",
            "FEIGN_CONNECT_TIMEOUT": "feign_connect_timeout",
            "feign_read_timeout": "feign_read_timeout",
            "FEIGN_READ_TIMEOUT": "feign_read_timeout",
            "FEIGN_SLOW_TASK_CONNECT_TIMEOUT": "feign_slow_task_connect_timeout",
            "FEIGN_SLOW_TASK_READ_TIMEOUT": "feign_slow_task_read_timeout",
            "FEIGN_OK_HTTP_WRITE_TIMEOUT": "feign_okhttp_write_timeout",
            "FEIGN_OK_HTTP_MAX_IDLE_CONNECTION": "feign_okhttp_max_idle_connection",
            "FEIGN_OK_HTTP_KEEP_ALIVE_DURATION": "feign_okhttp_keep_alive_duration",
            "FEIGN_CLIENT_CACHE_MAX_NUM_SIZE": "feign_client_cache_max_num_size",
            "scp_wait_time": "scp_wait_time",
            "SCP_WAIT_TIME": "scp_wait_time",
            "SCP_DEFAULT_CMD_WAIT_TIME": "scp_default_cmd_wait_time",
            "SCP_CONNECT_TIMEOUT": "scp_connect_timeout",
            "SCP_SERVER_ALIVE": "scp_server_alive",
            "CMD_CORE_POOL_SIZE": "cmd_core_pool_size",
            "CMD_CORE_MAX_POOL_SIZE": "cmd_core_max_pool_size",
            "CMD_MAX_POOL_SIZE": "cmd_max_pool_size",
            "CMD_MAX_QUEUE_SIZE": "cmd_max_queue_size",
            "rmq_host": "rmq_host",
            "rmq_port": "rmq_port",
            "rmq_vhost": "rmq_vhost",
            "rmq_exchange": "rmq_exchange",
            "rmq_queue": "rmq_queue",
            "rmq_user": "rmq_user",
            "rmq_password": "rmq_password",
            "heartbeat_interval": "heartbeat_interval",
            "heartbeat_timeout": "heartbeat_timeout",
            "libvirt_uri": "libvirt_uri",
            "local_storage_path": "local_storage_path",
            "nfs_mount_path": "nfs_mount_path",
            "ovs_bridge": "ovs_bridge",
            "api_retry_count": "api_retry_count",
        }

        if key not in key_map:
            return

        attr = key_map[key]
        if hasattr(config, attr):
            current = getattr(config, attr)
            field_type = type(current)
            if field_type is bool:
                setattr(config, attr, value.lower() in ("true", "1", "yes"))
            elif field_type is int:
                try:
                    setattr(config, attr, int(value))
                except ValueError:
                    pass
            else:
                setattr(config, attr, value)
