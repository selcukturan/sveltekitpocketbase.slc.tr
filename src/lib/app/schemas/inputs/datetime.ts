import * as v from 'valibot';
import { errorKeys, inputMeta } from './meta';
import * as base from '../base';
import { parseDatetimeInputToIso } from '#lib/utils/input-helper.js';

// PocketBase "DateTime" alanı: required, min date, max date
// - min/max input biçiminde verilir: 'YYYY-MM-DDTHH:mm' (UI min/max özniteliği ve hata mesajı da bunu kullanır)
// - karşılaştırma ISO biçiminde ('YYYY-MM-DD HH:mm:ss.sssZ') metin olarak yapılır
type DatetimeOptions = { required?: boolean; min?: string; max?: string; message?: string };

const _Datetime = ({ required = true, min, max, message = errorKeys.required }: DatetimeOptions = {}) => {
	const minIso = min ? parseDatetimeInputToIso(min) : '';
	const maxIso = max ? parseDatetimeInputToIso(max) : '';
	return v.pipe(
		v.optional(base.datetime, ''),
		v.check((input) => !required || input !== '', message),
		v.check((input) => input === '' || !minIso || input >= minIso, errorKeys.minDate),
		v.check((input) => input === '' || !maxIso || input <= maxIso, errorKeys.maxDate),
		inputMeta({ required, minDate: min, maxDate: max })
	);
};

export function Datetime<Key extends string>(key: Key, options: DatetimeOptions = {}) {
	return {
		[`${key}`]: _Datetime(options)
	} as { [P in Key]: ReturnType<typeof _Datetime> };
}
