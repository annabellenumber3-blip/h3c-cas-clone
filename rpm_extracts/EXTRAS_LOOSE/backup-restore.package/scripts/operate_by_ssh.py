# File: operate_by_ssh.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/backup-restore.package/scripts/operate_by_ssh.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

SshUtilz	ssh tools
ConstructorN)
_server
_port
_login_name
	_password
_connect)
selfZ
server
user
password
port
operate_by_ssh.py
__init__
SshUtil.__init__c
_client
close)
__del__
SshUtil.__del__c
usernamer
allow_agentz%ssh client connect failed, errinfo:%s
paramikoZ	SSHClientr
set_missing_host_key_policyZ
AutoAddPolicyZ
connectr
	Exception
logging
error
exit)
errr
SshUtil._connectc
cmd failed, err:%s
z"execute commamd failed, errinfo:%sr
exec_command
	readlines
lenr
read
print
decode
replacer
command
stdin
stdout
stderrZ
err_list
datar
SshUtil.exec_commandN)
__name__
__module__
__qualname__
__doc__r
operate command using:z
 file operate:z\          cat file: python operate_by_ssh.py cat_file server_ip server_port user passwd filez\    list file info: python operate_by_ssh.py ls_file  server_ip server_port user passwd filez\                                                                                            z
 directory operate:zo    get space info of directory: python operate_by_ssh.py get_space server_ip server_port user passwd directoryz
           list child directory: python operate_by_ssh.py list_dir  server_ip server_port user passwd directory file_type(like -d)zp test directory is exist or not: python operate_by_ssh.py test_dir  server_ip server_port user passwd directory)zp                 make directory: python operate_by_ssh.py mkdir     server_ip server_port user passwd directory)zp               delete directory: python operate_by_ssh.py del_dir   server_ip server_port user passwd directory)r
usage9
__main__
caslog/backup-restorer
Z	get_space
timeout 30s df -B1 %sZ
list_dir
ls %s %sZ
test_dirz
cd %s
mkdirz
mkdir -p %sZ
ls_filez
ls -l %sZ
del_dirz	rm -rf %sZ
cat_filez
cat %sz
command: %s)
util_cvk_log
objectr
argvZ
arcZ
cas_log_init3Z
operateZ	server_ipZ
server_portr
passwdZ
des_dir
cmdZ	file_type
file
infoZ
sshr 
<module>
