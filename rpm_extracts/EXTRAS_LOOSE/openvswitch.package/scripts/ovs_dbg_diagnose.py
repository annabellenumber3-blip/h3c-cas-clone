# File: ovs_dbg_diagnose.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/openvswitch.package/scripts/ovs_dbg_diagnose.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

l	Z	d
Z&d d!
Z'd"d#
Z(d$d%
Z)d&d'
Z*d(d)
Z+d*d+
Z,d,d-
Z-d.d/
Z.d0d1
Z/d2d3
Z0d4d5
Z1d6d7
Z2d8d9
Z3d:d;
Z4d<d=
Z5d>Z6d?a7G
d@dA
Z8dBdC
Z9e:dDk
Z;e;d
Z=dF
Z=dG
Z=dH
Z=e9e=
n(e;d
Z=e9e=
############################################################################
# Date Created: 2015-11-07
#       Author: hanhuanle
#  Description: diagnose cvk environment. detect whether there is any errors or risks.
#     Diagnose:
#               > fdb: wrong learned port or flooding mac
#               > over lap route
#               > interfaces status
#               > ovs and libvirt process health
#               > ovs db invaliation
#               > vxlan bridge configuration
#               > vm_ip,snetflow,logratote configurition
#               > port mirror: loopback possibility
#               > confliction between acl and bind ip
#               > system and performance
#               > network proirity lost on phyical interface
#               > system performance
#               > internal check: detect the network and vlan on each vswitch
#               > bind ip flow compeletion check
#               > qos check
20170228: todo
1. new schema check: vm_mac -> other_config; TOS -> other_config:tos; mtu, bridge mcast, fallback-ab,
2. check iptables
#-----------------------------------------------------------------------------
##############################################################################
ElementTree
none
Error
Warn
warn
Info
Debugc
Loggerc
superr
__init__
_indent
LOGGER_INFO
	configlvl)
self
	__class__
1./openvswitch.package/scripts/ovs_dbg_diagnose.pyr
Logger.__init__c
type
intr
levelNames
index)
lvlr
level>
Logger.levelr
lenr
indentD
Logger.indentc
)	Nr%
logLevelTz
%s%-5s: %sz
%s%s)
getr
printr
args
kwargsr%
logI
Logger.logc
LOGGER_NONE
rawV
Logger.rawc
LOGGER_ERRORr.
errorY
Logger.errorc
LOGGER_DEBUGr.
debug\
Logger.debugc
info_
Logger.infoc
LOGGER_SWARNr.
warnsb
Logger.warnsc
LOGGER_BWARNr.
warnbe
Logger.warnbc
flagsZ
methodifZ
methodelser)
alternativeh
Logger.alternative)
__name__
__module__
__qualname__r
__classcell__r
checking %10s: "%s" at %sz
%Y%m%d %H:%M:%Sr
loggingr/
time
strftimer%
	Exceptionr(
join
	traceback
format_exception
exc_info)
name
func
ovschecklogAdaptq
Objectc
items
set)
Object.__init__c
hasattr)
Object.hasNFc
getattr
setattr)
defaultZ
creater
Object.getc
Object.setc
__dict__
__repr__
Object.__repr__c
__str
Object.__str)
_Object__strr>
d$d	d
Utilityr
socketZ
create_connectionZ
shutdown
close)
port
timeout
addressZ
tryConnect
Utility.tryConnectc
Z	inet_aton
struct
unpackZ	inet_ntoa
packZ
htonl)
mask
netr
getNet
Utility.getNetFc
shell)
subprocess
check_output
decode
split
cmdrl
outputString
Utility.outputStringc
strip
splitlinesrq
outputLines
Utility.outputLinesc
/sys/class/net/z
../../devices/platformz
../../devices/pci)
readlink
startswith
iface
isPCIIface
Utility.isPCIIfacec
isVFr{
isPF
Utility.isPFc
/sys/class/net/%s/device/physfn)
path
existsr{
Utility.isVFTc
exception when read file1: %s)
open
readrC
filename
	exception
echoOnZ
content
readfile
Utility.readfilec
exception when read file2: %s)
	readlinesrC
Utility.readlinesc
/proc/meminfoc
liner
<listcomp>
z,Utility.getSystemMemInfo.<locals>.<listcomp>r
MemAvailableZ
MemFreeZ
CachedZ
MemTotalZ	SwapTotalZ
SwapFree)
linesZ
memInfoDict
avaiabler
getSystemMemInfo
Utility.getSystemMemInfoc
/proc/%s/statmr
resourceZ
getpagesize)
pidr
pagesZ
memr
getProcessMemInfo
Utility.getProcessMemInfoc
/proc/statr
z,Utility.getSystemCPUInfo.<locals>.<listcomp>r
sum)
cpuinfo
totalZ
idler
getSystemCPUInfo
Utility.getSystemCPUInfoc
/proc/%s/statc
z-Utility.getProcessCPUInfo.<locals>.<listcomp>
tuplerp
getProcessCPUInfo
Utility.getProcessCPUInfor?
tcpdump -elni %s r
timeout %s %sz
%s -c %sz
%s "%s"T
stderr
stdout)
Popen
PIPE)
	interfaceZ
