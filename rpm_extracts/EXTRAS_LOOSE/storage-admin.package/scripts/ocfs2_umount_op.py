# File: ocfs2_umount_op.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/storage-admin.package/scripts/ocfs2_umount_op.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

Z!d d!
Z"d"d#
Z#d$Z$d%d&
Z%d'd(
d)d*
z	127.0.0.1i
/sys/kernel/config/clusterz
pidof /usr/sbin/libvirtdZ
shutdownZ
destroyzvps -ef | grep '/usr/bin/kvm' | grep -v grep | grep 'file=%s/' | awk -F 'guest=' '{print $2}' | awk -F ',' '{print $1}'z-grep -w ocfs2 /proc/mounts | grep -w ^/dev/%sz(grep -w ocfs2 /proc/mounts | grep -w ^%sz=blkid -t UUID=%s | grep '^/dev/CVK' | awk -F ':' '{print $1}'zAblkid -t UUID=%s | grep '^/dev/mapper/' | awk -F ':' '{print $1}'z
cha -k ocfs2-pool-fault %s 1c
shellz successfully to call command: %s
failed to call command: %s, %s
call command: %s, output = %sz1format maybe wrong, call command: %s, output = %s)
subprocess
check_output
logging
warning
strip
split
error
time
sleep
BaseException)
ha_command
counts
outputZ
out_list
errno
ocfs2_umount_op.py
cha_check_pool_command>
z#cha -k ocfs2-pool-fault %s 1, rc=%dz*pool name is NULL, cha -k ocfs2-pool-fault)
CHA_CHECK_POOLSTATE_CMDr
Z	pool_namer
cha_check_poolstate_notifyh
r"zPt
fuser -m %sTr
fuser -mk %sz
Kill pid %s with fuser %s,%dz
Libvirtd %s have used %s!r
LIBVIRTD_PID_CMDr
findr
callr
mount_pointZ	proc_busyr
killZ
libvirtd_pidZ
proc_busy_strZ
betr
fuser_process_handle
Fz!Pid %s is open the mount point %sz
ps %sz
Pid %s info %sz
cat /proc/%s/stackz
Pid %s stack: %s)	r
cmd_resultZ
ps_list
pidZ
ps_infoZ
stack_infoZ
pfir+
open_fds_processes_query
dm-Fr	
z0multipathd -k'disablequeueing multipath /dev/%s'z
disable queueing mpath %s,%sz'Exception, disablequeueing multipath %s
startswith
util_cmds_outputr
	Exceptionr
pathname
result
multipath_disablequeueing
z0multipathd -k'restorequeueing multipath /dev/%s'z
restore queueing mpath %s,%sz'Exception, restorequeueing multipath %sr0
multipath_restorequeueing
/run/libvirt/qemu/%s.pid
rz vm %s or pid file does not exist)
path
isfile
open
readliner
closer
vm_namer-
pid_file
pid_infor+
get_vm_pid
)	NTz
lsof -p %d | grep %sr
z#process %d does not open file in %sFz process %d is opening file in %s
ranger
debugr
dirZ
user6
process_use_mount_point
vm_names = %s mount_point = %sr
z#VM %s/[%d] is still using %s, do %sz
virsh %s %s &Tr
%s %s with rtn %sr	
VM_QUERY_CMDr
OCFS2_WAIT_FLAGr
optypeZ
vm_namesZ
vm_pidr*
vm_stop_mount_point 
z virsh pool-shutdown %s --%s 2>&1c
z	output:%srD
CalledProcessErrorr
returncode)
Z	run_timesr
countZ
contentZ
stfr
run_pool_shutdown_cmdD
z-umount thread starting, device is %s uuid:%s.z
device name is invaildZ
OCFS2_UMOUNT_FAILEDz
device uuid is invaild.z
{0}-{1}-{2}-{3}-{4}r
device mapper %s uuid %s.r
Real path of %s is %s.z
/dev/z
device %s is mounted on %s.z
device mountpoint is invaild.z
Get disk info failed, %sr	
/z1Get device or storage pool name failed, [%s, %s].z
device %s mountpoint %s
forcez+virsh pool-shutdown %s with force return %dr
starting umount -f %sz
umount -f /dev/%sTr
umount -f %s with return %dz
umount -l /dev/%sz
umount -l %s with return %dz
umount -l %s with %d failed
exceptz,virsh pool-shutdown %s with except return %dZ
OCFS2_SUCCESS)"r
ocfs2_errorr2
OCFS2_MOUNT_LIST_CMD
lower
format
LVM_MAP_QUERY1_CMD
LVM_MAP_QUERY2_CMDr<
realpathrF
OCFS2_LVM_MOUNT_LIST_CMDr
VIRSH_POOL_SHUTDOWN_CMDrK
VM_OP_SHUTDOWN
VM_OP_DESTROYr,
nameZ
dev_nameZ
dev_uuidZ
mount_listZ
format_uuidZ
devmapper_nameZ	real_name
lineZ	disk_infoZ
dev_infor(
poolZ
shutdown_force_retZ
msg_to_ha_timesZ
umount_rtnZ
execute_countr
umount_dev`
OCFS2_Listenerc
OCFS2: Failed to bind port %d)
	threading
Thread
__init__
port
recvsock
socketZ
AF_INETZ
SOCK_DGRAMZ
setsockoptZ
SOL_SOCKETZ
SO_REUSEADDRZ
bindr
exit)
selfZ
hostipaddrri
OCFS2_Listener.__init__c
Nz#OCFS2:Socket recvfrom data invalid!z&Recvfrom umounting notifcation info %r
ocfs2: type %d, lenth %d,r	
z!ocfs2: type %d, lenth %d, name %sz
OCFS2: Failed to recvfrom pktrD
recvfrom
OCFS2_BUFSIZEr
OCFS2_MSG_HDR_LENr
info
unpack
OCFS2_MSG_TAGr
thread
start_new_threadrd
Z	recv_dataZ
addrZ
msg_hdr_infoZ
msg_data_devr
OCFS2_Listener.runN)
__name__
__module__
__qualname__rh
))r<
stringr
structZ
util_sh_error_code_loaderZ
util_cvk_logZ
util_common_toolsrt
OCFS2_LOCALZ
OCFS2_PORTrK
OCFS2_HB_PATHr%
<module>
