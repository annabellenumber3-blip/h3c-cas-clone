# File: sa_fcoe_mng.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/storage-admin.package/scripts/sa_fcoe_mng.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

m	Z	
j#j$
Z'e'j(Z)e)d
sFe)d
r\e)j*d
e	e)
Z.e.d
Z/e.d k
r"e.d!k
r"e.d"k
r"e	e)
Z/e/d
1d%e/
d&e/
e.d k
e.d'k
Z2e2
Z4e4
rbe 
Z4e4
r|e 
7d(e/
Z8e8e
e8d)7
d*e/
e.d!k
r^e	e)
Z<e<d
Z/e0
1d%e<
rLe<Z/n
Z>e>D
](Z?e
Z2e2
ZAeAd
rZeAe=e?<
qZz4e=
]&Z?e<
e=e?
e?Z/
d+e<
Z2e2
Z4e4
e.d"k
Z>e>D
](Z?e
Z2e2
ZFeFd
rreGe?
qrnRe.d-k
Z2e2
Z4e4d
d.ZHe 
d/e.
getTextz
/etc/fcoe/cfg-ethxz
/etc/fcoe/cfg-z
/sys/class/netz
HP FlexFabric)
630FLBZ
536FLBZ
534FLB
	ErrorCodez-
    Define error code, return to caller
    r
__name__
__module__
__qualname__
__doc__
fcoe_err_success
fcoe_err_internal_error
fcoe_err_xml_param_errorZ
fcoe_err_create_vif_error
fcoe_err_param_error
fcoe_err_delete_storage_createdZ
fcoe_err_other
sa_fcoe_mng.pyr
FCoEz"
    the FCoE operation class
    c
superr
__init__
_FCoE__eth_name)
selfZ
eth_name
	__class__r
FCoE.__init__c
        Get the fcoe port absolute path
        Returns: the port fcoe configuration file name
        )
FCOE_ETH_CONF_PREFIXr
get_conf_file;
FCoE.get_conf_filec
        Get the fcoe virtual interface name
        Returns: the interface name string
        z
-fcoezOfcoeadm -i %s 2>/dev/null | grep "Symbolic Name.*QLogic BCM578[14]0.* over %s$"T
shellNr
z(Error occur when get fcoe interface name)
listdir
FCOE_SYS_CLASS_NET_PATH
startswithr
endswith
subprocess
check_output
decode
strip
	Exception
logging
error)
net_ifs
net_if
output
get_fcoe_ifnameB
FCoE.get_fcoe_ifnamec
z t	
        Get the fcoe physical port pci address, e.g.: 0000:41:00.0
        Returns: the pci address value
        NZ
devicez3Error occur when get fcoe physical port pci address)
path
joinr$
exists
realpath
basenamer,
pci_addrZ
path_dirZ
device_pathr3
get_pci_addrY
FCoE.get_pci_addrc
z t	
        Set ethernet port fcoe enable flag to configuration file
        Returns: None
        
FCOE_ENABLE=
FCOE_ENABLE=\S+z
FCOE_ENABLE="yes"
wz7Set fcoe enable flag to configuration file successfullyz;Error occur when set fcoe enable flag to configuration fileN
open
	readlinesr*
close
writelinesr-
debugr,
Z	conf_file
lines
liner3
enable_2confm
FCoE.enable_2confc
z t	
        Set ethernet port fcoe disable flag to configuration file
        Returns: None
        r;
FCOE_ENABLE="no"r>
z8Set fcoe disable flag to configuration file successfullyz<Error occur when set fcoe disable flag to configuration fileNr@
disable_2conf
FCoE.disable_2confc
        Check whether the physical port does support fcoe feature
        Returns: return True if the physical support fcoe feature, else return False
        Nz&lspci -s %s -vv | grep "Product Name:"Tr 
