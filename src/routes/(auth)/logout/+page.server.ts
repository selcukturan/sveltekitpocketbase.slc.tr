import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	default: ({ locals }) => {
		locals.auth.clear();
		redirect(303, '/login');
	}
};
