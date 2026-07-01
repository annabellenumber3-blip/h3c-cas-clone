# File: ftp_utils.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/backup-restore.package/scripts/ftp_utils.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

m	Z	
Z#[#
Z#[#0
e&j'd
nxe(
rPe(
s.e(
n&e(
Z&[&nzd
Z&[&0
Z+[+nBd
Z+[+0
Z-[-n
Z-[-0
FTP)
error_temp)
error_permc
NzAftp_utils.py is ftp client tool that interactives with ftp serverzXUsage: python ftp_utils.py command server port username password local_file remote_file}z
  command:z'    upload:   upload file to ftp serverz>    download: download file from ftp server to local directoryz
  server:        server ipz"  port:          the port. e.g. 21z+  username:      the username used to loginz+  password:      the password used to loginz=  local_file:    the local file to upload from or download toz>  remote_file:   the remote file to upload to or download from
print
exit
ftp_utils.py
usage
FtpUtil
host
port
username
password
timeout
root_dir)
selfr
__init__)
FtpUtil.__init__c
'utf-8' codec can't decodez;now ftp encoding:utf-8,connect failed. try connect with GBKZ
GBKz%fail to init ftp connecter. error: %s)
socketZ
setdefaulttimeoutr
connectr
BaseException
loggingZ
warning
encoding
error)
FtpUtil.connectc
root dir: )	r
loginr
pwdr
debug)
FtpUtil.loginc
Remote dir: 
STOR %s
put file: %s)
_to_remote_absolute_pathr
openZ
storbinary
path
basename
close
info)
remote_dir
local_file
abs_dir
retr	
put_fileI
FtpUtil.put_filec
RETR %sr(
get file: %s)
dirnamer)
retrbinaryr.
writer/
remote_filer2
get_fileS
FtpUtil.get_file
nlst)
list^
FtpUtil.listc
t	yt
cas_vm_restore_z
/tmp/
randomZ
randintr
readr/
remove
	Exception)
Z	file_pathZ
number
	file_nameZ
tmp_filer4
outputr	
catb
FtpUtil.catc
        :param remote_file: the file to be download
        :param local_file: the destination file download to. if local_file is a directory,
                             a new file with the same name of remote file will be created.
        :return:
        
basename: %s, local_file: %sN)
isdirr.
downloadr
FtpUtil.downloadc
quit)
logout
FtpUtil.logoutc
%s/)
startswithr
sub)
remote_pathr-
z FtpUtil._to_remote_absolute_pathN)
__name__
__module__
__qualname__r
Nz"fe80::a28c:fdff:fed3:1b77%vswitch0
Socket error)	r
getaddrinfoZ
SOCK_STREAMZ
settimeoutr
	exceptionr/
socktype
protoZ	canonnameZ
sockr	
test_socket_ipv6
__main__)
level
Invalid argumentr
uploadrI
Invalid command: %s
//rG
550Z
permissionZ
deniedz
Failed to have permission.
ftplibr
basicConfig
DEBUG
argvZ
argcr
commandZ
commands_supportedZ
serverr
replacer2
ftputilr"
serT
argsZ	error_msg
find
IOErrorZ
ioer
<module>
