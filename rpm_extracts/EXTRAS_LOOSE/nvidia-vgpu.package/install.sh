#!/bin/bash
##############################################################################
#    Func Name: install.sh
# Date Created: 2018-02-24
#       Author: Lilei
#  Description: install shell;
#        usage: 1. $0 [$1]
#               $1: install package dir
#       Output:
#       Return: 0  : success
#-----------------------------------------------------------------------------
#  Modification History
#  DATE        NAME             DESCRIPTION
##############################################################################

PACKAGE_DIR=$1
if [ "X$PACKAGE_DIR" = "X" ]; then
    NVDDEB_PACKAGE_DIR=/root/nvidia-vgpu.package
else
    NVDDEB_PACKAGE_DIR=$PACKAGE_DIR/nvidia-vgpu.package
fi

function forbidden_nouveau()
{
    is_nouveau_blk=$(grep "^blacklist " /etc/modprobe.d/blacklist.conf 2>/dev/null | grep "nouveau")
    if [ -z "$is_nouveau_blk" ]; then
        echo "blacklist nouveau" >> /etc/modprobe.d/blacklist.conf
        rm -f /lib/modules/$(uname -r)/kernel/drivers/gpu/drm/nouveau/nouveau.ko*
    fi
}

# for ubuntu
[ -f /usr/bin/dpkg ] && dpkg -i $NVDDEB_PACKAGE_DIR/nvidia-vgpu_*_amd64.deb

# for arm and centos
if [ -f /usr/bin/rpm ]; then
    if [ "X$(uname -m)" = "Xaarch64" ]; then
	install -m 755 $NVDDEB_PACKAGE_DIR/gpu_config.pyc /opt/bin/
	install -m 755 $NVDDEB_PACKAGE_DIR/hw_npu_config.pyc /opt/bin/
	install -m 755 $NVDDEB_PACKAGE_DIR/nvidia_gpu_config.pyc /opt/bin/
	install -m 444 $NVDDEB_PACKAGE_DIR/gpu-config.service /usr/lib/systemd/system/
	systemctl enable gpu-config.service >/dev/null 2>&1
    else
	forbidden_nouveau
	rpm -ivh $NVDDEB_PACKAGE_DIR/nvidia-vgpu*x86_64.rpm
    fi
fi

exit 0
