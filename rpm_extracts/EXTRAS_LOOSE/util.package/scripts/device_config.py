# File: device_config.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/util.package/scripts/device_config.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

l	Z	d
Z/d Z0d!Z1d"Z2d#Z3d$Z4d%Z5d&Z6d'Z7d(Z8d)Z9d*Z:d+Z;d,Z<d-Z=d.Z>d/Z?d0Z@d1ZAd2ZBd3ZCd4ZDd5ZEd6ZFd5ZEd7ZGd8ZHd9ZId:ZJd;ZKd<ZLd=ZMd>ZNd?ZOd@ZPdAZQdBZRdCZSdDZTdEZUdFZVdGZWd
ZXdHZYdIZZd
Z[dHZ\dJZ]dKZ^dLZ_dMZ`dNZadOZbdPZcdQZddRZedSZfdTZgdUZhdVZidWZjdXZkdYZldZZmd[Znd\Zod]Zpd^Zqd_Zrd`ZsdaZtdbZudcZvddZwdeZxdfZydgZzdhZ{diZ|djZ}dkZ~dlZ
dsdsdsdtdtdtdu
dvdw
dxdy
dzd{
d|d}
############################################################################
#    File Name: device_config.py
# Date Created: 2015-1-20
#       Author: hanhuanle
#  Description: query or set interface information,
#               restore pci sriov after reboot
#        Input: --xml "xmlcontent" or --retore
#       Output: xml content of interfaces
#       Return: 0 if succeffully, other with errors
#      Used To:
#               1. restore pci sriov when host reboot, used by script /etc/init.d/sriov-restore
#               2. HA module to get statitics of physical nic. /opt/bin/cha_hostnetworkmonitor.pyc depends on this
#               3. CVM to get or set sriov
#               4. CVM to query any kind of nic inforamtion(pysical nic info, free vf info, free passthroughable pci info ...)
#      Caution: If you modify this scrip, you had better test all the function above
#-----------------------------------------------------------------------------
#  Modification History
#  DATE        NAME             DESCRIPTION
##############################################################################
ElementTree)
reduce
name
ifindexZ
netTypeZ
libvirtNetDevNameZ
address
speed
duplex
flags
carrier
	operstate
mtuZ	rxPacketsZ	txPacketsZ
rxBytesZ
txBytesZ
rxDropedZ
txDropedZ
rxErrorsZ
txErrors
upperZ
devPortZ
physicalNIC
permaddr
pciAddressZ
isPhysical
deviceIdZ
venderIdZ
classId
description
subsystemDescription
Capabilities
sriovMaxNumZ
numa
iommuGroupZ
physicalSlotZ	linkWidth
kernelModule
driverZ
physicalFunctionZ
virtualFunctionsZ
smartvirtualFunctionsZ
sriovNumZ
sriovMinConfNumZ
sriovSupportZ
fcoeSupportZ
passthroughSupportZ
dpdkSupportZ
smartnetcardSupport
isSecurityNicZ
freeVFsZ
usedVFs
isExistVFForSmartSubnet
isExistVFForSmartVM
isFreePhysicalNet
isFreeForPCIPassthough
isFreeForFCoE
isFreeForOVSUplink
isUsedForOVSUplink
isFreeForDPDKUplink
isFreeForSMARTUplink
isFreeForVLANInterface
isPhysicalSmartNIC
isFullOffloaded
phySwitchIdZ
ovsInterfaceBondSlaveCount
altname
Z	netdevice
dpdkZ	vhostuserz
/etc/cvk/pci_sriov.confz
/etc/cvk/device_persistent.confz
/etc/cvk/pci_sriov_options.confz
/etc/cvk/cas_device.confz
/sys/class/net/z
/sys/bus/pci/devices/z
/sys/bus/pci/drivers/z
/sys/devices/virtual/net/z-/run/WRITE_LOCK_FILE_opt_bin_device_config_pyz
/run/device_config_cache.xmlz
.tmp)
vfio-pci
igb_uioz
pci-stub
uio_pci_generic)
Z	mlx5_corez
HP FlexFabricZ
H3C)
630FLBZ
536FLBZ
534FLBz
NIC-ETH521iz
NIC-ETH522iz
NIC-ETH561ic
device_config.py
BoolTo01
	Exception
	errorcode
items
setattr)
message
args
createException
print)
_myPrint
register an output handle to receive the result which default outputed to stdout
        the handle should take a string as its paramter
    N)
_outputHandles
append
handlerE
registerOutputHandle
z!unregister the output handle
    FT)
removerX
unregisterOutputHandle
rjd	d
z9Convert a json ovsdb return value to native python objectr(
uuidr'
setc
	val_to_py)
<listcomp>
val_to_py.<locals>.<listcomp>
mapc
<dictcomp>
val_to_py.<locals>.<dictcomp>)
isinstance
list
str)
valrE
Z	d	S
Utilityz$Tool to simulate shell commands
    c
shell
stderr
stdoutr
encoding)
subprocess
Popen
PIPE
communicate
chardetZ
detect
decode)
infoZ
ret_encodingrE
execute
Utility.executeFc
cat %s(%s))
open
read
striprJ
logging
	exceptionrj
filename
nolog
Utility.catc
/sys/z
write_file: %s > %s
startswithr
write)
path
contentr
write_file
Utility.write_fileNc
nic_config.pyTF)
USING_NIC_CONFIG
basename
__file__r
compitable_nic_config
Utility.compitable_nic_config)
__name__
__module__
__qualname__
__doc__
staticmethodrz
d!d"
d#d$
d%d&
d'd(
d)d*
d+d,
	PCIObjectc