filter_
countra
cmdlineZ
processr
tcpdump
Utility.tcpdumpN)
staticmethodrc
CASUtilityc
z?ovs-vsctl --verbose=db_ctl_base:syslog:off -t 5 iface-to-br %s 
interfaceName
bridgerK
interfaceGetParentBridge
z#CASUtility.interfaceGetParentBridger
}	|	
rN|	
)$Nz$ovs-vsctl -t 5 --db=tcp:%s:6632 showz
ovs-vsctl showTr
    Bridge r?
        Controller 
controllersz
            is_connected: 
is_connectedz
        fail_mode: Z	fail_modez
        Port 
portsz
            tag: 
tagz
"[]z
            Interface 
interfacesz
                type: r
                options: 
optionsr"
remote_ip=(["flow0-9.]+)
	remote_ipr
    ovs_version: z
                error: z&error: "could not open network device z(Error: unparsed ovs-vsctl show line: %s )
communicatero
appendrM
searchr
group
lstripr@
remoterr
bridgesr
controllerr
ovsShow$
CASUtility.ovsShowc
--column
z&CASUtility.ovsList.<locals>.<listcomp>r"
iterr
zip)
columnsZ
columnNumberr
ovsList]
CASUtility.ovsListc
)	Nr
/etc/cvk/cvm_info.confz
address=
cvk_ip=
cvmZ
cvkr
isCVMj
CASUtility.isCVMc
sHq>t
r|q>|
Nz1ip netns exec dhcp-interface-namespace ip -o linkr
\d+:\s*([\w.@_-]+):\s*<(.+)>r
ovs-system
matchr
interfaceInfosZ
interfaceInforS
statusr
getDhcpNamespaceInterfaces{
z%CASUtility.getDhcpNamespaceInterfacesc
Colloct all pci address of <interface type='hostdev'> and <hostdev> from the domain xml.
        Return value struct: [0000:04:00.0, 0000:04:01.2, ...]
        
	domstatus
domain
devicesc
addressXmlTagr
zICASUtility._getPCIsFromXML.<locals>.extractPCIAddress.<locals>.<listcomp>)
busZ
slot
functionz
%s:%s:%s.%s)
pciAddressr
extractPCIAddress
z5CASUtility._getPCIsFromXML.<locals>.extractPCIAddressr
hostdev
sourcerb
fromstringr
find
findallr'
pcis
root
devr
_getPCIsFromXML
CASUtility._getPCIsFromXMLc
Nz%grep -sl "type='hostdev'\|<hostdev " z
/*.xml || trueTrk
z#libvirt xml file doesn't exists: %sr
isfiler@
warningr
extendr
runPathr
grepresultr
getPCIsFromLibvirtDir
z CASUtility.getPCIsFromLibvirtDirc
timeout 5 ovs-appctl bond/show
----r?
lacp
mode
slavesz
bond_mode: 
lacp_status: z
member r
)	r\
bondsr
lastBondr
getBonds
CASUtility.getBondsN)
Legacyc
Nz.timeout 3 ovs-appctl fdb/show -m anybridgenameTr
z!command takes at most 1 argumentsr
VXLANSUPPORTrm
supportVXLAN
Legacy.supportVXLANc
ovs-vsctl -t 5 list aclTr
ovs-vsctl: unknown table "acl"r
supportDBACL
Legacy.supportDBACLc
Nz!/opt/bin/ovs_network_priority.pyc)
supportNetPriority
Legacy.supportNetPriorityN)
ovs-vsctl -Vr
H3C S1020Vz
S1020V version: %sz
UNIS S1000-Vz
S1000-V version: %sz
; z ovs-appctl show-internal-versionz
CAS version: %s)
versionInfoZ
casVersionr
ovsVersionCheck
z)ovscheck_version.<locals>.ovsVersionCheckc
j	d	d
/sys/module/openvswitchz
ovs kernel module not load.r
/sys/module/openvswitch/versionz"/sys/module/openvswitch/srcversionz&modinfo -F version openvswitch || trueTrk
z)modinfo -F srcversion openvswitch || truez3ovs kernel module version not match: %s, %s, %s, %sz)ovs kernel module version: %s, %s, %s, %s)
isdirr@
versionZ
sercversionZ
srcversionZ
disVersionZ
disSrcversionr
ovsKernelModuleCheck
z.ovscheck_version.<locals>.ovsKernelModuleCheckz*/sys/kernel/debug/openvswitch/feature_maskF
ovs_netfiter_hookz
ovs feature mask is on: %sr
)	r\
isdigitr
feature_maskZ
feature_listr
ovscheck_version
}!d%|
| |"<
qRd%|
}"| 
}$|$d
}%|$|%k
 d*|
