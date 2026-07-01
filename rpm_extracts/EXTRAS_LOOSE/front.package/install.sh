##############################################################################
#    Func Name: install.sh
# Date Created: 2018-6-22
#       Author: mizhanghua
#  Description: install front package(CVM)
#        usage: 1. $0 [$1]
#               $1: install package dir
#       Output:
#       Return: 0  : success
#-----------------------------------------------------------------------------
#  Modification History
#  DATE        NAME             DESCRIPTION
##############################################################################

#front install package dir. not modify this dir.
FRONT_PACKAGE_DIR=$1
if [ "X$FRONT_PACKAGE_DIR" = "X" ]; then
    FRONT_PACKAGE_DIR=$(cd $(dirname $0) && pwd)
else
    FRONT_PACKAGE_DIR=$FRONT_PACKAGE_DIR/front.package
fi
echo "install front dir: $FRONT_PACKAGE_DIR"
#secure feature
backdir="/vms/.casaudit/casfront"
md5file="/etc/cvk/casfront.md5sums"
CVM_ZH_FLAG="/usr/share/cvm/install_cvm"

if [ ! -d /usr/share/cvm ];then
    echo "No front components selected"
    exit 0
fi

# install common packages for front
#echo "install common packages for front"
#rpm -Uvh $FRONT_PACKAGE_DIR/common/pcre2*.rpm

mkdir -p /etc/cvm
ETC_CVK_CVM=/etc/cvk/cvm
mkdir -p ${ETC_CVK_CVM}

#install tomcat
tar -zxf $FRONT_PACKAGE_DIR/tomcat/tomcat.tar.gz -C /var/lib/
mkdir -p /var/log/tomcat
ln -s /var/lib/tomcat/conf /etc/tomcat
if [ -f $CVM_ZH_FLAG ]; then
    cp -f $FRONT_PACKAGE_DIR/tomcat/tomcat.service /usr/lib/systemd/system/
else
    cp -f $FRONT_PACKAGE_DIR/tomcat/tomcat-en.service /usr/lib/systemd/system/tomcat.service
fi
cp -f $FRONT_PACKAGE_DIR/tomcat/cas /etc/default/
#copy jar
#cp -f $FRONT_PACKAGE_DIR/jar/*   /var/lib/tomcat/shared/lib/
#replace tomcat server.xml
#if [ -d "$FRONT_PACKAGE_DIR/cvm/var/lib/uisserver" ]; then
#    cp -f $FRONT_PACKAGE_DIR/tomcat/uis_tomcat_server.xml /var/lib/tomcat/conf/server.xml
#else
cp -f $FRONT_PACKAGE_DIR/tomcat/tomcat_server.xml /var/lib/tomcat/conf/server.xml
cp -f $FRONT_PACKAGE_DIR/tomcat/tomcat_logging.properties /var/lib/tomcat/conf/logging.properties
#fi


cp -f $FRONT_PACKAGE_DIR/tomcat/catalina.properties /var/lib/tomcat/conf/

cp -f $FRONT_PACKAGE_DIR/tomcat/context.xml /var/lib/tomcat/conf/
# some logs still use this cron task to compress
cp -f $FRONT_PACKAGE_DIR/tomcat/tomcat_daily /etc/cron.daily/tomcat
[ -f /etc/cron.daily/tomcat ] && chmod +x /etc/cron.daily/tomcat
cp -f $FRONT_PACKAGE_DIR/tomcat/log/tomcat  /etc/logrotate.d/
# 202101191530
if [ -f $FRONT_PACKAGE_DIR/uiscore/uiscore_daily ]; then
    cp -f $FRONT_PACKAGE_DIR/uiscore/uiscore_daily /etc/cron.daily/uiscore
    chmod +x /etc/cron.daily/uiscore
fi

mkdir -p /opt/tool
tar -zxf $FRONT_PACKAGE_DIR/tomcat/tool.tar.gz -C /opt/

rm -f /var/lib/tomcat/webapps/ROOT/index.html
cp -f $FRONT_PACKAGE_DIR/tomcat/index.jsp   /var/lib/tomcat/webapps/ROOT/
cp -f $FRONT_PACKAGE_DIR/tomcat/404.jsp     /var/lib/tomcat/webapps/ROOT/

