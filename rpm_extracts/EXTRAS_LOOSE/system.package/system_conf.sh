##############################################################################
#    Func Name: install.sh
# Date Created: 2013-12-20
#       Author: gaoliang
#  Description: install cvk system;
#        usage: 1. $0 [$1]
#               $1: install package dir
#       Output:
#       Return: 0  : success
#-----------------------------------------------------------------------------
#  Modification History
#  DATE        NAME             DESCRIPTION
##############################################################################

#idms 202111251313
if [ -f /etc/motd ]; then
    rm -f /etc/motd
fi
# idms: 202205130260
if [ ! -f /etc/motd ] || [[ $(cat /etc/motd | grep -v "WARNING") ]]; then
cat > /etc/motd <<EOF
###################################################################
#                          WARNING                                #
#  You are using background management system, which is only      #
#  used by engineers for development and debugging. Please stri-  #
#  ctly follow product documents or under the guidance of         #
#  engineers. The consequences caused by unauthorized operation   #
#  will be borne by yourself.                                     #
#                                                                 #
###################################################################

EOF
fi
cp ./conf/mcelog /etc/logrotate.d/
cp ./conf/bashrc /root/.bashrc
cp ./conf/inputrc /root/.inputrc
cp ./conf/bashrc.command /etc/bashrc.command
mkdir -p /opt/bin/
install -m 755 ./conf/command_config /opt/bin/

install -m 755 ./conf/os_lsb_release /opt/bin/

if [ -f /opt/bin/os_lsb_release ]; then
    sed -i "s/\/etc\/openEuler-release/\/etc\/NingOS-release/g" /usr/bin/lsb_release
fi

# install lspci to /usr/sbin
if [ -f "/usr/bin/lspci" ]; then
    install -m 755 /usr/bin/lspci /usr/sbin/lspci
fi

if [ -f conf/setdhcp.sh ]; then
    install -m 755 conf/setdhcp.sh /opt/bin
fi

# fixed pam_env error
for password_auth_file in /etc/pam.d/password-auth /etc/pam.d/system-auth; do
    if [ -f ${password_auth_file} ]; then
        sed '/^auth[[:space:]]*required[[:space:]]*pam_env.so$/d' ${password_auth_file} > ${password_auth_file}.bak
        sed -i '/User changes will be destroyed/a auth        required      pam_env.so' ${password_auth_file}.bak
        if [ $? -ne 0 ]; then
            echo "modify ${password_auth_file}'s pam_env.so failed."
        else
            mv -f ${password_auth_file}.bak ${password_auth_file}
        fi
    fi
done

# fixed nvme of error
if [ -d /etc/nvme ]; then
    rm -f /etc/nvme/hostnqn
    rm -f /etc/nvme/hostid

    install -D /dev/null /etc/nvme/hostnqn
    echo $(nvme gen-hostnqn) > /etc/nvme/hostnqn
    uuidgen > /etc/nvme/hostid

    chmod 644 /etc/nvme/hostnqn
    chmod 644 /etc/nvme/hostid
fi

if ! grep -q "^PermitRootLogin yes" /etc/ssh/sshd_config; then
    cat >>/etc/ssh/sshd_config <<EOF

# CAS need configuration
PermitRootLogin yes
MaxStartups 100:30:200
UseDNS no
EOF
    sed -i 's/^GSSAPIAuthentication yes/GSSAPIAuthentication no/' /etc/ssh/sshd_config
else
    sed -i '/^MaxStartups/I d' /etc/ssh/sshd_config
    echo 'MaxStartups 100:30:200' >> /etc/ssh/sshd_config
    systemctl reload sshd.service
fi

# fix 202409180390 ban diffie-hellman kexalgorithms in sshd_config
kexalgorithms_parameter="kexalgorithms curve25519-sha256,curve25519-sha256@libssh.org,ecdh-sha2-nistp256,ecdh-sha2-nistp384,ecdh-sha2-nistp521"
if ! grep -q "$kexalgorithms_parameter" /etc/ssh/sshd_config; then
    echo "$kexalgorithms_parameter" >> /etc/ssh/sshd_config
    systemctl reload sshd.service
