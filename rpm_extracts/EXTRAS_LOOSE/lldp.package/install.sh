##############################################################################
#    Func Name: install.sh
# Date Created: 2013-12-20
#       Author: gaoliang
#  Description: install lldp package;
#        usage: 1. $0 [$1]
#               $1: install package dir
#       Output:
#       Return: 0  : success
#-----------------------------------------------------------------------------
#  Modification History
#  DATE        NAME             DESCRIPTION
##############################################################################

#lldp install package dir. not modify this dir.
LLDP_PACKAGE_DIR=$1
distri=$(/opt/bin/os_lsb_release -is)
if [ "X$LLDP_PACKAGE_DIR" = "X" ]; then
    LLDP_PACKAGE_DIR=/root/lldp.package
else
    LLDP_PACKAGE_DIR=$LLDP_PACKAGE_DIR/lldp.package
fi
if [ "X$distri" = "XUbuntu" ]; then
    dpkg -i $LLDP_PACKAGE_DIR/open-lldp-*_amd64.deb
    rm $LLDP_PACKAGE_DIR/*.deb
elif [ "X$distri" = "XCentOS" ] || [ "X$distri" = "XH3Linux" ]; then
    rpm -e --nodeps lldpad 2>/dev/null
    rpm -ivh --nodeps --replacepkgs --replacefiles $LLDP_PACKAGE_DIR/lldpad*.rpm
    rm $LLDP_PACKAGE_DIR/*.rpm
fi
mv -f $LLDP_PACKAGE_DIR/lldpad /etc/logrotate.d/

