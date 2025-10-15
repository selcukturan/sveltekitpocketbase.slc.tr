import type { Actions } from './$types';
import { Collections } from '$lib/types/pocketbase-types';
import { fail, redirect } from '@sveltejs/kit';
import { ResultAsync } from 'neverthrow';
import { handleError, mapUnknownToError } from '$lib/server/error.service';

// const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const actions: Actions = {
	default: async ({ locals, request }) => {
		// await sleep(1000);
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		if (!email || !password) {
			return fail(400, { email, error: 'E-posta ve şifre alanları zorunludur.' });
		}

		const loginResult = await ResultAsync.fromPromise(
			locals.pb.collection(Collections.SysUsers).authWithPassword(email, password),
			mapUnknownToError
		);

		return loginResult.match(
			/*Ok*/ () => redirect(303, '/'),
			/*Err*/ (error) => handleError(error, { email })
		);
	}
};
