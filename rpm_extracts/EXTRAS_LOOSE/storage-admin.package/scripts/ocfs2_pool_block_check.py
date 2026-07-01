# File: ocfs2_pool_block_check.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/storage-admin.package/scripts/ocfs2_pool_block_check.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

d!d"d#d$d%
 d&e
j!d	d
e#j$Z%e#j&Z'e#j&d
e#j&Z(d'Z%e(D
]NZ)e*e)
Z+e+d
sfe,e+
-d(e)
d)e)e/e.
e)e+e'
e#j&
d)e)e/e.
q@e+e
Z0e+e
 d,e)
Z.e4d-e0
Z5e5
-d.e)
Z.e6e0
Z7e7d	k
-d/e)
 d0e)
Z.e%
ste.e
d)e)e/e.
Z9[9n
Z9[90
/etc/libvirt/storage/z
/sys/kernel/debug/o2dlm
	pool_type
pool_format_typeZ
device_pathZ
mount_point_target
.xmlr
Get all storage pools: %s)
listdir
POOL_XML_PATH
path
isfile
join
endswith
rsplit
append
logging
debug
BaseException
error)
listZ	all_files
pool
nameZ
ocfs2_pool_block_check.py
get_all_storage_pools8
get dev_uuid return null.
%s/%s/dlm_state
Recovery Map:
Some nodes %s need to recover.)
get_dev_uuid
lenr
replace
upper
KERNEL_DEBUG_PATH
open
strip
startswith
split
closer
device
retZ
dev_uuidZ
dlm_domainZ
state_fileZ
handle
line
betr
is_dlm_recoveringU
z"The type of pool %s does not foundZ
ocfs2z
The pool %s is not ocfs2 typez-The pool %s has no device path or mount pointr
	POOL_TYPE
POOL_FORMAT_TYPEr
DEVICE_PATH
MOUNT_POINTr
info)
	pool_name
	pool_info
print_error_typer+
check_pool_validity{
	not ocfs2Z
incativeZ
activez
, busyz
, recovering)
STATE_NOT_OCFS2
STATE_INACTIVE
STATE_ACTIVE
STATE_BUSY_LOCK
STATE_NEED_RECO)
state
strr
pool_state_to_info
__main__z,<?xml version="1.0" encoding="utf-8"?><data>r0
caslog/storage-adminz=Check shared storage pool and show blocked pools information.)
descriptionz
--all
store_truez'if --all is specialed, show all states.)
action
helpz
--pool
+z<storage pool list. If not specialed, output all ocfs2 pools.)
nargsrG
input parameters: %sTz
Get pool %s info failedz&<store name="%s" state="%s" info="%s">z	not foundr:
Storage pool %s is activez!debugfs.ocfs2 -R "fs_locks -B" %sz
Storage pool %s has busy locksz
Storage pool %s is recoveringz
Storage pool %s is inactivez
</data>)=
sysr
argparse
	tracebackZ
util_cvk_logZ
util_common_toolsZ
ocfs2_iscsi_commonZ
sa_pool_infor
STATE_NOT_FOUNDr;
__name__Z
xml_stringr+
cas_log_init3
ArgumentParser
parser
add_argumentr
argv
parse_args
args
allZ
show_allr
Z	pool_listr6
get_pool_infor7
dev_pathZ
mpathr
ismountZ
util_cmds_outputZ
busy_locksZ
device_use_dlockZ
recor
format_exc
print
exitr
<module>
