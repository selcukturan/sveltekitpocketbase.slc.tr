import * as v from 'valibot';

/**
 * Liste filtreleri: tek tanımdan hem doğrulama şeması, hem güvenli PocketBase filtresi, hem de FilterBar arayüzü.
 * Saf modül (bileşen değil): page.shared.ts'te tanımlanır, sunucuda da kullanılır.
 *
 * Güvenlik: Filtrelenebilecek alanlar ve operatörler bu tanımla sınırlıdır (sıralamadaki SORTABLE_FIELDS gibi). Sunucu
 * gelen değerleri `schema` ile doğrular; `toPb` alan adlarını yalnızca tanımdan alır, değerleri yer tutucuya ({:f0})
 * koyar. İstemci ham filtre metni gönderemez.
 *
 * Değerler hep metindir, '' = filtre yok. Anahtarlar (list.filter / filterData):
 *   text   → alan             : içerir (~)
 *   number → alan__min/__max  : >= / <=
 *   date   → alan__min/__max  : 'YYYY-MM-DD', gün başı / gün sonu dahil
 *   bool   → alan             : 'true' | 'false'
 *   select → alan             : seçeneklerden biri (=)
 *
 * @example
 * // page.shared.ts
 * export const FILTERS = defineFilters({ text_required: 'text', number_optional: 'number', bool_optional: 'bool',
 *   select_optional_single: { type: 'select', options: Object.values(Options) } });
 * listParamsSchema = v.object({ ..., filterData: FILTERS.schema })
 * // page.remote.ts
 * getList(..., { filter: FILTERS.toPb(locals.pb, params.filterData) })
 * // +page.svelte
 * <dt.FilterBar {list} filters={FILTERS} {columns} />
 */

export type FilterType = 'text' | 'number' | 'date' | 'bool' | 'select';
export type FilterDef = Exclude<FilterType, 'select'> | { type: 'select'; options: readonly string[] };
export type FilterValues = Record<string, string>;

// FilterBar'ın çizdiği alan: hangi anahtarlara bağlanacağı
export type FilterField = { field: string; type: FilterType; options?: readonly string[]; keys: string[] };

// pb.filter(raw, params): PocketBase istemcisinin yer tutuculu filtre üreticisi
type PbFilter = { filter: (raw: string, params?: Record<string, unknown>) => string };

export const MIN = '__min';
export const MAX = '__max';

const FIELD_RE = /^[A-Za-z_][A-Za-z0-9_.]*$/; // tanımdaki alan adı (sunucu kodu); yine de denetlenir
const NUMBER_RE = /^-?\d+(?:[.,]\d+)?$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const text = () => v.optional(v.pipe(v.string(), v.trim()), '');
const matching = (re: RegExp, message: string) =>
	v.optional(
		v.pipe(
			v.string(),
			v.trim(),
			v.check((s) => s === '' || re.test(s), message)
		),
		''
	);
const oneOf = (values: readonly string[]) => v.optional(v.picklist(['', ...values]), '');

export function defineFilters<const T extends Record<string, FilterDef>>(defs: T) {
	const entries: Record<string, v.OptionalSchema<v.GenericSchema<string, string>, ''>> = {};
	const fields: FilterField[] = [];

	for (const [field, def] of Object.entries(defs)) {
		if (!FIELD_RE.test(field)) throw new Error(`Geçersiz filtre alanı: ${field}`);
		const type = typeof def === 'string' ? def : def.type;
		const options = typeof def === 'string' ? undefined : def.options;
		const range = type === 'number' || type === 'date';
		const keys = range ? [field + MIN, field + MAX] : [field];
		fields.push({ field, type, options, keys });

		if (type === 'text') entries[field] = text();
		else if (type === 'number') for (const key of keys) entries[key] = matching(NUMBER_RE, 'Geçersiz sayı.');
		else if (type === 'date') for (const key of keys) entries[key] = matching(DATE_RE, 'Geçersiz tarih.');
		else if (type === 'bool') entries[field] = oneOf(['true', 'false']);
		else entries[field] = oneOf(options ?? []);
	}

	const schema = v.object(entries);

	// Doğrulanmış değerlerden PocketBase filtresi; filtre yoksa ''
	const toPb = (pb: PbFilter, values: FilterValues): string => {
		const parts: string[] = [];
		const params: Record<string, unknown> = {};
		const param = (value: unknown) => {
			const key = `f${Object.keys(params).length}`;
			params[key] = value;
			return `{:${key}}`;
		};
		for (const { field, type } of fields) {
			if (type === 'number' || type === 'date') {
				const min = values[field + MIN] ?? '';
				const max = values[field + MAX] ?? '';
				const parse = (s: string) => (type === 'number' ? Number(s.replace(',', '.')) : s);
				if (min) parts.push(`${field} >= ${param(type === 'date' ? `${min} 00:00:00.000Z` : parse(min))}`);
				if (max) parts.push(`${field} <= ${param(type === 'date' ? `${max} 23:59:59.999Z` : parse(max))}`);
				continue;
			}
			const value = values[field] ?? '';
			if (!value) continue;
			if (type === 'text') parts.push(`${field} ~ ${param(value)}`);
			else if (type === 'bool') parts.push(`${field} = ${param(value === 'true')}`);
			else parts.push(`${field} = ${param(value)}`);
		}
		return parts.length ? pb.filter(parts.join(' && '), params) : '';
	};

	// Uygulanmış filtre sayısı (alan başına; aralığın iki ucu tek sayılır)
	const countActive = (values: FilterValues, types?: FilterType[]) =>
		fields.filter((f) => (!types || types.includes(f.type)) && f.keys.some((key) => (values[key] ?? '') !== '')).length;

	return { schema, fields, toPb, countActive };
}

export type Filters = ReturnType<typeof defineFilters>;
