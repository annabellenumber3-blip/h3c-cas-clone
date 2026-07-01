# File: inspection_cpu_memory.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/util.package/scripts/inspection_cpu_memory.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

Z+d!d"
Z,d#d$
Z-d%d&
Z.d'd(
Z/d)d*
Z0d+d,
Z1d-d.
Z2d/d0
Z3d1d2
Z4d3d4
Z5d5d6
Z6e7d7k
e8d8d9
e9d8
j:d:d
Z<[<n
Z<[<0
ElementTree)
islicei
0x1Z
0x2Z
0x3Z
0x4Z
0x5Z
0x6Z
alliX
NTF)
isdigit
float
	TypeError
ValueError)
inspection_cpu_memory.py
	is_number:
Devicez
Device class
HATools
get_host_name
hostnameZ	healthRes
selfr
__init__K
Device.__init__c
failed to creat file %s, %s
path
exists
mknod
chmod
stat
S_IWUSR
S_IRUSR
S_IWOTH
S_IROTH
S_IWGRP
S_IRGRP
	Exception
logging
	exception
str)
fileName
creatinfofileO
Device.creatinfofileN)
__name__
__module__
__qualname__
__doc__r
staticmethodr(
Cpusz
cpu informationc
dmidecode -t systemz
dmidecode -s processor-versionz
/proc/statz
/proc/cpuinfog
cmdStr
	cmdCpuVer
cpuStatFileZ
cpuInfoFile
cpuRate
cpuRateThrUp
cpuRateThrLowr
threshold1
threshold2r
Cpus.__init__c
zF get cpu timeslice
            Returns: total time, idle time
        
failed to get cpurate, %sr
openr1
readline
join
split
intr#
line
result
totalZ
idler'
cputimel
Cpus.cputimec
 calcute cpuRate,
            the computing method of cpu use rate is the same as cas_mon,
            total = cpu_use + cpu_nice + cpu_sys + cpu_idle,
            freecpurate = cpu_idle / total,
            cpurate = (1 - freecpurate) * 100
            Args:
            Returns: cpuRate in int
        r<
time
sleepr2
round)
total1Z
idle1Z
total2Z
idle2r
cpurate
Cpus.cpuratec
z^ check cpuRate
            Args:
            Returns: info, result-code, health-level
        )
RESULT_CODE_FAULT
HEALTH_LEVEL_FAULTr4
RESULT_CODE_WARN
HEALTH_LEVEL_WARN
RESULT_CODE_OK
HEALTH_LEVEL_NORMALr
cpurate_check
Cpus.cpurate_checkc
}	~	S
}	~	0
zg check core temperature
            Args:
            Returns: info, result-code, health-level
        Z
