#!/bin/bash
##############################################################################
#    Func Name: install.sh
# Date Created: 2024-08-05
#       Author:
#  Description: install shell;
#        usage: 1. $0 [$1]
#               $1: install package dir
#       Output:
#       Return: 0 : success
#-----------------------------------------------------------------------------
#  Modification History
#  DATE        NAME             DESCRIPTION
##############################################################################

PACKAGE_DIR=$1
if [ "X$PACKAGE_DIR" = "X" ]; then
    GPU_DRIVERS_PACKAGE_DIR=/root/gpu-drivers.package
else
    GPU_DRIVERS_PACKAGE_DIR=$PACKAGE_DIR/gpu-drivers.package
fi

gpu_dir="/opt/bin/gpu_config"
if [ ! -d $gpu_dir ];then
    mkdir -p $gpu_dir
fi

if [ -f /usr/bin/rpm ]; then
    rpm -ivh $GPU_DRIVERS_PACKAGE_DIR/*.rpm
fi

cp -f $GPU_DRIVERS_PACKAGE_DIR/*_gpu_config.pyc $gpu_dir

vastai_env="/etc/vastai_tools.env"
if [ -f $vastai_env ]; then
    sed -i '/^export LD_LIBRARY_PATH=\${INSTALL_DIR}\/lib:\${LD_LIBRARY_PATH}$/ s/^/#/' $vastai_env
    sed -i '/^export LD_LIBRARY_PATH=\${LD_LIBRARY_PATH}:\/usr\/local\/lib\/$/ s/^/#/' $vastai_env
fi

exit 0
