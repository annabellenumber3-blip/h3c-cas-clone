# File: inject_file.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/util.package/scripts/inject_file.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

d!Z W
path %s not existz
path %s is not file)
path
exists
	Exception
isfile)
inject_file.py
check_path
Nz7virtual machine %s is not active, unable to inject file)
libvirt
openZ
lookupByName
isActiver
conn
domr
check_vm
Nz'going to inject into virtual machine %szfvirsh qemu-agent-command %s '{"execute": "guest-file-open", "arguments": {"path": "%s", "mode": "w"}}'T)
shell
return
utf-8zkvirsh qemu-agent-command %s '{"execute": "guest-file-write", "arguments": {"handle": %d, "buf-b64": "%s"}}'zZvirsh qemu-agent-command %s '{"execute": "guest-file-close", "arguments": {"handle": %d}}')
print
subprocessZ
check_output
json
loadsr
read
base64Z	b64encode
decode)	r
Z	dest_path
strb
strr
inject
__main__z Inject file into virtual machine)
descriptionr
filename
storez
file to be injected)
dest
metavar
action
helpz
--destr&
destination path)
requiredr)
--all
store_truez$inject to all active virtual machine)
--vmr
virtual machine to be injectedz'inject into virtual machine %s success!
SUCCESS!)"
sysr
argparser	
__name__
ArgumentParser
parser
add_argument
add_mutually_exclusive_group
group
parse_args
argsr
listAllDomainsZ
domsr
namer&
exitr
<module>
