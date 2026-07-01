# File: util_cvm_umount.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/util.package/scripts/util_cvm_umount.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

/dev/disk/by-path/z
/etc/cvm_storage/z)/etc/cvm_storage/cvm_storage_template.xmlz	umount %sc
NAMEz'	 util_cvm_umount.py umount dir for cvmZ
SYNOPSISz
	$0 [ -h ]Z
DESCRIPTIONz
	 -h Help and usage)
print
util_cvm_umount.py
usage 
]|}	t
|	}	
)2Nr
The directory %s need to %s.z,Umount directory is not exist, please check.Z
UTIL_DIRECTORY_UMOUNT
remove
z2Remove directory number %d is wrong, please check.Z
UTIL_UMOUNT_CHECK_FAILEDzgCVM storage pool configure file is not exist, please check [/etc/cvm_storage/cvm_storage_template.xml].Z
UTIL_CONF_INFO_NOT_EXISTZ
poolz/There is no cvm storage pool exist in template.Fz*Find %d nodes in %s type cvm storage pool.
typez
./target/pathz8Find umount point %s exist in cvm storage pool template.Tz8cat /proc/mounts | awk '{print $2}' | grep ^%s$; echo $?
/z-Remove unnecessary '/' when query mount info.)
shell
Umount %s success.z3Umount %s failed with code %d, try to umount again.z
umount -l %szMTry to umount this bad mount point %s failed, please check and umount manual.
UTIL_UMOUNT_FAILEDzSDirectory %s is not mounted, but exists in cvm storage pool template, so delete it.zeDirectory %s is not mounted and not exists in cvm storage pool template, but front need to delete it.z
Check has wrong result %s.z*Find delete_node=%s exist in pool_node=%s.Z
deviceZ
iscsiZ
pathz
Cancel multipath for device %szGThere is something wrong when cancel multipath device %s, please check.Z
UTIL_REMOVE_MULTIPATH_FAILEDz
nvme-ofz
.//uuidz/Delete configure information of %s in xml file.z
utf-8)
encodingZ
xml_declarationz
rm -f %szJDelete empty cvm storage pool configure file failed. please delete manual.Z
UTIL_DEL_CONF_FAILEDz
rm empty directory %s)!
logging
warning
error
util_error
exists
CVM_STORAGE_XML
ElementTree
parse
getroot
list
iter
debug
find
text
subprocessZ
check_output
decode
strip
split
call
UMOUNT_CMDZ
cancel_multipathZ
nvmf_multipath_configr
write
CVM_STORAGE_DIR
rmdir
BaseException)
umount_point_list
operator
tree
rootZ
pool_nodes
umount_point
FlagZ
delete_nodeZ	pool_nodeZ	all_nodesZ
node
	path_nodeZ
dst_path
cmdZ
umount_point_copy
output
resultZ
device_noder
dm_pathZ
wwidZ
child_nodesZ
children
umount_handler6
Umount all cvm storage pools.z+There is no storage configure file, return.Z
UTIL_SUCCESS
targetr
z5Collect %d cvm template storage pools need to umount.Z
umountr
exitr
appendr
)	r0
Z	root_nodeZ
target_nodesZ
target_noder5
do_umount_handler
__main__Z
cvm_umountr	
UTIL_WRONG_PARAMz.Begin to umount all cvm template storage pool.z,End to umount all cvm template storage pool.r
) r<
	threadingZ
util_cvk_logZ
util_sh_error_code_loaderZ
util_common_toolsZ
util_cvm_lun_sessionZ
ocfs2_iscsi_lvm_setupZ
ocfs2_nvmf_pool_setupZ
DEVICE_PATHr+
__name__r0
cas_log_init2r
argvZ
arcr=
SystemExitZ
<module>
