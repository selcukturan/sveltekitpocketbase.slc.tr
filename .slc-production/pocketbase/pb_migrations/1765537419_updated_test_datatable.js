/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3040204514")

  // update field
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "select1013027977",
    "maxSelect": 3,
    "name": "select_multiple",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "html",
      "css",
      "js"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3040204514")

  // update field
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "select1013027977",
    "maxSelect": 3,
    "name": "select_mltiple",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "html",
      "css",
      "js"
    ]
  }))

  return app.save(collection)
})
