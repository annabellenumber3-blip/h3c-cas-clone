# File: br_check_space.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/backup-restore.package/scripts/br_check_space.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

Z d d!
Z!d"d#
Z"d$d%
Z#e$d&k
r8e%d'd(
&d)e
Z(z`e(j)d*k
rhe e(
Z*n:e(j)d+k
Z*n$e(j)d,k
e"e(
e+d-e,d.
e-e.e*
1e/j2
Z/[/nFd
Z/[/0
1e,d/
Z/[/n
Z/[/0
1e,d0
pprint)
*z(/vms/.ms_backup/rbd-client/installed.txtz"/usr/lib64/python3.6/site-packageszFcat /vms/.ms_backup/rbd-client/installed.txt | awk -F ' ' '{print $1}'T
shell
onestorZ
xskyZ
boke)
Rados)
Image
ImageNotFoundz
/etc/libvirt/qemu/z
/opt/binz.python3 /opt/bin/vm_xml_data_file_print.pyc %sz$python3 /opt/bin/find_disk.pyc %s %sz5python3 /opt/bin/get_conf_for_rbd_by_vm_xml.pyc %s %sc
rbd:%s/%s@%s size is %fkBz
rbd:%s/%s size is %fkB
Image %s/%s has no parent)	Z
open_ioctxr
size
logging
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
imager
parent
br_check_space.pyr
rrqJ|
q<nB|
q<n |
rL|	}
).Nr
.xmlTr
Geting the xml %s info: %sr
rbd:z5Disk %s is rbd, not going to check whether path exist
find no configfile for %sz
Config of '%s:%s' is not exist
	BR_FAILED
conffileFz
disk(%s) not existz
Image '%s:%s' is not existZ
BR_IMG_NOT_EXISTr
Disk %s no need to backupZ
22z$qemu-img info %s | grep "disk size:"z
Disk %s space info: %sz"qemu-img info --backing-chain '%s'z
file format: rawz
file format: qcow2z
file format: luksz
virtual size:z
disk size:z2The format of image '%s:%s' can not be recognized.Z
BR_ERROR_FILE_FORMATz
Get the disk capacity info: %s
MiBr
subprocess
check_output
DATA_FILE_CMD
decoder
split
startswith
GET_RBD_CONFIG_FILE_CMD
error
Cbt_Exception
br_errorr
replacer
path
exists
FIND_DISK_CMD
stripr
append
endswith
float
rsplit)
backup_diskr
	sum_disksZ
xmlZ
disk_infosZ	disk_infoZ
disk
spaceZ	raw_spaceZ
luks_spaceZ
arrr
configr
tmp_disk_nameZ
space_infoZ
fmtZ
segment_setZ
raw_flagZ
qcow2_flagZ	luks_flagZ
segmentZ
segment_lines
liner
Z	space_tmpr
get_backup_size:
Required tmp disk space: %s)
int)
vmnamer:
compressedr;
required_spacer
do_calculate_tmp_space_needed
!--vmname argument cannot be empty
BR_WRONG_PARAM
&--backup-disk argument cannot be empty)
argsr
calculate_tmp_space_needed
Nz.timeout 30s df %s | awk '{if(NR>1){print $4}}'Tr
z-Failed to get dir space by executing cmd '%s'z"Get the dir '%s' capacity info: %sz
No available size for cmd '%s')
CalledProcessError
	exception)
cmdZ
dir_infoZ
avail_size
get_dir_space
"--tmp-dir argument cannot be emptyrD
Total tmp dir '%s' space: %s)
tmp_dirr.
str)
get_tmp_dir_space
[2][0][0-9]\{12\}_[012]r
^%s_%sz	^%s_%s_%sz
ls %s | grep "%s" | sortTr
cmd: %s, dirs: %sr
Latest backup dir '%s'z
du -B1 %s/%s | awk '{print $1}'z&Current used space of task '%s:%s': %sz7Not found the lastest directory matching the regex '%s'r
)	r%
)	r@
timestamp_regZ	regex_strrK
dirsZ
latest_backup_dirZ	used_sizer
do_get_cur_used_space
get_cur_used_space
commandz5get-tmp-space|get-tmp-space-needed|get-tmp-space-used)
helpz
--vmnamez
vm namez
--backup-diskr
z=0: backup whole vm; vda: the disk to backup. defualt value: 0)
defaultrW
z	--tmp-dirz!specifies the temporary directoryz
--modez
backup mode, 0|10|11|20|22z
--compressedr
z-0: disable compression; 1: enable compression)
type
choicesrW
argparse
ArgumentParser
add_argumentr?
parse_args)
parserr
parse_arguments
__main__
caslog/backup-restorez
get-tmp-spacez
get-tmp-space-neededz
get-tmp-space-usedz
Invalid command parameterrD
BR_SUCCESS)
N)4r1
sysr
	tracebackr
cbt_publicZ
util_sh_error_code_loaderZ
util_cvk_logr2
rbd_typer(
radosr
rbdr
PATHr'
__name__Z
cas_log_init3r
argvrG
retr.
printrP
exitZ
err_code
	Exceptionr
<module>
