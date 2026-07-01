# File: isolate_cpuset_mem.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/util.package/scripts/isolate_cpuset_mem.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

m	Z	
Z3d Z4d!Z5d"Z6d#Z7d$Z8d%Z9d&a:g
Z;d(d)g
Z<d*g
Z=d+d,g
Z>e9a?G
d-d.
d.e@
d/d0
d0e@
d1d2
d2e@
d3d4
d4e@
d5d6
d6e@
d7d8
d8e@
ZFd9d:
ZGd;d<
ZHd=d>
ZId?d@
ZJeKdAk
eLdB
eMdB
jNdCd
defaultdict)
copyfile)
	cpu_countz!/etc/cvk/isolate_machine_mem.confz
/sys/fs/cgroup/cpusetz
/sys/fs/cgroup/memoryz!/sys/fs/cgroup/cpuset/cpuset.memsz!/sys/fs/cgroup/cpuset/cpuset.cpusz//sys/fs/cgroup/cpuset/machine.slice/cpuset.cpusz-/sys/fs/cgroup/cpuset/openvswitch/cpuset.cpusz'/sys/fs/cgroup/cpuset/other/cpuset.cpus
%/usr/lib/systemd/system/machine.slice
centos)
machine
openvswitch
other
cpuset
memory
memory_limit_in_bytes
cpuset_cpus
last_cpuset_cpusc
CGroupConfigc
cgroup config data:
Z	sort_keys
indentZ
separators)
confData
initConf
logging
debug
json
dumps
self
isolate_cpuset_mem.py
__init__O
CGroupConfig.__init__c
found cgroup config file '%s'
nullr"
-1z!not found cgroup config file '%s'r%
CpuCompatCheck
is_compat_check_passed
path
exists
CGROUP_CONF_PATH
getsizer0
readConfr.
cgroup_list
cgroup_hierarchy_list
cpuset_key_list
copy
deepcopy
clear
memory_key_list
	writeConf
warning
CgroupGetCpus
get_cg_machine_cpus
get_cg_openvswitch_cpus
get_cg_other_cpus)
cpu_check_objZ
is_cpu_compat_check_passedZ
ori_mem_isolateZ
cgroup_dict
hierarchy_dict
	hierarchyZ
cpuset_dictr"
memory_dictr#
cgcpur6
CGroupConfig.initConfc
rbr(
openrA
loadr.
CGroupConfig.readConfc
wFr)
dumpr.
CGroupConfig.writeConfN)
__name__
__module__
__qualname__r8
compat_current_isolcpus
compat_next_isolcpus
cmd_get_isolcpus_configr4
CpuCompatCheck.__init__c
)	Nr9
isolcpus
	errorcodez$ERROR_CODE_FIND_GRUB_ENTRY_FAILED %d
kernel_cmdlineZ
getProcCmdlineZ
getParameterr^
KernelCmdLine
	Exception
hasattrrc
!ERROR_CODE_FIND_GRUB_ENTRY_FAILEDr0
print
ERROR_CODE_SUCCESS
lastErrorCode
exitr_
current_isolcpus
next_isolcpus
linera
z&CpuCompatCheck.cmd_get_isolcpus_configc
NFT)
z%CpuCompatCheck.is_compat_check_passedc
get_compat_next_isolcpus
z'CpuCompatCheck.get_compat_next_isolcpusN)
all_cpu
cgroup_machine_cpus
cgroup_openvswitch_cpus
cgroup_other_cpus
cgroup_get_all_cpus
cgroup_get_cpu_configr4
CgroupGetCpus.__init__c
cgroup top cpu check failedz
cgroup direction not found)
CGROUP_CPUSETrU
read
ERROR_CODE_CGROUP_NOT_FOUNDrl
error
ValueError
striprv
errstrr6
z!CgroupGetCpus.cgroup_get_all_cpusc
CGROUP_MACHINE_SLICErU
CGROUP_OPENVSWITCH_SLICErx
CGROUP_OTHER_SLICEry
tdr6
z#CgroupGetCpus.cgroup_get_cpu_configc
z!CgroupGetCpus.get_cg_machine_cpusc
z%CgroupGetCpus.get_cg_openvswitch_cpusc
CgroupGetCpus.get_cg_other_cpusN)	r[
d d!
d4d"d#
d$d%
d&d'
d(d)
d*d+
d,d-
d.d/
CGroupCpuSetc
hierarchy_supported
cpuset_data
cpuset_hierarchyr%
cpuset_last_cpus
system_cpus
system_numas
system_numa_list
cpus_map
cpus_use_map
isChange
cpuset_init)
CGroupCpuSet.__init__c
False
truez#not supported cpuset hierarchy '%s'r%
 ERROR_CODE_HIERARCHY_UNSUPPORTEDrl
