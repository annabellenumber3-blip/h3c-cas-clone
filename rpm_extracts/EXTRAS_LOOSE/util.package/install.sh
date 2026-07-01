##############################################################################
#    Func Name: install.sh
# Date Created: 2013-12-20
#       Author: gaoliang
#  Description: install utils;
#        usage: 1. $0 [$1]
#               $1: install package dir
#       Output:
#       Return: 0  : success
#-----------------------------------------------------------------------------
#  Modification History
#  DATE        NAME             DESCRIPTION
##############################################################################

#utils install package dir. not modify this dir.
UTILS_PACKAGE_DIR=$1
if [ "X$UTILS_PACKAGE_DIR" = "X" ]; then
    UTILS_PACKAGE_DIR=/root/util.package
else
    UTILS_PACKAGE_DIR=$UTILS_PACKAGE_DIR/util.package
fi
#environment
echo UTIL_SHELL_SCRIPT_PATH=\"/opt/bin\"  >> /etc/environment

mkdir -p /opt/bin/
if [ ! -d /etc/cvk ]; then
    mkdir /etc/cvk
fi
mv -f $UTILS_PACKAGE_DIR/util_cvk_log.conf /etc/cvk/
mv -f $UTILS_PACKAGE_DIR/cas_device.conf /etc/cvk/
mv -f $UTILS_PACKAGE_DIR/pci_sriov_options.conf /etc/cvk/
mv -f $UTILS_PACKAGE_DIR/mem_hugepage_threshold.conf /etc/cvk/
mv -f $UTILS_PACKAGE_DIR/log_collect_commands /etc/cvk/
mv -f $UTILS_PACKAGE_DIR/log_collect_profilefiles /etc/cvk/
mv -f $UTILS_PACKAGE_DIR/cmd_whitelist.xml /etc/cvk/
mv -f $UTILS_PACKAGE_DIR/cpu_feature_filter.conf /etc/cvk/

# add ksmtuned and swapoff conf
mv -f $UTILS_PACKAGE_DIR/ksmtuned.conf /etc/
chmod 0644 /etc/ksmtuned.conf
# add ksmtuned daemon
mv -f $UTILS_PACKAGE_DIR/ksmtuned /usr/sbin/
chmod a+x /usr/sbin/ksmtuned

