/// <reference path="../pb_data/types.d.ts" />
const recordsToCreate = [
  {
    "id": "0b2szt0ki3tdxtr",
    "kg": 1000,
    "kn": 0,
    "kt": "",
    "note": "",
    "producer": "Producer 12",
    "region": "Region 12",
  },
  {
    "id": "3yh3yally18tgw3",
    "kg": 100,
    "kn": 8888,
    "kt": "",
    "note": "",
    "producer": "Producer 1",
    "region": "Region 1",
  },
  {
    "id": "5ea2vb17zea6zfx",
    "kg": 100,
    "kn": 8888,
    "kt": "",
    "note": "",
    "producer": "Producer 1",
    "region": "Region 1",
  },
  {
    "id": "70dueyn65vrchnr",
    "kg": 1000,
    "kn": 55,
    "kt": "2025-09-16 12:00:00.000Z",
    "note": "",
    "producer": "Producer 1",
    "region": "Region 1",
  },
  {
    "id": "7l1lvvg23v8otcn",
    "kg": 1000,
    "kn": 66,
    "kt": "2025-09-16 12:00:00.000Z",
    "note": "",
    "producer": "Producer 8",
    "region": "Region 3",
  },
  {
    "id": "7v3e4myl5ljyuj7",
    "kg": 1000,
    "kn": 111,
    "kt": "",
    "note": "",
    "producer": "Producer 13",
    "region": "Region 13",
  },
  {
    "id": "d9yc387jrbm5ngm",
    "kg": 1000,
    "kn": 12,
    "kt": "2025-09-12 12:00:00.000Z",
    "note": "",
    "producer": "Producer 4",
    "region": "Region 4",
  },
  {
    "id": "hleahqvtpsbe5yu",
    "kg": 1000,
    "kn": 13,
    "kt": "2025-09-16 12:00:00.000Z",
    "note": "",
    "producer": "Producer 3",
    "region": "Region 3",
  },
  {
    "id": "i65q4as08sh3js8",
    "kg": 1000,
    "kn": 12,
    "kt": "2025-09-12 12:00:00.000Z",
    "note": "",
    "producer": "Producer 6",
    "region": "Region 1",
  },
  {
    "id": "l0qdl8ho8w63u44",
    "kg": 1000,
    "kn": 11,
    "kt": "2025-09-12 12:00:00.000Z",
    "note": "",
    "producer": "Producer 5",
    "region": "Region 5",
  },
  {
    "id": "mc7q1q8jokmfmf9",
    "kg": 1111,
    "kn": 0,
    "kt": "",
    "note": "",
    "producer": "Producer 13",
    "region": "Region 13",
  },
  {
    "id": "peeithz2ri1pt34",
    "kg": 1000,
    "kn": 55,
    "kt": "2025-09-16 12:00:00.000Z",
    "note": "",
    "producer": "Producer 10",
    "region": "Region 5",
  },
  {
    "id": "pjd1j1wwerbcpq0",
    "kg": 100,
    "kn": 1888,
    "kt": "",
    "note": "",
    "producer": "Producer 1",
    "region": "Region 1",
  },
  {
    "id": "s6waji9w6z3o7ym",
    "kg": 1000,
    "kn": 111,
    "kt": "",
    "note": "",
    "producer": "Producer 12",
    "region": "Region 12",
  },
  {
    "id": "smb2x7700ht5sb9",
    "kg": 1000,
    "kn": 11,
    "kt": "2025-09-12 12:00:00.000Z",
    "note": "",
    "producer": "Producer 7",
    "region": "Region 2",
  },
  {
    "id": "vube4ymgw4yq7iw",
    "kg": 1000,
    "kn": 13,
    "kt": "2025-09-16 12:00:00.000Z",
    "note": "",
    "producer": "Producer 9",
    "region": "Region 4",
  },
  {
    "id": "vx5bylfmthiquda",
    "kg": 1000,
    "kn": 0,
    "kt": "",
    "note": "",
    "producer": "Producer 11",
    "region": "Region 11",
  },
  {
    "id": "xi3b5vgnskp1mfl",
    "kg": 1000,
    "kn": 66,
    "kt": "2025-09-16 12:00:00.000Z",
    "note": "",
    "producer": "Producer 2",
    "region": "Region 2",
  },
  {
    "id": "yh2zhonugrdxz87",
    "kg": 8000,
    "kn": 0,
    "kt": "",
    "note": "",
    "producer": "Producer 11",
    "region": "Region 11",
  },
  {
    "id": "zit9drsyqs5jg9m",
    "kg": 100,
    "kn": 1888,
    "kt": "",
    "note": "",
    "producer": "Producer 1",
    "region": "Region 1",
  }
];
migrate((app) => {
  // migrate up
  let test_subtotal = app.findCollectionByNameOrId("test_subtotal");

  for (const data of recordsToCreate) {
    let record = new Record(test_subtotal, data);
    app.save(record);
    console.log(`initial test_subtotal created: [${data.title}]`);
  }
}, (app) => {
  // migrate down
  try {
    for (const data of recordsToCreate) {
      let record = app.findRecordById("test_subtotal", data.id);
      app.delete(record);
      console.log(`initial test_subtotal deleted: [${data.title}]`);
    }
  } catch {
    // sessiz hatalar (muhtemelen zaten silinmiştir)
  }
});