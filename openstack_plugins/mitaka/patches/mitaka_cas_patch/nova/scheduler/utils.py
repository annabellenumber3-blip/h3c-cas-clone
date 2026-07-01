from nova.scheduler import origin_utils

for attr in dir(origin_utils):
    if attr not in ['__builtins__', '__file__', '__module__', '__doc__', '__name__', '__package__']:
        globals()[attr] = getattr(origin_utils,attr)

_SUPPORTS_HOST_AFFINITY = None
_SUPPORTS_HOST_ANTI_AFFINITY = None

def setup_instance_group(context, request_spec, filter_properties, *args, **kwargs):
    """support host-affinity and host-anti-affinity policy"""
    global _SUPPORTS_HOST_AFFINITY
    if _SUPPORTS_HOST_AFFINITY is None:
        _SUPPORTS_HOST_AFFINITY = validate_filter('HostAffinityFilter')
    global _SUPPORTS_HOST_ANTI_AFFINITY
    if _SUPPORTS_HOST_ANTI_AFFINITY is None:
        _SUPPORTS_HOST_ANTI_AFFINITY = validate_filter('HostAntiAffinityFilter')
    
    instance_uuid = request_spec.get('instance_properties', {}).get('uuid')
    if not instance_uuid:
        return

    try:
        group = objects.InstanceGroup.get_by_instance_uuid(context,instance_uuid)
    except exception.InstanceGroupNotFound:
        return
    
    policies = set(('host-anti-affinity', 'host-affinity'))
    if any((policy in policies) for policy in group.policies):
        if not _SUPPORTS_HOST_AFFINITY and 'host-affinity' in group.policies:
            msg = _("HostAffinityFilter not configured")
            LOG.error(msg)
            raise exception.UnsupportedPolicyException(reason=msg)
        if not _SUPPORTS_HOST_ANTI_AFFINITY and 'host-anti-affinity' in group.policies:
            msg = _("HostAntiAffinityFilter not configured")
            LOG.error(msg)
            raise exception.UnsupportedPolicyException(reason=msg)
        
        group_hosts = set(group.get_hosts())
        user_group_hosts = filter_properties.get('group_hosts')
        user_hosts = set(user_group_hosts) if user_group_hosts else set()
        filter_properties['group_updated'] = True
        filter_properties['group_hosts'] = user_hosts | group_hosts
        filter_properties['group_policies'] = group.policies
        filter_properties['group_members'] = group.members
    else:
        origin_utils.setup_instance_group(context,request_spec,filter_properties,*args,**kwargs)
