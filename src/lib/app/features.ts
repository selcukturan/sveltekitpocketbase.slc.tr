import type { IconKey } from '#lib/components/icons/index.js';
import type { BaseTranslationKeys } from '#lib/app/localization/translations/index.js';

// Uygulamanın öne çıkan bölümleri: karşılama panosu (/app, kaynak anahtarıyla izne göre süzülür ve bağlanır) ve
// tanıtım sayfası (/) aynı listeyi kullanır.
export type Feature = {
	key: string; // acl_resources anahtarı (kartın gideceği sayfa)
	icon: IconKey;
	title: BaseTranslationKeys;
	desc: BaseTranslationKeys;
	tone: string; // ikon zemini ve rengi
};

// Tailwind sınıfları tam yazılmalı (dinamik birleştirme derlemede görünmez). Koyu temada tonlar kendiliğinden döner.
export const features: Feature[] = [
	{ key: 'grapes.crud.full', icon: 'grape', title: 'dash_f_crud_title', desc: 'dash_f_crud_desc', tone: 'bg-primary-100 text-primary-700' },
	{ key: 'data_table.demos.common', icon: 'data_table', title: 'dash_f_table_title', desc: 'dash_f_table_desc', tone: 'bg-info-100 text-info-700' },
	{ key: 'settings.system.permissions', icon: 'users', title: 'dash_f_acl_title', desc: 'dash_f_acl_desc', tone: 'bg-success-100 text-success-700' },
	{ key: 'settings.system.resources', icon: 'file_symlink', title: 'dash_f_resources_title', desc: 'dash_f_resources_desc', tone: 'bg-tertiary-100 text-tertiary-700' },
	{ key: 'developments.components.notifications', icon: 'bell', title: 'dash_f_notif_title', desc: 'dash_f_notif_desc', tone: 'bg-error-100 text-error-700' },
	{
		key: 'developments.components.form_slc',
		icon: 'square_code',
		title: 'dash_f_components_title',
		desc: 'dash_f_components_desc',
		tone: 'bg-secondary-100 text-secondary-800'
	}
];

export const GITHUB_URL = 'https://github.com/selcukturan/sveltekitpocketbase.slc.tr';
