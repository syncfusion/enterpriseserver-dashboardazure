CREATE TABLE {database_name}.SyncDS_Homepage(
Id char(38) NOT NULL,
Name varchar(255) NOT NULL,
UserId int NOT NULL,
ItemInfo varchar(4000) NOT NULL,
ItemType varchar(100) NOT NULL,
IsDefaultHomepage tinyint(1) NOT NULL,
CreatedDate datetime NOT NULL,
ModifiedDate datetime NOT NULL,
IsActive tinyint(1) NOT NULL,
PRIMARY KEY (Id))
;

ALTER TABLE {database_name}.SyncDS_Homepage ADD FOREIGN KEY(UserId) REFERENCES {database_name}.SyncDS_User (Id)
;

CREATE TABLE {database_name}.SyncDS_MultiDashboardMap(
	Id int NOT NULL AUTO_INCREMENT,
	ParentDashboardId char(38) NOT NULL,
    ChildDashboardId char(38) NOT NULL,
    DashboardDesignerId char(38) NOT NULL,
	ModifiedDate datetime NOT NULL,
	IsActive tinyint(1) NOT NULL,
	PRIMARY KEY (Id))
;

ALTER TABLE {database_name}.SyncDS_MultiDashboardMap  ADD FOREIGN KEY(ParentDashboardId) REFERENCES {database_name}.SyncDS_Item (Id)
;
ALTER TABLE {database_name}.SyncDS_MultiDashboardMap  ADD FOREIGN KEY(ChildDashboardId) REFERENCES {database_name}.SyncDS_Item (Id)
;

CREATE TABLE {database_name}.SyncDS_DataNotification(
	Id int AUTO_INCREMENT NOT NULL,
	ScheduleId char(38) NOT NULL,
	Frequency int NULL,
	ConditionCategory int NOT NULL,
	PreviousValue text NULL,
	PreviousData text NULL,
	IsActive tinyint(1) NOT NULL,
	ColumnInfo text NOT NULL,
	ConditionInfo text NULL,
    ItemName varchar(255) NOT NULL,PRIMARY KEY (Id))
;

ALTER TABLE {database_name}.SyncDS_DataNotification  ADD FOREIGN KEY(ScheduleId) REFERENCES {database_name}.SyncDS_Item (Id)
;

ALTER TABLE {database_name}.SyncDS_ScheduleDetail ADD EmailContent varchar(4000) NULL
;

ALTER TABLE {database_name}.SyncDS_ScheduleDetail ADD IsDataChanges tinyint(1) NOT NULL default 0
;

ALTER TABLE {database_name}.SyncDS_ScheduleDetail ADD IsTimeInterval tinyint(1) NOT NULL default 0
;
ALTER TABLE {database_name}.SyncDS_ScheduleDetail MODIFY  RecurrenceTypeId int NULL
;
ALTER TABLE {database_name}.SyncDS_ScheduleDetail MODIFY  RecurrenceInfo varchar(4000) NULL
;
ALTER TABLE {database_name}.SyncDS_ScheduleDetail MODIFY  StartDate datetime NULL
;
ALTER TABLE {database_name}.SyncDS_ScheduleDetail MODIFY  EndAfter int NULL DEFAULT 0
;
ALTER TABLE {database_name}.SyncDS_ScheduleDetail MODIFY  NextSchedule datetime NULL
;

CREATE TABLE {database_name}.SyncDS_ConditionCategory(
	Id int AUTO_INCREMENT NOT NULL,
	Name varchar(255) NULL,
	IsActive tinyint(1) NOT NULL,
	PRIMARY KEY (Id))
;

INSERT into {database_name}.SyncDS_ConditionCategory (Name,IsActive) VALUES ('Increases',1)
;
INSERT into {database_name}.SyncDS_ConditionCategory (Name,IsActive) VALUES ('Continuously Increases',1)
;
INSERT into {database_name}.SyncDS_ConditionCategory (Name,IsActive) VALUES ('Decreases',1)
;
INSERT into {database_name}.SyncDS_ConditionCategory (Name,IsActive) VALUES ('Continuously Decreases',1)
;
INSERT into {database_name}.SyncDS_ConditionCategory (Name,IsActive) VALUES ('Value Changes',1)
;

INSERT into {database_name}.SyncDS_RecurrenceType (Name,IsActive) VALUES ('Hourly', 1)
;