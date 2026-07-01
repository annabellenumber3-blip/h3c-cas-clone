# File: netcfgtool.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/util.package/scripts/netcfgtool.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

l	Z	d
Z1d Z2d!Z3d"Z4d#Z5d$Z6d%Z7d&Z8d'Z9d(Z:d)Z;d*Z<d+a=d,Z>d-Z?d.Z@d/ZAd0ZBd1ZCd2ZDd
d4d5
ZEd6d7
d9d:
ZGd;d<
d=d>
ZId?d@
ZJdAdB
dCdD
dDeL
dEdF
dFeL
dGdH
dHeL
dIdJ
dJeL
dKdL
dLeL
dMdN
dNeO
dOdP
dPeO
dQdR
dReO
dSdT
dUdV
dWdX
ZWdYdZ
ZXd[d\
ZYd]d^
ZZd_d`
Z[dadb
Z\dcdd
Z]dedf
Z^dgdh
Z_didj
dkdl
Zadmdn
Zbdodp
Zcdqdr
Zddsdt
Zedudv
Zfdwdx
Zgdydz
Zhd{d|
Zid}d~
Zpeqd
z e3Zse
eweu
Zu[un
Zu[u0
esex
Release:
- support hwaddr
- support ipv6 and route6
- ...
TODO:
[ ] valid check whether route6 conflicts with ipv6
[ ] set --force parameter
[ ] do not get or list all item
ElementTree
LOAD_STATE
UNLOAD_STATE
ubuntuZ
centosz"/etc/linux-engine-networks/vswitchz"/etc/linux-engine-networks/subnetsz(/etc/linux-engine-networks/.wait_upgradez%/etc/sysconfig/network-scripts/ifcfg-z
/etc/pause_nic_listTc
shell
stderr
stdoutr
Failed to execute cmd: %s: %s)	
subprocess
Popen
PIPE
communicate
decode
returncode
logging
error
strip)
cmdZ
log_err
netcfgtool.py
execute\
Failed to read file: %s)
open
readr6
IOErrorr4
warning)
filename
resZ
tmp_filer9
	read_filef
Failed to write file: %s %s)
tempfileZ
mkstemp
fdopen
write
shutil
mover=
flush
fsync
filenor4
content
saferB
temp_filename
write_filep
clear_file_in_disk
z>Execute ip route, the list is %s, fail to get next value of %s)
index
ValueError
IndexErrorr4
line
default
	get_value
Nz'timeout 2 /opt/bin/ms_info.sh hotbackupr
check hotbackup except: %sF)
	Exceptionr4
	exception
str)
exr9
is_hotbackup
Nz#timeout 2 /opt/bin/ms_info.sh webipr
get webip except: %s)
	get_webip
d!d"
d#d$
d%d&
d'd(
ValidityCheckc
isVxlanDpdkIface
selfr9
__init__
ValidityCheck.__init__c
ipr9
isValidIPaddrss
ValidityCheck.isValidIPaddrssc
splitrl
subnetZ	subnet_no
prefixr9
isValidSubnet
ValidityCheck.isValidSubnet
make_netru
v6F)
Z	broadcastZ
net)
ip_and_prefix
inProcotol
ipsr9
isSubnetValidIP
ValidityCheck.isSubnetValidIPc
NTF)
ip_and_prefix_listrz
	ip_prefixr9
isSubnetValidIPs
ValidityCheck.isSubnetValidIPsc
deletezqwhen the operation is set/get/delete and the name value of the object iface_mask is null, it is returned directlyFT)
	operation
namer9
isValidIfaceName
ValidityCheck.isValidIfaceNamec
ip -br link show dev %sr
UPF)
statusr9
	isIfaceUP
ValidityCheck.isIfaceUPc
static
dhcp)
lower)
textZ
text_lowr9
check_method4
ValidityCheck.check_method4c
	check_dns
ValidityCheck.check_dnsc
socket
	inet_aton
addressrs
check_ipv4
ValidityCheck.check_ipv4Nc
check_gateway4
ValidityCheck.check_gateway4c
viar9
check_route4
ValidityCheck.check_route4c
	inet_pton
AF_INET6r
check_ipv6
ValidityCheck.check_ipv6c
NFrw
check_gateway6
ValidityCheck.check_gateway6c
check_route6,
ValidityCheck.check_route6c
binr
count
<listcomp>6
z3ValidityCheck.netmask_to_prefix.<locals>.<listcomp>
sumrr
netmaskr9
netmask_to_prefix4
ValidityCheck.netmask_to_prefixc
hexr
z5ValidityCheck.get_corrected_route.<locals>.<listcomp>r
{:0>2}r
format
joinr
	inet_ntoa
struct
packr
routeZ
address_decrs
address_splitZ
address_hexr
get_corrected_route8
z!ValidityCheck.get_corrected_routec
}	|	D
ovs-vsctl -t 2 list-br
zlovs-vsctl --verbose=db_ctl_base:syslog:off --format=json --columns=other_config,datapath_type list bridge %s
datar
br_mode
netdevT)
json
loads)
ifnamer
datapath_type
errZ
br_listZ
ovs_dictZ
other_configr[
check_vxlan_dpdk_ifA
z!ValidityCheck.check_vxlan_dpdk_ifc
-phyT
'/etc/sysconfig/network-scripts/ifcfg-%sF)
SYSTEM
UBUNTU
cfg_tool_inst
list_iface_namesrG
path
exists)
tool
ifacesZ	iface_cfgZ
iface_phy_cfgr9
check_vxlan_dpdk_config_file_
z*ValidityCheck.check_vxlan_dpdk_config_file)
__name__
__module__
__qualname__ri
classmethodrp
IfaceConfigr)
_init_as_unload
hwaddr
onboot
method4
ipv4
gateway4
route4
method6
ipv6
gateway6
route6
ifg_file
route4_file
route6_file
dns)
initr9
IfaceConfig.__init__c
IfaceConfig._init_as_unloadc
entityr
Elementr
attrib
SubElementr
	node_rootZ
node_mtuZ
node_hwaddrZ
node_onbootZ
node_method4Z	node_ipv4r
node_gateway4Z
node_route4r
node_method6Z	node_ipv6r
node_gateway6Z
node_route6r
to_xml
IfaceConfig.to_xmlc
isinstance
list
lenr
UNLOAD)
newr9
isChange
z$IfaceConfig.__eq__.<locals>.isChangeFT)
otherr
__eq__
IfaceConfig.__eq__c
Nzuname=%s
hwaddr=%s
mtu=%s
onboot=%s
method4=%s
ipv4=%s
gateway4=%s
route4=%s
method6=%s
ipv6=%s
gateway6=%s
route6=%s
__str__
IfaceConfig.__str__)
d(d d!
d)d#d$
IFGConfigtureToolc
IFGConfigtureTool.__init__ru
rPd	}
qzqP|
unpackr
network1Z
network2
protocolr9
_in_net
z2IFGConfigtureTool._conflict_check.<locals>._in_net
gatewayTr)
Fz?Invalid set parameter: conflict ip: %s and route: dst=%s via=%sr
z6Invalid set parameter: conflict ip: %s and gateway: %s)
ip_list
targetZ
check_itemr
logoutr
itemZ
conflict_flagZ
ip_to_checkro
_conflict_check
z!IFGConfigtureTool._conflict_checkc
s6t#S
s6t#S
s6t#S
_need_check$
z6IFGConfigtureTool._validity_check.<locals>._need_check
"Invalid set parameter: method4: %sr
HInvalid set parameter: set dhcp method4 and ip4 address in the same timez
Invalid set parameter: ipv4: %sz#Invalid set parameter: gateway4: %szKInvalid set parameter: set gateway4: %s for %s, but %s already has gateway4z,Invalid set parameter: route4: dst=%s via=%sr
HInvalid set parameter: set dhcp method6 and ip6 address in the same timez
Invalid set parameter: ipv6: %sz#Invalid set parameter: gateway6: %srw
zKInvalid set parameter: set gateway6: %s for %s, but %s already has gateway6z,Invalid set parameter: route6: dst=%s via=%sz8Invalid set parameter: set gateway4 but there is no ipv4r
z6Invalid set parameter: set route4 but there is no ipv4r
z6Invalid set parameter: set route6 but there is no ipv6)%r
ERROR_CODE_INVALID_METHOD4r
ERROR_CODE_INVALID_IPV4r
ERROR_CODE_INVALID_GATEWAY4
_gateway_exist_checkr
ERROR_CODE_GATEWAY4_EXISTr
ERROR_CODE_INVALID_ROUTE4r
ERROR_CODE_CONFLICT_IP6_METHODr
ERROR_CODE_INVALID_IPV6r
ERROR_CODE_INVALID_GATEWAY6r
ERROR_CODE_INVALID_ROUTE6r
ERROR_CODE_CONFLICT_GATEWAY4r
ERROR_CODE_CONFLICT_IPROUTE4
ERROR_CODE_CONFLICT_IPROUTE6
ERROR_CODE_OK)	rh
	old_iface
	new_ifacer
iface_namer
_validity_check#
z!IFGConfigtureTool._validity_checkc
/sys/class/net/%sz
%s/device/physfnz
/sys/devices/pciz
/sys/devices/platformTF)
realpath
startswith)
iface_pathZ	real_pathr9
_is_phy_iface
IFGConfigtureTool._is_phy_ifacec
nameserver)
dnscfg_filer6
splitlinesrr
append)
dns_listrX
get_dns
IFGConfigtureTool.get_dnsc
)	Nr)
Invalid set parameter: dns: %sz
nameserver %s
Tz)Failed to write resolv configuration filez
resolvconf -ur
z"Failed to update dns configuration)
ERROR_CODE_INVALID_DNSrS
ERROR_CODE_FAIL_WRITE_CONFILEr
ERROR_CODE_FAIL_RESOLV_UPDATEr
iface
conf_to_writer
set_dns
IFGConfigtureTool.set_dnsc
z6IFGConfigtureTool.get_gw_interface.<locals>.<listcomp>)
get_ifname_ipsr
keysre
)	rh
ip_mapr
key_listr9
get_gw_interface
z"IFGConfigtureTool.get_gw_interfacec
NTrv
get_ip_subnet
IFGConfigtureTool.get_ip_subnetc
operate_route
IFGConfigtureTool.operate_routec
result4
result6r9
	set_route
IFGConfigtureTool.set_routec
delr6
	del_route
IFGConfigtureTool.del_routec
	get_route
IFGConfigtureTool.get_routec
sBq,|
rTq,d
r~|	}
s,t	|
ip -brief addressr
fe80r
linesr1
infor
vlan_ifaceZ
if_ipsZ
last_ipr9
z IFGConfigtureTool.get_ifname_ipsc
/sys/class/net/z
/carrier
devZ
carrier_filera
	is_dev_up
IFGConfigtureTool.is_dev_upr
?TF)
time
sleep)
timeoutZ
waited_timeZ
check_intervalr9
wait_dev_up
IFGConfigtureTool.wait_dev_upr
            some ip not saved at ifcfg, need update neighbor arp
            to avoid network disconnect too long time
        z
ip -br address show r
z9IFGConfigtureTool.update_neighbor_arp.<locals>.<listcomp>z dev %s not up after timeout %ss.z
arping update neighbor arp: r!
z /sbin/arping -q -A -c 1 -w 3 -I z"; /sbin/arping -q -U -c 1 -w 3 -I g
debugrF
)	rh
Z	wait_timer7
dev_ipsr{
webipro
update_neighbor_arp
z%IFGConfigtureTool.update_neighbor_arpN)
LinuxEngineNetCfgc
linux_bridge
veth_linux
veth_ovs
vlanr
uplinks
	bond_name
	bond_mode
bond_policyrg
LinuxEngineNetCfg.__init__c
name: %s, linux_bridge: %s, veth_linux: %s, veth_ovs: %s, vlan: %s, mtu: %s, ipv4: %s, gateway4: %s, ipv6: %s, gateway6: %s, uplinks: %s, bond_name:%s, bond_mode: %s, bond_policy: %srN
LinuxEngineNetCfg.__str__N
LinuxEngineSubNetCfgc
master
vswitchrR
LinuxEngineSubNetCfg.__init__c
Nz?name: %s, master: %s, vswitch: %s, vlan: %s, ipv4: %s, ipv6: %srY
LinuxEngineSubNetCfg.__str__NrW
d!d"
d#d$
d%d&
d'd(
d)d*
d+d,
d-d.
d/d0
d1d2
d3d4
d5d6
d7d8
d9d:
d;d<
d=d>
Z d?d@
Z!dNdBdC
Z"dDdE
Z#dFdG
Z$dHdI
Z%dJdK
CentosCFGToolLinuxEnginec
superr\
	__class__r9
z!CentosCFGToolLinuxEngine.__init__ru
}	|	d
IPADDR%s="%s"
PREFIX%s="%s"
ARPCHECK%s="no"
ARPUPDATE%s="yes"
IPV6ADDR="%s/%s"
IPV6ADDR_SECONDARIES="%s"
IPV6INIT="yes"
IPV6INIT="no"
	enumerater`
