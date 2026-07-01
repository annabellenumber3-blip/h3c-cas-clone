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
    dstDir = _get_purelib() + '/nova/virt/casapi'
    srcDir = _get_purelib() + '/mitaka_cas_nova'
    
    os.system("rm -rf %s" % dstDir)
    os.system("ln -s %s %s" % (srcDir,dstDir))
    
    if os.path.exists('/usr/bin/openstack-cas-uninstall'):
        os.system("sed -i /openstack-cas-nova-uninstall/d /usr/bin/openstack-cas-uninstall")
    os.system("echo openstack-cas-nova-uninstall >> /usr/bin/openstack-cas-uninstall")
    os.system("chmod a+x /usr/bin/openstack-cas-uninstall")

    if os.path.exists('/usr/bin/openstack-cas-version'):
        os.system("sed -i /mitaka_cas_nova/d /usr/bin/openstack-cas-version")
    os.system("echo \"echo 'mitaka_cas_nova R0785P03'\" >> /usr/bin/openstack-cas-version")
    os.system("chmod a+x /usr/bin/openstack-cas-version")

class myInstall(install):
    def run(self):
        install.run(self)
        self.execute(_post_install,(),msg="post install")

setup(
      name = 'mitaka_cas_nova',
      version = 'R0785P03',
      author = 'CAS',
      packages = find_packages(),
      zip_safe = False,
      scripts = ['scripts/openstack-cas-nova-uninstall'],
      cmdclass = {
          'install': myInstall,
      }
)
