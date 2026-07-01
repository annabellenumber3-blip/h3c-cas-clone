# File: dpdk-hugepages.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/dpdk.package/scripts/dpdk-hugepages.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

d d!
d"d#
d$d%
d&d'
d(d)
)-z;Script to query and setup huge pages for DPDK applications.
log2Z
KMGz
/dev/hugepagesc
z1Format memory size in kB into conventional format
{}{}b)
intr
BINARY_PREFIX
format)
logk
suffixZ
unit
dpdk-hugepages.py
fmt_memsize
r\t	|
z%Convert memory size with suffix to kBz
(\d+)([z
]?)$Nz
{} is not a valid page size
matchr
upper
exitr
float
groupr
find)
argr
numr	
idxr
get_memsize
z(Test if NUMA is necessary on this systemz
/sys/devices/system/node)
path
existsr
is_numa)
Read number of reserved pages
/nr_hugepagesNr
openr
read)
nr_hugepagesr
get_hugepages.
z'Write the number of reserved huge pagesr
Nz#Permission denied: need to be root!r
z'{} is not a valid system huge page size)
writer
PermissionErrorr
FileNotFoundErrorr
basename)
pages
filenamer"
sizer
set_hugepages5
z*Show huge page reservations on Numa systemz
Node Pages Size Totalz
/sys/devices/system/node/node*
/hugepages
{:<4} {:<5} {:<6} {})
print
globr
listdirr#
Z	numa_path
noder
hdirr)
show_numa_pagesC
)	z.Show huge page reservations on non Numa systemz
Pages Size Totalz
/sys/kernel/mm/hugepagesr.
{:<5} {:<6} {}N)
show_non_numa_pagesR
z Show existing huge page settingsN)
show_pages^
z%Clear all existing huge page mappingsz4/sys/devices/system/node/node*/hugepages/hugepages-*z$/sys/kernel/mm/hugepages/hugepages-*r
dirsr
clear_pagesf
z-Get default huge page size from /proc/meminfoz
/proc/meminfoz
Hugepagesize:r
startswithr
split)
meminfo
liner
default_pagesizer
z(Set huge page reservation on Numa systemz)/sys/devices/system/node/node{}/hugepagesz(/sys/devices/system/node/node*/hugepagesz
{}/hugepages-{}kBN)
hugepgszr3
nodesZ	node_pathZ	huge_pathr
set_numa_pages{
z,Set huge page reservation on non Numa systemz'/sys/kernel/mm/hugepages/hugepages-{}kBN)
set_non_numa_pages
z+Set the number of huge pages to be reserved
reserve_pages
z0Get list of where hugepage filesystem is mountedz
/proc/mountsr
Z	hugetlbfsr
append)
mountedZ
mountsr<
fieldsr
get_mountpoints
Mount the huge TLB file systemz
already mountedNz
mount -t hugetlbfsz
 -o pagesize={}r
 nodev )
system)
pagesize
mountpoint
cmdr
mount_huge
z-Unmount the huge TLB file system (if mounted)z
umount N)
umount_huge
z*Show where huge page filesystem is mountedz
Hugepages mounted onz
Hugepages not mountedN)
show_mount
)%z7Process the command line arguments and setup huge pagesz
Setup huge pagesz
Examples:
To display current huge page settings:
    %(prog)s -s
To a complete setup of with 2 Gigabyte of 1G huge pages:
    %(prog)s -p 1G --setup 2G
formatter_class
description
epilogz
--showz
store_truez)print the current huge page configuration)
action
helpz
--clearz
clear existing huge pagesz
--mountz
mount the huge page filesystemz	--unmountz
-uz&unmount the system huge page directoryz
--nodez
-nz$select numa node to reserve pages on)
--pagesizez
SIZEz
choose huge page size to use)
metavarrS
z	--reservez
-rz;reserve huge pages. Size is in bytes with K, M, or G suffixz
--setupz;setup huge pages by doing clear, unmount, reserve and mountTr
z9Huge reservation {}kB is not a multiple of page size {}kBrA
argparse
ArgumentParser
RawDescriptionHelpFormatter
add_argument
parse_argsZ
setup
clearZ
unmountZ
reserveZ
mountrH
HUGE_MOUNTr
showr7
parser
argsZ
pagesize_kbZ
reserve_kbr
main
__main__)
__doc__rU
mathr
__name__r
<module>
