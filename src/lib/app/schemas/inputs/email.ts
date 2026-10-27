import * as v from 'valibot';
import { domainAllowed, errorKeys, inputMeta } from './meta';
import * as base from '../base';

// PocketBase "Email" alanı: required, except domains, only domains
type EmailOptions = { required?: boolean; exceptDomains?: string[]; onlyDomains?: string[]; message?: string };

const _Email = ({ required = true, exceptDomains = [], onlyDomains = [], message = errorKeys.required }: EmailOptions = {}) =>
	v.pipe(
		v.optional(base.email, ''),
		v.check((input) => !required || input !== '', message),
		v.check((input) => !input.includes('@') || domainAllowed(input.split('@').pop() ?? '', { exceptDomains, onlyDomains }), errorKeys.domain), // biçim hatası varsa yalnızca o gösterilir
		inputMeta({ required, exceptDomains, onlyDomains })
	);

export function Email<Key extends string>(key: Key, options: EmailOptions = {}) {
	return {
		[`${key}`]: _Email(options)
	} as { [P in Key]: ReturnType<typeof _Email> };
}
