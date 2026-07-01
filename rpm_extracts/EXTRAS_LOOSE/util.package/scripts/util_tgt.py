# File: util_tgt.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/util.package/scripts/util_tgt.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

l	Z	d
Z!d!d"
Z"d#d$
Z#dfd%d&
Z$dgd'd(
Z%d)d*
Z&dhd+d,
Z'did-d.
Z(djd/d0
Z)d1d2
Z*d3d4
Z+d5d6
Z,e-d7k
e.d8
j/d9d:
Z0e0j1d;g
d=d>
e0j1d?d@dAdBdC
e0j1dDdEdFdGdC
e0j1dHdIdJe2dKdL
e0j1dMdNdOd
e0j1dQdRdOd
e0j1dSdTdOd
e0j1dUdVdWdXg
dYdZ
4d[e
j5d\d
Z7e3
e7j8d]k
rfe'e7j9e7j:e7j;e7j<
Z=e=e
>d^e7j9
e(e7j9d_
e7j8d`k
e(e7j9e7j?
Z=nne7j8dak
e)e7j9e7j:e7j;e7j<e7j@
Z=nFe7j8dbk
e*e7j9
Z=n.e7j8dck
e+e7j9e7jA
e7j8ddk
/etc/tgt/targets.confz
.baki
/etc/init/tgt.confc
Nz@netstat -anpt | egrep "0.0.0.0:3260|:::3260" | awk '{print $NF}'T)
shellr
Processes %s is using 3260 portz
Process %s is using 3260 portZ
tgtdz
TGT is runningz Other process using port 3260 %sz/The tgt conf file is not existed, and rebuld itz
description     "tgt daemon"
start on runlevel [2345]
stop on runlevel [!2345]
expect fork
respawn
exec tgtd
z'post-start exec /usr/sbin/tgt-admin -e
service tgt status 2>/dev/nullz$The tgt status before start test: %sz
stop/waitingz)service tgt start 1>/dev/null 2>/dev/nullz#The tgt status after start test: %sz
Start tgt service again failed)
subprocess
check_output
strip
logging
debug
split
find
error
UTIL_TGT_CONFIGURE_FAILED
BaseException
path
exists
TGT_CONF_FILE
open
write
close
check_call)
Z	port_statZ
port_processesZ
process
efiZ
tgt_conf_objZ
tgt_statusZ
tgtconf
util_tgt.py
 tgt_inconsist_with_other_processA
<target %s>z"target %s exist in configure file.T)	r
cfg_filer
startswithr
name
isfound
liner#
is_target_exist
qzq.W
	tgt-admin
--showr
^Target [0-9]+: %s$
tid of target %s is %d)
match
string
atoir
)	r+
data
	data_list
mstrr/
lstrZ
tid_strr#
get_tid_by_targetname
}	~	n
}	~	0
NFr2
IP Address: r5
LUN information:z$connected session of target %s is %s)
appendr
list
setr
connr-
	conn_listr=
addrr#
is_session_connect
NFr'
initiator-addressr5
	</target>z
original acl of target %s is %s)
acl_listr-
ip_ranger#
get_target_acl
qdqlqdn
allz
remove all acl of target %sz
final acl of target %s is %s)
remover
)	r+
add_listZ
remove_list
org_list
result
set_listrN
orgr#
merge_acl_list
ALLr6
z"remove acl %s from %s of target %s)
countrB
removed_listrO
all_listrR
get_removed_aclC
]*}	t
z-target %s has no session, allow to remove acl
z4session at %s is apply to set acl %s, do not care itz4convert %d to addr %s, but it is not at conn_list %sFz!allow is %s, forbidden_list is %s)
socketZ
ntohl
struct
unpackZ	inet_atonrB
powrC
Z	inet_ntoa
packZ
htonlrU
infor
allowZ
except_list
forbidden_listrP
is_connrF
conn_num_listrE
numZ
remZ	base_addr
mask
base
offsetrG
is_allow_remove_acle
)	Nr
  <target name=%s>
z"    <lun num=%d path=%s size=%sG>
    <acl ip=%s>
  </target>
target_listr+
lun_listrK
retZ
aclr#
append_target
pathline
format
strr
get_path
file %s already existz
dir: %s not exist, make it
truncate
	fallocate
-lz"fallocate %s failed, dynamic is %dr
UTIL_TGT_PATH_EXIST
dirname
isdirr
makedirsr
CalledProcessErrorrN
UTIL_TGT_ALLOCATE_FAILEDr
size
dynamicru
allocate_file
getsize
gigabyter
file
size_GZ
size_Br#
get_filesize
zOTGT service status error, may be inconsistenct with other process for 3260 usedz
add target: %s
parameter must not be NoneT)
z*target %s already exist in configure file.z
<target %s>
    <backing-store %s>
        scsi_id H3C%s
    </backing-store>
</target>
service
reload)
UTIL_TGT_INVALID_PARAMETERr0
UTIL_TGT_TARGET_EXISTr|
fcntl
flock
LOCK_EXr 
uuidZ
uuid1
LOCK_UNr!
IOErrorr
port_checkrh
add_target%
}	d	}
remove target: %sz2target %s does not exist, not necessary to remove!r
z$not permitted, target %s has session
, r'
^<?backing-storer(
remove files %s
file: %s not existr
warningrH
join
print
UTIL_TGT_SESSION_EXISTr
bak_filer
shutil
copyr
isfilerN
OSErrorr
forcerP
conn_str
fp_org
fp_bakZ
isproc
	path_listr?
remove_target`
modify target: %sr
target %s not exist!r
z!file size must be larger than %dGro
-ors
UTIL_TGT_TARGET_NOT_EXISTr
UTIL_TGT_PATH_NOT_EXISTrN
UTIL_TGT_SMALL_FILE_SIZEr
)	r+
updaterh
org_sizeZ
incr#
modify_target
chap target: %s, not supportedr
chap_target
}	|	
r(|	
s2|	
configure target: %s aclr
    initiator-address %s
UTIL_TGT_REMOVE_ACL_FAILEDr
forbidden_strr
ip_addrr#
access_target
show targets informationr
<targets>
Targetr6
: rA
Account information:z
ACL information:z
LUN:r7
Backing store path:z
Not supportedz
</targets>
UTIL_TGT_SHOW_INFO_FAILEDr
islunZ
ischapZ
isaclrg
target_nameZ
lun_numrh
xml_listr=
num_strr
luninfor#
xml_strr$
show_targetsI
__main__r
z*Process of tgt, include add, remove, show.)
description
mode)
show
modify
chapri
operation mode on tgt)
choices
helpz
--target
targetz
name of target)
destr
--backing-sroter
path of backing-sroterp
--sizery
z'disk image size in 'G'(gigabyte, 1024M))
typer
-dz	--dynamic
store_true)
action
defaultz
--updatez
--forcez
--access
access control list)
nargsr
input paremeters: %sr6
add target %s failed, remove itTrN
FF)Cr
sysr8
argparser
util_cvk_logr
__name__Z
cas_log_init2
ArgumentParser
parser
add_argument
intr
argv
parse_args
argsr
access
exitr$
<module>
