#!/bin/bash

# uis product disable this script
if [ -d /var/lib/uis-core -o -f /var/lib/tomcat/webapps/uis.war ]; then
	exit 0
fi

# This script removes cvm components that were installed when installed with front components.

# helper function for package removal using rpm or dpkg
function wrapped() {
    which $1 &>/dev/null && "$@" 2>&1 | grep -v -e "not installed" -e "no installed" -e "No such file or directory"
}

DISTRI=$(/opt/bin/os_lsb_release -is)

# backup
backdir="/vms/.casaudit/casfront"
md5file="/etc/cvk/casfront.md5sums"
rm -rf $md5file
rm -rf $backdir

# install flags
rm -rf /etc/cas_component_info /etc/cas_cvm-version
wrapped rpm  -e cvm cvm-english

# iptable rules
sed -i '\#iptables-restore < /etc/cvm/iptables.roles#d' /etc/rc.local
if [ -f /opt/bin/virt-rc-local ]; then
    sed -i '\#iptables-restore < /etc/cvm/iptables.roles#d' /opt/bin/virt-rc-local
fi
rm -rf /etc/cvm/iptables.roles

# license client
wrapped dpkg -P license-client
wrapped rpm  -e license-client
rm -rf /etc/license_client.conf
rm -rf /etc/license_client.setting
# a bug in postrm which creates `1` in current dir
rm -rf 1

# nginx
wrapped dpkg -P nginx
wrapped rpm -e --nodeps nginx
wrapped rpm -e --nodeps nginx-all-modules
wrapped rpm -e --nodeps nginx-filesystem
wrapped rpm -e --nodeps nginx-mod-http-image-filter
wrapped rpm -e --nodeps nginx-mod-http-perl
wrapped rpm -e --nodeps nginx-mod-http-xslt-filter
wrapped rpm -e --nodeps nginx-mod-mail
wrapped rpm -e --nodeps nginx-mod-stream
wrapped rpm -e gperftools-libs gd libXpm
rm -rf /etc/nginx
rm -rf /usr/share/nginx

# clickhouse
wrapped yum remove -y clickhouse-client.*
wrapped yum remove -y clickhouse-common-static.*
wrapped yum remove -y clickhouse-server.*
rm -rf /etc/clickhouse-server
rm -rf /var/lib/clickhouse
rm -rf /etc/clickhouse-client


# rabbitmq
wrapped dpkg -P erlang-asn1 erlang-base erlang-corba erlang-crypto erlang-dev erlang-diameter erlang-docbuilder \
                erlang-edoc erlang-erl-docgen erlang-eunit erlang-ic erlang-inets erlang-inviso erlang-mnesia \
                erlang-nox erlang-odbc erlang-os-mon erlang-parsetools erlang-percept erlang-public-key \
                erlang-runtime-tools erlang-snmp erlang-ssh erlang-ssl erlang-syntax-tools erlang-tools \
                erlang-webtool erlang-xmerl libodbc1 rabbitmq-server

wrapped rpm  -e erlang-asn1 erlang-compiler erlang-crypto erlang-erts erlang-hipe erlang-inets erlang-kernel \
                erlang-mnesia erlang-os_mon erlang-otp_mibs erlang-public_key erlang-runtime_tools erlang-sasl \
                erlang-sd_notify erlang-snmp erlang-ssl erlang-stdlib erlang-syntax_tools erlang-tools \
                erlang-xmerl rabbitmq-server
rm -rf /etc/rabbitmq

# uninstall domain-server (domain-server only installed on centos)
systemctl stop domain-server
systemctl disable domain-server
rm -rf /var/lib/domain-server
rm -f /usr/lib/systemd/system/domain-server.service
rm -rf /var/log/domain-server

# uninstall redis
wrapped rpm -e redis
wrapped rpm -e jemalloc
rm -rf /etc/redis


# acesure
wrapped dpkg -P cdap-server
wrapped dpkg -P movesure-server
wrapped rpm  -e cdap-server
wrapped rpm  -e movesure-server

# tomcat
rm -rf /etc/tomcat
rm -rf /etc/default/cas
wrapped systemctl stop tomcat.service
wrapped systemctl disable tomcat.service
rm -rf /usr/lib/systemd/system/tomcat.service
wrapped systemctl daemon-reload
wrapped dpkg -P libecj-java libjna-java libservlet3.1-java libtomcat6-java libtomcat8-java tomcat6 tomcat6-admin \
                tomcat6-common tomcat6-docs tomcat6-examples tomcat6-user tomcat8 tomcat8-common
