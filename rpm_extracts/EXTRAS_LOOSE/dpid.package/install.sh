#!/bin/bash
MODULE=dpid
cd $(dirname $0)

PACKAGE_DIR=$1
distri=$(/opt/bin/os_lsb_release -is)

if [ "X$PACKAGE_DIR" = "X" ]; then
    PACKAGE_DIR=`pwd`
else
    PACKAGE_DIR=$PACKAGE_DIR/dpid.package
fi

echo "Begin to $0 ${MODULE} module..."

[ "X$distri" = "XUbuntu" ] && dpkg -i $PACKAGE_DIR/dpid*.deb
[ "X$distri" = "XCentOS" ] && rpm -ivh --replacepkgs --replacefiles $PACKAGE_DIR/dpid*.rpm
[ "X$distri" = "XH3Linux" ] && rpm -ivh --replacepkgs --replacefiles $PACKAGE_DIR/dpid*.rpm

if echo "$0" | grep -q '\binstall.sh$'; then
    rm -f *.deb
    rm -f *.rpm
    rm -f *.sh
fi

echo "End to $0 ${MODULE} module..."
exit 0
