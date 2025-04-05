import type { PageServerLoad } from './$types';

export const load = (async () => {
	return {
		user: 'locals.user'
	};
}) satisfies PageServerLoad;
