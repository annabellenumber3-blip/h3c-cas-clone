# File: ovs_dump_vswitch_statistics.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/openvswitch.package/scripts/ovs_dump_vswitch_statistics.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

m	Z	
d d!
d"d#
d$d%
Z d&d'
Z!d(d)
Z"d*d+
Z#d,d-
Z$e%d.k
e	d/
Z&d0Z'e
Z(z6d1e
s<d2e
rDe$
Z+[+n
Z+[+0
-d4e&e'f
/d5e&e.
)8a7
############################################################################
#    File Name: ovs_dumpPorts.py
# Date Created: 2017-01-12
#       Author: jinkaibin j13060
#  Description: get interface's flow statistics information from ovs.
#        Input:
#       Output:
#       Return: 0 if succeffully, other with errors
#      Caution:
#-----------------------------------------------------------------------------
#  Modification History
#  DATE        NAME             DESCRIPTION
##############################################################################
cas_log_init2)
ElementTree
/sys/class/net/z
/sys/bus/pci/devices/)
rxPktsZ
rx_packets)
rxBytesZ
rx_bytes)
rxErrsZ	rx_errors)
txPktsZ
tx_packets)
txBytesZ
tx_bytes)
txErrsZ	tx_errorsFc
shell
stderr
stdoutr
sucess to execute: %s.z1failed to execute: %s, out: %s, err: %s, code: %sz
cmd: %s, result: %s)
isinstance
split
subprocess
Popen
PIPEZ
communicate
decode
strip
returncode
logging
debug
error
	Exception)
cmdr
raise_exception
code
<./openvswitch.package/scripts/ovs_dump_vswitch_statistics.py
command_output(
execute_command9
z9Convert a json ovsdb return value to native python object
mapc
	val_to_py)
<dictcomp>A
val_to_py.<locals>.<dictcomp>r
list
len)
valr
Elementr
text
append)
value
elements
rootr
format_elementE
trafficInfo)
extendr6
iface_infor4
get_iface_result_xmlP
NZ	sriovInfo)
tostringr
iface_info_listr5
get_vswitch_result_xmlX
get_result_xml_
)	Nz
/devices/pciz
/devices/platformr
z;ovs-vsctl --if-exists get interface %s options:dpdk-devargsT
devicer
path
join
SYS_CLASS_NET
exists
realpathr"
SYS_PCI_DEVICES)
iface
devicePathZ
pciPathr
pcir
is_iface_uplinkh
Nz1ip -br link show type veth | awk -F@ '{print $1}'T
get_all_veth_ifacesv
%s_bondr
hashlibZ
encodeZ	hexdigest)
br_name
nameZ
md5_valZ
tmp_namer
get_bond_port_name{
qP|	
ovs-vsctl br-exists %sT
'%s is not ovs bridge or not exist, skip
ovs-vsctl -t 2 list-ifaces %szZovs-vsctl -t 2 --bare --format=table --columns=name find Int other_config:used_by_subnet=1Z
_bond
/proc/net/bonding/%sz
/sys/class/net/%sz4cat /sys/class/net/%s/bonding/mode | cut -d ' ' -f 1r
active-backupzJcat /proc/net/bonding/%s | grep 'Currently Active Slave' | cut -d ':' -f 2z$cat /sys/class/net/%s/bonding/slavesz)cat /sys/class/net/%s/device/sriov_numvfsr
maxSupportVfCountZ
usedVfCountZ
usedVfForVMZ
usedVfForSubnet)
ERROR_CODE_OKr 
warningr"
removerH
intrA
bridge
resr8
sriovSumNumZ
smartnetSriovActiveNumZ
smartnetVfForVMZ
smartnetVfForSubnet
retr
iface_listZ
sub_listZ	bond_nameZ
iface_pathZ	bond_modeZ
active_ifacerF
sriovMaxNumrG
get_vswitch_vf_info
]4}	t
qTqF|
NzUovs-vsctl -t 5 --columns=external_ids,statistics --format=json find Interface name=%sT
headings
datar
vsNameZ	vPortNameZ
external_idsz
attached-mac
:z)Failed to get mac address of interface %sZ
000000000000Z
vmMacZ
statisticsz?Failed to get flow statistics of interface %s, under bridge %s.)
json
loads
zipr%
replacer
IFACE_STATISTICS_TAG
ERROR_CODE_FAILED)
infor
Z	cmd_replyrb
macr2
keyr
get_iface_statistics_info
Nz%Dump vswitch vf info under bridge: %s)
ifaces_info_listr8
dump_vswitch_vf_statistics
NzQovs-vsctl -t 2 --bare --columns=name find interface other_config:pvlan_patch=TrueTrI
get_all_pvlan_patch_iface
q:d	|
}	|	D
ovs-vsctl -t 2 list-brTz'Dump iface statistics under bridges: %srR
z=ovs-vsctl --if-exists get bridge %s other_config:network_typer>
z6network_type of bridge %s is BRIDGE_TYPE_SEG, skip it.rU
spi-
.zMovs-vsctl -t 2 --bare --columns=name find interface other_config:origin_br=%s)
BRIDGE_TYPE_SEG
setr+
startswith
addr[
bridgesr^
all_veth_ifacesZ
all_pvlan_patch_ifacesr]
network_typer`
tbr_iface_setZ	spi_portsZ
veth_portsZ
pvlan_portsrF
Z	tbr_ifaceZ
seg_iface_listr8
dump_iface_statistics
Nz#Script Execute: ovs_dumpPorts.py %sz
-vfr
print)
argvr^
replyr
_mainD
 [vswitch_name])
basename
sysr|
	printHelpT
__main__Z	dumpPortsr
--helpz
catch exceptionz
error code: %d, messge: %s;z+execute end : error code %d, time use %.3fs)
FF)1
__doc__r
timer
util_cvk_logr
Z	xml.etreer
BRIDGE_TYPE_DRAINrv
__name__r^
errorMessageZ
cmdStartTimer|
	exceptionr
timeuser
exitr
<module>
