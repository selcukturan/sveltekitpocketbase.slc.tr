/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3389289099")

  // update collection data
  unmarshal({
    "listRule": "// rol: aktif, tüm roller.\n@request.auth.id != \"\" &&\n@request.auth.role.status ?= \"active\"",
    "updateRule": "// rol: aktif, tüm roller.\n@request.auth.id != \"\" &&\n@request.auth.role.status ?= \"active\"",
    "viewRule": "// rol: aktif, tüm roller.\n@request.auth.id != \"\" &&\n@request.auth.role.status ?= \"active\""
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3389289099")

  // update collection data
  unmarshal({
    "listRule": null,
    "updateRule": null,
    "viewRule": null
  }, collection)

  return app.save(collection)
})
