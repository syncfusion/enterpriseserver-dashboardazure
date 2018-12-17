CREATE TABLE "SyncDS_UmsCredential"(
	"Id" int PRIMARY KEY NOT NULL,
	"UmsUrl" NVARCHAR2(255),
	"ClientId" NVARCHAR2(255),
	"ClientSecret" NVARCHAR2(255),
    "IsActive" NUMBER(1) NOT NULL)
;

CREATE SEQUENCE "SyncDS_UmsCredential_seq"
START WITH     1
INCREMENT BY   1
NOCACHE
NOCYCLE;

CREATE TABLE "SyncDS_UmsGroup"(
	"Id" int PRIMARY KEY NOT NULL,
	"GroupId" int NOT NULL,
	"UmsGroupId" int NOT NULL,
	"IsActive" NUMBER(1) NOT NULL)
	;

CREATE SEQUENCE "SyncDS_UmsGroup_seq"
START WITH     1
INCREMENT BY   1
NOCACHE
NOCYCLE;

ALTER TABLE "SyncDS_UmsGroup" ADD FOREIGN KEY("GroupId") REFERENCES "SyncDS_Group" ("Id")
;

CREATE TABLE "SyncDS_UmsUser"(
	"Id" int PRIMARY KEY NOT NULL,
	"UserId" int NOT NULL,
	"UmsUserId" int NOT NULL,
	"IsActive" NUMBER(1) NOT NULL)
	;

CREATE SEQUENCE "SyncDS_UmsUser_seq"
START WITH     1
INCREMENT BY   1
NOCACHE
NOCYCLE;

ALTER TABLE "SyncDS_UmsUser" ADD FOREIGN KEY("UserId") REFERENCES "SyncDS_User" ("Id")
;

ALTER TABLE "SyncDS_User" MODIFY "Contact" NVARCHAR2(64)
;

ALTER TABLE "SyncDS_DashboardDataSource" ADD  "GroupId" INT NULL
;
ALTER TABLE "SyncDS_DashboardDataSource" ADD FOREIGN KEY("GroupId") REFERENCES "SyncDS_Group" ("Id")
;
INSERT into "SyncDS_ExportType" ("Id","Name","IsActive") VALUES ("SyncDS_ExportType_seq".nextval,'Refresh', 1)
;
ALTER TABLE "SyncDS_Item" ADD "IsDraft" NUMBER(1) DEFAULT (0) NOT NULL
;
ALTER TABLE "SyncDS_Item" ADD "IsUnlisted" Number(1) NOT NULL default 0
;
ALTER TABLE "SyncDS_Item" ADD "UnlistedCode" NVARCHAR2(20) NULL
;


insert into "SyncDS_ItemType" ("Id","Name","IsActive") VALUES ("SyncDS_ItemType_seq".nextval,'Slideshow',1)
;

INSERT into "SyncDS_PermissionEntity" ("Id","Name","EntityType","ItemTypeId","IsActive") VALUES ("SyncDS_PermissionEntity_seq".nextval,'Specific Slideshow',0,10,1)
;
INSERT into "SyncDS_PermissionEntity" ("Id","Name","EntityType","ItemTypeId","IsActive") VALUES ("SyncDS_PermissionEntity_seq".nextval,'All Slideshow',1,10,1)
;

INSERT INTO "SyncDS_PermissionAccEntity" ("Id","PermissionEntityId", "PermissionAccessId", "IsActive") VALUES("SyncDS_PermissionAccEntity_seq".nextval,22,1,1)
;
INSERT INTO "SyncDS_PermissionAccEntity" ("Id","PermissionEntityId", "PermissionAccessId", "IsActive") VALUES("SyncDS_PermissionAccEntity_seq".nextval,21,2,1)
;
INSERT INTO "SyncDS_PermissionAccEntity" ("Id","PermissionEntityId", "PermissionAccessId", "IsActive") VALUES("SyncDS_PermissionAccEntity_seq".nextval,22,2,1)
;
INSERT INTO "SyncDS_PermissionAccEntity" ("Id","PermissionEntityId", "PermissionAccessId", "IsActive") VALUES("SyncDS_PermissionAccEntity_seq".nextval,21,3,1)
;
INSERT INTO "SyncDS_PermissionAccEntity" ("Id","PermissionEntityId", "PermissionAccessId", "IsActive") VALUES("SyncDS_PermissionAccEntity_seq".nextval,22,3,1)
;
INSERT INTO "SyncDS_PermissionAccEntity" ("Id","PermissionEntityId", "PermissionAccessId", "IsActive") VALUES("SyncDS_PermissionAccEntity_seq".nextval,21,4,1)
;
INSERT INTO "SyncDS_PermissionAccEntity" ("Id","PermissionEntityId", "PermissionAccessId", "IsActive") VALUES("SyncDS_PermissionAccEntity_seq".nextval,22,4,1)
;

CREATE TABLE "SyncDS_SlideshowInfo"(
	"Id" int PRIMARY KEY NOT NULL,
	"SlideshowId" NCHAR(36) NOT NULL,
	"ItemInfo" VARCHAR2(4000) NOT NULL,
	"LoopInterval" int NOT NULL,
	"IsActive" NUMBER(1) NOT NULL )
;

CREATE SEQUENCE "SyncDS_SlideshowInfo_seq"
START WITH     1
INCREMENT BY   1
NOCACHE
NOCYCLE;

ALTER TABLE "SyncDS_SlideshowInfo"  ADD FOREIGN KEY("SlideshowId") REFERENCES "SyncDS_Item" ("Id")
;

insert into "SyncDS_GroupPermission" ("Id", "PermissionAccessId", "PermissionEntityId", "ItemId", "GroupId", "IsActive") VALUES ("SyncDS_ItemType_seq".nextval,1,22,null,1,1)
;
insert into "SyncDS_GroupPermission" ("Id", "PermissionAccessId", "PermissionEntityId", "ItemId", "GroupId", "IsActive") VALUES ("SyncDS_ItemType_seq".nextval,14,22,null,1,1)
;