#!/bin/bash

###############################################################################
# Description: install smartA packages script                                 #
# Author: d14417                                                              #
# Date created:2020/04/08                                                     #
# Copyright (c) 2018 H3C Technologies. All rights reserved.                   #
###############################################################################

###############################################################################
# THE SOFTWARE IS PROVIDED AS A REFERENCE ONLY AND "AS IS", WITHOUT WARRANTY  #
# OF ANY KIND, EXPRESS OR IMPLIED.                                            #
###############################################################################

cd `dirname $0`

#source通用函数和模块
USR_SHELL_UTILS="./scripts/smart_utils_lib"
. ${USR_SHELL_UTILS} "install" "package.log"

#global var
CARD_TYPE=""

#CX4Lx和CX5只装OFED驱动
ConnectX4Lx="0x1015"
ConnectX5="0x1017"


ConnectX6="0x101b"
#TODO:ConnectX6的mstdev未确定
ConnectX6_mstdev="mt4123"

ConnectX6DX="0x101d"
ConnectX6DX_mstdev="mt4125"

ConnectX6LX="0x101f"
ConnectX6LX_mstdev="mt4127"

BlueField="0xa2d2"
BlueField_mstdev="mt41682"

BlueField2="0xa2d6"
#TODO:BlueField2的mstdev未确定
BlueField2_mstdev="mt41685"


pwd=`pwd`
OS_NAME=$(cat /etc/issue)

SMARTNIC_DEF_IPADDR="3.3.3.3"
HOST_DEF_SMARTNIC_IPADDR="3.3.3.4"

SMARTNIC_DEF_USER="root"
SMARTNIC_DEF_PWD="centos"

LOG_DIR="/var/log/smartdev"

UDEV_RULE="$pwd/82-net-setup-link.rules"
VF_NAME_SCRIPTS="$pwd/vf-net-link-name.sh"
ROCE_PFC_CONF="$pwd/roce_qos_pfc.conf"
SMARTNIC_FW_CFG="$pwd/SmartFWCfg"
if [ ! -f "$SMARTNIC_FW_CFG" ];then
    PERROR "Please firmware config file [$SMARTNIC_FW_CFG]not exists."
    exit 1
fi


#global command
LSPCI=`which lspci`
MST="/usr/bin/mst"
MST_PATH="$pwd/mst"
MLXCONFIG="/usr/bin/mlxconfig"
MLXFWRESET="/usr/bin/mlxfwreset"
AUTO_SSH="/opt/bin/smart_auto_ssh"

#定义全局路径，并效验是否存在
HOST_RPMS="$pwd/smartdep"
HOST_SCRIPTS="$pwd/scripts"
HOST_TOOLS="$pwd/tools"
HOST_DIR_LIST=("$HOST_RPMS" "$HOST_SCRIPTS" "$HOST_TOOLS")
#check dir exist
for idir in `echo "${HOST_DIR_LIST[@]}"`
do
    if [ ! -d "$idir" ];then
        PERROR "Please check whether ["$idir"] directory exists."
        exit 1
    fi
done

###############################################################################
#               Functions                                                     #
###############################################################################


#检测当前设备是否有CX6或Bluefiled卡，有返回0，没有1
function smart_getpci_cardtype()
{
    local l_cx6=`${LSPCI} -d 15b3:"${ConnectX6//0x/}"`
    local l_cx6dx=`${LSPCI} -d 15b3:"${ConnectX6DX//0x/}"`
    local l_cx6lx=`${LSPCI} -d 15b3:"${ConnectX6LX//0x/}"`
    local l_blue=`${LSPCI} -d 15b3:"${BlueField//0x/}"`
    local l_blue2=`${LSPCI} -d 15b3:"${BlueField2//0x/}"`
    local l_cx4lx=`${LSPCI} -d 15b3:"${ConnectX4Lx//0x/}"`
    local l_cx5=`${LSPCI} -d 15b3:"${ConnectX5//0x/}"`

    if [ -n "$l_cx6" ] || [ -n "$l_cx6dx" ] || [ -n "$l_cx6lx" ];then
        CARD_TYPE="CX6"
        return 0
    fi

    if [ -n "$l_cx4lx" ] || [ -n "$l_cx5" ];then
        CARD_TYPE="CX4_5"
        return 0
    fi

    if [ -n "$l_blue" ] || [ -n "$l_blue2" ];then
        CARD_TYPE="BLUEFIELD"
        return 0
    fi
    return 1
}

#检测编译内核版本和安装内核版本是否相同
function check_kernel_ver()
{
    local l_cur_ver=`uname -r`
    local l_complie_ver=`cat $pwd/smart-version|grep ^COMPLIE_KERNEL_VERSION|awk -F "=" '{print $2}'`
    if [ "$l_cur_ver" != "$l_complie_ver" ]; then
        return 1
    fi
    return 0
}


