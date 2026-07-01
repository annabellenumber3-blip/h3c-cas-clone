# File: ocfs2_multipath.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/storage-admin.package/scripts/ocfs2_multipath.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

d!d"
d#d$
d%d&
d'd(
Z d)d*
Z!d+d,
Z"d-d.
Z#d/d0
Z$d1d2
Z%d3d4
Z&d5d6
Z'd7d8
Z(d9d:
Z)d;d<
Z*d=d>
Z+d?d@
Z,dAdB
Z-dCdD
Z.dEdF
Z/dGdH
Z0dIdJ
Z1dKdL
Z2dMdN
ElementTree)
/var/lock/cas_mpath.lockz
/etc/multipath.confz
/etc/multipath.conf.bakz
/etc/multipath.conf.tmp)
path_grouping_policy
prio
failbackZ
failoverZ
manual)
	immediater
multibus
group_by_prioZ
alua)
defaultsr
	verbosityZ
polling_intervalZ
max_polling_intervalZ
reassign_mapsZ
multipath_dirZ
path_selectorr
uid_attributeZ
getuid_calloutr
Z	prio_args
features
path_checkerZ
checkerZ
alias_prefixr
Z	rr_min_ioZ
rr_min_io_rq
max_fdsZ	rr_weight
no_path_retryZ
queue_without_daemonZ
checker_timeoutZ
pg_timeoutZ
flush_on_last_delZ
user_friendly_names
mode
gidZ
fast_io_fail_tmoZ
dev_loss_tmoZ
bindings_fileZ
wwids_fileZ
log_checker_errZ
reservation_keyZ
retain_attached_hw_handlerZ
detect_prioZ
force_syncZ
strict_timingZ
deferred_removeZ
config_dirZ
san_path_err_thresholdZ
san_path_err_forget_rateZ
san_path_err_recovery_timeZ
find_multipathsZ
uxsock_timeoutZ
retrigger_triesZ
retrigger_delayZ
missing_uev_wait_timeoutZ
skip_kpartxZ
disable_changed_wwidsZ
remove_retriesZ
max_sectors_kb
	blacklistZ
devnode
wwid
propertyZ
deviceZ
vendor
product
blacklist_exceptions
devicesZ
revisionZ
product_blacklistZ
hardware_handler
multipaths
	multipath
aliasz
Failed to init keywordsz
Succeed to init keywords)
register_section_keyword
register_attribute_keyword
BaseException
logging
error
info)
keywords
sub_keywords
ocfs2_multipath.py
init_keywords<
z!Failed to init section keyword %s)
keywordr,
z#Failed to init attribute keyword %s)
appendr'
Nz0Succeed to add a unique element %s with value %rz/Failed to add a unique element %s with value %r
debugr'
name
section
valuer-
add_unique_element
Nz)Succeed to add a element %s with value %rz(Failed to add a element %s with value %rr3
add_multi_element5
create_empty_sectionM
(ID_SCSI|ID_WWN)r
turr
constr
maxr
Failed to init a default configz Succeed to init a default config)
blacklist_sectionZ
blacklist_exceptions_sectionZ
defaults_section
root_sectionr-
init_default_config\
Failed to read a config file %sz Succeed to read a config file %s)
open
	readlines