pci path %s dosn't exist)
_pcipathr
existsrJ
_address)
self
pcipathrE
__init__
PCIObject.__init__c
_getDevicePathrl
join)
_deviceFSContent
PCIObject._deviceFSContentc
PCIObject._getDevicePathc
getPCIAddress
PCIObject.getPCIAddressc
vendor
getVenderId
PCIObject.getVenderIdc
devicer
getDeviceId
PCIObject.getDeviceIdc
classr
getClassId
PCIObject.getClassIdc
	numa_node)
intr
getNumaNode
PCIObject.getNumaNodec
iommu_group
realpath
split
linkrE
getIOMMUGroup
PCIObject.getIOMMUGroupc
	getDriver
PCIObject.getDriverc
/sriov_totalvfsr
fsfilerE
getMaxSRIOVNum"
PCIObject.getMaxSRIOVNumc
/sriov_numvfsr
isfiler
getCurrentSRIOVNum&
PCIObject.getCurrentSRIOVNumc
physfnrA
Z	pfPciLinkrE
getPhysicalFunction*
PCIObject.getPhysicalFunctionc
vdpa
supportlistc
z0PCIObject.isPhysicalSmartNIC.<locals>.<listcomp>
isPfr
CAS_DEVICE_CONFIG_FILE
configparser
ConfigParserrj
optionxformr}
has_section
getr
fnmatch)
devideConfigZ
deviceConfig
supportList
devices
id_rT
PCIObject.isPhysicalSmartNICc
z2Return pci address of all pcis as a list.
        
netr
5cat /sys/class/net/%s/compat/devlink/mode 2>/dev/null
	switchdevc
virtfn
z4PCIObject.getVirtualFunctionList.<locals>.<listcomp>c
fsdirrE
listdirr#
isdirrh
nics
ifnamerE
getVirtualFunctionListE
z PCIObject.getVirtualFunctionListc
z8Return pci address of all smart pcis as a list.
        r
z9PCIObject.getSmartVirtualFunctionList.<locals>.<listcomp>c
getSmartVirtualFunctionListW
z%PCIObject.getSmartVirtualFunctionListc
qjq,|
virtfn*r
glob
readlinkr
vfpciZ
vfindexr
vfdir
lineZ
pci_addrrE
getVirtualFunctionIndexi
z!PCIObject.getVirtualFunctionIndexc
z@Return pci address of all pcis as "," delimited string.
        r
getVirtualFunctionsv
PCIObject.getVirtualFunctionsc
zFReturn pci address of all smart pcis as "," delimited string.
        r
getSmartVirtualFunctions{
z"PCIObject.getSmartVirtualFunctionsc
PCIObject.isPfc
PCICache
getPCIDescriptionCacher
XML_TAG_descriptionr
getDescription
PCIObject.getDescriptionc
XML_TAG_subsystemDescriptionr
getSubsystemDescription
z!PCIObject.getSubsystemDescriptionN)
d d!
d"d#
d$d%
d&d'
d(d)
d*d+
d,d-
d.d/
d0d1
d2d3
d4d5
d6d7
	NetObjectzgRepersent a PCI device. It provides getXX function to get PCI attribute. Most data is from /sys/..
    rA
/run/ovs_bridge.lockz;process deal with smart vswitch already exists, please waitz
net %s doesn't exists)
_namer
getNetSysfsPathrR
 ERROR_CODE_SMART_CALL_IS_RUNNINGrJ
getNetAltName
_altname
NetObject.__init__c
SYS_CLASS_NETr
NetObject.getNetSysfsPathFc
_netFSContent
NetObject._netFSContentc
getName
NetObject.getNamec
getAddress
NetObject.getAddressc
statistics/rx_packetsr
getRXPackets
NetObject.getRXPacketsc
statistics/tx_packetsr
getTXPackets
NetObject.getTXPacketsc
statistics/rx_bytesr
getRXBytes
NetObject.getRXBytesc
statistics/tx_bytesr
getTXBytes
NetObject.getTXBytesc
statistics/rx_droppedr
getRXDroped
NetObject.getRXDropedc
statistics/tx_droppedr
getTXDroped
NetObject.getTXDropedc
statistics/rx_errorsr
getRXErrors
NetObject.getRXErrorsc
statistics/tx_errorsr
getTXErrors
NetObject.getTXErrorsc
getFlags
NetObject.getFlagsc
dev_port
portrE
getDevPort
NetObject.getDevPortc
offr
getCarrier
NetObject.getCarrierc
SPEED_UNKNOWNr
getSpeed
NetObject.getSpeedc
unknown)
	getDuplex
NetObject.getDuplexc
Nz5ip link show dev %s | grep altname | awk '{print $2}')
NetObject.getNetAltNamec
full
staterE
getOperstate
NetObject.getOperstatec
getMtu
NetObject.getMtuc
getIfindex
NetObject.getIfindexc
phys_switch_idr
getPhySwitchId
NetObject.getPhySwitchIdc
GReturn 1 only if has upper, such as bridge, vlan, otherwise 0.
        r
