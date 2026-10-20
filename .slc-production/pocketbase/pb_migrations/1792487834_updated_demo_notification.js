/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2580846381")

  // update collection data
  unmarshal({
    "deleteRule": "@request.auth.id = to.id",
    "listRule": "@request.auth.id != \"\" && (@request.auth.id ?= to.id || to:length = 0)",
    "viewRule": "@request.auth.id != \"\" && (@request.auth.id ?= to.id || to:length = 0)"
  }, collection)

  // add field
  collection.fields.addAt(1, new Field({
    "cascadeDelete": false,
    "collectionId": "_pb_users_auth_",
    "help": "",
    "hidden": false,
    "id": "relation3105530224",
    "maxSelect": 0,
    "minSelect": 0,
    "name": "from",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(7, new Field({
    "cascadeDelete": false,
    "collectionId": "_pb_users_auth_",
    "help": "",
    "hidden": false,
    "id": "relation3490478822",
    "maxSelect": 10,
    "minSelect": 0,
    "name": "remove_by",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // update field
  collection.fields.addAt(2, new Field({
    "cascadeDelete": false,
    "collectionId": "_pb_users_auth_",
    "help": "",
    "hidden": false,
    "id": "relation2375276105",
    "maxSelect": 100,
    "minSelect": 0,
    "name": "to",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // update field
  collection.fields.addAt(5, new Field({
    "help": "",
    "hidden": false,
    "id": "select1274211008",
    "maxSelect": 0,
    "name": "type",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "notification",
      "message"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2580846381")

  // update collection data
  unmarshal({
    "deleteRule": "@request.auth.id = user.id",
    "listRule": "@request.auth.id != \"\" && (@request.auth.id ?= user.id || user:length = 0)",
    "viewRule": "@request.auth.id != \"\" && (@request.auth.id ?= user.id || user:length = 0)"
  }, collection)

  // remove field
  collection.fields.removeById("relation3105530224")

  // remove field
  collection.fields.removeById("relation3490478822")

  // update field
  collection.fields.addAt(1, new Field({
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
  }))

  // update field
  collection.fields.addAt(4, new Field({
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
  }))

  return app.save(collection)
})
