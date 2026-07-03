import * as v from 'valibot';
import * as base from '../base';

const _BoolOptional = () => v.pipe(v.optional(base.bool, false), v.metadata({ slc_nonfalsey: false }));
const _BoolNonfalsey = (message = 'Bu alan gereklidir.') =>
	v.pipe(
		v.optional(base.bool, false),
		v.check((input) => input === true, 'Bu alan işaretlenmelidir (Onay vermelisiniz).'),
		v.metadata({ slc_nonfalsey: true })
	);

type BoolOptional = ReturnType<typeof _BoolOptional>;
type BoolNonfalsey = ReturnType<typeof _BoolNonfalsey>;

type BoolTypeChoice<Nonfalsey extends boolean> = Nonfalsey extends true ? BoolNonfalsey : BoolOptional;

export function Bool<Key extends string, Nonfalsey extends boolean = false>(
	key: Key,
	options: { nonfalsey?: Nonfalsey; message?: string } = {}
) {
	const { nonfalsey = false, message } = options;

	const main = nonfalsey ? _BoolNonfalsey(message) : _BoolOptional();

	return {
		[`${key}`]: main
	} as { [P in Key]: BoolTypeChoice<Nonfalsey> };
}
