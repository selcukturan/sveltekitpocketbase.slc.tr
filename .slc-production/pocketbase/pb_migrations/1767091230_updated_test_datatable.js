/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3040204514")

  // update field
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "file2729472648",
    "maxSelect": 99,
    "maxSize": 0,
    "mimeTypes": [
      "image/png",
      "image/jpeg"
    ],
    "name": "multiple_files",
    "presentable": false,
    "protected": true,
    "required": false,
    "system": false,
    "thumbs": [],
    "type": "file"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3040204514")

  // update field
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "file2729472648",
    "maxSelect": 99,
    "maxSize": 0,
    "mimeTypes": [],
    "name": "multiple_files",
    "presentable": false,
    "protected": true,
    "required": false,
    "system": false,
    "thumbs": [],
    "type": "file"
  }))

  return app.save(collection)
})
