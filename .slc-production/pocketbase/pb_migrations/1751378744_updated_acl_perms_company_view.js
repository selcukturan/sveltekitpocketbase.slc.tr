/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_33793606622")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT\n  (ROW_NUMBER() OVER()) as id,\n  parent_id,\n  sorder,\n  type,\n  value,\n  title,\n  caption\nFROM\n  acl_perms_company\nWHERE\n  status=\"active\"\nORDER BY \n  sorder, type, value ASC"
  }, collection)

  // remove field
  collection.fields.removeById("json3993945260")

  // remove field
  collection.fields.removeById("_clone_A003")

  // remove field
  collection.fields.removeById("_clone_i7dF")

  // remove field
  collection.fields.removeById("_clone_swNm")

  // remove field
  collection.fields.removeById("_clone_mCXN")

  // remove field
  collection.fields.removeById("_clone_32jy")

  // remove field
  collection.fields.removeById("_clone_TVg2")

  // add field
  collection.fields.addAt(1, new Field({
    "cascadeDelete": true,
    "collectionId": "pbc_3641971933",
    "hidden": false,
    "id": "_clone_0bit",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "parent_id",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(2, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_kpNV",
    "max": 0,
    "min": 0,
    "name": "sorder",
    "pattern": "^\\d{3}(\\.\\d{3}){0,8}$",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "_clone_uOEg",
    "maxSelect": 1,
    "name": "type",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "company",
      "storage",
      "year"
    ]
  }))

  // add field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "_clone_LS5a",
    "max": 2100,
    "min": 1900,
    "name": "value",
    "onlyInt": true,
    "presentable": false,
    "required": true,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(5, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_QiMR",
    "max": 0,
    "min": 0,
    "name": "title",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(6, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_QXVr",
    "max": 0,
    "min": 0,
    "name": "caption",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_33793606622")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT\n  (ROW_NUMBER() OVER()) as id,\n  IIF(parent_id = \"\", id, parent_id) AS effective_parent_id,\n  parent_id,\n  sorder,\n  type,\n  value,\n  title,\n  caption\nFROM\n  acl_perms_company\nWHERE\n  status=\"active\"\nORDER BY \n  effective_parent_id, type, value ASC"
  }, collection)

  // add field
  collection.fields.addAt(1, new Field({
    "hidden": false,
    "id": "json3993945260",
    "maxSize": 1,
    "name": "effective_parent_id",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  // add field
  collection.fields.addAt(2, new Field({
    "cascadeDelete": true,
    "collectionId": "pbc_3641971933",
    "hidden": false,
    "id": "_clone_A003",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "parent_id",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(3, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_i7dF",
    "max": 0,
    "min": 0,
    "name": "sorder",
    "pattern": "^\\d{3}(\\.\\d{3}){0,8}$",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "_clone_swNm",
    "maxSelect": 1,
    "name": "type",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "company",
      "storage",
      "year"
    ]
  }))

  // add field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "_clone_mCXN",
    "max": 2100,
    "min": 1900,
    "name": "value",
    "onlyInt": true,
    "presentable": false,
    "required": true,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(6, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_32jy",
    "max": 0,
    "min": 0,
    "name": "title",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(7, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_TVg2",
    "max": 0,
    "min": 0,
    "name": "caption",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // remove field
  collection.fields.removeById("_clone_0bit")

  // remove field
  collection.fields.removeById("_clone_kpNV")

  // remove field
  collection.fields.removeById("_clone_uOEg")

  // remove field
  collection.fields.removeById("_clone_LS5a")

  // remove field
  collection.fields.removeById("_clone_QiMR")

  // remove field
  collection.fields.removeById("_clone_QXVr")

  return app.save(collection)
})
