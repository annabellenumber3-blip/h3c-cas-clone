# File: cvm_br_check.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/backup-restore.package/scripts/cvm_br_check.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

m	Z	
!e"d
j#d 
j#d <
d"e$
z4e&j'e"d#
Z&[&nJd
Z&[&0
!e"d$
Z*[*n
Z*[*0
!e"d#
getDOMImplementation)
FTP)
FtpUtil)
error_temp)
error_perm)
t	d	
CVM Backup and Restore scripts.T)
description
add_helpz
--xmlz$Execute option defined in xml string)
required
default
help
Parameters error
BR_WRONG_PARAM)
argparse
ArgumentParser
add_argument
parse_args
BaseException
logging
error
exit
br_error)
args
parser
cvm_br_check.py
	arg_parse0
nodeTypeZ	TEXT_NODE
append
data
join)
nodelist
noder
get_textI
r2t	|
)!Nz
The cvm br cmd xml is: %s.
opTyper
platformTypeZ
print
	cic_print
dirZ
position
type
pathZ
backup
upload
cic_backup
reserverNumber
bak_path
restore
download
cic_restore
restore_path
fileMd5Z ffffffffffffffffffffffffffffffffr
delete
server
port
userName
password
username is %sr
info
domZ
minidomZ
parseStringr$
getElementsByTagNameZ
childNodes
debugr
	traceback
format_excr
cmd_xmlZ
command_dictZ
cmd_domZ
position_noder
command_parse^
)"Nr%
z&cvm_br_mng_backup.sh %s %s %s %s %s %sr&
z2cvm_br_mng_backup.sh %s %s %s %s %s %s %s %s %s %szIBuildup command line: cvm_br_mng_backup.sh %s %s %s %s @@@ %s %s %s %s %sr1
z'cvm_br_mng_restore.sh %s %s %s %s %s %sr5
z*cvm_br_mng_restore.sh %s %s %s %s %s %s %sz3cvm_br_mng_restore.sh %s %s %s %s %s %s %s %s %s %szJBuildup command line: cvm_br_mng_restore.sh %s %s %s %s @@@ %s %s %s %s %sz6cvm_br_mng_restore.sh %s %s %s %s %s %s %s %s %s %s %sr6
z"cvm_backup_file_delete.sh %s %s %sz.cvm_backup_file_delete.sh %s %s %s %s %s %s %szEBuildup command line: cvm_backup_file_delete.sh %s %s %s %s @@@ %s %sz
Command build up failed. %s)
stripr
cmd_dictZ
cmd_liner%
pst_type
pst_pathZ
pst_resvZ	front_bakZ
pst_serverZ
pst_portZ
pst_userNameZ
pst_passwordZ
pst_dirZ
front_restore_pathr5
cvm_br_setup_cmd
rXd	}
qrt	d
Dir list is none
	BR_FAILEDr%
cvm_list
cvmBrr(
cic_list
cicBrr)
==========================
 Dir info XML build up failed. %s
BR_SUCCESS)
createDocument
documentElement
appendChild
createElement
createTextNoder'
toxmlr
new_dir_listrG
label_namer?
root
dirPathr
cvm_br_dirs_xml_print
rJd$|
nRd$|
]2} |
}$|#
}%n$t
d=|%
}(|'
d?t%
})~)W
})~)0
dAt%
|)j(dBk
})~)S
|)j(W
})~)S
})~)0
dAt%
})~)S
})~)0
)CNz
get ---------------- %s z
////r)
/z6cat /etc/cas_cvk-version | awk '{if(NR==1){print $3}}'r
BR_DIRECTORY_ERRORr8
ftpr<
echo -n %sTz
utf-8)
shell
encoding
LIST
BR_FTP_TRANSFER_1
BR_FTP_TRANSFER_2
BR_QUERY_FILE_LIST_NOT_DIRZ
501Z
BR_FTP_UNSUPORTTED_OPERATIONZ
BR_IO_FILE_NOT_EXISTED
scpz.expect /opt/bin/dir_list.exp %s@%s %s %s %s -a
z&Getting the remote ssh dir path empty.
z The backup directory %s is emptyr%
vm_listr&
uisz
^(UIS_INFO_BACK_%s)(\d{14})$z-Matched one dir: %s, and append into the listz/The directory %s is not matdched and ingnore itz
^(CVM_INFO_BACK_%s)(\d{14})$z
^(CIC_INFO_BACK_%s)(\d{14})$rK
namez
cvm_br_get_md5.sh %s %s %sz&cvm_br_get_md5.sh %s %s %s %s %s %s %sz
md5_info == %sZ
md5rQ
List the dir error %s 
util_cmds_output
osr+
existsr
listdirr=
subprocess
check_outputr
login
cwdr
	retrlinesr 
quit
split
socketr
find
IOError
matchrA
CalledProcessError
returncode)*rG
hostnamerH
	real_path
versionrX
dir_list
ftp_listr8
username
passwd
username_echo
passwd_echor`
root_dir
line
count
	error_msgZ
ioeZ
scp_cmd_line
resultZ
dir_list_tmpZ
dir_inforY
Z	file_pathZ
br_itemZ
element1Z
text1Z
md5_infoZ	md5_valueZ
element2Z
text2r
cvm_br_list(
}	|	
Build up the cmd line failedrL
/opt/bin/ms_info.sh hotbackupTrm
1z!the CVM is Hot Backup environmentz$crm status | grep OFFLINE >/dev/nullz
crm status | grep OFFLINE
crm status | grep OnlineZ
_crm_r]
failed to get local_hostname.z!/opt/bin/ms_info.sh peer hostnamez
failed to get peer_hostname.z%the CVM is not Hot Backup environmentz
failed to get hostname.Z
BR_UNKNOWN_DATA_FILE_FORMATz
cmd_process error)
callr|
sortrF
cmd_strZ
is_hot_backupZ
cmd_str1Z
is_offlineZ
offlineZ
offline_hostZ
cmd_str2Z
onlineZ
online_hostZ
hostname_listr
local_hostnameZ
peer_hostname_cmd_strZ
peer_hostnameZ
cmd_process
))Nr+
count = %rz
try to create path %srl
z8expect /opt/bin/dir_ssh_cd.exp %s@%s %s %s %s >/dev/nullr
z#remote host %s path %s is not existz<expect /opt/bin/file_ssh_mkdir.exp %s@%s %s %s %s >/dev/nullz
failed to create remote dirZ
BR_MAKE_DIRSz%pre_cmd_process done, path trun to %srg
BR_FTP_TRANSFER_3rk
BR_FTP_OPERATION_FAILEDrL
mkdr{
existr
timeoutr
Z	directoryr
retr
add_hostname_to_pathX
__main__
caslog/backup-restorez!CVM Backup and restore operationsr
/opt/binZ
BR_SHELL_PATH
PATHz	:/opt/binz
The input CMD xml %srR
xml.dom.minidomr>
ftplibr
Z	ftp_utilsr
util_sh_error_code_loaderZ
util_cvk_logZ
util_common_toolsr
__name__Z
cas_log_init3rA
argvZ
arg_nsr
environrD
SystemExitr
coderC
<module>