line_to_writerU
Z	str_indexr
ip_list_lenr9
_ip_to_writeU
z%CentosCFGToolLinuxEngine._ip_to_writec
netcfg %s not existz
netcfg %s has no any contentr
netcfg_filerO
cfgrX
_read_netcfgm
z%CentosCFGToolLinuxEngine._read_netcfgc
subnetcfg %s not existz
subnetcfg %s has no any contentr
subnetcfg_filerO
_read_subnetcfg
z(CentosCFGToolLinuxEngine._read_subnetcfgc
%s.%sr
vlan iface %s still not exist)
hashlib
encode
	hexdigestrG
md5_valZ
tmp_namer9
_get_vlan_port_name
z,CentosCFGToolLinuxEngine._get_vlan_port_namer5
q`|	
q`|	
q`|	
s`|	
q`q`|	
q`q`|
)(Nz
ifcfg %s not existFz0ipv4 and ipv6 are both None for %s when doing %sTr)
/Bad line format: '%s' in configuration file: %sr
IPADDRr
PREFIX
NETMASKr	
IPV6ADDRrq
%s/%s
IPV6ADDR_SECONDARIES
ARPCHECK
	ARPUPDATEZ
IPV6INITc
<lambda>
z@CentosCFGToolLinuxEngine._handle_ips_for_ifcfg.<locals>.<lambda>
zBCentosCFGToolLinuxEngine._handle_ips_for_ifcfg.<locals>.<listcomp>r5
old_ipv4r9
old_ipv6r9
	ipv4_listr9
	ipv6_listr9
