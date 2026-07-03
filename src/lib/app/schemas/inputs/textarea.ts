import * as v from 'valibot';
import * as base from '../base';

const _TextareaOptional = () => v.pipe(v.optional(base.textarea, ''), v.metadata({ slc_required: false }));
const _TextareaRequired = (message = 'Bu alan gereklidir.') =>
	v.pipe(base.textarea, v.nonEmpty(message), v.metadata({ slc_required: true }));

type TextareaOptional = ReturnType<typeof _TextareaOptional>;
type TextareaRequired = ReturnType<typeof _TextareaRequired>;

type TextareaTypeChoice<Required extends boolean> = Required extends true ? TextareaRequired : TextareaOptional;

export function Textarea<Key extends string, Required extends boolean = true>(
	key: Key,
	options: { required?: Required; message?: string } = {}
) {
	const { required = true, message } = options;

	const main = required ? _TextareaRequired(message) : _TextareaOptional();

	return {
		[`${key}`]: main
	} as { [P in Key]: TextareaTypeChoice<Required> };
}
