# File: ocfs2_disks_mounted.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/storage-admin.package/scripts/ocfs2_disks_mounted.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

NAMEzO	 ocfs2_disks_mounted.py Determine whether the device is mounted by other hostsZ
SYNOPSISz
	$0 [ -h ] deviceZ
DESCRIPTIONz
	 -h Help and usagez!	 device Device, such as /dev/sdb)
print
ocfs2_disks_mounted.py
usage
z2debugfs.ocfs2 -R "slotmap" %s 2>>/dev/null | wc -lz There are %d node(s) in slotmap.
popen
readline
close
logging
info
BaseException
error)
device_nameZ
slotNum
slot_get_cmd
file_get
data
efir
isSlotMaped"
]n}	t	|	
z%debugfs.ocfs2 -R "hb" %s 2>>/dev/null
z!start heartbeat information is %sz
end heartbeat information is %s
0000000000000000r	
z%Node %s is heartbeating on device %s.T)
append
splitr
time
sleepr
debug
lenr
exit)
Z	startListZ
endListZ	htChangedZ
element_indexr
hblineZ
startListElementZ
endListElementr
isHeartBeatChanged4
__main__Z
ocfs2z
caslog/storage-adminr	
z%Device(%s) will have a mounted check.zaSome hosts have already mounted on this device(%s), there is no need to format this volume again.
stringr
util_cvk_logr
__name__Z
cas_log_init3r"
argvZ
arcr$
devicer
is_slot_mapedZ
is_device_hbr
<module>