z&NetObject.getUpper.<locals>.<listcomp>z
/upper_*)
check_is_used_linuxr
getUpper
NetObject.getUpperc
NET_TYPE_NETDEVICEr
getNetdeviceType
NetObject.getNetdeviceTypec
/etc/sysconfig/network-scripts/z grep '^SLAVE=\"yes\"' %sifcfg-%s)
filepathZ
nic_namer
NetObject.check_is_used_linuxN)
d d!
d"d#
d$d%
d&d'
d(d)
d*d+
d,d-
d.d/
OVSNetObjectrA
OVSNetObject.__init__c
OVSCache
getIntefaceByNamer
defaultZ
ifaceCacherE
getCache
OVSNetObject.getCachec
OVSNetObject.getNamec
mac_in_use
ff:ff:ff:ff:ff:ff
OVSNetObject.getAddressc
statisticsZ
rx_packetsr
OVSNetObject.getRXPacketsc
tx_packetsr
OVSNetObject.getTXPacketsc
rx_bytesr
OVSNetObject.getRXBytesc
tx_bytesr
OVSNetObject.getTXBytesc
rx_droppedr
OVSNetObject.getRXDropedc
tx_droppedr
OVSNetObject.getTXDropedc
Z	rx_errorsr
OVSNetObject.getRXErrorsc
Z	tx_errorsr
OVSNetObject.getTXErrorsc
OVSNetObject.getFlagsc
OVSNetObject.getDevPortc
admin_state
downr
link_stater
OVSNetObject.getCarrierc
link_speedrA
OVSNetObject.getSpeedc
OVSNetObject.getDuplexc
oprE
OVSNetObject.getOperstatec
OVSNetObject.getMtuc
OVSNetObject.getIfindexc
upper_ovs-netdevrE
OVSNetObject.getUpperc
OVSNetObject.getPhySwitchIdc
NET_TYPE_DPDKr
OVSNetObject.getNetdeviceTypeN)
Get PCI objects by pci addressz
%s/net/r'
QueryResultObject)
z/getQueryObjectsByPCIAddress.<locals>.<listcomp>)
SYS_PCI_DEVICESr
pciPathZ
ifaceNamesrE
getQueryObjectsByPCIAddressX
dkd	d
d!d"
d#d$
d&d'
d(d)
d*d+
d,d-
d.d/
d0d1
d2d3
d4d5
d6d7
d8d9
d:d;
d<d=
d>d?
Z d@dA
Z!dBdC
Z"dDdE
Z#dFdG
Z$dHdI
Z%dJdK
Z&dLdM
Z'dNdO
Z(dPdQ
Z)dRdS
Z*dTdU
Z+dVdW
Z,dXdY
Z-dZd[
Z.d\d]
Z/d^d_
Z0d`da
Z1dbdc
Z2ddde
Z3dfdg
Z4dhdi
)lr2
	d	|
]2}	|	
virtior
ethtool -i z
bus-info
0000:z"pci %s has more than one nets: %s.r
rsplitr
splitlinesr
_getInterfaceNameOfPCIri
warningr
_pcir
getDPDKInterface
SPECIAL_DPDK_DRIVERr 
_netr
getNICPCICache
_pci_cache)
_ifnamer
devicePathZ
pcipath2Z	nic_infosZ
nic_pciZ
nic_infoZ
bus_infoZ
device_pci_pathr
Z	pciDriver
cacherE
QueryResultObject.__init__c
getPCI
QueryResultObject.getPCIc
getNet
QueryResultObject.getNetNc
	subObject
subObjectMethodr%
_getWithCache
QueryResultObject._getWithCachec
XML_TAG_physicalSlotr
getPhysicalSlot
z!QueryResultObject.getPhysicalSlotc
XML_TAG_linkWidthr
getLinkWidth
QueryResultObject.getLinkWidthc
XML_TAG_kernelModuler
getKernelModule
z!QueryResultObject.getKernelModulec
XML_TAG_venderIdr2
QueryResultObject.getVenderIdc
XML_TAG_deviceIdr2
QueryResultObject.getDeviceIdc
XML_TAG_classIdr2
QueryResultObject.getClassIdc
z QueryResultObject.getDescriptionc
z)QueryResultObject.getSubsystemDescriptionc
XML_TAG_sriovMaxNumr2
z QueryResultObject.getMaxSRIOVNumc
XML_TAG_numar2
QueryResultObject.getNumaNodec
XML_TAG_iommuGroupr2
QueryResultObject.getIOMMUGroupc
QueryResultObject.isPfc
QueryResultObject.getPCIAddressc
QueryResultObject.getDriverc
z$QueryResultObject.getCurrentSRIOVNumc
z%QueryResultObject.getPhysicalFunctionc
z(QueryResultObject.getVirtualFunctionListc
z%QueryResultObject.getVirtualFunctionsc
z*QueryResultObject.getSmartVirtualFunctionsc
vfrE
z)QueryResultObject.getVirtualFunctionIndexc
QueryResultObject.getNamec
QueryResultObject.getAddressc
QueryResultObject.getRXPacketsc
QueryResultObject.getTXPacketsc
QueryResultObject.getRXBytesc
QueryResultObject.getTXBytesc
QueryResultObject.getRXDropedc
QueryResultObject.getTXDropedc
QueryResultObject.getRXErrorsc
QueryResultObject.getTXErrorsc
QueryResultObject.getSpeedc
QueryResultObject.getDuplexc
QueryResultObject.getCarrierc
QueryResultObject.getFlagsc
QueryResultObject.getDevPortc
QueryResultObject.getOperstatec
QueryResultObject.getMtuc
QueryResultObject.getUpperc
QueryResultObject.getIfindexc
z QueryResultObject.getPhySwitchIdc
z"QueryResultObject.getNetdeviceTypec
QueryResultObject.getNetAltNamec
 mac as id for others to accessN)
getPermanentAddressr@
getUniqueMac!
QueryResultObject.getUniqueMacc
 hardware address Nz
ethtool -P r8
XML_TAG_permaddrr
z%QueryResultObject.getPermanentAddressc
zBReturn the physical nic name if this is a vf interface, Otherwise r
getPhysicalNIC4
z QueryResultObject.getPhysicalNICc
/net/c
z<QueryResultObject._getInterfaceNameOfPCI.<locals>.<listcomp>z
/virtio*/net/*r'
z?Code is not ready for PCI %s, who has multiple net instances %s)	r
netpathrE
z(QueryResultObject._getInterfaceNameOfPCIc
z]Return libvirt node dev name of this interface. Example: net_eth1_82_2e_ef_b0_2e_78.
        rA
subr
getLibvirtNetNodeDevNameH
z*QueryResultObject.getLibvirtNetNodeDevName)
NNrA
ConfigManagerzX A wrapper of ConfigParser.ConfigParser to easyly update/save/get/remove configure.
    Nc
Config file(%s) doesn't exist.)
superrg
configParserrj
configFile
_configChanger
	__class__rE
ConfigManager.__init__c
ENUM_UPDATECONFIGri
add_sectionr]
ENUM_DELCONFIGZ
remove_option
optionsZ
remove_section)
sectionrQ
changeTyperE
updateConfig]
ConfigManager.updateConfigc
Nz*Config file(%s) doesn't exist when saving.z+ config(%s) doesn't change since last read.r
save config)
errorrk
debugr|
configFdrE
savej
ConfigManager.savec
ztReturn value struct: [(pciAddress1,{key11: val11, key2:val22,...}), (pciAddress2, {key21: val21,...}), ...]
        )
sectionsrL
kvPairrQ
getConfigurez
ConfigManager.getConfigure)
N)	r
__classcell__rE
ovs-vsctl -t 5 --columns=name,admin_state,duplex,ifindex,link_speed,link_state,mac_in_use,mtu,name,ofport,statistics,status,type,options,error --format=json find Interface type=dpdkz
failed to find ovs dpdk port
headings
datarA
find error on interface %s: %sr
dpdk-devargszEfailed to get pci address from ovs Interface:options:dpdk-devargs: %srb
0000:%s:%s.%sr'
_cache_interafaces
time
_cache_interafaces_timestamprl
json
loads
zipr_
ifacerQ
tmp_addrrE
	loadCache
OVSCache.loadCachec
_CACHE_VALID_INTERVALr
reloadOnTimeout
OVSCache.reloadOnTimeoutc
OVSCache.getIntefaceByNamec
valuesr
OVSCache.getDPDKInterface)
rJz"t
failed to get cache)
_cache_pcisr
CACHE_FILE
generateCache
loadNICPCICacher
PCICache.getNICPCICachec
r8q(i
pcir
fromstringrh
text)
cache_pcisr
rootr
elemrE
PCICache.loadNICPCICachec
generate cachez
no pci scaned.rC
versionZ	timestampr
_collectPCIPersisentDatar<
Element
attribrj
CACHE_FILE_TEMPr
tostringrw
replacer
renamer
valuer
PCICache.generateCachec
vendorIdr
_parseFromLspcivvr5
UNINSTANCE_PCI_DRIVERSr\
queryObjectsZ
queryObjectr
z!PCICache._collectPCIPersisentDatac
}	|	
}	|	
lspci -vvDz
		z			LnkSta:z
Width x(\d+),r'
Z	Subsystemz
Physical Slotr
SR-IOVz
[0-9a-f]r
 (revr
Ethernet controllerz
/sys/bus/pci/devices/%s/physfn)
searchr
grouprM
setdefault
XML_TAG_capabilitiesrW
matchr9
XML_TAG_pciAddress)
pciClassrE
PCICache._parseFromLspcivvc
zE cache descriptin because command lspci is to slow for each pci call Nr
z	lspci -mD
z!lspci -mD output invalid line: %s)
_cache_pci_description
shlexrl
Z	classNamer
PCICache.getPCIDescriptionCache)
d!d"
d#d$
d%d&
d'd(
d)d*
d+d,
d-d.
d/d0
d1d2
d3d4
d5d6
d7d8
d9d:
Z d;d<
Z!d=d>
Z"d?d@
Z#dAdB
Z$dCdD
Z%dEdF
Z&dGdH
Z'dIdJ
Z(dKdL
Z)dMdN
Z*dOdP
Z+dQdR
Z,dSdT
Z-dUdV
Z.dWdX
Z/dYdZ
Z0d[d\
Z1d]d^
Z2d_d`
Z3dadb
Z4dcdd
Z5dedf
Z6dgdh
Z7didj
Z8dkdl
Z9dmdn
Z:dodp
Z;dqdr
Z<dsdt
Z=dudv
Z>dwdx
Z?dydz
Z@d{d|
ZAd}d~
DeviceManagerz
 To handle
    Nc
