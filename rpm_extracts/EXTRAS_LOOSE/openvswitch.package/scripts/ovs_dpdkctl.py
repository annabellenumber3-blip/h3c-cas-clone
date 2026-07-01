# File: ovs_dpdkctl.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/openvswitch.package/scripts/ovs_dpdkctl.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

l	Z	d
Z%d=d
Z&d>d
Z'd!d"
Z(d#d$
Z)d%d&
Z*d'd(
d)d*
d*e,
d+d,
d,e,
d-d.
Z/d/d0
Z0d1d2
Z1e2d3k
d4l3m4Z4
e4d5
Z5d6Z6e
Z7z:e8e
;d8d9
e1e:
Z>[>n
Z>[>0
@d;e5e6f
Bd<e5eA
TODO
getz	dump-portz
updown-portz
/sys/devices/system/cpu/onlinez
/proc/mountsz
/proc/cpuinfoz
/proc/cmdline)
GenuineIntelZ
HygonGenuineZ
AuthenticAMD
shell
stderr
stdoutZ	close_fdsr
z'sucess to execute: %s, out: %s, err: %sz1failed to execute: %s, out: %s, err: %s, code: %sz
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
,./openvswitch.package/scripts/ovs_dpdkctl.py
command_output1
execute_commandB
{0}{0}{0}{0}:{0}{0}:{0}{0}.{0}$z
[0-9A-Fa-f]r
format
match)
patternr*
is_validate_pci_bdfF
open
read)
pathZ
content
	read_fileK
osr7
isfile
remove)
remove_fileR
NFT)
fcntlZ
flockZ
LOCK_EXZ
LOCK_NB)
filepath
mode
locked
fdr*
_try_lock_fileZ
OVSDPDKOption)
	dpdk-initz
dpdk-hupgepage-dirz
vhost-sock-dirz
dpdk-alloc-mem
dpdk-socket-mem
dpdk-lcore-mask
pmd-cpu-mask
dpdk-extrac
superrF
__init__
	KEY_INDEX
_slots
self
	__class__r*
OVSDPDKOption.__init__c
value
idxr*
	set_valueo
OVSDPDKOption.set_valuec
	get_valuev
OVSDPDKOption.get_valuec
REMOVE_MAGIC_VALUE
unset_valuez
OVSDPDKOption.unset_valuec
%s : %s,)
	enumeraterP
KEYS)
__repr__}
OVSDPDKOption.__repr__)
__name__
__module__
__qualname__
objectr\
dict
list
rangerN
__classcell__r*
DPDKOVSConfigureToolc
)	rL
_current_option
_new_option
_current_dpdk_extra
_cur_whitelist
_new_whitelistrQ
DPDKOVSConfigureTool.__init__c
zAovs-vsctl -t 2 -f json --columns=other_config list Open_vSwitch .Tz0failed to get Open_vSwitch:other_config from ovsr
datar
--allow
json
loadsrm
iterr
next
StopIterationrq
current_extra
itr*
fetch
DPDKOVSConfigureTool.fetchc
Tz$/sys/bus/node/devices/node%s/cpulist
0xrU
intr9
hex)
dpdk_socket_memZ
index_findZ
socket_memZ
numa_indexZ
cpulistZ
min_cpu
dpdk_lcore_maskr*
_get_dpdk_lcore_mask
z)DPDKOVSConfigureTool._get_dpdk_lcore_maskc
z)-- set Open_vSwitch . other_config:%s=%s z)-- remove Open_vSwitch . other_config %s )
_get_ovsdb_dpdk_cmd
z(DPDKOVSConfigureTool._get_ovsdb_dpdk_cmdFc
}	|	
-a r*
.0r(
<listcomp>
z/DPDKOVSConfigureTool.commit.<locals>.<listcomp>rK
"%s"z
ovs-vsctl --no-wait z
 -- comment configure dpdkz
 -- comment rollback  dpdkz
which systemctl
z%systemctl restart openvswitch.servicez&invoke-rc.d openvswitch-switch restartz8pre-commit to ovsdb, new_cmd: %s, restart:%s, old_cmd:%sz
ovs restart log: 
 ====
%srs
ovs restart log: 
 ===
%sz*failed restart ovs with %s, rollback to %s)
sortro
join
ERROR_CODE_OKr,
infor.
time
sleep
_is_ovs_vswitchd_runing
ERROR_CODE_OVS_RESTART_FAILr
no_restartZ
need_ovs_restartZ
new_cmdZ
old_cmdr|
Z	new_value
	old_valueZ
dpdk_extra_changeZ	whitelistZ
dpdk_extrar{
restart_cmdr*
commit
DPDKOVSConfigureTool.commitc
rhz0t
Nz%/var/run/openvswitch/ovs-vswitchd.pidFz
-commandz
/proc/%s/commz
ovs-vswitchdTz
except when read file %sz3ovs-vswitchd running status: %s, pid:%s, command:%s)
	exceptionr
