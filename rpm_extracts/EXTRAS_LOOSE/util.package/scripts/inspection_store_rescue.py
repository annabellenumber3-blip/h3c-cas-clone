# File: inspection_store_rescue.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/util.package/scripts/inspection_store_rescue.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

rjzhz
Z![!n
Z![!0
ElementTree)
getDOMImplementation)
1510Z
1511Z
1512Z
1513
1514Z
1515Z
1517)
1520Z
1521Z
1522Z
1523
1524Z
1525c
sl|	d
Nz2ssacli ctrl slot=%s modify drivewritecache=disabler
z4Set physical device cache error. please have a check
	bbu_value
controllerstatus_valueZ
Disabled
7BBU value or raid card status is error.set cache error.z@ssacli ctrl slot=%s logicaldrive %s modify caching=enable forcedzfSet loggical device cache error.it is maybe a ssd type card or something is wrong, please have a check)
pd_id_list
uis_cmds_execute
logging
error
ld_id_listZ
get_hp_ctrl_info
warn)
cmd_id
is_ssd
slot_num
logical_num
pd_operate_cmd
pd_ret
output
	ctrl_listr
ctrl_status
ld_operate_cmd
ld_ret
inspection_store_rescue.py
hp_raid_card_rescue
}	|	|
Nz'/usr/local/sbin/arcconf getconfig %s pdz5/usr/local/sbin/arcconf setcache %s deviceall disablez
already Disabled
None
PSet loggical device cache error.it is maybe a ssd type card, please have a checkr
%s Already disabledr
1z8/usr/local/sbin/arcconf setcache %s logicaldrive %s coffz
already set to DisabledzMSet loggical device cache error.maybe something is wrong, please have a checkz
%s:%s Already disabledz7/usr/local/sbin/arcconf setcache %s logicaldrive %s conz
already set to Enabledz
%s:%s Already enabled)
uis_get_keywordr
debugr
get_ada_ctrl_infor
ld_id)
ctr_numr
cmd_liner
resultr
ada_raid_card_rescue+
sh|	d
Nz9/opt/MegaRAID/storcli/storcli64 /c%s/vall set pdcache=offr!
Offr
z7/opt/MegaRAID/storcli/storcli64 /c%s/v%s set wrcache=WBzeSet logical device cache error.it is maybe a ssd type card or something is wrong, please have a check)
get_lsi_ctrl_infor
wr_operate_cmdZ
wr_retr
lsi_raid_card_rescueW
print xml info error. %s)
SubElement
text
BaseExceptionr
	traceback
format_exc)
	diag_dict
itemZ
ret_code
betr
	print_xmlr
raid_card_namer
fromstring
findallr(
rootr-
raid_card_typer
%store_rescue_get_param_from_xmlstring{
zTGet key word from xml str:cmd id %s, raid_card_type %s, slot_num %s, is_ssd %s ln %sz
Hewlett-PackardZ
LSIZ
Adaptecz
This is a p408 raid cardz
Raid cards type error:%sr
lenr
ada_is_p408r%
printZ
tostring)
retZ
return_coder,
raid_card_rescue_main
__main__Z
inspection_storZ
caslogz
Get inspect result diagnoses.)
descriptionz
--param
xmlstrz	xml infor)
dest
type
helpz
Store rescue: input param: %sz	Error. %sr
Store rescue successfull.)%
argparse
subprocessr
util_cvk_logZ	xml.etreer
xml.dom.minidomr
inspection_raid_card_funcr
__name__Z
cas_log_init3Z
cas_log_init
ArgumentParserZ
top_parser
add_argument
parse_args
argsr
exitr
<module>
