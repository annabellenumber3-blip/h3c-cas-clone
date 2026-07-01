#!/bin/bash

function find_newest_log_dir()
{
	NEW_LOG_CHILD_DIR="`ls -lt $DIR_THISTOOL_LOG_CURRENT | grep -Ev "total|raw_data" | head -n 1 | awk '{print $9}'`"
	NEW_LOG_DIR="$DIR_THISTOOL_LOG_CURRENT/$NEW_LOG_CHILD_DIR"
	echo $NEW_LOG_DIR
} 

function hist_print()
{
	for i in {0..15}	# 初始化统计数组
	do
		ARRAY[i]=0
	done

	total_counts=0
	distribution=1
	while read -r line
	do
		for i in {0..14}
		do
			dis_tmp=`echo $distribution | awk '{print lshift($0, '$i')}'`
			if [[ $line -lt $dis_tmp ]];then
				let ARRAY[i]=${ARRAY[i]}+1
				hit=1
				break
			fi
		done
		if [[ $hit -ne 1 ]];then
			let ARRAY[15]=${ARRAY[15]}+1
		fi
		hit=0
		let total_counts=$total_counts+1
	done < $1

	dis_prt_start=1
	echo "        msecs        :   count  | distribution"		# 表头
	awk 'BEGIN{for (;i++<86;)printf "-"; print ""}'			# 分割线
	if [[ $total_counts -eq 0 ]];then	# 防止后面除法报错
		echo "ERROR: No vaild data. Please try again."; return
	fi
	for i in {0..15}
	do
		hist_log_percent=`awk 'BEGIN{printf "%.2f\n", '${ARRAY[i]}'/'$total_counts'}'`
		hist_log_num=`awk 'BEGIN{printf "%d\n", '$hist_log_percent'*'$distribution_max_star'}'`
		if [[ $hist_log_num -eq 0 ]] && [[ ${ARRAY[i]} -ne 0 ]];then	# 保证至少能打出一个*
			hist_log_num=1
		fi
		if [[ $i -eq 0 ]];then	# 如果是第一组数据，则应该是0-1，重置dis_prt_start
			dis_prt_end=1
			dis_prt_start=0
		else
			dis_prt_end=`echo $dis_prt_start | awk '{print lshift($0, 1)}'`
		fi
		if [[ $i -lt 15 ]];then
			printf "%8s -> %-8s : %8s | %-50s |\n" $dis_prt_start $dis_prt_end ${ARRAY[i]} "`awk 'BEGIN{for (;i++<'$hist_log_num';)printf "*"}'`"
		else
			printf "%8s -> ~~       : %8s | %-50s |\n" $dis_prt_start ${ARRAY[i]} "`awk 'BEGIN{for (;i++<'$hist_log_num';)printf "*"}'`"
		fi
		dis_prt_start=$dis_prt_end
	done
	awk 'BEGIN{for (;i++<86;)printf "-"; print ""}'			# 分割线
}

