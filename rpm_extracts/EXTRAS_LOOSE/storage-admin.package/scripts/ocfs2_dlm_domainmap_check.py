# File: ocfs2_dlm_domainmap_check.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/storage-admin.package/scripts/ocfs2_dlm_domainmap_check.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

Z"e"d
d!e"
Z#e#d
d#d$
d%d$
e%e#e
d&e(e'
e)e'
e'e"
Nz#/sys/kernel/debug/o2hb/%s/livenodes
open
	readlines
split
close
BaseException
logging
error)
uuid
lines
live_node_map
ocfs2_dlm_domainmap_check.py
get_local_live_node_map
cat /etc/hostnameT
shellz
host name : %s)
subprocess
check_outputr	
info
CalledProcessErrorr
hostnamer
get_host_name'
)	Nz
o2cb_ctl -I -t node -o -n %sTr
Local IP is %s.)	r
debugr
message)
Z	host_nameZ
cluster_conf
local_ipr
get_local_ip_in_cluster0
/etc/ocfs2/cluster.confr
z&Can't open cluster configuration file!z2Can't get local ip, abort this checking procedure!
number
ip_address)
append)	r
cluster_ip_listZ
cluster_ip_mapr!
node_numberZ
one_lineZ
eler
get_peer_node_infoI
Nz debugfs.ocfs2 -R slotmap /dev/%sTr
zKexception message(%s) debugfs.ocfs2 tool open device failed device name(%s))	r
ranger%
dev_name
output
slot_mapZ
slot_numr
get_local_slot_map
}	|	d
Nz!Checking node(%s) ip(%s) uuid(%s)z
ping6 -c 3 -W 1 %s > /dev/nullTr
ping -c 3 -W 1 %s > /dev/nullzGCan't ping to node(%s), won't check peer o2hb, treating it as inactive.z
/etc/cvk/user_info.conf
permit_user_sshr
rootzGtimeout 60 ssh -o ConnectTimeout=30 %s@%s "sudo ps -ef | grep o2hb-%s "
Can't ssh to peer node(%s) to get its o2hb information,ignore this failure treating o2hb as inactive and continue to check next noder
FzPO2hb daemon is active on node %s. Storage path may encounter intermittent fault!z"O2hb daemon is inactive on node %szMssh to node(%s) failed or timeout with errno(%d), return failed and try againzAException message(%s).Can't ssh to peer node node%s@%s  uuid(%s) )
is_valid_ipv6r
callr
g_thread_dict
path
existsr
stripr
warning
countr
returncoder
node
	remote_ipr
ping_ret
line
params
user
cmdr)
errnor
get_one_peer_o2hb
NTz.checking remote o2hb, uuid(%s) node(%s) ip(%s))
target
args)
	threading
Threadr@
start
joinr1
remote_ip_map
checking_nodesr
threads
resultZ
thread_numr8
loop
keyr
check_remote_o2hb
nodes in cluster : %sz:node(%s) in the slot map but not in cluster configuration!)
strr&
nodes_in_clusterrG
#compare_slot_map_with_live_node_map	
__main__r
ocfs2z
caslog/storage-adminz
device name:%s
Get peer node info failed!
/dev/%s
z#Get local uuid failed, exit with -1z
local uuid is %sz
Get local live node map failed!z
get live node map as %s
get local slot map as %sz
checking o2hb on nodes: %sz
checked result: pass checkingz
Intermittent IO fault was detected or livenodes was checked inconsistencie while mounting dev(%s:%s), so abandon current mount, %d times fails.)+r2
sysr	
util_cvk_logrC
ocfs2_mount_check
timeZ
sa_iscsi_commonr1
__name__
argvZ
local_dev_nameZ
cas_log_init3r
CHK_INTERVALZ
CHK_TIMES_MAXZ
chk_timeZ
chk_resZ
ip_listZ
ip_mapr
exitZ
get_uuid
replace
upperZ
g_local_uuidZ
g_live_node_maprF
local_slot_map
keysZ
checking_o2hb_nodesrM
sleepr
<module>