close
format_configr'
configFile
linesr>
read_config_file
Nz'Failed to format config to root sectionz(Succeed to format config to root section)
iter
format_sectionr'
configr+
z)keyword %s maybe not supported, ignore itT
^"|"$
next
strip
split
startswith
endswithr2
find
join
StopIterationr'
ignore
lineZ
countersr,
sub_section
startr8
Succeed to write config file %sz
Failed to write config file %s)
write_sectionrC
keyr-
write_config_file
%s%s {
    z
Succeed to write section %sz
Failed to write section %s)
write
is_sectionrc
write_attributer(
	valueList
paddingr7
elementr8
%s%s %s
Failed to write attribute %s)
isdigitrf
NTF)
type
dictr'
Z	valuelistr8
%s is not exist in this sectionz"Failed to get %s from this sectionz#Succeed to get %s from this section
elementlistr-
get_multi_elementv
z)Failed to get unique %s from this sectionz*Succeed to get unique %s from this sectionr
get_unique_element
q~qF|
%key %s from this section %s is empty.TrR
6Succeed to find a matched element with key %s value %r
9Failed to get specified key %s from this section with %r 
5Failed to find a matched element with key %s value %r
warningr\
matchr4
foundrd
patternr-
get_specified_element
%s do not equal value %sFz.Succeed to find a element with key %s value %rrw
z-Failed to find a element with key %s value %r)	rs
get_exact_element
%s do not match pattern %sFrv
get_reverse_specified_element
Nz"Succeed to remove whole element %sz
Element %s is not existz!Failed to remove whole element %srp
remove_whole_element!
Nz*Succeed to remove element %s with value %rz%Element %s with value %r is not existz$Failed to remove element %s value %r)
remover(
remove_specified_element:
Nz8Failed to parse xml string, can not find node: multipathz
Failed to convert xml to a dicz
Succeed to convert xml to %r)	
fromstringr(
list
text
	Exceptionr4
xmlStrZ
policyZ
multipathElementZ
optionlist
optionr-
xml_to_dicR
Failed to convert dic to a xmlz
Succeed to convert %r to %s)	r
Elementr
tostringr
dicrK
tempElementr
dic_to_xmlt
Nz=ls -al /dev/disk/by-path | grep -w %s | grep '\-fc\-' | wc -lr
z'get_device_type(%s), device type is fc.
fcz@ls -al /dev/disk/by-path | grep -w %s | grep '\-iscsi\-' | wc -lz*get_device_type(%s), device type is iscsi.
iscsiz)get_device_type(%s), unknown device type.Z
unknown_dev_type)
util_cmds_output
intr(
outputZ
numr.
get_device_type
NzCls -al /dev/disk/by-path | grep sd[a-z]* | awk -F '/' '{print $NF}'z%/lib/udev/scsi_id --whitelist /dev/%sr
z.get_devices_by_naa > naa=%s related_devices=%s)
naaZ
related_devicesr
all_devicesr
dev_naar.
get_devices_by_naa
z2(echo 1 > /sys/block/%s/device/delete) 1>/dev/null
shellz9Clean device residual: delete device(%s) for %s, ret = %sz"iscsiadm -m session -R 1>/dev/nullz iscsiadm -m session -R, ret = %sz'/opt/bin/fc_san_hba_scan.sh 1>/dev/nullz%/opt/bin/fc_san_hba_scan.sh, ret = %sr
z0multipathd -T 10000 discover newpath 1>/dev/nullz.multipathd -T 10000 discover newpath, ret = %s
multipathd add map %sr
okz+add map(%s) failed after clean up residual.z1add map(%s) successfully after clean up residual.)
subprocess
callr(
time
sleepr4
have_iscsiZ
have_fcr!
dev_type
retr
&setup_multipath_after_cleanup_residual
]T}	t
d	|	
]T}	t
j!d d
j!d!d
t$d#
t$d#
t$d$
)%NFz
ab+r 
z4Failed to find blacklist_exceptions from %s init it.r"
z2Failed to find multipaths_section from %s init it.r
multipathd add elist %sTr
add elist(%s) failed.z
add elist(%s) successfully.z$multipathd -T 10000 discover newpathz
discover new paths failed.z discover new paths successfully.r
add map(%s) failed.z
add map(%s) successfully.r#
multipathd del mappath %sz
del mappath(%s) failed.z
del mappath(%s) successfully.z
multipathd del elist %sz
del elist(%s) failed.z
del elist(%s) successfully.z$wwid_list is %r, old wwid list is %r
write %r to /etc/multipath.confz#multipath.conf did not been changedz
udevadm trigger 1>/dev/null
+service multipath-tools restart 1>/dev/nullz4udevadm trigger, restart multipath service, ret = %dZ
OCFS2_MULTIPATH_CONF_FAILEDZ
OCFS2_SUCCESS)&rA
MPATH_LOCKFILE
fcntlZ
flock
filenoZ
LOCK_EX
path
exists
MULTIPATH_CFGr?
shutil
copy
MULTIPATH_CFG_BAKrH
check_output
decoderU
MULTIPATH_CFG_TMPrC
IOErrorr)
ocfs2_errorr'
single_hbaZ
naa_listZ
lockfd
multipath_keyZ
mpath_restartrK
multipaths_sectionZ
old_wwid_listZ	naa_valuer
multipath_naa_sectionZ	wwid_listr
ser-
multipath_config
s\t	
multipath policy invaild %s,%s.Fr
Failed to found lun %s sectionz
found lun %s section %rr
z#restart multipath service, ret = %sz$Failed to set %s multipath policy %rz%Succeed to set %s multipath policy %r)
MULTIPATH_DEFAULT_POLICY
MULTIPATH_OPTIMAL_POLICYr(
MULTIPATH_POLICY_KEYS
MULTIPATH_POLICYSr
multipath_sectionrd
set_multipath_policy
sysr
Z	xml.etreer
util_sh_error_code_loaderZ
util_common_toolsr
MULTIPATH_MRU_POLICYZ
MULTIPATH_FIXED_POLICYZ
MULTIPATH_MULT_POLICYr
<module>