function general_clean_function()
{
	
	if [[ -z "$TOOL_NAME" ]]; then
		echo "ERROR: TOOL_NAME 变量为空，请检查脚本"; exit
	fi
	if [[ `ls -l $DIR_THISTOOL_LOG_CURRENT | grep -v "total"` ]] \
		|| [[ `ls -l $DIR_THISTOOL_LOG_ROTATE | grep -v "total"` ]];then
		read -p "确定要删除 $TOOL_NAME 工具所有收集的日志吗 (yes为确认，其他视为取消)? " comfirm
		case $comfirm in
			Y|y|YES|yes)
				# 这里使用DIR_TOOL_LOG_* 以及TOOL_NAME获取路径是为了防止删除成/*，因为TOOL_NAME会在调用的脚本中写死
				rm -rf $DIR_TOOL_LOG_ROTATE/$TOOL_NAME/* $DIR_TOOL_LOG_CURRENT/$TOOL_NAME/*
				if [[ $? -eq 0 ]];then
					echo "$TOOL_NAME log clean successfully!"
				else
					echo "$TOOL_NAME log clean failed!"
				fi
				;;
			*)
				echo "INFO: 取消clean操作"; exit
				;;
		esac	
	else
		echo "$TOOL_NAME log has been empty!"
	fi
}

function kernel_devel_check()
{
	if [[ ! `rpm -qa | grep kernel-devel-$KERNEL_VERSION` ]];then
		echo "ERROR: 缺少 kernel-devel rpm包, 请先安装 kernel-devel-$KERNEL_VERSION rpm包"; exit
	fi
}

function parameter_repeat_check()
{
	PARAMETER_DATA=$1
	PARAMETER_TYPE=$2
	if [[ $PARAMETER_DATA != "_" ]];then
		echo "ERROR: 重复的 -$PARAMETER_TYPE 参数"; exit
	fi
}

function perf_tool_check()
{
	if [[ ! `rpm -qa | grep perf-5.10` ]];then	# 直接使用perf-5.10版本，可省略后续的格式转化步骤
		echo "INFO: 没有合适的perf软件包, 首先 安装/升级 perf软件包"
		rpm -Uvh $DIR_TOOL_PERF_RPMS/perf-5.10*.rpm --force
		if [[ $? -eq 0 ]];then	
			echo "INFO: perf软件包 安装/升级 成功."
		else
			echo "ERROR: perf软件包 安装/升级 失败."; exit
		fi
	fi
}

function blktrace_tool_check()
{
	if [[ ! `rpm -qa | grep -E "^blktrace"` ]];then
		echo "INFO: 没有合适的blktrace软件包, 首先 安装/升级 blktrace软件包"
		rpm -Uvh $DIR_TOOL_BLKTRACE_RPMS/blktrace-*.rpm --force
		if [[ $? -eq 0 ]];then
			echo "INFO: blktrace软件包 安装/升级 成功."
		else
			echo "ERROR: blktrace软件包 安装/升级 失败."; exit
		fi
	fi
}

function bcc_tool_check()
{
	if [[ ! `cat /boot/config-$KERNEL_VERSION | grep "^CONFIG_BPF_SYSCALL=y"` ]];then
		echo "WARN:  当前内核没有配置CONFIG_BPF_SYSCALL编译选项。“-F”功能可能无法正常使用"
	fi
	kernel_devel_check
	if [[ ! `rpm -qa | grep -E "^bcc-tools-0.10.0"` ]];then
		echo "ERROR: bcc-tools 工具不存在或低于bcc-tools-0.10.0，请先安装bcc-tools-0.10.0及以上版本"; exit
	fi
}

###############################################################################################
# desc: 输入2个坐标文件,找出2个文件的差异坐标,然后按找到的坐标删除输出文件的内容 
#       例如原始文件记录了timestamp blkno信息如下,
#       --- file3 ---      ---  file4 ---
#       0.11 1001          0.13  1002 
#       0.12 1011          0.14  1011
#       1.12 2011          1.23  2012
#       如果用diff命令比较file3和file4,每一行都不一样.实际上我们只想找出第2列,2个文件的差异
#       所以坐标文件相对原文件,里面存放了希望找出差异的内容.
#       --- file1 ---      ---  file2 ---
#       1001               1002
#       1011               1011
#       2011               2012
#       file1和file2相比较,需要删除2个文件的第1和第3行之后,2个文件才相同,
#       最后比较file1和file2的差异,在file3和file4中执行相应的删除操作
#       调用该函数之后,file3和file4的内容变为
#       --- file3 ---      --- file4 ---
#       0.12 1011          0.14  1011
# input:  file1 file2
# output: file3 file4
##############################################################################################
function comp_del_diff()
{
  diff $1 $2 | grep '^[0-9]' > diff.d
  sed -i 's/c/da/' diff.d 

  str=`grep d -m 1 diff.d`
  if [ -n "$str" ];then
    cmd=`grep d diff.d | awk -F 'd' 'NR==1{a=$1}NR>1{a=sprintf("%sd;%s",a,$1)}END{printf("%sd",a)}'`
    sed -i "$cmd" $3
  fi

  str=`grep a -m 1 diff.d`
  if [ -n "$str" ];then
    cmd=`grep a diff.d | awk -F 'a' 'NR==1{a=$2}NR>1{a=sprintf("%sd;%s",a,$2)}END{printf("%sd",a)}'`
    sed -i "$cmd" $4
  fi
}
