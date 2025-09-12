/// <reference path="../pb_data/types.d.ts" />
onBootstrap((e) => {
    const utils = require(`${__hooks}/utils.js`);
    utils.hello("world.");
    console.log("App initialized!");

    // 🔼 - veritabanına erişim sağlanamaz.
    e.next();
    // 🔽 - veritabanına erişim sağlanabilir.

    // e.app
});