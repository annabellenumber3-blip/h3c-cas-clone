#!/bin/bash

VMWARE_AGENT_DIR="/var/lib/vmware-agent"

funcVMwareAgent() {
    echo "Begin to install VMware Agent module..."
    if [ ! -d  ${VMWARE_AGENT_DIR}/script ]; then
        mkdir -p ${VMWARE_AGENT_DIR}/script
    fi
    cp -f vmware-agent/vmware-agent.jar ${VMWARE_AGENT_DIR}
    cp -f vmware-agent/script/init_service.sh ${VMWARE_AGENT_DIR}/script
    cp -f vmware-agent/script/vmware-agent.sh ${VMWARE_AGENT_DIR}/script
    cp -f vmware-agent/script/vmware-agent.service /usr/lib/systemd/system
    chmod 755 ${VMWARE_AGENT_DIR}/script/init_service.sh
    chmod 755 ${VMWARE_AGENT_DIR}/script/vmware-agent.sh
    echo "finish to copy VMware Agent file ..."
    systemctl daemon-reload
    systemctl enable vmware-agent.service
    systemctl start vmware-agent.service
    echo "finish to install VMware Agent module..."
}

cd $(dirname $0)

DISTRI=$(/opt/bin/os_lsb_release -is)
funcVMwareAgent

