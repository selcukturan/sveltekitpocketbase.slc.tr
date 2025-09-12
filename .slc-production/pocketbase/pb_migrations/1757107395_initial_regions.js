/// <reference path="../pb_data/types.d.ts" />
const recordsToCreate = [
  {
    "available_permissions": [
      ":authorized:"
    ],
    "caption": "İÇ EGE",
    "id": "pv118xfbqezgfye",
    "parent_id": "",
    "sorder": 1,
    "status": "active",
    "title": "ic ege",
    "type": "region:bolge"
  },
  {
    "available_permissions": [
      ":authorized:"
    ],
    "caption": "DENİZLİ",
    "id": "r5oocvacff0lqem",
    "parent_id": "pv118xfbqezgfye",
    "sorder": 2,
    "status": "active",
    "title": "denizli",
    "type": "province:il"
  },
  {
    "available_permissions": [
      ":authorized:"
    ],
    "caption": "ÇAL",
    "id": "86obe6e3g7q9zvp",
    "parent_id": "r5oocvacff0lqem",
    "sorder": 3,
    "status": "active",
    "title": "cal",
    "type": "district:ilce"
  },
  {
    "available_permissions": [
      ":authorized:"
    ],
    "caption": "HANÇALAR",
    "id": "km6exi99njp5ko2",
    "parent_id": "86obe6e3g7q9zvp",
    "sorder": 4,
    "status": "active",
    "title": "hancalar",
    "type": "village:koy"
  },
  {
    "available_permissions": [
      ":authorized:"
    ],
    "caption": "KIZILYER",
    "id": "w3wxbxjuj9mg864",
    "parent_id": "km6exi99njp5ko2",
    "sorder": 5,
    "status": "active",
    "title": "kizilyer",
    "type": "location:mevkii"
  }
];
migrate((app) => {
  // migrate up
  let app_regions = app.findCollectionByNameOrId("app_regions");

  for (const data of recordsToCreate) {
    let record = new Record(app_regions, data);
    app.save(record);
    console.log(`initial regions created: [${data.title}]`);
  }
}, (app) => {
  // migrate down
  try {
    for (const data of recordsToCreate) {
      let record = app.findRecordById("app_regions", data.id);
      app.delete(record);
      console.log(`initial regions deleted: [${data.title}]`);
    }
  } catch {
    // sessiz hatalar (muhtemelen zaten silinmiştir)
  }
});