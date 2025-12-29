import * as v from 'valibot';
import * as input from '$lib/app/schemas/inputs';
import { filterSchema, pocketbaseListSchema, pocketbaseOneSchema } from '$lib/app/schemas/filter-conditions';
import { TestDatatableSelectSingleOptions, TestDatatableSelectMultipleOptions } from '$lib/types/pocketbase-types';

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
		...input.Text('title', { required: false }),
		...input.Number('quantity', { required: false })
	}),
	filter: v.optional(v.fallback(filterSchema, templateConditions), templateConditions),
	...pocketbaseListSchema.entries
});
export type ListParamsSchemaType = v.InferOutput<typeof listParamsSchema>;
// --------------------------------------------------------------------------------------------------------------------------------------------
export const oneParamsSchema = pocketbaseOneSchema;
export type OneParamsSchemaType = v.InferOutput<typeof oneParamsSchema>;
// --------------------------------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------------------------------

// ...pocketbaseUpdateSchema.entries
export const updateFormSchema = v.object({
	...input.Hidden('id'),
	...input.Text('title'),
	...input.Number('quantity', { sign: 'negative' }),
	...input.Datetime('purchase_date'),
	...input.Select('select_single', { selectOptions: Object.values(TestDatatableSelectSingleOptions) }),
	...input.Select('select_multiple', { multiple: true, selectOptions: Object.values(TestDatatableSelectMultipleOptions) }),
	/* ...input.File('single_file', { required: true }), */
	...input.File('multiple_files', { multiple: true, required: true })
});

export type UpdateFormSchemaType = v.InferOutput<typeof updateFormSchema>;
// --------------------------------------------------------------------------------------------------------------------------------------------