cpus_sysinfo_get
cpus_use_map_generater
cpus_map_generater
cpuset_variable_print
Z	isSupport
CGroupCpuSet.cpuset_initc
cpuset data: 
%sFr)
cpuset hierarchy: %sz
cpuset cpus: %sz
system cpus: %sz
system numas: %sz
cpus map: %sz
cpus use map: %sz
cpuset is change: %s)
infor2
z"CGroupCpuSet.cpuset_variable_printc
cpuset_is_change^
CGroupCpuSet.cpuset_is_changec
        generate already use cpus map, except current hierarchy
        r
ranger
appendr
cpus_merge)
tmp_hierarchyZ
tmp_mapr6
z"CGroupCpuSet.cpus_use_map_generatec
rTqFd
        generate current hierarchy cpus map
        input:
            cpus string, such as: 1-5
            cpus_map, is old map
        return list, such as: [0,1,1,1,1,1,0]
        r
cpus_parse
lenr0
cpusZ
sys_cpu_cntr
tmp_cpus_listr6
CGroupCpuSet.cpus_map_generateNc
qZq*|
        check that cpus value is valid
        Tr
z!processor 0 reserved, not isolate)
$ERROR_CODE_CPUSET_CPUS_VALUE_INVALIDrl
isValidr
cpus_check
CGroupCpuSet.cpus_checkc
        merge src cpus use map and dest cpus map to new cpus list
        input list, such as: [0,1,1,0]
        return list, such as: [0,1,1,1,1,1,0]
        r
src_cpusZ	dest_cpus
	cpus_listr
CGroupCpuSet.cpus_mergec
q>t	a
        input string, such as: 1,2-5 or 2-5 or 1,3,5
        return list, such as: [1,2,3,4,5]
        z
param cpus: %sr:
Fz2cpuset cpus format failed '%s', cpus range: '0-%s'z
cpuset cpus format failed '%s')
replace
splitr
intr
NO_CHECKr
comma_list
elemZ
elem_lowZ	elem_highr
CGroupCpuSet.cpus_parsec
q"q"t
        isMerge is True, include current hierarchy cpus map and cpus use map
        input list, such as: [1,2,3,4,5]
        return string, such as: "1,2-6  or 1,3,5 or 6-8"
        Nr
%s-%sr+
cntr
cpus_format
CGroupCpuSet.cpus_formatc
        check weather isolcpus had used same cpus.only check last cpus
        r:
Nz!cpu '%s' had used by isolate cpus)
ERROR_CODE_ISOLATE_CPU_USEDrl
set_cpusrQ
isolate_last_cpusZ
isolate_lastZ
cg_cpusZ
iso_ur
cpus_isolate_check
CGroupCpuSet.cpus_isolate_checkc
        set cpus global cgroup config data and local cpus
        
addr
cpus value invalid '%s'r%
delr:
cpus set option failed '%s'N)
!ERROR_CODE_CPUSET_OPERATOR_FAILED)
optZ
tmp_cpus_mapr
cpus_set
CGroupCpuSet.cpus_setc
)	Nr%
strr
cpu_listr
dataZ
jsonStrr6
cpus_get_all'
CGroupCpuSet.cpus_get_allc
        get cpus from global cgroup config data
        r%
current_isolcpus:%sz
current_isolcpus:z
next_isolcpus:%sz
next_isolcpus:N)	r
cpus_getG
CGroupCpuSet.cpus_getc
        add/modify/delete isolate cpus to grub config
            add example: /boot/grub/grub.cfg
                isolcpus=1-2 rcu_nocbs=1-2 nohz_full=1-2
        Nra
