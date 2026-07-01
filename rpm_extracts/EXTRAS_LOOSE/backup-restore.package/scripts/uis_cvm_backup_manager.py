# File: uis_cvm_backup_manager.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/backup-restore.package/scripts/uis_cvm_backup_manager.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

l	Z	d
Z!e"d
Z$e$j%d
Z(e(j
Z)e!
Z+e)d
rre+j-e)d
e+j-d
Z.e+
parseString
	LogConfigN
consolec
zC%(asctime)s  %(pathname)s %(filename)s [%(levelname)s]: %(message)sz
%Y-%m-%d %H:%M:%S)
level
formatZ
datefmt
filez
%Y-%mz
/%s/%s_%s.logz
touch %s
checkz(%(asctime)s [%(levelname)s]: %(message)sz5%(asctime)s %(filename)s [%(levelname)s]: %(message)s
utf-8
filename
encoding
mode)
loggingZ
NOTSET
DEBUG
INFOZ
WARN
ERRORZ
CRITICAL
intZ
basicConfig
path
exists
mkdir
datetimeZ
strftime
systemZ	FormatterZ
FileHandlerZ
setFormatter
	getLogger
checkerZ
setLevelZ
addHandler)
selfZ
log_pathZ
log_nameZ	log_levelZ
record_typeZ
record_formatZ
log_level_dictZ
deafult_levelZ
now_time
	file_name
	formatterZ
handler
uis_cvm_backup_manager.py
__init__.
LogConfig.__init__c
LogConfig.getLogger)
NNNr
__name__
__module__
__qualname__r-
PublicMethodc
walk)
	main_pathZ	info_dictZ	file_path
dirsr(
get_file_infoh
PublicMethod.get_file_infoN)
staticmethodr7
BackupManagerc
uis.tarZ
onestor_backup_dataZ
author_center)
uis_backup
output
socketZ
gethostname
	host_nameZ
gethostbynameZ
host_ip
	peer_name
peer_ip
host_crm_peer
get_peer_host_infor/
BackupManager.__init__c
/opt/bin/ms_info.sh hotbackupTr
shellr
z!/opt/bin/ms_info.sh peer hostnamez5cat /etc/hosts | grep -w %s | awk -F ' ' '{print $1}'z
fail to get %s hostbackup info.Z
CvmManagerBackup)
subprocess
check_output
stripr?
CalledProcessError
errorr>
	exceptionrA
is_hot_backup
result
z BackupManager.get_peer_host_infoc
%s/md5sum.confz
rm -f %sz
ls %s | grep %sz,md5sum %s/%s | awk -F ' ' '{print $1}' >> %sTr
popen
read
lenrG
main_dirZ
md5_filer)
	file_info
create_md5sum
BackupManager.create_md5sumc
Nz/md5sum %s/md5sum.conf | awk -F ' ' '{print $1}'Tr
	md5_valuer+
