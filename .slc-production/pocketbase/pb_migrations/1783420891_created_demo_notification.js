/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "createRule": "@request.auth.id != \"\" ",
    "deleteRule": "@request.auth.id = user.id",
    "fields": [
      {
        "autogeneratePattern": "[a-z0-9]{15}",
        "help": "",
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
        "cascadeDelete": false,
        "collectionId": "_pb_users_auth_",
        "help": "",
        "hidden": false,
        "id": "relation2375276105",
        "maxSelect": 100,
        "minSelect": 0,
        "name": "user",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "relation"
      },
      {
        "autogeneratePattern": "",
        "help": "",
        "hidden": false,
        "id": "text724990059",
        "max": 255,
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
        "convertURLs": false,
        "help": "",
        "hidden": false,
        "id": "editor3065852031",
        "maxSize": 0,
        "name": "message",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "editor"
      },
      {
        "help": "",
        "hidden": false,
        "id": "select1274211008",
        "maxSelect": 0,
        "name": "select",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "select",
        "values": [
          "info",
          "success",
          "warning",
          "error"
        ]
      },
      {
        "cascadeDelete": false,
        "collectionId": "_pb_users_auth_",
        "help": "",
        "hidden": false,
        "id": "relation3074823948",
        "maxSelect": 100,
        "minSelect": 0,
        "name": "read_by",
        "presentable": false,
        "required": false,
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
      }
    ],
    "id": "pbc_2580846381",
    "indexes": [],
    "listRule": "@request.auth.id != \"\" && (@request.auth.id = user.id || user:length = 0)",
    "name": "demo_notification",
    "system": false,
    "type": "base",
    "updateRule": "// Giriş yapmış kullanıcı kendi ID'sini ekliyor olmalı ve başlık/mesaj gibi alanları değiştirememeli\n@request.auth.id != \"\" && \n@request.body.read_by:isset = true && \n@request.body.title:isset = false && \n@request.body.message:isset = false",
    "viewRule": "@request.auth.id != \"\" && (@request.auth.id = user.id || user:length = 0)"
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2580846381");

  return app.delete(collection);
})