|%|$
qR|#
),NzIovs-vsctl -t 5 --bare --column=name,tag,other_config,interfaces list port
vxlan_id=(\d+)r
vlan
vxlan
ofportrI
zVovs-vsctl -t 5 --bare --column=name,_uuid,mac_in_use,ofport,type,external_ids list int)
lispr
attached-mac=r
optionr
z ovscheck_fdb.<locals>.<listcomp>r
fe:z
0c:zJovs-vsctl -t 5 --bare --column=name,datapath_type,other_config list bridgec
br_mode=r
 -m z
timeout 5 ovs-appctl fdb/show c
entryr
z*bridge %9s fdb: mac has mutiple entries:%s
ovs-vsctl -t 5 list-ifaces Z
netdev
dpdkz+bridge %9s dptype="%s" has uplink port: %s.z/bridge %9s dptype="%s" doesn't has uplink port.r
%s_%s_%sr
multiple entries errorZ
65534Z
LOCALz0port %s(%s,%s) is expected on %s, learned on %s z#bridge %9s has no learned vm mac %s)!r
replacer
valuesrI
interfaceIdToInfosrI
other_configr
interfaceIdZ
interfaceNameToInfosZ
uuidr
itype
external_idsr4
attached_mac
attached_mac_option
bridgeNameZ
dp_type
br_mode
br_mode_optionZ
vxlanOptionZ
macEntriesZ
macToCountDictr
multipleMacs
ifacesInBridgeZ
vifaceInfosInBridgeZ
uplinksrQ
keyToMacEntryZ
vxlanId
keyZ
notLearnedIfacesZ
learnedPortZ
expectedPortr
ovscheck_fdb
)	Nc
128r
isIpv4
tmpr
calculateNetwork
z/ovscheck_overlapRoute.<locals>.calculateNetworkc
router
zDovscheck_overlapRoute.<locals>.checkoverlapRoute.<locals>.<listcomp>z
multiple default route.Z
metricr
overlap route:z
	itertools
combinations
operator
eqr_
routeObjectsZ
routesr+
Z	routeDatar'
routeObjectr_
noDefaultRouteObjectsr
sameMetric
checkoverlapRoute
z0ovscheck_overlapRoute.<locals>.checkoverlapRoutez
ip route showTz"ip -6 route show | grep -vi 'fe80'Fr
ovscheck_overlapRoute~
denyRuleDetectOnBridge
z1ovscheck_denyRule.<locals>.denyRuleDetectOnBridgez"no implement for deny rule detect )
ovscheck_denyRule
rBq2|
	d |
)"Nc
/sys/class/net/%s/carrierFr
/sys/class/net/%s/flags
/sys/class/net/%s/mtur?
/sys/class/net/%s/speedz
/sys/class/net/%s/duplexr
carrier
admin_staterb
/sys/class/net/%s/addressr
speed
duplex)
IFF_UP
obr<
getInterfaceObject
z2ovscheck_sysInterfaces.<locals>.getInterfaceObjectc
ethtool %sz
Advertised link modesTz
Advertised pause frame usez
^(\d+)baseT/.*r?
compiler
parsingLinkMode
	fullSpeedr
