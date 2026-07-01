# File: vol_br_parse.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/backup-restore.package/scripts/vol_br_parse.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

Z e	e
Z!e d
e e!f
Z%d#e e"e#e$e%e!f
nje d$k
Z%d#e e&e#e$e%e!f
'd&e 
Z(e	e
Z*e	e
e)e*e+e,e-e.e/e
Z3d1e
e0e1e2e3e)e*e+e,e-e.e/e
Z3d1e
e4e1e2e3e)e*e+e,e-e.e/e
'd2e
Z(e	e
Z+e	e
]nZ:d
e;e+e-e.e/e(e
e:d 
e:d!d
e:d"d
Z3d8e
e0e1e2e3e;e+e-e.e/e(e
e:d%d
e:d 
e:d!d
e:d"d
Z3d8e
e4e1e2e3e;e+e-e.e/e(e
'd2e
e:e9d
Z<e:e9d9
Z=d:e
e<e=e7f
'd;e
Z?[?nFd
Z?[?0
ZB[Bn
ZB[B0
)>u}
This is the interface of "volume backup/restore modules".
python /opt/bin/vol_br_parse.pyc "<backup>
    <volume>/vms/images/volume</volume>     #
    <mode>1</mode>                          #
  0:
    <parent_backup>                         #
parent
        <transfer_type>scp</transfer_type>  #
parent
:cp/scp/ftp
        <scp_server>172.20.x.x</scp_server>
        <port>22</port>
        <user_name>root</user_name>
        <password>xxxx</password>
        <backup_directory>/vms/vm_backup/backup_uuid1</backup_directory> #parent
    </parent_backup>
    <vm_name>xx</vm_name>                   #
    <backup_disk>vda</backup_disk>          #
    <transfer_type>cp</transfer_type>       #
:cp/scp/ftp
    <shared_directory>/vms/vm_backup</shared_directory>   #
    <specified_name>backup_uuid2</specified_name>     #
    <tempdir>/vms/vmbackuptmp</tempdir>     #
    <compressed>0</compressed>              #
  0:
  1:
    <read_ratio>500</read_ratio>            #
MB/s,0
    <write_ratio>500</write_ratio>          #
MB/s,0
    <cache>0</cache>                        #
</backup>"
python /opt/bin/vol_br_parse.pyc "<restore>
    <volume>/vms/images/volume</volume>     #
    #
    <backup>
        <transfer_type>cp</transfer_type>   #
cp/scp/ftp
        <backup_directory>/vms/vm_backup/backup_uuid1</backup_directory> #
    </backup>
    <backup>
        <transfer_type>scp</transfer_type>
        <scp_server>172.20.4.114</scp_server>
        <port>22</port>
        <user_name>root</user_name>
        <password>1234</password>
        <backup_directory>/vms/vm_backup/backup_uuid2</backup_directory> #
    </backup>
    <backup>
        <transfer_type>ftp</transfer_type>
        <ftp_server>172.20.4.114</ftp_server>
        <port>21</port>
        <user_name>root</user_name>
        <password>1234</password>
        <backup_directory>/vms/vm_backup/backup_uuid3</backup_directory> #
    </backup>
    ...
    <vm_name>xxx</vm_name>                  #
    <tempdir>/vms/vmbackuptmp</tempdir>     #
    <read_ratio>500</read_ratio>            #
MB/s,0
    <write_ratio>500</write_ratio>          #
MB/s,0
    <cache>0</cache>                        #
    <writezero>0</writezero>                #
(falloc) 1:
(full) 2:
(off)
</restore>"
ElementTree)
Param <%s> is missing in xml!
BR_WRONG_PARAM
z&More than one param <%s> found in xml!z$Unsupported empty param <%s> in xml!
 z-Param <%s> can not contain blank char in xml!)
findall
logging
error
exit
br_error
text
strip
replace)
root
nameZ
allowblankr
node
vol_br_parse.py
xml_find_textX
)	Nr
Not a absolute path '%s'!r
Not a file path '%s'!r
path
isdirZ
old_pathr
check_abs_path
__main__r
caslog/backup-restorez
backupr
no_vmFZ
no_disk
vm_name
backup_diskTZ
transfer_type
mode
parent_backupZ
backup_directoryZ
cpz	"%s" "%s"Z
scp_server
port
	user_name
passwordz
"%s" "%s" "%s" "%s" "%s" "%s"
ftp_serverz+Unsupported parent backup transfer_type %s!Z
BR_UNSUPPORTED_TRANSFER
volumeZ
shared_directory
compressed
tempdir
specified_name
read_ratio
write_ratio
cachez[/opt/bin/vol_br_backup.sh "%s" "%s" "%s" "%s" "%s" "%s" "%s" "%s" "%s" %s "%s" %s "%s" "%s"zo/opt/bin/vol_br_backup.sh "%s" "%s" "%s" "%s" "%s" "%s" "%s" "%s" "%s" "%s" "%s" "%s" "%s" %s "%s" %s "%s" "%s"z
Unsupported transfer_type %s!)
shellZ
restoreZ	writezeroz
No backup found in xml!zE/opt/bin/vol_br_restore.sh "%s" "%s" "%s" "%s" "%s" "%s" "%s" %s "%s"zY/opt/bin/vol_br_restore.sh "%s" "%s" "%s" "%s" "%s" "%s" "%s" "%s" "%s" "%s" "%s" %s "%s"r
%s %s %s "%s"z
Unsupported cmd_type %s!Z	BR_FAILED)
__doc__r
subprocessr
Z	xml.etreer
util_sh_error_code_loaderZ
util_cvk_logr
__name__r	
argvr
cas_log_init3Z
warningZ
rtn_codeZ
xmlZ
fromstringr
tagZ
cmd_typeZ
cmd_strr
has_vmr 
parent_backup_str
findZ
trans_typer!
ptrans_typeZ
pbackup_dirZ
pscp_serverZ
pportZ
puser_nameZ	ppasswordZ
pftp_serverr
Z	directoryr+
info
callZ
preallocr
backup_listr
backup_dirZ
isfirstZ
islast
SystemExitZ
	exception
BaseException
<module>