z+opt %s ipv4 %s and ipv6 %s for ifcfg %s:
6Failed to write configuration file of %s, return early)
setdefaultre
items
sort
extendrk
ifcfgr
optrO
index_to_iprX
ip_liner9
_handle_ips_for_ifcfg
z.CentosCFGToolLinuxEngine._handle_ips_for_ifcfgc
z=CentosCFGToolLinuxEngine._validity_check.<locals>._need_checkr
z(CentosCFGToolLinuxEngine._validity_checkc
)"Nr
invalid vlan id %sr
add vlan ifcfg: %sr
%s already exist, skip addr5
3Failed to handle_ips_for_ifcfg for %s, return early
noner
NAME="%s"
DEVICE="%s"
PHYSDEV="%s"
TYPE="VLAN"
BOOTPROTO="%s"
ONBOOT="yes"
DEFROUTE="yes"
NOZEROCONF="yes"
z	VID="%s"
VLAN="yes"
GATEWAY="%s"
IPV6_DEFAULTGW="%s%%%s"
add %s ifcfg:
%sz.Failed to write ifcfg file of %s, return early)
ERROR_CODE_INVALID_VLAN
hasattrrw
netcfgr,
vidr
physdev
ifcfg_filer
	bootprotor-
_add_vlan_ifcfg
z(CentosCFGToolLinuxEngine._add_vlan_ifcfgc
TYPE="Bridge"
HOTPLUG="yes"
NM_CONTROLLED="no"
IPV4_FAILURE_FATAL="yes"
IPV6_AUTOCONF="no"
	MTU="%s"
/sys/class/net/%s/bridgez+/sys/class/net/%s/bridge/multicast_snoopingz&BRIDGING_OPTS="multicast_snooping=%s"
z&Failed to write ifcfg %s, return early)
_is_valid_vlanrR
valr
_set_linux_bridge_ifcfgi
z0CentosCFGToolLinuxEngine._set_linux_bridge_ifcfgc
set slave %s ifcfgr
ethtool -P %s 2>/dev/nullr
address:r
5slave %s hwaddr get failed(%s), can't use for bondingr)
HWADDR="%s"
TYPE="Ethernet"
BOOTPROTO="none"
ARPCHECK="no"
ARPUPDATE="yes"
MASTER="%s"
SLAVE="yes"
PROMISC="yes"
1Failed to write slave ifcfg file %s, return early)
ERROR_CODE_FAIL_HWADDRr6
slaver
_set_bond_slave_ifcfg
z.CentosCFGToolLinuxEngine._set_bond_slave_ifcfgc
set ovs bridge iface %s ifcfgz"ovs bridge ifcfg %s already existsr)
+Failed to write ifcfg file %s, return early)
_set_ovs_bridge_ifcfg
z.CentosCFGToolLinuxEngine._set_ovs_bridge_ifcfgc
set veth peer ifcfgr
/sys/class/net/%s/masterr)
TYPE="Veth"
PEER="%s"
BRIDGE="%s"
TYPE="OVSPort"
OVS_BRIDGE="%s"
veth_linux_ifcfg_fileZ
veth_ovs_ifcfg_filer-
_set_veth_peer_ifcfg
z-CentosCFGToolLinuxEngine._set_veth_peer_ifcfgc
set bond iface %s ifcfgr
TYPE="Bond"
z7BONDING_OPTS="mode=%s xmit_hash_policy=%s  miimon=100"
BONDING_MASTER=yes
add bond %s ifcfg:
%sTr
bond_ifcfg_filer-
uplinkr
_set_linux_bond_ifcfg
z.CentosCFGToolLinuxEngine._set_linux_bond_ifcfgc
)"Nz
set iface %s ifcfgr
yesz%cat %s | grep -v "^#" | grep ^ONBOOT=rl
ONBOOT="%s"
slave %s onboot is no, set downz#ip link set dev %s down 2>/dev/nullr
Failed to set %s down)
)	rh
%_set_linux_bridge_single_uplink_ifcfg?
z>CentosCFGToolLinuxEngine._set_linux_bridge_single_uplink_ifcfgc
}	|	|
}	zN|	j
)/etc/sysconfig/network-scripts/ifcfg-%s.*r
	ifdown %s
