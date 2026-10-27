import * as v from 'valibot';
import { errorKeys, inputMeta } from './meta';
import * as base from '../base';

// PocketBase "Rich editor" alanı: required, max size (bayt)
// - maxSize karakter değil bayt sayar (Türkçe karakterler 2 bayttır)
type TextareaOptions = { required?: boolean; maxSize?: number; message?: string };

const byteLength = (input: string) => new TextEncoder().encode(input).length;

const _Textarea = ({ required = true, maxSize = 1024, message = errorKeys.required }: TextareaOptions = {}) =>
	v.pipe(
		v.optional(base.textarea, ''),
		v.check((input) => !required || input !== '', message),
		v.check((input) => byteLength(input) <= maxSize, errorKeys.maxSize),
		inputMeta({ required, maxSize })
	);

export function Textarea<Key extends string>(key: Key, options: TextareaOptions = {}) {
	return {
		[`${key}`]: _Textarea(options)
	} as { [P in Key]: ReturnType<typeof _Textarea> };
}
