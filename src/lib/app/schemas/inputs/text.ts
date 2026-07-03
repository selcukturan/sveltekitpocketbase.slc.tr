import * as v from 'valibot';
import * as base from '../base';

const _TextOptional = () =>
	v.pipe(
		v.optional(base.text, ''),
		v.metadata({
			slc_required: false
		})
	);
const _TextRequired = (message = 'Bu alan gereklidir.') =>
	v.pipe(
		base.text,
		v.nonEmpty(message),
		v.metadata({
			slc_required: true
		})
	);

type TextOptional = ReturnType<typeof _TextOptional>;
type TextRequired = ReturnType<typeof _TextRequired>;

type TextTypeChoice<Required extends boolean> = Required extends true ? TextRequired : TextOptional;

export function Text<Key extends string, Required extends boolean = true>(
	key: Key,
	options: { required?: Required; message?: string } = {}
) {
	const { required = true, message } = options;

	const main = required ? _TextRequired(message) : _TextOptional();

	return {
		[`${key}`]: main
	} as { [P in Key]: TextTypeChoice<Required> };
}
