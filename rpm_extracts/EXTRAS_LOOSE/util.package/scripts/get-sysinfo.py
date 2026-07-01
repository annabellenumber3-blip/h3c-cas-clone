# File: get-sysinfo.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/util.package/scripts/get-sysinfo.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

Documentz#/var/log/caslog/cas-get-sysinfo.logz&%(asctime)s %(levelname)s: %(message)sz
%Y-%m-%d %H:%M:%S)
level
filename
formatZ
datefmtc
usage:	%s [-o outfile | -h]
zC  -o	: output xml filename, use stdout as default (also --outfile=)z5  -h	: print this help message and exit (also --help)
print
path
basename
argv
get-sysinfo.py
usage
line start with 
 decode error
split
append
decode
UnicodeDecodeError
logging
error
strip
join)
dmidecode_dateZ
dmidecode_content
liner
dmidecode_code_filter
q qX
qZq |
q q t
<listcomp>)
z&get_dmidecode_info.<locals>.<listcomp>r
isspacer
startswith
lenr
dmidecode_data
section
keyZ	delimeterZ
dmidecode_output_listZ
section_foundZ
section_contentr
resultr
get_dmidecode_info(
}	|	|
n.d t
Processor Information
Manufacturer
Not SupportedZ
PHYTIUMF
cpu_vendor
Versionz
FT-CPU
cpu_model_name)
S5000C)
S2500)
FT-2000)
FT5000C
FT2500
FT2000plusz
/etc/cvk/processor_mapper.conf
cpu_sockets
Core Count
cores_per_socket
Thread Count
threads_per_core
total_cpusr1
2200 MHz
FT1500AZ
1500 MHz
2100 MHzZ
Phytium
cpu_freqT)
upperr
exists
open
read
json
loads
	Exception
items
count
int)
infoZ
manufacturerZ
processor_mapperZ
processor_conf
contentZ	processorZ
key_str_tupleZ
key_str
thread_count_per_cpur>
set_phytium_aarch64_extra_infoB
Z	HiSiliconr-
HUAWEI Kunpengr/
set_huawei_aarch64_extra_info~
)	Nz
/proc/cpuinfoZ
vendorr
model namer/
dmidecode_output
nodeinfoZ
cpuinfor
set_x86_64_extra_info
Current Speedz	Max Speed)
Z	cpu_speedr
set_common_extra_info
qNzvt
>}	|	D
)"Nz
$(which lscpu)T)
shell
stdoutr
z*Can't find lscpu in system, check please!
Architecture:r
	cpu_modelz
CPU(s):r;
CPU MHz:z
 MHzr>
CPU max MHz:z
Socket(s):r4
Core(s) per socket:r7
Thread(s) per core:r9
NUMA node(s):
numa_cellsz
^NUMA node(\d+) CPU\(s\):
numa_map
numa_cell_idZ
aarch64z
$(which dmidecode))
stderrz
/proc/meminfor2
z	MemTotal:
total_mems)
subprocess
Popen
PIPEZ
communicater
returncoder
splitlinesr#
match
grouprG
bool
search
IGNORECASEr
check_outputZ
STDOUTrM
CalledProcessErrorr
outputrA
processrT
retZ
numa_cell_cntr
excrK
get_system_info
sys_infoZ
cpu_inforU
mem_inforZ
Z	numa_infor!
numa_cluster_enableZ
false
trueZ
sub_numa_enableZ
cellrX
numa_map(\d+)Z
cell_idZ
cpus
utf-8)
indent
encoding
XMLDocumentZ
createElementZ
appendChildZ
setAttributerI
rangerG
writeZ
toprettyxmlr
docZ
root_sysZ
top_CPUZ
top_MEMZ
top_NUMA
Z	numa_nodeZ
numa_node_idrK
	write2xml
)	Nr
helpz
outfile=)
--help)
-oz	--outfile)
getopt
GetoptErrorr
xmlfilenameZ
_success
_errorZ
opts
args
argrg
main
__main__r!
xml.dom.minidomr
basicConfig
INFOr
__name__
exitr
<module>
