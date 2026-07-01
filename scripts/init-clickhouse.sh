#!/bin/bash
# H3C CAS ClickHouse Initialization Script
# Creates the metrics database and default user

set -e

echo "=== ClickHouse Initialization for H3C CAS ==="

# Wait for ClickHouse to be ready
until clickhouse-client --user default --password "$CLICKHOUSE_PASSWORD" -q "SELECT 1" >/dev/null 2>&1; do
    echo "Waiting for ClickHouse..."
    sleep 1
done

echo "ClickHouse is ready. Creating metrics database..."

clickhouse-client --user default --password "$CLICKHOUSE_PASSWORD" -q "
    CREATE DATABASE IF NOT EXISTS metrics
    ENGINE = Atomic
" 2>/dev/null || true

echo "=== ClickHouse initialization complete ==="
echo "  Database: metrics"
echo "  User: default / Pzss@_w0rd"
