/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2926740490")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT\n  t1.id,\n  t1.valid_permissions, \n  t2.id as id_sys_menus, \n  t2.sys_menu_item as id_sys_menu_item, \n  t2.parent_id as id_sys_menus_parent, \n  t2.sorder,\n  t2.title,\n  t2.caption,\n  t3.id as id_role,\n  t4.available_permissions,\n  t4.url,\n  t1.status as status_acl_roles_menus,\n  t2.status as status_sys_menus,\n  t3.status as status_acl_roles,\n  t4.status as status_sys_menu_items\nFROM acl_roles_menus as t1\nJOIN sys_menus as t2 ON t1.menu=t2.id\nJOIN acl_roles as t3 ON t1.role=t3.id\nJOIN sys_menu_items as t4 ON t2.sys_menu_item=t4.id\nORDER BY t2.sorder ASC\n\n\n\n"
  }, collection)

  // remove field
  collection.fields.removeById("_clone_oQiM")

  // remove field
  collection.fields.removeById("_clone_pMZV")

  // remove field
  collection.fields.removeById("_clone_PeqO")

  // remove field
  collection.fields.removeById("_clone_aaBk")

  // remove field
  collection.fields.removeById("_clone_i7GW")

  // remove field
  collection.fields.removeById("_clone_elj2")

  // remove field
  collection.fields.removeById("_clone_Q9aZ")

  // remove field
  collection.fields.removeById("_clone_Z1qy")

  // remove field
  collection.fields.removeById("_clone_AbDh")

  // remove field
  collection.fields.removeById("_clone_0q5v")

  // remove field
  collection.fields.removeById("_clone_HgHy")

  // remove field
  collection.fields.removeById("_clone_fTpx")

  // add field
  collection.fields.addAt(1, new Field({
    "hidden": false,
    "id": "_clone_8sd9",
    "maxSize": 0,
    "name": "valid_permissions",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  // add field
  collection.fields.addAt(3, new Field({
    "cascadeDelete": true,
    "collectionId": "pbc_368526849",
    "hidden": false,
    "id": "_clone_2ClL",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "id_sys_menu_item",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(4, new Field({
    "cascadeDelete": true,
    "collectionId": "pbc_498656437",
    "hidden": false,
    "id": "_clone_8B3P",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "id_sys_menus_parent",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "_clone_vzsS",
    "max": 9999,
    "min": 1,
    "name": "sorder",
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
    "id": "_clone_md4Q",
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
    "id": "_clone_PBGW",
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

  // add field
  collection.fields.addAt(9, new Field({
    "hidden": false,
    "id": "_clone_3K6p",
    "maxSize": 0,
    "name": "available_permissions",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "json"
  }))

  // add field
  collection.fields.addAt(10, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_qFej",
    "max": 0,
    "min": 0,
    "name": "url",
    "pattern": "^(/[a-zA-Z0-9/-]*|#)$",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(11, new Field({
    "hidden": false,
    "id": "_clone_tbAx",
    "maxSelect": 1,
    "name": "status_acl_roles_menus",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "active",
      "passive"
    ]
  }))

  // add field
  collection.fields.addAt(12, new Field({
    "hidden": false,
    "id": "_clone_Up02",
    "maxSelect": 1,
    "name": "status_sys_menus",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "active",
      "passive"
    ]
  }))

  // add field
  collection.fields.addAt(13, new Field({
    "hidden": false,
    "id": "_clone_EqUU",
    "maxSelect": 1,
    "name": "status_acl_roles",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "active",
      "passive"
    ]
  }))

  // add field
  collection.fields.addAt(14, new Field({
    "hidden": false,
    "id": "_clone_JMWQ",
    "maxSelect": 1,
    "name": "status_sys_menu_items",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "active",
      "passive"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2926740490")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT\n  t1.id,\n  t1.valid_permissions, \n  t2.id as id_sys_menus, \n  t2.sys_menu_item as id_sys_menu_item, \n  t2.parent_id as id_sys_menus_parent, \n  t2.sorder,\n  t2.title,\n  t2.caption,\n  t3.id as id_role,\n  t4.available_permissions,\n  t4.url,\n  t1.status as status_acl_roles_menu,\n  t2.status as status_sys_menus,\n  t3.status as status_acl_roles,\n  t4.status as status_sys_menu_items\nFROM acl_roles_menus as t1\nJOIN sys_menus as t2 ON t1.menu=t2.id\nJOIN acl_roles as t3 ON t1.role=t3.id\nJOIN sys_menu_items as t4 ON t2.sys_menu_item=t4.id\nORDER BY t2.sorder ASC\n\n\n\n"
  }, collection)

  // add field
  collection.fields.addAt(1, new Field({
    "hidden": false,
    "id": "_clone_oQiM",
    "maxSize": 0,
    "name": "valid_permissions",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  // add field
  collection.fields.addAt(3, new Field({
    "cascadeDelete": true,
    "collectionId": "pbc_368526849",
    "hidden": false,
    "id": "_clone_pMZV",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "id_sys_menu_item",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(4, new Field({
    "cascadeDelete": true,
    "collectionId": "pbc_498656437",
    "hidden": false,
    "id": "_clone_PeqO",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "id_sys_menus_parent",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "_clone_aaBk",
    "max": 9999,
    "min": 1,
    "name": "sorder",
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
    "id": "_clone_i7GW",
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
    "id": "_clone_elj2",
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

  // add field
  collection.fields.addAt(9, new Field({
    "hidden": false,
    "id": "_clone_Q9aZ",
    "maxSize": 0,
    "name": "available_permissions",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "json"
  }))

  // add field
  collection.fields.addAt(10, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_Z1qy",
    "max": 0,
    "min": 0,
    "name": "url",
    "pattern": "^(/[a-zA-Z0-9/-]*|#)$",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(11, new Field({
    "hidden": false,
    "id": "_clone_AbDh",
    "maxSelect": 1,
    "name": "status_acl_roles_menu",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "active",
      "passive"
    ]
  }))

  // add field
  collection.fields.addAt(12, new Field({
    "hidden": false,
    "id": "_clone_0q5v",
    "maxSelect": 1,
    "name": "status_sys_menus",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "active",
      "passive"
    ]
  }))

  // add field
  collection.fields.addAt(13, new Field({
    "hidden": false,
    "id": "_clone_HgHy",
    "maxSelect": 1,
    "name": "status_acl_roles",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "active",
      "passive"
    ]
  }))

  // add field
  collection.fields.addAt(14, new Field({
    "hidden": false,
    "id": "_clone_fTpx",
    "maxSelect": 1,
    "name": "status_sys_menu_items",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "active",
      "passive"
    ]
  }))

  // remove field
  collection.fields.removeById("_clone_8sd9")

  // remove field
  collection.fields.removeById("_clone_2ClL")

  // remove field
  collection.fields.removeById("_clone_8B3P")

  // remove field
  collection.fields.removeById("_clone_vzsS")

  // remove field
  collection.fields.removeById("_clone_md4Q")

  // remove field
  collection.fields.removeById("_clone_PBGW")

  // remove field
  collection.fields.removeById("_clone_3K6p")

  // remove field
  collection.fields.removeById("_clone_qFej")

  // remove field
  collection.fields.removeById("_clone_tbAx")

  // remove field
  collection.fields.removeById("_clone_Up02")

  // remove field
  collection.fields.removeById("_clone_EqUU")

  // remove field
  collection.fields.removeById("_clone_JMWQ")

  return app.save(collection)
})
