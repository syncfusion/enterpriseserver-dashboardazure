ALTER TABLE {database_name}.SyncDS_Item ADD IsWebDesignerCompatible tinyint(1) NOT NULL DEFAULT 0
;

UPDATE {database_name}.SyncDS_PermissionEntity SET Name='All Slideshows' WHERE Id='22'
;

CREATE TABLE {database_name}.SyncDS_LookupTableMetaDataInfo(
	Id int NOT NULL AUTO_INCREMENT,
	TableSchema varchar(4000) NOT NULL,
	TableName varchar(4000) NOT NULL,
	PublishId varchar(4000) NOT NULL,
	ScheduleId varchar(4000) NOT NULL,
	Type varchar(4000) NOT NULL,
	CreatedDate datetime NOT NULL,
	ModifiedDate datetime NOT NULL,
	PRIMARY KEY (Id))
;

CREATE TABLE {database_name}.SyncDS_UserData(
	Id int NOT NULL AUTO_INCREMENT,
	UserId varchar(4000) NOT NULL,
	Data text NOT NULL,
	CreatedDate datetime NOT NULL,
	ModifiedDate datetime NOT NULL,
	PRIMARY KEY (Id))
;