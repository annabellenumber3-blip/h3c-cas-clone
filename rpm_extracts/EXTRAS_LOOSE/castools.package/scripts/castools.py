# File: castools.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/castools.package/scripts/castools.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

d d!
d"d#e)d$
d%d&
Z+d'd(
Z,d)d*
Z-e.d+k
z8e/e
e1d-
j0d.
2d/d0
j4d1e3d2d3
d.Z5W
Z3[3n
Z3[30
tpool)
ElementTree)
LooseVersion)
retryz
/castools.confz /usr/local/lib/guestfs/applianceZ
LIBGUESTFS_PATHZ
libvirtZ
LIBGUESTFS_BACKENDZ
CastoolsLibguestfsc
d d!
d"d#
d$d%
d&d'
d(d)
d*d+
d,d-
VFSGuestFSz
This class implements a VFS module that uses the libguestfs APIs
    to access the disk image. The disk image is never mapped into
    the host filesystem, thus avoiding any potential for symlink
    attacks from the guest filesystem.
    
Create a new local VFS instance
        :param image: the path of disk image
        :param format: the format of disk image
        :param partition: the partition number of access
        N
guestfsz libguestfs is not installed (%s)F)
disklist
	partition
lenZ	diskcountr
	importlib
import_module
	Exception
handle
mount
hivroot)
self
disksr
castools.py
__init__3
VFSGuestFS.__init__c
z.Determines whether guestfs is well configured.z	/dev/nullz
/boot/vmlinuz-%s
z(Please change permissions on %s to 0x644z(libguestfs installed but not usable (%s)N)
Proxyr
GuestFSZ	add_drive
launchr
uname
access
R_OK)
kernel_filer
inspect_capabilitiesL
VFSGuestFS.inspect_capabilitiesc
call setup_osr
debugr
setup_os_inspect
setup_os_static
setup_os]
VFSGuestFS.setup_osc
Nz(Mount guest OS images partition %(part)s
part
/dev/sda%d
/dev/sda)
strr
mount_optionsr&
VFSGuestFS.setup_os_staticc
Inspecting guest OS imagesz&inspect os check failed, close guestfsz
inspect os failed.r
No operating system found
Multi-boot OS %(roots)s
rootsz
inspect_os %s, len_roots: %d))
inspect_os
logging
infor
warningr+
setup_os_root)
VFSGuestFS.setup_os_inspectc
Nz&Inspecting guest OS root filesystem %sr
z"No mount points found in %(root)s 
rootc
<lambda>
z*VFSGuestFS.setup_os_root.<locals>.<lambda>)
keyFz
Mounting %(dev)s at %(dir)sr-
dirr)
zI"Error mounting %(device)s to %(dir)s in image" "with libguestfs (%(e)s)")
devicer8
inspect_get_mountpointsr
sortr,
ntfs_3g_probeZ
ntfsfix)
mountsZ
root_mountedr
msgr
VFSGuestFS.setup_os_rootc
type
image
formatr
server
configfile
auth
secret
readonly
protocolr@
usernamerC
setup_all_disk: %s
add_drive_optsr"
diskr
setup_all_disk
VFSGuestFS.setup_all_diskc
setup first disk only: %srI
setup_first_disk_only
z VFSGuestFS.setup_first_disk_onlyTc
Setting up appliance F)
python_return_dict
close_on_exitrO
Tz#Error mounting with libguestfs (%s))
	TypeError
sixZ	text_typerL
aug_initr
RuntimeErrorr
error)
Z	multidiskr
setup
VFSGuestFS.setupc
Tearing down appliancez
Failed to sync guest handle %sz
Failed to close augeas %sz
Failed to shutdown appliance %sz
Failed to close guest handle %s)
sync
AttributeErrorrR
Z	aug_closeZ
shutdown
close)
teardown
VFSGuestFS.teardownc
pathr
_canonicalize_path
VFSGuestFS._canonicalize_pathc
Make directory path=%s)
mkdir_p
	make_path
