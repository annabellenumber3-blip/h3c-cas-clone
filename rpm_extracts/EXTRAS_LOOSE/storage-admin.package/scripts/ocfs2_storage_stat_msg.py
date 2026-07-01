# File: ocfs2_storage_stat_msg.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/storage-admin.package/scripts/ocfs2_storage_stat_msg.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

Z e d
"e#d"
"e#d#
Z%[%n
Z%[%0
"e#d$
multipath_disablequeueing
cha_check_pool_command
UNKOWN_DEV
UNKOWN_UUID
UNKOWN_TYPE
resetZ
umountz,grep -w ocfs2 /proc/mounts | grep -w /dev/%sz
cha -k ocfs2-pool-fault %s 3c
d	|	|
z)device is UNKOWN_DEV, something is wrong.r
/z#device %s, mounted on %s, pool: %s.z;call multipath_disablequeueing for device %s failed, ret=%dzDHost will be restarted, message HA and diable multipath queue again.z=call CHA_CHECK_POOLFAULT_CMD_RESET for pool %s failed, ret=%d
z"Mount point of device %s not found)
loggingZ
warningZ
util_cmds_output
OCFS2_MOUNT_LIST_CMD
strip
splitr
error
time
sleep
RESET_TYPEr
CHA_CHECK_POOLFAULT_CMD_RESET
BaseException)
uuid
dev_name
msg_type
retZ
mount_listZ
mount_infoZ	disk_infoZ	disk_nameZ
mount_pointZ	pool_name
ocfs2_storage_stat_msg.py
pre_fence_callback7
__main__Z
ocfs2_fencez
caslog/storage-adminz
input paremeters: %sr
z*call ha command to deal with ocfs2 fencing)
descriptionz
--uuid
	uuid_namez
uuid of ocfs2 file system)
dest
default
helpz
--devicer
device name, such as dm-xz
--typer
z9messgage type, such as reset(restart the host) or umount.z1call ha command to deal with ocfs2 fencing failedZ
OCFS2_SERVRE_NO_RESPONSEZ
OCFS2_FAILEDZ
OCFS2_SUCCESS)&
sysr
stringr
argparseZ
util_cvk_logZ
util_common_toolsZ
util_sh_error_code_loaderZ
ocfs2_umount_opr
UMOUNT_TYPEr
__name__Z
cas_log_init3
debug
argv
ArgumentParser
parser
add_argument
parse_args
argsr 
rtnr
exitZ
ocfs2_errorr
<module>
