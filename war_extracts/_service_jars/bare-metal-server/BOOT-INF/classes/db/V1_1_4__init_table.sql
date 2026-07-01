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
    type VARCHAR(128) NOT NULL,  --'定时任务类型： cas/casserver/performance/bareMetal',
    description VARCHAR(1024), --'描述',
    PRIMARY KEY (ID)
);