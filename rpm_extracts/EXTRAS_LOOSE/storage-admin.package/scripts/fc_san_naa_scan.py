# File: fc_san_naa_scan.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/storage-admin.package/scripts/fc_san_naa_scan.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

Z e!j"e d
Z)e)e(
r4e(e)k
e(e)f
],Z+d%e+
Z,e!j"e,d
d&e+
d'Z-e!j"e-d
Z/[/n
Z/[/0
NAMEz<	 fc_san_naa_scan.py Rescan fc device and reconfig multipathZ
SYNOPSISz"	$0 [ -h ] 0|1 0|1 Naa1 [Naa2 ...]Z
DESCRIPTIONz
	 -h: Helpz:	 0: Resacn spacified fc devices; 1: Resacn all fc devicesz2	 0: Not reconfig multipath; 1: Reconfig multipathz$	 NAA: The fc devices naa value list)
print
fc_san_naa_scan.py
usage
/sys/block/%s/size
open
readline
close
strip
BaseException
logging
error)
device
fdZ	size_file
lineZ
capacity
get_disk_size1
__main__
fc_sanz
caslog/storage-adminz
The parameter is %rz*the first parameter is %d, it must be 0/1!
z+the second parameter is %d, it must be 0/1!zels -al /dev/disk/by-path/pci*-fc-* | awk '{print $NF}' | awk -F "/" '{print $NF}' | grep [[:alpha:]]$z0Get the fc device failed, or not found fc devicezHlsblk | grep -B 1 %s | grep -v %s | awk '{print $1}' | grep -o '[a-z]\+'z get fc_dev failed, disk_naa = %sz(/lib/udev/scsi_id --whitelist -u /dev/%sz
Get NAA /dev/%s failedz
%s not in %rz4fdisk -l /dev/%s 2>>/dev/null | grep "Disk\ /dev/%s"z
Rescan device %sz$echo 1 > /sys/block/%s/device/rescanT)
shellz
Failed to rescan %sz
/dev/disk/by-id/dm-name-%s
z0Naa %s change size from %d sectors to %d sectorsz!Size of naa %s is %d, not changedz %s is a fake device, skip rescanz
multipathd -k'resize map %s'z
Failed to resize %sz
multipathd -k'reconfig'z
Failed to reconfig multipathz,call resize or reconfig command successfully)0
string
timeZ
util_cvk_logZ
util_common_toolsr
__name__Z
mp_list
argvZ
exitZ
cas_log_init3r
debugr
all_fc_devicesr
reconfig_multipathZ
naa_listZ
cmdLineZ
util_cmds_outputZ
fc_dev_listZ
warningZ
disk_naaZ	fc_resultr
fc_dev
resultZ
dev_infoZ
rescan_cmd
subprocess
callZ
dm_path
path
realpath
splitZ
dm_devZ
dm_sizeZ	disk_size
appendZ
resize_naaZ
resize_cmdZ
reconfig_cmdr
<module>
