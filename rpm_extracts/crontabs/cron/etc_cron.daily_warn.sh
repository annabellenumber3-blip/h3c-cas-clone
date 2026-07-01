#!/bin/bash

Memory_free=`free -m | awk 'NR==2{print $4}'`
CPU_IDLE=`iostat | awk 'NR==4{print $6}'|cut -c 1-2`

if [ $Memory_free -lt 1024 ]; then     #1024表示小于1G内存报警，可自定义
        echo "Warning! High memory usage!"
else
        echo "Memory is enough!"
fi

if [ $CPU_IDLE -lt 10 ]; then          #10表示小于10%进行报警，可自定义
        echo " Warning! High CPU usage!"
else
        echo "CPU idle!"
fi

