#!/bin/sh
Arch=arm

cd /opt/apps/com.manager.inode."$Arch"/files/template

INODE_VER=`dpkg -l | grep com.manager.inode | awk '{print $3}' | cut -d '-' -f 2`
INODE_DEB=`ls | grep *.deb`
if [ "$INODE_DEB" = "" ]
then
    exit 0
fi


cd ..
cp -rf ./template/*.deb ./iNodeSetup/
cd ./iNodeSetup
dpkg-deb -R *.deb a

rm -rf a/opt/apps/com.client.inode."$Arch"/files/*
rm -rf a/opt/apps/com.client.inode."$Arch"/files/.iNode

tar -xzvf iNodeClient_Linux64*.tar.gz

cd iNodeClient

#添加iNodeClient内需要解压的压缩包,并删除压缩包减小生成安装包的大小
if [ -f "./nftables.tar.gz" ]; then
	tar -xzvf ./nftables.tar.gz -C ./ && rm ./nftables.tar.gz
fi

if [ -f "trld_arm64.tar.gz" ]; then
    # 检查 /custom/iNodeCustom.xml 中 <dlpIP> 的值是否不为空
    if grep -q '<dlpIP>.*[^[:space:]].*</dlpIP>' custom/iNodeCustom.xml;
	then
        echo "dlp customized"
        tar -xzvf ./trld_arm64.tar.gz -C ./ && rm ./trld_arm64.tar.gz
		chmod -R 755 ./.trld
	else
		rm -rf ./trld_arm64.tar.gz
    fi
else
    echo "trld_arm64.tar.gz not found"
fi

if [ -f "vnc_arm64.tar.gz" ];
then
	tar -xzvf ./vnc_arm64.tar.gz -C ./ && rm ./vnc_arm64.tar.gz
	chmod -R 755 ./vnc
fi

cd ..

cp -rf ./iNodeClient/.iNode ./a/opt/apps/com.client.inode."$Arch"/files/
cp -rf ./iNodeClient/.trld ./a/opt/apps/com.client.inode."$Arch"/files/
cp -rf ./iNodeClient/* ./a/opt/apps/com.client.inode."$Arch"/files/
sed -i "s:@INSTALL_PATH:/opt/apps/com.client.inode."$Arch"/files:g" ./a/opt/apps/com.client.inode."$Arch"/files/iNodeClient.sh
sed -i "s:@INSTALL_PATH:/opt/apps/com.client.inode."$Arch"/files:g" ./a/opt/apps/com.client.inode."$Arch"/files/iNodeClient.desktop
rm -rf ./a/opt/apps/com.client.inode."$Arch"/files/updateexec.sh
mv ./a/opt/apps/com.client.inode."$Arch"/files/updateForDeb.sh ./a/opt/apps/com.client.inode."$Arch"/files/updateexec.sh

#将修改后的桌面图标文件，拷贝到安装目录结构（适配UOS）
cp -rf ./a/opt/apps/com.client.inode."$Arch"/files/iNodeClient.desktop ./a/opt/apps/com.client.inode."$Arch"/entries/applications/com.client.inode."$Arch".desktop

subTitle=`cat ./a/opt/apps/com.client.inode."$Arch"/files/custom/iNodeCustom.xml | grep '<subTitle>'`
subTitle=`echo $subTitle | cut -d'<' -f2`
subTitle=`echo $subTitle | cut -d'>' -f2`
if [ "$subTitle" != "" ]
then
    sed "s/Name=iNodeClient/Name=$subTitle/g" -i ./a/opt/apps/com.client.inode."$Arch"/entries/applications/*.desktop
fi


OS_Kylin990=`cat /proc/cpuinfo | grep '990'`

if [ "$OS_Kylin990" != "" ]
then
    echo "0" > ./a/opt/apps/com.client.inode."$Arch"/files/conf/Tray.txt
else
    echo "1" > ./a/opt/apps/com.client.inode."$Arch"/files/conf/Tray.txt
fi

chmod -R 777 a/opt/

dpkg-deb -b a com.client.inode."$Arch"_"$INODE_VER".deb

rm -rf a
rm -rf iNodeClient
rm -rf *.tar.gz
chmod 777 com.client.inode."$Arch"_"$INODE_VER".deb
