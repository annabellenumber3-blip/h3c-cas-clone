#!/bin/bash
############################################################################
#File Name: cvd_process_checker.sh
#Date Created: 2019-09-04
#Author: tuguoyi
#Description: Check if cvd-ds process is stopped, and start it automatically
#Input: $0
#Output: None
#Return: 0 if successfully, other with errors
#Caution:
#-----------------------------------------------------------------------------
#Modification History
#DATE        NAME             DESCRIPTION
#
##############################################################################
#Detection cvd-ds process is running
PORCNAME="cvd-ds"

CVDPID=`pidof ${PORCNAME}`
if [ "x${CVDPID}" = "x" ];then
    rm -rf /var/run/${PORCNAME}.pid
    service ${PORCNAME} start
    if [ $? -ne 0 ];then
        echo "Failed to start cvd-ds!!!"
    fi
fi