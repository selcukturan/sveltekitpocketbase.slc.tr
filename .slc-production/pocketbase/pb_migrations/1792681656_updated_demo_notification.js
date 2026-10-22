/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2580846381")

  // update collection data
  unmarshal({
    "createRule": "// Kendi adına gönderir; herkese duyuru (to boş). admin ve üstü (order >= 3)\n@request.auth.id != \"\" &&\n@request.auth.role.status ?= \"active\" &&\n@request.body.from = @request.auth.id &&\n@request.body.from_label = @request.auth.label &&\n(@request.body.to:length > 0 || @request.auth.role.order ?>= 30)\n"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2580846381")

  // update collection data
  unmarshal({
    "createRule": "// Kendi adına gönderir; herkese duyuru (to boş). admin ve üstü (order >= 3)\n@request.auth.id != \"\" &&\n@request.auth.role.status ?= \"active\" &&\n@request.body.from = @request.auth.id &&\n@request.body.from_label = @request.auth.label &&\n(@request.body.to:length > 0 || @request.auth.role.order ?>= 3)\n"
  }, collection)

  return app.save(collection)
})
