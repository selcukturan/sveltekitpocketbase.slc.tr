/// <reference path="../pb_data/types.d.ts" />
/**
 * Kaynak ve işlem düzenleme ekranı (Ayarlar → Sistem → Kaynaklar, docs/d02_layout 3e):
 * kaynak settings.system.resources (access, view, create, update, delete). Herkes → access, view (görür, yazamaz);
 * admin ve superadmin rolleri → create, update, delete. Yazma PocketBase kuralıyla da yönetici rolleriyle sınırlı.
 */
const normalize = (value) =>
	String(value ?? '')
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.toLowerCase()
		.replace(/ı/g, 'i');

const KEY = 'settings.system.resources';
const LABEL = 'Kaynaklar';

migrate(
	(app) => {
		const actions = {};
		for (const a of app.findAllRecords('acl_actions')) actions[a.get('key')] = a;

		const parent = app.findFirstRecordByData('acl_resources', 'key', 'settings.system');
		const resource = new Record(app.findCollectionByNameOrId('acl_resources'), {
			key: KEY,
			label: LABEL,
			search_label: normalize(LABEL),
			kind: 'page',
			icon: 'file_symlink',
			href: '/app/settings/system/resources',
			match: 'exact',
			sort: 40,
			active: true,
			hidden: false,
			parent: parent.id,
			actions: ['access', 'view', 'create', 'update', 'delete'].map((k) => actions[k].id)
		});
		app.save(resource);

		const permissionsCol = app.findCollectionByNameOrId('acl_permissions');
		const add = (actionKey, role) => {
			const subject = role ? role.get('label') : 'Herkes';
			const label = `${subject} · ${LABEL} · ${actions[actionKey].get('label')}`;
			app.save(
				new Record(permissionsCol, {
					resource: resource.id,
					action: actions[actionKey].id,
					role: role ? role.id : '',
					user: '',
					effect: 'allow',
					label,
					search_label: normalize(label)
				})
			);
		};
		add('access');
		add('view');
		for (const role of app.findAllRecords('acl_roles')) {
			if (['admin', 'superadmin'].includes(role.get('type'))) for (const key of ['create', 'update', 'delete']) add(key, role);
		}
	},
	(app) => {
		try {
			app.delete(app.findFirstRecordByData('acl_resources', 'key', KEY)); // izinleri cascade ile silinir
		} catch {
			// zaten silinmiş
		}
	}
);
