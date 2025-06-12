import * as v from 'valibot';

export const myFirstFormSchema = v.pipe(
	v.object({
		text_optional: v.optional(v.pipe(v.string(), v.maxLength(15, 'Alan en fazla 15 karakter olmalıdır.'))),
		text_required: v.pipe(
			v.string('Alan gereklidir.1'), // undefined ise burası çalışır.
			v.nonEmpty('Alan gereklidir.2'), // "" ise burası çalışır.
			v.minLength(3, 'Alan en az 3 karakter olmalıdır.'),
			v.maxLength(15, 'Alan en fazla 15 karakter olmalıdır.')
		)
	})
);

export type MyFirstForm = typeof myFirstFormSchema;

export type MyFirstFormx = v.InferInput<typeof myFirstFormSchema>;
