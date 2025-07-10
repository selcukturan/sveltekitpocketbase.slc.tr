import * as v from 'valibot';
// ######################################## BEGIN DATE VALIDATION SCHEMAS ########################################
const MIN_DATE = new Date('1900-01-01T00:00:00.000Z');
const MAX_DATE = new Date('2200-12-31T23:59:59.999Z'); // Günün sonunu da dahil etmek için

const isoTimestampSchema = v.pipe(
	v.string('Girdi string olmalı.'), // String mi?
	v.isoTimestamp('Timestamp formatı hatalı (Örn: YYYY-MM-DD HH:mm:ss.sssZ).'), // ISO formatı doğru mu?
	v.custom((input) => {
		if (typeof input !== 'string') return false; // Giriş string değilse geçersiz

		// Date.parse ile de kontrol edilebilir ama new Date() genellikle yeterlidir.
		// Eğer Date constructor'ı string'i parse edemezse Invalid Date döner.
		// v.isoTimestamp bu durumu büyük ölçüde yakalamış olmalı ama ek bir kontrol.
		const dateObj = new Date(input); // Tarih mantıksal olarak geçerli mi?
		if (isNaN(dateObj.getTime())) return false; // Aslında buraya pek düşmemeli v.isoTimestamp sonrası

		if (dateObj < MIN_DATE || dateObj > MAX_DATE) {
			return false; // Eğer tarih aralığın dışındaysa, geçersiz.
		}

		// ISO string'den yıl, ay, gün, saat, dakika, saniye değerlerini alalım. Format: YYYY-MM-DD HH:mm:ss.sssZ
		const yearFromInput = parseInt(input.substring(0, 4), 10);
		const monthFromInput = parseInt(input.substring(5, 7), 10); // 1-12
		const dayFromInput = parseInt(input.substring(8, 10), 10);
		const hourFromInput = parseInt(input.substring(11, 13), 10);
		const minuteFromInput = parseInt(input.substring(14, 16), 10);
		const secondFromInput = parseInt(input.substring(17, 19), 10);

		// Date nesnesinden UTC değerleri alalım (ISO string genellikle UTC'dir)
		// Date.getUTCMonth() 0-indexed olduğu için +1 ekliyoruz.
		return (
			dateObj.getUTCFullYear() === yearFromInput &&
			dateObj.getUTCMonth() + 1 === monthFromInput &&
			dateObj.getUTCDate() === dayFromInput &&
			dateObj.getUTCHours() === hourFromInput &&
			dateObj.getUTCMinutes() === minuteFromInput &&
			dateObj.getUTCSeconds() === secondFromInput
		);
	}, 'Tarih geçerli bir takvim tarihi değil (Örn: 31 Haziran) veya Tarih 01.01.1900-31.12.2100 aralığında değil.')
);

// Bir iso tarih dizesini veya boş dizeyi doğrulamak için şema.
// "YYYY-MM-DD HH:mm:ss.sssZ" ya da "" gibi boş bir değer olabilir.
export const validDatetime = v.union([isoTimestampSchema, v.literal('')], (issue) => {
	// issue.issues dizisi, union içindeki her bir şemanın hata detayını içerir.
	// [ {validation: 'pipe', ...}, {validation: 'literal', ...} ] gibi.

	// Bizim için önemli olan `validIsoTimestampSchema`'dan (yani pipe'tan) gelen hatadır. Onu buluyoruz.
	const timestampIssue = issue.issues?.find((subIssue: any) => subIssue.validation !== 'literal');

	// Eğer timestamp hatasını bulduysak onun mesajını, bulamadıysak genel bir mesaj döndürüyoruz.
	return timestampIssue?.message || 'Geçersiz bir değer girildi.';
});

// İsteğe bağlı: Doğrulanmış string'i Date nesnesine dönüştürmek isterseniz:
const validIsoTimestampToDateObjectSchema = v.pipe(
	validDatetime, // Önceki tüm validasyonları uygula
	v.transform((input) => new Date(input)) // Sonra Date nesnesine çevir
);
// ######################################## END DATE VALIDATION SCHEMAS ##########################################

