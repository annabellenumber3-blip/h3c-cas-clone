#!/bin/bash
#After hot patch installation/uninstallation, restart tomcat

LOG_FILE_PREFIX="/var/log/patch"

# level print, usage: print level message
function print() {
    local level=${1^^}
    echo "`date -Iseconds` [$level] ${@:2}" 1>&2
}

mkdir -p $LOG_FILE_PREFIX

#unpack package.tar.gz for vue
NGINX_DIR=/usr/share/nginx
if [ -f $NGINX_DIR/vue.tar.gz ]; then
    print info "start update vue"
    rm -rf $NGINX_DIR/dist
    rm -rf $NGINX_DIR/kaas
    tar xzf $NGINX_DIR/vue.tar.gz -C $NGINX_DIR
    rm -rf $NGINX_DIR/vue.tar.gz
    print info "finish update vue"
fi

# delete cas dir and unpack cas.war manually
TOMCAT_WEBAPPS_DIR=/var/lib/tomcat/webapps
if [ -f $TOMCAT_WEBAPPS_DIR/cas.war ]; then
    print info "start update cas dir"
    service tomcat stop
    rm -rf $TOMCAT_WEBAPPS_DIR/cas
    unzip -oq $TOMCAT_WEBAPPS_DIR/cas.war -d $TOMCAT_WEBAPPS_DIR/cas
    print info "finish update cas dir"
fi

#restart tomcat
print info "start restart tomcat"
if [ $(/opt/bin/ms_info.sh hotbackup) = "1" ]; then
    /opt/bin/ms_service_restart_tomcat.sh
else
    service tomcat restart
fi
print info "finish restart tomcat"
