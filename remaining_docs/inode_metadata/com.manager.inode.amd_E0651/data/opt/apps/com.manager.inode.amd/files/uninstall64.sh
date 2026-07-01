rm -rf ./*
cd ../
rm -rf iNodeManager

linux_terminate_process()
{
    sudo killall -9 $1 > /dev/null 2>&1

}

IfExistUI=`ps awx -o command|awk -F/ '{print $NF}'|grep -x iNodeManager`
if [ "$IfExistUI" != "" ]
then
    sleep 5
	linux_terminate_process iNodeManager
fi

rm -rf /usr/share/applications/iNodeManager.desktop