get_md5sum
BackupManager.get_md5sumc
/etc/uis-versionz
/etc/cas_cvk-versionzHnot exist product version file /etc/uis-version or /etc/cas_cvk-version.z*cat %s | head -1 | awk -F ' ' '{print $3}'Tr
BaseExceptionrE
version_filer)
versionr+
get_product_version
z!BackupManager.get_product_versionc
Nz,Are you sure you want to continue connectingz	/bin/bashz
-ci`
timeoutz
assword:i
z	assword: r
pexpectZ
spawn
expectZ
EOFZ
sendline
SUCCRSS
before)
passwd
cmd_lineZ
ssh_keyZ
ret_code
retr+
pexpect_excute
BackupManager.pexpect_excuteNc
Nz)xml input info is none while parsing xml.z%fail to parse xml info to dictionary.)
opType
platformType
position
reserverNumber
bak_path
restore_path
fileMd5)
type
server
port
userName
passwordr
dirr
z6xml input info do not have sub-node %s, continue next.r:
z7xml input data do not have main-node %s, continue next.)
documentElement
xmlZ
domZ
minidom
parserW
getElementsByTagNameZ
childNodes
data
debug)
xml_file
xml_infoZ
dom_tree
root
docrL
	data_dictZ
main_node_listZ
position_sub_node_listZ	main_nodeZ	node_addrZ
node_valueZ
sub_node_dictZ
sub_nodeZ
sub_node_addrZ
sub_node_valuer+
	parse_xml
BackupManager.parse_xmlc
d"d#d$
d(|	|
d*|	|
sTd-|
d"d#d$
r@d1|
znz$|
} }!| 
d9d9d9d:
} }!| 
);Nc
backup
delete
,z7<cvmBr><dir>'{0}'</dir><fileMd5>'{1}'</fileMd5></cvmBr>z
<cvmBr><dir>'{0}'</dir></cvmBr>)
joinr
	dict_inforT
backup_dir
delete_dir_listZ
delete_dirsZ
xml_backupZ
xml_deleter+
create_xml
z(BackupManager.backup.<locals>.create_xmlc
|	d	k
%s/%s
	localPath
backupDirNamer|
dstPath
ls %s/ 2>/dev/nullr
backupDirPreNamer
reserverNum
rm -rfF
reverse
fail to excute ssh cmd: %s.r~
splitlines
startswith
append
sortrE
backup_infor
	local_dirr|
backup_pathra
results
backup_dir_list
count
	data_listrt
reserve_num
indexr
cmd_1r
__prepare_cp
z*BackupManager.backup.<locals>.__prepare_cpc
ssh -p %d -q -l %s %s '%s'r
replacerA
decoder
dst_ip
dst_usr
dst_passwd
dst_portr
__prepare_scpO
z+BackupManager.backup.<locals>.__prepare_scpc
}	|	
expect -c "
            set timeout 3100;
            spawn scp -oUserKnownHostsFile=/dev/null -oConnectTimeout=120 -oTCPKeepAlive=yes \
            -oServerAliveInterval=60 -oServerAliveCountMax=3 -q -P {port} -r {localsource} {username}@{host}:{remotedest};
            expect {{
            *yes/no* {{ send "yes\r"; exp_continue }}
            *assword* {{ send {password}\r }}
            }};
            expect *\r;
            expect \r;
            expect eof
            "
            
usernamerp
hostZ
localsourceZ
remotedestrn
stdout
stderrrD
Popen
PIPE
communicaterO
dst_ip_tmp
local_path
dst_pathra
errr+
__scp
z#BackupManager.backup.<locals>.__scpc
]0}	|	
work_dir:%s
check_dir:%sz'not exist remote path %s in ftp server.
z fail to delete %s in ftp server.r~
pwdrH
inforq
splitrA
G_FTP
delete_dirrI
	connecterr
	data_infor
work_dirZ	check_dir
dir_info_res
dir_name_list
dir_info
dir_nameZ
backdir_info_resr
backup_countZ
backdir_infoZ
backdir_nameZ
platform_backup_dir_listr
reserve_backup_numr
backup_folderr
__prepare_ftp
z+BackupManager.backup.<locals>.__prepare_ftpc
srcPathr
uploadrA
src_pathr
__ftp
z#BackupManager.backup.<locals>.__ftprg
cprf
ftprm
/not support backup data operation %s to server.z
%Y%m%d%H%M%Sz
/vms/backup_tmp/
%s/%s/z
%s/%s_INFO_BACK_%s_%s/z
rm -rf %s; mkdir -p %sz
cp -rf %s/* %s 2>/dev/nullTr
%s_INFO_BACK_%sr
%s_INFO_BACK_%s_%sr
mkdir -p %s
cp -rf %s %sz
fail to cp data to server.r}
mkdir -p %s 2>/dev/null
ssh -q -l %s %s '%s'z"fail to backup data from %s to %s.r
fail to ftp data to server.r~
fail to backup data to server.r:
upperrO
timer#
quitr<
print)"r'
xml_dictr
_BackupManager__prepare_cpZ
_BackupManager__prepare_scp
_BackupManager__scpZ
_BackupManager__prepare_ftpZ
_BackupManager__ftp
	operation
platformr
backup_timeZ
tmp_pathr
dst_dirra
backup_xmlZ
delete_xmlr+
BackupManager.backupc
d!|	|
]d}"d(|"|
j	|#d
}$|$
}%d(|"|
j	|&d
}'|'
d*|	|
d+|(
})|)
}*|*|
]b}+d,|	|
},|,
})|)d
rZ|)
}-d-|	|
|-|	f
qZd.|	|
d0|*|
d1|	|
)3Nc
}	|	
restorePathr
expect -c "
            set timeout 3100;
            spawn scp -oUserKnownHostsFile=/dev/null -oConnectTimeout=120 -oTCPKeepAlive=yes \
            -oServerAliveInterval=60 -oServerAliveCountMax=3 -q -P {port} -r {username}@{host}:{remotedest} {localsource};
            expect {{
            *yes/no* {{ send "yes\r"; exp_continue }}
            *assword* {{ send {password}\r }}
            }};
            expect *\r;
            expect \r;
            expect eof
            "
             r
restore_infor
z$BackupManager.restore.<locals>.__scpFrg
	%s/%s/%s/r
z#fail to restore data frpm %s to %s.r
z#fail to restore data from %s to %s.r
/%sz&not support restore operation type %s.z
%s/%s/uis-versionrV
cat %s | wc -lr
z;not exist hot patch in local environment, could do restore.zbhot patch info in local version conf is different from restore version conf, could not do restore.r
sed -n '%sp' %szYhot patch info in local version conf is same with restore version conf, could do restore.
%s/%s/md5sum.conf
#md5sum %s | awk -F ' ' '{print $1}'z
ls %s/%s | grep %sz
mv -f %s/%s/%s %s
rm -rf %s/%src
zMmd5 value %s from sever backupdir not equal md5 value %s from input xml info.z
rm -rf %s/%s/z!fail to restore data from server.) r
isdirr$
lstrip
downloadrI
ranger;
BR_CVM_RESTORE_ERROR_FOR_PATCHr
).r'
do_hot_patch_restorer
src_md5rj
reomote_path
	path_infoZ
restore_dirZ
restore_versionZ
local_versionr
Z	results_1Z
local_info_rowsZ
cmd_2Z	results_2Z
restore_info_rowsZ
check_indexZ
cmd_local_infoZ
results_localZ
local_infoZ
cmd_restore_infoZ
results_restore
md5_confrK
dst_md5rQ
restorea
BackupManager.restorec
}	|	D
}	|	D
%s/%s/%sTr
fail to excute cmd: %s.rc
ls %s/%s 2>/dev/nullz
fail to delete %s in server.r
%s/%s/%s/%sz%not support delete operation type %s.z)fail to delete backup dir list in server.)
back_dir_listra
back_dirrL
exist_dir_listZ
exist_backup_dir_listr
remote_dirr+
BackupManager.deletec
n<z$|
} | d$k
rHd$}!d%|
|"|!
|#d&
$}$|
d'|!
r6d)|#
d*|"
}&|&|
j!d,<
j!d-<
}&|&|
j!d,<
j!d-<
)/Nc
Nz*<cvmBr><dir>''</dir><>''</fileMd5></cvmBr>
<cvmBr>z-<dir><name>'{0}'</name><md5>'{1}'</md5></dir>
</cvmBr>
list
itemsr
list_xmlr
__create_xmlm
z(BackupManager.list.<locals>.__create_xmlrg
fail to excute cmd %s.z
%s_INFO_BACKz5md5sum %s/%s/%s/md5sum.conf | awk -F ' ' '{print $1}'r
md5sum %s/%s/%s/md5sum.confr
%s is not directory, abort.Z
UISFz
md5sum.confz
/vms/tmp/%s
RETR %s
z	rm -rf %sz#not support list operation type %s.r
z)fail to get backup list info from server.)&r
makedirsr
open
retrbinary
writer$
)'r'
_BackupManager__create_xmlr
cmd_1iner<
	work_pathr
backup_dir_name_listr
file_info_resZ
exist_md5sumrQ
remote_filer
local_filerR
BackupManager.listc
)(Nc
}	|	
downloadPatha
expect -c "
            set timeout 3100;
            spawn scp -oUserKnownHostsFile=/dev/null -oConnectTimeout=120 -oTCPKeepAlive=yes \
             -oServerAliveInterval=60 -oServerAliveCountMax=3 -q -P {port} -r {username}@{host}:{remotedest} {localsource};
            expect {{
            *yes/no* {{ send "yes\r"; exp_continue }}
            *assword* {{ send {password}\r }}
            }};
            expect *\r;
            expect \r;
            expect eof
            "
            r
src_ipr
src_passwd
src_port
download_infoZ
src_ip_tmpr
download_pathra
z%BackupManager.download.<locals>.__scprg
fail to scp data from %s.r
z'fail to ftp data from %s in ftp server.z
ftp data from server finished.z'not support download operation type %s.r
z$fail to download data from %s to %s.r
dst_md5: %sz
src md5 value: %src
zEmd5 value %s from src dir not equal md5 value %s from input xml info.r
z(fail to download backup dir from server.)
src_dirr
Z	src_valuer
src_usrr
remote_pathr
BackupManager.downloadc
)$Nc
}	|	
expect -c "
            set timeout 3100;
            spawn scp -oUserKnownHostsFile=/dev/null -oConnectTimeout=120 -oTCPKeepAlive=yes \
             -oServerAliveInterval=60 -oServerAliveCountMax=3 -q -P {port} -r {localsource} {username}@{host}:{remotedest} ;
            expect {{
            *yes/no* {{ send "yes\r"; exp_continue }}
            *assword* {{ send {password}\r }}
            }};
            expect *\r;
            expect \r;
            expect eof
            "
            r
upload_infor
z#BackupManager.upload.<locals>.__scpc
Nz1<cvmBr><dir>''</dir><fileMd5>''</fileMd5></cvmBr>r
z(<dir>'{0}'</dir><fileMd5>'{1}'</fileMd5>r
upload_xmlrq
z*BackupManager.upload.<locals>.__create_xmlrg
z!not exist path %s in environment.r
fail to excute cmd %sr
z"fail to upload data from %s to %s.r
"fail to upload data to ftp server.z"not support upload operation type.r
Fail to upload backup dir.)
upload_dirr
BackupManager.uploadc
host_crm_peer got is null.z
parse xml file results is null.rf
uisre
not support %s operation.Z
casz
not support backup %s platform.)
platform_typeZ
op_typer+
manager
BackupManager.manager)
	FtpMangerc
G_BACKUPrA
dir_path_listr/
FtpManger.__init__c
z%%s path must include ftp work dir %s.)
mkd)
tmp_listZ
dst_dir_list
str_dst_dirr
work_dir_listZ
str_work_dirr
sub_dir_list
sub_dirr+
make_dir
FtpManger.make_dirc
qdqdz
)	Nr
z%not exist dir path %s in environment.r
get_dir_path_list)
current_pathZ
dir_resr
FtpManger.get_dir_path_listc
LISTr
Z	retrlinesr
argsr)
filesr+
Z	__contentZ
FtpManger.__contentNc
}	|	D
_FtpManger__contentr
	path_list
files_infor
all_dir_path_listZ
dir_path
	files_strZ
file_namesr(
get_files_infob
FtpManger.get_files_infoc
q>q$z
q2q2|
rmd)
dir_name_resr
current_dir
_FtpManger__delete_sub_dirr+
__delete_sub_dir
z.FtpManger.delete_dir.<locals>.__delete_sub_dirr
z)fail to delete file %s/%s in environment.z%fail to delete dir %s in environment.)
)	r'
files_pathr"
files_name_listr(
FtpManger.delete_dir
fail to init ftp connecter.)
FTPZ
connectZ
loginrW
usrr`
FtpManger.connecterr
rLq2q2|
rX|	|
n*|	|
Nz$not exist path in local environment.r
UIS_INFO_BACKr
CAS_INFO_BACKr
STOR %sr
find
rfindr
storbinary
closerH
buffsizeZ
files_info_dictr
local_files_listr
tmp_dir_listr
subdir_indexZ
sub_positionr
f_sendrL
FtpManger.uploadTc
q6q6z
q6|	d
z#%s is not directory or file, abort.TFz
%s is a directory, download it.z4directory %s download mode is UnRecursive, continue.z
%s is file, download it.r
is_recursivelyZ
buffersizeZ
dir_res_listrt
is_dirr
local_sub_dirZ
remote_sub_dirr	
FtpManger.download)
/var/log/caslogZ
cvm_backupr
__main__z
use for uis cvm backup.)
descriptionz
--xmlFz0xml input, use format string of xml or xml file.)
required
default
helpz
.xml)
argparse
copyr"
ftplibr
sysr=
xml.dom.minidomrr
util_cvk_logr
objectr
LOG_PATHZ	FILE_NAMEZ	LOG_LEVELZ
TYPEZ
FORMATr%
ArgumentParser
parser
add_argumentr
parse_argsr
worker
endswithr{
<module>
