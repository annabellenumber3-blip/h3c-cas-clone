# File: liveupdate_ext_commandline.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/util.package/scripts/liveupdate_ext_commandline.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

Z d-d
Z!d.d
Z"d/d
Z$d d!
d#e%d$
d%d&
Z&d'd(
Z'e(d)k
rPe'e
j)d*d
retry)
glob)
parseString)
z0/var/run/libvirt/qemu/liveupdate_ext_commandline)
object
chardev
netdev
vnc)
secretZ
socketZ
ptyZ
tapc
	Exception
	errorcode)
error_codeZ
error_info
liveupdate_ext_commandline.py
raise_error'
open
read)
path
cat,
write
flush
close)
textr
retr
echo0
para1
symbolZ
para2r
comb7
cmdline
split)
args
args_parser
do_parse=
qbqB|
qxt	j
rRt	
Parameter error
falsez
name guest=%s
truez
Domain name not found !
device
mac=r%
Z	spiceportz+Parameters from %s extracted by 'start': %s)
RET_PARAM_ERRORr*
domainr'
CMDARGS_TAG
CMDARGS_KEY
exists
FILE
remover 
logging
warning
RET_OK)	r(
attrs
infoZ
name_is_rightr)
Z	args_name
argr
do_startE
%s not existr$
z)Parameters from %s extracted by 'get': %s)
RET_FILE_NOT_EXISTr
lstrip
stdoutr
do_getw
id=z
id=hostr.
z,Parameters from %s extracted by 'delete': %s)
)	r(
info_parser@
need_remover<
	do_delete
q:|	
qlnLd
 -info network z
: r%
z#Cannot find hotplug net of the %s !z
,fd=\d+z
,vhostfd=\d+
z	vhostfds=
vhostfd=z
Parse vhostfd error f the %s !z
fds=z
fd=z)Parameters from %s extracted by 'add': %s)
replace
list
reversed
stripr#
	RET_ERRORr2
findall
rstriprD
joinr8
info_networkZ
hotplug_netZ
hotplug_net_infoZ
hotplug_net_numr@
net_tmpZ
fdsZ
vhostfdsZ
fds_listZ
vhostfds_list
vhostfdZ
info_tmpr?
el_reZ
arg_rer
do_add
start
delete
addz5The operation to parse or assemble Qemu command line.)
choices
helpr2
z	VM's name)
-cz	--cmdliner$
Qemu command line.)
defaultr^
argparse
ArgumentParser
add_argument
parse_args)
parserr
parse_arguments
z/Return True if we should retry, False otherwisez
Retrying, (%s)T)
exc_info)
isinstancer
	exceptionr
retry_if_error
stop_max_attempt_numberZ
wait_random_minZ
wait_random_maxZ
retry_on_exceptionc
FILEDIR
mkdirr
excr
do_mkdir
liveupdate_ext_commandliner$
Opertation: %sz
Domain: %sz
Input cmd args: %sz
/%srY
Operation parameter errorz
Exit: %d
cas_log_init2Z
cas_log_initre
error
	traceback
format_excrR
exit)
argvr(
main$
__main__r0
N)*rE
subprocessZ
lockfileZ
xml.etree.ElementTreeZ
etreeZ
ElementTreeZ
random
timeZ
retryingr
xml.dom.minidomr
util_common_toolsZ
util_cvk_logr;
__name__rs
<module>
