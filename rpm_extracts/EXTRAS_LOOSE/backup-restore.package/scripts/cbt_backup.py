# File: cbt_backup.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/backup-restore.package/scripts/cbt_backup.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

l	Z	d
Z#e$d!k
r~e%e
Z'e(d"d#
Z*d%e*k
rBe'd&k
j&d'
j&d(
j&d)
j&d*
j&d+
j&d,
Z0e-d
d&e'k
1d-e*e+e,e-e.e/e0f
e"e+e,e-e.e2e/
Z3n\e-d
r0d.e'k
j&d&
1d/e*e+e,e-e.e/e0e4f
e"e+e,e-e.e2e/
e0e4
n<d0e*k
d*e'k
j&d'
j&d(
j&d)
1d1e*e+e,e4f
e!e+e,d
Z6e6
d2e*k
d*e'k
j&d'
j&d(
j&d)
1d3e*e+e,e0f
e"e+e,d
Z3e3
nve*e)v
rxe'd)k
j&d'
j&d(
1d4e*e+e,f
e!e+e,
Z9e'd)k
j&d)d
Z9e6
:e*e9
pprintN)
ElementTree)
casbackup_vmZ
casbackup_diskz
qemu:///systemz
/etc/libvirt/qemu/
%s_%s_mainz
%s_%s_back)
VM_BTP_PRE
DISK_BTP_PRE)
is_vmZ
is_main
suffixZ
bitmap_prefix
cbt_backup.py
generate_bitmap_name5
Bitmap_InfoFc
name
	is_active)
selfr
__init__?
Bitmap_Info.__init__N)
__name__
__module__
__qualname__r
Vm_Disk_InfoNc
img_file
target_file
device_name
btp_list
bitmap_all
is_backup_running
virtual_size
cluster_size)
Vm_Disk_Info.__init__c
qemu-img info %s --output=jsonT
shellz
virtual-sizez
cluster-size)
subprocessZ
check_output
json
loadsr
outputZ
jobjectr
get_image_infoO
Vm_Disk_Info.get_image_infoc
	TERABYTESr
max_disk_size
get_default_bitmap_granularityV
z+Vm_Disk_Info.get_default_bitmap_granularity)
NNN)
Init_Libvirtc
timer
opaquer
timeout_cbb
Init_Libvirt.timeout_cbc
g_exit
libvirtZ
virEventRunDefaultImpl
libvirt_threade
Init_Libvirt.libvirt_threadc
        The only other time it would be necessary to call virInitialize is if the
        application did not invoke virConnectOpen as its first API call, such
        as when calling virEventRegisterImpl() before setting up connections,
        or when using virSetErrorFunc() to alter error reporting of the first
        connection attempt
        i
targetz
init libvirt success)
virInitializeZ
virEventRegisterDefaultImplZ
virEventAddTimeoutr/
	threading
Threadr3
start
logging
info)
Z	thread_idr
init_libvirti
Init_Libvirt.init_libvirtN)
Make_Qmp_Cmdc
{"execute":"query-block"}r
query_blockz
Make_Qmp_Cmd.query_blockc
NzB{"execute":"block-check-bitmap-invalid","arguments":{"node":"%s"}}r
devicer
query_bitmap_valid~
Make_Qmp_Cmd.query_bitmap_validc
NzB{"execute":"block-clean-bitmap-invalid","arguments":{"node":"%s"}}r
clean_bitmap_valid
Make_Qmp_Cmd.clean_bitmap_validc
NzR{"execute":"block-dirty-bitmap-remove", "arguments": {"node":"%s", "name": "%s" }}r
bitmap_namer
remove_bitmap
Make_Qmp_Cmd.remove_bitmapc
block-job-cancel
executer>
force
	arguments)
dumps)
diskinfor&
diskrE
block_job_cancel
Make_Qmp_Cmd.block_job_cancelc
transactionrC
noder
persistent
granularity
block-dirty-bitmap-add
type
data
actionsrE
appendr$
dict_actionrQ
act1rP
add_bitmap
Make_Qmp_Cmd.add_bitmapc
full
sync
qcow2
format
speed
existing
mode
drive-backuprO
lenr
)	rG
limit_speedr&
disk_numrS
full_backup
Make_Qmp_Cmd.full_backupc
act2r
incr_full_backup
Make_Qmp_Cmd.incr_full_backupc
|	d	<
bitmapZ
incrementalrW
groupedz
completion-moderQ
propertiesrE
actrP
Z	group_pror
incr_backup
Make_Qmp_Cmd.incr_backupN)
staticmethodr<
d!d"
Vm_InfoNc
vm_namer_
backup_tmp_path
input_disksr
conn
domainrG
backup_disk
main_bitmap
back_bitmap
backup_allr
	diskinfosZ
