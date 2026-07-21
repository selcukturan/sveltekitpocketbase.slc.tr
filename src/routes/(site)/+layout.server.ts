import { redirect } from '@sveltejs/kit';

export async function load() {
	console.log(new Date().getTime() + ' routes - (site) +layout.server.ts');

	throw redirect(302, '/login');

	// return {};
}
