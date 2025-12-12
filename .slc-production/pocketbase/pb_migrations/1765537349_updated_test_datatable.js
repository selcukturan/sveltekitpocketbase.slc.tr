/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3040204514")

  // add field
  collection.fields.addAt(18, new Field({
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
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3040204514")

  // remove field
  collection.fields.removeById("select1013027977")

  return app.save(collection)
})
