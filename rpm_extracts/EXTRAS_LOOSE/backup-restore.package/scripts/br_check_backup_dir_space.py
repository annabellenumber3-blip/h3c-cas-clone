# File: br_check_backup_dir_space.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/backup-restore.package/scripts/br_check_backup_dir_space.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

j#Z$e
j%Z&e
j'Z(e)e
j+Z+d
Z.e.d
/d e&e.f
Z1e.
Z2e2d#k
/d%e3e4f
Z5e5D
Z9e6d
e:e6
e+d&k
e3e6f
Z-e-d
sle-
!d'e6
/d)e6
Z<e<d
Z=e<d"
e3e6
Z?e?d
d,e6
e d-
$ZAe,e
eAe=e>e(d
d1e6
e d2
e(d3k
e(d4k
d5e6
/d6e6eBf
e(d&k
e(d7k
e(d8k
d9e6
/d6e6eCf
e:eC
ZDd0ZEd0ZFd0ZGeDD
]2ZHeH
ZIeID
ZJd;eJv
qVn&d<eJv
d=eJv
qVeE
d>eJv
/d?eJ
q&n^eF
d@eJv
/d?eJ
q&n.eG
rVd>eJv
rVe9
/d?eJ
qVeE
r6e8Z7
rFe9Z7
speF
speG
e dB
d0ZF
dCe(
/dDe!
e:e!
/dEe!
ZKeK
r$e,eMeK
s<eK
r\e,eMeK
Z,nReK
steK
e,eMeK
e,eMeK
/dOe,
dPe&
ZOeOd
e:eO
/dRe&eOf
ZPePd
eMeP
ZQeMe1
Z1eQd"e)e*
ZReRe,k
!dTe,eRf
dUe,eQe*f
e dV
ZT[TnFd
ZT[T0
e d-
ZV[Vn
ZV[V0
e dW
*z(/vms/.ms_backup/rbd-client/installed.txtz"/usr/lib64/python3.9/site-packageszFcat /vms/.ms_backup/rbd-client/installed.txt | awk -F ' ' '{print $1}'T)
shell
onestorZ
xskyZ
boke)
Rados)
Image
ImageNotFoundz
/etc/libvirt/qemu/z
/opt/binz-python /opt/bin/vm_xml_data_file_print.pyc %sz#python /opt/bin/find_disk.pyc %s %sz4python /opt/bin/get_conf_for_rbd_by_vm_xml.pyc %s %sc
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
space_limitedz': the limit times of the disk image sum
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
br_check_backup_dir_space.py
usage(
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
%sz/python /opt/bin/check_share_stor_by_path.pyc %sz%get directory allocated space failed.Z
BR_DIRECTORY_ERRORz
Get the dir %s pool info: %s
sharez
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
Required disk space: %sz2timeout 30s df -B1 %s | awk '{if(NR>1){print $2}}'z
get directroy failedz Get the dir %s capacity info: %sz
Get directroy failedzBThe required space is %s, the backup dir space is: %s. That is OK.zhThe required space is %s, the backup dir space is: %s and the limited coefficient is %d. That is NOT OK.Z
BR_BACKUP_DIR_SPACE_NO_ENOUGHZ
BR_SUCCESS)
subprocess
sysr
	tracebackZ
util_sh_error_code_loaderZ
util_cvk_log
path
exists
appendZ
check_output
decodeZ
rbd_type
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
Z	directoryr
intr
Z	sum_disksZ
tmp_disk_nameZ
share_infor$
splitZ
alloc_infoZ	pool_typeZ
xmlZ
disk_infosZ	disk_infoZ
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
dir_infoZ
capacity_infoZ	dir_spaceZ
dir_space_left
SystemExitZ
<module>
