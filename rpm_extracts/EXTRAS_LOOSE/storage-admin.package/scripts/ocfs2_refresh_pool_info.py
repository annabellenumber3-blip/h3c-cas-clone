# File: ocfs2_refresh_pool_info.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/storage-admin.package/scripts/ocfs2_refresh_pool_info.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

Z&e'e&
#d!e
Z)e(d
Z+e+D
Z,e)e,
e(e,
Z-e-d
r$e-e
d#e,e-f
npe-d
.d$e,e-f
.d&e,e-f
e/e,
e)e,
rHd)Z0e
j1e0d'd*
Z,e3d,
]RZ4e
e5e,
.d-e,
d.e,e4f
e2d,k
e&d1
Z8e8d
e7e8
Z-e-e
.d2e&d1
.d4e&d1
e8e7f
Z:[:n@d
Z:[:0
Z<[<n
Z<[<0
}	~	n
}	~	0
lun_list
lunsz7ls -lt %s | awk '{print $11}' | awk -F '/' '{print $3}'z
Fail to get device name.
OCFS2_ERR_WRONG_PARAMz(echo 1>/sys/class/block/%s/device/rescanz
rescan device %s.
OCFS2_REFRESH_LUN_FAILED)
util_cmds_output
logging
error
ocfs2_error
debug
BaseException)
	pool_dict
retr
lun_dictr
cmdLine
result
dev_name
ocfs2_refresh_pool_info.py
refresh_device_capacity,
capacityz-Get pool lun capacity before refresh pool: %s)
setdefaultr
lun_capacityr
get_lun_capacity_before_refreshR
z,Get pool lun capacity after refresh pool: %s)
get_path_capacityr
pathr
get_lun_capacity_after_refreshn
z Get total lun capacity: %d bytes)
cap_dict
total
keyr
get_total_lun_capacity
}	~	n
}	~	0
)	Nr
fsck.ocfs2 -S %sz
Number of blocks:
Block size:
z#Get device %s fs capacity: %d bytes)	r
find
split
intr
fs_size
resultsZ
str_lineZ
blocks_listZ
number_blocksZ	size_listZ
block_sizer
get_file_system_capacity
__main__Z
OCFS2_SUCCESSFZ
ocfs2z
caslog/storage-adminz
refresh the capacity of pool)
description
	pool_namez
Storage pool name)
helpz
input parameters: %s
/etc/libvirt/storage/%s.xmlz
refresh pool xml file %sz1Storage pool %s or configure file does not exist.r
parse storage pool %s failed.z,Get pool lun capacity before refresh pool...z
refresh pool %s failed.z+Get pool lun capacity after refresh pool...z
lun %s have no change, diff:%d.z
lun %s have shrunk, diff:%d.Z
OCFS2_LUN_CHANGE_SMALLz
lun %s have extend, diff:%d.TZ
OCFS2_LUN_CHANGE_LARGEz
service multipath-tools restart)
shellz service multipath-tools restart.
z-refresh multipath %s failed, wait one second.z2refresh multipath %s successfully, used %d secondsz*refresh all multipath failed in 30 secondsr
device_pathz;device %s has been extended more than 10G offline, diff:%d.Z
OCFS2_LUN_CHANGE_LARGE_OFFLINEz'get device %s ocfs2 size failed: %d/%d.)=
time
stringr
subprocess
	traceback
argparseZ
util_sh_error_code_loaderZ
util_common_toolsZ
util_cvk_logZ
ocfs2_tunefs_sizeZ	TUNE_SIZEr
__name__r
multipath_flagZ
mp_dictZ
cas_log_init3
ArgumentParser
parser
add_argumentr
argv
parse_args
argsr.
xml_filer
existsr	
exitZ
get_ocfs2_pool_lun_infor
oldLunCapacityZ
newLunCapacity
keysZ
lunKeysr 
diffZ
warningZ
DEVICE_MULTIPATHr
check_callZ
total_time
range
sleepZ
phy_szZ
fs_sz
SystemExitZ
<module>
