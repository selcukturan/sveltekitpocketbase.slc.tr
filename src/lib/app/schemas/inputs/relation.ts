import * as v from 'valibot';
import { errorKeys, inputMeta } from './meta';
import type { Collections } from '#lib/types/pocketbase-types.js';

// PocketBase "Relation" alanı: required, collection, (multiple) min select, max select
// - collection: UI kayıt seçicisi bu koleksiyondan arar
// - minSelect/maxSelect: boş değer için atlanır; boşluk yalnızca `required` ile kontrol edilir
type RelationOptions<Multiple extends boolean> = {
	collection: `${Collections}`;
	required?: boolean;
	multiple?: Multiple;
	minSelect?: number;
	maxSelect?: number;
	message?: string;
};

const _RelationSingle = ({ collection, required = true, message = errorKeys.required }: RelationOptions<false>) =>
	v.pipe(
		v.optional(v.string(), ''),
		v.check((input) => !required || input !== '', message),
		inputMeta({ required, multiple: false, collection })
	);

const _RelationMultiple = ({ collection, required = true, minSelect, maxSelect, message = errorKeys.required }: RelationOptions<true>) =>
	v.pipe(
		v.optional(v.array(v.string()), []),
		v.check((input) => !required || input.length > 0, message),
		v.check((input) => input.length === 0 || minSelect === undefined || input.length >= minSelect, errorKeys.minSelect),
		v.check((input) => maxSelect === undefined || input.length <= maxSelect, errorKeys.maxSelect),
		inputMeta({ required, multiple: true, collection, minSelect, maxSelect })
	);

type RelationChoice<Multiple extends boolean> = Multiple extends true ? ReturnType<typeof _RelationMultiple> : ReturnType<typeof _RelationSingle>;

export function Relation<Key extends string, Multiple extends boolean = false>(key: Key, options: RelationOptions<Multiple>) {
	const main = options.multiple ? _RelationMultiple(options as RelationOptions<true>) : _RelationSingle(options as RelationOptions<false>);

	return {
		[`${key}`]: main
	} as { [P in Key]: RelationChoice<Multiple> };
}
