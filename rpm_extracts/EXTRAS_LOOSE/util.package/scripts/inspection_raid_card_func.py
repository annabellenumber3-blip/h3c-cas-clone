# File: inspection_raid_card_func.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/util.package/scripts/inspection_raid_card_func.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

d!d"
d#d$
d%d&
d'd(
d)d*
d+d,
d-d.
d/d0
d1d2
d3d4
Z d5d6
Z!d7d8
Z"d9d:
Z#d;d<
Z$d=d>
Z%d?d@
Z&dAdB
Z'dCdD
Z(dEdF
Z)dGdH
Z*dIdJ
Z+dKdL
Z,dMdN
Z-dOdP
Z.dQdR
Z/dSdT
Z0dUdV
Z1dWdX
Z2dYdZ
Z3d[d\
Z4d]d^
shellZ
universal_newlines)
subprocessZ
check_outputZ
CalledProcessError
returncode
output)
retr
inspection_raid_card_func.py
cas_cmds_execute(
error
arrayZ	interfaceZ
media
sizeZ
unitZ
disk_cacheZ
locate
slot_numr	
pd_info_dictr	
init_pd_info_list3
noner
ld_numZ
raidr
diskname_valuer
raid_cache
append)
one_ld_dict
pd_list
pd_dictr	
init_ld_info_list8
Adaptec
#Hewlett-Packard Company Smart Array
Broadcom / LSIz
lspci | grep -i "%s"r
Hewlett-Packardr
LSI)
raid_cards_list
each
cmd_liner
get_raid_cards_listB
None)
findall
BaseException)
patternZ
from_string
keyword
betr	
cas_get_keyword`
ssacli ctrl all show
Slot\s(.\d?)\s)
strip)
return_code
ctrl_outputr
get_hp_raid_card_slot_numberg
Nz$/opt/MegaRAID/storcli/storcli64 showz)[-]+?
Ctl\s+?Model.+?
[-]+?
(.+?
)[-]+?
split)
patr
get_lsi_raid_card_slot_numberq
/usr/local/sbin/arcconf LISTz
Controller\s([0-9]+):.+?
ada_ctrl_info
ctrl_num_pat
ctrl_numr	
get_ada_raid_card_ctrl_number~
&ssacli ctrl slot=%s ld all show detail
Logical Drive:\s(.+?)
slotr!
id_pat
ld_listr	
get_hp_raid_card_ld_list
Nz'/usr/local/sbin/arcconf getconfig %s ldz
Logical Device number\s(.+?)
get_ada_raid_card_ld_list
}	|	d
/opt/MegaRAID/storcli/storcli64
/c%s/vall show
.[-]+?
DG/VD[\s]+TYPE.+?
[-]+?
([\s\S]+?)[-]+?
path
cmd_line_allr/
output_all
vd_pat
vd_listr?
vd_info
vd_num
namer	
get_lsi_raid_card_ld_list
NzL/usr/local/sbin/arcconf getconfig 1 ad | grep -i model | grep -i PM8060-RAIDr
ada_is_pmc8060
lspci | grep -i Adaptecr
lspci -v -s %sz
P408i-pr#
pci_numr6
name_patr$
ada_is_p408
P460-M4|3154-8i|P460-B2r#
ada_is_p460
}	nNd
}	n.d
Nz.df -BM | grep -w '%s[1-9]*' | awk '{print $3}'r
Get disk used rate error. %sr#
float
roundr'
loggingr
	traceback
format_exc)
ld_disk_nameZ
total_sizer
total_used_sizeZ
disk_used_list
oneZ
numZ	total_num
	used_rateZ
used_rate_strr*
get_disk_used_rate
ssacli ctrl slot=%s ld %s showz
Disk Name:\s(.+?)\sz"Get disk name error,return code %sr#
	disk_namer	
get_hp_disk_name_from_logicalid
NzX/opt/MegaRAID/storcli/storcli64 /c%s/%s show all | grep 'SCSI NAA Id' | awk '{print $5}'
'Run %s error, output %s, return code %sr
get_disk_name)
disk_id_cmd_liner/
disk_idrf
 get_lsi_disk_name_from_logicalid
)lsblk --nodeps | awk '{if(NR>1)print $1}'r
z6/lib/udev/scsi_id --whitelist -p 0x80 --device=/dev/%sz
/lib/udev/scsi_id -g -u /dev/%s
/dev/
get raid card info error. %srT
searchr'
exit)
is_pmc8060rf
	disk_list
diskr	
NzmReported Channel,Device\(T:L\)\s+?:\s([0-9]+),([0-9]+).+?
\s+?Reported Location.+Direct Attached.+Slot\s%s.+
zlReported Channel,Device\(T:L\)\s+?:\s([0-9]+),([0-9]+).+?
\s+?Reported Location.+?Enclosure\s%s.+Slot\s%s.+
z'/usr/local/sbin/arcconf getconfig %s pdr
)	r8
	enclosurer=
locate_patr!
locate_strZ
channel
idr	
get_ada_channel_id>
Nz*/usr/local/sbin/arcconf getconfig %s ld %sz
Unique Identifier.+:\s(.+?)
Disk Name.+:\s(.+?)
idetfier_patZ
disk_patr/
 get_ada_disk_name_from_logicalidP
Controller Status:\s(.+?)
Cache Status:\s(.+?)
z!Battery/Capacitor Status:\s(.+?)
No-Battery Write Cache:\s(.+?)
Firmware Version:\s(.+?)
Total Cache Size:\s(.+?)
in Slotr-
Get slot number error.z
ssacli ctrl slot=%s show detail
controllerstatus_value
cachestatus_value
batterystatus_value
	bbu_value
model_value
firmwareversion_value
cachesize_valuer
raidcard_namers
ctrl_pat
	cache_pat
battery_pat
bbu_pat
fir_ver_patZ
cache_size_pat
	ctrl_dictr/
hp_ctrl_simpler 
array_dict
array_namer
hp_ctrl_detail
ctrl_status
cache_status
battery_status
fir_ver
cache_size
	bbu_stater*
get_hp_ctrl_infoq
Controller Status =\s(.+?)
BBU Status =\s(.+?)
Cache When BBU Bad =\s(.+?)
Firmware Version =\s(.+?)
On Board Memory Size =\s(.+?)
%s showr
z-[-]+?
Ctl\s+?Model.+?
[-]+?
([\s\S]+?)[-]+?
Cannot get info list.rF
%s /c%s show all
Optimal
output_listZ
ctrl_infosZ
slot_model_dictZ	each_slotZ
one_slot_infor
lsi_infor
get_lsi_ctrl_info
d	|	|
Controller\s([1-9]+):.+?
Controller Status\s+?:\s(.+?)
z'Overall Backup Unit Status\s+?:\s(.+?)
Controller Model\s+?:\s(.+?)
Firmware\s+?:\s(.+?)
z'/usr/local/sbin/arcconf GETCONFIG %s ADr
Readyr#
Installed memory\s+?:\s(.+?)
)	r9
mode_patZ
fir_patr
ctrl_num_listr8
ada_infor
mode_valuer
get_ada_ctrl_info
}	d	|
)!Nr;
[\s]+Status:\s(.+?)
[\s]+Size:\s(.+?)
Disk Name:\s(.+?)\s
Fault Tolerance:\s(.+?)
Array\s(.+?)
z%Array.+?
.+?Logical Drive:[\s\S]+?
Caching:\s+(.+?)
Get ld info list error.z(ssacli ctrl slot=%s array %s pd all showz
physicaldrive.+?
z"There is no physical device lists.
Error
physicaldrivenum_value
logicaldrivestatus_value
logicaldrivesize_valuer
disk_used_rate_caluer
isSSD_value
faulttolerance_valuer
Array 
logicalnum_value
ln_value
raidnumstatus_valuer
get hp raid card info error. %s)
ld_info_listr>
status_pat
size_patZ
disk_name_patZ
fault_tol_pat
	array_patZ
array_ld_pat
arry_cacher!
	ld_outputr?
ld_dictr
ld_id
	ld_status
ld_sizerf
ld_fault_tolr
	pd_output
pd_patZ
phy_dev_list
pd_num
raid_numrh
get_hp_ld_infoM
}$|$d
}%|$d
}'|'d
}(|"d
|!d*k
rBd*n
}*~*n
}*~*0
).Nz&ssacli ctrl slot=%s pd all show detailr
physicaldrive\s(.+?)
\s+?Size:\s(.+?)
Firmware Revision:\s(.+?)
\s+?Status:\s(.+?)
Interface Type:\s(.+?)
Serial Number:\s(.+?)
Current Temperature.+:\s(.+?)
\s{3}Array\s+[A-Z].*(?=Array)r
Drive Write Cache:\s(\S+?)
ssacli ctrl slot=%s showz
Unassigned
([\s\S]+)z
Unassigned
Array\s.+?Z
Arrayz
\s(\w)
physicaldrive[\s\S]+?
Unassigned Drive
Solid State SATA
physicaldrive_name
location_value
isconfigraid_value
physicaldrivestatus_valuer
physicaldrivesize_value
$physicaldrive_firmwarerevision_value
serialnumber_value
physicaldrivetemperature_valuer
IOexception
IOexception_valuers
hp_pd_outputZ
pd_name_patr
firware_patZ	staus_patZ
type_patZ
serial_num_pat
tem_patr
one_pd_patr
disk_cache_patZ
unassigned_pd_patZ
ctrl_outr
all_pd_listZ
split_pd_infoZ
assigned_pd_outputZ
all_array_infoZ
all_array_listrg
one_array_listr
one_pdr
pd_name
pd_size
firware
	pd_status
pd_type
serial_num
temperature_c
temperature_f
temperatureZ	raid_type
in_raid
is_ssdr*
get_hp_pd_info
NULLr
init_inspection_ld_list
d	}	d
}#~#n
}#~#0
}#~#n
}#~#0
%Status of Logical Device\s+?:\s(.+?)
Size\s+?:\s(.+?)
RAID level\s+?:\s(.+?)
Unique Identifier\s+?:\s(.+?)
Segment\s.+?
|Device\s[\d].+?
Write-cache setting\s+:\s(.+?)
Logical Device number\s(\d+?)\s
'/usr/local/sbin/arcconf GETCONFIG %s LD
Logical Device number[\s\S]+?
Write-cache status\s+:\s(.+?)
Slot:(.\d?)r#
 On when protected by battery/ZMM
Enabled
Offr
raid_level_pat
disk_id_patZ
segment_patr
device_num_patr!
ada_ld_pat
cache_status_pat
cache_setting_patr/
ada_ld_listr?
add_ldr
raid_levelrn
seg_listr
pd_slot_list
one_segr=
cache_setting_statusrw
logical_numr*
get_ada_ld_info
}	d	}
}!t	|
}"~"n
}"~"0
)$Nr
z%Volume Unique Identifier\s+?:\s(.+?)
Device\s\d.+?Present.+
Disk Name\s+?:\s(.+?)
Device\s(.+?)\sr#
device_patrj
dev_listrf
one_devr=
get_ada_p460_ld_infoe
}	|	d
|"d <
|"d!<
|"d"<
|!|"d#<
d$|"d%<
|"d&<
}#~#d
}#~#0
)(NrB
/c%s/vall show allr
RAID(\d)rT
/c%s/v%s show allz
SCSI NAA Id =\s(.+?)
z)Write Cache\(initial setting\)\s=\s(.+?)
zF/lib/udev/scsi_id -g -u /dev/%s | grep -i %s 1> /dev/null 2> /dev/nullrr
z-[-]+?
EID:Slt[\s]+DID.+
[-]+
([\s\S]+?)[-]+?
lsi_ld_outputrL
scsi_naa_patZ
scsi_naarx
pd_infoZ
pd_num_listr
get_lsi_ld_info
}#|#d
}#|#
}&|%D
]$}'t
}(|(d
})|)|
d,t	
}*~*d
}*~*0
)-Nz8Reported Location.+?Enclosure\s(\d+?).+Slot\s(\d+?)\(.+
[\s]+State\s+?:\s(.+?)
SSD\s+?:\s(.+?)
Total Size\s+?:\s(.+?)
Serial number\s+?:\s(.+?)
z Current Temperature\s+?:\s(.+?)
Write Cache\s+:\s(.+?)\s
'/usr/local/sbin/arcconf GETCONFIG %s PD
-Device\s.+
.+Device is a Hard drive[\s\S]+?
"Hardware Error Count\s+?:\s(\d+?)
 Medium Error Count\s+?:\s(\d+?)
 Parity Error Count\s+?:\s(\d+?)
 Link Failure Count\s+?:\s(\d+?)
#Aborted Command Count\s+?:\s(\d+?)
!SMART Warning Count\s+?:\s(\d+?)
Yesr
Onliner#
Temperature\s+?:\s(.+?)
IOexception!
Device #(.+)
slotnum_valuer
replacer
location_patr
ssd_patr
sn_patr
ada_pd_pat
harderr_pat
Medierr_pat
parierr_pat
linkfail_pat
abocmd_pat
smartwarn_patr/
ada_pd_output
ada_pd_infor
ssd_valr
tem_pat2
	IOErr_Str
IOErr
str_pat
ioerr_temp
dev_numberr*
get_ada_pd_info&
d	}	d
}%|%d
}%|%
}(|'D
].})t
}*|*d
d d!t
}-|,d"
}.|.|
}/~/n
}/~/0
)4Nz%Reported Location.+?Enclosure\s(\d+?)z$Reported Location.+Slot\s(\d+?)\(.+
z Current Temperature\s+?:\s(.\d?)z Transfer Speed\s+?:\s(.+?)\s.+?
 F r
location_enclosure_patZ
location_slot_patr
interface_patr
interface_typeZ
c_temperatureZ
f_temperaturer
get_ada_p460_pd_infot
} | d
}!|!d
}$~$d
}$~$0
).Nz7/opt/MegaRAID/storcli/storcli64 /c%s/eall/sall show allr
z2/opt/MegaRAID/storcli/storcli64 /c%s/vall show allz'[-]+?
EID:Slt.+?
[-]+?
([\s\S]+?)[-]+?
SSDr
zEDrive\s+/c%s/e%s/s%s\sDevice[\s\S]+?(Firmware Revision.+?
)[\s\S]+?
z8Drive\s+/c%s/e%s/s%s\sDevice[\s\S]+?(SN =.+?
)[\s\S]+?
zDDrive\s+/c%s/e%s/s%s\sState[\s\S]+?(Drive Temperature.+?
)[\s\S]+?
(\d+?)Cz
\((.+?)\sF
z3Drive\s+/c%s/e%s/s%s\sState[\s\S]+?=*?
([\s\S]+?)
zwShield Counter\s=\s(\d*)
Media Error Count\s=\s(\d*)
Other Error Count\s=\s(\d*)
Predictive Failure Count\s=\s(\d*)
Disabled
Onlnr
lsi_pd_outputrK
pd_output_listr
one_pd_listr
eidZ
sltr
temperature_strr
Z	IoErr_patZ
IoErr_all_patZ
IoErrStr_all
IOErrorZ
IoErrStr_listZ
IOtempr
get_lsi_pd_info
Disk's Defaultr'
UGoodz
Raid card type error.)
	card_typer
get_check_pd_info5
Simple_volumer
OptlZ
WriteThroughz
Get raid card type error.Z
ERROR
ld_infor+
get_check_ld_infoW
q0q(|
assigned
unassignedr
unassigned_direct
assigned_directZ
hp_info_listr
pd_info_listr
get_hp_ld_pd_info
qHq@|
}	~	d
}	~	0
ada_info_listr
	slot_listr*
get_ada_ld_pd_info
Disk Cache Policy\s+=\s(.+?)
z1/opt/MegaRAID/storcli/storcli64 /c%s/v%s show all)
retcoder
get_lsi_pd_cache
q0q(|
}	~	d
}	~	0
lsi_info_listr
get_lsi_ld_pd_info
Check ld and pd info error. %s)
Z	card_infor+
each_ld_itemZ
each_pd_itemZ
each_unassigned_oner*
get_check_ld_pd_info
hp_infoZ
hp_check_infor	
get_hp_info
ada_check_infor	
get_ada_info
lsi_check_infor	
get_lsi_info
Timeout)
	Exception)
signum
framer	
_handle_timeout
signal
SIGALRMr@
alarmZ
pySMARTZ
Device)
devnameZ
devtype
timeoutry
get_pysmart_disk
Nzwsmartctl -A %s |grep "Reallocated_Sector\|Reported_Uncorrect\|Current_Pending\|Offline_Uncorrectable\|Spin_Retry_Count"r
get_smart_info"
}	|	D
rXd#}
)3Nz!lsscsi -ws|grep disk| grep -v iqnr
lsscsi -t|grep diskrF
%s  %sr^
satar$
sasz
Get disk smart info error:%sr
Get all disk meta info error:%sr#
%s-%sr
z!This logicaldrive maybe is error.rs
findr
startswithZ
init_inspection_pd_listrF
CMD_TIMEOUTr>
firmwareZ
attributes
rawr_
cmd_line_typeZ
return_code_typeZ
output_typeZ
pdoutputZ
toutputZ
pd_info_outZ
one_typeZ	type_listr
tmprature_cr
Z	tmpratureZ
health_flageZ
smart_info
item
valuer*
get_powerleader_pd_info,
)6ru
util_sh_error_code_loaderZ
util_cvk_logr
<module>