#获取tmfifo_net接口列表
function get_tmfifo_nets()
{
   local if_tmfifo_netlist=`ip addr|grep -w tmfifo_net[0-9]|awk -F ':' '{print $2}'|sed -r s/"^[[:space:]]+"/""/|uniq`
    if [ -z "$if_tmfifo_netlist" ];then
        return 1
    fi
    echo -e "$if_tmfifo_netlist"
    return 0
}


#仅定义需要安装的rpm
function install_rpms()
{
    local rpms_cfg="$HOST_RPMS/rpm_cfg"
    if [ ! -f "$rpms_cfg" ];then
        PERROR "Rpms Config File [rpm_cfg] not exist."
        return 1 ;
    fi

    local l_rpms=`cat "$rpms_cfg"|grep -w "^cvk_rpms"|awk -F '=' '{print $2}'`
    if [ -z "$l_rpms" ];then
        PERROR "Rpms list [$cvk_rpms] for cvk is not exist."
        return 1 ;
    fi

    for irpm in `echo -e "$l_rpms"`
    do
        rpm -ivh "$HOST_RPMS/$irpm"-*.rpm --nodeps --force >>${LOG_FILE} 1>/dev/null 2>&1||{ PERROR "Install RPM $irpm-*.rpm Fail.";exit 1; }
        if [ "$irpm" = "minicom" ];then
            #生产默认minicom配置文件,默认使用/dev/rshim0/console
            echo "pu port /dev/rshim0/console" >/etc/minirc.dfl
        fi
    done

    return 0
}

#创建tmfifo_net的网络地址配置文件模板
function create_nic_cfg()
{
    local if_name=$1
    local l_res=`ip addr |grep -w "$if_name"`
    if [ -z "$l_res" ];then
        PERROR "Interface name [$if_name] not exist."
        return 1 ;
    fi

    local l_net_cfg="/etc/${if_name}_nic"
    if [ ! -f "$l_net_cfg" ];then
        echo "${if_name}_IPADDR=" > "$l_net_cfg"
        echo "${if_name}_PREFIX=" >>"$l_net_cfg"
        echo "${if_name}_GATEWAR=" >>"$l_net_cfg"

        echo "${if_name}_NIC_IPADDR=" >>"$l_net_cfg"
        echo "${if_name}_NIC_PREFIX=" >>"$l_net_cfg"
        echo "${if_name}_NIC_GATEWAR=" >>"$l_net_cfg"
    fi
    return 0
}


#创建udev规则，并启动openbid服务
function create_udev_rules()
{
cat > /etc/udev/rules.d/91-tmfifo_net.rules <<EOF
SUBSYSTEM=="net", ACTION=="add", ATTR{address}=="00:1a:ca:ff:ff:02", ATTR{type}=="1", NAME="tmfifo_net0", RUN+="/usr/sbin/ifup tmfifo_net0"
SUBSYSTEM=="net", ACTION=="add", ATTR{address}=="00:1a:ca:ff:ff:04", ATTR{type}=="1", NAME="tmfifo_net1", RUN+="/usr/sbin/ifup tmfifo_net1"
SUBSYSTEM=="net", ACTION=="add", ATTR{address}=="00:1a:ca:ff:ff:06", ATTR{type}=="1", NAME="tmfifo_net2", RUN+="/usr/sbin/ifup tmfifo_net2"
SUBSYSTEM=="net", ACTION=="add", ATTR{address}=="00:1a:ca:ff:ff:08", ATTR{type}=="1", NAME="tmfifo_net3", RUN+="/usr/sbin/ifup tmfifo_net3"
EOF
    #加载驱动模块
    modprobe rshim
    modprobe rshim_usb
    modprobe rshim_net
    modprobe rshim_pcie

    /etc/init.d/openibd restart >>${LOG_FILE} 2>&1

    local if_tmfifo_netlist=`get_tmfifo_nets`
    if [ -z "$if_tmfifo_netlist" ];then
        PERROR "Fail to get tmfifo_net interface."
        return 1
    fi

    local itmfifo=""
    for itmfifo in `echo -e "$if_tmfifo_netlist"`
    do
        create_nic_cfg "$itmfifo"
    done
    return 0
}

