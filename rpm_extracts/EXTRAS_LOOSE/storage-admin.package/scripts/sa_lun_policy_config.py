# File: sa_lun_policy_config.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/storage-admin.package/scripts/sa_lun_policy_config.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

ElementTree)
Nz)	 Set/Get lun multipath policy infomationZ
DESCRIPTIONz
	 -h Help and usagez
	 -c naa model: 1/2/3/4/5z
	 -m naa)
print
sa_lun_policy_config.py
usage
}	~	n
}	~	0
multipathd -k'list config'Z
multipathsz"lun-%s multipath policy is defaultZ	multipathZ
wwidz%Success to find lun_naa_section is %s
path_grouping_policy
failbackZ
failoverZ	immediateZ
multibusZ
group_by_prioz*multipath lun naa %s sa_lun_policy_mode %sz8Fail to get lun-%s multipath policy, use default policy.)
MULTIPATH_DEFAULT_POLICY
util_cmds_outputZ
format_configZ
get_unique_element
logging
infoZ
get_specified_element
debugZ
MULTIPATH_FIXED_POLICYZ
MULTIPATH_MRU_POLICYZ
MULTIPATH_MULT_POLICYZ
MULTIPATH_OPTIMAL_POLICY
	Exception
error)
lun_naaZ
sa_lun_policy_mode
linesZ
configZ
luns_sectionZ
lun_naa_sectionr
sa_lun_policy_get.
nvme list-subsys 2>/dev/nullT
shellr
z!nvme list-subsys output is empty.z
nvme list-subsys output: %s
NQN=
rdma traddr
subprocess
check_output
decode
lenr
strip
split)	Z
nqnZ
ctrl_nqn_ip_dict
cmdLineZ	nvme_info
lineZ
templine
ctrlr
get_ctrl_nqn_ip_dictS
}	|	d
d d!
rNd"|
d,|%_
}&~&n
}&~&0
policyz
/sbin/multipath -ll %s | egrep 'status|sd[a-z]{1,3}[[:space:]]|nvme[0-9]{1,3}n[0-9]{1,3}[[:space:]]' |             tr -cd [a-z][0-9][===][=:=][:space:] 2>/dev/nullz!multipath -ll %s output is empty.r
zn\d{1,3}\:\d{1,3}\:\d{1,3}\:\d{1,3}\s+(?:sd[a-z]{1,3}|nvme[0-9]{1,3}n[0-9]{1,3})\s+\d{1,3}:\d{1,3}\s+[a-z]{5,6}z
failed to get lun %s paths.z
lun naa %s all paths infos %szCstatus=active|status=enabled|sd[a-z]{1,3}|nvme[0-9]{1,3}n[0-9]{1,3}z
failed to get lun %s status.z
lun naa %s group status %s
status=active
status=enabledZ
failedz
status of path %s failed
\s+r
path
namez
/dev/%sZ
nvmez
nvme[0-9]{1,3}r
z'failed to get target of nvme device %s.z#failed to get ip of nvme device %s.zVls -al /dev/disk/by-path/ 2>/dev/null | grep '%s$' 2>/dev/null | awk '{print $(NF-2)}'Tr
-lun-z
ip-z
-iscsi-
target
lunid
status
ipaddr
selectr
z>failed to get multipath infos for storage adapters display: %s)
ElementZ
SubElement
textr
strr
dump
join
compile
findallr
match
groupr%
getr
rsplitr
	traceback
format_exc)'r
poltextr"
mpath_infosZ
mpath_infos_strZ
disk_regZ
all_disks_infosZ
status_regZ
disks_statusZ
beginZ
active_group_disksZ
diskZ
isactiver#
indiskZ
nvme_ctrl_nqn_ip_dictZ
onediskZ
ip_strZ
firstselectZ
onedisk_arrZ
status_strr,
lun_strZ
tstr
portZ
tdiskr0
excr
sa_lun_policy_info_xmlw
__main__Z
caslog/storage-adminr
-cFZ
SA_MULTIPATH_CONF)
osr:
Z	xml.etreer
util_cvk_logZ
util_common_toolsZ
ocfs2_multipathZ
util_sh_error_code_loaderr
__name__r
argvZ
arcZ
cas_log_init3r
modeZ
set_multipath_policy
exitZ
sa_errorr
<module>
