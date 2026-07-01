# File: util_cvm_network_conf.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/util.package/scripts/util_cvm_network_conf.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

Z!e!
Z"e!
Z#e!
Z$e!
e"e#e$e%f
j'e&d'd(
Z)e)
Z*e)
Z+e)
Z,e)
Z-e.e
e*e+e,e-f
j'e&d'd(
j'e&d'd(
Z/e/d
d-e/
j"Z"d
j'e&d'd(
j0Z0e.e
j'e&d'd(
Z2[2n@d
Z2[20
e5d3
Z4[4n
Z4[40
ElementTreez5/opt/bin/util_cvm_configure_network.sh %s %s %s %s %sz,/opt/bin/util_cvm_configure_network.sh %s %sc
d	|	
namez
vswitch=%s
vswitch
pnicz
pnic=%s
ip=%s
maskz
mask=%sz
get net configure: %s)
find
text
logging
debug)
Z	conf_nodeZ	conf_dictZ
vswitch_noder
Z	pnic_noder
ip_noder
Z	mask_noder
util_cvm_network_conf.py
get_configure-
cvmStorageNetwork
master
sparez
Parse network from xml: %sZ
UTIL_GET_NETWORK_FAILED)
ElementZ
fromstringr	
g_network_dictr
BaseException
error
util_error)
Z	xmlstring
rootZ
master_nodeZ
master_dictZ
spare_nodeZ
spare_dict
get_network_from_xmlX
__main__Z
cas_utilz
configure cvm storage network)
description
modeZ
create
removez
Operation mode on CVM network)
choices
helpz
-nz	--network
xmlstrz
network configure in xml format)
destr 
--master_vswitchz
remove master cvm vswitch)
--standby_vswitchz
remove standby cvm vswitchz
input parameters: %s
z3Fail to parse storage network configuration, ret=%dr
shellz-Fail to configure current cvm network, ret=%dz)Success to configure current cvm network.r
zQFail to configure spare cvm network, master cvm network should be deleted, ret=%dz<Fail to remove master cvm network, please check, retMster=%dz'Success to configure spare cvm network.z*Fail to remove current cvm network, ret=%dz&Success to remove current cvm network.z(Fail to remove spare cvm network, ret=%dz$Success to remove spare cvm network.Z
UTIL_CONF_NETWORK_FAILED)6
sysr
subprocess
argparseZ
util_cvk_logZ
util_sh_error_code_loaderZ
util_xml_commonZ
util_common_toolsZ	xml.etreer
SPARE_SET_NETWORK_CMDZ
SPARE_REMOVE_NETWORK_CMDr
__name__r
spare_ipZ
cas_log_init
ArgumentParser
parser
add_argumentr
argv
parse_args
argsZ
cvm_hot_backup_check
resultr
getZ
master_networkZ
master_vswitchZ
master_vswitch_ipZ
master_pnicZ
master_mask
call
exitZ
spare_networkZ
spare_vswitchZ
spare_vswitch_ipZ
spare_pnicZ
spare_maskZ
SSH_PARAMETERZ
retMsterZ
standby_vswitch
SystemExitZ
<module>
