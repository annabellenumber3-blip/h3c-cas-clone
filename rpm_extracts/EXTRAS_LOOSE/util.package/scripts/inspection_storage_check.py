# File: inspection_storage_check.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/util.package/scripts/inspection_storage_check.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

StorageCheckc
inspection_storZ
caslogz
UIS storage detect.T)
description
add_helpz
--idFzVThe storage detect item. It can be all or id num, like 1000 or 1000,1001,1003 and all.)
required
default
helpz
--levelZ
0x7z>The storage message warning. info 0x1, warning 0x2, fault 0x4.
OCFS2_ERR_WRONG_PARAM)
cas_log_init3Z
cas_log_init
argparse
ArgumentParser
add_argument
parse_args
id_arg
level
level_list
BaseException
logging
error
exit
ocfs2_error
socketZ
gethostname
	host_name
configparser
ConfigParser
conf
get_conf
init_onestor_conn
get_onestor_fsid
check_disk_space
check_storage_status
check_pg_status
check_mon_odd
check_tgt_status
	func_dict)
self
parser
argsZ
inspection_storage_check.py
__init__
StorageCheck.__init__c
r8q*t
q*q*|
id %s is not in our list.z
Parameters errorr
strip
splitr
debug
clusterZ
shutdownr
id_listr
do_storage_check1
StorageCheck.do_storage_checkc
/etc/ceph/ceph.conf)
conffile
radosZ
Radosr9
connectr
StorageCheck.init_onestor_connc
)	Nr>
globalZ
mon_initial_members
read
getr6
cmpr 
Z	ceph_confZ
mon_confZ
mon_namer;
is_first_monT
StorageCheck.is_first_monc
/etc/cvk/inspection_uis.confZ
storage
disk_space_available)
getintrH
StorageCheck.get_confc
SubElement)
upperZ	node_namer0
get_element_nodei
StorageCheck.get_element_nodec
)	NZ	diagnosisr
component-typez
component-namez
target-namez
result-codez
health-level
info)
ElementrL
text
fsid
dump)
_component_type
_target_name
	_res_code
_level
_info_textZ
diagr
component_typeZ
component_nameZ
target_name
res_coder
build_xml_bodym
StorageCheck.build_xml_bodyc
Z	level_argr0
get_xml_body
StorageCheck.get_xml_bodyc
TFr0
numr0
is_odd_num
StorageCheck.is_odd_numc
get_fsidrP
StorageCheck.get_onestor_fsidc
}	|	d
r~qZt
okFz
{"prefix": "osd df"}r5
z(a disk used space occupied more than 85%Z
STORAGE_AVAILABLE_SPACE_IS_LOW
storage disk available space)
mon_commandr6
floatrH
outbuf
outsZ
osd_infoZ
osd_itemZ
olr;
StorageCheck.check_disk_spacec
{"prefix": "mon stat"}r5
monitor status is not healthy
monitorrb
STORAGE_SERVICE_NOT_NORMALz
{"prefix": "osd stat"}r[
osd status is not healthy
datar
storage service status)
lenr
mon_statusZ
mon_stat
mon_numZ
mon_listZ
osd_statZ
osd_statusr;
z!StorageCheck.check_storage_statusc
}	~	n
}	~	0
{"prefix": "pg stat"}r5
STORAGE_PG_NOT_NORMALz
pg status is not healthy.
 %s 
storage data status)
pg_sumZ	pg_statusr;
StorageCheck.check_pg_statusc
}	~	n
}	~	0
onestor mon num is not oddz
STORAGE_MONITOR_ISNOT_ODDrb
storage monitor num)
mon_sumrm
StorageCheck.check_mon_oddc
pidof tgtdT)
shell
stdoutZ
universal_newlinesr5
tgt status is not healthyrb
STORAGE_TGT_NOT_NORMALr
storage target status)	
subprocess
Popen
PIPEZ
communicater
)	r-
tgt_status_cmdrf
errr;
StorageCheck.check_tgt_statusN)
__name__
__module__
__qualname__r2
__main__)
xml.etree.ElementTreeZ
etreeZ
ElementTreerJ
util_cvk_logZ
util_sh_error_code_loaderr
<module>
