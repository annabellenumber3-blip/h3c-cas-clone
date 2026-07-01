#!/bin/bash
##############################################################################
#    Func Name: install.sh
# Date Created: 2019-08-20
#       Author: z10102
#  Description: execute install py2.7-egg
#        usage: ./install.sh -help
#       Output:
#       Return: 0  : success
#-----------------------------------------------------------------------------
#  Modification History
#  DATE        NAME             DESCRIPTION
##############################################################################
if [ $# -lt 1 ]; then
    echo "Notes: $0"
    echo "This chapter describes the SRA behavior during SRM operations "
    echo "such as test, failover, and failback.                         "
    echo "Remote copy failover from site A to site B                    "
    echo "Remote copy recover - replication begins from site B to site A"
fi

MODULE=srm
cd $(dirname $0)

echo -e "\n-------------Begin to install $MODULE -----------------"

echo "Installing 3par sra..."
( cd 3par && /bin/bash ./install.sh )
if [ $? -ne 0 ]; then
    echo "Fail to install $MODULE."
    exit 1
fi

# onestor sra
echo "Installing onestor sra..."
( cd onestor && python3 setup.py install )
if [ $? -ne 0 ]; then
    echo "Fail to install $MODULE."
    exit 1
fi

# nimble sra
echo "Installing nimble sra..."
rm -rf /opt/nimble && mkdir -p /opt/nimble
tar -xf nimble-sra.tar.gz -C /opt/nimble/
if [ $? -ne 0 ]; then
    echo "Fail to install $MODULE."
    exit 1
fi

echo -e "\n-------------End to Install ${MODULE}-----------------"
exit 0
