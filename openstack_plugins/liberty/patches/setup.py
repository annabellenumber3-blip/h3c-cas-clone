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

def _patch_nova_api():
    dstDir = _get_purelib() + '/nova/api/openstack/compute'
    srcDir = _get_purelib() + '/liberty_cas_patch/nova/api'
    
    for path in ['/','/schemas','/legacy_v2/contrib']:
        if os.path.exists(dstDir+path):
            if os.path.exists(dstDir+path+'/server_groups.py'):
                if os.path.exists(dstDir+path+'/origin_server_groups.py'):
                    os.system("rm -f %s/server_groups.py" % (dstDir+path))
                else:
                    os.system("mv %s/server_groups.py %s/origin_server_groups.py" % (dstDir+path,dstDir+path))
                os.system("ln -s %s/server_groups.py %s/server_groups.py" % (srcDir+path,dstDir+path))

def _patch_nova_scheduler():
    dstDir = _get_purelib() + '/nova/scheduler'
    srcDir = _get_purelib() + '/liberty_cas_patch/nova/scheduler'
    
    if os.path.exists(dstDir+'/utils.py'):
        if os.path.exists(dstDir+'/origin_utils.py'):
            os.system("rm -f %s/utils.py" % dstDir)
        else:
            os.system("mv %s/utils.py %s/origin_utils.py" % (dstDir,dstDir))
        os.system("ln -s %s/utils.py %s/utils.py" % (srcDir,dstDir))
    
    if os.path.exists(dstDir+'/filters/host_affinity_filter.py'):
        os.system("rm -f %s/filters/host_affinity_filter.py" % dstDir)
    os.system("ln -s %s/filters/host_affinity_filter.py %s/filters/host_affinity_filter.py" % (srcDir,dstDir))

def _patch_nova_conductor():
    dstDir = _get_purelib() + '/nova/conductor/tasks'
    srcDir = _get_purelib() + '/liberty_cas_patch/nova/conductor'
    if os.path.exists(dstDir+'/live_migrate.py'):
        if os.path.exists(dstDir+'/origin_live_migrate.py'):
            os.system("rm -f %s/live_migrate.py" % dstDir)
        else:
            os.system("mv %s/live_migrate.py %s/origin_live_migrate.py" % (dstDir,dstDir))
        os.system("ln -s %s/live_migrate.py %s/live_migrate.py" % (srcDir,dstDir))

def _patch_nova_compute():
    dstDir = _get_purelib() + '/nova/compute'
    srcDir = _get_purelib() + '/liberty_cas_patch/nova/compute'
    if os.path.exists(dstDir+'/manager.py'):
        if os.path.exists(dstDir+'/origin_manager.py'):
            os.system("rm -f %s/manager.py" % dstDir)
        else:
            os.system("mv %s/manager.py %s/origin_manager.py" % (dstDir,dstDir))
        os.system("ln -s %s/manager.py %s/manager.py" % (srcDir,dstDir))

def _patch_nova_objects():
    dstDir = _get_purelib() + '/nova/objects'
    srcDir = _get_purelib() + '/liberty_cas_patch/nova/objects'
    if os.path.exists(dstDir+'/numa.py'):
        if os.path.exists(dstDir+'/origin_numa.py'):
            os.system("rm -f %s/numa.py" % dstDir)
        else:
            os.system("mv %s/numa.py %s/origin_numa.py" % (dstDir,dstDir))
        os.system("ln -s %s/numa.py %s/numa.py" % (srcDir,dstDir))

def _patch_ceilometer_agent():
    dstDir = _get_purelib() + '/ceilometer/agent'
    srcDir = _get_purelib() + '/liberty_cas_patch/ceilometer/agent'
    if os.path.exists(dstDir+'/manager.py'):
        if os.path.exists(dstDir+'/origin_manager.py'):
            os.system("rm -f %s/manager.py" % dstDir)
        else:
            os.system("mv %s/manager.py %s/origin_manager.py" % (dstDir,dstDir))
        os.system("ln -s %s/manager.py %s/manager.py" % (srcDir,dstDir))

def _patch_ceilometer_compute():
    dstDir = _get_purelib() + '/ceilometer/compute'
    srcDir = _get_purelib() + '/liberty_cas_patch/ceilometer/compute'
    if os.path.exists(dstDir+'/pollsters/custom.py'):
        os.system("rm -f %s/pollsters/custom.py" % dstDir)
    os.system("ln -s %s/pollsters/custom.py %s/pollsters/custom.py" % (srcDir,dstDir))

def _patch_nova():
    _patch_nova_api()
    _patch_nova_scheduler()
    _patch_nova_conductor()
    _patch_nova_compute()
    _patch_nova_objects()

def _patch_ceilometer():
    _patch_ceilometer_agent()
    _patch_ceilometer_compute()

def _post_install():
    _patch_nova()
    _patch_ceilometer()
    
    if os.path.exists('/usr/bin/openstack-cas-uninstall'):
        os.system("sed -i /openstack-cas-patch-uninstall/d /usr/bin/openstack-cas-uninstall")
    os.system("echo openstack-cas-patch-uninstall >> /usr/bin/openstack-cas-uninstall")
    os.system("chmod a+x /usr/bin/openstack-cas-uninstall")
    
    if os.path.exists('/usr/bin/openstack-cas-version'):
        os.system("sed -i /liberty_cas_patch/d /usr/bin/openstack-cas-version")
    os.system("echo \"echo 'liberty_cas_patch R0785P03'\" >> /usr/bin/openstack-cas-version")
    os.system("chmod a+x /usr/bin/openstack-cas-version")

class myInstall(install):
    def run(self):
        install.run(self)
        self.execute(_post_install,(),msg="post install")

setup(
      name = 'liberty_cas_patch',
      version = 'R0785P03',
      author = 'CAS',
      packages = find_packages(),
      zip_safe = False,
      scripts = ['scripts/openstack-cas-patch-uninstall'],
      cmdclass = {
          'install': myInstall,
      }
)
