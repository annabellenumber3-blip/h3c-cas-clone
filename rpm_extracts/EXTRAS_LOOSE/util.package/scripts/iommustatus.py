# File: iommustatus.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/util.package/scripts/iommustatus.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

e d"
Z!d#Z"z
Z#e#
rjd$
Z%d%
Z&d&
Z'd&
Z(d%
Z)e%e&e'e(e)f
]2Z*e
Z!e+d'e,e*
d(e,e!
zDe0e/d)
e/j1Z!n
Z!e,e/
Z"e2
e+e4e/
Z/[/n
Z/[/0
6e!e!
Z!e!e
7d+e!e"f
8d,e!e"f
)-aj
############################################################################
#    File Name: iommustatus.py
# Date Created: 2015-1-21
#       Author: hanhuanle h10623
#  Description: get or set the iommu for kernel load argument
#        Input: --iommu, --iommu=1, --iommu=0
#       Output: the iommu status when "--iommu"
#       Return: 0 if succeffully, other with errors
#      Caution:
#-----------------------------------------------------------------------------
#  Modification History
#  DATE        NAME             DESCRIPTION
##############################################################################
shell
stderr
stdoutr
Failed to execute cmd: %s: %sz!Successful to execute cmd: %s: %s)
subprocess
Popen
PIPEZ
communicate
decode
returncode
logging
error
strip
debug)
iommustatus.py
execute#
/proc/cpuinfo
rZ	vendor_id
intel_iommu
	amd_iommu)
GenuineIntelZ
AuthenticAMDZ
HygonGenuineZ
CentaurHaulsz;failed to get iommu flag because of unkown CPU vendorid: %s)	
open
	readlines
startswith
splitr
	Exception
ERROR_CODE_UNKNOWN_CPU
	errorcode)
cpuinfoZ
vendorid
line
flag
_getIOMMUFlagByCPUType.
zEReturn bool to tell whether the iommu of running kernel is on or off.r
kernel_cmdlineZ
getProcCmdline
getParameter)
	iommuFlagr&
onoffr
getLiveKenerlIOMMUStatus=
zCReturn int to tell whether the smmu of running kernel is on or off.z1ls -l /sys/devices/platform | grep -qF "arm-smmu")
code
errr
getLiveKernelSMMUStatusD
KernelCmdLiner-
kcr/
getGrubKenerlIOMMUStatusI
Nz%/sys/bus/pci/drivers/vfio-pci/*:*:*.*z
devices %s is bind to vfioTF)
globr
info)
pcisr
isVFIOInUseP
NzOovs-vsctl -- --if-exists get Open_vSwitch . other_config:dpdk-init|tr -d "\"\n"
truez
dpdk is in used.TF
isDPDKInUseW
}	|	t
driverZ
model)
pciZ
mdev
hostdevZ
devicesr?
Z	interfaceF
type
nameZ
vfioTz
vfio-pci)
ElementTree
parse
find
findallr!
list
keys)
vm_xmlZ
typedictZ
tree
devZ
ch_hostZ
ch_ifZ
chlist
flogZ
checkPCIorSRIOV^
/etc/libvirt/qemu/*.xmlFTz
pci or sriov is in used)
vm_lstrJ
isPCIorSRIOVInUses
Nz-lspci | grep Eth | grep -q "Virtual Function"r
sriov is enableTFr=
isEnableSRIOV
iommu
ptz*failed to turn off iommu because of in use)
setParameterr;
ERROR_CODE_IOMMU_IN_USEr$
delParameterZ
saveGrubCmdline)
setGrubKenerlIOMMUStatus
}	|	D
Process iommu configuration.)
description
--iommu
appendzhset the iommu status in grub.cfg, 1 means on, 0 off. output the grub.cfg status if the value is omitted.)
nargs
choices
actionr@
helpz
--liveiommu
store_truez=get the running kernel iommu status.output 1 means on, 0 off.)
Script Execute: 
parsed args : %s.z python3 /opt/bin/get-sysinfo.pycz
failed to get sysinfoZ
cpu_info
	cpu_modelr
cpu_model_nameZ
x86Z
aarchz
unsupport platform)
argparse
ArgumentParser
add_argument
intr
join
argv
parse_argsr
ERROR_CODE_OKr
ERROR_CODE_UNKNOWNr$
fromstring
tagZ
attribr!
Z	liveiommur
printr5
Z	topParser
args
resr
xmlr4
root
childr]
statusr/
main
__main__Z
iommu_switchr
z	--iommu 0z	--iommu 1z
handle z
Result: r$
catch exceptionz
error code: %d, messge: %s;z
error code: %d, messge: %s):
__doc__r_
xml.etree.ElementTreeZ
etreerC
util_cvk_logZ
util_kernel_cmdliner,
Z ERROR_CODE_FAILED_TO_PARSER_GRUBrQ
ERROR_CODE_IOMMU_NOT_SUPPORTr
__name__Z
cas_log_init2Z
cas_log_initrl
errorMessageZ
doTestr 
strre
hasattrr$
	exceptionr@
Z!ERROR_CODE_FIND_GRUB_ENTRY_FAILEDr!
exitr
<module>
