# File: ovs_portmirror.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/openvswitch.package/scripts/ovs_portmirror.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

z(e!
"d e j#
$e j#
Z [ nBd
Z [ 0
z e!
Z [ n
Z [ 0
*z"/etc/net-agent/flows/bridge-mirrorz+/etc/net-agent/flows/bridge-mirror/flows.%s
BrMirrorExceptionc
superr
__init__
retcode)
self
messager
	__class__
/./openvswitch.package/scripts/ovs_portmirror.pyr
BrMirrorException.__init__)
__name__
__module__
__qualname__r
__classcell__r
error
warn
info
debug)
loggingZ
ERRORZ
WARN
INFO
DEBUGZ	getLoggerZ
setLevel)
levelZ
levelMapr
setLogLevel
bufsize
shell
stderr
stdoutr
Failed to execute cmd: %s.
decode)
	<genexpr>4
z!executeCommand.<locals>.<genexpr>
z'Successful to execute cmd: %s result:%s)
subprocess
Popen
PIPE
wait
returncode
	Exceptionr)
	readlines
join
stripr!
cmdZ
fast
resultr
executeCommand'
Nz3ovs-vsctl --column=_uuid --bare find mirror name=%sz5ovs-vsctl --bare --column=mirrors find bridge name=%sr*
bridgeName
mirrorName
uuidZ
uuidsr
getMirrorUUID9
rpt	
stdinr(
Failed to execute cmd: %s :%sz
 < %s r*
z#Successful to execute cmd: %s %s:%s)
communicate
isinstance
bytes
encoder+
input_r;
in_r
cmd_executeB
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
d?d@
dBdCdD
dFdGdH
dIdJdH
dFdGdH
dIdJdH
dPdQ
dRdSdTdU
dVdSt
dWdX
dZdSt
d[dX
d\dSd]dU
dBd`dD
dadSdbdU
dRdSdcdU
dadSdbdU
dRdSdedU
|	dK
dadSdbdU
dfdSdgdU
dhdSdWdU
dVdSdidU
dRdSdcdU
dPdQ
)lNc
Nz/ovs-vsctl --column=_uuid --bare find port %s=%s
name
z3fail to get the uuid of the port "%s", uuid = "%s".)
lenr6
Z	args_portrB
getPortUUIDN
z#registerMirror.<locals>.getPortUUIDc
Nz%ovs-vsctl --if-exists get port %s tag
port
vlanr
get_port_vlanV
z%registerMirror.<locals>.get_port_vlanc
Nz-ovs-vsctl --if-exists get Interface %s ofportr?
get_ofport_num]
z&registerMirror.<locals>.get_ofport_numc
Nz0ovs-vsctl -t 2 --if-exists get port %s bond_moderM
get_port_bond_mode`
z*registerMirror.<locals>.get_port_bond_modec
Nz?ovs-vsctl --verbose=db_ctl_base:syslog:off -t 2 iface-to-br %s r?
get_br_for_portc
z'registerMirror.<locals>.get_br_for_portc
Nz0ovs-vsctl --column=_uuid --bare find port tag=%s)
split
get_port_list_for_vlanf
z.registerMirror.<locals>.get_port_list_for_vlanc
Nzeovs-vsctl -t 2 --bare -- --id=@uuid get Interface %s -- --columns=name find Port Interfaces{\>=}@uuidr?
ifacer
iface_to_porti
z%registerMirror.<locals>.iface_to_portFc
ovs-vsctl -t 5 list-ifaces %sz
/sys/class/net/z
../../devices/platformz
../../devices/pciZ
pci_r
z.The number of physical network cards is wrong!)
path
exists
readlink
startswith
appendrK
ERROR_CODE_ETH_PORT_NUM_WRONG)
br_nameZ
is_allZ
uplink_ports
ifacesrX
get_bridge_uplink_portl
z.registerMirror.<locals>.get_bridge_uplink_portc
Nz&ovs-vsctl --if-exists get Mirror %s %sr?
mirror_uuid
keyr
get_mirror_config_value~
z/registerMirror.<locals>.get_mirror_config_valueTc
Covs-vsctl --columns=_uuid --bare find mirror external_ids:src_br=%sz
Bridge mirror is not exist!)
"ERROR_CODE_BRIDGE_MIRROR_NOT_EXIST)
is_raisere
get_bridge_mirror_uuid
z.registerMirror.<locals>.get_bridge_mirror_uuidc
Nz+ovs-vsctl --if-exists get Bridge %s mirrorsr
external_ids:dst_br
lstrip
rstriprU
br_list
mirrorsre
mirror_dst_br
check_bridge_mirror_exist
z1registerMirror.<locals>.check_bridge_mirror_existc
	ovs-vsctl
	br-existsr
