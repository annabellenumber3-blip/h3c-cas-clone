# File: inspection_ovs.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/util.package/scripts/inspection_ovs.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

l	Z	d
d e8
d!d"
d"e8
d#d$
d$e8
d%d&
d&e8
Z=d'd(
Z>e?d)k
Fd,e@eE
ElementTree)
cas_log_init2
/sys/bus/pci/devicesz
/sys/class/netz
/proc/net/devz"/etc/linux-engine-networks/vswitchz"/etc/linux-engine-networks/subnetsZ
0xffffffffZ
MbP?)
vfio-pciZ
igb_uioZ
uio_pci_genericZ
vswitch0z
0x1425:0x5001z
0x8086:0x37ccc
Toolsc
superr
__init__
self
	__class__
inspection_ovs.pyr
Tools.__init__c
Nz%/opt/bin/db-auth.sh -k hzbdbkz1 printz
^DB_USER=(.*))
flagsr
^DB_PASS=(.*)z
^DB_PORT=(.*)z	127.0.0.1Z
vservice)
host
portZ
database
user
passwordz#sql execute failed.(sql:%s, err:%s))
popen
read
search
	MULTILINE
group
psycopg2
connect
cursorZ
executeZ
fetchall
close
	Exception
logging
	exception
str)	
sqlZ
cmd_resultZ
db_userZ
db_pwZ
db_portZ
dbr"
results
seasql_execute\
Tools.seasql_executeFc
shell
stderr
stdoutZ	close_fdsr
z1failed to execute: %s, out: %s, err: %s, code: %s)
isinstancer'
split
subprocess
Popen
PIPEZ
communicate
returncoder%
error)
cmdr,
raise_exception
coder
command_outputo
Tools.command_outputc
decode)
execute_command{
Tools.execute_commandc
z5ssh failed to execute: %s, out: %s, err: %s, code: %s)
exec_commandZ
channelZ
recv_exit_statusr
ssh_execute_cmd
Tools.ssh_execute_cmdc
failed to read file: %s)
path
exists
openr
Z	file_pathZ
content
	read_file
Tools.read_filec
/root/.ssh/id_rsa
rootz
/home/%s/.ssh/id_rsaz#host_ip:%s, username:%s, keyfile:%sz./bin/bash /opt/bin/get_system_port.sh ssh_portT
hostnamer
usernameZ
key_filename
timeoutZ
allow_agentZ
look_for_keysz failed to create ssh to host: %s)
infor
strip
paramikoZ	SSHClientZ
set_missing_host_key_policyZ
AutoAddPolicyr!
ERROR_CODE_OKr$
ERROR_CODE_SSH_ERROR)	
host_iprL
keyfiler6
cmd_resr
resr
sshclient_connection
Tools.sshclient_connectionc
sshclient_close
Tools.sshclient_closec
component-type
component-namez
utf-8
target-name
result-code
health-levelrN
Object
setr'
COMPONENT_TYPE_CLUSTER
COMPONENT_TYPE_POOL
base64Z	b64encode
encoder=
item_id
component_type
component_name
target_name
result_code
health_level
result_info
resultr
get_result_dictionary
Tools.get_result_dictionaryc
Z	diagnosisrX
catch exception)
getrP
ElementZ
SubElement
textZ
tostringr=
ERROR_CODE_XML_ERROR)
result_dict
levelrU
reply
xml_strZ
result_listrk
get_result_xml
Tools.get_result_xml)
__name__
__module__
__qualname__r
staticmethodr+
__classcell__r
itemsr_
Object.__init__c
hasattr)
Object.hasNFc
getattr
setattr)
default
creater
Object.getc
Object.setc
__dict__r
__repr__
Object.__repr__c
__str
Object.__strc
list
Object.listc
lenr
Object.len)
_Object__strr
d!d"
d#d$
d%d&
d'd(
d)d*
d+d,
Utilityc
Utility.__init__c
/etc/hostname)
get_host_name
Utility.get_host_namec
NzWselect NAME from TBL_CLUSTER where ID=(select CLUSTER_ID from TBL_HOST where NAME='%s')r
cluster_namer
get_cluster_name
Utility.get_cluster_namec
Nz-select NAME,IPADDR,HOST_USER,PW from TBL_HOSTr
None
name
cluster
	manage_ipr
