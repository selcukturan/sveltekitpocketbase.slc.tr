// Intl biçimlendirici önbelleği. `value.toLocaleString(locale)` ve `new Intl.NumberFormat(...)` her çağrıda yeni bir
// biçimlendirici kurar (V8 yalnızca dil ve seçenek verilmeyen çağrıları önbelleğe alır). Hücreler kaydırmada sürekli
// yeniden biçimlendiği için bu hem yavaş hem de çöp üretir. Burada her (seçenek, dil) çifti için bir kez kurulur.
//
// Önbellek seçenek NESNESİNE göre tutulur (anahtar üretmek için her çağrıda string oluşturulmaz): seçenekleri
// modül düzeyinde sabit olarak tanımlayıp onu verin. Her çağrıda yeni nesne verilirse önbellek işe yaramaz
// (WeakMap olduğu için sızıntı da olmaz).

type Formatter = Intl.NumberFormat | Intl.DateTimeFormat;

const cache = new WeakMap<object, Map<string, Formatter>>();

function cached<T extends Formatter>(options: object, locale: string, create: () => T): T {
	let byLocale = cache.get(options);
	if (!byLocale) cache.set(options, (byLocale = new Map()));
	let formatter = byLocale.get(locale) as T | undefined;
	if (!formatter) byLocale.set(locale, (formatter = create()));
	return formatter;
}

// Sık kullanılan seçenekler
export const NUMBER: Intl.NumberFormatOptions = {}; // = value.toLocaleString(locale)
export const NUMBER_2: Intl.NumberFormatOptions = { maximumFractionDigits: 2 }; // özet ve footer (ondalık sabit değil)
export const NUMBER_RAW: Intl.NumberFormatOptions = { useGrouping: false, maximumFractionDigits: 20 }; // düzenleyici metni
export const DATE: Intl.DateTimeFormatOptions = {}; // = date.toLocaleDateString(locale)
export const DATETIME: Intl.DateTimeFormatOptions = { dateStyle: 'short', timeStyle: 'short' };

export const numberFormat = (locale: string, options: Intl.NumberFormatOptions = NUMBER) =>
	cached(options, locale, () => new Intl.NumberFormat(locale, options));

export const dateFormat = (locale: string, options: Intl.DateTimeFormatOptions = DATE) =>
	cached(options, locale, () => new Intl.DateTimeFormat(locale, options));

// Sabit ondalık basamak (footer: sum(2) → 2 basamak). Basamak sayısı başına tek seçenek nesnesi.
const fixedDigits: Intl.NumberFormatOptions[] = [];
export const fixedDigitsOptions = (digits: number): Intl.NumberFormatOptions =>
	(fixedDigits[digits] ??= { minimumFractionDigits: digits, maximumFractionDigits: digits });
