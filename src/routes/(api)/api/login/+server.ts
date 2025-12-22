import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

import { ResultAsync } from 'neverthrow';
import { throwError, mapUnknownToError } from '$lib/server/error';
import { Collections } from '$lib/types/pocketbase-types';

// Create       (crud) - /api/collections/crud/records
export const POST: RequestHandler = async ({ request, locals }) => {
	// await sleep(1000);
	const { email, password } = await request.json();

	// console.log(email);

	if (!email || !password) {
		return json({ type: 'error', message: 'E-posta ve şifre alanları zorunludur.' });
	}

	const loginResult = await ResultAsync.fromPromise(
		locals.pb.collection(Collections.SysUsers).authWithPassword(email, password),
		mapUnknownToError
	);

	if (loginResult.isErr()) {
		return json({ type: 'error', message: 'loginResult.error' });
	}

	return json({ type: 'success', message: 'Giriş yapıldı.' });
};
