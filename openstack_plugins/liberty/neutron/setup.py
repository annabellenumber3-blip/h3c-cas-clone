import os
from setuptools import setup, find_packages
from setuptools.command.install import install

try:
    # Python 2.7 or >=3.2
    from sysconfig import get_path, get_python_version

    def _get_purelib():
        return get_path("purelib")
except ImportError:
    from distutils.sysconfig import get_python_lib, get_python_version

    def _get_purelib():
        return get_python_lib(False)

def _post_install():
    dstDir = _get_purelib() + '/neutron/agent/casagent'
    srcDir = _get_purelib() + '/liberty_cas_neutron'

    os.system("rm -rf %s" % dstDir)
    os.system("ln -s %s %s" % (srcDir,dstDir))
    
    if os.path.exists('/usr/bin/openstack-cas-uninstall'):
        os.system("sed -i /openstack-cas-neutron-uninstall/d /usr/bin/openstack-cas-uninstall")
    os.system("echo openstack-cas-neutron-uninstall >> /usr/bin/openstack-cas-uninstall")
    os.system("chmod a+x /usr/bin/openstack-cas-uninstall")
    
    if os.path.exists('/usr/bin/openstack-cas-version'):
        os.system("sed -i /liberty_cas_neutron/d /usr/bin/openstack-cas-version")
    os.system("echo \"echo 'liberty_cas_neutron R0785P03'\" >> /usr/bin/openstack-cas-version")
    os.system("chmod a+x /usr/bin/openstack-cas-version")
    
    if not os.path.exists("/etc/neutron/plugins/ml2/ml2_conf.ini"):
        os.mknod("/etc/neutron/plugins/ml2/ml2_conf.ini",0640)
        os.system("chown root:neutron %s" % "/etc/neutron/plugins/ml2/ml2_conf.ini")
    if not os.path.exists("/etc/neutron/plugins/ml2/ml2_conf_sriov.ini"):
        os.mknod("/etc/neutron/plugins/ml2/ml2_conf_sriov.ini",0640)
        os.system("chown root:neutron %s" % "/etc/neutron/plugins/ml2/ml2_conf_sriov.ini")
    os.system("systemctl enable openstack-neutron-cas-agent.service")
    os.system("systemctl start openstack-neutron-cas-agent.service")

class myInstall(install):
    def run(self):
        install.run(self)
        self.execute(_post_install,(),msg="post install")

setup(
      name = 'liberty_cas_neutron',
      version = 'R0785P03',
      author = 'CAS',
      packages = find_packages(),
      zip_safe = False,
      scripts = ['scripts/openstack-cas-neutron-uninstall','scripts/neutron-cas-agent'],
      data_files = [('/usr/lib/systemd/system',['service/openstack-neutron-cas-agent.service'])],
      entry_points = {
          'neutron.qos.agent_drivers' : [
              'cas = neutron.agent.casagent.qos:QosCASAgentDriver'
          ]
      },
      cmdclass = {
          'install': myInstall,
      }
)
