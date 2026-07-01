# File: sa_multipath_enable.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/storage-admin.package/scripts/sa_multipath_enable.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

j"Z#e$e!e#
Z%e%d
rpe#D
]FZ&e
Z%e%d
Multipath enable scripts.T)
description
add_helpz
--singlez
Single HBA or not)
required
default
helpz
-nz	--naalist
The NAA of the disk)
nargsr
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
sa_multipath_enable.py
	arg_parse+
z8ls -dal /dev/disk/by-id/* | grep %s | egrep "dm-name-%s"z
multipath -ll | grep %sz$udevadm trigger --sysname-match=dm-*z
multipath -f %sz
multipath -r %sc
z&get dm path %s, total used %d seconds.)
time
sleep
util_cmds_output
DM_NAA_PATH_CMD
lenr
debugr
	naa_valueZ
check_timesZ
looptime
naa_dm_info
check_multipath_symlinkM
NTF)
CHECK_MULTIPATH_CREATED_CMDr
retr%
check_multpath_createdk
Remove map %s, ret=%sz
Reload map %s, ret=%s)
REMOVE_MULTIPATH_MAPr
RELOAD_MULTIPATH_MAPr
reload_multipath_map
}	~	S
}	~	0
Tz]multipath created but not found multipath device symlink,reload map and call udevadm trigger.
Get naa %s path info failed.Z
SA_MULTIPATH_CONFr
/z#Get naa %s path info failed, dm_devz
/dev/%sz*multipah check error, stat /dev/%s failed.
SA_SUCCESSZ
SA_ERROR)
UDEVADM_TRIGGER_CMDr
warningr
split
stat
st_mode
S_ISBLK
print
SystemExitr
dm_name_infoZ
dm_devZ
dm_dev_real_info
modeZ
dm_naa_pathZ
ser%
multipah_path_check
__main__Z
caslog/storage-adminr
z"multipath conf file changed failedr
z result of cancle multipath is %d))r
string
	tracebackr
subprocessr
util_cvk_logZ
util_sh_error_code_loaderZ
util_common_toolsZ
sa_multipath_conf_chr
__name__Z
cas_log_init3r
argvZ
arg_nsr
singleZ
single_hbaZ
naalistZ
naa_listZ
multipath_configZ
rtnZ
naaZ
cancle_rtn
infor
<module>
