// Saat dilimi yardımcıları (saf, bağımlılıksız: sunucuda, tarayıcıda ve testlerde çalışır).
//
// Model:
// - datetime (fatura saati, doğum saati): gerçek an. PocketBase'de UTC tutulur; kullanıcıya UYGULAMA saat diliminde
//   (config.timezone) gösterilir ve o saat diliminde girilir. Tarayıcının saat dilimi kullanılmaz: sunucudaki filtreler,
//   raporlar ve her tarayıcı aynı sonucu üretir. Başka bir kurulum yalnızca config.timezone'u değiştirir.
// - date (doğum tarihi, fatura tarihi): saat dilimi olmayan takvim günü. 'YYYY-MM-DD 00:00:00.000Z' tutulur ve
//   çevrilmeden gösterilir (timeZone: 'UTC'); her yerde aynı gün.
//
// "Duvar saati" (wall): bir saat dilimindeki takvim + saat, 'YYYY-MM-DDTHH:mm' (datetime-local input biçimi).

const pad = (n: number) => String(n).padStart(2, '0');

// Saat dilimi başına tek biçimlendirici (her çağrıda kurmak yavaş)
const formatters = new Map<string, Intl.DateTimeFormat>();
const partsFormatter = (timeZone: string) => {
	let f = formatters.get(timeZone);
	if (!f) {
		f = new Intl.DateTimeFormat('en-US', {
			timeZone,
			hourCycle: 'h23',
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit'
		});
		formatters.set(timeZone, f);
	}
	return f;
};

// Bir anın o saat dilimindeki takvim/saat parçaları
function wallParts(date: Date, timeZone: string) {
	const parts: Record<string, number> = {};
	for (const { type, value } of partsFormatter(timeZone).formatToParts(date)) if (type !== 'literal') parts[type] = Number(value);
	return { year: parts.year, month: parts.month, day: parts.day, hour: parts.hour, minute: parts.minute, second: parts.second };
}

// Saat diliminin o andaki UTC farkı (ms). İstanbul: +3 saat → 10_800_000
export function offsetMs(date: Date, timeZone: string): number {
	const p = wallParts(date, timeZone);
	const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
	return asUtc - Math.floor(date.getTime() / 1000) * 1000;
}

const WALL_RE = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2}))?)?$/;

/**
 * Duvar saati → gerçek an. 'YYYY-MM-DD' (gün başı) ya da 'YYYY-MM-DDTHH:mm[:ss]'.
 * Geçersiz takvim değeri (31 Şubat, 25:00) → undefined.
 * Yaz saati: ileri alınan saatte olmayan an (02:30) bir sonraki geçerli ana, iki kez yaşanan saatte ilkine çözülür.
 */
export function wallToUtc(wall: string, timeZone: string): Date | undefined {
	const m = WALL_RE.exec(wall.trim());
	if (!m) return undefined;
	const [year, month, day, hour, minute, second] = [m[1], m[2], m[3], m[4] ?? '0', m[5] ?? '0', m[6] ?? '0'].map(Number);
	const guess = Date.UTC(year, month - 1, day, hour, minute, second);
	const check = new Date(guess);
	if (check.getUTCFullYear() !== year || check.getUTCMonth() !== month - 1 || check.getUTCDate() !== day) return undefined;
	if (hour > 23 || minute > 59 || second > 59) return undefined;
	// Fark ana göre değişir (yaz saati). Geçişten önceki ve sonraki farkla iki aday:
	// - ikisi de geçerli (geri alınan saat, iki kez yaşanır) → erken olan
	// - biri geçerli → o
	// - hiçbiri (ileri alınan saat, hiç yaşanmaz) → önceki farkla bulunan (saat ileri kayar: 02:30 → 03:30)
	const HOUR12 = 12 * 3600 * 1000;
	const before = guess - offsetMs(new Date(guess - HOUR12), timeZone);
	const after = guess - offsetMs(new Date(guess + HOUR12), timeZone);
	const valid = [before, after].filter((t) => t + offsetMs(new Date(t), timeZone) === guess);
	return new Date(valid.length ? Math.min(...valid) : before);
}

/** Gerçek an → duvar saati 'YYYY-MM-DDTHH:mm' (datetime-local input değeri). */
export function utcToWall(date: Date, timeZone: string): string {
	const p = wallParts(date, timeZone);
	return `${p.year}-${pad(p.month)}-${pad(p.day)}T${pad(p.hour)}:${pad(p.minute)}`;
}

/** PocketBase tarih metni ('2026-09-02 02:00:00.000Z' ya da ISO 'T') → Date; boş/geçersiz → undefined. */
export function parsePbDate(value: unknown): Date | undefined {
	if (typeof value !== 'string' || value === '') return undefined;
	const d = new Date(value.replace(' ', 'T'));
	return Number.isNaN(d.getTime()) ? undefined : d;
}

/** Date → PocketBase biçimi '2026-09-01 23:00:00.000Z'. */
export const toPbDate = (date: Date) => date.toISOString().replace('T', ' ');

/** 'YYYY-MM-DD' gününün o saat dilimindeki aralığı: [gün başı, ertesi gün başı) — bitiş hariç. */
export function dayRangeUtc(day: string, timeZone: string): [Date, Date] | undefined {
	const start = wallToUtc(day, timeZone);
	if (!start) return undefined;
	const [y, m, d] = day.split('-').map(Number);
	const next = new Date(Date.UTC(y, m - 1, d + 1));
	const end = wallToUtc(`${next.getUTCFullYear()}-${pad(next.getUTCMonth() + 1)}-${pad(next.getUTCDate())}`, timeZone)!;
	return [start, end];
}
