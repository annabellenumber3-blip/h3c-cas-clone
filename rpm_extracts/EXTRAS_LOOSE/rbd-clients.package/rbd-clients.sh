#!/bin/bash

cd $(dirname $0)
INSTALL_DIR="/vms/.ms_backup/rbd-client"
RBD_VENDOR_CONF="/etc/cvk/rbd_vendor.conf"
LOG_DIR="/var/log/caslog/"
if [ ! -d ${LOG_DIR} ];then
    mkdir -p ${LOG_DIR}
fi
LOG="${LOG_DIR}rbd-clients.log"
DEFAULT_VERSION="V1.0"
DEFAULT_CLIENT="opensrc"
RBDAGENT_DIRS="/usr/lib /usr/lib64"
EXIT_SUCESS=0
EXIT_NONEED_UPGRADE=0
EXIT_NEED_UPGRADE=1
EXIT_FAILED=2
EXIT_UNWANTED=3

[ -x /usr/bin/rpm ] && platform="centos"
[ -x /usr/bin/dpkg ] && platform="ubuntu"

# compatible with non root user
USER_INFO_CONF="/etc/cvk/user_info.conf"
USER_MANAGE_EXE="/opt/bin/util_cvk_user_manage.sh"
HOST_USER_NAME="root"
USER_HOME_PATH="/root"
if [ -e "$USER_INFO_CONF" ]; then
    permit_user=$(cat $USER_INFO_CONF | grep -w "^permit_user_ssh" | sed 's/[[:space:]]//g' | awk -F '=' '{print $2}')
    if [ -e "$USER_MANAGE_EXE" ]; then
        get_permit_user=$(bash -c "/opt/bin/util_cvk_user_manage.sh query")
    fi
    if [ "X$permit_user" != "X" ] && [ "$permit_user" != "root" ] && [ "$permit_user" == "$get_permit_user" ]; then
        HOST_USER_NAME="$get_permit_user"
        USER_HOME_PATH="/home/$get_permit_user"
    fi
fi

function logprint()
{
    date="$(date +"%F %H:%M:%S")"
    echo "$date: $@"
    echo "$date: $@" >> $LOG
}

function usage()
{
    shname=`basename $0`
    echo "Error, Usage: $shname check"
    echo "              $shname install|uninstall opensrc|onestor|xsky|boke"
}

function libvirt_service()
{
    if [ -x /usr/sbin/libvirtd ]; then
        if [ "$1"X == "start"X ]; then
            [ -x /usr/bin/dpkg ] && service libvirt-bin start
            [ -x /usr/bin/rpm ] && service libvirtd start
            if [ $? -eq 0 ]; then
                logprint "start libvirt service successfully"
            fi
        else
            [ -x /usr/bin/dpkg ] && service libvirt-bin stop
            [ -x /usr/bin/rpm ] && service libvirtd stop
            if [ $? -eq 0 ]; then
                logprint "stop libvirt service successfully"
            fi
        fi
    fi

    return $EXIT_SUCESS
}

function cas_mon_service()
{
    if [ -x /usr/sbin/cas_mon ]; then
        if [ "$1"X == "start"X ]; then
            service cas_mon start
            if [ $? -eq 0 ]; then
                logprint "start cas_mon service successfully"
            fi
        else
            service cas_mon stop
            if [ $? -eq 0 ]; then
                logprint "stop cas_mon service successfully"
            fi
        fi
    fi

    return $EXIT_SUCESS
}


function check_support()
{
    CLIENT=$1
    SUPPORT_CLIENTS="opensrc onestor xsky boke"
    support="no"

    for cli in $SUPPORT_CLIENTS
    do
        if [ "$CLIENT"X == "$cli"X ]; then
            support="yes"
        fi
    done

    if [ "$support"X == "no"X ]; then
        usage
        exit $EXIT_FAILED
    fi
}

