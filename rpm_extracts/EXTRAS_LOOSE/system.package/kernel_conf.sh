#!/bin/bash
# this script is suggested being copied to "kernel_modules".

. ./function_common_init.sh
kernel_version=$(get_kernel_version)
cpu_arch=$(uname -m)

append=""
is_qemu=$(lscpu | grep "BIOS Vendor ID" | awk '{print $4}')
if [ "X$is_qemu" != "XQEMU" ]; then
   append="crash_kexec_post_notifiers"
fi

#fix:202408151472 mitigations repalce spec_store_bypass_disable=off l1tf=off mds=off spectre_v2=off
append=$(echo "${append} mitigations=off")
#end

#fix:202102230543 modify huawei to kunpeng,reserve original
if [ "$cpu_arch" = "aarch64" ]; then
    if dmidecode | grep -iqP "huawei|kunpeng"; then
        python /opt/bin/util_kernel_cmdline.pyc -s selinux=0 elevator=deadline transparent_hugepage=always net.ifnames=0 biosdevname=0 crashkernel=512M cma=0 $append
    else
        python /opt/bin/util_kernel_cmdline.pyc -s selinux=0 elevator=mq-deadline transparent_hugepage=always net.ifnames=0 biosdevname=0 crashkernel=512M cma=0 $append
    fi
else
    #fix idms:202406260569 Add the "idle=nomwait" parameter to all hygon CPUs.
    cpu_module_name=$(lscpu | grep -iw 'Model name' | awk -F ':' '{print $2}' | grep -Eiq 'Hygon')
	if [ $? -eq 0 ]; then
        append=$(echo "${append} idle=nomwait")
    fi

    if dmidecode -s processor-version |grep -iqw intel; then
        append=$(echo "${append} tsx=on")
    fi

    if dmidecode -s processor-version |grep -iqwE "Hygon|AMD"; then
        append=$(echo "${append} iommu=pt")
    fi

    if lspci | grep -q -e "56c0" -e "56c1"; then
        append=$(echo "${append} split_lock_detect=off pci=realloc=off")
    else
        append=$(echo "${append} nomodeset")
    fi

    python /opt/bin/util_kernel_cmdline.pyc -s selinux=0 elevator=mq-deadline transparent_hugepage=always net.ifnames=0 biosdevname=0 crashkernel=256M $append

fi
# output kernel boot message
python /opt/bin/util_kernel_cmdline.pyc -d rhgb
python /opt/bin/util_kernel_cmdline.pyc -d iommu.passthrough
python /opt/bin/util_kernel_cmdline.pyc -d spectre_v2
python /opt/bin/util_kernel_cmdline.pyc -d spec_store_bypass_disable
python /opt/bin/util_kernel_cmdline.pyc -d l1tf
python /opt/bin/util_kernel_cmdline.pyc -d mds

#remove ixgbevf.ko to not instantiate "Intel Corporation 82599 Ethernet Controller Virtual Function" to an eth nic
if [ -f /lib/modules/$kernel_version/kernel/drivers/net/ethernet/intel/ixgbevf/ixgbevf.ko* ]; then
    rm -f /lib/modules/$kernel_version/kernel/drivers/net/ethernet/intel/ixgbevf/ixgbevf.ko*
fi
#remove i40evf.ko to not instantiate "Intel Corporation XL710/X710 Virtual Function" to an eth nic
if [ -f /lib/modules/$kernel_version/kernel/drivers/net/ethernet/intel/iavf/iavf.ko* ]; then
    rm -f /lib/modules/$kernel_version/kernel/drivers/net/ethernet/intel/iavf/iavf.ko*
fi

# update hpdsa raid by gaoliang
if lsmod | grep -q "hpdsa" && ! grep -q "^blacklist ahci" /etc/modprobe.d/blacklist.conf;then
    echo "blacklist ahci" >> /etc/modprobe.d/blacklist.conf
fi

if lsmod | grep -q "ixgbe" && ! grep -q "^options ixgbe allow_unsupported_sfp=1" /etc/modprobe.d/ixgbe.conf;then
    echo "options ixgbe allow_unsupported_sfp=1" >> /etc/modprobe.d/ixgbe.conf
fi

if [ "X$(uname -m)" = "Xx86_64" ]; then
    cat > /etc/modprobe.d/kvm.conf <<EOF
options kvm ignore_msrs=1
options kvm report_ignored_msrs=0
options kvm halt_poll_ns=200000
EOF
fi

# Disable native nvme multipath
install -m 0644 ./conf/nvme_core.conf /etc/modprobe.d/


do_initramfs() {
    depmod -a $kernel_version
    dracut -f "/boot/initramfs-$kernel_version.img.bak" "$kernel_version"
    if [ $? -eq 0 ]; then
      mv -f "/boot/initramfs-$kernel_version.img.bak" "/boot/initramfs-$kernel_version.img"
    fi
}

# disable AlternativeNamesPolicy, need dracut and reboot
NIC_Name_Policy_FILE="/usr/lib/systemd/network/99-default.link"
if ! grep -q "AlternativeNamesPolicy=none" $NIC_Name_Policy_FILE; then
    sed -i "s/AlternativeNamesPolicy=.*/AlternativeNamesPolicy=none/" $NIC_Name_Policy_FILE
    do_initramfs
fi

