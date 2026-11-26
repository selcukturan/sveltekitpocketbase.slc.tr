import { test, expect } from '@playwright/test';
import { wallToUtc, utcToWall, dayRangeUtc, toPbDate, parsePbDate } from '../../src/lib/utils/timezone.ts';

// utils/timezone.ts (saf): tarayıcı açılmaz. Testi çalıştıran makinenin saat dilimi sonucu etkilememeli.
const IST = 'Europe/Istanbul'; // UTC+3, yaz saati yok
const NY = 'America/New_York'; // UTC-5 / yaz saatinde UTC-4

const iso = (d: Date | undefined) => d?.toISOString();

test('İstanbul: duvar saati ↔ UTC, gidiş-dönüş aynı', () => {
	expect(iso(wallToUtc('2026-09-02T02:00', IST))).toBe('2026-09-01T23:00:00.000Z');
	expect(utcToWall(new Date('2026-09-01T23:00:00.000Z'), IST)).toBe('2026-09-02T02:00');
	expect(iso(wallToUtc('2026-09-02', IST))).toBe('2026-09-01T21:00:00.000Z'); // gün başı
	for (const wall of ['2026-01-01T00:00', '2026-12-31T23:59', '2000-02-29T12:30']) {
		expect(utcToWall(wallToUtc(wall, IST)!, IST)).toBe(wall);
	}
});

test('New York: kış/yaz farkı, ileri alınan saat (olmayan an) ve geri alınan saat (iki kez yaşanan)', () => {
	expect(iso(wallToUtc('2026-01-15T10:00', NY))).toBe('2026-01-15T15:00:00.000Z'); // EST -5
	expect(iso(wallToUtc('2026-07-15T10:00', NY))).toBe('2026-07-15T14:00:00.000Z'); // EDT -4
	// 8 Mart 2026 02:00 → 03:00: 02:30 hiç yaşanmaz, ileri kayar (03:30 EDT = 07:30Z)
	expect(iso(wallToUtc('2026-03-08T02:30', NY))).toBe('2026-03-08T07:30:00.000Z');
	expect(utcToWall(wallToUtc('2026-03-08T02:30', NY)!, NY)).toBe('2026-03-08T03:30');
	// 1 Kasım 2026 02:00 → 01:00: 01:30 iki kez yaşanır, ilki (EDT) seçilir
	expect(iso(wallToUtc('2026-11-01T01:30', NY))).toBe('2026-11-01T05:30:00.000Z');
	// Gün aralığı yaz saati geçişinde 23 saat
	const [start, end] = dayRangeUtc('2026-03-08', NY)!;
	expect(iso(start)).toBe('2026-03-08T05:00:00.000Z');
	expect(iso(end)).toBe('2026-03-09T04:00:00.000Z');
});

test('geçersiz takvim değerleri reddedilir; PocketBase biçimi', () => {
	for (const bad of ['2026-02-31', '2026-02-29T10:00', '2026-13-01', '2026-01-01T24:00', '2026-01-01T10:60', '', 'abc', '2026-1-1']) {
		expect(wallToUtc(bad, IST), bad).toBeUndefined();
	}
	expect(toPbDate(new Date('2026-09-01T23:00:00.000Z'))).toBe('2026-09-01 23:00:00.000Z');
	expect(iso(parsePbDate('2026-09-01 23:00:00.000Z'))).toBe('2026-09-01T23:00:00.000Z');
	expect(parsePbDate('')).toBeUndefined();
	expect(parsePbDate(null)).toBeUndefined();
	// İstanbul'da 2 Eylül: [1 Eylül 21:00Z, 2 Eylül 21:00Z)
	const [start, end] = dayRangeUtc('2026-09-02', IST)!;
	expect([iso(start), iso(end)]).toEqual(['2026-09-01T21:00:00.000Z', '2026-09-02T21:00:00.000Z']);
	expect(dayRangeUtc('2026-02-30', IST)).toBeUndefined();
});
