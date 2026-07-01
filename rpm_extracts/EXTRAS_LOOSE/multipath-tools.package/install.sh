#!/bin/bash
##############################################################################
#    Func Name: install.sh
# Date Created: 2013-12-20
#       Author: gaoliang
#  Description: install mutipath;
#        usage: 1. $0 [$1] 
#               $1: install package dir
#       Output: 
#       Return: 0  : success
#-----------------------------------------------------------------------------
#  Modification History 
#  DATE        NAME             DESCRIPTION
##############################################################################

#mutipath install package dir. not modify this dir.
MULTIPATH_PACKAGE_DIR=$1
if [ "X$MULTIPATH_PACKAGE_DIR" = "X" ]; then
    MULTIPATH_PACKAGE_DIR=/root/multipath-tools.package
else
    MULTIPATH_PACKAGE_DIR=$MULTIPATH_PACKAGE_DIR/multipath-tools.package
fi

function install_dpkg()
{
    #Preparation
    dpkg -i $MULTIPATH_PACKAGE_DIR/kpartx_0.5.0-7ubuntu*_amd64.deb
    dpkg -i $MULTIPATH_PACKAGE_DIR/multipath-tools_0.5.0-7ubuntu*_amd64.deb

    if [ -f /etc/rcS.d/S21multipath-tools-boot ]; then
        rm -f /etc/rcS.d/S21multipath-tools-boot
    fi

    if [ -f /etc/rc2.d/S21multipath-tools-boot ]; then
        rm -f /etc/rc2.d/S21multipath-tools-boot
    fi

    if [ ! -f /etc/rc2.d/S19multipath-tools-boot ]; then
        ln -s /etc/init.d/multipath-tools-boot /etc/rc2.d/S19multipath-tools-boot
    fi
    update-initramfs -u
}

function install_rpm()
{
    # matching architecture
    UNAME_MACHINE=`uname -m`    

    # uninstall device-mapper-multipath.
    rpm -q device-mapper-multipath-libs >/dev/null && rpm -e device-mapper-multipath-libs --nodeps
    rpm -q device-mapper-multipath >/dev/null && rpm -e device-mapper-multipath --nodeps
    rpm -q kpartx >/dev/null && rpm -e kpartx --nodeps

    # install multipath-tools
    rpm -ivh $MULTIPATH_PACKAGE_DIR/kpartx-0.5.0_7.el7*.$UNAME_MACHINE.rpm
    rpm -ivh $MULTIPATH_PACKAGE_DIR/device-mapper-multipath-libs-0.5.0_7.el7*.$UNAME_MACHINE.rpm
    rpm -ivh $MULTIPATH_PACKAGE_DIR/device-mapper-multipath-0.5.0_7.el7*.$UNAME_MACHINE.rpm

    # update initramfs
    #delete this. 201808240439. mv this in upper 'install.sh' shell.
    #kernel_version=$(uname -r)
    #new-kernel-pkg --mkinitrd --update $kernel_version
    #mkinitrd -f /boot/initramfs-${kernel_version}.img $kernel_version
}

echo "Begin to install multipath module..."
cp -f  $MULTIPATH_PACKAGE_DIR/multipath.conf /etc
if [ -f $MULTIPATH_PACKAGE_DIR/multipath-tools_0.5.0-7ubuntu*_amd64.deb ]; then
    install_dpkg
else
    install_rpm
fi

echo "End to install multipath module..."
exit 0
