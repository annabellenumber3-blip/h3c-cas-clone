#!/bin/bash

#cvk system install package dir. not modify this dir.
SYSTEM_PACKAGE_DIR=$1
if [ "X$SYSTEM_PACKAGE_DIR" = "X" ]; then
    SYSTEM_PACKAGE_DIR=$(cd $(dirname $0) && pwd)
else
    SYSTEM_PACKAGE_DIR=$SYSTEM_PACKAGE_DIR/system.package
fi

if ! cd "$SYSTEM_PACKAGE_DIR";then
    echo "$SYSTEM_PACKAGE_DIR doesn't exist"
    exit 1
fi

. ./function_common_init.sh
kernel_version=$(get_kernel_version)
#
# What to do before installing rpm with aarch64
#
function pre_install_rpms_with_aarch64()
{
    return 0
}

#
# What to do before installing rpm with x86_64
#
function pre_install_rpms_with_x86_64()
{
    return 0
}

#
# What to do before installing rpm
#
function pre_install_rpms()
{
    systemctl disable NetworkManager
    which python > /dev/null 2>&1 || ln -sf /usr/bin/python3 /usr/bin/python
    check_function_failed_exit
    return 0
}

#
# install cvk rpms with x86_64
#
function install_rpms_in_cvk_with_x86_64()
{
    rpm -Uvfh --force --nodeps sudo-1.9.8p2-13.nos1.x86_64.rpm
    rpm -Uvfh --force --nodeps sudo-help-1.9.8p2-13.nos1.noarch.rpm

    rpm -ivfh --force Arcconf-3.02-23600.x86_64.rpm
    rpm -ivfh --force --nodeps vmtop-1.1-7.x86_64.rpm
    rpm -ivfh --force nbd-3.14-2.hl202.x86_64.rpm
    rpm -ivfh --force nvme-cli-1.16-2.hl202.x86_64.rpm
    rpm -ivfh --force intel_vgpu-1.0-3.hl202.x86_64.rpm
    rpm -ivfh --force storcli-007.2408.0000.0000-1.noarch.rpm
    rpm -Uvh --force --nodeps abrt-2.14.6-1.hl202.x86_64.rpm
    rpm -Uvh --force --nodeps libnl3-devel-3.7.0-1.hl202.x86_64.rpm
    rpm -Uvh --force --nodeps lockdev-1.0.4-0.31.hl202.x86_64.rpm
    rpm -ivfh --force sansec_card-1.0-1.hl202.x86_64.rpm

    rpm -Uvh --force --nodeps libibumad-58mlnx43-1.58203.x86_64.rpm
    rpm -Uvh --force --nodeps libibverbs-58mlnx43-1.58203.x86_64.rpm
    rpm -Uvh --force --nodeps libibverbs-utils-58mlnx43-1.58203.x86_64.rpm
    rpm -Uvh --force --nodeps librdmacm-58mlnx43-1.58203.x86_64.rpm
    rpm -Uvh --force --nodeps librdmacm-utils-58mlnx43-1.58203.x86_64.rpm
    rpm -Uvh --force --nodeps rdma-core-58mlnx43-1.58203.x86_64.rpm
    rpm -Uvh --force --nodeps vmtouch-1.3.1-3.x86_64.rpm

    rpm -Uvh --force --nodeps boost-atomic-1.78.0-15.hl202.x86_64.rpm \
                            python3-decorator-5.0.9-2.hl202.noarch.rpm \
                            boost-chrono-1.78.0-15.hl202.x86_64.rpm \
                            python3-linux-procfs-0.7.0-1.hl202.noarch.rpm \
                            boost-date-time-1.78.0-15.hl202.x86_64.rpm \
                            python3-perf-*.rpm \
                            boost-filesystem-1.78.0-15.hl202.x86_64.rpm \
                            python3-pyudev-0.24.0-1.hl202.noarch.rpm \
                            boost-system-1.78.0-15.hl202.x86_64.rpm \
                            python3-schedutils-0.6-7.hl202.x86_64.rpm \
                            boost-thread-1.78.0-15.hl202.x86_64.rpm \
                            systemtap-4.5-5.hl202.x86_64.rpm \
                            boost-timer-1.78.0-15.hl202.x86_64.rpm \
                            efivar-libs-38-1.hl202.x86_64.rpm \
                            mokutil-0.6.0-1.hl202.x86_64.rpm \
                            systemtap-client-4.5-5.hl202.x86_64.rpm \
                            dyninst-11.0.1-4.hl202.x86_64.rpm \
                            systemtap-runtime-4.5-5.hl202.x86_64.rpm \
                            hdparm-9.65-1.hl202.x86_64.rpm \
                            tbb-2020.3-5.hl202.x86_64.rpm \
                            powertop-2.13-2.hl202.x86_64.rpm \
                            tuned-2.19.0-3.hl202.noarch.rpm

    rpm -Uvh --force python3-pexpect-4.8.0-2.hl202.noarch.rpm \
                     python3-ptyprocess-0.7.0-1.hl202.noarch.rpm \
                     sos-4.0-5.hl202.noarch.rpm

    rpm -Uvh --force swtpm-libs-0.4.3-1.x86_64.rpm \
                     swtpm-0.4.3-1.x86_64.rpm \
                     swtpm-tools-0.4.3-1.x86_64.rpm
    rpm -ivfh --force cpld-notifier-1.0-1.x86_64.rpm
    rpm -ivfh --force --nodeps turbo-ucache-1.0-1.x86_64.rpm

    # required by ovn-agent on uis
    if [ -f $SYSTEM_PACKAGE_DIR/haproxy-2.6.6-1.hl202.x86_64.rpm ]; then
        rpm_not_install_dir=/opt/component/secdeps/x86_64
        mkdir -p $rpm_not_install_dir/haproxy
        # haproxy
        cp -f $SYSTEM_PACKAGE_DIR/haproxy-2.6.6-1.hl202.x86_64.rpm ${rpm_not_install_dir}/haproxy/
    fi
    return 0
}

