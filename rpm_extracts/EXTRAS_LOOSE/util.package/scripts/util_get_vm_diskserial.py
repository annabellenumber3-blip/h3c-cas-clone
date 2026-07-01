# File: util_get_vm_diskserial.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/util.package/scripts/util_get_vm_diskserial.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

ElementTreec
DiskInfoc
vmname
return_list
return_disk_serial)
selfr
util_get_vm_diskserial.py
__init__
DiskInfo.__init__c
sudo virsh dumpxml %sT
shell
stdoutr
z virsh dumpxml %s error, error:%s
VM name error,%sz
./devices/disk
typeZ
network
source
name
alias
target
image
aliname
tardev
device
disk
filez
Vm %s have no diskz
Get image list of %s error)
subprocess
Popen
PIPE
communicate
returncode
	Exception
fromstring
findallZ
attrib
find
append
lenZ
ParseError
AttributeError)
proc
outs
errsZ
image_listZ
tree
disksr
rbd_dictZ	disk_dictr
diskpathr
get_image_list
DiskInfo.get_image_listc
]4}	|	
NzHvirsh qemu-monitor-command %s --hmp info qtree | egrep 'drive-|serial ' Tr
vm %s not running, error:%sr
utf-8
drive = z	serial = 
no disk serial foundz
drive =z
serial =z
serial)
decode
strip
split
startswith
range
lstripr%
cmdr(
disk_serialsZ
slinesZ
rlinesZ
disklen
line
lines
diskinfor	
get_disk_serialP
DiskInfo.get_disk_serialc
)	Nz
drive-r
Z	serial_id)
serialinfoZ
diskseriallistr
disknamer2
diskserialr	
DiskInfo.return_disk_serialc
domainNameZ
diskInfo)
json
dumps
print)
dataZ
jsonStrr	
json_return
DiskInfo.json_returnN)
__name__
__module__
__qualname__r
__main__r/
z error: input one running vm name
sysr>
Z	xml.etreer
objectr
argvr@
exitr
inforB
<module>
