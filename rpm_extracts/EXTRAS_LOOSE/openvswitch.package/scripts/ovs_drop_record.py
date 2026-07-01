# File: ovs_drop_record.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/openvswitch.package/scripts/ovs_drop_record.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

l	Z	d
Z9d Z:d!Z;g
Z=d$d%
d&d'
d'e?
d(d)
d)e?
d*d+
d+e?
d,d-
d-e?
d.d/
d/e?
d0d1
d1e?
d2d3
d3eD
d4d5
d5e?
d6d7
d7e?
d8d9
d9e?
d:d;
d;e?
ZJd<d=
ZKd>d?
ZLd@dA
ZMdBdC
ZNdDdE
ZOdFdG
ZPdHdI
ZQdJdK
ZRdLdM
ZSdNdO
ZTdPdQ
ZUdRdS
ZVdTdU
ZWdVdW
ZXdXdY
ZYdZd[
ZZd\d]
Z[d^d_
Z\d`da
Z]dbdc
Z^ddde
Z_dfdg
Z`dhdi
Zaebdjk
cElementTree)
Utility
ValidatyCheck
ERROR_CODE_INVALID_ARGUMENTZ
ovs_drop_record
/var/log/caslog/pktdrop.logz
/var/log/caslog/pktdrop_old.logz
/etc/cvk/cvm_info.conf)
tcp6
udp6
icmp
icmp6z
/var/run/ovs_drop_record.pid
ff:ff:ff:ff:ff:ffZ
NA_TESTDIRz
/etc/net-agentz
/portprofilez
/netprofile)
dropZ
accept
outZ
inouti
rarp
ipv6
	ipaddressZ
ip_address
version
socketZ	inet_pton
AF_INET6)
addr6
0./openvswitch.package/scripts/ovs_drop_record.py
is_valid_ip6L
DropLogMonitorc
_process
selfr#
__init__Y
DropLogMonitor.__init__c
tail -f %sT)
Z	close_fds
stderr
stdout)
stop
PKG_DROP_LOG_FILE
subprocess
Popen
split
PIPEr(
getfd)
cmdr#
start\
DropLogMonitor.startc
DropLogMonitor.getfdc
Z	terminate
waitr)
DropLogMonitor.stopN)
__name__
__module__
__qualname__r+
ProfileDataManagerc
superr;
_portprofiles
_netprofilesr)
	__class__r#
ProfileDataManager.__init__c
closew
ProfileDataManager.closec
valuesr)
get_all_netprofiles{
z&ProfileDataManager.get_all_netprofilesc
keysr)
get_all_netprofile_name~
z*ProfileDataManager.get_all_netprofile_namec
name_r#
get_netprofile_by_name
z)ProfileDataManager.get_netprofile_by_namec
name
netprofiler#
update_netprofile
z$ProfileDataManager.update_netprofilec
poprG
delete_netprofile
z$ProfileDataManager.delete_netprofilec
append)
references
netprofilesZ	referencerL
get_netprofiles_by_references
z0ProfileDataManager.get_netprofiles_by_referencesc
get_all_portprofiles
z'ProfileDataManager.get_all_portprofilesc
get_all_portprofile_names
z,ProfileDataManager.get_all_portprofile_namesc
get_portprofile_by_name
z*ProfileDataManager.get_portprofile_by_namec
portprofiler#
update_portprofile
z%ProfileDataManager.update_portprofilec
delete_portprofile
z%ProfileDataManager.delete_portprofile)
__classcell__r#
NetProfileReferencez~
    NetProfileReference class,  define netprofile refered by portprofile, stor type and name as key for real netprofile.
    c
typer)
NetProfileReference.__init__c
type=%s, name=%s )
__str__
NetProfileReference.__str__
__doc__r+
RulezE
    Base Class Rule, can be inherited by other netprofile rule.
    c
ACTION_DROP
action
DIRECTION_IN
	direction
