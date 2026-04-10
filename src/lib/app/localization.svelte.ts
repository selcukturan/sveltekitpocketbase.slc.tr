// ####################################### BEGIN TRANSLATIONS ####################################

import { browser } from '$app/environment';

// ---------------------------------------- TR Translations
const trTranslations = {
	hello_world: 'Merhaba Dünya',
	login: 'Giriş Yap',
	logout: 'Çıkış Yap',
	change_theme: 'Temayı Değiştir',
	close: 'Kapat',
	create: 'Oluştur',
	delete: 'Sil',
	edit: 'Düzenle',
	refresh: 'Yenile',
	search: 'Ara',
	view: 'Görüntüle',
	update: 'Güncelle',
	// schema messages
	invalid_data: 'Geçersiz veri!',
	invalid_email: 'Geçersiz e-posta adresi!',
	email_required: 'E-posta adresi gereklidir!',
	password_required: 'Parola gereklidir!',
	// error messages
	error_generic: 'Bir hata oluştu!',
	error_unauthorized: 'Yetkisiz erişim!',
	error_forbidden: 'Erişim engellendi!',
	error_not_found: 'Sayfa bulunamadı!',
	error_internal_server: 'Sunucu hatası!',
	error_bad_request: 'Geçersiz istek!',
	err0001: 'Bilinmeyen bir hata oluştu!'
} as const;

// ---------------------------------------- EN Translations
const translations: Translations = {
	tr: trTranslations,
	en: {
		hello_world: 'Hello World',
		login: 'Login',
		logout: 'Logout',
		change_theme: 'Change Theme',
		close: 'Close',
		create: 'Create',
		delete: 'Delete',
		edit: 'Edit',
		refresh: 'Refresh',
		search: 'Search',
		view: 'View',
		update: 'Update',
		//messages
		invalid_data: 'Invalid data!',
		invalid_email: 'Invalid email address!',
		email_required: 'Email is required!',
		password_required: 'Password is required!',
		// error messages
		error_generic: 'An error occurred!',
		error_unauthorized: 'Unauthorized access!',
		error_forbidden: 'Access forbidden!',
		error_not_found: 'Page not found!',
		error_internal_server: 'Internal server error!',
		error_bad_request: 'Bad request!',
		err0001: 'An unknown error occurred!'
	}
} as const;
// ####################################### END TRANSLATIONS ######################################

// ------------------------------ BEGIN Types -----------------------------------------------------
type SupportedLangs = 'tr' | 'en';
export type TranslationKeys = keyof typeof trTranslations;
type Translations = Record<SupportedLangs, Record<TranslationKeys, string>>;
type Language = {
	readonly code: SupportedLangs;
	readonly name: string;
};
// ------------------------------ END Types -------------------------------------------------------

// ------------------------------ BEGIN Readonly Supported Languages ------------------------------
const supported: Language[] = [
	{ code: 'tr', name: 'Türkçe' },
	{ code: 'en', name: 'English' }
];
supported.forEach(Object.freeze);
Object.freeze(supported);
export const supportedLanguages: readonly Language[] = supported;
// ------------------------------ END Readonly Supported Languages --------------------------------

// ------------------------------ BEGIN Get Initial Language Method -------------------------------
function getInitialLang(): SupportedLangs {
	if (typeof window !== 'undefined') {
		const storedLang = localStorage.getItem('slc:lang');
		if (storedLang && supportedLanguages.some((lang) => lang.code === storedLang)) {
			return storedLang as SupportedLangs;
		}
	}

	if (browser) {
		return 'tr'; // Default Client Language
	} else {
		return 'en'; // Default Server Language
	}
}
// ------------------------------ END Get Initial Language Method --------------------------------

// ------------------------------ BEGIN Selected State and Language Management -------------------
let selected = $state<SupportedLangs>(getInitialLang());
export function getSelectedLang() {
	return selected;
}
export function setSelectedLang(lang: SupportedLangs) {
	if (supportedLanguages.some((s) => s.code === lang)) {
		selected = lang;
		localStorage.setItem('slc:lang', lang);
	}
}
// ------------------------------ END Selected State and Language Management ---------------------

// ------------------------------ BEGIN Get Translation ------------------------------------------
/**
 * Belirtilen anahtar için seçili dildeki çeviriyi döner.
 *
 * @param key Çevrilecek metin anahtarı
 * @returns Çevrilmiş metin
 */
export function t(key: TranslationKeys): string {
	return translations[selected][key] || `Translation for key "${key}" not found in language "${selected}"`;
}
// ------------------------------ END Get Translation --------------------------------------------
