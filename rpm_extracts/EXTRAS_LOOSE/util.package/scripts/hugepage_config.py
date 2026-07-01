# File: hugepage_config.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/util.package/scripts/hugepage_config.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

Z)d!d"
Z*d#d$
Z+d%d&
Z,d'd(
Z-d)d*
Z.d+d,
Z/d-d.
Z0e1d/k
e2d0
e3d0
Z4d1Z5z
e0e6j7d
zDe:e9d2
e9j;Z4n
Z4e<e9
Z5e=
e?e@e9
Z9[9n
Z9[90
Be4e4
Z4e4e
Cd4e4e5f
Dd4e4e5f
)5a4
############################################################################
#    File Name: hugepage_config.py
# Date Created: 2016-11-16
#       Author: jinkaibin j13060
#  Description: get or set the hugepage for kernel load argument
#        Input:
#       Output:
#       Return: 0 if succeffully, other with errors
#      Caution:
#-----------------------------------------------------------------------------
#  Modification History
#  DATE        NAME             DESCRIPTION
##############################################################################
/etc/fstabz"/tmp/hugepage_config_tmp_etc_fstabz$/etc/cvk/mem_hugepage_threshold.confz
/etc/cvk/cpu_mem_threshold.conf)
pdpe1gb
shell
stderr
stdoutr
Failed to execute cmd: %s: %sz!Successful to execute cmd: %s: %s)
subprocess
Popen
PIPEZ
communicate
decode
returncode
logging
error
strip
debug)
hugepage_config.py
execute7
error to open file: %s)
open
readr
	exception)
pathZ
content
	read_fileB
rBq.|
r6z<t
before open filer&
mem_max_percentr
mem_recommend_percentz#error to parse file: %s in line: %sZ
MemSysReservedz
error to parse file: %s zNmem_max_percent: %d%%, mem_recommend_percent: %d%%, mem_system_threshold: %dG.)
MEM_MAX_PERCENT
MEM_RECOMMEND_PERCENT
osr*
isfile
MEM_HUGEPAGE_THRESHOLDr'
	readlinesr
