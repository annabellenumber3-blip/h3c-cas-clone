#!/bin/bash
# H3C CAS Database Initialization Script
# Creates all required CAS databases and users
# Mirrors R0785P03 database setup

set -e

echo "=== H3C CAS Database Initialization ==="

# ── PostgreSQL (vservice) ─────────────────────────────────────────
echo "--- PostgreSQL ---"
if command -v psql &>/dev/null; then
    PGPASSWORD=Pzss@_w0rd psql -h localhost -p 1523 -U ssadmin -d postgres <<-EOSQL 2>/dev/null || echo "PostgreSQL not reachable (ok if using Docker)"
        CREATE DATABASE vmware OWNER ssadmin;
        CREATE DATABASE baremetal OWNER ssadmin;
EOSQL
fi

# ── MySQL (cas_cic) ───────────────────────────────────────────────
echo "--- MySQL ---"
if command -v mysql &>/dev/null; then
    mysql -h localhost -P 3306 -u root -pPzss@_w0rd <<-EOSQL 2>/dev/null || echo "MySQL not reachable (ok if using Docker)"
        CREATE DATABASE IF NOT EXISTS cas_cic
            CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
        GRANT ALL PRIVILEGES ON cas_cic.* TO 'ssadmin'@'%' IDENTIFIED BY 'Pzss@_w0rd';
        FLUSH PRIVILEGES;
EOSQL
fi

# ── ClickHouse (metrics) ───────────────────────────────────────────
echo "--- ClickHouse ---"
if command -v clickhouse-client &>/dev/null; then
    clickhouse-client --user default --password Pzss@_w0rd -q \
        "CREATE DATABASE IF NOT EXISTS metrics ENGINE = Atomic" 2>/dev/null || \
        echo "ClickHouse not reachable (ok if using Docker)"
fi

echo "=== Database initialization complete ==="
