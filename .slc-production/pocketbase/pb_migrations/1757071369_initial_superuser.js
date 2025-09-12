/// <reference path="../pb_data/types.d.ts" />
const recordsToCreate = [
  {
    email: "demoadmin@slc.tr",
    password: "SLc12345678"
  }
];
migrate((app) => {
  // migrate up
  let superusers = app.findCollectionByNameOrId("_superusers");

  for (const data of recordsToCreate) {
    let record = new Record(superusers, data);
    app.save(record);
    console.log(`initial superuser created: [${data.email}]`);
  }
}, (app) => {
  // migrate down
  try {
    let record = app.findAuthRecordByEmail("_superusers", "demoadmin@slc.tr");
    app.delete(record);
    console.log(`initial superuser deleted: [demoadmin@slc.tr]`);
  } catch {
    // sessiz hatalar (muhtemelen zaten silinmiştir)
  }
});