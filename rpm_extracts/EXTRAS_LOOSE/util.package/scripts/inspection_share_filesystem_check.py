# File: inspection_share_filesystem_check.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/util.package/scripts/inspection_share_filesystem_check.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

CheckFileSystemc
inspection_storZ
caslogz
UIS storage detect.T)
description
add_helpz
--idFzVThe storage detect item. It can be all or id num, like 1000 or 1000,1001,1003 and all.)
required
default
helpz
--levelZ
0x7z>The storage message warning. info 0x1, warning 0x2, fault 0x4.
OCFS2_ERR_WRONG_PARAM)
cas_log_init3Z
cas_log_init
argparse
ArgumentParser
add_argument
parse_args
id_arg
level
level_list
BaseException
logging
error
exit
ocfs2_error
socketZ
gethostname
	host_name
get_pool_info
configparserZ
ConfigParser
conf
get_conf
check_para
check_multipath
check_hb_delay
check_deadlock
check_disk_cache_switch
	func_dict)
self
parser
argsZ
$inspection_share_filesystem_check.py
__init__
CheckFileSystem.__init__c
r8q*t
q*q*|
id %s is not in our list.z
Parameters errorr
strip
splitr
debugr
id_listr
do_filesystem_check2
z#CheckFileSystem.do_filesystem_checkc
)	Nz
/etc/cvk/inspection_uis.confZ
filesystemZ
heartbeat_dead_thresholdZ
network_idle_timeZ
network_keepaliveZ
network_reconnect
fence_methodZ
heartbeat_delay_time)
readZ
getint
hb_deadtime
	idle_time
keepalive_time
reconnect_time
getr;
hb_delay_timer
CheckFileSystem.get_confc
SubElement)
upperZ	node_namer.
get_element_nodeW
z CheckFileSystem.get_element_nodec
test)
node
varr.
set_element_textZ
z CheckFileSystem.set_element_textc
Nz0mount -t ocfs2 | awk '{printf "%s %s\n", $1,$3}'T
shell
universal_newlines
subprocess
check_outputr4
	pool_infor
pool_cmd
retr8
CheckFileSystem.get_pool_infoc
)	NZ	diagnosisr
component-typez
component-namez
target-namez
result-codez
health-level
info)
ElementrF
textr 
dump)
_component_type
_target_name
	_res_code
_level
_info_textZ
diagr
component_typeZ
component_nameZ
target_name
res_coder
build_xml_bodyg
CheckFileSystem.build_xml_bodyc
Z	level_argr.
get_xml_body{
CheckFileSystem.get_xml_bodyc
okr3
local node has no pool.zBservice o2cb status | egrep 'dead|idle|keepalive|reconnect|Method'TrJ
para display less item.
 z%hb dead time is not correct. It is %dz
OCFS2_HB_DEAD_PARAM_ERRORz*network idle time is not correct. It is %dZ
OCFS2_NETWORK_IDLE_PARAM_ERRORz*network keepalive is not correct. It is %dZ#OCFS2_NETWORK_KEEPALIVE_PARAM_ERRORz/network reconnect time is not correct. It is %dZ#OCFS2_NETWORK_RECONNECT_PARAM_ERRORz%fence method is not correct. It is %s
OCFS2_FENCE_METHOD_PARAM_ERRORr
share filesystem configuration)
appendr
cur_listZ
enmu_hbZ	enmu_idleZ
enmu_keepaliveZ
enmu_reconnectZ
enmu_methodZ
item_lenr\
para_cmdrQ
para
item
resr8
CheckFileSystem.check_parac
d	d	d
}	|	
z active ((ready)|(ghost)) runningrf
multipath -ll %sTrJ
z!pool %s multipath is not created.rg
OCFS2_MULTIPATH_NOT_CREATEz
pool %s multipath is unusual.Z
OCFS2_MULTIPATH_NOT_RUNNINGr
pool multipath status)
compiler5
findallr`
link_prR
	pool_item
devZ	multi_cmdrQ
multi_infoZ	link_info
lineZ
line_matchr8
CheckFileSystem.check_multipathc
rDq`|
qVq`|
/var/logZ
syslogz
do disk heartbeat used i
.gzz=zgrep -a '%s' %s | awk -F'):' '{print $2}' | awk '{print $6}'T)
stdoutrL
z=grep -rn '%s' %s | awk -F'):' '{print $2}' | awk '{print $6}'
OCFS2_HB_DELAYrb
ocfs2 has hb delayr
z share filesystem heartbeat delay)
timerP
listdir
path
join
getmtime
endswithrN
Popen
PIPEZ
communicater4
Z	delay_cnt
base_dirZ
file_key_wordZ
log_key_wordZ	cur_stampZ
week_stampZ
start_stampr\
Z	file_list
filerw
file_mtimeZ
zip_search_cmdrQ
errZ	msec_listZ
msecZ
grep_search_cmdr8
CheckFileSystem.check_hb_delayc
}	|	
z%df -h | grep -w %s | awk '{print $5}'TrJ
OCFS2_AVAILABLE_SPACE_IS_LOWrb
share filesystem capacity)
poolZ
cap_cmdrQ
Z	cappacityZ
cap_numr8
check_capacity5
CheckFileSystem.check_capacityc
}	~	n
}	~	0
z!debugfs.ocfs2 -R 'fs_locks -B' %sTrJ
OCFS2_HAS_DEAD_LOCKr^
filesystem deadlock)
dead_lock_cmdrQ
CheckFileSystem.check_deadlockc
}	|	d
z"dmidecode | grep -i 'product name'TrJ
:z8mount | grep -w \/ | awk 'NR==1{print $1}' | tr -d '0-9'r3
There is no system disk found.z
hdparm -I %s 2> /dev/nullz$ATA device, with non-removable mediaz
Solid State Devicez
%s is not dom disk
hdparm -W %s 2> /dev/nullz
1 (on)
%s open the cache.rg
STORAGE_DISK_CACHE_NOT_CLOSEr
storage disk cache switch)	rN
ata_flagZ
solid_flagr\
product_cmdrQ
product_infoZ
product_nameZ
p_nameZ
disk_list_cmdZ	disk_infoZ
disk_cmdZ
disk_statusrj
Z	cache_cmdZ
hdparm_statusr8
z'CheckFileSystem.check_disk_cache_switchN)
__name__
__module__
__qualname__r0
__main__)
xml.etree.ElementTreeZ
etreeZ
ElementTreerD
util_cvk_logZ
util_sh_error_code_loaderr
<module>
