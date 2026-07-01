#!/bin/bash
##############################################################################
#    Func Name: install.sh
# Date Created: 2017-11-8
#       Author: zhangyibing
#  Description: install ha package;
#        usage: 1. $0 [$1]
#               $1: install package dir
#       Output:
#       Return: 0  : success
#-----------------------------------------------------------------------------
#  Modification History
#  DATE        NAME             DESCRIPTION
##############################################################################

#ha install package dir. not modify this dir.
HA_PACKAGE_DIR=$1
FRONT_INSTALL_FLAG=/root/h3c-cas
if [ "X$HA_PACKAGE_DIR" = "X" ]; then
    HA_PACKAGE_DIR=/root/cha.package
else
    HA_PACKAGE_DIR=$HA_PACKAGE_DIR/cha.package
fi

function rpm_install
{
    local name=$1
    if rpm -q $name >/dev/null;then
        rpm -e $name --nodeps
    fi

    if ! rpm -ivh --force $HA_PACKAGE_DIR/$name-*;then
        echo "failed to install $name"
        exit 1
    fi
}

# config /etc/rsyslog.conf for cas_mon
is_exist=0
while read -r line
do
    result=$(echo $line | grep "kern.*,daemon.* @127.0.0.1:")
    if [[ "$result" != "" ]];then
        is_exist=1
    fi
done < /etc/rsyslog.conf

if [ $is_exist -eq 0 ];then
   echo "kern.*,daemon.* @127.0.0.1:27001" >> /etc/rsyslog.conf
   service rsyslog restart
fi

cp -f $HA_PACKAGE_DIR/casaudit.conf /etc 2>/dev/null
cp -f $HA_PACKAGE_DIR/casmon.conf /etc/cvk/ 2>/dev/null
cp -f $HA_PACKAGE_DIR/cha.conf /etc/cvk/  2>/dev/null
cp -f $HA_PACKAGE_DIR/GET_HOST_HW_INFO.xml /etc/cvk/ 2>/dev/null
cp -f $HA_PACKAGE_DIR/server_product_list /etc/cvk 2>/dev/null

distri=$(/opt/bin/os_lsb_release -is)
if [ "$distri" = "CentOS" -o "$distri" = "H3Linux" ]; then
    if [ -d /usr/share/cvm/ ];then
        rpm_install cvm_ha
    fi

    rpm_install cvk_ha
    rpm_install cas_mon
    rpm_install cha

    install -m 0644 $HA_PACKAGE_DIR/cha.logrotate /etc/logrotate.d/cha
    
    rpm_install sysaudit-pydaemon
    rpm_install sysaudit-kernel
	
	echo "* *    * * *   root    /opt/bin/cha_realtime_check_ha.sh" >> /etc/crontab
    
    rm -rf $HA_PACKAGE_DIR/*.rpm
else
    cp -f $HA_PACKAGE_DIR/scripts/* /opt/bin

    dpkg -i --force-overwrite $HA_PACKAGE_DIR/casha.deb
    dpkg -i --force-overwrite $HA_PACKAGE_DIR/python-sysaudit_*.deb
    dpkg -i --force-overwrite $HA_PACKAGE_DIR/sysaudit-kernel_*.deb

    echo "* *    * * *   root    /opt/bin/cha_realtime_check_ha.sh" >> /etc/crontab
    echo "1 2    * * *   root    /opt/bin/cha_ha_delete_vm_backup_conf.sh" >> /etc/crontab
    rm -f $HA_PACKAGE_DIR/*.deb
fi

echo "install cha package success"
exit 0
