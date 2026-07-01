import uuid
import copy

from ceilometer.i18n import _
from ceilometer.agent import origin_manager
from ceilometer.compute.pollsters import custom

for attr in dir(origin_manager):
    if attr not in ['__builtins__', '__file__', '__module__', '__doc__', '__name__', '__package__']:
        globals()[attr] = getattr(origin_manager,attr)

class PollingTask(origin_manager.PollingTask):
    def __init__(self, agent_manager):
        super(PollingTask,self).__init__(agent_manager)
        self._uuid = uuid.uuid1()
        if self.custom_pollster.inspector.can_patch():
            self.custom_pollster.inspector.patch_inspector()
        else:
            LOG.info(_("cas inspector can't patch, do standard processes."))
            raise Exception()
    
    @property
    def custom_pollster(self):
        try:
            custom_pollster = self._custom_pollster
        except AttributeError:
            custom_pollster = custom.CustomPollster(self.manager.conf)
            custom_pollster.setup_inspector(self._uuid)
            self._custom_pollster = custom_pollster
        return custom_pollster
    
    def add(self, pollster, source):
        pollster_copy = copy.copy(pollster)
        pollster_copy.obj = copy.copy(pollster.obj)
        pollster_copy.obj.setup_inspector(self._uuid)
        super(PollingTask,self).add(pollster_copy,source)
        
        self._duration = source.get_interval()
    
    def poll_and_notify(self):
        cache = {}
        polling_resources = {}
        discovery_cache = {}
        
        for source_name in self.pollster_matches:
            for pollster in self.pollster_matches[source_name]:
                key = Resources.key(source_name, pollster)
                candidate_res = list(
                    self.resources[key].get(discovery_cache))
                if not self.resources[key]._discovery:
                    if not candidate_res and pollster.obj.default_discovery:
                        candidate_res = self.manager.discover(
                            [pollster.obj.default_discovery], discovery_cache)
                
                black_res = self.resources[key].blacklist
                for x in candidate_res:
                    if x not in black_res:
                        if x not in polling_resources:
                            polling_resources[x] = {}
                        pollsters = polling_resources[x]
                        if pollster.name not in pollsters:
                            pollsters[pollster.name] = {'pollster_obj':pollster,'source':[]}
                        pollsters[pollster.name]['source'].append(source_name)
        
        for instance, pollsters in polling_resources.items():
            try:
                self.custom_pollster.get_samples(manager=self.manager,cache=cache,resources=[instance],duration=self._duration)
            except Exception:
                continue
            
            for pollster_name, pollster in pollsters.items():
                try:
                    polling_timestamp = timeutils.utcnow().isoformat()
                    samples = pollster['pollster_obj'].obj.get_samples(
                            manager=self.manager,
                            cache=cache,
                            resources=[instance]
                        )
                    sample_batch = []
                    
                    # filter None in samples
                    samples = [s for s in samples if s is not None]
                    
                    for sample in samples:
                        sample.set_timestamp(polling_timestamp) 
                        sample_dict = (
                            publisher_utils.meter_message_from_counter(
                                sample, self._telemetry_secret
                            ))
                        if self._batch:
                            sample_batch.append(sample_dict)
                        else:
                            self._send_notification([sample_dict])
    
                    if sample_batch:
                        self._send_notification(sample_batch)
    
                except plugin_base.PollsterPermanentError as err:
                    for source_name in pollster['source']:
                        LOG.error(_(
                            'Prevent pollster %(name)s for '
                            'polling source %(source)s anymore!')
                            % ({'name': pollster_name, 'source': source_name}))
                        key = Resources.key(source_name, pollster['pollster_obj'])
                        self.resources[key].blacklist.extend(err.fail_res_list)
                except Exception as err:
                    LOG.warning(_(
                        'Continue after error from %(name)s: %(error)s')
                        % ({'name': pollster_name, 'error': err}),
                        exc_info=True)

class AgentManager(origin_manager.AgentManager):
    def __init__(self, worker_id, conf, namespaces=None, pollster_list=None):
        super(AgentManager,self).__init__(worker_id,conf,namespaces,pollster_list)
        
        if namespaces == ['compute']:
            if conf.hypervisor_inspector == 'cas':
                self.create_polling_task = self._create_polling_task
            else:
                LOG.info(_("hypervisor inspector is %s, do standard processes.") % conf.hypervisor_inspector)
        else:
            LOG.info(_("namespaces %s is not only 'compute', do standard processes.") % namespaces)
    
    def _create_polling_task(self):
        """Create an initially empty polling task."""
        try:
            return PollingTask(self)
        except Exception:
            return super(AgentManager,self).create_polling_task()
