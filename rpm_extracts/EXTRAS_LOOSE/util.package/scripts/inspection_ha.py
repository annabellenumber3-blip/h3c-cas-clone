# File: inspection_ha.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/util.package/scripts/inspection_ha.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

Z-e.d
Z1[1n
Z1[10
e-e3j4d
Z1[1n
Z1[10
############################################################################
#    File Name: inspection_ha.py
# Date Created: 2017-12-06
#       Author: zhouyanchun
#  Description: the ha inpection function in a key inpection project
#-----------------------------------------------------------------------------
#  Modification History
#  DATE        NAME             DESCRIPTION
##############################################################################
islice)
ElementTree
0x7i
HAToolsz&
        packaged the common tool
    Fc
rxt	
shell
stderr
stdoutZ	close_fdsr
cmd %s, result %s)
isinstance
split
subprocess
Popen
PIPEZ
communicate
strip
returncode
logging
error)
cmdr
raise_exception
code
inspection_ha.py
command_outputB
HATools.command_outputc
decode)
execute_commandP
HATools.execute_commandc
/etc/hostname
rz failed to read /etc/hostname, %s)	
path
exists
open
readr
	Exceptionr
	exception)
hostname
get_host_nameT
HATools.get_host_namec
Nz//bin/bash /opt/bin/cvm_role_tool.sh is_cvm_roleT
trueF)
resultr
check_is_cvma
HATools.check_is_cvmc
<diagnosis><id>%d</id><component-type>%d</component-type><component-name>%s</component-name><target-name>%s</target-name><result-code>%d</result-code><health-level>%d</health-level><info>%s</info></diagnosis>)
print)	
check_idZ
component_type
name
target_name
result_code
health_level
infoZ
config_levelZ
xmlr
construct_xmlj
HATools.construct_xmlc
            get the process pid via process name
            args:
                process_name: the process name
        z8ps -ef | grep -w /usr/sbin/%s | grep -v grep 2>/dev/nullTr0
%s process is not exist
intr
process_namer
pid_info
pidr
read_process_pidx
HATools.read_process_pidc
z%/opt/bin/db-auth.sh -k hzbdbkz1 printz
^DB_USER=(.*))
flagsr
^DB_PASS=(.*)z
^DB_PORT=(.*)z	127.0.0.1Z
vservice)
host
portZ
database
user
passwordz&unable to fetch data from database, %s)
popenr)
search
	MULTILINE
group
psycopg2Z
connect
cursorZ
executeZ
fetchallr
close)
resultsZ
cmd_resultZ
db_userZ
db_pwZ
db_portZ
dbrL
fetch_data_from_database
z HATools.fetch_data_from_databasec
Nz;inspection_ha.py, failed to open host %s connection to qemu)
libvirtr(
hostip)
connr.
open_libvirt_connect
HATools.open_libvirt_connectc
Nz9inspection_ha.py, failed to close libvirt qemu connection)
close_libvirt_connect
HATools.close_libvirt_connectc
z%get ip version fail, error message:%s)
IPyZ
versionr*
verr.
get_ip_version
HATools.get_ip_versionN)
__name__
__module__
__qualname__
__doc__
staticmethodr!
HAInspectionz
        inspect the ha checking items
        attributes:
            hostname: the host name
            flags: the dict to save the inspection items checking flag
            level: the health level
    c
            init the flags dict
            args:
                check_flag: the inspection items check flag
        N)
HOST_HEARTBEAT_ID
STORAGE_HEARTBEAT_ID
HOST_PERFORMANCE_ID
PRIMARIY_PROCESS_ID
VM_CONSISTENT_ID
ROOT_PARTITION_UTIL_ID
LOG_PARTITION_UTIL_ID
VMS_PARTITION_UTIL_ID
SHARE_STOREAGE_UTIL_ID
FREEZE_VM_ID)
clsZ
check_flagr
init_flags
HAInspection.init_flagsc
            set the inspection item checking flag
            args:
                ids: the checking item ids
        
NOT_CHECK_FLAGr
CHECK_FLAGr
idsZ
ids_listZ
id_strr
	set_flags
