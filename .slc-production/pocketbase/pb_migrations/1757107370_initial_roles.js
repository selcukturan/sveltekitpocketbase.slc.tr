/// <reference path="../pb_data/types.d.ts" />
const recordsToCreate = [
	{
		id: '9z4rjbonfkhbocq',
		type: 'demo',
		search_label: 'demo 1',
		label: 'Demo 1',
		order: 0,
		status: 'active'
	},
	{
		id: 'egyqpy647i5xghx',
		type: 'user',
		search_label: 'user 1',
		label: 'User 1',
		order: 1,
		status: 'active'
	},
	{
		id: 'l6otw8tisu9esz8',
		type: 'superuser',
		search_label: 'super user 1',
		label: 'Super User 1',
		order: 2,
		status: 'active'
	},
	{
		id: '2lbuz6titbs3at2',
		type: 'admin',
		search_label: 'admin 1',
		label: 'Admin 1',
		order: 3,
		status: 'active'
	},
	{
		id: 'pbssh1g4ag9pknq',
		type: 'superadmin',
		search_label: 'super admin 1',
		label: 'Super Admin 1',
		order: 4,
		status: 'active'
	},
	{
		id: '1qa3aufipnp8g9b',
		type: 'system',
		search_label: 'system 1',
		label: 'System 1',
		order: 5,
		status: 'active'
	},
	{
		id: 'o74t5bpfdlav6zc',
		type: 'developer',
		search_label: 'developer 1',
		label: 'Developer 1',
		order: 6,
		status: 'active'
	}
];
migrate(
	(app) => {
		// migrate up
		let acl_roles = app.findCollectionByNameOrId('acl_roles');

		for (const data of recordsToCreate) {
			let record = new Record(acl_roles, data);
			app.save(record);
			console.log(`initial role created: [${data.label}]`);
		}
	},
	(app) => {
		// migrate down
		try {
			for (const data of recordsToCreate) {
				let record = app.findRecordById('acl_roles', data.id);
				app.delete(record);
				console.log(`initial role deleted: [${data.label}]`);
			}
		} catch {
			// sessiz hatalar (muhtemelen zaten silinmiştir)
		}
	}
);
