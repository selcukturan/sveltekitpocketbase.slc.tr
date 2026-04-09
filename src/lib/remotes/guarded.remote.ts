import * as v from 'valibot';
import { error, fail } from '@sveltejs/kit';
import { Collections } from '$lib/types/pocketbase-types';
import { ResultAsync } from 'neverthrow';
import { mapUnknownToError } from '$lib/server/error';
import { getRequestEvent, query, form } from '$app/server';
import { redirect } from '@sveltejs/kit';
import { resolve } from '$app/paths';

// const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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
		throw redirect(302, resolve('/login'));
	}
});

export const logout = form(() => {
	const { locals } = getRequestEvent();
	locals.auth.clear();
	throw redirect(302, resolve('/login'));
});

export const login = form(
	v.object({
		email: v.pipe(v.string(), v.email(), v.nonEmpty()),
		_password: v.pipe(v.string(), v.nonEmpty())
	}),
	async ({ email, _password }) => {
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
		throw redirect(302, resolve('/'));
		// return {};
	}
);

// FAIL: return fail(400, { success: false, email, message: 'E-posta ve şifre alanları zorunludur.' });
// ERROR: return error(500, { type: 'general', errorId: 'general', message: 'Hata oluştu' });
// REDIRECT: return redirect(303, '/');
// SUCCESS: return {};
