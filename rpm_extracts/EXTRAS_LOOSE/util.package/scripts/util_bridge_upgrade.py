# File: util_bridge_upgrade.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/util.package/scripts/util_bridge_upgrade.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

l	Z	d
Z2d5d!d"
Z3d6d$d%
Z4d&d'
d(d)
d)e6
Z7d*d+
Z8e9d,k
d-Z:e
j<d.d/e:d0
=d1e>e
ZC[Cn
ZC[C0
=d4eAeE
ElementTree)
randint
/etc/sysconfig/network-scripts/z(/etc/linux-engine-networks/.wait_upgradez'/etc/linux-engine-networks/upgrade_bak/
shell
stderr
stdoutZ	close_fdsr
success to execute: %s, out: %sz1failed to execute: %s, out: %s, err: %s, code: %sz
cmd: %s, result: %s)
isinstance
split
subprocess
Popen
PIPEZ
communicate
decode
strip
returncode
logging
debug
error
	Exception)
cmdr
raise_exception
code
util_bridge_upgrade.py
command_output@
execute_commandP
NzF/opt/bin/ovs_bridge.sh get %s --used_by_vm | awk -F ' : ' '{print $2}'T
trueF)
vsnamer.
resr4
is_used_by_vmS
d!d"
d#d$
d%d&
BridgeSwitchc
_bridge_name
_bridge_info
_bridge_subnet_info
_bridge_route4_info
_bridge_route6_info)
selfZ
bridge_namer4
__init__Y
BridgeSwitch.__init__c
network_typez&vswitch:%s not has host network, skip!
accele_modeZ
dpdkZ
smartz.accele_mode(%s) can not switch network engine!
br_modez	vxlan-sdnz1br_mode(vxlan-sdn) can not switch network engine!
subnetz-bridge related route -- route4:%s, route6:%s.
vswitch0zKDelete old bridge  %s finished. Uplink status excaption, skip create stage.z
add new bridge failed)
get_bridge_info
ERROR_CODE_OK
has_host_network_type
intr>
infor=
warning
check_device_exist
get_bridge_subnet_info
lenr?
	del_route
del_subnet
has_nohost_network_type
del_bridge_nohost
del_bridge_host
check_uplinks_status
save_bridge_info
ERROR_CODE_UPLINK_STATUS_ERROR
add_bridge
add_subnet
	add_route)
subnet_sizer:
switch_bridge`
BridgeSwitch.switch_bridgec
/sys/class/net/%sTF)
path
existsr=
BridgeSwitch.check_device_existc
save bridge info
.bak
{} = {}
failed to save bridge info.)
TMP_NET_CONFIG_PWD
makedirsr=
openr>
items
write
formatr-
filenameZ
configfile
value
BridgeSwitch.save_bridge_infoc
NTF)
MANAGE_NET_FLAG
STORAGE_NET_FLAG
BACKUP_NET_FLAG
MIGRATE_NET_FLAG
bridge_network_typer4
z"BridgeSwitch.has_host_network_typec
BUSINESS_NET_FLAG
DRAIN_NET_FLAG
SEG_NET_FLAG
MIRROR_NET_FLAGrs
z$BridgeSwitch.has_nohost_network_typec
check_network_type_manage
z&BridgeSwitch.check_network_type_managec
uplink
uplinksry
z!BridgeSwitch.check_uplinks_statusc
reset ovs network typez4ovs-vsctl set bridge %s other_config:network_type=%srD
failed to set network_type.)
	exceptionr"
!ERROR_CODE_SET_NETWORK_TYPE_ERRORrJ
reset_ovs_network_type
z#BridgeSwitch.reset_ovs_network_typec
nDt	t
}	|	
/opt/bin/ovs_bridge.sh get z
 --uplink --vlan --br_mode --datapath_type --bond_mode --lacp --multicast --mtu --active-algorithm --reselect-on-change --bandwidth --used_by_mirror --used_by_drain --accele_mode --network_type --status --network_engineT
*python /opt/bin/netcfgtool.pyc get --name F
route4
route6
[']r
mturH
()rz
failed to get bridge info)
replacer;
evalr@
ERROR_CODE_GET_BRIDGEINFO_ERRORrJ
route4_infor
route4_host
route6_infor
route6_hostrm
BridgeSwitch.get_bridge_infoc
]z}	|
NzWpython /opt/bin/ovs_subnet.pyc --xml <request><operation>get</operation><vswitch><name>z
</name></vswitch></request>F
vswitch
name
speed
port
bandwidth_ratio
vlanrD
Noner
Bridge Subnet info %sz
failed to get subnet info)
fromstring
find
textr?
findallrL
append
rangerQ
ERROR_CODE_GET_SUBNETINFO_ERRORrJ
rootr
subnet_listrG
Z	subnet_vs
subnet_namer
z#BridgeSwitch.get_bridge_subnet_infoc
}	~	S
}	~	0
route-%sz	route-%s.z	route6-%sz
route6-%s.rG
z'/etc/sysconfig/network-scripts/route-%sz(/etc/sysconfig/network-scripts/route6-%sz
failed to delete the route)
ERROR_CODE_UNKNOWNr_
listdir
NET_CONFIG_PWD
ERROR_CODE_DEL_ROUTE4_ERRORr=
startswithr`
join
remove
ERROR_CODE_DEL_ROUTE6_ERRORrO
error_code
files
fileZ	file_pathrG
route_subnet_fileZ
route6_subnet_filerm
BridgeSwitch.del_routec
q|qf|
zH/opt/bin/ovs_bridge.sh get %s --linux_bridge | awk -F ' : ' '{print $2}'T
z"ip -brief link show | grep -w '%s'Fz
res: %sz#echo '%s' | awk -F ' ' '{print $4}'r~
z9wait dev up %s s, if dev is down, add route maybe failed.z
wait dev up use %s sz
failed to check device status)
time
sleeprN
idxr.
linux_bridger:
flagZ
dev_statusrm
checkDeviceStatus
BridgeSwitch.checkDeviceStatusc
request
operatorTypeZ
routeset
entityr
dstZ
viaz
add route xml: %s
'python /opt/bin/netcfgtool.pyc xml '%s'Tr
add route ip xml: %sz
failed to add the route)
ERROR_CODE_ADD_ROUTE4_ERRORr@
Element
SubElementr
tostringr'
ERROR_CODE_ADD_ROUTE6_ERRORrA
dst_ipZ
via_ipr
	operationr
