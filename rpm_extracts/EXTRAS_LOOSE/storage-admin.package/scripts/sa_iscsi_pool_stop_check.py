# File: sa_iscsi_pool_stop_check.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/storage-admin.package/scripts/sa_iscsi_pool_stop_check.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

Z e d
e j!d
Z"e"d
spe#e"
Z'e&d
e&j!d
Z(e)e(
e*e(
e(Z+e+d
r*e#e+
e'j!d
Z,e,d
rle#e,
Z-e.e-e+
Z/e/d
e#e/
Z0e/D
]\Z1e
j2e0e1
d d!
e1e3f
e4e3
e1e3f
Z6[6nFd
Z6[60
Z8[8n
Z8[80
ElementTree)
t	d	
CAS Pool Stop checkT)
description
add_helpz
--poolz!The pool name which to be checked)
required
help
Parameters error
SA_ERROR)
argparse
ArgumentParser
add_argument
parse_args
BaseException
logging
error
exit
sa_error)
args
parserZ
sa_iscsi_pool_stop_check.py
	arg_parse(
__main__Z
caslog/storage-adminz
The input parameters are: %sr
/etc/libvirt/storage/%s.xmlz
Pool %s xml path is %sz9Pool %s xml is not existed and it may be deleted already.Z
SA_SUCCESS
Parse %s failed
typeZ
iscsiFz
Parse %s type is not iscsiz
./source/hostz
./source/device
namez
Parse %s iscsi ip failed
pathz
Parse %s iscsi target failedz Get the pool %s ip %s, target %szTls /dev/disk/by-path/ | grep "ip\-"%s":" | grep "\-iscsi\-"%s"\-lun\-[[:digit:]]\+$"zPPool %s has not any disks, maybe without any session, so can be stopped directlyz-lsof /dev/disk/by-path/%s 2>/dev/null | wc -lT)
shellz!Pool %s disk %s check, and rtn %s
z3Pool %s disk %s is used, so can not stopped, rtn %sz1None of diskes were used, pool %s can be stopped.)9r
string
subprocessr
operatorZ	xml.etreer
util_cvk_logZ
util_sh_error_code_loaderZ
util_common_toolsZ
sa_iscsi_commonr
__name__Z
cas_log_init3r
debug
argvZ
arg_nsr
poolZ	pool_nameZ	pool_filer
existsZ
warning
parseZ
st_xml
findZ	pool_typeZ
attribZ
iscsi_type
strip
source_hostZ
source_devZ
iscsi_ipZ
is_valid_ipv6Z
getIpv6FullAddressZ
iscsi_ip_fullZ
iscsi_targetZ
info_cmdZ
util_cmds_outputZ
disk_info_listZ
used_cmdZ
diskZ
check_outputZ
SystemExitZ
<module>
