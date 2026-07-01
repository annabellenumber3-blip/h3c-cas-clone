# File: sysprep.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/castools.package/scripts/sysprep.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

Z&e'd
z8e(e
rbe$
j)d 
+d!d"
j-d#e,d$d%
d Z.W
Z,[,n
Z,[,0
tpool)
ElementTree)
parse)
retryz
/sysprep.confZ
SysprepLibguestfsz /usr/local/lib/guestfs/applianceZ
LIBGUESTFS_PATHZ
libvirtZ
LIBGUESTFS_BACKENDc
Z	d.d
d d!
d"d#
d$d%
d&d'
d(d)
d*d+
VFSGuestFSz
This class implements a VFS module that uses the libguestfs APIs
    to access the disk image. The disk image is never mapped into
    the host filesystem, thus avoiding any potential for symlink
    attacks from the guest filesystem.
    
}	~	n
}	~	0
Create a new local VFS instance
        :param image: the path of disk image
        :param format: the format of disk image
        :param partition: the partition number of access
        N
guestfsz libguestfs is not installed (%s)F)
image
format
auth
servers
secret
protocol
configfile
	partitionr
	importlib
import_module
	Exception
handle
mount
hivroot)
selfr	
sysprep.py
__init__4
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
inspect_capabilitiesQ
VFSGuestFS.inspect_capabilitiesc
setup_os_inspect
setup_os_static
setup_osb
VFSGuestFS.setup_osc
Nz1Mount guest OS image %(image)s partition %(part)s)
part
/dev/sda%d
/dev/sda)
debugr	
strr
mount_optionsr(
VFSGuestFS.setup_os_staticc
Inspecting guest OS image %sr
No operating system found in %s
Multi-boot OS %(roots)s
rootsz'Multi-boot operating system found in %s)	r-
inspect_os
lenr
setup_os_root)
VFSGuestFS.setup_os_inspectc
Nz&Inspecting guest OS root filesystem %sr
z.No mount points found in %(root)s of %(image)s)
rootr	
<lambda>
z*VFSGuestFS.setup_os_root.<locals>.<lambda>)
keyFz
Mounting %(dev)s at %(dir)sr1
dirr+
zU"Error mounting %(device)s to %(dir)s in image" " %(image)s with libguestfs (%(e)s)" )
devicer:
inspect_get_mountpointsr
sortr0
ntfs_3g_probeZ
ntfsfix)
mountsZ
root_mountedr
msgr
VFSGuestFS.setup_os_rootTc
Nz"Setting up appliance for %(image)sr	
python_return_dict
close_on_exitr?
rbdr
readonlyr
serverr
usernamer
Tz0Error mounting %(image)s with libguestfs (%(e)s))
	TypeError
sixZ	text_typer
add_drive_optsr
aug_initr
RuntimeErrorr
error)
setup
VFSGuestFS.setupc
Tearing down appliancez
Failed to sync guest handle %sz
Failed to close augeas %sz
Failed to shutdown appliance %sz
Failed to close guest handle %s)
sync
AttributeErrorrE
warningr
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
writerQ
replace_file
VFSGuestFS.replace_filec
Read file path=%s)
	read_filerO
VFSGuestFS.read_filec
Has file path=%sTF)
statrE
has_file
VFSGuestFS.has_filec
Remove file path=%s)
rm_rfrO
remove_file
VFSGuestFS.remove_filec
Nz+Set permissions path=%(path)s mode=%(mode)s)
mode)
chmod)
set_permissions"
VFSGuestFS.set_permissionsc
Nz9Set ownership path=%(path)s user=%(user)s group=%(group)s)
user
groupr
/files/etc/zSError obtaining uid/gid for %(user)s/%(group)s:  path %(id_path)s not found (%(e)s))
id_pathr]
intr
aug_getrE
_get_item_id0
z.VFSGuestFS.set_ownership.<locals>._get_item_idz
passwd/z
/uidz
group/z
/gidz
chown uid=%(uid)d gid=%(gid)s)
gid)
chown)
set_ownership(
VFSGuestFS.set_ownershipc
$/Program Files/CAS tools/qemu-ga.exeZ
windowsz
/usr/sbin/qemu-gaZ
linuxz+Not support the OS, or not install castoolsz
Castools(%s) installed)
os_typer
check_castoolsB
VFSGuestFS.check_castoolsc
NZ	Microsoftz
Windows NTZ
CurrentVersionz
Error getting os_version(%s)Z
ControlSet001Z
Controlz
Session ManagerZ
EnvironmentZ
PROCESSOR_ARCHITECTUREz
Error getting os_arch(%s))
os_version
os_arch
Z!inspect_get_windows_software_hiver
hivex_openZ
hivex_rootZ
hivex_node_get_childZ
hivex_node_get_valueZ
hivex_value_utf8r
inspect_get_windows_system_hive)
softwarer5
micsfZ
winntZ
curverZ
verri
systemZ
contsetZ
contZ
sesm
envZ
archrj
check_windowsL
VFSGuestFS.check_windowsc
Nz)/etc/udev/rules.d/70-persistent-net.rules)
clean_files
filer
clean_imageh
VFSGuestFS.clean_imageN)
__name__
__module__
__qualname__
__doc__r
staticmethodrN
Intfc
Interface class
        N)
