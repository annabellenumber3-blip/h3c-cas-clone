# File: sa_iscsi_common.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/storage-admin.package/scripts/sa_iscsi_common.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

m	Z	
Z$d d!
Z%d"d#
Z&d$d%
Z'd&d'
Z(d(d)
Z)d*d+
Z*d>d-d.
Z+d?d0d1
Z,d@d2d3
Z-d4d5
Z.d6d7
Z/d8d9
Z0dAd:d;
Z1d<d=
ElementTree)
/etc/iscsi/z
iscsid.confz
chapAuth.xmlz
initiatorname.iscsiz
send_targets/
3260c
NFT)
socketZ	inet_ptonZ
AF_INET6
BaseException)
sa_iscsi_common.py
is_valid_ipv6G
ip address error(%s)z
:0000
ipv6 address full:(%s))
strip
split
range
append
logging
error
debug)
ipv6_addr_lenZ
value_wideZ
ip_arrayZ
ip_valid_array
ip_fullZ	valid_numZ
str_lenZ	value_preZ
full_valueZ
zero_start
valueZ
zero_pre_len
zero_num
getIpv6FullAddress\
call doFileCopy %s %sr
shutil
copyr
COPY_FILE_FAILED)
source
destr
doFileCopy
targets/target/portal
addrz
the ip address are: %s)	
read_xml
xml_file
find_nodesr'
list
setr(
tree
portal_nodes
addrlist
nodeZ
addrlist_uniqr
getIPAddrFromXml
qBqtt
targets/target
name
portalr7
z;target named %s does not exist, please check the parameterszDThere is no target on the host, please execute iscsiadm -m discovery)	r8
find_nodes_by_keyvalueZ
find_childnodes_by_tagr'
targetr@
nodesZ
target_nodesr?
getIPAddrFromTarget
listdir
targets_dirr&
OSErrorr(
indexr
getIPAddrFromDir
ping6 -c 3 -W 1 %s 1>>/dev/nullz
ping -c 3 -W 1 %s 1>>/dev/nullr
system)
ip_addr
retr
isAddrReachable
%s,%sz
Remove the dir: %sT)
ignore_errorsr
target_portrJ
infor1
rmtreer
REMOVE_DIR_FAILED)
path
fullpathr
removeDirByAddr
defaultc
rT|	|
iscsiadmz
--interfacez
-mZ	discoveryz
newz
result of dicovery %s is : %sz:Cannot discovery targets from %s, remove the discovery dirz8Cannot reach to the ip_addr:%s, remove the discovery dir
isdigitrY
subprocess
check_outputr(
decoder%
extendr<
	transport
targetsr@
resultsZ
result_listZ
targets_uniqZ
target_dict
lineZ
target_attrrE
ip_listr
getTargets3
NoneZ
CHAPr 
z@Parameter error, neither username_in nor password_in can be Nonez:Parameter error, neither username nor password can be Noner
zJParameter error, username, password, username_in, password_in must be Nonez9Parameter error, the chap method must be "None" or "CHAP")
chapmethod
username
password
username_in
password_in
ctyper
getChapTypep
}	|	
qDq*|
node.session.auth.authmethod =
node.session.auth.username =z
node.session.auth.password =z
node.session.auth.username_in =z
node.session.auth.password_in =z
<iscsi_config>
  <initiator>
chap type of iscsid.conf is %dz,invalid chap type of iscsid.conf, type is %dz"    <auth method='%s' type='%s'/>
z#    <chap login='%s' passwd='%s'/>
z,    <chap_in login_in='%s' passwd_in='%s'/>
  </initiator>
  <targets>
z%    <target name='%s' inherit='yes'>
      <portal addr='%s'/>
    </target>
  </targets>
</iscsi_config>
open
cfg_filer#
startswithr$
closer'
INVAILD_CHAP_METHODrj
writelinesr
	traceback
format_exc
CREATE_XML_FAILED)
methodrm
conf_orgrh
org_chapZ
org_usernameZ
org_passwordZ
org_username_inZ
org_password_inZ
xml_strre
keyZ
ip_addrlistrO
fileZ
efir
createNewXml
InitiatorName=rt
initiator_filer#
IOErrorr(
iqn_name
contentsrh
getInitiatorName
	ipaddressZ
ip_addressZ
exploded
lowerr(
convert_ipv6_to_full_format
ip1_addrZ
ip2_addrrP
ip1_addr_fullZ
ip2_addr_fullr
isSameIp
qrqRW
}	~	n
}	~	0
Nzmiscsiadm --interface %s -m discovery -t st -p %s:%s -o nonpersistent 2>/dev/null | awk -F '[][]' '{print $2}'T)
shellr[
format_target_ipr`
portZ
discovery_ipZ
ip_addr_fullrf
getAbbreviatedDiscoveryIpv6?
[%s])
sysrH
Z	xml.etreer
util_xml_commonZ
SA_ISCSI_OFFSETZ
INVALID_OPERATION_TYPEZ
INVALID_INHERIT_MODErz
DISCOVERY_TARGET_FAILEDZ
ADD_TARGET_FAILEDZ
ADDR_UNREACHABLEZ
ADDR_NO_TARGETSrV
REMOVE_TARGET_FAILEDr~
SET_XML_CHAP_FAILEDZ
SET_CONF_CHAP_FAILEDZ
TARGET_NOT_EXISTZ
GET_AUTH_LIST_FAILEDZ
SET_TARGET_AUTH_FAILEDZ
SHELL_COMMAND_FAILEDZ
iscsi_pathrw
<module>