FCOE_SUPPORT_ADAPTER
itemsr*
findr,
port_pci
cmd_lineZ
cmd_outputZ
adapterZ
companyr3
check_support
FCoE.check_supportc
q\d	|
        Check whether some luns under the fcoe interface is used by storage pool
        Returns: return True if storage pool is mounted, else return False
        NFzcfcoeadm -l %s | sed -n '/LUN #[0-9]* Information/,+2p' | grep 'OS Device Name:' | awk '{print $NF}'Tr 
z#/lib/udev/scsi_id --whitelist -u %sztgrep -rw %s /etc/libvirt/storage/* | awk '{print $1}' | awk -F '/' '{print $NF}' | sort | uniq | sed 's/'.xml:$'//g'z4The lun %s attached on %s interface is mounted to %s)
splitr-
if_namer1
disksZ
diskZ
naaZ	pool_namer3
check_if_mounted
FCoE.check_if_mounted
fabricc
        Create fcoe interface
        Args:
            mode: the fcoe interface mode, must be 'fabric' or 'vn2vn'
        Returns: return 0 on success, else return -1 on failure
        rX
vn2vnz
the mode %s is invalid
%service fcoe restart 2>/dev/null 1>&2Tr 
Nz6Create fcoe interface on physical port %s successfullyr
destroyrM
check_callr,
moderR
create
FCoE.createc
        Destroy fcoe interface
        Returns: return 0 on success, else return -1 on failure
        z
fcoeadm -d %s 2>>/dev/nullTr 
z7Error occur when call fcoeadm to destroy fcoe interfaceNrZ
ip link delete z7Destroy fcoe interface on physical port %s successfullyr
CalledProcessError
returncoder-
callZ
warningrG
FCoE.destroyc
        initialize the physical port
        Returns: return 0 on success, else return -1 on failure
        z+FCoE default configure file %s is not existrY
Get port PCI address errorz4Copy port %s fcoe configuration file %s successfullyr
FCOE_ETH_CONF_FILE_DEFAULTr-
shutil
copyrG
dstr3
	port_init
FCoE.port_initc
        Get virtual FCoE HBA wwn
        Returns: wwn value
        Nzcfcoeadm -i %s 2>/dev/null | grep 'Port Name:' | awk -F ':' '{print $NF}' | awk -F 'x' '{print $NF}'Tr 
)	r4
wwnr3
get_wwn7
FCoE.get_wwn)
__classcell__r
    search and get all ethernet physical port
    Returns:
        list: the lists of ethernet physical name
    
eth\d+$z0Error occur when get all ethernet physical portsN)	r"
match
appendr,
Z	port_listr/
get_all_physical_portsO
    Initialize fcoe configuration
    Returns: None
    z
FCoE initialize on port %sN)
eth_port_listZ	port_nameZ
fcoe_objr
	fcoe_initb
__main__Z
caslog/storage-adminz+Manage ethernet physical port FCoE functionT)
description
add_help
xml_messagez!parameter defined with xml format)
help
typeZ
paramz0Parameter error, cannot parse the root parameter
z%Parameter error, the op param is none
init
delete
query
ifz%Parameter error, the if param is noneri
z'Parameter error, the port name %s errorr^
z6waiting for virtual interface to be created on port %s
z'Could not create port %s fcoe interfacez-Parameter error, interface name %s is unknownz0the luns under the port is mounted, can't delete
checkr>
z-Parameter error, operation type %s is unknownz Error occur when parse parameter)Kr"
xml.dom.minidomZ
xmlr'
time
argparseZ
util_cvk_logZ
util_xml_commonr
FCOE_CREATE_TIMEOUT
objectr
cas_log_init3
ArgumentParser
parser
add_argument
parse_args
argsr,
exitr
domZ
minidomZ
parseStringrq
Z	param_domZ
documentElement
paramsZ
nodeNamer
getElementsByTagNameZ
childNodesrt
ifnamerC
fcoe_objectrf
resr
loopr4
sleepr[
itfZ
wwnsZ
port_lists
portrg
port_wwn
keys
lowerrW
printZ
is_supportrS
<module>
