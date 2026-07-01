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

#create server-cert.pem server-key.pem client-cert.pem client-key.pem for tls migrate
tls_migrate_cert_install_log="/var/log/tls_migrate_cert_install.log"
tools_ok="no"

[ -d /var/tls ] && [ -f /var/tls/ca-cert.pem ] && [ -f /var/tls/ca-key.pem ] && \
[ -f /opt/bin/cas_tls_gen_cert.pyc ] && tools_ok="yes"

echo "`date`: create tls certificate done. tools_ok: $tools_ok" >> $tls_migrate_cert_install_log

if [ "$tools_ok" == "yes" ]; then
    hostname=`hostname`
    python3 /opt/bin/cas_tls_gen_cert.pyc -t $hostname >> $tls_migrate_cert_install_log 2>&1
    mkdir -p /etc/pki/libvirt-migrate
    cp -f /var/tls/* /etc/pki/libvirt-migrate/ > /dev/null 2>&1
    rm -f /etc/pki/libvirt-migrate/ca-key.pem
    # service libvirt-bin restart
fi

exit 0
