# File: ocfs2_filesystem_layout_backup.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/storage-admin.package/scripts/ocfs2_filesystem_layout_backup.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

shell
subprocessZ
check_output
decode
strip
split
IOError
logging
error
BaseException)
cmdLine
resultZ
ioeZ
!ocfs2_filesystem_layout_backup.py
util_cmds_output
Nz6OCFS2 extent backup for all inode of file in the pool.T)
description
add_helpz
--normal
reserve days for normal)
default
type
help
Parameters error
argparse
ArgumentParser
add_argument
parse_argsr
debugr
exit)
parser
args
betr
	arg_parse$
/vms/ocfs2_extent_backup.confTz;cat /vms/ocfs2_extent_backup.conf | grep "BACKUP_SWITCH=ON"r
path
existsr
retr
is_backup_switch_on0
Nz0grep -w ocfs2 /proc/mounts | awk '{print $1,$2}'r
Cannot get any pool of ocfs2.)
infor
cmdr
get_all_ocfs2_pool:
]4}	|	d
Nz)ls -ail %s | awk '$2~/^-/ {print $1,$NF}'r
zQ/usr/bin/python3 /opt/bin/ocfs2_do_file_layout_backup.pyc -m %s -i %s -n %s -d %sz
No file in path %szkfor index in {00..31}; do /sbin/debugfs.ocfs2 -R "ls //orphan_dir:00$index " %s ;done|grep -v -E  "\.|\.\."
deletezP/usr/bin/python /opt/bin/ocfs2_do_file_layout_backup.pyc -m %s -i %s -n %s -d %sz
delete in path %sz$ls -l %s | awk '$1~/^d/ {print $NF}'z
lost+foundz
%s/%sz
%s_%sz
No directory in path %s)
save_all_files_layout_in_pathr
dev_pathZ
dir_pathZ
name_prefixr-
filelistZ
fileinfo
filename
dirlist
dirnamer(
prefixr.
zZfind /vms/.ocfs2_extent_backup/*/normal -mtime +%d -type f -exec rm -rf {} \; 2>>/dev/null)
normalr-
backup_directory_cleanq
hostnamer
Cannot get hostname.Fz#o2cb_ctl -I -t node -o | grep -w %sz
Cannot find host node number.
nodeid: %sz</sbin/debugfs.ocfs2 -R "hb" %s | awk '{if(NR>1)print $2,$3}'r
time
sleep
range
appendr
sortr
node_hb_listr:
ret1Z
nodeidZ
ret2Z
len1Z
len2Z
listlen
is_owner_to_savey
__main__Z
OCFS2_SUCCESSZ
ocfs2z
caslog/storage-adminr
OCFS2_ERR_WRONG_PARAMr
root)
	tracebackr<
util_cvk_logZ
util_sh_error_code_loaderr
__name__Z
arg_nsr"
cas_log_init3r
argvr
ocfs2_errorZ
poollistZ
poolr
SystemExitZ
format_excr
<module>
