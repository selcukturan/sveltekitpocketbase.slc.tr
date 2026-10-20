/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2580846381")

  // update collection data
  unmarshal({
    "updateRule": "@request.auth.id != \"\" &&\n(to:length = 0 || to.id ?= @request.auth.id) &&\nremove_by.id != @request.auth.id &&\n@request.body.title:changed = false &&\n@request.body.message:changed = false &&\n@request.body.to:changed = false"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2580846381")

  // update collection data
  unmarshal({
    "updateRule": "// Giriş yapmış kullanıcı kendi ID'sini ekliyor olmalı ve başlık/mesaj gibi alanları değiştirememeli\n@request.auth.id != \"\" && \n@request.body.read_by:isset = true && \n@request.body.title:isset = false && \n@request.body.message:isset = false"
  }, collection)

  return app.save(collection)
})
