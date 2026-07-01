# File: castools_inject_file.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/castools.package/scripts/castools_inject_file.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

Z)e*d k
z0e+e
rje'
e-d"
j,d#
j/d$e.d%d&
d#Z0W
Z.[.n
Z.[.0
tpool)
ElementTree)
LooseVersion)
retryz
/castools.confz /usr/local/lib/guestfs/applianceZ
LIBGUESTFS_PATHZ
CastoolsLibguestfs
windows
d!d"
d#d$
d%d&
d'd(
d)d*
d+d,
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
image
format
	partitionr
	importlib
import_module
	Exception
handle
mount
hivroot)
selfr
castools_inject_file.py
__init__:
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
inspect_capabilitiesR
VFSGuestFS.inspect_capabilitiesc
setup_os_inspect
setup_os_static
setup_osc
VFSGuestFS.setup_osc
Nz1Mount guest OS image %(image)s partition %(part)s)
part
/dev/sda%d
/dev/sda)
debugr
strr
mount_optionsr&
VFSGuestFS.setup_os_staticc
Inspecting guest OS image %sr
No operating system found in %s
Multi-boot OS %(roots)s
roots)
inspect_os
lenr
warningr-
setup_os_root)
VFSGuestFS.setup_os_inspectc
NTz#dev %s check ntfs ret %d, need fix.z'dev %s check ntfs ret %d, not need fix.Fz*dev %s check ntfs except %s, not need fix.)
ntfs_3g_probe
$CASTOOLS_NTFS_PROBE_ERROR_HIBERNATED
.CASTOOLS_NTFS_PROBE_ERROR_NOT_CLEANLY_UMOUNTEDr+
mountdev
retr
ntfs_check_need_fix
VFSGuestFS.ntfs_check_need_fixc
Nz&Inspecting guest OS root filesystem %sFz
root %s is windows.Tz&root %s get type except %s, set false.r
z.No mount points found in %(root)s of %(image)s)
rootr
<lambda>
z*VFSGuestFS.setup_os_root.<locals>.<lambda>)
keyz
Mounting %(dev)s at %(dir)sr/
dirr
zT"Error mounting %(device)s to %(dir)s in image" " %(image)s with libguestfs (%(e)s)")
devicer>
inspect_get_mountpointsr
inspect_get_type
CASTOOLS_SYSTEM_TYPE_WINDOWSr
sortr8
ntfsfixr.
mountsZ
is_windowsZ
system_typer
Z	is_widowsZ
root_mountedr
msgr
VFSGuestFS.setup_os_rootFTc
Nz"Setting up appliance for %(image)sr
python_return_dict
close_on_exitrD
Tz0Error mounting %(image)s with libguestfs (%(e)s))
	TypeError
sixZ	text_type
ranger1
add_drive_optsr
aug_initr
RuntimeErrorr
error)
lvmr
setup
VFSGuestFS.setupc
Tearing down appliancez
Failed to sync guest handle %sz
Failed to close augeas %sz
Failed to shutdown appliance %sz
Failed to close guest handle %s)
sync
AttributeErrorrH
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
writerU
replace_file$
VFSGuestFS.replace_filec
Read file path=%s)
	read_filerS
VFSGuestFS.read_filec
Has file path=%sTF)
statrH
has_file.
VFSGuestFS.has_filec
Remove file path=%s)
rm_rfrS
remove_file7
VFSGuestFS.remove_filec
Nz+Set permissions path=%(path)s mode=%(mode)s)
mode)
chmod)
set_permissions<
VFSGuestFS.set_permissionsc
Nz9Set ownership path=%(path)s user=%(user)s group=%(group)s)
user
groupr
/files/etc/zSError obtaining uid/gid for %(user)s/%(group)s:  path %(id_path)s not found (%(e)s))
id_pathr`
intr
aug_getrH
_get_item_idJ
z.VFSGuestFS.set_ownership.<locals>._get_item_idz
passwd/z
/uidz
group/z
/gidz
chown uid=%(uid)d gid=%(gid)s)
gid)
chown)
set_ownershipB
VFSGuestFS.set_ownershipc
/Program Filesr
0.0.0.0z	/usr/sbin
linuxz
/etc/qemu-ga/VERSIONz+Not support the OS, or not install castoolsz#Castools(%s) installed, version: %s)
os_type
qga_version)
path_verr
check_castools\
VFSGuestFS.check_castoolsc
inject files %s into vm %s)
dirnamerR
infor
copy_in)
Z	localpathZ	guestpathZ
guestdirrQ
copy_big_filey
VFSGuestFS.copy_big_fileN)
__name__
__module__
__qualname__
__doc__r
staticmethodrR
FileListc
filelist class
        N)
FileList.__init__N
PathListc
srcpath
dstpathrz
PathList.__init__Nr{
ParseXMLc
)	zLParse XML
        :param xmlstr: the xml string to configure the vm
        F
./passwordNz
******z
./namez
./LVM
TrueT)
fromstringr9
lvmflag
find
textZ
tostringr+
vmname)
xmlstr
passwordZ
pswd
namer
ParseXML.__init__
stop_max_attempt_number
wait_fixedc
}	|	d	k
virsh dumpxml %sT)
shell
stdoutr
z virsh dumpxml %s error, error:%sz
VM name error,%sz
./devices/diskr?
disk
source
file
driver
typez
Vm %s have no diskz
Get image of %s error)
subprocess
Popen
PIPEZ
communicate
returncoder
findallZ
attribr
appendZ
ParseErrorrN
procZ
outsZ
errsr
treeZ
disksr
	get_image
ParseXML.get_imagec
rRd	|
castools parse xml
        rk
Injectz
inject.confz
xmlstr input error, root.tag=%sr
/Program Files/%srj
/etc/%sz
./hostNamez
./userNamer
./localGroupz
./domainz
./FilePathz
./WriteFilesz
./filez
./srcz
./dstNz
writefiles format errorz
writefiles filepath  errorz
Parse xml error (%s))
tagr
config_namerQ
hostname
usernamer
localgroup
domain
filepathZ
writefiles
filesZ
pathlistr
filelistrx
	parse_xml
ParseXML.parse_xmlN)
InjectDatac
Inject XML
        :param fs: the instance of the vm image using libguestfs
        :param path: the path to inject
        :param content: the content string to configure the vm
        N)
fsrQ
InjectData.__init__c
Inject file ......)
inject_data_into_fs
InjectData.inject_data_into_fsN)
Nz%Usage: python castools.py [xmlstring])
printr
usage	
z/Return True if we should retry, False otherwisez
Retrying, (%s)T
exc_info)
isinstancer
	exceptionr
retry_if_error
retry_on_exceptionc
}	~	n
}	~	0
xmlr
hastoolr
fileinjectr
do_run
__main__r
Parameters errorr/
FAILED, %sTr
SUCESS)3r
sysr
eventletr
	tracebackZ
loggingZ
logging.configr
Z	xml.etreer
distutils.versionr
shutilrF
retryingr
platformrQ
split
realpath
__file__Z
logconfZ
configZ
fileConfig
environZ	getLoggerr+
objectr	
argvr
exitr
<module>
