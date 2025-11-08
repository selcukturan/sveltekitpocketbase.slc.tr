/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3040204514")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.id != \"\" && \n(\n  @request.auth.role ~ \":demo:%\" || \n  @request.auth.role ~ \":system:%\" || \n  @request.auth.role ~ \":developer:%\"\n)",
    "deleteRule": "@request.auth.id != \"\" && \n(\n  @request.auth.role ~ \":demo:%\" || \n  @request.auth.role ~ \":system:%\" || \n  @request.auth.role ~ \":developer:%\"\n)",
    "updateRule": "@request.auth.id != \"\" && \n(\n  @request.auth.role ~ \":demo:%\" || \n  @request.auth.role ~ \":system:%\" || \n  @request.auth.role ~ \":developer:%\"\n)"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3040204514")

  // update collection data
  unmarshal({
    "createRule": null,
    "deleteRule": null,
    "updateRule": null
  }, collection)

  return app.save(collection)
})
