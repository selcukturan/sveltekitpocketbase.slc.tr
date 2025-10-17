/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const snapshot = [
    {
      "createRule": null,
      "deleteRule": null,
      "fields": [
        {
          "autogeneratePattern": "[a-z0-9]{15}",
          "hidden": false,
          "id": "text3208210256",
          "max": 15,
          "min": 15,
          "name": "id",
          "pattern": "^[a-z0-9]+$",
          "presentable": false,
          "primaryKey": true,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "autogeneratePattern": "",
          "hidden": false,
          "id": "text455797646",
          "max": 0,
          "min": 0,
          "name": "collectionRef",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "autogeneratePattern": "",
          "hidden": false,
          "id": "text127846527",
          "max": 0,
          "min": 0,
          "name": "recordRef",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "autogeneratePattern": "",
          "hidden": false,
          "id": "text1582905952",
          "max": 0,
          "min": 0,
          "name": "method",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "hidden": false,
          "id": "autodate2990389176",
          "name": "created",
          "onCreate": true,
          "onUpdate": false,
          "presentable": false,
          "system": true,
          "type": "autodate"
        },
        {
          "hidden": false,
          "id": "autodate3332085495",
          "name": "updated",
          "onCreate": true,
          "onUpdate": true,
          "presentable": false,
          "system": true,
          "type": "autodate"
        }
      ],
      "id": "pbc_2279338944",
      "indexes": [
        "CREATE INDEX `idx_mfas_collectionRef_recordRef` ON `_mfas` (collectionRef,recordRef)"
      ],
      "listRule": "@request.auth.id != '' && recordRef = @request.auth.id && collectionRef = @request.auth.collectionId",
      "name": "_mfas",
      "system": true,
      "type": "base",
      "updateRule": null,
      "viewRule": "@request.auth.id != '' && recordRef = @request.auth.id && collectionRef = @request.auth.collectionId"
    },
    {
      "createRule": null,
      "deleteRule": null,
      "fields": [
        {
          "autogeneratePattern": "[a-z0-9]{15}",
          "hidden": false,
          "id": "text3208210256",
          "max": 15,
          "min": 15,
          "name": "id",
          "pattern": "^[a-z0-9]+$",
          "presentable": false,
          "primaryKey": true,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "autogeneratePattern": "",
          "hidden": false,
          "id": "text455797646",
          "max": 0,
          "min": 0,
          "name": "collectionRef",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "autogeneratePattern": "",
          "hidden": false,
          "id": "text127846527",
          "max": 0,
          "min": 0,
          "name": "recordRef",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "cost": 8,
          "hidden": true,
          "id": "password901924565",
          "max": 0,
          "min": 0,
          "name": "password",
          "pattern": "",
          "presentable": false,
          "required": true,
          "system": true,
          "type": "password"
        },
        {
          "autogeneratePattern": "",
          "hidden": true,
          "id": "text3866985172",
          "max": 0,
          "min": 0,
          "name": "sentTo",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": false,
          "system": true,
          "type": "text"
        },
        {
          "hidden": false,
          "id": "autodate2990389176",
          "name": "created",
          "onCreate": true,
          "onUpdate": false,
          "presentable": false,
          "system": true,
          "type": "autodate"
        },
        {
          "hidden": false,
          "id": "autodate3332085495",
          "name": "updated",
          "onCreate": true,
          "onUpdate": true,
          "presentable": false,
          "system": true,
          "type": "autodate"
        }
      ],
      "id": "pbc_1638494021",
      "indexes": [
        "CREATE INDEX `idx_otps_collectionRef_recordRef` ON `_otps` (collectionRef, recordRef)"
      ],
      "listRule": "@request.auth.id != '' && recordRef = @request.auth.id && collectionRef = @request.auth.collectionId",
      "name": "_otps",
      "system": true,
      "type": "base",
      "updateRule": null,
      "viewRule": "@request.auth.id != '' && recordRef = @request.auth.id && collectionRef = @request.auth.collectionId"
    },
    {
      "createRule": null,
      "deleteRule": "@request.auth.id != '' && recordRef = @request.auth.id && collectionRef = @request.auth.collectionId",
      "fields": [
        {
          "autogeneratePattern": "[a-z0-9]{15}",
          "hidden": false,
          "id": "text3208210256",
          "max": 15,
          "min": 15,
          "name": "id",
          "pattern": "^[a-z0-9]+$",
          "presentable": false,
          "primaryKey": true,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "autogeneratePattern": "",
          "hidden": false,
          "id": "text455797646",
          "max": 0,
          "min": 0,
          "name": "collectionRef",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "autogeneratePattern": "",
          "hidden": false,
          "id": "text127846527",
          "max": 0,
          "min": 0,
          "name": "recordRef",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "autogeneratePattern": "",
          "hidden": false,
          "id": "text2462348188",
          "max": 0,
          "min": 0,
          "name": "provider",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "autogeneratePattern": "",
          "hidden": false,
          "id": "text1044722854",
          "max": 0,
          "min": 0,
          "name": "providerId",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "hidden": false,
          "id": "autodate2990389176",
          "name": "created",
          "onCreate": true,
          "onUpdate": false,
          "presentable": false,
          "system": true,
          "type": "autodate"
        },
        {
          "hidden": false,
          "id": "autodate3332085495",
          "name": "updated",
          "onCreate": true,
          "onUpdate": true,
          "presentable": false,
          "system": true,
          "type": "autodate"
        }
      ],
      "id": "pbc_2281828961",
      "indexes": [
        "CREATE UNIQUE INDEX `idx_externalAuths_record_provider` ON `_externalAuths` (collectionRef, recordRef, provider)",
        "CREATE UNIQUE INDEX `idx_externalAuths_collection_provider` ON `_externalAuths` (collectionRef, provider, providerId)"
      ],
      "listRule": "@request.auth.id != '' && recordRef = @request.auth.id && collectionRef = @request.auth.collectionId",
      "name": "_externalAuths",
      "system": true,
      "type": "base",
      "updateRule": null,
      "viewRule": "@request.auth.id != '' && recordRef = @request.auth.id && collectionRef = @request.auth.collectionId"
    },
    {
      "createRule": null,
      "deleteRule": "@request.auth.id != '' && recordRef = @request.auth.id && collectionRef = @request.auth.collectionId",
      "fields": [
        {
          "autogeneratePattern": "[a-z0-9]{15}",
          "hidden": false,
          "id": "text3208210256",
          "max": 15,
          "min": 15,
          "name": "id",
          "pattern": "^[a-z0-9]+$",
          "presentable": false,
          "primaryKey": true,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "autogeneratePattern": "",
          "hidden": false,
          "id": "text455797646",
          "max": 0,
          "min": 0,
          "name": "collectionRef",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "autogeneratePattern": "",
          "hidden": false,
          "id": "text127846527",
          "max": 0,
          "min": 0,
          "name": "recordRef",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "autogeneratePattern": "",
          "hidden": false,
          "id": "text4228609354",
          "max": 0,
          "min": 0,
          "name": "fingerprint",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "hidden": false,
          "id": "autodate2990389176",
          "name": "created",
          "onCreate": true,
          "onUpdate": false,
          "presentable": false,
          "system": true,
          "type": "autodate"
        },
        {
          "hidden": false,
          "id": "autodate3332085495",
          "name": "updated",
          "onCreate": true,
          "onUpdate": true,
          "presentable": false,
          "system": true,
          "type": "autodate"
        }
      ],
      "id": "pbc_4275539003",
      "indexes": [
        "CREATE UNIQUE INDEX `idx_authOrigins_unique_pairs` ON `_authOrigins` (collectionRef, recordRef, fingerprint)"
      ],
      "listRule": "@request.auth.id != '' && recordRef = @request.auth.id && collectionRef = @request.auth.collectionId",
      "name": "_authOrigins",
      "system": true,
      "type": "base",
      "updateRule": null,
      "viewRule": "@request.auth.id != '' && recordRef = @request.auth.id && collectionRef = @request.auth.collectionId"
    },
    {
      "authAlert": {
        "emailTemplate": {
          "body": "<p>Hello,</p>\n<p>We noticed a login to your {APP_NAME} account from a new location.</p>\n<p>If this was you, you may disregard this email.</p>\n<p><strong>If this wasn't you, you should immediately change your {APP_NAME} account password to revoke access from all other locations.</strong></p>\n<p>\n  Thanks,<br/>\n  {APP_NAME} team\n</p>",
          "subject": "Login from a new location"
        },
        "enabled": true
      },
      "authRule": "",
      "authToken": {
        "duration": 86400
      },
      "confirmEmailChangeTemplate": {
        "body": "<p>Hello,</p>\n<p>Click on the button below to confirm your new email address.</p>\n<p>\n  <a class=\"btn\" href=\"{APP_URL}/_/#/auth/confirm-email-change/{TOKEN}\" target=\"_blank\" rel=\"noopener\">Confirm new email</a>\n</p>\n<p><i>If you didn't ask to change your email address, you can ignore this email.</i></p>\n<p>\n  Thanks,<br/>\n  {APP_NAME} team\n</p>",
        "subject": "Confirm your {APP_NAME} new email address"
      },
      "createRule": null,
      "deleteRule": null,
      "emailChangeToken": {
        "duration": 1800
      },
      "fields": [
        {
          "autogeneratePattern": "[a-z0-9]{15}",
          "hidden": false,
          "id": "text3208210256",
          "max": 15,
          "min": 15,
          "name": "id",
          "pattern": "^[a-z0-9]+$",
          "presentable": false,
          "primaryKey": true,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "cost": 0,
          "hidden": true,
          "id": "password901924565",
          "max": 0,
          "min": 8,
          "name": "password",
          "pattern": "",
          "presentable": false,
          "required": true,
          "system": true,
          "type": "password"
        },
        {
          "autogeneratePattern": "[a-zA-Z0-9]{50}",
          "hidden": true,
          "id": "text2504183744",
          "max": 60,
          "min": 30,
          "name": "tokenKey",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "exceptDomains": null,
          "hidden": false,
          "id": "email3885137012",
          "name": "email",
          "onlyDomains": null,
          "presentable": false,
          "required": true,
          "system": true,
          "type": "email"
        },
        {
          "hidden": false,
          "id": "bool1547992806",
          "name": "emailVisibility",
          "presentable": false,
          "required": false,
          "system": true,
          "type": "bool"
        },
        {
          "hidden": false,
          "id": "bool256245529",
          "name": "verified",
          "presentable": false,
          "required": false,
          "system": true,
          "type": "bool"
        },
        {
          "hidden": false,
          "id": "autodate2990389176",
          "name": "created",
          "onCreate": true,
          "onUpdate": false,
          "presentable": false,
          "system": true,
          "type": "autodate"
        },
        {
          "hidden": false,
          "id": "autodate3332085495",
          "name": "updated",
          "onCreate": true,
          "onUpdate": true,
          "presentable": false,
          "system": true,
          "type": "autodate"
        }
      ],
      "fileToken": {
        "duration": 180
      },
      "id": "pbc_3142635823",
      "indexes": [
        "CREATE UNIQUE INDEX `idx_tokenKey_pbc_3142635823` ON `_superusers` (`tokenKey`)",
        "CREATE UNIQUE INDEX `idx_email_pbc_3142635823` ON `_superusers` (`email`) WHERE `email` != ''"
      ],
      "listRule": null,
      "manageRule": null,
      "mfa": {
        "duration": 1800,
        "enabled": false,
        "rule": ""
      },
      "name": "_superusers",
      "oauth2": {
        "enabled": false,
        "mappedFields": {
          "avatarURL": "",
          "id": "",
          "name": "",
          "username": ""
        }
      },
      "otp": {
        "duration": 180,
        "emailTemplate": {
          "body": "<p>Hello,</p>\n<p>Your one-time password is: <strong>{OTP}</strong></p>\n<p><i>If you didn't ask for the one-time password, you can ignore this email.</i></p>\n<p>\n  Thanks,<br/>\n  {APP_NAME} team\n</p>",
          "subject": "OTP for {APP_NAME}"
        },
        "enabled": false,
        "length": 8
      },
      "passwordAuth": {
        "enabled": true,
        "identityFields": [
          "email"
        ]
      },
      "passwordResetToken": {
        "duration": 1800
      },
      "resetPasswordTemplate": {
        "body": "<p>Hello,</p>\n<p>Click on the button below to reset your password.</p>\n<p>\n  <a class=\"btn\" href=\"{APP_URL}/_/#/auth/confirm-password-reset/{TOKEN}\" target=\"_blank\" rel=\"noopener\">Reset password</a>\n</p>\n<p><i>If you didn't ask to reset your password, you can ignore this email.</i></p>\n<p>\n  Thanks,<br/>\n  {APP_NAME} team\n</p>",
        "subject": "Reset your {APP_NAME} password"
      },
      "system": true,
      "type": "auth",
      "updateRule": null,
      "verificationTemplate": {
        "body": "<p>Hello,</p>\n<p>Thank you for joining us at {APP_NAME}.</p>\n<p>Click on the button below to verify your email address.</p>\n<p>\n  <a class=\"btn\" href=\"{APP_URL}/_/#/auth/confirm-verification/{TOKEN}\" target=\"_blank\" rel=\"noopener\">Verify</a>\n</p>\n<p>\n  Thanks,<br/>\n  {APP_NAME} team\n</p>",
        "subject": "Verify your {APP_NAME} email"
      },
      "verificationToken": {
        "duration": 259200
      },
      "viewRule": null
    },
    {
      "authAlert": {
        "emailTemplate": {
          "body": "<p>Hello,</p>\n<p>We noticed a login to your {APP_NAME} account from a new location.</p>\n<p>If this was you, you may disregard this email.</p>\n<p><strong>If this wasn't you, you should immediately change your {APP_NAME} account password to revoke access from all other locations.</strong></p>\n<p>\n  Thanks,<br/>\n  {APP_NAME} team\n</p>",
          "subject": "Login from a new location"
        },
        "enabled": true
      },
      "authRule": "verified = true",
      "authToken": {
        "duration": 7200
      },
      "confirmEmailChangeTemplate": {
        "body": "<p>Hello,</p>\n<p>Click on the button below to confirm your new email address.</p>\n<p>\n  <a class=\"btn\" href=\"{APP_URL}/_/#/auth/confirm-email-change/{TOKEN}\" target=\"_blank\" rel=\"noopener\">Confirm new email</a>\n</p>\n<p><i>If you didn't ask to change your email address, you can ignore this email.</i></p>\n<p>\n  Thanks,<br/>\n  {APP_NAME} team\n</p>",
        "subject": "Confirm your {APP_NAME} new email address"
      },
      "createRule": "id = @request.auth.id && \n(\n  @request.auth.role ~ \":superadmin:%\" || \n  @request.auth.role ~ \":system:%\" || \n  @request.auth.role ~ \":developer:%\"\n)",
      "deleteRule": "id = @request.auth.id && \n(\n  @request.auth.role ~ \":superadmin:%\" || \n  @request.auth.role ~ \":system:%\" || \n  @request.auth.role ~ \":developer:%\"\n)",
      "emailChangeToken": {
        "duration": 1800
      },
      "fields": [
        {
          "autogeneratePattern": "[a-z0-9]{15}",
          "hidden": false,
          "id": "text3208210256",
          "max": 15,
          "min": 15,
          "name": "id",
          "pattern": "^[a-z0-9]+$",
          "presentable": false,
          "primaryKey": true,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "cost": 0,
          "hidden": true,
          "id": "password901924565",
          "max": 0,
          "min": 8,
          "name": "password",
          "pattern": "",
          "presentable": false,
          "required": true,
          "system": true,
          "type": "password"
        },
        {
          "autogeneratePattern": "[a-zA-Z0-9]{50}",
          "hidden": true,
          "id": "text2504183744",
          "max": 60,
          "min": 30,
          "name": "tokenKey",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "exceptDomains": null,
          "hidden": false,
          "id": "email3885137012",
          "name": "email",
          "onlyDomains": null,
          "presentable": false,
          "required": true,
          "system": true,
          "type": "email"
        },
        {
          "hidden": false,
          "id": "bool1547992806",
          "name": "emailVisibility",
          "presentable": false,
          "required": false,
          "system": true,
          "type": "bool"
        },
        {
          "hidden": false,
          "id": "bool256245529",
          "name": "verified",
          "presentable": false,
          "required": false,
          "system": true,
          "type": "bool"
        },
        {
          "cascadeDelete": false,
          "collectionId": "pbc_1452049888",
          "hidden": false,
          "id": "relation1466534506",
          "maxSelect": 1,
          "minSelect": 0,
          "name": "role",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "relation"
        },
        {
          "cascadeDelete": false,
          "collectionId": "pbc_3641971933",
          "hidden": false,
          "id": "relation3174717450",
          "maxSelect": 1,
          "minSelect": 0,
          "name": "default_company",
          "presentable": false,
          "required": true,
          "system": false,
          "type": "relation"
        },
        {
          "cascadeDelete": false,
          "collectionId": "pbc_3641971933",
          "hidden": false,
          "id": "relation3967723839",
          "maxSelect": 1,
          "minSelect": 0,
          "name": "default_company_storage",
          "presentable": false,
          "required": true,
          "system": false,
          "type": "relation"
        },
        {
          "cascadeDelete": false,
          "collectionId": "pbc_3641971933",
          "hidden": false,
          "id": "relation3661204595",
          "maxSelect": 1,
          "minSelect": 0,
          "name": "default_company_year",
          "presentable": false,
          "required": true,
          "system": false,
          "type": "relation"
        },
        {
          "hidden": false,
          "id": "autodate2990389176",
          "name": "created",
          "onCreate": true,
          "onUpdate": false,
          "presentable": false,
          "system": false,
          "type": "autodate"
        },
        {
          "hidden": false,
          "id": "autodate3332085495",
          "name": "updated",
          "onCreate": true,
          "onUpdate": true,
          "presentable": false,
          "system": false,
          "type": "autodate"
        },
        {
          "autogeneratePattern": "",
          "hidden": false,
          "id": "text1579384326",
          "max": 255,
          "min": 0,
          "name": "name",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": false,
          "system": false,
          "type": "text"
        },
        {
          "hidden": false,
          "id": "file376926767",
          "maxSelect": 1,
          "maxSize": 0,
          "mimeTypes": [
            "image/jpeg",
            "image/png",
            "image/svg+xml",
            "image/gif",
            "image/webp"
          ],
          "name": "avatar",
          "presentable": false,
          "protected": false,
          "required": false,
          "system": false,
          "thumbs": null,
          "type": "file"
        }
      ],
      "fileToken": {
        "duration": 180
      },
      "id": "_pb_users_auth_",
      "indexes": [
        "CREATE UNIQUE INDEX `idx_tokenKey__pb_users_auth_` ON `sys_users` (`tokenKey`)",
        "CREATE UNIQUE INDEX `idx_email__pb_users_auth_` ON `sys_users` (`email`) WHERE `email` != ''"
      ],
      "listRule": "id = @request.auth.id && \n(\n  @request.auth.role ~ \":demo:%\" || \n  @request.auth.role ~ \":user:%\" || \n  @request.auth.role ~ \":superuser:%\" || \n  @request.auth.role ~ \":admin:%\" || \n  @request.auth.role ~ \":superadmin:%\" || \n  @request.auth.role ~ \":system:%\" || \n  @request.auth.role ~ \":developer:%\"\n)",
      "manageRule": null,
      "mfa": {
        "duration": 1800,
        "enabled": false,
        "rule": ""
      },
      "name": "sys_users",
      "oauth2": {
        "enabled": false,
        "mappedFields": {
          "avatarURL": "",
          "id": "",
          "name": "",
          "username": ""
        }
      },
      "otp": {
        "duration": 180,
        "emailTemplate": {
          "body": "<p>Hello,</p>\n<p>Your one-time password is: <strong>{OTP}</strong></p>\n<p><i>If you didn't ask for the one-time password, you can ignore this email.</i></p>\n<p>\n  Thanks,<br/>\n  {APP_NAME} team\n</p>",
          "subject": "OTP for {APP_NAME}"
        },
        "enabled": false,
        "length": 8
      },
      "passwordAuth": {
        "enabled": true,
        "identityFields": [
          "email"
        ]
      },
      "passwordResetToken": {
        "duration": 1800
      },
      "resetPasswordTemplate": {
        "body": "<p>Hello,</p>\n<p>Click on the button below to reset your password.</p>\n<p>\n  <a class=\"btn\" href=\"{APP_URL}/_/#/auth/confirm-password-reset/{TOKEN}\" target=\"_blank\" rel=\"noopener\">Reset password</a>\n</p>\n<p><i>If you didn't ask to reset your password, you can ignore this email.</i></p>\n<p>\n  Thanks,<br/>\n  {APP_NAME} team\n</p>",
        "subject": "Reset your {APP_NAME} password"
      },
      "system": false,
      "type": "auth",
      "updateRule": "id = @request.auth.id && \n(\n  @request.auth.role ~ \":admin:%\" || \n  @request.auth.role ~ \":superadmin:%\" || \n  @request.auth.role ~ \":system:%\" || \n  @request.auth.role ~ \":developer:%\"\n)",
      "verificationTemplate": {
        "body": "<p>Hello,</p>\n<p>Thank you for joining us at {APP_NAME}.</p>\n<p>Click on the button below to verify your email address.</p>\n<p>\n  <a class=\"btn\" href=\"{APP_URL}/_/#/auth/confirm-verification/{TOKEN}\" target=\"_blank\" rel=\"noopener\">Verify</a>\n</p>\n<p>\n  Thanks,<br/>\n  {APP_NAME} team\n</p>",
        "subject": "Verify your {APP_NAME} email"
      },
      "verificationToken": {
        "duration": 259200
      },
      "viewRule": "id = @request.auth.id && \n(\n  @request.auth.role ~ \":demo:%\" || \n  @request.auth.role ~ \":user:%\" || \n  @request.auth.role ~ \":superuser:%\" || \n  @request.auth.role ~ \":admin:%\" || \n  @request.auth.role ~ \":superadmin:%\" || \n  @request.auth.role ~ \":system:%\" || \n  @request.auth.role ~ \":developer:%\"\n)"
    },
    {
      "createRule": "@request.auth.id != \"\" && \n(\n  @request.auth.role ~ \":admin:%\" || \n  @request.auth.role ~ \":superadmin:%\" || \n  @request.auth.role ~ \":system:%\" || \n  @request.auth.role ~ \":developer:%\"\n)",
      "deleteRule": "@request.auth.id != \"\" && \n(\n  @request.auth.role ~ \":admin:%\" || \n  @request.auth.role ~ \":superadmin:%\" || \n  @request.auth.role ~ \":system:%\" || \n  @request.auth.role ~ \":developer:%\"\n)",
      "fields": [
        {
          "autogeneratePattern": "[a-z0-9]{15}",
          "hidden": false,
          "id": "text3208210256",
          "max": 15,
          "min": 15,
          "name": "id",
          "pattern": "^[a-z0-9]+$",
          "presentable": false,
          "primaryKey": true,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "cascadeDelete": true,
          "collectionId": "pbc_3641971933",
          "hidden": false,
          "id": "relation1920649840",
          "maxSelect": 1,
          "minSelect": 0,
          "name": "parent_id",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "relation"
        },
        {
          "hidden": false,
          "id": "select2363381545",
          "maxSelect": 1,
          "name": "type",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "select",
          "values": [
            "company",
            "storage",
            "year"
          ]
        },
        {
          "hidden": false,
          "id": "number260029001",
          "max": 9999,
          "min": 1,
          "name": "sorder",
          "onlyInt": true,
          "presentable": false,
          "required": true,
          "system": false,
          "type": "number"
        },
        {
          "hidden": false,
          "id": "number494360628",
          "max": 9999,
          "min": 1000,
          "name": "value",
          "onlyInt": true,
          "presentable": false,
          "required": true,
          "system": false,
          "type": "number"
        },
        {
          "autogeneratePattern": "",
          "hidden": false,
          "id": "text724990059",
          "max": 0,
          "min": 0,
          "name": "title",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": true,
          "system": false,
          "type": "text"
        },
        {
          "autogeneratePattern": "",
          "hidden": false,
          "id": "text4135340389",
          "max": 0,
          "min": 0,
          "name": "caption",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": true,
          "system": false,
          "type": "text"
        },
        {
          "hidden": false,
          "id": "json1940732548",
          "maxSize": 0,
          "name": "available_permissions",
          "presentable": false,
          "required": true,
          "system": false,
          "type": "json"
        },
        {
          "hidden": false,
          "id": "select2063623452",
          "maxSelect": 1,
          "name": "status",
          "presentable": false,
          "required": true,
          "system": false,
          "type": "select",
          "values": [
            "active",
            "passive"
          ]
        },
        {
          "autogeneratePattern": "",
          "hidden": false,
          "id": "text3485334036",
          "max": 0,
          "min": 0,
          "name": "note",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": false,
          "system": false,
          "type": "text"
        },
        {
          "hidden": false,
          "id": "bool1823795185",
          "name": "processable",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "bool"
        },
        {
          "hidden": false,
          "id": "autodate2990389176",
          "name": "created",
          "onCreate": true,
          "onUpdate": false,
          "presentable": false,
          "system": false,
          "type": "autodate"
        },
        {
          "hidden": false,
          "id": "autodate3332085495",
          "name": "updated",
          "onCreate": true,
          "onUpdate": true,
          "presentable": false,
          "system": false,
          "type": "autodate"
        }
      ],
      "id": "pbc_3641971933",
      "indexes": [
        "CREATE UNIQUE INDEX `idx_S44QVXTTm2` ON `sys_companys` (\n  `value`,\n  `parent_id`\n)"
      ],
      "listRule": "@request.auth.id != \"\" && \n(\n  @request.auth.role ~ \":demo:%\" || \n  @request.auth.role ~ \":admin:%\" || \n  @request.auth.role ~ \":superadmin:%\" || \n  @request.auth.role ~ \":system:%\" || \n  @request.auth.role ~ \":developer:%\"\n)",
      "name": "sys_companys",
      "system": false,
      "type": "base",
      "updateRule": "@request.auth.id != \"\" && \n(\n  @request.auth.role ~ \":admin:%\" || \n  @request.auth.role ~ \":superadmin:%\" || \n  @request.auth.role ~ \":system:%\" || \n  @request.auth.role ~ \":developer:%\"\n)",
      "viewRule": "@request.auth.id != \"\" && \n(\n  @request.auth.role ~ \":demo:%\" || \n  @request.auth.role ~ \":admin:%\" || \n  @request.auth.role ~ \":superadmin:%\" || \n  @request.auth.role ~ \":system:%\" || \n  @request.auth.role ~ \":developer:%\"\n)"
    },
    {
      "createRule": "@request.auth.id != \"\" && \n(\n  @request.auth.role ~ \":admin:%\" || \n  @request.auth.role ~ \":superadmin:%\" || \n  @request.auth.role ~ \":system:%\" || \n  @request.auth.role ~ \":developer:%\"\n)",
      "deleteRule": "@request.auth.id != \"\" && \n(\n  @request.auth.role ~ \":admin:%\" || \n  @request.auth.role ~ \":superadmin:%\" || \n  @request.auth.role ~ \":system:%\" || \n  @request.auth.role ~ \":developer:%\"\n)",
      "fields": [
        {
          "autogeneratePattern": "[a-z0-9]{15}",
          "hidden": false,
          "id": "text3208210256",
          "max": 15,
          "min": 15,
          "name": "id",
          "pattern": "^[a-z0-9]+$",
          "presentable": false,
          "primaryKey": true,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "cascadeDelete": true,
          "collectionId": "pbc_498656437",
          "hidden": false,
          "id": "relation1920649840",
          "maxSelect": 1,
          "minSelect": 0,
          "name": "parent_id",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "relation"
        },
        {
          "cascadeDelete": true,
          "collectionId": "pbc_368526849",
          "hidden": false,
          "id": "relation348295111",
          "maxSelect": 1,
          "minSelect": 0,
          "name": "sys_menu_item",
          "presentable": false,
          "required": true,
          "system": false,
          "type": "relation"
        },
        {
          "hidden": false,
          "id": "number260029001",
          "max": 9999,
          "min": 1,
          "name": "sorder",
          "onlyInt": true,
          "presentable": false,
          "required": true,
          "system": false,
          "type": "number"
        },
        {
          "autogeneratePattern": "",
          "hidden": false,
          "id": "text724990059",
          "max": 0,
          "min": 0,
          "name": "title",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": true,
          "system": false,
          "type": "text"
        },
        {
          "autogeneratePattern": "",
          "hidden": false,
          "id": "text4135340389",
          "max": 0,
          "min": 0,
          "name": "caption",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": true,
          "system": false,
          "type": "text"
        },
        {
          "hidden": false,
          "id": "select2063623452",
          "maxSelect": 1,
          "name": "status",
          "presentable": false,
          "required": true,
          "system": false,
          "type": "select",
          "values": [
            "active",
            "passive"
          ]
        },
        {
          "hidden": false,
          "id": "autodate2990389176",
          "name": "created",
          "onCreate": true,
          "onUpdate": false,
          "presentable": false,
          "system": false,
          "type": "autodate"
        },
        {
          "hidden": false,
          "id": "autodate3332085495",
          "name": "updated",
          "onCreate": true,
          "onUpdate": true,
          "presentable": false,
          "system": false,
          "type": "autodate"
        }
      ],
      "id": "pbc_498656437",
      "indexes": [],
      "listRule": "@request.auth.id != \"\" && \n(\n  @request.auth.role ~ \":demo:%\" || \n  @request.auth.role ~ \":admin:%\" || \n  @request.auth.role ~ \":superadmin:%\" || \n  @request.auth.role ~ \":system:%\" || \n  @request.auth.role ~ \":developer:%\"\n)",
      "name": "sys_menus",
      "system": false,
      "type": "base",
      "updateRule": "@request.auth.id != \"\" && \n(\n  @request.auth.role ~ \":admin:%\" || \n  @request.auth.role ~ \":superadmin:%\" || \n  @request.auth.role ~ \":system:%\" || \n  @request.auth.role ~ \":developer:%\"\n)",
      "viewRule": "@request.auth.id != \"\" && \n(\n  @request.auth.role ~ \":demo:%\" || \n  @request.auth.role ~ \":admin:%\" || \n  @request.auth.role ~ \":superadmin:%\" || \n  @request.auth.role ~ \":system:%\" || \n  @request.auth.role ~ \":developer:%\"\n)"
    },
    {
      "createRule": "@request.auth.id != \"\" && \n(\n  @request.auth.role ~ \":user:%\" || \n  @request.auth.role ~ \":superuser:%\" || \n  @request.auth.role ~ \":admin:%\" || \n  @request.auth.role ~ \":superadmin:%\" || \n  @request.auth.role ~ \":system:%\" || \n  @request.auth.role ~ \":developer:%\"\n)",
      "deleteRule": "@request.auth.id != \"\" && \n(\n  @request.auth.role ~ \":user:%\" || \n  @request.auth.role ~ \":superuser:%\" || \n  @request.auth.role ~ \":admin:%\" || \n  @request.auth.role ~ \":superadmin:%\" || \n  @request.auth.role ~ \":system:%\" || \n  @request.auth.role ~ \":developer:%\"\n)",
      "fields": [
        {
          "autogeneratePattern": "[a-z0-9]{15}",
          "hidden": false,
          "id": "text3208210256",
          "max": 15,
          "min": 15,
          "name": "id",
          "pattern": "^[a-z0-9]+$",
          "presentable": false,
          "primaryKey": true,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "cascadeDelete": true,
          "collectionId": "pbc_2916609340",
          "hidden": false,
          "id": "relation1920649840",
          "maxSelect": 1,
          "minSelect": 0,
          "name": "parent_id",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "relation"
        },
        {
          "hidden": false,
          "id": "number260029001",
          "max": 9999,
          "min": 1,
          "name": "sorder",
          "onlyInt": true,
          "presentable": false,
          "required": true,
          "system": false,
          "type": "number"
        },
        {
          "hidden": false,
          "id": "select2363381545",
          "maxSelect": 1,
          "name": "type",
          "presentable": false,
          "required": true,
          "system": false,
          "type": "select",
          "values": [
            "region:bolge",
            "province:il",
            "district:ilce",
            "village:koy",
            "location:mevkii"
          ]
        },
        {
          "autogeneratePattern": "",
          "hidden": false,
          "id": "text724990059",
          "max": 0,
          "min": 0,
          "name": "title",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": true,
          "system": false,
          "type": "text"
        },
        {
          "autogeneratePattern": "",
          "hidden": false,
          "id": "text4135340389",
          "max": 0,
          "min": 0,
          "name": "caption",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": true,
          "system": false,
          "type": "text"
        },
        {
          "hidden": false,
          "id": "json1940732548",
          "maxSize": 0,
          "name": "available_permissions",
          "presentable": false,
          "required": true,
          "system": false,
          "type": "json"
        },
        {
          "hidden": false,
          "id": "select2063623452",
          "maxSelect": 1,
          "name": "status",
          "presentable": false,
          "required": true,
          "system": false,
          "type": "select",
          "values": [
            "active",
            "passive"
          ]
        },
        {
          "hidden": false,
          "id": "autodate2990389176",
          "name": "created",
          "onCreate": true,
          "onUpdate": false,
          "presentable": false,
          "system": false,
          "type": "autodate"
        },
        {
          "hidden": false,
          "id": "autodate3332085495",
          "name": "updated",
          "onCreate": true,
          "onUpdate": true,
          "presentable": false,
          "system": false,
          "type": "autodate"
        }
      ],
      "id": "pbc_2916609340",
      "indexes": [],
      "listRule": "@request.auth.id != \"\" && \n(\n  @request.auth.role ~ \":demo:%\" || \n  @request.auth.role ~ \":user:%\" || \n  @request.auth.role ~ \":superuser:%\" || \n  @request.auth.role ~ \":admin:%\" || \n  @request.auth.role ~ \":superadmin:%\" || \n  @request.auth.role ~ \":system:%\" || \n  @request.auth.role ~ \":developer:%\"\n)",
      "name": "app_regions",
      "system": false,
      "type": "base",
      "updateRule": "@request.auth.id != \"\" && \n(\n  @request.auth.role ~ \":user:%\" || \n  @request.auth.role ~ \":superuser:%\" || \n  @request.auth.role ~ \":admin:%\" || \n  @request.auth.role ~ \":superadmin:%\" || \n  @request.auth.role ~ \":system:%\" || \n  @request.auth.role ~ \":developer:%\"\n)",
      "viewRule": "@request.auth.id != \"\" && \n(\n  @request.auth.role ~ \":demo:%\" || \n  @request.auth.role ~ \":user:%\" || \n  @request.auth.role ~ \":superuser:%\" || \n  @request.auth.role ~ \":admin:%\" || \n  @request.auth.role ~ \":superadmin:%\" || \n  @request.auth.role ~ \":system:%\" || \n  @request.auth.role ~ \":developer:%\"\n)"
    },
    {
      "createRule": "@request.auth.id != \"\" && \n(\n  @request.auth.role ~ \":admin:%\" || \n  @request.auth.role ~ \":superadmin:%\" || \n  @request.auth.role ~ \":system:%\" || \n  @request.auth.role ~ \":developer:%\"\n)",
      "deleteRule": "@request.auth.id != \"\" && \n(\n  @request.auth.role ~ \":admin:%\" || \n  @request.auth.role ~ \":superadmin:%\" || \n  @request.auth.role ~ \":system:%\" || \n  @request.auth.role ~ \":developer:%\"\n)",
      "fields": [
        {
          "autogeneratePattern": "[a-z0-9]{15}",
          "hidden": false,
          "id": "text3208210256",
          "max": 15,
          "min": 15,
          "name": "id",
          "pattern": "^[a-z0-9]+$",
          "presentable": false,
          "primaryKey": true,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "autogeneratePattern": "",
          "hidden": false,
          "id": "text1542800728",
          "max": 0,
          "min": 0,
          "name": "key",
          "pattern": "^[a-z_]+$",
          "presentable": false,
          "primaryKey": false,
          "required": true,
          "system": false,
          "type": "text"
        },
        {
          "hidden": false,
          "id": "bool494360628",
          "name": "value",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "bool"
        },
        {
          "hidden": false,
          "id": "json1295977829",
          "maxSize": 0,
          "name": "extra",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "json"
        },
        {
          "hidden": false,
          "id": "autodate2990389176",
          "name": "created",
          "onCreate": true,
          "onUpdate": false,
          "presentable": false,
          "system": false,
          "type": "autodate"
        },
        {
          "hidden": false,
          "id": "autodate3332085495",
          "name": "updated",
          "onCreate": true,
          "onUpdate": true,
          "presentable": false,
          "system": false,
          "type": "autodate"
        }
      ],
      "id": "pbc_1811418561",
      "indexes": [
        "CREATE UNIQUE INDEX `idx_XFLHYkuFco` ON `sys_settings` (`key`)"
      ],
      "listRule": "@request.auth.id != \"\" && \n(\n  @request.auth.role ~ \":demo:%\" || \n  @request.auth.role ~ \":admin:%\" || \n  @request.auth.role ~ \":superadmin:%\" || \n  @request.auth.role ~ \":system:%\" || \n  @request.auth.role ~ \":developer:%\"\n)",
      "name": "sys_settings",
      "system": false,
      "type": "base",
      "updateRule": "@request.auth.id != \"\" && \n(\n  @request.auth.role ~ \":admin:%\" || \n  @request.auth.role ~ \":superadmin:%\" || \n  @request.auth.role ~ \":system:%\" || \n  @request.auth.role ~ \":developer:%\"\n)",
      "viewRule": "@request.auth.id != \"\" && \n(\n  @request.auth.role ~ \":demo:%\" || \n  @request.auth.role ~ \":admin:%\" || \n  @request.auth.role ~ \":superadmin:%\" || \n  @request.auth.role ~ \":system:%\" || \n  @request.auth.role ~ \":developer:%\"\n)"
    },
    {
      "createRule": "@request.auth.id != \"\" && \n( \n  @request.auth.role ~ \":admin:%\" || \n  @request.auth.role ~ \":superadmin:%\" || \n  @request.auth.role ~ \":system:%\" || \n  @request.auth.role ~ \":developer:%\"\n)",
      "deleteRule": "@request.auth.id != \"\" && \n(\n  @request.auth.role ~ \":admin:%\" || \n  @request.auth.role ~ \":superadmin:%\" || \n  @request.auth.role ~ \":system:%\" || \n  @request.auth.role ~ \":developer:%\"\n)",
      "fields": [
        {
          "autogeneratePattern": "",
          "hidden": false,
          "id": "text3208210256",
          "max": 56,
          "min": 6,
          "name": "id",
          "pattern": "^(:demo:|:user:|:superuser:|:admin:|:superadmin:|:system:|:developer:)[a-z0-9-]+$",
          "presentable": false,
          "primaryKey": true,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "hidden": false,
          "id": "select2363381545",
          "maxSelect": 1,
          "name": "type",
          "presentable": false,
          "required": true,
          "system": false,
          "type": "select",
          "values": [
            "demo",
            "user",
            "superuser",
            "admin",
            "superadmin",
            "system",
            "developer"
          ]
        },
        {
          "autogeneratePattern": "",
          "hidden": false,
          "id": "text724990059",
          "max": 255,
          "min": 3,
          "name": "title",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": true,
          "system": false,
          "type": "text"
        },
        {
          "autogeneratePattern": "",
          "hidden": false,
          "id": "text4135340389",
          "max": 255,
          "min": 3,
          "name": "caption",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": true,
          "system": false,
          "type": "text"
        },
        {
          "hidden": false,
          "id": "select1542800728",
          "maxSelect": 1,
          "name": "status",
          "presentable": false,
          "required": true,
          "system": false,
          "type": "select",
          "values": [
            "active",
            "passive"
          ]
        },
        {
          "hidden": false,
          "id": "autodate2990389176",
          "name": "created",
          "onCreate": true,
          "onUpdate": false,
          "presentable": false,
          "system": false,
          "type": "autodate"
        },
        {
          "hidden": false,
          "id": "autodate3332085495",
          "name": "updated",
          "onCreate": true,
          "onUpdate": true,
          "presentable": false,
          "system": false,
          "type": "autodate"
        }
      ],
      "id": "pbc_1452049888",
      "indexes": [],
      "listRule": "@request.auth.id != \"\" && \n(\n  @request.auth.role ~ \":demo:%\" || \n  @request.auth.role ~ \":admin:%\" || \n  @request.auth.role ~ \":superadmin:%\" || \n  @request.auth.role ~ \":system:%\" || \n  @request.auth.role ~ \":developer:%\"\n)",
      "name": "acl_roles",
      "system": false,
      "type": "base",
      "updateRule": "@request.auth.id != \"\" && \n(\n  @request.auth.role ~ \":admin:%\" || \n  @request.auth.role ~ \":superadmin:%\" || \n  @request.auth.role ~ \":system:%\" || \n  @request.auth.role ~ \":developer:%\"\n)",
      "viewRule": "@request.auth.id != \"\" && \n(\n  @request.auth.role ~ \":demo:%\" || \n  @request.auth.role ~ \":admin:%\" || \n  @request.auth.role ~ \":superadmin:%\" || \n  @request.auth.role ~ \":system:%\" || \n  @request.auth.role ~ \":developer:%\"\n)"
    },
    {
      "createRule": "@request.auth.id != \"\" && \n(\n  @request.auth.role ~ \":admin:%\" || \n  @request.auth.role ~ \":superadmin:%\" || \n  @request.auth.role ~ \":system:%\" || \n  @request.auth.role ~ \":developer:%\"\n)",
      "deleteRule": "@request.auth.id != \"\" && \n(\n  @request.auth.role ~ \":admin:%\" || \n  @request.auth.role ~ \":superadmin:%\" || \n  @request.auth.role ~ \":system:%\" || \n  @request.auth.role ~ \":developer:%\"\n)",
      "fields": [
        {
          "autogeneratePattern": "[a-z0-9]{15}",
          "hidden": false,
          "id": "text3208210256",
          "max": 15,
          "min": 15,
          "name": "id",
          "pattern": "^[a-z0-9]+$",
          "presentable": false,
          "primaryKey": true,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "cascadeDelete": true,
          "collectionId": "pbc_1452049888",
          "hidden": false,
          "id": "relation1466534506",
          "maxSelect": 1,
          "minSelect": 0,
          "name": "role",
          "presentable": false,
          "required": true,
          "system": false,
          "type": "relation"
        },
        {
          "cascadeDelete": true,
          "collectionId": "pbc_3641971933",
          "hidden": false,
          "id": "relation711815386",
          "maxSelect": 1,
          "minSelect": 0,
          "name": "perm",
          "presentable": false,
          "required": true,
          "system": false,
          "type": "relation"
        },
        {
          "hidden": false,
          "id": "json2127102088",
          "maxSize": 0,
          "name": "valid_permissions",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "json"
        },
        {
          "hidden": false,
          "id": "select2063623452",
          "maxSelect": 1,
          "name": "status",
          "presentable": false,
          "required": true,
          "system": false,
          "type": "select",
          "values": [
            "active",
            "passive"
          ]
        },
        {
          "hidden": false,
          "id": "autodate2990389176",
          "name": "created",
          "onCreate": true,
          "onUpdate": false,
          "presentable": false,
          "system": false,
          "type": "autodate"
        },
        {
          "hidden": false,
          "id": "autodate3332085495",
          "name": "updated",
          "onCreate": true,
          "onUpdate": true,
          "presentable": false,
          "system": false,
          "type": "autodate"
        }
      ],
      "id": "pbc_4171238976",
      "indexes": [
        "CREATE UNIQUE INDEX `idx_uxk7CFqwIW` ON `acl_roles_companys` (\n  `role`,\n  `perm`\n)"
      ],
      "listRule": "@request.auth.id != \"\" && \n(\n  @request.auth.role ~ \":demo:%\" || \n  @request.auth.role ~ \":admin:%\" || \n  @request.auth.role ~ \":superadmin:%\" || \n  @request.auth.role ~ \":system:%\" || \n  @request.auth.role ~ \":developer:%\"\n)",
      "name": "acl_roles_companys",
      "system": false,
      "type": "base",
      "updateRule": "@request.auth.id != \"\" && \n(\n  @request.auth.role ~ \":admin:%\" || \n  @request.auth.role ~ \":superadmin:%\" || \n  @request.auth.role ~ \":system:%\" || \n  @request.auth.role ~ \":developer:%\"\n)",
      "viewRule": "@request.auth.id != \"\" && \n(\n  @request.auth.role ~ \":demo:%\" || \n  @request.auth.role ~ \":admin:%\" || \n  @request.auth.role ~ \":superadmin:%\" || \n  @request.auth.role ~ \":system:%\" || \n  @request.auth.role ~ \":developer:%\"\n)"
    },
    {
      "createRule": "@request.auth.id != \"\" && \n(\n  @request.auth.role ~ \":admin:%\" || \n  @request.auth.role ~ \":superadmin:%\" || \n  @request.auth.role ~ \":system:%\" || \n  @request.auth.role ~ \":developer:%\"\n)",
      "deleteRule": "@request.auth.id != \"\" && \n(\n  @request.auth.role ~ \":admin:%\" || \n  @request.auth.role ~ \":superadmin:%\" || \n  @request.auth.role ~ \":system:%\" || \n  @request.auth.role ~ \":developer:%\"\n)",
      "fields": [
        {
          "autogeneratePattern": "[a-z0-9]{15}",
          "hidden": false,
          "id": "text3208210256",
          "max": 15,
          "min": 15,
          "name": "id",
          "pattern": "^[a-z0-9]+$",
          "presentable": false,
          "primaryKey": true,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "cascadeDelete": true,
          "collectionId": "pbc_1452049888",
          "hidden": false,
          "id": "relation1466534506",
          "maxSelect": 1,
          "minSelect": 0,
          "name": "role",
          "presentable": false,
          "required": true,
          "system": false,
          "type": "relation"
        },
        {
          "cascadeDelete": true,
          "collectionId": "pbc_498656437",
          "hidden": false,
          "id": "relation711815386",
          "maxSelect": 1,
          "minSelect": 0,
          "name": "menu",
          "presentable": false,
          "required": true,
          "system": false,
          "type": "relation"
        },
        {
          "hidden": false,
          "id": "json2127102088",
          "maxSize": 0,
          "name": "valid_permissions",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "json"
        },
        {
          "hidden": false,
          "id": "select2063623452",
          "maxSelect": 1,
          "name": "status",
          "presentable": false,
          "required": true,
          "system": false,
          "type": "select",
          "values": [
            "active",
            "passive"
          ]
        },
        {
          "hidden": false,
          "id": "autodate2990389176",
          "name": "created",
          "onCreate": true,
          "onUpdate": false,
          "presentable": false,
          "system": false,
          "type": "autodate"
        },
        {
          "hidden": false,
          "id": "autodate3332085495",
          "name": "updated",
          "onCreate": true,
          "onUpdate": true,
          "presentable": false,
          "system": false,
          "type": "autodate"
        }
      ],
      "id": "pbc_10054391592",
      "indexes": [
        "CREATE UNIQUE INDEX `idx_nirVC1ythv` ON `acl_roles_menus` (\n  `role`,\n  `menu`\n)"
      ],
      "listRule": "@request.auth.id != \"\" && \n(\n  @request.auth.role ~ \":demo:%\" || \n  @request.auth.role ~ \":admin:%\" || \n  @request.auth.role ~ \":superadmin:%\" || \n  @request.auth.role ~ \":system:%\" || \n  @request.auth.role ~ \":developer:%\"\n)",
      "name": "acl_roles_menus",
      "system": false,
      "type": "base",
      "updateRule": "@request.auth.id != \"\" && \n(\n  @request.auth.role ~ \":admin:%\" || \n  @request.auth.role ~ \":superadmin:%\" || \n  @request.auth.role ~ \":system:%\" || \n  @request.auth.role ~ \":developer:%\"\n)",
      "viewRule": "@request.auth.id != \"\" && \n(\n  @request.auth.role ~ \":demo:%\" || \n  @request.auth.role ~ \":admin:%\" || \n  @request.auth.role ~ \":superadmin:%\" || \n  @request.auth.role ~ \":system:%\" || \n  @request.auth.role ~ \":developer:%\"\n)"
    },
    {
      "createRule": "@request.auth.id != \"\" && \n(\n  @request.auth.role ~ \":admin:%\" || \n  @request.auth.role ~ \":superadmin:%\" || \n  @request.auth.role ~ \":system:%\" || \n  @request.auth.role ~ \":developer:%\"\n)",
      "deleteRule": "@request.auth.id != \"\" && \n(\n  @request.auth.role ~ \":admin:%\" || \n  @request.auth.role ~ \":superadmin:%\" || \n  @request.auth.role ~ \":system:%\" || \n  @request.auth.role ~ \":developer:%\"\n)",
      "fields": [
        {
          "autogeneratePattern": "[a-z0-9]{15}",
          "hidden": false,
          "id": "text3208210256",
          "max": 15,
          "min": 15,
          "name": "id",
          "pattern": "^[a-z0-9]+$",
          "presentable": false,
          "primaryKey": true,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "cascadeDelete": true,
          "collectionId": "pbc_1452049888",
          "hidden": false,
          "id": "relation1466534506",
          "maxSelect": 1,
          "minSelect": 0,
          "name": "role",
          "presentable": false,
          "required": true,
          "system": false,
          "type": "relation"
        },
        {
          "cascadeDelete": true,
          "collectionId": "pbc_2916609340",
          "hidden": false,
          "id": "relation711815386",
          "maxSelect": 1,
          "minSelect": 0,
          "name": "perm",
          "presentable": false,
          "required": true,
          "system": false,
          "type": "relation"
        },
        {
          "hidden": false,
          "id": "json2127102088",
          "maxSize": 0,
          "name": "valid_permissions",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "json"
        },
        {
          "hidden": false,
          "id": "select2063623452",
          "maxSelect": 1,
          "name": "status",
          "presentable": false,
          "required": true,
          "system": false,
          "type": "select",
          "values": [
            "active",
            "passive"
          ]
        },
        {
          "hidden": false,
          "id": "autodate2990389176",
          "name": "created",
          "onCreate": true,
          "onUpdate": false,
          "presentable": false,
          "system": false,
          "type": "autodate"
        },
        {
          "hidden": false,
          "id": "autodate3332085495",
          "name": "updated",
          "onCreate": true,
          "onUpdate": true,
          "presentable": false,
          "system": false,
          "type": "autodate"
        }
      ],
      "id": "pbc_2906244360",
      "indexes": [
        "CREATE UNIQUE INDEX `idx_ochBwESb2f` ON `acl_roles_app_regions` (\n  `role`,\n  `perm`\n)"
      ],
      "listRule": "@request.auth.id != \"\" && \n(\n  @request.auth.role ~ \":demo:%\" || \n  @request.auth.role ~ \":admin:%\" || \n  @request.auth.role ~ \":superadmin:%\" || \n  @request.auth.role ~ \":system:%\" || \n  @request.auth.role ~ \":developer:%\"\n)",
      "name": "acl_roles_app_regions",
      "system": false,
      "type": "base",
      "updateRule": "@request.auth.id != \"\" && \n(\n  @request.auth.role ~ \":admin:%\" || \n  @request.auth.role ~ \":superadmin:%\" || \n  @request.auth.role ~ \":system:%\" || \n  @request.auth.role ~ \":developer:%\"\n)",
      "viewRule": "@request.auth.id != \"\" && \n(\n  @request.auth.role ~ \":demo:%\" || \n  @request.auth.role ~ \":admin:%\" || \n  @request.auth.role ~ \":superadmin:%\" || \n  @request.auth.role ~ \":system:%\" || \n  @request.auth.role ~ \":developer:%\"\n)"
    },
    {
      "createRule": "@request.auth.id != \"\" && \n(\n  @request.auth.role ~ \":admin:%\" || \n  @request.auth.role ~ \":superadmin:%\" || \n  @request.auth.role ~ \":system:%\" || \n  @request.auth.role ~ \":developer:%\"\n)",
      "deleteRule": "@request.auth.id != \"\" && \n(\n  @request.auth.role ~ \":admin:%\" || \n  @request.auth.role ~ \":superadmin:%\" || \n  @request.auth.role ~ \":system:%\" || \n  @request.auth.role ~ \":developer:%\"\n)",
      "fields": [
        {
          "autogeneratePattern": "[a-z0-9]{15}",
          "hidden": false,
          "id": "text3208210256",
          "max": 15,
          "min": 15,
          "name": "id",
          "pattern": "^[a-z0-9]+$",
          "presentable": false,
          "primaryKey": true,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "autogeneratePattern": "",
          "hidden": false,
          "id": "text2560465762",
          "max": 0,
          "min": 0,
          "name": "slug",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": false,
          "system": false,
          "type": "text"
        },
        {
          "autogeneratePattern": "",
          "hidden": false,
          "id": "text724990059",
          "max": 0,
          "min": 0,
          "name": "title",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": false,
          "system": false,
          "type": "text"
        },
        {
          "autogeneratePattern": "",
          "hidden": false,
          "id": "text3467735538",
          "max": 0,
          "min": 0,
          "name": "caption",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": false,
          "system": false,
          "type": "text"
        },
        {
          "autogeneratePattern": "",
          "hidden": false,
          "id": "text4274335913",
          "max": 0,
          "min": 0,
          "name": "content",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": false,
          "system": false,
          "type": "text"
        },
        {
          "hidden": false,
          "id": "autodate2990389176",
          "name": "created",
          "onCreate": true,
          "onUpdate": false,
          "presentable": false,
          "system": false,
          "type": "autodate"
        },
        {
          "hidden": false,
          "id": "autodate3332085495",
          "name": "updated",
          "onCreate": true,
          "onUpdate": true,
          "presentable": false,
          "system": false,
          "type": "autodate"
        }
      ],
      "id": "pbc_3052387301",
      "indexes": [],
      "listRule": "@request.auth.id != \"\" && \n(\n  @request.auth.role ~ \":demo:%\" || \n  @request.auth.role ~ \":admin:%\" || \n  @request.auth.role ~ \":superadmin:%\" || \n  @request.auth.role ~ \":system:%\" || \n  @request.auth.role ~ \":developer:%\"\n)",
      "name": "sys_logs",
      "system": false,
      "type": "base",
      "updateRule": "@request.auth.id != \"\" && \n(\n  @request.auth.role ~ \":admin:%\" || \n  @request.auth.role ~ \":superadmin:%\" || \n  @request.auth.role ~ \":system:%\" || \n  @request.auth.role ~ \":developer:%\"\n)",
      "viewRule": "@request.auth.id != \"\" && \n(\n  @request.auth.role ~ \":demo:%\" || \n  @request.auth.role ~ \":admin:%\" || \n  @request.auth.role ~ \":superadmin:%\" || \n  @request.auth.role ~ \":system:%\" || \n  @request.auth.role ~ \":developer:%\"\n)"
    },
    {
      "createRule": "@request.auth.id != \"\" && \n(\n  @request.auth.role ~ \":demo:%\" || \n  @request.auth.role ~ \":system:%\" || \n  @request.auth.role ~ \":developer:%\"\n)",
      "deleteRule": "@request.auth.id != \"\" && \n(\n  @request.auth.role ~ \":demo:%\" || \n  @request.auth.role ~ \":system:%\" || \n  @request.auth.role ~ \":developer:%\"\n)",
      "fields": [
        {
          "autogeneratePattern": "[a-z0-9]{15}",
          "hidden": false,
          "id": "text3208210256",
          "max": 15,
          "min": 15,
          "name": "id",
          "pattern": "^[a-z0-9]+$",
          "presentable": false,
          "primaryKey": true,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "autogeneratePattern": "",
          "hidden": false,
          "id": "text733748550",
          "max": 255,
          "min": 0,
          "name": "text_optional",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": false,
          "system": false,
          "type": "text"
        },
        {
          "autogeneratePattern": "",
          "hidden": false,
          "id": "text1457072411",
          "max": 255,
          "min": 0,
          "name": "text_required",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": true,
          "system": false,
          "type": "text"
        },
        {
          "hidden": false,
          "id": "date1590425842",
          "max": "",
          "min": "",
          "name": "date_optional",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "date"
        },
        {
          "hidden": false,
          "id": "date598658223",
          "max": "",
          "min": "",
          "name": "date_required",
          "presentable": false,
          "required": true,
          "system": false,
          "type": "date"
        },
        {
          "hidden": false,
          "id": "date3967440891",
          "max": "",
          "min": "",
          "name": "datetime_optional",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "date"
        },
        {
          "hidden": false,
          "id": "date2434753446",
          "max": "",
          "min": "",
          "name": "datetime_required",
          "presentable": false,
          "required": true,
          "system": false,
          "type": "date"
        },
        {
          "hidden": false,
          "id": "number1192961408",
          "max": null,
          "min": null,
          "name": "integer_number_optional",
          "onlyInt": true,
          "presentable": false,
          "required": false,
          "system": false,
          "type": "number"
        },
        {
          "hidden": false,
          "id": "number981340637",
          "max": null,
          "min": null,
          "name": "integer_number_required",
          "onlyInt": true,
          "presentable": false,
          "required": true,
          "system": false,
          "type": "number"
        },
        {
          "hidden": false,
          "id": "number2370544231",
          "max": null,
          "min": null,
          "name": "decimal_number_optional",
          "onlyInt": false,
          "presentable": false,
          "required": false,
          "system": false,
          "type": "number"
        },
        {
          "hidden": false,
          "id": "number4029584954",
          "max": null,
          "min": null,
          "name": "decimal_number_required",
          "onlyInt": false,
          "presentable": false,
          "required": true,
          "system": false,
          "type": "number"
        },
        {
          "hidden": false,
          "id": "autodate2990389176",
          "name": "created",
          "onCreate": true,
          "onUpdate": false,
          "presentable": false,
          "system": false,
          "type": "autodate"
        },
        {
          "hidden": false,
          "id": "autodate3332085495",
          "name": "updated",
          "onCreate": true,
          "onUpdate": true,
          "presentable": false,
          "system": false,
          "type": "autodate"
        }
      ],
      "id": "pbc_869937432",
      "indexes": [],
      "listRule": "@request.auth.id != \"\" && \n(\n  @request.auth.role ~ \":demo:%\" || \n  @request.auth.role ~ \":system:%\" || \n  @request.auth.role ~ \":developer:%\"\n)",
      "name": "test_form",
      "system": false,
      "type": "base",
      "updateRule": "@request.auth.id != \"\" && \n(\n  @request.auth.role ~ \":demo:%\" || \n  @request.auth.role ~ \":system:%\" || \n  @request.auth.role ~ \":developer:%\"\n)",
      "viewRule": "@request.auth.id != \"\" && \n(\n  @request.auth.role ~ \":demo:%\" || \n  @request.auth.role ~ \":system:%\" || \n  @request.auth.role ~ \":developer:%\"\n)"
    },
    {
      "createRule": "@request.auth.id != \"\" && \n(\n  @request.auth.role ~ \":admin:%\" || \n  @request.auth.role ~ \":superadmin:%\" || \n  @request.auth.role ~ \":system:%\" || \n  @request.auth.role ~ \":developer:%\"\n)",
      "deleteRule": "@request.auth.id != \"\" && \n(\n  @request.auth.role ~ \":admin:%\" || \n  @request.auth.role ~ \":superadmin:%\" || \n  @request.auth.role ~ \":system:%\" || \n  @request.auth.role ~ \":developer:%\"\n)",
      "fields": [
        {
          "autogeneratePattern": "[a-z0-9]{15}",
          "hidden": false,
          "id": "text3208210256",
          "max": 15,
          "min": 15,
          "name": "id",
          "pattern": "^[a-z0-9]+$",
          "presentable": false,
          "primaryKey": true,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "autogeneratePattern": "",
          "hidden": false,
          "id": "text4101391790",
          "max": 0,
          "min": 0,
          "name": "url",
          "pattern": "^(/[a-zA-Z0-9/-]*|#)$",
          "presentable": false,
          "primaryKey": false,
          "required": true,
          "system": false,
          "type": "text"
        },
        {
          "autogeneratePattern": "",
          "hidden": false,
          "id": "text724990059",
          "max": 0,
          "min": 0,
          "name": "title",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": true,
          "system": false,
          "type": "text"
        },
        {
          "autogeneratePattern": "",
          "hidden": false,
          "id": "text4135340389",
          "max": 0,
          "min": 0,
          "name": "caption",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": true,
          "system": false,
          "type": "text"
        },
        {
          "hidden": false,
          "id": "json1940732548",
          "maxSize": 0,
          "name": "available_permissions",
          "presentable": false,
          "required": true,
          "system": false,
          "type": "json"
        },
        {
          "hidden": false,
          "id": "select2063623452",
          "maxSelect": 1,
          "name": "status",
          "presentable": false,
          "required": true,
          "system": false,
          "type": "select",
          "values": [
            "active",
            "passive"
          ]
        },
        {
          "autogeneratePattern": "",
          "hidden": false,
          "id": "text3485334036",
          "max": 0,
          "min": 0,
          "name": "note",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": false,
          "system": false,
          "type": "text"
        },
        {
          "hidden": false,
          "id": "autodate2990389176",
          "name": "created",
          "onCreate": true,
          "onUpdate": false,
          "presentable": false,
          "system": false,
          "type": "autodate"
        },
        {
          "hidden": false,
          "id": "autodate3332085495",
          "name": "updated",
          "onCreate": true,
          "onUpdate": true,
          "presentable": false,
          "system": false,
          "type": "autodate"
        }
      ],
      "id": "pbc_368526849",
      "indexes": [
        "CREATE UNIQUE INDEX `idx_SP4enV2nD0` ON `sys_menu_items` (`url`)"
      ],
      "listRule": "@request.auth.id != \"\" && \n(\n  @request.auth.role ~ \":demo:%\" || \n  @request.auth.role ~ \":admin:%\" || \n  @request.auth.role ~ \":superadmin:%\" || \n  @request.auth.role ~ \":system:%\" || \n  @request.auth.role ~ \":developer:%\"\n)",
      "name": "sys_menu_items",
      "system": false,
      "type": "base",
      "updateRule": "@request.auth.id != \"\" && \n(\n  @request.auth.role ~ \":admin:%\" || \n  @request.auth.role ~ \":superadmin:%\" || \n  @request.auth.role ~ \":system:%\" || \n  @request.auth.role ~ \":developer:%\"\n)",
      "viewRule": "@request.auth.id != \"\" && \n(\n  @request.auth.role ~ \":demo:%\" || \n  @request.auth.role ~ \":admin:%\" || \n  @request.auth.role ~ \":superadmin:%\" || \n  @request.auth.role ~ \":system:%\" || \n  @request.auth.role ~ \":developer:%\"\n)"
    },
    {
      "createRule": null,
      "deleteRule": null,
      "fields": [
        {
          "autogeneratePattern": "[a-z0-9]{15}",
          "hidden": false,
          "id": "text3208210256",
          "max": 15,
          "min": 15,
          "name": "id",
          "pattern": "^[a-z0-9]+$",
          "presentable": false,
          "primaryKey": true,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "hidden": false,
          "id": "number1843064012",
          "max": 9999,
          "min": 0,
          "name": "kn",
          "onlyInt": true,
          "presentable": false,
          "required": false,
          "system": false,
          "type": "number"
        },
        {
          "hidden": false,
          "id": "date2427983286",
          "max": "",
          "min": "",
          "name": "kt",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "date"
        },
        {
          "autogeneratePattern": "",
          "hidden": false,
          "id": "text2539932124",
          "max": 0,
          "min": 0,
          "name": "producer",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": false,
          "system": false,
          "type": "text"
        },
        {
          "autogeneratePattern": "",
          "hidden": false,
          "id": "text258142582",
          "max": 0,
          "min": 0,
          "name": "region",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": false,
          "system": false,
          "type": "text"
        },
        {
          "hidden": false,
          "id": "number335959144",
          "max": null,
          "min": null,
          "name": "kg",
          "onlyInt": false,
          "presentable": false,
          "required": false,
          "system": false,
          "type": "number"
        },
        {
          "autogeneratePattern": "",
          "hidden": false,
          "id": "text3485334036",
          "max": 0,
          "min": 0,
          "name": "note",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": false,
          "system": false,
          "type": "text"
        },
        {
          "hidden": false,
          "id": "autodate2990389176",
          "name": "created",
          "onCreate": true,
          "onUpdate": false,
          "presentable": false,
          "system": false,
          "type": "autodate"
        },
        {
          "hidden": false,
          "id": "autodate3332085495",
          "name": "updated",
          "onCreate": true,
          "onUpdate": true,
          "presentable": false,
          "system": false,
          "type": "autodate"
        }
      ],
      "id": "pbc_3301652643",
      "indexes": [],
      "listRule": "@request.auth.id != \"\" && \n(\n  @request.auth.role ~ \":demo:%\" || \n  @request.auth.role ~ \":system:%\" || \n  @request.auth.role ~ \":developer:%\"\n)",
      "name": "test_subtotal",
      "system": false,
      "type": "base",
      "updateRule": null,
      "viewRule": "@request.auth.id != \"\" && \n(\n  @request.auth.role ~ \":demo:%\" || \n  @request.auth.role ~ \":system:%\" || \n  @request.auth.role ~ \":developer:%\"\n)"
    },
    {
      "createRule": null,
      "deleteRule": null,
      "fields": [
        {
          "autogeneratePattern": "[a-z0-9]{15}",
          "hidden": false,
          "id": "text3208210256",
          "max": 15,
          "min": 15,
          "name": "id",
          "pattern": "^[a-z0-9]+$",
          "presentable": false,
          "primaryKey": true,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "hidden": false,
          "id": "number4113142680",
          "max": null,
          "min": null,
          "name": "order",
          "onlyInt": false,
          "presentable": false,
          "required": false,
          "system": false,
          "type": "number"
        },
        {
          "hidden": false,
          "id": "number1843064012",
          "max": null,
          "min": null,
          "name": "kn",
          "onlyInt": false,
          "presentable": false,
          "required": false,
          "system": false,
          "type": "number"
        },
        {
          "hidden": false,
          "id": "date2427983286",
          "max": "",
          "min": "",
          "name": "kt",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "date"
        },
        {
          "hidden": false,
          "id": "date3660447513",
          "max": "",
          "min": "",
          "name": "purchase_date",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "date"
        },
        {
          "autogeneratePattern": "",
          "hidden": false,
          "id": "text3708402874",
          "max": 0,
          "min": 0,
          "name": "title",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": false,
          "system": false,
          "type": "text"
        },
        {
          "autogeneratePattern": "",
          "hidden": false,
          "id": "text2539932124",
          "max": 0,
          "min": 0,
          "name": "caption",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": false,
          "system": false,
          "type": "text"
        },
        {
          "autogeneratePattern": "",
          "hidden": false,
          "id": "text258142582",
          "max": 0,
          "min": 0,
          "name": "region",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": false,
          "system": false,
          "type": "text"
        },
        {
          "autogeneratePattern": "",
          "hidden": false,
          "id": "text1255855115",
          "max": 0,
          "min": 0,
          "name": "province",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": false,
          "system": false,
          "type": "text"
        },
        {
          "autogeneratePattern": "",
          "hidden": false,
          "id": "text834753671",
          "max": 0,
          "min": 0,
          "name": "district",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": false,
          "system": false,
          "type": "text"
        },
        {
          "autogeneratePattern": "",
          "hidden": false,
          "id": "text1315733418",
          "max": 0,
          "min": 0,
          "name": "village",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": false,
          "system": false,
          "type": "text"
        },
        {
          "autogeneratePattern": "",
          "hidden": false,
          "id": "text2012510561",
          "max": 0,
          "min": 0,
          "name": "grape",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": false,
          "system": false,
          "type": "text"
        },
        {
          "autogeneratePattern": "",
          "hidden": false,
          "id": "text2210268433",
          "max": 0,
          "min": 0,
          "name": "grape_color",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": false,
          "system": false,
          "type": "text"
        },
        {
          "hidden": false,
          "id": "number2683508278",
          "max": null,
          "min": null,
          "name": "quantity",
          "onlyInt": false,
          "presentable": false,
          "required": false,
          "system": false,
          "type": "number"
        },
        {
          "hidden": false,
          "id": "number3402113753",
          "max": null,
          "min": null,
          "name": "price",
          "onlyInt": false,
          "presentable": false,
          "required": false,
          "system": false,
          "type": "number"
        },
        {
          "hidden": false,
          "id": "number2392944706",
          "max": null,
          "min": null,
          "name": "amount",
          "onlyInt": false,
          "presentable": false,
          "required": false,
          "system": false,
          "type": "number"
        },
        {
          "hidden": false,
          "id": "bool1260321794",
          "name": "active",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "bool"
        },
        {
          "hidden": false,
          "id": "autodate2990389176",
          "name": "created",
          "onCreate": true,
          "onUpdate": false,
          "presentable": false,
          "system": false,
          "type": "autodate"
        },
        {
          "hidden": false,
          "id": "autodate3332085495",
          "name": "updated",
          "onCreate": true,
          "onUpdate": true,
          "presentable": false,
          "system": false,
          "type": "autodate"
        }
      ],
      "id": "pbc_3040204514",
      "indexes": [],
      "listRule": "@request.auth.id != \"\" && \n(\n  @request.auth.role ~ \":demo:%\" || \n  @request.auth.role ~ \":system:%\" || \n  @request.auth.role ~ \":developer:%\"\n)",
      "name": "test_datatable",
      "system": false,
      "type": "base",
      "updateRule": null,
      "viewRule": "@request.auth.id != \"\" && \n(\n  @request.auth.role ~ \":demo:%\" || \n  @request.auth.role ~ \":system:%\" || \n  @request.auth.role ~ \":developer:%\"\n)"
    },
    {
      "createRule": null,
      "deleteRule": null,
      "fields": [
        {
          "autogeneratePattern": "",
          "hidden": false,
          "id": "text3208210256",
          "max": 0,
          "min": 0,
          "name": "id",
          "pattern": "^[a-z0-9]+$",
          "presentable": false,
          "primaryKey": true,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "hidden": false,
          "id": "json3993945260",
          "maxSize": 1,
          "name": "effective_parent_id",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "json"
        },
        {
          "cascadeDelete": true,
          "collectionId": "pbc_3641971933",
          "hidden": false,
          "id": "_clone_r3JH",
          "maxSelect": 1,
          "minSelect": 0,
          "name": "parent_id",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "relation"
        },
        {
          "hidden": false,
          "id": "_clone_fOnO",
          "max": 9999,
          "min": 1,
          "name": "sorder",
          "onlyInt": true,
          "presentable": false,
          "required": true,
          "system": false,
          "type": "number"
        },
        {
          "hidden": false,
          "id": "_clone_zXWI",
          "maxSelect": 1,
          "name": "type",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "select",
          "values": [
            "company",
            "storage",
            "year"
          ]
        },
        {
          "hidden": false,
          "id": "_clone_0NJX",
          "max": 9999,
          "min": 1000,
          "name": "value",
          "onlyInt": true,
          "presentable": false,
          "required": true,
          "system": false,
          "type": "number"
        },
        {
          "autogeneratePattern": "",
          "hidden": false,
          "id": "_clone_A37v",
          "max": 0,
          "min": 0,
          "name": "title",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": true,
          "system": false,
          "type": "text"
        },
        {
          "autogeneratePattern": "",
          "hidden": false,
          "id": "_clone_OqC2",
          "max": 0,
          "min": 0,
          "name": "caption",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": true,
          "system": false,
          "type": "text"
        }
      ],
      "id": "pbc_33793606622",
      "indexes": [],
      "listRule": "@request.auth.id != \"\" && \n(\n  @request.auth.role ~ \":demo:%\" || \n  @request.auth.role ~ \":user:%\" || \n  @request.auth.role ~ \":superuser:%\" || \n  @request.auth.role ~ \":admin:%\" || \n  @request.auth.role ~ \":superadmin:%\" || \n  @request.auth.role ~ \":system:%\" || \n  @request.auth.role ~ \":developer:%\"\n)",
      "name": "acl_companys_view",
      "system": false,
      "type": "view",
      "updateRule": null,
      "viewQuery": "SELECT\n  (ROW_NUMBER() OVER()) as id,\n  IIF(parent_id = \"\", id, parent_id) AS effective_parent_id,\n  parent_id,\n  sorder,\n  type,\n  value,\n  title,\n  caption\nFROM\n  sys_companys\nWHERE\n  status=\"active\"\nORDER BY \n  sorder, type, value ASC",
      "viewRule": "@request.auth.id != \"\" && \n(\n  @request.auth.role ~ \":demo:%\" || \n  @request.auth.role ~ \":user:%\" || \n  @request.auth.role ~ \":superuser:%\" || \n  @request.auth.role ~ \":admin:%\" || \n  @request.auth.role ~ \":superadmin:%\" || \n  @request.auth.role ~ \":system:%\" || \n  @request.auth.role ~ \":developer:%\"\n)"
    },
    {
      "createRule": null,
      "deleteRule": null,
      "fields": [
        {
          "autogeneratePattern": "",
          "hidden": false,
          "id": "text3208210256",
          "max": 0,
          "min": 0,
          "name": "id",
          "pattern": "^[a-z0-9]+$",
          "presentable": false,
          "primaryKey": true,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "cascadeDelete": false,
          "collectionId": "pbc_2916609340",
          "hidden": false,
          "id": "relation2552627541",
          "maxSelect": 1,
          "minSelect": 0,
          "name": "region_id",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "relation"
        },
        {
          "autogeneratePattern": "",
          "hidden": false,
          "id": "_clone_Ni0Y",
          "max": 0,
          "min": 0,
          "name": "region",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": true,
          "system": false,
          "type": "text"
        },
        {
          "cascadeDelete": false,
          "collectionId": "pbc_2916609340",
          "hidden": false,
          "id": "relation3913683274",
          "maxSelect": 1,
          "minSelect": 0,
          "name": "province_id",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "relation"
        },
        {
          "autogeneratePattern": "",
          "hidden": false,
          "id": "_clone_Q8YU",
          "max": 0,
          "min": 0,
          "name": "province",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": true,
          "system": false,
          "type": "text"
        },
        {
          "cascadeDelete": false,
          "collectionId": "pbc_2916609340",
          "hidden": false,
          "id": "relation2962203250",
          "maxSelect": 1,
          "minSelect": 0,
          "name": "district_id",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "relation"
        },
        {
          "autogeneratePattern": "",
          "hidden": false,
          "id": "_clone_uR4l",
          "max": 0,
          "min": 0,
          "name": "district",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": true,
          "system": false,
          "type": "text"
        },
        {
          "cascadeDelete": false,
          "collectionId": "pbc_2916609340",
          "hidden": false,
          "id": "relation1577932162",
          "maxSelect": 1,
          "minSelect": 0,
          "name": "village_id",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "relation"
        },
        {
          "autogeneratePattern": "",
          "hidden": false,
          "id": "_clone_KoF4",
          "max": 0,
          "min": 0,
          "name": "village",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": true,
          "system": false,
          "type": "text"
        },
        {
          "cascadeDelete": false,
          "collectionId": "pbc_2916609340",
          "hidden": false,
          "id": "relation105718158",
          "maxSelect": 1,
          "minSelect": 0,
          "name": "location_id",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "relation"
        },
        {
          "autogeneratePattern": "",
          "hidden": false,
          "id": "_clone_lsey",
          "max": 0,
          "min": 0,
          "name": "location",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": true,
          "system": false,
          "type": "text"
        }
      ],
      "id": "pbc_3379360662",
      "indexes": [],
      "listRule": "@request.auth.id != \"\" && \n(\n  @request.auth.role ~ \":demo:%\" || \n  @request.auth.role ~ \":user:%\" || \n  @request.auth.role ~ \":superuser:%\" || \n  @request.auth.role ~ \":admin:%\" || \n  @request.auth.role ~ \":superadmin:%\" || \n  @request.auth.role ~ \":system:%\" || \n  @request.auth.role ~ \":developer:%\"\n)",
      "name": "acl_app_regions_view",
      "system": false,
      "type": "view",
      "updateRule": null,
      "viewQuery": "SELECT\n  (ROW_NUMBER() OVER()) as id,\n  t5.id AS region_id, t5.caption AS region,\n  t4.id AS province_id, t4.caption AS province,\n  t3.id AS district_id, t3.caption AS district,\n  t2.id AS village_id, t2.caption AS village,\n  t1.id AS location_id, t1.caption AS location\nFROM app_regions t1\n  JOIN app_regions t2 ON t1.parent_id = t2.id AND t2.status=\"active\"\n  JOIN app_regions t3 ON t2.parent_id = t3.id AND t3.status=\"active\"\n  JOIN app_regions t4 ON t3.parent_id = t4.id AND t4.status=\"active\"\n  JOIN app_regions t5 ON t4.parent_id = t5.id AND t5.status=\"active\"\nWHERE\n  t1.status=\"active\"",
      "viewRule": "@request.auth.id != \"\" && \n(\n  @request.auth.role ~ \":demo:%\" || \n  @request.auth.role ~ \":user:%\" || \n  @request.auth.role ~ \":superuser:%\" || \n  @request.auth.role ~ \":admin:%\" || \n  @request.auth.role ~ \":superadmin:%\" || \n  @request.auth.role ~ \":system:%\" || \n  @request.auth.role ~ \":developer:%\"\n)"
    },
    {
      "createRule": null,
      "deleteRule": null,
      "fields": [
        {
          "autogeneratePattern": "",
          "hidden": false,
          "id": "text3208210256",
          "max": 0,
          "min": 0,
          "name": "id",
          "pattern": "^[a-z0-9]+$",
          "presentable": false,
          "primaryKey": true,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "hidden": false,
          "id": "_clone_fe8l",
          "maxSize": 0,
          "name": "valid_permissions",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "json"
        },
        {
          "cascadeDelete": false,
          "collectionId": "pbc_498656437",
          "hidden": false,
          "id": "relation2281853540",
          "maxSelect": 1,
          "minSelect": 0,
          "name": "id_sys_menus",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "relation"
        },
        {
          "cascadeDelete": true,
          "collectionId": "pbc_368526849",
          "hidden": false,
          "id": "_clone_uAcV",
          "maxSelect": 1,
          "minSelect": 0,
          "name": "id_sys_menu_item",
          "presentable": false,
          "required": true,
          "system": false,
          "type": "relation"
        },
        {
          "cascadeDelete": true,
          "collectionId": "pbc_498656437",
          "hidden": false,
          "id": "_clone_vyc9",
          "maxSelect": 1,
          "minSelect": 0,
          "name": "id_sys_menus_parent",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "relation"
        },
        {
          "hidden": false,
          "id": "_clone_5Gv9",
          "max": 9999,
          "min": 1,
          "name": "sorder",
          "onlyInt": true,
          "presentable": false,
          "required": true,
          "system": false,
          "type": "number"
        },
        {
          "autogeneratePattern": "",
          "hidden": false,
          "id": "_clone_wOcQ",
          "max": 0,
          "min": 0,
          "name": "title",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": true,
          "system": false,
          "type": "text"
        },
        {
          "autogeneratePattern": "",
          "hidden": false,
          "id": "_clone_0d4Z",
          "max": 0,
          "min": 0,
          "name": "caption",
          "pattern": "",
          "presentable": false,
          "primaryKey": false,
          "required": true,
          "system": false,
          "type": "text"
        },
        {
          "cascadeDelete": false,
          "collectionId": "pbc_1452049888",
          "hidden": false,
          "id": "relation3695810152",
          "maxSelect": 1,
          "minSelect": 0,
          "name": "id_role",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "relation"
        },
        {
          "hidden": false,
          "id": "_clone_K7mf",
          "maxSize": 0,
          "name": "available_permissions",
          "presentable": false,
          "required": true,
          "system": false,
          "type": "json"
        },
        {
          "autogeneratePattern": "",
          "hidden": false,
          "id": "_clone_M7ny",
          "max": 0,
          "min": 0,
          "name": "url",
          "pattern": "^(/[a-zA-Z0-9/-]*|#)$",
          "presentable": false,
          "primaryKey": false,
          "required": true,
          "system": false,
          "type": "text"
        },
        {
          "hidden": false,
          "id": "_clone_TFJP",
          "maxSelect": 1,
          "name": "status_acl_roles_menus",
          "presentable": false,
          "required": true,
          "system": false,
          "type": "select",
          "values": [
            "active",
            "passive"
          ]
        },
        {
          "hidden": false,
          "id": "_clone_TjVh",
          "maxSelect": 1,
          "name": "status_sys_menus",
          "presentable": false,
          "required": true,
          "system": false,
          "type": "select",
          "values": [
            "active",
            "passive"
          ]
        },
        {
          "hidden": false,
          "id": "_clone_EbNa",
          "maxSelect": 1,
          "name": "status_acl_roles",
          "presentable": false,
          "required": true,
          "system": false,
          "type": "select",
          "values": [
            "active",
            "passive"
          ]
        },
        {
          "hidden": false,
          "id": "_clone_lcZp",
          "maxSelect": 1,
          "name": "status_sys_menu_items",
          "presentable": false,
          "required": true,
          "system": false,
          "type": "select",
          "values": [
            "active",
            "passive"
          ]
        }
      ],
      "id": "pbc_2926740490",
      "indexes": [],
      "listRule": "@request.auth.id != \"\" && \n(\n  @request.auth.role ~ \":demo:%\" || \n  @request.auth.role ~ \":user:%\" || \n  @request.auth.role ~ \":superuser:%\" || \n  @request.auth.role ~ \":admin:%\" || \n  @request.auth.role ~ \":superadmin:%\" || \n  @request.auth.role ~ \":system:%\" || \n  @request.auth.role ~ \":developer:%\"\n)",
      "name": "acl_roles_menus_view",
      "system": false,
      "type": "view",
      "updateRule": null,
      "viewQuery": "SELECT\n  t1.id,\n  t1.valid_permissions, \n  t2.id as id_sys_menus, \n  t2.sys_menu_item as id_sys_menu_item, \n  t2.parent_id as id_sys_menus_parent, \n  t2.sorder,\n  t2.title,\n  t2.caption,\n  t3.id as id_role,\n  t4.available_permissions,\n  t4.url,\n  t1.status as status_acl_roles_menus,\n  t2.status as status_sys_menus,\n  t3.status as status_acl_roles,\n  t4.status as status_sys_menu_items\nFROM acl_roles_menus as t1\nJOIN sys_menus as t2 ON t1.menu=t2.id\nJOIN acl_roles as t3 ON t1.role=t3.id\nJOIN sys_menu_items as t4 ON t2.sys_menu_item=t4.id\nORDER BY t2.sorder ASC\n\n\n\n",
      "viewRule": "@request.auth.id != \"\" && \n(\n  @request.auth.role ~ \":demo:%\" || \n  @request.auth.role ~ \":user:%\" || \n  @request.auth.role ~ \":superuser:%\" || \n  @request.auth.role ~ \":admin:%\" || \n  @request.auth.role ~ \":superadmin:%\" || \n  @request.auth.role ~ \":system:%\" || \n  @request.auth.role ~ \":developer:%\"\n)"
    },
    {
      "createRule": null,
      "deleteRule": null,
      "fields": [
        {
          "autogeneratePattern": "",
          "hidden": false,
          "id": "text3208210256",
          "max": 0,
          "min": 0,
          "name": "id",
          "pattern": "^[a-z0-9]+$",
          "presentable": false,
          "primaryKey": true,
          "required": true,
          "system": true,
          "type": "text"
        },
        {
          "hidden": false,
          "id": "json3097235076",
          "maxSize": 1,
          "name": "subtotal",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "json"
        },
        {
          "hidden": false,
          "id": "json1843064012",
          "maxSize": 1,
          "name": "kn",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "json"
        },
        {
          "hidden": false,
          "id": "json2427983286",
          "maxSize": 1,
          "name": "kt",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "json"
        },
        {
          "hidden": false,
          "id": "json2539932124",
          "maxSize": 1,
          "name": "producer",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "json"
        },
        {
          "hidden": false,
          "id": "json258142582",
          "maxSize": 1,
          "name": "region",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "json"
        },
        {
          "hidden": false,
          "id": "json3485334036",
          "maxSize": 1,
          "name": "note",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "json"
        },
        {
          "hidden": false,
          "id": "json335959144",
          "maxSize": 1,
          "name": "kg",
          "presentable": false,
          "required": false,
          "system": false,
          "type": "json"
        }
      ],
      "id": "pbc_1075535434",
      "indexes": [],
      "listRule": "@request.auth.id != \"\" && \n(\n  @request.auth.role ~ \":demo:%\" || \n  @request.auth.role ~ \":user:%\" || \n  @request.auth.role ~ \":superuser:%\" || \n  @request.auth.role ~ \":admin:%\" || \n  @request.auth.role ~ \":superadmin:%\" || \n  @request.auth.role ~ \":system:%\" || \n  @request.auth.role ~ \":developer:%\"\n)",
      "name": "test_subtotal_view",
      "system": false,
      "type": "view",
      "updateRule": null,
      "viewQuery": "-- ----------------------------------------------------------------\n-- Format: 00000999_00_20250912_00000011\n-- -\n-- 1. PART\n-- 0000 = KAMYON NUMARASI OLANLAR (PROGRAMLANMIŞ)\n-- 0001 = KAMYON NUMARASI OLMAYANLAR\n-- 0002 = 1888 VEYA 8888 KAMYON NUMARASI OLANLAR (ALINMAYACAK[1888] ve ALIMDAN KALANLAR[8888])\n-- ZZZZ = EN ALT TOPLAM KIRILIMI\n-- -\n-- 2. PART\n-- 0 = KAYITTA HEM KN HEM KT VAR\n-- 1 = KAYITTA KN VEYA KT YOK\n-- Z = EN ALT TOPLAM KIRILIMI\n-- -\n-- 3. PART\n-- 20250912 = KT VAR\n-- 99999999 = KT YOK\n-- ZZZZZZZZ = EN ALT TOPLAM KIRILIMI\n-- -\n-- 4. PART\n-- 00000011 = KN VAR\n-- 00000999 = KN YOK\n-- ZZZZZZZZ = EN ALT TOPLAM KIRILIMI\n-- ----------------------------------------------------------------\n-- QUERY WITH CTE\nWITH BaseRecords AS (\n    SELECT\n        t1.id,\n        t1.kn,\n        t1.kt,\n        t1.producer,\n        t1.region,\n        t1.note,\n        t1.kg,\n        (\n            CASE\n                WHEN t1.kn = 1888\n                OR t1.kn = 8888 THEN printf('%04d', 2)\n                WHEN t1.kn > 0 THEN printf('%04d', 0)\n                ELSE printf('%04d', 1)\n            END || '_' || CASE\n                WHEN t1.kn > 0\n                AND t1.kt != '' THEN '0'\n                ELSE '1'\n            END || '_' || CASE\n                WHEN t1.kt = '' THEN '99999999'\n                ELSE strftime('%Y%m%d', t1.kt)\n            END || '_' || CASE\n                WHEN t1.kn = 0 THEN printf('%04d', 9999)\n                ELSE printf('%04d', t1.kn)\n            END\n        ) AS calculated_subtotal_level1,\n        (\n            CASE\n                WHEN t1.kn = 1888\n                OR t1.kn = 8888 THEN printf('%04d', 2)\n                WHEN t1.kn > 0 THEN printf('%04d', 0)\n                ELSE printf('%04d', 1)\n            END || '_' || CASE\n                WHEN t1.kn > 0\n                AND t1.kt != '' THEN '0'\n                ELSE '1'\n            END || '_' || CASE\n                WHEN t1.kt = '' THEN '99999999'\n                ELSE strftime('%Y%m%d', t1.kt)\n            END || '_ZZZZ'\n        ) AS calculated_subtotal_level2,\n        (\n            CASE\n                WHEN t1.kn = 1888\n                OR t1.kn = 8888 THEN printf('%04d', 2)\n                WHEN t1.kn > 0 THEN printf('%04d', 0)\n                ELSE printf('%04d', 1)\n            END || '_' || CASE\n                WHEN kn > 0\n                AND kt != '' THEN '0'\n                ELSE '1'\n            END || '_ZZZZZZZZ_ZZZZ'\n        ) AS calculated_subtotal_level3,\n        (\n            CASE\n                WHEN t1.kn = 1888\n                OR t1.kn = 8888 THEN printf('%04d', 2)\n                WHEN t1.kn > 0 THEN printf('%04d', 0)\n                ELSE printf('%04d', 1)\n            END || '_Z_ZZZZZZZZ_ZZZZ'\n        ) AS calculated_subtotal_level4,\n        ('ZZZZ_Z_ZZZZZZZZ_ZZZZ') AS calculated_subtotal_level5\n    FROM\n        test_subtotal as t1\n)\nSELECT\n    id,\n    subtotal,\n    kn,\n    kt,\n    producer,\n    region,\n    note,\n    kg\nFROM\n    (\n        SELECT\n            -- ALL RECORDS\n            id,\n            calculated_subtotal_level1 AS subtotal,\n            kn,\n            kt,\n            producer,\n            region,\n            note,\n            kg\n        FROM\n            BaseRecords\n        UNION\n        ALL\n        SELECT\n            -- SUB TOTAL 1\n            ('subtotal1_' || (ROW_NUMBER() OVER())) AS id,\n            calculated_subtotal_level1 AS subtotal,\n            MAX(kn) as kn,\n            MAX(kt) as kt,\n            'SUB-1' as producer,\n            'SUB-1' as region,\n            'SUB-1' as note,\n            SUM(kg) AS kg\n        FROM\n            BaseRecords\n        GROUP BY\n            calculated_subtotal_level1\n        UNION\n        ALL\n        SELECT\n            -- SUB TOTAL 2\n            ('subtotal2_' || (ROW_NUMBER() OVER())) AS id,\n            calculated_subtotal_level2 AS subtotal,\n            0 as kn,\n            MAX(kt) as kt,\n            'SUB-2' as producer,\n            'SUB-2' as region,\n            'SUB-2' as note,\n            SUM(kg) AS kg\n        FROM\n            BaseRecords\n        GROUP BY\n            calculated_subtotal_level2\n        UNION\n        ALL\n        SELECT\n            -- SUB TOTAL 3\n            ('subtotal3_' || (ROW_NUMBER() OVER())) AS id,\n            calculated_subtotal_level3 AS subtotal,\n            0 as kn,\n            '' as kt,\n            'SUB-3' as producer,\n            'SUB-3' as region,\n            'SUB-3' as note,\n            SUM(kg) AS kg\n        FROM\n            BaseRecords\n        GROUP BY\n            calculated_subtotal_level3\n        UNION\n        ALL\n        SELECT\n            -- SUB TOTAL 4\n            ('subtotal4_' || (ROW_NUMBER() OVER())) AS id,\n            calculated_subtotal_level4 AS subtotal,\n            0 as kn,\n            '' as kt,\n            'SUB-4' as producer,\n            'SUB-4' as region,\n            'SUB-4' as note,\n            SUM(kg) AS kg\n        FROM\n            BaseRecords\n        GROUP BY\n            calculated_subtotal_level4\n        UNION\n        ALL\n        SELECT\n            -- SUB TOTAL 5\n            ('subtotal5_' || (ROW_NUMBER() OVER())) AS id,\n            calculated_subtotal_level5 AS subtotal,\n            0 as kn,\n            '' as kt,\n            'SUB-5' as producer,\n            'SUB-5' as region,\n            'SUB-5' as note,\n            SUM(kg) AS kg\n        FROM\n            BaseRecords\n        GROUP BY\n            calculated_subtotal_level5\n    )\nORDER BY\n    subtotal,\n    producer;",
      "viewRule": "@request.auth.id != \"\" && \n(\n  @request.auth.role ~ \":demo:%\" || \n  @request.auth.role ~ \":user:%\" || \n  @request.auth.role ~ \":superuser:%\" || \n  @request.auth.role ~ \":admin:%\" || \n  @request.auth.role ~ \":superadmin:%\" || \n  @request.auth.role ~ \":system:%\" || \n  @request.auth.role ~ \":developer:%\"\n)"
    }
  ];

  return app.importCollections(snapshot, false);
}, (/* app */) => {
  return null;
});
