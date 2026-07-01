# File: ovs_smartnic.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/openvswitch.package/scripts/ovs_smartnic.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

d!d"
Z d#d$
Z!d%d&
Z"d'd(
Z#d)d*
Z$d+d,
Z%d-d.
Z&d/d0
Z'd1d2
Z(d3d4
Z)d5d6
Z*d7d8
Z,d9d:
a.dId<d=
Z/d>d?
Z0d@dA
Z1dBdC
Z2dDdE
Z3dFdG
Z4e5dHk
cElementTree
/sys/class/net/z
/var/run/vdpa/assign_allocz
/usr/bin/vdpactlz
ovs_smartnic.pyz
/var/run/vdpa/allocate.lockc
Flockc
open
fobj
fileno
self
filename
-./openvswitch.package/scripts/ovs_smartnic.py
__init__
Flock.__init__c
NTF)
fcntlZ
flockr
LOCK_EX
lock"
Flock.lockc
closer
unlock)
Flock.unlockN)
__name__
__module__
__qualname__r
shell
stderr
stdoutr
Failed to execute cmd: %s: %sz!Successful to execute cmd: %s: %s)
subprocess
Popen
PIPEZ
communicate
decode
returncode
logging
error
strip
debug)
execute-
Successful to execute cmd: %s
waitr!
	readlinesr
execute_fast9
Failed to read file: %s)
readr$
IOErrorr"
warning)
resZ
tmp_filer
	read_fileC
rjd	d
uuid
setc
	val_to_py)
<listcomp>S
val_to_py.<locals>.<listcomp>
mapc
<dictcomp>U
val_to_py.<locals>.<dictcomp>)
isinstance
list
str)
valr
RepPortc
_name
	_portname
_switch_id
_vfidx
_vfpcir
RepPort.__init__N
PFPortc
_pci
_full_offloadrG
_vfpcisr
PFPort.__init__NrK
sockz
/var/run/vdpa/device/vdpa_%s
%s:%s:%s:%s:%s:%sr
hasattrrP
replace)
argvrQ
get_sock_macn
If can't get vdpa due to vdpactl block or crash, it will timed out 5 seconds to return.
       On return, a list BDBFs of vdpable pci devicesz
%s getunusedr
VDPACTL_BIN
split)
retr
get_unused_vdpa_devices}
ovs-vsctl -t 5 list-ifaces %sr4
../../devices/platformz
../../devices/pciZ
pci_z /sys/class/net/%s/bonding/slaves)
path
exists
readlink
startswith
appendr$
extend)
br_name
uplinks
ifaces
ifaceZ
physr
get_uplinks
isdigitrf
isalpha)
name
length
tokensr
name_token
rep_portnamers
rep_phy_vf_index
rep_phy_index
pf_portnamers
	phy_index
