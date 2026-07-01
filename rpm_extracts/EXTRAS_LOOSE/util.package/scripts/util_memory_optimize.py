# File: util_memory_optimize.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/util.package/scripts/util_memory_optimize.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

Z!e"e
Z%Z&e%d
rje&d
s~e%d
qNe%d
qNe"e
Z%Z&e
*e%e&
z"e-e
Z.e+j/f
2e3e1
Z1[1n
Z1[10
e+e&
e%e&e
Z7e7
2e3e1
Z1[1n
Z1[10
    KSM:
Kernel SamePage Merging
    SWAP:
LINUX
SWAP
    1
qemu
swap
    2
swap
linux
kill
fengqianyong@h3c.comc
GlobalValuesu!
[summary]:
    Nz
/etc/ksmtuned.confc
[summary]:
        N)
STATUS_DICT
print
json
dumps
util_memory_optimize.py
print_status+
GlobalValues.print_statusc
[summary]:
        Args:
            status ([type]): [description]
        Returns:
            [type]: [description]
        N)
update)
statusr
append_status2
GlobalValues.append_status)
__name__
__module__
__qualname__
__doc__
MODULE
ACTION
PARSER
	PARAMETER
KSMTUNED_CONF
APP_LOCK_PID
dictr
classmethodr
	ErrorCodeu
[summary]:
    r
RUN_OK
DO_SHELL_TIMEOUT_ERR
UNKNOWN_ERR
DO_SINGLETION_ERR
SWAP_DISABLE_ERR
SWAP_ENABLE_ERR
SWAP_QUERY_ERR
FORBIDEN_DISABLE_SWAP_IS_BUZY
!FORBIDEN_DISABLE_SWAP_KSM_RUNNING
 FORBIDEN_DISABLE_SWAP_SHARED_MEM
NOT_PRE_CONF_SWAP_PARTITION
KSM_MODIFY_CONFIG_ERR
KSM_ENABLE_KSMTUNED_ERR
KSM_DISABLE_KSMTUNED_ERR
KSM_QUERY_KSMTUNED_ERR
KSM_NOT_SUPPORY_ERR
KSM_SWAPOFF_ERR
ZSWAP_NOT_SUPPORT_ERR
ZSWAP_QUERY_ERR
ZSWAP_PARA_PARSE_ERR
ZSWAP_CONFIG_ERR
ZSWAP_IS_BUSYr
StatusCodeu
[summary]:
    r
SWAP_DISABLE_OK
SWAP_ENABLE_OK
KSM_DISABLE_OK
KSM_ENABLE_OK
KSM_DISABLE_ERR
KSM_ENABLE_ERRr
[summary]:
    Returns:
        [type]: [description]
    
Another instance is running...)
range
open
path
realpath
__file__r
fcntlZ
flockZ
LOCK_EXZ
LOCK_NB
time
sleep
logging
error
exitr
application_instanceh
d/d	d
d!d"
d#d$
d%d&
d'd(
d1d)d*
d+d,
d-d.
MemLimitBaseu_
[summary]:
    N
enable
disable
disable_forcer
[summary]:
        N)
_status_dict
read_value_with_meminfo
	_mem_dict
read_value_with_ksmtuned_conf
	_ksm_dict
_action_para_dict
selfr
__init__
MemLimitBase.__init__c
[summary]:
        Args:
            key ([str]): [description]
        rb
keyr
__getitem__
MemLimitBase.__getitem__Fc
[summary]
shell
        Args:
            cmdstring ([type]): [
            timeout ([type], optional): [
]. Defaults to None.
            close_all_fds ([type]):
subprocess
        Returns:
            [type]: [
        )
secondsT)
shell
stdout
stderr
	close_fdsNg{
Do execute_command {} timeout!.z
Do execute_command {} err {}!.z&Do execute_command {} unknown err {}!.)
datetimeZ
nowZ	timedelta
subprocess
Popen
PIPEZ
pollrX
killr
formatZ
CalledProcessErrorr4
	Exception
returncoderq
read
decode
strip)
Z	cmdstring
timeout
close_all_fds
res_codeZ
end_time
execute_command
MemLimitBase.execute_commandc
)	u~
[summary]:
/proc/meminfo
        Returns:
            [dict]: [description]
        z
/proc/meminforP
modeNr
listrR
	readlines
split
intr
mem_dict
lines
line
key_valuesr
z$MemLimitBase.read_value_with_meminfoc
rZqB|
[summary]:
ksmtuned.conf
        Returns:
            [dict]: [description]:
        N
