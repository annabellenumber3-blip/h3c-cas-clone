# File: ocfs2_do_lock_mode_switch.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/storage-admin.package/scripts/ocfs2_do_lock_mode_switch.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

d%e	e
d'e!k
Z#[#nFd
Z#[#0
Z%[%n
Z%[%0
Nz1OCFS2 lock mode switch(between dlm and disklock).T)
description
add_helpz
--device
+Fz"The device(s) need to be converted)
nargs
default
required
helpz
--auto
Auto detect all ocfs2 disk)
constr
--type
disklockz
Lock type, dlm or disklock)
choicesr
z(Both -d and -a are setted. -d: %s -a: %sz
Parameters error. %s
OCFS2_ERR_WRONG_PARAM)
argparse
ArgumentParser
add_argument
parse_args
logging
debug
device
auto
BaseException
error
argv
exit
ocfs2_error)
parser
args
ocfs2_do_lock_mode_switch.py
	arg_parse
debugfs.ocfs2 -R stats %sT
shell
z	result:%sz
Disk Lock Switch:
yesr
z&The ocfs2-tools is old, please update.)	
subprocess
check_output
strip
splitr
lowerr
result
super_block
detail
switch
	lock_type
betr 
get_current_lock_type
q.d	}
Feature Incompat:
z	disk-lockr
Device %s disk format %s)	r*
formatr/
featurer5
get_ocfs2_disk_format-
)	Nz
mounted.ocfs2 -f %sTr$
not mountedFz
Device %s mounted.
 %s)
findr
warningr
statusZ
mountedr5
get_device_mount_statusA
qxq*d
sg_vpd -p bl %sTr$
z maximum compare and write lengthr7
0F)	r*
Z	supportedr5
get_device_caw_statusQ
Block Size Bits:r'
intr
block_bitsr5
get_fs_block_bitsf
mounted.ocfs2 -fTr$
OCFS2 device found:%sz
/dev/mapperr
No ocfs2 devices foundz
OCFS2 device will be handled:%s)
append
lenr=
devsr/
ocfs2_devicesr
find_all_ocfs2_deviceu
)	NZ
offZ
tunefs.ocfs2 --disk-lock %s %sTr$
z4Successfully change lock mode to %s , the cmd is: %sF
locktyper3
change_lock_mode
Nz&tunefs.ocfs2 --fs-feature disk-lock %sTr$
z8Successfully change disk format to dlock, the cmd is: %sFrG
convert_to_dlock_format
lsblk -o FSTYPE %sTr$
ocfs2F)
fstyper5
is_ocfs2_disk
__main__
caslog/storage-adminz
Parameters errorr
z:Parameters error. Some device(s) not fomartted as OCFS2:%sz2Device %s current lock mode is %s, no need change.r
z-Device(%s) is mounted, please umount manuallyZ
OCFS2_DEV_BUSY_NOWz(Device(%s) change lock mode to %s failedZ
OCFS2_FAILEDz1Device(%s) not support CAW, can not use disk-lock
z:Device(%s) fs block size is not 4KB, can not use disk-lockr
z3Device(%s) convert disk format to disk-lock failed!z'Get device(%s) ocfs2 disk format failedZ
OCFS2_SUCCESS)&r
util_cvk_logZ
util_sh_error_code_loaderr
__name__Z
devicesZ
not_supported_deviceZ
target_lock_typeZ
cas_log_init3r
typer4
SystemExitZ
<module>
