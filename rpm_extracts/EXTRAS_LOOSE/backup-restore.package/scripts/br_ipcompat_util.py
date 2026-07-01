# File: br_ipcompat_util.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/backup-restore.package/scripts/br_ipcompat_util.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

    # set the module name
    local MODULE_NAME=utils_get_scp_remote_path
    br_printlog $MODULE_NAME info "input params: $@"
    local host_ip=$1
    local username=$2
    local path=$3
    local count=`echo $host_ip | awk -F ':' '{print NF}'`
    if [ $count -gt 1 ]; then
        # IPv6 address
        local prefix=`echo $host_ip | awk -F '::' '{print $1}'`
        if [ $prefix == "FE80" ] || [ $prefix == "fe80" ]; then
            # link-local address
            echo "$username@\[$host_ip%vswitch0\]:$path"
        else
            # global address
            echo "$username@\[$host_ip\]:$path"
        fi
    else
        echo "$username@$host_ip:$path"
    fi
    return $BR_SUCCESS
split
len)
ipv6_parts
br_ipcompat_util.py
is_ipv6,
fe80Z
FE80TF)
prefixsr
is_link_local_ipv64
%s%%vswitch0)
host_ipr
ipcompat_get_compat_ip;
%s@[%s]:%sz
%s@%s:%s)
username
pathZ	compat_ipZ
remote_pathr
ipcompat_get_scp_pathB
Nzpbr_ipcompat_util.py provide a unified way to generate remote url for ssh/scp/ftp utility, supporte IPv4 and IPv6zEUsage: br_ipcompat_util.py command [host_ip] [username] [remote_path]z
  command:z'    get_scp_path:   get scp remote pathz1  host_ip:       the host ip that will connect toz+  username:      the username used to loginz,  remote_path:   the path on the remote hostzN  If command is get_scp_path, host_ip, username, remote_path must be specifiedz8  If command is get_compat_ip, host_ip must be specifiedr
print
exitr
usageK
__main__)
level
Invalid argumentr
get_scp_pathZ
get_compat_ipz
Invalid command: %s
__doc__Z
loggingr
__name__Z
basicConfig
DEBUGr
argvZ
argc
errorZ
commandZ
commands_supportedr
replacer
<module>
