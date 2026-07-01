# File: ocfs2_tunefs_size.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/storage-admin.package/scripts/ocfs2_tunefs_size.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

m	Z	
zde!d d!
j"d"d#
Z#e#j$d$d%d&
e#j$d'd(d)d*d+
e#j$d,d-d.d/d0d1
e#j$d2d3d.d/d4d1
e#j$d5d6d.d/d7d1
%d8e
j&d9d
e(j)
e(j*
,e-d;
e(j.
Z/e0e/
d<e/v
+d=e(j.
,e-d;
e(j1d
e(j*
rJe(j2
Z e d
+d>e(j.e f
e/d?
Z3Z4e3
d@e/d?
j6e5dAdB
8dCe/d?
e(j.e/d<
8dDe(j.e f
e0e(j1
,e-d;
e/e(j1e(j*e(j)
Z9e9d
+dFe(j.e9d
,e9d
e(j)
sRe9d9
e(j.e:
8dGe(j.e f
Z<[<nTd
Z<[<0
,e-d;
Z>[>n
Z>[>0
ElementTree)
/dev/disk/by-path/z
/dev/disk/by-id/dm-name-z
/etc/libvirt/storage/%s.xmlz
^CVK[A-Za-z0-9]{32}$c
z<fdisk -l %s 2>/dev/null | grep "Disk\ %s" | awk '{print $5}'T
shell)
subprocess
check_output
strip
BaseException
logging
error)
device_path
capacity
result
ocfs2_tunefs_size.py
get_path_capacity3
./naa
./capacity
./path
namez&iSCSI lun has no path, input is wrong.
path
lunsr
realcapz
get iSCSI lun failed!z
get iSCSI lun: %s)
find
text
findall
append
	DISK_PATH
lenr
DEVICE_MULTIPATHr
	traceback
format_exc
debug)
lun_node
lun_dict
lun_list
naa_node
lun_naa
capacity_node
lun_capacity
	lun_pathsZ
lun_pathZ
lun_name
lengthr
get_iscsi_pathJ
z(t	
wwnz1/opt/bin/fc_san_get_disk_path_by_naa_wwn.sh %s %sTr
z4ls /dev/disk/by-path/pci*-fc-* | grep -v part[0-9]*$z#/lib/udev/scsi_id --whitelist -u %sz
get lun %s has naa %sz
get naa of %s failed.z#FC lun has no path, input is wrong.r
get FC lun failed!z
get FC lun: %s)
util_cmds_outputr$
warningr
wwn_noder3
fc_lunsr
get_fc_path
}	|	d
r(|	D
Nz1Configure file of storage pool %s does not exist.
typeZ
Storage pool %s is not fs type.z
./source/format
ocfs2z"Storage pool %s is not ocfs2 type.z
./target/path
mount_pointz
./source/devicer
./source/lun_infor
z"get information of pool %s failed!z
information of pool %s: %s)
DEFINE_PATH
existsr
parse
getrootr!
	pool_name
	pool_infoZ
lun_info_listZ
xml_file
treeZ
poolZ
source_foramtr8
deviceZ
lun_info_nodesr)
get_ocfs2_pool_lun_info
)	NF
Tz path %s is CVK LVM, and VG is %s)
splitr$
match
CVK_VGr
vg_name
listr
path_is_lvm
}	|	t
}	|	t
tune device %s size normally.r
*Path is LVM, firstly use pvresize command.r
pvresize %sr
do pvresize %s successfully.z*lun %s has been expanded %d, less than 10G
lvextend -l +100%%FREE %sz<All luns have been expanded less than 10G, no need to tunefs
OCFS2_TUNE_SIZE_FAILED
*Path is normal, directly do tunefs commandrF
.There are many LUNs, maybe parameter is wrong.
OCFS2_ERR_WRONG_PARAM
tunefs.ocfs2 -S %s
successfully tunefs %s.)
MINI_EXTEND_SIZEr
check_callr(
ocfs2_errorr$
flag
is_lvm
org_vgr+
xmlcapr
extend_sizer
tunefs_by_enlarge_luns"
tune device %s size by force.r
result of pvresize %s is %d.rS
result of lvextend %s is %d.rU
callr(
)	r@
ret_noreturnr
force_tunefs_by_enlarge_lunsb
)$NFr
z-Get VG name failed, maybe parameter is wrong.rW
z$current session before process is %sz$get device list failed with errno %dz+get device list failed, logout new session.rF
OCFS2_SUCCESSz
One or more have sub-parts.Z
OCFS2_LUN_MERGE_FAILEDz,new luns have sub-parts, logout new session.z4All new devices %s have no pvs, can directly create.z*device %s has already in VG (%s), continuez"device %s has VG (%s), must removeTz.devices %s must be remove lvm information: %s.z<new luns have different LVM information, logout new session.rT
pvcreate %sr
vgextend %s %s
!lvchange --refresh %s 2>/dev/null
Result of lvchange %s is %dz&Clean up lvm information successfully.z.Clean up lvm information failed with errno %d.z/logout new session after clean lvm information.z
vgreduce %s %sz
Result of vgreduce %s %s is %dz
Cancel multipath of %s.zKcurrent session after process is %s, and the new session will be logged out)
get_current_sessionr(
get_dev_list_from_xmlr$
g_dev_list
	ExceptionZ
check_disk_sub_partsZ
get_devlist_pv_info
keys
infor4
joinrc
remove_lun_lvmr
cancel_all_multipathZ
logout_session_when_failed)
xmlstrZ
is_tuneZ	is_removeZ
session_beforeZ
session_afterZ
need_removeZ
vg_backrM
xml_noder^
devlist_pv_dictZ
pv_listZ
pvrB
tunefs_by_add_luns
file %s dose not exist.
OCFS2_REFRESH_LUN_FAILEDz
virsh pool-define %sTr
z3define pool %s failed with errno %d, copy the file.
/tmp/%s_bak.xmlz5virsh pool-info %s | grep ^State: | awk '{print $NF}'Z
runningz
virsh pool-refresh %sz:storage pool %s is running, and result of refreshing is %dz0storage pool %s is inactive, no need to refresh.)
shutil
copy
remover
def_filer
xml_path
backup_pathr
define_and_refresh_pool
qDqTqDd
z%change lun %s capacity from %d to %d.
/tmp/%s_tmp.xmlr
write pool %s xml failed)
read_xmlr>
	write_xmlr
rootZ	lun_nodesr*
noder,
xml_naar`
new_pathr
change_lun_capacity_into_xml@
}	t	|
./lun_infoz
./sourcerw
extendr{
xmlnoderM
new_lunsZ
source_noder}
add_lun_info_into_xmlr
__main__r7
caslog/storage-adminz
online to tune OCFS2 size)
descriptionr?
Storage pool name)
helpz
-dz	--devicesrm
z"new device path list in xml format)
destr
--remove
store_trueFz
remove LVM information)
action
defaultr
--tunez]if tune is false, does not tunefs, just login session or setup multipath and refresh xmlfile.z
--forcez
force to tunefsz
input parameters: %srF
z.Option -r and -t can not use on the same time.rW
parse storage pool %s failed.zBdo (force) tunefs_by_enlarge_luns on pool %s failed, errono is %d.r
z-result of changing pool %s lun capacity is %dz
xmlstr is empty, para is wrong.z6do tunefs_by_add_luns on pool %s failed, errono is %d.z'result of adding lun into pool %s is %d)@
sysr;
argparser
Z	xml.etreer
util_cvk_logZ
util_xml_commonZ
util_common_toolsZ
util_sh_error_code_loaderZ
ocfs2_iscsi_lvm_setuprZ
__name__rM
cas_log_init3
ArgumentParser
parser
add_argumentr(
argv
parse_args
argsrs
tuner
exitr\
Z	pool_dictr$
forcer^
new_node
SystemExitZ
betr'
<module>
