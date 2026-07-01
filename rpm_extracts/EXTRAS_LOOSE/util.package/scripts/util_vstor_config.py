# File: util_vstor_config.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/util.package/scripts/util_vstor_config.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

d d!d"
d#d$d%g
d&d'
d(d)d*d
d+d,
d-d.d*d
d/d,
d0d1d2d3d4
d5d6e
d7d8
!d9e
Z$e 
e$j%d$k
e$j&
e'e$j&
e$j&
e$j)e$j*
Z(e(d
n<e$j%d%k
e$j&
e'e$j&
e$j&e$j,d
e$j,
/etc/init.d/%sz
/opt/mds/etc/cluster.confc
NFzFCurrent host is not CVM, this command must be running on a active CVM!z(service %s status | grep -q "is running"T
shell)
tomcat_service_name
path
isfile
tomcat_file
print
subprocess
check_call
BaseException
logging
error)
is_cvmZ
tomcat_service
util_vstor_config.py
check_cvm_node6
	localhost
root
	1q2w3e@4RZ
vservice
host
user
passwdZ
select IPADDR from TBL_HOSTr
psycopg2
connect
cursor
executeZ
fetchall
append
close
	Exceptionr
hosts
conn
results
retr
get_hosts_from_databaseT
impr
z#select ip from host where deleted=0r
vstor_hostsr)
get_vstor_hostss
ping6 -c 3 -W 1 %s >/dev/nullz
ping -c 3 -W 1 %s >/dev/nullTr
z<The network of hosts %s has problems, can't connect to them.)	Z
is_valid_ipv6r
callr%
lenr
reachable_hostsZ
unreachable_hostsr
ping_hosts
Ping hosts test....z9Hosts: %s can be reachable, and will be setup lich disks.z
Setup lich disks on %s
timeout
/opt/bin/util_vstor_setup.sh -fz%Setup vstor disks on %s successfully.z-Setup vstor disks on %s failed with errno %d.
 There is no host can be reached.)
paramiko
	SSHClient
set_missing_host_key_policy
AutoAddPolicyr"
exec_command
read
channel
recv_exit_statusr&
SSHExceptionr
UTIL_VSTOR_SSH_FAILEDr
UTIL_VSTOR_COMMAND_FAILED)
	host_list
is_forcer,
	ping_hostr
stdin
stdout
stderr
resultr
setup_lich_disk
XCurrent host is not CVM or not Master CVM, this command must be running on a active CVM!Tz#Hosts: %s will setup vstor cluster.z There is no host managed by CVM.z
Setup vstor disks on localhostr7
/opt/bin/util_vstor_setup.shr
UTIL_VSTOR_NOT_CVM_NODEr-
UTIL_VSTOR_NO_HOSTSr
is_allrE
ping_not_hostZ	all_hostsr
setup_cluster
service
vstor
stopr
drop database impz
create database impzKpython /opt/mds/ump/Ump/scripts/initdb.py mysql -u root -p 1q2w3e@4R -d impTr
startr
pycmdr
reset_database&
Hosts: %s can be reachable.r
z /opt/bin/util_vstor_remove.sh -rz /opt/bin/util_vstor_remove.sh -ur4
Stop the lich cluster.z
lich.cluster --stopz#Stop the lich cluster successfully.z+Stop the lich cluster failed with errno %d.z
Stop lich on host %s.z
lich.node --stopz
Stop the lich successfully.z#Stop the lich failed with errno %d.z
Clean up lich disks on %sz'Clean up lich disks on %s successfully.z/Clean up lich disks on %s failed with errno %d.r8
levelZ
clusterr,
remove_lich_diskJ
remove vstor clusterrM
z9There is no host managed by UMP, no necessary to process.r
z)Hosts: %s will remove from vstor cluster.)
debugr
vstor_clusterr
remove_cluster
__main__Z
vstor_configz
vstor.configz
Config tool for vstor cluster.)
prog
description
modeZ
setup
removez"setup or remove the vstor cluster.)
choices
helpz
--all
store_truezfOnly useful in setup mode. If true, the choice will act on all hosts in CVM cluster. Default is false.)
action
defaultr`
--forcezkOnly useful in setup mode. If true, Force to mount the unsed disks without asking yes/no. Default is false.z
-pz	--ip_addr
ip address list)
nargsr`
--levelz
Only useful in remove mode. level=1 means only remove the database; level=2 means remove database and lun-data; level=3 means remove datebase, lun-data and umount all disks. Default is 1.)
typerc
input paremeters: %sz4Setup vstor failed, Please check your configuration.)
T).r
sysr!
argparser
util_cvk_logZ
util_tomcatZ
util_common_toolsZ
UTIL_VSTOR_WRONG_PARAMrN
vstor_filer
__name__Z
cas_log_init2
ArgumentParser
parser
add_argument
ranger
argv
parse_args
argsr]
ip_addrr1
forcer
exitr
<module>
