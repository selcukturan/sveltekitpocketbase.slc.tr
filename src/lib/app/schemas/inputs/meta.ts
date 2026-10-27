import * as v from 'valibot';

// Şemadan UI'a taşınan alan bilgileri. Seçenek adları PocketBase alan ayarlarıyla aynıdır.
// Sarmalayıcılar (form_inputs) bu bilgiyi `useFormField` ile okur; sayfada tekrar yazılmaz.
export type InputMeta = {
	required: boolean;
	multiple?: boolean;
	min?: number; // metin uzunluğu | sayı değeri
	max?: number; // metin uzunluğu | sayı değeri
	onlyInt?: boolean;
	decimals?: number; // en fazla ondalık basamak
	minDate?: string; // input biçiminde: 'YYYY-MM-DD' | 'YYYY-MM-DDTHH:mm'
	maxDate?: string;
	exceptDomains?: string[];
	onlyDomains?: string[];
	minSelect?: number;
	maxSelect?: number;
	maxSize?: number; // bayt
	mimeTypes?: string[];
	values?: string[]; // select değerleri
	collection?: string; // relation
};

export const inputMeta = <TInput>(meta: InputMeta) => v.metadata<TInput, { slc: InputMeta }>({ slc: meta });

// Hata mesajları çeviri anahtarıdır (örn: 'err_max_length'); istemcide `t(anahtar, meta)` ile çevrilir.
// Anahtar bulunamazsa mesaj olduğu gibi gösterilir.
export const errorKeys = {
	required: 'err_required',
	requiredTrue: 'err_required_true',
	minLength: 'err_min_length',
	maxLength: 'err_max_length',
	maxSize: 'err_max_size',
	minValue: 'err_min_value',
	maxValue: 'err_max_value',
	onlyInt: 'err_only_int',
	decimals: 'err_decimals',
	minDate: 'err_min_date',
	maxDate: 'err_max_date',
	domain: 'err_domain',
	minSelect: 'err_min_select',
	maxSelect: 'err_max_select',
	invalidOption: 'err_invalid_option',
	mimeType: 'err_mime_type'
} as const;

// Değer kontrolleri boş değer ('' | 0 | []) için atlanır; boşluk yalnızca `required` ile kontrol edilir (PocketBase davranışı).

// E-posta / url alan adı kısıtı (PocketBase: exceptDomains, onlyDomains)
export const domainAllowed = (domain: string, { exceptDomains = [], onlyDomains = [] }: Pick<InputMeta, 'exceptDomains' | 'onlyDomains'>) => {
	const d = domain.toLowerCase();
	if (onlyDomains.length > 0) return onlyDomains.some((x) => x.toLowerCase() === d);
	return !exceptDomains.some((x) => x.toLowerCase() === d);
};