fi


# Java will call ssh to CVKA from CVKB. the default StrictHostKeyChecking option will block java
if ! grep -q "^[[:space:]]StrictHostKeyChecking no" /etc/ssh/ssh_config; then
cat >>/etc/ssh/ssh_config <<EOF
    StrictHostKeyChecking no
EOF
fi

if ! grep -q "^SELINUX=disabled"  /etc/selinux/config; then
    sed -i "s/^SELINUX=.*/SELINUX=disabled/g" /etc/selinux/config
fi

#close some warn log for ifdown and ifup
#idms:202211281518
if [ -f /etc/sysconfig/network ]; then
    if ! grep -q "^export DEPRECATION_WARNING_ISSUED=" /etc/sysconfig/network; then
        echo "export DEPRECATION_WARNING_ISSUED=true" >> /etc/sysconfig/network
    else
        sed -i "s/\(DEPRECATION_WARNING_ISSUED=\).*/\1true/" /etc/sysconfig/network
    fi
fi

#disable NetworkManager
tmp_enabled=$(systemctl is-enabled NetworkManager.service)
if [ "$tmp_enabled" = "enabled" ];then
    systemctl disable NetworkManager.service
fi

if ! grep -q "^DefaultLimitNOFILE=32768" /etc/systemd/system.conf; then
    sed -i 's/#DefaultLimitNOFILE.*/DefaultLimitNOFILE=32768/' /etc/systemd/system.conf
fi

#fix 201912250323
if grep -q "^MAILTO=" /etc/crontab; then
    sed -i "/^MAILTO=*/cMAILTO=\"\"" /etc/crontab
fi
# add udev rules to rename zero-mac net
mkdir -p /lib/udev/
mkdir -p /etc/udev/rules.d/
install -m 644 conf/70-custom-net.rules /etc/udev/rules.d/
install -m 644 conf/99-dm-device-conf-update.rules /etc/udev/rules.d/
install -m 755 conf/zero_mac_net_rename /lib/udev/
install -m 755 conf/conflict_net_rename /lib/udev/
install -m 755 conf/ifup-local /usr/sbin/
install -m 755 conf/ifup-eth /etc/sysconfig/network-scripts/
install -m 755 conf/ifdown-eth /etc/sysconfig/network-scripts/
install -m 755 conf/network /etc/init.d/

# add cas profile
install -m 755 conf/profile /etc/profile

if [ -d ./uis-party/ ]; then
    sed -i ':a;N;$!ba;s/027/022/2' /etc/profile
    sed -i 's/027/002/g' /etc/profile
fi

# add abrt default config
install -m 755 conf/abrt/abrt.conf /etc/abrt/
install -m 755 conf/abrt/abrt-action-save-package-data.conf /etc/abrt/
install -m 755 conf/abrt/gpg_keys.conf /etc/abrt/
install -m 755 conf/abrt/CCpp.conf /etc/abrt/plugins/
install -m 755 conf/abrt/oops.conf /etc/abrt/plugins/
install -m 755 conf/abrt/python3.conf /etc/abrt/plugins/
install -m 755 conf/abrt/vmcore.conf /etc/abrt/plugins/
install -m 755 conf/abrt/xorg.conf /etc/abrt/plugins/
install -m 755 conf/abrt/ccpp_event.conf /etc/libreport/events.d/

# fix idms202307130165
systemd_conf_path="/etc/systemd/coredump.conf.d/"
if [ ! -f ${systemd_conf_path}/coredump.conf ]; then
    [ ! -d "${systemd_conf_path}" ] && mkdir -p ${systemd_conf_path}
    cp -f /etc/systemd/coredump.conf ${systemd_conf_path}
    sed -i 's/#ProcessSizeMax=.*/ProcessSizeMax=24G/' ${systemd_conf_path}/coredump.conf
    systemctl daemon-reload
