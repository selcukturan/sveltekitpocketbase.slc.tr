/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2580846381")

  // update collection data
  unmarshal({
    "listRule": "// Giriş yapmış kullanıcı; kendisine gelen, herkese giden (to boş) veya kendi gönderdiği bildirimleri listeler.\n// Kullanıcının sildiği bildirimler kuralda değil, uygulama filtresinde (remove_by) elenir; aksi halde realtime silme olayı gelmez.\n\n@request.auth.id != \"\" &&\n(@request.auth.id ?= to.id || to:length = 0 || from = @request.auth.id) &&\n@collection.acl_roles.id ?= @request.auth.role.id && \n@collection.acl_roles.status ?= \"active\" &&\n(\n  @collection.acl_roles.type ?= \"demo\" || \n  @collection.acl_roles.type ?= \"user\" || \n  @collection.acl_roles.type ?= \"superuser\" || \n  @collection.acl_roles.type ?= \"admin\" || \n  @collection.acl_roles.type ?= \"superadmin\" || \n  @collection.acl_roles.type ?= \"system\" || \n  @collection.acl_roles.type ?= \"developer\"\n)\n",
    "viewRule": "// Giriş yapmış kullanıcı; kendisine gelen, herkese giden (to boş) veya kendi gönderdiği bildirimleri listeler.\n// Kullanıcının sildiği bildirimler kuralda değil, uygulama filtresinde (remove_by) elenir; aksi halde realtime silme olayı gelmez.\n\n@request.auth.id != \"\" &&\n(@request.auth.id ?= to.id || to:length = 0 || from = @request.auth.id) &&\n@collection.acl_roles.id ?= @request.auth.role.id && \n@collection.acl_roles.status ?= \"active\" &&\n(\n  @collection.acl_roles.type ?= \"demo\" || \n  @collection.acl_roles.type ?= \"user\" || \n  @collection.acl_roles.type ?= \"superuser\" || \n  @collection.acl_roles.type ?= \"admin\" || \n  @collection.acl_roles.type ?= \"superadmin\" || \n  @collection.acl_roles.type ?= \"system\" || \n  @collection.acl_roles.type ?= \"developer\"\n)\n"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2580846381")

  // update collection data
  unmarshal({
    "listRule": "// Aktif rolü olan kullanıcı; kendisine gelen, herkese giden veya kendi gönderdiği bildirimleri görür.\n@request.auth.id != \"\" &&\n@request.auth.role.status ?= \"active\" &&\n(@request.auth.id ?= to.id || to:length = 0 || from = @request.auth.id)\n\n",
    "viewRule": "// Aktif rolü olan kullanıcı; kendisine gelen, herkese giden veya kendi gönderdiği bildirimleri görür.\n@request.auth.id != \"\" &&\n@request.auth.role.status ?= \"active\" &&\n(@request.auth.id ?= to.id || to:length = 0 || from = @request.auth.id)\n\n"
  }, collection)

  return app.save(collection)
})
