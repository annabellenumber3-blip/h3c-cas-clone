# File: util_cvm_ip_config.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/util.package/scripts/util_cvm_ip_config.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

d d!
Z d"d#
Z!d$d%
Z"e#d&k
d'Z$e
j&d(d)e$d*
'd+e(e
Z-[-n
Z-[-0
'd-e+e/
ElementTree)
randint
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
util_cvm_ip_config.py
command_output
execute_command'
strictz
old network segment: z
, new network segment: )
	ipaddress
ip_networkZ
network_addressr
ipaddress_oldZ
ipaddress_newZ
ip_network_oldZ
ip_network_newr#
compare_network_segment*
/opt/bin/ovs_bridge.sh get z+ --linux_bridge | awk -F ' : ' '{print $2}'T
bridge_namer
resr#
get_linux_bridge6
ifdown z
; ifup Tr-
nic_namer
reboot_nic<
path
exists
makedirs)
folder_namer#
check_folder@
BridgeOperatec
/etc/sysconfig/network-scripts/z#/etc/linux-engine-networks/vswitch/z,/etc/linux-engine-networks/tmp_ifcfg_config/z,/etc/linux-engine-networks/tmp_linux_config/z
ifcfg-)
_ifcfg_config_path
_linux_config_path
_backup_ifcfg_config_path
_backup_linux_config_path
_bridge_name
_ipv4address
_netmask
_ipv6address
_prefixlength
_skip_check
_bridge_infor0
_linux_bridge_name
_ifcfg_config_file
_ifcfg_ovs_config_file
_linux_config_file)
selfr.
ipv4address
netmask
ipv6address
prefixlength
skip_checkr#
__init__E
BridgeOperate.__init__c
bridge z< is not linux bridge or not exist. Cannot use script mod ip.z
device z
 not exist!z
mod bridge z
 ip failed.)
ERROR_CODE_INVALID_BRIDGENAME
check_device_exist
ERROR_CODE_DEVICE_NOT_EXISTr6
get_bridge_info
ERROR_CODE_OK
check_network_segment
backup_config
mod_bridge
restore_config
clean_backup_config)
bridge_mod_ip\
BridgeOperate.bridge_mod_ipc
/sys/class/net/TF)
z BridgeOperate.check_device_existc
z(t	
 --uplink --vlan --br_mode --datapath_type --bond_mode --lacp --multicast --mtu --active-algorithm --reselect-on-change --bandwidth --used_by_mirror --used_by_drain --accele_mode --network_type --status --network_engineT
:z*python /opt/bin/netcfgtool.pyc get --name F
route4
route6z
[']r
failed to get bridge info)
replacer
	exceptionr
ERROR_CODE_GET_BRIDGEINFO_ERRORrR
BridgeOperate.get_bridge_infoc
/Fr'
ipv4Tz+ipv4 network segment is inconsistent. old: z
, new: 
ipv6z+ipv6 network segment is inconsistent. old: )
IPv4NetworkZ	prefixlenrA
%ERROR_CODE_IPV4_NETWORK_SEGMENT_ERRORr?
%ERROR_CODE_IPV6_NETWORK_SEGMENT_ERRORrR
ip_netmaskZ
new_ipv4Z
new_ipv6r#
z#BridgeOperate.check_network_segmentc
)	Nz
backup bridge: z	 config: 
*, z
	cp %s* %sTz
cp %s %s)	r
inforC
BridgeOperate.backup_configc
begin restore bridge z
 backup configrr
vlanz
.%sz
end restore bridge z  backup config. restore success.)
warningr<
BridgeOperate.restore_configc
clean bridge z
 backup config: rp
rm %s*T)
z!BridgeOperate.clean_backup_configc
|	d&
|	d&
)2Nr
accele_modez
--accele_mode=%s Z
network_typez
--network_type=%s Z
uplink
%s_bond 
namez
--bond_mode=%s Z	bond_modez
--iface=%s ru
--vlan=%s z
--multicast=%s Z	multicastrl
--address=%s --netmask=%s 
gateway4z
--gateway=%s rm
z#--ipv6address=%s --prefixlength=%s 
gateway6z
--ipv6gateway=%s Z
mtuz	--mtu=%s Z
lacpz
--lacp=%s z
active-algorithmz
--active-algorithm=%s z
reselect-on-changez
--reselect-on-change=%s z /opt/bin/ovs_bridge.sh mod %s %sTZ
requestZ
operatorType
entity
method4
method6r\
set bridge ip xml: %sz'python /opt/bin/netcfgtool.pyc xml '%s'z
faild to mod the bridge.)
lenr)
ElementZ
SubElement
textrz
tostringr
ERROR_CODE_MOD_BRIDGE_ERRORrR
config_lineZ
ifacesZ
iface
addressZ
prefilerI
ipv6_addressZ
ipv6_prefiler
rootZ	operationr{
mtu_netcfgtoolZ
treeZ
replyri
BridgeOperate.mod_bridgeN)
__name__
__module__
__qualname__rM
q*qTq*|
r`d	S
ping6 z$ -c 1 -w 1 1>/dev/null 2>&1; echo $?Z
ipv6adressz
ping Z
ipv4adressr
 exsits.)
address_type
idxr/
check_ping*
The IPv4 address z
 and netmask 
 are valid.
Invalid value: z
 and/or netmask 
 are invalid.FT)
IPv4Interfacer
ValueErrorrc
ipv4_addressrI
check_ipv4_address_vaild@
The IPv6 address z
 and prefix length r
 and/or prefix length r
IPv6Interfacer
prefix_lengthri
check_ipv6_address_vaildL
NzRparemeters error: ipv4address and netmask should be both provided or not provided.zWparemeters error: ipv6address and prefixlength should be both provided or not provided.T)
ERROR_CODE_INVALID_ARGUMENTr
check_paremetersX
Set bridge switch)
descriptionz
--nameZ
vswitch0z
bridge name)
default
type
helpz
--ipv4addressz
new bridge ipv4 address)
z	--netmaskz
bridge ipv4 maskz
--ipv6addressz
bridge ipv6 addressz
--prefixlengthz
bridge ipv6 prefix lengthz
--skip_check
nork
skip network segment check)
choicesr
Script Execute: r
"%s"r#
<listcomp>z
main.<locals>.<listcomp>z
check parameter whether leagal.z
no ip address to be set.z
begin mod %s ip)
argparse
ArgumentParser
add_argumentr
join
parse_argsrH
argvZ
top_parser
argsr/
BOr#
mainq
__main__z&/var/log/caslog/util_cvm_ip_config.logz>%(asctime)s %(levelname)7s %(funcName)s:%(lineno)d %(message)sz
%m-%d %H:%M:%S)
level
formatZ
datefmt
filenamez
args: %sz
catch exceptionz+execute end : error code %d, time use %.3fs)
F)1r
sysZ	xml.etreer
timeZ
randomr
ERROR_CODE_UNKNOWNrP
objectr7
log_fileZ
basicConfig
DEBUGr
start_timer/
timeuse
exitr#
<module>
