# File: util_port_harden.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/util.package/scripts/util_port_harden.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

m	Z	
Z%d@d
Z(dAd
Z)d d!
Z*dBd%d&
Z+dCd'd(
Z,dDd)d*
Z-dEd+d,
Z.dFd-d.
Z/dGd/d0
Z0d1d2
Z1d3d4
Z2d5d6
Z3dHd7d8
Z4d9d:
Z5d;d<
Z6d=d>
print_functionN)
Timerz%/var/log/caslog/util_ports_harden.log
/etc/cvm/iptables.rolesz
/etc/iptables.rulesz
/etc/cvm/ip6tables.rolesz
/etc/ip6tables.rulesZ
IPNET_port_hardenZ
IP6NET_port_harden
filterz
/tmp/ipnet_locking.lock
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
util_port_harden.py
log_init*
err_code
msg)
print
json
dumps
exit)
coder
retr
exit_msg3
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
cmdr
timeout_secZ
return_check
timer
errr
execute_cmd9
int)
portZ
iportr
is_valid_portU
port_rangeZ
p_minZ
p_maxr
is_valid_port_rangea
allc
q,n.|
 get system info r6
lsb_verionZ
distributor_id
release
descriptionZ
codenamez
/opt/bin/os_lsb_release -vsz
/opt/bin/os_lsb_release -isz
/opt/bin/os_lsb_release -rsz
/opt/bin/os_lsb_release -dsz
/opt/bin/os_lsb_release -csr8
Not support type: %s)
stripr
required_t
infoZ
cmd_dict
get_system_infop
PH###r
hashlibZ
encodeZ	hexdigestr
get_mark_str
dport
INPUTFc
NzSiptables -t {} -A {} -p {} -m multiport --{} {} -m comment --comment {} -j {} -w {}zTip6tables -t {} -A {} -p {} -m multiport --{} {} -m comment --comment {} -j {} -w {})
format
DEFAULT_TABLE
NEW_CHAIN_NAME
IWTMOUT
NEW_CHAIN_NAME_IPV6r1
ports
proto
target
comm
	port_type
chain
ipv6r-
set_iptables_multiport_access
iptables -P {} {} -w {}r
ip6tables -P {} {} -w {})
!set_iptables_chain_default_policy
]b}	|
Nz)iptables -t %s --line-number -nL %s -w %sz*ip6tables -t %s --line-number -nL %s -w %sr
z$del iptables rules for %s failed: %sz
No any iptable rules to delele!T)
reversez
iptables -t {} -D {} {} -w {}r
ip6tables -t {} -D {} {} -w {}z
del iptables rule(ln=%s) failed)
warning
listr;
splitlines
appendr2
sortrE
Z	rule_nums
lineZ
numr
del_iptables_rules_by_comm
%s#default-allowed
addzaiptables -t %s -A %s -m state --state ESTABLISHED,RELATED -m comment --comment %s -j ACCEPT -w %szbip6tables -t %s -A %s -m state --state ESTABLISHED,RELATED -m comment --comment %s -j ACCEPT -w %sr
zBiptables -t %s -A %s -i lo -m comment --comment %s -j ACCEPT -w %szCip6tables -t %s -A %s -i lo -m comment --comment %s -j ACCEPT -w %szDiptables -t %s -A %s -p icmp -m comment --comment %s -j ACCEPT -w %szJip6tables -t %s -A %s -p ipv6-icmp -m comment --comment %s -j ACCEPT -w %s
del)
optrO
mark_strrM
#handle_iptables_default_allow_rules
 reboot load iptables rules z
iptables(%s) boot savingZ
v6r6
iptables(%s) boot save failedNz
iptables(%s) boot save ok)
ipnet_function
save_iptables_config
save_ip6tables_config
	Exception
	exceptionr
NOK)
save_iptables_rules
q~q`|
iptables -t %s -nL %s -w %sr
ip6tables -t %s -nL %s -w %sr
foundrY
"check_iptables_rules_exist_by_comm
	multiportT
z<check ip6tables rules exist failed(%s) when adding policy %sr[
zDhandle_ip6tables_default_allow_rules falied:%s when adding policy %s
add policy %s falied:%s
%s#%s
ACCEPTrC
z>set_ip6tables_multiport_access falied:%s when adding policy %s
udpz5save_ip6tables_rules failed(%s) when adding policy %s
add policy: %s failed(%s))
CMD_RUNNING_NOKr_
join
del_policy_rules_by_commrg
uuid
ports_listr
add_harden_ports_v6
}	|	d
}	|	d
}	|	d
}	|	d
}	|	d
Nz-need port harden policy info with json formatr[
ipnet add port_harden failed.rx
utf-8)
.0r3
<listcomp>?
z$add_harden_ports.<locals>.<listcomp>z adding policy: uuid %s, ports %sz
ports is none for policy %sz-invalid port or port range(%s) for policy %s!rj
z;check iptables rules exist failed(%s) when adding policy %szChandle_iptables_default_allow_rules falied:%s when adding policy %srl
z=set_iptables_multiport_access falied:%s when adding policy %srr
z4save_iptables_rules failed(%s) when adding policy %srs
add policy: %s success)
	json_argsr
INVALID_ARGSr`
ipnet_port_harden_chainrc
loadsr'
INVALID_PORTr4
argvrf
policy_dictrx
ports_list_v6r3
add_harden_ports0
Nz"need uuid for getting harden portsz0iptables -t %s -nL %s -w %s | grep %s | grep tcpr
%s is not exist.z
multiport dportsr
/*rn
get policy: %s)
extendr
tmpry
get_harden_portst
z1del_iptables_rules_by_comm failed(%s) for comm %srj
z-check_iptables_rules_exist_by_comm failed(%s)r\
Nz%need uuid or all for del harden portsr
z/del_policy_rules_by_comm failed(%s) for comm %sz
del policy %s rules failed: %sz
del all policy rules failed: %sTrk
z2del_policy_rules_by_comm v6 failed(%s) for comm %sz8save_iptables_rules failed(%s) when del harden ports(%s)z9save_ip6tables_rules failed(%s) when del harden ports(%s)z
%s#r\
z+ipnet del port harden chain failed. err:%s.z ipnet delete port_harden failed.z
del policy rules ok(comm:%s))
del_harden_ports
util_ports_harden)
operation type)
helpr[
add harden postsz
--jsonTr~
z#port harden policy with json format)
required
destr
func
getz
get harden posts infoz
--uuidrx
port harden policy uuid)
del harden postsz
--all
store_truez
del all port harden policy)
actionr
argparse
ArgumentParser
add_subparsers
add_parser
add_argument
set_defaultsr
parse_args)
top_parserZ
subparsersr
argsr
all args: %sr
script run failed: %s)
LOG_FILEr
open
LOCKFILE
fcntlZ
flockZ
LOCK_EXr
Z	lock_filer
main
__main__)
TNT)
F)9Z
__future__r
	threadingr
timer
util_iptables_functionr`
Z	getLogger
__name__r
version_infor'
IPTABLES_FILE_CVMZ
IPTABLES_FILE_CVKZ
IP6TABLES_FILE_CVMZ
IP6TABLES_FILE_CVKrG
<module>
