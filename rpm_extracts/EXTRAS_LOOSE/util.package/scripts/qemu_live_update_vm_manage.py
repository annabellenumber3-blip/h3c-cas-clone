# File: qemu_live_update_vm_manage.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/util.package/scripts/qemu_live_update_vm_manage.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

Z&e&e
Z*d=d
Z+d!d"
Z,d#d$
Z-d%d&
Z.d>d'd(
Z/d)d*
Z0d+d,
Z1d-d.
Z2d/d0
Z3d?d1d2
Z4d3d4
Z5d@d5d6
Z6dAd7d8
Z7e6e7d9
Z8d:d;
Z9e:d<k
glob)
parseString)
ThreadPoolExecutor
as_completed)
z'/etc/cvk/.cvm_vm_live_update_failed.xmlz=/var/log/upgrade/qemuliveupdate/cvk_vm_live_update_failed.txtz
/var/log/upgrade/qemuliveupdatez!/var/run/cvm_vm_liveupdate_failedz
/etc/drbd.d/r0.resz
/etc/cvk/cvm_info.confz
ssh -q zc@%s -oConnectTimeout=15 -oTCPKeepAlive=yes -oServerAliveInterval=60 -oServerAliveCountMax=3 sudo %sz_scp -oConnectTimeout=15 -oTCPKeepAlive=yes -oServerAliveInterval=60 -oServerAliveCountMax=3 %s z	@[%s]:%s z
> /dev/null 2>&1c
Shell
shell
Error cmd (%s) msg:%s
join
subprocess
call
	Exception
logging
error
cmd_str
path
result
qemu_live_update_vm_manage.py
execute_rnt2
Shell.execute_rntc
utf-8r
check_output
strip
decoder
execute=
Shell.executeN)
__name__
__module__
__qualname__
staticmethodr 
FileMgrc
_FileMgr__path)
selfr
__init__J
FileMgr.__init__c
UTF-8
encoding
methodz
indentZ
newlr1
tostringr
echor+
toprettyxml)
root
info
outr
save_formatM
FileMgr.save_formatc
saveR
FileMgr.savec
existsr+
parse)
load_formatV
FileMgr.load_formatc
Nz>cat %s | sed '/encoding=/d' | tr -d '
' | sed s/[[:space:]]//g)
fromstring)
load\
FileMgr.loadN)
	errorcode)
error_codeZ
error_info
raise_errore
open
read)
catj
write
flush
close)
textrJ
retr
ElementrP
append)
valuer
xml_add_elementu
remove)
xml_del_element|
Parse out: %s)
findallrS
warning)
para_strrU
value_list
para_parse
Nz5(%s, %s)does not appear to be an IPv4 or IPv6 address)
	ipaddressZ
ip_address
ValueErrorrF
RET_PARAM_ERROR)
ip1Z
ip2Z
ip1_addressZ
ip2_addressr
check_ip_equal
sshzBcha alarm-report 0 %s qemuliveupdatefail %s 1 -ma > /dev/null 2>&1
localz
Parameter error!z!Failed to alarm-report %s to HA !z
HA alarm-report %s success.)
SSH_PARAMETERr
intr
vm_list
mode
HA_alarm
test -e %sz
cat %sr3
rm -f %sz
rm -f %s in CVK(%s) failed !z%Collect VM info from CVK(%s) success.r
z/ssh: connect to host %s: Connection timed out !z-Cannot get %s in CVK(%s) with unknown error !
Error cmd msg:%sz/Cannot get %s in CVK(%s) with Exception error !
z+CVK(%s) VM info is: %s. Command return: %d.)
	RESULT_OKr`
CVM_IPrc
CVKFILErd
splitri
RESULT_FILE_NOT_EXIST
RESULT_SSH_ERRORr
read_cvk_file
qHn2t
cvknoderg
collect_status
successr
domain
fail)
xml_add_node
r\d	|
submitrr
.0rg
executorr
<listcomp>
z collect_info.<locals>.<listcomp>r
modifyrs
add)
findrP
cluster_ip
opr{
all_taskZ
futurer
domainsZ
record_cvknode_vmrh
collect_info
md5sum %s | awk '{print $1}'z"Calculate old file %s md5 failed !)	r=
CVMFILEr
md5r
md5_sum
Nz!/opt/bin/ms_info.sh.x peer hostipz
Get backup cvm ip failed !r8
Scp %s to backup cvm failed !z
Scp %s to backup cvm success.z
/home/r
cvm_vm_live_update_failed.xmlz
sudo mv -f %s %sz
mv %s to %s failed !z
mv %s to %s success.rj
Scp %s to backup cvm Exception.z!No need to sync %s to backup cvm.)
MS_INFOr
ssh_user
SCP_PARAMETERr
old_md5
new_md5Z
slaver
USER_HOME_PATHZ
CVMFILE_TMPr
ms_sync
Nz0cat %s | grep address= | awk -F '=' '{print $2}'z/cat %s | grep cvk_ip= | awk -F '=' '{print $2}'z
Not cvm, operation prohibited !z'/opt/bin/cvm_role_tool.sh.x is_cvm_role
truez%bash /opt/bin/ms_info.sh local hostipz
/opt/bin/ms_info.sh.x roler
z&Non-master cvm, operation prohibited !z
Unknown cvm !z
Cannot get cvm IP !)
CVMINFOr
RET_FAILr
CVK_IPZ
cvm_roler
get_cvm1
|	d	|
Parameter errorrg
max_workersz!Configuration file %s not found !rs
qemu_live_update_infor.
Collect info: %s)
RET_OKr\
file_mgrrB
RET_READ_FILE_ERRORrY
lenrX
printr
input_cluster_ipr{
record_cluster_ipr
need_del_ipZ
recollect_ipZ
new_collect_iprg
do_collectM
}	|	j	|
qjqXqPt
z!%s has been deleted successfully.rg
z1cha alarm-report 0 %s qemuliveupdatefail %s 0 -maz7Confirm the alarm to HA about %s liveupdate is failed !z4Confirm the alarm to HA about %s liveupdate success.rj
zEConfirm the alarm to HA about %s liveupdate have an Exception error !)
getrootrY
input_domainZ
rrootr8
record_cvknoderh
domianrg
	do_delete
collect
deletec
NzIOperate the record file of the VM that failed to execute qemu live update)
descriptionz
--opertationc
<lambda>
main.<locals>.<lambda>)
choicesz
--infoz!detailed infomation in xml format)
helpZ
qemu_live_update_vm_managez
Opertation: %sz	Input: %sz
Exit: %d)
argparse
ArgumentParser
add_argument
sorted
ValidOp
keys
parse_argsZ
cas_log_init2Z
cas_log_initZ
opertationr
lockfileZ
FileLock
LOCALLOCKFILE
acquirer
	traceback
format_excrD
Z	is_locked
release
exit)
argv
parser
args
lockr
main
__main__)
N)<r
xml.etree.ElementTreeZ
etreeZ
ElementTreer5
xml.dom.minidomr
concurrent.futuresr
util_common_toolsZ
util_cvk_logr
LIVEUPDATEDIRr
get_ssh_userr
objectr
<module>
