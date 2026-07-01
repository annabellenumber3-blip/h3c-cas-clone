{
  if [ ! -d /var/log/operation ]
  then
      mkdir /var/log/operation 
      if [ `id -u` -eq 0 ]
      then
          chattr +a /var/log/operation
      fi
  fi

  if [ ! -d /var/log/.operation ]
  then
      mkdir /var/log/.operation
      if [ `id -u` -eq 0 ]
      then
          chattr +a /var/log/.operation
      fi
  fi

  file1=/var/log/operation/`date '+%y-%m-%d'`.log
  if [ ! -f $file1 ]
  then
      touch $file1
      chmod 777 $file1
      chattr +a $file1
  fi

  file2=/var/log/.operation/`date '+%y-%m-%d'`.log
  if [ ! -f $file2 ]
  then
      touch $file2
      chmod 777 $file2
      chattr +a $file2
  fi

  records=`echo "$(date "+%Y/%m/%d %T")##$(who am i | awk '{print $1, $2, $NF}')##$(pwd)##$(history 1 | sed 's/^[ \t]*//g' |cut -d ' ' -f2-)"`
  echo "$records" >>$file1
  echo "$records" >>$file2
  caudit --op "$records" >/dev/null 2>&1
  #echo $(date "+%y-%m-%d %T ## $(who am i |awk "{print \$1\" \"\$2\" \"\$5}") ## $(pwd) ## $(history 1 | sed 's/^[ \t]*//g' |cut -d " " -f2-)";) >> $file
} 2>/dev/null