mv -f $UTILS_PACKAGE_DIR/scripts/* /opt/bin
# fix 202107050926
getarch=`arch`
if [ "X$getarch" = "Xx86_64" ]; then
    rm -f /opt/bin/busybox-aarch64
    mv -f /opt/bin/busybox-x86_64 /opt/bin/busybox
elif [ "X$getarch" = "Xaarch64" ]; then
    rm -f /opt/bin/busybox-x86_64
    mv -f /opt/bin/busybox-aarch64 /opt/bin/busybox
fi
chmod 755 /opt/bin/busybox

mv -f $UTILS_PACKAGE_DIR/util_tomcat_common_define /opt/bin

mv -f $UTILS_PACKAGE_DIR/Close_diskcache_for2000G3.sh /opt/bin
mv -f $UTILS_PACKAGE_DIR/58-uis2000G3cache.rules /etc/udev/rules.d

mv -f $UTILS_PACKAGE_DIR/caslog.logrotate /etc/logrotate.d/caslog
mv -f $UTILS_PACKAGE_DIR/smartdev.logrotate /etc/logrotate.d/smartdev

mv -f $UTILS_PACKAGE_DIR/system_ports /etc/cvk/
mv -f $UTILS_PACKAGE_DIR/system_ports.default /etc/cvk/

# fix 202005260947
if [ ! -d /var/log/tar ]; then
    mkdir -p /var/log/tar
fi
rm -f /etc/logrotate.d/rsyslog
install -m 0644 $UTILS_PACKAGE_DIR/cron /etc/logrotate.d/cron
install -m 0644 $UTILS_PACKAGE_DIR/maillog /etc/logrotate.d/maillog
install -m 0644 $UTILS_PACKAGE_DIR/messages /etc/logrotate.d/messages
install -m 0644 $UTILS_PACKAGE_DIR/secure /etc/logrotate.d/secure
install -m 0644 $UTILS_PACKAGE_DIR/spooler /etc/logrotate.d/spooler

rm -f /etc/logrotate.d/bootlog
install -m 0644 $UTILS_PACKAGE_DIR/bootlog /etc/logrotate.d/bootlog
rm -f /etc/logrotate.d/btmp
install -m 0644 $UTILS_PACKAGE_DIR/btmp /etc/logrotate.d/btmp
rm -f /etc/logrotate.d/chrony
install -m 0644 $UTILS_PACKAGE_DIR/chrony /etc/logrotate.d/chrony
rm -f /etc/logrotate.d/dnf
install -m 0644 $UTILS_PACKAGE_DIR/dnf /etc/logrotate.d/dnf
rm -f /etc/logrotate.d/ipmctl
install -m 0644 $UTILS_PACKAGE_DIR/ipmctl /etc/logrotate.d/ipmctl
rm -f /etc/logrotate.d/mcelog
install -m 0644 $UTILS_PACKAGE_DIR/mcelog /etc/logrotate.d/mcelog
rm -f /etc/logrotate.d/psacct
install -m 0644 $UTILS_PACKAGE_DIR/psacct /etc/logrotate.d/psacct
rm -f /etc/logrotate.d/rpm
install -m 0644 $UTILS_PACKAGE_DIR/rpm /etc/logrotate.d/rpm
rm -f /etc/logrotate.d/sssd
install -m 0644 $UTILS_PACKAGE_DIR/sssd /etc/logrotate.d/sssd
rm -f /etc/logrotate.d/usbdemd
install -m 0644 $UTILS_PACKAGE_DIR/usbdemd /etc/logrotate.d/usbdemd
rm -f /etc/logrotate.d/vnc
install -m 0644 $UTILS_PACKAGE_DIR/vnc /etc/logrotate.d/vnc
rm -f /etc/logrotate.d/wtmp
install -m 0644 $UTILS_PACKAGE_DIR/wtmp /etc/logrotate.d/wtmp

#add operation log
mv -f $UTILS_PACKAGE_DIR/operation /etc/logrotate.d/
mv -f $UTILS_PACKAGE_DIR/operation_backup /etc/logrotate.d/
mv -f $UTILS_PACKAGE_DIR/dnsmasq /etc/logrotate.d/
mv -f $UTILS_PACKAGE_DIR/operation_record.sh /opt/bin
chmod 755 /opt/bin/operation_record.sh
mkdir -p /var/log/operation
chmod 777 /var/log/operation
chattr +a /var/log/operation
mkdir -p /var/log/.operation
chmod 777 /var/log/.operation
chattr +a /var/log/.operation
echo "readonly PROMPT_COMMAND=/opt/bin/operation_record.sh" >> /etc/profile
echo "PROMPT_COMMAND=\"/opt/bin/operation_record.sh\"" >> /etc/environment

# add 2000 disk feature
is_2000G3=`dmidecode -t 1|grep "Product Name"|grep "2000 G3"`
is_raid=`mdadm -D --scan`
if [ "X$is_2000G3" != "X" -a "X$is_raid" != "X" ]; then
    isneed_fist=`cat /etc/mdadm.conf |grep "^POLICY"|grep "action=spare-same-slot"`
	if [ "X$isneed_fist" == "X" ]; then
	    echo "POLICY domain=DOMAIN path=* metadata=imsm action=spare-same-slot" >> /etc/mdadm.conf
	fi
	isneed_second=`cat /etc/mdadm.conf |grep "^MAILADDR root"`
	if [ "X$isneed_second" == "X" ]; then
	    echo "MAILADDR root" >> /etc/mdadm.conf
	fi
    /usr/sbin/partprobe /dev/md128  > /dev/null 2>&1

fi


mv -f $UTILS_PACKAGE_DIR/systemd/* /usr/lib/systemd/system
systemctl enable cas-dhcp-server.service  restore-pci-driver.service  restore-sriov.service
# for isolate cpuset and memory
systemctl daemon-reload
systemctl enable isolate-cpuset-mem.service cgconfig.service

sed -i "/nopeer/d" /etc/ntp.conf
sed -i "/# permit the source to/a\restrict -6 default kod nomodify notrap nopeer noquery" /etc/ntp.conf
sed -i "/# permit the source to/a\restrict default kod nomodify notrap nopeer noquery" /etc/ntp.conf

is_ntp_running=`/bin/systemctl status ntpd.service | grep "active (running)"`
if [ "X$is_ntp_running" != "X" ]; then
    service ntpd restart
fi

echo "*/30 * * * *   root    /opt/bin/cas_clean_log.sh" >> /etc/crontab

