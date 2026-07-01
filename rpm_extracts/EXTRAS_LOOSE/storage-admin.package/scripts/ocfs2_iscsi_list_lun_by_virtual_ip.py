# File: ocfs2_iscsi_list_lun_by_virtual_ip.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/storage-admin.package/scripts/ocfs2_iscsi_list_lun_by_virtual_ip.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

default
3260c
)	NzGiscsiadm --interface %s -m node -T %s -p %s:%s --op new >/dev/null 2>&1T
shellz5Add record target %s with virtual_ip %s successfully.zAiscsiadm --interface %s -m node -T %s -p %s:%s -l >/dev/null 2>&1z1Log in target %s with virtual_ip %s successfully.
zMLog in target %s with virtual_ip %s successfully, the session already exists.)
format_target_ip
subprocessZ
check_call
logging
warning
BaseException
returncode
cmd)
target
virtual_ip
	transport
portr
Z	cmd_loginZ
%ocfs2_iscsi_list_lun_by_virtual_ip.py
login_session_by_virtual_ip
sft	
Nzdiscsiadm --interface %s -m discovery -t st -p %s:%s -o new -o delete 2>/dev/null | awk '{print $NF}'Tr
z"No target find with virtual_ip %s.z(Discovery targets %s with virtual_ip %s.)
check_output
list
decode
strip
split
lenr
retZ
discovery_listr
find_target_by_virtual_ip%
timeZ
fcntl
argparser	
sa_iscsi_commonr
<module>
