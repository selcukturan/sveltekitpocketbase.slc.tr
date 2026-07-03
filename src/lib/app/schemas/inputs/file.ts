import * as v from 'valibot';

// ########################################## BEGIN FILE ######################################################
// #### SINGLE
// Optional
const _SingleFileOptional = () =>
	v.optional(
		v.pipe(
			v.string(),
			v.transform(() => undefined),
			v.metadata({
				slc_required: false
			})
		),
		undefined
	);
const _SingleFilePlusOptional = () =>
	v.optional(
		v.pipe(
			v.file(),
			v.transform((file) => (file ? file : undefined)),
			v.metadata({
				slc_required: false
			})
		),
		undefined
	);

const _SingleFileMinusOptional = () =>
	v.optional(
		v.pipe(
			v.string(),
			v.transform((str) => (str !== '' ? str : undefined)),
			v.metadata({
				slc_required: false
			})
		),
		undefined
	);

// Required
const _SingleFileRequired = () =>
	v.pipe(
		v.string(),
		v.nonEmpty('Bu alan gereklidir.'),
		v.transform(() => undefined),
		v.metadata({
			slc_required: true
		})
	);
const _SingleFilePlusRequired = () =>
	v.pipe(
		v.optional(v.file()),
		v.transform((file) => (file ? file : undefined)),
		v.metadata({
			slc_required: true
		})
	);
const _SingleFileMinusRequired = () =>
	v.pipe(
		v.optional(v.string(), ''),
		v.transform((str) => (str !== '' ? str : undefined)),
		v.metadata({
			slc_required: true
		})
	);

// #### MULTIPLE
// Optional
const _MultipleFileOptional = () =>
	v.optional(
		v.pipe(
			v.fallback(v.array(v.string()), []),
			v.minLength(0),
			v.transform(() => undefined),
			v.metadata({
				slc_required: false
			})
		),
		undefined
	);
const _MultipleFilePlusOptional = () =>
	v.optional(
		v.pipe(
			v.fallback(v.array(v.file()), []),
			v.transform((arr) => (arr.length > 0 ? arr : undefined)),
			v.metadata({
				slc_required: false
			})
		),
		undefined
	);
const _MultipleFileMinusOptional = () =>
	v.optional(
		v.pipe(
			v.fallback(v.array(v.string()), []),
			v.transform((arr) => (arr.length > 0 ? arr : undefined)),
			v.metadata({
				slc_required: false
			})
		),
		undefined
	);

// Required
const _MultipleFileRequired = () =>
	v.pipe(
		v.fallback(v.array(v.string()), []),
		v.minLength(1, 'En az 1 dosya seçilmelidir.'),
		v.transform(() => undefined),
		v.metadata({
			slc_required: true
		})
	);
const _MultipleFilePlusRequired = () =>
	v.pipe(
		v.fallback(v.array(v.file()), []),
		v.transform((arr) => (arr.length > 0 ? arr : undefined)),
		v.metadata({
			slc_required: true
		})
	);
const _MultipleFileMinusRequired = () =>
	v.pipe(
		v.fallback(v.array(v.string()), []),
		v.transform((arr) => (arr.length > 0 ? arr : undefined)),
		v.metadata({
			slc_required: true
		})
	);

// #### SINGLE
// Optional
type SingleFileTypeOptional = ReturnType<typeof _SingleFileOptional>;
type SingleFilePlusTypeOptional = ReturnType<typeof _SingleFilePlusOptional>;
type SingleFileMinusTypeOptional = ReturnType<typeof _SingleFileMinusOptional>;
// Required
type SingleFileTypeRequired = ReturnType<typeof _SingleFileRequired>;
type SingleFilePlusTypeRequired = ReturnType<typeof _SingleFilePlusRequired>;
type SingleFileMinusTypeRequired = ReturnType<typeof _SingleFileMinusRequired>;
// #### MULTIPLE
// Optional
type MultipleFileTypeOptional = ReturnType<typeof _MultipleFileOptional>;
type MultipleFilePlusTypeOptional = ReturnType<typeof _MultipleFilePlusOptional>;
type MultipleFileMinusTypeOptional = ReturnType<typeof _MultipleFileMinusOptional>;
// Required
type MultipleFileTypeRequired = ReturnType<typeof _MultipleFileRequired>;
type MultipleFilePlusTypeRequired = ReturnType<typeof _MultipleFilePlusRequired>;
type MultipleFileMinusTypeRequired = ReturnType<typeof _MultipleFileMinusRequired>;

type FileTypeChoice<Multiple extends boolean, Required extends boolean> = Required extends true
	? Multiple extends true
		? MultipleFileTypeRequired
		: SingleFileTypeRequired
	: Multiple extends true
		? MultipleFileTypeOptional
		: SingleFileTypeOptional;
type FilePlusTypeChoice<Multiple extends boolean, Required extends boolean> = Required extends true
	? Multiple extends true
		? MultipleFilePlusTypeRequired
		: SingleFilePlusTypeRequired
	: Multiple extends true
		? MultipleFilePlusTypeOptional
		: SingleFilePlusTypeOptional;
type FileMinusTypeChoice<Multiple extends boolean, Required extends boolean> = Required extends true
	? Multiple extends true
		? MultipleFileMinusTypeRequired
		: SingleFileMinusTypeRequired
	: Multiple extends true
		? MultipleFileMinusTypeOptional
		: SingleFileMinusTypeOptional;

export function File<Key extends string, Multiple extends boolean = false, Required extends boolean = true>(
	key: Key,
	options: { multiple?: Multiple; required?: Required } = {}
) {
	const { multiple = false, required = true } = options;

	const main = required ? (multiple ? _MultipleFileRequired() : _SingleFileRequired()) : multiple ? _MultipleFileOptional() : _SingleFileOptional();
	const plus = required
		? multiple
			? _MultipleFilePlusRequired()
			: _SingleFilePlusRequired()
		: multiple
			? _MultipleFilePlusOptional()
			: _SingleFilePlusOptional();
	const minus = required
		? multiple
			? _MultipleFileMinusRequired()
			: _SingleFileMinusRequired()
		: multiple
			? _MultipleFileMinusOptional()
			: _SingleFileMinusOptional();

	return {
		[`${key}`]: main,
		[`${key}_Plus`]: plus,
		[`${key}_Minus`]: minus
	} as { [P in Key]: FileTypeChoice<Multiple, Required> } & { [P in `${Key}_Plus`]: FilePlusTypeChoice<Multiple, Required> } & {
		[P in `${Key}_Minus`]: FileMinusTypeChoice<Multiple, Required>;
	};
}