Bridge "%s" is not exist.)
ERROR_CODE_BRIDGE_NOT_EXIST)
ovs_namer
check_br_exist
z&registerMirror.<locals>.check_br_existc
zCovs-vsctl --columns=_uuid --bare find mirror external_ids:dst_br=%szLBridge %s is in other bridge mirror, delete the bridge mirror and try again!)
ERROR_CODE_BRIDGE_BE_USED)
src_mirror_uuidZ
dst_mirror_uuidr
check_br_used
z%registerMirror.<locals>.check_br_usedc
check_bridge_validity
z-registerMirror.<locals>.check_bridge_validityc
Vlan id can't be None!r
Vlan id %d is error!z
Vlan %s is not a integer!)
isdigit
intr
ERROR_CODE_VLAN_ILLEGALrV
check_one_vlan_validity
zLregisterMirror.<locals>.check_vlan_validity.<locals>.check_one_vlan_validity
multi_vlansr
vlansrO
check_vlan_validity
z+registerMirror.<locals>.check_vlan_validityc
ip addr show %sr0
inet z:Local port in bridge %s is configured with the IP address!z
inet6 z
inet6 fe80::)
ERROR_CODE_LOCAL_PORT_CONFIG_IP)
infosr
check_localport_ip
z*registerMirror.<locals>.check_localport_ipc
vnetz'There are virtual machines in bridge %sz9ovs-vsctl --if-exists get interface %s external_ids:vm-id)
ERROR_CODE_VM_EXIST_IN_DST_BR)
vm_idr
check_vm_exist
z&registerMirror.<locals>.check_vm_existc
.new
cookie=0x9528)
openr7
write
shutil
move)
flows_fileZ
new_file
liner
clear_mirror_flows
z*registerMirror.<locals>.clear_mirror_flowsc
bridgerN
bridge_mirror
select_src_port
select_dst_port
	port_uuid)
