ALTER TABLE SyncDS_ItemCommentLogType ADD UNIQUE (Name)
;
ALTER TABLE SyncDS_ConditionCategory ADD UNIQUE (Name)
;
ALTER TABLE SyncDS_ExportType ADD UNIQUE (Name)
;
ALTER TABLE SyncDS_ItemLogType ADD UNIQUE (Name)
;
ALTER TABLE SyncDS_ItemType ADD UNIQUE (Name)
;
ALTER TABLE SyncDS_PermissionEntity ADD UNIQUE (Name)
;
ALTER TABLE SyncDS_RecurrenceType ADD UNIQUE (Name)
;
ALTER TABLE SyncDS_SystemLogType ADD UNIQUE (Name)
;
ALTER TABLE SyncDS_UserLogType ADD UNIQUE (Name)
;
ALTER TABLE SyncDS_UserType ADD UNIQUE (Type)
;

CREATE TABLE SyncDS_PermissionAccess(
	Id SERIAL PRIMARY KEY NOT NULL,
	Name varchar(100) NOT NULL UNIQUE,
	AccessId int NOT NULL,
	IsActive smallint NOT NULL )
;

CREATE TABLE SyncDS_PermissionAccEntity(
	Id SERIAL PRIMARY KEY NOT NULL,
	PermissionEntityId int NOT NULL,
	PermissionAccessId int NOT NULL,
	IsActive smallint NOT NULL )
;

ALTER TABLE SyncDS_PermissionAccEntity  ADD FOREIGN KEY(PermissionEntityId) REFERENCES SyncDS_PermissionEntity (Id)
;
ALTER TABLE SyncDS_PermissionAccEntity  ADD FOREIGN KEY(PermissionAccessId) REFERENCES SyncDS_PermissionAccess (Id)
;

INSERT into SyncDS_PermissionAccess (Name,AccessId,IsActive) VALUES ( N'Create',1,1)
;																	  
INSERT into SyncDS_PermissionAccess (Name,AccessId,IsActive) VALUES ( N'Read',2,1)
;																	  
INSERT into SyncDS_PermissionAccess (Name,AccessId,IsActive) VALUES ( N'Read, Write',6,1)
;																	  
INSERT into SyncDS_PermissionAccess (Name,AccessId,IsActive) VALUES ( N'Read, Write, Delete',14,1)
;																	  
INSERT into SyncDS_PermissionAccess (Name,AccessId,IsActive) VALUES ( N'Read, Download',18,1)
;																	  
INSERT into SyncDS_PermissionAccess (Name,AccessId,IsActive) VALUES ( N'Read, Write, Download',22,1)
;																	  
INSERT into SyncDS_PermissionAccess (Name,AccessId,IsActive) VALUES ( N'Read, Write, Delete, Download',30,1)
;

INSERT INTO SyncDS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (4,1,1)
;
INSERT INTO SyncDS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (6,1,1)
;
INSERT INTO SyncDS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (10,1,1)
;
INSERT INTO SyncDS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (12,1,1)
;
INSERT INTO SyncDS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (13,1,1)
;
INSERT INTO SyncDS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (15,1,1)
;
INSERT INTO SyncDS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (12,2,1)
;
INSERT INTO SyncDS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (13,2,1)
;
INSERT INTO SyncDS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (14,2,1)
;
INSERT INTO SyncDS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (4,2,1)
;
INSERT INTO SyncDS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (5,2,1)
;
INSERT INTO SyncDS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (10,2,1)
;
INSERT INTO SyncDS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (11,2,1)
;
INSERT INTO SyncDS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (15,2,1)
;
INSERT INTO SyncDS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (16,2,1)
;
INSERT INTO SyncDS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (4,3,1)
;
INSERT INTO SyncDS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (5,3,1)
;
INSERT INTO SyncDS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (10,3,1)
;
INSERT INTO SyncDS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (11,3,1)
;
INSERT INTO SyncDS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (4,4,1)
;
INSERT INTO SyncDS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (5,4,1)
;
INSERT INTO SyncDS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (10,4,1)
;
INSERT INTO SyncDS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (11,4,1)
;
INSERT INTO SyncDS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (12,5,1)
;
INSERT INTO SyncDS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (13,5,1)
;
INSERT INTO SyncDS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (14,5,1)
;
INSERT INTO SyncDS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (15,5,1)
;
INSERT INTO SyncDS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (16,5,1)
;
INSERT INTO SyncDS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (6,5,1)
;
INSERT INTO SyncDS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (7,5,1)
;
INSERT INTO SyncDS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (12,6,1)
;
INSERT INTO SyncDS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (13,6,1)
;
INSERT INTO SyncDS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (14,6,1)
;
INSERT INTO SyncDS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (15,6,1)
;
INSERT INTO SyncDS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (16,6,1)
;
INSERT INTO SyncDS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (6,6,1)
;
INSERT INTO SyncDS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (7,6,1)
;
INSERT INTO SyncDS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (12,7,1)
;
INSERT INTO SyncDS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (13,7,1)
;
INSERT INTO SyncDS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (14,7,1)
;
INSERT INTO SyncDS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (6,7,1)
;
INSERT INTO SyncDS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (7,7,1)
;
INSERT INTO SyncDS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (15,7,1)
;
INSERT INTO SyncDS_PermissionAccEntity (PermissionEntityId,PermissionAccessId,IsActive) VALUES (16,7,1)
;

UPDATE SyncDS_UserPermission SET PermissionAccessId='18' WHERE PermissionAccessId='2' AND PermissionEntityId NOT IN ('4', '5', '10', '11', '19', '20')
;
UPDATE SyncDS_UserPermission SET PermissionAccessId='22' WHERE PermissionAccessId='6' AND PermissionEntityId NOT IN ('4', '5', '10', '11', '19', '20')
;
UPDATE SyncDS_UserPermission SET PermissionAccessId='30' WHERE PermissionAccessId='14' AND PermissionEntityId NOT IN ('4', '5', '10', '11', '19', '20')
;

UPDATE SyncDS_GroupPermission SET PermissionAccessId='18' WHERE PermissionAccessId='2' AND PermissionEntityId NOT IN ('4', '5', '10', '11', '19', '20')
;
UPDATE SyncDS_GroupPermission SET PermissionAccessId='22' WHERE PermissionAccessId='6' AND PermissionEntityId NOT IN ('4', '5', '10', '11', '19', '20')
;
UPDATE SyncDS_GroupPermission SET PermissionAccessId='30' WHERE PermissionAccessId='14' AND PermissionEntityId NOT IN ('4', '5', '10', '11', '19', '20')
;

ALTER TABLE SyncDS_MultiDashboardMap RENAME TO SyncDS_MultiTabDashboard
;

CREATE TABLE SyncDS_CustomExpression(
	Id SERIAL PRIMARY KEY NOT NULL,
	DashboardId uuid NOT NULL,
	WidgetId uuid NOT NULL,
	DatasourceId varchar(255) NOT NULL,
	UserId int NOT NULL,
	Name varchar(255) NOT NULL,
	Expression varchar(4000) NOT NULL,
	ColumnInfo varchar(4000) NOT NULL,
	IsActive smallint NOT NULL)
;

ALTER TABLE SyncDS_CustomExpression  ADD FOREIGN KEY(DashboardId) REFERENCES SyncDS_Item (Id)
;
ALTER TABLE SyncDS_CustomExpression  ADD FOREIGN KEY(WidgetId) REFERENCES SyncDS_Item (Id)
;
ALTER TABLE SyncDS_CustomExpression  ADD FOREIGN KEY(UserId) REFERENCES SyncDS_User (Id)
;