fi

systemctl enable abrtd.service
systemctl restart abrtd.service
systemctl enable abrt-journal-core.service
systemctl restart abrt-journal-core.service

# 201705050259: after remove vstore and set /opt/bin to /etc/environment at system
if [ -f /etc/environment ] && ! grep -q "^PATH=.*/opt/bin" /etc/environment; then
cat >>/etc/environment <<EOF
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/opt/bin
EOF
fi
systemctl enable lldpad.service
# 202112160774:Modify the systemd log level to info
if [ -f /etc/environment ] && ! grep -q "^SYSTEMD_LOG_LEVEL=.*" /etc/environment; then
cat >>/etc/environment <<EOF
SYSTEMD_LOG_LEVEL=info
EOF
fi

rasdaemonfile="/usr/lib/systemd/system/rasdaemon.service"
if [ -f "$rasdaemonfile" ]; then
    # fixed diskerror in euler
    install -m 755 ./conf/rasdaemon.service "$rasdaemonfile"
    systemctl daemon-reload
fi
systemctl enable ras-mc-ctl.service
systemctl enable rasdaemon.service
systemctl start ras-mc-ctl.service
systemctl restart rasdaemon.service
# idms:202212140396
systemctl enable loadmodules.service

#fix:202401290211
#Set the maximum scheduling time of the CPU to be consistent with C1E mode to ensure CPU performance
if ! grep -q "^force_latency" /usr/lib/tuned/throughput-performance/tuned.conf; then
    line=$(grep -n "^\[cpu\]" /usr/lib/tuned/throughput-performance/tuned.conf | cut -d ":" -f1)
    sed -i "${line}a\\force_latency=10" /usr/lib/tuned/throughput-performance/tuned.conf
fi
#fix:202401290211 end

if ! grep -q "^runtime" /usr/lib/tuned/throughput-performance/tuned.conf; then
    line=$(grep -n "^\[scheduler\]" /usr/lib/tuned/throughput-performance/tuned.conf | cut -d ":" -f1)
    sed -i "${line}a\\runtime=0" /usr/lib/tuned/throughput-performance/tuned.conf
fi

/usr/sbin/tuned-adm profile throughput-performance

if [ ! -f /opt/bin/virt-rc-local ]; then
    install -m 755 ./conf/virt-rc-local /opt/bin/
    install -m 644 ./conf/virt-rc-local.service /usr/lib/systemd/system/
    systemctl enable virt-rc-local.service
else
    cp -f /opt/bin/virt-rc-local /opt/bin/virt-rc-local.bak
    install -m 755 ./conf/virt-rc-local /opt/bin/
fi

if [ ! -f /opt/bin/first_boot.sh ]; then
    install -m 755 ./conf/first_boot.sh /opt/bin/
    install -m 644 ./conf/first_boot.service /usr/lib/systemd/system/
    systemctl enable first_boot.service
else
    cp -f /opt/bin/first_boot.sh /opt/bin/first_boot.sh.bak
    install -m 755 ./conf/first_boot.sh /opt/bin/
fi

install -m 755 ./conf/nbd.modules /etc/sysconfig/modules/
install -m 755 ./conf/hifc.modules /etc/sysconfig/modules/

# load mlx4_en and mlx4_ib on boot, idms: 202003101108
install -m 755 ./conf/mlx4.modules /etc/sysconfig/modules/

systemctl disable postfix.service
# These two are not installed on arm, just suppress the error message
systemctl disable smartd.service 2>/dev/null
systemctl disable libstoragemgmt.service 2>/dev/null
systemctl disable gssproxy.service

need_reload_sysctl=0

# disable ctrl-alt-del shutdown host
systemctl disable ctrl-alt-del.target
systemctl mask ctrl-alt-del.target

