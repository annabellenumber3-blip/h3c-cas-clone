#! /bin/bash

# zip install/upgrade package into one file: cvk-agent-api.tar.gz
# this script will be renamed to install.sh/upgrade.sh after building iso
CVK_AGENT_PACKAGE="cvk-agent-api.tar.gz"
CVK_AGENT_PACKAGE_730="cvk-agent-api-E0730.tar.gz"
CVK_AGENT_PACKAGE_760="cvk-agent-api-E0760.tar.gz"

cd $(dirname $0)
script_name=$(basename $0)
echo "INFO: execute: $script_name"
if [ -f "$CVK_AGENT_PACKAGE" ]; then
    tar -zxf "$CVK_AGENT_PACKAGE"
    ./cvk-agent.package/$script_name
    cp -f "$CVK_AGENT_PACKAGE" /var/lib/cvk-agent/
    if [ -f "$CVK_AGENT_PACKAGE_730" ]; then
        echo "cp $CVK_AGENT_PACKAGE_730"
        cp -f "$CVK_AGENT_PACKAGE_730" /var/lib/cvk-agent/
    fi
    if [ -f "$CVK_AGENT_PACKAGE_760" ]; then
        echo "cp $CVK_AGENT_PACKAGE_760"
        cp -f "$CVK_AGENT_PACKAGE_760" /var/lib/cvk-agent/
    fi
else
    echo "ERROR: AGENT_PACKAGE not exist!"
fi