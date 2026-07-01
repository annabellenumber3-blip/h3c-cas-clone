# File: set_vnc_auth.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/util.package/scripts/set_vnc_auth.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

l	Z	d
Z$d,d
j(d 
j(d!
j(d!
e#e*
Z,e,
e*e+
n"e'e
Z.e.
j(d 
Z0e1e0
e2d$
r,e&
e2d$
r`e#
Z,e,
Z3e3
e%d'
Z3e3
e2d$
n(e'e
e%d(
e2d$
j6d)e5d*d+
Z5[5n
Z5[50
copyfile)
ElementTreez)%(asctime)s - %(levelname)s - %(message)sz
%m/%d/%Y %H:%M:%S %pz
/var/log/vnc_encrypt.log)
filename
level
formatZ
datefmt
DesEncryc
Nzastart check VNC++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++Z
hello678Z
somewher)
info
Des_Key
Des_IV
self
set_vnc_auth.py
__init__#
DesEncry.__init__c
padZ
padmodez
Encrypt passwordz
encrypt data %s)
pyDes
desr
CBCr
	PAD_PKCS5
encryptr
base64Z	b64encode
decode
debug)
EncryptStrZ
pwd_strr
DesEncry.encryptc
Decrypt password)
Z	b64decoder
decryptr
DecryptStrr
DesEncry.decryptN)
__name__
__module__
__qualname__r
Passwd_Createc
passwdr
Passwd_Create.__init__c
create password failed
create password success)
join
randomZ
sample
string
digits
ascii_lettersr'
lenr
pwdr
creat_random_passwd9
z!Passwd_Create.creat_random_passwdc
encrypt_pwdA
Passwd_Create.encrypt_pwdc
get_passwdD
Passwd_Create.get_passwdN)
XMLMetadatac
initJ
XMLMetadata.initc
vnc_passwdmode)
get_data_withvnc
get_data_withoutvnc)
ori_data
dmodeZ
vncmodeZ
rdatar
get_dataM
XMLMetadata.get_datac
closez
vnc_passwdmode>disablez
vnc_passwdmode>%s
metadata_no_changez
vnc_passwdmode>enable
vnc_passwdmode>manual
enablez
replace mode failed)
search
replacer
sub_str
new_datar
XMLMetadata.get_data_withvncc
Nz4<vnc_passwdmode>%s</vnc_passwdmode>
  </privateData>z
</privateData>z
no passswdmode,add new one)
modestrrD
XMLMetadata.get_data_withoutvncN)
Start_authNc
vmuuid)
Start_auth.__init__c
	d	|
private_datar
startr@
manualr>
privatez
%s metadata set metadata enablez
%s metadata need not change)
metadata
libvirt
VIR_DOMAIN_METADATA_ELEMENTr6
VIR_DOMAIN_AFFECT_LIVE
VIR_DOMAIN_AFFECT_CONFIG
setMetadatar
isActive
vm_id
mode
orid
mdata
value
chkdata
flagsr
check_metadatay
Start_auth.check_metadatac
}	|	d
NFTr&
yesz	./devicesz
./graphics
typeZ
port
	proxyPort
autoportz
fromstringZ
XMLDescrL
VIR_DOMAIN_XML_SECURE
find
findallZ
attrib)
isVNC
isPasswdr\
dpxmlZ
devicesZ
ghdevs
devr
get_vnc_info
Start_auth.get_vnc_infoc
qemu:///system
+Failed to open connection to the hypervisorFT
vmuuid %s not existsr&
running
not runningz&domain %s, status: %s, %s set passwordz!vm %s has no vnc devices, skip itz
vmuuid: %s no vmc devicer?
target
args
z:vm %s vnc port: %s ,autoport:%s, proxyPort: %s, passwd: %s
Failed get domain)
open
libvirtErrorr
warning
!ERROR_CODE_LIBVIRTD_CONNECT_FAILD
ERROR_CODE
ValueError
exit
listAllDomainsrF
UUIDString
ERROR_CODE_VM_NOT_EXISTS
errorrR
ERROR_CODE_NO_VNC_DEVICE
	threading
BoundedSemaphore
Thread
updatedevicerH
conn
errstr
	vm_existsZ
rdomsrQ
rstatusrc
vm_autoportZ
vm_vncportZ
vm_proxyPortrd
	semaphore
	update_vm
Start_auth.update_vmc
	d	|
<graphics type='vnc' port='%s' autoport='%s' proxyPort='%s' listen='0.0.0.0' passwd='%s'>
	<listen type='address' address='0.0.0.0'/>
	</graphics>z
/var/tmp/%s.xml
wz5sudo virsh update-device %s --config --live --file %sz.sudo virsh update-device %s --config --file %sT)
stdout
stderr
shellr
vm %s update vncpasswd successz=sudo virsh qemu-monitor-command %s --hmp set_vnc_skipauth offz
vm %s start authmode successz
vm %s start authmode failed: %sz!vm %s update vncpasswd failed: %s)
write
subprocess
Popen
PIPE
communicate
returncoder
	Exceptionr
path
exists
remove)
docZ
vnc_xmlZ
fvnc
retZ
outsZ
errs
outa
erra
Start_auth.updatedevice)
Close_authNc
Close_auth.__init__c
qxq\|
FTri
z+domain %s, status: %s, set metadata disablerJ
z/domain %s, status: %s, metadata need not changerl
disablerp
	stop_authrH
domsrQ
semaphore2r
Close_auth.update_vmc
Nz<sudo virsh qemu-monitor-command %s --hmp set_vnc_skipauth onT
vm %s stop authmode successz
vm %s stop authmode failed: %s)
Close_auth.stop_auth)
Amend_crontaskc
Amend_crontask.initc
/etc/crontab
set_vnc_authTFrH
Restart vnc cron task
stopz
Restar vnc cron task)	rq
	readlinesrA
write_crontask
restart_crondr
cancel_cronstask)
lines
liner
Z	Is_writedr
amend_crontaskn
Amend_crontask.amend_crontaskc
Nz6*/30 * * * *   root  python3 /opt/bin/set_vnc_auth.pycr
Amend_crontask.write_crontaskc
rZqL|
/etc/crontab.newr
/etc/crontab.bak)
rename)
Amend_crontask.cancel_cronstaskc
systemctl restart crondz
checkout crondTr
restart crond success: %sz
restart crond failed: %s)
Amend_crontask.restart_crondN)
vmpasswdZ
vmsr
do_auth
Nz4****************************************************z3no parameter             change all vm vnc passwordz4start                    change password with timer z2stop                     cancel timer set passwordz(manual vmuuid password   set vm password)
printr
usage
__main__
Parameters error
helpr
updatez
FAILED, %sT)
exc_info)
NN)7rL
loggingZ
datetimer~
shutilr
Z	xml.etreer
platform
operatorZ
LOG_FORMATZ
DATE_FORMATZ
basicConfig
DEBUGZ	getLoggerr!
ERROR_CODE_SUCCESSr{
ERROR_CODE_UPDATE_PASSWD_FAILEDr
argv
vm_uuidZ	vm_passwdZ
decdr 
pretr
ctaskr
<module>
