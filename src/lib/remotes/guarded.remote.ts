import { getRequestEvent, query } from '$app/server';
import { redirect } from '@sveltejs/kit';
import { resolve } from '$app/paths';

// const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getUser = query(() => {
	const { locals } = getRequestEvent();
	if (!locals.user) {
		redirect(307, resolve('/login'));
	}
	return locals.user;
});

export const checkAuthenticated = query(() => {
	const { locals } = getRequestEvent();
	if (!locals.user) {
		redirect(307, resolve('/login'));
	}
});