cas_monr
/etc/cvk/coretempr7
failed to get coretemp, %s)
read_process_pidrS
TIME_INSEC_600rQ
isExitsrD
line2rF
hostTime
alarmZ
tempZ	thresholdr'
coretemp_check
Cpus.coretemp_checkc
rnq*|
/etc/cvk/inspection_cpufreq
rz-dmidecode -t processor | grep "Current Speed"T
shellr
failed to get cpu frequency, %s)
execute_command
splitlinesrB
stripr
appendrS
outputrF
idrE
strCurZ
strFlier'
cpufreq_check
Cpus.cpufreq_checkc
NTr\
failed to get cpu version, %s)
startswithr`
cpuversion_get
Cpus.cpuversion_getN)
CPURATE_ALARM_THR_80
CPURATE_ALARM_THR_60r
Memorysz
memory informationc
dmidecode -t memoryzGdmidecode -q -t  memory | grep -E "Size:|Locator:|Speed:|Manufacturer:"z
/proc/meminfoz
/etc/cvk/inspection_uis.conf)
cmdMem
memFile
confFile
memRateThrUp
memRateThrLow
swapRateThrUpr
threshold3r
Memorys.__init__c
)	z| get memory infomation from file
            Args:
            Returns: memTotal, memAvailable, swapTotal, swapFree
        
	MemTotal:r8
MemAvailable:z
SwapTotal:z	SwapFree:Nz$failed to get memory infomaition, %s)
)	r?
memTotal
memAvailable
	swapTotal
swapFreer'
meminfo
Memorys.meminfoc
 calcute memory used rate, and swap memory used rate
            Args:
            Returns: info, result-code, health-level
        rI
memRateZ
swapRater
memrate
Memorys.memratec
 memory used rate, and swap memory used rate helth check result
            Args:
            Returns: info, result-code, health-level
        )
rate1Z
rate2
code1
level1
code2
level2r
memrate_check"
Memorys.memrate_checkc
 check memory total changing when service is running
            Args:
            Returns: info, result-code, health-level
        rq
memory
memstartupz=failed to get memory change infomaition with host running, %sr
configparser
ConfigParser
readrm
getr#
confr'
memory_change_run4
Memorys.memory_change_runc
 check memory total changing when service restarted
            Args:
            Returns: info, result-code, health-level
        r}
memlaststartupr~
z>failed to get memory change infomaition with host starting, %sr
line1rX
memory_change_startN
Memorys.memory_change_startc
NTr\
Size
Locator
Speed
Manufacturerr
Unknownz
NO DIMM)
*failed to get memory detail infomation, %s)
memInfoZ
mem_dicrc
valr'
memory_detail_infod
Memorys.memory_detail_infoc
No Module Installedz
%d:%s:%s:%s:%sZ
 GBz&/etc/cvk/inspection_memory_detail_inforV
result2Z
memErr
inforc
size
location
speedZ
manufacrD
valuer'
memory_detail_check
Memorys.memory_detail_checkc
/usr/sbin/cha -k memory-testTr\
Speed:rV
Error:z
Check memory speed failed.z'Check memory speed with exception : %s.)
speedStrr
memory_speed_check
Memorys.memory_speed_checkN)
MEMRATE_ALARM_THR_80
MEMRATE_ALARM_THR_60
SWAPRATE_ALARM_THR_30r
construct_xml
CHECK_CPURATE_ID
COMPONENT_TYPE_HOSTr
leve1s
hwCr
code
levelr
get_cpurate_info
cputemp)
CHECK_CORETEMP_IDr
get_coretemp_info
CPU)
CHECK_CPUFREQ_IDr
get_cpufreq_info
ALL_HEALTH_LEVELrg
GET_CPUVARSION_IDr
outrc
get_cpuver_info
CHECK_MEMRATE_IDr
hwMZ
value1rx
value2rz
get_memrate_info
swapmemrate)
CHECK_SWAPMEMRATE_IDr
get_swaprate_info
memtotal)
CHECK_MEMCHANGESTART_IDr
value3Z
code3Z
level3r
get_memchange_start_info
meminstalled)
CHECK_MEMCHANGERUN_IDr
value4Z
code4Z
level4r
get_memchange_run_info
GET_MEMDETAIL_IDr
errInforc
get_memory_detail_info
 err)
CHECK_MEMINSTALLED_IDr
get_memory_err_info
memoryspeed)
CHECK_MEMSPEED_IDr
get_memory_speed_info
 get cpu and memory helth check info in xml format
        Args: ids-item id need to be checked
              leve1s-upload level
        Returns: xml str
    rN
cpufreqZ
cpuversionrw
Z	memdetailZ	memoryerrr
idsr
hostCheckList
item
funcrc
get_cpu_memory_inspection_info
j	rf|
Get inspect result diagnoses.)
descriptionz
--levelz&level uses to filter outputing result.)
type
helpz
--idz id list for items to be checked.z
Script Execute: r7
"%s"r
<lambda>,
run_script.<locals>.<lambda>r
argparse
ArgumentParser
add_argumentr&
parse_argsr
DEFAULT_HEALTH_LEVELrc
argvZ
top_parser
argsr
Z	select_idr
run_script'
__main__
inspection_haZ
cas_har8
catch exceptionz
execute end)@r
rerK
binascii
	linecache
typesZ	xml.etreer
util_cvk_logr$
	itertoolsr
CONFIG_LEVELrW
SWAPRATE_ALARM_THR_80Z
SWAPRATE_ALARM_THR_60r
objectr
cas_log_init2Z
cas_log_initr
exitr
<module>
