# File: cas_dnsmasq.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/util.package/scripts/cas_dnsmasq.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

l	Z	d
Z+d d!
Z,e-d"k
e.d#
/d$e
Z1e+
Z2e2
rdd%e&
Z7n4e
r|d%e%
8d&e&e%f
e,e1d
zTe;e:
Z<e<
=d'd
Z>Z?e@e?
8d(e>e?f
eAd)e>
Z:[:n
Z:[:0
zHe;e:
8d%e<
8d%e:jC
eAd*e<
Z:[:ndd
Z:[:0
z8e;e:
8d%e<
eAd,e<
Z:[:n
Z:[:0
parseAddress)
ElementTree)
dhcp-interface-namespace)
/etc/libvirt/dnsmasqz
/var/lib/libvirt/dnsmasqz
/var/log/dnsmasq)
/usr/sbin/dnsmasqz
/opt/h3c/usr/sbin/dnsmasqc
DHCPExceptionc
%s,,,%d)
super
	Exception
__init__)
self
message
retcode
	__class__
cas_dnsmasq.pyr
DHCPException.__init__)
__name__
__module__
__qualname__r
__classcell__r
d!d"
d#d$
d%d&
d'd(
d)d*
d+d,
d-d.
d/d0
d1d2
dWd4d5
d6d7
d8d9
d:d;
d<d=
d>d?
Z d@dA
Z!dBdC
Z"dDdE
Z#dFdG
Z$dHdI
Z%dJdK
Z&dLdM
Z'dNdO
Z(dPdQ
Z)dRdS
Z*dTdU
Dnsmasqc
open
	readlines
startswith
close)
filename
args
result
file
fileInfo
lineInfor
_get_config_valueN
Dnsmasq._get_config_valuec
q:qJ|
%s=%s
list
keysr*
write)
kwargsr0
keyr
_set_config_valuem
Dnsmasq._set_config_valuec
wrong ip version
IPVERSIONERR)
	ipVersionr
_check_ipVersion_validity
z!Dnsmasq._check_ipVersion_validityc
ip address %s is invalidr>
socketZ	inet_ptonZ
AF_INET
errorr
	IPADDRERRZ
AF_INET6)
ip4AddrZ
addrZ
ip6Addrr
_check_ip_validity
Dnsmasq._check_ip_validityc
)	Nr
ip addrMask %s is invalidr>
intr
IPADDRMASKERR)
ipaddrMaskr
_check_addrMask_validity
z Dnsmasq._check_addrMask_validityc
NzZ[a-f0-9A-F]{2}:[a-f0-9A-F]{2}:[a-f0-9A-F]{2}:[a-f0-9A-F]{2}:[a-f0-9A-F]{2}:[a-f0-9A-F]{2}$z
The mac address %s is invalid)
compile
matchr
MACADDRERR)
pattern
hwAddrrO
_check_mac_validity
Dnsmasq._check_mac_validityc
read
rstripr,
pidFiler0
pidr
_get_pid
Dnsmasq._get_pidc
Vlan id can't be None!r
Vlan id %d is error!)
VLANERR
	vlanRange)
