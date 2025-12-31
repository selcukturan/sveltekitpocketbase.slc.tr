import * as v from 'valibot';
import * as base from './base';

// ########################################## BEGIN FILE ######################################################
// #### SINGLE
// Optional
const _SingleFileOptional = () =>
	v.pipe(
		v.optional(v.string(), ''),
		v.transform(() => undefined)
	);
const _SingleFilePlusOptional = () =>
	v.pipe(
		v.optional(v.file()),
		v.transform((file) => (file ? file : undefined))
	);
const _SingleFileMinusOptional = () =>
	v.pipe(
		v.optional(v.string(), ''),
		v.transform(() => undefined)
	);
// Required
const _SingleFileRequired = () =>
	v.pipe(
		v.optional(v.string(), ''),
		v.nonEmpty('Bu alan gereklidir.'),
		v.transform(() => undefined)
	);
const _SingleFilePlusRequired = () =>
	v.pipe(
		v.optional(v.file()),
		v.transform((file) => (file ? file : undefined))
	);
const _SingleFileMinusRequired = () =>
	v.pipe(
		v.optional(v.string(), ''),
		v.transform(() => undefined)
	);

// #### MULTIPLE
// Optional
const _MultipleFileOptional = () =>
	v.pipe(
		v.optional(v.array(v.string()), []),
		v.minLength(0),
		v.transform(() => undefined)
	);
const _MultipleFilePlusOptional = () =>
	v.pipe(
		v.optional(v.array(v.file()), []),
		v.transform((arr) => (arr.length > 0 ? arr : undefined))
	);
const _MultipleFileMinusOptional = () =>
	v.pipe(
		v.optional(v.array(v.string()), []),
		v.transform((arr) => (arr.length > 0 ? arr : undefined))
	);

// Required
const _MultipleFileRequired = () =>
	v.pipe(
		v.optional(v.array(v.string()), []),
		v.minLength(1, 'En az 1 dosya seçilmelidir.'),
		v.transform(() => undefined)
	);
const _MultipleFilePlusRequired = () =>
	v.pipe(
		v.optional(v.array(v.file()), []),
		v.transform((arr) => (arr.length > 0 ? arr : undefined))
	);
