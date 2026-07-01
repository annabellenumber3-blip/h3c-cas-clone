from ceilometer.compute.virt.cas.inspectors.base import standard
from ceilometer.compute.virt.cas.inspectors.base import cache

class CasOfficialInspector(object):
    can_patch = True
    
    def __init__(self, session, conf):
        self._inspector = standard.CasStandardInspector(session)
    
    def patch_inspector(self, session):
        self._inspector = cache.CasCacheInspector(session)
    
    def __getattr__(self, attr):
        return getattr(self._inspector, attr)