_getMethodDictionary
_setMethodDictionary
_configManager
_domainRunningPCIs
_domainConfigedPCIs
_ovsInterfaceBondSlaveCount
_deviceConfig
_pciToDomainDict)
configManagerrl
DeviceManager.__init__c
j!t"|
j#t$|
j%t&|
j't(|
j)t*|
j+t,|
j-t.|
j/t0|
j1t2|
j3t4|
j5t6|
j7t8|
j9t:|
j;t<|
j=t>|
j?t@|
jAtB|
jCtD|
jEtF|
jGtH|
jItJ|
jKtL|
jMtN|
jOtP|
jQtR|
jStT|
jUtV|
jWtX|
jYtZ|
j[t\|
j]t^|
j_t`|
jatb|
jct`|
jatd|
jetf|
jgth|
jitj|
jktl|
jmtn|
jotp|
jqtr|
jstt|
jutv|
jwtx|
jytz|
j{t||
j}t~|
XML_TAG_namer
XML_TAG_libvirtNetDevNamerf
XML_TAG_macr]
XML_TAG_addressr
XML_TAG_speedr
XML_TAG_duplexr
XML_TAG_carrierr
XML_TAG_flagsr
XML_TAG_devPortr
XML_TAG_ifindexr
XML_TAG_netTyper
XML_TAG_operstater
XML_TAG_mtur
XML_TAG_rxPacketsr
XML_TAG_txPacketsr
XML_TAG_rxDropedr
XML_TAG_txDropedr
XML_TAG_rxErrorsr
XML_TAG_txErrorsr
XML_TAG_rxBytesr
XML_TAG_txBytesr
XML_TAG_upperr
XML_TAG_physicalNICr_
XML_TAG_isPhysicalr
XML_TAG_driverr
XML_TAG_physicalFunctionr
XML_TAG_virtualFunctionsr
XML_TAG_smartvirtualFunctionsr
XML_TAG_sriovNumr
XML_TAG_sriovMinConfNum
getSRIOVMinConfNum
XML_TAG_sriovSupport
isSRIOVSupport
XML_TAG_fcoeSupport
isFCoESupport
XML_TAG_passthroughSupport
isPassthroughSupport
XML_TAG_dpdkSupport
isDPDKSupport
XML_TAG_smartnetcardSupport
isSmartnetcardSupport
XML_TAG_isSecurityNicr
XML_TAG_freeVFs
getFreeVFs
XML_TAG_usedVFs
getUsedVFs
XML_TAG_isExistVFForSmartSubnetr
XML_TAG_isExistVFForSmartVMr
XML_TAG_isFreePhysicalNetr
XML_TAG_isFreeForPCIPassthoughr
XML_TAG_isFreeForFCoEr
XML_TAG_isFreeForOVSUplinkr
XML_TAG_isUsedForOVSUplinkr
XML_TAG_isFreeForDPDKUplinkr 
XML_TAG_isFreeForSMARTUplinkr!
XML_TAG_isFreeForVLANInterfacer"
XML_TAG_isPhysicalSmartNICr#
XML_TAG_isFullOffloadedr$
XML_TAG_phySwitchIdr%
"XML_TAG_ovsInterfaceBondSlaveCount
getOVSInterfaceBondSlaveCount
XML_TAG_altnamer
QueryObjectrE
getGetMethodW
DeviceManager.getGetMethodc
setSRIOVNumr
getSetMethod
DeviceManager.getSetMethodc
0x37ccZ
0x8086Z
0x5001Z
0x1425TF)
nicZ
shield_device_vender_IdZ
device_vender_IdrE
is_shield_special_NIC
z#DeviceManager.is_shield_special_NICc
rPq@|
q@q4t
rN|	D
sys_class_netr
0x02r1
ovsr6
getSelectionr]
addr
SYS_VIRTUAL_NET)
iterator
selectZ
isSelectZ
iter_net_namesr
nicnameZ
virtual_netsZ
virtual_netrE
	iterNICs2