HAInspection.set_flagsc
Nz<select value from tbl_parameter where name='root.ssh.enable'r
0FT)
sqlBackr
check_whether_root_can_ssh
z'HAInspection.check_whether_root_can_sshc
ztz2|
qemu+ssh://%s/systemz
qemu+ssh://sysadmin@%s/systemz'inspection_ha.py, failed to open url %sz4inspection_ha.py, failed to get a list of domain, %s)
startswithr`
listAllDomains
appendr6
domainnamesrS
domains
domainr.
find_vms_by_libvirt
z HAInspection.find_vms_by_libvirtc
]<}	|	d
]@}	|
            find repeat vm on all hosts
        Nr
z select name,ipaddr from tbl_hostr
;z(inspection_ha.py vm consistency info: %sz	vm-verify)
RESULT_CODE_OK
HEALTH_LEVEL_NORMALr
count
items
range
RESULT_CODE_WARN
HEALTH_LEVEL_FAULTr
debugr;
COMPONENT_TYPE_HOSTr,
level)
all_infoZ
vms_listZ	host_listZ
vms_dictrN
hostsrB
vms_from_cvk
vm_count
valuer:
inspection_vm_consistent
z%HAInspection.inspection_vm_consistentc
            get the host and share storage heartbeat status
        FTz
cha node-list 2>/dev/nullr0
z?inspection_ha.py, hostname is null when get host heartbeat infoz
cha node-status %s 2>/dev/nullz
Host:
CONNECTZ
host_network_statusz
storage name:r
STORAGE_NORMAL)
splitlinesr
check_host_heartbeatZ
check_storage_heartbeatr
heartbeatsr
hostheart_statusZ
heartbeat_fail_numr8
storage_nameZ
storage_statusr
 inspection_host_heartbeat_statusB
z-HAInspection.inspection_host_heartbeat_statusc
qTq&W
	d	|
20041z
/etc/cvk/cha.confr$
mon_frontend_server_port
z$failed to read /etc/cvk/cha.conf, %szScat /etc/cvk/casmon.conf | grep pds_report_cycle | awk '{ print $3}' | tr -cd [0-9]Tr0
vswitch0zI/bin/bash /opt/bin/ovs_bridge.sh get %s --linux bridge | awk '{print$NF}'z
/root/.ssh/mhost
"/bin/bash /opt/bin/ms_info.sh role
1z9timeout %s tcpdump tcp and port %s -i lo -c 1 2>/dev/nullz9timeout %s tcpdump tcp and port %s -i %s -c 1 2>/dev/nullz
echo "length" 2>/dev/null
lengthF)
	readlinesr
check_outputrW
server_portr-
liner.
get_cycle_cmd
outputZ
report_cycleZ
bridgeZ
get_vswitch_cmd
get_cvmrole_cmdr
%check_casmon_wheather_send_perfomancen
z2HAInspection.check_casmon_wheather_send_perfomancec
rTd'}
))zG
            get cvk_ha, cvm_ha, cas_mon process health status
        Nr
/proc/%d/statusz!inspection_ha.py, %s is not existr$
State:Z
sleeping
runningz
VmRSS:r|
Threads:z
failed to read %s, %sz
/proc/meminfoz1inspection_ha.py, /proc/meminfo file is not existz	MemTotal:
zUinspection_ha.py, get process %s process_cpu_percent or process_memory_percent failedz8ps aux | grep -w /usr/sbin/%s | grep -v grep 2>/dev/nullTr0
inspection_ha.py, cmd %s failedrn
cas_monFz$did not send performance information
/etc/cvk/cvm_info.conf
5inspection_ha.py, /etc/cvk/cvm_info.conf is not exist
addressr
.ssh %s "service casserver status" 2>/dev/null 
casserver process is not exist
)failed to read /etc/cvk/cvm_info.conf, %s)
RESULT_CODE_FAULTr
floatr
process_memoryZ
memory_totalr8
process_cpu_percentZ
process_memory_percentZ
process_num_threadr?
	file_namer-
cpu_info
cvm_ip
casserver_statusr
inspection_primary_process
z'HAInspection.inspection_primary_processc
            determine wheather the patition utilization rate is beyond the threshold
            args:
                util: the partition utilization rate
                check_id: the checking item id
                target_name: the partition name
                hostname: the host name
                level: the health level
        
N)	r~
HEALTH_LEVEL_WARNr
utilr5
inspection_check_partion_util
z*HAInspection.inspection_check_partion_utilc
            determine wheather the share storage utilization rate is bybond the threshold
            args:
                util: the share storage utilization rate
                path: the share storage path
                hostname: the host name
                level: the health level
        
ocfs2_namer
inspection_check_ocfs2_util
z(HAInspection.inspection_check_ocfs2_utilc
}	|	
r2t	|
            determine wheather the rbd share storage utilization rate is bybond the threshold
            args:
                hostname: the host name
                level: the health level
        z!virsh pool-dumpxml %s 2>/dev/nullTr0
source/namezFcat /vms/.ms_backup/rbd-client/installed.txt | awk -F ' ' '{print $1}'
onestorZ
metadatapoolz;python /opt/bin/get_conf_for_rbd_by_pool.pyc %s 2>/dev/nullz(/opt/bin/util_ceph_pool_stat.sh %s %s %sz"/opt/bin/util_ceph_pool_stat.sh %s
capacityZ	max_availr
catch exception: %sN)
fromstring
find
text
eval
roundr
	pool_namer,
cmdstr_virshZ
xmlstr
rootZ
datapoolZ
rbd_typeZ
metapoolZ
cmdstr_confZ	conf_fileZ
cmdstrZ
cap_infoZ
cap_dictr
Z	availabler
inspection_check_rbd_util&
z&HAInspection.inspection_check_rbd_utilc
r"t	
            checking the /, /vms, /var/log/, share storage patition utilization rate
        z'timeout -k 1s 5s df -BM -TP 2>/dev/nullTr0
extr
/var/logz
/vmsZ
ocfs2z&virsh pool-list --type rbd 2>/dev/nullr
)	rk
partionsZ
partionZ
partion_typeZ
partion_mountr
poolsZ
poolr
inspection_partion_utilV
z$HAInspection.inspection_partion_utilc
}	|	r
            determine wheather the cas_mon send performance info
        Nr
cas_mon process is not existr
check_host_performance)
inspection_host_performancer
z(HAInspection.inspection_host_performancec
rN|	rNt
qN|	}
             determine wheather freeze vms on host
        Nr
z>python /opt/bin/cas_ocfs_fault_unfreeze.pyc --host 2>/dev/nullTr0
flagr6
Z	freeze_vm)
findallZ
attribr
freeze_vmsr
vmsr
vm_flagZ
vm_namer.
inspection_freeze_vm
z!HAInspection.inspection_freeze_vmN)
ALL_HEALTH_LEVELr
classmethodrl
j	d	
        get ha inspection info via threading
    Fr
target
argsr
cvm_ha)
cvk_haN)
	threading
Threadr`
startr
join)
master_cvmZ
thread_check_performancer
thread_check_consistentZ
thread_check_cvmhaZ
thread_check_monZ
thread_check_cvkhar
get_inspection_info
        analysis the script parameters of id and level
    z#ha inspection script configuration.)
descriptionz
--ida	
4000:host heartbeat, 4001:storage heartbeat, 4002:host performance check,             4003:primary process check, 4004:vm consistent check, 4005:root partition check, 4006:log partition check, 4007:vms partition check, 4008:share storage check, 4009:freeze vm check)
helpz
--level)
0x1Z
0x2Z
0x3Z
0x4Z
0x5Z
0x6r	
zo0x1:normal, 0x2:warn, 0x3:warn and normal, 0x4:fault, 0x5: normal and fault,  0x6:warn and fault, 0x7:all level)
choicesr
z/inspection_ha.py script level parameter is null)
argparse
ArgumentParser
add_argument
parse_args
idr`
get_cpu_memory_inspection_infor
argvZ	topParserr
main
__main__Z
inspection_haZ
cas_ha)6r^
	itertoolsr
stringr
util_cvk_logZ	xml.etreer
inspection_cpu_memoryrK
DEFAULT_HEALTH_LEVELra
CHECK_ALL_HEARTBEATZ
CHECK_HOST_HEARTBEATZ
CHECK_STROAGE_HEARTBEATr
cas_log_init2r*
cas_log_init
sysr
<module>
