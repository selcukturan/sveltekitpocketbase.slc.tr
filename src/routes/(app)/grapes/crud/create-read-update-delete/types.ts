import * as v from 'valibot';
import { filterSchema, pocketbaseListSchema } from '$lib/app/schemas/filter-conditions';
import * as base from '$lib/app/schemas/base';

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
			value: 0
		}
	]
};

export const listParamsSchema = v.object({
	filterData: v.object({
		title: v.optional(v.fallback(base.string, 'sel'), 'sel'),
		quantity: v.optional(v.fallback(base.number, 0), 0)
	}),
	filter: v.optional(v.fallback(filterSchema, templateConditions), templateConditions),
	...pocketbaseListSchema.entries
});

export type ListParamsSchemaType = v.InferOutput<typeof listParamsSchema>;
