# File: ovs_dbg_dumpflows.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/openvswitch.package/scripts/ovs_dbg_dumpflows.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

l	Z	G
d!d"
r:d$d%g
)/am
############################################################################
# Date Created: 2015-11-07
#       Author: hanhuanle
#  Description: dump dp flows more obvious. and filter flow like tcpdump do
#-----------------------------------------------------------------------------
##############################################################################
Objectc
superr
__init__
items
set)
self
	__class__
2./openvswitch.package/scripts/ovs_dbg_dumpflows.pyr
Object.__init__c
hasattr)
Object.hasNFc
getattr
setattr)
defaultZ
creater
Object.getc
split
isinstancer
subr
getr&
Object.getrc
Object.setc
__dict__
__repr__2
Object.__repr__c
__str__5
Object.__str__)
__name__
__module__
__qualname__r
__classcell__r
[%smz
stdout
isatty
writer
IOError
exit)
color
output9
returnSelfF
strip
lenr
string
	delimiter
assigner
subMark
	subParser
objZ
type1r
parserCommonK
z%getParserCommon.<locals>.parserCommonc
getParserCommon.<locals>.f)
getParserCommonJ
find)
start
left
right
first
last
findMatchPair_
<listcomp>
z parseActions.<locals>.<listcomp>c
append
extendr
actionsZ
nextPairZ
lastCommaIndexZ
commaIndexr
parseActionsp
packets:r
actions:rN
),rB
statrV
raw)
indexrA
flowZ	statIndexr[
actionsIndexrV
keySubParserZ	keyParserZ	keyObjectZ
statObjr
parserFlow
PortInfoCachec
numberToInfo
nameToInfo
	vmToInfos
expireTimer 
PortInfoCache.__init__c
timerc
expired
PortInfoCache.expiredc
/run/libvirt/qemu/*.xmlz1/bin/grep -sH "dev=.vnet" /run/libvirt/qemu/*.xmlT)
shell
stderrz1/run/libvirt/qemu/(.*)\.xml: *.*dev=.(vnet[0-9]+)r4
z7Warning: Failed to grep vnet in /run/libvirt/qemu/*.xmlz
ovs-dpctl show
port 
(internal)z
 (internal)r
(vxlanz
 (vxlanz
(vxlan)
glob
subprocess
check_output
PIPE
decoder6
splitlines
match
groupZ
CalledProcessErrorr0
startswithr
valuesrT
vnetToVm
liner
infoZ
vnetsr
refresh
PortInfoCache.refreshc
getPortInfoByNumber
z!PortInfoCache.getPortInfoByNumberc
getPortNumberByName
z!PortInfoCache.getPortNumberByNamec
z4PortInfoCache.getPortNumbersByVM.<locals>.<listcomp>)
getPortNumbersByVM
z PortInfoCache.getPortNumbersByVM)
rPd'n
dTdU
)ZNz
----------------------->z
 Summary: Z
tunnelz
tun:z
tunnel.srcr'
tunnel.dstz
tunnel.tun_idZ
tunnel.tosz
tunnel.ttlz
%-5d,tos=%s,ttl=%s
eth.srcz
no eth
eth.dstZ
00r5
mcast 
vlanz
%s,v:%s,%s,%s
eth_typez
eth_type:none
vlan.vidz
vlan.pcpz
vlan.cfiz
vlan: 
arp.sip
arp.tipz
arp.op
arp 
request 
reply rN
arp.tha
ipv4
ipv4.src
ipv4.dst
ipv4.protoz
ip4 proto: z
icmp 
tcp 
udp z
unkown ip proto 
tcp.src
tcp.dstz
tcp port
udp.src
udp.dstz
udp port
icmpz	icmp.typez
icmp:%s  %sz	icmp.code
ipv6
ipv6.src
ipv6.dst
ipv6.protoz
ip6 proto: 
nonez
01:80:c2:00:0z	STP BPDU z
Warning: incomplete flow:%sz
%-4s|%s|%srM
-------vport---------->z
------action---------->z
stat: %4s,%8s,%7sz)=========%s %s===========================
1;33;44z	ip4 protoz
%-31s  %-25s  %-31sz
0;33)
intr
in_portr7
join
maxr[
packets
bytes
used
ljust
range)
flowObjectZ
printRawZ
portToInfoZ
ARROWZ
summaryrZ
tun_idZ
tosZ
ttlZ
l2to
protoZ
icmptypeZ
srcPortInfoZ
dstPortInfoZ
outPort
printFlowObject
GetExpressionFunctionc
portInfoCache)
GetExpressionFunction.__init__c
invportr4
portNumberr
<lambda>k
z;GetExpressionFunction._getComplexFunction.<locals>.<lambda>Z
outvportc
iovportZ
vportc
invmc
portNumbersr
outvmc
funcz
z7GetExpressionFunction._getComplexFunction.<locals>.funcZ
iovmrw
_getComplexFunctionh
z)GetExpressionFunction._getComplexFunctionc
)4Nc
trimMask
z0GetExpressionFunction.__call__.<locals>.trimMaskr
z0GetExpressionFunction.__call__.<locals>.<lambda>
mcastc
z"unkown single word expression "%s"
outc
ethtypec
hostc
srchostc
dsthostc
srcethc
dstethc
ethc
srcportc
dstportc
portc
z$unkown multiple word expression "%s")
NotImplementedErrorr
exprr@
__call__
GetExpressionFunction.__call__)
ExpressionEvalutorc
varJ
getFunction)
ExpressionEvalutor.__init__c
z-ExpressionEvalutor.Evaluate.<locals>.<lambda>r4
evaluater7
expressionr
Evaluate
ExpressionEvalutor.Evaluatec
zBExpressionEvalutor.evaluateLastExpression.<locals>.and_.<locals>.fr
and_
z7ExpressionEvalutor.evaluateLastExpression.<locals>.and_c
zAExpressionEvalutor.evaluateLastExpression.<locals>.or_.<locals>.fr
z6ExpressionEvalutor.evaluateLastExpression.<locals>.or_c
zBExpressionEvalutor.evaluateLastExpression.<locals>.not_.<locals>.fr
not_
z7ExpressionEvalutor.evaluateLastExpression.<locals>.not_rM
poprT
evaluateLastExpression
z)ExpressionEvalutor.evaluateLastExpressionc
\band\br
\bor\br
\bnot\br
|&r4
ExpressionEvalutor.evaluateN)
staticmethodr
ovs-systemzNovs-vsctl -t 2 --no-heading --format json --columns=name,datapath_type list brTrh
datac
z*get_ovs_dump_flow_cmds.<locals>.<listcomp>c
systemr'
ovs-appctl dpif/dump-flows z
ovs-netdevz
Unkown bridge: %sz
ovs-dpctl dump-flows)	rl
json
loadsr
dictrT
	Exception)	
bridge
cmdsZ
br_type
datapath_nameZ
cmd_list_br
resZ
no_system_br
get_ovs_dump_flow_cmds;
NTrh
ovs_dump_flowsW
d#d$
 d&d'
))Na
Filter Expression Key Word:
        1. arp, ip, ipv6, icmp, udp, tcp, mcast
        2. in, out, io, ethtype, vlan, host, srchost, dsthost, srceth, dsteth, srcport, dstport, port, invport, outvport, iovport(vport), invm, outvm, iovm(vm)
        3. and, or, not (&, |, !)z
dump flows.)
descriptionz
--intervalz
check at every interval)
type
help
--raw
store_truez
print the raw flow)
actionr
--tracez
trace the flow
--bridgez
bridge of flows)
filter
nargsr
?z1*********************%s at at %s ****************z
%Y%m%d %H:%M:%Sz
1;37;40Z
skb_Z	recirc_idr4
z	, packetsz ovs-appctl ofproto/trace %s "%s"Trh
>>r(
>>z<Warning: skip ofproto/trace, because of too many (%d) flows )#
argparse
ArgumentParser
add_argument
float
parse_argsr0
intervalr
strftimer
trace
printr
replace
sleep
KeyboardInterrupt)
argvZ
helpStringZ	topParser
argsr
filter_r
exipreTimer
oncer@
flowNumr
flowKeyZ
traceResultr
main]
__main__
vswitch0
host 172.16.70.2 and icmp)
z --raw in 2 and host 172.16.70.33z
--raw out 3r4
__doc__rl
operatorrq
objectr
testr
<module>
