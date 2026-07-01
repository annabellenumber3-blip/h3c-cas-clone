CREATE DATABASE IF NOT EXISTS metrics;
CREATE TABLE IF NOT EXISTS metrics.TBL_LB_SERVERFARM_STAT(
         TIME DateTime DEFAULT now(),
         LB_DEVICE_ID UInt32,
         DRX_ID UInt32,
         PKTS_OUT UInt32,
         PKTS_IN UInt32,
         ACTIVE_CONNECTIONS UInt32,
         DROPPED_PKTS UInt32,
         CACHED_RATE UInt32,
         TOTAL_CONNECTIONS UInt32
) ENGINE = MergeTree()
  ORDER BY (LB_DEVICE_ID, DRX_ID, TIME)
  TTL TIME + INTERVAL 1 DAY;



CREATE TABLE IF NOT EXISTS metrics.TBL_FC_STORAGE_ERROR_CODE(
	TIME DateTime DEFAULT now(),
	HOST_POOL_ID UInt32,
	CLUSTER_ID UInt32,
	HOST_ID UInt32,
	OP_GROUP_ID UInt32 DEFAULT 1,
	OP_GROUP_CODE String DEFAULT '00',
	PHYSIC_PORT String COMMENT '物理端口',
	ERROR_FRAMES Decimal128(2) DEFAULT NULL COMMENT '表示收到错误帧个数，该统计一般是链路信号不稳导致，请排查光纤和光模块',
	INVALID_CRC_COUNT Decimal128(2) DEFAULT NULL COMMENT '无效crc个数，该统计是线缆或者光模块信号差导致，请排查光纤和光模块，实际定位中，大多非存储问题，而是主机到交换机之间有问题产生误码后透传给存储',
	LOSS_OF_SIGNAL_COUNT Decimal128(2) DEFAULT NULL COMMENT '光信号丢失，首先确认客户是否有切速率、切拓扑、拔插线缆操作，如果有该操作则可能会引起Loss of Signal；如果客户无上述引起光信号中断操作，并且此时端口一直闪断则需要排查光模块和光纤是否有损坏，建议换插到正常端口逐一排除',
	LOSS_OF_SYNC_COUNT Decimal128(2) DEFAULT NULL COMMENT '失去同步， 该统计一般在切速率或者切拓扑过程中概率出现，如果此时端口LinkUp，并且链路无闪断以及Bad Rx Char',
	LINK_FAILURE_COUNT Decimal128(2) DEFAULT NULL COMMENT '连接失败次数，该统计一般为0，链路LinkUp并且无闪断',
	INVALID_TX_WORD_COUNT Decimal128(2) DEFAULT NULL COMMENT '无效发送字节数'
) ENGINE = MergeTree()
  ORDER BY (HOST_POOL_ID, CLUSTER_ID, HOST_ID, PHYSIC_PORT, TIME)
  TTL TIME + INTERVAL 1 DAY;

CREATE TABLE IF NOT EXISTS metrics.AGG_FC_STORAGE_ERROR_CODE_5M(
	TIME DateTime,
	HOST_POOL_ID UInt32,
	CLUSTER_ID UInt32,
	HOST_ID UInt32,
	OP_GROUP_ID UInt32 DEFAULT 1,
	OP_GROUP_CODE String DEFAULT '00',
	PHYSIC_PORT String COMMENT '物理端口',
	ERROR_FRAMES_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	ERROR_FRAMES_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	ERROR_FRAMES_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	ERROR_FRAMES_SUM AggregateFunction(SUM, Nullable(Decimal128(2))),
	INVALID_CRC_COUNT_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	INVALID_CRC_COUNT_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	INVALID_CRC_COUNT_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	INVALID_CRC_COUNT_SUM AggregateFunction(SUM, Nullable(Decimal128(2))),
	LOSS_OF_SIGNAL_COUNT_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	LOSS_OF_SIGNAL_COUNT_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	LOSS_OF_SIGNAL_COUNT_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	LOSS_OF_SIGNAL_COUNT_SUM AggregateFunction(SUM, Nullable(Decimal128(2))),
	LOSS_OF_SYNC_COUNT_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	LOSS_OF_SYNC_COUNT_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	LOSS_OF_SYNC_COUNT_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	LOSS_OF_SYNC_COUNT_SUM AggregateFunction(SUM, Nullable(Decimal128(2))),
	LINK_FAILURE_COUNT_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	LINK_FAILURE_COUNT_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	LINK_FAILURE_COUNT_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	LINK_FAILURE_COUNT_SUM AggregateFunction(SUM, Nullable(Decimal128(2))),
	INVALID_TX_WORD_COUNT_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	INVALID_TX_WORD_COUNT_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	INVALID_TX_WORD_COUNT_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	INVALID_TX_WORD_COUNT_SUM AggregateFunction(SUM, Nullable(Decimal128(2)))
) ENGINE = AggregatingMergeTree()
  PARTITION BY toYYYYMMDD(TIME)
  ORDER BY (HOST_POOL_ID, CLUSTER_ID, HOST_ID, PHYSIC_PORT, TIME)
  TTL TIME + INTERVAL 3 DAY;

  CREATE TABLE IF NOT EXISTS metrics.AGG_FC_STORAGE_ERROR_CODE_30M(
	TIME DateTime,
	HOST_POOL_ID UInt32,
	CLUSTER_ID UInt32,
	HOST_ID UInt32,
	OP_GROUP_ID UInt32 DEFAULT 1,
	OP_GROUP_CODE String DEFAULT '00',
	PHYSIC_PORT String COMMENT '物理端口',
	ERROR_FRAMES_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	ERROR_FRAMES_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	ERROR_FRAMES_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	ERROR_FRAMES_SUM AggregateFunction(SUM, Nullable(Decimal128(2))),
	INVALID_CRC_COUNT_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	INVALID_CRC_COUNT_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	INVALID_CRC_COUNT_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	INVALID_CRC_COUNT_SUM AggregateFunction(SUM, Nullable(Decimal128(2))),
	LOSS_OF_SIGNAL_COUNT_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	LOSS_OF_SIGNAL_COUNT_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	LOSS_OF_SIGNAL_COUNT_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	LOSS_OF_SIGNAL_COUNT_SUM AggregateFunction(SUM, Nullable(Decimal128(2))),
	LOSS_OF_SYNC_COUNT_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	LOSS_OF_SYNC_COUNT_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	LOSS_OF_SYNC_COUNT_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	LOSS_OF_SYNC_COUNT_SUM AggregateFunction(SUM, Nullable(Decimal128(2))),
	LINK_FAILURE_COUNT_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	LINK_FAILURE_COUNT_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	LINK_FAILURE_COUNT_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	LINK_FAILURE_COUNT_SUM AggregateFunction(SUM, Nullable(Decimal128(2))),
	INVALID_TX_WORD_COUNT_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	INVALID_TX_WORD_COUNT_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	INVALID_TX_WORD_COUNT_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	INVALID_TX_WORD_COUNT_SUM AggregateFunction(SUM, Nullable(Decimal128(2)))
) ENGINE = AggregatingMergeTree()
  PARTITION BY toYYYYMMDD(TIME)
  ORDER BY (HOST_POOL_ID, CLUSTER_ID, HOST_ID, PHYSIC_PORT, TIME)
  TTL TIME + INTERVAL 7 DAY;

CREATE TABLE IF NOT EXISTS metrics.AGG_FC_STORAGE_ERROR_CODE_1H(
	TIME DateTime,
	HOST_POOL_ID UInt32,
	CLUSTER_ID UInt32,
	HOST_ID UInt32,
	OP_GROUP_ID UInt32 DEFAULT 1,
	OP_GROUP_CODE String DEFAULT '00',
	PHYSIC_PORT String COMMENT '物理端口',
	ERROR_FRAMES_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	ERROR_FRAMES_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	ERROR_FRAMES_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	ERROR_FRAMES_SUM AggregateFunction(SUM, Nullable(Decimal128(2))),
	INVALID_CRC_COUNT_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	INVALID_CRC_COUNT_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	INVALID_CRC_COUNT_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	INVALID_CRC_COUNT_SUM AggregateFunction(SUM, Nullable(Decimal128(2))),
	LOSS_OF_SIGNAL_COUNT_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	LOSS_OF_SIGNAL_COUNT_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	LOSS_OF_SIGNAL_COUNT_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	LOSS_OF_SIGNAL_COUNT_SUM AggregateFunction(SUM, Nullable(Decimal128(2))),
	LOSS_OF_SYNC_COUNT_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	LOSS_OF_SYNC_COUNT_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	LOSS_OF_SYNC_COUNT_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	LOSS_OF_SYNC_COUNT_SUM AggregateFunction(SUM, Nullable(Decimal128(2))),
	LINK_FAILURE_COUNT_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	LINK_FAILURE_COUNT_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	LINK_FAILURE_COUNT_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	LINK_FAILURE_COUNT_SUM AggregateFunction(SUM, Nullable(Decimal128(2))),
	INVALID_TX_WORD_COUNT_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	INVALID_TX_WORD_COUNT_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	INVALID_TX_WORD_COUNT_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	INVALID_TX_WORD_COUNT_SUM AggregateFunction(SUM, Nullable(Decimal128(2)))
) ENGINE = AggregatingMergeTree()
  PARTITION BY toYYYYMMDD(TIME)
  ORDER BY (HOST_POOL_ID, CLUSTER_ID, HOST_ID, PHYSIC_PORT, TIME)
  TTL TIME + INTERVAL 1 MONTH;

  CREATE TABLE IF NOT EXISTS metrics.AGG_FC_STORAGE_ERROR_CODE_1D(
	TIME DateTime,
	HOST_POOL_ID UInt32,
	CLUSTER_ID UInt32,
	HOST_ID UInt32,
	OP_GROUP_ID UInt32 DEFAULT 1,
	OP_GROUP_CODE String DEFAULT '00',
	PHYSIC_PORT String COMMENT '物理端口',
	ERROR_FRAMES_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	ERROR_FRAMES_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	ERROR_FRAMES_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	ERROR_FRAMES_SUM AggregateFunction(SUM, Nullable(Decimal128(2))),
	INVALID_CRC_COUNT_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	INVALID_CRC_COUNT_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	INVALID_CRC_COUNT_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	INVALID_CRC_COUNT_SUM AggregateFunction(SUM, Nullable(Decimal128(2))),
	LOSS_OF_SIGNAL_COUNT_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	LOSS_OF_SIGNAL_COUNT_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	LOSS_OF_SIGNAL_COUNT_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	LOSS_OF_SIGNAL_COUNT_SUM AggregateFunction(SUM, Nullable(Decimal128(2))),
	LOSS_OF_SYNC_COUNT_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	LOSS_OF_SYNC_COUNT_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	LOSS_OF_SYNC_COUNT_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	LOSS_OF_SYNC_COUNT_SUM AggregateFunction(SUM, Nullable(Decimal128(2))),
	LINK_FAILURE_COUNT_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	LINK_FAILURE_COUNT_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	LINK_FAILURE_COUNT_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	LINK_FAILURE_COUNT_SUM AggregateFunction(SUM, Nullable(Decimal128(2))),
	INVALID_TX_WORD_COUNT_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	INVALID_TX_WORD_COUNT_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	INVALID_TX_WORD_COUNT_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	INVALID_TX_WORD_COUNT_SUM AggregateFunction(SUM, Nullable(Decimal128(2)))
) ENGINE = AggregatingMergeTree()
  PARTITION BY toYYYYMMDD(TIME)
  ORDER BY (HOST_POOL_ID, CLUSTER_ID, HOST_ID, PHYSIC_PORT, TIME)
  TTL TIME + INTERVAL 5 YEAR;

