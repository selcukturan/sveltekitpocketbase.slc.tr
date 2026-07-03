import * as v from 'valibot';
import * as base from '../base';

const _UrlOptional = () => v.pipe(v.optional(base.url, ''), v.metadata({ slc_required: false }));
const _UrlRequired = (message = 'Bu alan gereklidir.') =>
	v.pipe(base.url, v.nonEmpty(message), v.metadata({ slc_required: true }));

type UrlOptional = ReturnType<typeof _UrlOptional>;
type UrlRequired = ReturnType<typeof _UrlRequired>;

type UrlTypeChoice<Required extends boolean> = Required extends true ? UrlRequired : UrlOptional;

export function Url<Key extends string, Required extends boolean = true>(
	key: Key,
	options: { required?: Required; message?: string } = {}
) {
	const { required = true, message } = options;

	const main = required ? _UrlRequired(message) : _UrlOptional();

	return {
		[`${key}`]: main
	} as { [P in Key]: UrlTypeChoice<Required> };
}
