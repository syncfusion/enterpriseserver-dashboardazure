INSERT INTO "SyncDS_PermissionAccEntity" ("Id","PermissionEntityId", "PermissionAccessId", "IsActive") VALUES("SyncDS_PermissionAccEntity_seq".nextval,8,1,1)
;
INSERT INTO "SyncDS_PermissionAccEntity" ("Id","PermissionEntityId", "PermissionAccessId", "IsActive") VALUES("SyncDS_PermissionAccEntity_seq".nextval,8,5,1)
;
INSERT INTO "SyncDS_PermissionAccEntity" ("Id","PermissionEntityId", "PermissionAccessId", "IsActive") VALUES("SyncDS_PermissionAccEntity_seq".nextval,9,5,1)
;
INSERT INTO "SyncDS_PermissionAccEntity" ("Id","PermissionEntityId", "PermissionAccessId", "IsActive") VALUES("SyncDS_PermissionAccEntity_seq".nextval,8,6,1)
;
INSERT INTO "SyncDS_PermissionAccEntity" ("Id","PermissionEntityId", "PermissionAccessId", "IsActive") VALUES("SyncDS_PermissionAccEntity_seq".nextval,9,6,1)
;
INSERT INTO "SyncDS_PermissionAccEntity" ("Id","PermissionEntityId", "PermissionAccessId", "IsActive") VALUES("SyncDS_PermissionAccEntity_seq".nextval,8,7,1)
;
INSERT INTO "SyncDS_PermissionAccEntity" ("Id","PermissionEntityId", "PermissionAccessId", "IsActive") VALUES("SyncDS_PermissionAccEntity_seq".nextval,9,7,1)
;
CREATE TABLE "SyncDS_HomepageItemFilter"(
	"Id" int primary key NOT NULL,
	"HomepageId" NCHAR(36) NOT NULL,
	"FilterId" int NOT NULL,
	"QueryString" VARCHAR2(4000) NOT NULL,
	"ModifiedDate" DATE NOT NULL,
	"IsActive" NUMBER(1) NOT NULL)
;
CREATE SEQUENCE "SyncDS_HomepageItemFilter_seq"
START WITH     1
INCREMENT BY   1
NOCACHE
NOCYCLE;
ALTER TABLE "SyncDS_HomepageItemFilter"  ADD FOREIGN KEY("HomepageId") REFERENCES "SyncDS_Homepage" ("Id")
;
ALTER TABLE [SyncDS_User] ALTER COLUMN [Contact] [nvarchar](64) NULL
;