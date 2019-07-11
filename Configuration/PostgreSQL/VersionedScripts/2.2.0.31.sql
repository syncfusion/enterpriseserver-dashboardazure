CREATE TABLE SyncDS_Homepage(
	Id uuid PRIMARY KEY NOT NULL,
	Name varchar(255) NOT NULL,
	UserId int NOT NULL,
	ItemInfo varchar(4000) NOT NULL,
	ItemType varchar(100) NOT NULL,
	IsDefaultHomepage smallint NOT NULL,
    CreatedDate timestamp NOT NULL,
	ModifiedDate timestamp NOT NULL,
	IsActive smallint NOT NULL)
;

ALTER TABLE SyncDS_Homepage  ADD  FOREIGN KEY(UserId) REFERENCES SyncDS_User (Id)
;

CREATE TABLE SyncDS_MultiDashboardMap(
	Id SERIAL primary key NOT NULL,
	ParentDashboardId uuid NOT NULL,
	ChildDashboardId uuid NOT NULL,
	DashboardDesignerId uuid NOT NULL,
	ModifiedDate timestamp NOT NULL,
	IsActive smallint NOT NULL DEFAULT 0)
;

ALTER TABLE SyncDS_MultiDashboardMap  ADD FOREIGN KEY(ParentDashboardId) REFERENCES SyncDS_Item (Id)
;
ALTER TABLE SyncDS_MultiDashboardMap  ADD FOREIGN KEY(ChildDashboardId) REFERENCES SyncDS_Item (Id)
;

CREATE TABLE SyncDS_DataNotification(
	Id SERIAL PRIMARY KEY NOT NULL,
	ScheduleId uuid NOT NULL,
	Frequency int NULL,
	ConditionCategory int NOT NULL,
	PreviousValue text NULL,
    PreviousData text NULL,
	IsActive smallint NOT NULL,
	ColumnInfo text NOT NULL,
	ConditionInfo text NULL,
	ItemName varchar(255) NOT NULL)
;

ALTER TABLE SyncDS_DataNotification  ADD FOREIGN KEY(ScheduleId) REFERENCES SyncDS_Item (Id)
;

ALTER TABLE SyncDS_ScheduleDetail ADD COLUMN EmailContent varchar(4000) NULL
;

ALTER TABLE SyncDS_ScheduleDetail ADD COLUMN IsDataChanges smallint NOT NULL default 0
;

ALTER TABLE SyncDS_ScheduleDetail ADD COLUMN IsTimeInterval smallint NOT NULL default 0
;

CREATE TABLE SyncDS_ConditionCategory(
	Id SERIAL PRIMARY KEY NOT NULL,
	Name varchar(255) NULL,
	IsActive smallint NOT NULL)
;

INSERT into SyncDS_ConditionCategory (Name,IsActive) VALUES ( N'Increases',1)
;
INSERT into SyncDS_ConditionCategory (Name,IsActive) VALUES ( N'Continuously Increases',1)
;
INSERT into SyncDS_ConditionCategory (Name,IsActive) VALUES ( N'Decreases',1)
;
INSERT into SyncDS_ConditionCategory (Name,IsActive) VALUES ( N'Continuously Decreases',1)
;
INSERT into SyncDS_ConditionCategory (Name,IsActive) VALUES ( N'Value Changes',1)
;
ALTER TABLE SyncDS_ScheduleDetail ALTER COLUMN RecurrenceTypeId DROP NOT NULL
;
ALTER TABLE SyncDS_ScheduleDetail ALTER COLUMN RecurrenceInfo DROP NOT NULL
;
ALTER TABLE SyncDS_ScheduleDetail ALTER COLUMN StartDate DROP NOT NULL
;
ALTER TABLE SyncDS_ScheduleDetail ALTER COLUMN EndAfter DROP NOT NULL
;
ALTER TABLE SyncDS_ScheduleDetail ALTER COLUMN NextSchedule DROP NOT NULL
;
INSERT into SyncDS_RecurrenceType (Name,IsActive) VALUES (N'Hourly', 1)
;