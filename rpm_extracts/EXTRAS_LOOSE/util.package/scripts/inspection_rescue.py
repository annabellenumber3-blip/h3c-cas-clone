# File: inspection_rescue.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/util.package/scripts/inspection_rescue.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

HATools)
ElementTreec
        execute the inspection script and print result
        args:
            script_name - the script name
            ids - the inspection rescue items id
    z"python /opt/bin/%s.pyc 2>/dev/nullz/python /opt/bin/%s.pyc --param="%s" 2>/dev/nullz
cmdline:%sT)
shellN)
logging
infor
execute_command
print)
script_name
param
result
inspection_rescue.py
 execute_inspection_rescue_script
 range_subElement
        range subelement of param, rescue items
        args: root - xml root "item"
              id_str - id in string
              type_str - component-type in string
              name_str - component-name in string
              target_str - target-name in string
              info_str - info in string
    
item
component-type
component-name
target-namer
SubElement
text)
rootZ
id_strZ
type_strZ
name_strZ
target_strZ
info_str
subr
range_subElement'
 range_subElement
        range subelement of param, rescue items
        args: root - xml root "item"
              id
              type
              name
              target
              card_name
              slot
              is_ssd
              logical_num
              info
    r
raid_card_nameZ
slot_num
is_ssd
logical_numr
type
name
targetZ	card_nameZ
slotr
range_subElement_srorage8
q6q6t
        range rescue xml of different component
        args: str-xml of rescue items
    r
ElementZ
fromstring
intr
tostring
decode)
strZ
ha_rootZ
storage_rootZ
network_rootZ
compute_rootr
childZ
id_num
ha_xml
storage_xml
network_xml
compute_xmlr
	range_xmlQ
}	|	
)	z6rescue items
       args: param - parameters, xml
    z7<?xml version="1.0" encoding="utf-8"?>
<result>
<param>z	<param />Z
inspection_rescue_ha)
argsZ
inspection_ovs_rescueZ
inspection_store_rescuez
</param>
</result>N)	r1
	threading
Threadr
start
append
join)
threadsZ
ha_tZ	network_tZ	storage_t
rescue_inspection_itemsu
        analysis the parameters of id
    z!ha inspection fault items rescue.)
descriptionz
--param
parameters)
helpNz2inspection_rescue.py script --id parameter is nullz0inspection_rescue.py script --id parameter is %s)	
argparse
ArgumentParser
add_argument
parse_argsr
error
debugr;
argvZ	topParserr2
main
__main__
inspection_haZ
cas_har!
util_cvk_logZ
inspection_allr
Z	xml.etreer
__name__Z
cas_log_init2Z
cas_log_init
sysrE
	Exception
	exceptionr
<module>
