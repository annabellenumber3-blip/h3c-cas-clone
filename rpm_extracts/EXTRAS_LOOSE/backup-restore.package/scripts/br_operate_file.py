# File: br_operate_file.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/backup-restore.package/scripts/br_operate_file.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

FtpUtil)
downloadc
Nz5br_operate_file.py can be used to handle remote filesznUsage: python br_operate_file.py command src_path dest_path files trans_type { server port username password }z
  command:z5    download: cp file_name from src_path to dest_pathz5  ---------------------------------------------------z
  src_path: the path of filesz-  dest_path:  the path of files to be operatez"  files: files name to be operatedzk  trans_type: transfer type, it can be cp/ftp/scp, when trans_type=cp, the following parameter is not existz
  server:        server ipz
  port:          the portz+  username:      the username used to loginz+  password:      the password used to login
print
exit
br_operate_file.py
usage
Operate_Filec
src_path
	dest_path
split
files
trans_type
server
port
username
password)
selfr
fileZ
transport_typer
__init__+
Operate_File.__init__c
intr
set_remote_serverA
Operate_File.set_remote_serverc
local
ftpz
%s server[%s]z
unsupported repo serverz
%s:%s:%s)
Z	host_infor
dump_transfer_infoG
Operate_File.dump_transfer_infoc
qtn\t
cp %s %sz
shell_cmd: %sT)
shellr!
\'z"expect %s/file_scp.exp %s %s %d %sz$expect %s/file_scp.exp %s %s %d '%s'z#expect %s/file_scp.exp %s %s %d @@@z
Failed to download files [%s]r
Succeed to download files [%s]r
logging
debug
subprocessZ
check_callZ
ipcompat_get_scp_pathr
replaceZ
CBT_SCRIPTS_ROOTr
check_outputr
loginZ
get_fileZ
logout
BaseException
	exception
errorr#
src_fileZ	dest_fileZ	shell_cmdZ
scp_remote_pathr
ftputil
download_fileQ
Operate_File.download_fileN)
__name__
__module__
__qualname__r
__main__
caslog/backup-restore
Command [%s] is not supported
trans_type: %sr
Invalid transfer type: %s
parameter num err: %d
) r&
Z	ftp_utilsr
util_cvk_logZ
cbt_publicZ
br_ipcompat_utilZ
CMD_DOWNLOADr
cas_log_init3r
argvZ
argcZ
supported_commandsZ
commandr,
	Exceptionr
errr+
<module>
