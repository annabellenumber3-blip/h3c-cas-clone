# File: br_check_temp_dir_space_with_rbd.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/backup-restore.package/scripts/br_check_temp_dir_space_with_rbd.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

j#Z$e
j%Z&e
j'Z(e)e
j+Z+d
Z/e/
e.e/f
Z2e2D
Z6e3d
e7e3
e.e3f
Z-e-
Z-e-d
!d e3
0d"e3
Z9e9d
Z:e9d$
e.e3
Z<e<
Z<e<d
d&e3
e d'
$Z>e,e
e>e:e;e(d
d+e3
e d,
e(d-k
s4e(d.k
d/e3
Z?e?
0d0e3e?f
e(d1k
e(d2k
d3e3
Z@e@
0d0e3e@f
r>e7e@
r>e@
ZAd*ZBd*ZCd*ZDeAD
]2ZEeE
ZFeFD
ZGd5eGv
n&d6eGv
d7eGv
rld8eGv
rle5
0d9eG
n^eC
d:eGv
0d9eG
n.eD
d8eGv
0d9eG
e5Z4
q>eD
e6Z4
q>eB
e d<
d*ZC
d=e(
0d>e!
rBe7e!
0d?e!
ZHeH
e,eJeH
e,eJeH
Z,nReH
r@e,eJeH
e,eJeH
e,e*
0dIeL
dJe&
ZMeMd
e7eM
e dL
0dMe&eMf
ZNeNd
e7eN
e7eNd
e dL
e)eNd
ZOeOeLk
!dOeLeOf
dPeLeOf
e dQ
ZQ[QnFd
ZQ[Q0
e d'
ZS[Sn
ZS[S0
e dR
*z(/vms/.ms_backup/rbd-client/installed.txtz"/usr/lib64/python3.6/site-packageszFcat /vms/.ms_backup/rbd-client/installed.txt | awk -F ' ' '{print $1}'T)
shell
onestorZ
xskyZ
boke)
Rados)
Image
ImageNotFoundz
/etc/libvirt/qemu/z
/opt/binz.python3 /opt/bin/vm_xml_data_file_print.pyc %sz$python3 /opt/bin/find_disk.pyc %s %sz5python3 /opt/bin/get_conf_for_rbd_by_vm_xml.pyc %s %sc
Backup and RestoreT)
description
add_help
vm_namez
: disk's space of vm(must))
help
directroy_namez
: name of directroy(must)
backup_suffixz
: backup mode(must)
space_requiredz&: How many times of the disk image sum
backup_diskz
: backup disk)
argparse
ArgumentParser
add_argument
parse_args
BaseException
logging
error)
args
parser
#br_check_temp_dir_space_with_rbd.py
usage+
rbd:%s/%s@%s size is %fkBz
rbd:%s/%s size is %fkB
Image %s/%s has no parent)	Z
open_ioctxr
sizer
debugZ
parent_info
get_rbd_spacer
info)	
cluster
	pool_name
image_name
modeZ
snapZ
ioctxZ
imager#
parentr
__main__
caslog/backup-restorez
Parameter is error!Z
BR_WRONG_PARAMz
.xmlz
Geting the xml %s info: %sr
Disk %s no need to backupz
rbd:z5Disk %s is rbd, not going to check whether path exist
find no configfile for %sZ	BR_FAILED
conffileFz
disk(%s) not existZ
BR_IMG_NOT_EXISTZ
22z$qemu-img info %s | grep "disk size:"z
Disk %s space info: %sr
z"qemu-img info --backing-chain '%s'z
file format: rawz
file format: qcow2z
file format: luksz
virtual size:z
Disk space line: %sz
disk size:z"file format can not be recognized!Z
BR_ERROR_FILE_FORMATz
mode error: %sz
Disk space info: %sz
Get the disk capacity info: %s
MiBr
Required disk space: %sz2timeout 30s df -B1 %s | awk '{if(NR>1){print $4}}'z
get directroy failedZ
BR_DIRECTORY_ERRORz Get the dir %s capacity info: %sz
Get directroy failedz@The required space is %s, the temp dir space is: %s. That is OK.zDThe required space is %s, the temp dir space is: %s. That is NOT OK.Z
BR_TEMP_DIR_SPACE_NO_ENOUGHZ
BR_SUCCESS)
subprocess
sysr
	tracebackZ
util_sh_error_code_loaderZ
util_cvk_log
path
exists
appendZ
check_outputZ
rbd_type
decode
stripZ
radosr
rbdr
PATHZ
DATA_FILE_CMDZ
FIND_DISK_CMDZ
GET_RBD_CONFIG_FILE_CMDr
__name__Z
cas_log_init3
nargsr
exitZ
br_errorr&
argvr
Z	directroyr
intr
Z	sum_disksZ
tmp_disk_nameZ
xmlZ
disk_infosr$
splitZ	disk_infoZ
disk
spaceZ	raw_spaceZ
luks_space
startswithZ
arrr(
config
replacer'
space_infoZ
fmtZ
segment_setZ
raw_flagZ
qcow2_flagZ	luks_flagZ
segmentZ
segment_lines
lineZ	space_tmp
endswith
float
rsplitZ
required_spaceZ
dir_infoZ
capacity_infoZ	dir_space
SystemExitZ
<module>
