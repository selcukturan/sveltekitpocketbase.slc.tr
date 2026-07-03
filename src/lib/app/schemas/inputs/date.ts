import * as v from 'valibot';
import * as base from '../base';

const _DateOptional = () =>
	v.pipe(
		v.optional(base.date, ''),
		v.metadata({
			slc_required: false
		})
	);
const _DateRequired = (message = 'Bu alan gereklidir.') =>
	v.pipe(
		base.date,
		v.nonEmpty(message),
		v.metadata({
			slc_required: true
		})
	);

type DateOptional = ReturnType<typeof _DateOptional>;
type DateRequired = ReturnType<typeof _DateRequired>;

type DateTypeChoice<Required extends boolean> = Required extends true ? DateRequired : DateOptional;

export function date<Key extends string, Required extends boolean = true>(
	key: Key,
	options: { required?: Required; message?: string } = {}
) {
	const { required = true, message } = options;

	const main = required ? _DateRequired(message) : _DateOptional();

	return {
		[`${key}`]: main
	} as { [P in Key]: DateTypeChoice<Required> };
}
