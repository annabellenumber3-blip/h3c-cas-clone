# File: ocfs2_iscsi_common.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/storage-admin.package/scripts/ocfs2_iscsi_common.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

d2d d!
d3d"d#
d4d$d%
Z d5d&d'
Z!e"d(
d)d*
Z#e"d(
d+d,
d-d.
Z%d6d/d0
ElementTree)
	PAD_PKCS5z
/var/lock/cas_iscsi.lockz
iscsiadm --interface %s -m node -p %s:%s -o update -n node.session.auth.authmethod -v CHAP -n node.session.auth.username -v '%s' -n node.session.auth.password -v '%s'z
iscsiadm --interface %s -m node -T %s -p %s:%s -o update -n node.session.auth.authmethod -v CHAP -n node.session.auth.username -v '%s' -n node.session.auth.password -v '%s'zR -n node.session.auth.username_in -v '%s' -n node.session.auth.password_in -v '%s'z
/etc/iscsi/nodes/Z
hph3c_z01500
n$d	|
/etc/libvirt/storage/%s.xml
1Storage pool %s or configure file does not exist.Z
OCFS2_GET_POOL_PATH_FAILEDz/virsh pool-list | grep ^%s\  | awk '{print $1}'T
shellz=Storage pool %s is already inactive, no necessary to stop it.z
virsh pool-destroy %sz!Storage pool %s has been stopped.z(grep -w ocfs2 /proc/mounts | grep \ %s\ zCStorage pool %s has been stopped, but still mounted. Try to umount.z	umount %sz.Storage pool %s has been stopped and umounted.z?Getting mount point of storage pool %s failed, but ignoring it.
o2hb-%s
ps -ef | grep "\[%s\]"z>Storage pool %s is umounted, but its o2hb thread still exists.zHo2hb thread of storage pool %s already exits, it is safe to proceed now.zLGetting uuid of device %s failed due to unknown reason. This doesn't matter.Z
OCFS2_UMOUNT_FAILED)
path
exists
logging
error
ocfs2_error
subprocess
check_output
strip
warning
check_call
info
get_storage_pool_mp
util_cmds_output
get_storage_pool_path
get_dev_uuid
replace
upperZ
CalledProcessError
BaseException)
	pool_name
xml_file
result
is_mounted
deviceZ
uuid_org
uuidZ	hb_threadZ
hb_info
ocfs2_iscsi_common.py
stop_storage_pool3
./source/modez-Storage pool %s was defined by older version.
parse
find
textr
moder$
treeZ	mode_noder*
get_storage_pool_modev
./source/devicer
z)source device of storage pool %s is None.)
getr!
device_pathr$
./target/pathz'mount point of storage pool %s is None.)
Z	path_infor*
)	NZ
Unknownz#/lib/udev/scsi_id --whitelist -u %s
z;get device:%s scsi_id from command /lib/udev/scsi_id failedz
get scsi_id from device pathz
/dev/disk/by-id/dm-name-r
z#get scsi_id from device path failed)
lenr
splitr
dev_pathZ
is_from_pathZ
scsi_idZ
dev_naa
listr*
get_scsi_id
blkid -s UUID %s 2>>/dev/nullTr
command blkid output is empty
device %s uuid is %s)	r
decoder7
debugr!
get_uuid_cmd
output
betr+
z=debugfs.ocfs2 -R "stats -h" %s |grep "disk-lock" 2>>/dev/nullz'device %s do not have disk lock featurezXdebugfs.ocfs2 -R "stats -h" %s | grep "Disk Lock Switch" | awk '{print $4}' 2>>/dev/nullz,device %s do not have disk lock switch valueZ
yesz
device %s uses disk lockr6
device %s uses dlm lock)
Z	disk_lockZ
feature_cmdZ
dlock_featureZ
dlock_switch_cmdZ
dlock_switchr?
device_use_dlock
default
3260c
zTt	|
port
Aiscsiadm --interface %s -m node -T %s -p %s:%s -l >/dev/null 2>&1r
z&Log in target %s with %s successfully.zgiscsiadm --interface %s -m node -T %s -p %s:%s --op update -n node.startup -v automatic >/dev/null 2>&1z-Set target %s with %s automatic successfully.
zBLog in target %s with %s successfully, the session already exists.zKLog in target %s with %s failed, retry once by login_session_by_virtual_ip.z Log in target %s with %s failed.z5login failed, clear chap arguments, remove dir for %sF)
set_decrypt_chap_args
format_target_ipr
returncoder%
login_session_by_virtual_ipr
ISCSI_NODE_FILE
shutil
rmtree
set_chap_args
append)
target
ip_addr
	chap_argsZ
set_automatic
	transportZ
ret_listrD
result_code
	cmd_loginr%
Z	file_pathr+
login_sessionA
)	Nr
zAiscsiadm --interface %s -m node -T %s -p %s:%s -u >/dev/null 2>&1Tr
z&iscsi logout -T %s -p %s successfully.z iscsi logout -T %s -p %s failed.Z
OCFS2_ISCSI_LOGOUT_FAILEDZ
OCFS2_SUCCESS)
is_valid_ipv6Z
getIpv6FullAddressrH
ip_address_fullr%
logout_sessionx
z+chap args wrong, please check for chap args
z'set CHAP authorization failure, msg: %s)
INITIATOR_IP_CHAP_CMDrH
INITIATOR_CHAP_CMD
TARGET_CHAP_CMDr
update_cmd
excr+
.set des encrypt chap arguments failed, msg: %s)	
ranger7
des_encryptrN
	traceback
format_exc)
chap_args_crypt
set_des_chap_args
)	r`
des_decryptrN
chap_args_decryptrd
stringc
padmode)
PASSWORD_KEYr
encrypt
base64Z	b64encoder<
des_obj
secret_bytesr+
=)	r
Z	b64decodeZ
decryptr<
missing_paddingrl
decrypt_strr+
NzGiscsiadm --interface %s -m node -T %s -p %s:%s --op new >/dev/null 2>&1Tr
z5Add record target %s with virtual_ip %s successfully.rC
z1Log in target %s with virtual_ip %s successfully.rF
zMLog in target %s with virtual_ip %s successfully, the session already exists.)
virtual_iprS
sft	
Nzdiscsiadm --interface %s -m discovery -t st -p %s:%s -o new -o delete 2>/dev/null | awk '{print $NF}'Tr
z"No target find with virtual_ip %s.z(Discovery targets %s with virtual_ip %s.)
setr<
discovery_listr+
find_target_by_virtual_ip=
)'rL
reZ	xml.etreer
util_common_toolsZ
util_sh_error_code_loaderZ
pyDesr
ISCSI_LOCKFILEr[
encoderi
strra
<module>