function install_client()
{
    CLI=$1
    if [ ! -f $INSTALL_DIR/$CLI/rbd-clients.md5 -o ! -f $INSTALL_DIR/$CLI/rbd-clients.tar ]; then
        logprint "failed to install $CLI, no such file"
        return $EXIT_FAILED
    fi

    bash $INSTALL_DIR/$CLI/install.sh >> $LOG 2>&1
    if [ $? -eq 0 ]; then
        md5="$(cat $INSTALL_DIR/$CLI/rbd-clients.md5)"
        ver=$DEFAULT_VERSION
        version_path=$INSTALL_DIR/$CLI/rbd-clients/${CLI}_client_version
        if [ "$CLI"X == "onestor"X -a "$platform"X == "centos"X ]; then
            # onestor centos client version file has different dir
            cp -f $INSTALL_DIR/$CLI/rbd-clients/ceph_client_rpm/onestor_client_version $version_path
        fi

        if [ -f $version_path ]; then
            # onestor client version file has external/internal version
            if [ "$CLI"X == "onestor"X ]; then
                ver_ex="$(cat $version_path | grep "ONEStor-")"
                ver_ex="${ver_ex:8}"
                ver_in="$(cat $version_path | grep "ONEStor V")"
                ver_in="${ver_in:8}"
                ver="$ver_ex $ver_in"
            else
                ver="$(cat $version_path | grep "${CLI} V")"
                ver="${ver#* }"
            fi
        else
            logprint "Missing file $version_path"
        fi

        echo "$CLI $md5 $ver" > $INSTALL_DIR/installed.txt

        if [ "$platform"X == "ubuntu"X ]; then
            for dir in $RBDAGENT_DIRS;
            do
                mkdir -p $dir
                install -m 644 $INSTALL_DIR/$CLI/librbdagent.so.1 $dir
                [ ! -L $dir/librbdagent.so ] && ln -s $dir/librbdagent.so.1 $dir/librbdagent.so
            done
        elif [ "$platform"X == "centos"X ]; then
            rpm -ivh $INSTALL_DIR/$CLI/rbdagent$CLI*.rpm
        else
            logprint "found no tool to install rbdagent"
            return $EXIT_FAILED
        fi

        # set rbd_vendor to notify libvirt what vendor
        # the current rbd client belong to
        echo "rbd_vendor = \"$CLI\"" > $RBD_VENDOR_CONF
        sync

        logprint "install $CLI successfully"
        return $EXIT_SUCESS
    else
        logprint "failed to install $CLI"
        return $EXIT_FAILED
    fi
}

function uninstall_client()
{
    CLI=$1
    bash $INSTALL_DIR/$CLI/install.sh uninstall >> $LOG 2>&1
    if [ $? -eq 0 ]; then
        rm -f $INSTALL_DIR/installed.txt
        rm -f $RBD_VENDOR_CONF

        if [ "$platform"X == "ubuntu"X ]; then
            for dir in $RBDAGENT_DIRS;
            do
                [ -f $dir/librbdagent.so.1 ] && rm -f $dir/librbdagent.so.1
                [ -L $dir/librbdagent.so ] && rm -f $dir/librbdagent.so
            done
        elif [ "$platform"X == "centos"X ]; then
            rpm -e --nodeps rbdagent$CLI
        else
            logprint "found no tool to uninstall rbdagent"
            return $EXIT_FAILED
        fi

        logprint "uninstall $CLI successfully"
        return $EXIT_SUCESS
    else
        logprint "failed to uninstall $CLIENT"
        return $EXIT_FAILED
    fi
}

