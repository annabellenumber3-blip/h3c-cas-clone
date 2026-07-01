# File: nvme_info.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/storage-admin.package/scripts/nvme_info.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

d!d"d#d$
d%d&d'd(d)
d*d+d,d-
Z"e#e"
Z&[&n
Z&[&0
ElementTreec
rz"Failed to read from sysfs path: %s)
path
join
open
read
strip
	Exception
logging
warn
	exception)
pathsr
nvme_info.py
_read_sysfs
/sys/dev/block/%s:%sz
/partition
/dev/)
stat
st_dev
major
minorr
realpath
exists
dirname
basename)
numr
_get_device_of_path
z4Determine if the pool is using the block device
    Nz
./source/devicer
type
dirz
./target/pathZ
netfsFTz
dm-z
/sys/block/%s/slaves/%s)
findZ
attrib
findtextr
startswith
glob)
pool
nameZ
deviceZ
noder
is_storage_pool_using_block&
/etc/libvirt/storage/*.xmlz
./namer&
parseZ
getrootr"
pool_xml_listZ
pool_xmlr%
 lookup_stoarge_pool_by_namespaceD
runningZ
inactivez&Failed to get pool states from libvirt)	
libvirtr
listAllStoragePoolsr&
isActiver
statesZ
connZ
poolsr%
get_storage_pools_stateL
pcie
/sys/class/pci_busz
device/current_link_speedZ
rdma
router!
utf-8z
/sys/class/net
speedz
 Mb/s)	r
splitr
subprocessZ
check_output
decoder
addressr4
busr3
outZ	interfaceZ
speed_by_mbsr
nvme_get_controller_speed^
/sys/class/nvme/nvme*Z	subsysnqnr.
hostnqn
model
stateZ	transportr8
subnqnr;
statusr
Found nvme controller: %s)
info
append)
by_hostnqn
	by_subnqnZ
ctrl_syspaths
ctrls
syspathr&
ctrlr
nvme_get_controllerss
/sys/block/%sn*
wwid
nsid
sizei
intrA
controllerZ
ns_syspaths
ns_listrE
!nvme_get_namespaces_by_controller
isinstance
dict
itemsr(
SubElement
text)
root
value
elemr
_convert_dict_to_xml
/sys/block/dm-*/slaves/)
is_multipath_slave
t	|	
qNq"t
nvmeControllersrL
	namespacer
capacityZ
storageNamer?
xcopyZ
unmapZ	writesameZ
enable
disable
	multipath)
ElementrR
strr+
tostring)
no_poolZ
pool_statesrD
Z	ctrl_elemrM
ns_elemr%
nvme_show_by_xml
__main__)
cas_log_init3Z	nvme_infoz
caslog/storage-adminz
Module util_cvk_log not found!z+Show nvme controllers and namespaces by xml)
descriptionz
--subnqnz
match controllers with subnqn)
helpz
-nz	--no-pool
store_truez without storage pool information)
actionrf
match controllers with hostnqn)
nargsrf
input args: %s)
NNF)(r$
Z	xml.etreer
__name__
argparseZ
util_cvk_logrd
ImportErrorr
ArgumentParser
parser
add_argument
parse_args
argsr@
printr7
<module>
