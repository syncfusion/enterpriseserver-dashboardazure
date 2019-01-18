CREATE TABLE {database_name}.SyncDS_UmsCredential(
	Id int AUTO_INCREMENT NOT NULL,
	UmsUrl varchar(255),
	ClientId varchar(255),
	ClientSecret varchar(255),
    IsActive bit NOT NULL,
	PRIMARY KEY (Id))
;

CREATE TABLE {database_name}.SyncDS_UmsGroup(
	Id int AUTO_INCREMENT NOT NULL,
	GroupId int NOT NULL,
	UmsGroupId int NOT NULL,
	IsActive tinyint(1) NOT NULL,
	PRIMARY KEY (Id))
;

ALTER TABLE {database_name}.SyncDS_UmsGroup ADD FOREIGN KEY(GroupId) REFERENCES {database_name}.SyncDS_Group (Id)
;

CREATE TABLE {database_name}.SyncDS_UmsUser(
	Id int AUTO_INCREMENT NOT NULL,
	UserId int NOT NULL,
	UmsUserId int NOT NULL,
	IsActive tinyint(1) NOT NULL,
	PRIMARY KEY (Id))
;

ALTER TABLE {database_name}.SyncDS_UmsUser ADD FOREIGN KEY(UserId) REFERENCES {database_name}.SyncDS_User (Id)
;

ALTER TABLE {database_name}.SyncDS_User MODIFY Contact varchar(64)
;

ALTER TABLE {database_name}.SyncDS_DashboardDataSource ADD GroupId INT NULL
;
ALTER TABLE {database_name}.SyncDS_DashboardDataSource ADD FOREIGN KEY(GroupId) REFERENCES {database_name}.SyncDS_Group (Id)
;
INSERT into {database_name}.SyncDS_ExportType (Name,IsActive) VALUES ('Refresh', 1)
;
ALTER TABLE {database_name}.SyncDS_Item ADD IsDraft tinyint(1) NOT NULL DEFAULT 0
;
ALTER TABLE {database_name}.SyncDS_Item ADD UnlistedCode varchar(20) NULL
;
ALTER TABLE {database_name}.SyncDS_Item ADD IsUnlisted tinyint(1) NOT NULL default 0
;


insert into {database_name}.SyncDS_ItemType (Name,IsActive) values (N'Slideshow',1)
;

INSERT into {database_name}.SyncDS_PermissionEntity (Name,EntityType,ItemTypeId,IsActive) VALUES (N'Specific Slideshow',0,10,1)
;
INSERT into {database_name}.SyncDS_PermissionEntity (Name,EntityType,ItemTypeId,IsActive) VALUES (N'All Slideshow',1,10,1)
;

INSERT into {database_name}.SyncDS_PermissionAccEntity (PermissionEntityId, PermissionAccessId, IsActive) VALUES (22,1,1), (21,2,1), (22,2,1), (21,3,1), (22,3,1), (21,4,1), (22,4,1)
;

CREATE TABLE {database_name}.SyncDS_SlideshowInfo(
	Id int NOT NULL AUTO_INCREMENT,
	SlideshowId char(38) NOT NULL,
	ItemInfo varchar(4000) NOT NULL,
	loopInterval int NOT NULL,
	IsActive tinyint(1) NOT NULL,
	PRIMARY KEY (Id))
;

ALTER TABLE {database_name}.SyncDS_SlideshowInfo  ADD FOREIGN KEY(SlideshowId) REFERENCES {database_name}.SyncDS_Item (Id)
;

INSERT into {database_name}.SyncDS_GroupPermission (PermissionAccessId, PermissionEntityId, ItemId, GroupId, IsActive) VALUES (1,22,null,1,1)
;
INSERT into {database_name}.SyncDS_GroupPermission (PermissionAccessId, PermissionEntityId, ItemId, GroupId, IsActive) VALUES (14,22,null,1,1)
;