priority
statematch
FlowMatchField
matchfieldr)
Rule.__init__c
, stateful=%sr]
z(dir=%s, priority=%d%s match:%s action:%s)
lowerrg
Rule.__str__r`
NetProfilezM
    Base Class NetProfile, provide general form of netprofile rule set.
    r]
)	r<
uuidr 
rules
NetProfile.__init__c
elementr#
parse_extra_action
NetProfile.parse_extra_actionc
format_extra_action
NetProfile.format_extra_actionc
root is NoneFr^
name is None
flowc
attribrD
childr#
<listcomp>
z$NetProfile.parse.<locals>.<listcomp>)
incomplete flow: %srg
stateful
falser
z(dl_type, dl_src, dl_dst in flow are nonere
failed to pares action: %sz
invalid flow %sc
<lambda>
z"NetProfile.parse.<locals>.<lambda>)
keyT)!
logging
errorrx
uuid3Z
NAMESPACE_DNSr 
set_log_lasterr
tagrb
isdigit
intrh
_parse_flow_from_xmlrk
dl_type
dl_src
dl_dstrt
check_flowrq
sort)
root
rulerh
itemr#
parse
NetProfile.parsec
truer
catch exception)
Elementr^
SubElementrl
format_xmlru
tostring
replacer
	exception)
xmlr
NetProfile.format_xmlc
len)
field_name
field
field_mask
string_to_field_and_mask&
zANetProfile._parse_flow_from_xml.<locals>.string_to_field_and_maskr
nw_protor
0x0800
nw_src
nw_dstr
0x86dd
ipv6_src
ipv6_dstZ	broadcast)
01:00:00:00:00:00r
	icmp_type
	icmp_code
tp_src
tp_dst)
dl_src_maskr
dl_dst_maskrF
nw_src_maskr
nw_dst_maskr
ipv6_src_maskr
ipv6_dst_maskr
icmp_type_maskr
icmp_code_maskr
tp_src_maskr
tp_dst_mask)
NetProfile._parse_flow_from_xmlc
Nz"type=%s,name=%s,uuid=%s,version=%s)
NetProfile.__str__)
staticmethodr
	AclActionc
targetr)
AclAction.__init__c
AclAction.__str__)
NetProfileAclr]
NetProfileAcl.__init__c
z4NetProfileAcl.parse_extra_action.<locals>.<listcomp>r
z acl/vfw action is incomplete: %sr
z2invalid acl/vfw action, action must be accept/drop)	r
ACTION_ACCEPTrl
actr#
z NetProfileAcl.parse_extra_actionc
action_strrs
z!NetProfileAcl.format_extra_action)
NF)%r<
in_port
out_portr
dl_vlanr
FLOW_MASK_ALLr
arp_op
	tcp_flags
	nd_target
ct_state
ct_mark
reg_bind_ip
is_bind_mac
reg_multiple_outport)
FlowMatchField.__init__c
items
hasattr
setattr)
kw_argsr{
set_fields
FlowMatchField.set_fieldsc
0x0806r
0x8035r
zMdl_type is None while nw_proto: %s, nw_src: %s, nw_dst: %s, set dl_type to %s)
warnr)
complete
FlowMatchField.completec
copyr)
clone
FlowMatchField.clonec
reverse
FlowMatchField.reversec
d!d"
)#Nr
%s/%s)
k_maskr
 convert_to_field_and_mask_format
zCFlowMatchField.format_xml.<locals>.convert_to_field_and_mask_formatr
varsr
FlowMatchField.format_xmlc
%s=%s,z	%s=%s/%s,)
__field_to_string
z FlowMatchField.__field_to_stringc
LOCALr]
reg%di
OVS_OFPP_LOCALr
FLOW_REG_BIT_INDEX_BINDMAC
FLOW_REG_BIT_INDEX_BINDIP
 _FlowMatchField__field_to_stringr
FLOW_REG_INDEX_OUTPORTr
#FLOW_REG_BIT_INDEX_MULTIPLE_OUTPORTr
FLOW_REG_MASK_MULTIPLE_OUTPORTr
reg_index_vec
resr#
__to_string
FlowMatchField.__to_stringc
_FlowMatchField__to_stringr)
FlowMatchField.__str__)
FlowNc
bridge
cookie
tablerh
actionsrg
)	r*
Flow.__init__c
flow:r
packet:r
arp_spar
arp_tpar
strip
DL_TYPE
NW_PROTO
svrk
droplogr
split_packet
infor#
parse_from_droplog3
Flow.parse_from_droplogc
deepcopyr)
Flow.clonec
priority=%s,z
cookie=%s,z	table=%s,z
actions=%sz
direction=%s)
Flow.__str__c
ovs_dbg_listports |grep r]
joinr2
	getoutput)
netprofile_namer#
 get_out_port_and_netprofile_nameY
z%Flow.get_out_port_and_netprofile_namec
Nz"ovs-appctl dpctl/show |grep "port z
odp_portr5
ofp_portr#
get_ofp_port_by_odp_portd
Flow.get_ofp_port_by_odp_portc
Nz1ovs-vsctl --columns=external_ids  list Interface z
port-profile=r
execute_commandr2
external_idsr
get_portprofile_namej
Flow.get_portprofile_name)
NNNNNNN)
PortProfilez
    Define PortProfile used by iface, define funtions parse and format portprofile.xml.
    The value of name is same with "port-profile" in libvirt xml, a portprofile can include multi-netprofiles.
    r]
PortProfile.__init__c
parse %s file exception)
_parse_from_xmlr
successr#
parse_from_xml
PortProfile.parse_from_xmlc
rrqbt	
)	Nr]
composez
wrong type %s or namerL
fromstringrx
PortProfile._parse_from_xmlc
)	Nr
PortProfile.format_xmlc
name=%s)
PortProfile.__str__)
ProfileDocumentc
_dmr)
ProfileDocument.__init__c
get_data_manager
z ProfileDocument.get_data_managerc
reload_portprofiles
reload_netprofiles
ERROR_CODE_OKr)
load_profile
ProfileDocument.load_profilec
/*.xmlz"finish reload portprofiles from %sT)
glob
PORTPROFILE_DIR
define_portprofiler
	read_filer
debug)
profiler#
z#ProfileDocument.reload_portprofilesc
%s/*/*.xmlz!finish reload netprofiles from %sT)
NETPROFILE_DIR
define_netprofiler
z"ProfileDocument.reload_netprofilesc
sbt	
failed to parse portprofile: %sz
invalid argument: %s)
calculate_md5
encoder
get_lasterrr
contentrp
new_portprofiler#
z"ProfileDocument.define_portprofilec
failed to parse netprofile: %sz=invalid argument: xml invalid or type uuid name can not parser
z;invalid argument: netprofile %s already exists with uuid %szQinvalid argument: netprofile with same UUID but different name(%s) already existszOinvalid argument: netprofile instantiation failed as wrong xml parameter err=%s)
parse_netprofile_elementr
create_netprofiler#
profile_typeZ
profile_namero
profilesr
new_profiler#
z!ProfileDocument.define_netprofilec
acl)
ret_netprofiles
portprofilesrW
netprofile_referencesrQ
get_all_acl_netprofile
z&ProfileDocument.get_all_acl_netprofilec
portprofile_namer(
"get_all_acl_netprofile_by_portfile
z2ProfileDocument.get_all_acl_netprofile_by_portfilec
type_rH
z(ProfileDocument.parse_netprofile_elementc
_ProfileDocument__netprofilesZ
_net_profile_classrL
z!ProfileDocument.create_netprofile)
getstatusoutput
	Exceptionr
system_outputE
Nz4ps -ef | grep -E '%s.pyc? record' | awk '{print $2}')
SCRIPT_MODULE_NAMEr1
outputr#
get_monitor_pidsL
open
pidfiler
readr
IOError
SystemExit)
pidr#
get_pidR
path
existsr7
remover#
del_pid^
    do the UNIX double-fork magic, see APUE
    r
fork #1 failed: %d (%s)
fork #2 failed: %d (%s)
fork
exit
OSErrorr,
write
errno
strerror
chdir
setsid
umaskr-
flush
devnullr6
dup2
fileno
stdin
atexit
registerrA
getpidr7
ser#
	daemonizec
qTn&t
isinstance
dictr
extend
assemble_elementrP
listrl
text)
value
elementsr
replyr
pkgDropZ
packetr
decoder
convert_to_xml
dict_r
dp_type
protocolr
zzflow drop-log is filtered for the front-end,as broadcast arp packets into the host,in_port:%s, datapath_type:%s, srcmac:%sr
0.0.0.0r
255.255.255.255z
flow drop-log is filtered for the front-end,as dhcp client broadcast packets into the host,in_port:%s, datapath_type:%s, srcmac:%szsflow drop-log is filtered for the front-end,as dstmac not found on the host,in_port:%s, datapath_type:%s, dstmac:%sF)
BROADCAST_DSTMACr
pktseg
dstmac_whitelist
physical_iface_ofport_nums
filter_flagr#
filter_droplog
}	|	
|	j	|	j
|	j	}
s4|	j
r4|	j
s4|	j	
s4|	j
r4|	j
r4|	j
s4|	j
s4|	j
r4|	j
q4q4|
r4t!
q4q4
q$q4q$|
Falsez-the drop-log is matched with the netprofile: z
matched rule: )#rk
DIRECTION_OUTrg
IPyZ
match_portr
is_mac_matchedr
match_drop_stater
out_port_flag
physical_in_port_flagrf
flow_matchfieldrL
rule_matchfieldZ
rule_nw_src_with_maskZ
rule_nw_dst_with_maskZ
rule_ipv6_src_with_maskZ
rule_ipv6_dst_with_maskr#
to_match_rule_with_flow
flow_dlZ
rule_dlZ
rule_dl_maskZ
rule_dl_mask_lenr#
}	|	r
}	|	
droplog_flow: TFz&the packet was droped by: the nw_src: z
 is not matched with bind-ip: z	bind-ip: z
bind-ipv6: zJthe drop-log is filtered for there was not a acl/vfw rule in related portszDthe drop-log is filtered for there was not any acl/vfw rule matched.)
Z get_portprofile_name_by_odp_portri
get_out_port_name_by_dl_dstr
Z get_portprofile_name_by_ofp_portr-
get_bind_ip_by_odp_portZ
get_bind_ipv6_by_odp_portrn
profile_docrf
out_port_nameZ
out_port_portprofile_nameZ
out_port_netprofilesZ
matched_netprofileZ
bind_ipZ	bind_ipv6Z
bind_ip_netprofiler#
filter_droplog_by_rule
)1Nr
pktlen:Z	timestampZ
pktlenr
ctStater
inPortr
srcMacr
dstMacr
srcIpr
dstIp)
srcPortr
dstPortr
icmpTyper
icmpCoder
icmpv6_typeZ
icmpv6_code)
netprofileNameZ
netprofileUuid)
PROTOCOL_TYPErg
linerd
ret_pktsegZ
pktinfor
rule_netprofiler#
parse_lineW
Nz:ovs-vsctl set Open_vSwitch . other_config:log-flow-drop=%sr
enabler#
set_ovs_droplog
addressr
CVM_INFO_FILE
splitlines
startswithr2
cvm_iprs
get_cvm_ip
r"t"|
}	t#|
)t)j*t)j+
)t)j,t)j+
q0t2
t7t8t9t:|
blockly record drop packet logz
already recordedr
cat %s >> %s; rm %sz
start to record...T
 na-ctl revalidate --include-baseiRN
host dstmac_whitelist: %sr
z9host physical iface ofport nums are, system:%s, netdev:%s
systemZ
netdev
z sending pending %s packets to %sz
err_code: z
utf-8z
!2IHIz
System Exit
KeyboardInterruptr]
)@r<
detachrU
PKG_DROP_OLDLOG_FILE
mknodr&
selectZ
epollrR
EPOLLINr
get_host_macsr
get_physical_iface_ofport_num
timer
pollrO
readliner^
MAX_PENDING_COUNTr
AF_INETZ
SOCK_STREAMr"
connect_exr
zlib
compressr"
struct
pack
DROPLOG_HEADER_TAG
DROPLOG_HEADER_ID
DROPLOG_HEADER_TYPE
DROPLOG_HEADER_LENGTH
sendr:
unregister)
argvr;
drop_monZ
server_addrZ
pollobjZ
is_exitZ
poll_timeoutZ
monfd
pendingZ
last_activerd
last_update_timeZ
update_timeoutro
Z	last_loadZ
load_timeoutZ
epoll_list
fdr3
parsedZ
pending_lenZ
droplog_payload_xmlZ
tcp_socketZ
err_codeZ
payload_zippedZ
payload_length
headerr#
record
)	NFr{
pid file [%s] does not exist
No such process)
kill
signal
SIGTERMr
sleep
SIGHUPrE
find
printrD
msgr_
errr#
is_recorded2
Nz5ovs-vsctl -t 5 get Open_vSwitch . other_config:bypassr
_get_bypass8
get_bypass<
)	zcI'd like to not use FlowManage to save/restore all bridges, rather I use set bypass then revalidater
z8ovs-vsctl -t 5 set Open_vSwitch . other_config:bypass=%sr
bypass really do old=%s new=%sz"bypass nothing to do old=%s new=%s)
switchr1
newr#
bypassA
drop log ctrl)
descriptionZ
callerz
operation type)
dest
helpr
block record watch drop log)
--detach
store_trueFz
run in background)
requiredr
funcr.
stop watch drop logr
test if recordedr
get bypass stater
enable or disable global bypassr
enable/disable)
nargsr
argparse
ArgumentParser
add_subparsers
add_parser
add_argument
set_defaultsr
parse_args)	r
top_parserZ
subparsersZ
record_parserZ
stop_parserZ
is_recorded_parserZ
get_bypass_parserZ
bypass_parser
argsr#
Nz#/var/log/caslog/ovs_drop_record.logz>%(asctime)s %(levelname)7s %(funcName)s:%(lineno)d %(message)sz
%m-%d %H:%M:%S)
level
formatZ
datefmt
filenamez
call in: %sr
%s(ret:%d)z
call out: %s ==> OK)
basicConfig
DEBUGr
ERROR_CODE_UNKNOWNr
	traceback
format_excr
log_file
retZ	excpt_msgr
maing
__main__)dr
Z	xml.etreer
ovs_utilr
ERROR_CODE_UNKNOWN_CMD_ARGSZ
ERROR_CODE_PARSER_XMLZ"ERROR_CODE_UNDEINFED_OPERATIONTYPEr
getenvr
FLOW_REG_INDEX_NORMAL_FLAGr
Z$FLOW_XNORMAL_FLAG_GOTO_OUTPORT_TABLErd
DIRECTION_INOUTr
BRIDGE_INVALID_NAMEr
objectr&
<module>
