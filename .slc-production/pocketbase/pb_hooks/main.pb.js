/// <reference path="../../../.slc-local/pocketbase/pb_data/types.d.ts" />

onAfterBootstrap((e) => {
    const utils = require(`${__hooks}/utils.js`);

    utils.hello("world");
});