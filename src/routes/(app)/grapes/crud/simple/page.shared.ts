import * as v from 'valibot';
import * as input from '$lib/app/schemas/inputs';
import { Collections } from '$lib/types/pocketbase-types';

// --------------------------------------------------------------------------------------------------------------------------------------------
export const listParamsSchema = v.object({
	filter: v.optional(v.string()),
	page: v.optional(v.fallback(v.pipe(v.number(), v.integer()), 1), 1),
	perPage: v.optional(v.fallback(v.pipe(v.number(), v.integer()), 30), 30),
	options: v.object({
		sort: v.optional(v.string()),
		expand: v.optional(v.string()),
		fields: v.optional(v.string()),
		skipTotal: v.optional(v.fallback(v.boolean(), false), false)
	}),
	filterData: v.object({
		...input.Text('text_required', { required: false }),
		...input.Text('text_optional', { required: false })
	})
});
export type ListParamsSchemaType = v.InferOutput<typeof listParamsSchema>;
// --------------------------------------------------------------------------------------------------------------------------------------------
export const oneParamsSchema = v.object({
	id: v.optional(v.fallback(v.string(), ''), ''),
	options: v.object({
		expand: v.optional(v.string()),
		fields: v.optional(v.string())
	})
});
export type OneParamsSchemaType = v.InferOutput<typeof oneParamsSchema>;
// --------------------------------------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------------------------------

// ...pocketbaseUpdateSchema.entries
export const updateFormSchema = v.object({
	...input.Hidden('id'),
	...input.Text('text_required'),
	...input.Text('text_optional', { required: false })
});

export type UpdateFormSchemaType = v.InferOutput<typeof updateFormSchema>;
// --------------------------------------------------------------------------------------------------------------------------------------------

// --------------------------------------------------------------------------------------------------------------------------------------------
export const relationListParamsSchema = v.object({
	search: v.string(),
	collection: v.picklist([...Object.values(Collections)])
});
export type RelationListParamsSchemaType = v.InferOutput<typeof relationListParamsSchema>;
