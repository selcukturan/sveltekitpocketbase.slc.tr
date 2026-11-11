import * as v from 'valibot';
import { domainAllowed, errorKeys, inputMeta } from './meta';
import * as base from '../base';

// PocketBase "URL" alanı: required, except domains, only domains (max: varsayılan 255 karakter)
type UrlOptions = { required?: boolean; max?: number; exceptDomains?: string[]; onlyDomains?: string[]; message?: string };

const hostname = (input: string) => {
	try {
		return new URL(input).hostname;
	} catch {
		return '';
	}
};

const _Url = ({ required = true, max = 255, exceptDomains = [], onlyDomains = [], message = errorKeys.required }: UrlOptions = {}) =>
	v.pipe(
		v.optional(base.url, ''),
		v.check((input) => !required || input !== '', message),
		v.check((input) => hostname(input) === '' || domainAllowed(hostname(input), { exceptDomains, onlyDomains }), errorKeys.domain), // biçim hatası varsa yalnızca o gösterilir
		v.maxLength(max, errorKeys.maxLength),
		inputMeta({ required, max, exceptDomains, onlyDomains })
	);

export function Url<Key extends string>(key: Key, options: UrlOptions = {}) {
	return {
		[`${key}`]: _Url(options)
	} as { [P in Key]: ReturnType<typeof _Url> };
}
