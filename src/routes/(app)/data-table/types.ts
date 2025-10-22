import * as v from 'valibot';

export const pageQuerySchema = v.object({
	page: v.optional(v.number()),
	/* filter: v.optional(
		v.fallback(
			v.object({
				title: v.optional(v.string()),
				quantity: v.optional(v.number())
			}),
			{}
		),
		{}
	), */
	filter: v.optional(
		v.object({
			title: v.optional(v.string(), 'sel'),
			quantity: v.optional(v.number())
		})
	),
	sort: v.optional(v.string()),
	recordId: v.optional(v.string())
});

export type PageQuerySchemaType = v.InferOutput<typeof pageQuerySchema>;
