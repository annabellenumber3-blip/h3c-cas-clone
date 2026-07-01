#!/bin/bash

cd $(dirname $0)

#version info
mv -f cas_cvk-version /etc/
mv -f cloud_base-version /etc/

if [ -f /etc/cas_component_info ]; then
    cvm_installed=$(grep "<CVM>installed</CVM>" /etc/cas_component_info)
    cic_installed=$(grep "<CIC>installed</CIC>" /etc/cas_component_info)
    ssv_installed=$(grep "<SSV>installed</SSV>" /etc/cas_component_info)
fi
if [ "X$cvm_installed" != "X" ] || [ "X$cic_installed" != "X" ] || [ "X$ssv_installed" != "X" ]; then
    mv -f cas_cvm-version /etc/
fi

cp -f .cas_supplier_name /etc/
chattr +i /etc/.cas_supplier_name

# product specific installation
[ -f install/install.sh ] && bash install/install.sh

provider=$(cat /etc/.cas_supplier_name)
prop="default.properties"
case $provider in
    "027d1aa9e9dd8486d67abff7c23cc94c") prop="unis.properties";;
    "4d5026db68352a766486e21437f069d2") prop="unicloud.properties";;
    *);;
esac
cp -f provider/$prop /etc/provider_info.properties

