/// <reference types="node" />
import { test, expect } from '@playwright/test';
import { createRequire } from 'node:module';
import { normalizeStringForTurkishSearch } from '../../src/lib/utils/common.ts';

// search_label iki yerde üretilir: kayıtta PocketBase hook'u (pb_hooks/utils.js), aramada remote fonksiyon
// (normalizeStringForTurkishSearch). İkisi aynı sonucu vermezse Türkçe arama sessizce bozulur.
const hooks = createRequire(import.meta.url)('../../.slc-production/pocketbase/pb_hooks/utils.js') as { normalizeSearch: (s: string) => string };

test('Türkçe arama normalizesi: hook kopyası ile uygulama fonksiyonu aynı', () => {
	const samples = ['ÖĞRENCİ IŞIKLARI', 'İstanbul', 'ıIiİ', 'Çağrı Şükrü Gülüş', 'Ana Sayfa', 'Oluştur, Oku, Güncelle, Sil', 'ÂÎÛ âîû', 'x-1 · 2', ''];
	for (const sample of samples) expect(hooks.normalizeSearch(sample), sample).toBe(normalizeStringForTurkishSearch(sample));
	expect(normalizeStringForTurkishSearch('ÖĞRENCİ IŞIKLARI')).toBe('ogrenci isiklari');
	expect(normalizeStringForTurkishSearch('İstanbul')).toBe(normalizeStringForTurkishSearch('istanbul'));
});
