import { dev } from '$app/env';
import { numberFormat, fixedDigitsOptions, NUMBER_2 } from './format.js';

/**
 * Footer değerleri.
 *
 * - Kısayollar: `sum(n)`, `avg(n)`, `min(n)`, `max(n)`, `count()` — kolonun **yüklü satırlardaki** (bu sayfa) değerleri
 *   üzerinden hesaplanır. n: ondalık basamak; verilirse tam n (sum(2) → 1.682,85), verilmezse en fazla 2, sondaki
 *   sıfırsız (sum() → 1.682,8). Sayılar uygulamanın diline göre biçimlenir. Boş ve sayı olmayan değerler atlanır
 *   (avg yalnızca sayısal değerlerin ortalaması); hiç sayı yoksa boş. count() boş olmayan değerleri sayar.
 * - Fonksiyon: `(items) => değer` — kalıbın yetmediği durumlar (ağırlıklı ortalama, koşullu sayım...). Sonuç sayıysa
 *   kısayollar gibi biçimlenir.
 * - Diğer her değer olduğu gibi metin olarak gösterilir (örn. 'Toplam' ya da sunucudan gelen genel toplam).
 */

export type AggregateFn = 'sum' | 'avg' | 'min' | 'max' | 'count';
export type Aggregate = { fn: AggregateFn; digits: number | undefined };

const AGGREGATE_RE = /^\s*(sum|avg|min|max|count)\(\s*(\d*)\s*\)\s*$/;
const LOOKS_LIKE_CALL_RE = /^\s*[a-z]+\s*\(.*\)?\s*$/i; // "summ(2)", "sum(2" gibi yazım hataları

const warned: string[] = [];

export const parseAggregate = (value: unknown): Aggregate | undefined => {
	if (typeof value !== 'string') return undefined;
	const match = AGGREGATE_RE.exec(value);
	if (match) return { fn: match[1] as AggregateFn, digits: match[2] === '' ? undefined : Number(match[2]) };
	// Geliştirmede: kısayola benzeyip uymayan değer metin olarak gösterilir, bir kez uyarılır
	if (dev && LOOKS_LIKE_CALL_RE.test(value) && !warned.includes(value)) {
		warned.push(value);
		console.warn(`[DataTable] footer "${value}" kısayol değil, metin olarak gösteriliyor. Geçerli: sum(n), avg(n), min(n), max(n), count()`);
	}
	return undefined;
};

export const aggregate = (fn: AggregateFn, items: readonly Record<string, unknown>[], field: string): number | undefined => {
	if (fn === 'count') return items.filter((row) => row[field] !== null && row[field] !== undefined && row[field] !== '').length;
	const numbers: number[] = [];
	for (const row of items) {
		const value = row[field];
		if (typeof value === 'number' && Number.isFinite(value)) numbers.push(value);
	}
	if (numbers.length === 0) return undefined;
	switch (fn) {
		case 'sum':
			return numbers.reduce((a, b) => a + b, 0);
		case 'avg':
			return numbers.reduce((a, b) => a + b, 0) / numbers.length;
		case 'min':
			return Math.min(...numbers);
		case 'max':
			return Math.max(...numbers);
	}
};

export const formatAggregate = (value: number, digits: number | undefined, locale: string) =>
	numberFormat(locale, digits === undefined ? NUMBER_2 : fixedDigitsOptions(digits)).format(value);
