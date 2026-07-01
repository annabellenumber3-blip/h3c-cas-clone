#!/bin/bash

UNAME_MACHINE=`uname -m`

XCONVERTOR_PACKAGE_DIR=$1
if [ "X$XCONVERTOR_PACKAGE_DIR" = "X" ]; then
    XCONVERTOR_PACKAGE_DIR=/root/xconvertor.package
else
    XCONVERTOR_PACKAGE_DIR=$XCONVERTOR_PACKAGE_DIR/xconvertor.package
fi

XCONVERTOR_DEB="xconvertor_*amd64.deb"
XCONVERTOR_RPM="xconvertor-*.rpm"

function install_deb_pkg()
{
    dpkg --install --force-confnew --force-confask $XCONVERTOR_PACKAGE_DIR/$XCONVERTOR_DEB
}

function install_rpm_pkg()
{
    rpm -ivh --nodeps --replacepkgs --replacefiles $XCONVERTOR_PACKAGE_DIR/$XCONVERTOR_RPM
}

echo -e "Begin to install xconvertor package"
distri=$(/opt/bin/os_lsb_release -is)
if [ "$distri" = "Ubuntu" ]; then
    install_deb_pkg
    ldconfig
elif [ "$distri" = "H3Linux" ]; then
    if [ "$UNAME_MACHINE" != "aarch64" ];then
        install_rpm_pkg
    else
        echo "The arm64 do not need to install xconvertor package."
    fi
fi

if [ $? -ne 0 ]; then
    echo "[Error] Fail to install xconvertor package."
else
    echo -e "Finish to install xconvertor package"
fi

exit 0
