from nova.api.openstack.compute.schemas import origin_server_groups

for attr in dir(origin_server_groups):
    if attr not in ['__builtins__', '__file__', '__module__', '__doc__', '__name__', '__package__']:
        globals()[attr] = getattr(origin_server_groups,attr)

policies = create['properties']['server_group']['properties']['policies']
policies['items'][0]['enum'].extend(['host-anti-affinity', 'host-affinity'])
