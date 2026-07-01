-- 导出  表 bare_metal.TBL_BARE_METAL 结构
-- 裸金属列表
CREATE TABLE IF NOT EXISTS TBL_BARE_METAL (
  ID BIGSERIAL,
  TITLE varchar(128) NOT NULL, -- '裸金属名称',
  DESCRIPTION varchar(254) DEFAULT NULL, -- '裸金属描述',
  ILO_IP varchar(256) NOT NULL, -- 'ILO口地址',
  ILO_USER varchar(128) NOT NULL, -- 'ILO用户名',
  ILO_PW varchar(128) NOT NULL, -- 'ILO 密码',
  ILO_PROTOCOL varchar(128) NOT NULL, -- 'ILO访问协议',
  ILO_PORT varchar(128) NOT NULL, -- 'ILO 访问端口',
  OS_VERSION varchar(128), -- '操作系统',
  CPU int CHECK(CPU >= 0),
  CPU_SOCKET int CHECK(CPU_SOCKET >= 0),
  CPU_CORE int CHECK(CPU_CORE >= 0),
  MEMORY NUMERIC DEFAULT NULL, -- '内存单位MB',
  STORAGE NUMERIC DEFAULT NULL, -- '磁盘容量单位GB',
  INSTALL_STATUS int CHECK(INSTALL_STATUS >= 0) DEFAULT NULL, -- '操作系统安装状态',
  SERIAL_NUMBER varchar(128) DEFAULT NULL, -- '服务器序列号',
  POWER_STATUS varchar(128) DEFAULT NULL, -- '服务器序启动状态，1 启动， 0 关闭',
  UUID varchar(128) DEFAULT NULL, -- '服务器UUID',
  OP_GROUP_ID bigint DEFAULT '1',
  OP_GROUP_CODE varchar(256) DEFAULT '00',
  PRIMARY KEY (ID)
);


-- 镜像管理列表
CREATE TABLE IF NOT EXISTS TBL_IMG_FILE (
     ID BIGSERIAL,
     NAME VARCHAR(128), -- '镜像名称',
     OS_TYPE int, -- '镜像操作系统类型   1: linux   2:windows',
     OS_VERSION VARCHAR(128), -- '镜像操作系统版本',
     PATH VARCHAR(512), -- '镜像存放路径',
     UPLOAD_TIME TIMESTAMP, -- '镜像上传时间',
     FILE_SIZE bigint, -- '镜像文件大小，单位:kb',
     MD5 VARCHAR(128), -- '镜像文件MD5值，用于校验文件传输完整性。页面不用显示',
     OP_GROUP_ID bigint DEFAULT '1',
     OP_GROUP_CODE varchar(256) DEFAULT '00',
     DESCRIPTION VARCHAR(256), -- '描述',
     CAPACITY bigint, -- '磁盘容量，单位:kb',
     PRIMARY KEY(ID)
);

-- PXE 服务配置表
CREATE TABLE IF NOT EXISTS TBL_PXE_CONFIG (
     ID BIGSERIAL,
     START_IP VARCHAR(128), -- 'DHCP起始地址',
     END_IP VARCHAR(128), -- 'DHCP结束地址',
     MASK VARCHAR(128), -- '掩码/IPv6后缀',
     GATEWAY VARCHAR(128), -- '网关',
     PRIMARY KEY(ID)
);