mask
gateway
dns)
Intf.__init__N)
ParseXMLc
zLParse XML
        :param xmlstr: the xml string to configure the vm
        r+
./passwordNz
******
utf-8
./name)
diskpathr
sercretr
port
fromstringr5
find
textZ
tostringr-
info
decode
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
)#Nz
sudo virsh dumpxml %sT)
shell
stdoutr
z virsh dumpxml %s error, error:%sz
VM name error,%sz
./devices/disk
typez
check type: %sZ
networkz
network RBD
source
driverz
format: %sr
protocol: %sr
disk: %sr
username: %sr
uuidz
secret: %s
hostr
server:  %s:%s
configro
configfile: %sr;
diskz
Vm %s have no diskz
Get image of %s error)
subprocess
Popen
PIPEZ
communicate
returncoder
findallZ
attribr-
ParseErrorrI
procZ
outsZ
errsZ
treeZ
disksr
conffiler;
	get_image
ParseXML.get_imagec
%s:%sr~
base64Z	b64encoder
encode
isinstancer/
get_RBD_info
ParseXML.get_RBD_infoc
	d |
)!Nr
./hostNamez
./userNamer}
./localGroupz
./productKeyz
./powerdownz
./userDataz
./adminpasswd
./timezonez
Error name hostName localGroupz
./domainz
./workGroupz
Error domain workGroupz
./interfacez
./ipz
./maskz
./macz
Error interfacez	./gatewayz
./dnsz
./enableAutoLogon)
hostnamerB
localgroup
domain
	workgroup
intfs
productkey
	powerdown