DeviceManager.iterNICs2c
}	|	|
undefine get key(%s))
keysr
nic_methodr
DeviceManager.getc
)	Nc
qFt	|
z:DeviceManager.set.<locals>.setTogether.<locals>.<listcomp>z
unsupport together set tag: %sz
set {}={} failed on {} not okc
ERROR_CODE_OKr
setDevicesDriverrR
ERROR_CODE_UNSUPPORT_SET_TAGr
format)
resultr
final_value
setTogether
z&DeviceManager.set.<locals>.setTogetherc
setMethod set{} result: {}, {}z
set {}={} failed on {}, erro {}
undefine set key(%s))
	setMethodr
setOneByOne
z&DeviceManager.set.<locals>.setOneByOner'
z/only support 1 data every time for set, data={}r
z unsupport tag in data {} for set)
DeviceManager.setc
z6nic %s use special driver: %s, no need change to vfio!rA
 ERROR_CODE_NO_NEED_CHANGE_DRIVERr
_check_pci_special_driver+
z'DeviceManager._check_pci_special_driverc
] }	|
]X}	|
]0}	|	
z>DeviceManager._check_pci_iommu_group_usage.<locals>.<listcomp>z$/sys/kernel/iommu_groups/%s/devices/rB
x86z4iommu is off in /proc/cmdline or /boot/grub/grub.cfg
aarchz
smmu is offc
parE
pciAddressesrE
isPassthroughPCIr
freer
isFreeToChangeDriverD
zHDeviceManager._check_pci_iommu_group_usage.<locals>.isFreeToChangeDriverz
pci %s in usez
member pci %s in userA
z$member pci %s driver=%s is not free z
member pci %s driver=%s)
iommustatus
SYSTEM_PLATFORM
getLiveKenerlIOMMUStatusZ
getGrubKenerlIOMMUStatus
ERROR_CODE_IOMMU_OFF
getLiveKernelSMMUStatusr
operatorr
ERROR_CODE_PCI_IS_USEDr
$ERROR_CODE_IOMMU_GROUP_MEMBER_IN_USEr
,ERROR_CODE_IOMMU_GROUP_MEMBER_INVALID_DRIVERr
group_other_memberZ
sysfs_groupr 
all_in_groupr
current_driverrE
_check_pci_iommu_group_usage2
z*DeviceManager._check_pci_iommu_group_usagec
q:q"t
<lambda>e
z3DeviceManager._check_pcis_prebind.<locals>.<lambda>
sorted
	itertools
