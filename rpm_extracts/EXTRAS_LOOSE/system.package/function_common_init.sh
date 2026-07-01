#!/bin/bash

x86_64_h3linux="5.10.0-136.12.0.86.4.hl202.x86_64 #8 SMP Thu Mar 14 06:32:33 UTC 2024"
aarch64_h3linux="5.10.0-136.12.0.86.4.hl202.aarch64 #8 SMP Thu Mar 14 06:35:33 UTC 2024"

function get_kernel_info()
{
    arch=$(uname -m)
    # arm64
    if [ "$arch" = "aarch64" ]; then
        echo "$aarch64_h3linux"
    # x86_64
    elif [ "$arch" = "x86_64" ]; then
        echo "$x86_64_h3linux"
    fi
}

#
# get last install kernel_version
# 
function get_kernel_version()
{
    local kernel_version=""
    kernel_version=$(get_kernel_info |awk '{print $1}')
    echo "$kernel_version"
}

# 
# Exit if installation fails
#
function check_function_failed_exit()
{
    echo "###################start exec ${FUNCNAME[1]}_with_$(uname -m)###################"
    if ! ${FUNCNAME[1]}_with_$(uname -m); then
        echo "exec ${FUNCNAME[1]}_with_$(uname -m) failed, and install process will be exit."
        exit 1
    fi
    echo "####################end exec ${FUNCNAME[1]}_with_$(uname -m)####################"
    return 0
}

