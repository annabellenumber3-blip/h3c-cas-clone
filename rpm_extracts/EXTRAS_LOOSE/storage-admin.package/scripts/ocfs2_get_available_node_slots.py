# File: ocfs2_get_available_node_slots.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/storage-admin.package/scripts/ocfs2_get_available_node_slots.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

Z e 
Z"e"
Z$e$D
Z%e%j&d
Z'e'd
Z(e)j*e(d
Z+e+d
qJe,e'
Z.e/e.
Z0e0d
d!e'
qBe1e0d
sPe1e0d
d#e1e0d
Z4e4j5Z6e4
Z8e8
:e0d
Z;e;
:e<e
e1e0d
Z=e4
Z>e>
:e<e=
e?e6
ZB[Bn
ZB[B0
ZD[DnJd
ZD[D0
ZB[Bn
ZB[B0
minidom)
ElementTree)
NAMEzF	 ocfs2_get_available_node_slots.py get available node slots of deviceZ
SYNOPSISz
	 $0 -h|storageZ
DESCRIPTIONz
	 -h: Help and usagez"	 storage: ocfs2 storage pool name)
print
!ocfs2_get_available_node_slots.py
usage
__main__
OCFS2_SUCCESSZ
OCFS2_ERR_WRONG_PARAMZ
ocfs2z
caslog/storage-adminz
/etc/libvirt/storage/%s.xmlz
ocfs2 stroage pool xml is %s z1Storage pool %s or configure file does not exist.Z
OCFS2_GET_POOL_PATH_FAILED
sourceZ
device
pathz&Lun has not find path, input is wrong.Z
OCFS2_GET_DEVICE_PATH_FAILEDz
fdisk -l %s 2>>/dev/nullT)
shellz
Can not find the iscsi lun %s .Z
OCFS2_DEV_CAN_NOT_USEz-find mounted nodes is %s, total numbers is %dzNdebugfs.ocfs2 -R "stats" %s 2>/dev/null | grep Slots | awk -F ":" '{print $2}'
the device %s can not use!z
max_node_slots is invalid!z
get max node slots is %d
info
maxSlots
	usedSlots
availableSlotsz
find mounted nodes error!Z
OCFS2_NODE_NO_EXISTEDz6calculate the available slots of device is successful.)G
logging
	traceback
stringZ
xml.domr
Z	xml.etreer
util_common_toolsZ
util_cvk_logZ
ocfs2_mount_checkZ
util_sh_error_code_loaderr	
__name__
retZ
MIN_NODE_SLOTSZ
MAX_NODE_SLOTS
argvZ
exitZ
ocfs2_errorZ
cas_log_init3Z
poolNameZ
xml_file_pathr
exists
error
parseZ
poolXml
findr
findallZ
device_lunsZ
device_pathZ
attribZ
lun_path
subprocessZ
check_output
resultZ
mounted_nodes_getZ
mounted_nodesZ
max_node_slots_cmdZ
util_cmds_outputZ
max_node_slots
intZ
getDOMImplementationZ
createDocumentZ
domZ
documentElement
rootZ
createElementr
appendChildZ
createTextNoder
strZ
unusedSlotsr
toxml
IOError
SystemExitZ
BaseException
format_excr
<module>
