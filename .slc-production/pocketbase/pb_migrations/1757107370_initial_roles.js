/// <reference path="../pb_data/types.d.ts" />
const recordsToCreate = [
  {
    id: ":superadmin:74f79357-4f28-4926-b5f3-adc8d982d1f3",
    type: "superadmin",
    title: "Super Admin 1",
    caption: "Super Admin 1",
    status: "active",
  },
  {
    id: ":system:1d2d988b-551d-404a-ae54-900491b0d36a",
    type: "system",
    title: "System 1",
    caption: "System 1",
    status: "active",
  },
  {
    id: ":demo:318fabb0-30c0-45c2-a8df-5ddf535f3207",
    type: "demo",
    title: "Demo 1",
    caption: "Demo 1",
    status: "active",
  },
  {
    id: ":admin:039b0952-9048-4c8c-8a68-8bc681e8f1aa",
    type: "admin",
    title: "Admin 1",
    caption: "Admin 1",
    status: "active",
  },
  {
    id: ":user:ad960bad-b126-4167-9f27-9974d676121c",
    type: "user",
    title: "User 1",
    caption: "User 1",
    status: "active",
  },
];
migrate((app) => {
  // migrate up
  let acl_roles = app.findCollectionByNameOrId("acl_roles");

  for (const data of recordsToCreate) {
    let record = new Record(acl_roles, data);
    app.save(record);
    console.log(`initial role created: [${data.title}]`);
  }
}, (app) => {
  // migrate down
  try {
    for (const data of recordsToCreate) {
      let record = app.findRecordById("acl_roles", data.id);
      app.delete(record);
      console.log(`initial role deleted: [${data.title}]`);
    }
  } catch {
    // sessiz hatalar (muhtemelen zaten silinmiştir)
  }
});