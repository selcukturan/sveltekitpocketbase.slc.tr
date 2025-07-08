/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_869937432")

  // update field
  collection.fields.addAt(9, new Field({
    "hidden": false,
    "id": "number2370544231",
    "max": null,
    "min": null,
    "name": "decimal_number_optional",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_869937432")

  // update field
  collection.fields.addAt(9, new Field({
    "hidden": false,
    "id": "number2370544231",
    "max": null,
    "min": null,
    "name": "decimal_number_optional",
    "onlyInt": true,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
})