patternrS
getEthAdvertisedLinkSpeed
z9ovscheck_sysInterfaces.<locals>.getEthAdvertisedLinkSpeedz
ovs-vsctl -t 4 list-brrw
ovs-netdevr
z(%6s has no carrier: carrier:%s, admin:%sz#%6s is not up: carrier:%s, admin:%si
vnetz
%6s mtu is %d != 1500.z	eth[0-9]+z1physical interface %6s doesn't has a normal name.z
%s %sr
fullz8%6s doesn't reach the (full speed, duplex): (%d/%d, %s).z%mac %s is owned by multipe ifaces: %sc
z*ovscheck_sysInterfaces.<locals>.<listcomp>z)/etc/udev/rules.d/70-persistent-net.rules
/usr/bin/systemctlz
SUBSYSTEM=="net",z
ATTR{address}==z+ATTR{address}=="([^"]*)", .* NAME="([^"]*)"r
udev rule unmatch: %sz"%s is not ruled in udev rule file.z!%s is isolated in udev rule file.z
%s doesn't exist.)"r\
listdirr
addr~
interfaceObjectsZ
macToNamesZ
physicalIfacePoolr|
ifaceObject
namesrE
udevPersisentNetRuleFileZ
udevRulesPoolr
ovscheck_sysInterfaces
ovscheck_dpdkInterfaces
pidof /usr/sbin/libvirtdr
z-libvirtd pid doesn't run normally, pids = %s.z&libvirtd pid runs normally, pids = %s.r
/run/libvirtd.pidz,The pid of libvirtd %s != that in pidfile %s)
pidsZ
libvirtdPID1Z
libvirtdPID2r
libvirtdProcessCheck'
z.ovscheck_process.<locals>.libvirtdProcessCheckc
r|d	n
pidof %srI
z "%s pid runs normally, pids=%s."z?"systemd is running, but %s pid doesn't run normally, pids=%s."r
monitoring pid z
/proc/%s/cmdliner
z'"%s pid doesn't run normally, pids=%s."z
ps up %sr?
z	(healthy)z"monitor %s running unhealthily: %sz
--no-chdirz
--detachz0%s run with unexpected args(zombie process?): %s)
processBinaryrP
monitorIndexZ
monitorPIDZ
commandZ
processPIDr
ovsProcessCheck3
z)ovscheck_process.<locals>.ovsProcessCheckz
/usr/sbin/ovs-vswitchdz
/usr/sbin/ovsdb-serverr
ovscheck_process&
|	rft	
sJt	
s@t	
s~t	
s$t	
} d)d
rXd	}"d
}#| D
]t}$|$d	
d1|%
}&|&
d	}'|"d	k
rN|'}"|%}#n*|"|'k
|#|"|%|'
d8d9
}(|(
):Nz
/sys/class/netc
: (r
z)ovscheck_ovsdbInvalid.<locals>.<listcomp>z
timeout 5 ovs-appctl dpif/showr
z\ovs-vsctl -t 5 --bare --column=name,admin_state,link_state,type,ifindex,error list interfacez#iface %s of bridge report error: %s)
dpdkvhostuser
dpdkvhostuserclientr
z+%-10s of bridge %-10s: ifindex:%s, type: %sZ
upFZ
dhcpZ
downz
NO-CARRIERz6%-10s of bridge %-15s: admin_state:%5s, link_state:%5sz
\s+%s \d+/\d+: \(z"%s of bridge %s is not in datapathrH
vnet %s is not in ovs.z
invalid port in ovs %szDovs-vsctl -t 5 --bare --column=name,external_ids,type list interfacec
z*%s has incorrect attached-mac(%s) in ovsdbz~ovs-vsctl -t 5 --bare --column=name,output_vlan,select_all,output_port,select_src_port,select_dst_port,select_vlan list mirror
true
falsez ovsdb port-mirror %s is corrupt.z8ovs-vsctl -t 5 --bare --column=name,ports,rules list aclz
ovsdb acl %s is corrupt.r
enabledr
disabledr
configuredz!lacp is not negotiated.  bond: %sz!all slaves are disabled. bond: %sz"some slaves are disabled. bond: %sr
active-backupr;
z.different slave speed in bond %s, %s:%d, %s:%drI
zGovs-vsctl --if-exists get Open_vSwitch . other_config:flow-restore-waitz
"true"z. other_config:flow-restore-wait is not removedc
qNq2d
Nzhovs-vsctl --timeout=5 --bare --columns=name find interface link_state=down 'type="dpdkvhostuserclient"' Tc
zKovscheck_ovsdbInvalid.<locals>.ovs_check_vhostusrclient.<locals>.<listcomp>c
/proc/net/unixz@ovs-vsctl --if-exists get Interface %s options:vhost-server-pathr
zGThe server socket file of dpdkvhostusrclient interface %s does't exist )
ifacesZ
all_socket_filesr|
cmd2Z
vupathr
ovs_check_vhostusrclient
z7ovscheck_ovsdbInvalid.<locals>.ovs_check_vhostusrclient)!rx
remover6
sysInterfacesZ
dhcpInterfacesZ
dpPortsZ
ovsInterfacesrI
link_stater
ifindexr1
dhcpOkrF
output_vlanZ
isAll
output
srcr'
selectVlan
rulesr
bondr
enabledSlavesZ
disabledSlavesr@
ethZ
enableslaveZ
ethnameZ
speedStrZ
speedslaver\
ovscheck_ovsdbInvalidW
)-Nc
}	|	
) Nz
ip route get r
remote ip is null. r
z3remote ip route is not unique. dev=%s, source ip=%sr:
z$Failed to access mtu of %s by sysfs.i
z-mtu of vtep device %s = %d is less than 1550.c
zJovscheck_vxlanBridge.<locals>._checkCASVXLANCompletion.<locals>.<listcomp>Z
unkowni
comwarez'exception when try connect to %s:80: %sz(exception when try connect to %s:6632:%sz
vtep %s is a physical switch?z
vtep access failed. %s.c
brr4
z%vtep %s doesn't has cas vxlan bridge.c
z!remote ip %s on %s is not in poolz-%s doesn't has all vteps in domain.(%d != %d))
listr
vxlanInterfacesZ
vtepDeviceZ
vtepIpr|
Z	routeInfoZ
vtepDeviceMtuZ
mtuStrZ
vtepPoolZ
vteprK
bridge2r
vxlaninterfaces2r
iface2r
_checkCASVXLANCompletion
z6ovscheck_vxlanBridge.<locals>._checkCASVXLANCompletionzGovs-vsctl -t 5 --bare --column=name,controller,other_config list bridgerI
z(ovscheck_vxlanBridge.<locals>.<listcomp>r"
controllesc
z3ovs has cas vxlan bridge %s and sdn vxlan bridge %sc
z&controller on not-sdn-vxlan-bridge %s.z1sdn vxlan bridge %s has no configured controller.c
z4sdn vxlan bridge %s has no connected controller: %s.z5sdn vxlan bridge %s has no or multiple vxlan port: %sr
z.{key=flow, local_ip="[0-9.]+", remote_ip=flow}z6sdn vxlan bridge %s has incorret vxlan port option: %srk
z(cas vxlan bridge %s has controllers: %s.z&cas vxlan bridge %s has no vxlan port.z?{in_key=flow, out_key=inport, remote_ip="[0-9.]+", tos=inherit}z6cas vxlan bridge %s has incorret vxlan port option: %sz'bridge %s(mode=%s) has controllers: %s.z'bridge %s(mode=%s) has vxlan ports: %s.)
casBridgesZ
sdnBridgesre
ovscheck_vxlanBridge
/etc/openvswitch/*z
du -s r"
vm_ipZ
snetflowz
conf.dbr
file %-25s size is %dKB > %dKB.)	
globrD
)	rp
filesrr
Z	limitDictr
limit
sizer
ovscheck_configFileSizea
mirror
	directionr
z<port mirror on interface whose vlan is 1.(vm = %s, mac = %s)Z
vlan_idZ
encapsulation_vlan_idzQvlan %4s of port mirror on interface is also a bussiness vlan.(vm = %s, mac = %s)z2execption when paser vm(%s) xml for port mirror:%s)
textr
vmVlansZ
mirrorVlanrK
_checkVMPortMirrorq
z/ovscheck_portMirror.<locals>._checkVMPortMirrorr
z7/bin/grep -h "<vlanId>" /etc/libvirt/qemu/profile/*.xmlT)
\s*<vlanId>(\d+)</vlanId>r
/etc/libvirt/qemu/*.xml)
runningxmlsr
ovscheck_portMirrorp
sXd	|
z'find no domain under /etc/libvirt/qemu/z[/bin/grep -H "<interface \|<ip address=\|<filterref \|</interface>" /etc/libvirt/qemu/*.xmlr
<interface 
</interface>
<ip address=z
bind ip in %s z
<filterref r
acl in %s r
acl and bind ip both in %s )
filterZ
natZ
manglez
iptables -L -n -t %sc
Chain z
target r
z.ovscheck_aclBindIPConflict.<locals>.<listcomp>z"iptables rules exist in table '%s')
xmlsrr
lastNetFlagsr
tabler
ovscheck_aclBindIPConflict
q4d	|
]L}	|
d!d"
)(Nz
/run/libvirt/qemu/*.xmlz/find no running domain under /run/libvirt/qemu/zk/bin/grep -H "<interface \|<mac address=\|<ip address=\|<target dev=\|</interface>" /run/libvirt/qemu/*.xmlTr
<interface type)
<mac address=
<target devz
/var/run/openvswitch/vm_ipr
zPovs-vsctl --verbose=db_ctl_base:syslog:off -t 5 --bare --column=ofport list int z"ovs-ofctl dump-flows %s in_port=%sc
reverse)
sort)
priorityr
_check_priority
z0ovscheck_bindIpComplete.<locals>._check_priorityc
NzC^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$TF)
ipAddrrf
ipv4_addr_check
z0ovscheck_bindIpComplete.<locals>.ipv4_addr_checkc
\s*cookie=0x0, duration=[0-9.]+s, table=0, n_packets=[0-9]+, n_bytes=[0-9]+, idle_age=[0-9]+,( hard_age=[0-9]+,)? priority=([0-9]+),ip,in_port=%s,nw_src=(%s) actions=%s)
z	0.0.0.0/1
dropr
128.0.0.0/1r
NORMALr
maxr
flowPatternr
flowrS
	userFlowsr
_bind_ip_flow_check_v1
z7ovscheck_bindIpComplete.<locals>._bind_ip_flow_check_v1c
\s*cookie=0x1, duration=[0-9.]+s, table=0, n_packets=[0-9]+, n_bytes=[0-9]+, idle_age=[0-9]+,( hard_age=[0-9]+,)? priority=([0-9]+),([airp]{2,3}),reg4=0/0x1,in_port=%s,?(.*) actions=load:0x1->NXM_NX_REG4\[0\](.*))
z	nw_src=%sr
,resubmit(,0)r
arpz
arp_spa=%sr
z#arp_spa=0.0.0.0,arp_tpa=%s,arp_op=1
_bind_ip_flow_check_v2	
z7ovscheck_bindIpComplete.<locals>._bind_ip_flow_check_v2c
\s*cookie=0x[0-9]+, duration=[0-9.]+s, table=0, n_packets=[0-9]+, n_bytes=[0-9]+, idle_age=[0-9]+,( hard_age=[0-9]+,)? priority=([0-9]+),([adirpu]{2,3})?,?reg4=0/0x1,in_port=%s,?(.*) actions=(.*))
dl_src=%s,nw_src=%sr
%load:0x1->NXM_NX_REG4[0],resubmit(,0)r
dl_src=%s,arp_spa=%sr
z-dl_src=%s,arp_spa=0.0.0.0,arp_tpa=%s,arp_op=1Z
udpz,dl_src=%s,nw_src=0.0.0.0,tp_src=68,tp_dst=67
	dl_src=%s
_bind_ipv4_flow_check_v3
z9ovscheck_bindIpComplete.<locals>._bind_ipv4_flow_check_v3c
sxq\|
\s*cookie=0x[0-9]+, duration=[0-9.]+s, table=0, n_packets=[0-9]+, n_bytes=[0-9]+, idle_age=[0-9]+,( hard_age=[0-9]+,)? priority=([0-9]+),([icmpv6]{4,5})?,?reg4=0/0x1,in_port=%s,?(.*) actions=(.*))	r
fe80::%x%s:%sff:fe%s:%s%sr
ipv6z
dl_src=%s,ipv6_src=%sr
icmp6z$dl_src=%s,icmp_type=135,nd_target=%sz$dl_src=%s,icmp_type=136,nd_target=%sr
ipv6_linklocalr
_bind_ipv6_flow_check_v3<
z9ovscheck_bindIpComplete.<locals>._bind_ipv6_flow_check_v3zQbind ipv4/6 v3 flow entries of %s on %s is incomplete. ofport:%s, ip:%s, flows:%szMbind ip v2 flow entries of %s on %s is incomplete. ofport:%s, ip:%s, flows:%szMbind ip v1 flow entries of %s on %s is incomplete. ofport:%s, ip:%s, flows:%sr
z&bind ip %s on %s != actual ip %s in vm)
range
readlinert
allr8
Z	vm_mac_ipZ
vm_ip_file
file
ovscheck_bindIpComplete
sdqT|
/sys/class/net/%s/device
%/sys/class/net/%s/device/sriov_numvfsFr
upper_r?
zDovscheck_nicUsage.<locals>.getInterfaceUseObject.<locals>.<listcomp>z
/sys/class/net/%s/upper_*r
sriov
uppers)	rM
sriovNumr
getInterfaceUseObjectu
z0ovscheck_nicUsage.<locals>.getInterfaceUseObjectc
valuerh
isMasked
z#ovscheck_nicUsage.<locals>.isMaskedz
/etc/libvirt/qemuz
/var/run/libvirt/qemurw
z7nic %5s usage confilt: sriov: %s, pcipt: %s, uppers: %sz&nic %5s bond usage confilt: uppers: %sz<nic %5s usage : sriov: %s, pcipt: %s, bond: %5s, uppers: %s )
keysrx
configedPCIsZ
runningPCIsZ
bondNicsrb
execludeCountr
ovscheck_nicUsaget
qzq\t
/etc/crontab
*z	/opt/bin/z
run-parts --report /etc/cron.z
unkown crontab task: %szBfile /lib/* /lib64/* /bin/* /sbin/* /usr/bin/* /usr/sbin/* || trueTrk
Intel 80386z
possible virus file: %szAls -l /proc/*/exe 2>/dev/null |grep "exe \->.*(deleted)$" || truez
program deleted process: %sc
/etc/cas_cvk-versionz
/etc/h3c_cas_cvk-versionr
stat
st_mtimer
getCASUpgradeTime
z)ovscheck_virus.<locals>.getCASUpgradeTimei
?z7cvk is recently installed/upgraded. no to find -mmin -nz_find /boot/ /lib/ /lib64/ /bin/ /sbin/ /usr/bin/ /usr/sbin/ /etc/ -mmin -30 -not -type d|| truez	/etc/cvk/z"file modified wthin 30 minutes: %s)
ovscheck_virus
rRt	
} }!|!d
rJt	
n t	
}"|"
}#d }$|#|"|$
d!|#|"
d"|#|"
)#Nc
/proc/*/commZ	ksoftirqdr&
processCommsZ
processCommr
getksoftirqdPids
z.ovscheck_performance.<locals>.getksoftirqdPidsc
processCPU1Z
processCPU2
detaHost
cpuNumZ
detaProcessUserZ
detaProcessSysZ
userCPUUsageZ
sysCPUUsageZ
allCPUUsager
getProcessCpuUsage
z0ovscheck_performance.<locals>.getProcessCpuUsagez
pidof /usr/sbin/ovs-vswitchdr
z(ovscheck_performance.<locals>.<listcomp>z
timeout 5 df -hz
/dev/r
z The partition is almost full: %sz
exception when df : %sr
@U@g
4@z4memory status is not well: host(%.2f%%), ovs(%.2f%%)z)memory status : host(%.2f%%), ovs(%.2f%%)g
zCcpu status is not well: host(%.2f%%), ovs(%.2f%% = %.2f%% + %.2f%%)z8cpu status : host(%.2f%%), ovs(%.2f%% = %.2f%% + %.2f%%)z6cpu status is not well: %13s(%.2f%% = %.2f%% + %.2f%%)z
/proc/%d/commz*cpu status: %12s(%.2f%% = %.2f%% + %.2f%%)z@ovs-vsctl --if-exists get Open_vSwitch . other_config:flow-limitr
ovs-dpctl -t 5 dump-flowsg
?z9ovs datapath flows oversize (flowSize/flowLimit): (%d/%d)z5ovs datapath flows size (flowSize/flowLimit): (%d/%d))
multiprocessing
	cpu_countr\
rstripr@
maprA
sleepr
ovsvswitchpidZ
ksoftirqdPidsrU
perrK
swapZ
swapFreeZ
processMemZ
hostMemZ
ovsMemZ
hostCPU1Z
ovsCPU1Z
ksoftirqdCPU1Z
hostCPU2Z
ovsCPU2Z
ksoftirqdCPU2r
detaFreeZ
hostCPUUsageZ
ovsUserCPUUsageZ
ovsSysCPUUsageZ
ovsAllCPUUsager
cpu1Z
cpu2Z
ksoftirqdUserCPUUsageZ
ksoftirqdSysCPUUsageZ
ksoftirqdAllCPUUsageZ	flowLimitZ
datapathFlowsZ
RATEr
ovscheck_performance
uname -r
/etc/cvk/nic_speed.confr
)	rx
nicToSpeedr
ethInfor
getNicSpeedFromConfig#
z3ovscheck_netPriority.<locals>.getNicSpeedFromConfigc
rld	|
tc qdisc show dev z
htb 1: rootz
sfq 111: parent 1:11z
sfq 112: parent 1:12z
sfq 113: parent 1:13z
%6s has no tc qdiscz
tc class show dev z(class htb 1:11 parent 1:1 leaf 111: prioz(class htb 1:12 parent 1:1 leaf 112: prioz(class htb 1:13 parent 1:1 leaf 113: prioz
class htb 1:1 root rate z
%6s has no tc classz
tc filter show dev Tz
match 00000000/00ff0000 at 0z
match 00200000/00ff0000 at 0z
match 00400000/00ff0000 at 0z(filter parent 1: protocol all pref 1 u32z'filter parent 1: protocol ip pref 1 u32r
%6s has no tc filter
Mbitr
Kbiti
zBInterface %s TC bandwidth %d is not the same with NIC bandwidth %d)
endswithr
resZ
classres
okr@
Z	htb_speedZ
tc_speed
getNicLinkSpeedZ
kernelVersionZ
netToSpeedr
checkTCConfig.
z+ovscheck_netPriority.<locals>.checkTCConfigc
4294967295)
ethxr@
z-ovscheck_netPriority.<locals>.getNicLinkSpeedz!cas doesn't support net priority.rw
z2ovs-vsctl -t 5 --no-heading --column=name list Intc
z(ovscheck_netPriority.<locals>.<listcomp>c
ovs_ifacesr
ovscheck_netPriority 
Nz5ovs-vsctl -t 5 --column=name --bare find port qos!=[]zLovs-vsctl -t 5 --column=name --bare find interface ingress_policing_burst!=0z
out qos on port : %sz
in qos on iface : %s)
outQosPortZ
inQosIfacer
ovscheck_qosu
d d!|	d"
d%d&
d'd&
q:d	}
j d0k
r>t!|
$d1|
)d4|
)d5|
)8Nr
/var/log/dmesgz'/bin/grep PCI-DMA /var/log/dmesg ||trueTrk
z!dmesg | /bin/grep PCI-DMA || truez*Virtualization Technology for Directed I/Oz&vt-d is not enabled or iommu is not onr
z&Failed to import iommustatus py modulez
/proc/cmdlinez
intel_iommu=onz
iommu=forcez
iommu=ptz
iommu is not on: %s z"iommu is not on, see /proc/cmdliner
z(Failed to import device_config py modulerw
z'/sys/class/net/%s/device/sriov_totalvfsFr
/sys/class/net/%sr&
virtio
sriovSupport
sriovMaxNumr
descriptionr
        <request>
            <operationType>get</operationType>
            <select>
                <isPhysical>1</isPhysical>
            </select>
            <data>
                <name/>
                <pciAddress/>
                <sriovNum/>
                <sriovMaxNum/>
                <sriovSupport/>
                <description/>
            </data>
        </request>z
--xmlc
resultLinesr
<lambda>
z&ovscheck_passthrough.<locals>.<lambda>c
ethtool -i %sz
driver: 
driverr
firmware-version: 
firmware
zQ%s %s => %s sriov_totalvfs %2s, sysfs sriov_totalvfs%5sexists, driver: %s, fw: %sr"
 not z0%s %s => %s sriov_totalvfs %2s, sriov_numvfs %s z)%s %s => %s is not cas support sriov nic.zN%s => %s sriov_totalvfs %2s, sysfs sriov_totalvfs%5sexists, driver: %s, fw: %szssriov_totalvfs <= 0, because nic doesn't support sriov or firmware version is too old or sriov is disabled on BIOS.)+rx
iommustatusr6
getLiveKenerlIOMMUStatus
device_configrJ
registerOutputHandle
mainr
pci_dmar
iommuCommandZ
nicListZ
device_config_importedr
pathsr
requestXMLr*
elem
e2rL
failNumZ
maxNumZ	fileExistr
ovscheck_passthrough~
d	t	|
/proc/net/devz
Inter-|Z
facer
rbytes
rerrsr
rdropr
tbytesr
terrs
tdropr
readTrafficFile
z0ovscheck_networkTraffic.<locals>.readTrafficFilec
getIfaceSpeed
z.ovscheck_networkTraffic.<locals>.getIfaceSpeedc
rrq6q6|
rrater
trater
?z)iface %6s traffic speed exceed threshold.z<iface %6s rrate,trate,threshold: %5.2f, %5.2f, %5.2f (Mbps).r
z/%6s has drop statistics (rdrop,tdrop):%6d, %6d.r
z/%6s has errs statistics (rerrs,terrs):%6d, %6d.)
time1stReadZ
ifaces1Z
time2ndReadZ
ifaces2Z
timeIntervalrI
iface1ri
ifaceSpeedThreshold)
checkIfaceTrafficInfo
z6ovscheck_networkTraffic.<locals>.checkIfaceTrafficInfoc
/proc/net/snmpFr
keywordr
isFindKeywordr
getSnmpCount
z-ovscheck_networkTraffic.<locals>.getSnmpCountc
ReasmFailsZ	FragFailsr
ReasmFails, FragFails:%6d, %6d)
cntReasmFailsZ
cntFragFails)
checkIpFrameFails*
z2ovscheck_networkTraffic.<locals>.checkIpFrameFailsr
ovscheck_networkTraffic
11:40:54.606314 0c:da:41:1d:3f:94 > ff:ff:ff:ff:ff:ff, ethertype 802.1Q (0x8100), length 46: vlan 200, p 0, ethertype ARP, Request who-has 2.0.11.99 tell 2.0.11.96, length 28
14:09:16.189842 0c:da:41:1d:d1:1e > 0c:da:41:1d:27:07, ethertype 802.1Q (0x8100), length 102: vlan 200, p 0, ethertype IPv4, 172.16.70.231 > 172.16.70.232: ICMP echo request, id 15445, seq 76, length 64
InternalCheckzi internal check for development envrionment.
    1. check wether uplink or vswitch vlan is incorrect
    c
	|	t
ethertype 802.1Q (0x8100),
ARPZ
Requestr
ICMPr
rsplitr'
INTERNALCHECKNETMASK
setdefaultrO
packetLinesri
proto
netvlanZ
protoTotalZ
netTotalr
offsetr$
statisticsPacketsA
InternalCheck.statisticsPacketsc
Nz/ovs-vsctl -t 5 --bare --column=name list bridger
arp or icmp or tcpr
z0(arp or icmp or tcp) and (not ether src host %s)z
That device is not upz
%6s is not up in bridge.z
No such device existsz
%6s does not exist.r
z'ip -o address show %s | grep '\<inet\>'Trk
zPovs-vsctl --verbose=db_ctl_base:syslog:off -t 5 --bare --column=tag list port %sc
empty statistics of %6sc
zGInternalCheck.ovscheck_vswitchNet.<locals>.logStatics.<locals>.<lambda>T)
%.1f%%r
zIInternalCheck.ovscheck_vswitchNet.<locals>.logStatics.<locals>.<listcomp>c
net   statistics of %6s: %sz
proto statistics of %6s: %sz
vlan  statistics of %6s: %s)
logStatics
z5InternalCheck.ovscheck_vswitchNet.<locals>.logStaticszIfailed to capture vswitch "%6s" related network "%s" on local  port "%6s"zIfailed to capture vswitch "%6s" related network "%s" on uplink port "%6s")
TESTSTRINGr
bridgeIfacesr 
uplinkifacesr[
localPortMacr|
vswitchNetr
addrZ
vswitchVlanr
ovscheck_vswitchNetk
z!InternalCheck.ovscheck_vswitchNetN)
__doc__r
d d!
d"d#t
d$d%
d'd%
d(d)d*|
d,d-|
rbd/n
j!}	g
t$d3
j%d4k
j%a&n
t$d5
zFt'
)d6|
qdt+
)8NZ
verZ
cfzZ
pror|
fdbZ
bindipr
acl_ipZ
net_priorityZ
nicuseZ
virusZ
perfZ
trafficZ
vswitchnetr
v2016033020z
all r"
main.<locals>.<listcomp>c
[%s]r
Check cvk network environment.)
--loglevel)
z	log level)
choices
helpz
--intervalz
check at every interval)
--internalmaskz
net mask for internal checkz	--versionr
%s (cas ovs diagnose tool) %s)
actionr
	checklistr
nargsr
z3No checklist is selected with argv: %s, not in [%s]
z+internal netmask %s is not between (0, 32).zC======================= ovscheck version %s =======================g-C
?).r
basenamerG
argvrD
argparse
ArgumentParser
add_argument
floatr
parse_args
intervalZ
loglevelr
internalmaskr
KeyboardInterrupt)
allChecklistZ
internalChecklistZ
PROGRAMNAMEZ
VERSRIONZ
checklistHelpZ
internalChecklistHelpZ	topParserr
checklist2rI
checkr
__main__r
-l Warn -i 3.1  al aaz
--helpz
-l warn perf vswitchnet)?r
Z	xml.etreer
objectr
testrp
<module>
