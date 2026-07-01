#!/bin/bash
##############################################################################
#    Func Name: install.sh
# Date Created: 2013-12-20
#       Author: gaoliang
#  Description: install ocfs2;
#        usage: 1. $0 [$1] 
#               $1: install package dir
#       Output: 
#       Return: 0  : success
#-----------------------------------------------------------------------------
#  Modification History 
#  DATE        NAME             DESCRIPTION
#  2015-11-24  shichangkuo      for kernel 4.1
##############################################################################

#ocfs2 install package dir. not modify this dir.
OCFS2_PACKAGE_DIR=$1
if [ "X$OCFS2_PACKAGE_DIR" = "X" ]; then
    OCFS2_PACKAGE_DIR=/root/ocfs2-tools.package
else
    OCFS2_PACKAGE_DIR=$OCFS2_PACKAGE_DIR/ocfs2-tools.package
fi

SYSTEMD_DIR=/usr/lib/systemd/system/
CAS_AUDIT_DIR="/vms/.casaudit/ocfs2"
UNAME_MACHINE=`uname -m`

# ocfs2-tools dependencies deb package was installed during installing system module
# DEPENDENCE_DEB='libdlm3_3.1.7-0ubuntu2_amd64.deb'
OCFS2_TOOLS_DEB='ocfs2-tools_*amd64.deb'
OCFS2_TOOLS_RPM="ocfs2-tools-1.8.5-*.$UNAME_MACHINE.rpm"

function install_dpkg()
{
    # install ocfs2-tools deb package
    dpkg -P ocfs2-tools
    dpkg -i $OCFS2_PACKAGE_DIR/$OCFS2_TOOLS_DEB

    if [ ! -f /etc/rc2.d/S22o2cb ]; then
        ln -s /etc/init.d/o2cb /etc/rc2.d/S22o2cb
    fi
    if [ ! -f /etc/rc2.d/S22ocfs2 ]; then
        ln -s /etc/init.d/ocfs2 /etc/rc2.d/S22ocfs2
    fi

    # install ocfs2 userspace agent
    cp -f $OCFS2_PACKAGE_DIR/ocfs2_userspace_agent /etc/init.d/
    chmod +x /etc/init.d/ocfs2_userspace_agent
    ln -s /etc/init.d/ocfs2_userspace_agent /etc/rc2.d/S28ocfs2_userspace_agent

    cp $OCFS2_PACKAGE_DIR/$OCFS2_TOOLS_DEB $CAS_AUDIT_DIR
}

function install_rpm()
{
    # install ocfs2-tools rpm package
    rpm -ivh $OCFS2_PACKAGE_DIR/$OCFS2_TOOLS_RPM

    # install ocfs2 userspace agent
    cp -f $OCFS2_PACKAGE_DIR/ocfs2_userspace_agent.service $SYSTEMD_DIR
    /bin/systemctl daemon-reload
    /bin/systemctl enable ocfs2_userspace_agent.service

    cp $OCFS2_PACKAGE_DIR/$OCFS2_TOOLS_RPM $CAS_AUDIT_DIR
}

echo "Begin to install ocfs2 module..."
if [ ! -d "/etc/cvk" ]; then
    mkdir /etc/cvk
fi
cp -f $OCFS2_PACKAGE_DIR/ocfs2_xcopy.conf /etc/cvk

if [ ! -d "$CAS_AUDIT_DIR" ]; then
    mkdir -p $CAS_AUDIT_DIR
fi

if [ -f $OCFS2_PACKAGE_DIR/$OCFS2_TOOLS_DEB ]; then
    install_dpkg
else
    install_rpm
fi

echo "End to install ocfs2 module..."
#rm -rf $OCFS2_PACKAGE_DIR
exit 0
