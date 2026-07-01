#!/bin/bash

DB_LOGIN_CONF=/etc/cvk/cvm/db.properties
BUILT_IN_DB=seasql

function _validate_params() {
    local errors=0

    for p in "$@"; do
        if [ -z "${!p}" ]; then
            echo "error: Cannot parse $p from $DB_LOGIN_CONF" >&2
            let errors++
        fi
    done

    [ $errors -gt 0 ] && exit 1
}

function _decrypt() {
    echo "$@" | openssl enc -d -des-ecb -K $CRYPT_KEY -nosalt -a
    if [ $? -ne 0 ]; then
        exit 1
    fi
}

function _encrypt() {
    echo -n "$@" | openssl enc -e -des-ecb -K $CRYPT_KEY -nosalt -a
}

function _decrypt_credentials() {
    read HOST PORT DATABASE < <(sed -rn 's#jdbc.url=jdbc:postgresql://\[?([^]]+)\]?:(\w+)/(\w+)#\1 \2 \3#p' $DB_LOGIN_CONF)
    _validate_params HOST PORT DATABASE
    read CRYPTED_USER < <(sed -rn 's#jdbc.username=(.+)#\1#p' $DB_LOGIN_CONF)
    _validate_params CRYPTED_USER
    read CRYPTED_PASS < <(sed -rn 's#jdbc.password=(.+)#\1#p' $DB_LOGIN_CONF)
    _validate_params CRYPTED_PASS

    USER=$(_decrypt $CRYPTED_USER)
    PASS=$(_decrypt $CRYPTED_PASS)
    if [ -z "$USER" ] || [ -z "$PASS" ]; then
        echo "error: Cannot decrypt USER and PASS" >&2
        exit 1
    fi
}

function db_free() {
    PGPASSWORD=$PASS psql -U $USER $BUILT_IN_DB -p $PORT "$@"
}

function db_print_credentials() {
    echo "DB_HOST=$HOST"
    echo "DB_PORT=$PORT"
    echo "DB_USER=$USER"
    echo "DB_PASS=$PASS"
    echo "DB_DATABASE=$DATABASE"
}

function db_print_free() {
    cat <<EOF
db_free() { PGPASSWORD=$PASS psql -U $USER $BUILT_IN_DB -p $PORT "\$@"; }
EOF
}

function db_change_password() {
    db_free -c "alter role $USER with password '$1'"
    [ $? -ne 0 ] && exit 1
    su - $USER -c "/usr/local/tos/seasql/bin/pg_ctl reload"
    if [ -f /opt/tool/LicCliEnc.class ]; then
       lic_pw=$(java -classpath /opt/tool/ LicCliEnc $1)
       sed -i "/^db_password=/d" /etc/license_client.setting
       echo "db_password=$lic_pw" >> /etc/license_client.setting
    fi

    CRYPTED_PASS=$(_encrypt $1)
    sed -i -r "s#jdbc.password=(.+)#jdbc.password=$CRYPTED_PASS#" $DB_LOGIN_CONF
    echo "Password is successfully changed!"
}

function db_change_password_interactive() {
    read -s -p "Password:" db_pw
    db_change_password "$db_pw"
}

usage="$0 <-h | --help | -k key> [free|chpasswd PWD|print|chpasswd_input]
OPTIONS
    -h, --help      print this message
    -k  key         the crypt key
ACTIONS
    free            print function definition of db_free used to access database
    print           print the decrypted database conf
    chpasswd PWD    change database password to PWD
    chpasswd_input  change database password interactively"

SHORT_OPTS="hk:"
LONG_OPTS="help"
# parse the arguments passed by command line
TEMP=`getopt -o $SHORT_OPTS --long $LONG_OPTS -n "$0" -- "$@"`

if [ $? != 0 ]; then exit 1 ; fi
eval set -- "$TEMP"

while true; do
    case $1 in
    --) shift; break;;
    -h|--help) echo "$usage"; exit 0;;
    -k) IN_SEC=$2; shift 2;;
    *) echo "$usage"; exit 1;;
    esac
done

# to hex
if [ -z "$IN_SEC" ]; then
    echo "error: No secret key input!"
    exit 1
fi
CRYPT_KEY=$(for ((i=0;i<${#IN_SEC};i++)); do printf %02X \'${IN_SEC:$i:1}; done)
_decrypt_credentials

ACTION=$1; shift
case $ACTION in
    free)       db_print_free "$@";;
    print)      db_print_credentials "$@";;
    chpasswd)   db_change_password "$@";;
    chpasswd_input)   db_change_password_interactive "$@";;
    *) echo $usage; exit 1;;
esac