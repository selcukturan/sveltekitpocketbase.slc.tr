/// <reference path="../pb_data/types.d.ts" />
const recordsToCreate = [
  {
    "caption": "Home",
    "id": "3s1h5cy547wvmsw",
    "parent_id": "",
    "sorder": 1,
    "status": "active",
    "sys_menu_item": "mimqpuupd9ckyl3",
    "title": "home"
  },
  {
    "caption": "Grapes",
    "id": "ojy7ulx1qz0p9bq",
    "parent_id": "",
    "sorder": 2,
    "status": "active",
    "sys_menu_item": "8uz7uvurh3n8ck3",
    "title": "grapes"
  },
  {
    "caption": "Data Table",
    "id": "vcqt6q11lerj3ap",
    "parent_id": "",
    "sorder": 8,
    "status": "active",
    "sys_menu_item": "sses3g9mfyuod2t",
    "title": "data table"
  },
  {
    "caption": "Logs",
    "id": "pz61a0fwb689feu",
    "parent_id": "",
    "sorder": 14,
    "status": "active",
    "sys_menu_item": "qno3ai1iz0c1jlh",
    "title": "logs"
  },
  {
    "caption": "Developments",
    "id": "64j9hes6surp5kx",
    "parent_id": "",
    "sorder": 15,
    "status": "active",
    "sys_menu_item": "nu0g6r6661s0u5l",
    "title": "developments"
  },
  {
    "caption": "settings",
    "id": "qqmtn5y2qh3zbea",
    "parent_id": "",
    "sorder": 31,
    "status": "active",
    "sys_menu_item": "fe14svzpm032yiv",
    "title": "settings"
  },
  {
    "caption": "Grapes Caption",
    "id": "3lhmiqsj605m83j",
    "parent_id": "ojy7ulx1qz0p9bq",
    "sorder": 3,
    "status": "active",
    "sys_menu_item": "hx2nfzozk808hex",
    "title": "grapes caption"
  },
  {
    "caption": "Grapes Introduction",
    "id": "54zs2enxv52uai9",
    "parent_id": "3lhmiqsj605m83j",
    "sorder": 4,
    "status": "active",
    "sys_menu_item": "8uz7uvurh3n8ck3",
    "title": "grapes introduction"
  },
  {
    "caption": "Crud Caption",
    "id": "zvrgbttdl8yg973",
    "parent_id": "ojy7ulx1qz0p9bq",
    "sorder": 5,
    "status": "active",
    "sys_menu_item": "hx2nfzozk808hex",
    "title": "crud caption"
  },
  {
    "caption": "Crud Introduction",
    "id": "ujoaehbsvwbmi7o",
    "parent_id": "zvrgbttdl8yg973",
    "sorder": 6,
    "status": "active",
    "sys_menu_item": "sp4lnuykykv8m1i",
    "title": "crud introduction"
  },
  {
    "caption": "create-read-update-delete",
    "id": "2bmk2nta52zxj1e",
    "parent_id": "zvrgbttdl8yg973",
    "sorder": 7,
    "status": "active",
    "sys_menu_item": "io13s67o156y6kn",
    "title": "create-read-update-delete"
  },
  {
    "caption": "Data Table Caption",
    "id": "kba09g42nxke9h5",
    "parent_id": "vcqt6q11lerj3ap",
    "sorder": 9,
    "status": "active",
    "sys_menu_item": "hx2nfzozk808hex",
    "title": "data table caption"
  },
  {
    "caption": "Data Table Introduction",
    "id": "3bez06cb4i5pe77",
    "parent_id": "kba09g42nxke9h5",
    "sorder": 10,
    "status": "active",
    "sys_menu_item": "sses3g9mfyuod2t",
    "title": "data table introduction"
  },
  {
    "caption": "Demos Caption",
    "id": "smhsd2z8hk7cl37",
    "parent_id": "vcqt6q11lerj3ap",
    "sorder": 11,
    "status": "active",
    "sys_menu_item": "hx2nfzozk808hex",
    "title": "demos caption"
  },
  {
    "caption": "Demos Introduction",
    "id": "3ks7qj6cdzcdgtu",
    "parent_id": "smhsd2z8hk7cl37",
    "sorder": 12,
    "status": "active",
    "sys_menu_item": "3qg3jtb8luaofgi",
    "title": "demos introduction"
  },
  {
    "caption": "Common Features",
    "id": "hl869hn46xorc0n",
    "parent_id": "smhsd2z8hk7cl37",
    "sorder": 13,
    "status": "active",
    "sys_menu_item": "gwbkmqcxx7u0cok",
    "title": "common features"
  },
  {
    "caption": "Developments Caption",
    "id": "ckugch9msrw9wwe",
    "parent_id": "64j9hes6surp5kx",
    "sorder": 16,
    "status": "active",
    "sys_menu_item": "hx2nfzozk808hex",
    "title": "developments caption"
  },
  {
    "caption": "Developments Introduction",
    "id": "6ppxe2pqjoj05t4",
    "parent_id": "ckugch9msrw9wwe",
    "sorder": 17,
    "status": "active",
    "sys_menu_item": "nu0g6r6661s0u5l",
    "title": "developments introduction"
  },
  {
    "caption": "Components Caption",
    "id": "neq703on5wjd4jx",
    "parent_id": "64j9hes6surp5kx",
    "sorder": 18,
    "status": "active",
    "sys_menu_item": "hx2nfzozk808hex",
    "title": "components caption"
  },
  {
    "caption": "Components Introduction",
    "id": "em1eh4853ljjtgr",
    "parent_id": "neq703on5wjd4jx",
    "sorder": 19,
    "status": "active",
    "sys_menu_item": "jk4th2er404gcsg",
    "title": "components introduction"
  },
  {
    "caption": "form validation with superforms",
    "id": "ellgpbtp0j9vrn5",
    "parent_id": "neq703on5wjd4jx",
    "sorder": 20,
    "status": "active",
    "sys_menu_item": "0kz20qeq1r0dq2m",
    "title": "form validation with superforms"
  },
  {
    "caption": "form validation with slc",
    "id": "w4fb3bkjentm3ct",
    "parent_id": "neq703on5wjd4jx",
    "sorder": 21,
    "status": "active",
    "sys_menu_item": "g8qundq5h219mvc",
    "title": "form validation with slc"
  },
  {
    "caption": "tooltip",
    "id": "pm1il0fq9xh80pe",
    "parent_id": "neq703on5wjd4jx",
    "sorder": 22,
    "status": "active",
    "sys_menu_item": "cw675y5m980ebbt",
    "title": "tooltip"
  },
  {
    "caption": "toast",
    "id": "f9ixkmz2a3e3ao7",
    "parent_id": "neq703on5wjd4jx",
    "sorder": 23,
    "status": "active",
    "sys_menu_item": "e23r1h54dv3czbg",
    "title": "toast"
  },
  {
    "caption": "confirmation",
    "id": "567r4jogt39p7v4",
    "parent_id": "neq703on5wjd4jx",
    "sorder": 24,
    "status": "active",
    "sys_menu_item": "wyvn2z0c4kwzqhl",
    "title": "confirmation"
  },
  {
    "caption": "drawer panel",
    "id": "sc185vifkzdyyw6",
    "parent_id": "neq703on5wjd4jx",
    "sorder": 25,
    "status": "active",
    "sys_menu_item": "ee4vbma69o7jqnz",
    "title": "drawer panel"
  },
  {
    "caption": "select",
    "id": "d7sktrfic147hcd",
    "parent_id": "neq703on5wjd4jx",
    "sorder": 26,
    "status": "active",
    "sys_menu_item": "g27pz6xkpqri1aj",
    "title": "select"
  },
  {
    "caption": "remote-functions",
    "id": "lu0a2reyqt8rqm7",
    "parent_id": "neq703on5wjd4jx",
    "sorder": 27,
    "status": "active",
    "sys_menu_item": "hsda0ejvx8zo0dz",
    "title": "remote-functions"
  },
  {
    "caption": "link-routing",
    "id": "krptx5czldbaisl",
    "parent_id": "neq703on5wjd4jx",
    "sorder": 28,
    "status": "active",
    "sys_menu_item": "wygleg2ueitpcft",
    "title": "link-routing"
  },
  {
    "caption": "empty",
    "id": "43pjgrk4wohc4hu",
    "parent_id": "neq703on5wjd4jx",
    "sorder": 29,
    "status": "active",
    "sys_menu_item": "t6nwr02ao9yjwpr",
    "title": "ÖĞRENCİ IŞIKLARI"
  },
  {
    "caption": "tree",
    "id": "p03txbemylowmlv",
    "parent_id": "neq703on5wjd4jx",
    "sorder": 30,
    "status": "active",
    "sys_menu_item": "a6rj2ql470lg9bp",
    "title": "tree"
  },
  {
    "caption": "Settings caption",
    "id": "p3yx84tvnyyb0yl",
    "parent_id": "qqmtn5y2qh3zbea",
    "sorder": 32,
    "status": "active",
    "sys_menu_item": "hx2nfzozk808hex",
    "title": "settings caption"
  },
  {
    "caption": "Settings Introduction",
    "id": "pzdjwjw8jsp60pw",
    "parent_id": "p3yx84tvnyyb0yl",
    "sorder": 33,
    "status": "active",
    "sys_menu_item": "fe14svzpm032yiv",
    "title": "settings introduction"
  },
  {
    "caption": "System",
    "id": "uuhuvfuirmlxyg8",
    "parent_id": "qqmtn5y2qh3zbea",
    "sorder": 34,
    "status": "active",
    "sys_menu_item": "hx2nfzozk808hex",
    "title": "system caption"
  },
  {
    "caption": "system",
    "id": "mom51vvad45129e",
    "parent_id": "uuhuvfuirmlxyg8",
    "sorder": 35,
    "status": "active",
    "sys_menu_item": "ofesxa4vkjltr37",
    "title": "system"
  },
  {
    "caption": "application",
    "id": "v5mi1csejcv2s0o",
    "parent_id": "uuhuvfuirmlxyg8",
    "sorder": 36,
    "status": "active",
    "sys_menu_item": "8h12a9lzw8hvvw1",
    "title": "application"
  }
];
migrate((app) => {
  // migrate up
  let sys_menus = app.findCollectionByNameOrId("sys_menus");

  for (const data of recordsToCreate) {
    let record = new Record(sys_menus, data);
    app.save(record);
    console.log(`initial menus created: [${data.title}]`);
  }
}, (app) => {
  // migrate down
  try {
    for (const data of recordsToCreate) {
      let record = app.findRecordById("sys_menus", data.id);
      app.delete(record);
      console.log(`initial menus deleted: [${data.title}]`);
    }
  } catch {
    // sessiz hatalar (muhtemelen zaten silinmiştir)
  }
});