# close firewalld
systemctl disable firewalld.service
systemctl stop firewalld.service
systemctl mask firewalld.service

#disable some service in euler
service_to_disable=(atd.service chronyd.service mdmonitor.service restorecond.service rngd.service dnf-makecache.timer)
for i in ${service_to_disable[@]};do
    systemctl disable $i 2>/dev/null
    systemctl stop $i 2>/dev/null
done



#disable numa balancing. 201807250350
if ! grep -q "^[[:space:]]*kernel.numa_balancing"  /etc/sysctl.conf; then
    echo "kernel.numa_balancing = 0" >> /etc/sysctl.conf
    ((need_reload_sysctl=need_reload_sysctl+1))
fi

#201908030337 Server hardening security, by luofangli
grep -q "^[[:space:]]*net.ipv4.conf.all.accept_redirects = 0" /etc/sysctl.conf
if [ $? -ne 0 ]; then
    echo "net.ipv4.conf.all.accept_redirects = 0" >>/etc/sysctl.conf
    ((need_reload_sysctl=need_reload_sysctl+1))
fi

#202406271611, by wangjian
grep -q "^[[:space:]]*net.ipv4.neigh.default.gc_thresh" /etc/sysctl.conf
if [ $? -ne 0 ]; then
    echo "net.ipv4.neigh.default.gc_thresh1 = 1024" >>/etc/sysctl.conf
    echo "net.ipv4.neigh.default.gc_thresh2 = 4096" >>/etc/sysctl.conf
    echo "net.ipv4.neigh.default.gc_thresh3 = 8192" >>/etc/sysctl.conf
    ((need_reload_sysctl=need_reload_sysctl+1))
fi
grep -q "^[[:space:]]*net.ipv6.neigh.default.gc_thresh" /etc/sysctl.conf
if [ $? -ne 0 ]; then
    echo "net.ipv6.neigh.default.gc_thresh1 = 1024" >>/etc/sysctl.conf
    echo "net.ipv6.neigh.default.gc_thresh2 = 4096" >>/etc/sysctl.conf
    echo "net.ipv6.neigh.default.gc_thresh3 = 8192" >>/etc/sysctl.conf
    ((need_reload_sysctl=need_reload_sysctl+1))
fi

#202101200387, by fanchangsong
grep -q "^[[:space:]]*kernel.core_uses_pid" /etc/sysctl.conf
if [ $? -ne 0 ]; then
    echo "kernel.core_uses_pid = 1" >> /etc/sysctl.conf
    ((need_reload_sysctl=need_reload_sysctl+1))
fi

grep -q "^[[:space:]]*fs.aio-max-nr" /etc/sysctl.conf
if [ $? -ne 0 ]; then
    echo "fs.aio-max-nr = 1048576" >> /etc/sysctl.conf
    ((need_reload_sysctl=need_reload_sysctl+1))
fi

grep -q "^[[:space:]]*kernel.panic_on_oops" /etc/sysctl.conf
if [ $? -ne 0 ]; then
    echo "kernel.panic_on_oops = 1" >> /etc/sysctl.conf
    ((need_reload_sysctl=need_reload_sysctl+1))
fi

grep -q "^[[:space:]]*kernel.sysrq" /etc/sysctl.conf
if [ $? -ne 0 ]; then
    echo "kernel.sysrq = 1" >> /etc/sysctl.conf
    ((need_reload_sysctl=need_reload_sysctl+1))
fi

if [ ${need_reload_sysctl} -ne 0 ]; then
    sysctl -p
fi

#increase net.core.somaxconn to 2048, idms: 202102020564
if ! grep -q "net.core.somaxconn" /etc/sysctl.conf; then
    echo "net.core.somaxconn = 2048" >> /etc/sysctl.conf
    sysctl -p
fi

#fix for 202105130741 by c24955,add reserved port for vm migration
PORT_MAX=49216
PORT_MIN=49152
begin=0
item="net.ipv4.ip_local_reserved_ports="

