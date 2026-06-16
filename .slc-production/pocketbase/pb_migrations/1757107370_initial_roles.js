/// <reference path="../pb_data/types.d.ts" />
const recordsToCreate = [
  {
    id: "9z4rjbonfkhbocq",
    type: "demo",
    title: "demo 1",
    caption: "Demo 1",
    status: "active",
  },
  {
    id: "egyqpy647i5xghx",
    type: "user",
    title: "user 1",
    caption: "User 1",
    status: "active",
  },
  {
    id: "l6otw8tisu9esz8",
    type: "superuser",
    title: "super user 1",
    caption: "Super User 1",
    status: "active",
  },
  {
    id: "2lbuz6titbs3at2",
    type: "admin",
    title: "admin 1",
    caption: "Admin 1",
    status: "active",
  },
  {
    id: "pbssh1g4ag9pknq",
    type: "superadmin",
    title: "super admin 1",
    caption: "Super Admin 1",
    status: "active",
  },
  {
    id: "1qa3aufipnp8g9b",
    type: "system",
    title: "system 1",
    caption: "System 1",
    status: "active",
  },
  {
    id: "o74t5bpfdlav6zc",
    type: "developer",
    title: "developer 1",
    caption: "Developer 1",
    status: "active",
  }
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