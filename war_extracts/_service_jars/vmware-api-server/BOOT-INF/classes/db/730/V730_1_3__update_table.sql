ALTER TABLE TBL_VM_MIGRATE_STORAGE ADD COLUMN IF NOT EXISTS SRC_DEVICE_MIGRATED_CAPACITY bigint DEFAULT 0;
ALTER TABLE TBL_VM_MIGRATE_TASK ADD COLUMN IF NOT EXISTS LAST_MIGRATE_TIME TIMESTAMP;

insert into TBL_PARAMETER (TYPE,NAME,VALUE) select 'processor_size','MAX_DATACENTER_THREAD_NUM','2' where not exists (select * from TBL_PARAMETER where type='processor_size' and name='MAX_DATACENTER_THREAD_NUM');
insert into TBL_PARAMETER (TYPE,NAME,VALUE) select 'processor_size','MAX_CLUSTER_THREAD_NUM','2' where not exists (select * from TBL_PARAMETER where type='processor_size' and name='MAX_CLUSTER_THREAD_NUM');
insert into TBL_PARAMETER (TYPE,NAME,VALUE) select 'processor_size','MAX_HOST_THREAD_NUM','4' where not exists (select * from TBL_PARAMETER where type='processor_size' and name='MAX_HOST_THREAD_NUM');
insert into TBL_PARAMETER (TYPE,NAME,VALUE) select 'processor_size','MAX_VM_THREAD_NUM','8' where not exists (select * from TBL_PARAMETER where type='processor_size' and name='MAX_VM_THREAD_NUM');
insert into TBL_PARAMETER (TYPE,NAME,VALUE) select 'processor_size','MAX_AGENT_THREAD_NUM','4' where not exists (select * from TBL_PARAMETER where type='processor_size' and name='MAX_AGENT_THREAD_NUM');

