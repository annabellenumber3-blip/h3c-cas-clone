# File: ocfs2_blackhost_delete.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/storage-admin.package/scripts/ocfs2_blackhost_delete.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

NAMEzJ	 ocfs2_blackhost_delete.py Delet the black host list from norma host listZ
SYNOPSISz0	$0 [ -h ] remote_host black_host_list pool_nameZ
DESCRIPTIONz
	 -h: Helpz!	 remote_host the remot host listz:	 black_host_list the black host list in xml string bufferz"	 pool_name the ocfs2 cluster name)
print
ocfs2_blackhost_delete.py
usage
__main__
z-The remote host list can not be none or empty
z,The black host list can not be none or emptyz/The OCFS2 Cluster name can not be none or empty
/etc/cvk/user_info.conf
permit_user_ssh
rootz.expect /opt/bin/ocfs2_node_del.exp %s %s %s %sT)
shell
string
subprocessr
__name__
argvZ
exitr
Z	pool_nameZ
remote_host
splitZ
black_host_name_listZ
failed_remote_host_list
path
exists
open
	readlines
line
params
strip
userZ
black_host_name
callZ
error_code
append
join
BaseException
<module>