backuptimer
Vm_Info.__init__c
closer2
__del__
Vm_Info.__del__c
vm: %s is activez
vm: %s is unactive)
open
LIBVIRT_URIrm
lookupByNamerj
VM_ACTIVE_STATEZ
isActiver
get_vm_status
Vm_Info.get_vm_statusc
%s/%sr
splitr_
Z	disk_listrH
filesr
parse_disk_infos&
Vm_Info.parse_disk_infosc
rPt	d
qlqXn
}	|	D
return
(qemuMonitorCommand return err, result=%s
inserted
file
dirty-bitmapsFr
7remove bitmap failed, img_file:%s, bitmap:%s, return:%s
-remove bitmap success, img_file:%s, bitmap:%s
!qemu-img bitmap dump %s | grep \#
qemu-img bitmap rm %s %sr!
7remove bitmap failed, img_file:%s, bitmap:%s, return:%d)
libvirt_qemu
qemuMonitorCommandrn
Cbt_Exception
BR_QEMU_MONITOR_COMMAND_ERRrG
'VIR_DOMAIN_QEMU_MONITOR_COMMAND_DEFAULTr8
warningr9
popen
	readlinesr|
call
BR_SUCCESSrt
result
re_json
objectrH
bitmap_objectZ
is_del
lines
line
resr
remove_cbt_bitmap/
Vm_Info.remove_cbt_bitmapc
rPt	d
qnqX|
active
statusTz$get device name faild, image file:%sz
qemu-img bitmap dump %s %sr!
query block info success)
rangera
BR_GET_DEVICE_NAME_ERRr#
btprH
query_block_infof
Vm_Info.query_block_infoc
rNt	d
qhqVn`|
}	|	
jreturnZ
jdevicerH
jbitmapr
query_block_info2
Vm_Info.query_block_info2c
qVq,t
%s%s.xmlz
./devices/diskrH
./driverrX
./sourcez
./target
devr
XML_PATHrj
parse
BACKUP_ALL_VMro
findallZ
attribrG
infileZ
qemuZ	file_pathZ
driverZ
sourceInfo
	file_nameZ
targetInfor
get_diskinfo
Vm_Info.get_diskinfoc
)	Nr
z&vm:%s, img_file:%s is dirty, result:%sz
bitmap is dirtyz
qemu-img bitmap check %sTr!
vm:%s, img_file:%s is dirty)
BR_BITMAP_STATE_ERRr#
res_jsonr
check_bitmap_valid
Vm_Info.check_bitmap_validc
qemu-img bitmap cleaninvalid %sTr!
Vm_Info.clean_bitmap_validc
NTz&Creating dirty bitmap '%s' for vm '%s'r
.add bitmap failed, vm:%s, bitmap:%s, return:%s
/add bitmap success, vm:%s, bitmap:%s, return:%sz*Creating dirty bitmap '%s' for disk '%s%s'
qemu-img bitmap mk %s %s %dr!
zBFailed to create dirty bitmap '%s' for disk '%s:%s', error_code=%d)
BR_OPERATE_BITMAP_ERRr
BR_QEMU_IMG_CMD_ERR)
bitmap_create_all
Vm_Info.bitmap_create_allc
        Remove specified bitmap in disk.
        Rasie exception if failed
        z
remove-bitmap qmp: %sr
debugr
check_call)
bitmap_do_remove
Vm_Info.bitmap_do_removeTc
Nz&Removing all backup bitmaps for backup)	r8
startswithr	
Z	vm_bitmapZ
disk_bitmaprH
bitmap_remove_all
Vm_Info.bitmap_remove_allc
main and back bitmap state err)	rG
main_bitmap_timesZ
back_bitmap_timesrH
get_using_and_idle_bitmap
z!Vm_Info.get_using_and_idle_bitmapc
check disk bitmap state success
libvirt error, errinfo: %s
"backup_vm_disk failed, errinfo: %s)
exitr
warn
err_coder1
libvirtError
error
BR_LIBVIRT_INTERFACE_ERR
	Exception
BR_EXCEPT_ERR)
errr
check_disk_bitmap_state6
Vm_Info.check_disk_bitmap_statec
bitmap-recreater
Invalid parametersr
bitmap-check
bitmap-remove-allz
Invalid bitmap op %sr
BR_PARA_ERRr
CalledProcessError
	exceptionr
op_argsr
handle_bitmap_opsI
Vm_Info.handle_bitmap_ops)
NNN)
	Backup_VMNr
}	~	n
}	~	0
}	~	nNd
}	~	0
}	~	n
}	~	0
"Backup_VM init failed, errinfo: %s)
backup_typer`
	Condition
cond
cmd_res
assign_num
is_stop_backupr
errcode
	popen_objr-
