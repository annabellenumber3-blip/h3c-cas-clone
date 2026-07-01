# File: logrotate_conf.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/util.package/scripts/logrotate_conf.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

Z	d	Z
############################################################################
#    File Name: logrotate_conf.py
# Date Created: 2018-11-20
#       Author: renqinwei 15723
#  Description: modify system log rotate config.
#       Return: 0 if successfully, other with errors
#      Caution:
#-----------------------------------------------------------------------------
#  Modification History
#  DATE        NAME             DESCRIPTION
##############################################################################
/etc/logrotate.d/cas_haz
/etc/logrotate.d/caslog
/etc/logrotate.d/corosyncz
/etc/logrotate.d/dnsmasq
/etc/logrotate.d/dpkgz
/etc/logrotate.d/libvirtdz
/etc/logrotate.d/libvirtd.libxlz
/etc/logrotate.d/libvirtd.lxcz
/etc/logrotate.d/libvirtd.qemuz
/etc/logrotate.d/libvirtd.umlz
/etc/logrotate.d/lldpadz
/etc/logrotate.d/mcelogz
/etc/logrotate.d/msdz#/etc/logrotate.d/openvswitch-switchz
/etc/logrotate.d/operationz
/etc/logrotate.d/tomcat8z
/etc/logrotate.d/usbdemdz
/etc/logrotate.d/virtagentc
logging
error
	Exception
	errorcode)
error_codeZ
error_info
logrotate_conf.py
raise_error6
shellz
Run cmd %s result: 
join
subprocess
check_outputr
warningr
cmd_str
resultr
exe_cmd<
CasLogc
/etc/logrotate.conf)
logrotate_conf
log_conf_path)
selfr"
__init__C
CasLog.__init__c
r@q q d
index
time
rotate
replacer
postrotate
daily
weekly
monthlyr)
z#Parse log file %s rotate config: %s)
open
strip
appendr
splitr
file
config_nZ
config_flag
rotate_config
rotate_config_list
liner
parse_log_rotate_configG
CasLog.parse_log_rotate_configc
)	NFr)
LOG_ROTATE_DAY_DEFAULTr
LOG_ROTATE_WEAK_DEFAULT
LOG_ROTATE_MONTH_DEFAULT)
check_rotate_configc
CasLog.check_rotate_configc
q.q.d
r~d	}
}	|	
Fz!Log file %s new rotate config: %sr%
rotate 
wz)Log file %s replace rotate config finish.)
popr5
write)
	file_datar9
replace_flagr;
line_tmp
new_liner
replace_log_rotate_configr
z CasLog.replace_log_rotate_configc
r"t	}
}	|	
logrotate.dr.
%s old rotate config: %s %sz
%s keep old config: %s %srC
%s modify rotate config finish.)
Z	time_flagZ	skip_flagrH
old_rotateZ
new_rotaterI
modify_logrotate_conf
CasLog.modify_logrotate_confc
Nz4/usr/sbin/logrotate --force /etc/logrotate.conf 2>&1z"logrotate force config result: %s.)
logrotate_force
CasLog.logrotate_forcec
Config log file: %sz
Log file config rotate finish.)	r"
need_replacer
log_rotate_conf
CasLog.log_rotate_confN)
__name__
__module__
__qualname__r$
Ubuntuc
/etc/logrotate.d/apportz
/etc/logrotate.d/aptz
/etc/logrotate.d/aptituder	
/etc/logrotate.d/pppz
/etc/logrotate.d/rsyslogz
/etc/logrotate.d/ufwz
/etc/logrotate.d/upstart)
superrS
	__class__r
Ubuntu.__init__
__classcell__r
Centosc
Centos.__init__rX
/opt/bin/os_lsb_release -isT)
stderrrS
CentOSz
Failed to get system object.)
STDOUT
splitlines
bytes
decoderS
ERROR_CODE_VALUE_CHECK_NONErO
distrir<
distri_resultZ
log_objr
main
__main__r!
Log init finish.r
Script exit result Id: %s)"
__doc__
util_cvk_logZ
ERROR_CODE_OKZ
ERROR_CODE_UNKNOWNZ
ERROR_CODE_INVALID_PARAM_VALUEr_
cas_code_ubuntu_log_conf_fileZ
cas_code_centos_log_conf_filer
objectr
cas_log_init2Z
cas_log_initr
resr
hasattrr
exitr
<module>
