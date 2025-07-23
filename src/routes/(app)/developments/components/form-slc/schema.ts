import * as v from 'valibot';

export const myFirstFormSchema = v.pipe(
	v.object({
		text_optional: v.string()
	})
);

export type MyFirstForm = typeof myFirstFormSchema;

export type MyFirstFormx = v.InferInput<typeof myFirstFormSchema>;
