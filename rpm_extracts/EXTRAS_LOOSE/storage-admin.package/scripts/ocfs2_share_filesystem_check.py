# File: ocfs2_share_filesystem_check.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/storage-admin.package/scripts/ocfs2_share_filesystem_check.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

hostnamez
o2cb_ctl -Iot nodeT
shellz
Get o2cb node lists error.z
%s:.+r
z*Cannot find local host in o2cb node lists.)
subprocess
check_output
decode
strip
logging
error
findall
split
BaseException
	traceback
format_exc)
local_host_nameZ
node_num_cmd
retZ
hostname_patZ	host_info
node_num
ocfs2_share_filesystem_check.py
get_node_num
Get node number error.
Get node number %sz
smallest_node %sr
z!This node is not the smallest onez!Mounted nodes number list is None)	r
debugZ
mounted_nodes_get
sortedr
devr
Z	node_listZ
sort_node_listr
check_node_id6
grep -w ocfs2 /proc/mountsTr
Get dm name %s, pool name %s
lenr
appendr
pool_listsZ
pools_info_cmdr
mount_listsZ
one_listZ
dm_name
	pool_namer
get_mounted_ocfs2_poolsU
__main__
ocfs2z
caslog/storage-adminz$Cannot get mounted ocfs2 pools info.r!
/opt/bin/dev_not_bad_test %sTr
z1Pool %s with device %s is bad, give the warnning.z
Device check return code %s.)
stringr
ocfs2_mount_checkr
__name__r
cas_log_init3Z
pools_infor
infor
dmr$
statusZ
cmd_line
callr
print
SystemExitZ
exitr
<module>