function check_client()
{
    if [ ! -f $INSTALL_DIR/installed.txt ]; then
        logprint "rbd client not installed, please check!"
        exit $EXIT_FAILED
    fi
    installed_client="$(cat $INSTALL_DIR/installed.txt | awk '{print $1}')"
    installed_md5="$(cat $INSTALL_DIR/installed.txt | awk '{print $2}')"

    client_md5="$(cat $INSTALL_DIR/$installed_client/rbd-clients.md5)"
    client_ver=$DEFAULT_VERSION
    if [ ! -d $INSTALL_DIR/$installed_client/rbd-clients ]; then
        mkdir -p $INSTALL_DIR/$installed_client/rbd-clients
        tar -xf $INSTALL_DIR/$installed_client/rbd-clients.tar -C $INSTALL_DIR/$installed_client/rbd-clients
    fi

    version_path=$INSTALL_DIR/$installed_client/rbd-clients/${installed_client}_client_version
    if [ "$installed_client"X == "onestor"X -a "$platform"X == "centos"X ]; then
        # onestor centos client version file has different dir
        cp -f $INSTALL_DIR/$installed_client/rbd-clients/ceph_client_rpm/onestor_client_version $version_path
    fi

    if [ -f $version_path ]; then
        if [ "$installed_client"X == "onestor"X ]; then
            client_ver="$(cat $version_path | grep "ONEStor V" | awk '{print $2}')"
            installed_ver="$(cat $INSTALL_DIR/installed.txt | awk '{print $4}')"
        else
            client_ver="$(cat $version_path | grep "${installed_client} V" | awk '{print $2}')"
            installed_ver="$(cat $INSTALL_DIR/installed.txt | awk '{print $3}')"
        fi
    else
        logprint "Missing file $version_path"
        exit $EXIT_FAILED
    fi

    logprint "$installed_client upgrade checking..."
    logprint "installed md5: $installed_md5, client md5: $client_md5"
    logprint "installed version: $installed_ver, client version: $client_ver"

    ver1="$(echo $installed_ver | tr -cd "[0-9]")"
    ver2="$(echo $client_ver | tr -cd "[0-9]")"

    # 1: check version
    # 2: check md5sum
    if [ $ver1 -lt $ver2 ]; then
        # need to upgrade
        logprint "$installed_client need to upgrade"
        exit $EXIT_NEED_UPGRADE
    elif [ $ver1 -eq $ver2 ]; then
        if [ "$installed_md5" == "$client_md5" ]; then
            # no need to upgrade
            logprint "$installed_client no need to upgrade"
            exit $EXIT_NONEED_UPGRADE
        else
            # need to upgrade
            logprint "$installed_client need to upgrade"
            exit $EXIT_NEED_UPGRADE
        fi
    else
        # no need to upgrade
        logprint "$installed_client no need to upgrade"
        exit $EXIT_NONEED_UPGRADE
    fi
}