OVS_VSWITCHD_PIDFILEr{
pidZ
commandr*
z,DPDKOVSConfigureTool._is_ovs_vswitchd_runingc
DPDKOVSConfigureTool.set_valuec
z DPDKOVSConfigureTool.unset_valuec
pci_bdfr*
del_pci_whitelist
z&DPDKOVSConfigureTool.del_pci_whitelistc
add_pci_whitelist
z&DPDKOVSConfigureTool.add_pci_whitelist)
d d!
d"d#
d$d%
d&d'
d(d)
d*d+
DPDKConfigurec
set_cmd_lockrl
ovs_confr
DPDKConfigure.__init__c
Process dpdk configuration.)
description
_cmdz
dpdk operations)
dest
helpz
--dpdk-init
true
falsez
true or false)
choicesr
--dpdk-socket-memz4N MB hugepage memory per numa, for example:1024,2048)
--pmd-cpu-maskz0hex number mask without 0x prefix, to mask lcorez
--no-restart
store_truez#configure ovsdb and not restart ovs)
actionr
--statZ
downTz	port stat)
requiredr
ports
dpdk port list)
nargsr
argparse
ArgumentParser
add_subparsers
add_parser
CTL_CMD_TYPE_DPDK_SET
add_argument
CTL_CMD_TYPE_DPDK_GET
CTL_CMD_TYPE_DPDK_DUMP
CTL_CMD_TYPE_UPDOWN_PORT
parse_args)
argvZ
top_parserZ
sub_parsersZ
sub_parserr*
parser_arguments,
DPDKConfigure.parser_argumentsc
z4pmd_cpu_mask '%s' is out of range, system max cpu=%sz>exception when parser cpu data, pmd_cpu_mask='%s', last_cpu=%s)
SYS_ONLINE_CPU_FLIEr
 ERROR_CODE_CPU_MASK_OUT_OF_RANGEr
ERROR_CODE_INVALID_ARGUMENT)
pmd_cpu_maskr{
last_cpuZ
int_pmd_cpu_maskr*
_check_pmd_cpu_maskC
z!DPDKConfigure._check_pmd_cpu_maskc
}	|	D
isdigit
z9DPDKConfigure._check_socket_mem_valid.<locals>.<listcomp>
z3dpdk_socket_mem can not be %s if dpdk-init is true.
'/sys/devices/system/node/node*/numastatr
zaovs-vsctl -t 5 --format=table --column=options --no-headings --data=bare find interface type=dpdkTzHdpdk-devargs=([0-9a-fA-F]{4}:[0-9a-fA-F]{2}:[0-9a-fA-F]{2}\.[0-9a-fA-F])z
/sys/bus/pci/devices/%s
	numa_nodec
MEM_USE_PER_DPDK_IFACEr
zAdpdk-socket-mem: %s, is less than used by ovs vhostuser port: %s.)
anyr 
globr.
splitlinesr0
search
groupr;
isdirr
)ERROR_CODE_NUMA_MEM_INSUFFICENT_FOR_IFACE)
old_dpdk_init
	dpdk_initr
