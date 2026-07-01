# File: br_vm_block_state.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/backup-restore.package/scripts/br_vm_block_state.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

Z	d	d
Z Z!e
]6Z#e e$e
Z e!e$e
q2e$e e!
Z%e%e
Z'e'j(Z)e)
,e-e
,e-e$e
e.e)
Z1[1n
Z1[10
getDOMImplementation
USAGEz
	 br_vm_block_state.py $1 [$2]z
	 $1: vm's namez&	 $2: interval time(default 3 seconds))
print
br_vm_block_state.py
usage
rfqH|
zhdescription:get vm's path of disk
       parameter: $1: vm'name
       output   : list of vm's disk
    z
virsh domblklist %s --detailsT
shellNr
TypeZ
Target
target
sourcez
domblklist processed error)
subprocess
check_output
decode
split
strip
startswith
endswith
append
CalledProcessError
logging
error)
vm_name
disk
info
scer
get_disk"
description: get io state of disk
       parameter  : $1:vm's name
                    $2:disk name of vm
       output     : io state of disk including rd_byters and wr_bytes
    z5virsh domblklist %s | awk '{if($NF=="%s"){print $1}}'Tr	
virsh domblkstat %s %sr
rd_bytesZ
wr_bytesr
domblkstat processed error)	r
Z	disk_nameZ	dict_statZ
disk_devZ	disk_statZ
tmp_statr!
get_disk_io=
__main__
caslog/backup-restorer#
interval_time is %sz6virsh list | grep [[:space:]]%s[[:space:]] >>/dev/nullTr	
%s not running!
vmIOInfo
nameZ
diskInfoZ
iops)2r
timer
util_cvk_logZ
xml.dom.minidomr
INTERVAL_TIMEr
__name__Z
cas_log_init3
debug
argvr
argv_count
exitr
interval_timer
start
call
retZ	disk_infor
sleep
float
maxZ	disk_path
sumZ
sum_endZ	sum_start
keys
intZ
averageZ
createDocumentZ
domZ
documentElement
rootZ
appendChildZ
createElementZ
createTextNoder 
toxml
BaseExceptionZ
efir
<module>
