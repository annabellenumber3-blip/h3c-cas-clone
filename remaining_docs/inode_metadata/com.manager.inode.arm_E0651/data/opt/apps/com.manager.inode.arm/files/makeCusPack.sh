#!/bin/sh
cd /opt/apps/com.manager.inode.arm/files/
rm -rf ./iNodeCusUpd/Dot*.tar.gz
if grep -q '<dlpIP>.*[^[:space:]].*</dlpIP>' custom/iNodeCustom.xml;
then
    tar -xzf ./template/iNodeClient_Linux64.tar.gz -C ./template

    tar -czvf /opt/apps/com.manager.inode.arm/files/iNodeCusUpd/Dot1X_iNodeCusUpd.tar.gz custom -C ./template/iNodeClient trld_arm64.tar.gz

    rm -rf ./template/iNodeClient
else
    tar -czvf /opt/apps/com.manager.inode.arm/files/iNodeCusUpd/Dot1X_iNodeCusUpd.tar.gz custom
fi
#tar -czvf /opt/apps/com.manager.inode.arm/files/iNodeCusUpd/Dot1X_iNodeCusUpd.tar.gz custom
