#!/bin/bash
##############################################################################
#    Func Name: install.sh
# Date Created: 2022-08-25
#       Author: 
#  Description: install guestfs ;
#        usage: 1. $0 [$1]
#               $1: install package dir
#       Output:
#       Return: 0  : success
#-----------------------------------------------------------------------------
#  Modification History
#  DATE        NAME             DESCRIPTION
##############################################################################

PACKAGE_DIR=$1
rpm_install() {
    if [ "X$PACKAGE_DIR" = "X" ]; then
        GUESTFS_PACKAGE_DIR=/root/libguestfs.package
    else
        GUESTFS_PACKAGE_DIR=$PACKAGE_DIR/libguestfs.package
    fi

    #guestfs package
    rpm -ivh $GUESTFS_PACKAGE_DIR/libguestfs-1.40.2-17.*.rpm   $GUESTFS_PACKAGE_DIR/perl-Sys-Guestfs-1.40.2-17.*.rpm
    rpm -ivh $GUESTFS_PACKAGE_DIR/libguestfs-devel-1.40.2-17.*.rpm
    rpm -ivh $GUESTFS_PACKAGE_DIR/python3-libguestfs-1.40.2-17.*.rpm
}


if [ "X$(/opt/bin/os_lsb_release -is)" = "XH3Linux" ]; then
    rpm_install
else
    echo "libguestfs install failed"
fi

exit 0
