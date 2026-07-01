# File: ocfs2_restore_utils.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/storage-admin.package/scripts/ocfs2_restore_utils.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

rrd'Z
n:d/e
d0d1
Z	e	D
]tZ"e"
Z%e&e%
e%d8
Z'e'e
Z(e(e
d9e'
]tZ"e"
e%d 
e%d"
e%d8
Z'e'e
Z(d;e
e)e(e*f
d0d1
d>e-j.
Z-[-n:d
Z-[-0
Z1[1n
Z1[10
print)
verbose
string
ocfs2_restore_utils.py
ocfs2_print
__main__
OCFS2 file restore utils)
description
	operationZ
rdump
Operation mode to restore files)
choices
help
device_namez
OCFS2 device name)
sourcez
Source file to  or <inode>. for rdump mode, use '.' to represent for all files; for dd mode, source file is result of 'stat -n'
destinationz
output file or directoryz
-vz	--verbose
store_trueF)
action
defaultz
--clustersize)
typez
input parameters: %s
z Destination '%s' is a directory.
Destination '%s' is a file.z Destination '%s' does not exist.Z
512K
256K
128Kz.Destination must be a directory in rdump mode.
z!debugfs.ocfs2 -R "rdump %s %s" %sT)
shellz
Restoring '%s' from %s to %s.z2Destination '%s' is a directory or already exists.z-extent file %s is empty, please have a check.
z'format of extent file %s is invalid: %s
blkno is invalid: %dz
format of file %s is validzFdd if=%s of=%s bs=%s seek=%d skip=%d count=%d oflag=direct 2>/dev/nullz
do <%s>z-Restoring file from %s to %s with dd command.z"Call command failed, result is %s.z
Remove file '%s'.
sysr
argparse
subprocessr
__name__
retZ	dest_typeZ
input_fdZ	dd_stringZ
multiple
ArgumentParser
parser
add_argument
parse_args
argsr
argv
path
existsr
isdirZ
clustersizer
cmdZ
check_call
exit
getsize
openZ	each_line
strip
splitZ
extent
lenZ
blkno
skip
seek
count
closeZ
CalledProcessErrorZ
output
remove
BaseExceptionZ
betr
<module>
