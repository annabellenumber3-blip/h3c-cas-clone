# File: cas_tls_gen_cert.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/util.package/scripts/cas_tls_gen_cert.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

Z"Z#e"d!v
nPe"d"v
rre#Z
n@e"d#v
n0e"d$v
n e"d%v
Z(e$d
Z)e$d
Z*e$d
e(e)e
e*e+e
e(e)e*e+
Z.[.n
Z.[.0
/var/tlsc
shellr
subprocess
check_output
	Exception)
cas_tls_gen_cert.py
execute_shell
NzC'-h',    '--help'                        display this help and exitzZ'-t',    '--target=<target hostname>'    target hostname to holding the cert to be createdzW'-o',    '--output=<output path>'        path certificate generated will be placed intozD'-f',    '--force'                       create certificate forciblyzF'-r',    '--root'                        create root cert and root key)
printr
usage
Nz-umask 277 && certtool --generate-privkey > %sr
exit)
keyr
retr
gen_key
activation_date = "2010-01-01 08:00:00"
expiration_date = "2210-01-01 08:00:00"
encryption_key
signing_key
cn = Cloud
dns_name = %s
ip_address = %s
/tmp/cert.info
tls_www_serverZ
tls_www_client)
socket
gethostnameZ
gethostbyname
open
write)
server
hostnameZ
content
tmp_fpr
gen_info!
DNSname: %sz
IPAddress: %sz
certtool -i --infile %sTr
path
existsr
str)
target_host
certr
key_infor
infor
need_gen_cert;
activation_date = "2010-01-01 08:00:00"
expiration_date = "2210-01-01 08:00:00"
cert_signing_key
zXcerttool --generate-self-signed --template /tmp/cert.info --load-privkey %s --outfile %sr
root_key
	root_certr
gen_root_certK
certtool --generate-certificate --template /tmp/cert.info --load-privkey %s --load-ca-certificate %s --load-ca-privkey %s --outfile %sr
server_key
server_certr#
gen_server_certZ
NFr*
client_key
client_certZ
targe_thostr
gen_client_certb
tls_root_cert_pathr
UTF-8
encoding
method
Element
text
appendr
tostring)
rootZ
suber
print_root_path_infoj
)	NZ
tls_cert_pathr
clientr1
)	r+
print_path_infov
__main__
ca-key.pemz
ca-cert.pemFr
ht:o:rf)
helpz
target=z
output=r:
forcez#Command error, please refer to help)
--help)
--target)
--output)
--force)
--rootz
server-key.pemz
server-cert.pemz
client-key.pemz
client-cert.pemz!target hostname must be specifiedzRtarget server ip is the same as the one which is contained in existing certificatez"generate certificate is not neededzRtarget client ip is the same as the one which is contained in existing certificate)
T)/r
shutil
getoptr
xml.etree.ElementTreeZ
etreeZ
ElementTreer7
DEFAULT_OUTPUT_PATHr
__name__r'
outputZ
force_flagZ	root_flagr#
argvZ
opts
argsr
GetoptError
argZ
output_pathr 
makedirsr+
rmtreer
errorr
<module>
