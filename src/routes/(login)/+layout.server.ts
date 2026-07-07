import { redirect } from '@sveltejs/kit';

export async function load({ locals }) {
	console.log(new Date().getTime() + ' routes - (login) +layout.server.ts');
	if (locals.user?.id) {
		throw redirect(302, '/app');
	}
	return {};
}
