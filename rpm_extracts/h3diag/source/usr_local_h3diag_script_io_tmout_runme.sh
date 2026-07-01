#/bin/bash

CMD=$1
TOOL_NAME="io_tmout"    		# 一定不能为空！！

THRESHOLD=3600
source $DIR_TOOL_INCLUDE/general_function.sh
source $DIR_SCRIPT/tool.def

usage() 
{ 
        cat <<-END >&2 

H3Linux 操作系统诊断工具io_tmout功能使用方法
  Description: 
    块设备内核态IO监控工具，可用于调查IO超时问题。
  Usage: 
     h3diag io_tmout <$TOOL_CMD> [ARGS]
              help                       # io_tmout功能帮助信息
              enable                     # 开启io_tmout抓取功能，-i不指定时，-b -d是必选参数
                    -b                   # 磁盘或分区名称，一次只能抓一个块设备
                    -d                   # 抓取持续时间（s），范围1-3600
                    -i                   # blktrace原始数据的路径
              report                     # 打印最新抓取到的IO统计报告，不指定参数时默认显示btt的报告
                    btt                  # 查看汇总报告
                    parse                # 查看io 详细信息
                    lat <d2c|q2c|q2d>    # 查看d2c|q2c|q2d的延时报告
                    top <q2g|g2i|q2d|    # 查看d2c|q2c等阶段延时最大的io相关信息
                         i2d|d2c|q2c>
              clean                      # 清理理系统中io_tmout抓取的所有数据信息，释放磁盘空间
  Examples：
     h3diag io_tmout enable -b sda -d 20    # 启动io_tmout抓取IO功能,抓取整个sda磁盘的IO，持续20s
     h3diag io_tmout enable -b sda2 -d 30   # 启动io_tmout抓取IO功能,抓取sda2分区的IO，持续30s
     h3diag io_tmout report                 # 查看最新的btt追踪数据分析报告
     h3diag io_tmout report lat d2c         # 查看d2c延时报告
     h3diag io_tmout enable -i ../path_to_blktrace_data #将其他环境抓取的blk数据导入到h3diag中分析

END
        exit
} 

parameter_check()
{
  if [[ -n "$IMPORT_DIR" ]];then

    [ ! -d "$IMPORT_DIR" ] && echo "ERROR: $IMPORT_DIR 目录不存在" && exit

    BLK_DEVICE=`ls $IMPORT_DIR/*.blktrace.0 2>/dev/null | cut -d '.' -f 1`
    BLK_DEVICE=${BLK_DEVICE##*/}
    [ ! -n "$BLK_DEVICE" ] && echo "ERROR: $IMPORT_DIR 目录中没有有效数据" && exit
    return
  fi

	if [[ ! $BLK_DEVICE ]];then
		echo "ERROR: 必须指定-b(抓取磁盘/分区)参数"; exit
	elif ! stat /dev/$BLK_DEVICE 2>/dev/null 1>/dev/null ;then
		echo "ERROR: 错误的-b参数，不存在块设备 $BLK_DEVICE"; exit
	fi

	if [[ ! $DURATION ]] || [[ "$DURATION" -lt 1 ]] || [[ "$DURATION" -gt $THRESHOLD ]];then
		echo "ERROR: 必须指定-d参数，-d参数范围(1-$THRESHOLD)"; exit
	fi
}

analyze_report() 
{ 
  BIN_FILE="$DIR_LOG_CURRENT/${BLK_DEVICE}.blktrace.bin" 

  echo "analyze parse report..." 
  blkparse -i $BLK_DEVICE -D $DIR_LOG_CURRENT -d $BIN_FILE -o $DIR_DATA_LOG_CURRENT/$BLK_DEVICE.parse --quiet > /dev/null

  echo "analyze btt report..." 
  btt -i $BIN_FILE >> $DIR_DATA_LOG_CURRENT/$BLK_DEVICE.btt 
  btt -i $BIN_FILE -I $DIR_DATA_LOG_CURRENT/$BLK_DEVICE.iostat > /dev/null 

  echo "analyze latency report..." 
  btt -i $BIN_FILE -l $DIR_DATA_LOG_CURRENT/$BLK_DEVICE.lat > /dev/null 
  btt -i $BIN_FILE -q $DIR_DATA_LOG_CURRENT/$BLK_DEVICE.lat > /dev/null 
  btt -i $BIN_FILE -z $DIR_DATA_LOG_CURRENT/$BLK_DEVICE.lat > /dev/null 
  mv `pwd`/*ps_fp* $DIR_DATA_LOG_CURRENT 

  BLK_DEVNO=`ls $DIR_DATA_LOG_CURRENT/$BLK_DEVICE.lat*d2c.dat`
  BLK_DEVNO=${BLK_DEVNO##*/}
  BLK_DEVNO=`echo $BLK_DEVNO | cut -d '_' -f 2`
  echo $BLK_DEVNO > $DIR_DATA_LOG_CURRENT/devno
  echo "分析数据完成" 
} 

