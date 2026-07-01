--   表 vmware.TBL_BACKUP_STRATEGY 结构
CREATE TABLE IF NOT EXISTS TBL_BACKUP_STRATEGY (
  ID BIGSERIAL,
  NAME VARCHAR(256) NOT NULL,
  DESCRIPTION VARCHAR(256),
  RESERVED_NUM int, -- '保留个数: 不限制：0',
  DISK_WRITE_LIMIT_TYPE int, -- '是否启动磁盘限速：不启用：0，限制IO速率：1，限制IOPS：2',
  WRITE_RATIO_LIMIT bigint DEFAULT 0, -- '磁盘IO限速值：不启用：0,其他：具体限速值',
  WRITE_IOPS_LIMIT bigint DEFAULT 0, -- '磁盘IOPS限速值：不启用：0，其他：具体限速值',
  BACK_UP_MODE int, -- '增量备份：1，全量备份：0',
  FREQUENCY int, -- '频率:，0：每月:1：每周，2：每日 ',
  DAY int, -- '哪天：几日，或星期几，每天 ',
  HOUR int, -- '时',
  MINUTES int, -- '分',
  HOUR_END int, -- '备份截止时间_时',
  MINUTES_END int, -- '备份截止时间_分',
  OP_GROUP_ID BIGINT DEFAULT 1,
  OP_GROUP_CODE VARCHAR(256) DEFAULT '00',
  NEXT_BACKUP_TIME TIMESTAMP, -- '下次备份时间',
  STATE int, -- '是否生效：生效：1，不生效：0',
  PUBLIC_CLOUD_ID bigint NOT NULL, -- '外部云ID',
  PRIMARY KEY (ID)
);

--   表 vmware.TBL_BACKUP_STRATEGY_VM 结构
CREATE TABLE IF NOT EXISTS TBL_BACKUP_STRATEGY_VM (
  ID BIGSERIAL,
  BACKUP_STRATEGY_ID BIGINT NOT NULL, -- '备份策略ID',
  VM_NAME VARCHAR(256) NOT NULL, -- '虚拟机名称',
  VM_KEY varchar(128) DEFAULT NULL, -- '虚拟机key',
  DEST_HOST_ID bigint NOT NULL, -- '备份的目的主机ID',
  DEST_HOST_NAME VARCHAR(256) NOT NULL, -- '备份的目的主机名称',
  DEST_HOST_IP VARCHAR(256) NOT NULL, -- '备份的目的主机IP',
  DEST_STORAGE_POOL_NAME VARCHAR(256) NOT NULL, -- '备份的目的主机的目的存储池',
  DEST_STORAGE_POOL_TITLE VARCHAR(256) NOT NULL, -- '备份的目的主机的目的存储池显示名称',
  PRIORITY INT DEFAULT 0, -- '备份时虚拟机的优先级，数字越小优先级越高',
  NEXT_BACKUP_TIME TIMESTAMP, -- '下次备份时间',
  PRIMARY KEY (ID)
);

--   表 vmware.TBL_DOMAIN_BACKUP 结构
CREATE TABLE IF NOT EXISTS TBL_DOMAIN_BACKUP (
  ID BIGSERIAL,
  NAME VARCHAR(256),
  BACKUP_MODE int, -- '备份类型 0表示全量备份，10表示增量备份的全量备份，11表示增量备份',
  BACKUP_STORAGE_LOCATION VARCHAR(256), -- '备份存储位置',
  BACKUP_STORAGE_NAME VARCHAR(256), -- '备份存储名称',
  DOMAIN_KEY VARCHAR(256), -- '备份第三方虚拟机key',
  DOMAIN_NAME VARCHAR(256), -- '备份第三方虚拟机名称',
  PUBLIC_CLOUD_ID bigint, -- '备份第三方虚拟机所在的云ID',
  BACKUP_LOCATION VARCHAR(256), -- '备份位置',
  BACKUP_TIME TIMESTAMP, -- '备份时间',
  BACKUP_SIZE NUMERIC, -- '备份大小',
  IS_LEAF int, -- '是否为叶子节点 1：是  0：不是',
  DEFAULT_BACKUP_NAME varchar(256), -- '备份默认名称',
  HOST_ID bigint, -- '主机id',
  HOST_IP VARCHAR(256), -- '主机IP',
  HOST_NAME VARCHAR(256), -- '主机名称',
  PARENT_ID bigint NOT NULL DEFAULT 0,
  PRIMARY KEY (ID)
);


CREATE TABLE IF NOT EXISTS TBL_PARAMETER (
  ID BIGSERIAL,
  TYPE VARCHAR(256) NOT NULL,
  NAME VARCHAR(256) NOT NULL,
  VALUE VARCHAR(512),
  PRIMARY KEY (ID)
);

INSERT INTO TBL_PARAMETER(TYPE, NAME,VALUE) SELECT 'sys_conf', 'i18n.language', 'zh-CN' WHERE NOT EXISTS(SELECT * FROM TBL_PARAMETER WHERE NAME = 'i18n.language');