passwdr
append)
cluster_hosts_info
cluster_hostsZ	host_infor
get_cluster_cvk_hosts_info
z"Utility.get_cluster_cvk_hosts_infoc
/opt/bin/cvm_role_tool.shz//bin/bash /opt/bin/cvm_role_tool.sh is_cvm_roleTrI
true)
isfiler
cvm_roler
is_cvm_host0
Utility.is_cvm_hostc
)	Nr
router
zip)
route_infor
route_objectr~
ip_versionr
get_route_info;
Utility.get_route_infoc
)	Naq
        <request>
            <operationType>get</operationType>
            <iterator>nic</iterator>
            <select><isPhysical>1</isPhysical></select>
            <data>
                <pciAddress/>
                <driver/>
                <name/>
                <venderId/>
                <deviceId/>
                <description/>
                <flags/>
                <carrier/>
                <operstate/>
                <speed/>
                <duplex/>
                <mtu/>
                <address/>
                <permaddr/>
                <sriovNum/>
                </data>
        </request>r
handleNICXMLRequestr
pciAddressr?
<lambda>h
z&Utility.get_nic_info.<locals>.<lambda>)
keyz)failed to get nic info because exception.)
device_configr
sortr$
requestXMLr
get_nic_infoL
Utility.get_nic_infoc
r.t	|
r.|	|
ethtool %sTrI
Supported link modesz
Advertised link modesz
Advertised pause frame usez
^(\d+)base.*/.*r
splitlines
startswithr
compiler
nic_nameZ
parsing_supportZ
parsing_advertisedZ
support_speedZ
advertised_speedr6
line
patternr
speedr
get_nic_full_speedo
Utility.get_nic_full_speedc
devices/pciz
devices/platform)
listdir
NET_DEVICE_PATHrC
join
islink
readlinkr
nic_ifacesr
nic_pathr
get_nic_ifaces
Utility.get_nic_ifacesc
pidof %sr
monitoring pid z
/proc/%s/cmdliner
process_binaryr6
pidsZ
monitorIndexZ
monitor_pidr
get_process_pids
Utility.get_process_pidsc
/usr/sbin/ovs-vswitchd
ovs-vswitchdz
/usr/sbin/ovsdb-serverz
ovsdb-server)
process_pids
vswitchd_pidsZ
ovsdb_pidsr
get_ovs_process_pids
Utility.get_ovs_process_pidsc
sudo ovs-vsctl -VTrI
S1020Vz
S1000-VF
ovs_verr
check_is_s1020v
Utility.check_is_s1020vc
Nz sudo ovs-vsctl -t 2 br-exists %sTr
vswitchr6
is_ovs_vswitch_exists
Utility.is_ovs_vswitch_existsc
/proc/statr
.0r@
<listcomp>
z/Utility.get_system_cpu_info.<locals>.<listcomp>r
sum)
cpuinfor
get_system_cpu_info
Utility.get_system_cpu_infoc
/proc/%s/statc
z0Utility.get_process_cpu_info.<locals>.<listcomp>
tupler0
pidr
get_process_cpu_info
Utility.get_process_cpu_infoc
Z	cpu_info1Z	cpu_info2
	deta_hostZ
