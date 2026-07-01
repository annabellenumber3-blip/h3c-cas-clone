##############################################################################
#    Func Name: install.sh
# Date Created: 2013-12-20
#       Author: gaoliang
#  Description: install bakup;
#        usage: 1. $0 [$1] 
#               $1: install package dir
#       Output: 
#       Return: 0  : success
#-----------------------------------------------------------------------------
#  Modification History 
#  DATE        NAME             DESCRIPTION
##############################################################################

#backup install package dir. not modify this dir.
BACKUP_PACKAGE_DIR=$1
if [ "X$BACKUP_PACKAGE_DIR" = "X" ]; then
    BACKUP_PACKAGE_DIR=/root/backup-restore.package
else
    BACKUP_PACKAGE_DIR=$BACKUP_PACKAGE_DIR/backup-restore.package
fi
#environment
echo BR_SHELL_PATH=\"/opt/bin\"  >> /etc/environment

mv -f $BACKUP_PACKAGE_DIR/scripts/* /opt/bin
mv -f $BACKUP_PACKAGE_DIR/scripts_noencr/* /opt/bin
