import * as v from 'valibot';
import * as input from '#lib/app/schemas/inputs/index.js';
import { Collections } from '#lib/types/pocketbase-types.js';
import { DemoCrudSelectOptionalMultipleOptions, DemoCrudSelectOptionalSingleOptions } from '#lib/types/pocketbase-types.js';
import { defineTable } from '#lib/components/ui/datatable/utils/table.js'; // saf (bileşen değil): sunucuda da kullanılır

// --------------------------------------------------------------------------------------------------------------------------------------------
// Tek kayıt: istemciden yalnızca id (ve önbelleği aşmak için timestamp). expand/fields gerekiyorsa sunucuda sabit
// verilir; istemci ilişkili koleksiyonları açamaz (bkz. TABLE.listParamsSchema).
export const oneParamsSchema = v.object({
	id: v.pipe(v.string(), v.nonEmpty()),
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

// Tablo tanımı: kolonlar ve kolon başına izinler tek yerde (bkz. datatable/utils/table.ts).
// Sunucunun kabul ettiği sıralama alanları, filtreler ve hücre düzenlemeleri yalnızca buradaki işaretlerden türer
// (sortable / filter / edit, hepsi opt-in). Sayfa kolonları TABLE.columnsFor<Item>() ile alır; sunumu ezebilir, izin veremez.
const singleOptions = Object.values(DemoCrudSelectOptionalSingleOptions);
export const TABLE = defineTable({
	defaultSort: '-number_optional,text_required',
	columns: {
		id: { label: 'dt_id', width: 'minmax(50px,1fr)', sortable: true },
		text_required: {
			label: 'dt_text_required',
			width: 'minmax(50px,1fr)',
			sortable: true,
			filter: true,
			edit: v.pipe(v.string(), v.trim(), v.nonEmpty('Bu alan zorunludur.'))
		},
		text_optional: { label: 'dt_text_optional', width: 'minmax(50px,1fr)', sortable: true, filter: true, edit: true },
		number_optional: { label: 'dt_number_optional', type: 'number', width: '130px', sortable: true, filter: true, edit: true },
		select_optional_single: { label: 'dt_select_optional_single', width: '150px', options: singleOptions, sortable: true, filter: true, edit: true },
		select_optional_multiple: { label: 'dt_select_optional_multiple', type: 'list', width: '180px', sortable: true },
		date_optional: { label: 'dt_date_optional', type: 'date', width: '130px', sortable: true, filter: true, edit: true },
		datetime_optional: { label: 'dt_datetime_optional', type: 'datetime', width: '170px', sortable: true, filter: true, edit: true },
		bool_optional: { label: 'dt_bool_optional', type: 'bool', width: '120px', sortable: true, filter: true, edit: true },
		updated: { label: 'dt_updated', type: 'datetime', width: '170px', sortable: true }
	}
});
export type ListParamsSchemaType = v.InferOutput<typeof TABLE.listParamsSchema>;

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
