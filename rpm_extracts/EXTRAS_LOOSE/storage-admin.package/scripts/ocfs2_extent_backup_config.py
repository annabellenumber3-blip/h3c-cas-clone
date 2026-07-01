# File: ocfs2_extent_backup_config.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/storage-admin.package/scripts/ocfs2_extent_backup_config.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

Ocfs2 extent backup configure.T)
description
add_helpz
--switch)
switch of extent backup feature)
default
type
choices
help
Parameters error
OCFS2_ERR_WRONG_PARAM)
argparse
ArgumentParser
add_argument
parse_args
logging
debug
BaseException
error
exit
ocfs2_error)
parser
args
ocfs2_extent_backup_config.py
	arg_parse
__main__Z
ocfs2z
caslog/storage-adminr
/vms/ocfs2_extent_backup.confz5echo BACKUP_SWITCH=ON > /vms/ocfs2_extent_backup.confr
zhsed 's/BACKUP_SWITCH=OFF/BACKUP_SWITCH=ON/' /vms/ocfs2_extent_backup.conf > /vms/ocfs2_extent_backup.tmpz=mv /vms/ocfs2_extent_backup.tmp /vms/ocfs2_extent_backup.confzhsed 's/BACKUP_SWITCH=ON/BACKUP_SWITCH=OFF/' /vms/ocfs2_extent_backup.conf > /vms/ocfs2_extent_backup.tmpZ
OCFS2_SUCCESS)
util_cvk_logZ
util_common_toolsr
__name__Z
cas_log_init3r
argvZ
arg_nsr
path
existsZ
util_cmds_outputZ
switch
SystemExitZ
betr
<module>
