# File: ovs_show_rxq.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/openvswitch.package/scripts/ovs_show_rxq.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

shell
stderr
stdoutr
subprocess
Popen
PIPEZ
communicate
decode)
info
-./openvswitch.package/scripts/ovs_show_rxq.py
execute
pciZ
replyc
bridge
name)
SubElement
attrib)
root
create_bridge_nood"
z+display_rxq_xml.<locals>.create_bridge_noodZ	interfacer
core_id
numa_id
typez
list
keys
startswith
appendr
Element
lenr
printZ
tostringr
replace)
args
listbrsZ
brinfor
	new_value
	old_value
ifacer
onebrZ	br_values
elemr
display_rxq_xml
Nz/ovs-appctl --timeout 5 dpif-netdev/pmd-rxq-showZ
pmdz'pmd thread numa_id (\d+) core_id (\d+):r
portz!port:\s+(\w+)\s+queue-id:\s+(\d+)z$ovs-vsctl --timeout=5 iface-to-br %sz+ovs-vsctl --timeout=5 get Interface %s typer
splitlines
stripr"
match
groupr#
data
infosZ
oneline
iface_infor+
iftypeZ	org_valuer)
Z	one_valuer
get_all_rxq_info;
ovs-vsctl --timeout=5 list-brz
list pmd rxq info)
descriptionz
--bridgez
list rxq info on bridge)
choices
helpz
--all
store_truez%list vir iface and phy iface rxq info)
actionr:
argparse
ArgumentParser
add_argument
parse_argsr7
argvr(
Z	topParserr'
main`
__main__r
sysr1
xml.etree.ElementTreeZ
etreeZ
ElementTreer
__name__rA
<module>
