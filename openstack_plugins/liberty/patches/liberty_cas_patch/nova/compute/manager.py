from nova.compute import origin_manager

for attr in dir(origin_manager):
    if attr not in ['__builtins__', '__file__', '__module__', '__doc__', '__name__', '__package__']:
        globals()[attr] = getattr(origin_manager,attr)

class ComputeManager(origin_manager.ComputeManager):
    def __init__(self, compute_driver=None, *args, **kwargs):
        super(ComputeManager,self).__init__(compute_driver=None, *args, **kwargs)
    
    def rebuild_instance(self, context, instance, orig_image_ref, image_ref,
                         injected_files, new_pass, orig_sys_metadata,
                         bdms, recreate, on_shared_storage=None,
                         preserve_ephemeral=False, migration=None,
                         scheduled_node=None, limits=None, **kwargs):
        
        super(ComputeManager,self).rebuild_instance(context, instance, orig_image_ref, image_ref,
                                                    injected_files, new_pass, orig_sys_metadata,
                                                    bdms, recreate, on_shared_storage,
                                                    preserve_ephemeral, migration,
                                                    scheduled_node, limits, **kwargs)
        
        if scheduled_node is None:
            if hasattr(self.driver,'get_instance_real_nodename'):
                nodename = self.driver.get_instance_real_nodename(instance)
                instance.node = nodename
                instance.save()
    
    def post_live_migration_at_destination(self, context, instance, block_migration, *args, **kwargs):
        super(ComputeManager,self).post_live_migration_at_destination(context,instance,block_migration,*args,**kwargs)
        
        if hasattr(self.driver,'get_instance_real_nodename'):
            nodename = self.driver.get_instance_real_nodename(instance)
            instance.node = nodename
            instance.save()
    
    def _sync_instance_power_state(self, context, db_instance, vm_power_state, use_slave=False):
        """
        in case of using cas driver,power_state and vm_state are always updated from hypervisor(CVM) to db
        do not send cmd to hypervisor(CVM)
        """
        if CONF.compute_driver != 'casapi.CasDriver':
            super(ComputeManager,self)._sync_instance_power_state(context, db_instance, vm_power_state, use_slave)
            return
        
        db_instance.refresh(use_slave=use_slave)
        db_power_state = db_instance.power_state
        if self.host != db_instance.host:
            LOG.info("During the sync_power process the "
                     "instance has moved from "
                     "host %(src)s to host %(dst)s",
                     {'src': db_instance.host,
                      'dst': self.host},
                     instance=db_instance)
            return
        elif db_instance.task_state is not None:
            LOG.info("During sync_power_state the instance has a "
                     "pending task (%(task)s). Skip.",
                     {'task': db_instance.task_state},
                     instance=db_instance)
            return
        
        if db_instance.vm_state in (vm_states.RESIZED,
                                    vm_states.BUILDING,
                                    vm_states.RESCUED,
                                    vm_states.SUSPENDED,
                                    vm_states.ERROR,
                                    vm_states.PAUSED,
                                    vm_states.SHELVED,
                                    vm_states.SHELVED_OFFLOADED):
            LOG.debug("Now pass: db_instance.vm_state:%s" % db_instance.vm_state)
            return
        
        sync_states = {
            power_state.NOSTATE:vm_states.ERROR,
            power_state.RUNNING:vm_states.ACTIVE,
            power_state.PAUSED:vm_states.PAUSED,
            power_state.SHUTDOWN:vm_states.STOPPED,
            power_state.CRASHED:vm_states.ERROR,
            power_state.SUSPENDED:vm_states.SUSPENDED}
        if (vm_power_state != db_power_state or db_instance.vm_state != sync_states[vm_power_state]):
            LOG.info('During _sync_instance_power_state:'
                     'db_vm_state (%(db_vm_state)s) != hypervisor_vm_state (%(hypervisor_vm_state)s) \nOr '
                     'db_power_state (%(db_power_state)s) != hypervisor_power_state (%(hypervisor_power_state)s).'
                     'Updating the power and vm states in the DB to match the hypervisor.',
                     {'db_vm_state':db_instance.vm_state,
                     'hypervisor_vm_state':sync_states[vm_power_state],
                     'db_power_state':db_power_state,
                     'hypervisor_power_state':vm_power_state},
                     instance=db_instance)
            
            db_instance.power_state = vm_power_state
            db_instance.vm_state = sync_states[vm_power_state]
            db_instance.save()
    
    def _query_driver_power_state_and_sync(self, context, db_instance):
        if CONF.compute_driver != 'casapi.CasDriver':
            super(ComputeManager,self)._query_driver_power_state_and_sync(context, db_instance)
            return
        
        if db_instance.task_state is not None:
            LOG.info("During sync_power_state the instance has a "
                     "pending task (%(task)s). Skip.",
                     {'task': db_instance.task_state}, instance=db_instance)
            return
        # No pending tasks. Now try to figure out the real vm_power_state.
        try:
            if 'check_managed' in self.driver.get_info.__code__.co_varnames:
                vm_instance = self.driver.get_info(db_instance,check_managed=True)
            else:
                vm_instance = self.driver.get_info(db_instance)
            
            vm_power_state = vm_instance.state
        except exception.InstanceNotFound:
            vm_power_state = power_state.NOSTATE
        # Note(maoy): the above get_info call might take a long time,
        # for example, because of a broken libvirt driver.
        try:
            self._sync_instance_power_state(context,
                                            db_instance,
                                            vm_power_state,
                                            use_slave=True)
        except exception.InstanceNotFound:
            # NOTE(hanlind): If the instance gets deleted during sync,
            # silently ignore.
            pass
    
