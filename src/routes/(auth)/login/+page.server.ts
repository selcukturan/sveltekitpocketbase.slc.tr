import type { Actions, PageServerLoad } from './$types';
import { ClientResponseError } from 'pocketbase';

import { redirect, fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	return {
		user: locals.auth.user
	};
};

export const actions: Actions = {
	default: async ({ locals, request }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		if (!email || !password) {
			return fail(400, { email, missing: true });
		}

		try {
			await locals.auth.pb.collection('acl_users').authWithPassword(email, password);
			redirect(303, '/');
		} catch (err) {
			if (err instanceof ClientResponseError) {
				locals.auth.clear();
				locals.auth.error(err);
			}
			redirect(303, '/login');
		}
	}
};
