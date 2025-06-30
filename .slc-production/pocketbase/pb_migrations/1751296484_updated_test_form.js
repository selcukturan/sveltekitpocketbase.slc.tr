/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_869937432")

  // add field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "date2434753446",
    "max": "",
    "min": "",
    "name": "datetime_required",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "date"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_869937432")

  // remove field
  collection.fields.removeById("date2434753446")

  return app.save(collection)
})
