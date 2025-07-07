import * as v from 'valibot';
import { validIsoTimestampSchema } from '$lib/client/app/valibot-schemas';

export const myFirstFormSchema = v.pipe(
	v.object({
		text_optional: v.optional(v.pipe(v.string(), v.maxLength(15, 'Alan en fazla 15 karakter olmalıdır.'))),
		text_required: v.pipe(
			v.string('Alan gereklidir.'), // undefined ise burası çalışır.
			v.nonEmpty('Alan boş olamaz.'), // "" ise burası çalışır.
			v.minLength(3, 'Alan en az 3 karakter olmalıdır.'),
			v.maxLength(15, 'Alan en fazla 15 karakter olmalıdır.')
		),
		date_optional: v.optional(validIsoTimestampSchema),
		datetime_optional: v.optional(validIsoTimestampSchema)
	})
);

export type MyFirstForm = typeof myFirstFormSchema;

export type MyFirstFormx = v.InferInput<typeof myFirstFormSchema>;
