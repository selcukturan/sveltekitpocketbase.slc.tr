/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_869937432")

  // add field
  collection.fields.addAt(7, new Field({
    "hidden": false,
    "id": "number502031531",
    "max": null,
    "min": null,
    "name": "number_optional",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_869937432")

  // remove field
  collection.fields.removeById("number502031531")

  return app.save(collection)
})
