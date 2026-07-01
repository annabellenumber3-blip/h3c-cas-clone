# File: find_backing_list.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/backup-restore.package/scripts/find_backing_list.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

e"e!
Z![!n
Z![!0
ElementTreec
Nz&Please input the vm name, device name.
print
exit
find_backing_list.py
usage
rFq8t
NzIvirsh snapshot-list %s --descendants --from %s --name | xargs 2>/dev/nullT
shell
subprocess
check_output
decode
strip
split
snap_tree_list
get_snapshot_tree
list
set)
vm_nameZ	snap_nameZ	snap_tree
snapr
Nz1virsh snapshot-list %s --name | xargs 2>/dev/nullTr
z(virsh snapshot-dumpxml %s %s 2>/dev/nullz
./domain/devices/diskZ
deviceZ
diskz
./targetz
./source
file)
fromkeys
keys
fromstring
findallZ
attrib
find
snap_image_list
append)	r
dev_nameZ	snap_listr
snap_dumpxmlZ
xmlStrZ
node
targetZ
source_infor
get_all_base_image0
Nz4virsh domblklist %s | grep -w %s | awk '{print $NF}'Tr
Z	top_imager
get_top_imageL
qbqZt
Nz.qemu-img info %s --backing-chain --output=jsonTr
Get disk %s info error.
filename
base_image)
path
existsr
	Exception
json
loadsr"
image_listr
locals
remove)
image_nameZ
commandZ	disk_infoZ
jdisk_infoZ	file_listZ
jdiskZ
jkeyr)
get_all_imageS
__main__
caslog/backup-restore
z)get backing file list failed, errinfo: %s)#r
loggingr.
util_cvk_log
	tracebackZ	xml.etreer
__name__Z
cas_log_init3
argvZ
arcr
join
BaseExceptionZ
error
format_excr
strr
<module>
