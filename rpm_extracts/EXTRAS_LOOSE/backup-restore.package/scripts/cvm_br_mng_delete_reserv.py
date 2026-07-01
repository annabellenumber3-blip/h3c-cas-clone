# File: cvm_br_mng_delete_reserv.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/backup-restore.package/scripts/cvm_br_mng_delete_reserv.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

Z"e"d
nle"d
rve"d
n8e"d
j!d!
j!d!
Z%e%d"k
j!d#
j!d$
Z'e'd
e(e$
e$e&e'
Z)e)d
n0e%d%k
sRe%d&k
j!d#
j!d$
j!d'
j!d(
j!d)
Z'e'd
d*e$e%e+e,e-e&e
j!d)
e(e$
e%d%k
e$e+e(e,
e-e.e&e'
Z)e)d
Z*e%d&k
e$e+e,e-e.e&e'
Z)e)d
/d+e0
z4e3j4e
Z3[3nJd
Z3[30
Z7[7n
Z7[70
getDOMImplementation)
FTP)
FtpUtil)
error_temp)
error_perm)
rmtree
copy)
NAMEz
	 $0 - Delete reserved pathsZ
SYNOPSISz?	 $0 -h|reserver_number type server port user password path dirZ
DESCRIPTIONz
	 -h Help and usagez!	 reserver_number reserver numberz
	 type backup typez
	 server server ip or host namez
	 port ftp server portz
	 user user namez
	 password user passwordz
	 path path on the serverz!	 dir directory on the ftp server)
print
cvm_br_mng_delete_reserv.py
usage4
^(%s)(_\d{14})$z-Matched one dir: %s, and append into the listz/The directory %s is not matdched and ingnore itT)
reversez
Directory: %s will be deleted
%s%s
deleting contents in dir(%s)...
scpz
%s%s >/dev/null
shellz
Directory: %s delete failedz!Directory: %s delete successfullyz
Directory: %s deleted failed
	BR_FAILED
BR_SUCCESS)
strip
split
match
append
logging
debug
sort
warningr
nlst
deleteZ
subprocess
call
BaseException
br_error
error
	traceback
format_exc)
reserv_num
dir_list
path_prefixZ
op_typeZ
op_objZ
new_dir_listZ
dir_for_delete
dir_infoZ
begin_index
size
files
betr
dir_reserv_deletR
 The backup directory %s is emptyr
listdirr
endswithr8
backup_dirr0
cp_reserv_process
%s/r
loginr
cwdr5
quitr)
ftp_serverZ
ftp_portZ
ftp_userZ
ftp_passwdr=
root_dirr/
ftp_dir_listr1
dir_elr6
ftp_reserv_process
}	|	
}	|	d
	d	|
\"z6expect $BR_SHELL_PATH/dir_list.exp %s@%s %s "%s" %s -aTr
z:expect $BR_SHELL_PATH/br_scp_path_del.exp %s@%s %s "%s" %sr
replacer'
check_output
decoder*
scp_serverZ
scp_portZ
scp_userZ
scp_passwdr=
expect_cmdr/
resultZ
del_cmdr7
scp_reserv_process
CVMZ
cvmBrZ
CICZ
cicBrZ
UISr5
z#the info of delete dir list xml: %sz Dir info XML build up failed. %sr
createDocumentZ
documentElementZ
appendChildZ
createElementZ
createTextNoder!
toxmlr
del_dir_list
elementZ
label_nameZ
rootZ
dirPathr7
cvm_del_dirs_xml_print
__main__r
caslog/backup-restorez!CVM Backup and restore operations
BR_WRONG_PARAMz
Error parameters
z input: %s %s %s %s %s @@@ %s %s z
SSH reserv process failed %sz
CVM dir delete failed.r
sysr:
xml.dom.minidomZ
xmlr,
ftplibr
Z	ftp_utilsr
shutilr
util_cvk_logZ
util_sh_error_code_loaderZ
util_common_toolsr
__name__r*
rtn_codeZ
cas_log_init3r!
argvZ
exitr.
back_styler=
Z	rtn_tupleZ
rtn_listZ
server
port
user
passwdr%
SystemExitZ
coder-
<module>"
