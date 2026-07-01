##############################################################################
#    Func Name: install.sh 
# Date Created: 2018-01-8
#       Author: mozhanfei
#  Description: install ms package;
#        usage: 1. $0 [$1]
#               $1: install package dir
#       Output:
#       Return: 0  : success
#-----------------------------------------------------------------------------
#  Modification History
#  DATE        NAME             DESCRIPTION
##############################################################################

#ha install package dir. not modify this dir.
MS_PACKAGE_DIR=$1
if [ "X$MS_PACKAGE_DIR" = "X" ]; then
    MS_PACKAGE_DIR=/root/cmsd.package
else
    MS_PACKAGE_DIR=$MS_PACKAGE_DIR/cmsd.package
fi
RELEASE=$(/opt/bin/os_lsb_release -is)
if [ "X$RELEASE" = "XH3Linux" ]; then
    if ! rpm -ivh --replacepkgs --replacefiles $MS_PACKAGE_DIR/cmsd-*;then
        echo "failed to install cmsd"
        exit 1
    fi
    rpm -ivh $MS_PACKAGE_DIR/drbd-utils*;
fi

chmod a+x $MS_PACKAGE_DIR/scripts/*
cp -f $MS_PACKAGE_DIR/scripts/* /opt/bin

if [ "X$RELEASE" = "XH3Linux" ]; then
    chmod a+x $MS_PACKAGE_DIR/drbd-overview
    cp -f $MS_PACKAGE_DIR/drbd-overview /usr/sbin/
fi

mv /opt/bin/crm_1 /opt/bin/crm
mv /usr/sbin/crm /usr/sbin/crm.bak 2>/dev/null
mv /opt/bin/cvm_main.sh.bak /opt/bin/cvm_main.sh
mv /opt/bin/cvm_resource_start.sh.bak /opt/bin/cvm_resource_start.sh
mv /opt/bin/cvm_resource_stop.sh.bak /opt/bin/cvm_resource_stop.sh
