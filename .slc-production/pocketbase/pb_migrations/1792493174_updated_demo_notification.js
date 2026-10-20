/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2580846381")

  // update collection data
  unmarshal({
    "listRule": "@request.auth.id != \"\" &&\n(to:length = 0 || to.id ?= @request.auth.id) &&\nremove_by.id != @request.auth.id",
    "viewRule": "@request.auth.id != \"\" &&\n(to:length = 0 || to.id ?= @request.auth.id) &&\nremove_by.id != @request.auth.id"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2580846381")

  // update collection data
  unmarshal({
    "listRule": "@request.auth.id != \"\" && (@request.auth.id ?= to.id || to:length = 0)",
    "viewRule": "@request.auth.id != \"\" && (@request.auth.id ?= to.id || to:length = 0)"
  }, collection)

  return app.save(collection)
})
