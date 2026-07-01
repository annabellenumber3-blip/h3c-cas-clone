#!/bin/bash
##############################################################################
#    Func Name: install.sh
# Date Created: 2013-12-20
#       Author: gaoliang
#  Description: install qemu package;
#        usage: 1. $0 [$1]
#               $1: install package dir
#       Output:
#       Return: 0  : success
#-----------------------------------------------------------------------------
#  Modification History
#  DATE        NAME             DESCRIPTION
##############################################################################

#qemu install package dir. not modify this dir.
QEMU_PACKAGE_DIR=$1
if [ "X$QEMU_PACKAGE_DIR" = "X" ]; then
    QEMU_PACKAGE_DIR=/root/qemu.package
else
    QEMU_PACKAGE_DIR=$QEMU_PACKAGE_DIR/qemu.package
fi

function install_deb
{
    #install qemu
    isexist=$(dpkg -l | grep "qemu-kvm")
    if [ "X$isexist" != "X" ];then
        dpkg --force-all --purge qemu-kvm
    fi

    isexist=$(dpkg -l | grep "qemu-common")
    if [ "X$isexist" != "X" ];then
        dpkg --force-all --purge qemu-common
    fi

    isexist=$(dpkg -l | grep "kvm-ipxe")
    if [ "X$isexist" != "X" ];then
        dpkg --force-all --purge kvm-ipxe
    fi

    isexist=$(dpkg -l | grep "qemu-utils")
    if [ "X$isexist" != "X" ];then
        dpkg --force-all --purge qemu-utils
    fi

    dpkg --install $QEMU_PACKAGE_DIR/kvm-ipxe_*.deb
    dpkg --install $QEMU_PACKAGE_DIR/qemu-common_*_amd64.deb
    dpkg --install $QEMU_PACKAGE_DIR/qemu-utils_*_amd64.deb
    dpkg --install $QEMU_PACKAGE_DIR/qemu-kvm_*_amd64.deb
}

function install_rpm
{
    rpm -ivh --nodeps --replacepkgs --replacefiles $QEMU_PACKAGE_DIR/*.rpm
    [ -f $QEMU_PACKAGE_DIR/QEMU_EFI.aarch64.fd ] && cp -f $QEMU_PACKAGE_DIR/QEMU_EFI.aarch64.fd /usr/share/qemu/
    # 更新arm版本的uefi固件
    [ -f $QEMU_PACKAGE_DIR/QEMU_EFI-pflash.raw ] && cp -f $QEMU_PACKAGE_DIR/QEMU_EFI-pflash.raw /usr/share/qemu/
    [ -f $QEMU_PACKAGE_DIR/QEMU_VARS.fd ] && mkdir -p /var/lib/libvirt/qemu/nvram/ && cp -f $QEMU_PACKAGE_DIR/QEMU_VARS.fd /var/lib/libvirt/qemu/nvram/
    # update x86_64 uefi firmware
    [ -f $QEMU_PACKAGE_DIR/OVMF_CODE.fd ] && /usr/bin/cp -f $QEMU_PACKAGE_DIR/OVMF_CODE.fd /usr/share/qemu/
    [ -f $QEMU_PACKAGE_DIR/OVMF_VARS.fd ] && /usr/bin/cp -f $QEMU_PACKAGE_DIR/OVMF_VARS.fd /usr/share/qemu/
    # add old fireware for vdi
    [ -f $QEMU_PACKAGE_DIR/OVMF_CODE.fd.old ] && /usr/bin/cp -f $QEMU_PACKAGE_DIR/OVMF_CODE.fd.old /usr/share/qemu/
    [ -f $QEMU_PACKAGE_DIR/OVMF_CODE.fd.debug ] && /usr/bin/cp -f $QEMU_PACKAGE_DIR/OVMF_CODE.fd.debug /usr/share/qemu/
    # install qemu debug tools
    [ -f $QEMU_PACKAGE_DIR/qemu-gdb.py ] && /usr/bin/cp -f $QEMU_PACKAGE_DIR/qemu-gdb.py /opt/bin/
    [ -d $QEMU_PACKAGE_DIR/qemugdb ] && /usr/bin/cp -rf $QEMU_PACKAGE_DIR/qemugdb /opt/bin/
}

function install_package
{
    [ -f /usr/bin/rpm ]  && install_rpm
    [ -f /usr/bin/dpkg ] && install_deb
}

function backup_package
{
    #back the qemu deb package, notice cas_mon
    backpath="/vms/.casaudit/qemu"
    if [ ! -d $backpath ];then
        mkdir -p $backpath
    fi

    [ -f /usr/bin/dpkg ] && cp -f $QEMU_PACKAGE_DIR/*.deb $backpath/
    [ -f /usr/bin/rpm ] && cp -f $QEMU_PACKAGE_DIR/*.rpm $backpath/
}

### main ###

install_package

backup_package

# issue 201807130616
USR_SHARE_QEMU_SOFT_LINK="/usr/share/qemu-kvm"
USR_SHARE_QEMU_DIR="/usr/share/qemu"
[ ! -L $USR_SHARE_QEMU_SOFT_LINK ] && [ -d $USR_SHARE_QEMU_DIR ] && \
    ln -s $USR_SHARE_QEMU_DIR $USR_SHARE_QEMU_SOFT_LINK

exit 0
