# File: ocfs2_mount_check.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/storage-admin.package/scripts/ocfs2_mount_check.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

l	Z	d
Z&d!d"
Z'd#d$
Z(d%d&
Z)d'd(
Z*d)d*
Z+d+d,
Z,d-d.
Z-d/d0
Z.d1d2
Z/d3d4
Z0d5d6
Z1e2d7k
Z5e5d8k
j4d9
e5d;k
Z8e9d<d=
j4d9
j4d8
<d>e:
e e:
e8d;k
rte3e
rte8d
rDd?Z=e
j>e=d
@dAe?
e e:
e8d97
@dBe
eBdC
CdDe:
dEZ7nne
CdFe:
dGZ7nLe
CdHe
dIZ7n*e
CdJe:
dKZ7n
e!e:
ZDe7d
e3eD
eEdLdM
ZFeF
ZHeF
ZJe3eJ
rhdNZ7n\e%eJeD
r~dPZ7nFe'eJeD
dQZ7n0e*eJeDd
dRZ7n
e/e:eDeJ
dSZ7n
e.e;
dUZ7e7d
r e0
eKe:
ZLeL
CdVe:eLf
dWZ7W
ZN[NnFd
ZN[N0
ZN[Nn
ZN[N0
ElementTree)
^/dev/CVK[A-Za-z0-9]{32}z
/sys/kernel/config/clusterz
^/dev/disk/by-id/dm-name-c
)	Nr
Multipath scsi check:%sz%/lib/udev/scsi_id --whitelisted -u %sT
shellFz
device %s scsi_id %s is invalid
logging
warning
match
HEAD_MPATH_DEV
subprocess
check_output
decode
strip
endswith
error
BaseException)
dev_path
resultZ
get_scsi_cmdZ
scsi_id
ocfs2_mount_check.py
ocfs2_mpath_check<
)	Nr
get pool_xml return null.r
z Storage pool %s  does not exist.z
./target/pathz
Storage pool %s mountpoint %s.z/Mount point %s have some files, stopping mount.z-Storage pool %s was defined by older version.)
path
existsr
parse
find
textr	
isdir
listdirr
pool_xmlZ
treeZ
mntpathZ
dir_list
efir
ocfs2_mountpoint_checkY
get struuid return null.r
z&o2cb_ctl -I -o -t cluster 2>>/dev/nullTr
z)o2cb_ctl -I -o -t cluster output is empty
:z/Check regionpath dir, clustername %s strUUID %sz
%s/%s/heartbeat/%s
ps -aux | grep z
\[.*%s.*z)Kernel thread is running on region %s, %sz
/sbin/ocfs2_hb_ctl -K -u %sz.ocfs2_hb_ctl heartbeat region dir %s result %sz
rmdir %s result %s)
replace
upperr
splitr	
TOCFS2_PATHr
findall
call
rmdirr
struuidZ
strUUIDZ
strclsnameZ	strregdirZ
get_cluster_cmd
outputZ
uuid_prefix
thread_infoZ
re_exprZ
thread_namesZ
stop_heartbeat_cmdr
regionpath_dir_check
Multipathed:dmsetup ls %s %s-%s
z!dmsetup ls | grep %s 2>>/dev/nullTr
dmsetup remove %s 2>>/dev/nullz#Multipathed:dmsetup remove %s is %dz"lvchange -aly %s 2>>/dev/null 1>&2z"Multipathed:lvchange -aly %s is %dr
LVM2_CVK_DEVr+
debugr
devicesr
devmapsZ
vg_nameZ
dmsetup_cmdZ	lvm_exsitZ
lvm_cmdr
ocfs2_lvm_mpath_check
rPq4t
rlq4|
cluster.conf is none
heartbeat_modez6ignore heartbeat_mode section to compatible with 1.8.4z
cluster:
cluster
typer
node:
noder5
line len is little than 3r4
%s-%s=%s add into setz!Parse the content of the ocfs2 OK)
startswithr+
appendr
infor
cluster_conf_linesZ
cluster_conf
length
line
	info_listr#
