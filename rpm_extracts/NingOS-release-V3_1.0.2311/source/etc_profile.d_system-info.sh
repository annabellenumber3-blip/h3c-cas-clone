#/bin/bash
#Copyright (c) [2019] Huawei Technologies Co., Ltd.
#generic-release is licensed under the Mulan PSL v2.
#You can use this software according to the terms and conditions of the Mulan PSL v2.
#You may obtain a copy of Mulan PSL v2 at:
#     http://license.coscl.org.cn/MulanPSL2
#THIS SOFTWARE IS PROVIDED ON AN "AS IS" BASIS, WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR
#IMPLIED, INCLUDING BUT NOT LIMITED TO NON-INFRINGEMENT, MERCHANTABILITY OR FIT FOR A PARTICULAR
#PURPOSE.
#See the Mulan PSL v2 for more details.

# Welcome
welcome=$(uname -r)

# Memory
memory_total=$(cat /proc/meminfo | awk '/^MemTotal:/ {printf($2)}')
memory_free=$(cat /proc/meminfo | awk '/^MemFree:/ { printf($2)}')
buffers=$(cat /proc/meminfo | awk '/^Buffers:/ { printf($2)}')
cached=$(cat /proc/meminfo | awk '/^Cached:/ { printf($2)}')
sreclaimable=$(cat /proc/meminfo | awk '/^SReclaimable:/ { printf($2)}')
swap_total=$(cat /proc/meminfo | awk '/^SwapTotal:/ { printf($2)}')
swap_free=$(cat /proc/meminfo | awk '/^SwapFree:/ { printf($2)}')


if [ $memory_total -gt 0 ]
then
    memory_usage=`echo "scale=1; ($memory_total - $memory_free - $buffers - $cached - $sreclaimable) * 100.0 / $memory_total" |bc`
    memory_usage="${memory_usage}%"
else
    memory_usage=0.0%
fi

# Swap memory
if [ $swap_total -gt 0 ]
then
    swap_mem=`echo "scale=1; ($swap_total - $swap_free) * 100.0 / $swap_total" |bc`
    swap_mem="${swap_mem}%"
else
    swap_mem=0.0%
fi

# Usage
usageof=$(df -h / | awk '/\// {print $(NF-1)}')

# System load
load_average=$(awk '{print $1}' /proc/loadavg)

# WHO I AM
whoiam=$(whoami)

# Time
time_cur=$(date)

# Processes
processes=$(ps aux | wc -l)

# Users
user_num=$(users | wc -w)

# 获取当前用户的口令到期天数
if LANG=en_US.UTF-8 chage -l $USER | grep -q "Password expires" ; then
    password_expire_date=$(LANG=en_US.UTF-8 chage -l $USER | grep "Password expires" | awk -F": " '{print $2}')
else
    password_expire_date=$(LANG=en_US.UTF-8 chage -l $USER | grep "密码过期时间" | awk -F"： " '{print $2}')
fi


failed_attempts=$(expr $(lastb | wc -l) - 2)
successful_attempts=$(expr $(last | wc -l) - 2)


# Ip address
ip_pre=""
if [ -x "/sbin/ip" ]
then
    ip_pre=$(/sbin/ip a | grep inet | grep -v "127.0.0.1" | grep -v inet6 | awk '{print $2}')
fi

echo -e "\n"
echo -e "Welcome to $welcome\n"
echo -e "System information as of time: \t$time_cur\n"
echo -e "System load: \t\033[0;33;40m$load_average\033[0m"
echo -e "Processes: \t$processes"
echo -e "Memory used: \t$memory_usage"
echo -e "Swap used: \t$swap_mem"
echo -e "Usage On: \t$usageof"
for line in $ip_pre
do
    ip_address=${line%/*}
    echo -e "IP address: \t$ip_address"
done

if [[ "$password_expire_date" == "never" || "$password_expire_date" == "从不" ]]; then
    echo -e "Password expiration time：\tnever"
else
    today=$(date +%s)
    expire=$(LANG=en_US.UTF-8 date -d "$password_expire_date" +%s)
    password_expire_days=$(( ($expire - $today) / (3600 * 24) ))

    echo -e "Password expiration time: \t$password_expire_days days"
fi
echo -e "Failed Login Attempts: \t$failed_attempts"
echo -e "successful Login Attempts: \t$successful_attempts"

echo -e "Users online: \t$user_num"
if [ "$whoiam" == "root" ]
then
    echo -e "\n"
else
    echo -e "To run a command as administrator(user \"root\"),use \"sudo <command>\"."
fi

