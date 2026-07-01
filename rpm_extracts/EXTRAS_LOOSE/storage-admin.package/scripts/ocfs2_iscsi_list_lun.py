# File: ocfs2_iscsi_list_lun.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/storage-admin.package/scripts/ocfs2_iscsi_list_lun.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

dTd!d"
Z e!d#k
e"d$d%
j#d&d'
Z$e$j%d(d)d*
e$j%d+d,d-d.d/
e$j%d0d1e&d2d3
e$j%d4d-d5d/
e$j%d6e&d7d3
e$j%d8d9d:d;
e$j%d<d=e&d>d3
(d?e
j)d@d
Z+e'
e+j,Z-e+j.Z/e+j0Z1e1d
e1Z1e+j2Z2e+j3Z3e+j4Z4e+j5d
e+j5Z5e6e-
r|e7e8dA
e=e-
rLe>e-e1e5dB
Z-e/d
e-e2e1e4e5dB
Z?nTe3dCk
dDe@e2
e2dEg
Z2eAd
e-e2e1e5dB
e3dFk
rNe d
e-e1e5dB
e-e/e2e1e4e5dB
Z?nle3dCk
r(e/D
]4ZBdDe@e2
e2dEg
Z2eAeBe-e2e1e5dB
n&e3dFk
rNe/D
ZBe eBe-e1e5dB
rde'
CdHe?
n$e'
CdIe-
eEdJ
FeGdK
source
default
3260c
qrt	|
target
argsr
z!New targets %s with %s logged in.
login_tgtlist
append
	threading
ThreadZ
login_session
range
start
join
logging
debug
BaseException
error)
ip_addrZ	need_listZ
already_list
	transport
	chap_args
port
threadsZ
ret_list
target_info
nloops
ret_set
ocfs2_iscsi_list_lun.py
do_session_login4
Nz!New target %s with %s logged out.r
logout_sessionr
after_listZ
before_listr
do_session_logouta
z]ls /dev/disk/by-path | grep -i ^ip-'%s\|%s' | grep %s-iscsi-%s-lun-[0-9][0-9]*$ | awk {print}z_ls /dev/disk/by-path | grep -i ^ip-'%s\|%s' | grep %s-iscsi | grep -v part[0-9]*$ | awk {print}
shell
udevadm settle 1>/dev/null 2>&1
call udevadm settle return %d
z2Used %d seconds to find luns, total_lun_info is %s
z!We can not find luns from %s : %sr
is_valid_ipv6
convert_ipv6_to_full_format
subprocess
check_output
decode
stripr
callr
warning
time
sleepr
split
lunLock
acquire
g_lun_info
releaser
	traceback
