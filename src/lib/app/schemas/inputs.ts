import * as v from 'valibot';
import * as base from './base';

export const selectRequiredSingle = ({
	options = [],
	message = 'Bu alan gereklidir.'
}: {
	options: string[];
	message?: string;
}) => {
	return v.pipe(v.optional(v.picklist([...options, '']), ''), v.nonEmpty(message));
};
export const selectOptionalSingle = ({ options = [] }: { options: string[] }) => {
	return v.optional(v.picklist([...options, '']), '');
};
export const selectRequiredMultiple = ({ options = [], minLength = 1 }: { options: string[]; minLength?: number }) => {
	const minLengthValue = minLength <= 0 ? 1 : minLength;
	return v.pipe(
		v.optional(v.array(v.picklist(options)), []),
		v.minLength(minLengthValue, 'Bu alan en az ' + minLengthValue + ' değer içermelidir.')
	);
};
export const selectOptionalMultiple = ({ options = [] }: { options: string[] }) => {
	return v.optional(v.array(v.picklist(options)), []);
};
export const numberRequiredInteger = ({ message = 'Bu alan gereklidir. Tamsayı olmalıdır.' }: { message?: string } = {}) => {
	return v.pipe(
		v.optional(base.integer, 0),
		v.check((input) => input !== 0, message)
	);
};
export const numberOptionalInteger = () => {
	return v.optional(base.integer, 0);
};
export const numberRequiredPositiveInteger = ({
	message = 'Bu alan gereklidir. Pozitif tamsayı olmalıdır.'
}: { message?: string } = {}) => {
	return v.pipe(v.optional(base.integer, 0), v.minValue(1, message));
};
export const numberOptionalPositiveInteger = () => {
	return v.optional(v.pipe(base.integer, v.minValue(0, 'Değer 0 veya daha büyük bir tamsayı olmalıdır.')), 0);
};
export const numberRequiredNegativeInteger = ({
	message = 'Bu alan gereklidir. Negatif tamsayı olmalıdır.'
}: { message?: string } = {}) => {
	return v.pipe(v.optional(base.integer, 0), v.maxValue(-1, message));
};
export const numberOptionalNegativeInteger = () => {
	return v.optional(v.pipe(base.integer, v.maxValue(0, 'Değer 0 veya daha küçük bir tamsayı olmalıdır.')), 0);
};

export const datetimeRequired = ({ message = 'Geçerli bir tarih ve saat giriniz.' }: { message?: string } = {}) => {
	return v.pipe(base.datetime, v.nonEmpty(message));
};
export const datetimeOptional = () => {
	return v.optional(base.datetime, '');
};
export const dateRequired = ({ message = 'Geçerli bir tarih giriniz.' }: { message?: string } = {}) => {
	return v.pipe(base.date, v.nonEmpty(message));
};
export const dateOptional = () => {
	return v.optional(base.date, '');
};
export const textRequired = ({ message = 'Bu alan gereklidir.' }: { message?: string } = {}) => {
	return v.pipe(base.text, v.nonEmpty(message));
};
export const textOptional = () => {
	return v.optional(base.text, '');
};
export const hiddenRequired = ({ message = 'Bu alan gereklidir.' }: { message?: string } = {}) => {
	return v.pipe(base.text, v.nonEmpty(message));
};
export const hiddenIdRequired = ({ message = 'Bu alan gereklidir.' }: { message?: string } = {}) => {
	return v.pipe(base.id, v.nonEmpty(message));
};
export const numberRequiredDecimal = ({
	message = 'Bu alan gereklidir.',
	step = 2
}: { message?: string; step?: number } = {}) => {
	const stepVal = step <= 0 ? 2 : step;
	return v.pipe(
		v.optional(v.pipe(base.number, base.maxDecimalPlaces(stepVal)), 0),
		v.check((input) => input !== 0, message)
	);
};
export const numberOptionalDecimal = ({ step = 2 }: { step?: number } = {}) => {
	const stepVal = step <= 0 ? 2 : step;
	return v.optional(v.pipe(base.number, base.maxDecimalPlaces(stepVal)), 0);
};
export const numberRequiredPositiveDecimal = ({
	message = 'Bu alan gereklidir. 0 dan büyük olmalıdır.',
	step = 2
}: { message?: string; step?: number } = {}) => {
	const stepVal = step <= 0 ? 2 : step;
	const minVal = Math.pow(10, -stepVal); // Örn: precision 2 için 10^-2 = 0.01
	return v.pipe(v.optional(v.pipe(base.number, base.maxDecimalPlaces(stepVal)), 0), v.minValue(minVal, message));
};
export const numberOptionalPositiveDecimal = ({ step = 2 }: { step?: number } = {}) => {
	const stepVal = step <= 0 ? 2 : step;
	return v.optional(
		v.pipe(v.pipe(base.number, base.maxDecimalPlaces(stepVal)), v.minValue(0, 'Sayısal değer 0 veya daha büyük olmalıdır.')),
		0
	);
};
export const numberRequiredNegativeDecimal = ({
	message = 'Bu alan gereklidir. 0 dan küçük olmalıdır.',
	step = 2
}: { message?: string; step?: number } = {}) => {
	const stepVal = step <= 0 ? 2 : step;
	const maxVal = Math.pow(10, -stepVal) * -1; // Örn: precision 2 için 10^-2 = 0.01
	return v.pipe(v.optional(v.pipe(base.number, base.maxDecimalPlaces(stepVal)), 0), v.maxValue(maxVal, message));
};
export const numberOptionalNegativeDecimal = ({ step = 2 }: { step?: number } = {}) => {
	const stepVal = step <= 0 ? 2 : step;
	return v.optional(
		v.pipe(v.pipe(base.number, base.maxDecimalPlaces(stepVal)), v.maxValue(0, 'Sayısal değer 0 veya daha küçük olmalıdır.')),
		0
	);
};
