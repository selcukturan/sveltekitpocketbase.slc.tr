/// <reference path="../pb_data/types.d.ts" />
const recordsToCreate = [
	{
		id: 'p3nbdsy2ip7bijx',
		search_label: 'demo crud satir 1',
		label: 'Demo CRUD satır 1',
		text_required: 'text_required 1',
		text_optional: 'text_optional 1',
		file_optional_multiple: [],
		file_optional_single: '',
		select_optional_multiple: [],
		select_optional_single: '',
		relation_optional_multiple: [],
		relation_optional_single: ''
	}
];
migrate(
	(app) => {
		// migrate up
		let demo_crud = app.findCollectionByNameOrId('demo_crud');

		for (const data of recordsToCreate) {
			let record = new Record(demo_crud, data);
			app.save(record);
			console.log(`initial role created: [${data.label}]`);
		}
	},
	(app) => {
		// migrate down
		try {
			for (const data of recordsToCreate) {
				let record = app.findRecordById('demo_crud', data.id);
				app.delete(record);
				console.log(`initial role deleted: [${data.label}]`);
			}
		} catch {
			// sessiz hatalar (muhtemelen zaten silinmiştir)
		}
	}
);
