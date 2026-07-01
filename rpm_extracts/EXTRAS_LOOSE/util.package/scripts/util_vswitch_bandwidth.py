# File: util_vswitch_bandwidth.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/util.package/scripts/util_vswitch_bandwidth.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

l	Z	d
d d!
d"d#
d$d%
d&d'
Z d(d)
Z!d*d+
d,d-
d-e#
d.d/
d/e#
d0d1
d1e#
Z&d2d3
Z'd4d5
Z(d6d7
Z)d8d9
Z*d:d;
Z+d<d=
Z,d>d?
Z-d@dA
Z.dBdC
Z/dDdE
Nz"/etc/linux-engine-networks/vswitchFz*/var/log/caslog/util_vswitch_bandwidth.logc
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
util_vswitch_bandwidth.py
log_init
shell
stderr
stdoutZ	close_fds
timeoutz'cmd: %s run timeout(%ss) on host, exit!
z6cmd: %s run failed.(out: %s, err: %s, return_code: %s)z(Running cmd: %s success.(out:%s, err:%s)z:Running cmd: %s failed.(out: %s, err: %s, return_code: %s))
isinstance
shlex
split
subprocess
Popen
PIPEZ
communicate
decodeZ
TimeoutExpired
killr
error
exit
returncode
debug)
cmdr
err_exit
errr
execute_cmd!
ovs-vsctl list-brr
stripr
br_name
br_listr
is_ovs_bridge<
Nz8cat %s/%s | grep ^linux_bridge | awk -F '=' '{print $2}'r
_bond)
LINUX_NETWORK_PATHr#
get_linux_network_bond_name@
%s_bondr
hashlibZ
encodeZ	hexdigest)
nameZ
md5_valZ
tmp_namer
get_bond_port_nameM
/proc/net/bonding/%sr
is_use_linux_enginer+
check_port_at_bridge
path
existsr3
	bond_namer
get_bond_nameX
ovs-vsctl list-ports %sF
port
bridger
br_portsr
/sys/class/net/%sz
/devices/pciz
/devices/platform)
readlink)
iface
linkr
check_iface_devicer
ethtool -i %sr
OCTNIC
contentr
check_eth_octnicv
NzGovs-vsctl --if-exists get interface %s options:dpdk-devargs 2>/dev/nullr
get_pciz
z'cat /sys/class/net/%s/speed 2>/dev/nullr
z>ovs-vsctl --if-exists get interface %s link_speed | tr -d "[]"i@B
)	r9
isdigit
speedr
get_iface_speed~
%s/%sz
/sys/class/net/%s/bonding
$cat /sys/class/net/%s/bonding/slavesr
cat %s | grep ^linux_bridge=TFr>
/sys/class/net/%s/brifz4ls /sys/class/net/%s/brif | grep -E -v 'veth.*linux')
listr*
extendr
append)
uplinksZ
vs_cfg
slavesr!
linux_bridger
get_linux_network_uplinks
sdt	|
z)ovs-vsctl -t 2 list-ifaces %s 2>/dev/nullrA
/sys/bus/pci/devices/%s/device
get bridge %s uplink failed)
ifacesrC
pcir
get_uplink_iface
/etc/cvk/nic_speed.confr
z5grep -w %s /etc/cvk/nic_speed.conf | awk '{print $2}'z(no limit speed or invalid limit speed %s)	r9
warningrJ
get_iface_limit_speed
rx_bytes_befZ
tx_bytes_befZ
rx_bytes_afZ
tx_bytes_af
rx_speed
tx_speed)
dict
get_rx_tx_bytes
time
sleep
round)
rx_tx_speedZ
rx_tx_bytesrC
calc_rx_tx_speed
z5cat /sys/class/net/%s/bonding/mode | awk '{print $1}'z
cat /sys/class/net/%s/speed)
Bondr#
moderL
bondr
get_linux_bond
r:q(q(|
_	q(|
Nz!timeout 5 ovs-appctl bond/show %sr
----z
bond_mode: z
member 
active member mac:
active-backup)
splitlines
startswithr
active_slaverM
lines
line
slaverL
get_ovs_bond
get_vswitch_bond
pci_zBovs-vsctl get interface %s statistics:rx_bytes statistics:tx_bytesr
z%/sys/class/net/%s/statistics/rx_bytesz)cat /sys/class/net/%s/statistics/rx_bytesz%/sys/class/net/%s/statistics/tx_bytesz)cat /sys/class/net/%s/statistics/tx_bytes
rx_bytesZ
tx_bytesr
superrg
__init__r2
selfr2
	__class__r
Bond.__init__c
Nz6name=%s, mode=%s, slaves=%s, active_slave=%s, speed=%s)
__str__%
Bond.__str__)
__name__
__module__
__qualname__rz
__classcell__r
IfaceBwrx
get_altname
altname
link_speed
limit_speed
	max_speedr^
tx_avail_speed
rx_avail_speedr{
IfaceBw.__init__c
get_link_speed5
IfaceBw.get_link_speedc
get_limit_speed8
IfaceBw.get_limit_speedc
cat %s/%s | grep ^uplinksr
)	r7
IfaceBw.get_altnamec
set_rx_tx_speedF
IfaceBw.set_rx_tx_speedc
minr
calc_avail_speedJ
IfaceBw.calc_avail_speedc
Nzniface: %s, link_speed: %s, limit_speed: %s, tx_speed: %s, tx_avail_speed: %s, rx_speed: %s, rx_avail_speed: %s)
IfaceBw.__str__)
VsBwrx
	bandwidthr{
VsBw.__init__c
get_bond[
VsBw.get_bondr
q njt
ibwrC
get_bandwidth^
VsBw.get_bandwidthc
get_linkt
VsBw.get_linkc
vswitch
	bond_moderX
json
dumps
data
bwr2
convert_bandwidth_to_json
VsBw.convert_bandwidth_to_jsonc
q:t	
convert_link_to_json
VsBw.convert_link_to_jsonFc
%Y-%m-%d-%H:%M:%Sz
%s, br: %s, bond_mode: %sz
[1;31;34mz
[0mz
%s)	
printr
strftime
	localtimeri
Z	curr_timer
titler
print_bandwidth
VsBw.print_bandwidthc
print_link
VsBw.print_link)
NFr$
check_bridge_validity
ivalr
check_interval_validity
stopr
interval
vs_bwr
handle_continuous
handle_link
handle_default
qJn |
bridge %s is invalidr.
floatZ
continuousr
argvr
ovs_bridge_bandwidth)
descriptionz
--bridgeTr@
bridge that care about)
required
dest
helpz
--intervalr
interval to calculate bandwidth)
--continuous
store_truez
print bandwidth in continuous)
actionr
--linkz
print bridge uplink)
func)
argparse
ArgumentParser
add_argument
set_defaultsr
parse_args)
top_parser
argsr
framer
sig_handler
z t	t
main)
all args: %sr
LOG_FILE
signal
SIGINTr
	Exceptionr
__main__)
TFT)2r9
Z	getLoggerr
objectrg
<module>
