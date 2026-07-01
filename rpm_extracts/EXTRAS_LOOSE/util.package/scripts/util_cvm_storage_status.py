# File: util_cvm_storage_status.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/util.package/scripts/util_cvm_storage_status.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

d!d"d
d#d$
e"j$d%
rVe%e"j$
Z&e"j$d
e"_$d'Z'd'Z(d'Z)e"j*
r:e"j+d(k
e"j*
e"j*
Z-e-
d)d*
r:e"j/
0d+e"j$e-f
Z-e e-d%
0d,e
Z-e e-d%
0d-e
1e2d.
0d/e"j$e-f
e"j$Z3e"j+d0k
sXe"j+d1k
rje3d
Z3e,e
Z-e e-d%
e"j+d
0d2e3
d3Z(
e"j+d4k
e"j+d1k
6e"j$
Z7e7d
Z8e8d
e%e8
Z8e"j+d4k
rfe,e
Z-e e-d%
0d7e8e
1e2d.
n>e,e
Z-e e-d%
0d8e8e
1e2d.
d9e"j$e
d3d:
0d;e"j$e<j=
e<j@f
d<e<j=
r(e"j/
d3Z)d3Z(n
e2d=
1e2d.
Z<[<n
Z<[<0
e"j/
s`e(
e"j$
Z-e e-d%
0d>e-
1e2d.
d@e"j$
1e2d.
e"j/
r(e"j*
r(e)
dAe"j$
e"j$
Z-e e-d%
0dBe"j$e
e2d=
e"j/
rHe"j*
rHe(
dCe"j$
dDe"j$
e"j+d(k
dEe"j*
dFe"j*
0dGeB
e"j+d(k
e"j*
e"j*
0dHe"j*
1e2d.
eBe"j$f
Z-e e-d%
0dIe"j$e
e2dJ
ZF[FnFd
ZF[F0
1e2dK
ZH[Hn
ZH[H0
timeout 20 lsof %s; echo $?z
dmsetup status | grep %sz/dmsetup status /dev/disk/by-id/dm-uuid-mpath-%sz
multipathd reconfigure; echo $?z(service multipath-tools restart; echo $?z'cat /proc/mounts | grep " %s "; echo $?z
nc -w 1 -z %s 2049; echo $?z
nc -w 1 -z %s 24007; echo $?z
umount %s; echo $?z
mount %s %s; echo $?z3python3 /opt/bin/sa_multipath_enable.pyc -s 0 -n %sz
/run/uis-offline.pidz
echo `date +%%s` 2>&1 > %sz
.storage_rw_guard
__main__Z
cvm_storage_statusz
Status Of Template Storage Pool)
descriptionz
Input arguments: %s
srcz(who is the script caller(front/ha/other))
type
help
repairz,whether to repair if pool status is abnormalr
type of template storage pool
pathz
path of template storage pool)
naa of template storage pool)
nargs
defaultr
error
z)Pool %s find dm error %s, reconfigure it.z'Multipathd reconfigure return %s, exit.z*Restart multipath service return %s, exit.Z
UTIL_INACTIVE_POOLz$Pool %s find dm error %s, ignore it.
z(Template storage pool %s is not mounted.T
[z%NFS server %s check fail, ret_code %sz+GlusterFS server %s check fail, ret_code %sz
%s/%s)
shellz)Template storage pool %s is %s, errno=%d.z
Read-only file systemZ
UTIL_READONLY_POOLzFShouldn't umount/mount when mountpoint in use. please check process %s
z9Excute command(lsof %s) timeout(20s), ignore this repair.z
Umount template storage pool %sz
Umount pool %s return %s, failz/Ignore repair while upgrading: storage pool %s z
Mount template storage pool %sz /dev/disk/by-id/dm-uuid-mpath-%sz
/dev/mapper/z1Dm device %s not exist when mount, try to fix it.z
Enable multipath %s failz
Mount pool %s return %s, failZ
UTIL_NOT_MOUNT_POOLZ
UTIL_WRONG_PARAM)I
subprocessZ
logging
argparse
timeZ
util_cvk_logZ
util_sh_error_code_loaderZ
util_common_toolsZ
ocfs2_nvmf_pool_setupZ
MOUNTPOINT_USEDZ
DM_CHECKZ
NVMF_DM_CHECKZ
MULTIPATHD_RECONFIGUREZ
MULTIPATH_RESTARTZ
MOUNT_STATUSZ
NFS_SERVER_STATUSZ
GLUSTERFS_SERVER_STATUSZ
UMOUNT_CMDZ	MOUNT_CMDZ
MULTIPATH_ENABLE_CMDZ
UIS_UPGRADE_OFFLINEZ
UPDATE_GUARD_FILEZ
GUARD_FILE
__name__
retZ
cas_log_init2
ArgumentParser
parserZ
warning
argv
add_argument
parse_args
args
debugr
lenZ
valid_str_lenZ
use_flagZ
mount_flagZ
umount_flagr
util_cmds_output
result
joinr	
exitZ
util_errorZ
mount_path
rfindZ
time_stamp
splitZ
fs_ip_pathZ
fs_server_ipZ
guard_file_pathZ
check_outputZ
CalledProcessError
output
decode
strip
returncode
existsZ
mount_dm
islinkZ
nvmf_multipath_config
SystemExitZ
BaseException
util_cvm_storage_status.py
<module>
