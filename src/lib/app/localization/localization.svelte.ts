import { tr, en, type BaseTranslationKeys } from './translations';

// ------------------------------ BEGIN Translations Object ---------------------------------------
const translations = { tr, en } as const;
// ------------------------------ END Translations Object ---------------------------------------

// ------------------------------ BEGIN Types -----------------------------------------------------
type SupportedLangs = keyof typeof translations;
type Language = { readonly code: SupportedLangs; readonly name: string };
// ------------------------------ END Types -------------------------------------------------------

// ------------------------------ BEGIN Readonly Supported Languages ------------------------------
const supported: Language[] = [{ code: 'tr', name: 'Türkçe' }, { code: 'en', name: 'English' }];
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

	return 'tr';
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
// Çeviri tanımı:
// welcome_message: 'Merhaba {name}, {count} yeni mesajın var'

// Kullanım:
// t('welcome_message', { name: 'Selçuk', count: 5 })
// → "Merhaba Selçuk, 5 yeni mesajın var"

export type TranslationParams = Record<string, string | number>;

export function t(key: BaseTranslationKeys | (string & {}), params?: TranslationParams): string {
	const text = translations[selected][key as BaseTranslationKeys] || `"${key}" not found in "${selected}"`;

	if (!params) return text;
	return text.replace(/\{(\w+)\}/g, (_: string, k: string) => (k in params ? String(params[k]) : `{${k}}`));
}

// ------------------------------ END Get Translation --------------------------------------------
