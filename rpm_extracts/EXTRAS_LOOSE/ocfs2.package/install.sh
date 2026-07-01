#!/bin/bash

#ocfs2 install package dir. not modify this dir.
OCFS2_PACKAGE_DIR=$1
if [ "X$OCFS2_PACKAGE_DIR" = "X" ]; then
    OCFS2_PACKAGE_DIR=/root/ocfs2.package
else
    OCFS2_PACKAGE_DIR=$OCFS2_PACKAGE_DIR/ocfs2.package
fi

CAS_AUDIT_DIR="/vms/.casaudit/ocfs2"
UNAME_MACHINE=`uname -m`

OCFS2_KERNEL_DEB='ocfs2_kernel_modules.deb'
OCFS2_KERNEL_RPM="ocfs2-kernel-*.$UNAME_MACHINE.rpm"

function install_dpkg()
{
    # install ocfs2-ko deb package
    rm -rf /lib/modules/`uname -r`/kernel/fs/ocfs2/*
    dpkg -i $OCFS2_PACKAGE_DIR/$OCFS2_KERNEL_DEB

    cp $OCFS2_PACKAGE_DIR/$OCFS2_KERNEL_DEB $CAS_AUDIT_DIR
}

function install_rpm()
{
    # install ocfs2-ko rpm package
    rm -rf /lib/modules/`uname -r`/kernel/fs/ocfs2/*
    rpm -ivh --force $OCFS2_PACKAGE_DIR/$OCFS2_KERNEL_RPM

    cp $OCFS2_PACKAGE_DIR/$OCFS2_KERNEL_RPM $CAS_AUDIT_DIR
}

echo "Begin to install ocfs2 kernel module..."
if [ ! -d "$CAS_AUDIT_DIR" ]; then
    mkdir -p $CAS_AUDIT_DIR
fi

distri=$(/opt/bin/os_lsb_release -is)
if [ "$distri" = "Ubuntu" ]; then
    install_dpkg
else
    #move ocfs2*.ko.xz if already exists to avoid new build ko not effective
    if [ -f /lib/modules/`uname -r`/extra/fs/ocfs2/ocfs2.ko.xz ];then
        mkdir /home/extra_fs_cofs2_bak
        mv -f /lib/modules/`uname -r`/extra/fs/ocfs2/* /home/extra_fs_cofs2_bak
    fi
    install_rpm
fi

echo "End to install ocfs2 kernel module..."
exit 0
