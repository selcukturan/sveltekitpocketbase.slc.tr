import { getRequestEvent, query, form, requested } from '$app/server';
import { error, redirect } from '@sveltejs/kit';
import { mapUnknownToError } from '$lib/server/error';
import { Collections } from '$lib/types/pocketbase-types';
import { ResultAsync } from 'neverthrow';
import { loginSchema } from '$lib/app/schemas/login';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Client side get user
export const getUser = query(() => {
	const { locals } = getRequestEvent();

	if (!locals.user?.id) {
		return null;
	}

	return locals.user;
});

// Server side remote function check authenticated
export const checkAuthenticated = query(() => {
	const { locals } = getRequestEvent();
	if (!locals.user) {
		// error(401, 'Unauthorized');
		throw redirect(307, '/login?unauthorized');
	}
});

export const logout = form(async () => {
	const { locals } = getRequestEvent();

	locals.auth.clear();
	locals.user = null;

	await requested(getUser, 1).refreshAll();

	throw redirect(307, '/');
	// return { success: true };
});

export const login = form(loginSchema, async ({ email, _password }) => {
	const { locals } = getRequestEvent();

	const loginResult = await ResultAsync.fromPromise(locals.pb.collection(Collections.SysUsers).authWithPassword(email, _password), mapUnknownToError);

	if (loginResult.isErr()) {
		return error(500, { type: 'pb', errorId: 'login-error', message: loginResult.error.message });
	}

	locals.user = structuredClone(locals.auth.record);

	await requested(getUser, 1).refreshAll();

	throw redirect(307, '/');
	// return { success: true };
});
