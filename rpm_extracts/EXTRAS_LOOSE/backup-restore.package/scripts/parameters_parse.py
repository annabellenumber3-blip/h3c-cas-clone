# File: parameters_parse.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/backup-restore.package/scripts/parameters_parse.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

	rhe
Z+d!Z,e+d!k
Z,d#Z-e
Z.e.d
r6e.j
Z-d!Z/e$d%k
rhe-d&k
Z0e0d
rhe0j
Z/d(Z1e
Z2e2d
Z1d	Z3e
Z5e5D
]PZ6e6
Z7e6
Z8e7d
e3d-
Z3e3e8j
d/Z9e
Z:e:d
r e:j
r e:j
rTd1e
e#e"e$e%e&e'e(e)e*e,e1e-e3e/e9f
e#e"e$e%e&e'e(e)e*e,e1e-e3e/e9f
e#e"e$e%e&e'e(e)e*e,e1e-e3e/e9f
Z?d!Z@d!ZAe
ZAd!ZBe?d!k
ZBd/Z9e
Z:e:d
d<e>e
e;e"e<e'eBe@eAe9e=f
d=e>e
e;e"e<e'eBe@eAe9e=f
d=e>e
e;e"e<e'eBe@eAe9e=f
e;e"eCf
e;e"eCf
e;e"eCf
ZDd!ZEeDd!k
rFdEe
e;e"e<eEf
rldFe
e;e"e<eEf	
e;e"e<eEf	
Z#d	Z"d	Z<d	Z'e
ZGeGd
ZHeHd
ZIeId
r0dIeFe
e#e"e<e'f
rXdJeFe
e#e"e<e'f
dJeFe
e#e"e<e'f
ZGeGd
Z"dLe"
Z+d!Z,e+d!k
Z,d#Z-e
Z.e.d
r0e.j
rRdNe
e#e"e'e(e-e,f
r|dOe
e#e"e'e(e-e,f
e#e"e'e(e-e,f
!dQeJ
dRdS
ZLdTg
ZMeLeMv
	r e
dUe"e
ZO[On
ZO[O0
This is the interface of "Backup/Restore modules".
There are five kinds of command: "backup", "restore", "import", "delete" and "vm_br_file_list".
The only input parameter is a xml format string, whose root tag is one of the command mentioned before.
e.g: A backup parameter xml is kind of the following format:
    <backup>
        <vm_name>VM_2</vm_name>
        <transfer_type>cp</transfer_type>
        <shared_directory>/vms/vm_backup</shared_directory>
        <mode>0</mode>                              # 0: Full backup; 1: Incremental backup; 2: Differential backup
        <reserver_number>0</reserver_number>        # Forgive the non-standard naming.
        <tempdir>/vms/vmbackuptmp</tempdir>
        <specified_name>e</specified_name>
        <compressed>1</compressed>
        <read_ratio>500</read_ratio>
        <write_ratio>500</write_ratio>
        <cache>0</cache>
        <backup_type>0</backup_type>
        <backup_method>cbt</backup_method>
        <vmDisk>
             <poolName>casrbd</poolName>
             <storagePath>cas/aa</storagePath>
        </vmDisk>
        <vmDisk>
             <poolName>datarbd</poolName>
             <storagePath>data/aa</storagePath>
        </vmDisk >
    </backup>
    A vm_br_file_list parameter xml is kind of the following format:
    <vm_br_file_list>
        <vm_name>wt</vm_name>
        <transfer_type>cp</transfer_type>
        <date>20180424143307</date>
        <destination_directory>/vms/vm_backup</destination_directory>
        <tempdir>/vms/vmbackuptmp</tempdir>
        <query_disk>0</query_disk>
    </vm_br_file_list>
    A restore parameter xml is kind of the following format:
    <restore>
        <vm_name>wt</vm_name>
        <transfer_type>cp</transfer_type>
        <date>20180424143307</date>
        <destination_data_file_directory> /vms/wt_200g/wt=/vms/wt_200g/wt</destination_data_file_directory>
        <destination_directory>/vms/vm_backup</destination_directory>
        <tempdir>/vms/vmbackuptmp</tempdir>
        <size>4491980800</size>
        <restore_type>0</restore_type>
    </restore>
        <destination_data_file_directory> src_path=dst_path</destination_data_file_directory>:
          src_path: the image path in xml when backup take place
          dst_path: the path that image will be restored to
ElementTree)
__main__
caslog/backup-restore
transfer_typeZ
ftp_server
port
	user_name
passwordZ
scp_serverz
Unsupported transfer_type %s!z
@@@z
The input parameters are %s.Z
backup
vm_nameZ
shared_directory
mode
reserver_number
compressed
tempdir
specified_name
read_ratio
write_ratio
backup_type
backup_diskZ
convertsum
backup_method
inc_full_dirnameZ ffffffffffffffffffffffffffffffff
disk_passwordZ
vmDiskZ
poolNameZ
storagePath
limited_coezO/bin/bash /opt/bin/vm_backup.sh %s %s %s %s %s %s %s %s %s %s %s %s %s %s %s %sz[/bin/bash /opt/bin/vm_backup.sh %s %s %s %s %s %s %s %s %s %s %s %s %s %s %s %s %s %s %s %sZ
restoreZ
destination_directory
date
destination_data_file_directory
size
restore_type
name
uuid
restore_diskzA/bin/bash /opt/bin/vm_restore.sh %s %s %s %s %s %s %s %s %s %s %szM/bin/bash /opt/bin/vm_restore.sh %s %s %s %s %s %s %s %s %s %s %s %s %s %s %s
import
tmp_dirz4/bin/bash /opt/bin/history_msg_import.sh %s %s %s %sz@/bin/bash /opt/bin/history_msg_import.sh %s %s %s %s %s %s %s %s
delete
delete_type
delete_diskz7/bin/bash /opt/bin/delete_backup_file.sh %s %s %s %s %szC/bin/bash /opt/bin/delete_backup_file.sh %s %s %s %s %s %s %s %s %sZ
vm_br_file_list
query_diskz7/bin/bash /opt/bin/vm_br_file_list.sh %s %s %s %s %s %szC/bin/bash /opt/bin/vm_br_file_list.sh %s %s %s %s %s %s %s %s %s %sZ
vm_task_checkz+sudo /bin/bash /opt/bin/vm_task_check.sh %sZ
backup_terminatez;/bin/bash /opt/bin/backup_terminate.sh %s %s %s %s %s %s %szG/bin/bash /opt/bin/backup_terminate.sh %s %s %s %s %s %s %s %s %s %s %sz
Unsupported cmd_type %s!z
command: %sT)
shell
%s %s failed with code %d .)Q
__doc__
subprocessZ
loggingZ	xml.etreer
util_sh_error_code_loaderZ
util_cvk_logZ
br_ipcompat_util
__name__
argv
exitZ
cas_log_init3Z
xmlZ
fromstring
root
tagZ
cmd_typeZ
cmd_str
find
textZ
trans_typer	
ipcompat_get_compat_ip
errorZ
input_info
replace
infor
Z	directoryr
backup_method_elementr
inc_full_dirname_eler
disk_password_elementZ
vm_disk_info
findallZ
vm_disk_listZ
vm_diskZ
poolnameZ
storagepathr
limited_coe_elementZ
backup_dirZ
backup_dater!
br_sizer#
vm_name_elementZ
backup_date_elementZ
tempdir_elementZ
cmd_info
callZ
return_codeZ
BR_FAILED_CODE
BaseException
	exception
parameters_parse.py
<module>
