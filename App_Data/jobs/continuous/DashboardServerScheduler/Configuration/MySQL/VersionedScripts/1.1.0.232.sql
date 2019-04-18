ALTER TABLE {database_name}.SyncDS_ItemCommentLog ADD Url varchar(4000) NULL
;

UPDATE {database_name}.SyncDS_ItemCommentLog set Url=''
;

ALTER TABLE {database_name}.SyncDS_ItemCommentLog MODIFY COLUMN Url varchar(4000) NOT NULL
;

ALTER TABLE {database_name}.SyncDS_User  ADD UserTypeId int NOT NULL DEFAULT 0
;

CREATE TABLE {database_name}.SyncDS_UserType(
	Id int NOT NULL AUTO_INCREMENT,
	Type varchar(100),
	PRIMARY KEY (Id))
;

INSERT into {database_name}.SyncDS_UserType(Type) values('Server User')
;
INSERT into {database_name}.SyncDS_UserType(Type) values('Active Directory User')
;
INSERT into {database_name}.SyncDS_UserType(Type) values('Federation User')
;
INSERT into {database_name}.SyncDS_ItemCommentLogType (Name,IsActive) VALUES ( 'UserMention',1)
;