# File: dpdk-pmdinfo.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/dpdk.package/scripts/dpdk-pmdinfo.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

ELFError)
byte2int)
ELFFile
Vendorz
    Class for vendors. This is the top level class
    for the devices belong to a specific vendor.
    self.devices is the device dictionary
    subdevices are in each device.
    c
        Class initializes with the raw line from pci.ids
        Parsing takes place inside __init__
        r
split
replace
rstrip
name
devices)
selfZ	vendorStr
dpdk-pmdinfo.py
__init__%
Vendor.__init__c
        Adds a device to self.devices
        takes the raw line from pci.ids
        r
stripr
Device)
	deviceStr
devIDr
	addDevice.
Vendor.addDevicec
printr	
items
report)
devr
Vendor.reportc
%s  Unknown Device)
hexr
devidr
find_device?
Vendor.find_deviceN)
__name__
__module__
__qualname__
__doc__r
        Class for each device.
        Each vendor has its own devices dictionary.
        r
%s  r
subdevices)
Device.__init__c
	%s	%s)
subID
subdevr
Device.reportc
        Adds a subvendor, subdevice to device.
        Uses raw line from pci.ids
        r
%s:%sN)
	SubDevicer%
subDeviceStrr
splZ
subVendorIDZ
subDeviceIDZ
subDeviceNamer
addSubDeviceY
Device.addSubDevicec
ffffz
(All Subdevices)z
(Unknown Subdevice))
subvenr&
find_subidg
Device.find_subidN)
    Class for subdevices.
    c
        Class initializes with vendorid, deviceid and name
        N)
vendorID
deviceIDr
vendor
devicer
SubDevice.__init__c
		%s	%s	%s)
SubDevice.reportN)
PCIIdsz
    Top class for all pci.ids entries.
    All queries will be asked to this class.
    PCIIds.vendors["0e11"].devices["0046"].    subdevices["0e11:4091"].name  =  "Smart Array 6i"
    c
        Prepares the directories.
        Checks local data file.
        Tries to load from local, if not found, downloads from web
        r
version
date
vendors
contents
	readLocal
parse)
filenamer
PCIIds.__init__c
Reports the vendors
        N)
reportVendors
PCIIds.reportVendorsNc
        Reports everything for all vendors or a specific vendor
        PCIIds.report()  reports everything
        PCIIDs.report("0e11") reports only "Compaq Computer Corporation"
        N)
vIDr;
PCIIds.reportc
%s Unknown Vendor)
find_vendor
PCIIds.find_vendorc
Date:r(
findr
content
findDate
PCIIds.findDatec
r8q$q$|
sDq$q$|
data/%s-pci.ids not foundr
PCIIds.parsec
        Reads the local file
        
utf-8)
encodingN)
open
	readlinesr6
PCIIds.readLocalc
        Loads database from local. If there is no file,
        it creates a new one from web
        r
idsfiler
	loadLocal
PCIIds.loadLocal)
z4 Given a search path, find file with requested name 
path
join
exists
abspath)
search_pathrN
	candidater
search_file
ReadElfzF display_* methods are used to emit output into the output stream
    c
 file:
                stream object with the ELF file to read
            output:
                output stream to write to
        N)
elffile
outputZ
_dwarfinfoZ
_versioninfo)
filerW
ReadElf.__init__c
 Retrieve a section given a "spec" (either number or name).
            Return None if no such section exists in the file.
        N)
intrV
num_sectionsZ
get_section
ValueErrorZ
get_section_by_name
force_unicode
force_bytes)
specZ
sectionr
_section_from_spec
ReadElf._section_from_specc
pci_idsr
%s (%s) : %s (%s) %s)
pcidbr=
pmdinfo
pretty_print_pmdinfo
ReadElf.pretty_print_pmdinfoc
paramsz
PMD PARAMETERS)
tagZ
kmodz
PMD KMOD DEPENDENCIES
PMD NAME: r
%s: %srg
PMD HW SUPPORT:z$VENDOR	 DEVICE	 SUBVENDOR	 SUBDEVICEz
0x%04x	 0x%04x	 0x%04x		 0x%04xr
index
json
loads
raw_outputr
dumps
KeyErrorrb
mystringZ
optional_pmd_inford
parse_pmd_info_string
ReadElf.parse_pmd_info_stringc
zm Display a strings dump of a section. section_spec is either a
            section number or a name.
        Nr
PMD_INFO_STRINGr(
data
lenr
section_specr^
dataptr
endptrro
display_pmd_info_stringsB
z ReadElf.display_pmd_info_stringsc
	DT_NEEDEDZ
librte_eal)
	iter_tagsr[
entry
d_tag
needed)
find_librte_eala
ReadElf.find_librte_ealc
}	|	t
.dynamic
LD_LIBRARY_PATHr
 :/usr/lib64:/lib64:/usr/lib:/lib)
NNz Scanning for autoload path in %s
.rodatar
DPDK_PLUGIN_PATHr(
environ
get_dt_runpathrT
stdout
AttributeErrorr
closers
scanelfZ
scanfile
libraryr^
eallib
	ldlibpathZ
dtrrs
search_for_autoload_pathi
z ReadElf.search_for_autoload_pathc
DT_RUNPATHr
runpath)
dynsecrg
ReadElf.get_dt_runpathc
zq Look to see if there are any DT_NEEDED entries in the binary
            And process those if there are
        r
librte_rL
%s is no an ELF filer
process_dt_needed_entriesrx
libelfr
z!ReadElf.process_dt_needed_entriesN)
decode
latin-1)
hasattr
callabler
encoder
Hw Support for library %sr
listdir
OSErrorrO
isdir
scan_autoload_path
isfilerG
IOErrorrl
autoload_path
dirs
dpathrX
readelfr
t	yZ
    search the specified application or path for a pmd autoload path
    then scan said path for pmds and report hw support
    z
Must specify a file nameNr
Unable to parse %sz!No autoload path configured in %sz
Found autoload path %s in %sz
Discovered Autoload HW Support:)
ElfErrorr
Z	dpdk_pathrX
scannedfiler
scan_for_autoload_pmds
d d!d"
r6d'}
d-|	
}	~	n
}	~	0
).Nz	./pci.idsZ
Linuxz
/usr/share/misc/pci.idsz
/usr/share/hwdata/pci.idsZ
FreeBSDz
/usr/local/share/pciids/pci.idsz
/usr/share/misc/pci_vendorsz3usage: %(prog)s [-hrtp] [-d <pci id file>] elf_filez
Dump pmd hardware support info)
usage
descriptionz
--raw
store_truerl
dump raw json strings)
action
dest
helpz
--table
tbloutz/output information on hw support as a hex table)
--pcidb
pcifilez/specify a pci database to get vendor names from
FILE)
default
metavarz
--plugindir
pdirz
scan dpdk for autoload plugins
elf_filez
driver shared object file)
Pci DB file not foundr'
File not foundr
ELF error: %s
platform
systemrM
argparse
ArgumentParser
add_mutually_exclusive_group
add_argument
parse_argsrl
exitr
stderr
write)
streamZ
pcifile_default
parser
group
argsr
Z	myelffilerX
main%
__main__)
elftools.common.exceptionsr
elftools.common.py3compatr
elftools.elf.elffiler
insertrl
objectrU
<module>
