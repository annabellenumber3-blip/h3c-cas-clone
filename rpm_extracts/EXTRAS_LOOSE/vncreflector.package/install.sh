##############################################################################
#    Func Name: install.sh
# Date Created: 2013-12-20
#       Author: gaoliang
#  Description: install vnc package;
#        usage: 1. $0 [$1] 
#               $1: install package dir
#       Output: 
#       Return: 0  : success
#-----------------------------------------------------------------------------
#  Modification History 
#  DATE        NAME             DESCRIPTION
##############################################################################

#vnc install package dir. not modify this dir.
VNC_PACKAGE_DIR=$1
if [ "X$VNC_PACKAGE_DIR" = "X" ]; then
    VNC_PACKAGE_DIR=/root/vncreflector.package
else
    VNC_PACKAGE_DIR=$VNC_PACKAGE_DIR/vncreflector.package
fi

tar -zxf $VNC_PACKAGE_DIR/vncreflector.tar.gz -C /usr/local

mv -f $VNC_PACKAGE_DIR/scripts/* /opt/bin
#environment
echo VNCREFLECTOR_SHELL_SCRIPT_PATH=\"/opt/bin\"  >> /etc/environment

mkdir -p /var/log/noVNC

install_centos() {
    [ ! -d "/usr/local/noVNC/utils/" ] && mkdir -p /usr/local/noVNC/utils/
    [ ! -d "/usr/local/noVNC/vnc_tokens/" ] && mkdir -p /usr/local/noVNC/vnc_tokens/
    cp -f $VNC_PACKAGE_DIR/casnovnc_centos.pem /usr/local/noVNC/utils/
    cp -f $VNC_PACKAGE_DIR/casnovnc.service /usr/lib/systemd/system/
    systemctl daemon-reload
    systemctl enable casnovnc.service
    systemctl start casnovnc.service
}

install_ubuntu() {
    tar -zxf $VNC_PACKAGE_DIR/noVNC.tar.gz -C /usr/local
    cp -f $VNC_PACKAGE_DIR/casnovnc.pem /usr/local/noVNC/utils/
    cp -f $VNC_PACKAGE_DIR/websocket.* /usr/local/noVNC/utils/
    mv -f $VNC_PACKAGE_DIR/novnc /etc/init.d/
    chmod +x /etc/init.d/novnc
    ln -sf /etc/init.d/novnc /etc/rc2.d/S42novnc
    echo "* *    * * *   root    /opt/bin/novnc_check.sh" >> /etc/crontab

    rm -f $VNC_PACKAGE_DIR/*.deb
}

distri=$(/opt/bin/os_lsb_release -is)
if [ "$distri" = "CentOS" ] || [ "$distri" = "H3Linux" ]; then
    install_centos
else
    install_ubuntu
fi

rm -f $VNC_PACKAGE_DIR/*.tar.gz
    
exit 0