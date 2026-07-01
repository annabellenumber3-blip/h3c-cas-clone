#tar -zxvf lib64.tar.gz
chmod 755 ./iNodeManager
chmod 755 ./7za
chmod 755 ./ESM.sh
chmod -R 777 ../iNodeManager

CURDIR=`pwd`

sed -i "s:@INSTALL_PATH:"$CURDIR":g" $CURDIR/iNodeManager.desktop
ln -fs $CURDIR/iNodeManager.desktop /usr/share/applications/iNodeManager.desktop