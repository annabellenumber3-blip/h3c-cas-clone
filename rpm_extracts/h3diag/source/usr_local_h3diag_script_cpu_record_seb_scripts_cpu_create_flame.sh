#!/bin/bash
HOUR=$1
MINT=$2
MINT_COLLECT=$3
CATCH_ONCE=$4
PERF_CYCLE=$5
COLLECT_RANGE_FOR_FLAME=$6

DIR_TOOL_INCLUDE="/usr/local/h3diag/include"
source $DIR_TOOL_INCLUDE/general_function.sh

DIR_TOOL_INCLUDE_FLAME="$DIR_TOOL_INCLUDE/flame-graph"

DIR_TOOL_LOG="/var/log/h3diag"
DIR_TOOL_LOG_CURRENT="$DIR_TOOL_LOG/log_current"
DIR_THISTOOL_LOG_CURRENT="$DIR_TOOL_LOG_CURRENT/cpu_record"
DIR_RAW_DATA="$DIR_THISTOOL_LOG_CURRENT/raw_data"
DIR_RAW_DATA_OFFCPU="$DIR_RAW_DATA/offcpu_raw_data"
DIR_RAW_DATA_ONCPU="$DIR_RAW_DATA/oncpu_raw_data"

DIR_LOG_CURRENT=$(find_newest_log_dir)

DIR_LOG_QUESTION="$DIR_LOG_CURRENT/question_logs"       # 收集的数据按照时间目录进行保留
DIR_LOG_QUESTION_OFFCPU="$DIR_LOG_QUESTION/offcpu"
DIR_LOG_QUESTION_ONCPU="$DIR_LOG_QUESTION/oncpu"
DIR_LOG_QUESTION_OFFCPU_RAW_DATA="$DIR_LOG_QUESTION_OFFCPU/raw_data"
DIR_LOG_QUESTION_OFFCPU_SVG="$DIR_LOG_QUESTION_OFFCPU/svg"
DIR_LOG_QUESTION_ONCPU_RAW_DATA="$DIR_LOG_QUESTION_ONCPU/raw_data"
DIR_LOG_QUESTION_ONCPU_SVG="$DIR_LOG_QUESTION_ONCPU/svg"

DIR_LOG_DEBUG="$DIR_LOG_CURRENT/debug_logs"

LOG_CREATE_FLAME="$DIR_LOG_CURRENT/create_flame.log"

create_flame_graph()
{
	TARGET_DIR=$1
	SVG_DIR=$2
	DATA_TYPE="`ls -l  $TARGET_DIR | awk '{print $9}' | awk -F '.' '{print $1}' | sed '/^$/d' |uniq`"
	for mint in `ls -l  $TARGET_DIR | awk '{print $9}' | awk -F '_' '{print $2}' | sed '/^$/d' | uniq`
	do
		for((num=0;num<LOOP;num++))
		do
			if [[ "$DATA_TYPE" == "offcpu" ]];then
				$DIR_TOOL_INCLUDE_FLAME/flamegraph.pl --color=io --title="${DATE_TYPE} Time Flame Graph" \
					--countname=us < $TARGET_DIR/${DATA_TYPE}.data_${mint}_${num} > \
					$SVG_DIR/${DATA_TYPE}_data_${mint}_${num}.svg
			else
				perf script -i $TARGET_DIR/oncpu.data_${mint}_${num} | $DIR_TOOL_INCLUDE_FLAME/stackcollapse.pl | \
					$DIR_TOOL_INCLUDE_FLAME/flamegraph.pl > $SVG_DIR/${DATA_TYPE}_data_${mint}_${num}.svg
			fi
		done
	done
}


if [[ $CATCH_ONCE -eq 1 ]];then		# 如果只抓取一次，停止脚本，删除定时任务
	h3diag cpu_record disable -C
else
	sed -i '/'$HOUR' '$MINT' '$MINT_COLLECT'/d' /etc/crontab	# 如果抓取多次，删除本次定时任务，重启服务
	service crond restart
fi

echo "DIR_LOG_QUESTION_ONCPU_RAW_DATA: $DIR_LOG_QUESTION_ONCPU_RAW_DATA" >> $LOG_CREATE_FLAME
echo "DIR_LOG_QUESTION_ONCPU_SVG: $DIR_LOG_QUESTION_ONCPU_SVG" >> $LOG_CREATE_FLAME
mkdir -p $DIR_LOG_QUESTION_OFFCPU_RAW_DATA \
         $DIR_LOG_QUESTION_OFFCPU_SVG \
         $DIR_LOG_QUESTION_ONCPU_RAW_DATA \
         $DIR_LOG_QUESTION_ONCPU_SVG

LOOP=`expr 60 / $PERF_CYCLE`
echo "loop: $LOOP" >> $LOG_CREATE_FLAME
echo "RANGE: $COLLECT_RANGE_FOR_FLAME" >> $LOG_CREATE_FLAME
if [[ $MINT_COLLECT -ge $COLLECT_RANGE_FOR_FLAME ]];then
	for((i=0;i<COLLECT_RANGE_FOR_FLAME;i++))
	do
		for((num=0;num<LOOP;num++))
		do
			cp $DIR_RAW_DATA_OFFCPU/offcpu.data_$((MINT_COLLECT-i))_${num} $DIR_LOG_QUESTION_OFFCPU_RAW_DATA
			cp $DIR_RAW_DATA_ONCPU/oncpu.data_$((MINT_COLLECT-i))_${num} $DIR_LOG_QUESTION_ONCPU_RAW_DATA
		done
	done
else 
	for((i=0;i<=MINT_COLLECT;i++))
	do
		for((num=0;num<LOOP;num++))
		do
			cp $DIR_RAW_DATA_OFFCPU/offcpu.data_$((MINT_COLLECT-i))_${num} $DIR_LOG_QUESTION_OFFCPU_RAW_DATA
			cp $DIR_RAW_DATA_ONCPU/oncpu.data_$((MINT_COLLECT-i))_${num} $DIR_LOG_QUESTION_ONCPU_RAW_DATA
		done
	done

	for((i=(60-COLLECT_RANGE_FOR_FLAME);i<60;i++))
	do
		for((num=0;num<LOOP;num++))
		do
			cp $DIR_RAW_DATA_OFFCPU/offcpu.data_${i}_${num} $DIR_LOG_QUESTION_OFFCPU_RAW_DATA
			cp $DIR_RAW_DATA_ONCPU/oncpu.data_${i}_${num} $DIR_LOG_QUESTION_ONCPU_RAW_DATA
		done
	done
fi

create_flame_graph $DIR_LOG_QUESTION_OFFCPU_RAW_DATA $DIR_LOG_QUESTION_OFFCPU_SVG
create_flame_graph $DIR_LOG_QUESTION_ONCPU_RAW_DATA $DIR_LOG_QUESTION_ONCPU_SVG
