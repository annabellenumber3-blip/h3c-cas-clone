# File: util_cvm_iscsi_node_conf.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/util.package/scripts/util_cvm_iscsi_node_conf.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

Z e!
e$_%e
e&e'e
Z*e e*_%n
,e-d 
d"d#
rLe2e
+d$e
j1e'e
d"d#
+d&e
Z4[4nFd
Z4[40
,e-d(
Z6[6n
Z6[60
,e-d)
ElementTreez:cat /etc/iscsi/initiatorname.iscsi | grep "InitiatorName="z$/opt/bin/ocfs2_iscsi_node_conf.sh %sZ
cvmInitiatorc
master
sparez'Parse initiatorname=%r form xml string.
UTIL_GET_INITIATORNAME_FAILED)
fromstring
find
text
g_initiatorname_dict
logging
debug
BaseException
error
util_error)
Z	xmlstring
root
master_node
master_initiatornameZ
spare_node
spare_initiatorname
util_cvm_iscsi_node_conf.py
get_initiatorname_from_xml1
__main__Z
cas_utilz7get or set the iscsi configure file initiatorname.iscsi)
description
mode
setz
Operation mode on initiatorname)
choices
helpz
--initiatorname
xmlstrz
initiatorname in xml format)
destr
input paremeters: %s
z Get current cvm initiatorname=%sr
=z Get standby cvm initiatorname=%sr
z$Can't get the standby cvm address:%sr
z*Fail to get initiatorname form xml string.T)
shellz3Fail to configure current cvm initiatorname, ret=%dz/Success to configure current cvm initiatorname.z3Fail to configure standby cvm initiatorname, ret=%dz/Success to configure standby cvm initiatorname.Z
UTIL_SET_INITIATORNAME_FAILEDZ
UTIL_SUCCESS)7
sysr
argparse
subprocessZ
util_cvk_logZ
util_sh_error_code_loaderZ
util_xml_commonZ
util_common_toolsZ	xml.etreer
INITIATORNAME_CMDZ
SET_INITIATORNAME_CMDr
ElementZ
g_xml_infor
__name__r
spare_ipZ
cas_log_init
ArgumentParser
parser
add_argumentr
argv
parse_args
argsZ
cvm_hot_backup_check
resultr
getInitiatorName
infoZ
SubElementr
util_cmds_outputZ
SSH_PARAMETERr
splitZ
spart_noder
exitr
dumpr 
callZ
errorcode_ocfs2_to_util
SystemExitZ
<module>