if ! grep -q "^[[:space:]]*net.ipv4.ip_local_reserved_ports" /etc/sysctl.conf; then
    echo "net.ipv4.ip_local_reserved_ports=$PORT_MIN-$PORT_MAX" >> /etc/sysctl.conf
    sysctl -p
else
    for((i=$PORT_MIN;i<=$PORT_MAX;i++)) do
        bucket[$i]=1
    done

    suffix=`cat /etc/sysctl.conf | grep  -v '^[[:space:]]*#' | grep -i net.ipv4.ip_local_reserved_ports | head -1`
    value=`echo ${suffix} | awk -F '[=]' '{print $2}'`
    OLD_IFS="$IFS"
    IFS=","
    array=($value)
    IFS="$OLD_IFS"

    for i in ${array[@]}; do
        if [[ $i =~ "-" ]]; then
            start=`echo $i | awk -F '[-]' '{print $1}'` end=`echo $i | awk -F '[-]' '{print $2}'`
            if [[ $start > $end ]]; then
                tmp=$start start=$end end=$tmp
            fi
            for ((j=$start;j<=$end;j++)) do
               bucket[$j]=1
            done
        else
            bucket[$i]=1
        fi
    done

    for ((i=0;i<65536;i++)) do
        if [[ ${bucket[$i]} && ! ${bucket[$i+1]} ]]; then
            if [[ $begin -eq 0 ]]; then
                item=${item}','$i
            elif [[ $begin -eq 1 ]]; then
                begin=0 item=${item}'-'$i
            fi
        elif [[ ${bucket[$i]} && ${bucket[$i+1]} ]]; then
            if [[ $begin -eq 0 ]]; then
                begin=1 item=${item}','$i
            fi
        fi
    done

    item=`echo $item | sed "s/=,/=/"`
    sed -i "s/${suffix}/${item}/" /etc/sysctl.conf
    sysctl -p
fi

#add for 201805080780 by y16630
install -m 755 ./conf/check_net_rules.sh /opt/bin/

#fix for 202006300941,change kernel crash dump file generate directory from '/var/crash' to '/vms/crash'
if ! grep -q "^path /vms/crash" /etc/kdump.conf; then
    sed -i "s/path \/var\/crash/path \/vms\/crash/g" /etc/kdump.conf
fi

# fix for 202202090985,[2013] [H3C CAS V700R002B10D001 E0730] [ARM] Version KUNpeng 730, the crash of the SERVER with FC card may not take effect.
if grep -q "[#]*dracut_args --omit-drivers" /etc/kdump.conf; then
    gen_args="dracut_args \
--omit-drivers \"cfg80211 snd lpfc qla2xxx openvswitch bnx2fc \
bnx2i bnx2 bnx2x mlx4_ib mlx4_core mlx5_ib mlx5_core mlxfw ib_core \
flashcache bfa fcoe hifc hifc_sdk hinic qed qede ixgbe ice i40e \
fm10k igbvf e1000 i40evf e1000e ixgbevf\" \
--add-drivers \"ext2 ext3\" \
--omit \"ramdisk network ifcfg\" \
--nofscks"
    sed -i "s/[#]*dracut_args --omit-drivers.*/$gen_args/g" /etc/kdump.conf
fi

# kexec -p remove some cmdline
if grep -q "^KDUMP_COMMANDLINE_REMOVE=" /etc/sysconfig/kdump; then
    gen_args="KDUMP_COMMANDLINE_REMOVE=\"hugepages hugepagesz slub_debug \
transparent_hugepage quiet video biosdevname net.ifnames\""
    sed -i "s/^KDUMP_COMMANDLINE_REMOVE=.*/$gen_args/g" /etc/sysconfig/kdump
fi

