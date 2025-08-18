import type { LayoutServerLoad } from './$types';

export const load = (async () => {
	console.log('+layout.server.ts - (settings)');
	return {
		user: 'locals.user'
	};
}) satisfies LayoutServerLoad;