CREATE TABLE IF NOT EXISTS metrics.TBL_HOST_CPU_MEM_DETAIL(
	TIME DateTime DEFAULT now(),
	HOST_POOL_ID UInt32,
	CLUSTER_ID UInt32,
	HOST_ID UInt32,
	OP_GROUP_ID UInt32 DEFAULT 1,
	OP_GROUP_CODE String DEFAULT '00',
	CPU_RATE Decimal128(2) DEFAULT NULL,
	CPU_USAGE_MHZ Decimal128(2) DEFAULT NULL COMMENT 'CPU使用的频率数，单位MHZ',
	MEMORY_RATE Decimal128(2) DEFAULT NULL,
	BUFFER_RATE Decimal128(2) DEFAULT NULL,
	CACHED_RATE Decimal128(2) DEFAULT NULL,
	SWAP_RATE Decimal128(2) DEFAULT NULL,
	FLOW_STAT Decimal128(2) DEFAULT NULL,
	HUGEPAGE_MEM_RATE Decimal128(2) DEFAULT NULL,
  VM_GROUP_MEM_RATE Decimal128(2) DEFAULT NULL,
  OVS_GROUP_MEM_RATE Decimal128(2) DEFAULT NULL,
  HUGEPAGE_MEMORY_TOTAL Decimal128(2) DEFAULT NULL,
  FLEXIBLE_HUGEPAGE_MEM_RATE Decimal128(2) DEFAULT NULL,
  FLEXIBLE_HUGEPAGE_MEMORY_TOTAL Decimal128(2) DEFAULT NULL,
  HUGEPAGE_STATUS UInt32 DEFAULT 0,
  OVS_ISOLATED_MEM Decimal128(2) DEFAULT NULL,
  VM_ISOLATED_MEM Decimal128(2) DEFAULT NULL
) ENGINE = MergeTree()
  ORDER BY (HOST_POOL_ID, CLUSTER_ID, HOST_ID, HUGEPAGE_STATUS, TIME)
  TTL TIME + INTERVAL 1 DAY;

CREATE TABLE IF NOT EXISTS metrics.AGG_HOST_CPU_MEM_DETAIL_5M(
	TIME DateTime,
	HOST_POOL_ID UInt32,
	CLUSTER_ID UInt32,
	HOST_ID UInt32,
	OP_GROUP_ID UInt32 DEFAULT 1,
	OP_GROUP_CODE String DEFAULT '00',
  CPU_RATE_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	CPU_RATE_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	CPU_RATE_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	CPU_USAGE_MHZ_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	CPU_USAGE_MHZ_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	CPU_USAGE_MHZ_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	MEMORY_RATE_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	MEMORY_RATE_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	MEMORY_RATE_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	HUGEPAGE_MEM_RATE_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	HUGEPAGE_MEM_RATE_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	HUGEPAGE_MEM_RATE_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
  HUGEPAGE_MEMORY_TOTAL_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
  FLEXIBLE_HUGEPAGE_MEMORY_TOTAL_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	FLEXIBLE_HUGEPAGE_MEM_RATE_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	FLEXIBLE_HUGEPAGE_MEM_RATE_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	FLEXIBLE_HUGEPAGE_MEM_RATE_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	VM_GROUP_MEM_RATE_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	VM_GROUP_MEM_RATE_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	VM_GROUP_MEM_RATE_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	OVS_GROUP_MEM_RATE_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	OVS_GROUP_MEM_RATE_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	OVS_GROUP_MEM_RATE_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	BUFFER_RATE_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	BUFFER_RATE_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	BUFFER_RATE_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	CACHED_RATE_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	CACHED_RATE_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	CACHED_RATE_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	SWAP_RATE_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	SWAP_RATE_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	SWAP_RATE_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	FLOW_STAT_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	FLOW_STAT_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	FLOW_STAT_AVG AggregateFunction(AVG, Nullable(Decimal128(2)))
) ENGINE = AggregatingMergeTree()
  PARTITION BY toYYYYMMDD(TIME)
  ORDER BY (HOST_POOL_ID, CLUSTER_ID, HOST_ID, TIME)
  TTL TIME + INTERVAL 3 DAY;

CREATE TABLE IF NOT EXISTS metrics.AGG_HOST_CPU_MEM_DETAIL_30M(
	TIME DateTime,
	HOST_POOL_ID UInt32,
	CLUSTER_ID UInt32,
	HOST_ID UInt32,
	OP_GROUP_ID UInt32 DEFAULT 1,
	OP_GROUP_CODE String DEFAULT '00',
  CPU_RATE_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	CPU_RATE_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	CPU_RATE_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	CPU_USAGE_MHZ_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	CPU_USAGE_MHZ_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	CPU_USAGE_MHZ_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	MEMORY_RATE_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	MEMORY_RATE_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	MEMORY_RATE_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	HUGEPAGE_MEM_RATE_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	HUGEPAGE_MEM_RATE_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	HUGEPAGE_MEM_RATE_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	HUGEPAGE_MEMORY_TOTAL_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	FLEXIBLE_HUGEPAGE_MEMORY_TOTAL_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	FLEXIBLE_HUGEPAGE_MEM_RATE_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	FLEXIBLE_HUGEPAGE_MEM_RATE_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	FLEXIBLE_HUGEPAGE_MEM_RATE_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	VM_GROUP_MEM_RATE_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	VM_GROUP_MEM_RATE_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	VM_GROUP_MEM_RATE_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	OVS_GROUP_MEM_RATE_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	OVS_GROUP_MEM_RATE_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	OVS_GROUP_MEM_RATE_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	BUFFER_RATE_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	BUFFER_RATE_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	BUFFER_RATE_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	CACHED_RATE_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	CACHED_RATE_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	CACHED_RATE_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	SWAP_RATE_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	SWAP_RATE_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	SWAP_RATE_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	FLOW_STAT_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	FLOW_STAT_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	FLOW_STAT_AVG AggregateFunction(AVG, Nullable(Decimal128(2)))
) ENGINE = AggregatingMergeTree()
  PARTITION BY toYYYYMMDD(TIME)
  ORDER BY (HOST_POOL_ID, CLUSTER_ID, HOST_ID, TIME)
  TTL TIME + INTERVAL 7 DAY;

CREATE TABLE IF NOT EXISTS metrics.AGG_HOST_CPU_MEM_DETAIL_1H(
	TIME DateTime,
	HOST_POOL_ID UInt32,
	CLUSTER_ID UInt32,
	HOST_ID UInt32,
	OP_GROUP_ID UInt32 DEFAULT 1,
	OP_GROUP_CODE String DEFAULT '00',
  CPU_RATE_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	CPU_RATE_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	CPU_RATE_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	CPU_USAGE_MHZ_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	CPU_USAGE_MHZ_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	CPU_USAGE_MHZ_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	MEMORY_RATE_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	MEMORY_RATE_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	MEMORY_RATE_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	HUGEPAGE_MEM_RATE_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	HUGEPAGE_MEM_RATE_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	HUGEPAGE_MEM_RATE_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	HUGEPAGE_MEMORY_TOTAL_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	FLEXIBLE_HUGEPAGE_MEMORY_TOTAL_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	FLEXIBLE_HUGEPAGE_MEM_RATE_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	FLEXIBLE_HUGEPAGE_MEM_RATE_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	FLEXIBLE_HUGEPAGE_MEM_RATE_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	VM_GROUP_MEM_RATE_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	VM_GROUP_MEM_RATE_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	VM_GROUP_MEM_RATE_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	OVS_GROUP_MEM_RATE_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	OVS_GROUP_MEM_RATE_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	OVS_GROUP_MEM_RATE_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	BUFFER_RATE_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	BUFFER_RATE_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	BUFFER_RATE_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	CACHED_RATE_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	CACHED_RATE_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	CACHED_RATE_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	SWAP_RATE_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	SWAP_RATE_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	SWAP_RATE_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	FLOW_STAT_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	FLOW_STAT_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	FLOW_STAT_AVG AggregateFunction(AVG, Nullable(Decimal128(2)))
) ENGINE = AggregatingMergeTree()
  PARTITION BY toYYYYMMDD(TIME)
  ORDER BY (HOST_POOL_ID, CLUSTER_ID, HOST_ID, TIME)
  TTL TIME + INTERVAL 1 MONTH;

CREATE TABLE IF NOT EXISTS metrics.AGG_HOST_CPU_MEM_DETAIL_1D(
	TIME DateTime,
	HOST_POOL_ID UInt32,
	CLUSTER_ID UInt32,
	HOST_ID UInt32,
	OP_GROUP_ID UInt32 DEFAULT 1,
	OP_GROUP_CODE String DEFAULT '00',
  CPU_RATE_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	CPU_RATE_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	CPU_RATE_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	CPU_USAGE_MHZ_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	CPU_USAGE_MHZ_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	CPU_USAGE_MHZ_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	MEMORY_RATE_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	MEMORY_RATE_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	MEMORY_RATE_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	HUGEPAGE_MEM_RATE_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	HUGEPAGE_MEM_RATE_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	HUGEPAGE_MEM_RATE_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	HUGEPAGE_MEMORY_TOTAL_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	FLEXIBLE_HUGEPAGE_MEMORY_TOTAL_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	FLEXIBLE_HUGEPAGE_MEM_RATE_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	FLEXIBLE_HUGEPAGE_MEM_RATE_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	FLEXIBLE_HUGEPAGE_MEM_RATE_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	VM_GROUP_MEM_RATE_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	VM_GROUP_MEM_RATE_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	VM_GROUP_MEM_RATE_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	OVS_GROUP_MEM_RATE_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	OVS_GROUP_MEM_RATE_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	OVS_GROUP_MEM_RATE_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	BUFFER_RATE_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	BUFFER_RATE_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	BUFFER_RATE_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	CACHED_RATE_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	CACHED_RATE_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	CACHED_RATE_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	SWAP_RATE_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	SWAP_RATE_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	SWAP_RATE_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	FLOW_STAT_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	FLOW_STAT_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	FLOW_STAT_AVG AggregateFunction(AVG, Nullable(Decimal128(2)))
) ENGINE = AggregatingMergeTree()
  PARTITION BY toYear(TIME)
  ORDER BY (HOST_POOL_ID, CLUSTER_ID, HOST_ID, TIME)
  TTL TIME + INTERVAL 5 YEAR;

CREATE TABLE IF NOT EXISTS metrics.TBL_HOST_NIC_FLOW(
	TIME DateTime DEFAULT now(),
	HOST_POOL_ID UInt32,
	CLUSTER_ID UInt32,
	HOST_ID UInt32,
	MAC String NOT NULL,
	OP_GROUP_ID UInt32 DEFAULT 1,
	OP_GROUP_CODE String DEFAULT '00',
	RX_FLOW Decimal128(2) DEFAULT NULL,
	RX_PACKETS Decimal128(2) DEFAULT NULL,
	RX_DROP Decimal128(2) DEFAULT NULL,
	RX_ERR Decimal128(2) DEFAULT NULL,
	TX_FLOW Decimal128(2) DEFAULT NULL,
	TX_PACKETS Decimal128(2) DEFAULT NULL,
	TX_DROP Decimal128(2) DEFAULT NULL,
	TX_ERR Decimal128(2) DEFAULT NULL
) ENGINE = MergeTree()
  ORDER BY (HOST_POOL_ID, CLUSTER_ID, HOST_ID, MAC, TIME)
  TTL TIME + INTERVAL 1 DAY;

