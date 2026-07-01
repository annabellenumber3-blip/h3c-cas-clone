# File: openstack_make_config.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/util.package/scripts/openstack_make_config.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

l	Z	d
Z'e'
j)Z*e'
j)Z+e'
Z-e'
j)Z.e
e*e+e.f
Z0e0
1e-e.
nXe*d
j)Z2e'
j)Z3e
Z0e0
1e2e3e-e.
e8e6j9
e6j:f
Z6[6nDd
Z6[60
e8e6
Z6[6n
Z6[60
7d!e8e=
Z=[=n
Z=[=0
ElementTreez)/var/log/caslog/openstack_make_config.logz
/tmp/openstack_make_config.lock)
nbd0Z
nbd1Z
nbd2Z
nbd3Z
nbd4Z
nbd5Z
nbd6Z
nbd7Z
nbd8Z
nbd9Z
nbd10Z
nbd11Z
nbd12Z
nbd13Z
nbd14Z
nbd15
Builderc
_tmpdir)
_filer
self
file
openstack_make_config.py
__init__
Builder.__init__c
path
joinr
dirname
exists
makedirs
_DEFAULT_MODE
open
write)
content
filepathr
	_add_file
Builder._add_filec
itemsr
base64Z	b64decode)
datar
_write_md_files'
Builder._write_md_filesc
NzBExist directory:%s, can not create a directory with the same name!)
	Exception
mkdirr
_make_tmpdir+
Builder._make_tmpdirc
Nz	rm -rf %sT
shell)
subprocess
check_outputr
_clean_tmpdir1
Builder._clean_tmpdirN)
__name__
__module__
__qualname__r
isoBuilderc
superr,
	__class__r
isoBuilder.__init__c
mkisofs -r -V %s -J -l -o %s %sz
mkisofs -r -J -l -o %s %sT
stderr)
STDOUTr(
labelZ
cmdstrr
make_config8
isoBuilder.make_config)
__classcell__r
diskBuilderc
diskBuilder.__init__c
}	n2|
qemu-img create -f qcow2 %s %sMTr0
Fail to lock file,%s.
Failed to lock file!z
/dev/z
/dev/mapper/Z
lsof /dev/r$
qemu-nbd -c %s %sz
nbd_device= %sz
Not find free nbd device!z7fdisk /dev/%s << EOF
kpartx -as /dev/%sZ
swap
mkswap /dev/mapper/%sp1z!mkfs -t %s -n %s /dev/mapper/%sp1z
mkfs -t %s /dev/mapper/%sp1
attach shell_cmd: res=%sz
mount /dev/mapper/%sp1 %sz
mkfs %s)
randomZ
shuffle
	_NBD_DEVSr
_LOCK_FILE
O_WRONLY
O_CREAT
O_NOFOLLOW
_RETRY
fcntl
lockfZ
LOCK_EXZ
LOCK_NB
IOError
logging
info
time
sleepr 
callZ
LOCK_UN
strr
size
formatr
nbd_device
countZ
	shell_cmd
resr
_attach_nbd_deviceG
diskBuilder._attach_nbd_devicec
sync && sleep 1 && umount %sTr0
kpartx -d /dev/%s 2>&1r:
z"sleep 1; qemu-nbd -d /dev/%s  2>&1z
_detach_nbd_device %sz
sync && sleep 1r;
z*Detach shell call error, returncode=%s, %s
/dev/mapper/%sp1z
lsof /dev/%sz
check dev used by. res=%s
sync
qemu-nbd -d /dev/%s  2>&1
detach %s failed)
CalledProcessError
errorrK
returncode
outputr
retryrQ
failed_nbd_pathrS
_detach_nbd_device~
diskBuilder._detach_nbd_devicec
Nz;can't write disk data when disk doesn't have a file system!Fz
nbd_device config:%srU
z$except check %s failed, retry detachTz)device %s detach failed, try to remove itz
dmsetup remove /dev/mapper/%sp1r0
% remove failedrX
need_raise_exceptionrN
cmdZ
diskBuilder.make_config)
__main__r9
FzL%(asctime)s %(filename)s/%(lineno)dL(%(process)d): %(levelname)s:%(message)sz
%Y-%m-%d %H:%M:%S)
filenamerM
datefmt
level
typer
config type=%s file=%s label=%sZ
isoZ
diskrL
config type dose not support!z#Shell call error, returncode=%s, %sz
An error, %sTz
An IOerror, %sz
xmlfile closedz
exit 255
stat
errnoZ
jsonr
Z	xml.etreer
S_IRWXU
S_IRWXG
S_IRWXOr
Z	_LOG_NAMEr>
objectr
argvZ
xmlfileZ	config_ok
log_formatZ
log_dateZ
basicConfig
INFOr
readZ
xmlstrZ
fromstring
root
find
textrf
loadsr
builderr4
BaseExceptionrE
close
exitr
<module>
