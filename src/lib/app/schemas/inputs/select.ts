import * as v from 'valibot';

// Optional
const _SingleSelectOptional = ({ selectOptions = [] }: { selectOptions: string[] }) =>
	v.pipe(
		v.optional(v.picklist([...selectOptions, '']), ''),
		v.metadata({
			slc_required: false
		})
	);

const _MultipleSelectOptional = ({ selectOptions = [] }: { selectOptions: string[] }) =>
	v.pipe(
		v.fallback(v.array(v.picklist(selectOptions)), []),
		v.metadata({
			slc_required: false
		})
	);

// Required
const _SingleSelectRequired = ({
	selectOptions = [],
	message = 'Bu alan gereklidir.'
}: {
	selectOptions: string[];
	message?: string;
}) =>
	v.pipe(
		v.optional(v.picklist([...selectOptions, '']), ''),
		v.nonEmpty(message),
		v.metadata({
			slc_required: true
		})
	);

const _MultipleSelectRequired = ({ selectOptions = [], minLength = 1 }: { selectOptions: string[]; minLength?: number }) => {
	const minLengthValue = minLength <= 0 ? 1 : minLength;
	return v.pipe(
		v.fallback(v.array(v.picklist(selectOptions)), []),
		v.minLength(minLengthValue, 'Bu alan en az ' + minLengthValue + ' değer içermelidir.'),
		v.metadata({
			slc_required: true
		})
	);
};

type SingleSelectTypeOptional = ReturnType<typeof _SingleSelectOptional>;
type MultipleSelectTypeOptional = ReturnType<typeof _MultipleSelectOptional>;
type SingleSelectTypeRequired = ReturnType<typeof _SingleSelectRequired>;
type MultipleSelectTypeRequired = ReturnType<typeof _MultipleSelectRequired>;

type SelectChoice<Multiple extends boolean, Required extends boolean> = Required extends true
	? Multiple extends true
		? MultipleSelectTypeRequired
		: SingleSelectTypeRequired
	: Multiple extends true
		? MultipleSelectTypeOptional
		: SingleSelectTypeOptional;

export function Select<Key extends string, Multiple extends boolean = false, Required extends boolean = true>(
	key: Key,
	options: { multiple?: Multiple; required?: Required; selectOptions?: string[]; minLength?: number; message?: string } = {}
) {
	const { multiple = false, required = true, selectOptions = [], minLength = 1, message } = options;

	const main = required
		? multiple
			? _MultipleSelectRequired({ selectOptions, minLength })
			: _SingleSelectRequired({ selectOptions, message })
		: multiple
			? _MultipleSelectOptional({ selectOptions })
			: _SingleSelectOptional({ selectOptions });

	return {
		[`${key}`]: main
	} as { [P in Key]: SelectChoice<Multiple, Required> };
}