CREATE TABLE IF NOT EXISTS metrics.AGG_HOST_NIC_FLOW_5M(
	TIME DateTime,
	HOST_POOL_ID UInt32,
	CLUSTER_ID UInt32,
	HOST_ID UInt32,
	MAC String NOT NULL,
	OP_GROUP_ID UInt32 DEFAULT 1,
	OP_GROUP_CODE String DEFAULT '00',
  RX_FLOW_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RX_FLOW_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RX_FLOW_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	RX_PACKETS_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RX_PACKETS_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RX_PACKETS_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	RX_DROP_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RX_DROP_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RX_DROP_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	RX_ERR_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RX_ERR_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RX_ERR_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	TX_FLOW_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	TX_FLOW_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	TX_FLOW_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	TX_PACKETS_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	TX_PACKETS_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	TX_PACKETS_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	TX_DROP_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	TX_DROP_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	TX_DROP_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	TX_ERR_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	TX_ERR_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	TX_ERR_AVG AggregateFunction(AVG, Nullable(Decimal128(2)))
) ENGINE = AggregatingMergeTree()
  PARTITION BY toYYYYMMDD(TIME)
  ORDER BY (HOST_POOL_ID, CLUSTER_ID, HOST_ID, MAC, TIME)
  TTL TIME + INTERVAL 3 DAY;

CREATE TABLE IF NOT EXISTS metrics.AGG_HOST_NIC_FLOW_30M(
	TIME DateTime,
	HOST_POOL_ID UInt32,
	CLUSTER_ID UInt32,
	HOST_ID UInt32,
	MAC String NOT NULL,
	OP_GROUP_ID UInt32 DEFAULT 1,
	OP_GROUP_CODE String DEFAULT '00',
  RX_FLOW_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RX_FLOW_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RX_FLOW_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	RX_PACKETS_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RX_PACKETS_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RX_PACKETS_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	RX_DROP_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RX_DROP_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RX_DROP_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	RX_ERR_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RX_ERR_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RX_ERR_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	TX_FLOW_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	TX_FLOW_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	TX_FLOW_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	TX_PACKETS_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	TX_PACKETS_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	TX_PACKETS_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	TX_DROP_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	TX_DROP_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	TX_DROP_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	TX_ERR_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	TX_ERR_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	TX_ERR_AVG AggregateFunction(AVG, Nullable(Decimal128(2)))
) ENGINE = AggregatingMergeTree()
  PARTITION BY toYYYYMMDD(TIME)
  ORDER BY (HOST_POOL_ID, CLUSTER_ID, HOST_ID, MAC, TIME)
  TTL TIME + INTERVAL 7 DAY;

CREATE TABLE IF NOT EXISTS metrics.AGG_HOST_NIC_FLOW_1H(
	TIME DateTime,
	HOST_POOL_ID UInt32,
	CLUSTER_ID UInt32,
	HOST_ID UInt32,
	MAC String NOT NULL,
	OP_GROUP_ID UInt32 DEFAULT 1,
	OP_GROUP_CODE String DEFAULT '00',
  RX_FLOW_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RX_FLOW_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RX_FLOW_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	RX_PACKETS_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RX_PACKETS_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RX_PACKETS_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	RX_DROP_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RX_DROP_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RX_DROP_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	RX_ERR_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RX_ERR_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RX_ERR_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	TX_FLOW_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	TX_FLOW_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	TX_FLOW_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	TX_PACKETS_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	TX_PACKETS_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	TX_PACKETS_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	TX_DROP_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	TX_DROP_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	TX_DROP_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	TX_ERR_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	TX_ERR_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	TX_ERR_AVG AggregateFunction(AVG, Nullable(Decimal128(2)))
) ENGINE = AggregatingMergeTree()
  PARTITION BY toYYYYMMDD(TIME)
  ORDER BY (HOST_POOL_ID, CLUSTER_ID, HOST_ID, MAC, TIME)
  TTL TIME + INTERVAL 1 MONTH;

CREATE TABLE IF NOT EXISTS metrics.AGG_HOST_NIC_FLOW_1D(
	TIME DateTime,
	HOST_POOL_ID UInt32,
	CLUSTER_ID UInt32,
	HOST_ID UInt32,
	MAC String NOT NULL,
	OP_GROUP_ID UInt32 DEFAULT 1,
	OP_GROUP_CODE String DEFAULT '00',
  RX_FLOW_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RX_FLOW_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RX_FLOW_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	RX_PACKETS_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RX_PACKETS_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RX_PACKETS_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	RX_DROP_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RX_DROP_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RX_DROP_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	RX_ERR_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RX_ERR_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RX_ERR_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	TX_FLOW_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	TX_FLOW_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	TX_FLOW_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	TX_PACKETS_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	TX_PACKETS_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	TX_PACKETS_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	TX_DROP_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	TX_DROP_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	TX_DROP_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	TX_ERR_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	TX_ERR_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	TX_ERR_AVG AggregateFunction(AVG, Nullable(Decimal128(2)))
) ENGINE = AggregatingMergeTree()
  PARTITION BY toYear(TIME)
  ORDER BY (HOST_POOL_ID, CLUSTER_ID, HOST_ID, MAC, TIME)
  TTL TIME + INTERVAL 5 YEAR;

CREATE TABLE IF NOT EXISTS metrics.TBL_HOST_IO_STAT(
	TIME DateTime DEFAULT now(),
	HOST_POOL_ID UInt32,
	CLUSTER_ID UInt32,
	HOST_ID UInt32,
	DEV_NAME String NOT NULL,
	OP_GROUP_ID UInt32 DEFAULT 1,
	OP_GROUP_CODE String DEFAULT '00',
	UTILIZATION Decimal128(2) DEFAULT NULL,
	SIZE Decimal128(2) DEFAULT NULL,
	IO_STAT Decimal128(2) DEFAULT NULL,
	RD_STAT Decimal128(2) DEFAULT NULL,
	WR_STAT Decimal128(2) DEFAULT NULL,
	RD_REQ Decimal128(2) DEFAULT NULL COMMENT '磁盘每30秒的读请求数',
	WR_REQ Decimal128(2) DEFAULT NULL COMMENT '磁盘每30秒的写请求数',
	RD_LATENCY Decimal128(2) DEFAULT NULL,
	WR_LATENCY Decimal128(2) DEFAULT NULL,
	RD_REQ_PS Decimal128(2) DEFAULT NULL COMMENT '磁盘每秒的读请求数',
	WR_REQ_PS Decimal128(2) DEFAULT NULL COMMENT '磁盘每秒的写请求数'
) ENGINE = MergeTree()
  ORDER BY (HOST_POOL_ID, CLUSTER_ID, HOST_ID, DEV_NAME, TIME)
  TTL TIME + INTERVAL 1 DAY;

CREATE TABLE IF NOT EXISTS metrics.AGG_HOST_IO_STAT_5M(
	TIME DateTime,
	HOST_POOL_ID UInt32,
	CLUSTER_ID UInt32,
	HOST_ID UInt32,
	DEV_NAME String NOT NULL,
	OP_GROUP_ID UInt32 DEFAULT 1,
	OP_GROUP_CODE String DEFAULT '00',
	UTILIZATION_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	UTILIZATION_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	UTILIZATION_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	SIZE_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	SIZE_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	SIZE_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	IO_STAT_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	IO_STAT_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	IO_STAT_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	RD_STAT_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RD_STAT_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RD_STAT_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	WR_STAT_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	WR_STAT_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	WR_STAT_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	RD_REQ_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RD_REQ_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RD_REQ_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	WR_REQ_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	WR_REQ_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	WR_REQ_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	RD_LATENCY_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RD_LATENCY_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RD_LATENCY_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	WR_LATENCY_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	WR_LATENCY_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	WR_LATENCY_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	RD_REQ_PS_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RD_REQ_PS_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RD_REQ_PS_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	WR_REQ_PS_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	WR_REQ_PS_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	WR_REQ_PS_AVG AggregateFunction(AVG, Nullable(Decimal128(2)))
) ENGINE = AggregatingMergeTree()
  PARTITION BY toYYYYMMDD(TIME)
  ORDER BY (HOST_POOL_ID, CLUSTER_ID, HOST_ID, DEV_NAME, TIME)
  TTL TIME + INTERVAL 3 DAY;

CREATE TABLE IF NOT EXISTS metrics.AGG_HOST_IO_STAT_30M(
	TIME DateTime,
	HOST_POOL_ID UInt32,
	CLUSTER_ID UInt32,
	HOST_ID UInt32,
	DEV_NAME String NOT NULL,
	OP_GROUP_ID UInt32 DEFAULT 1,
	OP_GROUP_CODE String DEFAULT '00',
	UTILIZATION_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	UTILIZATION_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	UTILIZATION_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	SIZE_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	SIZE_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	SIZE_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	IO_STAT_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	IO_STAT_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	IO_STAT_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	RD_STAT_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RD_STAT_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RD_STAT_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	WR_STAT_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	WR_STAT_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	WR_STAT_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	RD_REQ_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RD_REQ_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RD_REQ_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	WR_REQ_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	WR_REQ_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	WR_REQ_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	RD_LATENCY_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RD_LATENCY_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RD_LATENCY_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	WR_LATENCY_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	WR_LATENCY_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	WR_LATENCY_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	RD_REQ_PS_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RD_REQ_PS_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RD_REQ_PS_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	WR_REQ_PS_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	WR_REQ_PS_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	WR_REQ_PS_AVG AggregateFunction(AVG, Nullable(Decimal128(2)))
) ENGINE = AggregatingMergeTree()
  PARTITION BY toYYYYMMDD(TIME)
  ORDER BY (HOST_POOL_ID, CLUSTER_ID, HOST_ID, DEV_NAME, TIME)
  TTL TIME + INTERVAL 7 DAY;

CREATE TABLE IF NOT EXISTS metrics.AGG_HOST_IO_STAT_1H(
	TIME DateTime,
	HOST_POOL_ID UInt32,
	CLUSTER_ID UInt32,
	HOST_ID UInt32,
	DEV_NAME String NOT NULL,
	OP_GROUP_ID UInt32 DEFAULT 1,
	OP_GROUP_CODE String DEFAULT '00',
	UTILIZATION_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	UTILIZATION_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	UTILIZATION_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	SIZE_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	SIZE_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	SIZE_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	IO_STAT_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	IO_STAT_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	IO_STAT_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	RD_STAT_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RD_STAT_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RD_STAT_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	WR_STAT_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	WR_STAT_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	WR_STAT_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	RD_REQ_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RD_REQ_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RD_REQ_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	WR_REQ_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	WR_REQ_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	WR_REQ_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	RD_LATENCY_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RD_LATENCY_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RD_LATENCY_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	WR_LATENCY_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	WR_LATENCY_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	WR_LATENCY_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	RD_REQ_PS_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RD_REQ_PS_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RD_REQ_PS_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	WR_REQ_PS_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	WR_REQ_PS_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	WR_REQ_PS_AVG AggregateFunction(AVG, Nullable(Decimal128(2)))
) ENGINE = AggregatingMergeTree()
  PARTITION BY toYYYYMMDD(TIME)
  ORDER BY (HOST_POOL_ID, CLUSTER_ID, HOST_ID, DEV_NAME, TIME)
  TTL TIME + INTERVAL 1 MONTH;

