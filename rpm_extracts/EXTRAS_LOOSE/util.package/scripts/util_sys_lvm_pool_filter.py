# File: util_sys_lvm_pool_filter.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/util.package/scripts/util_sys_lvm_pool_filter.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

Z e	e 
rVe	e
Z$e%e$
Z([(nzd
Z([(0
Z*[*nBd
Z*[*0
Z,[,n
Z,[,0
NAMEzE	 util_sys_lvm_pool_filter.py Print logical storage pool informationsZ
SYNOPSISz
	$0 [ -h ] [SystemVG]Z
DESCRIPTIONz
	 -h: Helpz$	 SystemVG The System VG to be avoid)
print
util_sys_lvm_pool_filter.py
usage
nodeTypeZ	TEXT_NODE
append
data
join)
nodelist
noder
getText
__main__Z
sys_lvm_pool_filter
The VGs %s will be filtered.zAvirsh find-storage-pool-sources logical | grep -v "<device path="z
find logical pool failed.r
source
namez
The VG is %s.z
VG %s is going to be filtered.)
indentZ
newl
xml.dom.minidomZ
xmlZ
util_cvk_logr
__name__Z
cas_log_init2
argvZ
exitZ	filter_vgZ
logging
debug
popenZ
file_get
	readlinesZ	str_lines
close
errorr
xml_bufferZ
domZ
minidomZ
parseStringZ
lvs_pool_infoZ
childNodesZ
source_childsZ
getElementsByTagNameZ
source_nodesr
Z	name_infoZ
removeChildZ
toprettyxmlZ
lvm_storage_pool_infor
unlink
IOErrorZ
ValueError
BaseException
<module>
