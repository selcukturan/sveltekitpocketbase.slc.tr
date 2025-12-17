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
		title: input.textOptional(),
		quantity: input.numberOptionalPositiveInteger()
	}),
	filter: v.optional(v.fallback(filterSchema, templateConditions), templateConditions),
	...pocketbaseListSchema.entries
});
export type ListParamsSchemaType = v.InferOutput<typeof listParamsSchema>;
// --------------------------------------------------------------------------------------------------------------------------------------------
export const oneParamsSchema = pocketbaseOneSchema;
export type OneParamsSchemaType = v.InferOutput<typeof oneParamsSchema>;
// --------------------------------------------------------------------------------------------------------------------------------------------

export const updateFormSchema = v.object({
	id: input.hiddenIdRequired(),
	title: input.textOptional(),
	quantity: input.numberRequiredNegativeInteger(),
	purchase_date: input.datetimeRequired(),
	select_single: input.selectOptionalSingle({
		options: Object.values(TestDatatableSelectSingleOptions)
	}),
	select_multiple: input.selectOptionalMultiple({
		options: Object.values(TestDatatableSelectMultipleOptions)
	})
	/* ...pocketbaseUpdateSchema.entries */
});
export type UpdateFormSchemaType = v.InferOutput<typeof updateFormSchema>;
// --------------------------------------------------------------------------------------------------------------------------------------------
