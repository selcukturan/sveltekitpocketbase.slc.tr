/// <reference path="../pb_data/types.d.ts" />

onBootstrap((e) => {
    const utils = require(`${__hooks}/utils.js`);
    utils.hello("world - production");
    console.log("App initialized! - production");
    e.next();
});