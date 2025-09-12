/// <reference path="../pb_data/types.d.ts" />
const recordsToCreate = [
  {
    email: "demo@slc.tr",
    password: "SLc1234567",
    passwordConfirm: "SLc1234567",
    role: ":demo:318fabb0-30c0-45c2-a8df-5ddf535f3207", // RELATION_RECORD_ID
    verified: true,
    emailVisibility: true,
    default_company: "6olubwtwsvtstap", // RELATION_RECORD_ID
    default_company_storage: "n3tskk8ax3m4g1j", // RELATION_RECORD_ID
    default_company_year: "at2pfbnsptdwn4b" // RELATION_RECORD_ID
  }
];
migrate((app) => {
  // migrate up
  let sys_users = app.findCollectionByNameOrId("sys_users");

  for (const data of recordsToCreate) {
    let record = new Record(sys_users, data);
    app.save(record);
    // logger.info(`Record with email ${data.email} created.`);
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