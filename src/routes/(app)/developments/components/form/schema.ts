import * as v from 'valibot';

export const myFirstFormSchema = v.pipe(
	v.object({
		text_optional: v.optional(v.pipe(v.string(), v.maxLength(15, 'Alan en fazla 15 karakter olmalıdır.'))),
		text_required: v.pipe(
			v.string('Alan gereklidir.1'), // undefined ise burası çalışır.
			v.nonEmpty('Alan gereklidir.2'), // "" ise burası çalışır.
			v.minLength(3, 'Alan en az 3 karakter olmalıdır.'),
			v.maxLength(15, 'Alan en fazla 15 karakter olmalıdır.')
		),
		date_optional: v.optional(
			v.pipe(
				v.string('Girdi bir metin olmalıdır.'),
				v.transform((validatedString) => {
					// Eğer metnin uzunluğu tam ISO formatının uzunluğuna eşitse...
					// "2025-07-25T00:00:00.000Z".length
					if (validatedString.length === 24) {
						// ...ilk 10 karakterini alarak (YYYY-AA-GG) sadeleştir.
						return validatedString.slice(0, 10);
					} else {
						// ...değilse (yani sadece tarih formatındaysa), onu bir Date nesnesine
						// çevirip .toISOString() ile tam formata genişlet.
						return validatedString;
					}
				})
			)
		),
		datetime_optional: v.optional(v.pipe(v.string('Girdi bir metin olmalıdır.')))
	})
);

export type MyFirstForm = typeof myFirstFormSchema;

export type MyFirstFormx = v.InferInput<typeof myFirstFormSchema>;