function main()
{
    if [ $# -eq 1 ]; then
        if [ "$1" == "check" ]; then
            check_client
        else
            usage
            exit $EXIT_FAILED
        fi
    elif [ $# -eq 2 ]; then
        CLIENT=$2
        check_support $CLIENT

        if [ "$1" == "install" -a -f $INSTALL_DIR/$CLIENT/install.sh ]; then
            libvirt_service stop
            cas_mon_service stop
            if [ -f $INSTALL_DIR/installed.txt ]; then
                installed_client="$(cat $INSTALL_DIR/installed.txt | awk '{print $1}')"
                if [ "$installed_client"X != "opensrc"X ]; then
                    logprint "current installed client not wanted, please uninstall first"
                    libvirt_service start
                    cas_mon_service start
                    exit $EXIT_UNWANTED
                fi
                uninstall_client "opensrc"
            fi

            install_client $CLIENT
            if [ $? -ne 0 ]; then
                if [ -f $INSTALL_DIR/$CLIENT/rbd-clients.tar.bak ]; then
                    logprint "fail to install $CLIENT and install $CLIENT backup"
                    cp $INSTALL_DIR/$CLIENT/rbd-clients.tar.bak $INSTALL_DIR/$CLIENT/rbd-clients.tar
                    cp $INSTALL_DIR/$CLIENT/rbd-clients.md5.bak $INSTALL_DIR/$CLIENT/rbd-clients.md5
                    install_client $CLIENT
                    if [ $? -ne 0 ]; then
                        logprint "fail to install $CLIENT backup and install opensrc"
                        install_client "opensrc"
                        if [ $? -ne 0 ]; then
                            logprint "fail to install opensrc after failing to install $CLIENT backup"
                        fi
                    fi
                    libvirt_service start
                    cas_mon_service start
                    exit $EXIT_FAILED
                else
                    logprint "fail to install $CLIENT and install opensrc"
                    install_client "opensrc"
                    if [ $? -ne 0 ]; then
                        logprint "fail to install opensrc after failing to install $CLIENT"
                    fi
                    libvirt_service start
                    cas_mon_service start
                    exit $EXIT_FAILED
                fi
            fi

            pidof libvirtd
            if [ $? -eq 0 ]; then
                libvirt_service stop
                cas_mon_service stop
                libvirt_service start
                cas_mon_service start
            else
                libvirt_service start
                cas_mon_service start
            fi

            exit $EXIT_SUCESS
        elif [ "$1" == "uninstall" -a -f $INSTALL_DIR/$CLIENT/install.sh ]; then
            libvirt_service stop
            cas_mon_service stop
            uninstall_client $CLIENT
            if [ $? -ne 0 ]; then
                logprint "fail to uninstall $CLIENT and install opensrc"
                install_client "opensrc"
                if [ $? -ne 0 ]; then
                    logprint "fail to install opensrc after failing to uninstall $CLIENT"
                fi
                libvirt_service start
                cas_mon_service start
                exit $EXIT_FAILED
            fi

            # install opensrc to make sure libvirt service work correctly
            install_client "opensrc"
            if [ $? -ne 0 ]; then
                logprint "fail to installed opensrc"
                libvirt_service start
                cas_mon_service start
                exit $EXIT_FAILED
            fi

            pidof libvirtd
            if [ $? -eq 0 ]; then
                libvirt_service stop
                cas_mon_service stop
                libvirt_service start
                cas_mon_service start
            else
                libvirt_service start
                cas_mon_service start
            fi

            exit $EXIT_SUCESS
        else
            usage
            exit $EXIT_FAILED
        fi
    elif [ $# -eq 4 ]; then
        SRC_PATH=$2
        CLIENT=$3
        DEST_IP=$4
        TAR="rbd-clients.tar"
        MD5="rbd-clients.md5"
        LOCALIP=$(python /opt/bin/netcfgtool.pyc get --name=vswitch0 | grep ipv4 | awk -F "[=,/,']" '{print $3}')
        if [ "$1" == "copy" -a -f $INSTALL_DIR/$CLIENT/install.sh -a -f $SRC_PATH ]; then
            md5sum="$(md5sum $SRC_PATH | awk '{print $1}')"
            if [ "X$LOCALIP" == "X$DEST_IP" ]; then
                cp -f $INSTALL_DIR/$CLIENT/$TAR $INSTALL_DIR/$CLIENT/$TAR.bak >/dev/null 2>&1
                cp -f $INSTALL_DIR/$CLIENT/$MD5 $INSTALL_DIR/$CLIENT/$MD5.bak >/dev/null 2>&1
                cp -f $SRC_PATH $INSTALL_DIR/$CLIENT/$TAR >/dev/null 2>&1
                echo $md5sum | sudo tee $INSTALL_DIR/$CLIENT/$MD5 >/dev/null 2>&1
            else
                ssh $HOST_USER_NAME@$DEST_IP "sudo cp -f $INSTALL_DIR/$CLIENT/$TAR $INSTALL_DIR/$CLIENT/$TAR.bak;sudo cp -f $INSTALL_DIR/$CLIENT/$MD5 $INSTALL_DIR/$CLIENT/$MD5.bak;exit" >/dev/null 2>&1
                if [ $? -ne 0 ]; then
                    logprint "failed to backup $TAR of cvk $DEST_IP"
                    exit $EXIT_FAILED
                fi

                scp $SRC_PATH $HOST_USER_NAME@$DEST_IP:$USER_HOME_PATH/$TAR >/dev/null 2>&1
                ssh $HOST_USER_NAME@$DEST_IP "sudo mv -f $USER_HOME_PATH/$TAR $INSTALL_DIR/$CLIENT/$TAR;exit" >/dev/null 2>&1
                if [ $? -ne 0 ]; then
                    logprint "failed to copy $SRC_PATH to cvk $DEST_IP"
                    exit $EXIT_FAILED
                fi

                ssh $HOST_USER_NAME@$DEST_IP "echo $md5sum | sudo tee $INSTALL_DIR/$CLIENT/$MD5;exit" >/dev/null 2>&1
                if [ $? -ne 0 ]; then
                    logprint "failed to modify $MD5 to cvk $DEST_IP"
                    exit $EXIT_FAILED
                fi
            fi
        else
            logprint "Missing file $INSTALL_DIR/$CLIENT/install.sh or $SRC_PATH"
            exit $EXIT_FAILED
        fi
    else
        usage
        exit $EXIT_FAILED
    fi
}

main $@

exit $EXIT_SUCESS
