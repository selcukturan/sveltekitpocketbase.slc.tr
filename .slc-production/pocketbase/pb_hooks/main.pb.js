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

// label → search_label (Türkçe arama: büyük/küçük harf ve aksan farkı olmadan). label ve search_label alanı olan tüm
// koleksiyonlarda; remote fonksiyonlardan da PocketBase panelinden de yapılan kayıtta. acl_permissions'ta label
// ilişkilerden üretilir (utils.applyLabels).
onRecordCreate((e) => {
	require(`${__hooks}/utils.js`).applyLabels(e.app, e.record);
	e.next();
});
onRecordUpdate((e) => {
	require(`${__hooks}/utils.js`).applyLabels(e.app, e.record);
	e.next();
});

// Gönderen etiketi her zaman sunucuda, `from` kaydından yazılır; istemcinin gönderdiği değer yok sayılır.
/* onRecordCreateRequest((e) => {
	const fromId = e.record.get('from');
	const sender = fromId ? e.app.findRecordById('sys_users', fromId) : null;
	e.record.set('from_label', sender ? sender.get('label') : '');
	e.next();
}, 'sys_notification'); */
