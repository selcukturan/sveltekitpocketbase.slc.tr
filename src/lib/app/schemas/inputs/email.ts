import * as v from 'valibot';
import { domainAllowed, errorKeys, inputMeta } from './meta';
import * as base from '../base';

// PocketBase "Email" alanı: required, except domains, only domains (max: varsayılan 255 karakter)
type EmailOptions = { required?: boolean; max?: number; exceptDomains?: string[]; onlyDomains?: string[]; message?: string };

const _Email = ({ required = true, max = 255, exceptDomains = [], onlyDomains = [], message = errorKeys.required }: EmailOptions = {}) =>
	v.pipe(
		v.optional(base.email, ''),
		v.check((input) => !required || input !== '', message),
		v.check((input) => !input.includes('@') || domainAllowed(input.split('@').pop() ?? '', { exceptDomains, onlyDomains }), errorKeys.domain), // biçim hatası varsa yalnızca o gösterilir
		v.maxLength(max, errorKeys.maxLength),
		inputMeta({ required, max, exceptDomains, onlyDomains })
	);

export function Email<Key extends string>(key: Key, options: EmailOptions = {}) {
	return {
		[`${key}`]: _Email(options)
	} as { [P in Key]: ReturnType<typeof _Email> };
}
