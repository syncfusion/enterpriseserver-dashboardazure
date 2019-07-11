ALTER TABLE [SyncDS_Item] ADD [IsWebDesignerCompatible] [bit] NOT NULL DEFAULT 0
;
UPDATE [SyncDS_PermissionEntity] SET [Name]='All Slideshows' WHERE [Id]='22'
;

CREATE TABLE [SyncDS_LookupTableMetaDataInfo](
	[Id] [int] IDENTITY(1,1) PRIMARY KEY NOT NULL,
	[TableSchema] nvarchar(4000) NOT NULL,
	[TableName] nvarchar(4000) NOT NULL,
	[PublishId] nvarchar(4000) NOT NULL,
	[ScheduleId] nvarchar(4000) NOT NULL,
	[Type] nvarchar(4000) NOT NULL,
	[CreatedDate] [datetime] NOT NULL,
	[ModifiedDate] [datetime] NOT NULL)
;

CREATE TABLE [SyncDS_UserData](
	[Id] [int] IDENTITY(1,1) PRIMARY KEY NOT NULL,
	[UserId] nvarchar(4000) NOT NULL,
	[Data] ntext NOT NULL,
	[CreatedDate] [datetime] NOT NULL,
	[ModifiedDate] [datetime] NOT NULL)
;