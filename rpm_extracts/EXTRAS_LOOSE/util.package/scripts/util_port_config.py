# File: util_port_config.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/util.package/scripts/util_port_config.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

m	Z	
Z1d Z2d!Z3d"Z4d#Z5d$Z6e
d%d&
Z7d'd(
Z8dYd*d+
Z9dZd,d-
Z:d.d/
Z;d0d1
Z<d2d3
d4d5
d6d7
d8d9
Z@d:d;
ZAd<d=
ZBd>d?
d@dA
ZDdBdC
ZEdDdE
ZFdFdG
ZGdHdI
ZHdJdK
ZIdLdM
ZJdNdO
ZKdPdQ
ZLdRdS
ZMdTdU
ZNdVdW
print_functionN)
Timerz$/var/log/caslog/util_port_config.log
/etc/ipset_persist.confz
/etc/cvm/iptables.rolesz
/etc/iptables.rulesz
/etc/cvm/ip6tables.rolesz
/etc/ip6tables.rulesz
/tmp/ipnet_locking.lockZ
IPNET_port_configZ
IP6NET_port_configz
"add in init new chain"z
/opt/bin/virt-rc-localZ
cvk_ipv4Z
cvk_ipv6
filter
NzX%(asctime)s.%(msecs)03d %(filename)s %(funcName)s [%(lineno)d] %(levelname)s %(message)sz
%Y-%m-%d %H:%M:%S)
fmtZ
datefmt)
loggerZ
setLevel
logging
DEBUGZ	FormatterZ
FileHandlerZ
setFormatterZ
addHandler)
logfiler
util_port_config.py
log_initB
err_code
msgz
-- execute end : %s --)
print
json
dumpsr
info
exit)
coder 
retr
exit_msgJ
shell
stderr
stdoutZ	close_fdsr
z6cmd: %s run failed.(out: %s, err: %s, return_code: %s)z@Running cmd: %s on host success.(out:%s, err:%s, return_code:%s))
isinstance
shlex
split
subprocess
Popen
PIPEr
kill
startZ
communicate
is_py3
decode
cancel
returncoder
error
debug)
cmdr*
timeout_sec
return_check
timer
errr
execute_cmdP
cmd: %s, result: %s)
	Exception)
raise_exceptionr?
execute_commandk
Nz&init iptables and ipset default config
	Begin: %s
addz%iptables create new chain %s success.
,ipset create %s hash:net comment family inetzViptables -t %s -A %s -m set --match-set %s src -m comment --comment %s -j ACCEPT -w %szaiptables -t %s -A %s -m state --state ESTABLISHED,RELATED -m comment --comment %s -j ACCEPT -w %szBiptables -t %s -A %s -i lo -m comment --comment %s -j ACCEPT -w %szDiptables -t %s -A %s -p icmp -m comment --comment %s -j ACCEPT -w %sz"Add default rules in new chain %s.
&End: %s success, new chain name is %s.
End: %s failed. %sz
%s failed.)
ipnet_function
ipnet_port_config_chain
NEW_CHAIN_NAME
CVK_SET_NAMErD
DEFAULT_TABLE
COMMENT_STR
IWTMOUTrB
	exceptionr.
cur_processr<
init_iptables_ipsets
Nz+delete iptables, ip6tables and ipset configrE
iptables -t %s -nvL %s -w %sF
delz
delete %s in iptables.z new_chain %s is not exist, skip!
ip6tables -t %s -nvL %s -w %sT
ipv6z
delete %s in ip6tables.z
ipset destroyz
destroy ipset, clean all set.z
End: %s successrI
	%s failed)
