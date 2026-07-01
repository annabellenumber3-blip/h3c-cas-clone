# File: ocfs2_disk_layout.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/storage-admin.package/scripts/ocfs2_disk_layout.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

OCFS2 Disk layout tools.T)
description
add_helpz
--pathz
The absolute path of the file)
required
default
help
Parameters error
argparse
ArgumentParser
add_argument
parse_argsZ
BaseExcept
logging
error
exit)
args
parser
ocfs2_disk_layout.py
	arg_parse
Nz3mount |grep -w ocfs2 |grep \ %s\ | awk '{print $1}'r
path
split
util_cmds_output
BaseExceptionr
getmessage)
Z	path_infoZ
dev_info
efir
parse_info_from_absolute_path6
z&/sbin/debugfs.ocfs2 -R "stat -n %s" %sr	
parsed_infor
get_file_layoutA
__main__Z
ocfs2z
caslog/storage-adminr
OCFS2_ERR_WRONG_PARAMz%Get the disk info of %s layout fialedZ
OCFS2_SUCCESS) r
stringr
	traceback
time
subprocess
statr
util_cvk_logZ
util_sh_error_code_loaderZ
util_common_toolsr
__name__Z
cas_log_init3
debug
argvZ
arg_nsr
ocfs2_errorr
layout_infoZ
layout
print
SystemExitZ
format_excr
<module>