# kexec -p append some cmdline
if grep -q "^KDUMP_COMMANDLINE_APPEND=" /etc/sysconfig/kdump; then
    gen_args="KDUMP_COMMANDLINE_APPEND=\"irqpoll nr_cpus=1 reset_devices cgroup_disable=memory \
udev.children-max=2 panic=10 acpi_no_memhotplug nokaslr swiotlb=noforce novmcoredd numa=off \
mce=off numa=off idle=poll pcie_aspm=off cma=0 transparent_hugepage=never hest_disable \
rd.timeout=120 rd.emergency=reboot usbcore.nousb\""
    sed -i "s/^KDUMP_COMMANDLINE_APPEND=.*/$gen_args/g" /etc/sysconfig/kdump
fi

#remove all default repos for we do not install packages from them
if [ $(ls /etc/yum.repos.d/ | wc -l) -gt 0 ]; then
    rm -f /etc/yum.repos.d/*
fi

if [ -f /etc/pam.d/system-auth ]; then
    grep "^[[:space:]]*password.*pam_unix.so.*remember" /etc/pam.d/system-auth
    if [ $? -ne 0 ]; then
        cat /etc/pam.d/system-auth |
        sed "s/^[[:space:]]*password.*pam_unix.so.*$/& remember=5/g" > /etc/pam.d/system-auth_bak
        mv -f /etc/pam.d/system-auth_bak /etc/pam.d/system-auth
    fi
fi
grep -v "^[[:space:]]*#" /etc/pam.d/su | grep -qE  "\s*auth.*required.*pam_wheel.so( use_uid)*$"
if [ $? -ne 0 ]; then
    cat /etc/pam.d/su |
    sed -r "s/#[ ]*(auth.*required.*pam_wheel.so( use_uid)*)$/\1/g;
            s/#[ ]*(auth.*pam_rootok.so)$/\1/g;" >/etc/pam.d/su_bak
    mv -f /etc/pam.d/su_bak /etc/pam.d/su
fi
ssh_banner=`cat /etc/ssh/sshd_config | grep -v '^[[:space:]]*#' | grep -i Banner | awk '{print $2}'`
if [ X"$ssh_banner" = X ]; then
    echo "Authorized users only. All activity may be monitored and reported" >/etc/sshbanner
    sed -i '/#Banner /aBanner /etc/sshbanner' /etc/ssh/sshd_config
    service sshd reload
fi
mkdir -p /root/.ssh

chmod go-rwx /etc/shadow
chmod 600 /etc/security
#fix:202107280824
#Enforcing Stronger Passwords
PAM_CONF="/etc/security/pwquality.conf"
pam_key_value="minlen 8
lcredit -1
ucredit -1
dcredit -1
ocredit -1"
if [ -f $PAM_CONF ]; then
    while read KEY VALUE; do
        results=`cat $PAM_CONF | grep "^[[:space:]]*$KEY"`
        if [ "X$results" == "X" ]; then
            echo "$KEY = $VALUE" >> $PAM_CONF
        else
            sed -i "s/$results/$KEY = $VALUE/g" $PAM_CONF
        fi

    done < <(echo "$pam_key_value")
fi

#fix 202407162309 modify file of NingOS-release-V3_1.0.2311-0.nos1.x86_64
if [ -f /etc/profile.d/system-info.sh ]; then
    sed -i '/.*lastb.*/ { /sudo lastb/!s/lastb/sudo lastb/ }' /etc/profile.d/system-info.sh
fi

if [ -f /etc/security/limits.conf ]; then
    is_exist=$(grep "* soft memlock unlimited" /etc/security/limits.conf)
    if [ "X$is_exist" = "X" ]; then
        echo "* soft memlock unlimited" >> /etc/security/limits.conf
        echo "* hard memlock unlimited" >> /etc/security/limits.conf
        echo "Add max lock memory up to unlimited."
    fi
fi

# create new user 'sysadmin' if not
/opt/bin/util_cvk_user_manage.sh add sysadmin
ret=$?
if [ $? -eq 0 ]; then
    echo "user 'sysadmin' created successfully"