userData
enableAutoLogon
adminpasswd
timezonez
./machineobjectour+
OU=%sz
,OU=%s
,DC=%s
machineobjectouz
machineobjectou-:
appendr
splitr-
interfacesr
Z	interfacerw
intfr
xmltr
ou_xmlZ
__parse_xml
ParseXML.__parse_xmlc
255Z
254Z
252Z
248Z
240Z
224Z
192Z
128r
Z	mask_dict
prefixrw
__mask_to_prefix
ParseXML.__mask_to_prefixc
}	|	
d5d6
d:} |
}"|"
rt|"
nD|"
dR}#dS}$dT}%dU|%
dV}#dS}$dW}%dU|%
dYdZ
)[Nz%/Windows/System32/sysprep/sysprep.exez%/Windows/System32/Sysprep/sysprep.exez
Error invalid winos vmrg
CASTools not installedr
ComputerNamer
ProductKeyr
TimeZone
Identificationr
UserAccountsZ
LocalAccounts
LocalAccountz
wcm:action
PasswordZ
Valuer
Z	PlainText
trueZ
Groupr
NameZ
JoinWorkgroupr
credentials
CredentialsZ
DomainZ
UsernameZ
JoinDomainr
MachineObjectOUr
administrator accountZ
AdministratorPasswordr
	componentr
Microsoft-Windows-TCPIPZ
Interfacesz
Microsoft-Windows-DNS-Client
	InterfaceZ
Identifier
dhcpZ
UnicastIpAddresses
	IpAddressz
wcm:keyValue
Ipv4SettingsZ
DhcpEnabledZ
falseZ
Routes
RouteZ
MetricZ
NextHopAddressZ
Prefixz	0.0.0.0/0
DNSServerSearchOrderr1
ip error
FirstLogonCommandsr
SynchronousCommandZ
CommandLine
Orderz
shutdown /s /t 300r
	AutoLogonZ
EnabledZ
LogonCountZ
Administratorz%/Windows/System32/sysprep/sysprep.xml
(/Program Files/CAS tools/qemu-ga.runoncezzC:\Windows\System32\sysprep\sysprep.exe /quiet /generalize /oobe /reboot /unattend:C:\Windows\System32\sysprep\sysprep.xmlz<{"execute":"guest-run-command","arguments":{"command":"%s"}}z%/Windows/System32/Sysprep/sysprep.xmlzzC:\Windows\System32\Sysprep\sysprep.exe /quiet /generalize /oobe /reboot /unattend:C:\Windows\System32\Sysprep\sysprep.xmlr~
getElementsByTagNameZ
childNodesZ	nodeValueZ
parentNodeZ
removeChildr5
appendChildZ
createElementZ
setAttributeZ
createTextNoder-
getAttributery
_ParseXML__mask_to_prefixrx
splitlinesZ
toxml
replace)&r
domrk
WorkGrouplistr
PassWordr
Z	AdAccount
componentsr
tcpip_intfsZ	dns_intfsr
lines
cmdr
enabler
cmdpathZ	launchstrr
__parse_winos
ParseXML.__parse_winosc
}	|	d
)DNz
/sysprep/sysprep.exez
Error invalid winx vmz
/sysprep/i386/$oem$z
/etc/cvk/sysprep.inf.tmpl
/sysprep/sysprep.infz
/etc/cvk/cmdlines.txt.tmplz /sysprep/i386/$oem$/cmdlines.txtr
AutoLogon=Yes
AutoLogonCount=1
[UserData]
ProductKey=%s
FullName=%s
ComputerName=%s
OrgName=%s
net user %s %s /add
net localgroup "%s" %s /add
[Identification]
JoinDomain=%s
DomainAdmin=%s
DomainAdminPassword=%s
MachineObjectOU="%s"
[GuiRunOnce]
z)Command0="net localgroup %s %s\%s /add"
net localgroup %s %s\%s /add
JoinWorkgroup=%s
Command%d="%s"
z Command%d="shutdown /s /t 120"
[NetAdapters]
Adapter%d=params.Adapter%d
[params.MS_TCPIP]
z(AdapterSections=params.MS_TCPIP.Adapter1r
,params.MS_TCPIP.Adapter%dz
[params.Adapter%d]
NetCardAddress=0x
[params.MS_TCPIP.Adapter%d]
SpecificTo=Adapter%d
DHCP=No
IPAddress=%s
SubnetMask=%s
DefaultGateway=%s
DNSServerSearchOrder=
DHCP=Yesr
z /sysprep/i386/$oem$/cmdlines.bat)
openrU
readr
join)
syspreplistZ
cmdlineslistZ
cmd_numr
countr
addr
syspathZ
sysprepr
cmdlinesr
__parse_winxp
ParseXML.__parse_winxpc
sysprep parse xml
        ri
gffffff
x86z"/etc/cvk/win7_x86_sysprep.xml.tmplZ
AMD64z"/etc/cvk/win7_x64_sysprep.xml.tmplz
Error not support the arch(%s)r1
Error not support the OS(%s))
float
_ParseXML__parse_winxp
_ParseXML__parse_xmlr
_ParseXML__parse_winos)
injxmlr
	parse_xml2
ParseXML.parse_xmlN)
InjectDatac
Inject XML
        :param fs: the instance of the vm image using libguestfs
        :param path: the path to inject
        :param content: the content string to configure the vm
        N)
data)
InjectData.__init__c
Nz-Inject file content=%(content)s path=%(path)sr~
listr
itemsr
bytesr-
inject_data_into_fsP
InjectData.inject_data_into_fsN)
Nz$Usage: python sysprep.py [xmlstring])
printr
usage`
z/Return True if we should retry, False otherwisez
Retrying, (%s)T
exc_info)
	exceptionr
retry_if_errorc
retry_on_exceptionc
}	|	
xmlr	
injectr
do_runh
__main__r
Parameters errorr1
FAILED, %sTr
SUCESS)1r 
sysr
eventletr
	tracebackZ
loggingZ
logging.configr
Z	xml.etreer
xml.dom.minidomr
retryingr
timer
realpath
__file__Z
logconfr
fileConfigZ	getLoggerr-
environr
objectr
argvr
retr
exitr
<module>
