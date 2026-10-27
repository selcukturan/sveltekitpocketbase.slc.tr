/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3562506448")

  // update field
  collection.fields.addAt(15, new Field({
    "help": "",
    "hidden": false,
    "id": "number502031531",
    "max": null,
    "min": null,
    "name": "number_optional",
    "onlyInt": true,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3562506448")

  // update field
  collection.fields.addAt(15, new Field({
    "help": "",
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
})
