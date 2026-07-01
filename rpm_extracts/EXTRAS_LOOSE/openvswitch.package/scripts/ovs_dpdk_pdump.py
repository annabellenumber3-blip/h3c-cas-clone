# File: ovs_dpdk_pdump.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/openvswitch.package/scripts/ovs_dpdk_pdump.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

/tmpz
/usr/sbin/ovs-vswitchdz
/usr/bin/dpdk-pdumpFc
shell
stderr
stdoutZ	close_fdsr
z'sucess to execute: %s, out: %s, err: %sz1failed to execute: %s, out: %s, err: %s, code: %sz
cmd: %s, result: %s)
isinstance
split
subprocess
Popen
PIPEZ
communicate
decode
strip
returncode
logging
debug
error
	Exception)
cmdr	
raise_exception
code
/./openvswitch.package/scripts/ovs_dpdk_pdump.py
command_output
execute_command(
ovs-vswitchdz
ovs do not support dpdk.z*%s not exists, need to install dpdk-pdump.)
ERROR_CODE_OK
path
islink
OVS_VSWITCHD_PATH
basename
readlink
replace
ERROR_CODE_OVS_UNSUPPORT_DPDK
print
DPDK_PDUMP_PATH
exists
ERROR_CODE_PDUMP_NOT_EXISTZ
src_pdump_path)
pdump_pathZ
vswitchd_versionr
find_pdump,
Nzaovs-vsctl -t 2 --format=table --column=options --no-headings --data=bare find Interface type=dpdkT
zHdpdk-devargs=([0-9a-fA-F]{4}:[0-9a-fA-F]{2}:[0-9a-fA-F]{2}\.[0-9a-fA-F])
 --pci-whitelist %s)
search
group)
dpdk_iface_optionsZ
pci_whitelist
option
matchZ
pci_addressr
get_pci_whitelist_cmd@
rz|	d	|
z7ovs-vsctl -t 2 --if-exists --bare get interface %s typeTZ
dpdkzGovs-vsctl -t 2 --if-exists --bare get interface %s options:dpdk-devargs
device_id=%sz=device: %s not exists in ovs or is not a dpdk physical iface.z	,queue=%sz
,queue=*z
path: %s not exists.z
%Y%m%d_%H_%M_%S
%s_rx_%s.pcapz
,rx-dev=%s/%sz*result pcap file: %s is store in path: %s.
%s_tx_%s.pcapz
,tx-dev=%s/%sz
,rx-dev=%s/%s,tx-dev=%s/%sz1result pcap file: %s and %s is store in path: %s.z
 --pdump %s)
ERROR_CODE_INVALID_ARGUMENTr,
isdigit
DEFAULT_PDUMP_DIRr$
ERROR_CODE_DEST_PATH_NOT_EXIST
time
strftime)
device
queue
rxtx
destdirr0
cmd_strr
device_typeZ
device_pci_id
	pdump_cmdZ
time_nowZ
rx_pcap_nameZ
file_resultZ
tx_pcap_namer
get_pdump_cmdM
Nz(input argument error: device is requiredr
z* --server-socket-path=/var/run/openvswitchz
 --z
dpdk-pdump cmd: %s.)
infor$
execv)
devicesrE
device_listrD
whitelist_cmdZ
server_socket_path
argsr
dpdk_pdump|
Dump packets of dpdk interface.)
descriptionz
--devicezQname of dpdk physical ifaces in ovs, example: ["pci_xx_xx_x, pci_xx_xx_x, ...."].)
type
helpz
--queuezOqueue id of the device on which packets should be captured, maybe [all/0/1...].z
--rxtx)
txrxz direction which to dump packets.)
choicesrQ
z	--destdirz.dir path to store pacp files, default is /tmp.z
Script Execute: 
parsed args : %s.)
argparse
ArgumentParser
add_argumentr
join
argv
parse_argsr
top_parserrM
main
__main__r
catch exceptionz
error code: %d, messge: %s;z
error code: %d, messge: %s)
FF)$rT
util_cvk_logr#
ERROR_CODE_UNKNOWNr>
__name__Z
cas_log_init2Z
cas_log_initr0
errorMessagerY
	exceptionr
exitr
<module>
