##############################################################################
#    Func Name: install.sh
# Date Created: 2013-12-20
#       Author: gaoliang
#  Description: install CAS tools;
#        usage: 1. $0 [$1] 
#               $1: install package dir
#       Output: 
#       Return: 0  : success
#-----------------------------------------------------------------------------
#  Modification History 
#  DATE        NAME             DESCRIPTION
##############################################################################

#castools install package dir. not modify this dir.
#for the Xconvertor tool injection castools driver
XC_SYSTEM_DIR=/usr/local/xc/system
XC_CASTOOLS_DIR=/usr/local/xc/castools
TOOLS_PACKAGE_DIR=$1
if [ "X$TOOLS_PACKAGE_DIR" = "X" ]; then
    TOOLS_PACKAGE_DIR=/root/castools.package
else
    TOOLS_PACKAGE_DIR=$TOOLS_PACKAGE_DIR/castools.package
fi
if [ ! -d "/etc/cvk" ]; then
    mkdir /etc/cvk
fi
arch=`uname -m`

mv -f $TOOLS_PACKAGE_DIR/*.iso  /vms/isos/
mv -f $TOOLS_PACKAGE_DIR/*.txt  /etc/cvk
mv -f $TOOLS_PACKAGE_DIR/scripts/* /opt/bin
mkdir -p /var/log/castools
mv /opt/bin/castools.logrotate /etc/logrotate.d/castools
chmod 644 /etc/logrotate.d/castools
if [ "X$arch" = "Xx86_64" ]; then
    mv -f $TOOLS_PACKAGE_DIR/*.tmpl /etc/cvk

    if [ -d /vms/isos/vfd ]; then
        rm -rf /vms/isos/vfd
    fi
    mv -f $TOOLS_PACKAGE_DIR/vfd  /vms/isos
    ln -sf /vms/isos/vfd/virtio-win7-0.1.185.vfd /vms/isos/virtio-win7.vfd
    ln -sf /vms/isos/vfd/virtio-win8.1-0.1.185.vfd /vms/isos/virtio-win8.1.vfd
    ln -sf /vms/isos/vfd/virtio-win8-0.1.185.vfd /vms/isos/virtio-win8.vfd
    ln -sf /vms/isos/vfd/virtio-win10-0.1.220.vfd /vms/isos/virtio-win10.vfd
    ln -sf /vms/isos/vfd/virtio-win11-0.1.220.vfd /vms/isos/virtio-win11.vfd
    ln -sf /vms/isos/vfd/virtio-win2003-0.1.185.vfd /vms/isos/virtio-win2003.vfd
    ln -sf /vms/isos/vfd/virtio-win2008-0.1.185.vfd /vms/isos/virtio-win2008.vfd
    ln -sf /vms/isos/vfd/virtio-win2008R2-0.1.185.vfd /vms/isos/virtio-win2008R2.vfd
    ln -sf /vms/isos/vfd/virtio-win2012-0.1.185.vfd /vms/isos/virtio-win2012.vfd
    ln -sf /vms/isos/vfd/virtio-win2012R2-0.1.185.vfd /vms/isos/virtio-win2012R2.vfd
    ln -sf /vms/isos/vfd/virtio-win2016-0.1.220.vfd /vms/isos/virtio-win2016.vfd
    ln -sf /vms/isos/vfd/virtio-win2019-0.1.220.vfd /vms/isos/virtio-win2019.vfd
    ln -sf /vms/isos/vfd/virtio-win2022-0.1.220.vfd /vms/isos/virtio-win2022.vfd
    ln -sf /vms/isos/vfd/virtio-winxp-0.1.185.vfd /vms/isos/virtio-winxp.vfd

    if [ -d /vms/isos/iso ]; then
        rm -rf /vms/isos/iso
    fi
    mv -f $TOOLS_PACKAGE_DIR/iso  /vms/isos
    ln -sf /vms/isos/iso/virtio-win7-0.1.185.iso /vms/isos/virtio-win7.iso
    ln -sf /vms/isos/iso/virtio-win8.1-0.1.185.iso /vms/isos/virtio-win8.1.iso
    ln -sf /vms/isos/iso/virtio-win8-0.1.185.iso /vms/isos/virtio-win8.iso
    ln -sf /vms/isos/iso/virtio-win10-0.1.220.iso /vms/isos/virtio-win10.iso
    ln -sf /vms/isos/iso/virtio-win11-0.1.220.iso /vms/isos/virtio-win11.iso
    ln -sf /vms/isos/iso/virtio-win2003-0.1.185.iso /vms/isos/virtio-win2003.iso
    ln -sf /vms/isos/iso/virtio-win2008-0.1.185.iso /vms/isos/virtio-win2008.iso
    ln -sf /vms/isos/iso/virtio-win2008R2-0.1.185.iso /vms/isos/virtio-win2008R2.iso
    ln -sf /vms/isos/iso/virtio-win2012-0.1.185.iso /vms/isos/virtio-win2012.iso
    ln -sf /vms/isos/iso/virtio-win2012R2-0.1.185.iso /vms/isos/virtio-win2012R2.iso
    ln -sf /vms/isos/iso/virtio-win2016-0.1.220.iso /vms/isos/virtio-win2016.iso
    ln -sf /vms/isos/iso/virtio-win2019-0.1.220.iso /vms/isos/virtio-win2019.iso
    ln -sf /vms/isos/iso/virtio-win2022-0.1.220.iso /vms/isos/virtio-win2022.iso
    ln -sf /vms/isos/iso/virtio-winxp-0.1.185.iso /vms/isos/virtio-winxp.iso

    driver_list="                                     \
               /vms/isos/virtio-winxp.iso             \
               /vms/isos/virtio-win7.iso              \
               /vms/isos/virtio-win8.iso              \
               /vms/isos/virtio-win8.1.iso            \
               /vms/isos/virtio-win10.iso             \
               /vms/isos/virtio-win2003.iso           \
               /vms/isos/virtio-win2008.iso           \
               /vms/isos/virtio-win2008R2.iso         \
               /vms/isos/virtio-win2012.iso           \
               /vms/isos/virtio-win2012R2.iso         \
               /vms/isos/virtio-win2016.iso           \
               /vms/isos/virtio-win2019.iso           \
               /vms/isos/virtio-win2022.iso"

    # Copy the castool exe for easy use by the Xconvertor tool
    xc_copy_castoolexe() {
        mkdir -p /tmp/xc_castool
        mount /vms/isos/castools.iso /tmp/xc_castool 2>/dev/null
        if [ -d $XC_CASTOOLS_DIR ]; then
            rm -rf $XC_CASTOOLS_DIR
        fi
        mkdir -p $XC_CASTOOLS_DIR
        cp -rf /tmp/xc_castool/* $XC_CASTOOLS_DIR
        umount /tmp/xc_castool
        rm -rf /tmp/xc_castool
    }

    # Xconvertor: copy castool drivers
    xc_copy_windriver() {
        mkdir -p /tmp/driver_iso
        for dr in $driver_list; do
            mount $dr /tmp/driver_iso 2>/dev/null
            sys=`echo ${dr#*-} |cut -d '.' -f 1`
            if [ ! -d $XC_SYSTEM_DIR/$sys ]; then
                mkdir $XC_SYSTEM_DIR/$sys
            fi
            cp -rf /tmp/driver_iso/* $XC_SYSTEM_DIR/$sys
            umount /tmp/driver_iso
        done
        rm -rf /tmp/driver_iso
    }

    # To adapt the Xconvertor tool
    if [ -d $XC_SYSTEM_DIR ]; then
        xc_copy_castoolexe
        if [ $? -ne 0 ]; then
            echo "tools install xc castoolexe failed."
            exit -1
        fi

        xc_copy_windriver
        if [ $? -ne 0 ]; then
            echo "tools install xc drivers failed."
            exit -1
        fi
    fi
fi




exit 0
