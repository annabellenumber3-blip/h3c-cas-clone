#!/bin/bash

cd $(dirname $0)
MAX_RETRY=10

# get management ip of cvm
management_ip=$(python /opt/bin/netcfgtool.pyc get --name=vswitch0 | grep ipv4 | awk -F "[=,/,']" '{print $3}')
[ -z $management_ip ] && management_ip=$(python /opt/bin/netcfgtool.pyc get --name=vswitch0 | grep ipv6 | awk -F "[=,/,']" '{print $3}')
if [ -z $management_ip ]; then
    echo "[ERROR] null management IP"
    exit 1
fi
sed "s/__MANAGEMENT_IP__/$management_ip/g" init.json.in > init.json

# movesure server initialization
# check and start movesure server if needed
if movesureservice status | grep -q "Stop"; then
    echo "[INFO] movesure service stopped, restarting..."
    if ! movesureservice start; then
        echo "[ERROR] starting movesure service failed"
        exit 1
    fi
    echo "[INFO] starting movesure service succeeded"
fi

# wait for the url being accessible
retry=0
while ! curl http://127.0.0.1:9981; do
    let retry++
    echo "[INFO] Access failed for the $retry time."
    if [ $retry -lt $MAX_RETRY ]; then
        echo "[INFO] Retrying in 10s..."
        sleep 10
    else
        echo "[ERROR] Max retry time reached, abort."
        exit 1
    fi
done
echo "[INFO] Access succeeded."

retry=0
while [ $retry -lt $MAX_RETRY ]; do
    result=`curl -X PUT -d @init.json --header "Content-Type:application/json" http://127.0.0.1:9981/cdap/v2.0/init/start 2>/dev/null`
    echo "[INFO] return: $result"
    if grep -q '"info":true' <<<$result; then
        echo "[INFO] movesure service initialization succeeded"
        break
    fi
    if grep '"info":null' <<<$result | grep -q '"code":30404'; then
        echo "[INFO] movesure service already initialized."
        break
    fi
    echo "[ERROR] movesure service initialization failed"
    let retry++
    sleep 2
    echo "[INFO] retrying for $retry time..."
done

# dectect cas language
lang_en=`grep "<Language>en</Language>" /etc/cas_component_info`
if [ -z "$lang_en" ]; then
    locale="zh-CN"
else
    locale="en-US"
fi
echo "[INFO] dectected cas language $locale"

retry=0
while [ $retry -lt $MAX_RETRY ]; do
    echo "[INFO] setting language..."
    result=`curl -X POST -d "{\"locale\":\"$locale\"}" --header "Content-Type:application/json" http://127.0.0.1:9981/cdap/v2.0/languages/switch 2>/dev/null`
    echo "[INFO] return: $result"
    if grep -q '"code":30000' <<<$result; then
        echo "[INFO] setting language succeeded"
        break
    fi
    echo "[ERROR] setting language failed"
    let retry++
    sleep 2
    echo "[INFO] retrying for $retry time..."
done
