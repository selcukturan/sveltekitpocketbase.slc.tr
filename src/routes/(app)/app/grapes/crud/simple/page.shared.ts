import * as v from 'valibot';
import * as input from '#lib/app/schemas/inputs/index.js';
import { Collections } from '#lib/types/pocketbase-types.js';
import { DemoCrudSelectOptionalMultipleOptions, DemoCrudSelectOptionalSingleOptions } from '#lib/types/pocketbase-types.js';
import { isValidSort } from '#lib/components/ui/datatable/utils/sort.js'; // saf fonksiyon (bileşen değil): sunucuda da kullanılır
import { defineFilters } from '#lib/components/ui/datatable/utils/filter.js'; // saf: sunucuda da kullanılır

// --------------------------------------------------------------------------------------------------------------------------------------------
export const oneParamsSchema = v.object({
	id: v.optional(v.fallback(v.string(), ''), ''),
	options: v.object({
		expand: v.optional(v.string()),
		fields: v.optional(v.string())
	}),
	timestamp: v.optional(v.fallback(v.number(), 0), 0)
});
export type OneParamsSchemaType = v.InferOutput<typeof oneParamsSchema>;
// --------------------------------------------------------------------------------------------------------------------------------------------

export const createFormSchema = v.object({
	...input.Text('text_required'),
	...input.Text('text_optional', { required: false }),
	...input.Select('select_optional_multiple', { required: false, multiple: true, values: Object.values(DemoCrudSelectOptionalMultipleOptions) }),
	...input.Select('select_optional_single', { required: false, values: Object.values(DemoCrudSelectOptionalSingleOptions) }),
	...input.Relation('relation_optional_multiple', { collection: Collections.DemoRelationInputMultiple, required: false, multiple: true }),
	...input.Relation('relation_optional_single', { collection: Collections.DemoRelationInputSingle, required: false }),
	...input.File('file_optional_multiple', { required: false, multiple: true }),
	...input.File('file_optional_single', { required: false, multiple: false }),
	...input.Bool('bool_optional'),
	...input.Date('date_optional', { required: false }),
	...input.Datetime('datetime_optional', { required: false }),
	...input.Email('email_optional', { required: false }),
	...input.Number('number_optional', { required: false }),
	...input.Textarea('textarea_optional', { required: false }),
	...input.Url('url_optional', { required: false })
});
export type CreateFormSchemaType = v.InferOutput<typeof createFormSchema>;

// Sıralanabilecek alanlar: form şemasındaki alanlar + PocketBase sistem alanları. Kolonları yeniden tanımlamaya gerek yok;
// form alanları kullanıcının zaten gördüğü alanlar olduğu için sıralamak bilgi sızdırmaz. Formda olmayan (iç) alanlara göre
// sıralama reddedilir. Çoklu sıralama: '-number_optional,text_required'.
export const SORTABLE_FIELDS: readonly string[] = [...Object.keys(createFormSchema.entries), 'id', 'created', 'updated'];

// Filtrelenebilecek alanlar ve türleri: tek tanım. Şema (sunucu doğrular), PocketBase filtresi (page.remote.ts) ve
// FilterBar arayüzü buradan üretilir; tanımda olmayan alana göre filtre gönderilemez.
export const FILTERS = defineFilters({
	text_required: 'text',
	text_optional: 'text',
	number_optional: 'number',
	date_optional: 'date',
	bool_optional: 'bool',
	select_optional_single: { type: 'select', options: Object.values(DemoCrudSelectOptionalSingleOptions) }
});

// Liste (tablo) parametreleri: SORTABLE_FIELDS'ten sonra, çünkü sıralama onunla doğrulanır
export const listParamsSchema = v.object({
	page: v.optional(v.fallback(v.pipe(v.number(), v.integer()), 1), 1),
	perPage: v.optional(v.fallback(v.pipe(v.number(), v.integer()), 30), 30),
	options: v.object({
		sort: v.optional(
			v.pipe(
				v.string(),
				v.check((sort) => isValidSort(sort, SORTABLE_FIELDS), 'Geçersiz sıralama alanı.')
			),
			'text_required'
		),
		expand: v.optional(v.string()),
		fields: v.optional(v.string()),
		skipTotal: v.optional(v.fallback(v.boolean(), false), false)
	}),
	filterData: FILTERS.schema,
	timestamp: v.optional(v.fallback(v.number(), 0), 0)
});
export type ListParamsSchemaType = v.InferOutput<typeof listParamsSchema>;

export const updateFormSchema = v.object({
	...input.Hidden('id'),
	...createFormSchema.entries
});
export type UpdateFormSchemaType = v.InferOutput<typeof updateFormSchema>;

export const deleteParamsSchema = v.object({
	...input.Hidden('id')
});
// Toplu silme (tabloda Delete / sağ tık menüsü); bir istekte en fazla 1000 kayıt
export const deleteManySchema = v.object({ ids: v.pipe(v.array(v.pipe(v.string(), v.nonEmpty())), v.minLength(1), v.maxLength(1000)) });
// --------------------------------------------------------------------------------------------------------------------------------------------

// --------------------------------------------------------------------------------------------------------------------------------------------
export const relationListParamsSchema = v.object({
	search: v.string(),
	collection: v.picklist([...Object.values(Collections)])
});
export type RelationListParamsSchemaType = v.InferOutput<typeof relationListParamsSchema>;

// --------------------------------------------------------------------------------------------------------------------------------------------
// Tablo içinde tek hücre düzenleme (DataTable onCellEdit). Alan başına doğrulama; değerler DataTable düzenleyicisinin
// verdiği tipte: metin string, sayı number|null, bool boolean, tarih 'YYYY-MM-DD'|null, liste string|null.
const cellId = { id: v.pipe(v.string(), v.nonEmpty()) };
export const cellEditSchema = v.variant('field', [
	v.object({ ...cellId, field: v.literal('text_required'), value: v.pipe(v.string(), v.trim(), v.nonEmpty('Bu alan zorunludur.')) }),
	v.object({ ...cellId, field: v.literal('text_optional'), value: v.pipe(v.string(), v.trim()) }),
	v.object({ ...cellId, field: v.literal('number_optional'), value: v.nullable(v.number()) }),
	v.object({ ...cellId, field: v.literal('bool_optional'), value: v.boolean() }),
	v.object({ ...cellId, field: v.literal('date_optional'), value: v.nullable(v.pipe(v.string(), v.isoDate())) }),
	v.object({ ...cellId, field: v.literal('select_optional_single'), value: v.nullable(v.picklist(Object.values(DemoCrudSelectOptionalSingleOptions))) })
]);
export type CellEditSchemaType = v.InferOutput<typeof cellEditSchema>;
// Toplu düzenleme (tabloya Ctrl+V ile yapıştırma); bir istekte en fazla 1000 hücre
export const cellsEditSchema = v.pipe(v.array(cellEditSchema), v.minLength(1), v.maxLength(1000));