slef
vlanr
_check_vlan_validity
Dnsmasq._check_vlan_validityNFc
ip netns listT
shell
stderrrT
ip netns add %s
z)ls %s/*.dnsmasq*.conf 2>/dev/null | wc -lr
dhcp%dz
ovs-vsctl show | grep %sFr
	interface)
subprocess
check_output
STDOUT
decode
dhcpnsrV
split
call
configPathrJ
CalledProcessErrorr4
configFile
newZ
netnssZ
dhcp_numra
interface_exist
excZ
inter_valuer
_get_interface
Dnsmasq._get_interfacec
%d.%d.%d.%d
mask_intZ
mask_value
maskr
_exchange_maskLenToAddrD
Dnsmasq._exchange_maskLenToAddrc
only IPv4 and IPv6 supportedr?
versionr
_ipVersionToLenV
Dnsmasq._ipVersionToLenc
Prefixlen must be > 0r	
ValueErrorru
Z	prefixlenrt
_prefixlenToNetmaskk
Dnsmasq._prefixlenToNetmaskc
%s/%s.%s.dnsmasq.confr
%s/%s.%s.dnsmasq%s.confz+The DHCP server of %s-%s-%d already exists!
Iz>The start and end address must be in the same network segment!
2The end address must be bigger than start address!
dhcp-range
z0The network CIDR overlap with other DHCP server!)
path
existsr
DHCPEXISTERRrC
ntohl
struct
unpack
	inet_aton
strrs
IPRANGEERR
_get_config_listr4
CIDRERR)
vswitchr[
	addrBegin
addrEnd
addrMask
	conf_file
addrBeginValue
addrEndValueZ
addrMaskValueZ
netSeg
configFilesrk
configValue
	dhcpRange
serBegin
serEnd
serMask
	leaseTime
serBeginValue
serMaskValue
serSegZ
overlapr
_check_DHCP_validity
Dnsmasq._check_DHCP_validityc
vswitchNamer[
find
textrJ
rootrA
checkDHCPserver_xml
Dnsmasq.checkDHCPserver_xmlc
%s/%s.%d.dnsmasq.pidr
%s/%s.%d.dnsmasq%s.pid
%s/%s.%d.optsfile
%s/%s.%d.%s.optsfile
%s/%s.%d.hostsfile
%s/%s.%d.%s.hostsfile
%s/%s.%d.leases
%s/%s.%d.%s.leases
%s/%s.%d.logr	
%s/%s.%d.%s.logz,ovs-vsctl -t 5 -- --if-exists del-port %s %sTr`
%s/%s.%d.dnsmasq.descr
%s/%s.%d.dnsmasq%s.desc
%s/%s.%d.dnsmasq.conf
%s/%s.%d.dnsmasq%s.conf)
removerb
pidfile
optsfile
hostfile
	leasefile
logfile
descfiler
_cleanup
Dnsmasq._cleanupc
r8d't
rVd(t
r<d1t
rZd2t
rHd;}
rtd=t
} ~ n
} ~ 0
)QNrA
ranger
hostInfo
option
dhcpName
descriptionr=
%s/default.addnhostsr
%s/default.addnhosts%sz
touch %sTr`
dhcpName=%s
description=%s
dhcpServerInterface=%s %s %s
zsovs-vsctl -t 5 -- --may-exist add-port %s %s -- set Interface %s type=internal -- set Interface %s mtu_request=1500z!ovs-vsctl -t 5 set port %s tag=%dz
ip link set %s netns %s
*ip netns exec %s ifconfig %s %s netmask %sz
ip netns exec %s ifconfig %s up
&ip netns exec %s ifconfig %s add %s/%srz
%s,,%s
routerz
option:router
option:router,%s
dns-serverz
option:dns-server
option:dns-server,%sz
option6:dns-server
option6:dns-server,%sr
dhcpLeaseMaxz
/opt/bin/os_lsb_release -isr]
UbuntuZ
CentOSrx
z1strict-order
except-interface=lo
bind-interfaces
zFstrict-order
user=libvirt-dnsmasq
except-interface=lo
bind-interfaces
interface=%s
enable-ra
z dhcp-range=%s,%s,ra-names,%s,%s
dhcp-range=%s,%s,%s,%s
dhcp-lease-max=%s
pid-file=%s
dhcp-optsfile=%s
dhcp-hostsfile=%s
dhcp-leasefile=%s
addn-hosts=%s
log-facility=%s
mount | grep -vE \"dhcp-interface-namespace|on /var/log \" | cut -d ' ' -f 3 | xargs -I {} umount -n {} 2>/dev/null; ip netns exec %s %s --conf-file=%s
unshare -m -- bash -c "%s"z`ip netns exec %s iptables -C POSTROUTING -t mangle -p udp --dport 68 -j CHECKSUM --checksum-fillz`ip netns exec %s iptables -A POSTROUTING -t mangle -p udp --dport 68 -j CHECKSUM --checksum-fillzoiptables -A POSTROUTING -t mangle -p udp --dport 68 -j CHECKSUM --checksum-fill is exist, not need to add again)$ri
	inet_ntoa
pack
htonlr
strCompressedr7
defLeaseMaxrc
splitlines
DNSMASQrj
logging
info)!r
optInfor
Z	addnHostsr
cmdr
dns_serverr
distri
lineZ
distri_resultr
_start
Dnsmasq._startc
infinitez5The argument leaseTime must be a Integer or infinite!
isdigitr
LEASETIMEERRr7
valuesr8
BaseExceptionr
hostIpListZ
hostMacListZ	optIpListrm
_startEntry
Dnsmasq._startEntryc
|	d	
dhcpOptionr
	dnsServerr
dhcpHostsfileZ
dhcpHostrR
ipAddr
findallr
rangeMap
	optionMapr
hostInfoMapZ
staticAddr
hostrR
	start_xml
Dnsmasq.start_xmlc
Nz/You must input name vswitch vlan and dhcpRange!r}
namerA
ARGUMENTSERRrB
	dhcpHostsr
	argumentsrA
opt_name
	opt_valuer
start_shell/
Dnsmasq.start_shellc
+The DHCP server of %s-%s-%d dosen't exists!r
/proc/%s
kill -9 %sTr`
DHCPNOTEXISTERRrn
striprb
time
sleepr
_stop`
Dnsmasq._stopc
stop_xml
Dnsmasq.stop_xmlc
.You must input ipVersion and vswitch and vlan!r
stop_shell
Dnsmasq.stop_shellc
}	|	|
dhcp-lease-maxr|
dhcpInfoListr=
%s/%s.%s.dnsmasq.descr>
%s/%s.%s.dnsmasq%s.descr
%s/%s.%s.optsfilez
%s/%s.%s.%s.optsfiler%
dhcpOptionInforT
option:z
option6:r	
)	rg
confInfor
vlanInfo
conf_value
dhcpRangeInfor
desc_valuer
	key_valuer
_queryConf
Dnsmasq._queryConfc
configr
SubElementr
resultRootr
configNode
elementr
_queryConf_xml
Dnsmasq._queryConf_xmlr
j	d	
j	d	
j	d	
j	d	
ls %s/%s.*.dnsmasq.confTr]
ls %s/%s.*.dnsmasq%s.confrT
ls %s/*.dnsmasq.confz
ls %s/*.dnsmasq%s.conf)
output)
shellResultrm
Dnsmasq._get_config_listc
dnsmasqr
Elementr
print
tostringre
queryDHCPserver_xmlh
Dnsmasq.queryDHCPserver_xmlc
Nz*You must input ipVersion vswitch and vlan!rT
z;|%-5s|%-15s|%-20s|%-9s|%-10s|%-25s|%-25s|%-20s|%-15s|%-30s|)
seqnor
leaseMaxr
z;|%-5d|%-15s|%-20s|%-9s|%-10s|%-25s|%-25s|%-20s|%-15s|%-30s|r
%s:%sF
appendr+
items)
confListr
indexZ
infoListr
firstOptr;
valuer
queryServer_shell
Dnsmasq.queryServer_shellc
duid rT
%Y-%m-%d %H:%M:%Sr	
	beginTime
endTimerR
hostName)
duidr
strftime
	localtimer
leaseInfoListr
	leaseInfoZ	leaseListr
endTimeUTCZ
beginTimeUTCZ	leaseDictr
_listleases
Dnsmasq._listleasesc
leaser
listleases_xml
Dnsmasq.listleases_xmlc
z$|%-8s|%-30s|%-30s|%-30s|%-20s|%-30s|)
z$|%-8s|%-30s|%-30s|%-45s|%-30s|%-30s|)
leasesListr
queryLease_shell
Dnsmasq.queryLease_shellc
z	%s,,[%s]
kill -hup %sTr`
_addHostFileI
Dnsmasq._addHostFilec
addFixedIp_xmly
Dnsmasq.addFixedIp_xmlc
Nz;You must input ipVersion, vswitch, vlan, hwAddr and ipAddr!)
addFixedIp_shell
Dnsmasq.addFixedIp_shellc
}	zrd
%s/%s.%d.hostsfile.tmpr
%s/%s.%d.%s.hostsfile.tmpr%
The hwAddr doesn't exist in %sz
mv %s %sr`
writelinesr,
srcHostfileZ
dstHostfileZ
srcfileZ
dstfileZ
macExistr1
Z	macInFiler
_delHostFile
Dnsmasq._delHostFilec
delFixedIp_xml
Dnsmasq.delFixedIp_xmlc
Nz3You must input ipVersion, vswitch ,vlan and hwAddr!)
delFixedIp_shell
Dnsmasq.delFixedIp_shellc
z1The start address must be in old network segment!z/The end address must be in old network segment!r{
	NETSEGERRr
serEndValuer
_check_modify_validity#
Dnsmasq._check_modify_validityc
checkModify_xmlY
Dnsmasq.checkModify_xmlc
}	|	d
r<d!t
rZd"t
)#NrA
%s,%s,%s,%sr
z&ip netns exec %s ifconfig %s del %s/%sr
%s %s %sZ
dhcpServerInterfacerz
newdescr
newDhcpRangera
serAddrValueZ
serAddrr
newconfr
_modifyr
Dnsmasq._modifyc
}	|	j
descNoder
modify_xml
Dnsmasq.modify_xmlc
modify_shell
Dnsmasq.modify_shell)
NN),r 
d d!d"d#
d%d&d'd#
d(d)d
d*d+d
d,d-d
d.d/d
d0d1d2d
d3d4d5d
d6d7d
d0d1d2d
d8d9d
d:d;d<d
d=d>d?d
d@dAd
}	|	j
dBdCd
)DNz&Validity Checking for CAS DHCP server.)
<subcommand>)
metavar
startz
Start a DHCP server)
helpz
--ipVersionrA
ip version IPv4 or IPv6)
destr8
--namer
DHCP server namez	--vswitchr
vswitch namez
--vlanr[
vlan id)
typez
--dhcpLeaseMaxr
z'The maximum number of DHCP server leasez
--dhcpRangez%<beginAddr,endAddr,netmask,leaseTime>r
z.The range that DHCP server allow to distribute)
--dhcpOptionr
<opt_name=opt_value>r
The option for DHCP server)
actionr6
--dhcpHostsz
<macAddr,ipAddr>r
z1The list for DHCP server allocate a fixed address
stopz
Stop a DHCP serverZ
queryServerz&Query the config info of a DHCP serverZ
queryLeasez%Query the lease list of a DHCP serverZ
addFixedIpz,Add mac&ip list to hostfile of a DHCP serverz
--hwAddrrR
mac addressz
--ipAddrr
ip addressZ
delFixedIpz.Del mac&ip list from hostfile of a DHCP serverZ
modifyz$Modify the IP range of a DHCP serverz
--addrBeginr
The begin address of ip rangez	--addrEndr
The end address of ip range
dealXmlz
deal with a xml string
xmlz
The format of string is xml)
argparse
ArgumentParser
add_subparsers
add_parser
add_argumentrJ
parserZ
subCmdParserZ
startParserZ
stopParserZ
confParserZ
leaseParserZ
addIpParserZ
delIpParserZ
modifyParserZ	xmlParserr
get_argparser
messageTypeZ
_xmlZ
_shell)
mkdirr
fromstringr>
getattr)
funcr.
opTyper2
dnsobj
methodr
dhcpOpEntryV
__main__r	
input paremeters: %sr
z(Not exist %s and %s in host environment.z
,,,z
%s(retcode:%d)z
An check error, %sz
Shell commands on failure, %srp
An unknown error, %s)E
sysr
stringr
fcntlr
IPyr
Z	xml.etreer
util_cvk_logrf
DEV_NAME_LENr
SIOCGIFADDRZ
SIOCGIFNETMASKr
CAS_DNSMASQZ
ONESTORE_DNSMASQr
objectr$
cas_log_init2
debug
argvZ	parameterrD
parse_argsr.
exitrm
error_info
rsplitr
<module>
