import { redirect } from '@sveltejs/kit';
import { resolve } from '$app/paths';

export async function load({ locals }) {
	if (!locals.user?.id) {
		throw redirect(302, resolve('/login'));
	}
	return {
		user: locals.user
	};
}
