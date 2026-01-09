/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3040204514")

  // add field
  collection.fields.addAt(26, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_4021506269",
    "hidden": false,
    "id": "relation3716360079",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "relation_single",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(27, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_1681960645",
    "hidden": false,
    "id": "relation581715900",
    "maxSelect": 999,
    "minSelect": 0,
    "name": "relation_multiple",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3040204514")

  // remove field
  collection.fields.removeById("relation3716360079")

  // remove field
  collection.fields.removeById("relation581715900")

  return app.save(collection)
})
