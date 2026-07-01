#!/bin/sh
#=================OS Type====================

OS_Kylin=`cat /etc/os-release | grep 'Kylin'`
OS_UOS=`cat /etc/os-release | grep 'uos'`


if [ "$OS_UOS" != "" ]
then
    cp -rf ./ESM/uos_*.tar.gz ./template/Temp/iNodeClient/
	cp -rf /opt/apps/com.manager.inode.amd/files/ESM/uos_*.tar.gz /opt/apps/com.manager.inode.amd/files/template/Temp/iNodeClient/
	cp -rf /opt/apps/com.manager.inode.arm/files/ESM/uos_*.tar.gz /opt/apps/com.manager.inode.arm/files/template/Temp/iNodeClient/
elif [ "$OS_Kylin" != "" ]
then
   cp -rf ./ESM/kylin*.tar.gz ./template/Temp/iNodeClient/
   cp -rf /opt/apps/com.manager.inode.amd/files/ESM/kylin*.tar.gz /opt/apps/com.manager.inode.amd/files/template/Temp/iNodeClient/
   cp -rf -rf /opt/apps/com.manager.inode.arm/files/ESM/kylin*.tar.gz -rf /opt/apps/com.manager.inode.arm/files/template/Temp/iNodeClient/
fi

