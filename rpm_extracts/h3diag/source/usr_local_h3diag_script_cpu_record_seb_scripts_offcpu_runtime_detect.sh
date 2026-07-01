#!/bin/bash
FILE_NUM=$1
PERF_CYCLE=$2
TRACE_PID=$3
TRACE_TID=$4

DIR_TOOL_LOG="/var/log/h3diag"
DIR_TOOL_LOG_CURRENT="$DIR_TOOL_LOG/log_current"
DIR_THISTOOL_LOG_CURRENT="$DIR_TOOL_LOG_CURRENT/cpu_record"
DIR_RAW_DATA="$DIR_THISTOOL_LOG_CURRENT/raw_data"
DIR_RAW_DATA_OFFCPU="$DIR_RAW_DATA/offcpu_raw_data"

MINT=$(echo -e `date +"%M"` | sed -r 's/0*([0-9])/\1/')

if [[ $TRACE_TID -eq -1 ]];then
	/usr/share/bcc/tools/offcputime -df $PERF_CYCLE -M ${PERF_CYCLE}000000 -p $TRACE_PID > $DIR_RAW_DATA_OFFCPU/offcpu.data_${MINT}_${FILE_NUM}
else
	/usr/share/bcc/tools/offcputime -df $PERF_CYCLE -M ${PERF_CYCLE}000000 -t $TRACE_TID > $DIR_RAW_DATA_OFFCPU/offcpu.data_${MINT}_${FILE_NUM}
fi
