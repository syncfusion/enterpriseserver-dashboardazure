INSERT into {database_name}.SyncDS_PermissionAccEntity (PermissionEntityId, PermissionAccessId, IsActive) VALUES (8,1,1), (8,5,1), (9,5,1), (8,6,1), (9,6,1), (8,7,1), (9,7,1)
;
CREATE TABLE {database_name}.SyncDS_HomepageItemFilter(
Id int NOT NULL AUTO_INCREMENT,
HomepageId char(38) NOT NULL,
FilterId int NOT NULL,
QueryString varchar(4000) NOT NULL,
ModifiedDate datetime NOT NULL,
IsActive tinyint(1) NOT NULL,
PRIMARY KEY (Id))
;
ALTER TABLE {database_name}.SyncDS_HomepageItemFilter ADD FOREIGN KEY(HomepageId) REFERENCES {database_name}.SyncDS_Homepage (Id)
;
ALTER TABLE [SyncDS_User] ALTER COLUMN [Contact] [nvarchar](64) NULL
;