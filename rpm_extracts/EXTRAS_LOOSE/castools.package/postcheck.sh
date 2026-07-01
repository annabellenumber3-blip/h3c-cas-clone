#!/bin/bash
##############################################################################
#    Func Name: postcheck.sh
# Date Created: 2017-08-10
#       Author: z08789
#  Description: execute after upgraed
#        usage: 1. $0 [$1]
#       Output:
#       Return: 0  : success
#-----------------------------------------------------------------------------
#  Modification History
#  DATE        NAME             DESCRIPTION
##############################################################################
castools_path="/vms/isos/castools.iso"
castools_mnt="/tmp/castools_iso"
castools_win="${castools_mnt}/CAS_tools_setup.exe"
castools_linux="${castools_mnt}/linux"

cas_version_path="/etc/cas_cvk-version"
uis_version_path="/etc/uis-version"
cas_version=""
cas_num=""
cas_num_arr=""
str_num=""
ARCH=$(uname -m)

if [ ! -d /vms/isos/ ]; then
    echo -e "[WARN] /vms/isos/ directory is not exsit, if this is stateful failover CVM, please ignore this warning."
    exit 0
fi

if [ ! -e $castools_path ]; then
    echo -e "[ERROR] $castools_path is not exsit!"
    exit 1
fi

if [ ! -e $cas_version_path ]; then
    echo -e "[ERROR] $cas_version_path is not exsit!"
    exit 1
fi

if [ -e "$uis_version_path" ];then
    cas_version=$(head -n 1 $uis_version_path 2>/dev/null | awk '{print $3}')
else
    cas_version=$(head -n 1 $cas_version_path 2>/dev/null | awk '{print $3}')
fi

cas_num_arr=${cas_version//[A-Z]/ }
for str in ${cas_num_arr[@]}; do
    str_num=$(expr $str + 0)
    cas_num=$cas_num$str_num
done
cas_version=$(expr $cas_num + 0)

if [ -z "$cas_num" ]; then
    echo -e "[ERROR] CAS version is null!"
    exit 1
fi


if [ -d $castools_mnt ]; then
    umount $castools_mnt 1>/dev/null 2>&1
    rm -rf $castools_mnt
fi

mkdir -p $castools_mnt 1>/dev/null 2>&1
mount -o loop $castools_path $castools_mnt 1>/dev/null 2>&1
if [ $? -ne 0 ]; then
    is_isofs_ok=$(grep iso9660 /proc/filesystems 2>/dev/null)
    if [ -z "$is_isofs_ok" ]; then
        echo -e "[WARN] iso9660 filesystem will be ok after reboot!"
        exit 0
    fi
fi

castools_check_x86_64() {
    if [ ! -e $castools_win ]; then
        echo -e "[ERROR] castools windows packages check failed!"
        exit 1
    fi

    pkg_all=($(ls $castools_linux | grep "^qemu-ga-" | grep -E ".deb$|.tar.gz$|.rpm$|.txz$"))
    pkg_deb=()
    pkg_tar=()
    pkg_rpm=()
    pkg_txz=()

    if [ ${#pkg_all[@]} -ne 10 ] && [ ${#pkg_all[@]} -ne 8 ]; then
        echo -e "[ERROR] castools packages number wrong!"
        exit 1
    fi

    for pkg in ${pkg_all[@]}; do
        pkg_deb=($(echo ${pkg//./} | grep "deb$" | grep "$cas_version") ${pkg_deb[*]})
        pkg_tar=($(echo ${pkg//./} | grep "targz$" | grep "$cas_version") ${pkg_tar[*]})
        pkg_rpm=($(echo ${pkg//./} | grep "rpm$" | grep "$cas_version") ${pkg_rpm[*]})
        pkg_txz=($(echo ${pkg//./} | grep "txz$" | grep "$cas_version") ${pkg_txz[*]})
    done

    if [ ${#pkg_deb[@]} -ne 2 ] || [ ${#pkg_tar[@]} -ne 2 ] || ( [ ${#pkg_rpm[@]} -ne 2 ] && [ ${#pkg_rpm[@]} -ne 4 ] ) || [ ${#pkg_txz[@]} -ne 2 ] ; then
        echo -e "[ERROR] castools linux packages check failed!"
        exit 1
    fi
}

castools_check_aarch64() {
    pkg_all=($(ls $castools_linux | grep "^qemu-ga-" | grep -E ".deb$|.rpm$"))
    pkg_deb=()
    pkg_rpm=()

    if [ ${#pkg_all[@]} -ne 2 ]; then
        echo -e "[ERROR] castools packages number wrong!"
        exit 1
    fi

    for pkg in ${pkg_all[@]}; do
        pkg_deb=($(echo ${pkg//./} | grep "deb$" | grep "$cas_version") ${pkg_deb[*]})
        pkg_rpm=($(echo ${pkg//./} | grep "rpm$" | grep "$cas_version") ${pkg_rpm[*]})
    done

    if [ ${#pkg_deb[@]} -ne 1 ] || [ ${#pkg_rpm[@]} -ne 1 ] ; then
        echo -e "[ERROR] castools linux packages check failed!"
        exit 1
    fi
}

if [ "X$ARCH" = "Xaarch64" ]; then
    castools_check_aarch64
else
    castools_check_x86_64
fi

if [ -d $castools_mnt ]; then
    umount $castools_mnt 1>/dev/null 2>&1
    rm -rf $castools_mnt
fi

echo -e "[SUCESS] castools check ok!"

exit 0
