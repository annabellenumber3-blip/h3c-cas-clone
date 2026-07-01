# File: ocfs2_nvmf_pool_setup.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/storage-admin.package/scripts/ocfs2_nvmf_pool_setup.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

l	Z	d
Z#d!d"
Z$d#d$
Z%d%d&
Z&d'd(
Z'e(d)k
zNe,d*d+
e-e.d,
Z*e	
e	j1
2d-t+
j3d.d/
Z4e4j5d0d1d2g
d3d4
e4j5d5d6d7
e4j5d8d9d:d;d<
6d=e
j7d>d
e9j:d1k
rXe9j;d
e<e9j;
=e>d?
e$e9j;
Z)e)d
?d@e9j@e)f
n>e9j:d2k
e#e9j@
Z)e)d
?dAe9j@e)f
z>eBjCZ)e
?dBe)
6dCeD
e't+eD
ZB[Bn
ZB[B0
6dCeD
e't+eD
ZF[Fnjd
ZF[F0
6dCeD
e't+eD
eBjCZ)W
ZB[Bn
ZB[B0
multipath -ll | grep %sz>ls -dal /dev/disk/by-id/* | grep %s | egrep "dm-uuid-mpath-%s"z
multipath -f %sz
multipath -r %sc
z&get dm path %s, total used %d seconds.)
time
sleep
util_cmds_output
NVMF_DM_UUID_PATH_CMD
logging
debug
BaseException
error)
wwidZ
check_timesZ
looptime
uuid_dm_info
ocfs2_nvmf_pool_setup.py
nvmf_check_multipath_symlink&
NTF)
 NVMF_CHECK_MULTIPATH_CREATED_CMDr
retr
nvmf_check_multpath_created6
Remove map %s, ret=%sz
Reload map %s, ret=%s)
NVMF_REMOVE_MULTIPATH_MAPr
NVMF_RELOAD_MULTIPATH_MAPr
nvmf_reload_multipath_mapB
}	~	S
}	~	0
Tz]multipath created but not found multipath device symlink,reload map and call udevadm trigger.
Get wwid %s path info failed.
OCFS2_MULTIPATH_CONF_FAILEDr
/z$Get wwid %s path info failed, dm_devz
/dev/%sz*multipah check error, stat /dev/%s failed.
OCFS2_SUCCESS
OCFS2_ERR_WRONG_PARAM)
UDEVADM_TRIGGER_CMDr
warningr
ocfs2_error
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
dm_naa_path
nvmf_multipah_path_checkM
cat /sys/block/%s/wwidT
shellz!path: %s, dev_wwid: %s, wwid: %s.z
get path_list fail.)
nvmf_get_ns_all
subprocess
check_output
strip
decoder
appendr
multi_paths
	path_list
path
cmdZ
dev_wwidr
nvmf_get_multi_pathsz
}	|	d
t t!|
t!t	
blacklist_exceptionsz4Failed to find blacklist_exceptions from %s init it.Z
multipathsz2Failed to find multipaths_section from %s init it.r
get wwid: %s multi_paths failedr!
z/get wwid: %s multi_paths: % less than %d failedz
multipathd add elist %sTr.
add elist(%s) failed.z
add elist(%s) successfully.z
multipathd add path %sz!add dev(%s) with path(%s) failed.z'add dev(%s) with path(%s) successfully.
	multipathz
multipathd del path %sz!del dev(%s) with path(%s) failed.z'del dev(%s) with path(%s) successfully.z
multipathd del elist %sz
del elist(%s) failed.z
del elist(%s) successfully.z$wwid_list is %r, old wwid list is %rz
write %r to /etc/multipath.confz#multipath.conf did not been changedr
openZ
MPATH_LOCKFILE
fcntlZ
flock
fileno
LOCK_EXr%
existsZ
MULTIPATH_CFGZ
init_default_config
shutil
copyZ
MULTIPATH_CFG_BAKZ
read_config_fileZ
get_unique_elementr
create_empty_sectionZ
add_unique_elementZ
get_multi_elementr9
add_multi_elementr0
remove_specified_elementZ
get_specified_elementZ
write_config_fileZ
MULTIPATH_CFG_TMP
close
IOErrorr
single_hbar
path_num
lockfdZ
multipath_keyZ
configr;
multipaths_sectionZ
old_wwid_listr5
outputr7
multipath_uuid_sectionZ	wwid_listr,
nvmf_multipath_config
	transport
typeZ
subnqnZ
addressZ
addr
svcid
subsys: %s, target: %sz*g_connect_before: %s, %s: %s connected: %sz&nvme connect -t rdma -n %s -a %s -s %sTr.
OCFS2_NVMF_CONNECT_FAILEDz&nvme connect %s with %s fail, ret: %d.
z1nvme connect %s with %s has been already existed.z*wwid: %s multipath config failed, ret: %d.z"multipath conf file changed failedr
z result of cancle multipath is %dr
find
textr
g_connect_beforer0
CalledProcessErrorr#
returncoderJ
infor
Z	path_nodeZ	host_noderK
subsysZ
ip_addrrM
targetZ	connectedr8
resultr
cancle_rtnr
nvmf_parse_multipath
/etc/libvirt/storage/%s.xml
1Storage pool %s or configure file does not exist.z
./source/multipath/uuidz
get wwid: %s)
ElementTree
parserQ
	pool_namer
xml_file
treer
nvmf_get_uuid2
./target/pathz'mount point of storage pool %s is None.)
mpra
Z	path_infor
nvmf_get_storage_pool_mpC
./source/devicer7
z)source device of storage pool %s is None.)
device_pathra
devicer
nvmf_get_storage_pool_pathX
blkid -s UUID %s 2>>/dev/nullTr.
command blkid output is empty
device %s uuid is %s)	r0
uuidZ
get_uuid_cmdrI
betr
nvmf_get_dev_uuidl
n$d	|
OCFS2_GET_POOL_PATH_FAILEDz/virsh pool-list | grep ^%s\  | awk '{print $1}'Tr.
z=Storage pool %s is already inactive, no necessary to stop it.z
virsh pool-destroy %sz!Storage pool %s has been stopped.z(grep -w ocfs2 /proc/mounts | grep \ %s\ zCStorage pool %s has been stopped, but still mounted. Try to umount.z	umount %sz.Storage pool %s has been stopped and umounted.z?Getting mount point of storage pool %s failed, but ignoring it.
o2hb-%sr
ps -ef | grep "\[%s\]"z>Storage pool %s is umounted, but its o2hb thread still exists.zHo2hb thread of storage pool %s already exits, it is safe to proceed now.zLGetting uuid of device %s failed due to unknown reason. This doesn't matter.Z
OCFS2_UMOUNT_FAILED)
check_callrW
replace
upperrU
is_mountedrf
uuid_orgrj
Z	hb_threadZ
hb_infor
nvmf_stop_storage_pool}
z&Stop storage pool %s failed, errno=%d.z
pool: %s get wwid failr!
.pool: %s cancel multipath failed with errno %d)
nvmf_cancel_multipath
z%There must be at least one multipath.r!
z(wwid: %s parse multipath with: %s failedz
there is no path, param err)
fromstringZ
find_nodesr	
Z	xmlstringr
rootZ
multipath_nodesr>
nvmf_set_multipath
nvme list-subsys 2>/dev/nullTr.
start)
substrr
<listcomp>
z$nvmf_get_connect.<locals>.<listcomp>z
nvme-subsysr
pcieZ
nvme
%s: %s)
finditer
ranger4
	traceback
format_exc)
connect_dictZ
str_listr8
index
connectZ
noderX
ctrlidrK
traddtrZ
trsvcid
statusrY
nvmf_get_connect
Nz%nvme disconnect -n %s >/dev/null 2>&1Tr.
z)disconnet subsys %s with %s successfully.z!disconnet subsys %s with %s fail.Z
OCFS2_NVMF_DISCONNECT_FAILEDr 
nvmf_disconnect_subsys
qRq:|
no new subsys connected.z
connected subsys not changed.z
disconnect %s with %s.z
logout session failed.)
operator
old_dictZ
new_dictrX
new_listrY
old_listr
"nvmf_disconnect_subsys_when_failed
__main__Z
ocfs2z
caslog/storage-adminr:
z$current connect before process is %sz
nvmf config)
descriptionr+
create
removez
Operation mode on nvmf)
choices
helpr`
Storage pool name)
-dz	--devices
xmlstrz
device path list in xml format)
destr
input parameters: %sr
z+pool: %s set multipath failed with errno %drq
z'Call shell command failed, result is %dz
connect_current is %s)
sysr%
argparser0
socketr@
util_cvk_logZ
util_sh_error_code_loaderZ
util_common_toolsZ
util_xml_commonZ
ocfs2_nvmf_commonZ
ocfs2_multipathZ
ocfs2_cluster_configr
__name__r
cas_log_init3r?
NVME_LOCKFILE
lockfrA
ArgumentParser
parser
add_argumentr"
argv
parse_args
argsr+
exitr#
connect_currentr*
<module>
