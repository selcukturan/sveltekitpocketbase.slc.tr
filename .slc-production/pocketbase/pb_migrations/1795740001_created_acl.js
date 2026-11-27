/// <reference path="../pb_data/types.d.ts" />
/**
 * Yetki sistemi (docs/d02_layout): üç koleksiyon.
 * - acl_actions: işlem kataloğu (access, list, view, create, update, delete, export, …)
 * - acl_resources: yetki verilebilen her şey: menü (modül, grup, sayfa) ve uygulama özellikleri (feature). Menü ağacı.
 * - acl_permissions: bir satır = bir kaynak + bir işlem + bir özne (rol, kullanıcı ya da ikisi boşsa Herkes) + allow/deny.
 *   Satır yoksa "belirtilmemiş". Etkin izin sunucuda hesaplanır (kişisel > rol > Herkes > kapalı).
 * label/search_label tüm koleksiyonlarda; search_label pb_hooks'ta label'dan üretilir (Türkçe arama).
 * Okuma: giriş yapmış kullanıcı (izinlerde yalnızca kendisine ait satırlar). Yazma: yönetici rolleri.
 */
const ADMIN =
	'@request.auth.id != "" && @collection.acl_roles.id ?= @request.auth.role.id && @collection.acl_roles.status ?= "active" && ' +
	'(@collection.acl_roles.type ?= "admin" || @collection.acl_roles.type ?= "superadmin" || @collection.acl_roles.type ?= "system" || @collection.acl_roles.type ?= "developer")';
const AUTH = '@request.auth.id != ""';

const text = (name, extra = {}) => ({ name, type: 'text', required: false, max: 0, ...extra });
const labels = () => [text('label', { required: true, max: 200 }), text('search_label', { max: 200 })];
const dates = () => [
	{ name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
	{ name: 'updated', type: 'autodate', onCreate: true, onUpdate: true }
];
const rules = (read) => ({ listRule: read, viewRule: read, createRule: ADMIN, updateRule: ADMIN, deleteRule: ADMIN });

migrate(
	(app) => {
		const roles = app.findCollectionByNameOrId('acl_roles');
		const users = app.findCollectionByNameOrId('sys_users');

		const actions = new Collection({
			id: 'pbc_acl_actions',
			name: 'acl_actions',
			type: 'base',
			...rules(AUTH),
			fields: [text('key', { required: true, max: 50, pattern: '^[a-z0-9_]+$' }), ...labels(), { name: 'sort', type: 'number', onlyInt: true }, ...dates()],
			indexes: ['CREATE UNIQUE INDEX `idx_acl_actions_key` ON `acl_actions` (`key`)']
		});
		app.save(actions);

		const resources = new Collection({
			id: 'pbc_acl_resources',
			name: 'acl_resources',
			type: 'base',
			...rules(AUTH),
			fields: [
				text('key', { required: true, max: 100, pattern: '^[a-z0-9_.]+$' }),
				...labels(),
				{ name: 'kind', type: 'select', required: true, maxSelect: 1, values: ['module', 'group', 'page', 'feature'] },
				text('icon', { max: 50 }),
				text('href', { max: 300 }),
				{ name: 'match', type: 'select', maxSelect: 1, values: ['exact', 'prefix'] },
				{ name: 'sort', type: 'number', onlyInt: true },
				{ name: 'active', type: 'bool' },
				{ name: 'hidden', type: 'bool' },
				{ name: 'actions', type: 'relation', collectionId: actions.id, maxSelect: 99, cascadeDelete: false },
				...dates()
			],
			indexes: ['CREATE UNIQUE INDEX `idx_acl_resources_key` ON `acl_resources` (`key`)']
		});
		app.save(resources);
		// Kendine ilişki (ağaç): koleksiyon var olduktan sonra eklenir. Üst kayıt silinemez (önce çocuklar taşınır/silinir).
		resources.fields.add(new RelationField({ name: 'parent', collectionId: resources.id, maxSelect: 1, cascadeDelete: false }));
		resources.indexes.push('CREATE INDEX `idx_acl_resources_parent` ON `acl_resources` (`parent`)');
		app.save(resources);

		// İzinler: kullanıcı kendi satırlarını, rollerinin satırlarını ve Herkes satırlarını okur; yönetici hepsini
		const ownRead = `${AUTH} && (user = @request.auth.id || (user = "" && (role = "" || role ?= @request.auth.role.id)) || (` + ADMIN + '))';
		const permissions = new Collection({
			id: 'pbc_acl_permissions',
			name: 'acl_permissions',
			type: 'base',
			...rules(ownRead),
			fields: [
				{ name: 'resource', type: 'relation', required: true, collectionId: resources.id, maxSelect: 1, cascadeDelete: true },
				{ name: 'action', type: 'relation', required: true, collectionId: actions.id, maxSelect: 1, cascadeDelete: true },
				{ name: 'role', type: 'relation', collectionId: roles.id, maxSelect: 1, cascadeDelete: true },
				{ name: 'user', type: 'relation', collectionId: users.id, maxSelect: 1, cascadeDelete: true },
				{ name: 'effect', type: 'select', required: true, maxSelect: 1, values: ['allow', 'deny'] },
				...labels(),
				...dates()
			],
			indexes: [
				// Aynı hücre iki kez yazılamaz (boş ilişki '' olarak saklanır: Herkes satırı da tekil)
				'CREATE UNIQUE INDEX `idx_acl_permissions_cell` ON `acl_permissions` (`resource`, `action`, `role`, `user`)',
				'CREATE INDEX `idx_acl_permissions_role` ON `acl_permissions` (`role`)',
				'CREATE INDEX `idx_acl_permissions_user` ON `acl_permissions` (`user`)'
			]
		});
		app.save(permissions);
	},
	(app) => {
		for (const name of ['acl_permissions', 'acl_resources', 'acl_actions']) {
			try {
				app.delete(app.findCollectionByNameOrId(name));
			} catch {
				// zaten silinmiş
			}
		}
	}
);