_del_br_mirrorrL
get_mirror_select_portsr
remove_bridge_mirror_port
z1registerMirror.<locals>.remove_bridge_mirror_portc
r<t	d
r`t	d
n"t	d
falser*
inbound
outboundr
zHinput args for configure bridge is not excepted: "%s", check code: "%d".
truerh
Port %s has been added to the bridge port mirror. If you add the destination port of the port mirror again, this scenario is meaningless.z
ovs-vsctl -t 5 set mirror %s \
                   select-src-port=%s \
                   select-dst-port=%s \
                   select-vlan=%s \
                   select-all=%s  \
                   output-port=%s \
                   output-vlan=%s TaB
ovs-vsctl -t 5 -- add Bridge %s mirrors @m \
                    -- --id=@m create Mirror name=%s \
                   select-src-port=%s \
                   select-dst-port=%s \
                   select-vlan=%s \
                   select-all=%s  \
                   output-port=%s \
                   output-vlan=%s )
src_vlanZ
out_port
out_vlan
src_port
	directionr6
warning
ERROR_CODE_MIRROR_CONFLICT)
args
mirrorUUIDZ
output_portZ
output_vlan
select_vlanr
select_allrN
validCheckr
bridge_mirror_uuidZ
tmp_select_src_portZ
tmp_select_dst_port)
_set
registerMirror.<locals>._setc
Nz*ovs-vsctl -t 5 remove Bridge %s mirrors %sT)
_del_mirror/
z#registerMirror.<locals>._del_mirrorc
ovs-vsctl list-brr*
z6ovs-vsctl -t 5 --bare --columns=mirrors list bridge %sz<ovs-vsctl -t 5 --if-exists get Mirror %s external_ids:src_brro
external_ids:vlanmapz<ovs-vsctl -t 5 --if-exists get Mirror %s external_ids:dst_brT
perv
ovs-vsctl -t 5 \
                                        -- --if-exists remove Bridge %s mirrors %s \
                                        -- --if-exists del-port %s \
                                        -- --if-exists del-port %s \
                                        -- --if-exists set Bridge %s fail_mode=[]
'ovs-ofctl del-flows %s cookie=0x9528/-1z
 -- remove Bridge %s mirrors %sz
ovs-vsctl -t 5 )	r>
flows_file_name_patternr[
isfile
remove)
bridgesZ
clearCmdr}
mirror
src_brZ
bridge_mirror_need_clear
vlanmap
dst_br
to_port
in_portZ
dst_br_existZ
uplinkr
_clear4
registerMirror.<locals>._clearc
select_src_ports
select_dst_portsrt
z/registerMirror.<locals>.get_mirror_select_portsc
vlanmap_str
item
vlan1
vlan2rt
get_mirror_vlanmapl
z*registerMirror.<locals>.get_mirror_vlanmapc
%s:%s,r
external_ids:vlanmap=%s)
list
itemsr9
vlanmap_specr
get_vlanmap_specv
z(registerMirror.<locals>.get_vlanmap_specc
t	|	d
active-backupz8ovs-appctl -T 5 bond/show %s | grep 'active member mac:'
active_port:%s,uplinks:%sz
active_port:%sz0bundle(eth_src,0,active_backup,ofport,slaves:%s)r
z&bundle(eth_src,0,hrw,ofport,slaves:%s)z	ovs-ofctlz
--timeout=5z
OpenFlow13z
--bundlez	add-flows
ziadd cookie=0x9528,in_port=%s,priority=40003,vlan_tci=0x1000/0x1000,actions=strip_vlan,mod_vlan_vid:%s,%s
zRadd cookie=0x9528,in_port=%s,priority=40002,vlan_tci=0,actions=mod_vlan_vid:%s,%s
z7add cookie=0x9528,in_port=%s,priority=40001,actions=%s
z/add cookie=0x9528,priority=40000, actions=drop
zladd cookie=0x9528,in_port=%s,priority=40001,dl_vlan=%s actions=pop_vlan,push_vlan:0x8100,set_vlan_vid:%s,%s
z:add cookie=0x9528,in_port=%s,priority=40000, actions=drop
del cookie=0x9528/-1
insertr8
isdir
flows_path
makedirsr
uplinksZ	bond_portZ	bond_modeZ
out_specZ
active_portr:
flowsr
file)
set_bridge_mirror_flows
z/registerMirror.<locals>.set_bridge_mirror_flowsc
Nz	mirror_%s)
mirror_namer
remove_port_mirror
z*registerMirror.<locals>.remove_port_mirrorc
)%NZ
mirror_
external_ids:out_vlanro
zLBridge %s is currently a bridge mirror, cannot configure bridge port mirror.zLBridge %s is currently a bridge port mirror, cannot configure bridge mirror.z
select-vlanz
output-portr
Port %s has been added to the destination port of the port mirror. If you add the bridge port mirror again, this scenario is meaningless.r*
)select_src_port=[%s] select_dst_port=[%s]r
select_vlan=%s select_all=%s
1ovs-vsctl --no-heading --columns=tag list port %s
external_ids:out_vlan=%sr
ovs-vsctl -t 5 set mirror %s \
                            %s \
                            output-port=%s \
                            external_ids:src_br=%s \
                            external_ids:dst_br=%s \
                            external_ids:mirror_type=%s \
                            %sTzAovs-vsctl -t 5 --if-exists remove mirror %s external_ids out_vlanz/ovs-vsctl -t 5 set Bridge %s fail_mode='secure'aD
ovs-vsctl -- --if-exists del-port %s \
                        -- --if-exists del-port %s \
                        -- add-port %s %s \
                        -- set interface %s type=patch options:peer=%s \
                        -- add-port %s %s \
                        -- set interface %s type=patch options:peer=%s ak
ovs-vsctl -- add Bridge %s mirrors @m \
                            -- --id=@%s get Port %s \
                            -- --id=@m create Mirror name=%s %s output-port=@%s \
                            external_ids:src_br=%s external_ids:dst_br=%s external_ids:mirror_type=%s %s \
                            -- set Interface %s other_config:used_by_mirror=true)
setr
unionr>
keys
pop)
port_mirror_nameZ
port_mirror_uuidZ
port_select_vlanZ
port_output
src_specr
	port_list
	vlan_listZ
vlan_setZ
vlan_keyr
mirror_type)
_set_br_mirror
z&registerMirror.<locals>._set_br_mirrorc
NFz<Can't find %s bridge mirror, but proceed to let front to delzIBridge %s is currently a bridge mirror, cannot delete bridge port mirror.zIBridge %s is currently a bridge port mirror, cannot delete bridge mirror.rn
z:Bridge port mirror of port %s is not exist, cannot delete.r
z"ovs-vsctl -t 5 set mirror %s %s %sTad
ovs-vsctl -t 5                             -- --if-exists remove Bridge %s mirrors %s                             -- --if-exists remove Interface %s other_config used_by_mirror                             -- --if-exists del-port %s                             -- --if-exists del-port %s                             -- --if-exists set Bridge %s fail_mode=[]r
'ERROR_CODE_BRIDGE_PORT_MIRROR_NOT_EXISTr
z&registerMirror.<locals>._del_br_mirrorc
hasattrrC
_del
registerMirror.<locals>._delc
}	|	r
inoutboundr
z+Bridge port mirror of port %s is not exist.r
vlanmaps)
print
json
dumps)
_query_br_mirror
z(registerMirror.<locals>._query_br_mirrorr
Z	operationz
netflow suppoted operations)
dest
help
delr@
z.the name of bridge where mirror is configured.)
the name of mirror)
funcr
source port configurez
--direction)
bothz'the direction of source port to monitor
choicesr
--src_port
the source port to monitor)
nargsr
--out_vlanz
encapsulate with the vlan id)
typer
destination port configurez
--src_vlanz
the vlan to monitorz
--out_portz
the destination port of mirror
clearr
z*netflow supported bridge mirror operationsz
--src_brz2the name of source bridge where mirror is shifted.z(specify source port in the source bridge
queryz)specify source port in the source bridge.z
--dst_brz7the name of destination bridge where mirror is shifted.z
--select_vlanz
specify dst vlan)
add_parser
add_subparsers
add_argument
set_defaults
add_argument_groupr
moduleParsersrW
mirrorSubparsersZ
parser_mirror_delZ
parser_mirror_setZ
parser_mirror_set1Z
parser_mirror_set2Z
parser_mirror_clearZ
br_mirror_subparsersZ
parser_br_mirror_delZ
parser_br_mirror_queryZ
parser_br_mirror_setr
registerMirrorM
Process ovs configuration.)
descriptionz
--loglevelr
z	log levelr
sub-commandz!Process sub-module configuration.)
titler
Script Execute: r
argparse
ArgumentParserr
parse_argsr%
loglevelr!
argvr
Z	topParserr
main
__main__Z
ovs_portmirrorz
 exception code:%dr*
N)%r1
stringr[
util_cvk_logr
ERROR_CODE_INVALID_ARGUMENTrx
cas_log_init2Z
cas_log_init
test
	exceptionr
exitr
<module>
