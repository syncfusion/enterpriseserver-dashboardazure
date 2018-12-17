ALTER TABLE SyncDS_Item ADD COLUMN IsWebDesignerCompatible smallint NOT NULL DEFAULT 0
;
UPDATE SyncDS_PermissionEntity SET Name='All Slideshows' WHERE Id='22'
;

CREATE TABLE SyncDS_LookupTableMetaDataInfo(
	Id SERIAL PRIMARY KEY NOT NULL,
	TableSchema varchar(4000) NOT NULL,
	TableName varchar(4000) NOT NULL,
	PublishId varchar(4000) NOT NULL,
	ScheduleId varchar(4000) NOT NULL,
	Type varchar(4000) NOT NULL,
	CreatedDate timestamp NOT NULL,
	ModifiedDate timestamp NOT NULL)
;

CREATE TABLE SyncDS_UserData(
	Id SERIAL PRIMARY KEY NOT NULL,
	UserId varchar(4000) NOT NULL,
	Data text NOT NULL,
	CreatedDate timestamp NOT NULL,
	ModifiedDate timestamp NOT NULL)
;