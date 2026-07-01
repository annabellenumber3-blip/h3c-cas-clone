#!/bin/bash
##############################################################################
#    Func Name: install.sh
# Date Created: 2013-12-20
#       Author: gaoliang
#  Description: install sa;
#        usage: 1. $0 [$1]
#               $1: install package dir
#       Output:
#       Return: 0  : success
#-----------------------------------------------------------------------------
#  Modification History
#  DATE        NAME             DESCRIPTION
##############################################################################

#sa install package dir. not modify this dir.
SA_PACKAGE_DIR=$1
if [ "X$SA_PACKAGE_DIR" = "X" ]; then
    SA_PACKAGE_DIR=/root/storage-admin.package
else
    SA_PACKAGE_DIR=$SA_PACKAGE_DIR/storage-admin.package
fi

# Move the scripts 
mv -f $SA_PACKAGE_DIR/scripts/* /opt/bin

#environment
echo SA_SHELL_SCRIPT_PATH=\"/opt/bin\"  >> /etc/environment
echo FC_SAN_SHELL_SCRIPT_PATH=\"/opt/bin\" >> /etc/environment
echo OCFS2_SHELL_SCRIPT_PATH=\"/opt/bin\" >> /etc/environment

# LVm configure file replace
# idms: 201909290175, We can not replace the lvm.conf on two places.
# So we only change the lvm.conf in the repository build-scripts
# and delete the operation as below. g02084 2019-10-31.
#filter_exist=$(grep "^\s*filter\s*=\s*\[ \"a\/\.\*\/\" \]" /etc/lvm/lvm.conf)
#if [ "X$filter_exist" = "X" ]; then
#    sed "s/^\s*filter\s.*/    filter = \[ \"a\/\.\*\/\" \]/g" /etc/lvm/lvm.conf > /etc/lvm/lvm.conf.tmp
#    mv /etc/lvm/lvm.conf.tmp /etc/lvm/lvm.conf
#    [ -f /etc/lvm/cache/.cache ] && rm -f /etc/lvm/cache/.cache
#fi

#add one cron task even execute install.sh repeat when configure environment manually
is_exist=$(grep "/opt/bin/ocfs2_iscsi_conf_chg_timer.sh" /etc/crontab)
if [ "X$is_exist" = "X" ]; then
    echo "* *    * * *   root    /opt/bin/ocfs2_iscsi_conf_chg_timer.sh" >> /etc/crontab
fi

is_exist=$(grep "/opt/bin/ocfs2_cluster_config.pyc" /etc/crontab)
if [ "X$is_exist" = "X" ]; then
    echo "*/10 *    * * *   root   python3 /opt/bin/ocfs2_cluster_config.pyc -s" >> /etc/crontab
fi

is_exist=$(grep "/opt/bin/ocfs2_filesystem_layout_backup.pyc" /etc/crontab)
if [ "X$is_exist" = "X" ]; then
    echo "0 */12    * * *   root   python3 /opt/bin/ocfs2_filesystem_layout_backup.pyc" >> /etc/crontab
fi

function install_on_ubuntu()
{
    #samba
    mv -f $SA_PACKAGE_DIR/cifs/options.conf /etc/modprobe.d

    ln -s /usr/bin/iscsiadm /sbin/iscsiadm

    #vstor lich, install in order
    dpkg -i $SA_PACKAGE_DIR/vstor-lich/libaio1_0.3.109-2ubuntu1_amd64.deb
    dpkg -i $SA_PACKAGE_DIR/vstor-lich/liblcms1_1.19.dfsg-1ubuntu3_amd64.deb

    dpkg -i $SA_PACKAGE_DIR/vstor-lich/python-greenlet_0.3.1-1ubuntu5_amd64.deb
    dpkg -i $SA_PACKAGE_DIR/vstor-lich/python-eventlet_0.9.16-1ubuntu4_all.deb

    dpkg -i $SA_PACKAGE_DIR/vstor-lich/python-httplib2_0.7.2-1ubuntu2_all.deb
    dpkg -i $SA_PACKAGE_DIR/vstor-lich/python-imaging_1.1.7-4_amd64.deb

    dpkg -i $SA_PACKAGE_DIR/vstor-lich/python-markupsafe_0.15-1_amd64.deb
    dpkg -i $SA_PACKAGE_DIR/vstor-lich/python-jinja2_2.6-1_amd64.deb

    dpkg -i $SA_PACKAGE_DIR/vstor-lich/python-mysqldb_1.2.3-1build1_amd64.deb
    dpkg -i $SA_PACKAGE_DIR/vstor-lich/python-prettytable_0.7.2-2ubuntu2_all.deb
    dpkg -i $SA_PACKAGE_DIR/vstor-lich/python-setuptools_0.6.24-1ubuntu1_all.deb

    dpkg -i $SA_PACKAGE_DIR/vstor-lich/python-webpy_0.34-2_all.deb

    dpkg -i $SA_PACKAGE_DIR/vstor-lich/libicu48_4.8.1.1-3_amd64.deb
    dpkg -i $SA_PACKAGE_DIR/vstor-lich/gdisk_0.8.1-1build1_amd64.deb
    dpkg -i $SA_PACKAGE_DIR/vstor-lich/numactl_2.0.8~rc3-1_amd64.deb

    dpkg -i $SA_PACKAGE_DIR/vstor-lich/hpacucli_9.40-13_amd64.deb

    dpkg -i $SA_PACKAGE_DIR/vstor-lich/megacli_8.07.08-1_all.deb

    dpkg -i $SA_PACKAGE_DIR/vstor-lich/hpssacli-2.40-13.0_amd64.deb

    dpkg -i $SA_PACKAGE_DIR/tgt/libsgutils2-2_1.40-0.1_amd64.deb
    dpkg -i $SA_PACKAGE_DIR/tgt/libsgutils2-dev_1.40-0.1_amd64.deb
    dpkg -i $SA_PACKAGE_DIR/tgt/sg3-utils_1.40-0.1_amd64.deb

    mv -f $SA_PACKAGE_DIR/vstor-lich/disk2lid /bin/
    chmod a+x /bin/disk2lid

    mv -f $SA_PACKAGE_DIR/vstor-lich/libstorelib.so.4.02-0 /usr/lib/
    ln -s /usr/lib/libstorelib.so.4.02-0 /usr/lib/libstorelib.so

    is_exist=$(dpkg -l | grep "tgt" | awk '{print $3}' | grep -w "1.0.17")
    if [ "X$is_exist" != "X" ]; then
        conf_exist=$(cat /etc/tgt/targets.conf | grep "<target")
        if [ "X$conf_exist" = "X" ]; then
            if [ ! -d "/etc/tgt/conf.d" ] || [ "`ls -A /etc/tgt/conf.d`" = "" ]; then
                dpkg -P tgt
                dpkg -P libconfig-general-perl
            fi
        fi
    fi
}

function install_on_centos()
{
    echo -e "\n-------------install on centos-----------------"
    cp -f $SA_PACKAGE_DIR/iscsi/iscsid.conf /etc/iscsi

    #copy binary file adaptive cpu architecture 
    UNAME_MACHINE=`uname -m`
    if [ "$UNAME_MACHINE" = "aarch64" ];then
        OCFS2_SHELL_SCRIPT_PATH='/opt/bin'
        mv $OCFS2_SHELL_SCRIPT_PATH/dev_not_busy_test $OCFS2_SHELL_SCRIPT_PATH/dev_not_busy_test.x86_64
        mv $OCFS2_SHELL_SCRIPT_PATH/dev_not_bad_test $OCFS2_SHELL_SCRIPT_PATH/dev_not_bad_test.x86_64
        cp -f $OCFS2_SHELL_SCRIPT_PATH/dev_not_busy_test.arm64 $OCFS2_SHELL_SCRIPT_PATH/dev_not_busy_test
        cp -f $OCFS2_SHELL_SCRIPT_PATH/dev_not_bad_test.arm64 $OCFS2_SHELL_SCRIPT_PATH/dev_not_bad_test
    fi
}

if [ -x /usr/bin/dpkg ];then
    install_on_ubuntu
else
    install_on_centos
fi

#pn:201705050259, no longer to instll vstor anymore
:<<eof
if [ ! -d /opt/mds/lich ]; then
    mkdir -p /opt/mds/lich
fi
if [ ! -d /opt/mds/etc ]; then
    mkdir -p /opt/mds/etc
fi
if [ ! -d /var/log/vstor ]; then
    mkdir -p /var/log/vstor
fi
ln -s /var/log/vstor /opt/mds/log

tar xvf $SA_PACKAGE_DIR/vstor-lich/lich-etc-master_v3.8.3c-a4e43-15071023-U.tar.gz -C /opt/mds/etc
tar xvf $SA_PACKAGE_DIR/vstor-lich/lich-ReleasePlus-v3.8.6f_8-23c70-17102016-U.tar.gz -C /opt/mds/lich

mv -f $SA_PACKAGE_DIR/vstor-lich/lich.conf /opt/mds/etc
rm -f /etc/init/tgt.conf

if [ ! -f /etc/ld.so.conf.d/lich.conf ]; then
    echo "/opt/mds/lich/lib" > /etc/ld.so.conf.d/lich.conf
    ldconfig
fi

#modify envirtment
sed "/\/usr\/games/d" /etc/environment > /etc/environment.tmp
mv -f /etc/environment.tmp /etc/environment
echo PATH\=\"${PATH}:/opt/bin:/opt/mds/lich/bin\" >> /etc/environment
eof
