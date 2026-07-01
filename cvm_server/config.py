"""
H3C CAS CVM Server Configuration
Mirrors tomcat server.xml + db.properties + cvk_agent.conf
"""
from __future__ import annotations

import os
from dataclasses import dataclass, field
from typing import Dict, List, Optional

# ============================================================================
# Server config (from server.xml)
# ============================================================================
SERVER_HEADER = "CVM"
HTTP_PORT = int(os.environ.get("CVM_HTTP_PORT", "8080"))
HTTPS_PORT = int(os.environ.get("CVM_HTTPS_PORT", "8443"))
MAX_THREADS = int(os.environ.get("CVM_MAX_THREADS", "300"))
MAX_CONNECTIONS = int(os.environ.get("CVM_MAX_CONNECTIONS", "600"))
ACCEPT_COUNT = int(os.environ.get("CVM_ACCEPT_COUNT", "600"))
CONNECTION_TIMEOUT = int(os.environ.get("CVM_CONNECTION_TIMEOUT", "20000"))
KEEPALIVE_TIMEOUT = int(os.environ.get("CVM_KEEPALIVE_TIMEOUT", "15000"))

# SSL/TLS (from server.xml:91-95)
SSL_KEYSTORE_FILE = os.environ.get("CVM_KEYSTORE_FILE", "/var/lib/tomcat/security/keystore")
SSL_KEYSTORE_PASS = os.environ.get("CVM_KEYSTORE_PASS", "h3cbj2013")
SSL_CIPHERS = [
    "TLS_RSA_WITH_AES_128_CBC_SHA",
    "TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA",
    "TLS_RSA_WITH_AES_128_CBC_SHA256",
    "TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256",
    "SSL_RSA_WITH_3DES_EDE_CBC_SHA",
    "TLS_ECDHE_RSA_WITH_3DES_EDE_CBC_SHA",
]

# Shutdown port (Tomcat shutdown, not used in Python)
SHUTDOWN_PORT = int(os.environ.get("CVM_SHUTDOWN_PORT", "8005"))

# ============================================================================
# Auth config (HTTP Digest, RFC 2617)
# ============================================================================
DIGEST_REALM = "CAS"
DIGEST_ALGORITHM = "MD5"
DIGEST_QOP = "auth"

# Users (from configs — encrypted in production)
USERS: Dict[str, str] = {
    "admin": "Cloud@123",
    "root": "h3cadmin",
}

# ============================================================================
# Database config (from db.properties)
# ============================================================================
# PostgreSQL (vservice) — port 1523
PG_HOST = os.environ.get("PG_HOST", "localhost")
PG_PORT = int(os.environ.get("PG_PORT", "1523"))
PG_DATABASE = os.environ.get("PG_DATABASE", "vservice")
PG_USERNAME = os.environ.get("PG_USERNAME", "postgres")
PG_PASSWORD = os.environ.get("PG_PASSWORD", "PdfEjjxsBAo=")
PG_URL = f"postgresql+asyncpg://{PG_USERNAME}:{PG_PASSWORD}@{PG_HOST}:{PG_PORT}/{PG_DATABASE}"
PG_URL_SYNC = f"postgresql+psycopg2://{PG_USERNAME}:{PG_PASSWORD}@{PG_HOST}:{PG_PORT}/{PG_DATABASE}"

# MySQL (cas_cic) — port 3306
MYSQL_HOST = os.environ.get("MYSQL_HOST", "localhost")
MYSQL_PORT = int(os.environ.get("MYSQL_PORT", "3306"))
MYSQL_DATABASE = os.environ.get("MYSQL_DATABASE", "cas_cic")
MYSQL_USERNAME = os.environ.get("MYSQL_USERNAME", "root")
MYSQL_PASSWORD = os.environ.get("MYSQL_PASSWORD", "")
MYSQL_URL = f"mysql+aiomysql://{MYSQL_USERNAME}:{MYSQL_PASSWORD}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DATABASE}"

# Connection pool (from db.properties)
DB_MAX_ACTIVE = int(os.environ.get("DB_MAX_ACTIVE", "120"))
DB_MAX_IDLE = int(os.environ.get("DB_MAX_IDLE", "50"))
DB_MIN_IDLE = int(os.environ.get("DB_MIN_IDLE", "0"))
DB_MAX_WAIT = int(os.environ.get("DB_MAX_WAIT", "30000"))
DB_MIN_EVICTABLE_IDLE_TIME = int(os.environ.get("DB_MIN_EVICTABLE_IDLE_TIME", "300000"))

# ============================================================================
# CVK Agent config defaults (from cvk_agent.conf)
# ============================================================================
FEIGN_CONNECT_TIMEOUT = 10
FEIGN_READ_TIMEOUT = 600
FEIGN_SLOW_TASK_READ_TIMEOUT = 172800  # 48 hours
SCP_CONNECT_TIMEOUT = 30
SCP_SERVER_ALIVE = 60

# Thread pool (mirrors Java thread pool)
CMD_CORE_POOL_SIZE = 8
CMD_MAX_POOL_SIZE = 200
CMD_MAX_QUEUE_SIZE = 500

# ============================================================================
# RabbitMQ config (from driver.py)
# ============================================================================
RMQ_HOST = os.environ.get("RMQ_HOST", "127.0.0.1")
RMQ_PORT = int(os.environ.get("RMQ_PORT", "5672"))
RMQ_VHOST = os.environ.get("RMQ_VHOST", "cloudMsgHost")
RMQ_EXCHANGE = os.environ.get("RMQ_EXCHANGE", "cloud_vm_exchange_direct")
RMQ_QUEUE = os.environ.get("RMQ_QUEUE", "cas_vm_event_nova_compute")
RMQ_QUEUE_MAX_LENGTH_MB = 256
RMQ_QUEUE_MODE = "lazy"

# ============================================================================
# URI prefix
# ============================================================================
URI_PREFIX = "/cas/casrs"

# ============================================================================
# Async task config
# ============================================================================
TASK_COMPLETION_DELAY = float(os.environ.get("TASK_COMPLETION_DELAY", "2.0"))  # seconds
NONCE_TIMEOUT = int(os.environ.get("NONCE_TIMEOUT", "300"))  # seconds
