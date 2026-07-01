#!/usr/bin/env python3
"""
Database initialization script for CVM Server.
Creates/updates the vservice (PostgreSQL) and cas_cic (MySQL) schemas.

Usage:
    python init_db.py --pg     # Initialize PostgreSQL vservice database
    python init_db.py --mysql  # Initialize MySQL cas_cic database
    python init_db.py --all    # Initialize both
"""
import argparse
import os
import sys

# Add parent to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))


def init_postgresql():
    """Initialize PostgreSQL vservice database tables."""
    try:
        import psycopg2
    except ImportError:
        print("ERROR: psycopg2-binary not installed. Run: pip install psycopg2-binary")
        return False

    from config import PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD

    # Connect to PostgreSQL server (without database first to create it)
    try:
        conn = psycopg2.connect(
            host=PG_HOST,
            port=PG_PORT,
            user=PG_USERNAME,
            password=PG_PASSWORD,
            database="postgres",
        )
        conn.autocommit = True
        cur = conn.cursor()

        # Create database if not exists
        cur.execute(f"SELECT 1 FROM pg_database WHERE datname = '{PG_DATABASE}'")
        if not cur.fetchone():
            cur.execute(f"CREATE DATABASE {PG_DATABASE}")
            print(f"Created database: {PG_DATABASE}")
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Warning: Could not create database: {e}")

    # Connect to the vservice database and create tables
    try:
        conn = psycopg2.connect(
            host=PG_HOST,
            port=PG_PORT,
            user=PG_USERNAME,
            password=PG_PASSWORD,
            database=PG_DATABASE,
        )
        conn.autocommit = True
        cur = conn.cursor()

        # Read and execute schema SQL
        schema_path = os.path.join(os.path.dirname(__file__), "schemas", "01-vservice-tables.sql")
        if os.path.exists(schema_path):
            with open(schema_path, "r") as f:
                sql = f.read()

            # Execute each statement
            for statement in sql.split(";"):
                statement = statement.strip()
                if statement and not statement.startswith("--") and not statement.startswith("/*"):
                    try:
                        cur.execute(statement)
                    except Exception as e:
                        if "already exists" not in str(e):
                            print(f"  Skipping: {str(e)[:80]}")

            print(f"PostgreSQL vservice tables created successfully.")
        else:
            print(f"WARNING: Schema file not found: {schema_path}")

        cur.close()
        conn.close()
        return True
    except Exception as e:
        print(f"ERROR initializing PostgreSQL: {e}")
        return False


def init_mysql():
    """Initialize MySQL cas_cic database tables."""
    try:
        import pymysql
    except ImportError:
        print("ERROR: pymysql not installed. Run: pip install pymysql")
        return False

    from config import MYSQL_HOST, MYSQL_PORT, MYSQL_DATABASE, MYSQL_USERNAME, MYSQL_PASSWORD

    try:
        conn = pymysql.connect(
            host=MYSQL_HOST,
            port=MYSQL_PORT,
            user=MYSQL_USERNAME,
            password=MYSQL_PASSWORD,
            autocommit=True,
        )
        cur = conn.cursor()

        # Create database if not exists
        cur.execute(f"CREATE DATABASE IF NOT EXISTS {MYSQL_DATABASE}")
        cur.execute(f"USE {MYSQL_DATABASE}")

        # Read and execute schema SQL
        schema_path = os.path.join(os.path.dirname(__file__), "schemas", "03-cic-tables.sql")
        if os.path.exists(schema_path):
            with open(schema_path, "r") as f:
                sql = f.read()

            for statement in sql.split(";"):
                statement = statement.strip()
                if statement and not statement.startswith("--") and not statement.startswith("/*"):
                    try:
                        cur.execute(statement)
                    except Exception as e:
                        if "already exists" not in str(e) and "Duplicate" not in str(e):
                            print(f"  Skipping: {str(e)[:80]}")

            print(f"MySQL cas_cic tables created successfully.")
        else:
            print(f"WARNING: Schema file not found: {schema_path}")

        cur.close()
        conn.close()
        return True
    except Exception as e:
        print(f"ERROR initializing MySQL: {e}")
        return False


def main():
    parser = argparse.ArgumentParser(description="Initialize CVM Server databases")
    parser.add_argument("--pg", action="store_true", help="Initialize PostgreSQL vservice database")
    parser.add_argument("--mysql", action="store_true", help="Initialize MySQL cas_cic database")
    parser.add_argument("--all", action="store_true", help="Initialize both databases")
    args = parser.parse_args()

    if not (args.pg or args.mysql or args.all):
        parser.print_help()
        return

    if args.pg or args.all:
        print("=== Initializing PostgreSQL (vservice) ===")
        init_postgresql()

    if args.mysql or args.all:
        print("=== Initializing MySQL (cas_cic) ===")
        init_mysql()


if __name__ == "__main__":
    main()