CREATE TABLE IF NOT EXISTS metrics.AGG_HOST_IO_STAT_1D(
	TIME DateTime,
	HOST_POOL_ID UInt32,
	CLUSTER_ID UInt32,
	HOST_ID UInt32,
	DEV_NAME String NOT NULL,
	OP_GROUP_ID UInt32 DEFAULT 1,
	OP_GROUP_CODE String DEFAULT '00',
	UTILIZATION_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	UTILIZATION_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	UTILIZATION_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	SIZE_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	SIZE_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	SIZE_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	IO_STAT_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	IO_STAT_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	IO_STAT_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	RD_STAT_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RD_STAT_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RD_STAT_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	WR_STAT_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	WR_STAT_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	WR_STAT_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	RD_REQ_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RD_REQ_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RD_REQ_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	WR_REQ_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	WR_REQ_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	WR_REQ_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	RD_LATENCY_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RD_LATENCY_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RD_LATENCY_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	WR_LATENCY_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	WR_LATENCY_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	WR_LATENCY_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	RD_REQ_PS_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RD_REQ_PS_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RD_REQ_PS_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	WR_REQ_PS_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	WR_REQ_PS_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	WR_REQ_PS_AVG AggregateFunction(AVG, Nullable(Decimal128(2)))
) ENGINE = AggregatingMergeTree()
  PARTITION BY toYear(TIME)
  ORDER BY (HOST_POOL_ID, CLUSTER_ID, HOST_ID, DEV_NAME, TIME)
  TTL TIME + INTERVAL 5 YEAR;

CREATE TABLE IF NOT EXISTS metrics.TBL_HOST_PARTITION_DETAIL(
	TIME DateTime DEFAULT now(),
	HOST_POOL_ID UInt32,
	CLUSTER_ID UInt32,
	HOST_ID UInt32,
	PARTITION_NAME String NOT NULL,
	PARTITION_TYPE String NOT NULL,
	MOUNTED_DIR String NOT NULL,
	OP_GROUP_ID UInt32 DEFAULT 1,
	OP_GROUP_CODE String DEFAULT '00',
	UTILIZATION Decimal128(2) DEFAULT NULL,
	SIZE Decimal128(2) DEFAULT NULL,
	USED Decimal128(2) DEFAULT NULL
) ENGINE = MergeTree()
  ORDER BY (HOST_POOL_ID, CLUSTER_ID, HOST_ID, PARTITION_NAME, TIME)
  TTL TIME + INTERVAL 1 DAY;

CREATE TABLE IF NOT EXISTS metrics.AGG_HOST_PARTITION_DETAIL_5M(
	TIME DateTime,
	HOST_POOL_ID UInt32,
	CLUSTER_ID UInt32,
	HOST_ID UInt32,
	PARTITION_NAME String NOT NULL,
	PARTITION_TYPE String NOT NULL,
	MOUNTED_DIR String NOT NULL,
	OP_GROUP_ID UInt32 DEFAULT 1,
	OP_GROUP_CODE String DEFAULT '00',
	UTILIZATION_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	UTILIZATION_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	UTILIZATION_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	SIZE_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	SIZE_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	SIZE_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	USED_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	USED_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	USED_AVG AggregateFunction(AVG, Nullable(Decimal128(2)))
) ENGINE = AggregatingMergeTree()
  PARTITION BY toYYYYMMDD(TIME)
  ORDER BY (HOST_POOL_ID, CLUSTER_ID, HOST_ID, PARTITION_NAME, TIME)
  TTL TIME + INTERVAL 3 DAY;

CREATE TABLE IF NOT EXISTS metrics.AGG_HOST_PARTITION_DETAIL_30M(
	TIME DateTime,
	HOST_POOL_ID UInt32,
	CLUSTER_ID UInt32,
	HOST_ID UInt32,
	PARTITION_NAME String NOT NULL,
	PARTITION_TYPE String NOT NULL,
	MOUNTED_DIR String NOT NULL,
	OP_GROUP_ID UInt32 DEFAULT 1,
	OP_GROUP_CODE String DEFAULT '00',
	UTILIZATION_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	UTILIZATION_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	UTILIZATION_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	SIZE_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	SIZE_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	SIZE_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	USED_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	USED_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	USED_AVG AggregateFunction(AVG, Nullable(Decimal128(2)))
) ENGINE = AggregatingMergeTree()
  PARTITION BY toYYYYMMDD(TIME)
  ORDER BY (HOST_POOL_ID, CLUSTER_ID, HOST_ID, PARTITION_NAME, TIME)
  TTL TIME + INTERVAL 7 DAY;

CREATE TABLE IF NOT EXISTS metrics.AGG_HOST_PARTITION_DETAIL_1H(
	TIME DateTime,
	HOST_POOL_ID UInt32,
	CLUSTER_ID UInt32,
	HOST_ID UInt32,
	PARTITION_NAME String NOT NULL,
	PARTITION_TYPE String NOT NULL,
	MOUNTED_DIR String NOT NULL,
	OP_GROUP_ID UInt32 DEFAULT 1,
	OP_GROUP_CODE String DEFAULT '00',
	UTILIZATION_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	UTILIZATION_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	UTILIZATION_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	SIZE_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	SIZE_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	SIZE_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	USED_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	USED_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	USED_AVG AggregateFunction(AVG, Nullable(Decimal128(2)))
) ENGINE = AggregatingMergeTree()
  PARTITION BY toYYYYMMDD(TIME)
  ORDER BY (HOST_POOL_ID, CLUSTER_ID, HOST_ID, PARTITION_NAME, TIME)
  TTL TIME + INTERVAL 1 MONTH;

CREATE TABLE IF NOT EXISTS metrics.AGG_HOST_PARTITION_DETAIL_1D(
	TIME DateTime,
	HOST_POOL_ID UInt32,
	CLUSTER_ID UInt32,
	HOST_ID UInt32,
	PARTITION_NAME String NOT NULL,
	PARTITION_TYPE String NOT NULL,
	MOUNTED_DIR String NOT NULL,
	OP_GROUP_ID UInt32 DEFAULT 1,
	OP_GROUP_CODE String DEFAULT '00',
	UTILIZATION_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	UTILIZATION_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	UTILIZATION_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	SIZE_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	SIZE_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	SIZE_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	USED_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	USED_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	USED_AVG AggregateFunction(AVG, Nullable(Decimal128(2)))
) ENGINE = AggregatingMergeTree()
  PARTITION BY toYear(TIME)
  ORDER BY (HOST_POOL_ID, CLUSTER_ID, HOST_ID, PARTITION_NAME, TIME)
  TTL TIME + INTERVAL 5 YEAR;

CREATE TABLE IF NOT EXISTS metrics.TBL_STORAGE_MULTIPATH_IO_STAT(
	TIME DateTime DEFAULT now(),
	HOST_POOL_ID UInt32,
	CLUSTER_ID UInt32,
	HOST_ID UInt32,
	DEV_NAME String NOT NULL,
	POOL_NAME String,
	NAA String,
	OP_GROUP_ID UInt32 DEFAULT 1,
	OP_GROUP_CODE String DEFAULT '00',
	IO_STAT Decimal128(2) DEFAULT NULL,
  RD_STAT Decimal128(2) DEFAULT NULL,
  WR_STAT Decimal128(2) DEFAULT NULL,
  RD_REQ Decimal128(2) DEFAULT NULL COMMENT '磁盘每30秒的读请求数',
  WR_REQ Decimal128(2) DEFAULT NULL COMMENT '磁盘每30秒的写请求数',
  RD_LATENCY Decimal128(2) DEFAULT NULL,
  WR_LATENCY Decimal128(2) DEFAULT NULL
) ENGINE = MergeTree()
  ORDER BY (HOST_POOL_ID, CLUSTER_ID, HOST_ID, DEV_NAME, TIME)
  TTL TIME + INTERVAL 1 DAY;

CREATE TABLE IF NOT EXISTS metrics.AGG_STORAGE_MULTIPATH_IO_STAT_5M(
	TIME DateTime,
	HOST_POOL_ID UInt32,
	CLUSTER_ID UInt32,
	HOST_ID UInt32,
	DEV_NAME String NOT NULL,
	POOL_NAME String,
	NAA String,
	OP_GROUP_ID UInt32 DEFAULT 1,
	OP_GROUP_CODE String DEFAULT '00',
	IO_STAT_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	IO_STAT_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	IO_STAT_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	RD_STAT_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RD_STAT_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RD_STAT_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	WR_STAT_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	WR_STAT_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	WR_STAT_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	RD_REQ_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RD_REQ_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RD_REQ_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	WR_REQ_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	WR_REQ_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	WR_REQ_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	RD_LATENCY_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RD_LATENCY_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RD_LATENCY_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	WR_LATENCY_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	WR_LATENCY_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	WR_LATENCY_AVG AggregateFunction(AVG, Nullable(Decimal128(2)))
) ENGINE = AggregatingMergeTree()
  PARTITION BY toYYYYMMDD(TIME)
  ORDER BY (HOST_POOL_ID, CLUSTER_ID, HOST_ID, DEV_NAME, TIME)
  TTL TIME + INTERVAL 3 DAY;

CREATE TABLE IF NOT EXISTS metrics.AGG_STORAGE_MULTIPATH_IO_STAT_30M(
	TIME DateTime,
	HOST_POOL_ID UInt32,
	CLUSTER_ID UInt32,
	HOST_ID UInt32,
	DEV_NAME String NOT NULL,
	POOL_NAME String,
	NAA String,
	OP_GROUP_ID UInt32 DEFAULT 1,
	OP_GROUP_CODE String DEFAULT '00',
	IO_STAT_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	IO_STAT_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	IO_STAT_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	RD_STAT_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RD_STAT_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RD_STAT_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	WR_STAT_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	WR_STAT_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	WR_STAT_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	RD_REQ_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RD_REQ_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RD_REQ_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	WR_REQ_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	WR_REQ_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	WR_REQ_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	RD_LATENCY_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RD_LATENCY_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RD_LATENCY_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	WR_LATENCY_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	WR_LATENCY_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	WR_LATENCY_AVG AggregateFunction(AVG, Nullable(Decimal128(2)))
) ENGINE = AggregatingMergeTree()
  PARTITION BY toYYYYMMDD(TIME)
  ORDER BY (HOST_POOL_ID, CLUSTER_ID, HOST_ID, DEV_NAME, TIME)
  TTL TIME + INTERVAL 7 DAY;

CREATE TABLE IF NOT EXISTS metrics.AGG_STORAGE_MULTIPATH_IO_STAT_1H(
	TIME DateTime,
	HOST_POOL_ID UInt32,
	CLUSTER_ID UInt32,
	HOST_ID UInt32,
	DEV_NAME String NOT NULL,
	POOL_NAME String,
	NAA String,
	OP_GROUP_ID UInt32 DEFAULT 1,
	OP_GROUP_CODE String DEFAULT '00',
	IO_STAT_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	IO_STAT_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	IO_STAT_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	RD_STAT_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RD_STAT_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RD_STAT_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	WR_STAT_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	WR_STAT_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	WR_STAT_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	RD_REQ_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RD_REQ_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RD_REQ_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	WR_REQ_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	WR_REQ_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	WR_REQ_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	RD_LATENCY_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RD_LATENCY_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RD_LATENCY_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	WR_LATENCY_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	WR_LATENCY_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	WR_LATENCY_AVG AggregateFunction(AVG, Nullable(Decimal128(2)))
) ENGINE = AggregatingMergeTree()
  PARTITION BY toYYYYMMDD(TIME)
  ORDER BY (HOST_POOL_ID, CLUSTER_ID, HOST_ID, DEV_NAME, TIME)
  TTL TIME + INTERVAL 1 MONTH;

