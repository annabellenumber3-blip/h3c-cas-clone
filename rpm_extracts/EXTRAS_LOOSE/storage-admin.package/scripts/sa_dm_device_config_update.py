# File: sa_dm_device_config_update.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/storage-admin.package/scripts/sa_dm_device_config_update.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

ElementTree)
read_ahead_kbc
NAMEz
	 sa_dm_device_config_update.pyZ
DESCRIPTIONz
	 update dm-X device configZ
SYNOPSISz
	 <method>: function namezU		 <update_dm_device_queue_param>: Update a specified queue parameter of a dm device.z
	 <dm_name>: dm device name)
print
sa_dm_device_config_update.py
usage
get_sdx_from_dmx
queue_parameters
set_dm_device_queue_param)
dm_nameZ
sd_device_name
param_namer
update_dm_device_queue_param'
    Get the corresponding underlying sdx device name based on the provided dm-x device name (e.g., 'dm-0').
    :param dm_device: The dm-x device name, such as 'dm-0'.
    :return: The corresponding underlying sdx device name, such as 'sda1'; if not found, return None.
    z
dm-z$%s: device name must start with dm-.Nz
/sys/block/z
/slaves/z
%s: slaves_path=%s not exist.z
%s: slaves path is empty.r
sdz"%s: get sdX device success. sdx=%sz?%s: first_slave is startwith dm- : first_slave=%s, loop search.z)%s: get sdX device failed. first_slave=%sz
%s: get sdX device failed, %s)
startswith
logging
error
path
exists
debug
listdirr	
	Exceptionr
str)
Z	dm_deviceZ
slaves_pathZ
slavesZ
first_slave
excr
cat /sys/block/%s/queue/%s
timeout
shellz echo %s > /sys/block/%s/queue/%sz %s: set dm device %s=%s success.z
%s: set dm device %s failed, %s)	
subprocessZ
check_output
decode
stripr
dev_namer
outZ
sd_attr_valueZ
dm_attr_valuer
__main__Z
caslog/storage-adminz
The input parameters are: %s
Unknown method.)
sysr
time
string
	tracebackZ	xml.etreer
util_cvk_logr
__name__Z
cas_log_init3r
argv
lenZ
argc
exit
funcr
<module>
