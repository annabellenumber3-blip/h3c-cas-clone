#!/bin/bash
FILE_NUM=$1
PERF_CYCLE=$2
TRACE_PID=$3
TRACE_TID=$4

DIR_TOOL_LOG="/var/log/h3diag"
DIR_TOOL_LOG_CURRENT="$DIR_TOOL_LOG/log_current"
DIR_THISTOOL_LOG_CURRENT="$DIR_TOOL_LOG_CURRENT/cpu_record"
DIR_RAW_DATA="$DIR_THISTOOL_LOG_CURRENT/raw_data"
DIR_RAW_DATA_ONCPU="$DIR_RAW_DATA/oncpu_raw_data"

MINT=$(echo -e `date +"%M"` | sed -r 's/0*([0-9])/\1/')

if [[ $TRACE_TID -ne -1 ]];then		# 如果指定抓线程
	perf record -ag -t $TRACE_TID -o $DIR_RAW_DATA_ONCPU/oncpu.data_${MINT}_${FILE_NUM} sleep $PERF_CYCLE	
        rm -rf $DIR_RAW_DATA_ONCPU/oncpu.data_${MINT}_${FILE_NUM}.old
elif [[ $TRACE_PID -ne -1 ]];then	# 如果指定抓进程（组）
	perf record -ag -p $TRACE_PID -o $DIR_RAW_DATA_ONCPU/oncpu.data_${MINT}_${FILE_NUM} sleep $PERF_CYCLE	
        rm -rf $DIR_RAW_DATA_ONCPU/oncpu.data_${MINT}_${FILE_NUM}.old
else					# 抓取系统搜有数据
	perf record -ag -o $DIR_RAW_DATA_ONCPU/oncpu.data_${MINT}_${FILE_NUM} sleep $PERF_CYCLE
        rm -rf $DIR_RAW_DATA_ONCPU/oncpu.data_${MINT}_${FILE_NUM}.old
fi