const _MultipleFileMinusRequired = () =>
	v.pipe(
		v.optional(v.array(v.string()), []),
		v.transform((arr) => (arr.length > 0 ? arr : undefined))
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

	const main = required
		? multiple
			? _MultipleFileRequired()
			: _SingleFileRequired()
		: multiple
			? _MultipleFileOptional()
			: _SingleFileOptional();
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
// ########################################## END FILE ######################################################

// ########################################## BEGIN TEXT ######################################################
const _TextOptional = () => v.optional(base.text, '');
const _TextRequired = (message = 'Bu alan gereklidir.') => v.pipe(base.text, v.nonEmpty(message));

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
// ########################################## END TEXT ######################################################

// ########################################## BEGIN HIDDEN ######################################################
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
// ########################################## END HIDDEN ######################################################

// ########################################## BEGIN DATE ######################################################
export const dateRequired = ({ message = 'Geçerli bir tarih giriniz.' }: { message?: string } = {}) => {
	return v.pipe(base.date, v.nonEmpty(message));
};
export const dateOptional = () => {
	return v.optional(base.date, '');
};

const _DateOptional = () => v.optional(base.date, '');
const _DateRequired = (message = 'Bu alan gereklidir.') => v.pipe(base.date, v.nonEmpty(message));

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
// ########################################## END DATE ######################################################

// ########################################## BEGIN DATETIME ######################################################
const _DatetimeOptional = () => v.optional(base.datetime, '');
const _DatetimeRequired = (message = 'Bu alan gereklidir.') => v.pipe(base.datetime, v.nonEmpty(message));

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
// ########################################## END DATETIME ######################################################

// ########################################## BEGIN SELECT ######################################################
// Optional
const _SingleSelectOptional = ({ selectOptions = [] }: { selectOptions: string[] }) =>
	v.optional(v.picklist([...selectOptions, '']), '');
const _MultipleSelectOptional = ({ selectOptions = [] }: { selectOptions: string[] }) =>
	v.optional(v.array(v.picklist(selectOptions)), []);

// Required
const _SingleSelectRequired = ({
	selectOptions = [],
	message = 'Bu alan gereklidir.'
}: {
	selectOptions: string[];
	message?: string;
}) => v.pipe(v.optional(v.picklist([...selectOptions, '']), ''), v.nonEmpty(message));
const _MultipleSelectRequired = ({ selectOptions = [], minLength = 1 }: { selectOptions: string[]; minLength?: number }) => {
	const minLengthValue = minLength <= 0 ? 1 : minLength;
	return v.pipe(
		v.optional(v.array(v.picklist(selectOptions)), []),
		v.minLength(minLengthValue, 'Bu alan en az ' + minLengthValue + ' değer içermelidir.')
	);
};

type SingleSelectTypeOptional = ReturnType<typeof _SingleSelectOptional>;
type MultipleSelectTypeOptional = ReturnType<typeof _MultipleSelectOptional>;
type SingleSelectTypeRequired = ReturnType<typeof _SingleSelectRequired>;
type MultipleSelectTypeRequired = ReturnType<typeof _MultipleSelectRequired>;

// 2. Multiple durumuna göre tip seçen yardımcı tipler
type SelectChoice<Multiple extends boolean, Required extends boolean> = Required extends true
	? Multiple extends true
		? MultipleSelectTypeRequired
		: SingleSelectTypeRequired
	: Multiple extends true
		? MultipleSelectTypeOptional
		: SingleSelectTypeOptional;

// 3. Tekil fonksiyon
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
// ########################################## END SELECT ######################################################

// ########################################## BEGIN NUMBER ######################################################
// Required
const _NumberRequiredInteger = ({ message = 'Bu alan gereklidir. Tamsayı olmalıdır.' }: { message?: string } = {}) => {
	return v.pipe(
		base.integer,
		v.check((input) => input !== 0, message)
	);
};
const _NumberRequiredPositiveInteger = ({
	message = 'Bu alan gereklidir. Pozitif tamsayı olmalıdır.'
}: { message?: string } = {}) => {
	return v.pipe(base.integer, v.minValue(1, message));
};
const _NumberRequiredNegativeInteger = ({
	message = 'Bu alan gereklidir. Negatif tamsayı olmalıdır.'
}: { message?: string } = {}) => {
	return v.pipe(base.integer, v.maxValue(-1, message));
};
const _NumberRequiredDecimal = ({ message = 'Bu alan gereklidir.', step = 2 }: { message?: string; step?: number } = {}) => {
	const stepVal = step <= 0 ? 2 : step;
	return v.pipe(
		base.number,
		base.maxDecimalPlaces(stepVal),
		v.check((input) => input !== 0, message)
	);
};
const _NumberRequiredPositiveDecimal = ({
	message = 'Bu alan gereklidir. 0 dan büyük olmalıdır.',
	step = 2
}: { message?: string; step?: number } = {}) => {
	const stepVal = step <= 0 ? 2 : step;
	const minVal = Math.pow(10, -stepVal); // Örn: precision 2 için 10^-2 = 0.01
	return v.pipe(base.number, base.maxDecimalPlaces(stepVal), v.minValue(minVal, message));
};
const _NumberRequiredNegativeDecimal = ({
	message = 'Bu alan gereklidir. 0 dan küçük olmalıdır.',
	step = 2
}: { message?: string; step?: number } = {}) => {
	const stepVal = step <= 0 ? 2 : step;
	const maxVal = Math.pow(10, -stepVal) * -1; // Örn: precision 2 için 10^-2 = 0.01
	return v.pipe(base.number, base.maxDecimalPlaces(stepVal), v.maxValue(maxVal, message));
};
// Optional
const _NumberOptionalInteger = () => {
	return v.optional(base.integer, 0);
};
const _NumberOptionalPositiveInteger = () => {
	return v.optional(v.pipe(base.integer, v.minValue(0, 'Değer 0 veya daha büyük bir tamsayı olmalıdır.')), 0);
};
const _NumberOptionalNegativeInteger = () => {
	return v.optional(v.pipe(base.integer, v.maxValue(0, 'Değer 0 veya daha küçük bir tamsayı olmalıdır.')), 0);
};
const _NumberOptionalDecimal = ({ step = 2 }: { step?: number } = {}) => {
	const stepVal = step <= 0 ? 2 : step;
	return v.optional(v.pipe(base.number, base.maxDecimalPlaces(stepVal)), 0);
};
const _NumberOptionalPositiveDecimal = ({ step = 2 }: { step?: number } = {}) => {
	const stepVal = step <= 0 ? 2 : step;
	return v.optional(
		v.pipe(base.number, base.maxDecimalPlaces(stepVal), v.minValue(0, 'Sayısal değer 0 veya daha büyük olmalıdır.')),
		0
	);
};
const _NumberOptionalNegativeDecimal = ({ step = 2 }: { step?: number } = {}) => {
	const stepVal = step <= 0 ? 2 : step;
	return v.optional(
		v.pipe(base.number, base.maxDecimalPlaces(stepVal), v.maxValue(0, 'Sayısal değer 0 veya daha küçük olmalıdır.')),
		0
	);
};

type NumberRequiredInteger = ReturnType<typeof _NumberRequiredInteger>;
type NumberOptionalInteger = ReturnType<typeof _NumberOptionalInteger>;
type NumberRequiredDecimal = ReturnType<typeof _NumberRequiredDecimal>;
type NumberOptionalDecimal = ReturnType<typeof _NumberOptionalDecimal>;
type NumberRequiredPositiveDecimal = ReturnType<typeof _NumberRequiredPositiveDecimal>;
type NumberOptionalPositiveDecimal = ReturnType<typeof _NumberOptionalPositiveDecimal>;
type NumberRequiredNegativeDecimal = ReturnType<typeof _NumberRequiredNegativeDecimal>;
type NumberOptionalNegativeDecimal = ReturnType<typeof _NumberOptionalNegativeDecimal>;
type NumberRequiredPositiveInteger = ReturnType<typeof _NumberRequiredPositiveInteger>;
type NumberOptionalPositiveInteger = ReturnType<typeof _NumberOptionalPositiveInteger>;
type NumberRequiredNegativeInteger = ReturnType<typeof _NumberRequiredNegativeInteger>;
type NumberOptionalNegativeInteger = ReturnType<typeof _NumberOptionalNegativeInteger>;

type NumberTypeChoice<
	Type extends 'integer' | 'decimal',
	Sign extends 'positive' | 'negative' | 'both',
	Required extends boolean
> = Type extends 'integer'
	? // Integer types
		Sign extends 'positive'
		? Required extends true
			? NumberRequiredPositiveInteger
			: NumberOptionalPositiveInteger
		: Sign extends 'negative'
			? Required extends true
				? NumberRequiredNegativeInteger
				: NumberOptionalNegativeInteger
			: // Both (integer)
				Required extends true
				? NumberRequiredInteger
				: NumberOptionalInteger
	: // Decimal types
		Sign extends 'positive'
		? Required extends true
			? NumberRequiredPositiveDecimal
			: NumberOptionalPositiveDecimal
		: Sign extends 'negative'
			? Required extends true
				? NumberRequiredNegativeDecimal
				: NumberOptionalNegativeDecimal
			: // Both (decimal)
				Required extends true
				? NumberRequiredDecimal
				: NumberOptionalDecimal;

export function Number<
	Key extends string,
	Type extends 'integer' | 'decimal' = 'integer',
	Sign extends 'positive' | 'negative' | 'both' = 'both',
	Required extends boolean = true
>(key: Key, options: { type?: Type; sign?: Sign; step?: number; required?: Required; message?: string } = {}) {
	const { type = 'integer', sign = 'both', step = 0, required = true, message } = options;

	const main =
		type === 'integer'
			? // Integer types
				sign === 'positive'
				? required
					? _NumberRequiredPositiveInteger({ message })
					: _NumberOptionalPositiveInteger()
				: sign === 'negative'
					? required
						? _NumberRequiredNegativeInteger({ message })
						: _NumberOptionalNegativeInteger()
					: // Both (integer)
						required
						? _NumberRequiredInteger({ message })
						: _NumberOptionalInteger()
			: // Decimal types
				sign === 'positive'
				? required
					? _NumberRequiredPositiveDecimal({ step, message })
					: _NumberOptionalPositiveDecimal({ step })
				: sign === 'negative'
					? required
						? _NumberRequiredNegativeDecimal({ step, message })
						: _NumberOptionalNegativeDecimal({ step })
					: // Both (decimal)
						required
						? _NumberRequiredDecimal({ step, message })
						: _NumberOptionalDecimal({ step });

	return {
		[`${key}`]: main
	} as { [P in Key]: NumberTypeChoice<Type, Sign, Required> };
}
// ########################################## END NUMBER ######################################################
