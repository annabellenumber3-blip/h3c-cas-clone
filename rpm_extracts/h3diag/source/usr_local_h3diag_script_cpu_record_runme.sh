#/bin/bash
set -e

source $DIR_TOOL_INCLUDE/general_function.sh
source $DIR_SCRIPT/tool.def

CMD=$1
TOOL_NAME="cpu_record"    		# 一定不能为空！！

DEFAULT_PERF_CYCLE=60
DEFAULT_CATCH_ONCE=0
DEFAULT_COLLECT_RANGE=5
DEFAULT_COLLECT_RANGE_THRESHOLD=10

export DIR_SEB_SCRIPT="$DIR_SCRIPT/seb_scripts"
OFFCPU_DETECT_SCRIPT="offcpu_runtime_detect.sh"
ONCPU_DETECT_SCRIPT="oncpu_runtime_detect.sh"

DIR_RAW_DATA="$DIR_THISTOOL_LOG_CURRENT/raw_data"	# 原始数据我们只保留一份，减少对空间的占用
export DIR_RAW_DATA_OFFCPU="$DIR_RAW_DATA/offcpu_raw_data"
export DIR_RAW_DATA_ONCOU="$DIR_RAW_DATA/oncpu_raw_data"

export DIR_LOG_DEBUG="$DIR_LOG_CURRENT/debug_logs"

DIR_TOOL_BCC_RPMS="$DIR_TOOL_RPMS/bcc-tools"

usage() 
{ 
        cat <<-END >&2 

H3Linux 操作系统诊断工具cpu_record功能使用方法
  Description: 
    按照指定周期实时抓取所有进程、指定进程（包含子线程）、单一线程的on-cpu、off-cpu原始数据。
    并可感知用户收集请求，筛选触发时间点前后一定时间范围的on-cpu、off-cpu数据并加工为可视化火焰图。
  Usage: 
     h3diag cpu_record <$TOOL_CMD> [ARGS]
              help           # cpu_record功能帮助信息
              enable         # 开启cpu_record抓取功能，可选参数 -O -F -o -C -p -t -R
                    -O       # 开启后台持续抓取oncpu数据的定时任务
                    -F       # 开启后台持续抓取offcpu数据的定时任务
                               # -O -F 都不指定的时候默认开启-O
                               # 指定 -F 后必须指定 -p 或者 -t 参数
                    -o       # 若指定.感知用户收集请求一次后退出cpu_record功能
                    -C       # 原始数据抓取周期，单位 s (默认60，可设定范围 5、10、20、30)
                    -p       # 抓取指定进程id(包含子线程)的数据
                    -t       # 抓取指定线程id的数据
                    -R       # 筛选原始数据的范围 单位 min (默认5，表示收集感知请求后前后5分钟的数据，可选 1-10)
                               # 用户可通过 echo 1 > /usr/local/h3diag/script/cpu_record/flag_file 向cpu_record发送收集信号
              disable        # 关闭cpu_record抓取功能，并打印最新可视化火焰图目录
              report         # 打印最新可视化火焰图目录
              clean          # 清理理系统中cpu_record抓取的所有数据信息，释放磁盘空间
  Examples：
     h3diag cpu_record enable                      # 启动cpu_record功能，默认收集所有进程oncpu数据，收集周期60s
                                                     # 可感知用户请求多次，筛选前后5分钟数据
     h3diag cpu_record enable -F -p 23 -o          # 启动cpu_record功能，收集pid=23及其子线程的的offcpu数据，收集周期60s
                                                     # 仅可感知用户请求 1 次，筛选前后5分钟数据
     h3diag cpu_record enable -O -F -o -t 24 -R 2  # 启动cpu_record功能，收集tid=24的的oncpu、offcpu数据，收集周期60s
                                                     # 仅可感知用户请求 1 次，筛选前后2分钟数据
     h3diag cpu_record enable -o -R 7 -C 20        # 启动cpu_record功能，默认收集所有进程oncpu数据，收集周期20s
                                                     # 仅可感知用户请求 1 次，筛选前后7分钟数据
     h3diag cpu_record disable                     # 关闭cpu_record功能
     h3diag cpu_record report                      # 打印最新可视化火焰图目录
     h3diag cpu_record clean                       # 清理理系统中cpu_record抓取的所有数据信息，释放磁盘空间

END
        exit
} 

