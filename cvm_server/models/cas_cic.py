"""
SQLAlchemy ORM models for the cas_cic database (MySQL, port 3306).
Mirrors the CIC (Cloud Infrastructure Controller) tables.
This is a simplified model of the key CIC tables.
"""
from __future__ import annotations

from sqlalchemy import (
    BigInteger, Column, DateTime, Integer, SmallInteger, String, Text, TIMESTAMP
)
from sqlalchemy.ext.declarative import declarative_base

CicBase = declarative_base()


# ============================================================================
# CIC configuration tables
# ============================================================================
class CicConfig(Base):
    """CIC system configuration key-value store."""
    __tablename__ = "tbl_cic_config"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    config_key = Column(String(256), nullable=False)
    config_value = Column(Text, nullable=True)
    description = Column(String(512), nullable=True)


class CicTask(Base):
    """CIC async task tracking."""
    __tablename__ = "tbl_cic_task"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    task_id = Column(String(128), nullable=False)
    task_type = Column(String(64), nullable=False)
    status = Column(Integer, default=0)  # 0=pending, 1=running, 2=completed, 3=failed
    target_id = Column(String(128), nullable=True)
    target_name = Column(String(256), nullable=True)
    result = Column(Integer, default=0)
    fail_msg = Column(Text, nullable=True)
    created_at = Column(TIMESTAMP(timezone=False), nullable=True)
    completed_at = Column(TIMESTAMP(timezone=False), nullable=True)


class CicEvent(Base):
    """CIC event log."""
    __tablename__ = "tbl_cic_event"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    event_type = Column(String(64), nullable=False)
    vm_id = Column(String(128), nullable=True)
    host_id = Column(String(128), nullable=True)
    progress = Column(Integer, default=0)
    message = Column(Text, nullable=True)
    created_at = Column(TIMESTAMP(timezone=False), nullable=True)


class CicResourcePool(Base):
    """CIC resource pool definition."""
    __tablename__ = "tbl_cic_resource_pool"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    name = Column(String(256), nullable=False)
    type = Column(String(32), nullable=False)
    cluster_id = Column(BigInteger, nullable=True)
    description = Column(String(512), nullable=True)