CREATE TABLE IF NOT EXISTS metrics.AGG_STORAGE_MULTIPATH_IO_STAT_1D(
	TIME DateTime,
	HOST_POOL_ID UInt32,
	CLUSTER_ID UInt32,
	HOST_ID UInt32,
	DEV_NAME String NOT NULL,
	POOL_NAME String,
	NAA String,
	OP_GROUP_ID UInt32 DEFAULT 1,
	OP_GROUP_CODE String DEFAULT '00',
	IO_STAT_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	IO_STAT_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	IO_STAT_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	RD_STAT_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RD_STAT_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RD_STAT_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	WR_STAT_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	WR_STAT_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	WR_STAT_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	RD_REQ_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RD_REQ_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RD_REQ_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	WR_REQ_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	WR_REQ_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	WR_REQ_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	RD_LATENCY_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RD_LATENCY_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RD_LATENCY_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	WR_LATENCY_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	WR_LATENCY_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	WR_LATENCY_AVG AggregateFunction(AVG, Nullable(Decimal128(2)))
) ENGINE = AggregatingMergeTree()
  PARTITION BY toYear(TIME)
  ORDER BY (HOST_POOL_ID, CLUSTER_ID, HOST_ID, DEV_NAME, TIME)
  TTL TIME + INTERVAL 5 YEAR;

CREATE TABLE IF NOT EXISTS metrics.TBL_VSWITCH_FLOW(
	TIME DateTime DEFAULT now(),
	HOST_POOL_ID UInt32,
	CLUSTER_ID UInt32,
	HOST_ID UInt32,
	NAME String,
	OP_GROUP_ID UInt32 DEFAULT 1,
	OP_GROUP_CODE String DEFAULT '00',
	RX_FLOW Decimal128(2) DEFAULT NULL,
  RX_PACKETS Decimal128(2) DEFAULT NULL,
  RX_DROP Decimal128(2) DEFAULT NULL,
  RX_ERR Decimal128(2) DEFAULT NULL,
  TX_FLOW Decimal128(2) DEFAULT NULL,
  TX_PACKETS Decimal128(2) DEFAULT NULL,
  TX_DROP Decimal128(2) DEFAULT NULL,
  TX_ERR Decimal128(2) DEFAULT NULL,
	TX_ERROR_RATE Decimal128(2) DEFAULT NULL,
	RX_ERROR_RATE Decimal128(2) DEFAULT NULL,
	BANDWIDTH Decimal128(2) DEFAULT NULL
) ENGINE = MergeTree()
  ORDER BY (HOST_POOL_ID, CLUSTER_ID, HOST_ID, NAME, TIME)
  TTL TIME + INTERVAL 1 DAY;

CREATE TABLE IF NOT EXISTS metrics.AGG_VSWITCH_FLOW_5M(
	TIME DateTime,
	HOST_POOL_ID UInt32,
	CLUSTER_ID UInt32,
	HOST_ID UInt32,
	NAME String,
	OP_GROUP_ID UInt32 DEFAULT 1,
	OP_GROUP_CODE String DEFAULT '00',
	RX_FLOW_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RX_FLOW_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RX_FLOW_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	RX_PACKETS_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RX_PACKETS_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RX_PACKETS_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	RX_DROP_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RX_DROP_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RX_DROP_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	RX_ERR_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RX_ERR_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RX_ERR_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	TX_FLOW_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	TX_FLOW_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	TX_FLOW_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	TX_PACKETS_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	TX_PACKETS_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	TX_PACKETS_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	TX_DROP_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	TX_DROP_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	TX_DROP_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	TX_ERR_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	TX_ERR_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	TX_ERR_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	TX_ERROR_RATE_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	TX_ERROR_RATE_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	TX_ERROR_RATE_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	RX_ERROR_RATE_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RX_ERROR_RATE_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RX_ERROR_RATE_AVG AggregateFunction(AVG, Nullable(Decimal128(2)))
) ENGINE = AggregatingMergeTree()
  PARTITION BY toYYYYMMDD(TIME)
  ORDER BY (HOST_POOL_ID, CLUSTER_ID, HOST_ID, NAME, TIME)
  TTL TIME + INTERVAL 3 DAY;

CREATE TABLE IF NOT EXISTS metrics.AGG_VSWITCH_FLOW_30M(
	TIME DateTime,
	HOST_POOL_ID UInt32,
	CLUSTER_ID UInt32,
	HOST_ID UInt32,
	NAME String,
	OP_GROUP_ID UInt32 DEFAULT 1,
	OP_GROUP_CODE String DEFAULT '00',
	RX_FLOW_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RX_FLOW_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RX_FLOW_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	RX_PACKETS_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RX_PACKETS_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RX_PACKETS_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	RX_DROP_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RX_DROP_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RX_DROP_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	RX_ERR_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RX_ERR_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RX_ERR_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	TX_FLOW_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	TX_FLOW_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	TX_FLOW_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	TX_PACKETS_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	TX_PACKETS_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	TX_PACKETS_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	TX_DROP_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	TX_DROP_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	TX_DROP_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	TX_ERR_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	TX_ERR_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	TX_ERR_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	TX_ERROR_RATE_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	TX_ERROR_RATE_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	TX_ERROR_RATE_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	RX_ERROR_RATE_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RX_ERROR_RATE_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RX_ERROR_RATE_AVG AggregateFunction(AVG, Nullable(Decimal128(2)))
) ENGINE = AggregatingMergeTree()
  PARTITION BY toYYYYMMDD(TIME)
  ORDER BY (HOST_POOL_ID, CLUSTER_ID, HOST_ID, NAME, TIME)
  TTL TIME + INTERVAL 7 DAY;

CREATE TABLE IF NOT EXISTS metrics.AGG_VSWITCH_FLOW_1H(
	TIME DateTime,
	HOST_POOL_ID UInt32,
	CLUSTER_ID UInt32,
	HOST_ID UInt32,
	NAME String,
	OP_GROUP_ID UInt32 DEFAULT 1,
	OP_GROUP_CODE String DEFAULT '00',
	RX_FLOW_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RX_FLOW_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RX_FLOW_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	RX_PACKETS_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RX_PACKETS_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RX_PACKETS_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	RX_DROP_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RX_DROP_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RX_DROP_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	RX_ERR_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RX_ERR_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RX_ERR_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	TX_FLOW_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	TX_FLOW_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	TX_FLOW_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	TX_PACKETS_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	TX_PACKETS_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	TX_PACKETS_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	TX_DROP_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	TX_DROP_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	TX_DROP_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	TX_ERR_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	TX_ERR_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	TX_ERR_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	TX_ERROR_RATE_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	TX_ERROR_RATE_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	TX_ERROR_RATE_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	RX_ERROR_RATE_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RX_ERROR_RATE_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RX_ERROR_RATE_AVG AggregateFunction(AVG, Nullable(Decimal128(2)))
) ENGINE = AggregatingMergeTree()
  PARTITION BY toYYYYMMDD(TIME)
  ORDER BY (HOST_POOL_ID, CLUSTER_ID, HOST_ID, NAME, TIME)
  TTL TIME + INTERVAL 1 MONTH;

CREATE TABLE IF NOT EXISTS metrics.AGG_VSWITCH_FLOW_1D(
	TIME DateTime,
	HOST_POOL_ID UInt32,
	CLUSTER_ID UInt32,
	HOST_ID UInt32,
	NAME String,
	OP_GROUP_ID UInt32 DEFAULT 1,
	OP_GROUP_CODE String DEFAULT '00',
	RX_FLOW_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RX_FLOW_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RX_FLOW_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	RX_PACKETS_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RX_PACKETS_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RX_PACKETS_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	RX_DROP_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RX_DROP_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RX_DROP_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	RX_ERR_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RX_ERR_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RX_ERR_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	TX_FLOW_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	TX_FLOW_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	TX_FLOW_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	TX_PACKETS_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	TX_PACKETS_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	TX_PACKETS_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	TX_DROP_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	TX_DROP_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	TX_DROP_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	TX_ERR_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	TX_ERR_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	TX_ERR_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	TX_ERROR_RATE_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	TX_ERROR_RATE_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	TX_ERROR_RATE_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	RX_ERROR_RATE_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RX_ERROR_RATE_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RX_ERROR_RATE_AVG AggregateFunction(AVG, Nullable(Decimal128(2)))
) ENGINE = AggregatingMergeTree()
  PARTITION BY toYear(TIME)
  ORDER BY (HOST_POOL_ID, CLUSTER_ID, HOST_ID, NAME, TIME)
  TTL TIME + INTERVAL 5 YEAR;

CREATE TABLE IF NOT EXISTS metrics.TBL_DOMAIN_CPU_DETAIL(
	TIME DateTime DEFAULT now(),
	HOST_POOL_ID UInt32,
	CLUSTER_ID UInt32,
	HOST_ID UInt32,
	DOMAIN_ID UInt32,
	OP_GROUP_ID UInt32 DEFAULT 1,
	OP_GROUP_CODE String DEFAULT '00',
	CPU_RATE Decimal128(2) DEFAULT NULL,
	CPU_READY Decimal128(2) DEFAULT NULL,
  CPU_USAGE_MHZ Decimal128(2) DEFAULT NULL COMMENT '虚拟CPU使用的频率数，单位MHZ',
  MEMORY Decimal128(2) DEFAULT NULL
) ENGINE = MergeTree()
  ORDER BY (HOST_POOL_ID, CLUSTER_ID, HOST_ID, DOMAIN_ID, TIME)
  TTL TIME + INTERVAL 1 DAY;

CREATE TABLE IF NOT EXISTS metrics.AGG_DOMAIN_CPU_DETAIL_5M(
	TIME DateTime,
	HOST_POOL_ID UInt32,
	CLUSTER_ID UInt32,
	HOST_ID UInt32,
	DOMAIN_ID UInt32,
	OP_GROUP_ID UInt32 DEFAULT 1,
	OP_GROUP_CODE String DEFAULT '00',
	CPU_RATE_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	CPU_RATE_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	CPU_RATE_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	CPU_READY_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	CPU_READY_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	CPU_READY_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	CPU_USAGE_MHZ_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	CPU_USAGE_MHZ_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	CPU_USAGE_MHZ_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	MEMORY_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	MEMORY_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	MEMORY_AVG AggregateFunction(AVG, Nullable(Decimal128(2)))
) ENGINE = AggregatingMergeTree()
PARTITION BY toYYYYMMDD(TIME)
ORDER BY (HOST_POOL_ID, CLUSTER_ID, HOST_ID, DOMAIN_ID, TIME)
TTL TIME + INTERVAL 3 DAY;

CREATE TABLE IF NOT EXISTS metrics.AGG_DOMAIN_CPU_DETAIL_30M(
	TIME DateTime,
	HOST_POOL_ID UInt32,
	CLUSTER_ID UInt32,
	HOST_ID UInt32,
	DOMAIN_ID UInt32,
	OP_GROUP_ID UInt32 DEFAULT 1,
	OP_GROUP_CODE String DEFAULT '00',
	CPU_RATE_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	CPU_RATE_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	CPU_RATE_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	CPU_READY_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	CPU_READY_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	CPU_READY_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	CPU_USAGE_MHZ_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	CPU_USAGE_MHZ_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	CPU_USAGE_MHZ_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	MEMORY_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	MEMORY_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	MEMORY_AVG AggregateFunction(AVG, Nullable(Decimal128(2)))
) ENGINE = AggregatingMergeTree()
PARTITION BY toYYYYMMDD(TIME)
ORDER BY (HOST_POOL_ID, CLUSTER_ID, HOST_ID, DOMAIN_ID, TIME)
TTL TIME + INTERVAL 7 DAY;

