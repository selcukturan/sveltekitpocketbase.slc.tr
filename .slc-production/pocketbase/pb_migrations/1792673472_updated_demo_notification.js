/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2580846381")

  // update collection data
  unmarshal({
    "createRule": "// Giriş yapmış kullanıcı yalnızca kendi adına gönderebilir: from ve from_label oturumdaki kullanıcıyla aynı olmalı.\n\n@request.auth.id != \"\" &&\n@request.body.to:length > 0 &&\n@request.body.from = @request.auth.id &&\n@request.body.from_label = @request.auth.label"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2580846381")

  // update collection data
  unmarshal({
    "createRule": "// Giriş yapmış kullanıcı yalnızca kendi adına gönderebilir: from ve from_label oturumdaki kullanıcıyla aynı olmalı.\n\n@request.auth.id != \"\" &&\n@request.body.from = @request.auth.id &&\n@request.body.from_label = @request.auth.label"
  }, collection)

  return app.save(collection)
})
