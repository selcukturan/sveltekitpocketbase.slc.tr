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
		...input.text('title', { required: false }),
		...input.number('quantity', { required: false })
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
	...input.hidden('id'),
	...input.text('title'),
	...input.number('quantity', { sign: 'negative' }),
	...input.datetime('purchase_date'),
	...input.select('select_single', { selectOptions: Object.values(TestDatatableSelectSingleOptions) }),
	...input.select('select_multiple', { multiple: true, selectOptions: Object.values(TestDatatableSelectMultipleOptions) }),
	...input.file('single_file', { required: false }),
	...input.file('multiple_files', { multiple: true, required: false })
});

export type UpdateFormSchemaType = v.InferOutput<typeof updateFormSchema>;
// --------------------------------------------------------------------------------------------------------------------------------------------