CREATE TABLE IF NOT EXISTS metrics.AGG_DOMAIN_CPU_DETAIL_1H(
	TIME DateTime,
	HOST_POOL_ID UInt32,
	CLUSTER_ID UInt32,
	HOST_ID UInt32,
	DOMAIN_ID UInt32,
	OP_GROUP_ID UInt32 DEFAULT 1,
	OP_GROUP_CODE String DEFAULT '00',
	CPU_RATE_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	CPU_RATE_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	CPU_RATE_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	CPU_READY_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	CPU_READY_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	CPU_READY_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	CPU_USAGE_MHZ_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	CPU_USAGE_MHZ_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	CPU_USAGE_MHZ_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	MEMORY_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	MEMORY_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	MEMORY_AVG AggregateFunction(AVG, Nullable(Decimal128(2)))
) ENGINE = AggregatingMergeTree()
PARTITION BY toYYYYMMDD(TIME)
ORDER BY (HOST_POOL_ID, CLUSTER_ID, HOST_ID, DOMAIN_ID, TIME)
TTL TIME + INTERVAL 1 MONTH;

CREATE TABLE IF NOT EXISTS metrics.AGG_DOMAIN_CPU_DETAIL_1D(
	TIME DateTime,
	HOST_POOL_ID UInt32,
	CLUSTER_ID UInt32,
	HOST_ID UInt32,
	DOMAIN_ID UInt32,
	OP_GROUP_ID UInt32 DEFAULT 1,
	OP_GROUP_CODE String DEFAULT '00',
	CPU_RATE_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	CPU_RATE_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	CPU_RATE_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	CPU_READY_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	CPU_READY_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	CPU_READY_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	CPU_USAGE_MHZ_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	CPU_USAGE_MHZ_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	CPU_USAGE_MHZ_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	MEMORY_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	MEMORY_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	MEMORY_AVG AggregateFunction(AVG, Nullable(Decimal128(2)))
) ENGINE = AggregatingMergeTree()
PARTITION BY toYear(TIME)
ORDER BY (HOST_POOL_ID, CLUSTER_ID, HOST_ID, DOMAIN_ID, TIME)
TTL TIME + INTERVAL 5 YEAR;

CREATE TABLE IF NOT EXISTS metrics.TBL_DOMAIN_FLOW_LINK_STAT(
	TIME DateTime DEFAULT now(),
	HOST_POOL_ID UInt32,
	CLUSTER_ID UInt32,
	HOST_ID UInt32,
	DOMAIN_ID UInt32,
	OP_GROUP_ID UInt32 DEFAULT 1,
	OP_GROUP_CODE String DEFAULT '00',
	FLOW_LINK Decimal128(2) DEFAULT NULL
) ENGINE = MergeTree()
  ORDER BY (HOST_POOL_ID, CLUSTER_ID, HOST_ID, DOMAIN_ID, TIME)
  TTL TIME + INTERVAL 1 DAY;

CREATE TABLE IF NOT EXISTS metrics.AGG_DOMAIN_FLOW_LINK_STAT_5M(
	TIME DateTime,
	HOST_POOL_ID UInt32,
	CLUSTER_ID UInt32,
	HOST_ID UInt32,
	DOMAIN_ID UInt32,
	OP_GROUP_ID UInt32 DEFAULT 1,
	OP_GROUP_CODE String DEFAULT '00',
	FLOW_LINK_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	FLOW_LINK_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	FLOW_LINK_AVG AggregateFunction(AVG, Nullable(Decimal128(2)))
) ENGINE = AggregatingMergeTree()
PARTITION BY toYYYYMMDD(TIME)
ORDER BY (HOST_POOL_ID, CLUSTER_ID, HOST_ID, DOMAIN_ID, TIME)
TTL TIME + INTERVAL 3 DAY;

CREATE TABLE IF NOT EXISTS metrics.AGG_DOMAIN_FLOW_LINK_STAT_30M(
	TIME DateTime,
	HOST_POOL_ID UInt32,
	CLUSTER_ID UInt32,
	HOST_ID UInt32,
	DOMAIN_ID UInt32,
	OP_GROUP_ID UInt32 DEFAULT 1,
	OP_GROUP_CODE String DEFAULT '00',
	FLOW_LINK_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	FLOW_LINK_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	FLOW_LINK_AVG AggregateFunction(AVG, Nullable(Decimal128(2)))
) ENGINE = AggregatingMergeTree()
PARTITION BY toYYYYMMDD(TIME)
ORDER BY (HOST_POOL_ID, CLUSTER_ID, HOST_ID, DOMAIN_ID, TIME)
TTL TIME + INTERVAL 7 DAY;

CREATE TABLE IF NOT EXISTS metrics.AGG_DOMAIN_FLOW_LINK_STAT_1H(
	TIME DateTime,
	HOST_POOL_ID UInt32,
	CLUSTER_ID UInt32,
	HOST_ID UInt32,
	DOMAIN_ID UInt32,
	OP_GROUP_ID UInt32 DEFAULT 1,
	OP_GROUP_CODE String DEFAULT '00',
	FLOW_LINK_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	FLOW_LINK_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	FLOW_LINK_AVG AggregateFunction(AVG, Nullable(Decimal128(2)))
) ENGINE = AggregatingMergeTree()
PARTITION BY toYYYYMMDD(TIME)
ORDER BY (HOST_POOL_ID, CLUSTER_ID, HOST_ID, DOMAIN_ID, TIME)
TTL TIME + INTERVAL 1 MONTH;

CREATE TABLE IF NOT EXISTS metrics.AGG_DOMAIN_FLOW_LINK_STAT_1D(
	TIME DateTime,
	HOST_POOL_ID UInt32,
	CLUSTER_ID UInt32,
	HOST_ID UInt32,
	DOMAIN_ID UInt32,
	OP_GROUP_ID UInt32 DEFAULT 1,
	OP_GROUP_CODE String DEFAULT '00',
	FLOW_LINK_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	FLOW_LINK_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	FLOW_LINK_AVG AggregateFunction(AVG, Nullable(Decimal128(2)))
) ENGINE = AggregatingMergeTree()
PARTITION BY toYear(TIME)
ORDER BY (HOST_POOL_ID, CLUSTER_ID, HOST_ID, DOMAIN_ID, TIME)
TTL TIME + INTERVAL 5 YEAR;

CREATE TABLE IF NOT EXISTS metrics.TBL_DOMAIN_IO_STAT(
	TIME DateTime DEFAULT now(),
	HOST_POOL_ID UInt32,
	CLUSTER_ID UInt32,
	HOST_ID UInt32,
	DOMAIN_ID UInt32,
	DEV_NAME String NOT NULL,
	OP_GROUP_ID UInt32 DEFAULT 1,
	OP_GROUP_CODE String DEFAULT '00',
	UTILIZATION Decimal128(2) DEFAULT NULL,
  SIZE Decimal128(2) DEFAULT NULL,
  IO_STAT Decimal128(2) DEFAULT NULL,
  RD_STAT Decimal128(2) DEFAULT NULL,
  WR_STAT Decimal128(2) DEFAULT NULL,
  RD_REQ Decimal128(2) DEFAULT NULL COMMENT '磁盘每30秒的读请求数',
  WR_REQ Decimal128(2) DEFAULT NULL COMMENT '磁盘每30秒的写请求数',
  RD_REQ_PS Decimal128(2) DEFAULT NULL COMMENT '磁盘每秒的读请求数',
  WR_REQ_PS Decimal128(2) DEFAULT NULL COMMENT '磁盘每秒的写请求数',
  RD_LATENCY Decimal128(2) DEFAULT NULL COMMENT '磁盘读延迟，单位ms',
  WR_LATENCY Decimal128(2) DEFAULT NULL COMMENT '磁盘写延迟，单位ms'
) ENGINE = MergeTree()
  ORDER BY (HOST_POOL_ID, CLUSTER_ID, HOST_ID, DOMAIN_ID, DEV_NAME, TIME)
  TTL TIME + INTERVAL 1 DAY;

CREATE TABLE IF NOT EXISTS metrics.AGG_DOMAIN_IO_STAT_5M(
	TIME DateTime,
	HOST_POOL_ID UInt32,
	CLUSTER_ID UInt32,
	HOST_ID UInt32,
	DOMAIN_ID UInt32,
	DEV_NAME String NOT NULL,
	OP_GROUP_ID UInt32 DEFAULT 1,
	OP_GROUP_CODE String DEFAULT '00',
	UTILIZATION_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	UTILIZATION_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	UTILIZATION_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	SIZE_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	SIZE_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	SIZE_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	IO_STAT_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	IO_STAT_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	IO_STAT_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	RD_STAT_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RD_STAT_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RD_STAT_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	WR_STAT_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	WR_STAT_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	WR_STAT_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	RD_REQ_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RD_REQ_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RD_REQ_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	WR_REQ_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	WR_REQ_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	WR_REQ_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	RD_REQ_PS_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RD_REQ_PS_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RD_REQ_PS_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	WR_REQ_PS_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	WR_REQ_PS_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	WR_REQ_PS_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	RD_LATENCY_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RD_LATENCY_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RD_LATENCY_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	WR_LATENCY_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	WR_LATENCY_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	WR_LATENCY_AVG AggregateFunction(AVG, Nullable(Decimal128(2)))
) ENGINE = AggregatingMergeTree()
PARTITION BY toYYYYMMDD(TIME)
ORDER BY (HOST_POOL_ID, CLUSTER_ID, HOST_ID, DOMAIN_ID, DEV_NAME, TIME)
TTL TIME + INTERVAL 3 DAY;

CREATE TABLE IF NOT EXISTS metrics.AGG_DOMAIN_IO_STAT_30M(
	TIME DateTime,
	HOST_POOL_ID UInt32,
	CLUSTER_ID UInt32,
	HOST_ID UInt32,
	DOMAIN_ID UInt32,
	DEV_NAME String NOT NULL,
	OP_GROUP_ID UInt32 DEFAULT 1,
	OP_GROUP_CODE String DEFAULT '00',
	UTILIZATION_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	UTILIZATION_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	UTILIZATION_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	SIZE_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	SIZE_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	SIZE_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	IO_STAT_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	IO_STAT_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	IO_STAT_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	RD_STAT_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RD_STAT_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RD_STAT_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	WR_STAT_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	WR_STAT_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	WR_STAT_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	RD_REQ_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RD_REQ_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RD_REQ_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	WR_REQ_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	WR_REQ_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	WR_REQ_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	RD_REQ_PS_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RD_REQ_PS_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RD_REQ_PS_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	WR_REQ_PS_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	WR_REQ_PS_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	WR_REQ_PS_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	RD_LATENCY_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RD_LATENCY_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RD_LATENCY_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	WR_LATENCY_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	WR_LATENCY_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	WR_LATENCY_AVG AggregateFunction(AVG, Nullable(Decimal128(2)))
) ENGINE = AggregatingMergeTree()
PARTITION BY toYYYYMMDD(TIME)
ORDER BY (HOST_POOL_ID, CLUSTER_ID, HOST_ID, DOMAIN_ID, DEV_NAME, TIME)
TTL TIME + INTERVAL 7 DAY;

