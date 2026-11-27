/// <reference path="../pb_data/types.d.ts" />
/**
 * Remote fonksiyonlar işlem izni (list, create, update…) denetlemeye başladığında bugünkü davranış bozulmasın: her aktif
 * kaynağın tanımlı her işlemi için Herkes → allow (erişim satırları 1795740002'de vardı). Yetkiler daraltılmak
 * istendiğinde bu satırlar silinir ya da rollere taşınır.
 */
const normalize = (value) =>
	String(value ?? '')
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.toLowerCase()
		.replace(/ı/g, 'i');

migrate(
	(app) => {
		const permissionsCol = app.findCollectionByNameOrId('acl_permissions');
		const access = app.findFirstRecordByData('acl_actions', 'key', 'access');
		const actions = {};
		for (const a of app.findAllRecords('acl_actions')) actions[a.id] = a;

		for (const resource of app.findAllRecords('acl_resources')) {
			for (const actionId of resource.get('actions')) {
				if (actionId === access.id || !actions[actionId]) continue;
				const existing = app.findAllRecords(
					'acl_permissions',
					$dbx.hashExp({ resource: resource.id, action: actionId, role: '', user: '' })
				);
				if (existing.length > 0) continue;
				const label = `Herkes · ${resource.get('label')} · ${actions[actionId].get('label')}`;
				app.save(
					new Record(permissionsCol, {
						resource: resource.id,
						action: actionId,
						role: '',
						user: '',
						effect: 'allow',
						label,
						search_label: normalize(label)
					})
				);
			}
		}
	},
	(app) => {
		// Geri alma: Herkes'in erişim dışındaki tüm satırları (sonradan elle eklenenler dahil)
		const access = app.findFirstRecordByData('acl_actions', 'key', 'access');
		const rows = app.findAllRecords('acl_permissions', $dbx.hashExp({ role: '', user: '' }), $dbx.not($dbx.hashExp({ action: access.id })));
		for (const row of rows) app.delete(row);
	}
);
