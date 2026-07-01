#!/bin/bash
##############################################################################
#    Func Name: install.sh
# Date Created: 2013-12-20
#       Author: gaoliang
#  Description: install libvirt package;
#        usage: 1. $0 [$1]
#               $1: install package dir
#       Output:
#       Return: 0  : success
#-----------------------------------------------------------------------------
#  Modification History
#  DATE        NAME             DESCRIPTION
#  2017.10.30  huangyong/14522  create tls certifate 201710200387
##############################################################################

#libvirt install package dir. not modify this dir.
LIBVIRT_PACKAGE_DIR=$1
if [ "X$LIBVIRT_PACKAGE_DIR" = "X" ]; then
    LIBVIRT_PACKAGE_DIR=/root/libvirt.package
else
    LIBVIRT_PACKAGE_DIR=$LIBVIRT_PACKAGE_DIR/libvirt.package
fi

DISTRIBUTOR_ID=$(/opt/bin/os_lsb_release --id | grep "Distributor" | awk -F " " '{print $3}' 2>/dev/null)

# cpu&mem threshold
if [ ! -d "/etc/cvk" ]; then
    mkdir /etc/cvk
fi

# set cpu & memory threshold value
mem_val=$(cat $LIBVIRT_PACKAGE_DIR/cpu_mem_threshold.conf | awk 'NR==1{print $4}')
mv -f $LIBVIRT_PACKAGE_DIR/cpu_mem_threshold.conf /etc/cvk
sync
while read line
do
    nameline=`echo $line | awk '{print $1}'`
    if [ "$nameline" = "MemTotal:" ]; then
        mem_total=`echo $line | awk '{print $2}'`
        mem_total=`expr $mem_total / 1048576`
        break
    fi
done < /proc/meminfo

if [ "X$mem_total" = "X" ]; then
    echo "ERROR: read MemTotal failed"
    mem_total=0
fi

[ ! -f /etc/cvk/rbd_vendor.conf ] && cp $LIBVIRT_PACKAGE_DIR/rbd_vendor.conf /etc/cvk/

mem_rev=0
if [ $mem_total -le 32 ]; then mem_rev=4;
elif [ $mem_total -le 64 ]; then mem_rev=6;
elif [ $mem_total -le 96 ]; then mem_rev=8;
else mem_rev=10;
fi
if [ -f /etc/cvk/cpu_mem_threshold.conf ] && [ $mem_rev -ne $mem_val ]; then
    sed -i "1s/\(.*\)$mem_val/\1$mem_rev/" /etc/cvk/cpu_mem_threshold.conf
fi

# remove libvirt-0.9.8
del_debs="python-libvirt libvirt-bin libvirt0"

remove_deb() {
    local deb=$1
    version=$(dpkg-query -W -f '${Version}' $deb 2>/dev/null || true)
    if test -n "$version" && dpkg --compare-versions $version lt 2.2.0 ;then
        dpkg --purge --force-all $deb
    else
        echo "ignore $deb, version=$version"
    fi
}

# install cas version
LIBVIRT_DEB_VERSION="6.3.0-1"
install_debs="$LIBVIRT_PACKAGE_DIR/libvirt0_"$LIBVIRT_DEB_VERSION"_amd64.deb
      $LIBVIRT_PACKAGE_DIR/libnss-libvirt_"$LIBVIRT_DEB_VERSION"_amd64.deb
      $LIBVIRT_PACKAGE_DIR/libvirt-clients_"$LIBVIRT_DEB_VERSION"_amd64.deb
      $LIBVIRT_PACKAGE_DIR/libvirt-daemon_"$LIBVIRT_DEB_VERSION"_amd64.deb
      $LIBVIRT_PACKAGE_DIR/libvirt-daemon-system_"$LIBVIRT_DEB_VERSION"_amd64.deb
      $LIBVIRT_PACKAGE_DIR/libvirt-dev_"$LIBVIRT_DEB_VERSION"_amd64.deb
      $LIBVIRT_PACKAGE_DIR/libvirt-daemon-driver-qemu_"$LIBVIRT_DEB_VERSION"_amd64.deb
      $LIBVIRT_PACKAGE_DIR/python-libvirt_"$LIBVIRT_DEB_VERSION"_amd64.deb"