groupby
iterr*
pcisr
getIOMMUFuncr
configuring_pcis_in_groupr
_check_pcis_prebindd
z!DeviceManager._check_pcis_prebindc
kernelz
/sys/bus/pci/drivers_probez
driver probe: echo %s > %sz
/sys/module
z	modprobe z
can't load kernel module %sFZ
new_idZ
bind
new id: echo %04x %04x > %sz	%04x %04xz
  bind: echo %s > %sz
exception: when bind %s to %s)
SYS_PCI_DRIVERSr
old_driverZ
driver_probe_fileZ
new_id_fileZ	bind_filer
_sysfs_driver_bind|
z DeviceManager._sysfs_driver_bindc
unbindz
unbind: echo %s > %sz!exception: when unbind %s from %srA
unbind_filerE
_sysfs_driver_unbind
z"DeviceManager._sysfs_driver_unbindc
ENUM_UNCHANGErp
setDeviceDriver
DeviceManager.setDeviceDriverc
 this is for debug Nz
/var/debug/uio_driverrA
DPDK_UIO_DRIVERr
_getUIOActualDriver
z!DeviceManager._getUIOActualDriverc
rT|	d
z!bind-driver for %s: from %s to %sr6
z!failed to unbind %s from %s to %sr
z!failed to   bind %s from %s to %sr(
z%do nothing, %s bind to same driver %sr
z$failed to rollback unbind %s from %sz"failed to rollback   bind %s to %sc
z2DeviceManager.setDevicesDriver.<locals>.<listcomp>)
"ERROR_CODE_UNABLE_TO_CHANGE_DRIVER)
success_driversr
pciDatar)
DeviceManager.setDevicesDriverc
n4|	t
d	|	
pre-acquire lock '%s'.
timeout
post-acquire lock.r
PCI(%s) does not exists.r'
z)restore: setMethod {}, {}) result: {}, {}rA
z3DeviceManager.restoreByPCIAddress.<locals>.<lambda>r.
failed to restore vfio-pci:%s 
post-release lock.)
lockfile
FileLock
LOCKFILENAMEr
acquirer5
ERROR_CODE_UNKNOWNr
LockTimeout
ERROR_CODE_LOCK_TIMEOUTrK
i_am_locking
release)
lock
	errorDataZ
vfio_driver_pcisZ
pcidatar
Z	pcis_iterZ	pcis_listr
restoreByPCIAddress
z!DeviceManager.restoreByPCIAddressc
)	NrA
operationTypez
operationType is nullr
unknown tag )
ERROR_CODE_PARSER_XMLrK
	xmlString
	operationr
elementrP
subElemrE
parseRequestXml&
DeviceManager.parseRequestXmlc
argrE
z>DeviceManager.getSelection.<locals>.<lambda>.<locals>.<lambda>
allrd
	functionsr\
z,DeviceManager.getSelection.<locals>.<lambda>c
getSelectionFunction)
funcrE
DeviceManager.getSelectionc
}	n\|
}	nD|
}	n(|
z8DeviceManager.getSelectionFunction.<locals>.StrFunObjectc
methodr
thisrd
zADeviceManager.getSelectionFunction.<locals>.StrFunObject.__init__c
__call__P
zADeviceManager.getSelectionFunction.<locals>.StrFunObject.__call__N
StrFunObjectK
z8DeviceManager.getSelectionFunction.<locals>.IntFunObjectc
zADeviceManager.getSelectionFunction.<locals>.IntFunObject.__init__c
zADeviceManager.getSelectionFunction.<locals>.IntFunObject.__call__Nri
IntFunObjectS
advanced_selectz,undefine attr_operator (%s) for element (%s))
lambda )
notr
FDeviceManager.getSelectionFunction.<locals>.<lambda>.<locals>.<lambda>r^
subFunctionsr\
z4DeviceManager.getSelectionFunction.<locals>.<lambda>rs
anyrd
z+undefine attr_operator (%s) of element (%s))
getattrr%
evalr
extend)
funObject_Z
op_rj
newFunObjectZ
newOpZ
attr_operatorr
Z	funObjectr/
z"DeviceManager.getSelectionFunctionc
qTn&t
dictr
elementsr
formatElementrE
z7DeviceManager.formatGetResultXml.<locals>.formatElement
reply
	interfaceZ
entity)
deviceNamer
formatGetResultXml
z DeviceManager.formatGetResultXmlc
qvqn|
)	Nz
ovs-vsctl -t 3 showz
Port z
Interface r
portsr
interfacesr
z+DeviceManager.getOVSInterfaceBondSlaveCountc
za pci && not vf && no upper && no sriov && is pt support device && not pt by others && not altnamer
z$DeviceManager.isFreeForPCIPassthoughc
z4 Return 1 if the PCI device is support FCoE
        Nz&lspci -s %s -vv | grep "Product Name:"r
FCOE_SUPPORT_ADAPTERrL
findrJ
cmd_line
cmd_outputZ
adapterZ
companyrP
DeviceManager.isFCoESupportc
NFzOfcoeadm -i %s 2>/dev/null | grep "Symbolic Name.*QLogic BCM578[14]0.* over %s$"r
when execute command %s)
	isFCoEEth
