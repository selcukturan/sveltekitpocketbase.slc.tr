/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2580846381")

  // update collection data
  unmarshal({
    "createRule": "// Kendi adına gönderir; herkese duyuru (to boş). admin ve üstü (order >= 3)\n@request.auth.id != \"\" &&\n@request.auth.role.status ?= \"active\" &&\n@request.body.from = @request.auth.id &&\n@request.body.from_label = @request.auth.label &&\n(@request.body.to:length > 0 || @request.auth.role.order ?>= 3)\n",
    "updateRule": "// Yalnızca read_by/remove_by değişebilir; yeni alanları da buraya kilitle.\n@request.auth.id != \"\" &&\n@request.auth.role.status ?= \"active\" &&\n(to:length = 0 || to.id ?= @request.auth.id || from = @request.auth.id) &&\nremove_by.id != @request.auth.id &&\n@request.body.title:changed = false &&\n@request.body.message:changed = false &&\n@request.body.to:changed = false &&\n@request.body.from:changed = false &&\n@request.body.from_label:changed = false &&\n@request.body.type:changed = false\n\n"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2580846381")

  // update collection data
  unmarshal({
    "createRule": "// Aktif rolü olan kullanıcı kendi adına gönderir; herkese duyuru (to boş) yalnızca admin ve üstü.\n\n@request.auth.id != \"\" &&\n@request.body.from = @request.auth.id &&\n@request.body.from_label = @request.auth.label &&\n@collection.acl_roles.id ?= @request.auth.role.id &&\n@collection.acl_roles.status ?= \"active\" &&\n(\n  @request.body.to:length > 0 ||\n  @collection.acl_roles.type ?= \"admin\" ||\n  @collection.acl_roles.type ?= \"superadmin\" ||\n  @collection.acl_roles.type ?= \"system\" ||\n  @collection.acl_roles.type ?= \"developer\"\n)",
    "updateRule": "// Bildirimi görebilen ve silmemiş kullanıcı yalnızca kişisel durumunu değiştirebilir (read_by, remove_by).\n// İçerik ve gönderen alanları kilitli. Koleksiyona yeni alan eklenirse buraya :changed = false satırı eklenmeli.\n\n@request.auth.id != \"\" &&\n(to:length = 0 || to.id ?= @request.auth.id || from = @request.auth.id) &&\nremove_by.id != @request.auth.id &&\n@request.body.title:changed = false &&\n@request.body.message:changed = false &&\n@request.body.to:changed = false &&\n@request.body.from:changed = false &&\n@request.body.from_label:changed = false &&\n@request.body.type:changed = false &&\n@collection.acl_roles.id ?= @request.auth.role.id && \n@collection.acl_roles.status ?= \"active\" &&\n(\n  @collection.acl_roles.type ?= \"demo\" || \n  @collection.acl_roles.type ?= \"user\" || \n  @collection.acl_roles.type ?= \"superuser\" || \n  @collection.acl_roles.type ?= \"admin\" || \n  @collection.acl_roles.type ?= \"superadmin\" || \n  @collection.acl_roles.type ?= \"system\" || \n  @collection.acl_roles.type ?= \"developer\"\n)\n"
  }, collection)

  return app.save(collection)
})