sNq0t
sdq0d
)	z&iterate some where to get all rep infoz
/sys/devices/virtual/netr`
../../devices/virtual/netz /sys/class/net/%s/phys_port_namez /sys/class/net/%s/phys_switch_idN)
SYS_CLASS_NETra
listdirr(
phy_name_pathZ
repportZ
phy_switch_id_pathr
iter_rep_port
br-intz1ovs-vsctl -t 5 get open . external_ids:ovn-bridger
splitlinesr$
ovn_brZ
get_ovn_br_cmdZ
get_ovn_resr
_check_int_bridge
get_avail_and_suggest_pfs_r@
itemsrO
pci_to_vfeth
pci_to_reprF
name_to_pf
pfname
pfport
vfpci
vfeth
repr
try_get_rep
Nz3ovs-vsctl -t 5 get open . external_ids:ovn-encap-ipr
"z.ip -br a | grep -w -m1 '%s' | awk '{print $1}'z
ovs-vsctl -t 5 br-exists %sr3
ovs-vsctl -t 5 iface-to-br %sr)
vtepip_resZ
vtepipZ
iparesr
_get_vtep_bridge
t	d	t
}	|	
<request>
  <operationType>get</operationType>
  <iterator>sys_class_net</iterator>
  <select>
    <isPhysicalSmartNIC>1</isPhysicalSmartNIC>
  </select>
  <data>
    <name/>
    <pciAddress/>
    <isFullOffloaded/>
    <smartvirtualFunctions/>
  </data>
</request>
z-python3 /opt/bin/device_config.pyc --xml "%s"r
entityro
pciAddressz
%s%s/phys_port_namez
%s%s/phys_switch_idZ
isFullOffloadedZ
smartvirtualFunctions
,z5ovs-vsctl -f json --column name,other_config list int
datar)
headings
other_configTZ
used_by_subnet
z=pf %s has no available vfs, to check using: vdpactl getunused)&r(
fromstring
findallrL
find
textrF
boolrN
sortrO
json
loads
zipr7
intersectionr
keysr"
bridge
flagsr&
replyr
vfs_textZ
vfpcis
suggest_pfs
	avail_pfsr1
unused_vdpasZ
set_unused_vdpasZ	port_dictZ
jsonstr
itemr
vflist_Z
vflist
suggest_pfZ
bridge_ri
ethr
Supported the following operations as follows:
  get_avail_advice_pfs: Get available and advice physical ports for bridge (return a xml):
    {this_script} get_avail_advice_pfs --bridge=vs_bussiness
  set_allocate_onpf: Indicate next allocate on a pf for the mac:
    {this_script} set_allocate_onpf --mac=11:22:33:44:55:66 --pf=ens5f1
  get_allocate_onpf: Query actual allocate on a pf for the mac or sock:
    {this_script} get_allocate_onpf --mac=11:22:33:44:55:66
  allocate_vdpa: Allocate vdpa device for the sock or mac:
    {this_script} allocate_vdpa --sock=<sock_path> --bridge=vs_bussniness
    {this_script} allocate_vdpa --mac=11:22:33:44:55:66 --bridge=vs_bussniness
  release_vdpa: Release vdpa device for the sock or mac:
    {this_script} release_vdpa --sock=<sock_path>
    {this_script} release_vdpa --mac=11:22:33:44:55:66
  lsvdpa: List vdpa devices:
    {this_script} list vdpa devices
this_script)
print
format
SCRIPT_MODULE_NAME)
helpw
z3<root><avial>%s</avial><suggest>%s</suggest></root>r
join)
pfkeysr
get_avail_advice_pfs
qdq>t
t	|	
%s maint-list | grep '%s'r)
lines
get_allocate_onpf
Nz(sed -i '#^\s*%s#d' %s; echo '%s %s' >>%sr4
ASSIGN_ALLOCr
set_allocate_onpf
Get assigned allocate pfz0grep '^\s*%s' %s | tail -n -1 | cut -d ' ' -f2,3r
type_Z
pforvfZ	parse_strr
get_assigned_alloc_pf
NzCls -lart %s | grep 'devices/pci' | awk -F '/' '{print $(NF-2),$NF}'r
UNK)
__vfeth_cacher(
toksr
r@t	
Given a pf and a vfpci (of course, vfpci is virtual), get the vf reprenstor
    this is done by iter sys/class/net/*/phys_port_name to parse out (phy, index).
    and match on /sys/class/net/phy/virtfn[index]'s pci. If match the pci, then *
    is the rep. Since phyidx is not unique across diffrenct phyiscal nic. E.g.:
    ens4f1, ens5f0 using the as pf1, so switchid should also be used.
    Nz!/sys/class/net/%s/device/virtfn%d
__repport_cacher
cacheZ
report_cacheZ
rep_portr
phyidxZ
vfidxr
-> allocate vdpa pf=%s type=%sr
z?--> no assign allocated pf in file is found, auto determine onez{--> no pf can allocate vf, vf res not enough or no pf in the bridge. if involved libvirt, it will failed to create the portr)
timeout 30 %s create %s %sz
--> create vdpa failed: %sr4
--> %s sock %s %s on %sZ	allocatedz
failed to allocate)
LOCK_ALLOCATE_FILEr
infor
flckr
repnamer1
vf_bdbfr^
allocate_vdpa
%s delete %sr
release_vdpa
|	j	f
%s maint-listr
pf	%-15s	%sTr)
vf	%-15s	%s	%s	%s	%srE
vf	%-15s	%s	%s)
verboser
vfpci_to_sockr
lsvdpa$
t	d	
d d!d
}	|	j
d"d#d
d$d%
)&Nz
operate on smartnic information)
descriptionZ
callerz
operation type)
destr
get help)
funcr
get available and advice pfz
--bridgeTz
the bridge)
requiredr
set the nic to allocatez
--sockFz
sock for the vdpa devicez
--macz
mac for the vdpa devicez
--pfz
pf name on it to allocater
z get the nic allocate for the macr
z&allocate vf for the mac and the bridgez
bridge to allocater
release vf for the macr
show vdpa device treez	--verbose
store_truez
show verbose)
actionr
argparse
ArgumentParser
add_subparsers
add_parser
set_defaultsr
add_argumentr
parse_args)
top_parserZ
subparsersZ
help_parserZ
gaan_parserZ	sa_parserZ	ga_parserZ
alloc_parserZ
release_parserZ
lsvdpa_parser
argsr
z t	t
Nz$/var/log/caslog/cas_ovs_smartnic.logz>%(asctime)s %(levelname)7s %(funcName)s:%(lineno)d %(message)sz
%m-%d %H:%M:%S)
levelr
datefmtr
call in: %sr
%s(ret:%d)z
call out: %s ==> OK)
ERROR_CODE_OKr"
basicConfig
DEBUGr%
sysrZ
ERROR_CODE_UNKNOWNr
	Exception
	traceback
format_exc
	exceptionr#
log_filer^
Z	excpt_msgrZ
mainl
__main__)
F)7r
socketZ	xml.etreer
objectr
exitr
<module>
