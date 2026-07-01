"""
Database connection pool configuration.
Uses SQLAlchemy with async support for PostgreSQL (vservice) and MySQL (cas_cic).

Pool config mirrors Tomcat JDBC pool from db.properties:
  - maxActive=120, maxIdle=50, minIdle=0
  - maxWait=30000, minEvictableIdleTime=300000
"""
from __future__ import annotations

from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from ..config import (
    DB_MAX_ACTIVE, DB_MAX_IDLE, DB_MAX_WAIT, DB_MIN_EVICTABLE_IDLE_TIME,
    PG_URL, MYSQL_URL,
)

# ============================================================================
# PostgreSQL (vservice) engine — port 1523
# ============================================================================
pg_engine = create_async_engine(
    PG_URL,
    pool_size=DB_MAX_IDLE if DB_MAX_IDLE > 0 else 5,
    max_overflow=DB_MAX_ACTIVE - DB_MAX_IDLE if DB_MAX_IDLE > 0 else 50,
    pool_timeout=DB_MAX_WAIT / 1000.0,
    pool_recycle=DB_MIN_EVICTABLE_IDLE_TIME / 1000.0,
    pool_pre_ping=True,
    echo=False,
)

pg_session_factory = sessionmaker(
    pg_engine,
    expire_on_commit=False,
    class_=AsyncSession,
)

# ============================================================================
# MySQL (cas_cic) engine — port 3306
# ============================================================================
mysql_engine = create_async_engine(
    MYSQL_URL,
    pool_size=5,
    max_overflow=50,
    pool_timeout=30.0,
    pool_recycle=300.0,
    pool_pre_ping=True,
    echo=False,
)

mysql_session_factory = sessionmaker(
    mysql_engine,
    expire_on_commit=False,
    class_=AsyncSession,
)


async def get_pg_session() -> AsyncSession:
    """Get an async PostgreSQL session."""
    async with pg_session_factory() as session:
        yield session


async def get_mysql_session() -> AsyncSession:
    """Get an async MySQL session."""
    async with mysql_session_factory() as session:
        yield session
