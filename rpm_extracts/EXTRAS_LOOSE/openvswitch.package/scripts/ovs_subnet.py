# File: ovs_subnet.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/openvswitch.package/scripts/ovs_subnet.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

l	Z	d
Z0d Z1d!Z2d"Z3d#Z4d$Z5d%Z6d&Z7d'Z8d(Z9d)Z:d
Z;d*Z<d+Z=d,Z>d-Z?d.Z@d/ZAd0ZBd
ZDd1ZEd2ZFd3ZGd4ZHd_d7d8
ZId`d9d:
ZJd;d<
ZKd=d>
ZLd?d@
ZMdAdB
ZNdCdD
ZOdEdF
ZPdGdH
ZQdIdJ
ZRdadKdL
dMdN
dNeT
dOdP
dPeT
dQdR
dReT
dSdT
dTeT
dUdV
dVeT
ZYdWdX
ZZdYdZ
Z[e\d[k
e]d\
e^d\
Z`ed
Zc[cn
Zc[c0
Zfed
gd^e`ef
ElementTree)
randint
0x3e8i
1500Z
0xffffffffz
/etc/cvk/nic_speed.confz"/etc/net-agent/flows/bridge-subnet
/etc/net-agent/subnet-acc
z"/etc/linux-engine-networks/vswitchz"/etc/linux-engine-networks/subnetsz(/etc/linux-engine-networks/.wait_upgradeTFc
shell
stderr
stdoutZ	close_fdsr
success to execute: %sz1failed to execute: %s, out: %s, err: %s, code: %sz
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
cmdr)
raise_exception
code
+./openvswitch.package/scripts/ovs_subnet.py
command_output_
execute_commandp
NTF)
	ipaddress
ip_interface
ipr?
is_valid_ipv4s
is_valid_ipv6z
isdigit
int)
vlanr?
is_valid_vlan}
network)
ip1Z
ip2Z
net1Z
net2r?
is_same_network
with_prefixlenrG
get_ip_cidr
with_netmaskrG
get_ip_netmask
]<}	g
r:|	
request
	operation
vswitch
name
speed
subnet
port
bandwidth_ratiorN
network_type
NonerH
mask
%s/%s
ipv6
maskIpv6z!failed to resolve the xml request)
fromstring
ERROR_CODE_OK
ERROR_CODE_INVALID_XML_PARM
find
textr-
findall
appendrQ
	exception)
Z	xmlStringrS
replyrV
root
resrT
subnet_listrX
Z	subnet_vsrH
netmask
ipv4r_
netmask6
handleXMLRequest
error to open file: %s)
open
readr5
path
content
	read_file
Failed to write file: %s %s)
tempfile
mkstemp
fdopen
write
shutil
movers
warning)
filenamerv
saferm
temp_filenamerw
write_file
FlowManagec
flows.%s)
_vswitchr|
join
	FLOW_PATH
	_flowfile
_flows_dict)
selfrT
__init__
FlowManage.__init__c
existsr
makedirs
mkdir_flowfile_path
FlowManage.mkdir_flowfile_pathc
replace file %s with %s)
listr
itemsr|
info)
tempfilename
contents
valuerw
save_flow_file
FlowManage.save_flow_filec
remove flow file: %s)
isfiler
remover5
del_flow_file
FlowManage.del_flow_filec
ovs-ofctl add-flows %s %sT
z!Failed to set subnet flow for %s.)
ERROR_CODE_SET_FLOW_ERROR
set_vswitch_flows
FlowManage.set_vswitch_flowsN)
__name__
__module__
__qualname__r
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
VswitchConfigureToolc
VswitchConfigureTool.__init__c
uuidr
setc
	val_to_py)
<listcomp>
z2VswitchConfigureTool.val_to_py.<locals>.<listcomp>
mapc
<dictcomp>
z2VswitchConfigureTool.val_to_py.<locals>.<dictcomp>)
lenr-
valr?
VswitchConfigureTool.val_to_pyc
ovs-vsctl -t 2 br-exists %sTr
is_vswitch_exists
z&VswitchConfigureTool.is_vswitch_existsc
%s_bondr
hashlibZ
encodeZ	hexdigest)
br_namerU
md5_val
tmp_namer?
get_bond_port_name
z'VswitchConfigureTool.get_bond_port_namec
}	t	|	
/proc/net/bonding/z
ls /proc/net/bonding/Tz
/proc/net/bonding/ not exist!Z
_bondr
/proc/net/bonding/%sz
ovs-vsctl -t 2 list-ports %srU
bridgez /sys/class/net/%s/bonding/slavesz
/sys/class/net/%s/bonding/mode
slaves
modez
linux_bond: %s)
splitlinesr5
linux_bonds
linux_bondZ
linux_bonds_cmdZ
linux_hond_init_nameZ
linux_bond_nameZ
vswitch_ports_cmdZ
vswitch_portsZ
slaves_filer
Z	mode_filer
get_vswitch_linux_bond_info&
z0VswitchConfigureTool.get_vswitch_linux_bond_infoc
ovs-vsctl -t 2 list-ifaces %sT
/sys/class/net/%sz
/devices/platformz
/devices/pciz
%s/device/physfnr
readlinkri
sort)	r
iface_listr9
vswitch_iface_list
ifaceZ
iface_pathZ
linux_bond_slavesr?
get_vswitch_uplink_ifaceG
z-VswitchConfigureTool.get_vswitch_uplink_ifacec
cat %s | grep ^uplinks=T
	%s/%s.old)	r
LINUX_NETWORK_PATHrD
extend)
uplinksZ
old_uplinksZ
vs_cfg
conZ
old_vs_cfgr?
get_linux_network_uplink_iface[
z3VswitchConfigureTool.get_linux_network_uplink_ifacec
cat %s/%s | grep ^vlan=Tr
get_linux_network_vlano
z+VswitchConfigureTool.get_linux_network_vlanc
cat %s/%s | grep ^linux_bridge=Tr
linux_bridger
get_linux_bridgew
z%VswitchConfigureTool.get_linux_bridgec
]R}	|	
}	|	
r>|	
rf|	
%s/*z
.oldz
cat %s | grep ^master=Tz
cat %s | grep ^vswitch=z!bad subnet cfg %s, missing masterr
dict
glob
LINUX_SUBNET_PATH
endswithr
startswithr-
subnetsrV
subnet_files
file
masterrX
linerU
get_old_linux_subnets
z*VswitchConfigureTool.get_old_linux_subnetsc
NzQovs-vsctl -t 2 --bare --columns=name find Int type=internal other_config:subnet=1T
replacer.
intersection)
	port_listr9
subnet_iface_listr
get_vswitch_subnet_port
z,VswitchConfigureTool.get_vswitch_subnet_portc
Nz<ovs-vsctl --if-exists get Bridge %s other_config:accele_modeT
get_vswitch_accele_mode
z,VswitchConfigureTool.get_vswitch_accele_modec
}	|	d
d	}	|
NzAovs-vsctl --format json --columns=name,other_config,tag list portT
dataZ
headingsrU
zAovs-vsctl --format json --columns=name,mtu_request list interface
mtu_request
json
loadsr
zipr
json_resultZ
result_dict
itemZ	item_dict
tmp_dictr
Z	port_namer?
get_ovs_port_info
z&VswitchConfigureTool.get_ovs_port_infoc
other_configrc
<lambda>
z@VswitchConfigureTool.get_vswitch_subnet_config.<locals>.<lambda>)
get_bandwidth_ratio
get_port_vlan
sorted)
ovs_ports_info
subnet_port_listZ
subnet_config_listrX
	port_infoZ
subnet_configr?
get_vswitch_subnet_config
z.VswitchConfigureTool.get_vswitch_subnet_configc
total_bandwidth_ratiorX
get_remainder_bandwidth_ratio
z2VswitchConfigureTool.get_remainder_bandwidth_ratioc
configrZ
z(VswitchConfigureTool.get_bandwidth_ratioc
	qos_queue
get_qos_queue
z"VswitchConfigureTool.get_qos_queuec
vlan_tagr?
z"VswitchConfigureTool.get_port_vlanc
Nz;ovs-vsctl -t 2 --if-exists get Bridge %s other_config:speedTz
get_vswitch_speed
z&VswitchConfigureTool.get_vswitch_speedc
t	t	|
}	|	S
)	Nr
/sys/class/net/%s/speed
&ip -br link show %s | awk '{print $1}'r
get_nic_speed_configr
SPEED_UNKNOWNr-
brg_nameZ
uplink_ifacesrV
	nic_speedr
Z	cmd_speed
speed_fileZ
file_speedZ	speed_strr?
get_if_speed
z!VswitchConfigureTool.get_if_speedc
}	n"d	|
tc class show dev %sT)
parentr
ceil
ratez
 %s r
bit 
GZ	000000000
000000
000)
using_speed_dictr
iface_dictr9
tc_classr
class_dict
class_id
flagZ
flag_strZ
band_width_strZ
band_widthr?
get_tc_using_speed_dict
z,VswitchConfigureTool.get_tc_using_speed_dictc
speed_dictr
get_tc_using_speed8
z'VswitchConfigureTool.get_tc_using_speedc
z+invalid nic infomation in config file: '%s'z
file: %s is not exists.)
ETH_SPEED_CONFIG_FILErs
Z	eth_infosr
eth_infor?
z)VswitchConfigureTool.get_nic_speed_configc
%s %s
write_nic_speed_to_configR
z.VswitchConfigureTool.write_nic_speed_to_configc
range)	r
old_subnet
port_change
bandwidth_changeZ
subnet_length
oldr?
is_subnet_changeW
z%VswitchConfigureTool.is_subnet_changec
}	|	|
z6VswitchConfigureTool.is_mtu_change.<locals>.<listcomp>T)
DEFAULT_MTU_REQUEST)
vswitch_info
vswitch_mtur
subnet_mtur?
is_mtu_changeh
z"VswitchConfigureTool.is_mtu_changec
statica
<request>
            <operatorType>set</operatorType>
            <callType>internal</callType>
            <entity name="{}">
                <method4>{}</method4>
                <method6>{}</method6>
                <ipv4>{}</ipv4>
                <gateway4></gateway4>
                <route4/>
                <ipv6>{}</ipv6>
                <gateway6></gateway6>
                <route6/>
            </entity>
        </request>z'python /opt/bin/netcfgtool.pyc xml '%s')
formatrA
ERROR_CODE_APPLY_NET_CONFIGrd
method4Z
method6Z
reqr9
set_subnet_net_config}
z*VswitchConfigureTool.set_subnet_net_configc
NzCpython /opt/bin/netcfgtool.pyc delete --name=%s --callType=internalr
ERROR_CODE_DEL_NET_CONFIGrd
delete_subnet_net_config
z-VswitchConfigureTool.delete_subnet_net_configN)
ConfFuncc
set_vswitch_subnet_port
set_qos
set_vswitch_flow
clear_vswitch_flow
post_update
operation_validate_subnetr
ConfFunc.__init__N)
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
Z d=d>
Z!d?d@
Z"dAdB
Z#dCdD
Z$dEdF
Z%dGdH
Z&dIdJ
Z'dKdL
Z(dMdN
Z)dOdP
Z*dQdR
Z+dSdT
Z,dUdV
Z-dWdX
Z.dYdZ
Z/d[d\
Z0d]S
VswitchConfigurec
_&t'
(d	|
z?ovs-vsctl --if-exists get Bridge %s other_config:subnet_uplinksr
,z!using conf_method: %s linkstr: %s)/r
vs_toolr
_speedr
_old_speed
_subnetr
_ovs_ports_infor
_linux_bondr
_uplink_ifacer-
_cftr
CFTCr.
set_vswitch_tcr/
get_vswitch_subnet_config_ac
CFAC
set_vswitch_subnet_port_ac
set_qos_ac
set_vswitch_flow_ac
clear_vswitch_flow_ac
post_update_ac
operation_validate_subnet_acrA
_old_uplinks
_detect_conf_methodZ	cf_methodr5
_old_subnet
_org_xml
_run_subnet
_subnet_ex
_pfinfos)
xmlZ
linkstrr?
VswitchConfigure.__init__c
z<VswitchConfigure.apply_subnet_net_config.<locals>.<listcomp>c
)	r:
differencer7
new_subnets
old_subnets
del_subnetsrX
retr?
apply_subnet_net_config
z(VswitchConfigure.apply_subnet_net_configc
normalZ
smartz
<request>
  <operationType>get</operationType>
  <iterator>sys_class_net</iterator>
  <select>
    <isPhysicalSmartNIC>1</isPhysicalSmartNIC>
  </select>
  <data>
    <name/>
  </data>
</request>
z+python3 /opt/bin/device_config.pyc --xml %sr
z8while get smartnic list exception, check your enviroment
entityrU
exitrd
accele_modeZ
subnetportsr9
pf_listZ
entr?
z$VswitchConfigure._detect_conf_methodc
rbt	|
zOtry to collect old subnet port info from file, also populate current run_subnet
	%s/%s.xmlz
xmlfile: %s not exist!r(
z%/sys/class/net/%s/device/sriov_numvfsz
sriov_file: %s not exist!zOgrep -m 1 RateGroup /sys/class/net/%s/device/sriov/%s/config | awk '{print $3}'T
used_by_subnet
used_by_vdpa
SUBNET_ACC_PATHr
keysr
xmlfileZ	xmlstringZ
operrm
merge_uplinksZ
postfixZ
name_counterrY
pf_run_subnetra
sriov_fileZ	sriov_numr
vfobr?
z-VswitchConfigure.get_vswitch_subnet_config_acc
Nz2python3 /opt/bin/ovs_smartnic.pyc lsvdpa --verboser
vfrQ
vfport
repport
pcir&
/var/run/vdpar_
pfinfosrV
linesr]
tokensrg
_get_pf_infosF
VswitchConfigure._get_pf_infosc
_get_repport`
VswitchConfigure._get_repportc
repnamera
_get_vfporth
VswitchConfigure._get_vfportc
/sys/class/net/eth%sz
eth%sr
_get_unused_ethp
z VswitchConfigure._get_unused_ethc
 -- set int %s mtu_request=%sz
ip link set dev %s mtu %sz
ovs-vsctl -t 5T)
mtu_strrX
_sync_subnet_mtu_acx
z$VswitchConfigure._sync_subnet_mtu_acc
Nz-/sys/class/net/%s/device/infiniband/*/ports/*r
can't get ibdev for %s)
realpathr.
vfname
pathsru
arrr?
_get_ib_dev
VswitchConfigure._get_ib_devc
}	|	t	|
rtq^|
d#d$
 d-t
rbd1}
$d2d3
t	t&|
't&|
qpd5}
+d6|
):z(allocate vf (mac, pci) and add it to ovszKovs-vsctl -t 2 --if-exists get Bridge %s other_config:bond_mode 2>/dev/nullTr
z too less vfs, check srio_vnum %sra
z2not possible for interleave used by vdpa or subnetz
vfob is null, exit 2 nowrh
z!ifdown %s || ip l set dev %s downr
ip l set dev %s name tmp_%sz
ip l set dev %s name %sz
ip l set dev tmp_%s name %sz
ifup %sFz
ip l set dev %s uprj
ovs-vsctl -- --if-exists del-port %s -- add-port %s %s -- set interface %s other_config:used_by_subnet=1 other_config:network_type=%sri
ovs-vsctl set Port %s tag=[]z
ovs-vsctl set Port %s tag=%sz&/sys/class/net/%s/device/sriov/%s/noder`
00:00:00:00:00:00:00:00
uuid_r?
z?VswitchConfigure.set_vswitch_subnet_port_ac.<locals>.<listcomp>
z%/sys/bus/pci/drivers/mlx5_core/unbindrk
z#/sys/bus/pci/drivers/mlx5_core/bindz
udevadm settle --timeout=4z=ls -la /sys/class/net/ | grep '%s' | awk -F '/' '{print $NF}'z
ip l set dev %s downz
ifup %s || ip l set dev %s upz
/opt/bin/roce_pfc.shz
/opt/bin/roce_pfc.sh %szBovs-vsctl -t 2 --if-exists set Bridge %s other_config:bond_mode=%sr\
zKovs-vsctl -t 2 --bare --columns=name find Int other_config:used_by_subnet=1r
^eth[0-9]*$z
ip a f dev %sz
 -- --if-exists del-port %s %sz
ovs-vsctl %s)/rp
ERROR_CODE_NO_FREE_SMARTCARD_VFrA
uuid1
hexr
access
X_OKr7
matchrs
uplink_changerl
old_bm_cmdZ
old_bmZ	bm_changerX
vfobjrh
foundr
old_itemZ
gid_changeZ
id8Z
now_nameZ
bm_cmdr
subnet_repr
cmdstrZ
unused_ethr?
z+VswitchConfigure.set_vswitch_subnet_port_acc
z)sync conf to sysfs, realise rate mechnismr
z'/sys/class/net/%s/device/sriov/%s/groupr
NFTz(/sys/class/net/%s/device/sriov/groups/%sz$data is not consistent, create groupi
zOgrep MinRate /sys/class/net/%s/device/sriov/groups/%s/config | awk '{print $3}'z4/sys/class/net/%s/device/sriov/groups/%s/min_tx_rater
z3/sys/class/net/%s/device/sriov/groups/0/min_tx_rate)
START_VF_GROUPr
LOWRATIO
NORMALRATIO
	HIGHRATIOrd
pf_re
snobrg
groupidr
runvfobr]
robZ
rpfZ
create_grouprV
Z	cur_speed
remainder_bandwidth_ratio
low_bandwidth
	bandwidthr?
VswitchConfigure.set_qos_acc
z$VswitchConfigure.set_vswitch_flow_acc
z&VswitchConfigure.clear_vswitch_flow_acc
subnet_acc_filer?
VswitchConfigure.post_update_acc
Bridge %s does not exist.r[
z-VswitchConfigure.operation_validate_subnet_acc
VswitchConfigure.post_updatec
z*VswitchConfigure.get_vswitch_subnet_configc
vswitch is required.r
z@No physical iface exists in vswitch %s, or %s is a dpdk vswitch.)	rd
ERROR_CODE_INVALID_VSWITCHr7
ERROR_CODE_NO_PHYSICAL_IFACE
need_check_uplinkrm
check_vswitch_validu
z$VswitchConfigure.check_vswitch_validc
speed: %s error.
ERROR_CODE_INVALID_SPEED
_check_speed_valid
z#VswitchConfigure._check_speed_validc
:length of port: %s is %d, which can not be larger than 15.r
Jbandwidth_ratio of internal port: %s is %d,  which must range in [0, 100).r
Mvlan id of internal port: %s is %s, which must be a number or less than 4094.z8total_bandwidth_ratio: %d, is greater or equal than 100.)
ERROR_CODE_INVALID_PORT
ERROR_CODE_INVALID_BANDWIDTHrL
ERROR_CODE_INVALID_VLAN)
_check_subnet_valid
z$VswitchConfigure._check_subnet_validc
check_config_valid
z#VswitchConfigure.check_config_validc
Nz#ovs-ofctl del-flows %s cookie=%s/-1Tr
Failed to clear flow for %s.)
COOKIErA
ERROR_CODE_CLEAR_FLOW_ERRORr
z#VswitchConfigure.clear_vswitch_flowc
NzVovs-vsctl -t 2 --format=table --no-headings --data=bare --column=qos find Port qos!=[]TzPovs-vsctl -t 2 --format=table --data=bare --no-headings --columns=_uuid list qosr(
z3ovs-vsctl -t 2 --if-exists --bare get qos %s queuesz
 -- --if-exists destroy qos %sz
 -- --if-exists destroy queuer
ovs-vsctl -t 2z
Failed to clear unused qos.)
port_qos_listZ
qos_uuid_listZ
del_qos_listZ
del_qos_cmdZ
qos_uuidZ
queues_uuid_listZ
queuesr4
_clear_unused_qos
z"VswitchConfigure._clear_unused_qosc
tc qdisc del dev %s rootTr
Failed to clear tc for %s.)
clear_tc_cmdr4
_clear_tc_config
z!VswitchConfigure._clear_tc_configc
clear_vswitch_qos
z"VswitchConfigure.clear_vswitch_qosc
)	Nc
z6VswitchConfigure.set_vswitch_speed.<locals>.<listcomp>r
z>ovs-vsctl -t 2 --if-exists remove Bridge %s other_config speedz>ovs-vsctl -t 2 --if-exists set bridge %s other_config:speed=%sTr
Failed to set speed for %s.)	rd
ERROR_CODE_SET_SPEED_ERROR)
new_port_listZ
set_speed_cmdr4
set_vswitch_speed
z"VswitchConfigure.set_vswitch_speedc
)	Nc
z9VswitchConfigure._get_subnet_port_cmd.<locals>.<listcomp>c
 -- --if-exists remove interface %s other_config subnet -- --if-exists remove port %s other_config bandwidth_ratio -- --if-exists remove port %s other_config qos_queuez
 -- --if-exists del-port %sz4 -- add-port %s %s -- set interface %s type=internalz* -- set interface %s other_config:subnet=1)
old_port_list
port_to_del_listZ
port_del_cmdZ
clear_subnet_cmdrY
port_to_add_listZ
port_add_cmdZ
set_subnet_cmdr9
_get_subnet_port_cmd
z%VswitchConfigure._get_subnet_port_cmdc
 -- set port %s tag=[]z
 -- set port %s tag=%d)
set_vlan_cmdrX
_get_subnet_vlan_cmd
z%VswitchConfigure._get_subnet_vlan_cmdc
z# -- set interface %s mtu_request=%sr
set_mtu_cmdrX
_get_subnet_mtu_cmd'
z$VswitchConfigure._get_subnet_mtu_cmdc
z, -- set port %s other_config:network_type=%sr
set_network_type_cmdrX
_get_subnet_network_type_cmd5
z-VswitchConfigure._get_subnet_network_type_cmdc
}	|	r
z!Failed to set subnet port for %s.)
ERROR_CODE_SET_SUBNET_ERROR)
set_port_cmdr
z(VswitchConfigure.set_vswitch_subnet_portc
tc z	 add dev z
; r?
tc_descriptorr
cmd_listr9
tc_cmdZ
tc_tmp_cmdr?
_get_tc_cmdW
VswitchConfigure._get_tc_cmdc
	d	|
 root handle 1: htb default 11
T parent 1:1 classid 1:1 htb rate %dKbit ceil %dKbit burst %dKb cburst %db quantum %d
V parent 1:1 classid 1:100 htb rate %dKbit ceil %dKbit burst %dKb cburst %db quantum %d
W parent 1:100 classid 1:11 htb rate %dKbit ceil %dKbit burst %dKb cburst %db quantum %d
W parent 1:100 classid 1:12 htb rate %dKbit ceil %dKbit burst %dKb cburst %db quantum %d
W parent 1:100 classid 1:13 htb rate %dKbit ceil %dKbit burst %dKb cburst %db quantum %d
& parent 1:11 handle 111: sfq perturb 5
& parent 1:12 handle 112: sfq perturb 5
& parent 1:13 handle 113: sfq perturb 5zJ parent 1: protocol all prio 1 u32 match ip tos 0x00 0xff at 1 flowid 1:11zJ parent 1: protocol all prio 1 u32 match ip tos 0x20 0xff at 1 flowid 1:12zJ parent 1: protocol all prio 1 u32 match ip tos 0x40 0xff at 1 flowid 1:13
qdiscTr
!Failed to execute tc command: %s.
class
filter)
ERROR_CODE_SET_TC_ERROR)
max_bandwidthr
middle_bandwidth
high_bandwidth
burst
cburst
quantum
tc_root_qisc_cmd
tc_class_cmd_list
tc_qisc_cmd_list
tc_filter_cmd_listr
_set_vswitch_tos_tc_queue^
z*VswitchConfigure._set_vswitch_tos_tc_queuec
W parent 1:1 classid 1:fffe htb rate %dKbit ceil %dKbit burst %dKb cburst %db quantum %dr
X parent 1:fffe classid 1:%d htb rate %dKbit ceil %dKbit burst %dKb cburst %db quantum %dzX -- set port %s other_config:bandwidth_ratio=%d -- set port %s other_config:qos_queue=%dr
z9Failed to set other_config for subnet port in vswitch %s.r
ERROR_CODE_SET_QOS_ERRORr=
queue_indexZ
set_subnet_qos_cmdr
subnet_tc_class_cmd_listr
set_subnet_config_cmdr4
_set_vswitch_subnet_tc_queue
z-VswitchConfigure._set_vswitch_subnet_tc_queuec
VswitchConfigure.set_vswitch_tcc
}	|	rXd
|	d	
z5VswitchConfigure.set_vswitch_flow.<locals>.<listcomp>c
z=ovs-vsctl -t 2 --if-exists get port %s other_config:qos_queueTr
0x%sr
zHcookie=%s, table=%s, priority=%s,in_port=%s actions=set_queue:%s,NORMAL
set flow: %s for port %s)
FLOW_TABLE
PRIORITYr5
flow_manager
subnet_portrY
Z	flow_liner?
z!VswitchConfigure.set_vswitch_flowc
z<VswitchConfigure.update_nic_speed_config.<locals>.<listcomp>rW
Gdel speed conf of %s when all subnet ports of vswitch has been deleted.
" write the config to file: %s = %s)
nic_conf_speedr
link_speedr?
update_nic_speed_config
z(VswitchConfigure.update_nic_speed_configc
NTFz6ovs-vsctl set Bridge %s other_config:subnet_uplinks=%sr6
speed_changer
operation_set_subnet
z%VswitchConfigure.operation_set_subnetc
rZqB|
ip -br -%s addr show %sr
fe80r
ipv4: %s, ipv6: %s)
verr9
ip_listrH
get_subnet_ip&
VswitchConfigure.get_subnet_ipc
catch exception)
Element
SubElementr
tostringr2
printrd
ERROR_CODE_GET_QOS_ERROR)
subnet_xmlrY
ratiorN
ip4Z
ip6rH
get_qos_xml<
VswitchConfigure.get_qos_xmlc
operation_get_subnet_
z%VswitchConfigure.operation_get_subnetc
1:100r
1:fffec
z>VswitchConfigure.check_subnet_qos_vaildity.<locals>.<listcomp>r
1:%sr
using_speedr
classidr?
check_subnet_qos_vaildityc
z*VswitchConfigure.check_subnet_qos_vaildityc
z0Failed to set MTU for subnet port of vswitch %s.)
ERROR_CODE_SET_MTU_ERROR)
check_subnet_mtu_vaildity
z*VswitchConfigure.check_subnet_mtu_vaildityc
z=qos of vswitch: %s has been changed, need to be reconfigured.)
subnet_qos_vaildityr?
z*VswitchConfigure.operation_validate_subnetc
fallback_subnet
z VswitchConfigure.fallback_subnetN)1r
d!d"
d#d$
d%d&
d'd(
d)d*
d5d,d-
d.d/
d0d1
d2d3
LinuxNetworkConfigurec
z4init new speed: %s, new subnets: %s, new uplinks: %sz4init old speed: %s, old subnets: %s, old uplinks: %s)
_get_subnets_dict
_subnetsr
_subnets_vlanr
_linux_bridger
_old_subnetsr
_uplinksrH
_vswitch_vlan
_is_update_qos
_subnets_total_bandwidth_ratio
_get_subnet_routes
_subnet_routesr5
LinuxNetworkConfigure.__init__c
attrr?
z'LinuxNetworkConfigure._get_subnets_dictc
add_subnetsZ
mod_subnetsrU
z-LinuxNetworkConfigure.apply_subnet_net_configc
/sys/class/net/%s/bridgez
Linux Bridge %s does not exist.z&No physical iface exists in vswitch %s)
z)LinuxNetworkConfigure.check_vswitch_validc
z(LinuxNetworkConfigure._check_speed_validc
invalid ipv4 %s for subnet %sr_
invalid ipv6 %s for subnet %sz@subnets_total_bandwidth_ratio: %d, is greater or equal than 100.)
valuesr
ERROR_CODE_INVALID_IPV4rK
ERROR_CODE_INVALID_IPV6r
z)LinuxNetworkConfigure._check_subnet_validc
&_get_old_subnets_total_bandwidth_ratio4
z<LinuxNetworkConfigure._get_old_subnets_total_bandwidth_ratioc
rVqFt
r^|	r^|
q^qFq
NzP'<request><operatorType>get</operatorType><entity name="%s"></entity></request>'z&python3 /opt/bin/netcfgtool.pyc xml %srX
route4
route6
dstr(
viaz
subnet routes: %s)
attribr
routesrU
xml_argsrk
elementZ
subElemr
router?
z(LinuxNetworkConfigure._get_subnet_routesc
updater
copy
deepcopyrc
pop)
subnets_new
subnets_mod
subnets_delrT
_subnets_partitionQ
z(LinuxNetworkConfigure._subnets_partitionc
z(LinuxNetworkConfigure.check_config_validc
name=%s
master=%s
vswitch=%s
z	speed=%s
network_type=%s
vlan=%s
bandwidth_ratio=%s
ipv4=%s
ipv6=%s
write subnet cfg file %s failed)
ERROR_CODE_WRITE_CFG_ERRORrd
cfg_fileZ
conf_to_writer?
_write_subnet_cfgy
z'LinuxNetworkConfigure._write_subnet_cfgc
%s.%sr
_get_vlan_port_name
z)LinuxNetworkConfigure._get_vlan_port_namec
z+ip link add link %s name %s type vlan id %sr
z&add vlan iface %s failed for subnet %srU
ip link set dev %s upro
ip addr add %s brd + dev %sz add ipv4 %s failed for subnet %sr_
ip addr add %s dev %sz add ipv6 %s failed for subnet %s)
ERROR_CODE_ADD_VLAN_IFACE_ERRORrd
ip_iface
vlan_ifacerV
_add_subnet_port
z&LinuxNetworkConfigure._add_subnet_portc
t	d	|
t	d	|
t	d	|
t	d	|
ip link del dev %sr
z&del vlan iface %s failed for subnet %srU
ip addr del %s dev %sr_
vlan_iface %s not exist)
ERROR_CODE_DEL_VLAN_IFACE_ERRORr
_del_subnet_port
z&LinuxNetworkConfigure._del_subnet_portc
bash /opt/bin/roce_pfc.sh %srU
_new_subnet
z!LinuxNetworkConfigure._new_subnetc
z-subnet %s have routes, not allowd change vlanTro
z1subnet %s have route4: %s, not allowd change ipv4r#
z1subnet %s have route6: %s, not allowd change ipv6r
ERROR_CODE_ROUTE_CONFLICTr%
_mod_subnet
z!LinuxNetworkConfigure._mod_subnetc
_del_subnet
z!LinuxNetworkConfigure._del_subnetc
sTt	d
Z	real_namer	
z-LinuxNetworkConfigure.update_nic_speed_configc
z!LinuxNetworkConfigure._get_tc_cmdc
tc filter del dev %s)
_clear_tc_filter_rules@
z,LinuxNetworkConfigure._clear_tc_filter_rulesc
)&NrW
zJ parent 1: protocol all prio 2 u32 match ip tos 0x00 0xff at 1 flowid 1:11zJ parent 1: protocol all prio 2 u32 match ip tos 0x20 0xff at 1 flowid 1:12zJ parent 1: protocol all prio 2 u32 match ip tos 0x40 0xff at 1 flowid 1:13r
z% parent 1:%d handle %d: sfq perturb 5ro
z> parent 1: protocol all prio 1 u32 match ip src %s flowid 1:%dr_
z? parent 1: protocol all prio 1 u32 match ip6 src %s flowid 1:%dr
z9Failed to clear tc for %s, maybe tc rules already clearedr
remain_bandwidthZ
subnet_bandwidthr
default_subnet_classidr
_set_qos_tcE
z!LinuxNetworkConfigure._set_qos_tcFc
}	|	t
r`|	
}	|	t
}	|	t
}	|	t
r |	S
NFTz1subnets_new: %s, subnets_mod: %s, subnets_del: %sr^
fallbackZ
subnets_num_changer
subcfg_filer?
z*LinuxNetworkConfigure.operation_set_subnetc
Nz"reset qos tc for %s subnets failed)
z/LinuxNetworkConfigure.operation_validate_subnetc
z*LinuxNetworkConfigure.operation_get_subnetc
)	r9
z%LinuxNetworkConfigure.fallback_subnetN)
is_linux_network
r|t	|
Set subnet and qos for vswitch.)
descriptionz
--xmlz
subnet config of vswitch.)
helpz
Script Execute: r
"%s"r?
main.<locals>.<listcomp>rT
handle linux subnetsr
z9can't do %s, need wait upgrading to linux bridge finishedFr
z6Failed to set subnet for vswitch %s, need to fallback.Z
validatez
unknown args.)
argparse
ArgumentParser
add_argumentr5
parse_argsrd
WAIT_UPGRADE_FILEr7
ERROR_CODE_UPGRADE_NOT_FINISHEDr
ERROR_CODE_INVALID_ARGUMENT)
argvZ
top_parser
argsrm
vsr?
main
__main__Z
ovs_subnetr
z+execute end : error code %d, time use %.3fs)
F)ir3
Z	xml.etreer
util_cvk_logr
timerz
statZ
randomr
ERROR_CODE_UNKNOWNr}
ERROR_CODE_CLEAR_QOS_ERRORZ
ERROR_CODE_CLEAR_TC_ERRORr
ERROR_CODE_ADD_IPV4_ERRORZ
ERROR_CODE_ADD_IPV6_ERRORZ
ERROR_CODE_DEL_IPV4_ERRORZ
ERROR_CODE_DEL_IPV6_ERRORr
RDMA_TOSr
objectr
cas_log_init2Z
cas_log_initZ
start_timerm
timeuser6
<module>
