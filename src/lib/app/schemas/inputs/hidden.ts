import * as v from 'valibot';
import * as base from '../base';

const _HiddenIdOptional = () => v.optional(base.id, '');
const _HiddenIdRequired = (message = 'Bu alan gereklidir.') => v.pipe(base.id, v.nonEmpty(message));
const _HiddenTextOptional = () => v.optional(base.text, '');
const _HiddenTextRequired = (message = 'Bu alan gereklidir.') => v.pipe(base.text, v.nonEmpty(message));

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

	const main = required
		? type === 'id'
			? _HiddenIdRequired(message)
			: _HiddenTextRequired(message)
		: type === 'id'
			? _HiddenIdOptional()
			: _HiddenTextOptional();

	return {
		[`${key}`]: main
	} as { [P in Key]: HiddenTypeChoice<Required, Type> };
}
