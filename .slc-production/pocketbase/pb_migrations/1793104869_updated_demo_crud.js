/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3562506448")

  // add field
  collection.fields.addAt(14, new Field({
    "exceptDomains": null,
    "help": "",
    "hidden": false,
    "id": "email2526580253",
    "name": "email_optional",
    "onlyDomains": null,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "email"
  }))

  // add field
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

  // add field
  collection.fields.addAt(16, new Field({
    "exceptDomains": null,
    "help": "",
    "hidden": false,
    "id": "url4288610269",
    "name": "url_optional",
    "onlyDomains": null,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "url"
  }))

  // add field
  collection.fields.addAt(17, new Field({
    "convertURLs": false,
    "help": "",
    "hidden": false,
    "id": "editor4141411323",
    "maxSize": 0,
    "name": "textarea_optional",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "editor"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3562506448")

  // remove field
  collection.fields.removeById("email2526580253")

  // remove field
  collection.fields.removeById("number502031531")

  // remove field
  collection.fields.removeById("url4288610269")

  // remove field
  collection.fields.removeById("editor4141411323")

  return app.save(collection)
})
