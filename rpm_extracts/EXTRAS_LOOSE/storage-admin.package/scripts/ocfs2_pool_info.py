# File: ocfs2_pool_info.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/storage-admin.package/scripts/ocfs2_pool_info.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

!e"d
Z#e#d
q8e%e#
 d e#
d!e#
q8e&e
e'd"k
d!e#
q8e&e
r8e'd#k
r8e)d
sNe*e
d$e#
q4e	e*v
 d%e#
q4e*e	
d&e+
Z,e,d
 d(e+
d)Z-n
 d*e#
q4e*e
Z.e*e
Z/e*e
Z0e0D
Z1e1d
 d,e#
Z2e1d'
Z3e1d-
Z4e1d.
Z5e1d+
Z6e-d)k
d/e2e3e4e5f
d&e7
Z,e,d
 d(e+
d)Z8n
e-Z8e9e2d0
Z*e*d2
Z#e*e
s&e*e
 d3e#
Z0e0D
]hZ1e1d
 d,e#
qDe1d
Z2e1d'
Z3e1d-
Z4e9e2d0
!e"d5
Z;[;n
Z;[;0
!e"d
	pool_type
pool_format_typeZ
device_path
	multipath
lunZ
mount_point_target
__main__
ocfs2z
caslog/storage-adminz.show information of ocfs2 pool and iscsi pool.)
descriptionz
--ocfs2
store_trueTz1only show ocfs2 pool, this option is the default.)
action
default
helpz
--iscsiFz
only show iscsi poolz
--allz
show ocfs2 pool and iscsi poolz2virsh pool-list --all | awk '{if(NR>2){print $1}}'z
There is not any storage poolZ
OCFS2_SUCCESSz
All storage pools are %sz#Pool name is None or length is zeroz
Get pool %s info failedz"The type of pool %s does not found
iscsiZ
fsz5The pool %s has no iSCSI target lun, maybe is FC typez
The pool %s has no device pathz#/lib/udev/scsi_id --whitelist -u %s
get device:%s scsi_id failedZ
Unknownz
The pool %s san type failed
The pool %s lun error
z*/dev/disk/by-path/ip-%s:%s-iscsi-%s-lun-%s
 lun-
namez4The iscsi pool %s has no iSCSI target lun, ignore itz
 lun-X Z
OCFS2_POOL_QUERY_FAILED)=
argparseZ
util_cvk_logZ
util_sh_error_code_loaderZ
util_common_toolsZ
sa_pool_infoZ	POOL_TYPEZ
POOL_FORMAT_TYPEZ
DEVICE_PATHZ	MULTIPATHZ
LUNZ
MOUNT_POINT
__name__Z
ocfs2_pool_listZ
iscsi_pool_listZ
cas_log_init3
ArgumentParser
parser
add_argument
parse_args
argsZ
logging
debugr
allZ
show_ocfs2Z
show_iscsiZ
util_cmds_outputZ	pool_list
lenZ
warning
exitZ
ocfs2_errorZ	pool_name
stripZ
get_pool_infoZ	pool_infor
appendr
infoZ
dev_pathZ
dev_naaZ
naa_namer
mount_pointZ
lun_listr
ip_addrZ
ip_portZ
iscsi_targetZ	iscsi_lunZ
lun_storage_protocolZ
lun_pathZ
naa_name_new
print
BaseException
error
ocfs2_pool_info.py
<module>