vmry
timeZ
lvtr
Backup_VM.__init__c
z.cancel block job failed, cmd = %s, result = %sz/cancel block job success, cmd = %s, result = %s)
cancel_cmdr
cancel_block_job
Backup_VM.cancel_block_jobc
Nz$vm is started when unactive backupedTz
vm is shutdown
failedz"vm is stopped when active backupedr
VIR_DOMAIN_EVENT_STARTEDr
BR_VM_STATUS_CHANGEr
killpg
getpgid
signal
SIGTERMZ
VIR_DOMAIN_EVENT_SHUTDOWNZ
VIR_DOMAIN_EVENT_STOPPEDZ
VIR_DOMAIN_EVENT_CRASHEDr
acquirer
notify
release)
eventZ
detailr.
domain_event_callback
Backup_VM.domain_event_callbackc
n"d	|
](}	|
j	|	
j	|	
callback details %s
BLOCK_JOB_COMPLETEDr>
offsetr
successz(event_callback return error, details: %s
BLOCK_JOB_CANCELLEDFr
secondsZ
microsZ
detailsZ
cbDataZ
details_jsonr
event_callback
Backup_VM.event_callbackc
do active backup cmd:%sr
z$qemuMonitorCommand failed, return=%sz
active backup success)
qemuMonitorEventRegisterr
waitr
qemuMonitorEventDeregister)
commandZ
completed_cbZ
cancelled_cbr
do_backup_command
Backup_VM.do_backup_commandc
)	Nr
is_exitrH
Backup_VM.remove_bitmapc
Backup_VM.add_bitmapc
vm status has changed
3qemu-img convert_sum %s %s -w %d -r 0 -t directsyncT
preexec_fn
&qemu-img cmd failed, cmd=%s, return=%dz
full backup success, cmd:%s)
Popenr
setsidr
unactive_full_backup
Backup_VM.unactive_full_backupc
)	Nr
z incr full backup success, cmd:%s)
unactive_incr_full_backup
z#Backup_VM.unactive_incr_full_backupc
z1qemu-img backup %s %s %s -w %d -r 0 -t directsyncTr
incr backup success, cmd:%sz
qemu-img bitmap clear %s %sr!
z&clear bitmap failed, cmd:%s, return:%dz,clear bitmap success, img_file:%s, bitmap:%s)
unactive_incr_backup)
Backup_VM.unactive_incr_backupc
Nz1qemu-img create -f qcow2 -o cluster_size=%d %s %dTr!
z,create backup file failed, cmd:%s, return:%dz"create backup file success, cmd:%s)
pre_create_backup_file?
z Backup_VM.pre_create_backup_filec
backup type=%s errorr
backup failed)
FULL_BACKUPr
INCR_FULL_BACKUPrc
INCR_BACKUPr
BR_BAKCUP_TYPE_ERRr
usingZ
idler
	do_backupM
Backup_VM.do_backupc
backup assignment is interuptedT)
signum
framer
signal_respondu
Backup_VM.signal_respondc
begin backup vm disksz
end backup vm disksr
SIGINTr
domainEventRegisterAnyrn
VIR_DOMAIN_EVENT_ID_LIFECYCLEr
domainEventDeregisterAnyr
life_idr
backup_vm_disk}
Backup_VM.backup_vm_diskc
r"t	
begin to cancel vm block jobz
block-job-cancel: cmd %sr
z$Backup_VM cancel failed, errinfo: %sT)
BR_CANCEN_FAILr
do_cancel_block_job
Backup_VM.do_cancel_block_job)
Nz$if you want to do backup, just like:zm     python cbt_backup.py backup vm_name backup_disk backup_type backup_tmp_path limited_speed diskinfos timez)     vm_name: just input vm name instead zc     backup_disk: it can be "0" or disk name(for example "vda"), if it is "0", means backup all vm zj     backup_type: it can be "0"/"10"/"11", 0:full backup, 10: increment full backup, 11: increment backup zD     backup_tmp_path: it is tmp path used for save tmp backup files z.     limited_speed: limit the speed of backup z+     diskinfos: like "/vms/vm.img:vm_1,..."z?     time: timestamp, it exists only when backup_type is not 0 z$if you want to do cancel, just like:z?     python cbt_backup.py cancel vm_name backup_disk disk_infosz-     vm_name and backup_disk is same as abovez#if you want to do query, just like:z3     python cbt_backup.py query vm_name backup_diskz@python cbt_backup.py bitmap_op vm_name backup_disk [bitmap_name]z
     bitmap-recreate:zd        Remove all bitmaps either vm or disk backup and recreate a new bitmap with name @bitmap_namez
     bitmap-check:z         Check if bitmap is validz
     bitmap-remove-all:z%        Remove all bitmaps for backup)
printr
usage
__main__
caslog/backup-restore)
backup
z|input paras: assign_type: %s, vm_name: %s, backup_disk: %s, backup_type:%s, backup_tmp_path:%s, limit_speed:%s, diskinfos:%s
input paras: assign_type: %s, vm_name: %s, backup_disk: %s, backup_type:%s, backup_tmp_path:%s, limit_speed:%s, diskinfos:%s, time:%s
queryz@input paras: assign_type:%s, vm_name:%s, backup_disk:%s, time:%s
cancelzHinput paras: assign_type: %s, vm_name: %s, backup_disk: %s, diskinfos:%sz7input paras: assign_type:%s, vm_name:%s, backup_disk:%s)
Z	xml.etreer
util_cvk_logZ
cbt_publicr0
Z	GIGABYTESr*
argvZ
arcZ
cas_log_init3Z
bitmap_opsZ
assign_typerj
intr
<module>
