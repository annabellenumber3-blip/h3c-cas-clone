#/bin/bash
set -e

CMD=$1
TOOL_NAME="sched_delay"		# 一定不能为空！！

DIR_ORI_LOG_CURRENT="$DIR_LOG_CURRENT/origin_data"

FILE_CURRENT_PERF_ORI_DATA="$DIR_ORI_LOG_CURRENT/perf_ori_data"
FILE_CURRENT_PERF_TIMEHIST_DATA="$DIR_ORI_LOG_CURRENT/timehist_data"
FILE_CURRENT_PERF_SCRIPT_DATA="$DIR_ORI_LOG_CURRENT/script_data"
FILE_CURRENT_PERF_PRE_CHROME_DATA="$DIR_ORI_LOG_CURRENT/pre_chrome_data"

FILE_CURRENT_PERF_CHROME_DATA="$DIR_LOG_CURRENT/chrome_data"
FILE_CURRENT_PERF_ANALYZE_DATA="$DIR_LOG_CURRENT/analyze_data"

distribution_max_star=50	# 直方图长度控制参数，默认最长50

source $DIR_TOOL_INCLUDE/general_function.sh	# 导入库函数
source $DIR_SCRIPT/tool.def

usage()
{ 
        cat <<-END >&2 

H3Linux 操作系统诊断工具sched_delay功能使用方法
  Description:
    监控CPU资源整体使用情况并追踪热点进程；提供CPU运行时序图数据功能。
  Usage: 
    h3diag sched_delay <$TOOL_CMD> [ARGS]
             help           # sched_delay功能帮助信息
             enable         # 开启抓取sched_delay信息，必须指定-d，可选-C
                   -d       # 抓取持续时间（s），范围1-300
                   -C       # 抓取指定CPU列表的数据（支持"0  0,1  0-2"三种输入形式），不可超过当前系统最大CPU范围
             report         # 打印最新抓取到的超时信息。可选-t，-C
                   -t       # 输出指定tid线程的抓取信息
                   -C       # 指定输出特定CPU的抓取信息，不可超过当前系统最大CPU范围
             cpuseq         # 生成最新抓取日志提供chrome://tracing/读取的原始数据
             clean          # 清理理系统中sched_delay抓取的所有数据信息，释放空间
  Examples：
    h3diag sched_delay enable -d 5                # 启动sched_delay抓取功能,指定抓取时间5s
    h3diag sched_delay enable -d 5 -C 3-5         # 启动sched_delay抓取功能,指定抓取时间5s
                                                  # 抓取3、4、5号CPU上的调度信息
    h3diag sched_delay report                     # 查看最新的抓取数据分析报告
    h3diag sched_delay report -C 2                # 查看2号CPU最新抓取数据的分析报告
    h3diag sched_delay report -t 12               # 查看12号线程最新抓取数据的分析报告
    h3diag sched_delay cpuseq                     # 生成最新抓取日志提供chrome://tracing/读取的数据文件
END
        exit
}

parameter_check_enable()
{
	if [[ ! $DURATION ]] || [[ "$DURATION" -lt 1 ]] || [[ "$DURATION" -gt 300 ]];then
		echo "ERROR: 必须指定-d参数，-d参数范围(1-300)"; exit
	fi
}

parameter_check_report()
{
	CPU_NUM=`lscpu | grep "^CPU(s):" | awk '{print $2}'`
	if [[ $SELECT_CPU ]] && [[ ! `echo $SELECT_CPU | grep "^[[:digit:]]*$"` ]] || [[ $SELECT_CPU -ge $CPU_NUM ]];then
		echo "ERROR: 错误的-C参数，必须是一个小于"$CPU_NUM"的自然数"; exit
	fi
	if [[ $SELECT_TID ]] && [[ ! `echo $SELECT_TID | grep "^[[:digit:]]*$"` ]];then
		echo "ERROR: 错误的-t参数，必须是一个自然数"; exit
	fi
}