function install_deb
{
    for deb in $del_debs; do
        remove_deb $deb
    done

    dpkg --install --force-confnew --force-confask $LIBVIRT_PACKAGE_DIR/libvirt0_"$LIBVIRT_DEB_VERSION"_amd64.deb
    dpkg --install --force-confnew --force-confask $LIBVIRT_PACKAGE_DIR/libnss-libvirt_"$LIBVIRT_DEB_VERSION"_amd64.deb
    dpkg --install --force-confnew --force-confask $LIBVIRT_PACKAGE_DIR/libvirt-clients_"$LIBVIRT_DEB_VERSION"_amd64.deb
    dpkg --install --force-confnew --force-confask $LIBVIRT_PACKAGE_DIR/libvirt-daemon_"$LIBVIRT_DEB_VERSION"_amd64.deb $LIBVIRT_PACKAGE_DIR/libvirt-daemon-driver-qemu_"$LIBVIRT_DEB_VERSION"_amd64.deb
    dpkg --install --force-confnew --force-confask $LIBVIRT_PACKAGE_DIR/libvirt-daemon-system-sysv_"$LIBVIRT_DEB_VERSION"_amd64.deb
    dpkg --install --force-confnew --force-confask $LIBVIRT_PACKAGE_DIR/libvirt-daemon-system_"$LIBVIRT_DEB_VERSION"_amd64.deb
    dpkg --install --force-confnew --force-confask $LIBVIRT_PACKAGE_DIR/libvirt-dev_"$LIBVIRT_DEB_VERSION"_amd64.deb
    dpkg --install --force-confnew --force-confask $LIBVIRT_PACKAGE_DIR/python-libvirt_"$LIBVIRT_DEB_VERSION"_amd64.deb

    echo "* *    * * *   root    /opt/bin/libvirtd_check.sh" >> /etc/crontab
}

function install_rpm
{
    rpm -ivh --nodeps --replacepkgs --replacefiles $LIBVIRT_PACKAGE_DIR/*.rpm
    # add autohuge free crontab
    has_check_autohugepage_scirpt=$(grep -rnw "check-autohugepage.sh" /etc/crontab)
    if [ "X$has_check_autohugepage_scirpt" == "X" ]; then
        sed -i '$a\*/5 *    * * *   root    flock -xn \/tmp\/check-autohugepage.sh.lock -c "\/opt\/bin\/check-autohugepage.sh"' /etc/crontab
    else
        sed -i 's/.*check-autohugepage.sh.*/*\/5 *    * * *   root    flock -xn \/tmp\/check-autohugepage.sh.lock -c "\/opt\/bin\/check-autohugepage.sh"/g' /etc/crontab
    fi
}

# backup libvirt deb to /vms/.casaudit/libvirt
CAS_AUDIT_LIBVIRT_DIR="/vms/.casaudit/libvirt"
if [ ! -d $CAS_AUDIT_LIBVIRT_DIR ]; then
    mkdir -p $CAS_AUDIT_LIBVIRT_DIR
fi
if [ -f /usr/bin/dpkg ]; then
    for deb in $install_debs; do
        cp $deb $CAS_AUDIT_LIBVIRT_DIR
    done
fi

