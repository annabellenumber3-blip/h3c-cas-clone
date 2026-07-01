#/bin/bash
set -e

CMD=$1
TOOL_NAME="no_sched"    		# 一定不能为空！！

DIR_SCRIPT_SRC="$DIR_SCRIPT/src"

DIR_PROC="/proc/trace_noschedule/"
FILE_PROC_THRESHOLD="$DIR_PROC/threshold"
FILE_PROC_ENABLE="$DIR_PROC/enable"
FILE_PROC_DISTRIBUTION="$DIR_PROC/distribution"
FILE_PROC_STACK="$DIR_PROC/stack_trace"

DEFAULT_THRESHOLD_MS=50
MIN_THRESHOLD_MS=10
MAX_THRESHOLD_MS=1000

source $DIR_TOOL_INCLUDE/general_function.sh
source $DIR_SCRIPT/tool.def

usage() 
{ 
        cat <<-END >&2 

H3Linux 操作系统诊断工具no_sched功能使用方法
  Description: 
    追踪陷入内核态长时间不调度的进程。
  Usage: 
     h3diag no_sched <$TOOL_CMD> [ARGS]
              help           # no_sched功能帮助信息
              enable         # 开启no_sched追踪功能，可选参数-d
                    -d       # 超时阈值（ms）默认50, 范围10 – 1000（10ms – 1s）
              disable        # 关闭no_sched追踪功能并打印本次追踪到的超时数据分析报告
              report         # 打印最新抓取到的超时统计报告
              clean          # 清理理系统中no_sched抓取的所有数据信息，释放空间
  Examples：
     h3diag no_sched enable                 # 启动no_sched追踪功能,默认超时阈值50ms
     h3diag no_sched enable -d 100          # 启动no_sched追踪功能,设定超时阈值100ms
     h3diag no_sched disable                # 关闭no_sched追踪功能，同时打印分析报告
     h3diag no_sched report                 # 查看最新的追踪数据分析报告
END
        exit
} 

parameter_check()
{
	if [[ ! $THRESHOLD ]];then
		echo "Default threshold: $DEFAULT_THRESHOLD_MS ms"
		THRESHOLD="${DEFAULT_THRESHOLD_MS}"
	fi
	if [[ $THRESHOLD -lt $MIN_THRESHOLD_MS ]] || [[ $THRESHOLD -gt $MAX_THRESHOLD_MS ]];then  
		echo "ERROR: 错误的-d参数，参数范围（$MIN_THRESHOLD_MS - $MAX_THRESHOLD_MS）"; exit                                  
	fi                                            	
}

main_enable()
{
	make -C $DIR_SCRIPT_SRC		# 编译trace_noschedule内核模块
	if [[ `ls $DIR_SCRIPT_SRC | grep trace_noschedule.ko` ]];then
		insmod $DIR_SCRIPT_SRC/trace_noschedule.ko
	else
		echo "ERROR: no_sched工具编译出错"; exit
	fi
	echo ${THRESHOLD}000000 > $FILE_PROC_THRESHOLD		# 转化为ns转入proc目录的开关
	echo 1 > $FILE_PROC_ENABLE 
	mkdir -p $DIR_LOG_CURRENT $DIR_LOG_ROTATE
	echo "h3diag no_sched tool ENABLE successfully!"
}

main_disable()
{
	if [[ `lsmod | grep trace_noschedule` ]];then
		echo "`date` collet messages" > $NEW_LOG_DIR_DISABLE/no_sched_messages
		cat $FILE_PROC_DISTRIBUTION >> $NEW_LOG_DIR_DISABLE/no_sched_messages
		cat $FILE_PROC_STACK >> $NEW_LOG_DIR_DISABLE/no_sched_messages
		echo 0 > $FILE_PROC_ENABLE
		rmmod trace_noschedule
		rm -rf $DIR_SCRIPT_SRC/trace_noschedule.ko
		echo "h3diag $TOOL_NAME tool DISABLE successfully!"
	else
		echo "ERROR: $TOOL_NAME 工具没有在运行，disable操作取消" ; exit
	fi
}

main_report()
{
	if [[ `ls $NEW_LOG_DIR_REPORT/` ]];then
		cat $NEW_LOG_DIR_REPORT/no_sched_messages | less
	else
		echo "ERROR: 没有有效的 $TOOL_NAME 数据, 请先执行 enable、disable 命令."; exit
	fi
}

if [[ ! "$CMD" ]];then		# 空命令返回usage
        usage; exit
fi

shift 1
if [[ "$CMD" = "enable" ]];then
	if [[ `lsmod | grep trace_noschedule` ]];then
		echo "ERROR: no_sched工具已经在运行"; exit
	fi
	kernel_devel_check
        while getopts d:h opt
        do
                case $opt in
                d)      parameter_repeat_check _$THRESHOLD d; THRESHOLD=$OPTARG ;;
                h|?)    usage ;;
                esac
        done
	parameter_check
	main_enable

elif [[ "$CMD" = "disable" ]];then
	NEW_LOG_DIR_DISABLE=$(find_newest_log_dir)
	main_disable
	cat $NEW_LOG_DIR_DISABLE/no_sched_messages | less

elif [[ "$CMD" = "report" ]];then
	if [[ `lsmod | grep trace_noschedule` ]];then
		echo "ERROR: $TOOL_NAME 工具正在运行，请先执行 disable 命令"; exit
	fi
	NEW_LOG_DIR_REPORT=$(find_newest_log_dir)
	main_report

elif [[ "$CMD" = "clean" ]];then
	if [[ `lsmod | grep trace_noschedule` ]];then
		echo "ERROR: $TOOL_NAME 工具正在运行，请先执行 disable 命令"; exit
	else
		general_clean_function
	fi

elif [[ "$CMD" = "help" ]];then
	usage

else
	echo "ERROR: "$TOOL_NAME" 错误的command \"$CMD\""
        usage
fi
