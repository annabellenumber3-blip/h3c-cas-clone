# File: sa_multipath_conf_ch.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/storage-admin.package/scripts/sa_multipath_conf_ch.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

d	Z e
device_pathz
/etc/multipath.confz
/etc/multipath.conf.bakz
/etc/multipath.conf.tmpc
Multipath enable scripts.T)
description
add_helpz
--singlez
Single HBA or not)
required
default
helpz
--poolz
The name of storage pool
Parameters error
SA_PARAM)
argparse
ArgumentParser
add_argument
parse_args
BaseException
logging
error
exit
sa_error)
args
parserZ
sa_multipath_conf_ch.py
	arg_parse0
Unknownr
Get pool %s info failedz
The pool %s has no device pathz#/lib/udev/scsi_id --whitelist -u %s
z;get device:%s scsi_id from command /lib/udev/scsi_id failedz
get scsi_id from device pathz
/dev/disk/by-id/dm-name-z#get scsi_id from device path failed)	Z
get_pool_info
lenr
warning
DEVICE_PATHZ
util_cmds_output
splitr
	pool_nameZ
is_from_pathZ
naa_nameZ	pool_infoZ
dev_pathZ
dev_naa
listZ
get_naa_nameK
__main__Z
caslog/storage-adminr
get pool:%s scsi_id failedZ
SA_ERROR)
F)$r
string
	traceback
time
subprocessr
util_cvk_logZ
util_sh_error_code_loaderZ
util_common_toolsZ
sa_pool_infoZ
ocfs2_multipathr
MULTIPATH_CFGZ
MULTIPATH_CFG_BAKZ
MULTIPATH_CFG_TMPr
__name__Z
cas_log_init3r
debug
argvZ
arg_nsr
intZ
singleZ
single_hbaZ
poolr
is_forceZ	naa_valueZ
multipath_configZ
rtnr
<module>
