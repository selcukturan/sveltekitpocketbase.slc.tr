/// <reference path="../pb_data/types.d.ts" />
const recordsToCreate = [
	{
		id: 'zcojn5spf0p81rx',
		search_label: 'javascript',
		label: 'Javascript'
	},
	{
		id: 'jucbf73jpaqx2px',
		search_label: 'css',
		label: 'Css'
	},
	{
		id: 'jk4tray3vzpk2mx',
		search_label: 'html',
		label: 'Html'
	}
];
migrate(
	(app) => {
		// migrate up
		let demo_relation_input_multiple = app.findCollectionByNameOrId('demo_relation_input_multiple');

		for (const data of recordsToCreate) {
			let record = new Record(demo_relation_input_multiple, data);
			app.save(record);
			console.log(`initial role created: [${data.label}]`);
		}
	},
	(app) => {
		// migrate down
		try {
			for (const data of recordsToCreate) {
				let record = app.findRecordById('demo_relation_input_multiple', data.id);
				app.delete(record);
				console.log(`initial role deleted: [${data.label}]`);
			}
		} catch {
			// sessiz hatalar (muhtemelen zaten silinmiştir)
		}
	}
);