parameter_check()
{
	# 默认抓取周期为60s，可指定为60、30、20、10、5中的值
	if [[ ! $PERF_CYCLE ]];then
		PERF_CYCLE=$DEFAULT_PERF_CYCLE
	elif [[ "$PERF_CYCLE" -ne 60 ]] && [[ "$PERF_CYCLE" -ne 30 ]] && [[ "$PERF_CYCLE" -ne 20 ]] && [[ "$PERF_CYCLE" -ne 10 ]] && [[ "$PERF_CYCLE" -ne 5 ]];then
		echo "ERROR: 错误的CYCLE参数"
		usage; exit
	fi

	# 默认抓取多次数据，指定1则代表抓取一次后退出
	if [[ ! $CATCH_ONCE ]];then
		CATCH_ONCE=$DEFAULT_CATCH_ONCE
	elif [[ "$CATCH_ONCE" -ne 1 ]] && [[ "$CATCH_ONCE" -ne 0 ]];then
		echo "ERROR: 错误的CATCH_ONCE参数"
		usage; exit
	fi

	# 不指定模式默认为ONCPU数据
	if [[ ! $ONCPU_MODE ]] && [[ ! $OFFCPU_MODE ]];then
		ONCPU_MODE=1
	fi

	# -t -p 参数配置
	if [[ $TRACE_PID ]] && [[ $TRACE_TID ]];then
		echo "ERROR: -t -p参数不能同时指定"
		usage; exit
	elif [[ ! $TRACE_PID ]] && [[ ! $TRACE_TID ]];then
		if [[ $ONCPU_MODE ]];then	# 如果是oncpu，返回两个-1
			TRACE_PID=-1
			TRACE_TID=-1
		fi
		if [[ $OFFCPU_MODE ]];then	# 如果此时开启了offcpu，则返回错误
			echo "ERROR: 指定-F后必须指定-t or -p参数，但-t -p不可同时指定"
			usage; exit
		fi
	elif [[ ! $TRACE_PID ]];then		# 走到这里，把没设置的-p -t置为-1即可
		TRACE_PID=-1
	else
		TRACE_TID=-1
	fi

	# 默认收集出问题前后各5分钟数据，总共收集10分钟数据,可手动修改
	if [[ ! $COLLECT_RANGE ]];then
		COLLECT_RANGE=$DEFAULT_COLLECT_RANGE
	elif [[ "$COLLECT_RANGE" -lt 1 ]] || [[ "$COLLECT_RANGE" -gt $DEFAULT_COLLECT_RANGE_THRESHOLD ]];then
		echo "ERROR: 错误的 -R 参数，-R 参数范围(1-10)"; exit
	fi

	date >> $DIR_LOG_DEBUG/parameter_check.log 
	echo "ONCPU: $ONCPU_MODE" >> $DIR_LOG_DEBUG/parameter_check.log
	echo "OFFCPU: $OFFCPU_MODE" >> $DIR_LOG_DEBUG/parameter_check.log
	echo "PID: $TRACE_PID" >> $DIR_LOG_DEBUG/parameter_check.log
	echo "TID: $TRACE_TID" >> $DIR_LOG_DEBUG/parameter_check.log
	echo "PERF_CYCLE: $PERF_CYCLE" >> $DIR_LOG_DEBUG/parameter_check.log
	echo "CATCH_ONCE: $CATCH_ONCE" >> $DIR_LOG_DEBUG/parameter_check.log
	echo "COLLECT_RANGE: $COLLECT_RANGE" >> $DIR_LOG_DEBUG/parameter_check.log
	echo >> $DIR_LOG_DEBUG/parameter_check.log
}

