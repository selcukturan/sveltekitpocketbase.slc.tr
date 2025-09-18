/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3040204514")

  // update collection data
  unmarshal({
    "listRule": "@request.auth.id != \"\" && \n(\n  @request.auth.role ~ \":demo:%\" || \n  @request.auth.role ~ \":system:%\"\n)",
    "viewRule": "@request.auth.id != \"\" && \n(\n  @request.auth.role ~ \":demo:%\" || \n  @request.auth.role ~ \":system:%\"\n)"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3040204514")

  // update collection data
  unmarshal({
    "listRule": null,
    "viewRule": null
  }, collection)

  return app.save(collection)
})