Z	rcu_nocbsZ	nohz_fullz"add cpus '%s' to grub successfullyz"delete cpus from grub successfully)
setParameterr0
delParameterZ
saveGrubCmdline)
cpus_grub_config`
CGroupCpuSet.cpus_grub_configc
$(which lscpu)T
shell
stdoutz get system cpus and numas failedr
CPU(s):
NUMA node(s))
subprocess
Popen
PIPE
wait
$ERROR_CODE_CPUSET_GET_SYSINFO_FAILEDrl
communicate
splitlines
bytes
decode
startswithr
process
retr
CGroupCpuSet.cpus_sysinfo_getc
cpus_config_set
CGroupCpuSet.cpus_config_setc
systemctl_set_machine_cpusetsr%
_openvswitch_cpus_setr4
cpus_live_set
CGroupCpuSet.cpus_live_setc
_last_cpus_set
CGroupCpuSet._last_cpus_setc
Failed to get system numa.)
CGROUP_CPUSET_MEMSr~
(ERROR_CODE_CPUSET_CPUSMEMS_VALUE_INVALIDr0
Z	numa_list
nlrl
get_system_numa_list
z!CGroupCpuSet.get_system_numa_listc
rR|	D
        set cpuset.cpus, cpuset.mems, cgroup.procs
        c
stderrr
Failed to execute cmd: %s: %sz!Successful to execute cmd: %s: %s)
returncoder0
execute
z3CGroupCpuSet._openvswitch_cpus_set.<locals>.execute
%s/openvswitch
%s/cpuset.cpusc
makedirs
<lambda>
z4CGroupCpuSet._openvswitch_cpus_set.<locals>.<lambda>z3ovs-vsctl get Open_vSwitch . other_config:dpdk-initrb
z%ovs dpdk opened, skip set ovs cpuset.Nr:
%s/cpuset.memsr
%s/cgroup.procsr
CGROUP_CPUSET_PATHr
writer
openvswitch_pid_getr
cpuset_openvswitch_dirZ
cpuset_openvswitch_cpus_path
mkdirlambdar
is_dpdk_initrX
cpuset_openvswitch_mems_path
ovs_pid_listZ
cpuset_openvswitch_procs_pathr
z"CGroupCpuSet._openvswitch_cpus_setc
allz2systemctl set-property machine.slice CPUSetCpus=%sTr
z,set machine.slice failed: %d  errs:% cpuset:z!systemctl_set_machine_cpusets: %sz%systemctl set cpus missing slice file)
SYSTEMCTL_MACHINE_CONFr
+ERROR_CODE_CPUSET_MACHINE_CGROUP_SET_FAILEDrl
cmdstrr
outs
errsr
z*CGroupCpuSet.systemctl_set_machine_cpusetsc
        set cpuset.cpus for vm cpuset cgroup
        r
%s/machine.slice
ubuntu
%s/machinez
unknown system distributor idr
z0CGroupCpuSet._machine_cpus_set.<locals>.<lambda>r
CVK_TYPEr
cpuset_machine_dirr
cpuset_machine_cpus_pathZ
cpuset_machine_mems_pathr
_machine_cpus_set
CGroupCpuSet._machine_cpus_set)
d d!
d"d#
d$d%
d&d'
d(d)
d*d+
d,d-
d.d/
d0d1
d2d3
d4d5
CGroupMemoryc
memory_data
memory_hierarchyr$
memory_usage_in_bytes
system_mem_total
system_limit_in_bytes
system_usage_in_bytes
system_mem_reserver
system_hugepage_total
system_hugepage_Msize
system_hugemem_total
memory_init
NEED_CHECK_HUGEPAGE
hugepage_check)
CGroupMemory.__init__c
)	NFT
system_freez#not supported memory hierarchy '%s'
system
userrd
memory_sysinfo_get
_system_memory_reserve
_memory_usage_getr
_system_memory_limit
memory_variable_printr
CGroupMemory.memory_initc
memory data: 
%sFr)
memory limit in bytes %s MiBz
memory usage %s MiBz
system memory total: %s MiBz#system memory limit in bytes %s MiBz$system memory usage in bytes: %s MiBz
system memory reserve: %s MiB)
hard_limit_parser$
z"CGroupMemory.memory_variable_printc
Nz'system HugePages_mem living size %s MiBr
\d+G
\d+(\.\d+)+Mz
\d+M
z'system HugePages_mem config size %s MiB)
HugePageCheck
get_hugepage_config
matchr
hugepage_objZ
cmd_hugepage_conf
hugepagesz
	hugepagesZ
hugepag_confZ
hugepagesz_Mr6
CGroupMemory.hugepage_checkc
memory_is_changeZ
CGroupMemory.memory_is_changec
zHhas not enough memoory to limit, check system memory and hugepage configr
+ERROR_CODE_MEMORY_MACHINE_CGROUP_SET_FAILEDrl
hard_limit_check)
default_limitr
get_default_mem_limit]
z"CGroupMemory.get_default_mem_limitc
z#current system memory is not enough)
free_memr6
return_free_mem_limitk
z"CGroupMemory.return_free_mem_limitc
        argument limit type is int
        Tr
zrset limit value '%s' lower 1GB or lower memory_usage_in_bytes(%s GB) or all hierarchy total memory limit larger %sF)
limitr
other_hierarchyr
	mem_limit
totalr6
CGroupMemory.hard_limit_checkc
\d+GB
set memory limit value: %s
groupr0
limitstrr
CGroupMemory.hard_limit_parseNc
memory limit value valid '%s'z
new: %s, old: %s
startr$
memory limit value '%s' invalidr
z%memory limit set operate '%s' invalid)
is_cgroup_mountedr
hard_limit_live_setr
%ERROR_CODE_MEMORY_LIMIT_VALUE_INVALIDrl
!ERROR_CODE_MEMORY_OPERATOR_FAILEDr
moder
hard_limit_set
CGroupMemory.hard_limit_setc
ret_mem_limitr6
hard_limit_get
CGroupMemory.hard_limit_getc
hard_limit_config_set
z"CGroupMemory.hard_limit_config_setc
ubuntu hard_limit_checkr
centos hard_limit_checkrb
floatr
_machine_hard_limit_set_ubunut
_machine_hard_limit_set_centos
_openvswitch_hard_limit_setr
memory_limitr6
z CGroupMemory.hard_limit_live_setc
$(which cat) /proc/meminfoTr
get system memory total failedr
utf-8z	MemTotal:r
HugePages_Total:
Hugepagesize:)
$ERROR_CODE_MEMORY_GET_SYSINFO_FAILEDrl
CGroupMemory.memory_sysinfo_getc
z#CGroupMemory._system_memory_reservec
Z	tmp_totalr
z!CGroupMemory._system_memory_limitc
z$cat /proc/%s/status | grep -w ^VmRSSTr
get process '%s' VmRss failedz4get process ovsdb-server and ovs-vswitchd pid failedr
'ERROR_CODE_MEMORY_OVS_CGROUP_SET_FAILEDrl
memory_usager
pidr
vmrssr
_openvswitch_memory_usage_get
z*CGroupMemory._openvswitch_memory_usage_getc
q~n&t
) Nr
z:CGroupMemory._openvswitch_hard_limit_set.<locals>.<lambda>r;
%s/memory.limit_in_bytesrY
$not found '%s/memory.limit_in_bytes'z
set openvswitch pidr
z$%s/system.slice/ovs-vswitchd.servicez$%s/system.slice/ovsdb-server.servicerd
z"%s/memory.move_charge_at_immigrater'
z:systemctl set-property ovs-vswitchd.service MemoryLimit=%s
1z.not found '%s/memory.move_charge_at_immigrate'r
%s/memory.swappinessZ
60z not found '%s/memory.swappiness'z
%s/memory.oom_controlz
not found '%s/oom_control'r
not found '%s/cgroup.procs'z4get process ovs-vswitchd and ovsdb-server pid failed)
CGROUP_MEMORY_PATHr>
memory_openvswitch_dirr
pid_listZ
ovs_vswitchd_service_dirZ
ovsdb_server_service_dirZ
mem_limit_Gr+
scmdr%
z(CGroupMemory._openvswitch_hard_limit_setc
ubuntu_get_mem_hierarchyr4
get_mem_hierarchy
CGroupMemory.get_mem_hierarchyc
z*/sys/fs/cgroup/memory/memory.use_hierarchyr|
not fount %s)
isfilerU
&ERROE_CODE_MEMORY_HIERARCHY_GET_FAILEDrl
mem_hierZ
mem_hierarchyrX
z%CGroupMemory.ubuntu_get_mem_hierarchyc
j	d	
j	d	
z#can not find machine dir, create itc
z=CGroupMemory._machine_hard_limit_set_ubunut.<locals>.<lambda>z
check mem_hierarchy_value: %sr
z3echo 1 > /sys/fs/cgroup/memory/memory.use_hierarchyTr
z;mem_hierarchy set failed, it will take effect after reboot rb
cgroup hierarchy check normalr;
z"echo %s > %s/memory.limit_in_bytesz'cgroup machine write failed: %d  errs:%
write cgroup machine %srB
&ERROR_CODE_MEMSET_HIERARCHY_SET_FAILEDrl
memory_machine_dirr
mem_hierarchy_valuer
z+CGroupMemory._machine_hard_limit_set_ubunutc
9223372036854771712z3systemctl set-property machine.slice MemoryLimit=%sTr
z$set machine.slice failed: %d  errs:%rL
systemctl missing slice file)
)	r5
machine_conf_filer%
z+CGroupMemory._machine_hard_limit_set_centosc
rz|	d
z)/usr/lib/systemd/system/machine.slice.bakz)/usr/lib/systemd/system/machine.slice.tmpr;
MemoryLimit=%sz
memconfig_line %sr|
[Slice]
MemoryLimitz
reset slice file
[Slice]
slice file need not changerO
	readlines
findr
renamer
systemctl_start_machine_slicer 
slice_flagZ
cline_flagZ
mconf_flagrP
machine_conf_bak_fileZ
machine_conf_tmp_filer%
memconfig_line
linesrq
linZ
)_machine_hard_limit_set_centos_persistent
z6CGroupMemory._machine_hard_limit_set_centos_persistentc
systemctl daemon-reloadTr
systemctl start machine.slicer
z(systemctl start machine.slice failed: %sz
start machine.slice)
%ERROR_CODE_START_MACHINE_SLICE_FAILEDrl
z*CGroupMemory.systemctl_start_machine_slicec
%s/system.slicez
%s/user.slicer
_system_hard_limit_set: %srA
z2systemctl set-property system.slice MemoryLimit=%dTr
set systm.slice failed: %srB
z0systemctl set-property user.slice MemoryLimit=%dz
set user.slice failed: %s)
*ERROR_CODE_MEMORY_SYSTEM_CGROUP_SET_FAILEDrl
)	r5
memory_system_dirZ
memory_user_dirr
_system_hard_limit_setA
z#CGroupMemory._system_hard_limit_setc
)	Nr
z!%s/%s.slice/memory.usage_in_bytesr|
MEM_USE_PATHrX
CGroupMemory._memory_usage_get)
NNN)
NNN)
HugePageCheck.__init__c
/proc/meminforS
z3living hugepage_conf, hugepagesz: %s, hugepages: %s)	
list
	read_filer
live_hugepage_configr
get_live_hugepage_config
z&HugePageCheck.get_live_hugepage_configc
Nz1grub hugepage_conf, hugepagesz: %s, hugepages: %sr
hugepagecheckZ
cmd_get_grub_hugepage_configr0
grub_hugepage_configr6
get_grub_hugepage_config
z&HugePageCheck.get_grub_hugepage_configc
error to open file: %s)
	exception)
contentrX
HugePageCheck.read_filec
hugepage_confr6
z!HugePageCheck.get_hugepage_configN)
    get ovs-vswitchd and ovsdb-server pid
    z!/run/openvswitch/ovs-vswitchd.pidz!/run/openvswitch/ovsdb-server.pidz!/run/openvswitch/ovs-failover.pidr|
N)	rU
OVS_VSWITCHD_PID_PATHZ
OVSDB_SERVER_PID_PATHZ
OVS_FAILOVER_PID_PATHrX
NTF)
config_ubuntu_service
qDnJt
d#|	
d't+
d)t.
)*NFTz
accept params: %sz1Process CPU and Memory resource isolate by Cgroup)
descriptionr
isolate operate)
dest
help
setz
--hierarchyz)support 'openvswitch', 'machine', 'other')
typerh
--cpuszOset cpuset.cpus, like: 2,6,8 or 3-9 or 'disable', 'disable' indicate unset cpusz
--limitzQset memory.limit_in_bytes, like: 8GB or 'disable', 'disable' indicate unset limit
getz8support 'openvswitch', 'machine', 'other', 'system_free'
store_truezEget cpuset.cpus, return like: 3-9 or null, 'null' indicate unset cpus)
actionrh
zRget memory.limit_in_bytes, return like: 1048576KB or -1, '-1' indicate unset limitZ
configzKsupport 'openvswitch', 'machine', 'all', 'all' indiate config all hierarchyz
--lastcpusz$record cpuset cpus when system startr,
disabler
argument failedr
z#cgroup machine write failed: errs:%z
not support command '%s'z
Exception exit:
%s)0
ERROR_CODE_UNKNOWNrl
argv
argparse
ArgumentParser
add_subparsers
add_parser
add_argumentr
parse_argsr'
ERROR_CODE_PARAM_FAILEDr
lastcpusr
	traceback
format_exc)
parserZ	subparserZ
subparser_opt
argsZ
cg_conf_objr
cpuset_objr
memory_objr
system_free_Mr
default_memZ
conf_memrs
main
__main__Z
isolate_memrb
)Pr>
collectionsr
util_cvk_logZ
util_kernel_cmdlinere
hugepage_configrb
shutilr
platformZ
multiprocessingr
xml.etree.ElementTreeZ
etreeZ
ElementTreeZ
ETrm
Z&ERROR_CODE_MEMSET_HUGE_PAGE_GET_FAILEDr
ERROR_CODE_SYSTEM_UNSUPPORTEDr[
ERROR_CODE_RESTART_SLICE_FAILEDro
objectr'
cas_log_init2Z
cas_log_initrp
<module>
