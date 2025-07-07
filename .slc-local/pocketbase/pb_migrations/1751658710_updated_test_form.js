/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_869937432")

  // add field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "date1590425842",
    "max": "",
    "min": "",
    "name": "date_optional",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  // add field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "date598658223",
    "max": "",
    "min": "",
    "name": "date_required",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "date"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_869937432")

  // remove field
  collection.fields.removeById("date1590425842")

  // remove field
  collection.fields.removeById("date598658223")

  return app.save(collection)
})