ocfs2_cluster_conf_parse
blkid -s UUID %s 2>>/dev/nullTr
command blkid output is empty
device %s uuid is %s)	r
device
uuidZ
get_uuid_cmdr0
get_uuid 
d	}	|
|	d	k
Nz%debugfs.ocfs2 -R "hb" %s 2>>/dev/nullr
z!command debugfs.ocfs2 return none
0000000000000000r
FTr4
mounted nodes:%r)
util_cmds_outputr
time
sleepr7
mounted_nodesZ	startListZ
endListZ
mounted_nodes_get_cmdZ
start_linesZ
hblineZ	end_linesZ
endListElementr
startListElementr
mounted_nodes_get=
)	Nr;
find a node %s %s %s %s
name
number
ip_addressZ
ip_portzRFailed to find node %s = %s, wrong cluster.conf or mounted in another cluster(cvm))
	traceback
format_exc)
cluster_conf_local
value
dicr
find_node_info
z.Failed to find cluster dic, wrong cluster.conf)
find_cluster_info
)	NrP
z#ping6 -c 3 -W 1 %s 1>/dev/null 2>&1z"ping -c 3 -W 1 %s 1>/dev/null 2>&1Tr
localhost can not connect to %sFz,connection is valid between localhost and %s)
is_valid_ipv6r
resLock
acquire
releaser7
remoteNodeZ
connection_check_cmdr
connection_test
Nz6device uses disk lock, no need to check tcp connectionTrN
target
argsz8all connection is valid between localhost and remotehostF)
device_use_dlockrE
socket
gethostnamerW
ranger
	threading
Threadr^
start
joinr[
Z	localNameZ	localNode
nloops
threadsr<
ocfs2_cluster_connection_test
}	|	d
o2hb-%s
ps -ef | grep "\[%s\]"r
zKThis lun %s is not mounted in host %s, may be mounted in other cluster(cvm)F
zg"mount | grep type[[:space:]]ocfs2[[:space:]]|awk '{print \$1}'|xargs blkid -p| grep "%s" 2>>/dev/null"z3This lun %s have hb, but is not mounted in host %s.z3ls /sys/kernel/config/cluster/%s/heartbeat |grep %srN
z(cat /etc/ocfs2/cluster.conf 2>>/dev/nullz*host %s ocfs2 config file content is emptyz7cluster.conf dismatch host %s, node count is different.zFcluster.conf dismatch host %s, remote session %s is not in local file.z
cluster.conf match host %s)
UUIDr)
SSH_PARAMETERrI
Z	hb_thread
cmdLineZ
remote_hb_infoZ
remote_mounted_infoZ
cluster_dicZ
remote_hb_dir_infoZ
remote_conf_infoZ
cluster_conf_remoterV
conf_compare
Nz4device uses disk lock, no need to check cluster confTrO
z"cluster.conf match all remote hostF)
)	rS
ocfs2_cluster_conf_compareJ
o2cb_conf_lines is noner9
Line is empty or startswith #
z<filename(/etc/default/o2cb): line(%s), length is less than 2Z
O2CB_ENABLEDZ
O2CB_BOOTCLUSTERz(Ignore O2CB_ENABLED and O2CB_BOOTCLUSTER)
o2cb_conf_linesZ	o2cb_dictrA
o2cb_conf_parset
qLq W
/etc/cvk/user_info.confrv
permit_user_sshr
rootzGscp %s@[%s]:/etc/default/o2cb /etc/default/o2cb.remote 2>/dev/null 1>&2Tr
z"service o2cb stop 2>/dev/null 1>&2z
/etc/default/o2cb.remote
/etc/default/o2cbz$service o2cb online 2>/dev/null 1>&2z#service o2cb start 2>/dev/null 1>&2rp
open
	readlinesr+