NEW_CHAIN_NAME_IPV6rB
delete_port_config
init ipset port setz
Begin: %s. port is %sZ
ipv4rG
-ipset create %s hash:net comment family inet6z%End: %s success, create ipset set %s.rI
z)%s failed. port is %s. See %s for details)	r
ERROR_CODE_INIT_PORT_SET_FAILED
LOG_FILE)
port
set_namerS
init_port_set_ipset
mod net in port set of ipsetz:Begin: %s. port is %s. set name is %s. list_address is %s.z
ipset list %s >/dev/null 2>&1FrW
ipset flush %s
ipset save %s
add %s %s comment %s
!echo "%s" | ipset --exist restorez End: %s success. set_name is %s.z#End: %s failed. set_name is %s. %s.
Begin: rollback ipset %s.
End: rollback ipset %s failed.
<%s failed, and rollback config %s failed. See %s for detailsz,End: %s failed, alreadly rollback %s config.
%s (%s) failed)
backup_ipsetrB
warning
rollback_ipsetr:
ERROR_CODE_ROLLBACK_FAILEDra
)	rb
list_addressrS
tmp_config
addressrT
handle_port_net_ipset
mod net in cvk set of ipsetz9Begin: %s. opt is %s. set name is %s. list_address is %s.Z
full_addre
ipset -! add %s %s comment %s
deletez
ipset -! del %s %sz
Set CVK IP Operation Unknownz*End: %s success. opt is %s. set_name is %sz-End: %s failed. opt is %s. set_name is %s. %sri
z0End: %s failed, alreadly rollback set %s config.rl
INVALID_ARGSrB
optrc
handle_cvk_net_ipset
rdqVd
}	~	n
}	~	0
handle port config in iptablesz;Begin: %s. port is %s. set name is %s. list_protocol is %s.zYiptables -t %s -nvL %s --line-number -w %s | grep -wE "dpt:%s|dpts:%s" | awk '{print $1}'r
iptables -t %s -D %s %s -w %szOiptables -t %s -I %s -p %s --dport %s -m set --match-set %s src -j ACCEPT -w %sz3iptables -t %s -A %s -p %s --dport %s -j DROP -w %sz@End: %s success, port is %s, set_name is %s, list_protocol is %srI
stripr0
reverserB
list_protocolrS
index
protocolrT
handle_port_config_iptables
%s run failed(%s) times %sr
rangerD
time
sleep)
loop_execute_command.
)	Nz
save iptables and ipset configrE
ipset save -f %sr
zGsave ipset config failed.
cmd: %s run failed.(err: %s, return_code: %s)z
End: %s success.rI
z"End: %s failed. See %s for details)
IPSET_FILEr
#ERROR_CODE_SAVE_IPSET_CONFIG_FAILEDr@
save_iptables_configZ
save_ip6tables_configrB
ERROR_CODE_PERSISTENT_FAILEDra
save_iptables_ipset_config9
init ip6tablesrE
z&ip6tables create new chain %s success.r_
zWip6tables -t %s -A %s -m set --match-set %s src -m comment --comment %s -j ACCEPT -w %szbip6tables -t %s -A %s -m state --state ESTABLISHED,RELATED -m comment --comment %s -j ACCEPT -w %szCip6tables -t %s -A %s -i lo -m comment --comment %s -j ACCEPT -w %szJip6tables -t %s -A %s -p ipv6-icmp -m comment --comment %s -j ACCEPT -w %sz"add default rules in new chain %s.rH
End: %s Failed. %sz
%s Failed.)
CVK_SET_NAME_IPV6rD
init_ip6tablesK
rbqTd
}	~	n
}	~	0
handle port config in ip6tablesz@Begin: %s. port is %s. set name ipv6 is %s. list_protocol is %s.zZip6tables -t %s -nvL %s --line-number -w %s | grep -wE "dpt:%s|dpts:%s" | awk '{print $1}'r
ip6tables -t %s -D %s %s -w %szPip6tables -t %s -I %s -p %s --dport %s -m set --match-set %s src -j ACCEPT -w %sz4ip6tables -t %s -A %s -p %s --dport %s -j DROP -w %szEEnd: %s success, port is %s, set_name_ipv6 is %s, list_protocol is %srI
set_name_ipv6r|
handle_port_config_ip6tablesf
back-up tmp ipset configrf
z(backup ipset set_name %s config success.z*backup ipset set_name %s config failed. %sz>backup tmp ipset set_name %s config failed. See %s for details)
ipset_backup_configr
ERROR_CODE_BACKUP_FAILEDrb
rollback ipset configz1ipset flush %s; echo "%s" | ipset --exist restorez*rollback ipset set_name %s config success.z,rollback ipset set_name %s config failed. %sz
rollback ipset failed.)
z'init iptables for new chain: %s successz&iptables new chain %s has exist, skip!rY
z(init ip6tables for new chain: %s successz'ip6tables new chain %s has exist, skip!z+init port config failed. See %s for details)
ERROR_CODE_INIT_FAILEDra
argvr<
	init_open
Nz,close port_config failed. See %s for detailszFdelete new chain %s in iptables and ip6tables, and clean ipset success)
ERROR_CODE_CLOSE_FAILEDra
OKrL
delete_close
port_%s_ipv4
port_%s_ipv6z8mod port %s to default config failed. See %s for detailsz%mod port %s to default config success)
)ERROR_CODE_SET_PORT_DEFAULT_CONFIG_FAILEDra
config_port_default
IPV6r
utf-8
encode
.0rs
<listcomp>
config_port.<locals>.<listcomp>c
z7mod port %s to custom config failed. See %s for detailsz$mod port %s to custom config success)
loads
	json_argsr6
