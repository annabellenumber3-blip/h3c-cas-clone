# File: fc_san_print_naa_wwid.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/storage-admin.package/scripts/fc_san_print_naa_wwid.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

m	Z	
Z"["n
Z"["0
ElementTree)
date
time
datetimec
}	|	d
lun_infor
dev is None or empty
FC_SAN_NO_NAAz3fdisk -l /dev/%s 2>/dev/null | grep "Disk\ /dev/%s"z sg_turs /dev/%s 2>/dev/null 1>&2T)
shellz
Rescan device %sz$echo 1 > /sys/block/%s/device/rescanz
Failed to rescan %sz%device /dev/%s is not ready, skip it.z"fdisk check the dev /dev/%s failed
z(/lib/udev/scsi_id --whitelist -u /dev/%sz
Get NAA /dev/%s failedz>cat /sys/block/%s/device/vendor 2>/dev/null | awk '{print $1}'z%Get vendor /dev/%s failed or is emptyz<cat /sys/block/%s/device/model 2>/dev/null| awk '{print $1}'z'Get model /dev/%s failed or it is emptyZ
naaZ
capacity
vendor
modelz
Get info of /dev/%s failed)
Element
strip
logging
warning
fc_san_error
util_cmds_output
subprocess
call
	scan_flag
debug
splitZ
SubElement
text
BaseException
error)
fc_devZ	info_nodeZ	fdisk_cmdZ
dev_infoZ
sg_cmdZ
rescan_cmdZ
dev_sizeZ
disk_naar
naa_nodeZ
capacity_nodeZ
vendor_nodeZ
model_nodeZ	subexcept
fc_san_print_naa_wwid.py
fc_get_lun_infomation,
r|qj|
sourcezbls -al /dev/disk/by-path/*-fc-* | awk '{print $NF}' | awk -F "/" '{print $NF}' | grep [[:alpha:]]$r
Get the fc device failedr
There is not any fc devices
FC_SAN_SUCCESS)
multiprocessingZ
Pool
mapr
close
join
appendr
dumpr
Z	root_nodeZ
cmdLineZ
fc_dev_listZ
pool
results
resultZ
efir
fc_san_print_naao
__main__Z
fc_sanz
caslog/storage-adminz<print information of FC disks, such as naa, capacity, vendor)
descriptionz
--rescan
store_trueFz
do disk recan)
action
default
helpz
input parameters: %s
Print NAA info failedr
stringr
argparse
	tracebackr
Z	xml.etreer
util_cvk_logZ
util_sh_error_code_loaderZ
util_common_toolsr
__name__Z
cas_log_init3
ArgumentParser
parser
add_argumentr
argv
parse_args
argsZ
rescanZ
rtnr
exitr
format_excr
<module>
