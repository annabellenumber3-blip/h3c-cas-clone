#!/bin/bash
##############################################################################
#    Func Name: install.sh
# Date Created: 2019-6-13
#  Description: install cvd package;
#        usage: 1. $0 [$1]
#               $1: install package dir
#       Output:
#       Return: 0  : success
#-----------------------------------------------------------------------------
#  Modification History
#  DATE        NAME             DESCRIPTION
##############################################################################

CVD_PACKAGE_DIR=$1
if [ "X$CVD_PACKAGE_DIR" = "X" ]; then
    CVD_PACKAGE_DIR=/root/cvd.package
else
    CVD_PACKAGE_DIR=$CVD_PACKAGE_DIR/cvd.package
fi

function rpm_install
{
    local name=$1
    if rpm -q $name >/dev/null;then
        rpm -e $name --nodeps
    fi

    if ! rpm -ivh --replacepkgs --replacefiles $CVD_PACKAGE_DIR/$name-*;then
        echo "failed to install $name"
        exit 1
    fi
}

distri=$(/opt/bin/os_lsb_release -is)
if [ "$distri" = "CentOS" ] || [ "$distri" = "H3Linux" ]; then
    rpm_install cvd

    install -m 0644 $CVD_PACKAGE_DIR/cvd.logrotate /etc/logrotate.d/cvd

    rm -rf $CVD_PACKAGE_DIR/*.rpm
else
    cp -f $CVD_PACKAGE_DIR/scripts/* /opt/bin

    dpkg -i --force-overwrite $CVD_PACKAGE_DIR/cvd.deb

    rm -f $CVD_PACKAGE_DIR/*.deb
fi
echo "* *    * * *   root    /opt/bin/cvd_process_checker.sh" >> /etc/crontab

echo "install cvd package success"
exit 0
