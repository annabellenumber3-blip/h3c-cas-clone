# File: run_cmd.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/util.package/scripts/run_cmd.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

############################################################################
#    File Name: run_cmd.py
# Date Created: 2018-08-03
#       Author: renqinwei 15723
#  Description: CVM penetrate to run cmd. The cmd must be permitted in
                whitelist.
#       Return: 0 if successfully, other with errors
#      Caution:
#-----------------------------------------------------------------------------
#  Modification History
#  DATE        NAME             DESCRIPTION
##############################################################################
/etc/cvk/cmd_whitelist.xml
logging
error
	Exception
	errorcode)
error_codeZ
error_info
run_cmd.py
raise_error
Cmdc
param
command
cmd_whitelist
selfr
__init__%
Cmd.__init__c
penetrate to run cmd)
descriptionz
--cmdz
JSON type command string)
helpz
cmd: %s)
argparse
ArgumentParser
add_argument
parse_argsr
parse_json_param)
argv
parser
argsr
get_cmd_param+
Cmd.get_cmd_paramc
z"String (%s) has not 'command' key.Z	arguments
Command (%s) type is wrong.)
json
loads
keysr	
stripr
ERROR_CODE_INVALID_PARAM_VALUEr
split
joinr
cmdJson
dataZ
cmd_tmpr
Cmd.parse_json_paramc
cmd_info)
parse
CMD_WHITELIST_CONFIG_PATHZ
getroot
findr
append
text)
rootr/
get_cmd_whitelistD
Cmd.get_cmd_whitelistc
Nz$Command (%s) whitelist check failed.)
ERROR_CODE_CMD_WHITELIST_CHECKr
check_whitelistJ
Cmd.check_whitelistc
%s %sT)
shellz
Run cmd %s 
result: 
subprocessZ
check_output
printr
resultr
exe_cmdO
Cmd.exe_cmdN)	
__name__
__module__
__qualname__r
cmd_obj
mainU
__main__r
run_cmdz
Log init finish.r
Script exit result Id: %s)!
__doc__r&
util_cvk_logZ
xml.etree.ElementTreeZ
etreeZ
ElementTreer0
ERROR_CODE_OKZ
ERROR_CODE_UNKNOWNr*
objectr
cas_log_init2Z
cas_log_initr
sysr 
hasattrr
exitr
<module>
