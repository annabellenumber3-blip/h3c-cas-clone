# File: ocfs2_update_hbio_param.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/storage-admin.package/scripts/ocfs2_update_hbio_param.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

d"e 
q6e d#k
d"e 
d"e 
d"e 
e!e"e#e
d%e!e"f
d"e 
d"e 
e$e%
d(e$e%f
e&j*
rde&
Z)[)nzd
Z)[)0
e&j*
Z.[.n
Z.[.0
/etc/default/o2cbz
.bakz
.tmpz(/sys/kernel/config/cluster/%s/heartbeat/
O2CB_HBIO_TYPEZ	hbio_type)
o2cb
configZ
O2CB_HBIO_RETRIESZ
hbio_retriesZ
O2CB_HBIO_TIMEOUTZ
hbio_timeout)
type
retries
timeoutz&# O2CB_HBIO_TYPE: How to do heartbeat.zD# O2CB_HBIO_RETRIES: Heartbeat retry times when failed(nonbio mode).z8# O2CB_HBIO_TIMEOUT: Heartbeat I/O timeout(nonbio mode).c
Nz$OCFS2 HBIO parameters set or update.T)
description
add_helpz
--typeZ
bioZ
nonbioFz(HBio type:only support 'bio' or 'nonbio')
choices
required
helpz
-rz	--retriesz HBio retry times for failed I/O.)
-Tz	--timeoutz"HBio timeout(seconds) for one I/O.z
--add
?z"Add the config item, if not exist.)
nargs
constr
z'At least one argument must be specifiedz
Parameters error. %s
OCFS2_ERR_WRONG_PARAM)
argparse
ArgumentParser
add_argument
parse_args
logging
warnr
BaseException
SystemExit
error
argv
exit
ocfs2_error)
parser
args
ocfs2_update_hbio_param.py
	arg_parse
o2cb list-clustersT)
shell
Get cluster name: '%s' .)	
subprocessZ
check_output
strip
splitr
warningr
	exception)
result
namer#
get_cluster_name4
z8t	
item:'%s' val:'%s'
open
fcntl
flock
LOCK_EX
write
LOCK_UN
closer
new_val
config_itemr#
update_runtime_paramA
}	~	d
}	~	0
Change %s to %s.z
%s=%s
%s=%s
z"Add configuration '%s=%s' success.z8Configuration of '%s' is not exist, please have a check.r3
O2CB_CONF_FILE
O2CB_CONF_FILE_TMPr5
startswithr
shutil
copyr
remover
desc
addZ	o2cb_fileZ
o2cb_tmp_fileZ
exist
failedZ	each_liner#
update_hbio_cfg_paramO
__main__FZ
ocfs2z
caslog/storage-adminz
Parameters error, args is noner
Get clustar name is nonez
%srI
z%update o2cb item '%s' to '%s' failed!r3
z'update config item '%s' to '%s' failed!Z
OCFS2_SUCCESS)/r
util_cvk_logZ
util_sh_error_code_loaderr
O2CB_CONF_FILE_BAKrB
OCFS2_KERNEL_CONF_PATHZ
CLUSTER_NAMEZ
PARAM_NAMEZ
PARAM_DESCr&
__name__rJ
cas_log_init3r
debugr
configfs_pathrE
vars
params
itemZ	o2cb_itemZ
o2cb_valrH
config_valrF
path
existsr-
<module>