__crontab_setting()
{
	line=0
	while ((line<$LOOP))
	do
		if [[ $line -eq 0 ]];then
			echo "$mint $hour * * * root sh $DIR_SEB_SCRIPT/$CRON_MODE_SCRIPT $line $PERF_CYCLE $TRACE_PID $TRACE_TID" >> /etc/crontab
			let "line = $line + 1"
			continue
		fi
		value=$((10#${PERF_CYCLE}*10#${line}))
		echo "$mint $hour * * * root sleep $value && sh $DIR_SEB_SCRIPT/$CRON_MODE_SCRIPT $line $PERF_CYCLE $TRACE_PID $TRACE_TID" >> /etc/crontab
		let "line = $line + 1"
	done			
}

crontab_setting()                        
{                                        
	CRON_MODE_SCRIPT=$1
	LOOP=`expr 60 / $PERF_CYCLE`
	for hour in {0..23}
	do
		for mint in {0..59}
		do
			__crontab_setting
		done
	done
}

svg_path_print()
{
	NEW_LOG_DIR=$1
	if [[ -d "$NEW_LOG_DIR/question_logs" ]];then
		echo "INFO; 可前往 $NEW_LOG_DIR/question_logs/offcpu(oncpu)/svg 中获取火焰图数据"
	else
		echo "INFO: $TOOL_NAME 没有抓取到有效数据，请确认是否正确使用 $TOOL_NAME 工具."; exit
	fi
}

main_enable()
{
	export CATCH_ONCE PERF_CYCLE COLLECT_RANGE

	mkdir -p $DIR_RAW_DATA_OFFCPU \
		 $DIR_RAW_DATA_ONCOU
	# 清理原有数据
	rm -rf $DIR_RAW_DATA_OFFCPU/* $DIR_RAW_DATA_ONCOU/*

	/bin/cp -rf /etc/crontab  $DIR_RAW_DATA/crontab.bak

	sh $DIR_SEB_SCRIPT/trace_monitor.sh &

	if [[ $OFFCPU_MODE ]];then
		crontab_setting $OFFCPU_DETECT_SCRIPT
	fi
	if [[ $ONCPU_MODE ]];then
		crontab_setting $ONCPU_DETECT_SCRIPT
	fi

	service crond restart

	echo "INFO: $TOOL_NAME 已成功启动！"
}

main_disable()
{
	trace_process=`ps -aux | grep trace_monitor.sh | grep -v grep | head -1 | awk '{print $2}'`
	if [[ -n "$trace_process" ]];then
		kill -9 $trace_process
	fi

	if [[ -f $DIR_RAW_DATA/crontab.bak ]];then
		/bin/cp -rf $DIR_RAW_DATA/crontab.bak  /etc/crontab
		service crond restart
	else
		echo "WARN: 文件$DIR_RAW_DATA/crontab.bak丢失，crond服务将被停止，请手动恢复/etc/crontab"
		service crond stop
		echo "INFO: $TOOL_NAME 已关闭！"
		exit
	fi

	echo "INFO: $TOOL_NAME 已成功关闭！"

	svg_path_print $NEW_LOG_DIR_DISABLE
}

main_report()
{
	svg_path_print $NEW_LOG_DIR_REPORT
}

if [[ ! "$CMD" ]];then		# 空命令返回usage
        usage; exit
fi

shift 1
if [[ "$CMD" = "enable" ]];then
	perf_tool_check
	bcc_tool_check

	if [[ -n `grep h3diag /etc/crontab | grep cpu_record` ]];then
		echo "ERROR: cpu_record 已经在运行，请先指定 disable 停止后再启动"; exit
	fi

        while getopts OFoC:p:t:R:h opt
        do
                case $opt in
		O)      parameter_repeat_check _$ONCPU_MODE O; ONCPU_MODE=1 ;;
		F)      parameter_repeat_check _$OFFCPU_MODE F; OFFCPU_MODE=1 ;;
		o)      parameter_repeat_check _$CATCH_ONCE o; CATCH_ONCE=1 ;;
		C)      parameter_repeat_check _$PERF_CYCLE C; PERF_CYCLE=$OPTARG ;;
		p)      parameter_repeat_check _$TRACE_PID p; TRACE_PID=$OPTARG ;;
		t)      parameter_repeat_check _$TRACE_TID t; TRACE_TID=$OPTARG ;;
		R)      parameter_repeat_check _$COLLECT_RANGE R; COLLECT_RANGE=$OPTARG ;;
		h|?)    usage ;;
		esac
        done

	mkdir -p $DIR_LOG_DEBUG

	parameter_check
	main_enable

elif [[ "$CMD" = "disable" ]];then
	if [[ -z `grep h3diag /etc/crontab | grep cpu_record` ]];then
		echo "ERROR: $TOOL_NAME 工具没有在运行，disable操作取消"; exit
	fi

	while getopts C opt     # 该参数仅仅可使用在cpu_create_flame.sh脚本中,用于在-o参数的时候停止所有收集任务
	do
		case $opt in
		C)      parameter_repeat_check _$FROM_CPU_CREATE_FLAME C; FROM_CPU_CREATE_FLAME=1;;
		esac
	done

	if [[ $FROM_CPU_CREATE_FLAME -ne 1 ]] && [[ -n `grep h3diag /etc/crontab | grep cpu_create_flame.sh` ]];then
		echo "ERROR: 目前存在火焰图收集定时任务，请稍后再试"; exit
	fi

	NEW_LOG_DIR_DISABLE=$(find_newest_log_dir)
	main_disable

elif [[ "$CMD" = "report" ]];then
	NEW_LOG_DIR_REPORT=$(find_newest_log_dir)
	main_report

elif [[ "$CMD" = "clean" ]];then
	if [[ -n `grep h3diag /etc/crontab | grep cpu_record` ]];then
		echo "ERROR: $TOOL_NAME 工具正在运行"; exit
	else
		general_clean_function
	fi

elif [[ "$CMD" = "help" ]];then
	usage

else
	echo "ERROR: "$TOOL_NAME" 错误的command \"$CMD\""
        usage
fi
