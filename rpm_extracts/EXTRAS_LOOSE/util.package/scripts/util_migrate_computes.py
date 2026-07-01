# File: util_migrate_computes.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/util.package/scripts/util_migrate_computes.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

l	Z	d
Z!d!d"
Z"d#d$
Z#d%d&
Z$d'd(
Z%dEd)d*
Z&dFd+d,
Z'd-d.
Z(d/d0
Z)d1d2
Z*d3d4
Z+d5d6
Z,d7d8
Z-dGd9d:
Z.d;d<
Z/d=d>
Z1d?e1
Z2e3dAk
e4dB
minidom)
usage:util_migrate_computes.pyc estimate [vmname] [vswitch] [remote_ip] [remote_vswitch] [-s] port [-d] remote_port util_migrate_computes.pyc check vmname remote_ip)
descriptionZ
estimatez
Estimated migration time)
help
vmnamez
the name of vm
vswitchz&the vswitch used for migrate in source
	remote_ipz
the ip of the dest
remote_vswitchz$the vswitch used for migrate in destz
migration subnet in source)
nargsr
migration subnet in dest)
function
checkz.Check if the virtual machine supports postcopy)
argparse
ArgumentParser
add_subparsers
add_parser
add_argument
set_defaults
migrate_caculate
get_check_results
parse_argsr
parserZ	subparserZ
parser_estimateZ
parser_check
args
util_migrate_computes.py
get_input_parse+
NzW<migrate-info><postcopySupport>%d</postcopySupport><checkno>%d</checkno></migrate-info>r#
support
checkno
xml_infor#
create_check_xmlH
<migrate-info><precopy>{0}</precopy><postcopy>{1}</postcopy><srcspeed>{2}</srcspeed><dstspeed>{3}</dstspeed><postcopySupport>{4}</postcopySupport><checkno>{5}</checkno></migrate-info>)
format)
precopy
postcopyZ
srcspeedZ
dstspeedr&
create_estimate_xmlN
n*t	|
Failed to get vswitch paramentsZ	bond_modeZ
ifacesr
z+failed to parse vswitch info from json (%s))
json
loads
logging
error
exit
_ERROR
list
keys
	Exception)
retStr
fileZ
bondZ
eths
parse_network_jsonV
qNq"W
rootz
/etc/cvk/user_info.conf
permit_user_sshr
path
exists
open
	readlines
split
strip)
user
line
paramsr#
get_ssh_usern
shell
stderr
stdoutr
Failed to execute cmd: %s: %sz!Successful to execute cmd: %s: %s)
subprocess
Popen
PIPEZ
communicate
returncoder0
debug
decode)
cmdstr
execute_cmd|
qemu:///system
/Failed to get connect to libvirtd, Exception:%s
,Failed to get dumpxml of vm %s, Exception:%s)
libvirtrD
libvirtErrorr0
strr2
lookupByNameZ
XMLDesc
close)
vmName
connr=
domZ
xmlstrr#
get_vm_dumpxml
stater`
get_vm_state
}	|	d	k
qRqrqRq
NFr;
disk
typer
cacheZ
writethroughZ	writebackTz;Failed to obtain vm %s disk cache information, Exception:%s)
getElementsByTagNameZ
attributesr6
name
value
childNodes
nodeNamer8
xmlNodera
multiCacheZ
diskformZ	diskTypesZ
diskType
attrZ	diskNodesZ
diskNodeZ	diskcacher=
check_vm_disk_cache
NFZ	interfacerg
Z	vhostuserTz3Failed to obtain vm %s interface type, Exception:%s)
getAttributer8
	vhostUserZ
interfaceTypesZ
interfaceTyper=
check_vm_interface_vhostuser
memoryBacking
lockedTZ	hugepagesz8Failed to obtain vm %s memory backend info, Exception:%s)
)	ro
	hugePages
memReserveZ
memInfosZ
memInfoZ
memItemsZ
memItemr=
check_vm_memorybacking_info
Nz0virsh qemu-monitor-command %s --hmp info versionFz
the qemu version of vm %s is %sz
2.12.0z
5.0.0Tz0Failed to check vm %s qemu version, Exception:%s)
infor8
cmdr&
errr=
check_vm_qemu_version_support7
Cacherr
shmemTF
shMemZ
qemuVersionZ
hostdev
hostDevr
	isRunning)
dictrd
parseStringrq
cfgZ
vmXmlro
get_vm_configQ
uname -mz
uname -r
the arch of hosts is %sz
the version of kernel is %szMfailed to get Arch and kernel information in src and dest Hosts, Exception:%s)
SSH_PARAMETERrX
cmdstr_archZ
cmdstr_kernelZ
archZ
kernel_versionr<
get_arch_kernel_versiont
Nz(cat /proc/meminfo | grep HugePages_Totalz%cat /proc/meminfo | grep HugepagesizeTr
z'the ret string of HugePages_Total is %s
0Fz$the ret string of Hugepagesize is %s
zEfailed to get Hugepage infomation in src and dest Hosts, Exception:%s)
intr8
cmd_hugePagesZ
cmd_pageSizeru
pageSizer<
get_hugepage_in_hosts
srcArch
srcKernelVersionZ
destArch
destKernelVersion
srcHugePage
srcHugeSize
destHugePage
destHugeSize)
HostInfor#
get_src_dest_hosts_information
)	Nz9sudo python3 /opt/bin/util_vswitch_bandwidth.pyc -b %s -l
maxspeedz&the ret string of maxspeed check is %s
	max_speedz,the ret string of maxspeed check in %s is %sr
z failed to get MaxSpeed of %s, %s)
cmdstr_remoteZ
cmdstr_local
networkInfor<
get_network_maxspeed
}	|	
z.|	d
|	d	
|	d	
r>|	d
r4|	d
r`|	d
%s:%sr|
aarchr
4.14r
5.10r
check postcopy support failed)
update
itemsr0
UnSupport_cache
UnSupport_vhostuser
lower
UnSupport_ARM_cross_kernel
UnSupport_shmem
UnSupport_different_hugePages
 UnSupport_hugePage_in_gigabitNet
