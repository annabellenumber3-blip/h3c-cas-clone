# File: ocfs2_iscsi_lvm_setup.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/storage-admin.package/scripts/ocfs2_iscsi_lvm_setup.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

l	Z	d
Z)d!d"
Z*d#d$
Z+d%d&
Z,d'd(
Z-d)d*
Z.d+d,
Z/d-d.
Z0d/d0
Z1d1d2
Z2e3d3k
zhe7d4d5
e8e9d6
=d7e6
j>d8d9
Z?e?j@d:d;d<g
d=d>
e?j@d?d@dA
e?j@dBdCdDdEdF
e?j@dGdHeAd
e?j@dJdKeAd
dLdM
e?j@dNdOeAd
dPdM
BdQe
eEjFd;k
eEjGd
eHeEjG
IeJdR
e$eEjG
ZKeHe
ZLeKd
MdSeKd
IeKd
ZNeEjOd
rbeEjQd
ZPdVeP
jSeRdWdX
BdYeP
Z4e4eJd[
Md\e
e*eEjT
ZKeKd
Z4eKd
ZPe4eJd[
Md]eEjT
e.eKd
e)eNeP
eEjFd<k
eEjGd
rHeHeEjG
rHe0eEjG
Z4e4d
eVeEjT
Z4e4d
eWeEjT
ZXeYeEjT
ZZeX
eHeZ
Md_eEjT
eJd`
Z4n6eXdak
eEjQd
e,eZ
e/eZeEj[
MdceEjTe4f
z@e]j^Z4e
Mdde4
=dee
e2e6e
Z][]n
Z][]0
e`jaeJdR
e`jad
=dee
e2e6e
e`jaZ4W
Z`[`n@d
Z`[`0
eJdR
Zc[cn
Zc[c0
/dev/disk/by-path/z
/dev/disk/by-id/dm-name-z
^CVK[A-Za-z0-9]{32}$
defaultc
-iscsi-r
-lun-z
:zAiscsiadm --interface %s -m node -T %s -p %s:%s -l >/dev/null 2>&1T
shellz%iscsi login -T %s -p %s successfully.
zAiscsi login -T %s -p %s successfully, the session already exists.zKLog in target %s with %s failed, retry once by login_session_by_virtual_ip.
portz8fdisk -l %s 2>>/dev/null | grep "Disk\ %s" | awk {print}
z$find iscsi lun %s used %d second(s).r
z,Can not find the iscsi lun %s in %d seconds.Z
OCFS2_DISK_NOT_EXISTEDZ
OCFS2_ISCSI_LOGIN)
path
exists
split
rsplitZ
format_target_ip
subprocess
check_call
logging
warning
BaseException
returncode
cmdZ
login_session_by_virtual_ip
check_output
strip
time
sleep
error
ocfs2_error)
lun_path
	transport
loop
target_lun
targetZ
ip_addr_port
ip_addrr
resultZ
lun_size
ocfs2_iscsi_lvm_setup.py
login_if_path_not_existB
}	|	d
qtz2d
namer
hostz:python3 /opt/bin/iscsi_mpio_check.pyc %s %s %s -I %s -P %s
OCFS2_DISK_MULTI_PARTSz9lun %s-lun%s has multi-parts, return success temporarily.z4iscsi mpio check [%s %s %s %s] failed with errno %d.
ip-%s:%s-iscsi-%s-lun-%sr
%s:%sZ
OCFS2_SCSI_ID_NOT_SAMEz=iscsi mpio check [%s %s %s] failed with naa compare errno %d.z3python3 /opt/bin/sa_multipath_enable.pyc -s 0 -n %sz,sa multipath enable %s failed with errno %d.Z
OCFS2_MULTIPATH_CONF_FAILED
OCFS2_GET_DEVICE_PATH_FAILED)
find
getr
append
joinr
decode
CalledProcessErrorr
debug
outputr"
is_valid_ipv6
convert_ipv6_to_full_format
g_logged_sessionr
ElementTree
SubElement
attribr
	traceback
