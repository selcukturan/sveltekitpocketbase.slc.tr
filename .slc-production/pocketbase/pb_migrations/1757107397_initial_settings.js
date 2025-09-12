/// <reference path="../pb_data/types.d.ts" />
const recordsToCreate = [
  {
    "extra": null,
    "id": "2xkw6fu2uvmrq5r",
    "key": "system_access",
    "value": true
  }
];
migrate((app) => {
  // migrate up
  let sys_settings = app.findCollectionByNameOrId("sys_settings");

  for (const data of recordsToCreate) {
    let record = new Record(sys_settings, data);
    app.save(record);
    console.log(`initial settings created: [${data.key}]`);
  }
}, (app) => {
  // migrate down
  try {
    for (const data of recordsToCreate) {
      let record = app.findRecordById("sys_settings", data.id);
      app.delete(record);
      console.log(`initial settings deleted: [${data.key}]`);
    }
  } catch {
    // sessiz hatalar (muhtemelen zaten silinmiştir)
  }
});