# File: util_platform.pyc
# Path: /home/kali/Downloads/h3c/H3C_CAS-R0785P03-h3linux-x86_64/extras/util.package/scripts/util_platform.pyc

# uncompyle6 error: [Errno 2] No such file or directory: 'uncompyle6'
# decompyle3 error: [Errno 2] No such file or directory: 'decompyle3'

# ===== STRINGS OUTPUT =====

This module tries to retrieve platform-identifying data.
    Call this module without any parameters.
    If no error happens, the output will contain the architecture and linux distribution name in form of xml.
    The output format is as following:
    <platform>
         <architecture>x86_64</architecture>
         <distribution>Ubuntu</distribution>
    </platform>
    Supported 'architecture': 'aarch64', 'x86_64'.
    Supported 'distribution': 'Ubuntu', 'centos'.
__main__z
/opt/bin/os_lsb_release -isT)
shell
stderr)
full_distribution_name
platformZ
architectureZ
distribution)
__doc__r
xml.dom.minidomZ
subprocess
__name__
machineZ
archZ
check_outputZ
STDOUT
decodeZ
distri
splitlines
lowerZ
dist
ImportErrorZ
linux_distributionZ
domZ
minidomZ
Document
docZ
createElement
rootZ	arch_nodeZ
appendChildZ
createTextNodeZ	dist_node
printZ
toprettyxml
util_platform.py
<module>
