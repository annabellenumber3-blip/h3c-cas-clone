# File: dpdk-devbind.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/dpdk.package/scripts/dpdk-devbind.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

a+d"a,d"a-g
a.d#d$
Z/d%d&
Z0d'd(
Z1d)d*
Z2d+d,
Z3d-d.
Z4d/d0
Z5d1d2
Z6d3d4
Z7d5d6
Z8dJd7d8
Z9dKd9d:
Z:dLd;d<
Z;dMd=d>
Z<d?d@
Z=dAdB
Z>dCdD
Z?dEdF
Z@dGdH
ZAeBdIk
glob)
exists
basename)
joinZ
Class
Vendor
DeviceZ
SVendorZ
SDeviceZ
8086Z
0b30Z
177dz	a04b,a04dZ
a053z	a0dd,a049Z
a051Z
a037Z
1af4Z
1110z	a0f9,a0faz	a0fb,a0fcZ
a081Z
a0f4z16f20,6f21,6f22,6f23,6f24,6f25,6f26,6f27,6f2e,6f2fZ
2021Z
0b00Z
0b25Z
201cZ
347e)
igb_uio
vfio-pciZ
uio_pci_genericFc
z>t	|
vfio_pcir	
/sys/module/c
path
isdirr
sysfs_pathr
dpdk-devbind.py
<listcomp>f
z$module_is_loaded.<locals>.<listcomp>c
/lib/modules/z
modules.builtinc
splitextr
modr
z4Warning: cannot read list of built-in kernel modules)
loaded_modulesr
listdir
platform
uname
releaser
open
IOError
print)
moduleZ
sysfs_modsr
filename
module_is_loadedY
Checks that igb_uio is loadedc
Name
Foundr
driverr
z!check_modules.<locals>.<listcomp>r&
Nz4Warning: no supported DPDK kernel modules are loaded
filec
dpdk_driversr%
b_flagr!
stderr)
modsr
check_modules|
z@return true if a device is assigned to a driver. False otherwise
Driver_str
devices)
dev_idr
has_driver
s*q |
z6This function gets additional details for a PCI device
lspciz
-vmmks
utf8
_str
	Interfacez
/sys/bus/pci/devices/%s/
Ssh_if
Active)
subprocess
check_output
splitlines
decode
split
stripr
walkr
probe_lspciZ
deviceZ
extra_info
line
name
value
base
dirs
get_pci_device_details
z!This function clears any old dataNr1
clear_data
	d	d
This function populates the "devices" dictionary. The keys used are
    the pci addresses (domain:bus:slot.func). The values are themselves
    dictionaries - one for each NIC.r5
-DvmmnnkZ
Driverr0
ModuleZ
Module_str
Slotr6
route
169.254)
startswith)
<lambda>
z$get_device_details.<locals>.<lambda>
devFr<
*Active*r@
,%sN)
device_type_match
keys
dictr2
rsplit
rstrip
lstrip
network_devicesr
filter
range
append
copy
updaterN
itemsr+
remove)
devices_typerX
Z	dev_linesZ
dev_linerI
value_listZ
ssh_ifrT
rt_info
_ifr(
modulesr
get_device_details
z%device_type_match.<locals>.<listcomp>r
valuesrZ
param_countZ
match_count
keyrj
Take a device "name" - a string passed in by user to identify a NIC
    device, and determine the device id - i.e. the domain:bus:slot.func - for
    it, which can then be used to index into the devices array
0000:r<
zCUnknown device: %s. Please specify device in "bus:slot.func" formatN)
ValueError)
dev_namerl
dev_id_from_dev_name
z@Unbind the device identified by "dev_id" from its current driverz7Notice: %s %s %s is not currently managed by any driverrP
Device_strr<
zMWarning: routing table indicates that interface %s is active. Skipping unbindz
/sys/bus/pci/drivers/%s/unbindr0
,Error: unbind failed for %s - Cannot open %s)	r2
exit
write
close)
forcerX
unbind_one,
Bind the device given by "dev_id" to the driver "driver". If the device
    is already bound to a different driver, it will be unbound firstNr?
