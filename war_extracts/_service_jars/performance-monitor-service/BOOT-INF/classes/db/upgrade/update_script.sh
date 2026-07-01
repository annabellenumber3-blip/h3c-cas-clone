#! /bin/sh

echo "Begin to update clickhouse database and data..."


# mysql data file path
PARA_INSTALLER_TEMP_DIR=$1
export PARA_INSTALLER_TEMP_DIR

PARA_INSTALLER_UPGRADE_TEMP_DIR=$PARA_INSTALLER_TEMP_DIR"/upgrade"
export PARA_INSTALLER_UPGRADE_TEMP_DIR

PARA_INSTALLER_CLICKHOUSE_TEMP_DIR=$PARA_INSTALLER_TEMP_DIR"/clickhouse"
export PARA_INSTALLER_CLICKHOUSE_TEMP_DIR

#CAS user name
PARA_CAS_USER_NAME=default
export PARA_CAS_USER_NAME

#CAS user password
#PARA_CAS_USER_PASSWORD=test1
PARA_CAS_USER_PASSWORD=Pzss@_w0rd
export PARA_CAS_USER_PASSWORD

# CAS lang   ${LANGUAGE}
# set PARA_CAS_LANG=zh
PARA_CAS_LANG=zh
if [ -e /etc/cas_component_info ] ; then
	if [ "X$(grep '<Language>en</Language>' /etc/cas_component_info)" != "X" ] ; then
		PARA_CAS_LANG=en
	fi
fi
export PARA_CAS_LANG

echo $PARA_CAS_LANG

#CAS version
#PARA_CAS_VERSION=V1.0 E0101
PARA_CAS_VERSION=$2
export PARA_CAS_VERSION

echo $PARA_CAS_VERSION.

# ****************************** 执行升级sql前，数据库前置处理***********************

state=1

while [ $state -eq 1 ]
do
    case $PARA_CAS_VERSION in
    "V7.0 E0782")

		      echo  Begin to exec E0782-E0782L01 script...

			    clickhouse-client --password $PARA_CAS_USER_PASSWORD --multiquery < $PARA_INSTALLER_UPGRADE_TEMP_DIR/E0782-E0782L01/upgrade_script_cvm.sql
			      EXIT_CODE=$? ; if [ $EXIT_CODE -gt 0 ] ; then  exit $EXIT_CODE ; fi
		      echo     End to exec E0782-E0782L01 script...

		    PARA_CAS_VERSION="V7.0 E0782L01"
		    ;;
    "V7.0 E0782L01" | "V7.0 E0782P02")

		      echo  Begin to exec E0782L01-E0783 script...

			    clickhouse-client --password $PARA_CAS_USER_PASSWORD --multiquery < $PARA_INSTALLER_UPGRADE_TEMP_DIR/E0782L01-E0783/upgrade_script_cvm.sql
			      EXIT_CODE=$? ; if [ $EXIT_CODE -gt 0 ] ; then  exit $EXIT_CODE ; fi
		      echo     End to exec E0782L01-E0783 script...

		    PARA_CAS_VERSION="V7.0 E0783"
		    state=0
		    ;;			
    *)
        state=0
        ;;
    esac
done

		echo  Begin to exec CI  script...
        clickhouse-client --password $PARA_CAS_USER_PASSWORD --multiquery < $PARA_INSTALLER_UPGRADE_TEMP_DIR/CI/upgrade_scrip.sql
        EXIT_CODE=$? ; if [ $EXIT_CODE -gt 0 ] ; then  exit $EXIT_CODE ; fi

    echo  End to exec CI script...

    echo  Begin to exec update materialized view  script...

        clickhouse-client --password $PARA_CAS_USER_PASSWORD --multiquery < $PARA_INSTALLER_CLICKHOUSE_TEMP_DIR/update_materialized_view.sql
        EXIT_CODE=$? ; if [ $EXIT_CODE -gt 0 ] ; then  exit $EXIT_CODE ; fi

    echo  End to exec update materialized view script...

echo The update of clickhouse database finished successfully, thanks.

