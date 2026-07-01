# File: ovs_network_priority.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/openvswitch.package/scripts/ovs_network_priority.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

d d!
d"d#
dHd$d%
d&d'
Z d(d)
Z!d*d+
Z"d,d-
Z#d.d/
Z$d0d1
Z%d2d3
Z&d4d5
Z'd6d7
Z(d8d9
Z)d:d;
Z*e+d<k
e,d=
e.d=
Z-[-n
Z-[-0
0d?e1e
Z3d@Z4e
Z2zVe
j5dAdB
Z6e6j7dCdDdE
Z8e*e8
e&e8
e'e8
e)e8
Z:e:
z$e-j3Z3e1e-
Z-[-nDd
Z-[-0
Z-[-n
Z-[-0
>dFe4e3f
*z"/etc/linux-engine-networks/vswitchz"/etc/linux-engine-networks/subnetsz
/etc/cvk/nic_speed.conf
NetworkPriorityExceptionc
super
	Exception
__init__
retcode)
self
messager
	__class__
5./openvswitch.package/scripts/ovs_network_priority.pyr
z!NetworkPriorityException.__init__)
__name__
__module__
__qualname__r
__classcell__r
rrt	
shell
stdin
stderr
stdoutr
Failed to execute cmd: %s :%s)
isinstance
split
subprocess
Popen
PIPEZ
communicate
decode
returncode
logging
error
strip)
cmdr
input_Z
cmd2
executeCommand.
Nz7ip -o link show up | sed 's#^[0-9]*: \([^ ]*\): .*#\1#'r
/sys/class/net/%sz
/devices/platformz
/devices/pci)
path
islink
readlink)
nicr
<listcomp>F
z!getActiveNics.<locals>.<listcomp>)
ActiveNicsr)
splitlinesr
getActiveNicsB
&ip -br link show %s | awk '{print $1}'
	real_namer
isActiveNicI
Nz>ovs-vsctl -t 2 --verbose=db_ctl_base:syslog:off list-ifaces %sr
spi-
ziovs-vsctl --format=table --columns=name --no-heading --data=bare find interface other_config:origin_br=%sz
ovs-vsctl --format=table --columns=name,other_config --no-heading --data=bare list Interface %s | grep 'tos=' | cut -d' ' -f1 | wc -l
 Tr7
startswith
append
joinr&
int)
bridge
ifaces
ifaceZ
vnet_cntr
_is_tos_referredP
NzYtest -e /sys/class/net/%s/master/bonding && basename $(realpath /sys/class/net/%s/master)Tr7
z>ovs-vsctl -t 2 --verbose=db_ctl_base:syslog:off iface-to-br %sF)
getLinuxEngineNetByNicrE
bondr
needTCd
	d	|
/sys/class/net/%s/speed
rz*failed to get speed for nic %s from sysfs.l
existsr)
openrA
readr$
	exception)
