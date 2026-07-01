# File: iscsi_mpio_check.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/storage-admin.package/scripts/iscsi_mpio_check.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

Z"e"j#d!d"d#
e"j#d$e$d%d&
e"j#d'd(g
d)d*
e"j#d+d,e%d-d&
e"j#d.d/e%d0d&
'd1e
j(d2d
Z*e&
e*j+d
e.e*j/
e*j0Z0e*j+Z+e*j/Z/e*j1Z2e2d
e2Z2e*j3d
e*j3Z3e
e0e%e+
e/e2e3d4
Z4e4e
rFe&
,d5e0e+f
e2e3d4
Z5e5d
Z4e5d2
Z6e4e
Z6e&
Z7e8d8
e8e6
OCFS2_SUCCESSZ
OCFS2_ERR_WRONG_PARAMZ
OCFS2_ISCSI_DISCOVERYZ
OCFS2_ISCSI_LOGINZ
OCFS2_ISCSI_LOGOUT_FAILEDZ
OCFS2_SCSI_ID_NOT_SAMEZ
OCFS2_ISCSI_HOST_UNREACHABLEZ
OCFS2_DISK_MULTI_PARTSZ
OCFS2_DISK_NOT_EXISTED
UnknownT
default
3260c
Aiscsiadm --interface %s -m node -T %s -p %s:%s -u >/dev/null 2>&1T
shellF)	
new_session
format_target_ip
subprocess
check_call
BaseException
logging
error
iSCSI_LOGOUT_FAILED
MPIO_SUCCESS)
target
	transport
port
iscsi_mpio_check.py
logout_new_session=
z%/lib/udev/scsi_id --whitelisted -u %sTr
z get scsi_id of device %s failed.)
check_output
decode
stripr
	traceback
format_exc)
devicer
scsi_idr
outputr
get_scsi_idW
}	|	
}	|	
}	|	
wiscsiadm --interface %s -m discovery -t st -p %s:%s -o new -o delete 2>/dev/null | grep -w '%s\|%s' | awk '{print $NF}'Tr
Discovery targets %s with %s.r
KNo target was discoveried with %s, retry once by find_target_by_virtual_ip.
Aiscsiadm --interface %s -m node -T %s -p %s:%s -l >/dev/null 2>&1
&Log in target %s with %s successfully.
BLog in target %s with %s successfully, the session already exists.
KLog in target %s with %s failed, retry once by login_session_by_virtual_ip.zDls /dev/disk/by-path | grep -w -i ^ip-'%s\|%s' | grep -v part[0-9]*$
Used %d seconds to find luns %s
/dev/disk/by-path/%sz
-iscsi-
-lun-zciscsiadm -m session -R 2>/dev/null | grep -i '%s\|%s', | awk '{print $6}' | awk -F ',' '{print $1}'z
all session under %s is %sz
used session under %s is %sr
z(the information of naa %s under %s is %s)
is_valid_ipv6
convert_ipv6_to_full_formatr
splitr
debug
warning
find_target_by_virtual_ipr
returncoder
login_session_by_virtual_ip
need_rescan_lun
rescan_lun
time
sleepr$
rsplit
insert
appendr
ip_addrZ
except_listr
lun_info
ip_address_fullZ
used_sessionr
discovery_listr
device_listZ
loopZ
device_list_lastr!
all_sessionr
find_naa_from_ips
t#j$
t#j$
t#j$
d't*
)(NTr%
z[iscsiadm -m session -R 2>/dev/null | grep %s, | awk '{print $NF}' | awk -F ',' '{print $1}'r
1IETzdiscsiadm -m session -R 2>/dev/null | grep -i '%s,\|%s,' | awk '{print $6}' | awk -F ',' '{print $1}'
z.All targets in %s does not include naa %s lun Fz$targets %s in %s does not include %sr2
Ils /dev/disk/by-path | grep -w -i ^ip-'%s\|%s' | grep -w iscsi-%s-lun-%s$r1
z device %s found, used %d secondsr
z%device %s is the first lun, naa is %s
udevadm settle 1>/dev/null 2>&1z
call udevadm settle return %dz
device %s not existz=iscsiadm --interface %s -m node -T %s -p %s:%s -u 2>/dev/nullzeiscsiadm --interface %s -m node -T %s -p %s:%s -o update -n node.startup -v automatic >/dev/null 2>&1z3Update node.startup automatic in target %s with %s.z5session of %s %s already exist, no necessary to loginz
device %s does not exist.z
Can't reach to the ip_addr:%sz
total_lun_info is %s)/r
getAbbreviatedDiscoveryIpv6Z
isAddrReachable
countZ
check_iscsi_defaultr
	first_naa
startswithrF
iSCSI_DISCOVERY_FAILED
need_checkr
ranger>
path
existsr$
DEVICE_PATH_NOT_EXIST
call
iSCSI_LOGIN_FAILED
total_lun_info
ADDR_UNREACHABLEr
initial_targetZ
initial_lunZ	addr_listr
is_first_lunrE
temp_ip_listZ
login_ip_listZ
temp_iprC
targetsZ
target_listZ	used_listrD
lunr
resZ
udevadm_cmd
resultr
check_discovery_and_login
}	|	
}	|	
scsi_id not the same, %s vs %sr)
SCSI_ID_NOT_SAMEr
lun_info_listr
first_lun_inforC
diff_idr
is_same_scsi_id
iscsi_disk_part_check.sh %sTr
z$result of check_disk_partition is %s)
check_disk_partition
__main__Z
caslog/storage-adminz!Validity Checking for iSCSI MPIO.)
descriptionr
target name)
helprY
lun num, must be >= 0)
typerc
	multipath
multipath list, must be >= 1)
nargsr
--interfacer
--portZ	iscsiportz
input parameters: %sr2
z$multipath at least need 1 ip addressr)
z"discovery or login %s-lun%s failedzDscsi_id of devices are not the same, please check your configurationz6No need to do scsi_id check, just output the first naa
 z+disk has partition table, please remove it.z
iscsi mpio check ok)
sysrP
argparser
util_cvk_logZ
sa_iscsi_commonZ
util_sh_error_code_loaderZ
ocfs2_iscsi_list_lunZ
ocfs2_iscsi_commonZ
ocfs2_errorr
INVALID_PARAMETERrM
DISK_HAS_PARTITIONrS
__name__Z
cas_log_init3
ArgumentParser
parser
add_argument
strr
argv
parse_args
argsrY
exitr7
Z	interfacer
print
joinr
<module>
