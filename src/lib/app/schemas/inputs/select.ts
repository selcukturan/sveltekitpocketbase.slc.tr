import * as v from 'valibot';
import { errorKeys, inputMeta } from './meta';

// PocketBase "Select" alanı: required, values, (multiple) max select
// - values: geçerli seçenekler; UI seçenek listesi de buradan gelir
// - geçersiz değer reddedilir (sessizce boşaltılmaz)
type SelectOptions<Multiple extends boolean> = { required?: boolean; multiple?: Multiple; values: readonly string[]; maxSelect?: number; message?: string };

const _SelectSingle = ({ required = true, values, message = errorKeys.required }: SelectOptions<false>) =>
	v.pipe(
		v.optional(v.string(), ''),
		v.check((input) => !required || input !== '', message),
		v.check((input) => input === '' || values.includes(input), errorKeys.invalidOption),
		inputMeta({ required, multiple: false, values: [...values] })
	);

const _SelectMultiple = ({ required = true, values, maxSelect, message = errorKeys.required }: SelectOptions<true>) =>
	v.pipe(
		v.optional(v.array(v.string()), []),
		v.check((input) => !required || input.length > 0, message),
		v.check((input) => input.every((item) => values.includes(item)), errorKeys.invalidOption),
		v.check((input) => maxSelect === undefined || input.length <= maxSelect, errorKeys.maxSelect),
		inputMeta({ required, multiple: true, values: [...values], maxSelect })
	);

type SelectChoice<Multiple extends boolean> = Multiple extends true ? ReturnType<typeof _SelectMultiple> : ReturnType<typeof _SelectSingle>;

export function Select<Key extends string, Multiple extends boolean = false>(key: Key, options: SelectOptions<Multiple>) {
	const main = options.multiple ? _SelectMultiple(options as SelectOptions<true>) : _SelectSingle(options as SelectOptions<false>);

	return {
		[`${key}`]: main
	} as { [P in Key]: SelectChoice<Multiple> };
}
