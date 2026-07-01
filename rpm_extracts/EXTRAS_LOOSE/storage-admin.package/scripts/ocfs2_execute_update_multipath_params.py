# File: ocfs2_execute_update_multipath_params.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/storage-admin.package/scripts/ocfs2_execute_update_multipath_params.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

l	Z	d
Z!e!
Z$[$nJd
Z$[$0
!ocfs2_multipath_parameters_updatec
delete
value
	norestart)
selfr
(ocfs2_execute_update_multipath_params.py
__init__"
z*ocfs2_multipath_parameters_update.__init__c
devicesZ
deviceZ
multipathsZ	multipath
defaults)
get_unique_element
get_multi_element
remove_whole_elementr
config
devices_section
	dev_sects
element
m_sects
defauts_sectr	
delete_parameters-
z3ocfs2_multipath_parameters_update.delete_parametersc
r:q t
add_unique_elementr
change_parameter_valueO
z8ocfs2_multipath_parameters_update.change_parameter_valuec
ab+z
write %r to /etc/multipath.confz
udevadm trigger 1>/dev/nullT)
shellz+service multipath-tools restart 1>/dev/nullz4udevadm trigger, restart multipath service, ret = %dZ
OCFS2_MULTIPATH_CONF_FAILED
OCFS2_SUCCESS) 
openZ
MPATH_LOCKFILEZ
fcntlZ
flock
filenoZ
LOCK_EX
path
existsZ
MULTIPATH_CFGZ
init_default_config
shutil
copyZ
MULTIPATH_CFG_BAKZ
read_config_filer
logging
debugZ
write_config_fileZ
MULTIPATH_CFG_TMP
closer
subprocess
callZ
warning
IOError
error
ocfs2_error
BaseException)
lockfdr
do_operation
z.ocfs2_multipath_parameters_update.do_operationN)
__name__
__module__
__qualname__r
__main__Z
ocfs2z
caslog/storage-adminz
Multipath parameters update.T)
description
add_helpz
--delete
store_trueFz$Delete the parameters and its value.)
action
required
default
helpz
--keyz
The parameters name.)
--valuez*The value configured with parameter's namez
--norestartz
Without restarting multipath.z
Parameters errorZ
OCFS2_ERR_WRONG_PARAMr
sysr
stringr#
	traceback
timer&
stat
argparseZ
socket
util_cvk_logZ
util_sh_error_code_loaderZ
ocfs2_multipathr
cas_log_init3
args
ArgumentParser
parser
add_argument
parse_argsr+
betr)
exitr*
argvr
upmr/
SystemExitr-
format_excr	
<module>
