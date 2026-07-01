# File: sa_iscsi_discovery.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/storage-admin.package/scripts/sa_iscsi_discovery.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

Z e d
Z n:e
ElementTree)
NAMEz
	 sa_iscsi_discovery.pyZ
DESCRIPTIONz
	 set iscsi chapZ
SYNOPSISz7	 <operation type>: 0---discovery; 1---add; 2---remove;zF	 [ip address], when operation type is not 0, the parameter must exist)
print
sa_iscsi_discovery.py
usage
.bakr
copy %s failed!
targets
targets/target
namez
refresh target %s
inherit
target
portal
add target %s
addr)
doFileCopy
xml_file
logging
errorZ
COPY_FILE_FAILED
read_xml
find
clear
find_nodesZ
getTargets
find_nodes_by_keyvalue
debug
attrib
create_node
append
list
	write_xml
BaseExceptionZ
DISCOVERY_TARGET_FAILED)
treeZ
tree_bakr	
nodesZ
targets_dict
target_nodesr
new_target
children
childZ
ip_addrlist
ip_addr
new_portal
efir
discoveryAllTargets1
defaultc
iscsiadmz
--interfacez
-mZ	discoveryz
newz
result of dicovery %s is : %sz
Can't discovery targets from %s
z7Can't reach to the ip_addr:%s, remove the discovery dirr	
isAddrReachable
target_port
subprocessZ
check_outputr
info
removeDirByAddrZ
ADDR_NO_TARGETS
strip
splitZ
ADDR_UNREACHABLEr
find_childnodes_by_tag
getr
ADD_TARGET_FAILED)
	transportr	
resultsr&
parent
lineZ
target_attrr
isfindZ
portal_nodes
noder.
addTargetsByAddrm
}	|	j
](}	|	
z!remove dir failed! ip address: %sr	
remove target %sr
REMOVE_DIR_FAILEDr
find_nodes_by_child_keyvaluer:
remover
REMOVE_TARGET_FAILED)
countr+
removeTargetsByAddr
__main__Z
caslog/storage-adminz
The input parameters are: %s
z"the operation type must be [0 1 2]
z"create %s failed, error code is %dz
discovery z
add or discovery targets by %sz
remove targets by %s)
fcntl
stringr;
Z	xml.etreer
util_cvk_logZ
util_xml_commonZ
sa_iscsi_commonr
__name__Z
cas_log_init3r
argvr
argc
exit
intZ
op_typer
INVALID_OPERATION_TYPErA
path
existsr
createNewXmlr%
<module>
