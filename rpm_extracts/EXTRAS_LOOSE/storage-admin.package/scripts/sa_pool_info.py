# File: sa_pool_info.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/storage-admin.package/scripts/sa_pool_info.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

Z	d	d
ElementTree)
lunc
NAMEz
	 sa_pool_info.pyZ
DESCRIPTIONz!	 get information of storage poolZ
SYNOPSISz#	 <pool_name>: name of storage pool)
print
sa_pool_info.py
usage
-iscsi-r
-lun-
.get lun information from device path %s failedz#information of device path %s is %s)	
split
rsplit
logging
error
BaseException
	traceback
format_exc
debug)
device_path
lun_info
portZ
ip_port
target_lun
efir
get_lun_info_from_path!
}	|	d
} ~ d
} ~ 0
)#NFz
/etc/libvirt/storage/%s.xmlz1Storage pool %s or configure file does not exist.
name
type
	pool_typez
./source/format
pool_format_typez
./target/pathZ
mount_point_targetz
./source/multipath
	multipath
./source/device
pathr
z0storage pool %s has single lun and no multipath.
./source/target
iscsiz
lun-Xz
./source/hostr
3260r
./source/lun_infoz
./storage_protocolz
./pathz
./lunr
information of pool %s: %s)
osr&
existsr
parseZ
getroot
find
textr
findall
append
infor
	pool_nameZ	pool_info
hostr(
xml_fileZ
treeZ
poolr"
source_foramtr#
mount_pointr$
devicer
lun_listZ
iscsi_targetZ	iscsi_lun
targetZ
host_nodesZ
noder
ip_addrr
lun_info_nodesZ
lun_nodeZ
lun_storage_protocolZ
lun_storage_protocol_eZ
path_nodesZ	path_nodeZ
lun_namer
get_pool_infoB
__main__Z
caslog/storage-adminz
The input parameters are: %sr
z)Get pool %s info failed, maybe not exist.z#The pool %s has no iSCSI target lunr'
The pool %s lun error
sysr)
stringr
Z	xml.etreer
util_cvk_logZ
LUNr	
__name__Z
cas_log_init3r
argvr
exitr2
resultr
warningr4
joinr
<module>
