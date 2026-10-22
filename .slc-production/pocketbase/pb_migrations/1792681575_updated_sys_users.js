/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // update collection data
  unmarshal({
    "createRule": "// rol: aktif, superadmin ve üstü roller.\nid = @request.auth.id && \n@request.auth.role.status ?= \"active\" &&\n@request.auth.role.order ?>= 40",
    "deleteRule": "// rol: aktif, superadmin ve üstü roller.\nid = @request.auth.id && \n@request.auth.role.status ?= \"active\" &&\n@request.auth.role.order ?>= 40",
    "updateRule": "// rol: aktif, admin ve üstü roller.\nid = @request.auth.id && \n@request.auth.role.status ?= \"active\" &&\n@request.auth.role.order ?>= 30"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // update collection data
  unmarshal({
    "createRule": "// rol: aktif, superadmin ve üstü roller.\nid = @request.auth.id && \n@request.auth.role.status ?= \"active\" &&\n@request.auth.role.order ?>= 4",
    "deleteRule": "// rol: aktif, superadmin ve üstü roller.\nid = @request.auth.id && \n@request.auth.role.status ?= \"active\" &&\n@request.auth.role.order ?>= 4",
    "updateRule": "// rol: aktif, admin ve üstü roller.\nid = @request.auth.id && \n@request.auth.role.status ?= \"active\" &&\n@request.auth.role.order ?>= 3"
  }, collection)

  return app.save(collection)
})
