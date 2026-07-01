# File: ocfs2_iscsi_add_new_path_to_xml.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/storage-admin.package/scripts/ocfs2_iscsi_add_new_path_to_xml.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

Z!d d!
Z"d"d#
Z#d$d%
d'd(
Z%d[d)d*
Z&e'd+k
r.e(d,d-
j)d.d/
Z*e*j+d0d1d2d3
e*j+d4d5d1d6d3
e*j+d7d1d8d3
Z-e-j.Z/e-j0Z1e-j2Z2e
3d9e/e1f
Z5e&e1
Z6e/D
Z:e.d
Z;d<e.
Z<e"e<e6
Z=Z:e>e=
?d=e1e.f
e=Z7e
e<e.
Z@e@
ZBeB
ZDe@
e@d@
ZGdAZHeGD
ZIe7D
]zZ0d:d
d:dB
ZJeKe0
e%e6e0
ZLeLd
MdCe0
eJdD<
dEeJdF<
e0eJdG<
qVe eIe6e0
ZOeOd
MdHe.e0f
e$e0
ZPePjQZRe
eJdD<
dJeRe0f
eJdF<
e0eJdG<
dKe0eO
eIeS
eDdLk
dMe0
eFeT
dPeV
eFeW
MdQe0
eJdD<
dReJdF<
e0eJdG<
qVdSZH
qLe>e9
e@e<
e!e<e.
ZLeLd
MdTe.
Z0e$e0
e;dU<
dVe;dW<
sve:
e;dU<
dXe;dW<
e5Z5n
e;dU<
dYe;dW<
Z5e8e;dZ<
e>e4
e>e4
e>e/
ZY[Yn
ZY[Y0
r$e]e
etree)
remove_blank_text)
ETZ	XMLParser
parse)
in_path
parser
tree
"ocfs2_iscsi_add_new_path_to_xml.py
read_xml'
pretty_printZ
xml_declaration)
write)
out_pathr
	write_xml,
findall)
pathr
find_nodes/
name
hostZ
3260)
port)
ElementZ
SubElement)
lun_name
elementr
create_node2
create_host_node8
devicer
create_device_node<
append)
noder
add_child_node@
/tmp/%s_bak.xml)
shutil
copy
	pool_nameZ
backup_pathr
back_up_xmlC
%s does not exist.)
existsr(
remove
logging
errorr*
fall_back_xmlG
]6}	d
naaz
There must have a legal NAA.r
zals /dev/disk/by-path | grep -i ^ip-'%s\|%s' | grep 3260-iscsi | grep -v part[0-9]*$ | awk {print}T
shell
zGlun names is null, lun_names%s. retry after sleep 2 seconds, count: %s z5/lib/udev/scsi_id --whitelist -u /dev/disk/by-path/%sz6retry to get lun name after sleep 2 seconds, count: %s)
is_valid_ipv6
convert_ipv6_to_full_format
findr1
text
subprocess
check_output
decode
strip
split
time
sleep
warning)
lun_noder
ip_address_fullZ
lun_name_find
count
naa_noder4
cmdZ	lun_namesr
dev_naar
get_lun_nameO
virsh pool-define %sT)
stdoutr
z3define pool %s failed with errno %d, copy the file.
callZ
DEVNULLr1
ret_noreturnr
define_storage_poolu
]6}	|	|
qTqT|
.//source/lun_info/path/hostr
-the new path with %s has already exist in %s.)	r
attribr8
keysr1
ip_dictZ
host_namesZ
new_iplist
exist_iplistr
hostsr
temp_ipr
is_new_path_info_exist~
qft	
target
argsz!New targets %s with %s logged in.rK
login_tgtlistr%
	threading
ThreadZ
login_session
rangerA
start
joinr1
debug
BaseExceptionr2
ip_addrZ	need_listZ
already_list
threadsZ
target_info
nloops
efir
do_login
iscsi logout  by ip:%s failed.)
do_session_logoutrU
ip_address
retr
	do_logout
defaultc
zeiscsiadm -m session -R 2>/dev/null | grep -i \ '%s\|%s', | awk '{print $6}' | awk -F ',' '{print $1}'Tr5
z%Already logged in targets %s with %s.rK
zeiscsiadm -m discovery -t st -p %s -o new -o delete 2>/dev/null | grep -i '%s\|%s' | awk '{print $NF}'z
Discovery targets %s with %s.r
zKNo target was discoveried with %s, retry once by find_target_by_virtual_ip.zCThere are some sessions login with %s, we login session one by one.z,do session login targets with %s. result: %sz8There is no session login with %s, we login all session.z)iscsiadm -m node -p %s -l >/dev/null 2>&1
z/Session login all targets with %s successfully.zciscsiadm --interface default -m node -p %s --op update -n node.startup -v automatic >/dev/null 2>&1z+Set targets with %s automatic successfully.zASession login all targets with %s failed, retry once by do_login.z7Session login all targets with %s failed with errno %d.)
	traceback
format_excZ
check_iscsi_defaultrA
find_target_by_virtual_ipZ
do_session_loginZ
set_decrypt_chap_argsrL
set_chap_argsZ
check_callZ
need_rescan_lunZ
rescan_lun)	rc
	chap_args
	transportrE
login_listra
discovery_listr
do_login_iscsi_session_by_ip
getAbbreviatedDiscoveryIpv6)
ip_listrl
getFullAbbrIpDict
__main__Z
ocfs2z
caslog/storage-adminz:Mod path information in pool xml for add multipath online.)
description
pool
+z.Need to add multi-path storage pool collection)
nargs
helpz
--ipz#the ip list of the path to be addedz
--chap-argsz$CHAP args include username, passwordz*input parameters: pool_list:%s, ip_list:%srg
errorPoolName
errorPoolCode
errorPoolMsg
errorIpListz
/etc/libvirt/storage/%s.xmlrN
typez	.//sourcez
.//source/lun_infoF)
errorIp
	errorCode
errorMsgz
iscsi login by ip:%s failed.r{
iscsi login failedr|
z)In %s pool lun name cannot be find by %s.r4
z*can not find lun name by NAA %s from ip %sr
iscsir
-iscsi-z
-lun-r#
Can't reach to the ip_addr:%sz
ip is not reachableTz
define pool %s failed.rv
define pool failedrw
add new ip failedz
add new ip partial successrx
)_r.
argparser1
jsonZ
lxmlr
util_cvk_logZ
ocfs2_iscsi_list_lunZ
util_sh_error_code_loaderZ
ocfs2_iscsi_commonZ
sa_iscsi_common
SUCCESSZ
FAILEDZ
PARTIAL_SUCCESSZ
DEFINE_POOL_XML_FAILEDZ
ISCSI_LOGIN_FAILEDZ
GET_LUN_NAME_FAILEDZ
IP_UNREACHABLErU
__name__Z
cas_log_init3
ArgumentParserr
add_argument
parse_argsrT
Z	pool_listr
infoZ
failed_listZ
ret_coderP
new_ip_listZ
failed_ip_listZ
success_ip_listrQ
failed_dictZ
xml_pathZ
filter_ip_listrA
getroot
root
getZ	pool_typer:
source_nodeZ
lun_info_nodesZ
host_add_flagZ
lun_info_nodeZ
failed_ip_dictZ
isAddrReachablerd
Z	path_nodeZ	host_noder@
device_noder\
exit
print
dumpsr
<module>
