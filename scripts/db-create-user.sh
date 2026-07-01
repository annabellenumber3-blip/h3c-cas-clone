#!/bin/bash
# create read-only user $1(ssadmin_ro)

#only read user
ONLY_READ_USER=$1

# assign read-only permissions
function grant_select() {
    _ALL_DATABASE=$(python /opt/bin/execute_database_query.pyc $DB_HOST $DB_PORT $DB_DATABASE $DB_USER $DB_PASS "SELECT datname FROM pg_database WHERE datistemplate = false and datname !='seasql';")
    # Modify the default user mode to connect to the database instance in read-only mode
    db_free -c "ALTER USER ${ONLY_READ_USER} SET DEFAULT_TRANSACTION_READ_ONLY = on;"
    if [ $? -ne 0 ]; then
        echo "[ERROR] alter user ${ONLY_READ_USER} set default_transaction_read_only = on failed."
    fi

    for db in $_ALL_DATABASE; do
        echo "grant table(${db}) select schema."
        db_free -d ${db} -c "GRANT SELECT ON ALL TABLES IN SCHEMA public TO ${ONLY_READ_USER};" > /dev/null 2>&1
        if [ $? -ne 0 ]; then
            echo "[ERROR] grant select in database(${db}) for user($ONLY_READ_USER) failed."
        fi
        #Authorized users can access newly added tables in the future
        db_free -d ${db} -c "ALTER DEFAULT PRIVILEGES IN SCHEMA PUBLIC GRANT SELECT ON TABLES TO ${ONLY_READ_USER};" > /dev/null 2>&1
        if [ $? -ne 0 ]; then
            echo "[ERROR] alter default privileges in schema public grant select on tables to ${ONLY_READ_USER} failed."
        fi
    done
}


# Check if the user exists
eval $(/opt/bin/db-auth.sh -k hzbdbkz1 print)
_USE_NAME=$(python /opt/bin/execute_database_query.pyc $DB_HOST $DB_PORT $DB_DATABASE $DB_USER $DB_PASS "SELECT usename FROM pg_user WHERE usename = '${ONLY_READ_USER}'")
if [ $? -ne 0 ]; then
    echo "[ERROR] Cannot access host(ip=$DB_HOST) database!"
    exit 1
fi

eval $(/opt/bin/db-auth.sh -k hzbdbkz1 free)
if [ "X${_USE_NAME}" != "X${ONLY_READ_USER}" ]; then
    echo "The read-only user($ONLY_READ_USER) does not exist, create it.";
    db_free -c "CREATE ROLE ${ONLY_READ_USER} LOGIN PASSWORD '$DB_PASS' NOINHERIT;"
    if [ $? -ne 0 ]; then
        echo "[ERROR] create only read user($ONLY_READ_USER) failed."
        exit 1
    fi

    # assign read-only permissions
    grant_select
else
    echo "There is a read-only user($ONLY_READ_USER)."
    # reassign read-only permissions
    grant_select
fi

exit 0