#! /bin/bash
##############################################################################
#    Func Name: ms_service_slave_monitor.sh
# Date Created: 2023-11-07
#       Author: d24819
#  Description: Monitor standby service status
#        usage: ms_service_slave_monitor.sh
#-----------------------------------------------------------------------------
#  Modification History
#  DATE        NAME             DESCRIPTION
##############################################################################

exec 2>&1

CAS_SUCCEED=0
CAS_FAILED=1
ROLE_SLAVE="slave"
CVM_TOMCAT_SERVICE=tomcat
CVM_RABBITMQ_SERVICE=rabbitmq-server
CVM_DOMAIN_SERVICE=domain-server
CVM_PERFORMANCE_SERVICE=performance-monitor-service
CVM_REDIS=redis
CVM_FAILED_SERVER=""

ROLE_FILE="/etc/cmsd/role.identifier"
LOG_FILE="/var/log/cmsd/service_slave.log"
LOCKFILE=/tmp/ms_service_slave_monitor.sh.lock

CUR_LEVEL="INFO"

#######################################################
# log for script
# level print, usage: print level message
########################################################
function print()
{
    local level=${1^^}
    if [ "$level" = "DEBUG" ] && [ "$CUR_LEVEL" != "DEBUG" ] ; then
        return $CAS_SUCCEED;
    fi
    echo "`date -Iseconds` [$level] [MS_SERVICE_SLAVE_MONITOR] ${@:2}" | tee -a $LOG_FILE
}


function read_file() {
    local file=$1
    if [ -f "$file" ]; then
        content=$(cat "$file")
    else
        content=""
    fi

    echo "$content"
}

#######################################################
# check if cvm service status
# @return: CAS_SUCCEED - success; CAS_FAILED - failure
########################################################
check_service_status() {
    local service_name=$1

    service ${service_name} status > /dev/null 2>&1
    if [ $? != 0 ]; then
        return $CAS_FAILED
    else
        return $CAS_SUCCEED
    fi
}

start_service() {
    #check rabbitmq
    check_service_status $CVM_RABBITMQ_SERVICE
    if [ $? -eq $CAS_FAILED ]; then
        service $CVM_RABBITMQ_SERVICE start > /dev/null 2>&1
    fi

    #check redis
    check_service_status $CVM_REDIS
    if [ $? -eq $CAS_FAILED ]; then
        service $CVM_REDIS start > /dev/null 2>&1
    fi

    for service in $@
    do
        service $service start > /dev/null 2>&1
    done
}

# Check whether the peer database can be accessed
check_peer_db() {
    local peer_ip=$1

    eval $(/opt/bin/db-auth.sh -k hzbdbkz1 print)
    python /opt/bin/execute_database_query.pyc $peer_ip $DB_PORT $DB_DATABASE $DB_USER $DB_PASS "select id from tbl_parameter limit 1" > /dev/null 2>&1
    if [ $? -ne 0 ]; then
        return $CAS_FAILED
    fi

    return $CAS_SUCCEED
}

slave_monitor() {
    #check tomcat service status
    check_service_status $CVM_TOMCAT_SERVICE
    if [ $? -ne $CAS_SUCCEED ]; then
        CVM_FAILED_SERVER="${CVM_FAILED_SERVER} $CVM_TOMCAT_SERVICE"
    fi

    #check domain-server service status
    check_service_status $CVM_DOMAIN_SERVICE
    if [ $? -ne $CAS_SUCCEED ]; then
        CVM_FAILED_SERVER="${CVM_FAILED_SERVER} $CVM_DOMAIN_SERVICE"
    fi

    check_service_status $CVM_PERFORMANCE_SERVICE
    if [ $? -ne $CAS_SUCCEED ]; then
        CVM_FAILED_SERVER="${CVM_FAILED_SERVER} $CVM_PERFORMANCE_SERVICE"
    fi

    #tomcat & domain-server & performance-service is normal
    if [ "X${CVM_FAILED_SERVER}" = "X" ]; then
        exit $CAS_SUCCEED
    fi

    #check peer db status
    local _peer_ip=$(/opt/bin/ms_get_peer_ip.sh)
    check_peer_db ${_peer_ip}
    if [ $? -eq $CAS_SUCCEED ]; then
        print error "==== the seasql(ip=${_peer_ip}) status is normal, service(${CVM_FAILED_SERVER}) is abnormal, start them. ===="
        start_service ${CVM_FAILED_SERVER}
        exit $CAS_SUCCEED
    else
        print error "==== the eaesql(ip=${_peer_ip}) && service(${CVM_FAILED_SERVER}) is abnormal. ===="
        exit $CAS_FAILED
    fi

    exit $CAS_SUCCEED
}

#######################################################
# call functions according to operation ignored
# @return: none
########################################################
function main() {
    CUR_LEVEL=${1^^}
    local role=$(read_file $ROLE_FILE)
    print debug "cur role is ${role}"
    if [ "X$role" != "X$ROLE_SLAVE" ]; then
        exit $CAS_SUCCEED
    fi

    if [ -f "$LOCKFILE" ]; then
        print warn "Previous instance of script is still running. Exiting."
        exit $CAS_SUCCEED
    fi
    touch "$LOCKFILE"
    slave_monitor
}

cleanup() {
  rm -f "$LOCKFILE"
}
trap cleanup EXIT

main "$@"