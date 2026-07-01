#!/bin/bash
set -e

FLAG_FILE="$DIR_SCRIPT/flag_file"
LOG_QUESTION_TIME="$DIR_LOG_DEBUG/question_time.log"
CREATE_FLAME_SCRIPT="cpu_create_flame.sh"

COLLECT_RANGE_FOR_FLAME=$((10#${COLLECT_RANGE}*2))

cpu_cut_crond()
{
	HOUR=$(echo -e `date +"%H"` | sed -r 's/0*([0-9])/\1/')
	MINT=$(echo -e `date +"%M"` | sed -r 's/0*([0-9])/\1/')
	TIME_QUESTION="$MINT $HOUR"
	echo "TIME_QUESTION=$TIME_QUESTION" >> $LOG_QUESTION_TIME

	if [ $MINT -lt `expr 60 - $COLLECT_RANGE` ];then
		HOUR_COLLECT=$HOUR
		MINT_COLLECT=`expr $MINT + $COLLECT_RANGE`
	elif [ $HOUR -eq 23 ];then
		HOUR_COLLECT=0
		MINT_COLLECT=$COLLECT_RANGE
	else
		HOUR_COLLECT=`expr $HOUR + 1`
		MINT_COLLECT=$COLLECT_RANGE
	fi
	echo "HOUR_COLLECT=$HOUR_COLLECT" >> $LOG_QUESTION_TIME
	echo "MINT_COLLECT=$MINT_COLLECT" >> $LOG_QUESTION_TIME

	# 增加收集和分析数据的定时任务,延时20s是为了让上一分钟的perf数据能处理完
	echo "$MINT_COLLECT $HOUR_COLLECT * * * root sleep 20 && $DIR_SEB_SCRIPT/$CREATE_FLAME_SCRIPT $HOUR $MINT $MINT_COLLECT $CATCH_ONCE $PERF_CYCLE $COLLECT_RANGE_FOR_FLAME" >> /etc/crontab

	service crond restart
}

echo 0 > $FLAG_FILE

while true
do
	flag=`cat $FLAG_FILE`
	if [[ $flag == 1 ]];then			 # 判断是否出现问题
		date >> $LOG_QUESTION_TIME
		cpu_cut_crond $CATCH_ONCE $PERF_CYCLE $COLLECT_RANGE

		echo 0 > $FLAG_FILE

		if [[ "$CATCH_ONCE" -eq 1 ]];then
			break					
		fi
	fi
	sleep 1
done
