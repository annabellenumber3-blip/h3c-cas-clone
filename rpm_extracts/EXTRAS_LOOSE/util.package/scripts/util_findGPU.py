# File: util_findGPU.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/util.package/scripts/util_findGPU.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

m	Z	
getsize)
ElementTree)
/etc/cvk/remove_audio_flagc
NAMEz
	 util_findGPU.pyZ
DESCRIPTIONz
	 find GPU of the CVKZ
SYNOPSISz8	 <type>: 'all':find all GPUs; 'free':find all free GPUs)
print
util_findGPU.py
usage
snt	
Nz&[util_findGPU.py]removeAudio(), begin.z/lspci | grep 'Audio.*NVIDIA' | awk '{print $1}'T
shellz#echo 1 > /sys/bus/pci/devices/0000:z
/remover
z$[util_findGPU.py]removeAudio(), end.
BaseException %s.
logging
debug
subprocess
check_output
split
call
time
sleep
path
exists
REMOVE_AUDIO_FLAG
mknod
BaseException
error)
all_address
address
betr
removeAudio$
rLq6|
Nz"[util_findGPU.py]findAll(), begin.
<list>
@lspci | grep -e 'VGA.*NVIDIA' -e '3D.*NVIDIA' -e 'VGA.*AMD' || :Tr
    <gpu bus='
' slot='
' function='
' vendor='
</list>z [util_findGPU.py]findAll(), end.r
stripr
all_info
info
bus_slot
vendor
slot
functionr!
findAll5
}	|	d
)!Nz#[util_findGPU.py]findFree(), begin.r#
virsh list --namez
virsh dumpxml z
.//devices/hostdev/source
typeZ
GPUr
0xr&
z![util_findGPU.py]findFree(), end.r
fromstring
findall
findZ
attrib
replace
appendr
vm_all_addressZ
vmsZ
vmr 
domainZ
all_source
sourceZ
gpuZ
addrr5
is_findZ
vm_addrr4
findFreeM
__main__Z
cas_gpu_resourcer
freez
remove-audio)
shutilZ
os.pathr
sysr
Z	xml.etreer
util_cvk_logr
__name__
retZ
cas_log_init2r
argv
exitr0
<module>
