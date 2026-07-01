# File: inspection_all.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/util.package/scripts/inspection_all.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

############################################################################
#    File Name: get_inspection_info.py
# Date Created: 2017-12-06
#       Author: zhouyanchun
#  Description: call the script of ha, storage, network, compute module to
#               get inspection info
#-----------------------------------------------------------------------------
#  Modification History
#  DATE        NAME             DESCRIPTION
##############################################################################
allc
        execute the inspection script and print result
        args:
            script_name: the script name
            ids: the inspection checking items id
            level: the health level
    z5python /opt/bin/%s.pyc --id=%s --level=%s 2>/dev/nullT)
shellN)
HAToolsZ
execute_command
strip
print)
script_name
level
cmdZ
inspection_all.py
execute_inspection_script
connection string and return the result string
       args:
           source: the source string
           check_id: the string wait to connected
       return:
           return the destination string
    r
source
check_idr
connect_id%
call script to get the inspection info of network, storage, ha, compute module
       args:
          ids: the inspection checking items id
          level: the inspection checking item health level
    r
the check item %s is invalidz2<?xml version="1.0" encoding="utf-8"?>
<diagnoses>
inspection_ha)
target
argsZ
inspection_ovsZ
inspection_raid_card_diagnoseZ
inspection_novaZ!inspection_share_filesystem_checkZ
inspection_storage_checkz
</diagnoses>N)
ALL_CHECK_ITEMSr
split
intr
logging
errorr
	threading
Threadr
start
append
join)
ha_idsZ
storage_idsZ
network_idsZ
compute_idsZ
ids_listr
id_num
threadsZ
ha_tZ	network_tZ	storage_tZ	compute_tZ
storage2_tZ
storage3_t
get_inspection_info8
        analysis the parameters of id and level
    z#ha inspection script configuration.)
descriptionz
--idz(the check items ids in a key inspection.)
helpz
--level)
0x1Z
0x2Z
0x3Z
0x4Z
0x6r
zW0x1:normal, 0x2:warn, 0x3:warn and normal, 0x4:fault, 0x6:warn and fault, 0x7:all level)
choicesr%
Nz4get_inspection_info.py script --id parameter is nullz7get_inspection_info.py script --level parameter is null)
argparse
ArgumentParser
add_argument
parse_args
ALL_HEALTH_LEVELr#
argvZ	topParserr
main~
__main__r
cas_ha
__doc__r
util_cvk_logr
__name__Z
cas_log_init2Z
cas_log_init
sysr-
	Exception
	exceptionr
<module>
