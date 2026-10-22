/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3065422620")

  // update collection data
  unmarshal({
    "createRule": "// rol: aktif, admin ve üstü roller.\n@request.auth.id != \"\" &&\n@request.auth.role.status ?= \"active\" &&\n@request.auth.role.order ?>= 30",
    "deleteRule": "// rol: aktif, admin ve üstü roller.\n@request.auth.id != \"\" &&\n@request.auth.role.status ?= \"active\" &&\n@request.auth.role.order ?>= 30",
    "updateRule": "// rol: aktif, admin ve üstü roller.\n@request.auth.id != \"\" &&\n@request.auth.role.status ?= \"active\" &&\n@request.auth.role.order ?>= 30"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3065422620")

  // update collection data
  unmarshal({
    "createRule": "// rol: aktif, admin ve üstü roller.\n@request.auth.id != \"\" &&\n@request.auth.role.status ?= \"active\" &&\n@request.auth.role.order ?>= 3",
    "deleteRule": "// rol: aktif, admin ve üstü roller.\n@request.auth.id != \"\" &&\n@request.auth.role.status ?= \"active\" &&\n@request.auth.role.order ?>= 3",
    "updateRule": "// rol: aktif, admin ve üstü roller.\n@request.auth.id != \"\" &&\n@request.auth.role.status ?= \"active\" &&\n@request.auth.role.order ?>= 3"
  }, collection)

  return app.save(collection)
})