Unsupport_Hostdev
Unsupport_vmPausedr8
UnSupport_script_error)
Support_postcopyZ
UnSupport_postcopyr
vmCfgr
postcopyCheck
check_postcopy_support
memoryr#
get_vm_memory_size;
}	|	d
Nz>sudo virsh qemu-monitor-command --hmp %s calc_dirty_rate -b %szMsudo virsh qemu-monitor-command --hmp %s info dirty_rate | grep "^Dirty rate"zJsudo virsh qemu-monitor-command --hmp %s info dirty_rate | grep "^Status:"r
failed to execute command: %sz
unknown commandz3The current system does not support calc_drity_ratez
start get vm dirty rate: %sr
Z	measuring
failed to execute command: %s, r
measuredz
do calc_dirty_rate finishedz
finish get vm dirty rate: %sr
startswithrx
time
ctime
sleeprF
isdigit)
timesZ
cmdcalcZ
cmdinfoZ	cmdstatusr<
outstrrz
retry
status
dirty_rater#
get_vm_dirty_rateN
Nz;sudo python3 /opt/bin/util_vswitch_bandwidth.pyc -b %s -i 8r
z0failed to get vswitch %s bandwidth info, err: %s)
iprV
get_network_parameters}
z.free_bandwidth %s vm_memory %savg_bandwidth %szLAbnormal calculation, vm_memory: %s ,free_bandwidth: %s , avg_bandwidth: %s )
floatr0
	vm_memoryZ
avg_bandwidthZ
free_bandwidthZ
precopy_timeZ
postcopy_timer#
analysis_migrate_para
]>}	z
the memory of vm %s is %s Mbytez
start migrate_caculate: %s)
timeoutz(task get remote vswitch bandwidth failedz
finish migrate_caculate: %sr
tx_avail_speedZ
rx_avail_speedz"the dirty rate of vm %s is %s Mbps)
mulZ
Poolr
apply_asyncr
memory_thresholdr
getr1
Z	terminater2
joinr>
poolr
remote_retr
tZ	src_speedZ	dst_speedZ
tx_bandwidthZ
rx_bandwidthr+
ssh -q za@%s -oConnectTimeout=120 -oTCPKeepAlive=yes -oServerAliveInterval=60 -oServerAliveCountMax=3 "%s"
__main__Z
migrate_computez
migrate_compute beginr
N):r
multiprocessingr
xml.domr
util_cvk_logr
_SUCCESSr4
UnSupport_low_qemu_versionr
UnSupport_mem_reserver
SSH_USERr
__name__Z
cas_log_init2r0
argv
printr#
<module>
