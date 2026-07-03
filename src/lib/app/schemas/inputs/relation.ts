import * as v from 'valibot';

// Optional
const _RelationSingleOptional = () =>
	v.pipe(
		v.optional(v.string(), ''),
		v.metadata({
			slc_required: false
		})
	);

const _RelationMultipleOptional = () =>
	v.pipe(
		v.fallback(v.array(v.string()), []),
		v.metadata({
			slc_required: false
		})
	);

// Required
const _RelationSingleRequired = ({ message = 'Bu alan gereklidir.' }: { message?: string }) =>
	v.pipe(
		v.optional(v.string(), ''),
		v.nonEmpty(message),
		v.metadata({
			slc_required: true
		})
	);

const _RelationMultipleRequired = ({ minLength = 1 }: { minLength?: number }) => {
	const minLengthValue = minLength <= 0 ? 1 : minLength;
	return v.pipe(
		v.fallback(v.array(v.string()), []),
		v.minLength(minLengthValue, 'Bu alan en az ' + minLengthValue + ' değer içermelidir.'),
		v.metadata({
			slc_required: true
		})
	);
};

type RelationSingleSelectTypeOptional = ReturnType<typeof _RelationSingleOptional>;
type RelationMultipleSelectTypeOptional = ReturnType<typeof _RelationMultipleOptional>;
type RelationSingleSelectTypeRequired = ReturnType<typeof _RelationSingleRequired>;
type RelationMultipleSelectTypeRequired = ReturnType<typeof _RelationMultipleRequired>;

type RelationSelectChoice<Multiple extends boolean, Required extends boolean> = Required extends true
	? Multiple extends true
		? RelationMultipleSelectTypeRequired
		: RelationSingleSelectTypeRequired
	: Multiple extends true
		? RelationMultipleSelectTypeOptional
		: RelationSingleSelectTypeOptional;

export function Relation<Key extends string, Multiple extends boolean = false, Required extends boolean = true>(
	key: Key,
	options: { multiple?: Multiple; required?: Required; minLength?: number; message?: string } = {}
) {
	const { multiple = false, required = true, minLength = 1, message } = options;

	const main = required
		? multiple
			? _RelationMultipleRequired({ minLength })
			: _RelationSingleRequired({ message })
		: multiple
			? _RelationMultipleOptional()
			: _RelationSingleOptional();

	return {
		[`${key}`]: main
	} as { [P in Key]: RelationSelectChoice<Multiple, Required> };
}
