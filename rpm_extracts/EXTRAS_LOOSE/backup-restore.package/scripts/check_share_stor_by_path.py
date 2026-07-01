# File: check_share_stor_by_path.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/backup-restore.package/scripts/check_share_stor_by_path.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

l	Z	d
j"Z#n
Z#e#e
Z$e$
]bZ%e
Z&e	j
Z(e(d
e)e(
Z-[-n
Z-[-0
ElementTreec
Please input the path
print
exit
check_share_stor_by_path.py
usage
__main__
localz
virsh pool-list --name | xargsT)
shellz
Not find any pool.Z	BR_FAILEDz
virsh pool-dumpxml %sz
Get xml of %s failed.
typez
./target/path
dirZ
sharez
ls %sz[qemu-img info %s | grep -w '^virtual size:' | awk -F '[()]' '{print $2}' | awk '{print $1}'z
Get virtual size of %s failed.
subprocessr
logging
	tracebackZ
util_sh_error_code_loaderZ
util_cvk_logZ	xml.etreer
__name__
argvZ
replace
path
rstripr
sum_sizeZ
check_output
decodeZ
pool_all
errorr
strip
splitZ	pool_nameZ
pool_xmlZ
fromstringZ
xmlStrZ
attribZ	pool_type
find
textZ	pool_pathZ	all_files
fileZ	disk_path
isdirZ
vir_size
intr
BaseExceptionZ
format_excr
<module>