# database
db_data_dir="/database/data"
db_log_dir="/var/log/database"
db_config_dir="/etc/database"
db_user="ssadmin"
mkdir $db_config_dir
mkdir -p $db_data_dir
mkdir -p $db_log_dir
rpm -Uvh $FRONT_PACKAGE_DIR/database/seasql*.rpm
rpm -Uvh $FRONT_PACKAGE_DIR/database/python*.rpm
rpm -Uvh $FRONT_PACKAGE_DIR/database/mariadb*.rpm
rpm -Uvh $FRONT_PACKAGE_DIR/database/loader-*.rpm
chown -R $db_user:$db_user $db_data_dir
chown -R $db_user:$db_user $db_log_dir
install -m 644 $FRONT_PACKAGE_DIR/database/db.properties ${ETC_CVK_CVM}
install -m 644 $FRONT_PACKAGE_DIR/database/config $db_config_dir
install -m 644 $FRONT_PACKAGE_DIR/database/pg.conf $db_config_dir
install -m 644 $FRONT_PACKAGE_DIR/database/pg_hba.conf $db_config_dir
install -m 755 $FRONT_PACKAGE_DIR/database/db-auth.sh /opt/bin/
install -m 755 $FRONT_PACKAGE_DIR/database/db_dbg_login.sh /opt/bin/db_dbg_login
install -m 644 $FRONT_PACKAGE_DIR/database/seasql.service /usr/lib/systemd/system/
install -m 644 $FRONT_PACKAGE_DIR/database/database /etc/logrotate.d/
install -m 755 $FRONT_PACKAGE_DIR/database/db-config-hba.sh /opt/bin/
install -m 755 $FRONT_PACKAGE_DIR/database/db-create-user.sh /opt/bin/
su - $db_user -c "echo Pzss@_w0rd > .pw && /usr/local/tos/seasql/bin/initdb -A md5 --pwfile=.pw -D $db_data_dir && rm -f .pw"

