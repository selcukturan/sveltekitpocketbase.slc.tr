import * as v from 'valibot';
import { parseDateInputToIso, parseDatetimeInputToIso, isValidIsoDate } from '#lib/utils/input-helper.js';
import { errorKeys } from './inputs/meta';

// BU SAYFADA DEFAULT DEĞER BELİRLENMEZ.
// Yalnızca biçim kontrolleri yapılır; zorunluluk, uzunluk ve boyut sınırları builder'larda (schemas/inputs) verilir.
// Mesajlar çeviri anahtarıdır (errorKeys); istemcide `t()` ile çevrilir.

// ########################### BEGIN STRING ###########################
const safeStringCharsRegex = /^[a-zA-Z0-9ÇçĞğİıÖöŞşÜü\s._()'!*:@,;+?=-]*$/;
const safeStringIdCharsRegex = /^[a-z0-9:-]+$/;
// Regex açıklaması:
// \p{L}: Tüm dillerdeki harfler (Türkçe dahil)
// \p{N}: Tüm rakamlar
// \p{P}: Tüm noktalama işaretleri (. , ! ? < > [ ] { } " ' / \ _ vb.)
// \p{S}: Semboller (+ = $ % ^ & vb.)
// \p{M}: Birleşik işaretler (ayrık yazılmış aksanlar, emoji varyasyon seçicisi; örn: ❤️)
// \p{Cf}: Biçim karakterleri (sıfır genişlikli birleştirici; örn: 👨‍👩‍👧)
// \s: Boşluk karakterleri (boşluk, tab, yeni satır)
// Reddedilenler: kontrol karakterleri (\p{Cc}, boşluklar hariç), tanımsız ve özel kullanım karakterleri
const safeStringTextareaCharsRegex = /^[\p{L}\p{N}\p{P}\p{S}\p{M}\p{Cf}\s]*$/u;

export const id = v.pipe(v.string(), v.regex(safeStringIdCharsRegex, errorKeys.invalidId));

export const text = v.union([
	v.literal(''), // Boş string ise kabul et
	v.pipe(v.string(), v.regex(safeStringCharsRegex, errorKeys.invalidTextChars)) // Değilse text formatı ara
]); // Uzunluk sınırı builder'da (inputs/text.ts) verilir

export const textarea = v.union([
	v.literal(''), // Boş string ise kabul et
	v.pipe(v.string(), v.regex(safeStringTextareaCharsRegex, errorKeys.invalidTextareaChars)) // Değilse textarea formatı ara
]); // Boyut sınırı builder'da (inputs/textarea.ts) verilir

export const email = v.union([
	v.literal(''), // Boş string ise kabul et
	v.pipe(v.string(), v.email(errorKeys.invalidEmail)) // Değilse email formatı ara
]); // Uzunluk sınırı builder'da (inputs/email.ts) verilir
export const url = v.union([
	v.literal(''), // Boş string ise kabul et
	v.pipe(v.string(), v.url(errorKeys.invalidUrl)) // Değilse url formatı ara
]); // Uzunluk sınırı builder'da (inputs/url.ts) verilir
// ########################### END STRING ###########################

// ########################### BEGIN NUMBER ###########################
export const number = v.pipe(
	v.number(errorKeys.invalidNumber),
	v.minValue(Number.MIN_SAFE_INTEGER, errorKeys.numberOutOfRange),
	v.maxValue(Number.MAX_SAFE_INTEGER, errorKeys.numberOutOfRange)
);

// ########################### END NUMBER ###########################

// ########################### BEGIN BOOLEAN ###########################
export const bool = v.boolean(errorKeys.invalidBool);
// ########################### END BOOLEAN ###########################

// ########################### BEGIN DATE ###########################
export const date = v.pipe(
	v.string(),
	v.transform((input) => parseDateInputToIso(input)),
	v.custom((input) => {
		if (input === '') return true;
		return isValidIsoDate(input);
	}, errorKeys.invalidDate)
);
// ########################### END DATE ###########################

// ########################### BEGIN DATETIME ###########################
export const datetime = v.pipe(
	v.string(),
	v.transform((input) => parseDatetimeInputToIso(input)),
	v.custom((input) => {
		if (input === '') return true;
		return isValidIsoDate(input);
	}, errorKeys.invalidDatetime)
);
// ########################### END DATETIME ###########################
