# File: get_snapshot_info.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/backup-restore.package/scripts/get_snapshot_info.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

Z	e	d
Please input the info, vm name.
print
exit
get_snapshot_info.py
usage
__main__
ParentZ
external
z1virsh snapshot-list %s --name | xargs 2>/dev/nullT)
shell
 zJvirsh snapshot-info %s %s | grep %s | awk '{print $2}' | xargs 2>/dev/nullZ
Location)
subprocessr
logging
	tracebackZ
util_cvk_logr	
__name__
argvZ
arcZ	info_nameZ
vm_nameZ	snap_nameZ	snap_typeZ
snap_childZ
check_outputZ	snap_list
decode
strip
splitZ
snapZ	snap_infor
BaseExceptionZ
error
format_excr
<module>
