# File: util_iptables_function.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/util.package/scripts/util_iptables_function.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

m	Z	
Z#e!e"e#d
Z&e$e&d
Z-d!d"
Z.dad$d%
Z/dbd&d'
Z0d(d)
Z1d*g
d+d,
Z2dcd/d0
Z3ddd1d2
Z4d3d4
Z5ded5d6
Z6d7d8
Z7d9d:
Z8d;d<
Z9d=d>
Z:dfd?d@
Z;dAdB
Z<dCdD
Z=dEdF
Z>dgdGdH
Z?dhdJdK
Z@didLdM
ZAdjdNdO
ZBdkdPdQ
ZCdldRdS
ZDdmdTdU
ZEdndVdW
ZFdXdY
ZGdZd[
ZHd\d]
ZId^d_
print_functionN)
Timerz*/var/log/caslog/util_iptables_function.log
z	/etc/cvm/z
/etc/cvm/iptables.rolesz
/etc/iptables.rulesz
/etc/cvm/ip6tables.rolesz
/etc/ip6tables.rulesz
/tmp/ipnet_locking.lockZ
IPNET_z	%sMANAGE_Z
IP6NET_
filter
INPUT
POSTROUTING)
default_rules
connect_limit
database
port_config
	host_port
reject_port
port_harden
port_harden_dropr
OUTPUTZ
FORWARD
docker_natZ
7070Z
7443c
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
util_iptables_function.py
log_initX
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
exit_msg`
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
execute_cmdf
cmd: %s, result: %s)
	Exception)
raise_exceptionr?
execute_command
open
	readlines)
	file_path
file
linesr
	read_file
#default-allowedc
keyword
liner
	<genexpr>
z&get_port_harden_uid.<locals>.<genexpr>rL
anyr0
keywordsr(
get_port_harden_uid
iptablesz
%s%s
ipv4Z	ip6tables
ipv6)
IPNET_MANAGE_KEY
	IPNET_KEY
IP6NET_MANAGE_KEY
IP6NET_KEY)
default_chain
function_chainr[
default_cmd
manage_chain
ipnet_function_chain
ipnet_typer
get_ipnet_combine_variable
save iptables config
	Begin: %srY
get ipnet configz,iptables-save -t %s | grep "%s\|*%s\|COMMIT"r
-A %s
-I %s
'save config in default cvm config files
'save config in default cvk config files
save config in %s
End: %s success.
End: %s failed. %s
	%s failed)
iptables_tablesr]
tables_use_default_chains
replace
path
exists
IPTABLES_FILE_CVM
CVM_CONFIG_DIRrF
write
IPTABLES_FILE_CVKrB
	exceptionr.
save_filename
cur_processZ
save_content
tabler<
chain
output_file
save_iptables_config
qXq0q$|
n2t	j
]Z}	|	|
restore iptables configrg
z6check ipnet manage chain whether used in default chainz(iptables -t %s -nvL %s -w %s | grep "%s"F
z"iptables -t %s -D %s -j %s%s -w %sz
use %s restore iptables configz
iptables-restore -w %s -n < %sz:restore iptables failed. Static configfile does not exist.r
z@restore iptables config failed %s times, try again. reason is %sro
"End: %s try 3 times all failed. %srq
IWTMOUTr]
ranger:
times
restore_iptables_config
save ip6tables configrg
get ip6net configz-ip6tables-save -t %s | grep "%s\|*%s\|COMMIT"r
IP6TABLES_FILE_CVMry
IP6TABLES_FILE_CVKrB
OKr}
save_ip6tables_config
qXq0q$|
n2t	j
]Z}	|	|
restore ip6tables configrg
z7check ip6net manage chain whether used in default chainz)ip6tables -t %s -nvL %s -w %s | grep "%s"Fr
z#ip6tables -t %s -D %s -j %s%s -w %sz
use %s restore ip6tables configz
ip6tables-restore -w %s -n < %sz;restore ip6tables failed. Static configfile does not exist.r
zArestore ip6tables config failed %s times, try again. reason is %sro
restore_ip6tables_config
z=check table %s ipnet manage chain %s status, ipnet type is %srg
%s -t %s -nvL %s -w %sFr
%s -t %s -N %s -w %s
%%s -t %s -nvL %s -w %s | grep -w '%s'r
%s -t %s -D %s -j %s -w %sz
%s -t %s -I %s -j %s -w %s
End: %s success. rp
ipnet_check_manage_chainK
z7check ipnet function chain %s status, ipnet type is %s.rg
_2rb
ipnet_check_function_chainj
zDadd table %s funciton chain %s to manage chain %s, ipnet type is %s.rg
zR%s -t %s -nvL %s --line-numbers -w %s| tail -n +3 | awk -F ' ' '{print $4 " " $1}'rl
%s -t %s -I %s %s -j %s -w %sr
stripr0
table_chain_level_map
intrB
chainkeyr
cur_idxZ
ipnet_add_funciton_to_manage|
|	t	|
zFdel table %s funciton chain %s from manage chain %s, ipnet type is %s.rg
%s -t %s -F %s -w %s z+%s -t %s -nvL %s -w %s | tail -n +3 | wc -lz#%s -t %s -nvL %s -w %s | grep -q %sr
zY%s -t %s -L %s -w %s | grep -w 'Chain' | awk -F '(' '{print $2}' | awk -F '' '{print $1}'z
%s -t %s -X %s -w %sz
delete function chain %sz9function chain is being used %s times, cannot be deleted.z
function chain is not exist.r
forcerd
ipnet_del_function_from_manage
Nz#ip6tables -t filter -nvL INPUT -w 5z"iptables -t filter -nvL INPUT -w 5Fr
check_old_rules_exist
rzt	d
d d!
nzd&
nJd&
d*d+t
*}	|
)5Nz
upgrade iptables rules modelrg
z!iptables rules file is not exist.c
z1ipnet_upgrade_rules_old_to_new.<locals>.<genexpr>F
iptables rules need not update.z
iptables rules need update.z
iptables-save -t filter > %s
cp %s %s.bakc
<listcomp>
z2ipnet_upgrade_rules_old_to_new.<locals>.<listcomp>
*filter
:%sINPUT - [0:0]
-I INPUT -j %sINPUTz)-A INPUT -s 127.0.0.1/32 -p tcp -j ACCEPTc
default_chain_keywordr
:%sdefault_rules - [0:0]
-A %sINPUT -j %sdefault_rules
--dport 8080 -m connlimit
--dport 8443 -m connlimitc
:%sconnect_limit - [0:0]
-A %sINPUT -j %sconnect_limit
:%sport_harden - [0:0]
:%sport_harden_drop - [0:0]
COMMITr
%sdefault_rules
:INPUT DROP
DROP
ACCEPTz
:port_config -
:%sport_config - [0:0]z
-A INPUT -j port_config
-A %sINPUT -j %sport_config
-A INPUT
%sconnect_limit
%sport_hardenz
-A port_configr
%sport_config
-A %sINPUT -j %sport_harden
 -A %sINPUT -j %sport_harden_drop
-A %sport_harden_drop -j DROPrk
iptables-restore -w %s < %s ro
appendr]
Z	head_listZ	tail_listZ
connect_num_keywordsZ
port_harden_uidZ
new_filtered_linesr
ipnet_upgrade_rules_old_to_new
rzt	d
d d!
nzd&
nJd&
d*d+t
*}	|
)5Nz
upgrade ip6tables rules modelrg
z"ip6tables rules file is not exist.c
z2ip6net_upgrade_rules_old_to_new.<locals>.<genexpr>Tr
z ip6tables rules need not update.z
ip6tables rules need update.z
ip6tables-save -t filter > %sr
z3ip6net_upgrade_rules_old_to_new.<locals>.<listcomp>r
z$-A INPUT -s ::1/128 -p tcp -j ACCEPTc
:port_config_ipv6 -r
-A INPUT -j port_config_ipv6r
-A port_config_ipv6Z
port_config_ipv6r
ip6tables-restore -w %s < %s ro
ip6net_upgrade_rules_old_to_new;
z?set default rules chain. opt: %s, src_ip: %s, ipnet type is %s.rg
addr
z"add default rules accept %s in %s.z+%s -t %s -A %s -s %s -p tcp -j ACCEPT -w %s
delz+%s -t %s -D %s -s %s -p tcp -j ACCEPT -w %sro
src_ipr[
ipnet_default_rules_chain
300c
zNset connect limit chain. opt: %s, port: %s, limit number:%s, ipnet type is %s.rg
&%s -t %s -nvL %s -w %s | grep -w '%s' Fr
zN%s -t %s -nvL %s --line-numbers -w %s | grep -w '%s' | awk -F ' ' '{print $1}'z
%s -t %s -D %s %s -w %szR%s -t %s -A %s -p tcp --dport %s -m connlimit --connlimit-above %s -j REJECT -w %sr
getzFiptables -t %s -nvL %s -w %s | grep -w '%s' | awk -F ' ' '{print $15}'z$script run success. connect_limit=%sro
port
	limit_numr[
ipnet_connect_limit_chain
zEset database chain. opt: %s, port: %s, dockerip:%s, ipnet type is %s.rg
zb%s -t %s -A %s -m conntrack --ctstate NEW --ctorigsrc 127.0.0.1 --ctorigdstport %s -j RETURN -w %szJ%s -t %s -A %s -m conntrack --ctstate NEW --ctorigdstport %s -j DROP -w %sr
z\%s -t %s -I %s -m conntrack --ctstate NEW  --ctorigsrc %s --ctorigdstport %s -j RETURN -w %sr
z\%s -t %s -D %s -m conntrack --ctstate NEW  --ctorigsrc %s --ctorigdstport %s -j RETURN -w %sT
dockeripr[
ipnet_database_chain
z;set reject port chain. opt: %s, port: %s, ipnet type is %s.rg
z0%s -t %s -A %s -p tcp --dport %s -j REJECT -w %sr
z0%s -t %s -D %s -p tcp --dport %s -j REJECT -w %sro
ipnet_reject_port_chain
z>set docker nat chain. opt: %s, dockerip: %s, ipnet type is %s.rg
z5%s -t %s -A %s -s %s ! -o docker0 -j MASQUERADE -w %sr
z5%s -t %s -D %s -s %s ! -o docker0 -j MASQUERADE -w %sro
ipnet_docker_nat_chain>
z4handle port config chain. opt: %s, ipnet type is %s.rg
)	rf
ipnet_port_config_chain`
z9handle port harden drop chain. opt: %s, ipnet type is %s.rg
z'%s -t %s -nvL %s -w %s | grep -w 'DROP'Fr
%s -t %s -A %s -j DROP -w %sr
ipnet_port_harden_drop_chainv
|	t	|
z4handle port harden chain. opt: %s, ipnet type is %s.rg
ipnet_port_harden_chain
rHd	}
]@}	t
%s:%s
enabler
disabler
zbset host port chain. default chain : %s, opt: %s, start port: %s, end port : %s, ipnet type is %s.rg
z<%s -t %s -nvL %s -w %s | grep -w 'sports %s' | grep -w 'tcp'Fr
z9%s -t %s -D %s -m multiport -p tcp --sport %s -j %s -w %sz<%s -t %s -nvL %s -w %s | grep -w 'sports %s' | grep -w 'udp'z9%s -t %s -D %s -m multiport -p udp --sport %s -j %s -w %sr
z9%s -t %s -A %s -m multiport -p tcp --sport %s -j %s -w %sz9%s -t %s -A %s -m multiport -p udp --sport %s -j %s -w %sr
start_port
end_port
statusr
default_chainsra
port_rangeZ
port_statusr`
ipnet_host_port_chain
j	d	d
j	d	d
j	d	d
j	d	d
keys)
z)choose_chain_function.<locals>.<listcomp>zJArgs opt : %s, chain : %s ,type : %s is invalid. Please check chain in %s.r
allzZArgs opt : %s, chain : %s, type : %s, src_ip : %s is invalid. Args src_ip or type is None.rZ
z]Args opt : %s, chain : %s, port : %s, limit_num : %s, type : %s is invalid. Args port is Noner
Args opt : %s, chain : %s, port : %s, dockerip : %s, type : %s is invalid. Args src_ip or dockerip is None, type need select ["ipv4", "ipv6"]r
zIArgs opt : %s, chain : %s, port : %s, type : %s is invalid. Port is None.zSArgs opt : %s, chain : %s, port : %s, type : %s is invalid. Port is not allow (%s).r
Args opt : %s, chain : %s, dockerip : %s, type : %s is invalid. Args dockerip is None or type must need select ["ipv4", "ipv6"].r
zwArgs opt : %s, chain : %s, start_port : %s, end_port : %s, status : %s is invalid. Args start_port or end_port is None.)
filter_table_INPUT_chain_level
!nat_table_POSTROUTING_chain_level
filter_table_OUTPUT_chain_level
 filter_table_FORWARD_chain_level
list
setr
INVALID_ARGSr
typer
reject_port_listr
argsZ
chain_listr
choose_chain_function
d$d%g
d&d'
t	d,|
t	d0|
)1NZ
util_iptables_function)
descriptionz
--optT)
upgrade
save
restorez;The operation type, please select add/del/get/save/restore.)
required
choicesr
helpz
--chainz
The function chain)
--portz
The port numberz
--limit_numr
z6The connect limit number. Default limit number is 300.)
defaultr
--src_ipz
The source ip of messagesz
--dockeripz
The source ip of docker serverz
--ipnet_configz
Temp iptables config filez
--ip6net_configz
Temp ip6tables config filez
--typer
z5use ipv4 or ipv6, default handles both ipv4 and ipv6.)
--start_portz
The start port of host portz
--end_portz
The end port of host portz
--statusr
The status of host port)
z&Args opt : get, chain : %s is invalid.r
Args opt : %s is invalid.)
argparse
ArgumentParser
add_argumentr.
parse_argsr
ipnet_configr
ip6net_configr
argv
parserr
all args: %sr
script run failed: %sz
script run success)
LOG_FILEr
LOCKFILE
fcntlZ
flockZ
LOCK_EXr
Z	lock_filer
main
__main__)
TNT)
F)LZ
__future__r
	threadingr
hashlib
timer
Z	getLogger
__name__r
version_infor6
filter_table_chain_level_mapr
nat_table_chain_level_mapr
CMD_RUNNING_NOKr
<module>
