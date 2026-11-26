import type { BaseTranslationKeys } from '#lib/app/localization/translations/tr.js';
import type { IconKey } from '#lib/components/icons/index.js';
import { buildTree, type MenuRecord, type MenuNode } from './tree.js';

// Uygulama menüsü: ileride PocketBase'deki menü koleksiyonundan gelecek kayıtlarla aynı biçim (düz liste, parent_id).
// Kökler (parent_id: null) modüllerdir: soldaki ikon rayında görünür. Altındaki ağaç modülün menüsüdür (sidebar).
// Başlıklar çeviri anahtarıdır. Yeni sayfa: kaydı ekle; href'in bir +page.svelte'ye karşılık geldiğini test denetler
// (tests/e2e/menu-tree.spec.ts).
export type AppMenuRecord = MenuRecord<BaseTranslationKeys, IconKey>;
export type AppMenuNode = MenuNode<BaseTranslationKeys, IconKey>;

const page = 'file_symlink' as const;

export const MENU_RECORDS: AppMenuRecord[] = [
	// ── Modüller ──
	{ id: 'home', parent_id: null, title: 'menu_home', icon: 'home', href: '/app', sort: 10 },
	{ id: 'grapes', parent_id: null, title: 'menu_grapes', icon: 'grape', href: '/app/grapes', sort: 20 },
	{ id: 'data-table', parent_id: null, title: 'menu_data_table', icon: 'data_table', href: '/app/data-table', sort: 30 },
	{ id: 'logs', parent_id: null, title: 'menu_logs', icon: 'chart_spline', href: '/app/logs', sort: 40 },
	{ id: 'developments', parent_id: null, title: 'menu_developments', icon: 'square_code', href: '/app/developments', sort: 50 },
	{ id: 'settings', parent_id: null, title: 'menu_settings', icon: 'settings', href: '/app/settings', sort: 60 },

	// ── Grapes ──
	{ id: 'grapes-intro', parent_id: 'grapes', title: 'menu_introduction', icon: page, href: '/app/grapes', sort: 10 },
	{ id: 'grapes-crud', parent_id: 'grapes', title: 'menu_grapes_crud', sort: 20 },
	{ id: 'grapes-crud-intro', parent_id: 'grapes-crud', title: 'menu_introduction', icon: page, href: '/app/grapes/crud', sort: 10 },
	{ id: 'grapes-crud-simple', parent_id: 'grapes-crud', title: 'menu_grapes_crud_simple', icon: page, href: '/app/grapes/crud/simple', sort: 20 },
	{ id: 'grapes-crud-full', parent_id: 'grapes-crud', title: 'menu_grapes_crud_full', icon: page, href: '/app/grapes/crud/create-read-update-delete', sort: 30 },

	// ── Veri tablosu ──
	{ id: 'data-table-intro', parent_id: 'data-table', title: 'menu_introduction', icon: page, href: '/app/data-table', sort: 10 },
	{ id: 'data-table-demos', parent_id: 'data-table', title: 'menu_data_table_demos', sort: 20 },
	{ id: 'data-table-demos-intro', parent_id: 'data-table-demos', title: 'menu_introduction', icon: page, href: '/app/data-table/demos', sort: 10 },
	{
		id: 'data-table-demos-common',
		parent_id: 'data-table-demos',
		title: 'menu_data_table_common_features',
		icon: page,
		href: '/app/data-table/demos/common-features',
		sort: 20
	},

	// ── Geliştirme ──
	{ id: 'dev-intro', parent_id: 'developments', title: 'menu_introduction', icon: page, href: '/app/developments', sort: 10 },
	{ id: 'dev-components', parent_id: 'developments', title: 'menu_dev_components', sort: 20 },
	{ id: 'dev-icons', parent_id: 'dev-components', title: 'menu_dev_icons', icon: page, href: '/app/developments/components', sort: 10 },
	{ id: 'dev-notifications', parent_id: 'dev-components', title: 'menu_dev_notifications', icon: page, href: '/app/developments/components/notifications', sort: 20 },
	{ id: 'dev-form-slc', parent_id: 'dev-components', title: 'menu_dev_form_slc', icon: page, href: '/app/developments/components/form-slc', sort: 30 },
	{ id: 'dev-tooltip', parent_id: 'dev-components', title: 'menu_dev_tooltip', icon: page, href: '/app/developments/components/tooltip', sort: 40 },
	{ id: 'dev-toast', parent_id: 'dev-components', title: 'menu_dev_toast', icon: page, href: '/app/developments/components/toast', sort: 50 },
	{ id: 'dev-confirmation', parent_id: 'dev-components', title: 'menu_dev_confirmation', icon: page, href: '/app/developments/components/confirmation', sort: 60 },
	{ id: 'dev-drawer', parent_id: 'dev-components', title: 'menu_dev_drawer', icon: page, href: '/app/developments/components/drawer', sort: 70 },
	{ id: 'dev-inputs', parent_id: 'dev-components', title: 'menu_dev_inputs', icon: page, href: '/app/developments/components/select', sort: 80 },
	{ id: 'dev-remote', parent_id: 'dev-components', title: 'menu_dev_remote_functions', icon: page, href: '/app/developments/components/remote-functions', sort: 90 },
	{ id: 'dev-pagination', parent_id: 'dev-components', title: 'menu_dev_pagination', icon: page, href: '/app/developments/components/link-routing', sort: 100 },
	{ id: 'dev-toggler', parent_id: 'dev-components', title: 'menu_dev_toggler', icon: page, href: '/app/developments/components/empty', sort: 110 },
	{ id: 'dev-tree', parent_id: 'dev-components', title: 'menu_dev_tree', icon: page, href: '/app/developments/components/tree', sort: 120 },

	// ── Ayarlar ──
	{ id: 'settings-intro', parent_id: 'settings', title: 'menu_introduction', icon: page, href: '/app/settings', sort: 10 },
	{ id: 'settings-system', parent_id: 'settings', title: 'menu_settings_system', sort: 20 },
	{ id: 'settings-system-intro', parent_id: 'settings-system', title: 'menu_introduction', icon: page, href: '/app/settings/system', sort: 10 },
	{ id: 'settings-application', parent_id: 'settings-system', title: 'menu_settings_application', icon: page, href: '/app/settings/system/application', sort: 20 }
];

export const MENU: AppMenuNode[] = buildTree(MENU_RECORDS);