distri=$(/opt/bin/os_lsb_release -is)
if [ "$distri" = "CentOS" ]; then
    cp $LIBVIRT_PACKAGE_DIR/*.rpm $CAS_AUDIT_LIBVIRT_DIR
    install_rpm
    systemctl enable virtagent.service
elif [ "$distri" = "H3Linux" ]; then
    cp $LIBVIRT_PACKAGE_DIR/*.rpm $CAS_AUDIT_LIBVIRT_DIR
    install_rpm
    systemctl enable virtagent.service
elif [ "$distri" = "Ubuntu" ]; then
    install_deb
fi

# libvirt pool
state_file="/run/libvirt/storage/defaultpool.xml"
if [ -e $state_file ];then
    echo "state file:$state_file"
    uuid_str=`grep "<uuid>" $state_file`
    uuid=${uuid_str##*<uuid>}
    uuid=${uuid%%</uuid>*}
    echo "Found uuid $uuid in state file $state_file"
else
    uuid=`cat /proc/sys/kernel/random/uuid`
fi
sed -i "/<name>defaultpool/a \ \ <uuid>$uuid<\/uuid>" $LIBVIRT_PACKAGE_DIR/defaultpool.xml
mv -f $LIBVIRT_PACKAGE_DIR/defaultpool.xml        /etc/libvirt/storage

state_file="/run/libvirt/storage/isopool.xml"
if [ -e $state_file ];then
    echo "state file:$state_file"
    uuid_str=`grep "<uuid>" $state_file`
    uuid=${uuid_str##*<uuid>}
    uuid=${uuid%%</uuid>*}
    echo "Found uuid $uuid in state file $state_file"
else
    uuid=`cat /proc/sys/kernel/random/uuid`
fi
sed -i "/<name>isopool/a \ \ <uuid>$uuid<\/uuid>" $LIBVIRT_PACKAGE_DIR/isopool.xml
mv -f $LIBVIRT_PACKAGE_DIR/isopool.xml            /etc/libvirt/storage

ln -s /etc/libvirt/storage/defaultpool.xml /etc/libvirt/storage/autostart/defaultpool.xml
ln -s /etc/libvirt/storage/isopool.xml     /etc/libvirt/storage/autostart/isopool.xml
rm -f /etc/libvirt/qemu/networks/default.xml
rm -f /etc/libvirt/qemu/networks/autostart/default.xml

mkdir -p /etc/pki/libvirt-spice
mv -f $LIBVIRT_PACKAGE_DIR/*.pem /etc/pki/libvirt-spice

#add tls root ca to prepare for making tls server/client ca in first_boot.sh
#modify postfix .pem to .pem.t to prevent our cert from moving to /etc/pki/libvirt-spice above
mkdir -p /var/tls
mv -f $LIBVIRT_PACKAGE_DIR/ca-cert.pem.t /var/tls/ca-cert.pem
mv -f $LIBVIRT_PACKAGE_DIR/ca-key.pem.t /var/tls/ca-key.pem

# 201601270230
if [ ! -d /vms/.qemu/save/ ]; then
    mkdir -p /vms/.qemu/save
fi
if [ ! -L /var/lib/libvirt/qemu/save ]; then
    if [ ! -d /var/lib/libvirt/qemu/save ]; then
        ln -s /vms/.qemu/save /var/lib/libvirt/qemu/save
    elif [ -d /var/lib/libvirt/qemu/save ]; then
        mv -f /var/lib/libvirt/qemu/save/* /vms/.qemu/save/
        rmdir /var/lib/libvirt/qemu/save
        ln -s /vms/.qemu/save /var/lib/libvirt/qemu/save
    fi
fi

# 202008150543
hostArch=""
if [ "X$(which uname)" != "X" ]; then
    hostArch=$(uname --machine)
fi
# is FT CPU
isCpuFT=0
if [ "X$(which dmidecode)" != "X" ]; then
    dmidecode | grep -iqP "huawei|qemu"; isCpuFT=$?
fi
# set host uuid for libvirtd.conf
if [ "$hostArch" == "aarch64" ] && [ "$isCpuFT" -eq 1 ]; then
    libvirtd_conf_path="/etc/libvirt/libvirtd.conf"
    if [ -e $libvirtd_conf_path ] && [ "X$(grep -e "^host_uuid" ${libvirtd_conf_path})" == "X" ]; then
        lineNum=$(grep -ne "^#host_uuid_source" $libvirtd_conf_path | awk -F ":" '{print $1}')
        genHostUUID=""
        if [ "X$(which uuidgen)" != "X" ]; then
            genHostUUID=$(uuidgen | awk '{print toupper($0)}')
        fi
        if [ "X$lineNum" != "X" ] && [ "X$genHostUUID" != "X" ]; then
            str="host_uuid = \"${genHostUUID}\""
            sed -i "${lineNum} a${str}" $libvirtd_conf_path
            if [ "X$(which systemctl)" != "X" ]; then
                systemctl restart libvirtd.service
            else
                service libvirt-bin restart
            fi
        fi
    fi
fi

# start libvirt service when not running, 202008240585
libvirtd_status=$(pidof libvirtd)
if [ "X$libvirtd_status" == "X" ]; then
    if [ "$DISTRIBUTOR_ID" == "CentOS" ]; then
        systemctl restart libvirtd.service
    elif [ "$DISTRIBUTOR_ID" == "H3Linux" ]; then
        systemctl restart libvirtd.service
    elif [ "$DISTRIBUTOR_ID" == "Ubuntu" ]; then
        service libvirt-bin restart
    else
        echo "warning: unknown distributor id of this host '$DISTRIBUTOR_ID'"
    fi
fi
