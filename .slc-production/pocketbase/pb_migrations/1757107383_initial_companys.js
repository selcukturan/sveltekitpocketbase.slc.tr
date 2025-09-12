/// <reference path="../pb_data/types.d.ts" />
const recordsToCreate = [
  {
    id: "6olubwtwsvtstap",
    parent_id: "", // company 1
    type: "company",
    sorder: 1,
    value: 1000,
    title: "company 1",
    caption: "Company 1",
    available_permissions: [":authorized:"],
    status: "active",
    note: "",
    processable: true,
  },
  {
    id: "0o9zqg8vfzvr4dk",
    parent_id: "", // company 2
    type: "company",
    sorder: 6,
    value: 1010,
    title: "company 2",
    caption: "Company 2",
    available_permissions: [":authorized:"],
    status: "active",
    note: "",
    processable: true,
  },
  {
    id: "rd9cqls9vvmimvd",
    parent_id: "0o9zqg8vfzvr4dk",
    type: "year",
    sorder: 10,
    value: 2025,
    title: "company 2 - year 2025",
    caption: "Year 2025",
    available_permissions: [":authorized:"],
    status: "active",
    note: "",
    processable: true,
  },
  {
    id: "xd79fw3o272aols",
    parent_id: "0o9zqg8vfzvr4dk",
    type: "year",
    sorder: 9,
    value: 2024,
    title: "company 2 - year 2024",
    caption: "Year 2024",
    available_permissions: [":authorized:"],
    status: "active",
    note: "",
    processable: true,

  },
  {
    id: "yv8b5q3smk8olf8",
    parent_id: "0o9zqg8vfzvr4dk",
    type: "storage",
    sorder: 8,
    value: 1012,
    title: "company 2 - storage 1",
    caption: "Storage 1",
    available_permissions: [":authorized:"],
    status: "active",
    note: "",
    processable: true,
  },
  {
    id: "6a8knwq7xmywkj0",
    parent_id: "0o9zqg8vfzvr4dk",
    type: "storage",
    sorder: 7,
    value: 1011,
    title: "company 2 - storage 1",
    caption: "Storage 1",
    available_permissions: [":authorized:"],
    status: "active",
    note: "",
    processable: true,
  },
  {
    id: "8uvfrxbzmey2ser",
    parent_id: "6olubwtwsvtstap",
    type: "year",
    sorder: 5,
    value: 2025,
    title: "company 1 - year 2025",
    caption: "Year 2025",
    available_permissions: [":authorized:"],
    status: "active",
    note: "",
    processable: true,
  },
  {
    id: "at2pfbnsptdwn4b",
    parent_id: "6olubwtwsvtstap",
    type: "year",
    sorder: 4,
    value: 2024,
    title: "company 1 - year 2024",
    caption: "Year 2024",
    available_permissions: [":authorized:"],
    status: "active",
    note: "",
    processable: true,
  },
  {
    id: "g9snlbd46lghdmd",
    parent_id: "6olubwtwsvtstap",
    type: "storage",
    sorder: 3,
    value: 1002,
    title: "company 1 - storage 2",
    caption: "Storage 2",
    available_permissions: [":authorized:"],
    status: "active",
    note: "",
    processable: true,
  },
  {
    id: "n3tskk8ax3m4g1j",
    parent_id: "6olubwtwsvtstap",
    type: "storage",
    sorder: 2,
    value: 1001,
    title: "company 1 - storage 1",
    caption: "Storage 1",
    available_permissions: [":authorized:"],
    status: "active",
    note: "",
    processable: true,
  }
];
migrate((app) => {
  // migrate up
  let sys_companys = app.findCollectionByNameOrId("sys_companys");

  for (const data of recordsToCreate) {
    let record = new Record(sys_companys, data);
    app.save(record);
    console.log(`initial company created: [${data.title}]`);
  }
}, (app) => {
  // migrate down
  try {
    for (const data of recordsToCreate) {
      let record = app.findRecordById("sys_companys", data.id);
      app.delete(record);
      console.log(`initial company deleted: [${data.title}]`);
    }
  } catch {
    // sessiz hatalar (muhtemelen zaten silinmiştir)
  }
});