/// <reference path="../pb_data/types.d.ts" />
/**
 * Yetki sisteminin başlangıç verisi: işlemler, kaynaklar (src/lib/app/menu/menu.ts ile aynı menü) ve bugünkü davranışı
 * koruyan izinler: sayfası olan her kaynak ve her uygulama özelliği için Herkes → access → allow.
 * - Alt menüsü olan modüllerin href'i yoktur: raydaki bağlantı kullanıcının görebildiği ilk sayfaya gider.
 * - search_label pb_hooks'ta üretilir; burada da açıkça yazılır (migration sırasında hook'a güvenmemek için).
 */
const normalize = (value) =>
	String(value ?? '')
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.toLowerCase()
		.replace(/ı/g, 'i');

const ACTIONS = [
	['access', 'Erişim', 10],
	['list', 'Listeleme', 20],
	['view', 'Görüntüleme', 30],
	['create', 'Oluşturma', 40],
	['update', 'Güncelleme', 50],
	['delete', 'Silme', 60],
	['export', 'Dışa aktarma', 70]
];

const CRUD = ['access', 'list', 'view', 'create', 'update', 'delete', 'export'];
const P = 'file_symlink';

// [key, parentKey, kind, label, icon, href, sort, actions?]
const RESOURCES = [
	['home', null, 'module', 'Ana Sayfa', 'home', '/app', 10],
	['grapes', null, 'module', 'Grapes', 'grape', '', 20],
	['grapes.intro', 'grapes', 'page', 'Giriş', P, '/app/grapes', 10],
	['grapes.crud', 'grapes', 'group', 'CRUD', '', '', 20],
	['grapes.crud.intro', 'grapes.crud', 'page', 'Giriş', P, '/app/grapes/crud', 10],
	['grapes.crud.simple', 'grapes.crud', 'page', 'Basit CRUD', P, '/app/grapes/crud/simple', 20, CRUD],
	['grapes.crud.full', 'grapes.crud', 'page', 'Oluştur, Oku, Güncelle, Sil', P, '/app/grapes/crud/create-read-update-delete', 30, CRUD],
	['data_table', null, 'module', 'Veri Tablosu', 'data_table', '', 30],
	['data_table.intro', 'data_table', 'page', 'Giriş', P, '/app/data-table', 10],
	['data_table.demos', 'data_table', 'group', 'Demolar', '', '', 20],
	['data_table.demos.intro', 'data_table.demos', 'page', 'Giriş', P, '/app/data-table/demos', 10],
	['data_table.demos.common', 'data_table.demos', 'page', 'Ortak Özellikler', P, '/app/data-table/demos/common-features', 20],
	['logs', null, 'module', 'Kayıtlar', 'chart_spline', '/app/logs', 40],
	['developments', null, 'module', 'Geliştirme', 'square_code', '', 50],
	['developments.intro', 'developments', 'page', 'Giriş', P, '/app/developments', 10],
	['developments.components', 'developments', 'group', 'Bileşenler', '', '', 20],
	['developments.components.icons', 'developments.components', 'page', 'İkonlar', P, '/app/developments/components', 10],
	['developments.components.notifications', 'developments.components', 'page', 'Bildirimler', P, '/app/developments/components/notifications', 20],
	['developments.components.form_slc', 'developments.components', 'page', 'Form (SLC)', P, '/app/developments/components/form-slc', 30],
	['developments.components.tooltip', 'developments.components', 'page', 'İpucu (Tooltip)', P, '/app/developments/components/tooltip', 40],
	['developments.components.toast', 'developments.components', 'page', 'Toast', P, '/app/developments/components/toast', 50],
	['developments.components.confirmation', 'developments.components', 'page', 'Onay Penceresi', P, '/app/developments/components/confirmation', 60],
	['developments.components.drawer', 'developments.components', 'page', 'Drawer Panel', P, '/app/developments/components/drawer', 70],
	['developments.components.inputs', 'developments.components', 'page', 'Girdiler', P, '/app/developments/components/select', 80],
	['developments.components.remote', 'developments.components', 'page', 'Remote Functions', P, '/app/developments/components/remote-functions', 90],
	['developments.components.pagination', 'developments.components', 'page', 'Sayfalama', P, '/app/developments/components/link-routing', 100],
	['developments.components.toggler', 'developments.components', 'page', 'Toggler', P, '/app/developments/components/empty', 110],
	['developments.components.tree', 'developments.components', 'page', 'Ağaç (Taslak)', P, '/app/developments/components/tree', 120],
	['settings', null, 'module', 'Ayarlar', 'settings', '', 60],
	['settings.intro', 'settings', 'page', 'Giriş', P, '/app/settings', 10],
	['settings.system', 'settings', 'group', 'Sistem', '', '', 20],
	['settings.system.intro', 'settings.system', 'page', 'Giriş', P, '/app/settings/system', 10],
	['settings.system.application', 'settings.system', 'page', 'Uygulama', P, '/app/settings/system/application', 20, ['access', 'view', 'update']],
	// Uygulama özellikleri (menüde görünmez)
	['app.language', null, 'feature', 'Dil seçimi', '', '', 900],
	['app.notifications', null, 'feature', 'Bildirimler', '', '', 910]
];

migrate(
	(app) => {
		const actionsCol = app.findCollectionByNameOrId('acl_actions');
		const resourcesCol = app.findCollectionByNameOrId('acl_resources');
		const permissionsCol = app.findCollectionByNameOrId('acl_permissions');

		const actionIds = {};
		const actionLabels = {};
		for (const [key, label, sort] of ACTIONS) {
			const record = new Record(actionsCol, { key, label, search_label: normalize(label), sort });
			app.save(record);
			actionIds[key] = record.id;
			actionLabels[key] = label;
		}

		const resourceIds = {};
		for (const [key, parentKey, kind, label, icon, href, sort, actions] of RESOURCES) {
			// Sayfa ve özelliklerde en az "access"; grup ve alt menülü modüllerde işlem yok (görünürlük alttaki sayfalardan)
			const keys = actions ?? (href || kind === 'feature' ? ['access'] : []);
			const record = new Record(resourcesCol, {
				key,
				label,
				search_label: normalize(label),
				kind,
				icon,
				href,
				match: href ? 'exact' : '',
				sort,
				active: true,
				hidden: false,
				parent: parentKey ? resourceIds[parentKey] : '',
				actions: keys.map((k) => actionIds[k])
			});
			app.save(record);
			resourceIds[key] = record.id;

			// Bugünkü davranış: herkes görebilir/kullanabilir
			if (keys.includes('access')) {
				const permissionLabel = `Herkes · ${label} · ${actionLabels.access}`;
				app.save(
					new Record(permissionsCol, {
						resource: record.id,
						action: actionIds.access,
						role: '',
						user: '',
						effect: 'allow',
						label: permissionLabel,
						search_label: normalize(permissionLabel)
					})
				);
			}
		}
	},
	(app) => {
		// Kaynaklar silinince izinleri de silinir (cascade). Çocuklar önce: üst kayıt silinemez.
		for (const [key] of [...RESOURCES].reverse()) {
			try {
				app.delete(app.findFirstRecordByData('acl_resources', 'key', key));
			} catch {
				// zaten silinmiş
			}
		}
		for (const [key] of ACTIONS) {
			try {
				app.delete(app.findFirstRecordByData('acl_actions', 'key', key));
			} catch {
				// zaten silinmiş
			}
		}
	}
);