startswithr
ksm_dictr
z*MemLimitBase.read_value_with_ksmtuned_confc
zu[summary]:The parameter passed in the action is only used by zswap at present
        Args:
        Returns:
        N)
parar
set_action_para
MemLimitBase.set_action_parac
[summary]:
        Args:
            status ([int]): [description] 0 or 1
        Returns:
            [bool]: [description]:
True,
False
        FrP
KSM_STATUSz
KSM_STATUS={}
	enumerater
writelinesrg
indexr
write_ksm_status_to_conf
z%MemLimitBase.write_ksm_status_to_confc
[summary]:
action
        )
_MemLimitBase__methodsr
method
MemLimitBase.methodc
[summary]:
swap
        
	SwapTotalr
swap_is_enable
MemLimitBase.swap_is_enablec
[summary]:
swap
        r
SwapFreer
get_swap_used!
MemLimitBase.get_swap_usedc
[summary]:
        Z
MemFreeZ
BuffersZ
Cachedr
get_free_memory&
MemLimitBase.get_free_memoryc
[summary]:
qemu
        Returns:
            [int]: [description]
        z
        pidlist=$(pgrep -d ' ' -- '^(kvm|:.{1,11})$')
        if [ -n "$pidlist" ]; then
            ps -p "$pidlist" -o rsz=
        fi | awk '{ sum += $1 }; END { print 0+sum }'
        r
findall)
cmdr
get_qemu_process_mem_size+
z&MemLimitBase.get_qemu_process_mem_sizec
[summary]:
swap
        Args:
            action ([int]): [description]: 0 close or 1 open
        Returns:
            return ([int]): [description]:0 Ok, 1 Failed
        r
swapoff -azIsed -i '/^[^#].*\sswap\s/ s/^\(.*\)$/#<<<add by script>>>\1/g' /etc/fstabr
z	swapon -azOsed -i '/^#<<<add by script>>>.*\sswap\s/ s/#<<<add by script>>>//g' /etc/fstab
sync
action
forceZ	post_taskr
modify_swap_immediately<
z$MemLimitBase.modify_swap_immediatelyc
[summary]:
service 
ksmtuned
        Args:
            action ([str]): [description]
        Return:
            return ([tuple]): [description]
(code, msg)
        r
restart
startTFro
which systemctl > /dev/nullr
systemctl {} ksmtuned.service
is-enabled
	is_enable
	is-active
	is_activez
service ksmtuned {})
service_cmdstringr
ksmtuned_ctla
MemLimitBase.ksmtuned_ctlc
[summary]:
        Return:
            return ([int]): [description]:
        r
enabledZ
activeZ
activatingr
conf_is_enabler
ksm_is_enable
MemLimitBase.ksm_is_enablec
[summary]:
        Returns:
            [int]: [description]:
        zOecho $(( $(cat /sys/kernel/mm/ksm/pages_sharing) * $(getconf PAGESIZE) / 1024))r
get_merged_memory_size
z#MemLimitBase.get_merged_memory_sizec
[summary]:
        z
Unrealized function enableN
inforj
MemLimitBase.enablec
z#[summary]:disable by force
        z!Unrealized function disable_forceNr
MemLimitBase.disable_forcec
[summary]:
        force:weather to force shutdown
        z
Unrealized function disableNr
MemLimitBase.disablec
[summary]:
        z
Unrealized function statusNr
MemLimitBase.statusc
[summary]:
        z
Unrealized function resetNr
reset
MemLimitBase.reset)
_MemLimitBase__instancer
staticmethodr
MemLimitSwapu'
[summary]:
    c
[summary]:
        N)
superr
_old_statusrj
	__class__r
MemLimitSwap.__init__c
[summary]:
        z Try reset module swap status....r
z!Reset module swap status failed!.z$Reset module swap status successful.N)
warningr
MemLimitSwap.resetc
[summary]:
        Returns:
            [int]: [description]:
        z&The swap partition is already enabled.r
Modify fstab failed!.z:The device does not have a pre-configured swap partition!.z$Enabled swap partition successfully.)	r
MemLimitSwap.enablec
z([summary]:disable swap by force
        T
MemLimitSwap.disable_forceFc
[summary]:
        Returns:
            [int]: [description]:
        z
The swap partition is disabled.z,Ksm feature has enable, swap cannot closed!.r
z9Shared memory pages exist size:{}kb, swap cannot closed!.z3The swap partition is in use and cannot be closed!.z
service virtagent stopz$Stop service virtagent successfully.r
service virtagent startz%Start service virtagent successfully.z$Disable swap partition successfully.)
merged_memory_sizeZ
has_used_swapr
MemLimitSwap.disablec
[summary]:
        Returns:
            [int]: [description]:
        r
