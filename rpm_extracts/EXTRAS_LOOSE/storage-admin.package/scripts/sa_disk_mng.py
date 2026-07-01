# File: sa_disk_mng.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/storage-admin.package/scripts/sa_disk_mng.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

Z e!e
Z"e"d"k
e"d%k
Z%e%e v
e%d(k
e"d)k
e%d*k
e"d+k
e%d,k
e"d)k
e%d-k
r,e"d)k
e%d.k
rTe"d+k
(e'j)
Z%e%d(k
Z&e%d*k
Z+d2Z,e"d+k
Z,d2Z-e"d3k
e$e*e+e,e-
Z&e%d,k
e$e.
Z&e%d-k
Z.d4e$e.f
e/e,
Z&e%d.k
e$e,e-e.
Z1[1nnd
Z1[10
Z5[5n<d
Z5[50
Z7[7n
Z7[70
getDOMImplementation)
date)
NAMEzN	 sa_disk_mng.py device op [start] [end] [fileSystem] [mountPoint] [partIndex]Z
SYNOPSISzH	$0 [ -h ] device op [start] [end] [fileSystem] [mountPoint] [partIndex]Z
DESCRIPTIONz
	 -h  Help informationz#	 device : the device to be managedz1	 op : operations, such as new, del, info, fs, mpz#	 start: start position of the diskz
	 end: end position of the diskz#	 fileSystem: File system be formatz
	 mountPoint: mount pointz.	 partIndex: the partition index to be deleted)
print
sa_disk_mng.py
usage(
/opt/bin/sa_returncodes
open
strip
startswith
find
split
IOErrorr
	traceback
format_exc
BaseException)
ecdZ
error_codesZ	line_codeZ
code_definition
efir
error_code_loadD
error_code_dictr
isdigit
int)
Z	erro_infoZ
error_coder
error_code_valueX
/lib/udev/scsi_idz
--whitelistz
Device %s has naa %s)	
subprocess
check_output
logging
debugr
errorr
device_name
cmdListr
getNAAm
rpqR|
)	Nr
mountr
Device %s mount point %s)
operator
eqr"
indexZ
mount_pointr&
dev_info
part_mount_p
rlqN|
parted
unit
NumberT
endswith
appendr
)	r.
parts_dict
cmdLine
file_get
partitions
str_line
	part_infoZ
part_scoper
disk_parts_scope_dictions
keysr;
parts_index_setZ	dev_dictsrB
disk_parts_index
mkfs
Device %s mkfs %s failed %dZ
SA_MK_FS
SA_SUCCESS
SA_ERROR)
callr"
dev_part_new
rtn_coder
disk_part_mkfs
}	|	
%s%sr8
%s mkfs failed %dz
 %s does not existed, mkdir onez
 %s is not dirZ
SA_PAT_NOT_DIRz" %s is had mounted by other deviceZ
SA_PATH_MOUNTEDr(
Device %s mount %s failed %sZ
SA_PATH_MOUNT
/etc/fstab
%s %s %s rw 0 0
path
exists
mkdir
isdirr
ismountr 
tell
write
closer
part_indexrI
disk_part_scop_dict
keyr@
fstabr
disk_part_fs_mount
d)d*|
)/Nr3
diskInfo
namer%
Model:
modelZ
Disk
capacityZ
SectorZ
sectorSizez
Partition Table:Z
partTableTyper7
	partitionr/
start
endr+
sizer*
typer9
flagsZ
mountPointz
Device %s info: %s rF
fdiskz
Device %s info check failed
/sys/block/%s/device/modelr
createDocumentZ
documentElementZ
appendChildZ
createElementZ
createTextNoder'
toxmlr
CalledProcessErrorr$
returncoder
rootr>
sector_sizeZ
pt_typer@
disk_info_xmlZ
cpeZ	dev_pathsZ
dev_subZ
cpear
disk_part_infoR
Device %s is Not Block device
SA_DISK_NOT_BLKr3
z;Device %s may have other fs type, and should make gpt labelZ
mklabelZ
gptz
Device %s mk gpt label failedZ
SA_MK_LABEL_GPTz$The start %s will be changed with %sFr
 %s %s %s %s, scope overridedTz
scope overridedZ
SA_PART_OVERRIDEDr5
mkpartZ
primaryz
Device %s make part OKZ
SA_MK_PARTz
Device %s mk new part failedz
New part is %srM
stat
S_ISBLK
st_moder"
warning
MIN_PART_START
inforA
longr;
setr#
poprL
OSErrorr
devStatsZ
parts_scop_dictZ
parts_scop_setZ
part_overridedrB
part_startZ
part_endZ
parts_scop_set_newZ
part_new_dirI
oser
disk_part_new
sxt	|
 %s is not block devicerm
mount info: %sr*
%s is mounted with path %sr+
umountZ
SA_DISK_PART_RMrN
/etc/fstab.cas.bak
 %s remove part %s failedz
Device %s op return code %drF
	readlinesrX
mt_infor[
fs_linesZ
dev_part_foundZ
fs_lineZ
array_infoZ
fstabbakr
disk_part_delC
__main__Z
caslog/storage-admin)
delrJ
-hrF
SA_PARAMz
Parameters errorrr
sysrP
stringr"
timer 
xml.dom.minidomr
datetimer
util_cvk_logrq
__name__Z
cas_log_init3r#
argvZ
sa_opsr
exitr.
oprK
SystemExitZ
<module>
