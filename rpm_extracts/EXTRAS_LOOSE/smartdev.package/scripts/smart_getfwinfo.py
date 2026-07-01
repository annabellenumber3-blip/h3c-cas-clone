# File: smart_getfwinfo.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/smartdev.package/scripts/smart_getfwinfo.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

rje	e
ls /dev/mst 1>/dev/null 2>&1T
shellr
mst start 1>/dev/null 2>&1z
Failed to start mst.
subprocess
call
print
exit)
smart_getfwinfo.py
check_mst_status
t	yx
Nz%mlxfwmanager -d %s --query-format xmlTr
check_output
decode
	xmltodict
parse
json
dumpsr
	Exception
logging
errorr
fw_cmd
fw_info_xml_str
fw_info_dict
fw_info_json
get_dev_fw_info
}	~	n
}	~	0
ls /dev/mstTr
z.mlxfwmanager -d /dev/mst/%s --query-format xmlr
strip
splitr
dev_fw_dictZ
ls_cmdZ
dev_strZ
dev_listr
get_all_dev_fw_info
Get smartnic firmware info.)
descriptionz
--all
store_truez(Display all smartnic configuration info.)
action
helpz
--deviceziPerform operation for specified mst device(s). Run 'mst status -v' command to list the available devices.)
argparse
ArgumentParser
add_argument
parse_argsZ
devicer
argv
parser
argsr
	parse_cmd2
__main__r
__name__r*
<module>
