/**
 * Sıralama metni (PocketBase biçimi): alanlar virgülle ayrılır, '-' azalan, ilk alan öncelikli.
 *   'text_required'                 → text_required artan
 *   '-number_optional,text_required' → önce number_optional azalan, sonra text_required artan
 * Tablo başlıkta düz tıklamayla tek kolona, Ctrl/⌘ + tıklamayla çoklu sıralama üretir (bkz. nextSort).
 */

export type SortDir = 'asc' | 'desc';
export type SortEntry = { field: string; dir: SortDir };

export const parseSort = (sort: string | undefined | null): SortEntry[] =>
	(sort ?? '')
		.split(',')
		.map((part) => part.trim())
		.filter((part) => part !== '' && part !== '-' && part !== '+')
		.map((part) => (part.startsWith('-') ? { field: part.slice(1), dir: 'desc' } : { field: part.replace(/^\+/, ''), dir: 'asc' }));

export const formatSort = (entries: SortEntry[]): string => entries.map((e) => (e.dir === 'desc' ? `-${e.field}` : e.field)).join(',');

/**
 * Başlığa tıklanınca yeni sıralama. Döngü: yok → artan → azalan → yok.
 * multi: false → yalnızca bu kolon (diğerleri bırakılır); true → diğerleri korunur, kolon yoksa sona eklenir.
 */
export const nextSort = (sort: string | undefined, field: string, multi: boolean): string => {
	const entries = parseSort(sort);
	const current = entries.find((e) => e.field === field);
	const next: SortDir | undefined = current === undefined ? 'asc' : current.dir === 'asc' ? 'desc' : undefined;
	if (!multi) return next ? formatSort([{ field, dir: next }]) : '';
	if (!current) return formatSort([...entries, { field, dir: 'asc' }]);
	return formatSort(next ? entries.map((e) => (e.field === field ? { field, dir: next } : e)) : entries.filter((e) => e.field !== field));
};

/**
 * Sunucu tarafı doğrulama için: her parça izin verilen alanlardan biri mi, alan tekrar ediyor mu.
 * Örn. valibot: v.check((s) => isValidSort(s, SORTABLE_FIELDS), 'Geçersiz sıralama')
 */
export const isValidSort = (sort: string, allowed: readonly string[]): boolean => {
	if (sort.trim() === '') return true;
	const parts = sort.split(',').map((p) => p.trim());
	const fields = parts.map((p) => p.replace(/^[-+]/, ''));
	return parts.every((p) => /^[-+]?[A-Za-z_][A-Za-z0-9_]*$/.test(p)) && fields.every((f) => allowed.includes(f)) && new Set(fields).size === fields.length;
};
