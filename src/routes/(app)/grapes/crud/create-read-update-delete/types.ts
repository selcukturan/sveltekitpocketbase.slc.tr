import * as v from 'valibot';

export const pageQuerySchema = v.object({
	page: v.optional(v.fallback(v.number(), 1), 1),
	filter: v.optional(v.fallback(v.string(), 'ayse'), 'ayse'),
	sort: v.optional(v.fallback(v.picklist(['newest', 'oldest', 'price']), 'newest'), 'newest')
});

export type PageQuerySchemaType = v.InferOutput<typeof pageQuerySchema>;
