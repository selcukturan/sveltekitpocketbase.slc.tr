/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2580846381")

  // update collection data
  unmarshal({
    "listRule": "// Giriş yapmış kullanıcı; kendisine gelen, herkese giden (to boş) veya kendi gönderdiği bildirimleri listeler.\n// Kullanıcının sildiği bildirimler kuralda değil, uygulama filtresinde (remove_by) elenir; aksi halde realtime silme olayı gelmez.\n\n@request.auth.id != \"\" &&\n(@request.auth.id ?= to.id || to:length = 0 || from = @request.auth.id) &&\n@collection.acl_roles.id ?= @request.auth.role.id && \n@collection.acl_roles.status ?= \"active\" &&\n(\n  @collection.acl_roles.type ?= \"demo\" || \n  @collection.acl_roles.type ?= \"user\" || \n  @collection.acl_roles.type ?= \"superuser\" || \n  @collection.acl_roles.type ?= \"admin\" || \n  @collection.acl_roles.type ?= \"superadmin\" || \n  @collection.acl_roles.type ?= \"system\" || \n  @collection.acl_roles.type ?= \"developer\"\n)\n",
    "updateRule": "// Bildirimi görebilen ve silmemiş kullanıcı yalnızca kişisel durumunu değiştirebilir (read_by, remove_by).\n// İçerik ve gönderen alanları kilitli. Koleksiyona yeni alan eklenirse buraya :changed = false satırı eklenmeli.\n\n@request.auth.id != \"\" &&\n(to:length = 0 || to.id ?= @request.auth.id || from = @request.auth.id) &&\nremove_by.id != @request.auth.id &&\n@request.body.title:changed = false &&\n@request.body.message:changed = false &&\n@request.body.to:changed = false &&\n@request.body.from:changed = false &&\n@request.body.from_label:changed = false &&\n@request.body.type:changed = false &&\n@collection.acl_roles.id ?= @request.auth.role.id && \n@collection.acl_roles.status ?= \"active\" &&\n(\n  @collection.acl_roles.type ?= \"demo\" || \n  @collection.acl_roles.type ?= \"user\" || \n  @collection.acl_roles.type ?= \"superuser\" || \n  @collection.acl_roles.type ?= \"admin\" || \n  @collection.acl_roles.type ?= \"superadmin\" || \n  @collection.acl_roles.type ?= \"system\" || \n  @collection.acl_roles.type ?= \"developer\"\n)\n",
    "viewRule": "// List kuralıyla aynı olmalı; realtime abonelikleri de bu erişime göre çalışır.\n\n@request.auth.id != \"\" &&\n(@request.auth.id ?= to.id || to:length = 0 || from = @request.auth.id) &&\n@collection.acl_roles.id ?= @request.auth.role.id && \n@collection.acl_roles.status ?= \"active\" &&\n(\n  @collection.acl_roles.type ?= \"demo\" || \n  @collection.acl_roles.type ?= \"user\" || \n  @collection.acl_roles.type ?= \"superuser\" || \n  @collection.acl_roles.type ?= \"admin\" || \n  @collection.acl_roles.type ?= \"superadmin\" || \n  @collection.acl_roles.type ?= \"system\" || \n  @collection.acl_roles.type ?= \"developer\"\n)\n"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2580846381")

  // update collection data
  unmarshal({
    "listRule": "// Giriş yapmış kullanıcı; kendisine gelen, herkese giden (to boş) veya kendi gönderdiği bildirimleri listeler.\n// Kullanıcının sildiği bildirimler kuralda değil, uygulama filtresinde (remove_by) elenir; aksi halde realtime silme olayı gelmez.\n\n@request.auth.id != \"\" &&\n(@request.auth.id ?= to.id || to:length = 0 || from = @request.auth.id)",
    "updateRule": "// Bildirimi görebilen ve silmemiş kullanıcı yalnızca kişisel durumunu değiştirebilir (read_by, remove_by).\n// İçerik ve gönderen alanları kilitli. Koleksiyona yeni alan eklenirse buraya :changed = false satırı eklenmeli.\n\n@request.auth.id != \"\" &&\n(to:length = 0 || to.id ?= @request.auth.id || from = @request.auth.id) &&\nremove_by.id != @request.auth.id &&\n@request.body.title:changed = false &&\n@request.body.message:changed = false &&\n@request.body.to:changed = false &&\n@request.body.from:changed = false &&\n@request.body.from_label:changed = false &&\n@request.body.type:changed = false\n",
    "viewRule": "// List kuralıyla aynı olmalı; realtime abonelikleri de bu erişime göre çalışır.\n\n@request.auth.id != \"\" &&\n(@request.auth.id ?= to.id || to:length = 0 || from = @request.auth.id)"
  }, collection)

  return app.save(collection)
})
