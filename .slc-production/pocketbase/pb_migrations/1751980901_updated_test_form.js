/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_869937432")

  // add field
  collection.fields.addAt(7, new Field({
    "hidden": false,
    "id": "number1192961408",
    "max": null,
    "min": null,
    "name": "integer_number_optional",
    "onlyInt": true,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(8, new Field({
    "hidden": false,
    "id": "number981340637",
    "max": null,
    "min": null,
    "name": "integer_number_required",
    "onlyInt": true,
    "presentable": false,
    "required": true,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_869937432")

  // remove field
  collection.fields.removeById("number1192961408")

  // remove field
  collection.fields.removeById("number981340637")

  return app.save(collection)
})
