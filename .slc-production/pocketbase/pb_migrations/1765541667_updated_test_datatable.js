/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3040204514")

  // add field
  collection.fields.addAt(19, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_3411194938",
    "hidden": false,
    "id": "relation1893788055",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "select_relation",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3040204514")

  // remove field
  collection.fields.removeById("relation1893788055")

  return app.save(collection)
})