VFSGuestFS.make_pathc
Append file path=%s)
write_append
contentr
append_file
VFSGuestFS.append_filec
Replace file path=%s)
writer]
replace_file"
VFSGuestFS.replace_filec
Read file path=%s)
	read_filer[
VFSGuestFS.read_filec
Has file path=%sTF)
statrR
has_file,
VFSGuestFS.has_filec
Remove file path=%s)
rm_rfr[
remove_file5
VFSGuestFS.remove_filec
Nz+Set permissions path=%(path)s mode=%(mode)s)
mode)
chmod)
set_permissions:
VFSGuestFS.set_permissionsc
Nz9Set ownership path=%(path)s user=%(user)s group=%(group)s)
user
groupr
/files/etc/zSError obtaining uid/gid for %(user)s/%(group)s:  path %(id_path)s not found (%(e)s))
id_pathri
intr
aug_getrR
_get_item_idH
z.VFSGuestFS.set_ownership.<locals>._get_item_idz
passwd/z
/uidz
group/z
/gidz
chown uid=%(uid)d gid=%(gid)s)
gid)
chown)
set_ownership@
VFSGuestFS.set_ownershipc
Nz$/Program Files/CAS tools/qemu-ga.exe
windowsz	CAS toolsZ
Versionz
qga_version not found(%s)z
0.0.0.0z
/usr/sbin/qemu-ga
linuxz
/etc/qemu-ga/VERSION
utf-8z+Not support the OS, or not install castoolsz#Castools(%s) installed, version: %s)
os_type
qga_version)
Z!inspect_get_windows_software_hiver
hivex_openZ
hivex_rootZ
hivex_node_get_childZ
hivex_node_get_valueZ
hivex_value_utf8r
strip
decoder#
softwarer3
castZ
verrw
path_verr
check_castoolsZ
VFSGuestFS.check_castoolsc
Nz)/etc/udev/rules.d/70-persistent-net.rules)
clean_files
filer
clean_imagex
VFSGuestFS.clean_imageN)
__name__
__module__
__qualname__
__doc__r
staticmethodrZ
Intfc
Interface class
        N)
mask
gateway
dns)
Intf.__init__N
Rotc
destination
netmaskr
Rot.__init__Nr
Mtuc
mtusize)
Mtu.__init__Nr
Intfv6c
Interfacev6 class
        N)
prefixr
Intfv6.__init__Nr
Rot6c
Rot6.__init__Nr
ParseXMLc
zLParse XML
        :param xmlstr: the xml string to configure the vm
        r)
./passwordNz
******ru
./name)
diskpath
serversZ
sercretrB
portrA
sub_add_domain
fromstringr3
find
textZ
tostringr"
vmname)
xmlstr
passwordZ
pswd
namer
ParseXML.__init__
stop_max_attempt_number
wait_fixedc
}	|	j
}	|	j
sudo virsh dumpxml %sT
shell
stdoutr
 virsh dumpxml %s error, error:%s
VM name error,%s
./devices/diskr<
check type: %s
network
network RBD
source
driver
format: %srF
protocol: %sr
disk: %srB
username: %srC
uuid
secret: %s
hostr
server:  %s:%s
configr|
configfile: %sr9
Vm %s have no diskz
Get image of %s error)
subprocess
Popen
PIPE
communicate
returncoder
findall
attribr"
ParseErrorrV
proc
outs
errs
treer
conffiler9
	get_image
ParseXML.get_imagec
d#|	d
)+Nr
blockr9
Block devicer7
Get image list of %s errorz!parse image_list: %s, disklen: %d)
rbd_get_secret
rbd_get_server
appendr
image_listr
rbd_dictZ	disk_dictr<
get_image_list
ParseXML.get_image_listc
base64
	b64encode
encode
isinstancer+
Z	secret_inrC
ParseXML.rbd_get_secretc
%s:%sr
ParseXML.rbd_get_serverc
get_RBD_info\
ParseXML.get_RBD_infoc
rTd	|
r0| d
}#|"D
]L}$|$
}(|'D
})|)
}*|)
r8|)
}+|)
|*|+|
}-n&|)
}-|(
}/|.D
]x}0|0
}+|0
d.|2
}2~2n
}2~20
r8|3
q8|	d
d3|	j
d5}4n
r"d6}4|
rl|3
d8|	j
d9|	j
d:|	j
d;d<
rR|3
d?}5|
|5d?k
|5d?7
]&}!|3
dI|!j
r*|#D
] }&|3
dJ|&j
].}-|-j
d;d<
rZd=}+n
}+|3
dK|-j
dB|-j
d?}5|-j
|5d?k
|5d?7
rH|3
dM|-j
q.|/D
]@}1|1j
d;d<
dP|1j
}6d=}7|
}7|6d
}8d=|6_
]8}9|6j
	r\|6
dW|9
dX|9
	q8|
}:|6
dZ|:
	q~|3
};|;D
}<|3
d_|<
rp|3
castools parse xml
        rv
