import * as v from 'valibot';

export const formSchema = v.pipe(
	v.object({
		text_optional: v.pipe(
			v.string('You must enter a first name.'),
			v.nonEmpty('First name is required.'),
			v.minLength(3, 'firstName must be at least 3 characters.')
		)
	})
);

export type FormSchema = v.InferInput<typeof formSchema>;
