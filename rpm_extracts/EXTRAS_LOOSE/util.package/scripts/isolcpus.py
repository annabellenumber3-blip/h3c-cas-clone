# File: isolcpus.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/util.package/scripts/isolcpus.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

m	Z	
zDe#e"d
e"j$Z
e%e"
e(e)e"
Z"["n
Z"["0
r~e&
############################################################################
#    File Name: isolcpus.py
# Date Created: 2017-03-23
#       Author: zhangjixiang 08687
#  Description: get or set the isolcpus for kernel load argument
#        Input:
#       Output:
#       Return: 0 if succeffully, other with errors
#      Caution:
#-----------------------------------------------------------------------------
#  Modification History
#  DATE        NAME             DESCRIPTION
##############################################################################
	cpu_count)
z!/etc/cvk/isolate_machine_mem.confc
rTq$t
q~q$t
split
range
str)	
isolcpus
count
str_arrZ
str_elemZ
num_arr
isolcpus.py
convert_isolcpus_from_read'
current_isolcpus:
next_isolcpus:)
kernel_cmdlineZ
getProcCmdlineZ
getParameterr
KernelCmdLine)
current_isolcpusZ
next_isolcpus
liner
current_cpus_str
next_cpus_strr
cmd_get_isolcpus_configC
}	|	|
indexZ
last_valZ
lastr
size
elemZ
curr_valr
convert_isolcpus[
Z	rcu_nocbsZ	nohz_full)
delParameter
check_cgroup_cpus_configr%
setParameter
ERROR_CODE_INVALID_ARGUMENTZ
saveGrubCmdline)
disabler 
converted_strr
cmd_set_isolcpus_configy
nullz pase cgroup cpuset config failedZ
cpuset
machineZ
cpuset_cpusZ
openvswitch
otherr
z"cpu: %s had used by machine cgroupz
cpu: %s had used by ovs cgroupz cpu: %s had used by other cgroup)
path
exists
CGROUP_CPUSET_CONFIG
open
json
load
logging
error
exit
 ERROR_CODE_FAILED_TO_LOAD_CGCONFr
"ERROR_CODE_CPUS_HAD_USED_BY_CGROUP)
cg_cpus
dataZ
cg_cpus_machineZ
cg_cpus_ovsZ
cg_cpus_otherZ
cg_cpus_machine_rdZ
lcpuZ
cg_cpus_ovs_rdZ
cg_cpus_other_rdr
Process isolcpus configuration.)
description
cmdz
isolcpus operations)
dest
help
setz
--cpusz
like --cpus 1,2,4,5,6,8)
typer>
z	--disable
store_truez
disable isolcpus)
actionr>
getz
--statez
get isolcpus statez
Script Execute: 
parsed args : %s.Z
TODO)
argparse
ArgumentParser
add_subparsers
add_parser
add_argumentr
info
joinr5
argv
parse_args
debug
ERROR_CODE_OKr<
cpusr(
stater!
print)
top_parserZ
sub_parsersZ
sub_parser
args
outputr
main
__main__r
	errorcodez
catch exceptionz
error code: %d, messge: %s)/
__doc__rE
stat
shutilr,
globZ
multiprocessingr
util_cvk_logZ
util_kernel_cmdliner
ERROR_CODE_UNKNOWNr'
Z ERROR_CODE_FAILED_TO_PARSER_GRUBr7
__name__Z
cas_log_init2Z
cas_log_initrS
errorMessager5
	Exception
hasattrrW
	exceptionrQ
Z!ERROR_CODE_FIND_GRUB_ENTRY_FAILEDrC
<module>
