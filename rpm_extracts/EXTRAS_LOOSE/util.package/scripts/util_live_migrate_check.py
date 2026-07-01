# File: util_live_migrate_check.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/util.package/scripts/util_live_migrate_check.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

z /etc/cvk/cpu_feature_filter.confc
qNq"W
rootz
/etc/cvk/user_info.conf
permit_user_sshr
path
exists
open
	readlines
split
strip)
user
line
params
util_live_migrate_check.py
get_ssh_user
Nz_<migrateInfo><result>{0}</result><isAllowed>{1}</isAllowed><message>{2}</message></migrateInfo>)
format)
result
is_allowed
message
xml_infor
create_xml#
src_feature_filter
encode
<lambda>/
z read_whitelist.<locals>.<lambda>
dest_feature_filterc
intel_host_feature_filterc
amd_host_feature_filterc
hygon_host_feature_filterc
Failed to read file %s)
WHITE_LIST_CONFIG
startswithr
update
mapr%
close
	Exception
logging
error
clear)
src_featuresZ
dest_featuresZ
intel_host_featuresZ
amd_host_featuresZ
hygon_host_features
read_whitelist)
shell
stderr
stdoutr
Failed to execute cmd: %s: %sz!Successful to execute cmd: %s: %s)	
subprocess
Popen
PIPEZ
communicate
returncoder0
debug)
cmdstr
cmd_excuteF
uname -rr
failed to get kernel version)
SSH_PARAMETERr?
ERROR_CODE_UNKNOWN
	errorcode)
	remote_ip
cmd_liner<
kernel_version
get_kernel_versionQ
z4cat /proc/cpuinfo | grep -iw "^flags.*:" | tail -n 1z7cat /proc/cpuinfo | grep -iw "^Features.*:" | tail -n 1r
failed to get cpu flagsr
findr@
bytes
decode
index)
archrC
Z	cpu_flagsrE
get_cpu_flags`
rbqR|
Nz python3 /opt/bin/get-sysinfo.pycr
failed to get cpu sysinfoZ
cpu_infoZ	cpu_model
cpu_archZ
cpu_model_name
model_name
cpu_vendor)
fromstring
tagZ
attrib
get)	rC
cpu_sysinforD
childr
get_cpu_sysinfoq
z$Missing some host system information)
zALive migration is not allowed between different cpu architecturesZ
aarch64z
4.14z
5.10)
znLive migration is allowed,in aarch64 architecture src_kernel:4.14 dst_kernel:5.10, src flags is subset of destz?Live migration is allowed,in aarch64 architecture model_name:%szULive migration is allowed after cpu flag filter,in aarch64 architecture model_name:%sz6Live migration has risk,cpu flags has a difference %s 
zsLive migration is not allowed between different vendor,in x86 architecture source_vendor_name:%s dst_vendor_name:%sZ
GenuineIntelZ
AuthenticAMDZ
HygonGenuinezrLive migration is allowed between same vendor and cpu_flags or subset cpu_flags,in x86 architecture vendor_name:%szSLive migration is allowed after cpu flags filter,in x86 architecture vendor_name:%s)
z+source_cpu_arch--%s  or some error occurredz
check live migrate res. %s)
lenr/
issubset
list
appendrK
joinr&
info)
source_cpu_sysinfoZ
source_cpu_archZ
source_model_nameZ
source_cpu_vendorZ
source_cpu_flagsZ
source_kernel_versionZ
dst_cpu_sysinfoZ
dst_cpu_archZ
dst_model_nameZ
dst_cpu_vendorZ
dst_cpu_flagsZ
dst_kernel_versionr
Z	arch_inforF
resZ
src_flags_after_filterZ
dest_flags_after_filterZ
diff_cpu_flagsZ
flgZ
diff_cpu_flags_after_filterr
check_cvm_whether_live_migrate
check live migrate error. %sr
	traceback
format_exc
exit)
argvr
main
ssh -q zf@%s -oConnectTimeout=120 -oTCPKeepAlive=yes -oServerAliveInterval=60 -oServerAliveCountMax=3 "sudo %s"
__main__Z
live_migrate_check)
N)"r9
xml.etree.ElementTreeZ
etreeZ
ElementTreerS
util_cvk_logZ
ERROR_CODE_OKrA
SSH_USERr@
__name__Z
cas_log_init2
printrf
<module>