main_enable()
{
  DIR_DATA_LOG_CURRENT="$DIR_LOG_CURRENT/analyze_data"

  mkdir -p $DIR_DATA_LOG_CURRENT
  echo $BLK_DEVICE > $DIR_DATA_LOG_CURRENT/devname

  if [[ -n "$IMPORT_DIR" ]];then
    cp $IMPORT_DIR/* $DIR_LOG_CURRENT/
  else
    echo "`date`       抓取 $BLK_DEVICE 持续 $DURATION s" > $DIR_DATA_LOG_CURRENT/$BLK_DEVICE.btt
    echo "INFO: 抓取 $BLK_DEVICE 过程要持续 $DURATION s，可手动键入 Ctrl+C 终止，但会导致本次抓取失效"
    blktrace -d /dev/$BLK_DEVICE -w $DURATION -D $DIR_LOG_CURRENT
  fi
  
  analyze_report
}

err_exit()
{
  echo "ERROR: 文件 $REPORT_FILENAME 不存在, 请先执行 enable 命令."
  usage 
  exit
}

analyze_top_x2x() 
{ 
  if [ "$REPORT_ARG" != "d2c" ] && [ "$REPORT_ARG" != "q2g" ] && [ "$REPORT_ARG" != "g2i" ] &&  
     [ "$REPORT_ARG" != "i2d" ] && [ "$REPORT_ARG" != "q2c" ] && [ "$REPORT_ARG" != "q2d" ]; then
    echo "ERROR: invalid arg $REPORT_ARG"
    usage 
    exit
  fi

  TOP_AN_DIR=$NEW_LOG_DIR_REPORT/analyze_data/top_tmp 
  mkdir -p $TOP_AN_DIR

  declare -u START=${REPORT_ARG%2*} 
  declare -u END=${REPORT_ARG#*2} 

  # 如果该结果已分析过,直接返回 
  [ -f $NEW_LOG_DIR_REPORT/analyze_data/$DEVNAME.top.${REPORT_ARG}.dat ] && return 

  CRTDIR=$(pwd) 
  cd $TOP_AN_DIR 

  # 如果文件存在就不需要再生成一次 
  [ -f parse.log ] || sed -e '/^CPU0/,$d' ../$DEVNAME.parse > parse.log 

  echo "filter and sort" 
  grep $START parse.log | awk '{print $4" "$8}'> $START 
  cat $START | sort -k 2n,2 -k 1n,1 > $START.sort 
  awk '{print $2}' $START.sort > $START.sort.col2 

  grep $END parse.log | awk '{print $4" "$8}'> $END 
  cat $END | sort -k 2n,2 -k 1n,1 > $END.sort 
  awk '{print $2}' $END.sort > $END.sort.col2 

  echo "compare two file" 
  comp_del_diff $START.sort.col2 $END.sort.col2 $START.sort $END.sort 

  echo "calculate duration" 
  awk 'NR==FNR{a[NR]=$0;next}NR>FNR{print a[FNR],$0}' $START.sort $END.sort > merge.log 
  awk '{printf("%.9f\t%.9f\t%.9f\t%10d\t%10d\n", $1,$3,$3-$1,$2,$4)}' merge.log > rest.log 

  echo "find the top ${REPORT_ARG}" 
  sort -n -k 3 -r rest.log > ../$DEVNAME.top.${REPORT_ARG}.dat 
  sed -i "1i ${START}time\t\t${END}time\t\tduration(S)\t  ${START}blkno\t${END}blkno" ../$DEVNAME.top.${REPORT_ARG}.dat
  cd $CRTDIR 
}

main_report()
{
  cd $NEW_LOG_DIR_REPORT/analyze_data/

  DEVNAME=`cat devname`
  DEVNO=`cat devno`
  case $REPORT_TYPE in
    btt|parse) REPORT_FILENAME=$DEVNAME.$REPORT_TYPE ;;
    lat) REPORT_FILENAME=${DEVNAME}.lat_${DEVNO}_${REPORT_ARG}.dat ;;
    top) analyze_top_x2x; REPORT_FILENAME=${DEVNAME}.top.${REPORT_ARG}.dat ;; 
    *) REPORT_FILENAME=$REPORT_TYPE ;;
  esac

  [ ! -f $REPORT_FILENAME ] && err_exit; 
	cat $REPORT_FILENAME | less
}

if [[ ! "$CMD" ]];then		# 空命令返回usage
        usage; exit
fi

shift 1
if [[ "$CMD" = "enable" ]];then
	blktrace_tool_check
        while getopts b:d:i:h opt
        do
                case $opt in
                b)      parameter_repeat_check _$BLK_DEVICE b; BLK_DEVICE=$OPTARG ;;
                d)      parameter_repeat_check _$DURATION d; DURATION=$OPTARG ;;
                i)      parameter_repeat_check _$IMPORT_DIR i; IMPORT_DIR=$OPTARG ;; 
                h|?)    usage ;;
                esac
        done
	parameter_check
	main_enable

elif [[ "$CMD" = "report" ]];then
	NEW_LOG_DIR_REPORT=$(find_newest_log_dir)
  REPORT_TYPE=${1:-btt}
  [ "$REPORT_TYPE" = "lat" ] && shift 1 && REPORT_ARG=$1
  [ "$REPORT_TYPE" = "top" ] && shift 1 && REPORT_ARG=$1
	main_report 

elif [[ "$CMD" = "clean" ]];then
	if [[ `ps aux | grep -E "blktrace -d|blkparse|btt" | grep -v "grep"` ]];then
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