else
    echo "user 'sysadmin' created failed, there may be user (error: $ret)"
fi

#uis add onestor user
/opt/bin/forbidroot_login_sds.sh
echo "creat onestor user, return code: $?"

# sysadmin ssh key, for upgrade
if [ ! -f ~sysadmin/.ssh/id_rsa ] && [ -f /root/.ssh/id_rsa ]; then
    mkdir -p ~sysadmin/.ssh
    cp -f /root/.ssh/id_rsa* ~sysadmin/.ssh/
    cp -f /root/.ssh/authorized_keys ~sysadmin/.ssh/
    chown -R sysadmin:root ~sysadmin/.ssh
fi

# When CVK is under CVM's control, disable sysadmin ssh access if it's not in use
if [ -f /etc/cvk/cvm_info.conf ]; then
    source /etc/cvk/user_info.conf 2>/dev/null
    if [ "$permit_user_ssh" != "sysadmin" ]; then
        echo "sysadmin is not in use, disable ssh access."
        /opt/bin/util_cvk_user_manage.sh ssh sysadmin disable
    fi
fi

# nvmf driver auto load
install -m 0644 ./conf/91-nvmf.rules /etc/udev/rules.d/

# config file used for cvk-agent
mkdir -p /etc/cvk/cvk-agent
cp -f ./conf/pk1.dat /etc/cvk/cvk-agent/pk1.dat
cp -f ./conf/pk2.dat /etc/cvk/cvk-agent/pk2.dat
# backup cvk-agent.db periodically
if [ -f /etc/crontab ]; then
    grep -q "cp /var/lib/cvk-agent/cvk-agent.db" /etc/crontab
    if [ $? -ne 0 ]; then
        echo '0 1    * * *   root    mkdir -p /var/lib/cvk-agent/backup && cp /var/lib/cvk-agent/cvk-agent.db /var/lib/cvk-agent/backup/cvk-agent.db+`date +\%Y-\%m-\%d_\%T`' >> /etc/crontab
    fi
    grep -q "find /var/lib/cvk-agent/backup" /etc/crontab
    if [ $? -ne 0 ]; then
        echo '5 1    * * *   root    find /var/lib/cvk-agent/backup/ -name "cvk-agent.db*" -mtime +7 -exec rm -f {} \;' >> /etc/crontab
    fi
    systemctl restart crond
fi

#sudoers add /opt/bin/
sudoers_path=`grep " secure_path" /etc/sudoers`
sudoers_path_opt=`echo $sudoers_path | grep ":/opt/bin"`
if [ "X$sudoers_path" != "X" ] && [ "X$sudoers_path_opt" = "X" ]; then
    sed -i '/secure_path/ s/$/:\/opt\/bin/' /etc/sudoers
fi

#fix 202403120047
TMP_CONF_PATH=/usr/lib/tmpfiles.d/tmp.conf
need_restart=false
if [ -f ${TMP_CONF_PATH} ]; then
    if ! grep -q "^[[:space:]]*x[[:space:]]*/tmp/hsperfdata_root" ${TMP_CONF_PATH}; then
        echo "x /tmp/hsperfdata_root" >> ${TMP_CONF_PATH}
        need_restart=true
    fi
    if ! grep -q "^[[:space:]]*X[[:space:]]*/tmp/.java\*" ${TMP_CONF_PATH}; then
        echo "X /tmp/.java*" >> ${TMP_CONF_PATH}
        need_restart=true
    fi
    if [ ${need_restart} != false ];then
        systemctl stop systemd-tmpfiles-clean
        systemctl start systemd-tmpfiles-clean
    fi
fi

#cp pci.ids file to hwdata folder
cp -f /usr/share/hwdata/pci.ids /usr/share/hwdata/pci.ids.bak
cp -f ./conf/pci.ids /usr/share/hwdata
