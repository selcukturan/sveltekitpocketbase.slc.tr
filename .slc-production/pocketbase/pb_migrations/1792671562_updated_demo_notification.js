/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2580846381")

  // update collection data
  unmarshal({
    "updateRule": "@request.auth.id != \"\" &&\n(to:length = 0 || to.id ?= @request.auth.id || from = @request.auth.id) &&\nremove_by.id != @request.auth.id &&\n@request.body.title:changed = false &&\n@request.body.message:changed = false &&\n@request.body.to:changed = false &&\n@request.body.from:changed = false &&\n@request.body.from_label:changed = false &&\n@request.body.type:changed = false"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2580846381")

  // update collection data
  unmarshal({
    "updateRule": "@request.auth.id != \"\" &&\n(to:length = 0 || to.id ?= @request.auth.id || from = @request.auth.id) &&\nremove_by.id != @request.auth.id &&\n@request.body.title:changed = false &&\n@request.body.message:changed = false &&\n@request.body.to:changed = false"
  }, collection)

  return app.save(collection)
})