rm -rf /var/lib/tomcat
rm -rf /usr/share/tomcat
rm -rf /opt/tool

# tomcat 8
rm -rf /etc/tomcat8
wrapped systemctl stop tomcat8.service
wrapped systemctl disable tomcat8.service
rm -rf /usr/lib/systemd/system/tomcat8.service
wrapped systemctl daemon-reload
rm -rf /var/lib/tomcat8
rm -rf /usr/share/tomcat8

# casserver
service casserver stop
wrapped update-rc.d -f casserver remove
rm -rf /etc/init.d/casserver
wrapped systemctl disable casserver.service
rm -rf /usr/lib/systemd/system/casserver.service
wrapped systemctl daemon-reload
rm -rf /var/lib/casserver

# vmware-api-server
pid=$(ps -ef | grep "java -jar" | grep "/var/lib/vmware-api-server" | awk '{print $2}')
if [ "X$pid" != "X" ]; then
    if [ "$DISTRI" = "CentOS" ] || [ "$DISTRI" = "H3Linux" ];then
        systemctl stop vmware-api-server.service
        systemctl disable vmware-api-server.service
    else
        service vmware-api-server stop
        update-rc.d -f vmware-api-server remove
        is_exist=$(grep "/opt/bin/vmware_api_server_check.sh" /etc/crontab)
        if [ "X$is_exist" != "X" ]; then
            sed -i '/vmware_api_server_check.sh/d' /etc/crontab
        fi
    fi
fi


# bare-metal-server
pid=$(ps -ef | grep "java -jar" | grep "/var/lib/bare-metal-server" | awk '{print $2}')
if [ "X$pid" != "X" ]; then
    if [ "$DISTRI" = "CentOS" ] || [ "$DISTRI" = "H3Linux" ];then
        systemctl stop bare-metal-server.service
        systemctl disable bare-metal-server.service
    else
        service bare-metal-server stop
        update-rc.d -f bare-metal-server remove
    fi
fi

# glance
rm -rf /opt/bin/cas_glance.pyc
wrapped dpkg -P glance-client glance-common libapr1 libaprutil1 libdb4.8 libjs-sphinxdoc libjs-underscore libneon27-gnutls \
                libsvn1 python-amqplib python-anyjson python-dateutil python-decorator python-formencode \
                python-glance python-iso8601 python-kombu python-migrate python-openid python-paste python-pastedeploy \
                python-pastescript python-routes python-scgi python-tempita python-xattr subversion
rm -rf /usr/lib/python2.7/site-packages/cas_glance-1.0-py2.7.egg/

# fonts
wrapped dpkg -P libaa1 libggi2 libggi-target-x libgii1 libgii1-target-x libpth20 libsvga1 libx86-1 libxxf86dga1 \
                unicon-imc2 zhcon

# database
wrapped debconf-set-selections <<<"mysql-community-server mysql-community-server/remove-data-dir boolean true"
wrapped dpkg -P mysql-server mysql-community-server mysql-client mysql-community-client
wrapped rpm -e MariaDB-server galera-4 perl-DBD-MySQL
wrapped rpm -e seasql seasql-server seasql-contrib seasql-libs
rm -rf /etc/database/
rm -rf /etc/init.d/mysql
rm -rf /usr/share/mysql/mysql-helpers
rm -rf /etc/my.cnf.d/server.cnf
rm -rf /etc/cvm/mysql.properties
rm -rf /etc/cvm/db.properties
rm -rf /opt/bin/mysql-auth.sh
rm -rf /opt/bin/db-auth.sh
rm -rf /opt/bin/db-config-hba.sh
rm -rf /opt/bin/db-create-user.sh

#common
rm -rf /opt/bin/future.pyc
rm -rf /opt/bin/hotpatch_restart_tomcat.sh
rm -rf /opt/bin/ms_service_slave_monitor.sh
rm -rf /opt/bin/uninstall-front.sh


#performance-monitor
wrapped systemctl stop performance-monitor-service.service
wrapped systemctl disable performance-monitor-service.service
rm -rf /var/lib/performance-monitor-service
rm -f /usr/lib/systemd/system/performance-monitor-service.service
rm -rf /var/log/performance-monitor-service

# clickhouse
wrapped systemctl stop clickhouse-server.service
wrapped systemctl disable clickhouse-server.service
wrapped yum remove -y clickhouse-client.*
wrapped yum remove -y clickhouse-common-static.*
wrapped yum remove -y clickhouse-server.*
rm -rf /etc/clickhouse-server
rm -rf /var/lib/clickhouse
rm -rf /etc/clickhouse-client
rm -rf /etc/cvm/clickhouse.properties

