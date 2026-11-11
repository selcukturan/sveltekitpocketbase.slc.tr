import * as v from 'valibot';
import { errorKeys, inputMeta } from './meta';
import * as base from '../base';

// Gizli alanlar UI'da hata göstermez; mesajlar diğer alanlarla tutarlı olsun diye çeviri anahtarıdır.
const _HiddenIdOptional = () => v.pipe(v.optional(base.id, ''), inputMeta({ required: false }));
const _HiddenIdRequired = (message: string = errorKeys.required) => v.pipe(base.id, v.nonEmpty(message), inputMeta({ required: true }));
const _HiddenTextOptional = () => v.pipe(v.optional(v.pipe(base.text, v.maxLength(255, errorKeys.maxLength)), ''), inputMeta({ required: false, max: 255 }));
const _HiddenTextRequired = (message: string = errorKeys.required) =>
	v.pipe(base.text, v.nonEmpty(message), v.maxLength(255, errorKeys.maxLength), inputMeta({ required: true, max: 255 }));

type HiddenIdOptional = ReturnType<typeof _HiddenIdOptional>;
type HiddenIdRequired = ReturnType<typeof _HiddenIdRequired>;
type HiddenTextOptional = ReturnType<typeof _HiddenTextOptional>;
type HiddenTextRequired = ReturnType<typeof _HiddenTextRequired>;

type HiddenTypeChoice<Required extends boolean, Type extends 'id' | 'text' = 'id'> = Required extends true
	? Type extends 'id'
		? HiddenIdRequired
		: HiddenTextRequired
	: Type extends 'id'
		? HiddenIdOptional
		: HiddenTextOptional;

export function Hidden<Key extends string, Type extends 'id' | 'text' = 'id', Required extends boolean = true>(
	key: Key,
	options: { required?: Required; type?: Type; message?: string } = {}
) {
	const { required = true, type = 'id', message } = options;

	const main = required ? (type === 'id' ? _HiddenIdRequired(message) : _HiddenTextRequired(message)) : type === 'id' ? _HiddenIdOptional() : _HiddenTextOptional();

	return {
		[`${key}`]: main
	} as { [P in Key]: HiddenTypeChoice<Required, Type> };
}