CREATE TABLE IF NOT EXISTS metrics.AGG_DOMAIN_IO_STAT_1H(
	TIME DateTime,
	HOST_POOL_ID UInt32,
	CLUSTER_ID UInt32,
	HOST_ID UInt32,
	DOMAIN_ID UInt32,
	DEV_NAME String NOT NULL,
	OP_GROUP_ID UInt32 DEFAULT 1,
	OP_GROUP_CODE String DEFAULT '00',
	UTILIZATION_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	UTILIZATION_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	UTILIZATION_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	SIZE_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	SIZE_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	SIZE_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	IO_STAT_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	IO_STAT_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	IO_STAT_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	RD_STAT_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RD_STAT_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RD_STAT_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	WR_STAT_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	WR_STAT_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	WR_STAT_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	RD_REQ_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RD_REQ_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RD_REQ_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	WR_REQ_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	WR_REQ_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	WR_REQ_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	RD_REQ_PS_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RD_REQ_PS_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RD_REQ_PS_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	WR_REQ_PS_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	WR_REQ_PS_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	WR_REQ_PS_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	RD_LATENCY_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RD_LATENCY_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RD_LATENCY_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	WR_LATENCY_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	WR_LATENCY_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	WR_LATENCY_AVG AggregateFunction(AVG, Nullable(Decimal128(2)))
) ENGINE = AggregatingMergeTree()
PARTITION BY toYYYYMMDD(TIME)
ORDER BY (HOST_POOL_ID, CLUSTER_ID, HOST_ID, DOMAIN_ID, DEV_NAME, TIME)
TTL TIME + INTERVAL 1 MONTH;

CREATE TABLE IF NOT EXISTS metrics.AGG_DOMAIN_IO_STAT_1D(
	TIME DateTime,
	HOST_POOL_ID UInt32,
	CLUSTER_ID UInt32,
	HOST_ID UInt32,
	DOMAIN_ID UInt32,
	DEV_NAME String NOT NULL,
	OP_GROUP_ID UInt32 DEFAULT 1,
	OP_GROUP_CODE String DEFAULT '00',
	UTILIZATION_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	UTILIZATION_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	UTILIZATION_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	SIZE_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	SIZE_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	SIZE_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	IO_STAT_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	IO_STAT_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	IO_STAT_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	RD_STAT_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RD_STAT_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RD_STAT_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	WR_STAT_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	WR_STAT_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	WR_STAT_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	RD_REQ_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RD_REQ_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RD_REQ_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	WR_REQ_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	WR_REQ_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	WR_REQ_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	RD_REQ_PS_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RD_REQ_PS_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RD_REQ_PS_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	WR_REQ_PS_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	WR_REQ_PS_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	WR_REQ_PS_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	RD_LATENCY_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RD_LATENCY_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RD_LATENCY_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	WR_LATENCY_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	WR_LATENCY_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	WR_LATENCY_AVG AggregateFunction(AVG, Nullable(Decimal128(2)))
) ENGINE = AggregatingMergeTree()
PARTITION BY toYear(TIME)
ORDER BY (HOST_POOL_ID, CLUSTER_ID, HOST_ID, DOMAIN_ID, DEV_NAME, TIME)
TTL TIME + INTERVAL 5 YEAR;

CREATE TABLE IF NOT EXISTS metrics.TBL_DOMAIN_GPU_STAT(
	TIME DateTime DEFAULT now(),
	HOST_POOL_ID UInt32,
	CLUSTER_ID UInt32,
	HOST_ID UInt32,
	DOMAIN_ID UInt32,
	UUID_PCI String NOT NULL COMMENT '虚拟机挂载的GPU PCI或者虚拟机挂载的VGPU UUID',
	OP_GROUP_ID UInt32 DEFAULT 1,
	OP_GROUP_CODE String DEFAULT '00',
	UTILIZATION Decimal128(2) DEFAULT NULL COMMENT 'GPU/VGPU使用率',
  MEMORY_USE Decimal128(2) DEFAULT NULL COMMENT 'GPU/VGPU内存使用率',
  CODE_RATE Decimal128(2) DEFAULT NULL COMMENT 'GPU/VGPU编码率',
  DECODE_RATE Decimal128(2) DEFAULT NULL COMMENT 'GPU/VGPU解码率'
) ENGINE = MergeTree()
  ORDER BY (HOST_POOL_ID, CLUSTER_ID, HOST_ID, DOMAIN_ID, UUID_PCI, TIME)
  TTL TIME + INTERVAL 1 DAY;

CREATE TABLE IF NOT EXISTS metrics.AGG_DOMAIN_GPU_STAT_5M(
	TIME DateTime,
	HOST_POOL_ID UInt32,
	CLUSTER_ID UInt32,
	HOST_ID UInt32,
	DOMAIN_ID UInt32,
	UUID_PCI String NOT NULL COMMENT '虚拟机挂载的GPU PCI或者虚拟机挂载的VGPU UUID',
	OP_GROUP_ID UInt32 DEFAULT 1,
	OP_GROUP_CODE String DEFAULT '00',
	UTILIZATION_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	UTILIZATION_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	UTILIZATION_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	MEMORY_USE_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	MEMORY_USE_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	MEMORY_USE_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	CODE_RATE_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	CODE_RATE_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	CODE_RATE_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	DECODE_RATE_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	DECODE_RATE_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	DECODE_RATE_AVG AggregateFunction(AVG, Nullable(Decimal128(2)))
) ENGINE = AggregatingMergeTree()
PARTITION BY toYYYYMMDD(TIME)
ORDER BY (HOST_POOL_ID, CLUSTER_ID, HOST_ID, DOMAIN_ID, UUID_PCI, TIME)
TTL TIME + INTERVAL 3 DAY;

CREATE TABLE IF NOT EXISTS metrics.AGG_DOMAIN_GPU_STAT_30M(
	TIME DateTime,
	HOST_POOL_ID UInt32,
	CLUSTER_ID UInt32,
	HOST_ID UInt32,
	DOMAIN_ID UInt32,
	UUID_PCI String NOT NULL COMMENT '虚拟机挂载的GPU PCI或者虚拟机挂载的VGPU UUID',
	OP_GROUP_ID UInt32 DEFAULT 1,
	OP_GROUP_CODE String DEFAULT '00',
	UTILIZATION_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	UTILIZATION_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	UTILIZATION_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	MEMORY_USE_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	MEMORY_USE_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	MEMORY_USE_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	CODE_RATE_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	CODE_RATE_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	CODE_RATE_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	DECODE_RATE_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	DECODE_RATE_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	DECODE_RATE_AVG AggregateFunction(AVG, Nullable(Decimal128(2)))
) ENGINE = AggregatingMergeTree()
PARTITION BY toYYYYMMDD(TIME)
ORDER BY (HOST_POOL_ID, CLUSTER_ID, HOST_ID, DOMAIN_ID, UUID_PCI, TIME)
TTL TIME + INTERVAL 7 DAY;

CREATE TABLE IF NOT EXISTS metrics.AGG_DOMAIN_GPU_STAT_1H(
	TIME DateTime,
	HOST_POOL_ID UInt32,
	CLUSTER_ID UInt32,
	HOST_ID UInt32,
	DOMAIN_ID UInt32,
	UUID_PCI String NOT NULL COMMENT '虚拟机挂载的GPU PCI或者虚拟机挂载的VGPU UUID',
	OP_GROUP_ID UInt32 DEFAULT 1,
	OP_GROUP_CODE String DEFAULT '00',
	UTILIZATION_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	UTILIZATION_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	UTILIZATION_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	MEMORY_USE_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	MEMORY_USE_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	MEMORY_USE_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	CODE_RATE_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	CODE_RATE_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	CODE_RATE_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	DECODE_RATE_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	DECODE_RATE_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	DECODE_RATE_AVG AggregateFunction(AVG, Nullable(Decimal128(2)))
) ENGINE = AggregatingMergeTree()
PARTITION BY toYYYYMMDD(TIME)
ORDER BY (HOST_POOL_ID, CLUSTER_ID, HOST_ID, DOMAIN_ID, UUID_PCI, TIME)
TTL TIME + INTERVAL 1 MONTH;

CREATE TABLE IF NOT EXISTS metrics.AGG_DOMAIN_GPU_STAT_1D(
	TIME DateTime,
	HOST_POOL_ID UInt32,
	CLUSTER_ID UInt32,
	HOST_ID UInt32,
	DOMAIN_ID UInt32,
	UUID_PCI String NOT NULL COMMENT '虚拟机挂载的GPU PCI或者虚拟机挂载的VGPU UUID',
	OP_GROUP_ID UInt32 DEFAULT 1,
	OP_GROUP_CODE String DEFAULT '00',
	UTILIZATION_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	UTILIZATION_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	UTILIZATION_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	MEMORY_USE_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	MEMORY_USE_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	MEMORY_USE_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	CODE_RATE_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	CODE_RATE_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	CODE_RATE_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	DECODE_RATE_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	DECODE_RATE_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	DECODE_RATE_AVG AggregateFunction(AVG, Nullable(Decimal128(2)))
) ENGINE = AggregatingMergeTree()
PARTITION BY toYear(TIME)
ORDER BY (HOST_POOL_ID, CLUSTER_ID, HOST_ID, DOMAIN_ID, UUID_PCI, TIME)
TTL TIME + INTERVAL 5 YEAR;

CREATE TABLE IF NOT EXISTS metrics.TBL_DOMAIN_PARTITION_DETAIL(
	TIME DateTime DEFAULT now(),
	HOST_POOL_ID UInt32,
	CLUSTER_ID UInt32,
	HOST_ID UInt32,
	DOMAIN_ID UInt32,
	PARTITION_NAME String NOT NULL,
	PARTITION_TYPE String NOT NULL,
	OP_GROUP_ID UInt32 DEFAULT 1,
	OP_GROUP_CODE String DEFAULT '00',
  UTILIZATION Decimal128(2) DEFAULT NULL,
  SIZE Decimal128(2) DEFAULT NULL,
  USED Decimal128(2) DEFAULT NULL
) ENGINE = MergeTree()
  ORDER BY (HOST_POOL_ID, CLUSTER_ID, HOST_ID, DOMAIN_ID, PARTITION_NAME, TIME)
  TTL TIME + INTERVAL 1 DAY;

CREATE TABLE IF NOT EXISTS metrics.AGG_DOMAIN_PARTITION_DETAIL_5M(
	TIME DateTime,
	HOST_POOL_ID UInt32,
	CLUSTER_ID UInt32,
	HOST_ID UInt32,
	DOMAIN_ID UInt32,
	PARTITION_NAME String NOT NULL,
	PARTITION_TYPE String NOT NULL,
	OP_GROUP_ID UInt32 DEFAULT 1,
	OP_GROUP_CODE String DEFAULT '00',
	UTILIZATION_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	UTILIZATION_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	UTILIZATION_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	SIZE_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	SIZE_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	SIZE_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	USED_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	USED_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	USED_AVG AggregateFunction(AVG, Nullable(Decimal128(2)))
) ENGINE = AggregatingMergeTree()
PARTITION BY toYYYYMMDD(TIME)
ORDER BY (HOST_POOL_ID, CLUSTER_ID, HOST_ID, DOMAIN_ID, PARTITION_NAME, TIME)
TTL TIME + INTERVAL 3 DAY;

CREATE TABLE IF NOT EXISTS metrics.AGG_DOMAIN_PARTITION_DETAIL_30M(
	TIME DateTime,
	HOST_POOL_ID UInt32,
	CLUSTER_ID UInt32,
	HOST_ID UInt32,
	DOMAIN_ID UInt32,
	PARTITION_NAME String NOT NULL,
	PARTITION_TYPE String NOT NULL,
	OP_GROUP_ID UInt32 DEFAULT 1,
	OP_GROUP_CODE String DEFAULT '00',
	UTILIZATION_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	UTILIZATION_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	UTILIZATION_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	SIZE_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	SIZE_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	SIZE_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	USED_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	USED_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	USED_AVG AggregateFunction(AVG, Nullable(Decimal128(2)))
) ENGINE = AggregatingMergeTree()
PARTITION BY toYYYYMMDD(TIME)
ORDER BY (HOST_POOL_ID, CLUSTER_ID, HOST_ID, DOMAIN_ID, PARTITION_NAME, TIME)
TTL TIME + INTERVAL 7 DAY;

