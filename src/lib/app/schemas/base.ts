import * as v from 'valibot';
import { parseDateInputToIso, parseDatetimeInputToIso, isValidIsoDate } from '$lib/utils/input-helper';

const safeStringCharsRegex = /^[a-zA-Z0-9ÇçĞğİıÖöŞşÜü\s._()'!*:@,;+?=-]*$/;
const safeStringIdCharsRegex = /^[a-z0-9:-]+$/;

/**
 * @returns check string is valid id. /^[a-z0-9:-]+$/
 */
export const id = v.pipe(v.string(), v.regex(safeStringIdCharsRegex, 'ID için geçersiz karakterler içeriyor.'));
/**
 * @returns check string is valid string. /^[a-zA-Z0-9ÇçĞğİıÖöŞşÜü\s._()'!*:@,;+?=-]*$/
 */
export const string = v.pipe(
	v.string(),
	v.regex(safeStringCharsRegex, 'Girdi sadece harf, rakam ve belirli noktalama işaretleri içerebilir.'),
	v.maxLength(255, 'Lütfen en fazla 255 karakter girin.')
);
/**
 * @returns check number is valid number.
 */
export const number = v.pipe(
	v.number(),
	v.minValue(Number.MIN_SAFE_INTEGER, 'Sayısal değer çok küçük.'),
	v.maxValue(Number.MAX_SAFE_INTEGER, 'Sayısal değer çok büyük.')
);
/**
 * @returns check boolean is valid boolean.
 */
export const boolean = v.boolean();

/**
 * @returns empty string "" OR parsed string "2025-11-21" -> "2025-11-21 00:00:00.000Z"
 */
export const date = v.pipe(
	v.string(),
	v.transform((input) => parseDateInputToIso(input)),
	v.custom(
		(input) => isValidIsoDate(input),
		'Tarih geçerli bir takvim tarihi değil (Örn: 31 Haziran) veya Tarih 01.01.1900-31.12.2100 aralığında değil.'
	)
);

/**
 * @returns empty string "" OR parsed string "2025-11-21T10:00" -> "2025-11-21 10:00:00.000Z"
 */
export const datetime = v.pipe(
	v.string(),
	v.transform((input) => parseDatetimeInputToIso(input)),
	v.custom(
		(input) => isValidIsoDate(input),
		'Tarih geçerli bir takvim tarihi değil (Örn: 31 Haziran) veya Tarih 01.01.1900-31.12.2100 aralığında değil.'
	)
);

export const operators = v.picklist([
	'=',
	'!=',
	'>',
	'>=',
	'<',
	'<=',
	'~',
	'!~',
	'?=',
	'?!=',
	'?>',
	'?>=',
	'?<',
	'?<=',
	'?~',
	'?!~'
]);

export const allCurrentValue = v.union([string, number, boolean, date, datetime]);
export type AllCurrentValue = v.InferOutput<typeof allCurrentValue>;
