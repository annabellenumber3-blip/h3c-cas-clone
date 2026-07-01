# File: util_package_check.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/util.package/scripts/util_package_check.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

PackageAdapterc
selfr
util_package_check.py
__init__
PackageAdapter.__init__c
/etc/cvk/virt_installed_listr
get_persistent_file
z"PackageAdapter.get_persistent_fileNc
/opt/bin/os_lsb_release -isT)
shell
stderrZ
H3LinuxZ
CentOSz
unsupported cvk system.
subprocess
check_outputZ
STDOUT
splitlines
bytes
decode
_fetch_rpm
print
exit)
filepathZ
distri
lineZ
distri_resultr
fetch
PackageAdapter.fetchc
r|q^|
	d	|
dpkg -lr
unexpect line from dpkg: %s
open
readr
splitr
strip
logging
warn
append
itemsr
_fetch_dpkg
PackageAdapter._fetch_dpkgc
srqV|
rpm -qa
unexpect line from rpm: %sr
%s-%sr
rsplitr%
PackageAdapter._fetch_rpm)
__name__
__module__
__qualname__r
	CheckToolc
adapterr
CheckTool.__init__r
postfixr
_get_persistent_fileK
CheckTool._get_persistent_fileTNc
<lambda>Q
z.CheckTool._fetch_from_system.<locals>.<lambda>
key)
sort)
_fetch_from_systemN
CheckTool._fetch_from_systemc
sBq0|
rdt	
)	Nr
unexpect line from file: %sr
z,CheckTool._fetch_from_file.<locals>.<lambda>r=
path
isfiler!
	readlinesr$
_fetch_from_fileT
CheckTool._fetch_from_filec
%s	%sr
oner
<listcomp>l
z,CheckTool._write_to_file.<locals>.<listcomp>
joinr!
write)
list_r
contentr+
_write_to_fileh
CheckTool._write_to_filec
/dev/stdout)
tostdoutr,
initq
CheckTool.initc
namesr
z$CheckTool.remove.<locals>.<listcomp>)
removeu
CheckTool.removec
q<d	d
<dictcomp>|
z$CheckTool.update.<locals>.<dictcomp>c
z$CheckTool.update.<locals>.<listcomp>r
z"CheckTool.update.<locals>.<lambda>r=
res_file
res_systemr,
updatez
CheckTool.updatec
operator
eqr(
less
more
mismatch
_check
CheckTool._checkc
====== %s : %3d =======z
 %-25s %10sr
titlerM
print_list
z*CheckTool._print_check.<locals>.print_listra
z(CheckTool._print_check.<locals>.<lambda>rb
%s != %sr
z(=== less:%3d, more:%3d, mismatch:%3d ===z
====== all things ok =======rg
_print_check
CheckTool._print_checkc
res_1
res_2ra
check
CheckTool.checkc
filesrl
	checkfile
CheckTool.checkfilec
.record)
record
CheckTool.recordc
}	|	j
z+CheckTool.commit_change.<locals>.<dictcomp>r
z+CheckTool.commit_change.<locals>.<listcomp>c
z)CheckTool.commit_change.<locals>.<lambda>r=
popr.
record_fileZ
res_beforeZ	res_afterra
commit_change
CheckTool.commit_change)
--persistent)
z,argument must be init,update,remove or check)
argvr5
op_argvZ
persistentr
main
<module>
