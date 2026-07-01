#!/bin/bash
##############################################################################
#    Func Name: first_boot.sh
# Date Created: 2013-12-20
#  Description: run at the first boot of system
#        usage: 1. $0 [$1]
#       Output:
#       Return: 0  : success
#-----------------------------------------------------------------------------
#  Modification History
#  DATE        NAME             DESCRIPTION
#  20140819    caizhifeng       In some case, CVK's all eth interfaces are down(exclude lo)
#                               after install, add some loginfo.
##############################################################################

cd "$(dirname $0)"
source ./first_boot_lib

logger -s "ovs first boot start ..."

# 0. wait for ovs starting
#check ovsdb-server status
waittime=0
while ! ovs-vsctl --verbose=db_ctl_base:syslog:off show 2>/dev/null >/dev/null; do
    sleep 1s
    ((waittime++))
    if [ $waittime -eq 30 ]; then
        break
    fi
done
service_name=openvswitch-switch
if which systemctl >/dev/null;then
    service_name=openvswitch
fi

service $service_name status
logger -s "ovs-first-boot: openvswitch-switch running use $waittime seconds."

br="vswitch0"

vswitch0_status=$(/opt/bin/ovs_bridge.sh list --vswitch | grep -w $br)
if [ -f /etc/sysconfig/network-scripts/ifcfg-$br ]; then
    vswitch0_cfg_status="true"
else
    vswitch0_cfg_status="false"
fi

if test -n "$vswitch0_status"; then
    if [ "$vswitch0_cfg_status" = "false" ]; then
        logger -s "ovs-first-boot: vswitch0 has exist, but ifcfg-vswitch0 is not exist. delete vswitch0."
        /opt/bin/ovs_bridge.sh del $br
        error_code=$?
        if [ $error_code -eq 0 ]; then
            logger -s "ovs_bridge.sh delete $br success. ifcfg-$br is not exist, begin recreate $br."
        fi
    else
        logger -s "vswitch0 and ifcfg-$br are exist, skip create $br."
    fi
fi

# 1. ifdown all ifaces and clear default route
# for 201405230026 that there may be multiple default route.
while ip route del default 2>/dev/null;do :; done

ports=$(ls -l /sys/class/net/ | grep -E "devices/pci|devices/platform" | awk '{print $9}')
usb_ports=$(ls -l /sys/class/net/ |grep -E 'devices/pci|devices/platform' | grep -F "usb" | awk '{print $9}')

