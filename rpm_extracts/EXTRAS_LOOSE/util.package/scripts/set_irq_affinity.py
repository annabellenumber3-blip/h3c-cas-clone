# File: set_irq_affinity.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/util.package/scripts/set_irq_affinity.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

zDe e
e%e&e
rve#
############################################################################
#    File Name: set_irq_affinity.py
# Date Created: 2017-03-23
#       Author: zhangjixiang 08687
#  Description: set and get irq affinity
#        Input:
#       Output:
#       Return: 0 if succeffully, other with errors
#      Caution:
#-----------------------------------------------------------------------------
#  Modification History
#  DATE        NAME             DESCRIPTION
##############################################################################
/etc/cvk/irq_affinity.confz	/proc/irqZ
smp_affinity_listc
CPUS
cpu_list)
path
exists
IRQ_CONFIG_PATH
configparser
ConfigParser
read
get)
exist
list
set_irq_affinity.py
get_affinity_cpus*
cpus:z
systemctl status irqbalanceT)
shell
stdoutz
utf-8z
irqbalance start/runningFr
subprocess
Popen
PIPEr
decoder
has_sectionr
cpus
statusZ
status_strZ
runningr
cmd_get_irq_affinity6
	systemctl
start
irqbalance)
openr
Z	read_filer
add_sectionr
callZ
remove_option
write
cmd_execute_irq_affinity)
disabler
cmd_set_irq_affinityO
r~q8t
stopr!
ignore irq %sz
execute sucess!)
logging
infor
listdir
PROC_IRQ_PATHr
isdir
SMP_AFFINITY_FILE_NAMEr	
O_WRONLYr%
encode
close
print)
pathDir
elem
file
namer
set cvk irq affinity)
description
cmdz
irq options)
dest
helpZ
executer$
--cpusz+like --cpus 1,2,4,5,6,8 or --cpus 1-2,4-6,8)
typer=
z	--disable
store_truez
disable high performance mode)
actionr=
--statez
get irq affinity statez
Script Execute: 
parsed args : %s.Z
TODO)
argparse
ArgumentParser
add_subparsers
add_parser
add_argumentr3
join
argv
parse_args
debug
ERROR_CODE_OKr;
stater
top_parserZ
sub_parsersZ
sub_parser
args
outputr
main
__main__Z
set_performance_mode
	errorcodez
catch exceptionz
error code: %d, messge: %s)*
__doc__rB
stat
shutilr
json
globr
util_cvk_logr
ERROR_CODE_UNKNOWNZ
ERROR_CODE_INVALID_ARGUMENTr
__name__Z
cas_log_init2Z
cas_log_initrO
errorMessagerH
	Exception
hasattrrT
	exceptionr6
errorrK
exitr
<module>
