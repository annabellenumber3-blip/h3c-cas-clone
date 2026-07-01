# File: ocfs2_restore_xml_merge_bh.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/storage-admin.package/scripts/ocfs2_restore_xml_merge_bh.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

Z	e	d
e	d	k
d,e 
Z!e!D
Z"e"e
d,e"
e#d2
e#e&
Z&[&n
Z&[&0
NAMEzq	 ocfs2_restore_xml_merge_bh.py Merge restore xml stream and black host list xml stream into one xml and print itZ
SYNOPSISz%	$0 [ -h ] restore_xml black_host_xmlZ
DESCRIPTIONz
	 -h: Helpz$	 restore_xml: the ocfs2 restore xmlz)	 black_host_xml: the black host list xml)
print
ocfs2_restore_xml_merge_bh.py
usage
nodeTypeZ	TEXT_NODE
append
data
join)
nodelist
noder
getText 
__main__
<ocfs2Res>
hostZ
hostNameZ
poolNamez
<poolName>%s</poolName>Z
fileSystemz
<fileSystem>z
<name>%s</name>
namez
<type>%s</type>
typez
<mountPath>%s</mountPath>Z	mountPath
<host>%s</host>z
<target>%s</target>
targetz
<lun>%s</lun>Z
lunz
<naa>%s</naa>Z
naaz
<slotNum>%s</slotNum>Z
slotNumz
</fileSystem>Z	haClusterZ
bindNetAddrz
<haCluster>z
<bindNetAddr>%s</bindNetAddr>z
<mcastAddr>%s</mcastAddr>Z	mcastAddrz
<mcastPort>%s</mcastPort>Z	mcastPortz
<host>z
<hostName>%s</hostName>z
<ip>%s</ip>Z
</host>z
</haCluster>z
</ocfs2Res>r
xml.dom.minidomZ
xmlr
__name__
argvZ
exitZ
black_hostsZ
xml_mergedr
domZ
minidomZ
parseStringZ	dom_firstZ	dom_blackZ
black_host_listZ
getElementsByTagNameZ
hosts_blackZ
black_elementZ
childNodesZ
pool_firstZ
file_systems_firstZ
file_systemZ
ha_firstZ
ha_hosts_arrayZ
hostsZ
ha_host_nameZ
hosts_fZ	host_namer
BaseException
<module>
