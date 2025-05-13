import type { Actions } from './$types';
import { ClientResponseError, type RecordAuthResponse } from 'pocketbase';
import { Collections, type UsersResponse } from '$lib/client/types/pocketbase-types';
import { fail, redirect } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({ locals, request }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		if (!email || !password) {
			return fail(400, { email, missing: true });
		}

		let authData: RecordAuthResponse<UsersResponse> | null = null;

		try {
			authData = await locals.auth.pb.collection(Collections.Users).authWithPassword<UsersResponse>(email, password);
		} catch (err) {
			if (err instanceof ClientResponseError) {
				locals.auth.clear();
				locals.auth.error(err);
			}
		}

		if (authData !== null) {
			redirect(303, '/');
		} else {
			redirect(303, '/login');
		}
	}
};
