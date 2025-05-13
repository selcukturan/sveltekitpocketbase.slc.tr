import type { Actions } from './$types';
import { ClientResponseError } from 'pocketbase';
import { Collections, type UsersResponse } from '$lib/client/types/pocketbase-types';
import { redirect, fail } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({ locals, request }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		if (!email || !password) {
			return fail(400, { email, missing: true });
		}

		try {
			await locals.auth.pb.collection(Collections.Users).authWithPassword<UsersResponse>(email, password);
			throw redirect(303, '/');
		} catch (err) {
			if (err instanceof ClientResponseError) {
				locals.auth.clear();
				locals.auth.error(err);
			}
			throw redirect(303, '/login');
		}
	}
};
