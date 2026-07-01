#!/bin/bash
##############################################################################
#    Func Name: install.sh
# Date Created: 2017-03-29
#       Author: Lilei
#  Description: install usbredir and usbdem package;
#        usage: 1. $0 [$1]
#               $1: install package dir
#       Output:
#       Return: 0  : success
#-----------------------------------------------------------------------------
#  Modification History
#  DATE        NAME             DESCRIPTION
##############################################################################

PACKAGE_DIR=$1
if [ "X$PACKAGE_DIR" = "X" ]; then
    USBDEMD_PACKAGE_DIR=/root/usbdemd.package
else
    USBDEMD_PACKAGE_DIR=$PACKAGE_DIR/usbdemd.package
fi

CPU_ARCH=$(uname -p)
function install_deb
{
    #usbredir package
    dpkg -i $USBDEMD_PACKAGE_DIR/libusbredirparser1_0.7.1-1_amd64.deb
    dpkg -i $USBDEMD_PACKAGE_DIR/libusbredirhost1_0.7.1-1_amd64.deb
    dpkg -i $USBDEMD_PACKAGE_DIR/libusbredirparser-dev_0.7.1-1_amd64.deb
    dpkg -i $USBDEMD_PACKAGE_DIR/libusbredirhost-dev_0.7.1-1_amd64.deb
    dpkg -i $USBDEMD_PACKAGE_DIR/usbredirserver_0.7.1-1_amd64.deb

    #usbdem package
    dpkg -i $USBDEMD_PACKAGE_DIR/usbdem_0.1.1-1_amd64.deb
}

function install_rpm
{
    #usbredir package
    rpm -ivh --replacepkgs --replacefiles $USBDEMD_PACKAGE_DIR/usbredir*.rpm

    #usbdem package
    rpm -ivh --replacepkgs --replacefiles $USBDEMD_PACKAGE_DIR/usbdem*.rpm

}

distri=$(/opt/bin/os_lsb_release -is)
if [ "$distri" = "CentOS" ]; then
    install_rpm
elif [ "$distri" = "H3Linux" ]; then
    install_rpm
elif [ "$distri" = "Ubuntu" ]; then
    install_deb
fi

exit 0
