/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3562506448")

  // add field
  collection.fields.addAt(12, new Field({
    "help": "",
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
  collection.fields.addAt(13, new Field({
    "help": "",
    "hidden": false,
    "id": "date3967440891",
    "max": "",
    "min": "",
    "name": "datetime_optional",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3562506448")

  // remove field
  collection.fields.removeById("date1590425842")

  // remove field
  collection.fields.removeById("date3967440891")

  return app.save(collection)
})
