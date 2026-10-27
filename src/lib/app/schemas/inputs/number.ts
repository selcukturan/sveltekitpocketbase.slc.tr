import * as v from 'valibot';
import { errorKeys, inputMeta } from './meta';
import * as base from '../base';

// PocketBase "Number" alanı: required, min, max, no decimals (onlyInt)
// - required: 0 olamaz (PocketBase'de zorunlu sayı = sıfırdan farklı)
// - min/max/onlyInt/decimals: 0 (boş) değer için atlanır
// - decimals: PocketBase'de yok; en fazla ondalık basamak (UI step değeri de buradan gelir)
type NumberOptions = { required?: boolean; min?: number; max?: number; onlyInt?: boolean; decimals?: number; message?: string };

const decimalPlaces = (input: number) => (String(input).split('.')[1] ?? '').length;

const _Number = ({ required = true, min, max, onlyInt = false, decimals, message = errorKeys.required }: NumberOptions = {}) =>
	v.pipe(
		v.optional(base.number, 0),
		v.check((input) => !required || input !== 0, message),
		v.check((input) => input === 0 || min === undefined || input >= min, errorKeys.minValue),
		v.check((input) => input === 0 || max === undefined || input <= max, errorKeys.maxValue),
		v.check((input) => !onlyInt || Math.trunc(input) === input, errorKeys.onlyInt),
		v.check((input) => onlyInt || decimals === undefined || decimalPlaces(input) <= decimals, errorKeys.decimals),
		inputMeta({ required, min, max, onlyInt, decimals })
	);

export function Number<Key extends string>(key: Key, options: NumberOptions = {}) {
	return {
		[`${key}`]: _Number(options)
	} as { [P in Key]: ReturnType<typeof _Number> };
}