check_call
renamerJ
remoteAddr
fdrA
params
user
cmdZ
rtnr#
change_o2cb_para
}	|	d
NFz3device uses disk lock, no need to compare o2cb paraTrO
rz#O2cb parameters on localhost is %s.z"cat /etc/default/o2cb 2>>/dev/nullr
z)host %s o2cb config file content is emptyz'O2cb parameters on remotehost %s is %s.z!o2cb parameters dismatch host %s.z
mount | grep -w ocfs2 | wc -lr
zXThere is no active ocfs2 pools on the host, we can change o2cb parameters automatically.z$change o2cb parameters successfully!z
change o2cb parameters failed!zYThere are %d active ocfs2 pools on the host, please inactive them and try to start again.z
o2cb parameters match host %s.)
closerx
operator
intr
node_numr
o2cb_conf_filerw
o2cb_conf_localrs
remote_o2cb_infoZ
o2cb_conf_remoter
retr#
o2cb_para_compare_with_remote
}	~	S
}	~	0
sourceZ
lun_infor
Pool need at least one lun.r
naaz
Lun has no naa, input is wrong.r
Lun %s is single path.z
Lun %s is multiple path.Z
wwnz'Parse the content of the ocfs2 pool OK.)
devices_listr
Z	lun_nodesZ
lun_nodeZ	lun_pathsZ
naa_noder
wwn_noder#
get_devices
/etc/multipath.conf
blacklist_exceptionsZ
wwidz
%r have enabled multipath.)
read_config_fileZ
get_unique_elementZ
get_multi_elementr
naa_listZ
configr
get_multipath_listI
z&Device %s should reset to single path.r
z(Device %s should reset to multiple path.z Get the rebuild devices list OK.)
multipath_naa_listZ
rebuild_listrE
get_rebuild_listj
/opt/binZ
FC_SAN_SHELL_SCRIPT_PATH
PATHz	:/opt/binr
fc_san_naa_hba_select.sh 1 
z%Succeed to reset devices single path.z3Failed to reset devices single path, error code %s.Fz
fc_san_naa_hba_select.sh 0 z'Succeed to reset devices multiple path.z5Failed to reset devices multiple path, error code %s.z#Not need to reset multipath option.)
environ
pool_xml_pathZ
pool_configr
singlepathZ	multipathr
ret_noreturnr#
check_multipath_configure
q^q6t
NzGecho 'stats' |debugfs.ocfs2 %s |grep 'Max Node Slots:'|awk {'print $4'}r
Failed to get max node slotsFz
The max slot num is %dz
There is %d mounted nodesz4There is not enough slots to mount, need %d, only %dr
z)Local host dic is %r, mounted_nodes is %rrO
z%Slot number %s has already been used.T)
)	rE
linesrA
max_slot_numZ
localhostnameZ	localhostr#
ocfs2_check_slot
r<d	t
}	|	
/etc/cvk/block_limits.confz,block_limits.conf does not exist, create it.Tr
z9content fo block_limits.conf is empty, should refresh it.r
z@content fo block_limits.conf is 0 or invalid, should refresh it.zPsg_vpd -p bl %s 2>/dev/null | grep "Maximum unmap LBA count" | awk '{print $NF}'z0fail to get Maximum unmap LBA count on device %sz.get Maximum unmap LBA count: %s from device %s
readliner
strr7
write)
refreshZ
pre_fileZ
first_line
count
eZ	unmap_cmdZ
lba_count_listZ
lba_strZ	lba_countZ
block_filer#
ocfs2_check_block_limits
NAMEzQ	 ocfs2_mount_check.py Check ocfs2 device mount condition and multipath configureZ
SYNOPSISz
	 $0 -h|device xmlZ
DESCRIPTIONz
	 -h Help and usagez
	 device ocfs2 device /dev/sd*z5	 xml ocfs2 pool xml file /etc/libvirt/storage/xx.xml)
printr
usage
__main__r4
-hr5
ocfs2z
caslog/storage-adminz%check ocfs2 device %s mount conditionz
udevadm settle 1>/dev/null 2>&1r
udevadm settle return %dz
check uuid %s try_fails %dz
Failed to get device uuidz8Verify %s, the mountpoint have to be an empty directory.ro
z=Warning! %s, the LUN assignments on this target have changed.
z=Verify UUID %s, fail to remove the residual heartbeat region.
zHVerify %s, dmsetup remove lvm dm unsuccessfully, while mounting lvm luns
/etc/ocfs2/cluster.confr
This node is mounted firstlyr(
z(Do fence scsi process for %s failed(%d).
mount check pass)P
sysr
stringrJ
Z	xml.etreer
util_common_toolsZ
util_cvk_logZ
ocfs2_multipathZ
sa_iscsi_commonZ
ocfs2_iscsi_commonZ
ocfs2_fence_scsi
RLockrY
__name__r
argvZ
exitr
Z	try_failsZ
cas_log_init3rE
udevadm_cmdr.
do_unfence_scsiZ
ret_fence_scsi
IOErrorr
<module>
