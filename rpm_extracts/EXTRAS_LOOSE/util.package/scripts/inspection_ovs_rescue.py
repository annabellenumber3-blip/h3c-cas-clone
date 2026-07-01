# File: inspection_ovs_rescue.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/util.package/scripts/inspection_ovs_rescue.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

d!d"
d#d$
Z d%d&
Z!e"d'k
ElementTree)
cas_log_init2
shell
stderr
stdoutZ	close_fdsr
z1failed to execute: %s, out: %s, err: %s, code: %s)
isinstance
split
subprocess
Popen
PIPEZ
communicate
returncode
logging
error)
cmdr
raise_exception
code
inspection_ovs_rescue.py
command_output&
execute_command1
open
read)
pathZ
content
	read_file4
osr"
isfile
remove)
remove_file:
rnz0t
Nz%/var/run/openvswitch/ovs-vswitchd.pidFz
-commandz
/proc/%s/commz
ovs-vswitchdTz
except when read file %sz3ovs-vswitchd running status: %s, pid:%s, command:%s)	r&
strip
	Exceptionr
	exception
info)
OVS_VSWITCHD_PIDFILE
pidZ
commandr
is_ovs_vswitchd_runingA
ovs-vsctl -t 2 br-exists %sT
vswitchr
is_vswitch_existsR
Nz0ovs-vsctl -t 2 --if-exists get interface %s nameT
ifacer
iface_namer
is_iface_existsX
param
item
component-type
component-name
target-namer-
z!failed to resolve the xml request)
fromstring
ERROR_CODE_OK
ERROR_CODE_INVALID_XML_PARM
findall
find
text
appendr+
xml_string
	item_list
rootr.
Z	item_infor
handle_xml_request^
resultr7
catch exception)
getr<
ElementZ
SubElementrB
tostringr*
ERROR_CODE_XML_ERROR)
replyZ
xml_strr7
item_idZ
component_typeZ
component_nameZ
target_namer-
get_result_xmlr
print)
xmlr
handle_output
bridge_ifaceZ
ovs_processr8
begin to rescue item: %s.r;
rescue_bridge_iface
RESCUSE_BRIDGE_IFACE_ID
rescue_ovs_process
RESCUSE_OVS_PROCESS_ID
RESCUSE_PROCESS_CPUUSAGE_ID
intrJ
rescue_item_listr7
Z	item_name
funcrL
result_coder.
network_health_rescue
, z'failed to rescue iface for error param.z-bridge: %s or iface: %s is not exists in ovs.z ovs-ofctl -t 2 mod-port %s %s upTr3
up bridge %s, iface %s, cmd: %szIovs-vsctl -t 2 --bare --if-exists get interface %s admin_state link_statezAstatus of bridge %s, iface %s is: admin_state: %s, link_state: %sZ
warning
RESULT_RESCUE_FAILEDr2
splitlines
RESULT_RESCUE_OK)
targetr-
bridger4
admin_stateZ
link_staterW
Nz7invoke-rc.d openvswitch-switch restart --save-flows=yesz
/tmp/ovs_rescue_save_flowsz
OVS_FLOW_SAVE_FILE_OVERRIDE=%s Tr3
OVS restart log: 
 ====
z!successfully restart openvswitch.z
Failed to restart openvswitch.)
time
sleepr0
restart_cmdZ
save_flow_filer
rescue CAS network.)
descriptionz
--paramz#xml string for items to be rescued.)
type
helpz(Script Execute: inspection_ovs_rescue %s)
argparse
ArgumentParser
add_argumentr
parse_argsrF
argvZ
top_parser
argsr.
main
__main__Z
inspection_ovsrI
FF)(rb
sysr]
Z	xml.etreer
util_cvk_logr
ERROR_CODE_UNKNOWNr?
__name__Z
res_coderf
exitr
<module>
