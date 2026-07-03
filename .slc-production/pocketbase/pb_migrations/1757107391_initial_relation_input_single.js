/// <reference path="../pb_data/types.d.ts" />
const recordsToCreate = [
	{
		id: 'baoyv3vhmf616gw',
		search_label: 'linux',
		label: 'Linux'
	},
	{
		id: '8aa2mun2al6jb1i',
		search_label: 'windows',
		label: 'Windows'
	},
	{
		id: 'cq1gn5si46ouenc',
		search_label: 'mac',
		label: 'Mac'
	}
];
migrate(
	(app) => {
		// migrate up
		let demo_relation_input_single = app.findCollectionByNameOrId('demo_relation_input_single');

		for (const data of recordsToCreate) {
			let record = new Record(demo_relation_input_single, data);
			app.save(record);
			console.log(`initial role created: [${data.label}]`);
		}
	},
	(app) => {
		// migrate down
		try {
			for (const data of recordsToCreate) {
				let record = app.findRecordById('demo_relation_input_single', data.id);
				app.delete(record);
				console.log(`initial role deleted: [${data.label}]`);
			}
		} catch {
			// sessiz hatalar (muhtemelen zaten silinmiştir)
		}
	}
);
