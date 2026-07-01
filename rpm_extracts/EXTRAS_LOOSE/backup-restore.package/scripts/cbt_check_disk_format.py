# File: cbt_check_disk_format.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/backup-restore.package/scripts/cbt_check_disk_format.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

Z	d	d
ElementTree)
/etc/libvirt/qemuc
NzRcbt_check_disk_format.py can be used to check whether vm or disk can do cbt backupz?Usage: python cbt_check_disk_format.py vmname [disk_target_dev]z
  vmname: the vm to be checkz+  flag: use external snapshot CBT (value:1)za  disk_target_dev: sepecifies which disk to be check. if not specified, all disks will be checked
print
exit
cbt_check_disk_format.py
usage
DiskInfoc
	disk_type
disk_device
driver_type
source_file
source_dev
source_protocol
source_name
target_dev)
selfr
__init__"
DiskInfo.__init__N)
__name__
__module__
__qualname__r
compat:
1.1TF)
replace
split
len)
img_info
lines
lineZ
compat_substrsr
is_qcow3_disk-
rbdF
qcow2z qemu-img info --backing-chain %s)
shellz
z6Disk image[%s] has backing files, cannot do cbt backupr
z7Disk image[%s] is in qcow2 format, cannot do cbt backupz
Failed to execute command: %s)
subprocessZ
check_output
decoder
loggingZ
warningr#
CalledProcessError
	exception
error)
disk
flag
retZ	shell_cmdZ
result_strZ
backing_files
errr
if_disk_support_cbt8
rTq2t
}	|	j
}	|	j
]*}	|	j
rF|	j
}	|	j
Nz	%s/%s.xmlz
Parsing vm xml:%sz
./devices/diskZ
devicer.
typez
./driverz
./target
filez
./source
blockZ
networkZ
protocolr$
name)
LIBVRIT_VM_XML_DIRr+
info
parse
findallZ
attribr
findr
appendr
vmnameZ
xml_fileZ
disk_arrayZ
domain_eleZ
disk_eler
Z	disk_infoZ
driver_eleZ
target_eleZ
sourceInfor
parse_disk_infoT
zJtarget_dev:%s, disk_type:%s, disk_device:%s, driver_type:%s, source:%s%s%sr
z]The disk contained in VM[%s] should be in rbd format or qcow3 format, and has no backing fileFT)
debugr
disknameZ
disksZ
num_support_cbt_disksr.
can_do_cbt_backup
caslog/backup-restore)
cas_log_init3r
init_log_util
__main__r
Parameters:r
z6Start checking disk format for [vm:%s flag:%s disk:%s]z
Failed to check disk format.z![vm:%s disk:%s] can do cbt backupz%[vm:%s disk:%s] can not do cbt backup)
Z	xml.etreer
util_cvk_logr8
Z	exit_coder9
argvr 
argcr?
BaseExceptionr1
<module>
