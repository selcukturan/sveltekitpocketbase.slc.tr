/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3040204514")

  // update collection data
  unmarshal({
    "updateRule": null
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3040204514")

  // update collection data
  unmarshal({
    "updateRule": "@request.auth.id != \"\" && \n(\n  @request.auth.role ~ \":demo:%\" || \n  @request.auth.role ~ \":system:%\" || \n  @request.auth.role ~ \":developer:%\"\n)"
  }, collection)

  return app.save(collection)
})
