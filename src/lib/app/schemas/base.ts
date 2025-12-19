import * as v from 'valibot';
import { parseDateInputToIso, parseDatetimeInputToIso, isValidIsoDate } from '$lib/utils/input-helper';

// BU SAYFADA DEFAULT DEĞER BELİRLENMEZ.

// ########################### BEGIN STRING ###########################
const safeStringCharsRegex = /^[a-zA-Z0-9ÇçĞğİıÖöŞşÜü\s._()'!*:@,;+?=-]*$/;
const safeStringIdCharsRegex = /^[a-z0-9:-]+$/;
export const id = v.pipe(v.string(), v.regex(safeStringIdCharsRegex, 'ID için geçersiz karakterler içeriyor.'));
export const text = v.pipe(
	v.string(),
	v.regex(safeStringCharsRegex, 'Girdi sadece harf, rakam ve belirli noktalama işaretleri içerebilir.'),
	v.maxLength(255, 'Lütfen en fazla 255 karakter girin.')
);

// ########################### END STRING ###########################

// ########################### BEGIN NUMBER ###########################
export const number = v.pipe(
	v.number(),
	v.minValue(Number.MIN_SAFE_INTEGER, 'Sayısal değer çok küçük.'),
	v.maxValue(Number.MAX_SAFE_INTEGER, 'Sayısal değer çok büyük.')
);
export const maxDecimalPlaces = (max: number) =>
	v.check(
		(input: number) => new RegExp(`^-?\\d+(\\.\\d{1,${max}})?$`).test(String(input)),
		`Sayı en fazla ${max} ondalık basamağa sahip olabilir. `
	);

export const integer = v.pipe(number, v.integer());
export const decimal_1 = v.pipe(number, maxDecimalPlaces(1));
export const decimal_2 = v.pipe(number, maxDecimalPlaces(2));
export const decimal_3 = v.pipe(number, maxDecimalPlaces(3));
export const decimal_4 = v.pipe(number, maxDecimalPlaces(4));
export const decimal_5 = v.pipe(number, maxDecimalPlaces(5));
export const decimal_6 = v.pipe(number, maxDecimalPlaces(6));
export const decimal_7 = v.pipe(number, maxDecimalPlaces(7));
export const decimal_8 = v.pipe(number, maxDecimalPlaces(8));
export const decimal_9 = v.pipe(number, maxDecimalPlaces(9));
// ########################### END NUMBER ###########################

// ########################### BEGIN BOOLEAN ###########################
export const boolean = v.boolean();
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
export const allCurrentValue = v.union([
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
	boolean,
	date,
	datetime
]);
export type AllCurrentValue = v.InferOutput<typeof allCurrentValue>;
// ########################### END ALL CURRENT VALUE ###########################
