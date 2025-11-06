import * as v from 'valibot';
import * as base from './base';

export const filterKeySchema = base.string;
export const filterValueSchema = base.allCurrentValue;

export const OperatorSchema = v.optional(v.fallback(base.operators, '~'), '~');

// 'condition' tipindeki bir nesnenin şeması
export const conditionSchema = v.object({
	type: v.literal('condition'),
	field: filterKeySchema,
	operator: OperatorSchema,
	value: filterValueSchema
});

// 'group' ve 'condition' tiplerini içeren ana şema.
// v.lazy() ile group'un kendi içinde tekrar edebilmesini sağlıyoruz.
export const filterSchema = v.lazy(
	(): ReturnType<typeof v.union> =>
		v.union([
			conditionSchema,
			v.object({
				type: v.literal('group'),
				operator: v.union([v.literal('&&'), v.literal('||')]),
				children: v.array(filterSchema)
			})
		])
);

export const pocketbaseFullListSchema = v.object({
	listOptions: v.object({
		sort: v.optional(base.string),
		expand: v.optional(base.string),
		fields: v.optional(base.string),
		skipTotal: v.optional(v.fallback(base.boolean, false), false)
	})
});

export const pocketbaseListSchema = v.object({
	page: v.optional(v.fallback(base.number, 1), 1),
	perPage: v.optional(v.fallback(base.number, 30), 30),
	...pocketbaseFullListSchema.entries
});

// Export Types
export type Condition = v.InferOutput<typeof conditionSchema>;
export type Filter = v.InferOutput<typeof filterSchema>;
// --------------------------------------------------------------------------------------------------------------------------------------------
export const pocketbaseOneSchema = v.object({
	id: v.optional(v.fallback(base.string, ''), ''),
	listOptions: v.object({
		expand: v.optional(base.string),
		fields: v.optional(base.string)
	})
});

/* 
const defaultConditions = {
	type: 'group',
	operator: '&&',
	children: []
}; 
*/

/*
const filterCondition = {
	type: 'group',
	operator: '&&',
	children: [
		{
			type: 'group',
			operator: '&&',
			children: [
				{
					type: 'condition',
					field: 'order',
					operator: '>',
					value: 9000
				},
				{
					type: 'condition',
					field: 'grape',
					operator: '~',
					value: 'Fiano'
				}
			]
		},
		{
			type: 'condition',
			field: 'title',
			operator: '~',
			value: 'ba'
		}
	]
};
*/
