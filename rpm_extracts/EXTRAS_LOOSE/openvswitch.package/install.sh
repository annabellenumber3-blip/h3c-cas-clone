#!/bin/bash
##############################################################################
#    Func Name: install.sh
# Date Created: 2013-12-20
#       Author: gaoliang
#  Description: install ovs package;
#        usage: 1. $0 [$1]
#               $1: install package dir
#       Output:
#       Return: 0  : success
#-----------------------------------------------------------------------------
#  Modification History
#  DATE        NAME             DESCRIPTION
##############################################################################

#ovs install package dir. not modify this dir.
OVS_PACKAGE_DIR=$1
KERNEL_VERSION=5.10.0-136.12.0.86.4.hl202.x86_64
INSTALL_KERNEL_DIR=/lib/modules/$KERNEL_VERSION
distri=$(/opt/bin/os_lsb_release -is)
cd "$(dirname $0)"
if [ "X$OVS_PACKAGE_DIR" = "X" ]; then
    OVS_PACKAGE_DIR=`pwd`
else
    OVS_PACKAGE_DIR=$OVS_PACKAGE_DIR/openvswitch.package
fi

CAS_AUDIT_DIR=/vms/.casaudit/ovs

install_scripts() {
    if [ -f $OVS_PACKAGE_DIR/scripts/ovs_bridge ]; then
        cp $OVS_PACKAGE_DIR/scripts/ovs_bridge $OVS_PACKAGE_DIR/scripts/ovs_bridge.sh.x
        mv $OVS_PACKAGE_DIR/scripts/ovs_bridge $OVS_PACKAGE_DIR/scripts/ovs_bridge.sh
    fi
    install -m 0755 -c $OVS_PACKAGE_DIR/scripts/* /opt/bin

    #environment
    echo OVS_SHELL_SCRIPT_PATH=\"/opt/bin\"  >> /etc/environment

    rm -rf $OVS_PACKAGE_DIR/scripts
}

install_rpm() {
    rpm -ivh --nodeps --replacepkgs --replacefiles  $OVS_PACKAGE_DIR/openvswitch-*.rpm
    rpm -ivh --nodeps --replacepkgs --replacefiles  $OVS_PACKAGE_DIR/python3-openvswitch-*.rpm
    mkdir -p $INSTALL_KERNEL_DIR/kernel/net/openvswitch/
    install -c $OVS_PACKAGE_DIR/openvswitch_ko/*.ko $INSTALL_KERNEL_DIR/kernel/net/openvswitch/

    mkdir -p $CAS_AUDIT_DIR
    rm -f $CAS_AUDIT_DIR/openvswitch-*.rpm
    install -c $OVS_PACKAGE_DIR/openvswitch-*.rpm $CAS_AUDIT_DIR
    install -c $OVS_PACKAGE_DIR/python3-openvswitch-*.rpm $CAS_AUDIT_DIR

    rm -rf $OVS_PACKAGE_DIR/openvswitch-*.rpm
    rm -rf $OVS_PACKAGE_DIR/python3-openvswitch-*.rpm
    rm -rf $OVS_PACKAGE_DIR/openvswitch_ko
    if [ -f "$INSTALL_KERNEL_DIR/kernel/net/openvswitch/openvswitch.ko.xz" ]; then
        rm -rf $INSTALL_KERNEL_DIR/kernel/net/openvswitch/*.ko.xz
        OVS_CURRENT_DIR=`pwd`
        cd $INSTALL_KERNEL_DIR/
        depmod -a
        cd $OVS_CURRENT_DIR
    fi
}

filter_usb_port() {
    usb_ports=$(ls -l /sys/class/net/ | grep -E 'devices/pci|devices/platform' | grep -F 'usb' | awk '{print $9}')
    if [[ X"$usb_ports" != X"" ]]; then
        rm -f uplink_mac_map_tmp
        cat uplink_mac_map | while read eth mac; do
            is_usb=false
            for ethx in $usb_ports; do
                if [[ X"$ethx" == X"$eth" ]]; then
                    is_usb=true
                    break
                fi
            done
            if $is_usb; then
                echo "$eth $mac" >> uplink_mac_map_tmp
            fi
        done
        mv uplink_mac_map_tmp uplink_mac_map
    fi
}

generate_network_info() {
    # 4950 G5 install modidy,
    # modify vswitch0's bind nic, select the first 1000m and lower_up port. If not selected, select the first 10000m and lower_up port.
    if ls -l /sys/class/net/ |grep -E 'devices/pci|devices/platform' | grep -qF 'usb'; then
        for iface in $(ls -l /sys/class/net/ |grep -E 'devices/pci|devices/platform' |awk '{print $9}')
        do
            ethtool $iface > ethtool_$iface
            begin=$(sed -n "/Supported link modes/=" ethtool_$iface)
            end=$(sed -n "/Supported pause frame use/=" ethtool_$iface)
            end=`expr $end - 1`
            support_link_mod=$(sed -n "${begin},${end}p" ethtool_$iface)
            if echo $support_link_mod | grep -Eq "10000baseT/Full"; then
                echo $iface >> ttm_ifaces
            elif echo $support_link_mod | grep -Eq "1000baseT/Full"; then
                echo $iface >> km_ifaces
            fi
            rm ethtool_$iface
        done
        uplink_iface=""
        for km_iface in $(cat km_ifaces |sort -nt "h" -k 2)
        do
            if ip link show $km_iface | grep -Eq "NO-CARRIER"; then
                uplink_iface=$km_iface
                break
            fi
        done
        if [ "X$uplink_iface" = "X" ]; then
            for ttm_iface in $(cat ttm_ifaces | sort -nt "h" -k 2)
            do
                if ip link show $ttm_iface | grep -Eq "NO-CARRIER"; then
                    uplink_iface=$ttm_iface
                    break
                fi
            done
        fi
        rm ttm_ifaces
        rm km_ifaces
        if [ -n "$uplink_iface" ]; then
            echo "$uplink_iface $(cat /sys/class/net/$uplink_iface/address)" > uplink_mac_map
        fi
        filter_usb_port
    fi

    # 1. perfer to first iface who has gateway or ip
    ip route > eth_ip_map
    ip -6 route | grep -Ev "fe80|unreachable" >> eth_ip_map
    if ! test -s uplink_mac_map; then
        for iface in $(grep '^default \| proto kernel ' eth_ip_map| grep -P -o '(?<=dev )\w+\b')
        do
            if [ "X$iface" != "Xlo" ]; then
                echo "$iface $(cat /sys/class/net/$iface/address)"
            fi
        done > uplink_mac_map
        filter_usb_port
    fi

    # 2. if no uplink, maybe all eth down. select the eth configured with ip for vswitch0.
    # only centos has this problem, because ip route maybe return none.
    # idms: 201912260856
    if ! test -s uplink_mac_map && [ "X$distri" = "XCentOS" -o "X$distri" = "XH3Linux" ]; then
        files=$(ls /etc/sysconfig/network-scripts/ifcfg-* 2>/dev/null)
        for file in $files; do
            ipaddr=$(source $file && echo $IPADDR)
            ipv6addr=$(source $file && echo $IPV6ADDR)
            name=$(source $file && echo $NAME)
            if [ "X$ipaddr" != "X" ] || [ "X$ipv6addr" != "X" ]; then
                if [ -e /sys/class/net/$name ] && readlink /sys/class/net/$name | grep -Eq "/devices/pci|devices/platform"; then
                    echo "$name $(cat /sys/class/net/$name/address)"
                fi
            fi
        done > uplink_mac_map
        filter_usb_port
    fi

    # 3. if no uplink, it may be dhcp but fails
    if ! test -s uplink_mac_map;then
        # up all interfaces so that we can find which is lower up
        ls /sys/class/net/ | xargs -n 1 -I {} ip link set {} up
        sleep 2 # wait 2 seconds for state update
        ip link > ip_link_map
        echo  == ip link ==
        cat ip_link_map

        # list phy iface and sort by pci address
        for iface in $(ls -l /sys/class/net/ |grep -E "devices/pci|devices/platform" |sort -k 11  |awk '{print $9}')
        do
            if grep -q "\b$iface: .*\bLOWER_UP\b" ip_link_map;then
                echo "$iface $(cat /sys/class/net/$iface/address)"
            fi
        done > uplink_mac_map

        #cell 9000 always uses I350 for vswitch0.
        #修改前product_list="AE100 UISM100 B5700G3 B7800G3 B460G3 B780G3 B5800G3 B560G3"
        product_list="AE100 B5700G3 B7800G3 B5800G3 UISB580G3 UISB460G3 UISB780G3 UISM100"
        product=$(dmidecode | grep -m1 -i "Product Name" | awk -F ':' '{print $2}' | tr -d " ")
        if echo $product_list | grep -Fq "$product"; then
            find_iface="false"
            pci_list=$(lspci -D | grep "Eth" | grep "I350" | awk '{print $1}')
            for pci in $pci_list
            do
                iface=$(ls /sys/bus/pci/devices/$pci/net)
                if grep -q $iface uplink_mac_map; then
                    mac=$(cat /sys/class/net/$iface/address)
                    find_iface="true"
                    break
                fi
            done

            if [ "X$find_iface" == "Xtrue" ]; then
                echo "find $iface $mac for server of UIS cell 9000"
                cat > uplink_mac_map_tmp <<EOF
$iface $mac
$(sed -e "/^$iface/d" uplink_mac_map)
EOF
                mv uplink_mac_map_tmp uplink_mac_map
            fi
        fi
        filter_usb_port
    fi
    # otherwise, there may be no nic recognized

    # log network information
    echo  == ip route ==
    cat eth_ip_map
    echo == selected eth:mac ==
    cat uplink_mac_map
}

### main ###
#install scripts first, ovs service start will use some scripts
install_scripts

[ "X$distri" = "XCentOS" ] && install_rpm
[ "X$distri" = "XH3Linux" ] && install_rpm

generate_network_info

#open linux bond debug
line=$(grep ^"*.info" /etc/rsyslog.conf -n | grep "/var/log/messages" | awk -F: '{print $1}')
if [ -n "$line" ]; then
    #forward debug level log to messages
    sed -i "${line}s/*.info/*.debug/" /etc/rsyslog.conf
    systemctl restart rsyslog.service 2>/dev/null
fi
bash /opt/bin/linux_bond_debug_enable.sh 2>/dev/null

mkdir -p $OVS_PACKAGE_DIR/firstboot
cp -f first_boot.sh $OVS_PACKAGE_DIR/firstboot
cp -f first_boot_lib $OVS_PACKAGE_DIR/firstboot
cp -f uplink_mac_map $OVS_PACKAGE_DIR/firstboot

exit 0
