ALTER TABLE tbl_vm_migrate_task ADD COLUMN IF NOT EXISTS operator_id bigint;  --  'cas用户ID';
ALTER TABLE tbl_vm_migrate_task ADD COLUMN IF NOT EXISTS login_name varchar(256); --   'cas用户登录名';
ALTER TABLE tbl_vm_migrate_task ADD COLUMN IF NOT EXISTS user_name varchar(256); --   'cas用户姓名';.