# File: ocfs2_nvmf_list_lun.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/storage-admin.package/scripts/ocfs2_nvmf_list_lun.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

Z$e%d k
rNe&d!d"
j'd#d$
Z(e(j)d%d&d'
e(j)d(d)d*d+d,
+d-e
j,d.d
Z.e*
e.j/Z0e.j1Z2e3e0
e4e5d/
:d0e0
e$e0
:d1e0e2f
e#e0e2
<d3e;
n$e*
<d4e0
e?d5
@eAd6
@eAd7
sourcec
Nz newconnect:%s with %s logged in.F
target
args
new_connect_tgtlist
append
logging
info
	threading
ThreadZ
login_nvme_session
range
start
join
BaseException
error)	
ip_addrZ	need_listZ
already_list
threads
target_info
nloops
ocfs2_nvmf_list_lun.py
do_session_login%
logout_nvme_sessionr	
nvmelist_old
nvmelist_newr
nvme_controllerr
do_session_logoutG
/dev/
/sys/block/%s/size
split
open
read
int)
dev_pathZ
devcontrolZ
file_str
lun_size_strZ
size_val_intr
get_sz_by_dev\
NzJnvme id-ns %s|grep Namespace|awk -F ':' '{print$1}'|awk -F ' ' '{print$4}'T
shell)
subprocess
check_output
decode
strip)
Z	cmd_getns
get_ns_by_devd
}	~	d
}	~	0
z*can not find dev-nqn first time of nqn[%s]r#
z*can not find dev-nqn twice time of nqn[%s]z%step5:Used %d seconds to find euis:%sz!We can not find luns from %s : %sr
is_valid_ipv6
getIpv6FullAddressZ
get_devl_by_nqn_fromdevll
g_dev_llr
warning
time
sleep
debug
lunLock
acquire
g_nvme_lun_info
releaser
	traceback
format_exc)
lun_list
lun_info
loop
ip_address_fullZ
nvme_dev_info_last_listZ
nvme_lun_info_listZ
nvme_dev_last_listr
nvme_get_lun_infok
target list is none)
list
setr?
targetlistr
new_g_nvme_lun_infor
get_luns_after_login
in thread of dev[%s]
%dZ	multipathZ
uuidZ
capacity
pathr"
typez
nvme-of
	namespaceZ	transportZ
subnqnZ
rdmaZ
addressZ
4420)
addrZ
svcidz%step7:set xml inf [%s] [%s],[%s][%s].
z8capacity of uuid %s is zero, filter it, used %d seconds.z
build failed.r
xmlLockr>
ElementTreeZ
SubElement
g_xml_info
lstripZ
get_eui_by_dev
textZ
attribr4
get_nqn_inf_by_devr@
f_devr2
uid_size_intZ
uid_sizeZ
multi_nodeZ	uuid_nodeZ
capacity_nodeZ	path_nodeZ
nvmedev
uidZ
ns_nodeZ
transport_nodeZ
subnqn_nodeZ
nqn_strZ
address_noder
add_lun_to_xml
build_xml_from_luns
|	d	d
|	d	d
|	d	d
|	d	d
/var/lib/iscsi/nodesz
/etc/iscsi/nodesz
Find targets %r, IP %s.Fz
%s/%sz
%s,3260,z
target %s has IP %s.Tz
target %s does not have IP %s.z&ls %s/%s/%s,3260,*/default 2>/dev/nullr,
cat %sz3target %s default file(%s) is empty. will delete itz	rm -rf %sr
Failed to delete %sz
success to delete %szCiscsiadm -m discovery -t st -p %s -o new -o delete 2>/dev/null 1>&2z)Success to rediscovery target %s with %s.z(Failed to rediscovery target %s with %s.z
default file check done.)
osrM
isdir
listdirr	
startswithr
dirname
callr
ip_addressZ
tgtrF
NODE_CONFIG_DIR
target_listr
find_ipZ
ip_listZ
dis_ip
resZ
default_list
fileZ
dir_namer2
return_coder
check_iscsi_default!
dev (%s, %s) is founded.Tz
dev (%s, %s) is not founded.Fr
check_ip_link_nqnr
target_namerF
exist_uuid_flagr
is_nvme_lun_foundedd
NFTz
Need rescan for(%s, %s))
need_rescanr
need_rescan_lun
udevadm settle 1>/dev/null 2>&1Tr,
call udevadm settle return %d)
udevadm_cmd
resultr
rescan_nvme_lun
]*}	|	|
targetlist:%s.z+step1:Already logged in targets %s with %s.z+step1:find live controller nvmex with ip:%sr
Nnvme discover -t rdma -a %s 2>/dev/null|grep subnqn:|awk '{print$2}'|sort|uniqTr,
z#step2:Discovery targets %s with %s.r
KNo target was discoveried with %s, retry once by find_target_by_virtual_ip.z%target %s is not discoveried with %s.z
newloginnqn:%s
new nvme list of ip:%s
 all_devll is empty whole list %s
0step4-1: devp in nvme list of ip except local:%s
"empty nvme devlist except local:%sz!step6:setxml uidlist:%s for ip:%s
>for ip [%s],logout list:[%s],we logout one by one discoverlist
#contrler old [%s],contrler new [%s])
get_live_nqnlist_by_ipr
get_nvme_list_by_ipr
nvmf_get_ns_all
get_devl_in_alldevl_by_ctrlistr8
login_listr
discovery_listr
g_dev_all_list
x_debugrC
find_eui_forxml_from_targetlist
z"step1:find live nqnlist with ip:%sz,step1:find controller nvmelistold with ip:%sr
nvme discover cmd:%s.Tr,
z(step2:Discovery nvme targets %s with %s.r
z"we login session one by one ip %s.z
nvme list-subsysz
getcmd inf :%srl
z,step6:devlist forxml:%s newconnectnqnlist:%srp
find_eui_forxml_from_ip
__main__Z
ocfs2z
caslog/storage-adminz
List luns in xml format.)
description
ip address)
helpz
--target
+zDtarget name list, if not specialed, output all luns under ip_address)
nargsr
input parameters: %sr#
ab+z
go func: from_ip:%s!z)go func:from targetlist ip:%s,tgtlist:%s!z'Find devs from targetlist successfully!z-Find devs from targetlist error, ret_code %d.z
Can't reach to the ip_addr:%sz
<source></source>Z
OCFS2_ISCSI_HOST_UNREACHABLEZ
OCFS2_SUCCESS)
sysrZ
fcntl
argparser.
copyZ
util_cvk_logZ
util_sh_error_code_loaderZ
ocfs2_nvmf_commonZ
ocfs2_nvmf_search_subsystemZ
sa_iscsi_commonrR
ElementrS
LockrQ
__name__Z
cas_log_init3
ArgumentParser
parser
add_argumentr
argv
parse_argsr
tgtlistZ
isAddrReachabler&
NVME_LOCKFILEZ
lockfd
lockf
filenoZ
LOCK_EXr<
close
dump
print
exitZ
ocfs2_errorr
<module>
