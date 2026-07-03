import * as v from 'valibot';
import * as base from '../base';

const _DatetimeOptional = () =>
	v.pipe(
		v.optional(base.datetime, ''),
		v.metadata({
			slc_required: false
		})
	);
const _DatetimeRequired = (message = 'Bu alan gereklidir.') =>
	v.pipe(
		base.datetime,
		v.nonEmpty(message),
		v.metadata({
			slc_required: true
		})
	);

type DatetimeOptional = ReturnType<typeof _DatetimeOptional>;
type DatetimeRequired = ReturnType<typeof _DatetimeRequired>;

type DatetimeTypeChoice<Required extends boolean> = Required extends true ? DatetimeRequired : DatetimeOptional;

export function Datetime<Key extends string, Required extends boolean = true>(
	key: Key,
	options: { required?: Required; message?: string } = {}
) {
	const { required = true, message } = options;

	const main = required ? _DatetimeRequired(message) : _DatetimeOptional();

	return {
		[`${key}`]: main
	} as { [P in Key]: DatetimeTypeChoice<Required> };
}
