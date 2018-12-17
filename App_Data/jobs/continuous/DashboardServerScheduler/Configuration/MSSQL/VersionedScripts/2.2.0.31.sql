CREATE TABLE [SyncDS_Homepage](
	[Id] [uniqueidentifier] primary key NOT NULL,
	[Name] nvarchar(255) NOT NULL,
	[UserId] [int] NOT NULL,
	[ItemInfo] nvarchar(4000) NOT NULL,
	[ItemType] nvarchar(100) NOT NULL,
	[IsDefaultHomepage] bit NOT NULL,
	[CreatedDate] [datetime] NOT NULL,
	[ModifiedDate] [datetime] NOT NULL,
	[IsActive] bit NOT NULL)
;

ALTER TABLE [SyncDS_Homepage]  ADD FOREIGN KEY([UserId]) REFERENCES [SyncDS_User] ([Id])
;

CREATE TABLE [SyncDS_MultiDashboardMap](
	[Id] [int] IDENTITY(1,1) PRIMARY KEY NOT NULL,
	[ParentDashboardId] [uniqueidentifier] NOT NULL,
	[ChildDashboardId] [uniqueidentifier] NOT NULL,
	[DashboardDesignerId] [uniqueidentifier] NOT NULL,
	[ModifiedDate] [datetime] NOT NULL,
	[IsActive] [bit] NOT NULL)
;

ALTER TABLE [SyncDS_MultiDashboardMap]  ADD FOREIGN KEY([ParentDashboardId]) REFERENCES [SyncDS_Item] ([Id])
;
ALTER TABLE [SyncDS_MultiDashboardMap]  ADD FOREIGN KEY([ChildDashboardId]) REFERENCES [SyncDS_Item] ([Id])
;

CREATE TABLE [SyncDS_DataNotification](
	[Id] [int] IDENTITY(1,1) PRIMARY KEY NOT NULL,
	[ScheduleId] [uniqueidentifier] NOT NULL,
	[Frequency] [int] NULL,
	[ConditionCategory] [int] NOT NULL,
	[PreviousValue]  text NULL,
	[PreviousData] text NULL,
	[IsActive] [bit] NOT NULL,
	[ColumnInfo] text NOT NULL,
	[ConditionInfo] text NULL,
	[ItemName] nvarchar(255) NOT NULL)
;

ALTER TABLE [SyncDS_DataNotification]  ADD FOREIGN KEY([ScheduleId]) REFERENCES [SyncDS_Item] ([Id])
;

ALTER TABLE [SyncDS_ScheduleDetail]  ADD [EmailContent] [nvarchar](4000) NULL
;

ALTER TABLE [SyncDS_ScheduleDetail]  ADD [IsDataChanges] Bit Not Null default '0'
;

ALTER TABLE [SyncDS_ScheduleDetail]  ADD [IsTimeInterval] Bit Not Null default '0'
;
ALTER TABLE [SyncDS_ScheduleDetail]  ALTER COLUMN  [RecurrenceTypeId] [int] NULL
;
ALTER TABLE [SyncDS_ScheduleDetail] ALTER COLUMN [RecurrenceInfo] [nvarchar](4000)  NULL
;
ALTER TABLE [SyncDS_ScheduleDetail]  ALTER COLUMN  [StartDate] [datetime] NULL
;
ALTER TABLE [SyncDS_ScheduleDetail] ALTER COLUMN [EndDate] [datetime] NULL
;
ALTER TABLE [SyncDS_ScheduleDetail]  ALTER COLUMN  [EndAfter] [int] NULL
;
ALTER TABLE [SyncDS_ScheduleDetail] ALTER COLUMN [NextSchedule] [datetime] NULL
;

CREATE TABLE [SyncDS_ConditionCategory](
	[Id] [int] IDENTITY(1,1) PRIMARY KEY NOT NULL,
	[Name] nvarchar(255) NULL,
	[IsActive] [bit] NOT NULL
)
;

INSERT into [SyncDS_ConditionCategory] (Name,IsActive) VALUES (N'Increases',1)
;
INSERT into [SyncDS_ConditionCategory] (Name,IsActive) VALUES (N'Continuously Increases',1)
;
INSERT into [SyncDS_ConditionCategory] (Name,IsActive) VALUES (N'Decreases',1)
;
INSERT into [SyncDS_ConditionCategory] (Name,IsActive) VALUES (N'Continuously Decreases',1)
;
INSERT into [SyncDS_ConditionCategory] (Name,IsActive) VALUES (N'Value Changes',1)
;
INSERT into [SyncDS_RecurrenceType] (Name,IsActive) VALUES (N'Hourly', 1)
;