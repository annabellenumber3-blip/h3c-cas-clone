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
    dstDir = _get_purelib() + '/ceilometer/compute/virt/cas'
    srcDir = _get_purelib() + '/pike_cas_ceilometer'
    
    os.system("rm -rf %s" % dstDir)
    os.system("ln -s %s %s" % (srcDir,dstDir))
    
    if os.path.exists('/usr/bin/openstack-cas-uninstall'):
        os.system("sed -i /openstack-cas-ceilometer-uninstall/d /usr/bin/openstack-cas-uninstall")
    os.system("echo openstack-cas-ceilometer-uninstall >> /usr/bin/openstack-cas-uninstall")
    os.system("chmod a+x /usr/bin/openstack-cas-uninstall")
    
    if os.path.exists('/usr/bin/openstack-cas-version'):
        os.system("sed -i /pike_cas_ceilometer/d /usr/bin/openstack-cas-version")
    os.system("echo \"echo 'pike_cas_ceilometer R0785P03'\" >> /usr/bin/openstack-cas-version")
    os.system("chmod a+x /usr/bin/openstack-cas-version")

class myInstall(install):
    def run(self):
        install.run(self)
        self.execute(_post_install,(),msg="post install")

setup(
      name = 'pike_cas_ceilometer',
      version = 'R0785P03',
      author = 'CAS',
      packages = find_packages(),
      zip_safe = False,
      scripts = ['scripts/openstack-cas-ceilometer-uninstall'],
      entry_points = {
          'ceilometer.compute.virt' : [
              'cas = ceilometer.compute.virt.cas.inspector:CasInspector'
          ]
      },
      cmdclass = {
          'install': myInstall,
      }
)