DeviceManager.isFCoEEthc
z{ support fcoe && pci && not vf && no upper && no sriov && not pt by others && not support dpdk && not FCoEEth && no altnamer
DPDK_DRIVERSr
DeviceManager.isFreeForFCoEc
z\ pci && not vf && no upper && no sriov && not pt by others && not support dpdk && no altnamer
z DeviceManager.isFreeForOVSUplinkc
usedrE
z DeviceManager.isUsedForOVSUplinkc
/dev/vfio/%sTr{
when open %sF)
vfioGroupPathr
isFreeIOMMUGroup	
DeviceManager.isFreeIOMMUGroupc
ovs-vsctl -V -t 1 2>/dev/nullZ
S1020Vz
S1000-VTF)
checkOVSVersion
DeviceManager.checkOVSVersionc
zApci && no upper && not pt by others && support dpdk && no altnamer
support_dpdk_driversrE
z!DeviceManager.isFreeForDPDKUplinkc
z=pci && not vf && no upper && sriov && smartcard && no altnamer
z"DeviceManager.isFreeForSMARTUplinkc
z1 not pci or ( pci && not vf && not pt by others) Tr
z$DeviceManager.isFreeForVLANInterfacec
deprecated API.
            Return 1 only if this is a physical, no-child-vfs, no-libvirt-pci and not in bridge, otherwise 0.
        r
