# File: ovs_util.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/openvswitch.package/scripts/ovs_util.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

cElementTreez
.*link/ether (.*?) z
.*MAC (.*?), z
.*attached-mac="(.*?)", z
.*port (.*?): (.*?)(\s.*|$)z
/sys/bus/pci/devicesz
/sys/class/net
new|trkz
est|trkz
inv|trkc
d d!
d#d$
d%d&
d'd(
d)d*
d+d,
d-d.
d/d0
d1d2
d3d4
Utilityc
superr
__init__
self
	__class__
)./openvswitch.package/scripts/ovs_util.pyr
Utility.__init__c
failed to read file: %s)
path
exists
open
read
	Exception
logging
	exception)
Z	file_path
content
	read_file'
Utility.read_fileFc
rlt	
shell
stderr
stdoutZ	close_fdsr
z1failed to execute: %s, out: %s, err: %s, code: %s)
isinstance
split
subprocess
Popen
PIPEZ
communicate
decode
returncoder
error)
cmdr
raise_exception
coder
command_output2
Utility.command_outputc
execute_command>
Utility.execute_commandc
get_host_iplink_macs
get_macs_from_vms
get_host_net_namespaces
get_net_namespace_port_mac)
host_iplink_macs
host_vm_macsZ
host_net_namespace_macs
net_namespaces
net_namespaceZ	host_macsr
get_host_macsB
Utility.get_host_macsc
q q d
ip linkZ
etherr
MACz
00:00:00:00:00:00)	r
strip
splitlinesr5
IPLINK_MAC_PATTERN
findall
VF_MAC_PATTERN)
linesr8
lineZ
link_macZ
vf_macr
Utility.get_host_iplink_macsc
ip netns list
Utility.get_host_net_namespacesc
ip netns exec %s ip link)
z"Utility.get_net_namespace_port_macc
ovs-vsctl -t 2 list-brrE
bridgesr
get_ovs_bridge_listm
Utility.get_ovs_bridge_listc
=ovs-vsctl -t 2 --bare --if-exists get bridge %s datapath_type
netdev)
append)
dpdk_bridgesrF
bridger+
datapath_typer
get_dpdk_bridgess
Utility.get_dpdk_bridgesc
/etc/libvirt/qemu/*.xml)
globr
_extract_macs_from_vm)
running_xmls
filename
vm_macsr
Utility.get_macs_from_vmsc
)	NZ	domstatus
domainZ
devices
	interface
macZ
addressr
z+exception happens when get macs from vm: %s)
fromstring
findr@
getrA
root
devrT
mac_itemrU
Utility._extract_macs_from_vmc
system)
get_bridge_uplink_port)
host_physical_portsrF
get_host_physical_ports
Utility.get_host_physical_portsc
ovs-vsctl -t 2 list-ifaces %srI
z@ovs-vsctl -t 2 --if-exists get interface %s options:dpdk-devargsr]
devicez
/devices/pciz
/devices/platform)
join
PCI_DEVICE_PATHrJ
NET_DEVICE_PATH
readlink)
bridge_physical_portsr+
iface_listZ
ifaceZ
pciZ
iface_pathr
Utility.get_bridge_uplink_portc
)	Nr
ovs-appctl dpctl/showr
system@r^
netdev@rI
IFACE_OFPORT_PATTERNr@
startswith)	Z
table_type
iface_ofport_tabler+
iface_ofport_raw_linesZ
iface_ofport_raw_lineZ	match_valZ
raw_valZ
iface_ofport_numZ
iface_ofport_namer
get_iface_ofport_table
Utility.get_iface_ofport_tablec
list
itemsrJ
physical_iface_ofport_numsri
system_tableZ
system_itemZ
netdev_tableZ
netdev_itemr
get_physical_iface_ofport_num
z%Utility.get_physical_iface_ofport_numr
the_last_errorr
set_log_lasterr
Utility.set_log_lasterrc
get_lasterr
Utility.get_lasterrc
hashlibZ
updateZ	hexdigest)
calculate_md5
Utility.calculate_md5c
Nz~ovs-vsctl -t 5 --verbose=db_ctl_base:syslog:off --no-heading --format table --column=name,external_ids list interface |grep %sr
getstatusoutputrb
dl_dstZ
out_port_namer+
stsr.
get_out_port_name_by_dl_dst
z#Utility.get_out_port_name_by_dl_dstc
Nz.ovs-appctl --timeout 2 dpctl/show |grep "port z
odp_port
ofp_portr+
get_ofp_port_by_odp_port
z Utility.get_ofp_port_by_odp_portc
 get_portprofile_name_by_ofp_port)
 get_portprofile_name_by_odp_port
z(Utility.get_portprofile_name_by_odp_portc
Nz9ovs-vsctl -t 2 get interface %s external_ids:port-profiler
portprofile_namer
z(Utility.get_portprofile_name_by_ofp_portc
Nz4ovs-vsctl -t 2 get interface %s other_config:bind-ipr
bind_ipr
get_bind_ip_by_odp_port
Utility.get_bind_ip_by_odp_portc
Nz6ovs-vsctl -t 2 get interface %s other_config:bind-ipv6r
Z	bind_ipv6r
get_bind_ipv6_by_odp_port 
z!Utility.get_bind_ipv6_by_odp_port)
__name__
__module__
__qualname__r
staticmethodr
__classcell__r
ValidatyCheckc
ValidatyCheck.__init__c
NTF)
isdigit)
start
endr
	check_int1
ValidatyCheck.check_intc
([0-9a-f]{2}:){6}$
:TF)
match
lower)
	check_mac5
ValidatyCheck.check_macFc
([0-9]{1,3}.){4}$
group
socketZ	inet_aton
is_maskr
check_ip9
ValidatyCheck.check_ipc
Z	inet_ptonZ
AF_INET6r*
check_ipv6H
ValidatyCheck.check_ipv6c
check_nw_protoT
ValidatyCheck.check_nw_protoc
check_icmpX
ValidatyCheck.check_icmpc
check_tp_port]
ValidatyCheck.check_tp_portc
dl_srcZ
dl_src_maskrv
dl_dst_maskr
nw_srcZ
nw_src_maskZ
nw_dstZ
nw_dst_maskr
ipv6_srcZ
ipv6_src_maskZ
ipv6_dstZ
ipv6_dst_maskr
Z	icmp_typeZ
icmp_type_maskZ	icmp_codeZ
icmp_code_maskr
tp_srcZ
tp_src_maskZ
tp_dstZ
tp_dst_mask
argvr
check_matchfieldb
ValidatyCheck.check_matchfieldc
priorityr
matchfieldr
check_flow
ValidatyCheck.check_flowc
Z	flow_portZ	rule_portZ
rule_port_maskr
match_port
ValidatyCheck.match_portc
VFW_DROP_STATE)
flow_ct_stater
match_drop_state
ValidatyCheck.match_drop_stateN)
Z	xml.etreer
compiler?
DPDK_BRIDGE_MAC_PATTERNrf
ERROR_CODE_OKZ
ERROR_CODE_FAILEDZ
ERROR_CODE_INVALID_ARGUMENTZ
ERROR_CODE_NOTEXISTZ
ERROR_CODE_UNKNOWNZ
ERROR_CODE_CONNECT_FAILEDr
objectr
<module>
