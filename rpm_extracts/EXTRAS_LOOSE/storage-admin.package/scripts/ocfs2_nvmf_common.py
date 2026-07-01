# File: ocfs2_nvmf_common.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/storage-admin.package/scripts/ocfs2_nvmf_common.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

ElementTree)
/var/lock/cas_nvme.lockTc
target %s with %s successfully.z0nvme connect -t rdma -n %s -a %s >/dev/null 2>&1z
cmd is %s.T
shellr
z5step3:Login target %s with %s successfully.ret = [%d]z'Login target %s with %s failed.ret=[%d]z-Set target %s with %s automatic successfully.zKLog in target %s with %s failed, retry once by login_session_by_virtual_ip.z Log in target %s with %s failed.Z
OCFS2_NVMF_CONNECT_FAILED
OCFS2_SUCCESS)
logging
warning
subprocess
check_call
info
BaseException
error
ocfs2_error)
targetZ
ip_addrZ
set_automatic
ocfs2_nvmf_common.py
login_nvme_session
%s .z!nvme disconnect -d %s 2>/dev/nullTr
z)step8:nvme disconnect -d %s successfully.z
disconnect -d %s failed.z
nvme disconnect -d %s failed.Z
OCFS2_NVMF_DISCONNECT_FAILEDr
errr
nvme_ctrlorZ
ip_address_fullr
restr
logout_nvme_session9
Tz+/sys/devices/virtual/nvme-fabrics/ctl/nvme*c
split
pathr
<listcomp>V
z#nvmf_get_ns_all.<locals>.<listcomp>z
ctrl_list: %s.z
nvme list-ns /dev/%sr
ns_num_list: %s.z./sys/devices/virtual/nvme-fabrics/ctl/%s/nvme*c
ns_max: %s, path_list: %s.Fg
ns_max: %s not found.z
get all ns: %s.z(get path_list fail: %s, retry times: %d.)
globr
debugr	
check_output
decode
stripr
append
range
time
sleepr
	traceback
format_exc)
looptimeZ
ns_listZ
get_all_ns
resultZ	ctrl_listZ
ns_num_listZ
ctrlr
ns_num
	path_listZ
ns_maxr
nvmf_get_ns_allL
osr	
Z	xml.etreer
util_common_toolsZ
util_sh_error_code_loaderZ
NVME_LOCKFILEr
<module>
