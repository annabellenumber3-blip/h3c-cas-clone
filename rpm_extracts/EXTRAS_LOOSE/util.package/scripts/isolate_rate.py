# File: isolate_rate.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/util.package/scripts/isolate_rate.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

*z!/etc/cvk/isolate_machine_mem.conf
MEMINFOc
system_mem_total
system_hugepage_total
system_hugepage_Msize
machine_limit
machine_used
machine_rate
	ovs_limit
ovs_used
ovs_rate
system_limit
system_used
system_MemAvailable
system_hugepage_mem_total
config_file_useful
load_config
memory_sysinfo_get
parse_machine_rate
parse_ovs_rate
self
isolate_rate.py
__init__
MEMINFO.__init__c
$(which cat) /proc/meminfoT
shell
stdoutz
get system memory total failedr
utf-8z	MemTotal:
MemAvailable:z
HugePages_Total:z
Hugepagesize:)
subprocess
Popen
PIPE
waitZ$ERROR_CODE_MEMORY_GET_SYSINFO_FAILED
lastErrorCode
logging
error
ValueError
communicate
splitlines
bytes
decode
startswith
split
stripr
process
errstr
liner 
MEMINFO.memory_sysinfo_getc
pasre config file failedZ
memory
machineZ
memory_limit_in_bytesZ
openvswitchz
\d+GZ
path
exists
ISOLATE_CONF_PATHr
open
json
loadr0
warnr
searchr8
dataZ
conf_machine_memZ
conf_ovs_memr 
MEMINFO.load_configc
Nz1total hugepage: %d , hugepage size: %d, pages: %d)
infor
pasre_hugepagec
MEMINFO.pasre_hugepagec
NzGpython3 /opt/bin/isolate_cpuset_mem.pyc get --hierarchy machine --limitTr#
z'isoalte get machine memory limit failedr?
isolate get machine_limit: %d)
%ERROR_CODE_GET_MACHINE_ISOLATE_FAILEDr/
cmdr;
get_machine_limitg
MEMINFO.get_machine_limitc
)	NzKpython3 /opt/bin/isolate_cpuset_mem.pyc get --hierarchy openvswitch --limitTr#
get ovs memory limit failedr
ovs_limit: %s KB)
ERROR_CODE_GET_OVS_LIMIT_FAILEDr/
get_ovs_limitw
MEMINFO.get_ovs_limitc
d	|	
Nz./sys/fs/cgroup/memory/openvswitch/cgroup.procs
cat /proc/%s/status |grep VmRSSTr#
z%get ovs memory limit failed : proc %sr
process %s, vmRSS: %d)
	readlinesr:
ERROR_CODE_GET_OVS_USED_FAILEDr/
Z	ovs_procs
lines
procrR
vmRSSr 
get_ovs_info
MEMINFO.get_ovs_infoc
ovs may not running)	r
MEMINFO.parse_ovs_ratec
machine.slicer
get_slice_infor
MEMINFO.parse_machine_ratec
Nz systemctl status %s |grep MemoryTr#
get system info failedr
Memory:r(
\d+B
\d+K
\d+M
\d+T
Z!ERROR_CODE_GET_SYSTEM_INFO_FAILEDr/
float)	r
slicerR
slice_used_infoZ
slice_usedr 
MEMINFO.get_slice_infoc
system.slicer
get system used failedr?
get system limit failed)
!ERROR_CODE_GET_SYSTEM_USED_FAILEDr0
"ERROR_CODE_GET_SYSTEM_LIMIT_FAILED
system_rate)
parse_system_rate
MEMINFO.parse_system_ratec
count_system_rate
MEMINFO.count_system_ratec
get_machine_rate
MEMINFO.get_machine_ratec
get_ovs_rate
MEMINFO.get_ovs_ratec
get_system_rate
MEMINFO.get_system_rateN)
__name__
__module__
__qualname__r"
ovsZ
rate)
ERROR_CODE_SUCCESSr/
dumpsr0
print)
mirO
jsonStrr 
main
__main__Z
isolate_rate)
copy
	tracebackr+
util_cvk_logrK
Z$ERROR_CODE_GET_SYSTEM_MEMINFO_FAILEDrQ
Z"ERROR_CODE_GET_MACHINE_INFO_FAILEDZ!ERROR_CODE_GET_OVS_ISOLATE_FAILEDZ
ERROR_CODE_GET_OVS_INFO_FAILED
objectr
cas_log_init2Z
cas_log_init
exitr/
<module>
