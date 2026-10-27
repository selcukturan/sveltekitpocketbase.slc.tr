import * as v from 'valibot';
import { errorKeys, inputMeta } from './meta';
import * as base from '../base';

// PocketBase "Bool" alanı: required
// - required: true olmalıdır (PocketBase'de zorunlu bool = işaretli)
type BoolOptions = { required?: boolean; message?: string };

const _Bool = ({ required = false, message = errorKeys.requiredTrue }: BoolOptions = {}) =>
	v.pipe(
		v.optional(base.bool, false),
		v.check((input) => !required || input === true, message),
		inputMeta({ required })
	);

export function Bool<Key extends string>(key: Key, options: BoolOptions = {}) {
	return {
		[`${key}`]: _Bool(options)
	} as { [P in Key]: ReturnType<typeof _Bool> };
}
