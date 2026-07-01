from nova.objects.compute_node import ComputeNodeList
from nova.conductor.tasks import origin_live_migrate

for attr in dir(origin_live_migrate):
    if attr not in ['__builtins__', '__file__', '__module__', '__doc__', '__name__', '__package__']:
        globals()[attr] = getattr(origin_live_migrate,attr)

class LiveMigrationTask(origin_live_migrate.LiveMigrationTask):
    def __init__(self, context, instance, destination,
                 block_migration, disk_over_commit, migration, compute_rpcapi,
                 servicegroup_api, scheduler_client, **kwargs):
        super(LiveMigrationTask,self).__init__(context,instance,destination,
                                               block_migration,disk_over_commit,migration,compute_rpcapi,
                                               servicegroup_api,scheduler_client,**kwargs)
    
    def _check_destination_is_not_source(self):
        pass
    
    def _check_destination_has_enough_memory(self, *args, **kwargs):
        listNode = ComputeNodeList.get_all_by_host(self.context,self.destination)
        if len(listNode) == 1:
            super(LiveMigrationTask,self)._check_destination_has_enough_memory(*args,**kwargs)
