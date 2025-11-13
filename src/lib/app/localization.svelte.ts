// ####################################### BEGIN TRANSLATIONS ####################################
// ---------------------------------------- TR Translations
const trTranslations = {
	hello_world: 'Merhaba Dünya',
	login: 'Giriş Yap',
	logout: 'Çıkış Yap',
	change_theme: 'Temayı Değiştir'
} as const;

// ---------------------------------------- EN Translations
const translations: Translations = {
	tr: trTranslations,
	en: {
		hello_world: 'Hello World',
		login: 'Login',
		logout: 'Logout',
		change_theme: 'Change Theme'
	}
} as const;
// ####################################### END TRANSLATIONS ######################################

// ------------------------------ BEGIN Types -----------------------------------------------------
type SupportedLangs = 'tr' | 'en';
type TranslationKeys = keyof typeof trTranslations;
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
	return 'tr'; // Default language
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
	return translations[selected][key];
}
// ------------------------------ END Get Translation --------------------------------------------
