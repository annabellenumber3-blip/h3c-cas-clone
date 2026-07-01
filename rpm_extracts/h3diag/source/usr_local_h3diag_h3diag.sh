#/bin/bash
set -e
H3LINUX_DIAGNOSE_VERSION="1.3.0"

CMD=$1
FILE_H3DIAG="`readlink $0`"
ARCH=`uname -i`		# 不要export，仅作为局部变量，否则会影响no_sched等模块的编译流程
export TTY_CURRENT="`tty`"
export DIR_TOOL="`dirname $FILE_H3DIAG`"
export DIR_TOOL_LOG="/var/log/h3diag"
export DIR_TOOL_LOG_CURRENT="$DIR_TOOL_LOG/log_current"
export DIR_TOOL_LOG_ROTATE="$DIR_TOOL_LOG/log_rotate"
export DIR_TOOL_SCRIPT="$DIR_TOOL/script"
export DIR_TOOL_INCLUDE="$DIR_TOOL/include"
export DIR_TOOL_INCLUDE_FLAME_GRAPH="$DIR_TOOL_INCLUDE/flame-graph"

DIR_TOOL_RPMS="$DIR_TOOL/rpms/$ARCH"
export DIR_TOOL_PERF_RPMS="$DIR_TOOL_RPMS/perf-tools"
export DIR_TOOL_BCC_RPMS="$DIR_TOOL_RPMS/bcc-tools"
export DIR_TOOL_BLKTRACE_RPMS="$DIR_TOOL_RPMS/blktrace-tools"

export FILE_TOOLS_LIST="$DIR_TOOL/tool_list"

export KERNEL_VERSION="`uname -r`"
export KERNEL_VERSION_HEAD="`uname -r | awk -F '-' '{print $1}'`"

LOGS_DIR_CAPACITY="`df -m $DIR_TOOL_LOG | tail -n 1 | awk '{print $4}'`"

usage()
{
        cat <<-END >&2

H3Linux 操作系统诊断工具简介
  Usage: 
    h3diag [--version|-V] [--help|-H] [--list|-L] TOOL_NAME COMMAND [ARGS]
           --version|-V       # h3diag软件版本号
           --help|-H          # h3diag软件帮助信息
           --list|-L          # h3diag目前支持的诊断功能列表及简介
           TOOL_NAME          # 本次运行要调用的诊断功能（支持的功能列表可通过 h3diag --list 获取）
           COMMAND            # 传入诊断功能的命令，例如help、enable、disable、report、clean等，以插件自身help信息为准
           ARGS               # 传入诊断功能的参数
  Tool list:
`cat $FILE_TOOLS_LIST`
  Examples(以sched_delay工具为例)：
    h3diag --version                 # 返回h3diag软件包的版本号
    h3diag --list                    # 返回h3diag目前支持的诊断功能列表及简介
    h3diag sched_delay help          # 查看sched_delay帮助信息
    h3diag sched_delay enable -d 5   # 启动sched_delay诊断功能，并传入-d参数为5
    h3diag sched_delay report -C 2   # 查看sched_delay诊断报告，并传入-C参数为2

END
        exit
}

if [[ `cat $FILE_TOOLS_LIST` ]];then
	rm -rf $FILE_TOOLS_LIST
fi
for init_tool_name in `ls -l $DIR_TOOL_SCRIPT | awk '{print $NF}' | awk 'NR == 1 {next} {print $1}'`
do
	printf "    %18s:       %s\n" $init_tool_name `cat $DIR_TOOL_SCRIPT/$init_tool_name/help` >> $FILE_TOOLS_LIST
done

if [[ ! "$CMD" ]];then
        usage; exit
fi

if [[ "$CMD" == "--help" ]] || [[ "$CMD" == "-H" ]];then
	usage; exit
fi

if [[ "$CMD" == "--version" ]] || [[ "$CMD" == "-V" ]];then
	echo "H3Linux diagnose (version $H3LINUX_DIAGNOSE_VERSION)"; exit
fi

if [[ "$CMD" == "--list" ]] || [[ "$CMD" == "-L" ]];then
	echo "================================h3diag当前支持的工具列表=================================="
	cat $FILE_TOOLS_LIST > $TTY_CURRENT; exit
fi

if [[ $LOGS_DIR_CAPACITY -lt 102400 ]];then	# /var/log/h3diag容量判断(100G)
  echo -e "\033[31mERROR: /var/log/分区可用空间较少($LOGS_DIR_CAPACITY M)，可能导致工具运行异常，建议给/var/log至少保留100G可用空间\033[0m"
fi

for line in `cat $FILE_TOOLS_LIST`
do
	TOOL_NAME=`echo $line | awk -F ':' '{print $1}'`
	if [[ "$CMD" == "$TOOL_NAME" ]];then
		shift 1
		HOUR=$(echo -e `date +"%H"` | sed -r 's/0*([0-9])/\1/')
		MINT=$(echo -e `date +"%M"` | sed -r 's/0*([0-9])/\1/')
		export DIR_SCRIPT="$DIR_TOOL_SCRIPT/$TOOL_NAME"
		export DIR_THISTOOL_LOG_CURRENT="$DIR_TOOL_LOG_CURRENT/$TOOL_NAME"
		export DIR_THISTOOL_LOG_ROTATE="$DIR_TOOL_LOG_ROTATE/$TOOL_NAME"
		export DIR_LOG_CURRENT="$DIR_THISTOOL_LOG_CURRENT/`date "+%Y-%m-%d"`__$HOUR:$MINT"
		export DIR_LOG_ROTATE="$DIR_THISTOOL_LOG_ROTATE/`date "+%Y-%m-%d"`__$HOUR:$MINT"
		for arg in $*                                          
		do
			CMD_ARGS="$CMD_ARGS $arg"
		done
		sh $DIR_TOOL_SCRIPT/$TOOL_NAME/runme.sh $CMD_ARGS
		exit
	fi
done

echo "ERROR: 错误的command \"$CMD\""
usage; exit