zKWarning: routing table indicates that interface %s is active. Not modifyingr)
z/Notice: %s already bound to driver %s, skippingr;
'/sys/bus/pci/devices/%s/driver_override
wz*Error: bind failed for %s - Cannot open %sz
%sz=Error: bind failed for %s - Cannot write driver %s to PCI ID z
/sys/bus/pci/drivers/%s/new_idz	%04x %04xr
z@Error: bind failed for %s - Cannot write new PCI ID to driver %sz
/sys/bus/pci/drivers/%s/bindr
Tz4Error: bind failed for %s - Cannot bind to driver %srw
bind_onerN
saved_driverr#
tmpr
z/Unbind method, takes a list of device locationsr
dpdkr0
mapru
dev_listr{
unbind_all
)	z-Bind method, takes a list of device locationsznError: Driver '%s' does not look like a valid driver. Did you forget to specify the driver to bind devices to?
z!Error: Driver '%s' is not loaded.Nr}
replacer
bind_all
Displays to the user the details of a list of devices given in
    "dev_list". The "extra_params" parameter, if given, should contain a string
     with %()s fields in it for replacement by the named fields in each
     device's dictionary.z
<none>Nz
%s '%s %s' %srP
%s '%s'rU
sortr
titler
extra_params
stringsrX
display_devices
}	t	d	|
No '%s' devices detectedr;
z'%s devices using DPDK-compatible driverz(drv=%(Driver_str)s unused=%(Module_str)sz
if=%(Interface)s z
%s devices using kernel driverz3drv=%(Driver_str)s unused=%(Module_str)s %(Active)sz
Other %s devicesz
unused=%(Module_str)s)
device_name
if_fieldZ
kernel_drvZ
dpdk_drvZ
no_drvrl
n_devs
msgZ
if_textr
show_device_status
Function called when the script is passed the "--status" option.
    Displays to the user what devices are bound to the igb_uio driver, the
    kernel driver or to no driver)
allZ
NetworkT)
basebandr
Baseband)
cryptor
Crypto)
eventr
Eventdev)
mempoolr
Mempool)
compressr
Compress)
miscr
Misc (rawdev))
regexr
RegexN)
status_devr
baseband_devices
crypto_devices
eventdev_devices
mempool_devices
compress_devices
misc_devices
regex_devicesr
show_status6
Returns a list containing either:
    * List of PCI B:D:F matching arg, using shell wildcards e.g. 80:04.*
    * Only the passed arg if matching list is emptyz
/sys/bus/pci/devicesrs
pci_glob.<locals>.<listcomp>)
	path_join)
argr
_glob
pathsr
pci_globT
)$zaParses the command-line arguments given by the user and takes the
    appropriate action for eachz4Utility to bind and unbind devices from Linux kernela
Examples:
---------
To display current device status:
        %(prog)s --status
To display current network device status:
        %(prog)s --status-dev net
To bind eth1 from the current driver and move to use vfio-pci
        %(prog)s --bind=vfio-pci eth1
To unbind 0000:01:00.0 from using any driver
        %(prog)s -u 0000:01:00.0
To bind 0000:02:00.0 and 0000:02:00.1 to the ixgbe kernel driver
        %(prog)s -b ixgbe 02:00.0 02:00.1
description
formatter_class
epilogz
--status
store_truez.Print the current status of all known devices.)
action
helpz
--status-devz'Print the status of given device group.)
choicesz
--bindZ
DRIVERz7Select the driver to use or "none" to unbind the device)
metavarr
--unbindz)Unbind a device (equivalent to "-b none")z
--forcez
Override restriction on binding devices in use by Linux"
WARNING: This can lead to loss of network connection and should be used with caution.
DEVICE
Device specified as PCI "domain:bus:slot.func" syntax or "bus:slot.func" syntax.
For devices bound to Linux kernel drivers, they may be referred to by interface name.
nargsr
nonezXError: No action specified for devices. Please give a --bind, --ubind or --status optionr)
Error: No devices specified.N)
argparse
ArgumentParser
RawDescriptionHelpFormatter
add_argument
add_mutually_exclusive_group
parse_argsr
status_flag
statusr{
force_flagZ
bindr,
unbindr2
argsr!
print_usagerx
extendr
parserZ
bind_group
new_argsr
z*do the actual action requested by the user)
NoneN)
do_arg_actions
program main functionr~
whichr5
stdoutr.
z-'lspci' not found - please install 'pciutils'N)
devnullrA
callr-
retr
main
__main__)
F)Cr-
os.pathr
network_classZ
acceleration_classZ
ifpga_classZ
encryption_classZ
intel_processor_classZ
cavium_ssoZ
cavium_fpaZ
cavium_pkxZ
cavium_timZ
cavium_zipZ
avp_vnicZ
octeontx2_ssoZ
octeontx2_npaZ
octeontx2_dmaZ
octeontx2_reeZ
intel_ioat_bdwZ
intel_ioat_skxZ
intel_ioat_icxZ
intel_idxd_sprZ
intel_ntb_skxZ
intel_ntb_icxra
__name__r
<module>