format_exc)
lun_list
lun_info
loop
ip_address_full
retZ
lun_info_last
udevadm_cmd
resultr"
get_lun_info
targetlistr
get_luns_after_login
s~|	
qZt	
/dev/disk/by-path/%sz/sg_readcap %s 2>>/dev/null |grep "Device size:"
z$find iscsi lun %s used %d second(s).z
127.Z
1IETZ
1H3CzMNaa of lun %s is %s, maybe created by tgtd and discovery ip is %s, filter it.rB
naaZ
capacity
storage_protocol
pathZ
name
host)
iserZ
iscsiz:capacity of device %s is zero, filter it, used %d seconds.z
build %s failed.r
get_scsi_id
startswithr7
xmlLockr<
ElementTreeZ
SubElement
g_xml_infoZ
attrib
textr5
lun_pathrE
lun_sizeZ
lun_idZ	info_nodeZ
naa_nodeZ
capacity_noderN
Z	path_nodeZ
lun_nodeZ	host_noder"
add_lun_to_xml
}	~	d
}	~	0
build_xml_from_luns-
}	|	D
/var/lib/iscsi/nodesz
/etc/iscsi/nodesz
Find targets %r, IP %s.Fz
%s/%sz
%s,%s,z
target %s has IP %s.Tz
target %s does not have IP %s.z
ls %s/%s/%s,%s,*/%s 2>/dev/nullr)
cat %sz3target %s default file(%s) is empty. will delete itz	rm -rf %sr
Failed to delete %sz
success to delete %szUiscsiadm --interface %s -m discovery -t st -p %s:%s -o new -o delete 2>/dev/null 1>&2z1Success to rediscovery target %s with %s port %s.z0Failed to rediscovery target %s with %s port %s.z
default file check done.)
osrO
isdir
listdirr
getIpv6FullAddressr
infor2
dirnamer6
format_target_ipr
ip_address
tgtr
NODE_CONFIG_DIR
target_listr
find_ipZ
ip_listZ
dis_iprE
resZ
default_list
fileZ
dir_namerF
return_coder"
check_iscsi_defaultO
zXls -dal /dev/disk/by-path/* | grep -i 'ip\-%s:\|%s:' | grep '\-iscsi\-%s\-lun\-' | wc -lTr)
Lun (%s, %s) is founded.z
Lun (%s, %s) is not founded.Fr
intr4
target_namerD
lun_cntsr"
is_lun_founded
NFTz
Need rescan for LUN(%s, %s))
need_rescanr
need_rescan_lun
Nz'iscsiadm -m session -R 1>/dev/null 2>&1Tr)
z iscsiadm -m session -R return %dr,
rescan_lun
defalutFc
}	|	
}	|	
eiscsiadm -m session -R 2>/dev/null | grep -i \ '%s\|%s', | awk '{print $6}' | awk -F ',' '{print $1}'Tr)
%Already logged in targets %s with %s.r
tiscsiadm --interface %s -m discovery -t st -p %s:%s -o new -o delete 2>/dev/null | grep '%s\|%s' | awk '{print $NF}'
Discovery targets %s with %s.
KNo target was discoveried with %s, retry once by find_target_by_virtual_ip.z%target %s is not discoveried with %s.z.Session login targets %s with %s successfully.z6Session login targets %s with %s failed with errno %d.)
find_target_by_virtual_ipr%
dumprU
loginr
rtnrE
login_listr"
discovery_listr
find_luns_from_targetlist
}	|	
}	|	
zCThere are some sessions login with %s, we login session one by one.z,do session login targets with %s. result: %sz8There is no session login with %s, we login all session.z;iscsiadm --interface %s -m node -p %s:%s -l >/dev/null 2>&1
z/Session login all targets with %s successfully.zaiscsiadm --interface %s -m node -p %s:%s --op update -n node.startup -v automatic >/dev/null 2>&1z+Set targets with %s automatic successfully.zISession login all targets with %s failed, retry once by do_session_login.z7Session login all targets with %s failed with errno %d.zKThere are some sessions login with %s before, we logout session one by one.z@There is no session login with %s before, we logout all session.z<iscsiadm --interface %s  -m node -p %s:%s -u >/dev/null 2>&1z0Session logout all targets with %s successfully.z8Session logout all targets with %s failed with errno %d.) r0
set_decrypt_chap_argsr6
set_chap_argsZ
check_callrg
set_automaticr
find_luns_from_ipE
z9clear chap args failed: do set chap args failed, ret : %szQiscsiadm -I %s -m node -p %s:%s -o update -n node.session.auth.authmethod -v NoneTr)
z>do update node.session.auth.authmethod to None failed, ret: %sz*clear chap config for %s failed, error: %s)
excr#
clear_chap_args
__main__Z
ocfs2z
caslog/storage-adminz
List luns in xml format.)
description
ip address)
helpz
--target
+zDtarget name list, if not specialed, output all luns under ip_address)
nargsr
--interfacer
typer
--chap-argsz$CHAP args include username, passwordz
--set-chapz
only set chap argsz
--login
store_truez
only login, do not logout)
actionr
--portZ	iscsiportz
input parameters: %sr	
ab+rJ
deletez'Find luns from targetlist successfully!z-Find luns from targetlist error, ret_code %d.z
Can't reach to the ip_addr:%sz
<source></source>Z
OCFS2_ISCSI_HOST_UNREACHABLE)
sysrY
fcntl
argparser2
util_cvk_logZ
util_sh_error_code_loaderZ
ocfs2_iscsi_commonZ
sa_iscsi_commonrT
ElementrU
LockrS
__name__Z
cas_log_init3
ArgumentParser
parser
add_argument
strr
argv
parse_argsr
tgtlistZ	interfacer
set_chaprq
isAddrReachable
openZ
ISCSI_LOCKFILEZ
lockfd
lockf
filenoZ
LOCK_EXr0
getAbbreviatedDiscoveryIpv6rF
close
print
exitZ
ocfs2_errorr#
<module>
