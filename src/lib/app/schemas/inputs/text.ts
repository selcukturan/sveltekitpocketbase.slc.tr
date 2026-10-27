import * as v from 'valibot';
import { errorKeys, inputMeta } from './meta';
import * as base from '../base';

// PocketBase "Plain text" alanı: required, min length, max length
// - required: boş olamaz
// - min: yalnızca değer girildiyse kontrol edilir (boş + isteğe bağlı alan geçerlidir)
// - max: PocketBase'de 0 = varsayılan 5000; burada varsayılan 255
type TextOptions = { required?: boolean; min?: number; max?: number; message?: string };

const _Text = ({ required = true, min = 0, max = 255, message = errorKeys.required }: TextOptions = {}) =>
	v.pipe(
		v.optional(base.text, ''),
		v.check((input) => !required || input !== '', message),
		v.check((input) => input === '' || input.length >= min, errorKeys.minLength),
		v.maxLength(max, errorKeys.maxLength),
		inputMeta({ required, min, max })
	);

export function Text<Key extends string>(key: Key, options: TextOptions = {}) {
	return {
		[`${key}`]: _Text(options)
	} as { [P in Key]: ReturnType<typeof _Text> };
}
