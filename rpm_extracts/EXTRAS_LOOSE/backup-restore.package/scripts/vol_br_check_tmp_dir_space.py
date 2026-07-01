# File: vol_br_check_tmp_dir_space.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/backup-restore.package/scripts/vol_br_check_tmp_dir_space.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

Z"e"
r\e"
Z'e%D
Z(e(
Z)e)D
Z*e*
q n0e'
q\e&
sTe'
Z-e-
e/e-
e/e-
nRe-
s*e-
e/e-
e/e-
d'e1
j!d(e
Z2e2
Z2e2d
Z3e3d
Z4e4e1k
d-e1e4f
d.e1e4f
Z6[6nFd
Z6[60
Z8[8n
Z8[80
Backup and RestoreT)
description
add_help
volume_namez
: disk's space of volume(must))
help
directroy_namez
: name of directroy(must)
backup_modez
: backup mode(must)
space_requiredz&: How many times of the disk image sum)
argparse
ArgumentParser
add_argument
parse_args
BaseException
logging
error)
args
parser
vol_br_check_tmp_dir_space.py
usage
__main__
caslog/backup-restorez
Parameter is error!Z
BR_WRONG_PARAMz
Geting the disk info: %sFz
disk(%s) not existZ
BR_IMG_NOT_EXISTz"qemu-img info --backing-chain '%s'T)
shellz
Disk %s space info: %sz
file format: qcow2z
file format: z
virtual size:z
Disk space line: %sz
disk size:z"file format can not be recognized!Z
BR_ERROR_FILE_FORMATz
Disk space info: %sz
Get the disk capacity info: %s
MiBi
Required disk space: %sz.timeout 30s df %s | awk '{if(NR>1){print $4}}'z
get directroy failedZ
BR_DIRECTORY_ERRORz Get the dir %s capacity info: %sz
Get directroy failedz@The required space is %s, the temp dir space is: %s. That is OK.zDThe required space is %s, the temp dir space is: %s. That is NOT OK.Z
BR_TEMP_DIR_SPACE_NO_ENOUGHZ	BR_FAILEDZ
BR_SUCCESS)9
subprocess
sysr
	tracebackZ
util_sh_error_code_loaderZ
util_cvk_logr
__name__Z
cas_log_init3
nargsr
exitZ
br_error
info
argvr
diskr
Z	directroyr
mode
intr	
Z	sum_disksZ
tmp_disk_name
debug
spaceZ	raw_space
path
existsZ
check_outputZ
decode
splitZ
segment_setZ
raw_flagZ
qcow2_flagZ
segmentZ
segment_lines
line
startswith
appendZ	space_tmp
endswith
float
rsplitZ
required_spaceZ
dir_infoZ
capacity_infoZ	dir_space
SystemExitZ
<module>
