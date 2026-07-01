-- 导出  表 vmware.TBL_PUBLIC_CLOUD 结构
CREATE TABLE IF NOT EXISTS TBL_PUBLIC_CLOUD (
  ID BIGSERIAL,
  NAME varchar(128) NOT NULL, -- '外部云名称',
  DESCRIPTION varchar(254) DEFAULT NULL, -- '外部云描述',
  FLAG smallint NOT NULL, -- '外部云类型，1：阿里云, 2:CAS, 3 vmware',
  URI varchar(128) DEFAULT NULL, -- '访问外部云的URL或IP地址',
  PROTOCAL varchar(10) DEFAULT NULL, -- '访问外部云的协议',
  PORT smallint DEFAULT NULL, -- '访问外部云的Web端口',
  USER_NAME varchar(64) DEFAULT NULL, -- '访问外部云的帐号',
  PASSWORD varchar(128) DEFAULT NULL, -- '访问外部云的密码',
  OP_GROUP_ID bigint DEFAULT '1',
  OP_GROUP_CODE varchar(256) DEFAULT '00',
  PRIMARY KEY (ID)
);

-- 导出  表 vmware.TBL_VM_MIGRATE_STORAGE 结构
CREATE TABLE IF NOT EXISTS TBL_VM_MIGRATE_STORAGE (
  ID BIGSERIAL, -- '唯一标识',
  TASK_ID bigint DEFAULT NULL, -- '任务id',
  STATUS int DEFAULT NULL, -- '状态，0:未开始，1:进行中,2:已完成',
  SRC_FILE_PATH varchar(250) DEFAULT NULL, -- 'vmware端存储文件全路径，String类型',
  SRC_DEVICE_KEY int DEFAULT NULL, -- 'vmware端存储key，int类型',
  SRC_DEVICE_REMAINING_CAPACITY bigint DEFAULT NULL, -- 'vmware端存储迁移剩余容量,单位Bytes',
  DEST_FILE_FULL_PATH varchar(250) DEFAULT NULL, -- '目标文件相对路径，绝对存储池路径，String类型',
  DEST_POOL_NAME varchar(100) DEFAULT NULL, -- '目标文件所属存储池，String类型',
  DEST_FMT varchar(10) DEFAULT NULL, -- '目标文件格式，枚举类型：qcow2，raw',
  CHANGE_ID varchar(100) DEFAULT NULL, -- '对应虚拟机上次快照存储更改ID。，String类型',
  DEST_FILE_SIZE bigint DEFAULT NULL, -- '目标文件大小，long类型， 单位Byte',
  PRIMARY KEY (ID)
); --='迁移存储信息';

-- 导出  表 vmware.TBL_VM_MIGRATE_TASK 结构
CREATE TABLE IF NOT EXISTS TBL_VM_MIGRATE_TASK (
  ID BIGSERIAL,
  SOURCE_HOST_KEY varchar(128) NOT NULL, -- '原虚拟机主机key',
  SOURCE_HOST_NAME varchar(128) NOT NULL, -- '原虚拟机主机名称',
  SOURCE_VM_KEY varchar(128) NOT NULL, -- '原虚拟机key',
  SOURCE_VM_NAME varchar(128) DEFAULT NULL, -- '原虚拟机名称',
  PUBLIC_CLOUD_ID bigint NOT NULL, -- '外部云ID',
  DEST_HOST_ID bigint NOT NULL, -- '目的主机ID',
  DEST_HOST_IP varchar(20) NOT NULL, -- '目的主机IP',
  DEST_HOST_NAME varchar(254) DEFAULT NULL, -- '目的主机名称',
  NEW_VM_UUID varchar(64) NOT NULL, -- '迁移CAS上新虚拟机UUID',
  NEW_VM_TITLE varchar(128) DEFAULT NULL, -- '新虚拟机名称',
  SPEED_TYPE int DEFAULT NULL, -- '限速类型',
  SPEED_VALUE bigint DEFAULT NULL, -- '限速值',
  MIGRATE_TYPE int DEFAULT NULL, -- '迁移类型, 0:手动, 1:自动 ',
  CLOSE int DEFAULT NULL, -- '是否强制关闭源端虚拟机',
  START int DEFAULT NULL, -- '迁入后是否开启虚拟机',
  STATUS int DEFAULT NULL, -- ' 迁移状态，0:未开启，1:进行中，2:完成，3:to_end待结束',
  BACKUP_INTERVAL int DEFAULT NULL, -- '备份间隔时间',
  OP_GROUP_ID bigint DEFAULT '1',
  OP_GROUP_CODE varchar(256) DEFAULT '00',
  TAG int DEFAULT NULL, -- '迁移标记,标记下一次任务执行哪种迁移任务，-1表示不迁移',
  PRIMARY KEY (ID)
);

create extension postgres_fdw;
create server local_server foreign data wrapper postgres_fdw options (host '127.0.0.1', dbname 'vservice');
create user mapping for ${jdbc.username} server local_server options (user '${jdbc.username}', password '${jdbc.password}');
create foreign table
    t_temp_cloud (
        ID BIGSERIAL,
        NAME varchar(128) NOT NULL,
        DESCRIPTION varchar(254) DEFAULT NULL,
        FLAG smallint NOT NULL,
        URI varchar(128) DEFAULT NULL,
        PROTOCAL varchar(10) DEFAULT NULL,
        PORT smallint DEFAULT NULL,
        USER_NAME varchar(64) DEFAULT NULL,
        PASSWORD varchar(128) DEFAULT NULL,
        OP_GROUP_ID bigint DEFAULT '1',
        OP_GROUP_CODE varchar(256) DEFAULT '00')
    server local_server options(schema_name 'public', table_name 'tbl_public_cloud');
INSERT INTO TBL_PUBLIC_CLOUD(NAME, DESCRIPTION, FLAG, URI, PROTOCAL, PORT, USER_NAME, PASSWORD, OP_GROUP_ID, OP_GROUP_CODE) SELECT NAME, DESCRIPTION, FLAG, URI, PROTOCAL, PORT, USER_NAME, PASSWORD, OP_GROUP_ID, OP_GROUP_CODE FROM t_temp_cloud B WHERE B.URI NOT IN (SELECT URI FROM TBL_PUBLIC_CLOUD) AND B.FLAG =3;
drop foreign table t_temp_cloud;
drop user mapping for ${jdbc.username} server local_server;
drop server local_server;
drop extension postgres_fdw;