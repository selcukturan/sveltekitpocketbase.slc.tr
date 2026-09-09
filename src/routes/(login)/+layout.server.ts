import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	console.log(new Date().getTime() + ' routes - (login) +layout.server.ts');
	if (locals.user?.id) {
		throw redirect(302, '/app');
	}
	return {};
};
