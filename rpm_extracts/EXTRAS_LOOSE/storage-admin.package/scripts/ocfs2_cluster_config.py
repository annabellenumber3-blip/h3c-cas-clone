# File: ocfs2_cluster_config.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/storage-admin.package/scripts/ocfs2_cluster_config.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

l	Z	d
Z(d!d"
Z)d#d$
Z*d%d&
Z+d'd(
Z,d)d*
Z-d+d,
Z.d-d.
Z/d/d0
Z0d1d2
Z1d3d4
Z2d5d6
Z3d]d8d9
Z4d:d;
Z5d<d=
Z6e7d>k
rPd?Z8
zDe9d@dA
j:dBdC
Z;e;j<dDdEdFdGdBdH
e;j<dIdJdGdKdL
=dMe
j>dNd
e@jA
s.dOZBe	jCeBdFdP
Z8e8d
Z8e8d
e@jA
ZGeGd
eHeG
e*eGd
eGdN
Z8e8d
ZJe'e
ZKeKdN
ZLeL
ZIeKd
ZNeOeN
ZJdXeJd
ZReRD
]fZSd	eJd
eSeIv
FdYeT
FdZeT
nLe'e
eYdN
Fd[e
Z][]nBd
Z][]0
Z_[_n
Z_[_0
ElementTree)
/root/.ssh/mhostz
/etc/cvk/cvm_info.confz
/etc/cvm/ocfs2/%s/cluster.confz
/etc/cvk/cluster.confz
/etc/ocfs2/cluster.confz%/sys/kernel/config/cluster/%s/node/%s
/etc/libvirt/storage/z
/etc/libvirt/storage/autostart/z /etc/libvirt/storage/refersToFs/
/etc/default/o2cbz
.bakc
CVM hostname is %sz"get cvm hostname error, reason is:)	
open
CVM_FILE
readline
close
strip
logging
debug
BaseException
error)
cvm_fileZ
first_line
ocfs2_cluster_config.py
get_cvm_hostname=
Line is empty or startswith #
z-filename(%s): line(%s), length is less than 2
hostname
addressz
CVM address is %sz&get CVM name and address successfully.z)get cvm name or address error, reason is:)
CVM_INFO_FILE
lenr
startswithr
splitr
hnamer
name_getZ
addr_getZ
cvm_info_file
	each_line
	info_listr
get_cvm_name_and_addressY
cluster:T
z-filename(%s): line(%s), length is less than 3
namer
cluster name is %sz"get cluster name error, reason is:)
Z	conf_file
c_name
	conf_info
cluster_zoner!
get_cluster_name
z+get cvm hostname failed, maybe not managed.z*get cvm address failed, maybe not managed.z5get ocfs2 cluster name failed, maybe format is wrong.z!remove %s before cpoy it from cvmz*copy the cluster.conf from cvm(%s) to cvk.z The host is cvm, use cp command.z
cp %s %sz
/etc/cvk/user_info.confr
permit_user_sshr
rootz"scp %s@[%s]:%s %s 1>/dev/null 2>&1T
shell
z5get file from cvm failed, try again after %d seconds.z%call cp/scp command failed, reason is)
CVK_CONF_PATH
path
exists
LOCAL_CVM_CONF_PATH
remove
info
CVM_CONF_PATH
	localnamer
	readlinesr 
subprocess
call
randomZ
randint
warning
time
sleepZ
check_callZ
CalledProcessErrorr
	traceback
format_exc)
retZ
cvm_nameZ
cvm_addr
clusterZ	file_path
line
params
user
waitr
get_conf_file_from_cvm
}	|	d
ip_addressZ
ip_port
numberrC
zfo2cb_ctl -C -i -n %s -t node -a number=%s -a ip_address=%s -a ip_port=%s -a cluster=%s >/dev/null 2>&1Tr-
z,ocfs2 add new node(%s) failed, with errno %dr
z#ocfs2 add new node(%s) successfullyr+
	node_listrB
	node_info
	node_nameZ
