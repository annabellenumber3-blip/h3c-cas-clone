# File: cvm_br_mng.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/backup-restore.package/scripts/cvm_br_mng.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

Z!e"d
Z%e%d
'e(d!
j)d#<
j)d$
j)d$<
Z*e%j
Z-e-
Z/d'e/_0
j1e-d(d)
Z+e+d
$d*e+
'e e*
z4e3j4e(d+
Z3[3nJd
Z3[30
'e(d,
Z7[7n
Z7[70
'e(d+
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
cvm_br_mng.py
	arg_parse1
nodeTypeZ	TEXT_NODE
append
data
join)
nodelist
noder
get_textJ
r&t	t
r@d#|
opTyper
platformTypeZ
print
	cic_print
dirZ
position
type
path
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
encrypt_security_provider
encrypt_securityZ
verify_security_provider
verify_security
delete
server
port
userName
password
username is %s
@@@r
domZ
minidomZ
parseStringr$
getElementsByTagNameZ
childNodes
strZ
ipcompat_get_compat_ipr
info
copy
debugr
	traceback
format_excr
cmd_xmlZ
command_dictZ
cmd_domZ
position_nodeZ
command_infor
command_parse_
)'Nr%
z&cvm_br_mng_backup.sh %s %s %s %s %s %sr&
z2cvm_br_mng_backup.sh %s %s %s %s %s %s %s %s %s %szIBuildup command line: cvm_br_mng_backup.sh %s %s %s %s @@@ %s %s %s %s %sr1
z'cvm_br_mng_restore.sh %s %s %s %s %s %sr5
z*cvm_br_mng_restore.sh %s %s %s %s %s %s %sz-cvm_br_mng_restore.sh %s %s %s %s %s %s %s %sz3cvm_br_mng_restore.sh %s %s %s %s %s %s %s %s %s %szJBuildup command line: cvm_br_mng_restore.sh %s %s %s %s @@@ %s %s %s %s %sz6cvm_br_mng_restore.sh %s %s %s %s %s %s %s %s %s %s %sz9cvm_br_mng_restore.sh %s %s %s %s %s %s %s %s %s %s %s %sr8
z"cvm_backup_file_delete.sh %s %s %sz.cvm_backup_file_delete.sh %s %s %s %s %s %s %szEBuildup command line: cvm_backup_file_delete.sh %s %s %s %s @@@ %s %sz
Command build up failed. %s)
stripr
cmd_dict
cmd_liner%
pst_type
pst_pathZ
pst_resvZ	front_bakZ
pst_serverZ
pst_portZ
pst_userNameZ
pst_passwordZ
security
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
new_dir_listrN
label_namerB
root
dirPathr
cvm_br_dirs_xml_print
r(d |
d!d"
nbd |
d!d"
 d*|
qrnN|
 d-|
 d.|
]:} |
}$|#
}%n$t
d:|%
}%|%d
}(|'
d<t)
})~)W
})~)0
z2|)j,d>k
})~)S
|)j,W
})~)S
})~)0
})~)S
})~)0
)@Nr*
/z6cat /etc/cas_cvk-version | awk '{if(NR==1){print $3}}'r
BR_DIRECTORY_ERRORr:
ftpr?
echo -n %sT
shell
LIST
BR_FTP_TRANSFER_1
BR_FTP_TRANSFER_2
BR_QUERY_FILE_LIST_NOT_DIRZ
501Z
BR_FTP_UNSUPORTTED_OPERATIONZ
BR_IO_FILE_NOT_EXISTED
scpz.expect /opt/bin/dir_list.exp %s@%s %s %s %s -a
'z&Getting the remote ssh dir path empty.
z The backup directory %s is emptyr%
uisz
^(UIS_INFO_BACK_%s)(\d{14})$z-Matched one dir: %s, and append into the listz/The directory %s is not matdched and ingnore itz
^(CVM_INFO_BACK_%s)(\d{14})$z
^(CIC_INFO_BACK_%s)(\d{14})$rT
namez
cvm_br_get_md5.sh %s %s %sz&cvm_br_get_md5.sh %s %s %s %s %s %s %sz
md5_info == %sZ
md5rZ
List the dir error)-rM
util_cmds_output
osr+
existsr
listdirrE
subprocess
check_output
decoder
login
cwdr
	retrlinesr 
quit
split
socketr
find
IOError
replace
matchr
CalledProcessError
returncode)*rN
hostnamerP
	real_path
versionrb
dir_list
ftp_listr:
username
passwd
username_echo
passwd_echorj
root_dir
line
count
	error_msgZ
ioeZ
scp_cmd_line
resultZ
dir_list_tmpZ
dir_inforc
Z	file_pathZ
br_itemZ
element1Z
text1Z
md5_infoZ	md5_valueZ
element2Z
text2r
cvm_br_listC
!Failed to add hostname to path %s
Build up the cmd line failedrU
failed to get hostname.
CVM br mng operation failed %s
cmd_process error)
add_hostname_to_pathr
callr
origPath
rtnr
ops_download
}	nt|
}	n2|
}	nt|
}	n2|
) Nr
_crm_rg
Z	upl_printrV
ls %s >/dev/nullrj
z;python /opt/bin/ftp_list_fils.pyc %s %s %s %s %s >/dev/nullz9expect /opt/bin/dir_list.exp %s@%s %s %s %s -d >/dev/nullTrl
ls %sz
get_hostname error)
list
ranger
remover
hostname_listr
Z	host_listr
host_name_peerZ
host_all
backup_dirrO
get_hostnameI
}	|	d
)#Nr
'null'r>
/opt/bin/ms_info.sh hotbackupTz
utf-8)
encoding
1z!the CVM is Hot Backup environmentr
failed to get local_hostname.z!/opt/bin/ms_info.sh peer hostnamez
failed to get peer_hostname.z
after sortz%the CVM is not Hot Backup environmentrl
sortr
cmd_strZ
is_hot_backupZ
local_hostnameZ
peer_hostname_cmd_strZ
peer_hostnamer
Z	issuccessr
pst_dir_listrO
cmd_process
)+Nr+
count = %rz
try to create path %srv
z8expect /opt/bin/dir_ssh_cd.exp %s@%s %s %s %s >/dev/nullrw
z#remote host %s path %s is not existz<expect /opt/bin/file_ssh_mkdir.exp %s@%s %s %s %s >/dev/nullz
failed to create remote dirZ
BR_MAKE_DIRSz%pre_cmd_process done, path trun to %srq
BR_FTP_TRANSFER_3ru
BR_FTP_OPERATION_FAILEDrU
mkdr
existr
timeoutr
Z	directoryr
retr
__main__
caslog/backup-restorez!CVM Backup and restore operationsr
/opt/binZ
BR_SHELL_PATH
PATHz	:/opt/binr=
unicode)
The input CMD xml %sr[
xml.dom.minidomrA
xml.etree.ElementTreeZ
etreeZ
ElementTreeZ
ftplibr
Z	ftp_utilsr
util_sh_error_code_loaderZ
util_cvk_logZ
util_common_toolsZ
br_ipcompat_utilr
__name__Z
cas_log_init3rG
arg_nsr
environrJ
display_xmlZ
fromstringrd
iterZ
password_elem
textZ
tostring
SystemExitr
coderI
<module>
