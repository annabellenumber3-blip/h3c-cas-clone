# File: rdma_nic_data_upload.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/util.package/scripts/rdma_nic_data_upload.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

l	Z	d
Z'd!d"
Z(d#d$
Z)d%d&
Z*d'd(
Z+d)d*
Z,d+d,
Z-d-d.
Z.d/d0
Z/d1d2
Z0d3d4
rze1
Timerz(/var/log/caslog/rdma_nic_data_upload.log
z"/etc/linux-engine-networks/vswitchz"/etc/linux-engine-networks/subnetsc
errCode
message)
print
json
dumps
exit)
code
rdma_nic_data_upload.py
exit_msg'
NzX%(asctime)s.%(msecs)03d %(filename)s %(funcName)s [%(lineno)d] %(levelname)s %(message)sz
%Y-%m-%d %H:%M:%S)
fmtZ
datefmt)
loggerZ
setLevel
logging
DEBUGZ	FormatterZ
FileHandlerZ
setFormatterZ
addHandler)
logfiler
log_init-
shell
stderr
stdoutZ	close_fdsr
z6cmd: %s run failed.(out: %s, err: %s, return_code: %s)z
cmd %s run failed(err: %s)z0Running cmd: %s on host success.(out:%s, err:%s))
isinstance
shlex
split
subprocess
Popen
PIPEr
kill
startZ
communicate
cancel
decode
returncoder
errorr
CMD_RUNNING_NOK
debug)	
cmdr
timeout_sec
log_dbgZ
retrun_check
timer
errr
execute_cmd7
ovs-vsctl list-brr
stripr!
br_nameZ
br_listr
is_ovs_bridgeP
RdmaNicDatac
dict
_data
selfr
__init__U
RdmaNicData.__init__c
item
valuer
add_nic_itemX
RdmaNicData.add_nic_itemc
pop)
del_nic_item[
RdmaNicData.del_nic_itemc
get^
RdmaNicData.getc
%sr=
	to_stringa
RdmaNicData.to_stringN)
__name__
__module__
__qualname__r<
}	|	s
z' {'x2': 'mlx5_125', 'x1': 'mlx5_126'}  zQovs-vsctl -t 2 --bare --columns=name find interface other_config:used_by_subnet=1r
zUpython3 /opt/bin/ovs_smartnic.pyc lsvdpa --verbose | egrep -w '%s' | awk '{print $5}'
|z#/sys/class/net/%s/device/infinibandz+smart nic subnet %s not have infiniband dirz&ls /sys/class/net/%s/device/infinibandz#smart nic subnet %s not have ibdevsz
%s/*z
.oldz
cat %s | grep ^uplinks
smart nic %s not have ibdevsz
used rdma ibdevs: %s)
join
path
existsr
warning
glob
LINUX_NETWORK_PATH
endswith
basename
lenr5
resultr-
vf_usedZ	subnetdev
devZ
ibdevsZ
netcfg_files
uplinksZ
uplinks_listZ
uplinkr
get_used_rdma_nets_infod
open
readr3
filerV
textr
read_vlaue_from_file
z1get_value_from_file.<locals>.read_vlaue_from_file
%s not exist
value %s readed from file %s)
get_value_from_file
)	N)
port_xmit_dataZ
port_rcv_packetsZ
port_rcv_dataZ
unicast_xmit_packetsZ
unicast_rcv_packetsZ
multicast_xmit_packetsZ
multicast_rcv_packetsZ
port_rcv_errorsZ
port_xmit_discardsZ
port_rcv_constraint_errorsZ
port_xmit_constraint_errorsZ
port_xmit_wait)
np_cnp_sentZ
np_ecn_marked_roce_packetsZ
rp_cnp_handledZ
rp_cnp_ignoredZ
packet_seq_errZ
out_of_bufferZ
out_of_sequenceZ
rx_read_requestsZ
rx_write_requestsZ
roce_adp_retransZ
roce_adp_retrans_toz/ls /sys/class/net/%s/device/infiniband/%s/portsr
z8/sys/class/net/%s/device/infiniband/%s/ports/%s/countersz
%s/%sr]
z;/sys/class/net/%s/device/infiniband/%s/ports/%s/hw_counters)	r2
subnet
ibdev
data_objZ
port_countersZ
port_hw_countersr-
portZ
counters_dir
namer?
hw_counters_dirr
get_ports_data
]>}	|	
N)OZ
rx_prio0_bytesZ
rx_prio1_bytesZ
rx_prio2_bytesZ
rx_prio3_bytesZ
rx_prio4_bytesZ
rx_prio5_bytesZ
rx_prio6_bytesZ
rx_prio7_bytesZ
rx_prio0_packetsZ
rx_prio1_packetsZ
rx_prio2_packetsZ
rx_prio3_packetsZ
rx_prio4_packetsZ
rx_prio5_packetsZ
rx_prio6_packetsZ
rx_prio7_packetsZ
tx_prio0_bytesZ
tx_prio1_bytesZ
tx_prio2_bytesZ
tx_prio3_bytesZ
tx_prio4_bytesZ
tx_prio5_bytesZ
tx_prio6_bytesZ
tx_prio7_bytestx_prio0_packetsZ
tx_prio1_packetsZ
tx_prio2_packetsZ
tx_prio3_packetsZ
tx_prio4_packetsZ
tx_prio5_packetsZ
tx_prio6_packetsZ
tx_prio7_packetsZ
rx_prio0_pauseZ
rx_prio1_pauseZ
rx_prio2_pauseZ
rx_prio3_pauseZ
rx_prio4_pauseZ
rx_prio5_pauseZ
rx_prio6_pauseZ
rx_prio7_pauseZ
rx_prio0_pause_durationZ
rx_prio1_pause_durationZ
rx_prio2_pause_durationZ
rx_prio3_pause_durationZ
rx_prio4_pause_durationZ
rx_prio5_pause_durationZ
rx_prio6_pause_durationZ
rx_prio7_pause_durationZ
tx_prio0_pauseZ
tx_prio1_pauseZ
tx_prio2_pauseZ
tx_prio3_pauseZ
tx_prio4_pauseZ
tx_prio5_pauseZ
tx_prio6_pauseZ
tx_prio7_pauseZ
tx_prio0_pause_durationZ
tx_prio1_pause_durationZ
tx_prio2_pause_durationZ
tx_prio3_pause_durationZ
tx_prio4_pause_durationZ
tx_prio5_pause_durationZ
tx_prio6_pause_durationZ
tx_prio7_pause_durationZ
rx_prio0_buf_discardZ
rx_prio1_buf_discardZ
rx_prio2_buf_discardZ
rx_prio3_buf_discardZ
rx_prio4_buf_discardZ
rx_prio5_buf_discardZ
rx_prio6_buf_discardZ
rx_prio7_buf_discardZ
rx_prio0_cong_discardZ
rx_prio1_cong_discardZ
rx_prio2_cong_discardZ
rx_prio3_cong_discardZ
rx_prio4_cong_discardZ
rx_prio5_cong_discardZ
rx_prio6_cong_discardZ
rx_prio7_cong_discardZ
net_device_namez2ethtool -i %s | grep driver | awk -F: '{print $2}'r
net_device_typez
/sys/class/net/%s/address
mac_addressz(ip -o -4 addr show %s | awk '{print $4}'
ethtool -S %sF)
replacer!
splitlines)
subnet_countersr-
typeZ
macrk
counters
lines
line
countrd
get_subnet_dev_data
hostnamer
Z	host_namezAdmidecode -t system | grep 'Serial Number' | awk -F: '{print $2}'Z
host_snzSgrep 'cpu ' /proc/stat | awk '{usage=($2+$4)*100/($2+$4+$5)} END {print usage "%"}'
	cpu_usagez1free -m | awk 'NR==2{printf "%.2f%%", $3*100/$2}'
memory_usage)
	HOST_NAMEr2
get_host_info
Nz,/sys/class/net/%s/device/infiniband/%s/portsz!subnet %s ibdev %s not have ports
time
listr6
roundry
appendrC
Z	data_list
datar
get_rdma_subnet_nic_data
itemsr
extend)
nic_data_listZ
subnets_infor`
collect_rdma_nic_data(
	ipaddressZ
ip_address
version
socketZ	inet_ptonZ
AF_INET)
addr4r
is_valid_ip1
iportr
is_valid_port<
Nonerd
cluster_name
cluster_id)
argv
infor
get_cluster_infoH
)	Nz:http://%s:%s/rdmaAnalysis/rdma/oneStore/acceptOneStoreInfoz
content-typez
application/jsonz
url: %s, data: %sr
headers
timeoutz
status_code: %s, text: %sz
http post request failed(%s))
requestsZ
postZ
status_coder[
	Exceptionr*
HTTP_POST_NOK)
payload
urlr
payload_js
data_uploadU
)	Nz
invalid sa server ip or portz$invalid sa server ip(%s) or port(%s)rz
	send_time
sa_origin_nicstat_b
topic
clusterr
INVALID_ARGSr8
runb
z	127.0.0.1Z
80)	r
LOG_FILEr8
testo
rdma nic data upload)
descriptionz
--ipTrk
sa server ip)
required
dest
helpz
--portrc
sa server portz
--cluster_namer
cluster namez
--cluster_idr
cluster id)
func)
argparse
ArgumentParser
add_argument
set_defaultsr
parse_args)
top_parser
argsr
all args: %sr
running okz
running failed(%s))
NOK)
main
__main__)
TNTT)2rK
	threadingr
Z	getLoggerrE
PARSE_ARGS_NOKZ
GET_CLUSTER_NOKr
LINUX_SUBNET_PATHr
objectr6
<module>
