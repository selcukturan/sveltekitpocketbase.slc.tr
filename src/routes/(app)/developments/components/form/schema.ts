import * as v from 'valibot';

export const myFirstFormSchema = v.pipe(
	v.object({
		text_optional: v.pipe(
			v.string('You must enter a text_optional.'),
			v.nonEmpty('text_optional is required.'),
			v.minLength(3, 'text_optional must be at least 3 characters.')
		)
	})
);

export type MyFirstForm = typeof myFirstFormSchema;

export type MyFirstFormx = v.InferInput<typeof myFirstFormSchema>;