format_exc)
	path_list
naar%
lun_str_listZ	mpio_pathZ	first_lunZ
lun_namer
iscsi_targetZ	iscsi_lunZ
ip_listZ	path_nodeZ	host_noder*
lun_info_list
lun_infor$
lun_str
lun_naa
session
	target_ip
target_namer'
lun_node_newr-
get_iscsi_mpio_path|
nlz"d
fc_san_naa_hba_select.sh 1 %sTr
(fc_san_get_disk_path_by_naa_wwn.sh %s %s
FC_SAN_DISK_MULTI_PARTS
3lun %s has multi-parts, return success temporarily.
/get fc-san single path %s failed with errno %d.z
fc_san_naa_hba_select.sh 0 %s
.get fc-san multi-path %s failed with errno %d.)
textr
fc_san_errorr
DEVICE_MULTIPATH)
wwn_noder&
fc_pathr
wwnr,
get_fc_san_path
z#FC lun %s will be cancel multipath.
fc_san_naa_hba_select.sh 1 r4
keysr
naa_wwn_dictr&
fc_path_list
lun_naa_listr
get_fc_single_path_list
z FC lun %s will be set multipath.z$/opt/bin/fc_san_naa_hba_select.sh 0 r4
get_fc_multi_path_listD
d	}	|
j	}	|	d
sourcerK
There must be at least one lun.
OCFS2_ERR_WRONG_PARAMrJ
There must have a legal NAA.Z
iscsiz
./storage_protocolZ
iserr
z)get iscsi mpio path failed, with errno %sr[
z(get fc single path failed, with errno %dr
z'get fc multi path failed, with errno %dz
g_logged_session is %sr8
the device list is %s)
ElementZ
fromstringZ
find_nodesr
g_dev_listr;
extendr 
	xmlstringr&
fc_single_path_dictZ
fc_multi_path_list
rootZ	lun_nodesZ
lun_nodeZ
naa_noderJ
lun_storage_protocolZ
lun_storage_protocol_er%
Z	lun_pathsr,
get_dev_list_from_xmld
ocfs2_disk_lun_check.sh %s 0 1Tr
Disk %s check successfully.z2Call ocfs2_disk_lun_check.sh failed, result is %d.
OCFS2_LUN_MERGE_FAILED)
dev_listr&
devicer
check_disk_sub_parts
Nz1rm -f /etc/lvm/cache/.cache; vgs 2>/dev/null 1>&2Tr
z-pvs --noheading 2>/dev/null | grep -v unknownr5
Unknown
get %s naa failedz
dieves %s have pv information.z0naa of device %s is %s, and it belongs to vg %s.z&Call pvs command failed, result is %d.)
callr
get_scsi_idr
all_pv_dict
devlist_pv_dictr
pv_cmdr@
pv_listZ
pv_infoZ
pv_info_listZ
device_nameZ
device_naa
length
vg_namern
errnor-
get_devlist_pv_info
}	|	|
] }	|
Nz,devices %s have no pvs, can directly create.z
devices %s in %s have pvs.r
Fz0not all devices have pv, should create pv first.z
vg is empty, should create itz4Not support now, all devices must have volume group.z1vgs --noheading %s 2>/dev/null | awk '{print $2}'r
z@Not support now, VG %s need %d luns, but there are only %d luns.z!lvs 2>/dev/null | grep %s | wc -lz
VG %s does not have any lvz-pvs 2>/dev/null | grep %s | awk '{print $NF}'r5
Not all space of VG %s is used.z,lvs 2>/dev/null | grep %s | awk '{print $1}'z
VG %s just has one lv %sz
VG %s has multi-lvs.z
Format of vg name is invalid.z
device %s belongs to vg %s.z
devices %s have differrnt vgs.)
CHECK_PV_FAILEDr^
infore
NEED_PV_CREATEr?
NEED_VG_CREATEr"
intr
match
CVK_VG
NEED_LV_CREATEr
NEED_LV_CHANGEr
lv_nameZ
valid
	pool_namerv
