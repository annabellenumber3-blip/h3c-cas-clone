#!/bin/bash
##############################################################################
#    Func Name: first_boot.sh
# Date Created: 2013-12-20
#       Author: gaoliang
#  Description: run at the first boot of system
#        usage: 1. $0 [$1]
#       Output:
#       Return: 0  : success
#-----------------------------------------------------------------------------
#  Modification History
#  DATE        NAME             DESCRIPTION
##############################################################################

if [ -f /opt/bin/proc_list_check.pyc ]; then
    /usr/bin/python3 /opt/bin/proc_list_check.pyc -t init
fi
