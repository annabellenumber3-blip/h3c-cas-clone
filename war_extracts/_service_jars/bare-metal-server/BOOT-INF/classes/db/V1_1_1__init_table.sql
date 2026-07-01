-- 裸金属主机网卡表
CREATE TABLE IF NOT EXISTS TBL_BARE_METAL_NIC (
     ID BIGSERIAL,
     BARE_METAL_ID BIGINT,
     MAC VARCHAR(128), -- 'MAC地址',
     SPEED VARCHAR(128), -- '速率, 单位Mbps',
     STATUS VARCHAR(128), -- '网卡状态',
     MODEL VARCHAR(128), -- '网卡型号',
     PORT_GROUP VARCHAR(128), -- '端口分组，用于区分物理口是否属于同一张网卡。相同组为同一张网卡',
     PRIMARY KEY(ID)
);

