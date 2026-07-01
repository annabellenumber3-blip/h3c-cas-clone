# File: ocfs2_fence_scsi.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/storage-admin.package/scripts/ocfs2_fence_scsi.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

d!d"
Z d#d$
Z!d%d&
Z"d'd(
Z#d)d*
Z$d+d,
Z%d-d.
Z&d/d0
Z'd1d2
Z(d3d4
Z)d5d6
Z*d7d8
Z+d9d:
Z,d;d<
Z-d=d>
Z.d?d@
Z/dAdB
Z0dCdD
Z1dEdF
Z2dGdH
Z3dIdJ
Z4dKdL
Z5dMdN
/etc/fence_scsi/fence_scsiz
/var/lock/cas_fencescsi.lockz
/usr/bin/sg_tursz
/usr/bin/sg_persistZ
0xabcd0256z
/var/lock/cas_mpath.lockz
/etc/multipath.confz
/etc/multipath.conf.tempc
NTz"Failed: device "%s" does not existFz)Failed: device "%s" is not a block device)
path
exists
logging
debug
stat
S_ISBLK
st_mode)
ocfs2_fence_scsi.py
is_block_device(
/dev/c
<listcomp>7
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
is_device_ready?
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
get_registration_keys_
.devz
Failed: Cannot open file "%s"
\s+r1
STORE_PATHr
isdir
dirname
makedirs
open
IOErrorr
readr)
write
close)
	file_pathZ
dev_file
outr
	dev_writer
.key
Cannot open file "%s")	r>
readline
strip
lowerrF
key_file
	key_valuer
get_key
--keyr1
optionsrG
set_key
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
TEMP_LOCAL_KEYrX
host_key_contain_prr
clear_reservation
)	Nz
 -n -o -R -T 5 -K r'
Reserve dev(%s) failed(%s)r
Reserve dev(%s) succeedr
reserve_dev
Nz)Preempt abort remote key(%s) for dev(%s) rS
 -n -o -A -T 5 -K z
 -S r'
zBLocal host(%s) preempt abort remote key(%s) for dev(%s) failed: %sFz?Local host(%s) Preempt abort remote key(%s) for dev(%s) succeed)
infor-
local_host_keyr
preempt_abort
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
new_keyZ
residual_keysZ
new_node_idZ
exist_keysr/
get_residual_keys
Tz4Unregister dev(%s) failed: device is not accessible.Fz
sg_persist -n -o -G -K r'
z Unregister dev(%s) successfully.z
Unregister dev(%s) failed(%s).)
unregister_devr%
)	Nr
z,Unfence scsi failed: %s is not block device.Fr
z'Failed to register key %s on device %s.z0Failed to create reservation (key=%s, device=%s)z
Failed to verify %s device(s)T)
countrT
render_lun_permission:
cluster
namer
ocfs2_confrb
get_ocfs2_cluster_nameV
node
	node_name
numberr
nodesrp
get_node_number]
socketZ
gethostnamer
get_local_node_nameg
get_local_node_numberj
    Parse ocfs2 cluster configuration file and load the information
    into memory for later use.
    o2cb user-tool will parse cluster configuration file located at:
        /etc/cvk/cluster.conf
    rl
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
replacer5
AssertionError
	exceptionr
cluster_infor8
elements
portZ
iprp
_load_cluster_conf_filem
Can not found local key file.z#Get cluster name failed, pls check.z
Get node id failed, pls check.r
z'Write local host_key(%s) into key file.)
ordre
cluster_name_numericalZ
char_valuer
check_key_file
multipathd reconfigureTr
multipath_reconfigure
findmnt -n -l -t ocfs2Tr
exit status 1z
%sr1
len)
mountsr$
exc_str
linesr9
tokens
deviceZ	mnt_pointr
read_mounts
z,Release type 5 reservation for given device.r&
NTzARelease reservation for dev(%s) failed: device is not accessible.Fz
sg_persist -n -o -L -T 5 -K r'
z2Release reservation key(%s) for dev(%s) failed(%s)z'Release reservation for dev(%s) succeed)
release_reservationr%
s<qPd
Disable mpath persist feature which auto set reservation key for
    reinstate paths or new paths founded by remove reservation key
reservation_keyN
New multipath.conf: %srR
/Update multipath.conf for fence scsi failed: %sF
MPATH_LOCKFILE
fcntlZ
flock
filenoZ
LOCK_EX
MPATH_CONFrL
MPATH_CONF_TMP
remove
writelines
shutil
copy
BaseExceptionr#
	new_lines
lockfdrO
new_filer0
%remove_multipath_conf_reservation_key
d	}	~	d
d	}	~	0
zeEnable mpath persist feature to auto set reservation key for
    reinstate paths or new paths foundedFr
    reservation_key r1
defaults {
already_setZ
in_default_secr
reservation_strr
"set_multipath_conf_reservation_key 
multipathd map z
 unsetprstatusTr
z+Unset dev %s multipath pr status failed: %s
Z	iteritemsr_
Z	mount_tabZ
_mount_pointr
unset_multipathd_pr_statusW
 setprstatusTr
z)Set dev %s multipath pr status failed: %sr
set_multipathd_pr_statusc
unknownz
tunefs.ocfs2 -Q "%J
" Tr
enable
disablez.Query the fence scsi feature switch failed, %sr1
is_enabled_fencescsio
z$Cannot get device fence scsi switch.r
zLFence scsi disabled but dev (%s) have residual reservation and clear failed.r
zBFence scsi disabled and clean residual reservation for %s succeed.r
Unfence scsi for (%s) failed.
Unfence scsi for (%s) succeed.z(Get local host_key failed, please check!
zHFence scsi feature is  enabled but device(%s) is not support fence scsi.)	r
switchZ	local_keyr
do_unfence_scsiz
util_common_toolsZ
util_cvk_logZ
ocfs2_multipathZ
sa_iscsi_commonZ
ocfs2_iscsi_commonr>
FENCE_SCSI_LOCKFILEr
<module>
