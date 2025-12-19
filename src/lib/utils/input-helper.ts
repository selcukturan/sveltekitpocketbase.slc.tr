import * as v from 'valibot';

// --------------------------------------------------------------------------------------------------------------------------
// "2025-11-21 10:00:00.000Z" -> "2025-11-21"
export function formatDateIsoToInput(isoString: string) {
	if (!isoString) return '';
	return isoString.slice(0, 10);
}
// "2025-11-21" -> "2025-11-21 00:00:00.000Z"
export function parseDateInputToIso(localDateTime: string) {
	if (!localDateTime) return ''; // Input boşsa boş döndür.
	// Olası zaman dilimi belirsizliklerini önlemek amacıyla,
	// UTC gece yarısı olarak ayrıştırıldığından emin olmak için saat ve UTC göstergesi eklenir.
	const dateCandidate = new Date(`${localDateTime} 00:00:00.000Z`);
	if (isNaN(dateCandidate.getTime())) {
		return ''; // Geçersiz tarih ise boş string döndür.
	}

	// Overflow check (e.g. 2025-02-31 -> 2025-03-03)
	const year = parseInt(localDateTime.substring(0, 4), 10);
	const month = parseInt(localDateTime.substring(5, 7), 10);
	const day = parseInt(localDateTime.substring(8, 10), 10);

	if (
		dateCandidate.getUTCFullYear() !== year ||
		dateCandidate.getUTCMonth() + 1 !== month ||
		dateCandidate.getUTCDate() !== day
	) {
		return '';
	}

	return dateCandidate.toISOString().replace('T', ' ');
}
// --------------------------------------------------------------------------------------------------------------------------
// "2025-11-21 10:00:00.000Z" -> "2025-11-21T10:00"
export function formatDatetimeIsoToInput(isoString: string) {
	if (!isoString) return '';
	return isoString.slice(0, 16).replace(' ', 'T');
}
// "2025-11-21T10:00" -> "2025-11-21 10:00:00.000Z"
export function parseDatetimeInputToIso(localDateTime: string) {
	if (!localDateTime) return ''; // Input boşsa boş döndür.

	// Input'tan gelen değere 'Z' ekleyerek, bunun yerel saat değil,
	// UTC olduğunu belirtiyoruz. Bu, zaman dilimi kaymalarını önler.
	const dateCandidate = new Date(`${localDateTime}Z`);
	if (isNaN(dateCandidate.getTime())) {
		return ''; // Geçersiz tarih ise boş string döndür.
	}

	// Overflow check (e.g. 2025-02-31 -> 2025-03-03)
	const year = parseInt(localDateTime.substring(0, 4), 10);
	const month = parseInt(localDateTime.substring(5, 7), 10);
	const day = parseInt(localDateTime.substring(8, 10), 10);
	const hour = parseInt(localDateTime.substring(11, 13), 10);
	const minute = parseInt(localDateTime.substring(14, 16), 10);

	if (
		dateCandidate.getUTCFullYear() !== year ||
		dateCandidate.getUTCMonth() + 1 !== month ||
		dateCandidate.getUTCDate() !== day ||
		dateCandidate.getUTCHours() !== hour ||
		dateCandidate.getUTCMinutes() !== minute
	) {
		return '';
	}

	return dateCandidate.toISOString().replace('T', ' ');
}

// --------------------------------------------------------------------------------------------------------------------------

const MIN_DATE = new Date('1900-01-01T00:00:00.000Z');
const MAX_DATE = new Date('2200-12-31T23:59:59.999Z');

export function isValidIsoDate(input: unknown): boolean {
	if (typeof input !== 'string') return false;
	if (input === '') return true; // Boş string geçerli (optional)

	// ISO format kontrolü
	const isoCheck = v.safeParse(v.pipe(v.string(), v.isoTimestamp()), input);
	if (!isoCheck.success) return false;

	const dateObj = new Date(input);
	if (isNaN(dateObj.getTime())) return false;

	if (dateObj < MIN_DATE || dateObj > MAX_DATE) {
		return false;
	}

	// Mantıksal tarih kontrolü (örn: 31 Şubat kontrolü)
	// ISO string'den yıl, ay, gün, saat, dakika, saniye değerlerini alalım. Format: YYYY-MM-DD HH:mm:ss.sssZ
	const yearFromInput = parseInt(input.substring(0, 4), 10); // 1900-2200
	const monthFromInput = parseInt(input.substring(5, 7), 10); // 1-12
	const dayFromInput = parseInt(input.substring(8, 10), 10); // 1-31
	const hourFromInput = parseInt(input.substring(11, 13), 10); // 0-23
	const minuteFromInput = parseInt(input.substring(14, 16), 10); // 0-59
	const secondFromInput = parseInt(input.substring(17, 19), 10); // 0-59

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
}
