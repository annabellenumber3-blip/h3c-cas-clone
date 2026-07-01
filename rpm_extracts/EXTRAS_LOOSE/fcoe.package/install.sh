##############################################################################
#    Func Name: install.sh
# Date Created: 2015-10-20
#       Author: wangyongqing
#  Description: install fcoe package;
#        usage: 1. $0 [$1]
#               $1: install package dir
#       Output:
#       Return: 0  : success
#-----------------------------------------------------------------------------
#  Modification History
#  DATE        NAME             DESCRIPTION
##############################################################################

#fcoe install package dir. not modify this dir.
FCOE_PACKAGE_DIR=$1
if [ "X$FCOE_PACKAGE_DIR" = "X" ]; then
    FCOE_PACKAGE_DIR=/root/fcoe.package
else
    FCOE_PACKAGE_DIR=$FCOE_PACKAGE_DIR/fcoe.package
fi

distri=$(/opt/bin/os_lsb_release -is)
if [ "$distri" = "CentOS" ]; then
    [ -e /usr/sbin/fcoemon ] && rm -f /usr/sbin/fcoemon
    cp -f $FCOE_PACKAGE_DIR/fcoemon /usr/sbin
    chmod +x /usr/sbin/fcoemon

    if [ ! -d /etc/udev/rules.d/ ];then
        mkdir -p /etc/udev/rules.d/
    fi
    cp -f $FCOE_PACKAGE_DIR/71-persistent-fcoe.rules /etc/udev/rules.d/

    sed -i 's/DCB_REQUIRED="yes"/DCB_REQUIRED="no"/g' /etc/fcoe/cfg-ethx
    systemctl enable fcoe.service
    systemctl start fcoe.service
    exit 0
fi

if [ "$distri" = "H3Linux" ]; then
    if [ ! -d /etc/udev/rules.d/ ];then
        mkdir -p /etc/udev/rules.d/
    fi
    cp -f $FCOE_PACKAGE_DIR/71-persistent-fcoe.rules /etc/udev/rules.d/

    sed -i 's/DCB_REQUIRED="yes"/DCB_REQUIRED="no"/g' /etc/fcoe/cfg-ethx
    systemctl enable fcoe.service
    systemctl start fcoe.service
    exit 0
fi

cp -f $FCOE_PACKAGE_DIR/scripts/* /opt/bin
dpkg -i $FCOE_PACKAGE_DIR/open-fcoe-*_amd64.deb

is_exist=$(grep "/opt/bin/fcoemon_check.sh" /etc/crontab)
if [ "X$is_exist" = "X" ]; then
    echo "* *    * * *   root    /opt/bin/fcoemon_check.sh" >> /etc/crontab
fi

rm $FCOE_PACKAGE_DIR/*.deb
exit0