startswith
split
intr
SYSTEM_MEM_RESERVE
CPU_MEM_THRESHOLDr,
index
info)
liner+
mem_percent_list
mem_system_thresholdZ
cpu_mem_thresholdZ
mem_system_threshold_indexr"
get_hugepage_thresholdK
qNq(W
qpnvt
}	|	r
/proc/cpuinfo
x86r&
flags
z(/sys/devices/system/node/node0/hugepagesz
hugepages-(\d+)kBr
support hugepagesz list: %s)
SYSTEM_PLATFORMr'
HUGEPAGE_SIZE_FLAG
appendr3
listdir
match
group
isdigitr9
cpuinfoZ
hugepagesz_support_listZ
cpu_flag_listr+
flag
name
sizeZ
huge_dirrK
get_support_hugepagesz_listj
/proc/meminfor&
z	MemTotal:r
'/sys/devices/system/node/node*/numastatr
/etc/cas_cvm-versionzRhugepagez_min: %dM, is greater than hugepagez_max %dM, change hugepagez_min = %dM.z_hugepagez_recommend: %dM, is greater than hugepagez_max: %dM, change hugepagez_recommend = %dM.z\hugepagez_recommend: %dM, is less than hugepagez_min: %dM, change hugepagez_recommend = %dM.zAhugepagez_min: %dM, hugepagez_recommend: %dM, hugepagez_max: %dM.)
globrA
OVS_MEM_RESERVE
SYSTEM_MEM_RESERVE2
SYSTEM_MEM_RESERVE3r3
CVM_EXTRA_MEM_RESERVE
MIN_HUGEPAGE_MEMr
meminfor+
memtotal
numa_node_numZ
numa_node_memr/
mem_system_default_threshold
hugepagez_max
hugepagez_min
hugepagez_recommendr"
get_recommend_hugepage_size
support_hugepagesz
hugepages_Z
_recommendZ
_minZ
_maxr
)	rQ
joinra
list
filter
strrM
resultZ
hugepagesz_listr`
pagesizeZ
hugepages_size_recommendZ
pages_recommendZ
hugepages_size_minZ	pages_minZ
hugepages_size_maxZ	pages_maxr"
cmd_get_support_hugepage_config
hugepagesz
	hugepagesr
kernel_cmdlineZ
getProcCmdline
getParameterrH
live_hugepage_configr?
cmd_get_live_hugepage_config
KernelCmdLinero
grub_hugepage_config
kcrl
cmd_get_grub_hugepage_config
HugePages_Total:rE
HugePages_Free:z.Failed to turn off hugepage because of in use.r
z1input argument error: hugepagesz=%s, hugepages=%sz)hugepagesz '%s' is not in support list %src
z7Turn on hugepage without check because hugepage is off.zB/sys/devices/system/node/node*/hugepages/hugepages-*kB/*_hugepageszN/sys/devices/system/node/node(\d+)/hugepages/hugepages-(\d+)kB/(\S+)_hugepagesr
freez"unexcepted node hugepages path: %sc
<listcomp>,
z(check_hugepage_valid.<locals>.<listcomp>zaFailed to change hugepage, because: total hugepages %s, is less than used hugepages %s by system.)
ERROR_CODE_OKr,
ERROR_CODE_HUGEPAGE_IN_USE
ERROR_CODE_INVALID_ARGUMENTrQ
ERROR_CODE_UNSUPPORT_PAGESZre
ERROR_CODE_LESS_THAN_USING)
resr?
total_hugepageZ
free_hugepageZ
support_listZ
config_page_sizer]
average_page_to_memZ
live_hugepageszZ
live_page_sizeZ
node_to_total_memZ
node_to_free_memr+
memZ
node_to_used_memr"
check_hugepage_valid
rFt	
size :1G, 2M, 0z:nodev /dev/hugepages  hugetlbfs       defaults        0 0
z0nodev /dev/hugepages hugetlbfs pagesize=1GB 0 0
z/nodev /dev/hugepages hugetlbfs pagesize=2M 0 0
Z	hugetlbfsz0find hugetlbfs entry in /etc/fstab: "%s" -> "%s"z,unchange hugetlbfs entry in /etc/fstab: "%s")
TMP_ETC_FSTAB
	ETC_FSTABr6
writer8
chmod
stat
S_IMODE
st_mode
shutil
mover
remover
hugetlbfs_lineZ
find_hugetlbfs_lineZ
outf
infr?
line2
itemsZ
point
type_
options
dumpZ
pass_r"
update_hugetlbfs_in_fstab7
rFnP|
)	NZ
default_hugepageszrl
/etc/usan-versionr
delParameterZ
setParameterr3
existsZ
addParameterr
saveGrubCmdline)
cmd_set_grub_hugepage_config]
r>d a
d"d#
t%d$
)%Nz
Process hugepage configuration.)
descriptionr 
hugepage operations)
dest
help
setz
--hugepageszz_set hugepage size in grup.cfg: 2M,1G or other support size, 0 means to clear config of hugepage)
typer
--hugepagesz
set hugepage num in grup.cfg
getz
--live
store_truez#get live hugepage config in cmdline)
actionr
--configz
get hugepage config in grup.cfgz	--supportz
get support hugepage configz
Script Execute: 
parsed args : %s.z python3 /opt/bin/get-sysinfo.pycr
failed to get sysinfoZ
cpu_info
	cpu_modelr%
cpu_model_namerB
aarchz
unsupport platformc
%s : %sr"
z7main.<locals>.output_key_value_list.<locals>.<listcomp>z
output:
print)
output_strr"
output_key_value_list
z#main.<locals>.output_key_value_listZ
TODO)&
argparse
ArgumentParser
add_subparsers
add_parser
add_argumentrh
argv
parse_argsr
	Exception
ERROR_CODE_UNKNOWN
	errorcode
fromstring
tagZ
attribr
supportrj
liverp
configrs
top_parserZ
sub_parsersZ
sub_parser
argsr 
root
childr
outputr"
mains
__main__Z
hugepage_configr%
catch exceptionz
error code: %d, messge: %s)F
__doc__r
jsonrW
util_cvk_logZ
xml.etree.ElementTreeZ
etreeZ
ElementTreer
util_kernel_cmdlinern
ERROR_CODE_TOO_MANY_HUGEPAGEZ ERROR_CODE_FAILED_TO_PARSER_GRUBr
__name__Z
cas_log_init2Z
cas_log_initr
errorMessager
hasattrr
Z!ERROR_CODE_FIND_GRUB_ENTRY_FAILEDr
exitr"
<module>
