# File: fc_san_lun_setup.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/storage-admin.package/scripts/fc_san_lun_setup.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

]ZZ!e
d e!
d!e!
*zGpvs --noheadings -o pv_name,vg_name,lv_name 2>/dev/null | awk '{print}'z./lib/udev/scsi_id --whitelisted -u --device=%sz
dmsetup %s %szZfdisk -l /dev/disk/by-id/dm-name-%s 2>>/dev/null | grep "Disk\ /dev/disk/by-id/dm-name-%s"z
multipath -ll %s | grep %sc
shellr
NAA %s, check %s)
subprocess
call
PATH_CHECK_CMD
logging
debug
warning
fc_san_lun_setup.py
multi_path_check,
NAA %s multipath -ll check %s)
MULTIPATH_LLr
multipath_ll_checkA
infoTr
NAA %s dmsetup info check %s)
DM_SETUP_CMDr
dmsetup_info_checkV
d	|	d
z#Not any pvs on the host, return now)
z"Not any mapped-devices, return nowz
Add dm info %s into dm listz
mapped-devices: %s
z!PV info is error %s, and continuez4Getting the wwid of the disk %s failed, and continuez
%s-%s
/dev/%s/%s
removeTr
z1dmsetup remove lvs %s with ret code %s for naa %sz
dm_list %s will be removed)
reversez&dmsetup remove naa %s with ret code %sz6naa %s does not have multipath, no necessary to removez&Call pvs command failed, result is %d.)
util_cmds_output
PVS_CMD
lenr
splitr	
strip
append
WWID_CMD
path
existsr
sort
startswithZ
CalledProcessError
returncode
error
BaseException
	traceback
format_exc)
naa_listr
pvs_listZ
dm_infosZ
dm_info_listZ
dm_infoZ
wwid_dm_listZ
pv_infoZ
pv_infosZ	wwid_listZ
wwidZ
lv_infoZ
lv_pathZ
errnor
lvm_remove_for_dm_setupl
NAMEzD	 fc_san_lun_setup.py Checking the multipath and re-config multipathZ
SYNOPSISz
	$0 [ -h ] [-d] NAA1 NAA2Z
DESCRIPTIONz
	 -h: Helpz
	 -d: cancle multipathz
	 NAA: The disk NAA value)
printr
usage
__main__Fr
OCFS2_SUCCESSr
OCFS2_ERR_WRONG_PARAMZ
fc_sanz
caslog/storage-adminTz+naa %s will check whether exists multipath.z3naa %s will be removed lvm before cancle multipath.z
naa %s multipath check OKz2naa %s multipath check failed, should reenable it.z#all of naa in %s multipath check OK)#
sysr"
stringr*
util_cvk_logZ
ocfs2_multipathZ
util_sh_error_code_loaderZ
util_common_toolsr
__name__r
argvZ
arcr
dflag
exitZ
ocfs2_errorZ
cas_log_init3r,
multipath_configZ
naa_need_check_listr
<module>