data_analyze()
{
	if [[ $2 == "enable" ]];then
		FILE_TMP_RUNNING_TIME="$DIR_LOG_CURRENT/timehist_runtime_data"
		FILE_TMP_SCHEDELAY_TIME="$DIR_LOG_CURRENT/timehist_schedelay_data"
	else
		FILE_TMP_RUNNING_TIME="$NEW_LOG_DIR_REPORT/timehist_runtime_data"
		FILE_TMP_SCHEDELAY_TIME="$NEW_LOG_DIR_REPORT/timehist_schedelay_data"
	fi
	# 把时间(ms)筛选出来
	cat $1 | grep -v "<idle>" | awk '{print $6}' | sed -e 's/\./ /g' | awk '{print $1}' > $FILE_TMP_RUNNING_TIME
	cat $1 | grep -v "<idle>" | awk '{print $5}' | sed -e 's/\./ /g' | awk '{print $1}' > $FILE_TMP_SCHEDELAY_TIME
	if [[ $2 == "enable" ]];then	# 选择重定向输出的文件
		exec 1> $FILE_CURRENT_PERF_ANALYZE_DATA 2>&1
	elif [[ $2 == "report" ]];then
		exec 1> $FILE_REPORT_ANALYZE_DATA 2>&1
	fi

	echo "Distribution of run_time"				# run time数据
	hist_print $FILE_TMP_RUNNING_TIME			# 调用直方图生成函数
	echo -e "\nTOP 20 hotpoint proc for run_time"
	cat $DIR_SCRIPT/timehist_head				# 打印表头
	cat $1 | grep -v "<idle>" | sort -rnk 6 | head -n 20	# 打印前20个热点进程数据

	echo -e "\n\nDistribution of sch_delay"			# sch delay数据
	hist_print $FILE_TMP_SCHEDELAY_TIME
	echo -e "\nTOP 20 hotpoint proc for sch_delay"
	cat $DIR_SCRIPT/timehist_head
	cat $1 | grep -v "<idle>" | sort -rnk 5 | head -n 20	

	exec 1> $TTY_CURRENT 2>&1				# 将结果输出到终端，修改重定向到当前tty
	if [[ $2 == "enable" ]];then	
		cat $FILE_CURRENT_PERF_ANALYZE_DATA | less
	else
		cat $FILE_REPORT_ANALYZE_DATA | less
		rm -rf $FILE_REPORT_ANALYZE_DATA		# 删除report过程文件
	fi
	rm -rf $FILE_TMP_RUNNING_TIME $FILE_TMP_SCHEDELAY_TIME	# 删除过程文件
}

main_enable()
{
	mkdir -p $DIR_LOG_CURRENT $DIR_LOG_ROTATE \
		$DIR_ORI_LOG_CURRENT
	echo "INFO: 抓取过程要持续 $DURATION s，可手动键入 Ctrl+C 终止，但会导致本次抓取失效"
	if [[ $CPU_LIST ]];then
		perf sched record -g -C $CPU_LIST -o $FILE_CURRENT_PERF_ORI_DATA sleep $DURATION
	else
		perf sched record -g -o $FILE_CURRENT_PERF_ORI_DATA sleep $DURATION
	fi
	echo "INFO: 开始进行数据分析，该过程可能需要较长时间。可手动键入 Ctrl+C 终止，但会导致本次抓取失效"
	# no_bland.gawk用于处理进程名中存在空格，导致数据统计偏差的小概率问题。该脚本用于将空格删除并合并进程名
	perf sched timehist -i $FILE_CURRENT_PERF_ORI_DATA | sed '1,3d' | awk -f $DIR_SCRIPT/no_blank.gawk > $FILE_CURRENT_PERF_TIMEHIST_DATA
	perf sched script -i $FILE_CURRENT_PERF_ORI_DATA > $FILE_CURRENT_PERF_SCRIPT_DATA
	data_analyze $FILE_CURRENT_PERF_TIMEHIST_DATA enable
}

