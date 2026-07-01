# File: util_cvm_mount.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/util.package/scripts/util_cvm_mount.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

j d	d
Z!e"
#d#e
j d	d
e!d	k
j d	
$e%d%
j d	
Z'e'd
e'd	
$e%d%
$e%d(
z e"
Z*[*nFd
Z*[*0
z$e"
$e%d+
Z-[-n
Z-[-0
$e%d%
*z)/etc/cvm_storage/cvm_storage_template.xmlz
mount %s %sz
mount -o _netdev %s %szVmount -t nfs %s:%s %s -o soft,timeo=50,retrans=10,retry=10,rsize=1048576,wsize=1048576z@mount -t cifs //%s%s %s -o username=%s,password=%s,sec=ntlm,softz	umount %s
iscsi
netfs
cifs
nvme-ofc
NAMEz)	 util_cvm_mount.py mount ext4 fs for cvmZ
SYNOPSISz
	$0 [ -h | boot ]Z
DESCRIPTIONz
	 -h Help and usagez
	 boot boot cvm storage pool)
print
util_cvm_mount.py
usage-
type
mount_pointz(Mount check %s type cvm storage pool %s.r
dm_namez
Failed to get device uuid
UTIL_DISK_NOT_EXISTEDz$device %s is mounted on other hosts.Z
UTIL_FORMAT_DISK_MOUNTEDr
	host_name
src_pathz%/opt/bin/util_nfs_pool_check.sh %s %sT
shellz&nfs [%s:%s] server check successfully.z(nfs [%s:%s] server check failed, ret=%d.
auth_login
auth_passwdz8host_name=%s, src_path=%s, auth_login=%s, auth_passwd=%sz,/opt/bin/util_cifs_pool_check.sh %s %s %s %sz-cifs [%s:%s:%s:%s] server check successfully.z/cifs [%s:%s:%s:%s] server check failed, ret=%d.
UTIL_MOUNT_CHECK_FAILEDz%Mount check cvm storage pool %s pass.)
logging
warningZ
get_uuid
error
util_errorZ
isHeartBeatChanged
subprocess
call
debug
BaseException)
	pool_dict
retr
dm_pathr
UUIDZ
is_device_hb
mount_checkC
z$do mount %s for %s cvm storage pool.r
[%s]r
UTIL_MOUNTED_FAILEDz?python3 /opt/bin/util_cvm_storage_status.pyc 2 0 %s %s; echo $?zBpython3 /opt/bin/util_cvm_storage_status.pyc 2 0 %s %s %s; echo $?r
UTIL_READONLY_POOLz7Storage LUN may be Read-only file system, please check.)
g_template_typer
check_call
ISCSI_MOUNT_CMD
split
set_dm_device_read_ahead
FC_MOUNT_CMD
startswith
NFS_MOUNT_CMD
CIFS_MOUNT_CMD
NVMF_MOUNT_CMDr&
util_cmds_output
intr 
operatorr(
mount_typeZ	mount_naar
cmd_netZ	cmd_share
resultr
do_mount
qBqB|
}	~	n
}	~	0
z*check mount point %s for cvm storage pool.z$Directory %s is not exist, mkdir it.
Mkdir directory %sz:Directory %s is already exist, wheather mounted by others.r.
-Remove unnecessary '/' when query mount info.
8cat /proc/mounts | awk '{print $2}' | grep ^%s$; echo $?Tr
z1Directory %s has mounted by others, please check.Z
UTIL_DIRECTORY_MOUNTEDz
Check has wrong result %s.r1
z6This may be a bad mount point %s, try to umount first.z
umount -l %szMTry to umount this bad mount point %s failed, please check and umount manual.z/check mount point %s for cvm storage pool pass.)
path
isdirr4
mkdirr%
check_output
decode
stripr 
dirsZ
dir_name
mount_point_copyr*
outputr>
mount_point_check
}	~	n
}	~	0
%s cvm storage pools %s.z&Mount pool is not exist, please check.r
creater
z-Create pool number %d is wrong, please check.r
mountZ
activater.
z$CVM storage pool %s has not mounted.r1
z,Mount cvm storage pool %s failed, result=%d.z'Mount cvm storage pool %s successfully.)
UMOUNT_CMDrP
pool_dict_listr=
mount_handler
}	|	d
r&|	D
)'Nr
z/There is no storage configure xml file, return.
UTIL_SUCCESSz
Mount all cvm storage pools.z
Rectify xml failed, ret_code=%d
poolr
./target/pathr
devicerF
./source/lun_info/pathr
z<Get iscsi mpio path failed for mount point %s, with errno %sr-
z^This lun more than one path, we enable multipath and try to mount avoid miss the accessible ip
./source/lun_info/naaz9Get fc mpio path failed for mount point %s, with errno %sr
./source/hostz
./source/dir
namer
./source/authZ
login
passwdr
z3python3 /opt/bin/sa_multipath_enable.pyc -s 0 -n %sz7Collect %d cvm template storage pools %s need to mount.rQ
) rE
exists
CVM_STORAGE_XMLr
exitr"
rectify_xml_lun_infor!
ElementTree
parse
getroot
	get_nodesr
