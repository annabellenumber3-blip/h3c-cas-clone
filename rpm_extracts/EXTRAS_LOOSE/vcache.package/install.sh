#!/bin/bash
##############################################################################
#    Func Name: install.sh
# Date Created: 2018-12-11
#       Author: z14526
#  Description: install sa;
#        usage: 1. $0 [$1]
#               $1: install package dir
#       Output:
#       Return: 0  : success
#-----------------------------------------------------------------------------
#  Modification History
#  DATE        NAME             DESCRIPTION
##############################################################################
UNAME_MACHINE=`uname -m`
install_flash_cache_deb_name="flashcache_3.4.2-*_amd64.deb"
install_flash_cache_rpm_name="flashcache-3.4.2-*$UNAME_MACHINE.rpm"

function main(){
    FLASH_CACHE_PACKAGE_DIR=$1

    if [ "X$FLASH_CACHE_PACKAGE_DIR" == "X" ]; then
        FLASH_CACHE_PACKAGE_DIR=/root/vcache.package
    else
        FLASH_CACHE_PACKAGE_DIR=$FLASH_CACHE_PACKAGE_DIR/vcache.package
    fi

    [ -x /usr/bin/dpkg ] && install_flash_cache_on_ubuntu $FLASH_CACHE_PACKAGE_DIR/flashcache
    [ -x /usr/bin/rpm ] && install_flash_cache_on_centos $FLASH_CACHE_PACKAGE_DIR/flashcache
}

function install_flash_cache_on_ubuntu(){
    echo -e "\n-------------Now, begain install flash cache on ubuntu.-----------------"
    FLASH_CACHE_DEB_DIR=$1

    is_exist=`ls $FLASH_CACHE_DEB_DIR/$install_flash_cache_deb_name`
    if [ "X$is_exist" != "X" ];then
        dpkg -i $FLASH_CACHE_DEB_DIR/$install_flash_cache_deb_name
    else
        echo "[Error]: not exist $install_flash_cache_deb_name in $FLASH_CACHE_DEB_DIR."
        exit 1
    fi
    echo -e "\n-------------Now, end install flash cache on ubuntu.-----------------"

    exit 0
}

function install_flash_cache_on_centos(){
    echo -e "\n-------------Now, begain install flash cache on centos.-----------------"
    FLASH_CACHE_RPM_DIR=$1

    is_exist=`ls $FLASH_CACHE_RPM_DIR/$install_flash_cache_rpm_name`
    if [ "X$is_exist" != "X" ];then
        rpm -ivh  $FLASH_CACHE_RPM_DIR/$install_flash_cache_rpm_name
    else
        echo "[Error]: not exist $install_flash_cache_rpm_name in $FLASH_CACHE_RPM_DIR."
        exit 1
    fi
    echo -e "\n-------------Now, end install flash cache on centos.-----------------"

    exit 0
}

main $1
