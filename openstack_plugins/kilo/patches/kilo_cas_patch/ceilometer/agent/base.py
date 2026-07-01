from ceilometer.agent import original_base
from ceilometer.compute.pollsters import custom

for attr in dir(original_base):
    if attr not in ['__builtins__', '__file__', '__module__', '__doc__', '__name__', '__package__']:
        globals()[attr] = getattr(original_base,attr)


class PollingTask(original_base.PollingTask):
    
    def __init__(self, agent_manager):
        super(PollingTask,self).__init__(agent_manager)
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
            custom_pollster = custom.CustomPollster()
            PollingTask._custom_pollster = custom_pollster
        return custom_pollster
    
    def add(self, pollster, pipeline):
        super(PollingTask,self).add(pollster,pipeline)
    
        self._duration = pipeline.get_interval()

    def poll_and_publish(self):
        cache = {}
        polling_resources = {}
        discovery_cache = {}
    
        for source_name in self.pollster_matches:
            for pollster in self.pollster_matches[source_name]:
                key = Resources.key(source_name,pollster)
                candidate_res = list(
                    self.resources[key].get(discovery_cache))
                if not candidate_res and pollster.obj.default_discovery:
                    candidate_res = self.manager.discover(
                        [pollster.obj.default_discovery],discovery_cache)
            
                black_res = self.resources[key].blacklist
                for x in candidate_res:
                    if x not in black_res:
                        if x not in polling_resources:
                            polling_resources[x] = {}
                        pollsters = polling_resources[x]
                        if pollster.name not in pollsters:
                            pollsters[pollster.name] = {'pollster_obj':pollster,'source':[]}
                        pollsters[pollster.name]['source'].append(source_name)
    
        for instance,pollsters in polling_resources.items():
            try:
                self.custom_pollster.get_samples(manager=self.manager,cache=cache,resources=[instance],
                    duration=self._duration)
            except Exception:
                continue
        
            for pollster_name,pollster in pollsters.items():
                try:
                    samples = pollster['pollster_obj'].obj.get_samples(
                        manager=self.manager,
                        cache=cache,
                        resources=[instance]
                    )
                
                    # filter None in samples
                    samples = [s for s in samples if s is not None]
                
                    for source_name in pollster['source']:
                        with self.publishers[source_name] as publisher:
                            publisher(samples)
                except plugin_base.PollsterPermanentError as err:
                    for source_name in pollster['source']:
                        LOG.error(_(
                            'Prevent pollster %(name)s for '
                            'polling source %(source)s anymore!')
                                  % ({'name':pollster_name,'source':source_name}))
                        key = Resources.key(source_name,pollster['pollster_obj'])
                        self.resources[key].blacklist.extend(err.fail_res_list)
                except Exception as err:
                    LOG.warning(_(
                        'Continue after error from %(name)s: %(error)s')
                                % ({'name':pollster_name,'error':err}),
                        exc_info=True)

class AgentManager(original_base.AgentManager):

    def __init__(self, namespaces, pollster_list, group_prefix=None):
        super(AgentManager,self).__init__(namespaces,pollster_list)
        if namespaces == ['compute']:
            if cfg.CONF.hypervisor_inspector == 'cas':
                self.create_polling_task = self._create_polling_task
            else:
                LOG.info(_("hypervisor inspector is %s, do standard processes.") % cfg.CONF.hypervisor_inspector)
        else:
            LOG.info(_("namespaces %s is not only 'compute', do standard processes.") % namespaces)
    
    def _create_polling_task(self):
        """Create an initially empty polling task."""
        try:
            return PollingTask(self)
        except Exception:
            return super(AgentManager,self).create_polling_task()
