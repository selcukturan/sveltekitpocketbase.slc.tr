/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2580846381")

  // update collection data
  unmarshal({
    "createRule": "// Giriş yapmış kullanıcı yalnızca kendi adına gönderebilir: from ve from_label oturumdaki kullanıcıyla aynı olmalı.\n\n@request.auth.id != \"\" &&\n@request.body.from = @request.auth.id &&\n@request.body.from_label = @request.auth.label",
    "listRule": "// Giriş yapmış kullanıcı; kendisine gelen, herkese giden (to boş) veya kendi gönderdiği bildirimleri listeler.\n// Kullanıcının sildiği bildirimler kuralda değil, uygulama filtresinde (remove_by) elenir; aksi halde realtime silme olayı gelmez.\n\n@request.auth.id != \"\" &&\n(@request.auth.id ?= to.id || to:length = 0 || from = @request.auth.id)",
    "viewRule": "// List kuralıyla aynı olmalı; realtime abonelikleri de bu erişime göre çalışır.\n\n@request.auth.id != \"\" &&\n(@request.auth.id ?= to.id || to:length = 0 || from = @request.auth.id)"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2580846381")

  // update collection data
  unmarshal({
    "createRule": "// Giriş yapmış kullanıcı yalnızca kendi adına gönderebilir: from ve from_label oturumdaki kullanıcıyla aynı olmalı.\n@request.auth.id != \"\" &&\n@request.body.from = @request.auth.id &&\n@request.body.from_label = @request.auth.label",
    "listRule": "// Giriş yapmış kullanıcı; kendisine gelen, herkese giden (to boş) veya kendi gönderdiği bildirimleri listeler.\n// Kullanıcının sildiği bildirimler kuralda değil, uygulama filtresinde (remove_by) elenir; aksi halde realtime silme olayı gelmez.\n@request.auth.id != \"\" &&\n(@request.auth.id ?= to.id || to:length = 0 || from = @request.auth.id)",
    "viewRule": "// List kuralıyla aynı olmalı; realtime abonelikleri de bu erişime göre çalışır.\n@request.auth.id != \"\" &&\n(@request.auth.id ?= to.id || to:length = 0 || from = @request.auth.id)"
  }, collection)

  return app.save(collection)
})