// ######################################## BEGIN TEXT VALIDATION SCHEMAS ########################################
const safeCharsRegex = /^[a-zA-Z0-9ÇçĞğİıÖöŞşÜü\s._()'!*:@,;+?-]*$/;
export const validTextNonTrim = v.pipe(
	v.string('Girdi string olmalı.'), // String mi?
	v.regex(safeCharsRegex, 'Girdi sadece harf, rakam ve belirli noktalama işaretleri içerebilir.'),
	v.maxLength(255, 'Lütfen en fazla 255 karakter girin.') // En fazla 255 karakter
);
export const validText = v.pipe(validTextNonTrim, v.trim());
// ######################################## END TEXT VALIDATION SCHEMAS ##########################################

// ######################################## BEGIN NUMBER VALIDATION SCHEMAS ########################################
/**
 * JavaScript'in bir sayıyı tamsayı olarak hassasiyetini kaybetmeden güvenli bir şekilde temsil edebileceği min/max değerler.
 * PocketBase'in float64 yapısıyla tam uyumludur.
 */
const JS_MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER; // 9007199254740991
const JS_MIN_SAFE_INTEGER = Number.MIN_SAFE_INTEGER; // -9007199254740991
const maxTwoDecimalPlacesRegex = /^-?\d+(\.\d{1,2})?$/; // Pozitif veya negatif, en fazla 2 ondalık basamaklı sayıları kontrol eden Regex
const maxFourDecimalPlacesRegex = /^-?\d+(\.\d{1,4})?$/; // Pozitif veya negatif, en fazla 4 ondalık basamaklı sayıları kontrol eden Regex

const validNumberSchema = v.pipe(
	v.number('Girdi sayı olmalı.'),
	v.minValue(JS_MIN_SAFE_INTEGER, 'Sayısal değer çok küçük.'),
	v.maxValue(JS_MAX_SAFE_INTEGER, 'Sayısal değer çok büyük.')
);

export const validInteger = v.pipe(validNumberSchema, v.integer('Girdi tamsayı olmalı.'));
export const validIntegerNonZero = v.pipe(validInteger, v.notValue(0, 'Girdi boş veya sıfır olamaz.'));

export const validTwoDecimal = v.pipe(
	validNumberSchema,
	v.custom((input) => maxTwoDecimalPlacesRegex.test(String(input)), 'Girdi en fazla 2 ondalık basamak içerebilir.')
);
export const validTwoDecimalNonZero = v.pipe(validTwoDecimal, v.notValue(0, 'Girdi boş veya sıfır olamaz.'));

export const validFourDecimal = v.pipe(
	validNumberSchema,
	v.custom((input) => maxFourDecimalPlacesRegex.test(String(input)), 'Girdi en fazla 4 ondalık basamak içerebilir.')
);
export const validFourDecimalNonZero = v.pipe(validFourDecimal, v.notValue(0, 'Girdi boş veya sıfır olamaz.'));
// ######################################## END NUMBER VALIDATION SCHEMAS ########################################

// ######################################## BEGIN STRING/ARRAY VALIDATION SCHEMAS ################################
// String'i array'e dönüştürme ve array'i valide etme şeması
const commaSeparatedStringToArraySchema = v.pipe(
	// 1. Adım: String giriş validasyonu
	v.string(),
	v.minLength(1, 'Lütfen en az bir karakter girin.'),
	// 2. Adım: String'den array'e dönüşüm
	v.transform((input) => (input.trim() === '' ? [] : input.split(',').map((item) => item.trim()))),
	// 3. Adım: Array validasyonu
	v.pipe(
		v.array(
			// Elemanlar için validasyon
			v.pipe(v.string(), v.minLength(1, 'Liste elemanı boş olamaz.')),
			'An array is required.'
		),
		// Array için validasyon opsiyonları
		v.minLength(1, 'Liste en az 1 eleman içermelidir.'),
		v.maxLength(3, 'Liste en fazla 3 eleman içermelidir.')
	)
);

// Daha esnek bir transform (boş stringleri filtreleyebilir)
const flexibleCommaSeparatedStringToArraySchema = v.pipe(
	// 1. Adım: String giriş validasyonu
	v.string(),
	v.minLength(1, 'Lütfen en az bir karakter girin.'),
	// 2. Adım: String'den array'e dönüşüm
	v.transform((inputString) => {
		if (inputString.trim() === '') {
			return [];
		}
		return inputString
			.split(',')
			.map((item) => item.trim())
			.filter((item) => item !== ''); // Boş stringleri filtrele
	}),
	// 3. Adım: Array validasyonu
	v.pipe(
		v.array(
			// Elemanlar için validasyon
			v.pipe(v.string(), v.minLength(1, 'Liste elemanı boş olamaz.')),
			'An array is required.'
		),
		// Array için validasyon opsiyonları
		v.minLength(1, 'Liste en az 1 eleman içermelidir.'),
		v.maxLength(3, 'Liste en fazla 3 eleman içermelidir.')
	)
);
// ######################################## END STRING/ARRAY VALIDATION SCHEMAS ################################
