#!/bin/bash

UNAME_MACHINE=`uname -m`
INSTALL_DIR=$(cd `dirname $0`;pwd)
#fsm install package directory.
FSM_PACKAGE_DIR=$1
if [ "X$FSM_PACKAGE_DIR" = "X" ]; then
    FSM_PACKAGE_DIR=/root/fsm.package
else
    # install RPM package using the path
    FSM_PACKAGE_DIR=$FSM_PACKAGE_DIR/fsm.package
fi
FSM_DEB_NAME="flexible-stor-manager_*amd64.deb"
FSM_RPM_NAME="flexible-stor-manager-*$UNAME_MACHINE.rpm"

function install_deb_pkg()
{
    echo -e "Begin to install fsm debain package"
    dpkg --force-confnew -i $FSM_PACKAGE_DIR/$FSM_DEB_NAME
    if [ $? -ne 0 ]; then
        echo "[Error] Fail to install fsm debain package."
        exit 1
    fi
    echo -e "Finish to install fsm debain package"
}

function install_rpm_pkg()
{
    echo -e "Begin to install fsm RPM package"
    rpm -ivh --force $FSM_PACKAGE_DIR/$FSM_RPM_NAME
    if [ $? -ne 0 ]; then
        echo "[Error] Fail to install fsm RPM package."
        exit 1
    fi

    install -m 0644 $FSM_PACKAGE_DIR/fsm.logrotate /etc/logrotate.d/fsm
    echo -e "Finish to install fsm RPM package"
}

#----------------------------main------------------------------#
cd $INSTALL_DIR

if [ -f $FSM_PACKAGE_DIR/$FSM_DEB_NAME ];then
    install_deb_pkg
else
    install_rpm_pkg
fi
