/// <reference path="../pb_data/types.d.ts" />
/**
 * Yetki ekranı (Ayarlar → Sistem → Yetkiler, docs/d02_layout 3d):
 * - sys_users: admin ve üstü roller (order ≥ 30) diğer kullanıcıları listeleyebilir/görebilir (kişisel izin vermek için).
 *   Önceden herkes yalnızca kendini görüyordu.
 * - Kaynak: settings.system.permissions (access, view, update). Herkes → access, view (ekranı görür, yazamaz);
 *   admin ve superadmin rolleri → update. (system/developer zaten her şeye izinli; yazma PocketBase kuralıyla da
 *   yönetici rolleriyle sınırlı.)
 */
const normalize = (value) =>
	String(value ?? '')
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.toLowerCase()
		.replace(/ı/g, 'i');

const USERS_READ_OLD = '// rol: aktif, tüm roller.\nid = @request.auth.id && \n@request.auth.role.status ?= "active"';
const USERS_READ_NEW =
	'// rol: aktif; kendisi ya da admin ve üstü roller (yetki ekranı).\n(id = @request.auth.id || @request.auth.role.order ?>= 30) && \n@request.auth.role.status ?= "active"';

const KEY = 'settings.system.permissions';
const LABEL = 'Yetkiler';

migrate(
	(app) => {
		const users = app.findCollectionByNameOrId('sys_users');
		users.listRule = USERS_READ_NEW;
		users.viewRule = USERS_READ_NEW;
		app.save(users);

		const actions = {};
		for (const a of app.findAllRecords('acl_actions')) actions[a.get('key')] = a;

		const parent = app.findFirstRecordByData('acl_resources', 'key', 'settings.system');
		const resource = new Record(app.findCollectionByNameOrId('acl_resources'), {
			key: KEY,
			label: LABEL,
			search_label: normalize(LABEL),
			kind: 'page',
			icon: 'file_symlink',
			href: '/app/settings/system/permissions',
			match: 'exact',
			sort: 30,
			active: true,
			hidden: false,
			parent: parent.id,
			actions: ['access', 'view', 'update'].map((k) => actions[k].id)
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
			if (['admin', 'superadmin'].includes(role.get('type'))) add('update', role);
		}
	},
	(app) => {
		try {
			app.delete(app.findFirstRecordByData('acl_resources', 'key', KEY)); // izinleri cascade ile silinir
		} catch {
			// zaten silinmiş
		}
		const users = app.findCollectionByNameOrId('sys_users');
		users.listRule = USERS_READ_OLD + '\n'; // önceki hâli birebir (listRule sonunda satır sonu vardı)
		users.viewRule = USERS_READ_OLD;
		app.save(users);
	}
);
