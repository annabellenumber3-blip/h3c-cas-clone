--   表 vmware.tbl_scheduled_job结构
CREATE TABLE IF NOT EXISTS tbl_scheduled_job (
    id BIGSERIAL,
    bean_name VARCHAR(128) NOT NULL,  --'bean名称',
    method_name VARCHAR(128) NOT NULL, --'方法名称',
    method_params VARCHAR(128), --'方法参数',
    cron_expression VARCHAR(128), --'cron表达式, 和周期执行任务方式(开始延迟时间、任务执行间隔)互斥, 如果该值不为空，优先使用cron方式',
    start_delay INT,  --'开始延迟时间（ms）, 和cron方式互斥, 如果cronExpression不为空，优先使用cron方式',
    repeat_interval INT,  --'任务执行间隔(ms), 和cron方式互斥, 如果cronExpression不为空，优先使用cron方式',
    job_status INT NOT NULL,  --'状态（1正常 0暂停）',
    type VARCHAR(128) NOT NULL,  --'定时任务类型： cas/casserver/performance',
    description VARCHAR(1024), --'描述',
    PRIMARY KEY (ID)
);

INSERT INTO tbl_scheduled_job (bean_name, method_name, cron_expression, job_status, type) SELECT 'jobCleanMigrateTask', 'cleanMigrateTask', '0 0 0 * * ?', 1, 'vmware' WHERE NOT EXISTS(SELECT 1 FROM tbl_scheduled_job WHERE type = 'vmware' AND bean_name= 'jobCleanMigrateTask' AND method_name = 'cleanMigrateTask');
INSERT INTO tbl_scheduled_job (bean_name, method_name, repeat_interval, job_status, type) SELECT 'JobBackupStrategyTask', 'executeInternal', 600000, 1, 'vmware' WHERE NOT EXISTS(SELECT 1 FROM tbl_scheduled_job WHERE type = 'vmware' AND bean_name= 'JobBackupStrategyTask' AND method_name = 'executeInternal');
INSERT INTO tbl_scheduled_job (bean_name, method_name, repeat_interval, job_status, type) SELECT 'JobVMwareTask', 'executeInternal', 600000, 1, 'vmware' WHERE NOT EXISTS(SELECT 1 FROM tbl_scheduled_job WHERE type = 'vmware' AND bean_name= 'JobVMwareTask' AND method_name = 'executeInternal');

INSERT INTO TBL_PARAMETER (TYPE,NAME,VALUE) SELECT 'inner_processor_size','MAX_SCHEDULE_THREAD_NUM','4' WHERE NOT exists (SELECT * FROM TBL_PARAMETER WHERE TYPE='inner_processor_size' AND NAME='MAX_SCHEDULE_THREAD_NUM');