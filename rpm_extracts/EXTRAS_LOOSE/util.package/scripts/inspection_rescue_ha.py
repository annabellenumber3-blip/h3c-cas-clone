# File: inspection_rescue_ha.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/util.package/scripts/inspection_rescue_ha.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

d d!
d"d#
Z d$d%
Z!d&d'
Z"d(d)
Z#e$d*k
e%d+d,
e(d+
Z'['n
Z'['0
e#e)j*d	d
,d-e'
Z'['n
Z'['0
############################################################################
#    File Name: cha_clean_repeat_vm.py
# Date Created: 2018-01-10
#       Author: zhouyanchun
#  Description: backup undefine vm xml and undefine the repeat vm
#-----------------------------------------------------------------------------
#  Modification History
#  DATE        NAME             DESCRIPTION
##############################################################################
HATools)
gmtime)
ElementTreez
/etc/cvm/ha_backup/)
cvk_haZ
cvm_haZ
cas_mon
        query the host of the vm in the database
        args:
            vmname: the query vm name
        return:
            the host name
    zSselect NAME from TBL_DOMAIN A, TBL_HOST B where DOMAIN_NAME="%s" and A.HOST_ID=B.IDr
fetch_data_from_database
append)
vmname
hostname
results
result
inspection_rescue_ha.py
find_vm_host_in_database!
        find host ip address in database by cvkname
        args:
            cvkname: the host name
        return:
            the cluster id and host ip address
    
z6select IPADDR,CLUSTER_ID from TBL_HOST where NAME="%s"r
cvkname
hostip
	clusteridr
find_host_info_in_database1
}	~	W
}	~	0
        use libvirt api to undefine vm
        args:
            hostip: the host ip address
            vmname: the vm name
    r
qemu+ssh://%s/systemz@inspection_rescure_ha.py, open libvirt qemu connection faild, %sr
Nz<inspection_rescure_ha.py, undefine domain name %s failed, %s)
get_ip_version
startswithZ
open_libvirt_connect
logging
error
RESCUE_RESULT_CODE_FAILZ
lookupByName
state
print
VM_NOSTATE
VM_SHUTDOWN
VM_SHUTOFFZ
destroyZ
hasManagedSaveImageZ
managedSaveRemoveZ
listAllSnapshots
deleteZ
undefine
RESCUE_RESULT_CODE_SUCCESSZ
close_libvirt_connect
	Exception)
urlZ
conn
domainr"
flagZ	snapshotsZ
snapshot
undefine_vm_by_libvirtC
        delete repeat vm from host and backup vm xml in /etc/cvm/ha/backup before undefine the vm
        args:
             vmname: the vm name willed be deleted
             vmhostname: the host name that vm is on in database
             cvknames: the host name that repeated vm is exist
    
,z+cha_clean_repeat_vm.py create %s failed, %sNzIcp -r /etc/cvm/ha/%s/%s/%s.xml %s/%s_%04d%02d%02d%02d%02d%02d_deleted.xmlT
shell)
splitr
path
exists
BACKUP_VM_DIR
makedirsr)
tm_year
tm_mon
tm_mday
tm_hour
tm_min
tm_secr
execute_commandr.
vmhostname
cvknamesZ
cvknames_listr
cmdr
delete_vm_from_hosti
        clean repeated vms from host
        args:
            repeatvms: repeatvm string format is vmname:cvknode1,cvknode2;vm_name1:cvknode3,cvknode4
    
lenr
Z	repeatvmsZ
repeatvms_listZ
repeatvmZ
vminfor
clean_repeat_vm
        fix the abnormal process
        args:
            processname: the abnormal process name
    r
timeout 30 service %s restartTr0
z inspection_rescue_ha.py, cmd: %sz
timeout 30 service %s start
z9inspection_rescue_ha.py, failed to fix %s process(pid %d)N)	r
read_process_pidr>
stripr
debugr 
processname
pidrA
new_pidr
fix_abnormal_process
rtd	}
        find garbages in the partition by filtering cmd
        args:
             cmd: the garbage files filtering cmd
    Tr0
0Z	kexec_cmd
/vms/crash/
file
link
otherz#<file size='%s' type='%s'>%s</file>N)
splitlinesr2
isdir
isfile
islinkr#
garbagesZ
garbageZ
garbage_list
	file_path
	file_sizeZ	file_typer
find_partition_garbage
Nz-<?xml version="1.0" encoding="utf-8"?>
<data>za-name '*.iso' -o -name '*.tar*' -o -name '*.zip' -o -name '*.rar' -o -name '*.7z' -o -name '*.gz'
4005z%find /tmp \( %s  \) | xargs -r  du -hz$find /root \( %s \) | xargs -r du -h
4006zMfind /var/log ! -type d -name '*.gz' | xargs -r du -h | sort -h -r | head -20
4007z
/vms/.ms_backup/rbd-client/z
/vms/crashz du -ah --max-depth=1 /vms/crash/ztfind /vms/ \( %s \) -size +10240000c | grep -E -v 'ONEStor|onestore|virtio|castools' | grep -v '%s' | xargs -r du -hz
</data>)
checkidZ
compresspackagerA
rbd_pkg_pathr
query_partition_garbage
        delete garbage file chosed by user, if remove file failed, print the failed file info
        args:
            delete_files: the files waited to be deleted
    r
z!inspection_rescue_ha.py remove %sz,inspection_rescue_ha.py delete %s failed, %sNz!<remove_failed>%s</remove_failed>z6<?xml version="1.0" encoding="utf-8"?>
<data>%s</data>)
removedirs
remover
infor)
delete_filesr
filses_listrV
delete_partition_files
 print rescue result
        args: id: id
              component_type: component_type
              name: component_name
              target-name: target-name
              info : info
              result: result, "1" for fail, "0" for success
    z
<item><id>%s</id><component-type>%s</component-type><component-name>%s</component-name><target-name>%s</target-name><info>%s</info><result>%s</result></item>z
result: %sN)
component_type
nameZ
target_namer_
xmlr
rescue_result
z0 run rescue
        args: param: xml string
    ra
component-typez
component-namez
target-namer_
4003NZ
4004z;inspection_rescue_ha.py script --param parameter is illegal)
fromstring
tagrH
text
PRIMARY_PROCESSrK
strrF
param
root
childZ
subChildre
id_strZ
type_strZ
name_strZ
target_strZ
info_strr
rescue_run	
        rescue show and delete partition 
        args: id: rescue id
              param: rescue param
    rY
queryzCinspection_rescue_ha.py script --id or --param parameter is illegalN)
rescue_delete_partition_run1
    analysis the script parameters of vm_info
    z4delete the repeat vm and backup it before delete it.)
descriptionz
--idz
Rescue ids)
helpz
--parama
Input parameter is xml of inspection_ha which need to be fixed.                                                  OR, 4005,4006,4007: if query the garbage files, use param:     ,                                                  if delete files, use param format: file_path, file1_pathN)
argparse
ArgumentParser
add_argument
parse_argsra
argvZ	topParser
argsr
main?
__main__
inspection_haZ
cas_haz
inspection_rescue_ha.py %s)-
__doc__ry
timer
util_cvk_logrq
Z	xml.etreer
VM_RUNNINGZ
VM_BLOCKEDZ	VM_PAUSEDr%
VM_CRASHEDZ
VM_PMSUSPENDEDr!
__name__Z
cas_log_init2r)
cas_log_init
sysru
<module>
