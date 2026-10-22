/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2580846381")

  // update collection data
  unmarshal({
    "createRule": "// Aktif rolü olan kullanıcı kendi adına gönderir; herkese duyuru (to boş) yalnızca admin ve üstü.\n\n@request.auth.id != \"\" &&\n@request.body.from = @request.auth.id &&\n@request.body.from_label = @request.auth.label &&\n@collection.acl_roles.id ?= @request.auth.role.id &&\n@collection.acl_roles.status ?= \"active\" &&\n(\n  @request.body.to:length > 0 ||\n  @collection.acl_roles.type ?= \"admin\" ||\n  @collection.acl_roles.type ?= \"superadmin\" ||\n  @collection.acl_roles.type ?= \"system\" ||\n  @collection.acl_roles.type ?= \"developer\"\n)"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2580846381")

  // update collection data
  unmarshal({
    "createRule": "// Giriş yapmış kullanıcı yalnızca kendi adına gönderebilir: from ve from_label oturumdaki kullanıcıyla aynı olmalı.\n\n@request.auth.id != \"\" &&\n@request.body.to:length > 0 &&\n@request.body.from = @request.auth.id &&\n@request.body.from_label = @request.auth.label"
  }, collection)

  return app.save(collection)
})
