/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3040204514")

  // add field
  collection.fields.addAt(17, new Field({
    "hidden": false,
    "id": "select918010868",
    "maxSelect": 1,
    "name": "select_single",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "windows",
      "mac",
      "linux"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3040204514")

  // remove field
  collection.fields.removeById("select918010868")

  return app.save(collection)
})
