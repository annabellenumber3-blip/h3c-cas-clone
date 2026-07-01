# File: ocfs2_xcopy.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/storage-admin.package/scripts/ocfs2_xcopy.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

Z5d Z6e5e6g
a;d!a<e
d"d#
ZHd$ZId$ZJd%ZKd
ZQeQeI
ZReReJ
ZSeSeK
ZTd&d'
ZUeVd(
ZWeUeWd)eE
ZXd*d+
ZYd,d-
ZZd.d/
Z[d0d1
Z\d2d3
Z]d4d5
Z^d6d7
Z_d8d9
Z`d:d;
Zad<d=
Zbd>d?
Zcd@dA
ZddBdC
ZedDdE
ZfdFdG
ZgdHdI
ZhdJdK
ZidLdM
ZjdNdO
ZkdPdQ
ZldRdS
ZmdTdU
ZndVdW
ZodXdY
ZpdZd[
Zqd\d]
d^d_
Ztd`da
dbdc
ddde
dfdg
Zxdhdi
Zydjdk
dldm
dndo
Z|dpdq
Z}drds
Z~dtdu
dvdw
dxdy
dzd{
d|d}
python3z
/usr/bin/python)
Queue)
ElementTree)
z./lib/udev/scsi_id --whitelisted -u --device=%sz
multipath -ll %s 2>/dev/null | egrep '[0-9]{1,3}:[0-9]{1,3}:[0-9]{1,3}:[0-9]{1,3}\s+sd[a-z]{1,3}[[:space:]]' | awk '{print $(NF-4)}'z=ls -al /dev/disk/by-path/* | grep %s$ | awk '{print $(NF-2)}'zHls -al /dev/disk/by-path/* 2>/dev/null | grep %s | awk '{print $(NF-2)}'z?dd if=/dev/zero of=%s bs=4096 count=%d seek=%d 1>/dev/null 2>&1z3sg_write_same --lba=%d --num=%d %s 1>/dev/null 2>&1z\sg_xcopy if=%s of=%s bs=%s count=%d skip=%d seek=%d id_usage=disable prio=0 1>/dev/null 2>&1z4sg_xcopy if=%s of=%s bs=%s count=%d skip=%d seek=%d z
 1>/dev/null 2>&1z+fallocate -o %dM -l %dM %s 1>/dev/null 2>&1z)fallocate -o %d -l %d %s 1>/dev/null 2>&1z"truncate -s %d %s 1>/dev/null 2>&1
syncz%cat /sys/class/block/%s/device/vendorz$cat /sys/class/block/%s/device/modelz	sg_inq %sz
vmtouch -e %sz
/etc/cvk/ocfs2-xcopy.conf
enableZ	md5_checki
#ocfs2_clear_ext_unwritten_arguments
start
flagsN)
__name__
__module__
__qualname__
ctypesZ
c_ulongZ
c_uint8Z
_fields_
ocfs2_xcopy.pyr
sizeof
_IOC_WRITE
IOC_DIRSHIFT
IOC_TYPESHIFT
IOC_NRSHIFT
IOC_SIZESHIFT)
type
struct_para
sizer
_IOWx
z9zero unwritten file %s start %d len %d flags %d except %s)
path
exists
open
O_RDWR
OCFS2_IOC_CLEAR_EXT_UNWRITTENr
fcntlZ
ioctl
close
BaseException
logging
error
str)	
filepathr
!ocfs2_xcopy_file_ignore_unwritten
z3lscpu | grep CPU\(s\): | awk '{print $2}' | head -1r
exec command lscpu failed!
util_cmds_outputr
int)
cpus
outputr
get_cpus
)	Nz
check src : des extent %r : %rr
file offset is not samer
zBget slice src extent %r and change return src extent to %r, ret %dzBget slice des extent %r and change return des extent to %r, ret %d)
debugr+
global_perfect_clustersr
BLOCKS_PER_CLUSTER)	
src_extent
slice_src_extent
des_extentZ
slice_des_extent
device_block_sizeZ
return_src_extentZ
return_des_extent
copy_cluster_numr0
get_block_extent
VENDOR_CMDr
devnameZ
vendor_listr
get_dev_vendor
	MODEL_CMDr
model_listr
get_dev_model
%s has no naa %s.z#get all subdevice %s from device %sz#get vendor %s model %s on device %sz+get vendor or model from device %s is none!z&get vendor and model %s from device %s)
check_dev_is_dmZ
get_dev_naar
get_dev_name_list_by_naarI
appendr-
getmessage)
src_devZ
vendor_model_list
src_naa
src_dev_listZ
sub_dev
vendor
model
efir
get_storage_vendor_model
}	|	
rBd t
rBd&t
)/Nz#parameter vendor or model is wrong!Fz
/etc/cvk/ocfs2_xcopy/%s_%s.confz
/etc/cvk/ocfs2_xcopy/z&ocfs2 sg_xcopy directory is not exist.zHocfs2 sg_xcopy configuration file is not exist, it need to be generated.
wz!# use 'man sg_xcopy' for details
bpt=16384
cat=0
dc=0
id_usage=disable
list_id=1
prio=0
copy_clusters=1024
"This line is empty or startswith #
z-filename(%s): line(%s), length is less than 2
bptr
z!get bpt(%s) form ocfs2_xcopy_confz
bpt=%d 
catz!get cat(%s) from ocfs2_xcopy_confz
cat=%d 
dcz get dc(%s) from ocfs2_xcopy_confz
dc=%d 
id_usagez&get id_usage(%s) from ocfs2_xcopy_confz
id_usage=%s 
list_idz%get list_id(%s) from ocfs2_xcopy_confz
list_id=%d 
prioz"get prio(%s) from ocfs2_xcopy_confz
prio=%d 
copy_clustersz+get copy_clusters(%s) from ocfs2_xcopy_confTz3get parameters from configuration file, command: %sz(read ocfs2_xcopy_conf error, reason is: )
SG_XCOPY_FLAGr#
isdir
mkdirr%
writer*
strip
startswith
splitr-
SG_XCOPY_CMD_CONFr>
SG_XCOPY_CMD_TAILr+
ocfs2_xcopy_confZ	conf_fileZ
ocfs2_xcopy_file
line
	info_listZ
bpt_strZ
cat_strZ
dc_strZ
id_usage_strZ
list_id_strZ
prio_strra
read_ocfs2_xcopy_confO
) Nz
xcopy test scripts.T)
description
add_help)
requiredz
--filer
FzPfirst FILE:The source file copyed. second FILE:The destination file to be copyed)
nargsrq
default
helpz
--devicez1show hardware acceleration properties of a device)
--checkz(check srcfile and dstfile support xcopy.z
--setconfigr
set xcopy config item.z
--getconfigz
get xcopy config item.z
-Tz	--timeoutr
xcopy timeout(seconds).)
Parameters error : %s
OCFS2_ERR_WRONG_PARAM)
argparse
ArgumentParser
add_mutually_exclusive_group
add_argumentr8
parse_argsr+
exit
ocfs2_error)
args
parser
group
betr
	arg_parse
Nz"get path %s mount point except %s.)	r#
abspath
ismount
dirnamer+
get_mount_point
/z5mount | grep -w ocfs2 | grep \ %s\ | awk '{print $1}'r
file %s mount path %sz#get path %s mount device except %s.)	r
	mount_dirZ
mount_dev_list
	mount_devr4
ocfs2_xcopy_get_mount_device
NAA_COMMANDr
dev_pathZ
naa_listr
ocfs2_xcopy_get_dev_naa
/dev/mapper/TFr
MUL_DEV_CMD)
dev_naar
list devname %s invalid.z
get dev fullpath except %s.)
SD_DEVS_CMDr
dev_name_listZ
dev_path_name_listrH
dev_path_listr4
get_dev_full_name_list_by_path
ip-z
-iscsi-z
pci-z
-fc-)
DEV_LUN_TYPE_ISCSI
DEV_LUN_TYPE_FC
DEV_LUN_TYPE_NONE)
get_devname_lun_type!
sg_inq %s | grep 3PC=1r
z device %s does not support xcopyFz#xcopy character on device %s is %s.)
warningr=
devZ
supportr:
support_xcopy5
NFz sg_vpd -p 0 %s | grep '\[lbpv\]'r
z8device %s not support Logical block provisioning [lpbv]!Tz)lpbv character on device %s is supported.)
support_lbpvM
NFzFsg_vpd -p lbpv %s | grep 'Unmap command supported' | awk '{print $NF}'r
)exec command sg_vpd -p lbpv on %s failed!
1Tz#unmap character on device %s is %s.
support_unmapf
NFz<sg_vpd -p lbpv %s | grep 'Write same' | awk '{print $3,$NF}'r
Output (%s) format is wrong.r
deivce %s support write same %sTz#deivce %s not support write same %szJsg_vpd -p bl %s | grep 'Maximum write same length' | awk '{print $(NF-1)}'z*exec command sg_vpd -p bl %s on %s failed!Z
z(deivce %s support write same length (%s)z,deivce %s not support write same length (%s))	r
info)
support_lbpv_wsZ
support_bl_lenZ
support_wsr:
listr
support_write_same
NFzBsg_vpd -p bl %s | grep 'compare and write' | awk '{print $(NF-1)}'r
z'exec command sg_vpd -p bl on %s failed!
0Tz%compare and write on device %s is %s.r
support_ats
Nz@sg_readcap %s|grep 'Logical block length'|awk -F'=' '{print $2}'r
command sg_readcap return errorz
device_block_size is %d)
get_block_size
zFsg_copy_results -p %s|grep 'Data segment granularity'|awk '{print $4}'r
z*exec command sg_copy_results on %s failed!r6
	min_bytesr:
get_min_transfer_bytes
z<get_min_transfer_count on %s failed, min_bytes=%d sect_sz=%d)
countr
sect_szr
get_min_transfer_count
%s xcopy extent %r to %rr
z'%s xcopying extent %r to %r, %d clusterr
%s xcopy cmd is %sT
shellz-%s failed to sg_xcopy %s to %s,file offset %sz
command sg_xcopy error)
	threading
currentThread
getNamer+
FS_BLOCK_SIZErb
SG_XCOPY_CMD_DEFAULT
subprocess
callr-
des_devrB
skip
seekr2
ret_coder
ocfs2_sg_xcopy"
Reach the end extent.
OCFS2_FAILED)
nextrf
StopIterationr,
extent_iterrl
extent
sir4
get_next_extentQ
}	|	d
}	|	d
}	|	d
z file %s fallocate extent invalidFr
z1fallocate a extent of file %s offset %d length %dTr
z=fallocate a extent of file %s offset %d length %d fail ret %dz(trucate file %s tp offset %d fail ret %d)
FALLOCATE_BYTE_CMD
ocfs2_cluster_sizer=
check_call
TRUNCATE_CMDr#
getsizer
src_extents
src_fileZ
des_file
offset
lengthZ
pre_extentrl
	fallocateu
CmdExecutorc
Thread
__init__rO
selfrO
CmdExecutor.__init__c
(%s have finished ocfs2_sg_xcopy command.r
zH%s consume src: %s:%s, des: %s:%s, device_block_size: %d, global_ref: %dz5%s succeed to execute sg_xcopy command, global_ref %dz4%s failed to execute sg_xcopy command, global_ref %d)
extent_queue
qsizer,
name
refLock
acquire
global_refrO
releaser
temp_extentr@
CmdExecutor.runN
%s failed ret %dz5sg_xcopy from %s off %d to %s off %d len %d except %sr"
block_sizerO
src_off
dst_devZ
dst_offr
ocfs2_do_sg_xcopy
ocfs2_queue_lockr
ocfs2_extent_queue
putr
flagr
ocfs2_queue_push
ocfs2_queue_pop
ocfs2_CmdExecutorc
src_file_path
dst_file_pathrC
start_time)
dev_block_sizer
ocfs2_CmdExecutor.__init__c
zOthread %s consume src: %s logic %d phyisc %d dst: %s logic %d physic %d len %d.
OCFS2_TIMEOUTz
%s xcopy timeout %dz0%s ignore unwritten dst file %s offset %d len %dz=%s failed to ignore unwritten file %s offset %d len %d ret %dz
%s xcopy flags %d invalidr"
z)%s failed to execute xcopy command ret %dz
thread %s except error %s)
!ocfs2_xcopy_get_block_per_cluster
ocfs2_xcopy_get_timeout
global_retr
timer
OCFS2_EXT_ZERO_FLAGr8
OCFS2_SUPPORT_IGNORE_FLAGr+
block_per_cluster
timeoutr
src_py_off
dst_py_offr
src_lg_off
dst_lg_offr
Z	time_currZ
dst_offset_byteZ
dst_len_byter4
ocfs2_CmdExecutor.runNr
q(q(q(t
Vendor identification
Vendorz
Product identification
ProductIdentificationz
Product revision level
ProductRevisionLevelz
Unit serial number
UnitSerialNumberz
devpath %s storageinfo: %s)
SG_INQ_CMDr
devpathZ
outlistr0
&ocfs2_xcopy_get_storage_identificationB
}	|	
Nz"src %s or dst %s mount dev invalidFz/src mount dev %s or dst mount dev %s not existszGsrc mount dev %s blocksize %d and dst mount dev %s blocksize %d invalidz)src %s or dst mount dev not support xcopyz
src %s or dst mount dev not dmz
%s or %s dev info is same.Tr
%s or %s has no naa.z
%s and %s has the same naa %s.z.check src %s dst %s mount dev not same sginfo.z!get srcfile %s dev %s list empty.z!get dstfile %s dev %s list empty.z,src dev %s or des dev %s link list is empty.Z
lunz.srclink %s type %d not same dstlink %s type %dz6srclink %s checkstr %s not same dstlink %s checkstr %sz
src link %s not fc or iscsiz/check same pool srcfile %s dstfile %s except %sz7Can not do xcopy from %s and %s use different storage. )
BLOCK_SIZE_MINr
*ocfs2_xcopy_check_dev_path_is_same_storagerM
rsplitrf
src_path
dst_pathZ
src_mount_devZ
dst_mount_devZ
src_block_sizeZ
dst_block_sizerP
dst_naarQ
dst_dev_listZ
src_dev_link_listZ
dst_dev_link_listZ
src_dev_linkZ
src_dev_typeZ
src_check_strZ
dst_dev_linkZ
dst_dev_typeZ
dst_check_strr4
ocfs2_xcopy_is_same_storageh
qZn$|
qZ|	d
}	ql|	|
}	qlW
z(src extent compare get line %d extent %sz)dst extent compare  get line %d extent %sT
7src line %d extent %s or dst line %d extent %s mismatchr
zIsrc line %d extent %s offset %d not match dst line %d extent %s offset %dzVchecking src line %d extent %s offset %d len %d dst line %d extent %s offset %d len %dz
check extent except %s)
iterr
OCFS2_CHECK_EXTENT_FLAGSr+
dst_extentsr
src_extent_iter
dst_extent_iterZ
src_lineZ
src_offsetZ
src_lenZ
src_py_offset
	src_flagsZ
dst_lineZ
dst_offsetZ
dst_lenZ
dst_py_offset
	dst_flagsr@
dst_extentr4
ocfs2_xcopy_extents_compare
z"src extents or dst extents invalidr
z,src extents check same get line %d extent %sz,dst extents check same get line %d extent %sTr
z)src line %d extent %s pyoffset %d invalidz)dst line %d extent %s pyoffset %d invalidz5src line %d extent %s not match dst line %d extent %sz
check extents same except %s)
ocfs2_xcopy_extents_check_same8
ocfs2_xcopy_extents_empty
z&/sbin/debugfs.ocfs2 -R "stat -n %s" %sz
get file layout cmd %s)
	file_namer2
ocfs2_xcopy_get_ocfs2_layout
s`q:|
|	d	
q>q:|
filefrag -v -b4K %sr
logical_offset:z
physical_offset:Tz1%s filefrag layout not find last or eof in flags.r
zK%s filefrag layout check lgend %d lgstart %d not equal pyend %d pystart %d.zA%s filefrag layout check lgend %d lgstart %d not equal length %d.z
%s filefrag length %d invalid.z
%s filefrag pystart %d invalid.z
%s filefrag lgstart %d invalid.r"
Z	unwrittenz
%d %d %d %d %dZ
last
eofz!get %s filefrag layout except %s.)
isdigit
OCFS2_EXT_UNWRITTEN_FLAGrN
outinfolistr
retlistr
layout_listZ
index_noZ
lg_off_listZ
lg_off_startZ
lg_off_endZ
py_off_listZ
py_off_startZ
py_off_endr
ocfs2_xcopy_get_filefrag_layout
s"qvt
get pyoffset %d invalid)
extentsZ
pymapr
py_lenZ
py_offr4
*ocfs2_xcopy_get_extents_physic_off_len_map
mapZ
offr
Z	src_startZ
src_endr
endr4
#ocfs2_xcopy_check_py_off_len_in_map
}	n,t
<Getting %s layout infos failed, check it with debugfs.ocfs2.F
fallocate %s failed.Tr
+src file %s dst file %s extent check error.z
get first extent of file %sr
z#src_extent %s dst extent %s line %d
'All extents had been insert into queue.)
%r will be insert into queue.z
get next extent of file %sz8Something error, src extent is %r while des extent is %rz
Get host CPU(s) %dr
z#We will initiate %d threads type %szCSomething error while multi-threads execute sg_xcopy! global_ref %d)!r
CACHE_CLEAN_CMDr
ranger
joinr+
dst_filer
src_path_infoZ
dst_path_infor
line_countrC
slice_dst_extentZ
temp_src_extentZ
temp_dst_extentr
threadsr9
threads_num
xcopy 
Nz	md5sum %sr
get file %s md5 errorz
get file %s md5 except %s)
md5r4
ocfs2_xcopy_md5sum
evict %s page ret %dz
evict file %s page except %s)
VMTOUCH_CMDr
ocfs2_xcopy_evict_file_page
evict %s failFz
md5_check_flag %dz
check dst %s md5 invalidz
check src %s md5 invalidz
cp -f %s %s-fail-md5-xcopyz,check src %s md5 %s not equal dst %s md5 %s.z'check src %s md5 %s equal dst %s md5 %sz4after xopy compare src %s extents not same as beforezEafter xopy check same src %s extents with filefrag not same as beforez4after xopy compare src %s extents not same as dst %sz?after xopy compare src %s extents with dst %s filefrag not same)
md5_check_flagr+
dst_md5Z
src_md5Z
src_after_externts
src_filefragZ
dst_after_extentsZ
dst_filefragr
ocfs2_after_xcopy_check
unmapZ	writesameZ
ats)
Elementr
text
dumpr
xcopy_nodeZ
unmap_nodeZ
writesame_nodeZ
ats_noder
#ocfs2_xcopy_print_device_properties
Tz/src devpath %s dst devpath %s compare except %s)
src_devpathZ
dst_devpathr0
src_storage_infoZ
dst_storage_infor4
file %s is not in ocfs2.Fr
z!file %s not support ocfs2 ignore.z
file %s support ocfs2 ignore.T)
OCFS2_SUPPORT_IGNORE_TEST_FLAGr=
&ocfs2_xcopy_check_ocfs2_support_ignore'
src file %s dst file %s invalidFr
z,src file %s or dst file %s not absolute pathz
src file %s not filez
src file %s not existsz dst file %s exists, not support.Tz"src %s dst %s file valid except %s)	r
isfiler%
ocfs2_xcopy_file_valid_check5
}	~	n
}	~	0
NFz%extents valid check %s extents empty.z)extents valid check %s filefrag not same.r
z-path %s extents valid check line %d extent %sr
zAextents valid check file %s src extent %s physics offset invalid.r
z'check path %s file flag %d not support.z
check file %s extents except %s)
'OCFS2_CHECK_EXTENT_VALID_CHECK_FILEFRAGr
filefrag_extentsr
ocfs2_xcopy_extents_valid_checkU
/usr/bin/vmtouchz
%s not existsFT)
cmdpathr
ocfs2_xcopy_evict_support
Fz'check src %s dst %s not support ignore.z%check src %s file extent valid false.z!check src %s dst %s same storage.Tz%check src %s dst %s not same storage.z,check xcopy srcfile %s dstfile %s except %s.)
replacer8
ocfs2_xcopy_check_cluster_size
!ocfs2_xcopy_get_file_cluster_size
ocfs2_xcopy_init_cluster_sizer:
	filepathsr
cluster_sizer4
ocfs2_xcopy_check
hold file %s push %dr
hold file %s fail %sr"
O_RDONLYr,
hold_queuer
ocfs2_xcopy_file_hold
release file %s fd %dr
release file fail %s)
fdinfor4
ocfs2_xcopy_file_release
],}"t |"|
}#| 
}#|#
}$~$d
}$~$0
Fz*check srcfile %s filefrag layout not same.r
z'src file %s dst file %s get pymap fail.z1src file %s dst file %s sg block size %d invalid.r
z?src file %s logic offset %d not eq dst file %s logic offset %d.z1check dst file %s physic off %d len %d not in mapz
%s will be insert into queue.r
z)doxcopy src %s to dst %s all thread join.zCSomething error while multi-threads execute sg_xcopy! global_ret %dz2src file %s xcopy to dst file %s after check fail.)&r
maxsizer
dst_py_mapZ
src_mount_pathZ
dst_mount_pathr
src_line_numr
src_lg_lenr
src_py_lenr
dst_line_numr
dst_lg_lenr
dst_py_lenr
tmp_src_py_offZ
tmp_dst_py_offZ
tmp_write_py_lenZ	limit_lenr
ocfs2_do_xcopy
OCFS2_FILE_EXISTEDz#Failed to xcopy %s to %s, remove %sz
rm -f %s 1>/dev/null 2>&1Tr
OCFS2_XCOPY_FAILEDz
copy from %s to %s succ use %d.z5Not one same storage device or does not support xcopyZ
OCFS2_NOT_SUPPORT_XCOPYz"Failed to xcopy %s to %s except %sz
rm -f %s)
SystemExitr+
)	rA
end_timeZ	time_diff
ocfs2_xcopy_copy
debugfs.ocfs2 %s -R "stats"r
dev %s get cluster size failr"
Cluster Size Bits:r
dev %s cluster size %d invalidz
dev %s cluster size %dz&dev %s get cluster size fail except %s)
stats_listrB
lineinfoZ
cluster_bitr
 ocfs2_xcopy_get_dev_cluster_size
Nz%get file cluster %s mount dev invalidr"
file %s cluster size %d)
mountdevrB
init cluster size %dT)
Nz6src %s clustersize %d not equal dst %s clustersize %d.Fr
src_cluster_sizeZ
dst_cluster_sizer
r"z,t
q"q"d
NTrW
(conf %s: line(%s), length is less than 2r
config md5_check %dz
config md5_check %s except %s
xcopy not supportFz
config enable %s except %s)
OCFS2_XCOPY_CONFPATHr#
MD5_CHECK_STRr8
ENABLE_STR)
confpathrk
ocfs_xcopy_check_cvk_support
t	|	
q^|	
q8q^W
NFTrW
%s=%s
line  %sr
find conf %s not need rewritez
find conf %s need rewritez
%s=%srV
conf %s=%s succz
conf %s=%s fail except %s)
read
splitlinesr,
valuer0
content
	find_nameZ
need_rewrite
file
linesrl
ocfs2_xcopy_set_config_item!	
s~t	|
}	~	n
}	~	0
NFrW
get conf %s value %sr
get conf %s fail %s)
ocfs2_xcopy_get_config_item[	
NFrZ
set conf %s invalidr
set conf item %s not supportr
set conf %s fail %s)
OCFS2_XCOPY_CONFIG_ITERMSr]
confstrr0
ocfs2_xcopy_set_config
get conf item %s not supportTr^
printr+
ocfs2_xcopy_get_config
global_timeoutr
set timeout %d)
ocfs2_xcopy_set_timeout
OCFS2_SUCCESS)	Z	setconfigrb
Z	getconfigrd
ocfs2_xcopy_config
__main__Z
ocfs2z
caslog/storage-adminz
Xcopy operations %rz
Parameters errorru
	tracebackrv
realpathZ
queuer
Z	xml.etreer
util_sh_error_code_loaderZ
util_cvk_logZ
util_common_toolsZ
ocfs2_disk_layoutr)
structr
FC_DEVS_CMDZ
DD_HOLE_CMDZ
WRITE_SAME_HOLE_CMDr
FALLOCATE_CMDr
Lockr
Z	Structurer
Z	_IOC_NONEr
Z	_IOC_READZ
IOC_NRBITSZ
IOC_TYPEBITSZ
IOC_SIZEBITSZ
IOC_DIRBITSZ
IOC_NRMASKZ
IOC_TYPEMASKZ
IOC_SIZEMASKZ
IOC_DIRMASKr
ordZ	IOC_MAGICr(
cas_log_init3r=
argvZ
arg_nsr-
device
checkrJ
format_excr
<module>
