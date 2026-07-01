# File: ocfs2_multipath_update.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/storage-admin.package/scripts/ocfs2_multipath_update.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

/etc/multipath.confz
/etc/multipath.conf.updatec
r0d	}
}	~	S
}	~	0
Fail to find %s and return.Z
OCFS2_SUCCESS
defaultsz(Failto find defaults from %s and add it.
path_checkerZ
prio
const
path_grouping_policyZ
group_by_prio
no_path_retryZ
max_fds
failbackZ	immediateTz\Find defaults %s exist in %s and compare existed configuration with the added configuration.)
z0key[%s] already has value[%s], do not modify it.zAAdd key[%s] value[%s] to /etc/multipath.conf.update successfully.z
write %r to /etc/multipath.confz+service multipath-tools restart 1>/dev/null)
shellz#restart multipath service, ret = %sZ
OCFS2_MULTIPATH_CONF_FAILED)
path
exists
MULTIPATH_CFG
shutil
copy
MULTIPATH_CFG_UPDATEZ
read_config_file
loggingZ
warningZ
ocfs2_errorZ
get_unique_elementZ
create_empty_sectionZ
add_multi_element
getZ
add_unique_element
debugZ
write_config_file
subprocess
call
SystemExit
error
BaseException)
config_flagZ
configZ
defaults_sectionZ
default_keys
keyZ
add_flag
value
retZ
ocfs2_multipath_update.py
multipath_config_update(
__main__Z
ocfs2z
caslog/storage-adminz
multipath conf update %rz"multipath conf file changed failed)
sysr
util_sh_error_code_loaderZ
util_cvk_logZ
ocfs2_multipathr
__name__Z
cas_log_init3r
argvZ
rtnr
exitr 
<module>
