from oslo_log import log

from ceilometer.compute import pollsters
from ceilometer.i18n import _

LOG = log.getLogger(__name__)

class CustomPollster(pollsters.GenericComputePollster):
    
    def get_samples(self, manager, cache, resources, duration):
        for instance in resources:
            LOG.debug('checking instance %s', instance.id)
            try:
                self.inspector.inspect_custom(instance,duration)
                LOG.debug("INSTANCE CUSTOM: %(instance)s", {'instance': instance})
            except Exception as err:
                LOG.exception(_('fail to inspect custom for %(id)s: %(e)s'),
                              {'id': instance.id, 'e': err})
                raise err
