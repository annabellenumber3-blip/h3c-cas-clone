#!/bin/bash

. /etc/environment
. ${UTIL_SHELL_SCRIPT_PATH}/util_commondefine
. ${UTIL_SHELL_SCRIPT_PATH}/util_returncodes
. ${UTIL_SHELL_SCRIPT_PATH}/util_shellfuncs

MODULE_NAME=Close_diskcache_for2000G3

diskname=$1
action=$2
devpath=$3

#UIS_ALARM_trapid
REMOVE_OS_DISK=5002
REMOVE_DATA_DISK=5000
ADD_OS_DISK=5003
ADD_DATA_DISK=5001

#OS_HOSTID_CFG
F_OSDISK_HOSTID="/etc/uis2000_osdisk_slotid"

function cfg_osslotid()
{
   local l_is_raid1=""
   local l_osslots=()
   local cnt=0
   l_is_raid1=`cat /proc/mdstat|grep -w raid1`
   if [ -n "$l_is_raid1" ];then
       l_disklist=`mdadm -D /dev/md126|grep -w "active sync\|spare rebuilding"|grep "/dev/sd"|awk '{print $7}'`
       for i in `echo "$l_disklist"`
       do
           isslot=`udevadm info "$i"|grep DEVPATH|awk -F '/' '{print $6}'`
           l_osslots[$cnt]="$isslot"
           cnt=`expr $cnt + 1`
       done
   fi

   touch "$F_OSDISK_HOSTID"
   if [ "${#l_osslots[@]}" -eq 2 ];then
       util_printlog $MODULE_NAME WARNING "update UIS2000 os slot info:${l_osslots[@]}."
       echo ${l_osslots[@]} >"$F_OSDISK_HOSTID"
       #更新系统盘槽位信息后，重启点灯监控进程
       #systemctl restart ledmon.service 2>/dev/null
   fi
   
   return 0
}


function help()
{
    echo "this is the param format for only UIS product."
    echo "1 -h or help :get help info"
    echo "2 \"osdid\" \"clean\" :clean the osd residual info "
    echo "      Example:\"2\" \"clean\" for single and \"2 3 4\" \"clean\"for multiple"
    echo "3 \"diskname osdid \" \"cleanall\" :clean all the osdinf include data disk partition,only support one disk each,only the disk partition is not mounted"
    echo "      Example \"sda 2\" \"cleanall\"  clean all the part of sda and osd info "
    echo "4 \"osdid\" \"get\":get the disk name by osdid,only the osdid using scache"
}
if [[ "$1" == "-h" ]] || [[ "$1" == "help" ]]; then
    help
    exit 1
fi


#output:OS_DISK 1
#output:DATA_DISK 0
function get_disk_type()
{ 
   #if disk is old os disk
   l_md_uuid=`mdadm -D /dev/md126 2>/dev/null|grep UUID|awk '{print $3}'`
   if [ -n "$l_md_uuid" ];then
   	l_mdinfo=`mdadm -E "${diskname}" 2>/dev/null|grep -w "$l_md_uuid"`
   	if [ -n "$l_mdinfo" ];then
      	   return 1
   	fi
   fi
 
   l_hostinfo=`echo "${devpath}" 2>/dev/null |awk -F '/' '{print $6}'`
   l_ret1=`cat $F_OSDISK_HOSTID|grep -w "$l_hostinfo"`
   if [ -n "$l_ret1" ];then
       return 1 
   fi
   return 0
}

#function only for uis product
function get_diskname_byosdid_foruis()
{
    osdid=$1
    if test -e /var/lib/ceph/osd-cache-config/ceph-$osdid/fsid; then
       diskpartid=`cat /var/lib/ceph/osd-cache-config/ceph-$osdid/fsid`
       diskname=`lsblk -o +partuuid|grep -B2 $diskpartid|grep "^sd"|awk '{print $1}'`
       echo $diskname
    else
        echo ""
    fi
    
}

