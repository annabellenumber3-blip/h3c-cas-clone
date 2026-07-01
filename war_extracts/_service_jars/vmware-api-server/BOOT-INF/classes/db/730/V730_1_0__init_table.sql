CREATE TABLE IF NOT EXISTS TBL_PARAMETER (
  ID BIGSERIAL,
  TYPE VARCHAR(256) NOT NULL,
  NAME VARCHAR(256) NOT NULL,
  VALUE VARCHAR(512),
  PRIMARY KEY (ID)
);


insert into TBL_PARAMETER (TYPE,NAME,VALUE) select 'open_vmware_file','VIXDISKLIB_FLAG_DEFAULT','5.5,6.0' where not exists (select * from TBL_PARAMETER where type='open_vmware_file' and name='VIXDISKLIB_FLAG_DEFAULT');
insert into TBL_PARAMETER (TYPE,NAME,VALUE) select 'open_vmware_file','VIXDISKLIB_FLAG_OPEN_UNBUFFERED','' where not exists (select * from TBL_PARAMETER where type='open_vmware_file' and name='VIXDISKLIB_FLAG_OPEN_UNBUFFERED');
insert into TBL_PARAMETER (TYPE,NAME,VALUE) select 'open_vmware_file','VIXDISKLIB_FLAG_OPEN_SINGLE_LINK','' where not exists (select * from TBL_PARAMETER where type='open_vmware_file' and name='VIXDISKLIB_FLAG_OPEN_SINGLE_LINK');
insert into TBL_PARAMETER (TYPE,NAME,VALUE) select 'open_vmware_file','VIXDISKLIB_FLAG_OPEN_READ_ONLY','' where not exists (select * from TBL_PARAMETER where type='open_vmware_file' and name='VIXDISKLIB_FLAG_OPEN_READ_ONLY');
insert into TBL_PARAMETER (TYPE,NAME,VALUE) select 'open_vmware_file','VIXDISKLIB_FLAG_OPEN_COMPRESSION_ZLIB','6.5,7.0' where not exists (select * from TBL_PARAMETER where type='open_vmware_file' and name='VIXDISKLIB_FLAG_OPEN_COMPRESSION_ZLIB');
