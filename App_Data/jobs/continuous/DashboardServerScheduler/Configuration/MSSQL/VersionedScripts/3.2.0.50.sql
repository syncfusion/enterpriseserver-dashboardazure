CREATE TABLE [SyncDS_UmsCredential](
	[Id] [int] IDENTITY(1,1) primary key NOT NULL,
	[UmsUrl] [nvarchar](255),
	[ClientId] [nvarchar](100),
	[ClientSecret] [nvarchar](100),
	[IsActive] [bit] NOT NULL)
;

CREATE TABLE [SyncDS_UmsGroup](
	[Id] [int] IDENTITY(1,1) primary key NOT NULL,
	[GroupId] [int] NOT NULL,
	[UmsGroupId] [int] NOT NULL,
	[IsActive] [bit] NOT NULL)
;

ALTER TABLE [SyncDS_UmsGroup] ADD FOREIGN KEY([GroupId]) REFERENCES [SyncDS_Group] ([Id])
;

CREATE TABLE [SyncDS_UmsUser](
	[Id] [int] IDENTITY(1,1) primary key NOT NULL,
	[UserId] [int] NOT NULL,
	[UmsUserId] [int] NOT NULL,
	[IsActive] [bit] NOT NULL)
;

ALTER TABLE [SyncDS_UmsUser] ADD FOREIGN KEY([UserId]) REFERENCES [SyncDS_User] ([Id])
;

ALTER TABLE [SyncDS_User] ALTER COLUMN [Contact] [nvarchar](64) NULL
;

ALTER TABLE [SyncDS_DashboardDataSource] ADD  [GroupId] INT NULL
;
ALTER TABLE [SyncDS_DashboardDataSource]  ADD FOREIGN KEY([GroupId]) REFERENCES [SyncDS_Group] ([Id])
;
INSERT into [SyncDS_ExportType] (Name,IsActive) VALUES (N'Refresh', 1)
;
ALTER TABLE [SyncDS_Item] ADD [IsDraft] [bit] NOT NULL DEFAULT 0
;
ALTER TABLE [SyncDS_Item]  ADD [UnlistedCode] [nvarchar](20) NULL
;
ALTER TABLE [SyncDS_Item]  ADD [IsUnlisted] Bit Not Null default '0'
;

CREATE TABLE [SyncDS_SlideshowInfo](
	[Id] [int] IDENTITY(1,1) PRIMARY KEY NOT NULL,
	[SlideshowId] [uniqueidentifier] NOT NULL,
	[ItemInfo] nvarchar(4000) NOT NULL,
	[loopInterval] [int] NOT NULL,
	[IsActive] [bit] NOT NULL)
;

ALTER TABLE [SyncDS_SlideshowInfo]  ADD FOREIGN KEY([SlideshowId]) REFERENCES [SyncDS_Item] ([Id])
;


Insert INTO [SyncDS_ItemType] ([Name], [IsActive]) Values ('Slideshow',1)
;
INSERT into [SyncDS_PermissionEntity] (Name,EntityType,ItemTypeId, IsActive) VALUES (N'Specific Slideshow',0,10,1)
;
INSERT into [SyncDS_PermissionEntity] (Name,EntityType,ItemTypeId, IsActive) VALUES (N'All Slideshow',1,10,1)
;
INSERT INTO [SyncDS_PermissionAccEntity] (PermissionEntityId, PermissionAccessId, IsActive) VALUES (22,1,1)
;
INSERT INTO [SyncDS_PermissionAccEntity] (PermissionEntityId, PermissionAccessId, IsActive) VALUES (21,2,1)
;
INSERT INTO [SyncDS_PermissionAccEntity] (PermissionEntityId, PermissionAccessId, IsActive) VALUES (22,2,1)
;
INSERT INTO [SyncDS_PermissionAccEntity] (PermissionEntityId, PermissionAccessId, IsActive) VALUES (21,3,1)
;
INSERT INTO [SyncDS_PermissionAccEntity] (PermissionEntityId, PermissionAccessId, IsActive) VALUES (22,3,1)
;
INSERT INTO [SyncDS_PermissionAccEntity] (PermissionEntityId, PermissionAccessId, IsActive) VALUES (21,4,1)
;
INSERT INTO [SyncDS_PermissionAccEntity] (PermissionEntityId, PermissionAccessId, IsActive) VALUES (22,4,1)
;
INSERT INTO [SyncDS_GroupPermission] (PermissionAccessId, PermissionEntityId, ItemId, GroupId, IsActive) VALUES (1,22,null,1,1)
;
INSERT INTO [SyncDS_GroupPermission] (PermissionAccessId, PermissionEntityId, ItemId, GroupId, IsActive) VALUES (14,22,null,1,1)
;