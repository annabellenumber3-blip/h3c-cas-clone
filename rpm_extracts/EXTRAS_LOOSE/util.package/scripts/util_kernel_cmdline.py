# File: util_kernel_cmdline.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/util.package/scripts/util_kernel_cmdline.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

l	Z	d
d d!
d"d#
Z"e#d%k
e$d&
e%d&
Z&d'Z'z
e(j)d
zDe,e+d(
rje+j-Z&n
Z&e.e+
Z'e/
e1e2e+
Z+[+n
Z+[+0
3d*e&e'f
4d+e&e'f
############################################################################
#    File Name: util_grub_config.py
# Date Created: 2016-11-15
#       Author: hanhuanle h10623
#  Description: get or set the kernel load argument
#       Return: 0 if succeffully, other with errors
#      Caution:
#-----------------------------------------------------------------------------
#  Modification History
#  DATE        NAME             DESCRIPTION
##############################################################################
/etc/default/grub
GRUB_CMDLINE_LINUXz
/boot/grub2/grub.cfgz
/boot/efi/EFI/H3Linux/grub.cfgz
/tmp/grub.cfgz
/boot/grub/grub.cfgz
.cmdline_backup
/proc/cmdline
open
read
strip)
line
util_kernel_cmdline.py
getProcCmdline,
shlex
split
startswith)
getParameter2
 %s=%s(\s)z
 %s(\s)z
sub)
delParameter:
%s=%sz
 quiet\sz/failed to find ' quiet\s' in line '%s' when addz
( quiet\s)z
 %s\1
search
	Exception
!ERROR_CODE_FIND_GRUB_ENTRY_FAILED
	errorcoder
replace)
valuer
line2r
addParameterB
setParameterM
/etc/os-releaser
VERSION="8 (jessie)"TF)
path
isfiler	
isNingsiS
shutil
copy)
originalZ
backupr
_backupFileForDebugZ
stdout
stderrZ	close_fds)
subprocess
callr
PIPE)
cmdliner
call_cmd^
ETCGrubCmdLinec
superr6
__init__
_grub_cmdline
_original_lines
_get_grub_cmdline
self
	__class__r
ETCGrubCmdLine.__init__c
)	Nr
ETC_DEFAULT_GRUBr	
splitlinesr:
z ETCGrubCmdLine._get_grub_cmdlinec
ETCGrubCmdLine.getParameterc
ETCGrubCmdLine.delParameterNc
ETCGrubCmdLine.addParameterc
ETCGrubCmdLine.setParameterc
get_cmdline
ETCGrubCmdLine.get_cmdlineFc
%s="%s"z7GRUB_CMDLINE_LINUX="%s" is unchange, skip generate grubz
/tmp/etc_grub
$going to replace grub line %s to %s.r
move file %s to %sz
grub2-mkconfig -o %s
sync)
BOOT_EFI_GRUB2_CFG
BOOT_GRUB2_CFG
BOOT_GRUB_CFGr
logging
info
ERROR_CODE_OKr	
writer-
moverC
BOOT_GRUB_CFG_BACKUP)
newline
outfile
recreateZ
write_line
tempfilenamer
saveGrubCmdline
ETCGrubCmdLine.saveGrubCmdline)
NNF)
__name__
__module__
__qualname__r8
__classcell__r
BOOTGrubCmdLinec
filename
_proc_cmdline
	_contents
_entryIndices
_entryIndexr9
_getGrubCmdline)
BOOTGrubCmdLine.__init__c
BOOTGrubCmdLine.getParameterc
BOOTGrubCmdLine.delParameterNc
BOOTGrubCmdLine.addParameterc
BOOTGrubCmdLine.setParameterc
_getProcCmdline
BOOTGrubCmdLine._getProcCmdlinec
z$find more than 1 entries in grub: %sr
z3failed to find live entry root, entry indices: %s .c
_getImageRootra
currentRootr=
<listcomp>
z3BOOTGrubCmdLine._getGrubCmdline.<locals>.<listcomp>z6failed to locate current live entry in grub, find %s .z)get kernel command from grub,line %d: %s.)
_searchGrubDefaultEntryr_
lenrO
warn
strrf
liveKernelEntryInicesr%
BOOTGrubCmdLine._getGrubCmdlinec
z7find live kernel start command: version (%s), root (%s)r
Fz>find default kernel start command in grub: %s, at line %d : %s)
	readlines
_getVersionAndImageRootre
debug
	enumerate
_isCurrentKenerlStartCommand
_isDefaultKenerlStartCommand
appendr
)	r=
entryIndices
contentsr
indexr
foundr
z'BOOTGrubCmdLine._searchGrubDefaultEntryc
\s+root=([^\s]+)\sr
zFfailed to find one disk root in kernel boot cmdline: root=%s, root: %s)
findallrm
rootr
BOOTGrubCmdLine._getImageRootc
z /vmlinuz-([^\s]+).*root=([^\s]+)r
group)
z'BOOTGrubCmdLine._getVersionAndImageRootc
Nz(\s*linux\s+(/boot)?/vmlinuz-[\d\w.-]+\s+
\s+root=
\s+recovery\s+
matchr
	reformat1
	reformat2
	reformat3r
z,BOOTGrubCmdLine._isDefaultKenerlStartCommandc
Nz,\s*linux\s+(/boot)?/vmlinuz-%s\s+.*root=%s\sr
kernelVersionr}
z,BOOTGrubCmdLine._isCurrentKenerlStartCommandc
BOOTGrubCmdLine.get_cmdlineFc
"}	|	
)	zoSet the the iommu of kernel loading command in grub.cfg.
        Return 0 for success. 81 for unchange
        Nr
z keep the Grub line(%s) Unchange.)
endswithr_
tempfileZ
mkstempr(
fdopenrR
joinr)
stat
S_IMODE
st_mode
chmodr/
Z	errorCodeZ
grubChange
fdrX
accessr
BOOTGrubCmdLine.saveGrubCmdline)
NNF)
d d!
d"d!
r:d#d!
d$d!
q n||
qHnZ|
d&}	|	|
))Nz<Process kernel cmdline, /proc/cmdline or /boot/grub/grub.cfg)
descriptionz
--getr
z"get kernel argument from grub file)
nargs
helpz
--del
del_z%delete kernel argument from grub file)
destr
--addz add kernel argument to grub filez
--setz set kernel argument to grub filez
--recreate
store_truez
recreate grub.cfg any way)
actionr
--outputr
zMoutfile the modified kernel cmdline or default to overwrite the original filez
Script Execute: rB
parsed args : %s.c
main.<locals>.<listcomp>c
=%s)
argparse
ArgumentParser
add_argumentrO
argv
parse_argsrr
KernelCmdLine
addr&
setr'
getr
printrG
outputrW
Z	topParser
argsrx
resultr
main8
/boot/grub2/
__main__Z
kernel_cmdliner
catch exceptionz
error code: %d, messge: %s;z
error code: %d, messge: %s)
__doc__r(
util_cvk_logr
ERROR_CODE_UNKNOWNZ
ERROR_CODE_INVALID_ARGUMENTr!
objectr6
isdirr
cas_log_init2Z
cas_log_initrx
errorMessager
hasattrr"
	exceptionr
type
errorrr
exitr
<module>