tree
replyr.
BridgeSwitch.add_routec
/opt/bin/ovs_bridge.sh del Tr
deleter
delete bridge ip xml: %sr
failed to delete the bridge)
setr>
ERROR_CODE_DEL_BRIDGE_ERRORrJ
BridgeSwitch.del_bridge_hostc
--accele_mode=%s 
--network_type=%s rD
--multicast=%s 
	multicastr
	--mtu=%s z /opt/bin/ovs_bridge.sh mod %s %sTr
method4
method6
ipv4
gateway4r
ipv6
gateway6r
set bridge ip xml: %sr
z"faild to mod the bridge of nohost.)
ERROR_CODE_ADD_BRIDGE_ERRORrJ
config_liner.
mtu_netcfgtoolr
BridgeSwitch.del_bridge_nohostc
NzWpython /opt/bin/ovs_subnet.pyc --xml <request><operation>set</operation><vswitch><name>z
</name><speed>r
</speed></vswitch></request>FrG
delete subnet ip xml: %sr
failed to delete the subnet)
)	rB
BridgeSwitch.del_subnetc
|	d/
|	d/
);Nr
--br_mode=veb r
--br_mode=vxlan-sdn 
--br_mode=vxlan-cas ry
%s_bond r
--bond_mode=%s Z	bond_modez
--iface=%s r
--vlan=%s z
--datapath_type=%s Z
datapath_typer
strictz
--address=%s --netmask=%s r
--gateway=%s r
z#--ipv6address=%s --prefixlength=%s r
--ipv6gateway=%s r
lacpz
--lacp=%s z
active-algorithmz
--active-algorithm=%s z
reselect-on-changez
--reselect-on-change=%s z /opt/bin/ovs_bridge.sh add %s %sTr
faild to add the bridge.)
	ipaddress
ip_network
netmaskr=
ifacesZ
iface
address
prefiler
ipv6_addressZ
ipv6_prefiler.
BridgeSwitch.add_bridgec
} ~ S
} ~ 0
)#Nr
maskr
maskIpv6z
create subnet xml: %sz'python /opt/bin/ovs_subnet.pyc --xml %sr
add subnet xml: %sr
faild to add the subnet)
ERROR_CODE_ADD_SUBNET_ERRORrJ
)!rB
subnet_xmlr
ratior
sub_ipv4Z
sub_netmaskZ
sub_ipv6Z
sub_maskIpv6r
reply2rm
BridgeSwitch.add_subnetN)
__name__
__module__
__qualname__rC
}	|	d
Set bridge switch)
descriptionz
--namez
bridge name)
helpz
Script Execute: 
"%s"r4
<listcomp>
main.<locals>.<listcomp>z'systemctl is-active openvswitch.serviceZ
activezTThe current environment openvswitch.service is not active. Upgrades are not allowed.z%/opt/bin/ovs_bridge.sh list --vswitchTz
 : r
z9The current environment has completed the engine upgrade.z
vswitch_list: %sFzG/opt/bin/ovs_bridge.sh get %s --linux_bridge | awk -F ' : ' '{print$2}'r
z-faild to switch the bridge %s, error code %s.z success to switch the bridge %s.z*the bridge %s is linux bridge + ovs. skip!rc
z<switch the bridge has failed. Has restore wait upgrade file.z)upgrade has finished, all bridge success.)
argparse
ArgumentParser
add_argumentr*
parse_argsrJ
WAIT_UPGRADE_FILEr#
argvZ
top_parser
argsr:
ovs_statusZ
vswitch_listZ	is_failedZ
vs_namer.
main
__main__z'/var/log/caslog/util_bridge_upgrade.logz>%(asctime)s %(levelname)7s %(funcName)s:%(lineno)d %(message)sz
%m-%d %H:%M:%S)
levelri
datefmtrj
args: %sz
begin update vswitch engine.z
catch exceptionz+execute end : error code %d, time use %.3fs)
FT)Gr
sysZ	xml.etreer
jsonr
tempfile
shutil
statZ
randomr
uuid
globr
ERROR_CODE_OK_TYPE_NO_CHANGEZ
ERROR_CODE_INVALID_ARGUMENTr
ERROR_CODE_INVALID_BRIDGENAMEr
ERROR_CODE_DEL_SUBNET_ERRORr
Z0ERROR_CODE_ADD_BRIDGE_ERROR_RESTORE_BRIDGE_ERRORZ0ERROR_CODE_ADD_BRIDGE_ERROR_RESTORE_SUBNET_ERRORZ"ERROR_CODE_CUR_MODE_DISABLE_SWITCHr
OTHER_NET_FLAGru
objectr<
log_fileZ
basicConfig
DEBUGr+
start_timer:
timeuse
exitr4
<module>
