import type { Actions } from './$types';
import { ClientResponseError, type RecordAuthResponse } from 'pocketbase';
import { Collections, type SysUsersResponse } from '$lib/client/types/pocketbase-types';
import { fail, redirect } from '@sveltejs/kit';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const actions: Actions = {
	default: async ({ locals, request }) => {
		await sleep(1000);
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		if (!email || !password) {
			return fail(400, { email, missing: true });
		}

		let authData: RecordAuthResponse<SysUsersResponse> | null = null;

		try {
			authData = await locals.pb.collection(Collections.SysUsers).authWithPassword<SysUsersResponse>(email, password);
		} catch (err) {
			if (err instanceof ClientResponseError) {
				locals.auth.error(err);
				locals.auth.clear();
			}
		}

		if (authData != null) {
			redirect(303, '/');
		} else {
			redirect(303, '/login');
		}
	}
};