CREATE TABLE IF NOT EXISTS metrics.AGG_DOMAIN_PARTITION_DETAIL_1H(
	TIME DateTime,
	HOST_POOL_ID UInt32,
	CLUSTER_ID UInt32,
	HOST_ID UInt32,
	DOMAIN_ID UInt32,
	PARTITION_NAME String NOT NULL,
	PARTITION_TYPE String NOT NULL,
	OP_GROUP_ID UInt32 DEFAULT 1,
	OP_GROUP_CODE String DEFAULT '00',
	UTILIZATION_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	UTILIZATION_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	UTILIZATION_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	SIZE_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	SIZE_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	SIZE_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	USED_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	USED_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	USED_AVG AggregateFunction(AVG, Nullable(Decimal128(2)))
) ENGINE = AggregatingMergeTree()
PARTITION BY toYYYYMMDD(TIME)
ORDER BY (HOST_POOL_ID, CLUSTER_ID, HOST_ID, DOMAIN_ID, PARTITION_NAME, TIME)
TTL TIME + INTERVAL 1 MONTH;

CREATE TABLE IF NOT EXISTS metrics.AGG_DOMAIN_PARTITION_DETAIL_1D(
	TIME DateTime,
	HOST_POOL_ID UInt32,
	CLUSTER_ID UInt32,
	HOST_ID UInt32,
	DOMAIN_ID UInt32,
	PARTITION_NAME String NOT NULL,
	PARTITION_TYPE String NOT NULL,
	OP_GROUP_ID UInt32 DEFAULT 1,
	OP_GROUP_CODE String DEFAULT '00',
	UTILIZATION_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	UTILIZATION_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	UTILIZATION_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	SIZE_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	SIZE_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	SIZE_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	USED_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	USED_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	USED_AVG AggregateFunction(AVG, Nullable(Decimal128(2)))
) ENGINE = AggregatingMergeTree()
PARTITION BY toYear(TIME)
ORDER BY (HOST_POOL_ID, CLUSTER_ID, HOST_ID, DOMAIN_ID, PARTITION_NAME, TIME)
TTL TIME + INTERVAL 5 YEAR;

CREATE TABLE IF NOT EXISTS metrics.TBL_VSWITCH_PORT_FLOW(
	TIME DateTime DEFAULT now(),
	HOST_POOL_ID UInt32,
	CLUSTER_ID UInt32,
	HOST_ID UInt32,
	DOMAIN_ID UInt32,
	VSWITCH_NAME String,
	VSWITCH_ID UInt32,
	VPORT String NOT NULL,
	MAC String,
	OP_GROUP_ID UInt32 DEFAULT 1,
	OP_GROUP_CODE String DEFAULT '00',
  RX_FLOW Decimal128(2) DEFAULT NULL,
  RX_PACKETS Decimal128(2) DEFAULT NULL,
  RX_ERR Decimal128(2) DEFAULT NULL,
  TX_FLOW Decimal128(2) DEFAULT NULL,
  TX_PACKETS Decimal128(2) DEFAULT NULL,
  TX_ERR Decimal128(2) DEFAULT NULL,
  RX_DROPPED_PACKETS Decimal128(2) DEFAULT NULL,
  TX_DROPPED_PACKETS Decimal128(2) DEFAULT NULL,
  RX_BYTES Decimal128(2) DEFAULT NULL,
  TX_BYTES Decimal128(2) DEFAULT NULL
) ENGINE = MergeTree()
  ORDER BY (HOST_POOL_ID, CLUSTER_ID, HOST_ID, DOMAIN_ID, MAC, VSWITCH_ID, TIME)
  TTL TIME + INTERVAL 1 DAY;

CREATE TABLE IF NOT EXISTS metrics.AGG_VSWITCH_PORT_FLOW_5M(
	TIME DateTime,
	HOST_POOL_ID UInt32,
	CLUSTER_ID UInt32,
	HOST_ID UInt32,
	DOMAIN_ID UInt32,
	VSWITCH_NAME String,
	VSWITCH_ID UInt32,
	VPORT String NOT NULL,
	MAC String,
	OP_GROUP_ID UInt32 DEFAULT 1,
	OP_GROUP_CODE String DEFAULT '00',
	RX_FLOW_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RX_FLOW_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RX_FLOW_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	RX_PACKETS_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RX_PACKETS_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RX_PACKETS_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	RX_ERR_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RX_ERR_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RX_ERR_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	TX_FLOW_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	TX_FLOW_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	TX_FLOW_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	TX_PACKETS_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	TX_PACKETS_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	TX_PACKETS_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	TX_ERR_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	TX_ERR_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	TX_ERR_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	RX_DROPPED_PACKETS_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RX_DROPPED_PACKETS_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RX_DROPPED_PACKETS_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	TX_DROPPED_PACKETS_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	TX_DROPPED_PACKETS_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	TX_DROPPED_PACKETS_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	RX_BYTES_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RX_BYTES_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RX_BYTES_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	TX_BYTES_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	TX_BYTES_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	TX_BYTES_AVG AggregateFunction(AVG, Nullable(Decimal128(2)))
) ENGINE = AggregatingMergeTree()
PARTITION BY toYYYYMMDD(TIME)
ORDER BY (HOST_POOL_ID, CLUSTER_ID, HOST_ID, DOMAIN_ID, MAC, TIME)
TTL TIME + INTERVAL 3 DAY;

CREATE TABLE IF NOT EXISTS metrics.AGG_VSWITCH_PORT_FLOW_30M(
	TIME DateTime,
	HOST_POOL_ID UInt32,
	CLUSTER_ID UInt32,
	HOST_ID UInt32,
	DOMAIN_ID UInt32,
	VSWITCH_NAME String,
	VSWITCH_ID UInt32,
	VPORT String NOT NULL,
	MAC String,
	OP_GROUP_ID UInt32 DEFAULT 1,
	OP_GROUP_CODE String DEFAULT '00',
	RX_FLOW_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RX_FLOW_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RX_FLOW_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	RX_PACKETS_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RX_PACKETS_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RX_PACKETS_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	RX_ERR_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RX_ERR_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RX_ERR_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	TX_FLOW_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	TX_FLOW_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	TX_FLOW_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	TX_PACKETS_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	TX_PACKETS_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	TX_PACKETS_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	TX_ERR_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	TX_ERR_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	TX_ERR_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	RX_DROPPED_PACKETS_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RX_DROPPED_PACKETS_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RX_DROPPED_PACKETS_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	TX_DROPPED_PACKETS_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	TX_DROPPED_PACKETS_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	TX_DROPPED_PACKETS_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	RX_BYTES_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RX_BYTES_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RX_BYTES_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	TX_BYTES_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	TX_BYTES_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	TX_BYTES_AVG AggregateFunction(AVG, Nullable(Decimal128(2)))
) ENGINE = AggregatingMergeTree()
PARTITION BY toYYYYMMDD(TIME)
ORDER BY (HOST_POOL_ID, CLUSTER_ID, HOST_ID, DOMAIN_ID, MAC, TIME)
TTL TIME + INTERVAL 7 DAY;

CREATE TABLE IF NOT EXISTS metrics.AGG_VSWITCH_PORT_FLOW_1H(
	TIME DateTime,
	HOST_POOL_ID UInt32,
	CLUSTER_ID UInt32,
	HOST_ID UInt32,
	DOMAIN_ID UInt32,
	VSWITCH_NAME String,
	VSWITCH_ID UInt32,
	VPORT String NOT NULL,
	MAC String,
	OP_GROUP_ID UInt32 DEFAULT 1,
	OP_GROUP_CODE String DEFAULT '00',
	RX_FLOW_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RX_FLOW_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RX_FLOW_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	RX_PACKETS_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RX_PACKETS_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RX_PACKETS_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	RX_ERR_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RX_ERR_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RX_ERR_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	TX_FLOW_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	TX_FLOW_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	TX_FLOW_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	TX_PACKETS_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	TX_PACKETS_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	TX_PACKETS_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	TX_ERR_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	TX_ERR_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	TX_ERR_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	RX_DROPPED_PACKETS_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RX_DROPPED_PACKETS_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RX_DROPPED_PACKETS_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	TX_DROPPED_PACKETS_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	TX_DROPPED_PACKETS_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	TX_DROPPED_PACKETS_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	RX_BYTES_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RX_BYTES_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RX_BYTES_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	TX_BYTES_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	TX_BYTES_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	TX_BYTES_AVG AggregateFunction(AVG, Nullable(Decimal128(2)))
) ENGINE = AggregatingMergeTree()
PARTITION BY toYYYYMMDD(TIME)
ORDER BY (HOST_POOL_ID, CLUSTER_ID, HOST_ID, DOMAIN_ID, MAC, TIME)
TTL TIME + INTERVAL 1 MONTH;

CREATE TABLE IF NOT EXISTS metrics.AGG_VSWITCH_PORT_FLOW_1D(
	TIME DateTime,
	HOST_POOL_ID UInt32,
	CLUSTER_ID UInt32,
	HOST_ID UInt32,
	DOMAIN_ID UInt32,
	VSWITCH_NAME String,
	VSWITCH_ID UInt32,
	VPORT String NOT NULL,
	MAC String,
	OP_GROUP_ID UInt32 DEFAULT 1,
	OP_GROUP_CODE String DEFAULT '00',
	RX_FLOW_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RX_FLOW_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RX_FLOW_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	RX_PACKETS_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RX_PACKETS_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RX_PACKETS_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	RX_ERR_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RX_ERR_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RX_ERR_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	TX_FLOW_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	TX_FLOW_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	TX_FLOW_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	TX_PACKETS_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	TX_PACKETS_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	TX_PACKETS_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	TX_ERR_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	TX_ERR_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	TX_ERR_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	RX_DROPPED_PACKETS_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RX_DROPPED_PACKETS_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RX_DROPPED_PACKETS_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	TX_DROPPED_PACKETS_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	TX_DROPPED_PACKETS_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	TX_DROPPED_PACKETS_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	RX_BYTES_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	RX_BYTES_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	RX_BYTES_AVG AggregateFunction(AVG, Nullable(Decimal128(2))),
	TX_BYTES_MAX AggregateFunction(MAX, Nullable(Decimal128(2))),
	TX_BYTES_MIN AggregateFunction(MIN, Nullable(Decimal128(2))),
	TX_BYTES_AVG AggregateFunction(AVG, Nullable(Decimal128(2)))
) ENGINE = AggregatingMergeTree()
PARTITION BY toYear(TIME)
ORDER BY (HOST_POOL_ID, CLUSTER_ID, HOST_ID, DOMAIN_ID, MAC, TIME)
TTL TIME + INTERVAL 5 YEAR;

CREATE TABLE IF NOT EXISTS metrics.TBL_CORE_SERVICE_MON_DATA(
    INSERT_TIME DateTime,
    TIME UInt64,
    SERVICE UInt32,
    METRIC UInt32,
    VALUE Decimal128(2) DEFAULT NULL
    ) ENGINE = MergeTree()
    ORDER BY (TIME)
    TTL INSERT_TIME + INTERVAL 15 DAY;