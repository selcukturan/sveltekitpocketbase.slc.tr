/// <reference path="../pb_data/types.d.ts" />
onBootstrap((e) => {
	const utils = require(`${__hooks}/utils.js`);
	utils.hello('world.');
	console.log('App initialized!');

	// 🔼 - veritabanına erişim sağlanamaz.
	e.next();
	// 🔽 - veritabanına erişim sağlanabilir.

	// e.app
});

// Gönderen etiketi her zaman sunucuda, `from` kaydından yazılır; istemcinin gönderdiği değer yok sayılır.
/* onRecordCreateRequest((e) => {
	const fromId = e.record.get('from');
	const sender = fromId ? e.app.findRecordById('sys_users', fromId) : null;
	e.record.set('from_label', sender ? sender.get('label') : '');
	e.next();
}, 'demo_notification'); */
