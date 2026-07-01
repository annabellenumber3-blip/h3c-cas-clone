# File: ntp_check.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/util.package/scripts/ntp_check.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

l	Z	d
/opt/mds/umpg
/etc/ntp.confFTc
shell
stdinZ	close_fds
stderr
stdoutr
Failed to execute cmd: %s :%sz
 < %s 
z#Successful to execute cmd: %s %s:%s)
isinstance
list
split
subprocess
Popen
PIPEZ
communicate
returncode
logging
error
strip
debug)	
cmdr
input_Z
log_errZ
cmd2
ntp_check.py
cmd_execute"
systemctl %s ntpdr
ntp_service_operate1
stopz
ntpdate -u %s
startz
ntpdate -u %s, result: %sz1ntp force sync result, stop:%d, sync:%d, start:%d)
warning)
serverZ
res1Z
res2
errZ
res3r
ntp_sync_forcely4
grep ^server %sz
get, code:%d, out: %s, err: %sz,get_server_from_conf error, code:%d, err: %s
NTP_CONFr
splitlines
decoder
append)
coder
line
	server_ipr
get_server_ip_from_conf?
ntpq -npFz
line doesn't has a '*': %sr
read: Connection refused
startswithr
res_listr
itemsr
ntp_get_server_timesM
.LOCL.i
time offset %sms to %s is shortz#time offset %sms to %s, try to syncz
float
NTPUPDATE_LIMIT_IN_SECONDr
warnr 
server_timesZ
remoteZ
refid
offsetr
try_sync_time`
ntpdate -qs %s
time offset %ss to %s is shortz"time offset %ss to %s, try to sync)
server_ipsr(
failedr
try_sync_time_from_confk
Appc
Nz	/dev/nullz
/var/run/ntp_check.pid
stdin_pathZ
stdout_pathZ
stderr_pathZ
pidfile_pathZ
pidfile_timeout)
selfr
__init__{
App.__init__c
NZ	ntp_checkz
net_check startsz
get, code:%d, list: %s, err: %sr
servers from ntpq -np: %sz
servers from conf: %sZ
restartz
restart service because code=%sr
cas_log_init2r
infor4
time
sleep
INTERVAL
	exception)
server_listr
App.runN)
__name__
__module__
__qualname__r<
__main__)
FNT)
platformZ
util_cvk_logZ
_opt_mds_ump
path
removeZ
runnerr1
DaemonRunnerZ
daemon_runnerZ	do_actionr
<module>