#function only for uis product
function clean_osd_info_foruis()
{

    osdid=$1
    clean_scache=$2
    #echo "the osd id is $osdid"
    isup=`ceph osd tree |grep up|grep osd.$osdid`
    if [ "X$isup" != "X" ];then
        exit 2
    fi
    util_printlog $MODULE_NAME WARNING " remove $osdid from cluster  and clean the scache partition if parm is 1 .now the parm is $clean_scache"
    umount  -lf /var/lib/ceph/osd/ceph-$osdid > /dev/null 2>&1
    rm -rf /var/lib/ceph/osd/ceph-$osdid > /dev/null 2>&1
    ceph osd crush remove osd.$osdid > /dev/null 2>&1
    ceph auth del osd.$osdid > /dev/null 2>&1
    ceph osd rm osd.$osdid > /dev/null 2>&1
    if [ $clean_scache != "0" ]; then
    if test -e /var/lib/ceph/osd-cache-config/ceph-$osdid/fcache_uuid; then
       diskpartid=`cat /var/lib/ceph/osd-cache-config/ceph-$osdid/fcache_uuid`
       partname=`ls -l /dev/disk/by-partuuid/ |grep $diskpartid|awk -F / '{print $NF}'`
       if [[ $partname =~ "nvme" ]];
       then
           name=${partname%p*}
           part_id_1=${partname#*p}
           diskpartid_2=`cat /var/lib/ceph/osd-cache-config/ceph-$osdid/block.db_uuid`
           partname2=`ls -l /dev/disk/by-partuuid/ |grep $diskpartid_2|awk -F / '{print $NF}'`
           part_id_2=${partname2#*p}
           diskpartid_3=`cat /var/lib/ceph/osd-cache-config/ceph-$osdid/block.wal_uuid`
           partname3=`ls -l /dev/disk/by-partuuid/ |grep $diskpartid_3|awk -F / '{print $NF}'`
           part_id_3=${partname3#*p}
       else
           name=`echo $partname|/usr/bin/tr -d '0-9'`
           part_id_1=`echo $partname|/usr/bin/tr -cd "[0-9]"`
           diskpartid_2=`cat /var/lib/ceph/osd-cache-config/ceph-$osdid/block.db_uuid`
           partname2=`ls -l /dev/disk/by-partuuid/ |grep $diskpartid_2|awk -F / '{print $NF}'`
           part_id_2=`echo $partname2|/usr/bin/tr -cd "[0-9]"`
           diskpartid_3=`cat /var/lib/ceph/osd-cache-config/ceph-$osdid/block.wal_uuid`
           partname3=`ls -l /dev/disk/by-partuuid/ |grep $diskpartid_3|awk -F / '{print $NF}'`
           part_id_3=`echo $partname3|/usr/bin/tr -cd "[0-9]"`
       fi
    fi
    name=/dev/$name
    util_printlog $MODULE_NAME WARNING " clean the osd $osdid info and scache disk  $name 's part $part_id_1, $part_id_2 and $part_id_3 "
    /usr/sbin/parted $name -s rm $part_id_1
    /usr/sbin/parted $name -s rm $part_id_2
    /usr/sbin/parted $name -s rm $part_id_3
    /usr/sbin/partprobe $name
    fi
    
}

is_powlwir=`/usr/sbin/dmidecode -t 1 | /usr/bin/grep 'Product Name'|/usr/bin/grep '2000 G3'`
if [ "X$is_powlwir" != "X" ]; then
    /usr/sbin/hdparm -W 0 $diskname > /dev/null 2>&1
    cfg_osslotid
fi

#框架说明：
#系统盘：可处理插拔和自动恢复逻辑。【通用逻辑】
#数据盘：仅捕捉插拔事件，但处理逻辑需根据各自产品自行修改【各产品自行适配逻辑】
#场景一：如UIS或VDI产品，使用ONEStor组件：走【没有华云存储,有uis版本】流程
#场景二：如CAS产品，走【没有uis版本号,没有华云存储,没有ONEStor】流程
#场景三：华云存储组件：走【有uis版本号,有华云存储,没有ONEStor】处理流程


# 场景一：support only 2000G3 product for ONEStor product(没有华云存储,有uis版本)
if [ ! -d /opt/fusionstack -a -f /etc/uis-version -a -n "$diskname" -a "X$is_powlwir" != "X" ];then
  #recode shell params
  util_printlog $MODULE_NAME debug "Action=$action Diskname=$diskname Devpath=$devpath"  
  diskfd=`echo ${diskname##*/}`
  #remove disk
  if [ "$action" == "remove" ];then
     #get mount dir of removed disk   
     rdisk_mount_dir=`mount|grep "$diskname"|grep "/var/lib/ceph/osd"|awk '{print $3}'`
     #umount old disk dir
     util_printlog $MODULE_NAME debug "umount old disk=$diskname,dir=$rdisk_mount_dir"
     umount -lf "$rdisk_mount_dir"

     get_disk_type 
     if [ $? -ne 0 ];then
        #remove OS_DISK
        /opt/bin/uis_send_alarm.sh "${REMOVE_OS_DISK}" "$diskfd"
     else
        #remove data disk
        /opt/bin/uis_send_alarm.sh "${REMOVE_DATA_DISK}" "$diskfd"
     fi
   
     exit 0
  fi
  
  #add old diskdisk or osdisk
  if [ "$action" == "add" ];then
     #if disk is OS disk
     get_disk_type
     if [ $? -ne 0 ];then
        util_printlog $MODULE_NAME debug "Add OS disk ${diskname}"
        /opt/bin/uis_send_alarm.sh "${ADD_OS_DISK}" "$diskfd"
        mdadm /dev/md127 -a "${diskname}"
        cfg_osslotid
        #/usr/sbin/mdadm --incremental "${diskname}"
     	exit 0
     fi

     #if disk is old data disk
     r_blkid=`/usr/sbin/blkid |grep "$diskname"|grep "ceph data"`
     if [ -n "$r_blkid" ];then
        l_ret=`mkdir -p /tmp/uis_2000`
        mount -o ro "$diskname"1 /tmp/uis_2000
        osdblkuuid=`cat /tmp/uis_2000/block_uuid`
        osdnum=`cat /tmp/uis_2000/whoami`
        umount -lf "/tmp/uis_2000"
        if [ -n "$osdnum" -a -n "$osdblkuuid" ];then
           l_ret2=`/usr/sbin/blkid |grep "$diskname"|grep "ceph block"|grep -w "$osdblkuuid"`
            if [ -n "$l_ret2" ];then
              #mount "$diskname"1 /var/lib/ceph/osd/ceph-"$osdnum"
              util_printlog $MODULE_NAME debug "ReAdd data disk ${diskname},osdnum:${osdnum},osdblkuuid:${osdblkuuid}."
              /opt/bin/uis_send_alarm.sh  "${ADD_DATA_DISK}" "$diskfd"
              /opt/h3c/bin/ceph-disk activate "$diskname"1
           fi
        fi
        /usr/bin/rm -rf /tmp/uis_2000
        exit 0
     fi
    
     #if disk is new data disk 
     util_printlog $MODULE_NAME debug "Add data disk ${diskname}."
     /opt/bin/uis_send_alarm.sh "${ADD_DATA_DISK}" "$diskfd"
     exit 0
  fi
  
  #clean old disk
  if [ "$action" == "clean" ];then
    osdids=$diskname
    util_printlog $MODULE_NAME WARNING "clean osdids $diskname"
    allid=`echo $osdids|cut -d " " -f 1-`
    for id in $allid
    do
    isup=`ceph osd tree |grep up|grep osd.$id`
    if [ "X$isup" != "X" ];then
        exit 2
    fi
    done

    for id in $allid
    do
        clean_osd_info_foruis $id "1"
    done
  fi
  
  #clean date disk partition
  if [ "$action" == "cleanall" ];then
    osdid=$diskname
    name=$(get_diskname_byosdid_foruis $osdid)
    util_printlog $MODULE_NAME WARNING " clean the osd disk $name 's partition and osd $osdid info"
    clean_osd_info_foruis $osdid "0"
    parted /dev/$name rm 1 > /dev/null 2>&1
    parted /dev/$name rm 2 > /dev/null 2>&1
    partprobe /dev/$name  > /dev/null 2>&1
    sgdisk -o /dev/$name > /dev/null 2>&1
    exit 0
  fi

  if [ "$action" == "get" ];then
      osdid=$diskname
      echo $(get_diskname_byosdid_foruis $osdid)
  fi
  exit 0
fi

#场景二：for CAS product(没有uis版本号,没有华云存储,没有ONEStor)
if [ ! -f /etc/uis-version -a ! -d /opt/fusionstack -a ! -f /etc/onestor_external_version -a -f /etc/cas_cvk-version -a -n "$diskname" -a "X$is_powlwir" != "X" ];then
  #recode shell params
  util_printlog $MODULE_NAME debug "Action=$action Diskname=$diskname Devpath=$devpath"  
  diskfd=`echo ${diskname##*/}`
  
  #remove disk
  if [ "$action" == "remove" ];then 
     #请产品自行处理，umount拔出磁盘对应挂载目录，
     #util_printlog $MODULE_NAME debug "umount old disk=$diskname,dir=$rdisk_mount_dir"
     #umount -lf "$rdisk_mount_dir"
     
	 #请产品自行处理，判断磁盘类型后，上报产品告警
     get_disk_type 
     if [ $? -ne 0 ];then
        #移除系统盘，上报告警
        /usr/sbin/cha alarm-report 1 osdiskremove $diskfd 1 -ma
        util_printlog $MODULE_NAME debug "Remove OS disk ${diskname}"
     else
        #移除数据盘，上报告警
        /usr/sbin/cha alarm-report 1 datadiskremove $diskfd 1 -ma
        util_printlog $MODULE_NAME debug "Remove data disk ${diskname}"
     fi   
     exit 0
  fi
  
  
  #处理系统盘和数据盘处理逻辑，包括老数据盘/系统盘和全新数据盘/系统盘
  if [ "$action" == "add" ];then
     #if disk is OS disk
     get_disk_type
     if [ $? -ne 0 ];then
        util_printlog $MODULE_NAME debug "Add OS disk ${diskname}"
        /usr/sbin/cha alarm-report 1 osdiskadd $diskfd 1 -ma
        mdadm /dev/md127 -a "${diskname}"
        cfg_osslotid
        #/usr/sbin/mdadm --incremental "${diskname}"
     	exit 0
     fi

     #请产品自行处理，如果插入磁盘是老数据盘，需做恢复处理。
     #
	 #
    
     #请产品自行处理，如果插入磁盘是全新数据盘
     util_printlog $MODULE_NAME debug "Add data disk ${diskname}."
     /usr/sbin/cha alarm-report 1 datadiskadd $diskfd 1 -ma
     exit 0
   fi
fi

#场景三：for华云存储产品，告警复用UIS(有uis版本；没有ONEStor；有华云目录)
if [ -f /etc/uis-version -a ! -f /etc/onestor_external_version -a -d /opt/fusionstack -a -n "$diskname" -a "X$is_powlwir" != "X" ];then
  #recode shell params
  util_printlog $MODULE_NAME debug "Action=$action Diskname=$diskname Devpath=$devpath"  
  diskfd=`echo ${diskname##*/}`
  
  #remove disk
  if [ "$action" == "remove" ];then 
     #请产品自行处理，umount拔出磁盘对应挂载目录，
     util_printlog $MODULE_NAME debug "umount old disk=$diskname,dir=$rdisk_mount_dir"
     #umount -lf "$rdisk_mount_dir"
     
	 #判断磁盘类型后，上报产品告警
     get_disk_type 
     if [ $? -ne 0 ];then
        #移除系统盘，上报告警
        /opt/bin/uis_send_alarm.sh "${REMOVE_OS_DISK}" "$diskfd"
     else
        #移除数据盘，上报告警
        /opt/bin/uis_send_alarm.sh "${REMOVE_DATA_DISK}" "$diskfd"
     fi   
     exit 0
  fi
  
  
  #处理系统盘和数据盘处理逻辑，包括老数据盘/系统盘和全新数据盘/系统盘
  if [ "$action" == "add" ];then
     #if disk is OS disk
     get_disk_type
     if [ $? -ne 0 ];then
        util_printlog $MODULE_NAME debug "Add OS disk ${diskname}"
        /opt/bin/uis_send_alarm.sh "${ADD_OS_DISK}" "$diskfd"
        mdadm /dev/md127 -a "${diskname}"
        cfg_osslotid
        #/usr/sbin/mdadm --incremental "${diskname}"
     	exit 0
     fi

     #请产品自行处理，如果插入磁盘是老数据盘，需做恢复处理。
     #
     #
    
     #请产品自行处理，如果插入磁盘是全新数据盘
     util_printlog $MODULE_NAME debug "Add data disk ${diskname}."
     /opt/bin/uis_send_alarm.sh "${ADD_DATA_DISK}" "$diskfd"     
     exit 0
  fi
fi 

exit 0