ethx
speedr0
getNicLinkSpeeds
Nz# the nic and speed from system: %s.)
debugr
nicToSpeedrM
getNicSpeedFromSystem
z,invalid nic information in config file: '%s')
ETH_SPEED_CONFIG_FILErJ
isdigitrA
warning
close)
fileZ
ethInfos
ethInfor
getNicSpeedFromConfig
items)
configuredNicSpeedrZ
getAllNicSpeed
Nz" write the config to file: %s = %s)
writeNicSpeedToConfig)
ethrN
updateOneNicSpeedInConfig
%s %s
writerX
valuer
Nz4configure the nic(%s) priopity queue with speed(%s).)
info
tcConfigureNicPriorityQueuerA
refreshrd
configureNicPriorityQueue
%s/*
.oldz$cat %s | grep ^uplinks= | grep -w %sTr7
glob
LINUX_NETWORK_PATH
endswithr)
basename)
netcfg_filesrO
retr
z$cat %s | grep ^vswitch= | grep -w %sTr7
LINUX_SUBNET_PATHrn
namerp
isLinuxEngineNetHasSubnet
isNicQoSConfigureForLinuxEngine
)	NT
zJovs-vsctl -t 2 --verbose=db_ctl_base:syslog:off iface-to-br %s 2>/dev/nullr7
z;ovs-vsctl -t 2 --if-exists get Bridge %s other_config:speedF)
isNicQosConfigured
Nz"tc class show dev %s classid 1:100Tr7
 ceil z
bit r
000000
000i@B
replacer
using_speedr
isNicPriorityConfigured
@zC execute tc command: speed=%s, burst=%s, low=%s, normal=%s, high=%sz%nic %s is already configured speed %s
tc qdisc del dev 
 rootz
tc qdisc add dev z
 root handle 1: htb default 11z
tc class add dev z" parent 1: classid 1:100 htb rate z
Mbit ceil z
Mbit burst Z
Kbitz$ parent 1:100 classid 1:11 htb rate z
Kbit  quantum 1500z$ parent 1:100 classid 1:12 htb rate z
Kbit quantum 1500z$ parent 1:100 classid 1:13 htb rate z& parent 1:11 handle 111: sfq perturb 5z& parent 1:12 handle 112: sfq perturb 5z& parent 1:13 handle 113: sfq perturb 5z
tc filter add dev zJ parent 1: protocol all prio 1 u32 match ip tos 0x00 0xff at 1 flowid 1:11zJ parent 1: protocol all prio 1 u32 match ip tos 0x20 0xff at 1 flowid 1:12zJ parent 1: protocol all prio 1 u32 match ip tos 0x40 0xff at 1 flowid 1:13)
LOWRATIOZ
NORMALRATIOZ	HIGHRATIOZ
burstZ
lowZ
normalZ
highr
Nz1 ====== begin to set the speed of %s to %s ======z2nic %s is already configured by script ovs_subnet.z" invalid speed: %s,please check...Tz[ %s will configure speed same with link %s, configuration of this interface is stripped off
'not need any tc, del all tc rules of %sr}
z$ %s is not support network priority.)
nic_nameZ	nic_speedrx
ERR_CODE_NIC_CONFIGUREDrV
ERR_CODE_SPEED_UNKNOWNr9
ERR_CODE_UNSUPPORT_IFACE)
argsrM
_set)
z'registerSetSpeedCMDParser.<locals>._set
--nic_nameT
nic name
required
helpz
--nic_speedz	nic speed
func
add_parser
add_argument
set_defaults)
moduleParsersr
parse_speed_setr
registerSetSpeedCMDParser(
)	Nc
z+ ====== begin to get the speed of %s ======z&get the speed from config file: %s=%s.z!get the speed from system: %s=%s.z4 %s is not support network priority or speed unkown.)	r
printr
_getF
z'registerGetSpeedCMDParser.<locals>._get
getr
parse_speed_getr
registerGetSpeedCMDParserE
ovs-vsctl -t 3 list-ifaces %sr
%s/%sz
cat %s | grep ^uplinks=
extend)
netcfgZ
uplinksr
getActiveUplinkOfBridge]
Nz$ ====== begin to validate  %s ======z5bridge %s is already configured by script ovs_subnet.Tz!ip link show %s | grep -w altnamer
has_speed_limitZ
netToSpeedrD
altnamer
	_validatel
z,registerValidateCMDParser.<locals>._validateZ
validatez
--bridgez
vswitch name)
--ifacez
iface namer
parse_speed_validater
registerValidateCMDParserk
Nz  ====== begin to restore  ======)
_restore
z*registerRestoreCMDParser.<locals>._restoreZ
bootr
parse_speed_bootr
registerRestoreCMDParser
__main__Z
ovs_network_priorityzKFailed to import cas_log_init2 from util_cvk_log, use cas_log_init instead.z$execute ovs_network_priority cmd: %srw
Process ovs network priority.)
descriptionz
sub-commandz!Process sub-module configuration.)
titler
 %s(retcode:%d))
sysr+
	tracebackr
argparserl
util_cvk_logrm
ERR_CODE_OKZ
ERR_CODE_INVALIDARGSr
ERR_CODE_UNKNOWNr
cas_log_init2
cas_log_initrW
argvr
exceptionMessage
ArgumentParserZ	topParser
add_subparsersr
parse_argsr
format_excr%
exitr
<module>
