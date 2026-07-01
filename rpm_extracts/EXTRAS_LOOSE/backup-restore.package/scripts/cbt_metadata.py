# File: cbt_metadata.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/backup-restore.package/scripts/cbt_metadata.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

Z e e
!d!e 
%d#e$
e$d$k
rbe$d%k
rbe$d&k
d'e$
e$d%k
e$d&k
n8e e	k
Z)e*e)
Z,[,n
Z,[,0
FtpUtil)
set_task_dirtyZ
clear_task_dirtyZ
check_task_dirtyZ
task_dirty
Nz5cbt_metadata.py can be used to handle backup medadataz\Usage: python cbt_metadata.py command repo_path trans_type { server port username password }z
  command:zM    set_task_dirty:   set task-dirty-flag to true to mark a dirty backup taskzN    clear_task_dirty: set task-dirty-flag to false to mark a clean backup taskz6    check_task_dirty: get the value of task-dirty-flagz/  repo_path:     specifies the backup directoryz;  trans_type:    transfer type, can be 'cp', 'ftp' or 'scp'zL  If trans_type is 'ftp' or 'scp, the following arguments must be specified:z
  server:        server ipz
  port:          the portz+  username:      the username used to loginz+  password:      the password used to login
print
exit
cbt_metadata.py
usage"
CBTExceptionc
super
	Exception
__init__
err_code)
selfZ
err_infor
	__class__r
CBTException.__init__)
__name__
__module__
__qualname__r
__classcell__r
BackupRepoInfoc
trans_type
host
port
username
password
	repo_path
name)
transport_typer
BackupRepoInfo.__init__c
set_repo_nameB
BackupRepoInfo.set_repo_namec
set_repo_pathE
BackupRepoInfo.set_repo_pathc
set_remote_serverH
z BackupRepoInfo.set_remote_serverc
local
ftpz
%s server[%s]z
unsupported repo serverz
%s:%s)
Z	host_infor
dump_repo_infoN
BackupRepoInfo.dump_repo_infoN)
cp %s %s
shell_cmd: %sT
shellr(
$expect %s/file_scp.exp %s %s %d '%s'
#expect %s/file_scp.exp %s %s %d @@@z!Failed to upload file[%s] to [%s]Fz"Succeed to upload file[%s] to [%s])
logging
debug
subprocess
check_output
ipcompat_get_scp_pathr
CBT_SCRIPTS_ROOTr
loginZ
put_file
logout
BaseException
	exception
error
backup_repor*
local_file
	repo_info
	shell_cmd
scp_remote_path
ftputil
upload_fileY
d	t	|
z&Failed to download file[%s/%s] to [%s]Fz'Succeed to download file[%s/%s] to [%s])
check_callr5
get_filer8
)	r>
filenameZ
dst_dirr=
remote_filer?
download_filew
/tmp/metadata
%s: %s
z0Failed to set task-dirty-flag to backup file[%s]z1Succeed to set task-dirty-flag to backup file[%s])	
open
write
METADATA_TASK_DIRTY
TASK_DIRTY_TRUErC
infor<
md_path
retr
set_task_dirty_flag
z2Failed to clear task-clean-flag to backup file[%s]z3Succeed to clear task-clean-flag to backup file[%s])
TASK_DIRTY_FALSErC
clear_task_dirty_flag
qBq$W
metadataz
/tmprG
Get dirty flag: %s
)	rF
replacer1
split
len)
lineZ
substrsr
check_task_dirty_flag
z	line1: %srZ
key: %s, value: %s)
valuer
test
caslog/backup-restore)
cas_log_init3r
init_log_util
__main__r
Command [%s] is not supported
trans_type: %sr&
Invalid transfer type: %s
).r1
Z	ftp_utilsr
util_cvk_logZ
cbt_publicZ
br_ipcompat_utilZ
CMD_SET_TASK_DIRTYZ
CMD_CLEAR_TASK_DIRTYZ
CMD_CHECK_TASK_DIRTYrL
Z	exit_coder^
argvZ
argcr<
supported_commandsZ
commandr;
intZ
dirtyr
errr:
<module>
