##############################################################################
#    Func Name: install.sh
# Date Created: 2013-12-20
#       Author: gaoliang
#  Description: install xsconsole package;
#        usage: 1. $0 [$1] 
#               $1: install package dir
#       Output: 
#       Return: 0  : success
#-----------------------------------------------------------------------------
#  Modification History 
#  DATE        NAME             DESCRIPTION
##############################################################################

#xsconsole install package dir. not modify this dir.
XSCONSOLE_PACKAGE_DIR=$1
if [ "X$XSCONSOLE_PACKAGE_DIR" = "X" ]; then
    XSCONSOLE_PACKAGE_DIR=/root/xsconsole.package
else
    XSCONSOLE_PACKAGE_DIR=$XSCONSOLE_PACKAGE_DIR/xsconsole.package
fi

# xsconsole will not install on phytium
uname -m | grep -iq "aarch64"
if [ $? -eq 0 ]; then
    #fix:202102230543 modify huawei to kunpeng,reserve original || support FT2500 and FT5000
    dmidecode | grep -iqP "huawei|kunpeng|qemu" || dmidecode -t processor | grep  'Version:' | grep -iqP 'S2500|S5000'
    if [ $? -ne 0 ]; then
        echo "xsconsole will not install on phytium"
        exit 0
    fi
fi

tar -xf $XSCONSOLE_PACKAGE_DIR/xsconsole.tar -C /usr/lib
mv -f $XSCONSOLE_PACKAGE_DIR/xsconsole_run /usr/bin
chmod +x /usr/bin/xsconsole_run
mv -f $XSCONSOLE_PACKAGE_DIR/set-printk-console /usr/bin
chmod +x /usr/bin/set-printk-console
if [ "X$(/opt/bin/os_lsb_release -is)" = "XCentOS" ] || [ "X$(/opt/bin/os_lsb_release -is)" = "XH3Linux" ]; then
    mv -f $XSCONSOLE_PACKAGE_DIR/xsconsole.service /usr/lib/systemd/system
    systemctl enable xsconsole.service
fi
if [ -f /usr/bin/dpkg ]; then
    sed -i 's/^exec.*$/exec\ \/sbin\/getty\ -i\ -a\ root\ -l\ \/usr\/bin\/xsconsole_run\ tty1/g' /etc/init/tty1.conf
fi

rm -f $XSCONSOLE_PACKAGE_DIR/*.tar

exit 0