#
# install cvk rpms with x86_64
#
function install_rpms_in_cvk_with_aarch64()
{
    rpm -Uvfh --force --nodeps sudo-1.9.8p2-13.nos1.aarch64.rpm
    rpm -Uvfh --force --nodeps sudo-help-1.9.8p2-13.nos1.noarch.rpm

    rpm -ivfh --force Arcconf-3.02-23600.aarch64.rpm
    rpm -ivfh --force --nodeps vmtop-1.1-7.aarch64.rpm
    rpm -ivfh --force nbd-3.14-2.hl202.aarch64.rpm
    rpm -ivfh --force nvme-cli-1.16-2.hl202.aarch64.rpm
    rpm -ivfh --force storcli-007.1017.0000.0000-1.aarch64.rpm
    rpm -Uvh --force --nodeps abrt-2.14.6-1.hl202.aarch64.rpm
    rpm -Uvh --force --nodeps libnl3-devel-3.7.0-1.hl202.aarch64.rpm
    rpm -Uvh --force --nodeps lockdev-1.0.4-0.31.hl202.aarch64.rpm

    rpm -Uvh --force --nodeps libibumad-58mlnx43-1.58203.aarch64.rpm
    rpm -Uvh --force --nodeps libibverbs-58mlnx43-1.58203.aarch64.rpm
    rpm -Uvh --force --nodeps libibverbs-utils-58mlnx43-1.58203.aarch64.rpm
    rpm -Uvh --force --nodeps librdmacm-58mlnx43-1.58203.aarch64.rpm
    rpm -Uvh --force --nodeps librdmacm-utils-58mlnx43-1.58203.aarch64.rpm
    rpm -Uvh --force --nodeps rdma-core-58mlnx43-1.58203.aarch64.rpm

    rpm -Uvh --force --nodeps vmtouch-1.3.1-3.aarch64.rpm

    rpm -Uvh --force --nodeps hdparm-9.65-1.hl202.aarch64.rpm \
                            python3-perf-*.rpm \
                            systemtap-client-4.5-5.hl202.aarch64.rpm \
                            powertop-2.13-2.hl202.aarch64.rpm \
                            python3-pyudev-0.24.0-1.hl202.noarch.rpm \
                            systemtap-runtime-4.5-5.hl202.aarch64.rpm \
                            python3-decorator-5.0.9-2.hl202.noarch.rpm \
                            python3-schedutils-0.6-7.hl202.aarch64.rpm \
                            tuned-2.19.0-3.hl202.noarch.rpm \
                            python3-linux-procfs-0.7.0-1.hl202.noarch.rpm \
                            systemtap-4.5-5.hl202.aarch64.rpm

    rpm -Uvh --force python3-pexpect-4.8.0-2.hl202.noarch.rpm \
                     python3-ptyprocess-0.7.0-1.hl202.noarch.rpm \
                     sos-4.0-5.hl202.noarch.rpm

    rpm -ivfh --force --nodeps turbo-ucache-1.0-1.aarch64.rpm
    # required by ovn-agent on uis
    if [ -f $SYSTEM_PACKAGE_DIR/haproxy-2.6.6-1.hl202.aarch64.rpm ]; then
        rpm_not_install_dir=/opt/component/secdeps/aarch64
        mkdir -p $rpm_not_install_dir/haproxy
        # haproxy
        cp -f $SYSTEM_PACKAGE_DIR/haproxy-2.6.6-1.hl202.aarch64.rpm ${rpm_not_install_dir}/haproxy/haproxy-2.6.6-1.hl202.aarch64.rpm
    fi
    return 0
}

