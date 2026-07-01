#!/bin/bash

umask 0077
LOCK_FILE=/var/lock/os_check_timezone_change.lock
exec 200<>$LOCK_FILE
flock -nx 200
if [ $? -ne 0 ];then
	echo "$0 is running, can not run it twice at one time" >/dev/kmsg
	exit 1
fi

FILE_TMP="/etc/localtime_tmp"
OLD_TIME_ZONE=""

fn_is_container_pid()
{
#test whether the specified pid is a process in container from host.
#a process is in container if its namespace is not same as pid1.
local pid="$1"
local ns_pid1=/proc/1/ns/pid
local ns_target=/proc/$pid/ns/pid
local -i ret=0 #default to false
if [ -f "$ns_pid1" -a -f "$ns_target" ] ; then
	ns_pid1=$(readlink -sn "$ns_pid1")
	ns_target=$(readlink -sn "$ns_target")
	if [ "$ns_pid1" != "$ns_target" ] ; then
		ret=1
	fi
fi
return $ret
}

#kill process on the host instead of the container
fn_container_protect_kill()
{
local pid="$1"
local signal="${2:-"TERM"}"
local cmdline_part="${3:-""}"

if [ -d "/proc/$pid" ] ; then
	fn_is_container_pid "$pid"
	if [ $? -eq 0 ] ; then
		if [ -n "$cmdline_part" ] ; then
			full_cmdline=$(xargs -0 <"/proc/$pid/cmdline" 2>/dev/null)
			if [[ "$full_cmdline" == *"$cmdline_part"* ]] ; then
				#kill only when cmdline matches
				kill -$signal $pid
			fi
		else
			kill -$signal $pid
		fi
	else
		echo "pid [$pid] is a process from container or has already terminated, do not kill." >/dev/kmsg
	fi
fi
}

#Restart rsyslog and cron services
fn_restart_syslog_and_cron()
{

	local rsyslogd_path="/usr/sbin/rsyslogd"

	systemctl restart rsyslog
	systemctl restart crond
	#ensure there is only rsyslog instance after restarting
	for (( i=0;i<3;i++ ));do
		sleep 2
		pids=(`/usr/sbin/pidof ${rsyslogd_path}`)
		num=${#pids[@]}
		if [ "$num" -eq "1" ];then
			return 0
		elif [ "$num" -gt "1" ];then
			echo "fn_restart_syslog ret:$num, do killall syslog...." >/dev/kmsg
			for ((i=0;i<num;i++));do
				fn_container_protect_kill "${pids[${i}]}" kill "${rsyslogd_path}"
			done
			systemctl start rsyslog
		else
			systemctl start rsyslog
		fi
	done
	return 0
}

if [ -f ${FILE_TMP} ];then
	OLD_TIME_ZONE=`cat ${FILE_TMP}`
	timezone=`date +%Z%z`
	if [ "$timezone" != "$OLD_TIME_ZONE" ];then
		echo "timezone changed....new ${timezone} old ${OLD_TIME_ZONE}" >/dev/kmsg
		fn_restart_syslog_and_cron
	fi
fi
date +%Z%z > ${FILE_TMP}