first_pv
first_vgZ
same_vgr1
all_have_pvr
pv_numZ
numZ	free_listZ
all_used
spaceZ
vgr+
check_pvs_validity%
}	|	d	
NFr0
zAThese luns belongs to more than one VG, we could initialize them.TzCVG of LUN %s is %s, it is not CVK format, we could initialize them.rp
NAA of device %s is %sz
/etc/ocfs2/cluster.confr
ocfs2 cluster nodes are %s.z
ignore localhost %sZ
ip_addressz
ping6 -c 3 -W 1 %s >/dev/nullz
ping -c 3 -W 1 %s >/dev/nullr
z$Can't connect to host %s, ignore it.z4"grep \<naa\>%s\<\/naa\> /etc/libvirt/storage/*.xml"zANAA of device %s is %s already defined in storage pool on host %sz#We could not initialize these luns.z/get all luns naa failed, maybe something wrong.z=There is something wrong, we could not initialize these luns.)
ocfs2_cluster_conf_parse
socketZ
gethostnamerA
SSH_PARAMETERZ
util_cmds_outputr
device_listr
Z	first_naaZ
pvrx
ocfs2_conf_listZ
ocfs2_node_dictZ	localhostZ
nodeZ
node_ipr
cmd_retZ
cmdLineZ
cmd_infor+
verify_lun_merge_failed
dumpr
Z	root_node
	path_nameZ
device_noder+
add_device_node_and_print
}	t	j
z5devices %s have different vgs or not CVK+uuid format.rl
pvcreate %s 2>/dev/null 1>&2Tr
CVK%sz
vgcreate %s %s 2>/dev/null 1>&2r4
z!vgchange -aly %s 2>/dev/null 1>&2z0Result of changing vg attribute to active is %d.z
lvcreate -n %s z
-l 100%FREE z
%s 2>/dev/null 1>&2r
/dev/%s/%sz!lvchange -aly %s 2>/dev/null 1>&2z0Result of changing lv attribute to active is %d.z
fdisk -l %s 2>/dev/nullz0We must make sure these luns can be initialized.z4We could not initialize these luns, please check it.Z
OCFS2_NOT_INIT_LVM)
uuidZ
uuid1
hexr<
lvm_path
stepZ
check_level
g_current_pv_dictr,
new_vgZ
vg_cmdrx
attr_ret
lv_cmdr
create_lvm
)	Nz4fdisk -l %s 2>/dev/null | grep ^%s| awk '{print $1}'Tr
Disk %s has no sub partions.
 dmsetup remove -f %s 2>/dev/null
