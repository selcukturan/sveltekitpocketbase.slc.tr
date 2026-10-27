import * as v from 'valibot';
import { errorKeys, inputMeta } from './meta';

// PocketBase "File" alanı: required, (multiple) max select, max size, allowed mime types
//
// Her dosya alanı üç form anahtarına dağılır:
// - `key`       : silinmeden kalan + yeni eklenen dosya adları. Zorunluluk ve maxSelect burada kontrol edilir.
//                 PocketBase'e gönderilmez (transform → undefined).
// - `key_Plus`  : yeni seçilen File nesneleri. Boyut, mime türü ve adet burada kontrol edilir. PocketBase'e `key+` olarak gider.
// - `key_Minus` : silinecek kayıtlı dosya adları. PocketBase'e `key-` olarak gider.
//
// `key` listesini istemci gönderdiği için sunucuda kesin kontrol PocketBase'dedir (toplam adet, zorunluluk).
type FileOptions<Multiple extends boolean> = {
	required?: boolean;
	multiple?: Multiple;
	maxSelect?: number; // yalnızca multiple
	maxSize?: number; // bayt, dosya başına
	mimeTypes?: string[]; // örn: ['image/png', 'image/jpeg']
	message?: string;
};

// Seçilmemiş dosya inputu boş bir File (ad '' ve boyut 0) gönderebilir
const isEmptyFile = (file: File) => file.name === '' && file.size === 0;

const _File = ({ maxSize, mimeTypes = [] }: FileOptions<boolean>) =>
	v.pipe(
		v.file(),
		v.check((file) => isEmptyFile(file) || maxSize === undefined || file.size <= maxSize, errorKeys.maxSize),
		v.check((file) => isEmptyFile(file) || mimeTypes.length === 0 || mimeTypes.includes(file.type), errorKeys.mimeType)
	);

// #### SINGLE
const _SingleFile = ({ required = true, maxSize, mimeTypes = [], message = errorKeys.required }: FileOptions<false>) => ({
	main: v.pipe(
		v.optional(v.string(), ''),
		v.check((input) => !required || input !== '', message),
		inputMeta({ required, multiple: false, maxSize, mimeTypes }),
		v.transform(() => undefined)
	),
	plus: v.pipe(
		v.optional(_File({ maxSize, mimeTypes })),
		v.transform((file) => (file && !isEmptyFile(file) ? file : undefined))
	),
	minus: v.pipe(
		v.optional(v.string(), ''),
		v.transform((name) => (name !== '' ? name : undefined))
	)
});

// #### MULTIPLE
const _MultipleFile = ({ required = true, maxSelect, maxSize, mimeTypes = [], message = errorKeys.required }: FileOptions<true>) => ({
	main: v.pipe(
		v.optional(v.array(v.string()), []),
		v.check((input) => !required || input.length > 0, message),
		v.check((input) => maxSelect === undefined || input.length <= maxSelect, errorKeys.maxSelect),
		inputMeta({ required, multiple: true, maxSelect, maxSize, mimeTypes }),
		v.transform(() => undefined)
	),
	plus: v.pipe(
		v.optional(v.array(_File({ maxSize, mimeTypes })), []),
		v.check((files) => maxSelect === undefined || files.length <= maxSelect, errorKeys.maxSelect),
		v.transform((files) => {
			const nonEmpty = files.filter((file) => !isEmptyFile(file));
			return nonEmpty.length > 0 ? nonEmpty : undefined;
		})
	),
	minus: v.pipe(
		v.optional(v.array(v.string()), []),
		v.transform((names) => (names.length > 0 ? names : undefined))
	)
});

type SingleFile = ReturnType<typeof _SingleFile>;
type MultipleFile = ReturnType<typeof _MultipleFile>;
type FileChoice<Multiple extends boolean> = Multiple extends true ? MultipleFile : SingleFile;

export function File<Key extends string, Multiple extends boolean = false>(key: Key, options: FileOptions<Multiple> = {}) {
	const { main, plus, minus } = options.multiple ? _MultipleFile(options as FileOptions<true>) : _SingleFile(options as FileOptions<false>);

	return {
		[`${key}`]: main,
		[`${key}_Plus`]: plus,
		[`${key}_Minus`]: minus
	} as { [P in Key]: FileChoice<Multiple>['main'] } & { [P in `${Key}_Plus`]: FileChoice<Multiple>['plus'] } & {
		[P in `${Key}_Minus`]: FileChoice<Multiple>['minus'];
	};
}