list
find
text
findallr 
get_iscsi_mpio_path
clear
appendr4
get_fc_multi_path_listZ
errorcode_fc_to_util
copy
deepcopyr;
temp_pool_dictrS
fc_multi_path_listZ
enable_mpath_naasr>
tree
	root_node
pool_nodes
	pool_node
	pool_type
nodes
node
	path_nodeZ
dst_pathZ
device_node
path_nodesZ	naa_nodesZ	host_nodeZ
dir_noder
Z	auth_noder
enable_mpath_naar*
efir
do_mount_handlerY
]2}	|
)	Nr
./source/lun_info/path/lunrX
./source/lun_info/path/host
UTIL_WRONG_PARAM)
attribrh
addr&
pool_ipsZ
pools_naa_ipr(
pool_naa_path
naa_noders
ip_nodesZ
temp_node_ipsZ
ip_nodert
get_input_lun_info
r|t	
q|qZqZqZn\t
| d	
}!|!d
}"|"|
rD|"|
rD| d
|#d	
}$|#d
}%|#d
}&|&d
}'|'|%d
|#d	
|#d	
}(|(
})|(|)d
|%|)
}&|&d
}'|'|%d
}(|(
})|(|)d
|%|)
}*~*n
}*~*0
)"Nr
z5python3 /opt/bin/ocfs2_iscsi_list_lun.pyc %s; echo $?rV
z.Parse xml file/string get pool info is %s & %sz
./naarv
./path/lunrX
IP %s is not reachable!z
Query pool with ip %s is %sr
temp_pools_naa_ipv6 = %sr-
FTz5Current host can't find pool %s, xml file have error.z3Template xml not match current cvm, rectify with %srW
mv %s %s.rectifyz./etc/cvm_storage/cvm_storage_template.xml.testz
utf-8)
encodingZ
xml_declarationZ
xml)
methodz
Rectify xml is %sry
setr_
fromstringr
isAddrReachabler;
removeZ
is_valid_ipv6Z
getIpv6FullAddressr4
rfind
range
writeZ
tostringr&
	exception)+Z
dubious_cvm_storage_xmlr(
temp_pool_naa_pathZ
temp_pools_naa_pathZ
temp_pools_naa_ipZ
temp_pools_naa_ipv6Z
temp_pool_ipsZ
current_pools_naa_pathZ
correct_cvm_storage_xmlr*
input_infor'
ipr>
root_nodesZ
source_nodesZ
source_noder|
Z	temp_poolrv
naa_ipsZ
temp_pool_ip_portZ
temp_pool_ipZ
temp_pool_naa_foundZ
current_poolZ
current_pool_ip_portZ
current_pool_ipZ	pool_listrs
ip_port_from_pathZ
ip_from_pathZ
pool_list_ip
indexrt
rBt	
qnqB|
}	~	n
}	~	0
multipath -ll /dev/%sTr
activez
\b(sd[a-z]+)\br
z%cat /sys/block/%s/queue/read_ahead_kbz+echo %s > /sys/block/%s/queue/read_ahead_kbz-%s to set dm device read_ahead_kb failed, %s.)
realpathr4
splitlines
search
group
	Exceptionr
str)
dev_namer
line
matchZ
sd_read_aheadZ
dm_read_ahead
excr
__main__Z	cvm_mountz
Input parameters: %sz
-hrU
bootz0This is cvm hot backup environment, just return.ry
z,Begin to mount all cvm template storage poolz+End to mount all cvm template storage pool.r1
).r\
	threadingZ
util_cvk_logZ
ocfs2_disks_mountedZ
ocfs2_mount_checkZ
ocfs2_iscsi_lvm_setupZ
sa_iscsi_commonZ
util_cvm_lun_sessionr[
__name__Z
spare_ipZ
cas_log_init2r 
argvZ
arcr
cvm_hot_backup_checkr>
SystemExitZ
ser!
<module>
