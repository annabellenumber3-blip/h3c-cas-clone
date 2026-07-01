#!/bin/bash
# H3C CAS MySQL Initialization Script
# Creates the cas_cic database structure

set -e

echo "=== MySQL Initialization for H3C CAS ==="

# The MYSQL_DATABASE env var already creates cas_cic
# Verify and add any CAS-specific tables/grants
mysql -u root -p"$MYSQL_ROOT_PASSWORD" <<-EOSQL
    -- Ensure cas_cic exists
    CREATE DATABASE IF NOT EXISTS cas_cic
        CHARACTER SET utf8mb4
        COLLATE utf8mb4_general_ci;
    
    -- Grant permissions to ssadmin
    GRANT ALL PRIVILEGES ON cas_cic.* TO 'ssadmin'@'%';
    GRANT ALL PRIVILEGES ON cas_cic.* TO 'ssadmin'@'localhost';
    
    -- Create ssadmin_ro read-only user
    CREATE USER IF NOT EXISTS 'ssadmin_ro'@'%' IDENTIFIED BY 'Pzss@_w0rd';
    CREATE USER IF NOT EXISTS 'ssadmin_ro'@'localhost' IDENTIFIED BY 'Pzss@_w0rd';
    GRANT SELECT ON cas_cic.* TO 'ssadmin_ro'@'%';
    GRANT SELECT ON cas_cic.* TO 'ssadmin_ro'@'localhost';
    
    FLUSH PRIVILEGES;
EOSQL

echo "=== MySQL initialization complete ==="
echo "  Database: cas_cic"
echo "  Users: ssadmin (admin), ssadmin_ro (read-only)"
