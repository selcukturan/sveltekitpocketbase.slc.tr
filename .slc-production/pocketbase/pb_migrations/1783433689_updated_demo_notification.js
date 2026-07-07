/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2580846381")

  // update collection data
  unmarshal({
    "listRule": "@request.auth.id != \"\" && (@request.auth.id ?= user.id || user:length = 0)"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2580846381")

  // update collection data
  unmarshal({
    "listRule": "// Giriş yapmış ise.\n// ve\n// `user ` ilişki dizisinin içindeki elemanlardan en az birinin ID'si giriş yapan kullanıcının ID'sine eşit ise.\n// ya da\n// bu bildirime hiçbir kullanıcı tanımlanmamış ise.(boş dizi)\n@request.auth.id != \"\" && (@request.auth.id ?= user.id || user:length = 0)"
  }, collection)

  return app.save(collection)
})
