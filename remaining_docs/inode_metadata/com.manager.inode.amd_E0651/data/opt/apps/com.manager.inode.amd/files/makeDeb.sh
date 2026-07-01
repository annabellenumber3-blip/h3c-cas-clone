#!/bin/sh
Arch=amd

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

if [ -f "trld_x86_64.tar.gz" ]; then
    # 检查 /custom/iNodeCustom.xml 中 <dlpIP> 的值是否不为空
    if grep -q '<dlpIP>.*[^[:space:]].*</dlpIP>' custom/iNodeCustom.xml;
	then
        echo "dlp customized"
        tar -xzvf ./trld_x86_64.tar.gz -C ./ && rm ./trld_x86_64.tar.gz
		chmod -R 755 ./.trld
	else
		rm -rf ./trld_x86_64.tar.gz
    fi
else
    echo "trld_x86_64.tar.gz not found"
fi

if [ -f "vnc_x86_64.tar.gz" ];
then
	tar -xzvf ./vnc_x86_64.tar.gz -C ./ && rm ./vnc_x86_64.tar.gz
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

chmod -R 777 a/opt/

dpkg-deb -b a com.client.inode."$Arch"_"$INODE_VER".deb

rm -rf a
rm -rf iNodeClient
rm -rf *.tar.gz
chmod 777 com.client.inode."$Arch"_"$INODE_VER".deb
