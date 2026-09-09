import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	console.log(new Date().getTime() + ' routes - (app) layout.server.ts');

	if (!locals.user?.id) {
		console.log(new Date().getTime() + ' routes - (app) layout.server.ts - redirect');
		throw redirect(302, '/login');
	}

	return {};
};
