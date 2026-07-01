# File: br_import_rbd_image.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/backup-restore.package/scripts/br_import_rbd_image.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

This module is used to import a rbd image.
There are two input parameters:
    1 file to import, full path
    2 image name, e.g. pool/.diskpool0.rbd/image1, where pool is pool name and .diskpool0.rbd is disk pool name and
      image1 is volume name.
__main__
caslog/backup-restorez
/ztonestor blk LUN_cas_import -d "{ 'lun_name':'%s','diskpool_name':'%s','pool_name': '%s', 'file_path': '%s'}" -f json
Going to execute cmd: "%s"T)
shellz4Execute "%s" failed with error code %d, output is %sZ	BR_FAILEDz
Execute "%s" output is %s
resultz!Execute "%s" failed, output is %sZ
BR_SUCCESS) 
__doc__
subprocessZ
loggingZ
jsonZ
util_sh_error_code_loaderZ
util_cvk_log
__name__Z
cas_log_init3
info
argv
path
splitZ
arrZ	pool_nameZ
disk_pool_nameZ
image_name
cmdZ
check_output
outputZ
CalledProcessErrorZ
error
returncode
exitZ
br_error
loadsZ
joutput
SystemExitZ
BaseException
br_import_rbd_image.py
<module>
