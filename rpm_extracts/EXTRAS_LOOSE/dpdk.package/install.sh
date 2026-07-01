#!/bin/bash

MODULE=dpdk
KERNEL_VERSION=5.10.0-136.12.0.86.4.hl202.x86_64
INSTALL_KERNEL_DIR=/lib/modules/$KERNEL_VERSION
ANY_KO_INSTALLED=0
distri=$(/opt/bin/os_lsb_release -is)
cd $(dirname $0)

echo "Begin to $0 ${MODULE} module..."
if [ $# -lt 1 ]; then
    echo "[Warning] Not enough arguments to input."
fi

install_pdump() {
    install -c -m 755 dpdk-pdump* /usr/bin/
    ln -sf /usr/bin/dpdk-pdump /usr/bin/dpdk-pdump-dpdk
}

install_vdpa() {
    install -c -m 755 vdpa /usr/sbin/
    install -c -m 755 vdpactl /usr/bin/
    if [ -x /usr/bin/dpkg ]; then
        :; # TODO
    fi
    if [ -x /usr/bin/rpm ]; then
        install -m 0644 srv/vdpa.service /usr/lib/systemd/system/
    fi
}

install_ko(){
    name=$1
    dest_dir=$2
    REBOOT_FILE=/var/run/reboot-reasons

    if [ ! -f $name ]; then
        echo "${name} is not exist, skip install process."
        return
    fi

    if [ ! -d "$dest_dir" ]; then
        mkdir -p $dest_dir
    fi

    koname=$(modinfo -F name $name)

    install -c $name $dest_dir

    if [ -x /sys/module/$koname ]; then
        old_src_ver=$(cat /sys/module/$koname/srcversion)
        new_src_ver=$(modinfo -F srcversion $name)
        if [ "X$old_src_ver" != "X$new_src_ver" ]; then
            ANY_KO_INSTALLED=1
            echo "need reboot, ${koname}.ko upgraded from $old_src_ver to $new_src_ver"
            printf "reboot\t${koname}.ko\tsrcversion $old_src_ver -> $new_src_ver\n" >> $REBOOT_FILE
        else
            echo "${koname}.ko's version is unchange."
        fi
    else
        ANY_KO_INSTALLED=1
        echo "install ${name} to ${dest_dir}"
    fi
}

install_scripts() {
    local dest_dir="/usr/share/dpdk/usertools/"
    mkdir -p $dest_dir
    install -c -m 755 scripts/* $dest_dir
}

install_dpdk_tools() {
    install -c -m 755 usr/bin/* /usr/bin/
}

install_ko ./ko/igb_uio.ko $INSTALL_KERNEL_DIR/extra/dpdk
install_ko ./ko/rte_kni.ko $INSTALL_KERNEL_DIR/extra/dpdk
install_scripts
install_pdump
#install_vdpa
install_dpdk_tools

if [ "$ANY_KO_INSTALLED" = 1 ]; then
    depmod -a ${KERNEL_VERSION}
    [ "X$distri" = "XUbuntu" ] && update-initramfs -u
fi

echo "End to $0 ${MODULE} module..."
exit 0
