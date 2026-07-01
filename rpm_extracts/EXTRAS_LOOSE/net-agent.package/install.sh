#!/bin/bash
MODULE=net-agent
cd $(dirname $0)

PACKAGE_DIR=$1
distri=$(/opt/bin/os_lsb_release -is)

echo "Begin to $0 ${MODULE} module..."
if [ $# -lt 1 ]; then
    echo "[Warning] Not enough arguments to input."
fi

[ "X$distri" = "XCentOS" ] || [ "X$distri" = "XH3Linux" ] && rpm -ivh --replacepkgs --replacefiles net-agent-*.rpm

if echo "$0" | grep -q '\binstall.sh$'; then
    rm -f *.deb
    rm -f *.rpm
    rm -f *.sh
fi

echo "End to $0 ${MODULE} module..."
exit 0
