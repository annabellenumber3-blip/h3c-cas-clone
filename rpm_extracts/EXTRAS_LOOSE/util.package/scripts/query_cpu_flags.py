# File: query_cpu_flags.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/util.package/scripts/query_cpu_flags.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

Nz;<cpuFlags><result>{0}</result><flags>{1}</flags></cpuFlags>)
format)
result
messageZ
xml_info
query_cpu_flags.py
create_xml
shell
stderr
stdoutr
Failed to execute cmd: %s: %sz!Successful to execute cmd: %s: %s)	
subprocess
Popen
PIPEZ
communicate
returncode
logging
error
strip
debug)
cmdstr
cmd_excute
archr
failed to get cpu archZ
aarch
x86z
cpu arch is invalid)	r
	Exception
ERROR_CODE_UNKNOWN
	errorcode
bytes
decode
find
CPU_ARCH_ARM
CPU_ARCH_x86)
	remote_ip
cmdr
cpu_arch
get_cpu_arch
Nz,cat /proc/cpuinfo |grep "^flags" | tail -n 1z/cat /proc/cpuinfo |grep "^Features" | tail -n 1r
failed to get cpu flags
index)
cmd_liner
Z	cpu_flagsr#
get_cpu_flags/
get cpu flags error. %s)
	traceback
format_exc
exit)
argv
flagsr
main>
__main__Z
query_cpu_flag)
xml.etree.ElementTreeZ
etreeZ
ElementTreeZ
util_cvk_logZ
ERROR_CODE_OKr
__name__Z
cas_log_init2
printr-
<module>