(ERROR_CODE_SET_PORT_CUSTOM_CONFIG_FAILEDra
config_inforc
list_address_ipv6r|
config_port
config_cvk.<locals>.<listcomp>c
z,mod cvk ip config failed. See %s for detailsz
mod cvk ip config success)
ERROR_CODE_SET_CVK_IP_FAILEDra
config_cvk
get cvk ip from cur host ipsetz*ipset list %s -o xml; ipset list %s -o xmlFrW
<list>
</list>
	<ipsets>
</ipsets>
<list>
</list>
z1get cvk ipv4 and ipv6 success from cur host ipsetz get cvk ipv4 and ipv6 failed. %s
%get cvk ip failed. See %s for details)
replacer
'ERROR_CODE_GET_CVK_IPV4_AND_IPV6_FAILEDra
get_cvk_ip
r>q.q.d
zDiptables -nvL %s | grep -E 'DROP' | awk -F 'dpt:|dpts:' '{print $2}'ry
z=ipset list port_%s_ipv4 -o xml;ipset list port_%s_ipv6 -o xmlr
z.get config port ip success from cur host ipsetz
get config port ip failed. %sr
$ERROR_CODE_GET_CONFIG_PORT_IP_FAILEDra
portsrb
get_config_port_ip
)!NZ
util_port_config)
descriptionz
operation type)
help
closez
close port config)
funcZ
config_defaultz
make port allow all ip accessz
-ptz
--portrb
set port)
dest
requiredr
configz#make port allow customize ip access)
--jsonr
z#port config policy with json formatr
make cvk ip as safe listz
--optrw
Z	operationr
get cvk ip from ipsetr
get config port ip from ipset)
argparse
ArgumentParser
add_subparsers
add_parser
set_defaultsr
add_argumentr
parse_args)
top_parserZ
subparsersr
argsr
all args: %sr
script run failed: %sz
script run success)
open
LOCKFILE
fcntlZ
flockZ
LOCK_EXr
NOKr
Z	lock_filer
mainW
__main__)
TNT)
TT)QZ
__future__r
osr%
	threadingr
hashlibr
util_iptables_functionrJ
Z	getLogger
__name__r
version_infor6
IPTABLES_FILE_CVMZ
IPTABLES_FILE_CVKZ
IP6TABLES_FILE_CVMZ
IP6TABLES_FILE_CVKr
Z	BOOT_FILErM
CMD_RUNNING_NOKrv
Z&ERROR_CODE_SAVE_IPTABLES_CONFIG_FAILEDZ'ERROR_CODE_SAVE_IP6TABLES_CONFIG_FAILEDr
<module>
