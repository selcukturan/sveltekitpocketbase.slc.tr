/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_869937432")

  // add field
  collection.fields.addAt(10, new Field({
    "hidden": false,
    "id": "number4029584954",
    "max": null,
    "min": null,
    "name": "decimal_number_required",
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
  collection.fields.removeById("number4029584954")

  return app.save(collection)
})
