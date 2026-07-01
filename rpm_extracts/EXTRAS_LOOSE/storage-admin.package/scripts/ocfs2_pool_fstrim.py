# File: ocfs2_pool_fstrim.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/storage-admin.package/scripts/ocfs2_pool_fstrim.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

l	Z	d
r@z(e
anyc
shell)
subprocessZ
check_output
decode)
ocfs2_pool_fstrim.py
subprocess_check_output%
ocfs2_pool_fstrimc
OCFS2 Pool fstrim operation.T)
description
add_helpz
-sz	--storageFzxThe storage array type, it could be onestor, 3PARdata and any. One of them or some of them, sperated with ',' character.)
required
default
helpz
--poolz%The pool name which is to be ftrimed.z
--offsetz<The offset begin to trim, as unit with MB in 1024*1024 byte.z
--lengthz;The length to be trimed, as unit with MB in 1024*1024 byte.z
--blocklimitsz@The block limits for once trim, as unit with sector of 512 byte.z
-cz	--current
store_truez$Current host or the min number host.)
actionr
Parameters error
OCFS2_ERR_WRONG_PARAM
onestor
3PARdata)
argparse
ArgumentParser
add_argument
STORAGE_TYPE_ANY
parse_args
BaseException
logging
error
exit
ocfs2_errorZ
storageZ
storage_type
split
input_type_listZ
onestor_typeZ
t3par_typeZ
any_type
storage_list
pool
	pool_name
offset
lengthZ
blocklimits
block_limits
current)
self
parser
args
betr
__init__+
ocfs2_pool_fstrim.__init__c
z8o2cb_ctl -Iot node | grep -w %s | awk -F':' '{print $3}'z
get_smallest_node: node_num %dz
get_smallest_node: node_list %sz$get_smallest_node: smalllest_node %s
socketZ
gethostnamer
strip
node_numr
debugZ
mounted_nodes_get
sort
warning)
statusZ
local_host_nameZ
node_num_cmdr	
Z	node_listr
check_node_idS
ocfs2_pool_fstrim.check_node_idc
z%ls -l /dev/disk/by-path/ | grep -w %sz
fc-.+?-lunz
ip-.+?-iscsir
z(check_lun_type: fc_m is %s iscsi_m is %s)
compile
findall
lenr
typeZ
dev_path_cmdr	
dev_pathZ
fc_pZ
iscsi_pZ
fc_mZ
iscsi_m
efir
check_lun_typey
z ocfs2_pool_fstrim.check_lun_typec
)	Nr
z&ls -l /dev/disk/by-path/ | grep -w %s z(check_storage_type_by_tgt: tgt_id_cmd %sz$check_storage_type_by_tgt: tgt_id %sr
3pardatazGcheck_storage_type_by_tgt: tgt_id does not contain %s, do not do fstrimr1
is_getZ
tgt_id_cmdr	
tgt_id
type_tmpr
check_storage_type_by_tgt
z+ocfs2_pool_fstrim.check_storage_type_by_tgtc
zCsg_inq /dev/%s | grep -w 'Vendor identification' | awk '{print $3}'z'check_storage_type_by_sg: vender_cmd %sz(check_storage_type_by_sg: vender_info %sFzEcheck_storage_type_by_sg: type %s does not match %s, do not do fstrimr1
operator
vender_cmdr	
vender_infor
check_storage_type_by_sg
z*ocfs2_pool_fstrim.check_storage_type_by_sgc
Nz)The device %s, pool %s is to be fstrimed.i
zPsg_vpd -p bl %s 2>/dev/null | grep "Maximum unmap LBA count" | awk '{print $NF}'r
z0fail to get Maximum unmap LBA count on device %sz.get Maximum unmap LBA count: %s from device %sz
/etc/cvk/block_limits.conf
%sz@debugfs.ocfs2 -R "stats" %s | grep Clusters: | awk '{print $NF}'r1
z4Getting the clusters from dev %s failed with pool %si
fstrim -o %sM -l %sM %sTr
do fstrim cmd %s, with code %s)
util_cmds_outputrA
open
write
closer
call
infor
blZ	unmap_cmdZ
lba_count_listZ
lba_strZ
block_fileZ
csum
start
endZ
fstrim_cmdZ
rtnrC
execute_fstrim_cmd
z$ocfs2_pool_fstrim.execute_fstrim_cmdc
r>|	
Nz1do_fstrim: storage_type %s is not in storage_listz<grep -w ocfs2 /proc/mounts | awk '{printf "%s %s\n", $1,$2}'
do_fstrim: pools_info %sr
z'do_fstrim: local node did not have poolF
do_fstrim: dm %s , pool is %s
z pool name:%s, mount pool name:%sz)find the pool name:%s, mount pool name:%sz*do_fstrim: node_num %d is not the smallestzAThe input storage type is any, fstrim directly. Pool: %s dev: %s.zSmultipath -ll %s | grep -w 'active ready' | grep ' running' | awk '{print $(NF-4)}'z
do_fstrim: dev_list %sz The device %s should be checked.z<list the device %s failed, please have a check and ingnored.T)
	traceback
format_exc)
pools_info_cmdr	
pools_inforQ
can_dofstrimZ	pool_infoZ
dmr&
pool_infosZ
pool_lenZ
statrF
dev_list_cmdZ
dev_listr9
	do_fstrim
ocfs2_pool_fstrim.do_fstrimN)
__name__
__module__
__qualname__r0
__main__Z
ocfs2z
caslog/storage-adminr
OCFS2_SUCCESS)
stringr
timer
ocfs2_mount_checkr
cas_log_init3r6
argvr^
SystemExitZ
<module>
