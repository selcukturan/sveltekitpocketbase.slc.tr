/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // update collection data
  unmarshal({
    "createRule": "// rol: aktif, superadmin ve üstü roller.\nid = @request.auth.id && \n@request.auth.role.status ?= \"active\" &&\n@request.auth.role.order ?>= 4",
    "deleteRule": "// rol: aktif, superadmin ve üstü roller.\nid = @request.auth.id && \n@request.auth.role.status ?= \"active\" &&\n@request.auth.role.order ?>= 4",
    "listRule": "// rol: aktif, tüm roller.\nid = @request.auth.id && \n@request.auth.role.status ?= \"active\"\n",
    "updateRule": "// rol: aktif, admin ve üstü roller.\nid = @request.auth.id && \n@request.auth.role.status ?= \"active\" &&\n@request.auth.role.order ?>= 3",
    "viewRule": "// rol: aktif, tüm roller.\nid = @request.auth.id && \n@request.auth.role.status ?= \"active\""
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // update collection data
  unmarshal({
    "createRule": "id = @request.auth.id && \n@collection.acl_roles.id ?= @request.auth.role.id && \n@collection.acl_roles.status ?= \"active\" &&\n(\n  @collection.acl_roles.type ?= \"superadmin\" || \n  @collection.acl_roles.type ?= \"system\" || \n  @collection.acl_roles.type ?= \"developer\"\n)",
    "deleteRule": "id = @request.auth.id && \n@collection.acl_roles.id ?= @request.auth.role.id && \n@collection.acl_roles.status ?= \"active\" &&\n(\n  @collection.acl_roles.type ?= \"superadmin\" || \n  @collection.acl_roles.type ?= \"system\" || \n  @collection.acl_roles.type ?= \"developer\"\n)",
    "listRule": "id = @request.auth.id && \n@collection.acl_roles.id ?= @request.auth.role.id && \n@collection.acl_roles.status ?= \"active\" &&\n(\n  @collection.acl_roles.type ?= \"demo\" || \n  @collection.acl_roles.type ?= \"user\" || \n  @collection.acl_roles.type ?= \"superuser\" || \n  @collection.acl_roles.type ?= \"admin\" || \n  @collection.acl_roles.type ?= \"superadmin\" || \n  @collection.acl_roles.type ?= \"system\" || \n  @collection.acl_roles.type ?= \"developer\"\n)",
    "updateRule": "id = @request.auth.id && \n@collection.acl_roles.id ?= @request.auth.role.id && \n@collection.acl_roles.status ?= \"active\" &&\n(\n  @collection.acl_roles.type ?= \"admin\" || \n  @collection.acl_roles.type ?= \"superadmin\" || \n  @collection.acl_roles.type ?= \"system\" || \n  @collection.acl_roles.type ?= \"developer\"\n)",
    "viewRule": "id = @request.auth.id && \n@collection.acl_roles.id ?= @request.auth.role.id && \n@collection.acl_roles.status ?= \"active\" &&\n(\n  @collection.acl_roles.type ?= \"demo\" || \n  @collection.acl_roles.type ?= \"user\" || \n  @collection.acl_roles.type ?= \"superuser\" || \n  @collection.acl_roles.type ?= \"admin\" || \n  @collection.acl_roles.type ?= \"superadmin\" || \n  @collection.acl_roles.type ?= \"system\" || \n  @collection.acl_roles.type ?= \"developer\"\n)"
  }, collection)

  return app.save(collection)
})
