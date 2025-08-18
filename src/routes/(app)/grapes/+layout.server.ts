import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	console.log('+layout.server.ts - (grapes)');
	return {
		user: locals.auth.user
	};
};