$Result of dmsetup remove -f %s is %d)
Z	disk_pathr
sub_listZ
sub_path
ret_noreturnr+
cancel_sub_multipathY
device path is nullTrp
Unset multipath with %s failed
get device %s naa failedr
OCFS2_REMOVE_LVM_FAILED)
multipath_configr
dev_pathr&
cancel_multipathz
input path list is null
unknownz;device path is null or unknown, no need to cancel multipathTrp
zHThe device list %s may bring new lvm information, must be removed first.z
lun %s is part of vg %s.
=pvs --noheading -o +lv_name %s 2>/dev/null | awk '{print $7}'r
.lun %s is part of lv %s, should remove the lv.r
/opt/bin/dev_not_busy_test %s
OCFS2_DEV_BUSY_NOW
3lun %s of device %s is busy, need clean up manually
)busy test: lun %s of device %s return %d.
!lvchange -aln %s 2>/dev/null 1>&2
5Result of changing lv %s attribute to inactive is %d.r
.lvm_path %s does not exist, no need to remove.z5clean lun %s lvm info failed, need clean up manually.r]
z#Result of cancel %s multipath is %dz-naa_list is none, no need to cancel multipathr
naa_listZ
new_path_listr
new_pv_dictZ
new_pv_listr1
new_vg_namer
new_lv_namer
cancel_all_multipath
No need to remove pv.
vgremove -f %s 2>/dev/nullTr
Remove volule group %s failedz$Remove volule group %s successfully.
pvremove -f %s 2>/dev/nullz
Remove pv %s failedz
Remove pv %s successfully.r
start_stepZ
err_stepr&
remove_lvm_when_create_failed	
z8pvs --noheading 2>/dev/null | grep %s | awk '{print $1}'Tr
lvremove -f %s 2>/dev/nullr
z#shell command failed with errno %d.r
pv_namer>
lv_path
levelr&
pv_pathr+
remove_lvm<
qRt	t
)(Nr
$get device list failed with errno %sz&The device list %s will be cleaned up.rj
z!Disk %s has sub-parts, delete it.z4/opt/bin/ocfs2_disk_parts_del.sh %s 2>/dev/null 1>&2z9The device list %s have lvm information, must be removed.z3lun %s is part of vg %s, should remove lun from vg.r
step1: remove lv %s.r
step2: remove vg %s.z-pvs --noheading 2>/dev/null | grep %s | wc -lz-There are %d pvs in %s, use vgreduce command.z
vgreduce -f %s %s 2>/dev/nullz*There is 1 pv in %s, use vgremove command.r
step3: remove pv %s.r
zHclean lun %s lvm info failed, use dd as final method, clean first 192KB.z4dd if=/dev/zero of=%s bs=1024 count=192 oflag=directz%lun %s has no VG, just remove the pv.r
z8pvcreate %s failed, use dd command to clean first 192KB.r
test_cmdr-
remove_lun_lvmu
}	~	n
}	~	0
Nz5iscsiadm -m session 2>/dev/null | awk '{print $3,$4}'Tr
No active sessions.r4
 []r
session_dictr
session_listrM
get_current_session
qzq:|
no session logged in.r
Session not changed.r
z#logout iscsi session %s with %s:%s.r
logout session failed.)
operator
logout_sessionr
old_dictZ
new_dictZ
target_ip_portrN
new_listr)
old_listr+
logout_session_when_failed(
__main__Z
ocfs2z
caslog/storage-adminz
ab+z$current session before process is %sz
LVM config)
description
modeZ
create
removez
Operation mode on lvm)
choices
helpr
Storage pool name)
-dz	--devices
xmlstrz
device path list in xml format)
destr
--level)
typer
--tunez flag of whether setup lvm or not)
--iscsi_poolz:flag of pool type is iscsi pool which use multipath or notz
input parameters: %srd
zGThis is a iscsi pool no need to check if lun need to be formated or notz7There is single lun and lvm flag is 0, no need to mergez'/opt/bin/ocfs2_disk_lun_check.sh %s 1 1Tr
zKThere are multi-luns (>=2) or setup lvm flag for single lun, need to merge.Z
OCFS2_SUCCESSz
One or more have sub-parts.z
add target %s failed, remove itz&Clean up lvm information successfully.z mode or path of pool %s is none.Z
OCFS2_GET_POOL_PATH_FAILEDr{
Need to remove lvm.z&Stop storage pool %s failed, errno=%d.z'Call shell command failed, result is %dz
Cancel multipath of %s.)
sysr
argparser
fcntlr
util_cvk_logZ
util_sh_error_code_loaderZ
util_common_toolsZ
util_xml_commonZ
ocfs2_iscsi_commonZ
sa_iscsi_commonZ
ocfs2_multipathZ
ocfs2_cluster_configZ
DEVICE_PATHrX
__name__r&
lockfdZ
session_beforeZ
cas_log_init3
openZ
ISCSI_LOCKFILE
lockf
filenoZ
LOCK_EXr
ArgumentParser
parser
add_argumentr
argv
parse_args
argsr
exitr#
xml_nodeZ
iscsi_poolr
tuner
stop_storage_poolZ
get_storage_pool_modeZ	pool_modeZ
get_storage_pool_pathZ	pool_pathr
SystemExitZ
coder
closer-
<module>
