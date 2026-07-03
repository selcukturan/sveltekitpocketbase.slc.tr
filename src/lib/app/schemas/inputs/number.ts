import * as v from 'valibot';
import * as base from '../base';

// Required
const _NumberRequiredInteger = ({ message = 'Bu alan gereklidir. Tamsayı olmalıdır.' }: { message?: string } = {}) => {
	return v.pipe(
		base.integer,
		v.check((input) => input !== 0, message),
		v.metadata({
			slc_required: true
		})
	);
};
const _NumberRequiredPositiveInteger = ({
	message = 'Bu alan gereklidir. Pozitif tamsayı olmalıdır.'
}: { message?: string } = {}) => {
	return v.pipe(
		base.integer,
		v.minValue(1, message),
		v.metadata({
			slc_required: true
		})
	);
};
const _NumberRequiredNegativeInteger = ({
	message = 'Bu alan gereklidir. Negatif tamsayı olmalıdır.'
}: { message?: string } = {}) => {
	return v.pipe(
		base.integer,
		v.maxValue(-1, message),
		v.metadata({
			slc_required: true
		})
	);
};
const _NumberRequiredDecimal = ({ message = 'Bu alan gereklidir.', step = 2 }: { message?: string; step?: number } = {}) => {
	const stepVal = step <= 0 ? 2 : step;
	return v.pipe(
		base.number,
		base.maxDecimalPlaces(stepVal),
		v.check((input) => input !== 0, message),
		v.metadata({
			slc_required: true
		})
	);
};
const _NumberRequiredPositiveDecimal = ({
	message = 'Bu alan gereklidir. 0 dan büyük olmalıdır.',
	step = 2
}: { message?: string; step?: number } = {}) => {
	const stepVal = step <= 0 ? 2 : step;
	const minVal = Math.pow(10, -stepVal); // Örn: precision 2 için 10^-2 = 0.01
	return v.pipe(
		base.number,
		base.maxDecimalPlaces(stepVal),
		v.minValue(minVal, message),
		v.metadata({
			slc_required: true
		})
	);
};
const _NumberRequiredNegativeDecimal = ({
	message = 'Bu alan gereklidir. 0 dan küçük olmalıdır.',
	step = 2
}: { message?: string; step?: number } = {}) => {
	const stepVal = step <= 0 ? 2 : step;
	const maxVal = Math.pow(10, -stepVal) * -1; // Örn: precision 2 için 10^-2 = 0.01
	return v.pipe(
		base.number,
		base.maxDecimalPlaces(stepVal),
		v.maxValue(maxVal, message),
		v.metadata({
			slc_required: true
		})
	);
};
// Optional
const _NumberOptionalInteger = () => {
	return v.pipe(
		v.optional(base.integer, 0),
		v.metadata({
			slc_required: false
		})
	);
};
const _NumberOptionalPositiveInteger = () => {
	return v.pipe(
		v.optional(v.pipe(base.integer, v.minValue(0, 'Değer 0 veya daha büyük bir tamsayı olmalıdır.')), 0),
		v.metadata({
			slc_required: false
		})
	);
};
const _NumberOptionalNegativeInteger = () => {
	return v.pipe(
		v.optional(v.pipe(base.integer, v.maxValue(0, 'Değer 0 veya daha küçük bir tamsayı olmalıdır.')), 0),
		v.metadata({
			slc_required: false
		})
	);
};
const _NumberOptionalDecimal = ({ step = 2 }: { step?: number } = {}) => {
	const stepVal = step <= 0 ? 2 : step;
	return v.pipe(
		v.optional(v.pipe(base.number, base.maxDecimalPlaces(stepVal)), 0),
		v.metadata({
			slc_required: false
		})
	);
};
const _NumberOptionalPositiveDecimal = ({ step = 2 }: { step?: number } = {}) => {
	const stepVal = step <= 0 ? 2 : step;
	return v.pipe(
		v.optional(
			v.pipe(base.number, base.maxDecimalPlaces(stepVal), v.minValue(0, 'Sayısal değer 0 veya daha büyük olmalıdır.')),
			0
		),
		v.metadata({
			slc_required: false
		})
	);
};
const _NumberOptionalNegativeDecimal = ({ step = 2 }: { step?: number } = {}) => {
	const stepVal = step <= 0 ? 2 : step;
	return v.pipe(
		v.optional(
			v.pipe(base.number, base.maxDecimalPlaces(stepVal), v.maxValue(0, 'Sayısal değer 0 veya daha küçük olmalıdır.')),
			0
		),
		v.metadata({
			slc_required: false
		})
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
