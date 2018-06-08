INSERT INTO SyncDS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (8,1,1)
;
INSERT INTO SyncDS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (8,5,1)
;
INSERT INTO SyncDS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (9,5,1)
;
INSERT INTO SyncDS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (8,6,1)
;
INSERT INTO SyncDS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (9,6,1)
;
INSERT INTO SyncDS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (8,7,1)
;
INSERT INTO SyncDS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (9,7,1)
;

CREATE TABLE SyncDS_HomepageItemFilter(
	Id SERIAL primary key NOT NULL,
	HomepageId uuid NOT NULL,
	FilterId int NOT NULL,
	QueryString varchar(4000) NOT NULL,
	ModifiedDate timestamp NOT NULL,
	IsActive smallint NOT NULL)
;

ALTER TABLE SyncDS_HomepageItemFilter  ADD  FOREIGN KEY(HomepageId) REFERENCES SyncDS_Homepage (Id)
;
ALTER TABLE [SyncDS_User] ALTER COLUMN [Contact] [nvarchar](64) NULL
;