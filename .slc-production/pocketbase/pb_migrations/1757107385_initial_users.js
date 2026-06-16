/// <reference path="../pb_data/types.d.ts" />
const recordsToCreate = [
  {
    email: "demo@slc.tr",
    password: "SLc1234567",
    passwordConfirm: "SLc1234567",
    name:"Demo",
    role: [
        "9z4rjbonfkhbocq", // demo role id
        "egyqpy647i5xghx", // user role id
    ],
    verified: true,
    emailVisibility: true,
  }
];
migrate((app) => {
  // migrate up
  let sys_users = app.findCollectionByNameOrId("sys_users");

  for (const data of recordsToCreate) {
    let record = new Record(sys_users, data);
    app.save(record);
    console.log(`initial user created: [${data.email}]`);
  }
}, (app) => {
  // migrate down
  try {
    let record = app.findAuthRecordByEmail("sys_users", "demo@slc.tr");
    app.delete(record);
    console.log(`initial user deleted: [demo@slc.tr]`);
  } catch {
    // sessiz hatalar (muhtemelen zaten silinmiştir)
  }
});