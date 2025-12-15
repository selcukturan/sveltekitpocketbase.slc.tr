/**
 * #####################################################################################################################3
 * #####################################################################################################################3
 * ############################################### POCKETBASE ##########################################################3
 * #####################################################################################################################3
 * #####################################################################################################################3
 */
export function isFocusable(element: HTMLElement): boolean {
	const tagName = element && element.tagName ? element.tagName.toLowerCase() : '';

	return isInput(element) || tagName === 'button' || tagName === 'a' || tagName === 'details' || element?.tabIndex >= 0;
}

export function isInput(element: HTMLElement): boolean {
	const tagName = element && element.tagName ? element.tagName.toLowerCase() : '';

	return (
		tagName === 'input' ||
		tagName === 'select' ||
		tagName === 'textarea' ||
		element?.isContentEditable ||
		element?.classList.contains('slc-input')
	);
}

export function randomString(length?: number): string {
	length = length || 10;

	let result = '';
	const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	for (let i = 0; i < length; i++) {
		result += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
	}

	return result;
}

export function isObject(value: unknown): boolean {
	return value !== null && typeof value === 'object' && value.constructor === Object;
}

export function sentenize(str: string, stopCheck = true): string {
	if (typeof str !== 'string') {
		return '';
	}

	str = str.trim().split('_').join(' ');
	if (str === '') {
		return str;
	}

	str = str[0].toUpperCase() + str.substring(1);

	if (stopCheck) {
		// let lastChar = str[str.length - 1];
		const lastChar = str[str.length - 1];
		if (lastChar !== '.' && lastChar !== '?' && lastChar !== '!') {
			str += '.';
		}
	}

	return str;
}

/**
 * #####################################################################################################################3
 * #####################################################################################################################3
 * ############################################### SLC #################################################################3
 * #####################################################################################################################3
 * #####################################################################################################################3
 */

export const isBrowser: boolean = typeof document !== 'undefined';

export function turkishLowerCase(str: string): string {
	if (typeof str !== 'string') return '';
	return str.toLocaleLowerCase('tr-TR');
}

export function turkishUpperCase(str: string): string {
	if (typeof str !== 'string') return '';
	return str.toLocaleUpperCase('tr-TR');
}

export function chunkArray<T>(array: T[], chunkSize: number): T[][] {
	const chunks: T[][] = [];
	for (let i = 0; i < array.length; i += chunkSize) {
		chunks.push(array.slice(i, i + chunkSize));
	}
	return chunks;
}

export function validTC(tc: string): boolean {
	// olmali, string olmali, ilk rakam 0 olamaz, 11 karakter olmali
	if (!tc || typeof tc !== 'string' || tc[0] === '0' || tc.length !== 11) return false;

	let sum_1_3_5_7_9 = 0;
	let sum_2_4_6_8 = 0;
	let sum_first_10_char = 0;

	const impossible = [
		'11111111110',
		'22222222220',
		'33333333330',
		'44444444440',
		'55555555550',
		'66666666660',
		'77777777770',
		'88888888880',
		'99999999990'
	];

	const digits = tc.split('').map(Number);

	sum_1_3_5_7_9 = digits[0] + digits[2] + digits[4] + digits[6] + digits[8]; // 1. 3. 5. 7. ve 9. hanelerin toplami
	sum_2_4_6_8 = digits[1] + digits[3] + digits[5] + digits[7]; // 2. 4. 6. ve 8. hanelerin toplami
	sum_first_10_char = digits.slice(0, 10).reduce((acc, val) => acc + val, 0); // 10 hanenin toplami

	let mod_1 = (sum_1_3_5_7_9 * 7 - sum_2_4_6_8) % 10; // 1. 3. 5. 7. ve 9. hanelerin toplaminin 7 ile çarpimindan 2. 4. 6. ve 8. haneler cikartildiginda geriye kalan sayinin 10′a gore modu bize 10. haneyi verir.
	mod_1 = mod_1 < 0 ? mod_1 + 10 : mod_1; // mod sonucu negatif cikar ise, sonuc mod ile toplanir.( sonuc hatali cikar ise abs(10) ile topla )

	// mod_1 10. karaktere eşit olmalı
	if (mod_1 !== digits[9]) return false;

	let mod_2 = sum_first_10_char % 10; // kural 2 = 1. 2. 3. 4. 5. 6. 7. 8. 9. 10. hanelerin toplaminin 10′a gore modu bize 11. haneyi verir.
	mod_2 = mod_2 < 0 ? mod_2 + 10 : mod_2; // mod sonucu negatif cikar ise, sonuc mod ile toplanir.( sonuc hatali cikar ise abs(10) ile topla )

	// mod_2 11. karaktere esit olmali
	if (mod_2 !== digits[10]) return false;

	if (impossible.some((item) => tc === item)) return false;

	return true;
}

export function validIBAN(value: string): boolean {
	if (!value || typeof value !== 'string') return false; // value null, undefined veya string degilse false doner

	let iban = false; // IBAN gecerliligini belirten degisken, baslangicta false olarak ayarlanir.
	value = value.toUpperCase().trim(); // IBAN degerini buyuk harfe cevirir ve basindaki ve sonundaki bosluklari temizler.
	if (/^TR\d{7}0[A-Z0-9]{16}$/.test(value)) {
		// IBAN formatini kontrol eder. TR ile baslamali, ardindan 7 rakam, 0 ve 16 karakter (A-Z veya 0-9) gelmelidir.
		let sayi = value.slice(4, 26) + value.slice(0, 4); // IBAN'in 4. karakterinden 26. karakterine kadar olan kismini alir ve bastaki 4 karakteri sona ekler.
		sayi = sayi.replace(/[A-Z]/g, (char) => (char.charCodeAt(0) - 55).toString()); // Harfleri sayilara donusturur. A=10, B=11, ..., Z=35.
		iban = BigInt(sayi) % 97n === 1n; // Sayiyi 97'ye boler ve kalan 1 ise IBAN gecerlidir.
	}
	return iban; // IBAN gecerliligini doner.
}

/**
 * Bir string'i arama için normalize eder:
 * - Türkçe'ye uygun küçük harfe çevirir.
 * - Aksan/şapka gibi işaretleri kaldırır (örn: ş -> s, ö -> o).
 * Girdi: "ÖĞRENCİ IŞIKLARI"
 * Sonuç: Artık kullanıcı arama kutusuna ister "ogrenci", ister "Öğrenci", ister "ogrencı" yazsın,
 * hepsi aynı standart formda ("ogrenci isiklari") olarak dönüştürülür.
 */
export function normalizeStringForTurkishSearch(str: string): string {
	return str
		.normalize('NFD') // 1. Karakterleri ve aksanları ayır
		.replace(/[\u0300-\u036f]/g, '') // 2. Aksan işaretlerini kaldır
		.toLocaleLowerCase('tr-TR') // 3. Türkçe'ye uygun küçük harfe çevir
		.replace(/ı/g, 'i'); // 4. Tüm 'ı' harflerini 'i' yap
}