main_report()
{
	FILE_REPORT_PERF_TIMEHIST_DATA="$NEW_LOG_DIR_REPORT/timehist_data_report"
	FILE_REPORT_ORI_DATA="$NEW_LOG_DIR_REPORT/origin_data/perf_ori_data"
	FILE_REPORT_ANALYZE_DATA="$NEW_LOG_DIR_REPORT/tmp_report_analyze_data"
	if [[ $SELECT_TID ]] && [[ $SELECT_CPU ]];then
		perf sched timehist -i $FILE_REPORT_ORI_DATA -t $SELECT_TID -C $SELECT_CPU \
			| sed '1,3d' | awk -f $DIR_SCRIPT/no_blank.gawk > $FILE_REPORT_PERF_TIMEHIST_DATA
	elif [[ $SELECT_TID ]];then
		perf sched timehist -i $FILE_REPORT_ORI_DATA -t $SELECT_TID \
			| sed '1,3d' | awk -f $DIR_SCRIPT/no_blank.gawk > $FILE_REPORT_PERF_TIMEHIST_DATA
	elif [[ $SELECT_CPU ]];then
		perf sched timehist -i $FILE_REPORT_ORI_DATA -C $SELECT_CPU \
			| sed '1,3d' | awk -f $DIR_SCRIPT/no_blank.gawk > $FILE_REPORT_PERF_TIMEHIST_DATA
	else
		cat $NEW_LOG_DIR_REPORT/analyze_data | less; return	
	fi
	data_analyze $FILE_REPORT_PERF_TIMEHIST_DATA report
	rm -rf $FILE_REPORT_PERF_TIMEHIST_DATA 
}

if [[ ! "$CMD" ]];then		# 命令输入为空，返回帮助信息
        usage; exit
fi

shift 1				# 命令行参数左移1
if [[ "$CMD" = "enable" ]];then
	perf_tool_check
        while getopts d:C:h opt
        do
                case $opt in
                d)      parameter_repeat_check _$DURATION d; DURATION=$OPTARG ;;
                C)      parameter_repeat_check _$CPU_LIST C; CPU_LIST=$OPTARG ;;
                h|?)    usage ;;
                esac
        done
	parameter_check_enable
	main_enable

elif [[ "$CMD" = "cpuseq" ]];then
	NEW_LOG_DIR_CPUSEQ=$(find_newest_log_dir)
	if [[ `ls $NEW_LOG_DIR_CPUSEQ/` ]];then
		FILE_CURRENT_PERF_SCRIPT_DATA="$NEW_LOG_DIR_CPUSEQ/origin_data/script_data"
		FILE_CURRENT_PERF_PRE_CHROME_DATA="$NEW_LOG_DIR_CPUSEQ/origin_data/pre_chrome_data"
		FILE_CURRENT_PERF_CHROME_DATA="$NEW_LOG_DIR_CPUSEQ/chrome_data"
		echo "WARN：该过程可能需要较长时间"
		sed -e '/^[[:space:]]/d' -e '/^$/d' -e 's/[ ][ ]*/-/' -e 's/sched://' -e 's/[ ][ ]*/ /g' \
			-e 's/^swapper/<idle>/' $FILE_CURRENT_PERF_SCRIPT_DATA > $FILE_CURRENT_PERF_CHROME_DATA	
		echo "INFO: successfully. 文件获取路径：$FILE_CURRENT_PERF_CHROME_DATA"; exit
	else
        	echo "ERROR: 没有有效的 $TOOL_NAME 数据, 请先执行enable命令."
	fi

elif [[ "$CMD" = "report" ]];then
	NEW_LOG_DIR_REPORT=$(find_newest_log_dir)
	echo "$NEW_LOG_DIR_REPORT"
	if [[ `ls $NEW_LOG_DIR_REPORT/` ]];then 
		while getopts C:t:h opt
		do
			case $opt in
			C)      parameter_repeat_check _$SELECT_CPU C; SELECT_CPU=$OPTARG ;;
			t)      parameter_repeat_check _$SELECT_TID t; SELECT_TID=$OPTARG ;;
			h|?)	usage ;;
			esac
		done
		parameter_check_report
		main_report
	else
        	echo "ERROR: 没有有效的 $TOOL_NAME 数据, 请先执行enable命令."
	fi

elif [[ "$CMD" = "clean" ]];then
	general_clean_function

elif [[ "$CMD" = "help" ]];then
	usage

else
        echo "ERROR: "$TOOL_NAME" 错误的command \"$CMD\""
        usage
fi
