ALTER TABLE [SyncDS_ItemCommentLog] ADD [Url] nvarchar(4000) NULL
;

UPDATE [SyncDS_ItemCommentLog] set [Url]=''
;

ALTER TABLE [SyncDS_ItemCommentLog] ALTER COLUMN [Url] nvarchar(4000) NOT NULL
;

ALTER TABLE [SyncDS_User] ADD [UserTypeId] [int] NOT NULL DEFAULT 0
;

CREATE TABLE [SyncDS_UserType](
	[Id] [int] IDENTITY(1,1) primary key NOT NULL, 
	[Type] nvarchar(100))
;

INSERT into [SyncDS_UserType](Type) values(N'Server User')
;
INSERT into [SyncDS_UserType](Type) values(N'Active Directory User')
;
INSERT into [SyncDS_UserType](Type) values(N'Federation User')
;
INSERT into [SyncDS_ItemCommentLogType] (Name,IsActive) VALUES ( N'UserMention',1)
;