#!/bin/bash

cd $(dirname $0)

if [ ! -f /usr/lib64/libncurses.so.5 ]; then
    cp libncurses.so.5 /usr/lib64/
fi
if [ ! -f /usr/lib64/libsystemd-daemon.so.0 ]; then
    cp libsystemd-daemon.so.0 /usr/lib64/
fi

# fresh install
if ! rpm -q --quiet movesure-server; then
    rpm -Uvh --nodeps movesure-server-*.rpm
fi
[ ! -f /usr/local/movesure/6.0/server/script/movesureservice ] && exit 1

install -m 644 movesure.service /usr/lib/systemd/system/
systemctl daemon-reload
[ ! -f /etc/drbd.d/r0.res ] && systemctl enable movesure.service

mv /usr/local/movesure/6.0/server/script/movesureservice /usr/local/movesure/6.0/server/script/movesureservice_back
cp ./movesureservice /usr/local/movesure/6.0/server/script/movesureservice

exit 0
