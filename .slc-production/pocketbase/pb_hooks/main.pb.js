

// attach global middleware
routerUse((e) => {
    console.log(1);
    return e.next();
});

// attach global middleware with a custom priority
routerUse(new Middleware((e) => {
    console.log(2);
    return e.next();
}, -1));

// attach middleware to a single route
//
// "GET /hello" should print the sequence: 2,1,3,4
routerUse("GET", "/hello", (e) => {
    console.log(4);
    return e.string(200, "Hello! - production");
}, (e) => {
    console.log(3);
    return e.next();
});

onBootstrap((e) => {
    const utils = require(`${__hooks}/utils.js`);
    utils.hello("world - production");
    console.log("App initialized! - production");
    e.next();
});

onRecordsListRequest((e) => {
    // e.app
    // e.collection
    // e.records
    // e.result
    // and all RequestEvent fields...
    console.log("onRecordsListRequest - 1 - production");
    e.next();
}, "acl_roles_perms");