DeviceManager.isFreePhysicalNetc
_isSupportrl
z DeviceManager.isPhysicalSmartNICc
DeviceManager.isFullOffloadedc
get phySwitchId)
DeviceManager.phySwitchIdc
z7 pci in libvirt domain running/configure xml as hostdev
isDomainRunningPCI
isDomainConfiguredPCI
DeviceManager.isPassthroughPCIc
z/DeviceManager.getFreeVFList.<locals>.<listcomp>
vfsrE
getFreeVFListW
DeviceManager.getFreeVFListc
z/DeviceManager.getUsedVFList.<locals>.<listcomp>r
getUsedVFList\
DeviceManager.getUsedVFListc
z1DeviceManager.getConfigVFList.<locals>.<listcomp>r
getConfigVFLista
DeviceManager.getConfigVFListc
getConfigVFIndexsf
DeviceManager.getConfigVFIndexsc
z,DeviceManager.getUsedVFs.<locals>.<listcomp>
domainr\
z0vf %s is not free but not in pciToDomainDict: %s)
_getPciToDomainDictrW
used_vfs_infor
used_vfs
pciToDomainDictr[
DeviceManager.getUsedVFsc
DeviceManager.getFreeVFsc
$ovs-vsctl iface-to-br %s 2>/dev/nullr
/sys/class/net/%s/master
#ovs-vsctl port-to-br %s 2>/dev/nullr'
ovs_dump_vswitch_statistics
get_vswitch_vf_info
queryResultr
bridge
	real_path
masterr
iface_info_listrE
z!DeviceManager.isExistVFForSmartVMc
z%DeviceManager.isExistVFForSmartSubnetc
 _cacheDomainRuningPCIFromLibvirtr
z DeviceManager.isDomainRunningPCIc
$_cacheDomainConfiguredPCIFromLibvirtr
z#DeviceManager.isDomainConfiguredPCIc
s.q t
Nz3/bin/grep -F -l -e "type='hostdev'" -e "<hostdev " z
/*.xml
#libvirt xml file doesn't exists: %s)
_getPCIsFromXML)
runPathr3
grepresultr
xmlrE
getPCIsFromLibvirtDir
z#DeviceManager.getPCIsFromLibvirtDirc
/var/run/libvirt/qemu)
Z	runXmlDirr
z.DeviceManager._cacheDomainRuningPCIFromLibvirtc
/etc/libvirt/qemu)
configXmlDirr
z2DeviceManager._cacheDomainConfiguredPCIFromLibvirtc
Colloct all pci address of <interface type='hostdev'> and <hostdev> from the domain xml.
        Return value struct: [0000:04:00:0, 0000:04:01:2, ...]
        
	domstatusr
0xr(
addressXmlTagrE
zLDeviceManager._getPCIsFromXML.<locals>.extractPCIAddress.<locals>.<listcomp>
busZ
slot
function
extractPCIAddress
z8DeviceManager._getPCIsFromXML.<locals>.extractPCIAddressr
typerA
hostdev
sourcer
findallr
devr
DeviceManager._getPCIsFromXMLc
z| get vm name, uuid and used vfs from vm xml
            return {'domain':'xxxx', 'uuid':'zzzz', 'vfs':[pci0, pci2]}
        c
zXDeviceManager._getDomainAndUsedVFsFromXML.<locals>.extractPCIAddress.<locals>.<listcomp>r
pciAddress_listr
zDDeviceManager._getDomainAndUsedVFsFromXML.<locals>.extractPCIAddressr
z+get domain and UsedVFs failed XML %s failed)
retZ
xml_strr
_getDomainAndUsedVFsFromXML
z)DeviceManager._getDomainAndUsedVFsFromXMLc
sJq<t
stq<|
q|q<t
NzM/bin/grep -F -l -e "type='hostdev'" -e "<hostdev " /var/run/libvirt/qemu/*xmlr
zI/bin/grep -F -l -e "type='hostdev'" -e "<hostdev " /etc/libvirt/qemu/*xmlr
pciToDomainDict: %s)
vm_xmlsZ
running_xmlsZ
config_xmlsr
_createPciToDomainDict
z$DeviceManager._createPciToDomainDictc
 get pci and domain map info for used vfs
            return {'pci0':{'domain':xxxx, 'uuid':zzzz}, 'pci1':{'domain':xxxx, 'uuid':zzzz}, ...}
        )
z!DeviceManager._getPciToDomainDictc
_loadDeviceConfig"
DeviceManager._loadDeviceConfigc
rpz*|
z,DeviceManager._isSupport.<locals>.<listcomp>r
z#exception when get %s support list:r
type_r
DeviceManager._isSupportc
}	|	
z(ovs-vsctl -t 5 port-to-br %s 2>/dev/nullr
zpgrep -rni "path='/var/run/vdpa/device/vdpa_[a-z0-9]\+' mode='server' bridge='%s" /etc/libvirt/qemu/*.xml | wc -lr'
z4DeviceManager.getSRIOVMinConfNum.<locals>.<listcomp>)
max)
MinConfNumr 
maxSRIOVNumr
	usedVFNumZ
vfindexlistZ
maxVFIndexrE
z DeviceManager.getSRIOVMinConfNumc
z6 Return 1 if the PCI device is support SR-IOV
        r
DeviceManager.isSRIOVSupportc
z"DeviceManager.isPassthroughSupportc
DeviceManager.isDPDKSupportc
NFr7
OCTNICT)
device_infor
DeviceManager.isSecurityNicc
z#DeviceManager.isSmartnetcardSupportc
nvt |
r^|	d
n&|	d
 Return (errorcode, configStatus).
        configStatus tell whether the configure file should be updated.
        errorcode could be ERROR_CODE_IOMMU_OFF, ERROR_CODE_INVALID_SRIOV_NUM, ERROR_CODE_NIC_NOT_SUPPORT_SRIOV, ERROR_CODE_OK, ERROR_CODE_EXCEED_TOTAL_SRIOV_NUM, ERROR_CODE_WRITE_SRIOVNUMVFS...
        r
z%set sriov failed, because not supportz$set sriov failed, because not changezNset sriov faild, because the set num %s is smaller than the config vf id is %szDset sriov failed, because %s is not instanced as a netdev, type: %s.z3set sriov failed, because pf(%s) is used by bridge.rA
z9set sriov failed, because pf(%s) is used by linux bridge.z4set sriov failed, because pf(%s) is used by domains.z6set sriov failed, because pf(%s) is used by smartcard.c
z:set sriov failed, maybe because pf(%s) link width(%s) < 8.)
!ERROR_CODE_LINK_WIDTH_NOT_ENGOUTHr=
check_linkwidth
z2DeviceManager.setSRIOVNum.<locals>.check_linkwidthc
zFset %s sriov = %s failed, because write fs 'sriov_numvfs' exception %s)
ERROR_CODE_WRITE_SRIOVNUMVFS)
numStrr
writefs
z*DeviceManager.setSRIOVNum.<locals>.writefsc
)	NZ
falser
set_sriov_options
trust
spoofchk)	r
PCI_SRIOV_OPTIONS_FILErl
trust_optionZ
spoofchk_optionrE
getSriovOptions
z2DeviceManager.setSRIOVNum.<locals>.getSriovOptionsc
truerA
z"ip link set dev %s vf %d trust %s;z%ip link set dev %s vf %d spoofchk %s;z
set sriov options: cmd = %s)
ranger
numr
pf_namerx
setSriovOptions
z2DeviceManager.setSRIOVNum.<locals>.setSriovOptionsz(set sriov failed, because %d vf is used.r
)#r 
ERROR_CODE_INVALID_SRIOV_NUMrp
 ERROR_CODE_NIC_NOT_SUPPORT_SRIOVr<
!ERROR_CODE_EXCEED_TOTAL_SRIOV_NUMr
ERROR_CODE_NON_NETDEVICEr
 ERROR_CODE_PCI_IS_USED_BY_BRIDGEr
#ERROR_CODE_PCI_IS_USED_BY_SMARTCARDro
ERROR_CODE_VF_IS_USED)
minSRIOVConfNum
currentr
configStatusr
DeviceManager.setSRIOVNum)
NN)Er
}	~	n
}	~	0
undefine operation type (%s))
DEVICE_CONFIG_FILEr]
"ERROR_CODE_UNDEINFED_OPERATIONTYPErK
nmrQ
handleNICXMLRequest
qPq@|
Nz start to restore nic config :%s.z
0000:00:00.0)
configsr
kvdictrQ
handleRestore"	
Process device configuration.)
--loglevel)
warnry
z	log level)
choices
help
	--restorer
z to restore pci config when boot )
nargsr%
--xmlz
process xml operation)
Script Execute: r
"%s"rE
main.<locals>.<listcomp>r
unknown args.)
argparse
ArgumentParser
add_argumentr
parse_args
ERROR_CODE_UNKNOWN_CMD_ARGSZ
restorerW
argvZ	topParserrO
main4	
__main__)
device_configZ
nic_configrv
z python3 /opt/bin/get-sysinfo.pycTrm
failed to get sysinfoZ
cpu_info
	cpu_model
cpu_model_namer
unsupport platformaE
                <request>
                    <operationType>set</operationType>
                    <select>
                        <name>eth1</name>
                    </select>
                    <data>
                    <sriovNum>{}</sriovNum>
                    </data>
                </request>
                r
            <request>
                <operationType>get</operationType>
                <iterator>nic,sys_class_net</iterator>
                <select>
                </select>
                <data>
                </data>
            </request>r
xml4r
setsriovargs
qerZ
zdafF)
activer
catch exceptionr
error code: %d, messge: %s;z+execute end : error code %d, time use %.3fs)
sysrr
Z	xml.etreer
	functoolsr
ERROR_CODE_SMMU_OFFZ
ERROR_CODE_UNSUPPORT_PLATFORMr
NET_TYPE_VHOSTUSERZ
PCI_SRIOV_CONF_FILEr
objectrl
util_cvk_logZ
cas_log_init2Z
cas_log_initr
Z	getLoggerZ
setLevelZ
WARNINGZ
errorMessageZ
cmdStartTimerx
returncoderJ
childr
doTestr
_Libvirtrp
getActiveDomainsZ
dsrW
getDomainXMLDescZ
getPCIsFromXMLr3
getInactiveDomainsr
hasattrrj
msgru
timeuserv
exitrE
<module>
