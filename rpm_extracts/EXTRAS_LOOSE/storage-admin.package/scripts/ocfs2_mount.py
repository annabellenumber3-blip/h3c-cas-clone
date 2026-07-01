# File: ocfs2_mount.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/storage-admin.package/scripts/ocfs2_mount.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

d d!
d"d#
d$d%
d&d'
Z d(d)
Z!d*d+
Z"d,d-
Z#d.d/
Z$d0d1
Z%e&d2k
rFe'e
Z)e)d3k
j(d4
r\e%
e)d6k
rve%
Z+e,d7d8
j(d4
j(d3
/d9e-
d:e-e.f
Z0e$e-
Z1e1d;k
e2d<
e1d=k
rje#
Z4e4
e4e-
r@e2d>
3d?e4e-
5d@e-
e2dA
j6e0dBdC
3dDe0e9e8
dEZ+W
Z8[8n
Z8[80
z.e2dF
3dGe9e8
Z8[8n
Z8[80
r&e2dI
5dJe-
e2dK
3dLe-e+
/etc/fence_scsi/fence_scsiz
/var/lock/cas_fencescsi.lockz
/usr/bin/sg_tursz
/usr/bin/sg_persistZ
0xabcd0256c
NTz"Failed: device "%s" does not existFz)Failed: device "%s" is not a block device)
path
exists
logging
debug
stat
S_ISBLK
st_mode)
ocfs2_mount.py
is_block_device&
/dev/c
<listcomp>5
z$get_mpath_slaves.<locals>.<listcomp>z
/sys/block/z
/slaves/r
listdir
get_mpath_slaves)
slavesr
 1>/dev/nullT
shellz
Device (%s) cannot accessedFz
Device (%s) can accessed)
SG_TURS_PATH
subprocess
call
	Exceptionr
errorr
cmdr
is_device_ready=
^dmr
 -n -o -I -S 
 -d r
Register dev(%s) failed(%s).z
Register dev(%s) succeed.)
realpath
searchr
register_devr%
SG_PERSIST_PATHr 
strr
keyr
slaver$
excr
)	Nz
 -n -i -k -d Tr
z%get registration keys output is empty
\s+0x(\S+)\s*r
z&Cannot get registration keys error: %s)
check_outputr
warning
splitr)
append
groupr"
keysr$
output
line
matchr0
get_registration_keys]
.key
Cannot open file "%s")	
STORE_PATH
open
IOErrorr
readline
strip
lower
close)
	file_path
key_file
	key_valuer
get_keyq
Failed: Cannot open file "%s"
--keyr1
isdir
dirname
makedirsr?
writerC
optionsrE
set_key}
 -n -i -r -d Tr
Cannot get reservation key - %sz
\s+key=0x(\S+)\s+r
IGNORECASEr6
get_reservation_key
z^Releases the persistent reservation (if any) and clears all
    registrations from the device.r&
NTFz
 -n -o -C -K r'
Clear dev(%s) failed(%s).z
Clear dev(%s) succeed.)
	clear_devr%
NTz)Clear device %s failed - remain pr_key=%sFz
Clear device %s succeed.)
TEMP_LOCAL_KEYrS
host_key_contain_prr
clear_reservation
 -c Tr
z$Write Exclusive, registrants only: 1z4Device(%s) not support type5 persistent reservation.Fz Can not get device capacity (%s))
type5_pr_strr0
is_support_fence_scsi
Nz	%.12x%.4xr
int)
cluster_name
node_idr/
first_none_zero_idx
charr
generate_key
z7Persistent reservation key(%s) format error, pls check.r
get_node_id_by_key
cluster
namer
ocfs2_confrY
get_ocfs2_cluster_name
node
	node_name
numberr
nodesrc
get_node_number
socketZ
gethostnamer
get_local_node_name
get_local_node_number
    Parse ocfs2 cluster configuration file and load the information
    into memory for later use.
    o2cb user-tool will parse cluster configuration file located at:
        /etc/cvk/cluster.conf
    r_
o2cb list-clustersTr
get o2cb list clusters is emptyNr1
o2cb list-cluster z
 --onelinez*Get o2cb list cluster info for %s is emptyr
node: 
ip_addressZ
ip_portz	cluster: 
node_countZ
heartbeat_modez6%d nodes in cluster configuration file, but %d countedz
Cluster information: %s)
dictr 
countrB
replacer5
AssertionError
	exceptionr
cluster_infor8
elements
portZ
iprc
_load_cluster_conf_file
Can not found local key file.z#Get cluster name failed, pls check.z
Get node id failed, pls check.r
z'Write local host_key(%s) into key file.)
ordr\
local_host_keyrO
cluster_name_numericalZ
char_valuer
check_key_file9
unknownz
tunefs.ocfs2 -Q "%J
" Tr
enable
disablez.Query the fence scsi feature switch failed, %sr1
outr0
is_enabled_fencescsiX
NAMEzP	 ocfs2_mount_fence_scsi.py mount ocfs2 pools when fence scsi feature is enabledZ
SYNOPSISz
	 $0 -h|device mount_pointZ
DESCRIPTIONz
	 -h Help and usagez
	 device ocfs2 device /dev/sd*z
	 mount point)
printr
usaged
__main__r
ocfs2z
caslog/storage-adminz#Mount ocfs2 device %s in fence scsiz
mount %s %srz
Get feature switch flag failedr{
Failed to register keyz'Failed to register key %s on device %s.z
Register key for (%s) succeed.z"Get host_key failed, please check!Tr
Execute %s failed: %s
Exception happen, please check!z
Exception happen - %sr
Manual mount succeed.z,Manual mount device %s in fence scsi succeedz
Manual mount failed.z/Manual mount device %s in fence scsi failed(%d));
sysr
util_common_toolsZ
util_cvk_logZ
ocfs2_multipathZ
sa_iscsi_commonZ
ocfs2_iscsi_commonr>
FENCE_SCSI_LOCKFILEr
__name__
argvZ
exitr
cas_log_init3Z
deviceZ
mount_point
infor$
switchr
HOST_KEYr3
BaseExceptionr
<module>
