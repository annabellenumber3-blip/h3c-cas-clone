# File: ocfs2_do_file_layout_backup.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/storage-admin.package/scripts/ocfs2_do_file_layout_backup.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

is_backup_switch_onc
Nz(Ocfs2 extent backup for indicated inode.T)
description
add_helpz
-mz	--devpathz
device path of the pool)
default
required
helpz
--inoz
inode number)
typer
--filenamez!name of file linking to the inode)
--prefixz"prefix stands for parent directory
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
ocfs2_do_file_layout_backup.py
	arg_parse
Nz8grep -w ocfs2 /proc/mounts |grep \%s\ | awk '{print $2}'r
z!Canot get pool name for device %s
More than 1 entry to device %s)
util_cmds_output
lenr
path
splitr
deviceZ	pool_pathZ	path_info
parse_pool_name_from_device'
/vms/.ocfs2_extent_backup/%s/%s)
exists
makedirsr
pool
dirnamer!
check_backup_directory7
}	~	n
}	~	0
%Y%m%d%H%M
deleteza/sbin/debugfs.ocfs2 -R "stat -n <%s>" %s | lzop -o /vms/.ocfs2_extent_backup/%s/delete/.%d_%s.lzoz
/vms/.ocfs2_extent_backup/.tmp1z
/vms/.ocfs2_extent_backup/.tmp2Z
normalzg/sbin/debugfs.ocfs2 -R "stat -n <%s>" %s | lzop -o /vms/.ocfs2_extent_backup/%s/normal/.%d_%s_%s_%s.lzo)
datetime
strftimer)
open
O_CREAT
arg_ns
prefixr
close
remove)
devpathr'
filenameZ
fd1Z
fd2r+
Z	timestamp
cmdr#
save_file_layoutA
__main__Z
ocfs2z
caslog/storage-adminZ
OCFS2_SUCCESSr
Get pool name error.)
util_cvk_logZ
util_common_toolsZ
ocfs2_filesystem_layout_backupr
__name__Z
cas_log_init3r
argvr
Z	pool_namer4
SystemExitZ
betr
<module>
