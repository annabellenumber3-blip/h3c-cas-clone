# File: dpdk-telemetry.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/dpdk.package/scripts/dpdk-telemetry.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

Z	d	d
Script to be used with V2 Telemetry.
Allows the user input commands and read the Telemetry response.
v2Tc
z4 Read data from socket and return it in JSON format z
Error in reply: )
recv
decode
json
loadsZ
JSONDecodeError
print
close
dumps)
sockZ
buf_lenZ
echoZ
reply
dpdk-telemetry.py
read_socket
zhzHt
z) Connect to socket and handle user input z
Connecting to z
Error connecting to Ni
max_output_len
--> 
quit)
socketZ
AF_UNIXZ
SOCK_SEQPACKETr
connect
OSErrorr
send
encode
CMDS
input
strip
startswith
EOFError)
pathr
json_replyZ
output_buf_len
textr
handle_socket#
z> Find any matching commands from the list based on user input r
<listcomp>G
z%readline_complete.<locals>.<listcomp>)
stateZ
all_cmds
matchesr
readline_completeC
tab: completer
z!/var/run/dpdk/*/dpdk_telemetry.%sz
%s/dpdk/*/dpdk_telemetry.%sZ
XDG_RUNTIME_DIRz
/tmp)
__doc__r
globr
readlineZ
TELEMETRY_VERSIONr
parse_and_bindZ
set_completerZ
set_completer_delimsZ
get_completer_delims
replace
environ
getr
<module>
