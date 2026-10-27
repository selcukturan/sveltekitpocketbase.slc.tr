import * as v from 'valibot';
import { errorKeys, inputMeta } from './meta';
import * as base from '../base';
import { parseDateInputToIso } from '#lib/utils/input-helper.js';

// PocketBase "DateTime" alanı (yalnızca tarih): required, min date, max date
// - min/max input biçiminde verilir: 'YYYY-MM-DD' (UI min/max özniteliği ve hata mesajı da bunu kullanır)
// - karşılaştırma ISO biçiminde ('YYYY-MM-DD HH:mm:ss.sssZ') metin olarak yapılır
type DateOptions = { required?: boolean; min?: string; max?: string; message?: string };

const _Date = ({ required = true, min, max, message = errorKeys.required }: DateOptions = {}) => {
	const minIso = min ? parseDateInputToIso(min) : '';
	const maxIso = max ? parseDateInputToIso(max) : '';
	return v.pipe(
		v.optional(base.date, ''),
		v.check((input) => !required || input !== '', message),
		v.check((input) => input === '' || !minIso || input >= minIso, errorKeys.minDate),
		v.check((input) => input === '' || !maxIso || input <= maxIso, errorKeys.maxDate),
		inputMeta({ required, minDate: min, maxDate: max })
	);
};

export function Date<Key extends string>(key: Key, options: DateOptions = {}) {
	return {
		[`${key}`]: _Date(options)
	} as { [P in Key]: ReturnType<typeof _Date> };
}
