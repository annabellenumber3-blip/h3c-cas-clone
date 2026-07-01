# File: util_findCPU.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/util.package/scripts/util_findCPU.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

l	Z	d
getsize)
ElementTree)
NAMEz
	 util_findGPU.pyZ
DESCRIPTIONz
	 find GPU of the CVKZ
SYNOPSISz8	 <type>: 'all':find all GPUs; 'free':find all free GPUs)
print
util_findCPU.py
usage
range
int)
ranges
is_in&
}	|	
Nz#[util_findCPU.py]findFree(), begin.z)cat /proc/stat | grep '^cpu[0-9]' | wc -lT)
shellz3lscpu | grep '^NUMA.*CPU' | awk -F ':' '{print $2}'
z!cat /proc/stat | grep '^cpu[0-9]'r
cpu_total_time
cpu_idle_timeg
<list>z
    <numa>z
        <cpu name='cpuz
'/>z
    </numa>z
</list>z![util_findCPU.py]findFree(), end.z
BaseException %s.
logging
debugr
subprocessZ
check_output
bytes
decode
strip
split
append
time
sleepr
CPU_IDLE_FLAGr
BaseException
error)
cpu_all_dataZ
numa_node_rangeZ
cpu_sizeZ
numa_node_infosZ	numa_infor
cpu_infoZ
cpu_data
dataZ	data_listZ
cpu_data_dictr
all_cpu_idle_usageZ
cpu_idle_usageZ
node
betr
findFree,
__main__Z
cas_cpu_resourcez
shutilZ
os.pathr
sysr
Z	xml.etreer
stringZ
util_cvk_logr*
__name__
retZ
cas_log_init2
argv
exitr
<module>
