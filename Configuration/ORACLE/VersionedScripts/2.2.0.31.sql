CREATE TABLE "SyncDS_Homepage"(
	"Id" NCHAR(36) primary key NOT NULL,
	"Name" NVARCHAR2(255) NOT NULL,
	"UserId" int NOT NULL,
	"ItemInfo" VARCHAR2(4000) NOT NULL,
	"ItemType" VARCHAR2(100) NOT NULL,
	"IsDefaultHomepage" NUMBER(1) NOT NULL,
    "CreatedDate" DATE NOT NULL,
	"ModifiedDate" DATE NOT NULL,
	"IsActive" NUMBER(1) NOT NULL)
;

ALTER TABLE "SyncDS_Homepage"  ADD FOREIGN KEY("UserId") REFERENCES "SyncDS_User" ("Id")
;

CREATE TABLE "SyncDS_MultiDashboardMap"(
	"Id" int PRIMARY KEY NOT NULL,
	"ParentDashboardId" NCHAR(36) NOT NULL,
	"ChildDashboardId" NCHAR(36) NOT NULL,
	"DashboardDesignerId" NCHAR(36) NOT NULL,
	"ModifiedDate" DATE NOT NULL,
	"IsActive" NUMBER(1) NOT NULL)
;

CREATE SEQUENCE "SyncDS_MultiDashboardMap_seq"
START WITH     1
INCREMENT BY   1
NOCACHE
NOCYCLE;

ALTER TABLE "SyncDS_MultiDashboardMap"  ADD FOREIGN KEY("ParentDashboardId") REFERENCES "SyncDS_Item" ("Id")
;
ALTER TABLE "SyncDS_MultiDashboardMap"  ADD FOREIGN KEY("ChildDashboardId") REFERENCES "SyncDS_Item" ("Id")
;

CREATE TABLE "SyncDS_DataNotification"(
	"Id" int PRIMARY KEY NOT NULL,
	"ScheduleId" NCHAR(36) NOT NULL,
	"Frequency" int NULL,
	"ConditionCategory" int NOT NULL,
	"PreviousValue" CLOB NULL,
	"PreviousData" CLOB NULL,
	"IsActive" NUMBER(1) NOT NULL,
	"ColumnInfo" CLOB NOT NULL,
	"ConditionInfo" CLOB NULL,
	"ItemName" NVARCHAR2(255) NOT NULL)
;

ALTER TABLE "SyncDS_DataNotification"  ADD FOREIGN KEY("ScheduleId") REFERENCES "SyncDS_Item" ("Id")
;

ALTER TABLE "SyncDS_ScheduleDetail" ADD "EmailContent" VARCHAR2(4000) NULL
;

ALTER TABLE "SyncDS_ScheduleDetail" ADD "IsDataChanges" Number(1) NOT NULL default 0
;

ALTER TABLE "SyncDS_ScheduleDetail" ADD "IsTimeInterval" Number(1) NOT NULL default 0
;

CREATE TABLE "SyncDS_ConditionCategory"(
	"Id" int PRIMARY KEY NOT NULL,
	"Name" VARCHAR2(255) NULL,
	"IsActive" NUMBER(1) NOT NULL)
	;

CREATE SEQUENCE "SyncDS_ConditionCategory_seq"
START WITH     1
INCREMENT BY   1
NOCACHE
NOCYCLE;

INSERT into "SyncDS_ConditionCategory" ("Id","Name","IsActive") VALUES ("SyncDS_ConditionCategory_seq".nextval,'Increases',1)
;
INSERT into "SyncDS_ConditionCategory" ("Id","Name","IsActive") VALUES ("SyncDS_ConditionCategory_seq".nextval,'Continuously Increases',1)
;
INSERT into "SyncDS_ConditionCategory" ("Id","Name","IsActive") VALUES ("SyncDS_ConditionCategory_seq".nextval,'Decreases',1)
;
INSERT into "SyncDS_ConditionCategory" ("Id","Name","IsActive") VALUES ("SyncDS_ConditionCategory_seq".nextval,'Continuously Decreases',1)
;
INSERT into "SyncDS_ConditionCategory" ("Id","Name","IsActive") VALUES ("SyncDS_ConditionCategory_seq".nextval,'Value Changes',1)
;
ALTER TABLE  "SyncDS_ScheduleDetail" MODIFY  "RecurrenceTypeId" int null;
ALTER TABLE  "SyncDS_ScheduleDetail" MODIFY  "RecurrenceInfo" VARCHAR2(4000) null;
ALTER TABLE  "SyncDS_ScheduleDetail" MODIFY  "StartDate" DATE  null;
ALTER TABLE  "SyncDS_ScheduleDetail" MODIFY  "EndAfter" int DEFAULT 0 null;
ALTER TABLE  "SyncDS_ScheduleDetail" MODIFY  "NextSchedule" DATE null;
INSERT into "SyncDS_RecurrenceType" ("Id","Name","IsActive") VALUES ("SyncDS_RecurrenceType_seq".nextval,'Hourly', 1)
;
CREATE SEQUENCE "SyncDS_DataNotification_seq"
START WITH     1
INCREMENT BY   1
NOCACHE
NOCYCLE;