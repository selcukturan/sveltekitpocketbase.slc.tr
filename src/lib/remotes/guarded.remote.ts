import { resolve } from '$app/paths';
import { error, redirect } from '@sveltejs/kit';
import { Collections } from '$lib/types/pocketbase-types';
import { ResultAsync } from 'neverthrow';
import { mapUnknownToError } from '$lib/server/error';
import { getRequestEvent, query, form } from '$app/server';
import { loginSchema } from '$lib/app/schemas/login';

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
		throw redirect(302, resolve('/login'));
	}
});

export const logout = form(() => {
	const { locals } = getRequestEvent();
	locals.auth.clear();
	// SUCCESS
	throw redirect(303, resolve('/login'));
});

export const login = form(loginSchema, async ({ email, _password }) => {
	const { locals } = getRequestEvent();

	const loginResult = await ResultAsync.fromPromise(
		locals.pb.collection(Collections.SysUsers).authWithPassword(email, _password),
		mapUnknownToError
	);

	// ERROR
	if (loginResult.isErr()) {
		return error(500, { type: 'pb', errorId: 'login-error', message: loginResult.error.message });
	}

	// SUCCESS
	throw redirect(303, resolve('/'));
});
