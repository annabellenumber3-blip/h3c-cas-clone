#!/bin/bash

SUSEOS="SUSE"

packagename='h3ccastoolsinstallpackage'

isUbuntu=`command -v dpkg 2>/dev/null`
if [ -n "$isUbuntu" ]; then
    isUbuntu="Ubuntu"
    if [ -f /etc/crontab ]; then
        sed -i '/castools_run/d' /etc/crontab
    fi
    if [ -f /etc/rc.d/rc.local ]; then
        sed -i '/castools_run/d' /etc/rc.d/rc.local
    fi
fi
isRedhat=`command -v rpm 2>/dev/null`
if [ -n "$isRedhat" ]; then
    isRedhat="Redhat"
    if [ -f /etc/crontab ]; then
        sed -i '/castools_run/d' /etc/crontab
    fi
    if [ -f /etc/rc.d/rc.local ]; then
        sed -i '/castools_run/d' /etc/rc.d/rc.local
    fi
fi

#SuSE
isSuSE=false
if [ -f /etc/SuSE-release ]; then
    isSuSE=true
elif [ -f /etc/os-release ]; then
    if grep -q $SUSEOS /etc/os-release; then
        isSuSE=true
    fi
fi

UBUNTU_NETCONF="/etc/network"
REDHAT_NETCONF="/etc/sysconfig/network-scripts"

if [ ! -f /usr/sbin/qemu-ga ]; then
    if [ ! -f /var/$packagename ];then
        if [ -f /var/$packagename.tar.gz ];then
            pushd /var
            tar -xzf $packagename.tar.gz
            popd
            chmod 755 /var/$packagename/CAS_tools_install.sh
        fi
    fi

    service NetworkManager stop
    if [ "X$isUbuntu" = "XUbuntu" ]; then
        if [ -f $UBUNTU_NETCONF/interfaces ] && [ -f $UBUNTU_NETCONF/cas_interfaces ]; then
            mkdir -p $UBUNTU_NETCONF/vmwareNetInfoBackup
            cp -f $UBUNTU_NETCONF/interfaces $UBUNTU_NETCONF/vmwareNetInfoBackup/interfaces
            mv -f $UBUNTU_NETCONF/cas_interfaces $UBUNTU_NETCONF/interfaces
        fi
        /var/$packagename/CAS_tools_install.sh
        service networking restart
    elif [ $isSuSE ]; then
        /var/$packagename/CAS_tools_install.sh
    elif [ "X$isRedhat" = "XRedhat" ]; then
        if [ -d $REDHAT_NETCONF ]; then
            mkdir -p $REDHAT_NETCONF/vmwareNetInfoBackup
            mv -f $REDHAT_NETCONF/ifcfg-en* $REDHAT_NETCONF/vmwareNetInfoBackup/
            mv -f $REDHAT_NETCONF/ifcfg-Wired_connection* $REDHAT_NETCONF/vmwareNetInfoBackup/
            mv -f $REDHAT_NETCONF/ifcfg-Profile* $REDHAT_NETCONF/vmwareNetInfoBackup/
        fi
        /var/$packagename/CAS_tools_install.sh
        service network restart
    else
        /var/$packagename/CAS_tools_install.sh
    fi

    rm -rf /var/$packagename
    rm -f /var/castools_run.sh
fi
