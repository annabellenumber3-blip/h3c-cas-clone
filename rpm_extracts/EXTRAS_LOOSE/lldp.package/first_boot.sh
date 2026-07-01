#!/bin/bash
##############################################################################
#    Func Name: first_boot.sh
# Date Created: 2013-12-20
#       Author: gaoliang
#  Description: run at the first boot of system
#        usage: 1. $0 [$1]
#       Output:
#       Return: 0  : success
#-----------------------------------------------------------------------------
#  Modification History
#  DATE        NAME             DESCRIPTION
#  2014-05-19  caizhifeng 02925 enable lldp tx on each ethx port default.
##############################################################################
distri=$(/opt/bin/os_lsb_release -is)
#if the lldpad service is running; then do it
if [ "X$distri" = "XUbuntu" ]; then
	lldpadstatus=`service lldpad status | grep running`
elif [ "X$distri" = "XCentOS" ]; then
	lldpadstatus=`systemctl is-failed lldpad.service | grep active`
fi
if [ "X${lldpadstatus}" = "X" ]; then
    logger -s "lldpad-first-boot: lldpad service abnormal!"
else
    logger -s "lldpad-first-boot: lldpad is running!"
    ports=$(ls /sys/class/net | grep "^eth[0-9]\+$" | tr '\n' ' ')
    for port in $ports; do
	`/opt/bin/lldp_enable.sh $port 0 >/dev/null 2>&1`
	logger -s "disable $port lldp."
    done
fi
