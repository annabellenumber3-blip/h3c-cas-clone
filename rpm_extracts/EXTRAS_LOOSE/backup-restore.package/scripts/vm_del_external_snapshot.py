# File: vm_del_external_snapshot.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/backup-restore.package/scripts/vm_del_external_snapshot.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

Please input the vm_name.
print
exit
vm_del_external_snapshot.py
usage
NzIvirsh snapshot-list %s --descendants --from %s --name | xargs 2>/dev/nullT
shell
subprocess
check_output
decode
strip
snap_tree_list
split
get_snapshot_tree)
vm_nameZ	snap_nameZ	snap_tree
snapr
__main__
caslog/backup-restore
z1virsh snapshot-list %s --name | xargs 2>/dev/nullTr
z?virsh snapshot-info %s %s | grep 'Location:' | awk '{print $2}'Z
internalz2virsh snapshot-delete %s %s --metadata --delextmemz!Delete the metadata of %s failed.)
loggingZ
util_cvk_log
	tracebackr
__name__Z
cas_log_init3
argvZ
arcr
Z	snap_listr
fromkeys
keysZ	snap_type
call
errorr
BaseExceptionZ
format_excr
<module>
