#!/bin/sh
cd /opt/apps/com.manager.inode.amd/files/
rm -rf ./iNodeCusUpd/Dot*.tar.gz

if grep -q '<dlpIP>.*[^[:space:]].*</dlpIP>' custom/iNodeCustom.xml;
then
    tar -xzf ./template/iNodeClient_Linux64.tar.gz -C ./template

    tar -czvf /opt/apps/com.manager.inode.amd/files/iNodeCusUpd/Dot1X_iNodeCusUpd.tar.gz custom -C ./template/iNodeClient trld_x86_64.tar.gz

    rm -rf ./template/iNodeClient
else
    tar -czvf /opt/apps/com.manager.inode.amd/files/iNodeCusUpd/Dot1X_iNodeCusUpd.tar.gz custom
fi
