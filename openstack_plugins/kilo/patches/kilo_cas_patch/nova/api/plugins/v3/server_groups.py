from oslo_config import cfg
from nova.api.openstack.compute.plugins.v3 import origin_server_groups

cas_opts = [
    cfg.BoolOpt('replace_server_group_policy',
               deprecated_name='cas_replace',
               deprecated_group='DEFAULT',
               default = False,
               help='Replace Original affinity policy to host-affinity.'
                    'Replace Original anti-affinity policy to host-anti-affinity.'),
    ]

CONF = cfg.CONF
CONF.register_opts(cas_opts, 'cas')

for attr in dir(origin_server_groups):
    if attr not in ['__builtins__', '__file__', '__module__', '__doc__', '__name__', '__package__']:
        globals()[attr] = getattr(origin_server_groups,attr)

origin_controller_class = ServerGroupController

class ServerGroupController():
    def __init__(self, *args, **kwargs):
        self._controller = origin_controller_class(*args,**kwargs)
    
    def create(self, *args, **kwargs):
        if CONF.cas.replace_server_group_policy:
            body = kwargs['body']
            policies = body['server_group'].get('policies',[])
            if 'affinity' in policies:
                policies.remove('affinity')
                policies.append('host-affinity')
            if 'anti-affinity' in policies:
                policies.remove('anti-affinity')
                policies.append('host-anti-affinity')
        
        return self._controller.create(*args, **kwargs)
    
    def __getattr__(self, attr):
            return getattr(self._controller, attr)

setattr(origin_server_groups,'ServerGroupController',ServerGroupController)
