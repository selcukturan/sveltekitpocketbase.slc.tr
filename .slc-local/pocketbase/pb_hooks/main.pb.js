/// <reference path="../pb_data/types.d.ts" />

onBootstrap((e) => {
    const utils = require(`${__hooks}/utils.js`);
    utils.hello("world - production 2222");
    console.log("App initialized! - production 2222");
    e.next();
});