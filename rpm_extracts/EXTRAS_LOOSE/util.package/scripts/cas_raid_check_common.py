# File: cas_raid_check_common.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/util.package/scripts/cas_raid_check_common.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

Z	d	d
]"}	d
d |	
d$} d%}!t
}#t	|
|#d'<
|#d'
|#d(<
}$|$d)k
|#d*<
|$|#d*<
t	|!|"
r0t	d+|"
|#d,<
|%|&
|#d,<
|	|#d
}'|'|#d-<
d.|"
| |"
}(|(D
}*|)
}+|#d(
|*d(<
|+d/
|+d2
|*d3<
|+d4
|+d5
|+d6
},|,d
|,d7d
|*d3
)<N)
assigned
unassignedz
/usr/local/sbin/arcconf listr
'Run %s error, output %s, return code %sr
Controller\s(\d+?):.+?
Cannot get controller number.z'/usr/local/sbin/arcconf getconfig %s pdz Device is a Hard drive[\s\S]+?
zAReported Location.+?Enclosure\s(\d+?).+Slot\s(\d+?)\(Connector.+
Write Cache\s+:\s(\S+?)\s.+?
[\s]+State\s+?:\s(.+?)
z Transfer Speed\s+?:\s(.+?)\s.+?
SSD\s+?:\s(.+?)
z Total Size\s+?:\s(\d+?)\s(\S+?)
z:Cannot find physical device info with controller number %sz
0z-Reported Location.+Slot\s(\d+?)\(Connector.+
%s:%s
disk_cache
	interface
size
unitZ
media
slot_numZ
Onlinez'/usr/local/sbin/arcconf getconfig %s ldz
Logical Device number[\s\S]+?
Logical Device number (\d+)
RAID level\s+:\s(.+?)
Segment\s\d+.+?
Unique Identifier\s+?:\s(.+?)
z)Cannot get ld info. maybe it is not raid.
ld_num
arrayZ
Simple_volume
raidz
Disk Name.+:\s(.+?)
diskname_value
Device\s\d+.+?
locate
3Cannot get this disk info, maybe the disk is error.z:Cannot get this disk info, maybe the disk is error.msg: %sz
adaptec raid check failed. %s)
cas_cmds_execute
logging
error
findallZ
warning
init_pd_info_listZ
ada_is_p460
cas_get_keyword
BaseException
	traceback
format_exc
init_ld_info_listZ
ada_is_pmc8060
get_disk_name
split
append)-Z
assigned_dictZ
unassigned_dictZ
ada_pd_dict
ld_list
cmd_line
return_code
outputZ
ctrl_patZ
ctrl_num_list
ctrl_numZ
ada_pd_outputZ
ada_pd_patZ
ada_pd_infoZ
location_patZ
write_cache_patZ
pd_status_patZ
interface_patZ	media_patZ
size_patZ
each_pd
locationZ
pd_info_dictZ	pd_statusZ	enclosureZ
slotr
media_infoZ	ld_outputZ
ada_ld_patZ
ada_ld_listZ
ld_num_patZ
raid_patZ
pd_patZ
disk_id_patZ
ada_ld
ld_dictZ
raid_levelZ
disk_idZ
is_pmc8060
pd_list
pd_outr
pd_dict
pd_infoZ
size_str
cas_raid_check_common.py
ada_pd_check_info
zvt	
q8d'|
} | d(
qFnTi
}!| d
| d 
| d#
)+Nz
/opt/MegaRAID/storcli/storcli64z
%s showr
z-[-]+?
Ctl\s+?Model.+?
[-]+?
([\s\S]+?)[-]+?
z2/opt/MegaRAID/storcli/storcli64 /c%s/vall show allz-/c%s/v\d+?[\s\S]+?VD\d+\sProperties[\s\S]+?
z)Cannot get vd info. maybe it is not raid.z![-]+?
DG/VD.+?
[-]+?
(.+?
)[-]+?
z'[-]+?
EID:Slt.+?
[-]+?
([\s\S]+?)[-]+?
z)Write Cache\(initial setting\)\s=\s(.+?)
Disk Cache Policy\s=\s(.+?)
SCSI NAA Id =\s(.+?)
Z	WriteBack
raid_cacher
z3/opt/MegaRAID/storcli/storcli64 /c%s/eall/sall show
Onlnz!Get lsi raid card info failed. %s)
stripr-
)"r/
unassigned_pd_dict
pathr0
ctrl_output
patZ
ctrl_infosZ	ctrl_numsZ	each_ctrlr3
vd_outZ
detail_vd_patZ
vd_infoZ
simple_vd_patZ
simple_pd_patZ
raid_cache_patZ
disk_cache_patZ
scsi_naa_patZ
vdr5
simple_vd_listr@
scsi_naar6
simple_pd_listr
one_pdr7
one_pd_listr4
lsi_pd_check_info
)	Ni
floatr"
exit)
unit_GBZ
unit_TBr
uniform_size
set_level failed. %s)
sorted
values
keysr.
level_dict
level
tupZ
last
eachr:
	set_level)
sasZ
satar
SASr
SATAr
Enabledr
classify failed. %s)
hdd_dictZ
ssd_dictZ	each_itemZ
disk_cache_statusZ
hdd_sas_dictZ
hdd_sata_dictZ
ssd_sas_dictZ
ssd_sata_dictr
classify=
intr-
<lambda>^
z"disk_order_check.<locals>.<lambda>)
cmprA
server has back diskz
server has no back diskrT
sortr!
debugr(
)	rN
locate0Z
locate1
retZ	disk_list
lengthZ
last_to_secondZ
last_to_thirdr:
disk_order_checkW
)	Nr
lspci | grep -i Adaptecz
lspci -v -s %sz
P408i-p
Nonez
raidcard type is P408r
raid install check failed. %s)
infor(
flagr0
pci_numZ
ada_ctrl_infoZ
name_patr$
is_p480_raidt
Adaptecz#Hewlett-Packard Company Smart Array
Broadcom / LSIz
lspci | grep -i "%s"r
z	LSI Logic)
raid_cards_listrQ
get_raid_cards_list
one_ldr:
set_raid_cache_for_SSD
subprocessr$
util_cvk_logZ
inspection_raid_card_funcr<
<module>