runz
qemu-ga.runZ
runoncez
qemu-ga.runoncez
xmlstr input error, root.tag=%srs
/Program Files/CAS tools/%srt
/etc/%sz
./hostNamez
./no-rebootz
./powerdownz
./userNamer
./localGroupz
./domainz
./workGroupz
./userDataz
./passwdmodez
./interfacez
./nicz
./macz
./actionz
./ipz
./maskNZ
dhcpz
interface errorz	./gatewayz
./dnsz
./routez
./destinationz	./netmaskz
route errorz
./mtuz	./mtusizez	mtu errorz
./interfacev6z
interfacev6 errorz
./prefixz
./modez
./route6z
route6 errorz
Parse xml error (%s)
delz5{"execute":"guest-del-nic","arguments":{"mac":"%s"}}
zQ{"execute":"guest-set-password","arguments":{"username":"root","password":"%s"}}
zZ{"execute":"guest-set-password","arguments":{"username":"Administrator","password":"%s"}}
@Tr3
Administratorsz(join domain without creating local user.zd{"execute":"guest-add-user","arguments":{"username":"%s","password":"%s","group":"%s","mode":"%s"}}
zX{"execute":"guest-add-user","arguments":{"username":"%s","password":"%s","group":"%s"}}
zO{"execute":"guest-set-password","arguments":{"username":"%s","password":"%s"}}
zG{"execute":"guest-set-ip","arguments":{"mac":"%s","ip":"%s","mask":"%s"zM{"execute":"guest-set-multi-ip","arguments":{"mac":"%s","ip":"%s","mask":"%s"z
,"gateway":"%s"z
,"gateway":""z
,"dns":[r
{"server":"%s"}z
z]{"execute":"guest-set-route","arguments":{"destination":"%s","netmask":"%s","gateway":"%s"}}
z@{"execute":"guest-set-mtu","arguments":{"mac":"%s","mtu":"%s"}}
zK{"execute":"guest-set-ipv6","arguments":{"mac":"%s","ip":"%s","prefix":"%s"
,"mode":"%s"z
,"mode":""z
zl{"execute":"guest-set-route-ipv6","arguments":{"mac":"%s","destination":"%s","prefix":"%s","gateway":"%s"}}
zO{"execute":"guest-run-command","arguments":{"command":"ping -n 20 127.0.0.1"}}
zO{"execute":"guest-run-command","arguments":{"command":"ping -c 20 127.0.0.1"}}
./machineobjectouFz
%s\\%sr*
OU=%sz
,OU=%s
,DC=%sz
{"execute":"guest-join-net","arguments":{"server-name":"%s","net-name":"%s","net-type":"domain","account-ou":"%s","username":"%s","password":"%s"}}
{"execute":"guest-join-net","arguments":{"server-name":"%s","net-name":"%s","net-type":"domain","account-ou":"","username":"%s","password":"%s"}}
not windows vmzn{"execute":"guest-join-net","arguments":{"net-name":"%s","net-type":"workgroup","username":"","password":""}}
z={"execute":"guest-run-command","arguments":{"command":"%s"}}
truez?{"execute":"guest-set-hostname","arguments":{"hostname":"%s"}}
zO{"execute":"guest-set-hostname","arguments":{"hostname":"%s","mode":"reboot"}}
z>{"execute":"guest-shutdown","arguments":{"mode":"powerdown"}}
********)"r3
tagr
searchr
replacer
splitr
splitlines
joinr"
config_namerY
hostnameZ	no_rebootZ	powerdownrG
localgroup
domainZ	workgroupZ
userDataZ
passwdmodeZ
interfacesZ
nicsZ
intfsZ
nicr
actionZ	interfacer
intfZ
routesZ
rotsZ
router
rotZ
mtusZ
maxtusZ
mtur
maxtuZ
interfacesv6Z
intfsv6Z
interfacev6Z
ipv6r
intfv6Z
route6sZ
rot6sZ
route6Z
rot6r
contentlistrj
machineobjectouZ
domainusernameZ
ou_xmlZ
lines
cmdr^
	parse_xmld
ParseXML.parse_xmlc
local_pathr&
get_local_path
ParseXML.get_local_pathN)
InjectDatac
Inject XML
        :param fs: the instance of the vm image using libguestfs
        :param path: the path to inject
        :param content: the content string to configure the vm
        N)
fsrY
InjectData.__init__c
Inject file path=%(path)srY
inject_data_into_fs
InjectData.inject_data_into_fsN)
Nz%Usage: python castools.py [xmlstring])
printr
usage
z/Return True if we should retry, False otherwisez
Retrying, (%s)T
exc_info)
	exceptionr
retry_if_error
Copy_file_inc
NFr)
need_append
ori_datarA
Copy_file_in.__init__c
Nz#virt-cat -d %s /etc/qemu-ga.runonceTr
no runonce in vm)
shcmd
retr
check_file_in
Copy_file_in.check_file_inc
/var/castools/z
.tmp/qemu-ga.runoncez
.tmp/qemu-ga.runonce.bakFTz
append runonce file
No configfile foundz
NO configfile found)
existsr
rename
open
readr`
bakfileZ
data
prepare_configfile
Copy_file_in.prepare_configfilec
virt-copy-in -d %s %s /etcTr
copy in: %s
SUCESS)
copy_file_in
Copy_file_in.copy_file_inc
inject_file
Copy_file_in.inject_fileN)
retry_on_exceptionc
Nz*multidisk_boot failed, try singledisk_boot)
multidisk_bootr
singledisk_boot)
do_run
xmlZ
imagesr
hastoolrY
injectr
__main__r
Parameters errorr-
FAILED, %sTr
sysr
eventletr
	tracebackr/
logging.configr
Z	xml.etreer
distutils.versionr
retryingr
shutilr
realpath
__file__Z
logconfr
fileConfig
environZ	getLoggerr"
objectr
argvr
exitr
<module>