if [ "$vswitch0_cfg_status" = "false" ]; then
    get_manage_uplink > /tmp/ovs_manage_uplink
    read old_uplink uplinkiface < /tmp/ovs_manage_uplink
    logger -s "ovs-first-boot:get manage uplink: previous is $old_uplink, current is $uplinkiface."

    # old_uplink uplinkiface = o n, there are 3 cases (II, III are handled near after):
    #   I) normal case: both o and n not nil
    #  II) idv except case: o not nil, n is nil
    # III) idv except case: o is nil, n is nil (o is nil => n is nil)

    # we have not determine best match uplinkiface yet (because a hard copy to otherspace), try select another best one
    if [ -n "$old_uplink" -a "X$uplinkiface" = "X" ]; then
        sel_port=
        for port in $ports; do
            if [ -e /etc/sysconfig/network-scripts/ifcfg-$port ]; then
                sel_port=$port
                break
            fi
        done

        if [ -z "$sel_port" ]; then
            sel_port=$(echo $ports | awk '{print $1}')
        fi
        if [ -z "$sel_port" ]; then
            logger -s "ovs-first-boot: can't determine uplinkiface, all phy: $ports."
        else
            if [ "X$sel_port" != "X$old_uplink" ]; then
                ifdown $sel_port
                mv /etc/sysconfig/network-scripts/ifcfg-$sel_port /etc/sysconfig/network-scripts/ifcfg-$sel_port.backup
                ip link set dev $sel_port name $old_uplink
                ports=$(ls -l /sys/class/net/ | grep -E "devices/pci|devices/platform" | awk '{print $9}')
            fi
            uplinkiface=$old_uplink
            logger -s "ovs-first-boot: determined sel_port:$sel_port, old_uplink:$old_uplink."
        fi
    fi
    # handle case III: select the first if any
    if [ -z "$old_uplink" ]; then
        if [ -n "$ports" ]; then
            sel_port=$(echo $ports | awk '{print $1}')
            if [ -n "$sel_port" ]; then
                old_uplink=$sel_port
                uplinkiface=$sel_port
            fi
        fi
    fi

    if test -e "/sys/class/net/$old_uplink/address" ;then
        ifdown $old_uplink
    fi
    if [ -n "$uplinkiface" -a "$old_uplink" != "$uplinkiface" ];then
        ifdown $uplinkiface
    fi

    # 2. ovs cmd to add bridge
    if [ -f "/opt/bin/smart_get_ports_without_vf.sh" ];then
        ports=$(/opt/bin/smart_get_ports_without_vf.sh)
    fi

    logger -s "ovs-first-boot: find initial uplink $uplinkiface, and list all phy: $ports."

    default_mtu="1500"
    shell_cmd="--accele_mode=normal --network_type=1 --br_mode=veb --datapath_type=system --mtu=$default_mtu --multicast=false"

    ifaces_arg=""
    if [ -f "/root/net.config" ]; then
        vlan_id=$(grep "vlan id=" /root/net.config | awk -F '=' '{print $2}')
        is_vlan=$(echo $vlan_id | grep "^[0-9]\{1,4\}$")
        bond_interfaces=$(grep "bond interfaces=" /root/net.config | awk -F '=' '{print $2}')
        is_ab_mode=$(grep "bond mode=" /root/net.config | awk -F '=' '{print $2}')

        bond_mode_arg="--bond_mode=active-backup"
        lacp_arg="--lacp=off"
        if [ "X$is_ab_mode" = "Xyes" ]; then
            bond_mode_arg="--bond_mode=active-backup"
        elif [ "X$is_ab_mode" = "Xno" ]; then
            bond_mode_arg="--bond_mode=balance-slb"
        fi

        #log
        logger -s "NET-CONFIG:$vlan_id, $bond_interfaces, $is_ab_mode"

        if [ "$vlan_id" != "0" ] && [ "$vlan_id" != "1" ] && [ "X$is_vlan" != "X" ]; then
            shell_cmd="$shell_cmd --vlan=$vlan_id"
        fi
        if [ "X$bond_interfaces" != "X" ]; then
            iface_num=0
            for iface in $bond_interfaces
            do
                if test -d /sys/class/net/$iface; then
                    ifaces_arg="$ifaces_arg --iface=$iface"
                    ((iface_num++))

                    ifdown $iface
                fi
            done

            if [ $iface_num -gt 1 ]; then
                shell_cmd="$shell_cmd ${br}_bond $bond_mode_arg $lacp_arg"
            else
                if test -d /sys/class/net/$bond_interfaces; then
                    ifaces_arg="--iface=$bond_interfaces"
                fi
            fi
        fi
    fi

    if [ -z "$ifaces_arg" -a -n "$uplinkiface" ];then
        if test -d /sys/class/net/$uplinkiface; then
            ifaces_arg="--iface=$uplinkiface"
        fi
    fi
    shell_cmd="$shell_cmd $ifaces_arg"

    ip_and_prefix=""
    gateway=""
    ipv6_and_prefix=""
    ipv6gateway=""
    bootproto=""
    if [ -n "${uplinkiface}" ]; then
        cur_config_file="/etc/sysconfig/network-scripts/ifcfg-${uplinkiface}"
        source ${cur_config_file}
        ipv4_addr=$IPADDR
        ipv4_prefix=$PREFIX
        gateway=$GATEWAY
        ipv6_and_prefix=$IPV6ADDR
        ipv6gateway=$IPV6_DEFAULTGW
        bootproto=$BOOTPROTO

        if [ "X${ipv4_addr}" != "X" ]; then
            ip_and_prefix="${ipv4_addr}/${ipv4_prefix}"
            ipv4_addr_arg="--address=${ipv4_addr}"
            ip_netmask=$(ipcalc -m ${ip_and_prefix} | awk -F '=' '{print $2}')
            ipv4_netmask_arg="--netmask=${ip_netmask}"
            shell_cmd="$shell_cmd ${ipv4_addr_arg} ${ipv4_netmask_arg}"
            bootproto="static"
            if [ "X${gateway}" != "X" ]; then
                ipv4_gateway_arg="--gateway=${gateway}"
                shell_cmd="$shell_cmd ${ipv4_gateway_arg}"
            fi
        fi

        if [ "X${ipv6_and_prefix}" != "X" ]; then
            ipv6_addr=$(echo ${ipv6_and_prefix} | awk -F '/' '{print $1}')
            ipv6_prefix=$(echo ${ipv6_and_prefix} | awk -F '/' '{print $2}')
            ipv6_addr_arg="--ipv6address=${ipv6_addr}"
            ipv6_prefix_arg="--prefixlength=${ipv6_prefix}"
            shell_cmd="$shell_cmd ${ipv6_addr_arg} ${ipv6_prefix_arg}"
            bootproto="static"
            if [ "X${ipv6gateway}" != "X" ]; then
                ipv6_geteway_arg="--ipv6gateway=${ipv6gateway}"
                shell_cmd="$shell_cmd ${ipv6_geteway_arg}"
            fi
        fi
    fi

    /opt/bin/ovs_bridge.sh add $br $shell_cmd
    error_code=$?
    if [ $error_code -ne 0 ]; then
        # no matter what error happens in ovs_bridge.sh, we create $br anyway.
        ovs-vsctl --no-wait add-br $br -- set bridge $br other_config:br_mode=0 || true
        ovs-vsctl --no-wait set Interface $br mtu_request=1500 || true
        ovs-vsctl -t 1 --if-exists set bridge vswitch0 other_config:network_type=3
        logger -s "ovs-first-boot:Failed to create br $br, error_code: $error_code."
    fi

    #set vswitch0 network_type=1 as management network
    #idms:202212010390
    #ovs-vsctl -t 1 --if-exists set bridge vswitch0 other_config:network_type=1

    # 3. update network configurition file
    if [ -n "$uplinkiface" ]; then
        if [ $error_code -ne 0 ]; then
            reset_iface_config $br
        else
            [ "X$bootproto" != "Xdhcp" ] && bootproto="static"
            python /opt/bin/netcfgtool.pyc set --name=$br --method4=$bootproto --ipv4=$ip_and_prefix --gateway4=$gateway --ipv6=$ipv6_and_prefix --gateway6=$ipv6gateway
        fi
    else
        # there my be no nic recognized during installing, we should still write $br to interfaces
        reset_iface_config $br
    fi

    if [ $error_code -eq 0 ]; then
        uplink=$(/opt/bin/ovs_bridge.sh get $br --uplink | awk -F ' : ' '{print $2}' | tr ',' ' ')
        ports=$(echo "$ports $uplink" | tr " " "\n" | sort | uniq -u)
    fi
