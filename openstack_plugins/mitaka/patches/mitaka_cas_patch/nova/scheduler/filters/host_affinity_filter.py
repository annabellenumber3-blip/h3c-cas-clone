# add by zhangmingze, 2014-2-10

from oslo_log import log as logging

from nova import context
from nova.objects import InstanceList
from nova.scheduler import filters

LOG = logging.getLogger(__name__)

class _HostAntiAffinityFilter(filters.BaseHostFilter):
    """Schedule the instance on a different host from a set of group
    hosts.
    """
    def host_passes(self, host_state, spec_obj, *args, **kwargs):
        # Only invoke the filter is 'anti-affinity' is configured
        policies = (spec_obj.instance_group.policies
                    if spec_obj.instance_group else [])
        if self.policy_name not in policies:
            return True
        
        _context = context.get_admin_context()
        members = spec_obj.instance_group.members if spec_obj.instance_group else []
        
        vmfilters = {'uuid':members,'deleted':False}
        instances = InstanceList.get_by_filters(_context, vmfilters, use_slave=True)
        
        for instance in instances:
            if spec_obj.instance_uuid == instance.uuid:
                continue
            
            if instance.host is None or instance.node is None:
                continue
        
            if host_state.host != instance.host or host_state.nodename == instance.node:
                LOG.debug("instance host anti-affinity is false, host_state is %s" % host_state)
                return False
        
        LOG.debug("instance host anti-affinity is true, host_state is %s" % host_state)
        return True

class HostAntiAffinityFilter(_HostAntiAffinityFilter):
    def __init__(self, *args, **kwargs):
        self.policy_name = 'host-anti-affinity'
        super(HostAntiAffinityFilter, self).__init__(*args, **kwargs)

class _HostAffinityFilter(filters.BaseHostFilter):
    """Schedule the instance on to host from a set of group hosts.
    """
    def host_passes(self, host_state, spec_obj, *args, **kwargs):
        # Only invoke the filter is 'affinity' is configured
        policies = (spec_obj.instance_group.policies
                    if spec_obj.instance_group else [])
        if self.policy_name not in policies:
            return True
        
        _context = context.get_admin_context()
        members = spec_obj.instance_group.members if spec_obj.instance_group else []
        
        vmfilters = {'uuid':members,'deleted':False}
        instances = InstanceList.get_by_filters(_context, vmfilters, use_slave=True)
        
        for instance in instances:
            if spec_obj.instance_uuid == instance.uuid:
                continue
            
            if instance.host is None or instance.node is None:
                continue
            
            if host_state.host == instance.host and host_state.nodename == instance.node:
                break
            else:
                LOG.debug("instance host affinity is false, host_state is %s" % host_state)
                return False
        
        LOG.debug("instance host affinity is true, host_state is %s" % host_state)
        return True

class HostAffinityFilter(_HostAffinityFilter):
    def __init__(self, *args, **kwargs):
        self.policy_name = 'host-affinity'
        super(HostAffinityFilter, self).__init__(*args, **kwargs)
