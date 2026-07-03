import * as v from 'valibot';
import * as base from '../base';

const _EmailOptional = () => v.pipe(v.optional(base.email, ''), v.metadata({ slc_required: false }));
const _EmailRequired = (message = 'Bu alan gereklidir.') =>
	v.pipe(base.email, v.nonEmpty(message), v.metadata({ slc_required: true }));

type EmailOptional = ReturnType<typeof _EmailOptional>;
type EmailRequired = ReturnType<typeof _EmailRequired>;

type EmailTypeChoice<Required extends boolean> = Required extends true ? EmailRequired : EmailOptional;

export function Email<Key extends string, Required extends boolean = true>(
	key: Key,
	options: { required?: Required; message?: string } = {}
) {
	const { required = true, message } = options;

	const main = required ? _EmailRequired(message) : _EmailOptional();

	return {
		[`${key}`]: main
	} as { [P in Key]: EmailTypeChoice<Required> };
}
