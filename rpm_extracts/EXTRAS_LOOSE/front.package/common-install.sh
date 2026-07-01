#!/bin/bash

cd $(dirname $0)

install -m 755 future.pyc /opt/bin/
install -m 755 uninstall-front.sh /opt/bin/
install -m 755 hotpatch_restart_tomcat.sh /opt/bin/
install -m 755 ms_service_slave_monitor.sh /opt/bin/