cpu_numZ
deta_process_userZ
deta_process_sysZ
user_cpu_sageZ
sys_cpu_sager
get_process_cpu_usage
Utility.get_process_cpu_usagec
d	t	|
Inter-|Z
facer?
rx_packetsr
rx_errorr
rx_dropr
tx_packets
tx_error
tx_drop
TRAFFIC_FILE_PATHr
ifacesr
ifacer
get_traffic_info
Utility.get_traffic_infoc
}	|	D
ping6Z
pingz
%s %s -c %d -i %s -w %sz
packets transmittedzF\d+\s+packets transmitted,\s+(\d+)\s+received,\s+(\d+)%\s+packet loss,r
matchr
dst_ipr
connectionZ
ping_numrM
internalZ
ping_cmdr6
Z	statisticZ
revicedr
check_network_connection
z Utility.check_network_connectionc
)	Nz
ip -o address | grep -v fe80r
inet6r
/)	r
ip_addrs
ip_addrs_infor
ip_addr_listZ
dev_namer
ip_address
mask
ip_addr_tmp
ip_addr_itemr
get_host_network_ip
Utility.get_host_network_ipc
rhqNd
entityr
ipv4Z
ipv6r
z!Filed to get network from xml(%s))
fromstringr
tagZ
attribro
elementr
subElemr
get_network_ip_from_xml
Utility.get_network_ip_from_xmlc
NzZpython /opt/bin/netcfgtool.pyc xml  '<request><operatorType>list</operatorType></request>')
 get_bridge_and_subnet_network_ip'
