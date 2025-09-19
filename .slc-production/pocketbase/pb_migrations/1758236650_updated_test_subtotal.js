/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3301652643")

  // update field
  collection.fields.addAt(1, new Field({
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
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3301652643")

  // update field
  collection.fields.addAt(1, new Field({
    "hidden": false,
    "id": "number1843064012",
    "max": 900,
    "min": 0,
    "name": "kn",
    "onlyInt": true,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
})
