CREATE TABLE IF NOT EXISTS tbl_libvirt_pool_info(
    id BIGSERIAL,
    name VARCHAR(256) NOT NULL,
    path VARCHAR(256) NOT NULL,
    type VARCHAR(20) NOT NULL,
    title VARCHAR(256) NOT NULL,
    host_id BIGINT, -- 'HOST ID',
    status INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (id)
);
CREATE TABLE IF NOT EXISTS tbl_libvirt_volume_info(
    id BIGSERIAL,
    pool_name VARCHAR(256) NOT NULL,
    host_id BIGINT, -- 'HOST ID',
    pool_type VARCHAR(256) NOT NULL,
    name VARCHAR(256) NOT NULL,
    path VARCHAR(256) NOT NULL,
    size NUMERIC,
    allocation NUMERIC,
    format VARCHAR(20) DEFAULT NULL,
    type VARCHAR(20) DEFAULT NULL,
    backing_store VARCHAR(256) DEFAULT NULL,
    level INTEGER DEFAULT NULL,
    volume_key VARCHAR(256) DEFAULT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_customer (
    id BIGSERIAL,
    user_name VARCHAR(256),
    login_pwd VARCHAR(256),
    nation_region VARCHAR(256),
    licenseope VARCHAR(256),
    country VARCHAR(256),
    provincecity VARCHAR(256),
    company VARCHAR(256),
    address VARCHAR(256),
    postcode VARCHAR(256),
    email VARCHAR(256),
    phone VARCHAR(256),
    applicant_name VARCHAR(256),
    applicant_company VARCHAR(256),
    applicant_email VARCHAR(256),
    applicant_phone VARCHAR(256),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_ui_item (
    id BIGSERIAL,
    ui_name VARCHAR(128) NOT NULL, -- '界面名称标识',
    col_name VARCHAR(128) NOT NULL, -- '列名称',
    col_width INTEGER NOT NULL, -- '缺省列宽',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_operator (
    id BIGSERIAL,
    login_name VARCHAR(256) NOT NULL,
    auth_type SMALLINT NOT NULL DEFAULT 0,
    password VARCHAR(256),
    user_name VARCHAR(256),
    credential_number VARCHAR(256),
    email VARCHAR(256),
    organization VARCHAR(256),
    phone VARCHAR(256),
    address VARCHAR(256),
    last_login_time TIMESTAMP(0) NULL ,
    enable INTEGER DEFAULT 1, -- '是否禁用：启用：1，禁用：0',
    last_modify_pwd_time TIMESTAMP(0), -- '最近一次修改密码时间',
    access_strategy_id BIGINT, -- '访问策略ID',
    online_num BIGINT,
    resource_type SMALLINT NOT NULL DEFAULT 0, -- '资源授权类型。0:所有资源，1：集群,2:主机,3:虚拟机',
    validity_time TIMESTAMP(0) DEFAULT NULL, -- '用户有效期',
    extend_pwd VARCHAR(512), -- '第三方密评扩展密码',
    third_party_encrypted INT NOT NULL DEFAULT 0, -- '加密结果，0:未加密；1：渔翁加密成功',
    data_signature VARCHAR(512), -- '第三方密评操作员权限的数字签名',
    signature_flag SMALLINT NOT NULL DEFAULT 0, -- '权限完整性验签：0:未签名;1：验签正确;2：被篡改 ',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_operator_param (
    id BIGSERIAL,
    operator_id BIGINT,
    name VARCHAR(256) NOT NULL,
    value VARCHAR(512),
    PRIMARY KEY (id),
    FOREIGN KEY (operator_id) REFERENCES tbl_operator (id) ON DELETE CASCADE ON UPDATE RESTRICT
);

CREATE TABLE IF NOT EXISTS tbl_op_group (
    id BIGSERIAL,
    name VARCHAR(256) NOT NULL,
    code VARCHAR(256) NOT NULL,
    level INTEGER NOT NULL,
    parent_id BIGINT,
    description VARCHAR(512),
    flag INTEGER CHECK(flag >= 0) NOT NULL DEFAULT 1, -- '1: 可管理子分组, 0：不可管理子分组',
    mode INTEGER DEFAULT 0,
    PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS tbl_operator_opgroup (
    operator_id BIGINT NOT NULL,
    op_group_id BIGINT NOT NULL,
    FOREIGN KEY (operator_id) REFERENCES tbl_operator (id) ON DELETE CASCADE ON UPDATE RESTRICT,
    FOREIGN KEY (op_group_id) REFERENCES tbl_op_group (id) ON DELETE CASCADE ON UPDATE RESTRICT
);

CREATE TABLE IF NOT EXISTS tbl_opgroup_opgroup (
    parent_op_group_id BIGINT NOT NULL,
    op_group_id BIGINT NOT NULL,
    FOREIGN KEY (parent_op_group_id) REFERENCES tbl_op_group (id) ON DELETE CASCADE ON UPDATE RESTRICT,
    FOREIGN KEY (op_group_id) REFERENCES tbl_op_group (id) ON DELETE CASCADE ON UPDATE RESTRICT
);

CREATE TABLE IF NOT EXISTS tbl_operator_permission (
    id BIGSERIAL,
    operator_id BIGINT,
    permission_id VARCHAR(512) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (operator_id ) REFERENCES tbl_operator (id)
);

CREATE TABLE IF NOT EXISTS tbl_operator_data_permission (
    id BIGSERIAL,
    operator_id BIGINT,
    type INTEGER NOT NULL, -- '资源类型: 1：集群：2：主机，3：虚拟机',
    resource_id BIGINT NOT NULL, -- '集群、主机、虚拟机的ID',
    op_group_id BIGINT ,-- COMMENT '操作员分组的ID',
    propagate INT NOT NULL DEFAULT 1 , -- COMMENT '传播到子对象: 0：不支持；1：支持， 默认1',
    op_group_code VARCHAR(256),
    PRIMARY KEY (id),
    FOREIGN KEY (operator_id) REFERENCES tbl_operator (id),
    FOREIGN KEY (op_group_id) REFERENCES tbl_op_group (id)
);

CREATE TABLE IF NOT EXISTS tbl_opgroup_permission (
    id BIGSERIAL,
    op_group_id BIGINT,
    permission_id VARCHAR(512) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (op_group_id) REFERENCES tbl_op_group (id)
);
CREATE TABLE IF NOT EXISTS TBL_STORAGE_RESOURCE (
  id BIGSERIAL,
  name VARCHAR(256) NOT NULL,
  description VARCHAR(512),
  type SMALLINT NOT NULL,
  outgoing_chap_username VARCHAR(256),
  outgoing_chap_key VARCHAR(256),
  incoming_chap_username VARCHAR(256),
  incoming_chap_key VARCHAR(256),
  PRIMARY KEY (ID)
);

CREATE TABLE IF NOT EXISTS TBL_STORAGE_RESOURCE_HOST (
  id BIGSERIAL,
  host_id INTEGER NOT NULL ,
  storage_resource_id BIGINT NOT NULL,
  PRIMARY KEY (ID)
);

CREATE TABLE IF NOT EXISTS TBL_STORAGE_RESOURCE_IP (
  id BIGSERIAL,
  storage_ip VARCHAR(256),
  storage_resource_id BIGINT NOT NULL,
  ip_type VARCHAR(64),
  PRIMARY KEY (ID)
);
CREATE TABLE IF NOT EXISTS tbl_hostpool (
    id BIGSERIAL,
    name VARCHAR(256) NOT NULL,
    last_login_time TIMESTAMP(0),
    public_cloud_id BIGINT,
    op_group_id BIGINT DEFAULT 1,
    op_group_code VARCHAR(256) DEFAULT '00',
    storage_ip VARCHAR(256),
    storage_mask VARCHAR(256),
    title VARCHAR(256) NOT NULL DEFAULT '',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_cluster (
    id BIGSERIAL,
    host_pool_id BIGINT NOT NULL,
    name VARCHAR(256) NOT NULL,
    description VARCHAR(256) ,
    enable_ha INTEGER CHECK(enable_ha >= 0) NOT NULL DEFAULT 0, -- '0:不启用HA 1:启用HA',
    vm_restart_priority INT, -- '启动优先级:0:低级，1：中级，2：高级',
    enable_lb INTEGER CHECK(enable_lb >= 0) NOT NULL DEFAULT 0, -- '0:不启用负载均衡 1:启用负载均衡',
    persist_time INT, -- '持续时间',
    check_interval INT, -- '检查间隔',
    lb_monitor_id BIGINT, -- '负载均衡监控策略ID',
    enable_slb INTEGER CHECK(enable_slb >= 0) NOT NULL DEFAULT 0, -- '0:不启用存储负载均衡 1:启用存储负载均衡',
    slb_persist_time INT, -- '存储负载均衡持续时间',
    slb_check_interval INT, -- '存储负载均衡检查间隔',
    slb_monitor_id BIGINT, -- '存储负载均衡监控策略ID',
    enable_ipm INTEGER CHECK(enable_ipm >= 0) NOT NULL DEFAULT 0, -- '0:不启用电源智能管理 1:启用电源智能管理',
    persist_time_ipm INT, -- '持续时间',
    ipm_lower_monitor_id BIGINT, -- '主机回收监控策略ID',
    ipm_upper_monitor_id BIGINT, -- '主机扩展监控策略ID',
    check_interval_ipm INT, -- '检查间隔',
    drs_enable_time INT, -- '集群DRS启用的时间段，高位2字节表示开始时间，低位2字节表示截止时间。表示时间的2字节，高位表示时，低位表示分。',
    ipm_enable_time INT, -- '集群IPM启用的时间段，高位2字节表示开始时间，低位2字节表示截止时间。表示时间的2字节，高位表示时，低位表示分。',
    op_group_id BIGINT DEFAULT 1,
    op_group_code VARCHAR(256) DEFAULT '00',
    broadcast_addr VARCHAR(256), -- '组播地址',
    broadcast_port INT, -- '组播端口',
    public_cloud_id BIGINT,
    ha_min_host INTEGER NULL DEFAULT NULL,
    enable_storage_ha INTEGER NULL DEFAULT 0, -- '0:不启用HA 1:启用HA',
    enable_stretched INTEGER NULL DEFAULT 0, -- '0:集群关闭延展配置 ，1:集群启用延展配置',
    ha_cpu_retain INTEGER NULL, -- 'HACPU资源预留',
    ha_mem_retain INTEGER NULL, -- 'HA内存资源预留',
    ha_control_strategy INTEGER NOT NULL DEFAULT 0, -- 'HA接入控制方式：0：不使用任何；1:最小节点数；2：资源预留；3：指定故障切换主机',
    enable_business_ha INTEGER NOT NULL DEFAULT 0, -- '业务网HA开启状态，0：关闭，1开启',
    trigger_action INTEGER NOT NULL DEFAULT 2, -- '触发操作, 1:故障迁移,2:虚拟机冻结',
    type INTEGER NULL DEFAULT NULL,
    container_cluster INTEGER NOT NULL DEFAULT 0, -- '是否是容器集群，0-普通集群、1-容器集群',
    local_disk_ha INTEGER NOT NULL DEFAULT 0, -- '本地磁盘HA开启状态，0：关闭，1开启',
    local_disk_time INTEGER NOT NULL DEFAULT 30, -- '本地磁盘故障检测周期',
    strategy_delay_time INTEGER NOT NULL DEFAULT 12000, -- '主机存储故障处理策略延迟',
    cpu_mode INTEGER NOT NULL DEFAULT 0, -- '虚拟机CPU工作模式：0-兼容模式; 1-主机匹配模式;2-直通模式;3-EMC模式',
    emc_type INT, -- 'EMC模式：0-intel EMC;1-AMD EMC',
    emc_cpu_model INT, -- 'EMC模式中使用的CPU型号',
    host_profile_id BIGINT DEFAULT NULL, -- '主机配置文件ID',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_host (
    id BIGSERIAL,
    host_pool_id BIGINT NOT NULL,
    cluster_id BIGINT,
    name VARCHAR(256) NOT NULL, -- '主机名称',
    ipaddr VARCHAR(256) NOT NULL, -- '主机地址',
    host_user VARCHAR(45) NOT NULL DEFAULT 'root',
    pw VARCHAR(256) DEFAULT NULL,
    memory INTEGER CHECK(memory >= 0) DEFAULT NULL ,
    cpu INTEGER CHECK(cpu >= 0),
    cpu_cores INTEGER CHECK(cpu_cores >= 0),
    cpu_sockets INTEGER CHECK(cpu_sockets >= 0),
    storage BIGINT CHECK(storage >= 0) DEFAULT NULL ,
    status INTEGER CHECK(status >= 0) DEFAULT NULL ,
    cpu_frequency INTEGER CHECK(cpu_frequency >= 0) DEFAULT 0,
    cpu_provider VARCHAR(45),
    cpu_detail VARCHAR(128),
    provider VARCHAR(128),
    storage_allocation BIGINT CHECK(storage_allocation >= 0) ,
    storage_avilable BIGINT CHECK(storage_avilable >= 0) ,
    iscsi_node_name VARCHAR(128),
    maintain INTEGER CHECK(maintain >= 0) DEFAULT 0, -- '0:正常,1:维护模式',
    cvk_maintain INTEGER CHECK(cvk_maintain >= 0) DEFAULT 0, -- '0:正常,1:维护模式',
    public_cloud_id BIGINT,
    mac VARCHAR(32),
    op_group_id BIGINT DEFAULT 1,
    op_group_code VARCHAR(256) DEFAULT '00',
    wake_category INTEGER CHECK(wake_category >= 0) DEFAULT 0, -- '0:网络唤醒,1:IPMI唤醒',
    ipmi_ipaddr VARCHAR(256) DEFAULT NULL, -- '主机ilo地址',
    ipmi_user VARCHAR(45) DEFAULT NULL,
    ipmi_pw VARCHAR(45) DEFAULT NULL,
    ha_enable INTEGER DEFAULT 0, -- '主机是否在HA中：0，不在；1，在',
    cvk_version VARCHAR(45) NOT NULL DEFAULT '',
    add_time TIMESTAMP(0),
    ha_resource INTEGER NULL DEFAULT 0, -- '主机是否为HA故障切换主机：0，不是；1：是',
    node_num INTEGER NOT NULL DEFAULT 0, -- 'OCFS2 node number',
    storage_ip VARCHAR(256),
    ilos VARCHAR(64) DEFAULT NULL, -- '主机iLO，异常状态时显示，";"分割',
    type INTEGER NULL DEFAULT NULL,
    sync_mark INTEGER NULL DEFAULT 0,
    nvme_node_name VARCHAR(128),
    top_emc_cpu_model INT, -- '主机支持的最高CPU型号',
    secret_level INTEGER NOT NULL DEFAULT 1,
    rdma_issue INTEGER NULL DEFAULT 1, -- '主机RDMA配置下发：0，下发失败；1：下发成功',
    serial_number VARCHAR(128), -- '主机chassis序列号',
    host_profile_id BIGINT DEFAULT NULL, -- '主机配置文件ID',
    third_party_encrypted INT NOT NULL DEFAULT 0, -- '加密结果，0:未加密；1：渔翁加密成功',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_system_desc (
    id BIGINT NOT NULL,
    type INTEGER NOT NULL,
    description VARCHAR(128) DEFAULT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_operlog (
    id BIGSERIAL,
    login_name VARCHAR(256) NOT NULL,
    user_name VARCHAR(256),
    oper_start_time TIMESTAMP(0) DEFAULT NULL,
    oper_time TIMESTAMP(0) NOT NULL,
    address VARCHAR(256) NOT NULL,
    category INTEGER NOT NULL,
    description VARCHAR(512) NOT NULL,
    result SMALLINT NOT NULL,
    failure_reason VARCHAR(512),
    target_id BIGINT,
    target_name VARCHAR(256),
    level SMALLINT,
    event SMALLINT,
    category_id BIGINT,
    related_category INTEGER, -- '关联动作类型',
    oper_obj VARCHAR(64), -- '操作对象主键',
    op_group_id BIGINT, -- '产生操作日志的操作员所在组,1表示系统管理员组，2表示安全审计员组，3表示安全保密管理员组，null表示类似如root/$SYSTEM/admin@VMC-RS等不在TBL_OPERATOR表里的用户所在的组',
    operator_type INTEGER NOT NULL DEFAULT 0,
    data_signature VARCHAR(512), -- '第三方密评数字签名--密码机--完整性',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_parameter (
    id BIGSERIAL,
    type VARCHAR(256) NOT NULL,
    name VARCHAR(256) NOT NULL,
    value VARCHAR(512),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_password_history (
    id BIGSERIAL,
    target_id BIGINT NOT NULL , --  '操作对象id',
    password VARCHAR(256) NOT NULL , --  '历史密码',
    target_type INTEGER DEFAULT  1 , --  '操作对象类型 1：操作员 2：主机 3：vnc',
    save_time TIMESTAMP(0) NOT NULL , --  '保存历史密码的时间',
    PRIMARY KEY(id)
 );

CREATE TABLE IF NOT EXISTS tbl_domain (
    id BIGSERIAL,
    host_id INTEGER CHECK(host_id >= 0) NOT NULL DEFAULT 0,
    host_pool_id BIGINT NOT NULL,
    cluster_id BIGINT,
    domain_name VARCHAR(128) NOT NULL DEFAULT '',
    title VARCHAR(128) NOT NULL DEFAULT '',
    description VARCHAR(2048) ,
    memory INTEGER CHECK(memory >= 0) NOT NULL DEFAULT 0, -- '内存，兆',
    cpu INTEGER CHECK(cpu >= 0) NOT NULL DEFAULT 0, -- 'CPU个数',
    cdrom INTEGER CHECK(cdrom >= 0) NOT NULL DEFAULT 0, -- '0:CDROM 1:ISO',
    enable INTEGER CHECK(enable >= 0) NOT NULL DEFAULT 0, -- '0:未管理;1:管理;2:模板',
    uuid VARCHAR(60) NOT NULL DEFAULT '',
    os_bit VARCHAR(45) NOT NULL DEFAULT '', -- 'X86_64  X86_32',
    system INTEGER CHECK(system >= 0) NOT NULL DEFAULT 0, -- '0:Windows;1:Linux ',
    img_file_name VARCHAR(256) DEFAULT NULL,
    img_file_type VARCHAR(45) NOT NULL DEFAULT 'NotDeployed', -- '镜像文件类型，当cdrom值为0时，该值为host_cdrom',
    view_type VARCHAR(45) DEFAULT NULL, -- '显示类型',
    auto INTEGER CHECK(auto >= 0) NOT NULL DEFAULT 1, -- '自动配置0：自动1：手动',
    drive VARCHAR(45) DEFAULT NULL, -- '显示驱动 vga;cirrus;vmvga',
    booting_device INTEGER CHECK(booting_device >= 0) NOT NULL DEFAULT 2, -- '1 disk 2 cdrom',
    auto_booting INTEGER CHECK(auto_booting >= 0) NOT NULL DEFAULT 0, -- '0:不自动启动 1:自动启动',
    op_group_id BIGINT DEFAULT 1,
    op_group_code VARCHAR(256) DEFAULT '00',
    priority INT, -- '启动优先级',
    auto_migrate SMALLINT, -- '是否允许自动迁移',
    enable_vnc_proxy INTEGER DEFAULT 0, -- '1：启用，0或空为不启用',
    create_date TIMESTAMP(0),
    public_cloud_id BIGINT,
    computer_name VARCHAR(128), -- '计算机名称',
    os_version VARCHAR(128),
    memory_init NUMERIC(10,2), -- '分配的内存大小',
    memory_unit VARCHAR(10), -- '内存单位',
    memory_limit NUMERIC(10,2), -- '内存限制',
    memory_limit_unit VARCHAR(10), -- '内存限制单位',
    ha_status INTEGER DEFAULT 0, -- 'HA状态 0:正常 1:未加入HA 2:已加入HA，配置文件不同步',
    originate INTEGER DEFAULT 0, -- '1:CAS 2:NOVA 3:REST',
    src_host_id BIGINT, -- '迁移前的主机ID',
    memory_locked INTEGER CHECK(memory_locked >= 0), -- '内存预留',
    memory_priority INTEGER CHECK(memory_priority >= 0), -- '内存资源优先级',
    cpu_quota_init NUMERIC(10,2),
    cpu_quota_unit VARCHAR(10),
    protect_model INTEGER DEFAULT 0,
    start_status INT,
    status INTEGER CHECK(status >= 0) NOT NULL DEFAULT 3, -- '虚拟机运行状态.1:未知 2:运行 3:关闭 4 暂停',
    last_update_time INTEGER NOT NULL DEFAULT 0, -- '由用户界面操作产生的状态修改时间',
    ha_manage INTEGER DEFAULT 1, -- '1为被HA管理，0为未被HA管理',
    templet_id BIGINT,
    del_time INTEGER NULL DEFAULT 0, -- '虚拟机删除时间',
    disk_change INTEGER DEFAULT 0,
    castools_status INTEGER,
    castools_version VARCHAR(20),
    uptime INTEGER DEFAULT -1, -- '虚拟机运行时间；单位：分钟；-1为未知',
    templet_storage_path VARCHAR(512),
    create_restore_point_date TIMESTAMP(0) DEFAULT NULL, -- '虚拟机创建还原点时间 ',
    last_restore_date TIMESTAMP(0) DEFAULT NULL, -- '最近一键虚拟机还原时间',
    antivirus_enable INTEGER NOT NULL DEFAULT 0, -- '是否安装防病毒',
    secret_level INTEGER DEFAULT 1 , -- '1：内部公开；2；秘密；3：机密；4：绝密',
    last_off_time INTEGER NOT NULL DEFAULT 0, -- '虚拟机关机时间，活动状态时为０',
    integrity_check INTEGER DEFAULT 0, -- '是否开启完整性校验：0或空:不启用, 1：启用',
    time_sync INTEGER NOT NULL DEFAULT 2, -- '虚拟机时间同步 0:成功 1:失败 2:未配置',
    vm_type INTEGER DEFAULT 1,
    host_binding INTEGER DEFAULT 0,
    enable_increase_cpu INTEGER DEFAULT NULL,
    metadata VARCHAR(256) DEFAULT NULL, -- '元数据,用于保存domain新增描述信息',
    rdt VARCHAR(8) DEFAULT null, -- '虚拟机是否开启intel RDT特性: enabled 开启, 其他任何值表示关闭',
    template_status INTEGER NULL DEFAULT 0, -- '虚拟机模板状态，0：正常，1：维护',
    antivirus_status INTEGER DEFAULT NULL, -- '虚拟机防病毒实际状态，1：启用 2：系统不支持 3：驱动安装失败',
    kaas_vm INTEGER DEFAULT 0, -- '虚拟机是否是K8S节点虚拟机，0：否 1：是',
    huge_page_status BOOL DEFAULT NULL,
    issue_date BIGINT, -- '修改虚拟机模板大小的时间',
    isencrypt BOOLEAN NOT NULL DEFAULT FALSE,
    secrect_key VARCHAR(256) DEFAULT NULL,
    algorithm VARCHAR(64) DEFAULT NULL,
    ft_status SMALLINT NULL DEFAULT 0,
    cpu_core INTEGER CHECK(cpu_core >= 0) DEFAULT NULL, -- 'CPU core, null means not initialized yet',
    cpu_socket INTEGER CHECK(cpu_socket >= 0) DEFAULT NULL, -- 'CPU socket, null means not initialized yet',
    auto_mem INTEGER DEFAULT NULL, -- '是否开启内存气球功能。 0-关闭， 1-开启, null means not initialized yet',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_domain_cpu_hour (
    id BIGSERIAL,
    domain_id INTEGER CHECK(domain_id >= 0) NOT NULL,
    host_id INTEGER CHECK(host_id >= 0),
    host_pool_id BIGINT,
    time INTEGER CHECK(time >= 0) NOT NULL DEFAULT 0,
    memory INTEGER CHECK(memory >= 0) DEFAULT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_domain_migrate (
    id BIGSERIAL,
    domain_id INTEGER NOT NULL,
    oper_time TIMESTAMP(0) NOT NULL,
    src_host VARCHAR(256),
    dest_host VARCHAR(256) NOT NULL,
    oper_type INTEGER NOT NULL,
    time_interval BIGINT NOT NULL DEFAULT 0,
    login_name VARCHAR(256), -- '操作员登录名',
    src_pools_title VARCHAR(512), -- '源存储的显示名称，以逗号分割，仅迁移主机+存储时使用',
    dest_pool_title VARCHAR(512), -- '目的存储的显示名称，仅迁移主机+存储时使用',
    PRIMARY KEY (id)
);
CREATE TABLE IF NOT EXISTS tbl_domain_task_info (
    id BIGSERIAL,
    domain_id INTEGER NOT NULL,
    src_host_id INT,
    dest_host_id INT,
    oper_type INTEGER NOT NULL, -- '操作类型',
    current_oper_step INT, -- '当前操作步骤',
    PRIMARY KEY (id)
);
CREATE TABLE IF NOT EXISTS tbl_domain_network (
    id BIGSERIAL,
    net_type INTEGER CHECK(net_type >= 0) NOT NULL DEFAULT 0, -- '0桥接 1NAT 2不使用网络',
    mac VARCHAR(60) DEFAULT NULL,
    ip_addr VARCHAR(256),
    mask VARCHAR(32),
    gateway VARCHAR(32),
    dns VARCHAR(32),
    second_dns VARCHAR(32),
    domain_id INTEGER CHECK(domain_id >= 0) DEFAULT 0,
    name VARCHAR(45) DEFAULT NULL, -- 'default ；bridgeNet ；空 ',
    device_model VARCHAR(45) NOT NULL DEFAULT 'rtl8139',
    vcf_profile_uuid VARCHAR(60),
    vcf_security_uuid VARCHAR(60),
    vcf_net_uuid VARCHAR(60),
    vcf_portgroup_uuid VARCHAR(60),
    ipv6_ip_addr VARCHAR(256), -- 'ipv6ip地址',
    ipv6_prefix_length INTEGER CHECK(ipv6_prefix_length >= 0), -- 'ipv6前缀长度',
    ipv6_gateway VARCHAR(256),
    ipv6_dns VARCHAR(256),
    ipv6_second_dns VARCHAR(256),
    ipv6_mode VARCHAR(256),
    ipv4_dhcp INTEGER DEFAULT 0,
    ipv6_dhcp INTEGER DEFAULT 0,
    ip_config_success INTEGER DEFAULT 0,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_domain_storage (
    id BIGSERIAL,
    store_file VARCHAR(512) NOT NULL DEFAULT '',
    capacity BIGINT CHECK(capacity >= 0) NOT NULL DEFAULT 0,
    domain_id INTEGER CHECK(domain_id >= 0) DEFAULT 0,
    target_bus VARCHAR(10) NOT NULL DEFAULT '0', -- 'ide scsi virtio usb\r\n\r\n    SCSI("scsi"),\r\n\r\n    VIRTIO("virtio"),\r\n\r\n    USB("usb");',
    type VARCHAR(10) NOT NULL DEFAULT '0', -- 'file block',
    device VARCHAR(45) DEFAULT NULL, -- 'hda hdb hdc ',
    format VARCHAR(45) DEFAULT NULL, -- 'Read-Write  Read-ForceWrite  Read-Only',
    drive_type VARCHAR(10) DEFAULT NULL, -- '存储卷类型',
    drive_controller VARCHAR(10) DEFAULT NULL, -- '存储控制器',
    assign_type INTEGER CHECK(assign_type >= 0) NOT NULL DEFAULT 0, -- '0指定 1动态分配',
    disk_device VARCHAR(10),
    md5 VARCHAR(64),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_backup_strategy (
    id BIGSERIAL,
    name VARCHAR(256) NOT NULL,
    description VARCHAR(256),
    state INT, -- '是否生效：生效：1，不生效：0',
    store_mode INT, -- '备份目的类型，0：共享文件系统，1：远端服务器',
    store_location VARCHAR(256), -- '共享文件位置',
    target_addr VARCHAR(256), -- '目的服务器IP地址',
    login_name VARCHAR(50), -- '目的服务器用户名',
    password VARCHAR(256) , -- '密码',
    server_type INT, -- '服务器类型，0：选择FTP，1:选择SCP',
    frequency INT, -- '频率:，0：每月:1：每周，2：每日 ',
    day INT, -- '哪天：几日，或星期几，每天 ',
    hour INT, -- '时',
    minutes INT, -- '分',
    hour_end INT,
    minutes_end INT,
    port INT,
    inc_backup_flag INT, -- '是否启用增量备份：启用：1，不启用：0',
    inc_backup_frequency INT, -- '频率:，1：每周，2：每日，3：每小时 ',
    inc_backup_day INT, -- '哪天：几日，或星期几，每天 ',
    inc_backup_hour INT, -- '时',
    inc_backup_minutes INT, -- '分',
    inc_hour_end INT,
    inc_minutes_end INT,
    cluster_id BIGINT,
    op_group_id BIGINT DEFAULT 1,
    op_group_code VARCHAR(256) DEFAULT '00',
    next_inc_backup TIMESTAMP(0),
    next_full_backup TIMESTAMP(0),
    keep_times INT,
    backup_threshold INT,
    tmp_dir VARCHAR(256),
    is_compression INT,
    is_md5check INTEGER DEFAULT 0,
    read_ratio INTEGER DEFAULT 0,
    write_ratio INTEGER DEFAULT 0,
    cache_type INTEGER DEFAULT 0,
    backup_type INTEGER DEFAULT 0, -- '备份类型，0：整机备份，1：磁盘备份',
    backup_method INTEGER DEFAULT 0,
    backup_pool_id BIGINT,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_backup_strategy_disk (
    id BIGSERIAL,
    backup_strategy_id BIGINT,
    domain_id BIGINT,
    cluster_id BIGINT,
    dev_name VARCHAR(256),
    next_full_backup TIMESTAMP(0),
    next_inc_backup TIMESTAMP(0),
    priority INTEGER DEFAULT 0, -- '备份时磁盘的优先级，数字越小优先级越高',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_backup_strategy_vm (
    id BIGSERIAL,
    cluster_id BIGINT,
    backup_strategy_id BIGINT,
    domain_id BIGINT,
    next_full_backup TIMESTAMP(0),
    next_inc_backup TIMESTAMP(0),
    priority INTEGER DEFAULT 0, -- '备份时虚拟机的优先级，数字越小优先级越高',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_vswitch (
    id BIGSERIAL,
    name VARCHAR(256) NOT NULL,
    cluster_id BIGINT,
    host_id BIGINT,
    description VARCHAR(256),
    vnic INTEGER NOT NULL, -- '虚拟端口数量',
    mode INTEGER NOT NULL, -- '转发模式',
    flag INT, -- '标示，0 : 主机下; 1: 集群下',
    vxlan_scope_id BIGINT NULL, -- '作为外桥的虚拟交换机所在的vxlan域ID',
    ha_status INTEGER NOT NULL DEFAULT 0, -- 'HA状态，0：正常，1：故障',
    network_type INTEGER NOT NULL DEFAULT 2, -- '1、业务网络，2、管理网络，3、备份网络，4、迁移网络，5、存储网络',
    storage_node_setted INTEGER NOT NULL DEFAULT 0, -- '是否已将交换机IP设置到本主机的acesure存储节点上，0 未设置，1 已设置',
    accele_mode INT, -- '是否智能，空或0：普通网卡虚拟交换机，1：智能网卡虚拟交换机',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_vswitch_pnic (
    id BIGSERIAL,
    vswitch_id BIGINT,
    host_id BIGINT NOT NULL,
    pnic VARCHAR(256) NOT NULL,
    nic_type INT, -- '是否智能，空或0：普通网卡，1：智能网卡',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_port_profile (
    id BIGSERIAL,
    name VARCHAR(256) NOT NULL,
    description VARCHAR(256),
    acl_strategy_id INT,
    enable_vlan INTEGER DEFAULT 0, -- '启用VLAN, 1 :启用，0:不启用',
    vlan_id INT,
    inbound INT, -- '启用入方向流量限制, 1 :启用，0:不启用',
    in_avg_bandwidth INT, -- '入方向平均带宽',
    in_peak_bandwidth INT, -- '入方向峰值带宽',
    in_burst_size INT, -- '突发缓冲大小',
    outbound INT, -- '启用出方向流量限制, 1 :启用，0:不启用',
    out_avg_bandwidth INT, -- '出方向平均带宽',
    out_peak_bandwidth INT, -- '出方向峰值带宽',
    out_burst_size INT, -- '突发缓冲大小',
    enable_vsi INT, -- '启用VSI, 1 :启用，0:不启用',
    vsi_mng_id VARCHAR(100), -- 'VSI管理ID',
    vsi_net_resource INT, -- 'VSI网络资源',
    vsi_type_id INT, -- 'VSI类型ID',
    vsi_type_ver INT, -- 'VSI类型版本',
    vsi_type_ver_id INT, -- 'VSI类型版本ID',
    vsi_id_format VARCHAR(50), -- 'VSI ID格式',
    op_group_id BIGINT NOT NULL DEFAULT 1,
    op_group_code VARCHAR(256) NOT NULL DEFAULT '00',
    vnet_priority INT,
    vlan_type INTEGER DEFAULT 0,
    net_limit_profile_id BIGINT DEFAULT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_profile_vswitch_domain (
    id BIGSERIAL,
    profile_id BIGINT NOT NULL,
    vswitch_id BIGINT NOT NULL,
    vswitch_name VARCHAR(256) NOT NULL,
    domain_id BIGINT NOT NULL,
    mac VARCHAR(60) NOT NULL,
    caas_conn_id BIGINT,
    vcf_port_uuid VARCHAR(60),
    acl_strategy_id BIGINT DEFAULT NULL,
    security_group_id VARCHAR(256) DEFAULT NULL,
    net_limit_profile_id BIGINT DEFAULT NULL,
    vlan_id INT,
    drain_id INT,
    old_nw_filter_upgrade_flag INT,
    vlan_trunk_id VARCHAR(256) DEFAULT NULL,
    pvlan_rule_id BIGINT DEFAULT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_port_trunk (
    id BIGSERIAL,
    MAC VARCHAR(60) NOT NULL,
    VLAN_ID INTEGER NOT NULL,
    DOMAIN_ID BIGINT NOT NULL,
    PMAC VARCHAR(60) NOT NULL,
    TRUNK_DOMAIN_ID BIGINT NOT NULL,
    PORT_NAME VARCHAR(60) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_share_file_system (
    id BIGSERIAL,
    name VARCHAR(256) NOT NULL,
    title VARCHAR(256) NOT NULL,
    description VARCHAR(256) ,
    type INTEGER NOT NULL, -- '共享存储类型，1：iSCSI，2:SCSI',
    target_host VARCHAR(1024),
    target_name VARCHAR(256),
    lun_name VARCHAR(128),
    mount_path VARCHAR(512),
    lock_mode VARCHAR(128), -- '磁盘锁类型 none, dlm, dlock',
    host_pool_id BIGINT,
    slot_num INTEGER DEFAULT 32, -- 'mount number',
    is_merge INTEGER DEFAULT 0,
    is_speed INTEGER DEFAULT 0,
    io_control INTEGER NULL DEFAULT 0,
    delay_threshold INTEGER NULL DEFAULT 30,
    capacity_control INTEGER DEFAULT 1, -- '自动部署虚拟机，0：不允许，1：允许',
    secret_level INTEGER DEFAULT 1 , -- '1：内部公开；2；秘密；3：机密；4：绝密',
    need_initialize  BOOL DEFAULT NULL, -- '1：需要初始化；0：不需要初始化； null：不需要初始化',
    storage_resource_id BIGINT, --'存储资源ID'
    PRIMARY KEY (id)
);

create table if not exists tbl_fs_lun_info (
    id BIGSERIAL,
    target_host VARCHAR(1024),
    naa VARCHAR(128),
    lun VARCHAR(256),
    capacity BIGINT,
    share_file_system_id BIGINT NOT NULL,
    target_host2 VARCHAR(50),
    subnqn VARCHAR(256),
    uuid VARCHAR(256),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_storage_pool_config (
    id BIGSERIAL,
    storage_pool_name VARCHAR(256) NOT NULL,
    share_file_system_id BIGINT NOT NULL,
    host_id bigint NOT NULL,
    host_pool_id BIGINT,
    storage_pool_init INT, -- '是否首次启动存储池 1: 是, 0或空: 否',
    type INT, -- '存储池类型',
    path VARCHAR(256), -- '存储池路径',
    cache_type INT, -- '加速类别',
    cache_config VARCHAR(256), -- '硬盘名称',
    io_limit INTEGER DEFAULT 0, -- 'IO控制',
    cache_size BIGINT, -- '加速盘大小',
    storage_resource_id BIGINT, --'存储资源ID'
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_storage_lun_info (
    id BIGSERIAL,
    naa VARCHAR(128) NOT NULL,
    capacity BIGINT NOT NULL,
    storage_pool_config_id BIGINT NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_acl_strategy (
    id BIGSERIAL,
    name VARCHAR(256) NOT NULL, -- 'ACL策略名称',
    type INTEGER NOT NULL DEFAULT 3, -- 'acl策略类型，3表示三层/四层ACL，2表示二层ACL',
    description VARCHAR(256), -- 'ACL策略描述',
    default_acl_action INT, -- 'ACL规则入方向默认动作(0:拒绝;1:允许)',
    default_acl_out_action INT, -- 'ACL规则出方向默认动作(0:拒绝;1:允许)',
    create_time TIMESTAMP(0), -- 'ACL策略创建时间',
    last_update_time INTEGER NULL DEFAULT 0, -- 'ACL策略最后更新时间',
    effect_time_range VARCHAR(256) NULL, -- '二层ACL策略生效时间段,如：0-3,5-5',
    timerange_enabled INTEGER DEFAULT 0, -- '时间段配置是否生效，0不生效 1生效',
    op_group_id BIGINT DEFAULT 1,
    op_group_code VARCHAR(256) DEFAULT '00',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_acl_rule (
    id BIGSERIAL,
    acl_strategy_id INTEGER NOT NULL,
    protocol INT, -- 'ACL规则协议号码, ICMP为1,TCP为6,UDP为17，所有协议为65535',
    src_ip VARCHAR(64), -- '源IP地址',
    src_mask VARCHAR(64), -- '源IP掩码',
    src_port INT, -- '源端口',
    dest_ip VARCHAR(64), -- '目的IP地址',
    dest_mask VARCHAR(64), -- '目的IP掩码',
    dest_port INT, -- '目的端口',
    src_mac VARCHAR(64) NULL, -- '二层ACLRule中使用的源MAC',
    dest_mac VARCHAR(64) NULL, -- '二层ACLRule中使用的目的MAC',
    action INT, -- 'ACL规则对报文采取的动作(0:拒绝;1:允许)',
    priority INT, -- '优先级',
    direction INT, -- '被ACL所控制报文的流向，此字段目前前台不显示，0表示流入；1，表示流出。默认为1。',
    ip_type VARCHAR(64), -- 'ip类型：ipv4 or ipv6',
    src_port_end INTEGER DEFAULT NULL, -- '源结束端口，非空时SRC_PORT表示源开始端口',
    dest_port_end INTEGER DEFAULT NULL, -- '目的结束端口，非空时DEST_PORT表示目的开始端口',
    type INTEGER DEFAULT NULL, -- 'ICMP协议类型，rest接口使用',
    code INTEGER DEFAULT NULL, -- 'ICMP协议编码，rest接口使用',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_snapshot_strategy (
    id BIGSERIAL,
    name VARCHAR(256) NOT NULL,
    description VARCHAR(256),
    state INT, -- '是否生效：生效：1，不生效：0',
    frequency INT, -- '频率:，0：每月:1：每周，2：每日 ',
    day INT, -- '哪天：几日，或星期几，每天 ',
    hour INT, -- '时',
    minutes INT, -- '分',
    op_group_id BIGINT DEFAULT 1,
    op_group_code VARCHAR(256) DEFAULT '00',
    next_snapshot TIMESTAMP(0),
    flag INTEGER DEFAULT 0, -- '0, 只快照DISK, 1 :快照内存',
    consistency INTEGER DEFAULT 0, -- '是否一致性快照，0,否 , 1 :是',
    max_snapshot_num INTEGER DEFAULT 0, -- '0：表示不限制',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_snapshot_strategy_vm (
    id BIGSERIAL,
    cluster_id BIGINT,
    snapshot_strategy_id BIGINT,
    domain_id BIGINT,
    next_snap_time TIMESTAMP(0),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_switch_domain_strategy (
    id BIGSERIAL,
    name VARCHAR(256) NOT NULL, -- '时间策略名称',
    description VARCHAR(256), -- '时间策略描述',
    frequency INT, -- '频率:，0：每年:1：每月，2：每周：3 每天：4 ',
    state INT, -- '策略是否生效：生效：1，不生效：0',
    launch_vm_state INT, -- '启动策略是否生效：生效：1，不生效：0',
    launch_vm_start_month INT,
    launch_vm_end_month INT,
    launch_vm_start_date INT, -- '启动虚拟机的开始时间：几日，或星期几，每天 ',
    launch_vm_end_date INT, -- '启动虚拟机的结束时间：几日，或星期几，每天 ',
    launch_vm_time_point VARCHAR(256), -- '每天启动虚拟机的时间点',
    close_vm_state INT, -- '关闭策略是否生效：生效：1，不生效：0',
    close_vm_start_month INT,
    close_vm_end_month INT,
    close_vm_start_date INT, -- '关闭虚拟机的开始时间：几日，或星期几，每天 ',
    close_vm_end_date INT, -- '关闭虚拟机的结束时间：几日，或星期几，每天 ',
    close_vm_time_point VARCHAR(256), -- '每天关闭虚拟机的时间点',
    power_off BOOLEAN,  --'强制关闭电源',
    op_group_id bigint DEFAULT 1,
    op_group_code VARCHAR(256) DEFAULT '00',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_switch_domain_strategy_vm (
    id BIGSERIAL,
    domain_id BIGINT,
    switch_domain_strategy_id BIGINT,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_stat_task (
    id BIGSERIAL,
    task_name VARCHAR(128) NOT NULL,
    src_table VARCHAR(128) NOT NULL,
    dest_table VARCHAR(128) NOT NULL,
    last_exec_time BIGINT,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_drx_business (
    id BIGSERIAL,
    name VARCHAR(256) NOT NULL,
    description VARCHAR(256),
    cluster_id BIGINT NOT NULL,
    slave_cluster_id BIGINT DEFAULT NULL,
    templet_id BIGINT NOT NULL,
    max_vm_num INTEGER DEFAULT 20,
    state INT, -- '是否生效：生效：1，不生效：0',
    start_time VARCHAR(32),
    end_time VARCHAR(32),
    vm_name_pre VARCHAR(256) NOT NULL, -- '虚拟机名称前缀',
    next_no INT, -- '起始编号',
    add_mode INT, -- '资源注入模式，1：快速克隆，2：预部署',
    add_count INT, -- '批量增加数目',
    add_percent INTEGER DEFAULT NULL, -- '每次扩展百分比，当此字段有大于0的值时，ADD_COUNT字段不再生效',
    recycle_mode INT, -- '资源回收模式，1：关闭，2：删除, 3:休眠',
    pause_time INT, -- '虚拟机延迟回收时间，以分钟为单位',
    keep_vm_num INTEGER DEFAULT 1,
    persist_time INT, -- '持续时间',
    check_interval INT, -- '检查间隔',
    recycle_monitor_id BIGINT, -- '资源回收监控策略ID',
    extend_monitor_id BIGINT, -- '资源注入监控策略ID',
    start_ip VARCHAR(128),
    end_ip VARCHAR(128),
    ip_mask VARCHAR(128),
    gateway VARCHAR(128),
    start_ipv6 VARCHAR(128),
    end_ipv6 VARCHAR(128),
    ipv6_prefix_length VARCHAR(128),
    ipv6_gateway VARCHAR(128),
    ipv6_mode INT,
    recycle_type INT,
    recycle_threshold INT,
    timeout INT,
    add_cpu_num INT,
    max_cpu_num INT,
    add_mem_num INT,
    max_mem_num INT,
    cpu_threshold INT,
    mem_threshold INT,
    op_group_id BIGINT DEFAULT 1,
    op_group_code VARCHAR(256) DEFAULT '00',
    share_file_system_id BIGINT DEFAULT 0, -- '集群共享存储；0：自动选择；非0：共享存储id',
    slave_share_file_system_id BIGINT DEFAULT 0, -- '备集群共享存储；0：自动选择；非0：共享存储id',
    pool_type INTEGER DEFAULT 0, -- '集群共享存储类型；0：自动选择；1：文件共享存储；2：RBD共享存储',
    slave_pool_type INTEGER DEFAULT 0, -- '备集群共享存储类型；0：自动选择；1：文件共享存储；2：RBD共享存储',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_drx_vm (
    id BIGSERIAL,
    drx_business_id BIGINT NOT NULL,
    domain_id BIGINT NOT NULL,
    flag INTEGER DEFAULT 1, -- '0, 不回收, 1 :回收',
    lb_ip VARCHAR(45) NULL, -- '虚拟机作为实服务器在LB中的IP',
    lb_name VARCHAR(128) NULL, -- '虚拟机作为实服务器在LB中显示的名称',
    lb_online INTEGER NOT NULL DEFAULT 0, -- '是否在LB那边上线，0 ：未上线 1：上线',
    lb_port INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_storage_volume (
    id BIGSERIAL,
    file_name VARCHAR(512) NOT NULL,
    pool_path VARCHAR(256),
    level INT, -- '级别' DEFAULT 0,
    backing_file_name VARCHAR(512), -- '上级基础镜像文件',
    domain_id BIGINT,
    domain_name VARCHAR(128),
    title VARCHAR(128),
    host_id BIGINT NOT NULL,
    host_pool_id BIGINT,
    cluster_id BIGINT,
    capacity BIGINT CHECK(capacity >= 0) NOT NULL DEFAULT 0,
    device VARCHAR(45) DEFAULT NULL, -- 'hda hdb hdc ',
    naa VARCHAR(128),
    vol_md5 VARCHAR(32) DEFAULT NULL, -- '存储卷完整性校验码(MD5)',
    -- RBD_POOL_ID BIGINT DEFAULT 0,
    ceph_uuid VARCHAR(64) DEFAULT NULL, -- 'rbd卷对应的CEPH UUID, 其他卷对应为null',
    data_pool_name VARCHAR(64) DEFAULT NULL, -- 'rbd卷对应的datapool, 其他卷对应为null',
    backup_block VARCHAR(256),
    PRIMARY KEY (id)
);
CREATE INDEX IF NOT EXISTS storage_volume_index_1 ON tbl_storage_volume (host_id, file_name, domain_id);

CREATE TABLE IF NOT EXISTS tbl_public_cloud (
    id BIGSERIAL,
    name VARCHAR(128) NOT NULL, -- '外部云名称',
    description VARCHAR(254), -- '外部云描述',
    flag SMALLINT NOT NULL, -- '外部云类型，1：阿里云, 2:CAS, 3 vmware',
    uri VARCHAR(128), -- '访问外部云的URL或IP地址',
    protocal VARCHAR(10), -- '访问外部云的协议',
    port SMALLINT CHECK(port >= 0), -- '访问外部云的Web端口',
    user_name VARCHAR(128), -- '访问外部云的帐号',
    password VARCHAR(128), -- '访问外部云的密码',
    root_path VARCHAR(128),
    uuid VARCHAR(64),
    op_group_id BIGINT DEFAULT 1,
    op_group_code VARCHAR(256) DEFAULT '00',
    relatetype INTEGER NOT NULL DEFAULT 1,
    auth_type INTEGER NOT NULL DEFAULT 1,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_rainbow_defined_item (
    id BIGSERIAL,
    target_id BIGINT, -- '目标节点ID',
    location_x NUMERIC DEFAULT NULL,
    location_y NUMERIC DEFAULT NULL,
    type INT, -- '节点类型   0.云资源  1.主机池  2.集群  3.主机',
    public_cloud_id BIGINT,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_topo_defined_item (
    id BIGSERIAL,
    target_id BIGINT, -- '目标节点ID',
    target_name VARCHAR(128), -- '目标节点名称',
    location_x NUMERIC DEFAULT NULL,
    location_y NUMERIC DEFAULT NULL,
    node_type INT, -- '节点类型   1.云资源  2.主机池  3.集群  4.主机  5.虚拟机',
    topo_type INT, -- '拓扑类型    1：计算 2：网络 3：存储',
    parent_node_name VARCHAR(128) DEFAULT NULL, -- '父节点',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_virtual_storage (
    id BIGSERIAL,
    description VARCHAR(254), -- '虚拟存储描述',
    target VARCHAR(256),
    host_id BIGINT,
    ipaddr VARCHAR(128) NOT NULL, -- 'ip地址',
    "user" VARCHAR(64),
    password VARCHAR(128),
    type INTEGER DEFAULT 1, -- '类型1: iscsi',
    storage_file VARCHAR(256)  NOT NULL, -- '存储镜像文件',
    capacity BIGINT NOT NULL, -- '存储容量,单位为G',
    assign_mode INT, -- '分配模式，1：动态，2：静态',
    op_group_id BIGINT DEFAULT 1,
    op_group_code VARCHAR(256) DEFAULT '00',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_virtual_storage_acl (
    id BIGSERIAL,
    virtual_storage_id BIGINT NOT NULL,
    ipaddr VARCHAR(128),
    ip_mask VARCHAR(128),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_event (
    id BIGSERIAL,
    catalog_id INTEGER NOT NULL,
    state INTEGER NOT NULL,
    event_level INTEGER NOT NULL,
    event_type INTEGER NOT NULL,
    event_name VARCHAR(256),
    event_src VARCHAR(256),
    first_event_time TIMESTAMP(0) NOT NULL, -- '首次告警时间',
    event_time TIMESTAMP(0) NOT NULL,
    event_count INTEGER NOT NULL DEFAULT 1, -- '告警次数',
    event_desc VARCHAR(512) NOT NULL,
    target_id BIGINT NOT NULL DEFAULT 0, -- '主机告警表示主机的ID，虚拟机告警表示虚拟机ID，集群告警表示集群ID',
    uuid VARCHAR(60),
    child_target VARCHAR(256), -- '次一级对象标识',
    confirm_time BIGINT NOT NULL DEFAULT 0, -- '告警确认时间',
    object_name_md VARCHAR(32), -- '告警对象的md5',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_event_catalog (
    id BIGSERIAL,
    event_type INTEGER NOT NULL,
    reason VARCHAR(1024),
    suggest VARCHAR(1024),
    experience VARCHAR(512),
    category INTEGER NOT NULL DEFAULT 6, -- '告警大类，默认６－其他类',
    rule_id BIGINT NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_drs_rule (
    id BIGSERIAL,
    cluster_id BIGINT NOT NULL,
    name VARCHAR(256) NOT NULL, -- '规则名称',
    drs_type INT, -- '规则类型(1:虚拟机必须运行在一台机器;2:不能运行在同一台机器上;3:虚拟机组与主机组关联)',
    flag INT, -- '标识(1:虚拟机必须关联运行;2:虚拟机必须关联关闭;3虚拟机必须关联关闭、运行)',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_drs_rule_vm_list (
    id BIGSERIAL,
    drs_rule_id BIGINT NOT NULL,
    cluster_id BIGINT NOT NULL,
    domain_id BIGINT,
    domain_name VARCHAR(128), -- '虚拟机名称',
    domain_group_id BIGINT, -- '虚拟机组id',
    host_group_id BIGINT, -- '主机组id',
    drs_group_type INT, -- '规则类型(1:虚拟机组必须运行在一组机器;2:不能运行在同一组机器上)',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_monitor_strategy (
    id BIGSERIAL,
    name VARCHAR(256) NOT NULL, -- '监控策略名称',
    description VARCHAR(256), -- '监控策略描述',
    condition_relation INTEGER NOT NULL, -- '条件运算符：0 与, 1 或',
    create_time TIMESTAMP(0), -- '监控策略创建时间',
    op_group_id BIGINT DEFAULT 1,
    op_group_code VARCHAR(256) DEFAULT '00',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_monitor_rule (
  id BIGSERIAL,
  monitor_id BIGINT NOT NULL,
  field_no INTEGER NOT NULL, -- '条件字段序号',
  field_name VARCHAR(60) NOT NULL, -- '条件字段名称',
  comparison VARCHAR(10) NOT NULL, -- '条件运算符',
  threshold INT, -- '条件字段阈值',
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_vapp (
    id BIGSERIAL,
    tree_code VARCHAR(256) NOT NULL,
    folder_name VARCHAR(60)  NOT NULL,
    folder_level INTEGER CHECK(folder_level >= 0),
    priority_level BIGINT,
    interval_time BIGINT,
    parent_id BIGINT,
    operator_id BIGINT,
    op_group_id BIGINT DEFAULT 1,
    op_group_code VARCHAR(256) DEFAULT '00',
    start_interval_time BIGINT DEFAULT 10,
    close_interval_time BIGINT DEFAULT 10,
    start_action BIGINT DEFAULT 1,
    close_action BIGINT DEFAULT 1,
    priority BIGINT DEFAULT NULL,
    default_vapp_falg BIGINT DEFAULT 0,
    PRIMARY KEY (id)
);
CREATE INDEX IF NOT EXISTS vapp_index_1 ON tbl_vapp (operator_id);

CREATE TABLE IF NOT EXISTS tbl_vapp_domain (
    id BIGSERIAL,
    favorite_id BIGINT NOT NULL,
    domain_id BIGINT,
    priority_level BIGINT,
    interval_time BIGINT,
    start_interval_time BIGINT DEFAULT 10,
    close_interval_time BIGINT DEFAULT 10,
    start_action BIGINT DEFAULT 1,
    close_action BIGINT DEFAULT 1,
    priority BIGINT DEFAULT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_event_rule (
    id BIGSERIAL,
    rule_name VARCHAR(256) NOT NULL,
    critica INTEGER CHECK(critica >= 0),
    major INTEGER CHECK(major >= 0),
    minor INTEGER CHECK(minor >= 0),
    warning INTEGER CHECK(warning >= 0),
    persist_time INT, -- '持续时间',
    freq_time INTEGER NOT NULL DEFAULT 0, -- '告警上报频率',
    enable INTEGER NOT NULL DEFAULT 1, -- '是否启用告警规则',
    category INTEGER NOT NULL DEFAULT 6, -- '告警大类，默认６－其他类',
    order_id INTEGER NOT NULL DEFAULT 100, -- '用于告警界面排序',
    view_category INT, -- '1 虚拟机下显示的告警,2 主机下显示的告警,3 集群下显示的告警',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_event_forward (
    id BIGSERIAL,
    type INTEGER CHECK(type >= 0),
    flag INTEGER CHECK(flag >= 0),
    sendtype INTEGER CHECK(sendtype >= 0),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_event_to_email (
    id BIGSERIAL,
    forward_id BIGINT NOT NULL,
    email VARCHAR(100),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_event_forward_type (
    id BIGSERIAL,
    forward_id BIGINT NOT NULL,
    rule_id BIGINT NOT NULL,
    catalog_id BIGINT NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_domain_dev (
    id BIGSERIAL,
    domain_id BIGINT NOT NULL, -- '虚拟机ID',
    dev_type INTEGER DEFAULT 0, -- '类型0：USB，1：PCI',
    dev_id VARCHAR(64) NOT NULL, -- 'bus/slot/function',
    dev_name VARCHAR(128) NOT NULL, -- '设备名称',
    vendor_id VARCHAR(64), -- '供应商ID',
    vendor VARCHAR(128), -- '供应商',
    product_id VARCHAR(64), -- '产品ID',
    product VARCHAR(128), -- '产品名称',
    eth_name VARCHAR(64), -- 'PCI物理直通网卡对应的主机网卡名称',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_drx_extend_strategy (
    id BIGSERIAL,
    name VARCHAR(256) NOT NULL,
    description VARCHAR(256),
    state INT, -- '是否生效：生效：1，不生效：0',
    frequency INT, -- '频率:，0：每年:1：每月，2：每周，3：每日 ',
    month INT, -- '月份 ',
    day INT, -- '日期：几日，或星期几 ',
    hour INT, -- '时',
    minute INT, -- '分',
    next_extend_time TIMESTAMP(0),
    hour_end INT,
    minute_end INT,
    extend_num INT,
    drx_id BIGINT,
    first_extend_time TIMESTAMP(0) DEFAULT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_access_strategy (
    id BIGSERIAL,
    name VARCHAR(256) NOT NULL, -- '访问策略名称',
    description VARCHAR(256), -- '访问策略描述',
    default_access_action INT, -- '访问规则默认动作(0:拒绝;1:允许)',
    create_time TIMESTAMP(0), -- '访问策略创建时间',
    op_group_id BIGINT DEFAULT 1,
    op_group_code VARCHAR(256) DEFAULT '00',
    frequency INTEGER DEFAULT 0, -- '频率:，0：不启用:1：每周，2：每天 ',
    date_start INT,
    date_end INT,
    acctimer VARCHAR(256), -- '时间点',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_access_rule (
    id BIGSERIAL,
    access_strategy_id INTEGER NOT NULL,
    start_ip VARCHAR(64), -- '开始IP地址',
    end_ip VARCHAR(64), -- '结束IP地址',
    access_action INT, -- '访问规则动作(0:拒绝;1:允许)',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_backup_cvm_strategy (
    id BIGSERIAL,
    state INT, -- '是否生效：生效：1，不生效：0',
    store_mode INT, -- '备份目的类型，0：本地，1：远端服务器',
    store_location VARCHAR(256), -- '备份文件位置',
    target_addr VARCHAR(256), -- '目的服务器IP地址',
    login_name VARCHAR(50), -- '目的服务器用户名',
    password VARCHAR(100) , -- '密码',
    server_type INT, -- '服务器类型，0：选择FTP，1:选择SCP',
    port INT, -- '服务器类型端口',
    frequency INT, -- '频率:，0：每月:1：每周，2：每日 ',
    day INT, -- '哪天：几日，或星期几，每天 ',
    hour INT, -- '时',
    minutes INT, -- '分',
    next_backup TIMESTAMP(0), -- '下一次备份时间',
    next_cvk_backup TIMESTAMP(0), -- '下一次强制备份到cvk时间',
    keep_times INT, -- '备份文件保留数量',
    isrunning INT, -- '备份任务是否正在执行，1：正在执行，0未运行。',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_backup_history_info (
    id BIGSERIAL,
    file_name VARCHAR(128),
    create_time VARCHAR(128),
    version VARCHAR(128),
    backup_location VARCHAR(256), -- '备份文件位置',
    store_mode INT, -- '备份目的类型，0：本地，1：远端服务器',
    server_type INT, -- '服务器类型，0：选择FTP，1:选择SCP',
    port INT, -- '服务器类型端口',
    target_addr VARCHAR(256), -- '目的服务器IP地址',
    login_name VARCHAR(50), -- '目的服务器用户名',
    password VARCHAR(100) , -- '密码',
    md5 VARCHAR(128),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_vm_config (
    id BIGSERIAL,
    vm_id INTEGER CHECK(vm_id >= 0) NOT NULL unique,
    target_role INTEGER,
    is_managed INTEGER,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_vm_storage_config (
    id BIGSERIAL,
    vm_id INTEGER,
    storage_name VARCHAR(128),
    storage_path VARCHAR(512),
    st_manu_stop INTEGER DEFAULT 0,
    UNIQUE(VM_ID, STORAGE_NAME)
);

CREATE TABLE IF NOT EXISTS tbl_storage_position(
    id BIGSERIAL,
    file_name VARCHAR(512),
    pool_path VARCHAR(256),
    pool_name VARCHAR(256),
    host_id BIGINT,
    host_pool_id BIGINT,
    alias VARCHAR(256),
    type INTEGER DEFAULT NULL, -- '云硬盘类型。0 云硬盘 1备份 2快照',
    parent_path VARCHAR(256) DEFAULT NULL, -- '增量备份的父备份PATH',
    original_volume VARCHAR(256) DEFAULT NULL, -- '增量备份文件对应的源硬盘',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_user_vm(
    id BIGSERIAL,
    user_id VARCHAR(128),
    domain_id BIGINT,
    host_pool_id BIGINT,
    flag INTEGER,
    domain_name VARCHAR(256),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_host_partition_detail (
    id BIGSERIAL,
    host_id BIGINT NOT NULL,
    partition_name VARCHAR(128) NOT NULL,
    partition_type VARCHAR(16) NOT NULL,
    mounted_dir VARCHAR(128) NOT NULL,
    utilization NUMERIC DEFAULT NULL,
    size NUMERIC DEFAULT NULL,
    used NUMERIC DEFAULT NULL,
    host_pool_id BIGINT NOT NULL,
    cluster_id BIGINT NOT NULL,
    op_group_id BIGINT DEFAULT 1,
    op_group_code VARCHAR(256) DEFAULT '00',
    last_update_time VARCHAR(24),
    PRIMARY KEY (id)
);
CREATE INDEX IF NOT EXISTS tbl_host_partition_detail_index_1 ON tbl_host_partition_detail (host_id, partition_name);

CREATE TABLE IF NOT EXISTS tbl_domain_partition_detail (
    id BIGSERIAL,
    domain_id BIGINT NOT NULL,
    partition_name VARCHAR(128) NOT NULL,
    partition_type VARCHAR(16) NOT NULL,
    utilization NUMERIC DEFAULT NULL,
    size NUMERIC DEFAULT NULL,
    used NUMERIC DEFAULT NULL,
    host_id BIGINT NOT NULL,
    host_pool_id BIGINT NOT NULL,
    cluster_id BIGINT NOT NULL,
    op_group_id BIGINT DEFAULT 1,
    op_group_code VARCHAR(256) DEFAULT '00',
    last_update_time VARCHAR(24),
    PRIMARY KEY (id)
);
CREATE INDEX IF NOT EXISTS tbl_domain_partition_detail_index_1 ON tbl_domain_partition_detail (domain_id, partition_name);

CREATE TABLE IF NOT EXISTS tbl_cvk_scan_task (
    id BIGSERIAL,
    name VARCHAR(256) NOT NULL,
    description VARCHAR(256),
    cluster_id BIGINT, -- '集群ID',
    host_pool_id BIGINT,
    user_name VARCHAR(256),
    password VARCHAR(256), -- '主机账户密码',
    start_ip VARCHAR(64),
    end_ip VARCHAR(64),
    period INTEGER, -- '检查周期-分钟',
    persist_time INTEGER, -- '持续时间-小时',
    end_time BIGINT, -- '终止时间-毫秒-时间戳',
    state INTEGER, -- '任务状态 1运行 ,0停止',
    op_group_id BIGINT DEFAULT 1,
    op_group_code VARCHAR(256) DEFAULT '00',
    cluster_drs_group_id BIGINT, -- '延展主机组ID',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS  tbl_cvk_scan_task_host (
    id BIGSERIAL,
    cluster_id BIGINT,
    host_id BIGINT, -- '主机ID',
    task_id BIGINT, -- '任务ID',
    name VARCHAR(256),
    ipaddr VARCHAR(256),
    add_time TIMESTAMP(0),
    result SMALLINT,
    failure_reason VARCHAR(512),
    cluster_drs_group_id BIGINT, -- '延展主机组ID',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_port_mirroring (
    id BIGSERIAL,
    name VARCHAR(128) NOT NULL, -- '端口镜像名称',
    direction INT, -- '方向， 1：入方向 2：出方向 3：双向',
    vswitch_name VARCHAR(256), -- '虚拟交换机名称',
    port_mirroring_vlan_id INT, -- '端口镜像Vlan',
    dest_vswitch_name VARCHAR(256) DEFAULT NULL,
    dest_vswitch_id BIGINT DEFAULT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_port_mirroring_vm (
    id BIGSERIAL,
    port_mirroring_id BIGINT, -- '端口镜像表的ID',
    domain_id bigint NOT NULL,
    domain_type INTEGER NOT NULL, -- '镜像类型，0：源端口，1:目的端口',
    domain_mac VARCHAR(60), -- '源端口的虚拟机mac',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_templet_source (
    id BIGSERIAL,
    templet_id BIGINT NOT NULL,
    md5 VARCHAR(64),
    type INT,
    domain_id BIGINT, -- '源虚拟机ID',
    domain_name VARCHAR(128), -- '源虚拟机名称',
    domain_title VARCHAR(128) DEFAULT '',
    create_date TIMESTAMP(0),
    login_name VARCHAR(256),
    user_name VARCHAR(256),
    address VARCHAR(256),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_templet_modify_log (
    id BIGSERIAL,
    templet_id BIGINT NOT NULL,
    modify_date TIMESTAMP(0),
    login_name VARCHAR(256),
    user_name VARCHAR(256),
    address VARCHAR(256),
    details VARCHAR(512),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_domain_backup (
    id BIGSERIAL,
    name VARCHAR(256),
    backup_des_mode INT, -- '备份目的类型，0：共享文件系统，1：远端服务器',
    backup_mode INT, -- '备份类型 0表示全量备份，10表示增量备份的全量备份，11表示增量备份，20表示差异备份的全量备份，22表示差异备份',
    backup_location VARCHAR(256), -- '备份文件位置',
    target_addr VARCHAR(256), -- '目的服务器IP地址',
    login_name VARCHAR(50), -- '目的服务器用户名',
    password VARCHAR(256) , -- '密码',
    server_type INT, -- '服务器类型，0：选择FTP，1:选择SCP',
    domain_id BIGINT,
    backup_time TIMESTAMP(0),
    backup_size NUMERIC,
    parent_id BIGINT,
    is_leaf INT,
    host_id BIGINT,
    port INT,
    file_path VARCHAR(256), -- '备份存储路径',
    dev_name VARCHAR(256), -- '备份盘符名',
    backup_type INTEGER DEFAULT 0, -- '备份类型，0：整机备份，1：磁盘备份',
    disk_delete INTEGER DEFAULT 0,
    backup_method INTEGER DEFAULT 0,
    is_by_cas INTEGER DEFAULT 0,
    is_last_backup_failure INTEGER DEFAULT 0,
    default_backup_name VARCHAR(256),
    domain_uuid VARCHAR(60) NOT NULL DEFAULT '',
    domain_title VARCHAR(128) NOT NULL DEFAULT '',
    backup_pool_id BIGINT NULL, -- '备份池ID，升级场景为NULL',
    backup_strategy_id BIGINT DEFAULT NULL, -- '备份策略ID',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_domain_ip_config (
    id BIGSERIAL,
    mac VARCHAR(60) NOT NULL,
    domain_id BIGINT CHECK(domain_id >= 0) NOT NULL,
    vswitch_name VARCHAR(256) NOT NULL,
    type VARCHAR(10), -- 'IP类型，默认Ipv4',
    ip_addr VARCHAR(256),
    mask VARCHAR(32),
    enable INTEGER DEFAULT 0, -- 'IP配置数据是否有效，0无效 1有效',
    last_update_time INT,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_ha_app_monitor_task (
    id BIGSERIAL ,
    name VARCHAR(256) NOT NULL,
    cluster_id BIGINT NULL ,
    host_id BIGINT NULL ,
    domain_id INTEGER NULL ,
    strategy_id INTEGER NULL ,
    app_status INTEGER NULL DEFAULT 3, -- '0：正常，1：故障，2：连续故障,3:未知' ,
    status INTEGER NULL DEFAULT 0, -- '0：关闭，1：开启' ,
    op_group_id BIGINT NULL ,
    op_group_code VARCHAR(256) NULL ,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_ha_app_monitor_strategy (
    id BIGSERIAL ,
    name VARCHAR(256) NOT NULL,
    description VARCHAR(256) NULL,
    app_service_name VARCHAR(128) NULL, -- '应用监控程序名称' ,
    app_progress_name VARCHAR(256) NULL, -- '应用监控进程名称' ,
    install_path VARCHAR(256) NULL, -- '安装路径' ,
    start_cmd VARCHAR(128) NULL, -- '启动命令行' ,
    monitor_status_cmd VARCHAR(128) NULL, -- '服务状态监控命令行' ,
    fault_process_mode INTEGER NULL DEFAULT 0, -- '严重故障处理方式，0：不处理，1：重启' ,
    system INTEGER NULL, -- '规则适用操作系统，0:windows,1:linux' ,
    create_time TIMESTAMP(0) NULL,
    op_group_id BIGINT NULL ,
    op_group_code VARCHAR(256) NULL ,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_event_to_send (
    id BIGSERIAL,
    catalog_id INTEGER NOT NULL,
    state INTEGER NOT NULL,
    event_level INTEGER NOT NULL,
    event_type INTEGER NOT NULL,
    event_name VARCHAR(256),
    event_src VARCHAR(256),
    event_time TIMESTAMP(0) NOT NULL,
    event_desc VARCHAR(512) NOT NULL,
    target_id INTEGER NOT NULL DEFAULT 0, -- '主机告警表示主机的ID，虚拟机告警表示虚拟机ID，集群告警表示集群ID',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_res_pool(
    id BIGSERIAL, -- '物理ID',
    name VARCHAR(128) NOT NULL DEFAULT '', -- '资源池名称',
    description VARCHAR(254), -- '资源池描述',
    type INTEGER NOT NULL, -- '资源类型，1:GPU，2:HBA',
    cluster_id BIGINT,
    vgpu_type VARCHAR(128),
    op_group_id BIGINT DEFAULT 1,
    op_group_code VARCHAR(256) DEFAULT '00',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_res_pool_device(
    id BIGSERIAL, -- '物理ID',
    bus VARCHAR(128) DEFAULT '', -- '总线及槽号',
    producers VARCHAR(128) DEFAULT '', -- '设备产商',
    cluster_id BIGINT,
    host_id BIGINT,
    host_name VARCHAR(256), -- '主机名称',
    res_pool_id BIGINT,
    type VARCHAR(128),
    name VARCHAR(128),
    max_instance INT,
    framebuffer VARCHAR(32),
    max_resolution VARCHAR(32),
    heads INT,
    uuid VARCHAR(60),
    pnic VARCHAR(128) NULL DEFAULT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_res_pool_vm(
    id BIGSERIAL, -- '物理ID',
    domain_id BIGINT,
    business_temp_id BIGINT,
    res_pool_id BIGINT,
    device_driver VARCHAR(10) NOT NULL DEFAULT 'kvm',
    shared INTEGER DEFAULT 1,
    count INTEGER DEFAULT 1,
    sub_type VARCHAR (128),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_business_temp(
    id BIGSERIAL, -- '物理ID',
    name VARCHAR(128) NOT NULL DEFAULT '', -- '业务模板名称',
    description VARCHAR(254), -- '业务模板描述',
    priority INT, -- '优先级，0:高,2:低',
    proportion INT, -- '资源分配比例',
    command VARCHAR(128), -- '停止业务命令',
    command_result VARCHAR(128), -- '停止业务命令返回结果',
    handle_mode INT,
    start_mode INTEGER DEFAULT 3, -- '资源紧张启动模式 1:不启动 2：启动 3：抢占',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_res_use(
    id BIGSERIAL, -- '物理ID',
    bus VARCHAR(128) DEFAULT '', -- '总线及槽号',
    producers VARCHAR(128) DEFAULT '', -- '设备产商',
    host_id BIGINT,
    host_name VARCHAR(256), -- '主机名称',
    domain_id BIGINT,
    res_pool_id BIGINT,
    type VARCHAR(128),
    name VARCHAR(128),
    max_instance INT,
    framebuffer VARCHAR(32),
    max_resolution VARCHAR(32),
    heads INT,
    uuid VARCHAR(60),
    shared INTEGER DEFAULT 1,
    start_time TIMESTAMP(0), -- '开始时间',
    pnic VARCHAR(128) NULL DEFAULT NULL,
    mac VARCHAR(20) NULL DEFAULT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_res_use_history(
    id BIGSERIAL, -- '物理ID',
    bus VARCHAR(128) DEFAULT '', -- '总线及槽号',
    producers VARCHAR(128) DEFAULT '', -- '设备产商',
    host_id BIGINT,
    host_name VARCHAR(256), -- '主机名称',
    domain_id BIGINT,
    domain_title VARCHAR(128) NULL DEFAULT NULL,
    res_pool_id BIGINT,
    type VARCHAR(128),
    name VARCHAR(128),
    max_instance INT,
    framebuffer VARCHAR(32),
    max_resolution VARCHAR(32),
    heads INT,
    uuid VARCHAR(60),
    start_time TIMESTAMP(0), -- '开始时间',
    end_time TIMESTAMP(0), -- '结束时间',
    pnic VARCHAR(128) NULL DEFAULT NULL,
    mac VARCHAR(20) NULL DEFAULT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_domain_sriov_info (
    id BIGSERIAL, -- 'ID',
    domain_id BIGINT NOT NULL,
    res_pool_vm_id BIGINT NOT NULL,
    device_driver VARCHAR(20) NOT NULL DEFAULT 'vfio',
    mac VARCHAR(20) NOT NULL,
    vlan_id VARCHAR(20) NULL,
    pci VARCHAR(20) NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_srm_protect_group (
    id BIGSERIAL,
    name VARCHAR(256) NOT NULL,
    description VARCHAR(256),
    create_date TIMESTAMP(0),
    auto_add_vm BIGINT, -- '自动增加到保护组虚拟机',
    protect_addr VARCHAR(256), -- '保护站点地址',
    recovery_addr VARCHAR(256) NOT NULL, -- '恢复站点地址',
    protect_type INTEGER DEFAULT 0, -- '容灾类型。0-存储复制容灾(即原CAS的SRM功能)，1-磁盘备份容灾(数腾容灾产品)',
    business_type INT, -- '业务类型，当容灾类型为磁盘备份容灾时:0-普通分组，2-集群分组，3-双机分组，当容灾类型为存储复制容灾时：4-大云保护组，其他值为普通保护组',
    acesure_strategy_id BIGINT, -- '容灾策略在恢复站点TBL_SRM_ACE_STRATEGY表里的id，仅当容灾类型为磁盘备份容灾时有意义。',
    acesure_strategy_name VARCHAR(256), -- '容灾策略名称，仅当容灾类型为磁盘备份容灾时有意义。',
    acesure_group_id BIGINT, -- '数腾分组主键ID，用于建立CAS中保护组和数腾中分组的对应关系，仅当容灾类型为磁盘备份容灾时有意义。',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_srm_protect_group_vm (
    id BIGSERIAL,
    group_name VARCHAR(256) NOT NULL, -- '保护组名称',
    domain_name VARCHAR(256) NOT NULL,
    domain_title VARCHAR(256) NOT NULL,
    priority BIGINT NOT NULL,
    ace_device_id INT, -- 'acesure源设备ID',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_srm_site_mapping_config (
    id BIGSERIAL,
    mainsite_resource_name VARCHAR(256), -- '主站点资源名称',
    sparesite_resource_name VARCHAR(256) NOT NULL, -- '备站点资源名称',
    sparesite_binding_resource_name VARCHAR(256), -- ' 与备站点资源需要绑定在一起的资源名称。该字段仅在容灾类型为备份容灾并且当前的备战点资源是虚拟交换机时有效，此时需要绑定一个网络策略模板。当虚拟交换机的转发模式为VXLAN(SDN)时所绑定的网络策略模板可以是空。',
    mainsite_lun_name VARCHAR(256), -- '主站点LUN名称',
    sparesite_lun_name VARCHAR(256), -- '备站点LUN名称',
    resource_type INTEGER CHECK(resource_type >= 0) NOT NULL, -- '资源类型 1：共享文件系统 2：主机池 3:虚拟交换机 4：网络策略模板 5:块设备 6:存储池名 7:带有绑定网络策略模板的虚拟交换机',
    protect_group_name VARCHAR(256)  NOT NULL, -- '保护组名称',
    storage_type INTEGER CHECK(storage_type >= 0), -- '存储操作类型  0：sra存储操作 1：手动操作',
    share_storage_type INTEGER CHECK(share_storage_type >= 0), -- '共享存储类型  1:iscsi类型  2：fc类型',
    target_name VARCHAR(256), -- 'target名称',
    client_name VARCHAR(256), -- '客户端名称',
    pool_type VARCHAR(256), -- '当资源类型为6，即存储路径时，用于标志存储池的类型，取值有dir/fs/netfs/cifs',
    cluster_name VARCHAR(256), -- '进行恢复虚拟机所在集群名，仅当容灾类型为磁盘备份容灾时有意义',
    cluster_id BIGINT, -- '进行恢复虚拟机所在集群id，仅当容灾类型为磁盘备份容灾时有意义',
    cvk_name VARCHAR(256), -- '进行恢复虚拟机所在CVK主机名称，仅当容灾类型为磁盘备份容灾且业务类型为普通时有意义',
    cvk_id BIGINT, -- '进行恢复虚拟机所在CVK主机id，仅当容灾类型为磁盘备份容灾且业务类型为普通时有意义',
    storage_producer INTEGER CHECK(STORAGE_PRODUCER >= 0) , -- '存储厂商 0-macro, 1-3par, 2-onestor.考虑到升级问题，如果为null，则当clientName有值代表是macro，没有则代表并不是sra',
    source_group_id VARCHAR(256), -- 'sra存储保护的设备以组的方式存在时在保护存储服务器上的组id或key',
    target_group_id VARCHAR(256), -- 'sra存储保护的设备以组的方式存在时在恢复端存储服务器上的组id或key',
    source_device_id VARCHAR(256), -- '保护端存储池或块设备在存储服务器上的设备id',
    target_device_id VARCHAR(256), -- '恢复端存储池或块设备在存储服务器上的设备id',
    source_storage_ip VARCHAR(256), -- '保护端的storage server ip',
    target_storage_ip VARCHAR(256), -- '恢复端的storage server ip',
    source_array_id VARCHAR(256), -- '保护端的array id',
    target_array_id VARCHAR(256), -- '恢复端的array id',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_srm_convert_vm_mapping (
    id BIGSERIAL,
    domain_id INTEGER NOT NULL,
    src_domain_name VARCHAR(128) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_srm_recovery (
    id BIGSERIAL,
    name VARCHAR(256) NOT NULL, -- 'SRM恢复计划名称',
    description VARCHAR(256), -- 'SRM恢复计划描述' ,
    group_name VARCHAR(256) NOT NULL, -- 'SRM恢复计划保护组名称',
    cluster_id BIGINT, -- 'SRM恢复计划集群ID',
    priority INT, -- '优先级',
    flag INT, -- '当前计划正在进行的操作',
    status INT, -- '0:成功 1:失败',
    source_cvk_name VARCHAR(256),
    target_cvk_name VARCHAR(256),
    recovery_type INT, -- '4 计划恢复 5 灾难恢复',
    execute_type INT, -- '0 执行计划 1 直接恢复虚拟机 2 孤岛演练，仅用于演练(录入数据库用于判定结束演练时是否需要保证网络互通）',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_srm_recovery_step (
    id BIGSERIAL,
    step VARCHAR(256) NOT NULL, -- 'SRM恢复步骤',
    status INT, -- '0:成功 1:失败',
    failure_reason VARCHAR(1024),
    plan_history_id BIGINT,
    node_type VARCHAR(256),
    level INTEGER NOT NULL, -- '树层级高度 ',
    step_index INT, -- '步骤编号',
    parent_id BIGINT,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_srm_recovery_domain (
    id BIGSERIAL,
    plan_id BIGINT, -- '恢复计划ID',
    domain_id BIGINT, -- '虚拟机ID',
    flag INTEGER, -- '1:业务恢复的虚拟机,2：演练计划恢复的虚拟机',
    recovery_type INTEGER DEFAULT 0,
    device_id INTEGER,
    snap_set_id INTEGER,
    disk_clone_id INTEGER,
    back_mode INTEGER,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_srm_site_config (
    id BIGSERIAL,
    site_name VARCHAR(256) NOT NULL,
    ipaddr VARCHAR(256) NOT NULL,
    user_name VARCHAR(64),
    password VARCHAR(128),
    uuid VARCHAR(60) NOT NULL DEFAULT '',
    site_type INTEGER,
    protocol VARCHAR(10) DEFAULT 'http', -- '访问容灾站点的协议',
    port SMALLINT DEFAULT 8080, -- '访问容灾站点的Web端口',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_srm_site_storage_connection (
    id BIGSERIAL,
    storage_name VARCHAR(256) NOT NULL,
    ipaddr VARCHAR(256) NOT NULL,
    user_name VARCHAR(64),
    password VARCHAR(128),
    uuid VARCHAR(60) NOT NULL, -- '连接所对应CVM站点的UUID',
    level INTEGER,
    parent_id BIGINT,
    storage_producer INTEGER DEFAULT 0, -- '存储厂商的类型，0-宏衫，1-3par，2-onestor.默认为0避免升级问题',
    rec_ipaddr VARCHAR(256) DEFAULT NULL, -- '恢复端存储服务ip，仅适用于3par',
    rec_user_name VARCHAR(256) DEFAULT NULL, -- '恢复端存储服务用户名，仅适用于3par',
    rec_password VARCHAR(256) DEFAULT NULL, -- '恢复端存储服务用户名密码，仅适用于3par',
    multi_path_ips VARCHAR(256), -- '当存储厂商为onestor时，保存以分号隔离的存储ip地址，表示多路径连接的存储ip',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_srm_domain_storage (
    id BIGSERIAL,
    domain_name VARCHAR(128) NOT NULL DEFAULT '',
    domain_uuid VARCHAR(60) NOT NULL DEFAULT '',
    group_name VARCHAR(256) NOT NULL DEFAULT '',
    domain_storage VARCHAR(256),
    PRIMARY KEY (id)
);

-- 网元设备表
CREATE TABLE IF NOT EXISTS tbl_network_device (
    id BIGSERIAL ,
    name VARCHAR(128) ,
    description VARCHAR(254),
    netconf_user VARCHAR(45) NOT NULL,
    netconf_pw VARCHAR(45) NOT NULL,
    manage_ipaddr VARCHAR(256),
    vtep_ipaddr VARCHAR(256),
    type INTEGER NOT NULL DEFAULT 1, -- '1:VXLAN IP网关  2:VTEP网关' ,
    device_type VARCHAR(64) NOT NULL, -- '设备型号',
    vxlan_mapping_id INT, -- 'VXLAN映射表ID' ,
    op_group_id BIGINT DEFAULT 1,
    op_group_code VARCHAR(256) DEFAULT '00',
    PRIMARY KEY (id)
);

-- VxLAN映射表
CREATE TABLE IF NOT EXISTS tbl_vxlan_mapping (
    id BIGSERIAL ,
    name VARCHAR(128) NOT NULL ,
    description VARCHAR(254) NULL ,
    op_group_id BIGINT DEFAULT 1,
    op_group_code VARCHAR(256) DEFAULT '00',
    PRIMARY KEY (id)
);

-- VXLAN区间表
CREATE TABLE IF NOT EXISTS tbl_vxlan_region (
    id BIGSERIAL ,
    vxlan_start_index INTEGER NOT NULL DEFAULT 0, -- 'VXLAN区间起始索引' ,
    vlan_start_index INTEGER NOT NULL DEFAULT 0, -- 'VLAN区间起始索引' ,
    size INTEGER NOT NULL DEFAULT 1, -- '数量' ,
    vxlan_mapping_id INTEGER NOT NULL DEFAULT 0, -- 'VxLAN映射表ID',
    PRIMARY KEY (id)
);

-- VXLAN域
CREATE TABLE IF NOT EXISTS tbl_vxlan_scope (
    id BIGSERIAL ,
    name VARCHAR(128) NOT NULL ,
    description VARCHAR(256) NULL ,
    inner_bridge_name VARCHAR(15) NOT NULL ,
    op_group_id bigint DEFAULT 1,
    op_group_code VARCHAR(256) DEFAULT '00',
    PRIMARY KEY (id)
);

-- VXLAN设备表
CREATE TABLE IF NOT EXISTS tbl_vxlan_device (
    id BIGSERIAL,
    type INTEGER NOT NULL DEFAULT 0, -- '类型，1：OVS ,2：comware ' ,
    device_id INTEGER NOT NULL ,
    vxlan_scope_id INTEGER NOT NULL ,
    device_ip VARCHAR (15) NULL ,
    status INTEGER NULL DEFAULT 0,
    PRIMARY KEY (id)
);

-- ip网关配置
CREATE TABLE IF NOT EXISTS tbl_vxlan_gateway (
    id BIGSERIAL ,
    vxlan_id INTEGER NOT NULL ,
    ip_addr VARCHAR(32) NOT NULL ,
    mask VARCHAR(32) NOT NULL ,
    network_device_id INTEGER NOT NULL ,
    PRIMARY KEY (id)
);

-- 映射表物理口表
CREATE TABLE IF NOT EXISTS tbl_vxlan_vtep_eth (
    id BIGSERIAL ,
    if_index INTEGER NOT NULL DEFAULT 0, -- '物理口的IFINDEX' ,
    name VARCHAR(64) NULL ,
    type INTEGER NOT NULL DEFAULT 1 ,
    vlan_id INT,
    network_device_id INTEGER NOT NULL ,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_srm_plan_history (
    id BIGSERIAL,
    status INT, -- '0:成功 1:失败 2:运行中',
    operate_type INTEGER , -- '操作类型。4：计划恢复 5：灾难恢复 6:反向恢复 2:开始演练 3:结束演练 7:清理备份数据',
    plan_name VARCHAR(256) NOT NULL, -- '恢复计划名称',
    start_time TIMESTAMP(0),
    uuid VARCHAR(60) NOT NULL DEFAULT '',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_srm_sradevice_relation (
    id BIGSERIAL,
    source_storage_ip VARCHAR(256),
    target_storage_ip VARCHAR(256),
    source_device_name VARCHAR(256),
    target_device_name VARCHAR(256),
    source_device_id VARCHAR(256),
    target_device_id VARCHAR(256),
    source_device_naa VARCHAR(256),
    target_device_naa VARCHAR(256),
    copy_direction INT, -- '1 正向， 2 反向',
    client_name VARCHAR(256),
    source_group_id VARCHAR(256), -- '3par里恢复端的consistency group,源设备位于该组内',
    target_group_id VARCHAR(256), -- '3par里恢复端的目标组，目标设备位于目标组内',
    source_array_id VARCHAR(256), -- '保护端的array id',
    target_array_id VARCHAR(256), -- '恢复端的array id',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_event_forward_item (
    id BIGSERIAL,
    forward_id BIGINT NOT NULL,
    host_id BIGINT,
    domain_id BIGINT,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_defined_pageinfo (
    id BIGSERIAL,
    col INTEGER NOT NULL,
    row INTEGER NOT NULL,
    size_x INTEGER NOT NULL,
    size_y INTEGER NOT NULL,
    data_id VARCHAR(256) NOT NULL,
    data_title VARCHAR(256),
    data_item VARCHAR(256),
    data_relative TEXT,
    data_disk VARCHAR(256),
    operator_id BIGINT,
    node_id BIGINT,
    data_graph INTEGER DEFAULT 0,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_templet_storage(
    id BIGSERIAL,
    target_path VARCHAR(512),
    type INTEGER,
    naa VARCHAR(128),
    lun VARCHAR(256),
    ip VARCHAR(1024),
    ip2 VARCHAR(1024),
    source_path VARCHAR(512),
    login VARCHAR(128),
    passwd VARCHAR(128),
    paused INTEGER NOT NULL DEFAULT 0,
    use_type INTEGER DEFAULT 0,
    PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS tbl_lb_device (
    id BIGSERIAL,
    name VARCHAR(128) NOT NULL,
    description VARCHAR(256) NULL,
    manage_ipaddr VARCHAR(45) NOT NULL,
    netconf_user VARCHAR(128) NOT NULL,
    netconf_pw VARCHAR(128) NOT NULL,
    op_group_id BIGINT NULL,
    op_group_code VARCHAR(45) NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_drx_lb (
    id BIGSERIAL,
    drx_id BIGINT NOT NULL,
    lb_device_id BIGINT NOT NULL,
    lb_virtual_server_name VARCHAR(128) NOT NULL,
    lb_virtual_server_type INTEGER NOT NULL,
    lb_server_farm_name VARCHAR(128) NOT NULL,
    bind_ip_type INTEGER CHECK(bind_ip_type >= 0), -- 'LB绑定IP类型',
    lb_real_server_port INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_defined_monitor (
    id BIGSERIAL,
    node_name VARCHAR(256) NOT NULL,
    parent_id INTEGER NOT NULL,
    operator_id BIGINT NOT NULL,
    back_color INTEGER DEFAULT 0,
    display_name VARCHAR(256) DEFAULT NULL, -- '显示名称',
    defined_icon VARCHAR(1024) DEFAULT NULL, -- '自定义的图标',
    background VARCHAR(1024) DEFAULT NULL, -- '自定义背景',
    resolution_height INTEGER DEFAULT NULL, -- '分辨率高度',
    resolution_width INTEGER DEFAULT NULL, -- '分辨率宽度',
    replace_default BOOLEAN DEFAULT NULL, -- '是否替换缺省大屏，1：是；0：否',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_cvm_vswitch (
    id BIGSERIAL,
    name VARCHAR(256) NOT NULL,
    cvm_ip VARCHAR(256) NULL,
    pnic VARCHAR(256) NULL,
    ip VARCHAR(256) NULL,
    netmask VARCHAR(256) NULL,
    gateway VARCHAR(256) NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_host_cpu_mem_trend (
    id BIGSERIAL,
    time BIGINT NOT NULL ,
    cpu_rate NUMERIC,
    memory_rate NUMERIC,
    flow_stat NUMERIC,
    host_id BIGINT,
    host_pool_id BIGINT,
    cluster_id INT,
    op_group_id BIGINT DEFAULT 1,
    op_group_code VARCHAR(256) DEFAULT '00',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_storage_trend (
    id BIGSERIAL,
    storage_id BIGINT NOT NULL ,
    storage_name VARCHAR(256) NOT NULL,
    time VARCHAR(24) NOT NULL,
    allocation NUMERIC,
    total NUMERIC,
    use_rate NUMERIC,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_host_antivirus (
    id BIGSERIAL,
    host_id BIGINT,
    co_type INTEGER, -- '防病毒软件厂商',
    version VARCHAR(128), -- '防病毒软件版本',
    last_setup_time VARCHAR(24), -- '最近安装防病毒软件的时间',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_storage_pool_allocation(
    id BIGSERIAL,
    host_id BIGINT NOT NULL DEFAULT 0, -- '共享存储主机ID为0',
    pool_name VARCHAR(256) NOT NULL,
    mount_path VARCHAR(256) DEFAULT NULL,
    type VARCHAR(20) DEFAULT NULL,
    preallocation BIGINT NOT NULL DEFAULT 0, -- '分配虚拟存储总大小,单位KB',
    capacity BIGINT CHECK(capacity >= 0) NOT NULL DEFAULT 0, -- '存储池大小,单位KB ',
    available BIGINT CHECK(available >= 0) NOT NULL DEFAULT 0, -- '存储池可用大小,单位KB ',
    last_update_time INTEGER CHECK(last_update_time >= 0) NOT NULL DEFAULT 0, -- '系统最后更新存储池时间 ',
    last_cvk_update_time INTEGER CHECK(last_cvk_update_time >= 0) NOT NULL DEFAULT 0, -- 'cvk自主更新存储池时间 ',
    PRIMARY KEY (id)
);
CREATE TABLE IF NOT EXISTS tbl_volume_mode (
    id BIGSERIAL, -- 'id',
    host_id BIGINT, -- 'HOST id',
    file VARCHAR(512) NOT NULL, -- '文件名',
    mode INT, -- '服务器类型：0 falloc延迟置零；1:full置零；other：精简',
    sec_uuid VARCHAR(64), -- '私有secret',
    vol_uuid VARCHAR(64), -- 'RAW存储卷加密的UUID',
    encrypt_pw VARCHAR(128), -- '加密磁盘密码',
    encrypt_key_id VARCHAR(1024) DEFAULT NULL,
    KMS_CLUSTER_ID BIGINT,
    KEY_NAME varchar(256),
    ENCRYPTION_TYPE INT,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_storage_volume_snapshot (
    id BIGSERIAL,
    domain_id BIGINT DEFAULT NULL,
    volume_id BIGINT DEFAULT NULL,
    snap_time TIMESTAMP(0) NOT NULL,
    snap_name VARCHAR(128) DEFAULT NULL,
    file_name VARCHAR(512) DEFAULT NULL,
    PRIMARY KEY (id)
);
CREATE TABLE IF NOT EXISTS tbl_host_pci_map(
    id BIGSERIAL,
    host_id BIGINT,
    host_name VARCHAR(256),
    eth_name VARCHAR(64), -- '物理网卡名称',
    src_address VARCHAR(64), -- 'PCI源地址段',
    mapped_address VARCHAR(64), -- 'PCI映射后地址段',
    index_value INTEGER, -- '主机内地址段映射序列',
    pf_mac_addr VARCHAR(64), -- 'PF物理地址',
    in_use INTEGER, -- '是否启用sriov，0未启用，1启用',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_safe_area (
    id BIGSERIAL,
    host_id BIGINT,
    cluster_id BIGINT,
    PRIMARY KEY (id)
);
CREATE TABLE IF NOT EXISTS tbl_certi_crl (
    id BIGSERIAL,
    serial_number VARCHAR(128) NOT NULL, -- '证书序列号',
    revocation_time TIMESTAMP(0) NOT NULL, -- '吊销日期',
    insert_time TIMESTAMP(0) NOT NULL, -- '插入日期',
    PRIMARY KEY (id)
);
CREATE TABLE IF NOT EXISTS tbl_event_statistics (
    id BIGSERIAL ,
    date DATE NOT NULL ,
    total BIGINT NOT NULL DEFAULT 0, -- '总数' ,
    critica_alarm_count BIGINT NOT NULL DEFAULT 0, -- '严重告警个数' ,
    major_alarm_count BIGINT NOT NULL DEFAULT 0, -- '重要告警个数' ,
    minor_alarm_count BIGINT NOT NULL DEFAULT 0, -- '次要告警个数' ,
    tip_alarm_count BIGINT NOT NULL DEFAULT 0, -- '提示告警个数' ,
    host_alarm_count BIGINT NOT NULL DEFAULT 0, -- '主机告警个数' ,
    vm_alarm_count BIGINT NOT NULL DEFAULT 0, -- '虚拟机告警个数' ,
    cluster_alarm_count BIGINT NOT NULL DEFAULT 0, -- '集群告警个数' ,
    fault_alarm_count BIGINT NOT NULL DEFAULT 0, -- '故障告警个数' ,
    other_alarm_count BIGINT NOT NULL DEFAULT 0, -- '其他异常告警个数' ,
    security_alarm_count BIGINT NOT NULL DEFAULT 0, -- '安全告警个数' ,
    PRIMARY KEY (id)
);
CREATE TABLE IF NOT EXISTS tbl_domain_netusb (
    id BIGSERIAL,
    domain_id BIGINT NOT NULL, -- '虚拟机ID',
    host_ip VARCHAR(64) NOT NULL, -- '主机的IP地址',
    usbredir_port INTEGER NOT NULL, -- '主机USB重定向端口',
    bus VARCHAR(128) NOT NULL, -- '总线',
    port INTEGER NOT NULL, -- '总线上的端口',
    dev INT, -- '总线上的设备号',
    path VARCHAR(64), -- '路径',
    vendor_id VARCHAR(64), -- '供应商ID',
    imanufacturer VARCHAR(128), -- '供应商',
    product_id VARCHAR(64), -- '产品ID',
    iproduct VARCHAR(128), -- '产品名称',
    controller VARCHAR(64), -- '控制器',
    PRIMARY KEY (id)
);
CREATE TABLE IF NOT EXISTS tbl_domain_detail (
    id BIGSERIAL,
    vm_id BIGINT , -- '虚拟机的唯一标示符',
    host_id BIGINT, -- '主机的唯一标示符',
    cluster_id BIGINT, -- '集群资源的唯一标示符',
    name VARCHAR(128) DEFAULT '',
    title VARCHAR(128) DEFAULT '',
    memory INTEGER CHECK(memory >= 0)  DEFAULT 0, -- '内存，兆',
    cpu INTEGER CHECK(cpu >= 0)  DEFAULT 0, -- 'CPU个数',
    storage_capacity INTEGER DEFAULT 0,
    start_time TIMESTAMP(0),
    end_time TIMESTAMP(0),
    uptime BIGINT DEFAULT -1, -- '虚拟机运行时间',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_system_upgrade (
    id BIGSERIAL,
    oper_time VARCHAR(256) NOT NULL,
    time_interval BIGINT NOT NULL DEFAULT 0,
    src_version VARCHAR(256),
    dest_version VARCHAR(256) NOT NULL,
    login_name VARCHAR(256), -- '操作员登录名',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_safe_workflow (
    id BIGSERIAL, -- '物理ID',
    name VARCHAR(256) NOT NULL DEFAULT '', -- '电子流名称',
    description VARCHAR(256), -- '电子流描述',
    status INTEGER CHECK(status >= 0) NOT NULL DEFAULT 0, -- '状态（0待审批，1通过，2拒绝）',
    type INTEGER CHECK(type >= 0) NOT NULL DEFAULT 0, -- '电子流类型（1：修改密级级别，2：增加磁盘，3：删除磁盘，4：安全区域内主机异常删除）',
    data_id BIGINT NOT NULL, -- '电子流数据ID',
    op_id BIGINT NOT NULL, -- '申请操作员ID',
    op_name VARCHAR(256) NOT NULL DEFAULT '', -- '申请操作员名称',
    approval_id BIGINT, -- '实施操作员ID',
    approval_name VARCHAR(256), -- '实施操作员名称',
    create_date TIMESTAMP(0), -- '创建时间',
    handle_date TIMESTAMP(0) NULL, -- '处理时间',
    handle_reason VARCHAR(512), -- '处理意见',
    handle_result VARCHAR(512) DEFAULT NULL, -- '实施结果',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_secret_workflow (
    id BIGSERIAL, -- '物理ID',
    domain_id BIGINT NOT NULL, -- '虚拟机ID',
    title VARCHAR(128) NOT NULL DEFAULT '', -- '虚拟机名称',
    secret_level INTEGER NOT NULL, -- '修改为的秘密级别',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_disk_workflow (
    id BIGSERIAL, -- '物理ID',
    domain_id BIGINT NOT NULL, -- '虚拟机ID',
    title VARCHAR(128) NOT NULL DEFAULT '', -- '虚拟机名称',
    type INTEGER NOT NULL, -- '操作类型：0：增加，1：删除',
    device VARCHAR(64), -- '磁盘名（例如：hda）',
    device_type VARCHAR(64), -- '磁盘类型：file，block',
    driver_type VARCHAR(64), -- '磁盘类型类型：raw，qcow2',
    dev_type VARCHAR(64), -- '磁盘类型：IDE 硬盘、SCSI 硬盘、USB硬盘、Virtio硬盘、Virtio SCSI硬盘、IDE光驱、软驱 ',
    store_file VARCHAR(254),
    disc_cache VARCHAR(64), -- '磁盘缓存方式 ，取值为：directsync、writethrough、writeback、none',
    read_bytes_sec BIGINT, -- '限制I/O速率(R) ',
    write_bytes_sec BIGINT, -- '限制I/O速率(W) ',
    read_iops_sec BIGINT, -- '限制IOPS速率(R) ',
    write_iops_sec BIGINT, -- '限制IOPS速率(W) ',
    controller VARCHAR(64), -- '前台指定的Controller',
    hot_pluggable INTEGER NOT NULL, -- '是否热添加 0：非，1：是',
    encrypt_pw VARCHAR(64),
    size BIGINT,
    format VARCHAR(64),
    assign_type INT,
    disk_mode VARCHAR(64), -- '磁盘模式，subordinate：从属，independent-persistent：独立-持久 ',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_host_workflow (
    id BIGSERIAL, -- '物理ID',
    host_id BIGINT NOT NULL, -- '主机ID',
    host_name VARCHAR(256) NOT NULL DEFAULT '', -- '主机名称',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_event_shield_config_item (
    id BIGSERIAL,
    rule_id BIGINT NOT NULL, -- '告警规则ID',
    target_key VARCHAR(64) NULL, -- '告警屏蔽对象唯一标示',
    target_type INTEGER NULL, -- '告警屏蔽对象的类型',
    target_title VARCHAR(128) NULL, -- '告警屏蔽对象显示名称',
    parent_id BIGINT NOT NULL DEFAULT 0, -- '父节点ID',
    has_children INTEGER NOT NULL DEFAULT 0, -- '是否含有子节点',
    description VARCHAR(128) NULL DEFAULT '', -- '屏蔽原因',
    add_time TIMESTAMP(0), -- '增加告警屏蔽时间',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_host_driver_port (
    id BIGSERIAL,
    name VARCHAR(256) DEFAULT NULL, -- '驱动或者端口名称',
    start_port INTEGER DEFAULT NULL, -- '起始端口号',
    end_port INTEGER DEFAULT NULL, -- '结束端口号',
    type SMALLINT NULL, -- '1：主机驱动，2：主机端口号',
    enable SMALLINT NULL, -- '0：禁用，1：启用',
    PRIMARY KEY (id)
);
CREATE TABLE IF NOT EXISTS tbl_drs_group (
    id BIGSERIAL,
    cluster_id BIGINT NOT NULL,
    name VARCHAR(256) NOT NULL, -- '组名称',
    flag INT, -- '标识(1:虚拟机组;2:主机组)',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_drs_group_detail (
    id BIGSERIAL,
    drs_group_id BIGINT NOT NULL,
    cluster_id BIGINT NOT NULL,
    entity_id BIGINT,
    entity_name VARCHAR(128), -- '虚拟机名称\主机名称',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_security_group (
    id BIGSERIAL,
    name VARCHAR(256) NOT NULL, -- '安全组名称',
    title VARCHAR(256) NOT NULL, -- '安全组显示名称',
    description VARCHAR(256), -- '安全组描述',
    rule_action INT, -- '安全组规则动作，0表示拒绝；1表示允许；默认为1',
    op_group_id BIGINT DEFAULT 1,
    op_group_code VARCHAR(256) DEFAULT '00',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_security_rule (
    id BIGSERIAL,
    security_group_id INTEGER NOT NULL,
    protocol INT, -- 'ACL规则协议号码, ICMP为1,TCP为6,UDP为17，所有协议为-1',
    ip_type VARCHAR(64), -- 'ip类型：ipv4 or ipv6',
    remote_ip VARCHAR(256), -- '远端IP地址',
    remote_mask VARCHAR(64), -- '远端子网掩码/网络前缀',
    priority INT, -- '优先级',
    direction INT, -- '方向，0表示入口；1，表示出口；。默认为0',
    port_start INT, -- '起始端口 或 icmp的type',
    port_end INT, -- '结束端口 或 icmp的code',
    description VARCHAR(256), -- '规则描述',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_net_limit_profile (
    id BIGSERIAL,
    name VARCHAR(256) NOT NULL, -- '限速策略名称',
    title VARCHAR(256) NOT NULL, -- '限速策略显示名称',
    description VARCHAR(256), -- '限速策略描述',
    op_group_id BIGINT NOT NULL DEFAULT 1,
    op_group_code VARCHAR(256) NOT NULL DEFAULT '00',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_net_limit_rule (
    id BIGSERIAL,
    net_limit_profile_id BIGINT NOT NULL,
    rate_limiting INT, -- '限速，单位：Kbps',
    burst_limiting BIGINT, -- '突发缓冲，单位：Kbytes',
    priority INT, -- '优先级',
    type INT, -- 'QOS限速类型，0表示interface；1表示bridge；默认为0。',
    direction INT, -- '方向，0：表示入虚拟机；1：表示出虚拟机。默认为0',
    dl_type INTEGER DEFAULT 0, -- '限速类型，0：IP；1：arp；2：广播',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_net_limit_ip (
    id BIGSERIAL,
    net_limit_rule_id BIGINT NOT NULL,
    ip_type VARCHAR(64), -- 'ip类型：ipv4 or ipv6',
    protocol INT, -- '目的规则协议号码, ICMP为1,TCP为6,UDP为17，所有协议为-1',
    dest_start_ip VARCHAR(256), -- '目的起始IP地址',
    dest_end_ip VARCHAR(256), -- '目的截止IP地址',
    dest_port INT, -- '目的端口',
    vm_port INT, -- '虚拟机端端口',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_gpu_device(
    id BIGSERIAL, -- '主键id',
    host_id BIGINT NOT NULL,
    cluster_id BIGINT,
    bus VARCHAR(128) DEFAULT '', -- '总线及槽号',
    producers VARCHAR(128) DEFAULT '', -- '设备产商',
    model VARCHAR(64) DEFAULT '', -- 'P4/M60',
    status INTEGER DEFAULT 0, -- '状态：0空闲 1直通 2切片',
    support_vgpu INTEGER DEFAULT 0, -- '是否支持VGPU：1支持 0不支持',
    mig_current VARCHAR(64), -- 'VGPU-MIG开启状态：enabled 开启  disabled 未开启  NULL 不支持',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_gpu_device_type_info (
    id BIGSERIAL, -- '主键ID',
    device_id BIGINT DEFAULT 0, -- 'GPU设备ID' ,
    name VARCHAR(128) DEFAULT '', -- '类型名',
    type VARCHAR(128) DEFAULT '', -- '类型Key值',
    available_instances INTEGER DEFAULT 0, -- '还可以虚拟化出多少个虚拟GPU',
    num_heads INTEGER DEFAULT 0, -- '显示器接口数',
    frame_buffer VARCHAR(32) DEFAULT '', -- '帧缓冲区',
    max_resolution VARCHAR(64) DEFAULT '', -- '最大分辨率',
    max_instance INTEGER DEFAULT 0, -- '最多虚拟出多少个虚拟GPU',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_vgpu_info (
    id BIGSERIAL, -- '主键id',
    device_id BIGINT DEFAULT 0, -- 'GPU设备ID',
    type_id BIGINT NOT NULL, -- 'TYPE INFO ID',
    uuid VARCHAR(256) NOT NULL DEFAULT '', -- 'vgpu UUID',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_vswitch_subnet (
    id BIGSERIAL ,
    name VARCHAR(50) NOT NULL ,
    description VARCHAR(256) NULL ,
    vswitch_id BIGINT NOT NULL ,
    network_type SMALLINT NOT NULL DEFAULT 2,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_rbd_pool_info (
    id BIGSERIAL,
    name VARCHAR(64) NOT NULL,
    title VARCHAR(64) DEFAULT '',
    description VARCHAR(256),
    ceph_port INTEGER,
    ceph_type INTEGER DEFAULT 1,
    ceph_uuid VARCHAR(64),
    metadata_pool_name VARCHAR(64),
    data_pool_name VARCHAR(64),
    auth_user VARCHAR(128),
    auth_key VARCHAR(128),
    secret_key VARCHAR(64),
    hostpool_id BIGINT,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_ceph_info (
    id BIGSERIAL,
    name VARCHAR(64) NOT NULL,
    description VARCHAR(254),
    port INTEGER,
    type INTEGER,
    uuid VARCHAR(64),
    ipaddr VARCHAR(64),
    user_name VARCHAR(64),
    password VARCHAR(128),
    auth_user VARCHAR(128),
    auth_key VARCHAR(128),
    public_cloud_id BIGINT,
    PRIMARY KEY (id)
);
CREATE TABLE IF NOT EXISTS tbl_host_rbd_client (
    id BIGSERIAL,
    host_id BIGINT,
    ceph_type INTEGER, -- 'RBD Client厂商',
    version VARCHAR(128), -- 'RBD client版本',
    last_setup_time VARCHAR(24), -- '最近安装RBD client的时间',
    hostpool_id BIGINT, -- '主机池ID',
    pack_save_dir VARCHAR(128), -- 'RBD client补丁包保存目录',
    file_name VARCHAR(64), -- 'RBD client补丁包名称',
    PRIMARY KEY (id)
);

-- 巡检结果主表
CREATE TABLE IF NOT EXISTS tbl_onebtn_check_result(
    id BIGSERIAL,
    time TIMESTAMP(0) NOT NULL, -- '巡检时间',
    grade INTEGER NOT NULL DEFAULT 0, -- '分数',
    is_complete BOOLEAN DEFAULT FALSE -- '检查是否完成，false为未完成，true为完成'
);

-- 巡检汇总页面的数据，一条记录对应汇总树状表里的一行数据
CREATE TABLE IF NOT EXISTS tbl_onebtn_check_overviewitem(
    id BIGSERIAL,
    result_id BIGINT NOT NULL, -- '巡检ID',
    page_type INTEGER DEFAULT 1, -- '页签结果，1为正常，2为警告，3为故障',
    parent_id BIGINT NOT NULL, -- '树状表里的二级数据行的父节点',
    page_key VARCHAR(32), -- '页签KEY值',
    page_name VARCHAR(256), -- '页签标题',
    target_name VARCHAR(256), -- '数据异常描述的对象',
    lose_point INTEGER, -- '扣分值',
    DETAIL VARCHAR(1024) -- '数据异常描述'
);

-- 巡检结果中的表格项
CREATE TABLE IF NOT EXISTS tbl_onebtn_check_tableitem(
    id BIGSERIAL,
    result_id BIGINT NOT NULL , -- '巡检ID',
    table_key VARCHAR(32) NOT NULL, -- '表格KEY值',
    table_name VARCHAR(256) NOT NULL, -- '表格标题',
    page_key VARCHAR(32) NOT NULL, -- '表格对应哪个页签',
    table_value TEXT NOT NULL, -- '表格数据对象序列化后的字符串',
    has_suggest BOOLEAN DEFAULT FALSE -- '是否需要显示建议，true为显示，false为不显示'
);

CREATE TABLE IF NOT EXISTS tbl_srm_ace_strategy (
    id BIGSERIAL,
    name VARCHAR(256) NOT NULL,
    description VARCHAR(256),
    business_type INTEGER NOT NULL, -- '业务类型，仅当容灾类型为磁盘备份容灾时有意义。0-普通分组，1-集群分组，2-双机分组',
    sync_interval_enable INT, -- '同步策略是否开启：1、开启0、关闭',
    sync_interval_type INT, -- '同步时间间隔单位 ：0 second 1 minute 2 hour 3 day',
    sync_interval_value INT, -- '同步时间间隔',
    limited_backup_time_enable INT, -- '是否开启同步时间限制 0 关闭 1 开启',
    limited_backup_start_time VARCHAR(10), -- '同步时间开始时间段 01:00',
    limited_backup_end_time VARCHAR(10), -- '同步时间结束时间段 03:00',
    limited_backup_speed INT, -- '是否开启同步速度限制 0 关闭 1 开启',
    limited_backup_speed_value INT, -- '备份速度限制数值',
    limited_backup_speed_unit INTEGER DEFAULT 0, -- '备份速度限制单位0-KB1-MB',
    is_lan_free INT, -- '是否使用lan_free 0 关闭 1 开启',
    snap_interval_type INT, -- '快照间隔时间单位 1：分2：时3：天',
    snap_interval_value INT, -- '快照时间间隔',
    snap_time_limit_enable INT, -- '是否使用开启快照时间段限制1：开启0：关闭',
    snap_time_limit_start_time VARCHAR(10), -- '快照时间开始时间段 01:00',
    snap_time_limit_end_time VARCHAR(10), -- '快照时间结束时间段 03:00',
    diskclone_keepsnap_type INT, -- '快照保存类型 1 按快照数 2 按保留时限',
    diskclone_keepsnap_num INT, -- '每数据集最大快照数',
    diskclone_keepsnap_duration INT, -- '快照保留时限，单位固定为天',
    diskclone_keepfullbackup_num INT, -- '完整数据集',
    grain_storage_strategy INT, -- '颗粒存储策略 0 关闭 1 开启',
    diskclone_backup_model INT, -- '备份模式 1 完全备份 2 精简备份',
    diskclone_check_model INT, -- '数据校验模式 1 完全校验 2 精简校验',
    create_date BIGINT, -- '创建时间，单位为秒',
    PRIMARY KEY (id)
);
CREATE TABLE IF NOT EXISTS tbl_srm_acesure_storage_mapping (
    id BIGSERIAL,
    host_id BIGINT NOT NULL, -- '磁盘备份容灾配置时Acesure里存储介质对应的存储池所在主机id，若为共享存储池，则每个主机有一条记录',
    storage_pool_name VARCHAR(256) NOT NULL, -- '磁盘备份容灾配置时Acesure里存储介质对应的存储池名',
    acesure_storage_id BIGINT NOT NULL, -- '磁盘备份容灾配置时Acesure里存储介质所在存储节点id',
    acesure_storage_symbol VARCHAR(256) NOT NULL, -- '磁盘备份容灾配置时Acesure里存储介质别名，可作为acesure里存储介质的唯一标示',
    acesure_storage_path_id BIGINT NOT NULL, -- '磁盘备份容灾配置时Acesure里存储介质pathId，可作为acesure里存储介质的唯一标示',
    authorized_size BIGINT DEFAULT 0, -- '申请的授权大小，以GB为单位',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_nova_image_file (
    id BIGSERIAL,
    uuid VARCHAR(60) NOT NULL, -- '镜像文件UUID',
    name VARCHAR(128) DEFAULT NULL, -- '镜像文件名称',
    create_date TIMESTAMP(0) NOT NULL, -- '创建时间',
    last_used_time BIGINT NOT NULL, -- '最后被使用时间',
    reserved INTEGER DEFAULT NULL, -- '是否保留：1删除中 0保留',
    checksum VARCHAR(60) DEFAULT NULL, -- '校验码，MD5值',
    size NUMERIC, -- '文件大小',
    type INTEGER DEFAULT NULL, -- '文件类型：1镜像，2临时文件',
    host_id INTEGER DEFAULT NULL, -- '所在主机id',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_ace_stor_node_info (
    id BIGSERIAL,
    host_id INTEGER NOT NULL , -- 'CAS中主机名称',
    host_name VARCHAR(256) NOT NULL, -- '主机名称',
    acesure_stor_node_id INTEGER NOT NULL, -- '数腾平台存储节点的ID',
    acesure_unique_id VARCHAR(256) NOT NULL, -- '数腾平台存储节点unique id',
    acesure_state INTEGER NOT NULL, -- '数腾平台存储节点状态--1-正常',
    PRIMARY KEY (id)
);
CREATE TABLE IF NOT EXISTS tbl_srm_recovery_acedevice (
     id BIGSERIAL,
     plan_id BIGINT, -- '恢复计划ID',
     domain_name VARCHAR(128), -- '虚拟机名称',
     domain_title VARCHAR(128), -- '虚拟机显示名称',
     device_id INTEGER, -- '对应数腾源设备ID',
     PRIMARY KEY (id)
);
CREATE TABLE IF NOT EXISTS tbl_domain_image_node (
    id BIGSERIAL,
    file_name VARCHAR(512) NOT NULL,
    pool_name VARCHAR(256) NULL, -- '存储对应的存储池名称，可能为空',
    backing_file_name VARCHAR(512) NULL, -- '上级基础镜像文件',
    domain_id bigint NOT NULL,
    host_id bigint NOT NULL,
    snapshot_name VARCHAR(256) NULL, -- '存储对应的快照',
    parent_snapshot_name VARCHAR(256) NULL, -- '存储对应快照的父快照',
    is_current_used BIGINT NOT NULL DEFAULT 0, -- '镜像是否处于虚拟机当前使用的链路上, 0 表示叶子节点，1表示主节点，处于虚拟机当前使用的链路',
    ceph_uuid VARCHAR(64) NULL,
    data_pool_name VARCHAR(64) NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_host_issue(
    id BIGSERIAL,
    issue_date BIGINT, -- '下发时间',
    template_id BIGINT, -- '模板ID',
    host_id BIGINT, -- 'HOST ID',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_drain (
    id BIGSERIAL,
    name VARCHAR(256) NOT NULL, -- '引流策略名称',
    title VARCHAR(256) NOT NULL, -- '引流策略显示名称',
    description VARCHAR(256), -- '引流策略描述',
    in_bridge VARCHAR(256) NOT NULL, -- '入方向桥',
    in_vlan INTEGER, -- '入方向VLAN',
    out_bridge VARCHAR(256) NOT NULL, -- '出方向桥',
    out_vlan INTEGER, -- '出方向VLAN',
    type INTEGER DEFAULT 0, -- '0表示引流 ,1表示隔离',
    op_group_id BIGINT DEFAULT 1,
    op_group_code VARCHAR(256) DEFAULT '00',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_cluster_route (
    id BIGSERIAL,
    cluster_id INTEGER CHECK(cluster_id >= 0) NOT NULL,
    dev_name VARCHAR(30), -- '虚拟交换机设备名称，可不配',
    netmask VARCHAR(128) NOT NULL, -- '子网掩码',
    gateway VARCHAR(128) NOT NULL, -- '网关',
    target VARCHAR(128) NOT NULL , -- '路由ip网段',
    target_type VARCHAR(20), -- '路由类型',
    net_type VARCHAR(10), -- '网络类型，IPV4或者IPV6',
    host_ids VARCHAR(256), -- '添加该路由的主机ID列表，逗号分隔',
    op_group_id BIGINT DEFAULT 1,
    op_group_code VARCHAR(256) DEFAULT '00',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_image_record(
    id BIGSERIAL, -- '主键id',
    hostid INTEGER DEFAULT NULL, -- '主机id',
    poolname VARCHAR(128) DEFAULT NULL, -- '存储池名称',
    imagename VARCHAR(128) DEFAULT NULL, -- '存储池名称',
    filename VARCHAR(128) DEFAULT NULL, -- '文件名',
    ostype VARCHAR(128) DEFAULT NULL, -- '用户序列号',
    path VARCHAR(128) DEFAULT NULL, -- '镜像存储路径',
    filesize BIGINT DEFAULT NULL, -- '文件大小',
    uploadtime BIGINT DEFAULT NULL, -- '上传时间',
    PRIMARY KEY (id)
); -- '镜像上传记录';

CREATE TABLE IF NOT EXISTS tbl_trend_cpu (
    id BIGSERIAL, -- '主键ID',
    time DATE UNIQUE NOT NULL, -- '记录数据的日期',
    total NUMERIC(10, 2) NULL DEFAULT NULL, -- '当前平台中所有主机CPU总数',
    allocated NUMERIC(10, 2) NULL DEFAULT NULL, -- '当前平台中虚拟机分配的CPU总数',
    used NUMERIC(10, 2) NULL DEFAULT NULL, -- '当前平台中所有主机使用CPU总和',
    allocated_forecast NUMERIC(10, 2) NULL DEFAULT NULL, -- '预分配预测值',
    used_forecast NUMERIC(10, 2) NULL DEFAULT NULL, -- '实际使用预测值',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_trend_mem (
    id BIGSERIAL, -- '主键ID',
    time DATE UNIQUE NOT NULL, -- '时间戳，记录数据的日期',
    total NUMERIC(12, 2) NULL DEFAULT NULL, -- '当前平台中所有主机内存总量，单位：MB',
    allocated NUMERIC(12, 2) NULL DEFAULT NULL, -- '当前平台中虚拟机分配的内存总量，单位：MB',
    used NUMERIC(12, 2) NULL DEFAULT NULL, -- '当前平台中搜有主机实际使用内存总量，单位：MB',
    allocated_forecast NUMERIC(12, 2) NULL DEFAULT NULL, -- '预分配预测值',
    used_forecast NUMERIC(12, 2) NULL DEFAULT NULL, -- '实际使用预测值',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_trend_storage (
    id BIGSERIAL, -- '主键ID',
    time DATE UNIQUE NOT NULL, -- '时间戳，记录数据的日期',
    type VARCHAR(128) DEFAULT NULL, -- '未使用，预留字段',
    total NUMERIC(24, 2) NULL DEFAULT NULL, -- '当前平台中所有共享存储总容量，单位：KB',
    allocated NUMERIC(24, 2) NULL DEFAULT NULL, -- '当前平台所有共享存储预分配的总量，单位：KB',
    used NUMERIC(24, 2) NULL DEFAULT NULL, -- '当前平台中所有共享存储实际使用总量，单位：KB',
    allocated_forecast NUMERIC(24, 2) NULL DEFAULT NULL, -- '预分配预测值',
    used_forecast NUMERIC(24, 2) NULL DEFAULT NULL, -- '实际使用预测值',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_hot_patch(
    id BIGSERIAL,
    patch_name VARCHAR(256) NOT NULL, -- '补丁包名称',
    version VARCHAR(256) NOT NULL, -- '版本',
    save_path VARCHAR(256) NOT NULL, -- '补丁保存路径',
    install_status SMALLINT NOT NULL, -- '安装状态,0:未安装,1:已安装,2:安装中,3:安装失败,4:已卸载,5:卸载中,6:卸载失败',
    install_progress SMALLINT, -- '安装进度:0-100',
    handle_result SMALLINT, -- '操作结果,0:失败,1:成功,',
    fail_reason VARCHAR(256), -- '失败原因',
    can_uninstall SMALLINT, -- '是否可以卸载,0:不可以，1:可以',
    restart_service SMALLINT, -- '安装/卸载是否需要重启tomcat服务,0:不需要，1:需要',
    description VARCHAR(256), -- '安装包描述',
    os_type INTEGER, -- '适配的操作系统和CPU类型，规则同主机的type',
    adaptive_function INTEGER, -- '安装包适配的功能',
    build_time VARCHAR(64), --  '补丁创建时间',
    PRIMARY KEY (id)
); -- '热补丁';

CREATE TABLE IF NOT EXISTS tbl_upgrade_version(
    id BIGSERIAL,
    name VARCHAR(256) NOT NULL, -- '版本名称',
    description VARCHAR(256), -- '描述',
    type VARCHAR(256), -- '版本类型',
    build_time VARCHAR(256), -- '发布时间',
    compatibility SMALLINT, -- '兼容性检查结果，0:未通过，1:通过',
    file_size BIGINT, -- '文件大小',
    md5 VARCHAR(64), -- '文件md5',
    need_reboot SMALLINT, -- '安装要求-是否需要重启主机：0-无，1-需重启主机',
    vendor VARCHAR(256), -- '提供商',
    upload_time VARCHAR(64), --  '上传时间',
    parent_id BIGINT, --  '子补丁所属补丁组id',
    uninstallable BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (id)
); -- '升级管理-版本';

CREATE TABLE IF NOT EXISTS tbl_upgrade_task(
    id BIGSERIAL,
    name VARCHAR(256), -- '任务名称',
    description VARCHAR(256), -- '描述',
    auto_pause_ha SMALLINT, -- '自动暂停HA,0:否，1:是',
    auto_process_vm SMALLINT, -- '自动处理虚拟机,2:虚拟机在线，迁移，3:虚拟机离线，关机',
    auto_shutdown_vm SMALLINT, -- '关闭虚拟机电源：0-手动，1-自动',
    result SMALLINT, -- '升级结果,0:失败,1:成功,2-部分完成',
    result_desc VARCHAR(256), -- '升级结果描述-失败原因',
    preset_runtime VARCHAR(256), -- '任务预定执行日期',
    create_time TIMESTAMP(0), -- '任务创建日期',
    cluster_concurrent SMALLINT DEFAULT 1, -- '集群并发数',
    host_concurrent SMALLINT DEFAULT 1, -- '主机并发数',
    PRIMARY KEY (id)
); -- '升级管理-升级任务';

CREATE TABLE IF NOT EXISTS tbl_upgrade_task_detail(
    id BIGSERIAL,
    task_id BIGINT, -- '升级任务ID',
    version_id BIGINT, -- '版本ID',
    version_name VARCHAR(256), -- '版本名称',
    version_transfer SMALLINT, -- '版本转储结果,0:未完成，1:完成',
    version_order SMALLINT, -- '版本顺序',
    description VARCHAR(256), -- '描述',
    host_id BIGINT, -- '主机ID',
    host_name VARCHAR(256), -- '主机名称',
    host_type SMALLINT, -- '主机类型：0-CVK，1-单CVM, 2-主CVM, 3-备CVM',
    check_timestamp BIGINT, -- '升级-预检查-时间戳',
    upgrade_timestamp BIGINT, -- '升级-脚本运行-时间戳',
    start_time TIMESTAMP(0), -- '升级后台-开始时间',
    end_time TIMESTAMP(0), -- '升级后台-结束时间',
    upgrade_result SMALLINT, -- '升级-脚本运行-结果',
    need_reboot SMALLINT, -- '升级-是否需要重启主机',
    check_result SMALLINT, -- '升级-预检查-结果',
    check_desc VARCHAR(256), -- '升级-预检查-失败原因',
    run_phase INT, -- '升级-阶段',
    run_result SMALLINT, -- '升级-运行-结果',
    run_desc VARCHAR(256), -- '升级-运行-失败原因',
    patch_list TEXT, --  '子补丁列表，英文逗号分割',
    check_schedule SMALLINT DEFAULT 0, -- '预检查任务执行进度',
    run_schedule SMALLINT DEFAULT 0, -- '升级任务执行进度',
    uninstall_timestamp BIGINT, -- '卸载任务时间戳',
    uninstall_result SMALLINT DEFAULT 0, -- '卸载结果',
    uninstall_desc VARCHAR(256), -- '卸载失败原因',
    uninstall_schedule SMALLINT DEFAULT 0, -- '卸载任务执行进度',
    PRIMARY KEY (id)
); -- '升级管理-升级任务详细信息';

CREATE TABLE IF NOT EXISTS tbl_network_topo_node (
    id BIGSERIAL,
    name VARCHAR(100) DEFAULT NULL, -- '节点名称',
    cluster_id BIGINT DEFAULT NULL, -- '集群ID',
    foreign_id BIGINT DEFAULT NULL, -- '虚拟交换机和虚拟机的外部id，物理出口则为虚拟交换机的外部id，如果物理出口对应的虚拟交换机为vswitch0则该字段为null',
    unit_key VARCHAR(100) DEFAULT NULL, -- '如果虚拟交换机节点为vswitch0则为vswitch0，其他虚拟交换机该字段为null, 如果物理出口则为虚拟交换机的名称',
    unit_type INTEGER DEFAULT NULL, -- '节点类型 1:物理出口组 2:虚拟交换机 3:虚拟机 4:虚拟防火墙 99:eth',
    location_x FLOAT DEFAULT NULL, -- 'x坐标',
    location_y FLOAT DEFAULT NULL, -- 'y坐标',
    PRIMARY KEY (id)
);

CREATE TABLE  IF NOT EXISTS tbl_network_topo_node_info (
    id BIGSERIAL,
    unit_id BIGINT DEFAULT NULL, -- '目标节点ID',
    host_id BIGINT DEFAULT NULL, -- '主机ID',
    eth_name VARCHAR(50) DEFAULT NULL, -- 'eth名称',
    linked_name VARCHAR(100) DEFAULT NULL, -- '节点关联的其它节点名称',
    type INTEGER DEFAULT NULL, -- '节点类型 1:物理出口组 2:虚拟交换机 3:虚拟机 4:虚拟防火墙 99:eth',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_fc_storage_naa (
    id BIGSERIAL,
    host_id BIGINT NOT NULL,
    naa VARCHAR(128) DEFAULT NULL, -- 'NAA',
    naa_name VARCHAR(128) DEFAULT NULL, -- 'NAA名称',
    capacity BIGINT DEFAULT NULL, -- '容量',
    model VARCHAR(64) DEFAULT NULL, -- '型号',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_vlan_trunk (
    id BIGSERIAL,
    name VARCHAR(256) NOT NULL, -- 'VLAN透传策略名称',
    title VARCHAR(256) UNIQUE NOT NULL, -- 'VLAN透传策略显示名称',
    description VARCHAR(256), -- 'VLAN透传策略描述',
    op_group_id BIGINT DEFAULT 1,
    op_group_code VARCHAR(256) DEFAULT '00',
    PRIMARY KEY (id)
);
CREATE TABLE IF NOT EXISTS tbl_vlan_trunk_rule (
    id BIGSERIAL,
    vlan_trunk_id INT,
    vm_vlan INTEGER DEFAULT NULL, -- '虚拟机业务VLAN',
    vswitch_vlan INTEGER DEFAULT NULL, -- '虚拟交换机转发VLAN',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_pvlan (
    ID BIGSERIAL,
    name varchar(256) not null, --策略名称
    title varchar(256) unique not null, --策略显示名称，不能重名
    description varchar(256), --策略描述
    cluster_id bigserial not null, --策略应用的集群id
    cluster_name varchar(256) not null, --策略应用的集群名称
    vswitch_id bigserial not null, --策略应用的虚拟交换机id，该虚拟交换机对应一个集群虚拟交换机
    vswitch_name varchar not null, --策略应用的虚拟交换机名称
    op_group_id BIGINT DEFAULT 1,
    op_group_code VARCHAR(256) DEFAULT '00',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_pvlan_rule (
    id bigserial,
    pvlan_id INT, --对应的pvlan策略id
    primary_vlan INTEGER not null, --主VLAN号
    secondary_vlan INTEGER not null, --辅助VLAN号
    vswitch_name varchar not null, --策略应用的虚拟交换机名称
    type INT not null, --类型，0：混杂，1：隔离，2：团体
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_packet_drop_log (
    id BIGSERIAL,
    target_type INTEGER NOT NULL DEFAULT 0, -- '日志类型，0:未知，1：pkgDrop',
    time bigint NOT NULL, -- '报文丢弃时的时间截',
    protocol VARCHAR(16) NOT NULL, -- '协议，如arp, icmp, icmpv6，tcp，udp',
    src_mac VARCHAR(64) NOT NULL, -- '源MAC',
    dst_mac VARCHAR(64) NOT NULL, -- '目的MAC',
    ct_state VARCHAR(8) NULL, -- '连接跟踪状态',
    src_ip VARCHAR(64) NOT NULL, -- '发送方的IP 地址',
    dst_ip VARCHAR(64) NOT NULL, -- '接收方的IP 地址',
    src_port INTEGER NULL DEFAULT 0, -- '发送方的端口号',
    dst_port INTEGER NULL DEFAULT 0, -- '接收方的端口号',
    in_port INTEGER NOT NULL, -- '报文接收的端口号',
    icmp_type INTEGER NULL DEFAULT -1, -- 'icmp type',
    icmp_code INTEGER NULL DEFAULT -1, -- 'icmp code',
    pkt_len INTEGER NULL DEFAULT 0, -- '报文长度',
    net_profile_name VARCHAR(256) DEFAULT NULL,
    PRIMARY KEY (id)
);
CREATE TABLE IF NOT EXISTS tbl_register_vm_xml_info (
    id BIGSERIAL, --  'id',
    domain_id BIGINT, -- '虚拟机ID',
    pool_name VARCHAR(256),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_component (
    type VARCHAR(20) NOT NULL, -- '组件类型',
    name VARCHAR(32), -- '组件名称',
    version VARCHAR(64), -- '组件版本',
    status VARCHAR(16), -- '组件状态',
    install_time TIMESTAMP(0), -- '组件安装日期',
    PRIMARY KEY (TYPE)
);  -- '组件';

CREATE TABLE IF NOT EXISTS tbl_onebtn_check_strategy(
    id BIGSERIAL, -- '主键',
    frequency INTEGER, -- '频率 0:小时,1:天,2:周',
    day VARCHAR(256), -- '日期 第几日,星期几,每天 ',
    hour INTEGER, -- '时',
    minutes INTEGER, -- '分',
    total_weight INTEGER, -- '分数总占比',
    next_time TIMESTAMP(0), -- '下一次执行时间',
    state INTEGER DEFAULT 0, -- '是否启用:不启用 0,启用 1',
    result_save_count INTEGER DEFAULT 7 -- '巡检结果保存次数'
);  -- '一键巡检定时任务策略表';

CREATE TABLE IF NOT EXISTS tbl_onebtn_check_strategy_item(
    id BIGSERIAL, -- '主键',
    strategy_id BIGINT NOT NULL, --'定时策略id',
    item_id VARCHAR(256) NOT NULL, --'检测项目',
    weight INTEGER NOT NULL --'分数占比'
);  -- '一键巡检定时任务项目表';
CREATE TABLE IF NOT EXISTS tbl_backup_pool(
    id BIGSERIAL,
    name VARCHAR(256) NOT NULL, -- '名称',
    type INTEGER NOT NULL, -- '类型，0.本地备份池 1.远端备份池',
    pool_name VARCHAR(256) DEFAULT NULL, -- '备份存储池名称',
    ip_addr VARCHAR(256) DEFAULT NULL, -- 'Ip地址',
    user_name VARCHAR(256) DEFAULT NULL, -- '用户名',
    password VARCHAR(256) DEFAULT NULL, -- '密码',
    server_type INTEGER DEFAULT NULL, -- ' 连接方式，0：FTP，1:SCP',
    port INTEGER DEFAULT NULL, -- '服务器端口',
    backup_location VARCHAR(256) DEFAULT NULL, -- '备份位置',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_snapshot (
    id BIGSERIAL,
    backing_file_id BIGINT,
    name VARCHAR(256) NOT NULL, -- '快照名称',
    title VARCHAR(256) DEFAULT NULL, -- '快照title',
    description VARCHAR(256) DEFAULT NULL, -- '快照描述',
    internal_snap BOOLEAN, -- '快照位置类型：内部快照：false，外部快照：true',
    has_mem BOOLEAN, -- '是否包含内存：1 是，0 否',
    consistency BOOLEAN, -- '是否为一致性快照：1 是，0 否',
    active INTEGER, -- '是否是当前快照：1 是，0 否',
    domain_id BIGINT NOT NULL, -- '虚拟机ID',
    domain_name VARCHAR(128) NOT NULL, -- '虚拟机名称',
    create_time TIMESTAMP(0), -- '快照创建时间',
    PRIMARY KEY (id)
);
CREATE TABLE IF NOT EXISTS tbl_port_harden_strategy (
    id BIGSERIAL,
    name VARCHAR(256) NOT NULL, -- '端口加固策略名称',
    description VARCHAR(256), -- '端口加固策略描述',
    is_default BIGINT DEFAULT 0, -- '0 非默认策略, 1 默认策略',
    PRIMARY KEY(id)
);
CREATE TABLE IF NOT EXISTS tbl_port_harden_info (
    id BIGSERIAL,
    port_strategy_id BIGINT, -- '关联的端口加固策略ID',
    port VARCHAR(256) NOT NULL, -- '端口',
    PRIMARY KEY(id)
);
CREATE TABLE IF NOT EXISTS tbl_port_harden_host (
    id BIGSERIAL,
    host_ip VARCHAR(64), -- '端口加固关联的主机IP',
    port_strategy_id BIGINT, -- '关联的端口加固策略ID',
    uuid VARCHAR(60)  DEFAULT '',
    cmd_execte_flag BIGINT DEFAULT 0, -- '0 未下发, 1 下发成功，2下发失败',
    PRIMARY KEY(id)
);
CREATE TABLE IF NOT EXISTS tbl_ft_group (
    id BIGSERIAL,
    vswitch VARCHAR(50) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_ft_group_vm (
    id BIGSERIAL,
    ft_group_id BIGINT NOT NULL, -- 'FT组ID',
    domain_id BIGINT NOT NULL, -- '虚拟机ID',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_ft_group_port (
    id BIGSERIAL,
    ft_group_id INTEGER NOT NULL DEFAULT 0, -- 'FT组ID',
    port INTEGER NOT NULL DEFAULT 0, -- '端口号',
    type VARCHAR(50) NOT NULL, -- '端口类型',
    port_key VARCHAR(256) NULL DEFAULT NULL, -- '唯一标识 targetdev或mac',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_host_firewall (
    id BIGSERIAL,
    port_key VARCHAR(256) NOT NULL, -- '端口key',
    port VARCHAR(256) NOT NULL, -- '端口',
    protocol VARCHAR(16) NOT NULL, -- 'tcp，udp',
    server_name VARCHAR(256) NOT NULL, -- '服务名称',
    server_desc VARCHAR(256) NOT NULL, -- '端口描述',
    modify_flag BIGINT DEFAULT 0, -- '0 不能修改, 1 可以修改',
    PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS tbl_host_whitelist (
    id BIGSERIAL,
    host_ip VARCHAR(256) NOT NULL,
    port_key VARCHAR(256) NOT NULL, -- '端口KEY',
    whitelist_ip text, -- '放开的IP',
    whitelist_ipv6 text, -- '放开的IP',
    protocol VARCHAR(16) NOT NULL, -- 'tcp，udp',
    PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS tbl_host_vswitch_net (
    id BIGSERIAL,
    host_id BIGINT NOT NULL,
    host_ip VARCHAR(64) NOT NULL, -- '主机的IP地址',
    vswitch_ipv4 VARCHAR(256), -- '交换机IP',
    vswitch_ipv6 VARCHAR(256), -- '交换机IP',
    vswitch_name VARCHAR(256) NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS tbl_onebtn_check_strategy_email(
    id BIGSERIAL, -- 'id',
    strategy_id BIGINT NOT NULL, -- '巡检定时策略表TBL_ONEBTN_CHECK_STRATEGY id',
    email VARCHAR(100) -- '邮箱'
); -- '一键巡检定时任务邮箱表';

CREATE TABLE IF NOT EXISTS tbl_event_rule_customization (
    id BIGSERIAL,
    target_type   BIGINT       NOT NULL, -- '告警定制对象的类型 1集群 2主机 3虚拟机',
    target_id     BIGINT       NOT NULL, -- '告警定制对象的ID',
    event_rule_id BIGINT       NOT NULL, -- '对应告警规则的ID',
    critica       INTEGER CHECK(critica >= 0) NULL     DEFAULT NULL,
    major         INTEGER CHECK(major   >= 0) NULL     DEFAULT NULL,
    minor         INTEGER CHECK(minor   >= 0) NULL     DEFAULT NULL,
    warning       INTEGER CHECK(warning >= 0) NULL     DEFAULT NULL,
    persist_time  INTEGER         NULL     DEFAULT NULL, -- '持续时间',
    freq_time     INTEGER         NOT NULL DEFAULT 0, -- '告警上报频率',
    enable        INTEGER          NOT NULL DEFAULT 1, -- '是否启用告警规则',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_storage_link (
    id BIGSERIAL,
    host_id BIGINT NOT NULL,
    cluster_id BIGINT,
    host_pool_id BIGINT,
    host_name VARCHAR(256), -- '主机名称',
    pool_name VARCHAR(256), -- '存储池名称',
    naa VARCHAR(128)  DEFAULT NULL, -- 'NAA',
    multipath VARCHAR(128), -- '多路径',
    sg_id VARCHAR(256) DEFAULT NULL, -- '多路径的sg_id',
    physic_port VARCHAR(256), -- '物理端口',
    storage_physic_port VARCHAR(256), -- '存储物理端口',
    create_time TIMESTAMP(0), -- '创建时间',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_host_profile(
    id BIGSERIAL,
    name VARCHAR(256) NOT NULL, -- '名称',
    uuid VARCHAR(320) NOT NULL, -- 'UUID',
    description VARCHAR(1024), -- '描述',
    compliance_host INT DEFAULT 0, -- '合规的主机',
    non_compliance_host INT DEFAULT 0, -- '不合规的主机 ',
    unknown_host INT DEFAULT 0, -- '未知的主机',
    attached_host INT DEFAULT 0, -- '关联的主机',
    last_edit_time VARCHAR(32), -- '上次编辑时间',
    PRIMARY KEY (id)
); -- '主机配置文件';

CREATE TABLE IF NOT EXISTS tbl_host_profile_compliance(
    id BIGSERIAL,
    host_profile_id BIGINT NOT NULL, -- '主机配置文件ID',
    host_id BIGINT NOT NULL, -- '主机ID',
    compliance_status INT DEFAULT 3, -- '合规状态 1:合规 2:不合规 3:未知',
    last_check_time VARCHAR(32), -- '上次检查时间',
    PRIMARY KEY (id)
); -- '主机配置文件-合规性';

CREATE TABLE IF NOT EXISTS tbl_host_profile_compliance_result(
    id BIGSERIAL,
    compliance_id BIGINT NOT NULL, -- '主机配置文件合规性ID',
    type VARCHAR(256), -- '类型',
    config VARCHAR(256), -- '配置',
    host_value VARCHAR(512), -- '主机真实值',
    host_profile_value VARCHAR(512), -- '主机配置值',
    numa_node VARCHAR(16), -- 'CPU NUMA节点索引',
    description VARCHAR(2048), -- '描述',
    PRIMARY KEY (id)
); -- '主机配置文件-合规检测结果';

CREATE TABLE IF NOT EXISTS tbl_category (
    id BIGSERIAL,
    name VARCHAR(256) NOT NULL, -- '名称',
    description VARCHAR(256) DEFAULT NULL, -- '描述',
    multiple_tag BOOLEAN NOT NULL DEFAULT FALSE, -- '每个对象标记数 true 多个，false 一个',
    associate_object BIGINT NOT NULL DEFAULT 0, -- '可关联的对象类型',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_encryption_server_conf (
    id BIGSERIAL,
    ip_addr VARCHAR(256), -- 'IP地址',
    port INT, -- '端口',
    "user" VARCHAR(256), -- '用户名',
    user_pwd VARCHAR(256), -- '用户密码',
    key_pwd VARCHAR(256), -- '密钥密码',
    provider INT, -- '服务提供厂商类型',
    key_code VARCHAR(256), -- '密钥标示',
    service_package_path VARCHAR(256), -- '厂商提供的服务包上传路径，以.tar.gz为后缀',
    encrypt_status INT, -- '加密状态 null/0:未加密 ;1历史数据已加密完成',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_verification_server_conf (
    id BIGSERIAL,
    ip_addr VARCHAR(256), -- '验签平台IP地址',
    port INT, -- '验签平台端口',
    provider INT, -- '验签平台提供厂商类型',
    server_pwd VARCHAR(256), -- '平台密码',
    service_package_path VARCHAR(256), -- '厂商提供的服务包上传路径，以.tar.gz为后缀',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_tag (
    id BIGSERIAL,
    category_id BIGINT NOT NULL, -- '分类ID',
    name VARCHAR(256) NOT NULL, -- '名称',
    description VARCHAR(256) NOT NULL, -- '描述',
    PRIMARY KEY (id)
);
CREATE TABLE IF NOT EXISTS tbl_resource_health_threshold (
	id BIGSERIAL,
	resource_type INT NOT NULL DEFAULT 1, -- '资源类型：1-主机；2-虚拟机；3-集群；4-主机池',
	health_type INT NOT NULL DEFAULT 1, -- '健康指标的类型：1-cpu；2-mem;3-disk;4;network',
	health_threshold INT NOT NULL DEFAULT 70, -- '指标的阈值，默认70%为100分',
	PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_tag_object (
    id BIGSERIAL,
    category_id BIGINT NOT NULL, -- '分类ID',
    tag_id BIGINT NOT NULL, -- '标签ID',
    object_id BIGINT NOT NULL, -- '被打标签对象ID',
    type INT NOT NULL, -- '对象类型，cluster 集群，host 主机，domain 虚拟机',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tbl_scheduled_job (
    id BIGSERIAL,
    bean_name VARCHAR(128) NOT NULL,  --'bean名称',
    method_name VARCHAR(128) NOT NULL, --'方法名称',
    method_params VARCHAR(128), --'方法参数',
    cron_expression VARCHAR(128), --'cron表达式, 和周期执行任务方式(开始延迟时间、任务执行间隔)互斥, 如果该值不为空，优先使用cron方式',
    start_delay INT,  --'开始延迟时间（ms）, 和cron方式互斥, 如果cronExpression不为空，优先使用cron方式',
    repeat_interval INT,  --'任务执行间隔(ms), 和cron方式互斥, 如果cronExpression不为空，优先使用cron方式',
    job_status INT NOT NULL,  --'状态（1正常 0暂停）',
    type VARCHAR(128) NOT NULL,  --'定时任务类型： cas/casserver/performance',
    description VARCHAR(1024), --'描述',
    PRIMARY KEY (ID)
);
CREATE TABLE IF NOT EXISTS tbl_storage_device (
    id BIGSERIAL PRIMARY KEY,
    target_host VARCHAR(256),
    target_name VARCHAR(256),
    storage_type VARCHAR(64),
    naa VARCHAR (128),
    lun VARCHAR(256),
    storage_name VARCHAR(256),
    status VARCHAR(256),
    lun_number VARCHAR(256),
    capacity BIGINT DEFAULT 0,
    multipath VARCHAR(256),
    unmap BIGINT,
    uuid VARCHAR(256),
    writesame BIGINT,
    xcopy BIGINT,
    ats BIGINT,
    host_id INTEGER NOT NULL DEFAULT 0,
    storage_resource_id INTEGER NOT NULL,
    oper_time TIMESTAMP(0) NOT NULL,
    CONSTRAINT tbl_storage_device_host_id_check CHECK ((host_id >= 0))
);
CREATE TABLE IF NOT EXISTS tbl_domain_recycle (
    id BIGSERIAL,
    domain_id BIGINT NOT NULL,-- '虚拟机ID',
    save_time INTEGER  NULL DEFAULT 0, -- '虚拟机回收站删除时间，0表示不自动销毁',
    destory_type INTEGER NOT NULL DEFAULT 0, -- '虚拟机存储文件清理方式，0:保留虚拟机数据存储文件。1:删除虚拟机数据存储文件。2:低格并删除虚拟机数据存储文件',
    del_backup Boolean NOT NULL DEFAULT false, -- '是否删除虚拟机备份文件,false:保留备份文件,true:删除备份文件',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS TBL_FILE_MD5_INFO(
  ID BIGSERIAL,
  FILE_NAME VARCHAR(512),
  HOST_IP varchar(32),
  POOL_NAME VARCHAR(256),
  POOL_TYPE INTEGER,
  VOL_MD5 VARCHAR(64),
  LAST_MODIFY_TIME VARCHAR(32),
  FROM_TYPE INTEGER ,
  PRIMARY KEY (ID)
);
CREATE TABLE IF NOT EXISTS TBL_KMS_CLUSTER(
   ID BIGSERIAL,
   NAME VARCHAR (256) NOT NULL,
   KEY_ALGORITHM VARCHAR(32) NOT NULL,
   KEY_LENGTH VARCHAR(32) NOT NULL,
   PRIMARY KEY (ID)
);

CREATE TABLE IF NOT EXISTS TBL_KMS(
    ID BIGSERIAL,
    CLUSTER_ID BIGINT,
    NAME VARCHAR (256) NOT NULL,
    IP VARCHAR (256) NOT NULL,
    PORT VARCHAR (64) NOT NULL,
    PROXY_SERVER VARCHAR (256),
    PROXY_PORT VARCHAR (256),
    USER_NAME VARCHAR (256),
    PWD VARCHAR (256),
    STATUS VARCHAR (64),
    CA_PATH VARCHAR (256), /*--'kms证书地址'*/
    CSR_HASH VARCHAR (256), /*--'csr的hash'*/
    KEY_PATH VARCHAR (256), /*--'private.key的地址'*/
    CER_PATH VARCHAR (256), /*--'签名后证书的地址'*/
    CA_NOT_AFTER DATE, /*--'kms证书的有效期 '*/
    CER_NOT_AFTER DATE, /*--'签名证书的有效期 '*/
    PRIMARY KEY (ID)
    );

    CREATE TABLE IF NOT EXISTS TBL_TEMPLATE_DISTRIBUTION (
        ID BIGSERIAL,
        TEMPLATE_ID BIGINT NOT NULL,
        TEMPLATE_NAME VARCHAR(512),
        HOST_ID BIGINT,
    	CLUSTER_ID BIGINT,
    	HOSTPOOL_ID BIGINT,
    	FILE_NAME VARCHAR(512),
        POOL_PATH VARCHAR(512),
    	CEPH_UUID  VARCHAR(512),
        PRIMARY KEY (ID)
    );
CREATE INDEX IF NOT EXISTS EVENT_STATE_INDEX ON TBL_EVENT (STATE ASC);
CREATE INDEX IF NOT EXISTS EVENT_EVENT_LEVEL_INDEX ON TBL_EVENT (EVENT_LEVEL ASC);
CREATE INDEX IF NOT EXISTS EVENT_EVENT_TYPE_INDEX ON TBL_EVENT (EVENT_TYPE ASC);
CREATE INDEX IF NOT EXISTS EVENT_EVENT_TIME_INDEX ON TBL_EVENT (EVENT_TIME ASC);
CREATE INDEX IF NOT EXISTS EVENT_CATALOG_ID_INDEX ON TBL_EVENT (CATALOG_ID ASC);
CREATE INDEX IF NOT EXISTS TBL_EVENT_TO_SEND_INDEX ON TBL_EVENT_TO_SEND (EVENT_NAME, EVENT_SRC, EVENT_DESC);
CREATE INDEX IF NOT EXISTS TBL_DOMAIN_IP_CONFIG_INDEX ON TBL_DOMAIN_IP_CONFIG (DOMAIN_ID ASC);
CREATE INDEX IF NOT EXISTS DOMAIN_ID_INDEX ON TBL_DOMAIN_IMAGE_NODE (DOMAIN_ID ASC);
CREATE INDEX IF NOT EXISTS TBL_STORAGE_TREND_NAME_INDEX ON TBL_STORAGE_TREND (STORAGE_NAME);
CREATE INDEX IF NOT EXISTS OPERLOG_Index_2 ON TBL_OPERLOG (CATEGORY, TARGET_ID);
CREATE INDEX IF NOT EXISTS OPERLOG_Index_3 ON TBL_OPERLOG (RELATED_CATEGORY, CATEGORY_ID);
CREATE INDEX IF NOT EXISTS STORAGE_TREND_TIME_INDEX ON TBL_STORAGE_TREND (TIME);
CREATE INDEX IF NOT EXISTS domain_name_host_id ON tbl_domain(domain_name, host_id);
CREATE INDEX IF NOT EXISTS host_id ON tbl_domain(host_id);