node_ipZ	node_portZ
node_numberrC
ret_noreturnr
add_node
o2cb_conf_lines is noner
z<filename(/etc/default/o2cb): line(%s), length is less than 2)
o2cb_conf_fileZ
o2cb_conf_linesZ	o2cb_dictrF
o2cb_conf_all_parse
node %s cluster value is noneZ
O2CB_BOOTCLUSTERz3o2cb config file do not have O2CB_BOOTCLUSTER valuer+
node name value is noneZ
geshiyouwentiz"/opt/bin/ocfs2_node_del.sh %s %s 1Tr-
Remove node %s successfully.z8Remove node %s failed with errno=%d, maybe node is busy.r
)	rL
o2cb_conf_dictrD
remove_nodeP
qVn,|
file %s doen not existr
typer
node:
noder%
,filename(%s): line(%s) length is less than 3r
Lkey: type or name is not in the dictionary, maybe configure format is wrong.
BThere are more than two clusters, maybe configure format is wrong.
Aseg_type is not cluster or name, maybe configure format is wrong.
Parse the content of %s OK
appendr
filenameZ
sub_cluster_dictZ
cluster_dictZ
sub_node_dictZ	node_dictZ
conf_list_orgZ	conf_listr(
Z	node_zone
lengthr!
parseZ
first_clusterZ	info_dictZ
seg_typer'
ocfs2_cluster_conf_parse
qVn,|
ocfs2_cvk_cluster_conf_parse
}	|	
z)The actual nodes in ocfs2 cluster are %s.z+The expected nodes in ocfs2 cluster are %s.zELocalhost(%s) is not in the configure file, try to stop o2cb service.z.awk '$3 == "ocfs2"  { print $2 }' /proc/mountsTr-
z<Localhost(%s) has no ocfs2 pools mounted, stop o2cb service.z
service o2cb stopr
z0Stop o2cb service on localhost(%s) successfully.z!rename cluster.conf for analysingz
_%Y%m%d%H%M%Sz*Stop o2cb service on localhost(%s) failed.zALocalhost(%s) has ocfs2 pools mounted, can not stop o2cb service.rK
zAHostname(%s) is same, but others are different, try to remove it.z
cvk dict=%s; cvm dict=%s.z^Configuration of localhost is not correct, but we can not remove it. Please solve it manually.zCHost %s is missing, but it need the number(%s) that localhost used.z>Hostname(%s) is same, but others are different, try to add it.zTConfiguration of %s is not correct, but we can not add it. Please solve it manually.)
keysr
check_outputr
strftime
	localtimer1
renamer0
operator
cvk_filer
cvk_node_listZ
cvm_node_list
excess_list
missing_list
cvk_conf_list
cvm_conf_list
cvk_node_dictZ
cvm_node_dictrD
resultrO
strtimeZ	local_numZ
cvk_node_nameZ
cvm_node_nameZ
cvm_numr
ocfs2_cluster_conf_diffB
z%Nodes %s are excess, will remove themz
remove nodes failedr
There is no node to remove.z#Nodes %s are missing, will add themz
add nodes failedr
There is no node to add.r+
remove_retZ
add_retr
process_diff
t"t#f
.xml
./source/format
ocfs2zLStorage pool %s is ocfs2 format and will be removed, record the information:z
cat %sTr-
O2CB_ENABLEDz
Change O2CB_ENABLED to false.z
O2CB_ENABLED=false
z@Configuration of O2CB_ENABLED is not exist, please have a check.z
/etc/rc6.d/K06o2cbz
/etc/rc6.d/k06o2cbz
/etc/rc2.d/S22o2cbz
/etc/rc2.d/s22o2cbz
/etc/rc0.d/K06o2cbz
/etc/rc0.d/k06o2cbz
/etc/init.d/o2cbz
/bin/systemctl disable o2cbz.systemctl disable o2cb failed, return code=%d.z
remove %s and %s.r+
)'r1
listdir
STORAGE_DEFINE_DIR
endswith
ETrb
find
attribr
STORAGE_AUTOSTART_DIR
STORAGE_REFERSTOFS_DIRr5
O2CB_CONF_FILE
O2CB_CONF_BAK_FILE
fcntlZ
flockZ
LOCK_EXr
writer
LOCK_UN
shutil
copyr
warnr4
xmlFileList
xmlFile
xmlFilePath
pool_storage
	pool_info