swap_statusZ	swap_usedZ
swap_totalZ	swap_freeN)
	exceptionr8
status_resr
MemLimitSwap.status)
__classcell__r
MemLimitKSMu*
[summary]:
    c
MemLimitKSM.__init__c
Try reset module ksm status....r
z Reset module ksm status failed!.z#Reset module ksm status successful.N)	rZ
MemLimitKSM.resetc
[summary]:
        Returns:
            [int]: [description]:
        
/sys/kernel/mm/ksm
-The device does not support the KSM feature!.
?Memory swapping is not enabled. Memory merging is not allowed!.r
/Modify KSM state to configuration file failed!.Z
unmaskr
ksmtuned_ctl unmask failed!.rb
ksmtuned_ctl enable failed!.r
ksmtuned_ctl restart failed!.z-Enable KSM memory merge feature successfully.)
existsrZ
MemLimitKSM.enablec
MemLimitKSM.disable_forceFc
[summary]:
        Returns:
            [int]: [description]:
        r
stopr
ksmtuned_ctl stop failed!.rc
ksmtuned_ctl disable failed!.z
echo 0 > /sys/kernel/mm/ksm/runz stop kernel ksmd thread failed!.
maskz
ksmtuned_ctl mask failed!.r
z.Disable KSM memory merge feature successfully.)
MemLimitKSM.disablec
[summary]:
        Returns:
            [int]: [description]:
        Z
HIGH_KSM_SHARED_MEM_COEFZ
MemTotalZ
KSM_THRES_COEFr 
KSM_THRES_CONST)
service_status
max_shared_mem_sizeZ
memtotal
thres
freeZ
page_sharing_mem_sizeZ
qemu_process_mem_sizeN)
MemLimitKSM.status)
MemLimitZswapz$[summary]: Zswap Configuration 
    c
zswap.enabledr
zswap.max_pool_percent)
MemLimitZswap.__init__c
)	z)[summary]:zswap work immediately
        ro
z7echo {} > /sys/module/zswap/parameters/max_pool_percentr
z$zswap config max_pool_percent error!r
z.echo {} > /sys/module/zswap/parameters/enabled
zswap config enabled error!)
keysry
kwargsr
__write_zswap_parameters
z&MemLimitZswap.__write_zswap_parametersc
[summary]:Whether used
        ro
z'/sys/kernel/debug/zswap/pool_total_sizerP
readliner
__zswap_is_used
MemLimitZswap.__zswap_is_usedc
z/[summary]:weather it has  been started
        
zswap_statusr
%_MemLimitZswap__read_zswap_parameters)
__zswap_is_enabled
z MemLimitZswap.__zswap_is_enabledc
zB[summary]:Read parameters from sysfs
        Returns:    
        ro
z$/sys/module/zswap/parameters/enabledrP
z-/sys/module/zswap/parameters/max_pool_percent
zswap_max_pool_percent)
__read_zswap_parameters
z%MemLimitZswap.__read_zswap_parametersc
z9The reset function is not implemented in MemLimitZswap...N)
MemLimitZswap.resetc
[summary]:
        
/sys/module/zswap
/The device does not support the zswap feature!.r
current zswap para:%sr
new zswap para:%sz
kc.setParameter:key:%s,value:%sr
z/Enable zswap memory merge feature successfully.N)
debugr
kernel_cmdline
KernelCmdLine
items
setParameterr
saveGrubCmdline
&_MemLimitZswap__write_zswap_parametersrF
 _MemLimitZswap__zswap_is_enabledr{
Z	zswap_dic
MemLimitZswap.enablec
MemLimitZswap.disable_forceFc
[summary]
        r
The device is in used!r
z#Disable zswap feature successfully.N)
_MemLimitZswap__zswap_is_usedrG
MemLimitZswap.disablec
[summary]:check status
        N)	r
MemLimitZswap.status)
swap
zswapc
[summary]:
    z
memory limit script)
descriptionz
--module
help
nargs
typez
--actionz
--parameterz
Parameters required for actionsNz%Please enter the correct parameters!.)
argparse
ArgumentParserr
add_argument
joinr
MemoryLimitMappingr
parse_args
moduler
print_helprZ
Z	parameterr
argsr
cmdline_parser
__main__Z
memory_optimizer
start task with {} {}z"rescode={}, end task with {} {} {}z
OK.z
Failed!.);r\
util_cvk_logr
util_kernel_cmdliner
__author__r
objectr`
cas_log_init2Z
cas_log_initr
module_listZ
action_listZ
has_run_action
zipr
module_Z
action_
insert
appendr
memory_limitr
evalZ
dicr
<module>