dpdk_socket_mem_listZ
numa_node_numZ
iface_in_numa_listr$
iface_options
optionr1
pci_addressZ
pci_dirZ
pci_numa_filer
numa_node_strZ
mem_request_in_numa
_check_socket_mem_validS
z%DPDKConfigure._check_socket_mem_validc
z0dpdk-socket-mem '%s' has more %d nodes in system)
!ERROR_CODE_NUMA_NODE_OUT_OF_RANGE)
numa_numr*
_check_socket_mem_numberx
z&DPDKConfigure._check_socket_mem_numberc
z=DPDKConfigure._check_socket_mem_free_size.<locals>.<listcomp>r
z2exception when parser mem data, dpdk_socket_mem=%srG
zFexception when parser using mem data, dpdk_socket_mem=%s, using_mem=%sc
request mem from system: %s MBzE/sys/devices/system/node/node*/hugepages/hugepages-*kB/free_hugepagesr
zM/sys/devices/system/node/node(\d+)/hugepages/hugepages-(\d+)kB/free_hugepagesrs
z'unexcepted node free_hugepages path: %szUdpdk-socket-mem '%s' is not able to alloc memory on node %d, who has only %d MB free.)
allr
setdefaultr"
%ERROR_CODE_HUGEPAGE_MEMORY_NOT_ENOUGH)
request_mem_listZ
usingZ	using_memZ
using_mem_listrY
memZ
node_to_free_memr8
free_numr1
node_idZ	page_sizer*
_check_socket_mem_free_size
z)DPDKConfigure._check_socket_mem_free_sizec
qzqX|
z,ovs-appctl --timeout 2 show-internal-versionTzHFailed to get ovs internal version, because ovs-vswitchd is not running.z#Failed to get ovs internal version.z
feature-dpdk
1z0Ovs internal version is: %s, do not support dpdk)
ERROR_CODE_OVS_NOT_SUPPORTr
startswithr
)	rR
feature_dpdkr$
cmd_outputr'
lines
liner*
_check_ovs_dpdk_support
z%DPDKConfigure._check_ovs_dpdk_supportc
Nzipython /opt/bin/get-sysinfo.pyc | grep -w cpu_model_name | grep -q 'Kunpeng\|FT2500\|FT2000plus\|FT5000C'Tr
Z	vendor_idr
flagsz+System cpu type is: %s, do not support dpdk)
PROC_CPUINFOr9
DPDK_CPU_SUPPORT_LISTr 
ERROR_CODE_CPU_NOT_SUPPORT)
cpu_vendoridZ
cpu_flag_listr
_check_cpu_dpdk_support
z%DPDKConfigure._check_cpu_dpdk_supportc
)	Nr
zBFailed to import util_kernel_cmdline, skip hugepage support check.Z
hugepageszz-dmidecode | grep -q 'Kunpeng\|FT-2000\|S2500'Tr
zNFailed to turn on dpdk, beacase hugepage is off in /proc/cmdline or grub file.)	r
util_kernel_cmdliner 
getProcCmdlineZ
KernelCmdLineZ
get_cmdliner,
ERROR_CODE_HUGEPAGE_OFF)	rR
kernel_cmdlineZ
cmdlineZ
grubliner&
_check_hugepage_support
z%DPDKConfigure._check_hugepage_supportc
zEovs-vsctl -t 2 --bare --columns=name find bridge datapath_type=netdevTz5Failed to turn off dpdk, because dpdk is used by ovs.)
ERROR_CODE_DPDK_USED)
bridger*
_check_dpdk_used
DPDKConfigure._check_dpdk_usedc
Z	hugetlbfsz
Hugepage has not been mounted.)
PROC_MOUNTSr9
ERROR_CODE_HUGEPAGE_UNMOUNT)
_check_hugetlbfs_mount
z$DPDKConfigure._check_hugetlbfs_mountNc
check_dpdk_rte_requirement
z(DPDKConfigure.check_dpdk_rte_requirementc
z#checking dpdk change, from %s to %s)
check_input_dpdk_parameter 
z(DPDKConfigure.check_input_dpdk_parameterc
/run/ovs_dpdkctl_set_cmd.lockT
wz'failed to require set cmd lock on fd %s)
Z	LOCK_FILErC
try_lock_set_cmdF
DPDKConfigure.try_lock_set_cmdc
/run/ovs_bridge.lockTr4
Need to wait OVS LOCK release.)
OVS_LOCK_FILErC
ovs_bridge_lock_fdr*
check_lock_ovs_bridgeO
z#DPDKConfigure.check_lock_ovs_bridgec
0000:00:00.0r
ERROR_CODE_DUPLICATE_SET_CMDr
 ERROR_CODE_WAIT_OVS_LOCK_RELEASEr
cmd_dpdk_setZ
DPDKConfigure.cmd_dpdk_setc
%s : %sz
dpdk-min-socket-memr
print
MEM_USE_PER_DPDK_NUMA)
keysr|
cmd_dpdk_get~
DPDKConfigure.cmd_dpdk_getc
 ovs-appctl netdev-dpdk/port-dump)
_dump_dpdk_port
DPDKConfigure._dump_dpdk_portc
cmd_dump_dpdk_port
z DPDKConfigure.cmd_dump_dpdk_portc
/sys/class/net/%sz
ip link set dev %s %sz
ovs-vsctl -t 2 iface-to-br %sz ovs-ofctl -t 2 mod-port %s %s %sz
updown port %s: %sz"failed to updown, %s is not a port)
existsr.
warning)
port
statr
updown_one_port
DPDKConfigure.updown_one_portc
cmd_updown_port
DPDKConfigure.cmd_updown_port)
ignore signal: %d, %s)
signal_numberZ
stack_framer*
signal_handle
signal
SIGHUPr
cmd_funcr{
_main
__main__)
cas_log_init2Z
dpdkctlr
execute start: argument: %srt
catch exceptionz
error code: %d, messge: %s;z+execute end : error code %d, time use %.3fs)
FF)D
__doc__r;
sysr
ERROR_CODE_UNKNOWNr
PROC_CMDLINEr
util_cvk_logr
errorMessageZ
cmdStartTimerN
timeuser!
exitr*
<module>