#按照指定顺序，分别解压tools包中tar.gz文件，执行包内install.sh脚本
function install_tools()
{
    local l_pkg_list

    if [ "$CARD_TYPE" = "CX6" ];then
        l_pkg_list=("OFED_Pkg" "Net_Pkg")
    elif [ "$CARD_TYPE" = "CX4_5" ];then
        l_pkg_list=("OFED_Pkg" "Net_Pkg")
    else
        l_pkg_list=("OFED_Pkg" "Net_Pkg")  # ignore NicBfb_Pkg, Stor_Pkg
    fi

    for idir in `echo ${l_pkg_list[@]}`
    do
        PGREEN "Begin to install tools [$idir]...."
        bash "$HOST_TOOLS/$idir/install.sh" || { PERROR "Install tool [$idir] fail."; return 1; }
    done

    return 0
}

#获取/dev/mst/mstXXXX接口列表
function get_mst_devlist()
{
    local card_type=$1
    local l_tmp=""

    cur_kernel=$(uname -r)
    if [ $cur_kernel = "5.10.0-60.18.0.50.2.hl01.x86_64" ] || [ $cur_kernel = "5.10.0-60.18.0.50.2.hl01.aarch64" ]; then
        insmod $MST_PATH/mst_pci.ko 2>/dev/null 1>&2
        insmod $MST_PATH/mst_pciconf.ko 2>/dev/null 1>&2
        $MST_PATH/mst start 2>/dev/null 1>&2
    else
        $MST start 2>/dev/null 1>&2
    fi

    if [ "$card_type" = "CX6" ];then
        l_tmp=`ls -l /dev/mst/mt*|grep "$ConnectX6_mstdev\|$ConnectX6DX_mstdev\|$ConnectX6LX_mstdev" |awk '{print $10}' 2>/dev/null 2>&1`
    fi

    if [ "$card_type" = "BLUEFIELD" ];then
        l_tmp=`ls -l /dev/mst/mt*|grep "$BlueField2_mstdev\|$BlueField_mstdev"|awk '{print $10}' 2>/dev/null 2>&1`
    fi
    echo "$l_tmp"
    return 0
}

function cfg_smartFw() {
    local l_card_type=$1

    #获得对应卡的配置信息
    local cfg_cmd=""
    for item in `cat $SMARTNIC_FW_CFG |grep ^"$l_card_type"`
    do
        ikey=`echo $item|awk -F '=' '{print $1}'|sed "s/$l_card_type\_//g"`
        ivalue=`echo $item|awk -F '=' '{print $2}'`
        cfg_cmd="$cfg_cmd $ikey=$ivalue"
    done

    #查找对应卡设备列表:ConnectX6_mstdev
    local smart_dev_list=`get_mst_devlist "$l_card_type"`
    if [ -z "$smart_dev_list" ];then
        PERROR "Smart dev [/dev/mst/mtXXX] not exist."
        return 1
    fi

    #对各个设备进行FW的配置
    for idev in `echo -e "$smart_dev_list"`
    do
        $MLXCONFIG -y -d $idev set $cfg_cmd 2>/dev/null 1>&2 || { PERROR "Config [$idev=$cfg_cmd] SmartFW Fail.";exit 1; }
        #设置CX6的VIRTIO使能
        if [ "$l_card_type" == "CX6" ];then
            tmp_conf_file="/tmp/mlxconfig_virtio.txt"
            echo MLNX_RAW_TLV_FILE > $tmp_conf_file
            echo "0x00000004 0x000000f0 0x00000000 0x00000001" >> $tmp_conf_file
            $MLXCONFIG -d $idev -f $tmp_conf_file -y set_raw 2>/dev/null 1>&2 || { PERROR "Config [$idev] SmartFW Fail.";exit 1; }
            rm -rf $tmp_conf_file
        fi
        PGREEN "Finish to set OFED Firmware about $idev ."
    done

    #TODO：设置成功后，重启生效,此处不重启，由SMART安装成功结束后统一重启。
    return 0
}

function install_vdpa() {
    install -c -m 755 ${pwd}/vdpa/vdpa /usr/sbin/
    install -c -m 755 ${pwd}/vdpa/vdpactl /usr/bin/
    install -c -m 755 ${pwd}/vdpa/vdpa-ctl /usr/share/dpdk/usertools/
    install -m 0644 ${pwd}/vdpa/vdpa.service /usr/lib/systemd/system/
}

