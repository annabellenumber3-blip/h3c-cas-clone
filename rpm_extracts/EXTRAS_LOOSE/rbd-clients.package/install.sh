#!/bin/bash

cd $(dirname $0)

INSTALL_DIR="/vms/.ms_backup/rbd-client"
# set the default install client, warning ! do not delete the comment
DEFAULT_CLIENT="opensrc"
CLIENTS="opensrc onestor xsky boke"

# backup the installed.txt
[ -f $INSTALL_DIR/installed.txt ] && cp -f $INSTALL_DIR/installed.txt .

rm -rf $INSTALL_DIR && mkdir -p $INSTALL_DIR

for client in $CLIENTS;
do
    if [ -d $client ]; then
        cp -rf $client $INSTALL_DIR/
        [ -f librbdagent${client}.so.1 ] && cp -f librbdagent${client}.so.1 $INSTALL_DIR/$client/librbdagent.so.1
        [ -f rbdagent${client}*.rpm ] && cp -f rbdagent${client}*.rpm $INSTALL_DIR/$client/
    else
        echo "client $client not exists"
    fi
done

install -m 755 rbd-clients.sh /opt/bin/

[ -f installed.txt ] && cp -f installed.txt $INSTALL_DIR/

# install the default client, warning ! do not delete the comment
[ ! -f $INSTALL_DIR/installed.txt ] && bash /opt/bin/rbd-clients.sh install $DEFAULT_CLIENT

