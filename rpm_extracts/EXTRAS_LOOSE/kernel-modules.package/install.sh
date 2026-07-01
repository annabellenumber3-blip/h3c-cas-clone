#!/bin/bash

MODULE=kernel-modules

CUR_DIR=$(pwd)
cd $(dirname $0)

if [ $# -lt 1 ]; then
    echo -e "\n[Warning] ---------- Not enough arguments to input.----------"
fi

echo "Begin to $0 ${MODULE} module..."

KERNEL_VERSION=5.10.0-136.12.0.86.4.hl202.x86_64
INSTALL_KERNEL_DIR="/lib/modules/$KERNEL_VERSION"
ANY_KO_INSTALLED=0
shell_name=$(basename "$0")

function install_ko(){
    local name=$1
    local dest_dir="$INSTALL_KERNEL_DIR/$2"

    if [ -f "$dest_dir/$name.xz" ]; then
        # xz ./ko/$name
	# name="$name.xz"
        echo "remove $dest_dir/$name.xz"
        rm "$dest_dir/$name.xz"
    fi

    if [ "$name" == "hns3.ko" ]; then
        if [ -e "$dest_dir/../$name" ]; then
            rm -f "$dest_dir/../$name"
        fi
    fi

    if test -f "$dest_dir/$name" && cmp -s "./ko/$name" "$dest_dir/$name"; then
        echo "skip install $name to $dest_dir, because files are identical"
    else
        #issue 202202220738
        [ "X$shell_name" = "Xupgrade.sh" ] && promp_record "$name"

        mkdir -p "$dest_dir"
        install -m 644 "./ko/$name" "$dest_dir/"
        ANY_KO_INSTALLED=1
        echo "install $name to $dest_dir"

    fi
}

function promp_record()
{
    local name=$1
    local old_ko_dir=""
    local old_src_md5=""
    local new_src_md5=""
    REBOOT_FILE=/var/run/reboot-reasons

    ko_name=$(modinfo -F name "./ko/$name")
    old_ko_dir=$(modinfo -F filename "$ko_name" 2>/dev/null)
    new_ko_dir="./ko/$name"
    if [ -x "/sys/module/$ko_name" ]; then   # ko not load, no need reboot after upgrade
        [ -f "$old_ko_dir" ] && old_src_md5=$(md5sum "$old_ko_dir" | awk '{print $1}')
        new_src_md5=$(md5sum "$new_ko_dir" | awk '{print $1}')
        if [ "X$old_src_md5" != "X$new_src_md5" ]; then
            echo "need reboot, ${name} upgraded from $old_src_md5 to $new_src_md5"
            echo -e "reboot\t${name}\tmd5 $old_src_md5 -> $new_src_md5" >> "$REBOOT_FILE"
        fi
    fi
}


while read ko dest_dir
do
    if [[ "$ko" == "" || $ko == \#* ]];then
        continue
    fi
    install_ko "$ko" "$dest_dir"

done < ./ko/install_list

# override mellanox drivers of osv
echo "override mlxfw * extra/mlnx-ofa_kernel/drivers/net/ethernet/mellanox/mlxfw" > /etc/depmod.d/zz01-mlnx-ofa_kernel-mlxfw.conf
echo "override mlx_compat * extra/mlnx-ofa_kernel/compat" > /etc/depmod.d/zz01-mlnx-ofa_kernel-mlx_compat.conf
echo "override mlx5_core * extra/mlnx-ofa_kernel/drivers/net/ethernet/mellanox/mlx5/core" > /etc/depmod.d/zz01-mlnx-ofa_kernel-mlx5_core.conf


# 202409261176, support load hinic3.ko/hisdk3.ko/hiudk3.ko at boot
if [ ! -f /etc/modules-load.d/hinic3-modules.conf ]; then
    echo "hinic3" > /etc/modules-load.d/hinic3-modules.conf
fi

if [ ! -f /etc/modules-load.d/hisdk3-modules.conf ]; then
    echo "hisdk3" > /etc/modules-load.d/hisdk3-modules.conf
fi

if [ ! -f /etc/modules-load.d/hiudk3-modules.conf ]; then
    echo "hiudk3" > /etc/modules-load.d/hiudk3-modules.conf
fi

if [ ! -f /etc/modules-load.d/sssnic-modules.conf ]; then
    echo "sssnic" > /etc/modules-load.d/sssnic-modules.conf
fi

mkdir -p /lib/firmware/qed
install -m 644 ./ko/qed_init_values_zipped-*.bin /lib/firmware/qed

#install ice firmware
mkdir -p /lib/firmware/intel/ice/ddp
if [ -e ./ko/ice.pkg ]; then
    install -m 644 ./ko/ice.pkg /lib/firmware/intel/ice/ddp
else
    echo "ice.pkg is missing"
fi

ANY_KO_INSTALLED=1

if [ "$ANY_KO_INSTALLED" = 1 ]; then
    depmod -a "$KERNEL_VERSION"
    if [ -x /usr/bin/dpkg ]; then
         update-initramfs -u
    elif [ -x /usr/bin/rpm ]; then
        dracut -f "/boot/initramfs-$KERNEL_VERSION.img.bak" "$KERNEL_VERSION"
        if [ $? -eq 0 ]; then
          mv -f "/boot/initramfs-$KERNEL_VERSION.img.bak" "/boot/initramfs-$KERNEL_VERSION.img"
        fi
    fi
fi

cd "$CUR_DIR"

echo "End to $0 ${MODULE} module..."
exit 0
