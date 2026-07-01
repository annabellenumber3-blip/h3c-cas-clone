# File: util_cvm_lun_session.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/util.package/scripts/util_cvm_lun_session.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

Z#[#n@d
Z#[#0
Z'['n
Z'['0
NFz0iscsiadm -m session | grep %s | awk '{print $2}'T
shell
]z>ls /sys/class/iscsi_session/session%s/device/ | grep "^target"
targetz'ls /sys/bus/scsi/devices/ | grep "^%s:"z
/sys/bus/scsi/devices/%s/block/z"ls /sys/bus/scsi/devices/%s/block/z+/opt/bin/dev_not_busy_test /dev/%s; echo $?z;Target %s has busy device %s, so it can not logout session.)
subprocess
check_output
decode
strip
split
path
isdir
logging
warning
BaseException
error)
flag
outputZ
result_session
elementZ
sessionZ
result_targetsZ
target_num
hostZ
result_busZ
bus_target_lunsZ
lunZ	block_dirZ
result_deviceZ
device
result
util_cvm_lun_session.py
iscsi_logout_check'
Tz,/opt/bin/ocfs2_iscsi_node_startup.sh 0 %s %sr
zRThe iSCSI server can not discovery on current cvm, fail to logout session, ret=%d.z/iscsiadm -m node -T %s -p %s -u >/dev/null 2>&1z iscsi logout -T %s -p %s failed.Z
UTIL_ISCSI_LOGOUTz&iscsi logout -T %s -p %s successfully.
UTIL_LUN_SESSION_FAILED)	r"
call
errorcode_ocfs2_to_utilr
util_errorr
ip_addrr	
iscsi_logout_session\
qft	|
z,/opt/bin/ocfs2_iscsi_node_startup.sh 1 %s %sTr
zQThe iSCSI server can not discovery on current cvm, fail to login session, ret=%d.z%iscsi login -T %s -p %s successfully.z8fdisk -l %s 2>>/dev/null | grep "Disk\ %s" | awk {print}
z$find iscsi lun %s used %d second(s).
z,Can not find the iscsi lun %s in %d seconds.Z
UTIL_DISK_NOT_EXISTEDr#
UTIL_SUCCESS)
info
lun_pathr
time
sleepr&
loopr
lun_sizer
iscsi_login_session
__main__Z
cas_utilz,If device path not exist, login the session.)
description
modeZ
loginZ
logoutz
login the session.)
choices
helpr-
logout the session.)
Input parameters: %s
-iscsi-z
-lun-z
ip-z
:3260z%Device path is %s, login the session.z:Device path %s is exist, check whether logout the session.z>Device path %s is not exist, it is already logout the session.r+
z+iSCSI session operation mode %s, result=%s.)(r
sysr
argparser
util_cvk_logZ
util_sh_error_code_loaderZ
util_common_toolsr"
__name__r
cas_log_init
ArgumentParser
parser
add_argument
debug
argv
parse_args
argsr-
rsplitZ
target_lunr	
existsr&
SystemExitZ
exitr
<module>