ifup %sr*
Failed to ifup %s: %sz
ifup %s successz
ifup %s timeout)
globrG
basenamer0
TimeoutExpired
kill)
need_down_upZ
all_iface_pidsZ
vlan_file_pathrR
_check_if_linux_bridge_down_upm
z7CentosCFGToolLinuxEngine._check_if_linux_bridge_down_upc
dev_namer9
_update_neighbor_arp
z-CentosCFGToolLinuxEngine._update_neighbor_arpc
)	Nr
ifcfg %s already existz
ifcfg-%sz
new %s netcfg failed
read %s content: %sr
LINUX_NETWORK_PATHrG
ERROR_CODE_INVALID_NETCFGrK
_subnetcfg_new_base_masterrO
)	rh
_netcfg_new
z$CentosCFGToolLinuxEngine._netcfg_newc
)	NzDovs-vsctl --verbose=db_ctl_base:syslog:off port-to-br %s 2>/dev/nullFr
TzEovs-vsctl --verbose=db_ctl_base:syslog:off iface-to-br %s 2>/dev/nullr
br_namer
master_namer9
_check_uplink_used_by_others
z5CentosCFGToolLinuxEngine._check_uplink_used_by_othersc
}	|	d
}	|	d
}	|	d
}	|	d
}	|	d
}	|	d
}	|	d
}	|	d
}	|	d
}	|	d
}	|	d
}	|	d
}	|	d
}	|	d
}	|	d
)!Nz/uplink %s is in use by %s , skip set as defaultz
set uplink %s as default ifcfgr
uplink %s hwaddr get failed(%s)z
uplink %s not existsz(grep '^HWADDR' %s | awk -F= '{print $2}'rz
set %s default ifcfg:
%sTr
z2Failed to write uplink ifcfg file %s, return early)
curr_ifcfgra
_set_uplinks_default_ifcfg
z3CentosCFGToolLinuxEngine._set_uplinks_default_ifcfgc
del ifcfg based by netcfg %sr
remove ifcfg file %s)
remove)
Z	file_list
	vlan_namerv
