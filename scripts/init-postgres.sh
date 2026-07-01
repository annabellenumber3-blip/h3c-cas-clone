#!/bin/bash
# H3C CAS PostgreSQL Initialization Script
# Creates the vservice, vmware, and baremetal databases
# Creates the ssadmin_ro read-only user (mirrors db-create-user.sh)

set -e

echo "=== PostgreSQL Initialization for H3C CAS ==="

# Wait for PostgreSQL to be ready
until pg_isready -U "$POSTGRES_USER" -d postgres; do
    echo "Waiting for PostgreSQL..."
    sleep 1
done

echo "PostgreSQL is ready. Creating CAS databases..."

# Create additional databases used by CAS
psql -U "$POSTGRES_USER" -d postgres <<-EOSQL
    -- vservice is the primary CAS database (created by POSTGRES_DB env var, verify)
    -- Create vmware database
    CREATE DATABASE vmware OWNER ssadmin;
    
    -- Create baremetal database
    CREATE DATABASE baremetal OWNER ssadmin;
    
    -- Create read-only user ssadmin_ro (from db-create-user.sh)
    DO \$\$
    BEGIN
        IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'ssadmin_ro') THEN
            CREATE ROLE ssadmin_ro LOGIN PASSWORD 'Pzss@_w0rd' NOINHERIT;
            ALTER ROLE ssadmin_ro SET DEFAULT_TRANSACTION_READ_ONLY = on;
        END IF;
    END
    \$\$;
    
    -- Grant ssadmin_ro read access to all databases
    GRANT CONNECT ON DATABASE vservice TO ssadmin_ro;
    GRANT CONNECT ON DATABASE vmware TO ssadmin_ro;
    GRANT CONNECT ON DATABASE baremetal TO ssadmin_ro;
    
    \c vservice
    GRANT USAGE ON SCHEMA public TO ssadmin_ro;
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO ssadmin_ro;
    
    \c vmware
    GRANT USAGE ON SCHEMA public TO ssadmin_ro;
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO ssadmin_ro;
    
    \c baremetal
    GRANT USAGE ON SCHEMA public TO ssadmin_ro;
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO ssadmin_ro;
EOSQL

echo "=== PostgreSQL initialization complete ==="
echo "  Databases: vservice, vmware, baremetal"
echo "  Users: ssadmin (admin), ssadmin_ro (read-only)"
