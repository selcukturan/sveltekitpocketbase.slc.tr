import * as v from 'valibot';
import {
	validText,
	validDatetime,
	validInteger,
	validIntegerNonZero,
	validTwoDecimal,
	validTwoDecimalNonZero
} from '$lib/client/app/valibot-schemas';

export const myFirstFormSchema = v.pipe(
	v.object({
		text_optional: v.optional(validText),
		text_required: validText,
		date_optional: v.optional(validDatetime),
		date_required: validDatetime,
		datetime_optional: v.optional(validDatetime),
		datetime_required: validDatetime,
		integer_number_optional: v.optional(validInteger),
		integer_number_required: validIntegerNonZero,
		decimal_number_optional: v.optional(validTwoDecimal),
		decimal_number_required: validTwoDecimalNonZero
	})
);

export type MyFirstForm = typeof myFirstFormSchema;

export type MyFirstFormx = v.InferInput<typeof myFirstFormSchema>;
