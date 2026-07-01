# File: util_xml_common.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/util.package/scripts/util_xml_common.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

d!d"
d#d$
d%d&
d'd(
ElementTreec
  Func Name: read_xml
       Description: parse the xml file
             Input: in_path: absolute path of the xml file
            Output:
            Return: ElementTree, if path not exist or not a xml format, return NoneN)
parse
IOError
logging
error
BaseException)
in_path
tree
util_xml_common.py
read_xml
text
strip
tail
pretty_print)
et_node
level
  Func Name: write_xml
       Description: write the xml file to out_path
             Input: tree: ElementTree
                    out_path: absolute path of the xml file
            Output:
            Return: r
utf-8T)
encodingZ
xml_declaration
getroot
writer
out_path
retr	
	write_xml3
  Func Name: find_nodes
       Description: find Element nodes in xml tree matched the path
             Input: tree: ElementTree
                    path: Element path of the xml file
            Output:
            Return: Element node listN)
findallr
path
nodesr	
find_nodesC
  Func Name: if_match
       Description: judge Element node whether include kv_map 
             Input: node: Element node
                    kv_map: dictionary of key-value
            Output:
            Return: True: include; False: not includeFT)
node
kv_map
keyr
if_matchQ
  Func Name: find_nodes_by_keyvalue
       Description: find Element nodes in list which matched the kv_map
             Input: nodelist: list of Element node
                    kv_map: dictionary of key-value
            Output:
            Return: Element node list matched the kv_map)
append)
nodelistr"
result_nodesr!
find_nodes_by_keyvalue]
  Func Name: find_nodes_by_child_keyvalue
       Description: find Element nodes in list which matched kv_map in child nodes
             Input: nodelist: list of Element node
                    kv_map: dictionary of key-value
            Output:
            Return: Element node list matched the kv_map)
listr$
children
childr
find_nodes_by_child_keyvaluej
  Func Name: find_childnode_by_tag
       Description: find child Element node in list matched the tag
             Input: nodelist: list of Element node
                    tag: tag of Element node
            Output:
            Return: child Element node matched the tagN)
parent_noder*
find_childnode_by_tagz
  Func Name: find_childnodes_by_tag
       Description: find child Element nodes in list matched the tag
             Input: nodelist: list of Element node
                    tag: tag of Element node
            Output:
            Return: child Element node list matched the tag)
find_childnodes_by_tag
  Func Name: change_node_properties
       Description: change properties of Element node with kv_map
             Input: node: Element node
                    kv_map: dictionary of key-value
            Output:
            Return: N)
setr
change_node_properties
  Func Name: delete_node_properties
       Description: delete properties of Element node with kv_map
             Input: node: Element node
                    kv_map: dictionary of key-value
            Output:
            Return: N)
attribr 
delete_node_properties
  Func Name: change_node_text
       Description: change text of Element node with new text
             Input: node: Element node
                    text: new text of the node
            Output:
            Return: N
change_node_text
  Func Name: delete_node_text
       Description: delete text of Element node
             Input: node: Element node
            Output:
            Return: 
delete_node_text
  Func Name: create_node
       Description: create new Element node with property_map and content
             Input: tag: tag of Element node
                    property_map: propertie of the node
                    content: node text
            Output:
            Return: Element node)
Elementr
property_mapZ
content
elementr
create_node
  Func Name: add_child_node
       Description: add element node to nodelist as child node
             Input: nodelist: parent element node list
                    element: child element node
            Output:
            Return: N)
add_child_node
  Func Name: del_nodes_by_tag
       Description: delete child element nodes in nodelist matched tag
             Input: nodelist: parent element node list
                    tag: tag of child element node
            Output:
            Return: z
remove node: %s %sN)
debugr4
remover.
del_nodes_by_tag
nodeTypeZ	TEXT_NODEr%
data
join)
rcr!
getText
iterr
rootr:
resultr
value
efir
get_node_value
	get_nodes
sysr
Z	xml.etreer
<module>
