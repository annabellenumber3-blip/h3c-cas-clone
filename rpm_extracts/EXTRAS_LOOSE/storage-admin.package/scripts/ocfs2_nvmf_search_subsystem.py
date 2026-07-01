# File: ocfs2_nvmf_search_subsystem.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/storage-admin.package/scripts/ocfs2_nvmf_search_subsystem.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

ElementTree)
/sys/block/%s/wwid
open
read
close
rstrip)
ocfs2_nvmf_search_subsystem.py
get_eui_by_dev
now nvme list is empty link.
unknownz+nvme id-ctrl %s|grep subnqn|awk '{print$3}'T
shell)
loggingZ
warning
subprocess
check_output
decode
strip)
nqnstrr
get_nqn_inf_by_dev
)nvme list-subsys 2>/dev/null|grep -v \\\\T
stdoutZ	close_fdsz	traddr=%s
NQN=)
Popen
PIPEr
	readlinesr
strnqnZ
has_nqn_flagZ
ip_cnt
strcmd
strx
line
contr
check_ip_link_nqn&
)	Nr
z rdma traddr=%s trsvcid=4420 liver
split
append)
ip_addrZ
judge_flagZ
effnqn_listZ	grep_infor"
jud_nqnr
get_live_nqnlist_by_ip9
qlq0W
)	Nz7nvme list-subsys | grep -oP 'traddr=\K([0-9a-fA-F:.]+)'Tr
z+by nvme list-subsys find ipv6 address is %sz+by nvme list-subsys find ipv6 %s failed, %szMnvme list-subsys | grep 'rdma traddr=%s trsvcid=4420 live' | awk '{print $2}'z
getcmd inf:%s
is_valid_ipv6r
splitlinesZ
convert_ipv6_to_full_formatr
debug
	Exception
errorr)
)	r!
nvme_ip_listZ
nvme_ipZ
find_nvme_fullipZ
input_nvme_fullip
excr#
nvmelistr
get_nvme_list_by_ipK
target grep inf:%sz3nvme list 2>/dev/null|grep -E "%s"|awk '{print $1}'z
getcmd grep inf:%sTr
)	r3
dev_l_ipr2
split_grep_infr
get_stor_server_devlist_by_ipd
/dev/)
nqnZ
c_dev_lZ
devlZ
dev_par	
nqn_tr
get_devl_by_nqn_fromdevlly
whole dev empyt)
ctrlistZ
devllZ
dev_ctrl_listr	
ctrlr
get_devl_in_alldevl_by_ctrlist
Z	xml.etreer
util_common_toolsZ
util_sh_error_code_loaderZ
sa_iscsi_commonr
<module>