#
# install cvk rpms
#
function install_rpms_in_cvk()
{
    rpm -Uvh libpq*
    check_function_failed_exit
    return 0
}

#
# install cvm rpms with aarch64
#
function install_rpms_in_cvm_with_aarch64()
{
    return 0
}

#
# install cvm rpms with x86_64
#
function install_rpms_in_cvm_with_x86_64()
{
    return 0
}

#
# install rpms cvm
#
function install_rpms_in_cvm()
{
    check_function_failed_exit
    return 0
}

#
# What to do after installing rpm with aarch64
#
function post_install_rpms_with_aarch64()
{
    return 0
}

#
# What to do after installing rpm with x86_64
#
function post_install_rpms_with_x86_64()
{
    #intel-cmt-cat-master
    cp -f ./pqos /sbin
    chmod +x /sbin/pqos

    #fix for 202104141187
    if ! grep -q '^add_drivers+="vmd.ko"' /etc/dracut.conf; then
        sed -i 's/#add_drivers+=""/add_drivers+="vmd.ko"/g' /etc/dracut.conf
    fi

    # fix 201910150130,201910160338 add usb-storage.conf (-rw-r--r--)
    USB_STORAGE_CONF="/etc/modprobe.d/usb-storage.conf"
    KEY="options usb-storage delay_use"
    VALUE=5
    if [ -f "$USB_STORAGE_CONF" ]; then
        results=$(cat "$USB_STORAGE_CONF" | grep "^$KEY")
        if [ "X$results" == "X" ]; then
            echo "$KEY=$VALUE" >> $USB_STORAGE_CONF
        else
            sed -i "s/$results/$KEY=$VALUE/g" $USB_STORAGE_CONF
        fi
    else
        echo "$KEY=$VALUE" >> $USB_STORAGE_CONF
    fi

    # add fistsms: sel log for hdm
    is_ipmi=$(ipmitool raw 0x36 0x05 0xa2 0x63 0x00 0x02 2>/dev/null | grep "[[:space:]]5a[[:space:]]")
    if [ "X$is_ipmi" != "X" ]; then
        tar -zxvf FIST_SMS-1.45.tar.gz -C /opt
        if [ -d /opt/FIST_SMS ]; then
            install -m 644 /opt/fistsms.service /usr/lib/systemd/system
            rm -rf /opt/fistsms.service
            systemctl daemon-reload
            systemctl enable fistsms.service
        fi
    fi

    return 0
}