else
    if [ -f "/opt/bin/smart_get_ports_without_vf.sh" ];then
        ports=$(/opt/bin/smart_get_ports_without_vf.sh)
    fi

    # delete vswitch0 of uplink in ports
    uplink=$(/opt/bin/ovs_bridge.sh get $br --uplink | awk -F ' : ' '{print $2}' | tr ',' ' ')

    ports=$(echo "$ports $br $uplink" | tr " " "\n" | sort | uniq -u)
    usb_ports=$(echo "$usb_ports $br $uplink" | tr " " "\n" | sort | uniq -u)
fi

logger -s "ports:$ports"
logger -s "usb_ports:$usb_ports"

# 4. zero and ifup all ifaces
reset_iface_config $ports

#set all ports on smart810card dhcp
if lspci | grep -q "124d"; then
    reset_iface_config_dhcp
fi

# set usb port dhcp mode
reset_usb_iface_dhcp $usb_ports

# 5. libvirt need hostname in /etc/hosts, otherwise it blocks.
br_name=$(/opt/bin/ovs_bridge.sh get $br --linux_bridge | awk -F ' : ' '{print $2}')
br_vlan=$(/opt/bin/ovs_bridge.sh get $br --vlan | awk -F ' : ' '{print $2}')

if [ "X$br_name" == "X" ]; then
    br_name=$br
fi

if [ "X$br_vlan" != "X" ]; then
    br_name="${br_name}.${br_vlan}"
fi

for iface in $uplink
do
    ifup $iface
done

ifdown $br_name
ifup $br_name

logger -s "ovs-first-boot: zero and ifup all phys"

vswitch0_ip=$(ip addr show $br_name |/bin/grep -m1 -oP '(?<=inet )[0-9.]+')
if test -n "$vswitch0_ip" && ! grep -qF "$(hostname)" /etc/hosts;then
    echo "$vswitch0_ip $(hostname)" >>/etc/hosts
fi

ovs-appctl -t ovsdb-server ovsdb-server/compact
sync

rm -fr /root/net.config

# add vswitch for easycloud
if [ -e /etc/.product_name ];then
    md5_prod=$(cat /etc/.product_name)
    md5_ecloud=$(printf "EASYCLOUD" | md5sum | awk '{print $1}')
    if [ "X$md5_prod" = "X$md5_ecloud" ];then
        if /opt/bin/ovs_bridge.sh get vswitch0 --uplink | grep -wq eth5;then
            logger -s "eth5 already used by vswitch0, can't use to create vswitch for ecloud"
        elif [ ! -e /sys/class/net/eth5 ];then
            logger -s "eth5 not exist, can't use create vswitch for ecloud"
        else
            /opt/bin/ovs_bridge.sh add ecloud_vs --accele_mode=normal --network_type=1 --iface=eth5 --address=192.168.0.1 --netmask=255.255.255.0 --mtu=1500
            error_code=$?
            if [ $error_code -eq 0 ];then
                python /opt/bin/netcfgtool.pyc --force set --name=ecloud_vs --ipv4=192.168.0.1/24
                error_code=$?
                [ $error_code -ne 0 ] && logger -s "netcfgtool failed for ecloud_vs, err_code:$error_code"
            else
                logger -s "vswitch ecloud_vs create failed for ecloud, err_code:$error_code"
            fi
        fi
    fi
fi

logger -s "ovs first boot done"
