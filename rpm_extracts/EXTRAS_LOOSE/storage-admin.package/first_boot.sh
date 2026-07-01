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
##############################################################################
SA_PACKAGE_DIR=$1
if [ "X$SA_PACKAGE_DIR" = "X" ]; then
    SA_PACKAGE_DIR=/root/storage-admin.package
else
    SA_PACKAGE_DIR=$SA_PACKAGE_DIR/storage-admin.package
fi
#iscsi
mv -f $SA_PACKAGE_DIR/iscsi/iscsid.conf /etc/iscsi

cp -f $SA_PACKAGE_DIR/iscsi/umountiscsi.sh /etc/init.d/
chmod +x /etc/init.d/umountiscsi.sh

#service
if [ -x /usr/bin/dpkg ];then
    #open-iscsi
    cp -f $SA_PACKAGE_DIR/iscsi/open-iscsi /etc/init.d/
    chmod +x /etc/init.d/open-iscsi
    service open-iscsi restart
else
    systemctl restart iscsid
fi

#modify vstor-lich config
#ip=$(ifconfig vswitch0 | grep "[[:space:]]inet addr:" | awk '{print $2}' | awk -F ':' '{print $2}')
#ip_3=$(echo $ip | awk -F '.' '{printf "%s.%s.%s", $1, $2,$3}')
#sed  "s/192.168.0/$ip_3/g" /opt/mds/etc/lich.conf > /opt/mds/etc/lich.conf.tmp
#mv -f /opt/mds/etc/lich.conf.tmp /opt/mds/etc/lich.conf