z(Utility.get_bridge_and_subnet_network_ipc
/var/run/libvirt/qemu/*.xmlZ	domstatus
domainZ
devices
	interface
target
devr?
macZ
address
Filed to read running vm xmls.)
globr
find
findallro
Z	vm_ifacesZ
running_vm_xmls
filename
xmlrH
iface_namer
vm_namer
Z	iface_macr*
get_viface_name_to_vm-
Utility.get_viface_name_to_vm)
OVSUtilityc
OVSUtility.__init__c
Nz9sudo python /opt/bin/util_get_bridge_info.pyc --type bondTrI
bond bridger
bridger
lacp
mode
slavesz	bond namez	bond modez
lacp statusz
member r
bondsr6
linesr
Z	last_bondr
ovs_get_bondsP
OVSUtility.ovs_get_bondsc
Nz!sudo ovs-vsctl -t 2 port-to-br %sTrI
Z	port_namer6
ovs_get_port_bridgel
OVSUtility.ovs_get_port_bridgec
q"q"d
Nz-sudo ovs-appctl -T 5 dpif-netdev/pmd-rxq-showTrI
pmd threadr
port:r
Z	pmd_theadr
last_theadr
dpdk_cpu_usageZ
thead_infor
ovs_get_dpdk_cpu_usages
z!OVSUtility.ovs_get_dpdk_cpu_usagec
dpdk
dpdkvhostuserclientzKsudo ovs-vsctl -t 2 --bare --columns=name,statistics find interface type=%sTrI
pciZ
rx_droppedr
Z	rx_errorsr
tx_droppedr
Z	tx_errorsr
)	r^
dpdk_ifaces_info
iface_typer6
iface_info
itemr
get_dpdk_traffic_info
z OVSUtility.get_dpdk_traffic_infoc
/sudo bash /opt/bin/ovs_bridge.sh list --vswitchTrI
bridgesr
get_ovs_bridge_list
OVSUtility.get_ovs_bridge_listc
Nzjsudo ovs-vsctl -t 2 --bare -- --id=@uuid get Interface %s -- --columns=name find Port Interfaces{\>=}@uuidTrI
iface_to_port
OVSUtility.iface_to_portc
r&d	t
r&t	
"sudo ovs-vsctl -t 2 list-ifaces %sTrI
netdevzEsudo ovs-vsctl -t 2 --if-exists get interface %s options:dpdk-devargs
devicez
/devices/pciz
/devices/platform)
PCI_DEVICE_PATHr
iface_listr
iface_pathr
get_bridge_uplink_port
z!OVSUtility.get_bridge_uplink_portc
%s/%sz5sudo cat %s/%s | grep ^uplinks | awk -F= '{print $2}'T
 z6sudo ovs-vsctl -t 2 --if-exists get port %s interfacesrI
, z;sudo ovs-vsctl -t 2 --bare --columns=name list interface %s)
LINUX_NETWORK_PATHr
uplinksr
iface_uuid_listZ
iface_uuidr
get_bridge_uplink_ifaces
z#OVSUtility.get_bridge_uplink_ifacesc
}	|	D
Usudo ovs-vsctl -t 2 --bare --if-exists get interface %s error type status:driver_namer
patch
spi-
datapath_type
systemr
virtual
physicalr5
extendr
get_patch_virtual_ifacesr
internal_ifaces
virtual_ifaces
physical_ifaces
error_ifaces
spi_ifaces
uplink_ifacesr6
driver
tbr_virtual_ifacer
get_linux_network_bridge_info
z(OVSUtility.get_linux_network_bridge_infoc
NzKovs-vsctl -t 2 --bare --columns=name find interface other_config:origin_br=T)
patch_virtual_ifacesr
z#OVSUtility.get_patch_virtual_ifacesc
r4|	
zBsudo ovs-vsctl -t 2 --bare --if-exists get bridge %s datapath_typeTrI
bridge_infor
get_ovs_bridge_info
OVSUtility.get_ovs_bridge_infoc
Nz%sudo timeout 5 ovs-appctl fdb/show %sTrI
mac_entriesr
get_ovs_mac_entriesc
OVSUtility.get_ovs_mac_entriesc
zIsudo ovs-vsctl -t 2 --if-exists get bridge %s other_config:mac-table-sizeTrI
default_mac_table_sizer6
mac_table_sizer
get_ovs_mac_table_sizel
z!OVSUtility.get_ovs_mac_table_sizec
ssh_flag
Truer
z.sudo bash /opt/bin/ovs_bridge.sh list --subnetz
sudo cat /sys/class/net/%s/mtuz
%s++%s
ip_%sr
mask_%s
False)
cluster_cvks_network_infor
	host_list
cvks_network_infor
	host_namerT
subnet_ifacesr
network_infoZ
subnet_infoZ
ip_addrr
"get_cluster_cvk_hosts_vswitch_infot
z-OVSUtility.get_cluster_cvk_hosts_vswitch_infoc
NzHsudo ovs-vsctl -t 2 --bare --columns=name find interface admin_state!=upTrI
zGsudo ovs-vsctl -t 2 --bare --columns=name find interface link_state!=up)
union)
admin_state_down_ifacesZ
link_state_down_ifacesZ
ovs_down_ifacesr
get_ovs_down_ifaces
OVSUtility.get_ovs_down_ifaces)
d!d"
d#d$
d%d&
d'd(
DiagProcessc
_config_health_level
_select_id
_resultr
_host_namer
	_nic_infor
_nic_ifacesr
_ovs_bridgesr3
_bridge_infor
_bonds_listrC
_ovs_down_ifacesr
_ovs_process_pids
_cluster_cvk_hosts
_cluster_cvks_network_infor
_vm_ifaces)
	select_idr
DiagProcess.__init__c
nic_driverZ
nic_statusr
nic_moder
bridge_iface_status
bridge_mtuZ
bond_lacp_configZ
bond_statusZ
network_route
processZ
process_cpu_usageZ
trafficZ
cluster_networkZ
cluster_mtuZ
cluster_maskr
_check_nic_driver
CHECK_NIC_HEALTH_ID
_check_nic_status
_check_nic_mode
_check_bridge_iface_status
CHECK_BRIDGE_HEALTH_ID
_check_bridge_mtu
_check_bond_lacp_config
CHECK_BOND_HEALTH_ID
_check_bond_status
_check_route_overlap
CHECK_NETWORK_HEALTH_ID
_check_ovs_process
CHECK_PROCESS_HEALTH_ID
_check_process_cpu_usage
_check_network_traffic
CHECK_TRAFFIC_HEALTH_ID
execute_functionrR
_check_manage_connection
CHECK_CLUSTER_HEALTH_ID
_check_network_connection
_check_cluster_mtu
_check_cluster_maskr
handle_output)
cvk_diagnose_listrU
cvm_diagnose_listr
handle_diagnose
DiagProcess.handle_diagnosec
print)
DiagProcess.handle_outputc
begin to check item: %s.)
Z	func_listrU
funcrd
DiagProcess.execute_functionc
}	nV|
venderIdr
deviceIdz!net pci device: %s has no driver.r
descriptionz$net pci device: %s use error driver.)
COMPONENT_TYPE_HOSTrI
HEALTH_LEVEL_NORMAL
RESULT_CODE_SUCCESSro
SPECIAL_DEVICEr%
RESULT_CODE_FAILED
HEALTH_LEVEL_ERROR
DPDK_DRIVERr
check_nic_driver_list
nic_infori
nic_dirverrg
nic_pci_address
result_dictionaryr
DiagProcess._check_nic_driverc
carrierZ
onz"nic: %s doesn't connect the cable.Z	operstateZ
nic: %s is down.)
IFF_UPr%
warningrw
HEALTH_LEVEL_WARNr
check_nic_status_listr{
DiagProcess._check_nic_statusc
z5nic: %s, speed %d,  doesn't reach the full speed: %s.z!speed: %sM, advertised speed: %sM
duplex
unknownZ
fullz/nic: %s, duplex: %s, doesn't use the full mode.
duplex: %s)
SPEED_UNKNOWNr%
check_nic_mode_listr{
full_speedr
DiagProcess._check_nic_modec
z2DiagProcess._check_bond_status.<locals>.<listcomp>c
offZ
negotiatedz$lacp is not negotiated in bridge: %s
lacp: %sr
disabledr
slaver
z%all slaves are disabled in bridge: %sc
disable uplink:r
z&some slaves are disabled in bridge: %sc
enabledr
z0different slave speed in bridge %s, %s:%d, %s:%dc
error uplink speed:)
RESULT_CODE_FAILED2r
check_bond_uplink_listri
bonds_list
bond
lacp_statusr
disabled_slavesZ
disabled_slaves_nameZ
enabled_slavesr
uplinkZ
enable_slaveZ
uplink_nameZ	speed_strZ
slave_speedZ
slaves_namer|
DiagProcess._check_bond_statusc
z7DiagProcess._check_bond_lacp_config.<locals>.<listcomp>c
check_bond_lacp_listri
z#DiagProcess._check_bond_lacp_configc
}	n0|
NTFz
Current OVS is provided by %sr
CASr?
/usr/bin/systemctlr
%s run abnormally, pids = %s.r
ps up %sr
z	(healthy)r
--no-chdirz
--detachz0%s run with unexpected args(zombie process?): %s)
check_vswitchd_process_listZ	is_s1020vrV
pid_listri
process_checkZ
commandr|
DiagProcess._check_ovs_processc
%.2f%%zEcpu status of ovs-vswitchd is not well: ovs(%.2f%% = %.2f%% + %.2f%%))
time
sleepr
multiprocessing
	cpu_countr
OVS_CPU_USAGE_THRESHOLDr%
check_cpu_usage_listr
system_cpu_info1Z
ovs_cpu_info1Z
system_cpu_info2Z
ovs_cpu_info2r
ovs_user_cpu_usageZ
ovs_sys_cpu_usager
ovs_all_cpu_usager|
z$DiagProcess._check_process_cpu_usagec
rnq\t
q\qB|
vm: %s; mac: %sr
/sys/class/net/%sr
zO%s has drop statistics rx_drop:%6f, tx_drop: %6f, rx_error: %6f, tx_error: %6f.r
rx_drop: %.2f%%r
tx_drop: %.2f%%z
rx_error: %.2f%%z
tx_error: %.2f%%)
PACKET_DROP_THRESHOLDr%
check_network_traffic_listZ
ifaces_info1Z
dpdk_ifaces_info1Z
ifaces_info2Z
dpdk_ifaces_info2r
iface_statistic_info1Z
iface_statistic_info2
real_ifaceZ
rx_drop_statisticZ
rx_error_statisticZ
total_rx_packetsZ
tx_drop_statisticZ
tx_error_statisticZ
total_tx_packetsZ
rx_drop_rateZ
tx_drop_rateZ
rx_error_rateZ
tx_error_rater|
z"DiagProcess._check_network_trafficc
zFmac table size in bridge %s is %d, grater than max mac-table-size: %d.)
check_mac_table_size_listr
table_sizeZ
max_table_sizer|
_check_mac_table_size\
z!DiagProcess._check_mac_table_sizec
%s, %sr?
z=sudo ovs-vsctl -t 2 --bare --if-exists get interface %s errorTrI
z(interface %s in bridge %s has error: %s.z(interface %s of bridge %s has been down.)
check_port_status_listr
bridge_namer
z&DiagProcess._check_bridge_iface_statusc
z;sudo ovs-vsctl -t 2 --bare --if-exists get interface %s mtuTrI
1500r&
z&ip -br link show %s | awk '{print $1}'z:MTU of iface %s is %s, is not equal with bridge %s MTU %s.r
check_bridge_mtu_listr
Z	iface_mtur
DiagProcess._check_bridge_mtuc
z?ip route show; ip -6 route show | egrep -v '^unreachable|fe80';TrI
z4DiagProcess._check_route_overlap.<locals>.<listcomp>r
metric
multiple default route.z
ipv%s multiple default routec
overlap router
ipv%s overlap route)
	itertools
combinationsr%
IPyZ
overlapsrl
check_route_listri
route_objectsr6
routesr
route_objects_itemZ
default_route_objectsr
non_default_route_objectsr|
z DiagProcess._check_route_overlapc
r:t	
failed to connect host %s.r
MANAGE_BRIDGErQ
check_connection_listrg
z$DiagProcess._check_manage_connectionc
r^q0t
q~qht
} }!|!d
| |	|
zGcluster: %s, host %s failed to connect host %s, bridge: %s, subnet: %s.r?
@zFcluster: %s, host: %s, bridge: %s, subnet: %s has an connection error.r
networkr
subnet_nameZ
subnet_ping_resultr
ip_key
index
network_firZ
ip_fir
host_name_firr7
ssh_connection
network_sec
fail_num
host_name_secZ
ip_secZ
value1Z
value2ri
host_numr
ping_fail_numr|
z%DiagProcess._check_network_connectionc
r^q0g
z2host %s, bridge: %s MTU is different with host %s.r?
z>cluster: %s, host: %s, bridge: %s MTU is different from other.r
check_cluster_mtu_listre
fail_hostsr
success_numr
bridge_mtu_firr
bridge_mtu_secri
DiagProcess._check_cluster_mtuc
rHq0|
qnq^t
d	|	|
z=host %s, bridge: %s, subnet: %s %s is different with host %s.r?
zJcluster: %s, host: %s, bridge: %s, subnet %s mask is different from other.r
check_cluster_mask_listre
mask_keyr
mask_firr
mask_secri
DiagProcess._check_cluster_maskN)
j	d	k
Nz)Get xml result for CAS network diagnoses.)
--levelz*level uses to filter outputing result xml.)
type
helpz
--idz id list for items to be checked.z
Script Execute: %s
allr
argparse
ArgumentParser
add_argumentr'
parse_argsrs
DEFAULT_HEALTH_LEVELrX
argvZ
top_parser
argsrs
diagnoserU
main
__main__Z
inspection_ovsrn
z+execute end : error code %d, time use %.3fs)Hr
sysr
socket
structr
Z	xml.etreer
util_cvk_logr
ERROR_CODE_UNKNOWNrr
COMPONENT_TYPE_DOMAINZ
COMPONENT_TYPE_ONESTORr
LINUX_SUBNET_PATHr
objectr
res_codeZ
cmd_start_timer
Z	time_usedrN
exitr
<module>
