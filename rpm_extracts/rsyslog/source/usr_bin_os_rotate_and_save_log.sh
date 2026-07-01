#!/bin/bash
###########################################################################
#File Name:os_rotate_and_save_log.sh
#Description: Save the source file to destination directories by size
#Parameter: It is a character string, has three values.
#	    parameter one, the file which needs to be saved.
#           parameter two, the destination directory for saving the file.
#           parameter three, logdump dir limit size
#Output:none
###########################################################################

CUR_SCRIPT=$0
PID=$(pidof -x $CUR_SCRIPT)
L_CUR_SCRIPT_RUNNING_COUNT=$(echo "$PID" | wc -w)

#can not be runned twice at the same time
if [ "${L_CUR_SCRIPT_RUNNING_COUNT}" -gt 1 ];then
	echo "[$CUR_SCRIPT] $CUR_SCRIPT is running, can not run it twice at one time" >/dev/kmsg
	exit 1
fi

#parse parameter
declare -a PARAM_ARRAY
PARAM_ARRAY=($1)
SRC_FILE=${PARAM_ARRAY[0]}
DEST_DIR=${PARAM_ARRAY[1]}
DIR_LIMIT_SIZE=${PARAM_ARRAY[2]}
FILE_NAME=${SRC_FILE##*/}

#get the maximum serial number
SERIEL_NUM=`ls $DEST_DIR|grep "messages-.*-.*\.tar\.bz2"|cut -d '-' -f3 |sort -nr|head -n1|cut -d '.' -f1`
if [ -z $SERIEL_NUM ];then
	SERIEL_NUM=0
fi
((SERIEL_NUM=$SERIEL_NUM+1))

TMPNAME=${FILE_NAME}-`date "+%Y%m%d%H%M%S"-${SERIEL_NUM}`
TMPFILE=/tmp/$TMPNAME

#create destination directory
if [ ! -d "$DEST_DIR" ];then
	mkdir -p $DEST_DIR
fi

#save the log file to /tmp/
mv $SRC_FILE $TMPFILE

#count the maximum number of bytes in the destination directory
DIR_LIMIT_SIZE_NUM=${DIR_LIMIT_SIZE%[A-Z|a-z]}
DIR_LIMIT_SIZE_UNIT=${DIR_LIMIT_SIZE##[0-9]*[0-9]}

case $DIR_LIMIT_SIZE_UNIT in
	M|m)
	DIR_LIMIT_SIZE_NUM=$((DIR_LIMIT_SIZE_NUM*1024*1024))
	;;
	K|k)
	DIR_LIMIT_SIZE_NUM=$((DIR_LIMIT_SIZE_NUM*1024))
	;;
esac

TAR_PKG_NAME=$TMPFILE.tar.bz2
cd /tmp
tar -cjf $TAR_PKG_NAME $TMPNAME
cd -

#count current dump file size
FILE_SIZE=`du -sb $TAR_PKG_NAME|awk '{print $1}'`
#count the maximum space that a file can occupy in the destination directory if it is to accommodate the current dump file.
((MAX_LEFT_SIZE=$DIR_LIMIT_SIZE_NUM-$FILE_SIZE))

#current total size of files
pushd $DEST_DIR >/dev/null
cursize=`du -sb|awk '{print $1}'`
#delete extraneous files when there is not enough space
if [ "$cursize" -gt "$MAX_LEFT_SIZE" ];then
	irrelevant_files=`find $DEST_DIR|grep -v "^$DEST_DIR/$FILE_NAME-.*-.*\.tar\.bz2$" |grep -v "^$DEST_DIR$"`
	if [ "$irrelevant_files" != "" ];then
		rm -rf $irrelevant_files
		echo  "[$0]space of output directory $DEST_DIR will be larger than $DIR_LIMIT_SIZE bytes,delete the irrelevant files :$irrelevant_files" >/dev/kmsg
		cursize=`du -sb|awk '{print $1}'`
	fi
fi

#when the space is still insufficient, delete the oldest log package one by one until it can hold the latest log package
while [ $cursize -gt $MAX_LEFT_SIZE ]
do
	del_file=`ls $DEST_DIR|grep "$FILE_NAME-.*-.*\.tar\.bz2"|cut -d '-' -f3|sort -n|head -n1`
	if [[ $del_file == "" ]];then
		break
	fi
	del_file=`ls|grep "$FILE_NAME-.*-$del_file"`
	echo "[$0]space of output directory is larger than $DIR_LIMIT_SIZE bytes,delete the oldest tar file $del_file" >/dev/kmsg
	rm -rf $del_file

	cursize=`du -sb|awk '{print $1}'`
done
popd >/dev/null

mv $TAR_PKG_NAME $DEST_DIR
rm -rf $TMPFILE

exit 0
