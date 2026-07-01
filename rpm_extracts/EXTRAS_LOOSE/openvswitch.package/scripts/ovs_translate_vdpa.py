# File: ovs_translate_vdpa.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/openvswitch.package/scripts/ovs_translate_vdpa.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

d d!
d"d#
ElementTreez
ovs_vdpatrans.pyz
/etc/libvirt/qemu
parse
	Exception
logging
error
exit)
in_path
tree
3./openvswitch.package/scripts/ovs_translate_vdpa.py
read_xml
xml_declarationr
writer
out_pathr
	write_xml
findallr
nodepathr
find_nodes#
shellr
subprocessZ
check_callr
cmdr
system+
getstatusoutput
decoder
system_output3
path
existsr
filepathr
file_is_exist;
q6q |
NFz2virsh iface-list --all | awk '{if (NR>2) print$1}'Tz.error: No have this bridge "%s", please check.)
splitr	
br_nameZ
isbridger
status
outputZ
iface_listZ
ifacer
bridge_is_validC
Supported the following operations as follows:
  convert: convert to common virtio vnic:
    --brmap: the bridge mapping
    --dir: session dir to save, default: /root/vdpatrans/sX, where X the smallest number,
           such that /root/vdpatrans/sX not used
    --allvm: scope all vm
    --vm: vm list
    {this_script} convert --brmap='br0:,br_smart:brx' --dir=/root/vdpatrans/s100 --allvm
  unconvert: restore to saved state:
    --dir: session dir to restore, required
    --allvm: scope all vm
    --vm: vm list
    {this_script} unconvert --dir=/root/vdpatrans/s100 --allvm
this_script)
print
format
SCRIPT_MODULE_NAMEr
helpS
get)
nodesZ
propr
nodes_propg
d!|!|
d!| |
|	d#k
|	d#k
d&| 
|	d#k
d*|#
}#~#n
}#~#0
),Nz
mkdir -p %s/domain
	%s/%s.xmlz
%s/domain/%s.xmlz
cp -f %s %sz&-> convert vm list %s base_dir: %s ...z
--> convert vm %s ...
	%s/%s/new
	%s/%s/old
mkdir -p %s
virsh domstate %s
running
--config --live
--config
devices/interface
sourceZ
bridger
address
/var/run/vdpa/device/vdpa_z*---> process br:%s path:%s mac:%s		ignoredz%---> process br:%s path:%s mac:%s ...Z
vlanz
<vlan><tag id="1"/></vlan>Z
virtualportz
<priority type="low"/>
priorityz
<mtu size="1500"/>Z
mtuz
<interface type="bridge">
  <mac address="%s"/>
  <source bridge="%s"/>
  %s
  %s
  <model type="virtio"/>
  <driver name="vhost"/>
  <hotpluggable state="on"/>
  %s
  %s
  %s
</interface>
 XXX='%s'; cat <<<$XXX >%s/%s.xml
#virsh detach-device %s %s/%s.xml %sr
!----> detach-device error for:
%sz#virsh attach-device %s %s/%s.xml %s
!----> attach-device error for:
virsh qemu-agent-command %s '{"execute": "guest-set-network","arguments":{"netcfgs":[{"mac":"%s","netcfgv4":{"ip":"","mask":"","gateway":"","dns":[]},"netcfgv6":{"ip":"","prefix":"","gateway":"","dns":[],"mode":""},"restart":{"enable":"true","block":"false"},"mtu":""}]}}'
2----> restart interface %s failed with code: %d
--> convert vm %s completed
XML_DEFINE_PATHr	
infor
replacer
list
keys
startswith
findr
tostringr
textr
base_dir
bridge_mapping
vm_list
vm_xml_fileZ
vm_xml_backupr
newdir
olddirr#
vm_state
config_flag
vm_filer
node
src_nodeZ
brnamer
mac_noder:
Z	vlan_nodeZ	vlan_textZ
virtualport_nodeZ
virtualport_textZ
priority_textZ
priority_nodeZ
mtu_textZ
mtu_nodeZ
pci_textZ
pci_nodeZ
newxmlZ
oldxml
qgacmdr
translate_vmsm
rz|	d
-virsh list --all | awk '{if (NR>2) print $2}'
z0br:%s not exist, please ensure all bridge exists
/root/vdpatrans/sr2
brmap
allvmr
extendrQ
stripr+
setrI
valuesr%
dirr
argvr`
kvsZ
kv_Z
allbr
convert_vms
}	|	d
) Nz)-> unconvert vm list %s, base_dir: %s ...z
--> unconvert vm %s ...r0
%s/%s/roldr2
z4---> process path:%s mac:%s		ignored -- already vdpaz?---> process path:%s mac:%s		ignored -- no backup interface xmlr>
virsh attach-device %s %s %srA
---> unconvert vm %s completedr
warningr
rolddirr
oldint_xmlpathZ
roldxmlrZ
untranslate_vms
s`t	
/domainz%not a valid save dir, can't unconvert)
unconvert_vms'
translate vdpa to virtio device)
descriptionZ
callerz
operation type)
destr)
get help)
funcZ
convertz
convert to common virtio vnicz
--brmapFz
the bridge mapping)
requiredr)
--dirz
session dir to savez
--allvm
store_truez
scope all vm)
actionr)
--vm
vm list)
nargsr)
Z	unconvertz#unconvert to nic that priviously doTz
session dir to restore)
argparse
ArgumentParser
add_subparsers
add_parser
set_defaultsr)
add_argumentrj
parse_args)
top_parserZ
subparsersZ
help_parserZ
convert_parserZ
unconve_parser
argsr
z t	t
Nz*/var/log/caslog/cas_ovs_translate_vdpa.logz>%(asctime)s %(levelname)7s %(funcName)s:%(lineno)d %(message)sz
%m-%d %H:%M:%S)
levelr'
datefmt
filenamez
call in: %s
%s(ret:%d)z
call out: %s ==> OK)
ERROR_CODE_OKr	
basicConfig
DEBUG
debug
joinr
ERROR_CODE_UNKNOWNr{
	traceback
format_exc
	exceptionr
resZ
log_file
retZ	excpt_msgrg
mainN
__main__)
Z	xml.etreer
__name__r
<module>