# add res monitor log
 mv -f $UTILS_PACKAGE_DIR/res_monitor /etc/logrotate.d/
echo "0 5,20    * * *   root    /opt/bin/res_monitor_entry.sh" >> /etc/crontab

echo "*/1 * * * *   root   hwclock -w" >> /etc/crontab

# add network info log, 202208041824
GET_NETWORK_INFO_PATH="/opt/bin/cvk_get_network_info.sh"
has_get_network_info_scirpt=$(grep -rnw "cvk_get_network_info.sh" /etc/crontab)
if [ "X$has_get_network_info_scirpt" == "X" ] && [ -x "$GET_NETWORK_INFO_PATH" ]; then
    sed -i '$a\*/5 *    * * *   root    flock -xn \/tmp\/cvk_get_network_info.sh.lock -c "\/opt\/bin\/cvk_get_network_info.sh"' /etc/crontab
fi

CLEAN_VM_SCIRPT="util_clean_vm.sh"
has_clean_vm_scirpt=$(cat /etc/crontab | grep -w $CLEAN_VM_SCIRPT)
if [ "X$has_clean_vm_scirpt" == "X" ] && [ -x "/opt/bin/$CLEAN_VM_SCIRPT" ]; then
    sed -i '$a\*/20 *    * * *   root    flock -xn \/tmp\/util_clean_vm.sh.lock -c "\/opt\/bin\/util_clean_vm.sh"' /etc/crontab
fi

if which systemctl >/dev/null;then
    #fix for 201912070264,remove useless messages log.
    mv -f $UTILS_PACKAGE_DIR/ignore-systemd-session-slice.conf /etc/rsyslog.d/
    mv -f $UTILS_PACKAGE_DIR/ignore-crond-postdrop-slice.conf /etc/rsyslog.d/
    systemctl restart rsyslog.service
fi

if [ ! -f /etc/cvk/inspection_cpufreq ]; then
    /usr/bin/python3 /opt/bin/inspection_mem_cpufreq_init.pyc
fi

#set isolate memory close as default.202211010257
#if [ -f /opt/bin/isolate_cpuset_mem.pyc ]; then
#    /usr/bin/python3 /opt/bin/isolate_cpuset_mem.pyc start > /dev/null
#fi

# add ksmtuned service, set ksm status
. /etc/ksmtuned.conf
KSM_STATUS=${KSM_STATUS:-0}
if [ "$KSM_STATUS" -eq 0 ];then
    python3 /opt/bin/util_memory_optimize.pyc -m ksm -a disable
else
    python3 /opt/bin/util_memory_optimize.pyc -m ksm -a enable
fi

install -m 755 $UTILS_PACKAGE_DIR/hotpatch/hotpatch-manage.sh /opt/bin/
install -m 755 $UTILS_PACKAGE_DIR/hotpatch/h3lnx_backup.sh /opt/bin/
install -m 755 $UTILS_PACKAGE_DIR/hotpatch/h3lnx_backup_exec.sh /opt/bin/
install -m 755 $UTILS_PACKAGE_DIR/hotpatch/upgrade-manage.sh /opt/bin/

#fix:202212121406
sed -i  '/inst_hook cleanup 99/s/^/#/' /lib/dracut/modules.d/90mdraid/module-setup.sh
sed -i  '/inst_hook shutdown 30/s/^/#/' /lib/dracut/modules.d/90mdraid/module-setup.sh

if [ -f /etc/cron.daily/logrotate ]; then
    mv /etc/cron.daily/logrotate /etc/cron.hourly/logrotate
fi

systemctl restart crond.service
