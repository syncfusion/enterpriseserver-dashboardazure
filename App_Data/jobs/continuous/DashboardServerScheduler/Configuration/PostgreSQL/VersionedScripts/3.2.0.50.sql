CREATE TABLE SyncDS_UmsCredential(
	Id SERIAL PRIMARY KEY NOT NULL,
	UmsUrl varchar(255),
	ClientId varchar(255),
	ClientSecret varchar(255),
	IsActive smallint NOT NULL)
;

CREATE TABLE SyncDS_UmsGroup(
	Id SERIAL PRIMARY KEY NOT NULL,
	GroupId int NOT NULL,
	UmsGroupId int NOT NULL,
	IsActive smallint NOT NULL)
;

ALTER TABLE SyncDS_UmsGroup ADD FOREIGN KEY(GroupId) REFERENCES SyncDS_Group (Id)
;

CREATE TABLE SyncDS_UmsUser(
	Id SERIAL PRIMARY KEY NOT NULL,
	UserId int NOT NULL,
	UmsUserId int NOT NULL,
	IsActive smallint NOT NULL)
;

ALTER TABLE SyncDS_UmsUser ADD FOREIGN KEY(UserId) REFERENCES SyncDS_User (Id)
;

ALTER TABLE SyncDS_User ALTER COLUMN Contact TYPE varchar(64)
;

ALTER TABLE SyncDS_Group ALTER COLUMN Color DROP NOT NULL
;
ALTER TABLE SyncDS_DashboardDataSource ADD COLUMN GroupId  int NULL
;
ALTER TABLE SyncDS_DashboardDataSource ADD FOREIGN KEY(GroupId) REFERENCES SyncDS_Group (Id)
;
INSERT into SyncDS_ExportType (Name,IsActive) VALUES (N'Refresh', 1)
;
ALTER TABLE SyncDS_Item ADD COLUMN IsDraft smallint NOT NULL DEFAULT 0
;
ALTER TABLE SyncDS_Item ADD COLUMN IsUnlisted smallint NOT NULL default 0
;
ALTER TABLE SyncDS_Item ADD COLUMN UnlistedCode varchar(20) NULL
;

insert into SyncDS_ItemType (Name,IsActive) values (N'Slideshow',1)
;

INSERT into SyncDS_PermissionEntity (Name,EntityType,ItemTypeId, IsActive) VALUES (N'Specific Slideshow',0,10,1)
;
INSERT into SyncDS_PermissionEntity (Name,EntityType,ItemTypeId, IsActive) VALUES (N'All Slideshow',1,10,1)
;

INSERT INTO SyncDS_PermissionAccEntity (PermissionEntityId, PermissionAccessId, IsActive) VALUES (22,1,1)
;
INSERT INTO SyncDS_PermissionAccEntity (PermissionEntityId, PermissionAccessId, IsActive) VALUES (21,2,1)
;
INSERT INTO SyncDS_PermissionAccEntity (PermissionEntityId, PermissionAccessId, IsActive) VALUES (22,2,1)
;
INSERT INTO SyncDS_PermissionAccEntity (PermissionEntityId, PermissionAccessId, IsActive) VALUES (21,3,1)
;
INSERT INTO SyncDS_PermissionAccEntity (PermissionEntityId, PermissionAccessId, IsActive) VALUES (22,3,1)
;
INSERT INTO SyncDS_PermissionAccEntity (PermissionEntityId, PermissionAccessId, IsActive) VALUES (21,4,1)
;
INSERT INTO SyncDS_PermissionAccEntity (PermissionEntityId, PermissionAccessId, IsActive) VALUES (22,4,1)
;

CREATE TABLE SyncDS_SlideshowInfo(
	Id SERIAL PRIMARY KEY NOT NULL,
	SlideshowId uuid NOT NULL,
	ItemInfo varchar(4000) NOT NULL,
	loopInterval int NOT NULL,
	IsActive smallint NOT NULL)
;

ALTER TABLE SyncDS_SlideshowInfo  ADD FOREIGN KEY(SlideshowId) REFERENCES SyncDS_Item (Id)
;

INSERT INTO SyncDS_GroupPermission (PermissionAccessId, PermissionEntityId, ItemId, GroupId, IsActive) VALUES (1,22,null,1,1)
;
INSERT INTO SyncDS_GroupPermission (PermissionAccessId, PermissionEntityId, ItemId, GroupId, IsActive) VALUES (14,22,null,1,1)
;