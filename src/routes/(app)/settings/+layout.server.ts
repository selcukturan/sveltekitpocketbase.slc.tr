import type { LayoutServerLoad } from './$types';

export const load = (async () => {
	return {
		user: 'locals.user'
	};
}) satisfies LayoutServerLoad;
