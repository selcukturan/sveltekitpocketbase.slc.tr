import { redirect } from '@sveltejs/kit';

export async function load({ locals }) {
	console.log(new Date().getTime() + ' routes - (app) layout.server.ts');

	if (!locals.user?.id) {
		console.log(new Date().getTime() + ' routes - (app) layout.server.ts - redirect');
		throw redirect(302, '/login');
	}

	return {};
}
