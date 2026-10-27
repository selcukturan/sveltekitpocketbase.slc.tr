import * as v from 'valibot';
import { parseDateInputToIso, parseDatetimeInputToIso, isValidIsoDate } from '#lib/utils/input-helper.js';

// BU SAYFADA DEFAULT DEĞER BELİRLENMEZ.

// ########################### BEGIN STRING ###########################
const safeStringCharsRegex = /^[a-zA-Z0-9ÇçĞğİıÖöŞşÜü\s._()'!*:@,;+?=-]*$/;
const safeStringIdCharsRegex = /^[a-z0-9:-]+$/;
// Regex açıklaması:
// \p{L}: Tüm dillerdeki harfler (Türkçe dahil)
// \p{N}: Tüm rakamlar
// \p{P}: Tüm noktalama işaretleri (. , ! ? < > [ ] { } " ' / \ _ vb.)
// \p{S}: Semboller (+ = $ % ^ & vb.)
// \s: Boşluk karakterleri (boşluk, tab, yeni satır)
const safeStringTextareaCharsRegex = /^[\p{L}\p{N}\p{P}\p{S}\s]*$/u;

export const id = v.pipe(v.string(), v.regex(safeStringIdCharsRegex, 'ID için geçersiz karakterler içeriyor.'));

export const text = v.union([
	v.literal(''), // Boş string ise kabul et
	v.pipe(v.string(), v.regex(safeStringCharsRegex, 'Girdi sadece harf, rakam ve belirli noktalama işaretleri içerebilir.')) // Değilse text formatı ara
]); // Uzunluk sınırı builder'da (inputs/text.ts) verilir

export const textarea = v.union([
	v.literal(''), // Boş string ise kabul et
	v.pipe(v.string(), v.regex(safeStringTextareaCharsRegex, 'Textarea için geçersiz karakterler içeriyor.')) // Değilse textarea formatı ara
]); // Boyut sınırı builder'da (inputs/textarea.ts) verilir

export const email = v.union([
	v.literal(''), // Boş string ise kabul et
	v.pipe(v.string(), v.email('Geçerli bir email adresi giriniz.'), v.maxLength(255, 'Lütfen en fazla 255 karakter girin.')) // Değilse email formatı ara
]);
export const url = v.union([
	v.literal(''), // Boş string ise kabul et
	v.pipe(v.string(), v.url('Geçerli bir url giriniz.'), v.maxLength(255, 'Lütfen en fazla 255 karakter girin.')) // Değilse url formatı ara
]);
// ########################### END STRING ###########################

// ########################### BEGIN NUMBER ###########################
export const number = v.pipe(
	v.number('Lütfen bir sayı giriniz.'),
	v.minValue(Number.MIN_SAFE_INTEGER, 'Sayısal değer çok küçük.'),
	v.maxValue(Number.MAX_SAFE_INTEGER, 'Sayısal değer çok büyük.')
);

// ########################### END NUMBER ###########################

// ########################### BEGIN BOOLEAN ###########################
export const bool = v.boolean('Lütfen bir boolean değer giriniz.');
// ########################### END BOOLEAN ###########################

// ########################### BEGIN DATE ###########################
export const date = v.pipe(
	v.string(),
	v.transform((input) => parseDateInputToIso(input)),
	v.custom((input) => {
		if (input === '') return true;
		return isValidIsoDate(input);
	}, 'Geçerli bir tarih giriniz.')
);
// ########################### END DATE ###########################

// ########################### BEGIN DATETIME ###########################
export const datetime = v.pipe(
	v.string(),
	v.transform((input) => parseDatetimeInputToIso(input)),
	v.custom((input) => {
		if (input === '') return true;
		return isValidIsoDate(input);
	}, 'Geçerli bir tarih ve saat giriniz.')
);
// ########################### END DATETIME ###########################

// ########################### BEGIN ALL CURRENT VALUE ###########################
/* export const allCurrentValue = v.union([
	id,
	text,
	integer,
	decimal_1,
	decimal_2,
	decimal_3,
	decimal_4,
	decimal_5,
	decimal_6,
	decimal_7,
	decimal_8,
	decimal_9,
	bool,
	date,
	datetime
]);
export type AllCurrentValue = v.InferOutput<typeof allCurrentValue>; */
// ########################### END ALL CURRENT VALUE ###########################
