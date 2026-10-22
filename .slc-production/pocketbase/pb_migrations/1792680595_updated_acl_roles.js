/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1452049888")

  // update collection data
  unmarshal({
    "createRule": "// rol: aktif, admin ve üstü roller.\n@request.auth.id != \"\" &&\n@request.auth.role.status ?= \"active\" &&\n@request.auth.role.order ?>= 3",
    "deleteRule": "// rol: aktif, admin ve üstü roller.\n@request.auth.id != \"\" &&\n@request.auth.role.status ?= \"active\" &&\n@request.auth.role.order ?>= 3",
    "listRule": "// rol: aktif, demo rolü, admin ve üstü roller.\n@request.auth.id != \"\" &&\n@request.auth.role.status ?= \"active\" &&\n(\n  @request.auth.role.order ?= 0 ||\n  @request.auth.role.order ?>= 3\n)",
    "updateRule": "// rol: aktif, admin ve üstü roller.\n@request.auth.id != \"\" &&\n@request.auth.role.status ?= \"active\" &&\n@request.auth.role.order ?>= 3",
    "viewRule": "// rol: aktif, demo rolü, admin ve üstü roller.\n@request.auth.id != \"\" &&\n@request.auth.role.status ?= \"active\" &&\n(\n  @request.auth.role.order ?= 0 ||\n  @request.auth.role.order ?>= 3\n)"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1452049888")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.id != \"\" && \n@collection.acl_roles.id ?= @request.auth.role.id && \n@collection.acl_roles.status ?= \"active\" &&\n(\n  @collection.acl_roles.type ?= \"admin\" || \n  @collection.acl_roles.type ?= \"superadmin\" || \n  @collection.acl_roles.type ?= \"system\" || \n  @collection.acl_roles.type ?= \"developer\"\n)",
    "deleteRule": "@request.auth.id != \"\" && \n@collection.acl_roles.id ?= @request.auth.role.id && \n@collection.acl_roles.status ?= \"active\" &&\n(\n  @collection.acl_roles.type ?= \"admin\" || \n  @collection.acl_roles.type ?= \"superadmin\" || \n  @collection.acl_roles.type ?= \"system\" || \n  @collection.acl_roles.type ?= \"developer\"\n)",
    "listRule": "@request.auth.id != \"\" && \n@collection.acl_roles.id ?= @request.auth.role.id && \n@collection.acl_roles.status ?= \"active\" &&\n(\n  @collection.acl_roles.type ?= \"demo\" || \n  @collection.acl_roles.type ?= \"admin\" || \n  @collection.acl_roles.type ?= \"superadmin\" || \n  @collection.acl_roles.type ?= \"system\" || \n  @collection.acl_roles.type ?= \"developer\"\n)",
    "updateRule": "@request.auth.id != \"\" && \n@collection.acl_roles.id ?= @request.auth.role.id && \n@collection.acl_roles.status ?= \"active\" &&\n(\n  @collection.acl_roles.type ?= \"admin\" || \n  @collection.acl_roles.type ?= \"superadmin\" || \n  @collection.acl_roles.type ?= \"system\" || \n  @collection.acl_roles.type ?= \"developer\"\n)",
    "viewRule": "@request.auth.id != \"\" && \n@collection.acl_roles.id ?= @request.auth.role.id && \n@collection.acl_roles.status ?= \"active\" &&\n(\n  @collection.acl_roles.type ?= \"demo\" || \n  @collection.acl_roles.type ?= \"admin\" || \n  @collection.acl_roles.type ?= \"superadmin\" || \n  @collection.acl_roles.type ?= \"system\" || \n  @collection.acl_roles.type ?= \"developer\"\n)"
  }, collection)

  return app.save(collection)
})
