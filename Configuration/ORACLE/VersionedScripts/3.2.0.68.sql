ALTER TABLE "SyncDS_Item" ADD "IsWebDesignerCompatible" NUMBER(1) DEFAULT (0) NOT NULL
;

UPDATE "SyncDS_PermissionEntity" SET "Name"='All Slideshows' WHERE "Id"='22'
;

CREATE TABLE "SyncDS_LookupTableMetaDataInfo"(
	"Id" int PRIMARY KEY NOT NULL,
	"TableSchema" VARCHAR2(4000) NOT NULL,
	"TableName" VARCHAR2(4000) NOT NULL,
	"PublishId" VARCHAR2(4000) NOT NULL,
	"ScheduleId" VARCHAR2(4000) NOT NULL,
	"Type" VARCHAR2(4000) NOT NULL,
	"CreatedDate" DATE NOT NULL,
	"ModifiedDate" DATE NOT NULL)
;

CREATE TABLE "SyncDS_UserData"(
	"Id" int PRIMARY KEY NOT NULL,
	"UserId" VARCHAR2(4000) NOT NULL,
	"Data" CLOB NOT NULL,
	"CreatedDate" DATE NOT NULL,
	"ModifiedDate" DATE NOT NULL)
;