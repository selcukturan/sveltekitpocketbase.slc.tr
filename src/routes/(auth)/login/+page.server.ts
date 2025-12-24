import type { Actions } from './$types';
import { Collections } from '$lib/types/pocketbase-types';
import { error, fail } from '@sveltejs/kit';
import { ResultAsync } from 'neverthrow';
import { mapUnknownToError } from '$lib/server/error';
import * as v from 'valibot';

// const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// FAIL: return fail(400, { success: false, email, message: 'E-posta ve şifre alanları zorunludur.' });
// ERROR: return error(500, { type: 'general', errorId: 'general', message: 'Hata oluştu' });
// REDIRECT: return redirect(303, '/');
// SUCCESS: return { success: true };
export const actions: Actions = {
	login: async ({ locals, request }) => {
		const schema = v.object({
			email: v.pipe(v.string(), v.email(), v.nonEmpty()),
			password: v.pipe(v.string(), v.nonEmpty())
		});

		const formData = await request.formData();

		const email = formData.get('email');
		const password = formData.get('password');

		const result = v.safeParse(schema, { email, password });

		// FAIL
		if (!result.success) {
			return fail(400, { message: 'Formu düzeltin', issues: result.issues });
		}

		const loginResult = await ResultAsync.fromPromise(
			locals.pb.collection(Collections.SysUsers).authWithPassword(result.output.email, result.output.password),
			mapUnknownToError
		);

		// ERROR
		if (loginResult.isErr()) {
			return error(500, { type: 'pb', errorId: 'login-error', message: loginResult.error.message });
		}

		// SUCCESS
		return { success: true };
	}
};