function set_hugepage() {
    local cfg_hugepagesz
    local cfg_hugepages
    local rec_hugepages1G
    local rec_hugepages2M
    local expected=8  #expect 8G hugepages

    while read line; do
        if [[ "$line" =~ "hugepagesz" ]]; then
            cfg_hugepagesz=$(echo $line | cut -d : -f 2 | sed 's/ //g')
        else
            cfg_hugepages=$(echo $line | cut -d : -f 2 | sed 's/ //g')
        fi
    done < <(python /opt/bin/hugepage_config.pyc get --config)

    while read line; do
        if [[ "$line" =~ "1G_recommend" ]]; then
            rec_hugepages1G=$(echo $line | cut -d : -f 2 | sed 's/ //g')
        elif [[ "$line" =~ "2M_recommend" ]]; then
            rec_hugepages2M=$(echo $line | cut -d : -f 2 | sed 's/ //g')
        fi
    done < <(python /opt/bin/hugepage_config.pyc get --support)

    PGREEN "set_hugepage: cfg_hugepagesz $cfg_hugepagesz, cfg_hugepages $cfg_hugepages, rec_hugepages1G $rec_hugepages1G, rec_hugepages2M $rec_hugepages2M"

    if [ "X$cfg_hugepagesz" = "X" ]; then # currently not use any hugepage
        if [ -n "$rec_hugepages1G" ]; then
            [ $rec_hugepages1G -lt $expected ] && expected=$rec_hugepages1G
            PGREEN "setting hugepagesz 1G hugepages $expected"
            python /opt/bin/hugepage_config.pyc set --hugepagesz 1G --hugepages $expected
        elif [ -n "$rec_hugepages2M" ]; then
            ((expected=4*1024)) # 8G to 2M hugepages
            [ $rec_hugepages2M -lt $expected ] && expected=$rec_hugepages2M
            PGREEN "setting hugepagesz 2M hugepages $expected"
            python /opt/bin/hugepage_config.pyc set --hugepagesz 2M --hugepages $expected
        else
            PERROR "can't get both hugepages_1G_recommend and hugepages_2M_recommend"
            exit 1
        fi
    elif [ "X$cfg_hugepagesz" = "X1G" ]; then # currently use 1G hugepage
        [ $cfg_hugepages -gt $expected ] && return
        [ $rec_hugepages1G -lt $expected ] && expected=$rec_hugepages1G
        PGREEN "setting hugepagesz 1G hugepages $expected"
        python /opt/bin/hugepage_config.pyc set --hugepagesz 1G --hugepages $expected
    elif [ "X$cfg_hugepagesz" = "X2M" ]; then # currently use 2M hugepage
        ((expected=4*1024))
        [ $cfg_hugepages -gt $expected ] && return
        [ $rec_hugepages2M -lt $expected ] && expected=$rec_hugepages2M
        PGREEN "setting hugepagesz 2M hugepages $expected"
        python /opt/bin/hugepage_config.pyc set --hugepagesz 2M --hugepages $expected
    fi
}

###############################################################################
#               main                                                          #
###############################################################################

#step0:效验驱动编译内核版本匹配
#check_kernel_ver || { PERROR "Install Fail. The OS kernel version mismatch.";exit 1; }

#step1:检查设备是否存在智能卡
smart_getpci_cardtype || { PERROR "Please check whether to insert smart card."; exit 0; }

PGREEN "Begin to install smart card tools..."

#log dir
[ ! -d $LOG_DIR ] && mkdir -p $LOG_DIR

#安装scripts脚本到/opt/bin目录下
PGREEN "Begin to install scripts to /opt/bin/...."
install -m 755 $HOST_SCRIPTS/* /opt/bin/
if [ ! -f /etc/cvk/roce_qos_pfc.conf ]; then
    cp -f $ROCE_PFC_CONF /etc/cvk/
fi

#step2:安装智能卡所需依赖rpm
PGREEN "Begin to install rpms...."
install_rpms || { PERROR "Fail to install rpms."; exit 1; }

#step3:安装tools相关工具。
PGREEN "Begin to install tools...."
install_tools || { PERROR "Fail to install tools."; exit 1; }

PGREEN "Begin to install vdpa...."
install_vdpa || { PERROR "Fail to install vdpa."; exit 1; }

#step4:针对Bluefiled卡，设置udev规则；启动服务；加载相关内核模块;创建相关的配置文件模板
if  [ "$CARD_TYPE" = "BLUEFIELD" ];then
    create_udev_rules
fi

#step5:设置smart卡的Firmware
if [ "$CARD_TYPE" = "BLUEFIELD" ] || [ "$CARD_TYPE" = "CX6" ];then
    PGREEN "Begin to set Firmware...."
    cfg_smartFw "$CARD_TYPE" || { PERROR "Fail to set $CARD_TYPE SmartFW config."; }
fi

cp -f $UDEV_RULE /etc/udev/rules.d/
rm -f /etc/infiniband/vf-net-link-name.sh
cp -f $VF_NAME_SCRIPTS /etc/infiniband/

#step6:设置开启大页
if [ "$CARD_TYPE" = "CX6" ]; then
    set_hugepage
    python /opt/bin/iommustatus.pyc --iommu 1
fi

PGREEN "SmartNic install success,Please reboot."
#安装完拷贝版本信息到对应目录
cp -f ./smart-version /etc/

exit 0