# probe
install -m 755 $FRONT_PACKAGE_DIR/probe/*.sh /opt/bin/
install -m 644 $FRONT_PACKAGE_DIR/probe/probe-* /usr/lib/systemd/system/

#CVM
echo "<Components>" > /etc/cas_component_info
if [ -f $CVM_ZH_FLAG ]; then
    echo "    <Language>zh</Language>" >> /etc/cas_component_info
else
    echo "    <Language>en</Language>" >> /etc/cas_component_info
fi
echo "    <CVM>installed</CVM>" >> /etc/cas_component_info
#echo "    <CIC>installed</CIC>" >> /etc/cas_component_info
#echo "    <SSV>installed</SSV>" >> /etc/cas_component_info
echo "</Components>" >> /etc/cas_component_info

cp -f $FRONT_PACKAGE_DIR/cvm/*.war     /var/lib/tomcat/webapps/
#cp -f $FRONT_PACKAGE_DIR/cic/*.war     /var/lib/tomcat/webapps/
#cp -f $FRONT_PACKAGE_DIR/ssv/*.war     /var/lib/tomcat/webapps/
#sed "s/vManager.ip=/vManager.ip=127.0.0.1/g" $FRONT_PACKAGE_DIR/tomcat/ssv > /etc/default/ssv.new
#cp -f /etc/default/ssv.new /etc/default/ssv
cp -f $FRONT_PACKAGE_DIR/cvm/enterprise/ver.xml    /var/lib/tomcat/conf/

if [ ! -d "/var/lib/tomcat/webapps/img" ]; then
    mkdir "/var/lib/tomcat/webapps/img"
fi

#casserver
cp -f $FRONT_PACKAGE_DIR/casserver/casserver.service /usr/lib/systemd/system/

cp -rf $FRONT_PACKAGE_DIR/cvm/var/lib/casserver /var/lib/
cp -f /var/lib/casserver/allconf/server.xml /var/lib/casserver/conf
chmod +x /var/lib/casserver/bin/*.sh
if [ -f $CVM_ZH_FLAG ]; then
    rm -f /var/lib/casserver/bin/setenv_en.sh
else
    mv -f /var/lib/casserver/bin/setenv_en.sh /var/lib/casserver/bin/setenv.sh
fi
if [ ! -d /var/log/casserver ]; then
    mkdir -p /var/log/casserver
fi
cp -f $FRONT_PACKAGE_DIR/casserver/casserver.bootstrap /etc/logrotate.d/
if [ -d /var/lib/casserver/logs ]; then
  rm -rf /var/lib/casserver/logs
fi
ln -s /var/log/casserver /var/lib/casserver/logs
#uisserver
if [ -d "$FRONT_PACKAGE_DIR/cvm/var/lib/uisserver" ]; then
    cp -f $FRONT_PACKAGE_DIR/uisserver/uisserver.service /usr/lib/systemd/system/
    cp -rf $FRONT_PACKAGE_DIR/cvm/var/lib/uisserver /var/lib/
    chmod +x /var/lib/uisserver/bin/*.sh
    if [ -f $CVM_ZH_FLAG ]; then
        rm -f /var/lib/uisserver/bin/setenv_en.sh
    else
        mv -f /var/lib/uisserver/bin/setenv_en.sh /var/lib/uisserver/bin/setenv.sh
    fi
fi

IS_ARM=$(uname -a | grep -i  aarch64)
echo "$IS_ARM"

#vmware-api
if [ -d "$FRONT_PACKAGE_DIR/cvm/var/lib/vmware-api-server" ]; then
    mkdir -p /var/lib/vmware-api-server/script
    cp -f $FRONT_PACKAGE_DIR/cvm/var/lib/vmware-api-server/*  /var/lib/vmware-api-server/script/
    mv /var/lib/vmware-api-server/script/vmware-api-server.jar /var/lib/vmware-api-server/
    mv /var/lib/vmware-api-server/script/vmware-api-server.service /usr/lib/systemd/system/
    #No need for vmware-agent
    if [ ! -z "$IS_ARM" ]; then
        sed -i 's/vmware-agent.service/ /g' /usr/lib/systemd/system/vmware-api-server.service
    fi
    chmod +x /var/lib/vmware-api-server/script/*.sh
    MEM_SIZE=$(free -m | grep 'Mem:' | awk '{print $2}')
    if [ $MEM_SIZE -gt 8192 ]; then
        systemctl daemon-reload && systemctl enable vmware-api-server.service && systemctl restart vmware-api-server.service
    else
        systemctl daemon-reload ; systemctl disable vmware-api-server.service ; systemctl stop vmware-api-server.service
        echo "vmware-api-server stop, mem: $MEM_SIZE" >> /var/log/vmware-api-server.boot
    fi
fi

#mks-proxy
if [ -d "$FRONT_PACKAGE_DIR/cvm/var/lib/mks-proxy" ]; then
    if [ -d "/var/lib/mks-proxy/" ]; then
        systemctl stop mks-proxy
        rm -f /var/lib/mks-proxy/*
    else
        mkdir -p /var/lib/mks-proxy
    fi
    cp -arf $FRONT_PACKAGE_DIR/cvm/var/lib/mks-proxy/*  /var/lib/mks-proxy/

    chmod +x /var/lib/mks-proxy/mks-proxy
    chmod +x /var/lib/mks-proxy/script/*.sh

    mv -f /var/lib/mks-proxy/script/mks-proxy.service /usr/lib/systemd/system/
    systemctl daemon-reload && systemctl enable mks-proxy.service && systemctl restart mks-proxy.service
fi

#aggregator-provider
if [ -d "$FRONT_PACKAGE_DIR/cvm/var/lib/aggregator-provider" ]; then
    if [ -d "/var/lib/aggregator-provider/" ]; then
        systemctl stop aggregator-provider
        rm -f /var/lib/aggregator-provider/*
    else
        mkdir -p /var/lib/aggregator-provider
    fi
    cp -arf $FRONT_PACKAGE_DIR/cvm/var/lib/aggregator-provider/*  /var/lib/aggregator-provider/

    chmod +x /var/lib/aggregator-provider/aggregator-provider
    chmod +x /var/lib/aggregator-provider/script/*.sh

    mv -f /var/lib/aggregator-provider/script/aggregator-provider.service /usr/lib/systemd/system/
    systemctl daemon-reload && systemctl enable aggregator-provider.service && systemctl restart aggregator-provider.service
fi


#uis-core related.
if [ -d $FRONT_PACKAGE_DIR/cvm/var/lib/uis-core/ ]; then
    chmod +x $FRONT_PACKAGE_DIR/cvm/var/lib/uis-core/script/*.sh
    cp -rf $FRONT_PACKAGE_DIR/cvm/var/lib/uis-core/ /var/lib/
    cp -f /var/lib/uis-core/script/uis-core.service /usr/lib/systemd/system/
    systemctl daemon-reload && systemctl enable uis-core.service
fi

#auth-center
if [ -d "$FRONT_PACKAGE_DIR/cvm/var/lib/auth-center" ]; then
    cp -f $FRONT_PACKAGE_DIR/cvm/var/lib/auth-center/script/auth-center.service /usr/lib/systemd/system/
    cp -rf $FRONT_PACKAGE_DIR/cvm/var/lib/auth-center /var/lib/
    chmod +x /var/lib/auth-center/script/*.sh
fi

#glance
cp -f $FRONT_PACKAGE_DIR/glance/cas_glance.pyc /opt/bin
chmod +x /opt/bin/cas_glance.pyc
pip3 install $FRONT_PACKAGE_DIR/glance/cas_glance.tar.gz


#rabbitmq
rpm -ivh $FRONT_PACKAGE_DIR/rabbitmq/*.rpm
cp -f $FRONT_PACKAGE_DIR/rabbitmq/rabbitmq-env.conf /etc/rabbitmq/
cp -f $FRONT_PACKAGE_DIR/rabbitmq/trustStore /etc/rabbitmq/
cp -f $FRONT_PACKAGE_DIR/rabbitmq/rabbitmq.config /etc/rabbitmq/
cp -rf $FRONT_PACKAGE_DIR/rabbitmq/ca /etc/rabbitmq/
cp -rf $FRONT_PACKAGE_DIR/rabbitmq/client /etc/rabbitmq/
cp -rf $FRONT_PACKAGE_DIR/rabbitmq/server /etc/rabbitmq/
chmod a+x /etc/rabbitmq/ca/
chmod a+x /etc/rabbitmq/client/
chmod a+x /etc/rabbitmq/server/
chmod a+r /etc/rabbitmq/rabbitmq-env.conf
chmod a+r /etc/rabbitmq/rabbitmq.config
chmod a+r /etc/rabbitmq/trustStore
chmod a+r /etc/rabbitmq/ca/*
chmod a+r /etc/rabbitmq/client/*
chmod a+r /etc/rabbitmq/server/*
cp -f $FRONT_PACKAGE_DIR/rabbitmq/rabbitmq-server  /etc/logrotate.d/

#if [ -d $FRONT_PACKAGE_DIR/acesure ]; then
#    if [ ! -f $FRONT_PACKAGE_DIR/acesure/uis.cfg ]; then
#        #acesure install for cas.
#        # bash $FRONT_PACKAGE_DIR/acesure/install.sh
#        # not install movesure, but keep its package under /vms/component
#        component_dir="/vms/component"
#        movesure_dir="$FRONT_PACKAGE_DIR/acesure/movesure"
#        [ ! -d "$component_dir" ] || mkdir -p "$component_dir"
#        if [ -d "$movesure_dir" ]; then
#            package_file_name=$(ls $movesure_dir/*.rpm | xargs basename -s .rpm)
#            if [ ! -d "$component_dir/$package_file_name" ]; then
#                mkdir -p "$component_dir/$package_file_name"
#                mv $movesure_dir/* $component_dir/$package_file_name/
#            fi
#        fi
#    else
#        #acesure install for uis.
#        PACKAGE_PATH="/var/lib/.acesure.package/"
#        rm -rf $PACKAGE_PATH && mkdir -p $PACKAGE_PATH
#        cp -rf $FRONT_PACKAGE_DIR/acesure/* $PACKAGE_PATH
#        cp -rf $FRONT_PACKAGE_DIR/firstboot/acesure/* $PACKAGE_PATH
#        rm -rf $FRONT_PACKAGE_DIR/firstboot/acesure/
#    fi
#fi

#license client
if [ -d $FRONT_PACKAGE_DIR/license_client/ ]; then
    if [ ! -d $FRONT_PACKAGE_DIR/cvm/var/lib/uis-core/ ]; then
        cp -f $FRONT_PACKAGE_DIR/license_client/license_client.conf /etc/
    fi
    cp -f $FRONT_PACKAGE_DIR/license_client/license_client.setting /etc/
    cp -f $FRONT_PACKAGE_DIR/license_client/LicCliEnc.class /opt/tool/
    rpm -ivh $FRONT_PACKAGE_DIR/license_client/*.rpm
    if [ -d /opt/LicClient/tools ]; then
        cp -f $FRONT_PACKAGE_DIR/license_client/PwdEncodeUtil.jar /opt/LicClient/tools
    fi
fi

#kmip-client
if [ -d $FRONT_PACKAGE_DIR/kmip-client/ ]; then
   if [ -d /var/lib/kmip-client/ ];then
       rm -rf /var/lib/kmip-client/
   fi
   mkdir -p /var/lib/kmip-client/
   mkdir -p /var/lib/kmip-client/script/
   cp -f $FRONT_PACKAGE_DIR/kmip-client/kmip-client /var/lib/kmip-client/
   chmod +x /var/lib/kmip-client/kmip-client
   cp -f $FRONT_PACKAGE_DIR/kmip-client/kmip-client.sh /var/lib/kmip-client/script/
   chmod +x /var/lib/kmip-client/script/kmip-client.sh
   cp -f $FRONT_PACKAGE_DIR/kmip-client/kmip-client.service /usr/lib/systemd/system
   systemctl daemon-reload && systemctl enable kmip-client.service
fi

# nginx
if [ -d $FRONT_PACKAGE_DIR/nginx/ ]; then
    rpm -ivh $FRONT_PACKAGE_DIR/nginx/*.rpm
    if [ ! -d /etc/nginx ]; then
        mkdir /etc/nginx
    fi
    if [ ! -d /etc/nginx/conf.d ]; then
        mkdir /etc/nginx/conf.d
    fi
    cp $FRONT_PACKAGE_DIR/nginx/nginx.crt /etc/nginx/conf.d/
    cp $FRONT_PACKAGE_DIR/nginx/nginx.key /etc/nginx/conf.d/
    cp $FRONT_PACKAGE_DIR/nginx/nginx.conf.80.and.443 /etc/nginx/
    cp $FRONT_PACKAGE_DIR/nginx/nginx.conf.443 /etc/nginx/
    cp $FRONT_PACKAGE_DIR/nginx/nginx.conf.80.and.443 /etc/nginx/nginx.conf
    cp $FRONT_PACKAGE_DIR/nginx/nginx.conf.container /etc/nginx/nginx.conf.container
    if [ -d $FRONT_PACKAGE_DIR/cvm/var/lib/uis-core/ ]; then
        cp $FRONT_PACKAGE_DIR/nginx/nginx.conf.uis /etc/nginx/
        cp -f $FRONT_PACKAGE_DIR/nginx/nginx.conf.uis /etc/nginx/nginx.conf
    fi
    nginx -s reload &> /dev/null
    cp -f $FRONT_PACKAGE_DIR/nginx/nginx  /etc/logrotate.d/
fi

# clickhouse
if [ -d $FRONT_PACKAGE_DIR/clickhouse/ ]; then
    yum install -y $FRONT_PACKAGE_DIR/clickhouse/clickhouse-common-static-*.rpm
    yum install -y $FRONT_PACKAGE_DIR/clickhouse/clickhouse-client-*.rpm
    yum install -y $FRONT_PACKAGE_DIR/clickhouse/clickhouse-server-*.rpm
    if [ ! -d /etc/clickhouse-server ]; then
        mkdir /etc/clickhouse-server
    fi
    if [ ! -d /etc/clickhouse-server/config.d ]; then
        mkdir /etc/clickhouse-server/config.d
    fi
    if [ ! -d /etc/clickhouse-server/users.d ]; then
        mkdir /etc/clickhouse-server/users.d
    fi
    install -m 644 $FRONT_PACKAGE_DIR/clickhouse/clickhouse.properties ${ETC_CVK_CVM}
    cp -f $FRONT_PACKAGE_DIR/clickhouse/config.xml /etc/clickhouse-server/
    cp -f $FRONT_PACKAGE_DIR/clickhouse/users.xml /etc/clickhouse-server/
    install -m 444 $FRONT_PACKAGE_DIR/clickhouse/config.d/config.xml /etc/clickhouse-server/config.d/
    install -m 444 $FRONT_PACKAGE_DIR/clickhouse/config.d/config_stable.xml /etc/clickhouse-server/config.d/
    install -m 444 $FRONT_PACKAGE_DIR/clickhouse/users.d/default-password.xml /etc/clickhouse-server/users.d/
    cp -f $FRONT_PACKAGE_DIR/clickhouse/clickhouse  /etc/logrotate.d/
    chmod 750 /var/log/clickhouse-server
    if [ ! -f /etc/sudoers.d/nolog_cmds ]; then
        touch /etc/sudoers.d/nolog_cmds
        chmod 440 /etc/sudoers.d/nolog_cmds
    fi
    if ! grep -q "/usr/bin/clickhouse-client" /etc/sudoers.d/nolog_cmds; then
        echo "Cmnd_Alias NOLOG_CMDS = /usr/bin/clickhouse-client" >> /etc/sudoers.d/nolog_cmds
        echo "Defaults!NOLOG_CMDS !syslog" >> /etc/sudoers.d/nolog_cmds
    fi
fi

# kafka
install -m 644 $FRONT_PACKAGE_DIR/kafka/kafka.properties ${ETC_CVK_CVM}


# redis
install -m 644 $FRONT_PACKAGE_DIR/redis/redis.properties ${ETC_CVK_CVM}
if [ -d $FRONT_PACKAGE_DIR/redis/ ]; then
    rpm -ivh $FRONT_PACKAGE_DIR/redis/*.rpm
    if [ ! -d /etc/redis ]; then
        mkdir /etc/redis
    fi
    cp $FRONT_PACKAGE_DIR/redis/*.conf /etc/redis/
    cp -f $FRONT_PACKAGE_DIR/redis/redis  /etc/logrotate.d/
fi
# datasafe logrotate
cp -f $FRONT_PACKAGE_DIR/datasafe/datasafe  /etc/logrotate.d/
if [ ! -d /var/log/datasafe ]; then
    mkdir -p /var/log/datasafe
fi

# vue
if [ -f $FRONT_PACKAGE_DIR/vue.tar.gz ]; then
    if [ ! -d /usr/share/nginx ]; then
        mkdir -p /usr/share/nginx
    fi
    rm -rf /usr/share/nginx/dist
    rm -rf /usr/share/nginx/kaas
    tar xzf $FRONT_PACKAGE_DIR/vue.tar.gz -C /usr/share/nginx
fi

#baremetal
if [ -d $FRONT_PACKAGE_DIR/bareMetal ]; then
    if [ ! -d /var/lib/bare-metal-server ]; then
        mkdir -p /var/lib/bare-metal-server
    fi
    rm -rf /var/lib/bare-metal-server/bare-metal-server.jar
    bash $FRONT_PACKAGE_DIR/bareMetal/install.sh
    # pxe.log logroate
    cp -f $FRONT_PACKAGE_DIR/baremetal/baremetal  /etc/logrotate.d
fi
#performance
if [ -d $FRONT_PACKAGE_DIR/performanceMonitor ]; then
    if [ ! -d /var/lib/performance-monitor-service ]; then
        mkdir -p /var/lib/performance-monitor-service
    fi
    rm -rf /var/lib/performance-monitor-service/performance-monitor-service.jar
    bash $FRONT_PACKAGE_DIR/performanceMonitor/install.sh
fi
#domain-server
if [ -d $FRONT_PACKAGE_DIR/domain-server ]; then
    if [ ! -d /var/lib/domain-server ]; then
        mkdir -p /var/lib/domain-server
    fi
    rm -rf /var/lib/domain-server/domain-server.jar
    bash $FRONT_PACKAGE_DIR/domain-server/install.sh
fi

bash $FRONT_PACKAGE_DIR/common-install.sh

echo "* *    * * *   root    /opt/bin/tomcat_check.sh" >> /etc/crontab
#special ntp conf in CVM host
echo "fudge 127.127.1.0 stratum 8" >> /etc/ntp.conf
echo "server 127.127.1.0" >> /etc/ntp.conf

#back up the installation package
mkdir -p $backdir
cp /var/lib/tomcat/webapps/*.war ${backdir}/
rm -f $md5file
for webwar in $(find /var/lib/tomcat/webapps/ -name *.war)
do
    md5sum $webwar >>$md5file
done

# Install components from other modules
for d in $(ls $FRONT_PACKAGE_DIR/other); do
    if [ -d $FRONT_PACKAGE_DIR/other/$d ]; then
        ( cd $FRONT_PACKAGE_DIR/other/$d && bash install.sh )
        if [ $? -ne 0 ]; then
            echo "error: module $d installation failed"
        fi
        if [ -f $FRONT_PACKAGE_DIR/other/$d/first_boot.sh ]; then
            mkdir -p $FRONT_PACKAGE_DIR/firstboot/other/$d
            cp -f $FRONT_PACKAGE_DIR/other/$d/first_boot.sh \
                $FRONT_PACKAGE_DIR/firstboot/other/$d
        fi
    fi
done

exit 0
