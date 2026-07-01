delete from TBL_PARAMETER where name='i18n.language';

create extension postgres_fdw;
create server local_server foreign data wrapper postgres_fdw options (host '127.0.0.1', dbname 'vservice');
create user mapping for ${jdbc.username} server local_server options (user '${jdbc.username}', password '${jdbc.password}');
create foreign table
    t_temp_parameter(ID BIGSERIAL, TYPE VARCHAR(256) NOT NULL, NAME VARCHAR(256) NOT NULL, VALUE VARCHAR(512))
    server local_server options(schema_name 'public', table_name 'tbl_parameter');
INSERT INTO TBL_PARAMETER(TYPE, NAME, VALUE) SELECT TYPE, NAME,VALUE FROM t_temp_parameter B WHERE B.NAME='i18n.language';

drop foreign table t_temp_parameter;
drop user mapping for ${jdbc.username} server local_server;
drop server local_server;
drop extension postgres_fdw;