vlan_ifcfg_filer
_netcfg_del_base_cfg
z-CentosCFGToolLinuxEngine._netcfg_del_base_cfgc
}	|	t
	%s/%s.old
del %s netcfg read failedr
z(/etc/sysconfig/network-scripts/route*-%sz*/etc/sysconfig/network-scripts/route*-%s.*z
remove netcfg file %sz
remove old netcfg file %sz
remove route file %s)
cfg_file
old_cfg_filer
ip_port_namer
route_filesr
_netcfg_del<
z$CentosCFGToolLinuxEngine._netcfg_delc
_netcfg_mode
z$CentosCFGToolLinuxEngine._netcfg_modc
rbq.t
%s/*c
zGCentosCFGToolLinuxEngine._subnetcfg_new_base_master.<locals>.<listcomp>c
.old
endswith)
%s subnetcfg read failed, skipz!set subnet %s ifcfg for master %sr
LINUX_SUBNET_PATHr
)	rh
subnet_namesr
master_ifcfgr
z3CentosCFGToolLinuxEngine._subnetcfg_new_base_masterc
set new subnet %s ifcfgz
new %s subnetcfg failedr
z!master %s not exist for subnet %sr
ERROR_CODE_INVALID_SUBNETCFGrK
	subnetcfgrZ
_subnetcfg_new
z'CentosCFGToolLinuxEngine._subnetcfg_newc
isdigitr
z'CentosCFGToolLinuxEngine._is_valid_vlanc
rnq^t
)	Nr
cat %s | grep ^vlan=r
cat %s | grep ^master=z
vlan used info: %s)
)	rh
master_vlanrR
curr_masterZ	curr_vlanr9
_get_vlan_used_info
z,CentosCFGToolLinuxEngine._get_vlan_used_infoc
)	Nz
del ifcfg based by subnetcfg %sz
del %s subnetcfg read failedr
remove subnet vlan ifcfg %sr;
ip_ifcfg_fileZ	vlan_infor
_subnetcfg_del_base_file
z1CentosCFGToolLinuxEngine._subnetcfg_del_base_filec
_subnetcfg_mod
z'CentosCFGToolLinuxEngine._subnetcfg_modc
remove subnetcfg %sz
remove old subnetcfg %s)
_subnetcfg_del
z'CentosCFGToolLinuxEngine._subnetcfg_delc
r6q$d
q$|	
q$|	
q6q$d
GATEWAY
IPV6_DEFAULTGW
z=CentosCFGToolLinuxEngine._get_ip_from_ifcfg.<locals>.<lambda>r
z?CentosCFGToolLinuxEngine._get_ip_from_ifcfg.<locals>.<listcomp>)
ip6r
_get_ip_from_ifcfg
z+CentosCFGToolLinuxEngine._get_ip_from_ifcfgc
}	}	|
q2t	j
z-get subnet iface %s failed, subnetcfg is noner
'/etc/sysconfig/network-scripts/route-%s
(/etc/sysconfig/network-scripts/route6-%sz+subnet master iface %s ifcfg file not exist
 via r
 devr
_get_subnet_ifaceJ
z*CentosCFGToolLinuxEngine._get_subnet_ifaceFc
z#get iface %s failed, netcfg is noner
iface %s ifcfg file not existrx
	BOOTPROTOr
HWADDR
/sys/class/net/%s/addressz
/sys/class/net/%s/mtur
real_ip_ifacer
_get_iface|
z#CentosCFGToolLinuxEngine._get_ifacec
z3get iface %s failed, not linux engine net or subnet)
	get_iface
z"CentosCFGToolLinuxEngine.get_ifacec
z3set iface %s failed, netcfg and subnetcfg not exist)
ERROR_CODE_INVALID_NAMEr
	set_iface
z"CentosCFGToolLinuxEngine.set_ifacec
z6delete iface %s failed, netcfg and subnetcfg not exist)
delete_iface
z%CentosCFGToolLinuxEngine.delete_ifacec
z)CentosCFGToolLinuxEngine.list_iface_names)
F)(r
__classcell__r9
d!d"
d#d$
CentosCFGToolc
/etc/resolv.conf)
CentosCFGTool.__init__Tc
z*Iface: %s does not have configuration filer)
z#Iface: %s does not have route4 filez#Iface: %s does not have route6 file)
isfiler4
need_checkr
_get_ifg_file
CentosCFGTool._get_ifg_fileru
}	|	d
CentosCFGTool._ip_to_writer)
z.Iface: %s does not have route%s file to deleter
%s via %s dev %sr
z"Failed to write route%s file of %sFT)
)	rh
route_list
route_filer
route_to_writer
_write_route_file
CentosCFGTool._write_route_filec
)	rh
resultr,
z"CentosCFGTool._gateway_exist_checkc
rHq6d
rft	
d	d	g
d	d	g
d	d	g
qNq6d
)#NFrx
ONBOOTr
z)CentosCFGTool.get_iface.<locals>.<lambda>r
z+CentosCFGTool.get_iface.<locals>.<listcomp>r
CentosCFGTool.get_ifacec
CentosCFGTool.delete_ifacec
z$cat %s | grep ^uplinks= | grep -w %sFr
z-%s not used by any linux engine network, skipr
z6%s used by linux engine network %s, but not bond, skipz5cat %s/%s | grep ^bond_name | awk -F '=' '{print $2}'z get bond port of %s failed, skipr
bond port %s not exist, skipz	set %s upr
Failed to set %s up)
netcfg_filesr
slavesrR
Z	bond_portr9
_restore_linux_engine_bond
z(CentosCFGTool._restore_linux_engine_bondFc
}	|	d	|
}	|	d
}	|	d
}	|	d
}	|	d
}	|	d
}	|	d
}	|	d
rj|	|
sj|	|
r\|	d
r~|	d
|	d"|
|	d#|
j!d'k
j!d)k
)+NF
<when you modify the iface, nothing changed with the iface %sr
NAMEZ
DEVICEr
TYPEZ
NOZEROCONFr
HOTPLUGZ
NM_CONTROLLEDZ
IPV6_AUTOCONFr
NOZEROCONF="no"
!Failed to set %s up, return earlyr
z Failed to pause %s, return earlyr
Failed tp open %s, return early)%r
ERROR_CODE_FAIL_IFUPr
add_pause_nic
ERROR_CODE_FAIL_IFDOWN
remove_pause_nic)
forcerB
skip_itemsr-
CentosCFGTool.set_ifacec
&/etc/sysconfig/network-scripts/ifcfg-*c
z2CentosCFGTool.list_iface_names.<locals>.<listcomp>c
namesr9
CentosCFGTool.list_iface_namesc
cat %sr
tmp_listr
_get_interface_static_route5	
z)CentosCFGTool._get_interface_static_routec
)	NFr)
del route file: %sz
rm -f %sTz
write route to %s:
%sz"Failed to write static list file: )
_write_static_route_list_fileC	
z+CentosCFGTool._write_static_route_list_filec
NFru
ip route add %s via %s dev %sz ip -6 route add %s via %s dev %sz
run route cmd: %sz
Failed to run route cmd: %sT)
replacer4
old_len
	route_new
new_len
	route_cmdr7
_operate_one_route_fileT	
z%CentosCFGTool._operate_one_route_filec
}	|	|
Nz&operation: %s, protocol: %s, route: %sr
$route: dst:%s via:%s,via is invalid!
-route: dst:%s via:%s, cant not found gateway!
%s,%sr;
(route: dst:%s via:%s is duplicate route!)
typer
ERROR_CODE_INVALID_ROUTE_DSTr2
ERROR_CODE_INVALID_ROUTE_GWr3
ERROR_CODE_DUPLICATE_ROUTEr%
ERROR_CODE_ROUTE_ADD
ERROR_CODE_ROUTE_DELr
ifname_listr
route_itemr9
_operat_route_helper
z"CentosCFGTool._operat_route_helperc
CentosCFGTool.operate_routec
|	r$|
route4_list
route6_list
tmp_route4
tmp_route6r
CentosCFGTool.get_route)
d%d	d
d d!
d"d#
UbuntuCFGToolc
/etc/network/interfacesz"/etc/resolvconf/resolv.conf.d/base)
UbuntuCFGTool.__init__ru
NFr)
inetr
inet6Tr
target_iface_processr
z"UbuntuCFGTool._gateway_exist_checkc
q(n"|
autor,
upr@
_filter_iface
UbuntuCFGTool._filter_ifacer)
}	|	}
        rq
iface %s inet static
iface %s inet6 static
%saddress %s
%snetmask %s
%sgateway %s
%saddress 0.0.0.0
%snetmask 0.0.0.0
indentro
UbuntuCFGTool._ip_to_writec
32z'up route -A inet add -host %s gw %s %s
z&up route -A inet add -net %s gw %s %s
z"up route -A inet6 add %s gw %s %s
_route_to_write
UbuntuCFGTool._route_to_writec
ip -br link show %sr
str9
_isIfaceLinkState(
UbuntuCFGTool._isIfaceLinkStatec
qNq0|
/run/network/ifstateFr!
access
F_OKrH
link_stateZ
if_staterX
_isIfstateValid3
UbuntuCFGTool._isIfstateValidc
d d!
d#d$
d%d!
d&d$
)(NZ
IDLEZ
INET4Z
INET6r
z+up route -A (.*?) add(.*) (.*) gw (.*) (.*)z4up route add -net (.*) netmask (.*) gw (.*) dev (.*)r
	<genexpr>z
z*UbuntuCFGTool.get_iface.<locals>.<genexpr>r
inet4z
0.0.0.0c
z)UbuntuCFGTool.get_iface.<locals>.<lambda>r
z+UbuntuCFGTool.get_iface.<locals>.<listcomp>c
match
grouprl
state_idleZ
state_inet4Z
state_inet6Z
target_iface_statusZ
index_to_ip4Z
index_to_ip6Z
multi_ip4_indexZ
multi_ip6_indexrX
Z	match_objr
Z	inet_typer~
len_ipv4r
UbuntuCFGTool.get_ifaceFc
ifdown --force %sr
auto %s
iface %s inet dhcp
iface %s inet6 dhcp
z	%smtu %s
UbuntuCFGTool.set_ifacec
UbuntuCFGTool.delete_ifacec
iface_namesrX
UbuntuCFGTool.list_iface_namesc
r&|	d
r&|	d
F)	r=
readliner6
close)
numZ
pre_namer
if_routeZ
if_maprR
_get_interface_context
z$UbuntuCFGTool._get_interface_contextc
NFru
z#route -A inet add -host %s gw %s %sz"route -A inet add -net %s gw %s %sz
up r
route -A inet6 add %s gw %s %sr5
insertr$
writelinesrR
cfg_contextZ
ifname_mapZ
ifname_routesr
if_static_route
endrU
f_cfgr7
_operate_one_route_cfg?
z$UbuntuCFGTool._operate_one_route_cfgc
cfg_argsr
ifaces_file_context
	iface_map
iface_router
_operate_route_helperz
z#UbuntuCFGTool._operate_route_helperc
UbuntuCFGTool.operate_routec
q.q"|
UbuntuCFGTool.get_route)
xmlZ
replayr
%sroute4=%s
%sroute6=%s)	r
tostringr2
printr
format_r
	keyprefix
output_str
rootr
construct_route_output
replyr]
)	ra
iface_conf_list
iface_maskrb
xml_node_listr,
xml_noder9
construct_iface_output
)	Nr\
dns=%s)
node_entityZ
node_dnsr
construct_dns_output
is_linux_network
Nz1ip -br link show type veth | awk -F@ '{print $1}'r
is_veth_port
/etc/sysconfig/network-scripts/
ifcfg-r
realpath /sys/class/net/z, | grep -Eq "/devices/pci|/devices/platform"r
listdirr
nic_list
file
nic_namer9
get_phy_nic_list
Nz8grep 'ONBOOT="no"' /etc/sysconfig/network-scripts/ifcfg-r
/etc/sysconfig/network-scriptsrn
ONBOOT="no"z
ONBOOT="yes"rD
ifup z
Failed to bring up )
STATIC_PAUSE_FILEr
set_nic_status)
phy_nic_list
nicr
new_content
pause_list_filer9
check_nic_status
pause_listrv
get_pause_nic_list%
set_nic_status: set dev %s downz
ip link set dev %s downr
Failed to set 
 down)
ERROR_CODE_FAIL_SET_NIC_STATUSr
pause_nic_listru
fcntlZ
flockZ
LOCK_EXrI
LOCK_UN)
save_pause_nic_list6
add_pause_nic: set dev %s down
ip link set dev r{
remove_pause_nic: set dev %s upr
 upr
iface name %s use linux engine)
z(list_iface_names_all.<locals>.<listcomp>c
/proc/net/vlan/%sr
/sys/class/net/%s/bondingr
Z	net_namesrp
list_iface_names_allb
handle_list_cmdy
handle_get_cmd
cfg_toolZ
vxlan_dpdk_br_phyr9
handle_del_cmd
vxlan_dpdk_brZ
br_oldr9
handle_set_cmd
handle_dnsget_cmd
handle_dnsset_cmd
handle_routeset_cmd
handle_routedel_cmd
handle_routeget_cmd
r8t |
rVt!
rht#
z#nic is not exist, please check namer
z9can't do %s, need wait upgrading to linux bridge finishedr
dhcpresolveFr
zDip -o -4 a show dev %s | grep -m1 -v 'scope link' | awk '{print $4}'r
z>ip -o -4 r show dev %s | grep 'default via' | awk '{print $3}'zDip -o -6 a show dev %s | grep -m1 -v 'scope link' | awk '{print $4}'z>ip -o -6 r show dev %s | grep 'default via' | awk '{print $3}'r
internalz6%s operation has been done by ovs_bridge or ovs_subnet
dnsget
dnsset
routeset
routedel
routeget
checknicstatus)
WAIT_UPGRADE_FILE
ERROR_CODE_UPGRADE_NOT_FINISHEDr
getattrr
ERROR_CODE_WRONG_OPERATORTYPErt
	call_typera
argsr
iface_confZ
cmd1Z
out1Z
cmd2Z
out2r%
handle_cmd
nxd	|
]r}	|	j
]R}	t
|	j	
|	j	
) Nr)
operatorType)
z0Bad xml content: unrecognized operation type: %sr
callTyper
trueTr
z/Bad xml content: lose iface name in xml requestr
z%Bad xml content: unrecognized tag: %sr
)ip -brief link show %s | awk '{print $1}'r
fromstringr
tagr
setattrr$
xml_stringr
elementZ
subElem
valuer
	real_namer9
parse_xml_request
s`d	|
}	|	d
}	|	d
callerr
cmdliner
routesr9
dst_viar
parse_cmdline_requestY
d!d"d
d#d$d%d&
d'd(d
d(d)d*
d+d,d-d-d.d/
d1d2d3
d#d$d%d&
d4d1d5d&
d'd(d
d(d6d*
d+d,d-d-d7d/
d#d$d%d&
d4d1d5d&
d'd(d
d(d8d*
d+d,d-d-d9d/
d:d,d-d;d<d/
d=d,d-d;d>d/
d?d,d-d;d@d/
d=d,d-d;dAd/
d?d,d-d;dBd/
d'd(d
d(dCd*
d+d,d-d-dDd/
dEdF
)GNzAnetcfgtool to set or get network information, @version@=@VERSION@)
descriptionz
--force
store_truez
configure network forcefully)
action
helpr
operation type)
destr
configure network by xml format)
xml content for configurationr
get iface configurationr
set iface configurationr
list iface configurationr
delete iface configurationr
set dns configurationr
get dns configurationr
set route configurationr
del route configurationr
get route configurationr
check nic statusz
--nameTz
iface name, required field)
requiredr
--formatZ
keyvaluez
format for get)
choicesrZ
--keyprefix
keyprefix for get
nargs
constrZ
--dhcpresolveFz set for dhcp real ip information)
--callTypez
call type, not required fieldz
format for listz
keyprefix for listz
format for dnsgetz
keyprefix for dnsgetz
--dnsr(
z.dns, for set operation, blank indicates delete
--route4z7route4, for set operation, blank indicates no operation
--route6z7route6, for set operation, blank indicates no operationz7route4, for del operation, blank indicates no operationz7route6, for del operation, blank indicates no operationz
format for routegetz
keyprefix for routegetc
--mtur
z.mtu, for set operation, blank indicates deleter
--hwaddrz1hwaddr, for set operation, blank indicates deletez	--method4z2method4, for set operation, blank indicates deletez
--ipv4z/ipv4, for set operation, blank indicates deletez
--gateway4z3gateway4, for set operation, blank indicates deleter
z1route4, for set operation, blank indicates deletez	--method6z2method6, for set operation, blank indicates deletez
--ipv6z/ipv6, for set operation, blank indicates deletez
--gateway6z3gateway6, for set operation, blank indicates deleter
z1route6, for set operation, blank indicates deletez
--onbootz.onboot, for set operation, blank indicates yes)
add_argument)
parr9
set_common_options
z&parse_args.<locals>.set_common_options)
argparse
ArgumentParserr
add_subparsers
add_parser
parse_argsr
argvZ
top_parserZ
subparsersZ
xml_parserZ
get_parserZ
set_parserZ
list_parserZ
delete_parserZ
dnsset_parserZ
dnsget_parserZ
routeset_parserZ
routedel_parserZ
routeget_parserZ
checknicstatus_parserr
Nz"/var/log/caslog/cas_netcfgtool.logz>%(asctime)s %(levelname)7s %(funcName)s:%(lineno)d %(message)sz
%m-%d %H:%M:%S)
levelr
datefmtrA
args: %sr;
basicConfig
DEBUGrK
sysr
CENTOSr
)	rB
log_filer
main
__main__z
run met except: %sz+execute end : error code %d, time use %.3fs)
__doc__r.
copyrl
Z	xml.etreer
ERROR_CODE_CONFLICT_IP4_METHODr
ERROR_CODE_GATEWAY6_EXISTr
ERROR_CODE_CONFLICT_GATEWAY6r
Z ERROR_CODE_FAIL_WRITE_ROUTE4FILEZ ERROR_CODE_FAIL_WRITE_ROUTE6FILEr
ERROR_CODE_INVALID_IFACEr
ERROR_CODE_RUN_EXCEPTr|
LOADr
NETWORK_IFCFG_CONFG_FILErs
objectre
start_timerB
timeuserK
exitr9
<module>
