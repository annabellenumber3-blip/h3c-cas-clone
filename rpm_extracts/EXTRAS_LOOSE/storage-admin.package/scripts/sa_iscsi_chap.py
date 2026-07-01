# File: sa_iscsi_chap.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/storage-admin.package/scripts/sa_iscsi_chap.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

d/d	d
e e!e"
d+e(
$d,e(
e-e#
Z.e.d
$d-e,e.f
e e!e"e#
e e!e"e#
ElementTree)
NAMEz
	 sa_iscsi_chap.pyZ
DESCRIPTIONz
	 set iscsi chapZ
SYNOPSISz#	 <type>: 0---initiator; 1---targetz)	 <name>: target name, useful when type=1zY	 <inherit>: whether inherit from initiator, must be one of [yes, no], useful when type=1z;	 <authmethod>: method of chap, must be one of [None, CHAP]z)	 <username>: useful when authmethod=CHAPzF	 <password>: useful when authmethod=CHAP, must in pairs with usernamez,	 <username_in>: useful when authmethod=CHAPzL	 <password_in>: useful when authmethod=CHAP, must in pairs with username_in)
print
sa_iscsi_chap.py
usage!
}	|	d
auth
None
method
typer	
chap
chap_in
CHAP)
login
passwd
find_childnode_by_tagZ
create_nodeZ
add_child_node
change_node_properties
del_nodes_by_tag
BaseException
logging
errorZ
SET_XML_CHAP_FAILED)
parent_node
	auth_type
username
password
username_in
password_inZ	auth_nodeZ	chap_noder
chap_in_noder
efir
setChapAuth_xml@
call setInitiatorChapAuth_xml
	initiatorr
debug
read_xml
xml_file
find_nodesr!
	write_xml)
ctyper
tree
initiator_node
retr
setInitiatorChapAuth_xmlv
]\}	|	j
q<|	j
rz|	
q<|	j
r<|	
''r"
list
getr
chaplistr)
children
childr 
getInitiatorChapAuth_xml
call setInitiatorChapAuth_confr
.bak
node.session.auth.r
node.session.auth.authmethod =z$node.session.auth.authmethod = CHAP
node.session.auth.username =z node.session.auth.username = %s
node.session.auth.password =z node.session.auth.password = %s
node.session.auth.username_in =z
node.session.auth.password_in =z#node.session.auth.username_in = %s
z#node.session.auth.password_in = %s
SET_CONF_CHAP_FAILED
openZ
cfg_file
fcntlZ
flockZ
LOCK_EX
strip
startswith
write
closeZ
LOCK_UNZ
doFileCopyr
findauthZ
findusernameZ
findpasswordZ
findusername_inZ
findpassword_inr+
conf_orgZ
conf_bak
liner 
setInitiatorChapAuth_conf
defaultc
call setInitiatorChapAuthr
z$exec setInitiatorChapAuth_xml failedz%exec setInitiatorChapAuth_conf failedz0iscsiadm --interface %s -m discovery -t st -p %sT
shell
targets/target
inherit
name
portalZ
addr)
getIPAddrFromXml
subprocess
check_callr
SHELL_COMMAND_FAILEDr$
setTargetChapAuth_conf)
	transportr+
addrlistrG
cmdr 
target_nodes
node
targetr2
setInitiatorChapAuth
|	d	
call setTargetChapAuth_xmlrC
zEThere is no target on the host, plesase execute iscsiadm -m discoveryrF
z;the target named %s not exist, plesase check the parametersrD
yesr
lenr
TARGET_NOT_EXISTZ
find_nodes_by_keyvaluer
nodesrO
setTargetChapAuth_xmlK
z]iscsiadm --interface %s -m node -T %s -p %s --op update -n node.session.auth.authmethod -v %sTrA
z[iscsiadm --interface %s -m node -T %s -p %s --op update -n node.session.auth.username -v %sz[iscsiadm --interface %s -m node -T %s -p %s --op update -n node.session.auth.password -v %sz^iscsiadm --interface %s -m node -T %s -p %s --op update -n node.session.auth.username_in -v %sz^iscsiadm --interface %s -m node -T %s -p %s --op update -n node.session.auth.password_in -v %sr
qPn,|
call setTargetChapAuthr
z"exec setTargetChapAuth_xml failed.rS
get auth list failed.)
getIPAddrFromTargetr4
IndexErrorZ
GET_AUTH_LIST_FAILEDr
SET_TARGET_AUTH_FAILED)
authlistrG
setTargetChapAuth
__main__Z
caslog/storage-adminz
The input parameters are: %s
1z$operation type must be one of [0, 1]rS
z inherit must be one of [yes, no]z
chap type of setting is %dz.invalid chap parameters, type of setting is %dz"create %s failed, error code is %d)
osr9
stringrH
Z	xml.etreer
util_cvk_logZ
util_xml_commonZ
sa_iscsi_commonr
__name__Z
cas_log_init3r
argvrT
exitZ
optypeZ
target_namerD
INVALID_OPERATION_TYPEZ
INVALID_INHERIT_MODEZ
getChapTypeZ	chap_typeZ
INVAILD_CHAP_METHOD
path
existsr%
createNewXmlr+
<module>