#
# What to do after installing rpm
#
function post_install_rpms()
{
    install -m 755 /usr/Arcconf/arcconf /usr/local/sbin/arcconf
    install -m 755 /usr/Arcconf/arcconf /usr/sbin/

    if [ -d ./predict/ ]; then
        # install package for predict.
        echo "install package for predict!"
        LC_ALL=en_US.UTF-8 pip3 install ./predict/*.whl ./predict/*.tar.gz
        echo "install package for predict success!"
    fi

    if [ -f /opt/.tools/etcd3-0.12.0.tar.gz ]; then
        pip3 install /opt/.tools/etcd3-0.12.0.tar.gz
    fi

    # modify matplotlibrc's backend
    matplotlibrc_path="/usr/share/matplotlib/mpl-data/matplotlibrc"
    if [ -f "$matplotlibrc_path" ];then
        grep -q "backend\: Gtk3Agg" "$matplotlibrc_path" || sed -i "s/^backend\: .*/backend\: Gtk3Agg/g" "$matplotlibrc_path"
    fi

    if [ -d ./failure/ ]; then
        pip install ./failure/*.whl
        echo "install package for disk failure predict success!"
    fi

    # python3 wheel packages
    pip3 install python3/*.whl

    # python3 tar.gz packages
    pip3 install python3/*.tar.gz

    # appliance for guestfs used by castools
    tar -xf appliance-*.tar.xz
    if [ -d appliance ]; then
        [ ! -d /usr/local/lib/guestfs/appliance ] && mkdir -p /usr/local/lib/guestfs/appliance
        install -C appliance/* /usr/local/lib/guestfs/appliance
        rm -rf appliance
    fi

    if ! grep -q "/opt/bin/ocfs2_pool_fstrim.pyc -s onestor" /etc/crontab; then
        echo "0 22    * * 5   root    python /opt/bin/ocfs2_pool_fstrim.pyc -s onestor" >> /etc/crontab
    fi

    # add vmlinux: util for crash analyze
    tar -xf vmlinux.tar.gz
    if [ -f vmlinux ]; then
        install -CD vmlinux /usr/src/kernels/${kernel_version}/vmlinux-${kernel_version}
        rm -rf vmlinux
    fi

    check_function_failed_exit

    echo "configure kernel options"
    ./kernel_conf.sh

    echo "configure system options"
    ./system_conf.sh

    depmod -a "$kernel_version"
    dracut -f --kver "$kernel_version"

    rm -rf "$SYSTEM_PACKAGE_DIR"
    return 0
}

#
# check server is cvm
#
function is_cvm()
{
    if rpm -q --quiet cvm; then
        return 0
    fi
    return 1
}

#
# create sys-etcd.service
#
function create_sys_etcd_service() {
    if [ ! -f /etc/sys-etcd/sys-etcd.conf ]; then
        mkdir -p /etc/sys-etcd/
        touch /etc/sys-etcd/sys-etcd.conf
    fi
    cat >/etc/sys-etcd/sys-etcd.conf <<EOF
ETCD_NAME=default
ETCD_DATA_DIR="/var/lib/sys-etcd/default.etcd"
ETCD_LISTEN_CLIENT_URLS="http://0.0.0.0:3679"
ETCD_ADVERTISE_CLIENT_URLS="http://0.0.0.0:3679"
ETCD_AUTO_COMPACTION_RETENTION="72"
EOF

    if [ ! -f /var/lib/sys-etcd/sys-etcd.service ]; then
        touch /var/lib/sys-etcd/sys-etcd.service
    fi
    cat >/var/lib/sys-etcd/sys-etcd.service <<EOF
[Unit]
Description=System Etcd Server
After=network.target
After=network-online.target
Wants=network-online.target

[Service]
Type=notify
WorkingDirectory=/var/lib/sys-etcd/
EnvironmentFile=-/etc/sys-etcd/sys-etcd.conf
# set GOMAXPROCS to number of processors
ExecStart=/bin/bash -c "GOMAXPROCS=$(nproc) /var/lib/sys-etcd/bin/etcd"
Restart=always
RestartSec=5
StartLimitInterval=100
LimitNOFILE=65536

[Install]
WantedBy=multi-user.target
EOF
    if [ -f /var/lib/sys-etcd/sys-etcd.service ]; then
        install -m 755 /var/lib/sys-etcd/sys-etcd.service /usr/lib/systemd/system/sys-etcd.service
        systemctl daemon-reload
        systemctl enable sys-etcd.service
    fi
}

install_uis_party()
{
    if [ -d ./uis-party/ ]; then
        echo "###################Start to install uis system party###################"
        arch=$(uname -m)

        if [ ! -d /opt/.tools/ ]; then
            mkdir -p /opt/.tools/
        fi

        if [ "$arch" = "x86_64" ]; then
            #install rpms with x86_64.
            cd ./uis-party/
            cp busybox_nc_x86 /opt/.tools/
            chmod +x /opt/.tools/busybox_nc_x86
            cp busybox_nc_arm /opt/.tools/
            chmod +x /opt/.tools/busybox_nc_arm
            cp ncat_x86.exe /opt/.tools/
            cp ncat_arm.exe /opt/.tools/
            rpm -Uvh --force storcli-007.1506.0000.0000-1.noarch.rpm

            #install etcd to /var/lib/sys-etcd
            if [ ! -d /var/lib/sys-etcd ]; then
                mkdir -p /var/lib/sys-etcd
                mkdir -p /var/lib/sys-etcd/bin
                mkdir -p /var/lib/sys-etcd/default.etcd
            fi
            if [ -f ./etcd ]; then
                cp etcd /var/lib/sys-etcd/bin
                chmod 755 /var/lib/sys-etcd/bin/etcd
            fi
            if [ -f ./etcdctl ]; then
                cp etcdctl /var/lib/sys-etcd/bin
                chmod 755 /var/lib/sys-etcd/bin/etcdctl
            fi
            if [ -f ./etcdutl ]; then
                cp etcdutl /var/lib/sys-etcd/bin
                chmod 755 /var/lib/sys-etcd/bin/etcdutl
            fi
            create_sys_etcd_service

            cp netifaces-0.11.0-cp39-cp39-manylinux_2_5_x86_64.manylinux1_x86_64.whl /opt/.tools/
            pip3 install /opt/.tools/netifaces-0.11.0-cp39-cp39-manylinux_2_5_x86_64.manylinux1_x86_64.whl
            cp grpcio-1.62.2-cp39-cp39-manylinux_2_17_x86_64.manylinux2014_x86_64.whl /opt/.tools/
            pip3 install /opt/.tools/grpcio-1.62.2-cp39-cp39-manylinux_2_17_x86_64.manylinux2014_x86_64.whl
            cp protobuf-3.20.0-cp39-cp39-manylinux_2_5_x86_64.manylinux1_x86_64.whl /opt/.tools/
            pip3 install /opt/.tools/protobuf-3.20.0-cp39-cp39-manylinux_2_5_x86_64.manylinux1_x86_64.whl
            cp etcd3-0.12.0.tar.gz /opt/.tools/

            rpm -Uvh --force storcli-007.2408.0000.0000-1.noarch.rpm
            #rpm -Uvh --force nvme-cli-1.8.1-3.el7.x86_64.rpm

            rpm -Uvh --force ssacli-3.40-3.0.x86_64.rpm
            rpm -Uvh --force ssaducli-3.40-3.0.x86_64.rpm
            rpm -ivh --force pySMART-1.0-1.noarch.rpm
            rpm -ivh --force ledmon-0.95-6.x86_64.rpm --replacefiles --replacepkgs
            rpm -ivh --force --nodeps nvme-snsd-1.00.029-linux.x86_64.rpm
            rpm -ivfh --force cpld-notifier-1.0-1.x86_64.rpm

            # sdn haproxy, libreswan
            rpm -ivh --force ldns*.rpm libreswan-4.5*.rpm libreswan-help*.rpm
            local rpm_not_install_dir=/opt/component/secdeps/x86_64
            mkdir -p $rpm_not_install_dir/haproxy
            cp -f ./haproxy-2.6.6-1.hl202.x86_64.rpm ${rpm_not_install_dir}/haproxy/
            if [ -f asan.conf ]; then
                rpm -ivh --force --nodeps libasan*.rpm  # libasan-10.3.1-20.hl202.x86_64.rpm
            fi
            cd -

            # install python3 compile module dependency
            cp -rf ./uis-party/compile-1.0.3.tar.gz /opt/.tools/
            pip3 install /opt/.tools/compile-1.0.3.tar.gz

            #install python3 pexpect module.
            pip3 install ./uis-party/ptyprocess-0.7.0-py2.py3-none-any.whl
            pip3 install ./uis-party/pexpect-4.8.0-py2.py3-none-any.whl

        elif [ "$arch" = "aarch64" ]; then
            #install rpms with aarch64.
            rpm -Uvh --force Arcconf-3.02-23600.aarch64.rpm
            cd ./uis-party/
            cp busybox_nc_x86 /opt/.tools/
            chmod +x /opt/.tools/busybox_nc_x86
            cp busybox_nc_arm /opt/.tools/
            chmod +x /opt/.tools/busybox_nc_arm
            cp ncat_x86.exe /opt/.tools/
            cp ncat_arm.exe /opt/.tools/

            #install etcd to /var/lib/sys-etcd
            if [ ! -d /var/lib/sys-etcd ]; then
                mkdir -p /var/lib/sys-etcd
                mkdir -p /var/lib/sys-etcd/bin
                mkdir -p /var/lib/sys-etcd/default.etcd
            fi
            if [ -f ./etcd ]; then
                cp etcd /var/lib/sys-etcd/bin
                chmod 755 /var/lib/sys-etcd/bin/etcd
            fi
            if [ -f ./etcdctl ]; then
                cp etcdctl /var/lib/sys-etcd/bin
                chmod 755 /var/lib/sys-etcd/bin/etcdctl
            fi
            if [ -f ./etcdutl ]; then
                cp etcdutl /var/lib/sys-etcd/bin
                chmod 755 /var/lib/sys-etcd/bin/etcdutl
            fi
            create_sys_etcd_service

            cp netifaces-0.11.0-cp39-cp39-linux_aarch64.whl /opt/.tools/
            pip3 install /opt/.tools/netifaces-0.11.0-cp39-cp39-linux_aarch64.whl
            cp grpcio-1.62.2-cp39-cp39-manylinux_2_17_aarch64.whl /opt/.tools/
            pip3 install /opt/.tools/grpcio-1.62.2-cp39-cp39-manylinux_2_17_aarch64.whl
            cp protobuf-3.20.0-cp39-cp39-manylinux2014_aarch64.whl /opt/.tools/
            pip3 install /opt/.tools/protobuf-3.20.0-cp39-cp39-manylinux2014_aarch64.whl
            cp etcd3-0.12.0.tar.gz /opt/.tools/

            rpm -Uvh storcli-*.rpm
            #rpm -Uvh --force nvme-cli-1.8.1-3.el8.aarch64.rpm
            rpm -Uvh --force pySMART-1.0-1.noarch.rpm
            rpm -ivh libcgroup-0.41-20.el7.aarch64.rpm
            rpm -ivh libcgroup-devel-0.41-20.el7.aarch64.rpm
            rpm -ivh libcgroup-devel-0.41-20.el7.aarch64.rpm
            rpm -ivh libcgroup-pam-0.41-20.el7.aarch64.rpm
            rpm -ivh libcgroup-tools-0.41-20.el7.aarch64.rpm
            rpm -ivh cgdcbxd-1.0.2-7.el7.aarch64.rpm
            rpm -ivh --force --nodeps nvme-snsd-1.00.029-linux.aarch64.rpm
            # sdn haproxy, libreswan
            rpm -ivh --force ldns*.rpm libreswan-4.5*.rpm libreswan-help*.rpm
            local rpm_not_install_dir=/opt/component/secdeps/aarch64
            mkdir -p $rpm_not_install_dir/haproxy
            cp -f ./haproxy-2.6.6-1.hl202.aarch64.rpm ${rpm_not_install_dir}/haproxy/
            if [ -f asan.conf ]; then
                rpm -ivh --force --nodeps libasan*.rpm  # libasan-10.3.1-20.hl202.aarch64.rpm
            fi
            cd -
            #if [ -f uis.cfg ]; then
            #    rpm -Uvh --force Arcconf-3.02-23600.aarch64.rpm
            #    rpm -Uvh --force storcli-007.1017.0000.0000-1.aarch64.rpm
            #fi
            #install python lib
            # idms:202103190889
            ret_code=`python -c "import pexpect" >/dev/null 2>&1; echo $?`
            if [ $ret_code -ne 0 ]; then
                ptyprocess_package=`ls ./uis-party/ | grep "ptyprocess"`
                if [ "X$ptyprocess_package" != "X" ]; then
                    ptyprocess_dir=`echo $ptyprocess_package | awk -F '.tar.gz' '{print $1}'`
                    cd ./uis-party/
                    tar zxvf $ptyprocess_package >/dev/null 2>&1
                    cd ./$ptyprocess_dir/
                    python setup.py install >/dev/null 2>&1
                    cd ../../
                fi

                pexpect_package=`ls ./uis-party/ | grep "pexpect"`
                if [ "X$pexpect_package" != "X" ]; then
                    pexpect_dir=`echo $pexpect_package | awk -F '.tar.gz' '{print $1}'`
                    cd ./uis-party/
                    tar zxvf $pexpect_package >/dev/null 2>&1
                    cd ./$pexpect_dir/
                    python setup.py install >/dev/null 2>&1
                    cd ../../
                fi

                rm -rf ./uis-party/$ptyprocess_dir
                rm -rf ./uis-party/$pexpect_dir
                ret_code=`python -c "import pexpect" >/dev/null 2>&1; echo $?`
                if [ $ret_code -eq 0 ]; then
                    echo "installing pexpect packages successfully."
                else
                    echo "fail to install pexpect packages."
                fi
            fi

        fi

        cp -f ./conf/change_osdlog_outputorder.sh /opt/.tools/
        cp -f ./conf/change_dem.sh /opt/.tools/
        cp -f ./conf/devmgr_check_dev_type /opt/.tools/
        cp -f ./fail2ban.tar.gz /opt/.tools/
        sed -i 's/minlen=12/minlen=8/g' /etc/pam.d/system-auth
        sed -i '/password    required     pam_pwhistory.so enforce_for_root remember=5/d' /etc/pam.d/system-auth

        if [ -d ./uis-party/failure/ ]; then
            pip install ./uis-party/failure/*.whl
            echo "install package for disk failure predict success!"
        fi

        if [ -d ./uis-party/onestor-preinstall-rpms/ ]; then
            rpm -ivh --force --nodeps ./uis-party/onestor-preinstall-rpms/*.rpm
            echo "onestor preinstall rpms install success!"
        fi

        echo "###################End to install uis system party###################"
    fi
}

function main()
{
    # step 1
    pre_install_rpms
    if is_cvm; then
        # step 2
        install_rpms_in_cvm
    fi
    # step 3
    install_rpms_in_cvk
    # step 4
    install_uis_party
    # step 5
    post_install_rpms
    return 0
}

main