format_typeZ
poolstrZ
autostartPathZ
refersToFsPathZ	o2cb_fileZ
o2cb_bak_fileZ
existr!
tmp_retr
del_host_for_offline
/dev/disk/by-id/dm-name-%sz'force cancel multipath, device path: %sr
cancel_multipath)
naa_path_listZ
naaZ
device_pathr
force_cancel_host_all_multipath
z(t	
/etc/libvirt/storageru
Get xml file list error.)
xml_listr
get_xml_list
/etc/libvirt/storage/%sr
Failed to read a xml file %s)
xmlZ
xml_file
linesr
read_xml_file5
findallr^
xml_info
patZ	find_listrF
find_oner
find_key_from_xml_linesB
/dev/CVK(.+?)/
vg_patZ
vg_listr
get_vg_from_xml_fileK
<naa>(.+?)</naa>r
naa_pat
naa_listr
get_naa_from_xml_fileP
lun name='(.+?)'/>r
target_pat
target_listr
get_target_info_from_xml_fileV
Nz*<storage_protocol>(.+?)</storage_protocol>r
storage_protocolr
"get_storage_protocol_from_xml_file\
defaultc
-iscsi-r
-lun-r
z<force cancel iscsi automatic, target name: %s, target ip: %szdiscsiadm --interface %s -m node --targetname %s --portal %s:%s --op update -n node.startup -v manualz$set autumatic type with manual errorzAiscsiadm --interface %s -m node -T %s -p %s:%s -u >/dev/null 2>&1z
Logout tareget error.)	r 
rsplitZ
is_valid_ipv6Z
getIpv6FullAddressr
format_target_ip
util_cmds_outputr
	transport
targetZ
target_name
portZ	target_ipZ
target_ip_fullrD
(logout_target_and_cancel_iscsi_automaticb
vgchange -aln CVK%sz"Change vg CVK%s to inactive error.z
dmsetup remove -f /dev/CVK%s/*)
	vg_deviceZ
vg_oneZ
cmd_linerB
change_vg_inactive{
Get xml file list %s.z
Change vg to inactive.z
Get vg device:%s.z
force cancel all multipathz
Get naa list %s.Z
iscsir
z>Logout all target and change iscsi configureations with manualz
Get target %s.)
clear_pool_multipath_and_target
__main__r+
caslog/storage-adminz,Synchronize ocfs2 cluster configuration file)
descriptionz
--syncT
store_true)
required
action
helpz
--forcezAUsed to force synchronize configuration file when host is booting)
input parameters: %sr
/opt/bin/ocfs2_monitor.shr-
z4Service o2cb is not running, no need to synchronize.z,Try to get ocfs2 configuration file from CVMz:Ocfs2 configuration file does not exist in CVM! Exiting...r
z(get difference with cluster.conf failed!z'process ocfs2_cluster_conf_diff failed.z-process ocfs2_cluster_conf_diff successfully.z#/sys/kernel/config/cluster/%s/node/zLconfigfs nodefile(%s) is not in the configure file, clean configfs nodefile.z
file %s still existzPLocalhost(%s) is not in the configure file, clean ocfs2 pools and configuration.z(Copy cluster.conf from cvm with --force.)
)`r1
sysr>
socketr
argparser:
Z	xml.etreer
util_cvk_logZ
util_sh_error_code_loaderZ
ocfs2_iscsi_lvm_setupZ
util_common_toolsr	
OCFS2_KERNEL_PATHr|
gethostnamer8
__name__rB
cas_log_init3
ArgumentParser
parser
add_argumentr
argv
parse_args
args
forcerD
exitr
Z	diff_listr
cvk_cluster_listro
cvk_cluster_dict
listZ
config_node_dirr{
fileListZ
nodeFileZ
node_file_pathr2
isdir
rmdirr3
SystemExitZ
betr
<module>
