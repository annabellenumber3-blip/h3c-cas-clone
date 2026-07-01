# File: util_cvm_setup.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/util.package/scripts/util_cvm_setup.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

Z e!d
Z"d Z#d
e&d!
j'd"d#
Z(e(j)d$g
d&d'
e(j)d(d)d*d+d,
e(j)d-d.d/d0
e(j)d1d2d3d0
e(j)d4d5e*d
d7d8
+d9e
j,d6d
Z1e1d
e1d6
e.j2d:k
e.j2d;k
r e.j3d
e4e.j3
6e7d=
e.j2d;k
/d>e.j3
e8e.j3
/d?e1
rRe1d6
e._3n
5d@e1d
e.j3e.j2
Z1e1d
5dAe1
Z:e:dCk
e:dDk
e:dEk
+dGe:e$f
dHe$e.j;f
j=e<d dI
Z"e"d
5dJe$e"f
e.j2d:k
n$e.j2d;k
rZe"e7dK
Z>e>
e@e>e.j2
Z"e"d
e.j2d:k
Ce.j3
eDe$
Z"e"d
5dQe"
e7dR
e.j2dSk
rje.jFd
e.jFdT
rfe4e.jF
ZGe.jFd
e._Fg
ZHeH
?e.jF
eIeHdS
e.j3d
dYZ#e
e.j3
ZLeLd
+dZeL
d[eLv
d\eL
d]eL
j=e<d dI
Z"e"d
5d^eLe"f
e7d_
Z"n,e
Z"e"d
5d`eLe"f
e7d_
Z"nBe.j2dak
e.jMd
e.jM
5dbe.j2
dYZ#e
e#d k
Z<eNeOe
Z1e*e1d
ZPe.j2d:k
e.j2d;k
rLePd
+dde
j=eOe
d dI
Z"e"d
dYZ#n
e.j2dSk
rhdYZ#nrdce
Z<eNe<
Z1e*e1d
ZPePd
+dfe
dYZ#dge
j=eOe
d dI
Z"e"d
+dhe
e#d k
ZReRdik
r<dje
j=e<d dI
Z"e"d
5dke"
+dle
dmeR
ZSdje
j=e<d dI
Z"e"d
5dneSe"f
nZeSdU
ZTdpeTe
j=eOe
d dI
Z"e"d
5dqeTe"f
+dreT
e7ds
ZV[VnFd
ZV[V0
6e7d=
ZX[Xn
ZX[X0
/dev/disk/by-path/z
/etc/cvm_storage/z)/etc/cvm_storage/cvm_storage_template.xmlz	umount %sz@grep "<path>%s</path>" /etc/cvm_storage/cvm_storage_template.xmlz8cat /proc/mounts | awk '{print $2}' | grep ^%s$; echo $?c
rpd	|
) Nr
Lun %s has no pv, just return.z3lun %s is part of vg %s, should remove lun from vg.z=pvs --noheading -o +lv_name %s 2>/dev/null | awk '{print $7}'T
shellz.lun %s is part of lv %s, should remove the lv.z
/dev/%s/%sz
/opt/bin/dev_not_busy_test %s
UTIL_DEV_BUSYz3lun %s of device %s is busy, need clean up manuallyz)busy test: lun %s of device %s return %d.z!lvchange -aln %s 2>/dev/null 1>&2z5Result of changing lv %s attribute to inactive is %d.
z dmsetup remove -f %s 2>/dev/nullz$Result of dmsetup remove -f %s is %dz.lvm_path %s does not exist, no need to remove.z
step1: remove lv %s.z
lvremove -f %s 2>/dev/nullz
step2: remove vg %s.z-pvs --noheading 2>/dev/null | grep %s | wc -lz-There are %d pvs in %s, use vgreduce command.z
vgreduce -f %s %s 2>/dev/nullz*There is 1 pv in %s, use vgremove command.z
vgremove -f %s 2>/dev/nullz
step3: remove pv %s.z
pvremove -f %s 2>/dev/nullzHclean lun %s lvm info failed, use dd as final method, clean first 192KB.z4dd if=/dev/zero of=%s bs=1024 count=192 oflag=directz%lun %s has no VG, just remove the pv.)
appendZ
get_devlist_pv_info
logging
warning
subprocess
check_output
decode
strip
path
exists
call
util_error
error
time
sleep
infoZ
check_call
BaseException
	traceback
format_exc)
retZ
g_dev_listZ
g_current_pv_dictZ
vg_name
resultZ
lv_nameZ
lvm_pathZ
lv_cmdZ
ret_noreturnZ
pv_num
util_cvm_setup.py
check_lun_pv_and_remove7
NFz?The directory /etc/cvm_storage/ is not exist, need to mkdir it.z(The xml configure file is already exist.
poolz&exist_pool_type=%s, input_pool_type=%s
type
targetr
Tz/Mount point have exist in cvm storage template.Z
UTIL_SUCCESS
nodeZ
devicer
z1The xml file is not exist, should to generate it.Z
cvm_storage_templatez
utf-8)
encodingZ
xml_declarationzdWrite cvm storage pool configure to xmlfile[/etc/cvm_storage/cvm_storage_template.xml] successfully.Z
UTIL_WRITE_CONF_FILE_FAILED)
isdir
CVM_STORAGE_DIRr	
mkdirr
CVM_STORAGE_XML
debug
ElementTree
parseZ
getrootZ	get_nodes
getZ
get_node_value
list
textr
ElementZ
SubElementZ
attribZ
_setroot
writer
input_node
	path_nameZ	node_list
FlagZ
treeZ	root_nodeZ	pool_nodeZ
pool_nodesr$
mount_pointZ
target_nodesr&
target_path
dst_pathZ
sub_noder'
device_noder 
write_configure_to_xmlfile
}	|	d
)	Nr
namez0%s cvm can reach iscsi lun %s via ip address %s.Tz4%s cvm can not reach iscsi lun %s via ip address %s.
UTIL_FS_SERVRE_NO_RESPONSE)
fromstringr1
iterr0
role
ip_addr
lun_pathr
Z	lunxmlstrZ
lun_root
lun_node
lun_namer 
iscsi_server_check
qxqN|
}	~	n
}	~	0
naaz
%s cvm can reach FC lun %s.Tz
%s cvm can not reach FC lun %s.r<
Z	naaxmlstrZ
naa_rootZ
exist_naa_node
elementr 
fc_server_check
qxqN|
}	~	n
}	~	0
uuidz
%s cvm can reach nvmeof lun %s.Tz#%s cvm can not reach nvmeof lun %s.r<
nvmeof_server_check0
](}	t
z*Something wrong occur, so try to fallback.
UTIL_INACTIVE_POOLZ
UTIL_READONLY_POOLr7
3Umount %s failed with code %d, please check reason.r%
iscsi
dm_namezGThere is something wrong when cancel multipath device %s, please check.rA
-iscsi-r
-lun-
all_hosts_name
 zGThere is something wrong when logout server %s target %s, please check.
nvme-of
UMOUNT_CMD
g_pool_dictr0
cancel_multipath
split
rsplitr
iscsi_logout_session
nvmf_multipath_configr
errnor
	pool_type
dm_path
device_path
target_lunr&
hosts_list
	host_name
wwidr 
fallback_handleV
z7Check disk lun %s is mounted, lvm or multiparts or not.rN
z/python3 /opt/bin/util_cvm_lun_session.pyc %s %s
loginTr
z+python3 /opt/bin/ocfs2_disks_mounted.pyc %sz(Disk %s had been mounted by other hosts.Z
UTIL_FORMAT_DISK_MOUNTEDrU
z'/opt/bin/ocfs2_disk_lun_check.sh %s 1 1z%Disk %s lun check failed, errorno=%d.Z
UTIL_DISK_NOT_EXISTED)
errorcode_ocfs2_to_utilr
rtn_coder
disk_lun_check
}	|	d
r z&d
d"|	|
	d#|	|
	d&|
d"|	|
	d#|	|
]<} |
d-| |!f
| |!k
}"|"
|"d.
	d/t
	d0|
	d3|
}$|$d
r@|$d
t!|#|
t!|#|
r.t"|
	d5|
	d6|
}'|'d
}(|'d
})d=|)
	d?|
&d@|
	dA|
&dB|
|&|(|)f
	dD|
|&|(|)f
&dE|
|&|(|)f
|&|(|*f
	dF|
|&|(|)f
&dG|
|&|(|)f
},|,d
}-|-
}.|.d
}	|-
}/|/d
t'|+|
t'|+|
}"|"
|"d.
	d/t
rft(|
	dR|+|
dS|+
&dV|
)WNr
Parse input xml string.r%
lun_infor
GThe input parameter is wrong, there must be one lun_info, please check.
UTIL_WRONG_PARAMrU
	multipath
[The input parameter is wrong, there must be one multipath for nvmeof storage, please check.r&
BThe input parameter is wrong, there must be one lun, please check.r;
ip-z
:3260
hostrT
z;python3 /opt/bin/ocfs2_iscsi_list_lun.pyc %s -t %s; echo $?Z
Currentz*Can not reach storage server ip %s, ret=%s
activate
createz.python3 /opt/bin/iscsi_mpio_check.pyc %s %s %sTr
OCFS2_DISK_MULTI_PARTSz9lun %s-lun%s has multi-parts, return success temporarily.z1iscsi mpio check [%s %s %s] failed with errno %d.Z
UTIL_MASTER_CVM_CANNOT_REACH_FSZ
Sparez0Can not reach storage server ip %s by %s, ret=%sZ UTIL_STANDBY_CVM_CANNOT_REACH_FSz2%d host name check failed: %s, a total of %d hostsrA
z.host %s in failed hosts, name %s in path nodes
removerM
z)Get iscsi mpio path failed, with errno %s
UTIL_SAN_MP_OR_HBA_CHANGErP
zBNaa %s from xml not match inquire result %s by xml path lun, checkz
/opt/bin/fc_san_get_naa_wwid.sh
@Select fc multi path failed, should be remove lvm, with errno %d
'Get fc multi path failed, with errno %dZ
netfsZ
cifs
dirZ
authre
passwdz
'%s'z%/opt/bin/util_nfs_pool_check.sh %s %sz5Current cvm can not reach nfs [%s:%s] server, ret=%s.z)Current cvm can reach nfs [%s:%s] server.z+Spare cvm can not reach nfs [%s:%s] server.z'Spare cvm can reach nfs [%s:%s] server.z,/opt/bin/util_cifs_pool_check.sh %s %s %s %sz4Current cvm can not reach cifs [%s:%s:%s:%s] server.z0Current cvm can reach cifs [%s:%s:%s:%s] server.z2Spare cvm can not reach cifs [%s:%s:%s:%s] server.z.Spare cvm can reach cifs [%s:%s:%s:%s] server.rb
src_path
auth_login
auth_passwdrJ
.//path[@type="nvme-of"]z	.//subnqnz
.//address
addrz:python3 /opt/bin/ocfs2_nvmf_list_lun.pyc %s -t %s; echo $?z,Set %s nvme multi path failed, with errno %d
 /dev/disk/by-id/dm-uuid-mpath-%sz
The pool type is wrong.Z
UTIL_GET_DEVICE_PATH_FAILEDz%the device is %s, the pool dict is %r)*r	
DEVICE_PATHrZ
util_cmds_outputrD
joinr
CalledProcessError
returncode
ocfs2_errorrr
g_spare_ip
SSH_PARAMETER
warnrf
findall
find
umount_handlerZ
get_iscsi_mpio_pathrI
get_fc_multi_path_list
errorcode_fc_to_util
lvm_remove_for_dm_setupr
nvmof_parse_mpathr
	xmlstring
moder
fc_multi_path_list
rootr^
multipath_infor&
lun_numr@
host_name_failedZ
ip_listZ
host_nodes
	host_noderb
Z	spare_cmdZ
path_nodesZ
xml_naa_infoZ
xml_naar'
umount_point_listrE
naa_nodeZ
dir_noderx
Z	auth_nodery
spare_auth_passwdrJ
	uuid_node
	path_nodeZ
target_nodeZ
ip_addr_noder!
get_storage_info_from_xml
Stop template storage pool %srW
Umount %s success.z3Umount %s failed with code %d, try to umount again.z
umount -l %szMTry to umount this bad mount point %s failed, please check and umount manual.Z
UTIL_STOP_FAILEDz(Template storage pool %s is not mounted.z'Template storage pool %s is not record.)
GREP_POOL_CMDr
MOUNTED_POOL_CMDr
Z	pool_pathr
result1
valid_str_lenZ
result2r
stop_template_storage_pool	
}	|	d
rD|	d
parse_disk_path_from_xml:
	transportr%
subnqnZ
addressr{
svcidrT
subsys: %s, target: %sz0session_connect_before: %s, %s: %s connected: %sz&nvme connect -t rdma -n %s -a %s -s %sTr
OCFS2_NVMF_CONNECT_FAILEDz&nvme connect %s with %s fail, ret: %d.
z1nvme connect %s with %s has been already existed.z*wwid: %s multipath config failed, ret: %d.z"multipath conf file changed failedr
z result of cancle multipath is %dZ
OCFS2_MULTIPATH_CONF_FAILED)
nvmf_get_connectr
nvmf_multipah_path_checkr
	path_listrc
session_connect_beforer
subsysr@
Z	connectedr
cancle_rtnr!
__main__TZ	cvm_setupz
CVM storage pool configure.)
descriptionr
stopz
Operation mode on CVM)
choices
helpz
-dz	--devices
xmlstrz
device path list in xml format)
destr
--removez
remove storage pool)
--stopz
stop storage poolz
--forcer
z)flag of whether forced format lun or not.)
defaultr
input parameters: %srq
z+The input parameter do not have xml string.rj
debugs start xml:%sz	result:%sz
Rectify xml failed, ret_code %dz(Failed to parse xml string with errno %sr%
z,Disk lun check for type[%s], device path[%s]z!/opt/bin/util_cvm_format.sh %s %dr
z"Disk %s format failed, errorno=%d.r
zDRm remain mount directory when create because mount or access error!r7
zDThe cvm storage configure file write successfully, check self-mount.Z
tomcat_createZ
rclocal_createzLFail to write cvm storage pool configure file, now umount and clean, ret=%s.rL
z=The cvm storage configure file has deleted, check self-mount.Z
tomcat_removeZ
rclocal_removeFz
Delete disk %s multi-parts.z
eui.z+/opt/bin/ocfs2_nvmf_disk_parts_delete.sh %sz#/opt/bin/ocfs2_disk_parts_del.sh %sz
Delete the device %s failed %dZ
UTIL_DISK_MULTI_PARTS_DELz;The device %s has any multi-parts and delete them failed %dr
Wrong mode %s!z
test -d %s; echo $?z=CVM %s have no directory /etc/cvm_storage/, need to mkdir it.z
mkdir %s; echo $?zXCurrent cvm has deleted directory /etc/cvm_storage/, so backup cvm %s need to delete it.z
rm -rf %s; echo $?z<Rm backup cvm %s directory /etc/cvm_storage/ failed, ret=%d.r
scp %s %s@[%s]:%sz\Copy /etc/cvm_storage/cvm_storage_template.xml to /etc/cvm_storage/ failed %d, please check.z_Copy /etc/cvm_storage/cvm_storage_template.xml to backup cvm %s /etc/cvm_storage/ successfully.z
/home/zWscp /etc/cvm_storage/cvm_storage_template.xml to backup cvm %s failed %d, please check.z
cvm_storage_template.xmlz
sudo mv -f %s %sz%mv %s to /etc/cvm_storage/ failed %d.z(mv %s to /etc/cvm_storage/ successfully.Z
UTIL_SET_SELF_MOUNT_FAILED)Y
sysr
argparseZ
util_cvk_logZ
ocfs2_iscsi_lvm_setupZ
util_xml_commonZ
util_common_toolsZ
util_cvm_lun_sessionZ
util_cvm_mountZ
util_cvm_umountZ
fc_san_lun_setupZ
ocfs2_nvmf_pool_setupr}
__name__r
cpoy_xmlr_
cas_log_init2
ArgumentParser
parser
add_argumentr
argv
parse_args
argsr-
cvm_hot_backup_checkr
exitr
rectify_xml_lun_infor0
forcer
pool_dict_listr
mount_handler
rmdirr.
cvm_self_mount_handlerrr
Z	disk_pathr
dir_retZ
get_ssh_userZ
ssh_userZ
USER_HOME_PATHZ
CVM_STORAGE_XML_TMP
SystemExitZ
betr!
<module>
