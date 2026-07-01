# File: inspection_mem_cpufreq_init.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/util.package/scripts/inspection_mem_cpufreq_init.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

l	Z	d
/etc/cvk/inspection_uis.confc
/proc/meminfo
0z	MemTotal:
z inspection: init get memTotal %sFZ
memoryZ
memlaststartupZ
memstartupz
w+z+inspection: and session and init %s successz
inspection: init %s successz8inspection: failed to init memory conf, fail message: %s)
open
startswith
split
logging
info
configparserZ
ConfigParser
read
confFileZ
has_sectionZ
add_section
write
	Exception
	exception
str)
fileZ
memTotal
lineZ
conf
fZ	mem_start
inspection_mem_cpufreq_init.py
memory_conf_init"
}	~	d
}	~	0
NzGdmidecode -q -t  memory | grep -E "Size:|Locator:|Speed:|Manufacturer:"T
shellr
z&/etc/cvk/inspection_memory_detail_info
Sizez
%d:%s:%s:%s:%s
Locator
Speed
Manufacturer
Unknownz
NO DIMM)
z?inspection: init /etc/cvk/inspection_memory_detail_info successz*failed to get memory detail infomation, %s)
subprocess
check_output
splitlinesr
decoder
stripr
cmdStr
outputZ
mem_dic
valr
memory_detail_info_initB
z]initialize cpu frequence infomaition when service started
        Args:
        returns:
    z-dmidecode -t processor | grep "Current Speed"Tr
/etc/cvk/inspection_cpufreqr
z4inspection: init /etc/cvk/inspection_cpufreq successNz5inspection: failed to init cpu file, fail message: %s)
cpufreq_info_inith
z?main function of initialize
        Args:
        returns:
    Z
inspection_ha_initZ
cas_haz1inspection: init memory and cpufreq files successN)
cas_log_init2Z
cas_log_initr.
initmemcpufreqfilesz
__main__z'/var/log/cas_ha/inspection_init_err.logr
z$init_inspection_mem_cpufreq err: %s
stat
rer#
shutil
	linecache
typesZ
util_cvk_logr
argparser
__name__r
closer
<module>
