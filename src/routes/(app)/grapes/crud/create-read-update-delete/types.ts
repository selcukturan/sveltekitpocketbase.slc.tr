import * as v from 'valibot';
import { filterSchema, pocketbaseListSchema, pocketbaseOneSchema } from '$lib/app/schemas/filter-conditions';
import * as base from '$lib/app/schemas/base';
// --------------------------------------------------------------------------------------------------------------------------------------------
const templateConditions = {
	type: 'group',
	operator: '&&',
	children: [
		{
			type: 'condition',
			field: 'title',
			operator: '~',
			value: ''
		},
		{
			type: 'condition',
			field: 'quantity',
			operator: '>',
			value: ''
		}
	]
};
// --------------------------------------------------------------------------------------------------------------------------------------------
export const listParamsSchema = v.object({
	filterData: v.object({
		title: v.optional(v.fallback(base.string, 'sel'), 'sel'),
		quantity: v.optional(v.fallback(base.number, 0), 0)
	}),
	filter: v.optional(v.fallback(filterSchema, templateConditions), templateConditions),
	...pocketbaseListSchema.entries
});
export type ListParamsSchemaType = v.InferOutput<typeof listParamsSchema>;
// --------------------------------------------------------------------------------------------------------------------------------------------
export const oneParamsSchema = pocketbaseOneSchema;
export type OneParamsSchemaType = v.InferOutput<typeof oneParamsSchema>;
// --------------------------------------------------------------------------------------------------------------------------------------------
export const updateParamsSchema = v.object({
	id: v.pipe(base.id, v.nonEmpty('required')), // required - boş olmayan string
	title: v.pipe(base.string, v.nonEmpty('required')), // required - boş olmayan string
	quantity: v.pipe(base.number, v.integer(), v.minValue(1)), // required - 0'dan büyük pozitif tam sayı
	purchase_date: v.pipe(base.date, v.nonEmpty('required')) // required - boş olmayan string
	/* ...pocketbaseUpdateSchema.entries */
});
export type UpdateParamsSchemaType = v.InferOutput<typeof updateParamsSchema>;
