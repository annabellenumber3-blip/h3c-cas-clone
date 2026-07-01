"""
SQLAlchemy ORM models for the vservice database (PostgreSQL, port 1523).
Mirrors the actual CVM database tables extracted from 01-cvm-tables.sql.
"""
from __future__ import annotations

from datetime import datetime
from typing import Optional

from sqlalchemy import (
    BigInteger, Boolean, CheckConstraint, Column, DateTime, Float, ForeignKey,
    Integer, Numeric, SmallInteger, String, Text, TIMESTAMP
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()


# ============================================================================
# Libvirt pool & volume tracking
# ============================================================================
class LibvirtPoolInfo(Base):
    __tablename__ = "tbl_libvirt_pool_info"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    name = Column(String(256), nullable=False)
    path = Column(String(256), nullable=False)
    type = Column(String(20), nullable=False)
    title = Column(String(256), nullable=False)
    host_id = Column(BigInteger, nullable=True)
    status = Column(Integer, nullable=False, default=0)


class LibvirtVolumeInfo(Base):
    __tablename__ = "tbl_libvirt_volume_info"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    pool_name = Column(String(256), nullable=False)
    host_id = Column(BigInteger, nullable=True)
    pool_type = Column(String(256), nullable=False)
    name = Column(String(256), nullable=False)
    path = Column(String(256), nullable=False)
    size = Column(Numeric, nullable=True)
    allocation = Column(Numeric, nullable=True)
    format = Column(String(20), nullable=True)
    type = Column(String(20), nullable=True)
    backing_store = Column(String(256), nullable=True)
    level = Column(Integer, nullable=True)
    volume_key = Column(String(256), nullable=True)


# ============================================================================
# Operator (user) management
# ============================================================================
class Operator(Base):
    __tablename__ = "tbl_operator"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    login_name = Column(String(256), nullable=False)
    auth_type = Column(SmallInteger, nullable=False, default=0)
    password = Column(String(256), nullable=True)
    user_name = Column(String(256), nullable=True)
    credential_number = Column(String(256), nullable=True)
    email = Column(String(256), nullable=True)
    organization = Column(String(256), nullable=True)
    phone = Column(String(256), nullable=True)
    address = Column(String(256), nullable=True)
    last_login_time = Column(TIMESTAMP(timezone=False), nullable=True)
    enable = Column(Integer, default=1)
    last_modify_pwd_time = Column(TIMESTAMP(timezone=False), nullable=True)
    access_strategy_id = Column(BigInteger, nullable=True)
    online_num = Column(BigInteger, nullable=True)
    resource_type = Column(SmallInteger, nullable=False, default=0)
    validity_time = Column(TIMESTAMP(timezone=False), nullable=True)
    extend_pwd = Column(String(512), nullable=True)
    third_party_encrypted = Column(Integer, nullable=False, default=0)
    data_signature = Column(String(512), nullable=True)
    signature_flag = Column(SmallInteger, nullable=False, default=0)


# ============================================================================
# Host pool
# ============================================================================
class HostPool(Base):
    __tablename__ = "tbl_hostpool"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    name = Column(String(256), nullable=False)
    last_login_time = Column(TIMESTAMP(timezone=False), nullable=True)
    public_cloud_id = Column(BigInteger, nullable=True)
    op_group_id = Column(BigInteger, default=1)
    op_group_code = Column(String(256), default="00")
    storage_ip = Column(String(256), nullable=True)
    storage_mask = Column(String(256), nullable=True)
    title = Column(String(256), nullable=False, default="")


# ============================================================================
# Cluster
# ============================================================================
class Cluster(Base):
    __tablename__ = "tbl_cluster"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    host_pool_id = Column(BigInteger, ForeignKey("tbl_hostpool.id"), nullable=False)
    name = Column(String(256), nullable=False)
    description = Column(String(256), nullable=True)
    enable_ha = Column(Integer, nullable=False, default=0)
    vm_restart_priority = Column(Integer, nullable=True)
    enable_lb = Column(Integer, nullable=False, default=0)
    persist_time = Column(Integer, nullable=True)
    check_interval = Column(Integer, nullable=True)
    lb_monitor_id = Column(BigInteger, nullable=True)
    enable_slb = Column(Integer, nullable=False, default=0)
    slb_persist_time = Column(Integer, nullable=True)
    slb_check_interval = Column(Integer, nullable=True)
    slb_monitor_id = Column(BigInteger, nullable=True)
    enable_ipm = Column(Integer, nullable=False, default=0)
    drs_enable_time = Column(Integer, nullable=True)
    ipm_enable_time = Column(Integer, nullable=True)
    op_group_id = Column(BigInteger, default=1)
    op_group_code = Column(String(256), default="00")
    broadcast_addr = Column(String(256), nullable=True)
    broadcast_port = Column(Integer, nullable=True)
    public_cloud_id = Column(BigInteger, nullable=True)
    ha_min_host = Column(Integer, nullable=True)
    enable_storage_ha = Column(Integer, nullable=True, default=0)
    enable_stretched = Column(Integer, nullable=True, default=0)
    ha_cpu_retain = Column(Integer, nullable=True)
    ha_mem_retain = Column(Integer, nullable=True)
    ha_control_strategy = Column(Integer, nullable=False, default=0)
    enable_business_ha = Column(Integer, nullable=False, default=0)
    trigger_action = Column(Integer, nullable=False, default=2)
    type = Column(Integer, nullable=True)
    container_cluster = Column(Integer, nullable=False, default=0)
    local_disk_ha = Column(Integer, nullable=False, default=0)
    local_disk_time = Column(Integer, nullable=False, default=30)
    strategy_delay_time = Column(Integer, nullable=False, default=12000)
    cpu_mode = Column(Integer, nullable=False, default=0)
    emc_type = Column(Integer, nullable=True)
    emc_cpu_model = Column(Integer, nullable=True)
    host_profile_id = Column(BigInteger, nullable=True)


# ============================================================================
# Host
# ============================================================================
class Host(Base):
    __tablename__ = "tbl_host"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    host_pool_id = Column(BigInteger, ForeignKey("tbl_hostpool.id"), nullable=False)
    cluster_id = Column(BigInteger, ForeignKey("tbl_cluster.id"), nullable=True)
    name = Column(String(256), nullable=False)
    ipaddr = Column(String(256), nullable=False)
    host_user = Column(String(45), nullable=False, default="root")
    pw = Column(String(256), nullable=True)
    memory = Column(Integer, nullable=True)
    cpu = Column(Integer, nullable=True)
    cpu_cores = Column(Integer, nullable=True)
    cpu_sockets = Column(Integer, nullable=True)
    storage = Column(BigInteger, nullable=True)
    status = Column(Integer, nullable=True)
    cpu_frequency = Column(Integer, default=0)
    cpu_provider = Column(String(45), nullable=True)
    cpu_detail = Column(String(128), nullable=True)
    provider = Column(String(128), nullable=True)
    storage_allocation = Column(BigInteger, nullable=True)
    storage_avilable = Column(BigInteger, nullable=True)
    iscsi_node_name = Column(String(128), nullable=True)
    maintain = Column(Integer, default=0)
    cvk_maintain = Column(Integer, default=0)
    public_cloud_id = Column(BigInteger, nullable=True)
    mac = Column(String(32), nullable=True)
    op_group_id = Column(BigInteger, default=1)
    op_group_code = Column(String(256), default="00")
    wake_category = Column(Integer, default=0)
    ipmi_ipaddr = Column(String(256), nullable=True)
    ipmi_user = Column(String(45), nullable=True)
    ipmi_pw = Column(String(45), nullable=True)
    ha_enable = Column(Integer, default=0)
    cvk_version = Column(String(45), nullable=False, default="")
    add_time = Column(TIMESTAMP(timezone=False), nullable=True)
    ha_resource = Column(Integer, nullable=True, default=0)
    node_num = Column(Integer, nullable=False, default=0)
    storage_ip = Column(String(256), nullable=True)
    ilos = Column(String(64), nullable=True)
    type = Column(Integer, nullable=True)
    sync_mark = Column(Integer, nullable=True, default=0)
    nvme_node_name = Column(String(128), nullable=True)
    top_emc_cpu_model = Column(Integer, nullable=True)
    secret_level = Column(Integer, nullable=False, default=1)
    rdma_issue = Column(Integer, nullable=True, default=1)
    serial_number = Column(String(128), nullable=True)
    host_profile_id = Column(BigInteger, nullable=True)
    third_party_encrypted = Column(Integer, nullable=False, default=0)


# ============================================================================
# Domain (VM)
# ============================================================================
class Domain(Base):
    __tablename__ = "tbl_domain"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    host_id = Column(Integer, nullable=False, default=0)
    host_pool_id = Column(BigInteger, nullable=False)
    cluster_id = Column(BigInteger, nullable=True)
    domain_name = Column(String(128), nullable=False, default="")
    title = Column(String(128), nullable=False, default="")
    description = Column(String(2048), nullable=True)
    memory = Column(Integer, nullable=False, default=0)
    cpu = Column(Integer, nullable=False, default=0)
    cdrom = Column(Integer, nullable=False, default=0)
    enable = Column(Integer, nullable=False, default=0)
    uuid = Column(String(60), nullable=False, default="")
    os_bit = Column(String(45), nullable=False, default="")
    system = Column(Integer, nullable=False, default=0)
    img_file_name = Column(String(256), nullable=True)
    img_file_type = Column(String(45), nullable=False, default="NotDeployed")
    view_type = Column(String(45), nullable=True)
    auto = Column(Integer, nullable=False, default=1)
    drive = Column(String(45), nullable=True)
    booting_device = Column(Integer, nullable=False, default=2)
    auto_booting = Column(Integer, nullable=False, default=0)
    op_group_id = Column(BigInteger, default=1)
    op_group_code = Column(String(256), default="00")
    priority = Column(Integer, nullable=True)
    auto_migrate = Column(SmallInteger, nullable=True)
    enable_vnc_proxy = Column(Integer, default=0)
    create_date = Column(TIMESTAMP(timezone=False), nullable=True)
    public_cloud_id = Column(BigInteger, nullable=True)
    computer_name = Column(String(128), nullable=True)
    os_version = Column(String(128), nullable=True)
    memory_init = Column(Numeric(10, 2), nullable=True)
    memory_unit = Column(String(10), nullable=True)
    memory_limit = Column(Numeric(10, 2), nullable=True)
    memory_limit_unit = Column(String(10), nullable=True)
    ha_status = Column(Integer, default=0)
    originate = Column(Integer, default=0)
    src_host_id = Column(BigInteger, nullable=True)
    memory_locked = Column(Integer, nullable=True)
    memory_priority = Column(Integer, nullable=True)
    cpu_quota_init = Column(Numeric(10, 2), nullable=True)
    cpu_quota_unit = Column(String(10), nullable=True)
    protect_model = Column(Integer, default=0)
    start_status = Column(Integer, nullable=True)
    status = Column(Integer, nullable=False, default=3)
    last_update_time = Column(Integer, nullable=False, default=0)
    ha_manage = Column(Integer, default=1)
    templet_id = Column(BigInteger, nullable=True)
    del_time = Column(Integer, nullable=True, default=0)
    disk_change = Column(Integer, default=0)
    castools_status = Column(Integer, nullable=True)
    castools_version = Column(String(20), nullable=True)
    uptime = Column(Integer, default=-1)
    templet_storage_path = Column(String(512), nullable=True)
    create_restore_point_date = Column(TIMESTAMP(timezone=False), nullable=True)
    last_restore_date = Column(TIMESTAMP(timezone=False), nullable=True)
    antivirus_enable = Column(Integer, nullable=False, default=0)
    secret_level = Column(Integer, default=1)
    last_off_time = Column(Integer, nullable=False, default=0)
    integrity_check = Column(Integer, default=0)
    time_sync = Column(Integer, nullable=False, default=2)
    vm_type = Column(Integer, default=1)
    host_binding = Column(Integer, default=0)
    enable_increase_cpu = Column(Integer, nullable=True)
    metadata = Column(String(256), nullable=True)
    rdt = Column(String(8), nullable=True)
    template_status = Column(Integer, nullable=True, default=0)
    antivirus_status = Column(Integer, nullable=True)
    kaas_vm = Column(Integer, default=0)
    huge_page_status = Column(Boolean, nullable=True)
    issue_date = Column(BigInteger, nullable=True)
    isencrypt = Column(Boolean, nullable=False, default=False)
    secrect_key = Column(String(256), nullable=True)
    algorithm = Column(String(64), nullable=True)
    ft_status = Column(SmallInteger, nullable=True, default=0)
    cpu_core = Column(Integer, nullable=True)
    cpu_socket = Column(Integer, nullable=True)
    auto_mem = Column(Integer, nullable=True)


# ============================================================================
# Domain network
# ============================================================================
class DomainNetwork(Base):
    __tablename__ = "tbl_domain_network"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    net_type = Column(Integer, nullable=False, default=0)
    mac = Column(String(60), nullable=True)
    ip_addr = Column(String(256), nullable=True)
    mask = Column(String(32), nullable=True)
    gateway = Column(String(32), nullable=True)
    dns = Column(String(32), nullable=True)
    second_dns = Column(String(32), nullable=True)
    domain_id = Column(Integer, default=0)
    name = Column(String(45), nullable=True)
    device_model = Column(String(45), nullable=False, default="rtl8139")
    vcf_profile_uuid = Column(String(60), nullable=True)
    vcf_security_uuid = Column(String(60), nullable=True)
    vcf_net_uuid = Column(String(60), nullable=True)
    vcf_portgroup_uuid = Column(String(60), nullable=True)
    ipv6_ip_addr = Column(String(256), nullable=True)
    ipv6_prefix_length = Column(Integer, nullable=True)
    ipv6_gateway = Column(String(256), nullable=True)
    ipv6_dns = Column(String(256), nullable=True)
    ipv6_second_dns = Column(String(256), nullable=True)
    ipv6_mode = Column(String(256), nullable=True)
    ipv4_dhcp = Column(Integer, default=0)
    ipv6_dhcp = Column(Integer, default=0)
    ip_config_success = Column(Integer, default=0)


# ============================================================================
# Domain storage
# ============================================================================
class DomainStorage(Base):
    __tablename__ = "tbl_domain_storage"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    store_file = Column(String(512), nullable=False, default="")
    capacity = Column(BigInteger, nullable=False, default=0)
    domain_id = Column(Integer, default=0)
    target_bus = Column(String(10), nullable=False, default="0")
    type = Column(String(10), nullable=False, default="0")
    device = Column(String(45), nullable=True)
    format = Column(String(45), nullable=True)
    drive_type = Column(String(10), nullable=True)
    drive_controller = Column(String(10), nullable=True)
    assign_type = Column(Integer, nullable=False, default=0)
    disk_device = Column(String(10), nullable=True)
    md5 = Column(String(64), nullable=True)


# ============================================================================
# Operation log
# ============================================================================
class OperLog(Base):
    __tablename__ = "tbl_operlog"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    login_name = Column(String(256), nullable=False)
    user_name = Column(String(256), nullable=True)
    oper_start_time = Column(TIMESTAMP(timezone=False), nullable=True)
    oper_time = Column(TIMESTAMP(timezone=False), nullable=False)
    address = Column(String(256), nullable=False)
    category = Column(Integer, nullable=False)
    description = Column(String(512), nullable=False)
    result = Column(SmallInteger, nullable=False)
    failure_reason = Column(String(512), nullable=True)
    target_id = Column(BigInteger, nullable=True)
    target_name = Column(String(256), nullable=True)
    level = Column(SmallInteger, nullable=True)
    event = Column(SmallInteger, nullable=True)
    category_id = Column(BigInteger, nullable=True)
    related_category = Column(Integer, nullable=True)
    oper_obj = Column(String(64), nullable=True)
    op_group_id = Column(BigInteger, nullable=True)
    operator_type = Column(Integer, nullable=False, default=0)
    data_signature = Column(String(512), nullable=True)
